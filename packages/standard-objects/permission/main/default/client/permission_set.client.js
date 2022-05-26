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
        schema._schema.password_history = objectSchema.password_history;
        schema._schema.max_login_attempts = objectSchema.max_login_attempts;
        schema._schema.lockout_interval = objectSchema.lockout_interval;
        schema._schema.enable_MFA = objectSchema.enable_MFA;
        schema._schema.logout_other_clients = objectSchema.logout_other_clients;
        schema._schema.login_expiration_in_days = objectSchema.login_expiration_in_days;
        schema._schema.phone_logout_other_clients = objectSchema.phone_logout_other_clients;
        schema._schema.phone_login_expiration_in_days = objectSchema.phone_login_expiration_in_days;
    }else{
        hiddenField('password_history');
        hiddenField('max_login_attempts');
        hiddenField('lockout_interval');
        hiddenField('enable_MFA');
        hiddenField('logout_other_clients');
        hiddenField('login_expiration_in_days');
        hiddenField('phone_logout_other_clients');
        hiddenField('phone_login_expiration_in_days');
        schema._schema.license.optional = true;
        schema._schema.license.defaultValue = null;
        schema._schema.license.autoform.defaultValue = null;
        schema._schema.users = objectSchema.users;
    }
}