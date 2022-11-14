const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const IMAGES_TABLE = process.env.IMAGES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

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


module.exports.handler = serverless(
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
