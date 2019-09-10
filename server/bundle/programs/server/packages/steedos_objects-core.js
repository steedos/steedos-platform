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
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"users":"用户","users_steedos_id":"Steedos ID","users_name":"姓名","users_username":"用户名","users_email":"邮件","users_company":"公司","users_position":"职务","users_mobile":"手机","users_work_phone":"固定电话","users_locale":"语言","users_timezone":"时区","users_emails":"邮件","users_createdAt":"创建日期","users_email_notification":"接收邮件通知","apps":"应用","apps_space":"工作区","apps_name":"名称","apps_description":"描述","apps_url":"链接","apps_auth_name":"验证域名","apps_on_click":"链接脚本","apps_is_use_ie":"使用IE打开(需使用Steedos桌面客户端)","apps_is_use_iframe":"使用iframe打开","apps_is_new_window":"新窗口打开","apps_iconURL":"图标链接","apps_icon":"图标","apps_space_sort":"排序号","apps_mobile":"在移动应用中显示","apps_desktop":"在桌面应用中显示","apps_menu":"在左侧菜单显示","apps_sort_no":"排序号","apps_secret":"API 密钥","apps_internal":"App内置","apps_sort":"排序","apps_id":"ID","space":"工作区","spaces":"工作区","spaces_id":"ID","spaces_name":"名称","spaces_admins":"管理员","spaces_balance":"账户余额","spaces_owner":"所有者","spaces_is_paid":"已付费","spaces_owner_name()":"所有者","spaces_admins_name()":"管理员","spaces_apps_enabled":"启用应用","spaces_enable_register":"是否允许注册","spaces_max_user_count":"最大用户数","spaces_is_deleted":"已删除","spaces_created":"创建时间","spaces_created_by":"创建者","spaces_modified":"修改时间","spaces_modified_by":"修改者","spaces_modules":"模块","spaces_prefs":"首选项","spaces_avatar":"Logo(长宽要求为230*50像素)","organizations":"部门","organizations_id":"ID","organizations_fullname":"部门全名","organizations_users":"部门成员","organizations_name":"部门名称","organizations_parent":"上级部门","organizations_space_name()":"工作区","organizations_users_count()":"人数","organizations_children":"下级部门","organizations_created":"创建时间","organizations_created_by":"创建者","organizations_is_company":"公司级","organizations_modified":"修改时间","organizations_modified_by":"修改者","organizations_parents":"所有上级部门","organizations_space":"所属工作区","organizations_sort_no":"排序号","organizations_hidden":"隐藏","organizations_admins":"部门管理员","space_users":"人员","space_users_id":"ID","space_users_user":"用户ID","space_users_space_name()":"工作区","space_users_name":"姓名","space_users_email":"邮件","space_users_organization":"主部门","space_users_organizations":"所属部门","space_users_user_accepted":"有效","space_users_manager":"上级主管","space_users_organization_name()":"部门","space_users_space":"所属工作区","space_users_created":"创建时间","space_users_modified":"修改时间","space_users_created_by":"创建者","space_users_modified_by":"修改者","space_users_mobile":"手机","space_users_work_phone":"固定电话","space_users_company":"单位","space_users_position":"职务","space_users_managers":"所有上级主管","space_users_apps":"Apps","space_users_sort_no":"排序号","users_changelogs_id":"ID","users_changelogs_change_data":"修改日期","users_changelogs_operator":"操作者","users_changelogs_space":"工作区","users_changelogs_operation":"操作","users_changelogs_user_count":"用户数","users_changelogs_created":"创建时间","users_changelogs_user":"用户","users_changelogs_created_by":"创建者","organizations_error_space_required":"工作区必填","organizations_error_space_not_found":"未找到该工作区","organizations_error_space_admins_only":"您不是该工作区的管理员","organizations_error_users_readonly":"您无法修改部门成员","organizations_error_organizations_name_exists":"该部门名称已经存在","organizations_error_space_readonly":"无法修改工作区","organizations_error_parents_readonly":"无法修改上级部门","organizations_error_children_readonly":"无法修改下级部门","organizations_error_fullname_readonly":"无法修改部门全名","organizations_error_parent_is_self":"上级部门不能是自己","organizations_error_organization_has_children":"该部门已有下级部门","organizations_error_can_not_remove_root_organization":"您无法删除一级部门","organizations_error_organization_is_company":"根部门的名字无法修改","organizations_error_organization_name_required":"部门名称必填","organizations_error_organizations_parent_required":"请选择上级部门","organizations_error_space_admins_only_for_org_admins":"只有该工作区的管理员才能处理“组织管理员”","organizations_error_org_admins_only":"无权访问，只有组织机构管理员可以执行此操作。","organizations_error_organization_has_users":"部门内有人员,所以不能删除","organizations_error_can_not_set_checkbox_true":"不能设置管理员或拥有者为无效","space_users_error_space_required":"工作区必填","space_users_error_space_not_found":"未找到该工作区","space_users_error_space_admins_only":"您不是该工作区的管理员","space_users_error_user_required":"user必填","space_users_error_name_required":"用户名必填","space_users_error_space_users_exists":"该用户已经存在","space_users_error_email_readonly":"用户邮箱不允许修改","space_users_error_space_readonly":"无法修改工作区","space_users_error_user_readonly":"无法修改用户","space_users_error_remove_space_owner":"不能删除工作区拥有者","space_users_error_remove_space_admins":"不能删除工作区管理员","space_users_error_phone_already_existed":"该手机号已被其他用户注册","spaces_error_login_required":"login必填","spaces_error_space_owner_only":"您不是该工作区的所有者","spaces_error_space_admins_required":"必须为工作区选择一个管理员","spaces_error_space_readonly":"工作区无法修改","users_error_email_exists":"该邮件地址已存在","users_error_username_exists":"该用户名已存在","users_error_steedos_id_required":"登录账户为必填项","users_error_steedos_id_readonly":"登录账户无法修改","users_error_cloud_admin_required":"您无权删除该用户","users_email_create_account":"已为您创建华炎云账号","users_email_start_service":"请点击以下链接，填写相关信息。","users_email_verify_account":"您已注册华炎云账号,请点击以下链接进行验证。","users_email_verify_email":"验证您的登录邮箱","users_email_reset_password":"重新设置您的密码","users_email_reset_password_body":"您的验证码为：{$token_code}\r\n请在密码重置界面输入上面的验证码，或点击以下链接，重新设置您的登录密码。","users_email_hello":"您好","users_email_thanks":"谢谢！"});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maWxlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9zdG9yZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jZnMvc3RvcmVzLmNvZmZlZSJdLCJuYW1lcyI6WyJpMThuIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsImdldEJyb3dzZXJMb2NhbGUiLCJzcHJpbnRmIiwidCIsImtleSIsInBhcmFtZXRlcnMiLCJsb2NhbGUiLCJ0cmFuc2xhdG9yIiwiY3JlYXRlVHJhbnNsYXRvciIsIl9fIiwiY29udGV4dCIsIl8iLCJpc09iamVjdCIsInRyIiwidHJsIiwic2V0T3B0aW9ucyIsInB1cmlmeSIsImRlZmF1bHRMb2NhbGUiLCJUQVBpMThuIiwiX19vcmlnaW5hbCIsIm9wdGlvbnMiLCJ0cmFuc2xhdGVkIiwiX2dldExhbmd1YWdlRmlsZVBhdGgiLCJsYW5nX3RhZyIsInBhdGgiLCJjb25mIiwiY2RuX3BhdGgiLCJpMThuX2ZpbGVzX3JvdXRlIiwicmVwbGFjZSIsIk1ldGVvciIsImFic29sdXRlVXJsIiwiaXNDbGllbnQiLCJsIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckxhbmd1YWdlIiwibGFuZ3VhZ2UiLCJpbmRleE9mIiwiU2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwicHJlZml4Iiwic2VsZiIsImVhY2giLCJfc2NoZW1hIiwidmFsdWUiLCJsYWJlbCIsIlRlbXBsYXRlIiwicmVnaXN0ZXJIZWxwZXIiLCJhcmdzIiwic3RhcnR1cCIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiVDluIiwic2V0TG9jYWxlIiwibW9tZW50IiwidXNlciIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJUYWJ1bGFyIiwidGFibGVzQnlOYW1lIiwidGFibGUiLCJjb2x1bW5zIiwiY29sdW1uIiwiZGF0YSIsInNUaXRsZSIsImNvbGxlY3Rpb24iLCJfbmFtZSIsInplcm9SZWNvcmRzIiwiY2ZzIiwiRlMiLCJIVFRQIiwic2V0QmFzZVVybCIsImdldENvbnRlbnRUeXBlIiwiZmlsZW5hbWUiLCJfZXhwIiwic3BsaXQiLCJwb3AiLCJ0b0xvd2VyQ2FzZSIsIlN0b3JhZ2VBZGFwdGVyIiwib24iLCJzdG9yZU5hbWUiLCJlcnJvciIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsIkNyZWF0b3IiLCJPYmplY3RzIiwibmFtZSIsInRhYmxlX25hbWUiLCJpY29uIiwiZW5hYmxlX3NlYXJjaCIsImVuYWJsZV9hcGkiLCJoaWRkZW4iLCJmaWVsZHMiLCJvcmlnaW5hbCIsInR5cGUiLCJibGFja2JveCIsIm9taXQiLCJtZXRhZGF0YSIsInJlZmVyZW5jZV90byIsInVwbG9hZGVkQXQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsaXN0X3ZpZXdzIiwiYWxsIiwiZmlsdGVyX3Njb3BlIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd0NyZWF0ZSIsImFsbG93RGVsZXRlIiwiYWxsb3dFZGl0IiwiYWxsb3dSZWFkIiwibW9kaWZ5QWxsUmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiYWRtaW4iLCJhY3Rpb25zIiwiZG93bmxvYWQiLCJ2aXNpYmxlIiwidG9kbyIsIm9iamVjdF9uYW1lIiwicmVjb3JkX2lkIiwiZmlsZSIsImZpbGVJZCIsImxlbmd0aCIsInJlZiIsInJlZjEiLCJyZXYiLCJ1cmwiLCJyZWNvcmQiLCJpc0NvcmRvdmEiLCJTdGVlZG9zIiwic2l6ZSIsImNvcmRvdmFEb3dubG9hZCIsImxvY2F0aW9uIiwic3RvcmVzIiwic3RvcmVfbmFtZSIsImZpbGVfc3RvcmUiLCJzZXR0aW5ncyIsInN0b3JlIiwiU3RvcmUiLCJPU1MiLCJpc1NlcnZlciIsInJlZ2lvbiIsImFsaXl1biIsImludGVybmFsIiwiYnVja2V0IiwiZm9sZGVyIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJTMyIsImF3cyIsIkZpbGVTeXN0ZW0iLCJqb2luIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJmaWxlS2V5TWFrZXIiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlbmFtZUluU3RvcmUiLCJta2RpcnAiLCJtb250aCIsIm5vdyIsInBhdGhuYW1lIiwieWVhciIsIl9nZXRJbmZvIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxhQUFBO0FBQUFDLE9BQUFDLEtBQUEsQ0FBQUMsUUFBQTtBQUFBLHVCQUFBQyxDQUFBO0FBQUFKLFdBQUFJLENBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUMsZ0JBQUEsRUFBQUMsT0FBQTtBQUNBQSxVQUFVSCxRQUFRLFlBQVIsRUFBc0JHLE9BQWhDO0FBQ0EsS0FBQ04sSUFBRCxHQUFRQSxJQUFSOztBQUVBLEtBQUNPLENBQUQsR0FBSyxVQUFDQyxHQUFELEVBQU1DLFVBQU4sRUFBa0JDLE1BQWxCO0FBQ0osTUFBQUMsVUFBQTs7QUFBQSxNQUFHRCxXQUFVLE9BQWI7QUFDQ0EsYUFBUyxPQUFUO0FDTUM7O0FESkYsTUFBR0EsTUFBSDtBQUNDQyxpQkFBYVgsS0FBS1ksZ0JBQUwsQ0FBc0IsRUFBdEIsRUFBMEJGLE1BQTFCLENBQWI7QUFERDtBQUdDQyxpQkFBYVgsS0FBS2EsRUFBbEI7QUNNQzs7QURKRixNQUFBSixjQUFBLE9BQUdBLFdBQVlLLE9BQWYsR0FBZSxNQUFmO0FBQ0NOLFVBQU1BLE1BQU0sR0FBTixHQUFZQyxXQUFXSyxPQUE3QjtBQ01DOztBREpGLE1BQUdMLGNBQUEsUUFBZ0IsQ0FBRU0sRUFBRUMsUUFBRixDQUFXUCxVQUFYLENBQXJCO0FBRUMsV0FBT0gsUUFBUUssV0FBV0gsR0FBWCxDQUFSLEVBQXlCQyxVQUF6QixDQUFQO0FDS0M7O0FESEYsU0FBT0UsV0FBV0gsR0FBWCxFQUFnQkMsVUFBaEIsQ0FBUDtBQWhCSSxDQUFMOztBQWtCQSxLQUFDUSxFQUFELEdBQU1WLENBQU47QUFFQSxLQUFDVyxHQUFELEdBQU9YLENBQVA7QUFHQVAsS0FBS21CLFVBQUwsQ0FDQztBQUFBQyxVQUFRLElBQVI7QUFDQUMsaUJBQWU7QUFEZixDQUREOztBQUlBLElBQUcsT0FBQUMsT0FBQSxvQkFBQUEsWUFBQSxJQUFIO0FBQ0NBLFVBQVFDLFVBQVIsR0FBcUJELFFBQVFULEVBQTdCOztBQUVBUyxVQUFRVCxFQUFSLEdBQWEsVUFBQ0wsR0FBRCxFQUFNZ0IsT0FBTixFQUFlZCxNQUFmO0FBRVosUUFBQWUsVUFBQTtBQUFBQSxpQkFBYWxCLEVBQUVDLEdBQUYsRUFBT2dCLE9BQVAsRUFBZ0JkLE1BQWhCLENBQWI7O0FBQ0EsUUFBR2UsZUFBY2pCLEdBQWpCO0FBQ0MsYUFBT2lCLFVBQVA7QUNLRTs7QURGSCxXQUFPSCxRQUFRQyxVQUFSLENBQW1CZixHQUFuQixFQUF3QmdCLE9BQXhCLEVBQWlDZCxNQUFqQyxDQUFQO0FBUFksR0FBYjs7QUFTQVksVUFBUUksb0JBQVIsR0FBK0IsVUFBQ0MsUUFBRDtBQUU5QixRQUFBQyxJQUFBO0FBQUFBLFdBQVUsS0FBQUMsSUFBQSxDQUFBQyxRQUFBLFdBQXNCLEtBQUVELElBQUYsQ0FBT0MsUUFBN0IsR0FBMkMsS0FBRUQsSUFBRixDQUFPRSxnQkFBNUQ7QUFDQUgsV0FBT0EsS0FBS0ksT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsQ0FBUDs7QUFDQSxRQUFHSixLQUFLLENBQUwsTUFBVyxHQUFkO0FBQ0NBLGFBQU9LLE9BQU9DLFdBQVAsR0FBcUJGLE9BQXJCLENBQTZCLE1BQTdCLEVBQXFDLEVBQXJDLElBQTJDSixJQUFsRDtBQ0lFOztBREZILFdBQVVBLE9BQUssR0FBTCxHQUFRRCxRQUFSLEdBQWlCLE9BQTNCO0FBUDhCLEdBQS9CO0FDWUE7O0FESEQsSUFBR00sT0FBT0UsUUFBVjtBQUNDOUIscUJBQW1CO0FBQ2xCLFFBQUErQixDQUFBLEVBQUExQixNQUFBO0FBQUEwQixRQUFJQyxPQUFPQyxTQUFQLENBQWlCQyxZQUFqQixJQUFpQ0YsT0FBT0MsU0FBUCxDQUFpQkUsUUFBbEQsSUFBOEQsSUFBbEU7O0FBQ0EsUUFBR0osRUFBRUssT0FBRixDQUFVLElBQVYsS0FBa0IsQ0FBckI7QUFDQy9CLGVBQVMsT0FBVDtBQUREO0FBR0NBLGVBQVMsT0FBVDtBQ09FOztBRE5ILFdBQU9BLE1BQVA7QUFOa0IsR0FBbkI7O0FBU0FnQyxlQUFhQyxTQUFiLENBQXVCM0MsSUFBdkIsR0FBOEIsVUFBQzRDLE1BQUQ7QUFDN0IsUUFBQUMsSUFBQTtBQUFBQSxXQUFPLElBQVA7QUNRRSxXRFBGOUIsRUFBRStCLElBQUYsQ0FBT0QsS0FBS0UsT0FBWixFQUFxQixVQUFDQyxLQUFELEVBQVF4QyxHQUFSO0FBQ3BCLFVBQUksQ0FBQ3dDLEtBQUw7QUFDQztBQ1FHOztBRFBKLFVBQUcsQ0FBQ0gsS0FBS0UsT0FBTCxDQUFhdkMsR0FBYixFQUFrQnlDLEtBQXRCO0FDU0ssZURSSkosS0FBS0UsT0FBTCxDQUFhdkMsR0FBYixFQUFrQnlDLEtBQWxCLEdBQTBCO0FBQ3pCLGlCQUFPMUMsRUFBRXFDLFNBQVMsR0FBVCxHQUFlcEMsSUFBSXdCLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEdBQWxCLENBQWpCLENBQVA7QUFEeUIsU0NRdEI7QUFHRDtBRGZMLE1DT0U7QURUMkIsR0FBOUI7O0FBVUFrQixXQUFTQyxjQUFULENBQXdCLEdBQXhCLEVBQTZCLFVBQUMzQyxHQUFELEVBQU00QyxJQUFOO0FBQzVCLFdBQU85QixRQUFRVCxFQUFSLENBQVdMLEdBQVgsRUFBZ0I0QyxJQUFoQixDQUFQO0FBREQ7QUFHQW5CLFNBQU9vQixPQUFQLENBQWU7QUFFZEgsYUFBU0MsY0FBVCxDQUF3QixHQUF4QixFQUE2QixVQUFDM0MsR0FBRCxFQUFNNEMsSUFBTjtBQUM1QixhQUFPOUIsUUFBUVQsRUFBUixDQUFXTCxHQUFYLEVBQWdCNEMsSUFBaEIsQ0FBUDtBQUREO0FBR0FFLFlBQVFDLEdBQVIsQ0FBWSxnQkFBWixFQUE4QmxELGtCQUE5QjtBQUVBbUQsWUFBUUMsT0FBUixDQUFnQjtBQUNmLFVBQUdILFFBQVFJLEdBQVIsQ0FBWSxnQkFBWixNQUFpQyxPQUFwQztBQUNDLFlBQUcsT0FBQXBDLE9BQUEsb0JBQUFBLFlBQUEsSUFBSDtBQUNDQSxrQkFBUXFDLFdBQVIsQ0FBb0IsT0FBcEI7QUNTSTs7QURSTEMsWUFBSUQsV0FBSixDQUFnQixPQUFoQjtBQUNBM0QsYUFBSzZELFNBQUwsQ0FBZSxPQUFmO0FDVUksZURUSkMsT0FBT3BELE1BQVAsQ0FBYyxPQUFkLENDU0k7QURkTDtBQU9DLFlBQUcsT0FBQVksT0FBQSxvQkFBQUEsWUFBQSxJQUFIO0FBQ0NBLGtCQUFRcUMsV0FBUixDQUFvQixJQUFwQjtBQ1VJOztBRFRMQyxZQUFJRCxXQUFKLENBQWdCLElBQWhCO0FBQ0EzRCxhQUFLNkQsU0FBTCxDQUFlLElBQWY7QUNXSSxlRFZKQyxPQUFPcEQsTUFBUCxDQUFjLElBQWQsQ0NVSTtBQUNEO0FEdkJMO0FBY0E4QyxZQUFRQyxPQUFSLENBQWdCO0FBQ2YsVUFBR3hCLE9BQU84QixJQUFQLEVBQUg7QUFDQyxZQUFHOUIsT0FBTzhCLElBQVAsR0FBY3JELE1BQWpCO0FDWU0saUJEWEw0QyxRQUFRQyxHQUFSLENBQVksZ0JBQVosRUFBNkJ0QixPQUFPOEIsSUFBUCxHQUFjckQsTUFBM0MsQ0NXSztBRGJQO0FDZUk7QURoQkw7QUNrQkUsV0RiRlYsS0FBS2dFLGNBQUwsQ0FBb0IsVUFBQ0MsU0FBRDtBQUVuQkMsUUFBRUMsTUFBRixDQUFTLElBQVQsRUFBZUQsRUFBRUUsRUFBRixDQUFLQyxTQUFMLENBQWVDLFFBQTlCLEVBQ0M7QUFBQTlCLGtCQUNDO0FBQUEscUJBQWtCakMsRUFBRSxvQkFBRixDQUFsQjtBQUNBLHdCQUFrQkEsRUFBRSx1QkFBRixDQURsQjtBQUVBLGtCQUFrQkEsRUFBRSxpQkFBRixDQUZsQjtBQUdBLHVCQUFrQkEsRUFBRSxzQkFBRixDQUhsQjtBQUlBLDBCQUFrQkEsRUFBRSx5QkFBRixDQUpsQjtBQUtBLHlCQUFrQkEsRUFBRSx3QkFBRixDQUxsQjtBQU1BLHVCQUFrQkEsRUFBRSxzQkFBRixDQU5sQjtBQU9BLHdCQUFrQkEsRUFBRSx1QkFBRixDQVBsQjtBQVFBLDRCQUFrQkEsRUFBRSwyQkFBRixDQVJsQjtBQVNBLHdCQUFrQkEsRUFBRSx1QkFBRixDQVRsQjtBQVVBLG9CQUFrQkEsRUFBRSxtQkFBRixDQVZsQjtBQVdBLHlCQUFrQkEsRUFBRSx3QkFBRixDQVhsQjtBQVlBLHNCQUNDO0FBQUEscUJBQWNBLEVBQUUsMkJBQUYsQ0FBZDtBQUNBLG9CQUFjQSxFQUFFLDBCQUFGLENBRGQ7QUFFQSxvQkFBY0EsRUFBRSwwQkFBRixDQUZkO0FBR0Esd0JBQWNBLEVBQUUsOEJBQUY7QUFIZCxXQWJEO0FBaUJBLGtCQUNDO0FBQUEsNkJBQWtCQSxFQUFFLCtCQUFGLENBQWxCO0FBQ0EsOEJBQWtCQSxFQUFFLGdDQUFGO0FBRGxCO0FBbEJEO0FBREQsT0FERDtBQ3NDRyxhRGZIUSxFQUFFK0IsSUFBRixDQUFPeUIsUUFBUUMsWUFBZixFQUE2QixVQUFDQyxLQUFEO0FDZ0J4QixlRGZKMUQsRUFBRStCLElBQUYsQ0FBTzJCLE1BQU1qRCxPQUFOLENBQWNrRCxPQUFyQixFQUE4QixVQUFDQyxNQUFEO0FBQzdCLGNBQUksQ0FBQ0EsT0FBT0MsSUFBUixJQUFnQkQsT0FBT0MsSUFBUCxLQUFlLEtBQW5DO0FBQ0M7QUNnQks7O0FEZk5ELGlCQUFPRSxNQUFQLEdBQWdCdEUsRUFBRSxLQUFLa0UsTUFBTUssVUFBTixDQUFpQkMsS0FBdEIsR0FBOEIsR0FBOUIsR0FBb0NKLE9BQU9DLElBQVAsQ0FBWTVDLE9BQVosQ0FBb0IsS0FBcEIsRUFBMEIsR0FBMUIsQ0FBdEMsQ0FBaEI7O0FBQ0EsY0FBRyxDQUFDeUMsTUFBTWpELE9BQU4sQ0FBY2dCLFFBQWxCO0FBQ0NpQyxrQkFBTWpELE9BQU4sQ0FBY2dCLFFBQWQsR0FBeUIsRUFBekI7QUNpQks7O0FEaEJOaUMsZ0JBQU1qRCxPQUFOLENBQWNnQixRQUFkLENBQXVCd0MsV0FBdkIsR0FBcUN6RSxFQUFFLGlCQUFGLElBQXVCQSxFQUFFa0UsTUFBTUssVUFBTixDQUFpQkMsS0FBbkIsQ0FBNUQ7QUFORCxVQ2VJO0FEaEJMLFFDZUc7QUR4Q0osTUNhRTtBRHZDSDtBQ2dGQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0pELEtBQUNFLEdBQUQsR0FBTyxFQUFQO0FBRUFoRCxPQUFPb0IsT0FBUCxDQUFlO0FDQ2IsU0RBQTZCLEdBQUdDLElBQUgsQ0FBUUMsVUFBUixDQUFtQixNQUFuQixDQ0FBO0FEREY7O0FBT0FILElBQUlJLGNBQUosR0FBcUIsVUFBQ0MsUUFBRDtBQUNqQixNQUFBQyxJQUFBOztBQUFBQSxTQUFPRCxTQUFTRSxLQUFULENBQWUsR0FBZixFQUFvQkMsR0FBcEIsR0FBMEJDLFdBQTFCLEVBQVA7O0FBQ0EsTUFBSSxNQUFNSCxJQUFOLEtBQWMsS0FBbEI7QUFDRSxXQUFPLGFBQVA7QUFERixTQUVLLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxpQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFdBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxxQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFVBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLG9CQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sb0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsS0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxXQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxLQUFsQjtBQUNILFdBQU8sb0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLFdBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyw0QkFBUDtBQURHLFNBRUEsSUFBSyxNQUFNQSxJQUFOLEtBQWMsTUFBZixJQUEyQixNQUFNQSxJQUFOLEtBQWMsT0FBN0M7QUFDSCxXQUFPLFlBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLEtBQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sWUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFlBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTyxZQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8saUJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxpQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsS0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sV0FBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywrQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLCtCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxLQUFsQjtBQUNILFdBQU8sd0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLEtBQWxCO0FBQ0gsV0FBTyxpQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsS0FBbEI7QUFDSCxXQUFPLHNCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sc0JBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLFVBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTyxXQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sdUJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsTUFBbEI7QUFDSCxXQUFPLGVBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTywrQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsU0FBbEI7QUFDSCxXQUFPLG9CQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTyxZQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sMkJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxZQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sYUFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE9BQWxCO0FBQ0gsV0FBTywwQkFBUDtBQURHLFNBRUEsSUFBSSxNQUFNQSxJQUFOLEtBQWMsT0FBbEI7QUFDSCxXQUFPLDBCQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxPQUFsQjtBQUNILFdBQU8sMEJBQVA7QUFERyxTQUVBLElBQUksTUFBTUEsSUFBTixLQUFjLE1BQWxCO0FBQ0gsV0FBTyxVQUFQO0FBREcsU0FFQSxJQUFJLE1BQU1BLElBQU4sS0FBYyxNQUFsQjtBQUNILFdBQU8saUJBQVA7QUFERztBQUdILFdBQU8sMEJBQVA7QUNESDtBRDlHa0IsQ0FBckIsQzs7Ozs7Ozs7Ozs7O0FFVEFMLEdBQUdTLGNBQUgsQ0FBa0JoRCxTQUFsQixDQUE0QmlELEVBQTVCLENBQStCLE9BQS9CLEVBQXdDLFVBQUNDLFNBQUQsRUFBWUMsS0FBWixFQUFtQkMsT0FBbkI7QUFDdENDLFVBQVFGLEtBQVIsQ0FBYyw4QkFBZDtBQUNBRSxVQUFRRixLQUFSLENBQWNBLEtBQWQ7QUFDQUUsVUFBUUYsS0FBUixDQUFjQyxPQUFkO0FDQ0EsU0RBQUMsUUFBUUYsS0FBUixDQUFjRCxTQUFkLENDQUE7QURKRjtBQU1BWCxHQUFHZSxVQUFILENBQWN0RCxTQUFkLENBQXdCaUQsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQ0UsS0FBRCxFQUFRQyxPQUFSLEVBQWlCRixTQUFqQjtBQUNsQ0csVUFBUUYsS0FBUixDQUFjLDBCQUFkO0FBQ0FFLFVBQVFGLEtBQVIsQ0FBY0EsS0FBZDtBQUNBRSxVQUFRRixLQUFSLENBQWNDLE9BQWQ7QUNFQSxTRERBQyxRQUFRRixLQUFSLENBQWNELFNBQWQsQ0NDQTtBRExGLEc7Ozs7Ozs7Ozs7OztBRU5BSyxRQUFRQyxPQUFSLENBQWdCLHNCQUFoQixJQUNDO0FBQUFDLFFBQU0sc0JBQU47QUFDQUMsY0FBWSxzQkFEWjtBQUVBcEQsU0FBTyxNQUZQO0FBR0FxRCxRQUFNLFFBSE47QUFJQUMsaUJBQWUsSUFKZjtBQUtBQyxjQUFZLElBTFo7QUFNQUMsVUFBUSxJQU5SO0FBT0FDLFVBQ0M7QUFBQUMsY0FDQztBQUFBMUQsYUFBTSxJQUFOO0FBQ0EyRCxZQUFNLFFBRE47QUFFQUMsZ0JBQVUsSUFGVjtBQUdBQyxZQUFNO0FBSE4sS0FERDtBQUtBLHFCQUNDO0FBQUE3RCxhQUFNLEtBQU47QUFDQTJELFlBQU07QUFETixLQU5EO0FBU0EscUJBQ0M7QUFBQTNELGFBQU0sTUFBTjtBQUNBMkQsWUFBTTtBQUROLEtBVkQ7QUFZQUcsY0FDQztBQUFBOUQsYUFBTSxJQUFOO0FBQ0EyRCxZQUFNLFFBRE47QUFFQUMsZ0JBQVUsSUFGVjtBQUdBQyxZQUFNO0FBSE4sS0FiRDtBQWlCQSxzQkFDQztBQUFBN0QsYUFBTSxLQUFOO0FBQ0EyRCxZQUFNLFFBRE47QUFFQUksb0JBQWMsT0FGZDtBQUdBRixZQUFNO0FBSE4sS0FsQkQ7QUFzQkEsMkJBQ0M7QUFBQTdELGFBQU0sS0FBTjtBQUNBMkQsWUFBTSxNQUROO0FBRUFFLFlBQU07QUFGTixLQXZCRDtBQTBCQSx1QkFDQztBQUFBN0QsYUFBTSxNQUFOO0FBQ0EyRCxZQUFNLGVBRE47QUFFQUksb0JBQWMsV0FGZDtBQUdBUCxjQUFRO0FBSFIsS0EzQkQ7QUErQkFRLGdCQUNDO0FBQUFoRSxhQUFNLE1BQU47QUFDQTJELFlBQU07QUFETixLQWhDRDtBQWtDQU0sZ0JBQ0M7QUFBQVQsY0FBUTtBQUFSLEtBbkNEO0FBb0NBVSxpQkFDQztBQUFBVixjQUFRO0FBQVI7QUFyQ0QsR0FSRDtBQStDQVcsY0FDQztBQUFBQyxTQUNDO0FBQUFDLG9CQUFjLE9BQWQ7QUFDQTVDLGVBQVMsQ0FBQyxlQUFELEVBQWtCLHFCQUFsQixFQUF5QyxZQUF6QyxFQUF1RCxlQUF2RDtBQURUO0FBREQsR0FoREQ7QUFvREE2QyxrQkFDQztBQUFBeEQsVUFDQztBQUFBeUQsbUJBQWEsS0FBYjtBQUNBQyxtQkFBYSxLQURiO0FBRUFDLGlCQUFXLEtBRlg7QUFHQUMsaUJBQVcsSUFIWDtBQUlBQyx3QkFBa0IsS0FKbEI7QUFLQUMsc0JBQWdCO0FBTGhCLEtBREQ7QUFPQUMsV0FDQztBQUFBTixtQkFBYSxLQUFiO0FBQ0FDLG1CQUFhLEtBRGI7QUFFQUMsaUJBQVcsS0FGWDtBQUdBQyxpQkFBVyxJQUhYO0FBSUFDLHdCQUFrQixLQUpsQjtBQUtBQyxzQkFBZ0I7QUFMaEI7QUFSRCxHQXJERDtBQW9FQUUsV0FDQztBQUFBQyxjQUNDO0FBQUEvRSxhQUFPLElBQVA7QUFDQWdGLGVBQVMsSUFEVDtBQUVBckMsVUFBSSxRQUZKO0FBR0FzQyxZQUFNLFVBQUNDLFdBQUQsRUFBY0MsU0FBZDtBQUNMLFlBQUFDLElBQUEsRUFBQUMsTUFBQSxFQUFBaEQsUUFBQSxFQUFBaUQsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLElBQUEsRUFBQUMsR0FBQSxFQUFBQyxHQUFBO0FBQUFOLGVBQU8sS0FBS08sTUFBWjtBQUNBTixpQkFBU0YsU0FBVDs7QUFDQSxZQUFHRSxNQUFIO0FBQ0MsY0FBR3JHLE9BQU80RyxTQUFWO0FBQ0NGLGtCQUFNRyxRQUFRNUcsV0FBUixDQUFvQixzQkFBb0JvRyxNQUF4QyxDQUFOO0FBQ0FoRCx1QkFBQStDLFFBQUEsUUFBQUcsTUFBQUgsS0FBQTFCLFFBQUEsWUFBQTZCLElBQTJCcEMsSUFBM0IsR0FBMkIsTUFBM0IsR0FBMkIsTUFBM0I7QUFDQXNDLGtCQUFNSixNQUFOO0FBQ0FDLHFCQUFBRixRQUFBLFFBQUFJLE9BQUFKLEtBQUExQixRQUFBLFlBQUE4QixLQUF5Qk0sSUFBekIsR0FBeUIsTUFBekIsR0FBeUIsTUFBekI7QUNjTSxtQkRiTkQsUUFBUUUsZUFBUixDQUF3QkwsR0FBeEIsRUFBNkJyRCxRQUE3QixFQUF1Q29ELEdBQXZDLEVBQTRDSCxNQUE1QyxDQ2FNO0FEbEJQO0FDb0JPLG1CRGJObEcsT0FBTzRHLFFBQVAsR0FBa0JILFFBQVE1RyxXQUFSLENBQW9CLHNCQUFvQm9HLE1BQXBCLEdBQTJCLGdCQUEvQyxDQ2FaO0FEckJSO0FDdUJLO0FEN0JOO0FBQUE7QUFERDtBQXJFRCxDQURELEM7Ozs7Ozs7Ozs7OztBRUFBLElBQUFZLE1BQUE7QUFBQUEsU0FBUyxDQUFDLFNBQUQsRUFBWSxRQUFaLEVBQXNCLFFBQXRCLEVBQWdDLFFBQWhDLEVBQTBDLE9BQTFDLENBQVQ7O0FBRUFuSSxFQUFFK0IsSUFBRixDQUFPb0csTUFBUCxFQUFlLFVBQUNDLFVBQUQ7QUFDWEM7QUFBQSxNQUFBQSxVQUFBLEVBQUFaLEdBQUEsRUFBQUMsSUFBQTs7QUFDQSxRQUFBRCxNQUFBdkcsT0FBQW9ILFFBQUEsV0FBQXBFLEdBQUEsWUFBQXVELElBQStCYyxLQUEvQixHQUErQixNQUEvQixNQUF3QyxLQUF4QztBQUNJLFFBQUdySCxPQUFPRSxRQUFWO0FBQ0lpSCxtQkFBYSxJQUFJbEUsR0FBR3FFLEtBQUgsQ0FBU0MsR0FBYixDQUFpQkwsVUFBakIsQ0FBYjtBQURKLFdBRUssSUFBR2xILE9BQU93SCxRQUFWO0FBQ0RMLG1CQUFhLElBQUlsRSxHQUFHcUUsS0FBSCxDQUFTQyxHQUFiLENBQWlCTCxVQUFqQixFQUNUO0FBQUFPLGdCQUFRekgsT0FBT29ILFFBQVAsQ0FBZ0JwRSxHQUFoQixDQUFvQjBFLE1BQXBCLENBQTJCRCxNQUFuQztBQUNBRSxrQkFBVTNILE9BQU9vSCxRQUFQLENBQWdCcEUsR0FBaEIsQ0FBb0IwRSxNQUFwQixDQUEyQkMsUUFEckM7QUFFQUMsZ0JBQVE1SCxPQUFPb0gsUUFBUCxDQUFnQnBFLEdBQWhCLENBQW9CMEUsTUFBcEIsQ0FBMkJFLE1BRm5DO0FBR0FDLGdCQUFRN0gsT0FBT29ILFFBQVAsQ0FBZ0JwRSxHQUFoQixDQUFvQjBFLE1BQXBCLENBQTJCRyxNQUhuQztBQUlBQyxxQkFBYTlILE9BQU9vSCxRQUFQLENBQWdCcEUsR0FBaEIsQ0FBb0IwRSxNQUFwQixDQUEyQkksV0FKeEM7QUFLQUMseUJBQWlCL0gsT0FBT29ILFFBQVAsQ0FBZ0JwRSxHQUFoQixDQUFvQjBFLE1BQXBCLENBQTJCSztBQUw1QyxPQURTLENBQWI7QUFKUjtBQUFBLFNBWUssTUFBQXZCLE9BQUF4RyxPQUFBb0gsUUFBQSxXQUFBcEUsR0FBQSxZQUFBd0QsS0FBK0JhLEtBQS9CLEdBQStCLE1BQS9CLE1BQXdDLElBQXhDO0FBQ0QsUUFBR3JILE9BQU9FLFFBQVY7QUFDSWlILG1CQUFhLElBQUlsRSxHQUFHcUUsS0FBSCxDQUFTVSxFQUFiLENBQWdCZCxVQUFoQixDQUFiO0FBREosV0FFSyxJQUFHbEgsT0FBT3dILFFBQVY7QUFDREwsbUJBQWEsSUFBSWxFLEdBQUdxRSxLQUFILENBQVNVLEVBQWIsQ0FBZ0JkLFVBQWhCLEVBQ1Q7QUFBQU8sZ0JBQVF6SCxPQUFPb0gsUUFBUCxDQUFnQnBFLEdBQWhCLENBQW9CaUYsR0FBcEIsQ0FBd0JSLE1BQWhDO0FBQ0FHLGdCQUFRNUgsT0FBT29ILFFBQVAsQ0FBZ0JwRSxHQUFoQixDQUFvQmlGLEdBQXBCLENBQXdCTCxNQURoQztBQUVBQyxnQkFBUTdILE9BQU9vSCxRQUFQLENBQWdCcEUsR0FBaEIsQ0FBb0JpRixHQUFwQixDQUF3QkosTUFGaEM7QUFHQUMscUJBQWE5SCxPQUFPb0gsUUFBUCxDQUFnQnBFLEdBQWhCLENBQW9CaUYsR0FBcEIsQ0FBd0JILFdBSHJDO0FBSUFDLHlCQUFpQi9ILE9BQU9vSCxRQUFQLENBQWdCcEUsR0FBaEIsQ0FBb0JpRixHQUFwQixDQUF3QkY7QUFKekMsT0FEUyxDQUFiO0FBSkg7QUFBQTtBQVdELFFBQUcvSCxPQUFPRSxRQUFWO0FBQ0lpSCxtQkFBYSxJQUFJbEUsR0FBR3FFLEtBQUgsQ0FBU1ksVUFBYixDQUF3QmhCLFVBQXhCLENBQWI7QUFESixXQUVLLElBQUdsSCxPQUFPd0gsUUFBVjtBQUNETCxtQkFBYSxJQUFJbEUsR0FBR3FFLEtBQUgsQ0FBU1ksVUFBYixDQUF3QmhCLFVBQXhCLEVBQW9DO0FBQ3pDdkgsY0FBTXpCLFFBQVEsTUFBUixFQUFnQmlLLElBQWhCLENBQXFCbEUsUUFBUW1FLGlCQUE3QixFQUFnRCxXQUFTbEIsVUFBekQsQ0FEbUM7QUFFekNtQixzQkFBYyxVQUFDdkUsT0FBRDtBQUVWLGNBQUF3RSxZQUFBLEVBQUFqRixRQUFBLEVBQUFrRixlQUFBLEVBQUFDLE1BQUEsRUFBQUMsS0FBQSxFQUFBQyxHQUFBLEVBQUEvSSxJQUFBLEVBQUFnSixRQUFBLEVBQUF0QixLQUFBLEVBQUF1QixJQUFBO0FBQUF2QixrQkFBUXZELFdBQVlBLFFBQVErRSxRQUFSLENBQWlCM0IsVUFBakIsQ0FBcEI7O0FBRUEsY0FBR0csU0FBVUEsTUFBTTlJLEdBQW5CO0FBQ0ksbUJBQU84SSxNQUFNOUksR0FBYjtBQ01qQjs7QURGYThFLHFCQUFXUyxRQUFRSyxJQUFSLEVBQVg7QUFDQW9FLDRCQUFrQnpFLFFBQVFLLElBQVIsQ0FBYTtBQUFDa0QsbUJBQU9IO0FBQVIsV0FBYixDQUFsQjtBQUVBd0IsZ0JBQU0sSUFBSUksSUFBSixFQUFOO0FBQ0FGLGlCQUFPRixJQUFJSyxXQUFKLEVBQVA7QUFDQU4sa0JBQVFDLElBQUlNLFFBQUosS0FBaUIsQ0FBekI7QUFDQXJKLGlCQUFPekIsUUFBUSxNQUFSLENBQVA7QUFDQXNLLG1CQUFTdEssUUFBUSxRQUFSLENBQVQ7QUFDQXlLLHFCQUFXaEosS0FBS3dJLElBQUwsQ0FBVWxFLFFBQVFtRSxpQkFBbEIsRUFBcUMsV0FBU2xCLFVBQVQsR0FBb0IsR0FBcEIsR0FBeUIwQixJQUF6QixHQUFnQyxHQUFoQyxHQUFzQ0gsS0FBM0UsQ0FBWDtBQUVBSCx5QkFBZTNJLEtBQUtzSixPQUFMLENBQWFOLFFBQWIsQ0FBZjtBQUVBSCxpQkFBT1UsSUFBUCxDQUFZWixZQUFaO0FBR0EsaUJBQU9NLE9BQU8sR0FBUCxHQUFhSCxLQUFiLEdBQXFCLEdBQXJCLEdBQTJCM0UsUUFBUXFGLGNBQW5DLEdBQW9ELEdBQXBELEdBQTBEckYsUUFBUXNGLEdBQWxFLEdBQXdFLEdBQXhFLElBQStFYixtQkFBbUJsRixRQUFsRyxDQUFQO0FBMUJxQztBQUFBLE9BQXBDLENBQWI7QUFkSDtBQzRDTjs7QURBQyxNQUFHNkQsZUFBYyxRQUFqQjtBQUNJbEUsUUFBSWtFLFVBQUosSUFBa0IsSUFBSWpFLEdBQUdlLFVBQVAsQ0FBa0JrRCxVQUFsQixFQUNkO0FBQUFELGNBQVEsQ0FBQ0UsVUFBRCxDQUFSO0FBQ0FrQyxjQUFRO0FBQ0pDLGVBQU87QUFDSEMsd0JBQWMsQ0FBQyxTQUFEO0FBRFg7QUFESDtBQURSLEtBRGMsQ0FBbEI7QUFESixTQVFLLElBQUdyQyxlQUFjLFFBQWQsSUFBMEJBLGVBQWMsU0FBM0M7QUFDRGxFLFFBQUlrRSxVQUFKLElBQWtCLElBQUlqRSxHQUFHZSxVQUFQLENBQWtCa0QsVUFBbEIsRUFDZDtBQUFBRCxjQUFRLENBQUNFLFVBQUQsQ0FBUjtBQUNBa0MsY0FBUTtBQUNKQyxlQUFPO0FBQ0hDLHdCQUFjLENBQUMsU0FBRDtBQURYO0FBREg7QUFEUixLQURjLENBQWxCO0FBREMsU0FRQSxJQUFHckMsZUFBYyxRQUFqQjtBQUNEbEUsUUFBSWtFLFVBQUosSUFBa0IsSUFBSWpFLEdBQUdlLFVBQVAsQ0FBa0JrRCxVQUFsQixFQUNkO0FBQUFELGNBQVEsQ0FBQ0UsVUFBRCxDQUFSO0FBQ0FrQyxjQUFRO0FBQ0pDLGVBQU87QUFDSEMsd0JBQWMsQ0FBQyxTQUFEO0FBRFg7QUFESDtBQURSLEtBRGMsQ0FBbEI7QUFEQztBQVNEdkcsUUFBSWtFLFVBQUosSUFBa0IsSUFBSWpFLEdBQUdlLFVBQVAsQ0FBa0JrRCxVQUFsQixFQUNkO0FBQUFELGNBQVEsQ0FBQ0UsVUFBRDtBQUFSLEtBRGMsQ0FBbEI7QUNPTDs7QURKQ25FLE1BQUlrRSxVQUFKLEVBQWdCb0MsS0FBaEIsQ0FDSTtBQUFBRSxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBREo7QUFFQUMsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQUhKO0FBSUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFMSjtBQU1BM0QsY0FBVTtBQUNOLGFBQU8sSUFBUDtBQVBKO0FBQUEsR0FESjs7QUFVQSxNQUFHbUIsZUFBYyxTQUFqQjtBQUNJeUMsT0FBR3pDLFVBQUgsSUFBaUJsRSxJQUFJa0UsVUFBSixDQUFqQjtBQUNBeUMsT0FBR3pDLFVBQUgsRUFBZTBDLEtBQWYsQ0FBcUJDLE1BQXJCLENBQTRCTCxNQUE1QixDQUFtQyxVQUFDTSxNQUFELEVBQVNDLEdBQVQ7QUNVckMsYURUTUEsSUFBSUQsTUFBSixHQUFhQSxNQ1NuQjtBRFZFO0FDWUw7O0FEVEMsTUFBRzVDLGVBQWMsT0FBakI7QUNXQSxXRFZJeUMsR0FBRyxTQUFPekMsVUFBUCxHQUFrQixhQUFyQixJQUFxQ2xFLElBQUlrRSxVQUFKLEVBQWdCMEMsS0NVekQ7QUFDRDtBRGpISCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcbnNwcmludGYgPSByZXF1aXJlKCdzcHJpbnRmLWpzJykuc3ByaW50ZjtcbkBpMThuID0gaTE4bjtcblxuQHQgPSAoa2V5LCBwYXJhbWV0ZXJzLCBsb2NhbGUpIC0+XG5cdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblxuXHRpZiBsb2NhbGVcblx0XHR0cmFuc2xhdG9yID0gaTE4bi5jcmVhdGVUcmFuc2xhdG9yKCcnLCBsb2NhbGUpO1xuXHRlbHNlXG5cdFx0dHJhbnNsYXRvciA9IGkxOG4uX187XG5cblx0aWYgcGFyYW1ldGVycz8uY29udGV4dFxuXHRcdGtleSA9IGtleSArIFwiX1wiICsgcGFyYW1ldGVycy5jb250ZXh0O1xuXHRcdFx0XG5cdGlmIHBhcmFtZXRlcnM/IGFuZCAhKF8uaXNPYmplY3QgcGFyYW1ldGVycylcblx0XHQjIOWFvOWuueiAgeagvOW8jyBrZXnkuK3ljIXlkKsgJXPvvIzlj6rmlK/mjIHkuIDkuKrlj4LmlbDjgIJcblx0XHRyZXR1cm4gc3ByaW50Zih0cmFuc2xhdG9yKGtleSksIHBhcmFtZXRlcnMpXG5cblx0cmV0dXJuIHRyYW5zbGF0b3Ioa2V5LCBwYXJhbWV0ZXJzKVxuXG5AdHIgPSB0XG5cbkB0cmwgPSB0XG5cbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcbmkxOG4uc2V0T3B0aW9uc1xuXHRwdXJpZnk6IG51bGxcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xuXG5pZiBUQVBpMThuP1xuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXG5cblx0VEFQaTE4bi5fXyA9IChrZXksIG9wdGlvbnMsIGxvY2FsZSktPlxuXG5cdFx0dHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1x0XHRcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcblxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxuXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XG5cblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXG5cdFx0XHRwYXRoID0gTWV0ZW9yLmFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGhcblxuXHRcdHJldHVybiBcIiN7cGF0aH0vI3tsYW5nX3RhZ30uanNvblwiXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRnZXRCcm93c2VyTG9jYWxlID0gKCktPlxuXHRcdGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbidcblx0XHRpZiBsLmluZGV4T2YoXCJ6aFwiKSA+PTBcblx0XHRcdGxvY2FsZSA9IFwiemgtY25cIlxuXHRcdGVsc2Vcblx0XHRcdGxvY2FsZSA9IFwiZW4tdXNcIlxuXHRcdHJldHVybiBsb2NhbGVcblxuXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XG5cdFx0c2VsZiA9IHRoaXNcblx0XHRfLmVhY2goc2VsZi5fc2NoZW1hLCAodmFsdWUsIGtleSkgLT5cblx0XHRcdGlmICghdmFsdWUpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0aWYgIXNlbGYuX3NjaGVtYVtrZXldLmxhYmVsXG5cdFx0XHRcdHNlbGYuX3NjaGVtYVtrZXldLmxhYmVsID0gKCktPlxuXHRcdFx0XHRcdHJldHVybiB0KHByZWZpeCArIFwiX1wiICsga2V5LnJlcGxhY2UoL1xcLi9nLFwiX1wiKSlcblx0XHQpXG5cblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcblxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxuXG5cdFx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpXG5cblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxuXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPSBcImVuLXVzXCJcblx0XHRcdFx0aWYgVEFQaTE4bj9cblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIilcblx0XHRcdFx0VDluLnNldExhbmd1YWdlKFwiemgtQ05cIilcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiemgtY25cIilcblx0XHRcdGVsc2Vcblx0XHRcdFx0aWYgVEFQaTE4bj9cblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIilcblx0XHRcdFx0VDluLnNldExhbmd1YWdlKFwiZW5cIilcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJlblwiKVxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiZW5cIilcblxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXG5cdFx0XHRcdGlmIE1ldGVvci51c2VyKCkubG9jYWxlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLE1ldGVvci51c2VyKCkubG9jYWxlKVxuXG5cdFx0aTE4bi5vbkNoYW5nZUxvY2FsZSAobmV3TG9jYWxlKS0+XG5cblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxuXHRcdFx0XHRsYW5ndWFnZTpcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuXHRcdFx0XHRcdFwiaW5mb1wiOiAgICAgICAgICAgdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcblx0XHRcdFx0XHRcImluZm9Qb3N0Rml4XCI6ICAgIHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcblx0XHRcdFx0XHRcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcblx0XHRcdFx0XHRcInplcm9SZWNvcmRzXCI6ICAgIHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcblx0XHRcdFx0XHRcdFwibGFzdFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcblx0XHRcdFx0XHRcImFyaWFcIjpcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG5cblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxuXHRcdFx0XHRfLmVhY2ggdGFibGUub3B0aW9ucy5jb2x1bW5zLCAoY29sdW1uKSAtPlxuXHRcdFx0XHRcdGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT0gXCJfaWRcIilcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpO1xuXHRcdFx0XHRcdGlmICF0YWJsZS5vcHRpb25zLmxhbmd1YWdlXG5cdFx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cblx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSlcblx0XHRcdFx0XHRyZXR1cm4gXG5cblxuIiwidmFyIGdldEJyb3dzZXJMb2NhbGUsIHNwcmludGY7XG5cbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuc3ByaW50ZiA9IHJlcXVpcmUoJ3NwcmludGYtanMnKS5zcHJpbnRmO1xuXG50aGlzLmkxOG4gPSBpMThuO1xuXG50aGlzLnQgPSBmdW5jdGlvbihrZXksIHBhcmFtZXRlcnMsIGxvY2FsZSkge1xuICB2YXIgdHJhbnNsYXRvcjtcbiAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9XG4gIGlmIChsb2NhbGUpIHtcbiAgICB0cmFuc2xhdG9yID0gaTE4bi5jcmVhdGVUcmFuc2xhdG9yKCcnLCBsb2NhbGUpO1xuICB9IGVsc2Uge1xuICAgIHRyYW5zbGF0b3IgPSBpMThuLl9fO1xuICB9XG4gIGlmIChwYXJhbWV0ZXJzICE9IG51bGwgPyBwYXJhbWV0ZXJzLmNvbnRleHQgOiB2b2lkIDApIHtcbiAgICBrZXkgPSBrZXkgKyBcIl9cIiArIHBhcmFtZXRlcnMuY29udGV4dDtcbiAgfVxuICBpZiAoKHBhcmFtZXRlcnMgIT0gbnVsbCkgJiYgIShfLmlzT2JqZWN0KHBhcmFtZXRlcnMpKSkge1xuICAgIHJldHVybiBzcHJpbnRmKHRyYW5zbGF0b3Ioa2V5KSwgcGFyYW1ldGVycyk7XG4gIH1cbiAgcmV0dXJuIHRyYW5zbGF0b3Ioa2V5LCBwYXJhbWV0ZXJzKTtcbn07XG5cbnRoaXMudHIgPSB0O1xuXG50aGlzLnRybCA9IHQ7XG5cbmkxOG4uc2V0T3B0aW9ucyh7XG4gIHB1cmlmeTogbnVsbCxcbiAgZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xufSk7XG5cbmlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gIFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX187XG4gIFRBUGkxOG4uX18gPSBmdW5jdGlvbihrZXksIG9wdGlvbnMsIGxvY2FsZSkge1xuICAgIHZhciB0cmFuc2xhdGVkO1xuICAgIHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgICBpZiAodHJhbnNsYXRlZCAhPT0ga2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICB9XG4gICAgcmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gIH07XG4gIFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSBmdW5jdGlvbihsYW5nX3RhZykge1xuICAgIHZhciBwYXRoO1xuICAgIHBhdGggPSB0aGlzLmNvbmYuY2RuX3BhdGggIT0gbnVsbCA/IHRoaXMuY29uZi5jZG5fcGF0aCA6IHRoaXMuY29uZi5pMThuX2ZpbGVzX3JvdXRlO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBNZXRlb3IuYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGggKyBcIi9cIiArIGxhbmdfdGFnICsgXCIuanNvblwiO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIGdldEJyb3dzZXJMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgbG9jYWxlO1xuICAgIGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgaWYgKGwuaW5kZXhPZihcInpoXCIpID49IDApIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtY25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxlID0gXCJlbi11c1wiO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlO1xuICB9O1xuICBTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbihwcmVmaXgpIHtcbiAgICB2YXIgc2VsZjtcbiAgICBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gXy5lYWNoKHNlbGYuX3NjaGVtYSwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXNlbGYuX3NjaGVtYVtrZXldLmxhYmVsKSB7XG4gICAgICAgIHJldHVybiBzZWxmLl9zY2hlbWFba2V5XS5sYWJlbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0KHByZWZpeCArIFwiX1wiICsga2V5LnJlcGxhY2UoL1xcLi9nLCBcIl9cIikpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gIH0pO1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgICB9KTtcbiAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT09IFwiZW4tdXNcIikge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgfVxuICAgICAgICBUOW4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKTtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIFQ5bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICBpMThuLnNldExvY2FsZShcImVuXCIpO1xuICAgICAgICByZXR1cm4gbW9tZW50LmxvY2FsZShcImVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChNZXRlb3IudXNlcigpKSB7XG4gICAgICAgIGlmIChNZXRlb3IudXNlcigpLmxvY2FsZSkge1xuICAgICAgICAgIHJldHVybiBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpMThuLm9uQ2hhbmdlTG9jYWxlKGZ1bmN0aW9uKG5ld0xvY2FsZSkge1xuICAgICAgJC5leHRlbmQodHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBcImRlY2ltYWxcIjogdChcImRhdGFUYWJsZXMuZGVjaW1hbFwiKSxcbiAgICAgICAgICBcImVtcHR5VGFibGVcIjogdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcbiAgICAgICAgICBcImluZm9cIjogdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcbiAgICAgICAgICBcImluZm9FbXB0eVwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG4gICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxuICAgICAgICAgIFwiaW5mb1Bvc3RGaXhcIjogdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXG4gICAgICAgICAgXCJ0aG91c2FuZHNcIjogdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuICAgICAgICAgIFwibGVuZ3RoTWVudVwiOiB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxuICAgICAgICAgIFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwcm9jZXNzaW5nXCI6IHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG4gICAgICAgICAgXCJzZWFyY2hcIjogdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxuICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxuICAgICAgICAgICAgXCJsYXN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXG4gICAgICAgICAgICBcIm5leHRcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubmV4dFwiKSxcbiAgICAgICAgICAgIFwicHJldmlvdXNcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiYXJpYVwiOiB7XG4gICAgICAgICAgICBcInNvcnRBc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuICAgICAgICAgICAgXCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2goVGFidWxhci50YWJsZXNCeU5hbWUsIGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2godGFibGUub3B0aW9ucy5jb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgICBpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09PSBcIl9pZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgICBpZiAoIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIkBjZnMgPSB7fVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuICBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpXG5cblxuIyDpgJrov4fmlofku7bmianlsZXlkI3ojrflj5bmlofku7Zjb250ZW50VHlwZVxuIyBodHRwOi8vcmVmZXJlbmNlLnNpdGVwb2ludC5jb20vaHRtbC9taW1lLXR5cGVzXG4jIOWPgueFp3Mz5LiK5Lyg6ZmE5Lu25ZCO55qEY29udGVudFR5cGVcbmNmcy5nZXRDb250ZW50VHlwZSA9IChmaWxlbmFtZSkgLT5cbiAgICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCcuJyArIF9leHAgPT0gJy5hdScpIFxuICAgICAgcmV0dXJuICdhdWRpby9iYXNpYydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYXZpJykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYm1wJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL2JtcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYnoyJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmNzcycpIFxuICAgICAgcmV0dXJuICd0ZXh0L2NzcydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZHRkJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5lcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmV4ZScpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmdpZicpIFxuICAgICAgcmV0dXJuICdpbWFnZS9naWYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHF4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHRtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L2h0bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmphcicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSdcbiAgICBlbHNlIGlmICgoJy4nICsgX2V4cCA9PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09ICcuanBlZycpKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvanBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qc3AnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5taWRpJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL21pZGknXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wMycpIFxuICAgICAgcmV0dXJuICdhdWRpby9tcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcGVnJykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL21wZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm9nZycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBkZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBsJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG5nJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3BuZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG90eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwc3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnF0JykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmEnKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhbScpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmRmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucnRmJykgXG4gICAgICByZXR1cm4gJ3RleHQvcnRmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zZ21sJykgXG4gICAgICByZXR1cm4gJ3RleHQvc2dtbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2l0JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2xkeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN2ZycpIFxuICAgICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zd2YnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRhci5neicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRneicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRpZmYnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvdGlmZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHN2JykgXG4gICAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnR4dCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3BsYWluJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy53YXYnKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC13YXYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsYW0nKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHNiJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bWwnKSBcbiAgICAgIHJldHVybiAndGV4dC94bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnppcCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIFxuXG5cbiIsInRoaXMuY2ZzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKTtcbn0pO1xuXG5jZnMuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgX2V4cDtcbiAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCcuJyArIF9leHAgPT09ICcuYXUnKSB7XG4gICAgcmV0dXJuICdhdWRpby9iYXNpYyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdmknKSB7XG4gICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYm1wJykge1xuICAgIHJldHVybiAnaW1hZ2UvYm1wJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJ6MicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuY3NzJykge1xuICAgIHJldHVybiAndGV4dC9jc3MnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZHRkJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvYycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2N4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXhlJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmdpZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2dpZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ocXgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHRtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvaHRtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qYXInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSc7XG4gIH0gZWxzZSBpZiAoKCcuJyArIF9leHAgPT09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT09ICcuanBlZycpKSB7XG4gICAgcmV0dXJuICdpbWFnZS9qcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5taWRpJykge1xuICAgIHJldHVybiAnYXVkaW8vbWlkaSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcDMnKSB7XG4gICAgcmV0dXJuICdhdWRpby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wZWcnKSB7XG4gICAgcmV0dXJuICd2aWRlby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm9nZycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGwnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG5nJykge1xuICAgIHJldHVybiAnaW1hZ2UvcG5nJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHBzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnF0Jykge1xuICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmFtJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJ0ZicpIHtcbiAgICByZXR1cm4gJ3RleHQvcnRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNnbWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3NnbWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2l0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNsZHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3ZnJykge1xuICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zd2YnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50YXIuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRpZmYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS90aWZmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRzdicpIHtcbiAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHh0Jykge1xuICAgIHJldHVybiAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy53YXYnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXdhdic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bGFtJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhscycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHNiJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGx0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy56aXAnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfVxufTtcbiIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaiktPlxuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKVxuICBjb25zb2xlLmVycm9yKGVycm9yKVxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKVxuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSktPlxuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcbiIsIkNyZWF0b3IuT2JqZWN0c1tcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdID0gXG5cdG5hbWU6IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIlxuXHR0YWJsZV9uYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcblx0bGFiZWw6IFwi6ZmE5Lu254mI5pysXCJcblx0aWNvbjogXCJkcmFmdHNcIlxuXHRlbmFibGVfc2VhcmNoOiB0cnVlXG5cdGVuYWJsZV9hcGk6IHRydWVcblx0aGlkZGVuOiB0cnVlXG5cdGZpZWxkczpcblx0XHRvcmlnaW5hbDpcblx0XHRcdGxhYmVsOlwi5paH5Lu2XCJcblx0XHRcdHR5cGU6IFwib2JqZWN0XCJcblx0XHRcdGJsYWNrYm94OiB0cnVlXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XCJvcmlnaW5hbC5uYW1lXCI6XG5cdFx0XHRsYWJlbDpcIuaWh+S7tuWQjVwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0IyBpc19uYW1lOiB0cnVlXG5cdFx0XCJvcmlnaW5hbC5zaXplXCI6XG5cdFx0XHRsYWJlbDpcIuaWh+S7tuWkp+Wwj1wiXG5cdFx0XHR0eXBlOiBcIm51bWJlclwiXG5cdFx0bWV0YWRhdGE6XG5cdFx0XHRsYWJlbDpcIuWxnuaAp1wiXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXG5cdFx0XHRibGFja2JveDogdHJ1ZVxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFwibWV0YWRhdGEub3duZXJcIjpcblx0XHRcdGxhYmVsOlwi5LiK5Lyg6ICFXCJcblx0XHRcdHR5cGU6IFwibG9va3VwXCJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJ1c2Vyc1wiXG5cdFx0XHRvbWl0OiB0cnVlXG5cdFx0XCJtZXRhZGF0YS5vd25lcl9uYW1lXCI6XG5cdFx0XHRsYWJlbDpcIuS4iuS8oOiAhVwiXG5cdFx0XHR0eXBlOiBcInRleHRcIlxuXHRcdFx0b21pdDogdHJ1ZVxuXHRcdFwibWV0YWRhdGEucGFyZW50XCI6XG5cdFx0XHRsYWJlbDpcIuaJgOWxnuaWh+S7tlwiXG5cdFx0XHR0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIlxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcImNtc19maWxlc1wiXG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHR1cGxvYWRlZEF0OiBcblx0XHRcdGxhYmVsOlwi5LiK5Lyg5pe26Ze0XCJcblx0XHRcdHR5cGU6IFwiZGF0ZXRpbWVcIlxuXHRcdGNyZWF0ZWRfYnk6XG5cdFx0XHRoaWRkZW46IHRydWVcblx0XHRtb2RpZmllZF9ieTpcblx0XHRcdGhpZGRlbjogdHJ1ZVxuXG5cdGxpc3Rfdmlld3M6XG5cdFx0YWxsOlxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcblx0XHRcdGNvbHVtbnM6IFtcIm9yaWdpbmFsLm5hbWVcIiwgXCJtZXRhZGF0YS5vd25lcl9uYW1lXCIsIFwidXBsb2FkZWRBdFwiLCBcIm9yaWdpbmFsLnNpemVcIl1cblx0XG5cdHBlcm1pc3Npb25fc2V0OlxuXHRcdHVzZXI6XG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2Vcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUgXG5cdFx0YWRtaW46XG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2Vcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxuXHRcdFx0YWxsb3dFZGl0OiBmYWxzZVxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxuXHRcdFx0dmlld0FsbFJlY29yZHM6IHRydWUgXG5cblx0YWN0aW9uczpcblx0XHRkb3dubG9hZDpcblx0XHRcdGxhYmVsOiBcIuS4i+i9vVwiXG5cdFx0XHR2aXNpYmxlOiB0cnVlXG5cdFx0XHRvbjogXCJyZWNvcmRcIlxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpLT5cblx0XHRcdFx0ZmlsZSA9IHRoaXMucmVjb3JkXG5cdFx0XHRcdGZpbGVJZCA9IHJlY29yZF9pZFxuXHRcdFx0XHRpZiBmaWxlSWRcblx0XHRcdFx0XHRpZiBNZXRlb3IuaXNDb3Jkb3ZhXG5cdFx0XHRcdFx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy8je2ZpbGVJZH1cIilcblx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZT8ub3JpZ2luYWw/Lm5hbWVcblx0XHRcdFx0XHRcdHJldiA9IGZpbGVJZFxuXHRcdFx0XHRcdFx0bGVuZ3RoID0gZmlsZT8ub3JpZ2luYWw/LnNpemVcblx0XHRcdFx0XHRcdFN0ZWVkb3MuY29yZG92YURvd25sb2FkKHVybCwgZmlsZW5hbWUsIHJldiwgbGVuZ3RoKVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBpL2ZpbGVzL2ZpbGVzLyN7ZmlsZUlkfT9kb3dubG9hZD10cnVlXCIpIiwiQ3JlYXRvci5PYmplY3RzW1wiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0gPSB7XG4gIG5hbWU6IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIixcbiAgdGFibGVfbmFtZTogXCJjZnMuZmlsZXMuZmlsZXJlY29yZFwiLFxuICBsYWJlbDogXCLpmYTku7bniYjmnKxcIixcbiAgaWNvbjogXCJkcmFmdHNcIixcbiAgZW5hYmxlX3NlYXJjaDogdHJ1ZSxcbiAgZW5hYmxlX2FwaTogdHJ1ZSxcbiAgaGlkZGVuOiB0cnVlLFxuICBmaWVsZHM6IHtcbiAgICBvcmlnaW5hbDoge1xuICAgICAgbGFiZWw6IFwi5paH5Lu2XCIsXG4gICAgICB0eXBlOiBcIm9iamVjdFwiLFxuICAgICAgYmxhY2tib3g6IHRydWUsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBcIm9yaWdpbmFsLm5hbWVcIjoge1xuICAgICAgbGFiZWw6IFwi5paH5Lu25ZCNXCIsXG4gICAgICB0eXBlOiBcInRleHRcIlxuICAgIH0sXG4gICAgXCJvcmlnaW5hbC5zaXplXCI6IHtcbiAgICAgIGxhYmVsOiBcIuaWh+S7tuWkp+Wwj1wiLFxuICAgICAgdHlwZTogXCJudW1iZXJcIlxuICAgIH0sXG4gICAgbWV0YWRhdGE6IHtcbiAgICAgIGxhYmVsOiBcIuWxnuaAp1wiLFxuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgXCJtZXRhZGF0YS5vd25lclwiOiB7XG4gICAgICBsYWJlbDogXCLkuIrkvKDogIVcIixcbiAgICAgIHR5cGU6IFwibG9va3VwXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwidXNlcnNcIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIFwibWV0YWRhdGEub3duZXJfbmFtZVwiOiB7XG4gICAgICBsYWJlbDogXCLkuIrkvKDogIVcIixcbiAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgXCJtZXRhZGF0YS5wYXJlbnRcIjoge1xuICAgICAgbGFiZWw6IFwi5omA5bGe5paH5Lu2XCIsXG4gICAgICB0eXBlOiBcIm1hc3Rlcl9kZXRhaWxcIixcbiAgICAgIHJlZmVyZW5jZV90bzogXCJjbXNfZmlsZXNcIixcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgdXBsb2FkZWRBdDoge1xuICAgICAgbGFiZWw6IFwi5LiK5Lyg5pe26Ze0XCIsXG4gICAgICB0eXBlOiBcImRhdGV0aW1lXCJcbiAgICB9LFxuICAgIGNyZWF0ZWRfYnk6IHtcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH0sXG4gICAgbW9kaWZpZWRfYnk6IHtcbiAgICAgIGhpZGRlbjogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbGlzdF92aWV3czoge1xuICAgIGFsbDoge1xuICAgICAgZmlsdGVyX3Njb3BlOiBcInNwYWNlXCIsXG4gICAgICBjb2x1bW5zOiBbXCJvcmlnaW5hbC5uYW1lXCIsIFwibWV0YWRhdGEub3duZXJfbmFtZVwiLCBcInVwbG9hZGVkQXRcIiwgXCJvcmlnaW5hbC5zaXplXCJdXG4gICAgfVxuICB9LFxuICBwZXJtaXNzaW9uX3NldDoge1xuICAgIHVzZXI6IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfSxcbiAgICBhZG1pbjoge1xuICAgICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgICAgYWxsb3dEZWxldGU6IGZhbHNlLFxuICAgICAgYWxsb3dFZGl0OiBmYWxzZSxcbiAgICAgIGFsbG93UmVhZDogdHJ1ZSxcbiAgICAgIG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlLFxuICAgICAgdmlld0FsbFJlY29yZHM6IHRydWVcbiAgICB9XG4gIH0sXG4gIGFjdGlvbnM6IHtcbiAgICBkb3dubG9hZDoge1xuICAgICAgbGFiZWw6IFwi5LiL6L29XCIsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgICAgb246IFwicmVjb3JkXCIsXG4gICAgICB0b2RvOiBmdW5jdGlvbihvYmplY3RfbmFtZSwgcmVjb3JkX2lkKSB7XG4gICAgICAgIHZhciBmaWxlLCBmaWxlSWQsIGZpbGVuYW1lLCBsZW5ndGgsIHJlZiwgcmVmMSwgcmV2LCB1cmw7XG4gICAgICAgIGZpbGUgPSB0aGlzLnJlY29yZDtcbiAgICAgICAgZmlsZUlkID0gcmVjb3JkX2lkO1xuICAgICAgICBpZiAoZmlsZUlkKSB7XG4gICAgICAgICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgICAgICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvYXBpL2ZpbGVzL2ZpbGVzL1wiICsgZmlsZUlkKTtcbiAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZSAhPSBudWxsID8gKHJlZiA9IGZpbGUub3JpZ2luYWwpICE9IG51bGwgPyByZWYubmFtZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICAgIHJldiA9IGZpbGVJZDtcbiAgICAgICAgICAgIGxlbmd0aCA9IGZpbGUgIT0gbnVsbCA/IChyZWYxID0gZmlsZS5vcmlnaW5hbCkgIT0gbnVsbCA/IHJlZjEuc2l6ZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiBTdGVlZG9zLmNvcmRvdmFEb3dubG9hZCh1cmwsIGZpbGVuYW1lLCByZXYsIGxlbmd0aCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy9cIiArIGZpbGVJZCArIFwiP2Rvd25sb2FkPXRydWVcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIiwic3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ11cblxuXy5lYWNoIHN0b3JlcywgKHN0b3JlX25hbWUpLT5cbiAgICBmaWxlX3N0b3JlXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Mgc3RvcmVfbmFtZSxcbiAgICAgICAgICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnJlZ2lvblxuICAgICAgICAgICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYnVja2V0XG4gICAgICAgICAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5mb2xkZXJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWRcbiAgICAgICAgICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnNlY3JldEFjY2Vzc0tleVxuXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MucmVnaW9uXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXRcbiAgICAgICAgICAgICAgICBmb2xkZXI6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmZvbGRlclxuICAgICAgICAgICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5hY2Nlc3NLZXlJZFxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XG4gICAgZWxzZVxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlS2V5TWFrZXI6IChmaWxlT2JqKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAjIExvb2t1cCB0aGUgY29weVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdG9yZSBhbmQgc3RvcmUua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRPIENVU1RPTUlaRSwgUkVQTEFDRSBDT0RFIEFGVEVSIFRISVMgUE9JTlRcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBuZXcgRGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKVxuXG4gICAgICAgICAgICAgICAgfSlcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F1ZGlvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXSAjIGFsbG93IG9ubHkgYXVkaW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXSAjIGFsbG93IG9ubHkgdmlkZW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XG4gICAgICAgIGluc2VydDogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHVwZGF0ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJlbW92ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGRvd25sb2FkOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXG4gICAgICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxuICAgICAgICAgICAgZG9jLnVzZXJJZCA9IHVzZXJJZFxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXG4gICAgICAgIGRiW1wiY2ZzLiN7c3RvcmVfbmFtZX0uZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcyIsInZhciBzdG9yZXM7XG5cbnN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddO1xuXG5fLmVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZV9uYW1lKSB7XG4gIGZpbGVfc3RvcmU7XG4gIHZhciBmaWxlX3N0b3JlLCByZWYsIHJlZjE7XG4gIGlmICgoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5yZWdpb24sXG4gICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbCxcbiAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5idWNrZXQsXG4gICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uZm9sZGVyLFxuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjEuc3RvcmUgOiB2b2lkIDApID09PSBcIlMzXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5yZWdpb24sXG4gICAgICAgIGJ1Y2tldDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYnVja2V0LFxuICAgICAgICBmb2xkZXI6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmZvbGRlcixcbiAgICAgICAgYWNjZXNzS2V5SWQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLmFjY2Vzc0tleUlkLFxuICAgICAgICBzZWNyZXRBY2Nlc3NLZXk6IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnNlY3JldEFjY2Vzc0tleVxuICAgICAgfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy9cIiArIHN0b3JlX25hbWUpLFxuICAgICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgICB2YXIgYWJzb2x1dGVQYXRoLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBta2RpcnAsIG1vbnRoLCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIChcImZpbGVzL1wiICsgc3RvcmVfbmFtZSArIFwiL1wiKSArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXVkaW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAndmlkZW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cbiAgICB9KTtcbiAgfVxuICBjZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRvd25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXTtcbiAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICByZXR1cm4gZG9jLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ZpbGVzJykge1xuICAgIHJldHVybiBkYltcImNmcy5cIiArIHN0b3JlX25hbWUgKyBcIi5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzO1xuICB9XG59KTtcbiJdfQ==
