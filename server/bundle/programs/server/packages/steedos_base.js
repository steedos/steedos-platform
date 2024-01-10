(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var s = Package['underscorestring:underscore.string'].s;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Migrations = Package['percolate:migrations'].Migrations;
var Tabular = Package['aldeed:tabular'].Tabular;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var Accounts = Package['accounts-base'].Accounts;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var moment = Package['momentjs:moment'].moment;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var E164 = Package['steedos:e164-phones-countries'].E164;
var IsoCountries = Package['steedos:i18n-iso-countries'].IsoCountries;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;
var Blaze = Package.ui.Blaze;
var UI = Package.ui.UI;
var Handlebars = Package.ui.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var FS = Package['steedos:cfs-base-package'].FS;
var HTML = Package.htmljs.HTML;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, Steedos, obj, billingManager, Selector, AjaxCollection, SteedosDataManager, SteedosOffice;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:base":{"checkNpm.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/checkNpm.js                                                                                  //
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
  "node-schedule": "^1.3.1",
  "xml2js": "^0.4.19"
}, 'steedos:base');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"steedos_util.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/steedos_util.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Array.prototype.sortByName = function (locale) {
  if (!this) {
    return;
  }

  if (!locale) {
    locale = Steedos.locale();
  }

  this.sort(function (p1, p2) {
    var p1_sort_no = p1.sort_no || 0;
    var p2_sort_no = p2.sort_no || 0;

    if (p1_sort_no != p2_sort_no) {
      return p1_sort_no > p2_sort_no ? -1 : 1;
    } else {
      return p1.name.localeCompare(p2.name, locale);
    }
  });
};

Array.prototype.getProperty = function (k) {
  var v = new Array();
  this.forEach(function (t) {
    var m = t ? t[k] : null;
    v.push(m);
  });
  return v;
};
/*
 * 添加Array的remove函数
 */


Array.prototype.remove = function (from, to) {
  if (from < 0) {
    return;
  }

  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
/*
 * 添加Array的过滤器
 * return 符合条件的对象Array
 */


Array.prototype.filterProperty = function (h, l) {
  var g = [];
  this.forEach(function (t) {
    var m = t ? t[h] : null;
    var d = false;

    if (m instanceof Array) {
      d = m.includes(l);
    } else {
      if (m instanceof Object) {
        if ("id" in m) {
          m = m["id"];
        } else if ("_id" in m) {
          m = m["_id"];
        }
      }

      if (l instanceof Array) {
        d = l === undefined ? false : l.includes(m);
      } else {
        d = l === undefined ? false : m == l;
      }
    }

    if (d) {
      g.push(t);
    }
  });
  return g;
};
/*
 * 添加Array的过滤器
 * return 符合条件的第一个对象
 */


Array.prototype.findPropertyByPK = function (h, l) {
  var r = null;
  this.forEach(function (t) {
    var m = t ? t[h] : null;
    var d = false;

    if (m instanceof Array) {
      d = m.includes(l);
    } else {
      d = l === undefined ? false : m == l;
    }

    if (d) {
      r = t;
    }
  });
  return r;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/core.coffee                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, crypto, mixin, ref, ref1, ref2, ref3, ref4, rootUrl;
Steedos = {
  settings: {},
  db: db,
  subs: {},
  isPhoneEnabled: function () {
    var ref, ref1;
    return !!((ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? ref1.phone : void 0 : void 0);
  },
  numberToString: function (number, scale, notThousands) {
    var ref, ref1, reg;

    if (typeof number === "number") {
      number = number.toString();
    }

    if (!number) {
      return '';
    }

    if (number !== "NaN") {
      if (scale || scale === 0) {
        number = Number(number).toFixed(scale);
      }

      if (!notThousands) {
        if (!(scale || scale === 0)) {
          scale = (ref = number.match(/\.(\d+)/)) != null ? (ref1 = ref[1]) != null ? ref1.length : void 0 : void 0;

          if (!scale) {
            scale = 0;
          }
        }

        reg = /(\d)(?=(\d{3})+\.)/g;

        if (scale === 0) {
          reg = /(\d)(?=(\d{3})+\b)/g;
        }

        number = number.replace(reg, '$1,');
      }

      return number;
    } else {
      return "";
    }
  },
  numberToPercentString: function (number, scale, notThousands) {
    var newNumber;
    newNumber = Number((number * 100).toFixed(scale));
    return Steedos.numberToString(newNumber, scale, notThousands) + "%";
  },
  valiJquerySymbols: function (str) {
    var reg;
    reg = new RegExp("^[^!\"#$%&'()*\+,\.\/:;<=>?@[\\]^`{|}~]+$");
    return reg.test(str);
  },
  authRequest: function (url, options) {
    var authToken, authorization, defOptions, err, headers, result, spaceId, userSession;
    userSession = Creator.USER_CONTEXT;
    spaceId = userSession.spaceId;
    authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
    result = null;
    url = Steedos.absoluteUrl(url);

    try {
      authorization = 'Bearer ' + spaceId + ',' + authToken;
      headers = [{
        name: 'Content-Type',
        value: 'application/json'
      }, {
        name: 'Authorization',
        value: authorization
      }];
      defOptions = {
        type: 'get',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (XHR) {
          if (headers && headers.length) {
            return headers.forEach(function (header) {
              return XHR.setRequestHeader(header.name, header.value);
            });
          }
        },
        success: function (data) {
          result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          var errorInfo, errorMsg;
          console.error(XMLHttpRequest.responseJSON);

          if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
            errorInfo = XMLHttpRequest.responseJSON.error;
            result = {
              error: errorInfo
            };
            errorMsg = void 0;

            if (errorInfo.reason) {
              errorMsg = errorInfo.reason;
            } else if (errorInfo.message) {
              errorMsg = errorInfo.message;
            } else {
              errorMsg = errorInfo;
              toastr.error(t(errorMsg.replace(/:/g, '：')));
            }
          } else {
            toastr.error(XMLHttpRequest.responseJSON);
          }
        }
      };
      $.ajax(Object.assign({}, defOptions, options));
      return result;
    } catch (error1) {
      err = error1;
      console.error(err);
      toastr.error(err);
    }
  }
}; /*
    * Kick off the global namespace for Steedos.
    * @namespace Steedos
    */

if (Meteor.isCordova || Meteor.isClient) {
  rootUrl = Meteor.absoluteUrl.defaultOptions.rootUrl;

  if (rootUrl.endsWith('/')) {
    rootUrl = rootUrl.substr(0, rootUrl.length - 1);
  }

  if ((ref = window.stores) != null) {
    if ((ref1 = ref.API) != null) {
      if ((ref2 = ref1.client) != null) {
        ref2.setUrl(rootUrl);
      }
    }
  }

  if ((ref3 = window.stores) != null) {
    if ((ref4 = ref3.Settings) != null) {
      ref4.setRootUrl(rootUrl);
    }
  }

  window['steedos.setting'] = {
    rootUrl: rootUrl
  };
}

if (!Meteor.isCordova && Meteor.isClient) {
  Meteor.startup(function () {
    var ref5, ref6, ref7, ref8;
    return (ref5 = window.stores) != null ? (ref6 = ref5.Settings) != null ? ref6.setHrefPopup((ref7 = Meteor.settings["public"]) != null ? (ref8 = ref7.ui) != null ? ref8.href_popup : void 0 : void 0) : void 0 : void 0;
  });
}

Steedos.getHelpUrl = function (locale) {
  var country;
  country = locale.substring(3);
  return "http://www.steedos.com/" + country + "/help/";
};

Steedos.isExpression = function (func) {
  var pattern, reg1, reg2;

  if (typeof func !== 'string') {
    return false;
  }

  pattern = /^{{(.+)}}$/;
  reg1 = /^{{(function.+)}}$/;
  reg2 = /^{{(.+=>.+)}}$/;

  if (typeof func === 'string' && func.match(pattern) && !func.match(reg1) && !func.match(reg2)) {
    return true;
  }

  return false;
};

Steedos.parseSingleExpression = function (func, formData, dataPath, global) {
  var error, funcBody, getParentPath, getValueByPath, globalTag, parent, parentPath, str;

  getParentPath = function (path) {
    var pathArr;

    if (typeof path === 'string') {
      pathArr = path.split('.');

      if (pathArr.length === 1) {
        return '#';
      }

      pathArr.pop();
      return pathArr.join('.');
    }

    return '#';
  };

  getValueByPath = function (formData, path) {
    if (path === '#' || !path) {
      return formData || {};
    } else if (typeof path === 'string') {
      return _.get(formData, path);
    } else {
      console.error('path has to be a string');
    }
  };

  if (formData === void 0) {
    formData = {};
  }

  parentPath = getParentPath(dataPath);
  parent = getValueByPath(formData, parentPath) || {};

  if (typeof func === 'string') {
    funcBody = func.substring(2, func.length - 2);
    globalTag = '__G_L_O_B_A_L__';
    str = '\n    return ' + funcBody.replace(/\bformData\b/g, JSON.stringify(formData).replace(/\bglobal\b/g, globalTag)).replace(/\bglobal\b/g, JSON.stringify(global)).replace(new RegExp('\\b' + globalTag + '\\b', 'g'), 'global').replace(/rootValue/g, JSON.stringify(parent));

    try {
      return Function(str)();
    } catch (error1) {
      error = error1;
      console.log(error, func, dataPath);
      return func;
    }
  } else {
    return func;
  }
};

if (Meteor.isClient) {
  Steedos.spaceUpgradedModal = function () {
    return swal({
      title: TAPi18n.__("space_paid_info_title"),
      text: TAPi18n.__("space_paid_info_text"),
      html: true,
      type: "warning",
      confirmButtonText: TAPi18n.__("OK")
    });
  };

  Steedos.getAccountBgBodyValue = function () {
    var accountBgBody;
    accountBgBody = db.steedos_keyvalues.findOne({
      user: Steedos.userId(),
      key: "bg_body"
    });

    if (accountBgBody) {
      return accountBgBody.value;
    } else {
      return {};
    }
  };

  Steedos.applyAccountBgBodyValue = function (accountBgBodyValue, isNeedToLocal) {
    var avatar, url;

    if (Meteor.loggingIn() || !Steedos.userId()) {
      accountBgBodyValue = {};
      accountBgBodyValue.url = localStorage.getItem("accountBgBodyValue.url");
      accountBgBodyValue.avatar = localStorage.getItem("accountBgBodyValue.avatar");
    }

    url = accountBgBodyValue.url;
    avatar = accountBgBodyValue.avatar;

    if (isNeedToLocal) {
      if (Meteor.loggingIn()) {
        return;
      }

      if (Steedos.userId()) {
        if (url) {
          localStorage.setItem("accountBgBodyValue.url", url);
          return localStorage.setItem("accountBgBodyValue.avatar", avatar);
        } else {
          localStorage.removeItem("accountBgBodyValue.url");
          return localStorage.removeItem("accountBgBodyValue.avatar");
        }
      }
    }
  };

  Steedos.getAccountSkinValue = function () {
    var accountSkin;
    accountSkin = db.steedos_keyvalues.findOne({
      user: Steedos.userId(),
      key: "skin"
    });

    if (accountSkin) {
      return accountSkin.value;
    } else {
      return {};
    }
  };

  Steedos.getAccountZoomValue = function () {
    var accountZoom;
    accountZoom = db.steedos_keyvalues.findOne({
      user: Steedos.userId(),
      key: "zoom"
    });

    if (accountZoom) {
      return accountZoom.value;
    } else {
      return {};
    }
  };

  Steedos.applyAccountZoomValue = function (accountZoomValue, isNeedToLocal) {};

  Steedos.showHelp = function (url) {
    var country, locale;
    locale = Steedos.getLocale();
    country = locale.substring(3);
    url = url || "http://www.steedos.com/" + country + "/help/";
    return window.open(url, '_help', 'EnableViewPortScale=yes');
  };

  Steedos.getUrlWithToken = function (url) {
    var authToken, linker;
    authToken = {};
    authToken["spaceId"] = Steedos.getSpaceId();
    authToken["X-User-Id"] = Meteor.userId();
    authToken["X-Auth-Token"] = Accounts._storedLoginToken();
    linker = "?";

    if (url.indexOf("?") > -1) {
      linker = "&";
    }

    return url + linker + $.param(authToken);
  };

  Steedos.getAppUrlWithToken = function (app_id) {
    var authToken;
    authToken = {};
    authToken["spaceId"] = Steedos.getSpaceId();
    authToken["X-User-Id"] = Meteor.userId();
    authToken["X-Auth-Token"] = Accounts._storedLoginToken();
    return "api/setup/sso/" + app_id + "?" + $.param(authToken);
  };

  Steedos.openAppWithToken = function (app_id) {
    var app, url;
    url = Steedos.getAppUrlWithToken(app_id);
    url = Steedos.absoluteUrl(url);
    app = db.apps.findOne(app_id);

    if (!app.is_new_window && !Steedos.isMobile() && !Steedos.isCordova()) {
      return window.location = url;
    } else {
      return Steedos.openWindow(url);
    }
  };

  Steedos.openUrlWithIE = function (url) {
    var cmd, exec, open_url;

    if (url) {
      if (Steedos.isNode()) {
        exec = nw.require('child_process').exec;
        open_url = url;
        cmd = "start iexplore.exe \"" + open_url + "\"";
        return exec(cmd, function (error, stdout, stderr) {
          if (error) {
            toastr.error(error);
          }
        });
      } else {
        return Steedos.openWindow(url);
      }
    }
  };

  Steedos.openApp = function (app_id) {
    var app, cmd, e, evalFunString, exec, on_click, open_url, path;

    if (!Meteor.userId()) {
      Steedos.redirectToSignIn();
      return true;
    }

    app = db.apps.findOne(app_id);

    if (!app) {
      FlowRouter.go("/");
      return;
    }

    on_click = app.on_click;

    if (app.is_use_ie) {
      if (Steedos.isNode()) {
        exec = nw.require('child_process').exec;

        if (on_click) {
          path = "api/app/sso/" + app_id + "?authToken=" + Accounts._storedLoginToken() + "&userId=" + Meteor.userId();
          open_url = window.location.origin + "/" + path;
        } else {
          open_url = Steedos.getAppUrlWithToken(app_id);
          open_url = window.location.origin + "/" + open_url;
        }

        cmd = "start iexplore.exe \"" + open_url + "\"";
        exec(cmd, function (error, stdout, stderr) {
          if (error) {
            toastr.error(error);
          }
        });
      } else {
        Steedos.openAppWithToken(app_id);
      }
    } else if (db.apps.isInternalApp(app.url)) {
      FlowRouter.go(app.url);
    } else if (app.is_use_iframe) {
      if (app.is_new_window && !Steedos.isMobile() && !Steedos.isCordova()) {
        Steedos.openWindow(Steedos.absoluteUrl("apps/iframe/" + app._id));
      } else if (Steedos.isMobile() || Steedos.isCordova()) {
        Steedos.openAppWithToken(app_id);
      } else {
        FlowRouter.go("/apps/iframe/" + app._id);
      }
    } else if (on_click) {
      evalFunString = "(function(){" + on_click + "})()";

      try {
        eval(evalFunString);
      } catch (error1) {
        e = error1;
        console.error("catch some error when eval the on_click script for app link:");
        console.error(e.message + "\r\n" + e.stack);
      }
    } else {
      Steedos.openAppWithToken(app_id);
    }

    if (!app.is_new_window && !Steedos.isMobile() && !Steedos.isCordova() && !app.is_use_ie && !on_click) {
      return Session.set("current_app_id", app_id);
    }
  };

  Steedos.checkSpaceBalance = function (spaceId) {
    var end_date, min_months, space;

    if (!spaceId) {
      spaceId = Steedos.spaceId();
    }

    min_months = 1;

    if (Steedos.isSpaceAdmin()) {
      min_months = 3;
    }

    space = db.spaces.findOne(spaceId);
    end_date = space != null ? space.end_date : void 0;

    if (space && end_date !== void 0 && end_date - new Date() <= min_months * 30 * 24 * 3600 * 1000) {
      return toastr.error(t("space_balance_insufficient"));
    }
  };

  Steedos.setModalMaxHeight = function () {
    var accountZoomValue, offset;
    accountZoomValue = Steedos.getAccountZoomValue();

    if (!accountZoomValue.name) {
      accountZoomValue.name = 'large';
    }

    switch (accountZoomValue.name) {
      case 'normal':
        if (Steedos.isMobile()) {
          offset = -12;
        } else {
          offset = 75;
        }

        break;

      case 'large':
        if (Steedos.isMobile()) {
          offset = -6;
        } else {
          if (Steedos.detectIE()) {
            offset = 199;
          } else {
            offset = 9;
          }
        }

        break;

      case 'extra-large':
        if (Steedos.isMobile()) {
          offset = -26;
        } else {
          if (Steedos.detectIE()) {
            offset = 303;
          } else {
            offset = 53;
          }
        }

    }

    if ($(".modal").length) {
      return $(".modal").each(function () {
        var footerHeight, headerHeight, height, totalHeight;
        headerHeight = 0;
        footerHeight = 0;
        totalHeight = 0;
        $(".modal-header", $(this)).each(function () {
          return headerHeight += $(this).outerHeight(false);
        });
        $(".modal-footer", $(this)).each(function () {
          return footerHeight += $(this).outerHeight(false);
        });
        totalHeight = headerHeight + footerHeight;
        height = $("body").innerHeight() - totalHeight - offset;

        if ($(this).hasClass("cf_contact_modal")) {
          return $(".modal-body", $(this)).css({
            "max-height": height + "px",
            "height": height + "px"
          });
        } else {
          return $(".modal-body", $(this)).css({
            "max-height": height + "px",
            "height": "auto"
          });
        }
      });
    }
  };

  Steedos.getModalMaxHeight = function (offset) {
    var accountZoomValue, reValue;

    if (Steedos.isMobile()) {
      reValue = window.screen.height - 126 - 180 - 25;
    } else {
      reValue = $(window).height() - 180 - 25;
    }

    if (!(Steedos.isiOS() || Steedos.isMobile())) {
      accountZoomValue = Steedos.getAccountZoomValue();

      switch (accountZoomValue.name) {
        case 'large':
          reValue -= 50;
          break;

        case 'extra-large':
          reValue -= 145;
      }
    }

    if (offset) {
      reValue -= offset;
    }

    return reValue + "px";
  };

  Steedos.isiOS = function (userAgent, language) {
    var DEVICE, browser, conExp, device, numExp;
    DEVICE = {
      android: 'android',
      blackberry: 'blackberry',
      desktop: 'desktop',
      ipad: 'ipad',
      iphone: 'iphone',
      ipod: 'ipod',
      mobile: 'mobile'
    };
    browser = {};
    conExp = '(?:[\\/:\\::\\s:;])';
    numExp = '(\\S+[^\\s:;:\\)]|)';
    userAgent = (userAgent || navigator.userAgent).toLowerCase();
    language = language || navigator.language || navigator.browserLanguage;
    device = userAgent.match(new RegExp('(android|ipad|iphone|ipod|blackberry)')) || userAgent.match(new RegExp('(mobile)')) || ['', DEVICE.desktop];
    browser.device = device[1];
    return browser.device === DEVICE.ipad || browser.device === DEVICE.iphone || browser.device === DEVICE.ipod;
  };

  Steedos.getUserOrganizations = function (isIncludeParents) {
    var organizations, parents, spaceId, space_user, userId;
    userId = Meteor.userId();
    spaceId = Steedos.spaceId();
    space_user = db.space_users.findOne({
      user: userId,
      space: spaceId
    }, {
      fields: {
        organizations: 1
      }
    });
    organizations = space_user != null ? space_user.organizations : void 0;

    if (!organizations) {
      return [];
    }

    if (isIncludeParents) {
      parents = _.flatten(db.organizations.find({
        _id: {
          $in: organizations
        }
      }).fetch().getProperty("parents"));
      return _.union(organizations, parents);
    } else {
      return organizations;
    }
  };

  Steedos.forbidNodeContextmenu = function (target, ifr) {
    if (!Steedos.isNode()) {
      return;
    }

    target.document.body.addEventListener('contextmenu', function (ev) {
      ev.preventDefault();
      return false;
    });

    if (ifr) {
      if (typeof ifr === 'string') {
        ifr = target.$(ifr);
      }

      return ifr.load(function () {
        var ifrBody;
        ifrBody = ifr.contents().find('body');

        if (ifrBody) {
          return ifrBody[0].addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            return false;
          });
        }
      });
    }
  };
}

if (Meteor.isServer) {
  Steedos.getUserOrganizations = function (spaceId, userId, isIncludeParents) {
    var organizations, parents, space_user;
    space_user = db.space_users.findOne({
      user: userId,
      space: spaceId
    }, {
      fields: {
        organizations: 1
      }
    });
    organizations = space_user != null ? space_user.organizations : void 0;

    if (!organizations) {
      return [];
    }

    if (isIncludeParents) {
      parents = _.flatten(db.organizations.find({
        _id: {
          $in: organizations
        }
      }).fetch().getProperty("parents"));
      return _.union(organizations, parents);
    } else {
      return organizations;
    }
  };
}

