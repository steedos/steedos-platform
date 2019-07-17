declare var Package: any;

export function loadJWTSSOAPI() {
    if (typeof Package == "undefined") {
        console.error('undefined Package');
        return
    }
    if (typeof Package.webapp == "undefined") {
        console.error('undefined Package.webapp');
        return
    }
    if (typeof Package.webapp.WebApp == "undefined") {
        console.error('undefined Package.webapp.WebApp');
        return
    }
    let express = require('express');
    let steedosAuth = require('@steedos/auth');
    let jwtRouter = steedosAuth.jwtRouter;
    let app = express();

    app.use('/api-v2', jwtRouter);
    Package.webapp.WebApp.connectHandlers.use(app);

    return
}