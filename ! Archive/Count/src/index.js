const clone = require('clone');

const processTemplate = template => {
  let status = 'success';
  const newTemplate = clone(template);
  const resources = newTemplate.Resources;

  for (var name in resources) {
    const resource = resources[name];
    if (resource.Count) {
      const count = resource.Count;
      console.log(
        `Found 'Count' property with value ${count} in '${name}' resource....multiplying!`,
      );

      // Remove Count from resource
      delete resource.Count;

      // Make copy of resource and remove it from the resources
      const resourceToCopy = resource;
      delete resources[name];

      // Multiply the resource
      for (let i = 1; i <= count; i++) {
        resources[`${name}${i}`] = updatePlaceholder(resourceToCopy, i);
      }
    } else {
      console.log(
        `id not find 'Count' property in '${name}' resource....Nothing to do!`,
      );
    }
  }

  return [status, newTemplate];
};

const updatePlaceholder = (resourceStructure, iteration) => {
  const resourceString = JSON.stringify(resourceStructure).replace(
    /%d/g,
    iteration,
  );
  return JSON.parse(resourceString);
};

exports.handler = (event, context, callback) => {
  // console.log('event', JSON.stringify(event));
  const { requestId } = event;
  const [status, fragment] = processTemplate(event.fragment);
  const resp = {
    requestId,
    status,
    fragment,
  };

  callback(null, resp);
};
