const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const IMAGES_TABLE = process.env.IMAGES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

/**
 * @namespace handlers
 */

/**
 * Route to proxy an image from S3 bucket when receives an image
 * name as path parameter and returns the image file.
 * @name getImage
 * @function
 * @memberof handlers
 * @param {string} filename - Path parameter
 * @returns {binary} - Returns the image file.
 */
app.get("/GetImage/:filename", async function (req, res) {

  const s3 = new AWS.S3();

  const params = {
    TableName: IMAGES_TABLE,
    Key: {
      id: 'image',
      filename: req.params.filename
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();

    if (Item && req.params.filename) {
      const { extension, arn, filename } = Item;

      const s3Params = {
          Bucket: arn.split('/')[0].split(':')[arn.split('/')[0].split(':').length - 1],
          Key: filename
      }

      res.attachment(filename);

      res.setHeader('Content-Type', 'image/' + extension)

      const imageStream = await s3.getObject( s3Params ).createReadStream();

      imageStream.pipe(res)

    } else {
      res
        .status(404)
        .json({ error: 'Could not find image' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive image" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.getImage = serverless(
  app,
  {
    binary: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/apng',
      'image/webp',
      'image/gif',
      'image/avif'
    ],
  }
);
