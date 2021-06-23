let addOrganization, addSpaceUser, addUser, initRootOrganization, manageOrganizations, manageSpaceUser, manageSpaces, manageUser, updateOrganization, updateSpaceUser, updateUser;
let objectql = require('@steedos/objectql');
const steedosConfig = objectql.getSteedosConfig();
const Qiyeweixin = require("./qywx");
Meteor.startup(function() {
  var ref;
  if (((ref = steedosConfig.qiyeweixin) != null ? ref.sync_interval : void 0) > 0) {
    return Meteor.setInterval(startSyncCompany(), steedosConfig.qiyeweixin.sync_interval);
  }
});

exports.startSyncCompany = function() {
  var spaces;
  spaces = db.spaces.find({
    $and: [
      {
        'is_deleted': false
      }, {
        'qywx_need_sync': true
      }
    ]
  }).fetch();
  if (spaces) {
    return spaces.forEach(function(space) {
      return syncCompany(space);
    });
  }
};

exports.syncCompany = function(space) {
  var allOrganizations, allUsers, at, o, orgIds, orgList, ref, service, space_id;
  service = space.services.qiyeweixin;
  space_id = space._id;
  o = ServiceConfiguration.configurations.findOne({
    service: "qiyeweixin"
  });
  at = Qiyeweixin.getCorpToken(service.corp_id, service.permanent_code, o.suite_access_token);
  if (at && at.access_token) {
    service.access_token = at.access_token;
  }
  console.log("at.access_token------:",at.access_token);
  allOrganizations = [];
  allUsers = [];
  orgList = Qiyeweixin.getDepartmentList(service.access_token);
  orgIds = orgList.map(function(m) {
    return m.id;
  });
  if (orgIds.indexOf(1) === -1) {
    initRootOrganization(space, orgIds);
    allOrganizations.push(space._id + '-1');
  }
  orgList.forEach(function(org) {
    var children, orgParent, orgUsers, userList;
    userList = Qiyeweixin.getUserList(service.access_token, org.id);
    orgUsers = [];
    userList.forEach(function(user) {
      var _id;
      _id = manageUser(user);
      user._id = _id;
      user.space = space_id;
      manageSpaceUser(user, orgIds);
      orgUsers.push(_id);
      return allUsers.push(_id);
    });
    org.users = orgUsers;
    org._id = space_id + '-' + org.id;
    org.fullname = org.name;
    org.space = space_id;
    org.parent = space_id + '-' + org.parentid;
    children = orgList.filter(function(m) {
      return m.parentid === org.id;
    }).map(function(m) {
      return space_id + '-' + m.id;
    });
    org.children = children;
    if (org.id === 1) {
      org.is_company = true;
    } else {
      orgParent = db.organizations.findOne({
        _id: org.parent
      }, {
        fullname: 1
      });
      if (orgParent && orgParent.fullname) {
        org.fullname = orgParent.fullname + "/" + org.name;
      }
    }
    manageOrganizations(org);
    return allOrganizations.push(org._id);
  });
  manageSpaces(space);
  db.space_users.direct.remove({
    $and: [
      {
        space: space_id
      }, {
        user: {
          $nin: allUsers
        }
      }
    ]
  });
  return db.organizations.direct.remove({
    $and: [
      {
        space: space_id
      }, {
        _id: {
          $nin: allOrganizations
        }
      }
    ]
  });
};

initRootOrganization = function(space, orgIds) {
  var rootOrg;
  rootOrg = {};
  rootOrg.id = 1;
  rootOrg._id = space._id + '-1';
  rootOrg.space = space._id;
  rootOrg.name = space.name;
  rootOrg.fullname = space.name;
  rootOrg.parent = '';
  rootOrg.children = orgIds.map(function(m) {
    return space._id + '-' + m;
  });
  rootOrg.users = [];
  rootOrg.is_company = true;
  rootOrg.order = 100000000;
  return manageOrganizations(rootOrg);
};

manageSpaces = function(space) {
  var admins, doc, service, space_admin_data;
  service = space.services.qiyeweixin;
  space_admin_data = Qiyeweixin.getAdminList(service.corp_id, service.agentid);
  admins = [];
  space_admin_data.forEach(function(admin) {
    var admin_user;
    if (admin.auth_type) {
      admin_user = db.space_users.findOne({
        "qywx_id": admin.userid
      }, {
        _id: 1
      });
      if (admin_user) {
        return admins.push(admin_user._id);
      }
    }
  });
  doc = {};
  doc.admins = admins;
  doc.owner = admins[0];
  doc.modified = new Date;
  service.sync_modified = new Date;
  // service.need_sync = false;
  doc.qywx_need_sync = false;
  delete service.access_token;
  doc.services = {
    qiyeweixin: service
  };
  return db.spaces.direct.update(space._id, {
    $set: doc
  });
};

manageOrganizations = function(organization) {
  var org;
  org = db.organizations.findOne({
    $and: [
      {
        _id: organization._id
      }, {
        space: organization.space
      }
    ]
  });
  if (org) {
    return updateOrganization(org, organization);
  } else {
    return addOrganization(organization);
  }
};

