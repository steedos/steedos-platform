/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-31 14:24:43
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 14:04:15
 * @Description: 
 */

const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('lodash');
const clone = require('clone');

async function getAll() {
    const schema = objectql.getSteedosSchema();
    const configs = await objectql.registerProcess.getAll(schema.broker)
    const dataList = _.map(configs, 'metadata');
    let versions = [];
    for (const item of dataList) {
        if (!item._id) {
            item._id = `${item.name}`
        }
        versions.push({
            _id: item._id,
            process: item._id,
            is_active: false,
            version: 1,
            description: item.description,
            entry_criteria: item.entry_criteria,
            schema: item.schema,
            when: item.when
        });
    }
    return versions;
}


module.exports = {
    listenTo: 'process_versions',

    beforeFind: async function () {
        delete this.query.fields;
    },

    afterFind: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (dataList) {
            const cloneValues = clone(this.data.values, false);
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value._id === doc._id
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

    },
    afterCount: async function () {
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function () {
        if (_.isEmpty(this.data.values)) {
            const all = await getAll();
            const id = this.id;
            this.data.values = _.find(all, function (item) {
                return item._id === id
            });
        }
    }
}