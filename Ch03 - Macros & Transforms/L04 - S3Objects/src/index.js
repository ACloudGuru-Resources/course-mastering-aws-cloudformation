const clone = require('clone');

const { LAMBDA_ARN } = process.env;

const processTemplate = template => {
  let status = 'success';
  let newResources = {};
  const newTemplate = clone(template);
  const resources = newTemplate.Resources;

  for (let name in resources) {
    const resource = resources[name];
    if (resource['Type'] === 'AWS::S3::Object') {
      const props = resource['Properties'];
      const Target = props['Target'];
      const bodyType = getBodyType(props);

      if (!bodyType.length === 1)
        throw 'You must specify exactly one of: Body, Base64Body, Source';

      if (!Target['ACL']) Target['ACL'] = 'private';

      const resource_props = {
        ServiceToken: LAMBDA_ARN,
        Target,
        [bodyType]: props[bodyType],
      };

      newResources[name] = {
        Type: 'Custom::S3Object',
        Version: '1.0',
        Properties: resource_props,
      };
    }
  }

  for (let name in newResources) {
    const resource = newResources[name];
    resources[name] = resource;
  }

  return [status, newTemplate];
};

exports.handler = (event, context, callback) => {
  console.log('event', JSON.stringify(event));
  const { requestId } = event;
  const [status, fragment] = processTemplate(event.fragment);
  const resp = {
    requestId,
    status,
    fragment,
  };

  callback(null, resp);
};

const getBodyType = props =>
  Object.getOwnPropertyNames(props).filter(item =>
    ['Body', 'Base64Body', 'Source'].includes(item),
  );
