db.spaces = new Meteor.Collection('spaces');

db.spaces.helpers({
    owner_name: function () {
        var owner;
        owner = db.space_users.findOne({
            user: this.owner
        });
        return owner && owner.name;
    },
    admins_name: function () {
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
        admins.forEach(function (admin) {
            return adminNames.push(admin.name);
        });
        return adminNames.toString();
    }
});

if (Meteor.isServer) {
    db.spaces.before.insert(function (userId, doc) {
        if (!userId && doc.owner) {
            userId = doc.owner;
        }
        doc.created_by = userId;
        doc.created = new Date();
        doc.modified_by = userId;
        doc.modified = new Date();
        doc.is_deleted = false;
        if (!userId) {
            throw new Meteor.Error(400, "spaces_error_login_required");
        }
        doc.owner = userId;
        return doc.admins = [userId];
    });
    // 必须启用 admin app
    // if doc.apps_enabled
    // 	if _.indexOf(doc.apps_enabled, "admin")<0
    // 		doc.apps_enabled.push("admin")
    db.spaces.after.insert(function (userId, doc) {
        db.spaces.createTemplateOrganizations(doc._id);
        return _.each(doc.admins, function (admin) {
            return db.spaces.space_add_user(doc._id, admin, true);
        });
    });
    db.spaces.before.update(function (userId, doc, fieldNames, modifier, options) {
        modifier.$set = modifier.$set || {};
        if (doc.owner !== userId) {
            throw new Meteor.Error(400, "spaces_error_space_owner_only");
        }
        modifier.$set.modified_by = userId;
        modifier.$set.modified = new Date();
        if (modifier.$set.owner) {
            if (!modifier.$set.admins) {
                modifier.$set.admins = doc.admins;
                if (modifier.$unset) {
                    return delete modifier.$set.admins;
                }
            } else if (modifier.$set.admins.indexOf(modifier.$set.owner) < 0) {
                return modifier.$set.admins.push(modifier.$set.owner);
            }
        }
    });
    // 管理员不能为空
    // if (!modifier.$set.admins)
    // 	throw new Meteor.Error(400, "spaces_error_space_admins_required");

    // 必须启用 admin app
    // if modifier.$set.apps_enabled
    // 	if _.indexOf(modifier.$set.apps_enabled, "admin")<0
    // 		modifier.$set.apps_enabled.push("admin")
    db.spaces.after.update(function (userId, doc, fieldNames, modifier, options) {
        var children, rootOrg, self;
        self = this;
        modifier.$set = modifier.$set || {};
        // 工作区修改后，该工作区的根部门的name也要修改，根部门和子部门的fullname也要修改
        if (modifier.$set.name) {
            // 直接修改根部门名字，跳过验证
            db.organizations.direct.update({
                space: doc._id,
                parent: null
            }, {
                    $set: {
                        name: doc.name,
                        fullname: doc.name
                    }
                });
            rootOrg = db.organizations.findOne({
                space: doc._id,
                parent: null
            });
            children = db.organizations.find({
                parents: rootOrg._id
            });
            return children.forEach(function (child) {
                return db.organizations.direct.update(child._id, {
                    $set: {
                        fullname: child.calculateFullname()
                    }
                });
            });
        }
    });
    db.spaces.before.remove(function (userId, doc) {
        throw new Meteor.Error(400, "spaces_error_space_readonly");
    });
    Meteor.methods({
        setSpaceId: function (spaceId) {
            this.connection["spaceId"] = spaceId;
            return this.connection["spaceId"];
        },
        getSpaceId: function () {
            return this.connection["spaceId"];
        }
    });
    db.spaces.space_add_user = function (spaceId, userId, user_accepted) {
        var now, ref, ref1, ref2, ref3, root_org, spaceUserObj, userObj;
        spaceUserObj = db.space_users.direct.findOne({
            user: userId,
            space: spaceId
        });
        userObj = db.users.direct.findOne(userId);
        if (!userObj) {
            return;
        }
        now = new Date;
        if (spaceUserObj) {
            return db.space_users.direct.update(spaceUserObj._id, {
                $set: {
                    name: userObj.name,
                    email: (ref = userObj.emails) != null ? (ref1 = ref[0]) != null ? ref1.address : void 0 : void 0,
                    space: spaceId,
                    user: userObj._id,
                    user_accepted: user_accepted,
                    invite_state: "accepted",
                    modified: now,
                    modified_by: userId
                }
            });
        } else {
            root_org = db.organizations.findOne({
                space: spaceId,
                parent: null
            });
            db.space_users.direct.insert({
                name: userObj.name,
                email: (ref2 = userObj.emails) != null ? (ref3 = ref2[0]) != null ? ref3.address : void 0 : void 0,
                space: spaceId,
                organization: root_org._id,
                organizations: [root_org._id],
                organizations_parents: [root_org._id],
                user: userObj._id,
                user_accepted: user_accepted,
                invite_state: "accepted",
                created: now,
                created_by: userId,
                owner: userId
            });
            return root_org.updateUsers();
        }
    };
    db.spaces.createTemplateOrganizations = function (space_id) {
        var _create_org, org, org_id, space, user;
        space = db.spaces.findOne(space_id);
        if (!space) {
            return false;
        }
        user = db.users.findOne(space.owner);
        if (!user) {
            return false;
        }
        if (db.organizations.find({
            space: space_id
        }).count() > 0) {
            return;
        }
        org = {};
        org.space = space_id;
        org.name = space.name;
        org.fullname = space.name;
        org.owner = space.owner;
        org_id = db.organizations.insert(org);
        if (!org_id) {
            return false;
        }
        // 初始化 space owner 的 orgnization
        // db.space_users.direct.update({space: space_id, user: space.owner}, {$set: {organization: org_id}})
        _create_org = function (orgName, sortNo) {
            var _org;
            _org = {};
            _org.space = space_id;
            _org.name = orgName;
            _org.fullname = org.name + '/' + _org.name;
            _org.parents = [org_id];
            _org.parent = org_id;
            _org.owner = space.owner;
            if (sortNo) {
                _org.sort_no = sortNo;
            }
            return db.organizations.insert(_org);
        };
        // 新建5个部门
        if (user.locale === "zh-cn") {
            _create_org("销售部");
            _create_org("财务部");
            _create_org("行政部");
            _create_org("人事部");
            _create_org("公司领导", 101);
        } else {
            _create_org("Sales Department");
            _create_org("Finance Department");
            _create_org("Administrative Department");
            _create_org("Human Resources Department");
            _create_org("Company Leader", 101);
        }
        return true;
    };
}

if (Meteor.isServer) {
    db.spaces._ensureIndex({
        "is_deleted": 1
    }, {
            background: true
        });
    db.spaces._ensureIndex({
        "is_paid": 1
    }, {
            background: true
        });
    db.spaces._ensureIndex({
        "name": 1,
        "is_paid": 1
    }, {
            background: true
        });
    db.spaces._ensureIndex({
        "_id": 1,
        "created": 1
    }, {
            background: true
        });
    db.spaces._ensureIndex({
        "_id": 1,
        "created": 1,
        "modified": 1
    }, {
            background: true
        });
}
