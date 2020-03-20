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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:users-import":{"i18n":{"en.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/i18n/en.i18n.json.js                                                    //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('en','',{"steedos_contacts_import_users":"Import users","steedos_contacts_import_users_note":"Note","steedos_contacts_import_users_note_detail":"<p> The data file must be Excel </ p> <p> 1, the department must be full path. If the department does not exist, then automatically create </ p> <p> 2, import the user if it does not exist, then automatically created; only the new user support set password </ p> <p> 3, if the user exists, Join the current space to modify the user information. If the imported attribute is empty, do not modify this attribute value </ p>","steedos_contacts_import_users_data_file_title":"Data file(Excel)","steedos_contacts_import_users_download_simple_data_file":"Download the import template","steedos_contacts_import_users_match_user_base_username":"Match users based on username","steedos_contacts_import_users_match_user_base_email":"Match users based on email","steedos_contacts_import_users_match_user_base_mobile":"Match users based on mobile","steedos_contacts_import_users_preview":"Preview","steedos_contacts_import_users_title":"Import","steedos_contacts_import_users_check":"Check","steedos_contacts_import_users_organization":"Organization","steedos_contacts_import_users_username":"Username","steedos_contacts_import_users_email":"Email","steedos_contacts_import_users_name":"Name","steedos_contacts_import_users_position":"Position","steedos_contacts_import_users_work_phone":"Office Phone","steedos_contacts_import_users_phone":"Phone","steedos_contacts_import_users_user_accepted":"Accepted","steedos_contacts_import_users_sort_no":"Sort number","steedos_contacts_import_users_password":"Password","steedos_contacts_import_users_file_error":"The file type must be excel","steedos_contacts_import_users_select_file":"Please select the file you want to import","steedos_contacts_import_users_import_success":"Import success","steedos_contacts_import_users_check_success":"Check success"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/i18n/zh-CN.i18n.json.js                                                 //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"steedos_contacts_import_users":"导入用户","steedos_contacts_import_users_note":"导入规则","steedos_contacts_import_users_note_detail":"<p>数据文件必须为Excel</p><p>1、部门必须为全路径（例如：上海华炎软件/研发部）。如果部门不存在，请先创建</p><p>2、导入用户如果不存在，则自动创建; 只有新建的用户支持设置密码</p><p>3、导入用户如果存在，并且已加入当前工作区，则修改用户信息。如果导入的属性为空，则不修改此属性值</p>","steedos_contacts_import_users_data_file_title":"数据文件(Excel)","steedos_contacts_import_users_download_simple_data_file":"下载导入模板","steedos_contacts_import_users_match_user_base_username":"根据用户名匹配用户","steedos_contacts_import_users_match_user_base_email":"根据邮箱匹配用户","steedos_contacts_import_users_match_user_base_mobile":"根据手机号匹配用户","steedos_contacts_import_users_preview":"数据预览","steedos_contacts_import_users_title":"导入","steedos_contacts_import_users_check":"数据校验","steedos_contacts_import_users_organization":"所属部门","steedos_contacts_import_users_username":"用户名","steedos_contacts_import_users_email":"邮箱","steedos_contacts_import_users_name":"姓名","steedos_contacts_import_users_position":"职务","steedos_contacts_import_users_work_phone":"固定电话","steedos_contacts_import_users_phone":"手机","steedos_contacts_import_users_user_accepted":"有效","steedos_contacts_import_users_sort_no":"排序号","steedos_contacts_import_users_password":"密码","steedos_contacts_import_users_file_error":"文件必须为excel","steedos_contacts_import_users_select_file":"请选择需要导入的文件","steedos_contacts_import_users_import_success":"导入已完成","steedos_contacts_import_users_check_success":"校验通过"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"checkNpm.js":function(require,exports,module){

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
      throw new Meteor.Error(401, "标准版不支持此功能");
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
    ".i18n.json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:users-import/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:users-import/i18n/zh-CN.i18n.json.js");
require("/node_modules/meteor/steedos:users-import/checkNpm.js");
require("/node_modules/meteor/steedos:users-import/server/methods/import_users.coffee");
require("/node_modules/meteor/steedos:users-import/routes/api_space_users_export.coffee");

/* Exports */
Package._define("steedos:users-import");

})();

