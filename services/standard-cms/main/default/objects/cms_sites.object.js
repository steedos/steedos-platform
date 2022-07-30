if (!db.cms_sites) {
  const core = require('@steedos/core');
  db.cms_sites = core.newCollection('cms_sites');
}

if (Meteor.isServer) {
  db.cms_sites.allow({
    insert: function(userId, event) {
      if (userId && event.space) {
        return Steedos.isSpaceAdmin(event.space, userId);
      } else {
        return false;
      }
    },
    update: function(userId, event) {
      if (userId && event.space) {
        return Steedos.isSpaceAdmin(event.space, userId);
      } else {
        return false;
      }
    },
    remove: function(userId, event) {
      if (userId && event.space) {
        return Steedos.isSpaceAdmin(event.space, userId);
      } else {
        return false;
      }
    }
  });
  db.cms_sites.before.insert(function(userId, doc) {
    doc.created_by = userId;
    doc.created = new Date();
    doc.modified_by = userId;
    doc.modified = new Date();
    if (!userId) {
      throw new Meteor.Error(400, "cms_sites_error_login_required");
    }
    doc.owner = userId;
    if (!doc.admins) {
      doc.admins = [userId];
    }
    if (doc.admins.indexOf(userId) < 0) {
      return doc.admins.push(userId);
    }
  });
  db.cms_sites.after.insert(function(userId, doc) {});
  db.cms_sites.before.update(function(userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    // if (doc.owner !== userId) {
    //   throw new Meteor.Error(400, "cms_sites_error_site_owner_only");
    // }
    if (modifier.$set.admins) {
      if (modifier.$set.admins.indexOf(userId) < 0) {
        modifier.$set.admins.push(userId);
      }
    }
    modifier.$set.modified_by = userId;
    return modifier.$set.modified = new Date();
  });
  db.cms_sites.before.remove(function(userId, doc) {
    var category, post;
    category = db.cms_categories.findOne({
      site: doc._id
    });
    if (category) {
      throw new Meteor.Error(400, "cms_sites_error_has_categories");
    }
    post = db.cms_posts.findOne({
      site: doc._id
    });
    if (post) {
      throw new Meteor.Error(400, "cms_sites_error_has_posts");
    }
  });
}



