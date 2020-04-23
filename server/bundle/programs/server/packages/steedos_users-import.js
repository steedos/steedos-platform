(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:users-import":{"checkNpm.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/checkNpm.js                                                             //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  "ejs": "^2.5.5",
  "ejs-lint": "^0.2.0"
}, 'steedos:users-import');
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"import_users.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/server/methods/import_users.coffee                                      //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  /*
  		1、校验用户是否存在
  		2、校验工作区用户是否存在
  		3、校验部门是否存在
  		4、校验部门用户是否存在
  		TODO: 国际化
   */import_users: function (space_id, user_pk, data, onlyCheck) {
    var _self, accepted_user_count, currentUser, currentUserLocale, currentUserPhonePrefix, errorList, owner_id, root_org, space, testData;

    _self = this;

    if (!this.userId) {
      throw new Meteor.Error(401, "请先登录");
    }

    root_org = db.organizations.findOne({
      space: space_id,
      parent: null
    });
    space = db.spaces.findOne(space_id);

    if (!space || !(space != null ? space.admins.includes(this.userId) : void 0)) {
      throw new Meteor.Error(401, "只有工作区管理员可以导入用户");
    }

    if (!space.is_paid) {
      throw new Meteor.Error(401, "基础版不支持此功能");
    }

    accepted_user_count = db.space_users.find({
      space: space._id,
      user_accepted: true
    }).count();

    if (accepted_user_count + data.length > space.user_limit) {
      throw new Meteor.Error(400, "需要提升已购买用户数至" + (accepted_user_count + data.length) + "(当前" + space.user_limit + ")" + ", 请在企业信息模块中点击升级按钮购买");
    }

    owner_id = space.owner;
    testData = [];
    errorList = [];
    currentUser = db.users.findOne({
      _id: _self.userId
    }, {
      fields: {
        locale: 1,
        phone: 1
      }
    });
    currentUserLocale = currentUser.locale;
    currentUserPhonePrefix = Accounts.getPhonePrefix(currentUser);
    data.forEach(function (item, i) {
      var multiOrgs, operating, organization, organization_depts, phoneNumber, ref, ref1, ref2, ref3, selector, spaceUserExist, testObj, user, userExist;

      if (!item.phone && !item.email) {
        throw new Meteor.Error(500, "第" + (i + 1) + "行: 手机号，邮箱不能都为空");
      }

      testObj = {};

      if (item.username) {
        testObj.username = item.username;

        if (testData.filterProperty("username", item.username).length > 0) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：用户名重复");
        }
      }

      if (item.phone) {
        testObj.phone = item.phone;

        if (testData.filterProperty("phone", item.phone).length > 0) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：手机号重复");
        }
      }

      if (item.email) {
        if (!/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(item.email)) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：邮件格式错误" + item.email);
        }

        testObj.email = item.email;

        if (testData.filterProperty("email", item.email).length > 0) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：邮件重复");
        }
      }

      item.space = space_id;
      testData.push(testObj);
      selector = [];
      operating = "";

      if (item.username) {
        selector.push({
          username: item.username
        });
      }

      if (item.email) {
        selector.push({
          "emails.address": item.email
        });
      }

      if (item.phone) {
        phoneNumber = currentUserPhonePrefix + item.phone;
        selector.push({
          "phone.number": phoneNumber
        });
      }

      userExist = db.users.find({
        $or: selector
      });

      if (userExist.count() > 1) {
        throw new Meteor.Error(500, "第" + (i + 1) + "行：用户名、手机号、邮箱信息有误，无法匹配到同一账号");
      } else if (userExist.count() === 1) {
        user = userExist.fetch()[0]._id;
        spaceUserExist = db.space_users.find({
          space: space_id,
          user: user
        });

        if (spaceUserExist.count() === 1) {
          operating = "update";
        } else if (spaceUserExist.count() === 0) {
          operating = "insert";
        }
      } else if (userExist.count() === 0) {
        operating = "insert";
      }

      if (item.password && userExist.count() === 1) {
        if ((ref = userExist.fetch()[0].services) != null ? (ref1 = ref.password) != null ? ref1.bcrypt : void 0 : void 0) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：用户已设置密码，不允许修改");
        }
      }

      organization = item.organization;

      if (!organization) {
        throw new Meteor.Error(500, "第" + (i + 1) + "行：部门不能为空");
      }

      organization_depts = organization.split("/");

      if (organization_depts.length < 1 || organization_depts[0] !== root_org.name) {
        throw new Meteor.Error(500, "第" + (i + 1) + "行：无效的根部门");
      }

      if (item.password && (user != null ? (ref2 = user.services) != null ? (ref3 = ref2.password) != null ? ref3.bcrypt : void 0 : void 0 : void 0)) {
        throw new Meteor.Error(500, "第" + (i + 1) + "行：用户已设置密码，不允许修改");
      }

      organization_depts.forEach(function (dept_name, j) {
        if (!dept_name) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：无效的部门");
        }
      });
      multiOrgs = organization.split(",");
      return multiOrgs.forEach(function (orgFullname) {
        var fullname;
        organization_depts = orgFullname.trim().split("/");
        fullname = "";
        return organization_depts.forEach(function (dept_name, j) {
          var orgCount;

          if (j > 0) {
            if (j === 1) {
              fullname = dept_name;
            } else {
              fullname = fullname + "/" + dept_name;
            }

            orgCount = db.organizations.find({
              space: space_id,
              fullname: fullname
            }).count();

            if (orgCount === 0) {
              throw new Meteor.Error(500, "第" + (i + 1) + "行：部门(" + dept_name + ")不存在，请先创建");
            }
          }
        });
      });
    });

    if (onlyCheck) {
      return;
    }

    data.forEach(function (item, i) {
      var belongOrgids, e, error, multiOrgs, now, operating, organization, phoneNumber, selector, space_user, space_user_update_doc, su_doc, udoc, user, userExist, userInfo, user_id;
      error = {};

      try {
        selector = [];
        operating = "";

        if (item.email) {
          selector.push({
            "emails.address": item.email
          });
        }

        if (item.phone) {
          phoneNumber = currentUserPhonePrefix + item.phone;
          selector.push({
            "phone.number": phoneNumber
          });
        }

        userExist = db.users.find({
          $or: selector
        });

        if (userExist.count() > 1) {
          throw new Meteor.Error(400, "用户名、手机号、邮箱信息有误，无法匹配到同一账号");
        } else if (userExist.count() === 1) {
          user = userExist.fetch()[0];
        }

        now = new Date();
        organization = item.organization;
        multiOrgs = organization.split(",");
        belongOrgids = [];
        multiOrgs.forEach(function (orgFullname) {
          var fullname, org, organization_depts;
          organization_depts = orgFullname.trim().split("/");
          fullname = "";
          organization_depts.forEach(function (dept_name, j) {
            if (j > 0) {
              if (j === 1) {
                return fullname = dept_name;
              } else {
                return fullname = fullname + "/" + dept_name;
              }
            } else {
              return fullname = dept_name;
            }
          });
          org = db.organizations.findOne({
            space: space_id,
            fullname: fullname
          });

          if (org) {
            return belongOrgids.push(org._id);
          }
        });
        user_id = null;

        if (user) {
          user_id = user._id;
        } else {
          udoc = {};
          udoc._id = db.users._makeNewID();
          udoc.steedos_id = item.email || udoc._id;
          udoc.locale = currentUserLocale;
          udoc.spaces_invited = [space_id];

          if (item.name) {
            udoc.name = item.name;
          }

          if (item.email) {
            udoc.emails = [{
              address: item.email,
              verified: false
            }];
          }

          if (item.username) {
            udoc.username = item.username;
          }

          if (item.phone) {
            udoc.phone = {
              number: currentUserPhonePrefix + item.phone,
              mobile: item.phone,
              verified: false,
              modified: now
            };
          }

          user_id = db.users.insert(udoc);

          if (item.password) {
            Accounts.setPassword(user_id, item.password, {
              logout: false
            });
          }
        }

        space_user = db.space_users.findOne({
          space: space_id,
          user: user_id
        });

        if (space_user) {
          if (belongOrgids.length > 0) {
            if (!space_user.organizations) {
              space_user.organizations = [];
            }

            space_user_update_doc = {};
            space_user_update_doc.organizations = _.uniq(space_user.organizations.concat(belongOrgids));

            if (item.email) {
              space_user_update_doc.email = item.email;
            }

            if (item.name) {
              space_user_update_doc.name = item.name;
            }

            if (item.company) {
              space_user_update_doc.company = item.company;
            }

            if (item.position) {
              space_user_update_doc.position = item.position;
            }

            if (item.work_phone) {
              space_user_update_doc.work_phone = item.work_phone;
            }

            if (item.phone) {
              space_user_update_doc.mobile = item.phone;
            }

            if (item.sort_no) {
              space_user_update_doc.sort_no = item.sort_no;
            }

            if (_.keys(space_user_update_doc).length > 0) {
              db.space_users.update({
                space: space_id,
                user: user_id
              }, {
                $set: space_user_update_doc
              });
            }

            if (space_user.invite_state === "refused" || space_user.invite_state === "pending") {
              throw new Meteor.Error(400, "该用户还未接受加入工作区，不能修改他的个人信息");
            } else {
              if (item.username) {
                db.users.update({
                  _id: user_id
                }, {
                  $set: {
                    username: item.username
                  }
                });
              }

              if (item.password) {
                return Accounts.setPassword(user_id, item.password, {
                  logout: false
                });
              }
            }
          }
        } else {
          if (belongOrgids.length > 0) {
            su_doc = {};
            su_doc._id = db.space_users._makeNewID();
            su_doc.space = space_id;
            su_doc.user_accepted = true;
            su_doc.invite_state = "accepted";

            if (user) {
              su_doc.user_accepted = false;
              su_doc.invite_state = "pending";
            }

            su_doc.name = item.name;

            if (item.email) {
              su_doc.email = item.email;
            }

            su_doc.organization = belongOrgids[0];
            su_doc.organizations = belongOrgids;

            if (item.position) {
              su_doc.position = item.position;
            }

            if (item.work_phone) {
              su_doc.work_phone = item.work_phone;
            }

            if (item.phone) {
              su_doc.mobile = item.phone;
            }

            if (item.sort_no) {
              su_doc.sort_no = item.sort_no;
            }

            if (item.company) {
              su_doc.company = item.company;
            }

            if (user_id) {
              userInfo = db.users.findOne(user_id, {
                fields: {
                  username: 1
                }
              });

              if (userInfo.username) {
                su_doc.username = userInfo.username;
              }
            }

            return db.space_users.insert(su_doc);
          }
        }
      } catch (error1) {
        e = error1;
        error.line = i + 1;
        error.message = e.reason;
        return errorList.push(error);
      }
    });
    return errorList;
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"routes":{"api_space_users_export.coffee":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/routes/api_space_users_export.coffee                                    //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return WebApp.connectHandlers.use("/api/export/space_users", function (req, res, next) {
    var current_user_info, e, ejs, ejsLint, error_obj, fields, fileName, lang, now, org, orgName, org_id, org_ids, org_objs, query, ret, sheet_name, space_id, str, template, user_id, users_to_xls;

    try {
      current_user_info = uuflowManager.check_authorization(req);
      query = req.query;
      space_id = query.space_id;
      org_id = query.org_id;
      user_id = query['X-User-Id'];
      org = db.organizations.findOne({
        _id: org_id
      }, {
        fields: {
          fullname: 1
        }
      });
      users_to_xls = new Array();
      now = new Date();

      if (Steedos.isSpaceAdmin(space_id, user_id)) {
        users_to_xls = db.space_users.find({
          space: space_id
        }, {
          sort: {
            name: 1
          }
        }).fetch();
      } else {
        org_ids = [];
        org_objs = db.organizations.find({
          _id: org_id,
          space: space_id
        }, {
          fields: {
            _id: 1,
            children: 1
          }
        }).fetch();
        org_ids = _.pluck(org_objs, '_id');

        _.each(org_objs, function (org_obj) {
          return org_ids = _.union(org_ids, org_obj != null ? org_obj.children : void 0);
        });

        _.uniq(org_ids);

        users_to_xls = db.space_users.find({
          space: space_id,
          organizations: {
            $in: org_ids
          }
        }, {
          sort: {
            sort_no: -1,
            name: 1
          }
        }).fetch();
      }

      ejs = require('ejs');
      str = Assets.getText('server/ejs/export_space_users.ejs');
      ejsLint = require('ejs-lint');
      error_obj = ejsLint.lint(str, {});

      if (error_obj) {
        console.error("===/api/contacts/export/space_users:");
        console.error(error_obj);
      }

      template = ejs.compile(str);
      lang = 'en';

      if (current_user_info.locale === 'zh-cn') {
        lang = 'zh-CN';
      }

      orgName = org ? org.fullname : org_id;
      fields = [{
        type: 'String',
        name: 'name',
        width: 60,
        title: TAPi18n.__('space_users_name', {}, lang)
      }, {
        type: 'String',
        name: 'mobile',
        width: 100,
        title: TAPi18n.__('space_users_mobile', {}, lang)
      }, {
        type: 'String',
        name: 'work_phone',
        width: 100,
        title: TAPi18n.__('space_users_work_phone', {}, lang)
      }, {
        type: 'String',
        name: 'email',
        width: 100,
        title: TAPi18n.__('space_users_email', {}, lang)
      }, {
        type: 'String',
        name: 'company',
        width: 100,
        title: TAPi18n.__('space_users_company', {}, lang)
      }, {
        type: 'String',
        name: 'position',
        width: 100,
        title: TAPi18n.__('space_users_position', {}, lang)
      }, {
        type: 'String',
        name: 'organizations',
        width: 600,
        title: TAPi18n.__('space_users_organizations', {}, lang),
        transform: function (value) {
          var orgNames;
          orgNames = db.organizations.find({
            _id: {
              $in: value
            }
          }, {
            fields: {
              fullname: 1
            }
          }).map(function (item, index) {
            return item.fullname;
          });
          return orgNames.join(",");
        }
      }, {
        type: 'String',
        name: 'manager',
        width: 60,
        title: TAPi18n.__('space_users_manager', {}, lang),
        transform: function (value) {
          var user;
          user = db.users.findOne({
            _id: value
          }, {
            fields: {
              name: 1
            }
          });
          return user != null ? user.name : void 0;
        }
      }, {
        type: 'String',
        name: 'user',
        width: 60,
        title: TAPi18n.__('users_username', {}, lang),
        transform: function (value) {
          var user;
          user = db.users.findOne({
            _id: value
          }, {
            fields: {
              username: 1
            }
          });
          return user != null ? user.username : void 0;
        }
      }, {
        type: 'Number',
        name: 'sort_no',
        width: 35,
        title: TAPi18n.__('space_users_sort_no', {}, lang)
      }, {
        type: 'String',
        name: 'user_accepted',
        width: 35,
        title: TAPi18n.__('space_users_user_accepted', {}, lang),
        transform: function (value) {
          if (value) {
            return TAPi18n.__('space_users_user_accepted_yes', {}, lang);
          } else {
            return TAPi18n.__('space_users_user_accepted_no', {}, lang);
          }
        }
      }];
      sheet_name = orgName != null ? orgName.replace(/\//g, "-") : void 0;
      ret = template({
        lang: lang,
        sheet_name: sheet_name,
        fields: fields,
        users_to_xls: users_to_xls
      });
      fileName = "SteedOSContacts_" + moment().format('YYYYMMDDHHmm') + ".xls";
      res.setHeader("Content-type", "application/octet-stream");
      res.setHeader("Content-Disposition", "attachment;filename=" + encodeURI(fileName));
      return res.end(ret);
    } catch (error) {
      e = error;
      console.error(e.stack);
      return res.end(e.message);
    }
  });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:users-import/checkNpm.js");
