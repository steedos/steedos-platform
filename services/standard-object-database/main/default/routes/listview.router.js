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
    const userSession = req.user;
    // 安全修复：原实现用 directUpdate 绕过权限层且不带 userSession，任意登录用户可改任意租户
    // 任意 object_listviews 的 filters(且 filters 会经 @steedos/filters 的 evaluateFormula 求值，
    // 构成持久化风险)。改为带 userSession 的 update，由 objectql 权限层校验对象编辑权与记录级
    // (空间/owner)权限。
    const record = await objectql.getObject('object_listviews').update(id, {filters: filters}, userSession)
    res.status(200).send(record);
});

exports.default = router;