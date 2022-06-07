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
var Theme = Package['steedos:theme'].Theme;
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
  cookies: "^0.6.2",
  "xml2js": "^0.4.19",
  mkdirp: "^0.3.5",
  "url-search-params-polyfill": "^7.0.0"
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

  Steedos.applyAccountZoomValue = function (accountZoomValue, isNeedToLocal) {
    var zoomName, zoomSize;

    if (Meteor.loggingIn() || !Steedos.userId()) {
      accountZoomValue = {};
      accountZoomValue.name = localStorage.getItem("accountZoomValue.name");
      accountZoomValue.size = localStorage.getItem("accountZoomValue.size");
    }

    $("body").removeClass("zoom-normal").removeClass("zoom-large").removeClass("zoom-extra-large");
    zoomName = accountZoomValue.name;
    zoomSize = accountZoomValue.size;

    if (!zoomName) {
      zoomName = "large";
      zoomSize = 1.2;
    }

    if (zoomName && !Session.get("instancePrint")) {
      $("body").addClass("zoom-" + zoomName);
    }

    if (isNeedToLocal) {
      if (Meteor.loggingIn()) {
        return;
      }

      if (Steedos.userId()) {
        if (accountZoomValue.name) {
          localStorage.setItem("accountZoomValue.name", accountZoomValue.name);
          return localStorage.setItem("accountZoomValue.size", accountZoomValue.size);
        } else {
          localStorage.removeItem("accountZoomValue.name");
          return localStorage.removeItem("accountZoomValue.size");
        }
      }
    }
  };

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
      space: spaceId,
      $or: [{
        sync_direction: {
          $exists: false
        }
      }, {
        sync_direction: {
          $in: ['both', 'obj_to_ins']
        }
      }]
    }, {
      fields: {
        object_name: 1,
        flow_id: 1,
        space: 1
      }
    }).fetch();

    _.each(ows, function (o) {
      var fl, perms;
      fl = Creator.getCollection('flows').findOne(o.flow_id, {
        fields: {
          name: 1,
          perms: 1
        }
      });

      if (fl) {
        o.flow_name = fl.name;
        o.can_add = false;
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
    var canEdit, changedUserInfo, companyIds, companys, currentUser, isSpaceAdmin, lang, logout, ref, ref1, ref2, space, spaceUser, userCP, userId, user_id;

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

      return SMSQueue.send({
        Format: 'JSON',
        Action: 'SingleSendSms',
        ParamString: '',
        RecNum: userCP.mobile,
        SignName: '华炎办公',
        TemplateCode: 'SMS_67200967',
        msg: TAPi18n.__('sms.change_password.template', {}, lang)
      });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImNvb2tpZXMiLCJta2RpcnAiLCJBcnJheSIsInByb3RvdHlwZSIsInNvcnRCeU5hbWUiLCJsb2NhbGUiLCJTdGVlZG9zIiwic29ydCIsInAxIiwicDIiLCJwMV9zb3J0X25vIiwic29ydF9ubyIsInAyX3NvcnRfbm8iLCJuYW1lIiwibG9jYWxlQ29tcGFyZSIsImdldFByb3BlcnR5IiwiayIsImZvckVhY2giLCJ0IiwibSIsInB1c2giLCJyZW1vdmUiLCJmcm9tIiwidG8iLCJyZXN0Iiwic2xpY2UiLCJsZW5ndGgiLCJhcHBseSIsImZpbHRlclByb3BlcnR5IiwiaCIsImwiLCJnIiwiZCIsImluY2x1ZGVzIiwiT2JqZWN0IiwidW5kZWZpbmVkIiwiZmluZFByb3BlcnR5QnlQSyIsInIiLCJDb29raWVzIiwiY3J5cHRvIiwibWl4aW4iLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwicm9vdFVybCIsInNldHRpbmdzIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJNZXRlb3IiLCJwaG9uZSIsIm51bWJlclRvU3RyaW5nIiwibnVtYmVyIiwic2NhbGUiLCJub3RUaG91c2FuZHMiLCJyZWciLCJ0b1N0cmluZyIsIk51bWJlciIsInRvRml4ZWQiLCJtYXRjaCIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsIlJlZ0V4cCIsInRlc3QiLCJpc0NvcmRvdmEiLCJpc0NsaWVudCIsImFic29sdXRlVXJsIiwiZGVmYXVsdE9wdGlvbnMiLCJlbmRzV2l0aCIsInN1YnN0ciIsIndpbmRvdyIsInN0b3JlcyIsIkFQSSIsImNsaWVudCIsInNldFVybCIsIlNldHRpbmdzIiwic2V0Um9vdFVybCIsInN0YXJ0dXAiLCJyZWY1IiwicmVmNiIsInJlZjciLCJyZWY4Iiwic2V0SHJlZlBvcHVwIiwidWkiLCJocmVmX3BvcHVwIiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0V4cHJlc3Npb24iLCJmdW5jIiwicGF0dGVybiIsInJlZzEiLCJyZWcyIiwicGFyc2VTaW5nbGVFeHByZXNzaW9uIiwiZm9ybURhdGEiLCJkYXRhUGF0aCIsImdsb2JhbCIsImVycm9yIiwiZnVuY0JvZHkiLCJnZXRQYXJlbnRQYXRoIiwiZ2V0VmFsdWVCeVBhdGgiLCJnbG9iYWxUYWciLCJwYXJlbnQiLCJwYXJlbnRQYXRoIiwicGF0aCIsInBhdGhBcnIiLCJzcGxpdCIsInBvcCIsImpvaW4iLCJfIiwiZ2V0IiwiY29uc29sZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJGdW5jdGlvbiIsImVycm9yMSIsImxvZyIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsInVybCIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsIiQiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwic3Rkb3V0Iiwic3RkZXJyIiwidG9hc3RyIiwib3BlbkFwcCIsImUiLCJldmFsRnVuU3RyaW5nIiwib25fY2xpY2siLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImNzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlc3VsdCIsInVzZXJuYW1lIiwicXVlcnkiLCJ1c2VycyIsInN0ZWVkb3NfaWQiLCJfY2hlY2tQYXNzd29yZCIsIkVycm9yIiwiY2hlY2tBdXRoVG9rZW4iLCJoZWFkZXJzIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJhcmdzIiwiX3dyYXBwZWQiLCJhcmd1bWVudHMiLCJjYWxsIiwiaXNIb2xpZGF5IiwiZGF0ZSIsImRheSIsImdldERheSIsImNhY3VsYXRlV29ya2luZ1RpbWUiLCJkYXlzIiwiY2FjdWxhdGVEYXRlIiwicGFyYW1fZGF0ZSIsImdldFRpbWUiLCJjYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSIsIm5leHQiLCJjYWN1bGF0ZWRfZGF0ZSIsImZpcnN0X2RhdGUiLCJqIiwibWF4X2luZGV4Iiwic2Vjb25kX2RhdGUiLCJzdGFydF9kYXRlIiwidGltZV9wb2ludHMiLCJyZW1pbmQiLCJpc0VtcHR5Iiwic2V0SG91cnMiLCJob3VyIiwic2V0TWludXRlcyIsIm1pbnV0ZSIsImV4dGVuZCIsImdldFN0ZWVkb3NUb2tlbiIsImFwcElkIiwibm93Iiwic2VjcmV0Iiwic3RlZWRvc190b2tlbiIsInBhcnNlSW50IiwiaXNJMThuIiwiY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eSIsIiRyZWdleCIsIl9lc2NhcGVSZWdFeHAiLCJ0cmltIiwidmFsaWRhdGVQYXNzd29yZCIsInB3ZCIsInBhc3N3b3JQb2xpY3kiLCJwYXNzd29yUG9saWN5RXJyb3IiLCJyZWFzb24iLCJyZWYxMCIsInJlZjkiLCJ2YWxpZCIsInBvbGljeSIsInBvbGljeUVycm9yIiwicG9saWN5ZXJyb3IiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0REJEYXNoYm9hcmRzIiwiZGJEYXNoYm9hcmRzIiwiZGFzaGJvYXJkIiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZvcmVpZ25fa2V5IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJyZWZlcmVuY2VzIiwibWV0aG9kcyIsInVwZGF0ZVVzZXJMYXN0TG9nb24iLCIkc2V0IiwibGFzdF9sb2dvbiIsIm9uTG9naW4iLCJ1c2Vyc19hZGRfZW1haWwiLCJlbWFpbCIsImNvdW50IiwiZW1haWxzIiwiZGlyZWN0IiwiJHB1c2giLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJ1c2Vyc19yZW1vdmVfZW1haWwiLCJwIiwiJHB1bGwiLCJ1c2Vyc192ZXJpZnlfZW1haWwiLCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbCIsInByaW1hcnkiLCJtdWx0aSIsInNob3dDYW5jZWxCdXR0b24iLCJjbG9zZU9uQ29uZmlybSIsImFuaW1hdGlvbiIsImlucHV0VmFsdWUiLCJ1cGRhdGVVc2VyQXZhdGFyIiwiZW1haWxUZW1wbGF0ZXMiLCJkZWZhdWx0RnJvbSIsInJlc2V0UGFzc3dvcmQiLCJzdWJqZWN0Iiwic3BsaXRzIiwidG9rZW5Db2RlIiwiZ3JlZXRpbmciLCJwcm9maWxlIiwidG9rZW5fY29kZSIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZCIsIm9yZ3MiLCJmdWxsbmFtZSIsIiRuZSIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwicmV0IiwibXNnIiwiUHVzaCIsIkNvbmZpZ3VyZSIsInNlbmRlcklEIiwiQU5EUk9JRF9TRU5ERVJfSUQiLCJzb3VuZCIsInZpYnJhdGUiLCJpb3MiLCJiYWRnZSIsImNsZWFyQmFkZ2UiLCJhbGVydCIsImFwcE5hbWUiLCJTZWxlY3RvciIsInNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluIiwic2VsZWN0b3IiLCJpc19jbG91ZGFkbWluIiwibWFwIiwibiIsInNlbGVjdG9yQ2hlY2tTcGFjZSIsInUiLCJiaWxsaW5nX3BheV9yZWNvcmRzIiwiYWRtaW5Db25maWciLCJpY29uIiwiY29sb3IiLCJ0YWJsZUNvbHVtbnMiLCJleHRyYUZpZWxkcyIsInJvdXRlckFkbWluIiwicGFpZCIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsImRpc2FibGVBZGQiLCJwYWdlTGVuZ3RoIiwib3JkZXIiLCJzcGFjZV91c2VyX3NpZ25zIiwiQWRtaW5Db25maWciLCJjb2xsZWN0aW9uc19hZGQiLCJzZWFyY2hFbGVtZW50IiwiTyIsImN1cnJlbnRFbGVtZW50Iiwid2Vic2VydmljZXMiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwic3RlZWRvc0F1dGgiLCJhbGxvd19tb2RlbHMiLCJtb2RlbCIsIm9wdGlvbnMiLCJ1c2VyU2Vzc2lvbiIsIlN0cmluZyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZ2V0UmVsYXRpdmVVcmwiLCJhdmF0YXJVcmwiLCJmaWxlIiwid3JpdGUiLCJpdGVtIiwiY2hhckNvZGVBdCIsInRvVXBwZXJDYXNlIiwidG9VVENTdHJpbmciLCJyZWFkU3RyZWFtIiwicGlwZSIsInB1Ymxpc2giLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwic3luY19kaXJlY3Rpb24iLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsInNldFNwYWNlVXNlclBhc3N3b3JkIiwic3BhY2VfdXNlcl9pZCIsImNhbkVkaXQiLCJjaGFuZ2VkVXNlckluZm8iLCJjb21wYW55SWRzIiwiY29tcGFueXMiLCJjdXJyZW50VXNlciIsImxhbmciLCJsb2dvdXQiLCJ1c2VyQ1AiLCJjb21wYW55X2lkcyIsImFueSIsInNldFBhc3N3b3JkIiwiYWxnb3JpdGhtIiwiZGlnZXN0Iiwic2VydmljZXMiLCJiY3J5cHQiLCJtb2JpbGVfdmVyaWZpZWQiLCJTTVNRdWV1ZSIsInNlbmQiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIlJlY051bSIsIlNpZ25OYW1lIiwiVGVtcGxhdGVDb2RlIiwiYmlsbGluZ01hbmFnZXIiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJhY2NvdW50aW5nX21vbnRoIiwiYmlsbGluZyIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwibW9tZW50IiwiZm9ybWF0IiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwidXNlcl9jb3VudCIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsInNwZWNpYWxfcGF5IiwibW9kdWxlX25hbWVzIiwidG90YWxfZmVlIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJpc19wYWlkIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJ0aW1lIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsImRhaWx5UG9zdHNBdHRhY2htZW50cyIsInN0ZWVkb3Nfc3RhdGlzdGljcyIsInNwYWNlX25hbWUiLCJvd25lcl9uYW1lIiwic3RlZWRvcyIsIndvcmtmbG93IiwiZmxvd3MiLCJmb3JtcyIsImZsb3dfcm9sZXMiLCJmbG93X3Bvc2l0aW9ucyIsImluc3RhbmNlcyIsImluc3RhbmNlc19sYXN0X21vZGlmaWVkIiwiZGFpbHlfZmxvd3MiLCJkYWlseV9mb3JtcyIsImRhaWx5X2luc3RhbmNlcyIsImNtcyIsInNpdGVzIiwiY21zX3NpdGVzIiwiY21zX3Bvc3RzIiwicG9zdHNfbGFzdF9tb2RpZmllZCIsInBvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJjb21tZW50cyIsImNtc19jb21tZW50cyIsImRhaWx5X3NpdGVzIiwiZGFpbHlfcG9zdHMiLCJkYWlseV9jb21tZW50cyIsImRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJ0aW1lRW5kIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJzIiwibGlzdHByaWNlcyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwicm9vdFVSTCIsImNyZWF0b3IiLCJwcm9jZXNzIiwiZW52IiwiQ1JFQVRPUl9OT0RFX0VOViIsImRlZmluZVByb3BlcnR5IiwiZGVwdGgiLCJyZWR1Y2UiLCJmbGF0IiwidG9GbGF0dGVuIiwiaXNBcnJheSIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsImluZm8iLCJzZWFyY2hpbmciLCJhdXRvV2lkdGgiLCJjaGFuZ2VTZWxlY3RvciIsIiRhbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEIsbUJBQWlCLFFBREQ7QUFFaEJJLFNBQU8sRUFBRSxRQUZPO0FBR2hCLFlBQVUsU0FITTtBQUloQkMsUUFBTSxFQUFFLFFBSlE7QUFLaEIsZ0NBQThCO0FBTGQsQ0FBRCxFQU1iLGNBTmEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNIQUMsS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxVQUFoQixHQUE2QixVQUFVQyxNQUFWLEVBQWtCO0FBQzNDLE1BQUksQ0FBQyxJQUFMLEVBQVc7QUFDUDtBQUNIOztBQUNELE1BQUcsQ0FBQ0EsTUFBSixFQUFXO0FB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QW5CLElBQTRCLENBQTVCO0FBQ0N3TCxrQkFBUTZRLFNBQVNzWCxJQUFULENBQWN0MEIsV0FBZCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFSO0FBRkY7QUNRSTs7QURMSixXQUFPbU0sS0FBUDtBQUNDLGVBQU87QUFBQ1QsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ1NHOztBRFJKLGFBQU9zUixRQUFQO0FBekJEO0FBQUEsR0FERCxDQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcblx0Y29va2llczogXCJeMC42LjJcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG5cdG1rZGlycDogXCJeMC4zLjVcIixcblx0XCJ1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFwiOiBcIl43LjAuMFwiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgaWYgKCF0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWxvY2FsZSl7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcbiAgICB9XG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXG4gICAgICAgIH1lbHNle1xuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xuXHRcdH1cbiAgICB9KTtcbn07XG5cblxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcbiAgICAgICAgdi5wdXNoKG0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2O1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcbiAqL1xuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgZyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgZy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxuICovXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIHIgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICByID0gdDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByO1xufSIsIlN0ZWVkb3MgPVxuXHRzZXR0aW5nczoge31cblx0ZGI6IGRiXG5cdHN1YnM6IHt9XG5cdGlzUGhvbmVFbmFibGVkOiAtPlxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcyktPlxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcblxuXHRcdGlmICFudW1iZXJcblx0XHRcdHJldHVybiAnJztcblxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXG5cdFx0XHRpZiBzY2FsZSB8fCBzY2FsZSA9PSAwXG5cdFx0XHRcdG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpXG5cdFx0XHR1bmxlc3Mgbm90VGhvdXNhbmRzXG5cdFx0XHRcdGlmICEoc2NhbGUgfHwgc2NhbGUgPT0gMClcblx0XHRcdFx0XHQjIOayoeWumuS5iXNjYWxl5pe277yM5qC55o2u5bCP5pWw54K55L2N572u566X5Ye6c2NhbGXlgLxcblx0XHRcdFx0XHRzY2FsZSA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLyk/WzFdPy5sZW5ndGhcblx0XHRcdFx0XHR1bmxlc3Mgc2NhbGVcblx0XHRcdFx0XHRcdHNjYWxlID0gMFxuXHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2dcblx0XHRcdFx0aWYgc2NhbGUgPT0gMFxuXHRcdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZ1xuXHRcdFx0XHRudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKVxuXHRcdFx0cmV0dXJuIG51bWJlclxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcIlwiXG5cdHZhbGlKcXVlcnlTeW1ib2xzOiAoc3RyKS0+XG5cdFx0IyByZWcgPSAvXlteIVwiIyQlJicoKSorLC4vOjs8PT4/QFtcXF1eYHt8fX5dKyQvZ1xuXHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIilcblx0XHRyZXR1cm4gcmVnLnRlc3Qoc3RyKVxuXG4jIyNcbiMgS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4jIEBuYW1lc3BhY2UgU3RlZWRvc1xuIyMjXG4jIGlmIE1ldGVvci5pc0NvcmRvdmFcbmlmIE1ldGVvci5pc0NvcmRvdmEgfHwgTWV0ZW9yLmlzQ2xpZW50XG5cdHJvb3RVcmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwuZGVmYXVsdE9wdGlvbnMucm9vdFVybFxuXHRpZiByb290VXJsLmVuZHNXaXRoKCcvJylcblx0XHRyb290VXJsID0gcm9vdFVybC5zdWJzdHIoMCwgcm9vdFVybC5sZW5ndGggLSAxKVxuXG5cdHdpbmRvdy5zdG9yZXM/LkFQST8uY2xpZW50Py5zZXRVcmwocm9vdFVybClcblx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldFJvb3RVcmwocm9vdFVybClcblx0d2luZG93WydzdGVlZG9zLnNldHRpbmcnXSA9IHtcblx0XHRyb290VXJsOiByb290VXJsXG5cdH1cblxuaWYgIU1ldGVvci5pc0NvcmRvdmEgJiYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMg6YWN572u5piv5ZCm5paw56qX5Y+j5omT5byA55qE5YWo5bGA5Y+Y6YePXG5cdE1ldGVvci5zdGFydHVwICgpLT5cblx0XHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0SHJlZlBvcHVwKE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnVpPy5ocmVmX3BvcHVwKVxuXG4jIGlmIE1ldGVvci5pc0NsaWVudFxuXHQjIE1ldGVvci5hdXRvcnVuICgpLT5cblx0IyBcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRVc2VySWQoU3RlZWRvcy51c2VySWQoKSlcblx0IyBcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRUZW5hbnRJZChTdGVlZG9zLnNwYWNlSWQoKSlcblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuU3RlZWRvcy5pc0V4cHJlc3Npb24gPSAoZnVuYykgLT5cblx0aWYgdHlwZW9mIGZ1bmMgIT0gJ3N0cmluZydcblx0XHRyZXR1cm4gZmFsc2Vcblx0cGF0dGVybiA9IC9ee3soLispfX0kL1xuXHRyZWcxID0gL157eyhmdW5jdGlvbi4rKX19JC9cblx0cmVnMiA9IC9ee3soLis9Pi4rKX19JC9cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZycgYW5kIGZ1bmMubWF0Y2gocGF0dGVybikgYW5kICFmdW5jLm1hdGNoKHJlZzEpIGFuZCAhZnVuYy5tYXRjaChyZWcyKVxuXHRcdHJldHVybiB0cnVlXG5cdGZhbHNlXG5cblN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uID0gKGZ1bmMsIGZvcm1EYXRhLCBkYXRhUGF0aCwgZ2xvYmFsKSAtPlxuXHRnZXRQYXJlbnRQYXRoID0gKHBhdGgpIC0+XG5cdFx0aWYgdHlwZW9mIHBhdGggPT0gJ3N0cmluZydcblx0XHRcdHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJylcblx0XHRcdGlmIHBhdGhBcnIubGVuZ3RoID09IDFcblx0XHRcdFx0cmV0dXJuICcjJ1xuXHRcdFx0cGF0aEFyci5wb3AoKVxuXHRcdFx0cmV0dXJuIHBhdGhBcnIuam9pbignLicpXG5cdFx0cmV0dXJuICcjJ1xuXHRnZXRWYWx1ZUJ5UGF0aCA9IChmb3JtRGF0YSwgcGF0aCkgLT5cblx0XHRpZiBwYXRoID09ICcjJyBvciAhcGF0aFxuXHRcdFx0cmV0dXJuIGZvcm1EYXRhIG9yIHt9XG5cdFx0ZWxzZSBpZiB0eXBlb2YgcGF0aCA9PSAnc3RyaW5nJ1xuXHRcdFx0cmV0dXJuIF8uZ2V0KGZvcm1EYXRhLCBwYXRoKVxuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ3BhdGggaGFzIHRvIGJlIGEgc3RyaW5nJ1xuXHRcdHJldHVyblxuXHRpZiBmb3JtRGF0YSA9PSB1bmRlZmluZWRcblx0XHRmb3JtRGF0YSA9IHt9XG5cdHBhcmVudFBhdGggPSBnZXRQYXJlbnRQYXRoKGRhdGFQYXRoKVxuXHRwYXJlbnQgPSBnZXRWYWx1ZUJ5UGF0aChmb3JtRGF0YSwgcGFyZW50UGF0aCkgb3Ige31cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZydcblx0XHRmdW5jQm9keSA9IGZ1bmMuc3Vic3RyaW5nKDIsIGZ1bmMubGVuZ3RoIC0gMilcblx0XHRnbG9iYWxUYWcgPSAnX19HX0xfT19CX0FfTF9fJ1xuXHRcdHN0ciA9ICdcXG4gICAgcmV0dXJuICcgKyBmdW5jQm9keS5yZXBsYWNlKC9cXGJmb3JtRGF0YVxcYi9nLCBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIGdsb2JhbFRhZykpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBKU09OLnN0cmluZ2lmeShnbG9iYWwpKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiJyArIGdsb2JhbFRhZyArICdcXFxcYicsICdnJyksICdnbG9iYWwnKS5yZXBsYWNlKC9yb290VmFsdWUvZywgSlNPTi5zdHJpbmdpZnkocGFyZW50KSlcblx0XHR0cnlcblx0XHRcdHJldHVybiBGdW5jdGlvbihzdHIpKClcblx0XHRjYXRjaCBlcnJvclxuXHRcdFx0Y29uc29sZS5sb2cgZXJyb3IsIGZ1bmMsIGRhdGFQYXRoXG5cdFx0XHRyZXR1cm4gZnVuY1xuXHRlbHNlXG5cdFx0cmV0dXJuIGZ1bmNcblx0cmV0dXJuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXG5cdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gKCktPlxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXG5cdFx0aWYgYWNjb3VudEJnQm9keVxuXHRcdFx0cmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0YXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclxuXHRcdCMgaWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdCMgXHRpZiB1cmwgPT0gYXZhdGFyXG5cdFx0IyBcdFx0YXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcblx0XHQjIFx0ZWxzZVxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpfSlcIlxuXHRcdCMgZWxzZVxuXHRcdCMgXHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXG5cdFx0IyBcdGlmIGJhY2tncm91bmRcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHRiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cblx0XHRpZiBpc05lZWRUb0xvY2FsXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsYXZhdGFyKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxuXHRcdGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInNraW5cIn0pXG5cdFx0aWYgYWNjb3VudFNraW5cblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcblx0XHRpZiBhY2NvdW50Wm9vbVxuXHRcdFx0cmV0dXJuIGFjY291bnRab29tLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHRcdGFjY291bnRab29tVmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHRcdGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuXHRcdHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0em9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemVcblx0XHR1bmxlc3Mgem9vbU5hbWVcblx0XHRcdHpvb21OYW1lID0gXCJsYXJnZVwiXG5cdFx0XHR6b29tU2l6ZSA9IDEuMlxuXHRcdGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcblx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdFx0IyBpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXG5cdFx0XHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXG5cdFx0XHQjIFx0XHR6b29tU2l6ZSA9IDBcblx0XHRcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXG5cdFx0XHQjIGVsc2Vcblx0XHRcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHRpZiBpc05lZWRUb0xvY2FsXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRab29tVmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIixhY2NvdW50Wm9vbVZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cblx0U3RlZWRvcy5zaG93SGVscCA9ICh1cmwpLT5cblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcblxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5cdFx0d2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxuXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXG5cdFx0bGlua2VyID0gXCI/XCJcblxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxuXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIHVybFxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcblxuXHRTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXG5cblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblx0XHRpZiAhYXBwXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblx0XHQjIFx0cmV0dXJuXG5cblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xuXHRcdGlmIGFwcC5pc191c2VfaWVcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdGlmIG9uX2NsaWNrXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxuXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxuXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5Ncblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXG5cdFx0XHR0cnlcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRtaW5fbW9udGhzID0gMVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdG1pbl9tb250aHMgPSAzXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXG5cdFx0aWYgc3BhY2UgJiYgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcblxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHR3aGVuICdub3JtYWwnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcblx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcblxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcblxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcblx0XHRlbHNlXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XG5cdFx0aWYgb2Zmc2V0XG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxuXHRcdERFVklDRSA9XG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXG5cdFx0XHRpcGFkOiAnaXBhZCdcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcblx0XHRcdGlwb2Q6ICdpcG9kJ1xuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xuXHRcdGJyb3dzZXIgPSB7fVxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2Vcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xuXHRcdFx0Jydcblx0XHRcdERFVklDRS5kZXNrdG9wXG5cdFx0XVxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcblxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRyZXR1cm5cblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGlmclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXG5cdFx0XHRpZnIubG9hZCAtPlxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXG5cdFx0XHRcdGlmIGlmckJvZHlcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXG5cblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGNoZWNrID0gZmFsc2Vcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxuXHRcdFx0Y2hlY2sgPSB0cnVlXG5cdFx0cmV0dXJuIGNoZWNrXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHRpc09yZ0FkbWluID0gZmFsc2Vcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcblx0XHRwYXJlbnRzID0gW11cblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxuXHRcdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0aSA9IDBcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRpKytcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxuXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXG5cblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcblxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxuXG5cdFx0XHRpZiAhdXNlclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcblxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB1c2VyXG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdGlmIHVzZXJcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHR0cnlcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdGtleTMyID0gXCJcIlxuXHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0YyA9IFwiXCJcblx0XHRcdGkgPSAwXG5cdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0aSsrXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cblxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxuXG5cdFx0aWYgdXNlclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXG5cblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcblx0XHRcdGlmIG9ialxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXG5cdFx0cmV0dXJuIG51bGxcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxuXHRcdHRyeVxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxuXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cblxubWl4aW4gPSAob2JqKSAtPlxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxuXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cblx0XHRpZiAhZGF0ZVxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxuXHRcdFx0aWYgaSA8IGRheXNcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcblxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxuXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXG5cblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblxuXHRcdGogPSAwXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSAwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcblx0XHRcdFx0aiA9IGxlbi8yXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxuXHRcdFx0aSA9IDBcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxuXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXG5cdFx0XHRcdFx0YnJlYWtcblxuXHRcdFx0XHRpKytcblxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gaSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxuXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxuXG5cdFx0aWYgaiA+IG1heF9pbmRleFxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6Vcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxuXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcblx0XHRcdGlmIGFwcFxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdFx0XHRpID0gMFxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxuXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcblx0XHRcdGlmIGlzSTE4blxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdHJldHVybiBsb2NhbGVcblxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxuXG5cblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXG5cdFx0XHR2YWxpZCA9IHRydWVcblx0XHRcdHVubGVzcyBwd2Rcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXG5cdFx0XHRwYXNzd29yUG9saWN5ID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeVxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yIHx8IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3llcnJvciB8fCBcIuWvhueggeS4jeespuWQiOinhOWImVwiXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XG5cdFx0XHRcdGlmICEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXG4jXHRcdFx0ZWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRpZiB2YWxpZFxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XG5cdGRiQXBwcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChhcHApLT5cblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcblxuXHRyZXR1cm4gZGJBcHBzXG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gKHNwYWNlX2lkKS0+XG5cdGRiRGFzaGJvYXJkcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChkYXNoYm9hcmQpLT5cblx0XHRkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmRcblxuXHRyZXR1cm4gZGJEYXNoYm9hcmRzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxuI1x0XHRlbHNlXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByb290VXJsOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciByZWYsIHJlZjEsIHJlZztcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmIChzY2FsZSB8fCBzY2FsZSA9PT0gMCkge1xuICAgICAgICBudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90VGhvdXNhbmRzKSB7XG4gICAgICAgIGlmICghKHNjYWxlIHx8IHNjYWxlID09PSAwKSkge1xuICAgICAgICAgIHNjYWxlID0gKHJlZiA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLykpICE9IG51bGwgPyAocmVmMSA9IHJlZlsxXSkgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGlmICghc2NhbGUpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nO1xuICAgICAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2c7XG4gICAgICAgIH1cbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuaWYgKE1ldGVvci5pc0NvcmRvdmEgfHwgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIHJvb3RVcmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwuZGVmYXVsdE9wdGlvbnMucm9vdFVybDtcbiAgaWYgKHJvb3RVcmwuZW5kc1dpdGgoJy8nKSkge1xuICAgIHJvb3RVcmwgPSByb290VXJsLnN1YnN0cigwLCByb290VXJsLmxlbmd0aCAtIDEpO1xuICB9XG4gIGlmICgocmVmID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmMSA9IHJlZi5BUEkpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMiA9IHJlZjEuY2xpZW50KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjIuc2V0VXJsKHJvb3RVcmwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAoKHJlZjMgPSB3aW5kb3cuc3RvcmVzKSAhPSBudWxsKSB7XG4gICAgaWYgKChyZWY0ID0gcmVmMy5TZXR0aW5ncykgIT0gbnVsbCkge1xuICAgICAgcmVmNC5zZXRSb290VXJsKHJvb3RVcmwpO1xuICAgIH1cbiAgfVxuICB3aW5kb3dbJ3N0ZWVkb3Muc2V0dGluZyddID0ge1xuICAgIHJvb3RVcmw6IHJvb3RVcmxcbiAgfTtcbn1cblxuaWYgKCFNZXRlb3IuaXNDb3Jkb3ZhICYmIE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmNSwgcmVmNiwgcmVmNywgcmVmODtcbiAgICByZXR1cm4gKHJlZjUgPSB3aW5kb3cuc3RvcmVzKSAhPSBudWxsID8gKHJlZjYgPSByZWY1LlNldHRpbmdzKSAhPSBudWxsID8gcmVmNi5zZXRIcmVmUG9wdXAoKHJlZjcgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmOCA9IHJlZjcudWkpICE9IG51bGwgPyByZWY4LmhyZWZfcG9wdXAgOiB2b2lkIDAgOiB2b2lkIDApIDogdm9pZCAwIDogdm9pZCAwO1xuICB9KTtcbn1cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuU3RlZWRvcy5pc0V4cHJlc3Npb24gPSBmdW5jdGlvbihmdW5jKSB7XG4gIHZhciBwYXR0ZXJuLCByZWcxLCByZWcyO1xuICBpZiAodHlwZW9mIGZ1bmMgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHBhdHRlcm4gPSAvXnt7KC4rKX19JC87XG4gIHJlZzEgPSAvXnt7KGZ1bmN0aW9uLispfX0kLztcbiAgcmVnMiA9IC9ee3soLis9Pi4rKX19JC87XG4gIGlmICh0eXBlb2YgZnVuYyA9PT0gJ3N0cmluZycgJiYgZnVuYy5tYXRjaChwYXR0ZXJuKSAmJiAhZnVuYy5tYXRjaChyZWcxKSAmJiAhZnVuYy5tYXRjaChyZWcyKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uID0gZnVuY3Rpb24oZnVuYywgZm9ybURhdGEsIGRhdGFQYXRoLCBnbG9iYWwpIHtcbiAgdmFyIGVycm9yLCBmdW5jQm9keSwgZ2V0UGFyZW50UGF0aCwgZ2V0VmFsdWVCeVBhdGgsIGdsb2JhbFRhZywgcGFyZW50LCBwYXJlbnRQYXRoLCBzdHI7XG4gIGdldFBhcmVudFBhdGggPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIHBhdGhBcnI7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgcGF0aEFyciA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgIGlmIChwYXRoQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gJyMnO1xuICAgICAgfVxuICAgICAgcGF0aEFyci5wb3AoKTtcbiAgICAgIHJldHVybiBwYXRoQXJyLmpvaW4oJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuICcjJztcbiAgfTtcbiAgZ2V0VmFsdWVCeVBhdGggPSBmdW5jdGlvbihmb3JtRGF0YSwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnIycgfHwgIXBhdGgpIHtcbiAgICAgIHJldHVybiBmb3JtRGF0YSB8fCB7fTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIF8uZ2V0KGZvcm1EYXRhLCBwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcigncGF0aCBoYXMgdG8gYmUgYSBzdHJpbmcnKTtcbiAgICB9XG4gIH07XG4gIGlmIChmb3JtRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgZm9ybURhdGEgPSB7fTtcbiAgfVxuICBwYXJlbnRQYXRoID0gZ2V0UGFyZW50UGF0aChkYXRhUGF0aCk7XG4gIHBhcmVudCA9IGdldFZhbHVlQnlQYXRoKGZvcm1EYXRhLCBwYXJlbnRQYXRoKSB8fCB7fTtcbiAgaWYgKHR5cGVvZiBmdW5jID09PSAnc3RyaW5nJykge1xuICAgIGZ1bmNCb2R5ID0gZnVuYy5zdWJzdHJpbmcoMiwgZnVuYy5sZW5ndGggLSAyKTtcbiAgICBnbG9iYWxUYWcgPSAnX19HX0xfT19CX0FfTF9fJztcbiAgICBzdHIgPSAnXFxuICAgIHJldHVybiAnICsgZnVuY0JvZHkucmVwbGFjZSgvXFxiZm9ybURhdGFcXGIvZywgSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBnbG9iYWxUYWcpKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgSlNPTi5zdHJpbmdpZnkoZ2xvYmFsKSkucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcYicgKyBnbG9iYWxUYWcgKyAnXFxcXGInLCAnZycpLCAnZ2xvYmFsJykucmVwbGFjZSgvcm9vdFZhbHVlL2csIEpTT04uc3RyaW5naWZ5KHBhcmVudCkpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gRnVuY3Rpb24oc3RyKSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvciwgZnVuYywgZGF0YVBhdGgpO1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIiwgdXJsKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsIGF2YXRhcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50U2tpbjtcbiAgICBhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJza2luXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFNraW4pIHtcbiAgICAgIHJldHVybiBhY2NvdW50U2tpbi52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tO1xuICAgIGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInpvb21cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50Wm9vbSkge1xuICAgICAgcmV0dXJuIGFjY291bnRab29tLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRab29tVmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgem9vbU5hbWUsIHpvb21TaXplO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgfVxuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcbiAgICB6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZTtcbiAgICB6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZTtcbiAgICBpZiAoIXpvb21OYW1lKSB7XG4gICAgICB6b29tTmFtZSA9IFwibGFyZ2VcIjtcbiAgICAgIHpvb21TaXplID0gMS4yO1xuICAgIH1cbiAgICBpZiAoem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKSkge1xuICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLVwiICsgem9vbU5hbWUpO1xuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIiwgYWNjb3VudFpvb21WYWx1ZS5uYW1lKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIiwgYWNjb3VudFpvb21WYWx1ZS5zaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmNTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZjUgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZjUubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY1O1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmNSA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWY1LmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNS51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWY2ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNi5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjcgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY3W1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWY4ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmOFtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWY1ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNVtcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmNiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjZbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjcgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmNy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjggPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmOC5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmNSwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmNS50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZjEwLCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZWY5LCB2YWxpZDtcbiAgICAgIHJlYXNvbiA9IHQoXCJwYXNzd29yZF9pbnZhbGlkXCIpO1xuICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgaWYgKCFwd2QpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhc3N3b3JQb2xpY3kgPSAocmVmNSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjYucG9saWN5IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcGFzc3dvclBvbGljeUVycm9yID0gKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnBhc3N3b3JkKSAhPSBudWxsID8gcmVmOC5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgKChyZWY5ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjEwID0gcmVmOS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEwLnBvbGljeWVycm9yIDogdm9pZCAwIDogdm9pZCAwKSB8fCBcIuWvhueggeS4jeespuWQiOinhOWImVwiO1xuICAgICAgaWYgKHBhc3N3b3JQb2xpY3kpIHtcbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpKSB7XG4gICAgICAgICAgcmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiRGFzaGJvYXJkcztcbiAgZGJEYXNoYm9hcmRzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICByZXR1cm4gZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmV0dXJuIGRiRGFzaGJvYXJkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgICBvYmplY3QgPSB7XG4gICAgICBiYWNrZ3JvdW5kOiB0cnVlXG4gICAgfTtcbiAgICBpc2RvY3VtZW50REIgPSAoKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNiA9IHJlZjUuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmNyA9IHJlZjZbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmNy5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmb3JlaWduX2tleTogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksIHJlZmVyZW5jZXM6IE1hdGNoLk9wdGlvbmFsKE9iamVjdCl9KTtcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgICAgICAgICAgdXBkYXRlVXNlckxhc3RMb2dvbjogKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsICd1cGRhdGVVc2VyTGFzdExvZ29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGxhc3RfbG9nb246IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNZXRlb3IuY2FsbCgndXBkYXRlVXNlckxhc3RMb2dvbicpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICBNZXRlb3IubWV0aG9kc1xuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIGlmIGRiLnVzZXJzLmZpbmQoe1wiZW1haWxzLmFkZHJlc3NcIjogZW1haWx9KS5jb3VudCgpPjBcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdXNoOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHNldDogXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgXVxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPj0gMlxuICAgICAgICBwID0gbnVsbFxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgICBwID0gZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1bGw6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgcFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwifVxuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIFxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlsc1xuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgZS5wcmltYXJ5ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcblxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXG4gICAgICAgICRzZXQ6XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcbiAgICAgICAgICBlbWFpbDogZW1haWxcblxuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7dXNlcjogdGhpcy51c2VySWR9LHskc2V0OiB7ZW1haWw6IGVtYWlsfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICByZXR1cm4ge31cblxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gKCktPlxuICAgICAgICBzd2FsXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIChlcnJvciwgcmVzdWx0KS0+XG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcbiMjI1xuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuIyMjIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXNlcnNfYWRkX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChkYi51c2Vycy5maW5kKHtcbiAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbFxuICAgICAgfSkuY291bnQoKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbCxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgcCwgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPj0gMikge1xuICAgICAgICBwID0gbnVsbDtcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICAgIHAgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgZW1haWxzLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlscztcbiAgICAgIGVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICB9LCBmdW5jdGlvbihpbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgPyByZXN1bHQuZXJyb3IgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3dhbCh0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuXG5cbi8qXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICAqIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuICovXG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7YXZhdGFyOiBhdmF0YXJ9fSkgICIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJBdmF0YXI6IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGF2YXRhcjogYXZhdGFyXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCJBY2NvdW50cy5lbWFpbFRlbXBsYXRlcyA9IHtcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncylcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbTtcblx0fSkoKSxcblx0cmVzZXRQYXNzd29yZDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHR2ZXJpZnlFbWFpbDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9lbWFpbFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0ZW5yb2xsQWNjb3VudDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2NyZWF0ZV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH1cbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxuXHR7XG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxuXHRcdHtcblx0XHRcdC8vIOiHquW3seWSjOWtkOmDqOmXqOeahGZ1bGxuYW1l5L+u5pS5XG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XG5cdFx0XHRcblx0XHR9KTtcblx0fVx0XG5cbiAgXHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgXHRkYXRhOiB7XG5cdCAgICAgIFx0cmV0OiAwLFxuXHQgICAgICBcdG1zZzogXCJTdWNjZXNzZnVsbHlcIlxuICAgIFx0fVxuICBcdH0pO1xufSk7XG5cbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcbiAgICAgICAgTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpb3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuIiwiaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFB1c2guQ29uZmlndXJlKHtcbiAgICAgIGFuZHJvaWQ6IHtcbiAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRCxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBpb3M6IHtcbiAgICAgICAgYmFkZ2U6IHRydWUsXG4gICAgICAgIGNsZWFyQmFkZ2U6IHRydWUsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNlbGVjdG9yID0ge31cblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7YWRtaW5zOnskaW46W3VzZXJJZF19fSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG5cdFx0aWYgc3BhY2VJZFxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXG5cdFx0c3BhY2VzID0gW11cblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XG5cdFx0XHRzcGFjZXMucHVzaCh1LnNwYWNlKVxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cblx0aWNvbjogXCJnbG9iZVwiXG5cdGNvbG9yOiBcImJsdWVcIlxuXHR0YWJsZUNvbHVtbnM6IFtcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXG5cdFx0e25hbWU6IFwibW9kdWxlc1wifSxcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxuXHRdXG5cdGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0cmV0dXJuIHt9XG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxuXHRzaG93RGVsQ29sdW1uOiBmYWxzZVxuXHRkaXNhYmxlQWRkOiB0cnVlXG5cdHBhZ2VMZW5ndGg6IDEwMFxuXHRvcmRlcjogW1swLCBcImRlc2NcIl1dXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdEBzcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWduc1xuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxuXHRcdHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWdcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG4gPSBwYXJzZUludChhcmd1bWVudHNbMV0pIHx8IDA7XG4gICAgdmFyIGs7XG4gICAgaWYgKG4gPj0gMCkge1xuICAgICAgayA9IG47XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW4gKyBuO1xuICAgICAgaWYgKGsgPCAwKSB7ayA9IDA7fVxuICAgIH1cbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxuICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGsrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSIsIk1ldGVvci5zdGFydHVwIC0+XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXG5cbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cbiAgICAgIHd3dzogXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XG5cdGxpc3RWaWV3cyA9IHt9XG5cblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxuXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZldGNoKClcblxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXHRfLmZvckVhY2ggb2JqZWN0cywgKG8sIGtleSktPlxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3Rfdmlldylcblx0XHRcdGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3XG5cdHJldHVybiBsaXN0Vmlld3NcblxuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSlcblxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXG5cblxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIi8vIFNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XG5cbi8vICAgdmFyIGNoZWNrRm9yS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcbi8vICAgICB9XG4vLyAgIH07XG4vLyAgIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbi8vICAgICByZXR1cm4gb2JqICYmIG9iai52YWx1ZXMgJiYgb2JqLnZhbHVlc1trZXldO1xuLy8gICB9O1xuLy8gICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiB0cnVlO1xuLy8gICB9O1xuXG4vLyAgIENvbGxlY3Rpb24uZGVueSh7XG4vLyAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH0sXG4vLyAgICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9XG4vLyAgIH0pO1xuXG4vLyAgIC8vIHB1YmxpYyBjbGllbnQgYW5kIHNlcnZlciBhcGlcbi8vICAgdmFyIGFwaSA9IHtcbi8vICAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgICAgY29uc29sZS5sb2coQ29sbGVjdGlvbi5maW5kT25lKCkpO1xuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKTtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAvLyAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuLy8gICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuLy8gICAgIH0sXG4vLyAgICAgJ2VxdWFscyc6IGZ1bmN0aW9uIChrZXksIGV4cGVjdGVkLCBpZGVudGljYWwpIHtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuXG4vLyAgICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcblxuLy8gICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmIF8uaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4vLyAgICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xuLy8gICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XG4vLyAgICAgfVxuLy8gICB9O1xuXG4vLyAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCl7XG4vLyAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuLy8gICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XG4vLyAgICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSlcbi8vICAgICB9XG4vLyAgIH0pXG5cbi8vICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuLy8gICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbi8vICAgICAvLyAgIGlmIChDb2xsZWN0aW9uLmZpbmRPbmUoKSkge1xuLy8gICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcbi8vICAgICAvLyAgIH1cbi8vICAgICAvLyB9KTtcblxuLy8gICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbi8vICAgICAgIHZhciBjbGllbnRJRCA9IGNvbm5lY3Rpb24uaWQ7XG5cbi8vICAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5pbnNlcnQoeyAnY2xpZW50SUQnOiBjbGllbnRJRCwgJ3ZhbHVlcyc6IHt9LCBcImNyZWF0ZWRcIjogbmV3IERhdGUoKSB9KTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgY29ubmVjdGlvbi5vbkNsb3NlKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH0pO1xuXG4vLyAgICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZCh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5tZXRob2RzKHtcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgICB9LFxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XG5cbi8vICAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcblxuLy8gICAgICAgICBpZiAoIWNvbmRpdGlvbihrZXksIHZhbHVlKSlcbi8vICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XG5cbi8vICAgICAgICAgdmFyIHVwZGF0ZU9iaiA9IHt9O1xuLy8gICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xuXG4vLyAgICAgICAgIENvbGxlY3Rpb24udXBkYXRlKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0sIHsgJHNldDogdXBkYXRlT2JqIH0pO1xuLy8gICAgICAgfVxuLy8gICAgIH0pOyAgXG5cbi8vICAgICAvLyBzZXJ2ZXItb25seSBhcGlcbi8vICAgICBfLmV4dGVuZChhcGksIHtcbi8vICAgICAgICdzZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXRDb25kaXRpb24nOiBmdW5jdGlvbiAobmV3Q29uZGl0aW9uKSB7XG4vLyAgICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfVxuXG4vLyAgIHJldHVybiBhcGk7XG4vLyB9KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0dXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCByZXEucXVlcnk/LnVzZXJJZFxuXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxuXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxuXHRcdFxuXHRcdGlmICF1c2VyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRyZXR1cm47XG5cblx0XHR1c2VyX2lkID0gdXNlci5faWRcblxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxuXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcblxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogYXBwc31cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XG5cdFxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB0cnlcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXG4gICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgIWF1dGhUb2tlblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcbiAgICAgICAgZGF0YSA9IFtdXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpXG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogW11cblxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHt9XG4iLCJ2YXIgQ29va2llcywgc3RlZWRvc0F1dGg7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKG1vZGVsID09PSAnbWFpbF9hY2NvdW50cycpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pO1xuICB9XG59KTtcbiIsImNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKVxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZClcblx0aWYgYXBwXG5cdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXHRcdHJlZGlyZWN0VXJsID0gYXBwLnVybFxuXHRlbHNlXG5cdFx0c2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRyZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmxcblxuXHRpZiAhcmVkaXJlY3RVcmxcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdHJlcy5lbmQoKVxuXHRcdHJldHVyblxuXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuXHQjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuXHQjIGlmIHJlcS5ib2R5XG5cdCMgXHR1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxuXHQjIFx0YXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHQjICMgdGhlbiBjaGVjayBjb29raWVcblx0IyBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdCMgXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cblx0XHR1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl1cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRpZiB1c2VyXG5cdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdCMgZGVzLWNiY1xuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXG5cdFx0XHRrZXk4ID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDhcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDggLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gOFxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXG5cdFx0XHRkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSlcblx0XHRcdGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSlcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRqb2luZXIgPSBcIj9cIlxuXG5cdFx0XHRpZiByZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRcdGpvaW5lciA9IFwiJlwiXG5cblx0XHRcdHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlblxuXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXG5cdFx0XHRcdHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9I3tlbmNvZGVVUkkodXNlci51c2VybmFtZSl9XCJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCByZXR1cm51cmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdHJlcy53cml0ZUhlYWQgNDAxXG5cdHJlcy5lbmQoKVxuXHRyZXR1cm5cbiIsInZhciBDb29raWVzLCBjcnlwdG8sIGV4cHJlc3M7XG5cbmNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHAsIGF1dGhUb2tlbiwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgY29va2llcywgZGVzX2NpcGhlciwgZGVzX2NpcGhlcmVkTXNnLCBkZXNfaXYsIGRlc19zdGVlZG9zX3Rva2VuLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGpvaW5lciwga2V5MzIsIGtleTgsIGxlbiwgbSwgbm93LCByZWRpcmVjdFVybCwgcmV0dXJudXJsLCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgYXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKTtcbiAgaWYgKGFwcCkge1xuICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgcmVkaXJlY3RVcmwgPSBhcHAudXJsO1xuICB9IGVsc2Uge1xuICAgIHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgIHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybDtcbiAgfVxuICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgaWYgKCF1c2VySWQgJiYgIWF1dGhUb2tlbikge1xuICAgIHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIH1cbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgfVxuICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBkZXNfaXYgPSBcIi04NzYyLWZjXCI7XG4gICAgICBrZXk4ID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDgpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gOCAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gOCkge1xuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLCA4KTtcbiAgICAgIH1cbiAgICAgIGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKTtcbiAgICAgIGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSk7XG4gICAgICBkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBqb2luZXIgPSBcIj9cIjtcbiAgICAgIGlmIChyZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICAgIGpvaW5lciA9IFwiJlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuO1xuICAgICAgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT1cIiArIChlbmNvZGVVUkkodXNlci51c2VybmFtZSkpO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHJldHVybnVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgcmVzLmVuZCgpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0IyB0aGlzLnBhcmFtcyA9XG5cdFx0IyBcdHVzZXJJZDogZGVjb2RlVVJJKHJlcS51cmwpLnJlcGxhY2UoL15cXC8vLCAnJykucmVwbGFjZSgvXFw/LiokLywgJycpXG5cdFx0d2lkdGggPSA1MCA7XG5cdFx0aGVpZ2h0ID0gNTAgO1xuXHRcdGZvbnRTaXplID0gMjggO1xuXHRcdGlmIHJlcS5xdWVyeS53XG5cdFx0ICAgIHdpZHRoID0gcmVxLnF1ZXJ5LncgO1xuXHRcdGlmIHJlcS5xdWVyeS5oXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcblx0XHRpZiByZXEucXVlcnkuZnNcbiAgICAgICAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzIDtcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcblx0XHRpZiAhdXNlclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLnByb2ZpbGU/LmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuXHRcdFx0XHRcdCB2aWV3Qm94PVwiMCAwIDcyIDcyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0XHRcdDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XG5cdFx0XHRcdFx0LnN0MXtmaWxsOiNEMEQwRDA7fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelwiLz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcblx0XHRcdFx0XHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elwiLz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcblx0XHRcdFx0XHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcIi8+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG4jXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvcGFja2FnZXMvc3RlZWRvc19iYXNlL2NsaWVudC9pbWFnZXMvZGVmYXVsdC1hdmF0YXIucG5nXCIpXG4jXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcblx0XHRpZiAhdXNlcm5hbWVcblx0XHRcdHVzZXJuYW1lID0gXCJcIlxuXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cblx0XHRcdGNvbG9ycyA9IFsnI0Y0NDMzNicsJyNFOTFFNjMnLCcjOUMyN0IwJywnIzY3M0FCNycsJyMzRjUxQjUnLCcjMjE5NkYzJywnIzAzQTlGNCcsJyMwMEJDRDQnLCcjMDA5Njg4JywnIzRDQUY1MCcsJyM4QkMzNEEnLCcjQ0REQzM5JywnI0ZGQzEwNycsJyNGRjk4MDAnLCcjRkY1NzIyJywnIzc5NTU0OCcsJyM5RTlFOUUnLCcjNjA3RDhCJ11cblxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxuXHRcdFx0Y29sb3JfaW5kZXggPSAwXG5cdFx0XHRfLmVhY2ggdXNlcm5hbWVfYXJyYXksIChpdGVtKSAtPlxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG5cblx0XHRcdHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cblx0XHRcdCNjb2xvciA9IFwiI0Q2REFEQ1wiXG5cblx0XHRcdGluaXRpYWxzID0gJydcblx0XHRcdGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpXG5cblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxuXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgd2lkdGg9XCIje3dpZHRofVwiIGhlaWdodD1cIiN7aGVpZ2h0fVwiIHN0eWxlPVwid2lkdGg6ICN7d2lkdGh9cHg7IGhlaWdodDogI3toZWlnaHR9cHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxuXHRcdFx0XHQ8dGV4dCB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIHk9XCI1MCVcIiB4PVwiNTAlXCIgZHk9XCIwLjM2ZW1cIiBwb2ludGVyLWV2ZW50cz1cImF1dG9cIiBmaWxsPVwiI0ZGRkZGRlwiIGZvbnQtZmFtaWx5PVwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVwiIHN0eWxlPVwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAje2ZvbnRTaXplfXB4O1wiPlxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XG5cdFx0XHRcdDwvdGV4dD5cblx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cblx0XHRcdHJlcy53cml0ZSBzdmdcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG5cdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXI/XG5cdFx0XHRpZiByZXFNb2RpZmllZEhlYWRlciA9PSB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxuXHRcdFx0XHRyZXMud3JpdGVIZWFkIDMwNFxuXHRcdFx0XHRyZXMuZW5kKClcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXG5cblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcblx0XHRyZXR1cm4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9yX2luZGV4LCBjb2xvcnMsIGZvbnRTaXplLCBoZWlnaHQsIGluaXRpYWxzLCBwb3NpdGlvbiwgcmVmLCByZWYxLCByZWYyLCByZXFNb2RpZmllZEhlYWRlciwgc3ZnLCB1c2VyLCB1c2VybmFtZSwgdXNlcm5hbWVfYXJyYXksIHdpZHRoO1xuICAgIHdpZHRoID0gNTA7XG4gICAgaGVpZ2h0ID0gNTA7XG4gICAgZm9udFNpemUgPSAyODtcbiAgICBpZiAocmVxLnF1ZXJ5LncpIHtcbiAgICAgIHdpZHRoID0gcmVxLnF1ZXJ5Lnc7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuaCkge1xuICAgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5Lmg7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuZnMpIHtcbiAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzO1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKSk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgocmVmID0gdXNlci5wcm9maWxlKSAhPSBudWxsID8gcmVmLmF2YXRhciA6IHZvaWQgMCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXIpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXJVcmwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBzdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiBpZD1cXFwiTGF5ZXJfMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeD1cXFwiMHB4XFxcIiB5PVxcXCIwcHhcXFwiXFxuXHQgdmlld0JveD1cXFwiMCAwIDcyIDcyXFxcIiBzdHlsZT1cXFwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiPlxcbjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XFxuXHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XFxuPC9zdHlsZT5cXG48Zz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDBcXFwiIGQ9XFxcIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XFxcIi8+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XFxuXHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcXFwiLz5cXG48L2c+XFxuPGc+XFxuXHQ8Zz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcXG5cdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XFxcIi8+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcXG5cdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elxcXCIvPlxcblx0PC9nPlxcbjwvZz5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHVzZXIubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgdXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKTtcbiAgICAgIGNvbG9yX2luZGV4ID0gMDtcbiAgICAgIF8uZWFjaCh1c2VybmFtZV9hcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gY29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuICAgICAgfSk7XG4gICAgICBwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCJcIiArIHdpZHRoICsgXCJcXFwiIGhlaWdodD1cXFwiXCIgKyBoZWlnaHQgKyBcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweDsgaGVpZ2h0OiBcIiArIGhlaWdodCArIFwicHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcblx0PHRleHQgdGV4dC1hbmNob3I9XFxcIm1pZGRsZVxcXCIgeT1cXFwiNTAlXFxcIiB4PVxcXCI1MCVcXFwiIGR5PVxcXCIwLjM2ZW1cXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJhdXRvXFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmb250LWZhbWlseT1cXFwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVxcXCIgc3R5bGU9XFxcImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogXCIgKyBmb250U2l6ZSArIFwicHg7XFxcIj5cXG5cdFx0XCIgKyBpbml0aWFscyArIFwiXFxuXHQ8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmMSA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCAoKHJlZjIgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSB8fCBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJyk7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aCk7XG4gICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUocmVzKTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0XHRhY2Nlc3NfdG9rZW4gPSByZXEucXVlcnk/LmFjY2Vzc190b2tlblxuXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAyMDBcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IucHVibGlzaCAnYXBwcycsIChzcGFjZUlkKS0+XG4gICAgICAgIHVubGVzcyB0aGlzLnVzZXJJZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxuICAgICAgICBcblxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cbiAgICAgICAgaWYgc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiBzcGFjZUlkfV19XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7c29ydDoge3NvcnQ6IDF9fSk7XG4iLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdhcHBzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlxuXG5cdCMgcHVibGlzaCB1c2VycyBzcGFjZXNcblx0IyB3ZSBvbmx5IHB1Ymxpc2ggc3BhY2VzIGN1cnJlbnQgdXNlciBqb2luZWQuXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cblx0XHRzZWxmID0gdGhpcztcblx0XHR1c2VyU3BhY2VzID0gW11cblx0XHRzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0sIHtmaWVsZHM6IHtzcGFjZToxfX0pXG5cdFx0c3VzLmZvckVhY2ggKHN1KSAtPlxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxuXG5cdFx0aGFuZGxlMiA9IG51bGxcblxuXHRcdCMgb25seSByZXR1cm4gdXNlciBqb2luZWQgc3BhY2VzLCBhbmQgb2JzZXJ2ZXMgd2hlbiB1c2VyIGpvaW4gb3IgbGVhdmUgYSBzcGFjZVxuXHRcdGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkub2JzZXJ2ZVxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdGlmIGRvYy5zcGFjZVxuXHRcdFx0XHRcdGlmIHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMFxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcblx0XHRcdFx0XHRcdG9ic2VydmVTcGFjZXMoKVxuXHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcyA9IC0+XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuXHRcdFx0aGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJTcGFjZXN9fSkub2JzZXJ2ZVxuXHRcdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcblx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLl9pZClcblx0XHRcdFx0Y2hhbmdlZDogKG5ld0RvYywgb2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XG5cdFx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5faWRcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXG5cblx0XHRvYnNlcnZlU3BhY2VzKCk7XG5cblx0XHRzZWxmLnJlYWR5KCk7XG5cblx0XHRzZWxmLm9uU3RvcCAtPlxuXHRcdFx0aGFuZGxlLnN0b3AoKTtcblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG4iLCJNZXRlb3IucHVibGlzaCgnbXlfc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGUsIGhhbmRsZTIsIG9ic2VydmVTcGFjZXMsIHNlbGYsIHN1cywgdXNlclNwYWNlcztcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIHVzZXJTcGFjZXMgPSBbXTtcbiAgc3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBzcGFjZTogMVxuICAgIH1cbiAgfSk7XG4gIHN1cy5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSk7XG4gIH0pO1xuICBoYW5kbGUyID0gbnVsbDtcbiAgaGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICBpZiAoZG9jLnNwYWNlKSB7XG4gICAgICAgIGlmICh1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDApIHtcbiAgICAgICAgICB1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKTtcbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgIGlmIChvbGREb2Muc3BhY2UpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZSk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgb2JzZXJ2ZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiB1c2VyU3BhY2VzXG4gICAgICB9XG4gICAgfSkub2JzZXJ2ZSh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgIHNlbGYuYWRkZWQoXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2MsIG9sZERvYykge1xuICAgICAgICByZXR1cm4gc2VsZi5jaGFuZ2VkKFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2MuX2lkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG9ic2VydmVTcGFjZXMoKTtcbiAgc2VsZi5yZWFkeSgpO1xuICByZXR1cm4gc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgcmV0dXJuIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIiMgcHVibGlzaCBzb21lIG9uZSBzcGFjZSdzIGF2YXRhclxuTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX2F2YXRhcicsIChzcGFjZUlkKS0+XG5cdHVubGVzcyBzcGFjZUlkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX2F2YXRhcicsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgaWYgKCFzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuc3BhY2VzLmZpbmQoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhdmF0YXI6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZW5hYmxlX3JlZ2lzdGVyOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ21vZHVsZXMnLCAoKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7IiwiTWV0ZW9yLnB1Ymxpc2goJ21vZHVsZXMnLCBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgKF9pZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0dW5sZXNzIF9pZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfY29udGFjdHNfbGltaXQ6IChzcGFjZSktPlxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLpmYWxzZeihqOekuuS4jemZkOWumue7hOe7h+iMg+WbtO+8jOWNs+ihqOekuuiDveeci+aVtOS4quW3peS9nOWMuueahOe7hOe7h1xuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xuXHRcdHJlVmFsdWUgPVxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XG5cblx0XHRpZiBsaW1pdHMubGVuZ3RoXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRteU9yZ0lkcyA9IG15T3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdFx0XG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXG5cdFx0XHRmb3IgbGltaXQgaW4gbGltaXRzXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgcGFyZW50czogeyRpbjogZnJvbXN9fSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHRcdGZvciBteU9yZ0lkIGluIG15T3JnSWRzXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCB0b3Ncblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxuXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IF8udW5pcSBteUxpdG1pdE9yZ0lkc1xuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXG5cdFx0XHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEgXy5mbGF0dGVuIG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXG5cdFx0aWYgaXNMaW1pdFxuXHRcdFx0dG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIF9pZDogeyRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zfX0sIHtmaWVsZHM6e19pZDogMSwgcGFyZW50czogMX19KS5mZXRjaCgpXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcblx0XHRcdG9yZ3MgPSBfLmZpbHRlciB0b09yZ3MsIChvcmcpIC0+XG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXG5cdFx0cmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdFxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cdFx0cmV0dXJuIHJlVmFsdWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0X2NvbnRhY3RzX2xpbWl0OiBmdW5jdGlvbihzcGFjZSkge1xuICAgIHZhciBmcm9tcywgZnJvbXNDaGlsZHJlbiwgZnJvbXNDaGlsZHJlbklkcywgaSwgaXNMaW1pdCwgaiwgbGVuLCBsZW4xLCBsaW1pdCwgbGltaXRzLCBteUxpdG1pdE9yZ0lkcywgbXlPcmdJZCwgbXlPcmdJZHMsIG15T3Jncywgb3Jncywgb3V0c2lkZV9vcmdhbml6YXRpb25zLCByZVZhbHVlLCBzZXR0aW5nLCB0ZW1wSXNMaW1pdCwgdG9PcmdzLCB0b3M7XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgcmVWYWx1ZSA9IHtcbiAgICAgIGlzTGltaXQ6IHRydWUsXG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG4gICAgfTtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICB9XG4gICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgIHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wiXG4gICAgfSk7XG4gICAgbGltaXRzID0gKHNldHRpbmcgIT0gbnVsbCA/IHNldHRpbmcudmFsdWVzIDogdm9pZCAwKSB8fCBbXTtcbiAgICBpZiAobGltaXRzLmxlbmd0aCkge1xuICAgICAgbXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICB1c2VyczogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXlPcmdJZHMgPSBteU9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBpZiAoIW15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaW1pdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdHNbaV07XG4gICAgICAgIGZyb21zID0gbGltaXQuZnJvbXM7XG4gICAgICAgIHRvcyA9IGxpbWl0LnRvcztcbiAgICAgICAgZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgIHBhcmVudHM6IHtcbiAgICAgICAgICAgICRpbjogZnJvbXNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuICE9IG51bGwgPyBmcm9tc0NoaWxkcmVuLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KSA6IHZvaWQgMDtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IG15T3JnSWRzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIG15T3JnSWQgPSBteU9yZ0lkc1tqXTtcbiAgICAgICAgICB0ZW1wSXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRlbXBJc0xpbWl0KSB7XG4gICAgICAgICAgICBpc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoKHRvcyk7XG4gICAgICAgICAgICBteUxpdG1pdE9yZ0lkcy5wdXNoKG15T3JnSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEobXlMaXRtaXRPcmdJZHMpO1xuICAgICAgaWYgKG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxKF8uZmxhdHRlbihvdXRzaWRlX29yZ2FuaXphdGlvbnMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTGltaXQpIHtcbiAgICAgIHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgcGFyZW50czogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgb3JncyA9IF8uZmlsdGVyKHRvT3JncywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgIHZhciBwYXJlbnRzO1xuICAgICAgICBwYXJlbnRzID0gb3JnLnBhcmVudHMgfHwgW107XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgJiYgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDE7XG4gICAgICB9KTtcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXQ7XG4gICAgcmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnM7XG4gICAgcmV0dXJuIHJlVmFsdWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcbiAgICAgICAgY2hlY2sodmFsdWUsIE9iamVjdCk7XG5cbiAgICAgICAgb2JqID0ge307XG4gICAgICAgIG9iai51c2VyID0gdGhpcy51c2VySWQ7XG4gICAgICAgIG9iai5rZXkgPSBrZXk7XG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy5pbnNlcnQob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG5cdFx0Y2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG5cblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpXG5cblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwnZXJyb3ItaW52YWxpZC11c2VyJylcblxuXHRcdHVubGVzcyB1c2VyX2lkXG5cdFx0XHR1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWRcblxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxuXG5cdFx0cmV0dXJuIHVzZXJuYW1lXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3Rcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcblxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcblxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXG5cbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcblxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcblxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQsICRvcjogW3sgc3luY19kaXJlY3Rpb246IHsgJGV4aXN0czogZmFsc2UgfX0sIHsgc3luY19kaXJlY3Rpb246IHsgJGluOiBbJ2JvdGgnLCAnb2JqX3RvX2lucyddfX1dIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSB9IH0pXG4gICAgICAgICAgICBpZiBmbFxuICAgICAgICAgICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZVxuICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXG4gICAgICAgICAgICAgICAgaWYgcGVybXNcbiAgICAgICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG5cbiAgICAgICAgb3dzID0gb3dzLmZpbHRlciAobiktPlxuICAgICAgICAgICAgcmV0dXJuIG4uZmxvd19uYW1lXG5cbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgICRvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3luY19kaXJlY3Rpb246IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc3luY19kaXJlY3Rpb246IHtcbiAgICAgICAgICAgICRpbjogWydib3RoJywgJ29ial90b19pbnMnXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIF8uZWFjaChvd3MsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBmbCwgcGVybXM7XG4gICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGZsKSB7XG4gICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICAgIGlmIChwZXJtcykge1xuICAgICAgICAgIGlmIChwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKSkge1xuICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChvcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgb3dzID0gb3dzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5mbG93X25hbWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRTcGFjZVVzZXJQYXNzd29yZDogKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkgLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKVxuXHRcdFxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe19pZDogc3BhY2VfdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblx0XHR1c2VySWQgPSB0aGlzLnVzZXJJZFxuXHRcdGNhbkVkaXQgPSBzcGFjZVVzZXIudXNlciA9PSB1c2VySWRcblx0XHR1bmxlc3MgY2FuRWRpdFxuXHRcdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZV9pZH0pXG5cdFx0XHRpc1NwYWNlQWRtaW4gPSBzcGFjZT8uYWRtaW5zPy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcblx0XHRcdGNhbkVkaXQgPSBpc1NwYWNlQWRtaW5cblxuXHRcdGNvbXBhbnlJZHMgPSBzcGFjZVVzZXIuY29tcGFueV9pZHNcblx0XHRpZiAhY2FuRWRpdCAmJiBjb21wYW55SWRzICYmIGNvbXBhbnlJZHMubGVuZ3RoXG5cdFx0XHQjIOe7hOe7h+euoeeQhuWRmOS5n+iDveS/ruaUueWvhueggVxuXHRcdFx0Y29tcGFueXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjb21wYW55XCIpLmZpbmQoe19pZDogeyAkaW46IGNvbXBhbnlJZHMgfSwgc3BhY2U6IHNwYWNlX2lkIH0sIHtmaWVsZHM6IHsgYWRtaW5zOiAxIH19KS5mZXRjaCgpXG5cdFx0XHRpZiBjb21wYW55cyBhbmQgY29tcGFueXMubGVuZ3RoXG5cdFx0XHRcdGNhbkVkaXQgPSBfLmFueSBjb21wYW55cywgKGl0ZW0pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIGl0ZW0uYWRtaW5zICYmIGl0ZW0uYWRtaW5zLmluZGV4T2YodXNlcklkKSA+IC0xXG5cblx0XHR1bmxlc3MgY2FuRWRpdFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpXG5cblx0XHR1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XG5cdFx0dXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIilcblxuXHRcdCMgU3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKVxuXHRcdGxvZ291dCA9IHRydWU7XG5cdFx0aWYgdGhpcy51c2VySWQgPT0gdXNlcl9pZFxuXHRcdFx0bG9nb3V0ID0gZmFsc2Vcblx0XHRcblx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCB7XG5cdFx0XHRhbGdvcml0aG06ICdzaGEtMjU2Jyxcblx0XHRcdGRpZ2VzdDogcGFzc3dvcmRcblx0XHR9LCB7bG9nb3V0OiBsb2dvdXR9KVxuXHRcdGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0aWYgY2hhbmdlZFVzZXJJbmZvXG5cdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskcHVzaDogeydzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogY2hhbmdlZFVzZXJJbmZvLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0fX0pXG5cblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxuXHRcdGlmIHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZFxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIHVzZXJDUC5sb2NhbGUgaXMgJ3poLWNuJ1xuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xuXHRcdFx0U01TUXVldWUuc2VuZFxuXHRcdFx0XHRGb3JtYXQ6ICdKU09OJyxcblx0XHRcdFx0QWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG5cdFx0XHRcdFBhcmFtU3RyaW5nOiAnJyxcblx0XHRcdFx0UmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuXHRcdFx0XHRTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG5cdFx0XHRcdFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG5cdFx0XHRcdG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2FuRWRpdCwgY2hhbmdlZFVzZXJJbmZvLCBjb21wYW55SWRzLCBjb21wYW55cywgY3VycmVudFVzZXIsIGlzU3BhY2VBZG1pbiwgbGFuZywgbG9nb3V0LCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcklkLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT09IHVzZXJJZDtcbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGNhbkVkaXQgPSBpc1NwYWNlQWRtaW47XG4gICAgfVxuICAgIGNvbXBhbnlJZHMgPSBzcGFjZVVzZXIuY29tcGFueV9pZHM7XG4gICAgaWYgKCFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBjb21wYW55SWRzXG4gICAgICAgIH0sXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGlmIChjb21wYW55cyAmJiBjb21wYW55cy5sZW5ndGgpIHtcbiAgICAgICAgY2FuRWRpdCA9IF8uYW55KGNvbXBhbnlzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uYWRtaW5zICYmIGl0ZW0uYWRtaW5zLmluZGV4T2YodXNlcklkKSA+IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjYW5FZGl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIGxvZ291dCA9IHRydWU7XG4gICAgaWYgKHRoaXMudXNlcklkID09PSB1c2VyX2lkKSB7XG4gICAgICBsb2dvdXQgPSBmYWxzZTtcbiAgICB9XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwge1xuICAgICAgYWxnb3JpdGhtOiAnc2hhLTI1NicsXG4gICAgICBkaWdlc3Q6IHBhc3N3b3JkXG4gICAgfSwge1xuICAgICAgbG9nb3V0OiBsb2dvdXRcbiAgICB9KTtcbiAgICBjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGlmIChjaGFuZ2VkVXNlckluZm8pIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgfSwge1xuICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogKHJlZjEgPSBjaGFuZ2VkVXNlckluZm8uc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGFzc3dvcmQpICE9IG51bGwgPyByZWYyLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBTTVNRdWV1ZS5zZW5kKHtcbiAgICAgICAgRm9ybWF0OiAnSlNPTicsXG4gICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuICAgICAgICBQYXJhbVN0cmluZzogJycsXG4gICAgICAgIFJlY051bTogdXNlckNQLm1vYmlsZSxcbiAgICAgICAgU2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuICAgICAgICBUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuICAgICAgICBtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XG5cbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxuIyBhY2NvdW50aW5nX21vbnRoIOe7k+eul+aciO+8jOagvOW8j++8mllZWVlNTVxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdGNvdW50X2RheXMgPSAwXG5cblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcblxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxuXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcblx0XHQjIGRvIG5vdGhpbmdcblx0ZWxzZSBpZiBzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgYW5kIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cblxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XG5cdGxhc3RfYmlsbCA9IG51bGxcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcblxuXHQjIOiOt+WPluato+W4uOS7mOasvueahOWwj+S6jnJlZnJlc2hfZGF0ZeeahOacgOi/keeahOS4gOadoeiusOW9lVxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGNyZWF0ZWQ6IHtcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcblx0XHRcdH0sXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGlmIHBheW1lbnRfYmlsbFxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxuXHRlbHNlXG5cdFx0IyDojrflj5bmnIDmlrDnmoTnu5PnrpfnmoTkuIDmnaHorrDlvZVcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRzb3J0OiB7XG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdFx0aWYgYXBwX2JpbGxcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXG5cblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxuXHRjcmVkaXRzID0gaWYgYmlsbC5jcmVkaXRzIHRoZW4gYmlsbC5jcmVkaXRzIGVsc2UgMC4wXG5cdHNldE9iaiA9IG5ldyBPYmplY3Rcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcblxuIyDnu5PnrpflvZPmnIjnmoTmlK/lh7rkuI7kvZnpop1cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKVxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblxuXHRkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzL2RheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxuXHRuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKClcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXG5cdG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdG5ld19iaWxsLmNyZWF0ZWQgPSBub3dcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XG5cdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0e1xuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XG5cdFx0fVxuXHQpLmZvckVhY2ggKGJpbGwpLT5cblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxuXG5cdGlmIHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0bW9kdWxlcyA9IG5ldyBBcnJheVxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxuXHRcdFx0XHRjaGFuZ2VfZGF0ZToge1xuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXG5cdFx0XHR9XG5cdFx0KVxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXG5cdFx0aWYgbm90IG1fY2hhbmdlbG9nXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJxpbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5a6J6KOF77yM5Zug5q2k6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJx1bmluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Lljbjovb3vvIzlm6DmraTkuI3orqHnrpfotLnnlKhcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcblx0XHRcdCMgIGRvIG5vdGhpbmdcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRl4omlc3RhcnRkYXRl77yM6K+05piO5b2T5pyI5YaF5Y+R55Sf6L+H5a6J6KOF5oiW5Y246L2955qE5pON5L2c77yM6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXG5cdHJldHVybiBtb2R1bGVzXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSAoKS0+XG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XG5cdFx0bW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKVxuXHQpXG5cdHJldHVybiBtb2R1bGVzX25hbWVcblxuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdGlmIGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHRyZXR1cm5cblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZGViaXRzID0gMFxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHRcdHtcblx0XHRcdFx0YmlsbGluZ19kYXRlOiBiX20sXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KS5mb3JFYWNoKChiKS0+XG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcblx0XHQpXG5cdFx0bmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWR9LCB7c29ydDoge21vZGlmaWVkOiAtMX19KVxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcblx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0aWYgZGViaXRzID4gMFxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxuXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXG5cdFx0XHR7XG5cdFx0XHRcdF9pZDogc3BhY2VfaWRcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0ZWxzZVxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0aWYgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT0gMFxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxuXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0XHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxuXHRcdFx0bW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XG5cdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKVxuXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKVxuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxuXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcblxuXHRtID0gbW9tZW50KClcblx0bm93ID0gbS5fZFxuXG5cdHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0XG5cblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxuXHRpZiBzcGFjZS5pc19wYWlkIGlzbnQgdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxuXG5cdCMg5pu05pawbW9kdWxlc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vd1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxuXHRzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxuXHRpZiByXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XG5cdFx0XHRtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKVxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcblx0XHRcdG1jbC5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcblx0XHRcdG1jbC5jcmVhdGVkID0gbm93XG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcblxuXHRyZXR1cm4iLCIgICAgICAgICAgICAgICAgICAgXG5cbmJpbGxpbmdNYW5hZ2VyID0ge307XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBiaWxsaW5nLCBjb3VudF9kYXlzLCBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgZmlyc3RfZGF0ZSwgc3RhcnRfZGF0ZSwgc3RhcnRfZGF0ZV90aW1lO1xuICBjb3VudF9kYXlzID0gMDtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwiXG4gIH0pO1xuICBmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGU7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEgLSBlbmRfZGF0ZV90aW1lLmdldERhdGUoKSk7XG4gIGlmIChmaXJzdF9kYXRlID49IGVuZF9kYXRlKSB7XG5cbiAgfSBlbHNlIGlmIChzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgJiYgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH0gZWxzZSBpZiAoZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFwiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzXG4gIH07XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKSB7XG4gIHZhciBhcHBfYmlsbCwgYl9tLCBiX21fZCwgYmlsbCwgY3JlZGl0cywgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgcGF5bWVudF9iaWxsLCBzZXRPYmo7XG4gIGxhc3RfYmlsbCA9IG51bGw7XG4gIGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDogcmVmcmVzaF9kYXRlXG4gIH0pO1xuICBwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDoge1xuICAgICAgJGx0OiByZWZyZXNoX2RhdGVcbiAgICB9LFxuICAgIGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgaWYgKHBheW1lbnRfYmlsbCkge1xuICAgIGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbDtcbiAgfSBlbHNlIHtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICBhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgYmlsbGluZ19tb250aDogYl9tXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoYXBwX2JpbGwpIHtcbiAgICAgIGxhc3RfYmlsbCA9IGFwcF9iaWxsO1xuICAgIH1cbiAgfVxuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgZGViaXRzID0gYmlsbC5kZWJpdHMgPyBiaWxsLmRlYml0cyA6IDAuMDtcbiAgY3JlZGl0cyA9IGJpbGwuY3JlZGl0cyA/IGJpbGwuY3JlZGl0cyA6IDAuMDtcbiAgc2V0T2JqID0gbmV3IE9iamVjdDtcbiAgc2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogYmlsbC5faWRcbiAgfSwge1xuICAgICRzZXQ6IHNldE9ialxuICB9KTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpIHtcbiAgdmFyIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgZGF5c19udW1iZXIsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIG5ld19iaWxsLCBub3c7XG4gIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKTtcbiAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICBkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzIC8gZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSk7XG4gIGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBiaWxsaW5nX2RhdGU6IHtcbiAgICAgICRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgbm93ID0gbmV3IERhdGU7XG4gIG5ld19iaWxsID0gbmV3IE9iamVjdDtcbiAgbmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpO1xuICBuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aDtcbiAgbmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdDtcbiAgbmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZDtcbiAgbmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZTtcbiAgbmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlO1xuICBuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgbmV3X2JpbGwuZGViaXRzID0gZGViaXRzO1xuICBuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBuZXdfYmlsbC5jcmVhdGVkID0gbm93O1xuICBuZXdfYmlsbC5tb2RpZmllZCA9IG5vdztcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkuY291bnQoKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZnJlc2hfZGF0ZXM7XG4gIHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXk7XG4gIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgIGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAkaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl1cbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGJpbGwpIHtcbiAgICByZXR1cm4gcmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZCk7XG4gIH0pO1xuICBpZiAocmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWZyZXNoX2RhdGVzLCBmdW5jdGlvbihyX2QpIHtcbiAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBtb2R1bGVzLCBzdGFydF9kYXRlO1xuICBtb2R1bGVzID0gbmV3IEFycmF5O1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBtX2NoYW5nZWxvZztcbiAgICBtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG1vZHVsZTogbS5uYW1lLFxuICAgICAgY2hhbmdlX2RhdGU6IHtcbiAgICAgICAgJGx0ZTogZW5kX2RhdGVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH0pO1xuICAgIGlmICghbV9jaGFuZ2Vsb2cpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJpbnN0YWxsXCIpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcInVuaW5zdGFsbFwiKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGUpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXM7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtb2R1bGVzX25hbWU7XG4gIG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlc19uYW1lO1xufTtcblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciBhX20sIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgYl9tLCBiX21fZCwgYmFsYW5jZSwgZGViaXRzLCBtb2R1bGVzLCBtb2R1bGVzX25hbWUsIG5ld2VzdF9iaWxsLCBwZXJpb2RfcmVzdWx0LCByZW1haW5pbmdfbW9udGhzLCB1c2VyX2NvdW50O1xuICBpZiAoYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWNjb3VudGluZ19tb250aCA9PT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIGRlYml0cyA9IDA7XG4gICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICAgIGJpbGxpbmdfZGF0ZTogYl9tLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBkZWJpdHMgKz0gYi5kZWJpdHM7XG4gICAgfSk7XG4gICAgbmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2U7XG4gICAgcmVtYWluaW5nX21vbnRocyA9IDA7XG4gICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICBpZiAoZGViaXRzID4gMCkge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZSAvIGRlYml0cykgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBiYWxhbmNlOiBiYWxhbmNlLFxuICAgICAgICBcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgaWYgKHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09PSAwKSB7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgICAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgZGIuYmlsbGluZ3MucmVtb3ZlKHtcbiAgICAgICAgYmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChtb2R1bGVzLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSBmdW5jdGlvbihzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICB2YXIgbSwgbW9kdWxlcywgbmV3X21vZHVsZXMsIG5vdywgciwgc3BhY2UsIHNwYWNlX3VwZGF0ZV9vYmo7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXk7XG4gIG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcyk7XG4gIG0gPSBtb21lbnQoKTtcbiAgbm93ID0gbS5fZDtcbiAgc3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3Q7XG4gIGlmIChzcGFjZS5pc19wYWlkICE9PSB0cnVlKSB7XG4gICAgc3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZTtcbiAgICBzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZTtcbiAgfVxuICBzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3c7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZDtcbiAgc3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKTtcbiAgc3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzcGFjZV91cGRhdGVfb2JqXG4gIH0pO1xuICBpZiAocikge1xuICAgIF8uZWFjaChuZXdfbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICB2YXIgbWNsO1xuICAgICAgbWNsID0gbmV3IE9iamVjdDtcbiAgICAgIG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpO1xuICAgICAgbWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkO1xuICAgICAgbWNsLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCI7XG4gICAgICBtY2wubW9kdWxlID0gbW9kdWxlO1xuICAgICAgbWNsLmNyZWF0ZWQgPSBub3c7XG4gICAgICByZXR1cm4gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpO1xuICAgIH0pO1xuICB9XG59O1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XG5cbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXG4gICAgdmFyIHJ1bGUgPSBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzO1xuXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xuXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWdvX25leHQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcblxuICAgICAgY29uc29sZS50aW1lKCdzdGF0aXN0aWNzJyk7XG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgIHZhciBkYXRla2V5ID0gXCJcIitkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrKGRhdGUuZ2V0TW9udGgoKSsxKStcIi1cIisoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICByZXR1cm4gZGF0ZWtleTtcbiAgICAgIH07XG4gICAgICAvLyDorqHnrpfliY3kuIDlpKnml7bpl7RcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxuICAgICAgICB2YXIgZEJlZm9yZSA9IG5ldyBEYXRlKGROb3cuZ2V0VGltZSgpIC0gMjQqMzYwMCoxMDAwKTsgICAvL+W+l+WIsOWJjeS4gOWkqeeahOaXtumXtFxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcbiAgICAgIH07XG4gICAgICAvLyDnu5/orqHlvZPml6XmlbDmja5cbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaAu+aVsFxuICAgICAgdmFyIHN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6IHNwYWNlW1wib3duZXJcIl19KTtcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGxhc3RMb2dvbiA9IDA7XG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcbiAgICAgICAgICB2YXIgdXNlciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjpzVXNlcltcInVzZXJcIl19KTtcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvYmogPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGxpbWl0OiAxfSk7XG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXG4gICAgICAgICAgdmFyIG1vZCA9IG9iakFyclswXS5tb2RpZmllZDtcbiAgICAgICAgICByZXR1cm4gbW9kO1xuICAgICAgfTtcbiAgICAgIC8vIOaWh+eroOmZhOS7tuWkp+Wwj1xuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6cG9zdFtcIl9pZFwiXX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSkgIFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cbiAgICAgIHZhciBkYWlseVBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xuICAgICAgICBkYi5zdGVlZG9zX3N0YXRpc3RpY3MuaW5zZXJ0KHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxuICAgICAgICAgIGJhbGFuY2U6IHNwYWNlW1wiYmFsYW5jZVwiXSxcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHN0ZWVkb3M6e1xuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGxhc3RfbG9nb246IGxhc3RMb2dvbihkYi51c2Vycywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3b3JrZmxvdzp7XG4gICAgICAgICAgICBmbG93czogc3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19wb3NpdGlvbnM6IHN0YXRpY3NDb3VudChkYi5mbG93X3Bvc2l0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZmxvd3M6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNtczoge1xuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzOiBzdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgY29tbWVudHM6IHN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2NvbW1lbnRzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS50aW1lRW5kKCdzdGF0aXN0aWNzJyk7XG5cbiAgICAgIGdvX25leHQgPSB0cnVlO1xuXG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogc3RhdGlzdGljcy5qcycpO1xuICAgICAgY29uc29sZS5sb2coZS5zdGFjayk7XG4gICAgfSkpO1xuXG4gIH1cblxufSlcblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAxXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhID0ge3BhcmVudDogcGFyZW50X2lkLCBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSwgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLCBzcGFjZTogc3BhY2VfaWQsIGluc3RhbmNlOiBpbnN0YW5jZV9pZCwgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXX1cbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxuICAgICAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGZpZWxkczoge3NwYWNlOiAxLCBhdHRhY2htZW50czogMX19KS5mb3JFYWNoIChpbnMpIC0+XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcblxuICAgICAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3Uub3JnYW5pemF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OScsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAyIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvcmdhbml6YXRpb246IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAzXG4gICAgICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7ZW1haWw6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7dXNlcjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge2VtYWlsOiBhZGRyZXNzfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDMsXG4gICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMyB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHVzZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgYWRkcmVzcywgdTtcbiAgICAgICAgICBpZiAoc3UudXNlcikge1xuICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHN1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAzIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDRcbiAgICAgICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJ1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDQsXG4gICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgc29ydF9ubzoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAxMDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA0IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDVcblx0XHRuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCdcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0XHR0cnlcblxuXHRcdFx0XHRkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaCAoc3UpLT5cblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0aWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggaXMgMVxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHN1LnNwYWNlLCBwYXJlbnQ6IG51bGx9KVxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcblx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcyA9IFtdXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxuXHRcdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcylcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNlxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0XHR0cnlcblx0XHRcdFx0IyDmuIXnqbptb2R1bGVz6KGoXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMlxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMThcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG5cdFx0XHRcdH0pXG5cblxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdFx0XHRcdFx0c2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gMFxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe25hbWU6IHBtfSlcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZS8obGlzdHByaWNlcyp1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDFcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXG5cblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcblx0XHRcdFx0XHRcdHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyB1cGdyYWRlXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBzdGFydF9kYXRlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm1vZHVsZXMucmVtb3ZlKHt9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMS4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAyXG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAzLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiA2LjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICAgIGlzX3BhaWQ6IHRydWUsXG4gICAgICAgICAgdXNlcl9saW1pdDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHZhciBiYWxhbmNlLCBlLCBlbmRfZGF0ZSwgbGlzdHByaWNlcywgbW9udGhzLCBzZXRfb2JqLCB1c2VyX2NvdW50O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRfb2JqID0ge307XG4gICAgICAgICAgICB1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzLl9pZCxcbiAgICAgICAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gICAgICAgICAgICBiYWxhbmNlID0gcy5iYWxhbmNlO1xuICAgICAgICAgICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgICAgICAgIGxpc3RwcmljZXMgPSAwO1xuICAgICAgICAgICAgICBfLmVhY2gocy5tb2R1bGVzLCBmdW5jdGlvbihwbSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUubGlzdHByaWNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlIC8gKGxpc3RwcmljZXMgKiB1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDE7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgIGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFsYW5jZSA8PSAwKSB7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIik7XG4gICAgICAgICAgICBzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcy5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDogc2V0X29ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHMuX2lkKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2V0X29iaik7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyB1cGdyYWRlXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA2IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG4gICAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgICAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgICAgfVxuXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmxcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkwiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJvb3RVUkw7XG4gIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMgPSB7XG4gICAgICBcImNyZWF0b3JcIjoge1xuICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XG4gICAgICBcInVybFwiOiByb290VVJMXG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCkge1xuICAgIHJldHVybiBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMO1xuICB9XG59KTtcbiIsImlmKHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50Jyl7XG5cdC8vTWV0ZW9yIOeJiOacrOWNh+e6p+WIsDEuOSDlj4rku6XkuIrml7Yobm9kZSDniYjmnKwgMTErKe+8jOWPr+S7peWIoOmZpOatpOS7o+eggVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmxhdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oZGVwdGggPSAxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWR1Y2UoZnVuY3Rpb24gKGZsYXQsIHRvRmxhdHRlbikge1xuXHRcdFx0XHRyZXR1cm4gZmxhdC5jb25jYXQoKEFycmF5LmlzQXJyYXkodG9GbGF0dGVuKSAmJiAoZGVwdGg+MSkpID8gdG9GbGF0dGVuLmZsYXQoZGVwdGgtMSkgOiB0b0ZsYXR0ZW4pO1xuXHRcdFx0fSwgW10pO1xuXHRcdH1cblx0fSk7XG59IiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRuZXcgVGFidWxhci5UYWJsZVxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxuXHRcdGNvbHVtbnM6IFtcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZVxuXHRcdFx0fVxuXHRcdF1cblx0XHRkb206IFwidHBcIlxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2Vcblx0XHRvcmRlcmluZzogZmFsc2Vcblx0XHRwYWdlTGVuZ3RoOiAxMFxuXHRcdGluZm86IGZhbHNlXG5cdFx0c2VhcmNoaW5nOiB0cnVlXG5cdFx0YXV0b1dpZHRoOiB0cnVlXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxuXHRcdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
