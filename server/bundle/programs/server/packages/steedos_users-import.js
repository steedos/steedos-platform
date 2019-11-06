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

},"space_users_actions.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/steedos_users-import/space_users_actions.coffee                                              //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var actions;
actions = {
  "import": {
    label: "导入",
    on: "list",
    visible: function (object_name, record_id, record_permissions) {
      return Creator.isSpaceAdmin();
    },
    todo: function () {
      if (!Steedos.isPaidSpace()) {
        Steedos.spaceUpgradedModal();
        return;
      }

      return Modal.show("import_users_modal");
    }
  },
  "export": {
    label: "导出",
    on: "list",
    visible: function (object_name, record_id, record_permissions) {
      return Creator.isSpaceAdmin();
    },
    todo: function () {
      var orgId, ref, spaceId, uobj, url;
      spaceId = Session.get("spaceId");
      orgId = (ref = Session.get("grid_sidebar_selected")) != null ? ref[0] : void 0;

      if (spaceId && orgId) {
        uobj = {};
        uobj["X-User-Id"] = Meteor.userId();
        uobj["X-Auth-Token"] = Accounts._storedLoginToken();
        uobj.space_id = spaceId;
        uobj.org_id = orgId;
        url = Steedos.absoluteUrl() + "api/export/space_users?" + $.param(uobj);
        return window.open(url, '_parent', 'EnableViewPortScale=yes');
      } else {
        return swal({
          title: "左侧未选中任何组织",
          text: "请在左侧组织机构树中选中一个组织后再执行导出操作",
          html: true,
          type: 'warning',
          confirmButtonText: TAPi18n.__('OK')
        });
      }
    }
  }
};
Meteor.startup(function () {
  var ref;

  if (!((ref = Creator.Objects.space_users) != null ? ref.actions : void 0)) {
    Creator.Objects.space_users.actions = {};
  }

  return _.extend(Creator.Objects.space_users.actions, actions);
});
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
require("/node_modules/meteor/steedos:users-import/space_users_actions.coffee");
require("/node_modules/meteor/steedos:users-import/server/methods/import_users.coffee");
require("/node_modules/meteor/steedos:users-import/routes/api_space_users_export.coffee");

/* Exports */
Package._define("steedos:users-import");

})();

