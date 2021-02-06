const AWS = require('aws-sdk');

const BUCKET = 'jbasten-blog';

exports.handler = async (event, context) => {
  const blogId = event.pathParameters.id;
  const s3Client = new AWS.S3();
  const markdownParams = { Bucket: BUCKET, Key: `blogs/${blogId}/${blogId}.md` };
  const imageParams = { Bucket: BUCKET, Key: `blogs/${blogId}/${blogId}.png` };

  let markdownData;
  let imageData;

  try {
    markdownData = await s3Client.getObject(markdownParams).promise();
    imageData = await s3Client.getObject(imageParams).promise();
  } catch (e) {
    console.log('Error getting blog data from s3:', e);
  }

  let responseBody = {};
  if (markdownData && imageData) {
    responseBody.fileContents = markdownData.Body.toString();
    responseBody.imagePath = `https://jbasten-blog.s3.amazonaws.com/blogs/${blogId}/${blogId}.png`;
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
