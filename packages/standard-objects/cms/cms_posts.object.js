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
    if ((!(doc != null ? (ref = doc.members) != null ? ref.users : void 0 : void 0)) && (!(doc != null ? (ref1 = doc.members) != null ? ref1.organizations : void 0 : void 0))) {
      throw new Meteor.Error(400, "cms_error_required_members_value");
    }
    doc.created_by = userId;
    doc.created = new Date();
    doc.modified_by = userId;
    doc.modified = new Date();
    if (!doc.postDate) {
      doc.postDate = new Date();
    }
    doc.status = db.cms_posts.config.STATUS_APPROVED;
    doc.author = userId;
    user = db.users.findOne({
      _id: userId
    });
    if (user) {
      doc.author_name = user.name;
    }
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
    // var bulk, created, members, postId, siteId;
    // if (doc && doc.attachments) {
    //   cfs.posts.update({
    //     _id: {
    //       $in: doc.attachments
    //     }
    //   }, {
    //     $set: {
    //       site: doc.site,
    //       post: doc._id
    //     }
    //   }, {
    //     multi: true
    //   });
    //   cfs.posts.remove({
    //     post: doc._id,
    //     _id: {
    //       $not: {
    //         $in: doc.attachments
    //       }
    //     }
    //   });
    // }
    // members = CMS.getPostMembers(doc);
    // siteId = doc.site;
    // postId = doc._id;
    // if (members.length) {
    //   created = new Date();
    //   bulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp();
    //   members.forEach(function(member) {
    //     return bulk.insert({
    //       user: member,
    //       site: siteId,
    //       post: postId,
    //       created: created
    //     });
    //   });
    //   return bulk.execute();
    // }
  });
  db.cms_posts.before.update(function(userId, doc, fieldNames, modifier, options) {
    var addBulk, addMembers, atts, created, isMembersChanged, isVisibilityPrivateChanged, newMembers, newMembersOrganizations, newMembersUsers, newVisibilityPrivate, oldMembers, oldMembersOrganizations, oldMembersUsers, oldVisibilityPrivate, postId, ref, ref1, siteId, subBulk, subMembers;
    if (!userId) {
      throw new Meteor.Error(400, "cms_error_login_required");
    }
    modifier.$set = modifier.$set || {};
    modifier.$set.modified_by = userId;
    modifier.$set.modified = new Date();
    // if (modifier.$set.attachments) {
    //   modifier.$set.attachments = _.compact(modifier.$set.attachments);
    //   atts = cfs.posts.find({
    //     _id: {
    //       $in: modifier.$set.attachments
    //     }
    //   }).fetch();
    //   modifier.$set.images = [];
    //   _.each(atts, function(att) {
    //     if (att.isImage()) {
    //       return modifier.$set.images.push(att._id);
    //     }
    //   });
    // }
    if (modifier.$set.body) {
      modifier.$set.summary = modifier.$set.body.substring(0, 400);
    }
    // oldVisibilityPrivate = doc.visibility === "private";
    // newVisibilityPrivate = modifier.$set.visibility === "private";
    // if (oldVisibilityPrivate !== newVisibilityPrivate) {
    //   isVisibilityPrivateChanged = true;
    // }
    // if (!isVisibilityPrivateChanged) {
    //   oldMembersOrganizations = (ref = doc.members) != null ? ref.organizations : void 0;
    //   oldMembersUsers = (ref1 = doc.members) != null ? ref1.users : void 0;
    //   // newMembersOrganizations = modifier.$set["members.organizations"];
    //   newMembersOrganizations = modifier.$set["members"] && modifier.$set["members"].organizations;
    //   // newMembersUsers = modifier.$set["members.users"];
    //   newMembersUsers = modifier.$set["members"] && modifier.$set["members"].users;
    //   if ((!newMembersUsers) && (!newMembersOrganizations)) {
    //     throw new Meteor.Error(400, "cms_error_required_members_value");
    //   }
    //   if ((newMembersOrganizations != null ? newMembersOrganizations.length : void 0) !== (oldMembersOrganizations != null ? oldMembersOrganizations.length : void 0)) {
    //     isMembersChanged = true;
    //   }
    //   if (!isMembersChanged && (newMembersUsers != null ? newMembersUsers.length : void 0) !== (oldMembersUsers != null ? oldMembersUsers.length : void 0)) {
    //     isMembersChanged = true;
    //   }
    //   if (!isMembersChanged && (newMembersOrganizations != null ? newMembersOrganizations.sort().join(",") : void 0) !== (oldMembersOrganizations != null ? oldMembersOrganizations.sort().join(",") : void 0)) {
    //     isMembersChanged = true;
    //   }
    //   if (!isMembersChanged && (newMembersUsers != null ? newMembersUsers.sort().join(",") : void 0) !== (oldMembersUsers != null ? oldMembersUsers.sort().join(",") : void 0)) {
    //     isMembersChanged = true;
    //   }
    // }
    // if (isVisibilityPrivateChanged || isMembersChanged) {
    //   oldMembers = CMS.getPostMembers(doc);
    //   newMembers = CMS.getPostMembers(modifier.$set, true);
    //   addMembers = _.difference(newMembers, oldMembers);
    //   subMembers = _.difference(oldMembers, newMembers);
    //   siteId = doc.site;
    //   postId = doc._id;
    //   if (addMembers.length) {
    //     created = new Date();
    //     addBulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp();
    //     addMembers.forEach(function(member) {
    //       return addBulk.insert({
    //         user: member,
    //         site: siteId,
    //         post: postId,
    //         created: created
    //       });
    //     });
    //     addBulk.execute();
    //   }
    //   if (subMembers.length) {
    //     created = new Date();
    //     subBulk = db.cms_unreads.rawCollection().initializeUnorderedBulkOp();
    //     subBulk.find({
    //       post: postId,
    //       user: {
    //         $in: subMembers
    //       }
    //     }).remove();
    //     return subBulk.execute();
    //   }
    // }
  });
  db.cms_posts.after.update(function(userId, doc, fieldNames, modifier, options) {
    // var self;
    // self = this;
    // modifier.$set = modifier.$set || {};
    // if (modifier.$set && modifier.$set.attachments) {
    //   cfs.posts.update({
    //     _id: {
    //       $in: modifier.$set.attachments
    //     }
    //   }, {
    //     $set: {
    //       site: doc.site,
    //       post: doc._id
    //     }
    //   }, {
    //     multi: true
    //   });
    //   return cfs.posts.remove({
    //     post: doc._id,
    //     _id: {
    //       $not: {
    //         $in: modifier.$set.attachments
    //       }
    //     }
    //   });
    // }
  });
  db.cms_posts.before.remove(function(userId, doc) {
    if (!userId) {
      throw new Meteor.Error(400, "cms_error_login_required");
    }
    db.cms_reads.remove({
      post: doc._id
    });
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

