dotenv = require('dotenv-flow');
dotenv.config()
var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core');
server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            console.time('loadServerBundles');
            server.loadServerBundles();
            console.timeEnd('loadServerBundles');
            console.time('init');
            steedos.init();
            console.timeEnd('init');
            console.time('callStartupHooks')
            server.callStartupHooks();
            console.timeEnd('callStartupHooks');
            console.time('runMain')
            server.runMain();
            console.timeEnd('runMain');
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
