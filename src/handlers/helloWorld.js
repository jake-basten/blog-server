exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({ message: 'Hello World from blog-server!' }),
        isBase64Encoded: false
    };
}