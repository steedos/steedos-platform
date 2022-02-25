if (!db.flow_positions) {
  const core = require('@steedos/core');
  db.flow_positions = core.newCollection('flow_positions');
}

db.flow_positions.helpers({
  role_name: function () {
    var role;
    role = db.flow_roles.findOne({
      _id: this.role
    }, {
        fields: {
          name: 1
        }
      });
    return role && role.name;
  },
  org_name: function () {
    var org;
    org = db.organizations.findOne({
      _id: this.org
    }, {
        fields: {
          fullname: 1
        }
      });
    return org && org.fullname;
  },
  users_name: function () {
    var names, users;
    if (!this.users instanceof Array) {
      return "";
    }
    users = db.space_users.find({
      space: this.space,
      user: {
        $in: this.users
      }
    }, {
        fields: {
          name: 1
        }
      });
    names = [];
    users.forEach(function (user) {
      return names.push(user.name);
    });
    return names.toString();
  }
});

if (Meteor.isServer) {
  db.flow_positions.allow({
    insert: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    update: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    },
    remove: function (userId, event) {
      if (!Steedos.isSpaceAdmin(event.space, userId)) {
        return false;
      } else {
        return true;
      }
    }
  });
  db.flow_positions.before.insert(function (userId, doc) {
    doc.created_by = userId;
    return doc.created = new Date();
  });
  db.flow_positions.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modified_by = userId;
    return modifier.$set.modified = new Date();
  });
}

new Tabular.Table({
  name: "flow_positions",
  collection: db.flow_positions,
  pub: "flow_positions_tabular",
  columns: [
    {
      data: "role",
      width: "20%",
      render: function (val,
        type,
        doc) {
        var role;
        role = db.flow_roles.findOne({
          _id: doc.role
        },
          {
            fields: {
              name: 1
            }
          });
        return role && role.name;
      }
    },
    {
      data: "users",
      width: "auto",
      render: function (val,
        type,
        doc) {
        var names,
          users;
        if (!doc.users instanceof Array) {
          return "";
        }
        users = db.space_users.find({
          space: doc.space,
          user: {
            $in: doc.users
          }
        },
          {
            fields: {
              name: 1
            }
          });
        names = [];
        users.forEach(function (user) {
          return names.push(user.name);
        });
        return names.toString();
      }
    },
    {
      data: "org",
      width: "20%",
      render: function (val,
        type,
        doc) {
        var org;
        org = db.organizations.findOne({
          _id: doc.org
        },
          {
            fields: {
              fullname: 1
            }
          });
        return org && org.fullname;
      }
    }
  ],
  dom: "tp",
  extraFields: ["space", "role", "org", "users"],
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  searching: true,
  autoWidth: false,
  changeSelector: function (selector, userId) {
    var ref2, space, space_user;
    if (!userId) {
      return {
        _id: -1
      };
    }
    space = selector.space;
    if (!space) {
      if ((selector != null ? (ref2 = selector.$and) != null ? ref2.length : void 0 : void 0) > 0) {
        space = selector.$and.getProperty('space')[0];
      }
    }
    if (!space) {
      return {
        _id: -1
      };
    }
    space_user = db.space_users.findOne({
      user: userId,
      space: space
    }, {
        fields: {
          _id: 1
        }
      });
    if (!space_user) {
      return {
        _id: -1
      };
    }
    return selector;
  }
});

new Tabular.Table({
  name: "admin_flow_positions",
  collection: db.flow_positions,
  pub: "flow_positions_tabular",
  drawCallback: function (settings) {
    var action, tfoot;
    if ($(this).hasClass("datatable-flows-roles") && !$(".datatable-flows-roles tfoot").length) {
      action = t("add_positions");
      tfoot = `<tfoot>\n	<tr>\n		<td colspan='2'>\n			<div class="add-positions">\n				<i class="ion ion-plus-round"></i>${action}\n			</div>\n		</td>\n	<tr>\n</tfoot>`;
      return $(".datatable-flows-roles tbody").after(tfoot);
    }
  },
  columns: [
    {
      data: "users_name()",
      render: function (val,
        type,
        doc) {
        var org;
        org = db.organizations.findOne({
          _id: doc.org
        },
          {
            fields: {
              fullname: 1
            }
          });
        return `<div class="users-name">${val}</div>\n<div class="org-fullname">${(org != null ? org.fullname : void 0)}</div>`;
      }
    }
  ],
  extraFields: ["space", "role", "org", "users"],
  lengthChange: false,
  ordering: false,
  pageLength: 10,
  info: false,
  searching: true,
  autoWidth: true,
  changeSelector: function (selector, userId) {
    var ref2, space, space_user;
    if (!userId) {
      return {
        _id: -1
      };
    }
    space = selector.space;
    if (!space) {
      if ((selector != null ? (ref2 = selector.$and) != null ? ref2.length : void 0 : void 0) > 0) {
        space = selector.$and.getProperty('space')[0];
      }
    }
    if (!space) {
      return {
        _id: -1
      };
    }
    space_user = db.space_users.findOne({
      user: userId,
      space: space
    }, {
        fields: {
          _id: 1
        }
      });
    if (!space_user) {
      return {
        _id: -1
      };
    }
    return selector;
  }
});
