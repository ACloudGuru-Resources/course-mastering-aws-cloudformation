const RESOURCES_SUPPORTING_TAGS = require('./resources_supporting_tags.json');

exports.handler = (event, context, callback) => {
  console.log('event', JSON.stringify(event), RESOURCES_SUPPORTING_TAGS);
  const { requestId, fragment, params: tags } = event;
  const resources = fragment.Resources;

  if (tags) tagResources(resources, tags);

  const resp = {
    requestId,
    status: 'success',
    fragment,
  };

  callback(null, resp);
};

const isTaggable = ({ Properties, Type }) =>
  (Properties && Properties.Tags) || RESOURCES_SUPPORTING_TAGS.includes(Type);

const isTaggedWithAlready = (tag, resourceTags) => {
  for (const tagObj in resourceTags) {
    if (resourceTags[tagObj].Key === tag) return true;
  }
  return false;
};

const tagResources = (resources, tags) => {
  for (const key in resources) {
    tagResource(resources[key], tags);
  }
};

const tagResource = (resource, tags) => {
  const resourceTags = (resource.Properties && resource.Properties.Tags) || [];
  console.log('tagResource', resourceTags);
  if (isTaggable(resource)) {
    for (const Key in tags) {
      if (!isTaggedWithAlready(Key, resourceTags)) {
        resourceTags.push({
          Key,
          Value: tags[Key],
        });
      }
    }
  }
};
