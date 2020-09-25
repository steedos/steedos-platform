Fiber = require('fibers')
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');
const _ = require("lodash");
const steedosLicense = require("@steedos/license");
db.spaces = core.newCollection('spaces');

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

function onCreateSpace(spaceDoc){
    let spaceName = spaceDoc.name;
    let spaceId = spaceDoc._id;
    let userId = spaceDoc.owner;
    let now = new Date();

    let companyDB = Creator.getCollection("company");
    let companyId = companyDB._makeNewID();
    let companyDoc = {
        _id: companyId, 
        name: spaceName, 
        organization: companyId,
        company_id: companyId,
        space: spaceId, 
        owner: userId,
        created_by: userId,
        created: now,
        modified_by: userId,
        modified: now
      }
    companyDB.direct.insert(companyDoc);

    let orgDB = Creator.getCollection("organizations");
    let orgDoc = {
        _id: companyId,
        name: spaceName, 
        fullname: spaceName, 
        is_company: true, 
        users: [userId],
        company_id: companyId,
        space: spaceId, 
        owner: userId,
        created_by: userId,
        created: now,
        modified_by: userId,
        modified: now
    }
    orgDB.direct.insert(orgDoc);
    
    Creator.addSpaceUsers(spaceId, userId, true, orgDoc._id)
}

Creator.addSpaceUsers = function(spaceId, userId, user_accepted, organization_id){
    let now = new Date();
    let spaceUsersDB = db.space_users;


    let spaceUserObj = spaceUsersDB.direct.findOne({
        user: userId,
        space: spaceId
    });

    if(spaceUserObj){
        return ;
    }

    let profile = 'user';

    let space = db.spaces.findOne(spaceId, {fields: {default_profile: 1, default_organization: 1}})
    if(space){
        if(space.default_profile){
            profile = space.default_profile
        }
        if(!organization_id && space.default_organization){
            organization_id = space.default_organization
        }
    }

    if(!organization_id){
        let root_org = db.organizations.findOne({
            space: spaceId,
            parent: null
        });
        organization_id = root_org._id
    }

    //company_id,company_ids,organizations_parents由triggers维护
    let spaceUsersDoc = {
        user: userId, 
        user_accepted: user_accepted, 
        organization: organization_id, 
        organizations: [organization_id], 
        // organizations_parents: [organization_id],
        // company_id: company_id,
        // company_ids: [company_id],
        profile: profile,
        space: spaceId,
        owner: userId,
        created_by: userId,
        created: now,
        modified_by: userId,
        modified: now
      }
    spaceUsersDB.insert(spaceUsersDoc)

    if(Creator.isSpaceAdmin(spaceId, userId)){
        spaceUsersDB.direct.update({user: userId, space: spaceId}, {$set: {profile: 'admin'}})
    }
}

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
        doc.enable_register = true;
        doc.services = doc.services || {};
        if (!userId) {
            throw new Meteor.Error(400, "spaces_error_login_required");
        }

        if(doc._id){
            doc.space = doc._id
        }

        doc.owner = userId;
        return doc.admins = [userId];
    });
    // 必须启用 admin app
    // if doc.apps_enabled
    // 	if _.indexOf(doc.apps_enabled, "admin")<0
    // 		doc.apps_enabled.push("admin")
    db.spaces.after.insert(function (userId, doc) {
        onCreateSpace(doc);
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

        if(_.has(modifier.$set, 'admins') && _.isEmpty(modifier.$set.admins)){
            throw new Meteor.Error(400, "spaces_error_space_admins_required");
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
            children.forEach(function (child) {
                db.organizations.direct.update(child._id, {
                    $set: {
                        fullname: child.calculateFullname()
                    }
                });
            });
        }


        if(_.has(modifier.$set, 'admins')){
           setAdmins = modifier.$set.admins || []
           var removedAdmin  =  _.difference(this.previous.admins, setAdmins);
           if(!_.isEmpty(removedAdmin)){
                db.space_users.direct.update({space: doc._id, user: {$in: removedAdmin}}, {$set: {profile: 'user'}}, {
                    multi: true
                });
           }
           var addedAdmin =  _.difference(setAdmins, this.previous.admins);
           if(!_.isEmpty(addedAdmin)){
                db.space_users.direct.update({space: doc._id, user: {$in: addedAdmin}}, {$set: {profile: 'admin'}}, {
                    multi: true
                });
           }
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
    db.spaces.space_add_user = function (spaceId, userId, user_accepted, company_id) {
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
                owner: userId,
                company_id: company_id,
                company_ids: [company_id]
            });
            root_org.updateUsers();
        }
    };
    db.spaces.createTemplateOrganizations = function (space) {
        var _create_org, org, org_id, user, company_id, space_id;
        var space_id = space._id;
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

        // 初始化 organization 表时，自动初始化一条 company 记录，对应到 organizations 根节点
        company_id = Creator.getCollection("company").insert({
            name: space.name,
            organization: org_id,
            space: space_id,
            owner: space.owner
        });
        if (!company_id) {
            return false;
        }

        // 设置根组织的company_id值
        // 后面的子组织的company_id值依赖根组织事先设置好company_id值
        db.organizations.direct.update({
            _id: org_id
        }, {
            $set: {
                company_id: company_id
            }
        });

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
            // 这里没用direct.insert，会自动触发继承上级组织的 company_id逻辑，所以要求根组织的company_id先有值
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

        _.each(space.admins, function (admin) {
            return db.spaces.space_add_user(space._id, admin, true, company_id);
        });
        return true;
    };
}

