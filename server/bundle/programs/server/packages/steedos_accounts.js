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
      return document.location.href = Steedos.absoluteUrl("/");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9saWIvVVJJLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9mb3JjZV9iaW5kX3Bob25lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2ZvcmNlX2JpbmRfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YWNjb3VudHMvcGFzc3dvcmRfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvZGlzYWJsZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2Rpc2FibGVfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvY2hlY2tfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2NoZWNrX3VzZXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImNvb2tpZXMiLCJwaG9uZSIsInNoYTI1NiIsInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiVVJJIiwicHVueWNvZGUiLCJJUHY2IiwiU2Vjb25kTGV2ZWxEb21haW5zIiwiU0xEIiwiX1VSSSIsInVybCIsImJhc2UiLCJfdXJsU3VwcGxpZWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJfYmFzZVN1cHBsaWVkIiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwibG9jYXRpb24iLCJocmVmIiwiYWJzb2x1dGVUbyIsInZlcnNpb24iLCJwIiwicHJvdG90eXBlIiwiaGFzT3duIiwiT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJlc2NhcGVSZWdFeCIsInN0cmluZyIsInJlcGxhY2UiLCJnZXRUeXBlIiwidmFsdWUiLCJTdHJpbmciLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsImlzQXJyYXkiLCJvYmoiLCJmaWx0ZXJBcnJheVZhbHVlcyIsImRhdGEiLCJsb29rdXAiLCJpIiwiX21hdGNoIiwidGVzdCIsInNwbGljZSIsImFycmF5Q29udGFpbnMiLCJsaXN0IiwiX3R5cGUiLCJtYXRjaCIsImFycmF5c0VxdWFsIiwib25lIiwidHdvIiwic29ydCIsImwiLCJ0cmltU2xhc2hlcyIsInRleHQiLCJ0cmltX2V4cHJlc3Npb24iLCJfcGFydHMiLCJwcm90b2NvbCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJob3N0bmFtZSIsInVybiIsInBvcnQiLCJwYXRoIiwicXVlcnkiLCJmcmFnbWVudCIsImR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyIsImVzY2FwZVF1ZXJ5U3BhY2UiLCJwcm90b2NvbF9leHByZXNzaW9uIiwiaWRuX2V4cHJlc3Npb24iLCJwdW55Y29kZV9leHByZXNzaW9uIiwiaXA0X2V4cHJlc3Npb24iLCJpcDZfZXhwcmVzc2lvbiIsImZpbmRfdXJpX2V4cHJlc3Npb24iLCJmaW5kVXJpIiwic3RhcnQiLCJlbmQiLCJ0cmltIiwiZGVmYXVsdFBvcnRzIiwiaHR0cCIsImh0dHBzIiwiZnRwIiwiZ29waGVyIiwid3MiLCJ3c3MiLCJpbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMiLCJkb21BdHRyaWJ1dGVzIiwiZ2V0RG9tQXR0cmlidXRlIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJ0eXBlIiwiZXNjYXBlRm9yRHVtYkZpcmVmb3gzNiIsImVzY2FwZSIsInN0cmljdEVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZSIsImRlY29kZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImlzbzg4NTkiLCJ1bmVzY2FwZSIsInVuaWNvZGUiLCJjaGFyYWN0ZXJzIiwicGF0aG5hbWUiLCJleHByZXNzaW9uIiwibWFwIiwicmVzZXJ2ZWQiLCJ1cm5wYXRoIiwiZW5jb2RlUXVlcnkiLCJlc2NhcGVkIiwiZGVjb2RlUXVlcnkiLCJlIiwiX3BhcnQiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiX2dyb3VwIiwiYyIsImdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uIiwiX3NlcCIsIl9jb2RpbmdGdW5jTmFtZSIsIl9pbm5lckNvZGluZ0Z1bmNOYW1lIiwiYWN0dWFsQ29kaW5nRnVuYyIsInNlZ21lbnRzIiwic3BsaXQiLCJqb2luIiwiZGVjb2RlUGF0aCIsImRlY29kZVVyblBhdGgiLCJyZWNvZGVQYXRoIiwicmVjb2RlVXJuUGF0aCIsImVuY29kZVJlc2VydmVkIiwicGFyc2UiLCJwYXJ0cyIsInBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJwYXJzZUF1dGhvcml0eSIsInBhcnNlSG9zdCIsImJyYWNrZXRQb3MiLCJ0IiwiY2hhckF0IiwiZmlyc3RDb2xvbiIsImZpcnN0U2xhc2giLCJuZXh0Q29sb24iLCJwYXJzZVVzZXJpbmZvIiwibGFzdEluZGV4T2YiLCJzaGlmdCIsInBhcnNlUXVlcnkiLCJpdGVtcyIsInNwbGl0cyIsIm5hbWUiLCJwdXNoIiwiYnVpbGQiLCJidWlsZEF1dGhvcml0eSIsImJ1aWxkSG9zdCIsImJ1aWxkVXNlcmluZm8iLCJidWlsZFF1ZXJ5IiwidW5pcXVlIiwia2V5IiwiYnVpbGRRdWVyeVBhcmFtZXRlciIsImFkZFF1ZXJ5IiwiY29uY2F0IiwicmVtb3ZlUXVlcnkiLCJoYXNRdWVyeSIsIndpdGhpbkFycmF5IiwiX2Jvb2x5IiwiQm9vbGVhbiIsIm9wIiwiY29tbW9uUGF0aCIsIk1hdGgiLCJtaW4iLCJ3aXRoaW5TdHJpbmciLCJjYWxsYmFjayIsIm9wdGlvbnMiLCJfc3RhcnQiLCJfZW5kIiwiX3RyaW0iLCJfYXR0cmlidXRlT3BlbiIsImxhc3RJbmRleCIsImV4ZWMiLCJpbmRleCIsImlnbm9yZUh0bWwiLCJhdHRyaWJ1dGVPcGVuIiwibWF4Iiwic2VhcmNoIiwiaWdub3JlIiwicmVzdWx0IiwiZW5zdXJlVmFsaWRIb3N0bmFtZSIsInRvQVNDSUkiLCJub0NvbmZsaWN0IiwicmVtb3ZlQWxsIiwidW5jb25mbGljdGVkIiwiVVJJVGVtcGxhdGUiLCJkZWZlckJ1aWxkIiwiX2RlZmVycmVkX2J1aWxkIiwiX3N0cmluZyIsImNsb25lIiwidmFsdWVPZiIsImdlbmVyYXRlU2ltcGxlQWNjZXNzb3IiLCJnZW5lcmF0ZVByZWZpeEFjY2Vzc29yIiwiX2tleSIsImhhc2giLCJyZXMiLCJfb2JqZWN0IiwiYXR0cmlidXRlIiwic3JjIiwiaXMiLCJ3aGF0IiwiaXAiLCJpcDQiLCJpcDYiLCJzbGQiLCJpZG4iLCJyZWxhdGl2ZSIsImhhcyIsIl9wcm90b2NvbCIsIl9wb3J0IiwiX2hvc3RuYW1lIiwic2NoZW1lIiwieCIsIm9yaWdpbiIsImF1dGhvcml0eSIsImhvc3QiLCJ1c2VyaW5mbyIsInJlc291cmNlIiwic3ViZG9tYWluIiwiZG9tYWluIiwic3ViIiwiUmVnRXhwIiwidGxkIiwiZ2V0IiwiUmVmZXJlbmNlRXJyb3IiLCJkaXJlY3RvcnkiLCJmaWxlbmFtZSIsImRlY29kZVBhdGhTZWdtZW50IiwibXV0YXRlZERpcmVjdG9yeSIsIm5vcm1hbGl6ZVBhdGgiLCJzdWZmaXgiLCJzIiwic2VnbWVudCIsInNlcGFyYXRvciIsImFic29sdXRlIiwiRXJyb3IiLCJwb3AiLCJ1bnNoaWZ0Iiwic2VnbWVudENvZGVkIiwicSIsInNldFF1ZXJ5Iiwic2V0U2VhcmNoIiwiYWRkU2VhcmNoIiwicmVtb3ZlU2VhcmNoIiwiaGFzU2VhcmNoIiwibm9ybWFsaXplIiwibm9ybWFsaXplUHJvdG9jb2wiLCJub3JtYWxpemVRdWVyeSIsIm5vcm1hbGl6ZUZyYWdtZW50Iiwibm9ybWFsaXplSG9zdG5hbWUiLCJub3JtYWxpemVQb3J0IiwiYmVzdCIsIl9wYXRoIiwiX3dhc19yZWxhdGl2ZSIsIl9sZWFkaW5nUGFyZW50cyIsIl9wYXJlbnQiLCJfcG9zIiwibm9ybWFsaXplUGF0aG5hbWUiLCJub3JtYWxpemVTZWFyY2giLCJub3JtYWxpemVIYXNoIiwiZCIsInJlYWRhYmxlIiwidXJpIiwidG9Vbmljb2RlIiwicXAiLCJrdiIsInJlc29sdmVkIiwicHJvcGVydGllcyIsImJhc2VkaXIiLCJyZWxhdGl2ZVRvIiwicmVsYXRpdmVQYXJ0cyIsImJhc2VQYXJ0cyIsImNvbW1vbiIsInJlbGF0aXZlUGF0aCIsImJhc2VQYXRoIiwicGFyZW50cyIsImVxdWFscyIsIm9uZV9tYXAiLCJ0d29fbWFwIiwiY2hlY2tlZCIsIm9uZV9xdWVyeSIsInR3b19xdWVyeSIsIlN0ZWVkb3MiLCJNZXRlb3IiLCJhYnNvbHV0ZVVybCIsIl8iLCJleHRlbmQiLCJBY2NvdW50cyIsInVwZGF0ZVBob25lIiwibnVtYmVyIiwiaXNTZXJ2ZXIiLCJpc0NsaWVudCIsImRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cyIsImV4cGlyZWREYXlzIiwiZ2V0UGhvbmVOdW1iZXIiLCJpc0luY2x1ZGVQcmVmaXgiLCJ1c2VyIiwicmVmIiwicmVmMSIsImRiIiwidXNlcnMiLCJmaW5kT25lIiwibW9iaWxlIiwiRTE2NCIsImdldFBob25lTnVtYmVyV2l0aG91dFByZWZpeCIsImdldFBob25lUHJlZml4IiwicHJlZml4IiwiY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCIsInJlZjIiLCJzZXR0aW5ncyIsImZvcmNlQWNjb3VudEJpbmRQaG9uZSIsIm1ldGhvZHMiLCJjaGVja0ZvcmNlQmluZFBob25lIiwic3BhY2VzIiwibm9Gb3JjZVVzZXJzIiwic3BhY2Vfc2V0dGluZ3MiLCJjaGVjayIsIkFycmF5IiwiZmluZCIsInNwYWNlIiwiJGluIiwiZm9yRWFjaCIsIm4iLCJyZWYzIiwidmFsdWVzIiwidW5pb24iLCJ1c2VySWQiLCJpc0ZvcmNlQmluZFBob25lIiwicmVmNCIsInJlZjUiLCJpc01vYmlsZSIsIm9uTG9naW4iLCJpc1Bob25lVmVyaWZpZWQiLCJzZXRUaW1lb3V0IiwiZmV0Y2giLCJnZXRQcm9wZXJ0eSIsImVycm9yIiwicmVzdWx0cyIsInJvdXRlclBhdGgiLCJzZXR1cFVybCIsInRvYXN0ciIsInJlYXNvbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImN1cnJlbnQiLCJjbG9zZUJ1dHRvbiIsInRpbWVPdXQiLCJleHRlbmRlZFRpbWVPdXQiLCJvbmNsaWNrIiwib3BlbldpbmRvdyIsInB3ZEZpZWxkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwiUGFja2FnZSIsIkFjY291bnRzVGVtcGxhdGVzIiwiY29uZmlndXJlIiwiZGVmYXVsdExheW91dCIsImRlZmF1bHRMYXlvdXRSZWdpb25zIiwibmF2IiwiZGVmYXVsdENvbnRlbnRSZWdpb24iLCJzaG93Rm9yZ290UGFzc3dvcmRMaW5rIiwib3ZlcnJpZGVMb2dpbkVycm9ycyIsImVuYWJsZVBhc3N3b3JkQ2hhbmdlIiwiaG9tZVJvdXRlUGF0aCIsIm5lZ2F0aXZlVmFsaWRhdGlvbiIsInBvc2l0aXZlVmFsaWRhdGlvbiIsIm5lZ2F0aXZlRmVlZGJhY2siLCJwb3NpdGl2ZUZlZWRiYWNrIiwic2hvd0xhYmVscyIsInByZVNpZ25VcEhvb2siLCJwcm9maWxlIiwibG9jYWxlIiwiZ2V0TG9jYWxlIiwiY29uZmlndXJlUm91dGUiLCJyZWRpcmVjdCIsInF1ZXJ5UGFyYW1zIiwiZG9jdW1lbnQiLCJlbWFpbCIsImVtYWlscyIsImFkZHJlc3MiLCIkIiwiYm9keSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJtZXNzYWdlIiwicmVtb3ZlRmllbGQiLCJhZGRGaWVsZHMiLCJfaWQiLCJyZXF1aXJlZCIsImRpc3BsYXlOYW1lIiwicmUiLCJlcnJTdHIiLCJwbGFjZWhvbGRlciIsImZvcmdvdFB3ZCIsIm1pbkxlbmd0aCIsImVtYWlsVGVtcGxhdGVzIiwic2l0ZU5hbWUiLCJmcm9tIiwiYWNjb3VudHMiLCJkaXNhYmxlQWNjb3VudFJlZ2lzdHJhdGlvbiIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImJjcnlwdCIsIk5wbU1vZHVsZUJjcnlwdCIsImJjcnlwdEhhc2giLCJ3cmFwQXN5bmMiLCJiY3J5cHRDb21wYXJlIiwiY29tcGFyZSIsInBhc3N3b3JkVmFsaWRhdG9yIiwiTWF0Y2giLCJPbmVPZiIsImRpZ2VzdCIsImFsZ29yaXRobSIsImNoZWNrUGFzc3dvcmQiLCJfY2hlY2tQYXNzd29yZCIsImdldFBhc3N3b3JkU3RyaW5nIiwiU0hBMjU2IiwiaGFzaFBhc3N3b3JkIiwiX2JjcnlwdFJvdW5kcyIsImhhbmRsZUVycm9yIiwibXNnIiwidGhyb3dFcnJvciIsIl9vcHRpb25zIiwiYW1iaWd1b3VzRXJyb3JNZXNzYWdlcyIsImdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyIsInBlcm11dGF0aW9ucyIsImNoIiwiZmxhdHRlbiIsImxvd2VyQ2FzZUNoYXIiLCJ1cHBlckNhc2VDaGFyIiwidG9VcHBlckNhc2UiLCJzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAiLCJmaWVsZE5hbWUiLCJvckNsYXVzZSIsInByZWZpeFBlcm11dGF0aW9uIiwic2VsZWN0b3IiLCJfZXNjYXBlUmVnRXhwIiwiY2FzZUluc2Vuc2l0aXZlQ2xhdXNlIiwiJGFuZCIsIiRvciIsIl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zIiwiaWQiLCJmaWVsZFZhbHVlIiwiY2FuZGlkYXRlVXNlcnMiLCJOb25FbXB0eVN0cmluZyIsIldoZXJlIiwidXNlclF1ZXJ5VmFsaWRhdG9yIiwiT3B0aW9uYWwiLCJrZXlzIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJwYXNzd29yZDIiLCJzcnAiLCJzZXJ2aWNlcyIsInZlcmlmaWVyIiwibmV3VmVyaWZpZXIiLCJTUlAiLCJnZW5lcmF0ZVZlcmlmaWVyIiwiaWRlbnRpdHkiLCJzYWx0IiwiRUpTT04iLCJzdHJpbmdpZnkiLCJmb3JtYXQiLCJ2MSIsInYyIiwiaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCIsInNhbHRlZCIsInVwZGF0ZSIsIiR1bnNldCIsIiRzZXQiLCJQaG9uZSIsInJlcXVpcmUiLCJjdXJyZW50TnVtYmVyIiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlcklkIiwicmVwZWF0TnVtYmVyVXNlciIsImZpZWxkcyIsInZlcmlmaWVkIiwibW9kaWZpZWQiLCJub3ciLCJvdXREYXlzIiwiTnVtYmVyIiwiRGF0ZSIsImZsb29yIiwiZ2V0VGltZSIsImpvaW5TcGFjZUZyb21Mb2dpbiIsInJvb3RPcmciLCJzcGFjZV9sb2dpbmVkIiwic3BhY2VfdXNlciIsInVzZXJfZW1haWwiLCJzcGFjZV91c2VycyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnQiLCJpbnNlcnQiLCJ1c2VyX2FjY2VwdGVkIiwiaXNfbG9naW5lZF9mcm9tX3NwYWNlIiwiY2hlY2tVc2VyIiwiY29tcGFueSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUFBQyx3QkFBa0I4RTtBQUFuQixLQUFqQixDQUFQOztBQUNBLFFBQUduRixJQUFIO0FBQ0MsWUFBTSxJQUFJYixPQUFPaEQsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwrQkFBdEIsQ0FBTjtBQUNBLGFBQU8sS0FBUDtBQ09HOztBRExKLFdBQU8sSUFBUDtBQTVCYztBQUFBLENBQWYsRSIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19hY2NvdW50cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0Y2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxyXG5cdHBob25lOiBcIl4xLjAuMTJcIixcclxuXHRzaGEyNTY6IFwiXjAuMi4wXCJcclxufSwgJ3N0ZWVkb3M6YWNjb3VudHMnKTsiLCIvKiFcclxuICogVVJJLmpzIC0gTXV0YXRpbmcgVVJMc1xyXG4gKlxyXG4gKiBWZXJzaW9uOiAxLjE3LjBcclxuICpcclxuICogQXV0aG9yOiBSb2RuZXkgUmVobVxyXG4gKiBXZWI6IGh0dHA6Ly9tZWRpYWxpemUuZ2l0aHViLmlvL1VSSS5qcy9cclxuICpcclxuICogTGljZW5zZWQgdW5kZXJcclxuICogICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlXHJcbiAqICAgR1BMIHYzIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9HUEwtMy4wXHJcbiAqXHJcbiAqL1xyXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcclxuICAndXNlIHN0cmljdCc7XHJcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXHJcbiAgLy8gaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xyXG4gIC8vICAgLy8gTm9kZVxyXG4gIC8vICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJy4vcHVueWNvZGUnKSwgcmVxdWlyZSgnLi9JUHY2JyksIHJlcXVpcmUoJy4vU2Vjb25kTGV2ZWxEb21haW5zJykpO1xyXG4gIC8vIH0gZWxzZVxyXG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcclxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cclxuICAgIGRlZmluZShbJy4vcHVueWNvZGUnLCAnLi9JUHY2JywgJy4vU2Vjb25kTGV2ZWxEb21haW5zJ10sIGZhY3RvcnkpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxyXG4gICAgcm9vdC5VUkkgPSBmYWN0b3J5KHJvb3QucHVueWNvZGUsIHJvb3QuSVB2Niwgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMsIHJvb3QpO1xyXG4gIH1cclxufSh0aGlzLCBmdW5jdGlvbiAocHVueWNvZGUsIElQdjYsIFNMRCwgcm9vdCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuICAvKmdsb2JhbCBsb2NhdGlvbiwgZXNjYXBlLCB1bmVzY2FwZSAqL1xyXG4gIC8vIEZJWE1FOiB2Mi4wLjAgcmVuYW1jZSBub24tY2FtZWxDYXNlIHByb3BlcnRpZXMgdG8gdXBwZXJjYXNlXHJcbiAgLypqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZSAqL1xyXG5cclxuICAvLyBzYXZlIGN1cnJlbnQgVVJJIHZhcmlhYmxlLCBpZiBhbnlcclxuICB2YXIgX1VSSSA9IHJvb3QgJiYgcm9vdC5VUkk7XHJcblxyXG4gIGZ1bmN0aW9uIFVSSSh1cmwsIGJhc2UpIHtcclxuICAgIHZhciBfdXJsU3VwcGxpZWQgPSBhcmd1bWVudHMubGVuZ3RoID49IDE7XHJcbiAgICB2YXIgX2Jhc2VTdXBwbGllZCA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMjtcclxuXHJcbiAgICAvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgdGhlICduZXcnIGtleXdvcmRcclxuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBVUkkpKSB7XHJcbiAgICAgIGlmIChfdXJsU3VwcGxpZWQpIHtcclxuICAgICAgICBpZiAoX2Jhc2VTdXBwbGllZCkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBVUkkodXJsLCBiYXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVVJJKHVybCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBuZXcgVVJJKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVybCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmIChfdXJsU3VwcGxpZWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmRlZmluZWQgaXMgbm90IGEgdmFsaWQgYXJndW1lbnQgZm9yIFVSSScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHVybCA9IGxvY2F0aW9uLmhyZWYgKyAnJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB1cmwgPSAnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaHJlZih1cmwpO1xyXG5cclxuICAgIC8vIHJlc29sdmUgdG8gYmFzZSBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCNjb25zdHJ1Y3RvclxyXG4gICAgaWYgKGJhc2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hYnNvbHV0ZVRvKGJhc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgVVJJLnZlcnNpb24gPSAnMS4xNy4wJztcclxuXHJcbiAgdmFyIHAgPSBVUkkucHJvdG90eXBlO1xyXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xyXG5cclxuICBmdW5jdGlvbiBlc2NhcGVSZWdFeChzdHJpbmcpIHtcclxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2NvbW1pdC84NWFjMjE3ODNjMTFmOGNjYWIwNjEwNmRiYTk3MzVhMzFhODY5MjRkI2NvbW1pdGNvbW1lbnQtODIxOTYzXHJcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldFR5cGUodmFsdWUpIHtcclxuICAgIC8vIElFOCBkb2Vzbid0IHJldHVybiBbT2JqZWN0IFVuZGVmaW5lZF0gYnV0IFtPYmplY3QgT2JqZWN0XSBmb3IgdW5kZWZpbmVkIHZhbHVlXHJcbiAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gJ1VuZGVmaW5lZCc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFN0cmluZyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpKS5zbGljZSg4LCAtMSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xyXG4gICAgcmV0dXJuIGdldFR5cGUob2JqKSA9PT0gJ0FycmF5JztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGZpbHRlckFycmF5VmFsdWVzKGRhdGEsIHZhbHVlKSB7XHJcbiAgICB2YXIgbG9va3VwID0ge307XHJcbiAgICB2YXIgaSwgbGVuZ3RoO1xyXG5cclxuICAgIGlmIChnZXRUeXBlKHZhbHVlKSA9PT0gJ1JlZ0V4cCcpIHtcclxuICAgICAgbG9va3VwID0gbnVsbDtcclxuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gdmFsdWUubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBsb29rdXBbdmFsdWVbaV1dID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbG9va3VwW3ZhbHVlXSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZGF0YS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAvKmpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xyXG4gICAgICB2YXIgX21hdGNoID0gbG9va3VwICYmIGxvb2t1cFtkYXRhW2ldXSAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgfHwgIWxvb2t1cCAmJiB2YWx1ZS50ZXN0KGRhdGFbaV0pO1xyXG4gICAgICAvKmpzaGludCBsYXhicmVhazogZmFsc2UgKi9cclxuICAgICAgaWYgKF9tYXRjaCkge1xyXG4gICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgIGxlbmd0aC0tO1xyXG4gICAgICAgIGktLTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYXJyYXlDb250YWlucyhsaXN0LCB2YWx1ZSkge1xyXG4gICAgdmFyIGksIGxlbmd0aDtcclxuXHJcbiAgICAvLyB2YWx1ZSBtYXkgYmUgc3RyaW5nLCBudW1iZXIsIGFycmF5LCByZWdleHBcclxuICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAvLyBOb3RlOiB0aGlzIGNhbiBiZSBvcHRpbWl6ZWQgdG8gTyhuKSAoaW5zdGVhZCBvZiBjdXJyZW50IE8obSAqIG4pKVxyXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICghYXJyYXlDb250YWlucyhsaXN0LCB2YWx1ZVtpXSkpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBfdHlwZSA9IGdldFR5cGUodmFsdWUpO1xyXG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gbGlzdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoX3R5cGUgPT09ICdSZWdFeHAnKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0W2ldID09PSAnc3RyaW5nJyAmJiBsaXN0W2ldLm1hdGNoKHZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGxpc3RbaV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhcnJheXNFcXVhbChvbmUsIHR3bykge1xyXG4gICAgaWYgKCFpc0FycmF5KG9uZSkgfHwgIWlzQXJyYXkodHdvKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYXJyYXlzIGNhbid0IGJlIGVxdWFsIGlmIHRoZXkgaGF2ZSBkaWZmZXJlbnQgYW1vdW50IG9mIGNvbnRlbnRcclxuICAgIGlmIChvbmUubGVuZ3RoICE9PSB0d28ubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBvbmUuc29ydCgpO1xyXG4gICAgdHdvLnNvcnQoKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9uZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcclxuICAgICAgaWYgKG9uZVtpXSAhPT0gdHdvW2ldKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB0cmltU2xhc2hlcyh0ZXh0KSB7XHJcbiAgICB2YXIgdHJpbV9leHByZXNzaW9uID0gL15cXC8rfFxcLyskL2c7XHJcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKHRyaW1fZXhwcmVzc2lvbiwgJycpO1xyXG4gIH1cclxuXHJcbiAgVVJJLl9wYXJ0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcHJvdG9jb2w6IG51bGwsXHJcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxyXG4gICAgICBwYXNzd29yZDogbnVsbCxcclxuICAgICAgaG9zdG5hbWU6IG51bGwsXHJcbiAgICAgIHVybjogbnVsbCxcclxuICAgICAgcG9ydDogbnVsbCxcclxuICAgICAgcGF0aDogbnVsbCxcclxuICAgICAgcXVlcnk6IG51bGwsXHJcbiAgICAgIGZyYWdtZW50OiBudWxsLFxyXG4gICAgICAvLyBzdGF0ZVxyXG4gICAgICBkdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnM6IFVSSS5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsXHJcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2U6IFVSSS5lc2NhcGVRdWVyeVNwYWNlXHJcbiAgICB9O1xyXG4gIH07XHJcbiAgLy8gc3RhdGU6IGFsbG93IGR1cGxpY2F0ZSBxdWVyeSBwYXJhbWV0ZXJzIChhPTEmYT0xKVxyXG4gIFVSSS5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSBmYWxzZTtcclxuICAvLyBzdGF0ZTogcmVwbGFjZXMgKyB3aXRoICUyMCAoc3BhY2UgaW4gcXVlcnkgc3RyaW5ncylcclxuICBVUkkuZXNjYXBlUXVlcnlTcGFjZSA9IHRydWU7XHJcbiAgLy8gc3RhdGljIHByb3BlcnRpZXNcclxuICBVUkkucHJvdG9jb2xfZXhwcmVzc2lvbiA9IC9eW2Etel1bYS16MC05ListXSokL2k7XHJcbiAgVVJJLmlkbl9leHByZXNzaW9uID0gL1teYS16MC05XFwuLV0vaTtcclxuICBVUkkucHVueWNvZGVfZXhwcmVzc2lvbiA9IC8oeG4tLSkvaTtcclxuICAvLyB3ZWxsLCAzMzMuNDQ0LjU1NS42NjYgbWF0Y2hlcywgYnV0IGl0IHN1cmUgYWluJ3Qgbm8gSVB2NCAtIGRvIHdlIGNhcmU/XHJcbiAgVVJJLmlwNF9leHByZXNzaW9uID0gL15cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfSQvO1xyXG4gIC8vIGNyZWRpdHMgdG8gUmljaCBCcm93blxyXG4gIC8vIHNvdXJjZTogaHR0cDovL2ZvcnVtcy5pbnRlcm1hcHBlci5jb20vdmlld3RvcGljLnBocD9wPTEwOTYjMTA5NlxyXG4gIC8vIHNwZWNpZmljYXRpb246IGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQyOTEudHh0XHJcbiAgVVJJLmlwNl9leHByZXNzaW9uID0gL15cXHMqKCgoWzAtOUEtRmEtZl17MSw0fTopezd9KFswLTlBLUZhLWZdezEsNH18OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezZ9KDpbMC05QS1GYS1mXXsxLDR9fCgoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwyfSl8OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7NH0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSwzfSl8KCg6WzAtOUEtRmEtZl17MSw0fSk/OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezN9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNH0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsMn06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7Mn0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw1fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCwzfTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXsxfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDZ9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDR9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCg6KCgoOlswLTlBLUZhLWZdezEsNH0pezEsN30pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsNX06KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSkpKCUuKyk/XFxzKiQvO1xyXG4gIC8vIGV4cHJlc3Npb24gdXNlZCBpcyBcImdydWJlciByZXZpc2VkXCIgKEBncnViZXIgdjIpIGRldGVybWluZWQgdG8gYmUgdGhlXHJcbiAgLy8gYmVzdCBzb2x1dGlvbiBpbiBhIHJlZ2V4LWdvbGYgd2UgZGlkIGEgY291cGxlIG9mIGFnZXMgYWdvIGF0XHJcbiAgLy8gKiBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9kZW1vL3VybC1yZWdleFxyXG4gIC8vICogaHR0cDovL3JvZG5leXJlaG0uZGUvdC91cmwtcmVnZXguaHRtbFxyXG4gIFVSSS5maW5kX3VyaV9leHByZXNzaW9uID0gL1xcYigoPzpbYS16XVtcXHctXSs6KD86XFwvezEsM318W2EtejAtOSVdKXx3d3dcXGR7MCwzfVsuXXxbYS16MC05LlxcLV0rWy5dW2Etel17Miw0fVxcLykoPzpbXlxccygpPD5dK3xcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpKSsoPzpcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpfFteXFxzYCEoKVxcW1xcXXt9OzonXCIuLDw+P8KrwrvigJzigJ3igJjigJldKSkvaWc7XHJcbiAgVVJJLmZpbmRVcmkgPSB7XHJcbiAgICAvLyB2YWxpZCBcInNjaGVtZTovL1wiIG9yIFwid3d3LlwiXHJcbiAgICBzdGFydDogL1xcYig/OihbYS16XVthLXowLTkuKy1dKjpcXC9cXC8pfHd3d1xcLikvZ2ksXHJcbiAgICAvLyBldmVyeXRoaW5nIHVwIHRvIHRoZSBuZXh0IHdoaXRlc3BhY2VcclxuICAgIGVuZDogL1tcXHNcXHJcXG5dfCQvLFxyXG4gICAgLy8gdHJpbSB0cmFpbGluZyBwdW5jdHVhdGlvbiBjYXB0dXJlZCBieSBlbmQgUmVnRXhwXHJcbiAgICB0cmltOiAvW2AhKClcXFtcXF17fTs6J1wiLiw8Pj/Cq8K74oCc4oCd4oCe4oCY4oCZXSskL1xyXG4gIH07XHJcbiAgLy8gaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy91cmktc2NoZW1lcy5odG1sXHJcbiAgLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9MaXN0X29mX1RDUF9hbmRfVURQX3BvcnRfbnVtYmVycyNXZWxsLWtub3duX3BvcnRzXHJcbiAgVVJJLmRlZmF1bHRQb3J0cyA9IHtcclxuICAgIGh0dHA6ICc4MCcsXHJcbiAgICBodHRwczogJzQ0MycsXHJcbiAgICBmdHA6ICcyMScsXHJcbiAgICBnb3BoZXI6ICc3MCcsXHJcbiAgICB3czogJzgwJyxcclxuICAgIHdzczogJzQ0MydcclxuICB9O1xyXG4gIC8vIGFsbG93ZWQgaG9zdG5hbWUgY2hhcmFjdGVycyBhY2NvcmRpbmcgdG8gUkZDIDM5ODZcclxuICAvLyBBTFBIQSBESUdJVCBcIi1cIiBcIi5cIiBcIl9cIiBcIn5cIiBcIiFcIiBcIiRcIiBcIiZcIiBcIidcIiBcIihcIiBcIilcIiBcIipcIiBcIitcIiBcIixcIiBcIjtcIiBcIj1cIiAlZW5jb2RlZFxyXG4gIC8vIEkndmUgbmV2ZXIgc2VlbiBhIChub24tSUROKSBob3N0bmFtZSBvdGhlciB0aGFuOiBBTFBIQSBESUdJVCAuIC1cclxuICBVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzID0gL1teYS16QS1aMC05XFwuLV0vO1xyXG4gIC8vIG1hcCBET00gRWxlbWVudHMgdG8gdGhlaXIgVVJJIGF0dHJpYnV0ZVxyXG4gIFVSSS5kb21BdHRyaWJ1dGVzID0ge1xyXG4gICAgJ2EnOiAnaHJlZicsXHJcbiAgICAnYmxvY2txdW90ZSc6ICdjaXRlJyxcclxuICAgICdsaW5rJzogJ2hyZWYnLFxyXG4gICAgJ2Jhc2UnOiAnaHJlZicsXHJcbiAgICAnc2NyaXB0JzogJ3NyYycsXHJcbiAgICAnZm9ybSc6ICdhY3Rpb24nLFxyXG4gICAgJ2ltZyc6ICdzcmMnLFxyXG4gICAgJ2FyZWEnOiAnaHJlZicsXHJcbiAgICAnaWZyYW1lJzogJ3NyYycsXHJcbiAgICAnZW1iZWQnOiAnc3JjJyxcclxuICAgICdzb3VyY2UnOiAnc3JjJyxcclxuICAgICd0cmFjayc6ICdzcmMnLFxyXG4gICAgJ2lucHV0JzogJ3NyYycsIC8vIGJ1dCBvbmx5IGlmIHR5cGU9XCJpbWFnZVwiXHJcbiAgICAnYXVkaW8nOiAnc3JjJyxcclxuICAgICd2aWRlbyc6ICdzcmMnXHJcbiAgfTtcclxuICBVUkkuZ2V0RG9tQXR0cmlidXRlID0gZnVuY3Rpb24obm9kZSkge1xyXG4gICAgaWYgKCFub2RlIHx8ICFub2RlLm5vZGVOYW1lKSB7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG5vZGVOYW1lID0gbm9kZS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgLy8gPGlucHV0PiBzaG91bGQgb25seSBleHBvc2Ugc3JjIGZvciB0eXBlPVwiaW1hZ2VcIlxyXG4gICAgaWYgKG5vZGVOYW1lID09PSAnaW5wdXQnICYmIG5vZGUudHlwZSAhPT0gJ2ltYWdlJykge1xyXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBVUkkuZG9tQXR0cmlidXRlc1tub2RlTmFtZV07XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZXNjYXBlRm9yRHVtYkZpcmVmb3gzNih2YWx1ZSkge1xyXG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzkxXHJcbiAgICByZXR1cm4gZXNjYXBlKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8vIGVuY29kaW5nIC8gZGVjb2RpbmcgYWNjb3JkaW5nIHRvIFJGQzM5ODZcclxuICBmdW5jdGlvbiBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKSB7XHJcbiAgICAvLyBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9lbmNvZGVVUklDb21wb25lbnRcclxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKVxyXG4gICAgICAucmVwbGFjZSgvWyEnKCkqXS9nLCBlc2NhcGVGb3JEdW1iRmlyZWZveDM2KVxyXG4gICAgICAucmVwbGFjZSgvXFwqL2csICclMkEnKTtcclxuICB9XHJcbiAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcclxuICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xyXG4gIFVSSS5pc284ODU5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICBVUkkuZW5jb2RlID0gZXNjYXBlO1xyXG4gICAgVVJJLmRlY29kZSA9IHVuZXNjYXBlO1xyXG4gIH07XHJcbiAgVVJJLnVuaWNvZGUgPSBmdW5jdGlvbigpIHtcclxuICAgIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XHJcbiAgICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xyXG4gIH07XHJcbiAgVVJJLmNoYXJhY3RlcnMgPSB7XHJcbiAgICBwYXRobmFtZToge1xyXG4gICAgICBlbmNvZGU6IHtcclxuICAgICAgICAvLyBSRkMzOTg2IDIuMTogRm9yIGNvbnNpc3RlbmN5LCBVUkkgcHJvZHVjZXJzIGFuZCBub3JtYWxpemVycyBzaG91bGRcclxuICAgICAgICAvLyB1c2UgdXBwZXJjYXNlIGhleGFkZWNpbWFsIGRpZ2l0cyBmb3IgYWxsIHBlcmNlbnQtZW5jb2RpbmdzLlxyXG4gICAgICAgIGV4cHJlc3Npb246IC8lKDI0fDI2fDJCfDJDfDNCfDNEfDNBfDQwKS9pZyxcclxuICAgICAgICBtYXA6IHtcclxuICAgICAgICAgIC8vIC0uX34hJygpKlxyXG4gICAgICAgICAgJyUyNCc6ICckJyxcclxuICAgICAgICAgICclMjYnOiAnJicsXHJcbiAgICAgICAgICAnJTJCJzogJysnLFxyXG4gICAgICAgICAgJyUyQyc6ICcsJyxcclxuICAgICAgICAgICclM0InOiAnOycsXHJcbiAgICAgICAgICAnJTNEJzogJz0nLFxyXG4gICAgICAgICAgJyUzQSc6ICc6JyxcclxuICAgICAgICAgICclNDAnOiAnQCdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRlY29kZToge1xyXG4gICAgICAgIGV4cHJlc3Npb246IC9bXFwvXFw/I10vZyxcclxuICAgICAgICBtYXA6IHtcclxuICAgICAgICAgICcvJzogJyUyRicsXHJcbiAgICAgICAgICAnPyc6ICclM0YnLFxyXG4gICAgICAgICAgJyMnOiAnJTIzJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHJlc2VydmVkOiB7XHJcbiAgICAgIGVuY29kZToge1xyXG4gICAgICAgIC8vIFJGQzM5ODYgMi4xOiBGb3IgY29uc2lzdGVuY3ksIFVSSSBwcm9kdWNlcnMgYW5kIG5vcm1hbGl6ZXJzIHNob3VsZFxyXG4gICAgICAgIC8vIHVzZSB1cHBlcmNhc2UgaGV4YWRlY2ltYWwgZGlnaXRzIGZvciBhbGwgcGVyY2VudC1lbmNvZGluZ3MuXHJcbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjF8MjN8MjR8MjZ8Mjd8Mjh8Mjl8MkF8MkJ8MkN8MkZ8M0F8M0J8M0R8M0Z8NDB8NUJ8NUQpL2lnLFxyXG4gICAgICAgIG1hcDoge1xyXG4gICAgICAgICAgLy8gZ2VuLWRlbGltc1xyXG4gICAgICAgICAgJyUzQSc6ICc6JyxcclxuICAgICAgICAgICclMkYnOiAnLycsXHJcbiAgICAgICAgICAnJTNGJzogJz8nLFxyXG4gICAgICAgICAgJyUyMyc6ICcjJyxcclxuICAgICAgICAgICclNUInOiAnWycsXHJcbiAgICAgICAgICAnJTVEJzogJ10nLFxyXG4gICAgICAgICAgJyU0MCc6ICdAJyxcclxuICAgICAgICAgIC8vIHN1Yi1kZWxpbXNcclxuICAgICAgICAgICclMjEnOiAnIScsXHJcbiAgICAgICAgICAnJTI0JzogJyQnLFxyXG4gICAgICAgICAgJyUyNic6ICcmJyxcclxuICAgICAgICAgICclMjcnOiAnXFwnJyxcclxuICAgICAgICAgICclMjgnOiAnKCcsXHJcbiAgICAgICAgICAnJTI5JzogJyknLFxyXG4gICAgICAgICAgJyUyQSc6ICcqJyxcclxuICAgICAgICAgICclMkInOiAnKycsXHJcbiAgICAgICAgICAnJTJDJzogJywnLFxyXG4gICAgICAgICAgJyUzQic6ICc7JyxcclxuICAgICAgICAgICclM0QnOiAnPSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB1cm5wYXRoOiB7XHJcbiAgICAgIC8vIFRoZSBjaGFyYWN0ZXJzIHVuZGVyIGBlbmNvZGVgIGFyZSB0aGUgY2hhcmFjdGVycyBjYWxsZWQgb3V0IGJ5IFJGQyAyMTQxIGFzIGJlaW5nIGFjY2VwdGFibGVcclxuICAgICAgLy8gZm9yIHVzYWdlIGluIGEgVVJOLiBSRkMyMTQxIGFsc28gY2FsbHMgb3V0IFwiLVwiLCBcIi5cIiwgYW5kIFwiX1wiIGFzIGFjY2VwdGFibGUgY2hhcmFjdGVycywgYnV0XHJcbiAgICAgIC8vIHRoZXNlIGFyZW4ndCBlbmNvZGVkIGJ5IGVuY29kZVVSSUNvbXBvbmVudCwgc28gd2UgZG9uJ3QgaGF2ZSB0byBjYWxsIHRoZW0gb3V0IGhlcmUuIEFsc29cclxuICAgICAgLy8gbm90ZSB0aGF0IHRoZSBjb2xvbiBjaGFyYWN0ZXIgaXMgbm90IGZlYXR1cmVkIGluIHRoZSBlbmNvZGluZyBtYXA7IHRoaXMgaXMgYmVjYXVzZSBVUkkuanNcclxuICAgICAgLy8gZ2l2ZXMgdGhlIGNvbG9ucyBpbiBVUk5zIHNlbWFudGljIG1lYW5pbmcgYXMgdGhlIGRlbGltaXRlcnMgb2YgcGF0aCBzZWdlbWVudHMsIGFuZCBzbyBpdFxyXG4gICAgICAvLyBzaG91bGQgbm90IGFwcGVhciB1bmVuY29kZWQgaW4gYSBzZWdtZW50IGl0c2VsZi5cclxuICAgICAgLy8gU2VlIGFsc28gdGhlIG5vdGUgYWJvdmUgYWJvdXQgUkZDMzk4NiBhbmQgY2FwaXRhbGFsaXplZCBoZXggZGlnaXRzLlxyXG4gICAgICBlbmNvZGU6IHtcclxuICAgICAgICBleHByZXNzaW9uOiAvJSgyMXwyNHwyN3wyOHwyOXwyQXwyQnwyQ3wzQnwzRHw0MCkvaWcsXHJcbiAgICAgICAgbWFwOiB7XHJcbiAgICAgICAgICAnJTIxJzogJyEnLFxyXG4gICAgICAgICAgJyUyNCc6ICckJyxcclxuICAgICAgICAgICclMjcnOiAnXFwnJyxcclxuICAgICAgICAgICclMjgnOiAnKCcsXHJcbiAgICAgICAgICAnJTI5JzogJyknLFxyXG4gICAgICAgICAgJyUyQSc6ICcqJyxcclxuICAgICAgICAgICclMkInOiAnKycsXHJcbiAgICAgICAgICAnJTJDJzogJywnLFxyXG4gICAgICAgICAgJyUzQic6ICc7JyxcclxuICAgICAgICAgICclM0QnOiAnPScsXHJcbiAgICAgICAgICAnJTQwJzogJ0AnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAvLyBUaGVzZSBjaGFyYWN0ZXJzIGFyZSB0aGUgY2hhcmFjdGVycyBjYWxsZWQgb3V0IGJ5IFJGQzIxNDEgYXMgXCJyZXNlcnZlZFwiIGNoYXJhY3RlcnMgdGhhdFxyXG4gICAgICAvLyBzaG91bGQgbmV2ZXIgYXBwZWFyIGluIGEgVVJOLCBwbHVzIHRoZSBjb2xvbiBjaGFyYWN0ZXIgKHNlZSBub3RlIGFib3ZlKS5cclxuICAgICAgZGVjb2RlOiB7XHJcbiAgICAgICAgZXhwcmVzc2lvbjogL1tcXC9cXD8jOl0vZyxcclxuICAgICAgICBtYXA6IHtcclxuICAgICAgICAgICcvJzogJyUyRicsXHJcbiAgICAgICAgICAnPyc6ICclM0YnLFxyXG4gICAgICAgICAgJyMnOiAnJTIzJyxcclxuICAgICAgICAgICc6JzogJyUzQSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG4gIFVSSS5lbmNvZGVRdWVyeSA9IGZ1bmN0aW9uKHN0cmluZywgZXNjYXBlUXVlcnlTcGFjZSkge1xyXG4gICAgdmFyIGVzY2FwZWQgPSBVUkkuZW5jb2RlKHN0cmluZyArICcnKTtcclxuICAgIGlmIChlc2NhcGVRdWVyeVNwYWNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZXNjYXBlUXVlcnlTcGFjZSA9IFVSSS5lc2NhcGVRdWVyeVNwYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlc2NhcGVRdWVyeVNwYWNlID8gZXNjYXBlZC5yZXBsYWNlKC8lMjAvZywgJysnKSA6IGVzY2FwZWQ7XHJcbiAgfTtcclxuICBVUkkuZGVjb2RlUXVlcnkgPSBmdW5jdGlvbihzdHJpbmcsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcclxuICAgIHN0cmluZyArPSAnJztcclxuICAgIGlmIChlc2NhcGVRdWVyeVNwYWNlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgZXNjYXBlUXVlcnlTcGFjZSA9IFVSSS5lc2NhcGVRdWVyeVNwYWNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgIHJldHVybiBVUkkuZGVjb2RlKGVzY2FwZVF1ZXJ5U3BhY2UgPyBzdHJpbmcucmVwbGFjZSgvXFwrL2csICclMjAnKSA6IHN0cmluZyk7XHJcbiAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgLy8gd2UncmUgbm90IGdvaW5nIHRvIG1lc3Mgd2l0aCB3ZWlyZCBlbmNvZGluZ3MsXHJcbiAgICAgIC8vIGdpdmUgdXAgYW5kIHJldHVybiB0aGUgdW5kZWNvZGVkIG9yaWdpbmFsIHN0cmluZ1xyXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzg3XHJcbiAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvOTJcclxuICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgIH1cclxuICB9O1xyXG4gIC8vIGdlbmVyYXRlIGVuY29kZS9kZWNvZGUgcGF0aCBmdW5jdGlvbnNcclxuICB2YXIgX3BhcnRzID0geydlbmNvZGUnOidlbmNvZGUnLCAnZGVjb2RlJzonZGVjb2RlJ307XHJcbiAgdmFyIF9wYXJ0O1xyXG4gIHZhciBnZW5lcmF0ZUFjY2Vzc29yID0gZnVuY3Rpb24oX2dyb3VwLCBfcGFydCkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHJldHVybiBVUklbX3BhcnRdKHN0cmluZyArICcnKS5yZXBsYWNlKFVSSS5jaGFyYWN0ZXJzW19ncm91cF1bX3BhcnRdLmV4cHJlc3Npb24sIGZ1bmN0aW9uKGMpIHtcclxuICAgICAgICAgIHJldHVybiBVUkkuY2hhcmFjdGVyc1tfZ3JvdXBdW19wYXJ0XS5tYXBbY107XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gbWVzcyB3aXRoIHdlaXJkIGVuY29kaW5ncyxcclxuICAgICAgICAvLyBnaXZlIHVwIGFuZCByZXR1cm4gdGhlIHVuZGVjb2RlZCBvcmlnaW5hbCBzdHJpbmdcclxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzg3XHJcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy85MlxyXG4gICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuXHJcbiAgZm9yIChfcGFydCBpbiBfcGFydHMpIHtcclxuICAgIFVSSVtfcGFydCArICdQYXRoU2VnbWVudCddID0gZ2VuZXJhdGVBY2Nlc3NvcigncGF0aG5hbWUnLCBfcGFydHNbX3BhcnRdKTtcclxuICAgIFVSSVtfcGFydCArICdVcm5QYXRoU2VnbWVudCddID0gZ2VuZXJhdGVBY2Nlc3NvcigndXJucGF0aCcsIF9wYXJ0c1tfcGFydF0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uID0gZnVuY3Rpb24oX3NlcCwgX2NvZGluZ0Z1bmNOYW1lLCBfaW5uZXJDb2RpbmdGdW5jTmFtZSkge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xyXG4gICAgICAvLyBXaHkgcGFzcyBpbiBuYW1lcyBvZiBmdW5jdGlvbnMsIHJhdGhlciB0aGFuIHRoZSBmdW5jdGlvbiBvYmplY3RzIHRoZW1zZWx2ZXM/IFRoZVxyXG4gICAgICAvLyBkZWZpbml0aW9ucyBvZiBzb21lIGZ1bmN0aW9ucyAoYnV0IGluIHBhcnRpY3VsYXIsIFVSSS5kZWNvZGUpIHdpbGwgb2NjYXNpb25hbGx5IGNoYW5nZSBkdWVcclxuICAgICAgLy8gdG8gVVJJLmpzIGhhdmluZyBJU084ODU5IGFuZCBVbmljb2RlIG1vZGVzLiBQYXNzaW5nIGluIHRoZSBuYW1lIGFuZCBnZXR0aW5nIGl0IHdpbGwgZW5zdXJlXHJcbiAgICAgIC8vIHRoYXQgdGhlIGZ1bmN0aW9ucyB3ZSB1c2UgaGVyZSBhcmUgXCJmcmVzaFwiLlxyXG4gICAgICB2YXIgYWN0dWFsQ29kaW5nRnVuYztcclxuICAgICAgaWYgKCFfaW5uZXJDb2RpbmdGdW5jTmFtZSkge1xyXG4gICAgICAgIGFjdHVhbENvZGluZ0Z1bmMgPSBVUklbX2NvZGluZ0Z1bmNOYW1lXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhY3R1YWxDb2RpbmdGdW5jID0gZnVuY3Rpb24oc3RyaW5nKSB7XHJcbiAgICAgICAgICByZXR1cm4gVVJJW19jb2RpbmdGdW5jTmFtZV0oVVJJW19pbm5lckNvZGluZ0Z1bmNOYW1lXShzdHJpbmcpKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc2VnbWVudHMgPSAoc3RyaW5nICsgJycpLnNwbGl0KF9zZXApO1xyXG5cclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgc2VnbWVudHNbaV0gPSBhY3R1YWxDb2RpbmdGdW5jKHNlZ21lbnRzW2ldKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHNlZ21lbnRzLmpvaW4oX3NlcCk7XHJcbiAgICB9O1xyXG4gIH07XHJcblxyXG4gIC8vIFRoaXMgdGFrZXMgcGxhY2Ugb3V0c2lkZSB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGRvbid0IHdhbnQsIGUuZy4sIGVuY29kZVVyblBhdGggZnVuY3Rpb25zLlxyXG4gIFVSSS5kZWNvZGVQYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJy8nLCAnZGVjb2RlUGF0aFNlZ21lbnQnKTtcclxuICBVUkkuZGVjb2RlVXJuUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCc6JywgJ2RlY29kZVVyblBhdGhTZWdtZW50Jyk7XHJcbiAgVVJJLnJlY29kZVBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignLycsICdlbmNvZGVQYXRoU2VnbWVudCcsICdkZWNvZGUnKTtcclxuICBVUkkucmVjb2RlVXJuUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCc6JywgJ2VuY29kZVVyblBhdGhTZWdtZW50JywgJ2RlY29kZScpO1xyXG5cclxuICBVUkkuZW5jb2RlUmVzZXJ2ZWQgPSBnZW5lcmF0ZUFjY2Vzc29yKCdyZXNlcnZlZCcsICdlbmNvZGUnKTtcclxuXHJcbiAgVVJJLnBhcnNlID0gZnVuY3Rpb24oc3RyaW5nLCBwYXJ0cykge1xyXG4gICAgdmFyIHBvcztcclxuICAgIGlmICghcGFydHMpIHtcclxuICAgICAgcGFydHMgPSB7fTtcclxuICAgIH1cclxuICAgIC8vIFtwcm90b2NvbFwiOi8vXCJbdXNlcm5hbWVbXCI6XCJwYXNzd29yZF1cIkBcIl1ob3N0bmFtZVtcIjpcInBvcnRdXCIvXCI/XVtwYXRoXVtcIj9cInF1ZXJ5c3RyaW5nXVtcIiNcImZyYWdtZW50XVxyXG5cclxuICAgIC8vIGV4dHJhY3QgZnJhZ21lbnRcclxuICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCcjJyk7XHJcbiAgICBpZiAocG9zID4gLTEpIHtcclxuICAgICAgLy8gZXNjYXBpbmc/XHJcbiAgICAgIHBhcnRzLmZyYWdtZW50ID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKSB8fCBudWxsO1xyXG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXh0cmFjdCBxdWVyeVxyXG4gICAgcG9zID0gc3RyaW5nLmluZGV4T2YoJz8nKTtcclxuICAgIGlmIChwb3MgPiAtMSkge1xyXG4gICAgICAvLyBlc2NhcGluZz9cclxuICAgICAgcGFydHMucXVlcnkgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpIHx8IG51bGw7XHJcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBleHRyYWN0IHByb3RvY29sXHJcbiAgICBpZiAoc3RyaW5nLnN1YnN0cmluZygwLCAyKSA9PT0gJy8vJykge1xyXG4gICAgICAvLyByZWxhdGl2ZS1zY2hlbWVcclxuICAgICAgcGFydHMucHJvdG9jb2wgPSBudWxsO1xyXG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDIpO1xyXG4gICAgICAvLyBleHRyYWN0IFwidXNlcjpwYXNzQGhvc3Q6cG9ydFwiXHJcbiAgICAgIHN0cmluZyA9IFVSSS5wYXJzZUF1dGhvcml0eShzdHJpbmcsIHBhcnRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XHJcbiAgICAgIGlmIChwb3MgPiAtMSkge1xyXG4gICAgICAgIHBhcnRzLnByb3RvY29sID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpIHx8IG51bGw7XHJcbiAgICAgICAgaWYgKHBhcnRzLnByb3RvY29sICYmICFwYXJ0cy5wcm90b2NvbC5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgIC8vIDogbWF5IGJlIHdpdGhpbiB0aGUgcGF0aFxyXG4gICAgICAgICAgcGFydHMucHJvdG9jb2wgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEsIHBvcyArIDMpID09PSAnLy8nKSB7XHJcbiAgICAgICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDMpO1xyXG5cclxuICAgICAgICAgIC8vIGV4dHJhY3QgXCJ1c2VyOnBhc3NAaG9zdDpwb3J0XCJcclxuICAgICAgICAgIHN0cmluZyA9IFVSSS5wYXJzZUF1dGhvcml0eShzdHJpbmcsIHBhcnRzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcclxuICAgICAgICAgIHBhcnRzLnVybiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gd2hhdCdzIGxlZnQgbXVzdCBiZSB0aGUgcGF0aFxyXG4gICAgcGFydHMucGF0aCA9IHN0cmluZztcclxuXHJcbiAgICAvLyBhbmQgd2UncmUgZG9uZVxyXG4gICAgcmV0dXJuIHBhcnRzO1xyXG4gIH07XHJcbiAgVVJJLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcclxuICAgIC8vIENvcHkgY2hyb21lLCBJRSwgb3BlcmEgYmFja3NsYXNoLWhhbmRsaW5nIGJlaGF2aW9yLlxyXG4gICAgLy8gQmFjayBzbGFzaGVzIGJlZm9yZSB0aGUgcXVlcnkgc3RyaW5nIGdldCBjb252ZXJ0ZWQgdG8gZm9yd2FyZCBzbGFzaGVzXHJcbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iLzM4NmZkMjRmNDliMGU5ZDFhOGEwNzY1OTJhNDA0MTY4ZmFlZWNjMzQvbGliL3VybC5qcyNMMTE1LUwxMjRcclxuICAgIC8vIFNlZTogaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTI1OTE2XHJcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9wdWxsLzIzM1xyXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcclxuXHJcbiAgICAvLyBleHRyYWN0IGhvc3Q6cG9ydFxyXG4gICAgdmFyIHBvcyA9IHN0cmluZy5pbmRleE9mKCcvJyk7XHJcbiAgICB2YXIgYnJhY2tldFBvcztcclxuICAgIHZhciB0O1xyXG5cclxuICAgIGlmIChwb3MgPT09IC0xKSB7XHJcbiAgICAgIHBvcyA9IHN0cmluZy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0cmluZy5jaGFyQXQoMCkgPT09ICdbJykge1xyXG4gICAgICAvLyBJUHY2IGhvc3QgLSBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1pZXRmLTZtYW4tdGV4dC1hZGRyLXJlcHJlc2VudGF0aW9uLTA0I3NlY3Rpb24tNlxyXG4gICAgICAvLyBJIGNsYWltIG1vc3QgY2xpZW50IHNvZnR3YXJlIGJyZWFrcyBvbiBJUHY2IGFueXdheXMuIFRvIHNpbXBsaWZ5IHRoaW5ncywgVVJJIG9ubHkgYWNjZXB0c1xyXG4gICAgICAvLyBJUHY2K3BvcnQgaW4gdGhlIGZvcm1hdCBbMjAwMTpkYjg6OjFdOjgwIChmb3IgdGhlIHRpbWUgYmVpbmcpXHJcbiAgICAgIGJyYWNrZXRQb3MgPSBzdHJpbmcuaW5kZXhPZignXScpO1xyXG4gICAgICBwYXJ0cy5ob3N0bmFtZSA9IHN0cmluZy5zdWJzdHJpbmcoMSwgYnJhY2tldFBvcykgfHwgbnVsbDtcclxuICAgICAgcGFydHMucG9ydCA9IHN0cmluZy5zdWJzdHJpbmcoYnJhY2tldFBvcyArIDIsIHBvcykgfHwgbnVsbDtcclxuICAgICAgaWYgKHBhcnRzLnBvcnQgPT09ICcvJykge1xyXG4gICAgICAgIHBhcnRzLnBvcnQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZmlyc3RDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XHJcbiAgICAgIHZhciBmaXJzdFNsYXNoID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcclxuICAgICAgdmFyIG5leHRDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6JywgZmlyc3RDb2xvbiArIDEpO1xyXG4gICAgICBpZiAobmV4dENvbG9uICE9PSAtMSAmJiAoZmlyc3RTbGFzaCA9PT0gLTEgfHwgbmV4dENvbG9uIDwgZmlyc3RTbGFzaCkpIHtcclxuICAgICAgICAvLyBJUHY2IGhvc3QgY29udGFpbnMgbXVsdGlwbGUgY29sb25zIC0gYnV0IG5vIHBvcnRcclxuICAgICAgICAvLyB0aGlzIG5vdGF0aW9uIGlzIGFjdHVhbGx5IG5vdCBhbGxvd2VkIGJ5IFJGQyAzOTg2LCBidXQgd2UncmUgYSBsaWJlcmFsIHBhcnNlclxyXG4gICAgICAgIHBhcnRzLmhvc3RuYW1lID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpIHx8IG51bGw7XHJcbiAgICAgICAgcGFydHMucG9ydCA9IG51bGw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKS5zcGxpdCgnOicpO1xyXG4gICAgICAgIHBhcnRzLmhvc3RuYW1lID0gdFswXSB8fCBudWxsO1xyXG4gICAgICAgIHBhcnRzLnBvcnQgPSB0WzFdIHx8IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocGFydHMuaG9zdG5hbWUgJiYgc3RyaW5nLnN1YnN0cmluZyhwb3MpLmNoYXJBdCgwKSAhPT0gJy8nKSB7XHJcbiAgICAgIHBvcysrO1xyXG4gICAgICBzdHJpbmcgPSAnLycgKyBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcocG9zKSB8fCAnLyc7XHJcbiAgfTtcclxuICBVUkkucGFyc2VBdXRob3JpdHkgPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XHJcbiAgICBzdHJpbmcgPSBVUkkucGFyc2VVc2VyaW5mbyhzdHJpbmcsIHBhcnRzKTtcclxuICAgIHJldHVybiBVUkkucGFyc2VIb3N0KHN0cmluZywgcGFydHMpO1xyXG4gIH07XHJcbiAgVVJJLnBhcnNlVXNlcmluZm8gPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XHJcbiAgICAvLyBleHRyYWN0IHVzZXJuYW1lOnBhc3N3b3JkXHJcbiAgICB2YXIgZmlyc3RTbGFzaCA9IHN0cmluZy5pbmRleE9mKCcvJyk7XHJcbiAgICB2YXIgcG9zID0gc3RyaW5nLmxhc3RJbmRleE9mKCdAJywgZmlyc3RTbGFzaCA+IC0xID8gZmlyc3RTbGFzaCA6IHN0cmluZy5sZW5ndGggLSAxKTtcclxuICAgIHZhciB0O1xyXG5cclxuICAgIC8vIGF1dGhvcml0eUAgbXVzdCBjb21lIGJlZm9yZSAvcGF0aFxyXG4gICAgaWYgKHBvcyA+IC0xICYmIChmaXJzdFNsYXNoID09PSAtMSB8fCBwb3MgPCBmaXJzdFNsYXNoKSkge1xyXG4gICAgICB0ID0gc3RyaW5nLnN1YnN0cmluZygwLCBwb3MpLnNwbGl0KCc6Jyk7XHJcbiAgICAgIHBhcnRzLnVzZXJuYW1lID0gdFswXSA/IFVSSS5kZWNvZGUodFswXSkgOiBudWxsO1xyXG4gICAgICB0LnNoaWZ0KCk7XHJcbiAgICAgIHBhcnRzLnBhc3N3b3JkID0gdFswXSA/IFVSSS5kZWNvZGUodC5qb2luKCc6JykpIDogbnVsbDtcclxuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhcnRzLnVzZXJuYW1lID0gbnVsbDtcclxuICAgICAgcGFydHMucGFzc3dvcmQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHJpbmc7XHJcbiAgfTtcclxuICBVUkkucGFyc2VRdWVyeSA9IGZ1bmN0aW9uKHN0cmluZywgZXNjYXBlUXVlcnlTcGFjZSkge1xyXG4gICAgaWYgKCFzdHJpbmcpIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRocm93IG91dCB0aGUgZnVua3kgYnVzaW5lc3MgLSBcIj9cIltuYW1lXCI9XCJ2YWx1ZVwiJlwiXStcclxuICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKC8mKy9nLCAnJicpLnJlcGxhY2UoL15cXD8qJip8JiskL2csICcnKTtcclxuXHJcbiAgICBpZiAoIXN0cmluZykge1xyXG4gICAgICByZXR1cm4ge307XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGl0ZW1zID0ge307XHJcbiAgICB2YXIgc3BsaXRzID0gc3RyaW5nLnNwbGl0KCcmJyk7XHJcbiAgICB2YXIgbGVuZ3RoID0gc3BsaXRzLmxlbmd0aDtcclxuICAgIHZhciB2LCBuYW1lLCB2YWx1ZTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHYgPSBzcGxpdHNbaV0uc3BsaXQoJz0nKTtcclxuICAgICAgbmFtZSA9IFVSSS5kZWNvZGVRdWVyeSh2LnNoaWZ0KCksIGVzY2FwZVF1ZXJ5U3BhY2UpO1xyXG4gICAgICAvLyBubyBcIj1cIiBpcyBudWxsIGFjY29yZGluZyB0byBodHRwOi8vZHZjcy53My5vcmcvaGcvdXJsL3Jhdy1maWxlL3RpcC9PdmVydmlldy5odG1sI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcclxuICAgICAgdmFsdWUgPSB2Lmxlbmd0aCA/IFVSSS5kZWNvZGVRdWVyeSh2LmpvaW4oJz0nKSwgZXNjYXBlUXVlcnlTcGFjZSkgOiBudWxsO1xyXG5cclxuICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZW1zLCBuYW1lKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgaXRlbXNbbmFtZV0gPT09ICdzdHJpbmcnIHx8IGl0ZW1zW25hbWVdID09PSBudWxsKSB7XHJcbiAgICAgICAgICBpdGVtc1tuYW1lXSA9IFtpdGVtc1tuYW1lXV07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVtc1tuYW1lXS5wdXNoKHZhbHVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpdGVtc1tuYW1lXSA9IHZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGl0ZW1zO1xyXG4gIH07XHJcblxyXG4gIFVSSS5idWlsZCA9IGZ1bmN0aW9uKHBhcnRzKSB7XHJcbiAgICB2YXIgdCA9ICcnO1xyXG5cclxuICAgIGlmIChwYXJ0cy5wcm90b2NvbCkge1xyXG4gICAgICB0ICs9IHBhcnRzLnByb3RvY29sICsgJzonO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghcGFydHMudXJuICYmICh0IHx8IHBhcnRzLmhvc3RuYW1lKSkge1xyXG4gICAgICB0ICs9ICcvLyc7XHJcbiAgICB9XHJcblxyXG4gICAgdCArPSAoVVJJLmJ1aWxkQXV0aG9yaXR5KHBhcnRzKSB8fCAnJyk7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBwYXJ0cy5wYXRoID09PSAnc3RyaW5nJykge1xyXG4gICAgICBpZiAocGFydHMucGF0aC5jaGFyQXQoMCkgIT09ICcvJyAmJiB0eXBlb2YgcGFydHMuaG9zdG5hbWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdCArPSAnLyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHQgKz0gcGFydHMucGF0aDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHBhcnRzLnF1ZXJ5ID09PSAnc3RyaW5nJyAmJiBwYXJ0cy5xdWVyeSkge1xyXG4gICAgICB0ICs9ICc/JyArIHBhcnRzLnF1ZXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFydHMuZnJhZ21lbnQgPT09ICdzdHJpbmcnICYmIHBhcnRzLmZyYWdtZW50KSB7XHJcbiAgICAgIHQgKz0gJyMnICsgcGFydHMuZnJhZ21lbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxuICB9O1xyXG4gIFVSSS5idWlsZEhvc3QgPSBmdW5jdGlvbihwYXJ0cykge1xyXG4gICAgdmFyIHQgPSAnJztcclxuXHJcbiAgICBpZiAoIXBhcnRzLmhvc3RuYW1lKSB7XHJcbiAgICAgIHJldHVybiAnJztcclxuICAgIH0gZWxzZSBpZiAoVVJJLmlwNl9leHByZXNzaW9uLnRlc3QocGFydHMuaG9zdG5hbWUpKSB7XHJcbiAgICAgIHQgKz0gJ1snICsgcGFydHMuaG9zdG5hbWUgKyAnXSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ICs9IHBhcnRzLmhvc3RuYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXJ0cy5wb3J0KSB7XHJcbiAgICAgIHQgKz0gJzonICsgcGFydHMucG9ydDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdDtcclxuICB9O1xyXG4gIFVSSS5idWlsZEF1dGhvcml0eSA9IGZ1bmN0aW9uKHBhcnRzKSB7XHJcbiAgICByZXR1cm4gVVJJLmJ1aWxkVXNlcmluZm8ocGFydHMpICsgVVJJLmJ1aWxkSG9zdChwYXJ0cyk7XHJcbiAgfTtcclxuICBVUkkuYnVpbGRVc2VyaW5mbyA9IGZ1bmN0aW9uKHBhcnRzKSB7XHJcbiAgICB2YXIgdCA9ICcnO1xyXG5cclxuICAgIGlmIChwYXJ0cy51c2VybmFtZSkge1xyXG4gICAgICB0ICs9IFVSSS5lbmNvZGUocGFydHMudXNlcm5hbWUpO1xyXG5cclxuICAgICAgaWYgKHBhcnRzLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgdCArPSAnOicgKyBVUkkuZW5jb2RlKHBhcnRzLnBhc3N3b3JkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdCArPSAnQCc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHQ7XHJcbiAgfTtcclxuICBVUkkuYnVpbGRRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgZXNjYXBlUXVlcnlTcGFjZSkge1xyXG4gICAgLy8gYWNjb3JkaW5nIHRvIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYgb3IgaHR0cDovL2xhYnMuYXBhY2hlLm9yZy93ZWJhcmNoL3VyaS9yZmMvcmZjMzk4Ni5odG1sXHJcbiAgICAvLyBiZWluZyDCuy0uX34hJCYnKCkqKyw7PTpALz/CqyAlSEVYIGFuZCBhbG51bSBhcmUgYWxsb3dlZFxyXG4gICAgLy8gdGhlIFJGQyBleHBsaWNpdGx5IHN0YXRlcyA/L2ZvbyBiZWluZyBhIHZhbGlkIHVzZSBjYXNlLCBubyBtZW50aW9uIG9mIHBhcmFtZXRlciBzeW50YXghXHJcbiAgICAvLyBVUkkuanMgdHJlYXRzIHRoZSBxdWVyeSBzdHJpbmcgYXMgYmVpbmcgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXHJcbiAgICAvLyBzZWUgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MC9pbnRlcmFjdC9mb3Jtcy5odG1sI2Zvcm0tY29udGVudC10eXBlXHJcblxyXG4gICAgdmFyIHQgPSAnJztcclxuICAgIHZhciB1bmlxdWUsIGtleSwgaSwgbGVuZ3RoO1xyXG4gICAgZm9yIChrZXkgaW4gZGF0YSkge1xyXG4gICAgICBpZiAoaGFzT3duLmNhbGwoZGF0YSwga2V5KSAmJiBrZXkpIHtcclxuICAgICAgICBpZiAoaXNBcnJheShkYXRhW2tleV0pKSB7XHJcbiAgICAgICAgICB1bmlxdWUgPSB7fTtcclxuICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGRhdGFba2V5XS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZGF0YVtrZXldW2ldICE9PSB1bmRlZmluZWQgJiYgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgdCArPSAnJicgKyBVUkkuYnVpbGRRdWVyeVBhcmFtZXRlcihrZXksIGRhdGFba2V5XVtpXSwgZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdW5pcXVlW2RhdGFba2V5XVtpXSArICcnXSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChkYXRhW2tleV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgdCArPSAnJicgKyBVUkkuYnVpbGRRdWVyeVBhcmFtZXRlcihrZXksIGRhdGFba2V5XSwgZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHQuc3Vic3RyaW5nKDEpO1xyXG4gIH07XHJcbiAgVVJJLmJ1aWxkUXVlcnlQYXJhbWV0ZXIgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgZXNjYXBlUXVlcnlTcGFjZSkge1xyXG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLWh0bWw0MC9pbnRlcmFjdC9mb3Jtcy5odG1sI2Zvcm0tY29udGVudC10eXBlIC0tIGFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFxyXG4gICAgLy8gZG9uJ3QgYXBwZW5kIFwiPVwiIGZvciBudWxsIHZhbHVlcywgYWNjb3JkaW5nIHRvIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy91cmwvcmF3LWZpbGUvdGlwL092ZXJ2aWV3Lmh0bWwjdXJsLXBhcmFtZXRlci1zZXJpYWxpemF0aW9uXHJcbiAgICByZXR1cm4gVVJJLmVuY29kZVF1ZXJ5KG5hbWUsIGVzY2FwZVF1ZXJ5U3BhY2UpICsgKHZhbHVlICE9PSBudWxsID8gJz0nICsgVVJJLmVuY29kZVF1ZXJ5KHZhbHVlLCBlc2NhcGVRdWVyeVNwYWNlKSA6ICcnKTtcclxuICB9O1xyXG5cclxuICBVUkkuYWRkUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xyXG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XHJcbiAgICAgICAgICBVUkkuYWRkUXVlcnkoZGF0YSwga2V5LCBuYW1lW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgaWYgKGRhdGFbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGRhdGFbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbbmFtZV0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgZGF0YVtuYW1lXSA9IFtkYXRhW25hbWVdXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFpc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgIHZhbHVlID0gW3ZhbHVlXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YVtuYW1lXSA9IChkYXRhW25hbWVdIHx8IFtdKS5jb25jYXQodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmFkZFF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFVSSS5yZW1vdmVRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhbHVlKSB7XHJcbiAgICB2YXIgaSwgbGVuZ3RoLCBrZXk7XHJcblxyXG4gICAgaWYgKGlzQXJyYXkobmFtZSkpIHtcclxuICAgICAgZm9yIChpID0gMCwgbGVuZ3RoID0gbmFtZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGFbbmFtZVtpXV0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZ2V0VHlwZShuYW1lKSA9PT0gJ1JlZ0V4cCcpIHtcclxuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgIGlmIChuYW1lLnRlc3Qoa2V5KSkge1xyXG4gICAgICAgICAgZGF0YVtrZXldID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgZm9yIChrZXkgaW4gbmFtZSkge1xyXG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XHJcbiAgICAgICAgICBVUkkucmVtb3ZlUXVlcnkoZGF0YSwga2V5LCBuYW1lW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBpZiAoZ2V0VHlwZSh2YWx1ZSkgPT09ICdSZWdFeHAnKSB7XHJcbiAgICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkgJiYgdmFsdWUudGVzdChkYXRhW25hbWVdKSkge1xyXG4gICAgICAgICAgICBkYXRhW25hbWVdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGF0YVtuYW1lXSA9IGZpbHRlckFycmF5VmFsdWVzKGRhdGFbbmFtZV0sIHZhbHVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFbbmFtZV0gPT09IFN0cmluZyh2YWx1ZSkgJiYgKCFpc0FycmF5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggPT09IDEpKSB7XHJcbiAgICAgICAgICBkYXRhW25hbWVdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShkYXRhW25hbWVdKSkge1xyXG4gICAgICAgICAgZGF0YVtuYW1lXSA9IGZpbHRlckFycmF5VmFsdWVzKGRhdGFbbmFtZV0sIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YVtuYW1lXSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLnJlbW92ZVF1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZywgUmVnRXhwIGFzIHRoZSBmaXJzdCBwYXJhbWV0ZXInKTtcclxuICAgIH1cclxuICB9O1xyXG4gIFVSSS5oYXNRdWVyeSA9IGZ1bmN0aW9uKGRhdGEsIG5hbWUsIHZhbHVlLCB3aXRoaW5BcnJheSkge1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xyXG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XHJcbiAgICAgICAgICBpZiAoIVVSSS5oYXNRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVUkkuaGFzUXVlcnkoKSBhY2NlcHRzIGFuIG9iamVjdCwgc3RyaW5nIGFzIHRoZSBuYW1lIHBhcmFtZXRlcicpO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAoZ2V0VHlwZSh2YWx1ZSkpIHtcclxuICAgICAgY2FzZSAnVW5kZWZpbmVkJzpcclxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyAoYnV0IG1heSBiZSBlbXB0eSlcclxuICAgICAgICByZXR1cm4gbmFtZSBpbiBkYXRhOyAvLyBkYXRhW25hbWVdICE9PSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBjYXNlICdCb29sZWFuJzpcclxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyBhbmQgbm9uLWVtcHR5XHJcbiAgICAgICAgdmFyIF9ib29seSA9IEJvb2xlYW4oaXNBcnJheShkYXRhW25hbWVdKSA/IGRhdGFbbmFtZV0ubGVuZ3RoIDogZGF0YVtuYW1lXSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBfYm9vbHk7XHJcblxyXG4gICAgICBjYXNlICdGdW5jdGlvbic6XHJcbiAgICAgICAgLy8gYWxsb3cgY29tcGxleCBjb21wYXJpc29uXHJcbiAgICAgICAgcmV0dXJuICEhdmFsdWUoZGF0YVtuYW1lXSwgbmFtZSwgZGF0YSk7XHJcblxyXG4gICAgICBjYXNlICdBcnJheSc6XHJcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgb3AgPSB3aXRoaW5BcnJheSA/IGFycmF5Q29udGFpbnMgOiBhcnJheXNFcXVhbDtcclxuICAgICAgICByZXR1cm4gb3AoZGF0YVtuYW1lXSwgdmFsdWUpO1xyXG5cclxuICAgICAgY2FzZSAnUmVnRXhwJzpcclxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkpIHtcclxuICAgICAgICAgIHJldHVybiBCb29sZWFuKGRhdGFbbmFtZV0gJiYgZGF0YVtuYW1lXS5tYXRjaCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5Q29udGFpbnMoZGF0YVtuYW1lXSwgdmFsdWUpO1xyXG5cclxuICAgICAgY2FzZSAnTnVtYmVyJzpcclxuICAgICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xyXG4gICAgICBjYXNlICdTdHJpbmcnOlxyXG4gICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGFbbmFtZV0gPT09IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5Q29udGFpbnMoZGF0YVtuYW1lXSwgdmFsdWUpO1xyXG5cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVUkkuaGFzUXVlcnkoKSBhY2NlcHRzIHVuZGVmaW5lZCwgYm9vbGVhbiwgc3RyaW5nLCBudW1iZXIsIFJlZ0V4cCwgRnVuY3Rpb24gYXMgdGhlIHZhbHVlIHBhcmFtZXRlcicpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG5cclxuICBVUkkuY29tbW9uUGF0aCA9IGZ1bmN0aW9uKG9uZSwgdHdvKSB7XHJcbiAgICB2YXIgbGVuZ3RoID0gTWF0aC5taW4ob25lLmxlbmd0aCwgdHdvLmxlbmd0aCk7XHJcbiAgICB2YXIgcG9zO1xyXG5cclxuICAgIC8vIGZpbmQgZmlyc3Qgbm9uLW1hdGNoaW5nIGNoYXJhY3RlclxyXG4gICAgZm9yIChwb3MgPSAwOyBwb3MgPCBsZW5ndGg7IHBvcysrKSB7XHJcbiAgICAgIGlmIChvbmUuY2hhckF0KHBvcykgIT09IHR3by5jaGFyQXQocG9zKSkge1xyXG4gICAgICAgIHBvcy0tO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBvcyA8IDEpIHtcclxuICAgICAgcmV0dXJuIG9uZS5jaGFyQXQoMCkgPT09IHR3by5jaGFyQXQoMCkgJiYgb25lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmV2ZXJ0IHRvIGxhc3QgL1xyXG4gICAgaWYgKG9uZS5jaGFyQXQocG9zKSAhPT0gJy8nIHx8IHR3by5jaGFyQXQocG9zKSAhPT0gJy8nKSB7XHJcbiAgICAgIHBvcyA9IG9uZS5zdWJzdHJpbmcoMCwgcG9zKS5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBvbmUuc3Vic3RyaW5nKDAsIHBvcyArIDEpO1xyXG4gIH07XHJcblxyXG4gIFVSSS53aXRoaW5TdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGNhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zIHx8IChvcHRpb25zID0ge30pO1xyXG4gICAgdmFyIF9zdGFydCA9IG9wdGlvbnMuc3RhcnQgfHwgVVJJLmZpbmRVcmkuc3RhcnQ7XHJcbiAgICB2YXIgX2VuZCA9IG9wdGlvbnMuZW5kIHx8IFVSSS5maW5kVXJpLmVuZDtcclxuICAgIHZhciBfdHJpbSA9IG9wdGlvbnMudHJpbSB8fCBVUkkuZmluZFVyaS50cmltO1xyXG4gICAgdmFyIF9hdHRyaWJ1dGVPcGVuID0gL1thLXowLTktXT1bXCInXT8kL2k7XHJcblxyXG4gICAgX3N0YXJ0Lmxhc3RJbmRleCA9IDA7XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICB2YXIgbWF0Y2ggPSBfc3RhcnQuZXhlYyhzdHJpbmcpO1xyXG4gICAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBzdGFydCA9IG1hdGNoLmluZGV4O1xyXG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmVIdG1sKSB7XHJcbiAgICAgICAgLy8gYXR0cmlidXQoZT1bXCInXT8kKVxyXG4gICAgICAgIHZhciBhdHRyaWJ1dGVPcGVuID0gc3RyaW5nLnNsaWNlKE1hdGgubWF4KHN0YXJ0IC0gMywgMCksIHN0YXJ0KTtcclxuICAgICAgICBpZiAoYXR0cmlidXRlT3BlbiAmJiBfYXR0cmlidXRlT3Blbi50ZXN0KGF0dHJpYnV0ZU9wZW4pKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciBlbmQgPSBzdGFydCArIHN0cmluZy5zbGljZShzdGFydCkuc2VhcmNoKF9lbmQpO1xyXG4gICAgICB2YXIgc2xpY2UgPSBzdHJpbmcuc2xpY2Uoc3RhcnQsIGVuZCkucmVwbGFjZShfdHJpbSwgJycpO1xyXG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmUgJiYgb3B0aW9ucy5pZ25vcmUudGVzdChzbGljZSkpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZW5kID0gc3RhcnQgKyBzbGljZS5sZW5ndGg7XHJcbiAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhzbGljZSwgc3RhcnQsIGVuZCwgc3RyaW5nKTtcclxuICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKDAsIHN0YXJ0KSArIHJlc3VsdCArIHN0cmluZy5zbGljZShlbmQpO1xyXG4gICAgICBfc3RhcnQubGFzdEluZGV4ID0gc3RhcnQgKyByZXN1bHQubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIF9zdGFydC5sYXN0SW5kZXggPSAwO1xyXG4gICAgcmV0dXJuIHN0cmluZztcclxuICB9O1xyXG5cclxuICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSA9IGZ1bmN0aW9uKHYpIHtcclxuICAgIC8vIFRoZW9yZXRpY2FsbHkgVVJJcyBhbGxvdyBwZXJjZW50LWVuY29kaW5nIGluIEhvc3RuYW1lcyAoYWNjb3JkaW5nIHRvIFJGQyAzOTg2KVxyXG4gICAgLy8gdGhleSBhcmUgbm90IHBhcnQgb2YgRE5TIGFuZCB0aGVyZWZvcmUgaWdub3JlZCBieSBVUkkuanNcclxuXHJcbiAgICBpZiAodi5tYXRjaChVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzKSkge1xyXG4gICAgICAvLyB0ZXN0IHB1bnljb2RlXHJcbiAgICAgIGlmICghcHVueWNvZGUpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dIGFuZCBQdW55Y29kZS5qcyBpcyBub3QgYXZhaWxhYmxlJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwdW55Y29kZS50b0FTQ0lJKHYpLm1hdGNoKFVSSS5pbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gbm9Db25mbGljdFxyXG4gIFVSSS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24ocmVtb3ZlQWxsKSB7XHJcbiAgICBpZiAocmVtb3ZlQWxsKSB7XHJcbiAgICAgIHZhciB1bmNvbmZsaWN0ZWQgPSB7XHJcbiAgICAgICAgVVJJOiB0aGlzLm5vQ29uZmxpY3QoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgaWYgKHJvb3QuVVJJVGVtcGxhdGUgJiYgdHlwZW9mIHJvb3QuVVJJVGVtcGxhdGUubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHVuY29uZmxpY3RlZC5VUklUZW1wbGF0ZSA9IHJvb3QuVVJJVGVtcGxhdGUubm9Db25mbGljdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocm9vdC5JUHY2ICYmIHR5cGVvZiByb290LklQdjYubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHVuY29uZmxpY3RlZC5JUHY2ID0gcm9vdC5JUHY2Lm5vQ29uZmxpY3QoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvb3QuU2Vjb25kTGV2ZWxEb21haW5zICYmIHR5cGVvZiByb290LlNlY29uZExldmVsRG9tYWlucy5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdW5jb25mbGljdGVkLlNlY29uZExldmVsRG9tYWlucyA9IHJvb3QuU2Vjb25kTGV2ZWxEb21haW5zLm5vQ29uZmxpY3QoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHVuY29uZmxpY3RlZDtcclxuICAgIH0gZWxzZSBpZiAocm9vdC5VUkkgPT09IHRoaXMpIHtcclxuICAgICAgcm9vdC5VUkkgPSBfVVJJO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIHAuYnVpbGQgPSBmdW5jdGlvbihkZWZlckJ1aWxkKSB7XHJcbiAgICBpZiAoZGVmZXJCdWlsZCA9PT0gdHJ1ZSkge1xyXG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IHRydWU7XHJcbiAgICB9IGVsc2UgaWYgKGRlZmVyQnVpbGQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9kZWZlcnJlZF9idWlsZCkge1xyXG4gICAgICB0aGlzLl9zdHJpbmcgPSBVUkkuYnVpbGQodGhpcy5fcGFydHMpO1xyXG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIHAuY2xvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBuZXcgVVJJKHRoaXMpO1xyXG4gIH07XHJcblxyXG4gIHAudmFsdWVPZiA9IHAudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmJ1aWxkKGZhbHNlKS5fc3RyaW5nO1xyXG4gIH07XHJcblxyXG5cclxuICBmdW5jdGlvbiBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKF9wYXJ0KXtcclxuICAgIHJldHVybiBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzW19wYXJ0XSB8fCAnJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9wYXJ0c1tfcGFydF0gPSB2IHx8IG51bGw7XHJcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcihfcGFydCwgX2tleSl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0c1tfcGFydF0gfHwgJyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHYgIT09IG51bGwpIHtcclxuICAgICAgICAgIHYgPSB2ICsgJyc7XHJcbiAgICAgICAgICBpZiAodi5jaGFyQXQoMCkgPT09IF9rZXkpIHtcclxuICAgICAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGFydHNbX3BhcnRdID0gdjtcclxuICAgICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwLnByb3RvY29sID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncHJvdG9jb2wnKTtcclxuICBwLnVzZXJuYW1lID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigndXNlcm5hbWUnKTtcclxuICBwLnBhc3N3b3JkID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncGFzc3dvcmQnKTtcclxuICBwLmhvc3RuYW1lID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcignaG9zdG5hbWUnKTtcclxuICBwLnBvcnQgPSBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKCdwb3J0Jyk7XHJcbiAgcC5xdWVyeSA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ3F1ZXJ5JywgJz8nKTtcclxuICBwLmZyYWdtZW50ID0gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcignZnJhZ21lbnQnLCAnIycpO1xyXG5cclxuICBwLnNlYXJjaCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICB2YXIgdCA9IHRoaXMucXVlcnkodiwgYnVpbGQpO1xyXG4gICAgcmV0dXJuIHR5cGVvZiB0ID09PSAnc3RyaW5nJyAmJiB0Lmxlbmd0aCA/ICgnPycgKyB0KSA6IHQ7XHJcbiAgfTtcclxuICBwLmhhc2ggPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgdmFyIHQgPSB0aGlzLmZyYWdtZW50KHYsIGJ1aWxkKTtcclxuICAgIHJldHVybiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgJiYgdC5sZW5ndGggPyAoJyMnICsgdCkgOiB0O1xyXG4gIH07XHJcblxyXG4gIHAucGF0aG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XHJcbiAgICAgIHZhciByZXMgPSB0aGlzLl9wYXJ0cy5wYXRoIHx8ICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/ICcvJyA6ICcnKTtcclxuICAgICAgcmV0dXJuIHYgPyAodGhpcy5fcGFydHMudXJuID8gVVJJLmRlY29kZVVyblBhdGggOiBVUkkuZGVjb2RlUGF0aCkocmVzKSA6IHJlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVVcm5QYXRoKHYpIDogJyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHYgPyBVUkkucmVjb2RlUGF0aCh2KSA6ICcvJztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgcC5wYXRoID0gcC5wYXRobmFtZTtcclxuICBwLmhyZWYgPSBmdW5jdGlvbihocmVmLCBidWlsZCkge1xyXG4gICAgdmFyIGtleTtcclxuXHJcbiAgICBpZiAoaHJlZiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc3RyaW5nID0gJyc7XHJcbiAgICB0aGlzLl9wYXJ0cyA9IFVSSS5fcGFydHMoKTtcclxuXHJcbiAgICB2YXIgX1VSSSA9IGhyZWYgaW5zdGFuY2VvZiBVUkk7XHJcbiAgICB2YXIgX29iamVjdCA9IHR5cGVvZiBocmVmID09PSAnb2JqZWN0JyAmJiAoaHJlZi5ob3N0bmFtZSB8fCBocmVmLnBhdGggfHwgaHJlZi5wYXRobmFtZSk7XHJcbiAgICBpZiAoaHJlZi5ub2RlTmFtZSkge1xyXG4gICAgICB2YXIgYXR0cmlidXRlID0gVVJJLmdldERvbUF0dHJpYnV0ZShocmVmKTtcclxuICAgICAgaHJlZiA9IGhyZWZbYXR0cmlidXRlXSB8fCAnJztcclxuICAgICAgX29iamVjdCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHdpbmRvdy5sb2NhdGlvbiBpcyByZXBvcnRlZCB0byBiZSBhbiBvYmplY3QsIGJ1dCBpdCdzIG5vdCB0aGUgc29ydFxyXG4gICAgLy8gb2Ygb2JqZWN0IHdlJ3JlIGxvb2tpbmcgZm9yOlxyXG4gICAgLy8gKiBsb2NhdGlvbi5wcm90b2NvbCBlbmRzIHdpdGggYSBjb2xvblxyXG4gICAgLy8gKiBsb2NhdGlvbi5xdWVyeSAhPSBvYmplY3Quc2VhcmNoXHJcbiAgICAvLyAqIGxvY2F0aW9uLmhhc2ggIT0gb2JqZWN0LmZyYWdtZW50XHJcbiAgICAvLyBzaW1wbHkgc2VyaWFsaXppbmcgdGhlIHVua25vd24gb2JqZWN0IHNob3VsZCBkbyB0aGUgdHJpY2tcclxuICAgIC8vIChmb3IgbG9jYXRpb24sIG5vdCBmb3IgZXZlcnl0aGluZy4uLilcclxuICAgIGlmICghX1VSSSAmJiBfb2JqZWN0ICYmIGhyZWYucGF0aG5hbWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBocmVmID0gaHJlZi50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgaHJlZiA9PT0gJ3N0cmluZycgfHwgaHJlZiBpbnN0YW5jZW9mIFN0cmluZykge1xyXG4gICAgICB0aGlzLl9wYXJ0cyA9IFVSSS5wYXJzZShTdHJpbmcoaHJlZiksIHRoaXMuX3BhcnRzKTtcclxuICAgIH0gZWxzZSBpZiAoX1VSSSB8fCBfb2JqZWN0KSB7XHJcbiAgICAgIHZhciBzcmMgPSBfVVJJID8gaHJlZi5fcGFydHMgOiBocmVmO1xyXG4gICAgICBmb3IgKGtleSBpbiBzcmMpIHtcclxuICAgICAgICBpZiAoaGFzT3duLmNhbGwodGhpcy5fcGFydHMsIGtleSkpIHtcclxuICAgICAgICAgIHRoaXMuX3BhcnRzW2tleV0gPSBzcmNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaW5wdXQnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvLyBpZGVudGlmaWNhdGlvbiBhY2Nlc3NvcnNcclxuICBwLmlzID0gZnVuY3Rpb24od2hhdCkge1xyXG4gICAgdmFyIGlwID0gZmFsc2U7XHJcbiAgICB2YXIgaXA0ID0gZmFsc2U7XHJcbiAgICB2YXIgaXA2ID0gZmFsc2U7XHJcbiAgICB2YXIgbmFtZSA9IGZhbHNlO1xyXG4gICAgdmFyIHNsZCA9IGZhbHNlO1xyXG4gICAgdmFyIGlkbiA9IGZhbHNlO1xyXG4gICAgdmFyIHB1bnljb2RlID0gZmFsc2U7XHJcbiAgICB2YXIgcmVsYXRpdmUgPSAhdGhpcy5fcGFydHMudXJuO1xyXG5cclxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xyXG4gICAgICByZWxhdGl2ZSA9IGZhbHNlO1xyXG4gICAgICBpcDQgPSBVUkkuaXA0X2V4cHJlc3Npb24udGVzdCh0aGlzLl9wYXJ0cy5ob3N0bmFtZSk7XHJcbiAgICAgIGlwNiA9IFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgICAgaXAgPSBpcDQgfHwgaXA2O1xyXG4gICAgICBuYW1lID0gIWlwO1xyXG4gICAgICBzbGQgPSBuYW1lICYmIFNMRCAmJiBTTEQuaGFzKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgICAgaWRuID0gbmFtZSAmJiBVUkkuaWRuX2V4cHJlc3Npb24udGVzdCh0aGlzLl9wYXJ0cy5ob3N0bmFtZSk7XHJcbiAgICAgIHB1bnljb2RlID0gbmFtZSAmJiBVUkkucHVueWNvZGVfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2ggKHdoYXQudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICBjYXNlICdyZWxhdGl2ZSc6XHJcbiAgICAgICAgcmV0dXJuIHJlbGF0aXZlO1xyXG5cclxuICAgICAgY2FzZSAnYWJzb2x1dGUnOlxyXG4gICAgICAgIHJldHVybiAhcmVsYXRpdmU7XHJcblxyXG4gICAgICAvLyBob3N0bmFtZSBpZGVudGlmaWNhdGlvblxyXG4gICAgICBjYXNlICdkb21haW4nOlxyXG4gICAgICBjYXNlICduYW1lJzpcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuXHJcbiAgICAgIGNhc2UgJ3NsZCc6XHJcbiAgICAgICAgcmV0dXJuIHNsZDtcclxuXHJcbiAgICAgIGNhc2UgJ2lwJzpcclxuICAgICAgICByZXR1cm4gaXA7XHJcblxyXG4gICAgICBjYXNlICdpcDQnOlxyXG4gICAgICBjYXNlICdpcHY0JzpcclxuICAgICAgY2FzZSAnaW5ldDQnOlxyXG4gICAgICAgIHJldHVybiBpcDQ7XHJcblxyXG4gICAgICBjYXNlICdpcDYnOlxyXG4gICAgICBjYXNlICdpcHY2JzpcclxuICAgICAgY2FzZSAnaW5ldDYnOlxyXG4gICAgICAgIHJldHVybiBpcDY7XHJcblxyXG4gICAgICBjYXNlICdpZG4nOlxyXG4gICAgICAgIHJldHVybiBpZG47XHJcblxyXG4gICAgICBjYXNlICd1cmwnOlxyXG4gICAgICAgIHJldHVybiAhdGhpcy5fcGFydHMudXJuO1xyXG5cclxuICAgICAgY2FzZSAndXJuJzpcclxuICAgICAgICByZXR1cm4gISF0aGlzLl9wYXJ0cy51cm47XHJcblxyXG4gICAgICBjYXNlICdwdW55Y29kZSc6XHJcbiAgICAgICAgcmV0dXJuIHB1bnljb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH07XHJcblxyXG4gIC8vIGNvbXBvbmVudCBzcGVjaWZpYyBpbnB1dCB2YWxpZGF0aW9uXHJcbiAgdmFyIF9wcm90b2NvbCA9IHAucHJvdG9jb2w7XHJcbiAgdmFyIF9wb3J0ID0gcC5wb3J0O1xyXG4gIHZhciBfaG9zdG5hbWUgPSBwLmhvc3RuYW1lO1xyXG5cclxuICBwLnByb3RvY29sID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKHYpIHtcclxuICAgICAgICAvLyBhY2NlcHQgdHJhaWxpbmcgOi8vXHJcbiAgICAgICAgdiA9IHYucmVwbGFjZSgvOihcXC9cXC8pPyQvLCAnJyk7XHJcblxyXG4gICAgICAgIGlmICghdi5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcclxuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3RvY29sIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuKy1dIG9yIGRvZXNuXFwndCBzdGFydCB3aXRoIFtBLVpdJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX3Byb3RvY29sLmNhbGwodGhpcywgdiwgYnVpbGQpO1xyXG4gIH07XHJcbiAgcC5zY2hlbWUgPSBwLnByb3RvY29sO1xyXG4gIHAucG9ydCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAodiA9PT0gMCkge1xyXG4gICAgICAgIHYgPSBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodikge1xyXG4gICAgICAgIHYgKz0gJyc7XHJcbiAgICAgICAgaWYgKHYuY2hhckF0KDApID09PSAnOicpIHtcclxuICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2Lm1hdGNoKC9bXjAtOV0vKSkge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUG9ydCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbMC05XScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9wb3J0LmNhbGwodGhpcywgdiwgYnVpbGQpO1xyXG4gIH07XHJcbiAgcC5ob3N0bmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB2YXIgeCA9IHt9O1xyXG4gICAgICB2YXIgcmVzID0gVVJJLnBhcnNlSG9zdCh2LCB4KTtcclxuICAgICAgaWYgKHJlcyAhPT0gJy8nKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2ID0geC5ob3N0bmFtZTtcclxuICAgIH1cclxuICAgIHJldHVybiBfaG9zdG5hbWUuY2FsbCh0aGlzLCB2LCBidWlsZCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gY29tcG91bmQgYWNjZXNzb3JzXHJcbiAgcC5vcmlnaW4gPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgdmFyIHBhcnRzO1xyXG5cclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHZhciBwcm90b2NvbCA9IHRoaXMucHJvdG9jb2woKTtcclxuICAgICAgdmFyIGF1dGhvcml0eSA9IHRoaXMuYXV0aG9yaXR5KCk7XHJcbiAgICAgIGlmICghYXV0aG9yaXR5KSByZXR1cm4gJyc7XHJcbiAgICAgIHJldHVybiAocHJvdG9jb2wgPyBwcm90b2NvbCArICc6Ly8nIDogJycpICsgdGhpcy5hdXRob3JpdHkoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBvcmlnaW4gPSBVUkkodik7XHJcbiAgICAgIHRoaXNcclxuICAgICAgICAucHJvdG9jb2wob3JpZ2luLnByb3RvY29sKCkpXHJcbiAgICAgICAgLmF1dGhvcml0eShvcmlnaW4uYXV0aG9yaXR5KCkpXHJcbiAgICAgICAgLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgcC5ob3N0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEhvc3QodGhpcy5fcGFydHMpIDogJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcmVzID0gVVJJLnBhcnNlSG9zdCh2LCB0aGlzLl9wYXJ0cyk7XHJcbiAgICAgIGlmIChyZXMgIT09ICcvJykge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hvc3RuYW1lIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuLV0nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICB9O1xyXG4gIHAuYXV0aG9yaXR5ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEF1dGhvcml0eSh0aGlzLl9wYXJ0cykgOiAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciByZXMgPSBVUkkucGFyc2VBdXRob3JpdHkodiwgdGhpcy5fcGFydHMpO1xyXG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwLnVzZXJpbmZvID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICghdGhpcy5fcGFydHMudXNlcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZhciB0ID0gVVJJLmJ1aWxkVXNlcmluZm8odGhpcy5fcGFydHMpO1xyXG4gICAgICByZXR1cm4gdC5zdWJzdHJpbmcoMCwgdC5sZW5ndGggLTEpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHZbdi5sZW5ndGgtMV0gIT09ICdAJykge1xyXG4gICAgICAgIHYgKz0gJ0AnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBVUkkucGFyc2VVc2VyaW5mbyh2LCB0aGlzLl9wYXJ0cyk7XHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwLnJlc291cmNlID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcclxuICAgIHZhciBwYXJ0cztcclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnBhdGgoKSArIHRoaXMuc2VhcmNoKCkgKyB0aGlzLmhhc2goKTtcclxuICAgIH1cclxuXHJcbiAgICBwYXJ0cyA9IFVSSS5wYXJzZSh2KTtcclxuICAgIHRoaXMuX3BhcnRzLnBhdGggPSBwYXJ0cy5wYXRoO1xyXG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBwYXJ0cy5xdWVyeTtcclxuICAgIHRoaXMuX3BhcnRzLmZyYWdtZW50ID0gcGFydHMuZnJhZ21lbnQ7XHJcbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICAvLyBmcmFjdGlvbiBhY2Nlc3NvcnNcclxuICBwLnN1YmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY29udmVuaWVuY2UsIHJldHVybiBcInd3d1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGdyYWIgZG9tYWluIGFuZCBhZGQgYW5vdGhlciBzZWdtZW50XHJcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sZW5ndGggLSB0aGlzLmRvbWFpbigpLmxlbmd0aCAtIDE7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcoMCwgZW5kKSB8fCAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy5kb21haW4oKS5sZW5ndGg7XHJcbiAgICAgIHZhciBzdWIgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcoMCwgZSk7XHJcbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVSZWdFeChzdWIpKTtcclxuXHJcbiAgICAgIGlmICh2ICYmIHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgIT09ICcuJykge1xyXG4gICAgICAgIHYgKz0gJy4nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodikge1xyXG4gICAgICAgIFVSSS5lbnN1cmVWYWxpZEhvc3RuYW1lKHYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwLmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB2ID09PSAnYm9vbGVhbicpIHtcclxuICAgICAgYnVpbGQgPSB2O1xyXG4gICAgICB2ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnZlbmllbmNlLCByZXR1cm4gXCJleGFtcGxlLm9yZ1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIGlmIGhvc3RuYW1lIGNvbnNpc3RzIG9mIDEgb3IgMiBzZWdtZW50cywgaXQgbXVzdCBiZSB0aGUgZG9tYWluXHJcbiAgICAgIHZhciB0ID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubWF0Y2goL1xcLi9nKTtcclxuICAgICAgaWYgKHQgJiYgdC5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBncmFiIHRsZCBhbmQgYWRkIGFub3RoZXIgc2VnbWVudFxyXG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy50bGQoYnVpbGQpLmxlbmd0aCAtIDE7XHJcbiAgICAgIGVuZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxhc3RJbmRleE9mKCcuJywgZW5kIC0xKSArIDE7XHJcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcoZW5kKSB8fCAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghdikge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nhbm5vdCBzZXQgZG9tYWluIGVtcHR5Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIFVSSS5lbnN1cmVWYWxpZEhvc3RuYW1lKHYpO1xyXG5cclxuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB2O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLmRvbWFpbigpKSArICckJyk7XHJcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgcC50bGQgPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xyXG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdiA9PT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIGJ1aWxkID0gdjtcclxuICAgICAgdiA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm4gXCJvcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcclxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nKTtcclxuICAgICAgdmFyIHRsZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZyhwb3MgKyAxKTtcclxuXHJcbiAgICAgIGlmIChidWlsZCAhPT0gdHJ1ZSAmJiBTTEQgJiYgU0xELmxpc3RbdGxkLnRvTG93ZXJDYXNlKCldKSB7XHJcbiAgICAgICAgcmV0dXJuIFNMRC5nZXQodGhpcy5fcGFydHMuaG9zdG5hbWUpIHx8IHRsZDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHRsZDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciByZXBsYWNlO1xyXG5cclxuICAgICAgaWYgKCF2KSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2Fubm90IHNldCBUTEQgZW1wdHknKTtcclxuICAgICAgfSBlbHNlIGlmICh2Lm1hdGNoKC9bXmEtekEtWjAtOS1dLykpIHtcclxuICAgICAgICBpZiAoU0xEICYmIFNMRC5pcyh2KSkge1xyXG4gICAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xyXG4gICAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUTEQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOV0nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2Nhbm5vdCBzZXQgVExEIG9uIG5vbi1kb21haW4gaG9zdCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KHRoaXMudGxkKCkpICsgJyQnKTtcclxuICAgICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwLmRpcmVjdG9yeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XHJcbiAgICAgIGlmICghdGhpcy5fcGFydHMucGF0aCAmJiAhdGhpcy5fcGFydHMuaG9zdG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcclxuICAgICAgICByZXR1cm4gJy8nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoIC0gMTtcclxuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKDAsIGVuZCkgfHwgKHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gJy8nIDogJycpO1xyXG5cclxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aChyZXMpIDogcmVzO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoO1xyXG4gICAgICB2YXIgZGlyZWN0b3J5ID0gdGhpcy5fcGFydHMucGF0aC5zdWJzdHJpbmcoMCwgZSk7XHJcbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVSZWdFeChkaXJlY3RvcnkpKTtcclxuXHJcbiAgICAgIC8vIGZ1bGx5IHF1YWxpZmllciBkaXJlY3RvcmllcyBiZWdpbiB3aXRoIGEgc2xhc2hcclxuICAgICAgaWYgKCF0aGlzLmlzKCdyZWxhdGl2ZScpKSB7XHJcbiAgICAgICAgaWYgKCF2KSB7XHJcbiAgICAgICAgICB2ID0gJy8nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHYuY2hhckF0KDApICE9PSAnLycpIHtcclxuICAgICAgICAgIHYgPSAnLycgKyB2O1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gZGlyZWN0b3JpZXMgYWx3YXlzIGVuZCB3aXRoIGEgc2xhc2hcclxuICAgICAgaWYgKHYgJiYgdi5jaGFyQXQodi5sZW5ndGggLSAxKSAhPT0gJy8nKSB7XHJcbiAgICAgICAgdiArPSAnLyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHYgPSBVUkkucmVjb2RlUGF0aCh2KTtcclxuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcclxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICB9O1xyXG4gIHAuZmlsZW5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xyXG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xyXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggfHwgdGhpcy5fcGFydHMucGF0aCA9PT0gJy8nKSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMucGF0aC5sYXN0SW5kZXhPZignLycpO1xyXG4gICAgICB2YXIgcmVzID0gdGhpcy5fcGFydHMucGF0aC5zdWJzdHJpbmcocG9zKzEpO1xyXG5cclxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBtdXRhdGVkRGlyZWN0b3J5ID0gZmFsc2U7XHJcblxyXG4gICAgICBpZiAodi5jaGFyQXQoMCkgPT09ICcvJykge1xyXG4gICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHYubWF0Y2goL1xcLj9cXC8vKSkge1xyXG4gICAgICAgIG11dGF0ZWREaXJlY3RvcnkgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy5maWxlbmFtZSgpKSArICckJyk7XHJcbiAgICAgIHYgPSBVUkkucmVjb2RlUGF0aCh2KTtcclxuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcclxuXHJcbiAgICAgIGlmIChtdXRhdGVkRGlyZWN0b3J5KSB7XHJcbiAgICAgICAgdGhpcy5ub3JtYWxpemVQYXRoKGJ1aWxkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgcC5zdWZmaXggPSBmdW5jdGlvbih2LCBidWlsZCkge1xyXG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xyXG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xyXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggfHwgdGhpcy5fcGFydHMucGF0aCA9PT0gJy8nKSB7XHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZmlsZW5hbWUgPSB0aGlzLmZpbGVuYW1lKCk7XHJcbiAgICAgIHZhciBwb3MgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpO1xyXG4gICAgICB2YXIgcywgcmVzO1xyXG5cclxuICAgICAgaWYgKHBvcyA9PT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIHN1ZmZpeCBtYXkgb25seSBjb250YWluIGFsbnVtIGNoYXJhY3RlcnMgKHl1cCwgSSBtYWRlIHRoaXMgdXAuKVxyXG4gICAgICBzID0gZmlsZW5hbWUuc3Vic3RyaW5nKHBvcysxKTtcclxuICAgICAgcmVzID0gKC9eW2EtejAtOSVdKyQvaSkudGVzdChzKSA/IHMgOiAnJztcclxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh2LmNoYXJBdCgwKSA9PT0gJy4nKSB7XHJcbiAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgc3VmZml4ID0gdGhpcy5zdWZmaXgoKTtcclxuICAgICAgdmFyIHJlcGxhY2U7XHJcblxyXG4gICAgICBpZiAoIXN1ZmZpeCkge1xyXG4gICAgICAgIGlmICghdikge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoICs9ICcuJyArIFVSSS5yZWNvZGVQYXRoKHYpO1xyXG4gICAgICB9IGVsc2UgaWYgKCF2KSB7XHJcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgoJy4nICsgc3VmZml4KSArICckJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgoc3VmZml4KSArICckJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZXBsYWNlKSB7XHJcbiAgICAgICAgdiA9IFVSSS5yZWNvZGVQYXRoKHYpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB0aGlzLl9wYXJ0cy5wYXRoLnJlcGxhY2UocmVwbGFjZSwgdik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgfTtcclxuICBwLnNlZ21lbnQgPSBmdW5jdGlvbihzZWdtZW50LCB2LCBidWlsZCkge1xyXG4gICAgdmFyIHNlcGFyYXRvciA9IHRoaXMuX3BhcnRzLnVybiA/ICc6JyA6ICcvJztcclxuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCk7XHJcbiAgICB2YXIgYWJzb2x1dGUgPSBwYXRoLnN1YnN0cmluZygwLCAxKSA9PT0gJy8nO1xyXG4gICAgdmFyIHNlZ21lbnRzID0gcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xyXG5cclxuICAgIGlmIChzZWdtZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIGJ1aWxkID0gdjtcclxuICAgICAgdiA9IHNlZ21lbnQ7XHJcbiAgICAgIHNlZ21lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlZ21lbnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygc2VnbWVudCAhPT0gJ251bWJlcicpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdCYWQgc2VnbWVudCBcIicgKyBzZWdtZW50ICsgJ1wiLCBtdXN0IGJlIDAtYmFzZWQgaW50ZWdlcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhYnNvbHV0ZSkge1xyXG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzZWdtZW50IDwgMCkge1xyXG4gICAgICAvLyBhbGxvdyBuZWdhdGl2ZSBpbmRleGVzIHRvIGFkZHJlc3MgZnJvbSB0aGUgZW5kXHJcbiAgICAgIHNlZ21lbnQgPSBNYXRoLm1heChzZWdtZW50cy5sZW5ndGggKyBzZWdtZW50LCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiB0cnVlICovXHJcbiAgICAgIHJldHVybiBzZWdtZW50ID09PSB1bmRlZmluZWRcclxuICAgICAgICA/IHNlZ21lbnRzXHJcbiAgICAgICAgOiBzZWdtZW50c1tzZWdtZW50XTtcclxuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IGZhbHNlICovXHJcbiAgICB9IGVsc2UgaWYgKHNlZ21lbnQgPT09IG51bGwgfHwgc2VnbWVudHNbc2VnbWVudF0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoaXNBcnJheSh2KSkge1xyXG4gICAgICAgIHNlZ21lbnRzID0gW107XHJcbiAgICAgICAgLy8gY29sbGFwc2UgZW1wdHkgZWxlbWVudHMgd2l0aGluIGFycmF5XHJcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPXYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAoIXZbaV0ubGVuZ3RoICYmICghc2VnbWVudHMubGVuZ3RoIHx8ICFzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdLmxlbmd0aCkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCAmJiAhc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgc2VnbWVudHMucG9wKCk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgc2VnbWVudHMucHVzaCh0cmltU2xhc2hlcyh2W2ldKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHYgfHwgdHlwZW9mIHYgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgdiA9IHRyaW1TbGFzaGVzKHYpO1xyXG4gICAgICAgIGlmIChzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdID09PSAnJykge1xyXG4gICAgICAgICAgLy8gZW1wdHkgdHJhaWxpbmcgZWxlbWVudHMgaGF2ZSB0byBiZSBvdmVyd3JpdHRlblxyXG4gICAgICAgICAgLy8gdG8gcHJldmVudCByZXN1bHRzIHN1Y2ggYXMgL2Zvby8vYmFyXHJcbiAgICAgICAgICBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdID0gdjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgc2VnbWVudHNbc2VnbWVudF0gPSB0cmltU2xhc2hlcyh2KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudCwgMSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWJzb2x1dGUpIHtcclxuICAgICAgc2VnbWVudHMudW5zaGlmdCgnJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMucGF0aChzZWdtZW50cy5qb2luKHNlcGFyYXRvciksIGJ1aWxkKTtcclxuICB9O1xyXG4gIHAuc2VnbWVudENvZGVkID0gZnVuY3Rpb24oc2VnbWVudCwgdiwgYnVpbGQpIHtcclxuICAgIHZhciBzZWdtZW50cywgaSwgbDtcclxuXHJcbiAgICBpZiAodHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XHJcbiAgICAgIGJ1aWxkID0gdjtcclxuICAgICAgdiA9IHNlZ21lbnQ7XHJcbiAgICAgIHNlZ21lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBzZWdtZW50cyA9IHRoaXMuc2VnbWVudChzZWdtZW50LCB2LCBidWlsZCk7XHJcbiAgICAgIGlmICghaXNBcnJheShzZWdtZW50cykpIHtcclxuICAgICAgICBzZWdtZW50cyA9IHNlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBVUkkuZGVjb2RlKHNlZ21lbnRzKSA6IHVuZGVmaW5lZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3IgKGkgPSAwLCBsID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICBzZWdtZW50c1tpXSA9IFVSSS5kZWNvZGUoc2VnbWVudHNbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHNlZ21lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghaXNBcnJheSh2KSkge1xyXG4gICAgICB2ID0gKHR5cGVvZiB2ID09PSAnc3RyaW5nJyB8fCB2IGluc3RhbmNlb2YgU3RyaW5nKSA/IFVSSS5lbmNvZGUodikgOiB2O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZm9yIChpID0gMCwgbCA9IHYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgdltpXSA9IFVSSS5lbmNvZGUodltpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5zZWdtZW50KHNlZ21lbnQsIHYsIGJ1aWxkKTtcclxuICB9O1xyXG5cclxuICAvLyBtdXRhdGluZyBxdWVyeSBzdHJpbmdcclxuICB2YXIgcSA9IHAucXVlcnk7XHJcbiAgcC5xdWVyeSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XHJcbiAgICBpZiAodiA9PT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcclxuICAgICAgdmFyIHJlc3VsdCA9IHYuY2FsbCh0aGlzLCBkYXRhKTtcclxuICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShyZXN1bHQgfHwgZGF0YSwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcclxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH0gZWxzZSBpZiAodiAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiB2ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KHYsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcS5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHAuc2V0UXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgYnVpbGQpIHtcclxuICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgfHwgbmFtZSBpbnN0YW5jZW9mIFN0cmluZykge1xyXG4gICAgICBkYXRhW25hbWVdID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDogbnVsbDtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XHJcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKG5hbWUsIGtleSkpIHtcclxuICAgICAgICAgIGRhdGFba2V5XSA9IG5hbWVba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5hZGRRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcgYXMgdGhlIG5hbWUgcGFyYW1ldGVyJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xyXG4gICAgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xyXG4gICAgICBidWlsZCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcbiAgcC5hZGRRdWVyeSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBidWlsZCkge1xyXG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICBVUkkuYWRkUXVlcnkoZGF0YSwgbmFtZSwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2YWx1ZSk7XHJcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGJ1aWxkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuICBwLnJlbW92ZVF1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGJ1aWxkKSB7XHJcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcclxuICAgIFVSSS5yZW1vdmVRdWVyeShkYXRhLCBuYW1lLCB2YWx1ZSk7XHJcbiAgICB0aGlzLl9wYXJ0cy5xdWVyeSA9IFVSSS5idWlsZFF1ZXJ5KGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XHJcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIGJ1aWxkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuICBwLmhhc1F1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHdpdGhpbkFycmF5KSB7XHJcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcclxuICAgIHJldHVybiBVUkkuaGFzUXVlcnkoZGF0YSwgbmFtZSwgdmFsdWUsIHdpdGhpbkFycmF5KTtcclxuICB9O1xyXG4gIHAuc2V0U2VhcmNoID0gcC5zZXRRdWVyeTtcclxuICBwLmFkZFNlYXJjaCA9IHAuYWRkUXVlcnk7XHJcbiAgcC5yZW1vdmVTZWFyY2ggPSBwLnJlbW92ZVF1ZXJ5O1xyXG4gIHAuaGFzU2VhcmNoID0gcC5oYXNRdWVyeTtcclxuXHJcbiAgLy8gc2FuaXRpemluZyBVUkxzXHJcbiAgcC5ub3JtYWxpemUgPSBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXHJcbiAgICAgICAgLm5vcm1hbGl6ZVBhdGgoZmFsc2UpXHJcbiAgICAgICAgLm5vcm1hbGl6ZVF1ZXJ5KGZhbHNlKVxyXG4gICAgICAgIC5ub3JtYWxpemVGcmFnbWVudChmYWxzZSlcclxuICAgICAgICAuYnVpbGQoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpc1xyXG4gICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXHJcbiAgICAgIC5ub3JtYWxpemVIb3N0bmFtZShmYWxzZSlcclxuICAgICAgLm5vcm1hbGl6ZVBvcnQoZmFsc2UpXHJcbiAgICAgIC5ub3JtYWxpemVQYXRoKGZhbHNlKVxyXG4gICAgICAubm9ybWFsaXplUXVlcnkoZmFsc2UpXHJcbiAgICAgIC5ub3JtYWxpemVGcmFnbWVudChmYWxzZSlcclxuICAgICAgLmJ1aWxkKCk7XHJcbiAgfTtcclxuICBwLm5vcm1hbGl6ZVByb3RvY29sID0gZnVuY3Rpb24oYnVpbGQpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcy5fcGFydHMucHJvdG9jb2wgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHRoaXMuX3BhcnRzLnByb3RvY29sID0gdGhpcy5fcGFydHMucHJvdG9jb2wudG9Mb3dlckNhc2UoKTtcclxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcbiAgcC5ub3JtYWxpemVIb3N0bmFtZSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XHJcbiAgICBpZiAodGhpcy5fcGFydHMuaG9zdG5hbWUpIHtcclxuICAgICAgaWYgKHRoaXMuaXMoJ0lETicpICYmIHB1bnljb2RlKSB7XHJcbiAgICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSBwdW55Y29kZS50b0FTQ0lJKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmlzKCdJUHY2JykgJiYgSVB2Nikge1xyXG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gSVB2Ni5iZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuICBwLm5vcm1hbGl6ZVBvcnQgPSBmdW5jdGlvbihidWlsZCkge1xyXG4gICAgLy8gcmVtb3ZlIHBvcnQgb2YgaXQncyB0aGUgcHJvdG9jb2wncyBkZWZhdWx0XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX3BhcnRzLnByb3RvY29sID09PSAnc3RyaW5nJyAmJiB0aGlzLl9wYXJ0cy5wb3J0ID09PSBVUkkuZGVmYXVsdFBvcnRzW3RoaXMuX3BhcnRzLnByb3RvY29sXSkge1xyXG4gICAgICB0aGlzLl9wYXJ0cy5wb3J0ID0gbnVsbDtcclxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcbiAgcC5ub3JtYWxpemVQYXRoID0gZnVuY3Rpb24oYnVpbGQpIHtcclxuICAgIHZhciBfcGF0aCA9IHRoaXMuX3BhcnRzLnBhdGg7XHJcbiAgICBpZiAoIV9wYXRoKSB7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcclxuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IFVSSS5yZWNvZGVVcm5QYXRoKHRoaXMuX3BhcnRzLnBhdGgpO1xyXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIF93YXNfcmVsYXRpdmU7XHJcbiAgICB2YXIgX2xlYWRpbmdQYXJlbnRzID0gJyc7XHJcbiAgICB2YXIgX3BhcmVudCwgX3BvcztcclxuXHJcbiAgICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHNcclxuICAgIGlmIChfcGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xyXG4gICAgICBfd2FzX3JlbGF0aXZlID0gdHJ1ZTtcclxuICAgICAgX3BhdGggPSAnLycgKyBfcGF0aDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBoYW5kbGUgcmVsYXRpdmUgZmlsZXMgKGFzIG9wcG9zZWQgdG8gZGlyZWN0b3JpZXMpXHJcbiAgICBpZiAoX3BhdGguc2xpY2UoLTMpID09PSAnLy4uJyB8fCBfcGF0aC5zbGljZSgtMikgPT09ICcvLicpIHtcclxuICAgICAgX3BhdGggKz0gJy8nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlc29sdmUgc2ltcGxlc1xyXG4gICAgX3BhdGggPSBfcGF0aFxyXG4gICAgICAucmVwbGFjZSgvKFxcLyhcXC5cXC8pKyl8KFxcL1xcLiQpL2csICcvJylcclxuICAgICAgLnJlcGxhY2UoL1xcL3syLH0vZywgJy8nKTtcclxuXHJcbiAgICAvLyByZW1lbWJlciBsZWFkaW5nIHBhcmVudHNcclxuICAgIGlmIChfd2FzX3JlbGF0aXZlKSB7XHJcbiAgICAgIF9sZWFkaW5nUGFyZW50cyA9IF9wYXRoLnN1YnN0cmluZygxKS5tYXRjaCgvXihcXC5cXC5cXC8pKy8pIHx8ICcnO1xyXG4gICAgICBpZiAoX2xlYWRpbmdQYXJlbnRzKSB7XHJcbiAgICAgICAgX2xlYWRpbmdQYXJlbnRzID0gX2xlYWRpbmdQYXJlbnRzWzBdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcmVzb2x2ZSBwYXJlbnRzXHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICBfcGFyZW50ID0gX3BhdGguaW5kZXhPZignLy4uJyk7XHJcbiAgICAgIGlmIChfcGFyZW50ID09PSAtMSkge1xyXG4gICAgICAgIC8vIG5vIG1vcmUgLi4vIHRvIHJlc29sdmVcclxuICAgICAgICBicmVhaztcclxuICAgICAgfSBlbHNlIGlmIChfcGFyZW50ID09PSAwKSB7XHJcbiAgICAgICAgLy8gdG9wIGxldmVsIGNhbm5vdCBiZSByZWxhdGl2ZSwgc2tpcCBpdFxyXG4gICAgICAgIF9wYXRoID0gX3BhdGguc3Vic3RyaW5nKDMpO1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBfcG9zID0gX3BhdGguc3Vic3RyaW5nKDAsIF9wYXJlbnQpLmxhc3RJbmRleE9mKCcvJyk7XHJcbiAgICAgIGlmIChfcG9zID09PSAtMSkge1xyXG4gICAgICAgIF9wb3MgPSBfcGFyZW50O1xyXG4gICAgICB9XHJcbiAgICAgIF9wYXRoID0gX3BhdGguc3Vic3RyaW5nKDAsIF9wb3MpICsgX3BhdGguc3Vic3RyaW5nKF9wYXJlbnQgKyAzKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyByZXZlcnQgdG8gcmVsYXRpdmVcclxuICAgIGlmIChfd2FzX3JlbGF0aXZlICYmIHRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcclxuICAgICAgX3BhdGggPSBfbGVhZGluZ1BhcmVudHMgKyBfcGF0aC5zdWJzdHJpbmcoMSk7XHJcbiAgICB9XHJcblxyXG4gICAgX3BhdGggPSBVUkkucmVjb2RlUGF0aChfcGF0aCk7XHJcbiAgICB0aGlzLl9wYXJ0cy5wYXRoID0gX3BhdGg7XHJcbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG4gIHAubm9ybWFsaXplUGF0aG5hbWUgPSBwLm5vcm1hbGl6ZVBhdGg7XHJcbiAgcC5ub3JtYWxpemVRdWVyeSA9IGZ1bmN0aW9uKGJ1aWxkKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMuX3BhcnRzLnF1ZXJ5ID09PSAnc3RyaW5nJykge1xyXG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnF1ZXJ5Lmxlbmd0aCkge1xyXG4gICAgICAgIHRoaXMuX3BhcnRzLnF1ZXJ5ID0gbnVsbDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnF1ZXJ5KFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG4gIHAubm9ybWFsaXplRnJhZ21lbnQgPSBmdW5jdGlvbihidWlsZCkge1xyXG4gICAgaWYgKCF0aGlzLl9wYXJ0cy5mcmFnbWVudCkge1xyXG4gICAgICB0aGlzLl9wYXJ0cy5mcmFnbWVudCA9IG51bGw7XHJcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG4gIHAubm9ybWFsaXplU2VhcmNoID0gcC5ub3JtYWxpemVRdWVyeTtcclxuICBwLm5vcm1hbGl6ZUhhc2ggPSBwLm5vcm1hbGl6ZUZyYWdtZW50O1xyXG5cclxuICBwLmlzbzg4NTkgPSBmdW5jdGlvbigpIHtcclxuICAgIC8vIGV4cGVjdCB1bmljb2RlIGlucHV0LCBpc284ODU5IG91dHB1dFxyXG4gICAgdmFyIGUgPSBVUkkuZW5jb2RlO1xyXG4gICAgdmFyIGQgPSBVUkkuZGVjb2RlO1xyXG5cclxuICAgIFVSSS5lbmNvZGUgPSBlc2NhcGU7XHJcbiAgICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xyXG4gICAgdHJ5IHtcclxuICAgICAgdGhpcy5ub3JtYWxpemUoKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIFVSSS5lbmNvZGUgPSBlO1xyXG4gICAgICBVUkkuZGVjb2RlID0gZDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH07XHJcblxyXG4gIHAudW5pY29kZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gZXhwZWN0IGlzbzg4NTkgaW5wdXQsIHVuaWNvZGUgb3V0cHV0XHJcbiAgICB2YXIgZSA9IFVSSS5lbmNvZGU7XHJcbiAgICB2YXIgZCA9IFVSSS5kZWNvZGU7XHJcblxyXG4gICAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcclxuICAgIFVSSS5kZWNvZGUgPSB1bmVzY2FwZTtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMubm9ybWFsaXplKCk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBVUkkuZW5jb2RlID0gZTtcclxuICAgICAgVVJJLmRlY29kZSA9IGQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBwLnJlYWRhYmxlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdXJpID0gdGhpcy5jbG9uZSgpO1xyXG4gICAgLy8gcmVtb3ZpbmcgdXNlcm5hbWUsIHBhc3N3b3JkLCBiZWNhdXNlIHRoZXkgc2hvdWxkbid0IGJlIGRpc3BsYXllZCBhY2NvcmRpbmcgdG8gUkZDIDM5ODZcclxuICAgIHVyaS51c2VybmFtZSgnJykucGFzc3dvcmQoJycpLm5vcm1hbGl6ZSgpO1xyXG4gICAgdmFyIHQgPSAnJztcclxuICAgIGlmICh1cmkuX3BhcnRzLnByb3RvY29sKSB7XHJcbiAgICAgIHQgKz0gdXJpLl9wYXJ0cy5wcm90b2NvbCArICc6Ly8nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh1cmkuX3BhcnRzLmhvc3RuYW1lKSB7XHJcbiAgICAgIGlmICh1cmkuaXMoJ3B1bnljb2RlJykgJiYgcHVueWNvZGUpIHtcclxuICAgICAgICB0ICs9IHB1bnljb2RlLnRvVW5pY29kZSh1cmkuX3BhcnRzLmhvc3RuYW1lKTtcclxuICAgICAgICBpZiAodXJpLl9wYXJ0cy5wb3J0KSB7XHJcbiAgICAgICAgICB0ICs9ICc6JyArIHVyaS5fcGFydHMucG9ydDtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdCArPSB1cmkuaG9zdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHVyaS5fcGFydHMuaG9zdG5hbWUgJiYgdXJpLl9wYXJ0cy5wYXRoICYmIHVyaS5fcGFydHMucGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xyXG4gICAgICB0ICs9ICcvJztcclxuICAgIH1cclxuXHJcbiAgICB0ICs9IHVyaS5wYXRoKHRydWUpO1xyXG4gICAgaWYgKHVyaS5fcGFydHMucXVlcnkpIHtcclxuICAgICAgdmFyIHEgPSAnJztcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIHFwID0gdXJpLl9wYXJ0cy5xdWVyeS5zcGxpdCgnJicpLCBsID0gcXAubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIGt2ID0gKHFwW2ldIHx8ICcnKS5zcGxpdCgnPScpO1xyXG4gICAgICAgIHEgKz0gJyYnICsgVVJJLmRlY29kZVF1ZXJ5KGt2WzBdLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKVxyXG4gICAgICAgICAgLnJlcGxhY2UoLyYvZywgJyUyNicpO1xyXG5cclxuICAgICAgICBpZiAoa3ZbMV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgcSArPSAnPScgKyBVUkkuZGVjb2RlUXVlcnkoa3ZbMV0sIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpXHJcbiAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csICclMjYnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdCArPSAnPycgKyBxLnN1YnN0cmluZygxKTtcclxuICAgIH1cclxuXHJcbiAgICB0ICs9IFVSSS5kZWNvZGVRdWVyeSh1cmkuaGFzaCgpLCB0cnVlKTtcclxuICAgIHJldHVybiB0O1xyXG4gIH07XHJcblxyXG4gIC8vIHJlc29sdmluZyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgVVJMc1xyXG4gIHAuYWJzb2x1dGVUbyA9IGZ1bmN0aW9uKGJhc2UpIHtcclxuICAgIHZhciByZXNvbHZlZCA9IHRoaXMuY2xvbmUoKTtcclxuICAgIHZhciBwcm9wZXJ0aWVzID0gWydwcm90b2NvbCcsICd1c2VybmFtZScsICdwYXNzd29yZCcsICdob3N0bmFtZScsICdwb3J0J107XHJcbiAgICB2YXIgYmFzZWRpciwgaSwgcDtcclxuXHJcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJOcyBkbyBub3QgaGF2ZSBhbnkgZ2VuZXJhbGx5IGRlZmluZWQgaGllcmFyY2hpY2FsIGNvbXBvbmVudHMnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIShiYXNlIGluc3RhbmNlb2YgVVJJKSkge1xyXG4gICAgICBiYXNlID0gbmV3IFVSSShiYXNlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJlc29sdmVkLl9wYXJ0cy5wcm90b2NvbCkge1xyXG4gICAgICByZXNvbHZlZC5fcGFydHMucHJvdG9jb2wgPSBiYXNlLl9wYXJ0cy5wcm90b2NvbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5fcGFydHMuaG9zdG5hbWUpIHtcclxuICAgICAgcmV0dXJuIHJlc29sdmVkO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoaSA9IDA7IChwID0gcHJvcGVydGllc1tpXSk7IGkrKykge1xyXG4gICAgICByZXNvbHZlZC5fcGFydHNbcF0gPSBiYXNlLl9wYXJ0c1twXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXJlc29sdmVkLl9wYXJ0cy5wYXRoKSB7XHJcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoID0gYmFzZS5fcGFydHMucGF0aDtcclxuICAgICAgaWYgKCFyZXNvbHZlZC5fcGFydHMucXVlcnkpIHtcclxuICAgICAgICByZXNvbHZlZC5fcGFydHMucXVlcnkgPSBiYXNlLl9wYXJ0cy5xdWVyeTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChyZXNvbHZlZC5fcGFydHMucGF0aC5zdWJzdHJpbmcoLTIpID09PSAnLi4nKSB7XHJcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoICs9ICcvJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVzb2x2ZWQucGF0aCgpLmNoYXJBdCgwKSAhPT0gJy8nKSB7XHJcbiAgICAgIGJhc2VkaXIgPSBiYXNlLmRpcmVjdG9yeSgpO1xyXG4gICAgICBiYXNlZGlyID0gYmFzZWRpciA/IGJhc2VkaXIgOiBiYXNlLnBhdGgoKS5pbmRleE9mKCcvJykgPT09IDAgPyAnLycgOiAnJztcclxuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnBhdGggPSAoYmFzZWRpciA/IChiYXNlZGlyICsgJy8nKSA6ICcnKSArIHJlc29sdmVkLl9wYXJ0cy5wYXRoO1xyXG4gICAgICByZXNvbHZlZC5ub3JtYWxpemVQYXRoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZWQuYnVpbGQoKTtcclxuICAgIHJldHVybiByZXNvbHZlZDtcclxuICB9O1xyXG4gIHAucmVsYXRpdmVUbyA9IGZ1bmN0aW9uKGJhc2UpIHtcclxuICAgIHZhciByZWxhdGl2ZSA9IHRoaXMuY2xvbmUoKS5ub3JtYWxpemUoKTtcclxuICAgIHZhciByZWxhdGl2ZVBhcnRzLCBiYXNlUGFydHMsIGNvbW1vbiwgcmVsYXRpdmVQYXRoLCBiYXNlUGF0aDtcclxuXHJcbiAgICBpZiAocmVsYXRpdmUuX3BhcnRzLnVybikge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VSTnMgZG8gbm90IGhhdmUgYW55IGdlbmVyYWxseSBkZWZpbmVkIGhpZXJhcmNoaWNhbCBjb21wb25lbnRzJyk7XHJcbiAgICB9XHJcblxyXG4gICAgYmFzZSA9IG5ldyBVUkkoYmFzZSkubm9ybWFsaXplKCk7XHJcbiAgICByZWxhdGl2ZVBhcnRzID0gcmVsYXRpdmUuX3BhcnRzO1xyXG4gICAgYmFzZVBhcnRzID0gYmFzZS5fcGFydHM7XHJcbiAgICByZWxhdGl2ZVBhdGggPSByZWxhdGl2ZS5wYXRoKCk7XHJcbiAgICBiYXNlUGF0aCA9IGJhc2UucGF0aCgpO1xyXG5cclxuICAgIGlmIChyZWxhdGl2ZVBhdGguY2hhckF0KDApICE9PSAnLycpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUkkgaXMgYWxyZWFkeSByZWxhdGl2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiYXNlUGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjYWxjdWxhdGUgYSBVUkkgcmVsYXRpdmUgdG8gYW5vdGhlciByZWxhdGl2ZSBVUkknKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5wcm90b2NvbCA9PT0gYmFzZVBhcnRzLnByb3RvY29sKSB7XHJcbiAgICAgIHJlbGF0aXZlUGFydHMucHJvdG9jb2wgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLnVzZXJuYW1lICE9PSBiYXNlUGFydHMudXNlcm5hbWUgfHwgcmVsYXRpdmVQYXJ0cy5wYXNzd29yZCAhPT0gYmFzZVBhcnRzLnBhc3N3b3JkKSB7XHJcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLnByb3RvY29sICE9PSBudWxsIHx8IHJlbGF0aXZlUGFydHMudXNlcm5hbWUgIT09IG51bGwgfHwgcmVsYXRpdmVQYXJ0cy5wYXNzd29yZCAhPT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVsYXRpdmVQYXJ0cy5ob3N0bmFtZSA9PT0gYmFzZVBhcnRzLmhvc3RuYW1lICYmIHJlbGF0aXZlUGFydHMucG9ydCA9PT0gYmFzZVBhcnRzLnBvcnQpIHtcclxuICAgICAgcmVsYXRpdmVQYXJ0cy5ob3N0bmFtZSA9IG51bGw7XHJcbiAgICAgIHJlbGF0aXZlUGFydHMucG9ydCA9IG51bGw7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gcmVsYXRpdmUuYnVpbGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocmVsYXRpdmVQYXRoID09PSBiYXNlUGF0aCkge1xyXG4gICAgICByZWxhdGl2ZVBhcnRzLnBhdGggPSAnJztcclxuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGV0ZXJtaW5lIGNvbW1vbiBzdWIgcGF0aFxyXG4gICAgY29tbW9uID0gVVJJLmNvbW1vblBhdGgocmVsYXRpdmVQYXRoLCBiYXNlUGF0aCk7XHJcblxyXG4gICAgLy8gSWYgdGhlIHBhdGhzIGhhdmUgbm90aGluZyBpbiBjb21tb24sIHJldHVybiBhIHJlbGF0aXZlIFVSTCB3aXRoIHRoZSBhYnNvbHV0ZSBwYXRoLlxyXG4gICAgaWYgKCFjb21tb24pIHtcclxuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcmVudHMgPSBiYXNlUGFydHMucGF0aFxyXG4gICAgICAuc3Vic3RyaW5nKGNvbW1vbi5sZW5ndGgpXHJcbiAgICAgIC5yZXBsYWNlKC9bXlxcL10qJC8sICcnKVxyXG4gICAgICAucmVwbGFjZSgvLio/XFwvL2csICcuLi8nKTtcclxuXHJcbiAgICByZWxhdGl2ZVBhcnRzLnBhdGggPSAocGFyZW50cyArIHJlbGF0aXZlUGFydHMucGF0aC5zdWJzdHJpbmcoY29tbW9uLmxlbmd0aCkpIHx8ICcuLyc7XHJcblxyXG4gICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XHJcbiAgfTtcclxuXHJcbiAgLy8gY29tcGFyaW5nIFVSSXNcclxuICBwLmVxdWFscyA9IGZ1bmN0aW9uKHVyaSkge1xyXG4gICAgdmFyIG9uZSA9IHRoaXMuY2xvbmUoKTtcclxuICAgIHZhciB0d28gPSBuZXcgVVJJKHVyaSk7XHJcbiAgICB2YXIgb25lX21hcCA9IHt9O1xyXG4gICAgdmFyIHR3b19tYXAgPSB7fTtcclxuICAgIHZhciBjaGVja2VkID0ge307XHJcbiAgICB2YXIgb25lX3F1ZXJ5LCB0d29fcXVlcnksIGtleTtcclxuXHJcbiAgICBvbmUubm9ybWFsaXplKCk7XHJcbiAgICB0d28ubm9ybWFsaXplKCk7XHJcblxyXG4gICAgLy8gZXhhY3QgbWF0Y2hcclxuICAgIGlmIChvbmUudG9TdHJpbmcoKSA9PT0gdHdvLnRvU3RyaW5nKCkpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZXh0cmFjdCBxdWVyeSBzdHJpbmdcclxuICAgIG9uZV9xdWVyeSA9IG9uZS5xdWVyeSgpO1xyXG4gICAgdHdvX3F1ZXJ5ID0gdHdvLnF1ZXJ5KCk7XHJcbiAgICBvbmUucXVlcnkoJycpO1xyXG4gICAgdHdvLnF1ZXJ5KCcnKTtcclxuXHJcbiAgICAvLyBkZWZpbml0ZWx5IG5vdCBlcXVhbCBpZiBub3QgZXZlbiBub24tcXVlcnkgcGFydHMgbWF0Y2hcclxuICAgIGlmIChvbmUudG9TdHJpbmcoKSAhPT0gdHdvLnRvU3RyaW5nKCkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHF1ZXJ5IHBhcmFtZXRlcnMgaGF2ZSB0aGUgc2FtZSBsZW5ndGgsIGV2ZW4gaWYgdGhleSdyZSBwZXJtdXRlZFxyXG4gICAgaWYgKG9uZV9xdWVyeS5sZW5ndGggIT09IHR3b19xdWVyeS5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uZV9tYXAgPSBVUkkucGFyc2VRdWVyeShvbmVfcXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xyXG4gICAgdHdvX21hcCA9IFVSSS5wYXJzZVF1ZXJ5KHR3b19xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XHJcblxyXG4gICAgZm9yIChrZXkgaW4gb25lX21hcCkge1xyXG4gICAgICBpZiAoaGFzT3duLmNhbGwob25lX21hcCwga2V5KSkge1xyXG4gICAgICAgIGlmICghaXNBcnJheShvbmVfbWFwW2tleV0pKSB7XHJcbiAgICAgICAgICBpZiAob25lX21hcFtrZXldICE9PSB0d29fbWFwW2tleV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIWFycmF5c0VxdWFsKG9uZV9tYXBba2V5XSwgdHdvX21hcFtrZXldKSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hlY2tlZFtrZXldID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAoa2V5IGluIHR3b19tYXApIHtcclxuICAgICAgaWYgKGhhc093bi5jYWxsKHR3b19tYXAsIGtleSkpIHtcclxuICAgICAgICBpZiAoIWNoZWNrZWRba2V5XSkge1xyXG4gICAgICAgICAgLy8gdHdvIGNvbnRhaW5zIGEgcGFyYW1ldGVyIG5vdCBwcmVzZW50IGluIG9uZVxyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH07XHJcblxyXG4gIC8vIHN0YXRlXHJcbiAgcC5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSBmdW5jdGlvbih2KSB7XHJcbiAgICB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMgPSAhIXY7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9O1xyXG5cclxuICBwLmVzY2FwZVF1ZXJ5U3BhY2UgPSBmdW5jdGlvbih2KSB7XHJcbiAgICB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlID0gISF2O1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIFVSSTtcclxufSkpO1xyXG4iLCJTdGVlZG9zLnVyaSA9IG5ldyBVUkkoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xyXG5cclxuXy5leHRlbmQgQWNjb3VudHMsXHJcblx0dXBkYXRlUGhvbmU6IChudW1iZXIsY2FsbGJhY2spLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRNZXRlb3IuY2FsbCAndXBkYXRlUGhvbmUnLCB7IG51bWJlciB9XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0TWV0ZW9yLmNhbGwgJ3VwZGF0ZVBob25lJywgeyBudW1iZXIgfSwgY2FsbGJhY2ssXHJcblx0ZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiAoZXhwaXJlZERheXMsY2FsbGJhY2spLT5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRNZXRlb3IuY2FsbCAnZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzJywgZXhwaXJlZERheXNcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRNZXRlb3IuY2FsbCAnZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzJywgZXhwaXJlZERheXMsIGNhbGxiYWNrXHJcblx0Z2V0UGhvbmVOdW1iZXI6IChpc0luY2x1ZGVQcmVmaXgsIHVzZXIpIC0+XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0cGhvbmUgPSBBY2NvdW50cy51c2VyKCk/LnBob25lXHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIHR5cGVvZiB1c2VyID09IFwic3RyaW5nXCJcclxuXHRcdFx0XHRwaG9uZSA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcik/LnBob25lXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRwaG9uZSA9IHVzZXI/LnBob25lXHJcblx0XHR1bmxlc3MgcGhvbmVcclxuXHRcdFx0cmV0dXJuIFwiXCJcclxuXHRcdGlmIGlzSW5jbHVkZVByZWZpeFxyXG5cdFx0XHRyZXR1cm4gcGhvbmUubnVtYmVyXHJcblx0XHRlbHNlXHJcblx0XHRcdHVubGVzcyBwaG9uZS5tb2JpbGVcclxuXHRcdFx0XHQjIOWmguaenOaVsOaNruW6k+S4reS4jeWtmOWcqG1vYmlsZeWAvO+8jOWImeeUqOeul+azleiuoeeul+WHuuS4jeW4puWJjee8gOeahOaJi+acuuWPt1xyXG5cdFx0XHRcdHJldHVybiBFMTY0LmdldFBob25lTnVtYmVyV2l0aG91dFByZWZpeCBwaG9uZS5udW1iZXJcclxuXHRcdFx0cmV0dXJuIHBob25lLm1vYmlsZVxyXG5cdGdldFBob25lUHJlZml4OiAodXNlcikgLT5cclxuXHRcdCMg6L+U5Zue5b2T5YmN55So5oi35omL5py65Y+35YmN57yA77yM5aaC5p6c5om+5LiN5Yiw5YiZ6L+U5Zue6buY6K6k55qEXCIrODZcIlxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCAhdXNlclxyXG5cdFx0XHRwaG9uZSA9IEFjY291bnRzLnVzZXIoKT8ucGhvbmVcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgdHlwZW9mIHVzZXIgPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHRcdHBob25lID0gZGIudXNlcnMuZmluZE9uZSh1c2VyKT8ucGhvbmVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHBob25lID0gdXNlcj8ucGhvbmVcclxuXHRcdHVubGVzcyBwaG9uZVxyXG5cdFx0XHRyZXR1cm4gXCIrODZcIlxyXG5cdFx0aWYgcGhvbmUubW9iaWxlXHJcblx0XHRcdHByZWZpeCA9IHBob25lLm51bWJlci5yZXBsYWNlIHBob25lLm1vYmlsZSwgXCJcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOWmguaenOaVsOaNruW6k+S4reS4jeWtmOWcqG1vYmlsZeWAvO+8jOWImeeUqOeul+azleiuoeeul+WHuuaJi+acuuWPt+WJjee8gFxyXG5cdFx0XHRwcmVmaXggPSBFMTY0LmdldFBob25lUHJlZml4KHBob25lLm51bWJlcilcclxuXHRcdFx0aWYgcHJlZml4XHJcblx0XHRcdFx0cHJlZml4ID0gXCIrI3twcmVmaXh9XCJcclxuXHRcdHJldHVybiBpZiBwcmVmaXggdGhlbiBwcmVmaXggZWxzZSBcIis4NlwiXHJcblxyXG4jIGlmIE1ldGVvci5pc0NsaWVudFxyXG4jIFx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuIyBcdFx0VHJhY2tlci5hdXRvcnVuIChjKS0+XHJcbiMgXHRcdFx0aWYgIU1ldGVvci51c2VySWQoKSBhbmQgIU1ldGVvci5sb2dnaW5nSW4oKVxyXG4jIFx0XHRcdFx0Y3VycmVudFBhdGggPSBGbG93Um91dGVyLmN1cnJlbnQoKS5wYXRoXHJcbiMgXHRcdFx0XHRpZiBjdXJyZW50UGF0aCAhPSB1bmRlZmluZWQgYW5kICEvXlxcL3N0ZWVkb3NcXGIvLnRlc3QoY3VycmVudFBhdGgpXHJcbiMgXHRcdFx0XHRcdCMg5rKh5pyJ55m75b2V5LiU6Lev55Sx5LiN5LulL3N0ZWVkb3PlvIDlpLTliJnot7PovazliLDnmbvlvZXnlYzpnaJcclxuIyBcdFx0XHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcclxuIiwiU3RlZWRvcy51cmkgPSBuZXcgVVJJKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcblxuXy5leHRlbmQoQWNjb3VudHMsIHtcbiAgdXBkYXRlUGhvbmU6IGZ1bmN0aW9uKG51bWJlciwgY2FsbGJhY2spIHtcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBNZXRlb3IuY2FsbCgndXBkYXRlUGhvbmUnLCB7XG4gICAgICAgIG51bWJlcjogbnVtYmVyXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVQaG9uZScsIHtcbiAgICAgICAgbnVtYmVyOiBudW1iZXJcbiAgICAgIH0sIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sXG4gIGRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5czogZnVuY3Rpb24oZXhwaXJlZERheXMsIGNhbGxiYWNrKSB7XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgTWV0ZW9yLmNhbGwoJ2Rpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cycsIGV4cGlyZWREYXlzKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKCdkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXMnLCBleHBpcmVkRGF5cywgY2FsbGJhY2spO1xuICAgIH1cbiAgfSxcbiAgZ2V0UGhvbmVOdW1iZXI6IGZ1bmN0aW9uKGlzSW5jbHVkZVByZWZpeCwgdXNlcikge1xuICAgIHZhciBwaG9uZSwgcmVmLCByZWYxO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHBob25lID0gKHJlZiA9IEFjY291bnRzLnVzZXIoKSkgIT0gbnVsbCA/IHJlZi5waG9uZSA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB1c2VyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHBob25lID0gKHJlZjEgPSBkYi51c2Vycy5maW5kT25lKHVzZXIpKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBob25lID0gdXNlciAhPSBudWxsID8gdXNlci5waG9uZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFwaG9uZSkge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQcmVmaXgpIHtcbiAgICAgIHJldHVybiBwaG9uZS5udW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcGhvbmUubW9iaWxlKSB7XG4gICAgICAgIHJldHVybiBFMTY0LmdldFBob25lTnVtYmVyV2l0aG91dFByZWZpeChwaG9uZS5udW1iZXIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBob25lLm1vYmlsZTtcbiAgICB9XG4gIH0sXG4gIGdldFBob25lUHJlZml4OiBmdW5jdGlvbih1c2VyKSB7XG4gICAgdmFyIHBob25lLCBwcmVmaXgsIHJlZiwgcmVmMTtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICF1c2VyKSB7XG4gICAgICBwaG9uZSA9IChyZWYgPSBBY2NvdW50cy51c2VyKCkpICE9IG51bGwgPyByZWYucGhvbmUgOiB2b2lkIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgdXNlciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBwaG9uZSA9IChyZWYxID0gZGIudXNlcnMuZmluZE9uZSh1c2VyKSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwaG9uZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIucGhvbmUgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcGhvbmUpIHtcbiAgICAgIHJldHVybiBcIis4NlwiO1xuICAgIH1cbiAgICBpZiAocGhvbmUubW9iaWxlKSB7XG4gICAgICBwcmVmaXggPSBwaG9uZS5udW1iZXIucmVwbGFjZShwaG9uZS5tb2JpbGUsIFwiXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXggPSBFMTY0LmdldFBob25lUHJlZml4KHBob25lLm51bWJlcik7XG4gICAgICBpZiAocHJlZml4KSB7XG4gICAgICAgIHByZWZpeCA9IFwiK1wiICsgcHJlZml4O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJlZml4KSB7XG4gICAgICByZXR1cm4gcHJlZml4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCIrODZcIjtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaWYgTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lPy5mb3JjZUFjY291bnRCaW5kUGhvbmVcclxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdE1ldGVvci5tZXRob2RzXHJcblx0XHRcdGNoZWNrRm9yY2VCaW5kUGhvbmU6IChzcGFjZXMpIC0+XHJcblx0XHRcdFx0Y2hlY2sgc3BhY2VzLCBBcnJheVxyXG5cdFx0XHRcdHNwYWNlX3NldHRpbmdzID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZCh7a2V5OlwiY29udGFjdHNfbm9fZm9yY2VfcGhvbmVfdXNlcnNcIixzcGFjZTogeyRpbjogc3BhY2VzfX0pXHJcblx0XHRcdFx0bm9Gb3JjZVVzZXJzID0gW11cclxuXHRcdFx0XHRzcGFjZV9zZXR0aW5ncy5mb3JFYWNoIChuLGkpLT5cclxuXHRcdFx0XHRcdGlmIG4udmFsdWVzPy5sZW5ndGhcclxuXHRcdFx0XHRcdFx0bm9Gb3JjZVVzZXJzID0gXy51bmlvbiBub0ZvcmNlVXNlcnMsIG4udmFsdWVzXHJcblx0XHRcdFx0aWYgbm9Gb3JjZVVzZXJzIGFuZCBub0ZvcmNlVXNlcnMubGVuZ3RoXHJcblx0XHRcdFx0XHRyZXR1cm4gaWYgbm9Gb3JjZVVzZXJzLmluZGV4T2YoTWV0ZW9yLnVzZXJJZCgpKSA+IC0xIHRoZW4gZmFsc2UgZWxzZSB0cnVlXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSBmYWxzZVxyXG5cdFx0Y2hlY2tQaG9uZVN0YXRlRXhwaXJlZCA9IC0+XHJcblx0XHRcdCMg6L+H5pyf5ZCO5oqK57uR5a6a54q25oCB6L+Y5Y6f5Li65pyq57uR5a6aXHJcblx0XHRcdGV4cGlyZWREYXlzID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lPy5leHBpcmVkRGF5c1xyXG5cdFx0XHRpZiBleHBpcmVkRGF5c1xyXG5cdFx0XHRcdEFjY291bnRzLmRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cyhleHBpcmVkRGF5cylcclxuXHRcdFxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRBY2NvdW50cy5vbkxvZ2luICgpLT5cclxuXHRcdFx0XHRpZiBBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxyXG5cdFx0XHRcdFx0Y2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRNZXRlb3Iuc2V0VGltZW91dCAoKS0+XHJcblx0XHRcdFx0XHRpZiBBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxyXG5cdFx0XHRcdFx0XHRjaGVja1Bob25lU3RhdGVFeHBpcmVkKClcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCgpLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJfaWRcIilcclxuXHRcdFx0XHRcdHVubGVzcyBzcGFjZXMubGVuZ3RoXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0TWV0ZW9yLmNhbGwgXCJjaGVja0ZvcmNlQmluZFBob25lXCIsIHNwYWNlcywgKGVycm9yLCByZXN1bHRzKS0+XHJcblx0XHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yKHQoZXJyb3IucmVhc29uKSlcclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSA9IHJlc3VsdHNcclxuXHRcdFx0XHRcdFx0aWYgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lIGFuZCAhQWNjb3VudHMuaXNQaG9uZVZlcmlmaWVkKClcclxuXHRcdFx0XHRcdFx0XHQjIOacqumqjOivgeaJi+acuuWPt+aXtu+8jOW8uuihjOi3s+i9rOWIsOaJi+acuuWPt+e7keWumueVjOmdolxyXG5cdFx0XHRcdFx0XHRcdHNldHVwVXJsID0gXCIvYWNjb3VudHMvc2V0dXAvcGhvbmVcIlxyXG5cdFx0XHRcdFx0XHRcdFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdFx0IyDmmoLml7blhYjlgZzmjonmiYvmnLrlj7flvLrliLbnu5Hlrprlip/og73vvIznrYnlm73pmYXljJbnm7jlhbPlip/og73lrozmiJDlkI7lho3mlL7lvIBcclxuXHRcdFx0XHRcdFx0XHQjIHFoZOimgeaxguaUvuW8gO+8jENO5Y+R54mI5pys5YmN6KaB5oqK5Zu96ZmF5YyW55u45YWz5Yqf6IO95a6M5oiQ77yM5ZCm5YiZQ07lj5HniYjmnKzliY3ov5jmmK/opoHms6jph4rmjonor6Xlip/og71cclxuXHRcdFx0XHRcdFx0XHRGbG93Um91dGVyLmdvIHNldHVwVXJsXHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRcdFx0XHRyb3V0ZXJQYXRoID0gRmxvd1JvdXRlci5jdXJyZW50KCk/LnBhdGhcclxuXHRcdFx0XHRcdFx0IyDlvZPliY3ot6/nlLHmnKzouqvlsLHlnKjmiYvmnLrpqozor4Hot6/nlLHkuK3liJnkuI3pnIDopoHmj5DphpLmiYvmnLrlj7fmnKrnu5HlrppcclxuXHRcdFx0XHRcdFx0aWYgL15cXC9hY2NvdW50c1xcL3NldHVwXFwvcGhvbmVcXGIvLnRlc3Qgcm91dGVyUGF0aFxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0XHQjIOeZu+W9leebuOWFs+i3r+eUseS4jemcgOimgeaPkOmGkuaJi+acuuWPt+acque7keWumlxyXG5cdFx0XHRcdFx0XHRpZiAvXlxcL3N0ZWVkb3NcXC8vLnRlc3Qgcm91dGVyUGF0aFxyXG5cdFx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0XHRpZiBBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrUGhvbmVTdGF0ZUV4cGlyZWQoKVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0c2V0dXBVcmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiYWNjb3VudHMvc2V0dXAvcGhvbmVcIilcclxuXHRcdFx0XHRcdFx0XHR1bmxlc3MgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lXHJcblx0XHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IobnVsbCx0KFwiYWNjb3VudHNfcGhvbmVfdG9hc3RyX2FsZXJ0XCIpLHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvc2VCdXR0b246IHRydWUsXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRpbWVPdXQ6IDAsXHJcblx0XHRcdFx0XHRcdFx0XHRcdGV4dGVuZGVkVGltZU91dDogMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0b25jbGljazogLT5cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coc2V0dXBVcmwsJ3NldHVwX3Bob25lJylcclxuXHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0LCAyMDAiLCJ2YXIgY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCwgcmVmLCByZWYxLCByZWYyO1xuXG5pZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnBob25lKSAhPSBudWxsID8gcmVmMi5mb3JjZUFjY291bnRCaW5kUGhvbmUgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgIGNoZWNrRm9yY2VCaW5kUGhvbmU6IGZ1bmN0aW9uKHNwYWNlcykge1xuICAgICAgICB2YXIgbm9Gb3JjZVVzZXJzLCBzcGFjZV9zZXR0aW5ncztcbiAgICAgICAgY2hlY2soc3BhY2VzLCBBcnJheSk7XG4gICAgICAgIHNwYWNlX3NldHRpbmdzID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZCh7XG4gICAgICAgICAga2V5OiBcImNvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzXCIsXG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbm9Gb3JjZVVzZXJzID0gW107XG4gICAgICAgIHNwYWNlX3NldHRpbmdzLmZvckVhY2goZnVuY3Rpb24obiwgaSkge1xuICAgICAgICAgIHZhciByZWYzO1xuICAgICAgICAgIGlmICgocmVmMyA9IG4udmFsdWVzKSAhPSBudWxsID8gcmVmMy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBub0ZvcmNlVXNlcnMgPSBfLnVuaW9uKG5vRm9yY2VVc2Vycywgbi52YWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChub0ZvcmNlVXNlcnMgJiYgbm9Gb3JjZVVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChub0ZvcmNlVXNlcnMuaW5kZXhPZihNZXRlb3IudXNlcklkKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSBmYWxzZTtcbiAgICBjaGVja1Bob25lU3RhdGVFeHBpcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXhwaXJlZERheXMsIHJlZjMsIHJlZjQsIHJlZjU7XG4gICAgICBleHBpcmVkRGF5cyA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjUgPSByZWY0LnBob25lKSAhPSBudWxsID8gcmVmNS5leHBpcmVkRGF5cyA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChleHBpcmVkRGF5cykge1xuICAgICAgICByZXR1cm4gQWNjb3VudHMuZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzKGV4cGlyZWREYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmICghU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoQWNjb3VudHMuaXNQaG9uZVZlcmlmaWVkKCkpIHtcbiAgICAgICAgICBjaGVja1Bob25lU3RhdGVFeHBpcmVkKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc3BhY2VzO1xuICAgICAgICAgIGlmIChBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKSkge1xuICAgICAgICAgICAgY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCgpLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJfaWRcIik7XG4gICAgICAgICAgaWYgKCFzcGFjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcImNoZWNrRm9yY2VCaW5kUGhvbmVcIiwgc3BhY2VzLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHJlZjMsIHJvdXRlclBhdGgsIHNldHVwVXJsO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcih0KGVycm9yLnJlYXNvbikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gcmVzdWx0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgJiYgIUFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpKSB7XG4gICAgICAgICAgICAgIHNldHVwVXJsID0gXCIvYWNjb3VudHMvc2V0dXAvcGhvbmVcIjtcbiAgICAgICAgICAgICAgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oc2V0dXBVcmwpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3V0ZXJQYXRoID0gKHJlZjMgPSBGbG93Um91dGVyLmN1cnJlbnQoKSkgIT0gbnVsbCA/IHJlZjMucGF0aCA6IHZvaWQgMDtcbiAgICAgICAgICAgIGlmICgvXlxcL2FjY291bnRzXFwvc2V0dXBcXC9waG9uZVxcYi8udGVzdChyb3V0ZXJQYXRoKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoL15cXC9zdGVlZG9zXFwvLy50ZXN0KHJvdXRlclBhdGgpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2V0dXBVcmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiYWNjb3VudHMvc2V0dXAvcGhvbmVcIik7XG4gICAgICAgICAgICAgIGlmICghU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihudWxsLCB0KFwiYWNjb3VudHNfcGhvbmVfdG9hc3RyX2FsZXJ0XCIpLCB7XG4gICAgICAgICAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDAsXG4gICAgICAgICAgICAgICAgICBleHRlbmRlZFRpbWVPdXQ6IDAsXG4gICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyhzZXR1cFVybCwgJ3NldHVwX3Bob25lJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMjAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiIyBPcHRpb25zXG5zZW5kVmVyaWZpY2F0aW9uRW1haWwgPSB0cnVlXG5pZiAhcHJvY2Vzcy5lbnYuTUFJTF9VUkwgfHwgISBQYWNrYWdlW1wiZW1haWxcIl1cbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZmFsc2VcbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVxuICBkZWZhdWx0TGF5b3V0OiAnbG9naW5MYXlvdXQnLFxuICBkZWZhdWx0TGF5b3V0UmVnaW9uczogXG4gICAgbmF2OiAnbG9naW5OYXYnLFxuICBkZWZhdWx0Q29udGVudFJlZ2lvbjogJ21haW4nLFxuXG4gIHNob3dGb3Jnb3RQYXNzd29yZExpbms6IHRydWUsXG4gIG92ZXJyaWRlTG9naW5FcnJvcnM6IHRydWUsXG4gIGVuYWJsZVBhc3N3b3JkQ2hhbmdlOiB0cnVlLFxuXG4gIHNlbmRWZXJpZmljYXRpb25FbWFpbDogc2VuZFZlcmlmaWNhdGlvbkVtYWlsLFxuICAjIGVuZm9yY2VFbWFpbFZlcmlmaWNhdGlvbjogdHJ1ZSxcbiAgIyBjb25maXJtUGFzc3dvcmQ6IHRydWUsXG4gICMgY29udGludW91c1ZhbGlkYXRpb246IGZhbHNlLFxuICAjIGRpc3BsYXlGb3JtTGFiZWxzOiB0cnVlLFxuICAjIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbjogdHJ1ZSxcbiAgIyBmb3JtVmFsaWRhdGlvbkZlZWRiYWNrOiB0cnVlLFxuICBob21lUm91dGVQYXRoOiAnLycsXG4gICMgc2hvd0FkZFJlbW92ZVNlcnZpY2VzOiBmYWxzZSxcbiAgIyBzaG93UGxhY2Vob2xkZXJzOiB0cnVlLFxuXG4gIG5lZ2F0aXZlVmFsaWRhdGlvbjogdHJ1ZSxcbiAgcG9zaXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuICBuZWdhdGl2ZUZlZWRiYWNrOiBmYWxzZSxcbiAgcG9zaXRpdmVGZWVkYmFjazogdHJ1ZSxcbiAgc2hvd0xhYmVsczogZmFsc2UsXG5cbiAgIyBQcml2YWN5IFBvbGljeSBhbmQgVGVybXMgb2YgVXNlXG4gICMgcHJpdmFjeVVybDogJ3ByaXZhY3knLFxuICAjIHRlcm1zVXJsOiAndGVybXMtb2YtdXNlJyxcblxuICBwcmVTaWduVXBIb29rOiAocGFzc3dvcmQsIG9wdGlvbnMpIC0+XG4gICAgb3B0aW9ucy5wcm9maWxlLmxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG5cblxuXG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlICdjaGFuZ2VQd2QnLFxuICBwYXRoOiAnL3N0ZWVkb3MvY2hhbmdlLXBhc3N3b3JkJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ2ZvcmdvdFB3ZCcsXG4gIHBhdGg6ICcvc3RlZWRvcy9mb3Jnb3QtcGFzc3dvcmQnXG4gIHJlZGlyZWN0OiAnL3N0ZWVkb3MvZm9yZ290LXBhc3N3b3JkLXRva2VuJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3Jlc2V0UHdkJyxcbiAgcGF0aDogJy9zdGVlZG9zL3Jlc2V0LXBhc3N3b3JkJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3NpZ25JbicsXG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLWluJ1xuICByZWRpcmVjdDogKCktPlxuICAgICMgcGF0aCA9IEZsb3dSb3V0ZXIuY3VycmVudCgpLnBhdGhcbiAgICAjIGlmIC9eXFwvb2F1dGgyXFxiLy50ZXN0KHBhdGgpXG4gICAgIyAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgIyBlbHNlXG4gICAgIyAgIEZsb3dSb3V0ZXIuZ28oRmxvd1JvdXRlci5jdXJyZW50KCkucXVlcnlQYXJhbXM/LnJlZGlyZWN0IHx8IFwiL1wiKTtcbiAgICBpZiBGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcz8ucmVkaXJlY3QgXG4gICAgICBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gRmxvd1JvdXRlci5jdXJyZW50KCkucXVlcnlQYXJhbXM/LnJlZGlyZWN0IFxuICAgIGVsc2VcbiAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSBTdGVlZG9zLmFic29sdXRlVXJsIFwiL1wiXG4gICAgICBcbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlICdzaWduVXAnLFxuICBwYXRoOiAnL3N0ZWVkb3Mvc2lnbi11cCdcbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlICd2ZXJpZnlFbWFpbCcsXG4gIHBhdGg6ICcvc3RlZWRvcy92ZXJpZnktZW1haWwnXG4gIHJlZGlyZWN0OiAoKS0+XG4gICAgIyDlvZPkuJTku4XlvZPnlKjmiLflj6rmnInkuIDkuKrpgq7nrrHml7Ys6K6+572u5Li76KaB6YKu566xXG4gICAgZW1haWxzID0gTWV0ZW9yLnVzZXIoKT8uZW1haWxzXG4gICAgaWYgZW1haWxzIGFuZCBlbWFpbHMubGVuZ3RoID09IDFcbiAgICAgIGVtYWlsID0gZW1haWxzWzBdLmFkZHJlc3NcbiAgICAgICQoZG9jdW1lbnQuYm9keSkuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpXG4gICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsXCIsIGVtYWlsLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJylcbiAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxuICAgICAgICAgIHRvYXN0ci5lcnJvciB0KHJlc3VsdC5tZXNzYWdlKVxuICAgIEZsb3dSb3V0ZXIuZ28gXCIvXCJcbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlICdlbnJvbGxBY2NvdW50JyxcbiAgcGF0aDogJy9zdGVlZG9zL2Vucm9sbC1hY2NvdW50J1xuXG4jIGFkZCBmaWVsZHMgd2l0aGluIHNpZ24tdXAgZm9ybVxucHdkRmllbGQgPSBBY2NvdW50c1RlbXBsYXRlcy5yZW1vdmVGaWVsZCgncGFzc3dvcmQnKTtcbkFjY291bnRzVGVtcGxhdGVzLnJlbW92ZUZpZWxkKCdlbWFpbCcpO1xuQWNjb3VudHNUZW1wbGF0ZXMuYWRkRmllbGRzKFtcbiAge1xuICAgIF9pZDogJ2NvbXBhbnknLFxuICAgIHR5cGU6ICd0ZXh0J1xuICB9LFxuICB7XG4gICAgX2lkOiAnbmFtZScsXG4gICAgdHlwZTogJ3RleHQnXG4gIH0sXG4gIHtcbiAgICBfaWQ6ICdlbWFpbCcsXG4gICAgdHlwZTogJ2VtYWlsJyxcbiAgICByZXF1aXJlZDogdHJ1ZVxuICAgIGRpc3BsYXlOYW1lOiBcImVtYWlsXCIsXG4gICAgcmU6IC8uK0AoLispezIsfVxcLiguKyl7Mix9LyxcbiAgICBlcnJTdHI6ICdJbnZhbGlkIGVtYWlsJyxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgZm9yZ290UHdkOlwiZW1haWxfaW5wdXRfcGxhY2Vob2xkZXJcIlxuICAgIH1cbiAgfSxcbiAge1xuICAgIF9pZDogJ3VzZXJuYW1lX2FuZF9lbWFpbCcsXG4gICAgdHlwZTogJ3RleHQnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiBcIkxvZ2luXCJcbiAgfSxcbiAge1xuICAgIF9pZDogXCJ1c2VybmFtZVwiLFxuICAgIHR5cGU6IFwidGV4dFwiLFxuICAgIGRpc3BsYXlOYW1lOiBcInVzZXJuYW1lXCIsXG4gICAgcmVxdWlyZWQ6IGZhbHNlLCPkvIHkuJrms6jlhoznlYzpnaLmsqHmnInor6XlrZfmrrXvvIzmiYDku6XmlLnkuLrpnZ7lv4XloatcbiAgICBtaW5MZW5ndGg6IDZcbiAgfSxcbiAgcHdkRmllbGRcbl0pO1xuXG5cbmlmIE1ldGVvci5pc1NlcnZlciBhbmQgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXNcbiAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWUgPSBcIlN0ZWVkb3NcIjtcbiAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSA9IE1ldGVvci5zZXR0aW5ncy5lbWFpbD8uZnJvbTtcblxuXG5pZiBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8uYWNjb3VudHM/LmRpc2FibGVBY2NvdW50UmVnaXN0cmF0aW9uXG4gIEFjY291bnRzVGVtcGxhdGVzLm9wdGlvbnMuZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uID0gdHJ1ZVxuIiwidmFyIHB3ZEZpZWxkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHNlbmRWZXJpZmljYXRpb25FbWFpbDtcblxuc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gdHJ1ZTtcblxuaWYgKCFwcm9jZXNzLmVudi5NQUlMX1VSTCB8fCAhUGFja2FnZVtcImVtYWlsXCJdKSB7XG4gIHNlbmRWZXJpZmljYXRpb25FbWFpbCA9IGZhbHNlO1xufVxuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmUoe1xuICBkZWZhdWx0TGF5b3V0OiAnbG9naW5MYXlvdXQnLFxuICBkZWZhdWx0TGF5b3V0UmVnaW9uczoge1xuICAgIG5hdjogJ2xvZ2luTmF2J1xuICB9LFxuICBkZWZhdWx0Q29udGVudFJlZ2lvbjogJ21haW4nLFxuICBzaG93Rm9yZ290UGFzc3dvcmRMaW5rOiB0cnVlLFxuICBvdmVycmlkZUxvZ2luRXJyb3JzOiB0cnVlLFxuICBlbmFibGVQYXNzd29yZENoYW5nZTogdHJ1ZSxcbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsOiBzZW5kVmVyaWZpY2F0aW9uRW1haWwsXG4gIGhvbWVSb3V0ZVBhdGg6ICcvJyxcbiAgbmVnYXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuICBwb3NpdGl2ZVZhbGlkYXRpb246IHRydWUsXG4gIG5lZ2F0aXZlRmVlZGJhY2s6IGZhbHNlLFxuICBwb3NpdGl2ZUZlZWRiYWNrOiB0cnVlLFxuICBzaG93TGFiZWxzOiBmYWxzZSxcbiAgcHJlU2lnblVwSG9vazogZnVuY3Rpb24ocGFzc3dvcmQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5wcm9maWxlLmxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gIH1cbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgnY2hhbmdlUHdkJywge1xuICBwYXRoOiAnL3N0ZWVkb3MvY2hhbmdlLXBhc3N3b3JkJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdmb3Jnb3RQd2QnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9mb3Jnb3QtcGFzc3dvcmQnLFxuICByZWRpcmVjdDogJy9zdGVlZG9zL2ZvcmdvdC1wYXNzd29yZC10b2tlbidcbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgncmVzZXRQd2QnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9yZXNldC1wYXNzd29yZCdcbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgnc2lnbkluJywge1xuICBwYXRoOiAnL3N0ZWVkb3Mvc2lnbi1pbicsXG4gIHJlZGlyZWN0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIGlmICgocmVmID0gRmxvd1JvdXRlci5jdXJyZW50KCkucXVlcnlQYXJhbXMpICE9IG51bGwgPyByZWYucmVkaXJlY3QgOiB2b2lkIDApIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gKHJlZjEgPSBGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcykgIT0gbnVsbCA/IHJlZjEucmVkaXJlY3QgOiB2b2lkIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmID0gU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9cIik7XG4gICAgfVxuICB9XG59KTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ3NpZ25VcCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL3NpZ24tdXAnXG59KTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ3ZlcmlmeUVtYWlsJywge1xuICBwYXRoOiAnL3N0ZWVkb3MvdmVyaWZ5LWVtYWlsJyxcbiAgcmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBlbWFpbCwgZW1haWxzLCByZWY7XG4gICAgZW1haWxzID0gKHJlZiA9IE1ldGVvci51c2VyKCkpICE9IG51bGwgPyByZWYuZW1haWxzIDogdm9pZCAwO1xuICAgIGlmIChlbWFpbHMgJiYgZW1haWxzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgZW1haWwgPSBlbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICQoZG9jdW1lbnQuYm9keSkuYWRkQ2xhc3MoXCJsb2FkaW5nXCIpO1xuICAgICAgTWV0ZW9yLmNhbGwoXCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbFwiLCBlbWFpbCwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICAkKGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChyZXN1bHQubWVzc2FnZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICB9XG59KTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ2Vucm9sbEFjY291bnQnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9lbnJvbGwtYWNjb3VudCdcbn0pO1xuXG5wd2RGaWVsZCA9IEFjY291bnRzVGVtcGxhdGVzLnJlbW92ZUZpZWxkKCdwYXNzd29yZCcpO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5yZW1vdmVGaWVsZCgnZW1haWwnKTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuYWRkRmllbGRzKFtcbiAge1xuICAgIF9pZDogJ2NvbXBhbnknLFxuICAgIHR5cGU6ICd0ZXh0J1xuICB9LCB7XG4gICAgX2lkOiAnbmFtZScsXG4gICAgdHlwZTogJ3RleHQnXG4gIH0sIHtcbiAgICBfaWQ6ICdlbWFpbCcsXG4gICAgdHlwZTogJ2VtYWlsJyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogXCJlbWFpbFwiLFxuICAgIHJlOiAvLitAKC4rKXsyLH1cXC4oLispezIsfS8sXG4gICAgZXJyU3RyOiAnSW52YWxpZCBlbWFpbCcsXG4gICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgIGZvcmdvdFB3ZDogXCJlbWFpbF9pbnB1dF9wbGFjZWhvbGRlclwiXG4gICAgfVxuICB9LCB7XG4gICAgX2lkOiAndXNlcm5hbWVfYW5kX2VtYWlsJyxcbiAgICB0eXBlOiAndGV4dCcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IFwiTG9naW5cIlxuICB9LCB7XG4gICAgX2lkOiBcInVzZXJuYW1lXCIsXG4gICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgZGlzcGxheU5hbWU6IFwidXNlcm5hbWVcIixcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgbWluTGVuZ3RoOiA2XG4gIH0sIHB3ZEZpZWxkXG5dKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlciAmJiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcykge1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5zaXRlTmFtZSA9IFwiU3RlZWRvc1wiO1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5lbWFpbCkgIT0gbnVsbCA/IHJlZi5mcm9tIDogdm9pZCAwO1xufVxuXG5pZiAoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMyA9IHJlZjIuYWNjb3VudHMpICE9IG51bGwgPyByZWYzLmRpc2FibGVBY2NvdW50UmVnaXN0cmF0aW9uIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gIEFjY291bnRzVGVtcGxhdGVzLm9wdGlvbnMuZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uID0gdHJ1ZTtcbn1cbiIsIi8vLyBCQ1JZUFRcclxudmFyIGJjcnlwdCA9IE5wbU1vZHVsZUJjcnlwdDtcclxudmFyIGJjcnlwdEhhc2ggPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5oYXNoKTtcclxudmFyIGJjcnlwdENvbXBhcmUgPSBNZXRlb3Iud3JhcEFzeW5jKGJjcnlwdC5jb21wYXJlKTtcclxuXHJcbnZhciBwYXNzd29yZFZhbGlkYXRvciA9IE1hdGNoLk9uZU9mKFxyXG4gIFN0cmluZyxcclxuICB7IGRpZ2VzdDogU3RyaW5nLCBhbGdvcml0aG06IFN0cmluZyB9XHJcbik7XHJcblxyXG52YXIgY2hlY2tQYXNzd29yZCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkO1xyXG5cclxuLy8gR2l2ZW4gYSAncGFzc3dvcmQnIGZyb20gdGhlIGNsaWVudCwgZXh0cmFjdCB0aGUgc3RyaW5nIHRoYXQgd2Ugc2hvdWxkXHJcbi8vIGJjcnlwdC4gJ3Bhc3N3b3JkJyBjYW4gYmUgb25lIG9mOlxyXG4vLyAgLSBTdHJpbmcgKHRoZSBwbGFpbnRleHQgcGFzc3dvcmQpXHJcbi8vICAtIE9iamVjdCB3aXRoICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJyBrZXlzLiAnYWxnb3JpdGhtJyBtdXN0IGJlIFwic2hhLTI1NlwiLlxyXG4vL1xyXG52YXIgZ2V0UGFzc3dvcmRTdHJpbmcgPSBmdW5jdGlvbiAocGFzc3dvcmQpIHtcclxuICBpZiAodHlwZW9mIHBhc3N3b3JkID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICBwYXNzd29yZCA9IFNIQTI1NihwYXNzd29yZCk7XHJcbiAgfSBlbHNlIHsgLy8gJ3Bhc3N3b3JkJyBpcyBhbiBvYmplY3RcclxuICAgIGlmIChwYXNzd29yZC5hbGdvcml0aG0gIT09IFwic2hhLTI1NlwiKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFzc3dvcmQgaGFzaCBhbGdvcml0aG0uIFwiICtcclxuICAgICAgICAgICAgICAgICAgICAgIFwiT25seSAnc2hhLTI1NicgaXMgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkLmRpZ2VzdDtcclxuICB9XHJcbiAgcmV0dXJuIHBhc3N3b3JkO1xyXG59O1xyXG5cclxuLy8gVXNlIGJjcnlwdCB0byBoYXNoIHRoZSBwYXNzd29yZCBmb3Igc3RvcmFnZSBpbiB0aGUgZGF0YWJhc2UuXHJcbi8vIGBwYXNzd29yZGAgY2FuIGJlIGEgc3RyaW5nIChpbiB3aGljaCBjYXNlIGl0IHdpbGwgYmUgcnVuIHRocm91Z2hcclxuLy8gU0hBMjU2IGJlZm9yZSBiY3J5cHQpIG9yIGFuIG9iamVjdCB3aXRoIHByb3BlcnRpZXMgYGRpZ2VzdGAgYW5kXHJcbi8vIGBhbGdvcml0aG1gIChpbiB3aGljaCBjYXNlIHdlIGJjcnlwdCBgcGFzc3dvcmQuZGlnZXN0YCkuXHJcbi8vXHJcbnZhciBoYXNoUGFzc3dvcmQgPSBmdW5jdGlvbiAocGFzc3dvcmQpIHtcclxuICBwYXNzd29yZCA9IGdldFBhc3N3b3JkU3RyaW5nKHBhc3N3b3JkKTtcclxuICByZXR1cm4gYmNyeXB0SGFzaChwYXNzd29yZCwgQWNjb3VudHMuX2JjcnlwdFJvdW5kcyk7XHJcbn07XHJcblxyXG4vLy9cclxuLy8vIEVSUk9SIEhBTkRMRVJcclxuLy8vXHJcbnZhciBoYW5kbGVFcnJvciA9IGZ1bmN0aW9uKG1zZywgdGhyb3dFcnJvcikge1xyXG4gIGlmKHRocm93RXJyb3IgPT09IHVuZGVmaW5lZCl7XHJcbiAgICB0aHJvd0Vycm9yID0gdHJ1ZTtcclxuICB9XHJcbiAgdmFyIGVycm9yID0gbmV3IE1ldGVvci5FcnJvcihcclxuICAgIDQwMyxcclxuICAgIEFjY291bnRzLl9vcHRpb25zLmFtYmlndW91c0Vycm9yTWVzc2FnZXNcclxuICAgICAgPyBcIlNvbWV0aGluZyB3ZW50IHdyb25nLiBQbGVhc2UgY2hlY2sgeW91ciBjcmVkZW50aWFscy5cIlxyXG4gICAgICA6IG1zZ1xyXG4gICk7XHJcbiAgaWYgKHRocm93RXJyb3IpIHtcclxuICAgIHRocm93IGVycm9yO1xyXG4gIH1cclxuICByZXR1cm4gZXJyb3I7XHJcbn07XHJcblxyXG4vLyBHZW5lcmF0ZXMgcGVybXV0YXRpb25zIG9mIGFsbCBjYXNlIHZhcmlhdGlvbnMgb2YgYSBnaXZlbiBzdHJpbmcuXHJcbnZhciBnZW5lcmF0ZUNhc2VQZXJtdXRhdGlvbnNGb3JTdHJpbmcgPSBmdW5jdGlvbiAoc3RyaW5nKSB7XHJcbiAgdmFyIHBlcm11dGF0aW9ucyA9IFsnJ107XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKyspIHtcclxuICAgIHZhciBjaCA9IHN0cmluZy5jaGFyQXQoaSk7XHJcbiAgICBwZXJtdXRhdGlvbnMgPSBfLmZsYXR0ZW4oXy5tYXAocGVybXV0YXRpb25zLCBmdW5jdGlvbiAocHJlZml4KSB7XHJcbiAgICAgIHZhciBsb3dlckNhc2VDaGFyID0gY2gudG9Mb3dlckNhc2UoKTtcclxuICAgICAgdmFyIHVwcGVyQ2FzZUNoYXIgPSBjaC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICAvLyBEb24ndCBhZGQgdW5uZWNjZXNhcnkgcGVybXV0YXRpb25zIHdoZW4gY2ggaXMgbm90IGEgbGV0dGVyXHJcbiAgICAgIGlmIChsb3dlckNhc2VDaGFyID09PSB1cHBlckNhc2VDaGFyKSB7XHJcbiAgICAgICAgcmV0dXJuIFtwcmVmaXggKyBjaF07XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFtwcmVmaXggKyBsb3dlckNhc2VDaGFyLCBwcmVmaXggKyB1cHBlckNhc2VDaGFyXTtcclxuICAgICAgfVxyXG4gICAgfSkpO1xyXG4gIH1cclxuICByZXR1cm4gcGVybXV0YXRpb25zO1xyXG59O1xyXG5cclxuLy8gR2VuZXJhdGVzIGEgTW9uZ29EQiBzZWxlY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIHBlcmZvcm0gYSBmYXN0IGNhc2VcclxuLy8gaW5zZW5zaXRpdmUgbG9va3VwIGZvciB0aGUgZ2l2ZW4gZmllbGROYW1lIGFuZCBzdHJpbmcuIFNpbmNlIE1vbmdvREIgZG9lc1xyXG4vLyBub3Qgc3VwcG9ydCBjYXNlIGluc2Vuc2l0aXZlIGluZGV4ZXMsIGFuZCBjYXNlIGluc2Vuc2l0aXZlIHJlZ2V4IHF1ZXJpZXNcclxuLy8gYXJlIHNsb3csIHdlIGNvbnN0cnVjdCBhIHNldCBvZiBwcmVmaXggc2VsZWN0b3JzIGZvciBhbGwgcGVybXV0YXRpb25zIG9mXHJcbi8vIHRoZSBmaXJzdCA0IGNoYXJhY3RlcnMgb3Vyc2VsdmVzLiBXZSBmaXJzdCBhdHRlbXB0IHRvIG1hdGNoaW5nIGFnYWluc3RcclxuLy8gdGhlc2UsIGFuZCBiZWNhdXNlICdwcmVmaXggZXhwcmVzc2lvbicgcmVnZXggcXVlcmllcyBkbyB1c2UgaW5kZXhlcyAoc2VlXHJcbi8vIGh0dHA6Ly9kb2NzLm1vbmdvZGIub3JnL3YyLjYvcmVmZXJlbmNlL29wZXJhdG9yL3F1ZXJ5L3JlZ2V4LyNpbmRleC11c2UpLFxyXG4vLyB0aGlzIGhhcyBiZWVuIGZvdW5kIHRvIGdyZWF0bHkgaW1wcm92ZSBwZXJmb3JtYW5jZSAoZnJvbSAxMjAwbXMgdG8gNW1zIGluIGFcclxuLy8gdGVzdCB3aXRoIDEuMDAwLjAwMCB1c2VycykuXHJcbnZhciBzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAgPSBmdW5jdGlvbiAoZmllbGROYW1lLCBzdHJpbmcpIHtcclxuICAvLyBQZXJmb3JtYW5jZSBzZWVtcyB0byBpbXByb3ZlIHVwIHRvIDQgcHJlZml4IGNoYXJhY3RlcnNcclxuICB2YXIgcHJlZml4ID0gc3RyaW5nLnN1YnN0cmluZygwLCBNYXRoLm1pbihzdHJpbmcubGVuZ3RoLCA0KSk7XHJcbiAgdmFyIG9yQ2xhdXNlID0gXy5tYXAoZ2VuZXJhdGVDYXNlUGVybXV0YXRpb25zRm9yU3RyaW5nKHByZWZpeCksXHJcbiAgICBmdW5jdGlvbiAocHJlZml4UGVybXV0YXRpb24pIHtcclxuICAgICAgdmFyIHNlbGVjdG9yID0ge307XHJcbiAgICAgIHNlbGVjdG9yW2ZpZWxkTmFtZV0gPVxyXG4gICAgICAgIG5ldyBSZWdFeHAoJ14nICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAocHJlZml4UGVybXV0YXRpb24pKTtcclxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgfSk7XHJcbiAgdmFyIGNhc2VJbnNlbnNpdGl2ZUNsYXVzZSA9IHt9O1xyXG4gIGNhc2VJbnNlbnNpdGl2ZUNsYXVzZVtmaWVsZE5hbWVdID1cclxuICAgIG5ldyBSZWdFeHAoJ14nICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAoc3RyaW5nKSArICckJywgJ2knKVxyXG4gIHJldHVybiB7JGFuZDogW3skb3I6IG9yQ2xhdXNlfSwgY2FzZUluc2Vuc2l0aXZlQ2xhdXNlXX07XHJcbn1cclxuXHJcbkFjY291bnRzLl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XHJcbiAgdmFyIHVzZXIgPSBudWxsO1xyXG5cclxuICBpZiAocXVlcnkuaWQpIHtcclxuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7IF9pZDogcXVlcnkuaWQgfSk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBmaWVsZE5hbWU7XHJcbiAgICB2YXIgZmllbGRWYWx1ZTtcclxuICAgIGlmIChxdWVyeS51c2VybmFtZSkge1xyXG4gICAgICBmaWVsZE5hbWUgPSAndXNlcm5hbWUnO1xyXG4gICAgICBmaWVsZFZhbHVlID0gcXVlcnkudXNlcm5hbWU7XHJcbiAgICB9IGVsc2UgaWYgKHF1ZXJ5LmVtYWlsKSB7XHJcbiAgICAgIGZpZWxkTmFtZSA9ICdlbWFpbHMuYWRkcmVzcyc7XHJcbiAgICAgIGZpZWxkVmFsdWUgPSBxdWVyeS5lbWFpbDtcclxuICAgIH0gZWxzZSBpZiAocXVlcnkucGhvbmUpIHtcclxuICAgICAgZmllbGROYW1lID0gJ3Bob25lLm51bWJlcic7XHJcbiAgICAgIC8vIGZpZWxkVmFsdWXlpoLmnpzoh6rluKbljLrlj7fvvIzliJnkuI3lgZrlpITnkIbvvIzlj43kuYvpu5jorqTliqDkuIrkuK3lm73ljLrlj7crODZcclxuICAgICAgaWYoL15cXCtcXGQrL2cudGVzdChxdWVyeS5waG9uZSkpe1xyXG4gICAgICAgIGZpZWxkVmFsdWUgPSBxdWVyeS5waG9uZTtcclxuICAgICAgfVxyXG4gICAgICBlbHNle1xyXG4gICAgICAgIGZpZWxkVmFsdWUgPSBcIis4NlwiICsgcXVlcnkucGhvbmU7XHJcbiAgICAgIH1cclxuICAgICAgZmllbGROYW1lID0gXCIkb3JcIlxyXG4gICAgICBmaWVsZFZhbHVlID0gW3sncGhvbmUubnVtYmVyJzpmaWVsZFZhbHVlfSx7dXNlcm5hbWU6cXVlcnkucGhvbmV9XVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkbid0IGhhcHBlbiAodmFsaWRhdGlvbiBtaXNzZWQgc29tZXRoaW5nKVwiKTtcclxuICAgIH1cclxuICAgIHZhciBzZWxlY3RvciA9IHt9O1xyXG4gICAgc2VsZWN0b3JbZmllbGROYW1lXSA9IGZpZWxkVmFsdWU7XHJcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoc2VsZWN0b3IpO1xyXG4gICAgLy8gSWYgdXNlciBpcyBub3QgZm91bmQsIHRyeSBhIGNhc2UgaW5zZW5zaXRpdmUgbG9va3VwXHJcbiAgICBpZiAoIXVzZXIgJiYgZmllbGROYW1lICE9IFwiJG9yXCIpIHtcclxuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAoZmllbGROYW1lLCBmaWVsZFZhbHVlKTtcclxuICAgICAgdmFyIGNhbmRpZGF0ZVVzZXJzID0gTWV0ZW9yLnVzZXJzLmZpbmQoc2VsZWN0b3IpLmZldGNoKCk7XHJcbiAgICAgIC8vIE5vIG1hdGNoIGlmIG11bHRpcGxlIGNhbmRpZGF0ZXMgYXJlIGZvdW5kXHJcbiAgICAgIGlmIChjYW5kaWRhdGVVc2Vycy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICB1c2VyID0gY2FuZGlkYXRlVXNlcnNbMF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB1c2VyO1xyXG59O1xyXG5cclxudmFyIE5vbkVtcHR5U3RyaW5nID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24gKHgpIHtcclxuICBjaGVjayh4LCBTdHJpbmcpO1xyXG4gIHJldHVybiB4Lmxlbmd0aCA+IDA7XHJcbn0pO1xyXG5cclxudmFyIHVzZXJRdWVyeVZhbGlkYXRvciA9IE1hdGNoLldoZXJlKGZ1bmN0aW9uICh1c2VyKSB7XHJcbiAgY2hlY2sodXNlciwge1xyXG4gICAgaWQ6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcclxuICAgIHVzZXJuYW1lOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZyksXHJcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpLFxyXG4gICAgcGhvbmU6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKVxyXG4gIH0pO1xyXG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoICE9PSAxKVxyXG4gICAgdGhyb3cgbmV3IE1hdGNoLkVycm9yKFwiVXNlciBwcm9wZXJ0eSBtdXN0IGhhdmUgZXhhY3RseSBvbmUgZmllbGRcIik7XHJcbiAgcmV0dXJuIHRydWU7XHJcbn0pO1xyXG5cclxuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwYXNzd29yZDJcIiwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICBpZiAoISBvcHRpb25zLnBhc3N3b3JkMiB8fCBvcHRpb25zLnNycClcclxuICAgIHJldHVybiB1bmRlZmluZWQ7IC8vIGRvbid0IGhhbmRsZVxyXG5cclxuICBjaGVjayhvcHRpb25zLCB7XHJcbiAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXHJcbiAgICBwYXNzd29yZDI6IHBhc3N3b3JkVmFsaWRhdG9yXHJcbiAgfSk7XHJcblxyXG5cclxuICB2YXIgdXNlciA9IEFjY291bnRzLl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zKG9wdGlvbnMudXNlcik7XHJcbiAgaWYgKCF1c2VyKSB7XHJcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgbm90IGZvdW5kXCIpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCF1c2VyLnNlcnZpY2VzIHx8ICF1c2VyLnNlcnZpY2VzLnBhc3N3b3JkIHx8XHJcbiAgICAgICEodXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQgfHwgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnApKSB7XHJcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgaGFzIG5vIHBhc3N3b3JkIHNldFwiKTtcclxuICB9XHJcblxyXG4gIGlmICghdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQpIHtcclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5wYXNzd29yZDIgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgLy8gVGhlIGNsaWVudCBoYXMgcHJlc2VudGVkIGEgcGxhaW50ZXh0IHBhc3N3b3JkLCBhbmQgdGhlIHVzZXIgaXNcclxuICAgICAgLy8gbm90IHVwZ3JhZGVkIHRvIGJjcnlwdCB5ZXQuIFdlIGRvbid0IGF0dGVtcHQgdG8gdGVsbCB0aGUgY2xpZW50XHJcbiAgICAgIC8vIHRvIHVwZ3JhZGUgdG8gYmNyeXB0LCBiZWNhdXNlIGl0IG1pZ2h0IGJlIGEgc3RhbmRhbG9uZSBERFBcclxuICAgICAgLy8gY2xpZW50IGRvZXNuJ3Qga25vdyBob3cgdG8gZG8gc3VjaCBhIHRoaW5nLlxyXG4gICAgICB2YXIgdmVyaWZpZXIgPSB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycDtcclxuICAgICAgdmFyIG5ld1ZlcmlmaWVyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIob3B0aW9ucy5wYXNzd29yZDIsIHtcclxuICAgICAgICBpZGVudGl0eTogdmVyaWZpZXIuaWRlbnRpdHksIHNhbHQ6IHZlcmlmaWVyLnNhbHR9KTtcclxuXHJcbiAgICAgIGlmICh2ZXJpZmllci52ZXJpZmllciAhPT0gbmV3VmVyaWZpZXIudmVyaWZpZXIpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgdXNlcklkOiBBY2NvdW50cy5fb3B0aW9ucy5hbWJpZ3VvdXNFcnJvck1lc3NhZ2VzID8gbnVsbCA6IHVzZXIuX2lkLFxyXG4gICAgICAgICAgZXJyb3I6IGhhbmRsZUVycm9yKFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIsIGZhbHNlKVxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB7dXNlcklkOiB1c2VyLl9pZH07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBUZWxsIHRoZSBjbGllbnQgdG8gdXNlIHRoZSBTUlAgdXBncmFkZSBwcm9jZXNzLlxyXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJvbGQgcGFzc3dvcmQgZm9ybWF0XCIsIEVKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgZm9ybWF0OiAnc3JwJyxcclxuICAgICAgICBpZGVudGl0eTogdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnAuaWRlbnRpdHlcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNoZWNrUGFzc3dvcmQoXHJcbiAgICB1c2VyLFxyXG4gICAgb3B0aW9ucy5wYXNzd29yZDJcclxuICApO1xyXG59KTtcclxuXHJcbi8vIEhhbmRsZXIgdG8gbG9naW4gdXNpbmcgdGhlIFNSUCB1cGdyYWRlIHBhdGguIFRvIHVzZSB0aGlzIGxvZ2luXHJcbi8vIGhhbmRsZXIsIHRoZSBjbGllbnQgbXVzdCBwcm92aWRlOlxyXG4vLyAgIC0gc3JwOiBIKGlkZW50aXR5ICsgXCI6XCIgKyBwYXNzd29yZClcclxuLy8gICAtIHBhc3N3b3JkOiBhIHN0cmluZyBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzICdkaWdlc3QnIGFuZCAnYWxnb3JpdGhtJ1xyXG4vL1xyXG4vLyBXZSB1c2UgYG9wdGlvbnMuc3JwYCB0byB2ZXJpZnkgdGhhdCB0aGUgY2xpZW50IGtub3dzIHRoZSBjb3JyZWN0XHJcbi8vIHBhc3N3b3JkIHdpdGhvdXQgZG9pbmcgYSBmdWxsIFNSUCBmbG93LiBPbmNlIHdlJ3ZlIGNoZWNrZWQgdGhhdCwgd2VcclxuLy8gdXBncmFkZSB0aGUgdXNlciB0byBiY3J5cHQgYW5kIHJlbW92ZSB0aGUgU1JQIGluZm9ybWF0aW9uIGZyb20gdGhlXHJcbi8vIHVzZXIgZG9jdW1lbnQuXHJcbi8vXHJcbi8vIFRoZSBjbGllbnQgZW5kcyB1cCB1c2luZyB0aGlzIGxvZ2luIGhhbmRsZXIgYWZ0ZXIgdHJ5aW5nIHRoZSBub3JtYWxcclxuLy8gbG9naW4gaGFuZGxlciAoYWJvdmUpLCB3aGljaCB0aHJvd3MgYW4gZXJyb3IgdGVsbGluZyB0aGUgY2xpZW50IHRvXHJcbi8vIHRyeSB0aGUgU1JQIHVwZ3JhZGUgcGF0aC5cclxuLy9cclxuLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcclxuQWNjb3VudHMucmVnaXN0ZXJMb2dpbkhhbmRsZXIoXCJwYXNzd29yZDJcIiwgZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICBpZiAoIW9wdGlvbnMuc3JwIHx8ICFvcHRpb25zLnBhc3N3b3JkMikge1xyXG4gICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXHJcbiAgfVxyXG5cclxuICBjaGVjayhvcHRpb25zLCB7XHJcbiAgICB1c2VyOiB1c2VyUXVlcnlWYWxpZGF0b3IsXHJcbiAgICBzcnA6IFN0cmluZyxcclxuICAgIHBhc3N3b3JkMjogcGFzc3dvcmRWYWxpZGF0b3JcclxuICB9KTtcclxuXHJcbiAgdmFyIHVzZXIgPSBBY2NvdW50cy5fZmluZFVzZXJCeVF1ZXJ5Rm9yU3RlZWRvcyhvcHRpb25zLnVzZXIpO1xyXG4gIGlmICghdXNlcikge1xyXG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIG5vdCBmb3VuZFwiKTtcclxuICB9XHJcblxyXG4gIC8vIENoZWNrIHRvIHNlZSBpZiBhbm90aGVyIHNpbXVsdGFuZW91cyBsb2dpbiBoYXMgYWxyZWFkeSB1cGdyYWRlZFxyXG4gIC8vIHRoZSB1c2VyIHJlY29yZCB0byBiY3J5cHQuXHJcbiAgaWYgKHVzZXIuc2VydmljZXMgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZCAmJiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCkge1xyXG4gICAgcmV0dXJuIGNoZWNrUGFzc3dvcmQodXNlciwgb3B0aW9ucy5wYXNzd29yZDIpO1xyXG4gIH1cclxuXHJcbiAgaWYgKCEodXNlci5zZXJ2aWNlcyAmJiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkICYmIHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwKSkge1xyXG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIGhhcyBubyBwYXNzd29yZCBzZXRcIik7XHJcbiAgfVxyXG5cclxuICB2YXIgdjEgPSB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycC52ZXJpZmllcjtcclxuICB2YXIgdjIgPSBTUlAuZ2VuZXJhdGVWZXJpZmllcihcclxuICAgIG51bGwsXHJcbiAgICB7XHJcbiAgICAgIGhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQ6IG9wdGlvbnMuc3JwLFxyXG4gICAgICBzYWx0OiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycC5zYWx0XHJcbiAgICB9XHJcbiAgKS52ZXJpZmllcjtcclxuICBpZiAodjEgIT09IHYyKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1c2VySWQ6IEFjY291bnRzLl9vcHRpb25zLmFtYmlndW91c0Vycm9yTWVzc2FnZXMgPyBudWxsIDogdXNlci5faWQsXHJcbiAgICAgIGVycm9yOiBoYW5kbGVFcnJvcihcIkluY29ycmVjdCBwYXNzd29yZFwiLCBmYWxzZSlcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvLyBVcGdyYWRlIHRvIGJjcnlwdCBvbiBzdWNjZXNzZnVsIGxvZ2luLlxyXG4gIHZhciBzYWx0ZWQgPSBoYXNoUGFzc3dvcmQob3B0aW9ucy5wYXNzd29yZDIpO1xyXG4gIE1ldGVvci51c2Vycy51cGRhdGUoXHJcbiAgICB1c2VyLl9pZCxcclxuICAgIHtcclxuICAgICAgJHVuc2V0OiB7ICdzZXJ2aWNlcy5wYXNzd29yZC5zcnAnOiAxIH0sXHJcbiAgICAgICRzZXQ6IHsgJ3NlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCc6IHNhbHRlZCB9XHJcbiAgICB9XHJcbiAgKTtcclxuXHJcbiAgcmV0dXJuIHt1c2VySWQ6IHVzZXIuX2lkfTtcclxufSk7IiwiUGhvbmUgPSByZXF1aXJlKCdwaG9uZScpXHJcblxyXG5NZXRlb3IubWV0aG9kcyB1cGRhdGVQaG9uZTogKG9wdGlvbnMpIC0+XHJcblx0Y2hlY2sgb3B0aW9ucywgT2JqZWN0XHJcblx0eyBudW1iZXIgfSA9IG9wdGlvbnNcclxuXHRjaGVjayBudW1iZXIsIFN0cmluZ1xyXG5cclxuXHRudW1iZXIgPSBQaG9uZShudW1iZXIpWzBdXHJcblx0dW5sZXNzIG51bWJlclxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfaW52YWxpZFwiKVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdGN1cnJlbnRVc2VySWQgPSBAdXNlcklkXHJcblx0dW5sZXNzIGN1cnJlbnRVc2VySWRcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5cdGN1cnJlbnRVc2VyID0gQWNjb3VudHMudXNlcigpXHJcblx0Y3VycmVudE51bWJlciA9IGN1cnJlbnRVc2VyLnBob25lPy5udW1iZXJcclxuXHQjIOaJi+acuuWPt+S4jeWPmO+8jOWImeS4jeeUqOabtOaWsFxyXG5cdGlmIGN1cnJlbnROdW1iZXIgYW5kIGN1cnJlbnROdW1iZXIgPT0gbnVtYmVyXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRyZXBlYXROdW1iZXJVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7J3Bob25lLm51bWJlcic6bnVtYmVyfSx7ZmllbGRzOntfaWQ6MSxwaG9uZToxfX0pXHJcblx0aWYgcmVwZWF0TnVtYmVyVXNlclxyXG5cdFx0aWYgcmVwZWF0TnVtYmVyVXNlci5waG9uZT8udmVyaWZpZWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfYWxyZWFkeV9leGlzdGVkXCIpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOWmguaenOWPpuS4gOS4queUqOaIt+aJi+acuuWPt+ayoeaciemqjOivgemAmui/h++8jOWImea4hemZpOWFtui0puaIt+S4i+aJi+acuuWPt+ebuOWFs+Wtl+autVxyXG5cdFx0XHRkYi51c2Vycy51cGRhdGUge1xyXG5cdFx0XHRcdF9pZDogcmVwZWF0TnVtYmVyVXNlci5faWRcclxuXHRcdFx0fSwgJHVuc2V0OiBcInBob25lXCI6IDEsXCJzZXJ2aWNlcy5waG9uZVwiOiAxXHJcblxyXG5cdGRiLnVzZXJzLnVwZGF0ZSB7XHJcblx0XHRfaWQ6IGN1cnJlbnRVc2VySWRcclxuXHR9LCAkc2V0OiBwaG9uZToge251bWJlcjogbnVtYmVyLCB2ZXJpZmllZDogZmFsc2V9XHJcblxyXG5cdHJldHVybiB0cnVlXHJcblxyXG5cclxuIiwidmFyIFBob25lO1xuXG5QaG9uZSA9IHJlcXVpcmUoJ3Bob25lJyk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlUGhvbmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY3VycmVudE51bWJlciwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VySWQsIG51bWJlciwgcmVmLCByZWYxLCByZXBlYXROdW1iZXJVc2VyO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgbnVtYmVyID0gb3B0aW9ucy5udW1iZXI7XG4gICAgY2hlY2sobnVtYmVyLCBTdHJpbmcpO1xuICAgIG51bWJlciA9IFBob25lKG51bWJlcilbMF07XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIWN1cnJlbnRVc2VySWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKTtcbiAgICBjdXJyZW50TnVtYmVyID0gKHJlZiA9IGN1cnJlbnRVc2VyLnBob25lKSAhPSBudWxsID8gcmVmLm51bWJlciA6IHZvaWQgMDtcbiAgICBpZiAoY3VycmVudE51bWJlciAmJiBjdXJyZW50TnVtYmVyID09PSBudW1iZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXBlYXROdW1iZXJVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAncGhvbmUubnVtYmVyJzogbnVtYmVyXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVwZWF0TnVtYmVyVXNlcikge1xuICAgICAgaWYgKChyZWYxID0gcmVwZWF0TnVtYmVyVXNlci5waG9uZSkgIT0gbnVsbCA/IHJlZjEudmVyaWZpZWQgOiB2b2lkIDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfYWxyZWFkeV9leGlzdGVkXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogcmVwZWF0TnVtYmVyVXNlci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJwaG9uZVwiOiAxLFxuICAgICAgICAgICAgXCJzZXJ2aWNlcy5waG9uZVwiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogY3VycmVudFVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICBudW1iZXI6IG51bWJlcixcbiAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzIGRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5czogKGV4cGlyZWREYXlzKSAtPlxyXG5cdGNoZWNrIGV4cGlyZWREYXlzLCBOdW1iZXJcclxuXHJcblx0Y3VycmVudFVzZXJJZCA9IEB1c2VySWRcclxuXHR1bmxlc3MgY3VycmVudFVzZXJJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHJcblx0Y3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKClcclxuXHR2ZXJpZmllZCA9IGN1cnJlbnRVc2VyLnBob25lPy52ZXJpZmllZFxyXG5cdG1vZGlmaWVkID0gY3VycmVudFVzZXIucGhvbmU/Lm1vZGlmaWVkXHJcblx0dW5sZXNzIHZlcmlmaWVkIG9yIG1vZGlmaWVkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZSgpXHJcblx0b3V0RGF5cyA9IE1hdGguZmxvb3IoKG5vdy5nZXRUaW1lKCktbW9kaWZpZWQuZ2V0VGltZSgpKS8oMjQgKiA2MCAqIDYwICogMTAwMCkpXHJcblx0aWYgb3V0RGF5cyA+PSBleHBpcmVkRGF5c1xyXG5cdFx0ZGIudXNlcnMudXBkYXRlIHtcclxuXHRcdFx0X2lkOiBjdXJyZW50VXNlcklkXHJcblx0XHR9LCAkc2V0OiBcInBob25lLnZlcmlmaWVkXCI6IGZhbHNlXHJcblxyXG5cdHJldHVybiB0cnVlXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiBmdW5jdGlvbihleHBpcmVkRGF5cykge1xuICAgIHZhciBjdXJyZW50VXNlciwgY3VycmVudFVzZXJJZCwgbW9kaWZpZWQsIG5vdywgb3V0RGF5cywgcmVmLCByZWYxLCB2ZXJpZmllZDtcbiAgICBjaGVjayhleHBpcmVkRGF5cywgTnVtYmVyKTtcbiAgICBjdXJyZW50VXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKCFjdXJyZW50VXNlcklkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgdmVyaWZpZWQgPSAocmVmID0gY3VycmVudFVzZXIucGhvbmUpICE9IG51bGwgPyByZWYudmVyaWZpZWQgOiB2b2lkIDA7XG4gICAgbW9kaWZpZWQgPSAocmVmMSA9IGN1cnJlbnRVc2VyLnBob25lKSAhPSBudWxsID8gcmVmMS5tb2RpZmllZCA6IHZvaWQgMDtcbiAgICBpZiAoISh2ZXJpZmllZCB8fCBtb2RpZmllZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIG91dERheXMgPSBNYXRoLmZsb29yKChub3cuZ2V0VGltZSgpIC0gbW9kaWZpZWQuZ2V0VGltZSgpKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgaWYgKG91dERheXMgPj0gZXhwaXJlZERheXMpIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogY3VycmVudFVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgXCJwaG9uZS52ZXJpZmllZFwiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIiwiUGhvbmUgPSByZXF1aXJlKCdwaG9uZScpXHJcblxyXG5NZXRlb3IubWV0aG9kcyBqb2luU3BhY2VGcm9tTG9naW46IChvcHRpb25zKSAtPlxyXG5cdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxyXG5cdHsgc3BhY2VfbG9naW5lZCB9ID0gb3B0aW9uc1xyXG5cdGNoZWNrIHNwYWNlX2xvZ2luZWQsIFN0cmluZ1xyXG5cclxuXHRjdXJyZW50VXNlcklkID0gQHVzZXJJZFxyXG5cdHVubGVzcyBjdXJyZW50VXNlcklkXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2xvZ2luZWQpXHJcblx0dW5sZXNzIHNwYWNlXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJzcGFjZV91c2Vyc19lcnJvcl9zcGFjZV9ub3RfZm91bmRcIilcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKVxyXG5cdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtzcGFjZTogc3BhY2VfbG9naW5lZCwgdXNlcjogY3VycmVudFVzZXIuX2lkfSlcclxuXHRpZiBzcGFjZV91c2VyXHJcblx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHR1c2VyX2VtYWlsID0gY3VycmVudFVzZXIuZW1haWxzWzBdLmFkZHJlc3NcclxuXHRyb290T3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTpzcGFjZV9sb2dpbmVkLCBwYXJlbnQ6IG51bGx9LHtmaWVsZHM6IHtfaWQ6MX19KVxyXG5cdGRiLnNwYWNlX3VzZXJzLmluc2VydFxyXG5cdFx0ZW1haWw6IHVzZXJfZW1haWxcclxuXHRcdHVzZXI6IGN1cnJlbnRVc2VyLl9pZFxyXG5cdFx0bmFtZTogY3VycmVudFVzZXIubmFtZVxyXG5cdFx0b3JnYW5pemF0aW9uczogW3Jvb3RPcmcuX2lkXVxyXG5cdFx0c3BhY2U6IHNwYWNlX2xvZ2luZWRcclxuXHRcdHVzZXJfYWNjZXB0ZWQ6IHRydWVcclxuXHRcdGlzX2xvZ2luZWRfZnJvbV9zcGFjZTogdHJ1ZVxyXG5cclxuXHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHJcbiIsInZhciBQaG9uZTtcblxuUGhvbmUgPSByZXF1aXJlKCdwaG9uZScpO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gIGpvaW5TcGFjZUZyb21Mb2dpbjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjdXJyZW50VXNlciwgY3VycmVudFVzZXJJZCwgcm9vdE9yZywgc3BhY2UsIHNwYWNlX2xvZ2luZWQsIHNwYWNlX3VzZXIsIHVzZXJfZW1haWw7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBzcGFjZV9sb2dpbmVkID0gb3B0aW9ucy5zcGFjZV9sb2dpbmVkO1xuICAgIGNoZWNrKHNwYWNlX2xvZ2luZWQsIFN0cmluZyk7XG4gICAgY3VycmVudFVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGlmICghY3VycmVudFVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfbG9naW5lZCk7XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwic3BhY2VfdXNlcnNfZXJyb3Jfc3BhY2Vfbm90X2ZvdW5kXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfbG9naW5lZCxcbiAgICAgIHVzZXI6IGN1cnJlbnRVc2VyLl9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZV91c2VyKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdXNlcl9lbWFpbCA9IGN1cnJlbnRVc2VyLmVtYWlsc1swXS5hZGRyZXNzO1xuICAgIHJvb3RPcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2xvZ2luZWQsXG4gICAgICBwYXJlbnQ6IG51bGxcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgZGIuc3BhY2VfdXNlcnMuaW5zZXJ0KHtcbiAgICAgIGVtYWlsOiB1c2VyX2VtYWlsLFxuICAgICAgdXNlcjogY3VycmVudFVzZXIuX2lkLFxuICAgICAgbmFtZTogY3VycmVudFVzZXIubmFtZSxcbiAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290T3JnLl9pZF0sXG4gICAgICBzcGFjZTogc3BhY2VfbG9naW5lZCxcbiAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWUsXG4gICAgICBpc19sb2dpbmVkX2Zyb21fc3BhY2U6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyBjaGVja1VzZXI6IChvcHRpb25zKSAtPlxyXG5cdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxyXG5cdHsgY29tcGFueSxuYW1lLGVtYWlsLHBhc3N3b3JkLHByb2ZpbGUgfSA9IG9wdGlvbnNcclxuXHRjaGVjayBjb21wYW55LCBTdHJpbmdcclxuXHRjaGVjayBuYW1lLCBTdHJpbmdcclxuXHRjaGVjayBlbWFpbCwgU3RyaW5nXHJcblx0Y2hlY2sgcGFzc3dvcmQsIE9iamVjdFxyXG5cdGNoZWNrIHByb2ZpbGUsIE9iamVjdFxyXG5cclxuXHR1bmxlc3MgY29tcGFueVxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfY29tcGFueV9lbXB0eVwiKVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0dW5sZXNzIG5hbWVcclxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX25hbWVfZW1wdHlcIilcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdHVubGVzcyBlbWFpbFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfZW1haWxfZW1wdHlcIilcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdHVubGVzcyBwYXNzd29yZFxyXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfcGFzc3dvcmRfZW1wdHlcIilcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nbSwgJycpXHJcblx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoeydlbWFpbHMuYWRkcmVzcyc6IGVtYWlsfSlcclxuXHRpZiB1c2VyXHJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9lbWFpbF9leGlzdFwiKVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdHJldHVybiB0cnVlXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY2hlY2tVc2VyOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGNvbXBhbnksIGVtYWlsLCBuYW1lLCBwYXNzd29yZCwgcHJvZmlsZSwgdXNlcjtcbiAgICBjaGVjayhvcHRpb25zLCBPYmplY3QpO1xuICAgIGNvbXBhbnkgPSBvcHRpb25zLmNvbXBhbnksIG5hbWUgPSBvcHRpb25zLm5hbWUsIGVtYWlsID0gb3B0aW9ucy5lbWFpbCwgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkLCBwcm9maWxlID0gb3B0aW9ucy5wcm9maWxlO1xuICAgIGNoZWNrKGNvbXBhbnksIFN0cmluZyk7XG4gICAgY2hlY2sobmFtZSwgU3RyaW5nKTtcbiAgICBjaGVjayhlbWFpbCwgU3RyaW5nKTtcbiAgICBjaGVjayhwYXNzd29yZCwgT2JqZWN0KTtcbiAgICBjaGVjayhwcm9maWxlLCBPYmplY3QpO1xuICAgIGlmICghY29tcGFueSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfY29tcGFueV9lbXB0eVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9uYW1lX2VtcHR5XCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWVtYWlsKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9lbWFpbF9lbXB0eVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFwYXNzd29yZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfcGFzc3dvcmRfZW1wdHlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVtYWlsID0gZW1haWwudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2dtLCAnJyk7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgJ2VtYWlscy5hZGRyZXNzJzogZW1haWxcbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfZW1haWxfZXhpc3RcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbiJdfQ==
