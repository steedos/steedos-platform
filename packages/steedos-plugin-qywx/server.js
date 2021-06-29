require('dotenv-flow').config();

var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core');
var qywx_sso = require('./index');

server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            server.loadServerBundles();
            steedos.init();
            server.callStartupHooks();
            server.runMain();
            WebApp.httpServer.setTimeout(60000);
            qywx_sso.init();
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
