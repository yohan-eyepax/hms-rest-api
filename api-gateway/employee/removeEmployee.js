"use strict"

const AWS = require("aws-sdk")
const { sendResponse } = require("../../utils");

const removeEmployee = async (event) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const { id } = event.pathParameters
        const params = {
            TableName: "EmployeeTable",
            Key: { id }
        }
        const result = await dynamoDb.delete(params)
        return sendResponse ( 204, {} )

    } catch ( error ) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}

module.exports = {
    handler: removeEmployee
}