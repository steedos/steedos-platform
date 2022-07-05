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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsInJlZiIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyb290VXJsIiwic2V0dGluZ3MiLCJkYiIsInN1YnMiLCJpc1Bob25lRW5hYmxlZCIsIk1ldGVvciIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiYWJzb2x1dGVVcmwiLCJkZWZhdWx0T3B0aW9ucyIsImVuZHNXaXRoIiwic3Vic3RyIiwid2luZG93Iiwic3RvcmVzIiwiQVBJIiwiY2xpZW50Iiwic2V0VXJsIiwiU2V0dGluZ3MiLCJzZXRSb290VXJsIiwic3RhcnR1cCIsInJlZjUiLCJyZWY2IiwicmVmNyIsInJlZjgiLCJzZXRIcmVmUG9wdXAiLCJ1aSIsImhyZWZfcG9wdXAiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzRXhwcmVzc2lvbiIsImZ1bmMiLCJwYXR0ZXJuIiwicmVnMSIsInJlZzIiLCJwYXJzZVNpbmdsZUV4cHJlc3Npb24iLCJmb3JtRGF0YSIsImRhdGFQYXRoIiwiZ2xvYmFsIiwiZXJyb3IiLCJmdW5jQm9keSIsImdldFBhcmVudFBhdGgiLCJnZXRWYWx1ZUJ5UGF0aCIsImdsb2JhbFRhZyIsInBhcmVudCIsInBhcmVudFBhdGgiLCJwYXRoIiwicGF0aEFyciIsInNwbGl0IiwicG9wIiwiam9pbiIsIl8iLCJnZXQiLCJjb25zb2xlIiwiSlNPTiIsInN0cmluZ2lmeSIsIkZ1bmN0aW9uIiwiZXJyb3IxIiwibG9nIiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwidXJsIiwibG9nZ2luZ0luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiZ2V0QWNjb3VudFNraW5WYWx1ZSIsImFjY291bnRTa2luIiwiZ2V0QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tIiwiYXBwbHlBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb21WYWx1ZSIsInpvb21OYW1lIiwiem9vbVNpemUiLCJzaXplIiwiJCIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInJlZGlyZWN0VG9TaWduSW4iLCJGbG93Um91dGVyIiwiZ28iLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJtZXNzYWdlIiwic3RhY2siLCJzZXQiLCJjaGVja1NwYWNlQmFsYW5jZSIsInNwYWNlSWQiLCJlbmRfZGF0ZSIsIm1pbl9tb250aHMiLCJzcGFjZSIsImlzU3BhY2VBZG1pbiIsInNwYWNlcyIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiY3NzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJmbGF0dGVuIiwiZmluZCIsIiRpbiIsImZldGNoIiwidW5pb24iLCJmb3JiaWROb2RlQ29udGV4dG1lbnUiLCJ0YXJnZXQiLCJpZnIiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJwcmV2ZW50RGVmYXVsdCIsImxvYWQiLCJpZnJCb2R5IiwiY29udGVudHMiLCJpc1NlcnZlciIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsImNvb2tpZXMiLCJwYXNzd29yZCIsInJlc3VsdCIsInVzZXJuYW1lIiwicXVlcnkiLCJ1c2VycyIsInN0ZWVkb3NfaWQiLCJfY2hlY2tQYXNzd29yZCIsIkVycm9yIiwiY2hlY2tBdXRoVG9rZW4iLCJoZWFkZXJzIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJhcmdzIiwiX3dyYXBwZWQiLCJhcmd1bWVudHMiLCJjYWxsIiwiaXNIb2xpZGF5IiwiZGF0ZSIsImRheSIsImdldERheSIsImNhY3VsYXRlV29ya2luZ1RpbWUiLCJkYXlzIiwiY2FjdWxhdGVEYXRlIiwicGFyYW1fZGF0ZSIsImdldFRpbWUiLCJjYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSIsIm5leHQiLCJjYWN1bGF0ZWRfZGF0ZSIsImZpcnN0X2RhdGUiLCJqIiwibWF4X2luZGV4Iiwic2Vjb25kX2RhdGUiLCJzdGFydF9kYXRlIiwidGltZV9wb2ludHMiLCJyZW1pbmQiLCJpc0VtcHR5Iiwic2V0SG91cnMiLCJob3VyIiwic2V0TWludXRlcyIsIm1pbnV0ZSIsImV4dGVuZCIsImdldFN0ZWVkb3NUb2tlbiIsImFwcElkIiwibm93Iiwic2VjcmV0Iiwic3RlZWRvc190b2tlbiIsInBhcnNlSW50IiwiaXNJMThuIiwiY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eSIsIiRyZWdleCIsIl9lc2NhcGVSZWdFeHAiLCJ0cmltIiwidmFsaWRhdGVQYXNzd29yZCIsInB3ZCIsInBhc3N3b3JQb2xpY3kiLCJwYXNzd29yUG9saWN5RXJyb3IiLCJyZWFzb24iLCJyZWYxMCIsInJlZjkiLCJ2YWxpZCIsInBvbGljeSIsInBvbGljeUVycm9yIiwicG9saWN5ZXJyb3IiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0REJEYXNoYm9hcmRzIiwiZGJEYXNoYm9hcmRzIiwiZGFzaGJvYXJkIiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZvcmVpZ25fa2V5IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJyZWZlcmVuY2VzIiwibWV0aG9kcyIsInVwZGF0ZVVzZXJMYXN0TG9nb24iLCIkc2V0IiwibGFzdF9sb2dvbiIsIm9uTG9naW4iLCJ1c2Vyc19hZGRfZW1haWwiLCJlbWFpbCIsImNvdW50IiwiZW1haWxzIiwiZGlyZWN0IiwiJHB1c2giLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJ1c2Vyc19yZW1vdmVfZW1haWwiLCJwIiwiJHB1bGwiLCJ1c2Vyc192ZXJpZnlfZW1haWwiLCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbCIsInByaW1hcnkiLCJtdWx0aSIsInNob3dDYW5jZWxCdXR0b24iLCJjbG9zZU9uQ29uZmlybSIsImFuaW1hdGlvbiIsImlucHV0VmFsdWUiLCJ1cGRhdGVVc2VyQXZhdGFyIiwiZW1haWxUZW1wbGF0ZXMiLCJkZWZhdWx0RnJvbSIsInJlc2V0UGFzc3dvcmQiLCJzdWJqZWN0Iiwic3BsaXRzIiwidG9rZW5Db2RlIiwiZ3JlZXRpbmciLCJwcm9maWxlIiwidG9rZW5fY29kZSIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZCIsIm9yZ3MiLCJmdWxsbmFtZSIsIiRuZSIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwicmV0IiwibXNnIiwiUHVzaCIsIkNvbmZpZ3VyZSIsInNlbmRlcklEIiwiQU5EUk9JRF9TRU5ERVJfSUQiLCJzb3VuZCIsInZpYnJhdGUiLCJpb3MiLCJiYWRnZSIsImNsZWFyQmFkZ2UiLCJhbGVydCIsImFwcE5hbWUiLCJTZWxlY3RvciIsInNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluIiwic2VsZWN0b3IiLCJpc19jbG91ZGFkbWluIiwibWFwIiwibiIsInNlbGVjdG9yQ2hlY2tTcGFjZSIsInUiLCJiaWxsaW5nX3BheV9yZWNvcmRzIiwiYWRtaW5Db25maWciLCJpY29uIiwiY29sb3IiLCJ0YWJsZUNvbHVtbnMiLCJleHRyYUZpZWxkcyIsInJvdXRlckFkbWluIiwicGFpZCIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsImRpc2FibGVBZGQiLCJwYWdlTGVuZ3RoIiwib3JkZXIiLCJzcGFjZV91c2VyX3NpZ25zIiwiQWRtaW5Db25maWciLCJjb2xsZWN0aW9uc19hZGQiLCJzZWFyY2hFbGVtZW50IiwiTyIsImN1cnJlbnRFbGVtZW50Iiwid2Vic2VydmljZXMiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwic3RlZWRvc0F1dGgiLCJhbGxvd19tb2RlbHMiLCJtb2RlbCIsIm9wdGlvbnMiLCJ1c2VyU2Vzc2lvbiIsIlN0cmluZyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZ2V0UmVsYXRpdmVVcmwiLCJhdmF0YXJVcmwiLCJmaWxlIiwid3JpdGUiLCJpdGVtIiwiY2hhckNvZGVBdCIsInRvVXBwZXJDYXNlIiwidG9VVENTdHJpbmciLCJyZWFkU3RyZWFtIiwicGlwZSIsInB1Ymxpc2giLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwic3luY19kaXJlY3Rpb24iLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsInNldFNwYWNlVXNlclBhc3N3b3JkIiwic3BhY2VfdXNlcl9pZCIsImNhbkVkaXQiLCJjaGFuZ2VkVXNlckluZm8iLCJjb21wYW55SWRzIiwiY29tcGFueXMiLCJjdXJyZW50VXNlciIsImxhbmciLCJsb2dvdXQiLCJ1c2VyQ1AiLCJjb21wYW55X2lkcyIsImFueSIsInNldFBhc3N3b3JkIiwiYWxnb3JpdGhtIiwiZGlnZXN0Iiwic2VydmljZXMiLCJiY3J5cHQiLCJtb2JpbGVfdmVyaWZpZWQiLCJTTVNRdWV1ZSIsInNlbmQiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIlJlY051bSIsIlNpZ25OYW1lIiwiVGVtcGxhdGVDb2RlIiwiYmlsbGluZ01hbmFnZXIiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJhY2NvdW50aW5nX21vbnRoIiwiYmlsbGluZyIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwibW9tZW50IiwiZm9ybWF0IiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwidXNlcl9jb3VudCIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsInNwZWNpYWxfcGF5IiwibW9kdWxlX25hbWVzIiwidG90YWxfZmVlIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJpc19wYWlkIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJ0aW1lIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsImRhaWx5UG9zdHNBdHRhY2htZW50cyIsInN0ZWVkb3Nfc3RhdGlzdGljcyIsInNwYWNlX25hbWUiLCJvd25lcl9uYW1lIiwic3RlZWRvcyIsIndvcmtmbG93IiwiZmxvd3MiLCJmb3JtcyIsImZsb3dfcm9sZXMiLCJmbG93X3Bvc2l0aW9ucyIsImluc3RhbmNlcyIsImluc3RhbmNlc19sYXN0X21vZGlmaWVkIiwiZGFpbHlfZmxvd3MiLCJkYWlseV9mb3JtcyIsImRhaWx5X2luc3RhbmNlcyIsImNtcyIsInNpdGVzIiwiY21zX3NpdGVzIiwiY21zX3Bvc3RzIiwicG9zdHNfbGFzdF9tb2RpZmllZCIsInBvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJjb21tZW50cyIsImNtc19jb21tZW50cyIsImRhaWx5X3NpdGVzIiwiZGFpbHlfcG9zdHMiLCJkYWlseV9jb21tZW50cyIsImRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJ0aW1lRW5kIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJzIiwibGlzdHByaWNlcyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwicm9vdFVSTCIsImNyZWF0b3IiLCJwcm9jZXNzIiwiZW52IiwiQ1JFQVRPUl9OT0RFX0VOViIsImRlZmluZVByb3BlcnR5IiwiZGVwdGgiLCJyZWR1Y2UiLCJmbGF0IiwidG9GbGF0dGVuIiwiaXNBcnJheSIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsImluZm8iLCJzZWFyY2hpbmciLCJhdXRvV2lkdGgiLCJjaGFuZ2VTZWxlY3RvciIsIiRhbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQixZQUFVO0FBRk0sQ0FBRCxFQUdiLGNBSGEsQ0FBaEIsQzs7Ozs7Ozs7Ozs7QUNIQUksS0FBSyxDQUFDQyxTQUFOLENBQWdCQyxVQUFoQixHQUE2QixVQUFVQyxNQUFWLEVBQWtCO0FBQzNDLE1BQUksQ0FBQyxJQUFMLEVBQVc7QUFDUDtBQUNIOztBQUNELE1BQUcsQ0FBQ0EsTUFBSixFQUFXO0FBQ1BBLFVBQU0sR0FBR0MsT0FBTyxDQUFDRCxNQUFSLEVBQVQ7QUFDSDs7QUFDRCxPQUFLRSxJQUFMLENBQVUsVUFBVUMsRUFB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LENBQW5DLENBQVI7QUFGRjtBQ1FJOztBRExKLFdBQU9tTSxLQUFQO0FBQ0MsZUFBTztBQUFDVCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBT3VSLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcbn0sICdzdGVlZG9zOmJhc2UnKTtcbiIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIGlmICghdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFsb2NhbGUpe1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG4gICAgfVxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxuICAgICAgICB9ZWxzZXtcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcblx0XHR9XG4gICAgfSk7XG59O1xuXG5cbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XG4gICAgICAgIHYucHVzaChtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdjtcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XG4gKi9cbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIGcgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIGcucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnO1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciByID0gbnVsbDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcjtcbn0iLCJTdGVlZG9zID1cblx0c2V0dGluZ3M6IHt9XG5cdGRiOiBkYlxuXHRzdWJzOiB7fVxuXHRpc1Bob25lRW5hYmxlZDogLT5cblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXG5cblx0XHRpZiAhbnVtYmVyXG5cdFx0XHRyZXR1cm4gJyc7XG5cblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxuXHRcdFx0aWYgc2NhbGUgfHwgc2NhbGUgPT0gMFxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xuXHRcdFx0XHRpZiAhKHNjYWxlIHx8IHNjYWxlID09IDApXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXG5cdFx0XHRcdFx0dW5sZXNzIHNjYWxlXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXG5cdFx0XHRcdGlmIHNjYWxlID09IDBcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcblx0XHRcdHJldHVybiBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuIyBpZiBNZXRlb3IuaXNDb3Jkb3ZhXG5pZiBNZXRlb3IuaXNDb3Jkb3ZhIHx8IE1ldGVvci5pc0NsaWVudFxuXHRyb290VXJsID0gTWV0ZW9yLmFic29sdXRlVXJsLmRlZmF1bHRPcHRpb25zLnJvb3RVcmxcblx0aWYgcm9vdFVybC5lbmRzV2l0aCgnLycpXG5cdFx0cm9vdFVybCA9IHJvb3RVcmwuc3Vic3RyKDAsIHJvb3RVcmwubGVuZ3RoIC0gMSlcblxuXHR3aW5kb3cuc3RvcmVzPy5BUEk/LmNsaWVudD8uc2V0VXJsKHJvb3RVcmwpXG5cdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRSb290VXJsKHJvb3RVcmwpXG5cdHdpbmRvd1snc3RlZWRvcy5zZXR0aW5nJ10gPSB7XG5cdFx0cm9vdFVybDogcm9vdFVybFxuXHR9XG5cbmlmICFNZXRlb3IuaXNDb3Jkb3ZhICYmIE1ldGVvci5pc0NsaWVudFxuXHQjIOmFjee9ruaYr+WQpuaWsOeql+WPo+aJk+W8gOeahOWFqOWxgOWPmOmHj1xuXHRNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdFx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldEhyZWZQb3B1cChNZXRlb3Iuc2V0dGluZ3MucHVibGljPy51aT8uaHJlZl9wb3B1cClcblxuIyBpZiBNZXRlb3IuaXNDbGllbnRcblx0IyBNZXRlb3IuYXV0b3J1biAoKS0+XG5cdCMgXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0VXNlcklkKFN0ZWVkb3MudXNlcklkKCkpXG5cdCMgXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0VGVuYW50SWQoU3RlZWRvcy5zcGFjZUlkKCkpXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IChsb2NhbGUpLT5cblx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcblx0cmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblN0ZWVkb3MuaXNFeHByZXNzaW9uID0gKGZ1bmMpIC0+XG5cdGlmIHR5cGVvZiBmdW5jICE9ICdzdHJpbmcnXG5cdFx0cmV0dXJuIGZhbHNlXG5cdHBhdHRlcm4gPSAvXnt7KC4rKX19JC9cblx0cmVnMSA9IC9ee3soZnVuY3Rpb24uKyl9fSQvXG5cdHJlZzIgPSAvXnt7KC4rPT4uKyl9fSQvXG5cdGlmIHR5cGVvZiBmdW5jID09ICdzdHJpbmcnIGFuZCBmdW5jLm1hdGNoKHBhdHRlcm4pIGFuZCAhZnVuYy5tYXRjaChyZWcxKSBhbmQgIWZ1bmMubWF0Y2gocmVnMilcblx0XHRyZXR1cm4gdHJ1ZVxuXHRmYWxzZVxuXG5TdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbiA9IChmdW5jLCBmb3JtRGF0YSwgZGF0YVBhdGgsIGdsb2JhbCkgLT5cblx0Z2V0UGFyZW50UGF0aCA9IChwYXRoKSAtPlxuXHRcdGlmIHR5cGVvZiBwYXRoID09ICdzdHJpbmcnXG5cdFx0XHRwYXRoQXJyID0gcGF0aC5zcGxpdCgnLicpXG5cdFx0XHRpZiBwYXRoQXJyLmxlbmd0aCA9PSAxXG5cdFx0XHRcdHJldHVybiAnIydcblx0XHRcdHBhdGhBcnIucG9wKClcblx0XHRcdHJldHVybiBwYXRoQXJyLmpvaW4oJy4nKVxuXHRcdHJldHVybiAnIydcblx0Z2V0VmFsdWVCeVBhdGggPSAoZm9ybURhdGEsIHBhdGgpIC0+XG5cdFx0aWYgcGF0aCA9PSAnIycgb3IgIXBhdGhcblx0XHRcdHJldHVybiBmb3JtRGF0YSBvciB7fVxuXHRcdGVsc2UgaWYgdHlwZW9mIHBhdGggPT0gJ3N0cmluZydcblx0XHRcdHJldHVybiBfLmdldChmb3JtRGF0YSwgcGF0aClcblx0XHRlbHNlXG5cdFx0XHRjb25zb2xlLmVycm9yICdwYXRoIGhhcyB0byBiZSBhIHN0cmluZydcblx0XHRyZXR1cm5cblx0aWYgZm9ybURhdGEgPT0gdW5kZWZpbmVkXG5cdFx0Zm9ybURhdGEgPSB7fVxuXHRwYXJlbnRQYXRoID0gZ2V0UGFyZW50UGF0aChkYXRhUGF0aClcblx0cGFyZW50ID0gZ2V0VmFsdWVCeVBhdGgoZm9ybURhdGEsIHBhcmVudFBhdGgpIG9yIHt9XG5cdGlmIHR5cGVvZiBmdW5jID09ICdzdHJpbmcnXG5cdFx0ZnVuY0JvZHkgPSBmdW5jLnN1YnN0cmluZygyLCBmdW5jLmxlbmd0aCAtIDIpXG5cdFx0Z2xvYmFsVGFnID0gJ19fR19MX09fQl9BX0xfXydcblx0XHRzdHIgPSAnXFxuICAgIHJldHVybiAnICsgZnVuY0JvZHkucmVwbGFjZSgvXFxiZm9ybURhdGFcXGIvZywgSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpLnJlcGxhY2UoL1xcYmdsb2JhbFxcYi9nLCBnbG9iYWxUYWcpKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgSlNPTi5zdHJpbmdpZnkoZ2xvYmFsKSkucmVwbGFjZShuZXcgUmVnRXhwKCdcXFxcYicgKyBnbG9iYWxUYWcgKyAnXFxcXGInLCAnZycpLCAnZ2xvYmFsJykucmVwbGFjZSgvcm9vdFZhbHVlL2csIEpTT04uc3RyaW5naWZ5KHBhcmVudCkpXG5cdFx0dHJ5XG5cdFx0XHRyZXR1cm4gRnVuY3Rpb24oc3RyKSgpXG5cdFx0Y2F0Y2ggZXJyb3Jcblx0XHRcdGNvbnNvbGUubG9nIGVycm9yLCBmdW5jLCBkYXRhUGF0aFxuXHRcdFx0cmV0dXJuIGZ1bmNcblx0ZWxzZVxuXHRcdHJldHVybiBmdW5jXG5cdHJldHVyblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxuXHRcdGlmIGFjY291bnRCZ0JvZHlcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcblx0XHQjIGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHQjIFx0aWYgdXJsID09IGF2YXRhclxuXHRcdCMgXHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcblx0XHQjIGVsc2Vcblx0XHQjIFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxuXHRcdCMgXHRpZiBiYWNrZ3JvdW5kXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxuXHRcdGlmIGFjY291bnRTa2luXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXG5cdFx0aWYgYWNjb3VudFpvb21cblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcblx0XHR6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXG5cdFx0dW5sZXNzIHpvb21OYW1lXG5cdFx0XHR6b29tTmFtZSA9IFwibGFyZ2VcIlxuXHRcdFx0em9vbVNpemUgPSAxLjJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXG5cdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxuXHRcdFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxuXHRcdFx0IyBlbHNlXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcblxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblxuXHRcdGxpbmtlciA9IFwiP1wiXG5cblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0bGlua2VyID0gXCImXCJcblxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG5cblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblxuXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cdFx0aWYgIWFwcFxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcblx0XHRcdHJldHVyblxuXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cdFx0IyBcdHJldHVyblxuXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcblx0XHRpZiBhcHAuaXNfdXNlX2llXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRpZiBvbl9jbGlja1xuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcblxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcblxuXHRcdGVsc2UgaWYgb25fY2xpY2tcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0bWluX21vbnRocyA9IDFcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRtaW5fbW9udGhzID0gM1xuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxuXHRcdGlmIHNwYWNlICYmIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXG5cblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XG5cdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXG5cblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXG5cblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XG5cdFx0ZWxzZVxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxuXHRcdGlmIG9mZnNldFxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcblxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cblx0XHRERVZJQ0UgPVxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xuXHRcdFx0aXBhZDogJ2lwYWQnXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXG5cdFx0XHRpcG9kOiAnaXBvZCdcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcblx0XHRicm93c2VyID0ge31cblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcblx0XHRcdCcnXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxuXHRcdF1cblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXG5cblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBpZnJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxuXHRcdFx0aWZyLmxvYWQgLT5cblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxuXHRcdFx0XHRpZiBpZnJCb2R5XG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxuXHRcdHJldHVybiBmYWxzZTtcblxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxuXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRjaGVjayA9IGZhbHNlXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcblx0XHRcdGNoZWNrID0gdHJ1ZVxuXHRcdHJldHVybiBjaGVja1xuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXG5cdFx0cGFyZW50cyA9IFtdXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cblx0XHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGkgPSAwXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxuXHRcdFx0XHRicmVha1xuXHRcdFx0aSsrXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxuXHRcdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcblx0XHRcdGVsc2Vcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcblxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cblxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxuXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXG5cblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcblxuXHRcdFx0aWYgIXVzZXJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXG5cblx0XHRcdGlmIHJlc3VsdC5lcnJvclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdXNlclxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRpZiB1c2VyXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0dHJ5XG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXHRcdGNhdGNoIGVcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHRrZXkzMiA9IFwiXCJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0aWYgbGVuIDwgMzJcblx0XHRcdGMgPSBcIlwiXG5cdFx0XHRpID0gMFxuXHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdGkrK1xuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XG5cblx0XHRpZiAhYWNjZXNzX3Rva2VuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcblxuXHRcdGlmIHVzZXJcblx0XHRcdHJldHVybiB1c2VySWRcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxuXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXG5cdFx0XHRpZiBvYmpcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxuXHRcdHJldHVybiBudWxsXG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcblxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhdGNoIGVcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXG5cbm1peGluID0gKG9iaikgLT5cblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcblxuI21peGluKF9zLmV4cG9ydHMoKSlcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XG5cdFx0aWYgIWRhdGVcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdHJldHVybiBmYWxzZVxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cblx0XHRcdGlmIGkgPCBkYXlzXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcblx0XHRcdHJldHVyblxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxuXHRcdHJldHVybiBwYXJhbV9kYXRlXG5cblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7Rcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cblxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxuXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cblx0XHRqID0gMFxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gMFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXG5cdFx0XHRcdGogPSBsZW4vMlxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcblx0XHRcdGkgPSAwXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcblxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxuXHRcdFx0XHRcdGJyZWFrXG5cblx0XHRcdFx0aSsrXG5cblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IGkgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcblxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcblxuXHRcdGlmIGogPiBtYXhfaW5kZXhcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcblxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Xy5leHRlbmQgU3RlZWRvcyxcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXG5cdFx0XHRpZiBhcHBcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRcdFx0aSA9IDBcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdFx0XHRpKytcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cblxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXG5cdFx0XHRpZiBpc0kxOG5cblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRyZXR1cm4gbG9jYWxlXG5cblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcblxuXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxuXHRcdFx0dmFsaWQgPSB0cnVlXG5cdFx0XHR1bmxlc3MgcHdkXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcblxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcblx0XHRcdHBhc3N3b3JQb2xpY3lFcnJvciA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lFcnJvciB8fCBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5ZXJyb3IgfHwgXCLlr4bnoIHkuI3nrKblkIjop4TliJlcIlxuXHRcdFx0aWYgcGFzc3dvclBvbGljeVxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxuXHRcdFx0XHRcdHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHZhbGlkID0gdHJ1ZVxuI1x0XHRcdGVsc2VcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0aWYgdmFsaWRcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxuXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxuXHRkYkFwcHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoYXBwKS0+XG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXG5cblx0cmV0dXJuIGRiQXBwc1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IChzcGFjZV9pZCktPlxuXHRkYkRhc2hib2FyZHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoZGFzaGJvYXJkKS0+XG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXG5cblx0cmV0dXJuIGRiRGFzaGJvYXJkc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxuXHRcdHJldHVybiBhdXRoVG9rZW5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5hdXRvcnVuICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcbiNcdFx0ZWxzZVxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cblx0XHRvYmplY3QgPSB7XG4gICAgICAgIFx0YmFja2dyb3VuZDogdHJ1ZVxuICAgIFx0fTtcblx0XHRpc2RvY3VtZW50REIgPSBNZXRlb3Iuc2V0dGluZ3M/LmRhdGFzb3VyY2VzPy5kZWZhdWx0Py5kb2N1bWVudERCIHx8IGZhbHNlO1xuXHRcdGlmIGlzZG9jdW1lbnREQlxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxuXHRcdFx0XHRpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcblx0XHRcdFx0b2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKVxuXHRcdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLDUyKTtcblxuXHRcdHJldHVybiBvYmplY3Q7IiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW4sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcm9vdFVybDsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpIHtcbiAgICB2YXIgcmVmLCByZWYxLCByZWc7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoc2NhbGUgfHwgc2NhbGUgPT09IDApIHtcbiAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSk7XG4gICAgICB9XG4gICAgICBpZiAoIW5vdFRob3VzYW5kcykge1xuICAgICAgICBpZiAoIShzY2FsZSB8fCBzY2FsZSA9PT0gMCkpIHtcbiAgICAgICAgICBzY2FsZSA9IChyZWYgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMV0pICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZztcbiAgICAgICAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cbmlmIChNZXRlb3IuaXNDb3Jkb3ZhIHx8IE1ldGVvci5pc0NsaWVudCkge1xuICByb290VXJsID0gTWV0ZW9yLmFic29sdXRlVXJsLmRlZmF1bHRPcHRpb25zLnJvb3RVcmw7XG4gIGlmIChyb290VXJsLmVuZHNXaXRoKCcvJykpIHtcbiAgICByb290VXJsID0gcm9vdFVybC5zdWJzdHIoMCwgcm9vdFVybC5sZW5ndGggLSAxKTtcbiAgfVxuICBpZiAoKHJlZiA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuQVBJKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjIgPSByZWYxLmNsaWVudCkgIT0gbnVsbCkge1xuICAgICAgICByZWYyLnNldFVybChyb290VXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKChyZWYzID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmNCA9IHJlZjMuU2V0dGluZ3MpICE9IG51bGwpIHtcbiAgICAgIHJlZjQuc2V0Um9vdFVybChyb290VXJsKTtcbiAgICB9XG4gIH1cbiAgd2luZG93WydzdGVlZG9zLnNldHRpbmcnXSA9IHtcbiAgICByb290VXJsOiByb290VXJsXG4gIH07XG59XG5cbmlmICghTWV0ZW9yLmlzQ29yZG92YSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjg7XG4gICAgcmV0dXJuIChyZWY1ID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5TZXR0aW5ncykgIT0gbnVsbCA/IHJlZjYuc2V0SHJlZlBvcHVwKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnVpKSAhPSBudWxsID8gcmVmOC5ocmVmX3BvcHVwIDogdm9pZCAwIDogdm9pZCAwKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgfSk7XG59XG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cblN0ZWVkb3MuaXNFeHByZXNzaW9uID0gZnVuY3Rpb24oZnVuYykge1xuICB2YXIgcGF0dGVybiwgcmVnMSwgcmVnMjtcbiAgaWYgKHR5cGVvZiBmdW5jICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBwYXR0ZXJuID0gL157eyguKyl9fSQvO1xuICByZWcxID0gL157eyhmdW5jdGlvbi4rKX19JC87XG4gIHJlZzIgPSAvXnt7KC4rPT4uKyl9fSQvO1xuICBpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnICYmIGZ1bmMubWF0Y2gocGF0dGVybikgJiYgIWZ1bmMubWF0Y2gocmVnMSkgJiYgIWZ1bmMubWF0Y2gocmVnMikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5TdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKGZ1bmMsIGZvcm1EYXRhLCBkYXRhUGF0aCwgZ2xvYmFsKSB7XG4gIHZhciBlcnJvciwgZnVuY0JvZHksIGdldFBhcmVudFBhdGgsIGdldFZhbHVlQnlQYXRoLCBnbG9iYWxUYWcsIHBhcmVudCwgcGFyZW50UGF0aCwgc3RyO1xuICBnZXRQYXJlbnRQYXRoID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIHZhciBwYXRoQXJyO1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgICBpZiAocGF0aEFyci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuICcjJztcbiAgICAgIH1cbiAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgICByZXR1cm4gcGF0aEFyci5qb2luKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiAnIyc7XG4gIH07XG4gIGdldFZhbHVlQnlQYXRoID0gZnVuY3Rpb24oZm9ybURhdGEsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJyMnIHx8ICFwYXRoKSB7XG4gICAgICByZXR1cm4gZm9ybURhdGEgfHwge307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBfLmdldChmb3JtRGF0YSwgcGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3BhdGggaGFzIHRvIGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuICB9O1xuICBpZiAoZm9ybURhdGEgPT09IHZvaWQgMCkge1xuICAgIGZvcm1EYXRhID0ge307XG4gIH1cbiAgcGFyZW50UGF0aCA9IGdldFBhcmVudFBhdGgoZGF0YVBhdGgpO1xuICBwYXJlbnQgPSBnZXRWYWx1ZUJ5UGF0aChmb3JtRGF0YSwgcGFyZW50UGF0aCkgfHwge307XG4gIGlmICh0eXBlb2YgZnVuYyA9PT0gJ3N0cmluZycpIHtcbiAgICBmdW5jQm9keSA9IGZ1bmMuc3Vic3RyaW5nKDIsIGZ1bmMubGVuZ3RoIC0gMik7XG4gICAgZ2xvYmFsVGFnID0gJ19fR19MX09fQl9BX0xfXyc7XG4gICAgc3RyID0gJ1xcbiAgICByZXR1cm4gJyArIGZ1bmNCb2R5LnJlcGxhY2UoL1xcYmZvcm1EYXRhXFxiL2csIEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgZ2xvYmFsVGFnKSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIEpTT04uc3RyaW5naWZ5KGdsb2JhbCkpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXGInICsgZ2xvYmFsVGFnICsgJ1xcXFxiJywgJ2cnKSwgJ2dsb2JhbCcpLnJlcGxhY2UoL3Jvb3RWYWx1ZS9nLCBKU09OLnN0cmluZ2lmeShwYXJlbnQpKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEZ1bmN0aW9uKHN0cikoKTtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IsIGZ1bmMsIGRhdGFQYXRoKTtcbiAgICAgIHJldHVybiBmdW5jO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgY21kLCBlLCBldmFsRnVuU3RyaW5nLCBleGVjLCBvbl9jbGljaywgb3Blbl91cmwsIHBhdGg7XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwKSB7XG4gICAgICBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25fY2xpY2sgPSBhcHAub25fY2xpY2s7XG4gICAgaWYgKGFwcC5pc191c2VfaWUpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgaWYgKG9uX2NsaWNrKSB7XG4gICAgICAgICAgcGF0aCA9IFwiYXBpL2FwcC9zc28vXCIgKyBhcHBfaWQgKyBcIj9hdXRoVG9rZW49XCIgKyAoQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSkgKyBcIiZ1c2VySWQ9XCIgKyAoTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmw7XG4gICAgICAgIH1cbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybCkpIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oYXBwLnVybCk7XG4gICAgfSBlbHNlIGlmIChhcHAuaXNfdXNlX2lmcmFtZSkge1xuICAgICAgaWYgKGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKTtcbiAgICAgIH0gZWxzZSBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbl9jbGljaykge1xuICAgICAgZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7XCIgKyBvbl9jbGljayArIFwifSkoKVwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChldmFsRnVuU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSArIFwiXFxyXFxuXCIgKyBlLnN0YWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgfVxuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2spIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBlbmRfZGF0ZSwgbWluX21vbnRocywgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgfVxuICAgIG1pbl9tb250aHMgPSAxO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICBtaW5fbW9udGhzID0gMztcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBlbmRfZGF0ZSA9IHNwYWNlICE9IG51bGwgPyBzcGFjZS5lbmRfZGF0ZSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2UgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjU7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNoZWNrID0gZmFsc2U7XG4gICAgbW9kdWxlcyA9IChyZWY1ID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCkpICE9IG51bGwgPyByZWY1Lm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmNTtcbiAgICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgICBwYXJlbnRzID0gXy51bmlvbihwYXJlbnRzLCBvcmcucGFyZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHJlZjUgPSBvcmcuYWRtaW5zKSAhPSBudWxsID8gcmVmNS5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWY1LCByZWY2LCByZWY3LCByZWY4LCByZXN1bHQsIHVzZXIsIHVzZXJJZCwgdXNlcm5hbWU7XG4gICAgdXNlcm5hbWUgPSAocmVmNSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjUudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmNiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjYucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWY3ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmN1tcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmOCA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjhbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHVzZXJJZDtcbiAgICB1c2VySWQgPSAocmVmNSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjVbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY2W1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWY3ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjcuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWY4ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjguX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZjUsIHNlY29uZF9kYXRlLCBzdGFydF9kYXRlLCB0aW1lX3BvaW50cztcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICB0aW1lX3BvaW50cyA9IChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZCkgIT0gbnVsbCA/IHJlZjUudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHBhc3N3b3JQb2xpY3ksIHBhc3N3b3JQb2xpY3lFcnJvciwgcmVhc29uLCByZWYxMCwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgcmVmOSwgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZjUgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmNiA9IHJlZjUucGFzc3dvcmQpICE9IG51bGwgPyByZWY2LnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9ICgocmVmNyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWY4ID0gcmVmNy5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjgucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDApIHx8ICgocmVmOSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxMCA9IHJlZjkucGFzc3dvcmQpICE9IG51bGwgPyByZWYxMC5wb2xpY3llcnJvciA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgXCLlr4bnoIHkuI3nrKblkIjop4TliJlcIjtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkRhc2hib2FyZHM7XG4gIGRiRGFzaGJvYXJkcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJldHVybiBkYkRhc2hib2FyZHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5mb3JtYXRJbmRleCA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGluZGV4TmFtZSwgaXNkb2N1bWVudERCLCBvYmplY3QsIHJlZjUsIHJlZjYsIHJlZjc7XG4gICAgb2JqZWN0ID0ge1xuICAgICAgYmFja2dyb3VuZDogdHJ1ZVxuICAgIH07XG4gICAgaXNkb2N1bWVudERCID0gKChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjYgPSByZWY1LmRhdGFzb3VyY2VzKSAhPSBudWxsID8gKHJlZjcgPSByZWY2W1wiZGVmYXVsdFwiXSkgIT0gbnVsbCA/IHJlZjcuZG9jdW1lbnREQiA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMCkgfHwgZmFsc2U7XG4gICAgaWYgKGlzZG9jdW1lbnREQikge1xuICAgICAgaWYgKGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG4gICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuICAgICAgICBpZiAoaW5kZXhOYW1lLmxlbmd0aCA+IDUyKSB7XG4gICAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWUuc3Vic3RyaW5nKDAsIDUyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgTWV0ZW9yLm1ldGhvZHNcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVzaDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRzZXQ6IFxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIF1cblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcbiAgICAgICAgcCA9IG51bGxcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgICAgcCA9IGVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdWxsOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIHBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBcblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXG5cbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxuICAgICAgICAkc2V0OlxuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG5cbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgcmV0dXJuIHt9XG5cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cbiAgICAgICAgc3dhbFxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXG4jIyNcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XG5cdGZyb206IChmdW5jdGlvbigpe1xuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XG5cdH0pKCksXG5cdHJlc2V0UGFzc3dvcmQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0dmVyaWZ5RW1haWw6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdGVucm9sbEFjY291bnQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9XG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XG5cdGlmIChvcmdzLmNvdW50KCk+MClcblx0e1xuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcblx0XHR7XG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cdFxuXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIFx0ZGF0YToge1xuXHQgICAgICBcdHJldDogMCxcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcbiAgICBcdH1cbiAgXHR9KTtcbn0pO1xuXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuXHRcdGlmIHNwYWNlSWRcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuXHRcdHNwYWNlcyA9IFtdXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XG5cdGljb246IFwiZ2xvYmVcIlxuXHRjb2xvcjogXCJibHVlXCJcblx0dGFibGVDb2x1bW5zOiBbXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cblx0XVxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdHJldHVybiB7fVxuXHRzaG93RWRpdENvbHVtbjogZmFsc2Vcblx0c2hvd0RlbENvbHVtbjogZmFsc2Vcblx0ZGlzYWJsZUFkZDogdHJ1ZVxuXHRwYWdlTGVuZ3RoOiAxMDBcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xuICAgIHZhciBrO1xuICAgIGlmIChuID49IDApIHtcbiAgICAgIGsgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuICsgbjtcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cbiAgICB9XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBrKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XG4gICAgICB3d3c6IFxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxuXHRsaXN0Vmlld3MgPSB7fVxuXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcblxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gbGlzdFZpZXdzXG5cblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pXG5cblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblxuXG5cbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xuXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbi8vICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XG4vLyAgICAgfVxuLy8gICB9O1xuLy8gICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcbi8vICAgfTtcbi8vICAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfTtcblxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfSxcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfVxuLy8gICB9KTtcblxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXG4vLyAgIHZhciBhcGkgPSB7XG4vLyAgICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XG4vLyAgICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcbi8vICAgICB9LFxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcblxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG5cbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcbi8vICAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbi8vICAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pXG4vLyAgICAgfVxuLy8gICB9KVxuXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbi8vICAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXG4vLyAgICAgLy8gICB9XG4vLyAgICAgLy8gfSk7XG5cbi8vICAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xuXG4vLyAgICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgfSk7XG5cbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xuXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XG5cbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xuXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcblxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9KTsgIFxuXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXG4vLyAgICAgXy5leHRlbmQoYXBpLCB7XG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcbi8vICAgICAgIH0sXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gYXBpO1xuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcblxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcblxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblx0XHRcblx0XHRpZiAhdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcblxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXG5cblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxuXHRcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IFtdXG5cblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzIClcbiAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuICAgICAgICBpZiAhYXV0aFRva2VuXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3JcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnNcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZVxuICAgICAgICBkYXRhID0gW11cbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucylcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7fVxuIiwidmFyIENvb2tpZXMsIHN0ZWVkb3NBdXRoO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXG5cdGlmIGFwcFxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcblx0ZWxzZVxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXG5cblx0aWYgIXJlZGlyZWN0VXJsXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRyZXMuZW5kKClcblx0XHRyZXR1cm5cblxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XG5cblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcblx0IyBpZiByZXEuYm9keVxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0IyAjIHRoZW4gY2hlY2sgY29va2llXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0aWYgdXNlclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHQjIGRlcy1jYmNcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxuXHRcdFx0a2V5OCA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCA4XG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSA4IC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0am9pbmVyID0gXCI/XCJcblxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxuXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cblxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRyZXMud3JpdGVIZWFkIDQwMVxuXHRyZXMuZW5kKClcblx0cmV0dXJuXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdCMgdGhpcy5wYXJhbXMgPVxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuXHRcdHdpZHRoID0gNTAgO1xuXHRcdGhlaWdodCA9IDUwIDtcblx0XHRmb250U2l6ZSA9IDI4IDtcblx0XHRpZiByZXEucXVlcnkud1xuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcblx0XHRpZiByZXEucXVlcnkuaFxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG5cdFx0aWYgIXVzZXJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHVzZXJuYW1lID0gdXNlci5uYW1lO1xuXHRcdGlmICF1c2VybmFtZVxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXG5cblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxuXG5cdFx0XHR1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XG5cdFx0XHRcdGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcblxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcblx0XHRcdGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcblxuXHRcdFx0aW5pdGlhbHMgPSAnJ1xuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcblxuXHRcdFx0aW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXG5cblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0PD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XG5cdFx0XHRcdFx0I3tpbml0aWFsc31cblx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcblx0XHRcdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XG5cdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuXHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcblxuXHRcdGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXG5cblx0XHRpZiBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgYWNjZXNzX3Rva2VuLCByZWY7XG4gICAgYWNjZXNzX3Rva2VuID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbikpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gICAgICAgIFxuXG4gICAgICAgIHNlbGVjdG9yID0ge3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fVxuICAgICAgICBpZiBzcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXG5cblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cblx0TWV0ZW9yLnB1Ymxpc2ggJ215X3NwYWNlcycsIC0+XG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblxuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHVzZXJTcGFjZXMgPSBbXVxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XG5cdFx0XHR1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpXG5cblx0XHRoYW5kbGUyID0gbnVsbFxuXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXG5cdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0aWYgZG9jLnNwYWNlXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXG5cdFx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKVxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRpZiBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXG5cblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuYWRkZWQgXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jO1xuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VkIFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYztcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZClcblxuXHRcdG9ic2VydmVTcGFjZXMoKTtcblxuXHRcdHNlbGYucmVhZHkoKTtcblxuXHRcdHNlbGYub25TdG9wIC0+XG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cblx0dW5sZXNzIHNwYWNlSWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7YXZhdGFyOiAxLG5hbWU6IDEsZW5hYmxlX3JlZ2lzdGVyOjF9fSk7XG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHR1bmxlc3MgX2lkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe19pZDogX2lkfSk7IiwiTWV0ZW9yLnB1Ymxpc2goJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIGZ1bmN0aW9uKF9pZCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIV9pZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7XG4gICAgX2lkOiBfaWRcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XG5cdFx0IyDmoLnmja7lvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4fvvIzmn6Xor6Llh7rlvZPliY3nlKjmiLfpmZDlrprnmoTnu4Tnu4fmn6XnnIvojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXG5cdFx0IyDpu5jorqTov5Tlm57pmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4dcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXG5cdFx0cmVWYWx1ZSA9XG5cdFx0XHRpc0xpbWl0OiB0cnVlXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0c2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJ9KVxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcblxuXHRcdGlmIGxpbWl0cy5sZW5ndGhcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0XHRcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcblx0XHRcdFx0ZnJvbXMgPSBsaW1pdC5mcm9tc1xuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3Ncblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4/Lm1hcCAobikgLT5cblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcblx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRpZiB0ZW1wSXNMaW1pdFxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xuXHRcdFx0XHRcdFx0bXlMaXRtaXRPcmdJZHMucHVzaCBteU9yZ0lkXG5cblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXG5cdFx0XHRpZiBteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cblx0XHRpZiBpc0xpbWl0XG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ54i25a2Q6IqC54K55YWz57O755qE6IqC54K5562b6YCJ5Ye65p2l5bm25Y+W5Ye65pyA5aSW5bGC6IqC54K5XG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cblx0XHRcdFx0cGFyZW50cyA9IG9yZy5wYXJlbnRzIG9yIFtdXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XG5cdFx0cmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblx0XHRyZXR1cm4gcmVWYWx1ZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICAgc2V0S2V5VmFsdWU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcblxuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgb2JqLmtleSA9IGtleTtcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgdmFyIGMgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kKHtcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSkiLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRVc2VybmFtZTogKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkgLT5cblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcblxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcblxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxuXG5cdFx0dW5sZXNzIHVzZXJfaWRcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxuXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IHVzZXJuYW1lfX0pXG5cblx0XHRyZXR1cm4gdXNlcm5hbWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkge1xuICAgIHZhciBzcGFjZVVzZXI7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG4gICAgaWYgKCFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSAmJiB1c2VyX2lkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnZXJyb3ItaW52YWxpZC11c2VyJyk7XG4gICAgfVxuICAgIGlmICghdXNlcl9pZCkge1xuICAgICAgdXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKTtcbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVzZXJuYW1lO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxuXHRcdHVzZXJfY291bnRfaW5mby5hY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0ZGIudXNlcnMuY3JlYXRlX3NlY3JldCB0aGlzLnVzZXJJZCwgbmFtZVxuXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxuXHRcdGlmICF0aGlzLnVzZXJJZCB8fCAhdG9rZW5cblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKVxuXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiAoc3BhY2VJZCwgdXNlcklkKSAtPlxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcblxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ25vdC1hdXRob3JpemVkJ1xuXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge2ZpZWxkczoge3BhcmVudHM6IDF9fSkuZmV0Y2goKVxuXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCwgJG9yOiBbeyBzeW5jX2RpcmVjdGlvbjogeyAkZXhpc3RzOiBmYWxzZSB9fSwgeyBzeW5jX2RpcmVjdGlvbjogeyAkaW46IFsnYm90aCcsICdvYmpfdG9faW5zJ119fV0gfSwgeyBmaWVsZHM6IHsgb2JqZWN0X25hbWU6IDEsIGZsb3dfaWQ6IDEsIHNwYWNlOiAxIH0gfSkuZmV0Y2goKVxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcbiAgICAgICAgICAgIGlmIGZsXG4gICAgICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXG4gICAgICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcblxuICAgICAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcbiAgICAgICAgICAgICAgICBpZiBwZXJtc1xuICAgICAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcblxuICAgICAgICBvd3MgPSBvd3MuZmlsdGVyIChuKS0+XG4gICAgICAgICAgICByZXR1cm4gbi5mbG93X25hbWVcblxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzeW5jX2RpcmVjdGlvbjoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzeW5jX2RpcmVjdGlvbjoge1xuICAgICAgICAgICAgJGluOiBbJ2JvdGgnLCAnb2JqX3RvX2lucyddXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmwpIHtcbiAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXG5cdFx0XG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0Y2FuRWRpdCA9IHNwYWNlVXNlci51c2VyID09IHVzZXJJZFxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcblx0XHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXHRcdFx0Y2FuRWRpdCA9IGlzU3BhY2VBZG1pblxuXG5cdFx0Y29tcGFueUlkcyA9IHNwYWNlVXNlci5jb21wYW55X2lkc1xuXHRcdGlmICFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGhcblx0XHRcdCMg57uE57uH566h55CG5ZGY5Lmf6IO95L+u5pS55a+G56CBXG5cdFx0XHRjb21wYW55cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNvbXBhbnlcIikuZmluZCh7X2lkOiB7ICRpbjogY29tcGFueUlkcyB9LCBzcGFjZTogc3BhY2VfaWQgfSwge2ZpZWxkczogeyBhZG1pbnM6IDEgfX0pLmZldGNoKClcblx0XHRcdGlmIGNvbXBhbnlzIGFuZCBjb21wYW55cy5sZW5ndGhcblx0XHRcdFx0Y2FuRWRpdCA9IF8uYW55IGNvbXBhbnlzLCAoaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaXRlbS5hZG1pbnMgJiYgaXRlbS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID4gLTFcblxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcblxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxuXG5cdFx0IyBTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cdFx0bG9nb3V0ID0gdHJ1ZTtcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxuXHRcdFxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHtcblx0XHRcdGFsZ29yaXRobTogJ3NoYS0yNTYnLFxuXHRcdFx0ZGlnZXN0OiBwYXNzd29yZFxuXHRcdH0sIHtsb2dvdXQ6IGxvZ291dH0pXG5cdFx0Y2hhbmdlZFVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRpZiBjaGFuZ2VkVXNlckluZm9cblx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRwdXNoOiB7J3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiBjaGFuZ2VkVXNlckluZm8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHR9fSlcblxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3Jyxcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjYW5FZGl0LCBjaGFuZ2VkVXNlckluZm8sIGNvbXBhbnlJZHMsIGNvbXBhbnlzLCBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCBsb2dvdXQsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VySWQsIHVzZXJfaWQ7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJJZCA9IHRoaXMudXNlcklkO1xuICAgIGNhbkVkaXQgPSBzcGFjZVVzZXIudXNlciA9PT0gdXNlcklkO1xuICAgIGlmICghY2FuRWRpdCkge1xuICAgICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogc3BhY2VfaWRcbiAgICAgIH0pO1xuICAgICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgY2FuRWRpdCA9IGlzU3BhY2VBZG1pbjtcbiAgICB9XG4gICAgY29tcGFueUlkcyA9IHNwYWNlVXNlci5jb21wYW55X2lkcztcbiAgICBpZiAoIWNhbkVkaXQgJiYgY29tcGFueUlkcyAmJiBjb21wYW55SWRzLmxlbmd0aCkge1xuICAgICAgY29tcGFueXMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjb21wYW55XCIpLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IGNvbXBhbnlJZHNcbiAgICAgICAgfSxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGFkbWluczogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgaWYgKGNvbXBhbnlzICYmIGNvbXBhbnlzLmxlbmd0aCkge1xuICAgICAgICBjYW5FZGl0ID0gXy5hbnkoY29tcGFueXMsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICByZXR1cm4gaXRlbS5hZG1pbnMgJiYgaXRlbS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID4gLTE7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKTtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgbG9nb3V0ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy51c2VySWQgPT09IHVzZXJfaWQpIHtcbiAgICAgIGxvZ291dCA9IGZhbHNlO1xuICAgIH1cbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCB7XG4gICAgICBhbGdvcml0aG06ICdzaGEtMjU2JyxcbiAgICAgIGRpZ2VzdDogcGFzc3dvcmRcbiAgICB9LCB7XG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH0pO1xuICAgIGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgaWYgKGNoYW5nZWRVc2VySW5mbykge1xuICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB1c2VyX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgJ3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiAocmVmMSA9IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjIuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cblxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0Y291bnRfZGF5cyA9IDBcblxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxuXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXG5cblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxuXHRcdCMgZG8gbm90aGluZ1xuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxuXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cblx0bGFzdF9iaWxsID0gbnVsbFxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxuXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0Y3JlYXRlZDoge1xuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxuXHRcdFx0fSxcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0aWYgcGF5bWVudF9iaWxsXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXG5cdGVsc2Vcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcblxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0XHRpZiBhcHBfYmlsbFxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcblxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcblx0c2V0T2JqID0gbmV3IE9iamVjdFxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxuXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0bm93ID0gbmV3IERhdGVcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2Vcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcblx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHR7XG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cblx0XHR9XG5cdCkuZm9yRWFjaCAoYmlsbCktPlxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXG5cblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRtb2R1bGVzID0gbmV3IEFycmF5XG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y3JlYXRlZDogLTFcblx0XHRcdH1cblx0XHQpXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcblx0XHRcdCMgIGRvIG5vdGhpbmdcblxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxuXHRcdFx0IyAgZG8gbm90aGluZ1xuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cblx0cmV0dXJuIG1vZHVsZXNcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXG5cdClcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxuXG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdHJldHVyblxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRkZWJpdHMgPSAwXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdFx0e1xuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpLmZvckVhY2goKGIpLT5cblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xuXHRcdClcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2Vcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxuXHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRpZiBkZWJpdHMgPiAwXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXG5cblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcblx0XHRcdHtcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRlbHNlXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXG5cblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXG5cblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XG5cblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxuXG5cdG0gPSBtb21lbnQoKVxuXHRub3cgPSBtLl9kXG5cblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcblxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0IyDmm7TmlrBtb2R1bGVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXG5cdGlmIHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cblx0XHRcdG1jbCA9IG5ldyBPYmplY3Rcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxuXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcblxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XG5cbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XG5cbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghZ29fbmV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xuXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHJldHVybiBkYXRla2V5O1xuICAgICAgfTtcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xuICAgICAgfTtcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oC75pWwXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xuICAgICAgICAgIHJldHVybiBtb2Q7XG4gICAgICB9O1xuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KSAgXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5o+S5YWl5pWw5o2uXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RlZWRvczp7XG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmtmbG93OntcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY21zOiB7XG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcblxuICAgICAgZ29fbmV4dCA9IHRydWU7XG5cbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICB9KSk7XG5cbiAgfVxuXG59KVxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDFcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXG4gICAgICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMlxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDNcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogNFxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNVxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRcdHRyeVxuXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcblx0XHRcdFx0XHRcdFx0XHRpZiByXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA2XG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRcdHRyeVxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcblx0XHRcdFx0fSlcblxuXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcblxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cbiAgICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKClcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xuICAgICAgICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiaWYocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKXtcblx0Ly9NZXRlb3Ig54mI5pys5Y2H57qn5YiwMS45IOWPiuS7peS4iuaXtihub2RlIOeJiOacrCAxMSsp77yM5Y+v5Lul5Yig6Zmk5q2k5Luj56CBXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmbGF0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihkZXB0aCA9IDEpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAoZmxhdCwgdG9GbGF0dGVuKSB7XG5cdFx0XHRcdHJldHVybiBmbGF0LmNvbmNhdCgoQXJyYXkuaXNBcnJheSh0b0ZsYXR0ZW4pICYmIChkZXB0aD4xKSkgPyB0b0ZsYXR0ZW4uZmxhdChkZXB0aC0xKSA6IHRvRmxhdHRlbik7XG5cdFx0XHR9LCBbXSk7XG5cdFx0fVxuXHR9KTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdG5ldyBUYWJ1bGFyLlRhYmxlXG5cdFx0bmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXG5cdFx0Y29sdW1uczogW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXG5cdFx0XHR9XG5cdFx0XVxuXHRcdGRvbTogXCJ0cFwiXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxuXHRcdG9yZGVyaW5nOiBmYWxzZVxuXHRcdHBhZ2VMZW5ndGg6IDEwXG5cdFx0aW5mbzogZmFsc2Vcblx0XHRzZWFyY2hpbmc6IHRydWVcblx0XHRhdXRvV2lkdGg6IHRydWVcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XG5cdFx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2Vcblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
