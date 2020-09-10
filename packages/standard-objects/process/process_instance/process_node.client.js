Steedos.ProcessNodeManager = {};

Steedos.ProcessNodeManager.changeSchema = function(doc, schema){
    var objectSchema = Creator.getObjectSchema(Creator.getObject());

    if(doc.filtrad){
        schema._schema.entry_criteria.autoform.omit = true;
        schema._schema.if_criteria_not_met.autoform.omit = true;
    }else{
        schema._schema.entry_criteria = objectSchema.entry_criteria;
        schema._schema.if_criteria_not_met = objectSchema.if_criteria_not_met;
    }

    if(doc.approver === 'submitter_choose'){
        schema._schema.assigned_approver_users.autoform.omit = true;
        schema._schema.assigned_approver_roles.autoform.omit = true;
        schema._schema.assigned_approver_flow_roles.autoform.omit = true;
        schema._schema.assigned_approver_user_field.autoform.omit = true;
        schema._schema.when_multiple_approvers.autoform.omit = true;
    }else{
        schema._schema.assigned_approver_users = objectSchema.assigned_approver_users;
        schema._schema.assigned_approver_roles = objectSchema.assigned_approver_roles;
        schema._schema.assigned_approver_flow_roles = objectSchema.assigned_approver_flow_roles;
        schema._schema.assigned_approver_user_field = objectSchema.assigned_approver_user_field;
        schema._schema.when_multiple_approvers = objectSchema.when_multiple_approvers;
        schema._schema.when_multiple_approvers.optional = false;
    }
}