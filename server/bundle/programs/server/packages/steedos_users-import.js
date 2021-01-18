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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImVycm9yTGlzdCIsIm93bmVyX2lkIiwicm9vdF9vcmciLCJzcGFjZSIsInRlc3REYXRhIiwidXNlcklkIiwiRXJyb3IiLCJkYiIsIm9yZ2FuaXphdGlvbnMiLCJmaW5kT25lIiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJTdGVlZG9zIiwiaGFzRmVhdHVyZSIsIl9pZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJmb3JFYWNoIiwiaXRlbSIsImkiLCJtdWx0aU9yZ3MiLCJvcGVyYXRpbmciLCJvcmdhbml6YXRpb24iLCJvcmdhbml6YXRpb25fZGVwdHMiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIm1vYmlsZSIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlsX3ZlcmlmaWVkIiwibW9iaWxlX3ZlcmlmaWVkIiwiaW5zZXJ0IiwiQWNjb3VudHMiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIl8iLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwic3RhcnR1cCIsIldlYkFwcCIsImNvbm5lY3RIYW5kbGVycyIsInVzZSIsInJlcSIsInJlcyIsIm5leHQiLCJjdXJyZW50X3VzZXJfaW5mbyIsImVqcyIsImVqc0xpbnQiLCJlcnJvcl9vYmoiLCJmaWxlTmFtZSIsImxhbmciLCJvcmdOYW1lIiwib3JnX2lkIiwib3JnX2lkcyIsIm9yZ19vYmpzIiwicXVlcnkiLCJyZXQiLCJzaGVldF9uYW1lIiwic3RyIiwidGVtcGxhdGUiLCJ1c2Vyc190b194bHMiLCJ1dWZsb3dNYW5hZ2VyIiwiY2hlY2tfYXV0aG9yaXphdGlvbiIsIkFycmF5IiwiaXNTcGFjZUFkbWluIiwic29ydCIsImNoaWxkcmVuIiwicGx1Y2siLCJlYWNoIiwib3JnX29iaiIsInVuaW9uIiwiJGluIiwicmVxdWlyZSIsIkFzc2V0cyIsImdldFRleHQiLCJsaW50IiwiY29uc29sZSIsImNvbXBpbGUiLCJ0eXBlIiwid2lkdGgiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRyYW5zZm9ybSIsInZhbHVlIiwib3JnTmFtZXMiLCJtYXAiLCJpbmRleCIsImpvaW4iLCJyZXBsYWNlIiwibW9tZW50IiwiZm9ybWF0Iiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiZW5kIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLFNBQU8sUUFEUztBQUVoQixjQUFZO0FBRkksQ0FBRCxFQUdiLHNCQUhhLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0RBSSxPQUFPQyxPQUFQLENBQ0M7QUFBQTs7Ozs7O0tBT0FDLGNBQWMsVUFBQ0MsUUFBRCxFQUFXQyxPQUFYLEVBQW9CQyxJQUFwQixFQUEwQkMsU0FBMUI7QUFFYixRQUFBQyxLQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFdBQUEsRUFBQUMsaUJBQUEsRUFBQUMsU0FBQSxFQUFBQyxRQUFBLEVBQUFDLFFBQUEsRUFBQUMsS0FBQSxFQUFBQyxRQUFBOztBQUFBUixZQUFRLElBQVI7O0FBRUEsUUFBRyxDQUFDLEtBQUtTLE1BQVQ7QUFDQyxZQUFNLElBQUloQixPQUFPaUIsS0FBWCxDQUFpQixHQUFqQixFQUFzQixNQUF0QixDQUFOO0FDQ0U7O0FE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VixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcbn0sICdzdGVlZG9zOnVzZXJzLWltcG9ydCcpO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0IyMjXG5cdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcblx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG5cdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdFRPRE86IOWbvemZheWMllxuXHQjIyNcblx0aW1wb3J0X3VzZXJzOiAoc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjayktPlxuXG5cdFx0X3NlbGYgPSB0aGlzXG5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKVxuXG5cdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgcGFyZW50OiBudWxsfSlcblxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZT8uYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuXG5cdFx0aWYgIVN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlPy5faWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLln7rnoYDniYjkuI3mlK/mjIHmraTlip/og71cIik7XG5cblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRpZiAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHsyN7YWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RofSjlvZPliY0je3NwYWNlLnVzZXJfbGltaXR9KVwiICtcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpXG5cblx0XHRvd25lcl9pZCA9IHNwYWNlLm93bmVyXG5cblx0XHR0ZXN0RGF0YSA9IFtdXG5cblx0XHRlcnJvckxpc3QgPSBbXVxuXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IF9zZWxmLnVzZXJJZH0se2ZpZWxkczp7bG9jYWxlOjEscGhvbmU6MX19KVxuXHRcdGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlXG5cblx0XHQjIOaVsOaNrue7n+S4gOagoemqjFxuXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XG5cdFx0XHQjIGNvbnNvbGUubG9nIGl0ZW1cblx0XHRcdCMg55So5oi35ZCN77yM5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XG5cdFx0XHRpZiAhaXRlbS5waG9uZSBhbmQgIWl0ZW0uZW1haWxcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKVxuXG5cdFx0XHQjIOWIpOaWrWV4Y2Vs5Lit55qE5pWw5o2u77yM55So5oi35ZCN44CB5omL5py65Y+3562J5L+h5oGv5piv5ZCm5pyJ6K+vXG5cdFx0XHR0ZXN0T2JqID0ge31cblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0dGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0dGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tuagvOW8j+mUmeivryN7aXRlbS5lbWFpbH1cIik7XG5cblx0XHRcdFx0dGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bph43lpI1cIik7XG5cblx0XHRcdGl0ZW0uc3BhY2UgPSBzcGFjZV9pZFxuXG5cdFx0XHR0ZXN0RGF0YS5wdXNoKHRlc3RPYmopXG5cblx0XHRcdCMg6I635Y+W5p+l5om+dXNlcueahOadoeS7tlxuXHRcdFx0c2VsZWN0b3IgPSBbXVxuXHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7ZW1haWw6IGl0ZW0uZW1haWx9XG5cdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge21vYmlsZTogaXRlbS5waG9uZX1cblxuXHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXG5cblxuXHRcdFx0IyDlhYjliKTmlq3mmK/lkKbog73ljLnphY3liLDllK/kuIDnmoR1c2Vy77yM54S25ZCO5Yik5pat6K+l55So5oi35pivaW5zZXJ05Yiwc3BhY2VfdXNlcnPov5jmmK91cGRhdGVcblx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5faWRcblx0XHRcdFx0c3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJ9KVxuXHRcdFx0XHRpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcInVwZGF0ZVwiXG5cdFx0XHRcdGVsc2UgaWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAwXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAwXG5cdFx0XHRcdCMg5paw5aKec3BhY2VfdXNlcnPnmoTmlbDmja7moKHpqoxcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxuXG5cdFx0XHQjIOWIpOaWreaYr+WQpuiDveS/ruaUueeUqOaIt+eahOWvhueggVxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCBhbmQgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuZmV0Y2goKVswXS5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuXG5cdFx0XHQjIOWIpOaWremDqOmXqOaYr+WQpuWQiOeQhlxuXHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cblxuXHRcdFx0aWYgIW9yZ2FuaXphdGlvblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcblxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcblxuXHRcdFx0aWYgb3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9IHJvb3Rfb3JnLm5hbWVcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XG5cblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgJiYgdXNlcj8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG5cblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdGlmICFkZXB0X25hbWVcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcblxuXHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXG5cdFx0XHRcdGZ1bGxuYW1lID0gXCJcIlxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxuXHRcdFx0XHRcdGlmIGogPiAwXG5cdFx0XHRcdFx0XHRpZiBqID09IDFcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lXG5cblx0XHRcdFx0XHRcdG9yZ0NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pLmNvdW50KClcblxuXHRcdFx0XHRcdFx0aWYgb3JnQ291bnQgPT0gMFxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqCgje2RlcHRfbmFtZX0p5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuXG5cdFx0aWYgb25seUNoZWNrXG5cdFx0XHRyZXR1cm4gO1xuXG5cdFx0IyDmlbDmja7lr7zlhaVcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cblx0XHRcdGVycm9yID0ge31cblx0XHRcdHRyeVxuXHRcdFx0XHRzZWxlY3RvciA9IFtdXG5cdFx0XHRcdG9wZXJhdGluZyA9IFwiXCJcblx0XHRcdFx0IyBpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdCMgXHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cblx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge2VtYWlsOiBpdGVtLmVtYWlsfVxuXHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7bW9iaWxlOiBpdGVtLnBob25lfVxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblx0XHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXVxuXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcblxuXHRcdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdGJlbG9uZ09yZ2lkcyA9IFtdXG5cdFx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXG5cdFx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0XHRcdGlmIGogPiAwXG5cdFx0XHRcdFx0XHRcdGlmIGogPT0gMVxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcblxuXHRcdFx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KVxuXG5cdFx0XHRcdFx0aWYgb3JnXG5cdFx0XHRcdFx0XHRiZWxvbmdPcmdpZHMucHVzaCBvcmcuX2lkXG5cblxuXHRcdFx0XHR1c2VyX2lkID0gbnVsbFxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR1ZG9jID0ge31cblx0XHRcdFx0XHR1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdHVkb2Muc3RlZWRvc19pZCA9IGl0ZW0uZW1haWwgfHwgdWRvYy5faWRcblx0XHRcdFx0XHR1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlXG5cdFx0XHRcdFx0dWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF1cblx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHVkb2MubmFtZSA9IGl0ZW0ubmFtZVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdHVkb2MuZW1haWxfdmVyaWZpZWQgPSBmYWxzZVxuXG5cdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRcdFx0dWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcblxuXHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdHVkb2MubW9iaWxlID0gaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0dWRvYy5tb2JpbGVfdmVyaWZpZWQgPSBmYWxzZVxuXHRcdFx0XHRcdHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYylcblxuXHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcblx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcblxuXHRcdFx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSlcblxuXHRcdFx0XHRpZiBzcGFjZV91c2VyXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGlmICFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnNcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW11cblxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge31cblxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm9yZ2FuaXphdGlvbnMgPSBfLnVuaXEoc3BhY2VfdXNlci5vcmdhbml6YXRpb25zLmNvbmNhdChiZWxvbmdPcmdpZHMpKVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5uYW1lID0gaXRlbS5uYW1lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXG5cblx0XHRcdFx0XHRcdGlmIF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMudXBkYXRlKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9LCB7JHNldDogc3BhY2VfdXNlcl91cGRhdGVfZG9jfSlcblxuXHRcdFx0XHRcdFx0aWYgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCIgb3Igc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi36L+Y5pyq5o6l5Y+X5Yqg5YWl5bel5L2c5Yy677yM5LiN6IO95L+u5pS55LuW55qE5Liq5Lq65L+h5oGvXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG4jXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG4jXHRcdFx0XHRcdFx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSx7JHNldDp7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9fSlcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxuXHRcdFx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdHN1X2RvYyA9IHt9XG5cdFx0XHRcdFx0XHRzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZFxuXG5cdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9ICB0cnVlXG5cdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiXG5cblx0XHRcdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCJcblxuXHRcdFx0XHRcdFx0c3VfZG9jLm5hbWUgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXVxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHNcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxuXHRcdFx0XHRcdFx0XHRzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xuXHRcdFx0XHRcdFx0XHRzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0aWYgdXNlcl9pZFxuXHRcdFx0XHRcdFx0XHR1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwgeyBmaWVsZHM6IHsgdXNlcm5hbWU6IDEgfSB9KVxuXHRcdFx0XHRcdFx0XHRpZiB1c2VySW5mby51c2VybmFtZVxuXHRcdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VybmFtZSA9IHVzZXJJbmZvLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VyID0gdXNlcl9pZFxuXG5cdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRlcnJvci5saW5lID0gaSsxXG5cdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvblxuXHRcdFx0XHRlcnJvckxpc3QucHVzaChlcnJvcilcblxuXHRcdHJldHVybiBlcnJvckxpc3RcbiIsIk1ldGVvci5tZXRob2RzKHtcblxuICAvKlxuICBcdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxuICBcdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0VE9ETzog5Zu96ZmF5YyWXG4gICAqL1xuICBpbXBvcnRfdXNlcnM6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spIHtcbiAgICB2YXIgX3NlbGYsIGFjY2VwdGVkX3VzZXJfY291bnQsIGN1cnJlbnRVc2VyLCBjdXJyZW50VXNlckxvY2FsZSwgZXJyb3JMaXN0LCBvd25lcl9pZCwgcm9vdF9vcmcsIHNwYWNlLCB0ZXN0RGF0YTtcbiAgICBfc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICEoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZCkgOiB2b2lkIDApKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XG4gICAgfVxuICAgIGlmICghU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UgIT0gbnVsbCA/IHNwYWNlLl9pZCA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWfuuehgOeJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcbiAgICB9XG4gICAgYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlLl9pZCxcbiAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICB9KS5jb3VudCgpO1xuICAgIGlmICgoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAoXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7NcIiArIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpICsgXCIo5b2T5YmNXCIgKyBzcGFjZS51c2VyX2xpbWl0ICsgXCIpXCIpICsgXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKTtcbiAgICB9XG4gICAgb3duZXJfaWQgPSBzcGFjZS5vd25lcjtcbiAgICB0ZXN0RGF0YSA9IFtdO1xuICAgIGVycm9yTGlzdCA9IFtdO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IF9zZWxmLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBsb2NhbGU6IDEsXG4gICAgICAgIHBob25lOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGU7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBtdWx0aU9yZ3MsIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBvcmdhbml6YXRpb25fZGVwdHMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VsZWN0b3IsIHNwYWNlVXNlckV4aXN0LCB0ZXN0T2JqLCB1c2VyLCB1c2VyRXhpc3Q7XG4gICAgICBpZiAoIWl0ZW0ucGhvbmUgJiYgIWl0ZW0uZW1haWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKTtcbiAgICAgIH1cbiAgICAgIHRlc3RPYmogPSB7fTtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vXCIgKyBpdGVtLmVtYWlsKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu26YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVtLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICB0ZXN0RGF0YS5wdXNoKHRlc3RPYmopO1xuICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICB1c2VybmFtZTogaXRlbS51c2VybmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIGVtYWlsOiBpdGVtLmVtYWlsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7XG4gICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXJFeGlzdC5jb3VudCgpID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZDtcbiAgICAgICAgc3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcInVwZGF0ZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcImluc2VydFwiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAwKSB7XG4gICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiB1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICBpZiAoKHJlZiA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvbjtcbiAgICAgIGlmICghb3JnYW5pemF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcbiAgICAgIGlmIChvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT09IHJvb3Rfb3JnLm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiAodXNlciAhPSBudWxsID8gKHJlZjIgPSB1c2VyLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgIGlmICghZGVwdF9uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgIHJldHVybiBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICB2YXIgZnVsbG5hbWU7XG4gICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgIHZhciBvcmdDb3VudDtcbiAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChvcmdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumDqOmXqChcIiArIGRlcHRfbmFtZSArIFwiKeS4jeWtmOWcqO+8jOivt+WFiOWIm+W7ulwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKG9ubHlDaGVjaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIGJlbG9uZ09yZ2lkcywgZSwgZXJyb3IsIG11bHRpT3Jncywgbm93LCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgc2VsZWN0b3IsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfdXBkYXRlX2RvYywgc3VfZG9jLCB1ZG9jLCB1c2VyLCB1c2VyRXhpc3QsIHVzZXJJbmZvLCB1c2VyX2lkO1xuICAgICAgZXJyb3IgPSB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdG9yID0gW107XG4gICAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBlbWFpbDogaXRlbS5lbWFpbFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdO1xuICAgICAgICB9XG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICBiZWxvbmdPcmdpZHMgPSBbXTtcbiAgICAgICAgbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgICB2YXIgZnVsbG5hbWUsIG9yZywgb3JnYW5pemF0aW9uX2RlcHRzO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIGJlbG9uZ09yZ2lkcy5wdXNoKG9yZy5faWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJfaWQgPSBudWxsO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1ZG9jID0ge307XG4gICAgICAgICAgdWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgdWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZDtcbiAgICAgICAgICB1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlO1xuICAgICAgICAgIHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdO1xuICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgIHVkb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgdWRvYy5lbWFpbF92ZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgdWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICB1ZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgICAgICB1ZG9jLm1vYmlsZV92ZXJpZmllZCA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpO1xuICAgICAgICAgIGlmIChpdGVtLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgIGxvZ291dDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChzcGFjZV91c2VyKSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoIXNwYWNlX3VzZXIub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9O1xuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm9yZ2FuaXphdGlvbnMgPSBfLnVuaXEoc3BhY2VfdXNlci5vcmdhbml6YXRpb25zLmNvbmNhdChiZWxvbmdPcmdpZHMpKTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uY29tcGFueSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS53b3JrX3Bob25lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5zb3J0X25vKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgZGIuc3BhY2VfdXNlcnMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDogc3BhY2VfdXNlcl91cGRhdGVfZG9jXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIiB8fCBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi36L+Y5pyq5o6l5Y+X5Yqg5YWl5bel5L2c5Yy677yM5LiN6IO95L+u5pS55LuW55qE5Liq5Lq65L+h5oGvXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VfZG9jID0ge307XG4gICAgICAgICAgICBzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgc3VfZG9jLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXTtcbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzO1xuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVzZXJfaWQpIHtcbiAgICAgICAgICAgICAgdXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgc3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXIgPSB1c2VyX2lkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGVycm9yLmxpbmUgPSBpICsgMTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGUucmVhc29uO1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0LnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlcnJvckxpc3Q7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UgXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpLT5cblx0XHR0cnlcblx0XHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcblxuXHRcdFx0cXVlcnkgPSByZXEucXVlcnlcblx0XHRcdHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWRcblx0XHRcdG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZFxuXHRcdFx0dXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6b3JnX2lkfSx7ZmllbGRzOntmdWxsbmFtZToxfX0pXG5cdFx0XHR1c2Vyc190b194bHMgPSBuZXcgQXJyYXlcblx0XHRcdG5vdyA9IG5ldyBEYXRlIFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsdXNlcl9pZClcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRzb3J0OiB7bmFtZTogMX1cblx0XHRcdFx0fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcmdfaWRzID0gW11cblx0XHRcdFx0b3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDpvcmdfaWQsc3BhY2U6c3BhY2VfaWR9LHtmaWVsZHM6e19pZDoxLGNoaWxkcmVuOjF9fSkuZmV0Y2goKVxuXHRcdFx0XHRvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywnX2lkJylcblx0XHRcdFx0Xy5lYWNoIG9yZ19vYmpzLChvcmdfb2JqKS0+XG5cdFx0XHRcdFx0b3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcyxvcmdfb2JqPy5jaGlsZHJlbilcblx0XHRcdFx0Xy51bmlxKG9yZ19pZHMpXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkLG9yZ2FuaXphdGlvbnM6eyRpbjpvcmdfaWRzfX0se3NvcnQ6IHtzb3J0X25vOiAtMSxuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWpzID0gcmVxdWlyZSgnZWpzJylcblx0XHRcdHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKVxuXHRcdFx0XG5cdFx0XHQjIOajgOa1i+aYr+WQpuacieivreazlemUmeivr1xuXHRcdFx0ZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jylcblx0XHRcdGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KVxuXHRcdFx0aWYgZXJyb3Jfb2JqXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yX29ialxuXG5cdFx0XHR0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cilcblxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cblx0XHRcdG9yZ05hbWUgPSBpZiBvcmcgdGhlbiBvcmcuZnVsbG5hbWUgZWxzZSBvcmdfaWRcblx0XHRcdGZpZWxkcyA9IFt7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonbmFtZScsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtb2JpbGUnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTond29ya19waG9uZScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonZW1haWwnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidjb21wYW55Jyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidwb3NpdGlvbicsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J29yZ2FuaXphdGlvbnMnLFxuXHRcdFx0XHRcdHdpZHRoOiA2MDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLHt9LGxhbmcpLFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB2YWx1ZX19LHtmaWVsZHM6IHtmdWxsbmFtZTogMX19KS5tYXAoKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uZnVsbG5hbWVcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtYW5hZ2VyJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7bmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/Lm5hbWVcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcicsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHt1c2VybmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/LnVzZXJuYW1lXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdOdW1iZXInLFxuXHRcdFx0XHRcdG5hbWU6J3NvcnRfbm8nLFxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcl9hY2NlcHRlZCcsXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgdGhlbiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycse30sbGFuZykgZWxzZSBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJyx7fSxsYW5nKVxuXHRcdFx0XHR9XVxuXHRcdFx0XG5cdFx0XHRzaGVldF9uYW1lID0gb3JnTmFtZT8ucmVwbGFjZSgvXFwvL2csXCItXCIpICPkuI3mlK/mjIFcIi9cIuespuWPt1xuXHRcdFx0cmV0ID0gdGVtcGxhdGUoe1xuXHRcdFx0XHRsYW5nOiBsYW5nLFxuXHRcdFx0XHRzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcblx0XHRcdFx0dXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcblx0XHRcdH0pXG5cblx0XHRcdGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIitlbmNvZGVVUkkoZmlsZU5hbWUpKVxuXHRcdFx0cmVzLmVuZChyZXQpXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRyZXMuZW5kKGUubWVzc2FnZSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY3VycmVudF91c2VyX2luZm8sIGUsIGVqcywgZWpzTGludCwgZXJyb3Jfb2JqLCBmaWVsZHMsIGZpbGVOYW1lLCBsYW5nLCBub3csIG9yZywgb3JnTmFtZSwgb3JnX2lkLCBvcmdfaWRzLCBvcmdfb2JqcywgcXVlcnksIHJldCwgc2hlZXRfbmFtZSwgc3BhY2VfaWQsIHN0ciwgdGVtcGxhdGUsIHVzZXJfaWQsIHVzZXJzX3RvX3hscztcbiAgICB0cnkge1xuICAgICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgICAgc3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZDtcbiAgICAgIG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZDtcbiAgICAgIHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9yZ19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheTtcbiAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VyX2lkKSkge1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmdfaWRzID0gW107XG4gICAgICAgIG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBfaWQ6IG9yZ19pZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgY2hpbGRyZW46IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCAnX2lkJyk7XG4gICAgICAgIF8uZWFjaChvcmdfb2JqcywgZnVuY3Rpb24ob3JnX29iaikge1xuICAgICAgICAgIHJldHVybiBvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLCBvcmdfb2JqICE9IG51bGwgPyBvcmdfb2JqLmNoaWxkcmVuIDogdm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8udW5pcShvcmdfaWRzKTtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRpbjogb3JnX2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IC0xLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuICAgICAgc3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpO1xuICAgICAgZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jyk7XG4gICAgICBlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSk7XG4gICAgICBpZiAoZXJyb3Jfb2JqKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3Jfb2JqKTtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKTtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIG9yZ05hbWUgPSBvcmcgPyBvcmcuZnVsbG5hbWUgOiBvcmdfaWQ7XG4gICAgICBmaWVsZHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbW9iaWxlJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd3b3JrX3Bob25lJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnY29tcGFueScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9yZ05hbWVzO1xuICAgICAgICAgICAgb3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLmZ1bGxuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21hbmFnZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICAgIG5hbWU6ICdzb3J0X25vJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyX2FjY2VwdGVkJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHNoZWV0X25hbWUgPSBvcmdOYW1lICE9IG51bGwgPyBvcmdOYW1lLnJlcGxhY2UoL1xcLy9nLCBcIi1cIikgOiB2b2lkIDA7XG4gICAgICByZXQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICB1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuICAgICAgfSk7XG4gICAgICBmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIHJlcy5lbmQocmV0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiByZXMuZW5kKGUubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
