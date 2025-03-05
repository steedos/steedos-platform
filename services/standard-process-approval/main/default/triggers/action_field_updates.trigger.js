const _ = require("underscore");
const objectql = require("@steedos/objectql");

const checkReevaluateParent = (doc)=>{
    if(doc.reevaluate_on_change && doc.target_object && doc.object_name && doc.target_object != doc.object_name){
        throw new Error('action_field_updates_field__error_reevaluate_parent');
    }
}

const getInternalActionFieldUpdates = function(sourceActionFieldUpdates, filters, dbActionFieldUpdates){
    let actionFieldUpdates = [];

    if(!filters.is_system){
        _.forEach(sourceActionFieldUpdates, function(doc){
            if(!_.find(dbActionFieldUpdates, function(p){
                return p.name === doc.name
            })){
                actionFieldUpdates.push(doc);
            }
        })
    }
    return actionFieldUpdates;
}

module.exports = {
    beforeInsert: async function () {
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);
        checkReevaluateParent(this.doc);
    },
    beforeUpdate: async function () {
        if (_.has(this.doc, 'name')) {
            await objectql.checkAPIName(this.object_name, 'name', this.doc.name, this.id, [['is_system','!=', true]]);
        }
        checkReevaluateParent(this.doc);
    }
}