dotenv = require('dotenv-flow');
dotenv.config()

var server = require('@steedos/meteor-bundle-runner');
var steedos = require('@steedos/core');
var i18n = require('@steedos/i18n');
console.log('i18n', i18n);
console.log('default key', i18n.t('key'))
console.log('zh-CN key', i18n.t('key', {lng: 'zh-CN'}));
console.log('zh-CN key getFixedT', i18n.getFixedT('zh-CN')('key'));
server.Fiber(function () {
    try {
        server.Profile.run("Server startup", function () {
            server.loadServerBundles();
            steedos.init();
            server.callStartupHooks();
            server.runMain();
        })
    } catch (error) {
       console.error(error.stack)
    }
}).run()
