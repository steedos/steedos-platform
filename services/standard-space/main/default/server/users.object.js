// const _ = require('underscore');
db.users = Meteor.users;

// db.users.allow({
//     // Allow user update own profile
//     update: function (userId, doc, fields, modifier) {
//         if (userId === doc._id) {
//             return true;
//         }
//     }
// });

// db.users.helpers({
//     spaces: function () {
//         var spaces, sus;
//         spaces = [];
//         sus = db.space_users.find({
//             user: this._id
//         }, {
//             fields: {
//                 space: 1
//             }
//         });
//         sus.forEach(function (su) {
//             return spaces.push(su.space);
//         });
//         return spaces;
//     },
//     displayName: function () {
//         if (this.name) {
//             return this.name;
//         } else if (this.username) {
//             return this.username;
//         } else if (this.emails && this.emails[0]) {
//             return this.emails[0].address;
//         }
//     }
// });

if (Meteor.isServer) {
    // db.users.create_secret = function (userId, name) {
    //     var hashedToken, secretToken, u;
    //     secretToken = Accounts._generateStampedLoginToken();
    //     secretToken.token = userId + "-" + secretToken.token;
    //     hashedToken = Accounts._hashLoginToken(secretToken.token);
    //     secretToken.hashedToken = hashedToken;
    //     secretToken.name = name;
    //     u = db.users.findOne({
    //         _id: userId,
    //         "secrets.name": name
    //     });
    //     if (!u) {
    //         return db.users.update({
    //             _id: userId
    //         }, {
    //             $push: {
    //                 secrets: secretToken
    //             }
    //         });
    //     }
    // };
    // db.users.checkEmailValid = function (email) {
    //     var existed;
    //     existed = db.users.find({
    //         "emails.address": email
    //     });
    //     if (existed.count() > 0) {
    //         throw new Meteor.Error(400, "users_error_email_exists");
    //     }
    // };
    // db.users.checkUsernameValid = function (username) {
    //     var existed;
    //     existed = db.users.find({
    //         "username": username
    //     });
    //     if (existed.count() > 0) {
    //         throw new Meteor.Error(400, "users_error_username_exists");
    //     }
    // };
    // db.users.validateUsername = function (username, userId) {
    //     var nameValidation, ref, ref1, ref2, ref3, user;
    //     user = db.users.findOne({
    //         username: {
    //             $regex: new RegExp("^" + Meteor._escapeRegExp(username).trim() + "$", "i")
    //         },
    //         _id: {
    //             $ne: userId
    //         }
    //     });
    //     if (user) {
    //         throw new Meteor.Error('username-unavailable', 'username-unavailable');
    //     }
    //     if (!((ref = Steedos.settings.public) != null ? (ref1 = ref.accounts) != null ? ref1.is_username_skip_minrequiredlength : void 0 : void 0)) {
    //         if (username.length < 6) {
    //             throw new Meteor.Error('username-minrequiredlength', "username-minrequiredlength");
    //         }
    //     }
    //     try {
    //         if ((ref2 = Steedos.settings.public) != null ? (ref3 = ref2.accounts) != null ? ref3.UTF8_Names_Validation : void 0 : void 0) {
    //             nameValidation = new RegExp('^' + Steedos.settings.public.accounts.UTF8_Names_Validation + '$');
    //         } else {
    //             nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
    //         }
    //     } catch (error) {
    //         nameValidation = new RegExp('^[A-Za-z0-9-_.\u00C0-\u017F\u4e00-\u9fa5]+$');
    //     }
    //     if (!nameValidation.test(username)) {
    //         throw new Meteor.Error('username-invalid', "username-invalid");
    //     }
    // };
    // db.users.validatePhone = function (userId, doc, modifier) {
    //     modifier.$set = modifier.$set || {};
    //     if (doc._id !== userId && modifier.$set["phone.number"]) {
    //         if (doc["phone.verified"] === true && doc["phone.number"] !== modifier.$set["phone.number"]) {
    //             throw new Meteor.Error(400, "用户已验证手机，不能修改");
    //         }
    //     }
    // };
    // db.users.before.insert(function (userId, doc) {
    //     var ref, ref1, ref2, ref3, ref4, ref5, space, space_registered;
    //     space_registered = (ref = doc.profile) != null ? ref.space_registered : void 0;
    //     // # 从工作区特定的注册界面注册的用户，需要先判断下工作区是否存在
    //     if (space_registered) {
    //         space = db.spaces.findOne(space_registered);
    //         if (!space) {
    //             throw new Meteor.Error(400, "space_users_error_space_not_found");
    //         }
    //     }
    //     if (doc.username) {
    //         db.users.validateUsername(doc.username, doc._id);
    //     }
    //     doc.created = new Date();
    //     doc.is_deleted = false;
    //     if (userId) {
    //         doc.created_by = userId;
    //     }
    //     if ((ref1 = doc.services) != null ? ref1.google : void 0) {
    //         if (doc.services.google.email && !doc.emails) {
    //             doc.emails = [
    //                 {
    //                     address: doc.services.google.email,
    //                     verified: true
    //                 }
    //             ];
    //         }
    //         if (doc.services.google.picture) {
    //             doc.avatarUrl = doc.services.google.picture;
    //         }
    //     }
    //     if ((ref2 = doc.services) != null ? ref2.facebook : void 0) {
    //         if (doc.services.facebook.email && !doc.emails) {
    //             doc.emails = [
    //                 {
    //                     address: doc.services.facebook.email,
    //                     verified: true
    //                 }
    //             ];
    //         }
    //     }
    //     if (doc.emails && !doc.steedos_id) {
    //         if (doc.emails.length > 0) {
    //             doc.steedos_id = doc.emails[0].address;
    //         }
    //     }
    //     if (((ref3 = doc.profile) != null ? ref3.name : void 0) && !doc.name) {
    //         doc.name = doc.profile.name;
    //     }
    //     if (((ref4 = doc.profile) != null ? ref4.locale : void 0) && !doc.locale) {
    //         doc.locale = doc.profile.locale;
    //     }
    //     if (((ref5 = doc.profile) != null ? ref5.mobile : void 0) && !doc.mobile) {
    //         doc.mobile = doc.profile.mobile;
    //     }
    //     if (!doc.steedos_id && doc.username) {
    //         doc.steedos_id = doc.username;
    //     }
    //     if (!doc.name) {
    //         doc.name = doc.steedos_id.split('@')[0];
    //     }
    //     if (!doc.type) {
    //         doc.type = "user";
    //     }
    //     if (!doc.active) {
    //         doc.active = true;
    //     }
    //     if (!doc.roles) {
    //         doc.roles = ["user"];
    //     }
    //     if (!doc.utcOffset) {
    //         doc.utcOffset = 8;
    //     }
    //     return _.each(doc.emails, function (obj) {
    //         return db.users.checkEmailValid(obj.address);
    //     });
    // });
    // db.users.after.insert(function (userId, doc) {
    //     var content, e, email, enrollAccountUrl, greeting, locale, newId, now, ref, ref1, ref2, rootOrg, space_name, space_registered, subject, token, tokenRecord, url, user_email;
    //     space_registered = (ref = doc.profile) != null ? ref.space_registered : void 0;
    //     if (space_registered) {
    //         // 从工作区特定的注册界面注册的用户，需要自动加入到工作区中
    //         user_email = doc.emails[0].address;
    //         rootOrg = db.organizations.findOne({
    //             space: space_registered,
    //             parent: null
    //         }, {
    //             fields: {
    //                 _id: 1
    //             }
    //         });
    //         db.space_users.insert({
    //             email: user_email,
    //             user: doc._id,
    //             name: doc.name,
    //             organizations: [rootOrg._id],
    //             space: space_registered,
    //             user_accepted: true,
    //             is_registered_from_space: true
    //         });
    //     }
    //     if (!space_registered && !(((ref1 = doc.spaces_invited) != null ? ref1.length : void 0) > 0)) {
    //         // 不是从工作区特定的注册界面注册的用户，也不是邀请的用户
    //         // 即普通的注册用户，则为其新建一个自己的工作区
    //         space_name = doc.company || ((ref2 = doc.profile) != null ? ref2.company : void 0);
    //         if (!space_name) {
    //             space_name = doc.name + " " + t("space");
    //         }
    //         newId = db.spaces._makeNewID();
    //         db.spaces.insert({
    //             _id: newId,
    //             name: space_name,
    //             owner: doc._id,
    //             admins: [doc._id],
    //             space: newId
    //         });
    //     }
    //     // try {
    //     //     if (!doc.services || !doc.services.password || !doc.services.password.bcrypt) {
    //     //         // 发送让用户设置密码的邮件
    //     //         // Accounts.sendEnrollmentEmail(doc._id, doc.emails[0].address)
    //     //         if (doc.emails) {
    //     //             token = Random.secret();
    //     //             email = doc.emails[0].address;
    //     //             now = new Date();
    //     //             tokenRecord = {
    //     //                 token: token,
    //     //                 email: email,
    //     //                 when: now
    //     //             };
    //     //             db.users.update(doc._id, {
    //     //                 $set: {
    //     //                     "services.password.reset": tokenRecord
    //     //                 }
    //     //             });
    //     //             Meteor._ensure(doc, 'services', 'password').reset = tokenRecord;
    //     //             enrollAccountUrl = Accounts.urls.enrollAccount(token);
    //     //             url = Accounts.urls.enrollAccount(token);
    //     //             locale = Steedos.locale(doc._id, true);
    //     //             subject = TAPi18n.__("users_email_create_account", {}, locale);
    //     //             greeting = TAPi18n.__('users_email_hello', {}, locale) + "&nbsp;" + doc.name + ",";
    //     //             content = greeting + "</br>" + TAPi18n.__('users_email_start_service', {}, locale) + "</br>" + url + "</br>" + TAPi18n.__("users_email_thanks", {}, locale) + "</br>";
    //     //             return MailQueue.send({
    //     //                 to: email,
    //     //                 from: Steedos.settings.email.from,
    //     //                 subject: subject,
    //     //                 html: content
    //     //             });
    //     //         }
    //     //     }
    //     // } catch (error) {
    //     //     e = error;
    //     //     return console.log("after insert user: sendEnrollmentEmail, id: " + doc._id + ", " + e);
    //     // }
    // });
    // db.users.before.update(function (userId, doc, fieldNames, modifier, options) {
    //     let setKeys = _.keys(modifier.$set || {});
    //     if (!_.isEmpty(setKeys) && _.find(setKeys, function (key) {
    //         return _.include(['name', 'username', 'email', 'email_verified', 'mobile',
    //             'mobile_verified', 'locale', 'avatar', 'email_notification', 'sms_notification'], key)
    //     })) {
    //         throw new Meteor.Error(500, '禁止修改');
    //     }


    //     // var newNumber;
    //     // db.users.validatePhone(userId, doc, modifier);
    //     // if (modifier.$unset && modifier.$unset.steedos_id === "") {
    //     //     throw new Meteor.Error(400, "users_error_steedos_id_required");
    //     // }
    //     // modifier.$set = modifier.$set || {};
    //     // if (modifier.$set.username) {
    //     //     db.users.validateUsername(modifier.$set.username, doc._id);
    //     // }
    //     // // if doc.steedos_id && modifier.$set.steedos_id
    //     // // 	if modifier.$set.steedos_id != doc.steedos_id
    //     // // 		throw new Meteor.Error(400, "users_error_steedos_id_readonly");
    //     // if (userId) {
    //     //     modifier.$set.modified_by = userId;
    //     // }
    //     // if (modifier.$set['phone.verified'] === true) {
    //     //     newNumber = modifier.$set['phone.mobile'];
    //     //     if (!newNumber) {
    //     //         newNumber = doc.phone.mobile;
    //     //     }
    //     //     modifier.$set.mobile = newNumber;
    //     // }
    //     // return modifier.$set.modified = new Date();
    // });
    // db.users.after.update(function (userId, doc, fieldNames, modifier, options) {
    //     modifier.$set = modifier.$set || {}
    //     if (modifier.$set.last_logon) {
    //         db.space_users.direct.update({ user: doc._id }, { $set: { last_logon: modifier.$set.last_logon } }, {
    //             multi: true
    //         });
    //     }
    // });
    // db.users.before.remove(function (userId, doc) {
    //     throw new Meteor.Error(400, "users_error_cloud_admin_required");
    // });
    Meteor.publish('userData', function () {
        if (!this.userId) {
            return this.ready();
        }
        return db.users.find(this.userId, {
            fields: {
                steedos_id: 1,
                name: 1,
                mobile: 1,
                locale: 1,
                username: 1,
                utcOffset: 1,
                settings: 1,
                is_cloudadmin: 1,
                email_notification: 1,
                avatar: 1,
                "secrets.name": 1,
                "secrets.token": 1
            }
        });
    });
}

