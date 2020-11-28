exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: { message: 'Hello World from blog-server!' }
    };
}