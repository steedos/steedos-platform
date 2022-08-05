/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:20:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 15:41:30
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.post('/api/listview/filters', core.requireAuthentication, async function (req, res) {
    const {id, filters} = req.body;
    const record = await objectql.getObject('object_listviews').directUpdate(id, {filters: filters})
    res.status(200).send(record);
});
exports.default = router;