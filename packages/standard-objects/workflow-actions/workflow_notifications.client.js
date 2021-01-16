Steedos.WorkflowNotificationsManager = {};

Steedos.WorkflowNotificationsManager.changeSchema = function (doc, schema) {
  var objectName = Session.get("object_name");
  var actionObjectName = Session.get("action_object_name");
  var actionOperation = Session.get("cmOperation");
  if (objectName == 'process_node') {
    var processDefinitionId = AutoForm.getFormValues("creatorEditForm").insertDoc.process_definition; //Creator.odata.get("process_node", recordId, "process_definition").process_definition;
    if(processDefinitionId){
      var object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
      schema._schema.object_name.autoform.readonly = true;
      doc.object_name = object_name;
    }else{
      toastr.error("请先选择该批准步骤的“批准过程”然后再新建工作流通知！");
    }
  }

  if (objectName == 'process_definition') {
    var object_name = null;
    if(actionObjectName == "process_definition"){
        // 当前正在新建或编辑批准过程
      if (actionOperation == 'update') {
        object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name;
      } else {
        object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name;
      }
      if(!object_name){
        toastr.error("请先选择该批准过程的“对象”然后再新建工作流通知！");
      }
    }else{
        // 当前正在新建或编辑批准过程以外其他对象，目前只有批准过程详细界面新建或编辑批准步骤
        if (actionOperation == 'update') {
          var processDefinitionId = AutoForm.getFormValues("creatorEditForm").insertDoc.process_definition;
          if(processDefinitionId){
            object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
          }
          else{
            toastr.error("请先选择该批准步骤的“批准过程”然后再新建工作流通知！");
          }
        } else {
          var formValues = AutoForm.getFormValues("creatorAddRelatedForm");
          if(!formValues){
            // 有可能是在批准过程详细界面点击了批准步骤列表顶部的链接进入了“相关批准步骤列表界面”然后点击的右上角的新建按钮触发的
            formValues = AutoForm.getFormValues("creatorAddForm");
          }
          var processDefinitionId = formValues.insertDoc.process_definition;
          if(processDefinitionId){
            object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
          }
          else{
            toastr.error("请先选择该批准步骤的“批准过程”然后再新建工作流通知！");
          }
        }
    }
    schema._schema.object_name.autoform.readonly = true;
    doc.object_name = object_name;
  }

  if (objectName == 'workflow_rule') {
    var object_name = null;
    if (actionOperation == 'update') {
      object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name //Creator.odata.get("workflow_rule", Session.get("record_id"), "object_name").object_name;
    } else {
      object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name
    }
    schema._schema.object_name.autoform.readonly = true;
    if(object_name){
      doc.object_name = object_name;
    }
    else{
      toastr.error("请先选择该工作流规则的“对象”然后再新建工作流通知！");
    }
  }
}