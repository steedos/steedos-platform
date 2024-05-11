/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2021-11-03 15:15:45
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 13:45:34
 * @Description: 
 */

const objectql = require('@steedos/objectql');
const auth = require("@steedos/auth");
const { checkAPIName } = require('../../util')
const register = require('@steedos/metadata-registrar');
const _ = require('underscore');
const clone = require('clone');

async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerImport.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');

    _.each(dataList, function(item){
        if(!item._id){
            item._id = `${item.name}`
        }
    })
    return dataList;
}

module.exports = {

    listenTo: 'queue_import',

    beforeInsert: async function () {
        const { getObject, doc ,userId} = this;
        await _validateData(doc, getObject, userId);

        await checkAPIName(this.object_name, 'name', doc.name, undefined, [['is_system','!=', true]]);
    },

    beforeUpdate: async function () {
        const { id, object_name, getObject, doc, userId } = this;
        // 导入操作/字段映射/表示数据唯一性字段(重复执行导入时根据此字段更新记录) 更新时校验
        if (doc.hasOwnProperty('operation') || doc.hasOwnProperty('field_mappings') || doc.hasOwnProperty('external_id_name')) {
            const currentDoc = await getObject(object_name).findOne(id);
            await _validateData({
                ...currentDoc,
                ...doc
            }, getObject, userId);
        }

        if (_.has(doc, 'name')) {
            await checkAPIName(object_name, 'name', doc.name, id, [['is_system','!=', true]]);
        }
    },

    afterFindOne: async function () {
        if(_.isEmpty(this.data.values)){
            const all = await getAll();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
        try {
            if (this.data.values) {
                const userSession = await auth.getSessionByUserId(this.userId);
                const locale = userSession && userSession.locale;
                const download = TAPi18n.__('queue_import_download', {returnObjects: true}, locale);
                Object.assign(this.data.values, { 
                    // template_url: `[${download}](${objectql.absoluteUrl(`/api/data/download/template/${this.data.values._id}`)})` 
                    // template_url: `<a href="${objectql.absoluteUrl(`/api/data/download/template/${this.data.values._id}`)}" target="_self">${download}</a>`
                    template_url: objectql.absoluteUrl(`/api/data/download/template/${this.data.values._id}`)
                })
            }
        } catch (error) {

        }
    },
    beforeFind: async function () {
        delete this.query.fields;
    },
    afterFind: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (!_.isEmpty(dataList)) {
            const cloneValues = clone(this.data.values, false);
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
                })) {
                    cloneValues.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(cloneValues, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

        if (this.data.values) {
            const userSession = await auth.getSessionByUserId(this.userId);
            const locale = userSession && userSession.locale;
            const download = TAPi18n.__('queue_import_download', {returnObjects: true}, locale);
            for (const value of this.data.values) {
                if (value) {
                    // value.template_url = `[${download}](${objectql.absoluteUrl(`/api/data/download/template/${value._id}`)})`
                    // value.template_url = `<a href="${objectql.absoluteUrl(`/api/data/download/template/${value._id}`)}" target="_self">${download}</a>`
                    value.template_url = objectql.absoluteUrl(`/api/data/download/template/${value._id}`)
                }
            }
        }
    },
    afterCount: async function(){
        const { spaceId } = this;
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
}

/**
 * 校验数据
 * @param {*} doc 
 */
async function _validateData(doc, getObject, userId) {
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
                const userSession = await auth.getSessionByUserId(userId);
                const locale = userSession && userSession.locale;
                const field_mapping_alert = TAPi18n.__('queue_import_form_field_mapping_prompt', {returnObjects: true, label: label}, locale);
                throw new Error(field_mapping_alert);
                // throw new Error(`表示数据唯一性字段 ${label} 在字段映射中不存在，请配置。`);
            }
        }
    }
}