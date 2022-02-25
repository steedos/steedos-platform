if (Meteor.isServer) {
  db.webhooks._ensureIndex({
    "flow": 1
  }, {
    background: true
  });
}