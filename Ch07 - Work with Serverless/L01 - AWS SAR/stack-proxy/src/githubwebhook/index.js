const AWS = require('aws-sdk');
const Promise = require('bluebird');
const crypto = require('crypto');
const _find = require('lodash.find');
const _filter = require('lodash.filter');
const _map = require('lodash.map');
const _chunk = require('lodash.chunk');
const logger = require('./utils/logger');

AWS.config.setPromisesDependency(Promise);
const sts = new AWS.STS({ apiVersion: '2011-06-15' });
const {
    GITHUB_WEBHOOK_SECRET,
    PROD_CI_ROLE_ARN,
    DEV_CI_ROLE_ARN,
    DEV_GITHUB_WEBHOOK_ROLE_ARN,
  } = process.env,
  FEAT_REGEX = /^(feat-)(.+)$/,
  RC_REGEX = /^(rc-)(.+)$/,
  S3_CONST = 'AWS::S3::Bucket',
  REGEX_ROLE_ARN = /^arn:aws:(\w+)::(\d+):role\/([A-Za-z0-9-]+)$/,
  IS_SINGLE_ACCOUNT =
    PROD_CI_ROLE_ARN.match(REGEX_ROLE_ARN)[2] ===
    DEV_CI_ROLE_ARN.match(REGEX_ROLE_ARN)[2];

let creds, cfn, s3, CI_ROLE_ARN;

const signRequestBody = (key, body) => {
  return `sha1=${crypto
    .createHmac('sha1', key)
    .update(body, 'utf-8')
    .digest('hex')}`;
};

