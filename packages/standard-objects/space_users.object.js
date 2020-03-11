const spaceUserCore = require('./space_users.core')
db.space_users = new Meteor.Collection('space_users');

db.space_users._simpleSchema = new SimpleSchema;

Meteor.startup(function () {
    if (Meteor.isServer) {
        db.space_users.insertVaildate = function (userId, doc) {
            var currentUserPhonePrefix, isAllOrgAdmin, phoneNumber, selector, space, spaceUserExisted, user, userExist;
            if (!doc.space) {
                throw new Meteor.Error(400, "space_users_error_space_required");
            }
            space = db.spaces.findOne(doc.space);
            if (!space) {
                throw new Meteor.Error(400, "space_users_error_space_not_found");
            }

            if(doc.user){
                user = db.users.findOne({ _id: doc.user }, {fields: { _id: 1}})
                if(!user){
                    throw new Meteor.Error(400, "未找到用户");
                }
                spaceUserExisted = db.space_users.find({space: doc.space,user: doc.user}, {fields: { _id: 1}});

            }else{
                if (!doc.email && !doc.mobile) {
                    throw new Meteor.Error(400, "contact_need_phone_or_email");
                }
                if (doc.email) {
                    if (!/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(doc.email)) {
                        throw new Meteor.Error(400, "email_format_error");
                    }
                }
                // 检验手机号和邮箱是不是指向同一个用户(只有手机和邮箱都填写的时候才需要校验)
                selector = [];
                if (doc.email) {
                    selector.push({
                        "email": doc.email
                    });
                }
                if (doc.mobile) {
                    selector.push({
                        "mobile": doc.mobile
                    });
                }
                if (doc.username) {
                    selector.push({
                        "username": doc.username
                    });
                }
                userExist = db.users.find({
                    $or: selector
                });
    
                if(userExist.count() > 0){
                    throw new Meteor.Error(400, "用户已存在, 请使用邀请功能");
                }
                spaceUserExisted = db.space_users.find({
                    space: doc.space,
                    $or: selector
                }, {
                    fields: {
                        _id: 1
                    }
                });
            }

            if (spaceUserExisted.count() > 0) {
                throw new Meteor.Error(400, "该用户已在此工作区");
            }
        };
        db.space_users.updatevaildate = function (userId, doc, modifier) {
            var addOrgs, currentUserPhonePrefix, isAllAddOrgsAdmin, isAllSubOrgsAdmin, isOrgAdmin, newOrgs, oldOrgs, phoneNumber, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, repeatEmailUser, repeatNumberUser, space, subOrgs;
            if (doc.invite_state === "refused" || doc.invite_state === "pending") {
                throw new Meteor.Error(400, "该用户还未接受加入工作区，不能修改他的个人信息");
            }
            space = db.spaces.findOne(doc.space);
            if (!space) {
                throw new Meteor.Error(400, "organizations_error_org_admins_only");
            }
            if ((ref = modifier.$set) != null ? ref.email : void 0) {
                if (!/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(modifier.$set.email)) {
                    throw new Meteor.Error(400, "email_format_error");
                }
            }
            if (((ref2 = modifier.$set) != null ? ref2.user_accepted : void 0) !== void 0 && !modifier.$set.user_accepted) {
                if (space.admins.indexOf(doc.user) > 0 || doc.user === space.owner) {
                    throw new Meteor.Error(400, "organizations_error_can_not_set_checkbox_true");
                }
            }
            if ((ref3 = modifier.$set) != null ? ref3.space : void 0) {
                if (modifier.$set.space !== doc.space) {
                    throw new Meteor.Error(400, "space_users_error_space_readonly");
                }
            }
            if ((ref4 = modifier.$set) != null ? ref4.user : void 0) {
                if (modifier.$set.user !== doc.user) {
                    throw new Meteor.Error(400, "space_users_error_user_readonly");
                }
            }
            if (((ref5 = modifier.$unset) != null ? ref5.email : void 0) !== void 0) {
                throw new Meteor.Error(400, "必须填写邮件");
            }
            if (((ref6 = modifier.$set) != null ? ref6.email : void 0) && modifier.$set.email !== doc.email) {
                repeatEmailUser = db.users.findOne({
                    "email": modifier.$set.email
                });
                if (repeatEmailUser && repeatEmailUser._id !== doc.user) {
                    throw new Meteor.Error(400, "该邮箱已被占用");
                }
            }
            if (((ref8 = modifier.$set) != null ? ref8.mobile : void 0) && modifier.$set.mobile !== doc.mobile) {
                mobileUser = db.users.findOne({
                    "mobile": modifier.$set.mobile
                });
                if (mobileUser && mobileUser._id !== doc.user) {
                    throw new Meteor.Error(400, "space_users_error_phone_already_existed");
                }
            }

            if(modifier.$set && modifier.$set.username){
                db.users.validateUsername(modifier.$set.username, doc.user)
            }
        };
        db.space_users.before.insert(function (userId, doc) {
            var creator, currentUserPhonePrefix, email, id, options, organization, phone, phoneNumber, user, userObj, userObjs;
            
            db.space_users.insertVaildate(userId, doc);

            if(doc.user){
                let userDoc = db.users.findOne({_id: doc.user});
                let syncProp = spaceUserCore.pickNeedSyncProp(userDoc);
                Object.assign(doc, syncProp);
            }else{
                doc.created_by = userId;
                doc.created = new Date();
                doc.modified_by = userId;
                doc.modified = new Date();
                creator = db.users.findOne(userId);
                if ((!doc.user) && (doc.email || doc.mobile)) {
                    if ((doc.is_registered_from_space || doc.is_logined_from_space) || !userObj) {
                        if (!doc.invite_state) {
                            doc.invite_state = "accepted";
                        }
                        if (!doc.user_accepted) {
                            doc.user_accepted = true;
                        }
                    } else {
                        if(Meteor.settings.tenant && Meteor.settings.tenant.saas){
                            // 云版要求用户接受邀请才让用户在新加入的工作区生效
                            doc.invite_state = "pending";
                            // 云版强制设置user_accepted为false
                            doc.user_accepted = false;
                        }
                        else{
                            // 落地版本不需要用户接受邀请才让用户在新加入的工作区生效，而是直接生效
                            // 落地版本设置user_accepted为传入的值，由管理员在新建用户的界面设置
                            if (!doc.user_accepted) {
                                doc.user_accepted = false;
                            }
                        }
                    }
                    if (userObj) {
                        doc.user = userObj._id;
                        doc.name = userObj.name;
                    } else {
                        if (!doc.name) {
                            doc.name = doc.email.split('@')[0];
                        }
                        // 将用户插入到users表
                        user = {};
                        id = db.users._makeNewID();
                        options = {
                            name: doc.name,
                            locale: creator.locale,
                            spaces_invited: [doc.space],
                            _id: id,
                            steedos_id: doc.email || id
                        };
                        if (doc.mobile) {
                            doc.mobile_verified = false;
                            options.mobile = doc.mobile;
                            options.mobile_verified  = doc.mobile_verified;
                        }
                        if (doc.email) {
                            doc.email_verified = false
                            email = [
                                {
                                    address: doc.email,
                                    verified: doc.email_verified
                                }
                            ];
                            options.emails = email;
                            options.email = doc.email;
                            options.email_verified = doc.email_verified;
                        }
                        if (doc.username) {
                            options.username = doc.username;
                        }
                        doc.user = db.users.insert(options);
                    }
                }
                if (!doc.user) {
                    throw new Meteor.Error(400, "space_users_error_user_required");
                }
                if (!doc.name) {
                    throw new Meteor.Error(400, "space_users_error_name_required");
                }
            }
            if (doc.organizations && doc.organizations.length > 0) {
                // 如果主组织未设置或设置的值不在doc.organizations内，则自动设置为第一个组织
                if (!doc.organizations.includes(doc.organization)) {
                    doc.organization = doc.organizations[0];
                }
            }
            if (doc.organization) {
                organization = db.organizations.findOne(doc.organization, {
                    fields: {
                        company_id: 1
                    }
                });
                if (organization && organization.company_id) {
                    return doc.company_id = organization.company_id;
                }
            }
        });
        db.space_users.after.insert(function (userId, doc) {
            var unset, user;
            if (doc.organizations) {
                doc.organizations.forEach(function (org) {
                    var organizationObj;
                    organizationObj = db.organizations.findOne(org);
                    return organizationObj.updateUsers();
                });
            }
            // if (!doc.is_registered_from_space) {
            //     user = db.users.findOne(doc.user, {
            //         fields: {
            //             name: 1,
            //             phone: 1,
            //             mobile: 1,
            //             emails: 1,
            //             email: 1
            //         }
            //     });
            //     unset = {};
            //     // 同步mobile和email到space_user，没有值的话，就清空space_user的mobile和email字段
            //     if (!user.phone) {
            //         unset.mobile = "";
            //     }
            //     if (!user.mobile && user.phone) {
            //         user.mobile = user.phone.mobile;
            //     }
            //     if (!user.emails) {
            //         unset.email = "";
            //     }
            //     if (!user.email && user.emails) {
            //         user.email = user.emails[0].address;
            //     }
            //     delete user._id;
            //     delete user.emails;
            //     delete user.phone;
            //     if (_.isEmpty(unset)) {
            //         db.space_users.direct.update({
            //             _id: doc._id
            //         }, {
            //                 $set: user
            //             });
            //     } else {
            //         db.space_users.direct.update({
            //             _id: doc._id
            //         }, {
            //                 $set: user,
            //                 $unset: unset
            //             });
            //     }
            // }
            db.users_changelogs.direct.insert({
                operator: userId,
                space: doc.space,
                operation: "add",
                user: doc.user,
                user_count: db.space_users.find({
                    space: doc.space,
                    user_accepted: true
                }, {
                        fields: {
                            _id: 1
                        }
                    }).count()
            });
            if (doc.organizations) {
                db.space_users.update_organizations_parents(doc._id, doc.organizations);
                return db.space_users.update_company_ids(doc._id, doc);
            }
        });
        db.space_users.before.update(function (userId, doc, fieldNames, modifier, options) {
            var currentUserPhonePrefix, email_val, emails, emails_val, euser, isEmailCleared, isMobileCleared, lang, newEmail, newMobile, number, organization, paramString, params, ref, ref1, ref2, steedos_id, user_set, user_unset;
            modifier.$set = modifier.$set || {};
            db.space_users.updatevaildate(userId, doc, modifier);
            if (modifier.$set.organizations && modifier.$set.organizations.length > 0) {
                // 修改所有组织后，强制把主组织自动设置为第一个组织
                modifier.$set.organization = modifier.$set.organizations[0];
            }
            if (modifier.$set.organization) {
                organization = db.organizations.findOne(modifier.$set.organization, {
                    fields: {
                        company_id: 1,
                        parent: 1
                    }
                });
                if (organization) {
                    if (organization.company_id) {
                        modifier.$set.company_id = organization.company_id;
                    } else {
                        // 如果所属主部门的company_id不存在，则清除当前用户company_id值，而不是查找并设置为根组织Id
                        modifier.$unset = modifier.$unset || {};
                        modifier.$unset.company_id = 1;
                    }
                }
            }
            newMobile = modifier.$set.mobile;
            // 当把手机号设置为空值时，newMobile为undefined，modifier.$unset.mobile为空字符串
            isMobileCleared = ((ref = modifier.$unset) != null ? ref.mobile : void 0) !== void 0;
            if (newMobile !== doc.mobile) {

                if(newMobile){
                    modifier.$set.mobile_verified = false
                }

                if (newMobile || isMobileCleared) {
                    // 修改人
                    lang = Steedos.locale(doc.user, true);
                    euser = db.users.findOne({
                        _id: userId
                    }, {
                            fields: {
                                name: 1
                            }
                        });
                    params = {
                        name: euser.name,
                        number: newMobile ? newMobile : TAPi18n.__('space_users_empty_phone', {}, lang)
                    };
                    paramString = JSON.stringify(params);
                    if (doc.mobile) {
                        // 发送手机短信给修改前的手机号
                        SMSQueue.send({
                            Format: 'JSON',
                            Action: 'SingleSendSms',
                            ParamString: paramString,
                            RecNum: doc.mobile,
                            SignName: 'OA系统',
                            TemplateCode: 'SMS_67660108',
                            msg: TAPi18n.__('sms.chnage_mobile.template', params, lang)
                        });
                    }
                    if (newMobile) {
                        // 发送手机短信给修改后的手机号
                        SMSQueue.send({
                            Format: 'JSON',
                            Action: 'SingleSendSms',
                            ParamString: paramString,
                            RecNum: newMobile,
                            SignName: 'OA系统',
                            TemplateCode: 'SMS_67660108',
                            msg: TAPi18n.__('sms.chnage_mobile.template', params, lang)
                        });
                    }
                }
            }
            newEmail = modifier.$set.email;
            if (newEmail && newEmail !== doc.email) {
                modifier.$set.email_verified = false;
            }
        });
        db.space_users.after.update(function (userId, doc, fieldNames, modifier, options) {
            var ref;
            modifier.$set = modifier.$set || {};
            modifier.$unset = modifier.$unset || {};
            spaceUserCore.syncUserInfo(this.previous, modifier);

            if (modifier.$set.organizations) {
                modifier.$set.organizations.forEach(function (org) {
                    var organizationObj;
                    organizationObj = db.organizations.findOne(org);
                    return organizationObj.updateUsers();
                });
            }
            if (this.previous.organizations) {
                this.previous.organizations.forEach(function (org) {
                    var organizationObj;
                    organizationObj = db.organizations.findOne(org);
                    return organizationObj.updateUsers();
                });
            }
            if (modifier.$set.hasOwnProperty("user_accepted")) {
                if (this.previous.user_accepted !== modifier.$set.user_accepted) {
                    db.users_changelogs.direct.insert({
                        operator: userId,
                        space: doc.space,
                        operation: (ref = modifier.$set.user_accepted) != null ? ref : {
                            "enable": "disable"
                        },
                        user: doc.user,
                        user_count: db.space_users.find({
                            space: doc.space,
                            user_accepted: true
                        }, {
                                fields: {
                                    _id: 1
                                }
                            }).count()
                    });
                }
            }
            if (modifier.$set.organizations) {
                db.space_users.update_organizations_parents(doc._id, modifier.$set.organizations);
                db.space_users.update_company_ids(doc._id, doc);
            }
        });
        db.space_users.before.remove(function (userId, doc) {
            var isOrgAdmin, space;
            // check space exists
            space = db.spaces.findOne(doc.space);
            if (!space) {
                throw new Meteor.Error(400, "space_users_error_space_not_found");
            }
            // if (space.admins.indexOf(userId) < 0) {
            //     // 要删除用户，需要至少有一个组织权限
            //     isOrgAdmin = Steedos.isOrgAdminByOrgIds(doc.organizations, userId);
            //     if (!isOrgAdmin) {
            //         throw new Meteor.Error(400, "organizations_error_org_admins_only");
            //     }
            // }
            // 不能删除当前工作区的拥有者
            if (space.owner === doc.user) {
                throw new Meteor.Error(400, "space_users_error_remove_space_owner");
            }
            if (space.admins.indexOf(doc.user) > 0) {
                throw new Meteor.Error(400, "space_users_error_remove_space_admins");
            }
        });
        db.space_users.after.remove(function (userId, doc) {
            var content, e, locale, space, subject, user;
            if (doc.organizations) {
                doc.organizations.forEach(function (org) {
                    var organizationObj;
                    organizationObj = db.organizations.findOne(org);
                    return organizationObj.updateUsers();
                });
            }
            db.users_changelogs.direct.insert({
                operator: userId,
                space: doc.space,
                operation: "delete",
                user: doc.user,
                user_count: db.space_users.find({
                    space: doc.space,
                    user_accepted: true
                }, {
                        fields: {
                            _id: 1
                        }
                    }).count()
            });
            try {
                user = db.users.findOne(doc.user, {
                    fields: {
                        email: 1,
                        name: 1,
                        steedos_id: 1
                    }
                });
                if (user.email) {
                    locale = Steedos.locale(doc.user, true);
                    space = db.spaces.findOne(doc.space, {
                        fields: {
                            name: 1
                        }
                    });
                    subject = TAPi18n.__('space_users_remove_mail_subject', {}, locale);
                    content = TAPi18n.__('space_users_remove_mail_content', {
                        steedos_id: user.steedos_id,
                        space_name: space != null ? space.name : void 0
                    }, locale);
                    return MailQueue.send({
                        to: user.email,
                        from: user.name + ' on ' + Meteor.settings.email.from,
                        subject: subject,
                        html: content
                    });
                }
            } catch (error) {
                e = error;
                return console.error(e.stack);
            }
        });
        db.space_users.update_organizations_parents = function (_id, organizations) {
            var organizations_parents, orgs;
            orgs = db.organizations.find({
                _id: {
                    $in: organizations
                }
            }, {
                    fields: {
                        parents: 1
                    }
                }).fetch();
            organizations_parents = _.compact(_.uniq(_.flatten([organizations, _.pluck(orgs, 'parents')])));
            return db.space_users.direct.update({
                _id: _id
            }, {
                    $set: {
                        organizations_parents: organizations_parents
                    }
                });
        };
        db.space_users.update_company_ids = function (_id, su) {
            var company_ids, orgs;
            if (!su) {
                su = db.space_users.findOne({
                    _id: _id
                }, {
                        fields: {
                            organizations: 1,
                            company_id: 1,
                            space: 1
                        }
                    });
            }
            if (!su) {
                console.error("db.space_users.update_company_ids,can't find space_users by _id of:", _id);
                return;
            }
            orgs = db.organizations.find({
                _id: {
                    $in: su.organizations
                }
            }, {
                    fields: {
                        company_id: 1
                    }
                }).fetch();
            company_ids = _.pluck(orgs, 'company_id');
            // company_ids中的空值就空着，不需要转换成根组织ID值
            company_ids = _.uniq(_.compact(company_ids));
            return db.space_users.direct.update({
                _id: _id
            }, {
                    $set: {
                        company_ids: company_ids
                    }
                });
        };
        Meteor.publish('space_users', function (spaceId) {
            var selector, user;
            if (!this.userId) {
                return this.ready();
            }
            user = db.users.findOne(this.userId);
            selector = {};
            if (spaceId) {
                selector.space = spaceId;
            } else {
                selector.space = {
                    $in: user.spaces()
                };
            }
            return db.space_users.find(selector);
        });
        Meteor.publish('my_space_users', function () {
            if (!this.userId) {
                return this.ready();
            }
            return db.space_users.find({
                user: this.userId
            });
        });
        Meteor.publish('my_space_user', function (spaceId) {
            if (!this.userId) {
                return this.ready();
            }
            return db.space_users.find({
                space: spaceId,
                user: this.userId
            });
        });
    }
    //创建数据库索引
    if (Meteor.isServer) {
        db.space_users._ensureIndex({
            "user": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "user_accepted": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "is_deleted": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "user": 1,
            "user_accepted": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "user": 1,
            "space": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1,
            "user_accepted": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1,
            "user": 1,
            "user_accepted": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1,
            "manager": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "manager": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1,
            "created": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "space": 1,
            "created": 1,
            "modified": 1
        }, {
                background: true
            });
        db.space_users._ensureIndex({
            "organizations": 1
        }, {
                background: true
            });
        return db.space_users._ensureIndex({
            "mobile": 1
        }, {
                background: true
            });
    }
});

