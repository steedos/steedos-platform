// const spaceUserCore = require('./space_users.core')
const core = require('@steedos/core');
// const validator = require("validator");
// const objectql = require('@steedos/objectql');
// const Future = require('fibers/future');

// const password = require('./util/password')

db.space_users = core.newCollection('space_users');

db.space_users._simpleSchema = new SimpleSchema;

// function addSpaceAdmin(spaceId, userId){
//     let space = db.spaces.findOne({_id: spaceId}, {fields: {admins: 1}});
//     if(space){
//         let admins = space.admins || [];
//         admins.push(userId);
//         db.spaces.update({_id: space._id}, {$set:{admins: _.uniq(admins)}})
//     }
// }

// function removeSpaceAdmin(spaceId, userId){
//     let space = db.spaces.findOne({_id: spaceId}, {fields: {admins: 1}});
//     if(space){
//         let admins = space.admins || [];
//         admins = _.difference(admins, [userId]);
//         db.spaces.update({_id: space._id}, {$set:{admins: _.uniq(admins)}})
//     }
// }

// function checkMobile(mobile, config){
//     if(config.mobile_phone_locales){
//         return !(mobile.startsWith('+') || !validator.isMobilePhone(mobile, config.mobile_phone_locales || ['zh-CN']))
//     }else{
//         let mobileReg = config.mobile_regexp || '^[0-9]{11}$'
//         return new RegExp(mobileReg).test(mobile)
//     }
// }

// // 给开启加密的字段加密
// const encryptFields = function (doc) {
//     return objectql.wrapAsync(async function () {
//         const doc = this.doc;
//         const objFields = await objectql.getObject('space_users').getFields();
//         const datasource = objectql.getDataSource('default');
//         for (const key in objFields) {
//             if (Object.hasOwnProperty.call(objFields, key)) {
//                 const field = objFields[key];
//                 // 判断是加密字段并且值不为空，且还未加密过
//                 if (field.enable_encryption && _.has(doc, key) && doc[key] && !doc[key].buffer && !doc[key].sub_type) {
//                     doc[key] = await datasource.adapter.encryptValue(doc[key]);
//                 }
//             }
//         }

//     }, { doc: doc })
// }

