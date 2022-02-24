

if (Meteor.isServer) {
  db.process_delegation_rules._ensureIndex({
    "enabled": 1,
    "end_time": 1
  }, {
    background: true
  });
}