const apiName = require('./api_name');
const _ = require('lodash');
module.exports = {
    listenTo: 'process',

    beforeInsert: async function () {
        const { object_name, doc, spaceId } = this;
        const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.api_name)
        if (!isUnique) {
            throw new Error('流程标识不能重复');
        }
    },

    beforeUpdate: async function () {
        const { object_name, doc, spaceId, id } = this;
        if (_.has(doc, 'api_name')) {
            const isUnique = await apiName.isSpaceUnique(spaceId, object_name, doc, doc.api_name, id)
            if (!isUnique) {
                throw new Error('流程标识不能重复');
            }
        }
    }
}