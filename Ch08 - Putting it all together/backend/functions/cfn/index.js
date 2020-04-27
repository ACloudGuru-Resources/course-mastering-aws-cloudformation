const AWS = require('aws-sdk');
const _find = require('lodash.find');
const _groupBy = require('lodash.groupby');
const camelcaseKeys = require('camelcase-keys');
const cfn = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const rgt = new AWS.ResourceGroupsTaggingAPI({ apiVersion: '2017-01-26' });

const CacheService = require('../_common/utils/cache-service');
const ttl = 1; // seconds
const cache = new CacheService(ttl);

const TAGKEY_REPOSITORY_NAME = 'GIT_REPOSITORY';

exports.handler = async event => {
  try {
    console.log('Received event {}', JSON.stringify(event, 3));

    const eventField = event.field || event[0].field;
    console.log(`Got an Invoke Request. eventField: ${eventField}`);

    switch (eventField) {
      case 'getStack': {
        const { id } = event.arguments;
        const stack = await getStack(id);
        return stack;
      }
      case 'allStacks': {
        const stacks = await getAllStacks();
        return stacks;
      }

      case 'stacks': {
        const repos = event;
        const { Stacks: stacks } = await getAllStacks();
        const stacksGrouped = orderStacksByRepo(
          repos,
          groupStacksByTag(stacks),
        );

        return stacksGrouped;
      }
      default: {
        throw `Unknown field, unable to resolve ${eventField}`;
      }
    }
  } catch (err) {
    throw err;
  }
};

const getOutputValue = (outputs, key) => {
  const { outputValue } = _find(outputs, ['outputKey', key]) || {};
  return outputValue;
};
const getTagValue = (tags, key) => {
  const { value } = _find(tags, ['key', key]) || {};
  return value;
};
const addFields = stacks =>
  stacks.map(stack => {
    const fields = {
      service: getTagValue(stack.tags, 'SERVICE'),
      stage: getTagValue(stack.tags, 'STAGE'),
      stageFlag: getTagValue(stack.tags, 'STAGE_FLAG'),
      siteUrl: getOutputValue(stack.outputs, 'SiteUrl'),
      serviceEndpoint: getOutputValue(stack.outputs, 'ServiceEndpoint'),
      serviceEndpointWebsocket: getOutputValue(
        stack.outputs,
        'ServiceEndpointWebsocket',
      ),
      websiteBucket: getOutputValue(stack.outputs, 'WebsiteBucket'),
    };

    return {
      ...stack,
      ...fields,
    };
  });
const groupStacksByTag = stacks =>
  _groupBy(stacks, s => {
    const repo = _find(s.Tags, t => t.Key === TAGKEY_REPOSITORY_NAME);
    return repo && repo.Value;
  });

const orderStacksByRepo = (repos, groupedStacks) =>
  repos.map(r => groupedStacks[r.source.name] || []);

const getStack = async StackName =>
  await cfn
    .describeStacks({ StackName })
    .promise()
    .then(({ Stacks }) => {
      const stack = camelcaseKeys(Stacks[0], { deep: true });
      return addFields([stack])[0];
    });
const getAllStacks = async () =>
  await cache.get(`getAllStacks`, () =>
    cfn
      .describeStacks()
      .promise()
      .then(({ Stacks }) => {
        const stacks = camelcaseKeys(Stacks, { deep: true });
        return addFields(stacks);
      }),
  );