if (Meteor.isServer) {
  Cookies = require("cookies");

  Steedos.isMobile = function () {
    return false;
  };

  Steedos.isSpaceAdmin = function (spaceId, userId) {
    var space;

    if (!spaceId || !userId) {
      return false;
    }

    space = db.spaces.findOne(spaceId);

    if (!space || !space.admins) {
      return false;
    }

    return space.admins.indexOf(userId) >= 0;
  };

  Steedos.isLegalVersion = function (spaceId, app_version) {
    var check, modules, ref5;

    if (!spaceId) {
      return false;
    }

    check = false;
    modules = (ref5 = db.spaces.findOne(spaceId)) != null ? ref5.modules : void 0;

    if (modules && modules.includes(app_version)) {
      check = true;
    }

    return check;
  };

  Steedos.isOrgAdminByOrgIds = function (orgIds, userId) {
    var allowAccessOrgs, isOrgAdmin, parents, useOrgs;
    isOrgAdmin = false;
    useOrgs = db.organizations.find({
      _id: {
        $in: orgIds
      }
    }, {
      fields: {
        parents: 1,
        admins: 1
      }
    }).fetch();
    parents = [];
    allowAccessOrgs = useOrgs.filter(function (org) {
      var ref5;

      if (org.parents) {
        parents = _.union(parents, org.parents);
      }

      return (ref5 = org.admins) != null ? ref5.includes(userId) : void 0;
    });

    if (allowAccessOrgs.length) {
      isOrgAdmin = true;
    } else {
      parents = _.flatten(parents);
      parents = _.uniq(parents);

      if (parents.length && db.organizations.findOne({
        _id: {
          $in: parents
        },
        admins: userId
      })) {
        isOrgAdmin = true;
      }
    }

    return isOrgAdmin;
  };

  Steedos.isOrgAdminByAllOrgIds = function (orgIds, userId) {
    var i, isOrgAdmin;

    if (!orgIds.length) {
      return true;
    }

    i = 0;

    while (i < orgIds.length) {
      isOrgAdmin = Steedos.isOrgAdminByOrgIds([orgIds[i]], userId);

      if (!isOrgAdmin) {
        break;
      }

      i++;
    }

    return isOrgAdmin;
  };

  Steedos.absoluteUrl = function (url) {
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
        } catch (error1) {
          e = error1;
          return Meteor.absoluteUrl(url);
        }
      } else {
        return Meteor.absoluteUrl(url);
      }
    }
  };

  Steedos.getAPILoginUser = function (req, res) {
    var authToken, cookies, password, ref5, ref6, ref7, ref8, result, user, userId, username;
    username = (ref5 = req.query) != null ? ref5.username : void 0;
    password = (ref6 = req.query) != null ? ref6.password : void 0;

    if (username && password) {
      user = db.users.findOne({
        steedos_id: username
      });

      if (!user) {
        return false;
      }

      result = Accounts._checkPassword(user, password);

      if (result.error) {
        throw new Error(result.error);
      } else {
        return user;
      }
    }

    userId = (ref7 = req.query) != null ? ref7["X-User-Id"] : void 0;
    authToken = (ref8 = req.query) != null ? ref8["X-Auth-Token"] : void 0;

    if (Steedos.checkAuthToken(userId, authToken)) {
      return db.users.findOne({
        _id: userId
      });
    }

    cookies = new Cookies(req, res);

    if (req.headers) {
      userId = req.headers["x-user-id"];
      authToken = req.headers["x-auth-token"];
    }

    if (!userId || !authToken) {
      userId = cookies.get("X-User-Id");
      authToken = cookies.get("X-Auth-Token");
    }

    if (!userId || !authToken) {
      return false;
    }

    if (Steedos.checkAuthToken(userId, authToken)) {
      return db.users.findOne({
        _id: userId
      });
    }

    return false;
  };

  Steedos.checkAuthToken = function (userId, authToken) {
    var hashedToken, user;

    if (userId && authToken) {
      hashedToken = Accounts._hashLoginToken(authToken);
      user = Meteor.users.findOne({
        _id: userId,
        "services.resume.loginTokens.hashedToken": hashedToken
      });

      if (user) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  };
}

if (Meteor.isServer) {
  crypto = require('crypto');

  Steedos.decrypt = function (password, key, iv) {
    var c, decipher, decipherMsg, e, i, key32, len, m;

    try {
      key32 = "";
      len = key.length;

      if (len < 32) {
        c = "";
        i = 0;
        m = 32 - len;

        while (i < m) {
          c = " " + c;
          i++;
        }

        key32 = key + c;
      } else if (len >= 32) {
        key32 = key.slice(0, 32);
      }

      decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'));
      decipherMsg = Buffer.concat([decipher.update(password, 'base64'), decipher.final()]);
      password = decipherMsg.toString();
      return password;
    } catch (error1) {
      e = error1;
      return password;
    }
  };

  Steedos.encrypt = function (password, key, iv) {
    var c, cipher, cipheredMsg, i, key32, len, m;
    key32 = "";
    len = key.length;

    if (len < 32) {
      c = "";
      i = 0;
      m = 32 - len;

      while (i < m) {
        c = " " + c;
        i++;
      }

      key32 = key + c;
    } else if (len >= 32) {
      key32 = key.slice(0, 32);
    }

    cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'));
    cipheredMsg = Buffer.concat([cipher.update(new Buffer(password, 'utf8')), cipher.final()]);
    password = cipheredMsg.toString('base64');
    return password;
  };

  Steedos.getUserIdFromAccessToken = function (access_token) {
    var collection, hashedToken, obj, user, userId;

    if (!access_token) {
      return null;
    }

    userId = access_token.split("-")[0];
    hashedToken = Accounts._hashLoginToken(access_token);
    user = db.users.findOne({
      _id: userId,
      "secrets.hashedToken": hashedToken
    });

    if (user) {
      return userId;
    } else {
      collection = oAuth2Server.collections.accessToken;
      obj = collection.findOne({
        'accessToken': access_token
      });

      if (obj) {
        if ((obj != null ? obj.expires : void 0) < new Date()) {
          return "oauth2 access token:" + access_token + " is expired.";
        } else {
          return obj != null ? obj.userId : void 0;
        }
      } else {
        return "oauth2 access token:" + access_token + " is not found.";
      }
    }

    return null;
  };

  Steedos.getUserIdFromAuthToken = function (req, res) {
    var authToken, cookies, ref5, ref6, ref7, ref8, userId;
    userId = (ref5 = req.query) != null ? ref5["X-User-Id"] : void 0;
    authToken = (ref6 = req.query) != null ? ref6["X-Auth-Token"] : void 0;

    if (Steedos.checkAuthToken(userId, authToken)) {
      return (ref7 = db.users.findOne({
        _id: userId
      })) != null ? ref7._id : void 0;
    }

    cookies = new Cookies(req, res);

    if (req.headers) {
      userId = req.headers["x-user-id"];
      authToken = req.headers["x-auth-token"];
    }

    if (!userId || !authToken) {
      userId = cookies.get("X-User-Id");
      authToken = cookies.get("X-Auth-Token");
    }

    if (!userId || !authToken) {
      return null;
    }

    if (Steedos.checkAuthToken(userId, authToken)) {
      return (ref8 = db.users.findOne({
        _id: userId
      })) != null ? ref8._id : void 0;
    }
  };

  Steedos.APIAuthenticationCheck = function (req, res) {
    var e, user, userId;

    try {
      userId = req.userId;
      user = db.users.findOne({
        _id: userId
      });

      if (!userId || !user) {
        JsonRoutes.sendResult(res, {
          data: {
            "error": "Validate Request -- Missing X-Auth-Token,X-User-Id Or access_token"
          },
          code: 401
        });
        return false;
      } else {
        return true;
      }
    } catch (error1) {
      e = error1;

      if (!userId || !user) {
        JsonRoutes.sendResult(res, {
          code: 401,
          data: {
            "error": e.message,
            "success": false
          }
        });
        return false;
      }
    }
  };
}

mixin = function (obj) {
  return _.each(_.functions(obj), function (name) {
    var func;

    if (!_[name] && _.prototype[name] == null) {
      func = _[name] = obj[name];
      return _.prototype[name] = function () {
        var args;
        args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    }
  });
};

if (Meteor.isServer) {
  Steedos.isHoliday = function (date) {
    var day;

    if (!date) {
      date = new Date();
    }

    check(date, Date);
    day = date.getDay();

    if (day === 6 || day === 0) {
      return true;
    }

    return false;
  };

  Steedos.caculateWorkingTime = function (date, days) {
    var caculateDate, param_date;
    check(date, Date);
    check(days, Number);
    param_date = new Date(date);

    caculateDate = function (i, days) {
      if (i < days) {
        param_date = new Date(param_date.getTime() + 24 * 60 * 60 * 1000);

        if (!Steedos.isHoliday(param_date)) {
          i++;
        }

        caculateDate(i, days);
      }
    };

    caculateDate(0, days);
    return param_date;
  };

  Steedos.caculatePlusHalfWorkingDay = function (date, next) {
    var caculated_date, end_date, first_date, i, j, len, max_index, ref5, second_date, start_date, time_points;
    check(date, Date);
    time_points = (ref5 = Meteor.settings.remind) != null ? ref5.time_points : void 0;

    if (!time_points || _.isEmpty(time_points)) {
      time_points = [{
        "hour": 8,
        "minute": 30
      }, {
        "hour": 14,
        "minute": 30
      }];
    }

    len = time_points.length;
    start_date = new Date(date);
    end_date = new Date(date);
    start_date.setHours(time_points[0].hour);
    start_date.setMinutes(time_points[0].minute);
    end_date.setHours(time_points[len - 1].hour);
    end_date.setMinutes(time_points[len - 1].minute);
    caculated_date = new Date(date);
    j = 0;
    max_index = len - 1;

    if (date < start_date) {
      if (next) {
        j = 0;
      } else {
        j = len / 2;
      }
    } else if (date >= start_date && date < end_date) {
      i = 0;

      while (i < max_index) {
        first_date = new Date(date);
        second_date = new Date(date);
        first_date.setHours(time_points[i].hour);
        first_date.setMinutes(time_points[i].minute);
        second_date.setHours(time_points[i + 1].hour);
        second_date.setMinutes(time_points[i + 1].minute);

        if (date >= first_date && date < second_date) {
          break;
        }

        i++;
      }

      if (next) {
        j = i + 1;
      } else {
        j = i + len / 2;
      }
    } else if (date >= end_date) {
      if (next) {
        j = max_index + 1;
      } else {
        j = max_index + len / 2;
      }
    }

    if (j > max_index) {
      caculated_date = Steedos.caculateWorkingTime(date, 1);
      caculated_date.setHours(time_points[j - max_index - 1].hour);
      caculated_date.setMinutes(time_points[j - max_index - 1].minute);
    } else if (j <= max_index) {
      caculated_date.setHours(time_points[j].hour);
      caculated_date.setMinutes(time_points[j].minute);
    }

    return caculated_date;
  };
}

if (Meteor.isServer) {
  _.extend(Steedos, {
    getSteedosToken: function (appId, userId, authToken) {
      var app, c, cipher, cipheredMsg, hashedToken, i, iv, key32, len, m, now, secret, steedos_id, steedos_token, user;
      crypto = require('crypto');
      app = db.apps.findOne(appId);

      if (app) {
        secret = app.secret;
      }

      if (userId && authToken) {
        hashedToken = Accounts._hashLoginToken(authToken);
        user = Meteor.users.findOne({
          _id: userId,
          "services.resume.loginTokens.hashedToken": hashedToken
        });

        if (user) {
          steedos_id = user.steedos_id;

          if (app.secret) {
            iv = app.secret;
          } else {
            iv = "-8762-fcb369b2e8";
          }

          now = parseInt(new Date().getTime() / 1000).toString();
          key32 = "";
          len = steedos_id.length;

          if (len < 32) {
            c = "";
            i = 0;
            m = 32 - len;

            while (i < m) {
              c = " " + c;
              i++;
            }

            key32 = steedos_id + c;
          } else if (len >= 32) {
            key32 = steedos_id.slice(0, 32);
          }

          cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'));
          cipheredMsg = Buffer.concat([cipher.update(new Buffer(now, 'utf8')), cipher.final()]);
          steedos_token = cipheredMsg.toString('base64');
        }
      }

      return steedos_token;
    },
    locale: function (userId, isI18n) {
      var locale, user;
      user = db.users.findOne({
        _id: userId
      }, {
        fields: {
          locale: 1
        }
      });
      locale = user != null ? user.locale : void 0;

      if (isI18n) {
        if (locale === "en-us") {
          locale = "en";
        }

        if (locale === "zh-cn") {
          locale = "zh-CN";
        }
      }

      return locale;
    },
    checkUsernameAvailability: function (username) {
      return !Meteor.users.findOne({
        username: {
          $regex: new RegExp("^" + Meteor._escapeRegExp(username).trim() + "$", "i")
        }
      });
    },
    validatePassword: function (pwd) {
      var passworPolicy, passworPolicyError, reason, ref10, ref5, ref6, ref7, ref8, ref9, valid;
      reason = t("password_invalid");
      valid = true;

      if (!pwd) {
        valid = false;
      }

      passworPolicy = (ref5 = Meteor.settings["public"]) != null ? (ref6 = ref5.password) != null ? ref6.policy : void 0 : void 0;
      passworPolicyError = ((ref7 = Meteor.settings["public"]) != null ? (ref8 = ref7.password) != null ? ref8.policyError : void 0 : void 0) || ((ref9 = Meteor.settings["public"]) != null ? (ref10 = ref9.password) != null ? ref10.policyerror : void 0 : void 0) || "密码不符合规则";

      if (passworPolicy) {
        if (!new RegExp(passworPolicy).test(pwd || '')) {
          reason = passworPolicyError;
          valid = false;
        } else {
          valid = true;
        }
      }

      if (valid) {
        return true;
      } else {
        return {
          error: {
            reason: reason
          }
        };
      }
    }
  });
}

Steedos.convertSpecialCharacter = function (str) {
  return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}])/g, "\\$1");
};

