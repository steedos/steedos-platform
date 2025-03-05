const _ = require('underscore');

module.exports = {

    listenTo: 'picklists',

    beforeInsert: async function () {
        var doc = this.doc
        if (doc.code) {
            let count = await this.getObject('picklists').count({ filters: [['space', '=', doc.space], ['code', '=', doc.code]] })
            if (count > 0) {
                throw new Error("唯一编码不能重复");
            }
        }
    },
    beforeUpdate: async function () {
        var doc = this.doc
        var id = this.id
        if (_.has(doc, 'code')) {
            let dbDoc = await this.getObject('picklists').findOne(id, { fields: { space: 1 } });
            if (dbDoc) {
                let count = await this.getObject('picklists').count({ filters: [['_id', '<>', id], ['space', '=', dbDoc.space], ['code', '=', doc.code]] })
                if (count > 0) {
                    throw new Error("唯一编码不能重复");
                }
            }
        }
    }
}