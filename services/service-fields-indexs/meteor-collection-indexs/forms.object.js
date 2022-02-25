if (Meteor.isServer) {
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
