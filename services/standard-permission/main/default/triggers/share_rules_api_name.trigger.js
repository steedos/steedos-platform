/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-12-27 10:49:33
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 17:07:59
 * @Description: 
 */
const _ = require('lodash');
const objectql = require('@steedos/objectql');
module.exports = {
    listenTo: 'share_rules',

    beforeInsert: async function () {
        const { object_name, doc } = this;
        await objectql.checkAPIName(object_name, 'name', doc.name, undefined, [['is_system', '!=', true], ['object_name', '=', doc.object_name]]);
    },

    beforeUpdate: async function () {
        const oldDoc = await objectql.getObject(this.object_name).findOne(this.id)
        let name = oldDoc.name, object_name = oldDoc.object_name;
        if (_.has(this.doc, 'name')) {
            name = this.doc.name
        }
        if (_.has(this.doc, 'object_name')) {
            object_name = this.doc.object_name
        }
        await objectql.checkAPIName(this.object_name, 'name', name, this.id, [['is_system', '!=', true], ['object_name', '=', object_name]]);
    }
}