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
      console.error("time_points is null");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsInJlZiIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyb290VXJsIiwic2V0dGluZ3MiLCJkYiIsInN1YnMiLCJpc1Bob25lRW5hYmxlZCIsIk1ldGVvciIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImF1dGhSZXF1ZXN0IiwidXJsIiwib3B0aW9ucyIsImF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJkZWZPcHRpb25zIiwiZXJyIiwiaGVhZGVycyIsInJlc3VsdCIsInNwYWNlSWQiLCJ1c2VyU2Vzc2lvbiIsIkNyZWF0b3IiLCJVU0VSX0NPTlRFWFQiLCJ1c2VyIiwiYWJzb2x1dGVVcmwiLCJ2YWx1ZSIsInR5cGUiLCJkYXRhVHlwZSIsImNvbnRlbnRUeXBlIiwiYmVmb3JlU2VuZCIsIlhIUiIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJzdWNjZXNzIiwiZGF0YSIsImVycm9yIiwiWE1MSHR0cFJlcXVlc3QiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJlcnJvckluZm8iLCJlcnJvck1zZyIsImNvbnNvbGUiLCJyZXNwb25zZUpTT04iLCJyZWFzb24iLCJtZXNzYWdlIiwidG9hc3RyIiwiJCIsImFqYXgiLCJhc3NpZ24iLCJlcnJvcjEiLCJpc0NvcmRvdmEiLCJpc0NsaWVudCIsImRlZmF1bHRPcHRpb25zIiwiZW5kc1dpdGgiLCJzdWJzdHIiLCJ3aW5kb3ciLCJzdG9yZXMiLCJBUEkiLCJjbGllbnQiLCJzZXRVcmwiLCJTZXR0aW5ncyIsInNldFJvb3RVcmwiLCJzdGFydHVwIiwicmVmNSIsInJlZjYiLCJyZWY3IiwicmVmOCIsInNldEhyZWZQb3B1cCIsInVpIiwiaHJlZl9wb3B1cCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNFeHByZXNzaW9uIiwiZnVuYyIsInBhdHRlcm4iLCJyZWcxIiwicmVnMiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsImZvcm1EYXRhIiwiZGF0YVBhdGgiLCJnbG9iYWwiLCJmdW5jQm9keSIsImdldFBhcmVudFBhdGgiLCJnZXRWYWx1ZUJ5UGF0aCIsImdsb2JhbFRhZyIsInBhcmVudCIsInBhcmVudFBhdGgiLCJwYXRoIiwicGF0aEFyciIsInNwbGl0IiwicG9wIiwiam9pbiIsIl8iLCJnZXQiLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJsb2ciLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXJJZCIsImtleSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJzaG93SGVscCIsImdldExvY2FsZSIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhcHBzIiwiaXNfbmV3X3dpbmRvdyIsImlzTW9iaWxlIiwibG9jYXRpb24iLCJvcGVuV2luZG93Iiwib3BlblVybFdpdGhJRSIsImNtZCIsImV4ZWMiLCJvcGVuX3VybCIsImlzTm9kZSIsIm53IiwicmVxdWlyZSIsInN0ZG91dCIsInN0ZGVyciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicmVkaXJlY3RUb1NpZ25JbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsInN0YWNrIiwiU2Vzc2lvbiIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImNzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJjb29raWVzIiwicGFzc3dvcmQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiY29kZSIsImZ1bmN0aW9ucyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlZjEwIiwicmVmOSIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJwb2xpY3llcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldERCRGFzaGJvYXJkcyIsImRiRGFzaGJvYXJkcyIsImRhc2hib2FyZCIsImdldEF1dGhUb2tlbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZvcmVpZ25fa2V5IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJyZWZlcmVuY2VzIiwibWV0aG9kcyIsInVwZGF0ZVVzZXJMYXN0TG9nb24iLCIkc2V0IiwibGFzdF9sb2dvbiIsIm9uTG9naW4iLCJ1c2Vyc19hZGRfZW1haWwiLCJlbWFpbCIsImNvdW50IiwiZW1haWxzIiwiZGlyZWN0IiwiJHB1c2giLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJ1c2Vyc19yZW1vdmVfZW1haWwiLCJwIiwiJHB1bGwiLCJ1c2Vyc192ZXJpZnlfZW1haWwiLCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbCIsInByaW1hcnkiLCJtdWx0aSIsInNob3dDYW5jZWxCdXR0b24iLCJjbG9zZU9uQ29uZmlybSIsImFuaW1hdGlvbiIsImlucHV0VmFsdWUiLCJ1cGRhdGVVc2VyQXZhdGFyIiwiZW1haWxUZW1wbGF0ZXMiLCJkZWZhdWx0RnJvbSIsInJlc2V0UGFzc3dvcmQiLCJzdWJqZWN0Iiwic3BsaXRzIiwidG9rZW5Db2RlIiwiZ3JlZXRpbmciLCJwcm9maWxlIiwidG9rZW5fY29kZSIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZCIsIm9yZ3MiLCJmdWxsbmFtZSIsIiRuZSIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwicmV0IiwibXNnIiwiUHVzaCIsIkNvbmZpZ3VyZSIsInNlbmRlcklEIiwiQU5EUk9JRF9TRU5ERVJfSUQiLCJzb3VuZCIsInZpYnJhdGUiLCJpb3MiLCJiYWRnZSIsImNsZWFyQmFkZ2UiLCJhbGVydCIsImFwcE5hbWUiLCJTZWxlY3RvciIsInNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluIiwic2VsZWN0b3IiLCJpc19jbG91ZGFkbWluIiwibWFwIiwibiIsInNlbGVjdG9yQ2hlY2tTcGFjZSIsInUiLCJiaWxsaW5nX3BheV9yZWNvcmRzIiwiYWRtaW5Db25maWciLCJpY29uIiwiY29sb3IiLCJ0YWJsZUNvbHVtbnMiLCJleHRyYUZpZWxkcyIsInJvdXRlckFkbWluIiwicGFpZCIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsImRpc2FibGVBZGQiLCJwYWdlTGVuZ3RoIiwib3JkZXIiLCJzcGFjZV91c2VyX3NpZ25zIiwiQWRtaW5Db25maWciLCJjb2xsZWN0aW9uc19hZGQiLCJzZWFyY2hFbGVtZW50IiwiTyIsImN1cnJlbnRFbGVtZW50Iiwid2Vic2VydmljZXMiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwic3RlZWRvc0F1dGgiLCJhbGxvd19tb2RlbHMiLCJtb2RlbCIsIlN0cmluZyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZ2V0UmVsYXRpdmVVcmwiLCJhdmF0YXJVcmwiLCJmaWxlIiwid3JpdGUiLCJpdGVtIiwiY2hhckNvZGVBdCIsInRvVXBwZXJDYXNlIiwidG9VVENTdHJpbmciLCJyZWFkU3RyZWFtIiwicGlwZSIsInB1Ymxpc2giLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsInN5bmNfZGlyZWN0aW9uIiwiZmwiLCJwZXJtcyIsInN0YXRlIiwiZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY2FuRWRpdCIsImNoYW5nZWRVc2VySW5mbyIsImNvbXBhbnlJZHMiLCJjb21wYW55cyIsImN1cnJlbnRVc2VyIiwibGFuZyIsImxvZ291dCIsInVzZXJDUCIsImNvbXBhbnlfaWRzIiwiYW55Iiwic2V0UGFzc3dvcmQiLCJhbGdvcml0aG0iLCJkaWdlc3QiLCJzZXJ2aWNlcyIsImJjcnlwdCIsIm1vYmlsZV92ZXJpZmllZCIsIlNNU1F1ZXVlIiwic2VuZCIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJyZW1vdGVfdXNlciIsImNoYW5nZVVzZXIiLCJyZWxhdGVkX3RvIiwiaWRzIiwiYmlsbGluZ01hbmFnZXIiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJhY2NvdW50aW5nX21vbnRoIiwiYmlsbGluZyIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwibW9tZW50IiwiZm9ybWF0IiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwidXNlcl9jb3VudCIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsInNwZWNpYWxfcGF5IiwibW9kdWxlX25hbWVzIiwidG90YWxfZmVlIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJpc19wYWlkIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJ0aW1lIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsInNpemUiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwidGltZUVuZCIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwicyIsImxpc3RwcmljZXMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJkZWZpbmVQcm9wZXJ0eSIsImRlcHRoIiwicmVkdWNlIiwiZmxhdCIsInRvRmxhdHRlbiIsImlzQXJyYXkiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJpbmZvIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7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QUFBQXAxQixVQUFNLGdCQUFOO0FBQ0EwVSxnQkFBWXZTLEdBQUd1SixJQURmO0FBRUEycEIsYUFBUyxDQUNSO0FBQ0N2d0IsWUFBTSxNQURQO0FBRUN3d0IsaUJBQVc7QUFGWixLQURRLENBRlQ7QUFRQUMsU0FBSyxJQVJMO0FBU0F6VyxpQkFBYSxDQUFDLEtBQUQsRUFBUSxPQUFSLENBVGI7QUFVQTBXLGtCQUFjLEtBVmQ7QUFXQUMsY0FBVSxLQVhWO0FBWUFyVyxnQkFBWSxFQVpaO0FBYUFzVyxVQUFNLEtBYk47QUFjQUMsZUFBVyxJQWRYO0FBZUFDLGVBQVcsSUFmWDtBQWdCQUMsb0JBQWdCLFVBQUMxWCxRQUFELEVBQVd4VSxNQUFYO0FBQ2YsVUFBQS9ILEdBQUEsRUFBQStMLEtBQUE7O0FBQUEsV0FBT2hFLE1BQVA7QUFDQyxlQUFPO0FBQUN3RCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDSUc7O0FESEpRLGNBQVF3USxTQUFTeFEsS0FBakI7O0FBQ0EsV0FBT0EsS0FBUDtBQUNDLGFBQUF3USxZQUFBLFFBQUF2YyxNQUFBdWMsU0FBQTJYLElBQUEsWUFBQWwwQixJQUFtQmYsTUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsSUFBNEIsQ0FBNUI7QUFDQzhNLGtCQUFRd1EsU0FBUzJYLElBQVQsQ0FBYzUxQixXQUFkLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLENBQVI7QUFGRjtBQ1FJOztBRExKLFdBQU95TixLQUFQO0FBQ0MsZUFBTztBQUFDUixlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBT2dSLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcbn0sICdzdGVlZG9zOmJhc2UnKTtcbiIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIGlmICghdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFsb2NhbGUpe1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG4gICAgfVxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxuICAgICAgICB9ZWxzZXtcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcblx0XHR9XG4gICAgfSk7XG59O1xuXG5cbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XG4gICAgICAgIHYucHVzaChtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdjtcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XG4gKi9cbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIGcgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIGcucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnO1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciByID0gbnVsbDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcjtcbn0iLCJTdGVlZG9zID1cblx0c2V0dGluZ3M6IHt9XG5cdGRiOiBkYlxuXHRzdWJzOiB7fVxuXHRpc1Bob25lRW5hYmxlZDogLT5cblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXG5cblx0XHRpZiAhbnVtYmVyXG5cdFx0XHRyZXR1cm4gJyc7XG5cblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxuXHRcdFx0aWYgc2NhbGUgfHwgc2NhbGUgPT0gMFxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xuXHRcdFx0XHRpZiAhKHNjYWxlIHx8IHNjYWxlID09IDApXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXG5cdFx0XHRcdFx0dW5sZXNzIHNjYWxlXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXG5cdFx0XHRcdGlmIHNjYWxlID09IDBcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcblx0XHRcdHJldHVybiBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblx0YXV0aFJlcXVlc3Q6ICh1cmwsIG9wdGlvbnMpIC0+XG5cdFx0dXNlclNlc3Npb24gPSBDcmVhdG9yLlVTRVJfQ09OVEVYVFxuXHRcdHNwYWNlSWQgPSB1c2VyU2Vzc2lvbi5zcGFjZUlkXG5cdFx0YXV0aFRva2VuID0gaWYgdXNlclNlc3Npb24uYXV0aFRva2VuIHRoZW4gdXNlclNlc3Npb24uYXV0aFRva2VuIGVsc2UgdXNlclNlc3Npb24udXNlci5hdXRoVG9rZW5cblx0XHRyZXN1bHQgPSBudWxsXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0dHJ5XG5cdFx0XHRhdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgc3BhY2VJZCArICcsJyArIGF1dGhUb2tlblxuXHRcdFx0aGVhZGVycyA9IFtcblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdDb250ZW50LVR5cGUnXG5cdFx0XHRcdFx0dmFsdWU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0XHR9XG5cdFx0XHRcdHtcblx0XHRcdFx0XHRuYW1lOiAnQXV0aG9yaXphdGlvbidcblx0XHRcdFx0XHR2YWx1ZTogYXV0aG9yaXphdGlvblxuXHRcdFx0XHR9XG5cdFx0XHRdXG5cdFx0XHRkZWZPcHRpb25zID0gXG5cdFx0XHR0eXBlOiAnZ2V0J1xuXHRcdFx0dXJsOiB1cmxcblx0XHRcdGRhdGFUeXBlOiAnanNvbidcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbidcblx0XHRcdGJlZm9yZVNlbmQ6IChYSFIpIC0+XG5cdFx0XHRcdGlmIGhlYWRlcnMgYW5kIGhlYWRlcnMubGVuZ3RoXG5cdFx0XHRcdFx0cmV0dXJuIGhlYWRlcnMuZm9yRWFjaCgoaGVhZGVyKSAtPlxuXHRcdFx0XHRcdFx0WEhSLnNldFJlcXVlc3RIZWFkZXIgaGVhZGVyLm5hbWUsIGhlYWRlci52YWx1ZVxuXHRcdFx0XHRcdClcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHRzdWNjZXNzOiAoZGF0YSkgLT5cblx0XHRcdFx0cmVzdWx0ID0gZGF0YVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdGVycm9yOiAoWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSAtPlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTlxuXHRcdFx0XHRpZiBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04gYW5kIFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTi5lcnJvclxuXHRcdFx0XHRcdGVycm9ySW5mbyA9IFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTi5lcnJvclxuXHRcdFx0XHRcdHJlc3VsdCA9IGVycm9yOiBlcnJvckluZm9cblx0XHRcdFx0XHRlcnJvck1zZyA9IHVuZGVmaW5lZFxuXHRcdFx0XHRcdGlmIGVycm9ySW5mby5yZWFzb25cblx0XHRcdFx0XHRcdGVycm9yTXNnID0gZXJyb3JJbmZvLnJlYXNvblxuXHRcdFx0XHRcdGVsc2UgaWYgZXJyb3JJbmZvLm1lc3NhZ2Vcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gZXJyb3JJbmZvLm1lc3NhZ2Vcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRlcnJvck1zZyA9IGVycm9ySW5mb1xuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIHQoZXJyb3JNc2cucmVwbGFjZSgvOi9nLCAn77yaJykpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0JC5hamF4IE9iamVjdC5hc3NpZ24oe30sIGRlZk9wdGlvbnMsIG9wdGlvbnMpXG5cdFx0XHRyZXR1cm4gcmVzdWx0XG5cdFx0Y2F0Y2ggZXJyXG5cdFx0XHRjb25zb2xlLmVycm9yIGVyclxuXHRcdFx0dG9hc3RyLmVycm9yIGVyclxuXHRcdHJldHVyblxuXG4jIyNcbiMgS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4jIEBuYW1lc3BhY2UgU3RlZWRvc1xuIyMjXG4jIGlmIE1ldGVvci5pc0NvcmRvdmFcbmlmIE1ldGVvci5pc0NvcmRvdmEgfHwgTWV0ZW9yLmlzQ2xpZW50XG5cdHJvb3RVcmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwuZGVmYXVsdE9wdGlvbnMucm9vdFVybFxuXHRpZiByb290VXJsLmVuZHNXaXRoKCcvJylcblx0XHRyb290VXJsID0gcm9vdFVybC5zdWJzdHIoMCwgcm9vdFVybC5sZW5ndGggLSAxKVxuXG5cdHdpbmRvdy5zdG9yZXM/LkFQST8uY2xpZW50Py5zZXRVcmwocm9vdFVybClcblx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldFJvb3RVcmwocm9vdFVybClcblx0d2luZG93WydzdGVlZG9zLnNldHRpbmcnXSA9IHtcblx0XHRyb290VXJsOiByb290VXJsXG5cdH1cblxuaWYgIU1ldGVvci5pc0NvcmRvdmEgJiYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMg6YWN572u5piv5ZCm5paw56qX5Y+j5omT5byA55qE5YWo5bGA5Y+Y6YePXG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0SHJlZlBvcHVwKE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnVpPy5ocmVmX3BvcHVwKVxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXHQjIE1ldGVvci5hdXRvcnVuICgpLT5cblx0IyBcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRVc2VySWQoU3RlZWRvcy51c2VySWQoKSlcblx0IyBcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRUZW5hbnRJZChTdGVlZG9zLnNwYWNlSWQoKSlcblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuU3RlZWRvcy5pc0V4cHJlc3Npb24gPSAoZnVuYykgLT5cblx0aWYgdHlwZW9mIGZ1bmMgIT0gJ3N0cmluZydcblx0XHRyZXR1cm4gZmFsc2Vcblx0cGF0dGVybiA9IC9ee3soLispfX0kL1xuXHRyZWcxID0gL157eyhmdW5jdGlvbi4rKX19JC9cblx0cmVnMiA9IC9ee3soLis9Pi4rKX19JC9cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZycgYW5kIGZ1bmMubWF0Y2gocGF0dGVybikgYW5kICFmdW5jLm1hdGNoKHJlZzEpIGFuZCAhZnVuYy5tYXRjaChyZWcyKVxuXHRcdHJldHVybiB0cnVlXG5cdGZhbHNlXG5cblN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uID0gKGZ1bmMsIGZvcm1EYXRhLCBkYXRhUGF0aCwgZ2xvYmFsKSAtPlxuXHRnZXRQYXJlbnRQYXRoID0gKHBhdGgpIC0+XG5cdFx0aWYgdHlwZW9mIHBhdGggPT0gJ3N0cmluZydcblx0XHRcdHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJylcblx0XHRcdGlmIHBhdGhBcnIubGVuZ3RoID09IDFcblx0XHRcdFx0cmV0dXJuICcjJ1xuXHRcdFx0cGF0aEFyci5wb3AoKVxuXHRcdFx0cmV0dXJuIHBhdGhBcnIuam9pbignLicpXG5cdFx0cmV0dXJuICcjJ1xuXHRnZXRWYWx1ZUJ5UGF0aCA9IChmb3JtRGF0YSwgcGF0aCkgLT5cblx0XHRpZiBwYXRoID09ICcjJyBvciAhcGF0aFxuXHRcdFx0cmV0dXJuIGZvcm1EYXRhIG9yIHt9XG5cdFx0ZWxzZSBpZiB0eXBlb2YgcGF0aCA9PSAnc3RyaW5nJ1xuXHRcdFx0cmV0dXJuIF8uZ2V0KGZvcm1EYXRhLCBwYXRoKVxuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ3BhdGggaGFzIHRvIGJlIGEgc3RyaW5nJ1xuXHRcdHJldHVyblxuXHRpZiBmb3JtRGF0YSA9PSB1bmRlZmluZWRcblx0XHRmb3JtRGF0YSA9IHt9XG5cdHBhcmVudFBhdGggPSBnZXRQYXJlbnRQYXRoKGRhdGFQYXRoKVxuXHRwYXJlbnQgPSBnZXRWYWx1ZUJ5UGF0aChmb3JtRGF0YSwgcGFyZW50UGF0aCkgb3Ige31cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZydcblx0XHRmdW5jQm9keSA9IGZ1bmMuc3Vic3RyaW5nKDIsIGZ1bmMubGVuZ3RoIC0gMilcblx0XHRnbG9iYWxUYWcgPSAnX19HX0xfT19CX0FfTF9fJ1xuXHRcdHN0ciA9ICdcXG4gICAgcmV0dXJuICcgKyBmdW5jQm9keS5yZXBsYWNlKC9cXGJmb3JtRGF0YVxcYi9nLCBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIGdsb2JhbFRhZykpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBKU09OLnN0cmluZ2lmeShnbG9iYWwpKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiJyArIGdsb2JhbFRhZyArICdcXFxcYicsICdnJyksICdnbG9iYWwnKS5yZXBsYWNlKC9yb290VmFsdWUvZywgSlNPTi5zdHJpbmdpZnkocGFyZW50KSlcblx0XHR0cnlcblx0XHRcdHJldHVybiBGdW5jdGlvbihzdHIpKClcblx0XHRjYXRjaCBlcnJvclxuXHRcdFx0Y29uc29sZS5sb2cgZXJyb3IsIGZ1bmMsIGRhdGFQYXRoXG5cdFx0XHRyZXR1cm4gZnVuY1xuXHRlbHNlXG5cdFx0cmV0dXJuIGZ1bmNcblx0cmV0dXJuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXG5cdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gKCktPlxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXG5cdFx0aWYgYWNjb3VudEJnQm9keVxuXHRcdFx0cmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0YXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclxuXHRcdCMgaWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdCMgXHRpZiB1cmwgPT0gYXZhdGFyXG5cdFx0IyBcdFx0YXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcblx0XHQjIFx0ZWxzZVxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpfSlcIlxuXHRcdCMgZWxzZVxuXHRcdCMgXHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXG5cdFx0IyBcdGlmIGJhY2tncm91bmRcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHRiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cblx0XHRpZiBpc05lZWRUb0xvY2FsXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsYXZhdGFyKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxuXHRcdGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInNraW5cIn0pXG5cdFx0aWYgYWNjb3VudFNraW5cblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcblx0XHRpZiBhY2NvdW50Wm9vbVxuXHRcdFx0cmV0dXJuIGFjY291bnRab29tLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdCMgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0IyBcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0IyBcdGFjY291bnRab29tVmFsdWUgPSB7fVxuXHRcdCMgXHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdCMgXHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXHRcdCMgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuXHRcdCMgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHQjIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXG5cdFx0IyB1bmxlc3Mgem9vbU5hbWVcblx0XHQjIFx0em9vbU5hbWUgPSBcImxhcmdlXCJcblx0XHQjIFx0em9vbVNpemUgPSAxLjJcblx0XHQjIGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcblx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0IyBcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdCMgXHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXG5cdFx0IyBcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcblx0XHQjIFx0IyBcdFx0em9vbVNpemUgPSAwXG5cdFx0IyBcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXG5cdFx0IyBcdCMgZWxzZVxuXHRcdCMgXHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0IyBpZiBpc05lZWRUb0xvY2FsXG5cdFx0IyBcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdCMgXHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdCMgXHRcdHJldHVyblxuXHRcdCMgXHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHQjIFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0IyBcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHQjIFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHQjIFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxuXHRcdCMgXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXG5cdFx0IyBcdFx0ZWxzZVxuXHRcdCMgXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHQjIFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cblx0U3RlZWRvcy5zaG93SGVscCA9ICh1cmwpLT5cblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcblxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5cdFx0d2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxuXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXG5cdFx0bGlua2VyID0gXCI/XCJcblxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxuXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIHVybFxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcblxuXHRTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXG5cblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblx0XHRpZiAhYXBwXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblx0XHQjIFx0cmV0dXJuXG5cblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xuXHRcdGlmIGFwcC5pc191c2VfaWVcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdGlmIG9uX2NsaWNrXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxuXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxuXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5Ncblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXG5cdFx0XHR0cnlcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRtaW5fbW9udGhzID0gMVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdG1pbl9tb250aHMgPSAzXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXG5cdFx0aWYgc3BhY2UgJiYgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcblxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHR3aGVuICdub3JtYWwnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcblx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcblxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcblxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcblx0XHRlbHNlXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XG5cdFx0aWYgb2Zmc2V0XG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxuXHRcdERFVklDRSA9XG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXG5cdFx0XHRpcGFkOiAnaXBhZCdcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcblx0XHRcdGlwb2Q6ICdpcG9kJ1xuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xuXHRcdGJyb3dzZXIgPSB7fVxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2Vcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xuXHRcdFx0Jydcblx0XHRcdERFVklDRS5kZXNrdG9wXG5cdFx0XVxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcblxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRyZXR1cm5cblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGlmclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXG5cdFx0XHRpZnIubG9hZCAtPlxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXG5cdFx0XHRcdGlmIGlmckJvZHlcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXG5cblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGNoZWNrID0gZmFsc2Vcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxuXHRcdFx0Y2hlY2sgPSB0cnVlXG5cdFx0cmV0dXJuIGNoZWNrXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHRpc09yZ0FkbWluID0gZmFsc2Vcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcblx0XHRwYXJlbnRzID0gW11cblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxuXHRcdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0aSA9IDBcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRpKytcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxuXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXG5cblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcblxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxuXG5cdFx0XHRpZiAhdXNlclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcblxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB1c2VyXG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdGlmIHVzZXJcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHR0cnlcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdGtleTMyID0gXCJcIlxuXHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0YyA9IFwiXCJcblx0XHRcdGkgPSAwXG5cdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0aSsrXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cblxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxuXG5cdFx0aWYgdXNlclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXG5cblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcblx0XHRcdGlmIG9ialxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXG5cdFx0cmV0dXJuIG51bGxcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxuXHRcdHRyeVxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxuXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cblxubWl4aW4gPSAob2JqKSAtPlxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxuXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cblx0XHRpZiAhZGF0ZVxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxuXHRcdFx0aWYgaSA8IGRheXNcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcblxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxuXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXG5cblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblxuXHRcdGogPSAwXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSAwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcblx0XHRcdFx0aiA9IGxlbi8yXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxuXHRcdFx0aSA9IDBcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxuXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXG5cdFx0XHRcdFx0YnJlYWtcblxuXHRcdFx0XHRpKytcblxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gaSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxuXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxuXG5cdFx0aWYgaiA+IG1heF9pbmRleFxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6Vcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxuXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcblx0XHRcdGlmIGFwcFxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdFx0XHRpID0gMFxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxuXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcblx0XHRcdGlmIGlzSTE4blxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdHJldHVybiBsb2NhbGVcblxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxuXG5cblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXG5cdFx0XHR2YWxpZCA9IHRydWVcblx0XHRcdHVubGVzcyBwd2Rcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXG5cdFx0XHRwYXNzd29yUG9saWN5ID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeVxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yIHx8IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3llcnJvciB8fCBcIuWvhueggeS4jeespuWQiOinhOWImVwiXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XG5cdFx0XHRcdGlmICEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXG4jXHRcdFx0ZWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRpZiB2YWxpZFxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XG5cdGRiQXBwcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChhcHApLT5cblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcblxuXHRyZXR1cm4gZGJBcHBzXG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gKHNwYWNlX2lkKS0+XG5cdGRiRGFzaGJvYXJkcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChkYXNoYm9hcmQpLT5cblx0XHRkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmRcblxuXHRyZXR1cm4gZGJEYXNoYm9hcmRzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxuI1x0XHRlbHNlXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByb290VXJsOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciByZWYsIHJlZjEsIHJlZztcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmIChzY2FsZSB8fCBzY2FsZSA9PT0gMCkge1xuICAgICAgICBudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90VGhvdXNhbmRzKSB7XG4gICAgICAgIGlmICghKHNjYWxlIHx8IHNjYWxlID09PSAwKSkge1xuICAgICAgICAgIHNjYWxlID0gKHJlZiA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLykpICE9IG51bGwgPyAocmVmMSA9IHJlZlsxXSkgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGlmICghc2NhbGUpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nO1xuICAgICAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2c7XG4gICAgICAgIH1cbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH0sXG4gIGF1dGhSZXF1ZXN0OiBmdW5jdGlvbih1cmwsIG9wdGlvbnMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBhdXRob3JpemF0aW9uLCBkZWZPcHRpb25zLCBlcnIsIGhlYWRlcnMsIHJlc3VsdCwgc3BhY2VJZCwgdXNlclNlc3Npb247XG4gICAgdXNlclNlc3Npb24gPSBDcmVhdG9yLlVTRVJfQ09OVEVYVDtcbiAgICBzcGFjZUlkID0gdXNlclNlc3Npb24uc3BhY2VJZDtcbiAgICBhdXRoVG9rZW4gPSB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gPyB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gOiB1c2VyU2Vzc2lvbi51c2VyLmF1dGhUb2tlbjtcbiAgICByZXN1bHQgPSBudWxsO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB0cnkge1xuICAgICAgYXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHNwYWNlSWQgKyAnLCcgKyBhdXRoVG9rZW47XG4gICAgICBoZWFkZXJzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgdmFsdWU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICB9LCB7XG4gICAgICAgICAgbmFtZTogJ0F1dGhvcml6YXRpb24nLFxuICAgICAgICAgIHZhbHVlOiBhdXRob3JpemF0aW9uXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgICBkZWZPcHRpb25zID0ge1xuICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKFhIUikge1xuICAgICAgICAgIGlmIChoZWFkZXJzICYmIGhlYWRlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICAgICAgICByZXR1cm4gWEhSLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLm5hbWUsIGhlYWRlci52YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICByZXN1bHQgPSBkYXRhO1xuICAgICAgICB9LFxuICAgICAgICBlcnJvcjogZnVuY3Rpb24oWE1MSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgdmFyIGVycm9ySW5mbywgZXJyb3JNc2c7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04pO1xuICAgICAgICAgIGlmIChYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04gJiYgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OLmVycm9yKSB7XG4gICAgICAgICAgICBlcnJvckluZm8gPSBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04uZXJyb3I7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgIGVycm9yOiBlcnJvckluZm9cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBlcnJvck1zZyA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChlcnJvckluZm8ucmVhc29uKSB7XG4gICAgICAgICAgICAgIGVycm9yTXNnID0gZXJyb3JJbmZvLnJlYXNvbjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3JJbmZvLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgICAgZXJyb3JNc2cgPSBlcnJvckluZm8ubWVzc2FnZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGVycm9yTXNnID0gZXJyb3JJbmZvO1xuICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IodChlcnJvck1zZy5yZXBsYWNlKC86L2csICfvvJonKSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICAkLmFqYXgoT2JqZWN0LmFzc2lnbih7fSwgZGVmT3B0aW9ucywgb3B0aW9ucykpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGVyciA9IGVycm9yMTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHRvYXN0ci5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5pZiAoTWV0ZW9yLmlzQ29yZG92YSB8fCBNZXRlb3IuaXNDbGllbnQpIHtcbiAgcm9vdFVybCA9IE1ldGVvci5hYnNvbHV0ZVVybC5kZWZhdWx0T3B0aW9ucy5yb290VXJsO1xuICBpZiAocm9vdFVybC5lbmRzV2l0aCgnLycpKSB7XG4gICAgcm9vdFVybCA9IHJvb3RVcmwuc3Vic3RyKDAsIHJvb3RVcmwubGVuZ3RoIC0gMSk7XG4gIH1cbiAgaWYgKChyZWYgPSB3aW5kb3cuc3RvcmVzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWYxID0gcmVmLkFQSSkgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWYyID0gcmVmMS5jbGllbnQpICE9IG51bGwpIHtcbiAgICAgICAgcmVmMi5zZXRVcmwocm9vdFVybCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICgocmVmMyA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjQgPSByZWYzLlNldHRpbmdzKSAhPSBudWxsKSB7XG4gICAgICByZWY0LnNldFJvb3RVcmwocm9vdFVybCk7XG4gICAgfVxuICB9XG4gIHdpbmRvd1snc3RlZWRvcy5zZXR0aW5nJ10gPSB7XG4gICAgcm9vdFVybDogcm9vdFVybFxuICB9O1xufVxuXG5pZiAoIU1ldGVvci5pc0NvcmRvdmEgJiYgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWY1LCByZWY2LCByZWY3LCByZWY4O1xuICAgIHJldHVybiAocmVmNSA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwgPyAocmVmNiA9IHJlZjUuU2V0dGluZ3MpICE9IG51bGwgPyByZWY2LnNldEhyZWZQb3B1cCgocmVmNyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy51aSkgIT0gbnVsbCA/IHJlZjguaHJlZl9wb3B1cCA6IHZvaWQgMCA6IHZvaWQgMCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gIH0pO1xufVxuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5TdGVlZG9zLmlzRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgdmFyIHBhdHRlcm4sIHJlZzEsIHJlZzI7XG4gIGlmICh0eXBlb2YgZnVuYyAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcGF0dGVybiA9IC9ee3soLispfX0kLztcbiAgcmVnMSA9IC9ee3soZnVuY3Rpb24uKyl9fSQvO1xuICByZWcyID0gL157eyguKz0+LispfX0kLztcbiAgaWYgKHR5cGVvZiBmdW5jID09PSAnc3RyaW5nJyAmJiBmdW5jLm1hdGNoKHBhdHRlcm4pICYmICFmdW5jLm1hdGNoKHJlZzEpICYmICFmdW5jLm1hdGNoKHJlZzIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24gPSBmdW5jdGlvbihmdW5jLCBmb3JtRGF0YSwgZGF0YVBhdGgsIGdsb2JhbCkge1xuICB2YXIgZXJyb3IsIGZ1bmNCb2R5LCBnZXRQYXJlbnRQYXRoLCBnZXRWYWx1ZUJ5UGF0aCwgZ2xvYmFsVGFnLCBwYXJlbnQsIHBhcmVudFBhdGgsIHN0cjtcbiAgZ2V0UGFyZW50UGF0aCA9IGZ1bmN0aW9uKHBhdGgpIHtcbiAgICB2YXIgcGF0aEFycjtcbiAgICBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICBwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpO1xuICAgICAgaWYgKHBhdGhBcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiAnIyc7XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgcmV0dXJuIHBhdGhBcnIuam9pbignLicpO1xuICAgIH1cbiAgICByZXR1cm4gJyMnO1xuICB9O1xuICBnZXRWYWx1ZUJ5UGF0aCA9IGZ1bmN0aW9uKGZvcm1EYXRhLCBwYXRoKSB7XG4gICAgaWYgKHBhdGggPT09ICcjJyB8fCAhcGF0aCkge1xuICAgICAgcmV0dXJuIGZvcm1EYXRhIHx8IHt9O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHBhdGggPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gXy5nZXQoZm9ybURhdGEsIHBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdwYXRoIGhhcyB0byBiZSBhIHN0cmluZycpO1xuICAgIH1cbiAgfTtcbiAgaWYgKGZvcm1EYXRhID09PSB2b2lkIDApIHtcbiAgICBmb3JtRGF0YSA9IHt9O1xuICB9XG4gIHBhcmVudFBhdGggPSBnZXRQYXJlbnRQYXRoKGRhdGFQYXRoKTtcbiAgcGFyZW50ID0gZ2V0VmFsdWVCeVBhdGgoZm9ybURhdGEsIHBhcmVudFBhdGgpIHx8IHt9O1xuICBpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnKSB7XG4gICAgZnVuY0JvZHkgPSBmdW5jLnN1YnN0cmluZygyLCBmdW5jLmxlbmd0aCAtIDIpO1xuICAgIGdsb2JhbFRhZyA9ICdfX0dfTF9PX0JfQV9MX18nO1xuICAgIHN0ciA9ICdcXG4gICAgcmV0dXJuICcgKyBmdW5jQm9keS5yZXBsYWNlKC9cXGJmb3JtRGF0YVxcYi9nLCBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIGdsb2JhbFRhZykpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBKU09OLnN0cmluZ2lmeShnbG9iYWwpKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiJyArIGdsb2JhbFRhZyArICdcXFxcYicsICdnJyksICdnbG9iYWwnKS5yZXBsYWNlKC9yb290VmFsdWUvZywgSlNPTi5zdHJpbmdpZnkocGFyZW50KSk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBGdW5jdGlvbihzdHIpKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlcnJvciA9IGVycm9yMTtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLCBmdW5jLCBkYXRhUGF0aCk7XG4gICAgICByZXR1cm4gZnVuYztcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZ1bmM7XG4gIH1cbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge307XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmNTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZjUgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZjUubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY1O1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmNSA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWY1LmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNS51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWY2ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNi5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjcgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY3W1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWY4ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmOFtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNVtcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmNiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjZbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjcgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmNy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjggPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmOC5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmNSwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmNS50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZjEwLCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZWY5LCB2YWxpZDtcbiAgICAgIHJlYXNvbiA9IHQoXCJwYXNzd29yZF9pbnZhbGlkXCIpO1xuICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgaWYgKCFwd2QpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhc3N3b3JQb2xpY3kgPSAocmVmNSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjYucG9saWN5IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcGFzc3dvclBvbGljeUVycm9yID0gKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnBhc3N3b3JkKSAhPSBudWxsID8gcmVmOC5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgKChyZWY5ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjEwID0gcmVmOS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEwLnBvbGljeWVycm9yIDogdm9pZCAwIDogdm9pZCAwKSB8fCBcIuWvhueggeS4jeespuWQiOinhOWImVwiO1xuICAgICAgaWYgKHBhc3N3b3JQb2xpY3kpIHtcbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpKSB7XG4gICAgICAgICAgcmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiRGFzaGJvYXJkcztcbiAgZGJEYXNoYm9hcmRzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICByZXR1cm4gZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmV0dXJuIGRiRGFzaGJvYXJkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgICBvYmplY3QgPSB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gICAgfTtcbiAgICBpc2RvY3VtZW50REIgPSAoKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNiA9IHJlZjUuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmNyA9IHJlZjZbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmNy5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmb3JlaWduX2tleTogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksIHJlZmVyZW5jZXM6IE1hdGNoLk9wdGlvbmFsKE9iamVjdCl9KTtcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgICAgICAgICAgdXBkYXRlVXNlckxhc3RMb2dvbjogKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsICd1cGRhdGVVc2VyTGFzdExvZ29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGxhc3RfbG9nb246IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNZXRlb3IuY2FsbCgndXBkYXRlVXNlckxhc3RMb2dvbicpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICBNZXRlb3IubWV0aG9kc1xuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIGlmIGRiLnVzZXJzLmZpbmQoe1wiZW1haWxzLmFkZHJlc3NcIjogZW1haWx9KS5jb3VudCgpPjBcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdXNoOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHNldDogXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgXVxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPj0gMlxuICAgICAgICBwID0gbnVsbFxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgICBwID0gZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1bGw6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgcFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwifVxuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIFxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlsc1xuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgZS5wcmltYXJ5ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcblxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXG4gICAgICAgICRzZXQ6XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcbiAgICAgICAgICBlbWFpbDogZW1haWxcblxuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7dXNlcjogdGhpcy51c2VySWR9LHskc2V0OiB7ZW1haWw6IGVtYWlsfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICByZXR1cm4ge31cblxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gKCktPlxuICAgICAgICBzd2FsXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIChlcnJvciwgcmVzdWx0KS0+XG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcbiMjI1xuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuIyMjIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXNlcnNfYWRkX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChkYi51c2Vycy5maW5kKHtcbiAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbFxuICAgICAgfSkuY291bnQoKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbCxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgcCwgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPj0gMikge1xuICAgICAgICBwID0gbnVsbDtcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICAgIHAgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgZW1haWxzLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlscztcbiAgICAgIGVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICB9LCBmdW5jdGlvbihpbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgPyByZXN1bHQuZXJyb3IgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3dhbCh0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuXG5cbi8qXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICAqIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuICovXG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7YXZhdGFyOiBhdmF0YXJ9fSkgICIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJBdmF0YXI6IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGF2YXRhcjogYXZhdGFyXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCJBY2NvdW50cy5lbWFpbFRlbXBsYXRlcyA9IHtcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncylcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbTtcblx0fSkoKSxcblx0cmVzZXRQYXNzd29yZDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHR2ZXJpZnlFbWFpbDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9lbWFpbFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0ZW5yb2xsQWNjb3VudDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2NyZWF0ZV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH1cbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxuXHR7XG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxuXHRcdHtcblx0XHRcdC8vIOiHquW3seWSjOWtkOmDqOmXqOeahGZ1bGxuYW1l5L+u5pS5XG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XG5cdFx0XHRcblx0XHR9KTtcblx0fVx0XG5cbiAgXHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgXHRkYXRhOiB7XG5cdCAgICAgIFx0cmV0OiAwLFxuXHQgICAgICBcdG1zZzogXCJTdWNjZXNzZnVsbHlcIlxuICAgIFx0fVxuICBcdH0pO1xufSk7XG5cbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcbiAgICAgICAgTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpb3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuIiwiaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFB1c2guQ29uZmlndXJlKHtcbiAgICAgIGFuZHJvaWQ6IHtcbiAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRCxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBpb3M6IHtcbiAgICAgICAgYmFkZ2U6IHRydWUsXG4gICAgICAgIGNsZWFyQmFkZ2U6IHRydWUsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNlbGVjdG9yID0ge31cblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7YWRtaW5zOnskaW46W3VzZXJJZF19fSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG5cdFx0aWYgc3BhY2VJZFxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXG5cdFx0c3BhY2VzID0gW11cblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XG5cdFx0XHRzcGFjZXMucHVzaCh1LnNwYWNlKVxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cblx0aWNvbjogXCJnbG9iZVwiXG5cdGNvbG9yOiBcImJsdWVcIlxuXHR0YWJsZUNvbHVtbnM6IFtcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXG5cdFx0e25hbWU6IFwibW9kdWxlc1wifSxcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxuXHRdXG5cdGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0cmV0dXJuIHt9XG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxuXHRzaG93RGVsQ29sdW1uOiBmYWxzZVxuXHRkaXNhYmxlQWRkOiB0cnVlXG5cdHBhZ2VMZW5ndGg6IDEwMFxuXHRvcmRlcjogW1swLCBcImRlc2NcIl1dXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdEBzcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWduc1xuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxuXHRcdHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWdcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG4gPSBwYXJzZUludChhcmd1bWVudHNbMV0pIHx8IDA7XG4gICAgdmFyIGs7XG4gICAgaWYgKG4gPj0gMCkge1xuICAgICAgayA9IG47XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW4gKyBuO1xuICAgICAgaWYgKGsgPCAwKSB7ayA9IDA7fVxuICAgIH1cbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxuICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGsrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSIsIk1ldGVvci5zdGFydHVwIC0+XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXG5cbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cbiAgICAgIHd3dzogXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XG5cdGxpc3RWaWV3cyA9IHt9XG5cblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxuXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZldGNoKClcblxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXHRfLmZvckVhY2ggb2JqZWN0cywgKG8sIGtleSktPlxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3Rfdmlldylcblx0XHRcdGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3XG5cdHJldHVybiBsaXN0Vmlld3NcblxuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSlcblxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXG5cblxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIi8vIFNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XG5cbi8vICAgdmFyIGNoZWNrRm9yS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcbi8vICAgICB9XG4vLyAgIH07XG4vLyAgIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbi8vICAgICByZXR1cm4gb2JqICYmIG9iai52YWx1ZXMgJiYgb2JqLnZhbHVlc1trZXldO1xuLy8gICB9O1xuLy8gICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiB0cnVlO1xuLy8gICB9O1xuXG4vLyAgIENvbGxlY3Rpb24uZGVueSh7XG4vLyAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH0sXG4vLyAgICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9XG4vLyAgIH0pO1xuXG4vLyAgIC8vIHB1YmxpYyBjbGllbnQgYW5kIHNlcnZlciBhcGlcbi8vICAgdmFyIGFwaSA9IHtcbi8vICAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgICAgY29uc29sZS5sb2coQ29sbGVjdGlvbi5maW5kT25lKCkpO1xuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKTtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAvLyAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuLy8gICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuLy8gICAgIH0sXG4vLyAgICAgJ2VxdWFscyc6IGZ1bmN0aW9uIChrZXksIGV4cGVjdGVkLCBpZGVudGljYWwpIHtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuXG4vLyAgICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcblxuLy8gICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmIF8uaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4vLyAgICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xuLy8gICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XG4vLyAgICAgfVxuLy8gICB9O1xuXG4vLyAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCl7XG4vLyAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuLy8gICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XG4vLyAgICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSlcbi8vICAgICB9XG4vLyAgIH0pXG5cbi8vICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuLy8gICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbi8vICAgICAvLyAgIGlmIChDb2xsZWN0aW9uLmZpbmRPbmUoKSkge1xuLy8gICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcbi8vICAgICAvLyAgIH1cbi8vICAgICAvLyB9KTtcblxuLy8gICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbi8vICAgICAgIHZhciBjbGllbnRJRCA9IGNvbm5lY3Rpb24uaWQ7XG5cbi8vICAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5pbnNlcnQoeyAnY2xpZW50SUQnOiBjbGllbnRJRCwgJ3ZhbHVlcyc6IHt9LCBcImNyZWF0ZWRcIjogbmV3IERhdGUoKSB9KTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgY29ubmVjdGlvbi5vbkNsb3NlKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH0pO1xuXG4vLyAgICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZCh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5tZXRob2RzKHtcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgICB9LFxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XG5cbi8vICAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcblxuLy8gICAgICAgICBpZiAoIWNvbmRpdGlvbihrZXksIHZhbHVlKSlcbi8vICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XG5cbi8vICAgICAgICAgdmFyIHVwZGF0ZU9iaiA9IHt9O1xuLy8gICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xuXG4vLyAgICAgICAgIENvbGxlY3Rpb24udXBkYXRlKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0sIHsgJHNldDogdXBkYXRlT2JqIH0pO1xuLy8gICAgICAgfVxuLy8gICAgIH0pOyAgXG5cbi8vICAgICAvLyBzZXJ2ZXItb25seSBhcGlcbi8vICAgICBfLmV4dGVuZChhcGksIHtcbi8vICAgICAgICdzZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXRDb25kaXRpb24nOiBmdW5jdGlvbiAobmV3Q29uZGl0aW9uKSB7XG4vLyAgICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfVxuXG4vLyAgIHJldHVybiBhcGk7XG4vLyB9KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0dXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCByZXEucXVlcnk/LnVzZXJJZFxuXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxuXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxuXHRcdFxuXHRcdGlmICF1c2VyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRyZXR1cm47XG5cblx0XHR1c2VyX2lkID0gdXNlci5faWRcblxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxuXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcblxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogYXBwc31cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XG5cdFxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB0cnlcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXG4gICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgIWF1dGhUb2tlblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcbiAgICAgICAgZGF0YSA9IFtdXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpXG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogW11cblxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHt9XG4iLCJ2YXIgQ29va2llcywgc3RlZWRvc0F1dGg7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKG1vZGVsID09PSAnbWFpbF9hY2NvdW50cycpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pO1xuICB9XG59KTtcbiIsImNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKVxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZClcblx0aWYgYXBwXG5cdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXHRcdHJlZGlyZWN0VXJsID0gYXBwLnVybFxuXHRlbHNlXG5cdFx0c2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRyZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmxcblxuXHRpZiAhcmVkaXJlY3RVcmxcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdHJlcy5lbmQoKVxuXHRcdHJldHVyblxuXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuXHQjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuXHQjIGlmIHJlcS5ib2R5XG5cdCMgXHR1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxuXHQjIFx0YXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHQjICMgdGhlbiBjaGVjayBjb29raWVcblx0IyBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdCMgXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cblx0XHR1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl1cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRpZiB1c2VyXG5cdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdCMgZGVzLWNiY1xuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXG5cdFx0XHRrZXk4ID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDhcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDggLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gOFxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXG5cdFx0XHRkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSlcblx0XHRcdGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSlcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRqb2luZXIgPSBcIj9cIlxuXG5cdFx0XHRpZiByZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRcdGpvaW5lciA9IFwiJlwiXG5cblx0XHRcdHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlblxuXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXG5cdFx0XHRcdHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9I3tlbmNvZGVVUkkodXNlci51c2VybmFtZSl9XCJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCByZXR1cm51cmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdHJlcy53cml0ZUhlYWQgNDAxXG5cdHJlcy5lbmQoKVxuXHRyZXR1cm5cbiIsInZhciBDb29raWVzLCBjcnlwdG8sIGV4cHJlc3M7XG5cbmNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHAsIGF1dGhUb2tlbiwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgY29va2llcywgZGVzX2NpcGhlciwgZGVzX2NpcGhlcmVkTXNnLCBkZXNfaXYsIGRlc19zdGVlZG9zX3Rva2VuLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGpvaW5lciwga2V5MzIsIGtleTgsIGxlbiwgbSwgbm93LCByZWRpcmVjdFVybCwgcmV0dXJudXJsLCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgYXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKTtcbiAgaWYgKGFwcCkge1xuICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgcmVkaXJlY3RVcmwgPSBhcHAudXJsO1xuICB9IGVsc2Uge1xuICAgIHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgIHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybDtcbiAgfVxuICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgaWYgKCF1c2VySWQgJiYgIWF1dGhUb2tlbikge1xuICAgIHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIH1cbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgfVxuICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBkZXNfaXYgPSBcIi04NzYyLWZjXCI7XG4gICAgICBrZXk4ID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDgpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gOCAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gOCkge1xuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLCA4KTtcbiAgICAgIH1cbiAgICAgIGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKTtcbiAgICAgIGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSk7XG4gICAgICBkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBqb2luZXIgPSBcIj9cIjtcbiAgICAgIGlmIChyZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICAgIGpvaW5lciA9IFwiJlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuO1xuICAgICAgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT1cIiArIChlbmNvZGVVUkkodXNlci51c2VybmFtZSkpO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHJldHVybnVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgcmVzLmVuZCgpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0IyB0aGlzLnBhcmFtcyA9XG5cdFx0IyBcdHVzZXJJZDogZGVjb2RlVVJJKHJlcS51cmwpLnJlcGxhY2UoL15cXC8vLCAnJykucmVwbGFjZSgvXFw/LiokLywgJycpXG5cdFx0d2lkdGggPSA1MCA7XG5cdFx0aGVpZ2h0ID0gNTAgO1xuXHRcdGZvbnRTaXplID0gMjggO1xuXHRcdGlmIHJlcS5xdWVyeS53XG5cdFx0ICAgIHdpZHRoID0gcmVxLnF1ZXJ5LncgO1xuXHRcdGlmIHJlcS5xdWVyeS5oXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcblx0XHRpZiByZXEucXVlcnkuZnNcbiAgICAgICAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzIDtcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcblx0XHRpZiAhdXNlclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLnByb2ZpbGU/LmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuXHRcdFx0XHRcdCB2aWV3Qm94PVwiMCAwIDcyIDcyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0XHRcdDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XG5cdFx0XHRcdFx0LnN0MXtmaWxsOiNEMEQwRDA7fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelwiLz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcblx0XHRcdFx0XHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elwiLz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcblx0XHRcdFx0XHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcIi8+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG4jXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZ1wiKVxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XG5cdFx0aWYgIXVzZXJuYW1lXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXG5cdFx0XHRjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXG5cblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcblx0XHRcdGNvbG9yX2luZGV4ID0gMFxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXG5cdFx0XHQjY29sb3IgPSBcIiNENkRBRENcIlxuXG5cdFx0XHRpbml0aWFscyA9ICcnXG5cdFx0XHRpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxuXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcblxuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cblx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiI3t3aWR0aH1cIiBoZWlnaHQ9XCIje2hlaWdodH1cIiBzdHlsZT1cIndpZHRoOiAje3dpZHRofXB4OyBoZWlnaHQ6ICN7aGVpZ2h0fXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yfTtcIj5cblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cblx0XHRcdFx0XHQje2luaXRpYWxzfVxuXHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuXHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcblx0XHRcdFx0cmVzLndyaXRlSGVhZCAzMDRcblx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aFxuXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXG5cdFx0cmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNvbG9yLCBjb2xvcl9pbmRleCwgY29sb3JzLCBmb250U2l6ZSwgaGVpZ2h0LCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVxTW9kaWZpZWRIZWFkZXIsIHN2ZywgdXNlciwgdXNlcm5hbWUsIHVzZXJuYW1lX2FycmF5LCB3aWR0aDtcbiAgICB3aWR0aCA9IDUwO1xuICAgIGhlaWdodCA9IDUwO1xuICAgIGZvbnRTaXplID0gMjg7XG4gICAgaWYgKHJlcS5xdWVyeS53KSB7XG4gICAgICB3aWR0aCA9IHJlcS5xdWVyeS53O1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmgpIHtcbiAgICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oO1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmZzKSB7XG4gICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcztcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXIpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHVzZXIucHJvZmlsZSkgIT0gbnVsbCA/IHJlZi5hdmF0YXIgOiB2b2lkIDApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyVXJsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgc3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgaWQ9XFxcIkxheWVyXzFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHg9XFxcIjBweFxcXCIgeT1cXFwiMHB4XFxcIlxcblx0IHZpZXdCb3g9XFxcIjAgMCA3MiA3MlxcXCIgc3R5bGU9XFxcImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XFxcIiB4bWw6c3BhY2U9XFxcInByZXNlcnZlXFxcIj5cXG48c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0LnN0MHtmaWxsOiNGRkZGRkY7fVxcblx0LnN0MXtmaWxsOiNEMEQwRDA7fVxcbjwvc3R5bGU+XFxuPGc+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QwXFxcIiBkPVxcXCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelxcXCIvPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxcblx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XFxcIi8+XFxuPC9nPlxcbjxnPlxcblx0PGc+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXFxuXHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elxcXCIvPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XFxuXHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcXFwiLz5cXG5cdDwvZz5cXG48L2c+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSk7XG4gICAgICBjb2xvcl9pbmRleCA9IDA7XG4gICAgICBfLmVhY2godXNlcm5hbWVfYXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcbiAgICAgIH0pO1xuICAgICAgcG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGg7XG4gICAgICBjb2xvciA9IGNvbG9yc1twb3NpdGlvbl07XG4gICAgICBpbml0aWFscyA9ICcnO1xuICAgICAgaWYgKHVzZXJuYW1lLmNoYXJDb2RlQXQoMCkgPiAyNTUpIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKTtcbiAgICAgIHN2ZyA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiIHN0YW5kYWxvbmU9XFxcIm5vXFxcIj8+XFxuPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJub25lXFxcIiB3aWR0aD1cXFwiXCIgKyB3aWR0aCArIFwiXFxcIiBoZWlnaHQ9XFxcIlwiICsgaGVpZ2h0ICsgXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgKyBoZWlnaHQgKyBcInB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGNvbG9yICsgXCI7XFxcIj5cXG5cdDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZm9udC1mYW1pbHk9XFxcIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcInB4O1xcXCI+XFxuXHRcdFwiICsgaW5pdGlhbHMgKyBcIlxcblx0PC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZjEgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMS50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYyID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjIudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdFx0YWNjZXNzX3Rva2VuID0gcmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcblx0XHRcdHJlcy53cml0ZUhlYWQgMjAwXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ2FwcHMnLCAoc3BhY2VJZCktPlxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcbiAgICAgICAgXG5cbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XG4gICAgICAgIGlmIHNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge3NvcnQ6IHtzb3J0OiAxfX0pO1xuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcblxuXHQjIHB1Ymxpc2ggdXNlcnMgc3BhY2VzXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXG5cdFx0c2VsZiA9IHRoaXM7XG5cdFx0dXNlclNwYWNlcyA9IFtdXG5cdFx0c3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9LCB7ZmllbGRzOiB7c3BhY2U6MX19KVxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcblxuXHRcdGhhbmRsZTIgPSBudWxsXG5cblx0XHQjIG9ubHkgcmV0dXJuIHVzZXIgam9pbmVkIHNwYWNlcywgYW5kIG9ic2VydmVzIHdoZW4gdXNlciBqb2luIG9yIGxlYXZlIGEgc3BhY2Vcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRpZiBkb2Muc3BhY2Vcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXG5cdFx0XHRcdFx0XHRvYnNlcnZlU3BhY2VzKClcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcblxuXHRcdG9ic2VydmVTcGFjZXMgPSAtPlxuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcblx0XHRcdGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiB7JGluOiB1c2VyU3BhY2VzfX0pLm9ic2VydmVcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XG5cdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5faWQpXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xuXHRcdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xuXG5cdFx0c2VsZi5yZWFkeSgpO1xuXG5cdFx0c2VsZi5vblN0b3AgLT5cblx0XHRcdGhhbmRsZS5zdG9wKCk7XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ215X3NwYWNlcycsIGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlLCBoYW5kbGUyLCBvYnNlcnZlU3BhY2VzLCBzZWxmLCBzdXMsIHVzZXJTcGFjZXM7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICB1c2VyU3BhY2VzID0gW107XG4gIHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xuICBzdXMuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpO1xuICB9KTtcbiAgaGFuZGxlMiA9IG51bGw7XG4gIGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgaWYgKGRvYy5zcGFjZSkge1xuICAgICAgICBpZiAodXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwKSB7XG4gICAgICAgICAgdXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSk7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmVTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICBpZiAob2xkRG9jLnNwYWNlKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2Muc3BhY2UpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVTcGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdXNlclNwYWNlc1xuICAgICAgfVxuICAgIH0pLm9ic2VydmUoe1xuICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgICBzZWxmLmFkZGVkKFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goZG9jLl9pZCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2hhbmdlZChcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2MpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLl9pZCk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBvYnNlcnZlU3BhY2VzKCk7XG4gIHNlbGYucmVhZHkoKTtcbiAgcmV0dXJuIHNlbGYub25TdG9wKGZ1bmN0aW9uKCkge1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIHJldHVybiBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIjIHB1Ymxpc2ggc29tZSBvbmUgc3BhY2UncyBhdmF0YXJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxuXHR1bmxlc3Mgc3BhY2VJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcbiIsIk1ldGVvci5wdWJsaXNoKCdzcGFjZV9hdmF0YXInLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLnNwYWNlcy5maW5kKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgYXZhdGFyOiAxLFxuICAgICAgbmFtZTogMSxcbiAgICAgIGVuYWJsZV9yZWdpc3RlcjogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdtb2R1bGVzJywgKCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHVubGVzcyBfaWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4unRydWXooajnpLrpmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4fojIPlm7TvvIxvcmdhbml6YXRpb25z5YC86K6w5b2V6aKd5aSW55qE57uE57uH6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xuXHRcdGNoZWNrIHNwYWNlLCBTdHJpbmdcblx0XHRyZVZhbHVlID1cblx0XHRcdGlzTGltaXQ6IHRydWVcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXG5cdFx0bGltaXRzID0gc2V0dGluZz8udmFsdWVzIHx8IFtdO1xuXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxuXHRcdFx0bXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHVzZXJzOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdHVubGVzcyBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRcdFxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBbXVxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXG5cdFx0XHRcdHRvcyA9IGxpbWl0LnRvc1xuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxuXHRcdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0XHRpZiBmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XG5cdFx0XHRcdFx0XHRpc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcblxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHQjIOWmguaenOWPl+mZkOeahOe7hOe7h+S4quaVsOWwj+S6jueUqOaIt+aJgOWxnue7hOe7h+eahOS4quaVsO+8jOWImeivtOaYjuW9k+WJjeeUqOaIt+iHs+WwkeacieS4gOS4que7hOe7h+aYr+S4jeWPl+mZkOeahFxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRcdGVsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblxuXHRcdGlmIGlzTGltaXRcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ5bGe5LqO55So5oi35omA5bGe57uE57uH55qE5a2Q5a2Z6IqC54K555qE6IqC54K55Yig6ZmkXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSBhbmQgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDFcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXHRcdHJldHVybiByZVZhbHVlXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjaGVjayhrZXksIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xuXG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xuICAgICAgICBvYmoua2V5ID0ga2V5O1xuICAgICAgICBvYmoudmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xuICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KSIsIk1ldGVvci5tZXRob2RzXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuXG5cdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpIGFuZCB1c2VyX2lkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxuXG5cdFx0aWYgbm90IE1ldGVvci51c2VySWQoKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXG5cblx0XHR1bmxlc3MgdXNlcl9pZFxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcblxuXHRcdHJldHVybiB1c2VybmFtZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXG5cblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXG5cblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xuXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXG5cbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXG5cbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSwgc3luY19kaXJlY3Rpb246IDEgfSB9KS5mZXRjaCgpXG4gICAgICAgIF8uZWFjaCBvd3MsKG8pIC0+XG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKHtfaWQ6IG8uZmxvd19pZCwgc3RhdGU6ICdlbmFibGVkJ30sIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxLCBmb3JiaWRfaW5pdGlhdGVfaW5zdGFuY2U6IDEgfSB9KVxuICAgICAgICAgICAgaWYgZmxcbiAgICAgICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcbiAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIG8uZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlID0gZmwuZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlXG5cbiAgICAgICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXG4gICAgICAgICAgICAgICAgaWYgcGVybXNcbiAgICAgICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG5cbiAgICAgICAgb3dzID0gb3dzLmZpbHRlciAobiktPlxuICAgICAgICAgICAgcmV0dXJuIG4uZmxvd19uYW1lXG5cbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgIHN5bmNfZGlyZWN0aW9uOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZSh7XG4gICAgICAgIF9pZDogby5mbG93X2lkLFxuICAgICAgICBzdGF0ZTogJ2VuYWJsZWQnXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDEsXG4gICAgICAgICAgZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGZsKSB7XG4gICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICAgIG8uZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlID0gZmwuZm9yYmlkX2luaXRpYXRlX2luc3RhbmNlO1xuICAgICAgICBwZXJtcyA9IGZsLnBlcm1zO1xuICAgICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSBfLnNvbWUob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG93cyA9IG93cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uZmxvd19uYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBvd3M7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0U3BhY2VVc2VyUGFzc3dvcmQ6IChzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIC0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIilcblx0XHRcblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT0gdXNlcklkXG5cdFx0dW5sZXNzIGNhbkVkaXRcblx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxuXHRcdFx0aXNTcGFjZUFkbWluID0gc3BhY2U/LmFkbWlucz8uaW5jbHVkZXModGhpcy51c2VySWQpXG5cdFx0XHRjYW5FZGl0ID0gaXNTcGFjZUFkbWluXG5cblx0XHRjb21wYW55SWRzID0gc3BhY2VVc2VyLmNvbXBhbnlfaWRzXG5cdFx0aWYgIWNhbkVkaXQgJiYgY29tcGFueUlkcyAmJiBjb21wYW55SWRzLmxlbmd0aFxuXHRcdFx0IyDnu4Tnu4fnrqHnkIblkZjkuZ/og73kv67mlLnlr4bnoIFcblx0XHRcdGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtfaWQ6IHsgJGluOiBjb21wYW55SWRzIH0sIHNwYWNlOiBzcGFjZV9pZCB9LCB7ZmllbGRzOiB7IGFkbWluczogMSB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgY29tcGFueXMgYW5kIGNvbXBhbnlzLmxlbmd0aFxuXHRcdFx0XHRjYW5FZGl0ID0gXy5hbnkgY29tcGFueXMsIChpdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpdGVtLmFkbWlucyAmJiBpdGVtLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPiAtMVxuXG5cdFx0dW5sZXNzIGNhbkVkaXRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKVxuXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXG5cblx0XHQjIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZClcblx0XHRsb2dvdXQgPSB0cnVlO1xuXHRcdGlmIHRoaXMudXNlcklkID09IHVzZXJfaWRcblx0XHRcdGxvZ291dCA9IGZhbHNlXG5cdFx0XG5cdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwge1xuXHRcdFx0YWxnb3JpdGhtOiAnc2hhLTI1NicsXG5cdFx0XHRkaWdlc3Q6IHBhc3N3b3JkXG5cdFx0fSwge2xvZ291dDogbG9nb3V0fSlcblx0XHRjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxuXHRcdGlmIGNoYW5nZWRVc2VySW5mb1xuXHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHB1c2g6IHsnc2VydmljZXMucGFzc3dvcmRfaGlzdG9yeSc6IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdH19KVxuXG5cdFx0IyDlpoLmnpznlKjmiLfmiYvmnLrlj7fpgJrov4fpqozor4HvvIzlsLHlj5Hnn63kv6Hmj5DphpJcblx0XHRpZiB1c2VyQ1AubW9iaWxlICYmIHVzZXJDUC5tb2JpbGVfdmVyaWZpZWRcblx0XHRcdGxhbmcgPSAnZW4nXG5cdFx0XHRpZiB1c2VyQ1AubG9jYWxlIGlzICd6aC1jbidcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcblx0XHRcdFNNU1F1ZXVlLnNlbmRcblx0XHRcdFx0Rm9ybWF0OiAnSlNPTicsXG5cdFx0XHRcdEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuXHRcdFx0XHRQYXJhbVN0cmluZzogJycsXG5cdFx0XHRcdFJlY051bTogdXNlckNQLm1vYmlsZSxcblx0XHRcdFx0U2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuXHRcdFx0XHRUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuXHRcdFx0XHRtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcblxuXHRcdHRyeVxuXHRcdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9wZXJhdGlvbl9sb2dzXCIpLmluc2VydCh7XG5cdFx0XHRcdG5hbWU6IFwi5L+u5pS55a+G56CBXCIsXG5cdFx0XHRcdHR5cGU6IFwiY2hhbmdlX3Bhc3N3b3JkXCIsXG5cdFx0XHRcdHJlbW90ZV91c2VyOiB1c2VySWQsXG5cdFx0XHRcdHN0YXR1czogJ3N1Y2Nlc3MnLFxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdG1lc3NhZ2U6IFwiW+ezu+e7n+euoeeQhuWRmF3kv67mlLnkuobnlKjmiLdbXCIgKyBjaGFuZ2VkVXNlckluZm8/Lm5hbWUgKyBcIl3nmoTlr4bnoIFcIixcblx0XHRcdFx0ZGF0YTogSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdGNoYW5nZVVzZXI6IHVzZXJfaWRcblx0XHRcdFx0fSksXG5cdFx0XHRcdHJlbGF0ZWRfdG86IHtcblx0XHRcdFx0XHRvOiBcInVzZXJzXCIsXG5cdFx0XHRcdFx0aWRzOiBbdXNlcl9pZF1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0Y29uc29sZS5lcnJvciBlXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjYW5FZGl0LCBjaGFuZ2VkVXNlckluZm8sIGNvbXBhbnlJZHMsIGNvbXBhbnlzLCBjdXJyZW50VXNlciwgZSwgaXNTcGFjZUFkbWluLCBsYW5nLCBsb2dvdXQsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VySWQsIHVzZXJfaWQ7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGNhbkVkaXQgPSBzcGFjZVVzZXIudXNlciA9PT0gdXNlcklkO1xuICAgIGlmICghY2FuRWRpdCkge1xuICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogc3BhY2VfaWRcbiAgICAgIH0pO1xuICAgICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgY2FuRWRpdCA9IGlzU3BhY2VBZG1pbjtcbiAgICB9XG4gICAgY29tcGFueUlkcyA9IHNwYWNlVXNlci5jb21wYW55X2lkcztcbiAgICBpZiAoIWNhbkVkaXQgJiYgY29tcGFueUlkcyAmJiBjb21wYW55SWRzLmxlbmd0aCkge1xuICAgICAgY29tcGFueXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjb21wYW55XCIpLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IGNvbXBhbnlJZHNcbiAgICAgICAgfSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGFkbWluczogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgaWYgKGNvbXBhbnlzICYmIGNvbXBhbnlzLmxlbmd0aCkge1xuICAgICAgICBjYW5FZGl0ID0gXy5hbnkoY29tcGFueXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5hZG1pbnMgJiYgaXRlbS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID4gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKTtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgbG9nb3V0ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy51c2VySWQgPT09IHVzZXJfaWQpIHtcbiAgICAgIGxvZ291dCA9IGZhbHNlO1xuICAgIH1cbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCB7XG4gICAgICBhbGdvcml0aG06ICdzaGEtMjU2JyxcbiAgICAgIGRpZ2VzdDogcGFzc3dvcmRcbiAgICB9LCB7XG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH0pO1xuICAgIGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgaWYgKGNoYW5nZWRVc2VySW5mbykge1xuICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB1c2VyX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgJ3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiAocmVmMSA9IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjIuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgU01TUXVldWUuc2VuZCh7XG4gICAgICAgIEZvcm1hdDogJ0pTT04nLFxuICAgICAgICBBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcbiAgICAgICAgUGFyYW1TdHJpbmc6ICcnLFxuICAgICAgICBSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG4gICAgICAgIFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcbiAgICAgICAgVGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcbiAgICAgICAgbXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG4gICAgICB9KTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcGVyYXRpb25fbG9nc1wiKS5pbnNlcnQoe1xuICAgICAgICBuYW1lOiBcIuS/ruaUueWvhueggVwiLFxuICAgICAgICB0eXBlOiBcImNoYW5nZV9wYXNzd29yZFwiLFxuICAgICAgICByZW1vdGVfdXNlcjogdXNlcklkLFxuICAgICAgICBzdGF0dXM6ICdzdWNjZXNzJyxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICBtZXNzYWdlOiBcIlvns7vnu5/nrqHnkIblkZhd5L+u5pS55LqG55So5oi3W1wiICsgKGNoYW5nZWRVc2VySW5mbyAhPSBudWxsID8gY2hhbmdlZFVzZXJJbmZvLm5hbWUgOiB2b2lkIDApICsgXCJd55qE5a+G56CBXCIsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjaGFuZ2VVc2VyOiB1c2VyX2lkXG4gICAgICAgIH0pLFxuICAgICAgICByZWxhdGVkX3RvOiB7XG4gICAgICAgICAgbzogXCJ1c2Vyc1wiLFxuICAgICAgICAgIGlkczogW3VzZXJfaWRdXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlID0gZXJyb3I7XG4gICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlKTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYmlsbGluZ01hbmFnZXIgPSB7fVxuXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxuIyBzcGFjZV9pZCDnu5Pnrpflr7nosaHlt6XkvZzljLpcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRjb3VudF9kYXlzID0gMFxuXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcblx0Zmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlXG5cblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0c3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMS1lbmRfZGF0ZV90aW1lLmdldERhdGUoKSlcblxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXG5cdFx0IyBkbyBub3RoaW5nXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblx0ZWxzZSBpZiBmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXG5cdHJldHVybiB7XCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXN9XG5cbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSAoc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSktPlxuXHRsYXN0X2JpbGwgPSBudWxsXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXG5cblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRjcmVhdGVkOiB7XG5cdFx0XHRcdCRsdDogcmVmcmVzaF9kYXRlXG5cdFx0XHR9LFxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRpZiBwYXltZW50X2JpbGxcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcblx0ZWxzZVxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRcdGlmIGFwcF9iaWxsXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxuXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdGRlYml0cyA9IGlmIGJpbGwuZGViaXRzIHRoZW4gYmlsbC5kZWJpdHMgZWxzZSAwLjBcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XG5cdHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXG5cbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxuXHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xuXHRcdFx0XHQkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRuZXdfYmlsbCA9IG5ldyBPYmplY3Rcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXG5cdG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXG5cdG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZVxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcblx0bmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XG5cdGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XG5cdGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0cmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheVxuXHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdHtcblx0XHRcdGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxuXHRcdH1cblx0KS5mb3JFYWNoIChiaWxsKS0+XG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcblxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdG1vZHVsZXMgPSBuZXcgQXJyYXlcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XG5cdFx0bV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRtb2R1bGU6IG0ubmFtZSxcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRjcmVhdGVkOiAtMVxuXHRcdFx0fVxuXHRcdClcblx0XHQjIOiLpeacquiOt+W+l+WPr+WMuemFjeeahOiusOW9le+8jOivtOaYjuivpW1vZHVsZeacquWuieijhe+8jOW9k+aciOS4jeiuoeeul+i0ueeUqFxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xuXHRcdFx0IyAgZG8gbm90aGluZ1xuXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblxuXHRyZXR1cm4gbW9kdWxlc1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCgobSktPlxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcblx0KVxuXHRyZXR1cm4gbW9kdWxlc19uYW1lXG5cblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0cmV0dXJuXG5cdGlmIGFjY291bnRpbmdfbW9udGggPT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGRlYml0cyA9IDBcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0XHR7XG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCkuZm9yRWFjaCgoYiktPlxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXG5cdFx0KVxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxuXHRcdHJlbWFpbmluZ19tb250aHMgPSAwXG5cdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdGlmIGRlYml0cyA+IDBcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UvZGViaXRzKSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IDFcblxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcblx0XHRcdFx0XHRcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdGVsc2Vcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcblx0XHRwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGVsc2Vcblx0XHRcdHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZClcblxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcblx0XHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0ZGIuYmlsbGluZ3MucmVtb3ZlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdFx0IyDnu5PnrpflvZPmnIjnmoRBUFDkvb/nlKjlkI7kvZnpop1cblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXG5cdFx0XHRcdF8uZWFjaCBtb2R1bGVzLCAobSktPlxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcblxuXHRcdGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSAoc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblxuXHRtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXlcblxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXG5cblx0bSA9IG1vbWVudCgpXG5cdG5vdyA9IG0uX2RcblxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxuXG5cdCMg5pu05pawc3BhY2XmmK/lkKbkuJPkuJrniYjnmoTmoIforrBcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGVcblxuXHQjIOabtOaWsG1vZHVsZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXG5cdHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSlcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXG5cdHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzcGFjZV9pZH0sIHskc2V0OiBzcGFjZV91cGRhdGVfb2JqfSlcblx0aWYgclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxuXHRcdFx0bWNsID0gbmV3IE9iamVjdFxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXG5cdFx0XHRtY2wubW9kdWxlID0gbW9kdWxlXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXG5cblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblxuICBpZiAoTWV0ZW9yLnNldHRpbmdzLmNyb24gJiYgTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcykge1xuXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xuICAgIC8vIOWumuaXtuaJp+ihjOe7n+iuoVxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcblxuICAgIHZhciBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFnb19uZXh0KVxuICAgICAgICByZXR1cm47XG4gICAgICBnb19uZXh0ID0gZmFsc2U7XG5cbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XG4gICAgICB9O1xuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZE5vdyA9IG5ldyBEYXRlKCk7ICAgLy/lvZPliY3ml7bpl7RcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XG4gICAgICB9O1xuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjpzcGFjZVtcIl9pZFwiXSxcImNyZWF0ZWRcIjp7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6LmgLvmlbBcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcbiAgICAgIHZhciBvd25lck5hbWUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXG4gICAgICB2YXIgbGFzdExvZ29uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcbiAgICAgICAgc1VzZXJzLmZvckVhY2goZnVuY3Rpb24gKHNVc2VyKSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XG4gICAgICAgICAgICBsYXN0TG9nb24gPSB1c2VyLmxhc3RfbG9nb247XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbGFzdExvZ29uO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xuICAgICAgdmFyIGxhc3RNb2RpZmllZCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XG4gICAgICAgIGlmKG9iakFyci5sZW5ndGggPiAwKVxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XG4gICAgICAgICAgcmV0dXJuIG1vZDtcbiAgICAgIH07XG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pICBcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5b2T5pel5paw5aKe6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOiBwb3N0W1wiX2lkXCJdLCBcInVwbG9hZGVkQXRcIjogeyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDmj5LlhaXmlbDmja5cbiAgICAgIGRiLnNwYWNlcy5maW5kKHtcImlzX3BhaWRcIjp0cnVlfSkuZm9yRWFjaChmdW5jdGlvbiAoc3BhY2UpIHtcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxuICAgICAgICAgIHNwYWNlX25hbWU6IHNwYWNlW1wibmFtZVwiXSxcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBzdGVlZG9zOntcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHN0YXRpY3NDb3VudChkYi5vcmdhbml6YXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgd29ya2Zsb3c6e1xuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19yb2xlczogc3RhdGljc0NvdW50KGRiLmZsb3dfcm9sZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9pbnN0YW5jZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjbXM6IHtcbiAgICAgICAgICAgIHNpdGVzOiBzdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogcG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xuXG4gICAgICBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IHN0YXRpc3RpY3MuanMnKTtcbiAgICAgIGNvbnNvbGUubG9nKGUuc3RhY2spO1xuICAgIH0pKTtcblxuICB9XG5cbn0pXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMVxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IChwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCktPlxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcbiAgICAgICAgICAgICAgICBpID0gMFxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpXG5cbiAgICAgICAgICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJykiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAxLFxuICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBpLCB1cGRhdGVfY2ZzX2luc3RhbmNlO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IGZ1bmN0aW9uKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRfaWQsXG4gICAgICAgICAgICBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZV9pZCxcbiAgICAgICAgICAgIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0N1cnJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICAgICBcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGlucykge1xuICAgICAgICAgIHZhciBhdHRhY2hzLCBpbnN0YW5jZV9pZCwgc3BhY2VfaWQ7XG4gICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50cztcbiAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZTtcbiAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWQ7XG4gICAgICAgICAgYXR0YWNocy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmVyLCBwYXJlbnRfaWQ7XG4gICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50O1xuICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldjtcbiAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChhdHQuaGlzdG9yeXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dC5oaXN0b3J5cy5mb3JFYWNoKGZ1bmN0aW9uKGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGkrKztcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAyXG4gICAgICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OSdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe29yZ2FuaXphdGlvbnM6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogM1xuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3UudXNlcn0sIHtmaWVsZHM6IHtlbWFpbHM6IDF9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiA0XG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7c29ydF9ubzogeyRleGlzdHM6IGZhbHNlfX0sIHskc2V0OiB7c29ydF9ubzogMTAwfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA1XG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdFx0dHJ5XG5cblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcblx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcblx0XHRcdFx0XHRcdFx0XHRyID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLCBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZH19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxuXHRcdFx0XHRcdGVsc2UgaWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KClcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXG5cdFx0XHRcdFx0XHRpZiByZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHN9fSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDZcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdFx0dHJ5XG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxuXHRcdFx0XHR9KVxuXG5cblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2Vcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuICAgIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKVxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMgPSB7XG4gICAgICAgICAgICBcImNyZWF0b3JcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XG4gICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByb290VVJMO1xuICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzID0ge1xuICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvcikge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTDtcbiAgfVxufSk7XG4iLCJpZihwcm9jZXNzLmVudi5DUkVBVE9SX05PREVfRU5WID09ICdkZXZlbG9wbWVudCcpe1xuXHQvL01ldGVvciDniYjmnKzljYfnuqfliLAxLjkg5Y+K5Lul5LiK5pe2KG5vZGUg54mI5pysIDExKynvvIzlj6/ku6XliKDpmaTmraTku6PnoIFcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZsYXQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGRlcHRoID0gMSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uIChmbGF0LCB0b0ZsYXR0ZW4pIHtcblx0XHRcdFx0cmV0dXJuIGZsYXQuY29uY2F0KChBcnJheS5pc0FycmF5KHRvRmxhdHRlbikgJiYgKGRlcHRoPjEpKSA/IHRvRmxhdHRlbi5mbGF0KGRlcHRoLTEpIDogdG9GbGF0dGVuKTtcblx0XHRcdH0sIFtdKTtcblx0XHR9XG5cdH0pO1xufSIsIk1ldGVvci5zdGFydHVwICgpLT5cblx0bmV3IFRhYnVsYXIuVGFibGVcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG5cdFx0Y29sbGVjdGlvbjogZGIuYXBwcyxcblx0XHRjb2x1bW5zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2Vcblx0XHRcdH1cblx0XHRdXG5cdFx0ZG9tOiBcInRwXCJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlXG5cdFx0b3JkZXJpbmc6IGZhbHNlXG5cdFx0cGFnZUxlbmd0aDogMTBcblx0XHRpbmZvOiBmYWxzZVxuXHRcdHNlYXJjaGluZzogdHJ1ZVxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cblx0XHRcdHVubGVzcyB1c2VySWRcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuICAgIGNvbGxlY3Rpb246IGRiLmFwcHMsXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdLFxuICAgIGxlbmd0aENoYW5nZTogZmFsc2UsXG4gICAgb3JkZXJpbmc6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwLFxuICAgIGluZm86IGZhbHNlLFxuICAgIHNlYXJjaGluZzogdHJ1ZSxcbiAgICBhdXRvV2lkdGg6IHRydWUsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
