const AWS = require('aws-sdk');
const MongoClient = require("mongodb").MongoClient;

const BUCKET = 'jbasten-blog';
const PREFIX = 'assets-loader/';
const SOURCE_BUCKET_PARAMS = {
  Bucket: BUCKET,
  Delimiter: '/',
  Prefix: PREFIX
};

const connectToDB = (uri) => {
  return MongoClient.connect(uri, { useUnifiedTopology: true })
    .then(db => {
      console.log('connected to db');
      cachedDb = db;
      return cachedDb;
    });
}

const insertRecordIntoDB = (connection, record) => {
  return connection.db('Blog').collection('Blogs').insertOne(record)
    .then(() => {
      console.log("1 document inserted");
    })
    .catch(err => {
      console.log('err', err);
    });
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const id = event.id;
  const title = event.title;

  const markdownFileName = `${id}.md`;
  const previewImageFileName = `${id}.png`;

  const s3Client = new AWS.S3();

  const objectsReturnedFromS3BlogLoader = await s3Client.listObjects(SOURCE_BUCKET_PARAMS).promise();
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
  const connection = await connectToDB(uri);

  const testObj = {
    _id: {
      id: 1
    },
    foo: 'bar'
  };

  insertRecordIntoDB(connection, testObj);

  if (copyMarkdownData.CopyObjectResult && copyPreviewImageData.CopyObjectResult) {
    return { message: 'Objects Copied' }
  } else {
    return { error: 'Copy Failed' }
  }
}