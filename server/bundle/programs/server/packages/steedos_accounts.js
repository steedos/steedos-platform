(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var E164 = Package['steedos:e164-phones-countries'].E164;
var IsoCountries = Package['steedos:i18n-iso-countries'].IsoCountries;
var AccountsTemplates = Package['steedos:useraccounts-core'].AccountsTemplates;
var SMS = Package['steedos:accounts-phone'].SMS;
var ServerSession = Package['steedos:base'].ServerSession;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var ECMAScript = Package.ecmascript.ECMAScript;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var Accounts = Package['accounts-base'].Accounts;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:accounts":{"i18n":{"en.i18n.json.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/i18n/en.i18n.json.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Package['universe:i18n'].i18n.addTranslations('en','',{"accounts_phone_already_existed":"The phone number is already used.","accounts_phone_invalid":"Not a valid phone","accounts_phone_code_invalid":"Not a valid code","accounts_phone_not_exist":"The phone number is not exist.","accounts_phone_enter_phone_number":"Enter your phone number","accounts_phone_swal_confirm_title":"Confirm you phone number","accounts_phone_swal_confirm_text":"We will send a verification code SMS to:\r\n %s","accounts_phone_enter_phone_code":"Enter the verification code","accounts_phone_verify_suc":"Phone number verified success!","accounts_phone_verify_suc_wait":"Phone number verified success, closing the window!","accounts_phone_verify_suc_wait_mobile":"Phone number verified success, you can close the window.","accounts_phone_swal_unreceived_title":"Fetch you phone number again","accounts_phone_swal_unreceived_text":"We will send a verification code SMS to:\r\n %s","accounts_phone_title":"Please bind the phone number","accounts_phone_country_label":"country","accounts_phone_country_cn":"China","accounts_phone_placeholder":"Enter your phone","accounts_phone_btn_send_title":"Send the verify code","accounts_phone_verify_title":"Enter the SMS code","accounts_phone_number_label":"Number","accounts_phone_code_label":"Code","accounts_phone_code_placeholder":"Enter the sms code","accounts_phone_verify_btn_send_title":"Send","accounts_phone_code_unreceived":"Fail to receive code?","accounts_phone_back":"Back","forgot_password_token_title":"Enter the code from email","forgot_password_token_placeholder":"Enter the verification code","forgot_password_token_btn_ret_pwd_title":"Reset Password","forgot_password_token_code_unreceived":"Fail to receive code?","forgot_password_token_back":"Back","steedos_phone_title":"Login with phone","accounts_phone_switch_back_normal":"Login with username or email","accounts_phone_password_title":"Reset password by sms","accounts_phone_password_suc":"Password set success!","accounts_phone_password_suc_wait":"Password set success, closing the window!","accounts_phone_password_placeholder":"New password","accounts_phone_password_again_placeholder":"Enter password again","accounts_phone_password_invalid":"Password is invalid","accounts_phone_password_again_invalid":"Two passwords are different","accounts_phone_password_btn_save_title":"Set Password","accounts_phone_too_often_retries":"Too often retries, try again in {$s} seconds!","accounts_phone_too_many_retries":"Too many retries, try again in {$m} minutes!","accounts_phone_user_not_found":"The phone number is not bound to any account!","accounts_phone_sms_failed":"SMS Failed, Something bad happened!","accounts_phone_toastr_alert":"Your account has not yet bound phone number, binding phone number, you can use SMS to log in, retrieve the password and receive SMS notification, click to start binding!","accounts_phone_swal_alert":"You do not have a phone number!","accounts_phone_swal_alert_ok":"Start binding","accounts_phone_close":"Close","accounts_space_title":"New workspace","accounts_space_btn_ok":"OK","accounts_space_calcel":"Cancel","accounts_space_placeholder":"Please enter a workspace name","accounts_space_success":"Space created successfully.","accounts_space_help":"A space is a work area, you can invite colleagues, work partners to join the work area, and then work together.","accounts_register_company_label":"Company Name","accounts_register_company_placeholder":"Please enter the company name","accounts_register_company_empty":"Company name can not be empty","accounts_register_name_label":"Admin Name","accounts_register_name_placeholder":"Please enter the admin name","accounts_register_name_empty":"The admin name can not be empty","accounts_register_email_label":"Admin Email","accounts_register_email_placeholder":"Please enter the email address","accounts_register_email_empty":"The admin mail address can not be empty","accounts_register_password_label":"Password","accounts_register_password_placeholder":"Please enter the password","accounts_register_password_empty":"The password can not be empty","accounts_register_confirmpwd_label":"Confirm Pwd","accounts_register_confirmpwd_placeholder":"Please enter the password again","accounts_register_email_exist":"The mail address already exist","accounts_register_title":"Register Company","accounts_register_company_title":"Company Information","accounts_register_admin_title":"Administrator Information","accounts_phone_code_update_fail":"Verification passed, but failed to update data, please try again later","accounts_phone_verify_fail":"Your phone number is not verified, please re-bind the phone number!"});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"zh-CN.i18n.json.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/i18n/zh-CN.i18n.json.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"accounts_phone_already_existed":"该手机号已被其他用户注册","accounts_phone_invalid":"手机号无效","accounts_phone_code_invalid":"验证码无效","accounts_phone_not_exist":"该手机号不存在","accounts_phone_enter_phone_number":"请输入手机号","accounts_phone_swal_confirm_title":"确认手机号码","accounts_phone_swal_confirm_text":"我们将发送验证码短信到这个号码：\r\n %s","accounts_phone_enter_phone_code":"请输入验证码","accounts_phone_verify_suc":"手机号验证通过！","accounts_phone_verify_suc_wait":"手机号验证通过，窗口关闭中，请稍候！","accounts_phone_verify_suc_wait_mobile":"手机号验证通过，请关闭窗口！","accounts_phone_swal_unreceived_title":"重新获取验证码","accounts_phone_swal_unreceived_text":"我们将发送验证码短信到这个号码：\r\n %s","accounts_phone_title":"请绑定手机号","accounts_phone_country_label":"国家/地区","accounts_phone_country_cn":"中国","accounts_phone_placeholder":"请输入手机号","accounts_phone_btn_send_title":"发送验证码","accounts_phone_verify_title":"请填写短信验证码","accounts_phone_number_label":"手机号","accounts_phone_code_label":"验证码","accounts_phone_code_placeholder":"请输入短信验证码","accounts_phone_verify_btn_send_title":"提交","accounts_phone_code_unreceived":"收不到验证码？","accounts_phone_back":"返回","forgot_password_token_title":"请输入邮件中的验证码","forgot_password_token_placeholder":"请输入验证码","forgot_password_token_btn_ret_pwd_title":"重置密码","forgot_password_token_code_unreceived":"收不到验证码？","forgot_password_token_back":"返回","steedos_phone_title":"手机号登录","accounts_phone_switch_back_normal":"用户名或邮件登录","accounts_phone_password_title":"重置您的密码","accounts_phone_password_suc":"密码设置成功","accounts_phone_password_suc_wait":"密码设置成功，窗口关闭中，请稍候！","accounts_phone_password_placeholder":"新密码","accounts_phone_password_again_placeholder":"再输一遍新密码","accounts_phone_password_invalid":"密码无效","accounts_phone_password_again_invalid":"两次密码不一样","accounts_phone_password_btn_save_title":"设置密码","accounts_phone_too_often_retries":"您操作太过频繁，请在{$s}秒后再发送！","accounts_phone_too_many_retries":"您操作次数过多，请在{$m}分钟后再发送！","accounts_phone_user_not_found":"该手机号未绑定到任何账户！","accounts_phone_sms_failed":"短信发送失败！","accounts_phone_toastr_alert":"您的账户尚未绑定手机号，绑定手机号后，可以用手机短信登录、取回密码以及接收短信通知等，点击开始绑定！","accounts_phone_swal_alert":"您未绑定手机号！","accounts_phone_swal_alert_ok":"开始绑定","accounts_phone_close":"关闭","accounts_space_title":"新建工作区","accounts_space_btn_ok":"确定","accounts_space_calcel":"取消","accounts_space_placeholder":"请输入工作区名称","accounts_space_success":"工作区创建成功","accounts_space_help":"一个工作区就是一个工作团队，可以邀请同事、工作伙伴加入工作区，然后一起协同办公。","accounts_register_company_label":"企业名称","accounts_register_company_placeholder":"请输入企业名称","accounts_register_company_empty":"企业名称不能为空","accounts_register_name_label":"管理员姓名","accounts_register_name_placeholder":"请输入管理员姓名","accounts_register_name_empty":"管理员姓名不能为空","accounts_register_email_label":"管理员邮箱","accounts_register_email_placeholder":"请输入邮箱地址","accounts_register_email_empty":"管理员邮箱不能为空","accounts_register_password_label":"密码","accounts_register_password_placeholder":"请输入密码","accounts_register_password_empty":"密码不能为空","accounts_register_confirmpwd_label":"确认密码","accounts_register_confirmpwd_placeholder":"请再输一次密码","accounts_register_email_exist":"邮箱地址已被占用","accounts_register_title":"注册企业","accounts_register_company_title":"企业信息","accounts_register_admin_title":"管理员信息","accounts_phone_code_update_fail":"验证通过，但是更新数据失败，请稍后再试","accounts_phone_verify_fail":"您的手机号未验证，请重新绑定手机号！"});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"checkNpm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/checkNpm.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  cookies: "^0.6.2",
  phone: "^1.0.12",
  sha256: "^0.2.0"
}, 'steedos:accounts');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"URI.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/lib/URI.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/*!
 * URI.js - Mutating URLs
 *
 * Version: 1.17.0
 *
 * Author: Rodney Rehm
 * Web: http://medialize.github.io/URI.js/
 *
 * Licensed under
 *   MIT License http://www.opensource.org/licenses/mit-license
 *   GPL v3 http://opensource.org/licenses/GPL-3.0
 *
 */