manageSpaceUser = function(user, orgIds) {
  var su;
  su = db.space_users.findOne({
    $and: [
      {
        user: user._id
      }, {
        space: user.space
      }
    ]
  });
  if (su) {
    return updateSpaceUser(su, user, orgIds);
  } else {
    return addSpaceUser(user, orgIds);
  }
};

manageUser = function(user) {
  var u, userid;
  u = db.space_users.findOne({
    "qywx_id": user.userid
  });
  userid = '';
  if (u) {
    userid = u.user;
    updateUser(u, user);
  } else {
    userid = addUser(user);
  }
  return userid;
};

addOrganization = function(organization) {
  var doc, parents;
  doc = {};
  doc._id = organization._id;
  doc.space = organization.space;
  doc.name = organization.name;
  doc.fullname = organization.fullname;
  if (organization.is_company) {
    doc.is_company = true;
  }
  doc.parent = organization.parent;
  parents = [];
  parents.push(organization.parent);
  doc.parents = parents;
  doc.children = organization.children;
  doc.users = organization.users;
  doc.sort_no = organization.order;
  doc.created = new Date;
  doc.modified = new Date;
  return db.organizations.direct.insert(doc);
};

addSpaceUser = function(user, orgIds) {
  var doc, organizations;
  doc = {};
  doc._id = user.space + '-' + user.userid;
  doc.user = user._id;
  doc.name = user.name;
  doc.space = user.space;
  organizations = user.department.filter(function(m) {
    return m === 1 || orgIds.indexOf(m) > -1;
  }).map(function(m) {
    return user.space + "-" + m;
  });
  if (organizations === null || organizations.length === 0) {
    organizations.push(user.space + "-1");
  }
  doc.organizations = organizations;
  doc.organization = doc.organizations[0];
  doc.user_accepted = true;
  doc.created = new Date;
  doc.modified = new Date;
  doc.position = user.position;
  doc.sort_no = user.order[0];
  return db.space_users.direct.insert(doc);
};

addUser = function(user) {
  var doc, userid;
  doc = {};
  doc._id = db.users._makeNewID();
  doc.steedos_id = doc._id;
  doc.name = user.name;
  doc.avatarURL = user.avatar;
  doc.locale = "zh-cn";
  doc.is_deleted = false;
  doc.created = new Date;
  doc.modified = new Date;
  doc.services = {
    qiyeweixin: {
      id: user.userid
    }
  };
  userid = db.users.direct.insert(doc);
  return userid;
};

updateOrganization = function(old_org, new_org) {
  var doc, parents;
  doc = {};
  if (old_org.name !== new_org.name) {
    doc.name = new_org.name;
  }
  if (old_org.fullname !== new_org.fullname) {
    doc.fullname = new_org.fullname;
  }
  if (old_org.sort_no !== new_org.order) {
    doc.sort_no = new_org.order;
  }
  if (old_org.parent !== new_org.parent) {
    doc.parent = new_org.parent;
  }
  parents = [];
  parents.push(new_org.parent);
  doc.parents = parents;
  if (old_org.users.sort().toString() !== new_org.users.sort().toString()) {
    doc.users = new_org.users;
  }
  if (old_org.children.sort().toString() !== new_org.children.sort().toString()) {
    doc.children = new_org.children;
  }
  if (doc.hasOwnProperty('name') || doc.hasOwnProperty('fullname') || doc.hasOwnProperty('sort_no') || doc.hasOwnProperty('parent') || doc.hasOwnProperty('users') || doc.hasOwnProperty('children')) {
    doc.modified = new Date;
    return db.organizations.direct.update(old_org._id, {
      $set: doc
    });
  }
};

updateSpaceUser = function(old_su, new_su, orgIds) {
  var doc, organizations;
  doc = {};
  if (old_su.name !== new_su.name) {
    doc.name = new_su.name;
  }
  if (old_su.position !== new_su.position || !old_su.position) {
    doc.position = new_su.position;
  }
  if (old_su.sort_no !== new_su.order[0]) {
    doc.sort_no = new_su.order[0];
  }
  organizations = new_su.department.filter(function(m) {
    return m === 1 || orgIds.indexOf(m) > -1;
  }).map(function(m) {
    return new_su.space + "-" + m;
  });
  if (old_su.organizations.sort().toString() !== organizations.sort().toString()) {
    doc.organizations = organizations;
    doc.organization = organizations[0];
  }
  if (doc.hasOwnProperty('name') || doc.hasOwnProperty('sort_no') || doc.hasOwnProperty('organization')) {
    doc.modified = new Date;
    return db.space_users.direct.update(old_su._id, {
      $set: doc
    });
  }
};

updateUser = function(old_user, new_user) {
  var doc;
  doc = {};
  if (old_user.name !== new_user.name) {
    doc.name = new_user.name;
  }
  if (old_user.avatarURL !== new_user.avatar) {
    doc.avatarURL = new_user.avatar;
  }
  if (doc.hasOwnProperty('name') || doc.hasOwnProperty('avatarURL')) {
    doc.modified = new Date;
    return db.users.direct.update(old_user._id, {
      $set: doc
    });
  }
};

// ---
// generated by coffee-script 1.9.2