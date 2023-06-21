/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-06-20 11:24:21
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-06-21 11:13:17
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

/**
 * 记录删除后，清空所有lookup字段引用
 */
const afterDeleteBase = async function () {
    const { object_name, previousDoc } = this;
    const obj = getObject(object_name);
    const lookupDetailsInfo = await obj.getLookupDetailsInfo(); // 查找当前哪些对象有lookup字段引用当前对象
    for (const info of lookupDetailsInfo) {
        const infos = info.split(".");
        const detailObjectApiName = infos[0];
        const detailFieldName = infos[1];
        const detailObj = getObject(detailObjectApiName);
        const detailField = detailObj.getField(detailFieldName);
        if ('clear' === detailField.deleted_lookup_record_behavior || !detailField.deleted_lookup_record_behavior) { // 清除相关记录lookup字段的值，默认清除
            const refFieldName = detailField.reference_to_field || '_id'
            await detailObj.updateMany([
                [detailFieldName, '=', previousDoc[refFieldName]]
            ], {
                [detailFieldName]: null
            });
        }
    }
}

module.exports = {
    listenTo: 'base',
    beforeDelete: async function () {
        return await beforeDeleteBase.apply(this, arguments)
    },
    afterDelete: async function () {
        return await afterDeleteBase.apply(this, arguments)
    }
}