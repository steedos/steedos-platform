const _ = require("underscore");
const objectql = require("@steedos/objectql");

const getInternalWorkflowNotifications = function(sourceWorkflowNotifications, filters, dbWorkflowNotifications){
    let workflowNotifications = [];

    if(!filters.is_system){
        _.forEach(sourceWorkflowNotifications, function(doc){
            if(!_.find(dbWorkflowNotifications, function(p){
                return p.name === doc.name
            })){
                workflowNotifications.push(doc);
            }
        })
    }
    return workflowNotifications;
}

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