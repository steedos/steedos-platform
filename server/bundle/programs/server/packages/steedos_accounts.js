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
}, 'steedos:creator');
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
    var path, ref;
    path = FlowRouter.current().path;

    if (/^\/oauth2\b/.test(path)) {
      return location.reload();
    } else {
      return FlowRouter.go(((ref = FlowRouter.current().queryParams) != null ? ref.redirect : void 0) || "/");
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
      is_company: true,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9jaGVja05wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczphY2NvdW50cy9saWIvVVJJLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9mb3JjZV9iaW5kX3Bob25lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2ZvcmNlX2JpbmRfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hY2NvdW50cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YWNjb3VudHMvcGFzc3dvcmRfc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VwZGF0ZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvZGlzYWJsZV9waG9uZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2Rpc2FibGVfcGhvbmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2pvaW5fc3BhY2VfZnJvbV9sb2dpbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYWNjb3VudHMvc2VydmVyL21ldGhvZHMvY2hlY2tfdXNlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2NoZWNrX3VzZXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImNvb2tpZXMiLCJwaG9uZSIsInNoYTI1NiIsInJvb3QiLCJmYWN0b3J5IiwiZGVmaW5lIiwiYW1kIiwiVVJJIiwicHVueWNvZGUiLCJJUHY2IiwiU2Vjb25kTGV2ZWxEb21haW5zIiwiU0xEIiwiX1VSSSIsInVybCIsImJhc2UiLCJfdXJsU3VwcGxpZWQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJfYmFzZVN1cHBsaWVkIiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwibG9jYXRpb24iLCJocmVmIiwiYWJzb2x1dGVUbyIsInZlcnNpb24iLCJwIiwicHJvdG90eXBlIiwiaGFzT3duIiwiT2JqZWN0IiwiaGFzT3duUHJvcGVydHkiLCJlc2NhcGVSZWdFeCIsInN0cmluZyIsInJlcGxhY2UiLCJnZXRUeXBlIiwidmFsdWUiLCJTdHJpbmciLCJ0b1N0cmluZyIsImNhbGwiLCJzbGljZSIsImlzQXJyYXkiLCJvYmoiLCJmaWx0ZXJBcnJheVZhbHVlcyIsImRhdGEiLCJsb29rdXAiLCJpIiwiX21hdGNoIiwidGVzdCIsInNwbGljZSIsImFycmF5Q29udGFpbnMiLCJsaXN0IiwiX3R5cGUiLCJtYXRjaCIsImFycmF5c0VxdWFsIiwib25lIiwidHdvIiwic29ydCIsImwiLCJ0cmltU2xhc2hlcyIsInRleHQiLCJ0cmltX2V4cHJlc3Npb24iLCJfcGFydHMiLCJwcm90b2NvbCIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJob3N0bmFtZSIsInVybiIsInBvcnQiLCJwYXRoIiwicXVlcnkiLCJmcmFnbWVudCIsImR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyIsImVzY2FwZVF1ZXJ5U3BhY2UiLCJwcm90b2NvbF9leHByZXNzaW9uIiwiaWRuX2V4cHJlc3Npb24iLCJwdW55Y29kZV9leHByZXNzaW9uIiwiaXA0X2V4cHJlc3Npb24iLCJpcDZfZXhwcmVzc2lvbiIsImZpbmRfdXJpX2V4cHJlc3Npb24iLCJmaW5kVXJpIiwic3RhcnQiLCJlbmQiLCJ0cmltIiwiZGVmYXVsdFBvcnRzIiwiaHR0cCIsImh0dHBzIiwiZnRwIiwiZ29waGVyIiwid3MiLCJ3c3MiLCJpbnZhbGlkX2hvc3RuYW1lX2NoYXJhY3RlcnMiLCJkb21BdHRyaWJ1dGVzIiwiZ2V0RG9tQXR0cmlidXRlIiwibm9kZSIsIm5vZGVOYW1lIiwidG9Mb3dlckNhc2UiLCJ0eXBlIiwiZXNjYXBlRm9yRHVtYkZpcmVmb3gzNiIsImVzY2FwZSIsInN0cmljdEVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZVVSSUNvbXBvbmVudCIsImVuY29kZSIsImRlY29kZSIsImRlY29kZVVSSUNvbXBvbmVudCIsImlzbzg4NTkiLCJ1bmVzY2FwZSIsInVuaWNvZGUiLCJjaGFyYWN0ZXJzIiwicGF0aG5hbWUiLCJleHByZXNzaW9uIiwibWFwIiwicmVzZXJ2ZWQiLCJ1cm5wYXRoIiwiZW5jb2RlUXVlcnkiLCJlc2NhcGVkIiwiZGVjb2RlUXVlcnkiLCJlIiwiX3BhcnQiLCJnZW5lcmF0ZUFjY2Vzc29yIiwiX2dyb3VwIiwiYyIsImdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uIiwiX3NlcCIsIl9jb2RpbmdGdW5jTmFtZSIsIl9pbm5lckNvZGluZ0Z1bmNOYW1lIiwiYWN0dWFsQ29kaW5nRnVuYyIsInNlZ21lbnRzIiwic3BsaXQiLCJqb2luIiwiZGVjb2RlUGF0aCIsImRlY29kZVVyblBhdGgiLCJyZWNvZGVQYXRoIiwicmVjb2RlVXJuUGF0aCIsImVuY29kZVJlc2VydmVkIiwicGFyc2UiLCJwYXJ0cyIsInBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJwYXJzZUF1dGhvcml0eSIsInBhcnNlSG9zdCIsImJyYWNrZXRQb3MiLCJ0IiwiY2hhckF0IiwiZmlyc3RDb2xvbiIsImZpcnN0U2xhc2giLCJuZXh0Q29sb24iLCJwYXJzZVVzZXJpbmZvIiwibGFzdEluZGV4T2YiLCJzaGlmdCIsInBhcnNlUXVlcnkiLCJpdGVtcyIsInNwbGl0cyIsIm5hbWUiLCJwdXNoIiwiYnVpbGQiLCJidWlsZEF1dGhvcml0eSIsImJ1aWxkSG9zdCIsImJ1aWxkVXNlcmluZm8iLCJidWlsZFF1ZXJ5IiwidW5pcXVlIiwia2V5IiwiYnVpbGRRdWVyeVBhcmFtZXRlciIsImFkZFF1ZXJ5IiwiY29uY2F0IiwicmVtb3ZlUXVlcnkiLCJoYXNRdWVyeSIsIndpdGhpbkFycmF5IiwiX2Jvb2x5IiwiQm9vbGVhbiIsIm9wIiwiY29tbW9uUGF0aCIsIk1hdGgiLCJtaW4iLCJ3aXRoaW5TdHJpbmciLCJjYWxsYmFjayIsIm9wdGlvbnMiLCJfc3RhcnQiLCJfZW5kIiwiX3RyaW0iLCJfYXR0cmlidXRlT3BlbiIsImxhc3RJbmRleCIsImV4ZWMiLCJpbmRleCIsImlnbm9yZUh0bWwiLCJhdHRyaWJ1dGVPcGVuIiwibWF4Iiwic2VhcmNoIiwiaWdub3JlIiwicmVzdWx0IiwiZW5zdXJlVmFsaWRIb3N0bmFtZSIsInRvQVNDSUkiLCJub0NvbmZsaWN0IiwicmVtb3ZlQWxsIiwidW5jb25mbGljdGVkIiwiVVJJVGVtcGxhdGUiLCJkZWZlckJ1aWxkIiwiX2RlZmVycmVkX2J1aWxkIiwiX3N0cmluZyIsImNsb25lIiwidmFsdWVPZiIsImdlbmVyYXRlU2ltcGxlQWNjZXNzb3IiLCJnZW5lcmF0ZVByZWZpeEFjY2Vzc29yIiwiX2tleSIsImhhc2giLCJyZXMiLCJfb2JqZWN0IiwiYXR0cmlidXRlIiwic3JjIiwiaXMiLCJ3aGF0IiwiaXAiLCJpcDQiLCJpcDYiLCJzbGQiLCJpZG4iLCJyZWxhdGl2ZSIsImhhcyIsIl9wcm90b2NvbCIsIl9wb3J0IiwiX2hvc3RuYW1lIiwic2NoZW1lIiwieCIsIm9yaWdpbiIsImF1dGhvcml0eSIsImhvc3QiLCJ1c2VyaW5mbyIsInJlc291cmNlIiwic3ViZG9tYWluIiwiZG9tYWluIiwic3ViIiwiUmVnRXhwIiwidGxkIiwiZ2V0IiwiUmVmZXJlbmNlRXJyb3IiLCJkaXJlY3RvcnkiLCJmaWxlbmFtZSIsImRlY29kZVBhdGhTZWdtZW50IiwibXV0YXRlZERpcmVjdG9yeSIsIm5vcm1hbGl6ZVBhdGgiLCJzdWZmaXgiLCJzIiwic2VnbWVudCIsInNlcGFyYXRvciIsImFic29sdXRlIiwiRXJyb3IiLCJwb3AiLCJ1bnNoaWZ0Iiwic2VnbWVudENvZGVkIiwicSIsInNldFF1ZXJ5Iiwic2V0U2VhcmNoIiwiYWRkU2VhcmNoIiwicmVtb3ZlU2VhcmNoIiwiaGFzU2VhcmNoIiwibm9ybWFsaXplIiwibm9ybWFsaXplUHJvdG9jb2wiLCJub3JtYWxpemVRdWVyeSIsIm5vcm1hbGl6ZUZyYWdtZW50Iiwibm9ybWFsaXplSG9zdG5hbWUiLCJub3JtYWxpemVQb3J0IiwiYmVzdCIsIl9wYXRoIiwiX3dhc19yZWxhdGl2ZSIsIl9sZWFkaW5nUGFyZW50cyIsIl9wYXJlbnQiLCJfcG9zIiwibm9ybWFsaXplUGF0aG5hbWUiLCJub3JtYWxpemVTZWFyY2giLCJub3JtYWxpemVIYXNoIiwiZCIsInJlYWRhYmxlIiwidXJpIiwidG9Vbmljb2RlIiwicXAiLCJrdiIsInJlc29sdmVkIiwicHJvcGVydGllcyIsImJhc2VkaXIiLCJyZWxhdGl2ZVRvIiwicmVsYXRpdmVQYXJ0cyIsImJhc2VQYXJ0cyIsImNvbW1vbiIsInJlbGF0aXZlUGF0aCIsImJhc2VQYXRoIiwicGFyZW50cyIsImVxdWFscyIsIm9uZV9tYXAiLCJ0d29fbWFwIiwiY2hlY2tlZCIsIm9uZV9xdWVyeSIsInR3b19xdWVyeSIsIlN0ZWVkb3MiLCJNZXRlb3IiLCJhYnNvbHV0ZVVybCIsIl8iLCJleHRlbmQiLCJBY2NvdW50cyIsInVwZGF0ZVBob25lIiwibnVtYmVyIiwiaXNTZXJ2ZXIiLCJpc0NsaWVudCIsImRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cyIsImV4cGlyZWREYXlzIiwiZ2V0UGhvbmVOdW1iZXIiLCJpc0luY2x1ZGVQcmVmaXgiLCJ1c2VyIiwicmVmIiwicmVmMSIsImRiIiwidXNlcnMiLCJmaW5kT25lIiwibW9iaWxlIiwiRTE2NCIsImdldFBob25lTnVtYmVyV2l0aG91dFByZWZpeCIsImdldFBob25lUHJlZml4IiwicHJlZml4IiwiY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCIsInJlZjIiLCJzZXR0aW5ncyIsImZvcmNlQWNjb3VudEJpbmRQaG9uZSIsIm1ldGhvZHMiLCJjaGVja0ZvcmNlQmluZFBob25lIiwic3BhY2VzIiwibm9Gb3JjZVVzZXJzIiwic3BhY2Vfc2V0dGluZ3MiLCJjaGVjayIsIkFycmF5IiwiZmluZCIsInNwYWNlIiwiJGluIiwiZm9yRWFjaCIsIm4iLCJyZWYzIiwidmFsdWVzIiwidW5pb24iLCJ1c2VySWQiLCJpc0ZvcmNlQmluZFBob25lIiwicmVmNCIsInJlZjUiLCJpc01vYmlsZSIsIm9uTG9naW4iLCJpc1Bob25lVmVyaWZpZWQiLCJzZXRUaW1lb3V0IiwiZmV0Y2giLCJnZXRQcm9wZXJ0eSIsImVycm9yIiwicmVzdWx0cyIsInJvdXRlclBhdGgiLCJzZXR1cFVybCIsInRvYXN0ciIsInJlYXNvbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImN1cnJlbnQiLCJjbG9zZUJ1dHRvbiIsInRpbWVPdXQiLCJleHRlbmRlZFRpbWVPdXQiLCJvbmNsaWNrIiwib3BlbldpbmRvdyIsInB3ZEZpZWxkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwiUGFja2FnZSIsIkFjY291bnRzVGVtcGxhdGVzIiwiY29uZmlndXJlIiwiZGVmYXVsdExheW91dCIsImRlZmF1bHRMYXlvdXRSZWdpb25zIiwibmF2IiwiZGVmYXVsdENvbnRlbnRSZWdpb24iLCJzaG93Rm9yZ290UGFzc3dvcmRMaW5rIiwib3ZlcnJpZGVMb2dpbkVycm9ycyIsImVuYWJsZVBhc3N3b3JkQ2hhbmdlIiwiaG9tZVJvdXRlUGF0aCIsIm5lZ2F0aXZlVmFsaWRhdGlvbiIsInBvc2l0aXZlVmFsaWRhdGlvbiIsIm5lZ2F0aXZlRmVlZGJhY2siLCJwb3NpdGl2ZUZlZWRiYWNrIiwic2hvd0xhYmVscyIsInByZVNpZ25VcEhvb2siLCJwcm9maWxlIiwibG9jYWxlIiwiZ2V0TG9jYWxlIiwiY29uZmlndXJlUm91dGUiLCJyZWRpcmVjdCIsInJlbG9hZCIsInF1ZXJ5UGFyYW1zIiwiZW1haWwiLCJlbWFpbHMiLCJhZGRyZXNzIiwiJCIsImRvY3VtZW50IiwiYm9keSIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCJtZXNzYWdlIiwicmVtb3ZlRmllbGQiLCJhZGRGaWVsZHMiLCJfaWQiLCJyZXF1aXJlZCIsImRpc3BsYXlOYW1lIiwicmUiLCJlcnJTdHIiLCJwbGFjZWhvbGRlciIsImZvcmdvdFB3ZCIsIm1pbkxlbmd0aCIsImVtYWlsVGVtcGxhdGVzIiwic2l0ZU5hbWUiLCJmcm9tIiwiYWNjb3VudHMiLCJkaXNhYmxlQWNjb3VudFJlZ2lzdHJhdGlvbiIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImJjcnlwdCIsIk5wbU1vZHVsZUJjcnlwdCIsImJjcnlwdEhhc2giLCJ3cmFwQXN5bmMiLCJiY3J5cHRDb21wYXJlIiwiY29tcGFyZSIsInBhc3N3b3JkVmFsaWRhdG9yIiwiTWF0Y2giLCJPbmVPZiIsImRpZ2VzdCIsImFsZ29yaXRobSIsImNoZWNrUGFzc3dvcmQiLCJfY2hlY2tQYXNzd29yZCIsImdldFBhc3N3b3JkU3RyaW5nIiwiU0hBMjU2IiwiaGFzaFBhc3N3b3JkIiwiX2JjcnlwdFJvdW5kcyIsImhhbmRsZUVycm9yIiwibXNnIiwidGhyb3dFcnJvciIsIl9vcHRpb25zIiwiYW1iaWd1b3VzRXJyb3JNZXNzYWdlcyIsImdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyIsInBlcm11dGF0aW9ucyIsImNoIiwiZmxhdHRlbiIsImxvd2VyQ2FzZUNoYXIiLCJ1cHBlckNhc2VDaGFyIiwidG9VcHBlckNhc2UiLCJzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAiLCJmaWVsZE5hbWUiLCJvckNsYXVzZSIsInByZWZpeFBlcm11dGF0aW9uIiwic2VsZWN0b3IiLCJfZXNjYXBlUmVnRXhwIiwiY2FzZUluc2Vuc2l0aXZlQ2xhdXNlIiwiJGFuZCIsIiRvciIsIl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zIiwiaWQiLCJmaWVsZFZhbHVlIiwiY2FuZGlkYXRlVXNlcnMiLCJOb25FbXB0eVN0cmluZyIsIldoZXJlIiwidXNlclF1ZXJ5VmFsaWRhdG9yIiwiT3B0aW9uYWwiLCJrZXlzIiwicmVnaXN0ZXJMb2dpbkhhbmRsZXIiLCJwYXNzd29yZDIiLCJzcnAiLCJzZXJ2aWNlcyIsInZlcmlmaWVyIiwibmV3VmVyaWZpZXIiLCJTUlAiLCJnZW5lcmF0ZVZlcmlmaWVyIiwiaWRlbnRpdHkiLCJzYWx0IiwiRUpTT04iLCJzdHJpbmdpZnkiLCJmb3JtYXQiLCJ2MSIsInYyIiwiaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCIsInNhbHRlZCIsInVwZGF0ZSIsIiR1bnNldCIsIiRzZXQiLCJQaG9uZSIsInJlcXVpcmUiLCJjdXJyZW50TnVtYmVyIiwiY3VycmVudFVzZXIiLCJjdXJyZW50VXNlcklkIiwicmVwZWF0TnVtYmVyVXNlciIsImZpZWxkcyIsInZlcmlmaWVkIiwibW9kaWZpZWQiLCJub3ciLCJvdXREYXlzIiwiTnVtYmVyIiwiRGF0ZSIsImZsb29yIiwiZ2V0VGltZSIsImpvaW5TcGFjZUZyb21Mb2dpbiIsInJvb3RPcmciLCJzcGFjZV9sb2dpbmVkIiwic3BhY2VfdXNlciIsInVzZXJfZW1haWwiLCJzcGFjZV91c2VycyIsIm9yZ2FuaXphdGlvbnMiLCJpc19jb21wYW55IiwicGFyZW50IiwiaW5zZXJ0IiwidXNlcl9hY2NlcHRlZCIsImlzX2xvZ2luZWRfZnJvbV9zcGFjZSIsImNoZWNrVXNlciIsImNvbXBhbnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7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VCxDQUFpQjtBQUFDLHdCQUFrQjhFO0FBQW5CLEtBQWpCLENBQVA7O0FBQ0EsUUFBR25GLElBQUg7QUFDQyxZQUFNLElBQUliLE9BQU9oRCxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLCtCQUF0QixDQUFOO0FBQ0EsYUFBTyxLQUFQO0FDT0c7O0FETEosV0FBTyxJQUFQO0FBNUJjO0FBQUEsQ0FBZixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2FjY291bnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxuXHRwaG9uZTogXCJeMS4wLjEyXCIsXG5cdHNoYTI1NjogXCJeMC4yLjBcIlxufSwgJ3N0ZWVkb3M6Y3JlYXRvcicpOyIsIi8qIVxuICogVVJJLmpzIC0gTXV0YXRpbmcgVVJMc1xuICpcbiAqIFZlcnNpb246IDEuMTcuMFxuICpcbiAqIEF1dGhvcjogUm9kbmV5IFJlaG1cbiAqIFdlYjogaHR0cDovL21lZGlhbGl6ZS5naXRodWIuaW8vVVJJLmpzL1xuICpcbiAqIExpY2Vuc2VkIHVuZGVyXG4gKiAgIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2VcbiAqICAgR1BMIHYzIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9HUEwtMy4wXG4gKlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbiAgLy8gaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAvLyAgIC8vIE5vZGVcbiAgLy8gICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZSgnLi9wdW55Y29kZScpLCByZXF1aXJlKCcuL0lQdjYnKSwgcmVxdWlyZSgnLi9TZWNvbmRMZXZlbERvbWFpbnMnKSk7XG4gIC8vIH0gZWxzZVxuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbJy4vcHVueWNvZGUnLCAnLi9JUHY2JywgJy4vU2Vjb25kTGV2ZWxEb21haW5zJ10sIGZhY3RvcnkpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5VUkkgPSBmYWN0b3J5KHJvb3QucHVueWNvZGUsIHJvb3QuSVB2Niwgcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMsIHJvb3QpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uIChwdW55Y29kZSwgSVB2NiwgU0xELCByb290KSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgLypnbG9iYWwgbG9jYXRpb24sIGVzY2FwZSwgdW5lc2NhcGUgKi9cbiAgLy8gRklYTUU6IHYyLjAuMCByZW5hbWNlIG5vbi1jYW1lbENhc2UgcHJvcGVydGllcyB0byB1cHBlcmNhc2VcbiAgLypqc2hpbnQgY2FtZWxjYXNlOiBmYWxzZSAqL1xuXG4gIC8vIHNhdmUgY3VycmVudCBVUkkgdmFyaWFibGUsIGlmIGFueVxuICB2YXIgX1VSSSA9IHJvb3QgJiYgcm9vdC5VUkk7XG5cbiAgZnVuY3Rpb24gVVJJKHVybCwgYmFzZSkge1xuICAgIHZhciBfdXJsU3VwcGxpZWQgPSBhcmd1bWVudHMubGVuZ3RoID49IDE7XG4gICAgdmFyIF9iYXNlU3VwcGxpZWQgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG5cbiAgICAvLyBBbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgdGhlICduZXcnIGtleXdvcmRcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVVJJKSkge1xuICAgICAgaWYgKF91cmxTdXBwbGllZCkge1xuICAgICAgICBpZiAoX2Jhc2VTdXBwbGllZCkge1xuICAgICAgICAgIHJldHVybiBuZXcgVVJJKHVybCwgYmFzZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFVSSSh1cmwpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFVSSSgpO1xuICAgIH1cblxuICAgIGlmICh1cmwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKF91cmxTdXBwbGllZCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd1bmRlZmluZWQgaXMgbm90IGEgdmFsaWQgYXJndW1lbnQgZm9yIFVSSScpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGxvY2F0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB1cmwgPSBsb2NhdGlvbi5ocmVmICsgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmwgPSAnJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmhyZWYodXJsKTtcblxuICAgIC8vIHJlc29sdmUgdG8gYmFzZSBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCNjb25zdHJ1Y3RvclxuICAgIGlmIChiYXNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLmFic29sdXRlVG8oYmFzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBVUkkudmVyc2lvbiA9ICcxLjE3LjAnO1xuXG4gIHZhciBwID0gVVJJLnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbiAgZnVuY3Rpb24gZXNjYXBlUmVnRXgoc3RyaW5nKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvY29tbWl0Lzg1YWMyMTc4M2MxMWY4Y2NhYjA2MTA2ZGJhOTczNWEzMWE4NjkyNGQjY29tbWl0Y29tbWVudC04MjE5NjNcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbLiorP149IToke30oKXxbXFxdXFwvXFxcXF0pL2csICdcXFxcJDEnKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFR5cGUodmFsdWUpIHtcbiAgICAvLyBJRTggZG9lc24ndCByZXR1cm4gW09iamVjdCBVbmRlZmluZWRdIGJ1dCBbT2JqZWN0IE9iamVjdF0gZm9yIHVuZGVmaW5lZCB2YWx1ZVxuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gJ1VuZGVmaW5lZCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpKS5zbGljZSg4LCAtMSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgIHJldHVybiBnZXRUeXBlKG9iaikgPT09ICdBcnJheSc7XG4gIH1cblxuICBmdW5jdGlvbiBmaWx0ZXJBcnJheVZhbHVlcyhkYXRhLCB2YWx1ZSkge1xuICAgIHZhciBsb29rdXAgPSB7fTtcbiAgICB2YXIgaSwgbGVuZ3RoO1xuXG4gICAgaWYgKGdldFR5cGUodmFsdWUpID09PSAnUmVnRXhwJykge1xuICAgICAgbG9va3VwID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBsb29rdXBbdmFsdWVbaV1dID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9va3VwW3ZhbHVlXSA9IHRydWU7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMCwgbGVuZ3RoID0gZGF0YS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cbiAgICAgIHZhciBfbWF0Y2ggPSBsb29rdXAgJiYgbG9va3VwW2RhdGFbaV1dICE9PSB1bmRlZmluZWRcbiAgICAgICAgfHwgIWxvb2t1cCAmJiB2YWx1ZS50ZXN0KGRhdGFbaV0pO1xuICAgICAgLypqc2hpbnQgbGF4YnJlYWs6IGZhbHNlICovXG4gICAgICBpZiAoX21hdGNoKSB7XG4gICAgICAgIGRhdGEuc3BsaWNlKGksIDEpO1xuICAgICAgICBsZW5ndGgtLTtcbiAgICAgICAgaS0tO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgZnVuY3Rpb24gYXJyYXlDb250YWlucyhsaXN0LCB2YWx1ZSkge1xuICAgIHZhciBpLCBsZW5ndGg7XG5cbiAgICAvLyB2YWx1ZSBtYXkgYmUgc3RyaW5nLCBudW1iZXIsIGFycmF5LCByZWdleHBcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIC8vIE5vdGU6IHRoaXMgY2FuIGJlIG9wdGltaXplZCB0byBPKG4pIChpbnN0ZWFkIG9mIGN1cnJlbnQgTyhtICogbikpXG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSB2YWx1ZS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoIWFycmF5Q29udGFpbnMobGlzdCwgdmFsdWVbaV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBfdHlwZSA9IGdldFR5cGUodmFsdWUpO1xuICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChfdHlwZSA9PT0gJ1JlZ0V4cCcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0W2ldID09PSAnc3RyaW5nJyAmJiBsaXN0W2ldLm1hdGNoKHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGxpc3RbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFycmF5c0VxdWFsKG9uZSwgdHdvKSB7XG4gICAgaWYgKCFpc0FycmF5KG9uZSkgfHwgIWlzQXJyYXkodHdvKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGFycmF5cyBjYW4ndCBiZSBlcXVhbCBpZiB0aGV5IGhhdmUgZGlmZmVyZW50IGFtb3VudCBvZiBjb250ZW50XG4gICAgaWYgKG9uZS5sZW5ndGggIT09IHR3by5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbmUuc29ydCgpO1xuICAgIHR3by5zb3J0KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9uZS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChvbmVbaV0gIT09IHR3b1tpXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB0cmltU2xhc2hlcyh0ZXh0KSB7XG4gICAgdmFyIHRyaW1fZXhwcmVzc2lvbiA9IC9eXFwvK3xcXC8rJC9nO1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UodHJpbV9leHByZXNzaW9uLCAnJyk7XG4gIH1cblxuICBVUkkuX3BhcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByb3RvY29sOiBudWxsLFxuICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgIGhvc3RuYW1lOiBudWxsLFxuICAgICAgdXJuOiBudWxsLFxuICAgICAgcG9ydDogbnVsbCxcbiAgICAgIHBhdGg6IG51bGwsXG4gICAgICBxdWVyeTogbnVsbCxcbiAgICAgIGZyYWdtZW50OiBudWxsLFxuICAgICAgLy8gc3RhdGVcbiAgICAgIGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVyczogVVJJLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyxcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2U6IFVSSS5lc2NhcGVRdWVyeVNwYWNlXG4gICAgfTtcbiAgfTtcbiAgLy8gc3RhdGU6IGFsbG93IGR1cGxpY2F0ZSBxdWVyeSBwYXJhbWV0ZXJzIChhPTEmYT0xKVxuICBVUkkuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gZmFsc2U7XG4gIC8vIHN0YXRlOiByZXBsYWNlcyArIHdpdGggJTIwIChzcGFjZSBpbiBxdWVyeSBzdHJpbmdzKVxuICBVUkkuZXNjYXBlUXVlcnlTcGFjZSA9IHRydWU7XG4gIC8vIHN0YXRpYyBwcm9wZXJ0aWVzXG4gIFVSSS5wcm90b2NvbF9leHByZXNzaW9uID0gL15bYS16XVthLXowLTkuKy1dKiQvaTtcbiAgVVJJLmlkbl9leHByZXNzaW9uID0gL1teYS16MC05XFwuLV0vaTtcbiAgVVJJLnB1bnljb2RlX2V4cHJlc3Npb24gPSAvKHhuLS0pL2k7XG4gIC8vIHdlbGwsIDMzMy40NDQuNTU1LjY2NiBtYXRjaGVzLCBidXQgaXQgc3VyZSBhaW4ndCBubyBJUHY0IC0gZG8gd2UgY2FyZT9cbiAgVVJJLmlwNF9leHByZXNzaW9uID0gL15cXGR7MSwzfVxcLlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfSQvO1xuICAvLyBjcmVkaXRzIHRvIFJpY2ggQnJvd25cbiAgLy8gc291cmNlOiBodHRwOi8vZm9ydW1zLmludGVybWFwcGVyLmNvbS92aWV3dG9waWMucGhwP3A9MTA5NiMxMDk2XG4gIC8vIHNwZWNpZmljYXRpb246IGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQyOTEudHh0XG4gIFVSSS5pcDZfZXhwcmVzc2lvbiA9IC9eXFxzKigoKFswLTlBLUZhLWZdezEsNH06KXs3fShbMC05QS1GYS1mXXsxLDR9fDopKXwoKFswLTlBLUZhLWZdezEsNH06KXs2fSg6WzAtOUEtRmEtZl17MSw0fXwoKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezV9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsMn0pfDooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezR9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsM30pfCgoOlswLTlBLUZhLWZdezEsNH0pPzooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoKFswLTlBLUZhLWZdezEsNH06KXszfSgoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDR9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDJ9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpfCgoWzAtOUEtRmEtZl17MSw0fTopezJ9KCgoOlswLTlBLUZhLWZdezEsNH0pezEsNX0pfCgoOlswLTlBLUZhLWZdezEsNH0pezAsM306KCgyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkoXFwuKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKSl7M30pKXw6KSl8KChbMC05QS1GYS1mXXsxLDR9Oil7MX0oKCg6WzAtOUEtRmEtZl17MSw0fSl7MSw2fSl8KCg6WzAtOUEtRmEtZl17MSw0fSl7MCw0fTooKDI1WzAtNV18MlswLTRdXFxkfDFcXGRcXGR8WzEtOV0/XFxkKShcXC4oMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKXszfSkpfDopKXwoOigoKDpbMC05QS1GYS1mXXsxLDR9KXsxLDd9KXwoKDpbMC05QS1GYS1mXXsxLDR9KXswLDV9OigoMjVbMC01XXwyWzAtNF1cXGR8MVxcZFxcZHxbMS05XT9cXGQpKFxcLigyNVswLTVdfDJbMC00XVxcZHwxXFxkXFxkfFsxLTldP1xcZCkpezN9KSl8OikpKSglLispP1xccyokLztcbiAgLy8gZXhwcmVzc2lvbiB1c2VkIGlzIFwiZ3J1YmVyIHJldmlzZWRcIiAoQGdydWJlciB2MikgZGV0ZXJtaW5lZCB0byBiZSB0aGVcbiAgLy8gYmVzdCBzb2x1dGlvbiBpbiBhIHJlZ2V4LWdvbGYgd2UgZGlkIGEgY291cGxlIG9mIGFnZXMgYWdvIGF0XG4gIC8vICogaHR0cDovL21hdGhpYXNieW5lbnMuYmUvZGVtby91cmwtcmVnZXhcbiAgLy8gKiBodHRwOi8vcm9kbmV5cmVobS5kZS90L3VybC1yZWdleC5odG1sXG4gIFVSSS5maW5kX3VyaV9leHByZXNzaW9uID0gL1xcYigoPzpbYS16XVtcXHctXSs6KD86XFwvezEsM318W2EtejAtOSVdKXx3d3dcXGR7MCwzfVsuXXxbYS16MC05LlxcLV0rWy5dW2Etel17Miw0fVxcLykoPzpbXlxccygpPD5dK3xcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpKSsoPzpcXCgoW15cXHMoKTw+XSt8KFxcKFteXFxzKCk8Pl0rXFwpKSkqXFwpfFteXFxzYCEoKVxcW1xcXXt9OzonXCIuLDw+P8KrwrvigJzigJ3igJjigJldKSkvaWc7XG4gIFVSSS5maW5kVXJpID0ge1xuICAgIC8vIHZhbGlkIFwic2NoZW1lOi8vXCIgb3IgXCJ3d3cuXCJcbiAgICBzdGFydDogL1xcYig/OihbYS16XVthLXowLTkuKy1dKjpcXC9cXC8pfHd3d1xcLikvZ2ksXG4gICAgLy8gZXZlcnl0aGluZyB1cCB0byB0aGUgbmV4dCB3aGl0ZXNwYWNlXG4gICAgZW5kOiAvW1xcc1xcclxcbl18JC8sXG4gICAgLy8gdHJpbSB0cmFpbGluZyBwdW5jdHVhdGlvbiBjYXB0dXJlZCBieSBlbmQgUmVnRXhwXG4gICAgdHJpbTogL1tgISgpXFxbXFxde307OidcIi4sPD4/wqvCu+KAnOKAneKAnuKAmOKAmV0rJC9cbiAgfTtcbiAgLy8gaHR0cDovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy91cmktc2NoZW1lcy5odG1sXG4gIC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTGlzdF9vZl9UQ1BfYW5kX1VEUF9wb3J0X251bWJlcnMjV2VsbC1rbm93bl9wb3J0c1xuICBVUkkuZGVmYXVsdFBvcnRzID0ge1xuICAgIGh0dHA6ICc4MCcsXG4gICAgaHR0cHM6ICc0NDMnLFxuICAgIGZ0cDogJzIxJyxcbiAgICBnb3BoZXI6ICc3MCcsXG4gICAgd3M6ICc4MCcsXG4gICAgd3NzOiAnNDQzJ1xuICB9O1xuICAvLyBhbGxvd2VkIGhvc3RuYW1lIGNoYXJhY3RlcnMgYWNjb3JkaW5nIHRvIFJGQyAzOTg2XG4gIC8vIEFMUEhBIERJR0lUIFwiLVwiIFwiLlwiIFwiX1wiIFwiflwiIFwiIVwiIFwiJFwiIFwiJlwiIFwiJ1wiIFwiKFwiIFwiKVwiIFwiKlwiIFwiK1wiIFwiLFwiIFwiO1wiIFwiPVwiICVlbmNvZGVkXG4gIC8vIEkndmUgbmV2ZXIgc2VlbiBhIChub24tSUROKSBob3N0bmFtZSBvdGhlciB0aGFuOiBBTFBIQSBESUdJVCAuIC1cbiAgVVJJLmludmFsaWRfaG9zdG5hbWVfY2hhcmFjdGVycyA9IC9bXmEtekEtWjAtOVxcLi1dLztcbiAgLy8gbWFwIERPTSBFbGVtZW50cyB0byB0aGVpciBVUkkgYXR0cmlidXRlXG4gIFVSSS5kb21BdHRyaWJ1dGVzID0ge1xuICAgICdhJzogJ2hyZWYnLFxuICAgICdibG9ja3F1b3RlJzogJ2NpdGUnLFxuICAgICdsaW5rJzogJ2hyZWYnLFxuICAgICdiYXNlJzogJ2hyZWYnLFxuICAgICdzY3JpcHQnOiAnc3JjJyxcbiAgICAnZm9ybSc6ICdhY3Rpb24nLFxuICAgICdpbWcnOiAnc3JjJyxcbiAgICAnYXJlYSc6ICdocmVmJyxcbiAgICAnaWZyYW1lJzogJ3NyYycsXG4gICAgJ2VtYmVkJzogJ3NyYycsXG4gICAgJ3NvdXJjZSc6ICdzcmMnLFxuICAgICd0cmFjayc6ICdzcmMnLFxuICAgICdpbnB1dCc6ICdzcmMnLCAvLyBidXQgb25seSBpZiB0eXBlPVwiaW1hZ2VcIlxuICAgICdhdWRpbyc6ICdzcmMnLFxuICAgICd2aWRlbyc6ICdzcmMnXG4gIH07XG4gIFVSSS5nZXREb21BdHRyaWJ1dGUgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgaWYgKCFub2RlIHx8ICFub2RlLm5vZGVOYW1lKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAvLyA8aW5wdXQ+IHNob3VsZCBvbmx5IGV4cG9zZSBzcmMgZm9yIHR5cGU9XCJpbWFnZVwiXG4gICAgaWYgKG5vZGVOYW1lID09PSAnaW5wdXQnICYmIG5vZGUudHlwZSAhPT0gJ2ltYWdlJykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gVVJJLmRvbUF0dHJpYnV0ZXNbbm9kZU5hbWVdO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZUZvckR1bWJGaXJlZm94MzYodmFsdWUpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvOTFcbiAgICByZXR1cm4gZXNjYXBlKHZhbHVlKTtcbiAgfVxuXG4gIC8vIGVuY29kaW5nIC8gZGVjb2RpbmcgYWNjb3JkaW5nIHRvIFJGQzM5ODZcbiAgZnVuY3Rpb24gc3RyaWN0RW5jb2RlVVJJQ29tcG9uZW50KHN0cmluZykge1xuICAgIC8vIHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2VuY29kZVVSSUNvbXBvbmVudFxuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyaW5nKVxuICAgICAgLnJlcGxhY2UoL1shJygpKl0vZywgZXNjYXBlRm9yRHVtYkZpcmVmb3gzNilcbiAgICAgIC5yZXBsYWNlKC9cXCovZywgJyUyQScpO1xuICB9XG4gIFVSSS5lbmNvZGUgPSBzdHJpY3RFbmNvZGVVUklDb21wb25lbnQ7XG4gIFVSSS5kZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG4gIFVSSS5pc284ODU5ID0gZnVuY3Rpb24oKSB7XG4gICAgVVJJLmVuY29kZSA9IGVzY2FwZTtcbiAgICBVUkkuZGVjb2RlID0gdW5lc2NhcGU7XG4gIH07XG4gIFVSSS51bmljb2RlID0gZnVuY3Rpb24oKSB7XG4gICAgVVJJLmVuY29kZSA9IHN0cmljdEVuY29kZVVSSUNvbXBvbmVudDtcbiAgICBVUkkuZGVjb2RlID0gZGVjb2RlVVJJQ29tcG9uZW50O1xuICB9O1xuICBVUkkuY2hhcmFjdGVycyA9IHtcbiAgICBwYXRobmFtZToge1xuICAgICAgZW5jb2RlOiB7XG4gICAgICAgIC8vIFJGQzM5ODYgMi4xOiBGb3IgY29uc2lzdGVuY3ksIFVSSSBwcm9kdWNlcnMgYW5kIG5vcm1hbGl6ZXJzIHNob3VsZFxuICAgICAgICAvLyB1c2UgdXBwZXJjYXNlIGhleGFkZWNpbWFsIGRpZ2l0cyBmb3IgYWxsIHBlcmNlbnQtZW5jb2RpbmdzLlxuICAgICAgICBleHByZXNzaW9uOiAvJSgyNHwyNnwyQnwyQ3wzQnwzRHwzQXw0MCkvaWcsXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgIC8vIC0uX34hJygpKlxuICAgICAgICAgICclMjQnOiAnJCcsXG4gICAgICAgICAgJyUyNic6ICcmJyxcbiAgICAgICAgICAnJTJCJzogJysnLFxuICAgICAgICAgICclMkMnOiAnLCcsXG4gICAgICAgICAgJyUzQic6ICc7JyxcbiAgICAgICAgICAnJTNEJzogJz0nLFxuICAgICAgICAgICclM0EnOiAnOicsXG4gICAgICAgICAgJyU0MCc6ICdAJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgZGVjb2RlOiB7XG4gICAgICAgIGV4cHJlc3Npb246IC9bXFwvXFw/I10vZyxcbiAgICAgICAgbWFwOiB7XG4gICAgICAgICAgJy8nOiAnJTJGJyxcbiAgICAgICAgICAnPyc6ICclM0YnLFxuICAgICAgICAgICcjJzogJyUyMydcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVzZXJ2ZWQ6IHtcbiAgICAgIGVuY29kZToge1xuICAgICAgICAvLyBSRkMzOTg2IDIuMTogRm9yIGNvbnNpc3RlbmN5LCBVUkkgcHJvZHVjZXJzIGFuZCBub3JtYWxpemVycyBzaG91bGRcbiAgICAgICAgLy8gdXNlIHVwcGVyY2FzZSBoZXhhZGVjaW1hbCBkaWdpdHMgZm9yIGFsbCBwZXJjZW50LWVuY29kaW5ncy5cbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjF8MjN8MjR8MjZ8Mjd8Mjh8Mjl8MkF8MkJ8MkN8MkZ8M0F8M0J8M0R8M0Z8NDB8NUJ8NUQpL2lnLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAvLyBnZW4tZGVsaW1zXG4gICAgICAgICAgJyUzQSc6ICc6JyxcbiAgICAgICAgICAnJTJGJzogJy8nLFxuICAgICAgICAgICclM0YnOiAnPycsXG4gICAgICAgICAgJyUyMyc6ICcjJyxcbiAgICAgICAgICAnJTVCJzogJ1snLFxuICAgICAgICAgICclNUQnOiAnXScsXG4gICAgICAgICAgJyU0MCc6ICdAJyxcbiAgICAgICAgICAvLyBzdWItZGVsaW1zXG4gICAgICAgICAgJyUyMSc6ICchJyxcbiAgICAgICAgICAnJTI0JzogJyQnLFxuICAgICAgICAgICclMjYnOiAnJicsXG4gICAgICAgICAgJyUyNyc6ICdcXCcnLFxuICAgICAgICAgICclMjgnOiAnKCcsXG4gICAgICAgICAgJyUyOSc6ICcpJyxcbiAgICAgICAgICAnJTJBJzogJyonLFxuICAgICAgICAgICclMkInOiAnKycsXG4gICAgICAgICAgJyUyQyc6ICcsJyxcbiAgICAgICAgICAnJTNCJzogJzsnLFxuICAgICAgICAgICclM0QnOiAnPSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgdXJucGF0aDoge1xuICAgICAgLy8gVGhlIGNoYXJhY3RlcnMgdW5kZXIgYGVuY29kZWAgYXJlIHRoZSBjaGFyYWN0ZXJzIGNhbGxlZCBvdXQgYnkgUkZDIDIxNDEgYXMgYmVpbmcgYWNjZXB0YWJsZVxuICAgICAgLy8gZm9yIHVzYWdlIGluIGEgVVJOLiBSRkMyMTQxIGFsc28gY2FsbHMgb3V0IFwiLVwiLCBcIi5cIiwgYW5kIFwiX1wiIGFzIGFjY2VwdGFibGUgY2hhcmFjdGVycywgYnV0XG4gICAgICAvLyB0aGVzZSBhcmVuJ3QgZW5jb2RlZCBieSBlbmNvZGVVUklDb21wb25lbnQsIHNvIHdlIGRvbid0IGhhdmUgdG8gY2FsbCB0aGVtIG91dCBoZXJlLiBBbHNvXG4gICAgICAvLyBub3RlIHRoYXQgdGhlIGNvbG9uIGNoYXJhY3RlciBpcyBub3QgZmVhdHVyZWQgaW4gdGhlIGVuY29kaW5nIG1hcDsgdGhpcyBpcyBiZWNhdXNlIFVSSS5qc1xuICAgICAgLy8gZ2l2ZXMgdGhlIGNvbG9ucyBpbiBVUk5zIHNlbWFudGljIG1lYW5pbmcgYXMgdGhlIGRlbGltaXRlcnMgb2YgcGF0aCBzZWdlbWVudHMsIGFuZCBzbyBpdFxuICAgICAgLy8gc2hvdWxkIG5vdCBhcHBlYXIgdW5lbmNvZGVkIGluIGEgc2VnbWVudCBpdHNlbGYuXG4gICAgICAvLyBTZWUgYWxzbyB0aGUgbm90ZSBhYm92ZSBhYm91dCBSRkMzOTg2IGFuZCBjYXBpdGFsYWxpemVkIGhleCBkaWdpdHMuXG4gICAgICBlbmNvZGU6IHtcbiAgICAgICAgZXhwcmVzc2lvbjogLyUoMjF8MjR8Mjd8Mjh8Mjl8MkF8MkJ8MkN8M0J8M0R8NDApL2lnLFxuICAgICAgICBtYXA6IHtcbiAgICAgICAgICAnJTIxJzogJyEnLFxuICAgICAgICAgICclMjQnOiAnJCcsXG4gICAgICAgICAgJyUyNyc6ICdcXCcnLFxuICAgICAgICAgICclMjgnOiAnKCcsXG4gICAgICAgICAgJyUyOSc6ICcpJyxcbiAgICAgICAgICAnJTJBJzogJyonLFxuICAgICAgICAgICclMkInOiAnKycsXG4gICAgICAgICAgJyUyQyc6ICcsJyxcbiAgICAgICAgICAnJTNCJzogJzsnLFxuICAgICAgICAgICclM0QnOiAnPScsXG4gICAgICAgICAgJyU0MCc6ICdAJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gVGhlc2UgY2hhcmFjdGVycyBhcmUgdGhlIGNoYXJhY3RlcnMgY2FsbGVkIG91dCBieSBSRkMyMTQxIGFzIFwicmVzZXJ2ZWRcIiBjaGFyYWN0ZXJzIHRoYXRcbiAgICAgIC8vIHNob3VsZCBuZXZlciBhcHBlYXIgaW4gYSBVUk4sIHBsdXMgdGhlIGNvbG9uIGNoYXJhY3RlciAoc2VlIG5vdGUgYWJvdmUpLlxuICAgICAgZGVjb2RlOiB7XG4gICAgICAgIGV4cHJlc3Npb246IC9bXFwvXFw/IzpdL2csXG4gICAgICAgIG1hcDoge1xuICAgICAgICAgICcvJzogJyUyRicsXG4gICAgICAgICAgJz8nOiAnJTNGJyxcbiAgICAgICAgICAnIyc6ICclMjMnLFxuICAgICAgICAgICc6JzogJyUzQSdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgVVJJLmVuY29kZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBVUkkuZW5jb2RlKHN0cmluZyArICcnKTtcbiAgICBpZiAoZXNjYXBlUXVlcnlTcGFjZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlc2NhcGVRdWVyeVNwYWNlID0gVVJJLmVzY2FwZVF1ZXJ5U3BhY2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVzY2FwZVF1ZXJ5U3BhY2UgPyBlc2NhcGVkLnJlcGxhY2UoLyUyMC9nLCAnKycpIDogZXNjYXBlZDtcbiAgfTtcbiAgVVJJLmRlY29kZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgc3RyaW5nICs9ICcnO1xuICAgIGlmIChlc2NhcGVRdWVyeVNwYWNlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVzY2FwZVF1ZXJ5U3BhY2UgPSBVUkkuZXNjYXBlUXVlcnlTcGFjZTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIFVSSS5kZWNvZGUoZXNjYXBlUXVlcnlTcGFjZSA/IHN0cmluZy5yZXBsYWNlKC9cXCsvZywgJyUyMCcpIDogc3RyaW5nKTtcbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIC8vIHdlJ3JlIG5vdCBnb2luZyB0byBtZXNzIHdpdGggd2VpcmQgZW5jb2RpbmdzLFxuICAgICAgLy8gZ2l2ZSB1cCBhbmQgcmV0dXJuIHRoZSB1bmRlY29kZWQgb3JpZ2luYWwgc3RyaW5nXG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzg3XG4gICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21lZGlhbGl6ZS9VUkkuanMvaXNzdWVzLzkyXG4gICAgICByZXR1cm4gc3RyaW5nO1xuICAgIH1cbiAgfTtcbiAgLy8gZ2VuZXJhdGUgZW5jb2RlL2RlY29kZSBwYXRoIGZ1bmN0aW9uc1xuICB2YXIgX3BhcnRzID0geydlbmNvZGUnOidlbmNvZGUnLCAnZGVjb2RlJzonZGVjb2RlJ307XG4gIHZhciBfcGFydDtcbiAgdmFyIGdlbmVyYXRlQWNjZXNzb3IgPSBmdW5jdGlvbihfZ3JvdXAsIF9wYXJ0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIFVSSVtfcGFydF0oc3RyaW5nICsgJycpLnJlcGxhY2UoVVJJLmNoYXJhY3RlcnNbX2dyb3VwXVtfcGFydF0uZXhwcmVzc2lvbiwgZnVuY3Rpb24oYykge1xuICAgICAgICAgIHJldHVybiBVUkkuY2hhcmFjdGVyc1tfZ3JvdXBdW19wYXJ0XS5tYXBbY107XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyB3ZSdyZSBub3QgZ29pbmcgdG8gbWVzcyB3aXRoIHdlaXJkIGVuY29kaW5ncyxcbiAgICAgICAgLy8gZ2l2ZSB1cCBhbmQgcmV0dXJuIHRoZSB1bmRlY29kZWQgb3JpZ2luYWwgc3RyaW5nXG4gICAgICAgIC8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vbWVkaWFsaXplL1VSSS5qcy9pc3N1ZXMvODdcbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL2lzc3Vlcy85MlxuICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgZm9yIChfcGFydCBpbiBfcGFydHMpIHtcbiAgICBVUklbX3BhcnQgKyAnUGF0aFNlZ21lbnQnXSA9IGdlbmVyYXRlQWNjZXNzb3IoJ3BhdGhuYW1lJywgX3BhcnRzW19wYXJ0XSk7XG4gICAgVVJJW19wYXJ0ICsgJ1VyblBhdGhTZWdtZW50J10gPSBnZW5lcmF0ZUFjY2Vzc29yKCd1cm5wYXRoJywgX3BhcnRzW19wYXJ0XSk7XG4gIH1cblxuICB2YXIgZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24gPSBmdW5jdGlvbihfc2VwLCBfY29kaW5nRnVuY05hbWUsIF9pbm5lckNvZGluZ0Z1bmNOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZykge1xuICAgICAgLy8gV2h5IHBhc3MgaW4gbmFtZXMgb2YgZnVuY3Rpb25zLCByYXRoZXIgdGhhbiB0aGUgZnVuY3Rpb24gb2JqZWN0cyB0aGVtc2VsdmVzPyBUaGVcbiAgICAgIC8vIGRlZmluaXRpb25zIG9mIHNvbWUgZnVuY3Rpb25zIChidXQgaW4gcGFydGljdWxhciwgVVJJLmRlY29kZSkgd2lsbCBvY2Nhc2lvbmFsbHkgY2hhbmdlIGR1ZVxuICAgICAgLy8gdG8gVVJJLmpzIGhhdmluZyBJU084ODU5IGFuZCBVbmljb2RlIG1vZGVzLiBQYXNzaW5nIGluIHRoZSBuYW1lIGFuZCBnZXR0aW5nIGl0IHdpbGwgZW5zdXJlXG4gICAgICAvLyB0aGF0IHRoZSBmdW5jdGlvbnMgd2UgdXNlIGhlcmUgYXJlIFwiZnJlc2hcIi5cbiAgICAgIHZhciBhY3R1YWxDb2RpbmdGdW5jO1xuICAgICAgaWYgKCFfaW5uZXJDb2RpbmdGdW5jTmFtZSkge1xuICAgICAgICBhY3R1YWxDb2RpbmdGdW5jID0gVVJJW19jb2RpbmdGdW5jTmFtZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhY3R1YWxDb2RpbmdGdW5jID0gZnVuY3Rpb24oc3RyaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIFVSSVtfY29kaW5nRnVuY05hbWVdKFVSSVtfaW5uZXJDb2RpbmdGdW5jTmFtZV0oc3RyaW5nKSk7XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHZhciBzZWdtZW50cyA9IChzdHJpbmcgKyAnJykuc3BsaXQoX3NlcCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICBzZWdtZW50c1tpXSA9IGFjdHVhbENvZGluZ0Z1bmMoc2VnbWVudHNbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VnbWVudHMuam9pbihfc2VwKTtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFRoaXMgdGFrZXMgcGxhY2Ugb3V0c2lkZSB0aGUgYWJvdmUgbG9vcCBiZWNhdXNlIHdlIGRvbid0IHdhbnQsIGUuZy4sIGVuY29kZVVyblBhdGggZnVuY3Rpb25zLlxuICBVUkkuZGVjb2RlUGF0aCA9IGdlbmVyYXRlU2VnbWVudGVkUGF0aEZ1bmN0aW9uKCcvJywgJ2RlY29kZVBhdGhTZWdtZW50Jyk7XG4gIFVSSS5kZWNvZGVVcm5QYXRoID0gZ2VuZXJhdGVTZWdtZW50ZWRQYXRoRnVuY3Rpb24oJzonLCAnZGVjb2RlVXJuUGF0aFNlZ21lbnQnKTtcbiAgVVJJLnJlY29kZVBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignLycsICdlbmNvZGVQYXRoU2VnbWVudCcsICdkZWNvZGUnKTtcbiAgVVJJLnJlY29kZVVyblBhdGggPSBnZW5lcmF0ZVNlZ21lbnRlZFBhdGhGdW5jdGlvbignOicsICdlbmNvZGVVcm5QYXRoU2VnbWVudCcsICdkZWNvZGUnKTtcblxuICBVUkkuZW5jb2RlUmVzZXJ2ZWQgPSBnZW5lcmF0ZUFjY2Vzc29yKCdyZXNlcnZlZCcsICdlbmNvZGUnKTtcblxuICBVUkkucGFyc2UgPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XG4gICAgdmFyIHBvcztcbiAgICBpZiAoIXBhcnRzKSB7XG4gICAgICBwYXJ0cyA9IHt9O1xuICAgIH1cbiAgICAvLyBbcHJvdG9jb2xcIjovL1wiW3VzZXJuYW1lW1wiOlwicGFzc3dvcmRdXCJAXCJdaG9zdG5hbWVbXCI6XCJwb3J0XVwiL1wiP11bcGF0aF1bXCI/XCJxdWVyeXN0cmluZ11bXCIjXCJmcmFnbWVudF1cblxuICAgIC8vIGV4dHJhY3QgZnJhZ21lbnRcbiAgICBwb3MgPSBzdHJpbmcuaW5kZXhPZignIycpO1xuICAgIGlmIChwb3MgPiAtMSkge1xuICAgICAgLy8gZXNjYXBpbmc/XG4gICAgICBwYXJ0cy5mcmFnbWVudCA9IHN0cmluZy5zdWJzdHJpbmcocG9zICsgMSkgfHwgbnVsbDtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICB9XG5cbiAgICAvLyBleHRyYWN0IHF1ZXJ5XG4gICAgcG9zID0gc3RyaW5nLmluZGV4T2YoJz8nKTtcbiAgICBpZiAocG9zID4gLTEpIHtcbiAgICAgIC8vIGVzY2FwaW5nP1xuICAgICAgcGFydHMucXVlcnkgPSBzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEpIHx8IG51bGw7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcyk7XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBwcm90b2NvbFxuICAgIGlmIChzdHJpbmcuc3Vic3RyaW5nKDAsIDIpID09PSAnLy8nKSB7XG4gICAgICAvLyByZWxhdGl2ZS1zY2hlbWVcbiAgICAgIHBhcnRzLnByb3RvY29sID0gbnVsbDtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zdWJzdHJpbmcoMik7XG4gICAgICAvLyBleHRyYWN0IFwidXNlcjpwYXNzQGhvc3Q6cG9ydFwiXG4gICAgICBzdHJpbmcgPSBVUkkucGFyc2VBdXRob3JpdHkoc3RyaW5nLCBwYXJ0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvcyA9IHN0cmluZy5pbmRleE9mKCc6Jyk7XG4gICAgICBpZiAocG9zID4gLTEpIHtcbiAgICAgICAgcGFydHMucHJvdG9jb2wgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykgfHwgbnVsbDtcbiAgICAgICAgaWYgKHBhcnRzLnByb3RvY29sICYmICFwYXJ0cy5wcm90b2NvbC5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICAvLyA6IG1heSBiZSB3aXRoaW4gdGhlIHBhdGhcbiAgICAgICAgICBwYXJ0cy5wcm90b2NvbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfSBlbHNlIGlmIChzdHJpbmcuc3Vic3RyaW5nKHBvcyArIDEsIHBvcyArIDMpID09PSAnLy8nKSB7XG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAzKTtcblxuICAgICAgICAgIC8vIGV4dHJhY3QgXCJ1c2VyOnBhc3NAaG9zdDpwb3J0XCJcbiAgICAgICAgICBzdHJpbmcgPSBVUkkucGFyc2VBdXRob3JpdHkoc3RyaW5nLCBwYXJ0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcbiAgICAgICAgICBwYXJ0cy51cm4gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gd2hhdCdzIGxlZnQgbXVzdCBiZSB0aGUgcGF0aFxuICAgIHBhcnRzLnBhdGggPSBzdHJpbmc7XG5cbiAgICAvLyBhbmQgd2UncmUgZG9uZVxuICAgIHJldHVybiBwYXJ0cztcbiAgfTtcbiAgVVJJLnBhcnNlSG9zdCA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICAvLyBDb3B5IGNocm9tZSwgSUUsIG9wZXJhIGJhY2tzbGFzaC1oYW5kbGluZyBiZWhhdmlvci5cbiAgICAvLyBCYWNrIHNsYXNoZXMgYmVmb3JlIHRoZSBxdWVyeSBzdHJpbmcgZ2V0IGNvbnZlcnRlZCB0byBmb3J3YXJkIHNsYXNoZXNcbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9qb3llbnQvbm9kZS9ibG9iLzM4NmZkMjRmNDliMGU5ZDFhOGEwNzY1OTJhNDA0MTY4ZmFlZWNjMzQvbGliL3VybC5qcyNMMTE1LUwxMjRcbiAgICAvLyBTZWU6IGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0yNTkxNlxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpYWxpemUvVVJJLmpzL3B1bGwvMjMzXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgIC8vIGV4dHJhY3QgaG9zdDpwb3J0XG4gICAgdmFyIHBvcyA9IHN0cmluZy5pbmRleE9mKCcvJyk7XG4gICAgdmFyIGJyYWNrZXRQb3M7XG4gICAgdmFyIHQ7XG5cbiAgICBpZiAocG9zID09PSAtMSkge1xuICAgICAgcG9zID0gc3RyaW5nLmxlbmd0aDtcbiAgICB9XG5cbiAgICBpZiAoc3RyaW5nLmNoYXJBdCgwKSA9PT0gJ1snKSB7XG4gICAgICAvLyBJUHY2IGhvc3QgLSBodHRwOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9kcmFmdC1pZXRmLTZtYW4tdGV4dC1hZGRyLXJlcHJlc2VudGF0aW9uLTA0I3NlY3Rpb24tNlxuICAgICAgLy8gSSBjbGFpbSBtb3N0IGNsaWVudCBzb2Z0d2FyZSBicmVha3Mgb24gSVB2NiBhbnl3YXlzLiBUbyBzaW1wbGlmeSB0aGluZ3MsIFVSSSBvbmx5IGFjY2VwdHNcbiAgICAgIC8vIElQdjYrcG9ydCBpbiB0aGUgZm9ybWF0IFsyMDAxOmRiODo6MV06ODAgKGZvciB0aGUgdGltZSBiZWluZylcbiAgICAgIGJyYWNrZXRQb3MgPSBzdHJpbmcuaW5kZXhPZignXScpO1xuICAgICAgcGFydHMuaG9zdG5hbWUgPSBzdHJpbmcuc3Vic3RyaW5nKDEsIGJyYWNrZXRQb3MpIHx8IG51bGw7XG4gICAgICBwYXJ0cy5wb3J0ID0gc3RyaW5nLnN1YnN0cmluZyhicmFja2V0UG9zICsgMiwgcG9zKSB8fCBudWxsO1xuICAgICAgaWYgKHBhcnRzLnBvcnQgPT09ICcvJykge1xuICAgICAgICBwYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZpcnN0Q29sb24gPSBzdHJpbmcuaW5kZXhPZignOicpO1xuICAgICAgdmFyIGZpcnN0U2xhc2ggPSBzdHJpbmcuaW5kZXhPZignLycpO1xuICAgICAgdmFyIG5leHRDb2xvbiA9IHN0cmluZy5pbmRleE9mKCc6JywgZmlyc3RDb2xvbiArIDEpO1xuICAgICAgaWYgKG5leHRDb2xvbiAhPT0gLTEgJiYgKGZpcnN0U2xhc2ggPT09IC0xIHx8IG5leHRDb2xvbiA8IGZpcnN0U2xhc2gpKSB7XG4gICAgICAgIC8vIElQdjYgaG9zdCBjb250YWlucyBtdWx0aXBsZSBjb2xvbnMgLSBidXQgbm8gcG9ydFxuICAgICAgICAvLyB0aGlzIG5vdGF0aW9uIGlzIGFjdHVhbGx5IG5vdCBhbGxvd2VkIGJ5IFJGQyAzOTg2LCBidXQgd2UncmUgYSBsaWJlcmFsIHBhcnNlclxuICAgICAgICBwYXJ0cy5ob3N0bmFtZSA9IHN0cmluZy5zdWJzdHJpbmcoMCwgcG9zKSB8fCBudWxsO1xuICAgICAgICBwYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykuc3BsaXQoJzonKTtcbiAgICAgICAgcGFydHMuaG9zdG5hbWUgPSB0WzBdIHx8IG51bGw7XG4gICAgICAgIHBhcnRzLnBvcnQgPSB0WzFdIHx8IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcnRzLmhvc3RuYW1lICYmIHN0cmluZy5zdWJzdHJpbmcocG9zKS5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgcG9zKys7XG4gICAgICBzdHJpbmcgPSAnLycgKyBzdHJpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdHJpbmcocG9zKSB8fCAnLyc7XG4gIH07XG4gIFVSSS5wYXJzZUF1dGhvcml0eSA9IGZ1bmN0aW9uKHN0cmluZywgcGFydHMpIHtcbiAgICBzdHJpbmcgPSBVUkkucGFyc2VVc2VyaW5mbyhzdHJpbmcsIHBhcnRzKTtcbiAgICByZXR1cm4gVVJJLnBhcnNlSG9zdChzdHJpbmcsIHBhcnRzKTtcbiAgfTtcbiAgVVJJLnBhcnNlVXNlcmluZm8gPSBmdW5jdGlvbihzdHJpbmcsIHBhcnRzKSB7XG4gICAgLy8gZXh0cmFjdCB1c2VybmFtZTpwYXNzd29yZFxuICAgIHZhciBmaXJzdFNsYXNoID0gc3RyaW5nLmluZGV4T2YoJy8nKTtcbiAgICB2YXIgcG9zID0gc3RyaW5nLmxhc3RJbmRleE9mKCdAJywgZmlyc3RTbGFzaCA+IC0xID8gZmlyc3RTbGFzaCA6IHN0cmluZy5sZW5ndGggLSAxKTtcbiAgICB2YXIgdDtcblxuICAgIC8vIGF1dGhvcml0eUAgbXVzdCBjb21lIGJlZm9yZSAvcGF0aFxuICAgIGlmIChwb3MgPiAtMSAmJiAoZmlyc3RTbGFzaCA9PT0gLTEgfHwgcG9zIDwgZmlyc3RTbGFzaCkpIHtcbiAgICAgIHQgPSBzdHJpbmcuc3Vic3RyaW5nKDAsIHBvcykuc3BsaXQoJzonKTtcbiAgICAgIHBhcnRzLnVzZXJuYW1lID0gdFswXSA/IFVSSS5kZWNvZGUodFswXSkgOiBudWxsO1xuICAgICAgdC5zaGlmdCgpO1xuICAgICAgcGFydHMucGFzc3dvcmQgPSB0WzBdID8gVVJJLmRlY29kZSh0LmpvaW4oJzonKSkgOiBudWxsO1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnN1YnN0cmluZyhwb3MgKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMudXNlcm5hbWUgPSBudWxsO1xuICAgICAgcGFydHMucGFzc3dvcmQgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJpbmc7XG4gIH07XG4gIFVSSS5wYXJzZVF1ZXJ5ID0gZnVuY3Rpb24oc3RyaW5nLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgaWYgKCFzdHJpbmcpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICAvLyB0aHJvdyBvdXQgdGhlIGZ1bmt5IGJ1c2luZXNzIC0gXCI/XCJbbmFtZVwiPVwidmFsdWVcIiZcIl0rXG4gICAgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UoLyYrL2csICcmJykucmVwbGFjZSgvXlxcPyomKnwmKyQvZywgJycpO1xuXG4gICAgaWYgKCFzdHJpbmcpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbXMgPSB7fTtcbiAgICB2YXIgc3BsaXRzID0gc3RyaW5nLnNwbGl0KCcmJyk7XG4gICAgdmFyIGxlbmd0aCA9IHNwbGl0cy5sZW5ndGg7XG4gICAgdmFyIHYsIG5hbWUsIHZhbHVlO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgdiA9IHNwbGl0c1tpXS5zcGxpdCgnPScpO1xuICAgICAgbmFtZSA9IFVSSS5kZWNvZGVRdWVyeSh2LnNoaWZ0KCksIGVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgLy8gbm8gXCI9XCIgaXMgbnVsbCBhY2NvcmRpbmcgdG8gaHR0cDovL2R2Y3MudzMub3JnL2hnL3VybC9yYXctZmlsZS90aXAvT3ZlcnZpZXcuaHRtbCNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG4gICAgICB2YWx1ZSA9IHYubGVuZ3RoID8gVVJJLmRlY29kZVF1ZXJ5KHYuam9pbignPScpLCBlc2NhcGVRdWVyeVNwYWNlKSA6IG51bGw7XG5cbiAgICAgIGlmIChoYXNPd24uY2FsbChpdGVtcywgbmFtZSkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtc1tuYW1lXSA9PT0gJ3N0cmluZycgfHwgaXRlbXNbbmFtZV0gPT09IG51bGwpIHtcbiAgICAgICAgICBpdGVtc1tuYW1lXSA9IFtpdGVtc1tuYW1lXV07XG4gICAgICAgIH1cblxuICAgICAgICBpdGVtc1tuYW1lXS5wdXNoKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0ZW1zW25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZW1zO1xuICB9O1xuXG4gIFVSSS5idWlsZCA9IGZ1bmN0aW9uKHBhcnRzKSB7XG4gICAgdmFyIHQgPSAnJztcblxuICAgIGlmIChwYXJ0cy5wcm90b2NvbCkge1xuICAgICAgdCArPSBwYXJ0cy5wcm90b2NvbCArICc6JztcbiAgICB9XG5cbiAgICBpZiAoIXBhcnRzLnVybiAmJiAodCB8fCBwYXJ0cy5ob3N0bmFtZSkpIHtcbiAgICAgIHQgKz0gJy8vJztcbiAgICB9XG5cbiAgICB0ICs9IChVUkkuYnVpbGRBdXRob3JpdHkocGFydHMpIHx8ICcnKTtcblxuICAgIGlmICh0eXBlb2YgcGFydHMucGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChwYXJ0cy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nICYmIHR5cGVvZiBwYXJ0cy5ob3N0bmFtZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdCArPSAnLyc7XG4gICAgICB9XG5cbiAgICAgIHQgKz0gcGFydHMucGF0aDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcnRzLnF1ZXJ5ID09PSAnc3RyaW5nJyAmJiBwYXJ0cy5xdWVyeSkge1xuICAgICAgdCArPSAnPycgKyBwYXJ0cy5xdWVyeTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHBhcnRzLmZyYWdtZW50ID09PSAnc3RyaW5nJyAmJiBwYXJ0cy5mcmFnbWVudCkge1xuICAgICAgdCArPSAnIycgKyBwYXJ0cy5mcmFnbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIFVSSS5idWlsZEhvc3QgPSBmdW5jdGlvbihwYXJ0cykge1xuICAgIHZhciB0ID0gJyc7XG5cbiAgICBpZiAoIXBhcnRzLmhvc3RuYW1lKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmIChVUkkuaXA2X2V4cHJlc3Npb24udGVzdChwYXJ0cy5ob3N0bmFtZSkpIHtcbiAgICAgIHQgKz0gJ1snICsgcGFydHMuaG9zdG5hbWUgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHQgKz0gcGFydHMuaG9zdG5hbWU7XG4gICAgfVxuXG4gICAgaWYgKHBhcnRzLnBvcnQpIHtcbiAgICAgIHQgKz0gJzonICsgcGFydHMucG9ydDtcbiAgICB9XG5cbiAgICByZXR1cm4gdDtcbiAgfTtcbiAgVVJJLmJ1aWxkQXV0aG9yaXR5ID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICByZXR1cm4gVVJJLmJ1aWxkVXNlcmluZm8ocGFydHMpICsgVVJJLmJ1aWxkSG9zdChwYXJ0cyk7XG4gIH07XG4gIFVSSS5idWlsZFVzZXJpbmZvID0gZnVuY3Rpb24ocGFydHMpIHtcbiAgICB2YXIgdCA9ICcnO1xuXG4gICAgaWYgKHBhcnRzLnVzZXJuYW1lKSB7XG4gICAgICB0ICs9IFVSSS5lbmNvZGUocGFydHMudXNlcm5hbWUpO1xuXG4gICAgICBpZiAocGFydHMucGFzc3dvcmQpIHtcbiAgICAgICAgdCArPSAnOicgKyBVUkkuZW5jb2RlKHBhcnRzLnBhc3N3b3JkKTtcbiAgICAgIH1cblxuICAgICAgdCArPSAnQCc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHQ7XG4gIH07XG4gIFVSSS5idWlsZFF1ZXJ5ID0gZnVuY3Rpb24oZGF0YSwgZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCBlc2NhcGVRdWVyeVNwYWNlKSB7XG4gICAgLy8gYWNjb3JkaW5nIHRvIGh0dHA6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzM5ODYgb3IgaHR0cDovL2xhYnMuYXBhY2hlLm9yZy93ZWJhcmNoL3VyaS9yZmMvcmZjMzk4Ni5odG1sXG4gICAgLy8gYmVpbmcgwrstLl9+ISQmJygpKissOz06QC8/wqsgJUhFWCBhbmQgYWxudW0gYXJlIGFsbG93ZWRcbiAgICAvLyB0aGUgUkZDIGV4cGxpY2l0bHkgc3RhdGVzID8vZm9vIGJlaW5nIGEgdmFsaWQgdXNlIGNhc2UsIG5vIG1lbnRpb24gb2YgcGFyYW1ldGVyIHN5bnRheCFcbiAgICAvLyBVUkkuanMgdHJlYXRzIHRoZSBxdWVyeSBzdHJpbmcgYXMgYmVpbmcgYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgLy8gc2VlIGh0dHA6Ly93d3cudzMub3JnL1RSL1JFQy1odG1sNDAvaW50ZXJhY3QvZm9ybXMuaHRtbCNmb3JtLWNvbnRlbnQtdHlwZVxuXG4gICAgdmFyIHQgPSAnJztcbiAgICB2YXIgdW5pcXVlLCBrZXksIGksIGxlbmd0aDtcbiAgICBmb3IgKGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAoaGFzT3duLmNhbGwoZGF0YSwga2V5KSAmJiBrZXkpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkoZGF0YVtrZXldKSkge1xuICAgICAgICAgIHVuaXF1ZSA9IHt9O1xuICAgICAgICAgIGZvciAoaSA9IDAsIGxlbmd0aCA9IGRhdGFba2V5XS5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGRhdGFba2V5XVtpXSAhPT0gdW5kZWZpbmVkICYmIHVuaXF1ZVtkYXRhW2tleV1baV0gKyAnJ10gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICB0ICs9ICcmJyArIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyKGtleSwgZGF0YVtrZXldW2ldLCBlc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgICAgICAgICAgaWYgKGR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHVuaXF1ZVtkYXRhW2tleV1baV0gKyAnJ10gPSB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGRhdGFba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdCArPSAnJicgKyBVUkkuYnVpbGRRdWVyeVBhcmFtZXRlcihrZXksIGRhdGFba2V5XSwgZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdC5zdWJzdHJpbmcoMSk7XG4gIH07XG4gIFVSSS5idWlsZFF1ZXJ5UGFyYW1ldGVyID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGVzY2FwZVF1ZXJ5U3BhY2UpIHtcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9SRUMtaHRtbDQwL2ludGVyYWN0L2Zvcm1zLmh0bWwjZm9ybS1jb250ZW50LXR5cGUgLS0gYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXG4gICAgLy8gZG9uJ3QgYXBwZW5kIFwiPVwiIGZvciBudWxsIHZhbHVlcywgYWNjb3JkaW5nIHRvIGh0dHA6Ly9kdmNzLnczLm9yZy9oZy91cmwvcmF3LWZpbGUvdGlwL092ZXJ2aWV3Lmh0bWwjdXJsLXBhcmFtZXRlci1zZXJpYWxpemF0aW9uXG4gICAgcmV0dXJuIFVSSS5lbmNvZGVRdWVyeShuYW1lLCBlc2NhcGVRdWVyeVNwYWNlKSArICh2YWx1ZSAhPT0gbnVsbCA/ICc9JyArIFVSSS5lbmNvZGVRdWVyeSh2YWx1ZSwgZXNjYXBlUXVlcnlTcGFjZSkgOiAnJyk7XG4gIH07XG5cbiAgVVJJLmFkZFF1ZXJ5ID0gZnVuY3Rpb24oZGF0YSwgbmFtZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIFVSSS5hZGRRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKGRhdGFbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkYXRhW25hbWVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGFbbmFtZV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSBbZGF0YVtuYW1lXV07XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdmFsdWUgPSBbdmFsdWVdO1xuICAgICAgfVxuXG4gICAgICBkYXRhW25hbWVdID0gKGRhdGFbbmFtZV0gfHwgW10pLmNvbmNhdCh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5hZGRRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcgYXMgdGhlIG5hbWUgcGFyYW1ldGVyJyk7XG4gICAgfVxuICB9O1xuICBVUkkucmVtb3ZlUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBpLCBsZW5ndGgsIGtleTtcblxuICAgIGlmIChpc0FycmF5KG5hbWUpKSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW5ndGggPSBuYW1lLmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGRhdGFbbmFtZVtpXV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChnZXRUeXBlKG5hbWUpID09PSAnUmVnRXhwJykge1xuICAgICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgICBpZiAobmFtZS50ZXN0KGtleSkpIHtcbiAgICAgICAgICBkYXRhW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIFVSSS5yZW1vdmVRdWVyeShkYXRhLCBrZXksIG5hbWVba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGdldFR5cGUodmFsdWUpID09PSAnUmVnRXhwJykge1xuICAgICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSAmJiB2YWx1ZS50ZXN0KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgICBkYXRhW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhW25hbWVdID0gZmlsdGVyQXJyYXlWYWx1ZXMoZGF0YVtuYW1lXSwgdmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChkYXRhW25hbWVdID09PSBTdHJpbmcodmFsdWUpICYmICghaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoID09PSAxKSkge1xuICAgICAgICAgIGRhdGFbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIGRhdGFbbmFtZV0gPSBmaWx0ZXJBcnJheVZhbHVlcyhkYXRhW25hbWVdLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRhdGFbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5yZW1vdmVRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcsIFJlZ0V4cCBhcyB0aGUgZmlyc3QgcGFyYW1ldGVyJyk7XG4gICAgfVxuICB9O1xuICBVUkkuaGFzUXVlcnkgPSBmdW5jdGlvbihkYXRhLCBuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gbmFtZSkge1xuICAgICAgICBpZiAoaGFzT3duLmNhbGwobmFtZSwga2V5KSkge1xuICAgICAgICAgIGlmICghVVJJLmhhc1F1ZXJ5KGRhdGEsIGtleSwgbmFtZVtrZXldKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyBhbiBvYmplY3QsIHN0cmluZyBhcyB0aGUgbmFtZSBwYXJhbWV0ZXInKTtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGdldFR5cGUodmFsdWUpKSB7XG4gICAgICBjYXNlICdVbmRlZmluZWQnOlxuICAgICAgICAvLyB0cnVlIGlmIGV4aXN0cyAoYnV0IG1heSBiZSBlbXB0eSlcbiAgICAgICAgcmV0dXJuIG5hbWUgaW4gZGF0YTsgLy8gZGF0YVtuYW1lXSAhPT0gdW5kZWZpbmVkO1xuXG4gICAgICBjYXNlICdCb29sZWFuJzpcbiAgICAgICAgLy8gdHJ1ZSBpZiBleGlzdHMgYW5kIG5vbi1lbXB0eVxuICAgICAgICB2YXIgX2Jvb2x5ID0gQm9vbGVhbihpc0FycmF5KGRhdGFbbmFtZV0pID8gZGF0YVtuYW1lXS5sZW5ndGggOiBkYXRhW25hbWVdKTtcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSBfYm9vbHk7XG5cbiAgICAgIGNhc2UgJ0Z1bmN0aW9uJzpcbiAgICAgICAgLy8gYWxsb3cgY29tcGxleCBjb21wYXJpc29uXG4gICAgICAgIHJldHVybiAhIXZhbHVlKGRhdGFbbmFtZV0sIG5hbWUsIGRhdGEpO1xuXG4gICAgICBjYXNlICdBcnJheSc6XG4gICAgICAgIGlmICghaXNBcnJheShkYXRhW25hbWVdKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcCA9IHdpdGhpbkFycmF5ID8gYXJyYXlDb250YWlucyA6IGFycmF5c0VxdWFsO1xuICAgICAgICByZXR1cm4gb3AoZGF0YVtuYW1lXSwgdmFsdWUpO1xuXG4gICAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgICBpZiAoIWlzQXJyYXkoZGF0YVtuYW1lXSkpIHtcbiAgICAgICAgICByZXR1cm4gQm9vbGVhbihkYXRhW25hbWVdICYmIGRhdGFbbmFtZV0ubWF0Y2godmFsdWUpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghd2l0aGluQXJyYXkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXJyYXlDb250YWlucyhkYXRhW25hbWVdLCB2YWx1ZSk7XG5cbiAgICAgIGNhc2UgJ051bWJlcic6XG4gICAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgICAgaWYgKCFpc0FycmF5KGRhdGFbbmFtZV0pKSB7XG4gICAgICAgICAgcmV0dXJuIGRhdGFbbmFtZV0gPT09IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF3aXRoaW5BcnJheSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnJheUNvbnRhaW5zKGRhdGFbbmFtZV0sIHZhbHVlKTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVVJJLmhhc1F1ZXJ5KCkgYWNjZXB0cyB1bmRlZmluZWQsIGJvb2xlYW4sIHN0cmluZywgbnVtYmVyLCBSZWdFeHAsIEZ1bmN0aW9uIGFzIHRoZSB2YWx1ZSBwYXJhbWV0ZXInKTtcbiAgICB9XG4gIH07XG5cblxuICBVUkkuY29tbW9uUGF0aCA9IGZ1bmN0aW9uKG9uZSwgdHdvKSB7XG4gICAgdmFyIGxlbmd0aCA9IE1hdGgubWluKG9uZS5sZW5ndGgsIHR3by5sZW5ndGgpO1xuICAgIHZhciBwb3M7XG5cbiAgICAvLyBmaW5kIGZpcnN0IG5vbi1tYXRjaGluZyBjaGFyYWN0ZXJcbiAgICBmb3IgKHBvcyA9IDA7IHBvcyA8IGxlbmd0aDsgcG9zKyspIHtcbiAgICAgIGlmIChvbmUuY2hhckF0KHBvcykgIT09IHR3by5jaGFyQXQocG9zKSkge1xuICAgICAgICBwb3MtLTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvcyA8IDEpIHtcbiAgICAgIHJldHVybiBvbmUuY2hhckF0KDApID09PSB0d28uY2hhckF0KDApICYmIG9uZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIH1cblxuICAgIC8vIHJldmVydCB0byBsYXN0IC9cbiAgICBpZiAob25lLmNoYXJBdChwb3MpICE9PSAnLycgfHwgdHdvLmNoYXJBdChwb3MpICE9PSAnLycpIHtcbiAgICAgIHBvcyA9IG9uZS5zdWJzdHJpbmcoMCwgcG9zKS5sYXN0SW5kZXhPZignLycpO1xuICAgIH1cblxuICAgIHJldHVybiBvbmUuc3Vic3RyaW5nKDAsIHBvcyArIDEpO1xuICB9O1xuXG4gIFVSSS53aXRoaW5TdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyB8fCAob3B0aW9ucyA9IHt9KTtcbiAgICB2YXIgX3N0YXJ0ID0gb3B0aW9ucy5zdGFydCB8fCBVUkkuZmluZFVyaS5zdGFydDtcbiAgICB2YXIgX2VuZCA9IG9wdGlvbnMuZW5kIHx8IFVSSS5maW5kVXJpLmVuZDtcbiAgICB2YXIgX3RyaW0gPSBvcHRpb25zLnRyaW0gfHwgVVJJLmZpbmRVcmkudHJpbTtcbiAgICB2YXIgX2F0dHJpYnV0ZU9wZW4gPSAvW2EtejAtOS1dPVtcIiddPyQvaTtcblxuICAgIF9zdGFydC5sYXN0SW5kZXggPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgbWF0Y2ggPSBfc3RhcnQuZXhlYyhzdHJpbmcpO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXJ0ID0gbWF0Y2guaW5kZXg7XG4gICAgICBpZiAob3B0aW9ucy5pZ25vcmVIdG1sKSB7XG4gICAgICAgIC8vIGF0dHJpYnV0KGU9W1wiJ10/JClcbiAgICAgICAgdmFyIGF0dHJpYnV0ZU9wZW4gPSBzdHJpbmcuc2xpY2UoTWF0aC5tYXgoc3RhcnQgLSAzLCAwKSwgc3RhcnQpO1xuICAgICAgICBpZiAoYXR0cmlidXRlT3BlbiAmJiBfYXR0cmlidXRlT3Blbi50ZXN0KGF0dHJpYnV0ZU9wZW4pKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIGVuZCA9IHN0YXJ0ICsgc3RyaW5nLnNsaWNlKHN0YXJ0KS5zZWFyY2goX2VuZCk7XG4gICAgICB2YXIgc2xpY2UgPSBzdHJpbmcuc2xpY2Uoc3RhcnQsIGVuZCkucmVwbGFjZShfdHJpbSwgJycpO1xuICAgICAgaWYgKG9wdGlvbnMuaWdub3JlICYmIG9wdGlvbnMuaWdub3JlLnRlc3Qoc2xpY2UpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBlbmQgPSBzdGFydCArIHNsaWNlLmxlbmd0aDtcbiAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjayhzbGljZSwgc3RhcnQsIGVuZCwgc3RyaW5nKTtcbiAgICAgIHN0cmluZyA9IHN0cmluZy5zbGljZSgwLCBzdGFydCkgKyByZXN1bHQgKyBzdHJpbmcuc2xpY2UoZW5kKTtcbiAgICAgIF9zdGFydC5sYXN0SW5kZXggPSBzdGFydCArIHJlc3VsdC5sZW5ndGg7XG4gICAgfVxuXG4gICAgX3N0YXJ0Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcblxuICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSA9IGZ1bmN0aW9uKHYpIHtcbiAgICAvLyBUaGVvcmV0aWNhbGx5IFVSSXMgYWxsb3cgcGVyY2VudC1lbmNvZGluZyBpbiBIb3N0bmFtZXMgKGFjY29yZGluZyB0byBSRkMgMzk4NilcbiAgICAvLyB0aGV5IGFyZSBub3QgcGFydCBvZiBETlMgYW5kIHRoZXJlZm9yZSBpZ25vcmVkIGJ5IFVSSS5qc1xuXG4gICAgaWYgKHYubWF0Y2goVVJJLmludmFsaWRfaG9zdG5hbWVfY2hhcmFjdGVycykpIHtcbiAgICAgIC8vIHRlc3QgcHVueWNvZGVcbiAgICAgIGlmICghcHVueWNvZGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXSBhbmQgUHVueWNvZGUuanMgaXMgbm90IGF2YWlsYWJsZScpO1xuICAgICAgfVxuXG4gICAgICBpZiAocHVueWNvZGUudG9BU0NJSSh2KS5tYXRjaChVUkkuaW52YWxpZF9ob3N0bmFtZV9jaGFyYWN0ZXJzKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdIb3N0bmFtZSBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05Li1dJyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIG5vQ29uZmxpY3RcbiAgVVJJLm5vQ29uZmxpY3QgPSBmdW5jdGlvbihyZW1vdmVBbGwpIHtcbiAgICBpZiAocmVtb3ZlQWxsKSB7XG4gICAgICB2YXIgdW5jb25mbGljdGVkID0ge1xuICAgICAgICBVUkk6IHRoaXMubm9Db25mbGljdCgpXG4gICAgICB9O1xuXG4gICAgICBpZiAocm9vdC5VUklUZW1wbGF0ZSAmJiB0eXBlb2Ygcm9vdC5VUklUZW1wbGF0ZS5ub0NvbmZsaWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHVuY29uZmxpY3RlZC5VUklUZW1wbGF0ZSA9IHJvb3QuVVJJVGVtcGxhdGUubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocm9vdC5JUHY2ICYmIHR5cGVvZiByb290LklQdjYubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuSVB2NiA9IHJvb3QuSVB2Ni5ub0NvbmZsaWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb290LlNlY29uZExldmVsRG9tYWlucyAmJiB0eXBlb2Ygcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB1bmNvbmZsaWN0ZWQuU2Vjb25kTGV2ZWxEb21haW5zID0gcm9vdC5TZWNvbmRMZXZlbERvbWFpbnMubm9Db25mbGljdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5jb25mbGljdGVkO1xuICAgIH0gZWxzZSBpZiAocm9vdC5VUkkgPT09IHRoaXMpIHtcbiAgICAgIHJvb3QuVVJJID0gX1VSSTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLmJ1aWxkID0gZnVuY3Rpb24oZGVmZXJCdWlsZCkge1xuICAgIGlmIChkZWZlckJ1aWxkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChkZWZlckJ1aWxkID09PSB1bmRlZmluZWQgfHwgdGhpcy5fZGVmZXJyZWRfYnVpbGQpIHtcbiAgICAgIHRoaXMuX3N0cmluZyA9IFVSSS5idWlsZCh0aGlzLl9wYXJ0cyk7XG4gICAgICB0aGlzLl9kZWZlcnJlZF9idWlsZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFVSSSh0aGlzKTtcbiAgfTtcblxuICBwLnZhbHVlT2YgPSBwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGQoZmFsc2UpLl9zdHJpbmc7XG4gIH07XG5cblxuICBmdW5jdGlvbiBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKF9wYXJ0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzW19wYXJ0XSB8fCAnJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3BhcnRzW19wYXJ0XSA9IHYgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVQcmVmaXhBY2Nlc3NvcihfcGFydCwgX2tleSl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0c1tfcGFydF0gfHwgJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodiAhPT0gbnVsbCkge1xuICAgICAgICAgIHYgPSB2ICsgJyc7XG4gICAgICAgICAgaWYgKHYuY2hhckF0KDApID09PSBfa2V5KSB7XG4gICAgICAgICAgICB2ID0gdi5zdWJzdHJpbmcoMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fcGFydHNbX3BhcnRdID0gdjtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcC5wcm90b2NvbCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3Byb3RvY29sJyk7XG4gIHAudXNlcm5hbWUgPSBnZW5lcmF0ZVNpbXBsZUFjY2Vzc29yKCd1c2VybmFtZScpO1xuICBwLnBhc3N3b3JkID0gZ2VuZXJhdGVTaW1wbGVBY2Nlc3NvcigncGFzc3dvcmQnKTtcbiAgcC5ob3N0bmFtZSA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ2hvc3RuYW1lJyk7XG4gIHAucG9ydCA9IGdlbmVyYXRlU2ltcGxlQWNjZXNzb3IoJ3BvcnQnKTtcbiAgcC5xdWVyeSA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ3F1ZXJ5JywgJz8nKTtcbiAgcC5mcmFnbWVudCA9IGdlbmVyYXRlUHJlZml4QWNjZXNzb3IoJ2ZyYWdtZW50JywgJyMnKTtcblxuICBwLnNlYXJjaCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgdmFyIHQgPSB0aGlzLnF1ZXJ5KHYsIGJ1aWxkKTtcbiAgICByZXR1cm4gdHlwZW9mIHQgPT09ICdzdHJpbmcnICYmIHQubGVuZ3RoID8gKCc/JyArIHQpIDogdDtcbiAgfTtcbiAgcC5oYXNoID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgdCA9IHRoaXMuZnJhZ21lbnQodiwgYnVpbGQpO1xuICAgIHJldHVybiB0eXBlb2YgdCA9PT0gJ3N0cmluZycgJiYgdC5sZW5ndGggPyAoJyMnICsgdCkgOiB0O1xuICB9O1xuXG4gIHAucGF0aG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGggfHwgKHRoaXMuX3BhcnRzLmhvc3RuYW1lID8gJy8nIDogJycpO1xuICAgICAgcmV0dXJuIHYgPyAodGhpcy5fcGFydHMudXJuID8gVVJJLmRlY29kZVVyblBhdGggOiBVUkkuZGVjb2RlUGF0aCkocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVVcm5QYXRoKHYpIDogJyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdiA/IFVSSS5yZWNvZGVQYXRoKHYpIDogJy8nO1xuICAgICAgfVxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnBhdGggPSBwLnBhdGhuYW1lO1xuICBwLmhyZWYgPSBmdW5jdGlvbihocmVmLCBidWlsZCkge1xuICAgIHZhciBrZXk7XG5cbiAgICBpZiAoaHJlZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMuX3N0cmluZyA9ICcnO1xuICAgIHRoaXMuX3BhcnRzID0gVVJJLl9wYXJ0cygpO1xuXG4gICAgdmFyIF9VUkkgPSBocmVmIGluc3RhbmNlb2YgVVJJO1xuICAgIHZhciBfb2JqZWN0ID0gdHlwZW9mIGhyZWYgPT09ICdvYmplY3QnICYmIChocmVmLmhvc3RuYW1lIHx8IGhyZWYucGF0aCB8fCBocmVmLnBhdGhuYW1lKTtcbiAgICBpZiAoaHJlZi5ub2RlTmFtZSkge1xuICAgICAgdmFyIGF0dHJpYnV0ZSA9IFVSSS5nZXREb21BdHRyaWJ1dGUoaHJlZik7XG4gICAgICBocmVmID0gaHJlZlthdHRyaWJ1dGVdIHx8ICcnO1xuICAgICAgX29iamVjdCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIHdpbmRvdy5sb2NhdGlvbiBpcyByZXBvcnRlZCB0byBiZSBhbiBvYmplY3QsIGJ1dCBpdCdzIG5vdCB0aGUgc29ydFxuICAgIC8vIG9mIG9iamVjdCB3ZSdyZSBsb29raW5nIGZvcjpcbiAgICAvLyAqIGxvY2F0aW9uLnByb3RvY29sIGVuZHMgd2l0aCBhIGNvbG9uXG4gICAgLy8gKiBsb2NhdGlvbi5xdWVyeSAhPSBvYmplY3Quc2VhcmNoXG4gICAgLy8gKiBsb2NhdGlvbi5oYXNoICE9IG9iamVjdC5mcmFnbWVudFxuICAgIC8vIHNpbXBseSBzZXJpYWxpemluZyB0aGUgdW5rbm93biBvYmplY3Qgc2hvdWxkIGRvIHRoZSB0cmlja1xuICAgIC8vIChmb3IgbG9jYXRpb24sIG5vdCBmb3IgZXZlcnl0aGluZy4uLilcbiAgICBpZiAoIV9VUkkgJiYgX29iamVjdCAmJiBocmVmLnBhdGhuYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGhyZWYgPSBocmVmLnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBocmVmID09PSAnc3RyaW5nJyB8fCBocmVmIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICB0aGlzLl9wYXJ0cyA9IFVSSS5wYXJzZShTdHJpbmcoaHJlZiksIHRoaXMuX3BhcnRzKTtcbiAgICB9IGVsc2UgaWYgKF9VUkkgfHwgX29iamVjdCkge1xuICAgICAgdmFyIHNyYyA9IF9VUkkgPyBocmVmLl9wYXJ0cyA6IGhyZWY7XG4gICAgICBmb3IgKGtleSBpbiBzcmMpIHtcbiAgICAgICAgaWYgKGhhc093bi5jYWxsKHRoaXMuX3BhcnRzLCBrZXkpKSB7XG4gICAgICAgICAgdGhpcy5fcGFydHNba2V5XSA9IHNyY1trZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ludmFsaWQgaW5wdXQnKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gaWRlbnRpZmljYXRpb24gYWNjZXNzb3JzXG4gIHAuaXMgPSBmdW5jdGlvbih3aGF0KSB7XG4gICAgdmFyIGlwID0gZmFsc2U7XG4gICAgdmFyIGlwNCA9IGZhbHNlO1xuICAgIHZhciBpcDYgPSBmYWxzZTtcbiAgICB2YXIgbmFtZSA9IGZhbHNlO1xuICAgIHZhciBzbGQgPSBmYWxzZTtcbiAgICB2YXIgaWRuID0gZmFsc2U7XG4gICAgdmFyIHB1bnljb2RlID0gZmFsc2U7XG4gICAgdmFyIHJlbGF0aXZlID0gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgcmVsYXRpdmUgPSBmYWxzZTtcbiAgICAgIGlwNCA9IFVSSS5pcDRfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwNiA9IFVSSS5pcDZfZXhwcmVzc2lvbi50ZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlwID0gaXA0IHx8IGlwNjtcbiAgICAgIG5hbWUgPSAhaXA7XG4gICAgICBzbGQgPSBuYW1lICYmIFNMRCAmJiBTTEQuaGFzKHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIGlkbiA9IG5hbWUgJiYgVVJJLmlkbl9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgICAgcHVueWNvZGUgPSBuYW1lICYmIFVSSS5wdW55Y29kZV9leHByZXNzaW9uLnRlc3QodGhpcy5fcGFydHMuaG9zdG5hbWUpO1xuICAgIH1cblxuICAgIHN3aXRjaCAod2hhdC50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdyZWxhdGl2ZSc6XG4gICAgICAgIHJldHVybiByZWxhdGl2ZTtcblxuICAgICAgY2FzZSAnYWJzb2x1dGUnOlxuICAgICAgICByZXR1cm4gIXJlbGF0aXZlO1xuXG4gICAgICAvLyBob3N0bmFtZSBpZGVudGlmaWNhdGlvblxuICAgICAgY2FzZSAnZG9tYWluJzpcbiAgICAgIGNhc2UgJ25hbWUnOlxuICAgICAgICByZXR1cm4gbmFtZTtcblxuICAgICAgY2FzZSAnc2xkJzpcbiAgICAgICAgcmV0dXJuIHNsZDtcblxuICAgICAgY2FzZSAnaXAnOlxuICAgICAgICByZXR1cm4gaXA7XG5cbiAgICAgIGNhc2UgJ2lwNCc6XG4gICAgICBjYXNlICdpcHY0JzpcbiAgICAgIGNhc2UgJ2luZXQ0JzpcbiAgICAgICAgcmV0dXJuIGlwNDtcblxuICAgICAgY2FzZSAnaXA2JzpcbiAgICAgIGNhc2UgJ2lwdjYnOlxuICAgICAgY2FzZSAnaW5ldDYnOlxuICAgICAgICByZXR1cm4gaXA2O1xuXG4gICAgICBjYXNlICdpZG4nOlxuICAgICAgICByZXR1cm4gaWRuO1xuXG4gICAgICBjYXNlICd1cmwnOlxuICAgICAgICByZXR1cm4gIXRoaXMuX3BhcnRzLnVybjtcblxuICAgICAgY2FzZSAndXJuJzpcbiAgICAgICAgcmV0dXJuICEhdGhpcy5fcGFydHMudXJuO1xuXG4gICAgICBjYXNlICdwdW55Y29kZSc6XG4gICAgICAgIHJldHVybiBwdW55Y29kZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICAvLyBjb21wb25lbnQgc3BlY2lmaWMgaW5wdXQgdmFsaWRhdGlvblxuICB2YXIgX3Byb3RvY29sID0gcC5wcm90b2NvbDtcbiAgdmFyIF9wb3J0ID0gcC5wb3J0O1xuICB2YXIgX2hvc3RuYW1lID0gcC5ob3N0bmFtZTtcblxuICBwLnByb3RvY29sID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAodikge1xuICAgICAgICAvLyBhY2NlcHQgdHJhaWxpbmcgOi8vXG4gICAgICAgIHYgPSB2LnJlcGxhY2UoLzooXFwvXFwvKT8kLywgJycpO1xuXG4gICAgICAgIGlmICghdi5tYXRjaChVUkkucHJvdG9jb2xfZXhwcmVzc2lvbikpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdQcm90b2NvbCBcIicgKyB2ICsgJ1wiIGNvbnRhaW5zIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiBbQS1aMC05ListXSBvciBkb2VzblxcJ3Qgc3RhcnQgd2l0aCBbQS1aXScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBfcHJvdG9jb2wuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuc2NoZW1lID0gcC5wcm90b2NvbDtcbiAgcC5wb3J0ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh2ID09PSAwKSB7XG4gICAgICAgIHYgPSBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICB2ICs9ICcnO1xuICAgICAgICBpZiAodi5jaGFyQXQoMCkgPT09ICc6Jykge1xuICAgICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2Lm1hdGNoKC9bXjAtOV0vKSkge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1BvcnQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gWzAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gX3BvcnQuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG4gIHAuaG9zdG5hbWUgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIHggPSB7fTtcbiAgICAgIHZhciByZXMgPSBVUkkucGFyc2VIb3N0KHYsIHgpO1xuICAgICAgaWYgKHJlcyAhPT0gJy8nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0hvc3RuYW1lIFwiJyArIHYgKyAnXCIgY29udGFpbnMgY2hhcmFjdGVycyBvdGhlciB0aGFuIFtBLVowLTkuLV0nKTtcbiAgICAgIH1cblxuICAgICAgdiA9IHguaG9zdG5hbWU7XG4gICAgfVxuICAgIHJldHVybiBfaG9zdG5hbWUuY2FsbCh0aGlzLCB2LCBidWlsZCk7XG4gIH07XG5cbiAgLy8gY29tcG91bmQgYWNjZXNzb3JzXG4gIHAub3JpZ2luID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgcGFydHM7XG5cbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBwcm90b2NvbCA9IHRoaXMucHJvdG9jb2woKTtcbiAgICAgIHZhciBhdXRob3JpdHkgPSB0aGlzLmF1dGhvcml0eSgpO1xuICAgICAgaWYgKCFhdXRob3JpdHkpIHJldHVybiAnJztcbiAgICAgIHJldHVybiAocHJvdG9jb2wgPyBwcm90b2NvbCArICc6Ly8nIDogJycpICsgdGhpcy5hdXRob3JpdHkoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG9yaWdpbiA9IFVSSSh2KTtcbiAgICAgIHRoaXNcbiAgICAgICAgLnByb3RvY29sKG9yaWdpbi5wcm90b2NvbCgpKVxuICAgICAgICAuYXV0aG9yaXR5KG9yaWdpbi5hdXRob3JpdHkoKSlcbiAgICAgICAgLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuaG9zdCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUgPyBVUkkuYnVpbGRIb3N0KHRoaXMuX3BhcnRzKSA6ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gVVJJLnBhcnNlSG9zdCh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuYXV0aG9yaXR5ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/IFVSSS5idWlsZEF1dGhvcml0eSh0aGlzLl9wYXJ0cykgOiAnJztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHJlcyA9IFVSSS5wYXJzZUF1dGhvcml0eSh2LCB0aGlzLl9wYXJ0cyk7XG4gICAgICBpZiAocmVzICE9PSAnLycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSG9zdG5hbWUgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOS4tXScpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAudXNlcmluZm8gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy51c2VybmFtZSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciB0ID0gVVJJLmJ1aWxkVXNlcmluZm8odGhpcy5fcGFydHMpO1xuICAgICAgcmV0dXJuIHQuc3Vic3RyaW5nKDAsIHQubGVuZ3RoIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZbdi5sZW5ndGgtMV0gIT09ICdAJykge1xuICAgICAgICB2ICs9ICdAJztcbiAgICAgIH1cblxuICAgICAgVVJJLnBhcnNlVXNlcmluZm8odiwgdGhpcy5fcGFydHMpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnJlc291cmNlID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICB2YXIgcGFydHM7XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5wYXRoKCkgKyB0aGlzLnNlYXJjaCgpICsgdGhpcy5oYXNoKCk7XG4gICAgfVxuXG4gICAgcGFydHMgPSBVUkkucGFyc2Uodik7XG4gICAgdGhpcy5fcGFydHMucGF0aCA9IHBhcnRzLnBhdGg7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBwYXJ0cy5xdWVyeTtcbiAgICB0aGlzLl9wYXJ0cy5mcmFnbWVudCA9IHBhcnRzLmZyYWdtZW50O1xuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBmcmFjdGlvbiBhY2Nlc3NvcnNcbiAgcC5zdWJkb21haW4gPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgLy8gY29udmVuaWVuY2UsIHJldHVybiBcInd3d1wiIGZyb20gXCJ3d3cuZXhhbXBsZS5vcmdcIlxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIC8vIGdyYWIgZG9tYWluIGFuZCBhZGQgYW5vdGhlciBzZWdtZW50XG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGVuZ3RoIC0gdGhpcy5kb21haW4oKS5sZW5ndGggLSAxO1xuICAgICAgcmV0dXJuIHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlbmQpIHx8ICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxlbmd0aCAtIHRoaXMuZG9tYWluKCkubGVuZ3RoO1xuICAgICAgdmFyIHN1YiA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnN1YnN0cmluZygwLCBlKTtcbiAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cCgnXicgKyBlc2NhcGVSZWdFeChzdWIpKTtcblxuICAgICAgaWYgKHYgJiYgdi5jaGFyQXQodi5sZW5ndGggLSAxKSAhPT0gJy4nKSB7XG4gICAgICAgIHYgKz0gJy4nO1xuICAgICAgfVxuXG4gICAgICBpZiAodikge1xuICAgICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLmRvbWFpbiA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBjb252ZW5pZW5jZSwgcmV0dXJuIFwiZXhhbXBsZS5vcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiBob3N0bmFtZSBjb25zaXN0cyBvZiAxIG9yIDIgc2VnbWVudHMsIGl0IG11c3QgYmUgdGhlIGRvbWFpblxuICAgICAgdmFyIHQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5tYXRjaCgvXFwuL2cpO1xuICAgICAgaWYgKHQgJiYgdC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0cy5ob3N0bmFtZTtcbiAgICAgIH1cblxuICAgICAgLy8gZ3JhYiB0bGQgYW5kIGFkZCBhbm90aGVyIHNlZ21lbnRcbiAgICAgIHZhciBlbmQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5sZW5ndGggLSB0aGlzLnRsZChidWlsZCkubGVuZ3RoIC0gMTtcbiAgICAgIGVuZCA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLmxhc3RJbmRleE9mKCcuJywgZW5kIC0xKSArIDE7XG4gICAgICByZXR1cm4gdGhpcy5fcGFydHMuaG9zdG5hbWUuc3Vic3RyaW5nKGVuZCkgfHwgJyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghdikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3Qgc2V0IGRvbWFpbiBlbXB0eScpO1xuICAgICAgfVxuXG4gICAgICBVUkkuZW5zdXJlVmFsaWRIb3N0bmFtZSh2KTtcblxuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5ob3N0bmFtZSB8fCB0aGlzLmlzKCdJUCcpKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCh0aGlzLmRvbWFpbigpKSArICckJyk7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9O1xuICBwLnRsZCA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm4gXCJvcmdcIiBmcm9tIFwid3d3LmV4YW1wbGUub3JnXCJcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLmhvc3RuYW1lIHx8IHRoaXMuaXMoJ0lQJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMuaG9zdG5hbWUubGFzdEluZGV4T2YoJy4nKTtcbiAgICAgIHZhciB0bGQgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS5zdWJzdHJpbmcocG9zICsgMSk7XG5cbiAgICAgIGlmIChidWlsZCAhPT0gdHJ1ZSAmJiBTTEQgJiYgU0xELmxpc3RbdGxkLnRvTG93ZXJDYXNlKCldKSB7XG4gICAgICAgIHJldHVybiBTTEQuZ2V0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKSB8fCB0bGQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0bGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXBsYWNlO1xuXG4gICAgICBpZiAoIXYpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2Fubm90IHNldCBUTEQgZW1wdHknKTtcbiAgICAgIH0gZWxzZSBpZiAodi5tYXRjaCgvW15hLXpBLVowLTktXS8pKSB7XG4gICAgICAgIGlmIChTTEQgJiYgU0xELmlzKHYpKSB7XG4gICAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gdGhpcy5fcGFydHMuaG9zdG5hbWUucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUTEQgXCInICsgdiArICdcIiBjb250YWlucyBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gW0EtWjAtOV0nKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICghdGhpcy5fcGFydHMuaG9zdG5hbWUgfHwgdGhpcy5pcygnSVAnKSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ2Nhbm5vdCBzZXQgVExEIG9uIG5vbi1kb21haW4gaG9zdCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy50bGQoKSkgKyAnJCcpO1xuICAgICAgICB0aGlzLl9wYXJ0cy5ob3N0bmFtZSA9IHRoaXMuX3BhcnRzLmhvc3RuYW1lLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5kaXJlY3RvcnkgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHJldHVybiB2ID09PSB1bmRlZmluZWQgPyAnJyA6IHRoaXM7XG4gICAgfVxuXG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCB8fCB2ID09PSB0cnVlKSB7XG4gICAgICBpZiAoIXRoaXMuX3BhcnRzLnBhdGggJiYgIXRoaXMuX3BhcnRzLmhvc3RuYW1lKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgfVxuXG4gICAgICB2YXIgZW5kID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciByZXMgPSB0aGlzLl9wYXJ0cy5wYXRoLnN1YnN0cmluZygwLCBlbmQpIHx8ICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSA/ICcvJyA6ICcnKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aChyZXMpIDogcmVzO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBlID0gdGhpcy5fcGFydHMucGF0aC5sZW5ndGggLSB0aGlzLmZpbGVuYW1lKCkubGVuZ3RoO1xuICAgICAgdmFyIGRpcmVjdG9yeSA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKDAsIGUpO1xuICAgICAgdmFyIHJlcGxhY2UgPSBuZXcgUmVnRXhwKCdeJyArIGVzY2FwZVJlZ0V4KGRpcmVjdG9yeSkpO1xuXG4gICAgICAvLyBmdWxseSBxdWFsaWZpZXIgZGlyZWN0b3JpZXMgYmVnaW4gd2l0aCBhIHNsYXNoXG4gICAgICBpZiAoIXRoaXMuaXMoJ3JlbGF0aXZlJykpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgdiA9ICcvJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2LmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICAgICAgdiA9ICcvJyArIHY7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZGlyZWN0b3JpZXMgYWx3YXlzIGVuZCB3aXRoIGEgc2xhc2hcbiAgICAgIGlmICh2ICYmIHYuY2hhckF0KHYubGVuZ3RoIC0gMSkgIT09ICcvJykge1xuICAgICAgICB2ICs9ICcvJztcbiAgICAgIH1cblxuICAgICAgdiA9IFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgdGhpcy5fcGFydHMucGF0aCA9IHRoaXMuX3BhcnRzLnBhdGgucmVwbGFjZShyZXBsYWNlLCB2KTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5maWxlbmFtZSA9IGZ1bmN0aW9uKHYsIGJ1aWxkKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHYgPT09IHVuZGVmaW5lZCA/ICcnIDogdGhpcztcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkIHx8IHYgPT09IHRydWUpIHtcbiAgICAgIGlmICghdGhpcy5fcGFydHMucGF0aCB8fCB0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgcG9zID0gdGhpcy5fcGFydHMucGF0aC5sYXN0SW5kZXhPZignLycpO1xuICAgICAgdmFyIHJlcyA9IHRoaXMuX3BhcnRzLnBhdGguc3Vic3RyaW5nKHBvcysxKTtcblxuICAgICAgcmV0dXJuIHYgPyBVUkkuZGVjb2RlUGF0aFNlZ21lbnQocmVzKSA6IHJlcztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG11dGF0ZWREaXJlY3RvcnkgPSBmYWxzZTtcblxuICAgICAgaWYgKHYuY2hhckF0KDApID09PSAnLycpIHtcbiAgICAgICAgdiA9IHYuc3Vic3RyaW5nKDEpO1xuICAgICAgfVxuXG4gICAgICBpZiAodi5tYXRjaCgvXFwuP1xcLy8pKSB7XG4gICAgICAgIG11dGF0ZWREaXJlY3RvcnkgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVwbGFjZSA9IG5ldyBSZWdFeHAoZXNjYXBlUmVnRXgodGhpcy5maWxlbmFtZSgpKSArICckJyk7XG4gICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICB0aGlzLl9wYXJ0cy5wYXRoID0gdGhpcy5fcGFydHMucGF0aC5yZXBsYWNlKHJlcGxhY2UsIHYpO1xuXG4gICAgICBpZiAobXV0YXRlZERpcmVjdG9yeSkge1xuICAgICAgICB0aGlzLm5vcm1hbGl6ZVBhdGgoYnVpbGQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH07XG4gIHAuc3VmZml4ID0gZnVuY3Rpb24odiwgYnVpbGQpIHtcbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICByZXR1cm4gdiA9PT0gdW5kZWZpbmVkID8gJycgOiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQgfHwgdiA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5wYXRoIHx8IHRoaXMuX3BhcnRzLnBhdGggPT09ICcvJykge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG5cbiAgICAgIHZhciBmaWxlbmFtZSA9IHRoaXMuZmlsZW5hbWUoKTtcbiAgICAgIHZhciBwb3MgPSBmaWxlbmFtZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgdmFyIHMsIHJlcztcblxuICAgICAgaWYgKHBvcyA9PT0gLTEpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuXG4gICAgICAvLyBzdWZmaXggbWF5IG9ubHkgY29udGFpbiBhbG51bSBjaGFyYWN0ZXJzICh5dXAsIEkgbWFkZSB0aGlzIHVwLilcbiAgICAgIHMgPSBmaWxlbmFtZS5zdWJzdHJpbmcocG9zKzEpO1xuICAgICAgcmVzID0gKC9eW2EtejAtOSVdKyQvaSkudGVzdChzKSA/IHMgOiAnJztcbiAgICAgIHJldHVybiB2ID8gVVJJLmRlY29kZVBhdGhTZWdtZW50KHJlcykgOiByZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2LmNoYXJBdCgwKSA9PT0gJy4nKSB7XG4gICAgICAgIHYgPSB2LnN1YnN0cmluZygxKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN1ZmZpeCA9IHRoaXMuc3VmZml4KCk7XG4gICAgICB2YXIgcmVwbGFjZTtcblxuICAgICAgaWYgKCFzdWZmaXgpIHtcbiAgICAgICAgaWYgKCF2KSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9wYXJ0cy5wYXRoICs9ICcuJyArIFVSSS5yZWNvZGVQYXRoKHYpO1xuICAgICAgfSBlbHNlIGlmICghdikge1xuICAgICAgICByZXBsYWNlID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeCgnLicgKyBzdWZmaXgpICsgJyQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcGxhY2UgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4KHN1ZmZpeCkgKyAnJCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVwbGFjZSkge1xuICAgICAgICB2ID0gVVJJLnJlY29kZVBhdGgodik7XG4gICAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSB0aGlzLl9wYXJ0cy5wYXRoLnJlcGxhY2UocmVwbGFjZSwgdik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfTtcbiAgcC5zZWdtZW50ID0gZnVuY3Rpb24oc2VnbWVudCwgdiwgYnVpbGQpIHtcbiAgICB2YXIgc2VwYXJhdG9yID0gdGhpcy5fcGFydHMudXJuID8gJzonIDogJy8nO1xuICAgIHZhciBwYXRoID0gdGhpcy5wYXRoKCk7XG4gICAgdmFyIGFic29sdXRlID0gcGF0aC5zdWJzdHJpbmcoMCwgMSkgPT09ICcvJztcbiAgICB2YXIgc2VnbWVudHMgPSBwYXRoLnNwbGl0KHNlcGFyYXRvcik7XG5cbiAgICBpZiAoc2VnbWVudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBzZWdtZW50ICE9PSAnbnVtYmVyJykge1xuICAgICAgYnVpbGQgPSB2O1xuICAgICAgdiA9IHNlZ21lbnQ7XG4gICAgICBzZWdtZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50ICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIHNlZ21lbnQgIT09ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBzZWdtZW50IFwiJyArIHNlZ21lbnQgKyAnXCIsIG11c3QgYmUgMC1iYXNlZCBpbnRlZ2VyJyk7XG4gICAgfVxuXG4gICAgaWYgKGFic29sdXRlKSB7XG4gICAgICBzZWdtZW50cy5zaGlmdCgpO1xuICAgIH1cblxuICAgIGlmIChzZWdtZW50IDwgMCkge1xuICAgICAgLy8gYWxsb3cgbmVnYXRpdmUgaW5kZXhlcyB0byBhZGRyZXNzIGZyb20gdGhlIGVuZFxuICAgICAgc2VnbWVudCA9IE1hdGgubWF4KHNlZ21lbnRzLmxlbmd0aCArIHNlZ21lbnQsIDApO1xuICAgIH1cblxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiB0cnVlICovXG4gICAgICByZXR1cm4gc2VnbWVudCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gc2VnbWVudHNcbiAgICAgICAgOiBzZWdtZW50c1tzZWdtZW50XTtcbiAgICAgIC8qanNoaW50IGxheGJyZWFrOiBmYWxzZSAqL1xuICAgIH0gZWxzZSBpZiAoc2VnbWVudCA9PT0gbnVsbCB8fCBzZWdtZW50c1tzZWdtZW50XSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaXNBcnJheSh2KSkge1xuICAgICAgICBzZWdtZW50cyA9IFtdO1xuICAgICAgICAvLyBjb2xsYXBzZSBlbXB0eSBlbGVtZW50cyB3aXRoaW4gYXJyYXlcbiAgICAgICAgZm9yICh2YXIgaT0wLCBsPXYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCF2W2ldLmxlbmd0aCAmJiAoIXNlZ21lbnRzLmxlbmd0aCB8fCAhc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VnbWVudHMubGVuZ3RoICYmICFzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLTFdLmxlbmd0aCkge1xuICAgICAgICAgICAgc2VnbWVudHMucG9wKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VnbWVudHMucHVzaCh0cmltU2xhc2hlcyh2W2ldKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodiB8fCB0eXBlb2YgdiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdiA9IHRyaW1TbGFzaGVzKHYpO1xuICAgICAgICBpZiAoc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9PT0gJycpIHtcbiAgICAgICAgICAvLyBlbXB0eSB0cmFpbGluZyBlbGVtZW50cyBoYXZlIHRvIGJlIG92ZXJ3cml0dGVuXG4gICAgICAgICAgLy8gdG8gcHJldmVudCByZXN1bHRzIHN1Y2ggYXMgL2Zvby8vYmFyXG4gICAgICAgICAgc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0xXSA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VnbWVudHMucHVzaCh2KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodikge1xuICAgICAgICBzZWdtZW50c1tzZWdtZW50XSA9IHRyaW1TbGFzaGVzKHYpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VnbWVudHMuc3BsaWNlKHNlZ21lbnQsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChhYnNvbHV0ZSkge1xuICAgICAgc2VnbWVudHMudW5zaGlmdCgnJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucGF0aChzZWdtZW50cy5qb2luKHNlcGFyYXRvciksIGJ1aWxkKTtcbiAgfTtcbiAgcC5zZWdtZW50Q29kZWQgPSBmdW5jdGlvbihzZWdtZW50LCB2LCBidWlsZCkge1xuICAgIHZhciBzZWdtZW50cywgaSwgbDtcblxuICAgIGlmICh0eXBlb2Ygc2VnbWVudCAhPT0gJ251bWJlcicpIHtcbiAgICAgIGJ1aWxkID0gdjtcbiAgICAgIHYgPSBzZWdtZW50O1xuICAgICAgc2VnbWVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzZWdtZW50cyA9IHRoaXMuc2VnbWVudChzZWdtZW50LCB2LCBidWlsZCk7XG4gICAgICBpZiAoIWlzQXJyYXkoc2VnbWVudHMpKSB7XG4gICAgICAgIHNlZ21lbnRzID0gc2VnbWVudHMgIT09IHVuZGVmaW5lZCA/IFVSSS5kZWNvZGUoc2VnbWVudHMpIDogdW5kZWZpbmVkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChpID0gMCwgbCA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHNlZ21lbnRzW2ldID0gVVJJLmRlY29kZShzZWdtZW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNlZ21lbnRzO1xuICAgIH1cblxuICAgIGlmICghaXNBcnJheSh2KSkge1xuICAgICAgdiA9ICh0eXBlb2YgdiA9PT0gJ3N0cmluZycgfHwgdiBpbnN0YW5jZW9mIFN0cmluZykgPyBVUkkuZW5jb2RlKHYpIDogdjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChpID0gMCwgbCA9IHYubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZbaV0gPSBVUkkuZW5jb2RlKHZbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnNlZ21lbnQoc2VnbWVudCwgdiwgYnVpbGQpO1xuICB9O1xuXG4gIC8vIG11dGF0aW5nIHF1ZXJ5IHN0cmluZ1xuICB2YXIgcSA9IHAucXVlcnk7XG4gIHAucXVlcnkgPSBmdW5jdGlvbih2LCBidWlsZCkge1xuICAgIGlmICh2ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgICAgdmFyIHJlc3VsdCA9IHYuY2FsbCh0aGlzLCBkYXRhKTtcbiAgICAgIHRoaXMuX3BhcnRzLnF1ZXJ5ID0gVVJJLmJ1aWxkUXVlcnkocmVzdWx0IHx8IGRhdGEsIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycywgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9IGVsc2UgaWYgKHYgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgdiAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuX3BhcnRzLnF1ZXJ5ID0gVVJJLmJ1aWxkUXVlcnkodiwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcS5jYWxsKHRoaXMsIHYsIGJ1aWxkKTtcbiAgICB9XG4gIH07XG4gIHAuc2V0UXVlcnkgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSwgYnVpbGQpIHtcbiAgICB2YXIgZGF0YSA9IFVSSS5wYXJzZVF1ZXJ5KHRoaXMuX3BhcnRzLnF1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcblxuICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3N0cmluZycgfHwgbmFtZSBpbnN0YW5jZW9mIFN0cmluZykge1xuICAgICAgZGF0YVtuYW1lXSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IG51bGw7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiBuYW1lKSB7XG4gICAgICAgIGlmIChoYXNPd24uY2FsbChuYW1lLCBrZXkpKSB7XG4gICAgICAgICAgZGF0YVtrZXldID0gbmFtZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VSSS5hZGRRdWVyeSgpIGFjY2VwdHMgYW4gb2JqZWN0LCBzdHJpbmcgYXMgdGhlIG5hbWUgcGFyYW1ldGVyJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1aWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLmFkZFF1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGJ1aWxkKSB7XG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgVVJJLmFkZFF1ZXJ5KGRhdGEsIG5hbWUsIHZhbHVlID09PSB1bmRlZmluZWQgPyBudWxsIDogdmFsdWUpO1xuICAgIHRoaXMuX3BhcnRzLnF1ZXJ5ID0gVVJJLmJ1aWxkUXVlcnkoZGF0YSwgdGhpcy5fcGFydHMuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBidWlsZCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5yZW1vdmVRdWVyeSA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlLCBidWlsZCkge1xuICAgIHZhciBkYXRhID0gVVJJLnBhcnNlUXVlcnkodGhpcy5fcGFydHMucXVlcnksIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIFVSSS5yZW1vdmVRdWVyeShkYXRhLCBuYW1lLCB2YWx1ZSk7XG4gICAgdGhpcy5fcGFydHMucXVlcnkgPSBVUkkuYnVpbGRRdWVyeShkYXRhLCB0aGlzLl9wYXJ0cy5kdXBsaWNhdGVRdWVyeVBhcmFtZXRlcnMsIHRoaXMuX3BhcnRzLmVzY2FwZVF1ZXJ5U3BhY2UpO1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIGJ1aWxkID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLmhhc1F1ZXJ5ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUsIHdpdGhpbkFycmF5KSB7XG4gICAgdmFyIGRhdGEgPSBVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSk7XG4gICAgcmV0dXJuIFVSSS5oYXNRdWVyeShkYXRhLCBuYW1lLCB2YWx1ZSwgd2l0aGluQXJyYXkpO1xuICB9O1xuICBwLnNldFNlYXJjaCA9IHAuc2V0UXVlcnk7XG4gIHAuYWRkU2VhcmNoID0gcC5hZGRRdWVyeTtcbiAgcC5yZW1vdmVTZWFyY2ggPSBwLnJlbW92ZVF1ZXJ5O1xuICBwLmhhc1NlYXJjaCA9IHAuaGFzUXVlcnk7XG5cbiAgLy8gc2FuaXRpemluZyBVUkxzXG4gIHAubm9ybWFsaXplID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuX3BhcnRzLnVybikge1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICAgICAgLm5vcm1hbGl6ZVByb3RvY29sKGZhbHNlKVxuICAgICAgICAubm9ybWFsaXplUGF0aChmYWxzZSlcbiAgICAgICAgLm5vcm1hbGl6ZVF1ZXJ5KGZhbHNlKVxuICAgICAgICAubm9ybWFsaXplRnJhZ21lbnQoZmFsc2UpXG4gICAgICAgIC5idWlsZCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzXG4gICAgICAubm9ybWFsaXplUHJvdG9jb2woZmFsc2UpXG4gICAgICAubm9ybWFsaXplSG9zdG5hbWUoZmFsc2UpXG4gICAgICAubm9ybWFsaXplUG9ydChmYWxzZSlcbiAgICAgIC5ub3JtYWxpemVQYXRoKGZhbHNlKVxuICAgICAgLm5vcm1hbGl6ZVF1ZXJ5KGZhbHNlKVxuICAgICAgLm5vcm1hbGl6ZUZyYWdtZW50KGZhbHNlKVxuICAgICAgLmJ1aWxkKCk7XG4gIH07XG4gIHAubm9ybWFsaXplUHJvdG9jb2wgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5fcGFydHMucHJvdG9jb2wgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9wYXJ0cy5wcm90b2NvbCA9IHRoaXMuX3BhcnRzLnByb3RvY29sLnRvTG93ZXJDYXNlKCk7XG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplSG9zdG5hbWUgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIGlmICh0aGlzLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgaWYgKHRoaXMuaXMoJ0lETicpICYmIHB1bnljb2RlKSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gcHVueWNvZGUudG9BU0NJSSh0aGlzLl9wYXJ0cy5ob3N0bmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXMoJ0lQdjYnKSAmJiBJUHY2KSB7XG4gICAgICAgIHRoaXMuX3BhcnRzLmhvc3RuYW1lID0gSVB2Ni5iZXN0KHRoaXMuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fcGFydHMuaG9zdG5hbWUgPSB0aGlzLl9wYXJ0cy5ob3N0bmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVBvcnQgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIC8vIHJlbW92ZSBwb3J0IG9mIGl0J3MgdGhlIHByb3RvY29sJ3MgZGVmYXVsdFxuICAgIGlmICh0eXBlb2YgdGhpcy5fcGFydHMucHJvdG9jb2wgPT09ICdzdHJpbmcnICYmIHRoaXMuX3BhcnRzLnBvcnQgPT09IFVSSS5kZWZhdWx0UG9ydHNbdGhpcy5fcGFydHMucHJvdG9jb2xdKSB7XG4gICAgICB0aGlzLl9wYXJ0cy5wb3J0ID0gbnVsbDtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVQYXRoID0gZnVuY3Rpb24oYnVpbGQpIHtcbiAgICB2YXIgX3BhdGggPSB0aGlzLl9wYXJ0cy5wYXRoO1xuICAgIGlmICghX3BhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJ0cy51cm4pIHtcbiAgICAgIHRoaXMuX3BhcnRzLnBhdGggPSBVUkkucmVjb2RlVXJuUGF0aCh0aGlzLl9wYXJ0cy5wYXRoKTtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9wYXJ0cy5wYXRoID09PSAnLycpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBfd2FzX3JlbGF0aXZlO1xuICAgIHZhciBfbGVhZGluZ1BhcmVudHMgPSAnJztcbiAgICB2YXIgX3BhcmVudCwgX3BvcztcblxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBwYXRoc1xuICAgIGlmIChfcGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgX3dhc19yZWxhdGl2ZSA9IHRydWU7XG4gICAgICBfcGF0aCA9ICcvJyArIF9wYXRoO1xuICAgIH1cblxuICAgIC8vIGhhbmRsZSByZWxhdGl2ZSBmaWxlcyAoYXMgb3Bwb3NlZCB0byBkaXJlY3RvcmllcylcbiAgICBpZiAoX3BhdGguc2xpY2UoLTMpID09PSAnLy4uJyB8fCBfcGF0aC5zbGljZSgtMikgPT09ICcvLicpIHtcbiAgICAgIF9wYXRoICs9ICcvJztcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHNpbXBsZXNcbiAgICBfcGF0aCA9IF9wYXRoXG4gICAgICAucmVwbGFjZSgvKFxcLyhcXC5cXC8pKyl8KFxcL1xcLiQpL2csICcvJylcbiAgICAgIC5yZXBsYWNlKC9cXC97Mix9L2csICcvJyk7XG5cbiAgICAvLyByZW1lbWJlciBsZWFkaW5nIHBhcmVudHNcbiAgICBpZiAoX3dhc19yZWxhdGl2ZSkge1xuICAgICAgX2xlYWRpbmdQYXJlbnRzID0gX3BhdGguc3Vic3RyaW5nKDEpLm1hdGNoKC9eKFxcLlxcLlxcLykrLykgfHwgJyc7XG4gICAgICBpZiAoX2xlYWRpbmdQYXJlbnRzKSB7XG4gICAgICAgIF9sZWFkaW5nUGFyZW50cyA9IF9sZWFkaW5nUGFyZW50c1swXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIHBhcmVudHNcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgX3BhcmVudCA9IF9wYXRoLmluZGV4T2YoJy8uLicpO1xuICAgICAgaWYgKF9wYXJlbnQgPT09IC0xKSB7XG4gICAgICAgIC8vIG5vIG1vcmUgLi4vIHRvIHJlc29sdmVcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKF9wYXJlbnQgPT09IDApIHtcbiAgICAgICAgLy8gdG9wIGxldmVsIGNhbm5vdCBiZSByZWxhdGl2ZSwgc2tpcCBpdFxuICAgICAgICBfcGF0aCA9IF9wYXRoLnN1YnN0cmluZygzKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIF9wb3MgPSBfcGF0aC5zdWJzdHJpbmcoMCwgX3BhcmVudCkubGFzdEluZGV4T2YoJy8nKTtcbiAgICAgIGlmIChfcG9zID09PSAtMSkge1xuICAgICAgICBfcG9zID0gX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIF9wYXRoID0gX3BhdGguc3Vic3RyaW5nKDAsIF9wb3MpICsgX3BhdGguc3Vic3RyaW5nKF9wYXJlbnQgKyAzKTtcbiAgICB9XG5cbiAgICAvLyByZXZlcnQgdG8gcmVsYXRpdmVcbiAgICBpZiAoX3dhc19yZWxhdGl2ZSAmJiB0aGlzLmlzKCdyZWxhdGl2ZScpKSB7XG4gICAgICBfcGF0aCA9IF9sZWFkaW5nUGFyZW50cyArIF9wYXRoLnN1YnN0cmluZygxKTtcbiAgICB9XG5cbiAgICBfcGF0aCA9IFVSSS5yZWNvZGVQYXRoKF9wYXRoKTtcbiAgICB0aGlzLl9wYXJ0cy5wYXRoID0gX3BhdGg7XG4gICAgdGhpcy5idWlsZCghYnVpbGQpO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBwLm5vcm1hbGl6ZVBhdGhuYW1lID0gcC5ub3JtYWxpemVQYXRoO1xuICBwLm5vcm1hbGl6ZVF1ZXJ5ID0gZnVuY3Rpb24oYnVpbGQpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX3BhcnRzLnF1ZXJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKCF0aGlzLl9wYXJ0cy5xdWVyeS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5fcGFydHMucXVlcnkgPSBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5xdWVyeShVUkkucGFyc2VRdWVyeSh0aGlzLl9wYXJ0cy5xdWVyeSwgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmJ1aWxkKCFidWlsZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIHAubm9ybWFsaXplRnJhZ21lbnQgPSBmdW5jdGlvbihidWlsZCkge1xuICAgIGlmICghdGhpcy5fcGFydHMuZnJhZ21lbnQpIHtcbiAgICAgIHRoaXMuX3BhcnRzLmZyYWdtZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuYnVpbGQoIWJ1aWxkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbiAgcC5ub3JtYWxpemVTZWFyY2ggPSBwLm5vcm1hbGl6ZVF1ZXJ5O1xuICBwLm5vcm1hbGl6ZUhhc2ggPSBwLm5vcm1hbGl6ZUZyYWdtZW50O1xuXG4gIHAuaXNvODg1OSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGV4cGVjdCB1bmljb2RlIGlucHV0LCBpc284ODU5IG91dHB1dFxuICAgIHZhciBlID0gVVJJLmVuY29kZTtcbiAgICB2YXIgZCA9IFVSSS5kZWNvZGU7XG5cbiAgICBVUkkuZW5jb2RlID0gZXNjYXBlO1xuICAgIFVSSS5kZWNvZGUgPSBkZWNvZGVVUklDb21wb25lbnQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubm9ybWFsaXplKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIFVSSS5lbmNvZGUgPSBlO1xuICAgICAgVVJJLmRlY29kZSA9IGQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHAudW5pY29kZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGV4cGVjdCBpc284ODU5IGlucHV0LCB1bmljb2RlIG91dHB1dFxuICAgIHZhciBlID0gVVJJLmVuY29kZTtcbiAgICB2YXIgZCA9IFVSSS5kZWNvZGU7XG5cbiAgICBVUkkuZW5jb2RlID0gc3RyaWN0RW5jb2RlVVJJQ29tcG9uZW50O1xuICAgIFVSSS5kZWNvZGUgPSB1bmVzY2FwZTtcbiAgICB0cnkge1xuICAgICAgdGhpcy5ub3JtYWxpemUoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgVVJJLmVuY29kZSA9IGU7XG4gICAgICBVUkkuZGVjb2RlID0gZDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcC5yZWFkYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1cmkgPSB0aGlzLmNsb25lKCk7XG4gICAgLy8gcmVtb3ZpbmcgdXNlcm5hbWUsIHBhc3N3b3JkLCBiZWNhdXNlIHRoZXkgc2hvdWxkbid0IGJlIGRpc3BsYXllZCBhY2NvcmRpbmcgdG8gUkZDIDM5ODZcbiAgICB1cmkudXNlcm5hbWUoJycpLnBhc3N3b3JkKCcnKS5ub3JtYWxpemUoKTtcbiAgICB2YXIgdCA9ICcnO1xuICAgIGlmICh1cmkuX3BhcnRzLnByb3RvY29sKSB7XG4gICAgICB0ICs9IHVyaS5fcGFydHMucHJvdG9jb2wgKyAnOi8vJztcbiAgICB9XG5cbiAgICBpZiAodXJpLl9wYXJ0cy5ob3N0bmFtZSkge1xuICAgICAgaWYgKHVyaS5pcygncHVueWNvZGUnKSAmJiBwdW55Y29kZSkge1xuICAgICAgICB0ICs9IHB1bnljb2RlLnRvVW5pY29kZSh1cmkuX3BhcnRzLmhvc3RuYW1lKTtcbiAgICAgICAgaWYgKHVyaS5fcGFydHMucG9ydCkge1xuICAgICAgICAgIHQgKz0gJzonICsgdXJpLl9wYXJ0cy5wb3J0O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ICs9IHVyaS5ob3N0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHVyaS5fcGFydHMuaG9zdG5hbWUgJiYgdXJpLl9wYXJ0cy5wYXRoICYmIHVyaS5fcGFydHMucGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgdCArPSAnLyc7XG4gICAgfVxuXG4gICAgdCArPSB1cmkucGF0aCh0cnVlKTtcbiAgICBpZiAodXJpLl9wYXJ0cy5xdWVyeSkge1xuICAgICAgdmFyIHEgPSAnJztcbiAgICAgIGZvciAodmFyIGkgPSAwLCBxcCA9IHVyaS5fcGFydHMucXVlcnkuc3BsaXQoJyYnKSwgbCA9IHFwLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICB2YXIga3YgPSAocXBbaV0gfHwgJycpLnNwbGl0KCc9Jyk7XG4gICAgICAgIHEgKz0gJyYnICsgVVJJLmRlY29kZVF1ZXJ5KGt2WzBdLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKVxuICAgICAgICAgIC5yZXBsYWNlKC8mL2csICclMjYnKTtcblxuICAgICAgICBpZiAoa3ZbMV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHEgKz0gJz0nICsgVVJJLmRlY29kZVF1ZXJ5KGt2WzFdLCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKVxuICAgICAgICAgICAgLnJlcGxhY2UoLyYvZywgJyUyNicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0ICs9ICc/JyArIHEuc3Vic3RyaW5nKDEpO1xuICAgIH1cblxuICAgIHQgKz0gVVJJLmRlY29kZVF1ZXJ5KHVyaS5oYXNoKCksIHRydWUpO1xuICAgIHJldHVybiB0O1xuICB9O1xuXG4gIC8vIHJlc29sdmluZyByZWxhdGl2ZSBhbmQgYWJzb2x1dGUgVVJMc1xuICBwLmFic29sdXRlVG8gPSBmdW5jdGlvbihiYXNlKSB7XG4gICAgdmFyIHJlc29sdmVkID0gdGhpcy5jbG9uZSgpO1xuICAgIHZhciBwcm9wZXJ0aWVzID0gWydwcm90b2NvbCcsICd1c2VybmFtZScsICdwYXNzd29yZCcsICdob3N0bmFtZScsICdwb3J0J107XG4gICAgdmFyIGJhc2VkaXIsIGksIHA7XG5cbiAgICBpZiAodGhpcy5fcGFydHMudXJuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VSTnMgZG8gbm90IGhhdmUgYW55IGdlbmVyYWxseSBkZWZpbmVkIGhpZXJhcmNoaWNhbCBjb21wb25lbnRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCEoYmFzZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAgICAgIGJhc2UgPSBuZXcgVVJJKGJhc2UpO1xuICAgIH1cblxuICAgIGlmICghcmVzb2x2ZWQuX3BhcnRzLnByb3RvY29sKSB7XG4gICAgICByZXNvbHZlZC5fcGFydHMucHJvdG9jb2wgPSBiYXNlLl9wYXJ0cy5wcm90b2NvbDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fcGFydHMuaG9zdG5hbWUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyAocCA9IHByb3BlcnRpZXNbaV0pOyBpKyspIHtcbiAgICAgIHJlc29sdmVkLl9wYXJ0c1twXSA9IGJhc2UuX3BhcnRzW3BdO1xuICAgIH1cblxuICAgIGlmICghcmVzb2x2ZWQuX3BhcnRzLnBhdGgpIHtcbiAgICAgIHJlc29sdmVkLl9wYXJ0cy5wYXRoID0gYmFzZS5fcGFydHMucGF0aDtcbiAgICAgIGlmICghcmVzb2x2ZWQuX3BhcnRzLnF1ZXJ5KSB7XG4gICAgICAgIHJlc29sdmVkLl9wYXJ0cy5xdWVyeSA9IGJhc2UuX3BhcnRzLnF1ZXJ5O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVzb2x2ZWQuX3BhcnRzLnBhdGguc3Vic3RyaW5nKC0yKSA9PT0gJy4uJykge1xuICAgICAgcmVzb2x2ZWQuX3BhcnRzLnBhdGggKz0gJy8nO1xuICAgIH1cblxuICAgIGlmIChyZXNvbHZlZC5wYXRoKCkuY2hhckF0KDApICE9PSAnLycpIHtcbiAgICAgIGJhc2VkaXIgPSBiYXNlLmRpcmVjdG9yeSgpO1xuICAgICAgYmFzZWRpciA9IGJhc2VkaXIgPyBiYXNlZGlyIDogYmFzZS5wYXRoKCkuaW5kZXhPZignLycpID09PSAwID8gJy8nIDogJyc7XG4gICAgICByZXNvbHZlZC5fcGFydHMucGF0aCA9IChiYXNlZGlyID8gKGJhc2VkaXIgKyAnLycpIDogJycpICsgcmVzb2x2ZWQuX3BhcnRzLnBhdGg7XG4gICAgICByZXNvbHZlZC5ub3JtYWxpemVQYXRoKCk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZWQuYnVpbGQoKTtcbiAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gIH07XG4gIHAucmVsYXRpdmVUbyA9IGZ1bmN0aW9uKGJhc2UpIHtcbiAgICB2YXIgcmVsYXRpdmUgPSB0aGlzLmNsb25lKCkubm9ybWFsaXplKCk7XG4gICAgdmFyIHJlbGF0aXZlUGFydHMsIGJhc2VQYXJ0cywgY29tbW9uLCByZWxhdGl2ZVBhdGgsIGJhc2VQYXRoO1xuXG4gICAgaWYgKHJlbGF0aXZlLl9wYXJ0cy51cm4pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVVJOcyBkbyBub3QgaGF2ZSBhbnkgZ2VuZXJhbGx5IGRlZmluZWQgaGllcmFyY2hpY2FsIGNvbXBvbmVudHMnKTtcbiAgICB9XG5cbiAgICBiYXNlID0gbmV3IFVSSShiYXNlKS5ub3JtYWxpemUoKTtcbiAgICByZWxhdGl2ZVBhcnRzID0gcmVsYXRpdmUuX3BhcnRzO1xuICAgIGJhc2VQYXJ0cyA9IGJhc2UuX3BhcnRzO1xuICAgIHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlLnBhdGgoKTtcbiAgICBiYXNlUGF0aCA9IGJhc2UucGF0aCgpO1xuXG4gICAgaWYgKHJlbGF0aXZlUGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUkkgaXMgYWxyZWFkeSByZWxhdGl2ZScpO1xuICAgIH1cblxuICAgIGlmIChiYXNlUGF0aC5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsY3VsYXRlIGEgVVJJIHJlbGF0aXZlIHRvIGFub3RoZXIgcmVsYXRpdmUgVVJJJyk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGFydHMucHJvdG9jb2wgPT09IGJhc2VQYXJ0cy5wcm90b2NvbCkge1xuICAgICAgcmVsYXRpdmVQYXJ0cy5wcm90b2NvbCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGFydHMudXNlcm5hbWUgIT09IGJhc2VQYXJ0cy51c2VybmFtZSB8fCByZWxhdGl2ZVBhcnRzLnBhc3N3b3JkICE9PSBiYXNlUGFydHMucGFzc3dvcmQpIHtcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZVBhcnRzLnByb3RvY29sICE9PSBudWxsIHx8IHJlbGF0aXZlUGFydHMudXNlcm5hbWUgIT09IG51bGwgfHwgcmVsYXRpdmVQYXJ0cy5wYXNzd29yZCAhPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgaWYgKHJlbGF0aXZlUGFydHMuaG9zdG5hbWUgPT09IGJhc2VQYXJ0cy5ob3N0bmFtZSAmJiByZWxhdGl2ZVBhcnRzLnBvcnQgPT09IGJhc2VQYXJ0cy5wb3J0KSB7XG4gICAgICByZWxhdGl2ZVBhcnRzLmhvc3RuYW1lID0gbnVsbDtcbiAgICAgIHJlbGF0aXZlUGFydHMucG9ydCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICAgIH1cblxuICAgIGlmIChyZWxhdGl2ZVBhdGggPT09IGJhc2VQYXRoKSB7XG4gICAgICByZWxhdGl2ZVBhcnRzLnBhdGggPSAnJztcbiAgICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICAgIH1cblxuICAgIC8vIGRldGVybWluZSBjb21tb24gc3ViIHBhdGhcbiAgICBjb21tb24gPSBVUkkuY29tbW9uUGF0aChyZWxhdGl2ZVBhdGgsIGJhc2VQYXRoKTtcblxuICAgIC8vIElmIHRoZSBwYXRocyBoYXZlIG5vdGhpbmcgaW4gY29tbW9uLCByZXR1cm4gYSByZWxhdGl2ZSBVUkwgd2l0aCB0aGUgYWJzb2x1dGUgcGF0aC5cbiAgICBpZiAoIWNvbW1vbikge1xuICAgICAgcmV0dXJuIHJlbGF0aXZlLmJ1aWxkKCk7XG4gICAgfVxuXG4gICAgdmFyIHBhcmVudHMgPSBiYXNlUGFydHMucGF0aFxuICAgICAgLnN1YnN0cmluZyhjb21tb24ubGVuZ3RoKVxuICAgICAgLnJlcGxhY2UoL1teXFwvXSokLywgJycpXG4gICAgICAucmVwbGFjZSgvLio/XFwvL2csICcuLi8nKTtcblxuICAgIHJlbGF0aXZlUGFydHMucGF0aCA9IChwYXJlbnRzICsgcmVsYXRpdmVQYXJ0cy5wYXRoLnN1YnN0cmluZyhjb21tb24ubGVuZ3RoKSkgfHwgJy4vJztcblxuICAgIHJldHVybiByZWxhdGl2ZS5idWlsZCgpO1xuICB9O1xuXG4gIC8vIGNvbXBhcmluZyBVUklzXG4gIHAuZXF1YWxzID0gZnVuY3Rpb24odXJpKSB7XG4gICAgdmFyIG9uZSA9IHRoaXMuY2xvbmUoKTtcbiAgICB2YXIgdHdvID0gbmV3IFVSSSh1cmkpO1xuICAgIHZhciBvbmVfbWFwID0ge307XG4gICAgdmFyIHR3b19tYXAgPSB7fTtcbiAgICB2YXIgY2hlY2tlZCA9IHt9O1xuICAgIHZhciBvbmVfcXVlcnksIHR3b19xdWVyeSwga2V5O1xuXG4gICAgb25lLm5vcm1hbGl6ZSgpO1xuICAgIHR3by5ub3JtYWxpemUoKTtcblxuICAgIC8vIGV4YWN0IG1hdGNoXG4gICAgaWYgKG9uZS50b1N0cmluZygpID09PSB0d28udG9TdHJpbmcoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLy8gZXh0cmFjdCBxdWVyeSBzdHJpbmdcbiAgICBvbmVfcXVlcnkgPSBvbmUucXVlcnkoKTtcbiAgICB0d29fcXVlcnkgPSB0d28ucXVlcnkoKTtcbiAgICBvbmUucXVlcnkoJycpO1xuICAgIHR3by5xdWVyeSgnJyk7XG5cbiAgICAvLyBkZWZpbml0ZWx5IG5vdCBlcXVhbCBpZiBub3QgZXZlbiBub24tcXVlcnkgcGFydHMgbWF0Y2hcbiAgICBpZiAob25lLnRvU3RyaW5nKCkgIT09IHR3by50b1N0cmluZygpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gcXVlcnkgcGFyYW1ldGVycyBoYXZlIHRoZSBzYW1lIGxlbmd0aCwgZXZlbiBpZiB0aGV5J3JlIHBlcm11dGVkXG4gICAgaWYgKG9uZV9xdWVyeS5sZW5ndGggIT09IHR3b19xdWVyeS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBvbmVfbWFwID0gVVJJLnBhcnNlUXVlcnkob25lX3F1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcbiAgICB0d29fbWFwID0gVVJJLnBhcnNlUXVlcnkodHdvX3F1ZXJ5LCB0aGlzLl9wYXJ0cy5lc2NhcGVRdWVyeVNwYWNlKTtcblxuICAgIGZvciAoa2V5IGluIG9uZV9tYXApIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbChvbmVfbWFwLCBrZXkpKSB7XG4gICAgICAgIGlmICghaXNBcnJheShvbmVfbWFwW2tleV0pKSB7XG4gICAgICAgICAgaWYgKG9uZV9tYXBba2V5XSAhPT0gdHdvX21hcFtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFhcnJheXNFcXVhbChvbmVfbWFwW2tleV0sIHR3b19tYXBba2V5XSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjaGVja2VkW2tleV0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoa2V5IGluIHR3b19tYXApIHtcbiAgICAgIGlmIChoYXNPd24uY2FsbCh0d29fbWFwLCBrZXkpKSB7XG4gICAgICAgIGlmICghY2hlY2tlZFtrZXldKSB7XG4gICAgICAgICAgLy8gdHdvIGNvbnRhaW5zIGEgcGFyYW1ldGVyIG5vdCBwcmVzZW50IGluIG9uZVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIC8vIHN0YXRlXG4gIHAuZHVwbGljYXRlUXVlcnlQYXJhbWV0ZXJzID0gZnVuY3Rpb24odikge1xuICAgIHRoaXMuX3BhcnRzLmR1cGxpY2F0ZVF1ZXJ5UGFyYW1ldGVycyA9ICEhdjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBwLmVzY2FwZVF1ZXJ5U3BhY2UgPSBmdW5jdGlvbih2KSB7XG4gICAgdGhpcy5fcGFydHMuZXNjYXBlUXVlcnlTcGFjZSA9ICEhdjtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gVVJJO1xufSkpO1xuIiwiU3RlZWRvcy51cmkgPSBuZXcgVVJJKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcblxuXy5leHRlbmQgQWNjb3VudHMsXG5cdHVwZGF0ZVBob25lOiAobnVtYmVyLGNhbGxiYWNrKS0+XG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRNZXRlb3IuY2FsbCAndXBkYXRlUGhvbmUnLCB7IG51bWJlciB9XG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRNZXRlb3IuY2FsbCAndXBkYXRlUGhvbmUnLCB7IG51bWJlciB9LCBjYWxsYmFjayxcblx0ZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiAoZXhwaXJlZERheXMsY2FsbGJhY2spLT5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdE1ldGVvci5jYWxsICdkaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXMnLCBleHBpcmVkRGF5c1xuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0TWV0ZW9yLmNhbGwgJ2Rpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cycsIGV4cGlyZWREYXlzLCBjYWxsYmFja1xuXHRnZXRQaG9uZU51bWJlcjogKGlzSW5jbHVkZVByZWZpeCwgdXNlcikgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHBob25lID0gQWNjb3VudHMudXNlcigpPy5waG9uZVxuXHRcdGVsc2Vcblx0XHRcdGlmIHR5cGVvZiB1c2VyID09IFwic3RyaW5nXCJcblx0XHRcdFx0cGhvbmUgPSBkYi51c2Vycy5maW5kT25lKHVzZXIpPy5waG9uZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRwaG9uZSA9IHVzZXI/LnBob25lXG5cdFx0dW5sZXNzIHBob25lXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHRcdGlmIGlzSW5jbHVkZVByZWZpeFxuXHRcdFx0cmV0dXJuIHBob25lLm51bWJlclxuXHRcdGVsc2Vcblx0XHRcdHVubGVzcyBwaG9uZS5tb2JpbGVcblx0XHRcdFx0IyDlpoLmnpzmlbDmja7lupPkuK3kuI3lrZjlnKhtb2JpbGXlgLzvvIzliJnnlKjnrpfms5XorqHnrpflh7rkuI3luKbliY3nvIDnmoTmiYvmnLrlj7dcblx0XHRcdFx0cmV0dXJuIEUxNjQuZ2V0UGhvbmVOdW1iZXJXaXRob3V0UHJlZml4IHBob25lLm51bWJlclxuXHRcdFx0cmV0dXJuIHBob25lLm1vYmlsZVxuXHRnZXRQaG9uZVByZWZpeDogKHVzZXIpIC0+XG5cdFx0IyDov5Tlm57lvZPliY3nlKjmiLfmiYvmnLrlj7fliY3nvIDvvIzlpoLmnpzmib7kuI3liLDliJnov5Tlm57pu5jorqTnmoRcIis4NlwiXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50IGFuZCAhdXNlclxuXHRcdFx0cGhvbmUgPSBBY2NvdW50cy51c2VyKCk/LnBob25lXG5cdFx0ZWxzZVxuXHRcdFx0aWYgdHlwZW9mIHVzZXIgPT0gXCJzdHJpbmdcIlxuXHRcdFx0XHRwaG9uZSA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcik/LnBob25lXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHBob25lID0gdXNlcj8ucGhvbmVcblx0XHR1bmxlc3MgcGhvbmVcblx0XHRcdHJldHVybiBcIis4NlwiXG5cdFx0aWYgcGhvbmUubW9iaWxlXG5cdFx0XHRwcmVmaXggPSBwaG9uZS5udW1iZXIucmVwbGFjZSBwaG9uZS5tb2JpbGUsIFwiXCJcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenOaVsOaNruW6k+S4reS4jeWtmOWcqG1vYmlsZeWAvO+8jOWImeeUqOeul+azleiuoeeul+WHuuaJi+acuuWPt+WJjee8gFxuXHRcdFx0cHJlZml4ID0gRTE2NC5nZXRQaG9uZVByZWZpeChwaG9uZS5udW1iZXIpXG5cdFx0XHRpZiBwcmVmaXhcblx0XHRcdFx0cHJlZml4ID0gXCIrI3twcmVmaXh9XCJcblx0XHRyZXR1cm4gaWYgcHJlZml4IHRoZW4gcHJlZml4IGVsc2UgXCIrODZcIlxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuIyBcdE1ldGVvci5zdGFydHVwIC0+XG4jIFx0XHRUcmFja2VyLmF1dG9ydW4gKGMpLT5cbiMgXHRcdFx0aWYgIU1ldGVvci51c2VySWQoKSBhbmQgIU1ldGVvci5sb2dnaW5nSW4oKVxuIyBcdFx0XHRcdGN1cnJlbnRQYXRoID0gRmxvd1JvdXRlci5jdXJyZW50KCkucGF0aFxuIyBcdFx0XHRcdGlmIGN1cnJlbnRQYXRoICE9IHVuZGVmaW5lZCBhbmQgIS9eXFwvc3RlZWRvc1xcYi8udGVzdChjdXJyZW50UGF0aClcbiMgXHRcdFx0XHRcdCMg5rKh5pyJ55m75b2V5LiU6Lev55Sx5LiN5LulL3N0ZWVkb3PlvIDlpLTliJnot7PovazliLDnmbvlvZXnlYzpnaJcbiMgXHRcdFx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXG4iLCJTdGVlZG9zLnVyaSA9IG5ldyBVUkkoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuXG5fLmV4dGVuZChBY2NvdW50cywge1xuICB1cGRhdGVQaG9uZTogZnVuY3Rpb24obnVtYmVyLCBjYWxsYmFjaykge1xuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIE1ldGVvci5jYWxsKCd1cGRhdGVQaG9uZScsIHtcbiAgICAgICAgbnVtYmVyOiBudW1iZXJcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVBob25lJywge1xuICAgICAgICBudW1iZXI6IG51bWJlclxuICAgICAgfSwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSxcbiAgZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiBmdW5jdGlvbihleHBpcmVkRGF5cywgY2FsbGJhY2spIHtcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBNZXRlb3IuY2FsbCgnZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzJywgZXhwaXJlZERheXMpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ2Rpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5cycsIGV4cGlyZWREYXlzLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LFxuICBnZXRQaG9uZU51bWJlcjogZnVuY3Rpb24oaXNJbmNsdWRlUHJlZml4LCB1c2VyKSB7XG4gICAgdmFyIHBob25lLCByZWYsIHJlZjE7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgcGhvbmUgPSAocmVmID0gQWNjb3VudHMudXNlcigpKSAhPSBudWxsID8gcmVmLnBob25lIDogdm9pZCAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHVzZXIgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcGhvbmUgPSAocmVmMSA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcikpICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGhvbmUgPSB1c2VyICE9IG51bGwgPyB1c2VyLnBob25lIDogdm9pZCAwO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXBob25lKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVByZWZpeCkge1xuICAgICAgcmV0dXJuIHBob25lLm51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFwaG9uZS5tb2JpbGUpIHtcbiAgICAgICAgcmV0dXJuIEUxNjQuZ2V0UGhvbmVOdW1iZXJXaXRob3V0UHJlZml4KHBob25lLm51bWJlcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGhvbmUubW9iaWxlO1xuICAgIH1cbiAgfSxcbiAgZ2V0UGhvbmVQcmVmaXg6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICB2YXIgcGhvbmUsIHByZWZpeCwgcmVmLCByZWYxO1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIXVzZXIpIHtcbiAgICAgIHBob25lID0gKHJlZiA9IEFjY291bnRzLnVzZXIoKSkgIT0gbnVsbCA/IHJlZi5waG9uZSA6IHZvaWQgMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB1c2VyID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHBob25lID0gKHJlZjEgPSBkYi51c2Vycy5maW5kT25lKHVzZXIpKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBob25lID0gdXNlciAhPSBudWxsID8gdXNlci5waG9uZSA6IHZvaWQgMDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFwaG9uZSkge1xuICAgICAgcmV0dXJuIFwiKzg2XCI7XG4gICAgfVxuICAgIGlmIChwaG9uZS5tb2JpbGUpIHtcbiAgICAgIHByZWZpeCA9IHBob25lLm51bWJlci5yZXBsYWNlKHBob25lLm1vYmlsZSwgXCJcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpeCA9IEUxNjQuZ2V0UGhvbmVQcmVmaXgocGhvbmUubnVtYmVyKTtcbiAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgcHJlZml4ID0gXCIrXCIgKyBwcmVmaXg7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcmVmaXgpIHtcbiAgICAgIHJldHVybiBwcmVmaXg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIis4NlwiO1xuICAgIH1cbiAgfVxufSk7XG4iLCJpZiBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmU/LmZvcmNlQWNjb3VudEJpbmRQaG9uZVxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRNZXRlb3IubWV0aG9kc1xuXHRcdFx0Y2hlY2tGb3JjZUJpbmRQaG9uZTogKHNwYWNlcykgLT5cblx0XHRcdFx0Y2hlY2sgc3BhY2VzLCBBcnJheVxuXHRcdFx0XHRzcGFjZV9zZXR0aW5ncyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmQoe2tleTpcImNvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzXCIsc3BhY2U6IHskaW46IHNwYWNlc319KVxuXHRcdFx0XHRub0ZvcmNlVXNlcnMgPSBbXVxuXHRcdFx0XHRzcGFjZV9zZXR0aW5ncy5mb3JFYWNoIChuLGkpLT5cblx0XHRcdFx0XHRpZiBuLnZhbHVlcz8ubGVuZ3RoXG5cdFx0XHRcdFx0XHRub0ZvcmNlVXNlcnMgPSBfLnVuaW9uIG5vRm9yY2VVc2Vycywgbi52YWx1ZXNcblx0XHRcdFx0aWYgbm9Gb3JjZVVzZXJzIGFuZCBub0ZvcmNlVXNlcnMubGVuZ3RoXG5cdFx0XHRcdFx0cmV0dXJuIGlmIG5vRm9yY2VVc2Vycy5pbmRleE9mKE1ldGVvci51c2VySWQoKSkgPiAtMSB0aGVuIGZhbHNlIGVsc2UgdHJ1ZVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZSA9IGZhbHNlXG5cdFx0Y2hlY2tQaG9uZVN0YXRlRXhwaXJlZCA9IC0+XG5cdFx0XHQjIOi/h+acn+WQjuaKiue7keWumueKtuaAgei/mOWOn+S4uuacque7keWumlxuXHRcdFx0ZXhwaXJlZERheXMgPSBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmU/LmV4cGlyZWREYXlzXG5cdFx0XHRpZiBleHBpcmVkRGF5c1xuXHRcdFx0XHRBY2NvdW50cy5kaXNhYmxlUGhvbmVXaXRob3V0RXhwaXJlZERheXMoZXhwaXJlZERheXMpXG5cdFx0XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0QWNjb3VudHMub25Mb2dpbiAoKS0+XG5cdFx0XHRcdGlmIEFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpXG5cdFx0XHRcdFx0Y2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdE1ldGVvci5zZXRUaW1lb3V0ICgpLT5cblx0XHRcdFx0XHRpZiBBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxuXHRcdFx0XHRcdFx0Y2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCgpLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJfaWRcIilcblx0XHRcdFx0XHR1bmxlc3Mgc3BhY2VzLmxlbmd0aFxuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0TWV0ZW9yLmNhbGwgXCJjaGVja0ZvcmNlQmluZFBob25lXCIsIHNwYWNlcywgKGVycm9yLCByZXN1bHRzKS0+XG5cdFx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IodChlcnJvci5yZWFzb24pKVxuXHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSByZXN1bHRzXG5cdFx0XHRcdFx0XHRpZiBTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgYW5kICFBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxuXHRcdFx0XHRcdFx0XHQjIOacqumqjOivgeaJi+acuuWPt+aXtu+8jOW8uuihjOi3s+i9rOWIsOaJi+acuuWPt+e7keWumueVjOmdolxuXHRcdFx0XHRcdFx0XHRzZXR1cFVybCA9IFwiL2FjY291bnRzL3NldHVwL3Bob25lXCJcblx0XHRcdFx0XHRcdFx0U3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gZmFsc2Vcblx0XHRcdFx0XHRcdFx0IyDmmoLml7blhYjlgZzmjonmiYvmnLrlj7flvLrliLbnu5Hlrprlip/og73vvIznrYnlm73pmYXljJbnm7jlhbPlip/og73lrozmiJDlkI7lho3mlL7lvIBcblx0XHRcdFx0XHRcdFx0IyBxaGTopoHmsYLmlL7lvIDvvIxDTuWPkeeJiOacrOWJjeimgeaKiuWbvemZheWMluebuOWFs+WKn+iDveWujOaIkO+8jOWQpuWImUNO5Y+R54mI5pys5YmN6L+Y5piv6KaB5rOo6YeK5o6J6K+l5Yqf6IO9XG5cdFx0XHRcdFx0XHRcdEZsb3dSb3V0ZXIuZ28gc2V0dXBVcmxcblx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cblx0XHRcdFx0XHRcdHJvdXRlclBhdGggPSBGbG93Um91dGVyLmN1cnJlbnQoKT8ucGF0aFxuXHRcdFx0XHRcdFx0IyDlvZPliY3ot6/nlLHmnKzouqvlsLHlnKjmiYvmnLrpqozor4Hot6/nlLHkuK3liJnkuI3pnIDopoHmj5DphpLmiYvmnLrlj7fmnKrnu5Hlrppcblx0XHRcdFx0XHRcdGlmIC9eXFwvYWNjb3VudHNcXC9zZXR1cFxcL3Bob25lXFxiLy50ZXN0IHJvdXRlclBhdGhcblx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHQjIOeZu+W9leebuOWFs+i3r+eUseS4jemcgOimgeaPkOmGkuaJi+acuuWPt+acque7keWumlxuXHRcdFx0XHRcdFx0aWYgL15cXC9zdGVlZG9zXFwvLy50ZXN0IHJvdXRlclBhdGhcblx0XHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0XHRpZiBBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKVxuXHRcdFx0XHRcdFx0XHRjaGVja1Bob25lU3RhdGVFeHBpcmVkKClcblx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0c2V0dXBVcmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiYWNjb3VudHMvc2V0dXAvcGhvbmVcIilcblx0XHRcdFx0XHRcdFx0dW5sZXNzIFN0ZWVkb3MuaXNGb3JjZUJpbmRQaG9uZVxuXHRcdFx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvcihudWxsLHQoXCJhY2NvdW50c19waG9uZV90b2FzdHJfYWxlcnRcIikse1xuXHRcdFx0XHRcdFx0XHRcdFx0Y2xvc2VCdXR0b246IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHR0aW1lT3V0OiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0ZXh0ZW5kZWRUaW1lT3V0OiAwLFxuXHRcdFx0XHRcdFx0XHRcdFx0b25jbGljazogLT5cblx0XHRcdFx0XHRcdFx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHNldHVwVXJsLCdzZXR1cF9waG9uZScpXG5cdFx0XHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0LCAyMDAiLCJ2YXIgY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCwgcmVmLCByZWYxLCByZWYyO1xuXG5pZiAoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnBob25lKSAhPSBudWxsID8gcmVmMi5mb3JjZUFjY291bnRCaW5kUGhvbmUgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgIGNoZWNrRm9yY2VCaW5kUGhvbmU6IGZ1bmN0aW9uKHNwYWNlcykge1xuICAgICAgICB2YXIgbm9Gb3JjZVVzZXJzLCBzcGFjZV9zZXR0aW5ncztcbiAgICAgICAgY2hlY2soc3BhY2VzLCBBcnJheSk7XG4gICAgICAgIHNwYWNlX3NldHRpbmdzID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZCh7XG4gICAgICAgICAga2V5OiBcImNvbnRhY3RzX25vX2ZvcmNlX3Bob25lX3VzZXJzXCIsXG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbm9Gb3JjZVVzZXJzID0gW107XG4gICAgICAgIHNwYWNlX3NldHRpbmdzLmZvckVhY2goZnVuY3Rpb24obiwgaSkge1xuICAgICAgICAgIHZhciByZWYzO1xuICAgICAgICAgIGlmICgocmVmMyA9IG4udmFsdWVzKSAhPSBudWxsID8gcmVmMy5sZW5ndGggOiB2b2lkIDApIHtcbiAgICAgICAgICAgIHJldHVybiBub0ZvcmNlVXNlcnMgPSBfLnVuaW9uKG5vRm9yY2VVc2Vycywgbi52YWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChub0ZvcmNlVXNlcnMgJiYgbm9Gb3JjZVVzZXJzLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChub0ZvcmNlVXNlcnMuaW5kZXhPZihNZXRlb3IudXNlcklkKCkpID4gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgPSBmYWxzZTtcbiAgICBjaGVja1Bob25lU3RhdGVFeHBpcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXhwaXJlZERheXMsIHJlZjMsIHJlZjQsIHJlZjU7XG4gICAgICBleHBpcmVkRGF5cyA9IChyZWYzID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjQgPSByZWYzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjUgPSByZWY0LnBob25lKSAhPSBudWxsID8gcmVmNS5leHBpcmVkRGF5cyA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChleHBpcmVkRGF5cykge1xuICAgICAgICByZXR1cm4gQWNjb3VudHMuZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzKGV4cGlyZWREYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmICghU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoQWNjb3VudHMuaXNQaG9uZVZlcmlmaWVkKCkpIHtcbiAgICAgICAgICBjaGVja1Bob25lU3RhdGVFeHBpcmVkKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNZXRlb3Iuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc3BhY2VzO1xuICAgICAgICAgIGlmIChBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKSkge1xuICAgICAgICAgICAgY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCgpLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJfaWRcIik7XG4gICAgICAgICAgaWYgKCFzcGFjZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcImNoZWNrRm9yY2VCaW5kUGhvbmVcIiwgc3BhY2VzLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0cykge1xuICAgICAgICAgICAgdmFyIHJlZjMsIHJvdXRlclBhdGgsIHNldHVwVXJsO1xuICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcih0KGVycm9yLnJlYXNvbikpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gcmVzdWx0cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChTdGVlZG9zLmlzRm9yY2VCaW5kUGhvbmUgJiYgIUFjY291bnRzLmlzUGhvbmVWZXJpZmllZCgpKSB7XG4gICAgICAgICAgICAgIHNldHVwVXJsID0gXCIvYWNjb3VudHMvc2V0dXAvcGhvbmVcIjtcbiAgICAgICAgICAgICAgU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIEZsb3dSb3V0ZXIuZ28oc2V0dXBVcmwpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByb3V0ZXJQYXRoID0gKHJlZjMgPSBGbG93Um91dGVyLmN1cnJlbnQoKSkgIT0gbnVsbCA/IHJlZjMucGF0aCA6IHZvaWQgMDtcbiAgICAgICAgICAgIGlmICgvXlxcL2FjY291bnRzXFwvc2V0dXBcXC9waG9uZVxcYi8udGVzdChyb3V0ZXJQYXRoKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoL15cXC9zdGVlZG9zXFwvLy50ZXN0KHJvdXRlclBhdGgpKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChBY2NvdW50cy5pc1Bob25lVmVyaWZpZWQoKSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2hlY2tQaG9uZVN0YXRlRXhwaXJlZCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2V0dXBVcmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKFwiYWNjb3VudHMvc2V0dXAvcGhvbmVcIik7XG4gICAgICAgICAgICAgIGlmICghU3RlZWRvcy5pc0ZvcmNlQmluZFBob25lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihudWxsLCB0KFwiYWNjb3VudHNfcGhvbmVfdG9hc3RyX2FsZXJ0XCIpLCB7XG4gICAgICAgICAgICAgICAgICBjbG9zZUJ1dHRvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgIHRpbWVPdXQ6IDAsXG4gICAgICAgICAgICAgICAgICBleHRlbmRlZFRpbWVPdXQ6IDAsXG4gICAgICAgICAgICAgICAgICBvbmNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyhzZXR1cFVybCwgJ3NldHVwX3Bob25lJyk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgMjAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIiwiIyBPcHRpb25zXG5zZW5kVmVyaWZpY2F0aW9uRW1haWwgPSB0cnVlXG5pZiAhcHJvY2Vzcy5lbnYuTUFJTF9VUkwgfHwgISBQYWNrYWdlW1wiZW1haWxcIl1cbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZmFsc2VcbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVxuICBkZWZhdWx0TGF5b3V0OiAnbG9naW5MYXlvdXQnLFxuICBkZWZhdWx0TGF5b3V0UmVnaW9uczogXG4gICAgbmF2OiAnbG9naW5OYXYnLFxuICBkZWZhdWx0Q29udGVudFJlZ2lvbjogJ21haW4nLFxuXG4gIHNob3dGb3Jnb3RQYXNzd29yZExpbms6IHRydWUsXG4gIG92ZXJyaWRlTG9naW5FcnJvcnM6IHRydWUsXG4gIGVuYWJsZVBhc3N3b3JkQ2hhbmdlOiB0cnVlLFxuXG4gIHNlbmRWZXJpZmljYXRpb25FbWFpbDogc2VuZFZlcmlmaWNhdGlvbkVtYWlsLFxuICAjIGVuZm9yY2VFbWFpbFZlcmlmaWNhdGlvbjogdHJ1ZSxcbiAgIyBjb25maXJtUGFzc3dvcmQ6IHRydWUsXG4gICMgY29udGludW91c1ZhbGlkYXRpb246IGZhbHNlLFxuICAjIGRpc3BsYXlGb3JtTGFiZWxzOiB0cnVlLFxuICAjIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbjogdHJ1ZSxcbiAgIyBmb3JtVmFsaWRhdGlvbkZlZWRiYWNrOiB0cnVlLFxuICBob21lUm91dGVQYXRoOiAnLycsXG4gICMgc2hvd0FkZFJlbW92ZVNlcnZpY2VzOiBmYWxzZSxcbiAgIyBzaG93UGxhY2Vob2xkZXJzOiB0cnVlLFxuXG4gIG5lZ2F0aXZlVmFsaWRhdGlvbjogdHJ1ZSxcbiAgcG9zaXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuICBuZWdhdGl2ZUZlZWRiYWNrOiBmYWxzZSxcbiAgcG9zaXRpdmVGZWVkYmFjazogdHJ1ZSxcbiAgc2hvd0xhYmVsczogZmFsc2UsXG5cbiAgIyBQcml2YWN5IFBvbGljeSBhbmQgVGVybXMgb2YgVXNlXG4gICMgcHJpdmFjeVVybDogJ3ByaXZhY3knLFxuICAjIHRlcm1zVXJsOiAndGVybXMtb2YtdXNlJyxcblxuICBwcmVTaWduVXBIb29rOiAocGFzc3dvcmQsIG9wdGlvbnMpIC0+XG4gICAgb3B0aW9ucy5wcm9maWxlLmxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG5cblxuXG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlICdjaGFuZ2VQd2QnLFxuICBwYXRoOiAnL3N0ZWVkb3MvY2hhbmdlLXBhc3N3b3JkJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ2ZvcmdvdFB3ZCcsXG4gIHBhdGg6ICcvc3RlZWRvcy9mb3Jnb3QtcGFzc3dvcmQnXG4gIHJlZGlyZWN0OiAnL3N0ZWVkb3MvZm9yZ290LXBhc3N3b3JkLXRva2VuJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3Jlc2V0UHdkJyxcbiAgcGF0aDogJy9zdGVlZG9zL3Jlc2V0LXBhc3N3b3JkJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3NpZ25JbicsXG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLWluJ1xuICByZWRpcmVjdDogKCktPlxuICAgIHBhdGggPSBGbG93Um91dGVyLmN1cnJlbnQoKS5wYXRoXG4gICAgaWYgL15cXC9vYXV0aDJcXGIvLnRlc3QocGF0aClcbiAgICAgIGxvY2F0aW9uLnJlbG9hZCgpXG4gICAgZWxzZVxuICAgICAgRmxvd1JvdXRlci5nbyhGbG93Um91dGVyLmN1cnJlbnQoKS5xdWVyeVBhcmFtcz8ucmVkaXJlY3QgfHwgXCIvXCIpO1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3NpZ25VcCcsXG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLXVwJ1xuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ3ZlcmlmeUVtYWlsJyxcbiAgcGF0aDogJy9zdGVlZG9zL3ZlcmlmeS1lbWFpbCdcbiAgcmVkaXJlY3Q6ICgpLT5cbiAgICAjIOW9k+S4lOS7heW9k+eUqOaIt+WPquacieS4gOS4qumCrueuseaXtizorr7nva7kuLvopoHpgq7nrrFcbiAgICBlbWFpbHMgPSBNZXRlb3IudXNlcigpPy5lbWFpbHNcbiAgICBpZiBlbWFpbHMgYW5kIGVtYWlscy5sZW5ndGggPT0gMVxuICAgICAgZW1haWwgPSBlbWFpbHNbMF0uYWRkcmVzc1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhcImxvYWRpbmdcIilcbiAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWxcIiwgZW1haWwsIChlcnJvciwgcmVzdWx0KS0+XG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKVxuICAgICAgICBpZiByZXN1bHQ/LmVycm9yXG4gICAgICAgICAgdG9hc3RyLmVycm9yIHQocmVzdWx0Lm1lc3NhZ2UpXG4gICAgRmxvd1JvdXRlci5nbyBcIi9cIlxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUgJ2Vucm9sbEFjY291bnQnLFxuICBwYXRoOiAnL3N0ZWVkb3MvZW5yb2xsLWFjY291bnQnXG5cbiMgYWRkIGZpZWxkcyB3aXRoaW4gc2lnbi11cCBmb3JtXG5wd2RGaWVsZCA9IEFjY291bnRzVGVtcGxhdGVzLnJlbW92ZUZpZWxkKCdwYXNzd29yZCcpO1xuQWNjb3VudHNUZW1wbGF0ZXMucmVtb3ZlRmllbGQoJ2VtYWlsJyk7XG5BY2NvdW50c1RlbXBsYXRlcy5hZGRGaWVsZHMoW1xuICB7XG4gICAgX2lkOiAnY29tcGFueScsXG4gICAgdHlwZTogJ3RleHQnXG4gIH0sXG4gIHtcbiAgICBfaWQ6ICduYW1lJyxcbiAgICB0eXBlOiAndGV4dCdcbiAgfSxcbiAge1xuICAgIF9pZDogJ2VtYWlsJyxcbiAgICB0eXBlOiAnZW1haWwnLFxuICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgZGlzcGxheU5hbWU6IFwiZW1haWxcIixcbiAgICByZTogLy4rQCguKyl7Mix9XFwuKC4rKXsyLH0vLFxuICAgIGVyclN0cjogJ0ludmFsaWQgZW1haWwnLFxuICAgIHBsYWNlaG9sZGVyOiB7XG4gICAgICBmb3Jnb3RQd2Q6XCJlbWFpbF9pbnB1dF9wbGFjZWhvbGRlclwiXG4gICAgfVxuICB9LFxuICB7XG4gICAgX2lkOiAndXNlcm5hbWVfYW5kX2VtYWlsJyxcbiAgICB0eXBlOiAndGV4dCcsXG4gICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgZGlzcGxheU5hbWU6IFwiTG9naW5cIlxuICB9LFxuICB7XG4gICAgX2lkOiBcInVzZXJuYW1lXCIsXG4gICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgZGlzcGxheU5hbWU6IFwidXNlcm5hbWVcIixcbiAgICByZXF1aXJlZDogZmFsc2UsI+S8geS4muazqOWGjOeVjOmdouayoeacieivpeWtl+aute+8jOaJgOS7peaUueS4uumdnuW/heWhq1xuICAgIG1pbkxlbmd0aDogNlxuICB9LFxuICBwd2RGaWVsZFxuXSk7XG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyIGFuZCBBY2NvdW50cy5lbWFpbFRlbXBsYXRlc1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5zaXRlTmFtZSA9IFwiU3RlZWRvc1wiO1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tID0gTWV0ZW9yLnNldHRpbmdzLmVtYWlsPy5mcm9tO1xuXG5cbmlmIE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hY2NvdW50cz8uZGlzYWJsZUFjY291bnRSZWdpc3RyYXRpb25cbiAgQWNjb3VudHNUZW1wbGF0ZXMub3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24gPSB0cnVlXG4iLCJ2YXIgcHdkRmllbGQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgc2VuZFZlcmlmaWNhdGlvbkVtYWlsO1xuXG5zZW5kVmVyaWZpY2F0aW9uRW1haWwgPSB0cnVlO1xuXG5pZiAoIXByb2Nlc3MuZW52Lk1BSUxfVVJMIHx8ICFQYWNrYWdlW1wiZW1haWxcIl0pIHtcbiAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsID0gZmFsc2U7XG59XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZSh7XG4gIGRlZmF1bHRMYXlvdXQ6ICdsb2dpbkxheW91dCcsXG4gIGRlZmF1bHRMYXlvdXRSZWdpb25zOiB7XG4gICAgbmF2OiAnbG9naW5OYXYnXG4gIH0sXG4gIGRlZmF1bHRDb250ZW50UmVnaW9uOiAnbWFpbicsXG4gIHNob3dGb3Jnb3RQYXNzd29yZExpbms6IHRydWUsXG4gIG92ZXJyaWRlTG9naW5FcnJvcnM6IHRydWUsXG4gIGVuYWJsZVBhc3N3b3JkQ2hhbmdlOiB0cnVlLFxuICBzZW5kVmVyaWZpY2F0aW9uRW1haWw6IHNlbmRWZXJpZmljYXRpb25FbWFpbCxcbiAgaG9tZVJvdXRlUGF0aDogJy8nLFxuICBuZWdhdGl2ZVZhbGlkYXRpb246IHRydWUsXG4gIHBvc2l0aXZlVmFsaWRhdGlvbjogdHJ1ZSxcbiAgbmVnYXRpdmVGZWVkYmFjazogZmFsc2UsXG4gIHBvc2l0aXZlRmVlZGJhY2s6IHRydWUsXG4gIHNob3dMYWJlbHM6IGZhbHNlLFxuICBwcmVTaWduVXBIb29rOiBmdW5jdGlvbihwYXNzd29yZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBvcHRpb25zLnByb2ZpbGUubG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgfVxufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdjaGFuZ2VQd2QnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9jaGFuZ2UtcGFzc3dvcmQnXG59KTtcblxuQWNjb3VudHNUZW1wbGF0ZXMuY29uZmlndXJlUm91dGUoJ2ZvcmdvdFB3ZCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL2ZvcmdvdC1wYXNzd29yZCcsXG4gIHJlZGlyZWN0OiAnL3N0ZWVkb3MvZm9yZ290LXBhc3N3b3JkLXRva2VuJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdyZXNldFB3ZCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL3Jlc2V0LXBhc3N3b3JkJ1xufSk7XG5cbkFjY291bnRzVGVtcGxhdGVzLmNvbmZpZ3VyZVJvdXRlKCdzaWduSW4nLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy9zaWduLWluJyxcbiAgcmVkaXJlY3Q6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXRoLCByZWY7XG4gICAgcGF0aCA9IEZsb3dSb3V0ZXIuY3VycmVudCgpLnBhdGg7XG4gICAgaWYgKC9eXFwvb2F1dGgyXFxiLy50ZXN0KHBhdGgpKSB7XG4gICAgICByZXR1cm4gbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBGbG93Um91dGVyLmdvKCgocmVmID0gRmxvd1JvdXRlci5jdXJyZW50KCkucXVlcnlQYXJhbXMpICE9IG51bGwgPyByZWYucmVkaXJlY3QgOiB2b2lkIDApIHx8IFwiL1wiKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgnc2lnblVwJywge1xuICBwYXRoOiAnL3N0ZWVkb3Mvc2lnbi11cCdcbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgndmVyaWZ5RW1haWwnLCB7XG4gIHBhdGg6ICcvc3RlZWRvcy92ZXJpZnktZW1haWwnLFxuICByZWRpcmVjdDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGVtYWlsLCBlbWFpbHMsIHJlZjtcbiAgICBlbWFpbHMgPSAocmVmID0gTWV0ZW9yLnVzZXIoKSkgIT0gbnVsbCA/IHJlZi5lbWFpbHMgOiB2b2lkIDA7XG4gICAgaWYgKGVtYWlscyAmJiBlbWFpbHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBlbWFpbCA9IGVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgJChkb2N1bWVudC5ib2R5KS5hZGRDbGFzcyhcImxvYWRpbmdcIik7XG4gICAgICBNZXRlb3IuY2FsbChcInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsXCIsIGVtYWlsLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgICQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KHJlc3VsdC5tZXNzYWdlKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gIH1cbn0pO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5jb25maWd1cmVSb3V0ZSgnZW5yb2xsQWNjb3VudCcsIHtcbiAgcGF0aDogJy9zdGVlZG9zL2Vucm9sbC1hY2NvdW50J1xufSk7XG5cbnB3ZEZpZWxkID0gQWNjb3VudHNUZW1wbGF0ZXMucmVtb3ZlRmllbGQoJ3Bhc3N3b3JkJyk7XG5cbkFjY291bnRzVGVtcGxhdGVzLnJlbW92ZUZpZWxkKCdlbWFpbCcpO1xuXG5BY2NvdW50c1RlbXBsYXRlcy5hZGRGaWVsZHMoW1xuICB7XG4gICAgX2lkOiAnY29tcGFueScsXG4gICAgdHlwZTogJ3RleHQnXG4gIH0sIHtcbiAgICBfaWQ6ICduYW1lJyxcbiAgICB0eXBlOiAndGV4dCdcbiAgfSwge1xuICAgIF9pZDogJ2VtYWlsJyxcbiAgICB0eXBlOiAnZW1haWwnLFxuICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgIGRpc3BsYXlOYW1lOiBcImVtYWlsXCIsXG4gICAgcmU6IC8uK0AoLispezIsfVxcLiguKyl7Mix9LyxcbiAgICBlcnJTdHI6ICdJbnZhbGlkIGVtYWlsJyxcbiAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgZm9yZ290UHdkOiBcImVtYWlsX2lucHV0X3BsYWNlaG9sZGVyXCJcbiAgICB9XG4gIH0sIHtcbiAgICBfaWQ6ICd1c2VybmFtZV9hbmRfZW1haWwnLFxuICAgIHR5cGU6ICd0ZXh0JyxcbiAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICBkaXNwbGF5TmFtZTogXCJMb2dpblwiXG4gIH0sIHtcbiAgICBfaWQ6IFwidXNlcm5hbWVcIixcbiAgICB0eXBlOiBcInRleHRcIixcbiAgICBkaXNwbGF5TmFtZTogXCJ1c2VybmFtZVwiLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBtaW5MZW5ndGg6IDZcbiAgfSwgcHdkRmllbGRcbl0pO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyICYmIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzKSB7XG4gIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLnNpdGVOYW1lID0gXCJTdGVlZG9zXCI7XG4gIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb20gPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzLmVtYWlsKSAhPSBudWxsID8gcmVmLmZyb20gOiB2b2lkIDA7XG59XG5cbmlmICgocmVmMSA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYyID0gcmVmMVtcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5hY2NvdW50cykgIT0gbnVsbCA/IHJlZjMuZGlzYWJsZUFjY291bnRSZWdpc3RyYXRpb24gOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgQWNjb3VudHNUZW1wbGF0ZXMub3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24gPSB0cnVlO1xufVxuIiwiLy8vIEJDUllQVFxudmFyIGJjcnlwdCA9IE5wbU1vZHVsZUJjcnlwdDtcbnZhciBiY3J5cHRIYXNoID0gTWV0ZW9yLndyYXBBc3luYyhiY3J5cHQuaGFzaCk7XG52YXIgYmNyeXB0Q29tcGFyZSA9IE1ldGVvci53cmFwQXN5bmMoYmNyeXB0LmNvbXBhcmUpO1xuXG52YXIgcGFzc3dvcmRWYWxpZGF0b3IgPSBNYXRjaC5PbmVPZihcbiAgU3RyaW5nLFxuICB7IGRpZ2VzdDogU3RyaW5nLCBhbGdvcml0aG06IFN0cmluZyB9XG4pO1xuXG52YXIgY2hlY2tQYXNzd29yZCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkO1xuXG4vLyBHaXZlbiBhICdwYXNzd29yZCcgZnJvbSB0aGUgY2xpZW50LCBleHRyYWN0IHRoZSBzdHJpbmcgdGhhdCB3ZSBzaG91bGRcbi8vIGJjcnlwdC4gJ3Bhc3N3b3JkJyBjYW4gYmUgb25lIG9mOlxuLy8gIC0gU3RyaW5nICh0aGUgcGxhaW50ZXh0IHBhc3N3b3JkKVxuLy8gIC0gT2JqZWN0IHdpdGggJ2RpZ2VzdCcgYW5kICdhbGdvcml0aG0nIGtleXMuICdhbGdvcml0aG0nIG11c3QgYmUgXCJzaGEtMjU2XCIuXG4vL1xudmFyIGdldFBhc3N3b3JkU3RyaW5nID0gZnVuY3Rpb24gKHBhc3N3b3JkKSB7XG4gIGlmICh0eXBlb2YgcGFzc3dvcmQgPT09IFwic3RyaW5nXCIpIHtcbiAgICBwYXNzd29yZCA9IFNIQTI1NihwYXNzd29yZCk7XG4gIH0gZWxzZSB7IC8vICdwYXNzd29yZCcgaXMgYW4gb2JqZWN0XG4gICAgaWYgKHBhc3N3b3JkLmFsZ29yaXRobSAhPT0gXCJzaGEtMjU2XCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFzc3dvcmQgaGFzaCBhbGdvcml0aG0uIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICBcIk9ubHkgJ3NoYS0yNTYnIGlzIGFsbG93ZWQuXCIpO1xuICAgIH1cbiAgICBwYXNzd29yZCA9IHBhc3N3b3JkLmRpZ2VzdDtcbiAgfVxuICByZXR1cm4gcGFzc3dvcmQ7XG59O1xuXG4vLyBVc2UgYmNyeXB0IHRvIGhhc2ggdGhlIHBhc3N3b3JkIGZvciBzdG9yYWdlIGluIHRoZSBkYXRhYmFzZS5cbi8vIGBwYXNzd29yZGAgY2FuIGJlIGEgc3RyaW5nIChpbiB3aGljaCBjYXNlIGl0IHdpbGwgYmUgcnVuIHRocm91Z2hcbi8vIFNIQTI1NiBiZWZvcmUgYmNyeXB0KSBvciBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGBkaWdlc3RgIGFuZFxuLy8gYGFsZ29yaXRobWAgKGluIHdoaWNoIGNhc2Ugd2UgYmNyeXB0IGBwYXNzd29yZC5kaWdlc3RgKS5cbi8vXG52YXIgaGFzaFBhc3N3b3JkID0gZnVuY3Rpb24gKHBhc3N3b3JkKSB7XG4gIHBhc3N3b3JkID0gZ2V0UGFzc3dvcmRTdHJpbmcocGFzc3dvcmQpO1xuICByZXR1cm4gYmNyeXB0SGFzaChwYXNzd29yZCwgQWNjb3VudHMuX2JjcnlwdFJvdW5kcyk7XG59O1xuXG4vLy9cbi8vLyBFUlJPUiBIQU5ETEVSXG4vLy9cbnZhciBoYW5kbGVFcnJvciA9IGZ1bmN0aW9uKG1zZywgdGhyb3dFcnJvcikge1xuICBpZih0aHJvd0Vycm9yID09PSB1bmRlZmluZWQpe1xuICAgIHRocm93RXJyb3IgPSB0cnVlO1xuICB9XG4gIHZhciBlcnJvciA9IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgNDAzLFxuICAgIEFjY291bnRzLl9vcHRpb25zLmFtYmlndW91c0Vycm9yTWVzc2FnZXNcbiAgICAgID8gXCJTb21ldGhpbmcgd2VudCB3cm9uZy4gUGxlYXNlIGNoZWNrIHlvdXIgY3JlZGVudGlhbHMuXCJcbiAgICAgIDogbXNnXG4gICk7XG4gIGlmICh0aHJvd0Vycm9yKSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufTtcblxuLy8gR2VuZXJhdGVzIHBlcm11dGF0aW9ucyBvZiBhbGwgY2FzZSB2YXJpYXRpb25zIG9mIGEgZ2l2ZW4gc3RyaW5nLlxudmFyIGdlbmVyYXRlQ2FzZVBlcm11dGF0aW9uc0ZvclN0cmluZyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgdmFyIHBlcm11dGF0aW9ucyA9IFsnJ107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGNoID0gc3RyaW5nLmNoYXJBdChpKTtcbiAgICBwZXJtdXRhdGlvbnMgPSBfLmZsYXR0ZW4oXy5tYXAocGVybXV0YXRpb25zLCBmdW5jdGlvbiAocHJlZml4KSB7XG4gICAgICB2YXIgbG93ZXJDYXNlQ2hhciA9IGNoLnRvTG93ZXJDYXNlKCk7XG4gICAgICB2YXIgdXBwZXJDYXNlQ2hhciA9IGNoLnRvVXBwZXJDYXNlKCk7XG4gICAgICAvLyBEb24ndCBhZGQgdW5uZWNjZXNhcnkgcGVybXV0YXRpb25zIHdoZW4gY2ggaXMgbm90IGEgbGV0dGVyXG4gICAgICBpZiAobG93ZXJDYXNlQ2hhciA9PT0gdXBwZXJDYXNlQ2hhcikge1xuICAgICAgICByZXR1cm4gW3ByZWZpeCArIGNoXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbcHJlZml4ICsgbG93ZXJDYXNlQ2hhciwgcHJlZml4ICsgdXBwZXJDYXNlQ2hhcl07XG4gICAgICB9XG4gICAgfSkpO1xuICB9XG4gIHJldHVybiBwZXJtdXRhdGlvbnM7XG59O1xuXG4vLyBHZW5lcmF0ZXMgYSBNb25nb0RCIHNlbGVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcGVyZm9ybSBhIGZhc3QgY2FzZVxuLy8gaW5zZW5zaXRpdmUgbG9va3VwIGZvciB0aGUgZ2l2ZW4gZmllbGROYW1lIGFuZCBzdHJpbmcuIFNpbmNlIE1vbmdvREIgZG9lc1xuLy8gbm90IHN1cHBvcnQgY2FzZSBpbnNlbnNpdGl2ZSBpbmRleGVzLCBhbmQgY2FzZSBpbnNlbnNpdGl2ZSByZWdleCBxdWVyaWVzXG4vLyBhcmUgc2xvdywgd2UgY29uc3RydWN0IGEgc2V0IG9mIHByZWZpeCBzZWxlY3RvcnMgZm9yIGFsbCBwZXJtdXRhdGlvbnMgb2Zcbi8vIHRoZSBmaXJzdCA0IGNoYXJhY3RlcnMgb3Vyc2VsdmVzLiBXZSBmaXJzdCBhdHRlbXB0IHRvIG1hdGNoaW5nIGFnYWluc3Rcbi8vIHRoZXNlLCBhbmQgYmVjYXVzZSAncHJlZml4IGV4cHJlc3Npb24nIHJlZ2V4IHF1ZXJpZXMgZG8gdXNlIGluZGV4ZXMgKHNlZVxuLy8gaHR0cDovL2RvY3MubW9uZ29kYi5vcmcvdjIuNi9yZWZlcmVuY2Uvb3BlcmF0b3IvcXVlcnkvcmVnZXgvI2luZGV4LXVzZSksXG4vLyB0aGlzIGhhcyBiZWVuIGZvdW5kIHRvIGdyZWF0bHkgaW1wcm92ZSBwZXJmb3JtYW5jZSAoZnJvbSAxMjAwbXMgdG8gNW1zIGluIGFcbi8vIHRlc3Qgd2l0aCAxLjAwMC4wMDAgdXNlcnMpLlxudmFyIHNlbGVjdG9yRm9yRmFzdENhc2VJbnNlbnNpdGl2ZUxvb2t1cCA9IGZ1bmN0aW9uIChmaWVsZE5hbWUsIHN0cmluZykge1xuICAvLyBQZXJmb3JtYW5jZSBzZWVtcyB0byBpbXByb3ZlIHVwIHRvIDQgcHJlZml4IGNoYXJhY3RlcnNcbiAgdmFyIHByZWZpeCA9IHN0cmluZy5zdWJzdHJpbmcoMCwgTWF0aC5taW4oc3RyaW5nLmxlbmd0aCwgNCkpO1xuICB2YXIgb3JDbGF1c2UgPSBfLm1hcChnZW5lcmF0ZUNhc2VQZXJtdXRhdGlvbnNGb3JTdHJpbmcocHJlZml4KSxcbiAgICBmdW5jdGlvbiAocHJlZml4UGVybXV0YXRpb24pIHtcbiAgICAgIHZhciBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3JbZmllbGROYW1lXSA9XG4gICAgICAgIG5ldyBSZWdFeHAoJ14nICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAocHJlZml4UGVybXV0YXRpb24pKTtcbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9KTtcbiAgdmFyIGNhc2VJbnNlbnNpdGl2ZUNsYXVzZSA9IHt9O1xuICBjYXNlSW5zZW5zaXRpdmVDbGF1c2VbZmllbGROYW1lXSA9XG4gICAgbmV3IFJlZ0V4cCgnXicgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cChzdHJpbmcpICsgJyQnLCAnaScpXG4gIHJldHVybiB7JGFuZDogW3skb3I6IG9yQ2xhdXNlfSwgY2FzZUluc2Vuc2l0aXZlQ2xhdXNlXX07XG59XG5cbkFjY291bnRzLl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zID0gZnVuY3Rpb24gKHF1ZXJ5KSB7XG4gIHZhciB1c2VyID0gbnVsbDtcblxuICBpZiAocXVlcnkuaWQpIHtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyBfaWQ6IHF1ZXJ5LmlkIH0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBmaWVsZE5hbWU7XG4gICAgdmFyIGZpZWxkVmFsdWU7XG4gICAgaWYgKHF1ZXJ5LnVzZXJuYW1lKSB7XG4gICAgICBmaWVsZE5hbWUgPSAndXNlcm5hbWUnO1xuICAgICAgZmllbGRWYWx1ZSA9IHF1ZXJ5LnVzZXJuYW1lO1xuICAgIH0gZWxzZSBpZiAocXVlcnkuZW1haWwpIHtcbiAgICAgIGZpZWxkTmFtZSA9ICdlbWFpbHMuYWRkcmVzcyc7XG4gICAgICBmaWVsZFZhbHVlID0gcXVlcnkuZW1haWw7XG4gICAgfSBlbHNlIGlmIChxdWVyeS5waG9uZSkge1xuICAgICAgZmllbGROYW1lID0gJ3Bob25lLm51bWJlcic7XG4gICAgICAvLyBmaWVsZFZhbHVl5aaC5p6c6Ieq5bim5Yy65Y+377yM5YiZ5LiN5YGa5aSE55CG77yM5Y+N5LmL6buY6K6k5Yqg5LiK5Lit5Zu95Yy65Y+3Kzg2XG4gICAgICBpZigvXlxcK1xcZCsvZy50ZXN0KHF1ZXJ5LnBob25lKSl7XG4gICAgICAgIGZpZWxkVmFsdWUgPSBxdWVyeS5waG9uZTtcbiAgICAgIH1cbiAgICAgIGVsc2V7XG4gICAgICAgIGZpZWxkVmFsdWUgPSBcIis4NlwiICsgcXVlcnkucGhvbmU7XG4gICAgICB9XG4gICAgICBmaWVsZE5hbWUgPSBcIiRvclwiXG4gICAgICBmaWVsZFZhbHVlID0gW3sncGhvbmUubnVtYmVyJzpmaWVsZFZhbHVlfSx7dXNlcm5hbWU6cXVlcnkucGhvbmV9XVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGRuJ3QgaGFwcGVuICh2YWxpZGF0aW9uIG1pc3NlZCBzb21ldGhpbmcpXCIpO1xuICAgIH1cbiAgICB2YXIgc2VsZWN0b3IgPSB7fTtcbiAgICBzZWxlY3RvcltmaWVsZE5hbWVdID0gZmllbGRWYWx1ZTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIC8vIElmIHVzZXIgaXMgbm90IGZvdW5kLCB0cnkgYSBjYXNlIGluc2Vuc2l0aXZlIGxvb2t1cFxuICAgIGlmICghdXNlciAmJiBmaWVsZE5hbWUgIT0gXCIkb3JcIikge1xuICAgICAgc2VsZWN0b3IgPSBzZWxlY3RvckZvckZhc3RDYXNlSW5zZW5zaXRpdmVMb29rdXAoZmllbGROYW1lLCBmaWVsZFZhbHVlKTtcbiAgICAgIHZhciBjYW5kaWRhdGVVc2VycyA9IE1ldGVvci51c2Vycy5maW5kKHNlbGVjdG9yKS5mZXRjaCgpO1xuICAgICAgLy8gTm8gbWF0Y2ggaWYgbXVsdGlwbGUgY2FuZGlkYXRlcyBhcmUgZm91bmRcbiAgICAgIGlmIChjYW5kaWRhdGVVc2Vycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdXNlciA9IGNhbmRpZGF0ZVVzZXJzWzBdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB1c2VyO1xufTtcblxudmFyIE5vbkVtcHR5U3RyaW5nID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24gKHgpIHtcbiAgY2hlY2soeCwgU3RyaW5nKTtcbiAgcmV0dXJuIHgubGVuZ3RoID4gMDtcbn0pO1xuXG52YXIgdXNlclF1ZXJ5VmFsaWRhdG9yID0gTWF0Y2guV2hlcmUoZnVuY3Rpb24gKHVzZXIpIHtcbiAgY2hlY2sodXNlciwge1xuICAgIGlkOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZyksXG4gICAgdXNlcm5hbWU6IE1hdGNoLk9wdGlvbmFsKE5vbkVtcHR5U3RyaW5nKSxcbiAgICBlbWFpbDogTWF0Y2guT3B0aW9uYWwoTm9uRW1wdHlTdHJpbmcpLFxuICAgIHBob25lOiBNYXRjaC5PcHRpb25hbChOb25FbXB0eVN0cmluZylcbiAgfSk7XG4gIGlmIChfLmtleXModXNlcikubGVuZ3RoICE9PSAxKVxuICAgIHRocm93IG5ldyBNYXRjaC5FcnJvcihcIlVzZXIgcHJvcGVydHkgbXVzdCBoYXZlIGV4YWN0bHkgb25lIGZpZWxkXCIpO1xuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5BY2NvdW50cy5yZWdpc3RlckxvZ2luSGFuZGxlcihcInBhc3N3b3JkMlwiLCBmdW5jdGlvbiAob3B0aW9ucykge1xuICBpZiAoISBvcHRpb25zLnBhc3N3b3JkMiB8fCBvcHRpb25zLnNycClcbiAgICByZXR1cm4gdW5kZWZpbmVkOyAvLyBkb24ndCBoYW5kbGVcblxuICBjaGVjayhvcHRpb25zLCB7XG4gICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxuICAgIHBhc3N3b3JkMjogcGFzc3dvcmRWYWxpZGF0b3JcbiAgfSk7XG5cblxuICB2YXIgdXNlciA9IEFjY291bnRzLl9maW5kVXNlckJ5UXVlcnlGb3JTdGVlZG9zKG9wdGlvbnMudXNlcik7XG4gIGlmICghdXNlcikge1xuICAgIGhhbmRsZUVycm9yKFwiVXNlciBub3QgZm91bmRcIik7XG4gIH1cblxuICBpZiAoIXVzZXIuc2VydmljZXMgfHwgIXVzZXIuc2VydmljZXMucGFzc3dvcmQgfHxcbiAgICAgICEodXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQgfHwgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnApKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIGhhcyBubyBwYXNzd29yZCBzZXRcIik7XG4gIH1cblxuICBpZiAoIXVzZXIuc2VydmljZXMucGFzc3dvcmQuYmNyeXB0KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnBhc3N3b3JkMiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgLy8gVGhlIGNsaWVudCBoYXMgcHJlc2VudGVkIGEgcGxhaW50ZXh0IHBhc3N3b3JkLCBhbmQgdGhlIHVzZXIgaXNcbiAgICAgIC8vIG5vdCB1cGdyYWRlZCB0byBiY3J5cHQgeWV0LiBXZSBkb24ndCBhdHRlbXB0IHRvIHRlbGwgdGhlIGNsaWVudFxuICAgICAgLy8gdG8gdXBncmFkZSB0byBiY3J5cHQsIGJlY2F1c2UgaXQgbWlnaHQgYmUgYSBzdGFuZGFsb25lIEREUFxuICAgICAgLy8gY2xpZW50IGRvZXNuJ3Qga25vdyBob3cgdG8gZG8gc3VjaCBhIHRoaW5nLlxuICAgICAgdmFyIHZlcmlmaWVyID0gdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnA7XG4gICAgICB2YXIgbmV3VmVyaWZpZXIgPSBTUlAuZ2VuZXJhdGVWZXJpZmllcihvcHRpb25zLnBhc3N3b3JkMiwge1xuICAgICAgICBpZGVudGl0eTogdmVyaWZpZXIuaWRlbnRpdHksIHNhbHQ6IHZlcmlmaWVyLnNhbHR9KTtcblxuICAgICAgaWYgKHZlcmlmaWVyLnZlcmlmaWVyICE9PSBuZXdWZXJpZmllci52ZXJpZmllcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHVzZXJJZDogQWNjb3VudHMuX29wdGlvbnMuYW1iaWd1b3VzRXJyb3JNZXNzYWdlcyA/IG51bGwgOiB1c2VyLl9pZCxcbiAgICAgICAgICBlcnJvcjogaGFuZGxlRXJyb3IoXCJJbmNvcnJlY3QgcGFzc3dvcmRcIiwgZmFsc2UpXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7dXNlcklkOiB1c2VyLl9pZH07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRlbGwgdGhlIGNsaWVudCB0byB1c2UgdGhlIFNSUCB1cGdyYWRlIHByb2Nlc3MuXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCJvbGQgcGFzc3dvcmQgZm9ybWF0XCIsIEVKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIGZvcm1hdDogJ3NycCcsXG4gICAgICAgIGlkZW50aXR5OiB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycC5pZGVudGl0eVxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaGVja1Bhc3N3b3JkKFxuICAgIHVzZXIsXG4gICAgb3B0aW9ucy5wYXNzd29yZDJcbiAgKTtcbn0pO1xuXG4vLyBIYW5kbGVyIHRvIGxvZ2luIHVzaW5nIHRoZSBTUlAgdXBncmFkZSBwYXRoLiBUbyB1c2UgdGhpcyBsb2dpblxuLy8gaGFuZGxlciwgdGhlIGNsaWVudCBtdXN0IHByb3ZpZGU6XG4vLyAgIC0gc3JwOiBIKGlkZW50aXR5ICsgXCI6XCIgKyBwYXNzd29yZClcbi8vICAgLSBwYXNzd29yZDogYSBzdHJpbmcgb3IgYW4gb2JqZWN0IHdpdGggcHJvcGVydGllcyAnZGlnZXN0JyBhbmQgJ2FsZ29yaXRobSdcbi8vXG4vLyBXZSB1c2UgYG9wdGlvbnMuc3JwYCB0byB2ZXJpZnkgdGhhdCB0aGUgY2xpZW50IGtub3dzIHRoZSBjb3JyZWN0XG4vLyBwYXNzd29yZCB3aXRob3V0IGRvaW5nIGEgZnVsbCBTUlAgZmxvdy4gT25jZSB3ZSd2ZSBjaGVja2VkIHRoYXQsIHdlXG4vLyB1cGdyYWRlIHRoZSB1c2VyIHRvIGJjcnlwdCBhbmQgcmVtb3ZlIHRoZSBTUlAgaW5mb3JtYXRpb24gZnJvbSB0aGVcbi8vIHVzZXIgZG9jdW1lbnQuXG4vL1xuLy8gVGhlIGNsaWVudCBlbmRzIHVwIHVzaW5nIHRoaXMgbG9naW4gaGFuZGxlciBhZnRlciB0cnlpbmcgdGhlIG5vcm1hbFxuLy8gbG9naW4gaGFuZGxlciAoYWJvdmUpLCB3aGljaCB0aHJvd3MgYW4gZXJyb3IgdGVsbGluZyB0aGUgY2xpZW50IHRvXG4vLyB0cnkgdGhlIFNSUCB1cGdyYWRlIHBhdGguXG4vL1xuLy8gWFhYIENPTVBBVCBXSVRIIDAuOC4xLjNcbkFjY291bnRzLnJlZ2lzdGVyTG9naW5IYW5kbGVyKFwicGFzc3dvcmQyXCIsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5zcnAgfHwgIW9wdGlvbnMucGFzc3dvcmQyKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDsgLy8gZG9uJ3QgaGFuZGxlXG4gIH1cblxuICBjaGVjayhvcHRpb25zLCB7XG4gICAgdXNlcjogdXNlclF1ZXJ5VmFsaWRhdG9yLFxuICAgIHNycDogU3RyaW5nLFxuICAgIHBhc3N3b3JkMjogcGFzc3dvcmRWYWxpZGF0b3JcbiAgfSk7XG5cbiAgdmFyIHVzZXIgPSBBY2NvdW50cy5fZmluZFVzZXJCeVF1ZXJ5Rm9yU3RlZWRvcyhvcHRpb25zLnVzZXIpO1xuICBpZiAoIXVzZXIpIHtcbiAgICBoYW5kbGVFcnJvcihcIlVzZXIgbm90IGZvdW5kXCIpO1xuICB9XG5cbiAgLy8gQ2hlY2sgdG8gc2VlIGlmIGFub3RoZXIgc2ltdWx0YW5lb3VzIGxvZ2luIGhhcyBhbHJlYWR5IHVwZ3JhZGVkXG4gIC8vIHRoZSB1c2VyIHJlY29yZCB0byBiY3J5cHQuXG4gIGlmICh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGFzc3dvcmQgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5iY3J5cHQpIHtcbiAgICByZXR1cm4gY2hlY2tQYXNzd29yZCh1c2VyLCBvcHRpb25zLnBhc3N3b3JkMik7XG4gIH1cblxuICBpZiAoISh1c2VyLnNlcnZpY2VzICYmIHVzZXIuc2VydmljZXMucGFzc3dvcmQgJiYgdXNlci5zZXJ2aWNlcy5wYXNzd29yZC5zcnApKSB7XG4gICAgaGFuZGxlRXJyb3IoXCJVc2VyIGhhcyBubyBwYXNzd29yZCBzZXRcIik7XG4gIH1cblxuICB2YXIgdjEgPSB1c2VyLnNlcnZpY2VzLnBhc3N3b3JkLnNycC52ZXJpZmllcjtcbiAgdmFyIHYyID0gU1JQLmdlbmVyYXRlVmVyaWZpZXIoXG4gICAgbnVsbCxcbiAgICB7XG4gICAgICBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkOiBvcHRpb25zLnNycCxcbiAgICAgIHNhbHQ6IHVzZXIuc2VydmljZXMucGFzc3dvcmQuc3JwLnNhbHRcbiAgICB9XG4gICkudmVyaWZpZXI7XG4gIGlmICh2MSAhPT0gdjIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXNlcklkOiBBY2NvdW50cy5fb3B0aW9ucy5hbWJpZ3VvdXNFcnJvck1lc3NhZ2VzID8gbnVsbCA6IHVzZXIuX2lkLFxuICAgICAgZXJyb3I6IGhhbmRsZUVycm9yKFwiSW5jb3JyZWN0IHBhc3N3b3JkXCIsIGZhbHNlKVxuICAgIH07XG4gIH1cblxuICAvLyBVcGdyYWRlIHRvIGJjcnlwdCBvbiBzdWNjZXNzZnVsIGxvZ2luLlxuICB2YXIgc2FsdGVkID0gaGFzaFBhc3N3b3JkKG9wdGlvbnMucGFzc3dvcmQyKTtcbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShcbiAgICB1c2VyLl9pZCxcbiAgICB7XG4gICAgICAkdW5zZXQ6IHsgJ3NlcnZpY2VzLnBhc3N3b3JkLnNycCc6IDEgfSxcbiAgICAgICRzZXQ6IHsgJ3NlcnZpY2VzLnBhc3N3b3JkLmJjcnlwdCc6IHNhbHRlZCB9XG4gICAgfVxuICApO1xuXG4gIHJldHVybiB7dXNlcklkOiB1c2VyLl9pZH07XG59KTsiLCJQaG9uZSA9IHJlcXVpcmUoJ3Bob25lJylcblxuTWV0ZW9yLm1ldGhvZHMgdXBkYXRlUGhvbmU6IChvcHRpb25zKSAtPlxuXHRjaGVjayBvcHRpb25zLCBPYmplY3Rcblx0eyBudW1iZXIgfSA9IG9wdGlvbnNcblx0Y2hlY2sgbnVtYmVyLCBTdHJpbmdcblxuXHRudW1iZXIgPSBQaG9uZShudW1iZXIpWzBdXG5cdHVubGVzcyBudW1iZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19waG9uZV9pbnZhbGlkXCIpXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0Y3VycmVudFVzZXJJZCA9IEB1c2VySWRcblx0dW5sZXNzIGN1cnJlbnRVc2VySWRcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGN1cnJlbnRVc2VyID0gQWNjb3VudHMudXNlcigpXG5cdGN1cnJlbnROdW1iZXIgPSBjdXJyZW50VXNlci5waG9uZT8ubnVtYmVyXG5cdCMg5omL5py65Y+35LiN5Y+Y77yM5YiZ5LiN55So5pu05pawXG5cdGlmIGN1cnJlbnROdW1iZXIgYW5kIGN1cnJlbnROdW1iZXIgPT0gbnVtYmVyXG5cdFx0cmV0dXJuIHRydWVcblxuXHRyZXBlYXROdW1iZXJVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7J3Bob25lLm51bWJlcic6bnVtYmVyfSx7ZmllbGRzOntfaWQ6MSxwaG9uZToxfX0pXG5cdGlmIHJlcGVhdE51bWJlclVzZXJcblx0XHRpZiByZXBlYXROdW1iZXJVc2VyLnBob25lPy52ZXJpZmllZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfYWxyZWFkeV9leGlzdGVkXCIpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenOWPpuS4gOS4queUqOaIt+aJi+acuuWPt+ayoeaciemqjOivgemAmui/h++8jOWImea4hemZpOWFtui0puaIt+S4i+aJi+acuuWPt+ebuOWFs+Wtl+autVxuXHRcdFx0ZGIudXNlcnMudXBkYXRlIHtcblx0XHRcdFx0X2lkOiByZXBlYXROdW1iZXJVc2VyLl9pZFxuXHRcdFx0fSwgJHVuc2V0OiBcInBob25lXCI6IDEsXCJzZXJ2aWNlcy5waG9uZVwiOiAxXG5cblx0ZGIudXNlcnMudXBkYXRlIHtcblx0XHRfaWQ6IGN1cnJlbnRVc2VySWRcblx0fSwgJHNldDogcGhvbmU6IHtudW1iZXI6IG51bWJlciwgdmVyaWZpZWQ6IGZhbHNlfVxuXG5cdHJldHVybiB0cnVlXG5cblxuIiwidmFyIFBob25lO1xuXG5QaG9uZSA9IHJlcXVpcmUoJ3Bob25lJyk7XG5cbk1ldGVvci5tZXRob2RzKHtcbiAgdXBkYXRlUGhvbmU6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY3VycmVudE51bWJlciwgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VySWQsIG51bWJlciwgcmVmLCByZWYxLCByZXBlYXROdW1iZXJVc2VyO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgbnVtYmVyID0gb3B0aW9ucy5udW1iZXI7XG4gICAgY2hlY2sobnVtYmVyLCBTdHJpbmcpO1xuICAgIG51bWJlciA9IFBob25lKG51bWJlcilbMF07XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3Bob25lX2ludmFsaWRcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIWN1cnJlbnRVc2VySWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBjdXJyZW50VXNlciA9IEFjY291bnRzLnVzZXIoKTtcbiAgICBjdXJyZW50TnVtYmVyID0gKHJlZiA9IGN1cnJlbnRVc2VyLnBob25lKSAhPSBudWxsID8gcmVmLm51bWJlciA6IHZvaWQgMDtcbiAgICBpZiAoY3VycmVudE51bWJlciAmJiBjdXJyZW50TnVtYmVyID09PSBudW1iZXIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXBlYXROdW1iZXJVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAncGhvbmUubnVtYmVyJzogbnVtYmVyXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgcGhvbmU6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVwZWF0TnVtYmVyVXNlcikge1xuICAgICAgaWYgKChyZWYxID0gcmVwZWF0TnVtYmVyVXNlci5waG9uZSkgIT0gbnVsbCA/IHJlZjEudmVyaWZpZWQgOiB2b2lkIDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcGhvbmVfYWxyZWFkeV9leGlzdGVkXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICAgIF9pZDogcmVwZWF0TnVtYmVyVXNlci5faWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICR1bnNldDoge1xuICAgICAgICAgICAgXCJwaG9uZVwiOiAxLFxuICAgICAgICAgICAgXCJzZXJ2aWNlcy5waG9uZVwiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogY3VycmVudFVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgcGhvbmU6IHtcbiAgICAgICAgICBudW1iZXI6IG51bWJlcixcbiAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzIGRpc2FibGVQaG9uZVdpdGhvdXRFeHBpcmVkRGF5czogKGV4cGlyZWREYXlzKSAtPlxuXHRjaGVjayBleHBpcmVkRGF5cywgTnVtYmVyXG5cblx0Y3VycmVudFVzZXJJZCA9IEB1c2VySWRcblx0dW5sZXNzIGN1cnJlbnRVc2VySWRcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdGN1cnJlbnRVc2VyID0gQWNjb3VudHMudXNlcigpXG5cdHZlcmlmaWVkID0gY3VycmVudFVzZXIucGhvbmU/LnZlcmlmaWVkXG5cdG1vZGlmaWVkID0gY3VycmVudFVzZXIucGhvbmU/Lm1vZGlmaWVkXG5cdHVubGVzcyB2ZXJpZmllZCBvciBtb2RpZmllZFxuXHRcdHJldHVybiB0cnVlXG5cblx0bm93ID0gbmV3IERhdGUoKVxuXHRvdXREYXlzID0gTWF0aC5mbG9vcigobm93LmdldFRpbWUoKS1tb2RpZmllZC5nZXRUaW1lKCkpLygyNCAqIDYwICogNjAgKiAxMDAwKSlcblx0aWYgb3V0RGF5cyA+PSBleHBpcmVkRGF5c1xuXHRcdGRiLnVzZXJzLnVwZGF0ZSB7XG5cdFx0XHRfaWQ6IGN1cnJlbnRVc2VySWRcblx0XHR9LCAkc2V0OiBcInBob25lLnZlcmlmaWVkXCI6IGZhbHNlXG5cblx0cmV0dXJuIHRydWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZGlzYWJsZVBob25lV2l0aG91dEV4cGlyZWREYXlzOiBmdW5jdGlvbihleHBpcmVkRGF5cykge1xuICAgIHZhciBjdXJyZW50VXNlciwgY3VycmVudFVzZXJJZCwgbW9kaWZpZWQsIG5vdywgb3V0RGF5cywgcmVmLCByZWYxLCB2ZXJpZmllZDtcbiAgICBjaGVjayhleHBpcmVkRGF5cywgTnVtYmVyKTtcbiAgICBjdXJyZW50VXNlcklkID0gdGhpcy51c2VySWQ7XG4gICAgaWYgKCFjdXJyZW50VXNlcklkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgY3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgdmVyaWZpZWQgPSAocmVmID0gY3VycmVudFVzZXIucGhvbmUpICE9IG51bGwgPyByZWYudmVyaWZpZWQgOiB2b2lkIDA7XG4gICAgbW9kaWZpZWQgPSAocmVmMSA9IGN1cnJlbnRVc2VyLnBob25lKSAhPSBudWxsID8gcmVmMS5tb2RpZmllZCA6IHZvaWQgMDtcbiAgICBpZiAoISh2ZXJpZmllZCB8fCBtb2RpZmllZCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIG91dERheXMgPSBNYXRoLmZsb29yKChub3cuZ2V0VGltZSgpIC0gbW9kaWZpZWQuZ2V0VGltZSgpKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSk7XG4gICAgaWYgKG91dERheXMgPj0gZXhwaXJlZERheXMpIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogY3VycmVudFVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgXCJwaG9uZS52ZXJpZmllZFwiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuIiwiUGhvbmUgPSByZXF1aXJlKCdwaG9uZScpXG5cbk1ldGVvci5tZXRob2RzIGpvaW5TcGFjZUZyb21Mb2dpbjogKG9wdGlvbnMpIC0+XG5cdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxuXHR7IHNwYWNlX2xvZ2luZWQgfSA9IG9wdGlvbnNcblx0Y2hlY2sgc3BhY2VfbG9naW5lZCwgU3RyaW5nXG5cblx0Y3VycmVudFVzZXJJZCA9IEB1c2VySWRcblx0dW5sZXNzIGN1cnJlbnRVc2VySWRcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfbG9naW5lZClcblx0dW5sZXNzIHNwYWNlXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwic3BhY2VfdXNlcnNfZXJyb3Jfc3BhY2Vfbm90X2ZvdW5kXCIpXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0Y3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKClcblx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9sb2dpbmVkLCB1c2VyOiBjdXJyZW50VXNlci5faWR9KVxuXHRpZiBzcGFjZV91c2VyXG5cdFx0cmV0dXJuIHRydWVcblxuXHR1c2VyX2VtYWlsID0gY3VycmVudFVzZXIuZW1haWxzWzBdLmFkZHJlc3Ncblx0cm9vdE9yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6c3BhY2VfbG9naW5lZCwgaXNfY29tcGFueTp0cnVlLCBwYXJlbnQ6IG51bGx9LHtmaWVsZHM6IHtfaWQ6MX19KVxuXHRkYi5zcGFjZV91c2Vycy5pbnNlcnRcblx0XHRlbWFpbDogdXNlcl9lbWFpbFxuXHRcdHVzZXI6IGN1cnJlbnRVc2VyLl9pZFxuXHRcdG5hbWU6IGN1cnJlbnRVc2VyLm5hbWVcblx0XHRvcmdhbml6YXRpb25zOiBbcm9vdE9yZy5faWRdXG5cdFx0c3BhY2U6IHNwYWNlX2xvZ2luZWRcblx0XHR1c2VyX2FjY2VwdGVkOiB0cnVlXG5cdFx0aXNfbG9naW5lZF9mcm9tX3NwYWNlOiB0cnVlXG5cblx0cmV0dXJuIHRydWVcblxuXG4iLCJ2YXIgUGhvbmU7XG5cblBob25lID0gcmVxdWlyZSgncGhvbmUnKTtcblxuTWV0ZW9yLm1ldGhvZHMoe1xuICBqb2luU3BhY2VGcm9tTG9naW46IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgY3VycmVudFVzZXIsIGN1cnJlbnRVc2VySWQsIHJvb3RPcmcsIHNwYWNlLCBzcGFjZV9sb2dpbmVkLCBzcGFjZV91c2VyLCB1c2VyX2VtYWlsO1xuICAgIGNoZWNrKG9wdGlvbnMsIE9iamVjdCk7XG4gICAgc3BhY2VfbG9naW5lZCA9IG9wdGlvbnMuc3BhY2VfbG9naW5lZDtcbiAgICBjaGVjayhzcGFjZV9sb2dpbmVkLCBTdHJpbmcpO1xuICAgIGN1cnJlbnRVc2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBpZiAoIWN1cnJlbnRVc2VySWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2xvZ2luZWQpO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcInNwYWNlX3VzZXJzX2Vycm9yX3NwYWNlX25vdF9mb3VuZFwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY3VycmVudFVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2xvZ2luZWQsXG4gICAgICB1c2VyOiBjdXJyZW50VXNlci5faWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VfdXNlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHVzZXJfZW1haWwgPSBjdXJyZW50VXNlci5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICByb290T3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9sb2dpbmVkLFxuICAgICAgaXNfY29tcGFueTogdHJ1ZSxcbiAgICAgIHBhcmVudDogbnVsbFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBkYi5zcGFjZV91c2Vycy5pbnNlcnQoe1xuICAgICAgZW1haWw6IHVzZXJfZW1haWwsXG4gICAgICB1c2VyOiBjdXJyZW50VXNlci5faWQsXG4gICAgICBuYW1lOiBjdXJyZW50VXNlci5uYW1lLFxuICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3RPcmcuX2lkXSxcbiAgICAgIHNwYWNlOiBzcGFjZV9sb2dpbmVkLFxuICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZSxcbiAgICAgIGlzX2xvZ2luZWRfZnJvbV9zcGFjZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzIGNoZWNrVXNlcjogKG9wdGlvbnMpIC0+XG5cdGNoZWNrIG9wdGlvbnMsIE9iamVjdFxuXHR7IGNvbXBhbnksbmFtZSxlbWFpbCxwYXNzd29yZCxwcm9maWxlIH0gPSBvcHRpb25zXG5cdGNoZWNrIGNvbXBhbnksIFN0cmluZ1xuXHRjaGVjayBuYW1lLCBTdHJpbmdcblx0Y2hlY2sgZW1haWwsIFN0cmluZ1xuXHRjaGVjayBwYXNzd29yZCwgT2JqZWN0XG5cdGNoZWNrIHByb2ZpbGUsIE9iamVjdFxuXG5cdHVubGVzcyBjb21wYW55XG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfY29tcGFueV9lbXB0eVwiKVxuXHRcdHJldHVybiBmYWxzZVxuXHR1bmxlc3MgbmFtZVxuXHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX25hbWVfZW1wdHlcIilcblx0XHRyZXR1cm4gZmFsc2Vcblx0dW5sZXNzIGVtYWlsXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfZW1haWxfZW1wdHlcIilcblx0XHRyZXR1cm4gZmFsc2Vcblx0dW5sZXNzIHBhc3N3b3JkXG5cdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfcGFzc3dvcmRfZW1wdHlcIilcblx0XHRyZXR1cm4gZmFsc2VcblxuXHRlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nbSwgJycpXG5cdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHsnZW1haWxzLmFkZHJlc3MnOiBlbWFpbH0pXG5cdGlmIHVzZXJcblx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJhY2NvdW50c19yZWdpc3Rlcl9lbWFpbF9leGlzdFwiKVxuXHRcdHJldHVybiBmYWxzZVxuXG5cdHJldHVybiB0cnVlXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNoZWNrVXNlcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBjb21wYW55LCBlbWFpbCwgbmFtZSwgcGFzc3dvcmQsIHByb2ZpbGUsIHVzZXI7XG4gICAgY2hlY2sob3B0aW9ucywgT2JqZWN0KTtcbiAgICBjb21wYW55ID0gb3B0aW9ucy5jb21wYW55LCBuYW1lID0gb3B0aW9ucy5uYW1lLCBlbWFpbCA9IG9wdGlvbnMuZW1haWwsIHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCwgcHJvZmlsZSA9IG9wdGlvbnMucHJvZmlsZTtcbiAgICBjaGVjayhjb21wYW55LCBTdHJpbmcpO1xuICAgIGNoZWNrKG5hbWUsIFN0cmluZyk7XG4gICAgY2hlY2soZW1haWwsIFN0cmluZyk7XG4gICAgY2hlY2socGFzc3dvcmQsIE9iamVjdCk7XG4gICAgY2hlY2socHJvZmlsZSwgT2JqZWN0KTtcbiAgICBpZiAoIWNvbXBhbnkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX2NvbXBhbnlfZW1wdHlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghbmFtZSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfbmFtZV9lbXB0eVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFlbWFpbCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiYWNjb3VudHNfcmVnaXN0ZXJfZW1haWxfZW1wdHlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghcGFzc3dvcmQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX3Bhc3N3b3JkX2VtcHR5XCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXFxzKy9nbSwgJycpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICdlbWFpbHMuYWRkcmVzcyc6IGVtYWlsXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcImFjY291bnRzX3JlZ2lzdGVyX2VtYWlsX2V4aXN0XCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG4iXX0=
