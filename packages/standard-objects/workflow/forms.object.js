if (!db.forms) {
  const core = require('@steedos/core');
  db.forms = core.newCollection('forms');
}

function checkFields(fields){
  _.each(fields, function(field){
    if(field.code && field.code.indexOf('.') > -1){
      // throw new Meteor.Error(500, '_forms_field_code_error', {field: field.code});
      throw new Error(`字段名 ${field.code} 不能包含'.'`)
    }
  })
}

if (Meteor.isServer) {
  db.forms.before.insert(function (userId, doc) {
    doc.created_by = userId;
    doc.created = new Date();
    if (doc.current) {
      if(doc.current.fields){
        checkFields(doc.current.fields);
      }
      doc.current.created_by = userId;
      doc.current.created = new Date();
      doc.current.modified_by = userId;
      return doc.current.modified = new Date();
    }
  });
  db.forms.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    if(modifier.$set.current && modifier.$set.current.fields){
      checkFields(modifier.$set.current.fields);
    }
    modifier.$set.modified_by = userId;
    return modifier.$set.modified = new Date();
  });
  db.forms._ensureIndex({
    "is_deleted": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "space": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "space": 1,
    "is_deleted": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "space": 1,
    "app": 1,
    "created": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "space": 1,
    "app": 1,
    "created": 1,
    "current.modified": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "name": 1,
    "space": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "_id": 1,
    "space": 1
  }, {
      background: true
    });
  db.forms._ensureIndex({
    "space": 1,
    "state": 1
  }, {
      background: true
    });
}
