/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 17:06:59
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
async function getAll() {
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerRestrictionRules.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');

    _.each(dataList, function (item) {
        if (!item._id) {
            item._id = `${item.object_name}.${item.name}`
        }
    })
    return dataList;
}

async function get(apiName) {
    const schema = objectql.getSteedosSchema();
    const config = await register.registerRestrictionRules.get(schema.broker, apiName)
    return config ? Object.assign(config.metadata, { _id: config.metadata._id || `${config.metadata.object_name}.${config.metadata.name}` }) : null;
}

module.exports = {
    listenTo: 'restriction_rules',

    afterFind: async function () {
        let spaceId = this.spaceId;
        let dataList = await getAll();
        const values = clone(this.data.values);
        _.each(dataList, (item) => {
            if (!_.find(this.data.values, (value) => {
                return value._id === item._id
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
                return value._id === item._id
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