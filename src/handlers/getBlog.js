const AWS = require('aws-sdk');
const { goodResponse } = require('../utils/responseUtil');

exports.handler = async (event, context) => {
  const blogId = event.pathParameters.id;
  const s3Client = new AWS.S3();
  const params = { Bucket: 'jbasten-blog', Key: `markdowns/${blogId}.md` }

  const data = await s3Client.getObject(params, (err) => {
    if (err) {
      console.log('Error getting s3 object:', err);
    }
  }).promise();

  return goodResponse({ fileContents: data.Body.toString() });
}
