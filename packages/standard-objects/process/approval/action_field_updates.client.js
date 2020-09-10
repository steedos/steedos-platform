Steedos.ProcessFieldUpdatesManager = {};

Steedos.ProcessFieldUpdatesManager.changeSchema = function(doc, schema){
    var objectSchema = Creator.getObjectSchema(Creator.getObject("action_field_updates"));
    var operation = doc.operation;
    if(operation === 'null'){
        schema._schema.formula.autoform.type = 'hidden';
        schema._schema.literal_value.autoform.type = 'hidden';
      }

      if(operation === 'formula'){
        schema._schema.formula = objectSchema.formula;
        schema._schema.literal_value.autoform.type = 'hidden';
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