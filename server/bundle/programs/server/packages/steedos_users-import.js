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
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"steedos_contacts_import_users":"导入用户","steedos_contacts_import_users_note":"导入规则","steedos_contacts_import_users_note_detail":"<p>数据文件必须为Excel</p><p>1、部门必须为全路径（例如：上海华炎软件/研发部）。如果部门不存在，则自动创建</p><p>2、导入用户如果不存在，则自动创建; 只有新建的用户支持设置密码</p><p>3、导入用户如果存在，并且已加入当前工作区，则修改用户信息。如果导入的属性为空，则不修改此属性值</p>","steedos_contacts_import_users_data_file_title":"数据文件(Excel)","steedos_contacts_import_users_download_simple_data_file":"下载导入模板","steedos_contacts_import_users_match_user_base_username":"根据用户名匹配用户","steedos_contacts_import_users_match_user_base_email":"根据邮箱匹配用户","steedos_contacts_import_users_match_user_base_mobile":"根据手机号匹配用户","steedos_contacts_import_users_preview":"数据预览","steedos_contacts_import_users_title":"导入","steedos_contacts_import_users_check":"数据校验","steedos_contacts_import_users_organization":"所属部门","steedos_contacts_import_users_username":"用户名","steedos_contacts_import_users_email":"邮箱","steedos_contacts_import_users_name":"姓名","steedos_contacts_import_users_position":"职务","steedos_contacts_import_users_work_phone":"固定电话","steedos_contacts_import_users_phone":"手机","steedos_contacts_import_users_user_accepted":"有效","steedos_contacts_import_users_sort_no":"排序号","steedos_contacts_import_users_password":"密码","steedos_contacts_import_users_file_error":"文件必须为excel","steedos_contacts_import_users_select_file":"请选择需要导入的文件","steedos_contacts_import_users_import_success":"导入已完成","steedos_contacts_import_users_check_success":"校验通过"});
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
      var operating, organization, organization_depts, phoneNumber, ref, ref1, ref2, ref3, selector, spaceUserExist, testObj, user, userExist;

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

      return organization_depts.forEach(function (dept_name, j) {
        if (!dept_name) {
          throw new Meteor.Error(500, "第" + (i + 1) + "行：无效的部门");
        }
      });
    });

    if (onlyCheck) {
      return;
    }

    data.forEach(function (item, i) {
      var belongOrgids, e, error, multiOrgs, now, operating, organization, phoneNumber, selector, space_user, space_user_update_doc, su_doc, udoc, user, userExist, user_id;
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
          var fullname, organization_depts, parent_org_id;
          organization_depts = orgFullname.trim().split("/");
          fullname = "";
          parent_org_id = root_org._id;
          return organization_depts.forEach(function (dept_name, j) {
            var org, org_doc, org_id, parent, updateFields;

            if (j > 0) {
              if (j === 1) {
                fullname = dept_name;
              } else {
                fullname = fullname + "/" + dept_name;
              }

              org = db.organizations.findOne({
                space: space_id,
                fullname: fullname
              });

              if (org) {
                parent_org_id = org._id;
                return belongOrgids.push(org._id);
              } else {
                org_doc = {};
                org_doc._id = db.organizations._makeNewID();
                org_doc.space = space_id;
                org_doc.name = dept_name;
                org_doc.parent = parent_org_id;
                org_doc.created = now;
                org_doc.created_by = owner_id;
                org_doc.modified = now;
                org_doc.modified_by = owner_id;
                org_id = db.organizations.direct.insert(org_doc);

                if (org_id) {
                  org = db.organizations.findOne(org_id);
                  updateFields = {};
                  updateFields.parents = org.calculateParents();
                  updateFields.fullname = org.calculateFullname();

                  if (!_.isEmpty(updateFields)) {
                    db.organizations.direct.update(org._id, {
                      $set: updateFields
                    });
                  }

                  if (org.parent) {
                    parent = db.organizations.findOne(org.parent);
                    db.organizations.direct.update(parent._id, {
                      $set: {
                        children: parent.calculateChildren()
                      }
                    });
                  }

                  parent_org_id = org_id;
                  return belongOrgids.push(org._id);
                }
              }
            }
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NwYWNlX3VzZXJzX2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zcGFjZV91c2Vyc19hY3Rpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX3NwYWNlX3VzZXJzX2V4cG9ydC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYWN0aW9ucyIsImxhYmVsIiwib24iLCJ2aXNpYmxlIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJDcmVhdG9yIiwiaXNTcGFjZUFkbWluIiwidG9kbyIsIlN0ZWVkb3MiLCJpc1BhaWRTcGFjZSIsInNwYWNlVXBncmFkZWRNb2RhbCIsIk1vZGFsIiwic2hvdyIsIm9yZ0lkIiwicmVmIiwic3BhY2VJZCIsInVvYmoiLCJ1cmwiLCJTZXNzaW9uIiwiZ2V0IiwiTWV0ZW9yIiwidXNlcklkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsInNwYWNlX2lkIiwib3JnX2lkIiwiYWJzb2x1dGVVcmwiLCIkIiwicGFyYW0iLCJ3aW5kb3ciLCJvcGVuIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJUQVBpMThuIiwiX18iLCJzdGFydHVwIiwiT2JqZWN0cyIsInNwYWNlX3VzZXJzIiwiXyIsImV4dGVuZCIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJ1c2VyX3BrIiwiZGF0YSIsIm9ubHlDaGVjayIsIl9zZWxmIiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImN1cnJlbnRVc2VyIiwiY3VycmVudFVzZXJMb2NhbGUiLCJjdXJyZW50VXNlclBob25lUHJlZml4IiwiZXJyb3JMaXN0Iiwib3duZXJfaWQiLCJyb290X29yZyIsInNwYWNlIiwidGVzdERhdGEiLCJFcnJvciIsImRiIiwib3JnYW5pemF0aW9ucyIsImZpbmRPbmUiLCJwYXJlbnQiLCJzcGFjZXMiLCJhZG1pbnMiLCJpbmNsdWRlcyIsImlzX3BhaWQiLCJmaW5kIiwiX2lkIiwidXNlcl9hY2NlcHRlZCIsImNvdW50IiwibGVuZ3RoIiwidXNlcl9saW1pdCIsIm93bmVyIiwidXNlcnMiLCJmaWVsZHMiLCJsb2NhbGUiLCJwaG9uZSIsImdldFBob25lUHJlZml4IiwiZm9yRWFjaCIsIml0ZW0iLCJpIiwib3BlcmF0aW5nIiwib3JnYW5pemF0aW9uIiwib3JnYW5pemF0aW9uX2RlcHRzIiwicGhvbmVOdW1iZXIiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJzZWxlY3RvciIsInNwYWNlVXNlckV4aXN0IiwidGVzdE9iaiIsInVzZXIiLCJ1c2VyRXhpc3QiLCJlbWFpbCIsInVzZXJuYW1lIiwiZmlsdGVyUHJvcGVydHkiLCJ0ZXN0IiwicHVzaCIsIiRvciIsImZldGNoIiwicGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsInNwbGl0IiwibmFtZSIsImRlcHRfbmFtZSIsImoiLCJiZWxvbmdPcmdpZHMiLCJlIiwiZXJyb3IiLCJtdWx0aU9yZ3MiLCJub3ciLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcl91cGRhdGVfZG9jIiwic3VfZG9jIiwidWRvYyIsInVzZXJfaWQiLCJEYXRlIiwib3JnRnVsbG5hbWUiLCJmdWxsbmFtZSIsInBhcmVudF9vcmdfaWQiLCJ0cmltIiwib3JnIiwib3JnX2RvYyIsInVwZGF0ZUZpZWxkcyIsIl9tYWtlTmV3SUQiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJkaXJlY3QiLCJpbnNlcnQiLCJwYXJlbnRzIiwiY2FsY3VsYXRlUGFyZW50cyIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwiaXNFbXB0eSIsInVwZGF0ZSIsIiRzZXQiLCJjaGlsZHJlbiIsImNhbGN1bGF0ZUNoaWxkcmVuIiwic3RlZWRvc19pZCIsInNwYWNlc19pbnZpdGVkIiwiZW1haWxzIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwibnVtYmVyIiwibW9iaWxlIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJ1bmlxIiwiY29uY2F0IiwiY29tcGFueSIsInBvc2l0aW9uIiwid29ya19waG9uZSIsInNvcnRfbm8iLCJrZXlzIiwiaW52aXRlX3N0YXRlIiwiZXJyb3IxIiwibGluZSIsIm1lc3NhZ2UiLCJyZWFzb24iLCJXZWJBcHAiLCJjb25uZWN0SGFuZGxlcnMiLCJ1c2UiLCJyZXEiLCJyZXMiLCJuZXh0IiwiY3VycmVudF91c2VyX2luZm8iLCJlanMiLCJlanNMaW50IiwiZXJyb3Jfb2JqIiwiZmlsZU5hbWUiLCJsYW5nIiwib3JnTmFtZSIsIm9yZ19pZHMiLCJvcmdfb2JqcyIsInF1ZXJ5IiwicmV0Iiwic2hlZXRfbmFtZSIsInN0ciIsInRlbXBsYXRlIiwidXNlcnNfdG9feGxzIiwidXVmbG93TWFuYWdlciIsImNoZWNrX2F1dGhvcml6YXRpb24iLCJBcnJheSIsInNvcnQiLCJwbHVjayIsImVhY2giLCJvcmdfb2JqIiwidW5pb24iLCIkaW4iLCJyZXF1aXJlIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImxpbnQiLCJjb25zb2xlIiwiY29tcGlsZSIsIndpZHRoIiwidHJhbnNmb3JtIiwidmFsdWUiLCJvcmdOYW1lcyIsIm1hcCIsImluZGV4Iiwiam9pbiIsInJlcGxhY2Ui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TjtBQUlEdkssZUFBT0ssUUFBUUMsRUFBUixDQUFXLDJCQUFYLEVBQXVDLEVBQXZDLEVBQTBDd0ksSUFBMUMsQ0FKTjtBQUtEMEIsbUJBQVcsVUFBQ0MsS0FBRDtBQUNILGNBQUdBLEtBQUg7QUNxREMsbUJEckRhcEssUUFBUUMsRUFBUixDQUFXLCtCQUFYLEVBQTJDLEVBQTNDLEVBQThDd0ksSUFBOUMsQ0NxRGI7QURyREQ7QUN1REMsbUJEdkRzRXpJLFFBQVFDLEVBQVIsQ0FBVyw4QkFBWCxFQUEwQyxFQUExQyxFQUE2Q3dJLElBQTdDLENDdUR0RTtBQUNEO0FEOURQO0FBQUEsT0E3RE0sQ0FBVDtBQXNFQU0sbUJBQUFMLFdBQUEsT0FBYUEsUUFBUytCLE9BQVQsQ0FBaUIsS0FBakIsRUFBdUIsR0FBdkIsQ0FBYixHQUFhLE1BQWI7QUFDQTNCLFlBQU1HLFNBQVM7QUFDZFIsY0FBTUEsSUFEUTtBQUVkTSxvQkFBWUEsVUFGRTtBQUdkeEcsZ0JBQVFBLE1BSE07QUFJZDJHLHNCQUFjQTtBQUpBLE9BQVQsQ0FBTjtBQU9BVixpQkFBVyxxQkFBcUJrQyxTQUFTQyxNQUFULENBQWdCLGNBQWhCLENBQXJCLEdBQXVELE1BQWxFO0FBQ0F6QyxVQUFJMEMsU0FBSixDQUFjLGNBQWQsRUFBOEIsMEJBQTlCO0FBQ0ExQyxVQUFJMEMsU0FBSixDQUFjLHFCQUFkLEVBQXFDLHlCQUF1QkMsVUFBVXJDLFFBQVYsQ0FBNUQ7QUN5REcsYUR4REhOLElBQUk0QyxHQUFKLENBQVFoQyxHQUFSLENDd0RHO0FEbExKLGFBQUFwRSxLQUFBO0FBMkhNRCxVQUFBQyxLQUFBO0FBQ0xzRixjQUFRdEYsS0FBUixDQUFjRCxFQUFFc0csS0FBaEI7QUMwREcsYUR6REg3QyxJQUFJNEMsR0FBSixDQUFRckcsRUFBRW1ELE9BQVYsQ0N5REc7QUFDRDtBRHhMSixJQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJlanNcIjogXCJeMi41LjVcIixcblx0XCJlanMtbGludFwiOiBcIl4wLjIuMFwiXG59LCAnc3RlZWRvczp1c2Vycy1pbXBvcnQnKTtcbiIsImFjdGlvbnMgPSBcblx0aW1wb3J0OlxuXHRcdGxhYmVsOiBcIuWvvOWFpVwiXG5cdFx0b246IFwibGlzdFwiXG5cdFx0dmlzaWJsZTogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucyktPlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKClcblx0XHR0b2RvOiAoKS0+XG5cdFx0XHRpZiAhU3RlZWRvcy5pc1BhaWRTcGFjZSgpXG5cdFx0XHRcdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsKClcblx0XHRcdFx0cmV0dXJuO1xuXG5cdFx0XHRNb2RhbC5zaG93KFwiaW1wb3J0X3VzZXJzX21vZGFsXCIpO1xuXHRcblx0ZXhwb3J0OlxuXHRcdGxhYmVsOiBcIuWvvOWHulwiXG5cdFx0b246IFwibGlzdFwiXG5cdFx0dmlzaWJsZTogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucyktPlxuXHRcdFx0cmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKClcblx0XHR0b2RvOiAoKS0+XG5cdFx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG5cdFx0XHRvcmdJZCA9IFNlc3Npb24uZ2V0KFwiZ3JpZF9zaWRlYmFyX3NlbGVjdGVkXCIpP1swXVxuXHRcdFx0aWYgc3BhY2VJZCBhbmQgb3JnSWRcblx0XHRcdFx0dW9iaiA9IHt9XG5cdFx0XHRcdHVvYmpbXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKClcblx0XHRcdFx0dW9ialtcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKClcblx0XHRcdFx0dW9iai5zcGFjZV9pZCA9IHNwYWNlSWRcblx0XHRcdFx0dW9iai5vcmdfaWQgPSBvcmdJZFxuXHRcdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKCkgKyBcImFwaS9leHBvcnQvc3BhY2VfdXNlcnM/XCIgKyAkLnBhcmFtKHVvYmopXG5cdFx0XHRcdHdpbmRvdy5vcGVuKHVybCwgJ19wYXJlbnQnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzd2FsXG5cdFx0XHRcdFx0dGl0bGU6IFwi5bem5L6n5pyq6YCJ5Lit5Lu75L2V57uE57uHXCJcblx0XHRcdFx0XHR0ZXh0OiBcIuivt+WcqOW3puS+p+e7hOe7h+acuuaehOagkeS4remAieS4reS4gOS4que7hOe7h+WQjuWGjeaJp+ihjOWvvOWHuuaTjeS9nFwiXG5cdFx0XHRcdFx0aHRtbDogdHJ1ZVxuXHRcdFx0XHRcdHR5cGU6ICd3YXJuaW5nJ1xuXHRcdFx0XHRcdGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKCdPSycpXG5cblxuTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHR1bmxlc3MgQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzPy5hY3Rpb25zXG5cdFx0Q3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzLmFjdGlvbnMgPSB7fVxuXG5cdF8uZXh0ZW5kKENyZWF0b3IuT2JqZWN0cy5zcGFjZV91c2Vycy5hY3Rpb25zLCBhY3Rpb25zKTtcbiIsInZhciBhY3Rpb25zO1xuXG5hY3Rpb25zID0ge1xuICBcImltcG9ydFwiOiB7XG4gICAgbGFiZWw6IFwi5a+85YWlXCIsXG4gICAgb246IFwibGlzdFwiLFxuICAgIHZpc2libGU6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKCk7XG4gICAgfSxcbiAgICB0b2RvOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghU3RlZWRvcy5pc1BhaWRTcGFjZSgpKSB7XG4gICAgICAgIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBNb2RhbC5zaG93KFwiaW1wb3J0X3VzZXJzX21vZGFsXCIpO1xuICAgIH1cbiAgfSxcbiAgXCJleHBvcnRcIjoge1xuICAgIGxhYmVsOiBcIuWvvOWHulwiLFxuICAgIG9uOiBcImxpc3RcIixcbiAgICB2aXNpYmxlOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkLCByZWNvcmRfcGVybWlzc2lvbnMpIHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmlzU3BhY2VBZG1pbigpO1xuICAgIH0sXG4gICAgdG9kbzogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgb3JnSWQsIHJlZiwgc3BhY2VJZCwgdW9iaiwgdXJsO1xuICAgICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICAgIG9yZ0lkID0gKHJlZiA9IFNlc3Npb24uZ2V0KFwiZ3JpZF9zaWRlYmFyX3NlbGVjdGVkXCIpKSAhPSBudWxsID8gcmVmWzBdIDogdm9pZCAwO1xuICAgICAgaWYgKHNwYWNlSWQgJiYgb3JnSWQpIHtcbiAgICAgICAgdW9iaiA9IHt9O1xuICAgICAgICB1b2JqW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgICAgICB1b2JqW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICAgICAgdW9iai5zcGFjZV9pZCA9IHNwYWNlSWQ7XG4gICAgICAgIHVvYmoub3JnX2lkID0gb3JnSWQ7XG4gICAgICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSArIFwiYXBpL2V4cG9ydC9zcGFjZV91c2Vycz9cIiArICQucGFyYW0odW9iaik7XG4gICAgICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfcGFyZW50JywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3dhbCh7XG4gICAgICAgICAgdGl0bGU6IFwi5bem5L6n5pyq6YCJ5Lit5Lu75L2V57uE57uHXCIsXG4gICAgICAgICAgdGV4dDogXCLor7flnKjlt6bkvqfnu4Tnu4fmnLrmnoTmoJHkuK3pgInkuK3kuIDkuKrnu4Tnu4flkI7lho3miafooYzlr7zlh7rmk43kvZxcIixcbiAgICAgICAgICBodG1sOiB0cnVlLFxuICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcbiAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXygnT0snKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVmO1xuICBpZiAoISgocmVmID0gQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzKSAhPSBudWxsID8gcmVmLmFjdGlvbnMgOiB2b2lkIDApKSB7XG4gICAgQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzLmFjdGlvbnMgPSB7fTtcbiAgfVxuICByZXR1cm4gXy5leHRlbmQoQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzLmFjdGlvbnMsIGFjdGlvbnMpO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHQjIyNcblx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0MuOAgeagoemqjOW3peS9nOWMuueUqOaIt+aYr+WQpuWtmOWcqFxuXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcblx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0VE9ETzog5Zu96ZmF5YyWXG5cdCMjI1xuXHRpbXBvcnRfdXNlcnM6IChzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKS0+XG5cblx0XHRfc2VsZiA9IHRoaXNcblxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi6K+35YWI55m75b2VXCIpXG5cblx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBwYXJlbnQ6IG51bGx9KVxuXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlPy5hZG1pbnMuaW5jbHVkZXModGhpcy51c2VySWQpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLlj6rmnInlt6XkvZzljLrnrqHnkIblkZjlj6/ku6Xlr7zlhaXnlKjmiLdcIik7XG5cblx0XHRpZiAhc3BhY2UuaXNfcGFpZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDEsIFwi5qCH5YeG54mI5LiN5pSv5oyB5q2k5Yqf6IO9XCIpO1xuXG5cdFx0YWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZS5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0aWYgKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLpnIDopoHmj5DljYflt7LotK3kubDnlKjmiLfmlbDoh7Mje2FjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aH0o5b2T5YmNI3tzcGFjZS51c2VyX2xpbWl0fSlcIiArXCIsIOivt+WcqOS8geS4muS/oeaBr+aooeWdl+S4reeCueWHu+WNh+e6p+aMiemSrui0reS5sFwiKVxuXG5cdFx0b3duZXJfaWQgPSBzcGFjZS5vd25lclxuXG5cdFx0dGVzdERhdGEgPSBbXVxuXG5cdFx0ZXJyb3JMaXN0ID0gW11cblxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBfc2VsZi51c2VySWR9LHtmaWVsZHM6e2xvY2FsZToxLHBob25lOjF9fSlcblx0XHRjdXJyZW50VXNlckxvY2FsZSA9IGN1cnJlbnRVc2VyLmxvY2FsZVxuXHRcdGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggPSBBY2NvdW50cy5nZXRQaG9uZVByZWZpeCBjdXJyZW50VXNlclxuXG5cdFx0IyDmlbDmja7nu5/kuIDmoKHpqoxcblxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxuXHRcdFx0IyBjb25zb2xlLmxvZyBpdGVtXG5cdFx0XHQjIOeUqOaIt+WQje+8jOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulxuXHRcdFx0aWYgIWl0ZW0ucGhvbmUgYW5kICFpdGVtLmVtYWlsXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGMOiDmiYvmnLrlj7fvvIzpgq7nrrHkuI3og73pg73kuLrnqbpcIilcblxuXHRcdFx0IyDliKTmlq1leGNlbOS4reeahOaVsOaNru+8jOeUqOaIt+WQjeOAgeaJi+acuuWPt+etieS/oeaBr+aYr+WQpuacieivr1xuXHRcdFx0dGVzdE9iaiA9IHt9XG5cdFx0XHRpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdHRlc3RPYmoudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwidXNlcm5hbWVcIiwgaXRlbS51c2VybmFtZSkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN6YeN5aSNXCIpO1xuXG5cdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdHRlc3RPYmoucGhvbmUgPSBpdGVtLnBob25lXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwicGhvbmVcIiwgaXRlbS5waG9uZSkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5omL5py65Y+36YeN5aSNXCIpO1xuXG5cdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bmoLzlvI/plJnor68je2l0ZW0uZW1haWx9XCIpO1xuXG5cdFx0XHRcdHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsXG5cdFx0XHRcdGlmIHRlc3REYXRhLmZpbHRlclByb3BlcnR5KFwiZW1haWxcIiwgaXRlbS5lbWFpbCkubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YKu5Lu26YeN5aSNXCIpO1xuXG5cdFx0XHRpdGVtLnNwYWNlID0gc3BhY2VfaWRcblxuXHRcdFx0dGVzdERhdGEucHVzaCh0ZXN0T2JqKVxuXG5cdFx0XHQjIOiOt+WPluafpeaJvnVzZXLnmoTmnaHku7Zcblx0XHRcdHNlbGVjdG9yID0gW11cblx0XHRcdG9wZXJhdGluZyA9IFwiXCJcblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9XG5cdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbH1cblx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0cGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlcn1cblxuXHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXG5cblxuXHRcdFx0IyDlhYjliKTmlq3mmK/lkKbog73ljLnphY3liLDllK/kuIDnmoR1c2Vy77yM54S25ZCO5Yik5pat6K+l55So5oi35pivaW5zZXJ05Yiwc3BhY2VfdXNlcnPov5jmmK91cGRhdGVcblx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXS5faWRcblx0XHRcdFx0c3BhY2VVc2VyRXhpc3QgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJ9KVxuXHRcdFx0XHRpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcInVwZGF0ZVwiXG5cdFx0XHRcdGVsc2UgaWYgc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PSAwXG5cdFx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxuXHRcdFx0ZWxzZSBpZiB1c2VyRXhpc3QuY291bnQoKSA9PSAwXG5cdFx0XHRcdCMg5paw5aKec3BhY2VfdXNlcnPnmoTmlbDmja7moKHpqoxcblx0XHRcdFx0b3BlcmF0aW5nID0gXCJpbnNlcnRcIlxuXG5cdFx0XHQjIOWIpOaWreaYr+WQpuiDveS/ruaUueeUqOaIt+eahOWvhueggVxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCBhbmQgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRpZiB1c2VyRXhpc3QuZmV0Y2goKVswXS5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35bey6K6+572u5a+G56CB77yM5LiN5YWB6K645L+u5pS5XCIpO1xuXG5cdFx0XHQjIOWIpOaWremDqOmXqOaYr+WQpuWQiOeQhlxuXHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cblxuXHRcdFx0aWYgIW9yZ2FuaXphdGlvblxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumDqOmXqOS4jeiDveS4uuepulwiKTtcblxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiL1wiKTtcblxuXHRcdFx0aWYgb3JnYW5pemF0aW9uX2RlcHRzLmxlbmd0aCA8IDEgfHwgb3JnYW5pemF0aW9uX2RlcHRzWzBdICE9IHJvb3Rfb3JnLm5hbWVcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrml6DmlYjnmoTmoLnpg6jpl6hcIik7XG5cblx0XHRcdGlmIGl0ZW0ucGFzc3dvcmQgJiYgdXNlcj8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHRcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG5cblx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdGlmICFkZXB0X25hbWVcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOmDqOmXqFwiKTtcblxuXG5cdFx0aWYgb25seUNoZWNrXG5cdFx0XHRyZXR1cm4gO1xuXG5cdFx0IyDmlbDmja7lr7zlhaVcblx0XHRkYXRhLmZvckVhY2ggKGl0ZW0sIGkpLT5cblx0XHRcdGVycm9yID0ge31cblx0XHRcdHRyeVxuXHRcdFx0XHRzZWxlY3RvciA9IFtdXG5cdFx0XHRcdG9wZXJhdGluZyA9IFwiXCJcblx0XHRcdFx0IyBpZiBpdGVtLnVzZXJuYW1lXG5cdFx0XHRcdCMgXHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cblx0XHRcdFx0aWYgaXRlbS5lbWFpbFxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wiZW1haWxzLmFkZHJlc3NcIjogaXRlbS5lbWFpbH1cblx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdHBob25lTnVtYmVyID0gY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRzZWxlY3Rvci5wdXNoIHtcInBob25lLm51bWJlclwiOiBwaG9uZU51bWJlcn1cblx0XHRcdFx0dXNlckV4aXN0ID0gZGIudXNlcnMuZmluZCh7JG9yOiBzZWxlY3Rvcn0pXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5jb3VudCgpID4gMVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIueUqOaIt+WQjeOAgeaJi+acuuWPt+OAgemCrueuseS/oeaBr+acieivr++8jOaXoOazleWMuemFjeWIsOWQjOS4gOi0puWPt1wiKVxuXHRcdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0XHR1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF1cblxuXHRcdFx0XHRub3cgPSBuZXcgRGF0ZSgpXG5cblx0XHRcdFx0b3JnYW5pemF0aW9uID0gaXRlbS5vcmdhbml6YXRpb25cblx0XHRcdFx0bXVsdGlPcmdzID0gb3JnYW5pemF0aW9uLnNwbGl0KFwiLFwiKVxuXHRcdFx0XHRiZWxvbmdPcmdpZHMgPSBbXVxuXHRcdFx0XHRtdWx0aU9yZ3MuZm9yRWFjaCAob3JnRnVsbG5hbWUpIC0+XG5cdFx0XHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzID0gb3JnRnVsbG5hbWUudHJpbSgpLnNwbGl0KFwiL1wiKVxuXHRcdFx0XHRcdGZ1bGxuYW1lID0gXCJcIlxuXHRcdFx0XHRcdHBhcmVudF9vcmdfaWQgPSByb290X29yZy5faWRcblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaCAoZGVwdF9uYW1lLCBqKSAtPlxuXHRcdFx0XHRcdFx0aWYgaiA+IDBcblx0XHRcdFx0XHRcdFx0aWYgaiA9PSAxXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBkZXB0X25hbWVcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGZ1bGxuYW1lID0gZnVsbG5hbWUgKyBcIi9cIiArIGRlcHRfbmFtZVxuXG5cdFx0XHRcdFx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBmdWxsbmFtZTogZnVsbG5hbWV9KVxuXG5cdFx0XHRcdFx0XHRcdGlmIG9yZ1xuXHRcdFx0XHRcdFx0XHRcdHBhcmVudF9vcmdfaWQgPSBvcmcuX2lkXG5cdFx0XHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYyA9IHt9XG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5faWQgPSBkYi5vcmdhbml6YXRpb25zLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2Muc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2MubmFtZSA9IGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2MucGFyZW50ID0gcGFyZW50X29yZ19pZFxuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2MuY3JlYXRlZCA9IG5vd1xuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2MuY3JlYXRlZF9ieSA9IG93bmVyX2lkXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5tb2RpZmllZCA9IG5vd1xuXHRcdFx0XHRcdFx0XHRcdG9yZ19kb2MubW9kaWZpZWRfYnkgPSBvd25lcl9pZFxuXHRcdFx0XHRcdFx0XHRcdG9yZ19pZCA9IGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0Lmluc2VydChvcmdfZG9jKVxuXG5cdFx0XHRcdFx0XHRcdFx0aWYgb3JnX2lkXG5cdFx0XHRcdFx0XHRcdFx0XHRvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUob3JnX2lkKVxuXHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlRmllbGRzID0ge31cblx0XHRcdFx0XHRcdFx0XHRcdHVwZGF0ZUZpZWxkcy5wYXJlbnRzID0gb3JnLmNhbGN1bGF0ZVBhcmVudHMoKVxuXHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlRmllbGRzLmZ1bGxuYW1lID0gb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKClcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgIV8uaXNFbXB0eSh1cGRhdGVGaWVsZHMpXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZShvcmcuX2lkLCB7JHNldDogdXBkYXRlRmllbGRzfSlcblxuXHRcdFx0XHRcdFx0XHRcdFx0aWYgb3JnLnBhcmVudFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJlbnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUob3JnLnBhcmVudClcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHBhcmVudC5faWQsIHskc2V0OiB7Y2hpbGRyZW46IHBhcmVudC5jYWxjdWxhdGVDaGlsZHJlbigpfX0pXG5cblx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudF9vcmdfaWQgPSBvcmdfaWRcblx0XHRcdFx0XHRcdFx0XHRcdGJlbG9uZ09yZ2lkcy5wdXNoIG9yZy5faWRcblxuXG5cdFx0XHRcdHVzZXJfaWQgPSBudWxsXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHR1c2VyX2lkID0gdXNlci5faWRcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHVkb2MgPSB7fVxuXHRcdFx0XHRcdHVkb2MuX2lkID0gZGIudXNlcnMuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0dWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZFxuXHRcdFx0XHRcdHVkb2MubG9jYWxlID0gY3VycmVudFVzZXJMb2NhbGVcblx0XHRcdFx0XHR1ZG9jLnNwYWNlc19pbnZpdGVkID0gW3NwYWNlX2lkXVxuXHRcdFx0XHRcdGlmIGl0ZW0ubmFtZVxuXHRcdFx0XHRcdFx0dWRvYy5uYW1lID0gaXRlbS5uYW1lXG5cblx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHR1ZG9jLmVtYWlscyA9IFt7YWRkcmVzczogaXRlbS5lbWFpbCwgdmVyaWZpZWQ6IGZhbHNlfV1cblxuXHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0XHRcdHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lXG5cblx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHR1ZG9jLnBob25lID0ge1xuXHRcdFx0XHRcdFx0XHRudW1iZXI6IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdG1vYmlsZTogaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHR2ZXJpZmllZDogZmFsc2Vcblx0XHRcdFx0XHRcdFx0bW9kaWZpZWQ6IG5vd1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYylcblxuXHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcblx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcblxuXHRcdFx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyOiB1c2VyX2lkfSlcblxuXHRcdFx0XHRpZiBzcGFjZV91c2VyXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdGlmICFzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnNcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlci5vcmdhbml6YXRpb25zID0gW11cblxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge31cblxuXHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm9yZ2FuaXphdGlvbnMgPSBfLnVuaXEoc3BhY2VfdXNlci5vcmdhbml6YXRpb25zLmNvbmNhdChiZWxvbmdPcmdpZHMpKVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5uYW1lID0gaXRlbS5uYW1lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uY29tcGFueVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MuY29tcGFueSA9IGl0ZW0uY29tcGFueVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBvc2l0aW9uXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5wb3NpdGlvbiA9IGl0ZW0ucG9zaXRpb25cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS53b3JrX3Bob25lXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy53b3JrX3Bob25lID0gaXRlbS53b3JrX3Bob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm1vYmlsZSA9IGl0ZW0ucGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5zb3J0X25vXG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5zb3J0X25vID0gaXRlbS5zb3J0X25vXG5cblx0XHRcdFx0XHRcdGlmIF8ua2V5cyhzcGFjZV91c2VyX3VwZGF0ZV9kb2MpLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMudXBkYXRlKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9LCB7JHNldDogc3BhY2VfdXNlcl91cGRhdGVfZG9jfSlcblxuXHRcdFx0XHRcdFx0aWYgc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCIgb3Igc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi36L+Y5pyq5o6l5Y+X5Yqg5YWl5bel5L2c5Yy677yM5LiN6IO95L+u5pS55LuW55qE5Liq5Lq65L+h5oGvXCIpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0XHRcdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0seyRzZXQ6e3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfX0pXG5cdFx0XHRcdFx0XHRcdGlmIGl0ZW0ucGFzc3dvcmRcblx0XHRcdFx0XHRcdFx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBpdGVtLnBhc3N3b3JkLCB7bG9nb3V0OiBmYWxzZX0pXG5cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGlmIGJlbG9uZ09yZ2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRzdV9kb2MgPSB7fVxuXHRcdFx0XHRcdFx0c3VfZG9jLl9pZCA9IGRiLnNwYWNlX3VzZXJzLl9tYWtlTmV3SUQoKVxuXHRcdFx0XHRcdFx0c3VfZG9jLnNwYWNlID0gc3BhY2VfaWRcblxuXHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSAgdHJ1ZVxuXHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwiYWNjZXB0ZWRcIlxuXG5cdFx0XHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy51c2VyX2FjY2VwdGVkID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiXG5cblx0XHRcdFx0XHRcdHN1X2RvYy5uYW1lID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb24gPSBiZWxvbmdPcmdpZHNbMF1cblx0XHRcdFx0XHRcdHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cblx0XHRcdFx0XHRcdFx0c3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcblx0XHRcdFx0XHRcdFx0c3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cblx0XHRcdFx0XHRcdFx0c3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XG5cblx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGVycm9yLmxpbmUgPSBpKzFcblx0XHRcdFx0ZXJyb3IubWVzc2FnZSA9IGUucmVhc29uXG5cdFx0XHRcdGVycm9yTGlzdC5wdXNoKGVycm9yKVxuXG5cdFx0cmV0dXJuIGVycm9yTGlzdFxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuXG4gIC8qXG4gIFx0XHQx44CB5qCh6aqM55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHQz44CB5qCh6aqM6YOo6Zeo5piv5ZCm5a2Y5ZyoXG4gIFx0XHQ044CB5qCh6aqM6YOo6Zeo55So5oi35piv5ZCm5a2Y5ZyoXG4gIFx0XHRUT0RPOiDlm73pmYXljJZcbiAgICovXG4gIGltcG9ydF91c2VyczogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJfcGssIGRhdGEsIG9ubHlDaGVjaykge1xuICAgIHZhciBfc2VsZiwgYWNjZXB0ZWRfdXNlcl9jb3VudCwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VyTG9jYWxlLCBjdXJyZW50VXNlclBob25lUHJlZml4LCBlcnJvckxpc3QsIG93bmVyX2lkLCByb290X29yZywgc3BhY2UsIHRlc3REYXRhO1xuICAgIF9zZWxmID0gdGhpcztcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UgfHwgIShzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLmoIflh4bniYjkuI3mlK/mjIHmraTlip/og71cIik7XG4gICAgfVxuICAgIGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZS5faWQsXG4gICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgfSkuY291bnQoKTtcbiAgICBpZiAoKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgKFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezXCIgKyAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSArIFwiKOW9k+WJjVwiICsgc3BhY2UudXNlcl9saW1pdCArIFwiKVwiKSArIFwiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIik7XG4gICAgfVxuICAgIG93bmVyX2lkID0gc3BhY2Uub3duZXI7XG4gICAgdGVzdERhdGEgPSBbXTtcbiAgICBlcnJvckxpc3QgPSBbXTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBfc2VsZi51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgbG9jYWxlOiAxLFxuICAgICAgICBwaG9uZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlO1xuICAgIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggPSBBY2NvdW50cy5nZXRQaG9uZVByZWZpeChjdXJyZW50VXNlcik7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgb3JnYW5pemF0aW9uX2RlcHRzLCBwaG9uZU51bWJlciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgcGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZTtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgIGlmICghZGVwdF9uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChvbmx5Q2hlY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBiZWxvbmdPcmdpZHMsIGUsIGVycm9yLCBtdWx0aU9yZ3MsIG5vdywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIHBob25lTnVtYmVyLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlcl9pZDtcbiAgICAgIGVycm9yID0ge307XG4gICAgICB0cnkge1xuICAgICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lO1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdO1xuICAgICAgICB9XG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICBiZWxvbmdPcmdpZHMgPSBbXTtcbiAgICAgICAgbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgICB2YXIgZnVsbG5hbWUsIG9yZ2FuaXphdGlvbl9kZXB0cywgcGFyZW50X29yZ19pZDtcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgICBwYXJlbnRfb3JnX2lkID0gcm9vdF9vcmcuX2lkO1xuICAgICAgICAgIHJldHVybiBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICAgIHZhciBvcmcsIG9yZ19kb2MsIG9yZ19pZCwgcGFyZW50LCB1cGRhdGVGaWVsZHM7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50X29yZ19pZCA9IG9yZy5faWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlbG9uZ09yZ2lkcy5wdXNoKG9yZy5faWQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZ19kb2MgPSB7fTtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLl9pZCA9IGRiLm9yZ2FuaXphdGlvbnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgICAgIG9yZ19kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLm5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgICAgb3JnX2RvYy5wYXJlbnQgPSBwYXJlbnRfb3JnX2lkO1xuICAgICAgICAgICAgICAgIG9yZ19kb2MuY3JlYXRlZCA9IG5vdztcbiAgICAgICAgICAgICAgICBvcmdfZG9jLmNyZWF0ZWRfYnkgPSBvd25lcl9pZDtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLm1vZGlmaWVkID0gbm93O1xuICAgICAgICAgICAgICAgIG9yZ19kb2MubW9kaWZpZWRfYnkgPSBvd25lcl9pZDtcbiAgICAgICAgICAgICAgICBvcmdfaWQgPSBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC5pbnNlcnQob3JnX2RvYyk7XG4gICAgICAgICAgICAgICAgaWYgKG9yZ19pZCkge1xuICAgICAgICAgICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKG9yZ19pZCk7XG4gICAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkcy5wYXJlbnRzID0gb3JnLmNhbGN1bGF0ZVBhcmVudHMoKTtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkcy5mdWxsbmFtZSA9IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkodXBkYXRlRmllbGRzKSkge1xuICAgICAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHVwZGF0ZUZpZWxkc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChvcmcucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZShvcmcucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHBhcmVudC5faWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogcGFyZW50LmNhbGN1bGF0ZUNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcGFyZW50X29yZ19pZCA9IG9yZ19pZDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBiZWxvbmdPcmdpZHMucHVzaChvcmcuX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJfaWQgPSBudWxsO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1ZG9jID0ge307XG4gICAgICAgICAgdWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgdWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZDtcbiAgICAgICAgICB1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlO1xuICAgICAgICAgIHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdO1xuICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgIHVkb2MuZW1haWxzID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogaXRlbS5lbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgdWRvYy5waG9uZSA9IHtcbiAgICAgICAgICAgICAgbnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZSxcbiAgICAgICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBub3dcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VfZG9jID0ge307XG4gICAgICAgICAgICBzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgc3VfZG9jLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXTtcbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzO1xuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGVycm9yLmxpbmUgPSBpICsgMTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGUucmVhc29uO1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0LnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlcnJvckxpc3Q7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UgXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpLT5cblx0XHR0cnlcblx0XHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcblxuXHRcdFx0cXVlcnkgPSByZXEucXVlcnlcblx0XHRcdHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWRcblx0XHRcdG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZFxuXHRcdFx0dXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6b3JnX2lkfSx7ZmllbGRzOntmdWxsbmFtZToxfX0pXG5cdFx0XHR1c2Vyc190b194bHMgPSBuZXcgQXJyYXlcblx0XHRcdG5vdyA9IG5ldyBEYXRlIFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsdXNlcl9pZClcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRzb3J0OiB7bmFtZTogMX1cblx0XHRcdFx0fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcmdfaWRzID0gW11cblx0XHRcdFx0b3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDpvcmdfaWQsc3BhY2U6c3BhY2VfaWR9LHtmaWVsZHM6e19pZDoxLGNoaWxkcmVuOjF9fSkuZmV0Y2goKVxuXHRcdFx0XHRvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywnX2lkJylcblx0XHRcdFx0Xy5lYWNoIG9yZ19vYmpzLChvcmdfb2JqKS0+XG5cdFx0XHRcdFx0b3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcyxvcmdfb2JqPy5jaGlsZHJlbilcblx0XHRcdFx0Xy51bmlxKG9yZ19pZHMpXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkLG9yZ2FuaXphdGlvbnM6eyRpbjpvcmdfaWRzfX0se3NvcnQ6IHtzb3J0X25vOiAtMSxuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWpzID0gcmVxdWlyZSgnZWpzJylcblx0XHRcdHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKVxuXHRcdFx0XG5cdFx0XHQjIOajgOa1i+aYr+WQpuacieivreazlemUmeivr1xuXHRcdFx0ZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jylcblx0XHRcdGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KVxuXHRcdFx0aWYgZXJyb3Jfb2JqXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yX29ialxuXG5cdFx0XHR0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cilcblxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cblx0XHRcdG9yZ05hbWUgPSBpZiBvcmcgdGhlbiBvcmcuZnVsbG5hbWUgZWxzZSBvcmdfaWRcblx0XHRcdGZpZWxkcyA9IFt7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonbmFtZScsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtb2JpbGUnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTond29ya19waG9uZScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonZW1haWwnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidjb21wYW55Jyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidwb3NpdGlvbicsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J29yZ2FuaXphdGlvbnMnLFxuXHRcdFx0XHRcdHdpZHRoOiA2MDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLHt9LGxhbmcpLFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB2YWx1ZX19LHtmaWVsZHM6IHtmdWxsbmFtZTogMX19KS5tYXAoKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uZnVsbG5hbWVcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtYW5hZ2VyJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7bmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/Lm5hbWVcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcicsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHt1c2VybmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/LnVzZXJuYW1lXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdOdW1iZXInLFxuXHRcdFx0XHRcdG5hbWU6J3NvcnRfbm8nLFxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcl9hY2NlcHRlZCcsXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgdGhlbiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycse30sbGFuZykgZWxzZSBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJyx7fSxsYW5nKVxuXHRcdFx0XHR9XVxuXHRcdFx0XG5cdFx0XHRzaGVldF9uYW1lID0gb3JnTmFtZT8ucmVwbGFjZSgvXFwvL2csXCItXCIpICPkuI3mlK/mjIFcIi9cIuespuWPt1xuXHRcdFx0cmV0ID0gdGVtcGxhdGUoe1xuXHRcdFx0XHRsYW5nOiBsYW5nLFxuXHRcdFx0XHRzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcblx0XHRcdFx0dXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcblx0XHRcdH0pXG5cblx0XHRcdGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIitlbmNvZGVVUkkoZmlsZU5hbWUpKVxuXHRcdFx0cmVzLmVuZChyZXQpXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRyZXMuZW5kKGUubWVzc2FnZSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY3VycmVudF91c2VyX2luZm8sIGUsIGVqcywgZWpzTGludCwgZXJyb3Jfb2JqLCBmaWVsZHMsIGZpbGVOYW1lLCBsYW5nLCBub3csIG9yZywgb3JnTmFtZSwgb3JnX2lkLCBvcmdfaWRzLCBvcmdfb2JqcywgcXVlcnksIHJldCwgc2hlZXRfbmFtZSwgc3BhY2VfaWQsIHN0ciwgdGVtcGxhdGUsIHVzZXJfaWQsIHVzZXJzX3RvX3hscztcbiAgICB0cnkge1xuICAgICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgICAgc3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZDtcbiAgICAgIG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZDtcbiAgICAgIHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9yZ19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheTtcbiAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VyX2lkKSkge1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmdfaWRzID0gW107XG4gICAgICAgIG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBfaWQ6IG9yZ19pZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgY2hpbGRyZW46IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCAnX2lkJyk7XG4gICAgICAgIF8uZWFjaChvcmdfb2JqcywgZnVuY3Rpb24ob3JnX29iaikge1xuICAgICAgICAgIHJldHVybiBvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLCBvcmdfb2JqICE9IG51bGwgPyBvcmdfb2JqLmNoaWxkcmVuIDogdm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8udW5pcShvcmdfaWRzKTtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRpbjogb3JnX2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IC0xLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuICAgICAgc3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpO1xuICAgICAgZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jyk7XG4gICAgICBlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSk7XG4gICAgICBpZiAoZXJyb3Jfb2JqKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3Jfb2JqKTtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKTtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIG9yZ05hbWUgPSBvcmcgPyBvcmcuZnVsbG5hbWUgOiBvcmdfaWQ7XG4gICAgICBmaWVsZHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbW9iaWxlJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd3b3JrX3Bob25lJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnY29tcGFueScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9yZ05hbWVzO1xuICAgICAgICAgICAgb3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLmZ1bGxuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21hbmFnZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICAgIG5hbWU6ICdzb3J0X25vJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyX2FjY2VwdGVkJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHNoZWV0X25hbWUgPSBvcmdOYW1lICE9IG51bGwgPyBvcmdOYW1lLnJlcGxhY2UoL1xcLy9nLCBcIi1cIikgOiB2b2lkIDA7XG4gICAgICByZXQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICB1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuICAgICAgfSk7XG4gICAgICBmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIHJlcy5lbmQocmV0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiByZXMuZW5kKGUubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
