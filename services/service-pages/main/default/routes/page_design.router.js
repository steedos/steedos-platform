/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const objectql = require('@steedos/objectql');

const getPublicAssetUrls = function(assetUrls){
    const values = _.map(_.split(assetUrls), (item)=>{
        if(_.startsWith(item, '/')){
            return Meteor.absoluteUrl(item) ;
        }else{
            return item;
        }
    })
    return _.join(values, ',')
}

router.get('/api/pageDesign', auth.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        let assetUrls = getPublicAssetUrls(req.query.assetUrls);
        const assetUrl = `assetUrl=${assetUrls.split(',').join("&assetUrl=")}&`;

        // const dataContext = {
        //     rootUrl: process.env.ROOT_URL,
        //     tenantId: userSession.spaceId,
        //     userId: userSession.userId,
        //     authToken: userSession.authToken
        // }
        let locale = "zh-CN";
        if (req.query.locale == "en-us") {
            locale = "en-US";
        } else if (req.query.locale == "zh-cn") {
            locale = "zh-CN";
        }
        const page = await objectql.broker.call(`page.getLatestPageVersion`, {pageId: req.query.pageId});
        const retUrl = req.query.retUrl || process.env.ROOT_URL + '/app/admin/pages/view/' + req.query.pageId
        const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
        const builderHost = `${steedosBuilderUrl}/amis?${assetUrl}retUrl=${retUrl}&locale=${locale}&pageType=${page.type}`;

        const filename = __dirname+'/page_design.ejs'
        const data = {
            builderHost,
            assetUrls,
            rootUrl: process.env.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            pageId: req.query.pageId,
            userSession: userSession,
            useOpenAPI: process.env.STEEDOS_PUBLIC_USE_OPEN_API
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            // str => Rendered HTML string
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;