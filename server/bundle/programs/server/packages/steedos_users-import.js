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
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:users-import":{"checkNpm.js":function module(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_users-import/checkNpm.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"import_users.coffee":function module(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_users-import/server/methods/import_users.coffee                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    var _self, accepted_user_count, currentUser, currentUserLocale, errorList, owner_id, root_org, space, testData;

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

    if (!Steedos.hasFeature('paid', space != null ? space._id : void 0)) {
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
    data.forEach(function (item, i) {
      var multiOrgs, operating, organization, organization_depts, ref, ref1, ref2, ref3, selector, spaceUserExist, testObj, user, userExist;

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
          email: item.email
        });
      }

      if (item.phone) {
        selector.push({
          mobile: item.phone
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
      var belongOrgids, e, error, multiOrgs, now, operating, organization, selector, space_user, space_user_update_doc, su_doc, udoc, user, userExist, userInfo, user_id;
      error = {};

      try {
        selector = [];
        operating = "";

        if (item.email) {
          selector.push({
            email: item.email
          });
        }

        if (item.phone) {
          selector.push({
            mobile: item.phone
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
            udoc.email = item.email;
            udoc.email_verified = false;
          }

          if (item.username) {
            udoc.username = item.username;
          }

          if (item.phone) {
            udoc.mobile = item.phone;
            udoc.mobile_verified = false;
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

              su_doc.user = user_id;
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"routes":{"api_space_users_export.coffee":function module(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_users-import/routes/api_space_users_export.coffee                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImVycm9yTGlzdCIsIm93bmVyX2lkIiwicm9vdF9vcmciLCJzcGFjZSIsInRlc3REYXRhIiwidXNlcklkIiwiRXJyb3IiLCJkYiIsIm9yZ2FuaXphdGlvbnMiLCJmaW5kT25lIiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsIl9pZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJtdWx0aU9yZ3MiLCJvcGVyYXRpbmciLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25fZGVwdHMiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIm1vYmlsZSIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlsX3ZlcmlmaWVkIiwibW9iaWxlX3ZlcmlmaWVkIiwiaW5zZXJ0IiwiQWNjb3VudHMiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIl8iLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwic3RhcnR1cCIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImVqcyIsImVqc0xpbnQiLCJlcnJvcl9vYmoiLCJmaWxlTmFtZSIsImxhbmciLCJvcmdOYW1lIiwib3JnX2lkIiwib3JnX2lkcyIsIm9yZ19vYmpzIiwicXVlcnkiLCJyZXQiLCJzaGVldF9uYW1lIiwic3RyIiwidGVtcGxhdGUiLCJ1c2Vyc190b194bHMiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsIkFycmF5IiwiaXNTcGFjZUFkbWluIiwic29ydCIsImNoaWxkcmVuIiwicGx1Y2siLCJlYWNoIiwib3JnX29iaiIsInVuaW9uIiwiJGluIiwicmVxdWlyZSIsIkFzc2V0cyIsImdldFRleHQiLCJsaW50IiwiY29uc29sZSIsImNvbXBpbGUiLCJ0eXBlIiwid2lkdGgiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRyYW5zZm9ybSIsInZhbHVlIiwib3JnTmFtZXMiLCJtYXAiLCJpbmRleCIsImpvaW4iLCJyZXBsYWNlIiwibW9tZW50IiwiZm9ybWF0Iiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiZW5kIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsU0FBTyxRQURTO0FBRWhCLGNBQVk7QUFGSSxDQUFELEVBR2Isc0JBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREFJLE9BQU9DLE9BQVAsQ0FDQztBQUFBOzs7Ozs7S0FPQUMsY0FBYyxVQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0JDLElBQXBCLEVBQTBCQyxTQUExQjtBQUViLFFBQUFDLEtBQUEsRUFBQUMsbUJBQUEsRUFBQUMsV0FBQSxFQUFBQyxpQkFBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLFFBQUE7O0FBQUFSLFlBQVEsSUFBUjs7QUFFQSxRQUFHLENBQUMsS0FBS1MsTUFBVDtBQUNDLFlBQU0sSUFBSWhCLE9BQU9pQixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLE1BQXRCLENBQU47QUNDRTs7QURD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LENDeURHO0FBQ0Q7QUR4TEosSUNBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwiZWpzXCI6IFwiXjIuNS41XCIsXG5cdFwiZWpzLWxpbnRcIjogXCJeMC4yLjBcIlxufSwgJ3N0ZWVkb3M6dXNlcnMtaW1wb3J0Jyk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIyNcblx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcblx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0VE9ETzog5Zu96ZmF5YyWXG5cdCMjI1xuXHRpbXBvcnRfdXNlcnM6IChzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKS0+XG5cblx0XHRfc2VsZiA9IHRoaXNcblxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpXG5cblx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBwYXJlbnQ6IG51bGx9KVxuXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlPy5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XG5cblx0XHRpZiAhU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2U/Ll9pZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWfuuehgOeJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcblxuXHRcdGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2UuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdGlmIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezI3thY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGh9KOW9k+WJjSN7c3BhY2UudXNlcl9saW1pdH0pXCIgK1wiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIilcblxuXHRcdG93bmVyX2lkID0gc3BhY2Uub3duZXJcblxuXHRcdHRlc3REYXRhID0gW11cblxuXHRcdGVycm9yTGlzdCA9IFtdXG5cblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogX3NlbGYudXNlcklkfSx7ZmllbGRzOntsb2NhbGU6MSxwaG9uZToxfX0pXG5cdFx0Y3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGVcblxuXHRcdCMg5pWw5o2u57uf5LiA5qCh6aqMXG5cblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cblx0XHRcdCMgY29uc29sZS5sb2cgaXRlbVxuXHRcdFx0IyDnlKjmiLflkI3vvIzmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcblx0XHRcdGlmICFpdGVtLnBob25lIGFuZCAhaXRlbS5lbWFpbFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpXG5cblx0XHRcdCMg5Yik5patZXhjZWzkuK3nmoTmlbDmja7vvIznlKjmiLflkI3jgIHmiYvmnLrlj7fnrYnkv6Hmga/mmK/lkKbmnInor69cblx0XHRcdHRlc3RPYmogPSB7fVxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHR0ZXN0T2JqLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDBcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcblxuXHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHR0ZXN0T2JqLnBob25lID0gaXRlbS5waG9uZVxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDBcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcblxuXHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vI3tpdGVtLmVtYWlsfVwiKTtcblxuXHRcdFx0XHR0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbFxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcImVtYWlsXCIsIGl0ZW0uZW1haWwpLmxlbmd0aCA+IDBcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tumHjeWkjVwiKTtcblxuXHRcdFx0aXRlbS5zcGFjZSA9IHNwYWNlX2lkXG5cblx0XHRcdHRlc3REYXRhLnB1c2godGVzdE9iailcblxuXHRcdFx0IyDojrflj5bmn6Xmib51c2Vy55qE5p2h5Lu2XG5cdFx0XHRzZWxlY3RvciA9IFtdXG5cdFx0XHRvcGVyYXRpbmcgPSBcIlwiXG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxuXHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtlbWFpbDogaXRlbS5lbWFpbH1cblx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7bW9iaWxlOiBpdGVtLnBob25lfVxuXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblxuXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxuXHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZFxuXHRcdFx0XHRzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcn0pXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwidXBkYXRlXCJcblx0XHRcdFx0ZWxzZSBpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0IyDmlrDlop5zcGFjZV91c2Vyc+eahOaVsOaNruagoemqjFxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cblx0XHRcdCMg5Yik5pat5piv5ZCm6IO95L+u5pS555So5oi355qE5a+G56CBXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG5cblx0XHRcdCMg5Yik5pat6YOo6Zeo5piv5ZCm5ZCI55CGXG5cdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXG5cdFx0XHRpZiAhb3JnYW5pemF0aW9uXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcblxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcblxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0aWYgIWRlcHRfbmFtZVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xuXG5cdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcblx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdFx0aWYgaiA+IDBcblx0XHRcdFx0XHRcdGlmIGogPT0gMVxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcblxuXHRcdFx0XHRcdFx0b3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSkuY291bnQoKVxuXG5cdFx0XHRcdFx0XHRpZiBvcmdDb3VudCA9PSAwXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6ZeoKCN7ZGVwdF9uYW1lfSnkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XG5cblx0XHRpZiBvbmx5Q2hlY2tcblx0XHRcdHJldHVybiA7XG5cblx0XHQjIOaVsOaNruWvvOWFpVxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxuXHRcdFx0ZXJyb3IgPSB7fVxuXHRcdFx0dHJ5XG5cdFx0XHRcdHNlbGVjdG9yID0gW11cblx0XHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0XHQjIGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxuXHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7ZW1haWw6IGl0ZW0uZW1haWx9XG5cdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHttb2JpbGU6IGl0ZW0ucGhvbmV9XG5cdFx0XHRcdHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoeyRvcjogc2VsZWN0b3J9KVxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcblx0XHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdXG5cblx0XHRcdFx0bm93ID0gbmV3IERhdGUoKVxuXG5cdFx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXG5cdFx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcblx0XHRcdFx0YmVsb25nT3JnaWRzID0gW11cblx0XHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcblx0XHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxuXHRcdFx0XHRcdFx0aWYgaiA+IDBcblx0XHRcdFx0XHRcdFx0aWYgaiA9PSAxXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxuXG5cdFx0XHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pXG5cblx0XHRcdFx0XHRpZiBvcmdcblx0XHRcdFx0XHRcdGJlbG9uZ09yZ2lkcy5wdXNoIG9yZy5faWRcblxuXG5cdFx0XHRcdHVzZXJfaWQgPSBudWxsXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHR1c2VyX2lkID0gdXNlci5faWRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHVkb2MgPSB7fVxuXHRcdFx0XHRcdHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0dWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZFxuXHRcdFx0XHRcdHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGVcblx0XHRcdFx0XHR1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXVxuXHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dWRvYy5uYW1lID0gaXRlbS5uYW1lXG5cblx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHR1ZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbF92ZXJpZmllZCA9IGZhbHNlXG5cblx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHR1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0dWRvYy5tb2JpbGUgPSBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHR1ZG9jLm1vYmlsZV92ZXJpZmllZCA9IGZhbHNlXG5cdFx0XHRcdFx0dXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxuXHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxuXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9KVxuXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0aWYgIXNwYWNlX3VzZXIub3JnYW5pemF0aW9uc1xuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXVxuXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fVxuXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cblxuXHRcdFx0XHRcdFx0aWYgXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy51cGRhdGUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHskc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2N9KVxuXG5cdFx0XHRcdFx0XHRpZiBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIiBvciBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIilcblx0XHRcdFx0XHRcdGVsc2VcbiNcdFx0XHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcbiNcdFx0XHRcdFx0XHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LHskc2V0Ont1c2VybmFtZTogaXRlbS51c2VybmFtZX19KVxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXG5cdFx0XHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0c3VfZG9jID0ge31cblx0XHRcdFx0XHRcdHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHRcdHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkXG5cblx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gIHRydWVcblx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCJcblxuXHRcdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIlxuXG5cdFx0XHRcdFx0XHRzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkc1xuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0c3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiB1c2VyX2lkXG5cdFx0XHRcdFx0XHRcdHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7IGZpZWxkczogeyB1c2VybmFtZTogMSB9IH0pXG5cdFx0XHRcdFx0XHRcdGlmIHVzZXJJbmZvLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWVcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXIgPSB1c2VyX2lkXG5cblx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGVycm9yLmxpbmUgPSBpKzFcblx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9IGUucmVhc29uXG5cdFx0XHRcdGVycm9yTGlzdC5wdXNoKGVycm9yKVxuXG5cdFx0cmV0dXJuIGVycm9yTGlzdFxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuXG4gIC8qXG4gIFx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG4gIFx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHRUT0RPOiDlm73pmYXljJZcbiAgICovXG4gIGltcG9ydF91c2VyczogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjaykge1xuICAgIHZhciBfc2VsZiwgYWNjZXB0ZWRfdXNlcl9jb3VudCwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VyTG9jYWxlLCBlcnJvckxpc3QsIG93bmVyX2lkLCByb290X29yZywgc3BhY2UsIHRlc3REYXRhO1xuICAgIF9zZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UgfHwgIShzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcbiAgICB9XG4gICAgaWYgKCFTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZSAhPSBudWxsID8gc3BhY2UuX2lkIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Z+656GA54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuICAgIH1cbiAgICBhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2UuX2lkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgIH0pLmNvdW50KCk7XG4gICAgaWYgKChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIChcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHs1wiICsgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgKyBcIijlvZPliY1cIiArIHNwYWNlLnVzZXJfbGltaXQgKyBcIilcIikgKyBcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpO1xuICAgIH1cbiAgICBvd25lcl9pZCA9IHNwYWNlLm93bmVyO1xuICAgIHRlc3REYXRhID0gW107XG4gICAgZXJyb3JMaXN0ID0gW107XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogX3NlbGYudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGxvY2FsZTogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIG11bHRpT3Jncywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIG9yZ2FuaXphdGlvbl9kZXB0cywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgZW1haWw6IGl0ZW0uZW1haWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgaWYgKCFkZXB0X25hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgcmV0dXJuIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgIHZhciBmdWxsbmFtZTtcbiAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgdmFyIG9yZ0NvdW50O1xuICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKG9yZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6ZeoKFwiICsgZGVwdF9uYW1lICsgXCIp5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAob25seUNoZWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgYmVsb25nT3JnaWRzLCBlLCBlcnJvciwgbXVsdGlPcmdzLCBub3csIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlckluZm8sIHVzZXJfaWQ7XG4gICAgICBlcnJvciA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIGVtYWlsOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIG1vYmlsZTogaXRlbS5waG9uZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF07XG4gICAgICAgIH1cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgIGJlbG9uZ09yZ2lkcyA9IFtdO1xuICAgICAgICBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICAgIHZhciBmdWxsbmFtZSwgb3JnLCBvcmdhbml6YXRpb25fZGVwdHM7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVsb25nT3JnaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVkb2MgPSB7fTtcbiAgICAgICAgICB1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICB1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkO1xuICAgICAgICAgIHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGU7XG4gICAgICAgICAgdWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF07XG4gICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgdWRvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgdWRvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB1ZG9jLmVtYWlsX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgICBzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCI7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdO1xuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHM7XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcl9pZCkge1xuICAgICAgICAgICAgICB1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlckluZm8udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdV9kb2MudXNlciA9IHVzZXJfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgZXJyb3IubGluZSA9IGkgKyAxO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gZS5yZWFzb247XG4gICAgICAgIHJldHVybiBlcnJvckxpc3QucHVzaChlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVycm9yTGlzdDtcbiAgfVxufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSBcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCktPlxuXHRcdHRyeVxuXHRcdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXG5cdFx0XHRxdWVyeSA9IHJlcS5xdWVyeVxuXHRcdFx0c3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZFxuXHRcdFx0b3JnX2lkID0gcXVlcnkub3JnX2lkXG5cdFx0XHR1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddXG5cdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDpvcmdfaWR9LHtmaWVsZHM6e2Z1bGxuYW1lOjF9fSlcblx0XHRcdHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheVxuXHRcdFx0bm93ID0gbmV3IERhdGUgXG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCx1c2VyX2lkKVxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHNvcnQ6IHtuYW1lOiAxfVxuXHRcdFx0XHR9KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9yZ19pZHMgPSBbXVxuXHRcdFx0XHRvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOm9yZ19pZCxzcGFjZTpzcGFjZV9pZH0se2ZpZWxkczp7X2lkOjEsY2hpbGRyZW46MX19KS5mZXRjaCgpXG5cdFx0XHRcdG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCdfaWQnKVxuXHRcdFx0XHRfLmVhY2ggb3JnX29ianMsKG9yZ19vYmopLT5cblx0XHRcdFx0XHRvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLG9yZ19vYmo/LmNoaWxkcmVuKVxuXHRcdFx0XHRfLnVuaXEob3JnX2lkcylcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWQsb3JnYW5pemF0aW9uczp7JGluOm9yZ19pZHN9fSx7c29ydDoge3NvcnRfbm86IC0xLG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlanMgPSByZXF1aXJlKCdlanMnKVxuXHRcdFx0c3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpXG5cdFx0XHRcblx0XHRcdCMg5qOA5rWL5piv5ZCm5pyJ6K+t5rOV6ZSZ6K+vXG5cdFx0XHRlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKVxuXHRcdFx0ZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pXG5cdFx0XHRpZiBlcnJvcl9vYmpcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3Jfb2JqXG5cblx0XHRcdHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKVxuXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgY3VycmVudF91c2VyX2luZm8ubG9jYWxlIGlzICd6aC1jbidcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcblxuXHRcdFx0b3JnTmFtZSA9IGlmIG9yZyB0aGVuIG9yZy5mdWxsbmFtZSBlbHNlIG9yZ19pZFxuXHRcdFx0ZmllbGRzID0gW3tcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOiduYW1lJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J21vYmlsZScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid3b3JrX3Bob25lJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidlbWFpbCcsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J2NvbXBhbnknLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J3Bvc2l0aW9uJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonb3JnYW5pemF0aW9ucycsXG5cdFx0XHRcdFx0d2lkdGg6IDYwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycse30sbGFuZyksXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHZhbHVlfX0se2ZpZWxkczoge2Z1bGxuYW1lOiAxfX0pLm1hcCgoaXRlbSxpbmRleCktPlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5mdWxsbmFtZVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0cmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J21hbmFnZXInLFxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHtuYW1lOiAxfX0pXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8ubmFtZVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid1c2VyJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge3VzZXJuYW1lOiAxfX0pXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8udXNlcm5hbWVcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ051bWJlcicsXG5cdFx0XHRcdFx0bmFtZTonc29ydF9ubycsXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid1c2VyX2FjY2VwdGVkJyxcblx0XHRcdFx0XHR3aWR0aDogMzUsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHJldHVybiBpZiB2YWx1ZSB0aGVuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJyx7fSxsYW5nKSBlbHNlIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLHt9LGxhbmcpXG5cdFx0XHRcdH1dXG5cdFx0XHRcblx0XHRcdHNoZWV0X25hbWUgPSBvcmdOYW1lPy5yZXBsYWNlKC9cXC8vZyxcIi1cIikgI+S4jeaUr+aMgVwiL1wi56ym5Y+3XG5cdFx0XHRyZXQgPSB0ZW1wbGF0ZSh7XG5cdFx0XHRcdGxhbmc6IGxhbmcsXG5cdFx0XHRcdHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG5cdFx0XHRcdGZpZWxkczogZmllbGRzLFxuXHRcdFx0XHR1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuXHRcdFx0fSlcblxuXHRcdFx0ZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIlxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKVxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiK2VuY29kZVVSSShmaWxlTmFtZSkpXG5cdFx0XHRyZXMuZW5kKHJldClcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRcdHJlcy5lbmQoZS5tZXNzYWdlKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjdXJyZW50X3VzZXJfaW5mbywgZSwgZWpzLCBlanNMaW50LCBlcnJvcl9vYmosIGZpZWxkcywgZmlsZU5hbWUsIGxhbmcsIG5vdywgb3JnLCBvcmdOYW1lLCBvcmdfaWQsIG9yZ19pZHMsIG9yZ19vYmpzLCBxdWVyeSwgcmV0LCBzaGVldF9uYW1lLCBzcGFjZV9pZCwgc3RyLCB0ZW1wbGF0ZSwgdXNlcl9pZCwgdXNlcnNfdG9feGxzO1xuICAgIHRyeSB7XG4gICAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgICAgcXVlcnkgPSByZXEucXVlcnk7XG4gICAgICBzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkO1xuICAgICAgb3JnX2lkID0gcXVlcnkub3JnX2lkO1xuICAgICAgdXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogb3JnX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcnNfdG9feGxzID0gbmV3IEFycmF5O1xuICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJfaWQpKSB7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yZ19pZHMgPSBbXTtcbiAgICAgICAgb3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIF9pZDogb3JnX2lkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBjaGlsZHJlbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgb3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsICdfaWQnKTtcbiAgICAgICAgXy5lYWNoKG9yZ19vYmpzLCBmdW5jdGlvbihvcmdfb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsIG9yZ19vYmogIT0gbnVsbCA/IG9yZ19vYmouY2hpbGRyZW4gOiB2b2lkIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgXy51bmlxKG9yZ19pZHMpO1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGluOiBvcmdfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgc29ydF9ubzogLTEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgZWpzID0gcmVxdWlyZSgnZWpzJyk7XG4gICAgICBzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJyk7XG4gICAgICBlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKTtcbiAgICAgIGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KTtcbiAgICAgIGlmIChlcnJvcl9vYmopIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcl9vYmopO1xuICAgICAgfVxuICAgICAgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpO1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAoY3VycmVudF91c2VyX2luZm8ubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgb3JnTmFtZSA9IG9yZyA/IG9yZy5mdWxsbmFtZSA6IG9yZ19pZDtcbiAgICAgIGZpZWxkcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtb2JpbGUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3dvcmtfcGhvbmUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdjb21wYW55JyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAncG9zaXRpb24nLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnb3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb3JnTmFtZXM7XG4gICAgICAgICAgICBvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZnVsbG5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbWFuYWdlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci5uYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgICAgbmFtZTogJ3NvcnRfbm8nLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXJfYWNjZXB0ZWQnLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgc2hlZXRfbmFtZSA9IG9yZ05hbWUgIT0gbnVsbCA/IG9yZ05hbWUucmVwbGFjZSgvXFwvL2csIFwiLVwiKSA6IHZvaWQgMDtcbiAgICAgIHJldCA9IHRlbXBsYXRlKHtcbiAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgc2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXG4gICAgICB9KTtcbiAgICAgIGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCI7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiICsgZW5jb2RlVVJJKGZpbGVOYW1lKSk7XG4gICAgICByZXR1cm4gcmVzLmVuZChyZXQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
