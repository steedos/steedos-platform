const express = require('express');
const path = require('path');
const fs= require('fs');
exports.init = function () {
    const publicPath = path.join(__dirname, "public", "schema-builder");
    if(fs.existsSync(publicPath)){
        const router = require('@steedos/router').staticRouter();
        const cacheTime = 1000 * 60 * 60 * 24; 
        let routerPath = "/schema-builder"
        if (process.env.ROOT_URL_PATH_PREFIX)
            routerPath = process.env.ROOT_URL_PATH_PREFIX + routerPath;
        router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
    }
}