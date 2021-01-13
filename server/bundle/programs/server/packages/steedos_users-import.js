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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImVycm9yTGlzdCIsIm93bmVyX2lkIiwicm9vdF9vcmciLCJzcGFjZSIsInRlc3REYXRhIiwidXNlcklkIiwiRXJyb3IiLCJkYiIsIm9yZ2FuaXphdGlvbnMiLCJmaW5kT25lIiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsIl9pZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJtdWx0aU9yZ3MiLCJvcGVyYXRpbmciLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25fZGVwdHMiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIm1vYmlsZSIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlsX3ZlcmlmaWVkIiwibW9iaWxlX3ZlcmlmaWVkIiwiaW5zZXJ0IiwiQWNjb3VudHMiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIl8iLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwic3RhcnR1cCIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImVqcyIsImVqc0xpbnQiLCJlcnJvcl9vYmoiLCJmaWxlTmFtZSIsImxhbmciLCJvcmdOYW1lIiwib3JnX2lkIiwib3JnX2lkcyIsIm9yZ19vYmpzIiwicXVlcnkiLCJyZXQiLCJzaGVldF9uYW1lIiwic3RyIiwidGVtcGxhdGUiLCJ1c2Vyc190b194bHMiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsIkFycmF5IiwiaXNTcGFjZUFkbWluIiwic29ydCIsImNoaWxkcmVuIiwicGx1Y2siLCJlYWNoIiwib3JnX29iaiIsInVuaW9uIiwiJGluIiwicmVxdWlyZSIsIkFzc2V0cyIsImdldFRleHQiLCJsaW50IiwiY29uc29sZSIsImNvbXBpbGUiLCJ0eXBlIiwid2lkdGgiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRyYW5zZm9ybSIsInZhbHVlIiwib3JnTmFtZXMiLCJtYXAiLCJpbmRleCIsImpvaW4iLCJyZXBsYWNlIiwibW9tZW50IiwiZm9ybWF0Iiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiZW5kIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsU0FBTyxRQURTO0FBRWhCLGNBQVk7QUFGSSxDQUFELEVBR2Isc0JBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREFJLE9BQU9DLE9BQVAsQ0FDQztBQUFBOzs7Ozs7S0FPQUMsY0FBYyxVQUFDQyxRQUFELEVBQVdDLE9BQVgsRUFBb0JDLElBQXBCLEVBQTBCQyxTQUExQjtBQUViLFFBQUFDLEtBQUEsRUFBQUMsbUJBQUEsRUFBQUMsV0FBQSxFQUFBQyxpQkFBQSxFQUFBQyxTQUFBLEVBQUFDLFFBQUEsRUFBQUMsUUFBQSxFQUFBQyxLQUFBLEVBQUFDLFFBQUE7O0FBQUFSLFlBQVEsSUFBUjs7QUFFQSxRQUFHLENBQUMsS0FBS1MsTUFBVDtBQUNDLFlBQU0sSUFBSWhCLE9BQU9pQixLQUFYLENBQWlCLEdBQWpCLEVBQXNCLE1BQXRCLENBQU47QUNDRTs7QURD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LENDeURHO0FBQ0Q7QUR4TEosSUNBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxyXG5cdFwiZWpzLWxpbnRcIjogXCJeMC4yLjBcIlxyXG59LCAnc3RlZWRvczp1c2Vycy1pbXBvcnQnKTtcclxuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHQjIyNcclxuXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcclxuXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcclxuXHRcdFRPRE86IOWbvemZheWMllxyXG5cdCMjI1xyXG5cdGltcG9ydF91c2VyczogKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spLT5cclxuXHJcblx0XHRfc2VsZiA9IHRoaXNcclxuXHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpXHJcblxyXG5cdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgcGFyZW50OiBudWxsfSlcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZT8uYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XHJcblxyXG5cdFx0aWYgIVN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlPy5faWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWfuuehgOeJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcclxuXHJcblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdGlmIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7Mje2FjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aH0o5b2T5YmNI3tzcGFjZS51c2VyX2xpbWl0fSlcIiArXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKVxyXG5cclxuXHRcdG93bmVyX2lkID0gc3BhY2Uub3duZXJcclxuXHJcblx0XHR0ZXN0RGF0YSA9IFtdXHJcblxyXG5cdFx0ZXJyb3JMaXN0ID0gW11cclxuXHJcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogX3NlbGYudXNlcklkfSx7ZmllbGRzOntsb2NhbGU6MSxwaG9uZToxfX0pXHJcblx0XHRjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZVxyXG5cclxuXHRcdCMg5pWw5o2u57uf5LiA5qCh6aqMXHJcblxyXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XHJcblx0XHRcdCMgY29uc29sZS5sb2cgaXRlbVxyXG5cdFx0XHQjIOeUqOaIt+WQje+8jOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulxyXG5cdFx0XHRpZiAhaXRlbS5waG9uZSBhbmQgIWl0ZW0uZW1haWxcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpXHJcblxyXG5cdFx0XHQjIOWIpOaWrWV4Y2Vs5Lit55qE5pWw5o2u77yM55So5oi35ZCN44CB5omL5py65Y+3562J5L+h5oGv5piv5ZCm5pyJ6K+vXHJcblx0XHRcdHRlc3RPYmogPSB7fVxyXG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0dGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bmoLzlvI/plJnor68je2l0ZW0uZW1haWx9XCIpO1xyXG5cclxuXHRcdFx0XHR0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bph43lpI1cIik7XHJcblxyXG5cdFx0XHRpdGVtLnNwYWNlID0gc3BhY2VfaWRcclxuXHJcblx0XHRcdHRlc3REYXRhLnB1c2godGVzdE9iailcclxuXHJcblx0XHRcdCMg6I635Y+W5p+l5om+dXNlcueahOadoeS7tlxyXG5cdFx0XHRzZWxlY3RvciA9IFtdXHJcblx0XHRcdG9wZXJhdGluZyA9IFwiXCJcclxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxyXG5cdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7ZW1haWw6IGl0ZW0uZW1haWx9XHJcblx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHttb2JpbGU6IGl0ZW0ucGhvbmV9XHJcblxyXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHJcblxyXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxyXG5cdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkXHJcblx0XHRcdFx0c3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJ9KVxyXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJ1cGRhdGVcIlxyXG5cdFx0XHRcdGVsc2UgaWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAwXHJcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMFxyXG5cdFx0XHRcdCMg5paw5aKec3BhY2VfdXNlcnPnmoTmlbDmja7moKHpqoxcclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblxyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuiDveS/ruaUueeUqOaIt+eahOWvhueggVxyXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0aWYgdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0IyDliKTmlq3pg6jpl6jmmK/lkKblkIjnkIZcclxuXHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHJcblx0XHRcdGlmICFvcmdhbml6YXRpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcclxuXHJcblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XHJcblxyXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRpZiAhZGVwdF9uYW1lXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcclxuXHJcblx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcclxuXHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcclxuXHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdFx0aWYgaiA+IDBcclxuXHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0b3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSkuY291bnQoKVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgb3JnQ291bnQgPT0gMFxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6ZeoKCN7ZGVwdF9uYW1lfSnkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XHJcblxyXG5cdFx0aWYgb25seUNoZWNrXHJcblx0XHRcdHJldHVybiA7XHJcblxyXG5cdFx0IyDmlbDmja7lr7zlhaVcclxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxyXG5cdFx0XHRlcnJvciA9IHt9XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHNlbGVjdG9yID0gW11cclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcIlwiXHJcblx0XHRcdFx0IyBpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxyXG5cdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge2VtYWlsOiBpdGVtLmVtYWlsfVxyXG5cdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge21vYmlsZTogaXRlbS5waG9uZX1cclxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdXHJcblxyXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcclxuXHJcblx0XHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0YmVsb25nT3JnaWRzID0gW11cclxuXHRcdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XHJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXHJcblx0XHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0XHRcdGlmIGogPiAwXHJcblx0XHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHJcblx0XHRcdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSlcclxuXHJcblx0XHRcdFx0XHRpZiBvcmdcclxuXHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxyXG5cclxuXHJcblx0XHRcdFx0dXNlcl9pZCA9IG51bGxcclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR1ZG9jID0ge31cclxuXHRcdFx0XHRcdHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHR1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkXHJcblx0XHRcdFx0XHR1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlXHJcblx0XHRcdFx0XHR1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXVxyXG5cdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdHVkb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbF92ZXJpZmllZCA9IGZhbHNlXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0dWRvYy5tb2JpbGUgPSBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdHVkb2MubW9iaWxlX3ZlcmlmaWVkID0gZmFsc2VcclxuXHRcdFx0XHRcdHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYylcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXHJcblx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcclxuXHJcblx0XHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0pXHJcblxyXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdGlmICFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnNcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXVxyXG5cclxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge31cclxuXHJcblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSlcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSwgeyRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY30pXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIiBvciBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIlxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcbiNcdFx0XHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuI1x0XHRcdFx0XHRcdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0seyRzZXQ6e3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfX0pXHJcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRzdV9kb2MgPSB7fVxyXG5cdFx0XHRcdFx0XHRzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkXHJcblxyXG5cdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9ICB0cnVlXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCJcclxuXHJcblx0XHRcdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiXHJcblxyXG5cdFx0XHRcdFx0XHRzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZiB1c2VyX2lkXHJcblx0XHRcdFx0XHRcdFx0dXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHsgZmllbGRzOiB7IHVzZXJuYW1lOiAxIH0gfSlcclxuXHRcdFx0XHRcdFx0XHRpZiB1c2VySW5mby51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlciA9IHVzZXJfaWRcclxuXHJcblx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRlcnJvci5saW5lID0gaSsxXHJcblx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9IGUucmVhc29uXHJcblx0XHRcdFx0ZXJyb3JMaXN0LnB1c2goZXJyb3IpXHJcblxyXG5cdFx0cmV0dXJuIGVycm9yTGlzdFxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG5cbiAgLypcbiAgXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcbiAgXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdFRPRE86IOWbvemZheWMllxuICAgKi9cbiAgaW1wb3J0X3VzZXJzOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKSB7XG4gICAgdmFyIF9zZWxmLCBhY2NlcHRlZF91c2VyX2NvdW50LCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJMb2NhbGUsIGVycm9yTGlzdCwgb3duZXJfaWQsIHJvb3Rfb3JnLCBzcGFjZSwgdGVzdERhdGE7XG4gICAgX3NlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgcGFyZW50OiBudWxsXG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuICAgIH1cbiAgICBpZiAoIVN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlICE9IG51bGwgPyBzcGFjZS5faWQgOiB2b2lkIDApKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLln7rnoYDniYjkuI3mlK/mjIHmraTlip/og71cIik7XG4gICAgfVxuICAgIGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZS5faWQsXG4gICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgfSkuY291bnQoKTtcbiAgICBpZiAoKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgKFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezXCIgKyAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSArIFwiKOW9k+WJjVwiICsgc3BhY2UudXNlcl9saW1pdCArIFwiKVwiKSArIFwiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIik7XG4gICAgfVxuICAgIG93bmVyX2lkID0gc3BhY2Uub3duZXI7XG4gICAgdGVzdERhdGEgPSBbXTtcbiAgICBlcnJvckxpc3QgPSBbXTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBfc2VsZi51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgbG9jYWxlOiAxLFxuICAgICAgICBwaG9uZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgbXVsdGlPcmdzLCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgb3JnYW5pemF0aW9uX2RlcHRzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlbGVjdG9yLCBzcGFjZVVzZXJFeGlzdCwgdGVzdE9iaiwgdXNlciwgdXNlckV4aXN0O1xuICAgICAgaWYgKCFpdGVtLnBob25lICYmICFpdGVtLmVtYWlsKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICB0ZXN0T2JqID0ge307XG4gICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICB0ZXN0T2JqLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICB0ZXN0T2JqLnBob25lID0gaXRlbS5waG9uZTtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbCkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumCruS7tuagvOW8j+mUmeivr1wiICsgaXRlbS5lbWFpbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcImVtYWlsXCIsIGl0ZW0uZW1haWwpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumCruS7tumHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaXRlbS5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgdGVzdERhdGEucHVzaCh0ZXN0T2JqKTtcbiAgICAgIHNlbGVjdG9yID0gW107XG4gICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgdXNlcm5hbWU6IGl0ZW0udXNlcm5hbWVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBlbWFpbDogaXRlbS5lbWFpbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIG1vYmlsZTogaXRlbS5waG9uZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5faWQ7XG4gICAgICAgIHNwYWNlVXNlckV4aXN0ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgb3BlcmF0aW5nID0gXCJ1cGRhdGVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09PSAwKSB7XG4gICAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICBvcGVyYXRpbmcgPSBcImluc2VydFwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQgJiYgdXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgaWYgKChyZWYgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICBpZiAoIW9yZ2FuaXphdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XG4gICAgICBpZiAob3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9PSByb290X29yZy5uYW1lKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQgJiYgKHVzZXIgIT0gbnVsbCA/IChyZWYyID0gdXNlci5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICBpZiAoIWRlcHRfbmFtZSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICByZXR1cm4gbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgdmFyIGZ1bGxuYW1lO1xuICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgIHJldHVybiBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICB2YXIgb3JnQ291bnQ7XG4gICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICBpZiAoaiA9PT0gMSkge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9yZ0NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAob3JnQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6goXCIgKyBkZXB0X25hbWUgKyBcIinkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChvbmx5Q2hlY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBiZWxvbmdPcmdpZHMsIGUsIGVycm9yLCBtdWx0aU9yZ3MsIG5vdywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIHNlbGVjdG9yLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX3VwZGF0ZV9kb2MsIHN1X2RvYywgdWRvYywgdXNlciwgdXNlckV4aXN0LCB1c2VySW5mbywgdXNlcl9pZDtcbiAgICAgIGVycm9yID0ge307XG4gICAgICB0cnkge1xuICAgICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgZW1haWw6IGl0ZW0uZW1haWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7XG4gICAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXJFeGlzdC5jb3VudCgpID4gMSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKTtcbiAgICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXTtcbiAgICAgICAgfVxuICAgICAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvbjtcbiAgICAgICAgbXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgYmVsb25nT3JnaWRzID0gW107XG4gICAgICAgIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgICAgdmFyIGZ1bGxuYW1lLCBvcmcsIG9yZ2FuaXphdGlvbl9kZXB0cztcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgICBpZiAoaiA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGlmIChvcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBiZWxvbmdPcmdpZHMucHVzaChvcmcuX2lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB1c2VyX2lkID0gbnVsbDtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdWRvYyA9IHt9O1xuICAgICAgICAgIHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgIHVkb2Muc3RlZWRvc19pZCA9IGl0ZW0uZW1haWwgfHwgdWRvYy5faWQ7XG4gICAgICAgICAgdWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZTtcbiAgICAgICAgICB1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXTtcbiAgICAgICAgICBpZiAoaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICB1ZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIHVkb2MuZW1haWxfdmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgdWRvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgdWRvYy5tb2JpbGVfdmVyaWZpZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKTtcbiAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIgfHwgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgICAgIGxvZ291dDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN1X2RvYyA9IHt9O1xuICAgICAgICAgICAgc3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICAgIHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIjtcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF07XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkcztcbiAgICAgICAgICAgIGlmIChpdGVtLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS53b3JrX3Bob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5zb3J0X25vKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGFueSkge1xuICAgICAgICAgICAgICBzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1c2VyX2lkKSB7XG4gICAgICAgICAgICAgIHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7XG4gICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmICh1c2VySW5mby51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIHN1X2RvYy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHN1X2RvYy51c2VyID0gdXNlcl9pZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBlcnJvci5saW5lID0gaSArIDE7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvbjtcbiAgICAgICAgcmV0dXJuIGVycm9yTGlzdC5wdXNoKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZXJyb3JMaXN0O1xuICB9XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UgXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpLT5cclxuXHRcdHRyeVxyXG5cdFx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXHJcblxyXG5cdFx0XHRxdWVyeSA9IHJlcS5xdWVyeVxyXG5cdFx0XHRzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkXHJcblx0XHRcdG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZFxyXG5cdFx0XHR1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddXHJcblx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOm9yZ19pZH0se2ZpZWxkczp7ZnVsbG5hbWU6MX19KVxyXG5cdFx0XHR1c2Vyc190b194bHMgPSBuZXcgQXJyYXlcclxuXHRcdFx0bm93ID0gbmV3IERhdGUgXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLHVzZXJfaWQpXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRzb3J0OiB7bmFtZTogMX1cclxuXHRcdFx0XHR9KS5mZXRjaCgpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcmdfaWRzID0gW11cclxuXHRcdFx0XHRvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOm9yZ19pZCxzcGFjZTpzcGFjZV9pZH0se2ZpZWxkczp7X2lkOjEsY2hpbGRyZW46MX19KS5mZXRjaCgpXHJcblx0XHRcdFx0b3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsJ19pZCcpXHJcblx0XHRcdFx0Xy5lYWNoIG9yZ19vYmpzLChvcmdfb2JqKS0+XHJcblx0XHRcdFx0XHRvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLG9yZ19vYmo/LmNoaWxkcmVuKVxyXG5cdFx0XHRcdF8udW5pcShvcmdfaWRzKVxyXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkLG9yZ2FuaXphdGlvbnM6eyRpbjpvcmdfaWRzfX0se3NvcnQ6IHtzb3J0X25vOiAtMSxuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRlanMgPSByZXF1aXJlKCdlanMnKVxyXG5cdFx0XHRzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJylcclxuXHRcdFx0XHJcblx0XHRcdCMg5qOA5rWL5piv5ZCm5pyJ6K+t5rOV6ZSZ6K+vXHJcblx0XHRcdGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpXHJcblx0XHRcdGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KVxyXG5cdFx0XHRpZiBlcnJvcl9vYmpcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yX29ialxyXG5cclxuXHRcdFx0dGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpXHJcblxyXG5cdFx0XHRsYW5nID0gJ2VuJ1xyXG5cdFx0XHRpZiBjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgaXMgJ3poLWNuJ1xyXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXHJcblxyXG5cdFx0XHRvcmdOYW1lID0gaWYgb3JnIHRoZW4gb3JnLmZ1bGxuYW1lIGVsc2Ugb3JnX2lkXHJcblx0XHRcdGZpZWxkcyA9IFt7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J25hbWUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J21vYmlsZScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTond29ya19waG9uZScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J2VtYWlsJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J2NvbXBhbnknLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidwb3NpdGlvbicsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidvcmdhbml6YXRpb25zJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycse30sbGFuZyksXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHRvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB2YWx1ZX19LHtmaWVsZHM6IHtmdWxsbmFtZTogMX19KS5tYXAoKGl0ZW0saW5kZXgpLT5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5mdWxsbmFtZVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidtYW5hZ2VyJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHtuYW1lOiAxfX0pXHJcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy5uYW1lXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3VzZXInLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHt1c2VybmFtZTogMX19KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8udXNlcm5hbWVcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdOdW1iZXInLFxyXG5cdFx0XHRcdFx0bmFtZTonc29ydF9ubycsXHJcblx0XHRcdFx0XHR3aWR0aDogMzUsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTondXNlcl9hY2NlcHRlZCcsXHJcblx0XHRcdFx0XHR3aWR0aDogMzUsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHJldHVybiBpZiB2YWx1ZSB0aGVuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJyx7fSxsYW5nKSBlbHNlIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLHt9LGxhbmcpXHJcblx0XHRcdFx0fV1cclxuXHRcdFx0XHJcblx0XHRcdHNoZWV0X25hbWUgPSBvcmdOYW1lPy5yZXBsYWNlKC9cXC8vZyxcIi1cIikgI+S4jeaUr+aMgVwiL1wi56ym5Y+3XHJcblx0XHRcdHJldCA9IHRlbXBsYXRlKHtcclxuXHRcdFx0XHRsYW5nOiBsYW5nLFxyXG5cdFx0XHRcdHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXHJcblx0XHRcdFx0ZmllbGRzOiBmaWVsZHMsXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCJcclxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKVxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIrZW5jb2RlVVJJKGZpbGVOYW1lKSlcclxuXHRcdFx0cmVzLmVuZChyZXQpXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0XHRyZXMuZW5kKGUubWVzc2FnZSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY3VycmVudF91c2VyX2luZm8sIGUsIGVqcywgZWpzTGludCwgZXJyb3Jfb2JqLCBmaWVsZHMsIGZpbGVOYW1lLCBsYW5nLCBub3csIG9yZywgb3JnTmFtZSwgb3JnX2lkLCBvcmdfaWRzLCBvcmdfb2JqcywgcXVlcnksIHJldCwgc2hlZXRfbmFtZSwgc3BhY2VfaWQsIHN0ciwgdGVtcGxhdGUsIHVzZXJfaWQsIHVzZXJzX3RvX3hscztcbiAgICB0cnkge1xuICAgICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgICAgc3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZDtcbiAgICAgIG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZDtcbiAgICAgIHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9yZ19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheTtcbiAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VyX2lkKSkge1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmdfaWRzID0gW107XG4gICAgICAgIG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBfaWQ6IG9yZ19pZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgY2hpbGRyZW46IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCAnX2lkJyk7XG4gICAgICAgIF8uZWFjaChvcmdfb2JqcywgZnVuY3Rpb24ob3JnX29iaikge1xuICAgICAgICAgIHJldHVybiBvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLCBvcmdfb2JqICE9IG51bGwgPyBvcmdfb2JqLmNoaWxkcmVuIDogdm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8udW5pcShvcmdfaWRzKTtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRpbjogb3JnX2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IC0xLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuICAgICAgc3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpO1xuICAgICAgZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jyk7XG4gICAgICBlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSk7XG4gICAgICBpZiAoZXJyb3Jfb2JqKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3Jfb2JqKTtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKTtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIG9yZ05hbWUgPSBvcmcgPyBvcmcuZnVsbG5hbWUgOiBvcmdfaWQ7XG4gICAgICBmaWVsZHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbW9iaWxlJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd3b3JrX3Bob25lJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnY29tcGFueScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9yZ05hbWVzO1xuICAgICAgICAgICAgb3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLmZ1bGxuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21hbmFnZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICAgIG5hbWU6ICdzb3J0X25vJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyX2FjY2VwdGVkJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHNoZWV0X25hbWUgPSBvcmdOYW1lICE9IG51bGwgPyBvcmdOYW1lLnJlcGxhY2UoL1xcLy9nLCBcIi1cIikgOiB2b2lkIDA7XG4gICAgICByZXQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICB1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuICAgICAgfSk7XG4gICAgICBmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIHJlcy5lbmQocmV0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiByZXMuZW5kKGUubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
