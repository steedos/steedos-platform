/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:20:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-08-05 15:41:30
 * @Description: 
 */
const express = require("express");
const router =require('@steedos/router').staticRouter()
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const steedosI18n = require("@steedos/i18n");
const clone = require("clone");

// 这个函数与services/service-plugin-amis/main/default/services/amis.service.js中的getObjectConfig函数重复了
const getObjectConfig = async function(objectName){
    const object = objectql.getObject(objectName);
    const objectConfig = clone(object.toConfig());
    // TODO: 后续再支持附件子表
    // let relatedLists = []
    // if(objectConfig.enable_files){
    //     relatedLists.push("cms_files.parent")
    // }
    const relationsInfo = await object.getRelationsInfo();

    // TODO: 跨工作区了，后续需要补充spaceId过滤条件
    const dbListViews = await objectql.getObject("object_listviews").directFind({ 
        filters: [['object_name', '=', objectName], ['shared', '=', true]] 
    })

    objectConfig.list_views = Object.assign({}, objectConfig.list_views)
    _.each(dbListViews, function(dbListView){
        delete dbListView.created;
        delete dbListView.created_by;
        delete dbListView.modified;
        delete dbListView.modified_by;
        objectConfig.list_views[dbListView.name] = dbListView;
    })
    
    objectConfig.details = relationsInfo && relationsInfo.details;
    objectConfig.masters = relationsInfo && relationsInfo.masters;
    objectConfig.lookup_details = relationsInfo && relationsInfo.lookup_details;
    // TODO： 后续再支持related_lists
    // objectConfig.related_lists = relationsInfo && relationsInfo.related_lists;

    // let lng = objectql.getUserLocale(userSession);
    let lng = "zh-CN";//先写死中文，后续拟通过环境变量配置语言
    steedosI18n.translationObject(lng, object.name, objectConfig);
    return objectConfig;
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
            return await getObjectConfig(objectName);
        });
        let schema = await AmisLib.getListviewInitSchema(listview.object_name, listview.name);
        const record = await objectql.getObject('object_listviews').directUpdate(id, { amis_schema: schema });
        res.status(200).send(record);

    } catch (error) {
        res.status(500).send(error.message);
    }
});

exports.default = router;