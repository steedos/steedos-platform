
if (Meteor.isServer) {
  db.space_user_signs._ensureIndex({
    "space": 1,
    "user": 1
  }, {
    background: true
  });
}