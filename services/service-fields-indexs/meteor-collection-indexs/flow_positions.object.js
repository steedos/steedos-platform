if (Meteor.isServer) {
  db.flow_positions._ensureIndex({
    "space": 1,
    "created": 1
  }, {
    background: true
  });
  db.flow_positions._ensureIndex({
    "space": 1,
    "created": 1,
    "modified": 1
  }, {
    background: true
  });
  db.flow_positions._ensureIndex({
    "role": 1,
    "org": 1,
    "space": 1
  }, {
    background: true
  });
  db.flow_positions._ensureIndex({
    "space": 1,
    "users": 1
  }, {
    background: true
  });
  db.flow_positions._ensureIndex({
    "space": 1,
    "role": 1
  }, {
    background: true
  });
}
