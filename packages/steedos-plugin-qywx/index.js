const express = require('express');
const router = require('./src/qywx/api').router;
module.exports = {
    init: function () {
        let app = express();
        app.use('', router);
        WebApp.connectHandlers.use(app);
    }
}