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

},"server":{"methods":{"import_users.coffee":function(){

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

}}},"routes":{"api_space_users_export.coffee":function(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImVycm9yTGlzdCIsIm93bmVyX2lkIiwicm9vdF9vcmciLCJzcGFjZSIsInRlc3REYXRhIiwidXNlcklkIiwiRXJyb3IiLCJkYiIsIm9yZ2FuaXphdGlvbnMiLCJmaW5kT25lIiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsIl9pZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJtdWx0aU9yZ3MiLCJvcGVyYXRpbmciLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25fZGVwdHMiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIm1vYmlsZSIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlsX3ZlcmlmaWVkIiwibW9iaWxlX3ZlcmlmaWVkIiwiaW5zZXJ0IiwiQWNjb3VudHMiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIl8iLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwic3RhcnR1cCIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImVqcyIsImVqc0xpbnQiLCJlcnJvcl9vYmoiLCJmaWxlTmFtZSIsImxhbmciLCJvcmdOYW1lIiwib3JnX2lkIiwib3JnX2lkcyIsIm9yZ19vYmpzIiwicXVlcnkiLCJyZXQiLCJzaGVldF9uYW1lIiwic3RyIiwidGVtcGxhdGUiLCJ1c2Vyc190b194bHMiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsIkFycmF5IiwiaXNTcGFjZUFkbWluIiwic29ydCIsImNoaWxkcmVuIiwicGx1Y2siLCJlYWNoIiwib3JnX29iaiIsInVuaW9uIiwiJGluIiwicmVxdWlyZSIsIkFzc2V0cyIsImdldFRleHQiLCJsaW50IiwiY29uc29sZSIsImNvbXBpbGUiLCJ0eXBlIiwid2lkdGgiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRyYW5zZm9ybSIsInZhbHVlIiwib3JnTmFtZXMiLCJtYXAiLCJpbmRleCIsImpvaW4iLCJyZXBsYWNlIiwibW9tZW50IiwiZm9ybWF0Iiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiZW5kIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLFNBQU8sUUFEUztBQUVoQixjQUFZO0FBRkksQ0FBRCxFQUdiLHNCQUhhLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0RBSSxPQUFPQyxPQUFQLENBQ0M7QUFBQTs7Ozs7O0tBT0FDLGNBQWMsVUFBQ0MsUUFBRCxFQUFXQyxPQUFYLEVBQW9CQyxJQUFwQixFQUEwQkMsU0FBMUI7QUFFYixRQUFBQyxLQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFdBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBQyxRQUFBLEVBQUFDLFFBQUEsRUFBQUMsS0FBQSxFQUFBQyxRQUFBOztBQUFBUixZQUFRLElBQVI7O0FBRUEsUUFBRyxDQUFDLEtBQUtTLE1BQVQ7QUFDQyxZQUFNLElBQUloQixPQUFPaUIsS0FBWCxDQUFpQixHQUFqQixFQUFzQixNQUF0QixDQUFOO0FDQ0U7O0FE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VixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJlanNcIjogXCJeMi41LjVcIixcclxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcclxufSwgJ3N0ZWVkb3M6dXNlcnMtaW1wb3J0Jyk7XHJcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0IyMjXHJcblx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXHJcblx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHRUT0RPOiDlm73pmYXljJZcclxuXHQjIyNcclxuXHRpbXBvcnRfdXNlcnM6IChzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKS0+XHJcblxyXG5cdFx0X3NlbGYgPSB0aGlzXHJcblxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKVxyXG5cclxuXHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHBhcmVudDogbnVsbH0pXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2U/LmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xyXG5cclxuXHRcdGlmICFTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZT8uX2lkKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLln7rnoYDniYjkuI3mlK/mjIHmraTlip/og71cIik7XHJcblxyXG5cdFx0YWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZS5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRpZiAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezI3thY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGh9KOW9k+WJjSN7c3BhY2UudXNlcl9saW1pdH0pXCIgK1wiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIilcclxuXHJcblx0XHRvd25lcl9pZCA9IHNwYWNlLm93bmVyXHJcblxyXG5cdFx0dGVzdERhdGEgPSBbXVxyXG5cclxuXHRcdGVycm9yTGlzdCA9IFtdXHJcblxyXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IF9zZWxmLnVzZXJJZH0se2ZpZWxkczp7bG9jYWxlOjEscGhvbmU6MX19KVxyXG5cdFx0Y3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGVcclxuXHJcblx0XHQjIOaVsOaNrue7n+S4gOagoemqjFxyXG5cclxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxyXG5cdFx0XHQjIGNvbnNvbGUubG9nIGl0ZW1cclxuXHRcdFx0IyDnlKjmiLflkI3vvIzmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcclxuXHRcdFx0aWYgIWl0ZW0ucGhvbmUgYW5kICFpdGVtLmVtYWlsXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKVxyXG5cclxuXHRcdFx0IyDliKTmlq1leGNlbOS4reeahOaVsOaNru+8jOeUqOaIt+WQjeOAgeaJi+acuuWPt+etieS/oeaBr+aYr+WQpuacieivr1xyXG5cdFx0XHR0ZXN0T2JqID0ge31cclxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHR0ZXN0T2JqLnBob25lID0gaXRlbS5waG9uZVxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XHJcblxyXG5cdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0aWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbClcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vI3tpdGVtLmVtYWlsfVwiKTtcclxuXHJcblx0XHRcdFx0dGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcImVtYWlsXCIsIGl0ZW0uZW1haWwpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu26YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aXRlbS5zcGFjZSA9IHNwYWNlX2lkXHJcblxyXG5cdFx0XHR0ZXN0RGF0YS5wdXNoKHRlc3RPYmopXHJcblxyXG5cdFx0XHQjIOiOt+WPluafpeaJvnVzZXLnmoTmnaHku7ZcclxuXHRcdFx0c2VsZWN0b3IgPSBbXVxyXG5cdFx0XHRvcGVyYXRpbmcgPSBcIlwiXHJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cclxuXHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge2VtYWlsOiBpdGVtLmVtYWlsfVxyXG5cdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7bW9iaWxlOiBpdGVtLnBob25lfVxyXG5cclxuXHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXHJcblxyXG5cclxuXHRcdFx0IyDlhYjliKTmlq3mmK/lkKbog73ljLnphY3liLDllK/kuIDnmoR1c2Vy77yM54S25ZCO5Yik5pat6K+l55So5oi35pivaW5zZXJ05Yiwc3BhY2VfdXNlcnPov5jmmK91cGRhdGVcclxuXHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcclxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZFxyXG5cdFx0XHRcdHNwYWNlVXNlckV4aXN0ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyfSlcclxuXHRcdFx0XHRpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwidXBkYXRlXCJcclxuXHRcdFx0XHRlbHNlIGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMFxyXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxyXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDBcclxuXHRcdFx0XHQjIOaWsOWinnNwYWNlX3VzZXJz55qE5pWw5o2u5qCh6aqMXHJcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxyXG5cclxuXHRcdFx0IyDliKTmlq3mmK/lkKbog73kv67mlLnnlKjmiLfnmoTlr4bnoIFcclxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCBhbmQgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcclxuXHJcblx0XHRcdCMg5Yik5pat6YOo6Zeo5piv5ZCm5ZCI55CGXHJcblx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXHJcblxyXG5cdFx0XHRpZiAhb3JnYW5pemF0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XHJcblxyXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xyXG5cclxuXHRcdFx0aWYgb3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9IHJvb3Rfb3JnLm5hbWVcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgJiYgdXNlcj8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcclxuXHJcblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0aWYgIWRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XHJcblxyXG5cdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cclxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXHJcblx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXHJcblx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRcdGlmIGogPiAwXHJcblx0XHRcdFx0XHRcdGlmIGogPT0gMVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcclxuXHJcblx0XHRcdFx0XHRcdG9yZ0NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pLmNvdW50KClcclxuXHJcblx0XHRcdFx0XHRcdGlmIG9yZ0NvdW50ID09IDBcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqCgje2RlcHRfbmFtZX0p5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xyXG5cclxuXHRcdGlmIG9ubHlDaGVja1xyXG5cdFx0XHRyZXR1cm4gO1xyXG5cclxuXHRcdCMg5pWw5o2u5a+85YWlXHJcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cclxuXHRcdFx0ZXJyb3IgPSB7fVxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRzZWxlY3RvciA9IFtdXHJcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJcIlxyXG5cdFx0XHRcdCMgaWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdCMgXHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cclxuXHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtlbWFpbDogaXRlbS5lbWFpbH1cclxuXHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHttb2JpbGU6IGl0ZW0ucGhvbmV9XHJcblx0XHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXHJcblx0XHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXVxyXG5cclxuXHRcdFx0XHRub3cgPSBuZXcgRGF0ZSgpXHJcblxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXHJcblx0XHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxyXG5cdFx0XHRcdGJlbG9uZ09yZ2lkcyA9IFtdXHJcblx0XHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxyXG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxyXG5cdFx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXHJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdFx0XHRpZiBqID4gMFxyXG5cdFx0XHRcdFx0XHRcdGlmIGogPT0gMVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXHJcblxyXG5cdFx0XHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pXHJcblxyXG5cdFx0XHRcdFx0aWYgb3JnXHJcblx0XHRcdFx0XHRcdGJlbG9uZ09yZ2lkcy5wdXNoIG9yZy5faWRcclxuXHJcblxyXG5cdFx0XHRcdHVzZXJfaWQgPSBudWxsXHJcblx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0dXNlcl9pZCA9IHVzZXIuX2lkXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dWRvYyA9IHt9XHJcblx0XHRcdFx0XHR1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0dWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZFxyXG5cdFx0XHRcdFx0dWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZVxyXG5cdFx0XHRcdFx0dWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF1cclxuXHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdHVkb2MuZW1haWwgPSBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdHVkb2MuZW1haWxfdmVyaWZpZWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0dWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdHVkb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLm1vYmlsZV92ZXJpZmllZCA9IGZhbHNlXHJcblx0XHRcdFx0XHR1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXHJcblxyXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9KVxyXG5cclxuXHRcdFx0XHRpZiBzcGFjZV91c2VyXHJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRpZiAhc3BhY2VfdXNlci5vcmdhbml6YXRpb25zXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW11cclxuXHJcblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy51cGRhdGUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHskc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2N9KVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCIgb3Igc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCJcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIilcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcbiNcdFx0XHRcdFx0XHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LHskc2V0Ont1c2VybmFtZTogaXRlbS51c2VybmFtZX19KVxyXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcclxuXHRcdFx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcclxuXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0c3VfZG9jID0ge31cclxuXHRcdFx0XHRcdFx0c3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0XHRzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZFxyXG5cclxuXHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSAgdHJ1ZVxyXG5cdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiXHJcblxyXG5cdFx0XHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIlxyXG5cclxuXHRcdFx0XHRcdFx0c3VfZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXVxyXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkc1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYgdXNlcl9pZFxyXG5cdFx0XHRcdFx0XHRcdHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7IGZpZWxkczogeyB1c2VybmFtZTogMSB9IH0pXHJcblx0XHRcdFx0XHRcdFx0aWYgdXNlckluZm8udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXIgPSB1c2VyX2lkXHJcblxyXG5cdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0ZXJyb3IubGluZSA9IGkrMVxyXG5cdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvblxyXG5cdFx0XHRcdGVycm9yTGlzdC5wdXNoKGVycm9yKVxyXG5cclxuXHRcdHJldHVybiBlcnJvckxpc3RcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuXG4gIC8qXG4gIFx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG4gIFx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHRUT0RPOiDlm73pmYXljJZcbiAgICovXG4gIGltcG9ydF91c2VyczogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjaykge1xuICAgIHZhciBfc2VsZiwgYWNjZXB0ZWRfdXNlcl9jb3VudCwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VyTG9jYWxlLCBlcnJvckxpc3QsIG93bmVyX2lkLCByb290X29yZywgc3BhY2UsIHRlc3REYXRhO1xuICAgIF9zZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UgfHwgIShzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcbiAgICB9XG4gICAgaWYgKCFTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZSAhPSBudWxsID8gc3BhY2UuX2lkIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Z+656GA54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuICAgIH1cbiAgICBhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2UuX2lkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgIH0pLmNvdW50KCk7XG4gICAgaWYgKChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIChcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHs1wiICsgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgKyBcIijlvZPliY1cIiArIHNwYWNlLnVzZXJfbGltaXQgKyBcIilcIikgKyBcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpO1xuICAgIH1cbiAgICBvd25lcl9pZCA9IHNwYWNlLm93bmVyO1xuICAgIHRlc3REYXRhID0gW107XG4gICAgZXJyb3JMaXN0ID0gW107XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogX3NlbGYudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGxvY2FsZTogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIG11bHRpT3Jncywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIG9yZ2FuaXphdGlvbl9kZXB0cywgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgZW1haWw6IGl0ZW0uZW1haWxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgaWYgKCFkZXB0X25hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgcmV0dXJuIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgIHZhciBmdWxsbmFtZTtcbiAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgdmFyIG9yZ0NvdW50O1xuICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKG9yZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6ZeoKFwiICsgZGVwdF9uYW1lICsgXCIp5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAob25seUNoZWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgYmVsb25nT3JnaWRzLCBlLCBlcnJvciwgbXVsdGlPcmdzLCBub3csIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlckluZm8sIHVzZXJfaWQ7XG4gICAgICBlcnJvciA9IHt9O1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIGVtYWlsOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICAgIG1vYmlsZTogaXRlbS5waG9uZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF07XG4gICAgICAgIH1cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgIGJlbG9uZ09yZ2lkcyA9IFtdO1xuICAgICAgICBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICAgIHZhciBmdWxsbmFtZSwgb3JnLCBvcmdhbml6YXRpb25fZGVwdHM7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVsb25nT3JnaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVkb2MgPSB7fTtcbiAgICAgICAgICB1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICB1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkO1xuICAgICAgICAgIHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGU7XG4gICAgICAgICAgdWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF07XG4gICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgdWRvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgdWRvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB1ZG9jLmVtYWlsX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICB1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIHVkb2MubW9iaWxlX3ZlcmlmaWVkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgICBzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCI7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdO1xuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHM7XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcl9pZCkge1xuICAgICAgICAgICAgICB1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlckluZm8udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzdV9kb2MudXNlciA9IHVzZXJfaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgZXJyb3IubGluZSA9IGkgKyAxO1xuICAgICAgICBlcnJvci5tZXNzYWdlID0gZS5yZWFzb247XG4gICAgICAgIHJldHVybiBlcnJvckxpc3QucHVzaChlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGVycm9yTGlzdDtcbiAgfVxufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlIFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgKHJlcSwgcmVzLCBuZXh0KS0+XHJcblx0XHR0cnlcclxuXHRcdFx0Y3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKVxyXG5cclxuXHRcdFx0cXVlcnkgPSByZXEucXVlcnlcclxuXHRcdFx0c3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZFxyXG5cdFx0XHRvcmdfaWQgPSBxdWVyeS5vcmdfaWRcclxuXHRcdFx0dXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXVxyXG5cdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDpvcmdfaWR9LHtmaWVsZHM6e2Z1bGxuYW1lOjF9fSlcclxuXHRcdFx0dXNlcnNfdG9feGxzID0gbmV3IEFycmF5XHJcblx0XHRcdG5vdyA9IG5ldyBEYXRlIFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCx1c2VyX2lkKVxyXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0c29ydDoge25hbWU6IDF9XHJcblx0XHRcdFx0fSkuZmV0Y2goKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3JnX2lkcyA9IFtdXHJcblx0XHRcdFx0b3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDpvcmdfaWQsc3BhY2U6c3BhY2VfaWR9LHtmaWVsZHM6e19pZDoxLGNoaWxkcmVuOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRcdG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCdfaWQnKVxyXG5cdFx0XHRcdF8uZWFjaCBvcmdfb2Jqcywob3JnX29iaiktPlxyXG5cdFx0XHRcdFx0b3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcyxvcmdfb2JqPy5jaGlsZHJlbilcclxuXHRcdFx0XHRfLnVuaXEob3JnX2lkcylcclxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZCxvcmdhbml6YXRpb25zOnskaW46b3JnX2lkc319LHtzb3J0OiB7c29ydF9ubzogLTEsbmFtZToxfX0pLmZldGNoKClcclxuXHRcdFx0ZWpzID0gcmVxdWlyZSgnZWpzJylcclxuXHRcdFx0c3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpXHJcblx0XHRcdFxyXG5cdFx0XHQjIOajgOa1i+aYr+WQpuacieivreazlemUmeivr1xyXG5cdFx0XHRlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKVxyXG5cdFx0XHRlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSlcclxuXHRcdFx0aWYgZXJyb3Jfb2JqXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJvcl9vYmpcclxuXHJcblx0XHRcdHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKVxyXG5cclxuXHRcdFx0bGFuZyA9ICdlbidcclxuXHRcdFx0aWYgY3VycmVudF91c2VyX2luZm8ubG9jYWxlIGlzICd6aC1jbidcclxuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xyXG5cclxuXHRcdFx0b3JnTmFtZSA9IGlmIG9yZyB0aGVuIG9yZy5mdWxsbmFtZSBlbHNlIG9yZ19pZFxyXG5cdFx0XHRmaWVsZHMgPSBbe1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOiduYW1lJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidtb2JpbGUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3dvcmtfcGhvbmUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidlbWFpbCcsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidjb21wYW55JyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZToncG9zaXRpb24nLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonb3JnYW5pemF0aW9ucycsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLHt9LGxhbmcpLFxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0b3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjogdmFsdWV9fSx7ZmllbGRzOiB7ZnVsbG5hbWU6IDF9fSkubWFwKChpdGVtLGluZGV4KS0+XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uZnVsbG5hbWVcclxuXHRcdFx0XHRcdFx0KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIilcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbWFuYWdlcicsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7bmFtZTogMX19KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8ubmFtZVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid1c2VyJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7dXNlcm5hbWU6IDF9fSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/LnVzZXJuYW1lXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnTnVtYmVyJyxcclxuXHRcdFx0XHRcdG5hbWU6J3NvcnRfbm8nLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3VzZXJfYWNjZXB0ZWQnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgdGhlbiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycse30sbGFuZykgZWxzZSBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH1dXHJcblx0XHRcdFxyXG5cdFx0XHRzaGVldF9uYW1lID0gb3JnTmFtZT8ucmVwbGFjZSgvXFwvL2csXCItXCIpICPkuI3mlK/mjIFcIi9cIuespuWPt1xyXG5cdFx0XHRyZXQgPSB0ZW1wbGF0ZSh7XHJcblx0XHRcdFx0bGFuZzogbGFuZyxcclxuXHRcdFx0XHRzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxyXG5cdFx0XHRcdGZpZWxkczogZmllbGRzLFxyXG5cdFx0XHRcdHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXHJcblx0XHRcdH0pXHJcblxyXG5cdFx0XHRmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcclxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiK2VuY29kZVVSSShmaWxlTmFtZSkpXHJcblx0XHRcdHJlcy5lbmQocmV0KVxyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdFx0cmVzLmVuZChlLm1lc3NhZ2UpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBlanMsIGVqc0xpbnQsIGVycm9yX29iaiwgZmllbGRzLCBmaWxlTmFtZSwgbGFuZywgbm93LCBvcmcsIG9yZ05hbWUsIG9yZ19pZCwgb3JnX2lkcywgb3JnX29ianMsIHF1ZXJ5LCByZXQsIHNoZWV0X25hbWUsIHNwYWNlX2lkLCBzdHIsIHRlbXBsYXRlLCB1c2VyX2lkLCB1c2Vyc190b194bHM7XG4gICAgdHJ5IHtcbiAgICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgICAgIHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWQ7XG4gICAgICBvcmdfaWQgPSBxdWVyeS5vcmdfaWQ7XG4gICAgICB1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddO1xuICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvcmdfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB1c2Vyc190b194bHMgPSBuZXcgQXJyYXk7XG4gICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcl9pZCkpIHtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3JnX2lkcyA9IFtdO1xuICAgICAgICBvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgX2lkOiBvcmdfaWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywgJ19pZCcpO1xuICAgICAgICBfLmVhY2gob3JnX29ianMsIGZ1bmN0aW9uKG9yZ19vYmopIHtcbiAgICAgICAgICByZXR1cm4gb3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcywgb3JnX29iaiAhPSBudWxsID8gb3JnX29iai5jaGlsZHJlbiA6IHZvaWQgMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBfLnVuaXEob3JnX2lkcyk7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkaW46IG9yZ19pZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAtMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBlanMgPSByZXF1aXJlKCdlanMnKTtcbiAgICAgIHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKTtcbiAgICAgIGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpO1xuICAgICAgZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pO1xuICAgICAgaWYgKGVycm9yX29iaikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yX29iaik7XG4gICAgICB9XG4gICAgICB0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cik7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmIChjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICBvcmdOYW1lID0gb3JnID8gb3JnLmZ1bGxuYW1lIDogb3JnX2lkO1xuICAgICAgZmllbGRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21vYmlsZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnd29ya19waG9uZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2NvbXBhbnknLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdwb3NpdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25zJyxcbiAgICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBvcmdOYW1lcztcbiAgICAgICAgICAgIG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiB2YWx1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mdWxsbmFtZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtYW5hZ2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci51c2VybmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICAgICAgICBuYW1lOiAnc29ydF9ubycsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcl9hY2NlcHRlZCcsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBzaGVldF9uYW1lID0gb3JnTmFtZSAhPSBudWxsID8gb3JnTmFtZS5yZXBsYWNlKC9cXC8vZywgXCItXCIpIDogdm9pZCAwO1xuICAgICAgcmV0ID0gdGVtcGxhdGUoe1xuICAgICAgICBsYW5nOiBsYW5nLFxuICAgICAgICBzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgdXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcbiAgICAgIH0pO1xuICAgICAgZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIjtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIgKyBlbmNvZGVVUkkoZmlsZU5hbWUpKTtcbiAgICAgIHJldHVybiByZXMuZW5kKHJldCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gcmVzLmVuZChlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
