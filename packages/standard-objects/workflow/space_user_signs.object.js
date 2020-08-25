if (!db.space_user_signs) {
  const core = require('@steedos/core');
  db.space_user_signs = core.newCollection('space_user_signs');
}

if (Meteor.isServer) {
  db.space_user_signs.allow({
    insert: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    update: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    remove: function (userId, doc) {
      if (!Steedos.isSpaceAdmin(doc.space, userId)) {
        return false;
      } else {
        return true;
      }
    }
  });
  db.space_user_signs.before.insert(function (userId, doc) {
    var userSign;
    doc.created_by = userId;
    doc.created = new Date();
    doc.modified_by = userId;
    doc.modified = new Date();
    userSign = db.space_user_signs.findOne({
      space: doc.space,
      user: doc.user
    });
    if (userSign) {
      throw new Meteor.Error(400, "spaceUserSigns_error_user_sign_exists");
    }
  });
  db.space_user_signs.before.update(function (userId, doc, fieldNames, modifier, options) {
    var userSign;
    modifier.$set.modified_by = userId;
    modifier.$set.modified = new Date();
    if (modifier.$set.user) {
      userSign = db.space_user_signs.findOne({
        space: doc.space,
        user: modifier.$set.user,
        _id: {
          $ne: doc._id
        }
      });
      if (userSign) {
        throw new Meteor.Error(400, "spaceUserSigns_error_user_sign_exists");
      }
    }
  });
  db.space_user_signs._ensureIndex({
    "space": 1,
    "user": 1
  }, {
      background: true
    });
}

db.space_user_signs.adminConfig = {
  icon: "globe",
  color: "blue",
  tableColumns: [
    {
      name: "userName()"
    },
    {
      name: "signImage()"
    }
  ],
  extraFields: ["space", "user", 'sign'],
  routerAdmin: "/admin",
  selector: Selector.selectorCheckSpaceAdmin
};

db.space_user_signs.helpers({
  signImage: function () {
    return "<img style='max-width: 120px;max-height: 80px;' src='" + Steedos.absoluteUrl("api/files/avatars/" + this.sign) + "' />";
  },
  userName: function () {
    var user;
    user = SteedosDataManager.spaceUserRemote.findOne({
      space: this.space,
      user: this.user
    }, {
        fields: {
          name: 1
        }
      });
    return user != null ? user.name : void 0;
  }
});

new Tabular.Table({
  name: "SpaceUserSigns",
  collection: db.space_user_signs,
  columns: [
    {
      data: "user",
      render: function (val,
        type,
        doc) {
        var user;
        user = SteedosDataManager.spaceUserRemote.findOne({
          space: doc.space,
          user: doc.user
        },
          {
            fields: {
              name: 1
            }
          });
        return user != null ? user.name : void 0;
      }
    },
    {
      data: "sign",
      render: function (val,
        type,
        doc) {
        return "<img style='max-width: 120px;max-height: 80px;' src='" + Steedos.absoluteUrl("api/files/avatars/" + doc.sign) + "' />";
      }
    }
  ],
  dom: "tp",
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  extraFields: ["space", "user", 'sign'],
  searching: true,
  autoWidth: false,
  changeSelector: function (selector, userId) {
    if (!userId) {
      return {
        _id: -1
      };
    }
    return selector;
  }
});
