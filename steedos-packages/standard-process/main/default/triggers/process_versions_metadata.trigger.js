/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-31 14:24:43
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-04-06 10:31:49
 * @Description: 
 */

const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('lodash');

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

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (dataList) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value._id === doc._id
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
            if (records.length > 0) {
                this.data.values = records;
            } else {
                this.data.values.length = 0;
            }
        }

    },
    afterAggregate: async function () {
        const { spaceId } = this;
        let dataList = await getAll();
        if (dataList) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value._id === doc._id
                })) {
                    this.data.values.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
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