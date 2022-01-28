if (Meteor.isServer) {
  db.cms_posts._ensureIndex({
    "site": 1,
    "tags": 1
  }, {
    background: true
  });
  db.cms_posts._ensureIndex({
    "site": 1,
    "category": 1
  }, {
    background: true
  });
}

