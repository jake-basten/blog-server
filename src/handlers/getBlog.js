const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const blogId = event.pathParameters.id;
  const s3Client = new AWS.S3();
  const params = { Bucket: 'jbasten-blog', Key: `markdowns/${blogId}.md` }

  const data = await s3Client.getObject(params, (err) => {
    if (err) {
      console.log('Error getting s3 object:', err);
    }
  }).promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify({ fileContents: data.Body.toString() }),
    isBase64Encoded: false
  };
}
