var express = require('express');
var path = require('path');
var ReportRouter = require('./router');

process.env.PORT=3600;

stimulsoftAssets = path.join(path.dirname(require.resolve("@steedos/stimulsoft-report")), "assets");

var server = require('@steedos/meteor-bundle-runner');

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();

        var app = express();
        app
            .disable('x-powered-by')
            .use('/assets/stimulsoft-report/', express.static(stimulsoftAssets))
            .use('/api/report', ReportRouter.routes)
            WebApp.connectHandlers.use(app);

        server.runMain();
    });
}).run();
