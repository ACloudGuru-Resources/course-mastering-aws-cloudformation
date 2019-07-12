'use strict';

const middy = require('middy');

const handler = middy((event, context, cb) => {
  console.log('event: ', JSON.stringify(event));
  const { response } = event.Records[0].cf;
  cb(null, response);
});

module.exports = { handler };
