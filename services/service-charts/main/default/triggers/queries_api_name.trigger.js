const apiName = require('./api_name');
const _ = require('lodash');

const checkQuery = (queryStr)=>{
    // if(!query){
    //     throw new Error('查询脚本为必填');
    // }
    // let query = null;
    // try {
    //     query = JSON.parse(queryStr);
    // } catch (error) {
    //     throw new Error(`无效的查询脚本.`)
    // }
    // if(!query.collection){
    //     throw new Error(`查询脚本缺少collection`)
    // }
    // if(!query.aggregate && !query.query){
    //     throw new Error(`查询脚本需要配置aggregate或query`)
    // }
}


module.exports = {
    listenTo: 'queries',

    beforeInsert: async function(){
        const {object_name, doc, spaceId} = this;
        const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.name)
        if(!isUnique){
            throw new Error('Api Name 不能重复');
        }
        checkQuery(doc.query)
    },

    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(_.has(doc, 'name')){
            const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.name, id)
            if(!isUnique){
                throw new Error('Api Name 不能重复');
            }
        }
        if(_.has(doc, 'query')){
            checkQuery(doc.query)
        }
    }
}