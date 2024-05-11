/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-04-10 14:34:08
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 13:52:15
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
async function getAll() {
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerPage.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');
    let assignments = [];
    _.each(dataList, function (item) {
        if (!item._id) {
            item._id = `${item.name}`
        }
        if (item.pageAssignments) {
            for (const assignment of item.pageAssignments) {
                assignments.push({
                    _id: assignment._id,
                    app: assignment.app,
                    desktop: assignment.desktop,
                    is_system: item.is_system || false,
                    mobile: assignment.mobile,
                    page: item._id,
                    profile: assignment.profile,
                    record_type: assignment.record_type,
                    type: assignment.type
                });
            }
        }
    })
    return assignments;
}

module.exports = {
    listenTo: 'page_assignments',

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