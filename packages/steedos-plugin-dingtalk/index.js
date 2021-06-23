"use strict";
exports.__esModule = true;
const express = require('express');
const path = require('path');
var router = require('./src/dingtalk/server_callback');
exports.init = function (_a) {
    var app = _a.app;
    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use('', router.router);
};