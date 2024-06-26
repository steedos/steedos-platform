/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-08-05 14:17:44
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-11 14:03:14
 * @Description: 
 */
const objectql = require('@steedos/objectql');
const register = require('@steedos/metadata-registrar');
const auth = require('@steedos/auth');
const _ = require('underscore');
const clone = require('clone');
async function getAll(){
    const schema = objectql.getSteedosSchema();
    const configs = await register.registerTab.getAll(schema.broker)
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

async function get(apiName){
    const schema =objectql.getSteedosSchema();
    const config = await register.registerTab.get(schema.broker, apiName)
    return config ? config.metadata : null;
}

module.exports = {
    listenTo: 'tabs',

    afterFind: async function(){
        const { spaceId } = this;
        let dataList = await getAll();
        const values = [];
        if(dataList){
            const cloneValues = clone(this.data.values, false);
            dataList.forEach((doc)=>{
                if(!_.find(this.data.values, (value)=>{
                    return value._id === doc._id
                })){
                    cloneValues.push(doc);
                }
            })
            const records = objectql.getSteedosSchema().metadataDriver.find(cloneValues, this.query, spaceId);
            if(records.length > 0){
                this.data.values = records;
            }else{
                this.data.values.length = 0;
            }
        }
    },
    afterCount: async function(){
        try {
            this.query.fields.push('name');
            this.query.fields.push('code');
        } catch (error) {

        }
        let result = await objectql.getObject(this.object_name).find(this.query, await auth.getSessionByUserId(this.userId, this.spaceId))
        this.data.values = result.length;
    },
    afterFindOne: async function(){
        if(_.isEmpty(this.data.values)){
            let id = this.id
            let data = await get(id);
            if(data){
                this.data.values = data;
            }
        }
    }
}