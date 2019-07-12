const AWS = require('aws-sdk');
const Promise = require('bluebird');
const crypto = require('crypto');
const fetch = require('node-fetch');
const { ApolloClient } = require('apollo-client');
const { createHttpLink } = require('apollo-link-http');
const { setContext } = require('apollo-link-context');
const { InMemoryCache } = require('apollo-cache-inmemory');
const gql = require('graphql-tag');
const yaml = require('js-yaml');
const _filter = require('lodash.filter');
const _map = require('lodash.map');
const _chunk = require('lodash.chunk');
const logger = require('./utils/logger');

AWS.config.setPromisesDependency(Promise);
const sts = new AWS.STS({ apiVersion: '2011-06-15' });
const {
    GITHUB_API,
    GITHUB_WEBHOOK_SECRET,
    GITHUB_ACCESS_TOKEN,
    PROD_CI_ROLE_ARN,
    DEV_CI_ROLE_ARN,
    DEV_GITHUB_WEBHOOK_ROLE_ARN,
    PROD_DEPLOYMENT_BUCKET,
    DEV_DEPLOYMENT_BUCKET,
  } = process.env,
  REPO_SLS_EXP = 'master:serverless.yml',
  FEAT_REGEX = /^(feat-)(.+)$/,
  RC_REGEX = /^(rc-)(.+)$/,
  S3_CONST = 'AWS::S3::Bucket',
  REGEX_ROLE_ARN = /^arn:aws:(\w+)::(\d+):role\/([A-Za-z0-9-]+)$/,
  IS_SINGLE_ACCOUNT =
    PROD_CI_ROLE_ARN.match(REGEX_ROLE_ARN)[2] ===
    DEV_CI_ROLE_ARN.match(REGEX_ROLE_ARN)[2],
  DEPLOYMENT_BUCKET_BASEDIRECTORY = `serverless`;

let creds, cfn, s3, CI_ROLE_ARN, DEPLOYMENT_BUCKET;

const signRequestBody = (key, body) => {
  return `sha1=${crypto
    .createHmac('sha1', key)
    .update(body, 'utf-8')
    .digest('hex')}`;
};

module.exports.handler = async (event, context, callback) => {
  logger('event', event);
  var errMsg;
  const headers = event.headers;
  const sig = headers['X-Hub-Signature'];
  const githubEvent = headers['X-GitHub-Event'];
  const id = headers['X-GitHub-Delivery'];
  const calculatedSig = signRequestBody(GITHUB_WEBHOOK_SECRET, event.body);

  if (typeof GITHUB_WEBHOOK_SECRET !== 'string') {
    errMsg = "Must provide a 'GITHUB_WEBHOOK_SECRET' env variable";
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!sig) {
    errMsg = 'No X-Hub-Signature found on request';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!githubEvent) {
    errMsg = 'No X-Github-Event found on request';
    return callback(null, {
      statusCode: 422,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (!id) {
    errMsg = 'No X-Github-Delivery found on request';
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

  if (sig !== calculatedSig) {
    errMsg = "X-Hub-Signature incorrect. Github webhook token doesn't match";
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: errMsg,
    });
  }

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
      DEPLOYMENT_BUCKET = DEV_DEPLOYMENT_BUCKET;
    } catch (error) {
      console.error('Could not setup clients', error);
      respond(event, callback);
    }
  } else {
    cfn = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
    s3 = new AWS.S3({ apiVersion: '2012–09–25' });
    CI_ROLE_ARN = PROD_CI_ROLE_ARN;
    DEPLOYMENT_BUCKET = PROD_DEPLOYMENT_BUCKET;
  }

  logger({
    repoName,
    repoOwner,
    branch,
    isFeatBranch,
  });

  if (isFeatBranch || isRCBranch) {
    try {
      const service = await getServiceName(
        repoName,
        branch,
        repoOwner,
        REPO_SLS_EXP,
      );
      const stackname = getStackName(service, branch);
      const stackExists = await doesStackExist(stackname);

      logger({ service, stackname, stackExists });

      if (stackExists) {
        const buckets = await getStackBuckets(stackname); // Get all buckets in Stack
        await emptyBuckets(buckets); // Empty all buckets
        await deleteStack(stackname); // Delete Stack
        // Delete assoc. directory in deployment bucket
        await deleteDirInBucket(
          DEPLOYMENT_BUCKET,
          `${DEPLOYMENT_BUCKET_BASEDIRECTORY}/${service}/${branch}/`,
        );
      }
    } catch (error) {
      console.error('Something went wrong', error);
      respond(event, callback);
    }
  } else {
    logger('Branch Not Of Type: feat-* or rc-*', branch);
  }

  respond(event, callback);
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

const respond = (event, cb) =>
  cb(null, {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  });

const getStackName = (service, branch) => `${service}-${branch}`;

const getServiceName = (repoName, branch, repoOwner, expression) => {
  const httpLink = createHttpLink({
    uri: GITHUB_API,
    fetch: fetch,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: GITHUB_ACCESS_TOKEN
          ? `Bearer ${GITHUB_ACCESS_TOKEN}`
          : '',
      },
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  const query = gql`
      {
        repository(owner: "${repoOwner}", name: "${repoName}") {
          object(expression: "master:serverless.yml") {
            ... on Blob {
              text
            }
          }
        }
      }
    `;
  return client
    .query({ query })
    .then(({ data }) => {
      const slsyml = yaml.safeLoad(data.repository.object.text, 'utf8');
      const service = slsyml.service;
      return service;
    })
    .catch();
};

const doesStackExist = async stackname => {
  return cfn
    .describeStacks({
      StackName: stackname,
    })
    .promise()
    .then(data => {
      return true;
    })
    .catch(() => false);
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

const deleteDirInBucket = (bucket, Prefix) => {
  logger(`Deleting Dir: ${Prefix} from Bucket: ${bucket}`);
  return doesBucketExist(bucket).then(
    doesExist =>
      doesExist &&
      listAllKeys({ Bucket: bucket, Prefix }).then(keys =>
        deleteFiles(bucket, keys.map(key => ({ Key: key }))),
      ),
  );
};

const emptyBucket = bucket =>
  doesBucketExist(bucket).then(
    doesExist =>
      doesExist &&
      listAllKeys({ Bucket: bucket }).then(keys =>
        deleteFiles(bucket, keys.map(key => ({ Key: key }))),
      ),
  );

const emptyBuckets = buckets =>
  Promise.all(buckets.map(bucket => emptyBucket(bucket)));

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
