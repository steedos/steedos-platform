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
const path = require('path');

/**
 * 虽然script 标签的 async = false; 可以解决js之间的依赖顺序问题, 但是它无法做到比 HTML 中其他非动态加载的 script 脚本更早执行
 * 所以调整了meteor 内核加载 bundledJs、staticJs的方式 (creator/packages/boilerplate-generator)
 */
router.get('/main_head.js', async function (req, res) {
    try {
        const { platform } = req.query;
        res.set('Content-Type', 'application/javascript; charset=UTF-8');
        const filename = path.join(__dirname, 'main_head.ejs');
        const data = {
            ROOT_URL: platform === 'cordova' ? __meteor_runtime_config__.ROOT_URL : '',
            STEEDOS_SENTRY_ENABLED: process.env.STEEDOS_SENTRY_ENABLED,
            NODE_ENV: process.env.NODE_ENV,
            STEEDOS_SENTRY_DSN: process.env.STEEDOS_SENTRY_DSN,
            STEEDOS_UNPKG_URL: process.env.STEEDOS_UNPKG_URL,
            STEEDOS_AMIS_URL: process.env.STEEDOS_AMIS_URL,
            STEEDOS_PUBLIC_SCRIPT_VCONSOLE: process.env.STEEDOS_PUBLIC_SCRIPT_VCONSOLE,
            STEEDOS_PUBLIC_SCRIPT_PLUGINS: process.env.STEEDOS_PUBLIC_SCRIPT_PLUGINS,
            STEEDOS_PUBLIC_STYLE_PLUGINS: process.env.STEEDOS_PUBLIC_STYLE_PLUGINS,
            STEEDOS_VERSION: process.env.STEEDOS_VERSION,
            STEEDOS_LOCALE: "",
            STEEDOS_PUBLIC_PAGE_ASSETURLS: process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS,
            STEEDOS_AMIS_VERSION: process.env.STEEDOS_AMIS_VERSION
        }
        const options = {}
        ejs.renderFile(filename, data, options, function(err, str){
            // str => Rendered HTML string
            if(err){
                res.send(err);
            }else{
                res.send(str);
            }
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});
exports.default = router;