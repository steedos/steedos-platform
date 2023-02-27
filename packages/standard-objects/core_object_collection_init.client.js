  db.apps.isInternalApp = function(url) {
    var app_url, i, len, ref;
    if (url && db.apps.INTERNAL_APPS) {
      ref = db.apps.INTERNAL_APPS;
      for (i = 0, len = ref.length; i < len; i++) {
        app_url = ref[i];
        if (url.startsWith(app_url)) {
          return true;
        }
      }
    }
    return false;
  };
  db.users = Meteor.users;

  db.users.allow({
    update: function(userId, doc, fields, modifier) {
      if (userId === doc._id) {
        return true;
      }
    }
  });

  db.users.helpers({
    spaces: function() {
      var spaces, sus;
      spaces = [];
      sus = db.space_users.find({
        user: this._id
      }, {
        fields: {
          space: 1
        }
      });
      sus.forEach(function(su) {
        return spaces.push(su.space);
      });
      return spaces;
    },
    displayName: function() {
      if (this.name) {
        return this.name;
      } else if (this.username) {
        return this.username;
      } else if (this.emails && this.emails[0]) {
        return this.emails[0].address;
      }
    }
  });


  db.spaces.helpers({
    owner_name: function() {
      var owner;
      owner = db.space_users.findOne({
        user: this.owner
      });
      return owner && owner.name;
    },
    admins_name: function() {
      var adminNames, admins;
      if (!this.admins) {
        return "";
      }
      admins = db.space_users.find({
        user: {
          $in: this.admins
        }
      }, {
        fields: {
          name: 1
        }
      });
      adminNames = [];
      admins.forEach(function(admin) {
        return adminNames.push(admin.name);
      });
      return adminNames.toString();
    }
  });


  db.space_users._simpleSchema = new SimpleSchema;

  Meteor.startup(function() {
    db.space_users._simpleSchema.i18n("space_users");
    db.space_users._sortFunction = function(doc1, doc2) {
      var ref;
      if (doc1.sort_no === doc2.sort_no) {
        return (ref = doc1.name) != null ? ref.localeCompare(doc2.name) : void 0;
      } else if (doc1.sort_no === void 0) {
        return 1;
      } else if (doc2.sort_no === void 0) {
        return -1;
      } else if (doc1.sort_no > doc2.sort_no) {
        return -1;
      } else {
        return 1;
      }
    };
    db.space_users.before.find(function(userId, query, options) {
      if (!options) {
        options = {};
      }
      return options.sort = db.space_users._sortFunction;
    });
    db.space_users.attachSchema(db.space_users._simpleSchema);
    return db.space_users.helpers({
      space_name: function() {
        var space;
        space = db.spaces.findOne({
          _id: this.space
        });
        return space != null ? space.name : void 0;
      },
      organization_name: function() {
        var organizations;
        if (this.organizations) {
          organizations = SteedosDataManager.organizationRemote.find({
            _id: {
              $in: this.organizations
            }
          }, {
            fields: {
              fullname: 1
            }
          });
          return organizations != null ? organizations.getProperty('fullname').join('<br/>') : void 0;
        }
      }
    });
  });


  db.organizations._sortFunction = function(doc1, doc2) {
    var ref;
    if (doc1.sort_no === doc2.sort_no) {
      return (ref = doc1.name) != null ? ref.localeCompare(doc2.name) : void 0;
    } else if (doc1.sort_no > doc2.sort_no) {
      return -1;
    } else {
      return 1;
    }
  };

  db.organizations.getRoot = function(fields) {
    return SteedosDataManager.organizationRemote.findOne({
      parent: null
    }, {
      fields: fields
    });
  };

  db.organizations.helpers({
    calculateParents: function() {
      var parentId, parentOrg, parents;
      parents = [];
      if (!this.parent) {
        return parents;
      }
      parentId = this.parent;
      while (parentId) {
        parents.push(parentId);
        parentOrg = db.organizations.findOne({
          _id: parentId
        }, {
          parent: 1,
          name: 1
        });
        if (parentOrg) {
          parentId = parentOrg.parent;
        } else {
          parentId = null;
        }
      }
      return parents;
    },
    calculateFullname: function() {
      var fullname, parentId, parentOrg;
      fullname = this.name;
      if (!this.parent) {
        return fullname;
      }
      parentId = this.parent;
      while (parentId) {
        parentOrg = db.organizations.findOne({
          _id: parentId
        }, {
          parent: 1,
          name: 1
        });
        if (parentOrg) {
          parentId = parentOrg.parent;
        } else {
          parentId = null;
        }
        if (parentId) {
          fullname = (parentOrg != null ? parentOrg.name : void 0) + "/" + fullname;
        }
      }
      return fullname;
    },
    calculateChildren: function() {
      var children, childrenObjs;
      children = [];
      childrenObjs = db.organizations.find({
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
    },
    updateUsers: function() {
      var spaceUsers, users;
      users = [];
      spaceUsers = db.space_users.find({
        organizations: this._id
      }, {
        fields: {
          user: 1
        }
      });
      spaceUsers.forEach(function(user) {
        return users.push(user.user);
      });
      return db.organizations.direct.update({
        _id: this._id
      }, {
        $set: {
          users: users
        }
      });
    },
    space_name: function() {
      var space;
      space = db.spaces.findOne({
        _id: this.space
      });
      return space != null ? space.name : void 0;
    },
    users_count: function() {
      if (this.users) {
        return this.users.length;
      } else {
        return 0;
      }
    },
    calculateAllChildren: function() {
      var children, childrenObjs;
      children = [];
      childrenObjs = db.organizations.find({
        parents: {
          $in: [this._id]
        }
      }, {
        fields: {
          _id: 1
        }
      });
      childrenObjs.forEach(function(child) {
        return children.push(child._id);
      });
      return _.uniq(children);
    },
    calculateUsers: function(isIncludeParents) {
      var orgs, userOrgs, users;
      orgs = isIncludeParents ? this.calculateAllChildren() : this.calculateChildren();
      orgs.push(this._id);
      users = [];
      userOrgs = db.organizations.find({
        _id: {
          $in: orgs
        }
      }, {
        fields: {
          users: 1
        }
      });
      userOrgs.forEach(function(org) {
        var ref;
        if (org != null ? (ref = org.users) != null ? ref.length : void 0 : void 0) {
          return users = users.concat(org.users);
        }
      });
      return _.uniq(users);
    }
  });


  db.audit_logs._simpleSchema = new SimpleSchema({
    c_name: {
      type: String
    },
    c_action: {
      type: String
    },
    object_id: {
      type: String
    },
    object_name: {
      type: String
    },
    value_previous: {
      type: Object,
      optional: true,
      blackbox: true
    },
    value: {
      type: Object,
      optional: true,
      blackbox: true
    },
    created_by: {
      type: String
    },
    created_by_name: {
      type: String
    },
    created: {
      type: Date
    }
  });

  db.audit_logs._simpleSchema.i18n("audit_logs");


  db.space_settings._simpleSchema = new SimpleSchema({
    space: {
      type: String
    },
    key: {
      type: String
    },
    value: {
      type: Object,
      blackbox: true
    },
    is_public: {
      type: Boolean
    }
  });


  db.steedos_keyvalues._simpleSchema = new SimpleSchema({
    space: {
      type: String
    },
    user: {
      type: String
    },
    key: {
      type: String
    },
    value: {
      type: Object,
      blackbox: true
    }
  });
