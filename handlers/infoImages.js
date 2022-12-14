const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");
const { max, min, count } = require("../tools/queries");
const extensionsArray = require('../tools/extensions.json');

const app = express();

const IMAGES_TABLE = process.env.IMAGES_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

/**
 * Route to show image metadata when receives an image
 * name as path parameter and returns a JSON with the image
 * with smaller size, the image with bigger size, an array with
 * file types 
 * @name infoImages
 * @function 
 * @memberof handlers
 * @param {string} filename - Path parameter
 * @returns {json} - Returns a JSON with the image with smaller size, the image with bigger size, an array with file types 
 */
app.get("/InfoImages", async function (req, res) {

  try {

    let countImages = []
    let extensions = []

    const maxSize = await dynamoDbClient.query(max(IMAGES_TABLE)).promise();
    const minSize = await dynamoDbClient.query(min(IMAGES_TABLE)).promise();

    for (let i = 0; i < extensionsArray.length; i++) {
      const ext = extensionsArray[i];
      const returnedCount = await dynamoDbClient.query(count(IMAGES_TABLE, ext)).promise()
      if(returnedCount.Count > 0){
        countImages.push(
          { 
            extension: ext, 
            quantity : returnedCount.Count
          }
        )
        extensions.push(ext)
      }
    }

    res.status(200).json(
      { 
        maxImageSize: {
          filename: maxSize.Items[0].file, 
          size: maxSize.Items[0].size
        }, 
        minImageSize: {
          filename: minSize.Items[0].file, 
          size: minSize.Items[0].size
        }, 
        extensions, 
        countImages 
      }
    )

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive image informations" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.infoImages = serverless(app);
