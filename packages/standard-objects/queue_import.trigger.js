/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-11-03 15:15:45
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-10-29 16:21:30
 * @Description: 
 */

const objectql = require('@steedos/objectql');

module.exports = {

    listenTo: 'queue_import',

    beforeInsert: async function () {
        const { getObject, doc } = this;
        await _validateData(doc, getObject);
    },

    beforeUpdate: async function () {
        const { id, object_name, getObject, doc } = this;
        // 导入操作/字段映射/表示数据唯一性字段(重复执行导入时根据此字段更新记录) 更新时校验
        if (doc.hasOwnProperty('operation') || doc.hasOwnProperty('field_mappings') || doc.hasOwnProperty('external_id_name')) {
            const currentDoc = await getObject(object_name).findOne(id);
            await _validateData({
                ...currentDoc,
                ...doc
            }, getObject);
        }
    },

    afterFindOne: async function () {
        try {
            if (this.data.values) {
                Object.assign(this.data.values, { template_url: `[下载](${objectql.absoluteUrl(`/api/data/download/template/${this.data.values._id}`)})` })
            }
        } catch (error) {

        }
    },
    afterFind: async function () {
        if (this.data.values) {
            for (const value of this.data.values) {
                if (value) {
                    value.template_url = `[下载](${objectql.absoluteUrl(`/api/data/download/template/${value._id}`)})`
                }
            }
        }
    },
    afterAggregate: async function () {
        if (this.data.values) {
            for (const value of this.data.values) {
                if (value) {
                    value.template_url = `[下载](${objectql.absoluteUrl(`/api/data/download/template/${value._id}`)})`
                }
            }
        }
    }
}

/**
 * 校验数据
 * @param {*} doc 
 */
async function _validateData(doc, getObject) {
    // 当导入操作为 更新/存在则更新，不存在则新增 时，需要保证 表示数据唯一性字段 在字段映射中存在
    if (doc.operation === 'update' || doc.operation === 'upsert') {
        const apiNames = [];
        for (const fieldMapping of doc.field_mappings) {
            if (fieldMapping.api_name) {
                apiNames.push(fieldMapping.api_name);
            }
        }
        for (const fieldName of doc.external_id_name) {
            if (!apiNames.includes(fieldName)) {
                let label = '';
                if (fieldName === '_id') {
                    label = 'Primary Key ( _id )';
                } else {
                    const field = await getObject(doc.object_name).getField(fieldName);
                    label = field.label;
                }
                throw new Error(`表示数据唯一性字段 ${label} 在字段映射中不存在，请配置。`);
            }
        }
    }
}