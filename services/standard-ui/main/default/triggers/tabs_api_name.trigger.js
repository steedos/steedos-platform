/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-09-10 16:44:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-21 11:09:05
 * @Description: 
 */
const util = require('@steedos/standard-objects').util;
const _ = require('lodash');
const objectql = require('@steedos/objectql')
module.exports = {
    listenTo: 'tabs',

    beforeInsert: async function(){
        const { object_name, doc } = this;
        await util.checkAPIName(object_name, 'name', doc.name, undefined);
        if(doc.type === 'object'){
            const records = await objectql.getObject('tabs').count({filters: [['type', '=', 'object'], ['object', '=', doc.object]]});
            if(records > 0){
                throw new Error('对象选项卡已存在')
            }
        }
    },

    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(_.has(doc, 'name')){
            await util.checkAPIName(object_name, 'name', doc.name, id);
        }
    }
}