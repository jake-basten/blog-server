const { goodResponse } = require("../utils/responseUtil")

exports.handler = async (event, context) => {
    return goodResponse({ message: 'Hello World from blog-server!' });
}