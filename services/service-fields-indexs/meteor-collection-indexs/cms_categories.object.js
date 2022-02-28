if (Meteor.isServer) {
  db.cms_categories._ensureIndex({
    "site": 1,
    "parent": 1
  }, {
    background: true
  });
}
