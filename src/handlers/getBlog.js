const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  const blogId = event.pathParameters.id;
  const s3Client = new AWS.S3();
  const params = { Bucket: 'jbasten-blog', Key: `markdowns/${blogId}.md` }

  let data;

  try {
    data = await s3Client.getObject(params).promise();
  } catch (e) {
    console.log('Error getting s3 object:', e);
  }

  console.log('DATA', data);

  let responseBody = {};
  if (data) {
    responseBody.fileContents = data.Body.toString();
  } else {
    responseBody.fileContents = '';
    responseBody.errorMessage = `Could not fetch blog with id ${blogId}`
  }
  

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(responseBody),
    isBase64Encoded: false
  };
}
