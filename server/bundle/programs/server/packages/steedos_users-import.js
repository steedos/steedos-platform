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
var ServerSession = Package['steedos:base'].ServerSession;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2ltcG9ydF91c2Vycy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3JvdXRlcy9hcGlfc3BhY2VfdXNlcnNfZXhwb3J0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1ldGVvciIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJzcGFjZV9pZCIsInVzZXJfcGsiLCJkYXRhIiwib25seUNoZWNrIiwiX3NlbGYiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlckxvY2FsZSIsImN1cnJlbnRVc2VyUGhvbmVQcmVmaXgiLCJlcnJvckxpc3QiLCJvd25lcl9pZCIsInJvb3Rfb3JnIiwic3BhY2UiLCJ0ZXN0RGF0YSIsInVzZXJJZCIsIkVycm9yIiwiZGIiLCJvcmdhbml6YXRpb25zIiwiZmluZE9uZSIsInBhcmVudCIsInNwYWNlcyIsImFkbWlucyIsImluY2x1ZGVzIiwiaXNfcGFpZCIsInNwYWNlX3VzZXJzIiwiZmluZCIsIl9pZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJBY2NvdW50cyIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsIm1vZGlmaWVkIiwiaW5zZXJ0Iiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJfIiwidW5pcSIsImNvbmNhdCIsImNvbXBhbnkiLCJwb3NpdGlvbiIsIndvcmtfcGhvbmUiLCJzb3J0X25vIiwia2V5cyIsInVwZGF0ZSIsIiRzZXQiLCJpbnZpdGVfc3RhdGUiLCJlcnJvcjEiLCJsaW5lIiwibWVzc2FnZSIsInJlYXNvbiIsInN0YXJ0dXAiLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2luZm8iLCJlanMiLCJlanNMaW50IiwiZXJyb3Jfb2JqIiwiZmlsZU5hbWUiLCJsYW5nIiwib3JnTmFtZSIsIm9yZ19pZCIsIm9yZ19pZHMiLCJvcmdfb2JqcyIsInF1ZXJ5IiwicmV0Iiwic2hlZXRfbmFtZSIsInN0ciIsInRlbXBsYXRlIiwidXNlcnNfdG9feGxzIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJBcnJheSIsIlN0ZWVkb3MiLCJpc1NwYWNlQWRtaW4iLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsInR5cGUiLCJ3aWR0aCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBQ3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixTQUFPLFFBRFM7QUFFaEIsY0FBWTtBQUZJLENBQUQsRUFHYixzQkFIYSxDQUFoQixDOzs7Ozs7Ozs7Ozs7QUNEQUksT0FBT0MsT0FBUCxDQUNDO0FBQUE7Ozs7OztLQU9BQyxjQUFjLFVBQUNDLFFBQUQsRUFBV0MsT0FBWCxFQUFvQkMsSUFBcEIsRUFBMEJDLFNBQTFCO0FBRWIsUUFBQUMsS0FBQSxFQUFBQyxtQkFBQSxFQUFBQyxXQUFBLEVBQUFDLGlCQUFBLEVBQUFDLHNCQUFBLEVBQUFDLFNBQUEsRUFBQUMsUUFBQSxFQUFBQyxRQUFBLEVBQUFDLEtBQUEsRUFBQUMsUUFBQTs7QUFBQVQs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UTtBQUVkTyxvQkFBWUEsVUFGRTtBQUdkbEcsZ0JBQVFBLE1BSE07QUFJZHFHLHNCQUFjQTtBQUpBLE9BQVQsQ0FBTjtBQU9BWCxpQkFBVyxxQkFBcUIwQyxTQUFTQyxNQUFULENBQWdCLGNBQWhCLENBQXJCLEdBQXVELE1BQWxFO0FBQ0FqRCxVQUFJa0QsU0FBSixDQUFjLGNBQWQsRUFBOEIsMEJBQTlCO0FBQ0FsRCxVQUFJa0QsU0FBSixDQUFjLHFCQUFkLEVBQXFDLHlCQUF1QkMsVUFBVTdDLFFBQVYsQ0FBNUQ7QUN5REcsYUR4REhOLElBQUlvRCxHQUFKLENBQVF2QyxHQUFSLENDd0RHO0FEbExKLGFBQUF2RCxLQUFBO0FBMkhNRCxVQUFBQyxLQUFBO0FBQ0w0RSxjQUFRNUUsS0FBUixDQUFjRCxFQUFFZ0csS0FBaEI7QUMwREcsYUR6REhyRCxJQUFJb0QsR0FBSixDQUFRL0YsRUFBRW9DLE9BQVYsQ0N5REc7QUFDRDtBRHhMSixJQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFwiZWpzXCI6IFwiXjIuNS41XCIsXHJcblx0XCJlanMtbGludFwiOiBcIl4wLjIuMFwiXHJcbn0sICdzdGVlZG9zOnVzZXJzLWltcG9ydCcpO1xyXG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdCMjI1xyXG5cdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxyXG5cdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxyXG5cdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxyXG5cdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxyXG5cdFx0VE9ETzog5Zu96ZmF5YyWXHJcblx0IyMjXHJcblx0aW1wb3J0X3VzZXJzOiAoc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjayktPlxyXG5cclxuXHRcdF9zZWxmID0gdGhpc1xyXG5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIilcclxuXHJcblx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBwYXJlbnQ6IG51bGx9KVxyXG5cclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlPy5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcclxuXHJcblx0XHRpZiAhc3BhY2UuaXNfcGFpZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLmoIflh4bniYjkuI3mlK/mjIHmraTlip/og71cIik7XHJcblxyXG5cdFx0YWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZS5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRpZiAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezI3thY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGh9KOW9k+WJjSN7c3BhY2UudXNlcl9saW1pdH0pXCIgK1wiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIilcclxuXHJcblx0XHRvd25lcl9pZCA9IHNwYWNlLm93bmVyXHJcblxyXG5cdFx0dGVzdERhdGEgPSBbXVxyXG5cclxuXHRcdGVycm9yTGlzdCA9IFtdXHJcblxyXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IF9zZWxmLnVzZXJJZH0se2ZpZWxkczp7bG9jYWxlOjEscGhvbmU6MX19KVxyXG5cdFx0Y3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGVcclxuXHRcdGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggPSBBY2NvdW50cy5nZXRQaG9uZVByZWZpeCBjdXJyZW50VXNlclxyXG5cclxuXHRcdCMg5pWw5o2u57uf5LiA5qCh6aqMXHJcblxyXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XHJcblx0XHRcdCMgY29uc29sZS5sb2cgaXRlbVxyXG5cdFx0XHQjIOeUqOaIt+WQje+8jOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulxyXG5cdFx0XHRpZiAhaXRlbS5waG9uZSBhbmQgIWl0ZW0uZW1haWxcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpXHJcblxyXG5cdFx0XHQjIOWIpOaWrWV4Y2Vs5Lit55qE5pWw5o2u77yM55So5oi35ZCN44CB5omL5py65Y+3562J5L+h5oGv5piv5ZCm5pyJ6K+vXHJcblx0XHRcdHRlc3RPYmogPSB7fVxyXG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0dGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bmoLzlvI/plJnor68je2l0ZW0uZW1haWx9XCIpO1xyXG5cclxuXHRcdFx0XHR0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bph43lpI1cIik7XHJcblxyXG5cdFx0XHRpdGVtLnNwYWNlID0gc3BhY2VfaWRcclxuXHJcblx0XHRcdHRlc3REYXRhLnB1c2godGVzdE9iailcclxuXHJcblx0XHRcdCMg6I635Y+W5p+l5om+dXNlcueahOadoeS7tlxyXG5cdFx0XHRzZWxlY3RvciA9IFtdXHJcblx0XHRcdG9wZXJhdGluZyA9IFwiXCJcclxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxyXG5cdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxyXG5cdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0cGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxyXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxyXG5cclxuXHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXHJcblxyXG5cclxuXHRcdFx0IyDlhYjliKTmlq3mmK/lkKbog73ljLnphY3liLDllK/kuIDnmoR1c2Vy77yM54S25ZCO5Yik5pat6K+l55So5oi35pivaW5zZXJ05Yiwc3BhY2VfdXNlcnPov5jmmK91cGRhdGVcclxuXHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcclxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZFxyXG5cdFx0XHRcdHNwYWNlVXNlckV4aXN0ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyfSlcclxuXHRcdFx0XHRpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwidXBkYXRlXCJcclxuXHRcdFx0XHRlbHNlIGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMFxyXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxyXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDBcclxuXHRcdFx0XHQjIOaWsOWinnNwYWNlX3VzZXJz55qE5pWw5o2u5qCh6aqMXHJcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxyXG5cclxuXHRcdFx0IyDliKTmlq3mmK/lkKbog73kv67mlLnnlKjmiLfnmoTlr4bnoIFcclxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCBhbmQgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcclxuXHJcblx0XHRcdCMg5Yik5pat6YOo6Zeo5piv5ZCm5ZCI55CGXHJcblx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXHJcblxyXG5cdFx0XHRpZiAhb3JnYW5pemF0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XHJcblxyXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xyXG5cclxuXHRcdFx0aWYgb3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9IHJvb3Rfb3JnLm5hbWVcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcclxuXHJcblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgJiYgdXNlcj8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcclxuXHJcblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0aWYgIWRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XHJcblxyXG5cdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cclxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXHJcblx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXHJcblx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRcdGlmIGogPiAwXHJcblx0XHRcdFx0XHRcdGlmIGogPT0gMVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcclxuXHJcblx0XHRcdFx0XHRcdG9yZ0NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pLmNvdW50KClcclxuXHJcblx0XHRcdFx0XHRcdGlmIG9yZ0NvdW50ID09IDBcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqCgje2RlcHRfbmFtZX0p5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xyXG5cclxuXHRcdGlmIG9ubHlDaGVja1xyXG5cdFx0XHRyZXR1cm4gO1xyXG5cclxuXHRcdCMg5pWw5o2u5a+85YWlXHJcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cclxuXHRcdFx0ZXJyb3IgPSB7fVxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRzZWxlY3RvciA9IFtdXHJcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJcIlxyXG5cdFx0XHRcdCMgaWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdCMgXHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cclxuXHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWx9XHJcblx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0cGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJ9XHJcblx0XHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXHJcblx0XHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIilcclxuXHRcdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXVxyXG5cclxuXHRcdFx0XHRub3cgPSBuZXcgRGF0ZSgpXHJcblxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uXHJcblx0XHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxyXG5cdFx0XHRcdGJlbG9uZ09yZ2lkcyA9IFtdXHJcblx0XHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxyXG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxyXG5cdFx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXHJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdFx0XHRpZiBqID4gMFxyXG5cdFx0XHRcdFx0XHRcdGlmIGogPT0gMVxyXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXHJcblxyXG5cdFx0XHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pXHJcblxyXG5cdFx0XHRcdFx0aWYgb3JnXHJcblx0XHRcdFx0XHRcdGJlbG9uZ09yZ2lkcy5wdXNoIG9yZy5faWRcclxuXHJcblxyXG5cdFx0XHRcdHVzZXJfaWQgPSBudWxsXHJcblx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0dXNlcl9pZCA9IHVzZXIuX2lkXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dWRvYyA9IHt9XHJcblx0XHRcdFx0XHR1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRcdFx0dWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZFxyXG5cdFx0XHRcdFx0dWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZVxyXG5cdFx0XHRcdFx0dWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF1cclxuXHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdHVkb2MuZW1haWxzID0gW3thZGRyZXNzOiBpdGVtLmVtYWlsLCB2ZXJpZmllZDogZmFsc2V9XVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0dWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcclxuXHJcblx0XHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdHVkb2MucGhvbmUgPSB7XHJcblx0XHRcdFx0XHRcdFx0bnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdG1vYmlsZTogaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHZlcmlmaWVkOiBmYWxzZVxyXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBub3dcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcclxuXHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxyXG5cclxuXHRcdFx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSlcclxuXHJcblx0XHRcdFx0aWYgc3BhY2VfdXNlclxyXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0aWYgIXNwYWNlX3VzZXIub3JnYW5pemF0aW9uc1xyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdXHJcblxyXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fVxyXG5cclxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm9yZ2FuaXphdGlvbnMgPSBfLnVuaXEoc3BhY2VfdXNlci5vcmdhbml6YXRpb25zLmNvbmNhdChiZWxvbmdPcmdpZHMpKVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5uYW1lID0gaXRlbS5uYW1lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMudXBkYXRlKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9LCB7JHNldDogc3BhY2VfdXNlcl91cGRhdGVfZG9jfSlcclxuXHJcblx0XHRcdFx0XHRcdGlmIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiIG9yIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiXHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi36L+Y5pyq5o6l5Y+X5Yqg5YWl5bel5L2c5Yy677yM5LiN6IO95L+u5pS55LuW55qE5Liq5Lq65L+h5oGvXCIpXHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0seyRzZXQ6e3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfX0pXHJcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxyXG5cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRzdV9kb2MgPSB7fVxyXG5cdFx0XHRcdFx0XHRzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkXHJcblxyXG5cdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9ICB0cnVlXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCJcclxuXHJcblx0XHRcdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiXHJcblxyXG5cdFx0XHRcdFx0XHRzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZiB1c2VyX2lkXHJcblx0XHRcdFx0XHRcdFx0dXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHsgZmllbGRzOiB7IHVzZXJuYW1lOiAxIH0gfSlcclxuXHRcdFx0XHRcdFx0XHRpZiB1c2VySW5mby51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWVcclxuXHJcblx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRlcnJvci5saW5lID0gaSsxXHJcblx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9IGUucmVhc29uXHJcblx0XHRcdFx0ZXJyb3JMaXN0LnB1c2goZXJyb3IpXHJcblxyXG5cdFx0cmV0dXJuIGVycm9yTGlzdFxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG5cbiAgLypcbiAgXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcbiAgXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdFRPRE86IOWbvemZheWMllxuICAgKi9cbiAgaW1wb3J0X3VzZXJzOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKSB7XG4gICAgdmFyIF9zZWxmLCBhY2NlcHRlZF91c2VyX2NvdW50LCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJMb2NhbGUsIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXgsIGVycm9yTGlzdCwgb3duZXJfaWQsIHJvb3Rfb3JnLCBzcGFjZSwgdGVzdERhdGE7XG4gICAgX3NlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgcGFyZW50OiBudWxsXG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuagh+WHhueJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcbiAgICB9XG4gICAgYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlLl9pZCxcbiAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICB9KS5jb3VudCgpO1xuICAgIGlmICgoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAoXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7NcIiArIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpICsgXCIo5b2T5YmNXCIgKyBzcGFjZS51c2VyX2xpbWl0ICsgXCIpXCIpICsgXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKTtcbiAgICB9XG4gICAgb3duZXJfaWQgPSBzcGFjZS5vd25lcjtcbiAgICB0ZXN0RGF0YSA9IFtdO1xuICAgIGVycm9yTGlzdCA9IFtdO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IF9zZWxmLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBsb2NhbGU6IDEsXG4gICAgICAgIHBob25lOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGU7XG4gICAgY3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4KGN1cnJlbnRVc2VyKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIG11bHRpT3Jncywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIG9yZ2FuaXphdGlvbl9kZXB0cywgcGhvbmVOdW1iZXIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VsZWN0b3IsIHNwYWNlVXNlckV4aXN0LCB0ZXN0T2JqLCB1c2VyLCB1c2VyRXhpc3Q7XG4gICAgICBpZiAoIWl0ZW0ucGhvbmUgJiYgIWl0ZW0uZW1haWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKTtcbiAgICAgIH1cbiAgICAgIHRlc3RPYmogPSB7fTtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vXCIgKyBpdGVtLmVtYWlsKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu26YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVtLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICB0ZXN0RGF0YS5wdXNoKHRlc3RPYmopO1xuICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICB1c2VybmFtZTogaXRlbS51c2VybmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmU7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIFwicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7XG4gICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXJFeGlzdC5jb3VudCgpID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZDtcbiAgICAgICAgc3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcInVwZGF0ZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcImluc2VydFwiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAwKSB7XG4gICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiB1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICBpZiAoKHJlZiA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvbjtcbiAgICAgIGlmICghb3JnYW5pemF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcbiAgICAgIGlmIChvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT09IHJvb3Rfb3JnLm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiAodXNlciAhPSBudWxsID8gKHJlZjIgPSB1c2VyLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgIGlmICghZGVwdF9uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgIHJldHVybiBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICB2YXIgZnVsbG5hbWU7XG4gICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgIHZhciBvcmdDb3VudDtcbiAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChvcmdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumDqOmXqChcIiArIGRlcHRfbmFtZSArIFwiKeS4jeWtmOWcqO+8jOivt+WFiOWIm+W7ulwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKG9ubHlDaGVjaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIGJlbG9uZ09yZ2lkcywgZSwgZXJyb3IsIG11bHRpT3Jncywgbm93LCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgcGhvbmVOdW1iZXIsIHNlbGVjdG9yLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX3VwZGF0ZV9kb2MsIHN1X2RvYywgdWRvYywgdXNlciwgdXNlckV4aXN0LCB1c2VySW5mbywgdXNlcl9pZDtcbiAgICAgIGVycm9yID0ge307XG4gICAgICB0cnkge1xuICAgICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lO1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdO1xuICAgICAgICB9XG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICBiZWxvbmdPcmdpZHMgPSBbXTtcbiAgICAgICAgbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgICB2YXIgZnVsbG5hbWUsIG9yZywgb3JnYW5pemF0aW9uX2RlcHRzO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIGJlbG9uZ09yZ2lkcy5wdXNoKG9yZy5faWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJfaWQgPSBudWxsO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1ZG9jID0ge307XG4gICAgICAgICAgdWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgdWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZDtcbiAgICAgICAgICB1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlO1xuICAgICAgICAgIHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdO1xuICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgIHVkb2MuZW1haWxzID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogaXRlbS5lbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgdWRvYy5waG9uZSA9IHtcbiAgICAgICAgICAgICAgbnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZSxcbiAgICAgICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBub3dcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VfZG9jID0ge307XG4gICAgICAgICAgICBzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgc3VfZG9jLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXTtcbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzO1xuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVzZXJfaWQpIHtcbiAgICAgICAgICAgICAgdXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgc3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBlcnJvci5saW5lID0gaSArIDE7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvbjtcbiAgICAgICAgcmV0dXJuIGVycm9yTGlzdC5wdXNoKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZXJyb3JMaXN0O1xuICB9XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UgXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpLT5cclxuXHRcdHRyeVxyXG5cdFx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXHJcblxyXG5cdFx0XHRxdWVyeSA9IHJlcS5xdWVyeVxyXG5cdFx0XHRzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkXHJcblx0XHRcdG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZFxyXG5cdFx0XHR1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddXHJcblx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOm9yZ19pZH0se2ZpZWxkczp7ZnVsbG5hbWU6MX19KVxyXG5cdFx0XHR1c2Vyc190b194bHMgPSBuZXcgQXJyYXlcclxuXHRcdFx0bm93ID0gbmV3IERhdGUgXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLHVzZXJfaWQpXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWRcclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRzb3J0OiB7bmFtZTogMX1cclxuXHRcdFx0XHR9KS5mZXRjaCgpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvcmdfaWRzID0gW11cclxuXHRcdFx0XHRvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOm9yZ19pZCxzcGFjZTpzcGFjZV9pZH0se2ZpZWxkczp7X2lkOjEsY2hpbGRyZW46MX19KS5mZXRjaCgpXHJcblx0XHRcdFx0b3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsJ19pZCcpXHJcblx0XHRcdFx0Xy5lYWNoIG9yZ19vYmpzLChvcmdfb2JqKS0+XHJcblx0XHRcdFx0XHRvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLG9yZ19vYmo/LmNoaWxkcmVuKVxyXG5cdFx0XHRcdF8udW5pcShvcmdfaWRzKVxyXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkLG9yZ2FuaXphdGlvbnM6eyRpbjpvcmdfaWRzfX0se3NvcnQ6IHtzb3J0X25vOiAtMSxuYW1lOjF9fSkuZmV0Y2goKVxyXG5cdFx0XHRlanMgPSByZXF1aXJlKCdlanMnKVxyXG5cdFx0XHRzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJylcclxuXHRcdFx0XHJcblx0XHRcdCMg5qOA5rWL5piv5ZCm5pyJ6K+t5rOV6ZSZ6K+vXHJcblx0XHRcdGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpXHJcblx0XHRcdGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KVxyXG5cdFx0XHRpZiBlcnJvcl9vYmpcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yX29ialxyXG5cclxuXHRcdFx0dGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpXHJcblxyXG5cdFx0XHRsYW5nID0gJ2VuJ1xyXG5cdFx0XHRpZiBjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgaXMgJ3poLWNuJ1xyXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXHJcblxyXG5cdFx0XHRvcmdOYW1lID0gaWYgb3JnIHRoZW4gb3JnLmZ1bGxuYW1lIGVsc2Ugb3JnX2lkXHJcblx0XHRcdGZpZWxkcyA9IFt7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J25hbWUnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J21vYmlsZScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTond29ya19waG9uZScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J2VtYWlsJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J2NvbXBhbnknLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidwb3NpdGlvbicsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidvcmdhbml6YXRpb25zJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycse30sbGFuZyksXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHRvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB2YWx1ZX19LHtmaWVsZHM6IHtmdWxsbmFtZTogMX19KS5tYXAoKGl0ZW0saW5kZXgpLT5cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gaXRlbS5mdWxsbmFtZVxyXG5cdFx0XHRcdFx0XHQpXHJcblx0XHRcdFx0XHRcdHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOidtYW5hZ2VyJyxcclxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHtuYW1lOiAxfX0pXHJcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy5uYW1lXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3VzZXInLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHt1c2VybmFtZTogMX19KVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdXNlcj8udXNlcm5hbWVcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdOdW1iZXInLFxyXG5cdFx0XHRcdFx0bmFtZTonc29ydF9ubycsXHJcblx0XHRcdFx0XHR3aWR0aDogMzUsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTondXNlcl9hY2NlcHRlZCcsXHJcblx0XHRcdFx0XHR3aWR0aDogMzUsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcse30sbGFuZylcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdHJldHVybiBpZiB2YWx1ZSB0aGVuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJyx7fSxsYW5nKSBlbHNlIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLHt9LGxhbmcpXHJcblx0XHRcdFx0fV1cclxuXHRcdFx0XHJcblx0XHRcdHNoZWV0X25hbWUgPSBvcmdOYW1lPy5yZXBsYWNlKC9cXC8vZyxcIi1cIikgI+S4jeaUr+aMgVwiL1wi56ym5Y+3XHJcblx0XHRcdHJldCA9IHRlbXBsYXRlKHtcclxuXHRcdFx0XHRsYW5nOiBsYW5nLFxyXG5cdFx0XHRcdHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXHJcblx0XHRcdFx0ZmllbGRzOiBmaWVsZHMsXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCJcclxuXHRcdFx0cmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKVxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIrZW5jb2RlVVJJKGZpbGVOYW1lKSlcclxuXHRcdFx0cmVzLmVuZChyZXQpXHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0XHRyZXMuZW5kKGUubWVzc2FnZSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY3VycmVudF91c2VyX2luZm8sIGUsIGVqcywgZWpzTGludCwgZXJyb3Jfb2JqLCBmaWVsZHMsIGZpbGVOYW1lLCBsYW5nLCBub3csIG9yZywgb3JnTmFtZSwgb3JnX2lkLCBvcmdfaWRzLCBvcmdfb2JqcywgcXVlcnksIHJldCwgc2hlZXRfbmFtZSwgc3BhY2VfaWQsIHN0ciwgdGVtcGxhdGUsIHVzZXJfaWQsIHVzZXJzX3RvX3hscztcbiAgICB0cnkge1xuICAgICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgICAgc3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZDtcbiAgICAgIG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZDtcbiAgICAgIHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9yZ19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheTtcbiAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VyX2lkKSkge1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmdfaWRzID0gW107XG4gICAgICAgIG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBfaWQ6IG9yZ19pZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgY2hpbGRyZW46IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCAnX2lkJyk7XG4gICAgICAgIF8uZWFjaChvcmdfb2JqcywgZnVuY3Rpb24ob3JnX29iaikge1xuICAgICAgICAgIHJldHVybiBvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLCBvcmdfb2JqICE9IG51bGwgPyBvcmdfb2JqLmNoaWxkcmVuIDogdm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8udW5pcShvcmdfaWRzKTtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRpbjogb3JnX2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IC0xLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuICAgICAgc3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpO1xuICAgICAgZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jyk7XG4gICAgICBlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSk7XG4gICAgICBpZiAoZXJyb3Jfb2JqKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3Jfb2JqKTtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKTtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIG9yZ05hbWUgPSBvcmcgPyBvcmcuZnVsbG5hbWUgOiBvcmdfaWQ7XG4gICAgICBmaWVsZHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbW9iaWxlJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd3b3JrX3Bob25lJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnY29tcGFueScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9yZ05hbWVzO1xuICAgICAgICAgICAgb3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLmZ1bGxuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21hbmFnZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICAgIG5hbWU6ICdzb3J0X25vJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyX2FjY2VwdGVkJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHNoZWV0X25hbWUgPSBvcmdOYW1lICE9IG51bGwgPyBvcmdOYW1lLnJlcGxhY2UoL1xcLy9nLCBcIi1cIikgOiB2b2lkIDA7XG4gICAgICByZXQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICB1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuICAgICAgfSk7XG4gICAgICBmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIHJlcy5lbmQocmV0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiByZXMuZW5kKGUubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
