Steedos.ProcessFieldUpdatesManager = {};

Steedos.ProcessFieldUpdatesManager.changeSchema = function (doc, schema) {
  var objectSchema = Creator.getObjectSchema(Creator.getObject("action_field_updates"));
  var operation = doc.operation;

  var hiddenField = function (fieldName) {
    schema._schema[fieldName].autoform.omit = true;
    schema._schema[fieldName].autoform.type = 'hidden';
  }
  // var recordId = Session.get("record_id");
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
      toastr.error(t("action_field_updates_field__error_process_node_process_definition_required"));
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
        toastr.error(t("action_field_updates_field__error_process_definition_object_required"));
      }
    }else{
        // 当前正在新建或编辑批准过程以外其他对象，目前只有批准过程详细界面新建或编辑批准步骤
        if (actionOperation == 'update') {
          var processDefinitionId = AutoForm.getFormValues("creatorEditForm").insertDoc.process_definition;
          if(processDefinitionId){
            object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
          }
          else{
            toastr.error(t("action_field_updates_field__error_process_node_process_definition_required"));
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
            toastr.error(t("action_field_updates_field__error_process_node_process_definition_required"));
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
      toastr.error(t("action_field_updates_field__error_workflow_rule_object_required"));
    }
  }

  // if(doc.process_definition){
  //   hiddenField('process_node');
  //   schema._schema.when.autoform.options = _.filter(objectSchema.when.autoform.options, function(option){return _.include(['final_approval','final_rejection','recall','initial_submission'], option.value)});
  //   var pid = doc.process_definition;
  //   if(_.isObject(pid)){
  //     if(_.has(pid, 'ids') && pid.ids.length > 0){
  //       pid = pid.ids[0];
  //     }else{
  //       pid = pid._id;
  //     }
  //   }
  //   var object_name = Creator.odata.get("process_definition", pid, "object_name").object_name;
  //   schema._schema.object_name.optionsFunction = function(){var _obj = Creator.getObject(object_name); return [{label: _obj.label, value: _obj.name, icon: _obj.icon}]}
  //   doc.object_name = object_name;
  // }else{
  //   schema._schema.process_node = objectSchema.process_node;
  //   schema._schema.when.autoform.options = _.filter(objectSchema.when.autoform.options, function(option){return _.include(['approval','rejection'], option.value)})
  // }

  // if(doc.process_node){
  //   hiddenField('process_definition');
  //   var pnid = doc.process_node;
  //   if(_.isObject(pnid)){
  //     if(_.has(pnid, 'ids') && pnid.ids.length > 0){
  //       pnid = pnid.ids[0];
  //     }else{
  //       pnid = pnid._id;
  //     }
  //   }
  //   var processDefinitionId = Creator.odata.get("process_node", pnid, "process_definition").process_definition;
  //   var object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
  //   schema._schema.object_name.optionsFunction = function(){var _obj = Creator.getObject(object_name); return [{label: _obj.label, value: _obj.name, icon: _obj.icon}]}
  //   doc.object_name = object_name;
  //   schema._schema.when.autoform.options = _.filter(objectSchema.when.autoform.options, function(option){return _.include(['approval','rejection'], option.value)})
  // }else{
  //   schema._schema.process_definition = objectSchema.process_definition;
  //   schema._schema.when.autoform.options = _.filter(objectSchema.when.autoform.options, function(option){return _.include(['final_approval','final_rejection','recall','initial_submission'], option.value)})
  // }

  if (operation === 'null') {
    hiddenField('formula');
    hiddenField('literal_value');
  }

  if (operation === 'formula') {
    schema._schema.formula = objectSchema.formula;
    hiddenField('literal_value');
  }

  if (operation === 'literal') {
    schema._schema.formula.autoform.type = 'hidden';
    var doc = doc;
    var mainObjectName = null;
    if (doc.target_object && doc.target_object != doc.object_name) {
      var mainObjectName = Creator.objectsByName[doc.object_name].fields[doc.target_object].reference_to;
    } else {
      mainObjectName = doc.object_name;
    }
    var object = Creator.objectsByName[mainObjectName];
    if (object && doc.field_name) {
      schema._schema.literal_value = Object.assign({}, Creator.getObjectSchema(Creator.getObject(mainObjectName))[doc.field_name], { label: schema._schema.literal_value.label });
      schema._schema.literal_value.autoform.disabled = false;
      schema._schema.literal_value.autoform.omit = false;
      schema._schema.literal_value.autoform.readonly = false;
      schema._schema.literal_value.autoform.is_wide = true;
    } else {
      schema._schema.literal_value.autoform.type = 'text';
    }

  }else{
    schema._schema.literal_value.optional = true;
  }
}