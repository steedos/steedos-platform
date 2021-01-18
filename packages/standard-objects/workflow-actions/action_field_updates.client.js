Steedos.ProcessFieldUpdatesManager = {};

Steedos.ProcessFieldUpdatesManager.changeSchema = function(doc, schema){
    var objectSchema = Creator.getObjectSchema(Creator.getObject("action_field_updates"));
    var operation = doc.operation;

    var hiddenField = function(fieldName){
      schema._schema[fieldName].autoform.omit = true;
      schema._schema[fieldName].autoform.type = 'hidden';
    }
    if(Session.get("object_name") == 'process_node'){
        var processDefinitionId = Creator.odata.get("process_node", Session.get("record_id"), "process_definition").process_definition;
        var object_name = Creator.odata.get("process_definition", processDefinitionId, "object_name").object_name;
        schema._schema.object_name.autoform.readonly = true;
        doc.object_name = object_name;
    }

    if(Session.get("object_name") == 'process_definition'){
      var object_name = null;
      if(Session.get("cmOperation") == 'update'){
        object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name //Creator.odata.get("process_definition", Session.get("record_id"), "object_name").object_name;
      }else{
        object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name
      }
      schema._schema.object_name.autoform.readonly = true;
      doc.object_name = object_name;
    }

    if(Session.get("object_name") == 'workflow_rule'){
      var object_name = null;
      if(Session.get("cmOperation") == 'update'){
        object_name = AutoForm.getFormValues("creatorEditForm").insertDoc.object_name //Creator.odata.get("workflow_rule", Session.get("record_id"), "object_name").object_name;
      }else{
        object_name = AutoForm.getFormValues("creatorAddForm").insertDoc.object_name
      }
      schema._schema.object_name.autoform.readonly = true;
      doc.object_name = object_name;
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

    if(operation === 'null'){
      hiddenField('formula');
      hiddenField('literal_value');
    }

      if(operation === 'formula'){
        schema._schema.formula = objectSchema.formula;
        hiddenField('literal_value');
      }

      if(operation === 'literal'){
        schema._schema.formula.autoform.type = 'hidden';
        var doc = doc;
        var mainObjectName = null;
        if(doc.target_object && doc.target_object != doc.object_name){
          var mainObjectName = Creator.objectsByName[doc.object_name].fields[doc.target_object].reference_to;
        }else{
          mainObjectName = doc.object_name;
        }
        var object = Creator.objectsByName[mainObjectName];
        if(object && doc.field_name){
          schema._schema.literal_value = Object.assign({},Creator.getObjectSchema(Creator.getObject(mainObjectName))[doc.field_name], {label: schema._schema.literal_value.label});
          schema._schema.literal_value.autoform.disabled = false;
          schema._schema.literal_value.autoform.omit = false;
          schema._schema.literal_value.autoform.readonly = false;
          schema._schema.literal_value.autoform.is_wide = true;
        }else{
          schema._schema.literal_value.autoform.type = 'text';
        }
        
      }
}