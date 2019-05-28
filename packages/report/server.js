var objectql = require("@steedos/objectql");
var _ = require('underscore');
const graphqlHTTP = require('express-graphql');
var path = require('path');
var ReportRouter = require('./router');
var getReportMrt = require('./index').getReportMrt;

let stimulsoftAssets = path.join(path.dirname(require.resolve("@steedos/stimulsoft-report")), "assets");
let objectsDir = path.resolve('./objects')
let reportsDir = path.resolve('./reports')
objectql.getSteedosSchema().addDataSource('default', {
    driver: 'mongo',
    url: 'mongodb://192.168.0.77/qhd-beta',
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
    console.log(`====${name}=reports===`);
    console.log(datasource.getReports());
    _.forEach(datasource.getReports(),(report) => {
        let mrt = getReportMrt(report);
        console.log(`====${name}=mrt===`);
        console.log(mrt);
    });

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



