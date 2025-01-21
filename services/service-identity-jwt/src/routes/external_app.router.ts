/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-11-23 15:54:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:28:04
 * @Description: 新增jwt 接口(GET), 所有第三方应用都通过此接口转发出去, 自动带上 jwt 加密(app.secret)后的数据,比如username、email等.
 */
const express = require('express');
const router =express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql')
const jwt = require('jsonwebtoken')

router.get('/api/external/app/:appId', auth.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        // const spaceId = userSession.spaceId;
        // const userId = userSession.userId;
        // const isSpaceAdmin = userSession.is_space_admin;
        const { appId } = req.params

        const appObj = objectql.getObject('apps')

        const appDoc = await appObj.findOne(appId)

        if (!appDoc) {
            throw new Error(`not found app by ${appId}`)
        }

        const { url, secret } = appDoc

        if (!url) {
            throw new Error(`url is null in ${appId}`)
        }

        if (!secret) {
            throw new Error(`secret is null in ${appId}`)
        }

        const options = { expiresIn: 10 * 60 } // 有效期十分钟
        const token = jwt.sign({
            profile: {
                name: userSession.name,
                username: userSession.username,
                email: userSession.email
            }
        }, secret, options);

        res.redirect(`${url}?t=${token}`);
    } catch (error) {
        objectql.getSteedosSchema().broker.logger.error(error.stack)
        res.status(500).send({ success: false, message: error.message })
    }
});
exports.default = router;