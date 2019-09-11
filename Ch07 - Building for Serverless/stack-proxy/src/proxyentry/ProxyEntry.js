const AWS = require('aws-sdk');
const { ORIGINMAP_TABLE, DOMAIN } = process.env;
const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
  region: 'us-east-1',
});

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

exports.Create = (params, reply) => {
  console.log('Create params', params);

  const { Host: host, Stage: stage, Service: service } = params;

  if (!host && (!stage && !service))
    reply('Host OR Stage and Service must be specified.');

  const Host = host || proxyURL(service, stage);
  const finalParams = { ...params, Host };
  const ddbParams = getDDBParamsObject({ ...params, Host });

  console.log('Creating Item in DDB...', JSON.stringify(ddbParams));
  handlePut(ddbParams)
    .then(data => {
      reply(null, Host, finalParams);
    })
    .catch(err => {
      console.error(err);
      reply(err);
    });
};

exports.Update = (physicalId, params, oldParams, reply) => {
  console.log('Update params', params);
  console.log('Update oldParams', oldParams);
  console.log('Update physicalId', physicalId);

  const { Host: host, Stage: stage, Service: service } = params;

  // if (!!host) reply('Host cannot be altered');
  // if (!stage && !service) reply('Stage AND/OR Service must be specified.');
  if (!host && (!stage && !service))
    reply('Host OR Stage and Service must be specified.');

  const Host = host || proxyURL(service, stage);
  const finalParams = { ...params, Host };
  const ddbParams = getDDBParamsObject({ ...params, Host });

  console.log('Updating DDB...', JSON.stringify(ddbParams));
  handleUpdate(physicalId, ddbParams)
    .then(data => {
      reply(null, Host, finalParams);
    })
    .catch(err => {
      console.error(err);
      reply(err);
    });
};

exports.Delete = (physicalId, params, reply) => {
  handleDelete(physicalId)
    .then(data => {
      reply(null, physicalId);
    })
    .catch(err => {
      console.error(err);
      reply(err);
    });
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
