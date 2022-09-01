const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

const validateInput = (body) => {
    const { email, password } = body
    if (!email || !password || password.length < 6)
        return false
    return true
}

module.exports = {
    sendResponse, validateInput
};