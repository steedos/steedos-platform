const express = require('express');
// const app = express();
const path = require('path');
const fs= require('fs');
export const initPublicStaticRouter = () => {
    const publicPath = path.join(process.cwd(), "public");
    if(fs.existsSync(publicPath)){
        const router = express.Router()
        const cacheTime = 1000 * 60 * 60 * 24; 
        let routerPath = "/"
        if (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX)
            routerPath = __meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/";
        router.use(routerPath, express.static(publicPath, { maxAge: cacheTime }));
        WebApp.rawConnectHandlers.use(router);
    }
}