/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const fs = require('fs');
const _ = require('lodash');
router.get('/api/pageDesign', core.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        let assetUrl = "";
        if(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS && _.isString(process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS)){
            const assetUrls = process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS.split(',');
            assetUrl = `assetUrl=${assetUrls.join("&assetUrl=")}&`;
        }
        const steedosBuilderHost = `https://builder.steedos.com/amis?${assetUrl}rootUrl=${__meteor_runtime_config__.ROOT_URL}&authToken=${userSession.authToken}&userId=${userSession.userId}&tenantId=${userSession.spaceId}&__q=`;

        let data = fs.readFileSync(__dirname+'/design.html', 'utf8');
        res.send(data.replace('SteedosBuilderHost',steedosBuilderHost));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;