/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @Description: 
 */
const _ = require("underscore");
const objectql = require("@steedos/objectql");
const register = require('@steedos/metadata-registrar')
const auth = require('@steedos/auth');
const clone = require('clone');

module.exports = {
    beforeFind: async function(){
        delete this.query.fields;
    },
    afterFind: async function(){
        const { spaceId } = this;
        let dataList = await register.getAllObjectValidationRules();
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

    },
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if (_.isEmpty(this.data.values)) {
            const all = await register.getAllObjectValidationRules();
            const id = this.id;
            this.data.values = _.find(all, function (item) {
                return item._id === id
            });
        }
    },
    beforeInsert: async function () {
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await objectql.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
    }
}
