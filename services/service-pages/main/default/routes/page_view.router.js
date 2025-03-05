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

router.get('/api/page/view/:pageId', auth.authentication, async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const userSession = req.user;
        const { pageId } = req.params;
        const page = await objectql.getObject('pages').findOne(pageId)
        const pageVersion = await objectql.broker.call(`page.getLatestPageVersion`, {pageId: pageId});
        if(!pageVersion){
            return res.status(404).send({ message: 'Page not found' });
        }else if(page.type != 'app'){
            // 如果不是app类型的page,则返回错误信息
            return res.status(404).send({ message: 'Must be App page.' });
        }

        // 如果当前用户未登录,且页面不允许匿名访问,则跳转到登录页面
        if(!userSession && !page.allow_anonymous){
            return res.redirect(`/login?redirect_uri=${encodeURIComponent(`/api/page/view/${pageId}`)}`);
        }
        
        let assetUrls = req.query.assetUrls;

        let locale = "zh-CN";
        if (req.query.locale == "en-us") {
            locale = "en-US";
        } else if (req.query.locale == "zh-cn") {
            locale = "zh-CN";
        }

        const filename = __dirname+'/page_view.ejs';
        const data = {
            Title: page.label,
            pageApiName: page.name,
            STEEDOS_UNPKG_URL: process.env.STEEDOS_UNPKG_URL,
            STEEDOS_AMIS_URL: process.env.STEEDOS_AMIS_URL,
            STEEDOS_PUBLIC_PAGE_ASSETURLS: assetUrls || process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS,
            NODE_ENV: process.env.NODE_ENV,
            ROOT_URL: process.env.ROOT_URL,
            STEEDOS_VERSION: process.env.STEEDOS_VERSION,
            STEEDOS_AMIS_VERSION: process.env.STEEDOS_AMIS_VERSION,
            STEEDOS_PUBLIC_SCRIPT_VCONSOLE: process.env.STEEDOS_PUBLIC_SCRIPT_VCONSOLE,
            STEEDOS_PUBLIC_SCRIPT_PLUGINS: process.env.STEEDOS_PUBLIC_SCRIPT_PLUGINS,
            STEEDOS_PUBLIC_STYLE_PLUGINS: process.env.STEEDOS_PUBLIC_STYLE_PLUGINS,
            STEEDOS_LOCALE: locale,
            USER_CONTEXT: {
                user: userSession,
                userId: userSession.userId,
                spaceId: userSession.spaceId
            },
            pageSchema: _.isString(pageVersion.schema) ? JSON.parse(pageVersion.schema) : pageVersion.schema,
            // __meteor_runtime_config__: __meteor_runtime_config__,
            STEEDOS_PUBLIC_USE_OPEN_API: process.env.STEEDOS_PUBLIC_USE_OPEN_API
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            // str => Rendered HTML string
            if(err){
                console.log(`err`, err)
            }
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});

router.get('/api/page/public/:pageId', async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const { pageId } = req.params;
        const page = await objectql.getObject('pages').findOne(pageId)
        const pageVersion = await objectql.broker.call(`page.getLatestPageVersion`, {pageId: pageId});
        if(!pageVersion){
            return res.status(404).send({ message: 'Page not found' });
        }else if(page.type != 'app'){
            // 如果不是app类型的page,则返回错误信息
            return res.status(404).send({ message: 'Must be App page.' });
        }
        
        let assetUrls = req.query.assetUrls;

        let locale = "zh-CN";
        if (req.query.locale == "en-us") {
            locale = "en-US";
        } else if (req.query.locale == "zh-cn") {
            locale = "zh-CN";
        }

        const filename = __dirname+'/page_view.ejs';
        const data = {
            Title: page.label,
            pageApiName: page.name,
            STEEDOS_UNPKG_URL: process.env.STEEDOS_UNPKG_URL,
            STEEDOS_AMIS_URL: process.env.STEEDOS_AMIS_URL,
            STEEDOS_PUBLIC_PAGE_ASSETURLS: assetUrls || process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS,
            NODE_ENV: process.env.NODE_ENV,
            ROOT_URL: process.env.ROOT_URL,
            STEEDOS_VERSION: process.env.STEEDOS_VERSION,
            STEEDOS_AMIS_VERSION: process.env.STEEDOS_AMIS_VERSION,
            STEEDOS_PUBLIC_SCRIPT_VCONSOLE: process.env.STEEDOS_PUBLIC_SCRIPT_VCONSOLE,
            STEEDOS_PUBLIC_SCRIPT_PLUGINS: process.env.STEEDOS_PUBLIC_SCRIPT_PLUGINS,
            STEEDOS_PUBLIC_STYLE_PLUGINS: process.env.STEEDOS_PUBLIC_STYLE_PLUGINS,
            STEEDOS_LOCALE: locale,
            USER_CONTEXT: {
                user: {},
                userId: "",
                spaceId: ""
            },
            pageSchema: _.isString(pageVersion.schema) ? JSON.parse(pageVersion.schema) : pageVersion.schema,
            // __meteor_runtime_config__: __meteor_runtime_config__,
            STEEDOS_PUBLIC_USE_OPEN_API: process.env.STEEDOS_PUBLIC_USE_OPEN_API
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            // str => Rendered HTML string
            if(err){
                console.log(`err`, err)
            }
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;