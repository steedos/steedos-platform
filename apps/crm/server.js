var server = require('@steedos/meteor-bundle-runner');

server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        server.callStartupHooks();
        require("@steedos/object-accounts");
        require("@steedos/object-contracts");
        require("./src");
        server.runMain();
    });
}).run();