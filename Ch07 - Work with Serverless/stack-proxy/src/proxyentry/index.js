const AWS = require('aws-sdk');
const { ORIGINMAP_TABLE, DOMAIN } = process.env;
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-1',
});

exports.handler = async (event, context, callback) => {
  console.log('event', JSON.stringify(event));
  const { RequestType: requestType, ResourceProperties: properties } = event;
  const { Origin: origin, Stage: stage, Service: service } = properties;

  try {
    if (requestType === 'Create') {
      console.log(`${requestType} params`, properties);

      if (!(origin && stage && service))
        await sendResponse(event, 'FAILED', 'Missing required parameters');

      const Origin = origin || proxyURL(service, stage);
      const finalParams = { ...properties, Origin };
      const ddbParams = getDDBParamsObject({ ...properties, Origin });

      await handlePut(ddbParams);
      await sendResponse(event, 'SUCCESS', 'Created');
    } else if (requestType === 'Update') {
      console.log('Update params', params);
      console.log('Update oldParams', oldParams);
      console.log('Update physicalId', physicalId);

      const { Host: host, Stage: stage, Service: service } = params;

      if (!host && (!stage && !service))
        reply('Host OR Stage and Service must be specified.');

      const Host = host || proxyURL(service, stage);
      const finalParams = { ...params, Host };
      const ddbParams = getDDBParamsObject({ ...params, Host });

      await handleDelete(physicalId);
      await handlePut(params);
      await sendResponse(event, 'SUCCESS', 'Created');
    } else if (requestType === 'Delete') {
      await handleDelete(physicalId);
      await sendResponse(event, 'SUCCESS', 'Deleted');
    } else {
      await sendResponse(event, 'FAILED', `Unexpected: ${requestType}`);
    }
  } catch (error) {
    callback(error);
  }
  callback(null);
};

const proxyURL = (service, stage, domain = DOMAIN) =>
  `${stage}--${service}.${domain}`;

const getDDBParamsObject = ({
  Host,
  Service: service,
  Stage: stage,
  Origin,
  Dashboard: dashboard,
}) => {
  const Dashboard = dashboard && { Dashboard: { S: dashboard } };
  const Service = service && { Service: { S: service } };
  const Stage = stage && { Stage: { S: stage } };
  const Item = {
    ...{
      Host: {
        S: Host,
      },
      Origin: {
        S: Origin,
      },
    },
    ...Dashboard,
    ...Service,
    ...Stage,
  };
  return {
    Item,
    TableName: ORIGINMAP_TABLE,
    ConditionExpression: 'attribute_not_exists(Host)',
  };
};

const handlePut = params => {
  console.log('Creating Item in DDB...', JSON.stringify(params));
  return dynamodb.putItem(params).promise();
};

const handleDelete = physicalId =>
  dynamodb
    .deleteItem({
      Key: {
        Host: {
          S: physicalId,
        },
      },
      TableName: ORIGINMAP_TABLE,
    })
    .promise();

const sendResponse = (event, Status, Reason) => {
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
