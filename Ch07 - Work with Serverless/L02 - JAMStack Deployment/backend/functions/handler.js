'use strict';

const AWS = require('aws-sdk');
const Bluebird = require('bluebird');
const _reduce = require('lodash.reduce');
const _omit = require('lodash.omit');
AWS.config.update({ region: process.env.AWS_REGION });
const DDB = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
AWS.config.setPromisesDependency(Bluebird);
require('aws-sdk/clients/apigatewaymanagementapi');

const STATS_FIELD_NAME = 'THIS_IS_FOR_STATS';

const successfullResponse = {
  statusCode: 200,
  body: 'Connected',
};

const jose = require('node-jose');
const fetch = require('node-fetch');
fetch.Promise = Bluebird;

module.exports.connectionManager = (event, context, callback) => {
  if (event.requestContext.eventType === 'CONNECT') {
    addConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        callback(null, JSON.stringify(err));
      });
  } else if (event.requestContext.eventType === 'DISCONNECT') {
    deleteConnection(event.requestContext.connectionId)
      .then(() => {
        callback(null, successfullResponse);
      })
      .catch(err => {
        callback(null, {
          statusCode: 500,
          body: 'Failed to connect: ' + JSON.stringify(err),
        });
      });
  }
};

module.exports.defaultMessage = (event, context, callback) => {
  callback(null);
};

module.exports.sendMessage = async (event, context, callback) => {
  let connectionData;
  try {
    connectionData = await DDB.scan({
      TableName: process.env.DEMOCONNECTION_TABLE,
      ProjectionExpression: 'connectionId',
    }).promise();
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }

  console.log({ eventbody: event.body });
  const postData = JSON.parse(JSON.parse(event.body).data);
  console.log({ postData });
  const votes =
    postData === '' ? await getVotes(postData) : await addVote(postData);
  console.log({ votes });

  const postCalls = connectionData.Items.filter(
    ({ connectionId }) => connectionId.S !== STATS_FIELD_NAME,
  ).map(async ({ connectionId }) => {
    try {
      return await send(event, connectionId.S, votes);
    } catch (err) {
      if (err.statusCode === 410) {
        return await deleteConnection(connectionId.S);
      }
      console.log(JSON.stringify(err));
      throw err;
    }
  });

  try {
    await Promise.all(postCalls);
  } catch (err) {
    console.log(err);
    callback(null, JSON.stringify(err));
  }
  callback(null, successfullResponse);
};

const cleanData = vote => {
  const rootKey = vote.Attributes ? 'Attributes' : 'Item';
  return _reduce(
    _omit(vote[rootKey], ['connectionId']),
    (result, value, key) => ({ ...result, ...{ [key]: parseInt(value.N) } }),
    {},
  );
};

const send = async (event, connectionId, votes) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint:
      event.requestContext.domainName + '/' + event.requestContext.stage,
  });
  return await apigwManagementApi
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(votes),
    })
    .promise();
};

const addConnection = connectionId => {
  const putParams = {
    TableName: process.env.DEMOCONNECTION_TABLE,
    Item: {
      connectionId: { S: connectionId },
    },
  };

  return DDB.putItem(putParams).promise();
};

const addVote = house => {
  const updateParams = {
    TableName: process.env.DEMOCONNECTION_TABLE,
    Key: {
      connectionId: { S: STATS_FIELD_NAME },
    },
    UpdateExpression: 'add #vote :x',
    ExpressionAttributeNames: { '#vote': house },
    ExpressionAttributeValues: { ':x': { N: '1' } },
    ReturnValues: 'ALL_NEW',
  };

  return DDB.updateItem(updateParams)
    .promise()
    .then(cleanData);
};

const getVotes = () => {
  const params = {
    Key: {
      connectionId: { S: STATS_FIELD_NAME },
    },
    TableName: process.env.DEMOCONNECTION_TABLE,
  };

  return DDB.getItem(params)
    .promise()
    .then(v => {
      console.log('v', v);
      return v;
    })
    .then(cleanData);
};

const deleteConnection = connectionId => {
  const deleteParams = {
    TableName: process.env.DEMOCONNECTION_TABLE,
    Key: {
      connectionId: { S: connectionId },
    },
  };

  return DDB.deleteItem(deleteParams).promise();
};

module.exports.authorizerFunc = async (event, context, callback) => {
  const keys_url =
    'https://cognito-idp.ap-southeast-2.amazonaws.com/USER_POOL_ID/.well-known/jwks.json';
  const {
    queryStringParameters: { token },
    methodArn,
  } = event;

  const app_client_id = APP_CLIENT_ID;
  if (!token) return context.fail('Unauthorized');
  const sections = token.split('.');
  let authHeader = jose.util.base64url.decode(sections[0]);
  authHeader = JSON.parse(authHeader);
  const kid = authHeader.kid;
  const rawRes = await fetch(keys_url);
  const response = await rawRes.json();

  if (rawRes.ok) {
    const keys = response['keys'];
    let key_index = -1;
    keys.some((key, index) => {
      if (kid == key.kid) {
        key_index = index;
      }
    });
    const foundKey = keys.find(key => {
      return kid === key.kid;
    });

    if (!foundKey) {
      context.fail('Public key not found in jwks.json');
    }

    jose.JWK.asKey(foundKey).then(function(result) {
      // verify the signature
      jose.JWS.createVerify(result)
        .verify(token)
        .then(function(result) {
          // now we can use the claims
          const claims = JSON.parse(result.payload);
          // additionally we can verify the token expiration
          const current_ts = Math.floor(new Date() / 1000);
          if (current_ts > claims.exp) {
            context.fail('Token is expired');
          }
          // and the Audience (use claims.client_id if verifying an access token)
          if (claims.aud != app_client_id) {
            context.fail('Token was not issued for this audience');
          }
          context.succeed(generateAllow('me', methodArn));
        })
        .catch(err => {
          context.fail('Signature verification failed');
        });
    });
  }
};

const generatePolicy = function(principalId, effect, resource) {
  var authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    var policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    var statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

const generateAllow = function(principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
};

const generateDeny = function(principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
};