// Steedos.setEmailVerified = function (userId, email, value) {
//     let user = db.users.findOne({ _id: userId, email: email }, { fields: { email_verified: 1 } });
//     let now = new Date();
//     if (user && _.isBoolean(value) && user.email_verified != value) {
//         db.space_users.direct.update({ user: userId }, { $set: { email_verified: value, modified: now, modified_by: userId } }, {
//             multi: true
//         });
//         db.users.direct.update({ _id: userId }, { $set: { email_verified: value, modified: now, modified_by: userId } })
//     }
// }

// Steedos.setMobileVerified = function (userId, mobile, value) {
//     let user = db.users.findOne({ _id: userId, mobile: mobile }, { fields: { mobile_verified: 1 } });
//     let now = new Date();
//     if (user && _.isBoolean(value) && user.mobile_verified != value) {
//         db.space_users.direct.update({ user: userId }, { $set: { mobile_verified: value, modified: now, modified_by: userId } }, {
//             multi: true
//         });
//         db.users.direct.update({ _id: userId }, { $set: { mobile_verified: value, modified: now, modified_by: userId } })
//     }
// }

// Steedos.setMobile = function (userId, newMobile) {
//     let user = db.users.findOne({ _id: userId }, { fields: { mobile: 1 } });
//     let existed = db.users.find({ _id: { $ne: userId }, mobile: newMobile }).count();
//     let now = new Date();
//     if (existed > 0) {
//         throw new Error("该手机号已被其他用户注册");
//     }
//     if (user && user.mobile != newMobile) {
//         db.space_users.direct.update({ user: userId }, { $set: { mobile: newMobile, modified: now, modified_by: userId } }, {
//             multi: true
//         });
//         db.users.direct.update({ _id: userId }, { $set: { mobile: newMobile, modified: now, modified_by: userId } })
//     }
// }