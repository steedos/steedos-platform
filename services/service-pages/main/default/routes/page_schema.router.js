const express = require("express");
const router = express.Router();
const objectql = require('@steedos/objectql');
const core = require('@steedos/core');

router.get('/api/pageSchema/:type', core.requireAuthentication, async function (req, res) {
    try {

        const userSession = req.user;

        const { app, objectApiName, recordId, formFactor} = req.query;
        const { type } = req.params;

        const pageSchema = await objectql.getSteedosSchema().broker.call(`page.getMeSchema`, {
            type,
            app,
            objectApiName,
            recordId,
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