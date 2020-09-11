
import * as express from 'express';
const SHA256 = require("sha256");
const bcrypt = require('bcryptjs');
import { getSession } from '../session';
import { setAuthCookies, generateStampedLoginToken, hashStampedToken, insertHashedLoginToken } from '../utils';

declare var Meteor;

export const login = async (req: express.Request, res: express.Response) => {
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
    let stampedAuthToken = generateStampedLoginToken();
    authtToken = stampedAuthToken.token;
    let hashedToken = hashStampedToken(stampedAuthToken);
    await insertHashedLoginToken(user._id, hashedToken);
    let userSession = await getSession(authtToken, spaceId);
    // set cookie to response
    // maxAge 3 month
    setAuthCookies(req, res, user._id, authtToken, userSession.spaceId);
    res.setHeader('X-Space-Token', userSession.spaceId + ',' + authtToken);
    return res.send(userSession);
}