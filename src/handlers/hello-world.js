exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {},
        body: { message: 'Hello World from blog-server!' },
        isBase64Encoded: false
    };
}