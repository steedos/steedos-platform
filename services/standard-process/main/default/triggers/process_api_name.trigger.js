/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-28 17:09:20
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-03-31 20:19:23
 * @Description: 
 */
const apiName = require('./api_name');
const _ = require('lodash');
module.exports = {
    listenTo: 'process',

    beforeInsert: async function () {
        const { object_name, doc, spaceId } = this;
        const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.name)
        if (!isUnique) {
            throw new Error('流程标识不能重复');
        }
    },

    beforeUpdate: async function () {
        const { object_name, doc, spaceId, id } = this;
        if (_.has(doc, 'name')) {
            const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.name, id)
            if (!isUnique) {
                throw new Error('流程标识不能重复');
            }
        }
    }
}