(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var moment = Package['momentjs:moment'].moment;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects-core":{"i18n.coffee":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/i18n.coffee                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var i18n = void 0;
module.watch(require("meteor/universe:i18n"), {
  "default": function (v) {
    i18n = v;
  }
}, 0);
var getBrowserLocale, sprintf;
sprintf = require('sprintf-js').sprintf;
this.i18n = i18n;

this.t = function (key, parameters, locale) {
  var translator;

  if (locale === "zh-cn") {
    locale = "zh-CN";
  }

  if (locale) {
    translator = i18n.createTranslator('', locale);
  } else {
    translator = i18n.__;
  }

  if (parameters != null ? parameters.context : void 0) {
    key = key + "_" + parameters.context;
  }

  if (parameters != null && !_.isObject(parameters)) {
    return sprintf(translator(key), parameters);
  }

  return translator(key, parameters);
};

this.tr = t;
this.trl = t;
i18n.setOptions({
  purify: null,
  defaultLocale: 'zh-CN'
});

if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
  TAPi18n.__original = TAPi18n.__;

  TAPi18n.__ = function (key, options, locale) {
    var translated;
    translated = t(key, options, locale);

    if (translated !== key) {
      return translated;
    }

    return TAPi18n.__original(key, options, locale);
  };

  TAPi18n._getLanguageFilePath = function (lang_tag) {
    var path;
    path = this.conf.cdn_path != null ? this.conf.cdn_path : this.conf.i18n_files_route;
    path = path.replace(/\/$/, "");

    if (path[0] === "/") {
      path = Meteor.absoluteUrl().replace(/\/+$/, "") + path;
    }

    return path + "/" + lang_tag + ".json";
  };
}

