const _ = require('lodash')
module.exports = {
    handler: async function (idFieldName, groupId) {
        const orgObj = this.getObject("organizations");
        const records = await orgObj.find({filters: [idFieldName, '=', groupId]});
        return _.first(records)
    }
}