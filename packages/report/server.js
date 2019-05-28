const objectql = require("@steedos/objectql");
const _ = require('underscore');
const graphqlHTTP = require('express-graphql');
const path = require('path');
const ReportRouter = require('./router');
const report = require('./index');

let stimulsoftAssets = path.join(path.dirname(require.resolve("@steedos/stimulsoft-report")), "assets");
let objectsDir = path.resolve('./objects')
let reportsDir = path.resolve('./reports')
objectql.getSteedosSchema().addDataSource('default', {
    driver: 'mongo',
    // url: 'mongodb://192.168.0.77/qhd-beta',
    url: 'mongodb://192.168.0.21/fssh20190329',
    objectFiles: [objectsDir],
    reportFiles: [reportsDir]
});
let express = require('express');
let app = express();
app.use(function (req, res, next) {
    //TODO 处理userId
    next();
})

_.each(objectql.getSteedosSchema().getDataSources(), function (datasource, name) {
    report.initMrts(datasource.getReports(), reportsDir);

    app.use(`/graphql/${name}`, graphqlHTTP({
        schema: datasource.buildGraphQLSchema(),
        graphiql: true
    }));
})
app
    .disable('x-powered-by')
    .use('/assets/stimulsoft-report/', express.static(stimulsoftAssets))
    .use('/api/report', ReportRouter.routes)

process.env.PORT = 3600;
app.listen(process.env.PORT || 3000)



