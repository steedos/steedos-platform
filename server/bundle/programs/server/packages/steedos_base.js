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
        ref2.setUrl = rootUrl;
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

if (Meteor.isClient) {
  Meteor.autorun(function () {
    var ref5, ref6, ref7, ref8;

    if ((ref5 = window.stores) != null) {
      if ((ref6 = ref5.Settings) != null) {
        ref6.setUserId(Steedos.userId());
      }
    }

    return (ref7 = window.stores) != null ? (ref8 = ref7.Settings) != null ? ref8.setTenantId(Steedos.spaceId()) : void 0 : void 0;
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

    if (space && Steedos.hasFeature('paid', space._id) && end_date !== void 0 && end_date - new Date() <= min_months * 30 * 24 * 3600 * 1000) {
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
      var passworPolicy, passworPolicyError, reason, ref5, ref6, ref7, ref8, valid;
      reason = t("password_invalid");
      valid = true;

      if (!pwd) {
        valid = false;
      }

      passworPolicy = (ref5 = Meteor.settings["public"]) != null ? (ref6 = ref5.password) != null ? ref6.policy : void 0 : void 0;
      passworPolicyError = (ref7 = Meteor.settings["public"]) != null ? (ref8 = ref7.password) != null ? ref8.policyError : void 0 : void 0;

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

    Steedos.validatePassword(password);
    logout = true;

    if (this.userId === user_id) {
      logout = false;
    }

    Accounts.setPassword(user_id, password, {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsImNvb2tpZXMiLCJta2RpcnAiLCJBcnJheSIsInByb3RvdHlwZSIsInNvcnRCeU5hbWUiLCJsb2NhbGUiLCJTdGVlZG9zIiwic29ydCIsInAxIiwicDIiLCJwMV9zb3J0X25vIiwic29ydF9ubyIsInAyX3NvcnRfbm8iLCJuYW1lIiwibG9jYWxlQ29tcGFyZSIsImdldFByb3BlcnR5IiwiayIsImZvckVhY2giLCJ0IiwibSIsInB1c2giLCJyZW1vdmUiLCJmcm9tIiwidG8iLCJyZXN0Iiwic2xpY2UiLCJsZW5ndGgiLCJhcHBseSIsImZpbHRlclByb3BlcnR5IiwiaCIsImwiLCJnIiwiZCIsImluY2x1ZGVzIiwiT2JqZWN0IiwidW5kZWZpbmVkIiwiZmluZFByb3BlcnR5QnlQSyIsInIiLCJDb29raWVzIiwiY3J5cHRvIiwibWl4aW4iLCJyZWYiLCJyZWYxIiwicmVmMiIsInJlZjMiLCJyZWY0Iiwicm9vdFVybCIsInNldHRpbmdzIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJNZXRlb3IiLCJwaG9uZSIsIm51bWJlclRvU3RyaW5nIiwibnVtYmVyIiwic2NhbGUiLCJub3RUaG91c2FuZHMiLCJyZWciLCJ0b1N0cmluZyIsIk51bWJlciIsInRvRml4ZWQiLCJtYXRjaCIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsIlJlZ0V4cCIsInRlc3QiLCJpc0NvcmRvdmEiLCJpc0NsaWVudCIsImFic29sdXRlVXJsIiwiZGVmYXVsdE9wdGlvbnMiLCJlbmRzV2l0aCIsInN1YnN0ciIsIndpbmRvdyIsInN0b3JlcyIsIkFQSSIsImNsaWVudCIsInNldFVybCIsIlNldHRpbmdzIiwic2V0Um9vdFVybCIsInN0YXJ0dXAiLCJyZWY1IiwicmVmNiIsInJlZjciLCJyZWY4Iiwic2V0SHJlZlBvcHVwIiwidWkiLCJocmVmX3BvcHVwIiwiYXV0b3J1biIsInNldFVzZXJJZCIsInVzZXJJZCIsInNldFRlbmFudElkIiwic3BhY2VJZCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNFeHByZXNzaW9uIiwiZnVuYyIsInBhdHRlcm4iLCJyZWcxIiwicmVnMiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsImZvcm1EYXRhIiwiZGF0YVBhdGgiLCJnbG9iYWwiLCJlcnJvciIsImZ1bmNCb2R5IiwiZ2V0UGFyZW50UGF0aCIsImdldFZhbHVlQnlQYXRoIiwiZ2xvYmFsVGFnIiwicGFyZW50IiwicGFyZW50UGF0aCIsInBhdGgiLCJwYXRoQXJyIiwic3BsaXQiLCJwb3AiLCJqb2luIiwiXyIsImdldCIsImNvbnNvbGUiLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJlcnJvcjEiLCJsb2ciLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsInR5cGUiLCJjb25maXJtQnV0dG9uVGV4dCIsImdldEFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHkiLCJzdGVlZG9zX2tleXZhbHVlcyIsImZpbmRPbmUiLCJ1c2VyIiwia2V5IiwidmFsdWUiLCJhcHBseUFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHlWYWx1ZSIsImlzTmVlZFRvTG9jYWwiLCJhdmF0YXIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCIkIiwicmVtb3ZlQ2xhc3MiLCJTZXNzaW9uIiwiYWRkQ2xhc3MiLCJzaG93SGVscCIsImdldExvY2FsZSIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJhdXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhcHBzIiwiaXNfbmV3X3dpbmRvdyIsImlzTW9iaWxlIiwibG9jYXRpb24iLCJvcGVuV2luZG93Iiwib3BlblVybFdpdGhJRSIsImNtZCIsImV4ZWMiLCJvcGVuX3VybCIsImlzTm9kZSIsIm53IiwicmVxdWlyZSIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicmVkaXJlY3RUb1NpZ25JbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJoYXNGZWF0dXJlIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJjc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJnZXRVc2VyT3JnYW5pemF0aW9ucyIsImlzSW5jbHVkZVBhcmVudHMiLCJvcmdhbml6YXRpb25zIiwicGFyZW50cyIsInNwYWNlX3VzZXIiLCJzcGFjZV91c2VycyIsImZpZWxkcyIsImZsYXR0ZW4iLCJmaW5kIiwiJGluIiwiZmV0Y2giLCJ1bmlvbiIsImZvcmJpZE5vZGVDb250ZXh0bWVudSIsInRhcmdldCIsImlmciIsImRvY3VtZW50IiwiYm9keSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInByZXZlbnREZWZhdWx0IiwibG9hZCIsImlmckJvZHkiLCJjb250ZW50cyIsImlzU2VydmVyIiwiYWRtaW5zIiwiaXNMZWdhbFZlcnNpb24iLCJhcHBfdmVyc2lvbiIsImNoZWNrIiwibW9kdWxlcyIsImlzT3JnQWRtaW5CeU9yZ0lkcyIsIm9yZ0lkcyIsImFsbG93QWNjZXNzT3JncyIsImlzT3JnQWRtaW4iLCJ1c2VPcmdzIiwiZmlsdGVyIiwib3JnIiwidW5pcSIsImlzT3JnQWRtaW5CeUFsbE9yZ0lkcyIsImkiLCJyb290X3VybCIsIlVSTCIsInBhdGhuYW1lIiwiZ2V0QVBJTG9naW5Vc2VyIiwicmVxIiwicmVzIiwicGFzc3dvcmQiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwic2Vzc2lvblN0b3JhZ2UiLCJnZXRDdXJyZW50QXBwSWQiLCJmb3JtYXRJbmRleCIsImFycmF5IiwiaW5kZXhOYW1lIiwiaXNkb2N1bWVudERCIiwib2JqZWN0IiwiYmFja2dyb3VuZCIsImRhdGFzb3VyY2VzIiwiZG9jdW1lbnREQiIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInN0ZWVkb3NBdXRoIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwidXNlclNlc3Npb24iLCJTdHJpbmciLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImdldFJlbGF0aXZlVXJsIiwiYXZhdGFyVXJsIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJwdWJsaXNoIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsImdldF9jb250YWN0c19saW1pdCIsImZyb21zIiwiZnJvbXNDaGlsZHJlbiIsImZyb21zQ2hpbGRyZW5JZHMiLCJpc0xpbWl0IiwibGVuMSIsImxpbWl0IiwibGltaXRzIiwibXlMaXRtaXRPcmdJZHMiLCJteU9yZ0lkIiwibXlPcmdJZHMiLCJteU9yZ3MiLCJvdXRzaWRlX29yZ2FuaXphdGlvbnMiLCJzZXR0aW5nIiwidGVtcElzTGltaXQiLCJ0b09yZ3MiLCJ0b3MiLCJzcGFjZV9zZXR0aW5ncyIsInZhbHVlcyIsImludGVyc2VjdGlvbiIsInNldEtleVZhbHVlIiwiaW5zZXJ0Iiwic2V0VXNlcm5hbWUiLCJzcGFjZVVzZXIiLCJpbnZpdGVfc3RhdGUiLCJnZXRfc3BhY2VfdXNlcl9jb3VudCIsInVzZXJfY291bnRfaW5mbyIsInRvdGFsX3VzZXJfY291bnQiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3JlYXRlX3NlY3JldCIsInJlbW92ZV9zZWNyZXQiLCJ0b2tlbiIsImN1clNwYWNlVXNlciIsIm93cyIsInN5bmNfZGlyZWN0aW9uIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJzZXRTcGFjZVVzZXJQYXNzd29yZCIsInNwYWNlX3VzZXJfaWQiLCJjYW5FZGl0IiwiY2hhbmdlZFVzZXJJbmZvIiwiY29tcGFueUlkcyIsImNvbXBhbnlzIiwiY3VycmVudFVzZXIiLCJsYW5nIiwibG9nb3V0IiwidXNlckNQIiwiY29tcGFueV9pZHMiLCJhbnkiLCJzZXRQYXNzd29yZCIsInNlcnZpY2VzIiwiYmNyeXB0IiwibW9iaWxlX3ZlcmlmaWVkIiwiU01TUXVldWUiLCJzZW5kIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImJpbGxpbmdNYW5hZ2VyIiwiZ2V0X2FjY291bnRpbmdfcGVyaW9kIiwiYWNjb3VudGluZ19tb250aCIsImJpbGxpbmciLCJjb3VudF9kYXlzIiwiZW5kX2RhdGVfdGltZSIsInN0YXJ0X2RhdGVfdGltZSIsIm1vbWVudCIsImZvcm1hdCIsImJpbGxpbmdzIiwidHJhbnNhY3Rpb24iLCJiaWxsaW5nX2RhdGUiLCJnZXREYXRlIiwicmVmcmVzaF9iYWxhbmNlIiwicmVmcmVzaF9kYXRlIiwiYXBwX2JpbGwiLCJiX20iLCJiX21fZCIsImJpbGwiLCJjcmVkaXRzIiwiZGViaXRzIiwibGFzdF9iYWxhbmNlIiwibGFzdF9iaWxsIiwicGF5bWVudF9iaWxsIiwic2V0T2JqIiwiJGx0IiwiYmlsbGluZ19tb250aCIsImJhbGFuY2UiLCJnZXRfYmFsYW5jZSIsInVzZXJfY291bnQiLCJtb2R1bGVfbmFtZSIsImxpc3RwcmljZSIsImFjY291bnRpbmdfZGF0ZSIsImFjY291bnRpbmdfZGF0ZV9mb3JtYXQiLCJkYXlzX251bWJlciIsIm5ld19iaWxsIiwiJGx0ZSIsIl9tYWtlTmV3SUQiLCJnZXRTcGFjZVVzZXJDb3VudCIsInJlY2FjdWxhdGVCYWxhbmNlIiwicmVmcmVzaF9kYXRlcyIsInJfZCIsImdldF9tb2R1bGVzIiwibV9jaGFuZ2Vsb2ciLCJtb2R1bGVzX2NoYW5nZWxvZ3MiLCJjaGFuZ2VfZGF0ZSIsIm9wZXJhdGlvbiIsImdldF9tb2R1bGVzX25hbWUiLCJtb2R1bGVzX25hbWUiLCJjYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoIiwiYV9tIiwibmV3ZXN0X2JpbGwiLCJwZXJpb2RfcmVzdWx0IiwicmVtYWluaW5nX21vbnRocyIsImIiLCJzcGVjaWFsX3BheSIsIm1vZHVsZV9uYW1lcyIsInRvdGFsX2ZlZSIsIm9wZXJhdG9yX2lkIiwibmV3X21vZHVsZXMiLCJzcGFjZV91cGRhdGVfb2JqIiwiZGlmZmVyZW5jZSIsIl9kIiwiaXNfcGFpZCIsInVzZXJfbGltaXQiLCJtY2wiLCJvcGVyYXRvciIsImNyb24iLCJzdGF0aXN0aWNzIiwic2NoZWR1bGUiLCJydWxlIiwiZ29fbmV4dCIsInNjaGVkdWxlSm9iIiwiYmluZEVudmlyb25tZW50IiwidGltZSIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwidGltZUVuZCIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwicyIsImxpc3RwcmljZXMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJkZWZpbmVQcm9wZXJ0eSIsImRlcHRoIiwicmVkdWNlIiwiZmxhdCIsInRvRmxhdHRlbiIsImlzQXJyYXkiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJpbmZvIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFHckJILGdCQUFnQixDQUFDO0FBQ2hCLG1CQUFpQixRQUREO0FBRWhCSSxTQUFPLEVBQUUsUUFGTztBQUdoQixZQUFVLFNBSE07QUFJaEJDLFFBQU0sRUFBRSxRQUpRO0FBS2hCLGdDQUE4QjtBQUxkLENBQUQsRUFNYixjQU5hLENBQWhCLEM7Ozs7Ozs7Ozs7O0FDSEFDLEtBQUssQ0FBQ0MsU0FBTixDQUFnQkMsVUFBaEIsR0FBNkIsVUFBVUMsTUFBVixFQUFrQjtBQUMzQyxNQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1A7QUFDSDs7QUFDRCxNQUFHLENBQUNBLE1BQUosRUFBVztBQUNQQSxVQUFNLEdB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Ukw7QUFTQWxXLGlCQUFhLENBQUMsS0FBRCxFQUFRLE9BQVIsQ0FUYjtBQVVBbVcsa0JBQWMsS0FWZDtBQVdBQyxjQUFVLEtBWFY7QUFZQTlWLGdCQUFZLEVBWlo7QUFhQStWLFVBQU0sS0FiTjtBQWNBQyxlQUFXLElBZFg7QUFlQUMsZUFBVyxJQWZYO0FBZ0JBQyxvQkFBZ0IsVUFBQ25YLFFBQUQsRUFBV3JZLE1BQVg7QUFDZixVQUFBakQsR0FBQSxFQUFBNEssS0FBQTs7QUFBQSxXQUFPM0gsTUFBUDtBQUNDLGVBQU87QUFBQ21ILGVBQUssQ0FBQztBQUFQLFNBQVA7QUNJRzs7QURISlEsY0FBUTBRLFNBQVMxUSxLQUFqQjs7QUFDQSxXQUFPQSxLQUFQO0FBQ0MsYUFBQTBRLFlBQUEsUUFBQXRiLE1BQUFzYixTQUFBb1gsSUFBQSxZQUFBMXlCLElBQW1CZixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDMkwsa0JBQVEwUSxTQUFTb1gsSUFBVCxDQUFjcDBCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBT3NNLEtBQVA7QUFDQyxlQUFPO0FBQUNSLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPa1IsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXG5cdGNvb2tpZXM6IFwiXjAuNi4yXCIsXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxuXHRta2RpcnA6IFwiXjAuMy41XCIsXG5cdFwidXJsLXNlYXJjaC1wYXJhbXMtcG9seWZpbGxcIjogXCJeNy4wLjBcIixcbn0sICdzdGVlZG9zOmJhc2UnKTtcbiIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIGlmICghdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFsb2NhbGUpe1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG4gICAgfVxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxuICAgICAgICB9ZWxzZXtcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcblx0XHR9XG4gICAgfSk7XG59O1xuXG5cbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XG4gICAgICAgIHYucHVzaChtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdjtcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XG4gKi9cbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIGcgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIGcucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnO1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciByID0gbnVsbDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcjtcbn0iLCJTdGVlZG9zID1cblx0c2V0dGluZ3M6IHt9XG5cdGRiOiBkYlxuXHRzdWJzOiB7fVxuXHRpc1Bob25lRW5hYmxlZDogLT5cblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXG5cblx0XHRpZiAhbnVtYmVyXG5cdFx0XHRyZXR1cm4gJyc7XG5cblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxuXHRcdFx0aWYgc2NhbGUgfHwgc2NhbGUgPT0gMFxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xuXHRcdFx0XHRpZiAhKHNjYWxlIHx8IHNjYWxlID09IDApXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXG5cdFx0XHRcdFx0dW5sZXNzIHNjYWxlXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXG5cdFx0XHRcdGlmIHNjYWxlID09IDBcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcblx0XHRcdHJldHVybiBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuIyBpZiBNZXRlb3IuaXNDb3Jkb3ZhXG5pZiBNZXRlb3IuaXNDb3Jkb3ZhIHx8IE1ldGVvci5pc0NsaWVudFxuXHRyb290VXJsID0gTWV0ZW9yLmFic29sdXRlVXJsLmRlZmF1bHRPcHRpb25zLnJvb3RVcmxcblx0aWYgcm9vdFVybC5lbmRzV2l0aCgnLycpXG5cdFx0cm9vdFVybCA9IHJvb3RVcmwuc3Vic3RyKDAsIHJvb3RVcmwubGVuZ3RoIC0gMSlcblxuXHR3aW5kb3cuc3RvcmVzPy5BUEk/LmNsaWVudD8uc2V0VXJsID0gcm9vdFVybFxuXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0Um9vdFVybChyb290VXJsKVxuXHR3aW5kb3dbJ3N0ZWVkb3Muc2V0dGluZyddID0ge1xuXHRcdHJvb3RVcmw6IHJvb3RVcmxcblx0fVxuXG5pZiAhTWV0ZW9yLmlzQ29yZG92YSAmJiBNZXRlb3IuaXNDbGllbnRcblx0IyDphY3nva7mmK/lkKbmlrDnqpflj6PmiZPlvIDnmoTlhajlsYDlj5jph49cblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRIcmVmUG9wdXAoTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udWk/LmhyZWZfcG9wdXApXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XG5cdFx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldFVzZXJJZChTdGVlZG9zLnVzZXJJZCgpKVxuXHRcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRUZW5hbnRJZChTdGVlZG9zLnNwYWNlSWQoKSlcblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuU3RlZWRvcy5pc0V4cHJlc3Npb24gPSAoZnVuYykgLT5cblx0aWYgdHlwZW9mIGZ1bmMgIT0gJ3N0cmluZydcblx0XHRyZXR1cm4gZmFsc2Vcblx0cGF0dGVybiA9IC9ee3soLispfX0kL1xuXHRyZWcxID0gL157eyhmdW5jdGlvbi4rKX19JC9cblx0cmVnMiA9IC9ee3soLis9Pi4rKX19JC9cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZycgYW5kIGZ1bmMubWF0Y2gocGF0dGVybikgYW5kICFmdW5jLm1hdGNoKHJlZzEpIGFuZCAhZnVuYy5tYXRjaChyZWcyKVxuXHRcdHJldHVybiB0cnVlXG5cdGZhbHNlXG5cblN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uID0gKGZ1bmMsIGZvcm1EYXRhLCBkYXRhUGF0aCwgZ2xvYmFsKSAtPlxuXHRnZXRQYXJlbnRQYXRoID0gKHBhdGgpIC0+XG5cdFx0aWYgdHlwZW9mIHBhdGggPT0gJ3N0cmluZydcblx0XHRcdHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJylcblx0XHRcdGlmIHBhdGhBcnIubGVuZ3RoID09IDFcblx0XHRcdFx0cmV0dXJuICcjJ1xuXHRcdFx0cGF0aEFyci5wb3AoKVxuXHRcdFx0cmV0dXJuIHBhdGhBcnIuam9pbignLicpXG5cdFx0cmV0dXJuICcjJ1xuXHRnZXRWYWx1ZUJ5UGF0aCA9IChmb3JtRGF0YSwgcGF0aCkgLT5cblx0XHRpZiBwYXRoID09ICcjJyBvciAhcGF0aFxuXHRcdFx0cmV0dXJuIGZvcm1EYXRhIG9yIHt9XG5cdFx0ZWxzZSBpZiB0eXBlb2YgcGF0aCA9PSAnc3RyaW5nJ1xuXHRcdFx0cmV0dXJuIF8uZ2V0KGZvcm1EYXRhLCBwYXRoKVxuXHRcdGVsc2Vcblx0XHRcdGNvbnNvbGUuZXJyb3IgJ3BhdGggaGFzIHRvIGJlIGEgc3RyaW5nJ1xuXHRcdHJldHVyblxuXHRpZiBmb3JtRGF0YSA9PSB1bmRlZmluZWRcblx0XHRmb3JtRGF0YSA9IHt9XG5cdHBhcmVudFBhdGggPSBnZXRQYXJlbnRQYXRoKGRhdGFQYXRoKVxuXHRwYXJlbnQgPSBnZXRWYWx1ZUJ5UGF0aChmb3JtRGF0YSwgcGFyZW50UGF0aCkgb3Ige31cblx0aWYgdHlwZW9mIGZ1bmMgPT0gJ3N0cmluZydcblx0XHRmdW5jQm9keSA9IGZ1bmMuc3Vic3RyaW5nKDIsIGZ1bmMubGVuZ3RoIC0gMilcblx0XHRnbG9iYWxUYWcgPSAnX19HX0xfT19CX0FfTF9fJ1xuXHRcdHN0ciA9ICdcXG4gICAgcmV0dXJuICcgKyBmdW5jQm9keS5yZXBsYWNlKC9cXGJmb3JtRGF0YVxcYi9nLCBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIGdsb2JhbFRhZykpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBKU09OLnN0cmluZ2lmeShnbG9iYWwpKS5yZXBsYWNlKG5ldyBSZWdFeHAoJ1xcXFxiJyArIGdsb2JhbFRhZyArICdcXFxcYicsICdnJyksICdnbG9iYWwnKS5yZXBsYWNlKC9yb290VmFsdWUvZywgSlNPTi5zdHJpbmdpZnkocGFyZW50KSlcblx0XHR0cnlcblx0XHRcdHJldHVybiBGdW5jdGlvbihzdHIpKClcblx0XHRjYXRjaCBlcnJvclxuXHRcdFx0Y29uc29sZS5sb2cgZXJyb3IsIGZ1bmMsIGRhdGFQYXRoXG5cdFx0XHRyZXR1cm4gZnVuY1xuXHRlbHNlXG5cdFx0cmV0dXJuIGZ1bmNcblx0cmV0dXJuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXG5cdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gKCktPlxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXG5cdFx0aWYgYWNjb3VudEJnQm9keVxuXHRcdFx0cmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0YXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclxuXHRcdCMgaWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdCMgXHRpZiB1cmwgPT0gYXZhdGFyXG5cdFx0IyBcdFx0YXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcblx0XHQjIFx0ZWxzZVxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpfSlcIlxuXHRcdCMgZWxzZVxuXHRcdCMgXHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXG5cdFx0IyBcdGlmIGJhY2tncm91bmRcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHRiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cblx0XHRpZiBpc05lZWRUb0xvY2FsXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsYXZhdGFyKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXG5cblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxuXHRcdGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInNraW5cIn0pXG5cdFx0aWYgYWNjb3VudFNraW5cblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcblx0XHRpZiBhY2NvdW50Wm9vbVxuXHRcdFx0cmV0dXJuIGFjY291bnRab29tLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHRcdGFjY291bnRab29tVmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHRcdGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuXHRcdHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0em9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemVcblx0XHR1bmxlc3Mgem9vbU5hbWVcblx0XHRcdHpvb21OYW1lID0gXCJsYXJnZVwiXG5cdFx0XHR6b29tU2l6ZSA9IDEuMlxuXHRcdGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcblx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdFx0IyBpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXG5cdFx0XHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXG5cdFx0XHQjIFx0XHR6b29tU2l6ZSA9IDBcblx0XHRcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXG5cdFx0XHQjIGVsc2Vcblx0XHRcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHRpZiBpc05lZWRUb0xvY2FsXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRab29tVmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIixhY2NvdW50Wm9vbVZhbHVlLm5hbWUpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cblx0U3RlZWRvcy5zaG93SGVscCA9ICh1cmwpLT5cblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcblxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5cdFx0d2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxuXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXG5cdFx0bGlua2VyID0gXCI/XCJcblxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxuXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdGF1dGhUb2tlbiA9IHt9O1xuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxuXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIHVybFxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcblxuXHRTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXG5cblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblx0XHRpZiAhYXBwXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblx0XHQjIFx0cmV0dXJuXG5cblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xuXHRcdGlmIGFwcC5pc191c2VfaWVcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdGlmIG9uX2NsaWNrXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxuXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxuXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5Ncblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXG5cdFx0XHR0cnlcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRtaW5fbW9udGhzID0gMVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdG1pbl9tb250aHMgPSAzXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXG5cdFx0aWYgc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UuX2lkKSBhbmQgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcblxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHR3aGVuICdub3JtYWwnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcblx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcblxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcblxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcblx0XHRlbHNlXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XG5cdFx0aWYgb2Zmc2V0XG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxuXHRcdERFVklDRSA9XG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXG5cdFx0XHRpcGFkOiAnaXBhZCdcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcblx0XHRcdGlwb2Q6ICdpcG9kJ1xuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xuXHRcdGJyb3dzZXIgPSB7fVxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2Vcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xuXHRcdFx0Jydcblx0XHRcdERFVklDRS5kZXNrdG9wXG5cdFx0XVxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcblxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRyZXR1cm5cblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGlmclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXG5cdFx0XHRpZnIubG9hZCAtPlxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXG5cdFx0XHRcdGlmIGlmckJvZHlcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXG5cblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGNoZWNrID0gZmFsc2Vcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxuXHRcdFx0Y2hlY2sgPSB0cnVlXG5cdFx0cmV0dXJuIGNoZWNrXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHRpc09yZ0FkbWluID0gZmFsc2Vcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcblx0XHRwYXJlbnRzID0gW11cblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxuXHRcdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0aSA9IDBcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRpKytcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxuXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXG5cblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcblxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxuXG5cdFx0XHRpZiAhdXNlclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcblxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB1c2VyXG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdGlmIHVzZXJcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHR0cnlcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdGtleTMyID0gXCJcIlxuXHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0YyA9IFwiXCJcblx0XHRcdGkgPSAwXG5cdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0aSsrXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cblxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxuXG5cdFx0aWYgdXNlclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXG5cblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcblx0XHRcdGlmIG9ialxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXG5cdFx0cmV0dXJuIG51bGxcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxuXHRcdHRyeVxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxuXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cblxubWl4aW4gPSAob2JqKSAtPlxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxuXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cblx0XHRpZiAhZGF0ZVxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxuXHRcdFx0aWYgaSA8IGRheXNcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcblxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxuXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXG5cblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblxuXHRcdGogPSAwXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSAwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcblx0XHRcdFx0aiA9IGxlbi8yXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxuXHRcdFx0aSA9IDBcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxuXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXG5cdFx0XHRcdFx0YnJlYWtcblxuXHRcdFx0XHRpKytcblxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gaSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxuXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxuXG5cdFx0aWYgaiA+IG1heF9pbmRleFxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6Vcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxuXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcblx0XHRcdGlmIGFwcFxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdFx0XHRpID0gMFxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxuXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcblx0XHRcdGlmIGlzSTE4blxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdHJldHVybiBsb2NhbGVcblxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxuXG5cblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXG5cdFx0XHR2YWxpZCA9IHRydWVcblx0XHRcdHVubGVzcyBwd2Rcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXG5cdFx0XHRwYXNzd29yUG9saWN5ID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeVxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XG5cdFx0XHRcdGlmICEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXG4jXHRcdFx0ZWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRpZiB2YWxpZFxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XG5cdGRiQXBwcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChhcHApLT5cblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcblxuXHRyZXR1cm4gZGJBcHBzXG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gKHNwYWNlX2lkKS0+XG5cdGRiRGFzaGJvYXJkcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChkYXNoYm9hcmQpLT5cblx0XHRkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmRcblxuXHRyZXR1cm4gZGJEYXNoYm9hcmRzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxuI1x0XHRlbHNlXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmZvcm1hdEluZGV4ID0gKGFycmF5KSAtPlxuXHRcdG9iamVjdCA9IHtcbiAgICAgICAgXHRiYWNrZ3JvdW5kOiB0cnVlXG4gICAgXHR9O1xuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XG5cdFx0aWYgaXNkb2N1bWVudERCXG5cdFx0XHRpZiBhcnJheS5sZW5ndGggPiAwXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuXHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXG5cdFx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsNTIpO1xuXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZWY0LCByb290VXJsOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciByZWYsIHJlZjEsIHJlZztcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmIChzY2FsZSB8fCBzY2FsZSA9PT0gMCkge1xuICAgICAgICBudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90VGhvdXNhbmRzKSB7XG4gICAgICAgIGlmICghKHNjYWxlIHx8IHNjYWxlID09PSAwKSkge1xuICAgICAgICAgIHNjYWxlID0gKHJlZiA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLykpICE9IG51bGwgPyAocmVmMSA9IHJlZlsxXSkgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGlmICghc2NhbGUpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nO1xuICAgICAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2c7XG4gICAgICAgIH1cbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuaWYgKE1ldGVvci5pc0NvcmRvdmEgfHwgTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIHJvb3RVcmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwuZGVmYXVsdE9wdGlvbnMucm9vdFVybDtcbiAgaWYgKHJvb3RVcmwuZW5kc1dpdGgoJy8nKSkge1xuICAgIHJvb3RVcmwgPSByb290VXJsLnN1YnN0cigwLCByb290VXJsLmxlbmd0aCAtIDEpO1xuICB9XG4gIGlmICgocmVmID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmMSA9IHJlZi5BUEkpICE9IG51bGwpIHtcbiAgICAgIGlmICgocmVmMiA9IHJlZjEuY2xpZW50KSAhPSBudWxsKSB7XG4gICAgICAgIHJlZjIuc2V0VXJsID0gcm9vdFVybDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKChyZWYzID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmNCA9IHJlZjMuU2V0dGluZ3MpICE9IG51bGwpIHtcbiAgICAgIHJlZjQuc2V0Um9vdFVybChyb290VXJsKTtcbiAgICB9XG4gIH1cbiAgd2luZG93WydzdGVlZG9zLnNldHRpbmcnXSA9IHtcbiAgICByb290VXJsOiByb290VXJsXG4gIH07XG59XG5cbmlmICghTWV0ZW9yLmlzQ29yZG92YSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjg7XG4gICAgcmV0dXJuIChyZWY1ID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5TZXR0aW5ncykgIT0gbnVsbCA/IHJlZjYuc2V0SHJlZlBvcHVwKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnVpKSAhPSBudWxsID8gcmVmOC5ocmVmX3BvcHVwIDogdm9pZCAwIDogdm9pZCAwKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjg7XG4gICAgaWYgKChyZWY1ID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgICAgaWYgKChyZWY2ID0gcmVmNS5TZXR0aW5ncykgIT0gbnVsbCkge1xuICAgICAgICByZWY2LnNldFVzZXJJZChTdGVlZG9zLnVzZXJJZCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChyZWY3ID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy5TZXR0aW5ncykgIT0gbnVsbCA/IHJlZjguc2V0VGVuYW50SWQoU3RlZWRvcy5zcGFjZUlkKCkpIDogdm9pZCAwIDogdm9pZCAwO1xuICB9KTtcbn1cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuU3RlZWRvcy5pc0V4cHJlc3Npb24gPSBmdW5jdGlvbihmdW5jKSB7XG4gIHZhciBwYXR0ZXJuLCByZWcxLCByZWcyO1xuICBpZiAodHlwZW9mIGZ1bmMgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHBhdHRlcm4gPSAvXnt7KC4rKX19JC87XG4gIHJlZzEgPSAvXnt7KGZ1bmN0aW9uLispfX0kLztcbiAgcmVnMiA9IC9ee3soLis9Pi4rKX19JC87XG4gIGlmICh0eXBlb2YgZnVuYyA9PT0gJ3N0cmluZycgJiYgZnVuYy5tYXRjaChwYXR0ZXJuKSAmJiAhZnVuYy5tYXRjaChyZWcxKSAmJiAhZnVuYy5tYXRjaChyZWcyKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblN0ZWVkb3MucGFyc2VTaW5nbGVFeHByZXNzaW9uID0gZnVuY3Rpb24oZnVuYywgZm9ybURhdGEsIGRhdGFQYXRoLCBnbG9iYWwpIHtcbiAgdmFyIGVycm9yLCBmdW5jQm9keSwgZ2V0UGFyZW50UGF0aCwgZ2V0VmFsdWVCeVBhdGgsIGdsb2JhbFRhZywgcGFyZW50LCBwYXJlbnRQYXRoLCBzdHI7XG4gIGdldFBhcmVudFBhdGggPSBmdW5jdGlvbihwYXRoKSB7XG4gICAgdmFyIHBhdGhBcnI7XG4gICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgcGF0aEFyciA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICAgIGlmIChwYXRoQXJyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gJyMnO1xuICAgICAgfVxuICAgICAgcGF0aEFyci5wb3AoKTtcbiAgICAgIHJldHVybiBwYXRoQXJyLmpvaW4oJy4nKTtcbiAgICB9XG4gICAgcmV0dXJuICcjJztcbiAgfTtcbiAgZ2V0VmFsdWVCeVBhdGggPSBmdW5jdGlvbihmb3JtRGF0YSwgcGF0aCkge1xuICAgIGlmIChwYXRoID09PSAnIycgfHwgIXBhdGgpIHtcbiAgICAgIHJldHVybiBmb3JtRGF0YSB8fCB7fTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIF8uZ2V0KGZvcm1EYXRhLCBwYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcigncGF0aCBoYXMgdG8gYmUgYSBzdHJpbmcnKTtcbiAgICB9XG4gIH07XG4gIGlmIChmb3JtRGF0YSA9PT0gdm9pZCAwKSB7XG4gICAgZm9ybURhdGEgPSB7fTtcbiAgfVxuICBwYXJlbnRQYXRoID0gZ2V0UGFyZW50UGF0aChkYXRhUGF0aCk7XG4gIHBhcmVudCA9IGdldFZhbHVlQnlQYXRoKGZvcm1EYXRhLCBwYXJlbnRQYXRoKSB8fCB7fTtcbiAgaWYgKHR5cGVvZiBmdW5jID09PSAnc3RyaW5nJykge1xuICAgIGZ1bmNCb2R5ID0gZnVuYy5zdWJzdHJpbmcoMiwgZnVuYy5sZW5ndGggLSAyKTtcbiAgICBnbG9iYWxUYWcgPSAnX19HX0xfT19CX0FfTF9fJztcbiAgICBzdHIgPSAnXFxuICAgIHJldHVybiAnICsgZnVuY0JvZHkucmVwbGFjZSgvXFxiZm9ybURhdGFcXGIvZywgSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBnbG9iYWxUYWcpKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgSlNPTi5zdHJpbmdpZnkoZ2xvYmFsKSkucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcYicgKyBnbG9iYWxUYWcgKyAnXFxcXGInLCAnZycpLCAnZ2xvYmFsJykucmVwbGFjZSgvcm9vdFZhbHVlL2csIEpTT04uc3RyaW5naWZ5KHBhcmVudCkpO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gRnVuY3Rpb24oc3RyKSgpO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZXJyb3IgPSBlcnJvcjE7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvciwgZnVuYywgZGF0YVBhdGgpO1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBmdW5jO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIiwgdXJsKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsIGF2YXRhcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50U2tpbjtcbiAgICBhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJza2luXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFNraW4pIHtcbiAgICAgIHJldHVybiBhY2NvdW50U2tpbi52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tO1xuICAgIGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInpvb21cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50Wm9vbSkge1xuICAgICAgcmV0dXJuIGFjY291bnRab29tLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRab29tVmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgem9vbU5hbWUsIHpvb21TaXplO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgfVxuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcbiAgICB6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZTtcbiAgICB6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZTtcbiAgICBpZiAoIXpvb21OYW1lKSB7XG4gICAgICB6b29tTmFtZSA9IFwibGFyZ2VcIjtcbiAgICAgIHpvb21TaXplID0gMS4yO1xuICAgIH1cbiAgICBpZiAoem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKSkge1xuICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLVwiICsgem9vbU5hbWUpO1xuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIiwgYWNjb3VudFpvb21WYWx1ZS5uYW1lKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIiwgYWNjb3VudFpvb21WYWx1ZS5zaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY1O1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmNSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmNS5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjU7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWY1ID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZjUuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZjUgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY1LnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY2LnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmNyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjdbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjggPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY4W1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWY1LCByZWY2LCByZWY3LCByZWY4LCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZjUgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY1W1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWY2ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNltcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmNyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWY3Ll9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmOCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWY4Ll9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWY1LCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmNSA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWY1LnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciBwYXNzd29yUG9saWN5LCBwYXNzd29yUG9saWN5RXJyb3IsIHJlYXNvbiwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmNiA9IHJlZjUucGFzc3dvcmQpICE9IG51bGwgPyByZWY2LnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9IChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnBhc3N3b3JkKSAhPSBudWxsID8gcmVmOC5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkRhc2hib2FyZHM7XG4gIGRiRGFzaGJvYXJkcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJldHVybiBkYkRhc2hib2FyZHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5mb3JtYXRJbmRleCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGluZGV4TmFtZSwgaXNkb2N1bWVudERCLCBvYmplY3QsIHJlZjUsIHJlZjYsIHJlZjc7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjYgPSByZWY1LmRhdGFzb3VyY2VzKSAhPSBudWxsID8gKHJlZjcgPSByZWY2W1wiZGVmYXVsdFwiXSkgIT0gbnVsbCA/IHJlZjcuZG9jdW1lbnREQiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgZmFsc2U7XG4gICAgaWYgKGlzZG9jdW1lbnREQikge1xuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG4gICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICBpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsIDUyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgTWV0ZW9yLm1ldGhvZHNcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVzaDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRzZXQ6IFxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIF1cblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcbiAgICAgICAgcCA9IG51bGxcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgICAgcCA9IGVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdWxsOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIHBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBcblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXG5cbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxuICAgICAgICAkc2V0OlxuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG5cbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgcmV0dXJuIHt9XG5cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cbiAgICAgICAgc3dhbFxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXG4jIyNcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XG5cdGZyb206IChmdW5jdGlvbigpe1xuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XG5cdH0pKCksXG5cdHJlc2V0UGFzc3dvcmQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0dmVyaWZ5RW1haWw6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdGVucm9sbEFjY291bnQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9XG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XG5cdGlmIChvcmdzLmNvdW50KCk+MClcblx0e1xuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcblx0XHR7XG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cdFxuXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIFx0ZGF0YToge1xuXHQgICAgICBcdHJldDogMCxcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcbiAgICBcdH1cbiAgXHR9KTtcbn0pO1xuXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuXHRcdGlmIHNwYWNlSWRcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuXHRcdHNwYWNlcyA9IFtdXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XG5cdGljb246IFwiZ2xvYmVcIlxuXHRjb2xvcjogXCJibHVlXCJcblx0dGFibGVDb2x1bW5zOiBbXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cblx0XVxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdHJldHVybiB7fVxuXHRzaG93RWRpdENvbHVtbjogZmFsc2Vcblx0c2hvd0RlbENvbHVtbjogZmFsc2Vcblx0ZGlzYWJsZUFkZDogdHJ1ZVxuXHRwYWdlTGVuZ3RoOiAxMDBcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xuICAgIHZhciBrO1xuICAgIGlmIChuID49IDApIHtcbiAgICAgIGsgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuICsgbjtcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cbiAgICB9XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBrKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XG4gICAgICB3d3c6IFxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxuXHRsaXN0Vmlld3MgPSB7fVxuXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcblxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gbGlzdFZpZXdzXG5cblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pXG5cblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblxuXG5cbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xuXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbi8vICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XG4vLyAgICAgfVxuLy8gICB9O1xuLy8gICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcbi8vICAgfTtcbi8vICAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfTtcblxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfSxcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfVxuLy8gICB9KTtcblxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXG4vLyAgIHZhciBhcGkgPSB7XG4vLyAgICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XG4vLyAgICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcbi8vICAgICB9LFxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcblxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG5cbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcbi8vICAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbi8vICAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pXG4vLyAgICAgfVxuLy8gICB9KVxuXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbi8vICAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXG4vLyAgICAgLy8gICB9XG4vLyAgICAgLy8gfSk7XG5cbi8vICAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xuXG4vLyAgICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgfSk7XG5cbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xuXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XG5cbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xuXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcblxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9KTsgIFxuXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXG4vLyAgICAgXy5leHRlbmQoYXBpLCB7XG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcbi8vICAgICAgIH0sXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gYXBpO1xuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcblxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcblxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblx0XHRcblx0XHRpZiAhdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcblxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXG5cblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxuXHRcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IFtdXG5cblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzIClcbiAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuICAgICAgICBpZiAhYXV0aFRva2VuXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3JcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnNcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZVxuICAgICAgICBkYXRhID0gW11cbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucylcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7fVxuIiwidmFyIENvb2tpZXMsIHN0ZWVkb3NBdXRoO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXG5cdGlmIGFwcFxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcblx0ZWxzZVxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXG5cblx0aWYgIXJlZGlyZWN0VXJsXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRyZXMuZW5kKClcblx0XHRyZXR1cm5cblxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XG5cblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcblx0IyBpZiByZXEuYm9keVxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0IyAjIHRoZW4gY2hlY2sgY29va2llXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0aWYgdXNlclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHQjIGRlcy1jYmNcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxuXHRcdFx0a2V5OCA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCA4XG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSA4IC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0am9pbmVyID0gXCI/XCJcblxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxuXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cblxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRyZXMud3JpdGVIZWFkIDQwMVxuXHRyZXMuZW5kKClcblx0cmV0dXJuXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdCMgdGhpcy5wYXJhbXMgPVxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuXHRcdHdpZHRoID0gNTAgO1xuXHRcdGhlaWdodCA9IDUwIDtcblx0XHRmb250U2l6ZSA9IDI4IDtcblx0XHRpZiByZXEucXVlcnkud1xuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcblx0XHRpZiByZXEucXVlcnkuaFxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG5cdFx0aWYgIXVzZXJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9jbGllbnQvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZ1wiKVxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XG5cdFx0aWYgIXVzZXJuYW1lXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXG5cdFx0XHRjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXG5cblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcblx0XHRcdGNvbG9yX2luZGV4ID0gMFxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXG5cdFx0XHQjY29sb3IgPSBcIiNENkRBRENcIlxuXG5cdFx0XHRpbml0aWFscyA9ICcnXG5cdFx0XHRpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxuXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcblxuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cblx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiI3t3aWR0aH1cIiBoZWlnaHQ9XCIje2hlaWdodH1cIiBzdHlsZT1cIndpZHRoOiAje3dpZHRofXB4OyBoZWlnaHQ6ICN7aGVpZ2h0fXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yfTtcIj5cblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cblx0XHRcdFx0XHQje2luaXRpYWxzfVxuXHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuXHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcblx0XHRcdFx0cmVzLndyaXRlSGVhZCAzMDRcblx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aFxuXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXG5cdFx0cmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNvbG9yLCBjb2xvcl9pbmRleCwgY29sb3JzLCBmb250U2l6ZSwgaGVpZ2h0LCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVxTW9kaWZpZWRIZWFkZXIsIHN2ZywgdXNlciwgdXNlcm5hbWUsIHVzZXJuYW1lX2FycmF5LCB3aWR0aDtcbiAgICB3aWR0aCA9IDUwO1xuICAgIGhlaWdodCA9IDUwO1xuICAgIGZvbnRTaXplID0gMjg7XG4gICAgaWYgKHJlcS5xdWVyeS53KSB7XG4gICAgICB3aWR0aCA9IHJlcS5xdWVyeS53O1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmgpIHtcbiAgICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oO1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmZzKSB7XG4gICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcztcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXIpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHVzZXIucHJvZmlsZSkgIT0gbnVsbCA/IHJlZi5hdmF0YXIgOiB2b2lkIDApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyVXJsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgc3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgaWQ9XFxcIkxheWVyXzFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHg9XFxcIjBweFxcXCIgeT1cXFwiMHB4XFxcIlxcblx0IHZpZXdCb3g9XFxcIjAgMCA3MiA3MlxcXCIgc3R5bGU9XFxcImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XFxcIiB4bWw6c3BhY2U9XFxcInByZXNlcnZlXFxcIj5cXG48c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0LnN0MHtmaWxsOiNGRkZGRkY7fVxcblx0LnN0MXtmaWxsOiNEMEQwRDA7fVxcbjwvc3R5bGU+XFxuPGc+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QwXFxcIiBkPVxcXCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelxcXCIvPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxcblx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XFxcIi8+XFxuPC9nPlxcbjxnPlxcblx0PGc+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXFxuXHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elxcXCIvPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XFxuXHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcXFwiLz5cXG5cdDwvZz5cXG48L2c+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSk7XG4gICAgICBjb2xvcl9pbmRleCA9IDA7XG4gICAgICBfLmVhY2godXNlcm5hbWVfYXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcbiAgICAgIH0pO1xuICAgICAgcG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGg7XG4gICAgICBjb2xvciA9IGNvbG9yc1twb3NpdGlvbl07XG4gICAgICBpbml0aWFscyA9ICcnO1xuICAgICAgaWYgKHVzZXJuYW1lLmNoYXJDb2RlQXQoMCkgPiAyNTUpIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKTtcbiAgICAgIHN2ZyA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiIHN0YW5kYWxvbmU9XFxcIm5vXFxcIj8+XFxuPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJub25lXFxcIiB3aWR0aD1cXFwiXCIgKyB3aWR0aCArIFwiXFxcIiBoZWlnaHQ9XFxcIlwiICsgaGVpZ2h0ICsgXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgKyBoZWlnaHQgKyBcInB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGNvbG9yICsgXCI7XFxcIj5cXG5cdDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZm9udC1mYW1pbHk9XFxcIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcInB4O1xcXCI+XFxuXHRcdFwiICsgaW5pdGlhbHMgKyBcIlxcblx0PC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZjEgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMS50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYyID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjIudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdFx0YWNjZXNzX3Rva2VuID0gcmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcblx0XHRcdHJlcy53cml0ZUhlYWQgMjAwXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ2FwcHMnLCAoc3BhY2VJZCktPlxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcbiAgICAgICAgXG5cbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XG4gICAgICAgIGlmIHNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge3NvcnQ6IHtzb3J0OiAxfX0pO1xuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcblxuXHQjIHB1Ymxpc2ggdXNlcnMgc3BhY2VzXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXG5cdFx0c2VsZiA9IHRoaXM7XG5cdFx0dXNlclNwYWNlcyA9IFtdXG5cdFx0c3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9LCB7ZmllbGRzOiB7c3BhY2U6MX19KVxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcblxuXHRcdGhhbmRsZTIgPSBudWxsXG5cblx0XHQjIG9ubHkgcmV0dXJuIHVzZXIgam9pbmVkIHNwYWNlcywgYW5kIG9ic2VydmVzIHdoZW4gdXNlciBqb2luIG9yIGxlYXZlIGEgc3BhY2Vcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRpZiBkb2Muc3BhY2Vcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXG5cdFx0XHRcdFx0XHRvYnNlcnZlU3BhY2VzKClcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcblxuXHRcdG9ic2VydmVTcGFjZXMgPSAtPlxuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcblx0XHRcdGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiB7JGluOiB1c2VyU3BhY2VzfX0pLm9ic2VydmVcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XG5cdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5faWQpXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xuXHRcdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xuXG5cdFx0c2VsZi5yZWFkeSgpO1xuXG5cdFx0c2VsZi5vblN0b3AgLT5cblx0XHRcdGhhbmRsZS5zdG9wKCk7XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ215X3NwYWNlcycsIGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlLCBoYW5kbGUyLCBvYnNlcnZlU3BhY2VzLCBzZWxmLCBzdXMsIHVzZXJTcGFjZXM7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICB1c2VyU3BhY2VzID0gW107XG4gIHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xuICBzdXMuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpO1xuICB9KTtcbiAgaGFuZGxlMiA9IG51bGw7XG4gIGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgaWYgKGRvYy5zcGFjZSkge1xuICAgICAgICBpZiAodXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwKSB7XG4gICAgICAgICAgdXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSk7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmVTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICBpZiAob2xkRG9jLnNwYWNlKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2Muc3BhY2UpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVTcGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdXNlclNwYWNlc1xuICAgICAgfVxuICAgIH0pLm9ic2VydmUoe1xuICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgICBzZWxmLmFkZGVkKFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goZG9jLl9pZCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2hhbmdlZChcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2MpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLl9pZCk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBvYnNlcnZlU3BhY2VzKCk7XG4gIHNlbGYucmVhZHkoKTtcbiAgcmV0dXJuIHNlbGYub25TdG9wKGZ1bmN0aW9uKCkge1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIHJldHVybiBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIjIHB1Ymxpc2ggc29tZSBvbmUgc3BhY2UncyBhdmF0YXJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxuXHR1bmxlc3Mgc3BhY2VJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcbiIsIk1ldGVvci5wdWJsaXNoKCdzcGFjZV9hdmF0YXInLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLnNwYWNlcy5maW5kKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgYXZhdGFyOiAxLFxuICAgICAgbmFtZTogMSxcbiAgICAgIGVuYWJsZV9yZWdpc3RlcjogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdtb2R1bGVzJywgKCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHVubGVzcyBfaWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4unRydWXooajnpLrpmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4fojIPlm7TvvIxvcmdhbml6YXRpb25z5YC86K6w5b2V6aKd5aSW55qE57uE57uH6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xuXHRcdGNoZWNrIHNwYWNlLCBTdHJpbmdcblx0XHRyZVZhbHVlID1cblx0XHRcdGlzTGltaXQ6IHRydWVcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXG5cdFx0bGltaXRzID0gc2V0dGluZz8udmFsdWVzIHx8IFtdO1xuXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxuXHRcdFx0bXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHVzZXJzOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdHVubGVzcyBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRcdFxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBbXVxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXG5cdFx0XHRcdHRvcyA9IGxpbWl0LnRvc1xuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxuXHRcdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0XHRpZiBmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XG5cdFx0XHRcdFx0XHRpc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcblxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHQjIOWmguaenOWPl+mZkOeahOe7hOe7h+S4quaVsOWwj+S6jueUqOaIt+aJgOWxnue7hOe7h+eahOS4quaVsO+8jOWImeivtOaYjuW9k+WJjeeUqOaIt+iHs+WwkeacieS4gOS4que7hOe7h+aYr+S4jeWPl+mZkOeahFxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRcdGVsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblxuXHRcdGlmIGlzTGltaXRcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ5bGe5LqO55So5oi35omA5bGe57uE57uH55qE5a2Q5a2Z6IqC54K555qE6IqC54K55Yig6ZmkXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSBhbmQgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDFcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXHRcdHJldHVybiByZVZhbHVlXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjaGVjayhrZXksIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xuXG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xuICAgICAgICBvYmoua2V5ID0ga2V5O1xuICAgICAgICBvYmoudmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xuICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KSIsIk1ldGVvci5tZXRob2RzXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuXG5cdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpIGFuZCB1c2VyX2lkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxuXG5cdFx0aWYgbm90IE1ldGVvci51c2VySWQoKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXG5cblx0XHR1bmxlc3MgdXNlcl9pZFxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcblxuXHRcdHJldHVybiB1c2VybmFtZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXG5cblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXG5cblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xuXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXG5cbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXG5cbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkLCAkb3I6IFt7IHN5bmNfZGlyZWN0aW9uOiB7ICRleGlzdHM6IGZhbHNlIH19LCB7IHN5bmNfZGlyZWN0aW9uOiB7ICRpbjogWydib3RoJywgJ29ial90b19pbnMnXX19XSB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEgfSB9KS5mZXRjaCgpXG4gICAgICAgIF8uZWFjaCBvd3MsKG8pIC0+XG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxuICAgICAgICAgICAgaWYgZmxcbiAgICAgICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcbiAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xuICAgICAgICAgICAgICAgIGlmIHBlcm1zXG4gICAgICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuXG4gICAgICAgIG93cyA9IG93cy5maWx0ZXIgKG4pLT5cbiAgICAgICAgICAgIHJldHVybiBuLmZsb3dfbmFtZVxuXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5bmNfZGlyZWN0aW9uOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHN5bmNfZGlyZWN0aW9uOiB7XG4gICAgICAgICAgICAkaW46IFsnYm90aCcsICdvYmpfdG9faW5zJ11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBwZXJtczogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmbCkge1xuICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgICBwZXJtcyA9IGZsLnBlcm1zO1xuICAgICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSBfLnNvbWUob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG93cyA9IG93cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uZmxvd19uYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBvd3M7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0U3BhY2VVc2VyUGFzc3dvcmQ6IChzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIC0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIilcblx0XHRcblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cdFx0dXNlcklkID0gdGhpcy51c2VySWRcblx0XHRjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT0gdXNlcklkXG5cdFx0dW5sZXNzIGNhbkVkaXRcblx0XHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxuXHRcdFx0aXNTcGFjZUFkbWluID0gc3BhY2U/LmFkbWlucz8uaW5jbHVkZXModGhpcy51c2VySWQpXG5cdFx0XHRjYW5FZGl0ID0gaXNTcGFjZUFkbWluXG5cblx0XHRjb21wYW55SWRzID0gc3BhY2VVc2VyLmNvbXBhbnlfaWRzXG5cdFx0aWYgIWNhbkVkaXQgJiYgY29tcGFueUlkcyAmJiBjb21wYW55SWRzLmxlbmd0aFxuXHRcdFx0IyDnu4Tnu4fnrqHnkIblkZjkuZ/og73kv67mlLnlr4bnoIFcblx0XHRcdGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtfaWQ6IHsgJGluOiBjb21wYW55SWRzIH0sIHNwYWNlOiBzcGFjZV9pZCB9LCB7ZmllbGRzOiB7IGFkbWluczogMSB9fSkuZmV0Y2goKVxuXHRcdFx0aWYgY29tcGFueXMgYW5kIGNvbXBhbnlzLmxlbmd0aFxuXHRcdFx0XHRjYW5FZGl0ID0gXy5hbnkgY29tcGFueXMsIChpdGVtKSAtPlxuXHRcdFx0XHRcdHJldHVybiBpdGVtLmFkbWlucyAmJiBpdGVtLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPiAtMVxuXG5cdFx0dW5sZXNzIGNhbkVkaXRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKVxuXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXG5cblx0XHRTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cdFx0bG9nb3V0ID0gdHJ1ZTtcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7bG9nb3V0OiBsb2dvdXR9KVxuXHRcdGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0aWYgY2hhbmdlZFVzZXJJbmZvXG5cdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskcHVzaDogeydzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogY2hhbmdlZFVzZXJJbmZvLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0fX0pXG5cblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxuXHRcdGlmIHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZFxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIHVzZXJDUC5sb2NhbGUgaXMgJ3poLWNuJ1xuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xuXHRcdFx0U01TUXVldWUuc2VuZFxuXHRcdFx0XHRGb3JtYXQ6ICdKU09OJyxcblx0XHRcdFx0QWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG5cdFx0XHRcdFBhcmFtU3RyaW5nOiAnJyxcblx0XHRcdFx0UmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuXHRcdFx0XHRTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG5cdFx0XHRcdFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG5cdFx0XHRcdG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2FuRWRpdCwgY2hhbmdlZFVzZXJJbmZvLCBjb21wYW55SWRzLCBjb21wYW55cywgY3VycmVudFVzZXIsIGlzU3BhY2VBZG1pbiwgbGFuZywgbG9nb3V0LCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcklkLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT09IHVzZXJJZDtcbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGNhbkVkaXQgPSBpc1NwYWNlQWRtaW47XG4gICAgfVxuICAgIGNvbXBhbnlJZHMgPSBzcGFjZVVzZXIuY29tcGFueV9pZHM7XG4gICAgaWYgKCFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBjb21wYW55SWRzXG4gICAgICAgIH0sXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGlmIChjb21wYW55cyAmJiBjb21wYW55cy5sZW5ndGgpIHtcbiAgICAgICAgY2FuRWRpdCA9IF8uYW55KGNvbXBhbnlzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uYWRtaW5zICYmIGl0ZW0uYWRtaW5zLmluZGV4T2YodXNlcklkKSA+IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjYW5FZGl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgbG9nb3V0ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy51c2VySWQgPT09IHVzZXJfaWQpIHtcbiAgICAgIGxvZ291dCA9IGZhbHNlO1xuICAgIH1cbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge1xuICAgICAgbG9nb3V0OiBsb2dvdXRcbiAgICB9KTtcbiAgICBjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGlmIChjaGFuZ2VkVXNlckluZm8pIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgfSwge1xuICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogKHJlZjEgPSBjaGFuZ2VkVXNlckluZm8uc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGFzc3dvcmQpICE9IG51bGwgPyByZWYyLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBTTVNRdWV1ZS5zZW5kKHtcbiAgICAgICAgRm9ybWF0OiAnSlNPTicsXG4gICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuICAgICAgICBQYXJhbVN0cmluZzogJycsXG4gICAgICAgIFJlY051bTogdXNlckNQLm1vYmlsZSxcbiAgICAgICAgU2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuICAgICAgICBUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuICAgICAgICBtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XG5cbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxuIyBhY2NvdW50aW5nX21vbnRoIOe7k+eul+aciO+8jOagvOW8j++8mllZWVlNTVxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdGNvdW50X2RheXMgPSAwXG5cblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcblxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxuXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcblx0XHQjIGRvIG5vdGhpbmdcblx0ZWxzZSBpZiBzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgYW5kIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cblxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XG5cdGxhc3RfYmlsbCA9IG51bGxcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcblxuXHQjIOiOt+WPluato+W4uOS7mOasvueahOWwj+S6jnJlZnJlc2hfZGF0ZeeahOacgOi/keeahOS4gOadoeiusOW9lVxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGNyZWF0ZWQ6IHtcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcblx0XHRcdH0sXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGlmIHBheW1lbnRfYmlsbFxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxuXHRlbHNlXG5cdFx0IyDojrflj5bmnIDmlrDnmoTnu5PnrpfnmoTkuIDmnaHorrDlvZVcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRzb3J0OiB7XG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdFx0aWYgYXBwX2JpbGxcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXG5cblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxuXHRjcmVkaXRzID0gaWYgYmlsbC5jcmVkaXRzIHRoZW4gYmlsbC5jcmVkaXRzIGVsc2UgMC4wXG5cdHNldE9iaiA9IG5ldyBPYmplY3Rcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcblxuIyDnu5PnrpflvZPmnIjnmoTmlK/lh7rkuI7kvZnpop1cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKVxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblxuXHRkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzL2RheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxuXHRuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKClcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXG5cdG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdG5ld19iaWxsLmNyZWF0ZWQgPSBub3dcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XG5cdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0e1xuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XG5cdFx0fVxuXHQpLmZvckVhY2ggKGJpbGwpLT5cblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxuXG5cdGlmIHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0bW9kdWxlcyA9IG5ldyBBcnJheVxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxuXHRcdFx0XHRjaGFuZ2VfZGF0ZToge1xuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXG5cdFx0XHR9XG5cdFx0KVxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXG5cdFx0aWYgbm90IG1fY2hhbmdlbG9nXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJxpbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5a6J6KOF77yM5Zug5q2k6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJx1bmluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Lljbjovb3vvIzlm6DmraTkuI3orqHnrpfotLnnlKhcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcblx0XHRcdCMgIGRvIG5vdGhpbmdcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRl4omlc3RhcnRkYXRl77yM6K+05piO5b2T5pyI5YaF5Y+R55Sf6L+H5a6J6KOF5oiW5Y246L2955qE5pON5L2c77yM6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXG5cdHJldHVybiBtb2R1bGVzXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSAoKS0+XG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XG5cdFx0bW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKVxuXHQpXG5cdHJldHVybiBtb2R1bGVzX25hbWVcblxuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdGlmIGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHRyZXR1cm5cblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZGViaXRzID0gMFxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHRcdHtcblx0XHRcdFx0YmlsbGluZ19kYXRlOiBiX20sXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KS5mb3JFYWNoKChiKS0+XG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcblx0XHQpXG5cdFx0bmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWR9LCB7c29ydDoge21vZGlmaWVkOiAtMX19KVxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcblx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0aWYgZGViaXRzID4gMFxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxuXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXG5cdFx0XHR7XG5cdFx0XHRcdF9pZDogc3BhY2VfaWRcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0ZWxzZVxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0aWYgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT0gMFxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxuXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0XHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxuXHRcdFx0bW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XG5cdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKVxuXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKVxuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxuXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcblxuXHRtID0gbW9tZW50KClcblx0bm93ID0gbS5fZFxuXG5cdHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0XG5cblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxuXHRpZiBzcGFjZS5pc19wYWlkIGlzbnQgdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxuXG5cdCMg5pu05pawbW9kdWxlc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vd1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxuXHRzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxuXHRpZiByXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XG5cdFx0XHRtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKVxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcblx0XHRcdG1jbC5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcblx0XHRcdG1jbC5jcmVhdGVkID0gbm93XG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcblxuXHRyZXR1cm4iLCIgICAgICAgICAgICAgICAgICAgXG5cbmJpbGxpbmdNYW5hZ2VyID0ge307XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBiaWxsaW5nLCBjb3VudF9kYXlzLCBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgZmlyc3RfZGF0ZSwgc3RhcnRfZGF0ZSwgc3RhcnRfZGF0ZV90aW1lO1xuICBjb3VudF9kYXlzID0gMDtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwiXG4gIH0pO1xuICBmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGU7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEgLSBlbmRfZGF0ZV90aW1lLmdldERhdGUoKSk7XG4gIGlmIChmaXJzdF9kYXRlID49IGVuZF9kYXRlKSB7XG5cbiAgfSBlbHNlIGlmIChzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgJiYgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH0gZWxzZSBpZiAoZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFwiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzXG4gIH07XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKSB7XG4gIHZhciBhcHBfYmlsbCwgYl9tLCBiX21fZCwgYmlsbCwgY3JlZGl0cywgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgcGF5bWVudF9iaWxsLCBzZXRPYmo7XG4gIGxhc3RfYmlsbCA9IG51bGw7XG4gIGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDogcmVmcmVzaF9kYXRlXG4gIH0pO1xuICBwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDoge1xuICAgICAgJGx0OiByZWZyZXNoX2RhdGVcbiAgICB9LFxuICAgIGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgaWYgKHBheW1lbnRfYmlsbCkge1xuICAgIGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbDtcbiAgfSBlbHNlIHtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICBhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgYmlsbGluZ19tb250aDogYl9tXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoYXBwX2JpbGwpIHtcbiAgICAgIGxhc3RfYmlsbCA9IGFwcF9iaWxsO1xuICAgIH1cbiAgfVxuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgZGViaXRzID0gYmlsbC5kZWJpdHMgPyBiaWxsLmRlYml0cyA6IDAuMDtcbiAgY3JlZGl0cyA9IGJpbGwuY3JlZGl0cyA/IGJpbGwuY3JlZGl0cyA6IDAuMDtcbiAgc2V0T2JqID0gbmV3IE9iamVjdDtcbiAgc2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogYmlsbC5faWRcbiAgfSwge1xuICAgICRzZXQ6IHNldE9ialxuICB9KTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpIHtcbiAgdmFyIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgZGF5c19udW1iZXIsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIG5ld19iaWxsLCBub3c7XG4gIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKTtcbiAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICBkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzIC8gZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSk7XG4gIGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBiaWxsaW5nX2RhdGU6IHtcbiAgICAgICRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgbm93ID0gbmV3IERhdGU7XG4gIG5ld19iaWxsID0gbmV3IE9iamVjdDtcbiAgbmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpO1xuICBuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aDtcbiAgbmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdDtcbiAgbmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZDtcbiAgbmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZTtcbiAgbmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlO1xuICBuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgbmV3X2JpbGwuZGViaXRzID0gZGViaXRzO1xuICBuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBuZXdfYmlsbC5jcmVhdGVkID0gbm93O1xuICBuZXdfYmlsbC5tb2RpZmllZCA9IG5vdztcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkuY291bnQoKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZnJlc2hfZGF0ZXM7XG4gIHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXk7XG4gIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgIGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAkaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl1cbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGJpbGwpIHtcbiAgICByZXR1cm4gcmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZCk7XG4gIH0pO1xuICBpZiAocmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWZyZXNoX2RhdGVzLCBmdW5jdGlvbihyX2QpIHtcbiAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBtb2R1bGVzLCBzdGFydF9kYXRlO1xuICBtb2R1bGVzID0gbmV3IEFycmF5O1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBtX2NoYW5nZWxvZztcbiAgICBtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG1vZHVsZTogbS5uYW1lLFxuICAgICAgY2hhbmdlX2RhdGU6IHtcbiAgICAgICAgJGx0ZTogZW5kX2RhdGVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH0pO1xuICAgIGlmICghbV9jaGFuZ2Vsb2cpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJpbnN0YWxsXCIpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcInVuaW5zdGFsbFwiKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGUpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXM7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtb2R1bGVzX25hbWU7XG4gIG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlc19uYW1lO1xufTtcblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciBhX20sIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgYl9tLCBiX21fZCwgYmFsYW5jZSwgZGViaXRzLCBtb2R1bGVzLCBtb2R1bGVzX25hbWUsIG5ld2VzdF9iaWxsLCBwZXJpb2RfcmVzdWx0LCByZW1haW5pbmdfbW9udGhzLCB1c2VyX2NvdW50O1xuICBpZiAoYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWNjb3VudGluZ19tb250aCA9PT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIGRlYml0cyA9IDA7XG4gICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICAgIGJpbGxpbmdfZGF0ZTogYl9tLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBkZWJpdHMgKz0gYi5kZWJpdHM7XG4gICAgfSk7XG4gICAgbmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2U7XG4gICAgcmVtYWluaW5nX21vbnRocyA9IDA7XG4gICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICBpZiAoZGViaXRzID4gMCkge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZSAvIGRlYml0cykgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBiYWxhbmNlOiBiYWxhbmNlLFxuICAgICAgICBcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgaWYgKHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09PSAwKSB7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgICAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgZGIuYmlsbGluZ3MucmVtb3ZlKHtcbiAgICAgICAgYmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChtb2R1bGVzLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSBmdW5jdGlvbihzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICB2YXIgbSwgbW9kdWxlcywgbmV3X21vZHVsZXMsIG5vdywgciwgc3BhY2UsIHNwYWNlX3VwZGF0ZV9vYmo7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXk7XG4gIG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcyk7XG4gIG0gPSBtb21lbnQoKTtcbiAgbm93ID0gbS5fZDtcbiAgc3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3Q7XG4gIGlmIChzcGFjZS5pc19wYWlkICE9PSB0cnVlKSB7XG4gICAgc3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZTtcbiAgICBzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZTtcbiAgfVxuICBzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3c7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZDtcbiAgc3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKTtcbiAgc3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzcGFjZV91cGRhdGVfb2JqXG4gIH0pO1xuICBpZiAocikge1xuICAgIF8uZWFjaChuZXdfbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICB2YXIgbWNsO1xuICAgICAgbWNsID0gbmV3IE9iamVjdDtcbiAgICAgIG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpO1xuICAgICAgbWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkO1xuICAgICAgbWNsLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCI7XG4gICAgICBtY2wubW9kdWxlID0gbW9kdWxlO1xuICAgICAgbWNsLmNyZWF0ZWQgPSBub3c7XG4gICAgICByZXR1cm4gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpO1xuICAgIH0pO1xuICB9XG59O1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XG5cbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXG4gICAgdmFyIHJ1bGUgPSBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzO1xuXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xuXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWdvX25leHQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcblxuICAgICAgY29uc29sZS50aW1lKCdzdGF0aXN0aWNzJyk7XG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgIHZhciBkYXRla2V5ID0gXCJcIitkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrKGRhdGUuZ2V0TW9udGgoKSsxKStcIi1cIisoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICByZXR1cm4gZGF0ZWtleTtcbiAgICAgIH07XG4gICAgICAvLyDorqHnrpfliY3kuIDlpKnml7bpl7RcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxuICAgICAgICB2YXIgZEJlZm9yZSA9IG5ldyBEYXRlKGROb3cuZ2V0VGltZSgpIC0gMjQqMzYwMCoxMDAwKTsgICAvL+W+l+WIsOWJjeS4gOWkqeeahOaXtumXtFxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcbiAgICAgIH07XG4gICAgICAvLyDnu5/orqHlvZPml6XmlbDmja5cbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaAu+aVsFxuICAgICAgdmFyIHN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6IHNwYWNlW1wib3duZXJcIl19KTtcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGxhc3RMb2dvbiA9IDA7XG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcbiAgICAgICAgICB2YXIgdXNlciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjpzVXNlcltcInVzZXJcIl19KTtcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvYmogPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGxpbWl0OiAxfSk7XG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXG4gICAgICAgICAgdmFyIG1vZCA9IG9iakFyclswXS5tb2RpZmllZDtcbiAgICAgICAgICByZXR1cm4gbW9kO1xuICAgICAgfTtcbiAgICAgIC8vIOaWh+eroOmZhOS7tuWkp+Wwj1xuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6cG9zdFtcIl9pZFwiXX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSkgIFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cbiAgICAgIHZhciBkYWlseVBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xuICAgICAgICBkYi5zdGVlZG9zX3N0YXRpc3RpY3MuaW5zZXJ0KHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxuICAgICAgICAgIGJhbGFuY2U6IHNwYWNlW1wiYmFsYW5jZVwiXSxcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHN0ZWVkb3M6e1xuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGxhc3RfbG9nb246IGxhc3RMb2dvbihkYi51c2Vycywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3b3JrZmxvdzp7XG4gICAgICAgICAgICBmbG93czogc3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19wb3NpdGlvbnM6IHN0YXRpY3NDb3VudChkYi5mbG93X3Bvc2l0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZmxvd3M6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNtczoge1xuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzOiBzdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgY29tbWVudHM6IHN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2NvbW1lbnRzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS50aW1lRW5kKCdzdGF0aXN0aWNzJyk7XG5cbiAgICAgIGdvX25leHQgPSB0cnVlO1xuXG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogc3RhdGlzdGljcy5qcycpO1xuICAgICAgY29uc29sZS5sb2coZS5zdGFjayk7XG4gICAgfSkpO1xuXG4gIH1cblxufSlcblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAxXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhID0ge3BhcmVudDogcGFyZW50X2lkLCBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSwgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLCBzcGFjZTogc3BhY2VfaWQsIGluc3RhbmNlOiBpbnN0YW5jZV9pZCwgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXX1cbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxuICAgICAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGZpZWxkczoge3NwYWNlOiAxLCBhdHRhY2htZW50czogMX19KS5mb3JFYWNoIChpbnMpIC0+XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcblxuICAgICAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3Uub3JnYW5pemF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OScsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAyIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvcmdhbml6YXRpb246IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAzXG4gICAgICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7ZW1haWw6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7dXNlcjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge2VtYWlsOiBhZGRyZXNzfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDMsXG4gICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMyB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHVzZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgYWRkcmVzcywgdTtcbiAgICAgICAgICBpZiAoc3UudXNlcikge1xuICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHN1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAzIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDRcbiAgICAgICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJ1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDQsXG4gICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgc29ydF9ubzoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAxMDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA0IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDVcblx0XHRuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCdcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0XHR0cnlcblxuXHRcdFx0XHRkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaCAoc3UpLT5cblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0aWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggaXMgMVxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHN1LnNwYWNlLCBwYXJlbnQ6IG51bGx9KVxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcblx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcyA9IFtdXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxuXHRcdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcylcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNlxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0XHR0cnlcblx0XHRcdFx0IyDmuIXnqbptb2R1bGVz6KGoXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMlxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMThcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG5cdFx0XHRcdH0pXG5cblxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdFx0XHRcdFx0c2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gMFxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe25hbWU6IHBtfSlcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZS8obGlzdHByaWNlcyp1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDFcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXG5cblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcblx0XHRcdFx0XHRcdHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyB1cGdyYWRlXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBzdGFydF9kYXRlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm1vZHVsZXMucmVtb3ZlKHt9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMS4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAyXG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAzLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiA2LjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICAgIGlzX3BhaWQ6IHRydWUsXG4gICAgICAgICAgdXNlcl9saW1pdDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHZhciBiYWxhbmNlLCBlLCBlbmRfZGF0ZSwgbGlzdHByaWNlcywgbW9udGhzLCBzZXRfb2JqLCB1c2VyX2NvdW50O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRfb2JqID0ge307XG4gICAgICAgICAgICB1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzLl9pZCxcbiAgICAgICAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gICAgICAgICAgICBiYWxhbmNlID0gcy5iYWxhbmNlO1xuICAgICAgICAgICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgICAgICAgIGxpc3RwcmljZXMgPSAwO1xuICAgICAgICAgICAgICBfLmVhY2gocy5tb2R1bGVzLCBmdW5jdGlvbihwbSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUubGlzdHByaWNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlIC8gKGxpc3RwcmljZXMgKiB1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDE7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgIGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFsYW5jZSA8PSAwKSB7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIik7XG4gICAgICAgICAgICBzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcy5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDogc2V0X29ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHMuX2lkKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2V0X29iaik7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyB1cGdyYWRlXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA2IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG4gICAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgICAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgICAgfVxuXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmxcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkwiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJvb3RVUkw7XG4gIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMgPSB7XG4gICAgICBcImNyZWF0b3JcIjoge1xuICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XG4gICAgICBcInVybFwiOiByb290VVJMXG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCkge1xuICAgIHJldHVybiBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMO1xuICB9XG59KTtcbiIsImlmKHByb2Nlc3MuZW52LkNSRUFUT1JfTk9ERV9FTlYgPT0gJ2RldmVsb3BtZW50Jyl7XG5cdC8vTWV0ZW9yIOeJiOacrOWNh+e6p+WIsDEuOSDlj4rku6XkuIrml7Yobm9kZSDniYjmnKwgMTErKe+8jOWPr+S7peWIoOmZpOatpOS7o+eggVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmxhdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oZGVwdGggPSAxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWR1Y2UoZnVuY3Rpb24gKGZsYXQsIHRvRmxhdHRlbikge1xuXHRcdFx0XHRyZXR1cm4gZmxhdC5jb25jYXQoKEFycmF5LmlzQXJyYXkodG9GbGF0dGVuKSAmJiAoZGVwdGg+MSkpID8gdG9GbGF0dGVuLmZsYXQoZGVwdGgtMSkgOiB0b0ZsYXR0ZW4pO1xuXHRcdFx0fSwgW10pO1xuXHRcdH1cblx0fSk7XG59IiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRuZXcgVGFidWxhci5UYWJsZVxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxuXHRcdGNvbHVtbnM6IFtcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZVxuXHRcdFx0fVxuXHRcdF1cblx0XHRkb206IFwidHBcIlxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2Vcblx0XHRvcmRlcmluZzogZmFsc2Vcblx0XHRwYWdlTGVuZ3RoOiAxMFxuXHRcdGluZm86IGZhbHNlXG5cdFx0c2VhcmNoaW5nOiB0cnVlXG5cdFx0YXV0b1dpZHRoOiB0cnVlXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxuXHRcdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
