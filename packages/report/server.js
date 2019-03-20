var express = require('express');
var path = require('path');
var ReportRouter = require('./router');

const port = 3600;
const server = express();

stimulsoftAssets = path.join(path.dirname(require.resolve("@steedos/stimulsoft-report")), "assets");

server
  .disable('x-powered-by')
  .use('/assets/stimulsoft-report/', express.static(stimulsoftAssets))
  .use('/api', ReportRouter.routes)
  .listen(port, () => console.log('report server listening on port ' + port))