Meteor.startup(function () {
    if (Meteor.isServer) {
        // db.space_users.insertVaildate = function (userId, doc) {
        //     var currentUserPhonePrefix, isAllOrgAdmin, phoneNumber, selector, space, spaceUserExisted, user, userExist;
        //     if (!doc.space) {
        //         throw new Meteor.Error(400, "space_users_error_space_required");
        //     }
        //     space = db.spaces.findOne(doc.space);
        //     if (!space) {
        //         throw new Meteor.Error(400, "space_users_error_space_not_found");
        //     }

        //     if(doc.user){
        //         user = db.users.findOne({ _id: doc.user }, {fields: { _id: 1}})
        //         if(!user){
        //             throw new Meteor.Error(400, "space_users_error_user_not_found");
        //         }
        //         spaceUserExisted = db.space_users.find({space: doc.space,user: doc.user}, {fields: { _id: 1}});

        //     }else{
        //         const steedosConfig = objectql.getSteedosConfig();
        //         const config = steedosConfig.accounts || {};
        //         if (!doc.email && !doc.mobile) {
        //             // throw new Meteor.Error(400, "contact_need_phone_or_email");
        //         }
        //         if (doc.email) {
        //             if (!validator.isEmail(doc.email)) {
        //                 throw new Meteor.Error(400, "email_format_error");
        //             }
        //         }

        //         if (doc.mobile) {
        //             if (!checkMobile(doc.mobile, config)) {
        //                 throw new Meteor.Error(400, "mobile_format_error");
        //             }
        //         }

        //         // 检验手机号和邮箱是不是指向同一个用户(只有手机和邮箱都填写的时候才需要校验)
        //         selector = [];
        //         if (doc.email) {
        //             selector.push({
        //                 "email": doc.email
        //             });
        //         }
        //         if (doc.mobile) {
        //             selector.push({
        //                 "mobile": doc.mobile
        //             });
        //         }
        //         if (doc.username) {
        //             selector.push({
        //                 "username": doc.username
        //             });
        //         }
        //         if (selector.length > 0) {
        //             userExist = db.users.find({
        //                 $or: selector
        //             });
        
        //             if(userExist.count() > 0){
        //                 throw new Meteor.Error(400, "space_users_error_user_exists");
        //             }
        //             spaceUserExisted = db.space_users.find({
        //                 space: doc.space,
        //                 $or: selector
        //             }, {
        //                 fields: {
        //                     _id: 1
        //                 }
        //             });
        //         }
                
        //     }

        //     if (spaceUserExisted && spaceUserExisted.count() > 0) {
        //         throw new Meteor.Error(400, "space_users_error_space_user_exists");
        //     }
        // };
        // db.space_users.updatevaildate = function (userId, doc, modifier) {
        //     var addOrgs, currentUserPhonePrefix, isAllAddOrgsAdmin, isAllSubOrgsAdmin, isOrgAdmin, newOrgs, oldOrgs, phoneNumber, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, repeatEmailUser, repeatNumberUser, space, subOrgs;
        //     if (doc.invite_state === "refused" || doc.invite_state === "pending") {
        //         throw new Meteor.Error(400, "space_users_error_unaccepted_user_readonly");
        //     }
        //     space = db.spaces.findOne(doc.space);
        //     if (!space) {
        //         throw new Meteor.Error(400, "organizations_error_org_admins_only");
        //     }
        //     if ((ref = modifier.$set) != null ? ref.email : void 0) {
        //         if (!validator.isEmail(modifier.$set.email)) {
        //             throw new Meteor.Error(400, "email_format_error");
        //         }
        //     }

        //     if(modifier.$set && modifier.$set.mobile){
        //         const steedosConfig = objectql.getSteedosConfig();
        //         const config = steedosConfig.accounts || {};
        //         if (!checkMobile(modifier.$set.mobile, config)) {
        //             throw new Meteor.Error(400, "mobile_format_error");
        //         }
        //     }

        //     if (((ref2 = modifier.$set) != null ? ref2.user_accepted : void 0) !== void 0 && !modifier.$set.user_accepted) {
        //         if (space.admins.indexOf(doc.user) > 0 || doc.user === space.owner) {
        //             throw new Meteor.Error(400, "organizations_error_can_not_set_checkbox_true");
        //         }
        //     }
        //     if ((ref3 = modifier.$set) != null ? ref3.space : void 0) {
        //         if (modifier.$set.space !== doc.space) {
        //             throw new Meteor.Error(400, "space_users_error_space_readonly");
        //         }
        //     }
        //     if ((ref4 = modifier.$set) != null ? ref4.user : void 0) {
        //         if (modifier.$set.user !== doc.user) {
        //             throw new Meteor.Error(400, "space_users_error_user_readonly");
        //         }
        //     }
        //     if (((ref5 = modifier.$unset) != null ? ref5.email : void 0) !== void 0) {
        //         throw new Meteor.Error(400, "space_users_error_email_required");
        //     }
        //     if (((ref6 = modifier.$set) != null ? ref6.email : void 0) && modifier.$set.email !== doc.email) {
        //         repeatEmailUser = db.users.findOne({
        //             "email": modifier.$set.email
        //         });
        //         if (repeatEmailUser && repeatEmailUser._id !== doc.user) {
        //             throw new Meteor.Error(400, "space_users_error_email_already_existed");
        //         }
        //     }
        //     if (((ref8 = modifier.$set) != null ? ref8.mobile : void 0) && modifier.$set.mobile !== doc.mobile) {
        //         mobileUser = db.users.findOne({
        //             "mobile": modifier.$set.mobile
        //         });
        //         if (mobileUser && mobileUser._id !== doc.user) {
        //             throw new Meteor.Error(400, "space_users_error_phone_already_existed");
        //         }
        //     }

        //     if(modifier.$set && modifier.$set.username){
        //         db.users.validateUsername(modifier.$set.username, doc.user)
        //     }
        // };
        // db.space_users.before.insert(function (userId, doc) {
        //     var creator, currentUserPhonePrefix, email, id, options, organization, phone, phoneNumber, user, userObj, userObjs;
        //     if(doc.email){
        //         doc.email = doc.email.toLowerCase().trim();
        //     }
        //     db.space_users.insertVaildate(userId, doc);

        //     if(doc.profile){
        //         if(doc.profile === 'admin' && !Steedos.isSpaceAdmin(doc.space, userId)){
        //             throw new Meteor.Error(400, "Only the administrator can set the profile to admin");
        //         }
        //     }else{
        //         doc.profile = 'user'
        //     }
        //     if(doc.user){
        //         doc.owner = doc.user
        //         let userDoc = db.users.findOne({_id: doc.user});
        //         let syncProp = spaceUserCore.pickNeedSyncProp(userDoc);
        //         Object.assign(doc, syncProp);
        //     }else{
        //         doc.created_by = userId;
        //         doc.created = new Date();
        //         doc.modified_by = userId;
        //         doc.modified = new Date();
        //         creator = db.users.findOne(userId);
        //         doc.locale = doc.locale || creator.locale;
        //         if ((!doc.user)) {
        //             if ((doc.is_registered_from_space || doc.is_logined_from_space) || !userObj) {
        //                 if (!doc.invite_state) {
        //                     doc.invite_state = "accepted";
        //                 }
        //                 if (!doc.user_accepted) {
        //                     doc.user_accepted = true;
        //                 }
        //             } else {
        //                 if(Meteor.settings.tenant && Meteor.settings.tenant.saas){
        //                     // 云版要求用户接受邀请才让用户在新加入的工作区生效
        //                     doc.invite_state = "pending";
        //                     // 云版强制设置user_accepted为false
        //                     doc.user_accepted = false;
        //                 }
        //                 else{
        //                     // 落地版本不需要用户接受邀请才让用户在新加入的工作区生效，而是直接生效
        //                     // 落地版本设置user_accepted为传入的值，由管理员在新建用户的界面设置
        //                     if (!doc.user_accepted) {
        //                         doc.user_accepted = false;
        //                     }
        //                 }
        //             }
        //             if (userObj) {
        //                 doc.user = userObj._id;
        //                 doc.name = userObj.name;
        //             } else {
        //                 if (!doc.name) {
        //                     doc.name = doc.email.split('@')[0];
        //                 }
        //                 // 将用户插入到users表
        //                 user = {};
        //                 id = db.users._makeNewID();
        //                 options = {
        //                     name: doc.name,
        //                     locale: doc.locale,
        //                     spaces_invited: [doc.space],
        //                     _id: id,
        //                     steedos_id: doc.email || id
        //                 };
        //                 if (doc.mobile) {
        //                     doc.mobile_verified = false;
        //                     options.mobile = doc.mobile;
        //                     options.mobile_verified  = doc.mobile_verified;
        //                 }
        //                 if (doc.email) {
        //                     doc.email_verified = false
        //                     email = [
        //                         {
        //                             address: doc.email,
        //                             verified: doc.email_verified
        //                         }
        //                     ];
        //                     options.emails = email;
        //                     options.email = doc.email;
        //                     options.email_verified = doc.email_verified;
        //                 }
        //                 if (doc.username) {
        //                     options.username = doc.username;
        //                 }
                        
        //                 if(doc.password){
        //                     password.parsePassword(doc.password, options);  
        //                     delete doc.password;                         
        //                 }

        //                 doc.user = db.users.insert(options);
        //             }
        //         }
        //         if (!doc.user) {
        //             throw new Meteor.Error(400, "space_users_error_user_required");
        //         }
        //         if (!doc.name) {
        //             throw new Meteor.Error(400, "space_users_error_name_required");
        //         }
        //         doc.owner = doc.user
        //     }
        //     if (doc.user) {
        //         doc.owner = doc.user;
        //     }
        //     if (doc.organizations && doc.organizations.length > 0) {
        //         // 如果主组织未设置或设置的值不在doc.organizations内，则自动设置为第一个组织
        //         if (!doc.organizations.includes(doc.organization)) {
        //             doc.organization = doc.organizations[0];
        //         }
        //     }
        //     if (doc.organization) {
        //         organization = db.organizations.findOne(doc.organization, {
        //             fields: {
        //                 company_id: 1
        //             }
        //         });
        //         if (organization && organization.company_id) {
        //             doc.company_id = organization.company_id;
        //         }
        //     }
        //     encryptFields(doc);
        // });
        // db.space_users.after.insert(function (userId, doc) {
        //     var unset, user;
        //     if (doc.organizations) {
        //         doc.organizations.forEach(function (org) {
        //             var organizationObj;
        //             organizationObj = db.organizations.findOne(org);
        //             return organizationObj.updateUsers();
        //         });
        //     }
        //     if(doc.contact_id){
        //         Creator.getCollection("contacts").direct.update({_id: doc.contact_id}, {$set: {user: doc.user}})
        //     }

        //     if(doc.profile === 'admin'){
        //         addSpaceAdmin(doc.space, doc.user);
        //     }

        //     // if (!doc.is_registered_from_space) {
        //     //     user = db.users.findOne(doc.user, {
        //     //         fields: {
        //     //             name: 1,
        //     //             phone: 1,
        //     //             mobile: 1,
        //     //             emails: 1,
        //     //             email: 1
        //     //         }
        //     //     });
        //     //     unset = {};
        //     //     // 同步mobile和email到space_user，没有值的话，就清空space_user的mobile和email字段
        //     //     if (!user.phone) {
        //     //         unset.mobile = "";
        //     //     }
        //     //     if (!user.mobile && user.phone) {
        //     //         user.mobile = user.phone.mobile;
        //     //     }
        //     //     if (!user.emails) {
        //     //         unset.email = "";
        //     //     }
        //     //     if (!user.email && user.emails) {
        //     //         user.email = user.emails[0].address;
        //     //     }
        //     //     delete user._id;
        //     //     delete user.emails;
        //     //     delete user.phone;
        //     //     if (_.isEmpty(unset)) {
        //     //         db.space_users.direct.update({
        //     //             _id: doc._id
        //     //         }, {
        //     //                 $set: user
        //     //             });
        //     //     } else {
        //     //         db.space_users.direct.update({
        //     //             _id: doc._id
        //     //         }, {
        //     //                 $set: user,
        //     //                 $unset: unset
        //     //             });
        //     //     }
        //     // }
        //     db.users_changelogs.direct.insert({
        //         operator: userId,
        //         space: doc.space,
        //         operation: "add",
        //         user: doc.user,
        //         user_count: db.space_users.find({
        //             space: doc.space,
        //             user_accepted: true
        //         }, {
        //                 fields: {
        //                     _id: 1
        //                 }
        //             }).count()
        //     });
        //     if (doc.organizations) {
        //         db.space_users.update_organizations_parents(doc._id, doc.organizations);
        //         return db.space_users.update_company_ids(doc._id, doc);
        //     }
        // });
        // db.space_users.before.update(function (userId, doc, fieldNames, modifier, options) {
        //     var currentUserPhonePrefix, email_val, emails, emails_val, euser, isEmailCleared, isMobileCleared, lang, newEmail, newMobile, number, organization, paramString, params, ref, ref1, ref2, steedos_id, user_set, user_unset;
        //     modifier.$set = modifier.$set || {};
        //     if(modifier.$set.email){
        //         modifier.$set.email = modifier.$set.email.toLowerCase().trim();
        //     }

        //     if(_.has(modifier.$set, 'contact_id') && doc.contact_id != modifier.$set.contact_id){
        //         throw new Meteor.Error(400, "space_users_error_not_change_contact_id");
        //     }

        //     if(_.has(modifier.$set, 'profile') && doc.profile != modifier.$set.profile){
        //         if(!Steedos.isSpaceAdmin(doc.space, userId)){
        //             throw new Meteor.Error(400, "can not change profile");
        //         }

        //         // 管理员不允许把自己的简档设置为非管理员 #804
        //         if (doc.user === userId && modifier.$set.profile != 'admin') {
        //             throw new Meteor.Error(400, 'spaces_error_space_admins_required');
        //         }

        //         if(doc.profile === 'admin'){
        //             removeSpaceAdmin(doc.space, doc.user);
        //         }

        //         if(modifier.$set.profile === 'admin'){
        //             addSpaceAdmin(doc.space, doc.user);
        //         }
        //     }

        //     db.space_users.updatevaildate(userId, doc, modifier);
        //     if (modifier.$set.organizations && modifier.$set.organizations.length > 0) {
        //         // 修改所有组织后，强制把主组织自动设置为第一个组织
        //         modifier.$set.organization = modifier.$set.organizations[0];
        //     }
        //     if (modifier.$set.organization) {
        //         organization = db.organizations.findOne(modifier.$set.organization, {
        //             fields: {
        //                 company_id: 1,
        //                 parent: 1
        //             }
        //         });
        //         if (organization) {
        //             if (organization.company_id) {
        //                 modifier.$set.company_id = organization.company_id;
        //             } else {
        //                 // 如果所属主部门的company_id不存在，则清除当前用户company_id值，而不是查找并设置为根组织Id
        //                 modifier.$unset = modifier.$unset || {};
        //                 modifier.$unset.company_id = 1;
        //             }
        //         }
        //     }
        //     newMobile = modifier.$set.mobile;
        //     // 当把手机号设置为空值时，newMobile为undefined，modifier.$unset.mobile为空字符串
        //     isMobileCleared = ((ref = modifier.$unset) != null ? ref.mobile : void 0) !== void 0;
        //     if (newMobile !== doc.mobile) {

        //         if(newMobile){
        //             modifier.$set.mobile_verified = false
        //         }

        //         if (newMobile || isMobileCleared) {
        //             // 修改人
        //             lang = Steedos.locale(doc.user, true);
        //             // euser = db.users.findOne({
        //             //     _id: userId
        //             // }, {
        //             //         fields: {
        //             //             name: 1
        //             //         }
        //             //     });
        //             if(newMobile && (/^1[3456789]\d{9}$/.test(newMobile))){
        //                 params = {
        //                     name: "系统",
        //                     number: newMobile ? newMobile : TAPi18n.__('space_users_empty_phone', {}, lang)
        //                 };
        //                 paramString = JSON.stringify(params);
        //                 if (doc.mobile && doc.mobile_verified) {
        //                     // 发送手机短信给修改前的手机号
        //                     SMSQueue.send({
        //                         Format: 'JSON',
        //                         Action: 'SingleSendSms',
        //                         ParamString: paramString,
        //                         RecNum: doc.mobile,
        //                         SignName: 'OA系统',
        //                         TemplateCode: 'SMS_67660108',
        //                         msg: TAPi18n.__('sms.chnage_mobile.template', params, lang)
        //                     });
        //                 }
        //                 // if (newMobile) {
        //                 //     // 发送手机短信给修改后的手机号
        //                 //     SMSQueue.send({
        //                 //         Format: 'JSON',
        //                 //         Action: 'SingleSendSms',
        //                 //         ParamString: paramString,
        //                 //         RecNum: newMobile,
        //                 //         SignName: 'OA系统',
        //                 //         TemplateCode: 'SMS_67660108',
        //                 //         msg: TAPi18n.__('sms.chnage_mobile.template', params, lang)
        //                 //     });
        //                 // }
        //             }
        //         }
        //     }
        //     newEmail = modifier.$set.email;
        //     if (newEmail && newEmail !== doc.email) {
        //         modifier.$set.email_verified = false;
        //     }

        //     if(doc.password){
        //         let updateObj = {}
        //         password.parsePassword(doc.password, updateObj);  
        //         delete doc.password;                         
        //         db.users.update({_id: doc.user}, {$set:updateObj});
        //     }
        // });
        // db.space_users.after.update(function (userId, doc, fieldNames, modifier, options) {
        //     var ref;
        //     modifier.$set = modifier.$set || {};
        //     modifier.$unset = modifier.$unset || {};
        //     spaceUserCore.syncUserInfo(this.previous, modifier);

        //     if (modifier.$set.organizations) {
        //         modifier.$set.organizations.forEach(function (org) {
        //             var organizationObj;
        //             organizationObj = db.organizations.findOne(org);
        //             return organizationObj.updateUsers();
        //         });
        //     }
        //     if (this.previous.organizations) {
        //         this.previous.organizations.forEach(function (org) {
        //             var organizationObj;
        //             organizationObj = db.organizations.findOne(org);
        //             return organizationObj.updateUsers();
        //         });
        //     }
        //     if (modifier.$set.hasOwnProperty("user_accepted")) {
        //         if (this.previous.user_accepted !== modifier.$set.user_accepted) {
        //             db.users_changelogs.direct.insert({
        //                 operator: userId,
        //                 space: doc.space,
        //                 operation: (ref = modifier.$set.user_accepted) != null ? ref : {
        //                     "enable": "disable"
        //                 },
        //                 user: doc.user,
        //                 user_count: db.space_users.find({
        //                     space: doc.space,
        //                     user_accepted: true
        //                 }, {
        //                         fields: {
        //                             _id: 1
        //                         }
        //                     }).count()
        //             });
        //         }
        //     }
        //     if (modifier.$set.organizations) {
        //         db.space_users.update_organizations_parents(doc._id, modifier.$set.organizations);
        //         db.space_users.update_company_ids(doc._id, doc);
        //     }
        // });
        // db.space_users.before.remove(function (userId, doc) {
        //     var isOrgAdmin, space;
        //     // check space exists
        //     space = db.spaces.findOne(doc.space);
        //     if (!space) {
        //         throw new Meteor.Error(400, "space_users_error_space_not_found");
        //     }
        //     // if (space.admins.indexOf(userId) < 0) {
        //     //     // 要删除用户，需要至少有一个组织权限
        //     //     isOrgAdmin = Steedos.isOrgAdminByOrgIds(doc.organizations, userId);
        //     //     if (!isOrgAdmin) {
        //     //         throw new Meteor.Error(400, "organizations_error_org_admins_only");
        //     //     }
        //     // }
        //     // 不能删除当前工作区的拥有者
        //     if (space.owner === doc.user) {
        //         throw new Meteor.Error(400, "space_users_error_remove_space_owner");
        //     }
        //     if (space.admins.indexOf(doc.user) > 0) {
        //         throw new Meteor.Error(400, "space_users_error_remove_space_admins");
        //     }
        // });
        // db.space_users.after.remove(function (userId, doc) {
        //     var content, e, locale, space, subject, user;
        //     if (doc.organizations) {
        //         doc.organizations.forEach(function (org) {
        //             var organizationObj;
        //             organizationObj = db.organizations.findOne(org);
        //             return organizationObj.updateUsers();
        //         });
        //     }
        //     db.users_changelogs.direct.insert({
        //         operator: userId,
        //         space: doc.space,
        //         operation: "delete",
        //         user: doc.user,
        //         user_count: db.space_users.find({
        //             space: doc.space,
        //             user_accepted: true
        //         }, {
        //                 fields: {
        //                     _id: 1
        //                 }
        //             }).count()
        //     });
        //     try {
        //         user = db.users.findOne(doc.user, {
        //             fields: {
        //                 email: 1,
        //                 name: 1,
        //                 steedos_id: 1,
        //                 email_verified: 1
        //             }
        //         });
        //         if (user.email && user.email_verified) {
        //             locale = Steedos.locale(doc.user, true);
        //             space = db.spaces.findOne(doc.space, {
        //                 fields: {
        //                     name: 1
        //                 }
        //             });
        //             subject = TAPi18n.__('space_users_remove_mail_subject', {}, locale);
        //             content = TAPi18n.__('space_users_remove_mail_content', {
        //                 steedos_id: user.steedos_id,
        //                 space_name: space != null ? space.name : void 0
        //             }, locale);
        //             return MailQueue.send({
        //                 to: user.email,
        //                 from: user.name + ' on ' + Meteor.settings.email.from,
        //                 subject: subject,
        //                 html: content
        //             });
        //         }
        //     } catch (error) {
        //         e = error;
        //         return console.error(e.stack);
        //     }
        // });
        /**
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
         */
        // db.space_users.update_company_ids = function (_id, su) {
        //     var company_ids, orgs;
        //     if (!su) {
        //         su = db.space_users.findOne({
        //             _id: _id
        //         }, {
        //                 fields: {
        //                     organizations: 1,
        //                     company_id: 1,
        //                     space: 1
        //                 }
        //             });
        //     }
        //     if (!su) {
        //         console.error("db.space_users.update_company_ids,can't find space_users by _id of:", _id);
        //         return;
        //     }
        //     orgs = db.organizations.find({
        //         _id: {
        //             $in: su.organizations
        //         }
        //     }, {
        //             fields: {
        //                 company_id: 1
        //             }
        //         }).fetch();
        //     company_ids = _.pluck(orgs, 'company_id');
        //     // company_ids中的空值就空着，不需要转换成根组织ID值
        //     company_ids = _.uniq(_.compact(company_ids));
        //     return db.space_users.direct.update({
        //         _id: _id
        //     }, {
        //             $set: {
        //                 company_ids: company_ids
        //             }
        //         });
        // };
        // Meteor.publish('space_users', function (spaceId) {
        //     var selector, user;
        //     if (!this.userId) {
        //         return this.ready();
        //     }
        //     user = db.users.findOne(this.userId);
        //     selector = {};
        //     if (spaceId) {
        //         selector.space = spaceId;
        //     } else {
        //         selector.space = {
        //             $in: user.spaces()
        //         };
        //     }
        //     return db.space_users.find(selector);
        // });
        // Meteor.publish('my_space_users', function () {
        //     if (!this.userId) {
        //         return this.ready();
        //     }
        //     return db.space_users.find({
        //         user: this.userId
        //     });
        // });
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

});

// // steedos-workflow包中相关脚本迁移过来
// Meteor.startup(function () {
//     if (Meteor.isServer && db.space_users) {
        // db.space_users.vaildateUserUsedByOther = function (doc) {
        //     var flowNames, roleNames;
        //     roleNames = [];
        //     _.each(db.flow_positions.find({
        //         space: doc.space,
        //         users: doc.user
        //     }, {
        //             fields: {
        //                 users: 1,
        //                 role: 1
        //             }
        //         }).fetch(), function (p) {
        //             var role;
        //             if (p.users.includes(doc.user)) {
        //                 role = db.flow_roles.findOne({
        //                     _id: p.role
        //                 }, {
        //                         fields: {
        //                             name: 1
        //                         }
        //                     });
        //                 if (role) {
        //                     return roleNames.push(role.name);
        //                 }
        //             }
        //         });
        //     if (!_.isEmpty(roleNames)) {
        //         throw new Meteor.Error(400, "space_users_error_roles_used", {
        //             names: roleNames.join(',')
        //         });
        //     }
        //     flowNames = [];
        //     _.each(db.flows.find({
        //         space: doc.space
        //     }, {
        //             fields: {
        //                 name: 1,
        //                 'current.steps': 1
        //             }
        //         }).fetch(), function (f) {
        //             return _.each(f.current.steps, function (s) {
        //                 if (s.deal_type === 'specifyUser' && s.approver_users.includes(doc.user)) {
        //                     return flowNames.push(f.name);
        //                 }
        //             });
        //         });
        //     if (!_.isEmpty(flowNames)) {
        //         throw new Meteor.Error(400, "space_users_error_flows_used", {
        //             names: _.uniq(flowNames).join(',')
        //         });
        //     }
        // };
        // db.space_users.before.update(function (userId, doc, fieldNames, modifier, options) {
        //     modifier.$set = modifier.$set || {};
        //     if (modifier.$set.user_accepted !== void 0 && !modifier.$set.user_accepted) {
        //         // 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
        //         return db.space_users.vaildateUserUsedByOther(doc);
        //     }
        // });
        // return db.space_users.before.remove(function (userId, doc) {
        //     // // 禁用、从工作区移除用户时，检查用户是否被指定为角色成员或者步骤指定处理人 #1288
        //     // return db.space_users.vaildateUserUsedByOther(doc);
        //     throw new Meteor.Error(400, "space_users_error_can_not_remove");
        // });
//     }
// });
/* 
let actions = {
    import: {
        label: "导入",
        on: "list",
        visible: false,
        // visible: function (object_name, record_id, record_permissions) {
        //     if(Steedos.isMobile()){
        //         return false;
        //     }
        //     // if (!Steedos.isPaidSpace()) {
        //     //     return false;
        //     // }
        //     return Steedos.isSpaceAdmin();
        // },
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
    //         return Steedos.isSpaceAdmin();
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
        label: "Change Password",
        on: "record",
        visible: function (object_name, record_id, record_permissions) {
            var organization = Session.get("organization");
            var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
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

            // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
            if(Steedos.isSpaceAdmin()){
                return true;
            }
            else{
                return SpaceUsersCore.isCompanyAdmin(record_id, organization);
            }
        },
        todo: function (object_name, record_id, fields) {
            var organization = Session.get("organization");
            var isAdmin = Steedos.isSpaceAdmin();
            if(!isAdmin){
                isAdmin = SpaceUsersCore.isCompanyAdmin(record_id, organization);
            }

            var userSession = Creator.USER_CONTEXT;

            if(!isAdmin){
                var isPasswordEmpty = false;
                var result = Steedos.authRequest("/api/odata/v4/" + userSession.spaceId + "/" + object_name + "/" + record_id + "/is_password_empty", {type: 'get', async: false});
                if(!result.error){
                    isPasswordEmpty = result.empty;
                }
                if(!isPasswordEmpty){
                    // Modal.show("reset_password_modal");
                    Steedos.openWindow(Steedos.absoluteUrl("/accounts/a/#/update-password"))
                    return;
                }
            }

            var doUpdate = function (inputValue) {
                $("body").addClass("loading");
                try {
                    Meteor.call("setSpaceUserPassword", record_id, userSession.spaceId, inputValue, function (error, result) {
                        $("body").removeClass("loading");
                        if (error) {
                            return toastr.error(error.reason);
                        } else {
                            swal.close();
                            return toastr.success(t("Change password successfully"));
                        }
                    });
                } catch (err) {
                    console.error(err);
                    toastr.error(err);
                    $("body").removeClass("loading");
                }
            }

            swal({
                title: t("Change Password"),
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
            var allowCreate = Steedos.Object.base.actions.standard_new.visible.apply(this, arguments);
            if(!allowCreate){
                // permissions配置没有权限则不给权限
                return false
            }
            // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
            if(Steedos.isSpaceAdmin()){
                return true;
            }
            else{
                var userId = Steedos.userId();
                //当前选中组织所属分部的管理员才有权限
                if(organization && organization.company_id && organization.company_id.admins){
                    return organization.company_id.admins.indexOf(userId) > -1;
                }
            }
        }
    },
    standard_edit: {
        visible: function (object_name, record_id, record_permissions) {
            var organization = Session.get("organization");
            var allowEdit = Steedos.Object.base.actions.standard_edit.visible.apply(this, arguments);
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

            // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
            if(Steedos.isSpaceAdmin()){
                return true;
            }
            else{
                return SpaceUsersCore.isCompanyAdmin(record_id, organization);
            }
        }
    },
    standard_delete: {
        visible: function (object_name, record_id, record_permissions) {
            return false
            // var organization = Session.get("organization");
            // var allowDelete = Steedos.Object.base.actions.standard_delete.visible.apply(this, arguments);
            // if(!allowDelete){
            //     // permissions配置没有权限则不给权限
            //     return false
            // }
            // // 组织管理员要单独判断，只给到有对应分部的组织管理员权限
            // if(Steedos.isSpaceAdmin()){
            //     return true;
            // }
            // else{
            //     var userId = Steedos.userId();
            //     if(organization){
            //         //当前选中组织所属分部的管理员才有权限
            //         if(organization.company_id && organization.company_id.admins){
            //             return organization.company_id.admins.indexOf(userId) > -1;
            //         }
            //     }
            //     else{
            //         // 用户详细界面拿不到当前选中组织时，只能从记录本身所属分部的管理员中判断，只要当前用户是任何一个所属分部的管理员则有权限
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
        label: "Invite Users",
        on: "list",
        visible: function(){
            if (Steedos.isSpaceAdmin()){
                let space = Creator.odata.get("spaces", Session.get("spaceId"), "enable_register");
                if(space && space.enable_register){
                    return true;
                }
            }
        },
        todo: function(){
            // var address = window.location.origin + "/accounts/a/#/signup?redirect_uri=" + encodeURIComponent(window.location.origin + __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) + "&X-Space-Id=" + Steedos.getSpaceId();
            var inviteToken = Steedos.getInviteToken();
            let address = window.location.origin + "/accounts/a/#/signup?invite_token=" + inviteToken;
            if(_.isFunction(Steedos.isCordova) && Steedos.isCordova()){
                address = Meteor.absoluteUrl("accounts/a/#/signup?invite_token=" + inviteToken)
            }
            
            var clipboard = new Clipboard('.list-action-custom-invite_space_users');

            $(".list-action-custom-invite_space_users").attr("data-clipboard-text", address);

            clipboard.on('success', function(e) {
                toastr.success(t("space_users_aciton_invite_space_users_success"));
                e.clearSelection();
                clipboard.destroy();
            });
            
            clipboard.on('error', function(e) {
                toastr.error(t("space_users_aciton_invite_space_users_error"));
                console.error('Action:', e.action);
                console.error('Trigger:', e.trigger);
                console.log('address', address);
                console.log('clipboard error', e)
                clipboard.destroy();
            });
            
        }
    }
}

Creator.Objects.space_users.actions = Object.assign({}, Creator.Objects.space_users.actions, actions);
 */

// let doDisable = async function(spaceUser){
//     return Future.task(() => {
//         try {
//             let result = db.users.direct.update({_id: spaceUser.user}, {$set: {user_accepted: false, profile: spaceUser.profile}, $unset: {username: 1, mobile: 1, mobile_verified: 1, email: 1, email_verified: 1, emails: 1, steedos_id: 1}});
//             if(!result){
//                 console.error("The users directUpdate return nothing.");
//                 return false;
//             }
            
//             result = db.space_users.direct.update({_id: spaceUser._id}, {$set: {user_accepted: false, profile: spaceUser.profile}, $unset: {username: 1, mobile: 1, mobile_verified: 1, email: 1, email_verified: 1}});
//             return result;
//         } catch (error) {
//             this.logger.error(error);
//             return false;
//         }
//     }).promise();
// }

// let methods = {
    // disable: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const user = req.user;

    //         const steedosSchema = objectql.getSteedosSchema();
    //         const spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user_accepted", "user", "profile", "company_ids"]});

    //         const companyIds = spaceUser.company_ids;
            
    //         let isAdmin = user.is_space_admin;
    //         if(!isAdmin && companyIds && companyIds.length){
    //             const query = {
    //                 fields: ['admins'],
    //                 filters: [['_id','=',companyIds],['space','=',user.spaceId]]
    //             }
    //             const companys = await objectql.getObject("company").find(query);
    //             isAdmin = _.any(companys, (item)=>{
    //                 return item.admins && item.admins.indexOf(user.userId) > -1
    //             })
    //         }

    //         if (!isAdmin) {
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_disable_enable_error_only_admin"
    //                 }
    //             });
    //             return;
    //         }
    //         if (spaceUser.user === user.userId){
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_error_can_not_own"
    //                 }
    //             });
    //             return;
    //         }
    //         if (!spaceUser.user_accepted) {
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_error_can_not_disable_disabled"
    //                 }
    //             });
    //             return;
    //         }
    //         let result = await doDisable(spaceUser);
    //         if(result){
    //             res.status(200).send({ success: true });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "The space_users/users directUpdate return nothing."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
    // enable: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const user = req.user;

    //         const steedosSchema = objectql.getSteedosSchema();
    //         const spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user_accepted", "user", "profile", "company_ids"]});

    //         const companyIds = spaceUser.company_ids;
            
    //         let isAdmin = user.is_space_admin;
    //         if(!isAdmin && companyIds && companyIds.length){
    //             const query = {
    //                 fields: ['admins'],
    //                 filters: [['_id','=',companyIds],['space','=',user.spaceId]]
    //             }
    //             const companys = await objectql.getObject("company").find(query);
    //             isAdmin = _.any(companys, (item)=>{
    //                 return item.admins && item.admins.indexOf(user.userId) > -1
    //             })
    //         }

    //         if(!isAdmin){
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_disable_enable_error_only_admin"
    //                 }
    //             });
    //             return;
    //         }
    //         if (spaceUser.user === user.userId) {
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_error_can_not_own"
    //                 }
    //             });
    //             return;
    //         }
    //         if (spaceUser.user_accepted) {
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_error_can_not_enable_enabled"
    //                 }
    //             });
    //             return;
    //         }
    //         let result = await steedosSchema.getObject('space_users').updateOne(params._id, { user_accepted: true, profile: spaceUser.profile });
    //         if(result){
    //             res.status(200).send({ success: true });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "The object updateOne return nothing."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
    // is_lockout: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const steedosSchema = objectql.getSteedosSchema();
    //         let spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user_accepted", "user"] });
    //         let result = await steedosSchema.getObject('users').findOne(spaceUser.user)
    //         if(result){
    //             res.status(200).send({ lockout: result.lockout });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "user not find."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
    // lockout: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const user = req.user;

    //         const steedosSchema = objectql.getSteedosSchema();
    //         let spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user_accepted", "user", "profile", "company_ids"]});

    //         const companyIds = spaceUser.company_ids;
            
    //         let isAdmin = user.is_space_admin;
    //         if(!isAdmin && companyIds && companyIds.length){
    //             const query = {
    //                 fields: ['admins'],
    //                 filters: [['_id','=',companyIds],['space','=',user.spaceId]]
    //             }
    //             const companys = await objectql.getObject("company").find(query);
    //             isAdmin = _.any(companys, (item)=>{
    //                 return item.admins && item.admins.indexOf(user.userId) > -1
    //             })
    //         }

    //         if(!isAdmin){
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_unlock_lockout_error_only_admin"
    //                 }
    //             });
    //             return;
    //         }
    //         if (spaceUser.user === user.userId) {
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "不能锁定您自己的帐户。"
    //                 }
    //             });
    //             return;
    //         }
    //         let result = await steedosSchema.getObject('users').updateOne(spaceUser.user, {lockout: true});
    //         if(result){
    //             res.status(200).send({ success: true });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "The object updateOne return nothing."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
    // unlock: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const user = req.user;

    //         const steedosSchema = objectql.getSteedosSchema();
    //         let spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user_accepted", "user", "profile", "company_ids"]});

    //         const companyIds = spaceUser.company_ids;
            
    //         let isAdmin = user.is_space_admin;
    //         if(!isAdmin && companyIds && companyIds.length){
    //             const query = {
    //                 fields: ['admins'],
    //                 filters: [['_id','=',companyIds],['space','=',user.spaceId]]
    //             }
    //             const companys = await objectql.getObject("company").find(query);
    //             isAdmin = _.any(companys, (item)=>{
    //                 return item.admins && item.admins.indexOf(user.userId) > -1
    //             })
    //         }

    //         if(!isAdmin){
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "space_users_method_unlock_lockout_error_only_admin"
    //                 }
    //             });
    //             return;
    //         }
    //         let result = await steedosSchema.getObject('users').updateOne(spaceUser.user, {lockout: false, login_failed_number: 0, login_failed_lockout_time: undefined});
    //         if(result){
    //             res.status(200).send({ success: true });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "The object updateOne return nothing."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
    // is_password_empty: async function (req, res) {
    //     try {
    //         const params = req.params;
    //         const steedosSchema = objectql.getSteedosSchema();
    //         let spaceUser = await steedosSchema.getObject('space_users').findOne(params._id, { fields: ["user"] });
    //         const result = await steedosSchema.getObject('users').findOne(spaceUser.user, { fields:["services.password"] });
    //         if(result){
    //             res.status(200).send({ empty: !!!(result.services && result.services.password && (result.services.password.bcrypt || result.services.password.bcrypts)) });
    //         }
    //         else{
    //             res.status(400).send({
    //                 success: false,
    //                 error: {
    //                     reason: "未找到用户"
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         res.status(400).send({
    //             success: false,
    //             error: {
    //                 reason: error.reason,
    //                 message: error.message,
    //                 details: error.details,
    //                 stack: error.stack
    //             }
    //         });
    //     }
    // },
// };

// Creator.Objects.space_users.methods = Object.assign({}, Creator.Objects.space_users.methods, methods);