/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-17 16:29:17
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-28 18:01:04
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const core = require("@steedos/core");

let STEEDOS_REGISTRY_URL = process.env.STEEDOS_REGISTRY_URL ? process.env.STEEDOS_REGISTRY_URL : 'https://registry.steedos.cn/';

router.get("/api/nodes/registry", core.requireAuthentication, async function (req, res) {
    res.status(200).send([
        { label: "https://registry.npmjs.org/", value: "https://registry.npmjs.org/" },
        { label: "https://registry.npm.taobao.org/", value: "https://registry.npm.taobao.org/" },
        { label: STEEDOS_REGISTRY_URL, value: STEEDOS_REGISTRY_URL },
    ]);
});
exports.default = router;
