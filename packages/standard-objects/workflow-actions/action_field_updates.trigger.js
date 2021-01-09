const _ = require("underscore");
const util = require('../util');


const checkReevaluateParent = (doc)=>{
    if(doc.reevaluate_on_change && doc.target_object && doc.object_name && doc.target_object != doc.object_name){
        throw new Error('action_field_updates_field__error_reevaluate_parent');
    }
}

module.exports = {
    beforeInsert: async function () {
        await util.checkAPIName(this.object_name, 'name', this.doc.name);
        checkReevaluateParent(this.doc);
    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await util.checkAPIName(this.object_name, 'name', this.doc.name, this.id);
        }
        checkReevaluateParent(this.doc);
    }
}