//# sourceURL=meteor://💻app/packages/steedos_users-import.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NwYWNlX3VzZXJzX2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zcGFjZV91c2Vyc19hY3Rpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX3NwYWNlX3VzZXJzX2V4cG9ydC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYWN0aW9ucyIsImxhYmVsIiwib24iLCJ2aXNpYmxlIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJDcmVhdG9yIiwiaXNTcGFjZUFkbWluIiwidG9kbyIsIlN0ZWVkb3MiLCJpc1BhaWRTcGFjZSIsInNwYWNlVXBncmFkZWRNb2RhbCIsIk1vZGFsIiwic2hvdyIsIm9yZ0lkIiwicmVmIiwic3BhY2VJZCIsInVvYmoiLCJ1cmwiLCJTZXNzaW9uIiwiZ2V0IiwiTWV0ZW9yIiwidXNlcklkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsInNwYWNlX2lkIiwib3JnX2lkIiwiYWJzb2x1dGVVcmwiLCIkIiwicGFyYW0iLCJ3aW5kb3ciLCJvcGVuIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJUQVBpMThuIiwiX18iLCJzdGFydHVwIiwiT2JqZWN0cyIsInNwYWNlX3VzZXJzIiwiXyIsImV4dGVuZCIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJ1c2VyX3BrIiwiZGF0YSIsIm9ubHlDaGVjayIsIl9zZWxmIiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImN1cnJlbnRVc2VyIiwiY3VycmVudFVzZXJMb2NhbGUiLCJjdXJyZW50VXNlclBob25lUHJlZml4IiwiZXJyb3JMaXN0Iiwib3duZXJfaWQiLCJyb290X29yZyIsInNwYWNlIiwidGVzdERhdGEiLCJFcnJvciIsImRiIiwib3JnYW5pemF0aW9ucyIsImZpbmRPbmUiLCJwYXJlbnQiLCJzcGFjZXMiLCJhZG1pbnMiLCJpbmNsdWRlcyIsImlzX3BhaWQiLCJmaW5kIiwiX2lkIiwidXNlcl9hY2NlcHRlZCIsImNvdW50IiwibGVuZ3RoIiwidXNlcl9saW1pdCIsIm93bmVyIiwidXNlcnMiLCJmaWVsZHMiLCJsb2NhbGUiLCJwaG9uZSIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsIm1vZGlmaWVkIiwiaW5zZXJ0Iiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZWpzIiwiZWpzTGludCIsImVycm9yX29iaiIsImZpbGVOYW1lIiwibGFuZyIsIm9yZ05hbWUiLCJvcmdfaWRzIiwib3JnX29ianMiLCJxdWVyeSIsInJldCIsInNoZWV0X25hbWUiLCJzdHIiLCJ0ZW1wbGF0ZSIsInVzZXJzX3RvX3hscyIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiQXJyYXkiLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsIndpZHRoIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJ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QUFZQSxVQUZFO0FBR2Q3RixnQkFBUUEsTUFITTtBQUlkZ0csc0JBQWNBO0FBSkEsT0FBVCxDQUFOO0FBT0FWLGlCQUFXLHFCQUFxQm1DLFNBQVNDLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBckIsR0FBdUQsTUFBbEU7QUFDQTFDLFVBQUkyQyxTQUFKLENBQWMsY0FBZCxFQUE4QiwwQkFBOUI7QUFDQTNDLFVBQUkyQyxTQUFKLENBQWMscUJBQWQsRUFBcUMseUJBQXVCQyxVQUFVdEMsUUFBVixDQUE1RDtBQ3lERyxhRHhESE4sSUFBSTZDLEdBQUosQ0FBUWpDLEdBQVIsQ0N3REc7QURsTEosYUFBQXBELEtBQUE7QUEySE1ELFVBQUFDLEtBQUE7QUFDTHVFLGNBQVF2RSxLQUFSLENBQWNELEVBQUV1RixLQUFoQjtBQzBERyxhRHpESDlDLElBQUk2QyxHQUFKLENBQVF0RixFQUFFbUMsT0FBVixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcbn0sICdzdGVlZG9zOnVzZXJzLWltcG9ydCcpO1xuIiwiYWN0aW9ucyA9IFxuXHRpbXBvcnQ6XG5cdFx0bGFiZWw6IFwi5a+85YWlXCJcblx0XHRvbjogXCJsaXN0XCJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKVxuXHRcdHRvZG86ICgpLT5cblx0XHRcdGlmICFTdGVlZG9zLmlzUGFpZFNwYWNlKClcblx0XHRcdFx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwoKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdE1vZGFsLnNob3coXCJpbXBvcnRfdXNlcnNfbW9kYWxcIik7XG5cdFxuXHRleHBvcnQ6XG5cdFx0bGFiZWw6IFwi5a+85Ye6XCJcblx0XHRvbjogXCJsaXN0XCJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKVxuXHRcdHRvZG86ICgpLT5cblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRcdG9yZ0lkID0gU2Vzc2lvbi5nZXQoXCJncmlkX3NpZGViYXJfc2VsZWN0ZWRcIik/WzBdXG5cdFx0XHRpZiBzcGFjZUlkIGFuZCBvcmdJZFxuXHRcdFx0XHR1b2JqID0ge31cblx0XHRcdFx0dW9ialtcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKVxuXHRcdFx0XHR1b2JqW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKVxuXHRcdFx0XHR1b2JqLnNwYWNlX2lkID0gc3BhY2VJZFxuXHRcdFx0XHR1b2JqLm9yZ19pZCA9IG9yZ0lkXG5cdFx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSArIFwiYXBpL2V4cG9ydC9zcGFjZV91c2Vycz9cIiArICQucGFyYW0odW9iailcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX3BhcmVudCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN3YWxcblx0XHRcdFx0XHR0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIlxuXHRcdFx0XHRcdHRleHQ6IFwi6K+35Zyo5bem5L6n57uE57uH5py65p6E5qCR5Lit6YCJ5Lit5LiA5Liq57uE57uH5ZCO5YaN5omn6KGM5a+85Ye65pON5L2cXCJcblx0XHRcdFx0XHRodG1sOiB0cnVlXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oJ09LJylcblxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdHVubGVzcyBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnM/LmFjdGlvbnNcblx0XHRDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9XG5cblx0Xy5leHRlbmQoQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzLmFjdGlvbnMsIGFjdGlvbnMpO1xuIiwidmFyIGFjdGlvbnM7XG5cbmFjdGlvbnMgPSB7XG4gIFwiaW1wb3J0XCI6IHtcbiAgICBsYWJlbDogXCLlr7zlhaVcIixcbiAgICBvbjogXCJsaXN0XCIsXG4gICAgdmlzaWJsZTogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKTtcbiAgICB9LFxuICAgIHRvZG86IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFTdGVlZG9zLmlzUGFpZFNwYWNlKCkpIHtcbiAgICAgICAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJpbXBvcnRfdXNlcnNfbW9kYWxcIik7XG4gICAgfVxuICB9LFxuICBcImV4cG9ydFwiOiB7XG4gICAgbGFiZWw6IFwi5a+85Ye6XCIsXG4gICAgb246IFwibGlzdFwiLFxuICAgIHZpc2libGU6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKCk7XG4gICAgfSxcbiAgICB0b2RvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcmdJZCwgcmVmLCBzcGFjZUlkLCB1b2JqLCB1cmw7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgICAgb3JnSWQgPSAocmVmID0gU2Vzc2lvbi5nZXQoXCJncmlkX3NpZGViYXJfc2VsZWN0ZWRcIikpICE9IG51bGwgPyByZWZbMF0gOiB2b2lkIDA7XG4gICAgICBpZiAoc3BhY2VJZCAmJiBvcmdJZCkge1xuICAgICAgICB1b2JqID0ge307XG4gICAgICAgIHVvYmpbXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgICAgIHVvYmpbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgICAgICB1b2JqLnNwYWNlX2lkID0gc3BhY2VJZDtcbiAgICAgICAgdW9iai5vcmdfaWQgPSBvcmdJZDtcbiAgICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCgpICsgXCJhcGkvZXhwb3J0L3NwYWNlX3VzZXJzP1wiICsgJC5wYXJhbSh1b2JqKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19wYXJlbnQnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIixcbiAgICAgICAgICB0ZXh0OiBcIuivt+WcqOW3puS+p+e7hOe7h+acuuaehOagkeS4remAieS4reS4gOS4que7hOe7h+WQjuWGjeaJp+ihjOWvvOWHuuaTjeS9nFwiLFxuICAgICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKCdPSycpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICghKChyZWYgPSBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMpICE9IG51bGwgPyByZWYuYWN0aW9ucyA6IHZvaWQgMCkpIHtcbiAgICBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiBfLmV4dGVuZChDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucywgYWN0aW9ucyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCMjI1xuXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcblx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxuXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcblx0XHRUT0RPOiDlm73pmYXljJZcblx0IyMjXG5cdGltcG9ydF91c2VyczogKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spLT5cblxuXHRcdF9zZWxmID0gdGhpc1xuXG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIilcblxuXHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHBhcmVudDogbnVsbH0pXG5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2U/LmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcblxuXHRcdGlmICFzcGFjZS5pc19wYWlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLmoIflh4bniYjkuI3mlK/mjIHmraTlip/og71cIik7XG5cblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRpZiAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHsyN7YWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RofSjlvZPliY0je3NwYWNlLnVzZXJfbGltaXR9KVwiICtcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpXG5cblx0XHRvd25lcl9pZCA9IHNwYWNlLm93bmVyXG5cblx0XHR0ZXN0RGF0YSA9IFtdXG5cblx0XHRlcnJvckxpc3QgPSBbXVxuXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IF9zZWxmLnVzZXJJZH0se2ZpZWxkczp7bG9jYWxlOjEscGhvbmU6MX19KVxuXHRcdGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlXG5cdFx0Y3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4IGN1cnJlbnRVc2VyXG5cblx0XHQjIOaVsOaNrue7n+S4gOagoemqjFxuXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XG5cdFx0XHQjIGNvbnNvbGUubG9nIGl0ZW1cblx0XHRcdCMg55So5oi35ZCN77yM5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XG5cdFx0XHRpZiAhaXRlbS5waG9uZSBhbmQgIWl0ZW0uZW1haWxcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKVxuXG5cdFx0XHQjIOWIpOaWrWV4Y2Vs5Lit55qE5pWw5o2u77yM55So5oi35ZCN44CB5omL5py65Y+3562J5L+h5oGv5piv5ZCm5pyJ6K+vXG5cdFx0XHR0ZXN0T2JqID0ge31cblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0dGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0dGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tuagvOW8j+mUmeivryN7aXRlbS5lbWFpbH1cIik7XG5cblx0XHRcdFx0dGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bph43lpI1cIik7XG5cblx0XHRcdGl0ZW0uc3BhY2UgPSBzcGFjZV9pZFxuXG5cdFx0XHR0ZXN0RGF0YS5wdXNoKHRlc3RPYmopXG5cblx0XHRcdCMg6I635Y+W5p+l5om+dXNlcueahOadoeS7tlxuXHRcdFx0c2VsZWN0b3IgPSBbXVxuXHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxuXHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxuXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblxuXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxuXHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZFxuXHRcdFx0XHRzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcn0pXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwidXBkYXRlXCJcblx0XHRcdFx0ZWxzZSBpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0IyDmlrDlop5zcGFjZV91c2Vyc+eahOaVsOaNruagoemqjFxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cblx0XHRcdCMg5Yik5pat5piv5ZCm6IO95L+u5pS555So5oi355qE5a+G56CBXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG5cblx0XHRcdCMg5Yik5pat6YOo6Zeo5piv5ZCm5ZCI55CGXG5cdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXG5cdFx0XHRpZiAhb3JnYW5pemF0aW9uXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcblxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcblxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0aWYgIWRlcHRfbmFtZVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xuXG5cdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcblx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdFx0aWYgaiA+IDBcblx0XHRcdFx0XHRcdGlmIGogPT0gMVxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcblxuXHRcdFx0XHRcdFx0b3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSkuY291bnQoKVxuXG5cdFx0XHRcdFx0XHRpZiBvcmdDb3VudCA9PSAwXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6ZeoKCN7ZGVwdF9uYW1lfSnkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XG5cblx0XHRpZiBvbmx5Q2hlY2tcblx0XHRcdHJldHVybiA7XG5cblx0XHQjIOaVsOaNruWvvOWFpVxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxuXHRcdFx0ZXJyb3IgPSB7fVxuXHRcdFx0dHJ5XG5cdFx0XHRcdHNlbGVjdG9yID0gW11cblx0XHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0XHQjIGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxuXHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxuXHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0cGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblx0XHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXVxuXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcblxuXHRcdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdGJlbG9uZ09yZ2lkcyA9IFtdXG5cdFx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXG5cdFx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0XHRcdGlmIGogPiAwXG5cdFx0XHRcdFx0XHRcdGlmIGogPT0gMVxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZGVwdF9uYW1lXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWVcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcblxuXHRcdFx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KVxuXG5cdFx0XHRcdFx0aWYgb3JnXG5cdFx0XHRcdFx0XHRiZWxvbmdPcmdpZHMucHVzaCBvcmcuX2lkXG5cblxuXHRcdFx0XHR1c2VyX2lkID0gbnVsbFxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR1ZG9jID0ge31cblx0XHRcdFx0XHR1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdHVkb2Muc3RlZWRvc19pZCA9IGl0ZW0uZW1haWwgfHwgdWRvYy5faWRcblx0XHRcdFx0XHR1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlXG5cdFx0XHRcdFx0dWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF1cblx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdHVkb2MubmFtZSA9IGl0ZW0ubmFtZVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbHMgPSBbe2FkZHJlc3M6IGl0ZW0uZW1haWwsIHZlcmlmaWVkOiBmYWxzZX1dXG5cblx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHR1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0dWRvYy5waG9uZSA9IHtcblx0XHRcdFx0XHRcdFx0bnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHRtb2JpbGU6IGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0dmVyaWZpZWQ6IGZhbHNlXG5cdFx0XHRcdFx0XHRcdG1vZGlmaWVkOiBub3dcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpXG5cblx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXG5cdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXG5cblx0XHRcdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0pXG5cblx0XHRcdFx0aWYgc3BhY2VfdXNlclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRpZiAhc3BhY2VfdXNlci5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdXG5cblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9XG5cblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSlcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xuXG5cdFx0XHRcdFx0XHRpZiBfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSwgeyRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY30pXG5cblx0XHRcdFx0XHRcdGlmIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiIG9yIHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LHskc2V0Ont1c2VybmFtZTogaXRlbS51c2VybmFtZX19KVxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXG5cdFx0XHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxuXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0c3VfZG9jID0ge31cblx0XHRcdFx0XHRcdHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHRcdHN1X2RvYy5zcGFjZSA9IHNwYWNlX2lkXG5cblx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gIHRydWVcblx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCJcblxuXHRcdFx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcInBlbmRpbmdcIlxuXG5cdFx0XHRcdFx0XHRzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdXG5cdFx0XHRcdFx0XHRzdV9kb2Mub3JnYW5pemF0aW9ucyA9IGJlbG9uZ09yZ2lkc1xuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0c3VfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRpZiB1c2VyX2lkXG5cdFx0XHRcdFx0XHRcdHVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh1c2VyX2lkLCB7IGZpZWxkczogeyB1c2VybmFtZTogMSB9IH0pXG5cdFx0XHRcdFx0XHRcdGlmIHVzZXJJbmZvLnVzZXJuYW1lXG5cdFx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWVcblxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3IubGluZSA9IGkrMVxuXHRcdFx0XHRlcnJvci5tZXNzYWdlID0gZS5yZWFzb25cblx0XHRcdFx0ZXJyb3JMaXN0LnB1c2goZXJyb3IpXG5cblx0XHRyZXR1cm4gZXJyb3JMaXN0XG4iLCJNZXRlb3IubWV0aG9kcyh7XG5cbiAgLypcbiAgXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcbiAgXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdFRPRE86IOWbvemZheWMllxuICAgKi9cbiAgaW1wb3J0X3VzZXJzOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKSB7XG4gICAgdmFyIF9zZWxmLCBhY2NlcHRlZF91c2VyX2NvdW50LCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJMb2NhbGUsIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXgsIGVycm9yTGlzdCwgb3duZXJfaWQsIHJvb3Rfb3JnLCBzcGFjZSwgdGVzdERhdGE7XG4gICAgX3NlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgcGFyZW50OiBudWxsXG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhKHNwYWNlICE9IG51bGwgPyBzcGFjZS5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xuICAgIH1cbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuagh+WHhueJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcbiAgICB9XG4gICAgYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlLl9pZCxcbiAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICB9KS5jb3VudCgpO1xuICAgIGlmICgoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAoXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7NcIiArIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpICsgXCIo5b2T5YmNXCIgKyBzcGFjZS51c2VyX2xpbWl0ICsgXCIpXCIpICsgXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKTtcbiAgICB9XG4gICAgb3duZXJfaWQgPSBzcGFjZS5vd25lcjtcbiAgICB0ZXN0RGF0YSA9IFtdO1xuICAgIGVycm9yTGlzdCA9IFtdO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IF9zZWxmLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBsb2NhbGU6IDEsXG4gICAgICAgIHBob25lOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgY3VycmVudFVzZXJMb2NhbGUgPSBjdXJyZW50VXNlci5sb2NhbGU7XG4gICAgY3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4KGN1cnJlbnRVc2VyKTtcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIG11bHRpT3Jncywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIG9yZ2FuaXphdGlvbl9kZXB0cywgcGhvbmVOdW1iZXIsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VsZWN0b3IsIHNwYWNlVXNlckV4aXN0LCB0ZXN0T2JqLCB1c2VyLCB1c2VyRXhpc3Q7XG4gICAgICBpZiAoIWl0ZW0ucGhvbmUgJiYgIWl0ZW0uZW1haWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKTtcbiAgICAgIH1cbiAgICAgIHRlc3RPYmogPSB7fTtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChpdGVtLmVtYWlsKSkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu25qC85byP6ZSZ6K+vXCIgKyBpdGVtLmVtYWlsKTtcbiAgICAgICAgfVxuICAgICAgICB0ZXN0T2JqLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgaWYgKHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YKu5Lu26YeN5aSNXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpdGVtLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICB0ZXN0RGF0YS5wdXNoKHRlc3RPYmopO1xuICAgICAgc2VsZWN0b3IgPSBbXTtcbiAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICBzZWxlY3Rvci5wdXNoKHtcbiAgICAgICAgICB1c2VybmFtZTogaXRlbS51c2VybmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgIHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmU7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIFwicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7XG4gICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXJFeGlzdC5jb3VudCgpID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKTtcbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZDtcbiAgICAgICAgc3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlclxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcInVwZGF0ZVwiO1xuICAgICAgICB9IGVsc2UgaWYgKHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgICBvcGVyYXRpbmcgPSBcImluc2VydFwiO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAwKSB7XG4gICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiB1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICBpZiAoKHJlZiA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvbjtcbiAgICAgIGlmICghb3JnYW5pemF0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcbiAgICAgIGlmIChvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT09IHJvb3Rfb3JnLm5hbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbS5wYXNzd29yZCAmJiAodXNlciAhPSBudWxsID8gKHJlZjIgPSB1c2VyLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuICAgICAgfVxuICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgIGlmICghZGVwdF9uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKTtcbiAgICAgIHJldHVybiBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICB2YXIgZnVsbG5hbWU7XG4gICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgIHZhciBvcmdDb3VudDtcbiAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgIGZ1bGxuYW1lOiBmdWxsbmFtZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChvcmdDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mumDqOmXqChcIiArIGRlcHRfbmFtZSArIFwiKeS4jeWtmOWcqO+8jOivt+WFiOWIm+W7ulwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKG9ubHlDaGVjaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgdmFyIGJlbG9uZ09yZ2lkcywgZSwgZXJyb3IsIG11bHRpT3Jncywgbm93LCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgcGhvbmVOdW1iZXIsIHNlbGVjdG9yLCBzcGFjZV91c2VyLCBzcGFjZV91c2VyX3VwZGF0ZV9kb2MsIHN1X2RvYywgdWRvYywgdXNlciwgdXNlckV4aXN0LCB1c2VySW5mbywgdXNlcl9pZDtcbiAgICAgIGVycm9yID0ge307XG4gICAgICB0cnkge1xuICAgICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lO1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdO1xuICAgICAgICB9XG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICBiZWxvbmdPcmdpZHMgPSBbXTtcbiAgICAgICAgbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgICB2YXIgZnVsbG5hbWUsIG9yZywgb3JnYW5pemF0aW9uX2RlcHRzO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICAgIG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoKGZ1bmN0aW9uKGRlcHRfbmFtZSwgaikge1xuICAgICAgICAgICAgaWYgKGogPiAwKSB7XG4gICAgICAgICAgICAgIGlmIChqID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaWYgKG9yZykge1xuICAgICAgICAgICAgcmV0dXJuIGJlbG9uZ09yZ2lkcy5wdXNoKG9yZy5faWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJfaWQgPSBudWxsO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1ZG9jID0ge307XG4gICAgICAgICAgdWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgdWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZDtcbiAgICAgICAgICB1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlO1xuICAgICAgICAgIHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdO1xuICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgIHVkb2MuZW1haWxzID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogaXRlbS5lbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgdWRvYy5waG9uZSA9IHtcbiAgICAgICAgICAgICAgbnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZSxcbiAgICAgICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBub3dcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VfZG9jID0ge307XG4gICAgICAgICAgICBzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgc3VfZG9jLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXTtcbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzO1xuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVzZXJfaWQpIHtcbiAgICAgICAgICAgICAgdXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHVzZXJfaWQsIHtcbiAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHVzZXJJbmZvLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgc3VfZG9jLnVzZXJuYW1lID0gdXNlckluZm8udXNlcm5hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5pbnNlcnQoc3VfZG9jKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBlcnJvci5saW5lID0gaSArIDE7XG4gICAgICAgIGVycm9yLm1lc3NhZ2UgPSBlLnJlYXNvbjtcbiAgICAgICAgcmV0dXJuIGVycm9yTGlzdC5wdXNoKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZXJyb3JMaXN0O1xuICB9XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlIFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgKHJlcSwgcmVzLCBuZXh0KS0+XG5cdFx0dHJ5XG5cdFx0XHRjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpXG5cblx0XHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XG5cdFx0XHRzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkXG5cdFx0XHRvcmdfaWQgPSBxdWVyeS5vcmdfaWRcblx0XHRcdHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ11cblx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOm9yZ19pZH0se2ZpZWxkczp7ZnVsbG5hbWU6MX19KVxuXHRcdFx0dXNlcnNfdG9feGxzID0gbmV3IEFycmF5XG5cdFx0XHRub3cgPSBuZXcgRGF0ZSBcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLHVzZXJfaWQpXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0c29ydDoge25hbWU6IDF9XG5cdFx0XHRcdH0pLmZldGNoKClcblx0XHRcdGVsc2Vcblx0XHRcdFx0b3JnX2lkcyA9IFtdXG5cdFx0XHRcdG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6b3JnX2lkLHNwYWNlOnNwYWNlX2lkfSx7ZmllbGRzOntfaWQ6MSxjaGlsZHJlbjoxfX0pLmZldGNoKClcblx0XHRcdFx0b3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsJ19pZCcpXG5cdFx0XHRcdF8uZWFjaCBvcmdfb2Jqcywob3JnX29iaiktPlxuXHRcdFx0XHRcdG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsb3JnX29iaj8uY2hpbGRyZW4pXG5cdFx0XHRcdF8udW5pcShvcmdfaWRzKVxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZCxvcmdhbml6YXRpb25zOnskaW46b3JnX2lkc319LHtzb3J0OiB7c29ydF9ubzogLTEsbmFtZToxfX0pLmZldGNoKClcblx0XHRcdGVqcyA9IHJlcXVpcmUoJ2VqcycpXG5cdFx0XHRzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJylcblx0XHRcdFxuXHRcdFx0IyDmo4DmtYvmmK/lkKbmnInor63ms5XplJnor69cblx0XHRcdGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpXG5cdFx0XHRlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSlcblx0XHRcdGlmIGVycm9yX29ialxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJvcl9vYmpcblxuXHRcdFx0dGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpXG5cblx0XHRcdGxhbmcgPSAnZW4nXG5cdFx0XHRpZiBjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgaXMgJ3poLWNuJ1xuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xuXG5cdFx0XHRvcmdOYW1lID0gaWYgb3JnIHRoZW4gb3JnLmZ1bGxuYW1lIGVsc2Ugb3JnX2lkXG5cdFx0XHRmaWVsZHMgPSBbe1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J25hbWUnLFxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonbW9iaWxlJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J3dvcmtfcGhvbmUnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J2VtYWlsJyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonY29tcGFueScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZToncG9zaXRpb24nLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidvcmdhbml6YXRpb25zJyxcblx0XHRcdFx0XHR3aWR0aDogNjAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJyx7fSxsYW5nKSxcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0b3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjogdmFsdWV9fSx7ZmllbGRzOiB7ZnVsbG5hbWU6IDF9fSkubWFwKChpdGVtLGluZGV4KS0+XG5cdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLmZ1bGxuYW1lXG5cdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHRyZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIilcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonbWFuYWdlcicsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge25hbWU6IDF9fSlcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy5uYW1lXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J3VzZXInLFxuXHRcdFx0XHRcdHdpZHRoOiA2MCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7dXNlcm5hbWU6IDF9fSlcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy51c2VybmFtZVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnTnVtYmVyJyxcblx0XHRcdFx0XHRuYW1lOidzb3J0X25vJyxcblx0XHRcdFx0XHR3aWR0aDogMzUsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J3VzZXJfYWNjZXB0ZWQnLFxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIHZhbHVlIHRoZW4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLHt9LGxhbmcpIGVsc2UgVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycse30sbGFuZylcblx0XHRcdFx0fV1cblx0XHRcdFxuXHRcdFx0c2hlZXRfbmFtZSA9IG9yZ05hbWU/LnJlcGxhY2UoL1xcLy9nLFwiLVwiKSAj5LiN5pSv5oyBXCIvXCLnrKblj7dcblx0XHRcdHJldCA9IHRlbXBsYXRlKHtcblx0XHRcdFx0bGFuZzogbGFuZyxcblx0XHRcdFx0c2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcblx0XHRcdFx0ZmllbGRzOiBmaWVsZHMsXG5cdFx0XHRcdHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXG5cdFx0XHR9KVxuXG5cdFx0XHRmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIrZW5jb2RlVVJJKGZpbGVOYW1lKSlcblx0XHRcdHJlcy5lbmQocmV0KVxuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdFx0cmVzLmVuZChlLm1lc3NhZ2UpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZShcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGN1cnJlbnRfdXNlcl9pbmZvLCBlLCBlanMsIGVqc0xpbnQsIGVycm9yX29iaiwgZmllbGRzLCBmaWxlTmFtZSwgbGFuZywgbm93LCBvcmcsIG9yZ05hbWUsIG9yZ19pZCwgb3JnX2lkcywgb3JnX29ianMsIHF1ZXJ5LCByZXQsIHNoZWV0X25hbWUsIHNwYWNlX2lkLCBzdHIsIHRlbXBsYXRlLCB1c2VyX2lkLCB1c2Vyc190b194bHM7XG4gICAgdHJ5IHtcbiAgICAgIGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSk7XG4gICAgICBxdWVyeSA9IHJlcS5xdWVyeTtcbiAgICAgIHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWQ7XG4gICAgICBvcmdfaWQgPSBxdWVyeS5vcmdfaWQ7XG4gICAgICB1c2VyX2lkID0gcXVlcnlbJ1gtVXNlci1JZCddO1xuICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiBvcmdfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB1c2Vyc190b194bHMgPSBuZXcgQXJyYXk7XG4gICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgdXNlcl9pZCkpIHtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3JnX2lkcyA9IFtdO1xuICAgICAgICBvcmdfb2JqcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgX2lkOiBvcmdfaWQsXG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgIGNoaWxkcmVuOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgICBvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywgJ19pZCcpO1xuICAgICAgICBfLmVhY2gob3JnX29ianMsIGZ1bmN0aW9uKG9yZ19vYmopIHtcbiAgICAgICAgICByZXR1cm4gb3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcywgb3JnX29iaiAhPSBudWxsID8gb3JnX29iai5jaGlsZHJlbiA6IHZvaWQgMCk7XG4gICAgICAgIH0pO1xuICAgICAgICBfLnVuaXEob3JnX2lkcyk7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkaW46IG9yZ19pZHNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAtMSxcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9XG4gICAgICBlanMgPSByZXF1aXJlKCdlanMnKTtcbiAgICAgIHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKTtcbiAgICAgIGVqc0xpbnQgPSByZXF1aXJlKCdlanMtbGludCcpO1xuICAgICAgZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pO1xuICAgICAgaWYgKGVycm9yX29iaikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiPT09L2FwaS9jb250YWN0cy9leHBvcnQvc3BhY2VfdXNlcnM6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yX29iaik7XG4gICAgICB9XG4gICAgICB0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cik7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmIChjdXJyZW50X3VzZXJfaW5mby5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICBvcmdOYW1lID0gb3JnID8gb3JnLmZ1bGxuYW1lIDogb3JnX2lkO1xuICAgICAgZmllbGRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21vYmlsZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnd29ya19waG9uZScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2VtYWlsJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ2NvbXBhbnknLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdwb3NpdGlvbicsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdvcmdhbml6YXRpb25zJyxcbiAgICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBvcmdOYW1lcztcbiAgICAgICAgICAgIG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiB2YWx1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgICAgICAgICByZXR1cm4gaXRlbS5mdWxsbmFtZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtYW5hZ2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIHVzZXI7XG4gICAgICAgICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogdmFsdWVcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci51c2VybmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICAgICAgICBuYW1lOiAnc29ydF9ubycsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcl9hY2NlcHRlZCcsXG4gICAgICAgICAgd2lkdGg6IDM1LFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBzaGVldF9uYW1lID0gb3JnTmFtZSAhPSBudWxsID8gb3JnTmFtZS5yZXBsYWNlKC9cXC8vZywgXCItXCIpIDogdm9pZCAwO1xuICAgICAgcmV0ID0gdGVtcGxhdGUoe1xuICAgICAgICBsYW5nOiBsYW5nLFxuICAgICAgICBzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuICAgICAgICBmaWVsZHM6IGZpZWxkcyxcbiAgICAgICAgdXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcbiAgICAgIH0pO1xuICAgICAgZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIjtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC1EaXNwb3NpdGlvblwiLCBcImF0dGFjaG1lbnQ7ZmlsZW5hbWU9XCIgKyBlbmNvZGVVUkkoZmlsZU5hbWUpKTtcbiAgICAgIHJldHVybiByZXMuZW5kKHJldCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGUgPSBlcnJvcjtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICByZXR1cm4gcmVzLmVuZChlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
