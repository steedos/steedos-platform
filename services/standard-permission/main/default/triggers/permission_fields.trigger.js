/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 17:08:43
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const clone = require('clone');
const _ = require('underscore');
const readonlyFields = ['created', 'created_by', 'modified', 'modified_by'];
const register = require('@steedos/metadata-registrar');
async function getAll() {
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerPermissionFields.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');

    _.each(dataList, function (item) {
        if (!item._id) {
            item._id = `${item.name}`
        }
    })
    return dataList;
}

async function get(apiName) {
    const schema = objectql.getSteedosSchema();
    const config = await register.registerPermissionFields.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

module.exports = {
    listenTo: 'permission_fields',
    beforeInsert: async function(){
        const { doc } = this;
        if(_.include(readonlyFields, doc.field)){
            doc.editable = false;
        }
        if(doc.editable){
            doc.readable = true;
        }
    },
    beforeUpdate: async function(){
        const { doc } = this;
        if(_.include(readonlyFields, doc.field)){
            doc.editable = false;
        }
        if(doc.editable){
            doc.readable = true;
        }
    },
    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },
    afterFind: async function () {
        let spaceId = this.spaceId;
        let dataList = await getAll();
        const values = clone(this.data.values);
        _.each(dataList, (item) => {
            if (!_.find(this.data.values, (value) => {
                return value._id === item._id || item.name === value.name
            })) {
                values.push(item)
            }
        })
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(values, this.query, spaceId);

    },
    afterAggregate: async function () {
        let spaceId = this.spaceId;
        let dataList = await getAll();
        const values = clone(this.data.values);
        _.each(dataList, (item) => {
            if (!_.find(this.data.values, (value) => {
                return value._id === item._id || item.name === value.name
            })) {
                values.push(item)
            }
        })
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(values, this.query, spaceId);

    },
    afterCount: async function () {
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function () {
        if (_.isEmpty(this.data.values)) {
            let id = this.id
            let data = await get(id);
            if (data) {
                this.data.values = data;
            }
        }
    }
}