require("/node_modules/meteor/steedos:users-import/server/methods/import_users.coffee");
require("/node_modules/meteor/steedos:users-import/routes/api_space_users_export.coffee");

/* Exports */
Package._define("steedos:users-import");

})();

//# sourceURL=meteor://💻app/packages/steedos_users-import.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImN1cnJlbnRVc2VyUGhvbmVQcmVmaXgiLCJlcnJvckxpc3QiLCJvd25lcl9pZCIsInJvb3Rfb3JnIiwic3BhY2UiLCJ0ZXN0RGF0YSIsInVzZXJJZCIsIkVycm9yIiwiZGIiLCJvcmdhbml6YXRpb25zIiwiZmluZE9uZSIsInBhcmVudCIsInNwYWNlcyIsImFkbWlucyIsImluY2x1ZGVzIiwiaXNfcGFpZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsIl9pZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJBY2NvdW50cyIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsIm1vZGlmaWVkIiwiaW5zZXJ0Iiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJfIiwidW5pcSIsImNvbmNhdCIsImNvbXBhbnkiLCJwb3NpdGlvbiIsIndvcmtfcGhvbmUiLCJzb3J0X25vIiwia2V5cyIsInVwZGF0ZSIsIiRzZXQiLCJpbnZpdGVfc3RhdGUiLCJlcnJvcjEiLCJsaW5lIiwibWVzc2FnZSIsInJlYXNvbiIsInN0YXJ0dXAiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2luZm8iLCJlanMiLCJlanNMaW50IiwiZXJyb3Jfb2JqIiwiZmlsZU5hbWUiLCJsYW5nIiwib3JnTmFtZSIsIm9yZ19pZCIsIm9yZ19pZHMiLCJvcmdfb2JqcyIsInF1ZXJ5IiwicmV0Iiwic2hlZXRfbmFtZSIsInN0ciIsInRlbXBsYXRlIiwidXNlcnNfdG9feGxzIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJBcnJheSIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsInR5cGUiLCJ3aWR0aCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsU0FBTyxRQURTO0FBRWhCLGNBQVk7QUFGSSxDQUFELEVBR2Isc0JBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREFJLE9BQU9DLE9BQVAsQ0FDQztBQUFBOzs7Ozs7S0FPQUMsY0FBYyxVQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0JDLElBQXBCLEVBQTBCQyxTQUExQjtBQUViLFFBQUFDLEtBQUEsRUFBQUMsbUJBQUEsRUFBQUMsV0FBQSxFQUFBQyxpQkFBQSxFQUFBQyxzQkFBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLFFBQUE7O0FBQUFULFlBQVEsSUFBUjs7QUFFQSxRQUFHLENB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ZGxHLGdCQUFRQSxNQUhNO0FBSWRxRyxzQkFBY0E7QUFKQSxPQUFULENBQU47QUFPQVgsaUJBQVcscUJBQXFCMEMsU0FBU0MsTUFBVCxDQUFnQixjQUFoQixDQUFyQixHQUF1RCxNQUFsRTtBQUNBakQsVUFBSWtELFNBQUosQ0FBYyxjQUFkLEVBQThCLDBCQUE5QjtBQUNBbEQsVUFBSWtELFNBQUosQ0FBYyxxQkFBZCxFQUFxQyx5QkFBdUJDLFVBQVU3QyxRQUFWLENBQTVEO0FDeURHLGFEeERITixJQUFJb0QsR0FBSixDQUFRdkMsR0FBUixDQ3dERztBRGxMSixhQUFBdkQsS0FBQTtBQTJITUQsVUFBQUMsS0FBQTtBQUNMNEUsY0FBUTVFLEtBQVIsQ0FBY0QsRUFBRWdHLEtBQWhCO0FDMERHLGFEekRIckQsSUFBSW9ELEdBQUosQ0FBUS9GLEVBQUVvQyxPQUFWLENDeURHO0FBQ0Q7QUR4TEosSUNBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxyXG5cdFwiZWpzLWxpbnRcIjogXCJeMC4yLjBcIlxyXG59LCAnc3RlZWRvczp1c2Vycy1pbXBvcnQnKTtcclxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQjIyNcclxuXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcclxuXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdFRPRE86IOWbvemZheWMllxyXG5cdCMjI1xyXG5cdGltcG9ydF91c2VyczogKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spLT5cclxuXHJcblx0XHRfc2VsZiA9IHRoaXNcclxuXHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpXHJcblxyXG5cdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgcGFyZW50OiBudWxsfSlcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZT8uYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XHJcblxyXG5cdFx0aWYgIXNwYWNlLmlzX3BhaWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Z+656GA54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xyXG5cclxuXHRcdGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2UuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0aWYgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0XHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHsyN7YWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RofSjlvZPliY0je3NwYWNlLnVzZXJfbGltaXR9KVwiICtcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpXHJcblxyXG5cdFx0b3duZXJfaWQgPSBzcGFjZS5vd25lclxyXG5cclxuXHRcdHRlc3REYXRhID0gW11cclxuXHJcblx0XHRlcnJvckxpc3QgPSBbXVxyXG5cclxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBfc2VsZi51c2VySWR9LHtmaWVsZHM6e2xvY2FsZToxLHBob25lOjF9fSlcclxuXHRcdGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlXHJcblx0XHRjdXJyZW50VXNlclBob25lUHJlZml4ID0gQWNjb3VudHMuZ2V0UGhvbmVQcmVmaXggY3VycmVudFVzZXJcclxuXHJcblx0XHQjIOaVsOaNrue7n+S4gOagoemqjFxyXG5cclxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxyXG5cdFx0XHQjIGNvbnNvbGUubG9nIGl0ZW1cclxuXHRcdFx0IyDnlKjmiLflkI3vvIzmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcclxuXHRcdFx0aWYgIWl0ZW0ucGhvbmUgYW5kICFpdGVtLmVtYWlsXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKVxyXG5cclxuXHRcdFx0IyDliKTmlq1leGNlbOS4reeahOaVsOaNru+8jOeUqOaIt+WQjeOAgeaJi+acuuWPt+etieS/oeaBr+aYr+WQpuacieivr1xyXG5cdFx0XHR0ZXN0T2JqID0ge31cclxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHR0ZXN0T2JqLnBob25lID0gaXRlbS5waG9uZVxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XHJcblxyXG5cdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0aWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbClcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vI3tpdGVtLmVtYWlsfVwiKTtcclxuXHJcblx0XHRcdFx0dGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcImVtYWlsXCIsIGl0ZW0uZW1haWwpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu26YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aXRlbS5zcGFjZSA9IHNwYWNlX2lkXHJcblxyXG5cdFx0XHR0ZXN0RGF0YS5wdXNoKHRlc3RPYmopXHJcblxyXG5cdFx0XHQjIOiOt+WPluafpeaJvnVzZXLnmoTmnaHku7ZcclxuXHRcdFx0c2VsZWN0b3IgPSBbXVxyXG5cdFx0XHRvcGVyYXRpbmcgPSBcIlwiXHJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cclxuXHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbH1cclxuXHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlcn1cclxuXHJcblx0XHRcdHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoeyRvcjogc2VsZWN0b3J9KVxyXG5cclxuXHJcblx0XHRcdCMg5YWI5Yik5pat5piv5ZCm6IO95Yy56YWN5Yiw5ZSv5LiA55qEdXNlcu+8jOeEtuWQjuWIpOaWreivpeeUqOaIt+aYr2luc2VydOWIsHNwYWNlX3VzZXJz6L+Y5pivdXBkYXRlXHJcblx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXHJcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5faWRcclxuXHRcdFx0XHRzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcn0pXHJcblx0XHRcdFx0aWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcInVwZGF0ZVwiXHJcblx0XHRcdFx0ZWxzZSBpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDBcclxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwiaW5zZXJ0XCJcclxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAwXHJcblx0XHRcdFx0IyDmlrDlop5zcGFjZV91c2Vyc+eahOaVsOaNruagoemqjFxyXG5cdFx0XHRcdG9wZXJhdGluZyA9IFwiaW5zZXJ0XCJcclxuXHJcblx0XHRcdCMg5Yik5pat5piv5ZCm6IO95L+u5pS555So5oi355qE5a+G56CBXHJcblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgYW5kIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuZmV0Y2goKVswXS5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XHJcblxyXG5cdFx0XHQjIOWIpOaWremDqOmXqOaYr+WQpuWQiOeQhlxyXG5cdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxyXG5cclxuXHRcdFx0aWYgIW9yZ2FuaXphdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xyXG5cclxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcclxuXHJcblx0XHRcdGlmIG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPSByb290X29yZy5uYW1lXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XHJcblxyXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkICYmIHVzZXI/LnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XHJcblxyXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdGlmICFkZXB0X25hbWVcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xyXG5cclxuXHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxyXG5cdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XHJcblx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxyXG5cdFx0XHRcdGZ1bGxuYW1lID0gXCJcIlxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0XHRpZiBqID4gMFxyXG5cdFx0XHRcdFx0XHRpZiBqID09IDFcclxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lXHJcblxyXG5cdFx0XHRcdFx0XHRvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KS5jb3VudCgpXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBvcmdDb3VudCA9PSAwXHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpg6jpl6goI3tkZXB0X25hbWV9KeS4jeWtmOWcqO+8jOivt+WFiOWIm+W7ulwiKTtcclxuXHJcblx0XHRpZiBvbmx5Q2hlY2tcclxuXHRcdFx0cmV0dXJuIDtcclxuXHJcblx0XHQjIOaVsOaNruWvvOWFpVxyXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XHJcblx0XHRcdGVycm9yID0ge31cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0c2VsZWN0b3IgPSBbXVxyXG5cdFx0XHRcdG9wZXJhdGluZyA9IFwiXCJcclxuXHRcdFx0XHQjIGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHQjIFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XHJcblx0XHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxyXG5cdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxyXG5cdFx0XHRcdHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoeyRvcjogc2VsZWN0b3J9KVxyXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXHJcblx0XHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF1cclxuXHJcblx0XHRcdFx0bm93ID0gbmV3IERhdGUoKVxyXG5cclxuXHRcdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxyXG5cdFx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcclxuXHRcdFx0XHRiZWxvbmdPcmdpZHMgPSBbXVxyXG5cdFx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cclxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcclxuXHRcdFx0XHRcdGZ1bGxuYW1lID0gXCJcIlxyXG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRcdFx0aWYgaiA+IDBcclxuXHRcdFx0XHRcdFx0XHRpZiBqID09IDFcclxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxyXG5cclxuXHRcdFx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KVxyXG5cclxuXHRcdFx0XHRcdGlmIG9yZ1xyXG5cdFx0XHRcdFx0XHRiZWxvbmdPcmdpZHMucHVzaCBvcmcuX2lkXHJcblxyXG5cclxuXHRcdFx0XHR1c2VyX2lkID0gbnVsbFxyXG5cdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHVkb2MgPSB7fVxyXG5cdFx0XHRcdFx0dWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKClcclxuXHRcdFx0XHRcdHVkb2Muc3RlZWRvc19pZCA9IGl0ZW0uZW1haWwgfHwgdWRvYy5faWRcclxuXHRcdFx0XHRcdHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGVcclxuXHRcdFx0XHRcdHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdXHJcblx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0dWRvYy5uYW1lID0gaXRlbS5uYW1lXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHR1ZG9jLmVtYWlscyA9IFt7YWRkcmVzczogaXRlbS5lbWFpbCwgdmVyaWZpZWQ6IGZhbHNlfV1cclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0XHRcdHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLnBob25lID0ge1xyXG5cdFx0XHRcdFx0XHRcdG51bWJlcjogY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRtb2JpbGU6IGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHR2ZXJpZmllZDogZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogbm93XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYylcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXHJcblx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcclxuXHJcblx0XHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0pXHJcblxyXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGlmICFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnNcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXVxyXG5cclxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge31cclxuXHJcblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSlcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSwgeyRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY30pXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIiBvciBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIlxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LHskc2V0Ont1c2VybmFtZTogaXRlbS51c2VybmFtZX19KVxyXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcclxuXHRcdFx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0c3VfZG9jID0ge31cclxuXHRcdFx0XHRcdFx0c3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0XHRzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZFxyXG5cclxuXHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSAgdHJ1ZVxyXG5cdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiXHJcblxyXG5cdFx0XHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIlxyXG5cclxuXHRcdFx0XHRcdFx0c3VfZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXVxyXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkc1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYgdXNlcl9pZFxyXG5cdFx0XHRcdFx0XHRcdHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7IGZpZWxkczogeyB1c2VybmFtZTogMSB9IH0pXHJcblx0XHRcdFx0XHRcdFx0aWYgdXNlckluZm8udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lXHJcblxyXG5cdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0ZXJyb3IubGluZSA9IGkrMVxyXG5cdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvblxyXG5cdFx0XHRcdGVycm9yTGlzdC5wdXNoKGVycm9yKVxyXG5cclxuXHRcdHJldHVybiBlcnJvckxpc3RcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuXG4gIC8qXG4gIFx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG4gIFx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHRUT0RPOiDlm73pmYXljJZcbiAgICovXG4gIGltcG9ydF91c2VyczogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjaykge1xuICAgIHZhciBfc2VsZiwgYWNjZXB0ZWRfdXNlcl9jb3VudCwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VyTG9jYWxlLCBjdXJyZW50VXNlclBob25lUHJlZml4LCBlcnJvckxpc3QsIG93bmVyX2lkLCByb290X29yZywgc3BhY2UsIHRlc3REYXRhO1xuICAgIF9zZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UgfHwgIShzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLln7rnoYDniYjkuI3mlK/mjIHmraTlip/og71cIik7XG4gICAgfVxuICAgIGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZS5faWQsXG4gICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgfSkuY291bnQoKTtcbiAgICBpZiAoKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgKFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezXCIgKyAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSArIFwiKOW9k+WJjVwiICsgc3BhY2UudXNlcl9saW1pdCArIFwiKVwiKSArIFwiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIik7XG4gICAgfVxuICAgIG93bmVyX2lkID0gc3BhY2Uub3duZXI7XG4gICAgdGVzdERhdGEgPSBbXTtcbiAgICBlcnJvckxpc3QgPSBbXTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBfc2VsZi51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgbG9jYWxlOiAxLFxuICAgICAgICBwaG9uZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlO1xuICAgIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggPSBBY2NvdW50cy5nZXRQaG9uZVByZWZpeChjdXJyZW50VXNlcik7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBtdWx0aU9yZ3MsIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBvcmdhbml6YXRpb25fZGVwdHMsIHBob25lTnVtYmVyLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlbGVjdG9yLCBzcGFjZVVzZXJFeGlzdCwgdGVzdE9iaiwgdXNlciwgdXNlckV4aXN0O1xuICAgICAgaWYgKCFpdGVtLnBob25lICYmICFpdGVtLmVtYWlsKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICB0ZXN0T2JqID0ge307XG4gICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICB0ZXN0T2JqLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICB0ZXN0T2JqLnBob25lID0gaXRlbS5waG9uZTtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumCruS7tuagvOW8j+mUmeivr1wiICsgaXRlbS5lbWFpbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcImVtYWlsXCIsIGl0ZW0uZW1haWwpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumCruS7tumHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlbS5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgdGVzdERhdGEucHVzaCh0ZXN0T2JqKTtcbiAgICAgIHNlbGVjdG9yID0gW107XG4gICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgdXNlcm5hbWU6IGl0ZW0udXNlcm5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICBwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lO1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlclxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5faWQ7XG4gICAgICAgIHNwYWNlVXNlckV4aXN0ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgb3BlcmF0aW5nID0gXCJ1cGRhdGVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09PSAwKSB7XG4gICAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICBvcGVyYXRpbmcgPSBcImluc2VydFwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQgJiYgdXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgaWYgKChyZWYgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICBpZiAoIW9yZ2FuaXphdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XG4gICAgICBpZiAob3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9PSByb290X29yZy5uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQgJiYgKHVzZXIgIT0gbnVsbCA/IChyZWYyID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICBpZiAoIWRlcHRfbmFtZSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICByZXR1cm4gbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgdmFyIGZ1bGxuYW1lO1xuICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgIHJldHVybiBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICB2YXIgb3JnQ291bnQ7XG4gICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICBpZiAoaiA9PT0gMSkge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9yZ0NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAob3JnQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6goXCIgKyBkZXB0X25hbWUgKyBcIinkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChvbmx5Q2hlY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBiZWxvbmdPcmdpZHMsIGUsIGVycm9yLCBtdWx0aU9yZ3MsIG5vdywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIHBob25lTnVtYmVyLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlckluZm8sIHVzZXJfaWQ7XG4gICAgICBlcnJvciA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgcGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZTtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIFwicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7XG4gICAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXJFeGlzdC5jb3VudCgpID4gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKTtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXTtcbiAgICAgICAgfVxuICAgICAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvbjtcbiAgICAgICAgbXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgYmVsb25nT3JnaWRzID0gW107XG4gICAgICAgIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgICAgdmFyIGZ1bGxuYW1lLCBvcmcsIG9yZ2FuaXphdGlvbl9kZXB0cztcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICBpZiAoaiA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBiZWxvbmdPcmdpZHMucHVzaChvcmcuX2lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB1c2VyX2lkID0gbnVsbDtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdWRvYyA9IHt9O1xuICAgICAgICAgIHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgIHVkb2Muc3RlZWRvc19pZCA9IGl0ZW0uZW1haWwgfHwgdWRvYy5faWQ7XG4gICAgICAgICAgdWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZTtcbiAgICAgICAgICB1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXTtcbiAgICAgICAgICBpZiAoaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICB1ZG9jLmVtYWlscyA9IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGl0ZW0uZW1haWwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgIHVkb2MucGhvbmUgPSB7XG4gICAgICAgICAgICAgIG51bWJlcjogY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmUsXG4gICAgICAgICAgICAgIG1vYmlsZTogaXRlbS5waG9uZSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICBtb2RpZmllZDogbm93XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpO1xuICAgICAgICAgIGlmIChpdGVtLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgIGxvZ291dDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzcGFjZV91c2VyKSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoIXNwYWNlX3VzZXIub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9O1xuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm9yZ2FuaXphdGlvbnMgPSBfLnVuaXEoc3BhY2VfdXNlci5vcmdhbml6YXRpb25zLmNvbmNhdChiZWxvbmdPcmdpZHMpKTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGFueSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS53b3JrX3Bob25lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5zb3J0X25vKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZGIuc3BhY2VfdXNlcnMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDogc3BhY2VfdXNlcl91cGRhdGVfZG9jXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIiB8fCBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi36L+Y5pyq5o6l5Y+X5Yqg5YWl5bel5L2c5Yy677yM5LiN6IO95L+u5pS55LuW55qE5Liq5Lq65L+h5oGvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiB1c2VyX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZTogaXRlbS51c2VybmFtZVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChpdGVtLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgICAgIGxvZ291dDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN1X2RvYyA9IHt9O1xuICAgICAgICAgICAgc3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICAgIHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIjtcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF07XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkcztcbiAgICAgICAgICAgIGlmIChpdGVtLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS53b3JrX3Bob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5zb3J0X25vKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGFueSkge1xuICAgICAgICAgICAgICBzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1c2VyX2lkKSB7XG4gICAgICAgICAgICAgIHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICh1c2VySW5mby51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIHN1X2RvYy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgZXJyb3IubGluZSA9IGkgKyAxO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gZS5yZWFzb247XG4gICAgICAgIHJldHVybiBlcnJvckxpc3QucHVzaChlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVycm9yTGlzdDtcbiAgfVxufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlIFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgKHJlcSwgcmVzLCBuZXh0KS0+XHJcblx0XHR0cnlcclxuXHRcdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cclxuXHRcdFx0cXVlcnkgPSByZXEucXVlcnlcclxuXHRcdFx0c3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZFxyXG5cdFx0XHRvcmdfaWQgPSBxdWVyeS5vcmdfaWRcclxuXHRcdFx0dXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDpvcmdfaWR9LHtmaWVsZHM6e2Z1bGxuYW1lOjF9fSlcclxuXHRcdFx0dXNlcnNfdG9feGxzID0gbmV3IEFycmF5XHJcblx0XHRcdG5vdyA9IG5ldyBEYXRlIFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCx1c2VyX2lkKVxyXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0c29ydDoge25hbWU6IDF9XHJcblx0XHRcdFx0fSkuZmV0Y2goKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3JnX2lkcyA9IFtdXHJcblx0XHRcdFx0b3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDpvcmdfaWQsc3BhY2U6c3BhY2VfaWR9LHtmaWVsZHM6e19pZDoxLGNoaWxkcmVuOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRcdG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCdfaWQnKVxyXG5cdFx0XHRcdF8uZWFjaCBvcmdfb2Jqcywob3JnX29iaiktPlxyXG5cdFx0XHRcdFx0b3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcyxvcmdfb2JqPy5jaGlsZHJlbilcclxuXHRcdFx0XHRfLnVuaXEob3JnX2lkcylcclxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZCxvcmdhbml6YXRpb25zOnskaW46b3JnX2lkc319LHtzb3J0OiB7c29ydF9ubzogLTEsbmFtZToxfX0pLmZldGNoKClcclxuXHRcdFx0ZWpzID0gcmVxdWlyZSgnZWpzJylcclxuXHRcdFx0c3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpXHJcblx0XHRcdFxyXG5cdFx0XHQjIOajgOa1i+aYr+WQpuacieivreazlemUmeivr1xyXG5cdFx0XHRlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKVxyXG5cdFx0XHRlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSlcclxuXHRcdFx0aWYgZXJyb3Jfb2JqXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJvcl9vYmpcclxuXHJcblx0XHRcdHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKVxyXG5cclxuXHRcdFx0bGFuZyA9ICdlbidcclxuXHRcdFx0aWYgY3VycmVudF91c2VyX2luZm8ubG9jYWxlIGlzICd6aC1jbidcclxuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xyXG5cclxuXHRcdFx0b3JnTmFtZSA9IGlmIG9yZyB0aGVuIG9yZy5mdWxsbmFtZSBlbHNlIG9yZ19pZFxyXG5cdFx0XHRmaWVsZHMgPSBbe1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOiduYW1lJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidtb2JpbGUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3dvcmtfcGhvbmUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidlbWFpbCcsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidjb21wYW55JyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZToncG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonb3JnYW5pemF0aW9ucycsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLHt9LGxhbmcpLFxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0b3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjogdmFsdWV9fSx7ZmllbGRzOiB7ZnVsbG5hbWU6IDF9fSkubWFwKChpdGVtLGluZGV4KS0+XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uZnVsbG5hbWVcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIilcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbWFuYWdlcicsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7bmFtZTogMX19KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8ubmFtZVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid1c2VyJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7dXNlcm5hbWU6IDF9fSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/LnVzZXJuYW1lXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnTnVtYmVyJyxcclxuXHRcdFx0XHRcdG5hbWU6J3NvcnRfbm8nLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3VzZXJfYWNjZXB0ZWQnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgdGhlbiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycse30sbGFuZykgZWxzZSBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH1dXHJcblx0XHRcdFxyXG5cdFx0XHRzaGVldF9uYW1lID0gb3JnTmFtZT8ucmVwbGFjZSgvXFwvL2csXCItXCIpICPkuI3mlK/mjIFcIi9cIuespuWPt1xyXG5cdFx0XHRyZXQgPSB0ZW1wbGF0ZSh7XHJcblx0XHRcdFx0bGFuZzogbGFuZyxcclxuXHRcdFx0XHRzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxyXG5cdFx0XHRcdGZpZWxkczogZmllbGRzLFxyXG5cdFx0XHRcdHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcclxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiK2VuY29kZVVSSShmaWxlTmFtZSkpXHJcblx0XHRcdHJlcy5lbmQocmV0KVxyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdFx0cmVzLmVuZChlLm1lc3NhZ2UpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBlanMsIGVqc0xpbnQsIGVycm9yX29iaiwgZmllbGRzLCBmaWxlTmFtZSwgbGFuZywgbm93LCBvcmcsIG9yZ05hbWUsIG9yZ19pZCwgb3JnX2lkcywgb3JnX29ianMsIHF1ZXJ5LCByZXQsIHNoZWV0X25hbWUsIHNwYWNlX2lkLCBzdHIsIHRlbXBsYXRlLCB1c2VyX2lkLCB1c2Vyc190b194bHM7XG4gICAgdHJ5IHtcbiAgICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgICAgIHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWQ7XG4gICAgICBvcmdfaWQgPSBxdWVyeS5vcmdfaWQ7XG4gICAgICB1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddO1xuICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvcmdfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB1c2Vyc190b194bHMgPSBuZXcgQXJyYXk7XG4gICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcl9pZCkpIHtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3JnX2lkcyA9IFtdO1xuICAgICAgICBvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgX2lkOiBvcmdfaWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywgJ19pZCcpO1xuICAgICAgICBfLmVhY2gob3JnX29ianMsIGZ1bmN0aW9uKG9yZ19vYmopIHtcbiAgICAgICAgICByZXR1cm4gb3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcywgb3JnX29iaiAhPSBudWxsID8gb3JnX29iai5jaGlsZHJlbiA6IHZvaWQgMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBfLnVuaXEob3JnX2lkcyk7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkaW46IG9yZ19pZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAtMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBlanMgPSByZXF1aXJlKCdlanMnKTtcbiAgICAgIHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKTtcbiAgICAgIGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpO1xuICAgICAgZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pO1xuICAgICAgaWYgKGVycm9yX29iaikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yX29iaik7XG4gICAgICB9XG4gICAgICB0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cik7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmIChjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICBvcmdOYW1lID0gb3JnID8gb3JnLmZ1bGxuYW1lIDogb3JnX2lkO1xuICAgICAgZmllbGRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21vYmlsZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnd29ya19waG9uZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2NvbXBhbnknLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdwb3NpdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25zJyxcbiAgICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBvcmdOYW1lcztcbiAgICAgICAgICAgIG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiB2YWx1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mdWxsbmFtZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtYW5hZ2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci51c2VybmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICAgICAgICBuYW1lOiAnc29ydF9ubycsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcl9hY2NlcHRlZCcsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBzaGVldF9uYW1lID0gb3JnTmFtZSAhPSBudWxsID8gb3JnTmFtZS5yZXBsYWNlKC9cXC8vZywgXCItXCIpIDogdm9pZCAwO1xuICAgICAgcmV0ID0gdGVtcGxhdGUoe1xuICAgICAgICBsYW5nOiBsYW5nLFxuICAgICAgICBzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgdXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcbiAgICAgIH0pO1xuICAgICAgZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIjtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIgKyBlbmNvZGVVUkkoZmlsZU5hbWUpKTtcbiAgICAgIHJldHVybiByZXMuZW5kKHJldCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gcmVzLmVuZChlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
