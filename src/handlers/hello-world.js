exports.handler = async (event) => {
    console.log('IN HELLOWORLD LAMBDA');
    return {
        statusCode: 200,
        body: { message: 'Hello World from blog-server!' }
    };
}