Steedos.removeSpecialCharacter = function (str) {
  return str.replace(/([\^\$\(\)\*\+\?\.\\\|\[\]\{\}\~\`\@\#\%\&\=\'\"\:\;\<\>\,\/])/g, "");
};

Creator.getDBApps = function (space_id) {
  var dbApps;
  dbApps = {};
  Creator.Collections["apps"].find({
    space: space_id,
    is_creator: true,
    visible: true
  }, {
    fields: {
      created: 0,
      created_by: 0,
      modified: 0,
      modified_by: 0
    }
  }).forEach(function (app) {
    return dbApps[app._id] = app;
  });
  return dbApps;
};

Creator.getDBDashboards = function (space_id) {
  var dbDashboards;
  dbDashboards = {};
  Creator.Collections["dashboard"].find({
    space: space_id
  }, {
    fields: {
      created: 0,
      created_by: 0,
      modified: 0,
      modified_by: 0
    }
  }).forEach(function (dashboard) {
    return dbDashboards[dashboard._id] = dashboard;
  });
  return dbDashboards;
};

if (Meteor.isServer) {
  Cookies = require("cookies");

  Steedos.getAuthToken = function (req, res) {
    var authToken, cookies;
    cookies = new Cookies(req, res);
    authToken = req.headers['x-auth-token'] || cookies.get("X-Auth-Token");

    if (!authToken && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      authToken = req.headers.authorization.split(' ')[1];
    }

    return authToken;
  };
}

if (Meteor.isClient) {
  Meteor.autorun(function () {
    if (Session.get('current_app_id')) {
      return sessionStorage.setItem('current_app_id', Session.get('current_app_id'));
    }
  });

  Steedos.getCurrentAppId = function () {
    if (Session.get('app_id')) {
      return Session.get('app_id');
    } else {
      return sessionStorage.getItem('current_app_id');
    }
  };
}

if (Meteor.isServer) {
  Steedos.formatIndex = function (array) {
    var indexName, isdocumentDB, object, ref5, ref6, ref7;
    object = {
      background: true
    };
    isdocumentDB = ((ref5 = Meteor.settings) != null ? (ref6 = ref5.datasources) != null ? (ref7 = ref6["default"]) != null ? ref7.documentDB : void 0 : void 0 : void 0) || false;

    if (isdocumentDB) {
      if (array.length > 0) {
        indexName = array.join(".");
        object.name = indexName;

        if (indexName.length > 52) {
          object.name = indexName.substring(0, 52);
        }
      }
    }

    return object;
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"simple_schema_extend.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/simple_schema_extend.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {
  SimpleSchema.extendOptions({
    foreign_key: Match.Optional(Boolean),
    references: Match.Optional(Object)
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods":{"apps_init.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/apps_init.coffee                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utc_offset.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/utc_offset.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"last_logon.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/last_logon.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.methods({
    updateUserLastLogon: function () {
      if (this.userId == null) {
        return;
      }

      return db.users.update({
        _id: this.userId
      }, {
        $set: {
          last_logon: new Date()
        }
      });
    }
  });
}

if (Meteor.isClient) {
  Accounts.onLogin(function () {
    return Meteor.call('updateUserLastLogon');
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_add_email.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/user_add_email.coffee                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.methods({
    users_add_email: function (email) {
      var user;

      if (this.userId == null) {
        return {
          error: true,
          message: "email_login_required"
        };
      }

      if (!email) {
        return {
          error: true,
          message: "email_required"
        };
      }

      if (!/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(email)) {
        return {
          error: true,
          message: "email_format_error"
        };
      }

      if (db.users.find({
        "emails.address": email
      }).count() > 0) {
        return {
          error: true,
          message: "email_exists"
        };
      }

      user = db.users.findOne({
        _id: this.userId
      });

      if (user.emails != null && user.emails.length > 0) {
        db.users.direct.update({
          _id: this.userId
        }, {
          $push: {
            emails: {
              address: email,
              verified: false
            }
          }
        });
      } else {
        db.users.direct.update({
          _id: this.userId
        }, {
          $set: {
            steedos_id: email,
            emails: [{
              address: email,
              verified: false
            }]
          }
        });
      }

      Accounts.sendVerificationEmail(this.userId, email);
      return {};
    },
    users_remove_email: function (email) {
      var p, user;

      if (this.userId == null) {
        return {
          error: true,
          message: "email_login_required"
        };
      }

      if (!email) {
        return {
          error: true,
          message: "email_required"
        };
      }

      user = db.users.findOne({
        _id: this.userId
      });

      if (user.emails != null && user.emails.length >= 2) {
        p = null;
        user.emails.forEach(function (e) {
          if (e.address === email) {
            p = e;
          }
        });
        db.users.direct.update({
          _id: this.userId
        }, {
          $pull: {
            emails: p
          }
        });
      } else {
        return {
          error: true,
          message: "email_at_least_one"
        };
      }

      return {};
    },
    users_verify_email: function (email) {
      if (this.userId == null) {
        return {
          error: true,
          message: "email_login_required"
        };
      }

      if (!email) {
        return {
          error: true,
          message: "email_required"
        };
      }

      if (!/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(email)) {
        return {
          error: true,
          message: "email_format_error"
        };
      }

      Accounts.sendVerificationEmail(this.userId, email);
      return {};
    },
    users_set_primary_email: function (email) {
      var emails, user;

      if (this.userId == null) {
        return {
          error: true,
          message: "email_login_required"
        };
      }

      if (!email) {
        return {
          error: true,
          message: "email_required"
        };
      }

      user = db.users.findOne({
        _id: this.userId
      });
      emails = user.emails;
      emails.forEach(function (e) {
        if (e.address === email) {
          return e.primary = true;
        } else {
          return e.primary = false;
        }
      });
      db.users.direct.update({
        _id: this.userId
      }, {
        $set: {
          emails: emails,
          email: email
        }
      });
      db.space_users.direct.update({
        user: this.userId
      }, {
        $set: {
          email: email
        }
      }, {
        multi: true
      });
      return {};
    }
  });
}

if (Meteor.isClient) {
  Steedos.users_add_email = function () {
    return swal({
      title: t("primary_email_needed"),
      text: t("primary_email_needed_description"),
      type: 'input',
      showCancelButton: false,
      closeOnConfirm: false,
      animation: "slide-from-top"
    }, function (inputValue) {
      return Meteor.call("users_add_email", inputValue, function (error, result) {
        if (result != null ? result.error : void 0) {
          return toastr.error(result.message);
        } else {
          return swal(t("primary_email_updated"), "", "success");
        }
      });
    });
  };
} /*
      Tracker.autorun (c) ->
  
          if Meteor.user()
            if Meteor.loggingIn()
               * 正在登录中，则不做处理，因为此时Meteor.userId()不足于证明已登录状态
              return
            primaryEmail = Meteor.user().emails?[0]?.address
            if !primaryEmail
                Steedos.users_add_email();
   */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_avatar.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/user_avatar.coffee                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.methods({
    updateUserAvatar: function (avatar) {
      if (this.userId == null) {
        return;
      }

      return db.users.update({
        _id: this.userId
      }, {
        $set: {
          avatar: avatar
        }
      });
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"email_templates_reset.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/email_templates_reset.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Accounts.emailTemplates = {
  from: function () {
    var defaultFrom = "Steedos <noreply@message.steedos.com>";
    if (!Meteor.settings) return defaultFrom;
    if (!Meteor.settings.email) return defaultFrom;
    if (!Meteor.settings.email.from) return defaultFrom;
    return Meteor.settings.email.from;
  }(),
  resetPassword: {
    subject: function (user) {
      return TAPi18n.__("users_email_reset_password", {}, user.locale);
    },
    text: function (user, url) {
      var splits = url.split("/");
      var tokenCode = splits[splits.length - 1];
      var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello", {}, user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello", {}, user.locale) + ",";
      return greeting + "\n\n" + TAPi18n.__("users_email_reset_password_body", {
        token_code: tokenCode
      }, user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks", {}, user.locale) + "\n";
    }
  },
  verifyEmail: {
    subject: function (user) {
      return TAPi18n.__("users_email_verify_email", {}, user.locale);
    },
    text: function (user, url) {
      var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello", {}, user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello", {}, user.locale) + ",";
      return greeting + "\n\n" + TAPi18n.__("users_email_verify_account", {}, user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks", {}, user.locale) + "\n";
    }
  },
  enrollAccount: {
    subject: function (user) {
      return TAPi18n.__("users_email_create_account", {}, user.locale);
    },
    text: function (user, url) {
      var greeting = user.profile && user.profile.name ? TAPi18n.__("users_email_hello", {}, user.locale) + user.profile.name + "," : TAPi18n.__("users_email_hello", {}, user.locale) + ",";
      return greeting + "\n\n" + TAPi18n.__("users_email_start_service", {}, user.locale) + "\n\n" + url + "\n\n" + TAPi18n.__("users_email_thanks", {}, user.locale) + "\n";
    }
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"upgrade_data.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/upgrade_data.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// 修改fullname值有问题的organizations
JsonRoutes.add("get", "/api/organizations/upgrade/", function (req, res, next) {
  var orgs = db.organizations.find({
    fullname: /新部门/,
    name: {
      $ne: "新部门"
    }
  });

  if (orgs.count() > 0) {
    orgs.forEach(function (org) {
      // 自己和子部门的fullname修改
      db.organizations.direct.update(org._id, {
        $set: {
          fullname: org.calculateFullname()
        }
      });
    });
  }

  JsonRoutes.sendResult(res, {
    data: {
      ret: 0,
      msg: "Successfully"
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"push.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/steedos/push.coffee                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isCordova) {
  Meteor.startup(function () {
    return Push.Configure({
      android: {
        senderID: window.ANDROID_SENDER_ID,
        sound: true,
        vibrate: true
      },
      ios: {
        badge: true,
        clearBadge: true,
        sound: true,
        alert: true
      },
      appName: "workflow"
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"admin.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/admin.coffee                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Selector = {};

Selector.selectorCheckSpaceAdmin = function (userId) {
  var selector, spaces, user;

  if (Meteor.isClient) {
    userId = Meteor.userId();

    if (!userId) {
      return {
        _id: -1
      };
    }

    if (Steedos.isSpaceAdmin()) {
      return {
        space: Session.get("spaceId")
      };
    } else {
      return {
        _id: -1
      };
    }
  }

  if (Meteor.isServer) {
    if (!userId) {
      return {
        _id: -1
      };
    }

    user = db.users.findOne(userId, {
      fields: {
        is_cloudadmin: 1
      }
    });

    if (!user) {
      return {
        _id: -1
      };
    }

    selector = {};

    if (!user.is_cloudadmin) {
      spaces = db.spaces.find({
        admins: {
          $in: [userId]
        }
      }, {
        fields: {
          _id: 1
        }
      }).fetch();
      spaces = spaces.map(function (n) {
        return n._id;
      });
      selector.space = {
        $in: spaces
      };
    }

    return selector;
  }
};

Selector.selectorCheckSpace = function (userId) {
  var selector, spaceId, space_users, spaces, user;

  if (Meteor.isClient) {
    userId = Meteor.userId();

    if (!userId) {
      return {
        _id: -1
      };
    }

    spaceId = Session.get("spaceId");

    if (spaceId) {
      if (db.space_users.findOne({
        user: userId,
        space: spaceId
      }, {
        fields: {
          _id: 1
        }
      })) {
        return {
          space: spaceId
        };
      } else {
        return {
          _id: -1
        };
      }
    } else {
      return {
        _id: -1
      };
    }
  }

  if (Meteor.isServer) {
    if (!userId) {
      return {
        _id: -1
      };
    }

    user = db.users.findOne(userId, {
      fields: {
        _id: 1
      }
    });

    if (!user) {
      return {
        _id: -1
      };
    }

    selector = {};
    space_users = db.space_users.find({
      user: userId
    }, {
      fields: {
        space: 1
      }
    }).fetch();
    spaces = [];

    _.each(space_users, function (u) {
      return spaces.push(u.space);
    });

    selector.space = {
      $in: spaces
    };
    return selector;
  }
};

db.billing_pay_records.adminConfig = {
  icon: "globe",
  color: "blue",
  tableColumns: [{
    name: "order_created()"
  }, {
    name: "modules"
  }, {
    name: "user_count"
  }, {
    name: "end_date"
  }, {
    name: "order_total_fee()"
  }, {
    name: "order_paid()"
  }],
  extraFields: ["space", "created", "paid", "total_fee"],
  routerAdmin: "/admin",
  selector: function (userId) {
    if (Meteor.isClient) {
      if (Steedos.isSpaceAdmin()) {
        return {
          space: Session.get("spaceId"),
          paid: true
        };
      } else {
        return {
          _id: -1
        };
      }
    }

    if (Meteor.isServer) {
      return {};
    }
  },
  showEditColumn: false,
  showDelColumn: false,
  disableAdd: true,
  pageLength: 100,
  order: [[0, "desc"]]
};
Meteor.startup(function () {
  this.space_user_signs = db.space_user_signs;
  this.billing_pay_records = db.billing_pay_records;
  return typeof AdminConfig !== "undefined" && AdminConfig !== null ? AdminConfig.collections_add({
    space_user_signs: db.space_user_signs.adminConfig,
    billing_pay_records: db.billing_pay_records.adminConfig
  }) : void 0;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"array_includes.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/array_includes.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
if (![].includes) {
  Array.prototype.includes = function (searchElement
  /*, fromIndex*/
  ) {
    'use strict';

    var O = Object(this);
    var len = parseInt(O.length) || 0;

    if (len === 0) {
      return false;
    }

    var n = parseInt(arguments[1]) || 0;
    var k;

    if (n >= 0) {
      k = n;
    } else {
      k = len + n;

      if (k < 0) {
        k = 0;
      }
    }

    var currentElement;

    while (k < len) {
      currentElement = O[k];

      if (searchElement === currentElement || searchElement !== searchElement && currentElement !== currentElement) {
        return true;
      }

      k++;
    }

    return false;
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/settings.coffee                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  Steedos.settings.webservices = Meteor.settings["public"].webservices;

  if (!Steedos.settings.webservices) {
    return Steedos.settings.webservices = {
      www: {
        status: "active",
        url: "/"
      }
    };
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_object_view.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/user_object_view.coffee                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Creator.getUserObjectsListViews = function (userId, spaceId, objects) {
  var _getUserObjectListViews, keys, listViews, objectsViews;

  listViews = {};
  keys = _.keys(objects);
  objectsViews = Creator.getCollection("object_listviews").find({
    object_name: {
      $in: keys
    },
    space: spaceId,
    "$or": [{
      owner: userId
    }, {
      shared: true
    }]
  }, {
    fields: {
      created: 0,
      modified: 0,
      created_by: 0,
      modified_by: 0
    }
  }).fetch();

  _getUserObjectListViews = function (object_name) {
    var _user_object_list_views, olistViews;

    _user_object_list_views = {};
    olistViews = _.filter(objectsViews, function (ov) {
      return ov.object_name === object_name;
    });

    _.each(olistViews, function (listview) {
      return _user_object_list_views[listview._id] = listview;
    });

    return _user_object_list_views;
  };

  _.forEach(objects, function (o, key) {
    var list_view;
    list_view = _getUserObjectListViews(key);

    if (!_.isEmpty(list_view)) {
      return listViews[key] = list_view;
    }
  });

  return listViews;
};

Creator.getUserObjectListViews = function (userId, spaceId, object_name) {
  var _user_object_list_views, object_listview;

  _user_object_list_views = {};
  object_listview = Creator.getCollection("object_listviews").find({
    object_name: object_name,
    space: spaceId,
    "$or": [{
      owner: userId
    }, {
      shared: true
    }]
  }, {
    fields: {
      created: 0,
      modified: 0,
      created_by: 0,
      modified_by: 0
    }
  });
  object_listview.forEach(function (listview) {
    return _user_object_list_views[listview._id] = listview;
  });
  return _user_object_list_views;
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server_session.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/server_session.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// ServerSession = (function () {
//   'use strict';
//   var Collection = new Mongo.Collection('server_sessions');
//   var checkForKey = function (key) {
//     if (typeof key === 'undefined') {
//       throw new Error('Please provide a key!');
//     }
//   };
//   var getSessionValue = function (obj, key) {
//     return obj && obj.values && obj.values[key];
//   };
//   var condition = function () {
//     return true;
//   };
//   Collection.deny({
//     'insert': function () {
//       return true;
//     },
//     'update' : function () {
//       return true;
//     },
//     'remove': function () {
//       return true;
//     }
//   });
//   // public client and server api
//   var api = {
//     'get': function (key) {
//       console.log(Collection.findOne());
//       var sessionObj = Collection.findOne();
//       if(Meteor.isServer){
//         Meteor.call('server-session/get');
//       }
//       // var sessionObj = Meteor.isServer ? 
//       //   Meteor.call('server-session/get') : Collection.findOne();
//       return getSessionValue(sessionObj, key);
//     },
//     'equals': function (key, expected, identical) {
//       var sessionObj = Meteor.isServer ? 
//         Meteor.call('server-session/get') : Collection.findOne();
//       var value = getSessionValue(sessionObj, key);
//       if (_.isObject(value) && _.isObject(expected)) {
//         return _(value).isEqual(expected);
//       }
//       if (identical == false) {
//         return expected == value;
//       }
//       return expected === value;
//     }
//   };
//   Meteor.startup(function(){
//     if (Meteor.isClient) {
//       Tracker.autorun(function(){
//         if(Meteor.userId()){
//           Meteor.subscribe('server-session');
//         }
//       })
//     }
//   })
//   if (Meteor.isServer) {
//     // Meteor.startup(function () {
//     //   if (Collection.findOne()) {
//     //     Collection.remove({}); // clear out all stale sessions
//     //   }
//     // });
//     Meteor.onConnection(function (connection) {
//       var clientID = connection.id;
//       if (!Collection.findOne({ 'clientID': clientID })) {
//         Collection.insert({ 'clientID': clientID, 'values': {}, "created": new Date() });
//       }
//       connection.onClose(function () {
//         Collection.remove({ 'clientID': clientID });
//       });
//     });
//     Meteor.publish('server-session', function () {
//       return Collection.find({ 'clientID': this.connection.id });
//     });
//     Meteor.methods({
//       'server-session/get': function () {
//         return Collection.findOne({ 'clientID': this.connection.id });
//       },
//       'server-session/set': function (key, value) {
//         if (!this.randomSeed) return;
//         checkForKey(key);
//         if (!condition(key, value))
//           throw new Meteor.Error('Failed condition validation.');
//         var updateObj = {};
//         updateObj['values.' + key] = value;
//         Collection.update({ 'clientID': this.connection.id }, { $set: updateObj });
//       }
//     });  
//     // server-only api
//     _.extend(api, {
//       'set': function (key, value) {
//         Meteor.call('server-session/set', key, value);          
//       },
//       'setCondition': function (newCondition) {
//         condition = newCondition;
//       }
//     });
//   }
//   return api;
// })();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"api_get_apps.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/routes/api_get_apps.coffee                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add('get', '/api/get/apps', function (req, res, next) {
  var apps, e, locale, ref, ref1, space_id, spaces, user, user_id;

  try {
    user_id = req.headers['x-user-id'] || ((ref = req.query) != null ? ref.userId : void 0);
    space_id = req.headers['x-space-id'] || ((ref1 = req.query) != null ? ref1.spaceId : void 0);
    user = Steedos.getAPILoginUser(req, res);

    if (!user) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          "error": "Validate Request -- Missing X-Auth-Token,X-User-Id",
          "success": false
        }
      });
      return;
    }

    user_id = user._id;
    uuflowManager.getSpace(space_id);
    locale = db.users.findOne({
      _id: user_id
    }).locale;

    if (locale === "en-us") {
      locale = "en";
    }

    if (locale === "zh-cn") {
      locale = "zh-CN";
    }

    spaces = db.space_users.find({
      user: user_id
    }).fetch().getProperty("space");
    apps = db.apps.find({
      $or: [{
        space: {
          $exists: false
        }
      }, {
        space: {
          $in: spaces
        }
      }]
    }, {
      sort: {
        sort: 1
      }
    }).fetch();
    apps.forEach(function (app) {
      return app.name = TAPi18n.__(app.name, {}, locale);
    });
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        status: "success",
        data: apps
      }
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {
        errors: [{
          errorMessage: e.message
        }]
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/routes/collection.coffee                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, steedosAuth;
Cookies = require("cookies");
steedosAuth = require("@steedos/auth");
JsonRoutes.add("post", "/api/collection/find", function (req, res, next) {
  var allow_models, authToken, cookies, data, e, model, options, selector, space, userId, userSession;

  try {
    cookies = new Cookies(req, res);
    authToken = req.body["X-Auth-Token"] || cookies.get("X-Auth-Token");

    if (!authToken) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          "error": "Validate Request -- Missing X-Auth-Token",
          "instance": "1329598861",
          "success": false
        }
      });
      return;
    }

    model = req.body.model;
    selector = req.body.selector;
    options = req.body.options;
    space = req.body.space;
    data = [];
    allow_models = ['space_users', 'organizations', 'flow_roles', 'roles'];

    if (!space) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid space " + space,
          "success": false
        }
      });
      return;
    }

    check(space, String);
    check(authToken, String);
    userSession = Meteor.wrapAsync(function (authToken, spaceId, cb) {
      return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
        return cb(reject, resolve);
      });
    })(authToken, space);

    if (!userSession) {
      JsonRoutes.sendResult(res, {
        code: 500,
        data: {
          "error": "auth failed",
          "success": false
        }
      });
      return;
    }

    userId = userSession.userId;

    if (!allow_models.includes(model)) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid model " + model,
          "success": false
        }
      });
      return;
    }

    if (!db[model]) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid model " + model,
          "success": false
        }
      });
      return;
    }

    if (!selector) {
      selector = {};
    }

    if (!options) {
      options = {};
    }

    selector.space = space;
    data = db[model].find(selector, options).fetch();
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: data
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: []
    });
  }
});
JsonRoutes.add("post", "/api/collection/findone", function (req, res, next) {
  var allow_models, authToken, cookies, data, e, model, options, selector, space, userId, userSession;

  try {
    cookies = new Cookies(req, res);
    authToken = req.body["X-Auth-Token"] || cookies.get("X-Auth-Token");

    if (!authToken) {
      JsonRoutes.sendResult(res, {
        code: 401,
        data: {
          "error": "Validate Request -- Missing X-Auth-Token",
          "instance": "1329598861",
          "success": false
        }
      });
      return;
    }

    model = req.body.model;
    selector = req.body.selector;
    options = req.body.options;
    space = req.body.space;
    data = [];
    allow_models = ['space_users', 'organizations', 'flow_roles', 'mail_accounts', 'roles'];

    if (!space) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid space " + space,
          "success": false
        }
      });
      return;
    }

    check(space, String);
    check(authToken, String);
    userSession = Meteor.wrapAsync(function (authToken, spaceId, cb) {
      return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
        return cb(reject, resolve);
      });
    })(authToken, space);

    if (!userSession) {
      JsonRoutes.sendResult(res, {
        code: 500,
        data: {
          "error": "auth failed",
          "success": false
        }
      });
      return;
    }

    userId = userSession.userId;

    if (!allow_models.includes(model)) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid model " + model,
          "success": false
        }
      });
      return;
    }

    if (!db[model]) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid model " + model,
          "success": false
        }
      });
      return;
    }

    if (!selector) {
      selector = {};
    }

    if (!options) {
      options = {};
    }

    if (model === 'mail_accounts') {
      selector = {};
      selector.owner = userId;
      data = db[model].findOne(selector);
    } else {
      selector.space = space;
      data = db[model].findOne(selector, options);
    }

    return JsonRoutes.sendResult(res, {
      code: 200,
      data: data
    });
  } catch (error) {
    e = error;
    console.error(e.stack);
    return JsonRoutes.sendResult(res, {
      code: 200,
      data: {}
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sso.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/routes/sso.coffee                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, crypto, express;
crypto = require('crypto');
Cookies = require("cookies");
express = require("express");
JsonRoutes.add("get", "/api/setup/sso/:app_id", function (req, res, next) {
  var app, authToken, c, cipher, cipheredMsg, cookies, des_cipher, des_cipheredMsg, des_iv, des_steedos_token, hashedToken, i, iv, joiner, key32, key8, len, m, now, redirectUrl, returnurl, secret, steedos_id, steedos_token, user, userId;
  app = db.apps.findOne(req.params.app_id);

  if (app) {
    secret = app.secret;
    redirectUrl = app.url;
  } else {
    secret = "-8762-fcb369b2e8";
    redirectUrl = req.params.redirectUrl;
  }

  if (!redirectUrl) {
    res.writeHead(401);
    res.end();
    return;
  }

  cookies = new Cookies(req, res);

  if (!userId && !authToken) {
    userId = req.query["X-User-Id"];
    authToken = req.query["X-Auth-Token"];
  }

  if (userId && authToken) {
    hashedToken = Accounts._hashLoginToken(authToken);
    user = Meteor.users.findOne({
      _id: userId,
      "services.resume.loginTokens.hashedToken": hashedToken
    });

    if (user) {
      steedos_id = user.steedos_id;

      if (app.secret) {
        iv = app.secret;
      } else {
        iv = "-8762-fcb369b2e8";
      }

      now = parseInt(new Date().getTime() / 1000).toString();
      key32 = "";
      len = steedos_id.length;

      if (len < 32) {
        c = "";
        i = 0;
        m = 32 - len;

        while (i < m) {
          c = " " + c;
          i++;
        }

        key32 = steedos_id + c;
      } else if (len >= 32) {
        key32 = steedos_id.slice(0, 32);
      }

      cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key32, 'utf8'), new Buffer(iv, 'utf8'));
      cipheredMsg = Buffer.concat([cipher.update(new Buffer(now, 'utf8')), cipher.final()]);
      steedos_token = cipheredMsg.toString('base64');
      des_iv = "-8762-fc";
      key8 = "";
      len = steedos_id.length;

      if (len < 8) {
        c = "";
        i = 0;
        m = 8 - len;

        while (i < m) {
          c = " " + c;
          i++;
        }

        key8 = steedos_id + c;
      } else if (len >= 8) {
        key8 = steedos_id.slice(0, 8);
      }

      des_cipher = crypto.createCipheriv('des-cbc', new Buffer(key8, 'utf8'), new Buffer(des_iv, 'utf8'));
      des_cipheredMsg = Buffer.concat([des_cipher.update(new Buffer(now, 'utf8')), des_cipher.final()]);
      des_steedos_token = des_cipheredMsg.toString('base64');
      joiner = "?";

      if (redirectUrl.indexOf("?") > -1) {
        joiner = "&";
      }

      returnurl = redirectUrl + joiner + "X-User-Id=" + userId + "&X-Auth-Token=" + authToken + "&X-STEEDOS-WEB-ID=" + steedos_id + "&X-STEEDOS-AUTHTOKEN=" + steedos_token + "&STEEDOS-AUTHTOKEN=" + des_steedos_token;

      if (user.username) {
        returnurl += "&X-STEEDOS-USERNAME=" + encodeURI(user.username);
      }

      res.setHeader("Location", returnurl);
      res.writeHead(302);
      res.end();
      return;
    }
  }

  res.writeHead(401);
  res.end();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"avatar.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/routes/avatar.coffee                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return JsonRoutes.add('get', '/avatar/:userId', function (req, res, next) {
    var color, color_index, colors, fontSize, height, initials, position, ref, ref1, ref2, reqModifiedHeader, svg, user, username, username_array, width;
    width = 50;
    height = 50;
    fontSize = 28;

    if (req.query.w) {
      width = req.query.w;
    }

    if (req.query.h) {
      height = req.query.h;
    }

    if (req.query.fs) {
      fontSize = req.query.fs;
    }

    user = db.users.findOne(req.params.userId);

    if (!user) {
      res.writeHead(401);
      res.end();
      return;
    }

    if (user.avatar) {
      res.setHeader("Location", Creator.getRelativeUrl("api/files/avatars/" + user.avatar));
      res.writeHead(302);
      res.end();
      return;
    }

    if ((ref = user.profile) != null ? ref.avatar : void 0) {
      res.setHeader("Location", user.profile.avatar);
      res.writeHead(302);
      res.end();
      return;
    }

    if (user.avatarUrl) {
      res.setHeader("Location", user.avatarUrl);
      res.writeHead(302);
      res.end();
      return;
    }

    if (typeof file === "undefined" || file === null) {
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('content-type', 'image/svg+xml');
      res.setHeader('cache-control', 'public, max-age=31536000');
      svg = "<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n	 viewBox=\"0 0 72 72\" style=\"enable-background:new 0 0 72 72;\" xml:space=\"preserve\">\n<style type=\"text/css\">\n	.st0{fill:#FFFFFF;}\n	.st1{fill:#D0D0D0;}\n</style>\n<g>\n	<path class=\"st0\" d=\"M36,71.1c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S55.3,71.1,36,71.1z\"/>\n	<path class=\"st1\" d=\"M36,2.1c18.7,0,34,15.3,34,34s-15.3,34-34,34S2,54.8,2,36.1S17.3,2.1,36,2.1 M36,0.1c-19.9,0-36,16.1-36,36\n		s16.1,36,36,36s36-16.1,36-36S55.9,0.1,36,0.1L36,0.1z\"/>\n</g>\n<g>\n	<g>\n		<path class=\"st1\" d=\"M35.8,42.6c8.3,0,15.1-6.8,15.1-15.1c0-8.3-6.8-15.1-15.1-15.1c-8.3,0-15.1,6.8-15.1,15.1\n			C20.7,35.8,27.5,42.6,35.8,42.6z\"/>\n		<path class=\"st1\" d=\"M36.2,70.7c8.7,0,16.7-3.1,22.9-8.2c-3.6-9.6-12.7-15.5-23.3-15.5c-10.4,0-19.4,5.7-23.1,15\n			C19,67.4,27.2,70.7,36.2,70.7z\"/>\n	</g>\n</g>\n</svg>";
      res.write(svg);
      res.end();
      return;
    }

    username = user.name;

    if (!username) {
      username = "";
    }

    res.setHeader('Content-Disposition', 'inline');

    if (typeof file === "undefined" || file === null) {
      res.setHeader('content-type', 'image/svg+xml');
      res.setHeader('cache-control', 'public, max-age=31536000');
      colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
      username_array = Array.from(username);
      color_index = 0;

      _.each(username_array, function (item) {
        return color_index += item.charCodeAt(0);
      });

      position = color_index % colors.length;
      color = colors[position];
      initials = '';

      if (username.charCodeAt(0) > 255) {
        initials = username.substr(0, 1);
      } else {
        initials = username.substr(0, 2);
      }

      initials = initials.toUpperCase();
      svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" pointer-events=\"none\" width=\"" + width + "\" height=\"" + height + "\" style=\"width: " + width + "px; height: " + height + "px; background-color: " + color + ";\">\n	<text text-anchor=\"middle\" y=\"50%\" x=\"50%\" dy=\"0.36em\" pointer-events=\"auto\" fill=\"#FFFFFF\" font-family=\"-apple-system, BlinkMacSystemFont, Helvetica, Arial, Microsoft Yahei, SimHei\" style=\"font-weight: 400; font-size: " + fontSize + "px;\">\n		" + initials + "\n	</text>\n</svg>";
      res.write(svg);
      res.end();
      return;
    }

    reqModifiedHeader = req.headers["if-modified-since"];

    if (reqModifiedHeader != null) {
      if (reqModifiedHeader === ((ref1 = user.modified) != null ? ref1.toUTCString() : void 0)) {
        res.setHeader('Last-Modified', reqModifiedHeader);
        res.writeHead(304);
        res.end();
        return;
      }
    }

    res.setHeader('Last-Modified', ((ref2 = user.modified) != null ? ref2.toUTCString() : void 0) || new Date().toUTCString());
    res.setHeader('content-type', 'image/jpeg');
    res.setHeader('Content-Length', file.length);
    file.readStream.pipe(res);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"access_token.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/routes/access_token.coffee                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return JsonRoutes.add('get', '/api/access/check', function (req, res, next) {
    var access_token, ref;
    access_token = (ref = req.query) != null ? ref.access_token : void 0;

    if (Steedos.getUserIdFromAccessToken(access_token)) {
      res.writeHead(200);
      res.end();
    } else {
      res.writeHead(401);
      res.end();
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publications":{"apps.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/publications/apps.coffee                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
if (Meteor.isServer) {
  Meteor.publish('apps', function (spaceId) {
    var selector;

    if (!this.userId) {
      return this.ready();
    }

    selector = {
      space: {
        $exists: false
      }
    };

    if (spaceId) {
      selector = {
        $or: [{
          space: {
            $exists: false
          }
        }, {
          space: spaceId
        }]
      };
    }

    return db.apps.find(selector, {
      sort: {
        sort: 1
      }
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"my_spaces.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/publications/my_spaces.coffee                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('my_spaces', function () {
  var handle, handle2, observeSpaces, self, sus, userSpaces;

  if (!this.userId) {
    return this.ready();
  }

  self = this;
  userSpaces = [];
  sus = db.space_users.find({
    user: this.userId,
    user_accepted: true
  }, {
    fields: {
      space: 1
    }
  });
  sus.forEach(function (su) {
    return userSpaces.push(su.space);
  });
  handle2 = null;
  handle = db.space_users.find({
    user: this.userId,
    user_accepted: true
  }).observe({
    added: function (doc) {
      if (doc.space) {
        if (userSpaces.indexOf(doc.space) < 0) {
          userSpaces.push(doc.space);
          return observeSpaces();
        }
      }
    },
    removed: function (oldDoc) {
      if (oldDoc.space) {
        self.removed("spaces", oldDoc.space);
        return userSpaces = _.without(userSpaces, oldDoc.space);
      }
    }
  });

  observeSpaces = function () {
    if (handle2) {
      handle2.stop();
    }

    return handle2 = db.spaces.find({
      _id: {
        $in: userSpaces
      }
    }).observe({
      added: function (doc) {
        self.added("spaces", doc._id, doc);
        return userSpaces.push(doc._id);
      },
      changed: function (newDoc, oldDoc) {
        return self.changed("spaces", newDoc._id, newDoc);
      },
      removed: function (oldDoc) {
        self.removed("spaces", oldDoc._id);
        return userSpaces = _.without(userSpaces, oldDoc._id);
      }
    });
  };

  observeSpaces();
  self.ready();
  return self.onStop(function () {
    handle.stop();

    if (handle2) {
      return handle2.stop();
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"space_avatar.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/publications/space_avatar.coffee                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('space_avatar', function (spaceId) {
  if (!spaceId) {
    return this.ready();
  }

  return db.spaces.find({
    _id: spaceId
  }, {
    fields: {
      avatar: 1,
      name: 1,
      enable_register: 1
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modules.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/publications/modules.coffee                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('modules', function () {
  if (!this.userId) {
    return this.ready();
  }

  return db.modules.find();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"weixin_pay_code_url.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/publications/weixin_pay_code_url.coffee                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('billing_weixin_pay_code_url', function (_id) {
  if (!this.userId) {
    return this.ready();
  }

  if (!_id) {
    return this.ready();
  }

  return db.billing_pay_records.find({
    _id: _id
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"my_contacts_limit.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/my_contacts_limit.coffee                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  get_contacts_limit: function (space) {
    var froms, fromsChildren, fromsChildrenIds, i, isLimit, j, len, len1, limit, limits, myLitmitOrgIds, myOrgId, myOrgIds, myOrgs, orgs, outside_organizations, reValue, setting, tempIsLimit, toOrgs, tos;
    check(space, String);
    reValue = {
      isLimit: true,
      outside_organizations: []
    };

    if (!this.userId) {
      return reValue;
    }

    isLimit = false;
    outside_organizations = [];
    setting = db.space_settings.findOne({
      space: space,
      key: "contacts_view_limits"
    });
    limits = (setting != null ? setting.values : void 0) || [];

    if (limits.length) {
      myOrgs = db.organizations.find({
        space: space,
        users: this.userId
      }, {
        fields: {
          _id: 1
        }
      });
      myOrgIds = myOrgs.map(function (n) {
        return n._id;
      });

      if (!myOrgIds.length) {
        return reValue;
      }

      myLitmitOrgIds = [];

      for (i = 0, len = limits.length; i < len; i++) {
        limit = limits[i];
        froms = limit.froms;
        tos = limit.tos;
        fromsChildren = db.organizations.find({
          space: space,
          parents: {
            $in: froms
          }
        }, {
          fields: {
            _id: 1
          }
        });
        fromsChildrenIds = fromsChildren != null ? fromsChildren.map(function (n) {
          return n._id;
        }) : void 0;

        for (j = 0, len1 = myOrgIds.length; j < len1; j++) {
          myOrgId = myOrgIds[j];
          tempIsLimit = false;

          if (froms.indexOf(myOrgId) > -1) {
            tempIsLimit = true;
          } else {
            if (fromsChildrenIds.indexOf(myOrgId) > -1) {
              tempIsLimit = true;
            }
          }

          if (tempIsLimit) {
            isLimit = true;
            outside_organizations.push(tos);
            myLitmitOrgIds.push(myOrgId);
          }
        }
      }

      myLitmitOrgIds = _.uniq(myLitmitOrgIds);

      if (myLitmitOrgIds.length < myOrgIds.length) {
        isLimit = false;
        outside_organizations = [];
      } else {
        outside_organizations = _.uniq(_.flatten(outside_organizations));
      }
    }

    if (isLimit) {
      toOrgs = db.organizations.find({
        space: space,
        _id: {
          $in: outside_organizations
        }
      }, {
        fields: {
          _id: 1,
          parents: 1
        }
      }).fetch();
      orgs = _.filter(toOrgs, function (org) {
        var parents;
        parents = org.parents || [];
        return _.intersection(parents, outside_organizations).length < 1 && _.intersection(parents, myOrgIds).length < 1;
      });
      outside_organizations = orgs.map(function (n) {
        return n._id;
      });
    }

    reValue.isLimit = isLimit;
    reValue.outside_organizations = outside_organizations;
    return reValue;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setKeyValue.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/setKeyValue.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.methods({
  setKeyValue: function (key, value) {
    check(key, String);
    check(value, Object);
    obj = {};
    obj.user = this.userId;
    obj.key = key;
    obj.value = value;
    var c = db.steedos_keyvalues.find({
      user: this.userId,
      key: key
    }).count();

    if (c > 0) {
      db.steedos_keyvalues.update({
        user: this.userId,
        key: key
      }, {
        $set: {
          value: value
        }
      });
    } else {
      db.steedos_keyvalues.insert(obj);
    }

    return true;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setUsername.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/setUsername.coffee                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  setUsername: function (space_id, username, user_id) {
    var spaceUser;
    check(space_id, String);
    check(username, String);

    if (!Steedos.isSpaceAdmin(space_id, Meteor.userId()) && user_id) {
      throw new Meteor.Error(400, 'contact_space_user_needed');
    }

    if (!Meteor.userId()) {
      throw new Meteor.Error(400, 'error-invalid-user');
    }

    if (!user_id) {
      user_id = Meteor.user()._id;
    }

    spaceUser = db.space_users.findOne({
      user: user_id,
      space: space_id
    });

    if (spaceUser.invite_state === "pending" || spaceUser.invite_state === "refused") {
      throw new Meteor.Error(400, "该用户尚未同意加入该工作区，无法修改用户名");
    }

    db.users.update({
      _id: user_id
    }, {
      $set: {
        username: username
      }
    });
    return username;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_space_user_count.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/get_space_user_count.coffee                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  get_space_user_count: function (space_id) {
    var user_count_info;
    check(space_id, String);
    user_count_info = new Object();
    user_count_info.total_user_count = db.space_users.find({
      space: space_id
    }).count();
    user_count_info.accepted_user_count = db.space_users.find({
      space: space_id,
      user_accepted: true
    }).count();
    return user_count_info;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_secret.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/user_secret.coffee                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  create_secret: function (name) {
    if (!this.userId) {
      return false;
    }

    return db.users.create_secret(this.userId, name);
  },
  remove_secret: function (token) {
    var hashedToken;

    if (!this.userId || !token) {
      return false;
    }

    hashedToken = Accounts._hashLoginToken(token);
    console.log("token", token);
    return db.users.update({
      _id: this.userId
    }, {
      $pull: {
        "secrets": {
          hashedToken: hashedToken
        }
      }
    });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_workflows.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/object_workflows.coffee                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  'object_workflows.get': function (spaceId, userId) {
    var curSpaceUser, organizations, ows;
    check(spaceId, String);
    check(userId, String);
    curSpaceUser = Creator.Collections["space_users"].findOne({
      space: spaceId,
      user: userId
    }, {
      fields: {
        organizations: 1
      }
    });

    if (!curSpaceUser) {
      throw new Meteor.Error('not-authorized');
    }

    organizations = Creator.getCollection('organizations').find({
      _id: {
        $in: curSpaceUser.organizations
      }
    }, {
      fields: {
        parents: 1
      }
    }).fetch();
    ows = Creator.getCollection('object_workflows').find({
      space: spaceId
    }, {
      fields: {
        object_name: 1,
        flow_id: 1,
        space: 1,
        sync_direction: 1
      }
    }).fetch();

    _.each(ows, function (o) {
      var fl, perms;
      fl = Creator.getCollection('flows').findOne({
        _id: o.flow_id,
        state: 'enabled'
      }, {
        fields: {
          name: 1,
          perms: 1,
          forbid_initiate_instance: 1
        }
      });

      if (fl) {
        o.flow_name = fl.name;
        o.can_add = false;
        o.forbid_initiate_instance = fl.forbid_initiate_instance;
        perms = fl.perms;

        if (perms) {
          if (perms.users_can_add && perms.users_can_add.includes(userId)) {
            return o.can_add = true;
          } else if (perms.orgs_can_add && perms.orgs_can_add.length > 0) {
            if (curSpaceUser && curSpaceUser.organizations && _.intersection(curSpaceUser.organizations, perms.orgs_can_add).length > 0) {
              return o.can_add = true;
            } else {
              if (organizations) {
                return o.can_add = _.some(organizations, function (org) {
                  return org.parents && _.intersection(org.parents, perms.orgs_can_add).length > 0;
                });
              }
            }
          }
        }
      }
    });

    ows = ows.filter(function (n) {
      return n.flow_name;
    });
    return ows;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update_server_session.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/update_server_session.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_space_user_password.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/set_space_user_password.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  setSpaceUserPassword: function (space_user_id, space_id, password) {
    var canEdit, changedUserInfo, companyIds, companys, currentUser, e, isSpaceAdmin, lang, logout, ref, ref1, ref2, space, spaceUser, userCP, userId, user_id;

    if (!this.userId) {
      throw new Meteor.Error(400, "请先登录");
    }

    spaceUser = db.space_users.findOne({
      _id: space_user_id,
      space: space_id
    });
    userId = this.userId;
    canEdit = spaceUser.user === userId;

    if (!canEdit) {
      space = db.spaces.findOne({
        _id: space_id
      });
      isSpaceAdmin = space != null ? (ref = space.admins) != null ? ref.includes(this.userId) : void 0 : void 0;
      canEdit = isSpaceAdmin;
    }

    companyIds = spaceUser.company_ids;

    if (!canEdit && companyIds && companyIds.length) {
      companys = Creator.getCollection("company").find({
        _id: {
          $in: companyIds
        },
        space: space_id
      }, {
        fields: {
          admins: 1
        }
      }).fetch();

      if (companys && companys.length) {
        canEdit = _.any(companys, function (item) {
          return item.admins && item.admins.indexOf(userId) > -1;
        });
      }
    }

    if (!canEdit) {
      throw new Meteor.Error(400, "您没有权限修改该用户密码");
    }

    user_id = spaceUser.user;
    userCP = db.users.findOne({
      _id: user_id
    });
    currentUser = db.users.findOne({
      _id: this.userId
    });

    if (spaceUser.invite_state === "pending" || spaceUser.invite_state === "refused") {
      throw new Meteor.Error(400, "该用户尚未同意加入该工作区，无法修改密码");
    }

    logout = true;

    if (this.userId === user_id) {
      logout = false;
    }

    Accounts.setPassword(user_id, {
      algorithm: 'sha-256',
      digest: password
    }, {
      logout: logout
    });
    changedUserInfo = db.users.findOne({
      _id: user_id
    });

    if (changedUserInfo) {
      db.users.update({
        _id: user_id
      }, {
        $push: {
          'services.password_history': (ref1 = changedUserInfo.services) != null ? (ref2 = ref1.password) != null ? ref2.bcrypt : void 0 : void 0
        }
      });
    }

    if (userCP.mobile && userCP.mobile_verified) {
      lang = 'en';

      if (userCP.locale === 'zh-cn') {
        lang = 'zh-CN';
      }

      SMSQueue.send({
        Format: 'JSON',
        Action: 'SingleSendSms',
        ParamString: '',
        RecNum: userCP.mobile,
        SignName: '华炎办公',
        TemplateCode: 'SMS_67200967',
        msg: TAPi18n.__('sms.change_password.template', {}, lang)
      });
    }

    try {
      return Creator.getCollection("operation_logs").insert({
        name: "修改密码",
        type: "change_password",
        remote_user: userId,
        status: 'success',
        space: space_id,
        message: "[系统管理员]修改了用户[" + (changedUserInfo != null ? changedUserInfo.name : void 0) + "]的密码",
        data: JSON.stringify({
          changeUser: user_id
        }),
        related_to: {
          o: "users",
          ids: [user_id]
        }
      });
    } catch (error) {
      e = error;
      return console.error(e);
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"billing_manager.coffee":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/lib/billing_manager.coffee                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
billingManager = {};

billingManager.get_accounting_period = function (space_id, accounting_month) {
  var billing, count_days, end_date, end_date_time, first_date, start_date, start_date_time;
  count_days = 0;
  end_date_time = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 0);
  end_date = moment(end_date_time.getTime()).format('YYYYMMDD');
  billing = db.billings.findOne({
    space: space_id,
    transaction: "Starting balance"
  });
  first_date = billing.billing_date;
  start_date = accounting_month + "01";
  start_date_time = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 1 - end_date_time.getDate());

  if (first_date >= end_date) {} else if (start_date <= first_date && first_date < end_date) {
    count_days = (end_date_time - start_date_time) / (24 * 60 * 60 * 1000) + 1;
  } else if (first_date < start_date) {
    count_days = (end_date_time - start_date_time) / (24 * 60 * 60 * 1000) + 1;
  }

  return {
    "count_days": count_days
  };
};

billingManager.refresh_balance = function (space_id, refresh_date) {
  var app_bill, b_m, b_m_d, bill, credits, debits, last_balance, last_bill, payment_bill, setObj;
  last_bill = null;
  bill = db.billings.findOne({
    space: space_id,
    created: refresh_date
  });
  payment_bill = db.billings.findOne({
    space: space_id,
    created: {
      $lt: refresh_date
    },
    billing_month: bill.billing_month
  }, {
    sort: {
      modified: -1
    }
  });

  if (payment_bill) {
    last_bill = payment_bill;
  } else {
    b_m_d = new Date(parseInt(bill.billing_month.slice(0, 4)), parseInt(bill.billing_month.slice(4, 6)), 0);
    b_m = moment(b_m_d.getTime() - b_m_d.getDate() * 24 * 60 * 60 * 1000).format("YYYYMM");
    app_bill = db.billings.findOne({
      space: space_id,
      billing_month: b_m
    }, {
      sort: {
        modified: -1
      }
    });

    if (app_bill) {
      last_bill = app_bill;
    }
  }

  last_balance = last_bill && last_bill.balance ? last_bill.balance : 0.0;
  debits = bill.debits ? bill.debits : 0.0;
  credits = bill.credits ? bill.credits : 0.0;
  setObj = new Object();
  setObj.balance = Number((last_balance + credits - debits).toFixed(2));
  setObj.modified = new Date();
  return db.billings.direct.update({
    _id: bill._id
  }, {
    $set: setObj
  });
};

billingManager.get_balance = function (space_id, accounting_month, user_count, count_days, module_name, listprice) {
  var accounting_date, accounting_date_format, days_number, debits, last_balance, last_bill, new_bill, now;
  accounting_date = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 0);
  days_number = accounting_date.getDate();
  accounting_date_format = moment(accounting_date).format("YYYYMMDD");
  debits = Number((count_days / days_number * user_count * listprice).toFixed(2));
  last_bill = db.billings.findOne({
    space: space_id,
    billing_date: {
      $lte: accounting_date_format
    }
  }, {
    sort: {
      modified: -1
    }
  });
  last_balance = last_bill && last_bill.balance ? last_bill.balance : 0.0;
  now = new Date();
  new_bill = new Object();
  new_bill._id = db.billings._makeNewID();
  new_bill.billing_month = accounting_month;
  new_bill.billing_date = accounting_date_format;
  new_bill.space = space_id;
  new_bill.transaction = module_name;
  new_bill.listprice = listprice;
  new_bill.user_count = user_count;
  new_bill.debits = debits;
  new_bill.balance = Number((last_balance - debits).toFixed(2));
  new_bill.created = now;
  new_bill.modified = now;
  return db.billings.direct.insert(new_bill);
};

billingManager.getSpaceUserCount = function (space_id) {
  return db.space_users.find({
    space: space_id,
    user_accepted: true
  }).count();
};

billingManager.recaculateBalance = function (accounting_month, space_id) {
  var refresh_dates;
  refresh_dates = new Array();
  db.billings.find({
    billing_month: accounting_month,
    space: space_id,
    transaction: {
      $in: ["Payment", "Service adjustment"]
    }
  }, {
    sort: {
      created: 1
    }
  }).forEach(function (bill) {
    return refresh_dates.push(bill.created);
  });

  if (refresh_dates.length > 0) {
    return _.each(refresh_dates, function (r_d) {
      return billingManager.refresh_balance(space_id, r_d);
    });
  }
};

billingManager.get_modules = function (space_id, accounting_month) {
  var end_date, end_date_time, modules, start_date;
  modules = new Array();
  start_date = accounting_month + "01";
  end_date_time = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 0);
  end_date = moment(end_date_time.getTime()).format('YYYYMMDD');
  db.modules.find().forEach(function (m) {
    var m_changelog;
    m_changelog = db.modules_changelogs.findOne({
      space: space_id,
      module: m.name,
      change_date: {
        $lte: end_date
      }
    }, {
      created: -1
    });

    if (!m_changelog) {} else if (m_changelog.change_date < start_date && m_changelog.operation === "install") {
      return modules.push(m);
    } else if (m_changelog.change_date < start_date && m_changelog.operation === "uninstall") {} else if (m_changelog.change_date >= start_date) {
      return modules.push(m);
    }
  });
  return modules;
};

billingManager.get_modules_name = function () {
  var modules_name;
  modules_name = new Array();
  db.modules.find().forEach(function (m) {
    return modules_name.push(m.name);
  });
  return modules_name;
};

billingManager.caculate_by_accounting_month = function (accounting_month, space_id) {
  var a_m, accounting_date, accounting_date_format, b_m, b_m_d, balance, debits, modules, modules_name, newest_bill, period_result, remaining_months, user_count;

  if (accounting_month > moment().format('YYYYMM')) {
    return;
  }

  if (accounting_month === moment().format('YYYYMM')) {
    billingManager.recaculateBalance(accounting_month, space_id);
    debits = 0;
    modules_name = billingManager.get_modules_name();
    b_m_d = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 0);
    b_m = moment(b_m_d.getTime() - b_m_d.getDate() * 24 * 60 * 60 * 1000).format("YYYYMMDD");
    db.billings.find({
      billing_date: b_m,
      space: space_id,
      transaction: {
        $in: modules_name
      }
    }).forEach(function (b) {
      return debits += b.debits;
    });
    newest_bill = db.billings.findOne({
      space: space_id
    }, {
      sort: {
        modified: -1
      }
    });
    balance = newest_bill.balance;
    remaining_months = 0;

    if (balance > 0) {
      if (debits > 0) {
        remaining_months = parseInt(balance / debits) + 1;
      } else {
        remaining_months = 1;
      }
    }

    return db.spaces.direct.update({
      _id: space_id
    }, {
      $set: {
        balance: balance,
        "billing.remaining_months": remaining_months
      }
    });
  } else {
    period_result = billingManager.get_accounting_period(space_id, accounting_month);

    if (period_result["count_days"] === 0) {
      billingManager.recaculateBalance(accounting_month, space_id);
    } else {
      user_count = billingManager.getSpaceUserCount(space_id);
      modules_name = billingManager.get_modules_name();
      accounting_date = new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 0);
      accounting_date_format = moment(accounting_date).format("YYYYMMDD");
      db.billings.remove({
        billing_date: accounting_date_format,
        space: space_id,
        transaction: {
          $in: modules_name
        }
      });
      billingManager.recaculateBalance(accounting_month, space_id);
      modules = billingManager.get_modules(space_id, accounting_month);

      if (modules && modules.length > 0) {
        _.each(modules, function (m) {
          return billingManager.get_balance(space_id, accounting_month, user_count, period_result["count_days"], m.name, m.listprice);
        });
      }
    }

    a_m = moment(new Date(parseInt(accounting_month.slice(0, 4)), parseInt(accounting_month.slice(4, 6)), 1).getTime()).format("YYYYMM");
    return billingManager.caculate_by_accounting_month(a_m, space_id);
  }
};

billingManager.special_pay = function (space_id, module_names, total_fee, operator_id, end_date, user_count) {
  var m, modules, new_modules, now, r, space, space_update_obj;
  space = db.spaces.findOne(space_id);
  modules = space.modules || new Array();
  new_modules = _.difference(module_names, modules);
  m = moment();
  now = m._d;
  space_update_obj = new Object();

  if (space.is_paid !== true) {
    space_update_obj.is_paid = true;
    space_update_obj.start_date = new Date();
  }

  space_update_obj.modules = module_names;
  space_update_obj.modified = now;
  space_update_obj.modified_by = operator_id;
  space_update_obj.end_date = new Date(end_date);
  space_update_obj.user_limit = user_count;
  r = db.spaces.direct.update({
    _id: space_id
  }, {
    $set: space_update_obj
  });

  if (r) {
    _.each(new_modules, function (module) {
      var mcl;
      mcl = new Object();
      mcl._id = db.modules_changelogs._makeNewID();
      mcl.change_date = m.format("YYYYMMDD");
      mcl.operator = operator_id;
      mcl.space = space_id;
      mcl.operation = "install";
      mcl.module = module;
      mcl.created = now;
      return db.modules_changelogs.insert(mcl);
    });
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"schedule":{"statistics.js":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/schedule/statistics.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Meteor.startup(function () {
  if (Meteor.settings.cron && Meteor.settings.cron.statistics) {
    var schedule = require('node-schedule'); // 定时执行统计


    var rule = Meteor.settings.cron.statistics;
    var go_next = true;
    schedule.scheduleJob(rule, Meteor.bindEnvironment(function () {
      if (!go_next) return;
      go_next = false;
      console.time('statistics'); // 日期格式化 

      var dateFormat = function (date) {
        var datekey = "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        return datekey;
      }; // 计算前一天时间


      var yesterDay = function () {
        var dNow = new Date(); //当前时间

        var dBefore = new Date(dNow.getTime() - 24 * 3600 * 1000); //得到前一天的时间

        return dBefore;
      }; // 统计当日数据


      var dailyStaticsCount = function (collection, space) {
        var statics = collection.find({
          "space": space["_id"],
          "created": {
            $gt: yesterDay()
          }
        });
        return statics.count();
      }; // 查询总数


      var staticsCount = function (collection, space) {
        var statics = collection.find({
          "space": space["_id"]
        });
        return statics.count();
      }; // 查询拥有者名字


      var ownerName = function (collection, space) {
        var owner = collection.findOne({
          "_id": space["owner"]
        });
        var name = owner.name;
        return name;
      }; // 最近登录日期


      var lastLogon = function (collection, space) {
        var lastLogon = 0;
        var sUsers = db.space_users.find({
          "space": space["_id"]
        }, {
          fields: {
            user: 1
          }
        });
        sUsers.forEach(function (sUser) {
          var user = collection.findOne({
            "_id": sUser["user"]
          });

          if (user && lastLogon < user.last_logon) {
            lastLogon = user.last_logon;
          }
        });
        return lastLogon;
      }; // 最近修改日期


      var lastModified = function (collection, space) {
        var obj = collection.find({
          "space": space["_id"]
        }, {
          sort: {
            modified: -1
          },
          limit: 1
        });
        var objArr = obj.fetch();
        if (objArr.length > 0) var mod = objArr[0].modified;
        return mod;
      }; // 文章附件大小


      var postsAttachments = function (collection, space) {
        var attSize = 0;
        var sizeSum = 0;
        var posts = collection.find({
          "space": space["_id"]
        });
        posts.forEach(function (post) {
          var atts = cfs.posts.find({
            "post": post["_id"]
          });
          atts.forEach(function (att) {
            attSize = att.original.size;
            sizeSum += attSize;
          });
        });
        return sizeSum;
      }; // 当日新增附件大小


      var dailyPostsAttachments = function (collection, space) {
        var attSize = 0;
        var sizeSum = 0;
        var posts = collection.find({
          "space": space["_id"]
        });
        posts.forEach(function (post) {
          var atts = cfs.posts.find({
            "post": post["_id"],
            "uploadedAt": {
              $gt: yesterDay()
            }
          });
          atts.forEach(function (att) {
            attSize = att.original.size;
            sizeSum += attSize;
          });
        });
        return sizeSum;
      }; // 插入数据


      db.spaces.find({
        "is_paid": true
      }).forEach(function (space) {
        db.steedos_statistics.insert({
          space: space["_id"],
          space_name: space["name"],
          balance: space["balance"],
          owner_name: ownerName(db.users, space),
          created: new Date(),
          steedos: {
            users: staticsCount(db.space_users, space),
            organizations: staticsCount(db.organizations, space),
            last_logon: lastLogon(db.users, space)
          },
          workflow: {
            flows: staticsCount(db.flows, space),
            forms: staticsCount(db.forms, space),
            flow_roles: staticsCount(db.flow_roles, space),
            flow_positions: staticsCount(db.flow_positions, space),
            instances: staticsCount(db.instances, space),
            instances_last_modified: lastModified(db.instances, space),
            daily_flows: dailyStaticsCount(db.flows, space),
            daily_forms: dailyStaticsCount(db.forms, space),
            daily_instances: dailyStaticsCount(db.instances, space)
          },
          cms: {
            sites: staticsCount(db.cms_sites, space),
            posts: staticsCount(db.cms_posts, space),
            posts_last_modified: lastModified(db.cms_posts, space),
            posts_attachments_size: postsAttachments(db.cms_posts, space),
            comments: staticsCount(db.cms_comments, space),
            daily_sites: dailyStaticsCount(db.cms_sites, space),
            daily_posts: dailyStaticsCount(db.cms_posts, space),
            daily_comments: dailyStaticsCount(db.cms_comments, space),
            daily_posts_attachments_size: dailyPostsAttachments(db.cms_posts, space)
          }
        });
      });
      console.timeEnd('statistics');
      go_next = true;
    }, function (e) {
      console.log('Failed to bind environment: statistics.js');
      console.log(e.stack);
    }));
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"billing.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/schedule/billing.coffee                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"startup":{"migrations":{"v1.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v1.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 1,
    name: '在线编辑时，需给文件增加lock 属性，防止多人同时编辑 #429, 附件页面使用cfs显示',
    up: function () {
      var e, i, update_cfs_instance;
      console.time('upgrade_cfs_instance');

      try {
        update_cfs_instance = function (parent_id, space_id, instance_id, attach_version, isCurrent) {
          var metadata;
          metadata = {
            parent: parent_id,
            owner: attach_version['created_by'],
            owner_name: attach_version['created_by_name'],
            space: space_id,
            instance: instance_id,
            approve: attach_version['approve']
          };

          if (isCurrent) {
            metadata.current = true;
          }

          return cfs.instances.update({
            _id: attach_version['_rev']
          }, {
            $set: {
              metadata: metadata
            }
          });
        };

        i = 0;
        db.instances.find({
          "attachments.current": {
            $exists: true
          }
        }, {
          sort: {
            modified: -1
          },
          fields: {
            space: 1,
            attachments: 1
          }
        }).forEach(function (ins) {
          var attachs, instance_id, space_id;
          attachs = ins.attachments;
          space_id = ins.space;
          instance_id = ins._id;
          attachs.forEach(function (att) {
            var current_ver, parent_id;
            current_ver = att.current;
            parent_id = current_ver._rev;
            update_cfs_instance(parent_id, space_id, instance_id, current_ver, true);

            if (att.historys) {
              return att.historys.forEach(function (his) {
                return update_cfs_instance(parent_id, space_id, instance_id, his, false);
              });
            }
          });
          return i++;
        });
      } catch (error) {
        e = error;
        console.error(e);
      }

      return console.timeEnd('upgrade_cfs_instance');
    },
    down: function () {
      return console.log('version 1 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v2.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v2.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 2,
    name: '组织结构允许一个人属于多个部门 #379',
    up: function () {
      var collection, e;
      console.log('version 2 up');
      console.time('upgrade_space_user');

      try {
        collection = db.space_users;
        collection.find({
          organizations: {
            $exists: false
          }
        }, {
          fields: {
            organization: 1
          }
        }).forEach(function (su) {
          if (su.organization) {
            return collection.direct.update(su._id, {
              $set: {
                organizations: [su.organization]
              }
            });
          }
        });
      } catch (error) {
        e = error;
        console.error(e);
      }

      return console.timeEnd('upgrade_space_user');
    },
    down: function () {
      return console.log('version 2 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v3.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v3.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 3,
    name: '给space_users表email字段赋值',
    up: function () {
      var collection, e;
      console.log('version 3 up');
      console.time('upgrade_space_user_email');

      try {
        collection = db.space_users;
        collection.find({
          email: {
            $exists: false
          }
        }, {
          fields: {
            user: 1
          }
        }).forEach(function (su) {
          var address, u;

          if (su.user) {
            u = db.users.findOne({
              _id: su.user
            }, {
              fields: {
                emails: 1
              }
            });

            if (u && u.emails && u.emails.length > 0) {
              if (/^([A-Z0-9\.\-\_\+])*([A-Z0-9\+\-\_])+\@[A-Z0-9]+([\-][A-Z0-9]+)*([\.][A-Z0-9\-]+){1,8}$/i.test(u.emails[0].address)) {
                address = u.emails[0].address;
                return collection.direct.update(su._id, {
                  $set: {
                    email: address
                  }
                });
              }
            }
          }
        });
      } catch (error) {
        e = error;
        console.error(e);
      }

      return console.timeEnd('upgrade_space_user_email');
    },
    down: function () {
      return console.log('version 3 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v4.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v4.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 4,
    name: '给organizations表设置sort_no',
    up: function () {
      var e;
      console.log('version 4 up');
      console.time('upgrade_organizations_sort_no');

      try {
        db.organizations.direct.update({
          sort_no: {
            $exists: false
          }
        }, {
          $set: {
            sort_no: 100
          }
        }, {
          multi: true
        });
      } catch (error) {
        e = error;
        console.error(e);
      }

      return console.timeEnd('upgrade_organizations_sort_no');
    },
    down: function () {
      return console.log('version 4 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v5.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v5.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 5,
    name: '解决删除organization导致space_user数据错误的问题',
    up: function () {
      var e;
      console.log('version 5 up');
      console.time('fix_space_user_organizations');

      try {
        db.space_users.find().forEach(function (su) {
          var check_count, new_org_ids, r, removed_org_ids, root_org;

          if (!su.organizations) {
            return;
          }

          if (su.organizations.length === 1) {
            check_count = db.organizations.find(su.organizations[0]).count();

            if (check_count === 0) {
              root_org = db.organizations.findOne({
                space: su.space,
                parent: null
              });

              if (root_org) {
                r = db.space_users.direct.update({
                  _id: su._id
                }, {
                  $set: {
                    organizations: [root_org._id],
                    organization: root_org._id
                  }
                });

                if (r) {
                  return root_org.updateUsers();
                }
              } else {
                console.error("fix_space_user_organizations");
                return console.error(su._id);
              }
            }
          } else if (su.organizations.length > 1) {
            removed_org_ids = [];
            su.organizations.forEach(function (o) {
              check_count = db.organizations.find(o).count();

              if (check_count === 0) {
                return removed_org_ids.push(o);
              }
            });

            if (removed_org_ids.length > 0) {
              new_org_ids = _.difference(su.organizations, removed_org_ids);

              if (new_org_ids.includes(su.organization)) {
                return db.space_users.direct.update({
                  _id: su._id
                }, {
                  $set: {
                    organizations: new_org_ids
                  }
                });
              } else {
                return db.space_users.direct.update({
                  _id: su._id
                }, {
                  $set: {
                    organizations: new_org_ids,
                    organization: new_org_ids[0]
                  }
                });
              }
            }
          }
        });
      } catch (error) {
        e = error;
        console.error("fix_space_user_organizations");
        console.error(e.stack);
      }

      return console.timeEnd('fix_space_user_organizations');
    },
    down: function () {
      return console.log('version 5 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v6.coffee":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/v6.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return Migrations.add({
    version: 6,
    name: '财务系统升级',
    up: function () {
      var e, start_date;
      console.log('version 6 up');
      console.time('billing upgrade');

      try {
        db.modules.remove({});
        db.modules.insert({
          "_id": "workflow.standard",
          "name_en": "Workflow Standard",
          "name": "workflow.standard",
          "name_zh": "审批王基础版",
          "listprice": 1.0,
          "listprice_rmb": 2
        });
        db.modules.insert({
          "_id": "workflow.professional",
          "name_en": "Workflow Professional",
          "name": "workflow.professional",
          "name_zh": "审批王专业版扩展包",
          "listprice": 3.0,
          "listprice_rmb": 18
        });
        db.modules.insert({
          "_id": "workflow.enterprise",
          "name_en": "Workflow Enterprise",
          "name": "workflow.enterprise",
          "name_zh": "审批王企业版扩展包",
          "listprice": 6.0,
          "listprice_rmb": 40
        });
        start_date = new Date(moment(new Date()).format("YYYY-MM-DD"));
        db.spaces.find({
          is_paid: true,
          user_limit: {
            $exists: false
          },
          modules: {
            $exists: true
          }
        }).forEach(function (s) {
          var balance, e, end_date, listprices, months, set_obj, user_count;

          try {
            set_obj = {};
            user_count = db.space_users.find({
              space: s._id,
              user_accepted: true
            }).count();
            set_obj.user_limit = user_count;
            balance = s.balance;

            if (balance > 0) {
              months = 0;
              listprices = 0;

              _.each(s.modules, function (pm) {
                var module;
                module = db.modules.findOne({
                  name: pm
                });

                if (module && module.listprice) {
                  return listprices += module.listprice;
                }
              });

              months = parseInt((balance / (listprices * user_count)).toFixed()) + 1;
              end_date = new Date();
              end_date.setMonth(end_date.getMonth() + months);
              end_date = new Date(moment(end_date).format("YYYY-MM-DD"));
              set_obj.start_date = start_date;
              set_obj.end_date = end_date;
            } else if (balance <= 0) {
              set_obj.start_date = start_date;
              set_obj.end_date = new Date();
            }

            s.modules.push("workflow.standard");
            set_obj.modules = _.uniq(s.modules);
            return db.spaces.direct.update({
              _id: s._id
            }, {
              $set: set_obj
            });
          } catch (error) {
            e = error;
            console.error("billing space upgrade");
            console.error(s._id);
            console.error(set_obj);
            return console.error(e.stack);
          }
        });
      } catch (error) {
        e = error;
        console.error("billing upgrade");
        console.error(e.stack);
      }

      return console.timeEnd('billing upgrade');
    },
    down: function () {
      return console.log('version 6 down');
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"xrun.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/xrun.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/startup.coffee                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  var rootURL;
  rootURL = Meteor.absoluteUrl();

  if (!Meteor.settings["public"].webservices) {
    Meteor.settings["public"].webservices = {
      "creator": {
        "url": rootURL
      }
    };
  }

  if (!Meteor.settings["public"].webservices.creator) {
    Meteor.settings["public"].webservices.creator = {
      "url": rootURL
    };
  }

  if (!Meteor.settings["public"].webservices.creator.url) {
    return Meteor.settings["public"].webservices.creator.url = rootURL;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"development.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/development.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
if (process.env.CREATOR_NODE_ENV == 'development') {
  //Meteor 版本升级到1.9 及以上时(node 版本 11+)，可以删除此代码
  Object.defineProperty(Array.prototype, 'flat', {
    value: function () {
      let depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) && depth > 1 ? toFlatten.flat(depth - 1) : toFlatten);
      }, []);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"tabular.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/tabular.coffee                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return new Tabular.Table({
    name: "customize_apps",
    collection: db.apps,
    columns: [{
      data: "name",
      orderable: false
    }],
    dom: "tp",
    extraFields: ["_id", "space"],
    lengthChange: false,
    ordering: false,
    pageLength: 10,
    info: false,
    searching: true,
    autoWidth: true,
    changeSelector: function (selector, userId) {
      var ref, space;

      if (!userId) {
        return {
          _id: -1
        };
      }

      space = selector.space;

      if (!space) {
        if ((selector != null ? (ref = selector.$and) != null ? ref.length : void 0 : void 0) > 0) {
          space = selector.$and.getProperty('space')[0];
        }
      }

      if (!space) {
        return {
          _id: -1
        };
      }

      return selector;
    }
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:base/checkNpm.js");
require("/node_modules/meteor/steedos:base/lib/steedos_util.js");
require("/node_modules/meteor/steedos:base/lib/core.coffee");
require("/node_modules/meteor/steedos:base/lib/simple_schema_extend.js");
require("/node_modules/meteor/steedos:base/routes/api_get_apps.coffee");
require("/node_modules/meteor/steedos:base/routes/collection.coffee");
require("/node_modules/meteor/steedos:base/routes/sso.coffee");
require("/node_modules/meteor/steedos:base/routes/avatar.coffee");
require("/node_modules/meteor/steedos:base/routes/access_token.coffee");
require("/node_modules/meteor/steedos:base/server/publications/apps.coffee");
require("/node_modules/meteor/steedos:base/server/publications/my_spaces.coffee");
require("/node_modules/meteor/steedos:base/server/publications/space_avatar.coffee");
require("/node_modules/meteor/steedos:base/server/publications/modules.coffee");
require("/node_modules/meteor/steedos:base/server/publications/weixin_pay_code_url.coffee");
require("/node_modules/meteor/steedos:base/server/methods/my_contacts_limit.coffee");
require("/node_modules/meteor/steedos:base/server/methods/setKeyValue.js");
require("/node_modules/meteor/steedos:base/server/methods/setUsername.coffee");
require("/node_modules/meteor/steedos:base/server/methods/get_space_user_count.coffee");
require("/node_modules/meteor/steedos:base/server/methods/user_secret.coffee");
require("/node_modules/meteor/steedos:base/server/methods/object_workflows.coffee");
require("/node_modules/meteor/steedos:base/server/methods/update_server_session.coffee");
require("/node_modules/meteor/steedos:base/server/methods/set_space_user_password.coffee");
require("/node_modules/meteor/steedos:base/server/lib/billing_manager.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/apps_init.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/utc_offset.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/last_logon.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/user_add_email.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/user_avatar.coffee");
require("/node_modules/meteor/steedos:base/lib/steedos/push.coffee");
require("/node_modules/meteor/steedos:base/lib/methods/email_templates_reset.js");
require("/node_modules/meteor/steedos:base/lib/methods/upgrade_data.js");
require("/node_modules/meteor/steedos:base/lib/admin.coffee");
require("/node_modules/meteor/steedos:base/lib/array_includes.js");
require("/node_modules/meteor/steedos:base/lib/settings.coffee");
require("/node_modules/meteor/steedos:base/lib/user_object_view.coffee");
require("/node_modules/meteor/steedos:base/lib/server_session.js");
require("/node_modules/meteor/steedos:base/server/schedule/statistics.js");
require("/node_modules/meteor/steedos:base/server/schedule/billing.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v1.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v2.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v3.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v4.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v5.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/v6.coffee");
require("/node_modules/meteor/steedos:base/server/steedos/startup/migrations/xrun.coffee");
require("/node_modules/meteor/steedos:base/tabular.coffee");
require("/node_modules/meteor/steedos:base/server/startup.coffee");
require("/node_modules/meteor/steedos:base/server/development.js");

/* Exports */
Package._define("steedos:base", {
  Selector: Selector,
  Steedos: Steedos,
  AjaxCollection: AjaxCollection,
  SteedosDataManager: SteedosDataManager,
  SteedosOffice: SteedosOffice,
  billingManager: billingManager
});

})();

//# sourceURL=meteor://💻app/packages/steedos_base.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsInJlZiIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyb290VXJsIiwic2V0dGluZ3MiLCJkYiIsInN1YnMiLCJpc1Bob25lRW5hYmxlZCIsIk1ldGVvciIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsIm51bWJlclRvUGVyY2VudFN0cmluZyIsIm5ld051bWJlciIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImF1dGhSZXF1ZXN0IiwidXJsIiwib3B0aW9ucyIsImF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJkZWZPcHRpb25zIiwiZXJyIiwiaGVhZGVycyIsInJlc3VsdCIsInNwYWNlSWQiLCJ1c2VyU2Vzc2lvbiIsIkNyZWF0b3IiLCJVU0VSX0NPTlRFWFQiLCJ1c2VyIiwiYWJzb2x1dGVVcmwiLCJ2YWx1ZSIsInR5cGUiLCJkYXRhVHlwZSIsImNvbnRlbnRUeXBlIiwiYmVmb3JlU2VuZCIsIlhIUiIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJzdWNjZXNzIiwiZGF0YSIsImVycm9yIiwiWE1MSHR0cFJlcXVlc3QiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJlcnJvckluZm8iLCJlcnJvck1zZyIsImNvbnNvbGUiLCJyZXNwb25zZUpTT04iLCJyZWFzb24iLCJtZXNzYWdlIiwidG9hc3RyIiwiJCIsImFqYXgiLCJhc3NpZ24iLCJlcnJvcjEiLCJpc0NvcmRvdmEiLCJpc0NsaWVudCIsImRlZmF1bHRPcHRpb25zIiwiZW5kc1dpdGgiLCJzdWJzdHIiLCJ3aW5kb3ciLCJzdG9yZXMiLCJBUEkiLCJjbGllbnQiLCJzZXRVcmwiLCJTZXR0aW5ncyIsInNldFJvb3RVcmwiLCJzdGFydHVwIiwicmVmNSIsInJlZjYiLCJyZWY3IiwicmVmOCIsInNldEhyZWZQb3B1cCIsInVpIiwiaHJlZl9wb3B1cCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNFeHByZXNzaW9uIiwiZnVuYyIsInBhdHRlcm4iLCJyZWcxIiwicmVnMiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsImZvcm1EYXRhIiwiZGF0YVBhdGgiLCJnbG9iYWwiLCJmdW5jQm9keSIsImdldFBhcmVudFBhdGgiLCJnZXRWYWx1ZUJ5UGF0aCIsImdsb2JhbFRhZyIsInBhcmVudCIsInBhcmVudFBhdGgiLCJwYXRoIiwicGF0aEFyciIsInNwbGl0IiwicG9wIiwiam9pbiIsIl8iLCJnZXQiLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJsb2ciLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXJJZCIsImtleSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJzaG93SGVscCIsImdldExvY2FsZSIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhcHBzIiwiaXNfbmV3X3dpbmRvdyIsImlzTW9iaWxlIiwibG9jYXRpb24iLCJvcGVuV2luZG93Iiwib3BlblVybFdpdGhJRSIsImNtZCIsImV4ZWMiLCJvcGVuX3VybCIsImlzTm9kZSIsIm53IiwicmVxdWlyZSIsInN0ZG91dCIsInN0ZGVyciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicmVkaXJlY3RUb1NpZ25JbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsInN0YWNrIiwiU2Vzc2lvbiIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImNzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJjb29raWVzIiwicGFzc3dvcmQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiY29kZSIsImZ1bmN0aW9ucyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlZjEwIiwicmVmOSIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJwb2xpY3llcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldERCRGFzaGJvYXJkcyIsImRiRGFzaGJvYXJkcyIsImRhc2hib2FyZCIsImdldEF1dGhUb2tlbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZvcmVpZ25fa2V5IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJyZWZlcmVuY2VzIiwibWV0aG9kcyIsInVwZGF0ZVVzZXJMYXN0TG9nb24iLCIkc2V0IiwibGFzdF9sb2dvbiIsIm9uTG9naW4iLCJ1c2Vyc19hZGRfZW1haWwiLCJlbWFpbCIsImNvdW50IiwiZW1haWxzIiwiZGlyZWN0IiwiJHB1c2giLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJ1c2Vyc19yZW1vdmVfZW1haWwiLCJwIiwiJHB1bGwiLCJ1c2Vyc192ZXJpZnlfZW1haWwiLCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbCIsInByaW1hcnkiLCJtdWx0aSIsInNob3dDYW5jZWxCdXR0b24iLCJjbG9zZU9uQ29uZmlybSIsImFuaW1hdGlvbiIsImlucHV0VmFsdWUiLCJ1cGRhdGVVc2VyQXZhdGFyIiwiZW1haWxUZW1wbGF0ZXMiLCJkZWZhdWx0RnJvbSIsInJlc2V0UGFzc3dvcmQiLCJzdWJqZWN0Iiwic3BsaXRzIiwidG9rZW5Db2RlIiwiZ3JlZXRpbmciLCJwcm9maWxlIiwidG9rZW5fY29kZSIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZCIsIm9yZ3MiLCJmdWxsbmFtZSIsIiRuZSIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwicmV0IiwibXNnIiwiUHVzaCIsIkNvbmZpZ3VyZSIsInNlbmRlcklEIiwiQU5EUk9JRF9TRU5ERVJfSUQiLCJzb3VuZCIsInZpYnJhdGUiLCJpb3MiLCJiYWRnZSIsImNsZWFyQmFkZ2UiLCJhbGVydCIsImFwcE5hbWUiLCJTZWxlY3RvciIsInNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluIiwic2VsZWN0b3IiLCJpc19jbG91ZGFkbWluIiwibWFwIiwibiIsInNlbGVjdG9yQ2hlY2tTcGFjZSIsInUiLCJiaWxsaW5nX3BheV9yZWNvcmRzIiwiYWRtaW5Db25maWciLCJpY29uIiwiY29sb3IiLCJ0YWJsZUNvbHVtbnMiLCJleHRyYUZpZWxkcyIsInJvdXRlckFkbWluIiwicGFpZCIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsImRpc2FibGVBZGQiLCJwYWdlTGVuZ3RoIiwib3JkZXIiLCJzcGFjZV91c2VyX3NpZ25zIiwiQWRtaW5Db25maWciLCJjb2xsZWN0aW9uc19hZGQiLCJzZWFyY2hFbGVtZW50IiwiTyIsImN1cnJlbnRFbGVtZW50Iiwid2Vic2VydmljZXMiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwic3RlZWRvc0F1dGgiLCJhbGxvd19tb2RlbHMiLCJtb2RlbCIsIlN0cmluZyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZ2V0UmVsYXRpdmVVcmwiLCJhdmF0YXJVcmwiLCJmaWxlIiwid3JpdGUiLCJpdGVtIiwiY2hhckNvZGVBdCIsInRvVXBwZXJDYXNlIiwidG9VVENTdHJpbmciLCJyZWFkU3RyZWFtIiwicGlwZSIsInB1Ymxpc2giLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsInN5bmNfZGlyZWN0aW9uIiwiZmwiLCJwZXJtcyIsInN0YXRlIiwiZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY2FuRWRpdCIsImNoYW5nZWRVc2VySW5mbyIsImNvbXBhbnlJZHMiLCJjb21wYW55cyIsImN1cnJlbnRVc2VyIiwibGFuZyIsImxvZ291dCIsInVzZXJDUCIsImNvbXBhbnlfaWRzIiwiYW55Iiwic2V0UGFzc3dvcmQiLCJhbGdvcml0aG0iLCJkaWdlc3QiLCJzZXJ2aWNlcyIsImJjcnlwdCIsIm1vYmlsZV92ZXJpZmllZCIsIlNNU1F1ZXVlIiwic2VuZCIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJyZW1vdGVfdXNlciIsImNoYW5nZVVzZXIiLCJyZWxhdGVkX3RvIiwiaWRzIiwiYmlsbGluZ01hbmFnZXIiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJhY2NvdW50aW5nX21vbnRoIiwiYmlsbGluZyIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwibW9tZW50IiwiZm9ybWF0IiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwidXNlcl9jb3VudCIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsInNwZWNpYWxfcGF5IiwibW9kdWxlX25hbWVzIiwidG90YWxfZmVlIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJpc19wYWlkIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJ0aW1lIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsInNpemUiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwidGltZUVuZCIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwicyIsImxpc3RwcmljZXMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJkZWZpbmVQcm9wZXJ0eSIsImRlcHRoIiwicmVkdWNlIiwiZmxhdCIsInRvRmxhdHRlbiIsImlzQXJyYXkiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJpbmZvIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxD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QUNTRzs7QURSSixhQUFPZ1IsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgaWYgKCF0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWxvY2FsZSl7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcbiAgICB9XG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXG4gICAgICAgIH1lbHNle1xuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xuXHRcdH1cbiAgICB9KTtcbn07XG5cblxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcbiAgICAgICAgdi5wdXNoKG0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2O1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcbiAqL1xuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgZyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgZy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxuICovXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIHIgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICByID0gdDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByO1xufSIsIlN0ZWVkb3MgPVxuXHRzZXR0aW5nczoge31cblx0ZGI6IGRiXG5cdHN1YnM6IHt9XG5cdGlzUGhvbmVFbmFibGVkOiAtPlxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcyktPlxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcblxuXHRcdGlmICFudW1iZXJcblx0XHRcdHJldHVybiAnJztcblxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXG5cdFx0XHRpZiBzY2FsZSB8fCBzY2FsZSA9PSAwXG5cdFx0XHRcdG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpXG5cdFx0XHR1bmxlc3Mgbm90VGhvdXNhbmRzXG5cdFx0XHRcdGlmICEoc2NhbGUgfHwgc2NhbGUgPT0gMClcblx0XHRcdFx0XHQjIOayoeWumuS5iXNjYWxl5pe277yM5qC55o2u5bCP5pWw54K55L2N572u566X5Ye6c2NhbGXlgLxcblx0XHRcdFx0XHRzY2FsZSA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLyk/WzFdPy5sZW5ndGhcblx0XHRcdFx0XHR1bmxlc3Mgc2NhbGVcblx0XHRcdFx0XHRcdHNjYWxlID0gMFxuXHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2dcblx0XHRcdFx0aWYgc2NhbGUgPT0gMFxuXHRcdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZ1xuXHRcdFx0XHRudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKVxuXHRcdFx0cmV0dXJuIG51bWJlclxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcIlwiXG5cdG51bWJlclRvUGVyY2VudFN0cmluZzogKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykgLT5cblx0XHRuZXdOdW1iZXIgPSBOdW1iZXIgKG51bWJlciAqIDEwMCkudG9GaXhlZChzY2FsZSlcblx0XHRyZXR1cm4gU3RlZWRvcy5udW1iZXJUb1N0cmluZyhuZXdOdW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpICsgXCIlXCJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXG5cdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKVxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXG5cdGF1dGhSZXF1ZXN0OiAodXJsLCBvcHRpb25zKSAtPlxuXHRcdHVzZXJTZXNzaW9uID0gQ3JlYXRvci5VU0VSX0NPTlRFWFRcblx0XHRzcGFjZUlkID0gdXNlclNlc3Npb24uc3BhY2VJZFxuXHRcdGF1dGhUb2tlbiA9IGlmIHVzZXJTZXNzaW9uLmF1dGhUb2tlbiB0aGVuIHVzZXJTZXNzaW9uLmF1dGhUb2tlbiBlbHNlIHVzZXJTZXNzaW9uLnVzZXIuYXV0aFRva2VuXG5cdFx0cmVzdWx0ID0gbnVsbFxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKVxuXHRcdHRyeVxuXHRcdFx0YXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHNwYWNlSWQgKyAnLCcgKyBhdXRoVG9rZW5cblx0XHRcdGhlYWRlcnMgPSBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnQ29udGVudC1UeXBlJ1xuXHRcdFx0XHRcdHZhbHVlOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdFx0fVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ0F1dGhvcml6YXRpb24nXG5cdFx0XHRcdFx0dmFsdWU6IGF1dGhvcml6YXRpb25cblx0XHRcdFx0fVxuXHRcdFx0XVxuXHRcdFx0ZGVmT3B0aW9ucyA9IFxuXHRcdFx0dHlwZTogJ2dldCdcblx0XHRcdHVybDogdXJsXG5cdFx0XHRkYXRhVHlwZTogJ2pzb24nXG5cdFx0XHRjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHRiZWZvcmVTZW5kOiAoWEhSKSAtPlxuXHRcdFx0XHRpZiBoZWFkZXJzIGFuZCBoZWFkZXJzLmxlbmd0aFxuXHRcdFx0XHRcdHJldHVybiBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgLT5cblx0XHRcdFx0XHRcdFhIUi5zZXRSZXF1ZXN0SGVhZGVyIGhlYWRlci5uYW1lLCBoZWFkZXIudmFsdWVcblx0XHRcdFx0XHQpXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0c3VjY2VzczogKGRhdGEpIC0+XG5cdFx0XHRcdHJlc3VsdCA9IGRhdGFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlcnJvcjogKFhNTEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikgLT5cblx0XHRcdFx0Y29uc29sZS5lcnJvciBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT05cblx0XHRcdFx0aWYgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OIGFuZCBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04uZXJyb3Jcblx0XHRcdFx0XHRlcnJvckluZm8gPSBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04uZXJyb3Jcblx0XHRcdFx0XHRyZXN1bHQgPSBlcnJvcjogZXJyb3JJbmZvXG5cdFx0XHRcdFx0ZXJyb3JNc2cgPSB1bmRlZmluZWRcblx0XHRcdFx0XHRpZiBlcnJvckluZm8ucmVhc29uXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IGVycm9ySW5mby5yZWFzb25cblx0XHRcdFx0XHRlbHNlIGlmIGVycm9ySW5mby5tZXNzYWdlXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IGVycm9ySW5mby5tZXNzYWdlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBlcnJvckluZm9cblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciB0KGVycm9yTXNnLnJlcGxhY2UoLzovZywgJ++8micpKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dG9hc3RyLmVycm9yIFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTlxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCQuYWpheCBPYmplY3QuYXNzaWduKHt9LCBkZWZPcHRpb25zLCBvcHRpb25zKVxuXHRcdFx0cmV0dXJuIHJlc3VsdFxuXHRcdGNhdGNoIGVyclxuXHRcdFx0Y29uc29sZS5lcnJvciBlcnJcblx0XHRcdHRvYXN0ci5lcnJvciBlcnJcblx0XHRyZXR1cm5cblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuIyBpZiBNZXRlb3IuaXNDb3Jkb3ZhXG5pZiBNZXRlb3IuaXNDb3Jkb3ZhIHx8IE1ldGVvci5pc0NsaWVudFxuXHRyb290VXJsID0gTWV0ZW9yLmFic29sdXRlVXJsLmRlZmF1bHRPcHRpb25zLnJvb3RVcmxcblx0aWYgcm9vdFVybC5lbmRzV2l0aCgnLycpXG5cdFx0cm9vdFVybCA9IHJvb3RVcmwuc3Vic3RyKDAsIHJvb3RVcmwubGVuZ3RoIC0gMSlcblxuXHR3aW5kb3cuc3RvcmVzPy5BUEk/LmNsaWVudD8uc2V0VXJsKHJvb3RVcmwpXG5cdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRSb290VXJsKHJvb3RVcmwpXG5cdHdpbmRvd1snc3RlZWRvcy5zZXR0aW5nJ10gPSB7XG5cdFx0cm9vdFVybDogcm9vdFVybFxuXHR9XG5cbmlmICFNZXRlb3IuaXNDb3Jkb3ZhICYmIE1ldGVvci5pc0NsaWVudFxuXHQjIOmFjee9ruaYr+WQpuaWsOeql+WPo+aJk+W8gOeahOWFqOWxgOWPmOmHj1xuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldEhyZWZQb3B1cChNZXRlb3Iuc2V0dGluZ3MucHVibGljPy51aT8uaHJlZl9wb3B1cClcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblx0IyBNZXRlb3IuYXV0b3J1biAoKS0+XG5cdCMgXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0VXNlcklkKFN0ZWVkb3MudXNlcklkKCkpXG5cdCMgXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0VGVuYW50SWQoU3RlZWRvcy5zcGFjZUlkKCkpXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IChsb2NhbGUpLT5cblx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcblx0cmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblN0ZWVkb3MuaXNFeHByZXNzaW9uID0gKGZ1bmMpIC0+XG5cdGlmIHR5cGVvZiBmdW5jICE9ICdzdHJpbmcnXG5cdFx0cmV0dXJuIGZhbHNlXG5cdHBhdHRlcm4gPSAvXnt7KC4rKX19JC9cblx0cmVnMSA9IC9ee3soZnVuY3Rpb24uKyl9fSQvXG5cdHJlZzIgPSAvXnt7KC4rPT4uKyl9fSQvXG5cdGlmIHR5cGVvZiBmdW5jID09ICdzdHJpbmcnIGFuZCBmdW5jLm1hdGNoKHBhdHRlcm4pIGFuZCAhZnVuYy5tYXRjaChyZWcxKSBhbmQgIWZ1bmMubWF0Y2gocmVnMilcblx0XHRyZXR1cm4gdHJ1ZVxuXHRmYWxzZVxuXG5TdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbiA9IChmdW5jLCBmb3JtRGF0YSwgZGF0YVBhdGgsIGdsb2JhbCkgLT5cblx0Z2V0UGFyZW50UGF0aCA9IChwYXRoKSAtPlxuXHRcdGlmIHR5cGVvZiBwYXRoID09ICdzdHJpbmcnXG5cdFx0XHRwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpXG5cdFx0XHRpZiBwYXRoQXJyLmxlbmd0aCA9PSAxXG5cdFx0XHRcdHJldHVybiAnIydcblx0XHRcdHBhdGhBcnIucG9wKClcblx0XHRcdHJldHVybiBwYXRoQXJyLmpvaW4oJy4nKVxuXHRcdHJldHVybiAnIydcblx0Z2V0VmFsdWVCeVBhdGggPSAoZm9ybURhdGEsIHBhdGgpIC0+XG5cdFx0aWYgcGF0aCA9PSAnIycgb3IgIXBhdGhcblx0XHRcdHJldHVybiBmb3JtRGF0YSBvciB7fVxuXHRcdGVsc2UgaWYgdHlwZW9mIHBhdGggPT0gJ3N0cmluZydcblx0XHRcdHJldHVybiBfLmdldChmb3JtRGF0YSwgcGF0aClcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yICdwYXRoIGhhcyB0byBiZSBhIHN0cmluZydcblx0XHRyZXR1cm5cblx0aWYgZm9ybURhdGEgPT0gdW5kZWZpbmVkXG5cdFx0Zm9ybURhdGEgPSB7fVxuXHRwYXJlbnRQYXRoID0gZ2V0UGFyZW50UGF0aChkYXRhUGF0aClcblx0cGFyZW50ID0gZ2V0VmFsdWVCeVBhdGgoZm9ybURhdGEsIHBhcmVudFBhdGgpIG9yIHt9XG5cdGlmIHR5cGVvZiBmdW5jID09ICdzdHJpbmcnXG5cdFx0ZnVuY0JvZHkgPSBmdW5jLnN1YnN0cmluZygyLCBmdW5jLmxlbmd0aCAtIDIpXG5cdFx0Z2xvYmFsVGFnID0gJ19fR19MX09fQl9BX0xfXydcblx0XHRzdHIgPSAnXFxuICAgIHJldHVybiAnICsgZnVuY0JvZHkucmVwbGFjZSgvXFxiZm9ybURhdGFcXGIvZywgSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBnbG9iYWxUYWcpKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgSlNPTi5zdHJpbmdpZnkoZ2xvYmFsKSkucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcYicgKyBnbG9iYWxUYWcgKyAnXFxcXGInLCAnZycpLCAnZ2xvYmFsJykucmVwbGFjZSgvcm9vdFZhbHVlL2csIEpTT04uc3RyaW5naWZ5KHBhcmVudCkpXG5cdFx0dHJ5XG5cdFx0XHRyZXR1cm4gRnVuY3Rpb24oc3RyKSgpXG5cdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdGNvbnNvbGUubG9nIGVycm9yLCBmdW5jLCBkYXRhUGF0aFxuXHRcdFx0cmV0dXJuIGZ1bmNcblx0ZWxzZVxuXHRcdHJldHVybiBmdW5jXG5cdHJldHVyblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxuXHRcdGlmIGFjY291bnRCZ0JvZHlcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcblx0XHQjIGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHQjIFx0aWYgdXJsID09IGF2YXRhclxuXHRcdCMgXHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcblx0XHQjIGVsc2Vcblx0XHQjIFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxuXHRcdCMgXHRpZiBiYWNrZ3JvdW5kXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxuXHRcdGlmIGFjY291bnRTa2luXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXG5cdFx0aWYgYWNjb3VudFpvb21cblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHQjIGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdCMgXHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdCMgXHRhY2NvdW50Wm9vbVZhbHVlID0ge31cblx0XHQjIFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHQjIFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblx0XHQjICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcblx0XHQjIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0IyB6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxuXHRcdCMgdW5sZXNzIHpvb21OYW1lXG5cdFx0IyBcdHpvb21OYW1lID0gXCJsYXJnZVwiXG5cdFx0IyBcdHpvb21TaXplID0gMS4yXG5cdFx0IyBpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXG5cdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdCMgXHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHQjIFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxuXHRcdCMgXHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXG5cdFx0IyBcdCMgXHRcdHpvb21TaXplID0gMFxuXHRcdCMgXHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxuXHRcdCMgXHQjIGVsc2Vcblx0XHQjIFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdCMgaWYgaXNOZWVkVG9Mb2NhbFxuXHRcdCMgXHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHQjIFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHQjIFx0XHRyZXR1cm5cblx0XHQjIFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0IyBcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdCMgXHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0IyBcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0IyBcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcblx0XHQjIFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxuXHRcdCMgXHRcdGVsc2Vcblx0XHQjIFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0IyBcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcblxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblxuXHRcdGxpbmtlciA9IFwiP1wiXG5cblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0bGlua2VyID0gXCImXCJcblxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG5cblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblxuXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cdFx0aWYgIWFwcFxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcblx0XHRcdHJldHVyblxuXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cdFx0IyBcdHJldHVyblxuXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcblx0XHRpZiBhcHAuaXNfdXNlX2llXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRpZiBvbl9jbGlja1xuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcblxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcblxuXHRcdGVsc2UgaWYgb25fY2xpY2tcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0bWluX21vbnRocyA9IDFcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRtaW5fbW9udGhzID0gM1xuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxuXHRcdGlmIHNwYWNlICYmIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXG5cblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XG5cdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXG5cblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXG5cblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XG5cdFx0ZWxzZVxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxuXHRcdGlmIG9mZnNldFxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcblxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cblx0XHRERVZJQ0UgPVxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xuXHRcdFx0aXBhZDogJ2lwYWQnXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXG5cdFx0XHRpcG9kOiAnaXBvZCdcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcblx0XHRicm93c2VyID0ge31cblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcblx0XHRcdCcnXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxuXHRcdF1cblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXG5cblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBpZnJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxuXHRcdFx0aWZyLmxvYWQgLT5cblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxuXHRcdFx0XHRpZiBpZnJCb2R5XG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxuXHRcdHJldHVybiBmYWxzZTtcblxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxuXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRjaGVjayA9IGZhbHNlXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcblx0XHRcdGNoZWNrID0gdHJ1ZVxuXHRcdHJldHVybiBjaGVja1xuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXG5cdFx0cGFyZW50cyA9IFtdXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cblx0XHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGkgPSAwXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxuXHRcdFx0XHRicmVha1xuXHRcdFx0aSsrXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxuXHRcdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcblx0XHRcdGVsc2Vcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcblxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cblxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxuXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXG5cblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcblxuXHRcdFx0aWYgIXVzZXJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXG5cblx0XHRcdGlmIHJlc3VsdC5lcnJvclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdXNlclxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRpZiB1c2VyXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0dHJ5XG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXHRcdGNhdGNoIGVcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHRrZXkzMiA9IFwiXCJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0aWYgbGVuIDwgMzJcblx0XHRcdGMgPSBcIlwiXG5cdFx0XHRpID0gMFxuXHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdGkrK1xuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XG5cblx0XHRpZiAhYWNjZXNzX3Rva2VuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcblxuXHRcdGlmIHVzZXJcblx0XHRcdHJldHVybiB1c2VySWRcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxuXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXG5cdFx0XHRpZiBvYmpcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxuXHRcdHJldHVybiBudWxsXG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcblxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhdGNoIGVcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXG5cbm1peGluID0gKG9iaikgLT5cblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcblxuI21peGluKF9zLmV4cG9ydHMoKSlcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XG5cdFx0aWYgIWRhdGVcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdHJldHVybiBmYWxzZVxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cblx0XHRcdGlmIGkgPCBkYXlzXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcblx0XHRcdHJldHVyblxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxuXHRcdHJldHVybiBwYXJhbV9kYXRlXG5cblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7Rcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cblxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxuXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cblx0XHRqID0gMFxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gMFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXG5cdFx0XHRcdGogPSBsZW4vMlxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcblx0XHRcdGkgPSAwXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcblxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxuXHRcdFx0XHRcdGJyZWFrXG5cblx0XHRcdFx0aSsrXG5cblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IGkgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcblxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcblxuXHRcdGlmIGogPiBtYXhfaW5kZXhcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcblxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Xy5leHRlbmQgU3RlZWRvcyxcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXG5cdFx0XHRpZiBhcHBcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRcdFx0aSA9IDBcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdFx0XHRpKytcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cblxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXG5cdFx0XHRpZiBpc0kxOG5cblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRyZXR1cm4gbG9jYWxlXG5cblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcblxuXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxuXHRcdFx0dmFsaWQgPSB0cnVlXG5cdFx0XHR1bmxlc3MgcHdkXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcblxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcblx0XHRcdHBhc3N3b3JQb2xpY3lFcnJvciA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lFcnJvciB8fCBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5ZXJyb3IgfHwgXCLlr4bnoIHkuI3nrKblkIjop4TliJlcIlxuXHRcdFx0aWYgcGFzc3dvclBvbGljeVxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxuXHRcdFx0XHRcdHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHZhbGlkID0gdHJ1ZVxuI1x0XHRcdGVsc2VcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0aWYgdmFsaWRcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxuXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxuXHRkYkFwcHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoYXBwKS0+XG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXG5cblx0cmV0dXJuIGRiQXBwc1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IChzcGFjZV9pZCktPlxuXHRkYkRhc2hib2FyZHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoZGFzaGJvYXJkKS0+XG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXG5cblx0cmV0dXJuIGRiRGFzaGJvYXJkc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxuXHRcdHJldHVybiBhdXRoVG9rZW5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5hdXRvcnVuICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcbiNcdFx0ZWxzZVxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cblx0XHRvYmplY3QgPSB7XG4gICAgICAgIFx0YmFja2dyb3VuZDogdHJ1ZVxuICAgIFx0fTtcblx0XHRpc2RvY3VtZW50REIgPSBNZXRlb3Iuc2V0dGluZ3M/LmRhdGFzb3VyY2VzPy5kZWZhdWx0Py5kb2N1bWVudERCIHx8IGZhbHNlO1xuXHRcdGlmIGlzZG9jdW1lbnREQlxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxuXHRcdFx0XHRpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcblx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKVxuXHRcdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLDUyKTtcblxuXHRcdHJldHVybiBvYmplY3Q7IiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW4sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcm9vdFVybDsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpIHtcbiAgICB2YXIgcmVmLCByZWYxLCByZWc7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoc2NhbGUgfHwgc2NhbGUgPT09IDApIHtcbiAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSk7XG4gICAgICB9XG4gICAgICBpZiAoIW5vdFRob3VzYW5kcykge1xuICAgICAgICBpZiAoIShzY2FsZSB8fCBzY2FsZSA9PT0gMCkpIHtcbiAgICAgICAgICBzY2FsZSA9IChyZWYgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMV0pICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZztcbiAgICAgICAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICBudW1iZXJUb1BlcmNlbnRTdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciBuZXdOdW1iZXI7XG4gICAgbmV3TnVtYmVyID0gTnVtYmVyKChudW1iZXIgKiAxMDApLnRvRml4ZWQoc2NhbGUpKTtcbiAgICByZXR1cm4gU3RlZWRvcy5udW1iZXJUb1N0cmluZyhuZXdOdW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpICsgXCIlXCI7XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH0sXG4gIGF1dGhSZXF1ZXN0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBhdXRob3JpemF0aW9uLCBkZWZPcHRpb25zLCBlcnIsIGhlYWRlcnMsIHJlc3VsdCwgc3BhY2VJZCwgdXNlclNlc3Npb247XG4gICAgdXNlclNlc3Npb24gPSBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgICBzcGFjZUlkID0gdXNlclNlc3Npb24uc3BhY2VJZDtcbiAgICBhdXRoVG9rZW4gPSB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gPyB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gOiB1c2VyU2Vzc2lvbi51c2VyLmF1dGhUb2tlbjtcbiAgICByZXN1bHQgPSBudWxsO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB0cnkge1xuICAgICAgYXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHNwYWNlSWQgKyAnLCcgKyBhdXRoVG9rZW47XG4gICAgICBoZWFkZXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgdmFsdWU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogJ0F1dGhvcml6YXRpb24nLFxuICAgICAgICAgIHZhbHVlOiBhdXRob3JpemF0aW9uXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBkZWZPcHRpb25zID0ge1xuICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKFhIUikge1xuICAgICAgICAgIGlmIChoZWFkZXJzICYmIGhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gWEhSLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLm5hbWUsIGhlYWRlci52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXN1bHQgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgdmFyIGVycm9ySW5mbywgZXJyb3JNc2c7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04pO1xuICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04gJiYgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OLmVycm9yKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04uZXJyb3I7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgIGVycm9yOiBlcnJvckluZm9cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBlcnJvck1zZyA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChlcnJvckluZm8ucmVhc29uKSB7XG4gICAgICAgICAgICAgIGVycm9yTXNnID0gZXJyb3JJbmZvLnJlYXNvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3JJbmZvLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgZXJyb3JNc2cgPSBlcnJvckluZm8ubWVzc2FnZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9yTXNnID0gZXJyb3JJbmZvO1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IodChlcnJvck1zZy5yZXBsYWNlKC86L2csICfvvJonKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkLmFqYXgoT2JqZWN0LmFzc2lnbih7fSwgZGVmT3B0aW9ucywgb3B0aW9ucykpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGVyciA9IGVycm9yMTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHRvYXN0ci5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5pZiAoTWV0ZW9yLmlzQ29yZG92YSB8fCBNZXRlb3IuaXNDbGllbnQpIHtcbiAgcm9vdFVybCA9IE1ldGVvci5hYnNvbHV0ZVVybC5kZWZhdWx0T3B0aW9ucy5yb290VXJsO1xuICBpZiAocm9vdFVybC5lbmRzV2l0aCgnLycpKSB7XG4gICAgcm9vdFVybCA9IHJvb3RVcmwuc3Vic3RyKDAsIHJvb3RVcmwubGVuZ3RoIC0gMSk7XG4gIH1cbiAgaWYgKChyZWYgPSB3aW5kb3cuc3RvcmVzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLkFQSSkgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYyID0gcmVmMS5jbGllbnQpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMi5zZXRVcmwocm9vdFVybCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICgocmVmMyA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjQgPSByZWYzLlNldHRpbmdzKSAhPSBudWxsKSB7XG4gICAgICByZWY0LnNldFJvb3RVcmwocm9vdFVybCk7XG4gICAgfVxuICB9XG4gIHdpbmRvd1snc3RlZWRvcy5zZXR0aW5nJ10gPSB7XG4gICAgcm9vdFVybDogcm9vdFVybFxuICB9O1xufVxuXG5pZiAoIU1ldGVvci5pc0NvcmRvdmEgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWY1LCByZWY2LCByZWY3LCByZWY4O1xuICAgIHJldHVybiAocmVmNSA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwgPyAocmVmNiA9IHJlZjUuU2V0dGluZ3MpICE9IG51bGwgPyByZWY2LnNldEhyZWZQb3B1cCgocmVmNyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy51aSkgIT0gbnVsbCA/IHJlZjguaHJlZl9wb3B1cCA6IHZvaWQgMCA6IHZvaWQgMCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIH0pO1xufVxuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5TdGVlZG9zLmlzRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgdmFyIHBhdHRlcm4sIHJlZzEsIHJlZzI7XG4gIGlmICh0eXBlb2YgZnVuYyAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcGF0dGVybiA9IC9ee3soLispfX0kLztcbiAgcmVnMSA9IC9ee3soZnVuY3Rpb24uKyl9fSQvO1xuICByZWcyID0gL157eyguKz0+LispfX0kLztcbiAgaWYgKHR5cGVvZiBmdW5jID09PSAnc3RyaW5nJyAmJiBmdW5jLm1hdGNoKHBhdHRlcm4pICYmICFmdW5jLm1hdGNoKHJlZzEpICYmICFmdW5jLm1hdGNoKHJlZzIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24gPSBmdW5jdGlvbihmdW5jLCBmb3JtRGF0YSwgZGF0YVBhdGgsIGdsb2JhbCkge1xuICB2YXIgZXJyb3IsIGZ1bmNCb2R5LCBnZXRQYXJlbnRQYXRoLCBnZXRWYWx1ZUJ5UGF0aCwgZ2xvYmFsVGFnLCBwYXJlbnQsIHBhcmVudFBhdGgsIHN0cjtcbiAgZ2V0UGFyZW50UGF0aCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICB2YXIgcGF0aEFycjtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpO1xuICAgICAgaWYgKHBhdGhBcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiAnIyc7XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgcmV0dXJuIHBhdGhBcnIuam9pbignLicpO1xuICAgIH1cbiAgICByZXR1cm4gJyMnO1xuICB9O1xuICBnZXRWYWx1ZUJ5UGF0aCA9IGZ1bmN0aW9uKGZvcm1EYXRhLCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcjJyB8fCAhcGF0aCkge1xuICAgICAgcmV0dXJuIGZvcm1EYXRhIHx8IHt9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gXy5nZXQoZm9ybURhdGEsIHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdwYXRoIGhhcyB0byBiZSBhIHN0cmluZycpO1xuICAgIH1cbiAgfTtcbiAgaWYgKGZvcm1EYXRhID09PSB2b2lkIDApIHtcbiAgICBmb3JtRGF0YSA9IHt9O1xuICB9XG4gIHBhcmVudFBhdGggPSBnZXRQYXJlbnRQYXRoKGRhdGFQYXRoKTtcbiAgcGFyZW50ID0gZ2V0VmFsdWVCeVBhdGgoZm9ybURhdGEsIHBhcmVudFBhdGgpIHx8IHt9O1xuICBpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnKSB7XG4gICAgZnVuY0JvZHkgPSBmdW5jLnN1YnN0cmluZygyLCBmdW5jLmxlbmd0aCAtIDIpO1xuICAgIGdsb2JhbFRhZyA9ICdfX0dfTF9PX0JfQV9MX18nO1xuICAgIHN0ciA9ICdcXG4gICAgcmV0dXJuICcgKyBmdW5jQm9keS5yZXBsYWNlKC9cXGJmb3JtRGF0YVxcYi9nLCBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIGdsb2JhbFRhZykpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBKU09OLnN0cmluZ2lmeShnbG9iYWwpKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiJyArIGdsb2JhbFRhZyArICdcXFxcYicsICdnJyksICdnbG9iYWwnKS5yZXBsYWNlKC9yb290VmFsdWUvZywgSlNPTi5zdHJpbmdpZnkocGFyZW50KSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBGdW5jdGlvbihzdHIpKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLCBmdW5jLCBkYXRhUGF0aCk7XG4gICAgICByZXR1cm4gZnVuYztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge307XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmNTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZjUgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZjUubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY1O1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmNSA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWY1LmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNS51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWY2ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNi5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjcgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY3W1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWY4ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmOFtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNVtcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmNiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjZbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjcgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmNy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjggPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmOC5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmNSwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmNS50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHBhc3N3b3JQb2xpY3ksIHBhc3N3b3JQb2xpY3lFcnJvciwgcmVhc29uLCByZWYxMCwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgcmVmOSwgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmNiA9IHJlZjUucGFzc3dvcmQpICE9IG51bGwgPyByZWY2LnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9ICgocmVmNyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjgucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDApIHx8ICgocmVmOSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxMCA9IHJlZjkucGFzc3dvcmQpICE9IG51bGwgPyByZWYxMC5wb2xpY3llcnJvciA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgXCLlr4bnoIHkuI3nrKblkIjop4TliJlcIjtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkRhc2hib2FyZHM7XG4gIGRiRGFzaGJvYXJkcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJldHVybiBkYkRhc2hib2FyZHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5mb3JtYXRJbmRleCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGluZGV4TmFtZSwgaXNkb2N1bWVudERCLCBvYmplY3QsIHJlZjUsIHJlZjYsIHJlZjc7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjYgPSByZWY1LmRhdGFzb3VyY2VzKSAhPSBudWxsID8gKHJlZjcgPSByZWY2W1wiZGVmYXVsdFwiXSkgIT0gbnVsbCA/IHJlZjcuZG9jdW1lbnREQiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgZmFsc2U7XG4gICAgaWYgKGlzZG9jdW1lbnREQikge1xuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG4gICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICBpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsIDUyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgTWV0ZW9yLm1ldGhvZHNcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVzaDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRzZXQ6IFxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIF1cblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcbiAgICAgICAgcCA9IG51bGxcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgICAgcCA9IGVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdWxsOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIHBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBcblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXG5cbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxuICAgICAgICAkc2V0OlxuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG5cbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgcmV0dXJuIHt9XG5cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cbiAgICAgICAgc3dhbFxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXG4jIyNcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XG5cdGZyb206IChmdW5jdGlvbigpe1xuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XG5cdH0pKCksXG5cdHJlc2V0UGFzc3dvcmQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0dmVyaWZ5RW1haWw6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdGVucm9sbEFjY291bnQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9XG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XG5cdGlmIChvcmdzLmNvdW50KCk+MClcblx0e1xuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcblx0XHR7XG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cdFxuXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIFx0ZGF0YToge1xuXHQgICAgICBcdHJldDogMCxcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcbiAgICBcdH1cbiAgXHR9KTtcbn0pO1xuXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuXHRcdGlmIHNwYWNlSWRcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuXHRcdHNwYWNlcyA9IFtdXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XG5cdGljb246IFwiZ2xvYmVcIlxuXHRjb2xvcjogXCJibHVlXCJcblx0dGFibGVDb2x1bW5zOiBbXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cblx0XVxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdHJldHVybiB7fVxuXHRzaG93RWRpdENvbHVtbjogZmFsc2Vcblx0c2hvd0RlbENvbHVtbjogZmFsc2Vcblx0ZGlzYWJsZUFkZDogdHJ1ZVxuXHRwYWdlTGVuZ3RoOiAxMDBcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xuICAgIHZhciBrO1xuICAgIGlmIChuID49IDApIHtcbiAgICAgIGsgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuICsgbjtcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cbiAgICB9XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBrKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XG4gICAgICB3d3c6IFxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxuXHRsaXN0Vmlld3MgPSB7fVxuXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcblxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gbGlzdFZpZXdzXG5cblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pXG5cblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblxuXG5cbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xuXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbi8vICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XG4vLyAgICAgfVxuLy8gICB9O1xuLy8gICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcbi8vICAgfTtcbi8vICAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfTtcblxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfSxcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfVxuLy8gICB9KTtcblxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXG4vLyAgIHZhciBhcGkgPSB7XG4vLyAgICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XG4vLyAgICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcbi8vICAgICB9LFxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcblxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG5cbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcbi8vICAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbi8vICAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pXG4vLyAgICAgfVxuLy8gICB9KVxuXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbi8vICAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXG4vLyAgICAgLy8gICB9XG4vLyAgICAgLy8gfSk7XG5cbi8vICAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xuXG4vLyAgICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgfSk7XG5cbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xuXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XG5cbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xuXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcblxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9KTsgIFxuXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXG4vLyAgICAgXy5leHRlbmQoYXBpLCB7XG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcbi8vICAgICAgIH0sXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gYXBpO1xuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcblxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcblxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblx0XHRcblx0XHRpZiAhdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcblxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXG5cblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxuXHRcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IFtdXG5cblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzIClcbiAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuICAgICAgICBpZiAhYXV0aFRva2VuXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3JcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnNcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZVxuICAgICAgICBkYXRhID0gW11cbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucylcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7fVxuIiwidmFyIENvb2tpZXMsIHN0ZWVkb3NBdXRoO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXG5cdGlmIGFwcFxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcblx0ZWxzZVxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXG5cblx0aWYgIXJlZGlyZWN0VXJsXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRyZXMuZW5kKClcblx0XHRyZXR1cm5cblxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XG5cblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcblx0IyBpZiByZXEuYm9keVxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0IyAjIHRoZW4gY2hlY2sgY29va2llXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0aWYgdXNlclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHQjIGRlcy1jYmNcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxuXHRcdFx0a2V5OCA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCA4XG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSA4IC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0am9pbmVyID0gXCI/XCJcblxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxuXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cblxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRyZXMud3JpdGVIZWFkIDQwMVxuXHRyZXMuZW5kKClcblx0cmV0dXJuXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdCMgdGhpcy5wYXJhbXMgPVxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuXHRcdHdpZHRoID0gNTAgO1xuXHRcdGhlaWdodCA9IDUwIDtcblx0XHRmb250U2l6ZSA9IDI4IDtcblx0XHRpZiByZXEucXVlcnkud1xuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcblx0XHRpZiByZXEucXVlcnkuaFxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG5cdFx0aWYgIXVzZXJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHVzZXJuYW1lID0gdXNlci5uYW1lO1xuXHRcdGlmICF1c2VybmFtZVxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXG5cblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxuXG5cdFx0XHR1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XG5cdFx0XHRcdGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcblxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcblx0XHRcdGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcblxuXHRcdFx0aW5pdGlhbHMgPSAnJ1xuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcblxuXHRcdFx0aW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXG5cblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0PD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XG5cdFx0XHRcdFx0I3tpbml0aWFsc31cblx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcblx0XHRcdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XG5cdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuXHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcblxuXHRcdGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXG5cblx0XHRpZiBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgYWNjZXNzX3Rva2VuLCByZWY7XG4gICAgYWNjZXNzX3Rva2VuID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbikpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gICAgICAgIFxuXG4gICAgICAgIHNlbGVjdG9yID0ge3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fVxuICAgICAgICBpZiBzcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXG5cblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cblx0TWV0ZW9yLnB1Ymxpc2ggJ215X3NwYWNlcycsIC0+XG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblxuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHVzZXJTcGFjZXMgPSBbXVxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XG5cdFx0XHR1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpXG5cblx0XHRoYW5kbGUyID0gbnVsbFxuXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXG5cdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0aWYgZG9jLnNwYWNlXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXG5cdFx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKVxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRpZiBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXG5cblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuYWRkZWQgXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jO1xuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VkIFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYztcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZClcblxuXHRcdG9ic2VydmVTcGFjZXMoKTtcblxuXHRcdHNlbGYucmVhZHkoKTtcblxuXHRcdHNlbGYub25TdG9wIC0+XG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cblx0dW5sZXNzIHNwYWNlSWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7YXZhdGFyOiAxLG5hbWU6IDEsZW5hYmxlX3JlZ2lzdGVyOjF9fSk7XG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHR1bmxlc3MgX2lkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe19pZDogX2lkfSk7IiwiTWV0ZW9yLnB1Ymxpc2goJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIGZ1bmN0aW9uKF9pZCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIV9pZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7XG4gICAgX2lkOiBfaWRcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XG5cdFx0IyDmoLnmja7lvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4fvvIzmn6Xor6Llh7rlvZPliY3nlKjmiLfpmZDlrprnmoTnu4Tnu4fmn6XnnIvojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXG5cdFx0IyDpu5jorqTov5Tlm57pmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4dcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXG5cdFx0cmVWYWx1ZSA9XG5cdFx0XHRpc0xpbWl0OiB0cnVlXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0c2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJ9KVxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcblxuXHRcdGlmIGxpbWl0cy5sZW5ndGhcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0XHRcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcblx0XHRcdFx0ZnJvbXMgPSBsaW1pdC5mcm9tc1xuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3Ncblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4/Lm1hcCAobikgLT5cblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcblx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRpZiB0ZW1wSXNMaW1pdFxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xuXHRcdFx0XHRcdFx0bXlMaXRtaXRPcmdJZHMucHVzaCBteU9yZ0lkXG5cblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXG5cdFx0XHRpZiBteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cblx0XHRpZiBpc0xpbWl0XG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ54i25a2Q6IqC54K55YWz57O755qE6IqC54K5562b6YCJ5Ye65p2l5bm25Y+W5Ye65pyA5aSW5bGC6IqC54K5XG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cblx0XHRcdFx0cGFyZW50cyA9IG9yZy5wYXJlbnRzIG9yIFtdXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XG5cdFx0cmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblx0XHRyZXR1cm4gcmVWYWx1ZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICAgc2V0S2V5VmFsdWU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcblxuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgb2JqLmtleSA9IGtleTtcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgdmFyIGMgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kKHtcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSkiLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRVc2VybmFtZTogKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkgLT5cblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcblxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcblxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxuXG5cdFx0dW5sZXNzIHVzZXJfaWRcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxuXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IHVzZXJuYW1lfX0pXG5cblx0XHRyZXR1cm4gdXNlcm5hbWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkge1xuICAgIHZhciBzcGFjZVVzZXI7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG4gICAgaWYgKCFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSAmJiB1c2VyX2lkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnZXJyb3ItaW52YWxpZC11c2VyJyk7XG4gICAgfVxuICAgIGlmICghdXNlcl9pZCkge1xuICAgICAgdXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKTtcbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVzZXJuYW1lO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxuXHRcdHVzZXJfY291bnRfaW5mby5hY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0ZGIudXNlcnMuY3JlYXRlX3NlY3JldCB0aGlzLnVzZXJJZCwgbmFtZVxuXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxuXHRcdGlmICF0aGlzLnVzZXJJZCB8fCAhdG9rZW5cblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKVxuXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiAoc3BhY2VJZCwgdXNlcklkKSAtPlxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcblxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ25vdC1hdXRob3JpemVkJ1xuXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge2ZpZWxkczoge3BhcmVudHM6IDF9fSkuZmV0Y2goKVxuXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEsIHN5bmNfZGlyZWN0aW9uOiAxIH0gfSkuZmV0Y2goKVxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZSh7X2lkOiBvLmZsb3dfaWQsIHN0YXRlOiAnZW5hYmxlZCd9LCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSwgZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlOiAxIH0gfSlcbiAgICAgICAgICAgIGlmIGZsXG4gICAgICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXG4gICAgICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcbiAgICAgICAgICAgICAgICBvLmZvcmJpZF9pbml0aWF0ZV9pbnN0YW5jZSA9IGZsLmZvcmJpZF9pbml0aWF0ZV9pbnN0YW5jZVxuXG4gICAgICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xuICAgICAgICAgICAgICAgIGlmIHBlcm1zXG4gICAgICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuXG4gICAgICAgIG93cyA9IG93cy5maWx0ZXIgKG4pLT5cbiAgICAgICAgICAgIHJldHVybiBuLmZsb3dfbmFtZVxuXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxLFxuICAgICAgICBzeW5jX2RpcmVjdGlvbjogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IG8uZmxvd19pZCxcbiAgICAgICAgc3RhdGU6ICdlbmFibGVkJ1xuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxLFxuICAgICAgICAgIGZvcmJpZF9pbml0aWF0ZV9pbnN0YW5jZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmbCkge1xuICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgICBvLmZvcmJpZF9pbml0aWF0ZV9pbnN0YW5jZSA9IGZsLmZvcmJpZF9pbml0aWF0ZV9pbnN0YW5jZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXG5cdFx0XG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0Y2FuRWRpdCA9IHNwYWNlVXNlci51c2VyID09IHVzZXJJZFxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcblx0XHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXHRcdFx0Y2FuRWRpdCA9IGlzU3BhY2VBZG1pblxuXG5cdFx0Y29tcGFueUlkcyA9IHNwYWNlVXNlci5jb21wYW55X2lkc1xuXHRcdGlmICFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGhcblx0XHRcdCMg57uE57uH566h55CG5ZGY5Lmf6IO95L+u5pS55a+G56CBXG5cdFx0XHRjb21wYW55cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNvbXBhbnlcIikuZmluZCh7X2lkOiB7ICRpbjogY29tcGFueUlkcyB9LCBzcGFjZTogc3BhY2VfaWQgfSwge2ZpZWxkczogeyBhZG1pbnM6IDEgfX0pLmZldGNoKClcblx0XHRcdGlmIGNvbXBhbnlzIGFuZCBjb21wYW55cy5sZW5ndGhcblx0XHRcdFx0Y2FuRWRpdCA9IF8uYW55IGNvbXBhbnlzLCAoaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaXRlbS5hZG1pbnMgJiYgaXRlbS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID4gLTFcblxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcblxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxuXG5cdFx0IyBTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cdFx0bG9nb3V0ID0gdHJ1ZTtcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxuXHRcdFxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHtcblx0XHRcdGFsZ29yaXRobTogJ3NoYS0yNTYnLFxuXHRcdFx0ZGlnZXN0OiBwYXNzd29yZFxuXHRcdH0sIHtsb2dvdXQ6IGxvZ291dH0pXG5cdFx0Y2hhbmdlZFVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRpZiBjaGFuZ2VkVXNlckluZm9cblx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRwdXNoOiB7J3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiBjaGFuZ2VkVXNlckluZm8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHR9fSlcblxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3Jyxcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG5cblx0XHR0cnlcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcGVyYXRpb25fbG9nc1wiKS5pbnNlcnQoe1xuXHRcdFx0XHRuYW1lOiBcIuS/ruaUueWvhueggVwiLFxuXHRcdFx0XHR0eXBlOiBcImNoYW5nZV9wYXNzd29yZFwiLFxuXHRcdFx0XHRyZW1vdGVfdXNlcjogdXNlcklkLFxuXHRcdFx0XHRzdGF0dXM6ICdzdWNjZXNzJyxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRtZXNzYWdlOiBcIlvns7vnu5/nrqHnkIblkZhd5L+u5pS55LqG55So5oi3W1wiICsgY2hhbmdlZFVzZXJJbmZvPy5uYW1lICsgXCJd55qE5a+G56CBXCIsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRjaGFuZ2VVc2VyOiB1c2VyX2lkXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRyZWxhdGVkX3RvOiB7XG5cdFx0XHRcdFx0bzogXCJ1c2Vyc1wiLFxuXHRcdFx0XHRcdGlkczogW3VzZXJfaWRdXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2FuRWRpdCwgY2hhbmdlZFVzZXJJbmZvLCBjb21wYW55SWRzLCBjb21wYW55cywgY3VycmVudFVzZXIsIGUsIGlzU3BhY2VBZG1pbiwgbGFuZywgbG9nb3V0LCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcklkLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT09IHVzZXJJZDtcbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGNhbkVkaXQgPSBpc1NwYWNlQWRtaW47XG4gICAgfVxuICAgIGNvbXBhbnlJZHMgPSBzcGFjZVVzZXIuY29tcGFueV9pZHM7XG4gICAgaWYgKCFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBjb21wYW55SWRzXG4gICAgICAgIH0sXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGlmIChjb21wYW55cyAmJiBjb21wYW55cy5sZW5ndGgpIHtcbiAgICAgICAgY2FuRWRpdCA9IF8uYW55KGNvbXBhbnlzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uYWRtaW5zICYmIGl0ZW0uYWRtaW5zLmluZGV4T2YodXNlcklkKSA+IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjYW5FZGl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIGxvZ291dCA9IHRydWU7XG4gICAgaWYgKHRoaXMudXNlcklkID09PSB1c2VyX2lkKSB7XG4gICAgICBsb2dvdXQgPSBmYWxzZTtcbiAgICB9XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwge1xuICAgICAgYWxnb3JpdGhtOiAnc2hhLTI1NicsXG4gICAgICBkaWdlc3Q6IHBhc3N3b3JkXG4gICAgfSwge1xuICAgICAgbG9nb3V0OiBsb2dvdXRcbiAgICB9KTtcbiAgICBjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGlmIChjaGFuZ2VkVXNlckluZm8pIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgfSwge1xuICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogKHJlZjEgPSBjaGFuZ2VkVXNlckluZm8uc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGFzc3dvcmQpICE9IG51bGwgPyByZWYyLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3BlcmF0aW9uX2xvZ3NcIikuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogXCLkv67mlLnlr4bnoIFcIixcbiAgICAgICAgdHlwZTogXCJjaGFuZ2VfcGFzc3dvcmRcIixcbiAgICAgICAgcmVtb3RlX3VzZXI6IHVzZXJJZCxcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgbWVzc2FnZTogXCJb57O757uf566h55CG5ZGYXeS/ruaUueS6hueUqOaIt1tcIiArIChjaGFuZ2VkVXNlckluZm8gIT0gbnVsbCA/IGNoYW5nZWRVc2VySW5mby5uYW1lIDogdm9pZCAwKSArIFwiXeeahOWvhueggVwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY2hhbmdlVXNlcjogdXNlcl9pZFxuICAgICAgICB9KSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IFwidXNlcnNcIixcbiAgICAgICAgICBpZHM6IFt1c2VyX2lkXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cblxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0Y291bnRfZGF5cyA9IDBcblxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxuXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXG5cblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxuXHRcdCMgZG8gbm90aGluZ1xuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxuXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cblx0bGFzdF9iaWxsID0gbnVsbFxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxuXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0Y3JlYXRlZDoge1xuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxuXHRcdFx0fSxcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0aWYgcGF5bWVudF9iaWxsXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXG5cdGVsc2Vcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcblxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0XHRpZiBhcHBfYmlsbFxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcblxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcblx0c2V0T2JqID0gbmV3IE9iamVjdFxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxuXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0bm93ID0gbmV3IERhdGVcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2Vcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcblx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHR7XG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cblx0XHR9XG5cdCkuZm9yRWFjaCAoYmlsbCktPlxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXG5cblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRtb2R1bGVzID0gbmV3IEFycmF5XG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y3JlYXRlZDogLTFcblx0XHRcdH1cblx0XHQpXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcblx0XHRcdCMgIGRvIG5vdGhpbmdcblxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxuXHRcdFx0IyAgZG8gbm90aGluZ1xuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cblx0cmV0dXJuIG1vZHVsZXNcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXG5cdClcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxuXG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdHJldHVyblxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRkZWJpdHMgPSAwXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdFx0e1xuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpLmZvckVhY2goKGIpLT5cblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xuXHRcdClcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2Vcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxuXHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRpZiBkZWJpdHMgPiAwXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXG5cblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcblx0XHRcdHtcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRlbHNlXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXG5cblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXG5cblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XG5cblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxuXG5cdG0gPSBtb21lbnQoKVxuXHRub3cgPSBtLl9kXG5cblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcblxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0IyDmm7TmlrBtb2R1bGVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXG5cdGlmIHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cblx0XHRcdG1jbCA9IG5ldyBPYmplY3Rcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxuXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcblxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XG5cbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XG5cbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghZ29fbmV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xuXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHJldHVybiBkYXRla2V5O1xuICAgICAgfTtcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xuICAgICAgfTtcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oC75pWwXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xuICAgICAgICAgIHJldHVybiBtb2Q7XG4gICAgICB9O1xuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KSAgXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5o+S5YWl5pWw5o2uXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RlZWRvczp7XG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmtmbG93OntcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY21zOiB7XG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcblxuICAgICAgZ29fbmV4dCA9IHRydWU7XG5cbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICB9KSk7XG5cbiAgfVxuXG59KVxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDFcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXG4gICAgICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMlxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDNcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogNFxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNVxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRcdHRyeVxuXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcblx0XHRcdFx0XHRcdFx0XHRpZiByXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA2XG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRcdHRyeVxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcblx0XHRcdFx0fSlcblxuXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcblxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cbiAgICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKClcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xuICAgICAgICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiaWYocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKXtcblx0Ly9NZXRlb3Ig54mI5pys5Y2H57qn5YiwMS45IOWPiuS7peS4iuaXtihub2RlIOeJiOacrCAxMSsp77yM5Y+v5Lul5Yig6Zmk5q2k5Luj56CBXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmbGF0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihkZXB0aCA9IDEpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAoZmxhdCwgdG9GbGF0dGVuKSB7XG5cdFx0XHRcdHJldHVybiBmbGF0LmNvbmNhdCgoQXJyYXkuaXNBcnJheSh0b0ZsYXR0ZW4pICYmIChkZXB0aD4xKSkgPyB0b0ZsYXR0ZW4uZmxhdChkZXB0aC0xKSA6IHRvRmxhdHRlbik7XG5cdFx0XHR9LCBbXSk7XG5cdFx0fVxuXHR9KTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdG5ldyBUYWJ1bGFyLlRhYmxlXG5cdFx0bmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXG5cdFx0Y29sdW1uczogW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXG5cdFx0XHR9XG5cdFx0XVxuXHRcdGRvbTogXCJ0cFwiXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxuXHRcdG9yZGVyaW5nOiBmYWxzZVxuXHRcdHBhZ2VMZW5ndGg6IDEwXG5cdFx0aW5mbzogZmFsc2Vcblx0XHRzZWFyY2hpbmc6IHRydWVcblx0XHRhdXRvV2lkdGg6IHRydWVcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XG5cdFx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2Vcblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
