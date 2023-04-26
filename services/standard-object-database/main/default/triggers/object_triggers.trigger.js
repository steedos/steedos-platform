/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-06-03 15:11:52
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-26 11:45:44
 * @Description: 
 */
const Cache = require('@steedos/cachers');
const _ = require('lodash');
const objectql = require('@steedos/objectql');
const PERMISSIONS = {
    allowEdit: false,
    allowDelete: false,
    allowRead: true,
  };
  
  const BASERECORD = {
    is_system: true,
    record_permissions: PERMISSIONS
  };

const getSourceTriggers = async()=>{
    return _.map(Cache.getCacher('triggers').get('triggers'), (item)=>{
        return {
            ...item.metadata,
            _id: item.metadata.name,
            ...BASERECORD
        };
    }) 
}

module.exports = {
    beforeFind: async function () {
        delete this.query.fields;
    },
    afterFind: async function(){
        let spaceId = this.spaceId;
        let sourceData = await getSourceTriggers();
        this.data.values = this.data.values.concat(sourceData);
        this.data.values = objectql.getSteedosSchema().metadataDriver.find(this.data.values, this.query, spaceId);
    }, 
    afterCount: async function(){
        let spaceId = this.spaceId;
        this.data.values = this.data.values + objectql.getSteedosSchema().metadataDriver.count(await getSourceTriggers(), this.query, spaceId);
    },
    afterFindOne: async function(){
        let spaceId = this.spaceId;
        if(_.isEmpty(this.data.values)){
            const records = objectql.getSteedosSchema().metadataDriver.find(await getSourceTriggers(), {filters: ['_id', '=', this.id]}, spaceId);
            if(records.length > 0){
                this.data.values = records[0]
            }
        }
    },
    beforeInsert: async function(){
        const doc = this.doc;
        const count = await objectql.getObject('object_triggers').count({filters: [['_name', '=', doc._name], ['listenTo','=', doc.listenTo]]}) 
        if(count > 0){
            throw new Error('触发器名称不能重复')
        }       
    },
    beforeUpdate: async function () {
        const doc = this.doc;
        const count = await objectql.getObject('object_triggers').count({filters: [['_name', '=', doc._name], ['listenTo','=', doc.listenTo], ['_id', '!=', this.id]]}) 
        if(count > 0){
            throw new Error('触发器名称不能重复')
        }  
    }
}