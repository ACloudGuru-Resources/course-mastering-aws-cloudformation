const AWS = require('aws-sdk');
const axios = require('axios');

const { AWS_REGION: region } = process.env;
const s3 = new AWS.S3({
  apiVersion: '2012–09–25',
  region,
});

exports.handler = async (event, context, callback) => {
  console.log('event', JSON.stringify(event));
  const { RequestType: requestType, ResourceProperties: properties } = event;
  const { Target } = properties;

  try {
    if (!Target || getBodyType(properties).length !== 1) {
      await sendResponse(event, 'FAILED', 'Missing required parameters');
    }

    if (['Create', 'Update'].includes(requestType)) {
      if (properties.Body) {
        const options = { ...Target, Body: properties.Body };
        console.log('CreateUpdate-Body:', JSON.stringify(options));
        await s3.putObject(options).promise();
      } else if (properties.Base64Body) {
        let Body;
        try {
          Body = Buffer.from(properties.Base64Body, 'base64').toString('ascii');
        } catch (err) {
          await sendResponse(event, 'FAILED', 'Malformed Base64Body');
          throw err;
        }
        const options = { ...Target, Body };
        console.log('CreateUpdate-Base64Body:', JSON.stringify(options));
        await s3.putObject(options).promise();
      } else if (properties.Source) {
        const { Key, Bucket, ACL } = Target;
        const { Bucket: SourceBucket, Key: SourceKey } = properties.Source;
        const options = {
          CopySource: `/${SourceBucket}/${SourceKey}`,
          Bucket,
          Key,
          MetadataDirective: 'COPY',
          TaggingDirective: 'COPY',
          ACL,
        };
        console.log('CreateUpdate-Source:', JSON.stringify(options));
        await s3.copyObject(options).promise();
      } else {
        await sendResponse(event, 'FAILED', 'Malformed body');
      }
      await sendResponse(event, 'SUCCESS', 'Created');
    } else if (requestType === 'Delete') {
      const { Key, Bucket } = Target;
      const options = { Bucket, Key };
      console.log('Delete: ', JSON.stringify(options));
      await s3.deleteObject(options).promise();
      await sendResponse(event, 'SUCCESS', 'Deleted');
    } else {
      await sendResponse(event, 'FAILED', `Unexpected: ${requestType}`);
    }
  } catch (error) {
    callback(error);
  }
  callback(null);
};

const getBodyType = props =>
  Object.getOwnPropertyNames(props).filter(item =>
    ['Body', 'Base64Body', 'Source'].includes(item),
  );

const sendResponse = (event, Status, Reason, cb) => {
  const {
    ResourceProperties: properties,
    StackId,
    RequestId,
    LogicalResourceId,
    ResponseURL,
  } = event;
  const { Bucket } = properties.Target;
  const { Key } = properties.Target;

  console.log({ ResponseURL });

  const responseBody = JSON.stringify({
    Status,
    Reason: Reason.message,
    StackId,
    RequestId,
    LogicalResourceId,
    PhysicalResourceId: `s3://${Bucket}/${Key}`,
    Data: {
      Bucket,
      Key,
    },
  });

  console.log('Response body:\n', responseBody);

  const config = {
    headers: {
      'content-type': '',
      'content-length': responseBody.length,
    },
  };
  return axios
    .put(ResponseURL, responseBody, config)
    .then(response => {
      console.log('Status code: ' + response.status);
      console.log('Status message: ' + response.statusText);
      return response;
    })
    .catch(err => {
      console.log('send(..) failed executing https.request(..): ' + err);
      throw err;
    });
};
