var server = require('@steedos/meteor-bundle-runner');
var path = require('path');
// import { default as Project } from "./project/Project";
import { ODataRouter, use } from '.';
import MongoDataSource from './datasource/MongoDataSource';

declare var WebApp: any;

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        try {
            
            //use('../../standard-objects');

            use(path.resolve(__dirname, "../../standard-objects"));
            use(path.resolve(__dirname, "../../../apps/crm/src"));
            // use(path.resolve(__dirname, "../../../apps/app-meeting"));

            let express = require('express');
            let app = express();
            app
                .use('/api/odata/v2', ODataRouter)
                .disable('x-powered-by')
                .use('/assets/stimulsoft-report/', express.static(__dirname + '/node_modules/@steedos/stimulsoft-report/assets/'))
            WebApp.connectHandlers.use(app);

            let defaultDataSource = new MongoDataSource( {
                name: "fssh20181214", 
                type: "mongodb", 
                connectionUri: "mongodb://192.168.0.21/"
            });
            let queryOptions = {};
            defaultDataSource.find("apps_auths", [["2"]], ["abc"], queryOptions);

        } catch (error) {
            console.error(error)
            throw error
        }
        //require("../../apps/crm/src")
        server.runMain();
    });
}).run();