//# sourceURL=meteor://💻app/packages/steedos_users-import.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImN1cnJlbnRVc2VyUGhvbmVQcmVmaXgiLCJlcnJvckxpc3QiLCJvd25lcl9pZCIsInJvb3Rfb3JnIiwic3BhY2UiLCJ0ZXN0RGF0YSIsInVzZXJJZCIsIkVycm9yIiwiZGIiLCJvcmdhbml6YXRpb25zIiwiZmluZE9uZSIsInBhcmVudCIsInNwYWNlcyIsImFkbWlucyIsImluY2x1ZGVzIiwiaXNfcGFpZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsIl9pZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJBY2NvdW50cyIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsIm1vZGlmaWVkIiwiaW5zZXJ0Iiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJfIiwidW5pcSIsImNvbmNhdCIsImNvbXBhbnkiLCJwb3NpdGlvbiIsIndvcmtfcGhvbmUiLCJzb3J0X25vIiwia2V5cyIsInVwZGF0ZSIsIiRzZXQiLCJpbnZpdGVfc3RhdGUiLCJlcnJvcjEiLCJsaW5lIiwibWVzc2FnZSIsInJlYXNvbiIsInN0YXJ0dXAiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2luZm8iLCJlanMiLCJlanNMaW50IiwiZXJyb3Jfb2JqIiwiZmlsZU5hbWUiLCJsYW5nIiwib3JnTmFtZSIsIm9yZ19pZCIsIm9yZ19pZHMiLCJvcmdfb2JqcyIsInF1ZXJ5IiwicmV0Iiwic2hlZXRfbmFtZSIsInN0ciIsInRlbXBsYXRlIiwidXNlcnNfdG9feGxzIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJBcnJheSIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsInR5cGUiLCJ3aWR0aCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFDckJILGdCQUFnQixDQUFDO0FBQ2hCLFNBQU8sUUFEUztBQUVoQixjQUFZO0FBRkksQ0FBRCxFQUdiLHNCQUhhLENBQWhCLEM7Ozs7Ozs7Ozs7OztBQ0RBSSxPQUFPQyxPQUFQLENBQ0M7QUFBQTs7Ozs7O0tBT0FDLGNBQWMsVUFBQ0MsUUFBRCxFQUFXQyxPQUFYLEVBQW9CQyxJQUFwQixFQUEwQkMsU0FBMUI7QUFFYixRQUFBQyxLQUFBLEVBQUFDLG1CQUFBLEVBQUFDLFdBQUEsRUFBQUMsaUJBQUEsRUFBQUMsc0JBQUEsRUFBQUMsU0FBQSxFQUFBQyxRQUFBLEVBQUFDLFFBQUEsRUFBQUMsS0FBQSxFQUFBQyxRQUFBOztBQUFBVCxZ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O0FBRWRPLG9CQUFZQSxVQUZFO0FBR2RsRyxnQkFBUUEsTUFITTtBQUlkcUcsc0JBQWNBO0FBSkEsT0FBVCxDQUFOO0FBT0FYLGlCQUFXLHFCQUFxQjBDLFNBQVNDLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBckIsR0FBdUQsTUFBbEU7QUFDQWpELFVBQUlrRCxTQUFKLENBQWMsY0FBZCxFQUE4QiwwQkFBOUI7QUFDQWxELFVBQUlrRCxTQUFKLENBQWMscUJBQWQsRUFBcUMseUJBQXVCQyxVQUFVN0MsUUFBVixDQUE1RDtBQ3lERyxhRHhESE4sSUFBSW9ELEdBQUosQ0FBUXZDLEdBQVIsQ0N3REc7QURsTEosYUFBQXZELEtBQUE7QUEySE1ELFVBQUFDLEtBQUE7QUFDTDRFLGNBQVE1RSxLQUFSLENBQWNELEVBQUVnRyxLQUFoQjtBQzBERyxhRHpESHJELElBQUlvRCxHQUFKLENBQVEvRixFQUFFb0MsT0FBVixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJlanNcIjogXCJeMi41LjVcIixcclxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcclxufSwgJ3N0ZWVkb3M6dXNlcnMtaW1wb3J0Jyk7XHJcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0IyMjXHJcblx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXHJcblx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHRUT0RPOiDlm73pmYXljJZcclxuXHQjIyNcclxuXHRpbXBvcnRfdXNlcnM6IChzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKS0+XHJcblxyXG5cdFx0X3NlbGYgPSB0aGlzXHJcblxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKVxyXG5cclxuXHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHBhcmVudDogbnVsbH0pXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2U/LmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xyXG5cclxuXHRcdGlmICFzcGFjZS5pc19wYWlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuagh+WHhueJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcclxuXHJcblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdGlmIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7Mje2FjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aH0o5b2T5YmNI3tzcGFjZS51c2VyX2xpbWl0fSlcIiArXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKVxyXG5cclxuXHRcdG93bmVyX2lkID0gc3BhY2Uub3duZXJcclxuXHJcblx0XHR0ZXN0RGF0YSA9IFtdXHJcblxyXG5cdFx0ZXJyb3JMaXN0ID0gW11cclxuXHJcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogX3NlbGYudXNlcklkfSx7ZmllbGRzOntsb2NhbGU6MSxwaG9uZToxfX0pXHJcblx0XHRjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZVxyXG5cdFx0Y3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4IGN1cnJlbnRVc2VyXHJcblxyXG5cdFx0IyDmlbDmja7nu5/kuIDmoKHpqoxcclxuXHJcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cclxuXHRcdFx0IyBjb25zb2xlLmxvZyBpdGVtXHJcblx0XHRcdCMg55So5oi35ZCN77yM5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XHJcblx0XHRcdGlmICFpdGVtLnBob25lIGFuZCAhaXRlbS5lbWFpbFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIilcclxuXHJcblx0XHRcdCMg5Yik5patZXhjZWzkuK3nmoTmlbDmja7vvIznlKjmiLflkI3jgIHmiYvmnLrlj7fnrYnkv6Hmga/mmK/lkKbmnInor69cclxuXHRcdFx0dGVzdE9iaiA9IHt9XHJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHR0ZXN0T2JqLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XHJcblxyXG5cdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0dGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tuagvOW8j+mUmeivryN7aXRlbS5lbWFpbH1cIik7XHJcblxyXG5cdFx0XHRcdHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tumHjeWkjVwiKTtcclxuXHJcblx0XHRcdGl0ZW0uc3BhY2UgPSBzcGFjZV9pZFxyXG5cclxuXHRcdFx0dGVzdERhdGEucHVzaCh0ZXN0T2JqKVxyXG5cclxuXHRcdFx0IyDojrflj5bmn6Xmib51c2Vy55qE5p2h5Lu2XHJcblx0XHRcdHNlbGVjdG9yID0gW11cclxuXHRcdFx0b3BlcmF0aW5nID0gXCJcIlxyXG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XHJcblx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWx9XHJcblx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJ9XHJcblxyXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHJcblxyXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxyXG5cdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkXHJcblx0XHRcdFx0c3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJ9KVxyXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJ1cGRhdGVcIlxyXG5cdFx0XHRcdGVsc2UgaWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAwXHJcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMFxyXG5cdFx0XHRcdCMg5paw5aKec3BhY2VfdXNlcnPnmoTmlbDmja7moKHpqoxcclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblxyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuiDveS/ruaUueeUqOaIt+eahOWvhueggVxyXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0aWYgdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0IyDliKTmlq3pg6jpl6jmmK/lkKblkIjnkIZcclxuXHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHJcblx0XHRcdGlmICFvcmdhbml6YXRpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcclxuXHJcblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XHJcblxyXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRpZiAhZGVwdF9uYW1lXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcclxuXHJcblx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcclxuXHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcclxuXHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdFx0aWYgaiA+IDBcclxuXHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0b3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSkuY291bnQoKVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgb3JnQ291bnQgPT0gMFxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6ZeoKCN7ZGVwdF9uYW1lfSnkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XHJcblxyXG5cdFx0aWYgb25seUNoZWNrXHJcblx0XHRcdHJldHVybiA7XHJcblxyXG5cdFx0IyDmlbDmja7lr7zlhaVcclxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxyXG5cdFx0XHRlcnJvciA9IHt9XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHNlbGVjdG9yID0gW11cclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcIlwiXHJcblx0XHRcdFx0IyBpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxyXG5cdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbH1cclxuXHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlcn1cclxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdXHJcblxyXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcclxuXHJcblx0XHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0YmVsb25nT3JnaWRzID0gW11cclxuXHRcdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XHJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXHJcblx0XHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0XHRcdGlmIGogPiAwXHJcblx0XHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHJcblx0XHRcdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSlcclxuXHJcblx0XHRcdFx0XHRpZiBvcmdcclxuXHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxyXG5cclxuXHJcblx0XHRcdFx0dXNlcl9pZCA9IG51bGxcclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR1ZG9jID0ge31cclxuXHRcdFx0XHRcdHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHR1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkXHJcblx0XHRcdFx0XHR1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlXHJcblx0XHRcdFx0XHR1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXVxyXG5cdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdHVkb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbHMgPSBbe2FkZHJlc3M6IGl0ZW0uZW1haWwsIHZlcmlmaWVkOiBmYWxzZX1dXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0dWRvYy5waG9uZSA9IHtcclxuXHRcdFx0XHRcdFx0XHRudW1iZXI6IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0bW9iaWxlOiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0dmVyaWZpZWQ6IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXHJcblxyXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9KVxyXG5cclxuXHRcdFx0XHRpZiBzcGFjZV91c2VyXHJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRpZiAhc3BhY2VfdXNlci5vcmdhbml6YXRpb25zXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW11cclxuXHJcblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy51cGRhdGUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHskc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2N9KVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCIgb3Igc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCJcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIilcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSx7JHNldDp7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9fSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXHJcblx0XHRcdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdHN1X2RvYyA9IHt9XHJcblx0XHRcdFx0XHRcdHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKClcclxuXHRcdFx0XHRcdFx0c3VfZG9jLnNwYWNlID0gc3BhY2VfaWRcclxuXHJcblx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gIHRydWVcclxuXHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIlxyXG5cclxuXHRcdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCJcclxuXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF1cclxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHNcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cclxuXHRcdFx0XHRcdFx0XHRzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmIHVzZXJfaWRcclxuXHRcdFx0XHRcdFx0XHR1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwgeyBmaWVsZHM6IHsgdXNlcm5hbWU6IDEgfSB9KVxyXG5cdFx0XHRcdFx0XHRcdGlmIHVzZXJJbmZvLnVzZXJuYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGVycm9yLmxpbmUgPSBpKzFcclxuXHRcdFx0XHRlcnJvci5tZXNzYWdlID0gZS5yZWFzb25cclxuXHRcdFx0XHRlcnJvckxpc3QucHVzaChlcnJvcilcclxuXHJcblx0XHRyZXR1cm4gZXJyb3JMaXN0XHJcbiIsIk1ldGVvci5tZXRob2RzKHtcblxuICAvKlxuICBcdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxuICBcdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0VE9ETzog5Zu96ZmF5YyWXG4gICAqL1xuICBpbXBvcnRfdXNlcnM6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spIHtcbiAgICB2YXIgX3NlbGYsIGFjY2VwdGVkX3VzZXJfY291bnQsIGN1cnJlbnRVc2VyLCBjdXJyZW50VXNlckxvY2FsZSwgY3VycmVudFVzZXJQaG9uZVByZWZpeCwgZXJyb3JMaXN0LCBvd25lcl9pZCwgcm9vdF9vcmcsIHNwYWNlLCB0ZXN0RGF0YTtcbiAgICBfc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICEoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZCkgOiB2b2lkIDApKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2UuaXNfcGFpZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5qCH5YeG54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuICAgIH1cbiAgICBhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2UuX2lkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgIH0pLmNvdW50KCk7XG4gICAgaWYgKChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIChcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHs1wiICsgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgKyBcIijlvZPliY1cIiArIHNwYWNlLnVzZXJfbGltaXQgKyBcIilcIikgKyBcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpO1xuICAgIH1cbiAgICBvd25lcl9pZCA9IHNwYWNlLm93bmVyO1xuICAgIHRlc3REYXRhID0gW107XG4gICAgZXJyb3JMaXN0ID0gW107XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogX3NlbGYudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGxvY2FsZTogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZTtcbiAgICBjdXJyZW50VXNlclBob25lUHJlZml4ID0gQWNjb3VudHMuZ2V0UGhvbmVQcmVmaXgoY3VycmVudFVzZXIpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgbXVsdGlPcmdzLCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgb3JnYW5pemF0aW9uX2RlcHRzLCBwaG9uZU51bWJlciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgcGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZTtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgaWYgKCFkZXB0X25hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgcmV0dXJuIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgIHZhciBmdWxsbmFtZTtcbiAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgdmFyIG9yZ0NvdW50O1xuICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKG9yZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6ZeoKFwiICsgZGVwdF9uYW1lICsgXCIp5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAob25seUNoZWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgYmVsb25nT3JnaWRzLCBlLCBlcnJvciwgbXVsdGlPcmdzLCBub3csIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBwaG9uZU51bWJlciwgc2VsZWN0b3IsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfdXBkYXRlX2RvYywgc3VfZG9jLCB1ZG9jLCB1c2VyLCB1c2VyRXhpc3QsIHVzZXJJbmZvLCB1c2VyX2lkO1xuICAgICAgZXJyb3IgPSB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdG9yID0gW107XG4gICAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgIHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmU7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlclxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF07XG4gICAgICAgIH1cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgIGJlbG9uZ09yZ2lkcyA9IFtdO1xuICAgICAgICBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICAgIHZhciBmdWxsbmFtZSwgb3JnLCBvcmdhbml6YXRpb25fZGVwdHM7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVsb25nT3JnaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVkb2MgPSB7fTtcbiAgICAgICAgICB1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICB1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkO1xuICAgICAgICAgIHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGU7XG4gICAgICAgICAgdWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF07XG4gICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgdWRvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgdWRvYy5lbWFpbHMgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBpdGVtLmVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgdWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICB1ZG9jLnBob25lID0ge1xuICAgICAgICAgICAgICBudW1iZXI6IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lLFxuICAgICAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmUsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IG5vd1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKTtcbiAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIgfHwgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGl0ZW0udXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgICBzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCI7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdO1xuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHM7XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcl9pZCkge1xuICAgICAgICAgICAgICB1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlckluZm8udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGVycm9yLmxpbmUgPSBpICsgMTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGUucmVhc29uO1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0LnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlcnJvckxpc3Q7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSBcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcclxuXHJcblx0XHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XHJcblx0XHRcdHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWRcclxuXHRcdFx0b3JnX2lkID0gcXVlcnkub3JnX2lkXHJcblx0XHRcdHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ11cclxuXHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6b3JnX2lkfSx7ZmllbGRzOntmdWxsbmFtZToxfX0pXHJcblx0XHRcdHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheVxyXG5cdFx0XHRub3cgPSBuZXcgRGF0ZSBcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsdXNlcl9pZClcclxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdHNvcnQ6IHtuYW1lOiAxfVxyXG5cdFx0XHRcdH0pLmZldGNoKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9yZ19pZHMgPSBbXVxyXG5cdFx0XHRcdG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6b3JnX2lkLHNwYWNlOnNwYWNlX2lkfSx7ZmllbGRzOntfaWQ6MSxjaGlsZHJlbjoxfX0pLmZldGNoKClcclxuXHRcdFx0XHRvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywnX2lkJylcclxuXHRcdFx0XHRfLmVhY2ggb3JnX29ianMsKG9yZ19vYmopLT5cclxuXHRcdFx0XHRcdG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsb3JnX29iaj8uY2hpbGRyZW4pXHJcblx0XHRcdFx0Xy51bmlxKG9yZ19pZHMpXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWQsb3JnYW5pemF0aW9uczp7JGluOm9yZ19pZHN9fSx7c29ydDoge3NvcnRfbm86IC0xLG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRcdGVqcyA9IHJlcXVpcmUoJ2VqcycpXHJcblx0XHRcdHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKVxyXG5cdFx0XHRcclxuXHRcdFx0IyDmo4DmtYvmmK/lkKbmnInor63ms5XplJnor69cclxuXHRcdFx0ZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50JylcclxuXHRcdFx0ZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pXHJcblx0XHRcdGlmIGVycm9yX29ialxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3Jfb2JqXHJcblxyXG5cdFx0XHR0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cilcclxuXHJcblx0XHRcdGxhbmcgPSAnZW4nXHJcblx0XHRcdGlmIGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSBpcyAnemgtY24nXHJcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcclxuXHJcblx0XHRcdG9yZ05hbWUgPSBpZiBvcmcgdGhlbiBvcmcuZnVsbG5hbWUgZWxzZSBvcmdfaWRcclxuXHRcdFx0ZmllbGRzID0gW3tcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbmFtZScsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbW9iaWxlJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid3b3JrX3Bob25lJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonZW1haWwnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonY29tcGFueScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3Bvc2l0aW9uJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J29yZ2FuaXphdGlvbnMnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJyx7fSxsYW5nKSxcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHZhbHVlfX0se2ZpZWxkczoge2Z1bGxuYW1lOiAxfX0pLm1hcCgoaXRlbSxpbmRleCktPlxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLmZ1bGxuYW1lXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J21hbmFnZXInLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge25hbWU6IDF9fSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/Lm5hbWVcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTondXNlcicsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge3VzZXJuYW1lOiAxfX0pXHJcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy51c2VybmFtZVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ051bWJlcicsXHJcblx0XHRcdFx0XHRuYW1lOidzb3J0X25vJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid1c2VyX2FjY2VwdGVkJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIHZhbHVlIHRoZW4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLHt9LGxhbmcpIGVsc2UgVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycse30sbGFuZylcclxuXHRcdFx0XHR9XVxyXG5cdFx0XHRcclxuXHRcdFx0c2hlZXRfbmFtZSA9IG9yZ05hbWU/LnJlcGxhY2UoL1xcLy9nLFwiLVwiKSAj5LiN5pSv5oyBXCIvXCLnrKblj7dcclxuXHRcdFx0cmV0ID0gdGVtcGxhdGUoe1xyXG5cdFx0XHRcdGxhbmc6IGxhbmcsXHJcblx0XHRcdFx0c2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcclxuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcclxuXHRcdFx0XHR1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0ZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIitlbmNvZGVVUkkoZmlsZU5hbWUpKVxyXG5cdFx0XHRyZXMuZW5kKHJldClcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRcdHJlcy5lbmQoZS5tZXNzYWdlKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjdXJyZW50X3VzZXJfaW5mbywgZSwgZWpzLCBlanNMaW50LCBlcnJvcl9vYmosIGZpZWxkcywgZmlsZU5hbWUsIGxhbmcsIG5vdywgb3JnLCBvcmdOYW1lLCBvcmdfaWQsIG9yZ19pZHMsIG9yZ19vYmpzLCBxdWVyeSwgcmV0LCBzaGVldF9uYW1lLCBzcGFjZV9pZCwgc3RyLCB0ZW1wbGF0ZSwgdXNlcl9pZCwgdXNlcnNfdG9feGxzO1xuICAgIHRyeSB7XG4gICAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgICAgcXVlcnkgPSByZXEucXVlcnk7XG4gICAgICBzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkO1xuICAgICAgb3JnX2lkID0gcXVlcnkub3JnX2lkO1xuICAgICAgdXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogb3JnX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcnNfdG9feGxzID0gbmV3IEFycmF5O1xuICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJfaWQpKSB7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yZ19pZHMgPSBbXTtcbiAgICAgICAgb3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIF9pZDogb3JnX2lkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBjaGlsZHJlbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgb3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsICdfaWQnKTtcbiAgICAgICAgXy5lYWNoKG9yZ19vYmpzLCBmdW5jdGlvbihvcmdfb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsIG9yZ19vYmogIT0gbnVsbCA/IG9yZ19vYmouY2hpbGRyZW4gOiB2b2lkIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgXy51bmlxKG9yZ19pZHMpO1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGluOiBvcmdfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgc29ydF9ubzogLTEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgZWpzID0gcmVxdWlyZSgnZWpzJyk7XG4gICAgICBzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJyk7XG4gICAgICBlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKTtcbiAgICAgIGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KTtcbiAgICAgIGlmIChlcnJvcl9vYmopIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcl9vYmopO1xuICAgICAgfVxuICAgICAgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpO1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAoY3VycmVudF91c2VyX2luZm8ubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgb3JnTmFtZSA9IG9yZyA/IG9yZy5mdWxsbmFtZSA6IG9yZ19pZDtcbiAgICAgIGZpZWxkcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtb2JpbGUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3dvcmtfcGhvbmUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdjb21wYW55JyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAncG9zaXRpb24nLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnb3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb3JnTmFtZXM7XG4gICAgICAgICAgICBvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZnVsbG5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbWFuYWdlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci5uYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgICAgbmFtZTogJ3NvcnRfbm8nLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXJfYWNjZXB0ZWQnLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgc2hlZXRfbmFtZSA9IG9yZ05hbWUgIT0gbnVsbCA/IG9yZ05hbWUucmVwbGFjZSgvXFwvL2csIFwiLVwiKSA6IHZvaWQgMDtcbiAgICAgIHJldCA9IHRlbXBsYXRlKHtcbiAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgc2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXG4gICAgICB9KTtcbiAgICAgIGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCI7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiICsgZW5jb2RlVVJJKGZpbGVOYW1lKSk7XG4gICAgICByZXR1cm4gcmVzLmVuZChyZXQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