if (Meteor.isClient) {
  getBrowserLocale = function () {
    var l, locale;
    l = window.navigator.userLanguage || window.navigator.language || 'en';

    if (l.indexOf("zh") >= 0) {
      locale = "zh-cn";
    } else {
      locale = "en-us";
    }

    return locale;
  };

  SimpleSchema.prototype.i18n = function (prefix) {
    var self;
    self = this;
    return _.each(self._schema, function (value, key) {
      if (!value) {
        return;
      }

      if (!self._schema[key].label) {
        return self._schema[key].label = function () {
          return t(prefix + "_" + key.replace(/\./g, "_"));
        };
      }
    });
  };

  Template.registerHelper('_', function (key, args) {
    return TAPi18n.__(key, args);
  });
  Meteor.startup(function () {
    Template.registerHelper('_', function (key, args) {
      return TAPi18n.__(key, args);
    });
    Session.set("steedos-locale", getBrowserLocale());
    Tracker.autorun(function () {
      if (Session.get("steedos-locale") !== "en-us") {
        if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
          TAPi18n.setLanguage("zh-CN");
        }

        T9n.setLanguage("zh-CN");
        i18n.setLocale("zh-CN");
        return moment.locale("zh-cn");
      } else {
        if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
          TAPi18n.setLanguage("en");
        }

        T9n.setLanguage("en");
        i18n.setLocale("en");
        return moment.locale("en");
      }
    });
    Tracker.autorun(function () {
      Session.set("steedos-locale", "zh-CN");

      if (Meteor.user()) {
        if (Meteor.user().locale) {
          return Session.set("steedos-locale", Meteor.user().locale);
        }
      }
    });
    return i18n.onChangeLocale(function (newLocale) {
      $.extend(true, $.fn.dataTable.defaults, {
        language: {
          "decimal": t("dataTables.decimal"),
          "emptyTable": t("dataTables.emptyTable"),
          "info": t("dataTables.info"),
          "infoEmpty": t("dataTables.infoEmpty"),
          "infoFiltered": t("dataTables.infoFiltered"),
          "infoPostFix": t("dataTables.infoPostFix"),
          "thousands": t("dataTables.thousands"),
          "lengthMenu": t("dataTables.lengthMenu"),
          "loadingRecords": t("dataTables.loadingRecords"),
          "processing": t("dataTables.processing"),
          "search": t("dataTables.search"),
          "zeroRecords": t("dataTables.zeroRecords"),
          "paginate": {
            "first": t("dataTables.paginate.first"),
            "last": t("dataTables.paginate.last"),
            "next": t("dataTables.paginate.next"),
            "previous": t("dataTables.paginate.previous")
          },
          "aria": {
            "sortAscending": t("dataTables.aria.sortAscending"),
            "sortDescending": t("dataTables.aria.sortDescending")
          }
        }
      });
      return _.each(Tabular.tablesByName, function (table) {
        return _.each(table.options.columns, function (column) {
          if (!column.data || column.data === "_id") {
            return;
          }

          column.sTitle = t("" + table.collection._name + "_" + column.data.replace(/\./g, "_"));

          if (!table.options.language) {
            table.options.language = {};
          }

          table.options.language.zeroRecords = t("dataTables.zero") + t(table.collection._name);
        });
      });
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"i18n":{"en.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/i18n/en.i18n.json.js                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
Package['universe:i18n'].i18n.addTranslations('en','',{"users":"Users","users_steedos_id":"Steedos ID","users_name":"Name","users_username":"Username","users_email":"Email","users_company":"Company","users_position":"Position","users_work_phone":"Work Phone","users_mobile":"Mobile","users_locale":"Language","users_timezone":"Timezone","users_emails":"Emails","users_createdAt":"Created At","users_email_notification":"Email Notification","apps":"Apps","apps_space":"Space","apps_name":"Name","apps_description":"Description","apps_auth_name":"Auth Name","apps_url":"URL","apps_on_click":"URL Script","apps_is_use_ie":"Use IE(Use the Steedos desktop client)","apps_is_use_iframe":"Use iframe","apps_is_new_window":"New window opens","apps_iconURL":"IconURL","apps_icon":"Icon","apps_space_sort":"Sort Index","apps_mobile":"Show on mobile apps","apps_desktop":"Show on desktop","apps_menu":"Show on left menu","apps_sort_no":"Sort No.","apps_secret":"API key","apps_internal":"Internal","apps_sort":"Sort","apps_id":"ID","space":"Space","spaces":"Spaces","spaces_id":"ID","spaces_name":"Name","spaces_admins":"Admins","spaces_owner":"Owner","spaces_balance":"Balance","spaces_is_paid":"Is Paid","spaces_owner_name()":"Owner","spaces_admins_name()":"Admins","spaces_enable_register":"Whether to allow registration","spaces_apps_enabled":"Apps Enabled","spaces_max_user_count":"Maximum number of users","spaces_is_deleted":"Is Deleted","spaces_created":"Created","spaces_created_by":"Created By","spaces_modified":"Modified","spaces_modified_by":"Modified By","spaces_modules":"Modules","spaces_prefs":"Preference","spaces_avatar":"Logo(260*50px)","organizations":"Organizations","organizations_id":"ID","organizations_children":"Children","organizations_fullname":"Fullname","organizations_users":"Users","organizations_name":"Name","organizations_parent":"Parent","organizations_space_name()":"Space","organizations_users_count()":"Users Count","organizations_created":"Created","organizations_created_by":"Created By","organizations_is_company":"Is Company","organizations_modified":"Modified","organizations_modified_by":"Modified By","organizations_parents":"All Parents","organizations_space":"Space ID","organizations_sort_no":"Sort No.","organizations_hidden":"Hidden","organizations_admins":"Admins","space_users":"Space Users","space_users_id":"ID","space_users_user":"User ID","space_users_space_name()":"Space Name","space_users_name":"Name","space_users_email":"Email","space_users_organization":"Primary Organization","space_users_organizations":"Organizations","space_users_user_accepted":"Is Valid","space_users_manager":"Manager","space_users_organization_name()":"Organization","space_users_space":"Space","space_users_created":"Created","space_users_modified":"Modified","space_users_created_by":"Created By","space_users_modified_by":"Modified By","space_users_mobile":"Mobile","space_users_work_phone":"Work Phone","space_users_company":"Company","space_users_position":"Position","space_users_managers":"All Managers","space_users_apps":"Apps","space_users_sort_no":"Sort No.","users_changelogs_id":"ID","users_changelogs_change_data":"Change Data","users_changelogs_operator":"Operator","users_changelogs_space":"Space","users_changelogs_operation":"Operation","users_changelogs_user_count":"User Count","users_changelogs_created":"Created","users_changelogs_user":"User","users_changelogs_created_by":"Created By","organizations_error_space_required":"Space is required","organizations_error_space_not_found":"Space can not be found","organizations_error_space_admins_only":"You are not the space admin","organizations_error_users_readonly":"Users can not be modified","organizations_error_organizations_name_exists":"Organization name has existed","organizations_error_space_readonly":"Space can not be modified","organizations_error_parents_readonly":"Parents can not be modified","organizations_error_children_readonly":"Children can not be modified","organizations_error_fullname_readonly":"Fullname can not be modified","organizations_error_parent_is_self":"The parent can not be itself","organizations_error_organization_has_children":"The organization has children","organizations_error_can_not_remove_root_organization":"The root organization can not be removed","organizations_error_organization_is_company":"The root organization can not be modified","organizations_error_organization_name_required":"Organization name is required","organizations_error_organizations_parent_required":"Organization parent required","organizations_error_space_admins_only_for_org_admins":"Only the space admin can deal organization admins","organizations_error_org_admins_only":"Access denied,only organization admins can do this operation.","organizations_error_organization_has_users":"Department can not be deleted while has users.","space_users_error_space_required":"Space is requred","space_users_error_space_not_found":"Space can not be found","space_users_error_space_admins_only":"You are not the space admin","space_users_error_user_required":"User is required","space_users_error_name_required":"Name is required","space_users_error_space_users_exists":"The space user has existed","space_users_error_email_readonly":"The e-mail can not be modified","space_users_error_space_readonly":"Space can not be modified","space_users_error_user_readonly":"User can not be modified","space_users_error_remove_space_owner":"The space owner can not be removed","space_users_error_phone_already_existed":"The phone number is already used.","spaces_error_login_required":"Login is required","spaces_error_space_owner_only":"You are not the space owner","spaces_error_space_admins_required":"Space admin is required","spaces_error_space_readonly":"Space can not be modified","users_error_email_exists":"The e-mail has existed","users_error_username_exists":"The user name has existed","users_error_steedos_id_required":"Steedos ID is required","users_error_steedos_id_readonly":"Steedos ID can not be modified","users_error_cloud_admin_required":"Cloud admin required","users_email_create_account":"An account has been created for you on Steedos","users_email_start_service":"To start using the service,simply click the link below.","users_email_verify_account":"To verify your account email,simply click the link below.","users_email_verify_email":"How to verify email address on Steedos","users_email_reset_password":"How to reset your password on Steedos","users_email_reset_password_body":"Your token code is {$token_code}\r\nTo reset your password, input the token code above at the password reset page or simply click the link below.","users_email_hello":"Hello","users_email_thanks":"Thanks."});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/i18n/zh-CN.i18n.json.js                                                     //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"users":"用户","users_steedos_id":"Steedos ID","users_name":"姓名","users_username":"用户名","users_email":"邮件","users_company":"公司","users_position":"职务","users_mobile":"手机","users_work_phone":"固定电话","users_locale":"语言","users_timezone":"时区","users_emails":"邮件","users_createdAt":"创建日期","users_email_notification":"接收邮件通知","apps":"应用","apps_space":"工作区","apps_name":"名称","apps_description":"描述","apps_url":"链接","apps_auth_name":"验证域名","apps_on_click":"链接脚本","apps_is_use_ie":"使用IE打开(需使用Steedos桌面客户端)","apps_is_use_iframe":"使用iframe打开","apps_is_new_window":"新窗口打开","apps_iconURL":"图标链接","apps_icon":"图标","apps_space_sort":"排序号","apps_mobile":"在移动应用中显示","apps_desktop":"在桌面应用中显示","apps_menu":"在左侧菜单显示","apps_sort_no":"排序号","apps_secret":"API 密钥","apps_internal":"App内置","apps_sort":"排序","apps_id":"ID","space":"工作区","spaces":"工作区","spaces_id":"ID","spaces_name":"名称","spaces_admins":"管理员","spaces_balance":"账户余额","spaces_owner":"所有者","spaces_is_paid":"已付费","spaces_owner_name()":"所有者","spaces_admins_name()":"管理员","spaces_apps_enabled":"启用应用","spaces_enable_register":"是否允许注册","spaces_max_user_count":"最大用户数","spaces_is_deleted":"已删除","spaces_created":"创建时间","spaces_created_by":"创建者","spaces_modified":"修改时间","spaces_modified_by":"修改者","spaces_modules":"模块","spaces_prefs":"首选项","spaces_avatar":"Logo","organizations":"部门","organizations_id":"ID","organizations_fullname":"部门全名","organizations_users":"部门成员","organizations_name":"部门名称","organizations_parent":"上级部门","organizations_space_name()":"工作区","organizations_users_count()":"人数","organizations_children":"下级部门","organizations_created":"创建时间","organizations_created_by":"创建者","organizations_is_company":"公司级","organizations_modified":"修改时间","organizations_modified_by":"修改者","organizations_parents":"所有上级部门","organizations_space":"所属工作区","organizations_sort_no":"排序号","organizations_hidden":"隐藏","organizations_admins":"部门管理员","space_users":"人员","space_users_id":"ID","space_users_user":"用户ID","space_users_space_name()":"工作区","space_users_name":"姓名","space_users_email":"邮件","space_users_organization":"主部门","space_users_organizations":"所属部门","space_users_user_accepted":"有效","space_users_manager":"上级主管","space_users_organization_name()":"部门","space_users_space":"所属工作区","space_users_created":"创建时间","space_users_modified":"修改时间","space_users_created_by":"创建者","space_users_modified_by":"修改者","space_users_mobile":"手机","space_users_work_phone":"固定电话","space_users_company":"单位","space_users_position":"职务","space_users_managers":"所有上级主管","space_users_apps":"Apps","space_users_sort_no":"排序号","users_changelogs_id":"ID","users_changelogs_change_data":"修改日期","users_changelogs_operator":"操作者","users_changelogs_space":"工作区","users_changelogs_operation":"操作","users_changelogs_user_count":"用户数","users_changelogs_created":"创建时间","users_changelogs_user":"用户","users_changelogs_created_by":"创建者","organizations_error_space_required":"工作区必填","organizations_error_space_not_found":"未找到该工作区","organizations_error_space_admins_only":"您不是该工作区的管理员","organizations_error_users_readonly":"您无法修改部门成员","organizations_error_organizations_name_exists":"该部门名称已经存在","organizations_error_space_readonly":"无法修改工作区","organizations_error_parents_readonly":"无法修改上级部门","organizations_error_children_readonly":"无法修改下级部门","organizations_error_fullname_readonly":"无法修改部门全名","organizations_error_parent_is_self":"上级部门不能是自己","organizations_error_organization_has_children":"该部门已有下级部门","organizations_error_can_not_remove_root_organization":"您无法删除一级部门","organizations_error_organization_is_company":"根部门的名字无法修改","organizations_error_organization_name_required":"部门名称必填","organizations_error_organizations_parent_required":"请选择上级部门","organizations_error_space_admins_only_for_org_admins":"只有该工作区的管理员才能处理“组织管理员”","organizations_error_org_admins_only":"无权访问，只有组织机构管理员可以执行此操作。","organizations_error_organization_has_users":"部门内有人员,所以不能删除","organizations_error_can_not_set_checkbox_true":"不能设置管理员或拥有者为无效","space_users_error_space_required":"工作区必填","space_users_error_space_not_found":"未找到该工作区","space_users_error_space_admins_only":"您不是该工作区的管理员","space_users_error_user_required":"user必填","space_users_error_name_required":"用户名必填","space_users_error_space_users_exists":"该用户已经存在","space_users_error_email_readonly":"用户邮箱不允许修改","space_users_error_space_readonly":"无法修改工作区","space_users_error_user_readonly":"无法修改用户","space_users_error_remove_space_owner":"不能删除工作区拥有者","space_users_error_remove_space_admins":"不能删除工作区管理员","space_users_error_phone_already_existed":"该手机号已被其他用户注册","spaces_error_login_required":"login必填","spaces_error_space_owner_only":"您不是该工作区的所有者","spaces_error_space_admins_required":"必须为工作区选择一个管理员","spaces_error_space_readonly":"工作区无法修改","users_error_email_exists":"该邮件地址已存在","users_error_username_exists":"该用户名已存在","users_error_steedos_id_required":"登录账户为必填项","users_error_steedos_id_readonly":"登录账户无法修改","users_error_cloud_admin_required":"您无权删除该用户","users_email_create_account":"已为您创建华炎云账号","users_email_start_service":"请点击以下链接，填写相关信息。","users_email_verify_account":"您已注册华炎云账号,请点击以下链接进行验证。","users_email_verify_email":"验证您的登录邮箱","users_email_reset_password":"重新设置您的密码","users_email_reset_password_body":"您的验证码为：{$token_code}\r\n请在密码重置界面输入上面的验证码，或点击以下链接，重新设置您的登录密码。","users_email_hello":"您好","users_email_thanks":"谢谢！"});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"cfs":{"cfs.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/cfs.coffee                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.cfs = {};
Meteor.startup(function () {
  return FS.HTTP.setBaseUrl("/api");
});

cfs.getContentType = function (filename) {
  var _exp;

  _exp = filename.split('.').pop().toLowerCase();

  if ('.' + _exp === '.au') {
    return 'audio/basic';
  } else if ('.' + _exp === '.avi') {
    return 'video/x-msvideo';
  } else if ('.' + _exp === '.bmp') {
    return 'image/bmp';
  } else if ('.' + _exp === '.bz2') {
    return 'application/x-bzip2';
  } else if ('.' + _exp === '.css') {
    return 'text/css';
  } else if ('.' + _exp === '.dtd') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.doc') {
    return 'application/msword';
  } else if ('.' + _exp === '.docx') {
    return 'application/msword';
  } else if ('.' + _exp === '.dotx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.es') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.exe') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.gif') {
    return 'image/gif';
  } else if ('.' + _exp === '.gz') {
    return 'application/x-gzip';
  } else if ('.' + _exp === '.hqx') {
    return 'application/mac-binhex40';
  } else if ('.' + _exp === '.html') {
    return 'text/html';
  } else if ('.' + _exp === '.jar') {
    return 'application/x-java-archive';
  } else if ('.' + _exp === '.jpg' || '.' + _exp === '.jpeg') {
    return 'image/jpeg';
  } else if ('.' + _exp === '.js') {
    return 'application/x-javascript';
  } else if ('.' + _exp === '.jsp') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.midi') {
    return 'audio/midi';
  } else if ('.' + _exp === '.mp3') {
    return 'audio/mpeg';
  } else if ('.' + _exp === '.mpeg') {
    return 'video/mpeg';
  } else if ('.' + _exp === '.ogg') {
    return 'application/ogg';
  } else if ('.' + _exp === '.pdf') {
    return 'application/pdf';
  } else if ('.' + _exp === '.pl') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.png') {
    return 'image/png';
  } else if ('.' + _exp === '.potx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.ppsx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.ppt') {
    return 'application/vnd.ms-powerpoint';
  } else if ('.' + _exp === '.pptx') {
    return 'application/vnd.ms-powerpoint';
  } else if ('.' + _exp === '.ps') {
    return 'application/postscript';
  } else if ('.' + _exp === '.qt') {
    return 'video/quicktime';
  } else if ('.' + _exp === '.ra') {
    return 'audio/x-pn-realaudio';
  } else if ('.' + _exp === '.ram') {
    return 'audio/x-pn-realaudio';
  } else if ('.' + _exp === '.rdf') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.rtf') {
    return 'text/rtf';
  } else if ('.' + _exp === '.sgml') {
    return 'text/sgml';
  } else if ('.' + _exp === '.sit') {
    return 'application/x-stuffit';
  } else if ('.' + _exp === '.sldx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.svg') {
    return 'image/svg+xml';
  } else if ('.' + _exp === '.swf') {
    return 'application/x-shockwave-flash';
  } else if ('.' + _exp === '.tar.gz') {
    return 'application/x-gzip';
  } else if ('.' + _exp === '.tgz') {
    return 'application/x-compressed';
  } else if ('.' + _exp === '.tiff') {
    return 'image/tiff';
  } else if ('.' + _exp === '.tsv') {
    return 'text/tab-separated-values';
  } else if ('.' + _exp === '.txt') {
    return 'text/plain';
  } else if ('.' + _exp === '.wav') {
    return 'audio/x-wav';
  } else if ('.' + _exp === '.xlam') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xls') {
    return 'application/vnd.ms-excel';
  } else if ('.' + _exp === '.xlsb') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xlsx') {
    return 'application/vnd.ms-excel';
  } else if ('.' + _exp === '.xltx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xml') {
    return 'text/xml';
  } else if ('.' + _exp === '.zip') {
    return 'application/zip';
  } else {
    return 'application/octet-stream';
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs_fix.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/cfs_fix.coffee                                                          //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
FS.StorageAdapter.prototype.on('error', function (storeName, error, fileObj) {
  console.error("FS.StorageAdapter emit error");
  console.error(error);
  console.error(fileObj);
  return console.error(storeName);
});
FS.Collection.prototype.on('error', function (error, fileObj, storeName) {
  console.error("FS.Collection emit error");
  console.error(error);
  console.error(fileObj);
  return console.error(storeName);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs_files.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/cfs_files.coffee                                                        //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.Objects["cfs.files.filerecord"] = {
  name: "cfs.files.filerecord",
  table_name: "cfs.files.filerecord",
  label: "附件版本",
  icon: "drafts",
  enable_search: true,
  enable_api: true,
  hidden: true,
  fields: {
    original: {
      label: "文件",
      type: "object",
      blackbox: true,
      omit: true
    },
    "original.name": {
      label: "文件名",
      type: "text"
    },
    "original.size": {
      label: "文件大小",
      type: "number"
    },
    metadata: {
      label: "属性",
      type: "object",
      blackbox: true,
      omit: true
    },
    "metadata.owner": {
      label: "上传者",
      type: "lookup",
      reference_to: "users",
      omit: true
    },
    "metadata.owner_name": {
      label: "上传者",
      type: "text",
      omit: true
    },
    "metadata.parent": {
      label: "所属文件",
      type: "master_detail",
      reference_to: "cms_files",
      hidden: true
    },
    uploadedAt: {
      label: "上传时间",
      type: "datetime"
    },
    created_by: {
      hidden: true
    },
    modified_by: {
      hidden: true
    }
  },
  list_views: {
    all: {
      filter_scope: "space",
      columns: ["original.name", "metadata.owner_name", "uploadedAt", "original.size"]
    }
  },
  permission_set: {
    user: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    },
    admin: {
      allowCreate: false,
      allowDelete: false,
      allowEdit: false,
      allowRead: true,
      modifyAllRecords: false,
      viewAllRecords: true
    }
  },
  actions: {
    download: {
      label: "下载",
      visible: true,
      on: "record",
      todo: function (object_name, record_id) {
        var file, fileId, filename, length, ref, ref1, rev, url;
        file = this.record;
        fileId = record_id;

        if (fileId) {
          if (Meteor.isCordova) {
            url = Steedos.absoluteUrl("/api/files/files/" + fileId);
            filename = file != null ? (ref = file.original) != null ? ref.name : void 0 : void 0;
            rev = fileId;
            length = file != null ? (ref1 = file.original) != null ? ref1.size : void 0 : void 0;
            return Steedos.cordovaDownload(url, filename, rev, length);
          } else {
            return window.location = Steedos.absoluteUrl("/api/files/files/" + fileId + "?download=true");
          }
        }
      }
    }
  }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stores.coffee":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/stores.coffee                                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var stores;
stores = ['avatars', 'audios', 'images', 'videos', 'files'];

_.each(stores, function (store_name) {
  file_store;
  var file_store, ref, ref1;

  if (((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
    if (Meteor.isClient) {
      file_store = new FS.Store.OSS(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.OSS(store_name, {
        region: Meteor.settings.cfs.aliyun.region,
        internal: Meteor.settings.cfs.aliyun.internal,
        bucket: Meteor.settings.cfs.aliyun.bucket,
        folder: Meteor.settings.cfs.aliyun.folder,
        accessKeyId: Meteor.settings.cfs.aliyun.accessKeyId,
        secretAccessKey: Meteor.settings.cfs.aliyun.secretAccessKey
      });
    }
  } else if (((ref1 = Meteor.settings["public"].cfs) != null ? ref1.store : void 0) === "S3") {
    if (Meteor.isClient) {
      file_store = new FS.Store.S3(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.S3(store_name, {
        region: Meteor.settings.cfs.aws.region,
        bucket: Meteor.settings.cfs.aws.bucket,
        folder: Meteor.settings.cfs.aws.folder,
        accessKeyId: Meteor.settings.cfs.aws.accessKeyId,
        secretAccessKey: Meteor.settings.cfs.aws.secretAccessKey
      });
    }
  } else {
    if (Meteor.isClient) {
      file_store = new FS.Store.FileSystem(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.FileSystem(store_name, {
        path: require('path').join(Creator.steedosStorageDir, "files/" + store_name),
        fileKeyMaker: function (fileObj) {
          var absolutePath, filename, filenameInStore, mkdirp, month, now, path, pathname, store, year;
          store = fileObj && fileObj._getInfo(store_name);

          if (store && store.key) {
            return store.key;
          }

          filename = fileObj.name();
          filenameInStore = fileObj.name({
            store: store_name
          });
          now = new Date();
          year = now.getFullYear();
          month = now.getMonth() + 1;
          path = require('path');
          mkdirp = require('mkdirp');
          pathname = path.join(Creator.steedosStorageDir, "files/" + store_name + "/" + year + '/' + month);
          absolutePath = path.resolve(pathname);
          mkdirp.sync(absolutePath);
          return year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename);
        }
      });
    }
  }

  if (store_name === 'audios') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['audio/*']
        }
      }
    });
  } else if (store_name === 'images' || store_name === 'avatars') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['image/*']
        }
      }
    });
  } else if (store_name === 'videos') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['video/*']
        }
      }
    });
  } else {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store]
    });
  }

  cfs[store_name].allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    download: function () {
      return true;
    }
  });

  if (store_name === 'avatars') {
    db[store_name] = cfs[store_name];
    db[store_name].files.before.insert(function (userId, doc) {
      return doc.userId = userId;
    });
  }

  if (store_name === 'files') {
    return db["cfs." + store_name + ".filerecord"] = cfs[store_name].files;
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee",
    ".i18n.json"
  ]
});

