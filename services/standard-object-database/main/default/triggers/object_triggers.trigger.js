/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-06-03 15:11:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-18 14:06:18
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
    const data = _.map(_.filter(Cache.getCacher('triggers').get('triggers'), (item)=>{
        return !item.metadata._id || item.metadata._id == item.metadata.name
    }), (item)=>{
        return {
            ...item.metadata,
            _id: item.metadata.name,
            ...BASERECORD
        };
    });
    return data;
}

function checkVariableName(variableName){
    if(variableName.length > 50){
        throw new Error("名称长度不能大于50个字符");
    }
    var reg = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    if(reg.test(variableName)){
      var keywords = ['break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'true', 'false', 'null', 'undefined', 'NaN', 'Infinity'];
      if(keywords.indexOf(variableName) === -1){
        return true;
      } else {
        throw new Error("名称不能包含关键字");
      }
    } else {
        throw new Error("名称只能包含字母、数字，必须以字母开头");
    }
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
        checkVariableName(doc._name)
        const count = await objectql.getObject('object_triggers').count({filters: [['_name', '=', doc._name], ['listenTo','=', doc.listenTo]]}) 
        if(count > 0){
            throw new Error('触发器名称不能重复')
        }
        doc.name = `${doc.listenTo}_${doc._name}` 
    },
    beforeUpdate: async function () {
        const doc = this.doc;
        if(doc._name){
            checkVariableName(doc._name)
        }
        const count = await objectql.getObject('object_triggers').count({filters: [['_name', '=', doc._name], ['listenTo','=', doc.listenTo], ['_id', '!=', this.id]]}) 
        if(count > 0){
            throw new Error('触发器名称不能重复')
        }
        doc.name = `${doc.listenTo}_${doc._name}`  
    }
}