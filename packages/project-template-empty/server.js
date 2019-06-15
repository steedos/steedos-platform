var server = require('@steedos/meteor-bundle-runner');
var objectql = require("@steedos/objectql");
var _ = require('underscore')
server.Fiber(function () {
    server.Profile.run("Server startup", function () {
        server.loadServerBundles();
        try {
            var steedosSchema = objectql.getSteedosSchema();
            /* 初始化steedos-config中配置的数据源 */
            _.forEach(steedosSchema.getDataSources(), dataSource=>{
                dataSource.init()
            })
        } catch (error) {
            console.log(error);
        }
        server.callStartupHooks();
        server.runMain();
    });
}).run();