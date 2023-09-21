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

const getConfig = (key, platform)=>{
    if(platform === 'cordova'){
        let value = process.env[key];
        //如果不是以http开头的，就是相对路径, 则加上ROOT_URL
        if(_.startsWith(value, '/')){
            return Meteor.absoluteUrl(value) ;
        }
        return value;
    }else{
        return process.env[key]
    }
}

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
            STEEDOS_UNPKG_URL: getConfig('STEEDOS_UNPKG_URL', platform),
            STEEDOS_AMIS_URL: getConfig('STEEDOS_AMIS_URL', platform),
            STEEDOS_PUBLIC_SCRIPT_VCONSOLE: getConfig('STEEDOS_PUBLIC_SCRIPT_VCONSOLE', platform),
            STEEDOS_PUBLIC_SCRIPT_PLUGINS: getConfig('STEEDOS_PUBLIC_SCRIPT_PLUGINS', platform),
            STEEDOS_PUBLIC_STYLE_PLUGINS: getConfig('STEEDOS_PUBLIC_STYLE_PLUGINS', platform),
            STEEDOS_VERSION: process.env.STEEDOS_VERSION,
            STEEDOS_LOCALE: "",
            STEEDOS_PUBLIC_PAGE_ASSETURLS: process.env.STEEDOS_PUBLIC_PAGE_ASSETURLS,
            STEEDOS_AMIS_VERSION: process.env.STEEDOS_AMIS_VERSION,
            platform: __meteor_runtime_config__.PUBLIC_SETTINGS && __meteor_runtime_config__.PUBLIC_SETTINGS.platform || {}
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



router.get('/main_head.css', async function(req, res){
    const { platform } = req.query;

    res.set('Content-Type', 'text/css; charset=UTF-8');
    
    const STEEDOS_UNPKG_URL = getConfig('STEEDOS_UNPKG_URL', platform);
    const STEEDOS_AMIS_URL = getConfig('STEEDOS_AMIS_URL', platform);
    const ROOT_URL = platform === 'cordova' ? __meteor_runtime_config__.ROOT_URL : '';

    res.send(`
        @import url("${STEEDOS_UNPKG_URL}/@salesforce-ux/design-system@2.19.0/assets/styles/salesforce-lightning-design-system.min.css");
        @import url("${STEEDOS_AMIS_URL}/lib/themes/antd.css");
        @import url("${STEEDOS_AMIS_URL}/lib/helper.css");
        @import url("${STEEDOS_AMIS_URL}/sdk/iconfont.css");
        @import url("${STEEDOS_UNPKG_URL}/@fortawesome/fontawesome-free@6.2.0/css/all.min.css");
        @import url("${ROOT_URL}/tailwind/tailwind-steedos.css");
        @import url("${ROOT_URL}/amis/amis.css");
    `); 
})

exports.default = router;