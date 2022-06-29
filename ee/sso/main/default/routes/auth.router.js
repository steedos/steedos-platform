"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-24 17:15:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-28 16:19:51
 * @Description:
 */
const express = require("express");
const ejs = require('ejs');
const authController = require("./auth");
const path = require("path");
const router = express.Router();
router
    .get("/api/global/auth/oidc/config", //"/api/global/auth/oidc/configs/:configId",
authController.oidcPreAuth)
    .get("/api/global/auth/oidc/callback", authController.oidcAuth)
    .get("/api/global/auth/oidc/error-callback", function (req, res) {
    return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
        const filename = path.join(__dirname, '..', '..', '..', 'ejs', 'error-callback.ejs');
        const data = {};
        const options = {};
        ejs.renderFile(filename, data, options, function (err, str) {
            // str => Rendered HTML string
            res.send(str);
        });
    });
})
    .post('/api/global/auth/oidc/login', authController.oidcLogin);
exports.default = router;
