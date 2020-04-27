const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const axios = require('axios');
const _find = require('lodash.find');
const pageParser = require('./utils/pageParser');

const { AWS_REGION: region, SSMSECRETS, GITHUB_USER } = process.env;
const ddb = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-10-08',
  region,
});
const ssm = new AWS.SSM({ apiVersion: '2014-11-06', region });
const CacheService = require('../_common/utils/cache-service');
const ttl = 300; // default TTL of 30 seconds
const cache = new CacheService(ttl);

const GITHUB_API = 'https://api.github.com';

let SECRETS;
exports.handler = async event => {
  try {
    console.log('Received event: ', JSON.stringify(event));

    SECRETS = SECRETS || (await decrypt(SSMSECRETS));

    axios.defaults.baseURL = GITHUB_API;
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${SECRETS.GITHUB_TOKEN}`;
    axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json';
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    const eventField = event.field || event[0].field;
    console.log(`Got an Invoke Request. eventField: ${eventField}`);

    switch (eventField) {
      case 'getRepo': {
        const { owner, name } = event.arguments;
        const repo = await getRepo(owner, name);
        return repo;
      }
      case 'allRepos': {
        const repos = (await allRepos()) || [];
        return repos;
      }
      case 'createBranch': {
        const { repository, name, sha } = event.arguments;
        const branch = await createBranch(repository, name, sha);
        return branch;
      }
      case 'deleteBranch': {
        const { repository, name } = event.arguments;
        const branch = await deleteBranch(repository, name);
        return branch;
      }
      case 'repository': {
        const { tags } = event.source;
        const repoName = getTag(tags, 'GIT_REPOSITORY');
        const short = getTag(tags, 'GIT_SHORT');

        if (!repoName) return null;
        const commitUrl =
          (short && getCommitUrl({ repoName, short, owner: GITHUB_USER })) ||
          null;
        const repo = (await getRepo(GITHUB_USER, repoName)) || null;
        return { ...repo, commitUrl };
      }
      case 'branches': {
        const {
          owner: { login: owner },
          name: repo,
        } = event.source;
        const branches = (await getBranches(owner, repo)) || [];
        console.log({ branches });
        return branches;
      }
      default: {
        throw `Unknown field, unable to resolve ${eventField}`;
      }
    }
  } catch (err) {
    throw err;
  }
};

const getCommitUrl = ({ owner, repoName, short }) =>
  `https://github.com/${owner}/${repoName}/commit/${short}`;

const allRepos = () =>
  cache.get(`allRepos`, () =>
    axios.get(`/user/repos?affiliation=owner`, {}).then(({ data }) => data),
  );
const getRepo = (owner, name) =>
  cache.get(`getRepo_${owner}_${name}`, () =>
    axios.get(`/repos/${owner}/${name}`).then(({ data }) => data),
  );
const createBranch = (repo, name, sha) =>
  axios
    .post(`/repos/${GITHUB_USER}/${repo}/git/refs`, {
      ref: `refs/heads/${name}`,
      sha,
    })
    .then(({ data: { url } }) => ({ name, sha, url }));
const deleteBranch = (repo, name) =>
  axios
    .delete(`/repos/${GITHUB_USER}/${repo}/git/refs/heads/${name}`)
    .then(data => {
      console.log(data);
      return { name };
    });
const getBranches = (owner, repo) =>
  cache.get(`getBranches_${owner}_${repo}`, () =>
    axios.get(`/repos/${owner}/${repo}/branches`).then(({ data }) =>
      data.map(({ name, commit }) => ({
        name,
        sha: commit.sha,
        url: commit.url,
      })),
    ),
  );
const getTag = (outputs, key) => {
  const result = _find(outputs, o => o.key === key);
  return (result && result.value) || null;
};
const decrypt = Name =>
  ssm
    .getParameter({
      Name,
      WithDecryption: true,
    })
    .promise()
    .then(({ Parameter: { Value } }) => {
      const decryptedText = String(Value);
      return JSON.parse(decryptedText);
    });
