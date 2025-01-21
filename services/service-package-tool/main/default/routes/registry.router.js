/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-11-18 16:32:30
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-01-21 17:28:27
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const auth = require("@steedos/auth");

let STEEDOS_REGISTRY_URL = process.env.STEEDOS_REGISTRY_URL ? process.env.STEEDOS_REGISTRY_URL : 'https://registry.steedos.cn/';

router.get("/api/nodes/registry", auth.requireAuthentication, async function (req, res) {
    res.status(200).send([
        { label: "https://registry.npmjs.org/", value: "https://registry.npmjs.org/" },
        { label: "https://registry.npm.taobao.org/", value: "https://registry.npm.taobao.org/" },
        { label: STEEDOS_REGISTRY_URL, value: STEEDOS_REGISTRY_URL },
    ]);
});
exports.default = router;