// steedos-workflow包中相关脚本迁移过来
Meteor.startup(function () {
    if (Meteor.isServer && db.space_users) {
        db.space_users.vaildateUserUsedByOther = function (doc) {
            var flowNames, roleNames;
            roleNames = [];
            _.each(db.flow_positions.find({
                space: doc.space,
                users: doc.user
            }, {
                    fields: {
                        users: 1,
                        role: 1
                    }
                }).fetch(), function (p) {
                    var role;
                    if (p.users.includes(doc.user)) {
                        role = db.flow_roles.findOne({
                            _id: p.role
                        }, {
                                fields: {
                                    name: 1
                                }
                            });
                        if (role) {
                            return roleNames.push(role.name);
                        }
                    }
                });
            if (!_.isEmpty(roleNames)) {
                throw new Meteor.Error(400, "space_users_error_roles_used", {
                    names: roleNames.join(',')
                });
            }
            flowNames = [];
            _.each(db.flows.find({
                space: doc.space
            }, {
                    fields: {
                        name: 1,
                        'current.steps': 1
                    }
                }).fetch(), function (f) {
                    return _.each(f.current.steps, function (s) {
                        if (s.deal_type === 'specifyUser' && s.approver_users.includes(doc.user)) {
                            return flowNames.push(f.name);
                        }
                    });
                });
            if (!_.isEmpty(flowNames)) {
                throw new Meteor.Error(400, "space_users_error_flows_used", {
                    names: _.uniq(flowNames).join(',')
                });
            }
        };
        db.space_users.before.update(function (userId, doc, fieldNames, modifier, options) {
            modifier.$set = modifier.$set || {};
            if (modifier.$set.user_accepted !== void 0 && !modifier.$set.user_accepted) {
                // 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
                return db.space_users.vaildateUserUsedByOther(doc);
            }
        });
        return db.space_users.before.remove(function (userId, doc) {
            // 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
            return db.space_users.vaildateUserUsedByOther(doc);
        });
    }
});

