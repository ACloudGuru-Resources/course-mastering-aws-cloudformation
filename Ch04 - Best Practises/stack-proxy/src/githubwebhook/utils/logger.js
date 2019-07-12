const debug = require('debug');
const log = debug('reroute:log');
log.log = console.log.bind(console);

module.exports = log;
