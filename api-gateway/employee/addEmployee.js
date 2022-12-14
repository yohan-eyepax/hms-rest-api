"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const { sendResponse } = require("../../utils");
const Tables = require("../../constants/tables")
const { EntityStatus } = require("../../constants/entityStatus");

const addEmployee = async (event) => {
    try {
        const dynamoDb = new AWS.DynamoDB.DocumentClient()
        const { sub } = event.requestContext.authorizer.claims

        const { firstName, lastName, email, mobileNumber } = event.body;
        const createdAt = new Date().toISOString();
        const id = v4();

        const newEmployee = {
            id,
            firstName,
            lastName,
            email,
            mobileNumber,
            createdAt,
            createdBy: sub,
            updatedAt: null,
            updatedBy: null,
            status: EntityStatus.Active
        }

        await dynamoDb.put({
            TableName: Tables.employeeTable,
            Item: newEmployee
        }).promise();

        return sendResponse ( 200, newEmployee)

    } catch ( error ) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
};

module.exports = {
  handler: middy(addEmployee).use(httpJsonBodyParser())
}