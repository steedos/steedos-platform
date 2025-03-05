/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-01-13 11:05:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-05 16:40:58
 * @Description: 
 */
const _ = require("underscore");
const objectql = require('@steedos/objectql');

function setSpaceAndOwner(record, that){
    record['space'] = that.spaceId
    record['owner'] = that.userId
}

const getInternalApprovalProcesses = function(sourceApprovalProcesses, filters){
    delete filters.active;
    let dbApprovalProcesses = Creator.getCollection("process_definition").find(filters, {fields:{_id:1, name:1}}).fetch();
    let approvalProcesses = [];

    if(!filters.is_system){
        _.forEach(sourceApprovalProcesses, function(doc){
            if(!_.find(dbApprovalProcesses, function(p){
                return p.name === doc.name
            })){
                approvalProcesses.push(doc);
            }
        })
    }
    return approvalProcesses;
}

module.exports = {
    beforeInsert: async function () {
        await objectql.checkAPIName(this.object_name, 'name', this.doc.name, undefined, [['is_system','!=', true]]);

        objectql.checkFormula(this.doc.entry_criteria, this.doc.object_name)

        if(!this.doc.initial_submission_record_lock){
            this.doc.initial_submission_record_lock = 'lock';
        }
        if(!this.doc.recall_record_lock){
            this.doc.recall_record_lock = 'unlock';
        }
    }
}