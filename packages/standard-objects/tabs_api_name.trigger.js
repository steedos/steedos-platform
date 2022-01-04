const util = require('./util');
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