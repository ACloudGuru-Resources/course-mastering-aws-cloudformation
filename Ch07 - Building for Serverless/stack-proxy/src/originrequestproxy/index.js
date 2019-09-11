'use strict';

process.env.DEBUG = 'reroute:log';

const middy = require('middy');
const { reroute, rerouteOrigin } = require('middy-reroute');
const functionSuffix = '-originrequestproxy';

const handler = middy((event, context, cb) => {
  const request = !!event.Records ? event.Records[0].cf.request : event;
  cb(null, request);
})
  .use(rerouteOrigin({ functionSuffix }))
  .use(
    reroute({
      cacheTtl: 2,
    }),
  );

module.exports = { handler };
