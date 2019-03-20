var server = require('@steedos/meteor-bundle-runner');
var path = require('path');
import { default as Project } from "./project/Project";
import { ODataRouter } from '.';

declare var WebApp: any;

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        try {
            
            Project.load(path.resolve(__dirname, "../../standard-objects"));
            Project.load(path.resolve(__dirname, "../../../apps/crm/src"));
            Project.load(path.resolve(__dirname, "../../../apps/app-meeting"));

            let express = require('express');
            let app = express();
            app
                .use('/api/odata/v2', ODataRouter)
                .disable('x-powered-by')
                .use('/assets/stimulsoft-report/', express.static(__dirname + '/node_modules/@steedos/stimulsoft-report/assets/'))
            WebApp.connectHandlers.use(app);
        } catch (error) {
            console.error(error)
            throw error
        }
        //require("../../apps/crm/src")
        server.runMain();
    });
}).run();