const AWS = require('aws-sdk');
const _find = require('lodash.find');
const _groupBy = require('lodash.groupby');
const camelcaseKeys = require('camelcase-keys');
const cfn = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
const rgt = new AWS.ResourceGroupsTaggingAPI({ apiVersion: '2017-01-26' });

const CacheService = require('../_common/utils/cache-service');
const ttl = 300; // default TTL of 30 seconds
const cache = new CacheService(ttl);

const TAGKEY_REPOSITORY_NAME = 'GIT_REPOSITORY';

exports.handler = async (event, context, callback) => {
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

        console.log({ stacksGrouped: JSON.stringify(stacksGrouped) });
        return stacksGrouped;
      }
      // case 'stack': {
      //   const builds = event;
      //   const { Stacks: stacks } = await getAllStacks();
      //   const stacksGrouped = orderStacksByRepo(
      //     repos,
      //     groupStacksByTag(stacks),
      //   );

      //   console.log({ stacksGrouped: JSON.stringify(stacksGrouped) });
      //   callback(null, stacksGrouped);
      // }
      default: {
        throw `Unknown field, unable to resolve ${eventField}`;
      }
    }
  } catch (err) {
    throw err;
  }
};

const groupStacksByTag = (stacks) =>
  _groupBy(stacks, (s) => {
    const repo = _find(s.Tags, (t) => t.Key === TAGKEY_REPOSITORY_NAME);
    return repo && repo.Value;
  });

const orderStacksByRepo = (repos, groupedStacks) =>
  repos.map((r) => groupedStacks[r.source.name] || null);

const jsonToBase64 = (json) =>
  Buffer.from(JSON.stringify(json)).toString('base64');

const tagsToValueArray = (json) =>
  Object.keys(json).reduce(
    (prev, o) => [...prev, { Key: o, Values: json[o] }],
    [],
  );

const filterStacksByTags = (stacks, filters) =>
  stacks.filter((stack) => isTagsMatch(stack.Tags, filters));
const isTagsMatch = (tags, tagFilters) =>
  tagFilters.every((tagFilter) => isFilterMatch(tags, tagFilter));
const isFilterMatch = (tags, tagFilter) =>
  !!_find(
    tags,
    (tag) =>
      tag.Key === tagFilter.Key &&
      (!tagFilter.Values ||
        tagFilter.Values.length === 0 ||
        tagFilter.Values.includes(tag.Value)),
  );

const getStack = async (StackName) => {
  const { Stacks } = await cfn.describeStacks({ StackName }).promise();
  const stack = camelcaseKeys(Stacks[0], { deep: true });
  return stack;
};
const getAllStacks = async () => {
  const { Stacks } = await cache.get(`getAllStacks`, () =>
    cfn.describeStacks().promise(),
  );
  const stacks = camelcaseKeys(Stacks, { deep: true });
  return stacks;
};
