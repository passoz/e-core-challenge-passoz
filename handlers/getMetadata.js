const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/GetMetadata/:filename", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
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


module.exports.handler = serverless(app);
