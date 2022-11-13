"use strict";

const AWS = require("aws-sdk");
const sharp = require("sharp");

const IMAGES_TABLE = process.env.IMAGES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const param = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: event.Records[0].s3.object.key,
  };

  const s3 = new AWS.S3();

  try {
    const image = await s3.getObject(param).promise();

    const dimensions = await sharp(image.Body).metadata();

    const metadata = {
      id: "image",
      size: event.Records[0].s3.object.size,
      width: dimensions.width,
      height: dimensions.height,
      link:
        "https://" +
        event.Records[0].s3.bucket.name +
        ".s3.amazonaws.com/" +
        event.Records[0].s3.object.key,
      filename: event.Records[0].s3.object.key,
      arn: 'arn:aws:s3:::'
            + event.Records[0].s3.bucket.name
            + '/'
            + event.Records[0].s3.object.key,
      extension:
        event.Records[0].s3.object.key.split(".")[
          event.Records[0].s3.object.key.split(".").length - 1
        ],
    };

    await dynamoDbClient
      .put({
        TableName: IMAGES_TABLE,
        Item: metadata,
      })
      .promise();

    const response = {
      statusCode: 200,
      body: metadata,
    };

    return response;
  } catch (error) {
    console.log("Error: " + error.message);
    return { error: error.message };
  }
};
