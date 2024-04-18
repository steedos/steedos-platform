/*
 * @Author: 孙浩林 6194896+sunhaolin@users.noreply.github.com
 * @Date: 2023-12-10 11:09:40
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-04-18 16:09:10
 * @FilePath: /steedos-platform-2.3/services/service-pages/main/default/routes/page_render.router.js
 * @Description: 支持使用schemaApi动态渲染页面，支持匿名访问。
 */
const express = require('express');
const router = express.Router();
const ejs = require('ejs');

router.get('/api/page/render', async function (req, res) {
    try {
        res.set('Content-Type', 'text/html');
        const { schemaApi, data: queryData } = req.query;

        const pageSchema = {
            "type": "page",
            "body": {
                "type": "service",
                "schemaApi": schemaApi
            }
        }

        let assetUrls = req.query.assetUrls;

        let locale = "zh-CN";
        if (req.query.locale == "en-us") {
            locale = "en-US";
        } else if (req.query.locale == "zh-cn") {
            locale = "zh-CN";
        }

        const filename = __dirname + '/page_view.ejs';
        const data = {
            Title: 'page.label',
            pageApiName: 'page.name',
            STEEDOS_UNPKG_URL: process.env.STEEDOS_UNPKG_URL,
            STEEDOS_AMIS_URL: process.env.STEEDOS_AMIS_URL,
            STEEDOS_PUBLIC_PAGE_ASSETURLS: assetUrls || process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS,
            NODE_ENV: process.env.NODE_ENV,
            ROOT_URL: __meteor_runtime_config__.ROOT_URL,
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
            pageSchema: pageSchema,
            __meteor_runtime_config__: __meteor_runtime_config__,
            queryData,
            STEEDOS_PUBLIC_USE_OPEN_API: process.env.STEEDOS_PUBLIC_USE_OPEN_API
        }
        const options = {}
        ejs.renderFile(filename, data, options, function (err, str) {
            // str => Rendered HTML string
            if (err) {
                console.log(`err`, err)
            }
            res.send(str);
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;