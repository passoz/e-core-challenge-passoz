/**
 * @namespace tools
 */

/**
 * This function receives a DynamoDB table name and
 * returns a query to find the image with bigger size.
 * @name max
 * @function
 * @memberof tools
 * @inner
 * @param {string} table - DynamoDB table name.
 * @returns {json} - Query to find the image with bigger size.
 */
module.exports.max = (table) => { 
    return {
        "TableName": table,
        "ScanIndexForward": false,
        "IndexName": "SizeIndex",
        "KeyConditionExpression": "#id = :id",
        "Limit": "1",
        "ExpressionAttributeValues": {
            ":id": "image"
        },
        "ExpressionAttributeNames": {
            "#id": "id"
        }
    }
}

/**
 * This function receives a DynamoDB table name and
 * returns a query to find the image with smaller size.
 * @name min
 * @function
 * @memberof tools
 * @inner
 * @param {string} table - DynamoDB table name.
 * @returns {json} - Query to find the image with smaller size.
 */
module.exports.min = (table) => { 
    return {
        "TableName": table,
        "ScanIndexForward": true,
        "IndexName": "SizeIndex",
        "KeyConditionExpression": "#id = :id",
        "Limit": "1",
        "ExpressionAttributeValues": {
            ":id": "image"
        },
        "ExpressionAttributeNames": {
            "#id": "id"
        }
    }
}


/**
 * This function receives a DynamoDB table name and an image 
 * file extension and returns a query to count images by extension.
 * @name count
 * @function
 * @memberof tools
 * @param {string} table - DynamoDB table name.
 * @param {string} extension - Image file extension.
 * @returns {json} - Query to count images by extension.
 */
module.exports.count = (table, extension) => {
    return {
        "TableName": table,
        "ScanIndexForward": true,
        "ConsistentRead": false,
        "KeyConditionExpression": "#id = :id",
        "FilterExpression": "#extension = :extension",
        "Select": "COUNT",
        "ExpressionAttributeValues": {
            ":id": "image",
            ":extension": extension
        },
        "ExpressionAttributeNames": {
            "#id": "id",
            "#extension": "extension"
        }
    }
}

