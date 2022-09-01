"use strict"

const AWS = require("aws-sdk")
const { sendResponse } = require("../../utils");

const getEmployees = async (event) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const result = await dynamoDb.scan({
            TableName: "EmployeeTable"
        }).promise()

        return sendResponse ( 200, result.Items ?? [])
    } catch ( error ) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}

module.exports = {
    handler: getEmployees
}