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
var absoluteUrl, getBrowserLocale, sprintf;
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

absoluteUrl = function (url) {
  var e, root_url;

  if (url) {
    url = url.replace(/^\//, "");
  }

  if (Meteor.isCordova) {
    return Meteor.absoluteUrl(url);
  } else {
    if (Meteor.isClient) {
      try {
        root_url = new URL(Meteor.absoluteUrl());

        if (url) {
          return root_url.pathname + url;
        } else {
          return root_url.pathname;
        }
      } catch (error) {
        e = error;
        return Meteor.absoluteUrl(url);
      }
    } else {
      return Meteor.absoluteUrl(url);
    }
  }
};

i18n.setOptions({
  purify: null,
  defaultLocale: 'zh-CN',
  hostUrl: absoluteUrl()
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
      path = absoluteUrl().replace(/\/+$/, "") + path;
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

  SimpleSchema.prototype.i18n = function (prefix) {};

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
      return $.extend(true, $.fn.dataTable.defaults, {
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
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"users":"用户","users_steedos_id":"Steedos ID","users_name":"姓名","users_username":"用户名","users_email":"邮件","users_company":"公司","users_position":"职务","users_mobile":"手机","users_work_phone":"固定电话","users_locale":"语言","users_timezone":"时区","users_emails":"邮件","users_createdAt":"创建日期","users_email_notification":"接收邮件通知","apps":"应用","apps_space":"工作区","apps_name":"名称","apps_description":"描述","apps_url":"链接","apps_auth_name":"验证域名","apps_on_click":"链接脚本","apps_is_use_ie":"使用IE打开(需使用Steedos桌面客户端)","apps_is_use_iframe":"使用iframe打开","apps_is_new_window":"新窗口打开","apps_iconURL":"图标链接","apps_icon":"图标","apps_space_sort":"排序号","apps_mobile":"在移动应用中显示","apps_desktop":"在桌面应用中显示","apps_menu":"在左侧菜单显示","apps_sort_no":"排序号","apps_secret":"API 密钥","apps_internal":"App内置","apps_sort":"排序","apps_id":"ID","space":"工作区","spaces":"工作区","spaces_id":"ID","spaces_name":"名称","spaces_admins":"管理员","spaces_balance":"账户余额","spaces_owner":"所有者","spaces_is_paid":"已付费","spaces_owner_name()":"所有者","spaces_admins_name()":"管理员","spaces_apps_enabled":"启用应用","spaces_enable_register":"是否允许注册","spaces_max_user_count":"最大用户数","spaces_is_deleted":"已删除","spaces_created":"创建时间","spaces_created_by":"创建者","spaces_modified":"修改时间","spaces_modified_by":"修改者","spaces_modules":"已购买应用","spaces_prefs":"首选项","spaces_avatar":"Logo","organizations":"组织","organizations_id":"ID","organizations_fullname":"组织全名","organizations_users":"组织成员","organizations_name":"组织名称","organizations_parent":"上级组织","organizations_space_name()":"工作区","organizations_users_count()":"人数","organizations_children":"下级组织","organizations_created":"创建时间","organizations_created_by":"创建者","organizations_is_company":"公司级","organizations_modified":"修改时间","organizations_modified_by":"修改者","organizations_parents":"所有上级组织","organizations_space":"所属工作区","organizations_sort_no":"排序号","organizations_hidden":"隐藏","organizations_admins":"组织管理员","space_users":"人员","space_users_id":"ID","space_users_user":"用户ID","space_users_space_name()":"工作区","space_users_name":"姓名","space_users_email":"邮件","space_users_organization":"主部门","space_users_organizations":"所属部门","space_users_user_accepted":"有效","space_users_manager":"上级主管","space_users_organization_name()":"部门","space_users_space":"所属工作区","space_users_created":"创建时间","space_users_modified":"修改时间","space_users_created_by":"创建者","space_users_modified_by":"修改者","space_users_mobile":"手机","space_users_work_phone":"固定电话","space_users_company":"单位","space_users_position":"职务","space_users_managers":"所有上级主管","space_users_apps":"Apps","space_users_sort_no":"排序号","users_changelogs_id":"ID","users_changelogs_change_data":"修改日期","users_changelogs_operator":"操作者","users_changelogs_space":"工作区","users_changelogs_operation":"操作","users_changelogs_user_count":"用户数","users_changelogs_created":"创建时间","users_changelogs_user":"用户","users_changelogs_created_by":"创建者","organizations_error_space_required":"工作区必填","organizations_error_space_not_found":"未找到该工作区","organizations_error_space_admins_only":"您不是该工作区的管理员","organizations_error_users_readonly":"您无法修改部门成员","organizations_error_organizations_name_exists":"该部门名称已经存在","organizations_error_space_readonly":"无法修改工作区","organizations_error_parents_readonly":"无法修改上级部门","organizations_error_children_readonly":"无法修改下级部门","organizations_error_fullname_readonly":"无法修改部门全名","organizations_error_parent_is_self":"上级部门不能是自己","organizations_error_organization_has_children":"该部门已有下级部门","organizations_error_can_not_remove_root_organization":"您无法删除一级部门","organizations_error_organization_is_company":"根部门的名字无法修改","organizations_error_organization_name_required":"部门名称必填","organizations_error_organizations_parent_required":"请选择上级部门","organizations_error_space_admins_only_for_org_admins":"只有该工作区的管理员才能处理“组织管理员”","organizations_error_org_admins_only":"无权访问，只有组织机构管理员可以执行此操作。","organizations_error_organization_has_users":"部门内有人员,所以不能删除","organizations_error_can_not_set_checkbox_true":"不能设置管理员或拥有者为无效","space_users_error_space_required":"工作区必填","space_users_error_space_not_found":"未找到该工作区","space_users_error_space_admins_only":"您不是该工作区的管理员","space_users_error_user_required":"user必填","space_users_error_name_required":"用户名必填","space_users_error_space_users_exists":"该用户已经存在","space_users_error_email_readonly":"用户邮箱不允许修改","space_users_error_space_readonly":"无法修改工作区","space_users_error_user_readonly":"无法修改用户","space_users_error_remove_space_owner":"不能删除工作区拥有者","space_users_error_remove_space_admins":"不能删除工作区管理员","space_users_error_phone_already_existed":"该手机号已被其他用户注册","spaces_error_login_required":"login必填","spaces_error_space_owner_only":"您不是该工作区的所有者","spaces_error_space_admins_required":"必须为工作区选择一个管理员","spaces_error_space_readonly":"工作区无法修改","users_error_email_exists":"该邮件地址已存在","users_error_username_exists":"该用户名已存在","users_error_steedos_id_required":"登录账户为必填项","users_error_steedos_id_readonly":"登录账户无法修改","users_error_cloud_admin_required":"您无权删除该用户","users_email_create_account":"已为您创建华炎云账号","users_email_start_service":"请点击以下链接，填写相关信息。","users_email_verify_account":"您已注册华炎云账号,请点击以下链接进行验证。","users_email_verify_email":"验证您的登录邮箱","users_email_reset_password":"重新设置您的密码","users_email_reset_password_body":"您的验证码为：{$token_code}\r\n请在密码重置界面输入上面的验证码，或点击以下链接，重新设置您的登录密码。","users_email_hello":"您好","users_email_thanks":"谢谢！"});
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
require("/node_modules/meteor/steedos:objects-core/cfs/stores.coffee");

/* Exports */
Package._define("steedos:objects-core");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects-core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJhYnNvbHV0ZVVybCIsImdldEJyb3dzZXJMb2NhbGUiLCJzcHJpbnRmIiwidCIsImtleSIsInBhcmFtZXRlcnMiLCJsb2NhbGUiLCJ0cmFuc2xhdG9yIiwiY3JlYXRlVHJhbnNsYXRvciIsIl9fIiwiY29udGV4dCIsIl8iLCJpc09iamVjdCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwib3B0aW9ucyIsInRyYW5zbGF0ZWQiLCJfZ2V0TGFuZ3VhZ2VGaWxlUGF0aCIsImxhbmdfdGFnIiwicGF0aCIsImNvbmYiLCJjZG5fcGF0aCIsImkxOG5fZmlsZXNfcm91dGUiLCJsIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckxhbmd1YWdlIiwibGFuZ3VhZ2UiLCJpbmRleE9mIiwiU2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwicHJlZml4IiwiVGVtcGxhdGUiLCJyZWdpc3RlckhlbHBlciIsImFyZ3MiLCJzdGFydHVwIiwiU2Vzc2lvbiIsInNldCIsIlRyYWNrZXIiLCJhdXRvcnVuIiwiZ2V0Iiwic2V0TGFuZ3VhZ2UiLCJUOW4iLCJzZXRMb2NhbGUiLCJtb21lbnQiLCJ1c2VyIiwib25DaGFuZ2VMb2NhbGUiLCJuZXdMb2NhbGUiLCIkIiwiZXh0ZW5kIiwiZm4iLCJkYXRhVGFibGUiLCJkZWZhdWx0cyIsImNmcyIsIkZTIiwiSFRUUCIsInNldEJhc2VVcmwiLCJnZXRDb250ZW50VHlwZSIsImZpbGVuYW1lIiwiX2V4cCIsInNwbGl0IiwicG9wIiwidG9Mb3dlckNhc2UiLCJTdG9yYWdlQWRhcHRlciIsIm9uIiwic3RvcmVOYW1lIiwiZmlsZU9iaiIsImNvbnNvbGUiLCJDb2xsZWN0aW9uIiwic3RvcmVzIiwiZWFjaCIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwicmVnaW9uIiwiYWxpeXVuIiwiaW50ZXJuYWwiLCJidWNrZXQiLCJmb2xkZXIiLCJhY2Nlc3NLZXlJZCIsInNlY3JldEFjY2Vzc0tleSIsIlMzIiwiYXdzIiwiRmlsZVN5c3RlbSIsImpvaW4iLCJDcmVhdG9yIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJmaWxlS2V5TWFrZXIiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlbmFtZUluU3RvcmUiLCJta2RpcnAiLCJtb250aCIsIm5vdyIsInllYXIiLCJfZ2V0SW5mbyIsIm5hbWUiLCJEYXRlIiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInJlc29sdmUiLCJzeW5jIiwiY29sbGVjdGlvbk5hbWUiLCJfaWQiLCJmaWx0ZXIiLCJhbGxvdyIsImNvbnRlbnRUeXBlcyIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImRvd25sb2FkIiwiZGIiLCJmaWxlcyIsImJlZm9yZSIsInVzZXJJZCIsImRvYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsYUFBQTtBQUFBQyxPQUFBQyxLQUFBLENBQUFDLFFBQUE7QUFBQSx1QkFBQUMsQ0FBQTtBQUFBSixXQUFBSSxDQUFBO0FBQUE7QUFBQTtBQUFBLElBQUFDLFdBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsT0FBQTtBQUNBQSxVQUFVSixRQUFRLFlBQVIsRUFBc0JJLE9BQWhDO0FBQ0EsS0FBQ1AsSUFBRCxHQUFRQSxJQUFSOztBQUVBLEtBQUNRLENBQUQsR0FBSyxVQUFDQyxHQUFELEVBQU1DLFVBQU4sRUFBa0JDLE1BQWxCO0FBQ0osTUFBQUMsVUFBQTs7QUFBQSxNQUFHRCxXQUFVLE9BQWI7QUFDQ0EsYUFBUyxPQUFUO0FDTUM7O0FESkYsTUFBR0EsTUFBSDtBQUNDQyxpQkFBYVosS0FBS2EsZ0JBQUwsQ0FBc0IsRUFBdEIsRUFBMEJGLE1BQTFCLENBQWI7QUFERDtBQUdDQyxpQkFBYVosS0FBS2MsRUFBbEI7QUNNQzs7QURKRixNQUFBSixjQUFBLE9BQUdBLFdBQVlLLE9BQWYsR0FBZSxNQUFmO0FBQ0NOLFVBQU1BLE1BQU0sR0FBTixHQUFZQyxXQUFXSyxPQUE3QjtBQ01DOztBREpGLE1BQUdMLGNBQUEsUUFBZ0IsQ0FBRU0sRUFBRUMsUUFBRixDQUFXUCxVQUFYLENBQXJCO0FBRUMsV0FBT0gsUUFBUUssV0FBV0gsR0FBWCxDQUFSLEVBQXlCQyxVQUF6QixDQUFQO0FDS0M7O0FESEYsU0FBT0UsV0FBV0gsR0FBWCxFQUFnQkMsVUFBaEIsQ0FBUDtBQWhCSSxDQUFMOztBQWtCQSxLQUFDUSxFQUFELEdBQU1WLENBQU47QUFFQSxLQUFDVyxHQUFELEdBQU9YLENBQVA7O0FBQ0FILGNBQWMsVUFBQ2UsR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNPQzs7QURORixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT25CLFdBQVAsQ0FBbUJlLEdBQW5CLENBQVA7QUFERDtBQUdDLFFBQUdJLE9BQU9FLFFBQVY7QUFDQztBQUNDSixtQkFBVyxJQUFJSyxHQUFKLENBQVFILE9BQU9uQixXQUFQLEVBQVIsQ0FBWDs7QUFDQSxZQUFHZSxHQUFIO0FBQ0MsaUJBQU9FLFNBQVNNLFFBQVQsR0FBb0JSLEdBQTNCO0FBREQ7QUFHQyxpQkFBT0UsU0FBU00sUUFBaEI7QUFMRjtBQUFBLGVBQUFDLEtBQUE7QUFNTVIsWUFBQVEsS0FBQTtBQUNMLGVBQU9MLE9BQU9uQixXQUFQLENBQW1CZSxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ29CSSxhRFZISSxPQUFPbkIsV0FBUCxDQUFtQmUsR0FBbkIsQ0NVRztBRHZCTDtBQ3lCRTtBRDdCVyxDQUFkOztBQW1CQXBCLEtBQUs4QixVQUFMLENBQ0M7QUFBQUMsVUFBUSxJQUFSO0FBQ0FDLGlCQUFlLE9BRGY7QUFFQUMsV0FBUzVCO0FBRlQsQ0FERDs7QUFLQSxJQUFHLE9BQUE2QixPQUFBLG9CQUFBQSxZQUFBLElBQUg7QUFDQ0EsVUFBUUMsVUFBUixHQUFxQkQsUUFBUXBCLEVBQTdCOztBQUVBb0IsVUFBUXBCLEVBQVIsR0FBYSxVQUFDTCxHQUFELEVBQU0yQixPQUFOLEVBQWV6QixNQUFmO0FBRVosUUFBQTBCLFVBQUE7QUFBQUEsaUJBQWE3QixFQUFFQyxHQUFGLEVBQU8yQixPQUFQLEVBQWdCekIsTUFBaEIsQ0FBYjs7QUFDQSxRQUFHMEIsZUFBYzVCLEdBQWpCO0FBQ0MsYUFBTzRCLFVBQVA7QUNjRTs7QURYSCxXQUFPSCxRQUFRQyxVQUFSLENBQW1CMUIsR0FBbkIsRUFBd0IyQixPQUF4QixFQUFpQ3pCLE1BQWpDLENBQVA7QUFQWSxHQUFiOztBQVNBdUIsVUFBUUksb0JBQVIsR0FBK0IsVUFBQ0MsUUFBRDtBQUU5QixRQUFBQyxJQUFBO0FBQUFBLFdBQVUsS0FBQUMsSUFBQSxDQUFBQyxRQUFBLFdBQXNCLEtBQUVELElBQUYsQ0FBT0MsUUFBN0IsR0FBMkMsS0FBRUQsSUFBRixDQUFPRSxnQkFBNUQ7QUFDQUgsV0FBT0EsS0FBS2pCLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLENBQVA7O0FBQ0EsUUFBR2lCLEtBQUssQ0FBTCxNQUFXLEdBQWQ7QUFDQ0EsYUFBT25DLGNBQWNrQixPQUFkLENBQXNCLE1BQXRCLEVBQThCLEVBQTlCLElBQW9DaUIsSUFBM0M7QUNhRTs7QURYSCxXQUFVQSxPQUFLLEdBQUwsR0FBUUQsUUFBUixHQUFpQixPQUEzQjtBQVA4QixHQUEvQjtBQ3FCQTs7QURaRCxJQUFHZixPQUFPRSxRQUFWO0FBQ0NwQixxQkFBbUI7QUFDbEIsUUFBQXNDLENBQUEsRUFBQWpDLE1BQUE7QUFBQWlDLFFBQUlDLE9BQU9DLFNBQVAsQ0FBaUJDLFlBQWpCLElBQWlDRixPQUFPQyxTQUFQLENBQWlCRSxRQUFsRCxJQUE4RCxJQUFsRTs7QUFDQSxRQUFHSixFQUFFSyxPQUFGLENBQVUsSUFBVixLQUFrQixDQUFyQjtBQUNDdEMsZUFBUyxPQUFUO0FBREQ7QUFHQ0EsZUFBUyxPQUFUO0FDZ0JFOztBRGZILFdBQU9BLE1BQVA7QUFOa0IsR0FBbkI7O0FBVUF1QyxlQUFhQyxTQUFiLENBQXVCbkQsSUFBdkIsR0FBOEIsVUFBQ29ELE1BQUQsSUFBOUI7O0FBV0FDLFdBQVNDLGNBQVQsQ0FBd0IsR0FBeEIsRUFBNkIsVUFBQzdDLEdBQUQsRUFBTThDLElBQU47QUFDNUIsV0FBT3JCLFFBQVFwQixFQUFSLENBQVdMLEdBQVgsRUFBZ0I4QyxJQUFoQixDQUFQO0FBREQ7QUFHQS9CLFNBQU9nQyxPQUFQLENBQWU7QUFFZEgsYUFBU0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QixVQUFDN0MsR0FBRCxFQUFNOEMsSUFBTjtBQUM1QixhQUFPckIsUUFBUXBCLEVBQVIsQ0FBV0wsR0FBWCxFQUFnQjhDLElBQWhCLENBQVA7QUFERDtBQUdBRSxZQUFRQyxHQUFSLENBQVksZ0JBQVosRUFBOEJwRCxrQkFBOUI7QUFFQXFELFlBQVFDLE9BQVIsQ0FBZ0I7QUFDZixVQUFHSCxRQUFRSSxHQUFSLENBQVksZ0JBQVosTUFBaUMsT0FBcEM7QUFDQyxZQUFHLE9BQUEzQixPQUFBLG9CQUFBQSxZQUFBLElBQUg7QUFDQ0Esa0JBQVE0QixXQUFSLENBQW9CLE9BQXBCO0FDR0k7O0FERkxDLFlBQUlELFdBQUosQ0FBZ0IsT0FBaEI7QUFDQTlELGFBQUtnRSxTQUFMLENBQWUsT0FBZjtBQ0lJLGVESEpDLE9BQU90RCxNQUFQLENBQWMsT0FBZCxDQ0dJO0FEUkw7QUFPQyxZQUFHLE9BQUF1QixPQUFBLG9CQUFBQSxZQUFBLElBQUg7QUFDQ0Esa0JBQVE0QixXQUFSLENBQW9CLElBQXBCO0FDSUk7O0FESExDLFlBQUlELFdBQUosQ0FBZ0IsSUFBaEI7QUFDQTlELGFBQUtnRSxTQUFMLENBQWUsSUFBZjtBQ0tJLGVESkpDLE9BQU90RCxNQUFQLENBQWMsSUFBZCxDQ0lJO0FBQ0Q7QURqQkw7QUFjQWdELFlBQVFDLE9BQVIsQ0FBZ0I7QUFDZkgsY0FBUUMsR0FBUixDQUFZLGdCQUFaLEVBQThCLE9BQTlCOztBQUNBLFVBQUdsQyxPQUFPMEMsSUFBUCxFQUFIO0FBQ0MsWUFBRzFDLE9BQU8wQyxJQUFQLEdBQWN2RCxNQUFqQjtBQ01NLGlCRExMOEMsUUFBUUMsR0FBUixDQUFZLGdCQUFaLEVBQTZCbEMsT0FBTzBDLElBQVAsR0FBY3ZELE1BQTNDLENDS0s7QURQUDtBQ1NJO0FEWEw7QUNhRSxXRFBGWCxLQUFLbUUsY0FBTCxDQUFvQixVQUFDQyxTQUFEO0FDUWhCLGFETkhDLEVBQUVDLE1BQUYsQ0FBUyxJQUFULEVBQWVELEVBQUVFLEVBQUYsQ0FBS0MsU0FBTCxDQUFlQyxRQUE5QixFQUNDO0FBQUF6QixrQkFDQztBQUFBLHFCQUFrQnhDLEVBQUUsb0JBQUYsQ0FBbEI7QUFDQSx3QkFBa0JBLEVBQUUsdUJBQUYsQ0FEbEI7QUFFQSxrQkFBa0JBLEVBQUUsaUJBQUYsQ0FGbEI7QUFHQSx1QkFBa0JBLEVBQUUsc0JBQUYsQ0FIbEI7QUFJQSwwQkFBa0JBLEVBQUUseUJBQUYsQ0FKbEI7QUFLQSx5QkFBa0JBLEVBQUUsd0JBQUYsQ0FMbEI7QUFNQSx1QkFBa0JBLEVBQUUsc0JBQUYsQ0FObEI7QUFPQSx3QkFBa0JBLEVBQUUsdUJBQUYsQ0FQbEI7QUFRQSw0QkFBa0JBLEVBQUUsMkJBQUYsQ0FSbEI7QUFTQSx3QkFBa0JBLEVBQUUsdUJBQUYsQ0FUbEI7QUFVQSxvQkFBa0JBLEVBQUUsbUJBQUYsQ0FWbEI7QUFXQSx5QkFBa0JBLEVBQUUsd0JBQUYsQ0FYbEI7QUFZQSxzQkFDQztBQUFBLHFCQUFjQSxFQUFFLDJCQUFGLENBQWQ7QUFDQSxvQkFBY0EsRUFBRSwwQkFBRixDQURkO0FBRUEsb0JBQWNBLEVBQUUsMEJBQUYsQ0FGZDtBQUdBLHdCQUFjQSxFQUFFLDhCQUFGO0FBSGQsV0FiRDtBQWlCQSxrQkFDQztBQUFBLDZCQUFrQkEsRUFBRSwrQkFBRixDQUFsQjtBQUNBLDhCQUFrQkEsRUFBRSxnQ0FBRjtBQURsQjtBQWxCRDtBQURELE9BREQsQ0NNRztBRFJKLE1DT0U7QURsQ0g7QUMrREEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzlKRCxLQUFDa0UsR0FBRCxHQUFPLEVBQVA7QUFFQWxELE9BQU9nQyxPQUFQLENBQWU7QUNDYixTREFBbUIsR0FBR0MsSUFBSCxDQUFRQyxVQUFSLENBQW1CLE1BQW5CLENDQUE7QURERjs7QUFPQUgsSUFBSUksY0FBSixHQUFxQixVQUFDQyxRQUFEO0FBQ2pCLE1BQUFDLElBQUE7O0FBQUFBLFNBQU9ELFNBQVNFLEtBQVQsQ0FBZSxHQUFmLEVBQW9CQyxHQUFwQixHQUEwQkMsV0FBMUIsRUFBUDs7QUFDQSxNQUFJLE1BQU1ILElBQU4sS0FBYyxLQUFsQjtBQUNFLFdBQU8sYUFBUDtBQURGLFNBRUssSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLGlCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sV0FBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLHFCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sVUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sb0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTyxvQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxLQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFdBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLEtBQWxCO0FBQ0gsV0FBTyxvQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sV0FBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLDRCQUFQO0FBREcsU0FFQSxJQUFLLE1BQU1BLElBQU4sS0FBYyxNQUFmLElBQTJCLE1BQU1BLElBQU4sS0FBYyxPQUE3QztBQUNILFdBQU8sWUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsS0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTyxZQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sWUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLFlBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxpQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLGlCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxLQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxXQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLCtCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sK0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLEtBQWxCO0FBQ0gsV0FBTyx3QkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsS0FBbEI7QUFDSCxXQUFPLGlCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxLQUFsQjtBQUNILFdBQU8sc0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxzQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sVUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLFdBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyx1QkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sZUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLCtCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxTQUFsQjtBQUNILFdBQU8sb0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLFlBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywyQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFlBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxhQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFVBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxpQkFBUDtBQURHO0FBR0gsV0FBTywwQkFBUDtBQ0RIO0FEOUdrQixDQUFyQixDOzs7Ozs7Ozs7Ozs7QUVUQUwsR0FBR1MsY0FBSCxDQUFrQmpDLFNBQWxCLENBQTRCa0MsRUFBNUIsQ0FBK0IsT0FBL0IsRUFBd0MsVUFBQ0MsU0FBRCxFQUFZekQsS0FBWixFQUFtQjBELE9BQW5CO0FBQ3RDQyxVQUFRM0QsS0FBUixDQUFjLDhCQUFkO0FBQ0EyRCxVQUFRM0QsS0FBUixDQUFjQSxLQUFkO0FBQ0EyRCxVQUFRM0QsS0FBUixDQUFjMEQsT0FBZDtBQ0NBLFNEQUFDLFFBQVEzRCxLQUFSLENBQWN5RCxTQUFkLENDQUE7QURKRjtBQU1BWCxHQUFHYyxVQUFILENBQWN0QyxTQUFkLENBQXdCa0MsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQ3hELEtBQUQsRUFBUTBELE9BQVIsRUFBaUJELFNBQWpCO0FBQ2xDRSxVQUFRM0QsS0FBUixDQUFjLDBCQUFkO0FBQ0EyRCxVQUFRM0QsS0FBUixDQUFjQSxLQUFkO0FBQ0EyRCxVQUFRM0QsS0FBUixDQUFjMEQsT0FBZDtBQ0VBLFNEREFDLFFBQVEzRCxLQUFSLENBQWN5RCxTQUFkLENDQ0E7QURMRixHOzs7Ozs7Ozs7Ozs7QUVOQSxJQUFBSSxNQUFBO0FBQUFBLFNBQVMsQ0FBQyxTQUFELEVBQVksUUFBWixFQUFzQixRQUF0QixFQUFnQyxRQUFoQyxFQUEwQyxPQUExQyxDQUFUOztBQUVBMUUsRUFBRTJFLElBQUYsQ0FBT0QsTUFBUCxFQUFlLFVBQUNFLFVBQUQ7QUFDWEM7QUFBQSxNQUFBQSxVQUFBLEVBQUFDLEdBQUEsRUFBQUMsSUFBQTs7QUFDQSxRQUFBRCxNQUFBdEUsT0FBQXdFLFFBQUEsV0FBQXRCLEdBQUEsWUFBQW9CLElBQStCRyxLQUEvQixHQUErQixNQUEvQixNQUF3QyxLQUF4QztBQUNJLFFBQUd6RSxPQUFPRSxRQUFWO0FBQ0ltRSxtQkFBYSxJQUFJbEIsR0FBR3VCLEtBQUgsQ0FBU0MsR0FBYixDQUFpQlAsVUFBakIsQ0FBYjtBQURKLFdBRUssSUFBR3BFLE9BQU80RSxRQUFWO0FBQ0RQLG1CQUFhLElBQUlsQixHQUFHdUIsS0FBSCxDQUFTQyxHQUFiLENBQWlCUCxVQUFqQixFQUNUO0FBQUFTLGdCQUFRN0UsT0FBT3dFLFFBQVAsQ0FBZ0J0QixHQUFoQixDQUFvQjRCLE1BQXBCLENBQTJCRCxNQUFuQztBQUNBRSxrQkFBVS9FLE9BQU93RSxRQUFQLENBQWdCdEIsR0FBaEIsQ0FBb0I0QixNQUFwQixDQUEyQkMsUUFEckM7QUFFQUMsZ0JBQVFoRixPQUFPd0UsUUFBUCxDQUFnQnRCLEdBQWhCLENBQW9CNEIsTUFBcEIsQ0FBMkJFLE1BRm5DO0FBR0FDLGdCQUFRakYsT0FBT3dFLFFBQVAsQ0FBZ0J0QixHQUFoQixDQUFvQjRCLE1BQXBCLENBQTJCRyxNQUhuQztBQUlBQyxxQkFBYWxGLE9BQU93RSxRQUFQLENBQWdCdEIsR0FBaEIsQ0FBb0I0QixNQUFwQixDQUEyQkksV0FKeEM7QUFLQUMseUJBQWlCbkYsT0FBT3dFLFFBQVAsQ0FBZ0J0QixHQUFoQixDQUFvQjRCLE1BQXBCLENBQTJCSztBQUw1QyxPQURTLENBQWI7QUFKUjtBQUFBLFNBWUssTUFBQVosT0FBQXZFLE9BQUF3RSxRQUFBLFdBQUF0QixHQUFBLFlBQUFxQixLQUErQkUsS0FBL0IsR0FBK0IsTUFBL0IsTUFBd0MsSUFBeEM7QUFDRCxRQUFHekUsT0FBT0UsUUFBVjtBQUNJbUUsbUJBQWEsSUFBSWxCLEdBQUd1QixLQUFILENBQVNVLEVBQWIsQ0FBZ0JoQixVQUFoQixDQUFiO0FBREosV0FFSyxJQUFHcEUsT0FBTzRFLFFBQVY7QUFDRFAsbUJBQWEsSUFBSWxCLEdBQUd1QixLQUFILENBQVNVLEVBQWIsQ0FBZ0JoQixVQUFoQixFQUNUO0FBQUFTLGdCQUFRN0UsT0FBT3dFLFFBQVAsQ0FBZ0J0QixHQUFoQixDQUFvQm1DLEdBQXBCLENBQXdCUixNQUFoQztBQUNBRyxnQkFBUWhGLE9BQU93RSxRQUFQLENBQWdCdEIsR0FBaEIsQ0FBb0JtQyxHQUFwQixDQUF3QkwsTUFEaEM7QUFFQUMsZ0JBQVFqRixPQUFPd0UsUUFBUCxDQUFnQnRCLEdBQWhCLENBQW9CbUMsR0FBcEIsQ0FBd0JKLE1BRmhDO0FBR0FDLHFCQUFhbEYsT0FBT3dFLFFBQVAsQ0FBZ0J0QixHQUFoQixDQUFvQm1DLEdBQXBCLENBQXdCSCxXQUhyQztBQUlBQyx5QkFBaUJuRixPQUFPd0UsUUFBUCxDQUFnQnRCLEdBQWhCLENBQW9CbUMsR0FBcEIsQ0FBd0JGO0FBSnpDLE9BRFMsQ0FBYjtBQUpIO0FBQUE7QUFXRCxRQUFHbkYsT0FBT0UsUUFBVjtBQUNJbUUsbUJBQWEsSUFBSWxCLEdBQUd1QixLQUFILENBQVNZLFVBQWIsQ0FBd0JsQixVQUF4QixDQUFiO0FBREosV0FFSyxJQUFHcEUsT0FBTzRFLFFBQVY7QUFDRFAsbUJBQWEsSUFBSWxCLEdBQUd1QixLQUFILENBQVNZLFVBQWIsQ0FBd0JsQixVQUF4QixFQUFvQztBQUN6Q3BELGNBQU1yQyxRQUFRLE1BQVIsRUFBZ0I0RyxJQUFoQixDQUFxQkMsUUFBUUMsaUJBQTdCLEVBQWdELFdBQVNyQixVQUF6RCxDQURtQztBQUV6Q3NCLHNCQUFjLFVBQUMzQixPQUFEO0FBRVYsY0FBQTRCLFlBQUEsRUFBQXBDLFFBQUEsRUFBQXFDLGVBQUEsRUFBQUMsTUFBQSxFQUFBQyxLQUFBLEVBQUFDLEdBQUEsRUFBQS9FLElBQUEsRUFBQVosUUFBQSxFQUFBcUUsS0FBQSxFQUFBdUIsSUFBQTtBQUFBdkIsa0JBQVFWLFdBQVlBLFFBQVFrQyxRQUFSLENBQWlCN0IsVUFBakIsQ0FBcEI7O0FBRUEsY0FBR0ssU0FBVUEsTUFBTXhGLEdBQW5CO0FBQ0ksbUJBQU93RixNQUFNeEYsR0FBYjtBQ01qQjs7QURGYXNFLHFCQUFXUSxRQUFRbUMsSUFBUixFQUFYO0FBQ0FOLDRCQUFrQjdCLFFBQVFtQyxJQUFSLENBQWE7QUFBQ3pCLG1CQUFPTDtBQUFSLFdBQWIsQ0FBbEI7QUFFQTJCLGdCQUFNLElBQUlJLElBQUosRUFBTjtBQUNBSCxpQkFBT0QsSUFBSUssV0FBSixFQUFQO0FBQ0FOLGtCQUFRQyxJQUFJTSxRQUFKLEtBQWlCLENBQXpCO0FBQ0FyRixpQkFBT3JDLFFBQVEsTUFBUixDQUFQO0FBQ0FrSCxtQkFBU2xILFFBQVEsUUFBUixDQUFUO0FBQ0F5QixxQkFBV1ksS0FBS3VFLElBQUwsQ0FBVUMsUUFBUUMsaUJBQWxCLEVBQXFDLFdBQVNyQixVQUFULEdBQW9CLEdBQXBCLEdBQXlCNEIsSUFBekIsR0FBZ0MsR0FBaEMsR0FBc0NGLEtBQTNFLENBQVg7QUFFQUgseUJBQWUzRSxLQUFLc0YsT0FBTCxDQUFhbEcsUUFBYixDQUFmO0FBRUF5RixpQkFBT1UsSUFBUCxDQUFZWixZQUFaO0FBR0EsaUJBQU9LLE9BQU8sR0FBUCxHQUFhRixLQUFiLEdBQXFCLEdBQXJCLEdBQTJCL0IsUUFBUXlDLGNBQW5DLEdBQW9ELEdBQXBELEdBQTBEekMsUUFBUTBDLEdBQWxFLEdBQXdFLEdBQXhFLElBQStFYixtQkFBbUJyQyxRQUFsRyxDQUFQO0FBMUJxQztBQUFBLE9BQXBDLENBQWI7QUFkSDtBQzRDTjs7QURBQyxNQUFHYSxlQUFjLFFBQWpCO0FBQ0lsQixRQUFJa0IsVUFBSixJQUFrQixJQUFJakIsR0FBR2MsVUFBUCxDQUFrQkcsVUFBbEIsRUFDZDtBQUFBRixjQUFRLENBQUNHLFVBQUQsQ0FBUjtBQUNBcUMsY0FBUTtBQUNKQyxlQUFPO0FBQ0hDLHdCQUFjLENBQUMsU0FBRDtBQURYO0FBREg7QUFEUixLQURjLENBQWxCO0FBREosU0FRSyxJQUFHeEMsZUFBYyxRQUFkLElBQTBCQSxlQUFjLFNBQTNDO0FBQ0RsQixRQUFJa0IsVUFBSixJQUFrQixJQUFJakIsR0FBR2MsVUFBUCxDQUFrQkcsVUFBbEIsRUFDZDtBQUFBRixjQUFRLENBQUNHLFVBQUQsQ0FBUjtBQUNBcUMsY0FBUTtBQUNKQyxlQUFPO0FBQ0hDLHdCQUFjLENBQUMsU0FBRDtBQURYO0FBREg7QUFEUixLQURjLENBQWxCO0FBREMsU0FRQSxJQUFHeEMsZUFBYyxRQUFqQjtBQUNEbEIsUUFBSWtCLFVBQUosSUFBa0IsSUFBSWpCLEdBQUdjLFVBQVAsQ0FBa0JHLFVBQWxCLEVBQ2Q7QUFBQUYsY0FBUSxDQUFDRyxVQUFELENBQVI7QUFDQXFDLGNBQVE7QUFDSkMsZUFBTztBQUNIQyx3QkFBYyxDQUFDLFNBQUQ7QUFEWDtBQURIO0FBRFIsS0FEYyxDQUFsQjtBQURDO0FBU0QxRCxRQUFJa0IsVUFBSixJQUFrQixJQUFJakIsR0FBR2MsVUFBUCxDQUFrQkcsVUFBbEIsRUFDZDtBQUFBRixjQUFRLENBQUNHLFVBQUQ7QUFBUixLQURjLENBQWxCO0FDT0w7O0FESkNuQixNQUFJa0IsVUFBSixFQUFnQnVDLEtBQWhCLENBQ0k7QUFBQUUsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQURKO0FBRUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFISjtBQUlBQyxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBTEo7QUFNQUMsY0FBVTtBQUNOLGFBQU8sSUFBUDtBQVBKO0FBQUEsR0FESjs7QUFVQSxNQUFHNUMsZUFBYyxTQUFqQjtBQUNJNkMsT0FBRzdDLFVBQUgsSUFBaUJsQixJQUFJa0IsVUFBSixDQUFqQjtBQUNBNkMsT0FBRzdDLFVBQUgsRUFBZThDLEtBQWYsQ0FBcUJDLE1BQXJCLENBQTRCTixNQUE1QixDQUFtQyxVQUFDTyxNQUFELEVBQVNDLEdBQVQ7QUNVckMsYURUTUEsSUFBSUQsTUFBSixHQUFhQSxNQ1NuQjtBRFZFO0FDWUw7O0FEVEMsTUFBR2hELGVBQWMsT0FBakI7QUNXQSxXRFZJNkMsR0FBRyxTQUFPN0MsVUFBUCxHQUFrQixhQUFyQixJQUFxQ2xCLElBQUlrQixVQUFKLEVBQWdCOEMsS0NVekQ7QUFDRDtBRGpISCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcclxuc3ByaW50ZiA9IHJlcXVpcmUoJ3NwcmludGYtanMnKS5zcHJpbnRmO1xyXG5AaTE4biA9IGkxOG47XHJcblxyXG5AdCA9IChrZXksIHBhcmFtZXRlcnMsIGxvY2FsZSkgLT5cclxuXHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHJcblx0aWYgbG9jYWxlXHJcblx0XHR0cmFuc2xhdG9yID0gaTE4bi5jcmVhdGVUcmFuc2xhdG9yKCcnLCBsb2NhbGUpO1xyXG5cdGVsc2VcclxuXHRcdHRyYW5zbGF0b3IgPSBpMThuLl9fO1xyXG5cclxuXHRpZiBwYXJhbWV0ZXJzPy5jb250ZXh0XHJcblx0XHRrZXkgPSBrZXkgKyBcIl9cIiArIHBhcmFtZXRlcnMuY29udGV4dDtcclxuXHRcdFx0XHJcblx0aWYgcGFyYW1ldGVycz8gYW5kICEoXy5pc09iamVjdCBwYXJhbWV0ZXJzKVxyXG5cdFx0IyDlhbzlrrnogIHmoLzlvI8ga2V55Lit5YyF5ZCrICVz77yM5Y+q5pSv5oyB5LiA5Liq5Y+C5pWw44CCXHJcblx0XHRyZXR1cm4gc3ByaW50Zih0cmFuc2xhdG9yKGtleSksIHBhcmFtZXRlcnMpXHJcblxyXG5cdHJldHVybiB0cmFuc2xhdG9yKGtleSwgcGFyYW1ldGVycylcclxuXHJcbkB0ciA9IHRcclxuXHJcbkB0cmwgPSB0XHJcbmFic29sdXRlVXJsID0gKHVybCktPlxyXG5cdGlmIHVybFxyXG5cdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcclxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRlbHNlXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxyXG5cdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHRcdGVsc2VcclxuXHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuIyDph43lhpl0YXA6aTE4buWHveaVsO+8jOWQkeWQjuWFvOWuuVxyXG5pMThuLnNldE9wdGlvbnNcclxuXHRwdXJpZnk6IG51bGxcclxuXHRkZWZhdWx0TG9jYWxlOiAnemgtQ04nXHJcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxyXG5cclxuaWYgVEFQaTE4bj9cclxuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXHJcblxyXG5cdFRBUGkxOG4uX18gPSAoa2V5LCBvcHRpb25zLCBsb2NhbGUpLT5cclxuXHJcblx0XHR0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XHRcdFxyXG5cdFx0aWYgdHJhbnNsYXRlZCAhPSBrZXlcclxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcclxuXHJcblx0XHQjIGkxOG4g57+76K+R5LiN5Ye65p2l77yM5bCd6K+V55SoIHRhcDppMThuIOe/u+ivkVxyXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxyXG5cclxuXHRUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gKGxhbmdfdGFnKSAtPlxyXG5cclxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcclxuXHRcdHBhdGggPSBwYXRoLnJlcGxhY2UgL1xcLyQvLCBcIlwiXHJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXHJcblx0XHRcdHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoXHJcblxyXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XHJcblx0XHRsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nXHJcblx0XHRpZiBsLmluZGV4T2YoXCJ6aFwiKSA+PTBcclxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGxvY2FsZSA9IFwiZW4tdXNcIlxyXG5cdFx0cmV0dXJuIGxvY2FsZVxyXG5cclxuXHJcblx0IyDlgZznlKjkuJrliqHlr7nosaHnv7vor5FcclxuXHRTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSAocHJlZml4KSAtPlxyXG5cdFx0cmV0dXJuXHJcblx0XHQjIHNlbGYgPSB0aGlzXHJcblx0XHQjIF8uZWFjaChzZWxmLl9zY2hlbWEsICh2YWx1ZSwga2V5KSAtPlxyXG5cdFx0IyBcdGlmICghdmFsdWUpXHJcblx0XHQjIFx0XHRyZXR1cm5cclxuXHRcdCMgXHRpZiAhc2VsZi5fc2NoZW1hW2tleV0ubGFiZWxcclxuXHRcdCMgXHRcdHNlbGYuX3NjaGVtYVtrZXldLmxhYmVsID0gKCktPlxyXG5cdFx0IyBcdFx0XHRyZXR1cm4gdChwcmVmaXggKyBcIl9cIiArIGtleS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpXHJcblx0XHQjIClcclxuXHJcblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cclxuXHRcdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdfJywgKGtleSwgYXJncyktPlxyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKVxyXG5cclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT0gXCJlbi11c1wiXHJcblx0XHRcdFx0aWYgVEFQaTE4bj9cclxuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdFQ5bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpXHJcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgVEFQaTE4bj9cclxuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxyXG5cdFx0XHRcdFQ5bi5zZXRMYW5ndWFnZShcImVuXCIpXHJcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJlblwiKVxyXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxyXG5cclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxyXG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIixNZXRlb3IudXNlcigpLmxvY2FsZSlcclxuXHJcblx0XHRpMThuLm9uQ2hhbmdlTG9jYWxlIChuZXdMb2NhbGUpLT5cclxuXHJcblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxyXG5cdFx0XHRcdGxhbmd1YWdlOlxyXG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxyXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvXCI6ICAgICAgICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXHJcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb1Bvc3RGaXhcIjogICAgdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXHJcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcclxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcclxuXHRcdFx0XHRcdFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXHJcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcclxuXHRcdFx0XHRcdFwiemVyb1JlY29yZHNcIjogICAgdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XHJcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJsYXN0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXHJcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxyXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcclxuXHRcdFx0XHRcdFwiYXJpYVwiOlxyXG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcclxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXHJcblxyXG5cdFx0XHQjIOWBnOeUqOS4muWKoeWvueixoee/u+ivkVxyXG5cdFx0XHQjIF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxyXG5cdFx0XHQjIFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cclxuXHRcdFx0IyBcdFx0aWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PSBcIl9pZFwiKVxyXG5cdFx0XHQjIFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0IyBcdFx0IyBjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csXCJfXCIpKTtcclxuXHRcdFx0IyBcdFx0aWYgIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2VcclxuXHRcdFx0IyBcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cclxuXHRcdFx0IyBcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpXHJcblx0XHRcdCMgXHRcdHJldHVybiBcclxuXHJcblxyXG4iLCJ2YXIgYWJzb2x1dGVVcmwsIGdldEJyb3dzZXJMb2NhbGUsIHNwcmludGY7XG5cbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuc3ByaW50ZiA9IHJlcXVpcmUoJ3NwcmludGYtanMnKS5zcHJpbnRmO1xuXG50aGlzLmkxOG4gPSBpMThuO1xuXG50aGlzLnQgPSBmdW5jdGlvbihrZXksIHBhcmFtZXRlcnMsIGxvY2FsZSkge1xuICB2YXIgdHJhbnNsYXRvcjtcbiAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9XG4gIGlmIChsb2NhbGUpIHtcbiAgICB0cmFuc2xhdG9yID0gaTE4bi5jcmVhdGVUcmFuc2xhdG9yKCcnLCBsb2NhbGUpO1xuICB9IGVsc2Uge1xuICAgIHRyYW5zbGF0b3IgPSBpMThuLl9fO1xuICB9XG4gIGlmIChwYXJhbWV0ZXJzICE9IG51bGwgPyBwYXJhbWV0ZXJzLmNvbnRleHQgOiB2b2lkIDApIHtcbiAgICBrZXkgPSBrZXkgKyBcIl9cIiArIHBhcmFtZXRlcnMuY29udGV4dDtcbiAgfVxuICBpZiAoKHBhcmFtZXRlcnMgIT0gbnVsbCkgJiYgIShfLmlzT2JqZWN0KHBhcmFtZXRlcnMpKSkge1xuICAgIHJldHVybiBzcHJpbnRmKHRyYW5zbGF0b3Ioa2V5KSwgcGFyYW1ldGVycyk7XG4gIH1cbiAgcmV0dXJuIHRyYW5zbGF0b3Ioa2V5LCBwYXJhbWV0ZXJzKTtcbn07XG5cbnRoaXMudHIgPSB0O1xuXG50aGlzLnRybCA9IHQ7XG5cbmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIHZhciBlLCByb290X3VybDtcbiAgaWYgKHVybCkge1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfVxuICB9XG59O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTicsXG4gIGhvc3RVcmw6IGFic29sdXRlVXJsKClcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGggKyBcIi9cIiArIGxhbmdfdGFnICsgXCIuanNvblwiO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIGdldEJyb3dzZXJMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgbG9jYWxlO1xuICAgIGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgaWYgKGwuaW5kZXhPZihcInpoXCIpID49IDApIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtY25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxlID0gXCJlbi11c1wiO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlO1xuICB9O1xuICBTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbihwcmVmaXgpIHt9O1xuICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gIH0pO1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgICB9KTtcbiAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT09IFwiZW4tdXNcIikge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgfVxuICAgICAgICBUOW4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKTtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIFQ5bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICBpMThuLnNldExvY2FsZShcImVuXCIpO1xuICAgICAgICByZXR1cm4gbW9tZW50LmxvY2FsZShcImVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKTtcbiAgICAgIGlmIChNZXRlb3IudXNlcigpKSB7XG4gICAgICAgIGlmIChNZXRlb3IudXNlcigpLmxvY2FsZSkge1xuICAgICAgICAgIHJldHVybiBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpMThuLm9uQ2hhbmdlTG9jYWxlKGZ1bmN0aW9uKG5ld0xvY2FsZSkge1xuICAgICAgcmV0dXJuICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiQGNmcyA9IHt9XHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIilcclxuXHJcblxyXG4jIOmAmui/h+aWh+S7tuaJqeWxleWQjeiOt+WPluaWh+S7tmNvbnRlbnRUeXBlXHJcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xyXG4jIOWPgueFp3Mz5LiK5Lyg6ZmE5Lu25ZCO55qEY29udGVudFR5cGVcclxuY2ZzLmdldENvbnRlbnRUeXBlID0gKGZpbGVuYW1lKSAtPlxyXG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKCcuJyArIF9leHAgPT0gJy5hdScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ibXAnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYnoyJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L2NzcydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kdGQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG90eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5lcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ2lmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5odG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmphcicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJ1xyXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvanBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qc3AnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL21pZGknXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXAzJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcGVnJykgXHJcbiAgICAgIHJldHVybiAndmlkZW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGRmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBsJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3BuZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wb3R4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwc3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhbScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ydGYnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zZ21sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9zZ21sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zbGR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN2ZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGFyLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRneicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvdGlmZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50c3YnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnR4dCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC13YXYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxhbScpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHN4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC94bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuemlwJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xyXG4gICAgZWxzZSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBcclxuXHJcblxyXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKVxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxyXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKVxyXG5cclxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpXHJcbiAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXHJcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXHJcblxyXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxyXG4gICAgZmlsZV9zdG9yZVxyXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5yZWdpb25cclxuICAgICAgICAgICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5idWNrZXRcclxuICAgICAgICAgICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uZm9sZGVyXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWRcclxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XHJcblxyXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnJlZ2lvblxyXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXRcclxuICAgICAgICAgICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuZm9sZGVyXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYWNjZXNzS2V5SWRcclxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XHJcbiAgICBlbHNlXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVLZXlNYWtlcjogKGZpbGVPYmopLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBTZXQgYWJzb2x1dGUgcGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpXHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdWRpb3MnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddICMgYWxsb3cgb25seSBhdWRpb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ10gIyBhbGxvdyBvbmx5IHZpZGVvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXHJcblxyXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XHJcbiAgICAgICAgaW5zZXJ0OiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIHVwZGF0ZTogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICByZW1vdmU6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgZG93bmxvYWQ6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcclxuICAgICAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXVxyXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxyXG4gICAgICAgICAgICBkb2MudXNlcklkID0gdXNlcklkXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXHJcbiAgICAgICAgZGJbXCJjZnMuI3tzdG9yZV9uYW1lfS5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzIiwidmFyIHN0b3Jlcztcblxuc3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ107XG5cbl8uZWFjaChzdG9yZXMsIGZ1bmN0aW9uKHN0b3JlX25hbWUpIHtcbiAgZmlsZV9zdG9yZTtcbiAgdmFyIGZpbGVfc3RvcmUsIHJlZiwgcmVmMTtcbiAgaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwge1xuICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnJlZ2lvbixcbiAgICAgICAgaW50ZXJuYWw6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmludGVybmFsLFxuICAgICAgICBidWNrZXQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmJ1Y2tldCxcbiAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5mb2xkZXIsXG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMS5zdG9yZSA6IHZvaWQgMCkgPT09IFwiUzNcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSwge1xuICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnJlZ2lvbixcbiAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXQsXG4gICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuZm9sZGVyLFxuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICAgIGZpbGVLZXlNYWtlcjogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgICAgIHZhciBhYnNvbHV0ZVBhdGgsIGZpbGVuYW1lLCBmaWxlbmFtZUluU3RvcmUsIG1rZGlycCwgbW9udGgsIG5vdywgcGF0aCwgcGF0aG5hbWUsIHN0b3JlLCB5ZWFyO1xuICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZV9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgKFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lICsgXCIvXCIpICsgeWVhciArICcvJyArIG1vbnRoKTtcbiAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
