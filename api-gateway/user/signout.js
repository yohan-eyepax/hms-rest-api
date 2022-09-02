const AWS = require('aws-sdk')
const { sendResponse } = require("../../utils");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const cognito = new AWS.CognitoIdentityServiceProvider()

const signout = async (event) => {
    try {
        const { user_pool_id } = process.env
        console.log(event.requestContext.authorizer.claims)
        const { email } = event.requestContext.authorizer.claims
        const params = {
            UserPoolId: user_pool_id,
            Username: email
        }
        const result = await cognito.adminUserGlobalSignOut(params).promise()
        return sendResponse( 200, { message: "Success" } )
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}

module.exports = {
    handler : middy(signout).use(httpJsonBodyParser())
}