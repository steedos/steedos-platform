/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:20:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-11-29 11:59:40
 * @Description: 
 */
const express = require('express');
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

const callObjectServiceAction = async function(actionName, userSession, data){
    const broker = objectql.getSteedosSchema().broker;
    return broker.call(actionName, data || {}, { meta: { user: userSession}})
}

const getUISchema = async function(objectName, userSession){
    return await callObjectServiceAction(`@${objectName}.getRecordView`, userSession);
}

router.post('/api/listview/filters', core.requireAuthentication, async function (req, res) {
    const {id, filters} = req.body;
    const record = await objectql.getObject('object_listviews').directUpdate(id, {filters: filters})
    res.status(200).send(record);
});

router.post('/api/listview/:id/amis-schema/clear', core.requireAuthentication, async function (req, res) {
    const { id } = req.params;
    const record = await objectql.getObject('object_listviews').directUpdate(id, { amis_schema: "" });
    res.status(200).send(record);
});

router.post('/api/listview/:id/amis-schema/reset', core.requireAuthentication, async function (req, res) {
    try {
        const userSession = req.user;
        const { id } = req.params;
        const listviews = await objectql.getObject('object_listviews').directFind({filters: [['_id', '=', id]],fields: ["object_name", "name"]});
        let listview;
        if(listviews && listviews.length > 0){
            listview = listviews[0];
        }
        else{
            res.status(500).send(`The listview for id "${id}" Not found`);
        }
        const AmisLib = require('@steedos-widgets/amis-lib');
        AmisLib.setUISchemaFunction(async function(objectName, force){
            return await getUISchema(objectName, userSession);
        });
        let schema = await AmisLib.getListviewInitSchema(listview.object_name, listview.name);
        const record = await objectql.getObject('object_listviews').directUpdate(id, { amis_schema: JSON.stringify(schema, null, 4) });
        res.status(200).send(record);

    } catch (error) {
        res.status(500).send(error.message);
        console.error(error);
    }
});

exports.default = router;