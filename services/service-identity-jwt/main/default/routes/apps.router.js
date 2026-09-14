"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
const passport = require('passport');
const express = require('express');
const router = express.Router();
// 安全修复(E2)：仅允许站内相对路径(非协议相对 "//")或与 ROOT_URL 同源的重定向，防止开放重定向。
const isSafeRedirect = (url) => {
    if (typeof url !== 'string' || !url)
        return false;
    if (/^\/(?!\/)/.test(url))
        return true;
    try {
        const root = process.env.ROOT_URL;
        if (root) {
            const u = new URL(url, root);
            const r = new URL(root);
            return u.host === r.host && (u.protocol === 'http:' || u.protocol === 'https:');
        }
    }
    catch (e) { }
    return false;
};
router.use('/accounts/jwt/login', passport.authenticate('jwt', { session: false }), async (req, res) => {
    account_1.Account.ssoLogin(req, res, { err: null, user: req.user, redirect: false, accessToken: null }).then((loginResult) => {
        if (req.query.redirect && isSafeRedirect(req.query.redirect)) {
            return res.redirect(req.query.redirect);
        }
        delete loginResult.user.services;
        delete loginResult.user.thirdPartyUser;
        return res.status(200).send(loginResult);
    }).catch((err) => {
        console.log(`err`, err);
        return res.status(500).send(err.message);
    });
});
exports.default = router;
