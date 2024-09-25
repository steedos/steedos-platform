/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
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

router.get('/api/amisObjectFieldsDesign', core.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        let assetUrls = getPublicAssetUrls(req.query.assetUrls);
        const assetUrl = `assetUrl=${assetUrls.split(',').join("&assetUrl=")}&`;

        // const dataContext = {
        //     rootUrl: __meteor_runtime_config__.ROOT_URL,
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
        const retUrl = req.query.retUrl || __meteor_runtime_config__.ROOT_URL + '/app/admin/objects/view/' + req.query.oid
        const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
        const builderHost = `${steedosBuilderUrl}/object?${assetUrl}retUrl=${retUrl}&locale=${locale}&isObjectDesign=1&pType=objectDesign`;

        const filename = __dirname+'/object_fields_design.ejs'
        const data = {
            builderHost,
            assetUrls,
            rootUrl: __meteor_runtime_config__.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            userSession: userSession,
            id: req.query.oid,
            useOpenAPI: process.env.STEEDOS_PUBLIC_USE_OPEN_API
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            if(err){
                console.log(`err`, err)
            }
            // str => Rendered HTML string
            res.send(str);
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;