Creator.Objects['space_users'].actions = {
    import: {
        label: "导入",
        on: "list",
        visible: function (object_name, record_id, record_permissions) {
            if(Steedos.isMobile()){
                return false;
            }
            // if (!Steedos.isPaidSpace()) {
            //     return false;
            // }
            return Creator.isSpaceAdmin();
        },
        todo: function () {
            return Modal.show('import_users_modal');
        }
    },
    // 与列表视图导出功能重复
    // export: {
    //     label: "导出",
    //     on: "list",
    //     visible: function (object_name, record_id, record_permissions) {
    //         if(Steedos.isMobile()){
    //             return false;
    //         }
    //         if (!Steedos.isPaidSpace()) {
    //             return false;
    //         }
    //         return Creator.isSpaceAdmin();
    //     },
    //     todo: function () {
    //         var orgId, spaceId, uobj, url;
    //         spaceId = Session.get('spaceId');
    //         var organization = Session.get('organization');
    //         orgId = organization && organization._id;

    //         if (spaceId && orgId) {
    //             uobj = {};
    //             uobj['X-User-Id'] = Meteor.userId();
    //             uobj['X-Auth-Token'] = Accounts._storedLoginToken();
    //             uobj.space_id = spaceId;
    //             uobj.org_id = orgId;
    //             url = Steedos.absoluteUrl() + 'api/export/space_users?' + $.param(uobj);
    //             return window.open(url, '_parent', 'EnableViewPortScale=yes');
    //         } else {
    //             return swal({
    //                 title: '左侧未选中任何组织',
    //                 text: '请在左侧组织机构树中选中一个组织后再执行导出操作',
    //                 html: true,
    //                 type: 'warning',
    //                 confirmButtonText: TAPi18n.__('OK')
    //             });
    //         }
    //     }
    // },
    setPassword: {
        label: "更改密码",
        on: "record",
        visible: function (object_name, record_id, record_permissions) {
            if(Session.get("app_id") === 'admin'){
                var space_userId = db.space_users.findOne({user: Steedos.userId(), space: Steedos.spaceId()})._id
                if(space_userId === record_id){
                    return true
                }
            }
            return Creator.isSpaceAdmin();
        },
        todo: function (object_name, record_id, fields) {

            if(!Creator.isSpaceAdmin()){
                Modal.show("reset_password_modal");
                return;
            }

            var doUpdate = function (inputValue) {
                $("body").addClass("loading");
                var userSession = Creator.USER_CONTEXT;
                try {
                    Meteor.call("setSpaceUserPassword", record_id, userSession.spaceId, inputValue, function (error, result) {
                        $("body").removeClass("loading");
                        if (error) {
                            return toastr.error(error.reason);
                        } else {
                            swal.close();
                            return toastr.success("更改密码成功");
                        }
                    });
                } catch (err) {
                    console.error(err);
                    toastr.error(err);
                    $("body").removeClass("loading");
                }
            }

            swal({
                title: "更改密码",
                type: "input",
                inputType: "password",
                inputValue: "",
                showCancelButton: true,
                closeOnConfirm: false,
                confirmButtonText: t('OK'),
                cancelButtonText: t('Cancel'),
                showLoaderOnConfirm: false
            }, function (inputValue) {
                var result;
                if (inputValue === false) {
                    return false;
                }
                result = Steedos.validatePassword(inputValue);
                if (result.error) {
                    return toastr.error(result.error.reason);
                }
                doUpdate(inputValue);
            });
        }
    },
    standard_new: {
        visible: function (object_name, record_id, record_permissions) {
            var organization = Session.get("organization");
            var allowCreate = Creator.baseObject.actions.standard_new.visible.apply(this, arguments);
            if(!allowCreate){
                // permissions配置没有权限则不给权限
                return false
            }
            // 组织管理员要单独判断，只给到有对应单位的组织管理员权限
            if(Steedos.isSpaceAdmin()){
                return true;
            }
            else{
                var userId = Steedos.userId();
                //当前选中组织所属单位的管理员才有权限
                if(organization && organization.company_id && organization.company_id.admins){
                    return organization.company_id.admins.indexOf(userId) > -1;
                }
            }
        }
    },
    standard_edit: {
        visible: function (object_name, record_id, record_permissions) {
            var organization = Session.get("organization");
            var allowEdit = Creator.baseObject.actions.standard_edit.visible.apply(this, arguments);
            if(!allowEdit){
                // permissions配置没有权限则不给权限
                return false
            }
            if(Session.get("app_id") === 'admin'){
                var space_userId = db.space_users.findOne({user: Steedos.userId(), space: Steedos.spaceId()})._id
                if(space_userId === record_id){
                    return true
                }
            }

            // 组织管理员要单独判断，只给到有对应单位的组织管理员权限
            if(Steedos.isSpaceAdmin()){
                return true;
            }
            else{
                var userId = Steedos.userId();
                if(organization){
                    //当前选中组织所属单位的管理员才有权限
                    if(organization.company_id && organization.company_id.admins){
                        return organization.company_id.admins.indexOf(userId) > -1;
                    }
                }
                else{
                    // 用户详细界面拿不到当前选中组织时，只能从记录本身所属单位的管理员中判断，只要当前用户是任何一个所属单位的管理员则有权限
                    var record = Creator.getObjectRecord(object_name, record_id);
                    if(record && record.company_ids && record.company_ids.length){
                        return _.any(record.company_ids,function(item){
                            return item.admins && item.admins.indexOf(userId) > -1
                        });
                    }
                }
            }
        }
    },
    standard_delete: {
        visible: function (object_name, record_id, record_permissions) {
            return false
            // var organization = Session.get("organization");
            // var allowDelete = Creator.baseObject.actions.standard_delete.visible.apply(this, arguments);
            // if(!allowDelete){
            //     // permissions配置没有权限则不给权限
            //     return false
            // }
            // // 组织管理员要单独判断，只给到有对应单位的组织管理员权限
            // if(Steedos.isSpaceAdmin()){
            //     return true;
            // }
            // else{
            //     var userId = Steedos.userId();
            //     if(organization){
            //         //当前选中组织所属单位的管理员才有权限
            //         if(organization.company_id && organization.company_id.admins){
            //             return organization.company_id.admins.indexOf(userId) > -1;
            //         }
            //     }
            //     else{
            //         // 用户详细界面拿不到当前选中组织时，只能从记录本身所属单位的管理员中判断，只要当前用户是任何一个所属单位的管理员则有权限
            //         var record = Creator.getObjectRecord(object_name, record_id);
            //         if(record && record.company_ids && record.company_ids.length){
            //             return _.any(record.company_ids,function(item){
            //                 return item.admins && item.admins.indexOf(userId) > -1
            //             });
            //         }
            //     }
            // }
        }
    },
    invite_space_users: {
        label: "邀请注册",
        on: "list",
        visible: function(){
            return Creator.isSpaceAdmin();
        },
        todo: function(){
            // var address = window.location.origin + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(window.location.origin + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) + "&X-Space-Id=" + Steedos.getSpaceId();
            let address = window.location.origin + "/accounts/a/#/signup?&X-Space-Id=" + Steedos.getSpaceId();
            if(_.isFunction(Steedos.isCordova) && Steedos.isCordova()){
                address = Meteor.absoluteUrl("accounts/a/#/signup?&X-Space-Id=" + Steedos.getSpaceId())
            }
            
            var clipboard = new Clipboard('.list-action-custom-invite_space_users');

            $(".list-action-custom-invite_space_users").attr("data-clipboard-text", address);

            clipboard.on('success', function(e) {
                toastr.success("企业邀请链接已复制到剪贴板，用户点击此链接可以快速加入企业。");
                e.clearSelection();
                clipboard.destroy();
            });
            
            clipboard.on('error', function(e) {
                toastr.error("团队邀请链接复制失败");
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
                console.log('address', address);
                clipboard.destroy();
            });
            
        }
    }
}