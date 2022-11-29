/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-28 18:01:27
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const objectql = require('@steedos/objectql');
const core = require('@steedos/core');

router.get('/api/pageSchema/:type', core.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;

        const { app, objectApiName, recordId, pageId, formFactor} = req.query;
        const { type } = req.params;

        const pageSchema = await objectql.getSteedosSchema().broker.call(`page.getMeSchema`, {
            type,
            app,
            objectApiName,
            recordId,
            pageId,
            formFactor
        }, {
            meta: {
                user: userSession
            }
        });

        res.send(pageSchema || {});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;