const express = require('express');
const SHA256 = require("sha256");
const bcrypt = require('bcrypt');
import { getSession, auth } from './session';
import { utils } from './utils';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/api/v4/users/login', async function (req: Request, res: Response) {
    let username = req.body["username"];
    let password = req.body["password"];
    let spaceId = req.body["spaceId"]; // 需要登录的工作区Id，如果不传入，自动选中第一个工作区
    let bcryptPassword = SHA256(password);
    let user = Meteor.users.findOne({
        $or: [{ "username": username }, { "emails.address": username }, { "mobile": username }]
    });
    if (!user) {
        res.status(401).send();
        return;
    }
    let match = await bcrypt.compare(bcryptPassword, user.services.password.bcrypt);
    if (!match) {
        res.status(401).send();
        return;
    }
    let authtToken = null;
    let stampedAuthToken = utils._generateStampedLoginToken();
    authtToken = stampedAuthToken.token;
    let hashedToken = utils._hashStampedToken(stampedAuthToken);
    await utils._insertHashedLoginToken(user._id, hashedToken);
    let userSession = await getSession(authtToken, spaceId);
    // set cookie to response
    // maxAge 3 month
    utils._setAuthCookies(req, res, user._id, authtToken, userSession.spaceId);
    res.setHeader('X-Space-Token', userSession.spaceId + ',' + authtToken);
    return res.send(userSession);
})


router.post('/api/v4/users/validate', async function (req: Request, res: Response) {
    let userSession = await auth(req, res);
    if (userSession) {
        utils._setAuthCookies(req, res, userSession.userId, userSession.authToken, userSession.spaceId);

        return res.send(userSession);
    }
    return res.status(401).send({
        "error": "Validate Request -- Missing X-Auth-Token",
        "instance": "1329598861",
        "success": false
    })
})

export let initRouter = router;