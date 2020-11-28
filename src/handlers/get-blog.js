const AWS = require('aws-sdk');

exports.handler = async (event) => {
  const s3Client = new AWS.S3();
  const params = { Bucket: 'jbasten-blog', Key: 'markdowns/test.md' }

  const data = await s3Client.getObject(params, (err) => {
    if (err) {
      console.log('Error getting s3 object:', err);
    }
  }).promise();

  return {
    statusCode: 200,
    body: { fileContents: data.Body.toString() }
  };
}