exports.handler = async event => {
  logger('event', event);
  var errMsg;
  const headers = event.headers;
  const sig = headers['X-Hub-Signature'];
  const githubEvent = headers['X-GitHub-Event'];
  const id = headers['X-GitHub-Delivery'];
  // const calculatedSig = signRequestBody(GITHUB_WEBHOOK_SECRET, event.body);

  // if (typeof GITHUB_WEBHOOK_SECRET !== 'string') {
  //   errMsg = "Must provide a 'GITHUB_WEBHOOK_SECRET' env variable";
  //   return callback(null, {
  //     statusCode: 401,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: errMsg,
  //   });
  // }

  // if (!sig) {
  //   errMsg = 'No X-Hub-Signature found on request';
  //   return callback(null, {
  //     statusCode: 401,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: errMsg,
  //   });
  // }

  // if (!githubEvent) {
  //   errMsg = 'No X-Github-Event found on request';
  //   return callback(null, {
  //     statusCode: 422,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: errMsg,
  //   });
  // }

  // if (!id) {
  //   errMsg = 'No X-Github-Delivery found on request';
  //   return callback(null, {
  //     statusCode: 401,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: errMsg,
  //   });
  // }

  // if (sig !== calculatedSig) {
  //   errMsg = "X-Hub-Signature incorrect. Github webhook token doesn't match";
  //   return callback(null, {
  //     statusCode: 401,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: errMsg,
  //   });
  // }

  if (githubEvent !== 'delete') {
    respond(event, callback);
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (error) {
    console.error('Unable to parse webhook payload', event.body);
    respond(event, callback);
  }
  logger(`Github-Event: "${githubEvent}" with action: "${payload.action}"`);

  const repoOwner = payload.repository.owner.login;
  const repoName = payload.repository.name;
  const branch = payload.ref;
  const isFeatBranch = FEAT_REGEX.test(branch);
  const isRCBranch = RC_REGEX.test(branch);

  if (isFeatBranch && !IS_SINGLE_ACCOUNT) {
    try {
      creds = await getSTSCreds();
      cfn = new AWS.CloudFormation({ apiVersion: '2010-05-15', ...creds });
      s3 = new AWS.S3({ apiVersion: '2012–09–25', ...creds });
      CI_ROLE_ARN = DEV_CI_ROLE_ARN;
    } catch (error) {
      console.error('Could not setup clients', error);
      return respond(500, {
        success: false,
        message: 'Could not setup clients.',
      });
    }
  } else {
    cfn = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
    s3 = new AWS.S3({ apiVersion: '2012–09–25' });
    CI_ROLE_ARN = PROD_CI_ROLE_ARN;
  }

  logger({
    repoName,
    repoOwner,
    branch,
    isFeatBranch,
  });

  if (isFeatBranch || isRCBranch) {
    try {
      const stacks = await getStacksWithTags(repoName, branch);
      await deleteEnvironments(stacks);
    } catch (error) {
      console.error('Something went wrong', error);
      return respond(500, {
        success: false,
        message: 'Something went wrong.',
      });
    }
  } else {
    logger('Branch Not Of Type: feat-* or rc-*', branch);
  }

  return respond(200, {
    success: true,
    message: 'SUCCESS',
  });
};

const getSTSCreds = async () => {
  const newcreds =
    creds ||
    (await sts
      .assumeRole({
        RoleArn: DEV_GITHUB_WEBHOOK_ROLE_ARN,
        RoleSessionName: 'awsaccount_session',
      })
      .promise());
  logger(newcreds);

  const {
    AccessKeyId: accessKeyId,
    SecretAccessKey: secretAccessKey,
    SessionToken: sessionToken,
  } = newcreds.Credentials;

  return { accessKeyId, secretAccessKey, sessionToken };
};

const respond = (statusCode, body, headers) => ({
  statusCode,
  headers: headers || {
    'Access-Control-Allow-Origin': '*',
  },
  body: JSON.stringify(body),
});

const getAllStacks = () =>
  cfn
    .describeStacks()
    .promise()
    .then(({ Stacks }) => Stacks);

const getStacksWithTags = async (repo, stage) => {
  const allStacks = (await getAllStacks()) || [];
  const filteredStacks = allStacks.filter(stack => {
    const repoMatch = _find(stack.Tags, { Key: 'GIT_REPOSITORY', Value: repo });
    const stageMatch = _find(stack.Tags, { Key: 'STAGE', Value: stage });

    return !!repoMatch && !!stageMatch;
  });
  return filteredStacks;
};

const getStackBuckets = stackname =>
  cfn
    .describeStackResources({
      StackName: stackname,
    })
    .promise()
    .then(data =>
      _map(
        _filter(data.StackResources, { ResourceType: S3_CONST }),
        resource => resource.PhysicalResourceId,
      ),
    );

const doesBucketExist = bucket =>
  s3
    .headBucket({ Bucket: bucket })
    .promise()
    .then(() => true)
    .catch(() => false);

const emptyBucket = bucket =>
  doesBucketExist(bucket).then(doesExist => {
    logger(`Attempting to empty bucket ${bucket}`);
    return (
      doesExist &&
      listAllKeys({ Bucket: bucket }).then(keys =>
        deleteFiles(bucket, keys.map(key => ({ Key: key }))),
      )
    );
  });

const emptyBuckets = buckets => Promise.all(buckets.map(emptyBucket));

const listKeyPage = options => {
  const params = { ...options, MaxKeys: 1000 };
  return s3
    .listObjectsV2(params)
    .promise()
    .then(list => {
      const keys = list.Contents.map(item => item.Key);
      const startAfter = list.IsTruncated ? keys[keys.length - 1] : null;
      return { startAfter, keys };
    });
};

const listAllKeys = options => {
  let keys = [];
  const listKeysRecusively = StartAfter => {
    const params = { ...options, StartAfter };
    return listKeyPage(params).then(response => {
      const { startAfter, keys: keyset } = response;
      keys = keys.concat(keyset);
      if (startAfter) {
        return listKeysRecusively(startAfter);
      }
      return keys;
    });
  };
  return listKeysRecusively();
};

const deleteFiles = (bucket, objects) =>
  Promise.map(_chunk(objects, 1000), objectsChunk => {
    const deleteParams = {
      Bucket: bucket,
      Delete: {
        Objects: objectsChunk,
      },
    };
    return s3.deleteObjects(deleteParams).promise();
  });

const deleteStack = stackname =>
  cfn.deleteStack({ StackName: stackname, RoleARN: CI_ROLE_ARN }).promise();

const deleteEnvironments = stacks => Promise.all(stacks.map(deleteEnvironment));

const deleteEnvironment = async stack => {
  const { StackName } = stack;

  const buckets = await getStackBuckets(StackName); // Get all buckets in Stack
  await emptyBuckets(buckets); // Empty all buckets
  logger('buckets emptied');
  await deleteStack(StackName); // Delete Stack
  logger('stacks deleted');
  return;
};
