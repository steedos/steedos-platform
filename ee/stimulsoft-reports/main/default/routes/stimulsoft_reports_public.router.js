const express = require("express");
const router = require('@steedos/router').staticRouter();
const path = require('path');
const publicPath = require.resolve('stimulsoft-reports-js');
const fs = require('fs');
if (fs.existsSync(publicPath)) {
    const router = express.Router()
    const cacheTime = 1000 * 60 * 60 * 24;
    let routerPath = "/stimulsoft-reports-js"
    let rootPath = '/'
    if (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) {
        rootPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX
        routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + routerPath;
    }
    router.use(`${routerPath}/Css`, express.static(path.join(publicPath, '..', 'Css'), { maxAge: cacheTime }));
    router.use(`${routerPath}/Scripts`, express.static(path.join(publicPath, '..', 'Scripts'), { maxAge: cacheTime }));
    router.use(rootPath, express.static(path.join(__dirname, '..', "public"), { maxAge: cacheTime }));
    // WebApp.rawConnectHandlers.use(router);
}
exports.default = router;