const AWS = require('aws-sdk');
const { MongoClient } = require("mongodb");

const BUCKET = 'jbasten-blog';
const PREFIX = 'blogs/assets-loader/';

exports.handler = async (event, context) => {
  const id = event.id;
  const title = event.title;

  const markdownFileName = `${id}.md`;
  const previewImageFileName = `${id}.png`;

  const s3Client = new AWS.S3();
  const sourceBucketParams = {
    Bucket: BUCKET,
    Delimiter: '/',
    Prefix: PREFIX
  };

  const objectsReturnedFromS3BlogLoader = await s3Client.listObjects(sourceBucketParams).promise();
  const sourceAssets = objectsReturnedFromS3BlogLoader.Contents.filter(item => item.Size > 0);
  const markdown = sourceAssets.find(item => item.Key.endsWith(markdownFileName));
  const previewImage = sourceAssets.find(item => item.Key.endsWith(previewImageFileName));

  const destinationPrefix = `blogs/${id}`;
  const copyMarkdownParams = {
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${markdown.Key}`,
    Key: `${destinationPrefix}/${markdownFileName}`,
  };
  const copyPreviewImageParams = {
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${previewImage.Key}`,
    Key: `${destinationPrefix}/${previewImageFileName}`,
  };

  const copyMarkdownData = await s3Client.copyObject(copyMarkdownParams).promise();
  const copyPreviewImageData = await s3Client.copyObject(copyPreviewImageParams).promise();

  const uri = process.env.BLOG_MONGO_CONNECTION;
  console.log('uri', uri);
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("Blog").collection("Blogs");
    console.log('connected');
    // perform actions on the collection object
    client.close();
  });

  if (copyMarkdownData.CopyObjectResult && copyPreviewImageData.CopyObjectResult) {
    return { message: 'Objects Copied' }
  } else {
    return { error: 'Copy Failed' }
  }
}