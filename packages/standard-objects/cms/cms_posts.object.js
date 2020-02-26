if (!db.cms_posts) {
  db.cms_posts = new Meteor.Collection('cms_posts');
}

db.cms_posts.config = {
  STATUS_PENDING: 1,// 34
  STATUS_APPROVED: 2,// 35
  STATUS_REJECTED: 3,// 36
  STATUS_SPAM: 4,// 37
  STATUS_DELETED: 5 
};

if (Meteor.isServer) {
  db.cms_posts.allow({
    insert: function(userId, event) {
      if (userId) {
        return true;
      }
    },
    update: function(userId, event) {
      if (userId) {
        return true;
      }
    },
    remove: function(userId, event) {
      if (userId) {
        return true;
      }
    }
  });
  db.cms_posts.before.insert(function(userId, doc) {
    var atts, ref, ref1, user;
    if (!userId) {
      throw new Meteor.Error(400, "cms_error_login_required");
    }
    doc.created_by = userId;
    doc.created = new Date();
    doc.modified_by = userId;
    doc.modified = new Date();
    if (!doc.postDate) {
      doc.postDate = new Date();
    }
    doc.status = db.cms_posts.config.STATUS_APPROVED;
    // doc.author = userId;
    // user = db.users.findOne({
    //   _id: userId
    // });
    // if (user) {
    //   doc.author_name = user.name;
    // }
    if (doc.body) {
      doc.summary = doc.body.substring(0, 400);
    }
    // if (doc && doc.attachments) {
    //   doc.attachments = _.compact(doc.attachments);
    //   atts = cfs.posts.find({
    //     _id: {
    //       $in: doc.attachments
    //     }
    //   }).fetch();
    //   doc.images = [];
    //   return _.each(atts, function(att) {
    //     if (att.isImage()) {
    //       return doc.images.push(att._id);
    //     }
    //   });
    // }
  });
  db.cms_posts.after.insert(function(userId, doc) {
  });
  db.cms_posts.before.update(function(userId, doc, fieldNames, modifier, options) {
    if (!userId) {
      throw new Meteor.Error(400, "cms_error_login_required");
    }
    modifier.$set = modifier.$set || {};
    modifier.$set.modified_by = userId;
    modifier.$set.modified = new Date();
    if (modifier.$set.body) {
      modifier.$set.summary = modifier.$set.body.substring(0, 400);
    }
  });
  db.cms_posts.after.update(function(userId, doc, fieldNames, modifier, options) {
  });
  db.cms_posts.before.remove(function(userId, doc) {
    if (!userId) {
      throw new Meteor.Error(400, "cms_error_login_required");
    }
    // db.cms_reads.remove({
    //   post: doc._id
    // });
    // return db.cms_unreads.remove({
    //   post: doc._id
    // });
  });
}

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
  db.cms_posts._ensureIndex({
    "site": 1
  }, {
    background: true
  });
  db.cms_posts._ensureIndex({
    "category": 1
  }, {
    background: true
  });
}

