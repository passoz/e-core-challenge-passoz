const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/GetImage/:filename", async function (req, res) {

  const s3 = new AWS.S3();

  const params = {
    TableName: USERS_TABLE,
    Key: {
      id: 'image',
      filename: req.params.filename
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();

    if (Item && req.params.filename) {
      const { extension, arn } = Item;

      const image = await s3.getObject( {
        Bucket: arn.split('/')[0].split(':')[arn.split('/')[0].split(':').length - 1],
        Key: filename,
      }).promise();

      res.set('Content-Type', 'image/' + extension)
      res.status(200).sendFile(image);

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


module.exports.handler = serverless(app);
