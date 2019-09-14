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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NwYWNlX3VzZXJzX2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zcGFjZV91c2Vyc19hY3Rpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX3NwYWNlX3VzZXJzX2V4cG9ydC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYWN0aW9ucyIsImxhYmVsIiwib24iLCJ2aXNpYmxlIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJDcmVhdG9yIiwiaXNTcGFjZUFkbWluIiwidG9kbyIsIlN0ZWVkb3MiLCJpc1BhaWRTcGFjZSIsInNwYWNlVXBncmFkZWRNb2RhbCIsIk1vZGFsIiwic2hvdyIsIm9yZ0lkIiwicmVmIiwic3BhY2VJZCIsInVvYmoiLCJ1cmwiLCJTZXNzaW9uIiwiZ2V0IiwiTWV0ZW9yIiwidXNlcklkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsInNwYWNlX2lkIiwib3JnX2lkIiwiYWJzb2x1dGVVcmwiLCIkIiwicGFyYW0iLCJ3aW5kb3ciLCJvcGVuIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJUQVBpMThuIiwiX18iLCJzdGFydHVwIiwiT2JqZWN0cyIsInNwYWNlX3VzZXJzIiwiXyIsImV4dGVuZCIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJ1c2VyX3BrIiwiZGF0YSIsIm9ubHlDaGVjayIsIl9zZWxmIiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImN1cnJlbnRVc2VyIiwiY3VycmVudFVzZXJMb2NhbGUiLCJjdXJyZW50VXNlclBob25lUHJlZml4IiwiZXJyb3JMaXN0Iiwib3duZXJfaWQiLCJyb290X29yZyIsInNwYWNlIiwidGVzdERhdGEiLCJFcnJvciIsImRiIiwib3JnYW5pemF0aW9ucyIsImZpbmRPbmUiLCJwYXJlbnQiLCJzcGFjZXMiLCJhZG1pbnMiLCJpbmNsdWRlcyIsImlzX3BhaWQiLCJmaW5kIiwiX2lkIiwidXNlcl9hY2NlcHRlZCIsImNvdW50IiwibGVuZ3RoIiwidXNlcl9saW1pdCIsIm93bmVyIiwidXNlcnMiLCJmaWVsZHMiLCJsb2NhbGUiLCJwaG9uZSIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwibXVsdGlPcmdzIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJvcmdGdWxsbmFtZSIsImZ1bGxuYW1lIiwidHJpbSIsIm9yZ0NvdW50IiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VySW5mbyIsInVzZXJfaWQiLCJEYXRlIiwib3JnIiwiX21ha2VOZXdJRCIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsIm1vZGlmaWVkIiwiaW5zZXJ0Iiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwidXBkYXRlIiwiJHNldCIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZWpzIiwiZWpzTGludCIsImVycm9yX29iaiIsImZpbGVOYW1lIiwibGFuZyIsIm9yZ05hbWUiLCJvcmdfaWRzIiwib3JnX29ianMiLCJxdWVyeSIsInJldCIsInNoZWV0X25hbWUiLCJzdHIiLCJ0ZW1wbGF0ZSIsInVzZXJzX3RvX3hscyIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiQXJyYXkiLCJzb3J0IiwiY2hpbGRyZW4iLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsIndpZHRoIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2UiLCJtb21lbnQiLCJmb3JtYXQiLCJzZXRIZWFkZXIiLCJlbmNvZGVVUkkiLCJlbmQiLCJzdGFjayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJ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QUFZQSxVQUZFO0FBR2Q3RixnQkFBUUEsTUFITTtBQUlkZ0csc0JBQWNBO0FBSkEsT0FBVCxDQUFOO0FBT0FWLGlCQUFXLHFCQUFxQm1DLFNBQVNDLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBckIsR0FBdUQsTUFBbEU7QUFDQTFDLFVBQUkyQyxTQUFKLENBQWMsY0FBZCxFQUE4QiwwQkFBOUI7QUFDQTNDLFVBQUkyQyxTQUFKLENBQWMscUJBQWQsRUFBcUMseUJBQXVCQyxVQUFVdEMsUUFBVixDQUE1RDtBQ3lERyxhRHhESE4sSUFBSTZDLEdBQUosQ0FBUWpDLEdBQVIsQ0N3REc7QURsTEosYUFBQXBELEtBQUE7QUEySE1ELFVBQUFDLEtBQUE7QUFDTHVFLGNBQVF2RSxLQUFSLENBQWNELEVBQUV1RixLQUFoQjtBQzBERyxhRHpESDlDLElBQUk2QyxHQUFKLENBQVF0RixFQUFFbUMsT0FBVixDQ3lERztBQUNEO0FEeExKLElDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX3VzZXJzLWltcG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJlanNcIjogXCJeMi41LjVcIixcclxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcclxufSwgJ3N0ZWVkb3M6dXNlcnMtaW1wb3J0Jyk7XHJcbiIsImFjdGlvbnMgPSBcclxuXHRpbXBvcnQ6XHJcblx0XHRsYWJlbDogXCLlr7zlhaVcIlxyXG5cdFx0b246IFwibGlzdFwiXHJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmlzU3BhY2VBZG1pbigpXHJcblx0XHR0b2RvOiAoKS0+XHJcblx0XHRcdGlmICFTdGVlZG9zLmlzUGFpZFNwYWNlKClcclxuXHRcdFx0XHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCgpXHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdFx0TW9kYWwuc2hvdyhcImltcG9ydF91c2Vyc19tb2RhbFwiKTtcclxuXHRcclxuXHRleHBvcnQ6XHJcblx0XHRsYWJlbDogXCLlr7zlh7pcIlxyXG5cdFx0b246IFwibGlzdFwiXHJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XHJcblx0XHRcdHJldHVybiBDcmVhdG9yLmlzU3BhY2VBZG1pbigpXHJcblx0XHR0b2RvOiAoKS0+XHJcblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcclxuXHRcdFx0b3JnSWQgPSBTZXNzaW9uLmdldChcImdyaWRfc2lkZWJhcl9zZWxlY3RlZFwiKT9bMF1cclxuXHRcdFx0aWYgc3BhY2VJZCBhbmQgb3JnSWRcclxuXHRcdFx0XHR1b2JqID0ge31cclxuXHRcdFx0XHR1b2JqW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdFx0dW9ialtcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKClcclxuXHRcdFx0XHR1b2JqLnNwYWNlX2lkID0gc3BhY2VJZFxyXG5cdFx0XHRcdHVvYmoub3JnX2lkID0gb3JnSWRcclxuXHRcdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKCkgKyBcImFwaS9leHBvcnQvc3BhY2VfdXNlcnM/XCIgKyAkLnBhcmFtKHVvYmopXHJcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX3BhcmVudCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRzd2FsXHJcblx0XHRcdFx0XHR0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIlxyXG5cdFx0XHRcdFx0dGV4dDogXCLor7flnKjlt6bkvqfnu4Tnu4fmnLrmnoTmoJHkuK3pgInkuK3kuIDkuKrnu4Tnu4flkI7lho3miafooYzlr7zlh7rmk43kvZxcIlxyXG5cdFx0XHRcdFx0aHRtbDogdHJ1ZVxyXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXHJcblx0XHRcdFx0XHRjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXygnT0snKVxyXG5cclxuXHJcbk1ldGVvci5zdGFydHVwICgpLT5cclxuXHR1bmxlc3MgQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzPy5hY3Rpb25zXHJcblx0XHRDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9XHJcblxyXG5cdF8uZXh0ZW5kKENyZWF0b3IuT2JqZWN0cy5zcGFjZV91c2Vycy5hY3Rpb25zLCBhY3Rpb25zKTtcclxuIiwidmFyIGFjdGlvbnM7XG5cbmFjdGlvbnMgPSB7XG4gIFwiaW1wb3J0XCI6IHtcbiAgICBsYWJlbDogXCLlr7zlhaVcIixcbiAgICBvbjogXCJsaXN0XCIsXG4gICAgdmlzaWJsZTogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKTtcbiAgICB9LFxuICAgIHRvZG86IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFTdGVlZG9zLmlzUGFpZFNwYWNlKCkpIHtcbiAgICAgICAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJpbXBvcnRfdXNlcnNfbW9kYWxcIik7XG4gICAgfVxuICB9LFxuICBcImV4cG9ydFwiOiB7XG4gICAgbGFiZWw6IFwi5a+85Ye6XCIsXG4gICAgb246IFwibGlzdFwiLFxuICAgIHZpc2libGU6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKCk7XG4gICAgfSxcbiAgICB0b2RvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcmdJZCwgcmVmLCBzcGFjZUlkLCB1b2JqLCB1cmw7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgICAgb3JnSWQgPSAocmVmID0gU2Vzc2lvbi5nZXQoXCJncmlkX3NpZGViYXJfc2VsZWN0ZWRcIikpICE9IG51bGwgPyByZWZbMF0gOiB2b2lkIDA7XG4gICAgICBpZiAoc3BhY2VJZCAmJiBvcmdJZCkge1xuICAgICAgICB1b2JqID0ge307XG4gICAgICAgIHVvYmpbXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgICAgIHVvYmpbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgICAgICB1b2JqLnNwYWNlX2lkID0gc3BhY2VJZDtcbiAgICAgICAgdW9iai5vcmdfaWQgPSBvcmdJZDtcbiAgICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCgpICsgXCJhcGkvZXhwb3J0L3NwYWNlX3VzZXJzP1wiICsgJC5wYXJhbSh1b2JqKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19wYXJlbnQnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIixcbiAgICAgICAgICB0ZXh0OiBcIuivt+WcqOW3puS+p+e7hOe7h+acuuaehOagkeS4remAieS4reS4gOS4que7hOe7h+WQjuWGjeaJp+ihjOWvvOWHuuaTjeS9nFwiLFxuICAgICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKCdPSycpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICghKChyZWYgPSBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMpICE9IG51bGwgPyByZWYuYWN0aW9ucyA6IHZvaWQgMCkpIHtcbiAgICBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiBfLmV4dGVuZChDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucywgYWN0aW9ucyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0IyMjXHJcblx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXHJcblx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXHJcblx0XHRUT0RPOiDlm73pmYXljJZcclxuXHQjIyNcclxuXHRpbXBvcnRfdXNlcnM6IChzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKS0+XHJcblxyXG5cdFx0X3NlbGYgPSB0aGlzXHJcblxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKVxyXG5cclxuXHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHBhcmVudDogbnVsbH0pXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2U/LmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5Y+q5pyJ5bel5L2c5Yy6566h55CG5ZGY5Y+v5Lul5a+85YWl55So5oi3XCIpO1xyXG5cclxuXHRcdGlmICFzcGFjZS5pc19wYWlkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuagh+WHhueJiOS4jeaUr+aMgeatpOWKn+iDvVwiKTtcclxuXHJcblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdGlmIChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7Mje2FjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aH0o5b2T5YmNI3tzcGFjZS51c2VyX2xpbWl0fSlcIiArXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKVxyXG5cclxuXHRcdG93bmVyX2lkID0gc3BhY2Uub3duZXJcclxuXHJcblx0XHR0ZXN0RGF0YSA9IFtdXHJcblxyXG5cdFx0ZXJyb3JMaXN0ID0gW11cclxuXHJcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogX3NlbGYudXNlcklkfSx7ZmllbGRzOntsb2NhbGU6MSxwaG9uZToxfX0pXHJcblx0XHRjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZVxyXG5cdFx0Y3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4IGN1cnJlbnRVc2VyXHJcblxyXG5cdFx0IyDmlbDmja7nu5/kuIDmoKHpqoxcclxuXHJcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cclxuXHRcdFx0IyBjb25zb2xlLmxvZyBpdGVtXHJcblx0XHRcdCMg55So5oi35ZCN77yM5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XHJcblx0XHRcdGlmICFpdGVtLnBob25lIGFuZCAhaXRlbS5lbWFpbFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIilcclxuXHJcblx0XHRcdCMg5Yik5patZXhjZWzkuK3nmoTmlbDmja7vvIznlKjmiLflkI3jgIHmiYvmnLrlj7fnrYnkv6Hmga/mmK/lkKbmnInor69cclxuXHRcdFx0dGVzdE9iaiA9IHt9XHJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHR0ZXN0T2JqLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XHJcblxyXG5cdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0dGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRpZiB0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5lbWFpbFxyXG5cdFx0XHRcdGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tuagvOW8j+mUmeivryN7aXRlbS5lbWFpbH1cIik7XHJcblxyXG5cdFx0XHRcdHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsXHJcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tumHjeWkjVwiKTtcclxuXHJcblx0XHRcdGl0ZW0uc3BhY2UgPSBzcGFjZV9pZFxyXG5cclxuXHRcdFx0dGVzdERhdGEucHVzaCh0ZXN0T2JqKVxyXG5cclxuXHRcdFx0IyDojrflj5bmn6Xmib51c2Vy55qE5p2h5Lu2XHJcblx0XHRcdHNlbGVjdG9yID0gW11cclxuXHRcdFx0b3BlcmF0aW5nID0gXCJcIlxyXG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XHJcblx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWx9XHJcblx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJ9XHJcblxyXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHJcblxyXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxyXG5cdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcclxuXHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkXHJcblx0XHRcdFx0c3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJ9KVxyXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJ1cGRhdGVcIlxyXG5cdFx0XHRcdGVsc2UgaWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAwXHJcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMFxyXG5cdFx0XHRcdCMg5paw5aKec3BhY2VfdXNlcnPnmoTmlbDmja7moKHpqoxcclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXHJcblxyXG5cdFx0XHQjIOWIpOaWreaYr+WQpuiDveS/ruaUueeUqOaIt+eahOWvhueggVxyXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXHJcblx0XHRcdFx0aWYgdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0IyDliKTmlq3pg6jpl6jmmK/lkKblkIjnkIZcclxuXHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHJcblx0XHRcdGlmICFvcmdhbml6YXRpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcclxuXHJcblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIi9cIik7XHJcblxyXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE5qC56YOo6ZeoXCIpO1xyXG5cclxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xyXG5cclxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cclxuXHRcdFx0XHRpZiAhZGVwdF9uYW1lXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcclxuXHJcblx0XHRcdG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIilcclxuXHRcdFx0bXVsdGlPcmdzLmZvckVhY2ggKG9yZ0Z1bGxuYW1lKSAtPlxyXG5cdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cyA9IG9yZ0Z1bGxuYW1lLnRyaW0oKS5zcGxpdChcIi9cIilcclxuXHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxyXG5cdFx0XHRcdFx0aWYgaiA+IDBcclxuXHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0b3JnQ291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSkuY291bnQoKVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgb3JnQ291bnQgPT0gMFxyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6ZeoKCN7ZGVwdF9uYW1lfSnkuI3lrZjlnKjvvIzor7flhYjliJvlu7pcIik7XHJcblxyXG5cdFx0aWYgb25seUNoZWNrXHJcblx0XHRcdHJldHVybiA7XHJcblxyXG5cdFx0IyDmlbDmja7lr7zlhaVcclxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxyXG5cdFx0XHRlcnJvciA9IHt9XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHNlbGVjdG9yID0gW11cclxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcIlwiXHJcblx0XHRcdFx0IyBpZiBpdGVtLnVzZXJuYW1lXHJcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxyXG5cdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbH1cclxuXHRcdFx0XHRpZiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlcn1cclxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcclxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuY291bnQoKSA+IDFcclxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxyXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxyXG5cdFx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdXHJcblxyXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcclxuXHJcblx0XHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cclxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXHJcblx0XHRcdFx0YmVsb25nT3JnaWRzID0gW11cclxuXHRcdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XHJcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXHJcblx0XHRcdFx0XHRmdWxsbmFtZSA9IFwiXCJcclxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XHJcblx0XHRcdFx0XHRcdGlmIGogPiAwXHJcblx0XHRcdFx0XHRcdFx0aWYgaiA9PSAxXHJcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcclxuXHJcblx0XHRcdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgZnVsbG5hbWU6IGZ1bGxuYW1lfSlcclxuXHJcblx0XHRcdFx0XHRpZiBvcmdcclxuXHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxyXG5cclxuXHJcblx0XHRcdFx0dXNlcl9pZCA9IG51bGxcclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR1ZG9jID0ge31cclxuXHRcdFx0XHRcdHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpXHJcblx0XHRcdFx0XHR1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkXHJcblx0XHRcdFx0XHR1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlXHJcblx0XHRcdFx0XHR1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXVxyXG5cdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdHVkb2MubmFtZSA9IGl0ZW0ubmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0dWRvYy5lbWFpbHMgPSBbe2FkZHJlc3M6IGl0ZW0uZW1haWwsIHZlcmlmaWVkOiBmYWxzZX1dXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxyXG5cdFx0XHRcdFx0XHR1ZG9jLnVzZXJuYW1lID0gaXRlbS51c2VybmFtZVxyXG5cclxuXHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0dWRvYy5waG9uZSA9IHtcclxuXHRcdFx0XHRcdFx0XHRudW1iZXI6IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0bW9iaWxlOiBpdGVtLnBob25lXHJcblx0XHRcdFx0XHRcdFx0dmVyaWZpZWQ6IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5vd1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR1c2VyX2lkID0gZGIudXNlcnMuaW5zZXJ0KHVkb2MpXHJcblxyXG5cdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXHJcblxyXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9KVxyXG5cclxuXHRcdFx0XHRpZiBzcGFjZV91c2VyXHJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRpZiAhc3BhY2VfdXNlci5vcmdhbml6YXRpb25zXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW11cclxuXHJcblx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYyA9IHt9XHJcblxyXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxyXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXHJcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cclxuXHJcblx0XHRcdFx0XHRcdGlmIF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy51cGRhdGUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHskc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2N9KVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCIgb3Igc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCJcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIilcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSx7JHNldDp7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9fSlcclxuXHRcdFx0XHRcdFx0XHRpZiBpdGVtLnBhc3N3b3JkXHJcblx0XHRcdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXHJcblxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdHN1X2RvYyA9IHt9XHJcblx0XHRcdFx0XHRcdHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKClcclxuXHRcdFx0XHRcdFx0c3VfZG9jLnNwYWNlID0gc3BhY2VfaWRcclxuXHJcblx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gIHRydWVcclxuXHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIlxyXG5cclxuXHRcdFx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2VcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCJcclxuXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsXHJcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF1cclxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHNcclxuXHJcblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cclxuXHRcdFx0XHRcdFx0XHRzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcclxuXHRcdFx0XHRcdFx0XHRzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXHJcblxyXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cclxuXHRcdFx0XHRcdFx0XHRzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XHJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmIHVzZXJfaWRcclxuXHRcdFx0XHRcdFx0XHR1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwgeyBmaWVsZHM6IHsgdXNlcm5hbWU6IDEgfSB9KVxyXG5cdFx0XHRcdFx0XHRcdGlmIHVzZXJJbmZvLnVzZXJuYW1lXHJcblx0XHRcdFx0XHRcdFx0XHRzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZVxyXG5cclxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGVycm9yLmxpbmUgPSBpKzFcclxuXHRcdFx0XHRlcnJvci5tZXNzYWdlID0gZS5yZWFzb25cclxuXHRcdFx0XHRlcnJvckxpc3QucHVzaChlcnJvcilcclxuXHJcblx0XHRyZXR1cm4gZXJyb3JMaXN0XHJcbiIsIk1ldGVvci5tZXRob2RzKHtcblxuICAvKlxuICBcdFx0MeOAgeagoemqjOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxuICBcdFx0NOOAgeagoemqjOmDqOmXqOeUqOaIt+aYr+WQpuWtmOWcqFxuICBcdFx0VE9ETzog5Zu96ZmF5YyWXG4gICAqL1xuICBpbXBvcnRfdXNlcnM6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spIHtcbiAgICB2YXIgX3NlbGYsIGFjY2VwdGVkX3VzZXJfY291bnQsIGN1cnJlbnRVc2VyLCBjdXJyZW50VXNlckxvY2FsZSwgY3VycmVudFVzZXJQaG9uZVByZWZpeCwgZXJyb3JMaXN0LCBvd25lcl9pZCwgcm9vdF9vcmcsIHNwYWNlLCB0ZXN0RGF0YTtcbiAgICBfc2VsZiA9IHRoaXM7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICEoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZCkgOiB2b2lkIDApKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XG4gICAgfVxuICAgIGlmICghc3BhY2UuaXNfcGFpZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5qCH5YeG54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuICAgIH1cbiAgICBhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2UuX2lkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgIH0pLmNvdW50KCk7XG4gICAgaWYgKChhY2NlcHRlZF91c2VyX2NvdW50ICsgZGF0YS5sZW5ndGgpID4gc3BhY2UudXNlcl9saW1pdCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIChcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHs1wiICsgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgKyBcIijlvZPliY1cIiArIHNwYWNlLnVzZXJfbGltaXQgKyBcIilcIikgKyBcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpO1xuICAgIH1cbiAgICBvd25lcl9pZCA9IHNwYWNlLm93bmVyO1xuICAgIHRlc3REYXRhID0gW107XG4gICAgZXJyb3JMaXN0ID0gW107XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogX3NlbGYudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGxvY2FsZTogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZTtcbiAgICBjdXJyZW50VXNlclBob25lUHJlZml4ID0gQWNjb3VudHMuZ2V0UGhvbmVQcmVmaXgoY3VycmVudFVzZXIpO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgbXVsdGlPcmdzLCBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgb3JnYW5pemF0aW9uX2RlcHRzLCBwaG9uZU51bWJlciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgcGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZTtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgaWYgKCFkZXB0X25hbWUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgcmV0dXJuIG11bHRpT3Jncy5mb3JFYWNoKGZ1bmN0aW9uKG9yZ0Z1bGxuYW1lKSB7XG4gICAgICAgIHZhciBmdWxsbmFtZTtcbiAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgZnVsbG5hbWUgPSBcIlwiO1xuICAgICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgdmFyIG9yZ0NvdW50O1xuICAgICAgICAgIGlmIChqID4gMCkge1xuICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcmdDb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKG9yZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya6YOo6ZeoKFwiICsgZGVwdF9uYW1lICsgXCIp5LiN5a2Y5Zyo77yM6K+35YWI5Yib5bu6XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAob25seUNoZWNrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKSB7XG4gICAgICB2YXIgYmVsb25nT3JnaWRzLCBlLCBlcnJvciwgbXVsdGlPcmdzLCBub3csIG9wZXJhdGluZywgb3JnYW5pemF0aW9uLCBwaG9uZU51bWJlciwgc2VsZWN0b3IsIHNwYWNlX3VzZXIsIHNwYWNlX3VzZXJfdXBkYXRlX2RvYywgc3VfZG9jLCB1ZG9jLCB1c2VyLCB1c2VyRXhpc3QsIHVzZXJJbmZvLCB1c2VyX2lkO1xuICAgICAgZXJyb3IgPSB7fTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdG9yID0gW107XG4gICAgICAgIG9wZXJhdGluZyA9IFwiXCI7XG4gICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGl0ZW0uZW1haWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgIHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmU7XG4gICAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgICBcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlclxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHVzZXJFeGlzdCA9IGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICAgICRvcjogc2VsZWN0b3JcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyRXhpc3QuY291bnQoKSA+IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLnlKjmiLflkI3jgIHmiYvmnLrlj7fjgIHpgq7nrrHkv6Hmga/mnInor6/vvIzml6Dms5XljLnphY3liLDlkIzkuIDotKblj7dcIik7XG4gICAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDEpIHtcbiAgICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF07XG4gICAgICAgIH1cbiAgICAgICAgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgb3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb247XG4gICAgICAgIG11bHRpT3JncyA9IG9yZ2FuaXphdGlvbi5zcGxpdChcIixcIik7XG4gICAgICAgIGJlbG9uZ09yZ2lkcyA9IFtdO1xuICAgICAgICBtdWx0aU9yZ3MuZm9yRWFjaChmdW5jdGlvbihvcmdGdWxsbmFtZSkge1xuICAgICAgICAgIHZhciBmdWxsbmFtZSwgb3JnLCBvcmdhbml6YXRpb25fZGVwdHM7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICBmdWxsbmFtZSA9IFwiXCI7XG4gICAgICAgICAgb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVsbG5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxuYW1lID0gZGVwdF9uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBmdWxsbmFtZTogZnVsbG5hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVsb25nT3JnaWRzLnB1c2gob3JnLl9pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdXNlcl9pZCA9IG51bGw7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVkb2MgPSB7fTtcbiAgICAgICAgICB1ZG9jLl9pZCA9IGRiLnVzZXJzLl9tYWtlTmV3SUQoKTtcbiAgICAgICAgICB1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkO1xuICAgICAgICAgIHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGU7XG4gICAgICAgICAgdWRvYy5zcGFjZXNfaW52aXRlZCA9IFtzcGFjZV9pZF07XG4gICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgdWRvYy5uYW1lID0gaXRlbS5uYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgdWRvYy5lbWFpbHMgPSBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBpdGVtLmVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgdWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICB1ZG9jLnBob25lID0ge1xuICAgICAgICAgICAgICBudW1iZXI6IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lLFxuICAgICAgICAgICAgICBtb2JpbGU6IGl0ZW0ucGhvbmUsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgbW9kaWZpZWQ6IG5vd1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKTtcbiAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKCFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5vcmdhbml6YXRpb25zID0gXy51bmlxKHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucy5jb25jYXQoYmVsb25nT3JnaWRzKSk7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfLmtleXMoc3BhY2VfdXNlcl91cGRhdGVfZG9jKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGRiLnNwYWNlX3VzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHNwYWNlX3VzZXJfdXBkYXRlX2RvY1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIgfHwgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+i/mOacquaOpeWPl+WKoOWFpeW3peS9nOWMuu+8jOS4jeiDveS/ruaUueS7lueahOS4quS6uuS/oeaBr1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IGl0ZW0udXNlcm5hbWVcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoaXRlbS5wYXNzd29yZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7XG4gICAgICAgICAgICAgICAgICBsb2dvdXQ6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzdV9kb2MgPSB7fTtcbiAgICAgICAgICAgIHN1X2RvYy5faWQgPSBkYi5zcGFjZV91c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgICBzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgIHN1X2RvYy51c2VyX2FjY2VwdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1X2RvYy5pbnZpdGVfc3RhdGUgPSBcImFjY2VwdGVkXCI7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICAgIGlmIChpdGVtLmVtYWlsKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdV9kb2Mub3JnYW5pemF0aW9uID0gYmVsb25nT3JnaWRzWzBdO1xuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHM7XG4gICAgICAgICAgICBpZiAoaXRlbS5wb3NpdGlvbikge1xuICAgICAgICAgICAgICBzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ud29ya19waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnBob25lKSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0uc29ydF9ubykge1xuICAgICAgICAgICAgICBzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ubztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLmNvbXBhbnkpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXNlcl9pZCkge1xuICAgICAgICAgICAgICB1c2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcl9pZCwge1xuICAgICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgICAgdXNlcm5hbWU6IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAodXNlckluZm8udXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICBzdV9kb2MudXNlcm5hbWUgPSB1c2VySW5mby51c2VybmFtZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGVycm9yLmxpbmUgPSBpICsgMTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGUucmVhc29uO1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0LnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlcnJvckxpc3Q7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRXZWJBcHAuY29ubmVjdEhhbmRsZXJzLnVzZSBcIi9hcGkvZXhwb3J0L3NwYWNlX3VzZXJzXCIsIChyZXEsIHJlcywgbmV4dCktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcclxuXHJcblx0XHRcdHF1ZXJ5ID0gcmVxLnF1ZXJ5XHJcblx0XHRcdHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWRcclxuXHRcdFx0b3JnX2lkID0gcXVlcnkub3JnX2lkXHJcblx0XHRcdHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ11cclxuXHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6b3JnX2lkfSx7ZmllbGRzOntmdWxsbmFtZToxfX0pXHJcblx0XHRcdHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheVxyXG5cdFx0XHRub3cgPSBuZXcgRGF0ZSBcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsdXNlcl9pZClcclxuXHRcdFx0XHR1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZFxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdHNvcnQ6IHtuYW1lOiAxfVxyXG5cdFx0XHRcdH0pLmZldGNoKClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG9yZ19pZHMgPSBbXVxyXG5cdFx0XHRcdG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6b3JnX2lkLHNwYWNlOnNwYWNlX2lkfSx7ZmllbGRzOntfaWQ6MSxjaGlsZHJlbjoxfX0pLmZldGNoKClcclxuXHRcdFx0XHRvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywnX2lkJylcclxuXHRcdFx0XHRfLmVhY2ggb3JnX29ianMsKG9yZ19vYmopLT5cclxuXHRcdFx0XHRcdG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsb3JnX29iaj8uY2hpbGRyZW4pXHJcblx0XHRcdFx0Xy51bmlxKG9yZ19pZHMpXHJcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWQsb3JnYW5pemF0aW9uczp7JGluOm9yZ19pZHN9fSx7c29ydDoge3NvcnRfbm86IC0xLG5hbWU6MX19KS5mZXRjaCgpXHJcblx0XHRcdGVqcyA9IHJlcXVpcmUoJ2VqcycpXHJcblx0XHRcdHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKVxyXG5cdFx0XHRcclxuXHRcdFx0IyDmo4DmtYvmmK/lkKbmnInor63ms5XplJnor69cclxuXHRcdFx0ZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50JylcclxuXHRcdFx0ZXJyb3Jfb2JqID0gZWpzTGludC5saW50KHN0ciwge30pXHJcblx0XHRcdGlmIGVycm9yX29ialxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyb3Jfb2JqXHJcblxyXG5cdFx0XHR0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cilcclxuXHJcblx0XHRcdGxhbmcgPSAnZW4nXHJcblx0XHRcdGlmIGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSBpcyAnemgtY24nXHJcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcclxuXHJcblx0XHRcdG9yZ05hbWUgPSBpZiBvcmcgdGhlbiBvcmcuZnVsbG5hbWUgZWxzZSBvcmdfaWRcclxuXHRcdFx0ZmllbGRzID0gW3tcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbmFtZScsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbmFtZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonbW9iaWxlJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbW9iaWxlJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid3b3JrX3Bob25lJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonZW1haWwnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19lbWFpbCcse30sbGFuZylcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTonY29tcGFueScsXHJcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2NvbXBhbnknLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J3Bvc2l0aW9uJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLHt9LGxhbmcpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J29yZ2FuaXphdGlvbnMnLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwMCxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19vcmdhbml6YXRpb25zJyx7fSxsYW5nKSxcclxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XHJcblx0XHRcdFx0XHRcdG9yZ05hbWVzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46IHZhbHVlfX0se2ZpZWxkczoge2Z1bGxuYW1lOiAxfX0pLm1hcCgoaXRlbSxpbmRleCktPlxyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBpdGVtLmZ1bGxuYW1lXHJcblx0XHRcdFx0XHRcdClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIG9yZ05hbWVzLmpvaW4oXCIsXCIpXHJcblx0XHRcdFx0fSx7XHJcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcclxuXHRcdFx0XHRcdG5hbWU6J21hbmFnZXInLFxyXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxyXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge25hbWU6IDF9fSlcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/Lm5hbWVcclxuXHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxyXG5cdFx0XHRcdFx0bmFtZTondXNlcicsXHJcblx0XHRcdFx0XHR3aWR0aDogNjAsXHJcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygndXNlcnNfdXNlcm5hbWUnLHt9LGxhbmcpXHJcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxyXG5cdFx0XHRcdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB2YWx1ZX0se2ZpZWxkczoge3VzZXJuYW1lOiAxfX0pXHJcblx0XHRcdFx0XHRcdHJldHVybiB1c2VyPy51c2VybmFtZVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ051bWJlcicsXHJcblx0XHRcdFx0XHRuYW1lOidzb3J0X25vJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19zb3J0X25vJyx7fSxsYW5nKVxyXG5cdFx0XHRcdH0se1xyXG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXHJcblx0XHRcdFx0XHRuYW1lOid1c2VyX2FjY2VwdGVkJyxcclxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcclxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJyx7fSxsYW5nKVxyXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cclxuXHRcdFx0XHRcdFx0cmV0dXJuIGlmIHZhbHVlIHRoZW4gVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF95ZXMnLHt9LGxhbmcpIGVsc2UgVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZF9ubycse30sbGFuZylcclxuXHRcdFx0XHR9XVxyXG5cdFx0XHRcclxuXHRcdFx0c2hlZXRfbmFtZSA9IG9yZ05hbWU/LnJlcGxhY2UoL1xcLy9nLFwiLVwiKSAj5LiN5pSv5oyBXCIvXCLnrKblj7dcclxuXHRcdFx0cmV0ID0gdGVtcGxhdGUoe1xyXG5cdFx0XHRcdGxhbmc6IGxhbmcsXHJcblx0XHRcdFx0c2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcclxuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcclxuXHRcdFx0XHR1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xyXG5cdFx0XHR9KVxyXG5cclxuXHRcdFx0ZmlsZU5hbWUgPSBcIlN0ZWVkT1NDb250YWN0c19cIiArIG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tJykgKyBcIi54bHNcIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIitlbmNvZGVVUkkoZmlsZU5hbWUpKVxyXG5cdFx0XHRyZXMuZW5kKHJldClcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRcdHJlcy5lbmQoZS5tZXNzYWdlKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gV2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UoXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjdXJyZW50X3VzZXJfaW5mbywgZSwgZWpzLCBlanNMaW50LCBlcnJvcl9vYmosIGZpZWxkcywgZmlsZU5hbWUsIGxhbmcsIG5vdywgb3JnLCBvcmdOYW1lLCBvcmdfaWQsIG9yZ19pZHMsIG9yZ19vYmpzLCBxdWVyeSwgcmV0LCBzaGVldF9uYW1lLCBzcGFjZV9pZCwgc3RyLCB0ZW1wbGF0ZSwgdXNlcl9pZCwgdXNlcnNfdG9feGxzO1xuICAgIHRyeSB7XG4gICAgICBjdXJyZW50X3VzZXJfaW5mbyA9IHV1Zmxvd01hbmFnZXIuY2hlY2tfYXV0aG9yaXphdGlvbihyZXEpO1xuICAgICAgcXVlcnkgPSByZXEucXVlcnk7XG4gICAgICBzcGFjZV9pZCA9IHF1ZXJ5LnNwYWNlX2lkO1xuICAgICAgb3JnX2lkID0gcXVlcnkub3JnX2lkO1xuICAgICAgdXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXTtcbiAgICAgIG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogb3JnX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGZ1bGxuYW1lOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdXNlcnNfdG9feGxzID0gbmV3IEFycmF5O1xuICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIHVzZXJfaWQpKSB7XG4gICAgICAgIHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yZ19pZHMgPSBbXTtcbiAgICAgICAgb3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIF9pZDogb3JnX2lkLFxuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICBjaGlsZHJlbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgICAgb3JnX2lkcyA9IF8ucGx1Y2sob3JnX29ianMsICdfaWQnKTtcbiAgICAgICAgXy5lYWNoKG9yZ19vYmpzLCBmdW5jdGlvbihvcmdfb2JqKSB7XG4gICAgICAgICAgcmV0dXJuIG9yZ19pZHMgPSBfLnVuaW9uKG9yZ19pZHMsIG9yZ19vYmogIT0gbnVsbCA/IG9yZ19vYmouY2hpbGRyZW4gOiB2b2lkIDApO1xuICAgICAgICB9KTtcbiAgICAgICAgXy51bmlxKG9yZ19pZHMpO1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGluOiBvcmdfaWRzXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgc29ydF9ubzogLTEsXG4gICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mZXRjaCgpO1xuICAgICAgfVxuICAgICAgZWpzID0gcmVxdWlyZSgnZWpzJyk7XG4gICAgICBzdHIgPSBBc3NldHMuZ2V0VGV4dCgnc2VydmVyL2Vqcy9leHBvcnRfc3BhY2VfdXNlcnMuZWpzJyk7XG4gICAgICBlanNMaW50ID0gcmVxdWlyZSgnZWpzLWxpbnQnKTtcbiAgICAgIGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KTtcbiAgICAgIGlmIChlcnJvcl9vYmopIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIj09PS9hcGkvY29udGFjdHMvZXhwb3J0L3NwYWNlX3VzZXJzOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcl9vYmopO1xuICAgICAgfVxuICAgICAgdGVtcGxhdGUgPSBlanMuY29tcGlsZShzdHIpO1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAoY3VycmVudF91c2VyX2luZm8ubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgb3JnTmFtZSA9IG9yZyA/IG9yZy5mdWxsbmFtZSA6IG9yZ19pZDtcbiAgICAgIGZpZWxkcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX25hbWUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdtb2JpbGUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3dvcmtfcGhvbmUnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3dvcmtfcGhvbmUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdlbWFpbCcsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfZW1haWwnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICdjb21wYW55JyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAncG9zaXRpb24nLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3Bvc2l0aW9uJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnb3JnYW5pemF0aW9ucycsXG4gICAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfb3JnYW5pemF0aW9ucycsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgb3JnTmFtZXM7XG4gICAgICAgICAgICBvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogdmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KS5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZnVsbG5hbWU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbWFuYWdlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tYW5hZ2VyJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gdXNlciAhPSBudWxsID8gdXNlci5uYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyJyxcbiAgICAgICAgICB3aWR0aDogNjAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3VzZXJzX3VzZXJuYW1lJywge30sIGxhbmcpLFxuICAgICAgICAgIHRyYW5zZm9ybTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciB1c2VyO1xuICAgICAgICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHZhbHVlXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICAgICAgbmFtZTogJ3NvcnRfbm8nLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3VzZXJfYWNjZXB0ZWQnLFxuICAgICAgICAgIHdpZHRoOiAzNSxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfdXNlcl9hY2NlcHRlZCcsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfeWVzJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWRfbm8nLCB7fSwgbGFuZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdO1xuICAgICAgc2hlZXRfbmFtZSA9IG9yZ05hbWUgIT0gbnVsbCA/IG9yZ05hbWUucmVwbGFjZSgvXFwvL2csIFwiLVwiKSA6IHZvaWQgMDtcbiAgICAgIHJldCA9IHRlbXBsYXRlKHtcbiAgICAgICAgbGFuZzogbGFuZyxcbiAgICAgICAgc2hlZXRfbmFtZTogc2hlZXRfbmFtZSxcbiAgICAgICAgZmllbGRzOiBmaWVsZHMsXG4gICAgICAgIHVzZXJzX3RvX3hsczogdXNlcnNfdG9feGxzXG4gICAgICB9KTtcbiAgICAgIGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCI7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsIFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtRGlzcG9zaXRpb25cIiwgXCJhdHRhY2htZW50O2ZpbGVuYW1lPVwiICsgZW5jb2RlVVJJKGZpbGVOYW1lKSk7XG4gICAgICByZXR1cm4gcmVzLmVuZChyZXQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgcmV0dXJuIHJlcy5lbmQoZS5tZXNzYWdlKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
