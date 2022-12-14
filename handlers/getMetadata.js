const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const IMAGES_TABLE = process.env.IMAGES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());


/**
 * Route to show image metadata when receives an image
 * name as path parameter and returns a JSON with the image 
 * filename, the image size, the image width and the image
 * height. 
 * @name getMetadata
 * @function
 * @memberof handlers
 * @param {string} filename - Path parameter
 * @returns {json} - Returns a JSON with the image filename, the image size, the image width and the image height.
 */
app.get("/GetMetadata/:filename", async function (req, res) {
  const params = {
    TableName: IMAGES_TABLE,
    Key: {
      id: 'image',
      filename: req.params.filename
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { filename, size, width, height } = Item;
      res.status(200).json({ filename, size, width, height });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find image' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.getMetadata = serverless(app);
