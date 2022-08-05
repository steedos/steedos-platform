/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-09-10 16:44:24
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-07-30 09:56:44
 * @Description: 
 */
const util = require('@steedos/standard-objects').util;
const _ = require('lodash');
module.exports = {
    listenTo: 'tabs',

    beforeInsert: async function(){
        const { object_name, doc } = this;
        await util.checkAPIName(object_name, 'name', doc.name, undefined);
    },

    beforeUpdate: async function(){
        const {object_name, doc, spaceId, id} = this;
        if(_.has(doc, 'name')){
            await util.checkAPIName(object_name, 'name', doc.name, id);
        }
    }
}