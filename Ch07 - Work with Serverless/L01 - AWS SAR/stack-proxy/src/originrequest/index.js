'use strict';

const middy = require('middy');
const { reroute } = require('middy-reroute');

const handler = middy((event, context, cb) => {
  const request = !!event.Records ? event.Records[0].cf.request : event;
  cb(null, request);
}).use(
  reroute({
    cacheTtl: 2,
  }),
);

module.exports = { handler };
