const AWS = require('aws-sdk')
const { sendResponse, validateInput } = require("../../utils");
const middy = require("@middy/core");
const httpJsonBodyParser = require("@middy/http-json-body-parser");

const cognito = new AWS.CognitoIdentityServiceProvider()

const signUp = async (event) => {
    try {
        const isValid = validateInput(event.body)
        if (!isValid) return sendResponse(400, { message: 'Invalid input' })

        const { email, password } = event.body
        const { user_pool_id } = process.env
        const params = {
            UserPoolId: user_pool_id,
            Username: email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'email_verified',
                    Value: 'true'
                }
            ],
            MessageAction: 'SUPPRESS'
        }
        const response = await cognito.adminCreateUser(params).promise();
        if (response.User) {
            const paramsForSetPass = {
                Password: password,
                UserPoolId: user_pool_id,
                Username: email,
                Permanent: true
            };
            await cognito.adminSetUserPassword(paramsForSetPass).promise()
        }
        return sendResponse(200, { message: 'User registration successful' })
    }
    catch (error) {
        const message = error.message ? error.message : 'Internal server error'
        return sendResponse(500, { message })
    }
}

module.exports = {
    handler: middy(signUp).use(httpJsonBodyParser())
}