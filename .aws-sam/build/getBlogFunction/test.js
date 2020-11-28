const AWS = require('aws-sdk');

const s3Client = new AWS.S3();
const params = { Bucket: 'jbasten-blog', Key: 'markdowns/test.md' }

let fileContents = '';

console.log('s3client:', s3Client);``

s3Client.getObject(params, (err, data) => {
  console.log('am i here');
  if (err) {
    console.log('Error getting s3 object:', err);
  } else {
    console.log(data.Body.toString());
    fileContents = data.Body.toString();
  }
});

console.log(fileContents);