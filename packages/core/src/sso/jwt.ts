declare var Package: any;

export function loadJWTSSOAPI() {
    let express = require('express');
    let steedosAuth = require('@steedos/auth');
    let jwtRouter = steedosAuth.jwtRouter;
    let app = express();

    app.use('/api-v2', jwtRouter);
    if (typeof Package.webapp.WebApp !== "undefined") {
        Package.webapp.WebApp.connectHandlers.use(app);
    } else {
        console.error('undefined WebApp');
    }
    return
}