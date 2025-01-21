/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:20:24
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-29 23:32:35
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const auth = require('@steedos/auth');
const objectql = require('@steedos/objectql');

const callObjectServiceAction = async function(actionName, userSession, data){
    const broker = objectql.getSteedosSchema().broker;
    return broker.call(actionName, data || {}, { meta: { user: userSession}})
}

const getUISchema = async function(objectName, userSession){
    return await callObjectServiceAction(`objectql.getRecordView`, userSession, { objectName });
}

router.post('/api/listview/filters', auth.requireAuthentication, async function (req, res) {
    const {id, filters} = req.body;
    const record = await objectql.getObject('object_listviews').directUpdate(id, {filters: filters})
    res.status(200).send(record);
});

exports.default = router;