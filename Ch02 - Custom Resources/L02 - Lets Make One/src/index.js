const AWS = require('aws-sdk');
const axios = require('axios');

const { ORIGINMAP_TABLE, DOMAIN, AWS_REGION: region } = process.env;
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region,
});

exports.handler = async (event, context, callback) => {
  console.log('event', JSON.stringify(event));
  const { RequestType, ResourceProperties, PhysicalResourceId } = event;
  const { Service, Stage, Origin, Host: host } = ResourceProperties;
  const Host = host || proxyURL(Service, Stage);
  const ddbParams = getDDBParamsObject({ Service, Stage, Origin, Host });

  try {
    // CREATE
    if (['Create'].includes(RequestType)) {
      if (!Host && (!Stage && !Service))
        await sendResponse(
          event,
          'FAILED',
          'Host OR Stage and Service must be specified.',
        );

      console.log('Creating Item in DDB...', JSON.stringify(ddbParams));
      await handlePut(ddbParams);
      await sendResponse(event, 'SUCCESS', 'Created');
    }
    // UPDATE
    else if (RequestType === 'Update') {
      if (!Host && (!Stage && !Service))
        await sendResponse(
          event,
          'FAILED',
          'Host OR Stage and Service must be specified.',
        );

      console.log('Updating DDB...', JSON.stringify(ddbParams));
      await handleUpdate(PhysicalResourceId, ddbParams);
      await sendResponse(event, 'SUCCESS', 'Updated');
    }
    // DELETE
    else if (RequestType === 'Delete') {
      console.log('Deleting Item from DDB...', PhysicalResourceId);
      await handleDelete(PhysicalResourceId);
      await sendResponse(event, 'SUCCESS', 'Deleted');
    }
    // FAILED
    else {
      await sendResponse(event, 'FAILED', `Unexpected: ${RequestType}`);
    }
  } catch (error) {
    await sendResponse(event, 'FAILED', error);
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
}) => {
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
    ...Service,
    ...Stage,
  };
  return {
    Item,
    TableName: ORIGINMAP_TABLE,
    ConditionExpression: 'attribute_not_exists(Host)',
  };
};

const handlePut = params => dynamodb.putItem(params).promise();

const handleUpdate = async (physicalId, params) => {
  try {
    await handleDelete(physicalId);
    return await handlePut(params);
  } catch (error) {
    throw error;
  }
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

const sendResponse = (event, Status, Reason, cb) => {
  const {
    ResourceProperties,
    StackId,
    RequestId,
    LogicalResourceId,
    ResponseURL,
    PhysicalResourceId,
  } = event;
  const { Service, Stage } = ResourceProperties;
  let { Host } = ResourceProperties;
  Host = Host || proxyURL(Service, Stage);

  console.log({ ResponseURL, Host });

  const responseBody = JSON.stringify({
    Status,
    Reason: Reason.message,
    StackId,
    RequestId,
    LogicalResourceId,
    PhysicalResourceId: PhysicalResourceId || Host,
    Data: {
      Host,
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
