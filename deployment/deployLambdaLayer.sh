cp -r ../src/lambda-layer .
zip -r blog-server-lambda-layer.zip lambda-layer
aws s3 cp blog-server-lambda-layer.zip s3://jbasten-serverless-artifacts

aws lambda publish-layer-version \
    --layer-name blog-server-layer \
    --description "Dependencies for blog-server" \
    --content S3Bucket=jbasten-serverless-artifacts,S3Key=blog-server-lambda-layer.zip \
    --compatible-runtimes nodejs12.x

rm blog-server-lambda-layer.zip
rm -rf lambda-layer/