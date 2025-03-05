/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2021-08-30 12:06:41
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-05 16:42:15
 * @Description: 
 */
const _ = require("underscore");
const objectql = require("@steedos/objectql");

module.exports = {
    beforeInsert: async function () {
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await objectql.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
    }
}