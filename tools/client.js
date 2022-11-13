const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
const REGION = "us-east-1"; 
const dynamodbClient = new DynamoDBClient({ region: REGION });

const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");


// const marshallOptions = {
//   convertEmptyValues: false, 
//   removeUndefinedValues: false, 
//   convertClassInstanceToMap: false, 
// };

// const unmarshallOptions = {
//   wrapNumbers: false, 
// };

// const translateConfig = { marshallOptions, unmarshallOptions };

const client = DynamoDBDocumentClient.from(dynamodbClient);

module.exports = client