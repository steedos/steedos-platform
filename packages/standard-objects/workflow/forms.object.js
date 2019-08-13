if (!db.forms) {
  db.forms = new Meteor.Collection('forms');
}

if (Meteor.isServer) {
  db.forms.before.insert(function (userId, doc) {
    doc.created_by = userId;
    doc.created = new Date();
    if (doc.current) {
      doc.current.created_by = userId;
      doc.current.created = new Date();
      doc.current.modified_by = userId;
      return doc.current.modified = new Date();
    }
  });
  db.forms.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
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
