/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-04-04 16:34:28
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const ejs = require('ejs');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const objectql = require('@steedos/objectql');

router.get('/api/amisListviewDesign', auth.requireAuthentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        let assetUrls = req.query.assetUrls;
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
        const retUrl = process.env.ROOT_URL + `/app/admin/object_listviews/view/${req.query.id}`
        const steedosBuilderUrl = process.env.STEEDOS_BUILDER_URL || 'https://builder.steedos.cn';
        const builderHost = `${steedosBuilderUrl}/amis?${assetUrl}locale=${locale}&retUrl=${retUrl}&unpkgUrl=${process.env.STEEDOS_UNPKG_URL || 'https://unpkg.steedos.cn'}`;
        // 安全修复：原 findOne 不带 userSession，任意登录用户可跨租户读取任意 listview 配置(IDOR)。
        const record = await objectql.getObject('object_listviews').findOne(req.query.id, {}, userSession);
        // let data = fs.readFileSync(__dirname+'/design.html', 'utf8');
        // res.send(data.replace('SteedosBuilderHost',steedosBuilderHost).replace('DataContext', JSON.stringify(dataContext)));

        const filename = __dirname+'/amis_listview_design.ejs'
        const data = {
            builderHost,
            assetUrls,
            rootUrl: process.env.ROOT_URL,
            tenantId: userSession.spaceId,
            userId: userSession.userId,
            authToken: userSession.authToken,
            id: req.query.id,
            object_name: record && record.object_name ? record.object_name : ""
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