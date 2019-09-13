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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzX2ZpbGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maWxlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9zdG9yZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9jZnMvc3RvcmVzLmNvZmZlZSJdLCJuYW1lcyI6WyJpMThuIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsImdldEJyb3dzZXJMb2NhbGUiLCJzcHJpbnRmIiwidCIsImtleSIsInBhcmFtZXRlcnMiLCJsb2NhbGUiLCJ0cmFuc2xhdG9yIiwiY3JlYXRlVHJhbnNsYXRvciIsIl9fIiwiY29udGV4dCIsIl8iLCJpc09iamVjdCIsInRyIiwidHJsIiwic2V0T3B0aW9ucyIsInB1cmlmeSIsImRlZmF1bHRMb2NhbGUiLCJUQVBpMThuIiwiX19vcmlnaW5hbCIsIm9wdGlvbnMiLCJ0cmFuc2xhdGVkIiwiX2dldExhbmd1YWdlRmlsZVBhdGgiLCJsYW5nX3RhZyIsInBhdGgiLCJjb25mIiwiY2RuX3BhdGgiLCJpMThuX2ZpbGVzX3JvdXRlIiwicmVwbGFjZSIsIk1ldGVvciIsImFic29sdXRlVXJsIiwiaXNDbGllbnQiLCJsIiwid2luZG93IiwibmF2aWdhdG9yIiwidXNlckxhbmd1YWdlIiwibGFuZ3VhZ2UiLCJpbmRleE9mIiwiU2ltcGxlU2NoZW1hIiwicHJvdG90eXBlIiwicHJlZml4Iiwic2VsZiIsImVhY2giLCJfc2NoZW1hIiwidmFsdWUiLCJsYWJlbCIsIlRlbXBsYXRlIiwicmVnaXN0ZXJIZWxwZXIiLCJhcmdzIiwic3RhcnR1cCIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiVDluIiwic2V0TG9jYWxlIiwibW9tZW50IiwidXNlciIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJUYWJ1bGFyIiwidGFibGVzQnlOYW1lIiwidGFibGUiLCJjb2x1bW5zIiwiY29sdW1uIiwiZGF0YSIsInNUaXRsZSIsImNvbGxlY3Rpb24iLCJfbmFtZSIsInplcm9SZWNvcmRzIiwiY2ZzIiwiRlMiLCJIVFRQIiwic2V0QmFzZVVybCIsImdldENvbnRlbnRUeXBlIiwiZmlsZW5hbWUiLCJfZXhwIiwic3BsaXQiLCJwb3AiLCJ0b0xvd2VyQ2FzZSIsIlN0b3JhZ2VBZGFwdGVyIiwib24iLCJzdG9yZU5hbWUiLCJlcnJvciIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsIkNyZWF0b3IiLCJPYmplY3RzIiwibmFtZSIsInRhYmxlX25hbWUiLCJpY29uIiwiZW5hYmxlX3NlYXJjaCIsImVuYWJsZV9hcGkiLCJoaWRkZW4iLCJmaWVsZHMiLCJvcmlnaW5hbCIsInR5cGUiLCJibGFja2JveCIsIm9taXQiLCJtZXRhZGF0YSIsInJlZmVyZW5jZV90byIsInVwbG9hZGVkQXQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWRfYnkiLCJsaXN0X3ZpZXdzIiwiYWxsIiwiZmlsdGVyX3Njb3BlIiwicGVybWlzc2lvbl9zZXQiLCJhbGxvd0NyZWF0ZSIsImFsbG93RGVsZXRlIiwiYWxsb3dFZGl0IiwiYWxsb3dSZWFkIiwibW9kaWZ5QWxsUmVjb3JkcyIsInZpZXdBbGxSZWNvcmRzIiwiYWRtaW4iLCJhY3Rpb25zIiwiZG93bmxvYWQiLCJ2aXNpYmxlIiwidG9kbyIsIm9iamVjdF9uYW1lIiwicmVjb3JkX2lkIiwiZmlsZSIsImZpbGVJZCIsImxlbmd0aCIsInJlZiIsInJlZjEiLCJyZXYiLCJ1cmwiLCJyZWNvcmQiLCJpc0NvcmRvdmEiLCJTdGVlZG9zIiwic2l6ZSIsImNvcmRvdmFEb3dubG9hZCIsImxvY2F0aW9uIiwic3RvcmVzIiwic3RvcmVfbmFtZSIsImZpbGVfc3RvcmUiLCJzZXR0aW5ncyIsInN0b3JlIiwiU3RvcmUiLCJPU1MiLCJpc1NlcnZlciIsInJlZ2lvbiIsImFsaXl1biIsImludGVybmFsIiwiYnVja2V0IiwiZm9sZGVyIiwiYWNjZXNzS2V5SWQiLCJzZWNyZXRBY2Nlc3NLZXkiLCJTMyIsImF3cyIsIkZpbGVTeXN0ZW0iLCJqb2luIiwic3RlZWRvc1N0b3JhZ2VEaXIiLCJmaWxlS2V5TWFrZXIiLCJhYnNvbHV0ZVBhdGgiLCJmaWxlbmFtZUluU3RvcmUiLCJta2RpcnAiLCJtb250aCIsIm5vdyIsInBhdGhuYW1lIiwieWVhciIsIl9nZXRJbmZvIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxhQUFBO0FBQUFDLE9BQUFDLEtBQUEsQ0FBQUMsUUFBQTtBQUFBLHVCQUFBQyxDQUFBO0FBQUFKLFdBQUFJLENBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUMsZ0JBQUEsRUFB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QSxJQUFJRCxNQUFKLEdBQWFBLE1DU25CO0FEVkU7QUNZTDs7QURUQyxNQUFHNUMsZUFBYyxPQUFqQjtBQ1dBLFdEVkl5QyxHQUFHLFNBQU96QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDbEUsSUFBSWtFLFVBQUosRUFBZ0IwQyxLQ1V6RDtBQUNEO0FEakhILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xyXG5zcHJpbnRmID0gcmVxdWlyZSgnc3ByaW50Zi1qcycpLnNwcmludGY7XHJcbkBpMThuID0gaTE4bjtcclxuXHJcbkB0ID0gKGtleSwgcGFyYW1ldGVycywgbG9jYWxlKSAtPlxyXG5cdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcclxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cclxuXHRpZiBsb2NhbGVcclxuXHRcdHRyYW5zbGF0b3IgPSBpMThuLmNyZWF0ZVRyYW5zbGF0b3IoJycsIGxvY2FsZSk7XHJcblx0ZWxzZVxyXG5cdFx0dHJhbnNsYXRvciA9IGkxOG4uX187XHJcblxyXG5cdGlmIHBhcmFtZXRlcnM/LmNvbnRleHRcclxuXHRcdGtleSA9IGtleSArIFwiX1wiICsgcGFyYW1ldGVycy5jb250ZXh0O1xyXG5cdFx0XHRcclxuXHRpZiBwYXJhbWV0ZXJzPyBhbmQgIShfLmlzT2JqZWN0IHBhcmFtZXRlcnMpXHJcblx0XHQjIOWFvOWuueiAgeagvOW8jyBrZXnkuK3ljIXlkKsgJXPvvIzlj6rmlK/mjIHkuIDkuKrlj4LmlbDjgIJcclxuXHRcdHJldHVybiBzcHJpbnRmKHRyYW5zbGF0b3Ioa2V5KSwgcGFyYW1ldGVycylcclxuXHJcblx0cmV0dXJuIHRyYW5zbGF0b3Ioa2V5LCBwYXJhbWV0ZXJzKVxyXG5cclxuQHRyID0gdFxyXG5cclxuQHRybCA9IHRcclxuXHJcbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcclxuaTE4bi5zZXRPcHRpb25zXHJcblx0cHVyaWZ5OiBudWxsXHJcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xyXG5cclxuaWYgVEFQaTE4bj9cclxuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXHJcblxyXG5cdFRBUGkxOG4uX18gPSAoa2V5LCBvcHRpb25zLCBsb2NhbGUpLT5cclxuXHJcblx0XHR0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XHRcdFxyXG5cdFx0aWYgdHJhbnNsYXRlZCAhPSBrZXlcclxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcclxuXHJcblx0XHQjIGkxOG4g57+76K+R5LiN5Ye65p2l77yM5bCd6K+V55SoIHRhcDppMThuIOe/u+ivkVxyXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxyXG5cclxuXHRUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gKGxhbmdfdGFnKSAtPlxyXG5cclxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcclxuXHRcdHBhdGggPSBwYXRoLnJlcGxhY2UgL1xcLyQvLCBcIlwiXHJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXHJcblx0XHRcdHBhdGggPSBNZXRlb3IuYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxyXG5cclxuXHRcdHJldHVybiBcIiN7cGF0aH0vI3tsYW5nX3RhZ30uanNvblwiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRnZXRCcm93c2VyTG9jYWxlID0gKCktPlxyXG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xyXG5cdFx0aWYgbC5pbmRleE9mKFwiemhcIikgPj0wXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtY25cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsb2NhbGUgPSBcImVuLXVzXCJcclxuXHRcdHJldHVybiBsb2NhbGVcclxuXHJcblxyXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XHJcblx0XHRzZWxmID0gdGhpc1xyXG5cdFx0Xy5lYWNoKHNlbGYuX3NjaGVtYSwgKHZhbHVlLCBrZXkpIC0+XHJcblx0XHRcdGlmICghdmFsdWUpXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGlmICFzZWxmLl9zY2hlbWFba2V5XS5sYWJlbFxyXG5cdFx0XHRcdHNlbGYuX3NjaGVtYVtrZXldLmxhYmVsID0gKCktPlxyXG5cdFx0XHRcdFx0cmV0dXJuIHQocHJlZml4ICsgXCJfXCIgKyBrZXkucmVwbGFjZSgvXFwuL2csXCJfXCIpKVxyXG5cdFx0KVxyXG5cclxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cclxuXHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XHJcblxyXG5cdE1ldGVvci5zdGFydHVwIC0+XHJcblxyXG5cdFx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XHJcblxyXG5cdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpXHJcblxyXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cclxuXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPSBcImVuLXVzXCJcclxuXHRcdFx0XHRpZiBUQVBpMThuP1xyXG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpXHJcblx0XHRcdFx0VDluLnNldExhbmd1YWdlKFwiemgtQ05cIilcclxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXHJcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcInpoLWNuXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBUQVBpMThuP1xyXG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpXHJcblx0XHRcdFx0VDluLnNldExhbmd1YWdlKFwiZW5cIilcclxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXHJcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcImVuXCIpXHJcblxyXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cclxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpXHJcblx0XHRcdGlmIE1ldGVvci51c2VyKClcclxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLE1ldGVvci51c2VyKCkubG9jYWxlKVxyXG5cclxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxyXG5cclxuXHRcdFx0JC5leHRlbmQgdHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsXHJcblx0XHRcdFx0bGFuZ3VhZ2U6XHJcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXHJcblx0XHRcdFx0XHRcImVtcHR5VGFibGVcIjogICAgIHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXHJcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXHJcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb0ZpbHRlcmVkXCI6ICAgdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcclxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxyXG5cdFx0XHRcdFx0XCJsZW5ndGhNZW51XCI6ICAgICB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxyXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcclxuXHRcdFx0XHRcdFwic2VhcmNoXCI6ICAgICAgICAgdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxyXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcclxuXHRcdFx0XHRcdFx0XCJmaXJzdFwiOiAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxyXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXHJcblx0XHRcdFx0XHRcdFwicHJldmlvdXNcIjogICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxyXG5cdFx0XHRcdFx0XCJhcmlhXCI6XHJcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxyXG5cdFx0XHRcdFx0XHRcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcclxuXHJcblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxyXG5cdFx0XHRcdF8uZWFjaCB0YWJsZS5vcHRpb25zLmNvbHVtbnMsIChjb2x1bW4pIC0+XHJcblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0Y29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLFwiX1wiKSk7XHJcblx0XHRcdFx0XHRpZiAhdGFibGUub3B0aW9ucy5sYW5ndWFnZVxyXG5cdFx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cclxuXHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKVxyXG5cdFx0XHRcdFx0cmV0dXJuIFxyXG5cclxuXHJcbiIsInZhciBnZXRCcm93c2VyTG9jYWxlLCBzcHJpbnRmO1xuXG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbnNwcmludGYgPSByZXF1aXJlKCdzcHJpbnRmLWpzJykuc3ByaW50ZjtcblxudGhpcy5pMThuID0gaTE4bjtcblxudGhpcy50ID0gZnVuY3Rpb24oa2V5LCBwYXJhbWV0ZXJzLCBsb2NhbGUpIHtcbiAgdmFyIHRyYW5zbGF0b3I7XG4gIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICBpZiAobG9jYWxlKSB7XG4gICAgdHJhbnNsYXRvciA9IGkxOG4uY3JlYXRlVHJhbnNsYXRvcignJywgbG9jYWxlKTtcbiAgfSBlbHNlIHtcbiAgICB0cmFuc2xhdG9yID0gaTE4bi5fXztcbiAgfVxuICBpZiAocGFyYW1ldGVycyAhPSBudWxsID8gcGFyYW1ldGVycy5jb250ZXh0IDogdm9pZCAwKSB7XG4gICAga2V5ID0ga2V5ICsgXCJfXCIgKyBwYXJhbWV0ZXJzLmNvbnRleHQ7XG4gIH1cbiAgaWYgKChwYXJhbWV0ZXJzICE9IG51bGwpICYmICEoXy5pc09iamVjdChwYXJhbWV0ZXJzKSkpIHtcbiAgICByZXR1cm4gc3ByaW50Zih0cmFuc2xhdG9yKGtleSksIHBhcmFtZXRlcnMpO1xuICB9XG4gIHJldHVybiB0cmFuc2xhdG9yKGtleSwgcGFyYW1ldGVycyk7XG59O1xuXG50aGlzLnRyID0gdDtcblxudGhpcy50cmwgPSB0O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gTWV0ZW9yLmFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoICsgXCIvXCIgKyBsYW5nX3RhZyArIFwiLmpzb25cIjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBnZXRCcm93c2VyTG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGwsIGxvY2FsZTtcbiAgICBsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgIGlmIChsLmluZGV4T2YoXCJ6aFwiKSA+PSAwKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLWNuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZTtcbiAgfTtcbiAgU2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gZnVuY3Rpb24ocHJlZml4KSB7XG4gICAgdmFyIHNlbGY7XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIF8uZWFjaChzZWxmLl9zY2hlbWEsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCFzZWxmLl9zY2hlbWFba2V5XS5sYWJlbCkge1xuICAgICAgICByZXR1cm4gc2VsZi5fc2NoZW1hW2tleV0ubGFiZWwgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gdChwcmVmaXggKyBcIl9cIiArIGtleS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICB9KTtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gICAgfSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9PSBcImVuLXVzXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIH1cbiAgICAgICAgVDluLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIik7XG4gICAgICAgIHJldHVybiBtb21lbnQubG9jYWxlKFwiemgtY25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBUOW4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJlblwiKTtcbiAgICAgICAgcmV0dXJuIG1vbWVudC5sb2NhbGUoXCJlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIik7XG4gICAgICBpZiAoTWV0ZW9yLnVzZXIoKSkge1xuICAgICAgICBpZiAoTWV0ZW9yLnVzZXIoKS5sb2NhbGUpIHtcbiAgICAgICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaTE4bi5vbkNoYW5nZUxvY2FsZShmdW5jdGlvbihuZXdMb2NhbGUpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKFRhYnVsYXIudGFibGVzQnlOYW1lLCBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKHRhYmxlLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgaWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PT0gXCJfaWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csIFwiX1wiKSk7XG4gICAgICAgICAgaWYgKCF0YWJsZS5vcHRpb25zLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJAY2ZzID0ge31cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcbiAgRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKVxyXG5cclxuXHJcbiMg6YCa6L+H5paH5Lu25omp5bGV5ZCN6I635Y+W5paH5Lu2Y29udGVudFR5cGVcclxuIyBodHRwOi8vcmVmZXJlbmNlLnNpdGVwb2ludC5jb20vaHRtbC9taW1lLXR5cGVzXHJcbiMg5Y+C54WnczPkuIrkvKDpmYTku7blkI7nmoRjb250ZW50VHlwZVxyXG5jZnMuZ2V0Q29udGVudFR5cGUgPSAoZmlsZW5hbWUpIC0+XHJcbiAgICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpXHJcbiAgICBpZiAoJy4nICsgX2V4cCA9PSAnLmF1JykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vYmFzaWMnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYXZpJykgXHJcbiAgICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJtcCcpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2JtcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5iejInKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmNzcycpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvY3NzJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmR0ZCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2MnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb3R4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmVzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmV4ZScpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5naWYnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9naWYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHF4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmh0bWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L2h0bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuamFyJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnXHJcbiAgICBlbHNlIGlmICgoJy4nICsgX2V4cCA9PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09ICcuanBlZycpKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9qcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzcCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5taWRpJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vbWlkaSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcDMnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9tcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wZWcnKSBcclxuICAgICAgcmV0dXJuICd2aWRlby9tcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm9nZycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wZGYnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGwnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG5nJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvcG5nJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBvdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHBzeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnF0JykgXHJcbiAgICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmFtJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmRmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJ0ZicpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvcnRmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNnbWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3NnbWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2l0JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNsZHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3ZnJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zd2YnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50YXIuZ3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRpZmYnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS90aWZmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRzdicpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHh0JykgXHJcbiAgICAgIHJldHVybiAndGV4dC9wbGFpbidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy53YXYnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXdhdidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bGFtJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhscycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHNiJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGx0eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3htbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy56aXAnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnXHJcbiAgICBlbHNlIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIFxyXG5cclxuXHJcbiIsInRoaXMuY2ZzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKTtcbn0pO1xuXG5jZnMuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgX2V4cDtcbiAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCcuJyArIF9leHAgPT09ICcuYXUnKSB7XG4gICAgcmV0dXJuICdhdWRpby9iYXNpYyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdmknKSB7XG4gICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYm1wJykge1xuICAgIHJldHVybiAnaW1hZ2UvYm1wJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJ6MicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuY3NzJykge1xuICAgIHJldHVybiAndGV4dC9jc3MnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZHRkJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvYycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2N4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXhlJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmdpZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2dpZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ocXgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHRtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvaHRtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qYXInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSc7XG4gIH0gZWxzZSBpZiAoKCcuJyArIF9leHAgPT09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT09ICcuanBlZycpKSB7XG4gICAgcmV0dXJuICdpbWFnZS9qcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5taWRpJykge1xuICAgIHJldHVybiAnYXVkaW8vbWlkaSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcDMnKSB7XG4gICAgcmV0dXJuICdhdWRpby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wZWcnKSB7XG4gICAgcmV0dXJuICd2aWRlby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm9nZycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGwnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG5nJykge1xuICAgIHJldHVybiAnaW1hZ2UvcG5nJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHBzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnF0Jykge1xuICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmFtJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJ0ZicpIHtcbiAgICByZXR1cm4gJ3RleHQvcnRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNnbWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3NnbWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2l0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNsZHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3ZnJykge1xuICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zd2YnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50YXIuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRpZmYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS90aWZmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRzdicpIHtcbiAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHh0Jykge1xuICAgIHJldHVybiAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy53YXYnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXdhdic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bGFtJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhscycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHNiJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGx0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy56aXAnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfVxufTtcbiIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaiktPlxyXG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpXHJcbiAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXHJcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpXHJcblxyXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSktPlxyXG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIilcclxuICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcclxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSkiLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaikge1xuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSkge1xuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuIiwiQ3JlYXRvci5PYmplY3RzW1wiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIl0gPSBcclxuXHRuYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcclxuXHR0YWJsZV9uYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCJcclxuXHRsYWJlbDogXCLpmYTku7bniYjmnKxcIlxyXG5cdGljb246IFwiZHJhZnRzXCJcclxuXHRlbmFibGVfc2VhcmNoOiB0cnVlXHJcblx0ZW5hYmxlX2FwaTogdHJ1ZVxyXG5cdGhpZGRlbjogdHJ1ZVxyXG5cdGZpZWxkczpcclxuXHRcdG9yaWdpbmFsOlxyXG5cdFx0XHRsYWJlbDpcIuaWh+S7tlwiXHJcblx0XHRcdHR5cGU6IFwib2JqZWN0XCJcclxuXHRcdFx0YmxhY2tib3g6IHRydWVcclxuXHRcdFx0b21pdDogdHJ1ZVxyXG5cdFx0XCJvcmlnaW5hbC5uYW1lXCI6XHJcblx0XHRcdGxhYmVsOlwi5paH5Lu25ZCNXCJcclxuXHRcdFx0dHlwZTogXCJ0ZXh0XCJcclxuXHRcdFx0IyBpc19uYW1lOiB0cnVlXHJcblx0XHRcIm9yaWdpbmFsLnNpemVcIjpcclxuXHRcdFx0bGFiZWw6XCLmlofku7blpKflsI9cIlxyXG5cdFx0XHR0eXBlOiBcIm51bWJlclwiXHJcblx0XHRtZXRhZGF0YTpcclxuXHRcdFx0bGFiZWw6XCLlsZ7mgKdcIlxyXG5cdFx0XHR0eXBlOiBcIm9iamVjdFwiXHJcblx0XHRcdGJsYWNrYm94OiB0cnVlXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFwibWV0YWRhdGEub3duZXJcIjpcclxuXHRcdFx0bGFiZWw6XCLkuIrkvKDogIVcIlxyXG5cdFx0XHR0eXBlOiBcImxvb2t1cFwiXHJcblx0XHRcdHJlZmVyZW5jZV90bzogXCJ1c2Vyc1wiXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFwibWV0YWRhdGEub3duZXJfbmFtZVwiOlxyXG5cdFx0XHRsYWJlbDpcIuS4iuS8oOiAhVwiXHJcblx0XHRcdHR5cGU6IFwidGV4dFwiXHJcblx0XHRcdG9taXQ6IHRydWVcclxuXHRcdFwibWV0YWRhdGEucGFyZW50XCI6XHJcblx0XHRcdGxhYmVsOlwi5omA5bGe5paH5Lu2XCJcclxuXHRcdFx0dHlwZTogXCJtYXN0ZXJfZGV0YWlsXCJcclxuXHRcdFx0cmVmZXJlbmNlX3RvOiBcImNtc19maWxlc1wiXHJcblx0XHRcdGhpZGRlbjogdHJ1ZVxyXG5cdFx0dXBsb2FkZWRBdDogXHJcblx0XHRcdGxhYmVsOlwi5LiK5Lyg5pe26Ze0XCJcclxuXHRcdFx0dHlwZTogXCJkYXRldGltZVwiXHJcblx0XHRjcmVhdGVkX2J5OlxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHRcdG1vZGlmaWVkX2J5OlxyXG5cdFx0XHRoaWRkZW46IHRydWVcclxuXHJcblx0bGlzdF92aWV3czpcclxuXHRcdGFsbDpcclxuXHRcdFx0ZmlsdGVyX3Njb3BlOiBcInNwYWNlXCJcclxuXHRcdFx0Y29sdW1uczogW1wib3JpZ2luYWwubmFtZVwiLCBcIm1ldGFkYXRhLm93bmVyX25hbWVcIiwgXCJ1cGxvYWRlZEF0XCIsIFwib3JpZ2luYWwuc2l6ZVwiXVxyXG5cdFxyXG5cdHBlcm1pc3Npb25fc2V0OlxyXG5cdFx0dXNlcjpcclxuXHRcdFx0YWxsb3dDcmVhdGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RGVsZXRlOiBmYWxzZVxyXG5cdFx0XHRhbGxvd0VkaXQ6IGZhbHNlXHJcblx0XHRcdGFsbG93UmVhZDogdHJ1ZVxyXG5cdFx0XHRtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZVxyXG5cdFx0XHR2aWV3QWxsUmVjb3JkczogdHJ1ZSBcclxuXHRcdGFkbWluOlxyXG5cdFx0XHRhbGxvd0NyZWF0ZTogZmFsc2VcclxuXHRcdFx0YWxsb3dEZWxldGU6IGZhbHNlXHJcblx0XHRcdGFsbG93RWRpdDogZmFsc2VcclxuXHRcdFx0YWxsb3dSZWFkOiB0cnVlXHJcblx0XHRcdG1vZGlmeUFsbFJlY29yZHM6IGZhbHNlXHJcblx0XHRcdHZpZXdBbGxSZWNvcmRzOiB0cnVlIFxyXG5cclxuXHRhY3Rpb25zOlxyXG5cdFx0ZG93bmxvYWQ6XHJcblx0XHRcdGxhYmVsOiBcIuS4i+i9vVwiXHJcblx0XHRcdHZpc2libGU6IHRydWVcclxuXHRcdFx0b246IFwicmVjb3JkXCJcclxuXHRcdFx0dG9kbzogKG9iamVjdF9uYW1lLCByZWNvcmRfaWQpLT5cclxuXHRcdFx0XHRmaWxlID0gdGhpcy5yZWNvcmRcclxuXHRcdFx0XHRmaWxlSWQgPSByZWNvcmRfaWRcclxuXHRcdFx0XHRpZiBmaWxlSWRcclxuXHRcdFx0XHRcdGlmIE1ldGVvci5pc0NvcmRvdmFcclxuXHRcdFx0XHRcdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvZmlsZXMvZmlsZXMvI3tmaWxlSWR9XCIpXHJcblx0XHRcdFx0XHRcdGZpbGVuYW1lID0gZmlsZT8ub3JpZ2luYWw/Lm5hbWVcclxuXHRcdFx0XHRcdFx0cmV2ID0gZmlsZUlkXHJcblx0XHRcdFx0XHRcdGxlbmd0aCA9IGZpbGU/Lm9yaWdpbmFsPy5zaXplXHJcblx0XHRcdFx0XHRcdFN0ZWVkb3MuY29yZG92YURvd25sb2FkKHVybCwgZmlsZW5hbWUsIHJldiwgbGVuZ3RoKVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy8je2ZpbGVJZH0/ZG93bmxvYWQ9dHJ1ZVwiKSIsIkNyZWF0b3IuT2JqZWN0c1tcImNmcy5maWxlcy5maWxlcmVjb3JkXCJdID0ge1xuICBuYW1lOiBcImNmcy5maWxlcy5maWxlcmVjb3JkXCIsXG4gIHRhYmxlX25hbWU6IFwiY2ZzLmZpbGVzLmZpbGVyZWNvcmRcIixcbiAgbGFiZWw6IFwi6ZmE5Lu254mI5pysXCIsXG4gIGljb246IFwiZHJhZnRzXCIsXG4gIGVuYWJsZV9zZWFyY2g6IHRydWUsXG4gIGVuYWJsZV9hcGk6IHRydWUsXG4gIGhpZGRlbjogdHJ1ZSxcbiAgZmllbGRzOiB7XG4gICAgb3JpZ2luYWw6IHtcbiAgICAgIGxhYmVsOiBcIuaWh+S7tlwiLFxuICAgICAgdHlwZTogXCJvYmplY3RcIixcbiAgICAgIGJsYWNrYm94OiB0cnVlLFxuICAgICAgb21pdDogdHJ1ZVxuICAgIH0sXG4gICAgXCJvcmlnaW5hbC5uYW1lXCI6IHtcbiAgICAgIGxhYmVsOiBcIuaWh+S7tuWQjVwiLFxuICAgICAgdHlwZTogXCJ0ZXh0XCJcbiAgICB9LFxuICAgIFwib3JpZ2luYWwuc2l6ZVwiOiB7XG4gICAgICBsYWJlbDogXCLmlofku7blpKflsI9cIixcbiAgICAgIHR5cGU6IFwibnVtYmVyXCJcbiAgICB9LFxuICAgIG1ldGFkYXRhOiB7XG4gICAgICBsYWJlbDogXCLlsZ7mgKdcIixcbiAgICAgIHR5cGU6IFwib2JqZWN0XCIsXG4gICAgICBibGFja2JveDogdHJ1ZSxcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIFwibWV0YWRhdGEub3duZXJcIjoge1xuICAgICAgbGFiZWw6IFwi5LiK5Lyg6ICFXCIsXG4gICAgICB0eXBlOiBcImxvb2t1cFwiLFxuICAgICAgcmVmZXJlbmNlX3RvOiBcInVzZXJzXCIsXG4gICAgICBvbWl0OiB0cnVlXG4gICAgfSxcbiAgICBcIm1ldGFkYXRhLm93bmVyX25hbWVcIjoge1xuICAgICAgbGFiZWw6IFwi5LiK5Lyg6ICFXCIsXG4gICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgIG9taXQ6IHRydWVcbiAgICB9LFxuICAgIFwibWV0YWRhdGEucGFyZW50XCI6IHtcbiAgICAgIGxhYmVsOiBcIuaJgOWxnuaWh+S7tlwiLFxuICAgICAgdHlwZTogXCJtYXN0ZXJfZGV0YWlsXCIsXG4gICAgICByZWZlcmVuY2VfdG86IFwiY21zX2ZpbGVzXCIsXG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIHVwbG9hZGVkQXQ6IHtcbiAgICAgIGxhYmVsOiBcIuS4iuS8oOaXtumXtFwiLFxuICAgICAgdHlwZTogXCJkYXRldGltZVwiXG4gICAgfSxcbiAgICBjcmVhdGVkX2J5OiB7XG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9LFxuICAgIG1vZGlmaWVkX2J5OiB7XG4gICAgICBoaWRkZW46IHRydWVcbiAgICB9XG4gIH0sXG4gIGxpc3Rfdmlld3M6IHtcbiAgICBhbGw6IHtcbiAgICAgIGZpbHRlcl9zY29wZTogXCJzcGFjZVwiLFxuICAgICAgY29sdW1uczogW1wib3JpZ2luYWwubmFtZVwiLCBcIm1ldGFkYXRhLm93bmVyX25hbWVcIiwgXCJ1cGxvYWRlZEF0XCIsIFwib3JpZ2luYWwuc2l6ZVwiXVxuICAgIH1cbiAgfSxcbiAgcGVybWlzc2lvbl9zZXQ6IHtcbiAgICB1c2VyOiB7XG4gICAgICBhbGxvd0NyZWF0ZTogZmFsc2UsXG4gICAgICBhbGxvd0RlbGV0ZTogZmFsc2UsXG4gICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgYWxsb3dSZWFkOiB0cnVlLFxuICAgICAgbW9kaWZ5QWxsUmVjb3JkczogZmFsc2UsXG4gICAgICB2aWV3QWxsUmVjb3JkczogdHJ1ZVxuICAgIH0sXG4gICAgYWRtaW46IHtcbiAgICAgIGFsbG93Q3JlYXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgICBhbGxvd1JlYWQ6IHRydWUsXG4gICAgICBtb2RpZnlBbGxSZWNvcmRzOiBmYWxzZSxcbiAgICAgIHZpZXdBbGxSZWNvcmRzOiB0cnVlXG4gICAgfVxuICB9LFxuICBhY3Rpb25zOiB7XG4gICAgZG93bmxvYWQ6IHtcbiAgICAgIGxhYmVsOiBcIuS4i+i9vVwiLFxuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIG9uOiBcInJlY29yZFwiLFxuICAgICAgdG9kbzogZnVuY3Rpb24ob2JqZWN0X25hbWUsIHJlY29yZF9pZCkge1xuICAgICAgICB2YXIgZmlsZSwgZmlsZUlkLCBmaWxlbmFtZSwgbGVuZ3RoLCByZWYsIHJlZjEsIHJldiwgdXJsO1xuICAgICAgICBmaWxlID0gdGhpcy5yZWNvcmQ7XG4gICAgICAgIGZpbGVJZCA9IHJlY29yZF9pZDtcbiAgICAgICAgaWYgKGZpbGVJZCkge1xuICAgICAgICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICAgICAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2FwaS9maWxlcy9maWxlcy9cIiArIGZpbGVJZCk7XG4gICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGUgIT0gbnVsbCA/IChyZWYgPSBmaWxlLm9yaWdpbmFsKSAhPSBudWxsID8gcmVmLm5hbWUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXYgPSBmaWxlSWQ7XG4gICAgICAgICAgICBsZW5ndGggPSBmaWxlICE9IG51bGwgPyAocmVmMSA9IGZpbGUub3JpZ2luYWwpICE9IG51bGwgPyByZWYxLnNpemUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4gU3RlZWRvcy5jb3Jkb3ZhRG93bmxvYWQodXJsLCBmaWxlbmFtZSwgcmV2LCBsZW5ndGgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9hcGkvZmlsZXMvZmlsZXMvXCIgKyBmaWxlSWQgKyBcIj9kb3dubG9hZD10cnVlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXHJcblxyXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxyXG4gICAgZmlsZV9zdG9yZVxyXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5yZWdpb25cclxuICAgICAgICAgICAgICAgIGludGVybmFsOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5pbnRlcm5hbFxyXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5idWNrZXRcclxuICAgICAgICAgICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uZm9sZGVyXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uYWNjZXNzS2V5SWRcclxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4uc2VjcmV0QWNjZXNzS2V5XHJcblxyXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnJlZ2lvblxyXG4gICAgICAgICAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXRcclxuICAgICAgICAgICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuZm9sZGVyXHJcbiAgICAgICAgICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYWNjZXNzS2V5SWRcclxuICAgICAgICAgICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XHJcbiAgICBlbHNlXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVLZXlNYWtlcjogKGZpbGVPYmopLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBTZXQgYWJzb2x1dGUgcGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpXHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdWRpb3MnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddICMgYWxsb3cgb25seSBhdWRpb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ10gIyBhbGxvdyBvbmx5IHZpZGVvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXHJcblxyXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XHJcbiAgICAgICAgaW5zZXJ0OiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIHVwZGF0ZTogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICByZW1vdmU6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgZG93bmxvYWQ6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcclxuICAgICAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXVxyXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxyXG4gICAgICAgICAgICBkb2MudXNlcklkID0gdXNlcklkXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXHJcbiAgICAgICAgZGJbXCJjZnMuI3tzdG9yZV9uYW1lfS5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzIiwidmFyIHN0b3Jlcztcblxuc3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ107XG5cbl8uZWFjaChzdG9yZXMsIGZ1bmN0aW9uKHN0b3JlX25hbWUpIHtcbiAgZmlsZV9zdG9yZTtcbiAgdmFyIGZpbGVfc3RvcmUsIHJlZiwgcmVmMTtcbiAgaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwge1xuICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLnJlZ2lvbixcbiAgICAgICAgaW50ZXJuYWw6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmludGVybmFsLFxuICAgICAgICBidWNrZXQ6IE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuLmJ1Y2tldCxcbiAgICAgICAgZm9sZGVyOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5mb2xkZXIsXG4gICAgICAgIGFjY2Vzc0tleUlkOiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5hY2Nlc3NLZXlJZCxcbiAgICAgICAgc2VjcmV0QWNjZXNzS2V5OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bi5zZWNyZXRBY2Nlc3NLZXlcbiAgICAgIH0pO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMS5zdG9yZSA6IHZvaWQgMCkgPT09IFwiUzNcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSwge1xuICAgICAgICByZWdpb246IE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzLnJlZ2lvbixcbiAgICAgICAgYnVja2V0OiBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cy5idWNrZXQsXG4gICAgICAgIGZvbGRlcjogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuZm9sZGVyLFxuICAgICAgICBhY2Nlc3NLZXlJZDogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MuYWNjZXNzS2V5SWQsXG4gICAgICAgIHNlY3JldEFjY2Vzc0tleTogTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3Muc2VjcmV0QWNjZXNzS2V5XG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICAgIGZpbGVLZXlNYWtlcjogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgICAgIHZhciBhYnNvbHV0ZVBhdGgsIGZpbGVuYW1lLCBmaWxlbmFtZUluU3RvcmUsIG1rZGlycCwgbW9udGgsIG5vdywgcGF0aCwgcGF0aG5hbWUsIHN0b3JlLCB5ZWFyO1xuICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZV9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgKFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lICsgXCIvXCIpICsgeWVhciArICcvJyArIG1vbnRoKTtcbiAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
