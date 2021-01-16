Steedos.WorkflowNotificationsManager = {};

Steedos.WorkflowNotificationsManager.changeSchema = function (doc, schema) {
  if (Session.get("object_name") == 'process_node') {
    var processDefinitionId = Creator.odata.get("process_node", Session.get("record_id"), "process_definition").process_definition;
    var object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
    schema._schema.object_name.autoform.readonly = true;
    doc.object_name = object_name;
  }

  if (Session.get("object_name") == 'process_definition') {
    var object_name = null;
    if (Session.get("cmOperation") == 'update') {
      object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name //Creator.odata.get("process_definition", Session.get("record_id"), "object_name").object_name;
    } else {
      object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name
    }
    schema._schema.object_name.autoform.readonly = true;
    doc.object_name = object_name;
  }

  if (Session.get("object_name") == 'workflow_rule') {
    var object_name = null;
    if (Session.get("cmOperation") == 'update') {
      object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name //Creator.odata.get("workflow_rule", Session.get("record_id"), "object_name").object_name;
    } else {
      object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name
    }
    schema._schema.object_name.autoform.readonly = true;
    doc.object_name = object_name;
  }
}