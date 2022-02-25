if (!db.cms_categories) {
  const core = require('@steedos/core');
  db.cms_categories = core.newCollection('cms_categories');
}

Meteor.startup(function () {
  if (Meteor.isClient) {
    db.cms_categories._sortFunction = function(doc1, doc2) {
      var ref;
      if (doc1.order === doc2.order) {
        return (ref = doc1.name) != null ? ref.localeCompare(doc2.name) : void 0;
      } else if (doc1.order > doc2.order) {
        return -1;
      } else {
        return 1;
      }
    };
  }
});


db.cms_categories.helpers({
  calculateParents: function() {
    var parentId, parentObj, parents;
    parents = [];
    if (!this.parent) {
      return parents;
    }
    parentId = this.parent;
    while (parentId) {
      parents.push(parentId);
      parentObj = db.cms_categories.findOne({
        _id: parentId
      }, {
        parent: 1,
        name: 1
      });
      if (parentObj && parentObj.parent && !parents.includes(parentObj.parent)) {
        parentId = parentObj.parent;
      } else {
        parentId = null;
      }
    }
    return parents;
  },
  calculateChildren: function() {
    var children, childrenObjs;
    children = [];
    childrenObjs = db.cms_categories.find({
      parent: this._id
    }, {
      fields: {
        _id: 1
      }
    });
    childrenObjs.forEach(function(child) {
      return children.push(child._id);
    });
    return children;
  }
});

if (Meteor.isServer) {
  db.cms_categories.before.insert(function(userId, doc) {
    doc.created_by = userId;
    doc.created = new Date();
    doc.modified_by = userId;
    return doc.modified = new Date();
  });
  db.cms_categories.before.update(function(userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    if (modifier.$set.parent === doc._id) {
      throw new Meteor.Error(400, "cms_categories_error_deny_set_self");
    }
    modifier.$set.modified_by = userId;
    return modifier.$set.modified = new Date();
  });
  db.cms_categories.before.remove(function(userId, doc) {
    var child, post;
    child = db.cms_categories.findOne({
      parent: doc._id
    });
    if (child) {
      throw new Meteor.Error(400, "cms_categories_error_has_children");
    }
    post = db.cms_posts.findOne({
      category: doc._id
    });
    if (post) {
      throw new Meteor.Error(400, "cms_categories_error_has_posts");
    }
  });
}

