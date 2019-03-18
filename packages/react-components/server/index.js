var express = require('express');
var ReportRoutes = require('./routes/report');

const port = 3333;
const server = express();
server
  .disable('x-powered-by')
  .use(express.static(__dirname + '/../public/'))
  .use('/assets/', express.static(__dirname + '/../node_modules/@salesforce-ux/design-system/assets/'))
  .use('/assets/stimulsoft/', express.static(__dirname + '/../src/components/stimulsoft/'))
  .use('/api/v2/reports', ReportRoutes)
  .listen(port, () => console.log('static server listening on port ' + port))
