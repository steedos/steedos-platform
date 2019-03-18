var server = require('@steedos/meteor-bundle-runner');
import {default as Project} from "./src/project/Project";

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        try {
            Project.load(__dirname + "/../../objects/accounts/src");
            Project.load(__dirname + "/../../objects/contracts/src");
            Project.load(__dirname + "/../../apps/crm/src");
            Project.load(__dirname + "/../standard-objects");
        } catch (error) {
            console.error(error)
            throw error
        }
        //require("../../apps/crm/src")
        server.runMain();
    });
}).run();