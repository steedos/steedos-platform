/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-08 23:28:39
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-16 15:11:01
 * @Description: 
 */
import * as express from 'express';
import { Account } from './account'
const passport = require('passport');

const router = express.Router();

router.use('/identity/jwt', passport.authenticate('jwt', { session: false }), async (req: any, res) => {
    Account.ssoLogin(req, res, { err: null, user: req.user, redirect: false, accessToken: null }).then((loginResult) => {
        delete loginResult.user.services;
        delete loginResult.user.thirdPartyUser;
        return res.status(200).send(loginResult)
    }).catch((err) => {
        console.log(`err`, err)
        return res.status(500).send(err.message);
    })
});

exports.default = router;