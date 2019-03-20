var express = require('express');
var path = require('path');
var ReportRouter = require('./router');

const port = 3600;
const server = express();
var stimulsoftPath = require.resolve("@steedos/stimulsoft-report");
stimulsoftPath = path.dirname(stimulsoftPath);
console.log('stimulsoftPath=1==== ', stimulsoftPath);
stimulsoftPath += "\\assets\\";
console.log('stimulsoftPath=2==== ', stimulsoftPath);
server
  .disable('x-powered-by')
  .use('/assets/stimulsoft-report/', express.static(stimulsoftPath))
  .use('/api', ReportRouter.routes)
  .listen(port, () => console.log('static server listening on port ' + port))