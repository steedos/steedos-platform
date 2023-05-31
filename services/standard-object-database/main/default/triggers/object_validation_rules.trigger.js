/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @Description: 
 */
const _ = require("underscore");
const util = require('@steedos/standard-objects').util;
const objectql = require("@steedos/objectql");
const register = require('@steedos/metadata-registrar')
const auth = require('@steedos/auth');

module.exports = {
    beforeFind: async function(){
        delete this.query.fields;
    },
    beforeAggregate: async function(){
        delete this.query.fields;
    },
    afterFind: async function(){
        const { spaceId } = this;
        let dataList = register.getAllObjectValidationRules();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
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
    afterAggregate: async function(){
        const { spaceId } = this;
        let dataList = register.getAllObjectValidationRules();
        if (!_.isEmpty(dataList)) {
            dataList.forEach((doc) => {
                if (!_.find(this.data.values, (value) => {
                    return value.name === doc.name
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
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if (_.isEmpty(this.data.values)) {
            const all = register.getAllObjectValidationRules();
            const id = this.id;
            this.data.values = _.find(all, function (item) {
                return item._id === id
            });
        }
    },
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
    }
}
