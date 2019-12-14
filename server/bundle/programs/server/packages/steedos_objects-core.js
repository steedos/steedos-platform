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
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"users":"用户","users_steedos_id":"Steedos ID","users_name":"姓名","users_username":"用户名","users_email":"邮件","users_company":"公司","users_position":"职务","users_mobile":"手机","users_work_phone":"固定电话","users_locale":"语言","users_timezone":"时区","users_emails":"邮件","users_createdAt":"创建日期","users_email_notification":"接收邮件通知","apps":"应用","apps_space":"工作区","apps_name":"名称","apps_description":"描述","apps_url":"链接","apps_auth_name":"验证域名","apps_on_click":"链接脚本","apps_is_use_ie":"使用IE打开(需使用Steedos桌面客户端)","apps_is_use_iframe":"使用iframe打开","apps_is_new_window":"新窗口打开","apps_iconURL":"图标链接","apps_icon":"图标","apps_space_sort":"排序号","apps_mobile":"在移动应用中显示","apps_desktop":"在桌面应用中显示","apps_menu":"在左侧菜单显示","apps_sort_no":"排序号","apps_secret":"API 密钥","apps_internal":"App内置","apps_sort":"排序","apps_id":"ID","space":"工作区","spaces":"工作区","spaces_id":"ID","spaces_name":"名称","spaces_admins":"管理员","spaces_balance":"账户余额","spaces_owner":"所有者","spaces_is_paid":"已付费","spaces_owner_name()":"所有者","spaces_admins_name()":"管理员","spaces_apps_enabled":"启用应用","spaces_enable_register":"是否允许注册","spaces_max_user_count":"最大用户数","spaces_is_deleted":"已删除","spaces_created":"创建时间","spaces_created_by":"创建者","spaces_modified":"修改时间","spaces_modified_by":"修改者","spaces_modules":"模块","spaces_prefs":"首选项","spaces_avatar":"Logo","organizations":"组织","organizations_id":"ID","organizations_fullname":"组织全名","organizations_users":"组织成员","organizations_name":"组织名称","organizations_parent":"上级组织","organizations_space_name()":"工作区","organizations_users_count()":"人数","organizations_children":"下级组织","organizations_created":"创建时间","organizations_created_by":"创建者","organizations_is_company":"公司级","organizations_modified":"修改时间","organizations_modified_by":"修改者","organizations_parents":"所有上级组织","organizations_space":"所属工作区","organizations_sort_no":"排序号","organizations_hidden":"隐藏","organizations_admins":"组织管理员","space_users":"人员","space_users_id":"ID","space_users_user":"用户ID","space_users_space_name()":"工作区","space_users_name":"姓名","space_users_email":"邮件","space_users_organization":"主部门","space_users_organizations":"所属部门","space_users_user_accepted":"有效","space_users_manager":"上级主管","space_users_organization_name()":"部门","space_users_space":"所属工作区","space_users_created":"创建时间","space_users_modified":"修改时间","space_users_created_by":"创建者","space_users_modified_by":"修改者","space_users_mobile":"手机","space_users_work_phone":"固定电话","space_users_company":"单位","space_users_position":"职务","space_users_managers":"所有上级主管","space_users_apps":"Apps","space_users_sort_no":"排序号","users_changelogs_id":"ID","users_changelogs_change_data":"修改日期","users_changelogs_operator":"操作者","users_changelogs_space":"工作区","users_changelogs_operation":"操作","users_changelogs_user_count":"用户数","users_changelogs_created":"创建时间","users_changelogs_user":"用户","users_changelogs_created_by":"创建者","organizations_error_space_required":"工作区必填","organizations_error_space_not_found":"未找到该工作区","organizations_error_space_admins_only":"您不是该工作区的管理员","organizations_error_users_readonly":"您无法修改部门成员","organizations_error_organizations_name_exists":"该部门名称已经存在","organizations_error_space_readonly":"无法修改工作区","organizations_error_parents_readonly":"无法修改上级部门","organizations_error_children_readonly":"无法修改下级部门","organizations_error_fullname_readonly":"无法修改部门全名","organizations_error_parent_is_self":"上级部门不能是自己","organizations_error_organization_has_children":"该部门已有下级部门","organizations_error_can_not_remove_root_organization":"您无法删除一级部门","organizations_error_organization_is_company":"根部门的名字无法修改","organizations_error_organization_name_required":"部门名称必填","organizations_error_organizations_parent_required":"请选择上级部门","organizations_error_space_admins_only_for_org_admins":"只有该工作区的管理员才能处理“组织管理员”","organizations_error_org_admins_only":"无权访问，只有组织机构管理员可以执行此操作。","organizations_error_organization_has_users":"部门内有人员,所以不能删除","organizations_error_can_not_set_checkbox_true":"不能设置管理员或拥有者为无效","space_users_error_space_required":"工作区必填","space_users_error_space_not_found":"未找到该工作区","space_users_error_space_admins_only":"您不是该工作区的管理员","space_users_error_user_required":"user必填","space_users_error_name_required":"用户名必填","space_users_error_space_users_exists":"该用户已经存在","space_users_error_email_readonly":"用户邮箱不允许修改","space_users_error_space_readonly":"无法修改工作区","space_users_error_user_readonly":"无法修改用户","space_users_error_remove_space_owner":"不能删除工作区拥有者","space_users_error_remove_space_admins":"不能删除工作区管理员","space_users_error_phone_already_existed":"该手机号已被其他用户注册","spaces_error_login_required":"login必填","spaces_error_space_owner_only":"您不是该工作区的所有者","spaces_error_space_admins_required":"必须为工作区选择一个管理员","spaces_error_space_readonly":"工作区无法修改","users_error_email_exists":"该邮件地址已存在","users_error_username_exists":"该用户名已存在","users_error_steedos_id_required":"登录账户为必填项","users_error_steedos_id_readonly":"登录账户无法修改","users_error_cloud_admin_required":"您无权删除该用户","users_email_create_account":"已为您创建华炎云账号","users_email_start_service":"请点击以下链接，填写相关信息。","users_email_verify_account":"您已注册华炎云账号,请点击以下链接进行验证。","users_email_verify_email":"验证您的登录邮箱","users_email_reset_password":"重新设置您的密码","users_email_reset_password_body":"您的验证码为：{$token_code}\r\n请在密码重置界面输入上面的验证码，或点击以下链接，重新设置您的登录密码。","users_email_hello":"您好","users_email_thanks":"谢谢！"});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJhYnNvbHV0ZVVybCIsImdldEJyb3dzZXJMb2NhbGUiLCJzcHJpbnRmIiwidCIsImtleSIsInBhcmFtZXRlcnMiLCJsb2NhbGUiLCJ0cmFuc2xhdG9yIiwiY3JlYXRlVHJhbnNsYXRvciIsIl9fIiwiY29udGV4dCIsIl8iLCJpc09iamVjdCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwib3B0aW9ucyIsInRyYW5zbGF0ZWQiLCJfZ2V0TGFuZ3VhZ2VGaWxlUGF0aCIsImxhbmdfdGFnIiwicGF0aCIsImNvbmYiLCJjZG5fcGF0aCIsImkxOG5fZmlsZXNfcm91dGUiLCJsIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckxhbmd1YWdlIiwibGFuZ3VhZ2UiLCJpbmRleE9mIiwiU2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwicHJlZml4Iiwic2VsZiIsImVhY2giLCJfc2NoZW1hIiwidmFsdWUiLCJsYWJlbCIsIlRlbXBsYXRlIiwicmVnaXN0ZXJIZWxwZXIiLCJhcmdzIiwic3RhcnR1cCIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiVDluIiwic2V0TG9jYWxlIiwibW9tZW50IiwidXNlciIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJUYWJ1bGFyIiwidGFibGVzQnlOYW1lIiwidGFibGUiLCJjb2x1bW5zIiwiY29sdW1uIiwiZGF0YSIsInNUaXRsZSIsImNvbGxlY3Rpb24iLCJfbmFtZSIsInplcm9SZWNvcmRzIiwiY2ZzIiwiRlMiLCJIVFRQIiwic2V0QmFzZVVybCIsImdldENvbnRlbnRUeXBlIiwiZmlsZW5hbWUiLCJfZXhwIiwic3BsaXQiLCJwb3AiLCJ0b0xvd2VyQ2FzZSIsIlN0b3JhZ2VBZGFwdGVyIiwib24iLCJzdG9yZU5hbWUiLCJmaWxlT2JqIiwiY29uc29sZSIsIkNvbGxlY3Rpb24iLCJzdG9yZXMiLCJzdG9yZV9uYW1lIiwiZmlsZV9zdG9yZSIsInJlZiIsInJlZjEiLCJzZXR0aW5ncyIsInN0b3JlIiwiU3RvcmUiLCJPU1MiLCJpc1NlcnZlciIsInJlZ2lvbiIsImFsaXl1biIsImludGVybmFsIiwiYnVja2V0IiwiZm9sZGVyIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJTMyIsImF3cyIsIkZpbGVTeXN0ZW0iLCJqb2luIiwiQ3JlYXRvciIsInN0ZWVkb3NTdG9yYWdlRGlyIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWtkaXJwIiwibW9udGgiLCJub3ciLCJ5ZWFyIiwiX2dldEluZm8iLCJuYW1lIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkb3dubG9hZCIsImRiIiwiZmlsZXMiLCJiZWZvcmUiLCJ1c2VySWQiLCJkb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGFBQUE7QUFBQUMsT0FBQUMsS0FBQSxDQUFBQyxRQUFBO0FBQUEsdUJBQUFDLENBQUE7QUFBQUosV0FBQUksQ0FBQTtBQUFBO0FBQUE7QUFBQSxJQUFBQyxXQUFBLEVBQUFDLGdCQUFBLEVBQUFDLE9BQUE7QUFDQUEsVUFBVUosUUFBUSxZQUFSLEVBQXNCSSxPQUFoQztBQUNBLEtBQUNQLElBQUQsR0FBUUEsSUFBUjs7QUFFQSxLQUFDUSxDQUFELEdBQUssVUFBQ0MsR0FBRCxFQUFNQyxVQUFOLEVBQWtCQyxNQUFsQjtBQUNKLE1BQUFDLFVBQUE7O0FBQUEsTUFBR0QsV0FBVSxPQUFiO0FBQ0NBLGFBQVMsT0FBVDtBQ01DOztBREpGLE1BQUdBLE1BQUg7QUFDQ0MsaUJBQWFaLEtBQUthLGdCQUFMLENBQXNCLEVBQXRCLEVBQTBCRixNQUExQixDQUFiO0FBREQ7QUFHQ0MsaUJBQWFaLEtBQUtjLEVBQWxCO0FDTUM7O0FESkYsTUFBQUosY0FBQSxPQUFHQSxXQUFZSyxPQUFmLEdBQWUsTUFBZjtBQUNDTixVQUFNQSxNQUFNLEdBQU4sR0FBWUMsV0FBV0ssT0FBN0I7QUNNQzs7QURKRixNQUFHTCxjQUFBLFFBQWdCLENBQUVNLEVBQUVDLFFBQUYsQ0FBV1AsVUFBWCxDQUFyQjtBQUVDLFdBQU9ILFFBQVFLLFdBQVdILEdBQVgsQ0FBUixFQUF5QkMsVUFBekIsQ0FBUDtBQ0tDOztBREhGLFNBQU9FLFdBQVdILEdBQVgsRUFBZ0JDLFVBQWhCLENB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R0FBa0IsYUFBckIsSUFBcUNqQixJQUFJaUIsVUFBSixFQUFnQjhDLEtDVXpEO0FBQ0Q7QURqSEgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5zcHJpbnRmID0gcmVxdWlyZSgnc3ByaW50Zi1qcycpLnNwcmludGY7XG5AaTE4biA9IGkxOG47XG5cbkB0ID0gKGtleSwgcGFyYW1ldGVycywgbG9jYWxlKSAtPlxuXHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0aWYgbG9jYWxlXG5cdFx0dHJhbnNsYXRvciA9IGkxOG4uY3JlYXRlVHJhbnNsYXRvcignJywgbG9jYWxlKTtcblx0ZWxzZVxuXHRcdHRyYW5zbGF0b3IgPSBpMThuLl9fO1xuXG5cdGlmIHBhcmFtZXRlcnM/LmNvbnRleHRcblx0XHRrZXkgPSBrZXkgKyBcIl9cIiArIHBhcmFtZXRlcnMuY29udGV4dDtcblx0XHRcdFxuXHRpZiBwYXJhbWV0ZXJzPyBhbmQgIShfLmlzT2JqZWN0IHBhcmFtZXRlcnMpXG5cdFx0IyDlhbzlrrnogIHmoLzlvI8ga2V55Lit5YyF5ZCrICVz77yM5Y+q5pSv5oyB5LiA5Liq5Y+C5pWw44CCXG5cdFx0cmV0dXJuIHNwcmludGYodHJhbnNsYXRvcihrZXkpLCBwYXJhbWV0ZXJzKVxuXG5cdHJldHVybiB0cmFuc2xhdG9yKGtleSwgcGFyYW1ldGVycylcblxuQHRyID0gdFxuXG5AdHJsID0gdFxuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdGlmIHVybFxuXHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdGVsc2Vcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHRyeVxuXHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdGVsc2Vcblx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG4jIOmHjeWGmXRhcDppMThu5Ye95pWw77yM5ZCR5ZCO5YW85a65XG5pMThuLnNldE9wdGlvbnNcblx0cHVyaWZ5OiBudWxsXG5cdGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxuXG5pZiBUQVBpMThuP1xuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXG5cblx0VEFQaTE4bi5fXyA9IChrZXksIG9wdGlvbnMsIGxvY2FsZSktPlxuXG5cdFx0dHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1x0XHRcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcblxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxuXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XG5cblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXG5cdFx0XHRwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxuXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXG5cdFx0ZWxzZVxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXG5cdFx0cmV0dXJuIGxvY2FsZVxuXG5cblx0U2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gKHByZWZpeCkgLT5cblx0XHRzZWxmID0gdGhpc1xuXHRcdF8uZWFjaChzZWxmLl9zY2hlbWEsICh2YWx1ZSwga2V5KSAtPlxuXHRcdFx0aWYgKCF2YWx1ZSlcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRpZiAhc2VsZi5fc2NoZW1hW2tleV0ubGFiZWxcblx0XHRcdFx0c2VsZi5fc2NoZW1hW2tleV0ubGFiZWwgPSAoKS0+XG5cdFx0XHRcdFx0cmV0dXJuIHQocHJlZml4ICsgXCJfXCIgKyBrZXkucmVwbGFjZSgvXFwuL2csXCJfXCIpKVxuXHRcdClcblxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdE1ldGVvci5zdGFydHVwIC0+XG5cblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG5cblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcblxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRUOW4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRUOW4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxuXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxuXHRcdFx0aWYgTWV0ZW9yLnVzZXIoKVxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIixNZXRlb3IudXNlcigpLmxvY2FsZSlcblxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxuXG5cdFx0XHQkLmV4dGVuZCB0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cyxcblx0XHRcdFx0bGFuZ3VhZ2U6XG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuXHRcdFx0XHRcdFwiZW1wdHlUYWJsZVwiOiAgICAgdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG5cdFx0XHRcdFx0XCJpbmZvRmlsdGVyZWRcIjogICB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcblx0XHRcdFx0XHRcImxlbmd0aE1lbnVcIjogICAgIHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG5cdFx0XHRcdFx0XCJzZWFyY2hcIjogICAgICAgICB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XG5cdFx0XHRcdFx0XHRcImZpcnN0XCI6ICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuXHRcdFx0XHRcdFx0XCJwcmV2aW91c1wiOiAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG5cdFx0XHRcdFx0XCJhcmlhXCI6XG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcblx0XHRcdFx0XHRcdFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cblx0XHRcdFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csXCJfXCIpKTtcblx0XHRcdFx0XHRpZiAhdGFibGUub3B0aW9ucy5sYW5ndWFnZVxuXHRcdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9XG5cdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpXG5cdFx0XHRcdFx0cmV0dXJuIFxuXG5cbiIsInZhciBhYnNvbHV0ZVVybCwgZ2V0QnJvd3NlckxvY2FsZSwgc3ByaW50ZjtcblxuaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuXG5zcHJpbnRmID0gcmVxdWlyZSgnc3ByaW50Zi1qcycpLnNwcmludGY7XG5cbnRoaXMuaTE4biA9IGkxOG47XG5cbnRoaXMudCA9IGZ1bmN0aW9uKGtleSwgcGFyYW1ldGVycywgbG9jYWxlKSB7XG4gIHZhciB0cmFuc2xhdG9yO1xuICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH1cbiAgaWYgKGxvY2FsZSkge1xuICAgIHRyYW5zbGF0b3IgPSBpMThuLmNyZWF0ZVRyYW5zbGF0b3IoJycsIGxvY2FsZSk7XG4gIH0gZWxzZSB7XG4gICAgdHJhbnNsYXRvciA9IGkxOG4uX187XG4gIH1cbiAgaWYgKHBhcmFtZXRlcnMgIT0gbnVsbCA/IHBhcmFtZXRlcnMuY29udGV4dCA6IHZvaWQgMCkge1xuICAgIGtleSA9IGtleSArIFwiX1wiICsgcGFyYW1ldGVycy5jb250ZXh0O1xuICB9XG4gIGlmICgocGFyYW1ldGVycyAhPSBudWxsKSAmJiAhKF8uaXNPYmplY3QocGFyYW1ldGVycykpKSB7XG4gICAgcmV0dXJuIHNwcmludGYodHJhbnNsYXRvcihrZXkpLCBwYXJhbWV0ZXJzKTtcbiAgfVxuICByZXR1cm4gdHJhbnNsYXRvcihrZXksIHBhcmFtZXRlcnMpO1xufTtcblxudGhpcy50ciA9IHQ7XG5cbnRoaXMudHJsID0gdDtcblxuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgdmFyIGUsIHJvb3RfdXJsO1xuICBpZiAodXJsKSB7XG4gICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9XG4gIH1cbn07XG5cbmkxOG4uc2V0T3B0aW9ucyh7XG4gIHB1cmlmeTogbnVsbCxcbiAgZGVmYXVsdExvY2FsZTogJ3poLUNOJyxcbiAgaG9zdFVybDogYWJzb2x1dGVVcmwoKVxufSk7XG5cbmlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gIFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX187XG4gIFRBUGkxOG4uX18gPSBmdW5jdGlvbihrZXksIG9wdGlvbnMsIGxvY2FsZSkge1xuICAgIHZhciB0cmFuc2xhdGVkO1xuICAgIHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgICBpZiAodHJhbnNsYXRlZCAhPT0ga2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICB9XG4gICAgcmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gIH07XG4gIFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSBmdW5jdGlvbihsYW5nX3RhZykge1xuICAgIHZhciBwYXRoO1xuICAgIHBhdGggPSB0aGlzLmNvbmYuY2RuX3BhdGggIT0gbnVsbCA/IHRoaXMuY29uZi5jZG5fcGF0aCA6IHRoaXMuY29uZi5pMThuX2ZpbGVzX3JvdXRlO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aCArIFwiL1wiICsgbGFuZ190YWcgKyBcIi5qc29uXCI7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgZ2V0QnJvd3NlckxvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBsb2NhbGU7XG4gICAgbCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJztcbiAgICBpZiAobC5pbmRleE9mKFwiemhcIikgPj0gMCkge1xuICAgICAgbG9jYWxlID0gXCJ6aC1jblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBcImVuLXVzXCI7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGU7XG4gIH07XG4gIFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IGZ1bmN0aW9uKHByZWZpeCkge1xuICAgIHZhciBzZWxmO1xuICAgIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBfLmVhY2goc2VsZi5fc2NoZW1hLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghc2VsZi5fc2NoZW1hW2tleV0ubGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3NjaGVtYVtrZXldLmxhYmVsID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHQocHJlZml4ICsgXCJfXCIgKyBrZXkucmVwbGFjZSgvXFwuL2csIFwiX1wiKSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgfSk7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICAgIH0pO1xuICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPT0gXCJlbi11c1wiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpO1xuICAgICAgICB9XG4gICAgICAgIFQ5bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpO1xuICAgICAgICBpMThuLnNldExvY2FsZShcInpoLUNOXCIpO1xuICAgICAgICByZXR1cm4gbW9tZW50LmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgVDluLnNldExhbmd1YWdlKFwiZW5cIik7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiZW5cIik7XG4gICAgICAgIHJldHVybiBtb21lbnQubG9jYWxlKFwiZW5cIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpO1xuICAgICAgaWYgKE1ldGVvci51c2VyKCkpIHtcbiAgICAgICAgaWYgKE1ldGVvci51c2VyKCkubG9jYWxlKSB7XG4gICAgICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGkxOG4ub25DaGFuZ2VMb2NhbGUoZnVuY3Rpb24obmV3TG9jYWxlKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cywge1xuICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgIFwiZGVjaW1hbFwiOiB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuICAgICAgICAgIFwiZW1wdHlUYWJsZVwiOiB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuICAgICAgICAgIFwiaW5mb1wiOiB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxuICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcbiAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG4gICAgICAgICAgXCJpbmZvUG9zdEZpeFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcbiAgICAgICAgICBcInRob3VzYW5kc1wiOiB0KFwiZGF0YVRhYmxlcy50aG91c2FuZHNcIiksXG4gICAgICAgICAgXCJsZW5ndGhNZW51XCI6IHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG4gICAgICAgICAgXCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInByb2Nlc3NpbmdcIjogdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG4gICAgICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgIFwiZmlyc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG4gICAgICAgICAgICBcImxhc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcbiAgICAgICAgICAgIFwibmV4dFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuICAgICAgICAgICAgXCJwcmV2aW91c1wiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJhcmlhXCI6IHtcbiAgICAgICAgICAgIFwic29ydEFzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnRBc2NlbmRpbmdcIiksXG4gICAgICAgICAgICBcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaCh0YWJsZS5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgIGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT09IFwiX2lkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLCBcIl9cIikpO1xuICAgICAgICAgIGlmICghdGFibGUub3B0aW9ucy5sYW5ndWFnZSkge1xuICAgICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiQGNmcyA9IHt9XG5cbk1ldGVvci5zdGFydHVwIC0+XG4gIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIilcblxuXG4jIOmAmui/h+aWh+S7tuaJqeWxleWQjeiOt+WPluaWh+S7tmNvbnRlbnRUeXBlXG4jIGh0dHA6Ly9yZWZlcmVuY2Uuc2l0ZXBvaW50LmNvbS9odG1sL21pbWUtdHlwZXNcbiMg5Y+C54WnczPkuIrkvKDpmYTku7blkI7nmoRjb250ZW50VHlwZVxuY2ZzLmdldENvbnRlbnRUeXBlID0gKGZpbGVuYW1lKSAtPlxuICAgIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoJy4nICsgX2V4cCA9PSAnLmF1JykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5hdmknKSBcbiAgICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ibXAnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvYm1wJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5iejInKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuY3NzJykgXG4gICAgICByZXR1cm4gJ3RleHQvY3NzJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kdGQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2MnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2N4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG90eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmVzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXhlJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ2lmJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL2dpZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ocXgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5odG1sJykgXG4gICAgICByZXR1cm4gJ3RleHQvaHRtbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuamFyJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJ1xuICAgIGVsc2UgaWYgKCgnLicgKyBfZXhwID09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT0gJy5qcGVnJykpIFxuICAgICAgcmV0dXJuICdpbWFnZS9qcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzcCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1pZGknKSBcbiAgICAgIHJldHVybiAnYXVkaW8vbWlkaSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXAzJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL21wZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wZWcnKSBcbiAgICAgIHJldHVybiAndmlkZW8vbXBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcub2dnJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGRmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGwnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbmcnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvcG5nJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wb3R4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHBzeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucXQnKSBcbiAgICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYScpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmFtJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yZGYnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ydGYnKSBcbiAgICAgIHJldHVybiAndGV4dC9ydGYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNnbWwnKSBcbiAgICAgIHJldHVybiAndGV4dC9zZ21sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zaXQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zbGR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3ZnJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN3ZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGFyLmd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGlmZicpIFxuICAgICAgcmV0dXJuICdpbWFnZS90aWZmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50c3YnKSBcbiAgICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHh0JykgXG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLndhdicpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXdhdidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxhbScpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhscycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc2InKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHN4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGx0eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3htbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuemlwJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCdcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgXG5cblxuIiwidGhpcy5jZnMgPSB7fTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpO1xufSk7XG5cbmNmcy5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBfZXhwO1xuICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmF2aScpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ibXAnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9ibXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYnoyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5jc3MnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2Nzcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kdGQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvY3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5lcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5leGUnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ2lmJykge1xuICAgIHJldHVybiAnaW1hZ2UvZ2lmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmhxeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5odG1sJykge1xuICAgIHJldHVybiAndGV4dC9odG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmphcicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJztcbiAgfSBlbHNlIGlmICgoJy4nICsgX2V4cCA9PT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PT0gJy5qcGVnJykpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2pwZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanNwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1pZGknKSB7XG4gICAgcmV0dXJuICdhdWRpby9taWRpJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wMycpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXBlZycpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcub2dnJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9wbmcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucXQnKSB7XG4gICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmEnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYW0nKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucnRmJykge1xuICAgIHJldHVybiAndGV4dC9ydGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2dtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvc2dtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zaXQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2xkeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zdmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN3ZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRhci5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50Z3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGlmZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3RpZmYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHN2Jykge1xuICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50eHQnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLndhdicpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsYW0nKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc2InKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQveG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnppcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9XG59O1xuIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uICdlcnJvcicsIChzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKS0+XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpXG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uICdlcnJvcicsIChlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKS0+XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIilcbiAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSkiLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaikge1xuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSkge1xuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuIiwic3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ11cblxuXy5lYWNoIHN0b3JlcywgKHN0b3JlX25hbWUpLT5cbiAgICBmaWxlX3N0b3JlXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Mgc3RvcmVfbmFtZSxcbiAgICAgICAgICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnJlZ2lvblxuICAgICAgICAgICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYnVja2V0XG4gICAgICAgICAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5mb2xkZXJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWRcbiAgICAgICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnNlY3JldEFjY2Vzc0tleVxuXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MucmVnaW9uXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXRcbiAgICAgICAgICAgICAgICBmb2xkZXI6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmZvbGRlclxuICAgICAgICAgICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5hY2Nlc3NLZXlJZFxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XG4gICAgZWxzZVxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlS2V5TWFrZXI6IChmaWxlT2JqKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAjIExvb2t1cCB0aGUgY29weVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdG9yZSBhbmQgc3RvcmUua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRPIENVU1RPTUlaRSwgUkVQTEFDRSBDT0RFIEFGVEVSIFRISVMgUE9JTlRcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBuZXcgRGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKVxuXG4gICAgICAgICAgICAgICAgfSlcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F1ZGlvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXSAjIGFsbG93IG9ubHkgYXVkaW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXSAjIGFsbG93IG9ubHkgdmlkZW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XG4gICAgICAgIGluc2VydDogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHVwZGF0ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJlbW92ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGRvd25sb2FkOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXG4gICAgICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxuICAgICAgICAgICAgZG9jLnVzZXJJZCA9IHVzZXJJZFxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXG4gICAgICAgIGRiW1wiY2ZzLiN7c3RvcmVfbmFtZX0uZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcyIsInZhciBzdG9yZXM7XG5cbnN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddO1xuXG5fLmVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZV9uYW1lKSB7XG4gIGZpbGVfc3RvcmU7XG4gIHZhciBmaWxlX3N0b3JlLCByZWYsIHJlZjE7XG4gIGlmICgoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5yZWdpb24sXG4gICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbCxcbiAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5idWNrZXQsXG4gICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uZm9sZGVyLFxuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjEuc3RvcmUgOiB2b2lkIDApID09PSBcIlMzXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5yZWdpb24sXG4gICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYnVja2V0LFxuICAgICAgICBmb2xkZXI6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmZvbGRlcixcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnNlY3JldEFjY2Vzc0tleVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy9cIiArIHN0b3JlX25hbWUpLFxuICAgICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgICB2YXIgYWJzb2x1dGVQYXRoLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBta2RpcnAsIG1vbnRoLCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIChcImZpbGVzL1wiICsgc3RvcmVfbmFtZSArIFwiL1wiKSArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXVkaW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAndmlkZW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cbiAgICB9KTtcbiAgfVxuICBjZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRvd25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXTtcbiAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICByZXR1cm4gZG9jLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ZpbGVzJykge1xuICAgIHJldHVybiBkYltcImNmcy5cIiArIHN0b3JlX25hbWUgKyBcIi5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzO1xuICB9XG59KTtcbiJdfQ==