require("/node_modules/meteor/steedos:objects-core/i18n.coffee");
require("/node_modules/meteor/steedos:objects-core/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:objects-core/i18n/zh-CN.i18n.json.js");
require("/node_modules/meteor/steedos:objects-core/cfs/cfs.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/cfs_fix.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/cfs_files.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/stores.coffee");

/* Exports */
Package._define("steedos:objects-core");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects-core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maWxlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9zdG9yZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jZnMvc3RvcmVzLmNvZmZlZSJdLCJuYW1lcyI6WyJpMThuIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsImdldEJyb3dzZXJMb2NhbGUiLCJzcHJpbnRmIiwidCIsImtleSIsInBhcmFtZXRlcnMiLCJsb2NhbGUiLCJ0cmFuc2xhdG9yIiwiY3JlYXRlVHJhbnNsYXRvciIsIl9fIiwiY29udGV4dCIsIl8iLCJpc09iamVjdCIsInRyIiwidHJsIiwic2V0T3B0aW9ucyIsInB1cmlmeSIsImRlZmF1bHRMb2NhbGUiLCJUQVBpMThuIiwiX19vcmlnaW5hbCIsIm9wdGlvbnMiLCJ0cmFuc2xhdGVkIiwiX2dldExhbmd1YWdlRmlsZVBhdGgiLCJsYW5nX3RhZyIsInBhdGgiLCJjb25mIiwiY2RuX3BhdGgiLCJpMThuX2ZpbGVzX3JvdXRlIiwicmVwbGFjZSIsIk1ldGVvciIsImFic29sdXRlVXJsIiwiaXNDbGllbnQiLCJsIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckxhbmd1YWdlIiwibGFuZ3VhZ2UiLCJpbmRleE9mIiwiU2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwicHJlZml4Iiwic2VsZiIsImVhY2giLCJfc2NoZW1hIiwidmFsdWUiLCJsYWJlbCIsIlRlbXBsYXRlIiwicmVnaXN0ZXJIZWxwZXIiLCJhcmdzIiwic3RhcnR1cCIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiVDluIiwic2V0TG9jYWxlIiwibW9tZW50IiwidXNlciIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJUYWJ1bGFyIiwidGFibGVzQnlOYW1lIiwidGFibGUiLCJjb2x1bW5zIiwiY29sdW1uIiwiZGF0YSIsInNUaXRsZSIsImNvbGxlY3Rpb24iLCJfbmFtZSIsInplcm9SZWNvcmRzIiwiY2ZzIiwiRlMiLCJIVFRQIiwic2V0QmFzZVVybCIsImdldENvbnRlbnRUeXBlIiwiZmlsZW5hbWUiLCJfZXhwIiwic3BsaXQiLCJwb3AiLCJ0b0xvd2VyQ2FzZSIsIlN0b3JhZ2VBZGFwdGVyIiwib24iLCJzdG9yZU5hbWUiLCJlcnJvciIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsIkNyZWF0b3IiLCJPYmplY3RzIiwibmFtZSIsInRhYmxlX25hbWUiLCJpY29uIiwiZW5hYmxlX3NlYXJjaCIsImVuYWJsZV9hcGkiLCJoaWRkZW4iLCJmaWVsZHMiLCJvcmlnaW5hbCIsInR5cGUiLCJibGFja2JveCIsIm9taXQiLCJtZXRhZGF0YSIsInJlZmVyZW5jZV90byIsInVwbG9hZGVkQXQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsaXN0X3ZpZXdzIiwiYWxsIiwiZmlsdGVyX3Njb3BlIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd0NyZWF0ZSIsImFsbG93RGVsZXRlIiwiYWxsb3dFZGl0IiwiYWxsb3dSZWFkIiwibW9kaWZ5QWxsUmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiYWRtaW4iLCJhY3Rpb25zIiwiZG93bmxvYWQiLCJ2aXNpYmxlIiwidG9kbyIsIm9iamVjdF9uYW1lIiwicmVjb3JkX2lkIiwiZmlsZSIsImZpbGVJZCIsImxlbmd0aCIsInJlZiIsInJlZjEiLCJyZXYiLCJ1cmwiLCJyZWNvcmQiLCJpc0NvcmRvdmEiLCJTdGVlZG9zIiwic2l6ZSIsImNvcmRvdmFEb3dubG9hZCIsImxvY2F0aW9uIiwic3RvcmVzIiwic3RvcmVfbmFtZSIsImZpbGVfc3RvcmUiLCJzZXR0aW5ncyIsInN0b3JlIiwiU3RvcmUiLCJPU1MiLCJpc1NlcnZlciIsInJlZ2lvbiIsImFsaXl1biIsImludGVybmFsIiwiYnVja2V0IiwiZm9sZGVyIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJTMyIsImF3cyIsIkZpbGVTeXN0ZW0iLCJqb2luIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJmaWxlS2V5TWFrZXIiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlbmFtZUluU3RvcmUiLCJta2RpcnAiLCJtb250aCIsIm5vdyIsInBhdGhuYW1lIiwieWVhciIsIl9nZXRJbmZvIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxhQUFBO0FBQUFDLE9BQUFDLEtBQUEsQ0FBQUMsUUFBQTtBQUFBLHVCQUFBQyxDQUFBO0FBQUFKLFdBQUFJLENBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUMsZ0JBQUEsRUFB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QSxJQUFJRCxNQUFKLEdBQWFBLE1DU25CO0FEVkU7QUNZTDs7QURUQyxNQUFHNUMsZUFBYyxPQUFqQjtBQ1dBLFdEVkl5QyxHQUFHLFNBQU96QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDbEUsSUFBSWtFLFVBQUosRUFBZ0IwQyxLQ1V6RDtBQUNEO0FEakhILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuc3ByaW50ZiA9IHJlcXVpcmUoJ3NwcmludGYtanMnKS5zcHJpbnRmO1xuQGkxOG4gPSBpMThuO1xuXG5AdCA9IChrZXksIHBhcmFtZXRlcnMsIGxvY2FsZSkgLT5cblx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXG5cdGlmIGxvY2FsZVxuXHRcdHRyYW5zbGF0b3IgPSBpMThuLmNyZWF0ZVRyYW5zbGF0b3IoJycsIGxvY2FsZSk7XG5cdGVsc2Vcblx0XHR0cmFuc2xhdG9yID0gaTE4bi5fXztcblxuXHRpZiBwYXJhbWV0ZXJzPy5jb250ZXh0XG5cdFx0a2V5ID0ga2V5ICsgXCJfXCIgKyBwYXJhbWV0ZXJzLmNvbnRleHQ7XG5cdFx0XHRcblx0aWYgcGFyYW1ldGVycz8gYW5kICEoXy5pc09iamVjdCBwYXJhbWV0ZXJzKVxuXHRcdCMg5YW85a656ICB5qC85byPIGtleeS4reWMheWQqyAlc++8jOWPquaUr+aMgeS4gOS4quWPguaVsOOAglxuXHRcdHJldHVybiBzcHJpbnRmKHRyYW5zbGF0b3Ioa2V5KSwgcGFyYW1ldGVycylcblxuXHRyZXR1cm4gdHJhbnNsYXRvcihrZXksIHBhcmFtZXRlcnMpXG5cbkB0ciA9IHRcblxuQHRybCA9IHRcblxuIyDph43lhpl0YXA6aTE4buWHveaVsO+8jOWQkeWQjuWFvOWuuVxuaTE4bi5zZXRPcHRpb25zXG5cdHB1cmlmeTogbnVsbFxuXHRkZWZhdWx0TG9jYWxlOiAnemgtQ04nXG5cbmlmIFRBUGkxOG4/XG5cdFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX19cblxuXHRUQVBpMThuLl9fID0gKGtleSwgb3B0aW9ucywgbG9jYWxlKS0+XG5cblx0XHR0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XHRcdFxuXHRcdGlmIHRyYW5zbGF0ZWQgIT0ga2V5XG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRlZFxuXG5cdFx0IyBpMThuIOe/u+ivkeS4jeWHuuadpe+8jOWwneivleeUqCB0YXA6aTE4biDnv7vor5Fcblx0XHRyZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsIGtleSwgb3B0aW9ucywgbG9jYWxlXG5cblx0VEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IChsYW5nX3RhZykgLT5cblxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlIC9cXC8kLywgXCJcIlxuXHRcdGlmIHBhdGhbMF0gPT0gXCIvXCJcblx0XHRcdHBhdGggPSBNZXRlb3IuYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxuXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXG5cdFx0ZWxzZVxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXG5cdFx0cmV0dXJuIGxvY2FsZVxuXG5cblx0U2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gKHByZWZpeCkgLT5cblx0XHRzZWxmID0gdGhpc1xuXHRcdF8uZWFjaChzZWxmLl9zY2hlbWEsICh2YWx1ZSwga2V5KSAtPlxuXHRcdFx0aWYgKCF2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiAhc2VsZi5fc2NoZW1hW2tleV0ubGFiZWxcblx0XHRcdFx0c2VsZi5fc2NoZW1hW2tleV0ubGFiZWwgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHQocHJlZml4ICsgXCJfXCIgKyBrZXkucmVwbGFjZSgvXFwuL2csXCJfXCIpKVxuXHRcdClcblxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdE1ldGVvci5zdGFydHVwIC0+XG5cblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG5cblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcblxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRUOW4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRUOW4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxuXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxuXHRcdFx0aWYgTWV0ZW9yLnVzZXIoKVxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIixNZXRlb3IudXNlcigpLmxvY2FsZSlcblxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxuXG5cdFx0XHQkLmV4dGVuZCB0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cyxcblx0XHRcdFx0bGFuZ3VhZ2U6XG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuXHRcdFx0XHRcdFwiZW1wdHlUYWJsZVwiOiAgICAgdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG5cdFx0XHRcdFx0XCJpbmZvRmlsdGVyZWRcIjogICB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcblx0XHRcdFx0XHRcImxlbmd0aE1lbnVcIjogICAgIHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG5cdFx0XHRcdFx0XCJzZWFyY2hcIjogICAgICAgICB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XG5cdFx0XHRcdFx0XHRcImZpcnN0XCI6ICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuXHRcdFx0XHRcdFx0XCJwcmV2aW91c1wiOiAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG5cdFx0XHRcdFx0XCJhcmlhXCI6XG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcblx0XHRcdFx0XHRcdFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cblx0XHRcdFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csXCJfXCIpKTtcblx0XHRcdFx0XHRpZiAhdGFibGUub3B0aW9ucy5sYW5ndWFnZVxuXHRcdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9XG5cdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpXG5cdFx0XHRcdFx0cmV0dXJuIFxuXG5cbiIsInZhciBnZXRCcm93c2VyTG9jYWxlLCBzcHJpbnRmO1xuXG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbnNwcmludGYgPSByZXF1aXJlKCdzcHJpbnRmLWpzJykuc3ByaW50ZjtcblxudGhpcy5pMThuID0gaTE4bjtcblxudGhpcy50ID0gZnVuY3Rpb24oa2V5LCBwYXJhbWV0ZXJzLCBsb2NhbGUpIHtcbiAgdmFyIHRyYW5zbGF0b3I7XG4gIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICBpZiAobG9jYWxlKSB7XG4gICAgdHJhbnNsYXRvciA9IGkxOG4uY3JlYXRlVHJhbnNsYXRvcignJywgbG9jYWxlKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFuc2xhdG9yID0gaTE4bi5fXztcbiAgfVxuICBpZiAocGFyYW1ldGVycyAhPSBudWxsID8gcGFyYW1ldGVycy5jb250ZXh0IDogdm9pZCAwKSB7XG4gICAga2V5ID0ga2V5ICsgXCJfXCIgKyBwYXJhbWV0ZXJzLmNvbnRleHQ7XG4gIH1cbiAgaWYgKChwYXJhbWV0ZXJzICE9IG51bGwpICYmICEoXy5pc09iamVjdChwYXJhbWV0ZXJzKSkpIHtcbiAgICByZXR1cm4gc3ByaW50Zih0cmFuc2xhdG9yKGtleSksIHBhcmFtZXRlcnMpO1xuICB9XG4gIHJldHVybiB0cmFuc2xhdG9yKGtleSwgcGFyYW1ldGVycyk7XG59O1xuXG50aGlzLnRyID0gdDtcblxudGhpcy50cmwgPSB0O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gTWV0ZW9yLmFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoICsgXCIvXCIgKyBsYW5nX3RhZyArIFwiLmpzb25cIjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBnZXRCcm93c2VyTG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGwsIGxvY2FsZTtcbiAgICBsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgIGlmIChsLmluZGV4T2YoXCJ6aFwiKSA+PSAwKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLWNuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZTtcbiAgfTtcbiAgU2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIF8uZWFjaChzZWxmLl9zY2hlbWEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxmLl9zY2hlbWFba2V5XS5sYWJlbCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fc2NoZW1hW2tleV0ubGFiZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdChwcmVmaXggKyBcIl9cIiArIGtleS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICB9KTtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gICAgfSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9PSBcImVuLXVzXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIH1cbiAgICAgICAgVDluLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIik7XG4gICAgICAgIHJldHVybiBtb21lbnQubG9jYWxlKFwiemgtY25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBUOW4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJlblwiKTtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoXCJlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIik7XG4gICAgICBpZiAoTWV0ZW9yLnVzZXIoKSkge1xuICAgICAgICBpZiAoTWV0ZW9yLnVzZXIoKS5sb2NhbGUpIHtcbiAgICAgICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaTE4bi5vbkNoYW5nZUxvY2FsZShmdW5jdGlvbihuZXdMb2NhbGUpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKFRhYnVsYXIudGFibGVzQnlOYW1lLCBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKHRhYmxlLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgaWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PT0gXCJfaWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csIFwiX1wiKSk7XG4gICAgICAgICAgaWYgKCF0YWJsZS5vcHRpb25zLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJAY2ZzID0ge31cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKVxuXG5cbiMg6YCa6L+H5paH5Lu25omp5bGV5ZCN6I635Y+W5paH5Lu2Y29udGVudFR5cGVcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xuIyDlj4LnhadzM+S4iuS8oOmZhOS7tuWQjueahGNvbnRlbnRUeXBlXG5jZnMuZ2V0Q29udGVudFR5cGUgPSAoZmlsZW5hbWUpIC0+XG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxuICAgIGlmICgnLicgKyBfZXhwID09ICcuYXUnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vYmFzaWMnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxuICAgICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJtcCcpIFxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJ6MicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcbiAgICAgIHJldHVybiAndGV4dC9jc3MnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmR0ZCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvYycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb3R4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5naWYnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5neicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmh0bWwnKSBcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qYXInKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXG4gICAgICByZXR1cm4gJ2ltYWdlL2pwZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanNwJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxuICAgICAgcmV0dXJuICdhdWRpby9taWRpJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcDMnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXBlZycpIFxuICAgICAgcmV0dXJuICd2aWRlby9tcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wZGYnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxuICAgICAgcmV0dXJuICdpbWFnZS9wbmcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBvdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHN4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxuICAgICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYW0nKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJ0ZicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2dtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3NnbWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNsZHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zdmcnKSBcbiAgICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50YXIuZ3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50Z3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3RpZmYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRzdicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50eHQnKSBcbiAgICAgIHJldHVybiAndGV4dC9wbGFpbidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bGFtJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXG4gICAgICByZXR1cm4gJ3RleHQveG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy56aXAnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xuICAgIGVsc2UgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBcblxuXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIilcbiAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSlcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKVxuICBjb25zb2xlLmVycm9yKGVycm9yKVxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKSIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG4iLCJDcmVhdG9yLk9iamVjdHNbXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXSA9IFxuXHRuYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0dGFibGVfbmFtZTogXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiXG5cdGxhYmVsOiBcIumZhOS7tueJiOacrFwiXG5cdGljb246IFwiZHJhZnRzXCJcblx0ZW5hYmxlX3NlYXJjaDogdHJ1ZVxuXHRlbmFibGVfYXBpOiB0cnVlXG5cdGhpZGRlbjogdHJ1ZVxuXHRmaWVsZHM6XG5cdFx0b3JpZ2luYWw6XG5cdFx0XHRsYWJlbDpcIuaWh+S7tlwiXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXG5cdFx0XHRibGFja2JveDogdHJ1ZVxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFwib3JpZ2luYWwubmFtZVwiOlxuXHRcdFx0bGFiZWw6XCLmlofku7blkI1cIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdCMgaXNfbmFtZTogdHJ1ZVxuXHRcdFwib3JpZ2luYWwuc2l6ZVwiOlxuXHRcdFx0bGFiZWw6XCLmlofku7blpKflsI9cIlxuXHRcdFx0dHlwZTogXCJudW1iZXJcIlxuXHRcdG1ldGFkYXRhOlxuXHRcdFx0bGFiZWw6XCLlsZ7mgKdcIlxuXHRcdFx0dHlwZTogXCJvYmplY3RcIlxuXHRcdFx0YmxhY2tib3g6IHRydWVcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcIm1ldGFkYXRhLm93bmVyXCI6XG5cdFx0XHRsYWJlbDpcIuS4iuS8oOiAhVwiXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXG5cdFx0XHRyZWZlcmVuY2VfdG86IFwidXNlcnNcIlxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFwibWV0YWRhdGEub3duZXJfbmFtZVwiOlxuXHRcdFx0bGFiZWw6XCLkuIrkvKDogIVcIlxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcblx0XHRcdG9taXQ6IHRydWVcblx0XHRcIm1ldGFkYXRhLnBhcmVudFwiOlxuXHRcdFx0bGFiZWw6XCLmiYDlsZ7mlofku7ZcIlxuXHRcdFx0dHlwZTogXCJtYXN0ZXJfZGV0YWlsXCJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJjbXNfZmlsZXNcIlxuXHRcdFx0aGlkZGVuOiB0cnVlXG5cdFx0dXBsb2FkZWRBdDogXG5cdFx0XHRsYWJlbDpcIuS4iuS8oOaXtumXtFwiXG5cdFx0XHR0eXBlOiBcImRhdGV0aW1lXCJcblx0XHRjcmVhdGVkX2J5OlxuXHRcdFx0aGlkZGVuOiB0cnVlXG5cdFx0bW9kaWZpZWRfYnk6XG5cdFx0XHRoaWRkZW46IHRydWVcblxuXHRsaXN0X3ZpZXdzOlxuXHRcdGFsbDpcblx0XHRcdGZpbHRlcl9zY29wZTogXCJzcGFjZVwiXG5cdFx0XHRjb2x1bW5zOiBbXCJvcmlnaW5hbC5uYW1lXCIsIFwibWV0YWRhdGEub3duZXJfbmFtZVwiLCBcInVwbG9hZGVkQXRcIiwgXCJvcmlnaW5hbC5zaXplXCJdXG5cdFxuXHRwZXJtaXNzaW9uX3NldDpcblx0XHR1c2VyOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIFxuXHRcdGFkbWluOlxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXG5cdFx0XHRhbGxvd0RlbGV0ZTogZmFsc2Vcblx0XHRcdGFsbG93RWRpdDogZmFsc2Vcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxuXHRcdFx0bW9kaWZ5QWxsUmVjb3JkczogZmFsc2Vcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIFxuXG5cdGFjdGlvbnM6XG5cdFx0ZG93bmxvYWQ6XG5cdFx0XHRsYWJlbDogXCLkuIvovb1cIlxuXHRcdFx0dmlzaWJsZTogdHJ1ZVxuXHRcdFx0b246IFwicmVjb3JkXCJcblx0XHRcdHRvZG86IChvYmplY3RfbmFtZSwgcmVjb3JkX2lkKS0+XG5cdFx0XHRcdGZpbGUgPSB0aGlzLnJlY29yZFxuXHRcdFx0XHRmaWxlSWQgPSByZWNvcmRfaWRcblx0XHRcdFx0aWYgZmlsZUlkXG5cdFx0XHRcdFx0aWYgTWV0ZW9yLmlzQ29yZG92YVxuXHRcdFx0XHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvZmlsZXMvZmlsZXMvI3tmaWxlSWR9XCIpXG5cdFx0XHRcdFx0XHRmaWxlbmFtZSA9IGZpbGU/Lm9yaWdpbmFsPy5uYW1lXG5cdFx0XHRcdFx0XHRyZXYgPSBmaWxlSWRcblx0XHRcdFx0XHRcdGxlbmd0aCA9IGZpbGU/Lm9yaWdpbmFsPy5zaXplXG5cdFx0XHRcdFx0XHRTdGVlZG9zLmNvcmRvdmFEb3dubG9hZCh1cmwsIGZpbGVuYW1lLCByZXYsIGxlbmd0aClcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy8je2ZpbGVJZH0/ZG93bmxvYWQ9dHJ1ZVwiKSIsIkNyZWF0b3IuT2JqZWN0c1tcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdID0ge1xuICBuYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIsXG4gIHRhYmxlX25hbWU6IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIixcbiAgbGFiZWw6IFwi6ZmE5Lu254mI5pysXCIsXG4gIGljb246IFwiZHJhZnRzXCIsXG4gIGVuYWJsZV9zZWFyY2g6IHRydWUsXG4gIGVuYWJsZV9hcGk6IHRydWUsXG4gIGhpZGRlbjogdHJ1ZSxcbiAgZmllbGRzOiB7XG4gICAgb3JpZ2luYWw6IHtcbiAgICAgIGxhYmVsOiBcIuaWh+S7tlwiLFxuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgXCJvcmlnaW5hbC5uYW1lXCI6IHtcbiAgICAgIGxhYmVsOiBcIuaWh+S7tuWQjVwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIFwib3JpZ2luYWwuc2l6ZVwiOiB7XG4gICAgICBsYWJlbDogXCLmlofku7blpKflsI9cIixcbiAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICB9LFxuICAgIG1ldGFkYXRhOiB7XG4gICAgICBsYWJlbDogXCLlsZ7mgKdcIixcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIFwibWV0YWRhdGEub3duZXJcIjoge1xuICAgICAgbGFiZWw6IFwi5LiK5Lyg6ICFXCIsXG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcInVzZXJzXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBcIm1ldGFkYXRhLm93bmVyX25hbWVcIjoge1xuICAgICAgbGFiZWw6IFwi5LiK5Lyg6ICFXCIsXG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIFwibWV0YWRhdGEucGFyZW50XCI6IHtcbiAgICAgIGxhYmVsOiBcIuaJgOWxnuaWh+S7tlwiLFxuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwiY21zX2ZpbGVzXCIsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIHVwbG9hZGVkQXQ6IHtcbiAgICAgIGxhYmVsOiBcIuS4iuS8oOaXtumXtFwiLFxuICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgfSxcbiAgICBjcmVhdGVkX2J5OiB7XG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIG1vZGlmaWVkX2J5OiB7XG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgY29sdW1uczogW1wib3JpZ2luYWwubmFtZVwiLCBcIm1ldGFkYXRhLm93bmVyX25hbWVcIiwgXCJ1cGxvYWRlZEF0XCIsIFwib3JpZ2luYWwuc2l6ZVwiXVxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICBhY3Rpb25zOiB7XG4gICAgZG93bmxvYWQ6IHtcbiAgICAgIGxhYmVsOiBcIuS4i+i9vVwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCkge1xuICAgICAgICB2YXIgZmlsZSwgZmlsZUlkLCBmaWxlbmFtZSwgbGVuZ3RoLCByZWYsIHJlZjEsIHJldiwgdXJsO1xuICAgICAgICBmaWxlID0gdGhpcy5yZWNvcmQ7XG4gICAgICAgIGZpbGVJZCA9IHJlY29yZF9pZDtcbiAgICAgICAgaWYgKGZpbGVJZCkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICAgICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy9cIiArIGZpbGVJZCk7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGUgIT0gbnVsbCA/IChyZWYgPSBmaWxlLm9yaWdpbmFsKSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXYgPSBmaWxlSWQ7XG4gICAgICAgICAgICBsZW5ndGggPSBmaWxlICE9IG51bGwgPyAocmVmMSA9IGZpbGUub3JpZ2luYWwpICE9IG51bGwgPyByZWYxLnNpemUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4gU3RlZWRvcy5jb3Jkb3ZhRG93bmxvYWQodXJsLCBmaWxlbmFtZSwgcmV2LCBsZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvZmlsZXMvZmlsZXMvXCIgKyBmaWxlSWQgKyBcIj9kb3dubG9hZD10cnVlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXG5cbl8uZWFjaCBzdG9yZXMsIChzdG9yZV9uYW1lKS0+XG4gICAgZmlsZV9zdG9yZVxuICAgIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIk9TU1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTIHN0b3JlX25hbWUsXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5yZWdpb25cbiAgICAgICAgICAgICAgICBpbnRlcm5hbDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uaW50ZXJuYWxcbiAgICAgICAgICAgICAgICBidWNrZXQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmJ1Y2tldFxuICAgICAgICAgICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uZm9sZGVyXG4gICAgICAgICAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmFjY2Vzc0tleUlkXG4gICAgICAgICAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcblxuICAgIGVsc2UgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiUzNcIlxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMgc3RvcmVfbmFtZSxcbiAgICAgICAgICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnJlZ2lvblxuICAgICAgICAgICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYnVja2V0XG4gICAgICAgICAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5mb2xkZXJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYWNjZXNzS2V5SWRcbiAgICAgICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnNlY3JldEFjY2Vzc0tleVxuICAgIGVsc2VcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfVwiKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZUtleU1ha2VyOiAoZmlsZU9iaiktPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiBhbmQgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXlcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyB5ZWFyICsgJy8nICsgbW9udGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFNldCBhYnNvbHV0ZSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aClcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSlcblxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdWRpb3MnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ10gIyBhbGxvdyBvbmx5IGF1ZGlvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ10gIyBhbGxvdyBvbmx5IGltYWdlcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICd2aWRlb3MnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ10gIyBhbGxvdyBvbmx5IHZpZGVvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZVxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cblxuICAgIGNmc1tzdG9yZV9uYW1lXS5hbGxvd1xuICAgICAgICBpbnNlcnQ6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB1cGRhdGU6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICByZW1vdmU6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBkb3dubG9hZDogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xuICAgICAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXVxuICAgICAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cbiAgICAgICAgICAgIGRvYy51c2VySWQgPSB1c2VySWRcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2ZpbGVzJ1xuICAgICAgICBkYltcImNmcy4je3N0b3JlX25hbWV9LmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXMiLCJ2YXIgc3RvcmVzO1xuXG5zdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXTtcblxuXy5lYWNoKHN0b3JlcywgZnVuY3Rpb24oc3RvcmVfbmFtZSkge1xuICBmaWxlX3N0b3JlO1xuICB2YXIgZmlsZV9zdG9yZSwgcmVmLCByZWYxO1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lLCB7XG4gICAgICAgIHJlZ2lvbjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4ucmVnaW9uLFxuICAgICAgICBpbnRlcm5hbDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uaW50ZXJuYWwsXG4gICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYnVja2V0LFxuICAgICAgICBmb2xkZXI6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmZvbGRlcixcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnNlY3JldEFjY2Vzc0tleVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCgocmVmMSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYxLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTM1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lLCB7XG4gICAgICAgIHJlZ2lvbjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MucmVnaW9uLFxuICAgICAgICBidWNrZXQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmJ1Y2tldCxcbiAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5mb2xkZXIsXG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5zZWNyZXRBY2Nlc3NLZXlcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lKSxcbiAgICAgICAgZmlsZUtleU1ha2VyOiBmdW5jdGlvbihmaWxlT2JqKSB7XG4gICAgICAgICAgdmFyIGFic29sdXRlUGF0aCwgZmlsZW5hbWUsIGZpbGVuYW1lSW5TdG9yZSwgbWtkaXJwLCBtb250aCwgbm93LCBwYXRoLCBwYXRobmFtZSwgc3RvcmUsIHllYXI7XG4gICAgICAgICAgc3RvcmUgPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSk7XG4gICAgICAgICAgaWYgKHN0b3JlICYmIHN0b3JlLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xuICAgICAgICAgICAgc3RvcmU6IHN0b3JlX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbiAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCAoXCJmaWxlcy9cIiArIHN0b3JlX25hbWUgKyBcIi9cIikgKyB5ZWFyICsgJy8nICsgbW9udGgpO1xuICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSk7XG4gICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKTtcbiAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F1ZGlvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ3ZpZGVvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXG4gICAgfSk7XG4gIH1cbiAgY2ZzW3N0b3JlX25hbWVdLmFsbG93KHtcbiAgICBpbnNlcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkb3dubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV07XG4gICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydChmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgcmV0dXJuIGRvYy51c2VySWQgPSB1c2VySWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdmaWxlcycpIHtcbiAgICByZXR1cm4gZGJbXCJjZnMuXCIgKyBzdG9yZV9uYW1lICsgXCIuZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcztcbiAgfVxufSk7XG4iXX0=
