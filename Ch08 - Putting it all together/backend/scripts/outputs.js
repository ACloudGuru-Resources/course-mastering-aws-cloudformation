const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const tomlify = require('tomlify-j0.4');
const program = require('commander');

const main = async () => {
  try {
    program
      .option('-s, --stackname <stackname>', 'stack name')
      .option('-p, --profile <profile>', 'profile')
      .option('-r, --region <region>', 'region', 'us-east-1')
      .option('-o, --output-file <outputFile>', 'output file', '.env')
      .option('-x, --prefix <prefix>', 'app prefix', 'GATSBY_')
      .option('-i, --include <include>', 'include', processIncludes, {})
      .action(run);

    await program.parseAsync(process.argv);
  } catch (error) {
    console.log(error);
  }
};

const run = async ({
  stackname,
  region,
  profile,
  outputFile,
  prefix,
  include,
}) => {
  try {
    profile && loadCredientials(profile);
    const includeOutputs = filterUndefined(include);
    const outputs = await getOutputs({ stackname, region });
    const outputsObj = outputsToObj(outputs, includeOutputs);
    const finalObj = { ...include, ...outputsObj };
    const processedObj = addAppPrefix(finalObj, prefix);
    await saveFile(processedObj, outputFile);
  } catch (error) {
    console.log(error);
  }
};

const loadCredientials = profile => {
  process.env.AWS_PROFILE = profile;
};
const processIncludes = (value, previous) => {
  const i = value.split(/=(.+)/);
  const obj = { [i[0]]: i[1] };
  return { ...previous, ...obj };
};
const filterUndefined = obj =>
  Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined) return acc;
    return [...acc, key];
  }, []);
const getOutputs = ({ stackname: StackName, region }) => {
  const CFN = new AWS.CloudFormation({ apiVersion: '2010-05-15', region });
  return CFN.describeStacks({ StackName })
    .promise()
    .then(data => data.Stacks[0].Outputs);
};
const outputsToObj = (outputs, include) =>
  outputs.reduce((a, c) => {
    if (include && !include.includes(c.OutputKey)) return a;
    return { ...a, [c.OutputKey]: c.OutputValue };
  }, {});
const objToToml = obj => tomlify.toToml(obj);
const saveFile = (outputs, outputFile) => {
  const pathFile = path.resolve(process.cwd(), outputFile);
  fs.writeFileSync(pathFile, objToToml(outputs));
};
const camelToSnakeCase = string =>
  string.replace(
    /[A-Z]/g,
    (letter, index) => `${index > 0 ? '_' : ''}${letter}`,
  );
const addAppPrefix = (outputs, prefix = 'GATSBY_') => {
  const processedOutputs = {};
  Object.keys(outputs).forEach(key => {
    const newKey = `${prefix}${camelToSnakeCase(key)}`.toUpperCase();
    processedOutputs[newKey] = outputs[key];
  });
  return processedOutputs;
};

main();
