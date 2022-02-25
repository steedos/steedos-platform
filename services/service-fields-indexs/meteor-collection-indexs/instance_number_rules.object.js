if (Meteor.isServer) {
  db.instance_number_rules._ensureIndex({
    "space": 1,
    "name": 1
  }, {
    background: true
  });
}
