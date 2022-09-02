"use strict"

const AWS = require("aws-sdk")
const { sendResponse } = require("../../utils");
const Tables = require("../../constants/tables")

const removeEmployee = async (event) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const { id } = event.pathParameters
        const params = {
            TableName: Tables.employeeTable,
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