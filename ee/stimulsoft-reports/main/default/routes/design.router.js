/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
router.get('/api/reportDesign', core.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;

        const retUrl = __meteor_runtime_config__.ROOT_URL + '/app/admin/stimulsoft_reports/view/' + req.query.reportId
        const builderHost = `https://builder.steedos.com/stimulsoft?retUrl=${retUrl}`;

        const filename = __dirname+'/design.ejs'
        const data = {
            builderHost,
            rootUrl: __meteor_runtime_config__.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            reportId: req.query.reportId,
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;