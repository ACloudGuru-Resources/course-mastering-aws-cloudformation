const clone = require('clone');

const { PROXYENTRY_ARN } = process.env;

const processTemplate = template => {
  let status = 'success';
  let newResources = {};
  const newTemplate = clone(template);
  const resources = newTemplate.Resources;

  for (let name in resources) {
    const resource = resources[name];
    if (resource['Type'] === 'DVB::StackProxy::ProxyEntry') {
      const { Version } = resource;
      const { Service, Stage, Origin } = resource['Properties'];

      if (!(Service && Stage && Origin))
        throw 'You must specify a Service, Stage and Origin';

      newResources[name] = {
        Type: 'Custom::StackProxyEntry',
        Version,
        Properties: {
          ServiceToken: PROXYENTRY_ARN,
          Service,
          Stage,
          Origin,
        },
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
