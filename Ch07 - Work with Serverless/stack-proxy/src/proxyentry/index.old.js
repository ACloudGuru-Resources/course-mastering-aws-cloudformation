const CfnLambda = require('cfn-lambda');
const AWS = require('aws-sdk');
const { Create, Update, Delete } = require('./ProxyEntry');
const Schema = require('./schema.json');

exports.handler = (event, context) => {
  console.log('event: ', JSON.stringify(event));
  console.log('context: ', JSON.stringify(context));

  const MarketingStackProxyEntry = CfnLambda({
    Create: Create,
    Update: Update,
    Delete: Delete,
    Schema,
  });
  AWS.config.region = currentRegion(context);
  return MarketingStackProxyEntry(event, context);
};

const currentRegion = context => {
  return context.invokedFunctionArn.match(/^arn:aws:lambda:(\w+-\w+-\d+):/)[1];
};
