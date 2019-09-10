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
      is_company: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczp1c2Vycy1pbXBvcnQvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfdXNlcnMtaW1wb3J0L3NwYWNlX3VzZXJzX2FjdGlvbnMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zcGFjZV91c2Vyc19hY3Rpb25zLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvaW1wb3J0X3VzZXJzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc191c2Vycy1pbXBvcnQvcm91dGVzL2FwaV9zcGFjZV91c2Vyc19leHBvcnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX3NwYWNlX3VzZXJzX2V4cG9ydC5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiYWN0aW9ucyIsImxhYmVsIiwib24iLCJ2aXNpYmxlIiwib2JqZWN0X25hbWUiLCJyZWNvcmRfaWQiLCJyZWNvcmRfcGVybWlzc2lvbnMiLCJDcmVhdG9yIiwiaXNTcGFjZUFkbWluIiwidG9kbyIsIlN0ZWVkb3MiLCJpc1BhaWRTcGFjZSIsInNwYWNlVXBncmFkZWRNb2RhbCIsIk1vZGFsIiwic2hvdyIsIm9yZ0lkIiwicmVmIiwic3BhY2VJZCIsInVvYmoiLCJ1cmwiLCJTZXNzaW9uIiwiZ2V0IiwiTWV0ZW9yIiwidXNlcklkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsInNwYWNlX2lkIiwib3JnX2lkIiwiYWJzb2x1dGVVcmwiLCIkIiwicGFyYW0iLCJ3aW5kb3ciLCJvcGVuIiwic3dhbCIsInRpdGxlIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJUQVBpMThuIiwiX18iLCJzdGFydHVwIiwiT2JqZWN0cyIsInNwYWNlX3VzZXJzIiwiXyIsImV4dGVuZCIsIm1ldGhvZHMiLCJpbXBvcnRfdXNlcnMiLCJ1c2VyX3BrIiwiZGF0YSIsIm9ubHlDaGVjayIsIl9zZWxmIiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImN1cnJlbnRVc2VyIiwiY3VycmVudFVzZXJMb2NhbGUiLCJjdXJyZW50VXNlclBob25lUHJlZml4IiwiZXJyb3JMaXN0Iiwib3duZXJfaWQiLCJyb290X29yZyIsInNwYWNlIiwidGVzdERhdGEiLCJFcnJvciIsImRiIiwib3JnYW5pemF0aW9ucyIsImZpbmRPbmUiLCJpc19jb21wYW55IiwicGFyZW50Iiwic3BhY2VzIiwiYWRtaW5zIiwiaW5jbHVkZXMiLCJpc19wYWlkIiwiZmluZCIsIl9pZCIsInVzZXJfYWNjZXB0ZWQiLCJjb3VudCIsImxlbmd0aCIsInVzZXJfbGltaXQiLCJvd25lciIsInVzZXJzIiwiZmllbGRzIiwibG9jYWxlIiwicGhvbmUiLCJnZXRQaG9uZVByZWZpeCIsImZvckVhY2giLCJpdGVtIiwiaSIsIm9wZXJhdGluZyIsIm9yZ2FuaXphdGlvbiIsIm9yZ2FuaXphdGlvbl9kZXB0cyIsInBob25lTnVtYmVyIiwicmVmMSIsInJlZjIiLCJyZWYzIiwic2VsZWN0b3IiLCJzcGFjZVVzZXJFeGlzdCIsInRlc3RPYmoiLCJ1c2VyIiwidXNlckV4aXN0IiwiZW1haWwiLCJ1c2VybmFtZSIsImZpbHRlclByb3BlcnR5IiwidGVzdCIsInB1c2giLCIkb3IiLCJmZXRjaCIsInBhc3N3b3JkIiwic2VydmljZXMiLCJiY3J5cHQiLCJzcGxpdCIsIm5hbWUiLCJkZXB0X25hbWUiLCJqIiwiYmVsb25nT3JnaWRzIiwiZSIsImVycm9yIiwibXVsdGlPcmdzIiwibm93Iiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJfdXBkYXRlX2RvYyIsInN1X2RvYyIsInVkb2MiLCJ1c2VyX2lkIiwiRGF0ZSIsIm9yZ0Z1bGxuYW1lIiwiZnVsbG5hbWUiLCJwYXJlbnRfb3JnX2lkIiwidHJpbSIsIm9yZyIsIm9yZ19kb2MiLCJ1cGRhdGVGaWVsZHMiLCJfbWFrZU5ld0lEIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZGlyZWN0IiwiaW5zZXJ0IiwicGFyZW50cyIsImNhbGN1bGF0ZVBhcmVudHMiLCJjYWxjdWxhdGVGdWxsbmFtZSIsImlzRW1wdHkiLCJ1cGRhdGUiLCIkc2V0IiwiY2hpbGRyZW4iLCJjYWxjdWxhdGVDaGlsZHJlbiIsInN0ZWVkb3NfaWQiLCJzcGFjZXNfaW52aXRlZCIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsIm51bWJlciIsIm1vYmlsZSIsInNldFBhc3N3b3JkIiwibG9nb3V0IiwidW5pcSIsImNvbmNhdCIsImNvbXBhbnkiLCJwb3NpdGlvbiIsIndvcmtfcGhvbmUiLCJzb3J0X25vIiwia2V5cyIsImludml0ZV9zdGF0ZSIsImVycm9yMSIsImxpbmUiLCJtZXNzYWdlIiwicmVhc29uIiwiV2ViQXBwIiwiY29ubmVjdEhhbmRsZXJzIiwidXNlIiwicmVxIiwicmVzIiwibmV4dCIsImN1cnJlbnRfdXNlcl9pbmZvIiwiZWpzIiwiZWpzTGludCIsImVycm9yX29iaiIsImZpbGVOYW1lIiwibGFuZyIsIm9yZ05hbWUiLCJvcmdfaWRzIiwib3JnX29ianMiLCJxdWVyeSIsInJldCIsInNoZWV0X25hbWUiLCJzdHIiLCJ0ZW1wbGF0ZSIsInVzZXJzX3RvX3hscyIsInV1Zmxvd01hbmFnZXIiLCJjaGVja19hdXRob3JpemF0aW9uIiwiQXJyYXkiLCJzb3J0IiwicGx1Y2siLCJlYWNoIiwib3JnX29iaiIsInVuaW9uIiwiJGluIiwicmVxdWlyZSIsIkFzc2V0cyIsImdldFRleHQiLCJsaW50IiwiY29uc29sZSIsImNvbXBpbGUiLCJ3aWR0aCIsInRyYW5zZm9ybSIsInZhbHVlIiwib3JnTmFtZXMiLCJtYXAiLCJpbmRleCIsImpvaW4iLCJyZXBsYWNlIiwibW9tZW50IiwiZm9ybWF0Iiwic2V0SGVhZGVyIiwiZW5jb2RlVVJJIiwiZW5kIiwic3RhY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDaEIsU0FBTyxRQURTO0FBRWhCLGNBQVk7QUFGSSxDQUFELEVBR2Isc0JBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7O0FDREEsSUFBQUksT0FBQTtBQUFBQSxVQUNDO0FBQUEsWUFDQztBQUFBQyxXQUFPLElBQVA7QUFDQUMsUUFBSSxNQURKO0FBRUFDLGFBQVMsVUFBQ0MsV0FBRCxFQUFjQyxTQUFkLEVBQXlCQyxrQkFBekI7QUFDUixhQUFPQyxRQUFRQyxZQUFSLEVBQVA7QUFIRDtBQUlBQyxVQUFNO0FBQ0wsVUFBRyxDQUFDQyxRQUFRQyxXQUFSLEVBQUo7QUFDQ0QsZ0JBQVFFLGtCQUFSO0FBQ0E7QUNJRzs7QUFDRCxhREhIQyxNQUFNQyxJQUFOLENBQVcsb0JBQVgsQ0NHRztBRFpKO0FBQUEsR0FERDtBQVlBLFlBQ0M7QUFBQWIsV0FBTyxJQUFQO0FBQ0FDLFFBQUksTUFESjtBQUVBQyxhQUFTLFVBQUNDLFdBQUQsRUFBY0MsU0FBZCxFQUF5QkMsa0JBQXpCO0FBQ1IsYUFBT0MsUUFBUUMsWUFBUixFQUFQO0FBSEQ7QUFJQUMsVUFBTTtBQUNMLFVBQUFNLEtBQUEsRUFBQUMsR0FBQSxFQUFBQyxPQUFBLEVBQUFDLElBQUEsRUFBQUMsR0FBQTtBQUFBRixnQkFBVUcsUUFBUUMsR0FBUixDQUFZLFNBQVosQ0FBVjtBQUNBTixjQUFBLENBQUFD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cyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcImVqc1wiOiBcIl4yLjUuNVwiLFxuXHRcImVqcy1saW50XCI6IFwiXjAuMi4wXCJcbn0sICdzdGVlZG9zOnVzZXJzLWltcG9ydCcpO1xuIiwiYWN0aW9ucyA9IFxuXHRpbXBvcnQ6XG5cdFx0bGFiZWw6IFwi5a+85YWlXCJcblx0XHRvbjogXCJsaXN0XCJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKVxuXHRcdHRvZG86ICgpLT5cblx0XHRcdGlmICFTdGVlZG9zLmlzUGFpZFNwYWNlKClcblx0XHRcdFx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwoKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdE1vZGFsLnNob3coXCJpbXBvcnRfdXNlcnNfbW9kYWxcIik7XG5cdFxuXHRleHBvcnQ6XG5cdFx0bGFiZWw6IFwi5a+85Ye6XCJcblx0XHRvbjogXCJsaXN0XCJcblx0XHR2aXNpYmxlOiAob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKS0+XG5cdFx0XHRyZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKVxuXHRcdHRvZG86ICgpLT5cblx0XHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcblx0XHRcdG9yZ0lkID0gU2Vzc2lvbi5nZXQoXCJncmlkX3NpZGViYXJfc2VsZWN0ZWRcIik/WzBdXG5cdFx0XHRpZiBzcGFjZUlkIGFuZCBvcmdJZFxuXHRcdFx0XHR1b2JqID0ge31cblx0XHRcdFx0dW9ialtcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKVxuXHRcdFx0XHR1b2JqW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKVxuXHRcdFx0XHR1b2JqLnNwYWNlX2lkID0gc3BhY2VJZFxuXHRcdFx0XHR1b2JqLm9yZ19pZCA9IG9yZ0lkXG5cdFx0XHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSArIFwiYXBpL2V4cG9ydC9zcGFjZV91c2Vycz9cIiArICQucGFyYW0odW9iailcblx0XHRcdFx0d2luZG93Lm9wZW4odXJsLCAnX3BhcmVudCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHN3YWxcblx0XHRcdFx0XHR0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIlxuXHRcdFx0XHRcdHRleHQ6IFwi6K+35Zyo5bem5L6n57uE57uH5py65p6E5qCR5Lit6YCJ5Lit5LiA5Liq57uE57uH5ZCO5YaN5omn6KGM5a+85Ye65pON5L2cXCJcblx0XHRcdFx0XHRodG1sOiB0cnVlXG5cdFx0XHRcdFx0dHlwZTogJ3dhcm5pbmcnXG5cdFx0XHRcdFx0Y29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oJ09LJylcblxuXG5NZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdHVubGVzcyBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnM/LmFjdGlvbnNcblx0XHRDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9XG5cblx0Xy5leHRlbmQoQ3JlYXRvci5PYmplY3RzLnNwYWNlX3VzZXJzLmFjdGlvbnMsIGFjdGlvbnMpO1xuIiwidmFyIGFjdGlvbnM7XG5cbmFjdGlvbnMgPSB7XG4gIFwiaW1wb3J0XCI6IHtcbiAgICBsYWJlbDogXCLlr7zlhaVcIixcbiAgICBvbjogXCJsaXN0XCIsXG4gICAgdmlzaWJsZTogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCwgcmVjb3JkX3Blcm1pc3Npb25zKSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5pc1NwYWNlQWRtaW4oKTtcbiAgICB9LFxuICAgIHRvZG86IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFTdGVlZG9zLmlzUGFpZFNwYWNlKCkpIHtcbiAgICAgICAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIE1vZGFsLnNob3coXCJpbXBvcnRfdXNlcnNfbW9kYWxcIik7XG4gICAgfVxuICB9LFxuICBcImV4cG9ydFwiOiB7XG4gICAgbGFiZWw6IFwi5a+85Ye6XCIsXG4gICAgb246IFwibGlzdFwiLFxuICAgIHZpc2libGU6IGZ1bmN0aW9uKG9iamVjdF9uYW1lLCByZWNvcmRfaWQsIHJlY29yZF9wZXJtaXNzaW9ucykge1xuICAgICAgcmV0dXJuIENyZWF0b3IuaXNTcGFjZUFkbWluKCk7XG4gICAgfSxcbiAgICB0b2RvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcmdJZCwgcmVmLCBzcGFjZUlkLCB1b2JqLCB1cmw7XG4gICAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgICAgb3JnSWQgPSAocmVmID0gU2Vzc2lvbi5nZXQoXCJncmlkX3NpZGViYXJfc2VsZWN0ZWRcIikpICE9IG51bGwgPyByZWZbMF0gOiB2b2lkIDA7XG4gICAgICBpZiAoc3BhY2VJZCAmJiBvcmdJZCkge1xuICAgICAgICB1b2JqID0ge307XG4gICAgICAgIHVvYmpbXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgICAgIHVvYmpbXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgICAgICB1b2JqLnNwYWNlX2lkID0gc3BhY2VJZDtcbiAgICAgICAgdW9iai5vcmdfaWQgPSBvcmdJZDtcbiAgICAgICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCgpICsgXCJhcGkvZXhwb3J0L3NwYWNlX3VzZXJzP1wiICsgJC5wYXJhbSh1b2JqKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19wYXJlbnQnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzd2FsKHtcbiAgICAgICAgICB0aXRsZTogXCLlt6bkvqfmnKrpgInkuK3ku7vkvZXnu4Tnu4dcIixcbiAgICAgICAgICB0ZXh0OiBcIuivt+WcqOW3puS+p+e7hOe7h+acuuaehOagkeS4remAieS4reS4gOS4que7hOe7h+WQjuWGjeaJp+ihjOWvvOWHuuaTjeS9nFwiLFxuICAgICAgICAgIGh0bWw6IHRydWUsXG4gICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxuICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKCdPSycpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWY7XG4gIGlmICghKChyZWYgPSBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMpICE9IG51bGwgPyByZWYuYWN0aW9ucyA6IHZvaWQgMCkpIHtcbiAgICBDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucyA9IHt9O1xuICB9XG4gIHJldHVybiBfLmV4dGVuZChDcmVhdG9yLk9iamVjdHMuc3BhY2VfdXNlcnMuYWN0aW9ucywgYWN0aW9ucyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdCMjI1xuXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcblx0XHQy44CB5qCh6aqM5bel5L2c5Yy655So5oi35piv5ZCm5a2Y5ZyoXG5cdFx0M+OAgeagoemqjOmDqOmXqOaYr+WQpuWtmOWcqFxuXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcblx0XHRUT0RPOiDlm73pmYXljJZcblx0IyMjXG5cdGltcG9ydF91c2VyczogKHNwYWNlX2lkLCB1c2VyX3BrLCBkYXRhLCBvbmx5Q2hlY2spLT5cblxuXHRcdF9zZWxmID0gdGhpc1xuXG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLor7flhYjnmbvlvZVcIilcblxuXHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGlzX2NvbXBhbnk6IHRydWUsIHBhcmVudDogbnVsbH0pXG5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2U/LmFkbWlucy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcblxuXHRcdGlmICFzcGFjZS5pc19wYWlkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLmoIflh4bniYjkuI3mlK/mjIHmraTlip/og71cIik7XG5cblx0XHRhY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRpZiAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSA+IHNwYWNlLnVzZXJfbGltaXRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIumcgOimgeaPkOWNh+W3sui0reS5sOeUqOaIt+aVsOiHsyN7YWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RofSjlvZPliY0je3NwYWNlLnVzZXJfbGltaXR9KVwiICtcIiwg6K+35Zyo5LyB5Lia5L+h5oGv5qih5Z2X5Lit54K55Ye75Y2H57qn5oyJ6ZKu6LSt5LmwXCIpXG5cblx0XHRvd25lcl9pZCA9IHNwYWNlLm93bmVyXG5cblx0XHR0ZXN0RGF0YSA9IFtdXG5cblx0XHRlcnJvckxpc3QgPSBbXVxuXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IF9zZWxmLnVzZXJJZH0se2ZpZWxkczp7bG9jYWxlOjEscGhvbmU6MX19KVxuXHRcdGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlXG5cdFx0Y3VycmVudFVzZXJQaG9uZVByZWZpeCA9IEFjY291bnRzLmdldFBob25lUHJlZml4IGN1cnJlbnRVc2VyXG5cblx0XHQjIOaVsOaNrue7n+S4gOagoemqjFxuXG5cdFx0ZGF0YS5mb3JFYWNoIChpdGVtLCBpKS0+XG5cdFx0XHQjIGNvbnNvbGUubG9nIGl0ZW1cblx0XHRcdCMg55So5oi35ZCN77yM5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XG5cdFx0XHRpZiAhaXRlbS5waG9uZSBhbmQgIWl0ZW0uZW1haWxcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYw6IOaJi+acuuWPt++8jOmCrueuseS4jeiDvemDveS4uuepulwiKVxuXG5cdFx0XHQjIOWIpOaWrWV4Y2Vs5Lit55qE5pWw5o2u77yM55So5oi35ZCN44CB5omL5py65Y+3562J5L+h5oGv5piv5ZCm5pyJ6K+vXG5cdFx0XHR0ZXN0T2JqID0ge31cblx0XHRcdGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0dGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJ1c2VybmFtZVwiLCBpdGVtLnVzZXJuYW1lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflkI3ph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0dGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmVcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJwaG9uZVwiLCBpdGVtLnBob25lKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrmiYvmnLrlj7fph43lpI1cIik7XG5cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoaXRlbS5lbWFpbClcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mumCruS7tuagvOW8j+mUmeivryN7aXRlbS5lbWFpbH1cIik7XG5cblx0XHRcdFx0dGVzdE9iai5lbWFpbCA9IGl0ZW0uZW1haWxcblx0XHRcdFx0aWYgdGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrpgq7ku7bph43lpI1cIik7XG5cblx0XHRcdGl0ZW0uc3BhY2UgPSBzcGFjZV9pZFxuXG5cdFx0XHR0ZXN0RGF0YS5wdXNoKHRlc3RPYmopXG5cblx0XHRcdCMg6I635Y+W5p+l5om+dXNlcueahOadoeS7tlxuXHRcdFx0c2VsZWN0b3IgPSBbXVxuXHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRzZWxlY3Rvci5wdXNoIHt1c2VybmFtZTogaXRlbS51c2VybmFtZX1cblx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxuXHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lXG5cdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxuXG5cdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblxuXG5cdFx0XHQjIOWFiOWIpOaWreaYr+WQpuiDveWMuemFjeWIsOWUr+S4gOeahHVzZXLvvIznhLblkI7liKTmlq3or6XnlKjmiLfmmK9pbnNlcnTliLBzcGFjZV91c2Vyc+i/mOaYr3VwZGF0ZVxuXHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDFcblx0XHRcdFx0dXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdLl9pZFxuXHRcdFx0XHRzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcn0pXG5cdFx0XHRcdGlmIHNwYWNlVXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdG9wZXJhdGluZyA9IFwidXBkYXRlXCJcblx0XHRcdFx0ZWxzZSBpZiBzcGFjZVVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cdFx0XHRlbHNlIGlmIHVzZXJFeGlzdC5jb3VudCgpID09IDBcblx0XHRcdFx0IyDmlrDlop5zcGFjZV91c2Vyc+eahOaVsOaNruagoemqjFxuXHRcdFx0XHRvcGVyYXRpbmcgPSBcImluc2VydFwiXG5cblx0XHRcdCMg5Yik5pat5piv5ZCm6IO95L+u5pS555So5oi355qE5a+G56CBXG5cdFx0XHRpZiBpdGVtLnBhc3N3b3JkIGFuZCB1c2VyRXhpc3QuY291bnQoKSA9PSAxXG5cdFx0XHRcdGlmIHVzZXJFeGlzdC5mZXRjaCgpWzBdLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0XG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysI3tpICsgMX3ooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG5cblx0XHRcdCMg5Yik5pat6YOo6Zeo5piv5ZCm5ZCI55CGXG5cdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXG5cdFx0XHRpZiAhb3JnYW5pemF0aW9uXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya6YOo6Zeo5LiN6IO95Li656m6XCIpO1xuXG5cdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuXG5cdFx0XHRpZiBvcmdhbml6YXRpb25fZGVwdHMubGVuZ3RoIDwgMSB8fCBvcmdhbml6YXRpb25fZGVwdHNbMF0gIT0gcm9vdF9vcmcubmFtZVxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcblxuXHRcdFx0aWYgaXRlbS5wYXNzd29yZCAmJiB1c2VyPy5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKwje2kgKyAxfeihjO+8mueUqOaIt+W3suiuvue9ruWvhuegge+8jOS4jeWFgeiuuOS/ruaUuVwiKTtcblxuXHRcdFx0b3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2ggKGRlcHRfbmFtZSwgaikgLT5cblx0XHRcdFx0aWYgIWRlcHRfbmFtZVxuXHRcdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrCN7aSArIDF96KGM77ya5peg5pWI55qE6YOo6ZeoXCIpO1xuXG5cblx0XHRpZiBvbmx5Q2hlY2tcblx0XHRcdHJldHVybiA7XG5cblx0XHQjIOaVsOaNruWvvOWFpVxuXHRcdGRhdGEuZm9yRWFjaCAoaXRlbSwgaSktPlxuXHRcdFx0ZXJyb3IgPSB7fVxuXHRcdFx0dHJ5XG5cdFx0XHRcdHNlbGVjdG9yID0gW11cblx0XHRcdFx0b3BlcmF0aW5nID0gXCJcIlxuXHRcdFx0XHQjIGlmIGl0ZW0udXNlcm5hbWVcblx0XHRcdFx0IyBcdHNlbGVjdG9yLnB1c2gge3VzZXJuYW1lOiBpdGVtLnVzZXJuYW1lfVxuXHRcdFx0XHRpZiBpdGVtLmVtYWlsXG5cdFx0XHRcdFx0c2VsZWN0b3IucHVzaCB7XCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsfVxuXHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0cGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZVxuXHRcdFx0XHRcdHNlbGVjdG9yLnB1c2gge1wicGhvbmUubnVtYmVyXCI6IHBob25lTnVtYmVyfVxuXHRcdFx0XHR1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHskb3I6IHNlbGVjdG9yfSlcblx0XHRcdFx0aWYgdXNlckV4aXN0LmNvdW50KCkgPiAxXG5cdFx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpXG5cdFx0XHRcdGVsc2UgaWYgdXNlckV4aXN0LmNvdW50KCkgPT0gMVxuXHRcdFx0XHRcdHVzZXIgPSB1c2VyRXhpc3QuZmV0Y2goKVswXVxuXG5cdFx0XHRcdG5vdyA9IG5ldyBEYXRlKClcblxuXHRcdFx0XHRvcmdhbml6YXRpb24gPSBpdGVtLm9yZ2FuaXphdGlvblxuXHRcdFx0XHRtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpXG5cdFx0XHRcdGJlbG9uZ09yZ2lkcyA9IFtdXG5cdFx0XHRcdG11bHRpT3Jncy5mb3JFYWNoIChvcmdGdWxsbmFtZSkgLT5cblx0XHRcdFx0XHRvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpXG5cdFx0XHRcdFx0ZnVsbG5hbWUgPSBcIlwiXG5cdFx0XHRcdFx0cGFyZW50X29yZ19pZCA9IHJvb3Rfb3JnLl9pZFxuXHRcdFx0XHRcdG9yZ2FuaXphdGlvbl9kZXB0cy5mb3JFYWNoIChkZXB0X25hbWUsIGopIC0+XG5cdFx0XHRcdFx0XHRpZiBqID4gMFxuXHRcdFx0XHRcdFx0XHRpZiBqID09IDFcblx0XHRcdFx0XHRcdFx0XHRmdWxsbmFtZSA9IGRlcHRfbmFtZVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZnVsbG5hbWUgPSBmdWxsbmFtZSArIFwiL1wiICsgZGVwdF9uYW1lXG5cblx0XHRcdFx0XHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGZ1bGxuYW1lOiBmdWxsbmFtZX0pXG5cblx0XHRcdFx0XHRcdFx0aWYgb3JnXG5cdFx0XHRcdFx0XHRcdFx0cGFyZW50X29yZ19pZCA9IG9yZy5faWRcblx0XHRcdFx0XHRcdFx0XHRiZWxvbmdPcmdpZHMucHVzaCBvcmcuX2lkXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRvcmdfZG9jID0ge31cblx0XHRcdFx0XHRcdFx0XHRvcmdfZG9jLl9pZCA9IGRiLm9yZ2FuaXphdGlvbnMuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5uYW1lID0gZGVwdF9uYW1lXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5wYXJlbnQgPSBwYXJlbnRfb3JnX2lkXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5jcmVhdGVkID0gbm93XG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5jcmVhdGVkX2J5ID0gb3duZXJfaWRcblx0XHRcdFx0XHRcdFx0XHRvcmdfZG9jLm1vZGlmaWVkID0gbm93XG5cdFx0XHRcdFx0XHRcdFx0b3JnX2RvYy5tb2RpZmllZF9ieSA9IG93bmVyX2lkXG5cdFx0XHRcdFx0XHRcdFx0b3JnX2lkID0gZGIub3JnYW5pemF0aW9ucy5kaXJlY3QuaW5zZXJ0KG9yZ19kb2MpXG5cblx0XHRcdFx0XHRcdFx0XHRpZiBvcmdfaWRcblx0XHRcdFx0XHRcdFx0XHRcdG9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZShvcmdfaWQpXG5cdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGVGaWVsZHMgPSB7fVxuXHRcdFx0XHRcdFx0XHRcdFx0dXBkYXRlRmllbGRzLnBhcmVudHMgPSBvcmcuY2FsY3VsYXRlUGFyZW50cygpXG5cdFx0XHRcdFx0XHRcdFx0XHR1cGRhdGVGaWVsZHMuZnVsbG5hbWUgPSBvcmcuY2FsY3VsYXRlRnVsbG5hbWUoKVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAhXy5pc0VtcHR5KHVwZGF0ZUZpZWxkcylcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB1cGRhdGVGaWVsZHN9KVxuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiBvcmcucGFyZW50XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhcmVudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZShvcmcucGFyZW50KVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUocGFyZW50Ll9pZCwgeyRzZXQ6IHtjaGlsZHJlbjogcGFyZW50LmNhbGN1bGF0ZUNoaWxkcmVuKCl9fSlcblxuXHRcdFx0XHRcdFx0XHRcdFx0cGFyZW50X29yZ19pZCA9IG9yZ19pZFxuXHRcdFx0XHRcdFx0XHRcdFx0YmVsb25nT3JnaWRzLnB1c2ggb3JnLl9pZFxuXG5cblx0XHRcdFx0dXNlcl9pZCA9IG51bGxcblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dWRvYyA9IHt9XG5cdFx0XHRcdFx0dWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKClcblx0XHRcdFx0XHR1ZG9jLnN0ZWVkb3NfaWQgPSBpdGVtLmVtYWlsIHx8IHVkb2MuX2lkXG5cdFx0XHRcdFx0dWRvYy5sb2NhbGUgPSBjdXJyZW50VXNlckxvY2FsZVxuXHRcdFx0XHRcdHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdXG5cdFx0XHRcdFx0aWYgaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHR1ZG9jLm5hbWUgPSBpdGVtLm5hbWVcblxuXHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdHVkb2MuZW1haWxzID0gW3thZGRyZXNzOiBpdGVtLmVtYWlsLCB2ZXJpZmllZDogZmFsc2V9XVxuXG5cdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRcdFx0dWRvYy51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWVcblxuXHRcdFx0XHRcdGlmIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdHVkb2MucGhvbmUgPSB7XG5cdFx0XHRcdFx0XHRcdG51bWJlcjogY3VycmVudFVzZXJQaG9uZVByZWZpeCArIGl0ZW0ucGhvbmVcblx0XHRcdFx0XHRcdFx0bW9iaWxlOiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdHZlcmlmaWVkOiBmYWxzZVxuXHRcdFx0XHRcdFx0XHRtb2RpZmllZDogbm93XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dXNlcl9pZCA9IGRiLnVzZXJzLmluc2VydCh1ZG9jKVxuXG5cdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxuXHRcdFx0XHRcdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge2xvZ291dDogZmFsc2V9KVxuXG5cdFx0XHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHVzZXI6IHVzZXJfaWR9KVxuXG5cdFx0XHRcdGlmIHNwYWNlX3VzZXJcblx0XHRcdFx0XHRpZiBiZWxvbmdPcmdpZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0aWYgIXNwYWNlX3VzZXIub3JnYW5pemF0aW9uc1xuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgPSBbXVxuXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MgPSB7fVxuXG5cdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5jb21wYW55XG5cdFx0XHRcdFx0XHRcdHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55XG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ucG9zaXRpb25cblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvblxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLndvcmtfcGhvbmVcblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmVcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5waG9uZVxuXHRcdFx0XHRcdFx0XHRzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnNvcnRfbm9cblx0XHRcdFx0XHRcdFx0c3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm9cblxuXHRcdFx0XHRcdFx0aWYgXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy51cGRhdGUoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcjogdXNlcl9pZH0sIHskc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2N9KVxuXG5cdFx0XHRcdFx0XHRpZiBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIiBvciBzcGFjZV91c2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIlxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIilcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS51c2VybmFtZVxuXHRcdFx0XHRcdFx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSx7JHNldDp7dXNlcm5hbWU6IGl0ZW0udXNlcm5hbWV9fSlcblx0XHRcdFx0XHRcdFx0aWYgaXRlbS5wYXNzd29yZFxuXHRcdFx0XHRcdFx0XHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtsb2dvdXQ6IGZhbHNlfSlcblxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0aWYgYmVsb25nT3JnaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdHN1X2RvYyA9IHt9XG5cdFx0XHRcdFx0XHRzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpXG5cdFx0XHRcdFx0XHRzdV9kb2Muc3BhY2UgPSBzcGFjZV9pZFxuXG5cdFx0XHRcdFx0XHRzdV9kb2MudXNlcl9hY2NlcHRlZCA9ICB0cnVlXG5cdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiXG5cblx0XHRcdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRcdFx0c3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJwZW5kaW5nXCJcblxuXHRcdFx0XHRcdFx0c3VfZG9jLm5hbWUgPSBpdGVtLm5hbWVcblx0XHRcdFx0XHRcdGlmIGl0ZW0uZW1haWxcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmVtYWlsID0gaXRlbS5lbWFpbFxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXVxuXHRcdFx0XHRcdFx0c3VfZG9jLm9yZ2FuaXphdGlvbnMgPSBiZWxvbmdPcmdpZHNcblxuXHRcdFx0XHRcdFx0aWYgaXRlbS5wb3NpdGlvblxuXHRcdFx0XHRcdFx0XHRzdV9kb2MucG9zaXRpb24gPSBpdGVtLnBvc2l0aW9uXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0ud29ya19waG9uZVxuXHRcdFx0XHRcdFx0XHRzdV9kb2Mud29ya19waG9uZSA9IGl0ZW0ud29ya19waG9uZVxuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLnBob25lXG5cdFx0XHRcdFx0XHRcdHN1X2RvYy5tb2JpbGUgPSBpdGVtLnBob25lXG5cblx0XHRcdFx0XHRcdGlmIGl0ZW0uc29ydF9ub1xuXHRcdFx0XHRcdFx0XHRzdV9kb2Muc29ydF9ubyA9IGl0ZW0uc29ydF9ub1xuXG5cdFx0XHRcdFx0XHRpZiBpdGVtLmNvbXBhbnlcblx0XHRcdFx0XHRcdFx0c3VfZG9jLmNvbXBhbnkgPSBpdGVtLmNvbXBhbnlcblxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHN1X2RvYylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0ZXJyb3IubGluZSA9IGkrMVxuXHRcdFx0XHRlcnJvci5tZXNzYWdlID0gZS5yZWFzb25cblx0XHRcdFx0ZXJyb3JMaXN0LnB1c2goZXJyb3IpXG5cblx0XHRyZXR1cm4gZXJyb3JMaXN0XG4iLCJNZXRlb3IubWV0aG9kcyh7XG5cbiAgLypcbiAgXHRcdDHjgIHmoKHpqoznlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDLjgIHmoKHpqozlt6XkvZzljLrnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdDPjgIHmoKHpqozpg6jpl6jmmK/lkKblrZjlnKhcbiAgXHRcdDTjgIHmoKHpqozpg6jpl6jnlKjmiLfmmK/lkKblrZjlnKhcbiAgXHRcdFRPRE86IOWbvemZheWMllxuICAgKi9cbiAgaW1wb3J0X3VzZXJzOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcl9waywgZGF0YSwgb25seUNoZWNrKSB7XG4gICAgdmFyIF9zZWxmLCBhY2NlcHRlZF91c2VyX2NvdW50LCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJMb2NhbGUsIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXgsIGVycm9yTGlzdCwgb3duZXJfaWQsIHJvb3Rfb3JnLCBzcGFjZSwgdGVzdERhdGE7XG4gICAgX3NlbGYgPSB0aGlzO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgaXNfY29tcGFueTogdHJ1ZSxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UgfHwgIShzcGFjZSAhPSBudWxsID8gc3BhY2UuYWRtaW5zLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAxLCBcIuWPquacieW3peS9nOWMuueuoeeQhuWRmOWPr+S7peWvvOWFpeeUqOaIt1wiKTtcbiAgICB9XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMSwgXCLmoIflh4bniYjkuI3mlK/mjIHmraTlip/og71cIik7XG4gICAgfVxuICAgIGFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZS5faWQsXG4gICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgfSkuY291bnQoKTtcbiAgICBpZiAoKGFjY2VwdGVkX3VzZXJfY291bnQgKyBkYXRhLmxlbmd0aCkgPiBzcGFjZS51c2VyX2xpbWl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgKFwi6ZyA6KaB5o+Q5Y2H5bey6LSt5Lmw55So5oi35pWw6IezXCIgKyAoYWNjZXB0ZWRfdXNlcl9jb3VudCArIGRhdGEubGVuZ3RoKSArIFwiKOW9k+WJjVwiICsgc3BhY2UudXNlcl9saW1pdCArIFwiKVwiKSArIFwiLCDor7flnKjkvIHkuJrkv6Hmga/mqKHlnZfkuK3ngrnlh7vljYfnuqfmjInpkq7otK3kubBcIik7XG4gICAgfVxuICAgIG93bmVyX2lkID0gc3BhY2Uub3duZXI7XG4gICAgdGVzdERhdGEgPSBbXTtcbiAgICBlcnJvckxpc3QgPSBbXTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBfc2VsZi51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgbG9jYWxlOiAxLFxuICAgICAgICBwaG9uZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyTG9jYWxlID0gY3VycmVudFVzZXIubG9jYWxlO1xuICAgIGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggPSBBY2NvdW50cy5nZXRQaG9uZVByZWZpeChjdXJyZW50VXNlcik7XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBvcGVyYXRpbmcsIG9yZ2FuaXphdGlvbiwgb3JnYW5pemF0aW9uX2RlcHRzLCBwaG9uZU51bWJlciwgcmVmLCByZWYxLCByZWYyLCByZWYzLCBzZWxlY3Rvciwgc3BhY2VVc2VyRXhpc3QsIHRlc3RPYmosIHVzZXIsIHVzZXJFeGlzdDtcbiAgICAgIGlmICghaXRlbS5waG9uZSAmJiAhaXRlbS5lbWFpbCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjDog5omL5py65Y+377yM6YKu566x5LiN6IO96YO95Li656m6XCIpO1xuICAgICAgfVxuICAgICAgdGVzdE9iaiA9IHt9O1xuICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgdGVzdE9iai51c2VybmFtZSA9IGl0ZW0udXNlcm5hbWU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInVzZXJuYW1lXCIsIGl0ZW0udXNlcm5hbWUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8mueUqOaIt+WQjemHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgdGVzdE9iai5waG9uZSA9IGl0ZW0ucGhvbmU7XG4gICAgICAgIGlmICh0ZXN0RGF0YS5maWx0ZXJQcm9wZXJ0eShcInBob25lXCIsIGl0ZW0ucGhvbmUpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaJi+acuuWPt+mHjeWkjVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGl0ZW0uZW1haWwpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bmoLzlvI/plJnor69cIiArIGl0ZW0uZW1haWwpO1xuICAgICAgICB9XG4gICAgICAgIHRlc3RPYmouZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICBpZiAodGVzdERhdGEuZmlsdGVyUHJvcGVydHkoXCJlbWFpbFwiLCBpdGVtLmVtYWlsKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpgq7ku7bph43lpI1cIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGl0ZW0uc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIHRlc3REYXRhLnB1c2godGVzdE9iaik7XG4gICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgb3BlcmF0aW5nID0gXCJcIjtcbiAgICAgIGlmIChpdGVtLnVzZXJuYW1lKSB7XG4gICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgcGhvbmVOdW1iZXIgPSBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZTtcbiAgICAgICAgc2VsZWN0b3IucHVzaCh7XG4gICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgJG9yOiBzZWxlY3RvclxuICAgICAgfSk7XG4gICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNTAwLCBcIuesrFwiICsgKGkgKyAxKSArIFwi6KGM77ya55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgfSBlbHNlIGlmICh1c2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICB1c2VyID0gdXNlckV4aXN0LmZldGNoKClbMF0uX2lkO1xuICAgICAgICBzcGFjZVVzZXJFeGlzdCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICB1c2VyOiB1c2VyXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMSkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwidXBkYXRlXCI7XG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2VVc2VyRXhpc3QuY291bnQoKSA9PT0gMCkge1xuICAgICAgICAgIG9wZXJhdGluZyA9IFwiaW5zZXJ0XCI7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodXNlckV4aXN0LmNvdW50KCkgPT09IDApIHtcbiAgICAgICAgb3BlcmF0aW5nID0gXCJpbnNlcnRcIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmIHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgIGlmICgocmVmID0gdXNlckV4aXN0LmZldGNoKClbMF0uc2VydmljZXMpICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgaWYgKCFvcmdhbml6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrpg6jpl6jkuI3og73kuLrnqbpcIik7XG4gICAgICB9XG4gICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIvXCIpO1xuICAgICAgaWYgKG9yZ2FuaXphdGlvbl9kZXB0cy5sZW5ndGggPCAxIHx8IG9yZ2FuaXphdGlvbl9kZXB0c1swXSAhPT0gcm9vdF9vcmcubmFtZSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDUwMCwgXCLnrKxcIiArIChpICsgMSkgKyBcIuihjO+8muaXoOaViOeahOaguemDqOmXqFwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtLnBhc3N3b3JkICYmICh1c2VyICE9IG51bGwgPyAocmVmMiA9IHVzZXIuc2VydmljZXMpICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrnlKjmiLflt7Lorr7nva7lr4bnoIHvvIzkuI3lhYHorrjkv67mlLlcIik7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9uX2RlcHRzLmZvckVhY2goZnVuY3Rpb24oZGVwdF9uYW1lLCBqKSB7XG4gICAgICAgIGlmICghZGVwdF9uYW1lKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig1MDAsIFwi56ysXCIgKyAoaSArIDEpICsgXCLooYzvvJrml6DmlYjnmoTpg6jpl6hcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChvbmx5Q2hlY2spIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpIHtcbiAgICAgIHZhciBiZWxvbmdPcmdpZHMsIGUsIGVycm9yLCBtdWx0aU9yZ3MsIG5vdywgb3BlcmF0aW5nLCBvcmdhbml6YXRpb24sIHBob25lTnVtYmVyLCBzZWxlY3Rvciwgc3BhY2VfdXNlciwgc3BhY2VfdXNlcl91cGRhdGVfZG9jLCBzdV9kb2MsIHVkb2MsIHVzZXIsIHVzZXJFeGlzdCwgdXNlcl9pZDtcbiAgICAgIGVycm9yID0ge307XG4gICAgICB0cnkge1xuICAgICAgICBzZWxlY3RvciA9IFtdO1xuICAgICAgICBvcGVyYXRpbmcgPSBcIlwiO1xuICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBpdGVtLmVtYWlsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGl0ZW0ucGhvbmUpIHtcbiAgICAgICAgICBwaG9uZU51bWJlciA9IGN1cnJlbnRVc2VyUGhvbmVQcmVmaXggKyBpdGVtLnBob25lO1xuICAgICAgICAgIHNlbGVjdG9yLnB1c2goe1xuICAgICAgICAgICAgXCJwaG9uZS5udW1iZXJcIjogcGhvbmVOdW1iZXJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1c2VyRXhpc3QgPSBkYi51c2Vycy5maW5kKHtcbiAgICAgICAgICAkb3I6IHNlbGVjdG9yXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlckV4aXN0LmNvdW50KCkgPiAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi55So5oi35ZCN44CB5omL5py65Y+344CB6YKu566x5L+h5oGv5pyJ6K+v77yM5peg5rOV5Yy56YWN5Yiw5ZCM5LiA6LSm5Y+3XCIpO1xuICAgICAgICB9IGVsc2UgaWYgKHVzZXJFeGlzdC5jb3VudCgpID09PSAxKSB7XG4gICAgICAgICAgdXNlciA9IHVzZXJFeGlzdC5mZXRjaCgpWzBdO1xuICAgICAgICB9XG4gICAgICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIG9yZ2FuaXphdGlvbiA9IGl0ZW0ub3JnYW5pemF0aW9uO1xuICAgICAgICBtdWx0aU9yZ3MgPSBvcmdhbml6YXRpb24uc3BsaXQoXCIsXCIpO1xuICAgICAgICBiZWxvbmdPcmdpZHMgPSBbXTtcbiAgICAgICAgbXVsdGlPcmdzLmZvckVhY2goZnVuY3Rpb24ob3JnRnVsbG5hbWUpIHtcbiAgICAgICAgICB2YXIgZnVsbG5hbWUsIG9yZ2FuaXphdGlvbl9kZXB0cywgcGFyZW50X29yZ19pZDtcbiAgICAgICAgICBvcmdhbml6YXRpb25fZGVwdHMgPSBvcmdGdWxsbmFtZS50cmltKCkuc3BsaXQoXCIvXCIpO1xuICAgICAgICAgIGZ1bGxuYW1lID0gXCJcIjtcbiAgICAgICAgICBwYXJlbnRfb3JnX2lkID0gcm9vdF9vcmcuX2lkO1xuICAgICAgICAgIHJldHVybiBvcmdhbml6YXRpb25fZGVwdHMuZm9yRWFjaChmdW5jdGlvbihkZXB0X25hbWUsIGopIHtcbiAgICAgICAgICAgIHZhciBvcmcsIG9yZ19kb2MsIG9yZ19pZCwgcGFyZW50LCB1cGRhdGVGaWVsZHM7XG4gICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKGogPT09IDEpIHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZSA9IGRlcHRfbmFtZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmdWxsbmFtZSA9IGZ1bGxuYW1lICsgXCIvXCIgKyBkZXB0X25hbWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IGZ1bGxuYW1lXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAob3JnKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50X29yZ19pZCA9IG9yZy5faWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJlbG9uZ09yZ2lkcy5wdXNoKG9yZy5faWQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9yZ19kb2MgPSB7fTtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLl9pZCA9IGRiLm9yZ2FuaXphdGlvbnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgICAgIG9yZ19kb2Muc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLm5hbWUgPSBkZXB0X25hbWU7XG4gICAgICAgICAgICAgICAgb3JnX2RvYy5wYXJlbnQgPSBwYXJlbnRfb3JnX2lkO1xuICAgICAgICAgICAgICAgIG9yZ19kb2MuY3JlYXRlZCA9IG5vdztcbiAgICAgICAgICAgICAgICBvcmdfZG9jLmNyZWF0ZWRfYnkgPSBvd25lcl9pZDtcbiAgICAgICAgICAgICAgICBvcmdfZG9jLm1vZGlmaWVkID0gbm93O1xuICAgICAgICAgICAgICAgIG9yZ19kb2MubW9kaWZpZWRfYnkgPSBvd25lcl9pZDtcbiAgICAgICAgICAgICAgICBvcmdfaWQgPSBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC5pbnNlcnQob3JnX2RvYyk7XG4gICAgICAgICAgICAgICAgaWYgKG9yZ19pZCkge1xuICAgICAgICAgICAgICAgICAgb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKG9yZ19pZCk7XG4gICAgICAgICAgICAgICAgICB1cGRhdGVGaWVsZHMgPSB7fTtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkcy5wYXJlbnRzID0gb3JnLmNhbGN1bGF0ZVBhcmVudHMoKTtcbiAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpZWxkcy5mdWxsbmFtZSA9IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKCFfLmlzRW1wdHkodXBkYXRlRmllbGRzKSkge1xuICAgICAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICRzZXQ6IHVwZGF0ZUZpZWxkc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmIChvcmcucGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZShvcmcucGFyZW50KTtcbiAgICAgICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHBhcmVudC5faWQsIHtcbiAgICAgICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogcGFyZW50LmNhbGN1bGF0ZUNoaWxkcmVuKClcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcGFyZW50X29yZ19pZCA9IG9yZ19pZDtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBiZWxvbmdPcmdpZHMucHVzaChvcmcuX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHVzZXJfaWQgPSBudWxsO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1ZG9jID0ge307XG4gICAgICAgICAgdWRvYy5faWQgPSBkYi51c2Vycy5fbWFrZU5ld0lEKCk7XG4gICAgICAgICAgdWRvYy5zdGVlZG9zX2lkID0gaXRlbS5lbWFpbCB8fCB1ZG9jLl9pZDtcbiAgICAgICAgICB1ZG9jLmxvY2FsZSA9IGN1cnJlbnRVc2VyTG9jYWxlO1xuICAgICAgICAgIHVkb2Muc3BhY2VzX2ludml0ZWQgPSBbc3BhY2VfaWRdO1xuICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MubmFtZSA9IGl0ZW0ubmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgIHVkb2MuZW1haWxzID0gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogaXRlbS5lbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGl0ZW0udXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHVkb2MudXNlcm5hbWUgPSBpdGVtLnVzZXJuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgdWRvYy5waG9uZSA9IHtcbiAgICAgICAgICAgICAgbnVtYmVyOiBjdXJyZW50VXNlclBob25lUHJlZml4ICsgaXRlbS5waG9uZSxcbiAgICAgICAgICAgICAgbW9iaWxlOiBpdGVtLnBob25lLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgICAgICAgIG1vZGlmaWVkOiBub3dcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHVzZXJfaWQgPSBkYi51c2Vycy5pbnNlcnQodWRvYyk7XG4gICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIGl0ZW0ucGFzc3dvcmQsIHtcbiAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgdXNlcjogdXNlcl9pZFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHNwYWNlX3VzZXIpIHtcbiAgICAgICAgICBpZiAoYmVsb25nT3JnaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmICghc3BhY2VfdXNlci5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jID0ge307XG4gICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2Mub3JnYW5pemF0aW9ucyA9IF8udW5pcShzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMuY29uY2F0KGJlbG9uZ09yZ2lkcykpO1xuICAgICAgICAgICAgaWYgKGl0ZW0uZW1haWwpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLmVtYWlsID0gaXRlbS5lbWFpbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHNwYWNlX3VzZXJfdXBkYXRlX2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzcGFjZV91c2VyX3VwZGF0ZV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3BhY2VfdXNlcl91cGRhdGVfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoXy5rZXlzKHNwYWNlX3VzZXJfdXBkYXRlX2RvYykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBkYi5zcGFjZV91c2Vycy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgICAgICB1c2VyOiB1c2VyX2lkXG4gICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiBzcGFjZV91c2VyX3VwZGF0ZV9kb2NcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc3BhY2VfdXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiIHx8IHNwYWNlX3VzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLfov5jmnKrmjqXlj5fliqDlhaXlt6XkvZzljLrvvIzkuI3og73kv67mlLnku5bnmoTkuKrkurrkv6Hmga9cIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoaXRlbS51c2VybmFtZSkge1xuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHVzZXJfaWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJuYW1lOiBpdGVtLnVzZXJuYW1lXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKGl0ZW0ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgaXRlbS5wYXNzd29yZCwge1xuICAgICAgICAgICAgICAgICAgbG9nb3V0OiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChiZWxvbmdPcmdpZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3VfZG9jID0ge307XG4gICAgICAgICAgICBzdV9kb2MuX2lkID0gZGIuc3BhY2VfdXNlcnMuX21ha2VOZXdJRCgpO1xuICAgICAgICAgICAgc3VfZG9jLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgICAgICBzdV9kb2MudXNlcl9hY2NlcHRlZCA9IHRydWU7XG4gICAgICAgICAgICBzdV9kb2MuaW52aXRlX3N0YXRlID0gXCJhY2NlcHRlZFwiO1xuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnVzZXJfYWNjZXB0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc3VfZG9jLmludml0ZV9zdGF0ZSA9IFwicGVuZGluZ1wiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm5hbWUgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbWFpbCkge1xuICAgICAgICAgICAgICBzdV9kb2MuZW1haWwgPSBpdGVtLmVtYWlsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3VfZG9jLm9yZ2FuaXphdGlvbiA9IGJlbG9uZ09yZ2lkc1swXTtcbiAgICAgICAgICAgIHN1X2RvYy5vcmdhbml6YXRpb25zID0gYmVsb25nT3JnaWRzO1xuICAgICAgICAgICAgaWYgKGl0ZW0ucG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnBvc2l0aW9uID0gaXRlbS5wb3NpdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLndvcmtfcGhvbmUpIHtcbiAgICAgICAgICAgICAgc3VfZG9jLndvcmtfcGhvbmUgPSBpdGVtLndvcmtfcGhvbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5waG9uZSkge1xuICAgICAgICAgICAgICBzdV9kb2MubW9iaWxlID0gaXRlbS5waG9uZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpdGVtLnNvcnRfbm8pIHtcbiAgICAgICAgICAgICAgc3VfZG9jLnNvcnRfbm8gPSBpdGVtLnNvcnRfbm87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wYW55KSB7XG4gICAgICAgICAgICAgIHN1X2RvYy5jb21wYW55ID0gaXRlbS5jb21wYW55O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmluc2VydChzdV9kb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGVycm9yLmxpbmUgPSBpICsgMTtcbiAgICAgICAgZXJyb3IubWVzc2FnZSA9IGUucmVhc29uO1xuICAgICAgICByZXR1cm4gZXJyb3JMaXN0LnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBlcnJvckxpc3Q7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0V2ViQXBwLmNvbm5lY3RIYW5kbGVycy51c2UgXCIvYXBpL2V4cG9ydC9zcGFjZV91c2Vyc1wiLCAocmVxLCByZXMsIG5leHQpLT5cblx0XHR0cnlcblx0XHRcdGN1cnJlbnRfdXNlcl9pbmZvID0gdXVmbG93TWFuYWdlci5jaGVja19hdXRob3JpemF0aW9uKHJlcSlcblxuXHRcdFx0cXVlcnkgPSByZXEucXVlcnlcblx0XHRcdHNwYWNlX2lkID0gcXVlcnkuc3BhY2VfaWRcblx0XHRcdG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZFxuXHRcdFx0dXNlcl9pZCA9IHF1ZXJ5WydYLVVzZXItSWQnXVxuXHRcdFx0b3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6b3JnX2lkfSx7ZmllbGRzOntmdWxsbmFtZToxfX0pXG5cdFx0XHR1c2Vyc190b194bHMgPSBuZXcgQXJyYXlcblx0XHRcdG5vdyA9IG5ldyBEYXRlIFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsdXNlcl9pZClcblx0XHRcdFx0dXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRzb3J0OiB7bmFtZTogMX1cblx0XHRcdFx0fSkuZmV0Y2goKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvcmdfaWRzID0gW11cblx0XHRcdFx0b3JnX29ianMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDpvcmdfaWQsc3BhY2U6c3BhY2VfaWR9LHtmaWVsZHM6e19pZDoxLGNoaWxkcmVuOjF9fSkuZmV0Y2goKVxuXHRcdFx0XHRvcmdfaWRzID0gXy5wbHVjayhvcmdfb2JqcywnX2lkJylcblx0XHRcdFx0Xy5lYWNoIG9yZ19vYmpzLChvcmdfb2JqKS0+XG5cdFx0XHRcdFx0b3JnX2lkcyA9IF8udW5pb24ob3JnX2lkcyxvcmdfb2JqPy5jaGlsZHJlbilcblx0XHRcdFx0Xy51bmlxKG9yZ19pZHMpXG5cdFx0XHRcdHVzZXJzX3RvX3hscyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkLG9yZ2FuaXphdGlvbnM6eyRpbjpvcmdfaWRzfX0se3NvcnQ6IHtzb3J0X25vOiAtMSxuYW1lOjF9fSkuZmV0Y2goKVxuXHRcdFx0ZWpzID0gcmVxdWlyZSgnZWpzJylcblx0XHRcdHN0ciA9IEFzc2V0cy5nZXRUZXh0KCdzZXJ2ZXIvZWpzL2V4cG9ydF9zcGFjZV91c2Vycy5lanMnKVxuXHRcdFx0XG5cdFx0XHQjIOajgOa1i+aYr+WQpuacieivreazlemUmeivr1xuXHRcdFx0ZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jylcblx0XHRcdGVycm9yX29iaiA9IGVqc0xpbnQubGludChzdHIsIHt9KVxuXHRcdFx0aWYgZXJyb3Jfb2JqXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVycm9yX29ialxuXG5cdFx0XHR0ZW1wbGF0ZSA9IGVqcy5jb21waWxlKHN0cilcblxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cblx0XHRcdG9yZ05hbWUgPSBpZiBvcmcgdGhlbiBvcmcuZnVsbG5hbWUgZWxzZSBvcmdfaWRcblx0XHRcdGZpZWxkcyA9IFt7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonbmFtZScsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtb2JpbGUnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21vYmlsZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTond29ya19waG9uZScsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfd29ya19waG9uZScse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTonZW1haWwnLFxuXHRcdFx0XHRcdHdpZHRoOiAxMDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidjb21wYW55Jyxcblx0XHRcdFx0XHR3aWR0aDogMTAwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19jb21wYW55Jyx7fSxsYW5nKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidwb3NpdGlvbicsXG5cdFx0XHRcdFx0d2lkdGg6IDEwMCxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfcG9zaXRpb24nLHt9LGxhbmcpXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdTdHJpbmcnLFxuXHRcdFx0XHRcdG5hbWU6J29yZ2FuaXphdGlvbnMnLFxuXHRcdFx0XHRcdHdpZHRoOiA2MDAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLHt9LGxhbmcpLFxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRvcmdOYW1lcyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOiB2YWx1ZX19LHtmaWVsZHM6IHtmdWxsbmFtZTogMX19KS5tYXAoKGl0ZW0saW5kZXgpLT5cblx0XHRcdFx0XHRcdFx0cmV0dXJuIGl0ZW0uZnVsbG5hbWVcblx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdHJldHVybiBvcmdOYW1lcy5qb2luKFwiLFwiKVxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHR0eXBlOiAnU3RyaW5nJyxcblx0XHRcdFx0XHRuYW1lOidtYW5hZ2VyJyxcblx0XHRcdFx0XHR3aWR0aDogNjAsXG5cdFx0XHRcdFx0dGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX21hbmFnZXInLHt9LGxhbmcpXG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAodmFsdWUpLT5cblx0XHRcdFx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHZhbHVlfSx7ZmllbGRzOiB7bmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/Lm5hbWVcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcicsXG5cdFx0XHRcdFx0d2lkdGg6IDYwLFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScse30sbGFuZylcblx0XHRcdFx0XHR0cmFuc2Zvcm06ICh2YWx1ZSktPlxuXHRcdFx0XHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdmFsdWV9LHtmaWVsZHM6IHt1c2VybmFtZTogMX19KVxuXHRcdFx0XHRcdFx0cmV0dXJuIHVzZXI/LnVzZXJuYW1lXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdHR5cGU6ICdOdW1iZXInLFxuXHRcdFx0XHRcdG5hbWU6J3NvcnRfbm8nLFxuXHRcdFx0XHRcdHdpZHRoOiAzNSxcblx0XHRcdFx0XHR0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfc29ydF9ubycse30sbGFuZylcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0dHlwZTogJ1N0cmluZycsXG5cdFx0XHRcdFx0bmFtZTondXNlcl9hY2NlcHRlZCcsXG5cdFx0XHRcdFx0d2lkdGg6IDM1LFxuXHRcdFx0XHRcdHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkJyx7fSxsYW5nKVxuXHRcdFx0XHRcdHRyYW5zZm9ybTogKHZhbHVlKS0+XG5cdFx0XHRcdFx0XHRyZXR1cm4gaWYgdmFsdWUgdGhlbiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycse30sbGFuZykgZWxzZSBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJyx7fSxsYW5nKVxuXHRcdFx0XHR9XVxuXHRcdFx0XG5cdFx0XHRzaGVldF9uYW1lID0gb3JnTmFtZT8ucmVwbGFjZSgvXFwvL2csXCItXCIpICPkuI3mlK/mjIFcIi9cIuespuWPt1xuXHRcdFx0cmV0ID0gdGVtcGxhdGUoe1xuXHRcdFx0XHRsYW5nOiBsYW5nLFxuXHRcdFx0XHRzaGVldF9uYW1lOiBzaGVldF9uYW1lLFxuXHRcdFx0XHRmaWVsZHM6IGZpZWxkcyxcblx0XHRcdFx0dXNlcnNfdG9feGxzOiB1c2Vyc190b194bHNcblx0XHRcdH0pXG5cblx0XHRcdGZpbGVOYW1lID0gXCJTdGVlZE9TQ29udGFjdHNfXCIgKyBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbScpICsgXCIueGxzXCJcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIilcblx0XHRcdHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIitlbmNvZGVVUkkoZmlsZU5hbWUpKVxuXHRcdFx0cmVzLmVuZChyZXQpXG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0XHRyZXMuZW5kKGUubWVzc2FnZSkiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFdlYkFwcC5jb25uZWN0SGFuZGxlcnMudXNlKFwiL2FwaS9leHBvcnQvc3BhY2VfdXNlcnNcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY3VycmVudF91c2VyX2luZm8sIGUsIGVqcywgZWpzTGludCwgZXJyb3Jfb2JqLCBmaWVsZHMsIGZpbGVOYW1lLCBsYW5nLCBub3csIG9yZywgb3JnTmFtZSwgb3JnX2lkLCBvcmdfaWRzLCBvcmdfb2JqcywgcXVlcnksIHJldCwgc2hlZXRfbmFtZSwgc3BhY2VfaWQsIHN0ciwgdGVtcGxhdGUsIHVzZXJfaWQsIHVzZXJzX3RvX3hscztcbiAgICB0cnkge1xuICAgICAgY3VycmVudF91c2VyX2luZm8gPSB1dWZsb3dNYW5hZ2VyLmNoZWNrX2F1dGhvcml6YXRpb24ocmVxKTtcbiAgICAgIHF1ZXJ5ID0gcmVxLnF1ZXJ5O1xuICAgICAgc3BhY2VfaWQgPSBxdWVyeS5zcGFjZV9pZDtcbiAgICAgIG9yZ19pZCA9IHF1ZXJ5Lm9yZ19pZDtcbiAgICAgIHVzZXJfaWQgPSBxdWVyeVsnWC1Vc2VyLUlkJ107XG4gICAgICBvcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG9yZ19pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBmdWxsbmFtZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHVzZXJzX3RvX3hscyA9IG5ldyBBcnJheTtcbiAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCB1c2VyX2lkKSkge1xuICAgICAgICB1c2Vyc190b194bHMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG5hbWU6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmdfaWRzID0gW107XG4gICAgICAgIG9yZ19vYmpzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBfaWQ6IG9yZ19pZCxcbiAgICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgY2hpbGRyZW46IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZldGNoKCk7XG4gICAgICAgIG9yZ19pZHMgPSBfLnBsdWNrKG9yZ19vYmpzLCAnX2lkJyk7XG4gICAgICAgIF8uZWFjaChvcmdfb2JqcywgZnVuY3Rpb24ob3JnX29iaikge1xuICAgICAgICAgIHJldHVybiBvcmdfaWRzID0gXy51bmlvbihvcmdfaWRzLCBvcmdfb2JqICE9IG51bGwgPyBvcmdfb2JqLmNoaWxkcmVuIDogdm9pZCAwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIF8udW5pcShvcmdfaWRzKTtcbiAgICAgICAgdXNlcnNfdG9feGxzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRpbjogb3JnX2lkc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IC0xLFxuICAgICAgICAgICAgbmFtZTogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIH1cbiAgICAgIGVqcyA9IHJlcXVpcmUoJ2VqcycpO1xuICAgICAgc3RyID0gQXNzZXRzLmdldFRleHQoJ3NlcnZlci9lanMvZXhwb3J0X3NwYWNlX3VzZXJzLmVqcycpO1xuICAgICAgZWpzTGludCA9IHJlcXVpcmUoJ2Vqcy1saW50Jyk7XG4gICAgICBlcnJvcl9vYmogPSBlanNMaW50LmxpbnQoc3RyLCB7fSk7XG4gICAgICBpZiAoZXJyb3Jfb2JqKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCI9PT0vYXBpL2NvbnRhY3RzL2V4cG9ydC9zcGFjZV91c2VyczpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3Jfb2JqKTtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlID0gZWpzLmNvbXBpbGUoc3RyKTtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKGN1cnJlbnRfdXNlcl9pbmZvLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIG9yZ05hbWUgPSBvcmcgPyBvcmcuZnVsbG5hbWUgOiBvcmdfaWQ7XG4gICAgICBmaWVsZHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19uYW1lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnbW9iaWxlJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19tb2JpbGUnLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd3b3JrX3Bob25lJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc193b3JrX3Bob25lJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX2VtYWlsJywge30sIGxhbmcpXG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAnY29tcGFueScsXG4gICAgICAgICAgd2lkdGg6IDEwMCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfY29tcGFueScsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ3Bvc2l0aW9uJyxcbiAgICAgICAgICB3aWR0aDogMTAwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc19wb3NpdGlvbicsIHt9LCBsYW5nKVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ29yZ2FuaXphdGlvbnMnLFxuICAgICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX29yZ2FuaXphdGlvbnMnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG9yZ05hbWVzO1xuICAgICAgICAgICAgb3JnTmFtZXMgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZnVsbG5hbWU6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkubWFwKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVtLmZ1bGxuYW1lO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gb3JnTmFtZXMuam9pbihcIixcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgdHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgbmFtZTogJ21hbmFnZXInLFxuICAgICAgICAgIHdpZHRoOiA2MCxcbiAgICAgICAgICB0aXRsZTogVEFQaTE4bi5fXygnc3BhY2VfdXNlcnNfbWFuYWdlcicsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBuYW1lOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHVzZXIgIT0gbnVsbCA/IHVzZXIubmFtZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICB0eXBlOiAnU3RyaW5nJyxcbiAgICAgICAgICBuYW1lOiAndXNlcicsXG4gICAgICAgICAgd2lkdGg6IDYwLFxuICAgICAgICAgIHRpdGxlOiBUQVBpMThuLl9fKCd1c2Vyc191c2VybmFtZScsIHt9LCBsYW5nKSxcbiAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgdXNlcjtcbiAgICAgICAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiB2YWx1ZVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB1c2VyICE9IG51bGwgPyB1c2VyLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdOdW1iZXInLFxuICAgICAgICAgIG5hbWU6ICdzb3J0X25vJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3NvcnRfbm8nLCB7fSwgbGFuZylcbiAgICAgICAgfSwge1xuICAgICAgICAgIHR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIG5hbWU6ICd1c2VyX2FjY2VwdGVkJyxcbiAgICAgICAgICB3aWR0aDogMzUsXG4gICAgICAgICAgdGl0bGU6IFRBUGkxOG4uX18oJ3NwYWNlX3VzZXJzX3VzZXJfYWNjZXB0ZWQnLCB7fSwgbGFuZyksXG4gICAgICAgICAgdHJhbnNmb3JtOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX3llcycsIHt9LCBsYW5nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBUQVBpMThuLl9fKCdzcGFjZV91c2Vyc191c2VyX2FjY2VwdGVkX25vJywge30sIGxhbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIHNoZWV0X25hbWUgPSBvcmdOYW1lICE9IG51bGwgPyBvcmdOYW1lLnJlcGxhY2UoL1xcLy9nLCBcIi1cIikgOiB2b2lkIDA7XG4gICAgICByZXQgPSB0ZW1wbGF0ZSh7XG4gICAgICAgIGxhbmc6IGxhbmcsXG4gICAgICAgIHNoZWV0X25hbWU6IHNoZWV0X25hbWUsXG4gICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICB1c2Vyc190b194bHM6IHVzZXJzX3RvX3hsc1xuICAgICAgfSk7XG4gICAgICBmaWxlTmFtZSA9IFwiU3RlZWRPU0NvbnRhY3RzX1wiICsgbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW0nKSArIFwiLnhsc1wiO1xuICAgICAgcmVzLnNldEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJDb250ZW50LURpc3Bvc2l0aW9uXCIsIFwiYXR0YWNobWVudDtmaWxlbmFtZT1cIiArIGVuY29kZVVSSShmaWxlTmFtZSkpO1xuICAgICAgcmV0dXJuIHJlcy5lbmQocmV0KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIHJldHVybiByZXMuZW5kKGUubWVzc2FnZSk7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
