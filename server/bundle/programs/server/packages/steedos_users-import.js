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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImVycm9yTGlzdCIsIm93bmVyX2lkIiwicm9vdF9vcmciLCJzcGFjZSIsInRlc3REYXRhIiwidXNlcklkIiwiRXJyb3IiLCJkYiIsIm9yZ2FuaXphdGlvbnMiLCJmaW5kT25lIiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJzcGFjZV91c2VycyIsImZpbmQiLCJfaWQiLCJ1c2VyX2FjY2VwdGVkIiwiY291bnQiLCJsZW5ndGgiLCJ1c2VyX2xpbWl0Iiwib3duZXIiLCJ1c2VycyIsImZpZWxkcyIsImxvY2FsZSIsInBob25lIiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicmVmIiwicmVmMSIsInJlZjIiLCJyZWYzIiwic2VsZWN0b3IiLCJzcGFjZVVzZXJFeGlzdCIsInRlc3RPYmoiLCJ1c2VyIiwidXNlckV4aXN0IiwiZW1haWwiLCJ1c2VybmFtZSIsImZpbHRlclByb3BlcnR5IiwidGVzdCIsInB1c2giLCJtb2JpbGUiLCIkb3IiLCJmZXRjaCIsInBhc3N3b3JkIiwic2VydmljZXMiLCJiY3J5cHQiLCJzcGxpdCIsIm5hbWUiLCJkZXB0X25hbWUiLCJqIiwib3JnRnVsbG5hbWUiLCJmdWxsbmFtZSIsInRyaW0iLCJvcmdDb3VudCIsImJlbG9uZ09yZ2lkcyIsImUiLCJlcnJvciIsIm5vdyIsInNwYWNlX3VzZXIiLCJzcGFjZV91c2VyX3VwZGF0ZV9kb2MiLCJzdV9kb2MiLCJ1ZG9jIiwidXNlckluZm8iLCJ1c2VyX2lkIiwiRGF0ZSIsIm9yZyIsIl9tYWtlTmV3SUQiLCJzdGVlZG9zX2lkIiwic3BhY2VzX2ludml0ZWQiLCJlbWFpbF92ZXJpZmllZCIsIm1vYmlsZV92ZXJpZmllZCIsImluc2VydCIsIkFjY291bnRzIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJfIiwidW5pcSIsImNvbmNhdCIsImNvbXBhbnkiLCJwb3NpdGlvbiIsIndvcmtfcGhvbmUiLCJzb3J0X25vIiwia2V5cyIsInVwZGF0ZSIsIiRzZXQiLCJpbnZpdGVfc3RhdGUiLCJlcnJvcjEiLCJsaW5lIiwibWVzc2FnZSIsInJlYXNvbiIsInN0YXJ0dXAiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2luZm8iLCJlanMiLCJlanNMaW50IiwiZXJyb3Jfb2JqIiwiZmlsZU5hbWUiLCJsYW5nIiwib3JnTmFtZSIsIm9yZ19pZCIsIm9yZ19pZHMiLCJvcmdfb2JqcyIsInF1ZXJ5IiwicmV0Iiwic2hlZXRfbmFtZSIsInN0ciIsInRlbXBsYXRlIiwidXNlcnNfdG9feGxzIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJBcnJheSIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsInR5cGUiLCJ3aWR0aCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixTQUFPLFFBRFM7QUFFaEIsY0FBWTtBQUZJLENBQUQsRUFHYixzQkFIYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQUksT0FBT0MsT0FBUCxDQUNDO0FBQUE7Ozs7OztLQU9BQyxjQUFjLFVBQUNDLFFBQUQsRUFBV0MsT0FBWCxFQUFvQkMsSUFBcEIsRUFBMEJDLFNBQTFCO0FBRWIsUUFBQUMsS0FBQSxFQUFBQyxtQkFBQSxFQUFBQyxXQUFBLEVBQUFDLGlCQUFBLEVBQUFDLFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxRQUFBLEVBQUFDLEtBQUEsRUFBQUMsUUFBQTs7QUFBQVIsWUFBUSxJQUFSOztBQUVBLFFBQUcsQ0FBQyxLQUFLUyxNQUFUO0FBQ0MsWUFBTSxJQUFJaEIsT0FBT2lCLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsTUFBdEIsQ0FBTjtBQ0NFOztBRENISixlQUFXSyxHQUFH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SUFBMUMsQ0FKTjtBQUtEa0MsbUJBQVcsVUFBQ0MsS0FBRDtBQUNILGNBQUdBLEtBQUg7QUNxREMsbUJEckRhSCxRQUFRQyxFQUFSLENBQVcsK0JBQVgsRUFBMkMsRUFBM0MsRUFBOENqQyxJQUE5QyxDQ3FEYjtBRHJERDtBQ3VEQyxtQkR2RHNFZ0MsUUFBUUMsRUFBUixDQUFXLDhCQUFYLEVBQTBDLEVBQTFDLEVBQTZDakMsSUFBN0MsQ0N1RHRFO0FBQ0Q7QUQ5RFA7QUFBQSxPQTdETSxDQUFUO0FBc0VBTyxtQkFBQU4sV0FBQSxPQUFhQSxRQUFTdUMsT0FBVCxDQUFpQixLQUFqQixFQUF1QixHQUF2QixDQUFiLEdBQWEsTUFBYjtBQUNBbEMsWUFBTUcsU0FBUztBQUNkVCxjQUFNQSxJQURRO0FBRWRPLG9CQUFZQSxVQUZFO0FBR2Q3RixnQkFBUUEsTUFITTtBQUlkZ0csc0JBQWNBO0FBSkEsT0FBVCxDQUFOO0FBT0FYLGlCQUFXLHFCQUFxQjBDLFNBQVNDLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBckIsR0FBdUQsTUFBbEU7QUFDQWpELFVBQUlrRCxTQUFKLENBQWMsY0FBZCxFQUE4QiwwQkFBOUI7QUFDQWxELFVBQUlrRCxTQUFKLENBQWMscUJBQWQsRUFBcUMseUJBQXVCQyxVQUFVN0MsUUFBVixDQUE1RDtBQ3lERyxhRHhESE4sSUFBSW9ELEdBQUosQ0FBUXZDLEdBQVIsQ0N3REc7QURsTEosYUFBQXBELEtBQUE7QUEySE1ELFVBQUFDLEtBQUE7QUFDTHlFLGNBQVF6RSxLQUFSLENBQWNELEVBQUU2RixLQUFoQjtBQzBERyxhRHpESHJELElBQUlvRCxHQUFKLENBQVE1RixFQUFFaUMsT0FBVixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcbn0sICdzdGVlZG9zOnVzZXJzLWltcG9ydCcpO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyMjXG5cdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcblx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG5cdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdFRPRE86IOWbvemZheWMllxuXHQjIyNcblx0aW1wb3J0X3VzZXJzOiAoc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjayktPlxuXG5cdFx0X3NlbGYgPSB0aGlzXG5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKVxuXG5cdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgcGFyZW50OiBudWxsfSlcblxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZT8uYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuXG5cdFx0IyBpZiAhU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2U/Ll9pZClcblx0XHQjIFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Z+656GA54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuXG5cdFx0YWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZS5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0aWYgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7Mje2FjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aH0o5b2T5YmNI3tzcGFjZS51c2VyX2xpbWl0fSlcIiArXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKVxuXG5cdFx0b3duZXJfaWQgPSBzcGFjZS5vd25lclxuXG5cdFx0dGVzdERhdGEgPSBbXVxuXG5cdFx0ZXJyb3JMaXN0ID0gW11cblxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBfc2VsZi51c2VySWR9LHtmaWVsZHM6e2xvY2FsZToxLHBob25lOjF9fSlcblx0XHRjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZVxuXG5cdFx0IyDmlbDmja7nu5/kuIDmoKHpqoxcblxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxuXHRcdFx0IyBjb25zb2xlLmxvZyBpdGVtXG5cdFx0XHQjIOeUqOaIt+WQje+8jOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulxuXHRcdFx0aWYgIWl0ZW0ucGhvbmUgYW5kICFpdGVtLmVtYWlsXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIilcblxuXHRcdFx0IyDliKTmlq1leGNlbOS4reeahOaVsOaNru+8jOeUqOaIt+WQjeOAgeaJi+acuuWPt+etieS/oeaBr+aYr+WQpuacieivr1xuXHRcdFx0dGVzdE9iaiA9IHt9XG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xuXG5cdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xuXG5cdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bmoLzlvI/plJnor68je2l0ZW0uZW1haWx9XCIpO1xuXG5cdFx0XHRcdHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu26YeN5aSNXCIpO1xuXG5cdFx0XHRpdGVtLnNwYWNlID0gc3BhY2VfaWRcblxuXHRcdFx0dGVzdERhdGEucHVzaCh0ZXN0T2JqKVxuXG5cdFx0XHQjIOiOt+WPluafpeaJvnVzZXLnmoTmnaHku7Zcblx0XHRcdHNlbGVjdG9yID0gW11cblx0XHRcdG9wZXJhdGluZyA9IFwiXCJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XG5cdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge2VtYWlsOiBpdGVtLmVtYWlsfVxuXHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHttb2JpbGU6IGl0ZW0ucGhvbmV9XG5cblx0XHRcdHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoeyRvcjogc2VsZWN0b3J9KVxuXG5cblx0XHRcdCMg5YWI5Yik5pat5piv5ZCm6IO95Yy56YWN5Yiw5ZSv5LiA55qEdXNlcu+8jOeEtuWQjuWIpOaWreivpeeUqOaIt+aYr2luc2VydOWIsHNwYWNlX3VzZXJz6L+Y5pivdXBkYXRlXG5cdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkXG5cdFx0XHRcdHNwYWNlVXNlckV4aXN0ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyfSlcblx0XHRcdFx0aWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJ1cGRhdGVcIlxuXHRcdFx0XHRlbHNlIGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMFxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwiaW5zZXJ0XCJcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMFxuXHRcdFx0XHQjIOaWsOWinnNwYWNlX3VzZXJz55qE5pWw5o2u5qCh6aqMXG5cdFx0XHRcdG9wZXJhdGluZyA9IFwiaW5zZXJ0XCJcblxuXHRcdFx0IyDliKTmlq3mmK/lkKbog73kv67mlLnnlKjmiLfnmoTlr4bnoIFcblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgYW5kIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0aWYgdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcblxuXHRcdFx0IyDliKTmlq3pg6jpl6jmmK/lkKblkIjnkIZcblx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXG5cblx0XHRcdGlmICFvcmdhbml6YXRpb25cblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG5cblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XG5cblx0XHRcdGlmIG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPSByb290X29yZy5uYW1lXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xuXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkICYmIHVzZXI/LnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxuXHRcdFx0XHRpZiAhZGVwdF9uYW1lXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG5cblx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcblx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cblx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcblx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0XHRpZiBqID4gMFxuXHRcdFx0XHRcdFx0aWYgaiA9PSAxXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxuXG5cdFx0XHRcdFx0XHRvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KS5jb3VudCgpXG5cblx0XHRcdFx0XHRcdGlmIG9yZ0NvdW50ID09IDBcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpg6jpl6goI3tkZXB0X25hbWV9KeS4jeWtmOWcqO+8jOivt+WFiOWIm+W7ulwiKTtcblxuXHRcdGlmIG9ubHlDaGVja1xuXHRcdFx0cmV0dXJuIDtcblxuXHRcdCMg5pWw5o2u5a+85YWlXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XG5cdFx0XHRlcnJvciA9IHt9XG5cdFx0XHR0cnlcblx0XHRcdFx0c2VsZWN0b3IgPSBbXVxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcIlwiXG5cdFx0XHRcdCMgaWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHQjIFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XG5cdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtlbWFpbDogaXRlbS5lbWFpbH1cblx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge21vYmlsZTogaXRlbS5waG9uZX1cblx0XHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxuXHRcdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF1cblxuXHRcdFx0XHRub3cgPSBuZXcgRGF0ZSgpXG5cblx0XHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cblx0XHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0XHRiZWxvbmdPcmdpZHMgPSBbXVxuXHRcdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRcdGZ1bGxuYW1lID0gXCJcIlxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdFx0XHRpZiBqID4gMFxuXHRcdFx0XHRcdFx0XHRpZiBqID09IDFcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXG5cblx0XHRcdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSlcblxuXHRcdFx0XHRcdGlmIG9yZ1xuXHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxuXG5cblx0XHRcdFx0dXNlcl9pZCA9IG51bGxcblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dWRvYyA9IHt9XG5cdFx0XHRcdFx0dWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHR1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkXG5cdFx0XHRcdFx0dWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZVxuXHRcdFx0XHRcdHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdXG5cdFx0XHRcdFx0aWYgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR1ZG9jLm5hbWUgPSBpdGVtLm5hbWVcblxuXHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdHVkb2MuZW1haWwgPSBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHR1ZG9jLmVtYWlsX3ZlcmlmaWVkID0gZmFsc2VcblxuXHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0XHRcdHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXG5cblx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHR1ZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdHVkb2MubW9iaWxlX3ZlcmlmaWVkID0gZmFsc2Vcblx0XHRcdFx0XHR1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpXG5cblx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXG5cdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXG5cblx0XHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0pXG5cblx0XHRcdFx0aWYgc3BhY2VfdXNlclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRpZiAhc3BhY2VfdXNlci5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdXG5cblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9XG5cblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSlcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xuXG5cdFx0XHRcdFx0XHRpZiBfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSwgeyRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY30pXG5cblx0XHRcdFx0XHRcdGlmIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiIG9yIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuI1x0XHRcdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxuI1x0XHRcdFx0XHRcdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0seyRzZXQ6e3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfX0pXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcblx0XHRcdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRzdV9kb2MgPSB7fVxuXHRcdFx0XHRcdFx0c3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0c3VfZG9jLnNwYWNlID0gc3BhY2VfaWRcblxuXHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSAgdHJ1ZVxuXHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIlxuXG5cdFx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiXG5cblx0XHRcdFx0XHRcdHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF1cblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cblx0XHRcdFx0XHRcdFx0c3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcblx0XHRcdFx0XHRcdFx0c3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cblx0XHRcdFx0XHRcdFx0c3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGlmIHVzZXJfaWRcblx0XHRcdFx0XHRcdFx0dXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHsgZmllbGRzOiB7IHVzZXJuYW1lOiAxIH0gfSlcblx0XHRcdFx0XHRcdFx0aWYgdXNlckluZm8udXNlcm5hbWVcblx0XHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlciA9IHVzZXJfaWRcblxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3IubGluZSA9IGkrMVxuXHRcdFx0XHRlcnJvci5tZXNzYWdlID0gZS5yZWFzb25cblx0XHRcdFx0ZXJyb3JMaXN0LnB1c2goZXJyb3IpXG5cblx0XHRyZXR1cm4gZXJyb3JMaXN0XG4iLCJNZXRlb3IubWV0aG9kcyh7XG5cbiAgLypcbiAgXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcbiAgXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdFRPRE86IOWbvemZheWMllxuICAgKi9cbiAgaW1wb3J0X3VzZXJzOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKSB7XG4gICAgdmFyIF9zZWxmLCBhY2NlcHRlZF91c2VyX2NvdW50LCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJMb2NhbGUsIGVycm9yTGlzdCwgb3duZXJfaWQsIHJvb3Rfb3JnLCBzcGFjZSwgdGVzdERhdGE7XG4gICAgX3NlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgcGFyZW50OiBudWxsXG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuICAgIH1cbiAgICBhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2UuX2lkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgIH0pLmNvdW50KCk7XG4gICAgaWYgKChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIChcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHs1wiICsgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgKyBcIijlvZPliY1cIiArIHNwYWNlLnVzZXJfbGltaXQgKyBcIilcIikgKyBcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpO1xuICAgIH1cbiAgICBvd25lcl9pZCA9IHNwYWNlLm93bmVyO1xuICAgIHRlc3REYXRhID0gW107XG4gICAgZXJyb3JMaXN0ID0gW107XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogX3NlbGYudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGxvY2FsZTogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIG11bHRpT3Jncywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIG9yZ2FuaXphdGlvbl9kZXB0cywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgZW1haWw6IGl0ZW0uZW1haWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgaWYgKCFkZXB0X25hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgcmV0dXJuIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgIHZhciBmdWxsbmFtZTtcbiAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgdmFyIG9yZ0NvdW50O1xuICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKG9yZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6ZeoKFwiICsgZGVwdF9uYW1lICsgXCIp5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAob25seUNoZWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgYmVsb25nT3JnaWRzLCBlLCBlcnJvciwgbXVsdGlPcmdzLCBub3csIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlckluZm8sIHVzZXJfaWQ7XG4gICAgICBlcnJvciA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIGVtYWlsOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIG1vYmlsZTogaXRlbS5waG9uZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF07XG4gICAgICAgIH1cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgIGJlbG9uZ09yZ2lkcyA9IFtdO1xuICAgICAgICBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICAgIHZhciBmdWxsbmFtZSwgb3JnLCBvcmdhbml6YXRpb25fZGVwdHM7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVsb25nT3JnaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVkb2MgPSB7fTtcbiAgICAgICAgICB1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICB1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkO1xuICAgICAgICAgIHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGU7XG4gICAgICAgICAgdWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF07XG4gICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgdWRvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgdWRvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB1ZG9jLmVtYWlsX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgICBzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCI7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdO1xuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHM7XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcl9pZCkge1xuICAgICAgICAgICAgICB1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlckluZm8udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdV9kb2MudXNlciA9IHVzZXJfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgZXJyb3IubGluZSA9IGkgKyAxO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gZS5yZWFzb247XG4gICAgICAgIHJldHVybiBlcnJvckxpc3QucHVzaChlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVycm9yTGlzdDtcbiAgfVxufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSBcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCktPlxuXHRcdHRyeVxuXHRcdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxuXG5cdFx0XHRxdWVyeSA9IHJlcS5xdWVyeVxuXHRcdFx0c3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZFxuXHRcdFx0b3JnX2lkID0gcXVlcnkub3JnX2lkXG5cdFx0XHR1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddXG5cdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDpvcmdfaWR9LHtmaWVsZHM6e2Z1bGxuYW1lOjF9fSlcblx0XHRcdHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheVxuXHRcdFx0bm93ID0gbmV3IERhdGUgXG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCx1c2VyX2lkKVxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdHNvcnQ6IHtuYW1lOiAxfVxuXHRcdFx0XHR9KS5mZXRjaCgpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG9yZ19pZHMgPSBbXVxuXHRcdFx0XHRvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOm9yZ19pZCxzcGFjZTpzcGFjZV9pZH0se2ZpZWxkczp7X2lkOjEsY2hpbGRyZW46MX19KS5mZXRjaCgpXG5cdFx0XHRcdG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCdfaWQnKVxuXHRcdFx0XHRfLmVhY2ggb3JnX29ianMsKG9yZ19vYmopLT5cblx0XHRcdFx0XHRvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLG9yZ19vYmo/LmNoaWxkcmVuKVxuXHRcdFx0XHRfLnVuaXEob3JnX2lkcylcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWQsb3JnYW5pemF0aW9uczp7JGluOm9yZ19pZHN9fSx7c29ydDoge3NvcnRfbm86IC0xLG5hbWU6MX19KS5mZXRjaCgpXG5cdFx0XHRlanMgPSByZXF1aXJlKCdlanMnKVxuXHRcdFx0c3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpXG5cdFx0XHRcblx0XHRcdCMg5qOA5rWL5piv5ZCm5pyJ6K+t5rOV6ZSZ6K+vXG5cdFx0XHRlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKVxuXHRcdFx0ZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pXG5cdFx0XHRpZiBlcnJvcl9vYmpcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3Jfb2JqXG5cblx0XHRcdHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKVxuXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgY3VycmVudF91c2VyX2luZm8ubG9jYWxlIGlzICd6aC1jbidcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcblxuXHRcdFx0b3JnTmFtZSA9IGlmIG9yZyB0aGVuIG9yZy5mdWxsbmFtZSBlbHNlIG9yZ19pZFxuXHRcdFx0ZmllbGRzID0gW3tcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOiduYW1lJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J21vYmlsZScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid3b3JrX3Bob25lJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidlbWFpbCcsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J2NvbXBhbnknLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J3Bvc2l0aW9uJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonb3JnYW5pemF0aW9ucycsXG5cdFx0XHRcdFx0d2lkdGg6IDYwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycse30sbGFuZyksXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHZhbHVlfX0se2ZpZWxkczoge2Z1bGxuYW1lOiAxfX0pLm1hcCgoaXRlbSxpbmRleCktPlxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5mdWxsbmFtZVxuXHRcdFx0XHRcdFx0KVxuXHRcdFx0XHRcdFx0cmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J21hbmFnZXInLFxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHtuYW1lOiAxfX0pXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8ubmFtZVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid1c2VyJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge3VzZXJuYW1lOiAxfX0pXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8udXNlcm5hbWVcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ051bWJlcicsXG5cdFx0XHRcdFx0bmFtZTonc29ydF9ubycsXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOid1c2VyX2FjY2VwdGVkJyxcblx0XHRcdFx0XHR3aWR0aDogMzUsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHJldHVybiBpZiB2YWx1ZSB0aGVuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJyx7fSxsYW5nKSBlbHNlIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLHt9LGxhbmcpXG5cdFx0XHRcdH1dXG5cdFx0XHRcblx0XHRcdHNoZWV0X25hbWUgPSBvcmdOYW1lPy5yZXBsYWNlKC9cXC8vZyxcIi1cIikgI+S4jeaUr+aMgVwiL1wi56ym5Y+3XG5cdFx0XHRyZXQgPSB0ZW1wbGF0ZSh7XG5cdFx0XHRcdGxhbmc6IGxhbmcsXG5cdFx0XHRcdHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG5cdFx0XHRcdGZpZWxkczogZmllbGRzLFxuXHRcdFx0XHR1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuXHRcdFx0fSlcblxuXHRcdFx0ZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIlxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKVxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiK2VuY29kZVVSSShmaWxlTmFtZSkpXG5cdFx0XHRyZXMuZW5kKHJldClcblx0XHRjYXRjaCBlXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRcdHJlcy5lbmQoZS5tZXNzYWdlKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjdXJyZW50X3VzZXJfaW5mbywgZSwgZWpzLCBlanNMaW50LCBlcnJvcl9vYmosIGZpZWxkcywgZmlsZU5hbWUsIGxhbmcsIG5vdywgb3JnLCBvcmdOYW1lLCBvcmdfaWQsIG9yZ19pZHMsIG9yZ19vYmpzLCBxdWVyeSwgcmV0LCBzaGVldF9uYW1lLCBzcGFjZV9pZCwgc3RyLCB0ZW1wbGF0ZSwgdXNlcl9pZCwgdXNlcnNfdG9feGxzO1xuICAgIHRyeSB7XG4gICAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgICAgcXVlcnkgPSByZXEucXVlcnk7XG4gICAgICBzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkO1xuICAgICAgb3JnX2lkID0gcXVlcnkub3JnX2lkO1xuICAgICAgdXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogb3JnX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcnNfdG9feGxzID0gbmV3IEFycmF5O1xuICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJfaWQpKSB7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yZ19pZHMgPSBbXTtcbiAgICAgICAgb3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIF9pZDogb3JnX2lkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBjaGlsZHJlbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgb3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsICdfaWQnKTtcbiAgICAgICAgXy5lYWNoKG9yZ19vYmpzLCBmdW5jdGlvbihvcmdfb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsIG9yZ19vYmogIT0gbnVsbCA/IG9yZ19vYmouY2hpbGRyZW4gOiB2b2lkIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgXy51bmlxKG9yZ19pZHMpO1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGluOiBvcmdfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgc29ydF9ubzogLTEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgZWpzID0gcmVxdWlyZSgnZWpzJyk7XG4gICAgICBzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJyk7XG4gICAgICBlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKTtcbiAgICAgIGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KTtcbiAgICAgIGlmIChlcnJvcl9vYmopIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcl9vYmopO1xuICAgICAgfVxuICAgICAgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpO1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAoY3VycmVudF91c2VyX2luZm8ubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgb3JnTmFtZSA9IG9yZyA/IG9yZy5mdWxsbmFtZSA6IG9yZ19pZDtcbiAgICAgIGZpZWxkcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtb2JpbGUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3dvcmtfcGhvbmUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdjb21wYW55JyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAncG9zaXRpb24nLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnb3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb3JnTmFtZXM7XG4gICAgICAgICAgICBvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZnVsbG5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbWFuYWdlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci5uYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgICAgbmFtZTogJ3NvcnRfbm8nLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXJfYWNjZXB0ZWQnLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgc2hlZXRfbmFtZSA9IG9yZ05hbWUgIT0gbnVsbCA/IG9yZ05hbWUucmVwbGFjZSgvXFwvL2csIFwiLVwiKSA6IHZvaWQgMDtcbiAgICAgIHJldCA9IHRlbXBsYXRlKHtcbiAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgc2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXG4gICAgICB9KTtcbiAgICAgIGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCI7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiICsgZW5jb2RlVVJJKGZpbGVOYW1lKSk7XG4gICAgICByZXR1cm4gcmVzLmVuZChyZXQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
