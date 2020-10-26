Steedos.PermissionSetManager = {};

Steedos.PermissionSetManager.changeSchema = function(doc, schema){
    var objectSchema = Creator.getObjectSchema(Creator.getObject("permission_set"));

    var hiddenField = function(fieldName){
        schema._schema[fieldName].autoform.omit = true;
        schema._schema[fieldName].autoform.type = 'hidden';
        schema._schema[fieldName].optional = true;
    }

    if(doc.type == 'profile'){
        hiddenField('users');
        schema._schema.license = objectSchema.license;
        schema._schema.license.optional = false;
    }else{
        schema._schema.license.optional = true;
        schema._schema.license.defaultValue = null;
        schema._schema.license.autoform.defaultValue = null;
        schema._schema.users = objectSchema.users;
    }
}