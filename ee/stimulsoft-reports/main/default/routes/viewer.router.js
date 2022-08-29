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
router.get('/api/reportViewer', core.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;

        const retUrl = __meteor_runtime_config__.ROOT_URL + '/app/admin/stimulsoft_reports/view/' + req.query.reportId
        const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
        const builderHost = `${steedosBuilderUrl}/stimulsoft/viewer?retUrl=${retUrl}`;
        let {  parameters } = req.query;
        if(parameters){
            parameters = JSON.parse(decodeURIComponent(parameters));
        }
        const filename = __dirname+'/viewer.ejs'
        const data = {
            builderHost,
            rootUrl: __meteor_runtime_config__.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            reportId: req.query.reportId,
            parameters: parameters || {}
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