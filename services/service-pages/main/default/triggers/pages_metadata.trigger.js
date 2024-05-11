/*
 * @Author: baozhoutao@hotoa.com
 * @Date: 2022-03-28 17:09:20
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 13:53:52
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerPage.getAll(schema.broker)
    const dataList = [];
    if ('production' === process.env.NODE_ENV) {
        for (const config of configs) {
            if (config.metadata && !config.metadata.hidden) {
                dataList.push(config.metadata);
            }
        }
    } else {
        for (const config of configs) {
            if (config.metadata) {
                dataList.push(config.metadata);
            }
        }
    }

    _.each(dataList, function(item){
        if(!item._id){
            item._id = `${item.name}`
        }
    })
    return dataList;
}

module.exports = {
    listenTo: 'pages',

    beforeFind: async function () {
        delete this.query.fields;
    },

    afterFind: async function(){
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