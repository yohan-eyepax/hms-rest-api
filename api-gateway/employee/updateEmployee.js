"use strict";
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");
const { sendResponse } = require("../../utils");

const updateEmployee = async (event) => {
  try { 
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    const { firstName, lastName, email, mobileNumber } = event.body;
    const { id } = event.pathParameters;

    await dynamoDb.update({
        TableName: "EmployeeTable",
        Key: { id },
        UpdateExpression: 'set firstName = :firstName, lastName = :lastName, email = :email, mobileNumber = :mobileNumber',
        ExpressionAttributeValues: {
            ':firstName' : firstName,
            ':lastName': lastName,
            ':email': email,
            ':mobileNumber': mobileNumber
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