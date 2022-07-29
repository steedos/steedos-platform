Steedos.ProcessNodeManager = {};

Steedos.ProcessNodeManager.changeSchema = function(doc, schema){
    var objectSchema = Creator.getObjectSchema(Creator.getObject("process_node"));

    var hiddenField = function(fieldName){
        schema._schema[fieldName].autoform.omit = true;
        schema._schema[fieldName].autoform.type = 'hidden';
        schema._schema[fieldName].optional = true;
    }

    if(doc.filtrad){
        hiddenField('entry_criteria');
        hiddenField('if_criteria_not_met');
    }else{
        schema._schema.entry_criteria = objectSchema.entry_criteria;
        schema._schema.if_criteria_not_met = objectSchema.if_criteria_not_met;
    }

    if(doc.approver === 'submitter_choose'){
        hiddenField('assigned_approver_users');
        hiddenField('assigned_approver_roles');
        hiddenField('assigned_approver_flow_roles');
        hiddenField('assigned_approver_user_field');
        hiddenField('when_multiple_approvers');

        schema._schema.when_multiple_approvers.optional = true;
    }else{
        schema._schema.assigned_approver_users = objectSchema.assigned_approver_users;
        schema._schema.assigned_approver_roles = objectSchema.assigned_approver_roles;
        schema._schema.assigned_approver_flow_roles = objectSchema.assigned_approver_flow_roles;
        schema._schema.assigned_approver_user_field = objectSchema.assigned_approver_user_field;
        schema._schema.when_multiple_approvers = objectSchema.when_multiple_approvers;
        schema._schema.when_multiple_approvers.optional = false;
    }
}