(function (root, factory) {
  'use strict'; // https://github.com/umdjs/umd/blob/master/returnExports.js
  // if (typeof exports === 'object') {
  //   // Node
  //   module.exports = factory(require('./punycode'), require('./IPv6'), require('./SecondLevelDomains'));
  // } else

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['./punycode', './IPv6', './SecondLevelDomains'], factory);
  } else {
    // Browser globals (root is window)
    root.URI = factory(root.punycode, root.IPv6, root.SecondLevelDomains, root);
  }
})(this, function (punycode, IPv6, SLD, root) {
  'use strict';
  /*global location, escape, unescape */
  // FIXME: v2.0.0 renamce non-camelCase properties to uppercase

  /*jshint camelcase: false */
  // save current URI variable, if any

  var _URI = root && root.URI;

  function URI(url, base) {
    var _urlSupplied = arguments.length >= 1;

    var _baseSupplied = arguments.length >= 2; // Allow instantiation without the 'new' keyword


    if (!(this instanceof URI)) {
      if (_urlSupplied) {
        if (_baseSupplied) {
          return new URI(url, base);
        }

        return new URI(url);
      }

      return new URI();
    }

    if (url === undefined) {
      if (_urlSupplied) {
        throw new TypeError('undefined is not a valid argument for URI');
      }

      if (typeof location !== 'undefined') {
        url = location.href + '';
      } else {
        url = '';
      }
    }

    this.href(url); // resolve to base according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#constructor

    if (base !== undefined) {
      return this.absoluteTo(base);
    }

    return this;
  }

  URI.version = '1.17.0';
  var p = URI.prototype;
  var hasOwn = Object.prototype.hasOwnProperty;

  function escapeRegEx(string) {
    // https://github.com/medialize/URI.js/commit/85ac21783c11f8ccab06106dba9735a31a86924d#commitcomment-821963
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  function getType(value) {
    // IE8 doesn't return [Object Undefined] but [Object Object] for undefined value
    if (value === undefined) {
      return 'Undefined';
    }

    return String(Object.prototype.toString.call(value)).slice(8, -1);
  }

  function isArray(obj) {
    return getType(obj) === 'Array';
  }

  function filterArrayValues(data, value) {
    var lookup = {};
    var i, length;

    if (getType(value) === 'RegExp') {
      lookup = null;
    } else if (isArray(value)) {
      for (i = 0, length = value.length; i < length; i++) {
        lookup[value[i]] = true;
      }
    } else {
      lookup[value] = true;
    }

    for (i = 0, length = data.length; i < length; i++) {
      /*jshint laxbreak: true */
      var _match = lookup && lookup[data[i]] !== undefined || !lookup && value.test(data[i]);
      /*jshint laxbreak: false */


      if (_match) {
        data.splice(i, 1);
        length--;
        i--;
      }
    }

    return data;
  }

  function arrayContains(list, value) {
    var i, length; // value may be string, number, array, regexp

    if (isArray(value)) {
      // Note: this can be optimized to O(n) (instead of current O(m * n))
      for (i = 0, length = value.length; i < length; i++) {
        if (!arrayContains(list, value[i])) {
          return false;
        }
      }

      return true;
    }

    var _type = getType(value);

    for (i = 0, length = list.length; i < length; i++) {
      if (_type === 'RegExp') {
        if (typeof list[i] === 'string' && list[i].match(value)) {
          return true;
        }
      } else if (list[i] === value) {
        return true;
      }
    }

    return false;
  }

  function arraysEqual(one, two) {
    if (!isArray(one) || !isArray(two)) {
      return false;
    } // arrays can't be equal if they have different amount of content


    if (one.length !== two.length) {
      return false;
    }

    one.sort();
    two.sort();

    for (var i = 0, l = one.length; i < l; i++) {
      if (one[i] !== two[i]) {
        return false;
      }
    }

    return true;
  }

  function trimSlashes(text) {
    var trim_expression = /^\/+|\/+$/g;
    return text.replace(trim_expression, '');
  }

  URI._parts = function () {
    return {
      protocol: null,
      username: null,
      password: null,
      hostname: null,
      urn: null,
      port: null,
      path: null,
      query: null,
      fragment: null,
      // state
      duplicateQueryParameters: URI.duplicateQueryParameters,
      escapeQuerySpace: URI.escapeQuerySpace
    };
  }; // state: allow duplicate query parameters (a=1&a=1)


  URI.duplicateQueryParameters = false; // state: replaces + with %20 (space in query strings)

  URI.escapeQuerySpace = true; // static properties

  URI.protocol_expression = /^[a-z][a-z0-9.+-]*$/i;
  URI.idn_expression = /[^a-z0-9\.-]/i;
  URI.punycode_expression = /(xn--)/i; // well, 333.444.555.666 matches, but it sure ain't no IPv4 - do we care?

  URI.ip4_expression = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/; // credits to Rich Brown
  // source: http://forums.intermapper.com/viewtopic.php?p=1096#1096
  // specification: http://www.ietf.org/rfc/rfc4291.txt

  URI.ip6_expression = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/; // expression used is "gruber revised" (@gruber v2) determined to be the
  // best solution in a regex-golf we did a couple of ages ago at
  // * http://mathiasbynens.be/demo/url-regex
  // * http://rodneyrehm.de/t/url-regex.html

  URI.find_uri_expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/ig;
  URI.findUri = {
    // valid "scheme://" or "www."
    start: /\b(?:([a-z][a-z0-9.+-]*:\/\/)|www\.)/gi,
    // everything up to the next whitespace
    end: /[\s\r\n]|$/,
    // trim trailing punctuation captured by end RegExp
    trim: /[`!()\[\]{};:'".,<>?«»“”„‘’]+$/
  }; // http://www.iana.org/assignments/uri-schemes.html
  // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers#Well-known_ports

  URI.defaultPorts = {
    http: '80',
    https: '443',
    ftp: '21',
    gopher: '70',
    ws: '80',
    wss: '443'
  }; // allowed hostname characters according to RFC 3986
  // ALPHA DIGIT "-" "." "_" "~" "!" "$" "&" "'" "(" ")" "*" "+" "," ";" "=" %encoded
  // I've never seen a (non-IDN) hostname other than: ALPHA DIGIT . -

  URI.invalid_hostname_characters = /[^a-zA-Z0-9\.-]/; // map DOM Elements to their URI attribute

  URI.domAttributes = {
    'a': 'href',
    'blockquote': 'cite',
    'link': 'href',
    'base': 'href',
    'script': 'src',
    'form': 'action',
    'img': 'src',
    'area': 'href',
    'iframe': 'src',
    'embed': 'src',
    'source': 'src',
    'track': 'src',
    'input': 'src',
    // but only if type="image"
    'audio': 'src',
    'video': 'src'
  };

  URI.getDomAttribute = function (node) {
    if (!node || !node.nodeName) {
      return undefined;
    }

    var nodeName = node.nodeName.toLowerCase(); // <input> should only expose src for type="image"

    if (nodeName === 'input' && node.type !== 'image') {
      return undefined;
    }

    return URI.domAttributes[nodeName];
  };

  function escapeForDumbFirefox36(value) {
    // https://github.com/medialize/URI.js/issues/91
    return escape(value);
  } // encoding / decoding according to RFC3986


  function strictEncodeURIComponent(string) {
    // see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/encodeURIComponent
    return encodeURIComponent(string).replace(/[!'()*]/g, escapeForDumbFirefox36).replace(/\*/g, '%2A');
  }

  URI.encode = strictEncodeURIComponent;
  URI.decode = decodeURIComponent;

  URI.iso8859 = function () {
    URI.encode = escape;
    URI.decode = unescape;
  };

  URI.unicode = function () {
    URI.encode = strictEncodeURIComponent;
    URI.decode = decodeURIComponent;
  };

  URI.characters = {
    pathname: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(24|26|2B|2C|3B|3D|3A|40)/ig,
        map: {
          // -._~!'()*
          '%24': '$',
          '%26': '&',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%3A': ':',
          '%40': '@'
        }
      },
      decode: {
        expression: /[\/\?#]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23'
        }
      }
    },
    reserved: {
      encode: {
        // RFC3986 2.1: For consistency, URI producers and normalizers should
        // use uppercase hexadecimal digits for all percent-encodings.
        expression: /%(21|23|24|26|27|28|29|2A|2B|2C|2F|3A|3B|3D|3F|40|5B|5D)/ig,
        map: {
          // gen-delims
          '%3A': ':',
          '%2F': '/',
          '%3F': '?',
          '%23': '#',
          '%5B': '[',
          '%5D': ']',
          '%40': '@',
          // sub-delims
          '%21': '!',
          '%24': '$',
          '%26': '&',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '='
        }
      }
    },
    urnpath: {
      // The characters under `encode` are the characters called out by RFC 2141 as being acceptable
      // for usage in a URN. RFC2141 also calls out "-", ".", and "_" as acceptable characters, but
      // these aren't encoded by encodeURIComponent, so we don't have to call them out here. Also
      // note that the colon character is not featured in the encoding map; this is because URI.js
      // gives the colons in URNs semantic meaning as the delimiters of path segements, and so it
      // should not appear unencoded in a segment itself.
      // See also the note above about RFC3986 and capitalalized hex digits.
      encode: {
        expression: /%(21|24|27|28|29|2A|2B|2C|3B|3D|40)/ig,
        map: {
          '%21': '!',
          '%24': '$',
          '%27': '\'',
          '%28': '(',
          '%29': ')',
          '%2A': '*',
          '%2B': '+',
          '%2C': ',',
          '%3B': ';',
          '%3D': '=',
          '%40': '@'
        }
      },
      // These characters are the characters called out by RFC2141 as "reserved" characters that
      // should never appear in a URN, plus the colon character (see note above).
      decode: {
        expression: /[\/\?#:]/g,
        map: {
          '/': '%2F',
          '?': '%3F',
          '#': '%23',
          ':': '%3A'
        }
      }
    }
  };

  URI.encodeQuery = function (string, escapeQuerySpace) {
    var escaped = URI.encode(string + '');

    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    return escapeQuerySpace ? escaped.replace(/%20/g, '+') : escaped;
  };

  URI.decodeQuery = function (string, escapeQuerySpace) {
    string += '';

    if (escapeQuerySpace === undefined) {
      escapeQuerySpace = URI.escapeQuerySpace;
    }

    try {
      return URI.decode(escapeQuerySpace ? string.replace(/\+/g, '%20') : string);
    } catch (e) {
      // we're not going to mess with weird encodings,
      // give up and return the undecoded original string
      // see https://github.com/medialize/URI.js/issues/87
      // see https://github.com/medialize/URI.js/issues/92
      return string;
    }
  }; // generate encode/decode path functions


  var _parts = {
    'encode': 'encode',
    'decode': 'decode'
  };

  var _part;

  var generateAccessor = function (_group, _part) {
    return function (string) {
      try {
        return URI[_part](string + '').replace(URI.characters[_group][_part].expression, function (c) {
          return URI.characters[_group][_part].map[c];
        });
      } catch (e) {
        // we're not going to mess with weird encodings,
        // give up and return the undecoded original string
        // see https://github.com/medialize/URI.js/issues/87
        // see https://github.com/medialize/URI.js/issues/92
        return string;
      }
    };
  };

  for (_part in _parts) {
    URI[_part + 'PathSegment'] = generateAccessor('pathname', _parts[_part]);
    URI[_part + 'UrnPathSegment'] = generateAccessor('urnpath', _parts[_part]);
  }

  var generateSegmentedPathFunction = function (_sep, _codingFuncName, _innerCodingFuncName) {
    return function (string) {
      // Why pass in names of functions, rather than the function objects themselves? The
      // definitions of some functions (but in particular, URI.decode) will occasionally change due
      // to URI.js having ISO8859 and Unicode modes. Passing in the name and getting it will ensure
      // that the functions we use here are "fresh".
      var actualCodingFunc;

      if (!_innerCodingFuncName) {
        actualCodingFunc = URI[_codingFuncName];
      } else {
        actualCodingFunc = function (string) {
          return URI[_codingFuncName](URI[_innerCodingFuncName](string));
        };
      }

      var segments = (string + '').split(_sep);

      for (var i = 0, length = segments.length; i < length; i++) {
        segments[i] = actualCodingFunc(segments[i]);
      }

      return segments.join(_sep);
    };
  }; // This takes place outside the above loop because we don't want, e.g., encodeUrnPath functions.


  URI.decodePath = generateSegmentedPathFunction('/', 'decodePathSegment');
  URI.decodeUrnPath = generateSegmentedPathFunction(':', 'decodeUrnPathSegment');
  URI.recodePath = generateSegmentedPathFunction('/', 'encodePathSegment', 'decode');
  URI.recodeUrnPath = generateSegmentedPathFunction(':', 'encodeUrnPathSegment', 'decode');
  URI.encodeReserved = generateAccessor('reserved', 'encode');

  URI.parse = function (string, parts) {
    var pos;

    if (!parts) {
      parts = {};
    } // [protocol"://"[username[":"password]"@"]hostname[":"port]"/"?][path]["?"querystring]["#"fragment]
    // extract fragment


    pos = string.indexOf('#');

    if (pos > -1) {
      // escaping?
      parts.fragment = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    } // extract query


    pos = string.indexOf('?');

    if (pos > -1) {
      // escaping?
      parts.query = string.substring(pos + 1) || null;
      string = string.substring(0, pos);
    } // extract protocol


    if (string.substring(0, 2) === '//') {
      // relative-scheme
      parts.protocol = null;
      string = string.substring(2); // extract "user:pass@host:port"

      string = URI.parseAuthority(string, parts);
    } else {
      pos = string.indexOf(':');

      if (pos > -1) {
        parts.protocol = string.substring(0, pos) || null;

        if (parts.protocol && !parts.protocol.match(URI.protocol_expression)) {
          // : may be within the path
          parts.protocol = undefined;
        } else if (string.substring(pos + 1, pos + 3) === '//') {
          string = string.substring(pos + 3); // extract "user:pass@host:port"

          string = URI.parseAuthority(string, parts);
        } else {
          string = string.substring(pos + 1);
          parts.urn = true;
        }
      }
    } // what's left must be the path


    parts.path = string; // and we're done

    return parts;
  };

  URI.parseHost = function (string, parts) {
    // Copy chrome, IE, opera backslash-handling behavior.
    // Back slashes before the query string get converted to forward slashes
    // See: https://github.com/joyent/node/blob/386fd24f49b0e9d1a8a076592a404168faeecc34/lib/url.js#L115-L124
    // See: https://code.google.com/p/chromium/issues/detail?id=25916
    // https://github.com/medialize/URI.js/pull/233
    string = string.replace(/\\/g, '/'); // extract host:port

    var pos = string.indexOf('/');
    var bracketPos;
    var t;

    if (pos === -1) {
      pos = string.length;
    }

    if (string.charAt(0) === '[') {
      // IPv6 host - http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04#section-6
      // I claim most client software breaks on IPv6 anyways. To simplify things, URI only accepts
      // IPv6+port in the format [2001:db8::1]:80 (for the time being)
      bracketPos = string.indexOf(']');
      parts.hostname = string.substring(1, bracketPos) || null;
      parts.port = string.substring(bracketPos + 2, pos) || null;

      if (parts.port === '/') {
        parts.port = null;
      }
    } else {
      var firstColon = string.indexOf(':');
      var firstSlash = string.indexOf('/');
      var nextColon = string.indexOf(':', firstColon + 1);

      if (nextColon !== -1 && (firstSlash === -1 || nextColon < firstSlash)) {
        // IPv6 host contains multiple colons - but no port
        // this notation is actually not allowed by RFC 3986, but we're a liberal parser
        parts.hostname = string.substring(0, pos) || null;
        parts.port = null;
      } else {
        t = string.substring(0, pos).split(':');
        parts.hostname = t[0] || null;
        parts.port = t[1] || null;
      }
    }

    if (parts.hostname && string.substring(pos).charAt(0) !== '/') {
      pos++;
      string = '/' + string;
    }

    return string.substring(pos) || '/';
  };

  URI.parseAuthority = function (string, parts) {
    string = URI.parseUserinfo(string, parts);
    return URI.parseHost(string, parts);
  };

  URI.parseUserinfo = function (string, parts) {
    // extract username:password
    var firstSlash = string.indexOf('/');
    var pos = string.lastIndexOf('@', firstSlash > -1 ? firstSlash : string.length - 1);
    var t; // authority@ must come before /path

    if (pos > -1 && (firstSlash === -1 || pos < firstSlash)) {
      t = string.substring(0, pos).split(':');
      parts.username = t[0] ? URI.decode(t[0]) : null;
      t.shift();
      parts.password = t[0] ? URI.decode(t.join(':')) : null;
      string = string.substring(pos + 1);
    } else {
      parts.username = null;
      parts.password = null;
    }

    return string;
  };

  URI.parseQuery = function (string, escapeQuerySpace) {
    if (!string) {
      return {};
    } // throw out the funky business - "?"[name"="value"&"]+


    string = string.replace(/&+/g, '&').replace(/^\?*&*|&+$/g, '');

    if (!string) {
      return {};
    }

    var items = {};
    var splits = string.split('&');
    var length = splits.length;
    var v, name, value;

    for (var i = 0; i < length; i++) {
      v = splits[i].split('=');
      name = URI.decodeQuery(v.shift(), escapeQuerySpace); // no "=" is null according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#collect-url-parameters

      value = v.length ? URI.decodeQuery(v.join('='), escapeQuerySpace) : null;

      if (hasOwn.call(items, name)) {
        if (typeof items[name] === 'string' || items[name] === null) {
          items[name] = [items[name]];
        }

        items[name].push(value);
      } else {
        items[name] = value;
      }
    }

    return items;
  };

  URI.build = function (parts) {
    var t = '';

    if (parts.protocol) {
      t += parts.protocol + ':';
    }

    if (!parts.urn && (t || parts.hostname)) {
      t += '//';
    }

    t += URI.buildAuthority(parts) || '';

    if (typeof parts.path === 'string') {
      if (parts.path.charAt(0) !== '/' && typeof parts.hostname === 'string') {
        t += '/';
      }

      t += parts.path;
    }

    if (typeof parts.query === 'string' && parts.query) {
      t += '?' + parts.query;
    }

    if (typeof parts.fragment === 'string' && parts.fragment) {
      t += '#' + parts.fragment;
    }

    return t;
  };

  URI.buildHost = function (parts) {
    var t = '';

    if (!parts.hostname) {
      return '';
    } else if (URI.ip6_expression.test(parts.hostname)) {
      t += '[' + parts.hostname + ']';
    } else {
      t += parts.hostname;
    }

    if (parts.port) {
      t += ':' + parts.port;
    }

    return t;
  };

  URI.buildAuthority = function (parts) {
    return URI.buildUserinfo(parts) + URI.buildHost(parts);
  };

  URI.buildUserinfo = function (parts) {
    var t = '';

    if (parts.username) {
      t += URI.encode(parts.username);

      if (parts.password) {
        t += ':' + URI.encode(parts.password);
      }

      t += '@';
    }

    return t;
  };

  URI.buildQuery = function (data, duplicateQueryParameters, escapeQuerySpace) {
    // according to http://tools.ietf.org/html/rfc3986 or http://labs.apache.org/webarch/uri/rfc/rfc3986.html
    // being »-._~!$&'()*+,;=:@/?« %HEX and alnum are allowed
    // the RFC explicitly states ?/foo being a valid use case, no mention of parameter syntax!
    // URI.js treats the query string as being application/x-www-form-urlencoded
    // see http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type
    var t = '';
    var unique, key, i, length;

    for (key in data) {
      if (hasOwn.call(data, key) && key) {
        if (isArray(data[key])) {
          unique = {};

          for (i = 0, length = data[key].length; i < length; i++) {
            if (data[key][i] !== undefined && unique[data[key][i] + ''] === undefined) {
              t += '&' + URI.buildQueryParameter(key, data[key][i], escapeQuerySpace);

              if (duplicateQueryParameters !== true) {
                unique[data[key][i] + ''] = true;
              }
            }
          }
        } else if (data[key] !== undefined) {
          t += '&' + URI.buildQueryParameter(key, data[key], escapeQuerySpace);
        }
      }
    }

    return t.substring(1);
  };

  URI.buildQueryParameter = function (name, value, escapeQuerySpace) {
    // http://www.w3.org/TR/REC-html40/interact/forms.html#form-content-type -- application/x-www-form-urlencoded
    // don't append "=" for null values, according to http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html#url-parameter-serialization
    return URI.encodeQuery(name, escapeQuerySpace) + (value !== null ? '=' + URI.encodeQuery(value, escapeQuerySpace) : '');
  };

  URI.addQuery = function (data, name, value) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          URI.addQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (data[name] === undefined) {
        data[name] = value;
        return;
      } else if (typeof data[name] === 'string') {
        data[name] = [data[name]];
      }

      if (!isArray(value)) {
        value = [value];
      }

      data[name] = (data[name] || []).concat(value);
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }
  };

  URI.removeQuery = function (data, name, value) {
    var i, length, key;

    if (isArray(name)) {
      for (i = 0, length = name.length; i < length; i++) {
        data[name[i]] = undefined;
      }
    } else if (getType(name) === 'RegExp') {
      for (key in data) {
        if (name.test(key)) {
          data[key] = undefined;
        }
      }
    } else if (typeof name === 'object') {
      for (key in name) {
        if (hasOwn.call(name, key)) {
          URI.removeQuery(data, key, name[key]);
        }
      }
    } else if (typeof name === 'string') {
      if (value !== undefined) {
        if (getType(value) === 'RegExp') {
          if (!isArray(data[name]) && value.test(data[name])) {
            data[name] = undefined;
          } else {
            data[name] = filterArrayValues(data[name], value);
          }
        } else if (data[name] === String(value) && (!isArray(value) || value.length === 1)) {
          data[name] = undefined;
        } else if (isArray(data[name])) {
          data[name] = filterArrayValues(data[name], value);
        }
      } else {
        data[name] = undefined;
      }
    } else {
      throw new TypeError('URI.removeQuery() accepts an object, string, RegExp as the first parameter');
    }
  };

  URI.hasQuery = function (data, name, value, withinArray) {
    if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          if (!URI.hasQuery(data, key, name[key])) {
            return false;
          }
        }
      }

      return true;
    } else if (typeof name !== 'string') {
      throw new TypeError('URI.hasQuery() accepts an object, string as the name parameter');
    }

    switch (getType(value)) {
      case 'Undefined':
        // true if exists (but may be empty)
        return name in data;
      // data[name] !== undefined;

      case 'Boolean':
        // true if exists and non-empty
        var _booly = Boolean(isArray(data[name]) ? data[name].length : data[name]);

        return value === _booly;

      case 'Function':
        // allow complex comparison
        return !!value(data[name], name, data);

      case 'Array':
        if (!isArray(data[name])) {
          return false;
        }

        var op = withinArray ? arrayContains : arraysEqual;
        return op(data[name], value);

      case 'RegExp':
        if (!isArray(data[name])) {
          return Boolean(data[name] && data[name].match(value));
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      case 'Number':
        value = String(value);

      /* falls through */

      case 'String':
        if (!isArray(data[name])) {
          return data[name] === value;
        }

        if (!withinArray) {
          return false;
        }

        return arrayContains(data[name], value);

      default:
        throw new TypeError('URI.hasQuery() accepts undefined, boolean, string, number, RegExp, Function as the value parameter');
    }
  };

  URI.commonPath = function (one, two) {
    var length = Math.min(one.length, two.length);
    var pos; // find first non-matching character

    for (pos = 0; pos < length; pos++) {
      if (one.charAt(pos) !== two.charAt(pos)) {
        pos--;
        break;
      }
    }

    if (pos < 1) {
      return one.charAt(0) === two.charAt(0) && one.charAt(0) === '/' ? '/' : '';
    } // revert to last /


    if (one.charAt(pos) !== '/' || two.charAt(pos) !== '/') {
      pos = one.substring(0, pos).lastIndexOf('/');
    }

    return one.substring(0, pos + 1);
  };

  URI.withinString = function (string, callback, options) {
    options || (options = {});

    var _start = options.start || URI.findUri.start;

    var _end = options.end || URI.findUri.end;

    var _trim = options.trim || URI.findUri.trim;

    var _attributeOpen = /[a-z0-9-]=["']?$/i;
    _start.lastIndex = 0;

    while (true) {
      var match = _start.exec(string);

      if (!match) {
        break;
      }

      var start = match.index;

      if (options.ignoreHtml) {
        // attribut(e=["']?$)
        var attributeOpen = string.slice(Math.max(start - 3, 0), start);

        if (attributeOpen && _attributeOpen.test(attributeOpen)) {
          continue;
        }
      }

      var end = start + string.slice(start).search(_end);
      var slice = string.slice(start, end).replace(_trim, '');

      if (options.ignore && options.ignore.test(slice)) {
        continue;
      }

      end = start + slice.length;
      var result = callback(slice, start, end, string);
      string = string.slice(0, start) + result + string.slice(end);
      _start.lastIndex = start + result.length;
    }

    _start.lastIndex = 0;
    return string;
  };

  URI.ensureValidHostname = function (v) {
    // Theoretically URIs allow percent-encoding in Hostnames (according to RFC 3986)
    // they are not part of DNS and therefore ignored by URI.js
    if (v.match(URI.invalid_hostname_characters)) {
      // test punycode
      if (!punycode) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-] and Punycode.js is not available');
      }

      if (punycode.toASCII(v).match(URI.invalid_hostname_characters)) {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }
    }
  }; // noConflict


  URI.noConflict = function (removeAll) {
    if (removeAll) {
      var unconflicted = {
        URI: this.noConflict()
      };

      if (root.URITemplate && typeof root.URITemplate.noConflict === 'function') {
        unconflicted.URITemplate = root.URITemplate.noConflict();
      }

      if (root.IPv6 && typeof root.IPv6.noConflict === 'function') {
        unconflicted.IPv6 = root.IPv6.noConflict();
      }

      if (root.SecondLevelDomains && typeof root.SecondLevelDomains.noConflict === 'function') {
        unconflicted.SecondLevelDomains = root.SecondLevelDomains.noConflict();
      }

      return unconflicted;
    } else if (root.URI === this) {
      root.URI = _URI;
    }

    return this;
  };

  p.build = function (deferBuild) {
    if (deferBuild === true) {
      this._deferred_build = true;
    } else if (deferBuild === undefined || this._deferred_build) {
      this._string = URI.build(this._parts);
      this._deferred_build = false;
    }

    return this;
  };

  p.clone = function () {
    return new URI(this);
  };

  p.valueOf = p.toString = function () {
    return this.build(false)._string;
  };

  function generateSimpleAccessor(_part) {
    return function (v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        this._parts[_part] = v || null;
        this.build(!build);
        return this;
      }
    };
  }

  function generatePrefixAccessor(_part, _key) {
    return function (v, build) {
      if (v === undefined) {
        return this._parts[_part] || '';
      } else {
        if (v !== null) {
          v = v + '';

          if (v.charAt(0) === _key) {
            v = v.substring(1);
          }
        }

        this._parts[_part] = v;
        this.build(!build);
        return this;
      }
    };
  }

  p.protocol = generateSimpleAccessor('protocol');
  p.username = generateSimpleAccessor('username');
  p.password = generateSimpleAccessor('password');
  p.hostname = generateSimpleAccessor('hostname');
  p.port = generateSimpleAccessor('port');
  p.query = generatePrefixAccessor('query', '?');
  p.fragment = generatePrefixAccessor('fragment', '#');

  p.search = function (v, build) {
    var t = this.query(v, build);
    return typeof t === 'string' && t.length ? '?' + t : t;
  };

  p.hash = function (v, build) {
    var t = this.fragment(v, build);
    return typeof t === 'string' && t.length ? '#' + t : t;
  };

  p.pathname = function (v, build) {
    if (v === undefined || v === true) {
      var res = this._parts.path || (this._parts.hostname ? '/' : '');
      return v ? (this._parts.urn ? URI.decodeUrnPath : URI.decodePath)(res) : res;
    } else {
      if (this._parts.urn) {
        this._parts.path = v ? URI.recodeUrnPath(v) : '';
      } else {
        this._parts.path = v ? URI.recodePath(v) : '/';
      }

      this.build(!build);
      return this;
    }
  };

  p.path = p.pathname;

  p.href = function (href, build) {
    var key;

    if (href === undefined) {
      return this.toString();
    }

    this._string = '';
    this._parts = URI._parts();

    var _URI = href instanceof URI;

    var _object = typeof href === 'object' && (href.hostname || href.path || href.pathname);

    if (href.nodeName) {
      var attribute = URI.getDomAttribute(href);
      href = href[attribute] || '';
      _object = false;
    } // window.location is reported to be an object, but it's not the sort
    // of object we're looking for:
    // * location.protocol ends with a colon
    // * location.query != object.search
    // * location.hash != object.fragment
    // simply serializing the unknown object should do the trick
    // (for location, not for everything...)


    if (!_URI && _object && href.pathname !== undefined) {
      href = href.toString();
    }

    if (typeof href === 'string' || href instanceof String) {
      this._parts = URI.parse(String(href), this._parts);
    } else if (_URI || _object) {
      var src = _URI ? href._parts : href;

      for (key in src) {
        if (hasOwn.call(this._parts, key)) {
          this._parts[key] = src[key];
        }
      }
    } else {
      throw new TypeError('invalid input');
    }

    this.build(!build);
    return this;
  }; // identification accessors


  p.is = function (what) {
    var ip = false;
    var ip4 = false;
    var ip6 = false;
    var name = false;
    var sld = false;
    var idn = false;
    var punycode = false;
    var relative = !this._parts.urn;

    if (this._parts.hostname) {
      relative = false;
      ip4 = URI.ip4_expression.test(this._parts.hostname);
      ip6 = URI.ip6_expression.test(this._parts.hostname);
      ip = ip4 || ip6;
      name = !ip;
      sld = name && SLD && SLD.has(this._parts.hostname);
      idn = name && URI.idn_expression.test(this._parts.hostname);
      punycode = name && URI.punycode_expression.test(this._parts.hostname);
    }

    switch (what.toLowerCase()) {
      case 'relative':
        return relative;

      case 'absolute':
        return !relative;
      // hostname identification

      case 'domain':
      case 'name':
        return name;

      case 'sld':
        return sld;

      case 'ip':
        return ip;

      case 'ip4':
      case 'ipv4':
      case 'inet4':
        return ip4;

      case 'ip6':
      case 'ipv6':
      case 'inet6':
        return ip6;

      case 'idn':
        return idn;

      case 'url':
        return !this._parts.urn;

      case 'urn':
        return !!this._parts.urn;

      case 'punycode':
        return punycode;
    }

    return null;
  }; // component specific input validation


  var _protocol = p.protocol;
  var _port = p.port;
  var _hostname = p.hostname;

  p.protocol = function (v, build) {
    if (v !== undefined) {
      if (v) {
        // accept trailing ://
        v = v.replace(/:(\/\/)?$/, '');

        if (!v.match(URI.protocol_expression)) {
          throw new TypeError('Protocol "' + v + '" contains characters other than [A-Z0-9.+-] or doesn\'t start with [A-Z]');
        }
      }
    }

    return _protocol.call(this, v, build);
  };

  p.scheme = p.protocol;

  p.port = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      if (v === 0) {
        v = null;
      }

      if (v) {
        v += '';

        if (v.charAt(0) === ':') {
          v = v.substring(1);
        }

        if (v.match(/[^0-9]/)) {
          throw new TypeError('Port "' + v + '" contains characters other than [0-9]');
        }
      }
    }

    return _port.call(this, v, build);
  };

  p.hostname = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v !== undefined) {
      var x = {};
      var res = URI.parseHost(v, x);

      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      v = x.hostname;
    }

    return _hostname.call(this, v, build);
  }; // compound accessors


  p.origin = function (v, build) {
    var parts;

    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      var protocol = this.protocol();
      var authority = this.authority();
      if (!authority) return '';
      return (protocol ? protocol + '://' : '') + this.authority();
    } else {
      var origin = URI(v);
      this.protocol(origin.protocol()).authority(origin.authority()).build(!build);
      return this;
    }
  };

  p.host = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildHost(this._parts) : '';
    } else {
      var res = URI.parseHost(v, this._parts);

      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };

  p.authority = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      return this._parts.hostname ? URI.buildAuthority(this._parts) : '';
    } else {
      var res = URI.parseAuthority(v, this._parts);

      if (res !== '/') {
        throw new TypeError('Hostname "' + v + '" contains characters other than [A-Z0-9.-]');
      }

      this.build(!build);
      return this;
    }
  };

  p.userinfo = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined) {
      if (!this._parts.username) {
        return '';
      }

      var t = URI.buildUserinfo(this._parts);
      return t.substring(0, t.length - 1);
    } else {
      if (v[v.length - 1] !== '@') {
        v += '@';
      }

      URI.parseUserinfo(v, this._parts);
      this.build(!build);
      return this;
    }
  };

  p.resource = function (v, build) {
    var parts;

    if (v === undefined) {
      return this.path() + this.search() + this.hash();
    }

    parts = URI.parse(v);
    this._parts.path = parts.path;
    this._parts.query = parts.query;
    this._parts.fragment = parts.fragment;
    this.build(!build);
    return this;
  }; // fraction accessors


  p.subdomain = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    } // convenience, return "www" from "www.example.org"


    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      } // grab domain and add another segment


      var end = this._parts.hostname.length - this.domain().length - 1;
      return this._parts.hostname.substring(0, end) || '';
    } else {
      var e = this._parts.hostname.length - this.domain().length;

      var sub = this._parts.hostname.substring(0, e);

      var replace = new RegExp('^' + escapeRegEx(sub));

      if (v && v.charAt(v.length - 1) !== '.') {
        v += '.';
      }

      if (v) {
        URI.ensureValidHostname(v);
      }

      this._parts.hostname = this._parts.hostname.replace(replace, v);
      this.build(!build);
      return this;
    }
  };

  p.domain = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    } // convenience, return "example.org" from "www.example.org"


    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      } // if hostname consists of 1 or 2 segments, it must be the domain


      var t = this._parts.hostname.match(/\./g);

      if (t && t.length < 2) {
        return this._parts.hostname;
      } // grab tld and add another segment


      var end = this._parts.hostname.length - this.tld(build).length - 1;
      end = this._parts.hostname.lastIndexOf('.', end - 1) + 1;
      return this._parts.hostname.substring(end) || '';
    } else {
      if (!v) {
        throw new TypeError('cannot set domain empty');
      }

      URI.ensureValidHostname(v);

      if (!this._parts.hostname || this.is('IP')) {
        this._parts.hostname = v;
      } else {
        var replace = new RegExp(escapeRegEx(this.domain()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  p.tld = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (typeof v === 'boolean') {
      build = v;
      v = undefined;
    } // return "org" from "www.example.org"


    if (v === undefined) {
      if (!this._parts.hostname || this.is('IP')) {
        return '';
      }

      var pos = this._parts.hostname.lastIndexOf('.');

      var tld = this._parts.hostname.substring(pos + 1);

      if (build !== true && SLD && SLD.list[tld.toLowerCase()]) {
        return SLD.get(this._parts.hostname) || tld;
      }

      return tld;
    } else {
      var replace;

      if (!v) {
        throw new TypeError('cannot set TLD empty');
      } else if (v.match(/[^a-zA-Z0-9-]/)) {
        if (SLD && SLD.is(v)) {
          replace = new RegExp(escapeRegEx(this.tld()) + '$');
          this._parts.hostname = this._parts.hostname.replace(replace, v);
        } else {
          throw new TypeError('TLD "' + v + '" contains characters other than [A-Z0-9]');
        }
      } else if (!this._parts.hostname || this.is('IP')) {
        throw new ReferenceError('cannot set TLD on non-domain host');
      } else {
        replace = new RegExp(escapeRegEx(this.tld()) + '$');
        this._parts.hostname = this._parts.hostname.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  p.directory = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path && !this._parts.hostname) {
        return '';
      }

      if (this._parts.path === '/') {
        return '/';
      }

      var end = this._parts.path.length - this.filename().length - 1;
      var res = this._parts.path.substring(0, end) || (this._parts.hostname ? '/' : '');
      return v ? URI.decodePath(res) : res;
    } else {
      var e = this._parts.path.length - this.filename().length;

      var directory = this._parts.path.substring(0, e);

      var replace = new RegExp('^' + escapeRegEx(directory)); // fully qualifier directories begin with a slash

      if (!this.is('relative')) {
        if (!v) {
          v = '/';
        }

        if (v.charAt(0) !== '/') {
          v = '/' + v;
        }
      } // directories always end with a slash


      if (v && v.charAt(v.length - 1) !== '/') {
        v += '/';
      }

      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);
      this.build(!build);
      return this;
    }
  };

  p.filename = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var pos = this._parts.path.lastIndexOf('/');

      var res = this._parts.path.substring(pos + 1);

      return v ? URI.decodePathSegment(res) : res;
    } else {
      var mutatedDirectory = false;

      if (v.charAt(0) === '/') {
        v = v.substring(1);
      }

      if (v.match(/\.?\//)) {
        mutatedDirectory = true;
      }

      var replace = new RegExp(escapeRegEx(this.filename()) + '$');
      v = URI.recodePath(v);
      this._parts.path = this._parts.path.replace(replace, v);

      if (mutatedDirectory) {
        this.normalizePath(build);
      } else {
        this.build(!build);
      }

      return this;
    }
  };

  p.suffix = function (v, build) {
    if (this._parts.urn) {
      return v === undefined ? '' : this;
    }

    if (v === undefined || v === true) {
      if (!this._parts.path || this._parts.path === '/') {
        return '';
      }

      var filename = this.filename();
      var pos = filename.lastIndexOf('.');
      var s, res;

      if (pos === -1) {
        return '';
      } // suffix may only contain alnum characters (yup, I made this up.)


      s = filename.substring(pos + 1);
      res = /^[a-z0-9%]+$/i.test(s) ? s : '';
      return v ? URI.decodePathSegment(res) : res;
    } else {
      if (v.charAt(0) === '.') {
        v = v.substring(1);
      }

      var suffix = this.suffix();
      var replace;

      if (!suffix) {
        if (!v) {
          return this;
        }

        this._parts.path += '.' + URI.recodePath(v);
      } else if (!v) {
        replace = new RegExp(escapeRegEx('.' + suffix) + '$');
      } else {
        replace = new RegExp(escapeRegEx(suffix) + '$');
      }

      if (replace) {
        v = URI.recodePath(v);
        this._parts.path = this._parts.path.replace(replace, v);
      }

      this.build(!build);
      return this;
    }
  };

  p.segment = function (segment, v, build) {
    var separator = this._parts.urn ? ':' : '/';
    var path = this.path();
    var absolute = path.substring(0, 1) === '/';
    var segments = path.split(separator);

    if (segment !== undefined && typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (segment !== undefined && typeof segment !== 'number') {
      throw new Error('Bad segment "' + segment + '", must be 0-based integer');
    }

    if (absolute) {
      segments.shift();
    }

    if (segment < 0) {
      // allow negative indexes to address from the end
      segment = Math.max(segments.length + segment, 0);
    }

    if (v === undefined) {
      /*jshint laxbreak: true */
      return segment === undefined ? segments : segments[segment];
      /*jshint laxbreak: false */
    } else if (segment === null || segments[segment] === undefined) {
      if (isArray(v)) {
        segments = []; // collapse empty elements within array

        for (var i = 0, l = v.length; i < l; i++) {
          if (!v[i].length && (!segments.length || !segments[segments.length - 1].length)) {
            continue;
          }

          if (segments.length && !segments[segments.length - 1].length) {
            segments.pop();
          }

          segments.push(trimSlashes(v[i]));
        }
      } else if (v || typeof v === 'string') {
        v = trimSlashes(v);

        if (segments[segments.length - 1] === '') {
          // empty trailing elements have to be overwritten
          // to prevent results such as /foo//bar
          segments[segments.length - 1] = v;
        } else {
          segments.push(v);
        }
      }
    } else {
      if (v) {
        segments[segment] = trimSlashes(v);
      } else {
        segments.splice(segment, 1);
      }
    }

    if (absolute) {
      segments.unshift('');
    }

    return this.path(segments.join(separator), build);
  };

  p.segmentCoded = function (segment, v, build) {
    var segments, i, l;

    if (typeof segment !== 'number') {
      build = v;
      v = segment;
      segment = undefined;
    }

    if (v === undefined) {
      segments = this.segment(segment, v, build);

      if (!isArray(segments)) {
        segments = segments !== undefined ? URI.decode(segments) : undefined;
      } else {
        for (i = 0, l = segments.length; i < l; i++) {
          segments[i] = URI.decode(segments[i]);
        }
      }

      return segments;
    }

    if (!isArray(v)) {
      v = typeof v === 'string' || v instanceof String ? URI.encode(v) : v;
    } else {
      for (i = 0, l = v.length; i < l; i++) {
        v[i] = URI.encode(v[i]);
      }
    }

    return this.segment(segment, v, build);
  }; // mutating query string


  var q = p.query;

  p.query = function (v, build) {
    if (v === true) {
      return URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    } else if (typeof v === 'function') {
      var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
      var result = v.call(this, data);
      this._parts.query = URI.buildQuery(result || data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else if (v !== undefined && typeof v !== 'string') {
      this._parts.query = URI.buildQuery(v, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);
      this.build(!build);
      return this;
    } else {
      return q.call(this, v, build);
    }
  };

  p.setQuery = function (name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);

    if (typeof name === 'string' || name instanceof String) {
      data[name] = value !== undefined ? value : null;
    } else if (typeof name === 'object') {
      for (var key in name) {
        if (hasOwn.call(name, key)) {
          data[key] = name[key];
        }
      }
    } else {
      throw new TypeError('URI.addQuery() accepts an object, string as the name parameter');
    }

    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);

    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.addQuery = function (name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.addQuery(data, name, value === undefined ? null : value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);

    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.removeQuery = function (name, value, build) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    URI.removeQuery(data, name, value);
    this._parts.query = URI.buildQuery(data, this._parts.duplicateQueryParameters, this._parts.escapeQuerySpace);

    if (typeof name !== 'string') {
      build = value;
    }

    this.build(!build);
    return this;
  };

  p.hasQuery = function (name, value, withinArray) {
    var data = URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace);
    return URI.hasQuery(data, name, value, withinArray);
  };

  p.setSearch = p.setQuery;
  p.addSearch = p.addQuery;
  p.removeSearch = p.removeQuery;
  p.hasSearch = p.hasQuery; // sanitizing URLs

  p.normalize = function () {
    if (this._parts.urn) {
      return this.normalizeProtocol(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
    }

    return this.normalizeProtocol(false).normalizeHostname(false).normalizePort(false).normalizePath(false).normalizeQuery(false).normalizeFragment(false).build();
  };

  p.normalizeProtocol = function (build) {
    if (typeof this._parts.protocol === 'string') {
      this._parts.protocol = this._parts.protocol.toLowerCase();
      this.build(!build);
    }

    return this;
  };

  p.normalizeHostname = function (build) {
    if (this._parts.hostname) {
      if (this.is('IDN') && punycode) {
        this._parts.hostname = punycode.toASCII(this._parts.hostname);
      } else if (this.is('IPv6') && IPv6) {
        this._parts.hostname = IPv6.best(this._parts.hostname);
      }

      this._parts.hostname = this._parts.hostname.toLowerCase();
      this.build(!build);
    }

    return this;
  };

  p.normalizePort = function (build) {
    // remove port of it's the protocol's default
    if (typeof this._parts.protocol === 'string' && this._parts.port === URI.defaultPorts[this._parts.protocol]) {
      this._parts.port = null;
      this.build(!build);
    }

    return this;
  };

  p.normalizePath = function (build) {
    var _path = this._parts.path;

    if (!_path) {
      return this;
    }

    if (this._parts.urn) {
      this._parts.path = URI.recodeUrnPath(this._parts.path);
      this.build(!build);
      return this;
    }

    if (this._parts.path === '/') {
      return this;
    }

    var _was_relative;

    var _leadingParents = '';

    var _parent, _pos; // handle relative paths


    if (_path.charAt(0) !== '/') {
      _was_relative = true;
      _path = '/' + _path;
    } // handle relative files (as opposed to directories)


    if (_path.slice(-3) === '/..' || _path.slice(-2) === '/.') {
      _path += '/';
    } // resolve simples


    _path = _path.replace(/(\/(\.\/)+)|(\/\.$)/g, '/').replace(/\/{2,}/g, '/'); // remember leading parents

    if (_was_relative) {
      _leadingParents = _path.substring(1).match(/^(\.\.\/)+/) || '';

      if (_leadingParents) {
        _leadingParents = _leadingParents[0];
      }
    } // resolve parents


    while (true) {
      _parent = _path.indexOf('/..');

      if (_parent === -1) {
        // no more ../ to resolve
        break;
      } else if (_parent === 0) {
        // top level cannot be relative, skip it
        _path = _path.substring(3);
        continue;
      }

      _pos = _path.substring(0, _parent).lastIndexOf('/');

      if (_pos === -1) {
        _pos = _parent;
      }

      _path = _path.substring(0, _pos) + _path.substring(_parent + 3);
    } // revert to relative


    if (_was_relative && this.is('relative')) {
      _path = _leadingParents + _path.substring(1);
    }

    _path = URI.recodePath(_path);
    this._parts.path = _path;
    this.build(!build);
    return this;
  };

  p.normalizePathname = p.normalizePath;

  p.normalizeQuery = function (build) {
    if (typeof this._parts.query === 'string') {
      if (!this._parts.query.length) {
        this._parts.query = null;
      } else {
        this.query(URI.parseQuery(this._parts.query, this._parts.escapeQuerySpace));
      }

      this.build(!build);
    }

    return this;
  };

  p.normalizeFragment = function (build) {
    if (!this._parts.fragment) {
      this._parts.fragment = null;
      this.build(!build);
    }

    return this;
  };

  p.normalizeSearch = p.normalizeQuery;
  p.normalizeHash = p.normalizeFragment;

  p.iso8859 = function () {
    // expect unicode input, iso8859 output
    var e = URI.encode;
    var d = URI.decode;
    URI.encode = escape;
    URI.decode = decodeURIComponent;

    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }

    return this;
  };

  p.unicode = function () {
    // expect iso8859 input, unicode output
    var e = URI.encode;
    var d = URI.decode;
    URI.encode = strictEncodeURIComponent;
    URI.decode = unescape;

    try {
      this.normalize();
    } finally {
      URI.encode = e;
      URI.decode = d;
    }

    return this;
  };

  p.readable = function () {
    var uri = this.clone(); // removing username, password, because they shouldn't be displayed according to RFC 3986

    uri.username('').password('').normalize();
    var t = '';

    if (uri._parts.protocol) {
      t += uri._parts.protocol + '://';
    }

    if (uri._parts.hostname) {
      if (uri.is('punycode') && punycode) {
        t += punycode.toUnicode(uri._parts.hostname);

        if (uri._parts.port) {
          t += ':' + uri._parts.port;
        }
      } else {
        t += uri.host();
      }
    }

    if (uri._parts.hostname && uri._parts.path && uri._parts.path.charAt(0) !== '/') {
      t += '/';
    }

    t += uri.path(true);

    if (uri._parts.query) {
      var q = '';

      for (var i = 0, qp = uri._parts.query.split('&'), l = qp.length; i < l; i++) {
        var kv = (qp[i] || '').split('=');
        q += '&' + URI.decodeQuery(kv[0], this._parts.escapeQuerySpace).replace(/&/g, '%26');

        if (kv[1] !== undefined) {
          q += '=' + URI.decodeQuery(kv[1], this._parts.escapeQuerySpace).replace(/&/g, '%26');
        }
      }

      t += '?' + q.substring(1);
    }

    t += URI.decodeQuery(uri.hash(), true);
    return t;
  }; // resolving relative and absolute URLs


  p.absoluteTo = function (base) {
    var resolved = this.clone();
    var properties = ['protocol', 'username', 'password', 'hostname', 'port'];
    var basedir, i, p;

    if (this._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    if (!(base instanceof URI)) {
      base = new URI(base);
    }

    if (!resolved._parts.protocol) {
      resolved._parts.protocol = base._parts.protocol;
    }

    if (this._parts.hostname) {
      return resolved;
    }

    for (i = 0; p = properties[i]; i++) {
      resolved._parts[p] = base._parts[p];
    }

    if (!resolved._parts.path) {
      resolved._parts.path = base._parts.path;

      if (!resolved._parts.query) {
        resolved._parts.query = base._parts.query;
      }
    } else if (resolved._parts.path.substring(-2) === '..') {
      resolved._parts.path += '/';
    }

    if (resolved.path().charAt(0) !== '/') {
      basedir = base.directory();
      basedir = basedir ? basedir : base.path().indexOf('/') === 0 ? '/' : '';
      resolved._parts.path = (basedir ? basedir + '/' : '') + resolved._parts.path;
      resolved.normalizePath();
    }

    resolved.build();
    return resolved;
  };

  p.relativeTo = function (base) {
    var relative = this.clone().normalize();
    var relativeParts, baseParts, common, relativePath, basePath;

    if (relative._parts.urn) {
      throw new Error('URNs do not have any generally defined hierarchical components');
    }

    base = new URI(base).normalize();
    relativeParts = relative._parts;
    baseParts = base._parts;
    relativePath = relative.path();
    basePath = base.path();

    if (relativePath.charAt(0) !== '/') {
      throw new Error('URI is already relative');
    }

    if (basePath.charAt(0) !== '/') {
      throw new Error('Cannot calculate a URI relative to another relative URI');
    }

    if (relativeParts.protocol === baseParts.protocol) {
      relativeParts.protocol = null;
    }

    if (relativeParts.username !== baseParts.username || relativeParts.password !== baseParts.password) {
      return relative.build();
    }

    if (relativeParts.protocol !== null || relativeParts.username !== null || relativeParts.password !== null) {
      return relative.build();
    }

    if (relativeParts.hostname === baseParts.hostname && relativeParts.port === baseParts.port) {
      relativeParts.hostname = null;
      relativeParts.port = null;
    } else {
      return relative.build();
    }

    if (relativePath === basePath) {
      relativeParts.path = '';
      return relative.build();
    } // determine common sub path


    common = URI.commonPath(relativePath, basePath); // If the paths have nothing in common, return a relative URL with the absolute path.

    if (!common) {
      return relative.build();
    }

    var parents = baseParts.path.substring(common.length).replace(/[^\/]*$/, '').replace(/.*?\//g, '../');
    relativeParts.path = parents + relativeParts.path.substring(common.length) || './';
    return relative.build();
  }; // comparing URIs


  p.equals = function (uri) {
    var one = this.clone();
    var two = new URI(uri);
    var one_map = {};
    var two_map = {};
    var checked = {};
    var one_query, two_query, key;
    one.normalize();
    two.normalize(); // exact match

    if (one.toString() === two.toString()) {
      return true;
    } // extract query string


    one_query = one.query();
    two_query = two.query();
    one.query('');
    two.query(''); // definitely not equal if not even non-query parts match

    if (one.toString() !== two.toString()) {
      return false;
    } // query parameters have the same length, even if they're permuted


    if (one_query.length !== two_query.length) {
      return false;
    }

    one_map = URI.parseQuery(one_query, this._parts.escapeQuerySpace);
    two_map = URI.parseQuery(two_query, this._parts.escapeQuerySpace);

    for (key in one_map) {
      if (hasOwn.call(one_map, key)) {
        if (!isArray(one_map[key])) {
          if (one_map[key] !== two_map[key]) {
            return false;
          }
        } else if (!arraysEqual(one_map[key], two_map[key])) {
          return false;
        }

        checked[key] = true;
      }
    }

    for (key in two_map) {
      if (hasOwn.call(two_map, key)) {
        if (!checked[key]) {
          // two contains a parameter not present in one
          return false;
        }
      }
    }

    return true;
  }; // state


  p.duplicateQueryParameters = function (v) {
    this._parts.duplicateQueryParameters = !!v;
    return this;
  };

  p.escapeQuerySpace = function (v) {
    this._parts.escapeQuerySpace = !!v;
    return this;
  };

  return URI;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/lib/core.coffee                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Steedos.uri = new URI(Meteor.absoluteUrl());

_.extend(Accounts, {
  updatePhone: function (number, callback) {
    if (Meteor.isServer) {
      Meteor.call('updatePhone', {
        number: number
      });
    }

    if (Meteor.isClient) {
      return Meteor.call('updatePhone', {
        number: number
      }, callback);
    }
  },
  disablePhoneWithoutExpiredDays: function (expiredDays, callback) {
    if (Meteor.isServer) {
      Meteor.call('disablePhoneWithoutExpiredDays', expiredDays);
    }

    if (Meteor.isClient) {
      return Meteor.call('disablePhoneWithoutExpiredDays', expiredDays, callback);
    }
  },
  getPhoneNumber: function (isIncludePrefix, user) {
    var phone, ref, ref1;

    if (Meteor.isClient) {
      phone = (ref = Accounts.user()) != null ? ref.phone : void 0;
    } else {
      if (typeof user === "string") {
        phone = (ref1 = db.users.findOne(user)) != null ? ref1.phone : void 0;
      } else {
        phone = user != null ? user.phone : void 0;
      }
    }

    if (!phone) {
      return "";
    }

    if (isIncludePrefix) {
      return phone.number;
    } else {
      if (!phone.mobile) {
        return E164.getPhoneNumberWithoutPrefix(phone.number);
      }

      return phone.mobile;
    }
  },
  getPhonePrefix: function (user) {
    var phone, prefix, ref, ref1;

    if (Meteor.isClient && !user) {
      phone = (ref = Accounts.user()) != null ? ref.phone : void 0;
    } else {
      if (typeof user === "string") {
        phone = (ref1 = db.users.findOne(user)) != null ? ref1.phone : void 0;
      } else {
        phone = user != null ? user.phone : void 0;
      }
    }

    if (!phone) {
      return "+86";
    }

    if (phone.mobile) {
      prefix = phone.number.replace(phone.mobile, "");
    } else {
      prefix = E164.getPhonePrefix(phone.number);

      if (prefix) {
        prefix = "+" + prefix;
      }
    }

    if (prefix) {
      return prefix;
    } else {
      return "+86";
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"force_bind_phone.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/lib/force_bind_phone.coffee                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var checkPhoneStateExpired, ref, ref1, ref2;

if ((ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? (ref2 = ref1.phone) != null ? ref2.forceAccountBindPhone : void 0 : void 0 : void 0) {
  if (Meteor.isServer) {
    Meteor.methods({
      checkForceBindPhone: function (spaces) {
        var noForceUsers, space_settings;
        check(spaces, Array);
        space_settings = db.space_settings.find({
          key: "contacts_no_force_phone_users",
          space: {
            $in: spaces
          }
        });
        noForceUsers = [];
        space_settings.forEach(function (n, i) {
          var ref3;

          if ((ref3 = n.values) != null ? ref3.length : void 0) {
            return noForceUsers = _.union(noForceUsers, n.values);
          }
        });

        if (noForceUsers && noForceUsers.length) {
          if (noForceUsers.indexOf(Meteor.userId()) > -1) {
            return false;
          } else {
            return true;
          }
        }

        return true;
      }
    });
  }

  if (Meteor.isClient) {
    Steedos.isForceBindPhone = false;

    checkPhoneStateExpired = function () {
      var expiredDays, ref3, ref4, ref5;
      expiredDays = (ref3 = Meteor.settings) != null ? (ref4 = ref3["public"]) != null ? (ref5 = ref4.phone) != null ? ref5.expiredDays : void 0 : void 0 : void 0;

      if (expiredDays) {
        return Accounts.disablePhoneWithoutExpiredDays(expiredDays);
      }
    };

    if (!Steedos.isMobile()) {
      Accounts.onLogin(function () {
        if (Accounts.isPhoneVerified()) {
          checkPhoneStateExpired();
          return;
        }

        return Meteor.setTimeout(function () {
          var spaces;

          if (Accounts.isPhoneVerified()) {
            checkPhoneStateExpired();
            return;
          }

          spaces = db.spaces.find().fetch().getProperty("_id");

          if (!spaces.length) {
            return;
          }

          return Meteor.call("checkForceBindPhone", spaces, function (error, results) {
            var ref3, routerPath, setupUrl;

            if (error) {
              toastr.error(t(error.reason));
            } else {
              Steedos.isForceBindPhone = results;
            }

            if (Steedos.isForceBindPhone && !Accounts.isPhoneVerified()) {
              setupUrl = "/accounts/setup/phone";
              Steedos.isForceBindPhone = false;
              FlowRouter.go(setupUrl);
              return;
            }

            routerPath = (ref3 = FlowRouter.current()) != null ? ref3.path : void 0;

            if (/^\/accounts\/setup\/phone\b/.test(routerPath)) {
              return;
            }

            if (/^\/steedos\//.test(routerPath)) {
              return;
            }

            if (Accounts.isPhoneVerified()) {
              return checkPhoneStateExpired();
            } else {
              setupUrl = Steedos.absoluteUrl("accounts/setup/phone");

              if (!Steedos.isForceBindPhone) {
                return toastr.error(null, t("accounts_phone_toastr_alert"), {
                  closeButton: true,
                  timeOut: 0,
                  extendedTimeOut: 0,
                  onclick: function () {
                    return Steedos.openWindow(setupUrl, 'setup_phone');
                  }
                });
              }
            }
          });
        }, 200);
      });
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"accounts.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/lib/accounts.coffee                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pwdField, ref, ref1, ref2, ref3, sendVerificationEmail;
sendVerificationEmail = true;

if (!process.env.MAIL_URL || !Package["email"]) {
  sendVerificationEmail = false;
}

AccountsTemplates.configure({
  defaultLayout: 'loginLayout',
  defaultLayoutRegions: {
    nav: 'loginNav'
  },
  defaultContentRegion: 'main',
  showForgotPasswordLink: true,
  overrideLoginErrors: true,
  enablePasswordChange: true,
  sendVerificationEmail: sendVerificationEmail,
  homeRoutePath: '/',
  negativeValidation: true,
  positiveValidation: true,
  negativeFeedback: false,
  positiveFeedback: true,
  showLabels: false,
  preSignUpHook: function (password, options) {
    return options.profile.locale = Steedos.getLocale();
  }
});
AccountsTemplates.configureRoute('changePwd', {
  path: '/steedos/change-password'
});
AccountsTemplates.configureRoute('forgotPwd', {
  path: '/steedos/forgot-password',
  redirect: '/steedos/forgot-password-token'
});
AccountsTemplates.configureRoute('resetPwd', {
  path: '/steedos/reset-password'
});
AccountsTemplates.configureRoute('signIn', {
  path: '/steedos/sign-in',
  redirect: function () {
    var ref, ref1;

    if ((ref = FlowRouter.current().queryParams) != null ? ref.redirect : void 0) {
      return document.location.href = (ref1 = FlowRouter.current().queryParams) != null ? ref1.redirect : void 0;
    } else {
      return FlowRouter.go("/");
    }
  }
});
AccountsTemplates.configureRoute('signUp', {
  path: '/steedos/sign-up'
});
AccountsTemplates.configureRoute('verifyEmail', {
  path: '/steedos/verify-email',
  redirect: function () {
    var email, emails, ref;
    emails = (ref = Meteor.user()) != null ? ref.emails : void 0;

    if (emails && emails.length === 1) {
      email = emails[0].address;
      $(document.body).addClass("loading");
      Meteor.call("users_set_primary_email", email, function (error, result) {
        $(document.body).removeClass('loading');

        if (result != null ? result.error : void 0) {
          return toastr.error(t(result.message));
        }
      });
    }

    return FlowRouter.go("/");
  }
});
AccountsTemplates.configureRoute('enrollAccount', {
  path: '/steedos/enroll-account'
});
pwdField = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([{
  _id: 'company',
  type: 'text'
}, {
  _id: 'name',
  type: 'text'
}, {
  _id: 'email',
  type: 'email',
  required: true,
  displayName: "email",
  re: /.+@(.+){2,}\.(.+){2,}/,
  errStr: 'Invalid email',
  placeholder: {
    forgotPwd: "email_input_placeholder"
  }
}, {
  _id: 'username_and_email',
  type: 'text',
  required: true,
  displayName: "Login"
}, {
  _id: "username",
  type: "text",
  displayName: "username",
  required: false,
  minLength: 6
}, pwdField]);

if (Meteor.isServer && Accounts.emailTemplates) {
  Accounts.emailTemplates.siteName = "Steedos";
  Accounts.emailTemplates.from = (ref = Meteor.settings.email) != null ? ref.from : void 0;
}

if ((ref1 = Meteor.settings) != null ? (ref2 = ref1["public"]) != null ? (ref3 = ref2.accounts) != null ? ref3.disableAccountRegistration : void 0 : void 0 : void 0) {
  AccountsTemplates.options.forbidClientAccountCreation = true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"setup.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/routes/setup.coffee                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"password_server.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/password_server.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/// BCRYPT
var bcrypt = NpmModuleBcrypt;
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);
var passwordValidator = Match.OneOf(String, {
  digest: String,
  algorithm: String
});
var checkPassword = Accounts._checkPassword; // Given a 'password' from the client, extract the string that we should
// bcrypt. 'password' can be one of:
//  - String (the plaintext password)
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".
//

var getPasswordString = function (password) {
  if (typeof password === "string") {
    password = SHA256(password);
  } else {
    // 'password' is an object
    if (password.algorithm !== "sha-256") {
      throw new Error("Invalid password hash algorithm. " + "Only 'sha-256' is allowed.");
    }

    password = password.digest;
  }

  return password;
}; // Use bcrypt to hash the password for storage in the database.
// `password` can be a string (in which case it will be run through
// SHA256 before bcrypt) or an object with properties `digest` and
// `algorithm` (in which case we bcrypt `password.digest`).
//


var hashPassword = function (password) {
  password = getPasswordString(password);
  return bcryptHash(password, Accounts._bcryptRounds);
}; ///
/// ERROR HANDLER
///


var handleError = function (msg, throwError) {
  if (throwError === undefined) {
    throwError = true;
  }

  var error = new Meteor.Error(403, Accounts._options.ambiguousErrorMessages ? "Something went wrong. Please check your credentials." : msg);

  if (throwError) {
    throw error;
  }

  return error;
}; // Generates permutations of all case variations of a given string.


var generateCasePermutationsForString = function (string) {
  var permutations = [''];

  for (var i = 0; i < string.length; i++) {
    var ch = string.charAt(i);
    permutations = _.flatten(_.map(permutations, function (prefix) {
      var lowerCaseChar = ch.toLowerCase();
      var upperCaseChar = ch.toUpperCase(); // Don't add unneccesary permutations when ch is not a letter

      if (lowerCaseChar === upperCaseChar) {
        return [prefix + ch];
      } else {
        return [prefix + lowerCaseChar, prefix + upperCaseChar];
      }
    }));
  }

  return permutations;
}; // Generates a MongoDB selector that can be used to perform a fast case
// insensitive lookup for the given fieldName and string. Since MongoDB does
// not support case insensitive indexes, and case insensitive regex queries
// are slow, we construct a set of prefix selectors for all permutations of
// the first 4 characters ourselves. We first attempt to matching against
// these, and because 'prefix expression' regex queries do use indexes (see
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),
// this has been found to greatly improve performance (from 1200ms to 5ms in a
// test with 1.000.000 users).


var selectorForFastCaseInsensitiveLookup = function (fieldName, string) {
  // Performance seems to improve up to 4 prefix characters
  var prefix = string.substring(0, Math.min(string.length, 4));

  var orClause = _.map(generateCasePermutationsForString(prefix), function (prefixPermutation) {
    var selector = {};
    selector[fieldName] = new RegExp('^' + Meteor._escapeRegExp(prefixPermutation));
    return selector;
  });

  var caseInsensitiveClause = {};
  caseInsensitiveClause[fieldName] = new RegExp('^' + Meteor._escapeRegExp(string) + '$', 'i');
  return {
    $and: [{
      $or: orClause
    }, caseInsensitiveClause]
  };
};

Accounts._findUserByQueryForSteedos = function (query) {
  var user = null;

  if (query.id) {
    user = Meteor.users.findOne({
      _id: query.id
    });
  } else {
    var fieldName;
    var fieldValue;

    if (query.username) {
      fieldName = 'username';
      fieldValue = query.username;
    } else if (query.email) {
      fieldName = 'emails.address';
      fieldValue = query.email;
    } else if (query.phone) {
      fieldName = 'phone.number'; // fieldValue如果自带区号，则不做处理，反之默认加上中国区号+86

      if (/^\+\d+/g.test(query.phone)) {
        fieldValue = query.phone;
      } else {
        fieldValue = "+86" + query.phone;
      }

      fieldName = "$or";
      fieldValue = [{
        'phone.number': fieldValue
      }, {
        username: query.phone
      }];
    } else {
      throw new Error("shouldn't happen (validation missed something)");
    }

    var selector = {};
    selector[fieldName] = fieldValue;
    user = Meteor.users.findOne(selector); // If user is not found, try a case insensitive lookup

    if (!user && fieldName != "$or") {
      selector = selectorForFastCaseInsensitiveLookup(fieldName, fieldValue);
      var candidateUsers = Meteor.users.find(selector).fetch(); // No match if multiple candidates are found

      if (candidateUsers.length === 1) {
        user = candidateUsers[0];
      }
    }
  }

  return user;
};

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});
var userQueryValidator = Match.Where(function (user) {
  check(user, {
    id: Match.Optional(NonEmptyString),
    username: Match.Optional(NonEmptyString),
    email: Match.Optional(NonEmptyString),
    phone: Match.Optional(NonEmptyString)
  });
  if (_.keys(user).length !== 1) throw new Match.Error("User property must have exactly one field");
  return true;
});
Accounts.registerLoginHandler("password2", function (options) {
  if (!options.password2 || options.srp) return undefined; // don't handle

  check(options, {
    user: userQueryValidator,
    password2: passwordValidator
  });

  var user = Accounts._findUserByQueryForSteedos(options.user);

  if (!user) {
    handleError("User not found");
  }

  if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp)) {
    handleError("User has no password set");
  }

  if (!user.services.password.bcrypt) {
    if (typeof options.password2 === "string") {
      // The client has presented a plaintext password, and the user is
      // not upgraded to bcrypt yet. We don't attempt to tell the client
      // to upgrade to bcrypt, because it might be a standalone DDP
      // client doesn't know how to do such a thing.
      var verifier = user.services.password.srp;
      var newVerifier = SRP.generateVerifier(options.password2, {
        identity: verifier.identity,
        salt: verifier.salt
      });

      if (verifier.verifier !== newVerifier.verifier) {
        return {
          userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
          error: handleError("Incorrect password", false)
        };
      }

      return {
        userId: user._id
      };
    } else {
      // Tell the client to use the SRP upgrade process.
      throw new Meteor.Error(400, "old password format", EJSON.stringify({
        format: 'srp',
        identity: user.services.password.srp.identity
      }));
    }
  }

  return checkPassword(user, options.password2);
}); // Handler to login using the SRP upgrade path. To use this login
// handler, the client must provide:
//   - srp: H(identity + ":" + password)
//   - password: a string or an object with properties 'digest' and 'algorithm'
//
// We use `options.srp` to verify that the client knows the correct
// password without doing a full SRP flow. Once we've checked that, we
// upgrade the user to bcrypt and remove the SRP information from the
// user document.
//
// The client ends up using this login handler after trying the normal
// login handler (above), which throws an error telling the client to
// try the SRP upgrade path.
//
// XXX COMPAT WITH 0.8.1.3

Accounts.registerLoginHandler("password2", function (options) {
  if (!options.srp || !options.password2) {
    return undefined; // don't handle
  }

  check(options, {
    user: userQueryValidator,
    srp: String,
    password2: passwordValidator
  });

  var user = Accounts._findUserByQueryForSteedos(options.user);

  if (!user) {
    handleError("User not found");
  } // Check to see if another simultaneous login has already upgraded
  // the user record to bcrypt.


  if (user.services && user.services.password && user.services.password.bcrypt) {
    return checkPassword(user, options.password2);
  }

  if (!(user.services && user.services.password && user.services.password.srp)) {
    handleError("User has no password set");
  }

  var v1 = user.services.password.srp.verifier;
  var v2 = SRP.generateVerifier(null, {
    hashedIdentityAndPassword: options.srp,
    salt: user.services.password.srp.salt
  }).verifier;

  if (v1 !== v2) {
    return {
      userId: Accounts._options.ambiguousErrorMessages ? null : user._id,
      error: handleError("Incorrect password", false)
    };
  } // Upgrade to bcrypt on successful login.


  var salted = hashPassword(options.password2);
  Meteor.users.update(user._id, {
    $unset: {
      'services.password.srp': 1
    },
    $set: {
      'services.password.bcrypt': salted
    }
  });
  return {
    userId: user._id
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server":{"methods":{"update_phone.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/server/methods/update_phone.coffee                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Phone;
Phone = require('phone');
Meteor.methods({
  updatePhone: function (options) {
    var currentNumber, currentUser, currentUserId, number, ref, ref1, repeatNumberUser;
    check(options, Object);
    number = options.number;
    check(number, String);
    number = Phone(number)[0];

    if (!number) {
      throw new Meteor.Error(403, "accounts_phone_invalid");
      return false;
    }

    currentUserId = this.userId;

    if (!currentUserId) {
      return true;
    }

    currentUser = Accounts.user();
    currentNumber = (ref = currentUser.phone) != null ? ref.number : void 0;

    if (currentNumber && currentNumber === number) {
      return true;
    }

    repeatNumberUser = db.users.findOne({
      'phone.number': number
    }, {
      fields: {
        _id: 1,
        phone: 1
      }
    });

    if (repeatNumberUser) {
      if ((ref1 = repeatNumberUser.phone) != null ? ref1.verified : void 0) {
        throw new Meteor.Error(403, "accounts_phone_already_existed");
        return false;
      } else {
        db.users.update({
          _id: repeatNumberUser._id
        }, {
          $unset: {
            "phone": 1,
            "services.phone": 1
          }
        });
      }
    }

    db.users.update({
      _id: currentUserId
    }, {
      $set: {
        phone: {
          number: number,
          verified: false
        }
      }
    });
    return true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"disable_phone.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/server/methods/disable_phone.coffee                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  disablePhoneWithoutExpiredDays: function (expiredDays) {
    var currentUser, currentUserId, modified, now, outDays, ref, ref1, verified;
    check(expiredDays, Number);
    currentUserId = this.userId;

    if (!currentUserId) {
      return true;
    }

    currentUser = Accounts.user();
    verified = (ref = currentUser.phone) != null ? ref.verified : void 0;
    modified = (ref1 = currentUser.phone) != null ? ref1.modified : void 0;

    if (!(verified || modified)) {
      return true;
    }

    now = new Date();
    outDays = Math.floor((now.getTime() - modified.getTime()) / (24 * 60 * 60 * 1000));

    if (outDays >= expiredDays) {
      db.users.update({
        _id: currentUserId
      }, {
        $set: {
          "phone.verified": false
        }
      });
    }

    return true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"join_space_from_login.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/server/methods/join_space_from_login.coffee                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Phone;
Phone = require('phone');
Meteor.methods({
  joinSpaceFromLogin: function (options) {
    var currentUser, currentUserId, rootOrg, space, space_logined, space_user, user_email;
    check(options, Object);
    space_logined = options.space_logined;
    check(space_logined, String);
    currentUserId = this.userId;

    if (!currentUserId) {
      return true;
    }

    space = db.spaces.findOne(space_logined);

    if (!space) {
      throw new Meteor.Error(400, "space_users_error_space_not_found");
      return false;
    }

    currentUser = Accounts.user();
    space_user = db.space_users.findOne({
      space: space_logined,
      user: currentUser._id
    });

    if (space_user) {
      return true;
    }

    user_email = currentUser.emails[0].address;
    rootOrg = db.organizations.findOne({
      space: space_logined,
      parent: null
    }, {
      fields: {
        _id: 1
      }
    });
    db.space_users.insert({
      email: user_email,
      user: currentUser._id,
      name: currentUser.name,
      organizations: [rootOrg._id],
      space: space_logined,
      user_accepted: true,
      is_logined_from_space: true
    });
    return true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"check_user.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_accounts/server/methods/check_user.coffee                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  checkUser: function (options) {
    var company, email, name, password, profile, user;
    check(options, Object);
    company = options.company, name = options.name, email = options.email, password = options.password, profile = options.profile;
    check(company, String);
    check(name, String);
    check(email, String);
    check(password, Object);
    check(profile, Object);

    if (!company) {
      throw new Meteor.Error(403, "accounts_register_company_empty");
      return false;
    }

    if (!name) {
      throw new Meteor.Error(403, "accounts_register_name_empty");
      return false;
    }

    if (!email) {
      throw new Meteor.Error(403, "accounts_register_email_empty");
      return false;
    }

    if (!password) {
      throw new Meteor.Error(403, "accounts_register_password_empty");
      return false;
    }

    email = email.toLowerCase().replace(/\s+/gm, '');
    user = db.users.findOne({
      'emails.address': email
    });

    if (user) {
      throw new Meteor.Error(403, "accounts_register_email_exist");
      return false;
    }

    return true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"phone":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/steedos_accounts/node_modules/phone/package.json                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "phone",
  "version": "1.0.3",
  "main": "./lib/index"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/steedos_accounts/node_modules/phone/lib/index.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:accounts/i18n/en.i18n.json.js");
require("/node_modules/meteor/steedos:accounts/i18n/zh-CN.i18n.json.js");
require("/node_modules/meteor/steedos:accounts/checkNpm.js");
require("/node_modules/meteor/steedos:accounts/lib/URI.js");
require("/node_modules/meteor/steedos:accounts/lib/core.coffee");
require("/node_modules/meteor/steedos:accounts/lib/force_bind_phone.coffee");
require("/node_modules/meteor/steedos:accounts/lib/accounts.coffee");
require("/node_modules/meteor/steedos:accounts/routes/setup.coffee");
require("/node_modules/meteor/steedos:accounts/password_server.js");
require("/node_modules/meteor/steedos:accounts/server/methods/update_phone.coffee");
require("/node_modules/meteor/steedos:accounts/server/methods/disable_phone.coffee");
require("/node_modules/meteor/steedos:accounts/server/methods/join_space_from_login.coffee");
require("/node_modules/meteor/steedos:accounts/server/methods/check_user.coffee");

/* Exports */
Package._define("steedos:accounts");

})();

//# sourceURL=meteor://💻app/packages/steedos_accounts.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9saWIvVVJJLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9mb3JjZV9iaW5kX3Bob25lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2ZvcmNlX2JpbmRfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YWNjb3VudHMvcGFzc3dvcmRfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvZGlzYWJsZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2Rpc2FibGVfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvY2hlY2tfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2NoZWNrX3VzZXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImNvb2tpZXMiLCJwaG9uZSIsInNoYTI1NiIsInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiVVJJIiwicHVueWNvZGUiLCJJUHY2IiwiU2Vjb25kTGV2ZWxEb21haW5zIiwiU0xEIiwiX1VSSSIsInVybCIsImJhc2UiLCJfdXJsU3VwcGxpZWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJfYmFzZVN1cHBsaWVkIiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwibG9jYXRpb24iLCJocmVmIiwiYWJzb2x1dGVUbyIsInZlcnNpb24iLCJwIiwicHJvdG90eXBlIiwiaGFzT3duIiwiT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJlc2NhcGVSZWdFeCIsInN0cmluZyIsInJlcGxhY2UiLCJnZXRUeXBlIiwidmFsdWUiLCJTdHJpbmciLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsImlzQXJyYXkiLCJvYmoiLCJmaWx0ZXJBcnJheVZhbHVlcyIsImRhdGEiLCJsb29rdXAiLCJpIiwiX21hdGNoIiwidGVzdCIsInNwbGljZSIsImFycmF5Q29udGFpbnMiLCJsaXN0IiwiX3R5cGUiLCJtYXRjaCIsImFycmF5c0VxdWFsIiwib25lIiwidHdvIiwic29ydCIsImwiLCJ0cmltU2xhc2hlcyIsInRleHQiLCJ0cmltX2V4cHJlc3Npb24iLCJfcGFydHMiLCJwcm90b2NvbCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJob3N0bmFtZSIsInVybiIsInBvcnQiLCJwYXRoIiwicXVlcnkiLCJmcmFnbWVudCIsImR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyIsImVzY2FwZVF1ZXJ5U3BhY2UiLCJwcm90b2NvbF9leHByZXNzaW9uIiwiaWRuX2V4cHJlc3Npb24iLCJwdW55Y29kZV9leHByZXNzaW9uIiwiaXA0X2V4cHJlc3Npb24iLCJpcDZfZXhwcmVzc2lvbiIsImZpbmRfdXJpX2V4cHJlc3Npb24iLCJmaW5kVXJpIiwic3RhcnQiLCJlbmQiLCJ0cmltIiwiZGVmYXVsdFBvcnRzIiwiaHR0cCIsImh0dHBzIiwiZnRwIiwiZ29waGVyIiwid3MiLCJ3c3MiLCJpbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMiLCJkb21BdHRyaWJ1dGVzIiwiZ2V0RG9tQXR0cmlidXRlIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJ0eXBlIiwiZXNjYXBlRm9yRHVtYkZpcmVmb3gzNiIsImVzY2FwZSIsInN0cmljdEVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZSIsImRlY29kZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImlzbzg4NTkiLCJ1bmVzY2FwZSIsInVuaWNvZGUiLCJjaGFyYWN0ZXJzIiwicGF0aG5hbWUiLCJleHByZXNzaW9uIiwibWFwIiwicmVzZXJ2ZWQiLCJ1cm5wYXRoIiwiZW5jb2RlUXVlcnkiLCJlc2NhcGVkIiwiZGVjb2RlUXVlcnkiLCJlIiwiX3BhcnQiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiX2dyb3VwIiwiYyIsImdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uIiwiX3NlcCIsIl9jb2RpbmdGdW5jTmFtZSIsIl9pbm5lckNvZGluZ0Z1bmNOYW1lIiwiYWN0dWFsQ29kaW5nRnVuYyIsInNlZ21lbnRzIiwic3BsaXQiLCJqb2luIiwiZGVjb2RlUGF0aCIsImRlY29kZVVyblBhdGgiLCJyZWNvZGVQYXRoIiwicmVjb2RlVXJuUGF0aCIsImVuY29kZVJlc2VydmVkIiwicGFyc2UiLCJwYXJ0cyIsInBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJwYXJzZUF1dGhvcml0eSIsInBhcnNlSG9zdCIsImJyYWNrZXRQb3MiLCJ0IiwiY2hhckF0IiwiZmlyc3RDb2xvbiIsImZpcnN0U2xhc2giLCJuZXh0Q29sb24iLCJwYXJzZVVzZXJpbmZvIiwibGFzdEluZGV4T2YiLCJzaGlmdCIsInBhcnNlUXVlcnkiLCJpdGVtcyIsInNwbGl0cyIsIm5hbWUiLCJwdXNoIiwiYnVpbGQiLCJidWlsZEF1dGhvcml0eSIsImJ1aWxkSG9zdCIsImJ1aWxkVXNlcmluZm8iLCJidWlsZFF1ZXJ5IiwidW5pcXVlIiwia2V5IiwiYnVpbGRRdWVyeVBhcmFtZXRlciIsImFkZFF1ZXJ5IiwiY29uY2F0IiwicmVtb3ZlUXVlcnkiLCJoYXNRdWVyeSIsIndpdGhpbkFycmF5IiwiX2Jvb2x5IiwiQm9vbGVhbiIsIm9wIiwiY29tbW9uUGF0aCIsIk1hdGgiLCJtaW4iLCJ3aXRoaW5TdHJpbmciLCJjYWxsYmFjayIsIm9wdGlvbnMiLCJfc3RhcnQiLCJfZW5kIiwiX3RyaW0iLCJfYXR0cmlidXRlT3BlbiIsImxhc3RJbmRleCIsImV4ZWMiLCJpbmRleCIsImlnbm9yZUh0bWwiLCJhdHRyaWJ1dGVPcGVuIiwibWF4Iiwic2VhcmNoIiwiaWdub3JlIiwicmVzdWx0IiwiZW5zdXJlVmFsaWRIb3N0bmFtZSIsInRvQVNDSUkiLCJub0NvbmZsaWN0IiwicmVtb3ZlQWxsIiwidW5jb25mbGljdGVkIiwiVVJJVGVtcGxhdGUiLCJkZWZlckJ1aWxkIiwiX2RlZmVycmVkX2J1aWxkIiwiX3N0cmluZyIsImNsb25lIiwidmFsdWVPZiIsImdlbmVyYXRlU2ltcGxlQWNjZXNzb3IiLCJnZW5lcmF0ZVByZWZpeEFjY2Vzc29yIiwiX2tleSIsImhhc2giLCJyZXMiLCJfb2JqZWN0IiwiYXR0cmlidXRlIiwic3JjIiwiaXMiLCJ3aGF0IiwiaXAiLCJpcDQiLCJpcDYiLCJzbGQiLCJpZG4iLCJyZWxhdGl2ZSIsImhhcyIsIl9wcm90b2NvbCIsIl9wb3J0IiwiX2hvc3RuYW1lIiwic2NoZW1lIiwieCIsIm9yaWdpbiIsImF1dGhvcml0eSIsImhvc3QiLCJ1c2VyaW5mbyIsInJlc291cmNlIiwic3ViZG9tYWluIiwiZG9tYWluIiwic3ViIiwiUmVnRXhwIiwidGxkIiwiZ2V0IiwiUmVmZXJlbmNlRXJyb3IiLCJkaXJlY3RvcnkiLCJmaWxlbmFtZSIsImRlY29kZVBhdGhTZWdtZW50IiwibXV0YXRlZERpcmVjdG9yeSIsIm5vcm1hbGl6ZVBhdGgiLCJzdWZmaXgiLCJzIiwic2VnbWVudCIsInNlcGFyYXRvciIsImFic29sdXRlIiwiRXJyb3IiLCJwb3AiLCJ1bnNoaWZ0Iiwic2VnbWVudENvZGVkIiwicSIsInNldFF1ZXJ5Iiwic2V0U2VhcmNoIiwiYWRkU2VhcmNoIiwicmVtb3ZlU2VhcmNoIiwiaGFzU2VhcmNoIiwibm9ybWFsaXplIiwibm9ybWFsaXplUHJvdG9jb2wiLCJub3JtYWxpemVRdWVyeSIsIm5vcm1hbGl6ZUZyYWdtZW50Iiwibm9ybWFsaXplSG9zdG5hbWUiLCJub3JtYWxpemVQb3J0IiwiYmVzdCIsIl9wYXRoIiwiX3dhc19yZWxhdGl2ZSIsIl9sZWFkaW5nUGFyZW50cyIsIl9wYXJlbnQiLCJfcG9zIiwibm9ybWFsaXplUGF0aG5hbWUiLCJub3JtYWxpemVTZWFyY2giLCJub3JtYWxpemVIYXNoIiwiZCIsInJlYWRhYmxlIiwidXJpIiwidG9Vbmljb2RlIiwicXAiLCJrdiIsInJlc29sdmVkIiwicHJvcGVydGllcyIsImJhc2VkaXIiLCJyZWxhdGl2ZVRvIiwicmVsYXRpdmVQYXJ0cyIsImJhc2VQYXJ0cyIsImNvbW1vbiIsInJlbGF0aXZlUGF0aCIsImJhc2VQYXRoIiwicGFyZW50cyIsImVxdWFscyIsIm9uZV9tYXAiLCJ0d29fbWFwIiwiY2hlY2tlZCIsIm9uZV9xdWVyeSIsInR3b19xdWVyeSIsIlN0ZWVkb3MiLCJNZXRlb3IiLCJhYnNvbHV0ZVVybCIsIl8iLCJleHRlbmQiLCJBY2NvdW50cyIsInVwZGF0ZVBob25lIiwibnVtYmVyIiwiaXNTZXJ2ZXIiLCJpc0NsaWVudCIsImRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cyIsImV4cGlyZWREYXlzIiwiZ2V0UGhvbmVOdW1iZXIiLCJpc0luY2x1ZGVQcmVmaXgiLCJ1c2VyIiwicmVmIiwicmVmMSIsImRiIiwidXNlcnMiLCJmaW5kT25lIiwibW9iaWxlIiwiRTE2NCIsImdldFBob25lTnVtYmVyV2l0aG91dFByZWZpeCIsImdldFBob25lUHJlZml4IiwicHJlZml4IiwiY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCIsInJlZjIiLCJzZXR0aW5ncyIsImZvcmNlQWNjb3VudEJpbmRQaG9uZSIsIm1ldGhvZHMiLCJjaGVja0ZvcmNlQmluZFBob25lIiwic3BhY2VzIiwibm9Gb3JjZVVzZXJzIiwic3BhY2Vfc2V0dGluZ3MiLCJjaGVjayIsIkFycmF5IiwiZmluZCIsInNwYWNlIiwiJGluIiwiZm9yRWFjaCIsIm4iLCJyZWYzIiwidmFsdWVzIiwidW5pb24iLCJ1c2VySWQiLCJpc0ZvcmNlQmluZFBob25lIiwicmVmNCIsInJlZjUiLCJpc01vYmlsZSIsIm9uTG9naW4iLCJpc1Bob25lVmVyaWZpZWQiLCJzZXRUaW1lb3V0IiwiZmV0Y2giLCJnZXRQcm9wZXJ0eSIsImVycm9yIiwicmVzdWx0cyIsInJvdXRlclBhdGgiLCJzZXR1cFVybCIsInRvYXN0ciIsInJlYXNvbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImN1cnJlbnQiLCJjbG9zZUJ1dHRvbiIsInRpbWVPdXQiLCJleHRlbmRlZFRpbWVPdXQiLCJvbmNsaWNrIiwib3BlbldpbmRvdyIsInB3ZEZpZWxkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwiUGFja2FnZSIsIkFjY291bnRzVGVtcGxhdGVzIiwiY29uZmlndXJlIiwiZGVmYXVsdExheW91dCIsImRlZmF1bHRMYXlvdXRSZWdpb25zIiwibmF2IiwiZGVmYXVsdENvbnRlbnRSZWdpb24iLCJzaG93Rm9yZ290UGFzc3dvcmRMaW5rIiwib3ZlcnJpZGVMb2dpbkVycm9ycyIsImVuYWJsZVBhc3N3b3JkQ2hhbmdlIiwiaG9tZVJvdXRlUGF0aCIsIm5lZ2F0aXZlVmFsaWRhdGlvbiIsInBvc2l0aXZlVmFsaWRhdGlvbiIsIm5lZ2F0aXZlRmVlZGJhY2siLCJwb3NpdGl2ZUZlZWRiYWNrIiwic2hvd0xhYmVscyIsInByZVNpZ25VcEhvb2siLCJwcm9maWxlIiwibG9jYWxlIiwiZ2V0TG9jYWxlIiwiY29uZmlndXJlUm91dGUiLCJyZWRpcmVjdCIsInF1ZXJ5UGFyYW1zIiwiZG9jdW1lbnQiLCJlbWFpbCIsImVtYWlscyIsImFkZHJlc3MiLCIkIiwiYm9keSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJtZXNzYWdlIiwicmVtb3ZlRmllbGQiLCJhZGRGaWVsZHMiLCJfaWQiLCJyZXF1aXJlZCIsImRpc3BsYXlOYW1lIiwicmUiLCJlcnJTdHIiLCJwbGFjZWhvbGRlciIsImZvcmdvdFB3ZCIsIm1pbkxlbmd0aCIsImVtYWlsVGVtcGxhdGVzIiwic2l0ZU5hbWUiLCJmcm9tIiwiYWNjb3VudHMiLCJkaXNhYmxlQWNjb3VudFJlZ2lzdHJhdGlvbiIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImJjcnlwdCIsIk5wbU1vZHVsZUJjcnlwdCIsImJjcnlwdEhhc2giLCJ3cmFwQXN5bmMiLCJiY3J5cHRDb21wYXJlIiwiY29tcGFyZSIsInBhc3N3b3JkVmFsaWRhdG9yIiwiTWF0Y2giLCJPbmVPZiIsImRpZ2VzdCIsImFsZ29yaXRobSIsImNoZWNrUGFzc3dvcmQiLCJfY2hlY2tQYXNzd29yZCIsImdldFBhc3N3b3JkU3RyaW5nIiwiU0hBMjU2IiwiaGFzaFBhc3N3b3JkIiwiX2JjcnlwdFJvdW5kcyIsImhhbmRsZUVycm9yIiwibXNnIiwidGhyb3dFcnJvciIsIl9vcHRpb25zIiwiYW1iaWd1b3VzRXJyb3JNZXNzYWdlcyIsImdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyIsInBlcm11dGF0aW9ucyIsImNoIiwiZmxhdHRlbiIsImxvd2VyQ2FzZUNoYXIiLCJ1cHBlckNhc2VDaGFyIiwidG9VcHBlckNhc2UiLCJzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAiLCJmaWVsZE5hbWUiLCJvckNsYXVzZSIsInByZWZpeFBlcm11dGF0aW9uIiwic2VsZWN0b3IiLCJfZXNjYXBlUmVnRXhwIiwiY2FzZUluc2Vuc2l0aXZlQ2xhdXNlIiwiJGFuZCIsIiRvciIsIl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zIiwiaWQiLCJmaWVsZFZhbHVlIiwiY2FuZGlkYXRlVXNlcnMiLCJOb25FbXB0eVN0cmluZyIsIldoZXJlIiwidXNlclF1ZXJ5VmFsaWRhdG9yIiwiT3B0aW9uYWwiLCJrZXlzIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJwYXNzd29yZDIiLCJzcnAiLCJzZXJ2aWNlcyIsInZlcmlmaWVyIiwibmV3VmVyaWZpZXIiLCJTUlAiLCJnZW5lcmF0ZVZlcmlmaWVyIiwiaWRlbnRpdHkiLCJzYWx0IiwiRUpTT04iLCJzdHJpbmdpZnkiLCJmb3JtYXQiLCJ2MSIsInYyIiwiaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCIsInNhbHRlZCIsInVwZGF0ZSIsIiR1bnNldCIsIiRzZXQiLCJQaG9uZSIsInJlcXVpcmUiLCJjdXJyZW50TnVtYmVyIiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlcklkIiwicmVwZWF0TnVtYmVyVXNlciIsImZpZWxkcyIsInZlcmlmaWVkIiwibW9kaWZpZWQiLCJub3ciLCJvdXREYXlzIiwiTnVtYmVyIiwiRGF0ZSIsImZsb29yIiwiZ2V0VGltZSIsImpvaW5TcGFjZUZyb21Mb2dpbiIsInJvb3RPcmciLCJzcGFjZV9sb2dpbmVkIiwic3BhY2VfdXNlciIsInVzZXJfZW1haWwiLCJzcGFjZV91c2VycyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnQiLCJpbnNlcnQiLCJ1c2VyX2FjY2VwdGVkIiwiaXNfbG9naW5lZF9mcm9tX3NwYWNlIiwiY2hlY2tVc2VyIiwiY29tcGFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LFFBQUduRixJQUFIO0FBQ0MsWUFBTSxJQUFJYixPQUFPaEQsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwrQkFBdEIsQ0FBTjtBQUNBLGFBQU8sS0FBUDtBQ09HOztBRExKLFdBQU8sSUFBUDtBQTVCYztBQUFBLENBQWYsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hY2NvdW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0Y29va2llczogXCJeMC42LjJcIixcblx0cGhvbmU6IFwiXjEuMC4xMlwiLFxuXHRzaGEyNTY6IFwiXjAuMi4wXCJcbn0sICdzdGVlZG9zOmFjY291bnRzJyk7IiwiLyohXG4gKiBVUkkuanMgLSBNdXRhdGluZyBVUkxzXG4gKlxuICogVmVyc2lvbjogMS4xNy4wXG4gKlxuICogQXV0aG9yOiBSb2RuZXkgUmVobVxuICogV2ViOiBodHRwOi8vbWVkaWFsaXplLmdpdGh1Yi5pby9VUkkuanMvXG4gKlxuICogTGljZW5zZWQgdW5kZXJcbiAqICAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZVxuICogICBHUEwgdjMgaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL0dQTC0zLjBcbiAqXG4gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAndXNlIHN0cmljdCc7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuICAvLyBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIC8vICAgLy8gTm9kZVxuICAvLyAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCcuL3B1bnljb2RlJyksIHJlcXVpcmUoJy4vSVB2NicpLCByZXF1aXJlKCcuL1NlY29uZExldmVsRG9tYWlucycpKTtcbiAgLy8gfSBlbHNlXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFsnLi9wdW55Y29kZScsICcuL0lQdjYnLCAnLi9TZWNvbmRMZXZlbERvbWFpbnMnXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LlVSSSA9IGZhY3Rvcnkocm9vdC5wdW55Y29kZSwgcm9vdC5JUHY2LCByb290LlNlY29uZExldmVsRG9tYWlucywgcm9vdCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24gKHB1bnljb2RlLCBJUHY2LCBTTEQsIHJvb3QpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvKmdsb2JhbCBsb2NhdGlvbiwgZXNjYXBlLCB1bmVzY2FwZSAqL1xuICAvLyBGSVhNRTogdjIuMC4wIHJlbmFtY2Ugbm9uLWNhbWVsQ2FzZSBwcm9wZXJ0aWVzIHRvIHVwcGVyY2FzZVxuICAvKmpzaGludCBjYW1lbGNhc2U6IGZhbHNlICovXG5cbiAgLy8gc2F2ZSBjdXJyZW50IFVSSSB2YXJpYWJsZSwgaWYgYW55XG4gIHZhciBfVVJJID0gcm9vdCAmJiByb290LlVSSTtcblxuICBmdW5jdGlvbiBVUkkodXJsLCBiYXNlKSB7XG4gICAgdmFyIF91cmxTdXBwbGllZCA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMTtcbiAgICB2YXIgX2Jhc2VTdXBwbGllZCA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMjtcblxuICAgIC8vIEFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCB0aGUgJ25ldycga2V5d29yZFxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVUkkpKSB7XG4gICAgICBpZiAoX3VybFN1cHBsaWVkKSB7XG4gICAgICAgIGlmIChfYmFzZVN1cHBsaWVkKSB7XG4gICAgICAgICAgcmV0dXJuIG5ldyBVUkkodXJsLCBiYXNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgVVJJKHVybCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgVVJJKCk7XG4gICAgfVxuXG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoX3VybFN1cHBsaWVkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3VuZGVmaW5lZCBpcyBub3QgYSB2YWxpZCBhcmd1bWVudCBmb3IgVVJJJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgbG9jYXRpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHVybCA9IGxvY2F0aW9uLmhyZWYgKyAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHVybCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuaHJlZih1cmwpO1xuXG4gICAgLy8gcmVzb2x2ZSB0byBiYXNlIGFjY29yZGluZyB0byBodHRwOi8vZHZjcy53My5vcmcvaGcvdXJsL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sI2NvbnN0cnVjdG9yXG4gICAgaWYgKGJhc2UgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuYWJzb2x1dGVUbyhiYXNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFVSSS52ZXJzaW9uID0gJzEuMTcuMCc7XG5cbiAgdmFyIHAgPSBVUkkucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuICBmdW5jdGlvbiBlc2NhcGVSZWdFeChzdHJpbmcpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9jb21taXQvODVhYzIxNzgzYzExZjhjY2FiMDYxMDZkYmE5NzM1YTMxYTg2OTI0ZCNjb21taXRjb21tZW50LTgyMTk2M1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvKFsuKis/Xj0hOiR7fSgpfFtcXF1cXC9cXFxcXSkvZywgJ1xcXFwkMScpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHlwZSh2YWx1ZSkge1xuICAgIC8vIElFOCBkb2Vzbid0IHJldHVybiBbT2JqZWN0IFVuZGVmaW5lZF0gYnV0IFtPYmplY3QgT2JqZWN0XSBmb3IgdW5kZWZpbmVkIHZhbHVlXG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiAnVW5kZWZpbmVkJztcbiAgICB9XG5cbiAgICByZXR1cm4gU3RyaW5nKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkpLnNsaWNlKDgsIC0xKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgcmV0dXJuIGdldFR5cGUob2JqKSA9PT0gJ0FycmF5JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbHRlckFycmF5VmFsdWVzKGRhdGEsIHZhbHVlKSB7XG4gICAgdmFyIGxvb2t1cCA9IHt9O1xuICAgIHZhciBpLCBsZW5ndGg7XG5cbiAgICBpZiAoZ2V0VHlwZSh2YWx1ZSkgPT09ICdSZWdFeHAnKSB7XG4gICAgICBsb29rdXAgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxvb2t1cFt2YWx1ZVtpXV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb29rdXBbdmFsdWVdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBkYXRhLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAvKmpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xuICAgICAgdmFyIF9tYXRjaCA9IGxvb2t1cCAmJiBsb29rdXBbZGF0YVtpXV0gIT09IHVuZGVmaW5lZFxuICAgICAgICB8fCAhbG9va3VwICYmIHZhbHVlLnRlc3QoZGF0YVtpXSk7XG4gICAgICAvKmpzaGludCBsYXhicmVhazogZmFsc2UgKi9cbiAgICAgIGlmIChfbWF0Y2gpIHtcbiAgICAgICAgZGF0YS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGxlbmd0aC0tO1xuICAgICAgICBpLS07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmdW5jdGlvbiBhcnJheUNvbnRhaW5zKGxpc3QsIHZhbHVlKSB7XG4gICAgdmFyIGksIGxlbmd0aDtcblxuICAgIC8vIHZhbHVlIG1heSBiZSBzdHJpbmcsIG51bWJlciwgYXJyYXksIHJlZ2V4cFxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgLy8gTm90ZTogdGhpcyBjYW4gYmUgb3B0aW1pemVkIHRvIE8obikgKGluc3RlYWQgb2YgY3VycmVudCBPKG0gKiBuKSlcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IHZhbHVlLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghYXJyYXlDb250YWlucyhsaXN0LCB2YWx1ZVtpXSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIF90eXBlID0gZ2V0VHlwZSh2YWx1ZSk7XG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gbGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKF90eXBlID09PSAnUmVnRXhwJykge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RbaV0gPT09ICdzdHJpbmcnICYmIGxpc3RbaV0ubWF0Y2godmFsdWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobGlzdFtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlzRXF1YWwob25lLCB0d28pIHtcbiAgICBpZiAoIWlzQXJyYXkob25lKSB8fCAhaXNBcnJheSh0d28pKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gYXJyYXlzIGNhbid0IGJlIGVxdWFsIGlmIHRoZXkgaGF2ZSBkaWZmZXJlbnQgYW1vdW50IG9mIGNvbnRlbnRcbiAgICBpZiAob25lLmxlbmd0aCAhPT0gdHdvLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uZS5zb3J0KCk7XG4gICAgdHdvLnNvcnQoKTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb25lLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKG9uZVtpXSAhPT0gdHdvW2ldKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyaW1TbGFzaGVzKHRleHQpIHtcbiAgICB2YXIgdHJpbV9leHByZXNzaW9uID0gL15cXC8rfFxcLyskL2c7XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSh0cmltX2V4cHJlc3Npb24sICcnKTtcbiAgfVxuXG4gIFVSSS5fcGFydHMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdG9jb2w6IG51bGwsXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgaG9zdG5hbWU6IG51bGwsXG4gICAgICB1cm46IG51bGwsXG4gICAgICBwb3J0OiBudWxsLFxuICAgICAgcGF0aDogbnVsbCxcbiAgICAgIHF1ZXJ5OiBudWxsLFxuICAgICAgZnJhZ21lbnQ6IG51bGwsXG4gICAgICAvLyBzdGF0ZVxuICAgICAgZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzOiBVUkkuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLFxuICAgICAgZXNjYXBlUXVlcnlTcGFjZTogVVJJLmVzY2FwZVF1ZXJ5U3BhY2VcbiAgICB9O1xuICB9O1xuICAvLyBzdGF0ZTogYWxsb3cgZHVwbGljYXRlIHF1ZXJ5IHBhcmFtZXRlcnMgKGE9MSZhPTEpXG4gIFVSSS5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSBmYWxzZTtcbiAgLy8gc3RhdGU6IHJlcGxhY2VzICsgd2l0aCAlMjAgKHNwYWNlIGluIHF1ZXJ5IHN0cmluZ3MpXG4gIFVSSS5lc2NhcGVRdWVyeVNwYWNlID0gdHJ1ZTtcbiAgLy8gc3RhdGljIHByb3BlcnRpZXNcbiAgVVJJLnByb3RvY29sX2V4cHJlc3Npb24gPSAvXlthLXpdW2EtejAtOS4rLV0qJC9pO1xuICBVUkkuaWRuX2V4cHJlc3Npb24gPSAvW15hLXowLTlcXC4tXS9pO1xuICBVUkkucHVueWNvZGVfZXhwcmVzc2lvbiA9IC8oeG4tLSkvaTtcbiAgLy8gd2VsbCwgMzMzLjQ0NC41NTUuNjY2IG1hdGNoZXMsIGJ1dCBpdCBzdXJlIGFpbid0IG5vIElQdjQgLSBkbyB3ZSBjYXJlP1xuICBVUkkuaXA0X2V4cHJlc3Npb24gPSAvXlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9JC87XG4gIC8vIGNyZWRpdHMgdG8gUmljaCBCcm93blxuICAvLyBzb3VyY2U6IGh0dHA6Ly9mb3J1bXMuaW50ZXJtYXBwZXIuY29tL3ZpZXd0b3BpYy5waHA/cD0xMDk2IzEwOTZcbiAgLy8gc3BlY2lmaWNhdGlvbjogaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDI5MS50eHRcbiAgVVJJLmlwNl9leHByZXNzaW9uID0gL15cXHMqKCgoWzAtOUEtRmEtZl17MSw0fTopezd9KFswLTlBLUZhLWZdezEsNH18OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezZ9KDpbMC05QS1GYS1mXXsxLDR9fCgoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwyfSl8OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NH0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwzfSl8KCg6WzAtOUEtRmEtZl17MSw0fSk/OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezN9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNH0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsMn06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Mn0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw1fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwzfTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsxfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDZ9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDR9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCg6KCgoOlswLTlBLUZhLWZdezEsNH0pezEsN30pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNX06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKCUuKyk/XFxzKiQvO1xuICAvLyBleHByZXNzaW9uIHVzZWQgaXMgXCJncnViZXIgcmV2aXNlZFwiIChAZ3J1YmVyIHYyKSBkZXRlcm1pbmVkIHRvIGJlIHRoZVxuICAvLyBiZXN0IHNvbHV0aW9uIGluIGEgcmVnZXgtZ29sZiB3ZSBkaWQgYSBjb3VwbGUgb2YgYWdlcyBhZ28gYXRcbiAgLy8gKiBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxuICAvLyAqIGh0dHA6Ly9yb2RuZXlyZWhtLmRlL3QvdXJsLXJlZ2V4Lmh0bWxcbiAgVVJJLmZpbmRfdXJpX2V4cHJlc3Npb24gPSAvXFxiKCg/OlthLXpdW1xcdy1dKzooPzpcXC97MSwzfXxbYS16MC05JV0pfHd3d1xcZHswLDN9Wy5dfFthLXowLTkuXFwtXStbLl1bYS16XXsyLDR9XFwvKSg/OlteXFxzKCk8Pl0rfFxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCkpKyg/OlxcKChbXlxccygpPD5dK3woXFwoW15cXHMoKTw+XStcXCkpKSpcXCl8W15cXHNgISgpXFxbXFxde307OidcIi4sPD4/wqvCu+KAnOKAneKAmOKAmV0pKS9pZztcbiAgVVJJLmZpbmRVcmkgPSB7XG4gICAgLy8gdmFsaWQgXCJzY2hlbWU6Ly9cIiBvciBcInd3dy5cIlxuICAgIHN0YXJ0OiAvXFxiKD86KFthLXpdW2EtejAtOS4rLV0qOlxcL1xcLyl8d3d3XFwuKS9naSxcbiAgICAvLyBldmVyeXRoaW5nIHVwIHRvIHRoZSBuZXh0IHdoaXRlc3BhY2VcbiAgICBlbmQ6IC9bXFxzXFxyXFxuXXwkLyxcbiAgICAvLyB0cmltIHRyYWlsaW5nIHB1bmN0dWF0aW9uIGNhcHR1cmVkIGJ5IGVuZCBSZWdFeHBcbiAgICB0cmltOiAvW2AhKClcXFtcXF17fTs6J1wiLiw8Pj/Cq8K74oCc4oCd4oCe4oCY4oCZXSskL1xuICB9O1xuICAvLyBodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL3VyaS1zY2hlbWVzLmh0bWxcbiAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX1RDUF9hbmRfVURQX3BvcnRfbnVtYmVycyNXZWxsLWtub3duX3BvcnRzXG4gIFVSSS5kZWZhdWx0UG9ydHMgPSB7XG4gICAgaHR0cDogJzgwJyxcbiAgICBodHRwczogJzQ0MycsXG4gICAgZnRwOiAnMjEnLFxuICAgIGdvcGhlcjogJzcwJyxcbiAgICB3czogJzgwJyxcbiAgICB3c3M6ICc0NDMnXG4gIH07XG4gIC8vIGFsbG93ZWQgaG9zdG5hbWUgY2hhcmFjdGVycyBhY2NvcmRpbmcgdG8gUkZDIDM5ODZcbiAgLy8gQUxQSEEgRElHSVQgXCItXCIgXCIuXCIgXCJfXCIgXCJ+XCIgXCIhXCIgXCIkXCIgXCImXCIgXCInXCIgXCIoXCIgXCIpXCIgXCIqXCIgXCIrXCIgXCIsXCIgXCI7XCIgXCI9XCIgJWVuY29kZWRcbiAgLy8gSSd2ZSBuZXZlciBzZWVuIGEgKG5vbi1JRE4pIGhvc3RuYW1lIG90aGVyIHRoYW46IEFMUEhBIERJR0lUIC4gLVxuICBVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzID0gL1teYS16QS1aMC05XFwuLV0vO1xuICAvLyBtYXAgRE9NIEVsZW1lbnRzIHRvIHRoZWlyIFVSSSBhdHRyaWJ1dGVcbiAgVVJJLmRvbUF0dHJpYnV0ZXMgPSB7XG4gICAgJ2EnOiAnaHJlZicsXG4gICAgJ2Jsb2NrcXVvdGUnOiAnY2l0ZScsXG4gICAgJ2xpbmsnOiAnaHJlZicsXG4gICAgJ2Jhc2UnOiAnaHJlZicsXG4gICAgJ3NjcmlwdCc6ICdzcmMnLFxuICAgICdmb3JtJzogJ2FjdGlvbicsXG4gICAgJ2ltZyc6ICdzcmMnLFxuICAgICdhcmVhJzogJ2hyZWYnLFxuICAgICdpZnJhbWUnOiAnc3JjJyxcbiAgICAnZW1iZWQnOiAnc3JjJyxcbiAgICAnc291cmNlJzogJ3NyYycsXG4gICAgJ3RyYWNrJzogJ3NyYycsXG4gICAgJ2lucHV0JzogJ3NyYycsIC8vIGJ1dCBvbmx5IGlmIHR5cGU9XCJpbWFnZVwiXG4gICAgJ2F1ZGlvJzogJ3NyYycsXG4gICAgJ3ZpZGVvJzogJ3NyYydcbiAgfTtcbiAgVVJJLmdldERvbUF0dHJpYnV0ZSA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUgfHwgIW5vZGUubm9kZU5hbWUpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIC8vIDxpbnB1dD4gc2hvdWxkIG9ubHkgZXhwb3NlIHNyYyBmb3IgdHlwZT1cImltYWdlXCJcbiAgICBpZiAobm9kZU5hbWUgPT09ICdpbnB1dCcgJiYgbm9kZS50eXBlICE9PSAnaW1hZ2UnKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBVUkkuZG9tQXR0cmlidXRlc1tub2RlTmFtZV07XG4gIH07XG5cbiAgZnVuY3Rpb24gZXNjYXBlRm9yRHVtYkZpcmVmb3gzNih2YWx1ZSkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy85MVxuICAgIHJldHVybiBlc2NhcGUodmFsdWUpO1xuICB9XG5cbiAgLy8gZW5jb2RpbmcgLyBkZWNvZGluZyBhY2NvcmRpbmcgdG8gUkZDMzk4NlxuICBmdW5jdGlvbiBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKSB7XG4gICAgLy8gc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvZW5jb2RlVVJJQ29tcG9uZW50XG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChzdHJpbmcpXG4gICAgICAucmVwbGFjZSgvWyEnKCkqXS9nLCBlc2NhcGVGb3JEdW1iRmlyZWZveDM2KVxuICAgICAgLnJlcGxhY2UoL1xcKi9nLCAnJTJBJyk7XG4gIH1cbiAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcbiAgVVJJLmRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbiAgVVJJLmlzbzg4NTkgPSBmdW5jdGlvbigpIHtcbiAgICBVUkkuZW5jb2RlID0gZXNjYXBlO1xuICAgIFVSSS5kZWNvZGUgPSB1bmVzY2FwZTtcbiAgfTtcbiAgVVJJLnVuaWNvZGUgPSBmdW5jdGlvbigpIHtcbiAgICBVUkkuZW5jb2RlID0gc3RyaWN0RW5jb2RlVVJJQ29tcG9uZW50O1xuICAgIFVSSS5kZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG4gIH07XG4gIFVSSS5jaGFyYWN0ZXJzID0ge1xuICAgIHBhdGhuYW1lOiB7XG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgLy8gUkZDMzk4NiAyLjE6IEZvciBjb25zaXN0ZW5jeSwgVVJJIHByb2R1Y2VycyBhbmQgbm9ybWFsaXplcnMgc2hvdWxkXG4gICAgICAgIC8vIHVzZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgZGlnaXRzIGZvciBhbGwgcGVyY2VudC1lbmNvZGluZ3MuXG4gICAgICAgIGV4cHJlc3Npb246IC8lKDI0fDI2fDJCfDJDfDNCfDNEfDNBfDQwKS9pZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgLy8gLS5ffiEnKCkqXG4gICAgICAgICAgJyUyNCc6ICckJyxcbiAgICAgICAgICAnJTI2JzogJyYnLFxuICAgICAgICAgICclMkInOiAnKycsXG4gICAgICAgICAgJyUyQyc6ICcsJyxcbiAgICAgICAgICAnJTNCJzogJzsnLFxuICAgICAgICAgICclM0QnOiAnPScsXG4gICAgICAgICAgJyUzQSc6ICc6JyxcbiAgICAgICAgICAnJTQwJzogJ0AnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkZWNvZGU6IHtcbiAgICAgICAgZXhwcmVzc2lvbjogL1tcXC9cXD8jXS9nLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAnLyc6ICclMkYnLFxuICAgICAgICAgICc/JzogJyUzRicsXG4gICAgICAgICAgJyMnOiAnJTIzJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZXNlcnZlZDoge1xuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIC8vIFJGQzM5ODYgMi4xOiBGb3IgY29uc2lzdGVuY3ksIFVSSSBwcm9kdWNlcnMgYW5kIG5vcm1hbGl6ZXJzIHNob3VsZFxuICAgICAgICAvLyB1c2UgdXBwZXJjYXNlIGhleGFkZWNpbWFsIGRpZ2l0cyBmb3IgYWxsIHBlcmNlbnQtZW5jb2RpbmdzLlxuICAgICAgICBleHByZXNzaW9uOiAvJSgyMXwyM3wyNHwyNnwyN3wyOHwyOXwyQXwyQnwyQ3wyRnwzQXwzQnwzRHwzRnw0MHw1Qnw1RCkvaWcsXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgIC8vIGdlbi1kZWxpbXNcbiAgICAgICAgICAnJTNBJzogJzonLFxuICAgICAgICAgICclMkYnOiAnLycsXG4gICAgICAgICAgJyUzRic6ICc/JyxcbiAgICAgICAgICAnJTIzJzogJyMnLFxuICAgICAgICAgICclNUInOiAnWycsXG4gICAgICAgICAgJyU1RCc6ICddJyxcbiAgICAgICAgICAnJTQwJzogJ0AnLFxuICAgICAgICAgIC8vIHN1Yi1kZWxpbXNcbiAgICAgICAgICAnJTIxJzogJyEnLFxuICAgICAgICAgICclMjQnOiAnJCcsXG4gICAgICAgICAgJyUyNic6ICcmJyxcbiAgICAgICAgICAnJTI3JzogJ1xcJycsXG4gICAgICAgICAgJyUyOCc6ICcoJyxcbiAgICAgICAgICAnJTI5JzogJyknLFxuICAgICAgICAgICclMkEnOiAnKicsXG4gICAgICAgICAgJyUyQic6ICcrJyxcbiAgICAgICAgICAnJTJDJzogJywnLFxuICAgICAgICAgICclM0InOiAnOycsXG4gICAgICAgICAgJyUzRCc6ICc9J1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICB1cm5wYXRoOiB7XG4gICAgICAvLyBUaGUgY2hhcmFjdGVycyB1bmRlciBgZW5jb2RlYCBhcmUgdGhlIGNoYXJhY3RlcnMgY2FsbGVkIG91dCBieSBSRkMgMjE0MSBhcyBiZWluZyBhY2NlcHRhYmxlXG4gICAgICAvLyBmb3IgdXNhZ2UgaW4gYSBVUk4uIFJGQzIxNDEgYWxzbyBjYWxscyBvdXQgXCItXCIsIFwiLlwiLCBhbmQgXCJfXCIgYXMgYWNjZXB0YWJsZSBjaGFyYWN0ZXJzLCBidXRcbiAgICAgIC8vIHRoZXNlIGFyZW4ndCBlbmNvZGVkIGJ5IGVuY29kZVVSSUNvbXBvbmVudCwgc28gd2UgZG9uJ3QgaGF2ZSB0byBjYWxsIHRoZW0gb3V0IGhlcmUuIEFsc29cbiAgICAgIC8vIG5vdGUgdGhhdCB0aGUgY29sb24gY2hhcmFjdGVyIGlzIG5vdCBmZWF0dXJlZCBpbiB0aGUgZW5jb2RpbmcgbWFwOyB0aGlzIGlzIGJlY2F1c2UgVVJJLmpzXG4gICAgICAvLyBnaXZlcyB0aGUgY29sb25zIGluIFVSTnMgc2VtYW50aWMgbWVhbmluZyBhcyB0aGUgZGVsaW1pdGVycyBvZiBwYXRoIHNlZ2VtZW50cywgYW5kIHNvIGl0XG4gICAgICAvLyBzaG91bGQgbm90IGFwcGVhciB1bmVuY29kZWQgaW4gYSBzZWdtZW50IGl0c2VsZi5cbiAgICAgIC8vIFNlZSBhbHNvIHRoZSBub3RlIGFib3ZlIGFib3V0IFJGQzM5ODYgYW5kIGNhcGl0YWxhbGl6ZWQgaGV4IGRpZ2l0cy5cbiAgICAgIGVuY29kZToge1xuICAgICAgICBleHByZXNzaW9uOiAvJSgyMXwyNHwyN3wyOHwyOXwyQXwyQnwyQ3wzQnwzRHw0MCkvaWcsXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgICclMjEnOiAnIScsXG4gICAgICAgICAgJyUyNCc6ICckJyxcbiAgICAgICAgICAnJTI3JzogJ1xcJycsXG4gICAgICAgICAgJyUyOCc6ICcoJyxcbiAgICAgICAgICAnJTI5JzogJyknLFxuICAgICAgICAgICclMkEnOiAnKicsXG4gICAgICAgICAgJyUyQic6ICcrJyxcbiAgICAgICAgICAnJTJDJzogJywnLFxuICAgICAgICAgICclM0InOiAnOycsXG4gICAgICAgICAgJyUzRCc6ICc9JyxcbiAgICAgICAgICAnJTQwJzogJ0AnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBUaGVzZSBjaGFyYWN0ZXJzIGFyZSB0aGUgY2hhcmFjdGVycyBjYWxsZWQgb3V0IGJ5IFJGQzIxNDEgYXMgXCJyZXNlcnZlZFwiIGNoYXJhY3RlcnMgdGhhdFxuICAgICAgLy8gc2hvdWxkIG5ldmVyIGFwcGVhciBpbiBhIFVSTiwgcGx1cyB0aGUgY29sb24gY2hhcmFjdGVyIChzZWUgbm90ZSBhYm92ZSkuXG4gICAgICBkZWNvZGU6IHtcbiAgICAgICAgZXhwcmVzc2lvbjogL1tcXC9cXD8jOl0vZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgJy8nOiAnJTJGJyxcbiAgICAgICAgICAnPyc6ICclM0YnLFxuICAgICAgICAgICcjJzogJyUyMycsXG4gICAgICAgICAgJzonOiAnJTNBJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBVUkkuZW5jb2RlUXVlcnkgPSBmdW5jdGlvbihzdHJpbmcsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICB2YXIgZXNjYXBlZCA9IFVSSS5lbmNvZGUoc3RyaW5nICsgJycpO1xuICAgIGlmIChlc2NhcGVRdWVyeVNwYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2UgPSBVUkkuZXNjYXBlUXVlcnlTcGFjZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXNjYXBlUXVlcnlTcGFjZSA/IGVzY2FwZWQucmVwbGFjZSgvJTIwL2csICcrJykgOiBlc2NhcGVkO1xuICB9O1xuICBVUkkuZGVjb2RlUXVlcnkgPSBmdW5jdGlvbihzdHJpbmcsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICBzdHJpbmcgKz0gJyc7XG4gICAgaWYgKGVzY2FwZVF1ZXJ5U3BhY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXNjYXBlUXVlcnlTcGFjZSA9IFVSSS5lc2NhcGVRdWVyeVNwYWNlO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gVVJJLmRlY29kZShlc2NhcGVRdWVyeVNwYWNlID8gc3RyaW5nLnJlcGxhY2UoL1xcKy9nLCAnJTIwJykgOiBzdHJpbmcpO1xuICAgIH0gY2F0Y2goZSkge1xuICAgICAgLy8gd2UncmUgbm90IGdvaW5nIHRvIG1lc3Mgd2l0aCB3ZWlyZCBlbmNvZGluZ3MsXG4gICAgICAvLyBnaXZlIHVwIGFuZCByZXR1cm4gdGhlIHVuZGVjb2RlZCBvcmlnaW5hbCBzdHJpbmdcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvODdcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvOTJcbiAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgfVxuICB9O1xuICAvLyBnZW5lcmF0ZSBlbmNvZGUvZGVjb2RlIHBhdGggZnVuY3Rpb25zXG4gIHZhciBfcGFydHMgPSB7J2VuY29kZSc6J2VuY29kZScsICdkZWNvZGUnOidkZWNvZGUnfTtcbiAgdmFyIF9wYXJ0O1xuICB2YXIgZ2VuZXJhdGVBY2Nlc3NvciA9IGZ1bmN0aW9uKF9ncm91cCwgX3BhcnQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gVVJJW19wYXJ0XShzdHJpbmcgKyAnJykucmVwbGFjZShVUkkuY2hhcmFjdGVyc1tfZ3JvdXBdW19wYXJ0XS5leHByZXNzaW9uLCBmdW5jdGlvbihjKSB7XG4gICAgICAgICAgcmV0dXJuIFVSSS5jaGFyYWN0ZXJzW19ncm91cF1bX3BhcnRdLm1hcFtjXTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIHdlJ3JlIG5vdCBnb2luZyB0byBtZXNzIHdpdGggd2VpcmQgZW5jb2RpbmdzLFxuICAgICAgICAvLyBnaXZlIHVwIGFuZCByZXR1cm4gdGhlIHVuZGVjb2RlZCBvcmlnaW5hbCBzdHJpbmdcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy84N1xuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzkyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBmb3IgKF9wYXJ0IGluIF9wYXJ0cykge1xuICAgIFVSSVtfcGFydCArICdQYXRoU2VnbWVudCddID0gZ2VuZXJhdGVBY2Nlc3NvcigncGF0aG5hbWUnLCBfcGFydHNbX3BhcnRdKTtcbiAgICBVUklbX3BhcnQgKyAnVXJuUGF0aFNlZ21lbnQnXSA9IGdlbmVyYXRlQWNjZXNzb3IoJ3VybnBhdGgnLCBfcGFydHNbX3BhcnRdKTtcbiAgfVxuXG4gIHZhciBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbiA9IGZ1bmN0aW9uKF9zZXAsIF9jb2RpbmdGdW5jTmFtZSwgX2lubmVyQ29kaW5nRnVuY05hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAvLyBXaHkgcGFzcyBpbiBuYW1lcyBvZiBmdW5jdGlvbnMsIHJhdGhlciB0aGFuIHRoZSBmdW5jdGlvbiBvYmplY3RzIHRoZW1zZWx2ZXM/IFRoZVxuICAgICAgLy8gZGVmaW5pdGlvbnMgb2Ygc29tZSBmdW5jdGlvbnMgKGJ1dCBpbiBwYXJ0aWN1bGFyLCBVUkkuZGVjb2RlKSB3aWxsIG9jY2FzaW9uYWxseSBjaGFuZ2UgZHVlXG4gICAgICAvLyB0byBVUkkuanMgaGF2aW5nIElTTzg4NTkgYW5kIFVuaWNvZGUgbW9kZXMuIFBhc3NpbmcgaW4gdGhlIG5hbWUgYW5kIGdldHRpbmcgaXQgd2lsbCBlbnN1cmVcbiAgICAgIC8vIHRoYXQgdGhlIGZ1bmN0aW9ucyB3ZSB1c2UgaGVyZSBhcmUgXCJmcmVzaFwiLlxuICAgICAgdmFyIGFjdHVhbENvZGluZ0Z1bmM7XG4gICAgICBpZiAoIV9pbm5lckNvZGluZ0Z1bmNOYW1lKSB7XG4gICAgICAgIGFjdHVhbENvZGluZ0Z1bmMgPSBVUklbX2NvZGluZ0Z1bmNOYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFjdHVhbENvZGluZ0Z1bmMgPSBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgICByZXR1cm4gVVJJW19jb2RpbmdGdW5jTmFtZV0oVVJJW19pbm5lckNvZGluZ0Z1bmNOYW1lXShzdHJpbmcpKTtcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNlZ21lbnRzID0gKHN0cmluZyArICcnKS5zcGxpdChfc2VwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNlZ21lbnRzW2ldID0gYWN0dWFsQ29kaW5nRnVuYyhzZWdtZW50c1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWdtZW50cy5qb2luKF9zZXApO1xuICAgIH07XG4gIH07XG5cbiAgLy8gVGhpcyB0YWtlcyBwbGFjZSBvdXRzaWRlIHRoZSBhYm92ZSBsb29wIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCwgZS5nLiwgZW5jb2RlVXJuUGF0aCBmdW5jdGlvbnMuXG4gIFVSSS5kZWNvZGVQYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJy8nLCAnZGVjb2RlUGF0aFNlZ21lbnQnKTtcbiAgVVJJLmRlY29kZVVyblBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignOicsICdkZWNvZGVVcm5QYXRoU2VnbWVudCcpO1xuICBVUkkucmVjb2RlUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCcvJywgJ2VuY29kZVBhdGhTZWdtZW50JywgJ2RlY29kZScpO1xuICBVUkkucmVjb2RlVXJuUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCc6JywgJ2VuY29kZVVyblBhdGhTZWdtZW50JywgJ2RlY29kZScpO1xuXG4gIFVSSS5lbmNvZGVSZXNlcnZlZCA9IGdlbmVyYXRlQWNjZXNzb3IoJ3Jlc2VydmVkJywgJ2VuY29kZScpO1xuXG4gIFVSSS5wYXJzZSA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICB2YXIgcG9zO1xuICAgIGlmICghcGFydHMpIHtcbiAgICAgIHBhcnRzID0ge307XG4gICAgfVxuICAgIC8vIFtwcm90b2NvbFwiOi8vXCJbdXNlcm5hbWVbXCI6XCJwYXNzd29yZF1cIkBcIl1ob3N0bmFtZVtcIjpcInBvcnRdXCIvXCI/XVtwYXRoXVtcIj9cInF1ZXJ5c3RyaW5nXVtcIiNcImZyYWdtZW50XVxuXG4gICAgLy8gZXh0cmFjdCBmcmFnbWVudFxuICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCcjJyk7XG4gICAgaWYgKHBvcyA+IC0xKSB7XG4gICAgICAvLyBlc2NhcGluZz9cbiAgICAgIHBhcnRzLmZyYWdtZW50ID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKSB8fCBudWxsO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpO1xuICAgIH1cblxuICAgIC8vIGV4dHJhY3QgcXVlcnlcbiAgICBwb3MgPSBzdHJpbmcuaW5kZXhPZignPycpO1xuICAgIGlmIChwb3MgPiAtMSkge1xuICAgICAgLy8gZXNjYXBpbmc/XG4gICAgICBwYXJ0cy5xdWVyeSA9IHN0cmluZy5zdWJzdHJpbmcocG9zICsgMSkgfHwgbnVsbDtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHByb3RvY29sXG4gICAgaWYgKHN0cmluZy5zdWJzdHJpbmcoMCwgMikgPT09ICcvLycpIHtcbiAgICAgIC8vIHJlbGF0aXZlLXNjaGVtZVxuICAgICAgcGFydHMucHJvdG9jb2wgPSBudWxsO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZygyKTtcbiAgICAgIC8vIGV4dHJhY3QgXCJ1c2VyOnBhc3NAaG9zdDpwb3J0XCJcbiAgICAgIHN0cmluZyA9IFVSSS5wYXJzZUF1dGhvcml0eShzdHJpbmcsIHBhcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zID0gc3RyaW5nLmluZGV4T2YoJzonKTtcbiAgICAgIGlmIChwb3MgPiAtMSkge1xuICAgICAgICBwYXJ0cy5wcm90b2NvbCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKSB8fCBudWxsO1xuICAgICAgICBpZiAocGFydHMucHJvdG9jb2wgJiYgIXBhcnRzLnByb3RvY29sLm1hdGNoKFVSSS5wcm90b2NvbF9leHByZXNzaW9uKSkge1xuICAgICAgICAgIC8vIDogbWF5IGJlIHdpdGhpbiB0aGUgcGF0aFxuICAgICAgICAgIHBhcnRzLnByb3RvY29sID0gdW5kZWZpbmVkO1xuICAgICAgICB9IGVsc2UgaWYgKHN0cmluZy5zdWJzdHJpbmcocG9zICsgMSwgcG9zICsgMykgPT09ICcvLycpIHtcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDMpO1xuXG4gICAgICAgICAgLy8gZXh0cmFjdCBcInVzZXI6cGFzc0Bob3N0OnBvcnRcIlxuICAgICAgICAgIHN0cmluZyA9IFVSSS5wYXJzZUF1dGhvcml0eShzdHJpbmcsIHBhcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpO1xuICAgICAgICAgIHBhcnRzLnVybiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB3aGF0J3MgbGVmdCBtdXN0IGJlIHRoZSBwYXRoXG4gICAgcGFydHMucGF0aCA9IHN0cmluZztcblxuICAgIC8vIGFuZCB3ZSdyZSBkb25lXG4gICAgcmV0dXJuIHBhcnRzO1xuICB9O1xuICBVUkkucGFyc2VIb3N0ID0gZnVuY3Rpb24oc3RyaW5nLCBwYXJ0cykge1xuICAgIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxuICAgIC8vIEJhY2sgc2xhc2hlcyBiZWZvcmUgdGhlIHF1ZXJ5IHN0cmluZyBnZXQgY29udmVydGVkIHRvIGZvcndhcmQgc2xhc2hlc1xuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2pveWVudC9ub2RlL2Jsb2IvMzg2ZmQyNGY0OWIwZTlkMWE4YTA3NjU5MmE0MDQxNjhmYWVlY2MzNC9saWIvdXJsLmpzI0wxMTUtTDEyNFxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTI1OTE2XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvcHVsbC8yMzNcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgLy8gZXh0cmFjdCBob3N0OnBvcnRcbiAgICB2YXIgcG9zID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgICB2YXIgYnJhY2tldFBvcztcbiAgICB2YXIgdDtcblxuICAgIGlmIChwb3MgPT09IC0xKSB7XG4gICAgICBwb3MgPSBzdHJpbmcubGVuZ3RoO1xuICAgIH1cblxuICAgIGlmIChzdHJpbmcuY2hhckF0KDApID09PSAnWycpIHtcbiAgICAgIC8vIElQdjYgaG9zdCAtIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL2RyYWZ0LWlldGYtNm1hbi10ZXh0LWFkZHItcmVwcmVzZW50YXRpb24tMDQjc2VjdGlvbi02XG4gICAgICAvLyBJIGNsYWltIG1vc3QgY2xpZW50IHNvZnR3YXJlIGJyZWFrcyBvbiBJUHY2IGFueXdheXMuIFRvIHNpbXBsaWZ5IHRoaW5ncywgVVJJIG9ubHkgYWNjZXB0c1xuICAgICAgLy8gSVB2Nitwb3J0IGluIHRoZSBmb3JtYXQgWzIwMDE6ZGI4OjoxXTo4MCAoZm9yIHRoZSB0aW1lIGJlaW5nKVxuICAgICAgYnJhY2tldFBvcyA9IHN0cmluZy5pbmRleE9mKCddJyk7XG4gICAgICBwYXJ0cy5ob3N0bmFtZSA9IHN0cmluZy5zdWJzdHJpbmcoMSwgYnJhY2tldFBvcykgfHwgbnVsbDtcbiAgICAgIHBhcnRzLnBvcnQgPSBzdHJpbmcuc3Vic3RyaW5nKGJyYWNrZXRQb3MgKyAyLCBwb3MpIHx8IG51bGw7XG4gICAgICBpZiAocGFydHMucG9ydCA9PT0gJy8nKSB7XG4gICAgICAgIHBhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZmlyc3RDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XG4gICAgICB2YXIgZmlyc3RTbGFzaCA9IHN0cmluZy5pbmRleE9mKCcvJyk7XG4gICAgICB2YXIgbmV4dENvbG9uID0gc3RyaW5nLmluZGV4T2YoJzonLCBmaXJzdENvbG9uICsgMSk7XG4gICAgICBpZiAobmV4dENvbG9uICE9PSAtMSAmJiAoZmlyc3RTbGFzaCA9PT0gLTEgfHwgbmV4dENvbG9uIDwgZmlyc3RTbGFzaCkpIHtcbiAgICAgICAgLy8gSVB2NiBob3N0IGNvbnRhaW5zIG11bHRpcGxlIGNvbG9ucyAtIGJ1dCBubyBwb3J0XG4gICAgICAgIC8vIHRoaXMgbm90YXRpb24gaXMgYWN0dWFsbHkgbm90IGFsbG93ZWQgYnkgUkZDIDM5ODYsIGJ1dCB3ZSdyZSBhIGxpYmVyYWwgcGFyc2VyXG4gICAgICAgIHBhcnRzLmhvc3RuYW1lID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpIHx8IG51bGw7XG4gICAgICAgIHBhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKS5zcGxpdCgnOicpO1xuICAgICAgICBwYXJ0cy5ob3N0bmFtZSA9IHRbMF0gfHwgbnVsbDtcbiAgICAgICAgcGFydHMucG9ydCA9IHRbMV0gfHwgbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocGFydHMuaG9zdG5hbWUgJiYgc3RyaW5nLnN1YnN0cmluZyhwb3MpLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBwb3MrKztcbiAgICAgIHN0cmluZyA9ICcvJyArIHN0cmluZztcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cmluZyhwb3MpIHx8ICcvJztcbiAgfTtcbiAgVVJJLnBhcnNlQXV0aG9yaXR5ID0gZnVuY3Rpb24oc3RyaW5nLCBwYXJ0cykge1xuICAgIHN0cmluZyA9IFVSSS5wYXJzZVVzZXJpbmZvKHN0cmluZywgcGFydHMpO1xuICAgIHJldHVybiBVUkkucGFyc2VIb3N0KHN0cmluZywgcGFydHMpO1xuICB9O1xuICBVUkkucGFyc2VVc2VyaW5mbyA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICAvLyBleHRyYWN0IHVzZXJuYW1lOnBhc3N3b3JkXG4gICAgdmFyIGZpcnN0U2xhc2ggPSBzdHJpbmcuaW5kZXhPZignLycpO1xuICAgIHZhciBwb3MgPSBzdHJpbmcubGFzdEluZGV4T2YoJ0AnLCBmaXJzdFNsYXNoID4gLTEgPyBmaXJzdFNsYXNoIDogc3RyaW5nLmxlbmd0aCAtIDEpO1xuICAgIHZhciB0O1xuXG4gICAgLy8gYXV0aG9yaXR5QCBtdXN0IGNvbWUgYmVmb3JlIC9wYXRoXG4gICAgaWYgKHBvcyA+IC0xICYmIChmaXJzdFNsYXNoID09PSAtMSB8fCBwb3MgPCBmaXJzdFNsYXNoKSkge1xuICAgICAgdCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKS5zcGxpdCgnOicpO1xuICAgICAgcGFydHMudXNlcm5hbWUgPSB0WzBdID8gVVJJLmRlY29kZSh0WzBdKSA6IG51bGw7XG4gICAgICB0LnNoaWZ0KCk7XG4gICAgICBwYXJ0cy5wYXNzd29yZCA9IHRbMF0gPyBVUkkuZGVjb2RlKHQuam9pbignOicpKSA6IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0cy51c2VybmFtZSA9IG51bGw7XG4gICAgICBwYXJ0cy5wYXNzd29yZCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbiAgVVJJLnBhcnNlUXVlcnkgPSBmdW5jdGlvbihzdHJpbmcsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIC8vIHRocm93IG91dCB0aGUgZnVua3kgYnVzaW5lc3MgLSBcIj9cIltuYW1lXCI9XCJ2YWx1ZVwiJlwiXStcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZSgvJisvZywgJyYnKS5yZXBsYWNlKC9eXFw/KiYqfCYrJC9nLCAnJyk7XG5cbiAgICBpZiAoIXN0cmluZykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHZhciBpdGVtcyA9IHt9O1xuICAgIHZhciBzcGxpdHMgPSBzdHJpbmcuc3BsaXQoJyYnKTtcbiAgICB2YXIgbGVuZ3RoID0gc3BsaXRzLmxlbmd0aDtcbiAgICB2YXIgdiwgbmFtZSwgdmFsdWU7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICB2ID0gc3BsaXRzW2ldLnNwbGl0KCc9Jyk7XG4gICAgICBuYW1lID0gVVJJLmRlY29kZVF1ZXJ5KHYuc2hpZnQoKSwgZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICAvLyBubyBcIj1cIiBpcyBudWxsIGFjY29yZGluZyB0byBodHRwOi8vZHZjcy53My5vcmcvaGcvdXJsL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcbiAgICAgIHZhbHVlID0gdi5sZW5ndGggPyBVUkkuZGVjb2RlUXVlcnkodi5qb2luKCc9JyksIGVzY2FwZVF1ZXJ5U3BhY2UpIDogbnVsbDtcblxuICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZW1zLCBuYW1lKSkge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1zW25hbWVdID09PSAnc3RyaW5nJyB8fCBpdGVtc1tuYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICAgIGl0ZW1zW25hbWVdID0gW2l0ZW1zW25hbWVdXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGl0ZW1zW25hbWVdLnB1c2godmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbXNbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaXRlbXM7XG4gIH07XG5cbiAgVVJJLmJ1aWxkID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICB2YXIgdCA9ICcnO1xuXG4gICAgaWYgKHBhcnRzLnByb3RvY29sKSB7XG4gICAgICB0ICs9IHBhcnRzLnByb3RvY29sICsgJzonO1xuICAgIH1cblxuICAgIGlmICghcGFydHMudXJuICYmICh0IHx8IHBhcnRzLmhvc3RuYW1lKSkge1xuICAgICAgdCArPSAnLy8nO1xuICAgIH1cblxuICAgIHQgKz0gKFVSSS5idWlsZEF1dGhvcml0eShwYXJ0cykgfHwgJycpO1xuXG4gICAgaWYgKHR5cGVvZiBwYXJ0cy5wYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHBhcnRzLnBhdGguY2hhckF0KDApICE9PSAnLycgJiYgdHlwZW9mIHBhcnRzLmhvc3RuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgICB0ICs9ICcvJztcbiAgICAgIH1cblxuICAgICAgdCArPSBwYXJ0cy5wYXRoO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFydHMucXVlcnkgPT09ICdzdHJpbmcnICYmIHBhcnRzLnF1ZXJ5KSB7XG4gICAgICB0ICs9ICc/JyArIHBhcnRzLnF1ZXJ5O1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgcGFydHMuZnJhZ21lbnQgPT09ICdzdHJpbmcnICYmIHBhcnRzLmZyYWdtZW50KSB7XG4gICAgICB0ICs9ICcjJyArIHBhcnRzLmZyYWdtZW50O1xuICAgIH1cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkSG9zdCA9IGZ1bmN0aW9uKHBhcnRzKSB7XG4gICAgdmFyIHQgPSAnJztcblxuICAgIGlmICghcGFydHMuaG9zdG5hbWUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IGVsc2UgaWYgKFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHBhcnRzLmhvc3RuYW1lKSkge1xuICAgICAgdCArPSAnWycgKyBwYXJ0cy5ob3N0bmFtZSArICddJztcbiAgICB9IGVsc2Uge1xuICAgICAgdCArPSBwYXJ0cy5ob3N0bmFtZTtcbiAgICB9XG5cbiAgICBpZiAocGFydHMucG9ydCkge1xuICAgICAgdCArPSAnOicgKyBwYXJ0cy5wb3J0O1xuICAgIH1cblxuICAgIHJldHVybiB0O1xuICB9O1xuICBVUkkuYnVpbGRBdXRob3JpdHkgPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHJldHVybiBVUkkuYnVpbGRVc2VyaW5mbyhwYXJ0cykgKyBVUkkuYnVpbGRIb3N0KHBhcnRzKTtcbiAgfTtcbiAgVVJJLmJ1aWxkVXNlcmluZm8gPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHZhciB0ID0gJyc7XG5cbiAgICBpZiAocGFydHMudXNlcm5hbWUpIHtcbiAgICAgIHQgKz0gVVJJLmVuY29kZShwYXJ0cy51c2VybmFtZSk7XG5cbiAgICAgIGlmIChwYXJ0cy5wYXNzd29yZCkge1xuICAgICAgICB0ICs9ICc6JyArIFVSSS5lbmNvZGUocGFydHMucGFzc3dvcmQpO1xuICAgICAgfVxuXG4gICAgICB0ICs9ICdAJztcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBkdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICAvLyBhY2NvcmRpbmcgdG8gaHR0cDovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiBvciBodHRwOi8vbGFicy5hcGFjaGUub3JnL3dlYmFyY2gvdXJpL3JmYy9yZmMzOTg2Lmh0bWxcbiAgICAvLyBiZWluZyDCuy0uX34hJCYnKCkqKyw7PTpALz/CqyAlSEVYIGFuZCBhbG51bSBhcmUgYWxsb3dlZFxuICAgIC8vIHRoZSBSRkMgZXhwbGljaXRseSBzdGF0ZXMgPy9mb28gYmVpbmcgYSB2YWxpZCB1c2UgY2FzZSwgbm8gbWVudGlvbiBvZiBwYXJhbWV0ZXIgc3ludGF4IVxuICAgIC8vIFVSSS5qcyB0cmVhdHMgdGhlIHF1ZXJ5IHN0cmluZyBhcyBiZWluZyBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICAvLyBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MC9pbnRlcmFjdC9mb3Jtcy5odG1sI2Zvcm0tY29udGVudC10eXBlXG5cbiAgICB2YXIgdCA9ICcnO1xuICAgIHZhciB1bmlxdWUsIGtleSwgaSwgbGVuZ3RoO1xuICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbChkYXRhLCBrZXkpICYmIGtleSkge1xuICAgICAgICBpZiAoaXNBcnJheShkYXRhW2tleV0pKSB7XG4gICAgICAgICAgdW5pcXVlID0ge307XG4gICAgICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZGF0YVtrZXldLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldW2ldICE9PSB1bmRlZmluZWQgJiYgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHQgKz0gJyYnICsgVVJJLmJ1aWxkUXVlcnlQYXJhbWV0ZXIoa2V5LCBkYXRhW2tleV1baV0sIGVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgICAgICAgICBpZiAoZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9IHRydWU7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZGF0YVtrZXldICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0ICs9ICcmJyArIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyKGtleSwgZGF0YVtrZXldLCBlc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0LnN1YnN0cmluZygxKTtcbiAgfTtcbiAgVVJJLmJ1aWxkUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXNjYXBlUXVlcnlTcGFjZSkge1xuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1odG1sNDAvaW50ZXJhY3QvZm9ybXMuaHRtbCNmb3JtLWNvbnRlbnQtdHlwZSAtLSBhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcbiAgICAvLyBkb24ndCBhcHBlbmQgXCI9XCIgZm9yIG51bGwgdmFsdWVzLCBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCN1cmwtcGFyYW1ldGVyLXNlcmlhbGl6YXRpb25cbiAgICByZXR1cm4gVVJJLmVuY29kZVF1ZXJ5KG5hbWUsIGVzY2FwZVF1ZXJ5U3BhY2UpICsgKHZhbHVlICE9PSBudWxsID8gJz0nICsgVVJJLmVuY29kZVF1ZXJ5KHZhbHVlLCBlc2NhcGVRdWVyeVNwYWNlKSA6ICcnKTtcbiAgfTtcblxuICBVUkkuYWRkUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XG4gICAgICAgICAgVVJJLmFkZFF1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoZGF0YVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZGF0YVtuYW1lXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZGF0YVtuYW1lXSA9IFtkYXRhW25hbWVdXTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB2YWx1ZSA9IFt2YWx1ZV07XG4gICAgICB9XG5cbiAgICAgIGRhdGFbbmFtZV0gPSAoZGF0YVtuYW1lXSB8fCBbXSkuY29uY2F0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG4gIFVSSS5yZW1vdmVRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGksIGxlbmd0aCwga2V5O1xuXG4gICAgaWYgKGlzQXJyYXkobmFtZSkpIHtcbiAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IG5hbWUubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZGF0YVtuYW1lW2ldXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGdldFR5cGUobmFtZSkgPT09ICdSZWdFeHAnKSB7XG4gICAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICAgIGlmIChuYW1lLnRlc3Qoa2V5KSkge1xuICAgICAgICAgIGRhdGFba2V5XSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKGtleSBpbiBuYW1lKSB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XG4gICAgICAgICAgVVJJLnJlbW92ZVF1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoZ2V0VHlwZSh2YWx1ZSkgPT09ICdSZWdFeHAnKSB7XG4gICAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pICYmIHZhbHVlLnRlc3QoZGF0YVtuYW1lXSkpIHtcbiAgICAgICAgICAgIGRhdGFbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGFbbmFtZV0gPSBmaWx0ZXJBcnJheVZhbHVlcyhkYXRhW25hbWVdLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFbbmFtZV0gPT09IFN0cmluZyh2YWx1ZSkgJiYgKCFpc0FycmF5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPT09IDEpKSB7XG4gICAgICAgICAgZGF0YVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgZGF0YVtuYW1lXSA9IGZpbHRlckFycmF5VmFsdWVzKGRhdGFbbmFtZV0sIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YVtuYW1lXSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLnJlbW92ZVF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZywgUmVnRXhwIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG4gIFVSSS5oYXNRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhbHVlLCB3aXRoaW5BcnJheSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XG4gICAgICAgICAgaWYgKCFVUkkuaGFzUXVlcnkoZGF0YSwga2V5LCBuYW1lW2tleV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVUkkuaGFzUXVlcnkoKSBhY2NlcHRzIGFuIG9iamVjdCwgc3RyaW5nIGFzIHRoZSBuYW1lIHBhcmFtZXRlcicpO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZ2V0VHlwZSh2YWx1ZSkpIHtcbiAgICAgIGNhc2UgJ1VuZGVmaW5lZCc6XG4gICAgICAgIC8vIHRydWUgaWYgZXhpc3RzIChidXQgbWF5IGJlIGVtcHR5KVxuICAgICAgICByZXR1cm4gbmFtZSBpbiBkYXRhOyAvLyBkYXRhW25hbWVdICE9PSB1bmRlZmluZWQ7XG5cbiAgICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyBhbmQgbm9uLWVtcHR5XG4gICAgICAgIHZhciBfYm9vbHkgPSBCb29sZWFuKGlzQXJyYXkoZGF0YVtuYW1lXSkgPyBkYXRhW25hbWVdLmxlbmd0aCA6IGRhdGFbbmFtZV0pO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IF9ib29seTtcblxuICAgICAgY2FzZSAnRnVuY3Rpb24nOlxuICAgICAgICAvLyBhbGxvdyBjb21wbGV4IGNvbXBhcmlzb25cbiAgICAgICAgcmV0dXJuICEhdmFsdWUoZGF0YVtuYW1lXSwgbmFtZSwgZGF0YSk7XG5cbiAgICAgIGNhc2UgJ0FycmF5JzpcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wID0gd2l0aGluQXJyYXkgPyBhcnJheUNvbnRhaW5zIDogYXJyYXlzRXF1YWw7XG4gICAgICAgIHJldHVybiBvcChkYXRhW25hbWVdLCB2YWx1ZSk7XG5cbiAgICAgIGNhc2UgJ1JlZ0V4cCc6XG4gICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIHJldHVybiBCb29sZWFuKGRhdGFbbmFtZV0gJiYgZGF0YVtuYW1lXS5tYXRjaCh2YWx1ZSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheUNvbnRhaW5zKGRhdGFbbmFtZV0sIHZhbHVlKTtcblxuICAgICAgY2FzZSAnTnVtYmVyJzpcbiAgICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgICAgICAvKiBmYWxscyB0aHJvdWdoICovXG4gICAgICBjYXNlICdTdHJpbmcnOlxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkpIHtcbiAgICAgICAgICByZXR1cm4gZGF0YVtuYW1lXSA9PT0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXdpdGhpbkFycmF5KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFycmF5Q29udGFpbnMoZGF0YVtuYW1lXSwgdmFsdWUpO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVUkkuaGFzUXVlcnkoKSBhY2NlcHRzIHVuZGVmaW5lZCwgYm9vbGVhbiwgc3RyaW5nLCBudW1iZXIsIFJlZ0V4cCwgRnVuY3Rpb24gYXMgdGhlIHZhbHVlIHBhcmFtZXRlcicpO1xuICAgIH1cbiAgfTtcblxuXG4gIFVSSS5jb21tb25QYXRoID0gZnVuY3Rpb24ob25lLCB0d28pIHtcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5taW4ob25lLmxlbmd0aCwgdHdvLmxlbmd0aCk7XG4gICAgdmFyIHBvcztcblxuICAgIC8vIGZpbmQgZmlyc3Qgbm9uLW1hdGNoaW5nIGNoYXJhY3RlclxuICAgIGZvciAocG9zID0gMDsgcG9zIDwgbGVuZ3RoOyBwb3MrKykge1xuICAgICAgaWYgKG9uZS5jaGFyQXQocG9zKSAhPT0gdHdvLmNoYXJBdChwb3MpKSB7XG4gICAgICAgIHBvcy0tO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zIDwgMSkge1xuICAgICAgcmV0dXJuIG9uZS5jaGFyQXQoMCkgPT09IHR3by5jaGFyQXQoMCkgJiYgb25lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgfVxuXG4gICAgLy8gcmV2ZXJ0IHRvIGxhc3QgL1xuICAgIGlmIChvbmUuY2hhckF0KHBvcykgIT09ICcvJyB8fCB0d28uY2hhckF0KHBvcykgIT09ICcvJykge1xuICAgICAgcG9zID0gb25lLnN1YnN0cmluZygwLCBwb3MpLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9uZS5zdWJzdHJpbmcoMCwgcG9zICsgMSk7XG4gIH07XG5cbiAgVVJJLndpdGhpblN0cmluZyA9IGZ1bmN0aW9uKHN0cmluZywgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xuICAgIHZhciBfc3RhcnQgPSBvcHRpb25zLnN0YXJ0IHx8IFVSSS5maW5kVXJpLnN0YXJ0O1xuICAgIHZhciBfZW5kID0gb3B0aW9ucy5lbmQgfHwgVVJJLmZpbmRVcmkuZW5kO1xuICAgIHZhciBfdHJpbSA9IG9wdGlvbnMudHJpbSB8fCBVUkkuZmluZFVyaS50cmltO1xuICAgIHZhciBfYXR0cmlidXRlT3BlbiA9IC9bYS16MC05LV09W1wiJ10/JC9pO1xuXG4gICAgX3N0YXJ0Lmxhc3RJbmRleCA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBtYXRjaCA9IF9zdGFydC5leGVjKHN0cmluZyk7XG4gICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RhcnQgPSBtYXRjaC5pbmRleDtcbiAgICAgIGlmIChvcHRpb25zLmlnbm9yZUh0bWwpIHtcbiAgICAgICAgLy8gYXR0cmlidXQoZT1bXCInXT8kKVxuICAgICAgICB2YXIgYXR0cmlidXRlT3BlbiA9IHN0cmluZy5zbGljZShNYXRoLm1heChzdGFydCAtIDMsIDApLCBzdGFydCk7XG4gICAgICAgIGlmIChhdHRyaWJ1dGVPcGVuICYmIF9hdHRyaWJ1dGVPcGVuLnRlc3QoYXR0cmlidXRlT3BlbikpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gc3RhcnQgKyBzdHJpbmcuc2xpY2Uoc3RhcnQpLnNlYXJjaChfZW5kKTtcbiAgICAgIHZhciBzbGljZSA9IHN0cmluZy5zbGljZShzdGFydCwgZW5kKS5yZXBsYWNlKF90cmltLCAnJyk7XG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmUgJiYgb3B0aW9ucy5pZ25vcmUudGVzdChzbGljZSkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGVuZCA9IHN0YXJ0ICsgc2xpY2UubGVuZ3RoO1xuICAgICAgdmFyIHJlc3VsdCA9IGNhbGxiYWNrKHNsaWNlLCBzdGFydCwgZW5kLCBzdHJpbmcpO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDAsIHN0YXJ0KSArIHJlc3VsdCArIHN0cmluZy5zbGljZShlbmQpO1xuICAgICAgX3N0YXJ0Lmxhc3RJbmRleCA9IHN0YXJ0ICsgcmVzdWx0Lmxlbmd0aDtcbiAgICB9XG5cbiAgICBfc3RhcnQubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9O1xuXG4gIFVSSS5lbnN1cmVWYWxpZEhvc3RuYW1lID0gZnVuY3Rpb24odikge1xuICAgIC8vIFRoZW9yZXRpY2FsbHkgVVJJcyBhbGxvdyBwZXJjZW50LWVuY29kaW5nIGluIEhvc3RuYW1lcyAoYWNjb3JkaW5nIHRvIFJGQyAzOTg2KVxuICAgIC8vIHRoZXkgYXJlIG5vdCBwYXJ0IG9mIEROUyBhbmQgdGhlcmVmb3JlIGlnbm9yZWQgYnkgVVJJLmpzXG5cbiAgICBpZiAodi5tYXRjaChVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzKSkge1xuICAgICAgLy8gdGVzdCBwdW55Y29kZVxuICAgICAgaWYgKCFwdW55Y29kZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dIGFuZCBQdW55Y29kZS5qcyBpcyBub3QgYXZhaWxhYmxlJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwdW55Y29kZS50b0FTQ0lJKHYpLm1hdGNoKFVSSS5pbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hvc3RuYW1lIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuLV0nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gbm9Db25mbGljdFxuICBVUkkubm9Db25mbGljdCA9IGZ1bmN0aW9uKHJlbW92ZUFsbCkge1xuICAgIGlmIChyZW1vdmVBbGwpIHtcbiAgICAgIHZhciB1bmNvbmZsaWN0ZWQgPSB7XG4gICAgICAgIFVSSTogdGhpcy5ub0NvbmZsaWN0KClcbiAgICAgIH07XG5cbiAgICAgIGlmIChyb290LlVSSVRlbXBsYXRlICYmIHR5cGVvZiByb290LlVSSVRlbXBsYXRlLm5vQ29uZmxpY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdW5jb25mbGljdGVkLlVSSVRlbXBsYXRlID0gcm9vdC5VUklUZW1wbGF0ZS5ub0NvbmZsaWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb290LklQdjYgJiYgdHlwZW9mIHJvb3QuSVB2Ni5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVuY29uZmxpY3RlZC5JUHY2ID0gcm9vdC5JUHY2Lm5vQ29uZmxpY3QoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJvb3QuU2Vjb25kTGV2ZWxEb21haW5zICYmIHR5cGVvZiByb290LlNlY29uZExldmVsRG9tYWlucy5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVuY29uZmxpY3RlZC5TZWNvbmRMZXZlbERvbWFpbnMgPSByb290LlNlY29uZExldmVsRG9tYWlucy5ub0NvbmZsaWN0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB1bmNvbmZsaWN0ZWQ7XG4gICAgfSBlbHNlIGlmIChyb290LlVSSSA9PT0gdGhpcykge1xuICAgICAgcm9vdC5VUkkgPSBfVVJJO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuYnVpbGQgPSBmdW5jdGlvbihkZWZlckJ1aWxkKSB7XG4gICAgaWYgKGRlZmVyQnVpbGQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuX2RlZmVycmVkX2J1aWxkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGRlZmVyQnVpbGQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9kZWZlcnJlZF9idWlsZCkge1xuICAgICAgdGhpcy5fc3RyaW5nID0gVVJJLmJ1aWxkKHRoaXMuX3BhcnRzKTtcbiAgICAgIHRoaXMuX2RlZmVycmVkX2J1aWxkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcC5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVVJJKHRoaXMpO1xuICB9O1xuXG4gIHAudmFsdWVPZiA9IHAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5idWlsZChmYWxzZSkuX3N0cmluZztcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoX3BhcnQpe1xuICAgIHJldHVybiBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFydHNbX3BhcnRdIHx8ICcnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fcGFydHNbX3BhcnRdID0gdiB8fCBudWxsO1xuICAgICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVByZWZpeEFjY2Vzc29yKF9wYXJ0LCBfa2V5KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzW19wYXJ0XSB8fCAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh2ICE9PSBudWxsKSB7XG4gICAgICAgICAgdiA9IHYgKyAnJztcbiAgICAgICAgICBpZiAodi5jaGFyQXQoMCkgPT09IF9rZXkpIHtcbiAgICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXJ0c1tfcGFydF0gPSB2O1xuICAgICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBwLnByb3RvY29sID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncHJvdG9jb2wnKTtcbiAgcC51c2VybmFtZSA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3VzZXJuYW1lJyk7XG4gIHAucGFzc3dvcmQgPSBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKCdwYXNzd29yZCcpO1xuICBwLmhvc3RuYW1lID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcignaG9zdG5hbWUnKTtcbiAgcC5wb3J0ID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncG9ydCcpO1xuICBwLnF1ZXJ5ID0gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcigncXVlcnknLCAnPycpO1xuICBwLmZyYWdtZW50ID0gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcignZnJhZ21lbnQnLCAnIycpO1xuXG4gIHAuc2VhcmNoID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgdCA9IHRoaXMucXVlcnkodiwgYnVpbGQpO1xuICAgIHJldHVybiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgJiYgdC5sZW5ndGggPyAoJz8nICsgdCkgOiB0O1xuICB9O1xuICBwLmhhc2ggPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIHZhciB0ID0gdGhpcy5mcmFnbWVudCh2LCBidWlsZCk7XG4gICAgcmV0dXJuIHR5cGVvZiB0ID09PSAnc3RyaW5nJyAmJiB0Lmxlbmd0aCA/ICgnIycgKyB0KSA6IHQ7XG4gIH07XG5cbiAgcC5wYXRobmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XG4gICAgICB2YXIgcmVzID0gdGhpcy5fcGFydHMucGF0aCB8fCAodGhpcy5fcGFydHMuaG9zdG5hbWUgPyAnLycgOiAnJyk7XG4gICAgICByZXR1cm4gdiA/ICh0aGlzLl9wYXJ0cy51cm4gPyBVUkkuZGVjb2RlVXJuUGF0aCA6IFVSSS5kZWNvZGVQYXRoKShyZXMpIDogcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB2ID8gVVJJLnJlY29kZVVyblBhdGgodikgOiAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB2ID8gVVJJLnJlY29kZVBhdGgodikgOiAnLyc7XG4gICAgICB9XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAucGF0aCA9IHAucGF0aG5hbWU7XG4gIHAuaHJlZiA9IGZ1bmN0aW9uKGhyZWYsIGJ1aWxkKSB7XG4gICAgdmFyIGtleTtcblxuICAgIGlmIChocmVmID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3RyaW5nID0gJyc7XG4gICAgdGhpcy5fcGFydHMgPSBVUkkuX3BhcnRzKCk7XG5cbiAgICB2YXIgX1VSSSA9IGhyZWYgaW5zdGFuY2VvZiBVUkk7XG4gICAgdmFyIF9vYmplY3QgPSB0eXBlb2YgaHJlZiA9PT0gJ29iamVjdCcgJiYgKGhyZWYuaG9zdG5hbWUgfHwgaHJlZi5wYXRoIHx8IGhyZWYucGF0aG5hbWUpO1xuICAgIGlmIChocmVmLm5vZGVOYW1lKSB7XG4gICAgICB2YXIgYXR0cmlidXRlID0gVVJJLmdldERvbUF0dHJpYnV0ZShocmVmKTtcbiAgICAgIGhyZWYgPSBocmVmW2F0dHJpYnV0ZV0gfHwgJyc7XG4gICAgICBfb2JqZWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gd2luZG93LmxvY2F0aW9uIGlzIHJlcG9ydGVkIHRvIGJlIGFuIG9iamVjdCwgYnV0IGl0J3Mgbm90IHRoZSBzb3J0XG4gICAgLy8gb2Ygb2JqZWN0IHdlJ3JlIGxvb2tpbmcgZm9yOlxuICAgIC8vICogbG9jYXRpb24ucHJvdG9jb2wgZW5kcyB3aXRoIGEgY29sb25cbiAgICAvLyAqIGxvY2F0aW9uLnF1ZXJ5ICE9IG9iamVjdC5zZWFyY2hcbiAgICAvLyAqIGxvY2F0aW9uLmhhc2ggIT0gb2JqZWN0LmZyYWdtZW50XG4gICAgLy8gc2ltcGx5IHNlcmlhbGl6aW5nIHRoZSB1bmtub3duIG9iamVjdCBzaG91bGQgZG8gdGhlIHRyaWNrXG4gICAgLy8gKGZvciBsb2NhdGlvbiwgbm90IGZvciBldmVyeXRoaW5nLi4uKVxuICAgIGlmICghX1VSSSAmJiBfb2JqZWN0ICYmIGhyZWYucGF0aG5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaHJlZiA9IGhyZWYudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGhyZWYgPT09ICdzdHJpbmcnIHx8IGhyZWYgaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgIHRoaXMuX3BhcnRzID0gVVJJLnBhcnNlKFN0cmluZyhocmVmKSwgdGhpcy5fcGFydHMpO1xuICAgIH0gZWxzZSBpZiAoX1VSSSB8fCBfb2JqZWN0KSB7XG4gICAgICB2YXIgc3JjID0gX1VSSSA/IGhyZWYuX3BhcnRzIDogaHJlZjtcbiAgICAgIGZvciAoa2V5IGluIHNyYykge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwodGhpcy5fcGFydHMsIGtleSkpIHtcbiAgICAgICAgICB0aGlzLl9wYXJ0c1trZXldID0gc3JjW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignaW52YWxpZCBpbnB1dCcpO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBpZGVudGlmaWNhdGlvbiBhY2Nlc3NvcnNcbiAgcC5pcyA9IGZ1bmN0aW9uKHdoYXQpIHtcbiAgICB2YXIgaXAgPSBmYWxzZTtcbiAgICB2YXIgaXA0ID0gZmFsc2U7XG4gICAgdmFyIGlwNiA9IGZhbHNlO1xuICAgIHZhciBuYW1lID0gZmFsc2U7XG4gICAgdmFyIHNsZCA9IGZhbHNlO1xuICAgIHZhciBpZG4gPSBmYWxzZTtcbiAgICB2YXIgcHVueWNvZGUgPSBmYWxzZTtcbiAgICB2YXIgcmVsYXRpdmUgPSAhdGhpcy5fcGFydHMudXJuO1xuXG4gICAgaWYgKHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICByZWxhdGl2ZSA9IGZhbHNlO1xuICAgICAgaXA0ID0gVVJJLmlwNF9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgaXA2ID0gVVJJLmlwNl9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgaXAgPSBpcDQgfHwgaXA2O1xuICAgICAgbmFtZSA9ICFpcDtcbiAgICAgIHNsZCA9IG5hbWUgJiYgU0xEICYmIFNMRC5oYXModGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgaWRuID0gbmFtZSAmJiBVUkkuaWRuX2V4cHJlc3Npb24udGVzdCh0aGlzLl9wYXJ0cy5ob3N0bmFtZSk7XG4gICAgICBwdW55Y29kZSA9IG5hbWUgJiYgVVJJLnB1bnljb2RlX2V4cHJlc3Npb24udGVzdCh0aGlzLl9wYXJ0cy5ob3N0bmFtZSk7XG4gICAgfVxuXG4gICAgc3dpdGNoICh3aGF0LnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgJ3JlbGF0aXZlJzpcbiAgICAgICAgcmV0dXJuIHJlbGF0aXZlO1xuXG4gICAgICBjYXNlICdhYnNvbHV0ZSc6XG4gICAgICAgIHJldHVybiAhcmVsYXRpdmU7XG5cbiAgICAgIC8vIGhvc3RuYW1lIGlkZW50aWZpY2F0aW9uXG4gICAgICBjYXNlICdkb21haW4nOlxuICAgICAgY2FzZSAnbmFtZSc6XG4gICAgICAgIHJldHVybiBuYW1lO1xuXG4gICAgICBjYXNlICdzbGQnOlxuICAgICAgICByZXR1cm4gc2xkO1xuXG4gICAgICBjYXNlICdpcCc6XG4gICAgICAgIHJldHVybiBpcDtcblxuICAgICAgY2FzZSAnaXA0JzpcbiAgICAgIGNhc2UgJ2lwdjQnOlxuICAgICAgY2FzZSAnaW5ldDQnOlxuICAgICAgICByZXR1cm4gaXA0O1xuXG4gICAgICBjYXNlICdpcDYnOlxuICAgICAgY2FzZSAnaXB2Nic6XG4gICAgICBjYXNlICdpbmV0Nic6XG4gICAgICAgIHJldHVybiBpcDY7XG5cbiAgICAgIGNhc2UgJ2lkbic6XG4gICAgICAgIHJldHVybiBpZG47XG5cbiAgICAgIGNhc2UgJ3VybCc6XG4gICAgICAgIHJldHVybiAhdGhpcy5fcGFydHMudXJuO1xuXG4gICAgICBjYXNlICd1cm4nOlxuICAgICAgICByZXR1cm4gISF0aGlzLl9wYXJ0cy51cm47XG5cbiAgICAgIGNhc2UgJ3B1bnljb2RlJzpcbiAgICAgICAgcmV0dXJuIHB1bnljb2RlO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIC8vIGNvbXBvbmVudCBzcGVjaWZpYyBpbnB1dCB2YWxpZGF0aW9uXG4gIHZhciBfcHJvdG9jb2wgPSBwLnByb3RvY29sO1xuICB2YXIgX3BvcnQgPSBwLnBvcnQ7XG4gIHZhciBfaG9zdG5hbWUgPSBwLmhvc3RuYW1lO1xuXG4gIHAucHJvdG9jb2wgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIC8vIGFjY2VwdCB0cmFpbGluZyA6Ly9cbiAgICAgICAgdiA9IHYucmVwbGFjZSgvOihcXC9cXC8pPyQvLCAnJyk7XG5cbiAgICAgICAgaWYgKCF2Lm1hdGNoKFVSSS5wcm90b2NvbF9leHByZXNzaW9uKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3RvY29sIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuKy1dIG9yIGRvZXNuXFwndCBzdGFydCB3aXRoIFtBLVpdJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9wcm90b2NvbC5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcbiAgfTtcbiAgcC5zY2hlbWUgPSBwLnByb3RvY29sO1xuICBwLnBvcnQgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHYgPT09IDApIHtcbiAgICAgICAgdiA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmICh2KSB7XG4gICAgICAgIHYgKz0gJyc7XG4gICAgICAgIGlmICh2LmNoYXJBdCgwKSA9PT0gJzonKSB7XG4gICAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYubWF0Y2goL1teMC05XS8pKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUG9ydCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbMC05XScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcG9ydC5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcbiAgfTtcbiAgcC5ob3N0bmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgeCA9IHt9O1xuICAgICAgdmFyIHJlcyA9IFVSSS5wYXJzZUhvc3QodiwgeCk7XG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xuICAgICAgfVxuXG4gICAgICB2ID0geC5ob3N0bmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIF9ob3N0bmFtZS5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcbiAgfTtcblxuICAvLyBjb21wb3VuZCBhY2Nlc3NvcnNcbiAgcC5vcmlnaW4gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIHZhciBwYXJ0cztcblxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHByb3RvY29sID0gdGhpcy5wcm90b2NvbCgpO1xuICAgICAgdmFyIGF1dGhvcml0eSA9IHRoaXMuYXV0aG9yaXR5KCk7XG4gICAgICBpZiAoIWF1dGhvcml0eSkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuIChwcm90b2NvbCA/IHByb3RvY29sICsgJzovLycgOiAnJykgKyB0aGlzLmF1dGhvcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgb3JpZ2luID0gVVJJKHYpO1xuICAgICAgdGhpc1xuICAgICAgICAucHJvdG9jb2wob3JpZ2luLnByb3RvY29sKCkpXG4gICAgICAgIC5hdXRob3JpdHkob3JpZ2luLmF1dGhvcml0eSgpKVxuICAgICAgICAuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5ob3N0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEhvc3QodGhpcy5fcGFydHMpIDogJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXMgPSBVUkkucGFyc2VIb3N0KHYsIHRoaXMuX3BhcnRzKTtcbiAgICAgIGlmIChyZXMgIT09ICcvJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5hdXRob3JpdHkgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gVVJJLmJ1aWxkQXV0aG9yaXR5KHRoaXMuX3BhcnRzKSA6ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gVVJJLnBhcnNlQXV0aG9yaXR5KHYsIHRoaXMuX3BhcnRzKTtcbiAgICAgIGlmIChyZXMgIT09ICcvJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC51c2VyaW5mbyA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgdmFyIHQgPSBVUkkuYnVpbGRVc2VyaW5mbyh0aGlzLl9wYXJ0cyk7XG4gICAgICByZXR1cm4gdC5zdWJzdHJpbmcoMCwgdC5sZW5ndGggLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodlt2Lmxlbmd0aC0xXSAhPT0gJ0AnKSB7XG4gICAgICAgIHYgKz0gJ0AnO1xuICAgICAgfVxuXG4gICAgICBVUkkucGFyc2VVc2VyaW5mbyh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAucmVzb3VyY2UgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIHZhciBwYXJ0cztcblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhdGgoKSArIHRoaXMuc2VhcmNoKCkgKyB0aGlzLmhhc2goKTtcbiAgICB9XG5cbiAgICBwYXJ0cyA9IFVSSS5wYXJzZSh2KTtcbiAgICB0aGlzLl9wYXJ0cy5wYXRoID0gcGFydHMucGF0aDtcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IHBhcnRzLnF1ZXJ5O1xuICAgIHRoaXMuX3BhcnRzLmZyYWdtZW50ID0gcGFydHMuZnJhZ21lbnQ7XG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8vIGZyYWN0aW9uIGFjY2Vzc29yc1xuICBwLnN1YmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICAvLyBjb252ZW5pZW5jZSwgcmV0dXJuIFwid3d3XCIgZnJvbSBcInd3dy5leGFtcGxlLm9yZ1wiXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgLy8gZ3JhYiBkb21haW4gYW5kIGFkZCBhbm90aGVyIHNlZ21lbnRcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sZW5ndGggLSB0aGlzLmRvbWFpbigpLmxlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUuc3Vic3RyaW5nKDAsIGVuZCkgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy5kb21haW4oKS5sZW5ndGg7XG4gICAgICB2YXIgc3ViID0gdGhpcy5fcGFydHMuaG9zdG5hbWUuc3Vic3RyaW5nKDAsIGUpO1xuICAgICAgdmFyIHJlcGxhY2UgPSBuZXcgUmVnRXhwKCdeJyArIGVzY2FwZVJlZ0V4KHN1YikpO1xuXG4gICAgICBpZiAodiAmJiB2LmNoYXJBdCh2Lmxlbmd0aCAtIDEpICE9PSAnLicpIHtcbiAgICAgICAgdiArPSAnLic7XG4gICAgICB9XG5cbiAgICAgIGlmICh2KSB7XG4gICAgICAgIFVSSS5lbnN1cmVWYWxpZEhvc3RuYW1lKHYpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuZG9tYWluID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBidWlsZCA9IHY7XG4gICAgICB2ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIGNvbnZlbmllbmNlLCByZXR1cm4gXCJleGFtcGxlLm9yZ1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGhvc3RuYW1lIGNvbnNpc3RzIG9mIDEgb3IgMiBzZWdtZW50cywgaXQgbXVzdCBiZSB0aGUgZG9tYWluXG4gICAgICB2YXIgdCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLm1hdGNoKC9cXC4vZyk7XG4gICAgICBpZiAodCAmJiB0Lmxlbmd0aCA8IDIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lO1xuICAgICAgfVxuXG4gICAgICAvLyBncmFiIHRsZCBhbmQgYWRkIGFub3RoZXIgc2VnbWVudFxuICAgICAgdmFyIGVuZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxlbmd0aCAtIHRoaXMudGxkKGJ1aWxkKS5sZW5ndGggLSAxO1xuICAgICAgZW5kID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nLCBlbmQgLTEpICsgMTtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcoZW5kKSB8fCAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF2KSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nhbm5vdCBzZXQgZG9tYWluIGVtcHR5Jyk7XG4gICAgICB9XG5cbiAgICAgIFVSSS5lbnN1cmVWYWxpZEhvc3RuYW1lKHYpO1xuXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB2O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KHRoaXMuZG9tYWluKCkpICsgJyQnKTtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAudGxkID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBidWlsZCA9IHY7XG4gICAgICB2ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIC8vIHJldHVybiBcIm9yZ1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3MgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdmFyIHRsZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZyhwb3MgKyAxKTtcblxuICAgICAgaWYgKGJ1aWxkICE9PSB0cnVlICYmIFNMRCAmJiBTTEQubGlzdFt0bGQudG9Mb3dlckNhc2UoKV0pIHtcbiAgICAgICAgcmV0dXJuIFNMRC5nZXQodGhpcy5fcGFydHMuaG9zdG5hbWUpIHx8IHRsZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlcGxhY2U7XG5cbiAgICAgIGlmICghdikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3Qgc2V0IFRMRCBlbXB0eScpO1xuICAgICAgfSBlbHNlIGlmICh2Lm1hdGNoKC9bXmEtekEtWjAtOS1dLykpIHtcbiAgICAgICAgaWYgKFNMRCAmJiBTTEQuaXModikpIHtcbiAgICAgICAgICByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLnRsZCgpKSArICckJyk7XG4gICAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RMRCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05XScpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignY2Fubm90IHNldCBUTEQgb24gbm9uLWRvbWFpbiBob3N0Jyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLnRsZCgpKSArICckJyk7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmRpcmVjdG9yeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IHRydWUpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMucGF0aCAmJiAhdGhpcy5fcGFydHMuaG9zdG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fcGFydHMucGF0aCA9PT0gJy8nKSB7XG4gICAgICAgIHJldHVybiAnLyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5wYXRoLmxlbmd0aCAtIHRoaXMuZmlsZW5hbWUoKS5sZW5ndGggLSAxO1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKDAsIGVuZCkgfHwgKHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gJy8nIDogJycpO1xuXG4gICAgICByZXR1cm4gdiA/IFVSSS5kZWNvZGVQYXRoKHJlcykgOiByZXM7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGUgPSB0aGlzLl9wYXJ0cy5wYXRoLmxlbmd0aCAtIHRoaXMuZmlsZW5hbWUoKS5sZW5ndGg7XG4gICAgICB2YXIgZGlyZWN0b3J5ID0gdGhpcy5fcGFydHMucGF0aC5zdWJzdHJpbmcoMCwgZSk7XG4gICAgICB2YXIgcmVwbGFjZSA9IG5ldyBSZWdFeHAoJ14nICsgZXNjYXBlUmVnRXgoZGlyZWN0b3J5KSk7XG5cbiAgICAgIC8vIGZ1bGx5IHF1YWxpZmllciBkaXJlY3RvcmllcyBiZWdpbiB3aXRoIGEgc2xhc2hcbiAgICAgIGlmICghdGhpcy5pcygncmVsYXRpdmUnKSkge1xuICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICB2ID0gJy8nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHYuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgICAgICB2ID0gJy8nICsgdjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBkaXJlY3RvcmllcyBhbHdheXMgZW5kIHdpdGggYSBzbGFzaFxuICAgICAgaWYgKHYgJiYgdi5jaGFyQXQodi5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XG4gICAgICAgIHYgKz0gJy8nO1xuICAgICAgfVxuXG4gICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdGhpcy5fcGFydHMucGF0aC5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmZpbGVuYW1lID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5wYXRoIHx8IHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBwb3MgPSB0aGlzLl9wYXJ0cy5wYXRoLmxhc3RJbmRleE9mKCcvJyk7XG4gICAgICB2YXIgcmVzID0gdGhpcy5fcGFydHMucGF0aC5zdWJzdHJpbmcocG9zKzEpO1xuXG4gICAgICByZXR1cm4gdiA/IFVSSS5kZWNvZGVQYXRoU2VnbWVudChyZXMpIDogcmVzO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbXV0YXRlZERpcmVjdG9yeSA9IGZhbHNlO1xuXG4gICAgICBpZiAodi5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgICB2ID0gdi5zdWJzdHJpbmcoMSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2Lm1hdGNoKC9cXC4/XFwvLykpIHtcbiAgICAgICAgbXV0YXRlZERpcmVjdG9yeSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLmZpbGVuYW1lKCkpICsgJyQnKTtcbiAgICAgIHYgPSBVUkkucmVjb2RlUGF0aCh2KTtcbiAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB0aGlzLl9wYXJ0cy5wYXRoLnJlcGxhY2UocmVwbGFjZSwgdik7XG5cbiAgICAgIGlmIChtdXRhdGVkRGlyZWN0b3J5KSB7XG4gICAgICAgIHRoaXMubm9ybWFsaXplUGF0aChidWlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5zdWZmaXggPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggfHwgdGhpcy5fcGFydHMucGF0aCA9PT0gJy8nKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgdmFyIGZpbGVuYW1lID0gdGhpcy5maWxlbmFtZSgpO1xuICAgICAgdmFyIHBvcyA9IGZpbGVuYW1lLmxhc3RJbmRleE9mKCcuJyk7XG4gICAgICB2YXIgcywgcmVzO1xuXG4gICAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIHN1ZmZpeCBtYXkgb25seSBjb250YWluIGFsbnVtIGNoYXJhY3RlcnMgKHl1cCwgSSBtYWRlIHRoaXMgdXAuKVxuICAgICAgcyA9IGZpbGVuYW1lLnN1YnN0cmluZyhwb3MrMSk7XG4gICAgICByZXMgPSAoL15bYS16MC05JV0rJC9pKS50ZXN0KHMpID8gcyA6ICcnO1xuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHYuY2hhckF0KDApID09PSAnLicpIHtcbiAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3VmZml4ID0gdGhpcy5zdWZmaXgoKTtcbiAgICAgIHZhciByZXBsYWNlO1xuXG4gICAgICBpZiAoIXN1ZmZpeCkge1xuICAgICAgICBpZiAoIXYpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggKz0gJy4nICsgVVJJLnJlY29kZVBhdGgodik7XG4gICAgICB9IGVsc2UgaWYgKCF2KSB7XG4gICAgICAgIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KCcuJyArIHN1ZmZpeCkgKyAnJCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgoc3VmZml4KSArICckJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXBsYWNlKSB7XG4gICAgICAgIHYgPSBVUkkucmVjb2RlUGF0aCh2KTtcbiAgICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnNlZ21lbnQgPSBmdW5jdGlvbihzZWdtZW50LCB2LCBidWlsZCkge1xuICAgIHZhciBzZXBhcmF0b3IgPSB0aGlzLl9wYXJ0cy51cm4gPyAnOicgOiAnLyc7XG4gICAgdmFyIHBhdGggPSB0aGlzLnBhdGgoKTtcbiAgICB2YXIgYWJzb2x1dGUgPSBwYXRoLnN1YnN0cmluZygwLCAxKSA9PT0gJy8nO1xuICAgIHZhciBzZWdtZW50cyA9IHBhdGguc3BsaXQoc2VwYXJhdG9yKTtcblxuICAgIGlmIChzZWdtZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XG4gICAgICBidWlsZCA9IHY7XG4gICAgICB2ID0gc2VnbWVudDtcbiAgICAgIHNlZ21lbnQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKHNlZ21lbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc2VnbWVudCAhPT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHNlZ21lbnQgXCInICsgc2VnbWVudCArICdcIiwgbXVzdCBiZSAwLWJhc2VkIGludGVnZXInKTtcbiAgICB9XG5cbiAgICBpZiAoYWJzb2x1dGUpIHtcbiAgICAgIHNlZ21lbnRzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKHNlZ21lbnQgPCAwKSB7XG4gICAgICAvLyBhbGxvdyBuZWdhdGl2ZSBpbmRleGVzIHRvIGFkZHJlc3MgZnJvbSB0aGUgZW5kXG4gICAgICBzZWdtZW50ID0gTWF0aC5tYXgoc2VnbWVudHMubGVuZ3RoICsgc2VnbWVudCwgMCk7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cbiAgICAgIHJldHVybiBzZWdtZW50ID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBzZWdtZW50c1xuICAgICAgICA6IHNlZ21lbnRzW3NlZ21lbnRdO1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IGZhbHNlICovXG4gICAgfSBlbHNlIGlmIChzZWdtZW50ID09PSBudWxsIHx8IHNlZ21lbnRzW3NlZ21lbnRdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChpc0FycmF5KHYpKSB7XG4gICAgICAgIHNlZ21lbnRzID0gW107XG4gICAgICAgIC8vIGNvbGxhcHNlIGVtcHR5IGVsZW1lbnRzIHdpdGhpbiBhcnJheVxuICAgICAgICBmb3IgKHZhciBpPTAsIGw9di5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBpZiAoIXZbaV0ubGVuZ3RoICYmICghc2VnbWVudHMubGVuZ3RoIHx8ICFzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdLmxlbmd0aCkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggJiYgIXNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtMV0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWdtZW50cy5wb3AoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWdtZW50cy5wdXNoKHRyaW1TbGFzaGVzKHZbaV0pKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh2IHx8IHR5cGVvZiB2ID09PSAnc3RyaW5nJykge1xuICAgICAgICB2ID0gdHJpbVNsYXNoZXModik7XG4gICAgICAgIGlmIChzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdID09PSAnJykge1xuICAgICAgICAgIC8vIGVtcHR5IHRyYWlsaW5nIGVsZW1lbnRzIGhhdmUgdG8gYmUgb3ZlcndyaXR0ZW5cbiAgICAgICAgICAvLyB0byBwcmV2ZW50IHJlc3VsdHMgc3VjaCBhcyAvZm9vLy9iYXJcbiAgICAgICAgICBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdID0gdjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZWdtZW50cy5wdXNoKHYpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2KSB7XG4gICAgICAgIHNlZ21lbnRzW3NlZ21lbnRdID0gdHJpbVNsYXNoZXModik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy51bnNoaWZ0KCcnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXRoKHNlZ21lbnRzLmpvaW4oc2VwYXJhdG9yKSwgYnVpbGQpO1xuICB9O1xuICBwLnNlZ21lbnRDb2RlZCA9IGZ1bmN0aW9uKHNlZ21lbnQsIHYsIGJ1aWxkKSB7XG4gICAgdmFyIHNlZ21lbnRzLCBpLCBsO1xuXG4gICAgaWYgKHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50KHNlZ21lbnQsIHYsIGJ1aWxkKTtcbiAgICAgIGlmICghaXNBcnJheShzZWdtZW50cykpIHtcbiAgICAgICAgc2VnbWVudHMgPSBzZWdtZW50cyAhPT0gdW5kZWZpbmVkID8gVVJJLmRlY29kZShzZWdtZW50cykgOiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSAwLCBsID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgc2VnbWVudHNbaV0gPSBVUkkuZGVjb2RlKHNlZ21lbnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VnbWVudHM7XG4gICAgfVxuXG4gICAgaWYgKCFpc0FycmF5KHYpKSB7XG4gICAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB2IGluc3RhbmNlb2YgU3RyaW5nKSA/IFVSSS5lbmNvZGUodikgOiB2O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwLCBsID0gdi5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdltpXSA9IFVSSS5lbmNvZGUodltpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuc2VnbWVudChzZWdtZW50LCB2LCBidWlsZCk7XG4gIH07XG5cbiAgLy8gbXV0YXRpbmcgcXVlcnkgc3RyaW5nXG4gIHZhciBxID0gcC5xdWVyeTtcbiAgcC5xdWVyeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHYgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICB2YXIgcmVzdWx0ID0gdi5jYWxsKHRoaXMsIGRhdGEpO1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShyZXN1bHQgfHwgZGF0YSwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeSh2LCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBxLmNhbGwodGhpcywgdiwgYnVpbGQpO1xuICAgIH1cbiAgfTtcbiAgcC5zZXRRdWVyeSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBidWlsZCkge1xuICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJyB8fCBuYW1lIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICBkYXRhW25hbWVdID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogbnVsbDtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yICh2YXIga2V5IGluIG5hbWUpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKG5hbWUsIGtleSkpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSBuYW1lW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuYWRkUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgYnVpbGQpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICBVUkkuYWRkUXVlcnkoZGF0YSwgbmFtZSwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZSk7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1aWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLnJlbW92ZVF1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGJ1aWxkKSB7XG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgVVJJLnJlbW92ZVF1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlKTtcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgYnVpbGQgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAuaGFzUXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICByZXR1cm4gVVJJLmhhc1F1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlLCB3aXRoaW5BcnJheSk7XG4gIH07XG4gIHAuc2V0U2VhcmNoID0gcC5zZXRRdWVyeTtcbiAgcC5hZGRTZWFyY2ggPSBwLmFkZFF1ZXJ5O1xuICBwLnJlbW92ZVNlYXJjaCA9IHAucmVtb3ZlUXVlcnk7XG4gIHAuaGFzU2VhcmNoID0gcC5oYXNRdWVyeTtcblxuICAvLyBzYW5pdGl6aW5nIFVSTHNcbiAgcC5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdGhpc1xuICAgICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVQYXRoKGZhbHNlKVxuICAgICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAgIC5ub3JtYWxpemVGcmFnbWVudChmYWxzZSlcbiAgICAgICAgLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgICAgIC5ub3JtYWxpemVQcm90b2NvbChmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVIb3N0bmFtZShmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVQb3J0KGZhbHNlKVxuICAgICAgLm5vcm1hbGl6ZVBhdGgoZmFsc2UpXG4gICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXG4gICAgICAubm9ybWFsaXplRnJhZ21lbnQoZmFsc2UpXG4gICAgICAuYnVpbGQoKTtcbiAgfTtcbiAgcC5ub3JtYWxpemVQcm90b2NvbCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3BhcnRzLnByb3RvY29sID0gdGhpcy5fcGFydHMucHJvdG9jb2wudG9Mb3dlckNhc2UoKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVIb3N0bmFtZSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICBpZiAodGhpcy5pcygnSUROJykgJiYgcHVueWNvZGUpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5pcygnSVB2NicpICYmIElQdjYpIHtcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBJUHY2LmJlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplUG9ydCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgLy8gcmVtb3ZlIHBvcnQgb2YgaXQncyB0aGUgcHJvdG9jb2wncyBkZWZhdWx0XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9PT0gJ3N0cmluZycgJiYgdGhpcy5fcGFydHMucG9ydCA9PT0gVVJJLmRlZmF1bHRQb3J0c1t0aGlzLl9wYXJ0cy5wcm90b2NvbF0pIHtcbiAgICAgIHRoaXMuX3BhcnRzLnBvcnQgPSBudWxsO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVBhdGggPSBmdW5jdGlvbihidWlsZCkge1xuICAgIHZhciBfcGF0aCA9IHRoaXMuX3BhcnRzLnBhdGg7XG4gICAgaWYgKCFfcGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IFVSSS5yZWNvZGVVcm5QYXRoKHRoaXMuX3BhcnRzLnBhdGgpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdmFyIF93YXNfcmVsYXRpdmU7XG4gICAgdmFyIF9sZWFkaW5nUGFyZW50cyA9ICcnO1xuICAgIHZhciBfcGFyZW50LCBfcG9zO1xuXG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIHBhdGhzXG4gICAgaWYgKF9wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICBfd2FzX3JlbGF0aXZlID0gdHJ1ZTtcbiAgICAgIF9wYXRoID0gJy8nICsgX3BhdGg7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIHJlbGF0aXZlIGZpbGVzIChhcyBvcHBvc2VkIHRvIGRpcmVjdG9yaWVzKVxuICAgIGlmIChfcGF0aC5zbGljZSgtMykgPT09ICcvLi4nIHx8IF9wYXRoLnNsaWNlKC0yKSA9PT0gJy8uJykge1xuICAgICAgX3BhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgc2ltcGxlc1xuICAgIF9wYXRoID0gX3BhdGhcbiAgICAgIC5yZXBsYWNlKC8oXFwvKFxcLlxcLykrKXwoXFwvXFwuJCkvZywgJy8nKVxuICAgICAgLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKTtcblxuICAgIC8vIHJlbWVtYmVyIGxlYWRpbmcgcGFyZW50c1xuICAgIGlmIChfd2FzX3JlbGF0aXZlKSB7XG4gICAgICBfbGVhZGluZ1BhcmVudHMgPSBfcGF0aC5zdWJzdHJpbmcoMSkubWF0Y2goL14oXFwuXFwuXFwvKSsvKSB8fCAnJztcbiAgICAgIGlmIChfbGVhZGluZ1BhcmVudHMpIHtcbiAgICAgICAgX2xlYWRpbmdQYXJlbnRzID0gX2xlYWRpbmdQYXJlbnRzWzBdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlc29sdmUgcGFyZW50c1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBfcGFyZW50ID0gX3BhdGguaW5kZXhPZignLy4uJyk7XG4gICAgICBpZiAoX3BhcmVudCA9PT0gLTEpIHtcbiAgICAgICAgLy8gbm8gbW9yZSAuLi8gdG8gcmVzb2x2ZVxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSBpZiAoX3BhcmVudCA9PT0gMCkge1xuICAgICAgICAvLyB0b3AgbGV2ZWwgY2Fubm90IGJlIHJlbGF0aXZlLCBza2lwIGl0XG4gICAgICAgIF9wYXRoID0gX3BhdGguc3Vic3RyaW5nKDMpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgX3BvcyA9IF9wYXRoLnN1YnN0cmluZygwLCBfcGFyZW50KS5sYXN0SW5kZXhPZignLycpO1xuICAgICAgaWYgKF9wb3MgPT09IC0xKSB7XG4gICAgICAgIF9wb3MgPSBfcGFyZW50O1xuICAgICAgfVxuICAgICAgX3BhdGggPSBfcGF0aC5zdWJzdHJpbmcoMCwgX3BvcykgKyBfcGF0aC5zdWJzdHJpbmcoX3BhcmVudCArIDMpO1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byByZWxhdGl2ZVxuICAgIGlmIChfd2FzX3JlbGF0aXZlICYmIHRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcbiAgICAgIF9wYXRoID0gX2xlYWRpbmdQYXJlbnRzICsgX3BhdGguc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIF9wYXRoID0gVVJJLnJlY29kZVBhdGgoX3BhdGgpO1xuICAgIHRoaXMuX3BhcnRzLnBhdGggPSBfcGF0aDtcbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplUGF0aG5hbWUgPSBwLm5vcm1hbGl6ZVBhdGg7XG4gIHAubm9ybWFsaXplUXVlcnkgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcGFydHMucXVlcnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnF1ZXJ5Lmxlbmd0aCkge1xuICAgICAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IG51bGw7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnF1ZXJ5KFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVGcmFnbWVudCA9IGZ1bmN0aW9uKGJ1aWxkKSB7XG4gICAgaWYgKCF0aGlzLl9wYXJ0cy5mcmFnbWVudCkge1xuICAgICAgdGhpcy5fcGFydHMuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVNlYXJjaCA9IHAubm9ybWFsaXplUXVlcnk7XG4gIHAubm9ybWFsaXplSGFzaCA9IHAubm9ybWFsaXplRnJhZ21lbnQ7XG5cbiAgcC5pc284ODU5ID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZXhwZWN0IHVuaWNvZGUgaW5wdXQsIGlzbzg4NTkgb3V0cHV0XG4gICAgdmFyIGUgPSBVUkkuZW5jb2RlO1xuICAgIHZhciBkID0gVVJJLmRlY29kZTtcblxuICAgIFVSSS5lbmNvZGUgPSBlc2NhcGU7XG4gICAgVVJJLmRlY29kZSA9IGRlY29kZVVSSUNvbXBvbmVudDtcbiAgICB0cnkge1xuICAgICAgdGhpcy5ub3JtYWxpemUoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgVVJJLmVuY29kZSA9IGU7XG4gICAgICBVUkkuZGVjb2RlID0gZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcC51bmljb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgLy8gZXhwZWN0IGlzbzg4NTkgaW5wdXQsIHVuaWNvZGUgb3V0cHV0XG4gICAgdmFyIGUgPSBVUkkuZW5jb2RlO1xuICAgIHZhciBkID0gVVJJLmRlY29kZTtcblxuICAgIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XG4gICAgVVJJLmRlY29kZSA9IHVuZXNjYXBlO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm5vcm1hbGl6ZSgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBVUkkuZW5jb2RlID0gZTtcbiAgICAgIFVSSS5kZWNvZGUgPSBkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLnJlYWRhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVyaSA9IHRoaXMuY2xvbmUoKTtcbiAgICAvLyByZW1vdmluZyB1c2VybmFtZSwgcGFzc3dvcmQsIGJlY2F1c2UgdGhleSBzaG91bGRuJ3QgYmUgZGlzcGxheWVkIGFjY29yZGluZyB0byBSRkMgMzk4NlxuICAgIHVyaS51c2VybmFtZSgnJykucGFzc3dvcmQoJycpLm5vcm1hbGl6ZSgpO1xuICAgIHZhciB0ID0gJyc7XG4gICAgaWYgKHVyaS5fcGFydHMucHJvdG9jb2wpIHtcbiAgICAgIHQgKz0gdXJpLl9wYXJ0cy5wcm90b2NvbCArICc6Ly8nO1xuICAgIH1cblxuICAgIGlmICh1cmkuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICBpZiAodXJpLmlzKCdwdW55Y29kZScpICYmIHB1bnljb2RlKSB7XG4gICAgICAgIHQgKz0gcHVueWNvZGUudG9Vbmljb2RlKHVyaS5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgICBpZiAodXJpLl9wYXJ0cy5wb3J0KSB7XG4gICAgICAgICAgdCArPSAnOicgKyB1cmkuX3BhcnRzLnBvcnQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgKz0gdXJpLmhvc3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodXJpLl9wYXJ0cy5ob3N0bmFtZSAmJiB1cmkuX3BhcnRzLnBhdGggJiYgdXJpLl9wYXJ0cy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0ICs9ICcvJztcbiAgICB9XG5cbiAgICB0ICs9IHVyaS5wYXRoKHRydWUpO1xuICAgIGlmICh1cmkuX3BhcnRzLnF1ZXJ5KSB7XG4gICAgICB2YXIgcSA9ICcnO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIHFwID0gdXJpLl9wYXJ0cy5xdWVyeS5zcGxpdCgnJicpLCBsID0gcXAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBrdiA9IChxcFtpXSB8fCAnJykuc3BsaXQoJz0nKTtcbiAgICAgICAgcSArPSAnJicgKyBVUkkuZGVjb2RlUXVlcnkoa3ZbMF0sIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpXG4gICAgICAgICAgLnJlcGxhY2UoLyYvZywgJyUyNicpO1xuXG4gICAgICAgIGlmIChrdlsxXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcSArPSAnPScgKyBVUkkuZGVjb2RlUXVlcnkoa3ZbMV0sIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpXG4gICAgICAgICAgICAucmVwbGFjZSgvJi9nLCAnJTI2Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHQgKz0gJz8nICsgcS5zdWJzdHJpbmcoMSk7XG4gICAgfVxuXG4gICAgdCArPSBVUkkuZGVjb2RlUXVlcnkodXJpLmhhc2goKSwgdHJ1ZSk7XG4gICAgcmV0dXJuIHQ7XG4gIH07XG5cbiAgLy8gcmVzb2x2aW5nIHJlbGF0aXZlIGFuZCBhYnNvbHV0ZSBVUkxzXG4gIHAuYWJzb2x1dGVUbyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgICB2YXIgcmVzb2x2ZWQgPSB0aGlzLmNsb25lKCk7XG4gICAgdmFyIHByb3BlcnRpZXMgPSBbJ3Byb3RvY29sJywgJ3VzZXJuYW1lJywgJ3Bhc3N3b3JkJywgJ2hvc3RuYW1lJywgJ3BvcnQnXTtcbiAgICB2YXIgYmFzZWRpciwgaSwgcDtcblxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJOcyBkbyBub3QgaGF2ZSBhbnkgZ2VuZXJhbGx5IGRlZmluZWQgaGllcmFyY2hpY2FsIGNvbXBvbmVudHMnKTtcbiAgICB9XG5cbiAgICBpZiAoIShiYXNlIGluc3RhbmNlb2YgVVJJKSkge1xuICAgICAgYmFzZSA9IG5ldyBVUkkoYmFzZSk7XG4gICAgfVxuXG4gICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucHJvdG9jb2wpIHtcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wcm90b2NvbCA9IGJhc2UuX3BhcnRzLnByb3RvY29sO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IChwID0gcHJvcGVydGllc1tpXSk7IGkrKykge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzW3BdID0gYmFzZS5fcGFydHNbcF07XG4gICAgfVxuXG4gICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucGF0aCkge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnBhdGggPSBiYXNlLl9wYXJ0cy5wYXRoO1xuICAgICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucXVlcnkpIHtcbiAgICAgICAgcmVzb2x2ZWQuX3BhcnRzLnF1ZXJ5ID0gYmFzZS5fcGFydHMucXVlcnk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZC5fcGFydHMucGF0aC5zdWJzdHJpbmcoLTIpID09PSAnLi4nKSB7XG4gICAgICByZXNvbHZlZC5fcGFydHMucGF0aCArPSAnLyc7XG4gICAgfVxuXG4gICAgaWYgKHJlc29sdmVkLnBhdGgoKS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgYmFzZWRpciA9IGJhc2UuZGlyZWN0b3J5KCk7XG4gICAgICBiYXNlZGlyID0gYmFzZWRpciA/IGJhc2VkaXIgOiBiYXNlLnBhdGgoKS5pbmRleE9mKCcvJykgPT09IDAgPyAnLycgOiAnJztcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoID0gKGJhc2VkaXIgPyAoYmFzZWRpciArICcvJykgOiAnJykgKyByZXNvbHZlZC5fcGFydHMucGF0aDtcbiAgICAgIHJlc29sdmVkLm5vcm1hbGl6ZVBhdGgoKTtcbiAgICB9XG5cbiAgICByZXNvbHZlZC5idWlsZCgpO1xuICAgIHJldHVybiByZXNvbHZlZDtcbiAgfTtcbiAgcC5yZWxhdGl2ZVRvID0gZnVuY3Rpb24oYmFzZSkge1xuICAgIHZhciByZWxhdGl2ZSA9IHRoaXMuY2xvbmUoKS5ub3JtYWxpemUoKTtcbiAgICB2YXIgcmVsYXRpdmVQYXJ0cywgYmFzZVBhcnRzLCBjb21tb24sIHJlbGF0aXZlUGF0aCwgYmFzZVBhdGg7XG5cbiAgICBpZiAocmVsYXRpdmUuX3BhcnRzLnVybikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUk5zIGRvIG5vdCBoYXZlIGFueSBnZW5lcmFsbHkgZGVmaW5lZCBoaWVyYXJjaGljYWwgY29tcG9uZW50cycpO1xuICAgIH1cblxuICAgIGJhc2UgPSBuZXcgVVJJKGJhc2UpLm5vcm1hbGl6ZSgpO1xuICAgIHJlbGF0aXZlUGFydHMgPSByZWxhdGl2ZS5fcGFydHM7XG4gICAgYmFzZVBhcnRzID0gYmFzZS5fcGFydHM7XG4gICAgcmVsYXRpdmVQYXRoID0gcmVsYXRpdmUucGF0aCgpO1xuICAgIGJhc2VQYXRoID0gYmFzZS5wYXRoKCk7XG5cbiAgICBpZiAocmVsYXRpdmVQYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VSSSBpcyBhbHJlYWR5IHJlbGF0aXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKGJhc2VQYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxjdWxhdGUgYSBVUkkgcmVsYXRpdmUgdG8gYW5vdGhlciByZWxhdGl2ZSBVUkknKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5wcm90b2NvbCA9PT0gYmFzZVBhcnRzLnByb3RvY29sKSB7XG4gICAgICByZWxhdGl2ZVBhcnRzLnByb3RvY29sID0gbnVsbDtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy51c2VybmFtZSAhPT0gYmFzZVBhcnRzLnVzZXJuYW1lIHx8IHJlbGF0aXZlUGFydHMucGFzc3dvcmQgIT09IGJhc2VQYXJ0cy5wYXNzd29yZCkge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGFydHMucHJvdG9jb2wgIT09IG51bGwgfHwgcmVsYXRpdmVQYXJ0cy51c2VybmFtZSAhPT0gbnVsbCB8fCByZWxhdGl2ZVBhcnRzLnBhc3N3b3JkICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5ob3N0bmFtZSA9PT0gYmFzZVBhcnRzLmhvc3RuYW1lICYmIHJlbGF0aXZlUGFydHMucG9ydCA9PT0gYmFzZVBhcnRzLnBvcnQpIHtcbiAgICAgIHJlbGF0aXZlUGFydHMuaG9zdG5hbWUgPSBudWxsO1xuICAgICAgcmVsYXRpdmVQYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGF0aCA9PT0gYmFzZVBhdGgpIHtcbiAgICAgIHJlbGF0aXZlUGFydHMucGF0aCA9ICcnO1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgLy8gZGV0ZXJtaW5lIGNvbW1vbiBzdWIgcGF0aFxuICAgIGNvbW1vbiA9IFVSSS5jb21tb25QYXRoKHJlbGF0aXZlUGF0aCwgYmFzZVBhdGgpO1xuXG4gICAgLy8gSWYgdGhlIHBhdGhzIGhhdmUgbm90aGluZyBpbiBjb21tb24sIHJldHVybiBhIHJlbGF0aXZlIFVSTCB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoLlxuICAgIGlmICghY29tbW9uKSB7XG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcbiAgICB9XG5cbiAgICB2YXIgcGFyZW50cyA9IGJhc2VQYXJ0cy5wYXRoXG4gICAgICAuc3Vic3RyaW5nKGNvbW1vbi5sZW5ndGgpXG4gICAgICAucmVwbGFjZSgvW15cXC9dKiQvLCAnJylcbiAgICAgIC5yZXBsYWNlKC8uKj9cXC8vZywgJy4uLycpO1xuXG4gICAgcmVsYXRpdmVQYXJ0cy5wYXRoID0gKHBhcmVudHMgKyByZWxhdGl2ZVBhcnRzLnBhdGguc3Vic3RyaW5nKGNvbW1vbi5sZW5ndGgpKSB8fCAnLi8nO1xuXG4gICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gIH07XG5cbiAgLy8gY29tcGFyaW5nIFVSSXNcbiAgcC5lcXVhbHMgPSBmdW5jdGlvbih1cmkpIHtcbiAgICB2YXIgb25lID0gdGhpcy5jbG9uZSgpO1xuICAgIHZhciB0d28gPSBuZXcgVVJJKHVyaSk7XG4gICAgdmFyIG9uZV9tYXAgPSB7fTtcbiAgICB2YXIgdHdvX21hcCA9IHt9O1xuICAgIHZhciBjaGVja2VkID0ge307XG4gICAgdmFyIG9uZV9xdWVyeSwgdHdvX3F1ZXJ5LCBrZXk7XG5cbiAgICBvbmUubm9ybWFsaXplKCk7XG4gICAgdHdvLm5vcm1hbGl6ZSgpO1xuXG4gICAgLy8gZXhhY3QgbWF0Y2hcbiAgICBpZiAob25lLnRvU3RyaW5nKCkgPT09IHR3by50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHF1ZXJ5IHN0cmluZ1xuICAgIG9uZV9xdWVyeSA9IG9uZS5xdWVyeSgpO1xuICAgIHR3b19xdWVyeSA9IHR3by5xdWVyeSgpO1xuICAgIG9uZS5xdWVyeSgnJyk7XG4gICAgdHdvLnF1ZXJ5KCcnKTtcblxuICAgIC8vIGRlZmluaXRlbHkgbm90IGVxdWFsIGlmIG5vdCBldmVuIG5vbi1xdWVyeSBwYXJ0cyBtYXRjaFxuICAgIGlmIChvbmUudG9TdHJpbmcoKSAhPT0gdHdvLnRvU3RyaW5nKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBxdWVyeSBwYXJhbWV0ZXJzIGhhdmUgdGhlIHNhbWUgbGVuZ3RoLCBldmVuIGlmIHRoZXkncmUgcGVybXV0ZWRcbiAgICBpZiAob25lX3F1ZXJ5Lmxlbmd0aCAhPT0gdHdvX3F1ZXJ5Lmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG9uZV9tYXAgPSBVUkkucGFyc2VRdWVyeShvbmVfcXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIHR3b19tYXAgPSBVUkkucGFyc2VRdWVyeSh0d29fcXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuXG4gICAgZm9yIChrZXkgaW4gb25lX21hcCkge1xuICAgICAgaWYgKGhhc093bi5jYWxsKG9uZV9tYXAsIGtleSkpIHtcbiAgICAgICAgaWYgKCFpc0FycmF5KG9uZV9tYXBba2V5XSkpIHtcbiAgICAgICAgICBpZiAob25lX21hcFtrZXldICE9PSB0d29fbWFwW2tleV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIWFycmF5c0VxdWFsKG9uZV9tYXBba2V5XSwgdHdvX21hcFtrZXldKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrZWRba2V5XSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChrZXkgaW4gdHdvX21hcCkge1xuICAgICAgaWYgKGhhc093bi5jYWxsKHR3b19tYXAsIGtleSkpIHtcbiAgICAgICAgaWYgKCFjaGVja2VkW2tleV0pIHtcbiAgICAgICAgICAvLyB0d28gY29udGFpbnMgYSBwYXJhbWV0ZXIgbm90IHByZXNlbnQgaW4gb25lXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgLy8gc3RhdGVcbiAgcC5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSBmdW5jdGlvbih2KSB7XG4gICAgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gISF2O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuZXNjYXBlUXVlcnlTcGFjZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlID0gISF2O1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBVUkk7XG59KSk7XG4iLCJTdGVlZG9zLnVyaSA9IG5ldyBVUkkoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuXG5fLmV4dGVuZCBBY2NvdW50cyxcblx0dXBkYXRlUGhvbmU6IChudW1iZXIsY2FsbGJhY2spLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdE1ldGVvci5jYWxsICd1cGRhdGVQaG9uZScsIHsgbnVtYmVyIH1cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdE1ldGVvci5jYWxsICd1cGRhdGVQaG9uZScsIHsgbnVtYmVyIH0sIGNhbGxiYWNrLFxuXHRkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXM6IChleHBpcmVkRGF5cyxjYWxsYmFjayktPlxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0TWV0ZW9yLmNhbGwgJ2Rpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cycsIGV4cGlyZWREYXlzXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRNZXRlb3IuY2FsbCAnZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzJywgZXhwaXJlZERheXMsIGNhbGxiYWNrXG5cdGdldFBob25lTnVtYmVyOiAoaXNJbmNsdWRlUHJlZml4LCB1c2VyKSAtPlxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0cGhvbmUgPSBBY2NvdW50cy51c2VyKCk/LnBob25lXG5cdFx0ZWxzZVxuXHRcdFx0aWYgdHlwZW9mIHVzZXIgPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHRwaG9uZSA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcik/LnBob25lXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBob25lID0gdXNlcj8ucGhvbmVcblx0XHR1bmxlc3MgcGhvbmVcblx0XHRcdHJldHVybiBcIlwiXG5cdFx0aWYgaXNJbmNsdWRlUHJlZml4XG5cdFx0XHRyZXR1cm4gcGhvbmUubnVtYmVyXG5cdFx0ZWxzZVxuXHRcdFx0dW5sZXNzIHBob25lLm1vYmlsZVxuXHRcdFx0XHQjIOWmguaenOaVsOaNruW6k+S4reS4jeWtmOWcqG1vYmlsZeWAvO+8jOWImeeUqOeul+azleiuoeeul+WHuuS4jeW4puWJjee8gOeahOaJi+acuuWPt1xuXHRcdFx0XHRyZXR1cm4gRTE2NC5nZXRQaG9uZU51bWJlcldpdGhvdXRQcmVmaXggcGhvbmUubnVtYmVyXG5cdFx0XHRyZXR1cm4gcGhvbmUubW9iaWxlXG5cdGdldFBob25lUHJlZml4OiAodXNlcikgLT5cblx0XHQjIOi/lOWbnuW9k+WJjeeUqOaIt+aJi+acuuWPt+WJjee8gO+8jOWmguaenOaJvuS4jeWIsOWImei/lOWbnum7mOiupOeahFwiKzg2XCJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnQgYW5kICF1c2VyXG5cdFx0XHRwaG9uZSA9IEFjY291bnRzLnVzZXIoKT8ucGhvbmVcblx0XHRlbHNlXG5cdFx0XHRpZiB0eXBlb2YgdXNlciA9PSBcInN0cmluZ1wiXG5cdFx0XHRcdHBob25lID0gZGIudXNlcnMuZmluZE9uZSh1c2VyKT8ucGhvbmVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cGhvbmUgPSB1c2VyPy5waG9uZVxuXHRcdHVubGVzcyBwaG9uZVxuXHRcdFx0cmV0dXJuIFwiKzg2XCJcblx0XHRpZiBwaG9uZS5tb2JpbGVcblx0XHRcdHByZWZpeCA9IHBob25lLm51bWJlci5yZXBsYWNlIHBob25lLm1vYmlsZSwgXCJcIlxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6c5pWw5o2u5bqT5Lit5LiN5a2Y5ZyobW9iaWxl5YC877yM5YiZ55So566X5rOV6K6h566X5Ye65omL5py65Y+35YmN57yAXG5cdFx0XHRwcmVmaXggPSBFMTY0LmdldFBob25lUHJlZml4KHBob25lLm51bWJlcilcblx0XHRcdGlmIHByZWZpeFxuXHRcdFx0XHRwcmVmaXggPSBcIisje3ByZWZpeH1cIlxuXHRcdHJldHVybiBpZiBwcmVmaXggdGhlbiBwcmVmaXggZWxzZSBcIis4NlwiXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cbiMgXHRcdFRyYWNrZXIuYXV0b3J1biAoYyktPlxuIyBcdFx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpIGFuZCAhTWV0ZW9yLmxvZ2dpbmdJbigpXG4jIFx0XHRcdFx0Y3VycmVudFBhdGggPSBGbG93Um91dGVyLmN1cnJlbnQoKS5wYXRoXG4jIFx0XHRcdFx0aWYgY3VycmVudFBhdGggIT0gdW5kZWZpbmVkIGFuZCAhL15cXC9zdGVlZG9zXFxiLy50ZXN0KGN1cnJlbnRQYXRoKVxuIyBcdFx0XHRcdFx0IyDmsqHmnInnmbvlvZXkuJTot6/nlLHkuI3ku6Uvc3RlZWRvc+W8gOWktOWImei3s+i9rOWIsOeZu+W9leeVjOmdolxuIyBcdFx0XHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcbiIsIlN0ZWVkb3MudXJpID0gbmV3IFVSSShNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG5cbl8uZXh0ZW5kKEFjY291bnRzLCB7XG4gIHVwZGF0ZVBob25lOiBmdW5jdGlvbihudW1iZXIsIGNhbGxiYWNrKSB7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgTWV0ZW9yLmNhbGwoJ3VwZGF0ZVBob25lJywge1xuICAgICAgICBudW1iZXI6IG51bWJlclxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbCgndXBkYXRlUGhvbmUnLCB7XG4gICAgICAgIG51bWJlcjogbnVtYmVyXG4gICAgICB9LCBjYWxsYmFjayk7XG4gICAgfVxuICB9LFxuICBkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXM6IGZ1bmN0aW9uKGV4cGlyZWREYXlzLCBjYWxsYmFjaykge1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIE1ldGVvci5jYWxsKCdkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXMnLCBleHBpcmVkRGF5cyk7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbCgnZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzJywgZXhwaXJlZERheXMsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG4gIGdldFBob25lTnVtYmVyOiBmdW5jdGlvbihpc0luY2x1ZGVQcmVmaXgsIHVzZXIpIHtcbiAgICB2YXIgcGhvbmUsIHJlZiwgcmVmMTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBwaG9uZSA9IChyZWYgPSBBY2NvdW50cy51c2VyKCkpICE9IG51bGwgPyByZWYucGhvbmUgOiB2b2lkIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdXNlciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBwaG9uZSA9IChyZWYxID0gZGIudXNlcnMuZmluZE9uZSh1c2VyKSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaG9uZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIucGhvbmUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcGhvbmUpIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUHJlZml4KSB7XG4gICAgICByZXR1cm4gcGhvbmUubnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXBob25lLm1vYmlsZSkge1xuICAgICAgICByZXR1cm4gRTE2NC5nZXRQaG9uZU51bWJlcldpdGhvdXRQcmVmaXgocGhvbmUubnVtYmVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwaG9uZS5tb2JpbGU7XG4gICAgfVxuICB9LFxuICBnZXRQaG9uZVByZWZpeDogZnVuY3Rpb24odXNlcikge1xuICAgIHZhciBwaG9uZSwgcHJlZml4LCByZWYsIHJlZjE7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhdXNlcikge1xuICAgICAgcGhvbmUgPSAocmVmID0gQWNjb3VudHMudXNlcigpKSAhPSBudWxsID8gcmVmLnBob25lIDogdm9pZCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHVzZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcGhvbmUgPSAocmVmMSA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcikpICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGhvbmUgPSB1c2VyICE9IG51bGwgPyB1c2VyLnBob25lIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXBob25lKSB7XG4gICAgICByZXR1cm4gXCIrODZcIjtcbiAgICB9XG4gICAgaWYgKHBob25lLm1vYmlsZSkge1xuICAgICAgcHJlZml4ID0gcGhvbmUubnVtYmVyLnJlcGxhY2UocGhvbmUubW9iaWxlLCBcIlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZml4ID0gRTE2NC5nZXRQaG9uZVByZWZpeChwaG9uZS5udW1iZXIpO1xuICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICBwcmVmaXggPSBcIitcIiArIHByZWZpeDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByZWZpeCkge1xuICAgICAgcmV0dXJuIHByZWZpeDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiKzg2XCI7XG4gICAgfVxuICB9XG59KTtcbiIsImlmIE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZT8uZm9yY2VBY2NvdW50QmluZFBob25lXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdE1ldGVvci5tZXRob2RzXG5cdFx0XHRjaGVja0ZvcmNlQmluZFBob25lOiAoc3BhY2VzKSAtPlxuXHRcdFx0XHRjaGVjayBzcGFjZXMsIEFycmF5XG5cdFx0XHRcdHNwYWNlX3NldHRpbmdzID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZCh7a2V5OlwiY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnNcIixzcGFjZTogeyRpbjogc3BhY2VzfX0pXG5cdFx0XHRcdG5vRm9yY2VVc2VycyA9IFtdXG5cdFx0XHRcdHNwYWNlX3NldHRpbmdzLmZvckVhY2ggKG4saSktPlxuXHRcdFx0XHRcdGlmIG4udmFsdWVzPy5sZW5ndGhcblx0XHRcdFx0XHRcdG5vRm9yY2VVc2VycyA9IF8udW5pb24gbm9Gb3JjZVVzZXJzLCBuLnZhbHVlc1xuXHRcdFx0XHRpZiBub0ZvcmNlVXNlcnMgYW5kIG5vRm9yY2VVc2Vycy5sZW5ndGhcblx0XHRcdFx0XHRyZXR1cm4gaWYgbm9Gb3JjZVVzZXJzLmluZGV4T2YoTWV0ZW9yLnVzZXJJZCgpKSA+IC0xIHRoZW4gZmFsc2UgZWxzZSB0cnVlXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0U3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gZmFsc2Vcblx0XHRjaGVja1Bob25lU3RhdGVFeHBpcmVkID0gLT5cblx0XHRcdCMg6L+H5pyf5ZCO5oqK57uR5a6a54q25oCB6L+Y5Y6f5Li65pyq57uR5a6aXG5cdFx0XHRleHBpcmVkRGF5cyA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZT8uZXhwaXJlZERheXNcblx0XHRcdGlmIGV4cGlyZWREYXlzXG5cdFx0XHRcdEFjY291bnRzLmRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cyhleHBpcmVkRGF5cylcblx0XHRcblx0XHR1bmxlc3MgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRBY2NvdW50cy5vbkxvZ2luICgpLT5cblx0XHRcdFx0aWYgQWNjb3VudHMuaXNQaG9uZVZlcmlmaWVkKClcblx0XHRcdFx0XHRjaGVja1Bob25lU3RhdGVFeHBpcmVkKClcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0TWV0ZW9yLnNldFRpbWVvdXQgKCktPlxuXHRcdFx0XHRcdGlmIEFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpXG5cdFx0XHRcdFx0XHRjaGVja1Bob25lU3RhdGVFeHBpcmVkKClcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKCkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcIl9pZFwiKVxuXHRcdFx0XHRcdHVubGVzcyBzcGFjZXMubGVuZ3RoXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRNZXRlb3IuY2FsbCBcImNoZWNrRm9yY2VCaW5kUGhvbmVcIiwgc3BhY2VzLCAoZXJyb3IsIHJlc3VsdHMpLT5cblx0XHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcih0KGVycm9yLnJlYXNvbikpXG5cdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSA9IHJlc3VsdHNcblx0XHRcdFx0XHRcdGlmIFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSBhbmQgIUFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpXG5cdFx0XHRcdFx0XHRcdCMg5pyq6aqM6K+B5omL5py65Y+35pe277yM5by66KGM6Lez6L2s5Yiw5omL5py65Y+357uR5a6a55WM6Z2iXG5cdFx0XHRcdFx0XHRcdHNldHVwVXJsID0gXCIvYWNjb3VudHMvc2V0dXAvcGhvbmVcIlxuXHRcdFx0XHRcdFx0XHRTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSBmYWxzZVxuXHRcdFx0XHRcdFx0XHQjIOaaguaXtuWFiOWBnOaOieaJi+acuuWPt+W8uuWItue7keWumuWKn+iDve+8jOetieWbvemZheWMluebuOWFs+WKn+iDveWujOaIkOWQjuWGjeaUvuW8gFxuXHRcdFx0XHRcdFx0XHQjIHFoZOimgeaxguaUvuW8gO+8jENO5Y+R54mI5pys5YmN6KaB5oqK5Zu96ZmF5YyW55u45YWz5Yqf6IO95a6M5oiQ77yM5ZCm5YiZQ07lj5HniYjmnKzliY3ov5jmmK/opoHms6jph4rmjonor6Xlip/og71cblx0XHRcdFx0XHRcdFx0Rmxvd1JvdXRlci5nbyBzZXR1cFVybFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdFx0cm91dGVyUGF0aCA9IEZsb3dSb3V0ZXIuY3VycmVudCgpPy5wYXRoXG5cdFx0XHRcdFx0XHQjIOW9k+WJjei3r+eUseacrOi6q+WwseWcqOaJi+acuumqjOivgei3r+eUseS4reWImeS4jemcgOimgeaPkOmGkuaJi+acuuWPt+acque7keWumlxuXHRcdFx0XHRcdFx0aWYgL15cXC9hY2NvdW50c1xcL3NldHVwXFwvcGhvbmVcXGIvLnRlc3Qgcm91dGVyUGF0aFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdCMg55m75b2V55u45YWz6Lev55Sx5LiN6ZyA6KaB5o+Q6YaS5omL5py65Y+35pyq57uR5a6aXG5cdFx0XHRcdFx0XHRpZiAvXlxcL3N0ZWVkb3NcXC8vLnRlc3Qgcm91dGVyUGF0aFxuXHRcdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRcdGlmIEFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpXG5cdFx0XHRcdFx0XHRcdGNoZWNrUGhvbmVTdGF0ZUV4cGlyZWQoKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRzZXR1cFVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhY2NvdW50cy9zZXR1cC9waG9uZVwiKVxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lXG5cdFx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKG51bGwsdChcImFjY291bnRzX3Bob25lX3RvYXN0cl9hbGVydFwiKSx7XG5cdFx0XHRcdFx0XHRcdFx0XHRjbG9zZUJ1dHRvbjogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVPdXQ6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRleHRlbmRlZFRpbWVPdXQ6IDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRvbmNsaWNrOiAtPlxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coc2V0dXBVcmwsJ3NldHVwX3Bob25lJylcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHQsIDIwMCIsInZhciBjaGVja1Bob25lU3RhdGVFeHBpcmVkLCByZWYsIHJlZjEsIHJlZjI7XG5cbmlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGhvbmUpICE9IG51bGwgPyByZWYyLmZvcmNlQWNjb3VudEJpbmRQaG9uZSA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgY2hlY2tGb3JjZUJpbmRQaG9uZTogZnVuY3Rpb24oc3BhY2VzKSB7XG4gICAgICAgIHZhciBub0ZvcmNlVXNlcnMsIHNwYWNlX3NldHRpbmdzO1xuICAgICAgICBjaGVjayhzcGFjZXMsIEFycmF5KTtcbiAgICAgICAgc3BhY2Vfc2V0dGluZ3MgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kKHtcbiAgICAgICAgICBrZXk6IFwiY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnNcIixcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBub0ZvcmNlVXNlcnMgPSBbXTtcbiAgICAgICAgc3BhY2Vfc2V0dGluZ3MuZm9yRWFjaChmdW5jdGlvbihuLCBpKSB7XG4gICAgICAgICAgdmFyIHJlZjM7XG4gICAgICAgICAgaWYgKChyZWYzID0gbi52YWx1ZXMpICE9IG51bGwgPyByZWYzLmxlbmd0aCA6IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vRm9yY2VVc2VycyA9IF8udW5pb24obm9Gb3JjZVVzZXJzLCBuLnZhbHVlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKG5vRm9yY2VVc2VycyAmJiBub0ZvcmNlVXNlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKG5vRm9yY2VVc2Vycy5pbmRleE9mKE1ldGVvci51c2VySWQoKSkgPiAtMSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSA9IGZhbHNlO1xuICAgIGNoZWNrUGhvbmVTdGF0ZUV4cGlyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleHBpcmVkRGF5cywgcmVmMywgcmVmNCwgcmVmNTtcbiAgICAgIGV4cGlyZWREYXlzID0gKHJlZjMgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNCA9IHJlZjNbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmNSA9IHJlZjQucGhvbmUpICE9IG51bGwgPyByZWY1LmV4cGlyZWREYXlzIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGV4cGlyZWREYXlzKSB7XG4gICAgICAgIHJldHVybiBBY2NvdW50cy5kaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXMoZXhwaXJlZERheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgaWYgKCFTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKSkge1xuICAgICAgICAgIGNoZWNrUGhvbmVTdGF0ZUV4cGlyZWQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1ldGVvci5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBzcGFjZXM7XG4gICAgICAgICAgaWYgKEFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpKSB7XG4gICAgICAgICAgICBjaGVja1Bob25lU3RhdGVFeHBpcmVkKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKCkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcIl9pZFwiKTtcbiAgICAgICAgICBpZiAoIXNwYWNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwiY2hlY2tGb3JjZUJpbmRQaG9uZVwiLCBzcGFjZXMsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHRzKSB7XG4gICAgICAgICAgICB2YXIgcmVmMywgcm91dGVyUGF0aCwgc2V0dXBVcmw7XG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgdG9hc3RyLmVycm9yKHQoZXJyb3IucmVhc29uKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSByZXN1bHRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSAmJiAhQWNjb3VudHMuaXNQaG9uZVZlcmlmaWVkKCkpIHtcbiAgICAgICAgICAgICAgc2V0dXBVcmwgPSBcIi9hY2NvdW50cy9zZXR1cC9waG9uZVwiO1xuICAgICAgICAgICAgICBTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgRmxvd1JvdXRlci5nbyhzZXR1cFVybCk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvdXRlclBhdGggPSAocmVmMyA9IEZsb3dSb3V0ZXIuY3VycmVudCgpKSAhPSBudWxsID8gcmVmMy5wYXRoIDogdm9pZCAwO1xuICAgICAgICAgICAgaWYgKC9eXFwvYWNjb3VudHNcXC9zZXR1cFxcL3Bob25lXFxiLy50ZXN0KHJvdXRlclBhdGgpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgvXlxcL3N0ZWVkb3NcXC8vLnRlc3Qocm91dGVyUGF0aCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKEFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjaGVja1Bob25lU3RhdGVFeHBpcmVkKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZXR1cFVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhY2NvdW50cy9zZXR1cC9waG9uZVwiKTtcbiAgICAgICAgICAgICAgaWYgKCFTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKG51bGwsIHQoXCJhY2NvdW50c19waG9uZV90b2FzdHJfYWxlcnRcIiksIHtcbiAgICAgICAgICAgICAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgdGltZU91dDogMCxcbiAgICAgICAgICAgICAgICAgIGV4dGVuZGVkVGltZU91dDogMCxcbiAgICAgICAgICAgICAgICAgIG9uY2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHNldHVwVXJsLCAnc2V0dXBfcGhvbmUnKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9LCAyMDApO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iLCIjIE9wdGlvbnNcbnNlbmRWZXJpZmljYXRpb25FbWFpbCA9IHRydWVcbmlmICFwcm9jZXNzLmVudi5NQUlMX1VSTCB8fCAhIFBhY2thZ2VbXCJlbWFpbFwiXVxuICBzZW5kVmVyaWZpY2F0aW9uRW1haWwgPSBmYWxzZVxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlXG4gIGRlZmF1bHRMYXlvdXQ6ICdsb2dpbkxheW91dCcsXG4gIGRlZmF1bHRMYXlvdXRSZWdpb25zOiBcbiAgICBuYXY6ICdsb2dpbk5hdicsXG4gIGRlZmF1bHRDb250ZW50UmVnaW9uOiAnbWFpbicsXG5cbiAgc2hvd0ZvcmdvdFBhc3N3b3JkTGluazogdHJ1ZSxcbiAgb3ZlcnJpZGVMb2dpbkVycm9yczogdHJ1ZSxcbiAgZW5hYmxlUGFzc3dvcmRDaGFuZ2U6IHRydWUsXG5cbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsOiBzZW5kVmVyaWZpY2F0aW9uRW1haWwsXG4gICMgZW5mb3JjZUVtYWlsVmVyaWZpY2F0aW9uOiB0cnVlLFxuICAjIGNvbmZpcm1QYXNzd29yZDogdHJ1ZSxcbiAgIyBjb250aW51b3VzVmFsaWRhdGlvbjogZmFsc2UsXG4gICMgZGlzcGxheUZvcm1MYWJlbHM6IHRydWUsXG4gICMgZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uOiB0cnVlLFxuICAjIGZvcm1WYWxpZGF0aW9uRmVlZGJhY2s6IHRydWUsXG4gIGhvbWVSb3V0ZVBhdGg6ICcvJyxcbiAgIyBzaG93QWRkUmVtb3ZlU2VydmljZXM6IGZhbHNlLFxuICAjIHNob3dQbGFjZWhvbGRlcnM6IHRydWUsXG5cbiAgbmVnYXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuICBwb3NpdGl2ZVZhbGlkYXRpb246IHRydWUsXG4gIG5lZ2F0aXZlRmVlZGJhY2s6IGZhbHNlLFxuICBwb3NpdGl2ZUZlZWRiYWNrOiB0cnVlLFxuICBzaG93TGFiZWxzOiBmYWxzZSxcblxuICAjIFByaXZhY3kgUG9saWN5IGFuZCBUZXJtcyBvZiBVc2VcbiAgIyBwcml2YWN5VXJsOiAncHJpdmFjeScsXG4gICMgdGVybXNVcmw6ICd0ZXJtcy1vZi11c2UnLFxuXG4gIHByZVNpZ25VcEhvb2s6IChwYXNzd29yZCwgb3B0aW9ucykgLT5cbiAgICBvcHRpb25zLnByb2ZpbGUubG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcblxuXG5cblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ2NoYW5nZVB3ZCcsXG4gIHBhdGg6ICcvc3RlZWRvcy9jaGFuZ2UtcGFzc3dvcmQnXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSAnZm9yZ290UHdkJyxcbiAgcGF0aDogJy9zdGVlZG9zL2ZvcmdvdC1wYXNzd29yZCdcbiAgcmVkaXJlY3Q6ICcvc3RlZWRvcy9mb3Jnb3QtcGFzc3dvcmQtdG9rZW4nXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSAncmVzZXRQd2QnLFxuICBwYXRoOiAnL3N0ZWVkb3MvcmVzZXQtcGFzc3dvcmQnXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSAnc2lnbkluJyxcbiAgcGF0aDogJy9zdGVlZG9zL3NpZ24taW4nXG4gIHJlZGlyZWN0OiAoKS0+XG4gICAgIyBwYXRoID0gRmxvd1JvdXRlci5jdXJyZW50KCkucGF0aFxuICAgICMgaWYgL15cXC9vYXV0aDJcXGIvLnRlc3QocGF0aClcbiAgICAjICAgbG9jYXRpb24ucmVsb2FkKClcbiAgICAjIGVsc2VcbiAgICAjICAgRmxvd1JvdXRlci5nbyhGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcz8ucmVkaXJlY3QgfHwgXCIvXCIpO1xuICAgIGlmIEZsb3dSb3V0ZXIuY3VycmVudCgpLnF1ZXJ5UGFyYW1zPy5yZWRpcmVjdCBcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcz8ucmVkaXJlY3QgXG4gICAgZWxzZVxuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIilcbiAgICAgIFxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3NpZ25VcCcsXG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLXVwJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3ZlcmlmeUVtYWlsJyxcbiAgcGF0aDogJy9zdGVlZG9zL3ZlcmlmeS1lbWFpbCdcbiAgcmVkaXJlY3Q6ICgpLT5cbiAgICAjIOW9k+S4lOS7heW9k+eUqOaIt+WPquacieS4gOS4qumCrueuseaXtizorr7nva7kuLvopoHpgq7nrrFcbiAgICBlbWFpbHMgPSBNZXRlb3IudXNlcigpPy5lbWFpbHNcbiAgICBpZiBlbWFpbHMgYW5kIGVtYWlscy5sZW5ndGggPT0gMVxuICAgICAgZW1haWwgPSBlbWFpbHNbMF0uYWRkcmVzc1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhcImxvYWRpbmdcIilcbiAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWxcIiwgZW1haWwsIChlcnJvciwgcmVzdWx0KS0+XG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKVxuICAgICAgICBpZiByZXN1bHQ/LmVycm9yXG4gICAgICAgICAgdG9hc3RyLmVycm9yIHQocmVzdWx0Lm1lc3NhZ2UpXG4gICAgRmxvd1JvdXRlci5nbyBcIi9cIlxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ2Vucm9sbEFjY291bnQnLFxuICBwYXRoOiAnL3N0ZWVkb3MvZW5yb2xsLWFjY291bnQnXG5cbiMgYWRkIGZpZWxkcyB3aXRoaW4gc2lnbi11cCBmb3JtXG5wd2RGaWVsZCA9IEFjY291bnRzVGVtcGxhdGVzLnJlbW92ZUZpZWxkKCdwYXNzd29yZCcpO1xuQWNjb3VudHNUZW1wbGF0ZXMucmVtb3ZlRmllbGQoJ2VtYWlsJyk7XG5BY2NvdW50c1RlbXBsYXRlcy5hZGRGaWVsZHMoW1xuICB7XG4gICAgX2lkOiAnY29tcGFueScsXG4gICAgdHlwZTogJ3RleHQnXG4gIH0sXG4gIHtcbiAgICBfaWQ6ICduYW1lJyxcbiAgICB0eXBlOiAndGV4dCdcbiAgfSxcbiAge1xuICAgIF9pZDogJ2VtYWlsJyxcbiAgICB0eXBlOiAnZW1haWwnLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgZGlzcGxheU5hbWU6IFwiZW1haWxcIixcbiAgICByZTogLy4rQCguKyl7Mix9XFwuKC4rKXsyLH0vLFxuICAgIGVyclN0cjogJ0ludmFsaWQgZW1haWwnLFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICBmb3Jnb3RQd2Q6XCJlbWFpbF9pbnB1dF9wbGFjZWhvbGRlclwiXG4gICAgfVxuICB9LFxuICB7XG4gICAgX2lkOiAndXNlcm5hbWVfYW5kX2VtYWlsJyxcbiAgICB0eXBlOiAndGV4dCcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IFwiTG9naW5cIlxuICB9LFxuICB7XG4gICAgX2lkOiBcInVzZXJuYW1lXCIsXG4gICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgZGlzcGxheU5hbWU6IFwidXNlcm5hbWVcIixcbiAgICByZXF1aXJlZDogZmFsc2UsI+S8geS4muazqOWGjOeVjOmdouayoeacieivpeWtl+aute+8jOaJgOS7peaUueS4uumdnuW/heWhq1xuICAgIG1pbkxlbmd0aDogNlxuICB9LFxuICBwd2RGaWVsZFxuXSk7XG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyIGFuZCBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5zaXRlTmFtZSA9IFwiU3RlZWRvc1wiO1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tID0gTWV0ZW9yLnNldHRpbmdzLmVtYWlsPy5mcm9tO1xuXG5cbmlmIE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hY2NvdW50cz8uZGlzYWJsZUFjY291bnRSZWdpc3RyYXRpb25cbiAgQWNjb3VudHNUZW1wbGF0ZXMub3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24gPSB0cnVlXG4iLCJ2YXIgcHdkRmllbGQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VuZFZlcmlmaWNhdGlvbkVtYWlsO1xuXG5zZW5kVmVyaWZpY2F0aW9uRW1haWwgPSB0cnVlO1xuXG5pZiAoIXByb2Nlc3MuZW52Lk1BSUxfVVJMIHx8ICFQYWNrYWdlW1wiZW1haWxcIl0pIHtcbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZmFsc2U7XG59XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZSh7XG4gIGRlZmF1bHRMYXlvdXQ6ICdsb2dpbkxheW91dCcsXG4gIGRlZmF1bHRMYXlvdXRSZWdpb25zOiB7XG4gICAgbmF2OiAnbG9naW5OYXYnXG4gIH0sXG4gIGRlZmF1bHRDb250ZW50UmVnaW9uOiAnbWFpbicsXG4gIHNob3dGb3Jnb3RQYXNzd29yZExpbms6IHRydWUsXG4gIG92ZXJyaWRlTG9naW5FcnJvcnM6IHRydWUsXG4gIGVuYWJsZVBhc3N3b3JkQ2hhbmdlOiB0cnVlLFxuICBzZW5kVmVyaWZpY2F0aW9uRW1haWw6IHNlbmRWZXJpZmljYXRpb25FbWFpbCxcbiAgaG9tZVJvdXRlUGF0aDogJy8nLFxuICBuZWdhdGl2ZVZhbGlkYXRpb246IHRydWUsXG4gIHBvc2l0aXZlVmFsaWRhdGlvbjogdHJ1ZSxcbiAgbmVnYXRpdmVGZWVkYmFjazogZmFsc2UsXG4gIHBvc2l0aXZlRmVlZGJhY2s6IHRydWUsXG4gIHNob3dMYWJlbHM6IGZhbHNlLFxuICBwcmVTaWduVXBIb29rOiBmdW5jdGlvbihwYXNzd29yZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25zLnByb2ZpbGUubG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgfVxufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdjaGFuZ2VQd2QnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9jaGFuZ2UtcGFzc3dvcmQnXG59KTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ2ZvcmdvdFB3ZCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL2ZvcmdvdC1wYXNzd29yZCcsXG4gIHJlZGlyZWN0OiAnL3N0ZWVkb3MvZm9yZ290LXBhc3N3b3JkLXRva2VuJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdyZXNldFB3ZCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL3Jlc2V0LXBhc3N3b3JkJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdzaWduSW4nLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLWluJyxcbiAgcmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgaWYgKChyZWYgPSBGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcykgIT0gbnVsbCA/IHJlZi5yZWRpcmVjdCA6IHZvaWQgMCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSAocmVmMSA9IEZsb3dSb3V0ZXIuY3VycmVudCgpLnF1ZXJ5UGFyYW1zKSAhPSBudWxsID8gcmVmMS5yZWRpcmVjdCA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgIH1cbiAgfVxufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdzaWduVXAnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLXVwJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCd2ZXJpZnlFbWFpbCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL3ZlcmlmeS1lbWFpbCcsXG4gIHJlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZW1haWwsIGVtYWlscywgcmVmO1xuICAgIGVtYWlscyA9IChyZWYgPSBNZXRlb3IudXNlcigpKSAhPSBudWxsID8gcmVmLmVtYWlscyA6IHZvaWQgMDtcbiAgICBpZiAoZW1haWxzICYmIGVtYWlscy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGVtYWlsID0gZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKFwibG9hZGluZ1wiKTtcbiAgICAgIE1ldGVvci5jYWxsKFwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWxcIiwgZW1haWwsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgJChkb2N1bWVudC5ib2R5KS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgPyByZXN1bHQuZXJyb3IgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQocmVzdWx0Lm1lc3NhZ2UpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgfVxufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdlbnJvbGxBY2NvdW50Jywge1xuICBwYXRoOiAnL3N0ZWVkb3MvZW5yb2xsLWFjY291bnQnXG59KTtcblxucHdkRmllbGQgPSBBY2NvdW50c1RlbXBsYXRlcy5yZW1vdmVGaWVsZCgncGFzc3dvcmQnKTtcblxuQWNjb3VudHNUZW1wbGF0ZXMucmVtb3ZlRmllbGQoJ2VtYWlsJyk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmFkZEZpZWxkcyhbXG4gIHtcbiAgICBfaWQ6ICdjb21wYW55JyxcbiAgICB0eXBlOiAndGV4dCdcbiAgfSwge1xuICAgIF9pZDogJ25hbWUnLFxuICAgIHR5cGU6ICd0ZXh0J1xuICB9LCB7XG4gICAgX2lkOiAnZW1haWwnLFxuICAgIHR5cGU6ICdlbWFpbCcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IFwiZW1haWxcIixcbiAgICByZTogLy4rQCguKyl7Mix9XFwuKC4rKXsyLH0vLFxuICAgIGVyclN0cjogJ0ludmFsaWQgZW1haWwnLFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICBmb3Jnb3RQd2Q6IFwiZW1haWxfaW5wdXRfcGxhY2Vob2xkZXJcIlxuICAgIH1cbiAgfSwge1xuICAgIF9pZDogJ3VzZXJuYW1lX2FuZF9lbWFpbCcsXG4gICAgdHlwZTogJ3RleHQnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiBcIkxvZ2luXCJcbiAgfSwge1xuICAgIF9pZDogXCJ1c2VybmFtZVwiLFxuICAgIHR5cGU6IFwidGV4dFwiLFxuICAgIGRpc3BsYXlOYW1lOiBcInVzZXJuYW1lXCIsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgIG1pbkxlbmd0aDogNlxuICB9LCBwd2RGaWVsZFxuXSk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMpIHtcbiAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWUgPSBcIlN0ZWVkb3NcIjtcbiAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MuZW1haWwpICE9IG51bGwgPyByZWYuZnJvbSA6IHZvaWQgMDtcbn1cblxuaWYgKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmFjY291bnRzKSAhPSBudWxsID8gcmVmMy5kaXNhYmxlQWNjb3VudFJlZ2lzdHJhdGlvbiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICBBY2NvdW50c1RlbXBsYXRlcy5vcHRpb25zLmZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiA9IHRydWU7XG59XG4iLCIvLy8gQkNSWVBUXG52YXIgYmNyeXB0ID0gTnBtTW9kdWxlQmNyeXB0O1xudmFyIGJjcnlwdEhhc2ggPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5oYXNoKTtcbnZhciBiY3J5cHRDb21wYXJlID0gTWV0ZW9yLndyYXBBc3luYyhiY3J5cHQuY29tcGFyZSk7XG5cbnZhciBwYXNzd29yZFZhbGlkYXRvciA9IE1hdGNoLk9uZU9mKFxuICBTdHJpbmcsXG4gIHsgZGlnZXN0OiBTdHJpbmcsIGFsZ29yaXRobTogU3RyaW5nIH1cbik7XG5cbnZhciBjaGVja1Bhc3N3b3JkID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQ7XG5cbi8vIEdpdmVuIGEgJ3Bhc3N3b3JkJyBmcm9tIHRoZSBjbGllbnQsIGV4dHJhY3QgdGhlIHN0cmluZyB0aGF0IHdlIHNob3VsZFxuLy8gYmNyeXB0LiAncGFzc3dvcmQnIGNhbiBiZSBvbmUgb2Y6XG4vLyAgLSBTdHJpbmcgKHRoZSBwbGFpbnRleHQgcGFzc3dvcmQpXG4vLyAgLSBPYmplY3Qgd2l0aCAnZGlnZXN0JyBhbmQgJ2FsZ29yaXRobScga2V5cy4gJ2FsZ29yaXRobScgbXVzdCBiZSBcInNoYS0yNTZcIi5cbi8vXG52YXIgZ2V0UGFzc3dvcmRTdHJpbmcgPSBmdW5jdGlvbiAocGFzc3dvcmQpIHtcbiAgaWYgKHR5cGVvZiBwYXNzd29yZCA9PT0gXCJzdHJpbmdcIikge1xuICAgIHBhc3N3b3JkID0gU0hBMjU2KHBhc3N3b3JkKTtcbiAgfSBlbHNlIHsgLy8gJ3Bhc3N3b3JkJyBpcyBhbiBvYmplY3RcbiAgICBpZiAocGFzc3dvcmQuYWxnb3JpdGhtICE9PSBcInNoYS0yNTZcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXNzd29yZCBoYXNoIGFsZ29yaXRobS4gXCIgK1xuICAgICAgICAgICAgICAgICAgICAgIFwiT25seSAnc2hhLTI1NicgaXMgYWxsb3dlZC5cIik7XG4gICAgfVxuICAgIHBhc3N3b3JkID0gcGFzc3dvcmQuZGlnZXN0O1xuICB9XG4gIHJldHVybiBwYXNzd29yZDtcbn07XG5cbi8vIFVzZSBiY3J5cHQgdG8gaGFzaCB0aGUgcGFzc3dvcmQgZm9yIHN0b3JhZ2UgaW4gdGhlIGRhdGFiYXNlLlxuLy8gYHBhc3N3b3JkYCBjYW4gYmUgYSBzdHJpbmcgKGluIHdoaWNoIGNhc2UgaXQgd2lsbCBiZSBydW4gdGhyb3VnaFxuLy8gU0hBMjU2IGJlZm9yZSBiY3J5cHQpIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgYGRpZ2VzdGAgYW5kXG4vLyBgYWxnb3JpdGhtYCAoaW4gd2hpY2ggY2FzZSB3ZSBiY3J5cHQgYHBhc3N3b3JkLmRpZ2VzdGApLlxuLy9cbnZhciBoYXNoUGFzc3dvcmQgPSBmdW5jdGlvbiAocGFzc3dvcmQpIHtcbiAgcGFzc3dvcmQgPSBnZXRQYXNzd29yZFN0cmluZyhwYXNzd29yZCk7XG4gIHJldHVybiBiY3J5cHRIYXNoKHBhc3N3b3JkLCBBY2NvdW50cy5fYmNyeXB0Um91bmRzKTtcbn07XG5cbi8vL1xuLy8vIEVSUk9SIEhBTkRMRVJcbi8vL1xudmFyIGhhbmRsZUVycm9yID0gZnVuY3Rpb24obXNnLCB0aHJvd0Vycm9yKSB7XG4gIGlmKHRocm93RXJyb3IgPT09IHVuZGVmaW5lZCl7XG4gICAgdGhyb3dFcnJvciA9IHRydWU7XG4gIH1cbiAgdmFyIGVycm9yID0gbmV3IE1ldGVvci5FcnJvcihcbiAgICA0MDMsXG4gICAgQWNjb3VudHMuX29wdGlvbnMuYW1iaWd1b3VzRXJyb3JNZXNzYWdlc1xuICAgICAgPyBcIlNvbWV0aGluZyB3ZW50IHdyb25nLiBQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscy5cIlxuICAgICAgOiBtc2dcbiAgKTtcbiAgaWYgKHRocm93RXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59O1xuXG4vLyBHZW5lcmF0ZXMgcGVybXV0YXRpb25zIG9mIGFsbCBjYXNlIHZhcmlhdGlvbnMgb2YgYSBnaXZlbiBzdHJpbmcuXG52YXIgZ2VuZXJhdGVDYXNlUGVybXV0YXRpb25zRm9yU3RyaW5nID0gZnVuY3Rpb24gKHN0cmluZykge1xuICB2YXIgcGVybXV0YXRpb25zID0gWycnXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2ggPSBzdHJpbmcuY2hhckF0KGkpO1xuICAgIHBlcm11dGF0aW9ucyA9IF8uZmxhdHRlbihfLm1hcChwZXJtdXRhdGlvbnMsIGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgIHZhciBsb3dlckNhc2VDaGFyID0gY2gudG9Mb3dlckNhc2UoKTtcbiAgICAgIHZhciB1cHBlckNhc2VDaGFyID0gY2gudG9VcHBlckNhc2UoKTtcbiAgICAgIC8vIERvbid0IGFkZCB1bm5lY2Nlc2FyeSBwZXJtdXRhdGlvbnMgd2hlbiBjaCBpcyBub3QgYSBsZXR0ZXJcbiAgICAgIGlmIChsb3dlckNhc2VDaGFyID09PSB1cHBlckNhc2VDaGFyKSB7XG4gICAgICAgIHJldHVybiBbcHJlZml4ICsgY2hdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFtwcmVmaXggKyBsb3dlckNhc2VDaGFyLCBwcmVmaXggKyB1cHBlckNhc2VDaGFyXTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cbiAgcmV0dXJuIHBlcm11dGF0aW9ucztcbn07XG5cbi8vIEdlbmVyYXRlcyBhIE1vbmdvREIgc2VsZWN0b3IgdGhhdCBjYW4gYmUgdXNlZCB0byBwZXJmb3JtIGEgZmFzdCBjYXNlXG4vLyBpbnNlbnNpdGl2ZSBsb29rdXAgZm9yIHRoZSBnaXZlbiBmaWVsZE5hbWUgYW5kIHN0cmluZy4gU2luY2UgTW9uZ29EQiBkb2VzXG4vLyBub3Qgc3VwcG9ydCBjYXNlIGluc2Vuc2l0aXZlIGluZGV4ZXMsIGFuZCBjYXNlIGluc2Vuc2l0aXZlIHJlZ2V4IHF1ZXJpZXNcbi8vIGFyZSBzbG93LCB3ZSBjb25zdHJ1Y3QgYSBzZXQgb2YgcHJlZml4IHNlbGVjdG9ycyBmb3IgYWxsIHBlcm11dGF0aW9ucyBvZlxuLy8gdGhlIGZpcnN0IDQgY2hhcmFjdGVycyBvdXJzZWx2ZXMuIFdlIGZpcnN0IGF0dGVtcHQgdG8gbWF0Y2hpbmcgYWdhaW5zdFxuLy8gdGhlc2UsIGFuZCBiZWNhdXNlICdwcmVmaXggZXhwcmVzc2lvbicgcmVnZXggcXVlcmllcyBkbyB1c2UgaW5kZXhlcyAoc2VlXG4vLyBodHRwOi8vZG9jcy5tb25nb2RiLm9yZy92Mi42L3JlZmVyZW5jZS9vcGVyYXRvci9xdWVyeS9yZWdleC8jaW5kZXgtdXNlKSxcbi8vIHRoaXMgaGFzIGJlZW4gZm91bmQgdG8gZ3JlYXRseSBpbXByb3ZlIHBlcmZvcm1hbmNlIChmcm9tIDEyMDBtcyB0byA1bXMgaW4gYVxuLy8gdGVzdCB3aXRoIDEuMDAwLjAwMCB1c2VycykuXG52YXIgc2VsZWN0b3JGb3JGYXN0Q2FzZUluc2Vuc2l0aXZlTG9va3VwID0gZnVuY3Rpb24gKGZpZWxkTmFtZSwgc3RyaW5nKSB7XG4gIC8vIFBlcmZvcm1hbmNlIHNlZW1zIHRvIGltcHJvdmUgdXAgdG8gNCBwcmVmaXggY2hhcmFjdGVyc1xuICB2YXIgcHJlZml4ID0gc3RyaW5nLnN1YnN0cmluZygwLCBNYXRoLm1pbihzdHJpbmcubGVuZ3RoLCA0KSk7XG4gIHZhciBvckNsYXVzZSA9IF8ubWFwKGdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyhwcmVmaXgpLFxuICAgIGZ1bmN0aW9uIChwcmVmaXhQZXJtdXRhdGlvbikge1xuICAgICAgdmFyIHNlbGVjdG9yID0ge307XG4gICAgICBzZWxlY3RvcltmaWVsZE5hbWVdID1cbiAgICAgICAgbmV3IFJlZ0V4cCgnXicgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cChwcmVmaXhQZXJtdXRhdGlvbikpO1xuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH0pO1xuICB2YXIgY2FzZUluc2Vuc2l0aXZlQ2xhdXNlID0ge307XG4gIGNhc2VJbnNlbnNpdGl2ZUNsYXVzZVtmaWVsZE5hbWVdID1cbiAgICBuZXcgUmVnRXhwKCdeJyArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHN0cmluZykgKyAnJCcsICdpJylcbiAgcmV0dXJuIHskYW5kOiBbeyRvcjogb3JDbGF1c2V9LCBjYXNlSW5zZW5zaXRpdmVDbGF1c2VdfTtcbn1cblxuQWNjb3VudHMuX2ZpbmRVc2VyQnlRdWVyeUZvclN0ZWVkb3MgPSBmdW5jdGlvbiAocXVlcnkpIHtcbiAgdmFyIHVzZXIgPSBudWxsO1xuXG4gIGlmIChxdWVyeS5pZCkge1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7IF9pZDogcXVlcnkuaWQgfSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGZpZWxkTmFtZTtcbiAgICB2YXIgZmllbGRWYWx1ZTtcbiAgICBpZiAocXVlcnkudXNlcm5hbWUpIHtcbiAgICAgIGZpZWxkTmFtZSA9ICd1c2VybmFtZSc7XG4gICAgICBmaWVsZFZhbHVlID0gcXVlcnkudXNlcm5hbWU7XG4gICAgfSBlbHNlIGlmIChxdWVyeS5lbWFpbCkge1xuICAgICAgZmllbGROYW1lID0gJ2VtYWlscy5hZGRyZXNzJztcbiAgICAgIGZpZWxkVmFsdWUgPSBxdWVyeS5lbWFpbDtcbiAgICB9IGVsc2UgaWYgKHF1ZXJ5LnBob25lKSB7XG4gICAgICBmaWVsZE5hbWUgPSAncGhvbmUubnVtYmVyJztcbiAgICAgIC8vIGZpZWxkVmFsdWXlpoLmnpzoh6rluKbljLrlj7fvvIzliJnkuI3lgZrlpITnkIbvvIzlj43kuYvpu5jorqTliqDkuIrkuK3lm73ljLrlj7crODZcbiAgICAgIGlmKC9eXFwrXFxkKy9nLnRlc3QocXVlcnkucGhvbmUpKXtcbiAgICAgICAgZmllbGRWYWx1ZSA9IHF1ZXJ5LnBob25lO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgZmllbGRWYWx1ZSA9IFwiKzg2XCIgKyBxdWVyeS5waG9uZTtcbiAgICAgIH1cbiAgICAgIGZpZWxkTmFtZSA9IFwiJG9yXCJcbiAgICAgIGZpZWxkVmFsdWUgPSBbeydwaG9uZS5udW1iZXInOmZpZWxkVmFsdWV9LHt1c2VybmFtZTpxdWVyeS5waG9uZX1dXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZG4ndCBoYXBwZW4gKHZhbGlkYXRpb24gbWlzc2VkIHNvbWV0aGluZylcIik7XG4gICAgfVxuICAgIHZhciBzZWxlY3RvciA9IHt9O1xuICAgIHNlbGVjdG9yW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZShzZWxlY3Rvcik7XG4gICAgLy8gSWYgdXNlciBpcyBub3QgZm91bmQsIHRyeSBhIGNhc2UgaW5zZW5zaXRpdmUgbG9va3VwXG4gICAgaWYgKCF1c2VyICYmIGZpZWxkTmFtZSAhPSBcIiRvclwiKSB7XG4gICAgICBzZWxlY3RvciA9IHNlbGVjdG9yRm9yRmFzdENhc2VJbnNlbnNpdGl2ZUxvb2t1cChmaWVsZE5hbWUsIGZpZWxkVmFsdWUpO1xuICAgICAgdmFyIGNhbmRpZGF0ZVVzZXJzID0gTWV0ZW9yLnVzZXJzLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XG4gICAgICAvLyBObyBtYXRjaCBpZiBtdWx0aXBsZSBjYW5kaWRhdGVzIGFyZSBmb3VuZFxuICAgICAgaWYgKGNhbmRpZGF0ZVVzZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB1c2VyID0gY2FuZGlkYXRlVXNlcnNbMF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHVzZXI7XG59O1xuXG52YXIgTm9uRW1wdHlTdHJpbmcgPSBNYXRjaC5XaGVyZShmdW5jdGlvbiAoeCkge1xuICBjaGVjayh4LCBTdHJpbmcpO1xuICByZXR1cm4geC5sZW5ndGggPiAwO1xufSk7XG5cbnZhciB1c2VyUXVlcnlWYWxpZGF0b3IgPSBNYXRjaC5XaGVyZShmdW5jdGlvbiAodXNlcikge1xuICBjaGVjayh1c2VyLCB7XG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcbiAgICB1c2VybmFtZTogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpLFxuICAgIGVtYWlsOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZyksXG4gICAgcGhvbmU6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKVxuICB9KTtcbiAgaWYgKF8ua2V5cyh1c2VyKS5sZW5ndGggIT09IDEpXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKFwiVXNlciBwcm9wZXJ0eSBtdXN0IGhhdmUgZXhhY3RseSBvbmUgZmllbGRcIik7XG4gIHJldHVybiB0cnVlO1xufSk7XG5cbkFjY291bnRzLnJlZ2lzdGVyTG9naW5IYW5kbGVyKFwicGFzc3dvcmQyXCIsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICghIG9wdGlvbnMucGFzc3dvcmQyIHx8IG9wdGlvbnMuc3JwKVxuICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIGRvbid0IGhhbmRsZVxuXG4gIGNoZWNrKG9wdGlvbnMsIHtcbiAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXG4gICAgcGFzc3dvcmQyOiBwYXNzd29yZFZhbGlkYXRvclxuICB9KTtcblxuXG4gIHZhciB1c2VyID0gQWNjb3VudHMuX2ZpbmRVc2VyQnlRdWVyeUZvclN0ZWVkb3Mob3B0aW9ucy51c2VyKTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIG5vdCBmb3VuZFwiKTtcbiAgfVxuXG4gIGlmICghdXNlci5zZXJ2aWNlcyB8fCAhdXNlci5zZXJ2aWNlcy5wYXNzd29yZCB8fFxuICAgICAgISh1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCB8fCB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycCkpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcbiAgfVxuXG4gIGlmICghdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucGFzc3dvcmQyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAvLyBUaGUgY2xpZW50IGhhcyBwcmVzZW50ZWQgYSBwbGFpbnRleHQgcGFzc3dvcmQsIGFuZCB0aGUgdXNlciBpc1xuICAgICAgLy8gbm90IHVwZ3JhZGVkIHRvIGJjcnlwdCB5ZXQuIFdlIGRvbid0IGF0dGVtcHQgdG8gdGVsbCB0aGUgY2xpZW50XG4gICAgICAvLyB0byB1cGdyYWRlIHRvIGJjcnlwdCwgYmVjYXVzZSBpdCBtaWdodCBiZSBhIHN0YW5kYWxvbmUgRERQXG4gICAgICAvLyBjbGllbnQgZG9lc24ndCBrbm93IGhvdyB0byBkbyBzdWNoIGEgdGhpbmcuXG4gICAgICB2YXIgdmVyaWZpZXIgPSB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycDtcbiAgICAgIHZhciBuZXdWZXJpZmllciA9IFNSUC5nZW5lcmF0ZVZlcmlmaWVyKG9wdGlvbnMucGFzc3dvcmQyLCB7XG4gICAgICAgIGlkZW50aXR5OiB2ZXJpZmllci5pZGVudGl0eSwgc2FsdDogdmVyaWZpZXIuc2FsdH0pO1xuXG4gICAgICBpZiAodmVyaWZpZXIudmVyaWZpZXIgIT09IG5ld1ZlcmlmaWVyLnZlcmlmaWVyKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdXNlcklkOiBBY2NvdW50cy5fb3B0aW9ucy5hbWJpZ3VvdXNFcnJvck1lc3NhZ2VzID8gbnVsbCA6IHVzZXIuX2lkLFxuICAgICAgICAgIGVycm9yOiBoYW5kbGVFcnJvcihcIkluY29ycmVjdCBwYXNzd29yZFwiLCBmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHt1c2VySWQ6IHVzZXIuX2lkfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGVsbCB0aGUgY2xpZW50IHRvIHVzZSB0aGUgU1JQIHVwZ3JhZGUgcHJvY2Vzcy5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIm9sZCBwYXNzd29yZCBmb3JtYXRcIiwgRUpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZm9ybWF0OiAnc3JwJyxcbiAgICAgICAgaWRlbnRpdHk6IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLmlkZW50aXR5XG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNoZWNrUGFzc3dvcmQoXG4gICAgdXNlcixcbiAgICBvcHRpb25zLnBhc3N3b3JkMlxuICApO1xufSk7XG5cbi8vIEhhbmRsZXIgdG8gbG9naW4gdXNpbmcgdGhlIFNSUCB1cGdyYWRlIHBhdGguIFRvIHVzZSB0aGlzIGxvZ2luXG4vLyBoYW5kbGVyLCB0aGUgY2xpZW50IG11c3QgcHJvdmlkZTpcbi8vICAgLSBzcnA6IEgoaWRlbnRpdHkgKyBcIjpcIiArIHBhc3N3b3JkKVxuLy8gICAtIHBhc3N3b3JkOiBhIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJ1xuLy9cbi8vIFdlIHVzZSBgb3B0aW9ucy5zcnBgIHRvIHZlcmlmeSB0aGF0IHRoZSBjbGllbnQga25vd3MgdGhlIGNvcnJlY3Rcbi8vIHBhc3N3b3JkIHdpdGhvdXQgZG9pbmcgYSBmdWxsIFNSUCBmbG93LiBPbmNlIHdlJ3ZlIGNoZWNrZWQgdGhhdCwgd2Vcbi8vIHVwZ3JhZGUgdGhlIHVzZXIgdG8gYmNyeXB0IGFuZCByZW1vdmUgdGhlIFNSUCBpbmZvcm1hdGlvbiBmcm9tIHRoZVxuLy8gdXNlciBkb2N1bWVudC5cbi8vXG4vLyBUaGUgY2xpZW50IGVuZHMgdXAgdXNpbmcgdGhpcyBsb2dpbiBoYW5kbGVyIGFmdGVyIHRyeWluZyB0aGUgbm9ybWFsXG4vLyBsb2dpbiBoYW5kbGVyIChhYm92ZSksIHdoaWNoIHRocm93cyBhbiBlcnJvciB0ZWxsaW5nIHRoZSBjbGllbnQgdG9cbi8vIHRyeSB0aGUgU1JQIHVwZ3JhZGUgcGF0aC5cbi8vXG4vLyBYWFggQ09NUEFUIFdJVEggMC44LjEuM1xuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwYXNzd29yZDJcIiwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLnNycCB8fCAhb3B0aW9ucy5wYXNzd29yZDIpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBkb24ndCBoYW5kbGVcbiAgfVxuXG4gIGNoZWNrKG9wdGlvbnMsIHtcbiAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXG4gICAgc3JwOiBTdHJpbmcsXG4gICAgcGFzc3dvcmQyOiBwYXNzd29yZFZhbGlkYXRvclxuICB9KTtcblxuICB2YXIgdXNlciA9IEFjY291bnRzLl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zKG9wdGlvbnMudXNlcik7XG4gIGlmICghdXNlcikge1xuICAgIGhhbmRsZUVycm9yKFwiVXNlciBub3QgZm91bmRcIik7XG4gIH1cblxuICAvLyBDaGVjayB0byBzZWUgaWYgYW5vdGhlciBzaW11bHRhbmVvdXMgbG9naW4gaGFzIGFscmVhZHkgdXBncmFkZWRcbiAgLy8gdGhlIHVzZXIgcmVjb3JkIHRvIGJjcnlwdC5cbiAgaWYgKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZCAmJiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCkge1xuICAgIHJldHVybiBjaGVja1Bhc3N3b3JkKHVzZXIsIG9wdGlvbnMucGFzc3dvcmQyKTtcbiAgfVxuXG4gIGlmICghKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZCAmJiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycCkpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcbiAgfVxuXG4gIHZhciB2MSA9IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLnZlcmlmaWVyO1xuICB2YXIgdjIgPSBTUlAuZ2VuZXJhdGVWZXJpZmllcihcbiAgICBudWxsLFxuICAgIHtcbiAgICAgIGhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQ6IG9wdGlvbnMuc3JwLFxuICAgICAgc2FsdDogdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnAuc2FsdFxuICAgIH1cbiAgKS52ZXJpZmllcjtcbiAgaWYgKHYxICE9PSB2Mikge1xuICAgIHJldHVybiB7XG4gICAgICB1c2VySWQ6IEFjY291bnRzLl9vcHRpb25zLmFtYmlndW91c0Vycm9yTWVzc2FnZXMgPyBudWxsIDogdXNlci5faWQsXG4gICAgICBlcnJvcjogaGFuZGxlRXJyb3IoXCJJbmNvcnJlY3QgcGFzc3dvcmRcIiwgZmFsc2UpXG4gICAgfTtcbiAgfVxuXG4gIC8vIFVwZ3JhZGUgdG8gYmNyeXB0IG9uIHN1Y2Nlc3NmdWwgbG9naW4uXG4gIHZhciBzYWx0ZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZDIpO1xuICBNZXRlb3IudXNlcnMudXBkYXRlKFxuICAgIHVzZXIuX2lkLFxuICAgIHtcbiAgICAgICR1bnNldDogeyAnc2VydmljZXMucGFzc3dvcmQuc3JwJzogMSB9LFxuICAgICAgJHNldDogeyAnc2VydmljZXMucGFzc3dvcmQuYmNyeXB0Jzogc2FsdGVkIH1cbiAgICB9XG4gICk7XG5cbiAgcmV0dXJuIHt1c2VySWQ6IHVzZXIuX2lkfTtcbn0pOyIsIlBob25lID0gcmVxdWlyZSgncGhvbmUnKVxuXG5NZXRlb3IubWV0aG9kcyB1cGRhdGVQaG9uZTogKG9wdGlvbnMpIC0+XG5cdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxuXHR7IG51bWJlciB9ID0gb3B0aW9uc1xuXHRjaGVjayBudW1iZXIsIFN0cmluZ1xuXG5cdG51bWJlciA9IFBob25lKG51bWJlcilbMF1cblx0dW5sZXNzIG51bWJlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIilcblx0XHRyZXR1cm4gZmFsc2VcblxuXHRjdXJyZW50VXNlcklkID0gQHVzZXJJZFxuXHR1bmxlc3MgY3VycmVudFVzZXJJZFxuXHRcdHJldHVybiB0cnVlXG5cblx0Y3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKClcblx0Y3VycmVudE51bWJlciA9IGN1cnJlbnRVc2VyLnBob25lPy5udW1iZXJcblx0IyDmiYvmnLrlj7fkuI3lj5jvvIzliJnkuI3nlKjmm7TmlrBcblx0aWYgY3VycmVudE51bWJlciBhbmQgY3VycmVudE51bWJlciA9PSBudW1iZXJcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdHJlcGVhdE51bWJlclVzZXIgPSBkYi51c2Vycy5maW5kT25lKHsncGhvbmUubnVtYmVyJzpudW1iZXJ9LHtmaWVsZHM6e19pZDoxLHBob25lOjF9fSlcblx0aWYgcmVwZWF0TnVtYmVyVXNlclxuXHRcdGlmIHJlcGVhdE51bWJlclVzZXIucGhvbmU/LnZlcmlmaWVkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19waG9uZV9hbHJlYWR5X2V4aXN0ZWRcIilcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6c5Y+m5LiA5Liq55So5oi35omL5py65Y+35rKh5pyJ6aqM6K+B6YCa6L+H77yM5YiZ5riF6Zmk5YW26LSm5oi35LiL5omL5py65Y+355u45YWz5a2X5q61XG5cdFx0XHRkYi51c2Vycy51cGRhdGUge1xuXHRcdFx0XHRfaWQ6IHJlcGVhdE51bWJlclVzZXIuX2lkXG5cdFx0XHR9LCAkdW5zZXQ6IFwicGhvbmVcIjogMSxcInNlcnZpY2VzLnBob25lXCI6IDFcblxuXHRkYi51c2Vycy51cGRhdGUge1xuXHRcdF9pZDogY3VycmVudFVzZXJJZFxuXHR9LCAkc2V0OiBwaG9uZToge251bWJlcjogbnVtYmVyLCB2ZXJpZmllZDogZmFsc2V9XG5cblx0cmV0dXJuIHRydWVcblxuXG4iLCJ2YXIgUGhvbmU7XG5cblBob25lID0gcmVxdWlyZSgncGhvbmUnKTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICB1cGRhdGVQaG9uZTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjdXJyZW50TnVtYmVyLCBjdXJyZW50VXNlciwgY3VycmVudFVzZXJJZCwgbnVtYmVyLCByZWYsIHJlZjEsIHJlcGVhdE51bWJlclVzZXI7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBudW1iZXIgPSBvcHRpb25zLm51bWJlcjtcbiAgICBjaGVjayhudW1iZXIsIFN0cmluZyk7XG4gICAgbnVtYmVyID0gUGhvbmUobnVtYmVyKVswXTtcbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfaW52YWxpZFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY3VycmVudFVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmICghY3VycmVudFVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGN1cnJlbnRVc2VyID0gQWNjb3VudHMudXNlcigpO1xuICAgIGN1cnJlbnROdW1iZXIgPSAocmVmID0gY3VycmVudFVzZXIucGhvbmUpICE9IG51bGwgPyByZWYubnVtYmVyIDogdm9pZCAwO1xuICAgIGlmIChjdXJyZW50TnVtYmVyICYmIGN1cnJlbnROdW1iZXIgPT09IG51bWJlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJlcGVhdE51bWJlclVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICdwaG9uZS5udW1iZXInOiBudW1iZXJcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICBwaG9uZTogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXBlYXROdW1iZXJVc2VyKSB7XG4gICAgICBpZiAoKHJlZjEgPSByZXBlYXROdW1iZXJVc2VyLnBob25lKSAhPSBudWxsID8gcmVmMS52ZXJpZmllZCA6IHZvaWQgMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19waG9uZV9hbHJlYWR5X2V4aXN0ZWRcIik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiByZXBlYXROdW1iZXJVc2VyLl9pZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHVuc2V0OiB7XG4gICAgICAgICAgICBcInBob25lXCI6IDEsXG4gICAgICAgICAgICBcInNlcnZpY2VzLnBob25lXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiBjdXJyZW50VXNlcklkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBwaG9uZToge1xuICAgICAgICAgIG51bWJlcjogbnVtYmVyLFxuICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMgZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiAoZXhwaXJlZERheXMpIC0+XG5cdGNoZWNrIGV4cGlyZWREYXlzLCBOdW1iZXJcblxuXHRjdXJyZW50VXNlcklkID0gQHVzZXJJZFxuXHR1bmxlc3MgY3VycmVudFVzZXJJZFxuXHRcdHJldHVybiB0cnVlXG5cblx0Y3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKClcblx0dmVyaWZpZWQgPSBjdXJyZW50VXNlci5waG9uZT8udmVyaWZpZWRcblx0bW9kaWZpZWQgPSBjdXJyZW50VXNlci5waG9uZT8ubW9kaWZpZWRcblx0dW5sZXNzIHZlcmlmaWVkIG9yIG1vZGlmaWVkXG5cdFx0cmV0dXJuIHRydWVcblxuXHRub3cgPSBuZXcgRGF0ZSgpXG5cdG91dERheXMgPSBNYXRoLmZsb29yKChub3cuZ2V0VGltZSgpLW1vZGlmaWVkLmdldFRpbWUoKSkvKDI0ICogNjAgKiA2MCAqIDEwMDApKVxuXHRpZiBvdXREYXlzID49IGV4cGlyZWREYXlzXG5cdFx0ZGIudXNlcnMudXBkYXRlIHtcblx0XHRcdF9pZDogY3VycmVudFVzZXJJZFxuXHRcdH0sICRzZXQ6IFwicGhvbmUudmVyaWZpZWRcIjogZmFsc2VcblxuXHRyZXR1cm4gdHJ1ZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXM6IGZ1bmN0aW9uKGV4cGlyZWREYXlzKSB7XG4gICAgdmFyIGN1cnJlbnRVc2VyLCBjdXJyZW50VXNlcklkLCBtb2RpZmllZCwgbm93LCBvdXREYXlzLCByZWYsIHJlZjEsIHZlcmlmaWVkO1xuICAgIGNoZWNrKGV4cGlyZWREYXlzLCBOdW1iZXIpO1xuICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIWN1cnJlbnRVc2VySWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKTtcbiAgICB2ZXJpZmllZCA9IChyZWYgPSBjdXJyZW50VXNlci5waG9uZSkgIT0gbnVsbCA/IHJlZi52ZXJpZmllZCA6IHZvaWQgMDtcbiAgICBtb2RpZmllZCA9IChyZWYxID0gY3VycmVudFVzZXIucGhvbmUpICE9IG51bGwgPyByZWYxLm1vZGlmaWVkIDogdm9pZCAwO1xuICAgIGlmICghKHZlcmlmaWVkIHx8IG1vZGlmaWVkKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgb3V0RGF5cyA9IE1hdGguZmxvb3IoKG5vdy5nZXRUaW1lKCkgLSBtb2RpZmllZC5nZXRUaW1lKCkpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApKTtcbiAgICBpZiAob3V0RGF5cyA+PSBleHBpcmVkRGF5cykge1xuICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiBjdXJyZW50VXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBcInBob25lLnZlcmlmaWVkXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG4iLCJQaG9uZSA9IHJlcXVpcmUoJ3Bob25lJylcblxuTWV0ZW9yLm1ldGhvZHMgam9pblNwYWNlRnJvbUxvZ2luOiAob3B0aW9ucykgLT5cblx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XG5cdHsgc3BhY2VfbG9naW5lZCB9ID0gb3B0aW9uc1xuXHRjaGVjayBzcGFjZV9sb2dpbmVkLCBTdHJpbmdcblxuXHRjdXJyZW50VXNlcklkID0gQHVzZXJJZFxuXHR1bmxlc3MgY3VycmVudFVzZXJJZFxuXHRcdHJldHVybiB0cnVlXG5cblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9sb2dpbmVkKVxuXHR1bmxlc3Mgc3BhY2Vcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJzcGFjZV91c2Vyc19lcnJvcl9zcGFjZV9ub3RfZm91bmRcIilcblx0XHRyZXR1cm4gZmFsc2VcblxuXHRjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKVxuXHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2xvZ2luZWQsIHVzZXI6IGN1cnJlbnRVc2VyLl9pZH0pXG5cdGlmIHNwYWNlX3VzZXJcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdHVzZXJfZW1haWwgPSBjdXJyZW50VXNlci5lbWFpbHNbMF0uYWRkcmVzc1xuXHRyb290T3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTpzcGFjZV9sb2dpbmVkLCBwYXJlbnQ6IG51bGx9LHtmaWVsZHM6IHtfaWQ6MX19KVxuXHRkYi5zcGFjZV91c2Vycy5pbnNlcnRcblx0XHRlbWFpbDogdXNlcl9lbWFpbFxuXHRcdHVzZXI6IGN1cnJlbnRVc2VyLl9pZFxuXHRcdG5hbWU6IGN1cnJlbnRVc2VyLm5hbWVcblx0XHRvcmdhbml6YXRpb25zOiBbcm9vdE9yZy5faWRdXG5cdFx0c3BhY2U6IHNwYWNlX2xvZ2luZWRcblx0XHR1c2VyX2FjY2VwdGVkOiB0cnVlXG5cdFx0aXNfbG9naW5lZF9mcm9tX3NwYWNlOiB0cnVlXG5cblx0cmV0dXJuIHRydWVcblxuXG4iLCJ2YXIgUGhvbmU7XG5cblBob25lID0gcmVxdWlyZSgncGhvbmUnKTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICBqb2luU3BhY2VGcm9tTG9naW46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VySWQsIHJvb3RPcmcsIHNwYWNlLCBzcGFjZV9sb2dpbmVkLCBzcGFjZV91c2VyLCB1c2VyX2VtYWlsO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2VfbG9naW5lZCA9IG9wdGlvbnMuc3BhY2VfbG9naW5lZDtcbiAgICBjaGVjayhzcGFjZV9sb2dpbmVkLCBTdHJpbmcpO1xuICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIWN1cnJlbnRVc2VySWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2xvZ2luZWQpO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcInNwYWNlX3VzZXJzX2Vycm9yX3NwYWNlX25vdF9mb3VuZFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2xvZ2luZWQsXG4gICAgICB1c2VyOiBjdXJyZW50VXNlci5faWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHVzZXJfZW1haWwgPSBjdXJyZW50VXNlci5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICByb290T3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9sb2dpbmVkLFxuICAgICAgcGFyZW50OiBudWxsXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGRiLnNwYWNlX3VzZXJzLmluc2VydCh7XG4gICAgICBlbWFpbDogdXNlcl9lbWFpbCxcbiAgICAgIHVzZXI6IGN1cnJlbnRVc2VyLl9pZCxcbiAgICAgIG5hbWU6IGN1cnJlbnRVc2VyLm5hbWUsXG4gICAgICBvcmdhbml6YXRpb25zOiBbcm9vdE9yZy5faWRdLFxuICAgICAgc3BhY2U6IHNwYWNlX2xvZ2luZWQsXG4gICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlLFxuICAgICAgaXNfbG9naW5lZF9mcm9tX3NwYWNlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMgY2hlY2tVc2VyOiAob3B0aW9ucykgLT5cblx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XG5cdHsgY29tcGFueSxuYW1lLGVtYWlsLHBhc3N3b3JkLHByb2ZpbGUgfSA9IG9wdGlvbnNcblx0Y2hlY2sgY29tcGFueSwgU3RyaW5nXG5cdGNoZWNrIG5hbWUsIFN0cmluZ1xuXHRjaGVjayBlbWFpbCwgU3RyaW5nXG5cdGNoZWNrIHBhc3N3b3JkLCBPYmplY3Rcblx0Y2hlY2sgcHJvZmlsZSwgT2JqZWN0XG5cblx0dW5sZXNzIGNvbXBhbnlcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9jb21wYW55X2VtcHR5XCIpXG5cdFx0cmV0dXJuIGZhbHNlXG5cdHVubGVzcyBuYW1lXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfbmFtZV9lbXB0eVwiKVxuXHRcdHJldHVybiBmYWxzZVxuXHR1bmxlc3MgZW1haWxcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9lbWFpbF9lbXB0eVwiKVxuXHRcdHJldHVybiBmYWxzZVxuXHR1bmxlc3MgcGFzc3dvcmRcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9wYXNzd29yZF9lbXB0eVwiKVxuXHRcdHJldHVybiBmYWxzZVxuXG5cdGVtYWlsID0gZW1haWwudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2dtLCAnJylcblx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoeydlbWFpbHMuYWRkcmVzcyc6IGVtYWlsfSlcblx0aWYgdXNlclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX2VtYWlsX2V4aXN0XCIpXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0cmV0dXJuIHRydWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY2hlY2tVc2VyOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBhbnksIGVtYWlsLCBuYW1lLCBwYXNzd29yZCwgcHJvZmlsZSwgdXNlcjtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIGNvbXBhbnkgPSBvcHRpb25zLmNvbXBhbnksIG5hbWUgPSBvcHRpb25zLm5hbWUsIGVtYWlsID0gb3B0aW9ucy5lbWFpbCwgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkLCBwcm9maWxlID0gb3B0aW9ucy5wcm9maWxlO1xuICAgIGNoZWNrKGNvbXBhbnksIFN0cmluZyk7XG4gICAgY2hlY2sobmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhlbWFpbCwgU3RyaW5nKTtcbiAgICBjaGVjayhwYXNzd29yZCwgT2JqZWN0KTtcbiAgICBjaGVjayhwcm9maWxlLCBPYmplY3QpO1xuICAgIGlmICghY29tcGFueSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfY29tcGFueV9lbXB0eVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9uYW1lX2VtcHR5XCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWVtYWlsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9lbWFpbF9lbXB0eVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwYXNzd29yZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfcGFzc3dvcmRfZW1wdHlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVtYWlsID0gZW1haWwudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2dtLCAnJyk7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogZW1haWxcbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfZW1haWxfZXhpc3RcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbiJdfQ==
