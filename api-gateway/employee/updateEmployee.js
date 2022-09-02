"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const { sendResponse } = require("../../utils");
const Tables = require("../../constants/tables")

const updateEmployee = async (event) => {
  try { 
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    const { firstName, lastName, email, mobileNumber } = event.body;
    const { id } = event.pathParameters;
    const { sub } = event.requestContext.authorizer.claims
    const updatedAt = new Date().toISOString();

    await dynamoDb.update({
        TableName: Tables.employeeTable,
        Key: { id },
        UpdateExpression: 'set firstName = :firstName, lastName = :lastName, email = :email, mobileNumber = :mobileNumber, updatedAt = :updatedAt, updatedBy = :updatedBy',
        ExpressionAttributeValues: {
            ':firstName' : firstName,
            ':lastName': lastName,
            ':email': email,
            ':mobileNumber': mobileNumber,
            ':updatedAt': updatedAt,
            ':updatedBy': sub
        },
        ReturnValues: 'ALL_NEW'
    }).promise();

    return sendResponse (200, { message: "Employee updated" })
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error'
    return sendResponse(500, { message })
  }
};

module.exports = {
  handler: middy(updateEmployee).use(httpJsonBodyParser())
}