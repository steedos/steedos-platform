if (Meteor.isServer) {
  db.flow_roles._ensureIndex({
    "space": 1,
    "created": 1
  }, {
    background: true
  });
  db.flow_roles._ensureIndex({
    "space": 1,
    "created": 1,
    "modified": 1
  }, {
    background: true
  });
}