if (Meteor.isServer) {
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

// steedos-workflow包中相关脚本迁移过来
if (Meteor.isServer) {
    Meteor.startup(function () {
        return db.spaces.createTemplateFormAndFlow = function (space_id) {
            var owner_id, root_org, space, template_forms, user;
            if (db.forms.find({
                space: space_id
            }).count() > 0) {
                return false;
            }
            space = db.spaces.findOne(space_id, {
                fields: {
                    owner: 1
                }
            });
            if (!space) {
                return false;
            }
            owner_id = space.owner;
            user = db.users.findOne(space.owner, {
                fields: {
                    locale: 1
                }
            });
            if (!user) {
                reurn(false);
            }
            root_org = db.organizations.findOne({
                space: space_id,
                parent: null
            });
            if (!root_org) {
                return false;
            }
            if (db.forms.find({
                space: space_id
            }).count() > 0) {
                return;
            }
            template_forms = [];
            if (user.locale === "zh-cn") {
                template_forms = EJSON.clone(workflowTemplate["zh-CN"]);
            } else {
                template_forms = EJSON.clone(workflowTemplate["en"]);
            }
            if (template_forms && template_forms instanceof Array) {
                return template_forms.forEach(function (form) {
                    return steedosImport.workflow(owner_id, space_id, form, true);
                });
            }
        };
    });
}

//仅考虑mongo-db数据源的对象数据
function initSpaceData(spaceId, userId){
    let spacesCollection = Creator.getCollection("spaces")
    let datas = objectql.getAllObjectData();
    let now = new Date();
    let insertMap = {};
    try {
        for(let objectName in datas){
            let records = datas[objectName];
            if(_.indexOf(["spaces"], objectName) < 0){
                for(let record of records){
                    if(Creator.getCollection(objectName)){
                        let docId = Creator.getCollection(objectName).direct.insert(Object.assign({}, record, {_id: record._id || spacesCollection._makeNewID(), space: spaceId, owner: userId, created: now, modified: now, created_by: userId, modified_by: userId}));
                        if(insertMap[objectName]){
                            insertMap[objectName].push(docId)
                        }else{
                            insertMap[objectName] = []
                            insertMap[objectName].push(docId)
                        }
                        // await objectql.getObject(objectName).directInsert(Object.assign({}, record, {_id: spacesCollection._makeNewID(), space: spaceId}));
                    }
                }
            }
        }
    } catch (error) {
        _.each(insertMap, function(_ids,objectName){
            Creator.getCollection(objectName).direct.remove({_id: {$in: _ids}})
        })
        throw new Error("初始化数据失败");
    }
}

Creator.Objects['spaces'].methods = {
    "tenant": function (req, res) {
        return Fiber(function () {
            const config = objectql.getSteedosConfig();
            let tenant = {
                name: "Steedos",
                logo_url: undefined,
                background_url: undefined,
                enable_create_tenant: true,
                enable_register: true,
                enable_forget_password: true
            }
    
            if (config.tenant) {
                _.assignIn(tenant, config.tenant)
            }

            if(!tenant.enable_create_tenant){
                return res.status(500).send({
                    "message": "禁止注册企业",
                    "success": false
                });
            }

            let error = '';
            try {
                let userSession = req.user;
                let spaceName = req.body.name;
                if(!spaceName){
                    throw new Error("名称不能为空")
                }
                
                if(userSession){
                    let userId = userSession.userId
                    let spaceId = db.spaces._makeNewID()
                    let spaceDoc = {
                        _id: spaceId,
                        space: spaceId,
                        name: spaceName, 
                        owner: userId
                    }
                    if(!tenant.saas){
                        initSpaceData(spaceId, userId);
                    }
                    let newSpaceId = db.spaces.insert(spaceDoc);
                    let newSpace = db.spaces.findOne(newSpaceId);
                    return res.send(newSpace);
                }else{
                    if(!userSession){
                        return res.status(401).send({
                            "success": false
                        });
                    }
                }
            } catch (err) {
                error = err.message
            }
            return res.status(500).send({
                "message": error,
                "success": false
            });
        }).run();
    },
    "clean_license": function(req, res){
        return Fiber(function () {
            let userSession = req.user;
            let { _id: spaceId } = req.params;
            let spaceUser = db.space_users.findOne({space: spaceId, user: userSession.userId}, {fields: {_id: 1}})
            //Creator.isSpaceAdmin(spaceId, userSession.userId)
            if(spaceUser){
                steedosLicense.cleanLicenseCache(spaceId);
            }
            return res.send({});
        }).run();
    }
    // "initSpaceData": function(req, res){
    //     return Fiber(function () {
            
    //         let userSession = req.user;
    //         let { _id: spaceId } = req.params
    
    //         if(!Creator.isSpaceAdmin(spaceId, userSession.userId)){
    //             return res.status(401).send({
    //                 "success": false
    //             });
    //         }
    //         initSpaceData(spaceId, userSession.userId);
    //         return res.send({
    //             "success": true
    //         });
    //     }).run();
    // }
}