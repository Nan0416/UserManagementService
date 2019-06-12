const tracer = require('tracer');
const logger = tracer.dailyfile({root:'logs', maxLogFiles: 10, allLogsFileName: 'monitorauth-log'});

module.exports = logger;
