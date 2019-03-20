var server = require('@steedos/meteor-bundle-runner');

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        require("./index");
        server.runMain();
    });
}).run();