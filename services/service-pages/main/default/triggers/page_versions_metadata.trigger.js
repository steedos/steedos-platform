/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-04-10 14:27:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 16:20:54
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const auth = require('@steedos/auth');
const _ = require('underscore');
const register = require('@steedos/metadata-registrar');
async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerPage.getAll(schema.broker)
    const dataList = _.pluck(configs, 'metadata');
    let versions = [];
    _.each(dataList, function(item){
        if(!item._id){
            item._id = `${item.name}`
        }
        versions.push({
            _id: item._id,
            description: item.description,
            is_active: true,
            page: item._id,
            schema: item.schema,
            version: 1,
            record_permissions: item.record_permissions,
            is_system: item.is_system || false,
        });
    })
    return versions;
}

module.exports = {
    listenTo: 'page_versions',

    beforeFind: async function () {
        delete this.query.fields;
    },

    beforeAggregate: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
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
    afterAggregate: async function(){
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
    afterCount: async function(){
        delete this.query.fields;
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            const all = await getAll();
            const id = this.id;
            this.data.values = _.find(all, function(item){
                return item._id === id
            });
        }
    }
}