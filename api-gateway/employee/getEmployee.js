"use strict"

const AWS = require("aws-sdk")
const { sendResponse } = require("../../utils");
const Tables = require("../../constants/tables")

const getEmployee = async (event) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const { id } = event.pathParameters
        const result = await dynamoDb.get({
            TableName: Tables.employeeTable,
            Key: { id }
        }).promise()

        const employee = result?.Item
        if ( !employee ) return sendResponse ( 400, "Record not found" )
        return sendResponse ( 200, employee )
    } catch ( error ) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}

module.exports = {
    handler: getEmployee
}