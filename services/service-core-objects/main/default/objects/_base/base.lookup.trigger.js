/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-06-20 11:24:21
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-13 17:15:41
 * @Description: [Feature]: Lookup relationship 级联删除 #4985
 */
"use strict";
const { getObject } = require('@steedos/objectql');
const steedosAuth = require("@steedos/auth");
const steedosI18n = require("@steedos/i18n");
/**
 * 记录删除前校验是否被必填的lookup字段引用
 */
const beforeDeleteBase = async function () {
    const { id, object_name, userId } = this;
    if(object_name === 'objects' || object_name === 'object_fields'){
        return ;
    }
    const obj = getObject(object_name);
    const doc = await obj.findOne(id);
    const lookupDetailsInfo = await obj.getLookupDetailsInfo(); // 查找当前哪些对象有lookup字段引用当前对象
    // console.log("lookupDetailsInfo", lookupDetailsInfo)
    for (const info of lookupDetailsInfo) {
        const infos = info.split(".");
        const detailObjectApiName = infos[0];
        const detailFieldName = infos[1];
        const detailObj = getObject(detailObjectApiName);
        const detailField = detailObj.getField(detailFieldName);
        if ('retain' === detailField.deleted_lookup_record_behavior || true === detailField.required) { // 禁止删除相关记录
            const refFieldName = detailField.reference_to_field || '_id'
            const nameFieldName = detailObj.getNameFieldKey() || '_id';
            const detailDoc = (await detailObj.directFind({
                filters: [
                    [detailFieldName, '=', doc[refFieldName]]
                ],
                fields: [nameFieldName],
                limit: 1
            }))[0];
            if (detailDoc) {
                let lng = "zh-CN";
                if (userId) {
                    const userSession = await steedosAuth.getSessionByUserId(userId);
                    if (userSession && userSession.language) {
                        lng = userSession.language;
                    }
                }
                const errMsg = steedosI18n.t("delete_required_lookup_record_error", {
                    objectLabel: detailObj.label,
                    recordName: detailDoc[nameFieldName],
                }, lng)
                // console.log(require('chalk').red(errMsg))
                throw new Error(errMsg)
            }
        }
    }
}

module.exports = {
    listenTo: 'base',
    beforeDelete: async function () {
        return await beforeDeleteBase.apply(this, arguments)
    }
}