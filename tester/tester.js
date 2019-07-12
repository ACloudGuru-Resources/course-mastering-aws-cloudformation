const handler = require('../Ch6 - Macros & Transforms/StringFunctions/src/index');
const eventData = require('../Ch6 - Macros & Transforms/StringFunctions/tests/event-macro.json');

const prettyjson = require('prettyjson');
const pj = data => prettyjson.render(data, { noColor: true });

handler.handler(eventData, {}, (err, ss) => {
  if (err) {
    console.log(err);
  } else {
    console.log(ss);
  }
});
