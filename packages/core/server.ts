var server = require('@steedos/meteor-bundle-runner');
import {default as Project} from "./src/project/Project";
import { ODataRouter } from '.';

declare var WebApp: any;

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        Project.load(__dirname + "/../../objects/accounts/src");
        Project.load(__dirname + "/../../objects/contracts/src");
        Project.load(__dirname + "/../../apps/crm/src");
        //require("../../apps/crm/src")
        var express = require('express');
        let app = express();
        app.use('/api/odata/v2', ODataRouter);
        WebApp.connectHandlers.use(app);
        server.runMain();
    });
}).run();