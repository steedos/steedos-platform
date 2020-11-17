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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:base":{"checkNpm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/checkNpm.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

if (Meteor.settings && Meteor.settings.billing) {
  checkNpmVersions({
    "weixin-pay": "^1.1.7"
  }, 'steedos:base');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"steedos_util.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/steedos_util.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"core.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/core.coffee                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, crypto, mixin;
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

Steedos.getHelpUrl = function (locale) {
  var country;
  country = locale.substring(3);
  return "http://www.steedos.com/" + country + "/help/";
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

    if ((space != null ? space.is_paid : void 0) && end_date !== void 0 && end_date - new Date() <= min_months * 30 * 24 * 3600 * 1000) {
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
    var check, modules, ref;

    if (!spaceId) {
      return false;
    }

    check = false;
    modules = (ref = db.spaces.findOne(spaceId)) != null ? ref.modules : void 0;

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
      var ref;

      if (org.parents) {
        parents = _.union(parents, org.parents);
      }

      return (ref = org.admins) != null ? ref.includes(userId) : void 0;
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
    var authToken, cookies, password, ref, ref1, ref2, ref3, result, user, userId, username;
    username = (ref = req.query) != null ? ref.username : void 0;
    password = (ref1 = req.query) != null ? ref1.password : void 0;

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

    userId = (ref2 = req.query) != null ? ref2["X-User-Id"] : void 0;
    authToken = (ref3 = req.query) != null ? ref3["X-Auth-Token"] : void 0;

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
    var authToken, cookies, ref, ref1, ref2, ref3, userId;
    userId = (ref = req.query) != null ? ref["X-User-Id"] : void 0;
    authToken = (ref1 = req.query) != null ? ref1["X-Auth-Token"] : void 0;

    if (Steedos.checkAuthToken(userId, authToken)) {
      return (ref2 = db.users.findOne({
        _id: userId
      })) != null ? ref2._id : void 0;
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
      return (ref3 = db.users.findOne({
        _id: userId
      })) != null ? ref3._id : void 0;
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
    var caculated_date, end_date, first_date, i, j, len, max_index, ref, second_date, start_date, time_points;
    check(date, Date);
    time_points = (ref = Meteor.settings.remind) != null ? ref.time_points : void 0;

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
      var passworPolicy, passworPolicyError, reason, ref, ref1, ref2, ref3, valid;
      reason = t("password_invalid");
      valid = true;

      if (!pwd) {
        valid = false;
      }

      passworPolicy = (ref = Meteor.settings["public"]) != null ? (ref1 = ref.password) != null ? ref1.policy : void 0 : void 0;
      passworPolicyError = (ref2 = Meteor.settings["public"]) != null ? (ref3 = ref2.password) != null ? ref3.policyError : void 0 : void 0;

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"simple_schema_extend.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/simple_schema_extend.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {
  SimpleSchema.extendOptions({
    foreign_key: Match.Optional(Boolean),
    references: Match.Optional(Object)
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods":{"apps_init.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/apps_init.coffee                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utc_offset.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/utc_offset.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"last_logon.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/last_logon.coffee                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_add_email.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/user_add_email.coffee                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_avatar.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/user_avatar.coffee                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"email_templates_reset.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/email_templates_reset.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"upgrade_data.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/methods/upgrade_data.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"push.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/steedos/push.coffee                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"admin.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/admin.coffee                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"array_includes.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/array_includes.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"settings.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/settings.coffee                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_object_view.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/user_object_view.coffee                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server_session.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/lib/server_session.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"api_get_apps.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/routes/api_get_apps.coffee                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/routes/collection.coffee                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies;
Cookies = require("cookies");
JsonRoutes.add("post", "/api/collection/find", function (req, res, next) {
  var allow_models, authToken, cookies, data, e, model, options, selector, space, space_user, userId;

  try {
    cookies = new Cookies(req, res);

    if (req.body) {
      userId = req.body["X-User-Id"];
      authToken = req.body["X-Auth-Token"];
    }

    if (!userId || !authToken) {
      userId = cookies.get("X-User-Id");
      authToken = cookies.get("X-Auth-Token");
    }

    if (!(userId && authToken)) {
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

    space_user = db.space_users.findOne({
      user: userId,
      space: space
    });

    if (!space_user) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid space " + space,
          "success": false
        }
      });
      return;
    }

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
  var allow_models, authToken, cookies, data, e, model, options, selector, space, space_user, userId;

  try {
    cookies = new Cookies(req, res);

    if (req.body) {
      userId = req.body["X-User-Id"];
      authToken = req.body["X-Auth-Token"];
    }

    if (!userId || !authToken) {
      userId = cookies.get("X-User-Id");
      authToken = cookies.get("X-Auth-Token");
    }

    if (!(userId && authToken)) {
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

    space_user = db.space_users.findOne({
      user: userId,
      space: space
    });

    if (!space_user) {
      JsonRoutes.sendResult(res, {
        code: 403,
        data: {
          "error": "invalid space " + space,
          "success": false
        }
      });
      return;
    }

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sso.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/routes/sso.coffee                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"avatar.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/routes/avatar.coffee                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"access_token.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/routes/access_token.coffee                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"publications":{"apps.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/publications/apps.coffee                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"my_spaces.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/publications/my_spaces.coffee                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"space_avatar.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/publications/space_avatar.coffee                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"modules.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/publications/modules.coffee                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish('modules', function () {
  if (!this.userId) {
    return this.ready();
  }

  return db.modules.find();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"weixin_pay_code_url.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/publications/weixin_pay_code_url.coffee                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"routes":{"bootstrap.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/routes/bootstrap.coffee                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _getLocale, clone, getUserProfileObjectsLayout, steedosAuth, steedosCore, steedosI18n, steedosLicense;

steedosAuth = require("@steedos/auth");
steedosI18n = require("@steedos/i18n");
steedosCore = require("@steedos/core");
steedosLicense = require("@steedos/license");
clone = require("clone");

_getLocale = function (user) {
  var locale, ref, ref1;

  if ((user != null ? (ref = user.locale) != null ? ref.toLocaleLowerCase() : void 0 : void 0) === 'zh-cn') {
    locale = "zh-CN";
  } else if ((user != null ? (ref1 = user.locale) != null ? ref1.toLocaleLowerCase() : void 0 : void 0) === 'en-us') {
    locale = "en";
  } else {
    locale = "zh-CN";
  }

  return locale;
};

getUserProfileObjectsLayout = function (userId, spaceId) {
  var ref, spaceUser;
  spaceUser = Creator.getCollection("space_users").findOne({
    space: spaceId,
    user: userId
  }, {
    fields: {
      profile: 1
    }
  });

  if (spaceUser && spaceUser.profile) {
    return (ref = Creator.getCollection("object_layouts")) != null ? ref.find({
      space: spaceId,
      profiles: spaceUser.profile
    }).fetch() : void 0;
  }
};

JsonRoutes.add("get", "/api/bootstrap/:spaceId/", function (req, res, next) {
  var _Apps, _Dashboards, assigned_menus, authToken, lng, objectsLayout, permissions, ref, result, space, spaceId, spaceProcessDefinition, userId, userSession;

  userId = req.headers['x-user-id'];
  spaceId = req.headers['x-space-id'] || ((ref = req.params) != null ? ref.spaceId : void 0);

  if (!userId) {
    JsonRoutes.sendResult(res, {
      code: 403,
      data: null
    });
    return;
  }

  authToken = Steedos.getAuthToken(req, res);
  userSession = Meteor.wrapAsync(function (authToken, spaceId, cb) {
    return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  })(authToken, spaceId);

  if (!userSession) {
    JsonRoutes.sendResult(res, {
      code: 500,
      data: null
    });
    return;
  }

  space = Creator.Collections["spaces"].findOne({
    _id: spaceId
  }, {
    fields: {
      name: 1
    }
  });
  result = Creator.getAllPermissions(spaceId, userId);
  lng = _getLocale(db.users.findOne(userId, {
    fields: {
      locale: 1
    }
  }));
  steedosI18n.translationObjects(lng, result.objects);
  result.user = userSession;
  result.space = space;
  result.apps = clone(Creator.Apps);
  result.dashboards = clone(Creator.Dashboards);
  result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects);
  result.object_workflows = Meteor.call('object_workflows.get', spaceId, userId);
  permissions = Meteor.wrapAsync(function (v, userSession, cb) {
    return v.getUserObjectPermission(userSession).then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  });

  _.each(Creator.steedosSchema.getDataSources(), function (datasource, name) {
    var datasourceObjects;

    if (name !== 'default') {
      datasourceObjects = datasource.getObjects();
      return _.each(datasourceObjects, function (v, k) {
        var _obj;

        _obj = Creator.convertObject(clone(v.toConfig()), spaceId);
        _obj.name = k;
        _obj.database_name = name;
        _obj.permissions = permissions(v, userSession);
        return result.objects[_obj.name] = _obj;
      });
    }
  });

  _.each(Creator.steedosSchema.getDataSources(), function (datasource, name) {
    result.apps = _.extend(result.apps, clone(datasource.getAppsConfig()));
    return result.dashboards = _.extend(result.dashboards, datasource.getDashboardsConfig());
  });

  result.apps = _.extend(result.apps || {}, Creator.getDBApps(spaceId));
  result.dashboards = _.extend(result.dashboards || {}, Creator.getDBDashboards(spaceId));
  _Apps = {};

  _.each(result.apps, function (app, key) {
    if (!app._id) {
      app._id = key;
    }

    if (app.code) {
      app._dbid = app._id;
      app._id = app.code;
    }

    return _Apps[app._id] = app;
  });

  steedosI18n.translationApps(lng, _Apps);
  result.apps = _Apps;
  assigned_menus = clone(result.assigned_menus);
  steedosI18n.translationMenus(lng, assigned_menus);
  result.assigned_menus = assigned_menus;
  _Dashboards = {};

  _.each(result.dashboards, function (dashboard, key) {
    if (!dashboard._id) {
      dashboard._id = key;
    }

    return _Dashboards[dashboard._id] = dashboard;
  });

  result.dashboards = _Dashboards;
  result.plugins = typeof steedosCore.getPlugins === "function" ? steedosCore.getPlugins() : void 0;
  objectsLayout = getUserProfileObjectsLayout(userId, spaceId);

  if (objectsLayout) {
    _.each(objectsLayout, function (objectLayout) {
      var _fields, _object;

      _object = clone(result.objects[objectLayout.object_name]);

      if (_object) {
        _fields = {};

        _.each(objectLayout.fields, function (_item) {
          var ref1, ref2, ref3, ref4, ref5, ref6, ref7;
          _fields[_item.field] = _object.fields[_item.field];

          if (_.has(_item, 'group')) {
            if ((ref1 = _fields[_item.field]) != null) {
              ref1.group = _item.group;
            }
          }

          if (_item.required) {
            if ((ref2 = _fields[_item.field]) != null) {
              ref2.readonly = false;
            }

            if ((ref3 = _fields[_item.field]) != null) {
              ref3.disabled = false;
            }

            return (ref4 = _fields[_item.field]) != null ? ref4.required = true : void 0;
          } else if (_item.readonly) {
            if ((ref5 = _fields[_item.field]) != null) {
              ref5.readonly = true;
            }

            if ((ref6 = _fields[_item.field]) != null) {
              ref6.disabled = true;
            }

            return (ref7 = _fields[_item.field]) != null ? ref7.required = false : void 0;
          }
        });

        _object.fields = _fields;
        _object.allow_actions = objectLayout.actions || [];
        _object.allow_relatedList = objectLayout.relatedList || [];
      }

      return result.objects[objectLayout.object_name] = _object;
    });
  }

  spaceProcessDefinition = Creator.getCollection("process_definition").find({
    space: spaceId,
    active: true
  }, {
    fields: {
      object_name: 1
    }
  }).fetch();

  _.each(spaceProcessDefinition, function (item) {
    var ref1;
    return (ref1 = result.objects[item.object_name]) != null ? ref1.enable_process = true : void 0;
  });

  return JsonRoutes.sendResult(res, {
    code: 200,
    data: result
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api_billing_recharge_notify.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/routes/api_billing_recharge_notify.coffee                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
JsonRoutes.add('post', '/api/billing/recharge/notify', function (req, res, next) {
  var body, e;

  try {
    body = "";
    req.on('data', function (chunk) {
      return body += chunk;
    });
    req.on('end', Meteor.bindEnvironment(function () {
      var parser, xml2js;
      xml2js = require('xml2js');
      parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        explicitRoot: false
      });
      return parser.parseString(body, function (err, result) {
        var WXPay, attach, bpr, code_url_id, sign, wxpay;
        WXPay = require('weixin-pay');
        wxpay = WXPay({
          appid: Meteor.settings.billing.appid,
          mch_id: Meteor.settings.billing.mch_id,
          partner_key: Meteor.settings.billing.partner_key
        });
        sign = wxpay.sign(_.clone(result));
        attach = JSON.parse(result.attach);
        code_url_id = attach.code_url_id;
        bpr = db.billing_pay_records.findOne(code_url_id);

        if (bpr && bpr.total_fee === Number(result.total_fee) && sign === result.sign) {
          db.billing_pay_records.update({
            _id: code_url_id
          }, {
            $set: {
              paid: true
            }
          });
          return billingManager.special_pay(bpr.space, bpr.modules, Number(result.total_fee), bpr.created_by, bpr.end_date, bpr.user_count);
        }
      });
    }, function (err) {
      console.error(err.stack);
      return console.log('Failed to bind environment: api_billing_recharge_notify.coffee');
    }));
  } catch (error) {
    e = error;
    console.error(e.stack);
  }

  res.writeHead(200, {
    'Content-Type': 'application/xml'
  });
  return res.end('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"my_contacts_limit.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/my_contacts_limit.coffee                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setKeyValue.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/setKeyValue.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"billing_settleup.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/billing_settleup.coffee                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  billing_settleup: function (accounting_month, space_id) {
    var Email, err, result, spaces, user;

    if (space_id == null) {
      space_id = "";
    }

    check(accounting_month, String);
    check(space_id, String);
    user = db.users.findOne({
      _id: this.userId
    }, {
      fields: {
        is_cloudadmin: 1
      }
    });

    if (!user.is_cloudadmin) {
      return;
    }

    console.time('billing');
    spaces = [];

    if (space_id) {
      spaces = db.spaces.find({
        _id: space_id,
        is_paid: true
      }, {
        fields: {
          _id: 1
        }
      });
    } else {
      spaces = db.spaces.find({
        is_paid: true
      }, {
        fields: {
          _id: 1
        }
      });
    }

    result = [];
    spaces.forEach(function (s) {
      var e, err;

      try {
        return billingManager.caculate_by_accounting_month(accounting_month, s._id);
      } catch (error) {
        err = error;
        e = {};
        e._id = s._id;
        e.name = s.name;
        e.err = err;
        return result.push(e);
      }
    });

    if (result.length > 0) {
      console.error(result);

      try {
        Email = Package.email.Email;
        Email.send({
          to: 'support@steedos.com',
          from: Accounts.emailTemplates.from,
          subject: 'billing settleup result',
          text: JSON.stringify({
            'result': result
          })
        });
      } catch (error) {
        err = error;
        console.error(err);
      }
    }

    return console.timeEnd('billing');
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"setUsername.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/setUsername.coffee                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"billing_recharge.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/billing_recharge.coffee                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  billing_recharge: function (total_fee, space_id, new_id, module_names, end_date, user_count) {
    var WXPay, attach, listprices, one_month_yuan, order_body, result_obj, space, space_user_count, user_id, wxpay;
    check(total_fee, Number);
    check(space_id, String);
    check(new_id, String);
    check(module_names, Array);
    check(end_date, String);
    check(user_count, Number);
    user_id = this.userId;
    listprices = 0;
    order_body = [];
    db.modules.find({
      name: {
        $in: module_names
      }
    }).forEach(function (m) {
      listprices += m.listprice_rmb;
      return order_body.push(m.name_zh);
    });
    space = db.spaces.findOne(space_id);

    if (!space.is_paid) {
      space_user_count = db.space_users.find({
        space: space_id
      }).count();
      one_month_yuan = space_user_count * listprices;

      if (total_fee < one_month_yuan * 100) {
        throw new Meteor.Error('error!', "充值金额应不少于一个月所需费用：￥" + one_month_yuan);
      }
    }

    result_obj = {};
    attach = {};
    attach.code_url_id = new_id;
    WXPay = require('weixin-pay');
    wxpay = WXPay({
      appid: Meteor.settings.billing.appid,
      mch_id: Meteor.settings.billing.mch_id,
      partner_key: Meteor.settings.billing.partner_key
    });
    wxpay.createUnifiedOrder({
      body: order_body.join(","),
      out_trade_no: moment().format('YYYYMMDDHHmmssSSS'),
      total_fee: total_fee,
      spbill_create_ip: '127.0.0.1',
      notify_url: Meteor.absoluteUrl() + 'api/billing/recharge/notify',
      trade_type: 'NATIVE',
      product_id: moment().format('YYYYMMDDHHmmssSSS'),
      attach: JSON.stringify(attach)
    }, Meteor.bindEnvironment(function (err, result) {
      var obj;

      if (err) {
        console.error(err.stack);
      }

      if (result) {
        obj = {};
        obj._id = new_id;
        obj.created = new Date();
        obj.info = result;
        obj.total_fee = total_fee;
        obj.created_by = user_id;
        obj.space = space_id;
        obj.paid = false;
        obj.modules = module_names;
        obj.end_date = end_date;
        obj.user_count = user_count;
        return db.billing_pay_records.insert(obj);
      }
    }, function (e) {
      console.log('Failed to bind environment: billing_recharge.coffee');
      return console.log(e.stack);
    }));
    return "success";
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_space_user_count.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/get_space_user_count.coffee                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user_secret.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/user_secret.coffee                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"object_workflows.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/object_workflows.coffee                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update_server_session.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/update_server_session.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_space_user_password.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/methods/set_space_user_password.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  setSpaceUserPassword: function (space_user_id, space_id, password) {
    var changedUserInfo, currentUser, isSpaceAdmin, lang, logout, ref, ref1, ref2, space, spaceUser, userCP, user_id;

    if (!this.userId) {
      throw new Meteor.Error(400, "请先登录");
    }

    space = db.spaces.findOne({
      _id: space_id
    });
    isSpaceAdmin = space != null ? (ref = space.admins) != null ? ref.includes(this.userId) : void 0 : void 0;

    if (!isSpaceAdmin) {
      throw new Meteor.Error(400, "您没有权限修改该用户密码");
    }

    spaceUser = db.space_users.findOne({
      _id: space_user_id,
      space: space_id
    });
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"billing_manager.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/lib/billing_manager.coffee                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"schedule":{"statistics.js":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/schedule/statistics.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"billing.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/schedule/billing.coffee                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"startup":{"migrations":{"v1.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v1.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v2.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v2.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v3.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v3.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v4.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v4.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v5.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v5.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"v6.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/v6.coffee                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"xrun.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/steedos/startup/migrations/xrun.coffee                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/startup.coffee                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"development.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/server/development.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isDevelopment) {
  //Meteor 版本升级到1.9 及以上时(node 版本 11+)，可以删除此代码
  Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) && depth > 1 ? toFlatten.flat(depth - 1) : toFlatten);
      }, []);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"tabular.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/steedos_base/tabular.coffee                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
require("/node_modules/meteor/steedos:base/server/routes/bootstrap.coffee");
require("/node_modules/meteor/steedos:base/server/routes/api_billing_recharge_notify.coffee");
require("/node_modules/meteor/steedos:base/server/methods/my_contacts_limit.coffee");
require("/node_modules/meteor/steedos:base/server/methods/setKeyValue.js");
require("/node_modules/meteor/steedos:base/server/methods/billing_settleup.coffee");
require("/node_modules/meteor/steedos:base/server/methods/setUsername.coffee");
require("/node_modules/meteor/steedos:base/server/methods/billing_recharge.coffee");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2Jvb3RzdHJhcC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRLZXlWYWx1ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvZ2V0X3NwYWNlX3VzZXJfY291bnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9kZXZlbG9wbWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb3J0QnlOYW1lIiwibG9jYWxlIiwiU3RlZWRvcyIsInNvcnQiLCJwMSIsInAyIiwicDFfc29ydF9ubyIsInNvcnRfbm8iLCJwMl9zb3J0X25vIiwibmFtZSIsImxvY2FsZUNvbXBhcmUiLCJnZXRQcm9wZXJ0eSIsImsiLCJmb3JFYWNoIiwidCIsIm0iLCJwdXNoIiwicmVtb3ZlIiwiZnJvbSIsInRvIiwicmVzdCIsInNsaWNlIiwibGVuZ3RoIiwiYXBwbHkiLCJmaWx0ZXJQcm9wZXJ0eSIsImgiLCJsIiwiZyIsImQiLCJpbmNsdWRlcyIsIk9iamVjdCIsInVuZGVmaW5lZCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJyIiwiQ29va2llcyIsImNyeXB0byIsIm1peGluIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJyZWYiLCJyZWYxIiwicGhvbmUiLCJudW1iZXJUb1N0cmluZyIsIm51bWJlciIsInNjYWxlIiwibm90VGhvdXNhbmRzIiwicmVnIiwidG9TdHJpbmciLCJOdW1iZXIiLCJ0b0ZpeGVkIiwibWF0Y2giLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsInVybCIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsIiQiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFic29sdXRlVXJsIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImlzQ29yZG92YSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsInJlZGlyZWN0VG9TaWduSW4iLCJGbG93Um91dGVyIiwiZ28iLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJlcnJvcjEiLCJjb25zb2xlIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJpc19wYWlkIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJjc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJnZXRVc2VyT3JnYW5pemF0aW9ucyIsImlzSW5jbHVkZVBhcmVudHMiLCJvcmdhbml6YXRpb25zIiwicGFyZW50cyIsInNwYWNlX3VzZXIiLCJzcGFjZV91c2VycyIsImZpZWxkcyIsIl8iLCJmbGF0dGVuIiwiZmluZCIsIiRpbiIsImZldGNoIiwidW5pb24iLCJmb3JiaWROb2RlQ29udGV4dG1lbnUiLCJ0YXJnZXQiLCJpZnIiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJwcmV2ZW50RGVmYXVsdCIsImxvYWQiLCJpZnJCb2R5IiwiY29udGVudHMiLCJpc1NlcnZlciIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsInBhc3N3b3JkIiwicmVmMiIsInJlZjMiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsInNwbGl0Iiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJmdW5jIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwiYXV0b3J1biIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImdldFJlbGF0aXZlVXJsIiwiYXZhdGFyVXJsIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJwdWJsaXNoIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCIsInN0ZWVkb3NBdXRoIiwic3RlZWRvc0NvcmUiLCJzdGVlZG9zSTE4biIsInN0ZWVkb3NMaWNlbnNlIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJzcGFjZVVzZXIiLCJwcm9maWxlcyIsIl9BcHBzIiwiX0Rhc2hib2FyZHMiLCJhc3NpZ25lZF9tZW51cyIsImxuZyIsIm9iamVjdHNMYXlvdXQiLCJwZXJtaXNzaW9ucyIsInNwYWNlUHJvY2Vzc0RlZmluaXRpb24iLCJ1c2VyU2Vzc2lvbiIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJ0cmFuc2xhdGlvbk9iamVjdHMiLCJBcHBzIiwiZGFzaGJvYXJkcyIsIkRhc2hib2FyZHMiLCJvYmplY3RfbGlzdHZpZXdzIiwib2JqZWN0X3dvcmtmbG93cyIsImdldFVzZXJPYmplY3RQZXJtaXNzaW9uIiwic3RlZWRvc1NjaGVtYSIsImdldERhdGFTb3VyY2VzIiwiZGF0YXNvdXJjZSIsImRhdGFzb3VyY2VPYmplY3RzIiwiZ2V0T2JqZWN0cyIsIl9vYmoiLCJjb252ZXJ0T2JqZWN0IiwidG9Db25maWciLCJkYXRhYmFzZV9uYW1lIiwiZ2V0QXBwc0NvbmZpZyIsImdldERhc2hib2FyZHNDb25maWciLCJfZGJpZCIsInRyYW5zbGF0aW9uQXBwcyIsInRyYW5zbGF0aW9uTWVudXMiLCJwbHVnaW5zIiwiZ2V0UGx1Z2lucyIsIm9iamVjdExheW91dCIsIl9maWVsZHMiLCJfb2JqZWN0IiwiX2l0ZW0iLCJyZWY0IiwicmVmNSIsInJlZjYiLCJyZWY3IiwiZmllbGQiLCJoYXMiLCJncm91cCIsInJlcXVpcmVkIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsImFsbG93X2FjdGlvbnMiLCJhY3Rpb25zIiwiYWxsb3dfcmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdCIsImFjdGl2ZSIsImVuYWJsZV9wcm9jZXNzIiwib24iLCJjaHVuayIsImJpbmRFbnZpcm9ubWVudCIsInBhcnNlciIsInhtbDJqcyIsIlBhcnNlciIsImV4cGxpY2l0QXJyYXkiLCJleHBsaWNpdFJvb3QiLCJwYXJzZVN0cmluZyIsImVyciIsIldYUGF5IiwiYXR0YWNoIiwiYnByIiwiY29kZV91cmxfaWQiLCJzaWduIiwid3hwYXkiLCJhcHBpZCIsIm1jaF9pZCIsInBhcnRuZXJfa2V5IiwiSlNPTiIsInBhcnNlIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJsb2ciLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJ2YWx1ZXMiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImluc2VydCIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwicyIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJQYWNrYWdlIiwic2VuZCIsInN0cmluZ2lmeSIsInRpbWVFbmQiLCJzZXRVc2VybmFtZSIsImludml0ZV9zdGF0ZSIsImJpbGxpbmdfcmVjaGFyZ2UiLCJuZXdfaWQiLCJtb2R1bGVfbmFtZXMiLCJsaXN0cHJpY2VzIiwib25lX21vbnRoX3l1YW4iLCJvcmRlcl9ib2R5IiwicmVzdWx0X29iaiIsInNwYWNlX3VzZXJfY291bnQiLCJsaXN0cHJpY2Vfcm1iIiwibmFtZV96aCIsImNyZWF0ZVVuaWZpZWRPcmRlciIsImpvaW4iLCJvdXRfdHJhZGVfbm8iLCJtb21lbnQiLCJmb3JtYXQiLCJzcGJpbGxfY3JlYXRlX2lwIiwibm90aWZ5X3VybCIsInRyYWRlX3R5cGUiLCJwcm9kdWN0X2lkIiwiaW5mbyIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJzZXRTcGFjZVVzZXJQYXNzd29yZCIsInNwYWNlX3VzZXJfaWQiLCJjaGFuZ2VkVXNlckluZm8iLCJjdXJyZW50VXNlciIsImxhbmciLCJsb2dvdXQiLCJ1c2VyQ1AiLCJzZXRQYXNzd29yZCIsInNlcnZpY2VzIiwiYmNyeXB0IiwibW9iaWxlX3ZlcmlmaWVkIiwiU01TUXVldWUiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIlJlY051bSIsIlNpZ25OYW1lIiwiVGVtcGxhdGVDb2RlIiwiZ2V0X2FjY291bnRpbmdfcGVyaW9kIiwiY291bnRfZGF5cyIsImVuZF9kYXRlX3RpbWUiLCJzdGFydF9kYXRlX3RpbWUiLCJiaWxsaW5ncyIsInRyYW5zYWN0aW9uIiwiYmlsbGluZ19kYXRlIiwiZ2V0RGF0ZSIsInJlZnJlc2hfYmFsYW5jZSIsInJlZnJlc2hfZGF0ZSIsImFwcF9iaWxsIiwiYl9tIiwiYl9tX2QiLCJiaWxsIiwiY3JlZGl0cyIsImRlYml0cyIsImxhc3RfYmFsYW5jZSIsImxhc3RfYmlsbCIsInBheW1lbnRfYmlsbCIsInNldE9iaiIsIiRsdCIsImJpbGxpbmdfbW9udGgiLCJiYWxhbmNlIiwiZ2V0X2JhbGFuY2UiLCJtb2R1bGVfbmFtZSIsImxpc3RwcmljZSIsImFjY291bnRpbmdfZGF0ZSIsImFjY291bnRpbmdfZGF0ZV9mb3JtYXQiLCJkYXlzX251bWJlciIsIm5ld19iaWxsIiwiJGx0ZSIsIl9tYWtlTmV3SUQiLCJnZXRTcGFjZVVzZXJDb3VudCIsInJlY2FjdWxhdGVCYWxhbmNlIiwicmVmcmVzaF9kYXRlcyIsInJfZCIsImdldF9tb2R1bGVzIiwibV9jaGFuZ2Vsb2ciLCJtb2R1bGVzX2NoYW5nZWxvZ3MiLCJjaGFuZ2VfZGF0ZSIsIm9wZXJhdGlvbiIsImdldF9tb2R1bGVzX25hbWUiLCJtb2R1bGVzX25hbWUiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsIm9wZXJhdG9yX2lkIiwibmV3X21vZHVsZXMiLCJzcGFjZV91cGRhdGVfb2JqIiwiZGlmZmVyZW5jZSIsIl9kIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJkYXRlRm9ybWF0IiwiZGF0ZWtleSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJ5ZXN0ZXJEYXkiLCJkTm93IiwiZEJlZm9yZSIsImRhaWx5U3RhdGljc0NvdW50Iiwic3RhdGljcyIsIiRndCIsInN0YXRpY3NDb3VudCIsIm93bmVyTmFtZSIsImxhc3RMb2dvbiIsInNVc2VycyIsInNVc2VyIiwibGFzdE1vZGlmaWVkIiwib2JqQXJyIiwibW9kIiwicG9zdHNBdHRhY2htZW50cyIsImF0dFNpemUiLCJzaXplU3VtIiwicG9zdHMiLCJwb3N0IiwiYXR0cyIsImNmcyIsImF0dCIsIm9yaWdpbmFsIiwiZGFpbHlQb3N0c0F0dGFjaG1lbnRzIiwic3RlZWRvc19zdGF0aXN0aWNzIiwic3BhY2VfbmFtZSIsIm93bmVyX25hbWUiLCJzdGVlZG9zIiwid29ya2Zsb3ciLCJmbG93cyIsImZvcm1zIiwiZmxvd19yb2xlcyIsImZsb3dfcG9zaXRpb25zIiwiaW5zdGFuY2VzIiwiaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQiLCJkYWlseV9mbG93cyIsImRhaWx5X2Zvcm1zIiwiZGFpbHlfaW5zdGFuY2VzIiwiY21zIiwic2l0ZXMiLCJjbXNfc2l0ZXMiLCJjbXNfcG9zdHMiLCJwb3N0c19sYXN0X21vZGlmaWVkIiwicG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsImNvbW1lbnRzIiwiY21zX2NvbW1lbnRzIiwiZGFpbHlfc2l0ZXMiLCJkYWlseV9wb3N0cyIsImRhaWx5X2NvbW1lbnRzIiwiZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwicGFyZW50IiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwibW9udGhzIiwic2V0X29iaiIsInBtIiwic2V0TW9udGgiLCJyb290VVJMIiwiY3JlYXRvciIsImlzRGV2ZWxvcG1lbnQiLCJkZWZpbmVQcm9wZXJ0eSIsImRlcHRoIiwicmVkdWNlIiwiZmxhdCIsInRvRmxhdHRlbiIsImlzQXJyYXkiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJzZWFyY2hpbmciLCJhdXRvV2lkdGgiLCJjaGFuZ2VTZWxlY3RvciIsIiRhbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxD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SUc7O0FESEpXLGNBQVF5USxTQUFTelEsS0FBakI7O0FBQ0EsV0FBT0EsS0FBUDtBQUNDLGFBQUF5USxZQUFBLFFBQUFoWSxNQUFBZ1ksU0FBQStjLElBQUEsWUFBQS8wQixJQUFtQmxCLE1BQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLElBQTRCLENBQTVCO0FBQ0N5SSxrQkFBUXlRLFNBQVMrYyxJQUFULENBQWM1MkIsV0FBZCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFSO0FBRkY7QUNRSTs7QURMSixXQUFPb0osS0FBUDtBQUNDLGVBQU87QUFBQ1gsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ1NHOztBRFJKLGFBQU9vUixRQUFQO0FBekJEO0FBQUEsR0FERCxDQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxyXG5cdGNvb2tpZXM6IFwiXjAuNi4yXCIsXHJcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXHJcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxyXG5cdFwidXJsLXNlYXJjaC1wYXJhbXMtcG9seWZpbGxcIjogXCJeNy4wLjBcIixcclxufSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZykge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFx0XCJ3ZWl4aW4tcGF5XCI6IFwiXjEuMS43XCJcclxuXHR9LCAnc3RlZWRvczpiYXNlJyk7XHJcbn0iLCJBcnJheS5wcm90b3R5cGUuc29ydEJ5TmFtZSA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcclxuICAgIGlmICghdGhpcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKCFsb2NhbGUpe1xyXG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcclxuICAgIH1cclxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XHJcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcclxuXHRcdHZhciBwMl9zb3J0X25vID0gcDIuc29ydF9ubyB8fCAwO1xyXG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcclxuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXHJcbiAgICAgICAgfWVsc2V7XHJcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcclxuXHRcdH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XHJcbiAgICAgICAgdi5wdXNoKG0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdjtcclxufVxyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIGlmIChmcm9tIDwgMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcclxuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xyXG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcclxufTtcclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTlr7nosaFBcnJheVxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciBnID0gW107XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiaWRcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgZy5wdXNoKHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGc7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maW5kUHJvcGVydHlCeVBLID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciByID0gbnVsbDtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xyXG4gICAgICAgIHZhciBkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHI7XHJcbn0iLCJTdGVlZG9zID1cclxuXHRzZXR0aW5nczoge31cclxuXHRkYjogZGJcclxuXHRzdWJzOiB7fVxyXG5cdGlzUGhvbmVFbmFibGVkOiAtPlxyXG5cdFx0cmV0dXJuICEhTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lXHJcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cclxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxyXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxyXG5cclxuXHRcdGlmICFudW1iZXJcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cclxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXHJcblx0XHRcdGlmIHNjYWxlIHx8IHNjYWxlID09IDBcclxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxyXG5cdFx0XHR1bmxlc3Mgbm90VGhvdXNhbmRzXHJcblx0XHRcdFx0aWYgIShzY2FsZSB8fCBzY2FsZSA9PSAwKVxyXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XHJcblx0XHRcdFx0XHRzY2FsZSA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLyk/WzFdPy5sZW5ndGhcclxuXHRcdFx0XHRcdHVubGVzcyBzY2FsZVxyXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcclxuXHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2dcclxuXHRcdFx0XHRpZiBzY2FsZSA9PSAwXHJcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcclxuXHRcdFx0XHRudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKVxyXG5cdFx0XHRyZXR1cm4gbnVtYmVyXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIlwiXHJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cclxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcclxuXHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIilcclxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXHJcblxyXG4jIyNcclxuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cclxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcclxuIyMjXHJcblxyXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XHJcblx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cclxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXHJcblx0XHRpZiBhY2NvdW50QmdCb2R5XHJcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcclxuXHRcdCMgaWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxyXG5cdFx0IyBcdGlmIHVybCA9PSBhdmF0YXJcclxuXHRcdCMgXHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXHJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcclxuXHRcdCMgXHRlbHNlXHJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcclxuXHRcdCMgZWxzZVxyXG5cdFx0IyBcdGJhY2tncm91bmQgPSBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8uYWRtaW4/LmJhY2tncm91bmRcclxuXHRcdCMgXHRpZiBiYWNrZ3JvdW5kXHJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXHJcblx0XHQjIFx0ZWxzZVxyXG5cdFx0IyBcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXHJcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXHJcblxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxyXG5cdFx0aWYgYWNjb3VudFNraW5cclxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcclxuXHRcdGlmIGFjY291bnRab29tXHJcblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xyXG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXHJcblx0XHR1bmxlc3Mgem9vbU5hbWVcclxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcclxuXHRcdFx0em9vbVNpemUgPSAxLjJcclxuXHRcdGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcclxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXHJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcclxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXHJcblx0XHRcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXHJcblx0XHRcdCMgZWxzZVxyXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRpZiBpc05lZWRUb0xvY2FsXHJcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXHJcblxyXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XHJcblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXHJcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxyXG5cclxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxyXG5cclxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcclxuXHJcblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHJcblx0XHRsaW5rZXIgPSBcIj9cIlxyXG5cclxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXHJcblx0XHRcdGxpbmtlciA9IFwiJlwiXHJcblxyXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdGF1dGhUb2tlbiA9IHt9O1xyXG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXHJcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XHJcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xyXG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXHJcblxyXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcclxuXHJcblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcclxuXHJcblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxyXG5cdFx0aWYgdXJsXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcclxuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblxyXG5cclxuXHRTdGVlZG9zLm9wZW5BcHAgPSAoYXBwX2lkKS0+XHJcblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblxyXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuXHRcdGlmICFhcHBcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxyXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxyXG5cdFx0IyBcdHVybCA9IGNyZWF0b3JTZXR0aW5ncy51cmxcclxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cclxuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXHJcblx0XHQjIFx0XHR1cmwgKz0gXCIvXCJcclxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXHJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcclxuXHRcdCMgXHRyZXR1cm5cclxuXHJcblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xyXG5cdFx0aWYgYXBwLmlzX3VzZV9pZVxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXHJcblx0XHRcdFx0aWYgb25fY2xpY2tcclxuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXHJcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXHJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XHJcblx0XHRcdFx0XHRpZiBlcnJvclxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3JcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHJcblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxyXG5cdFx0XHRGbG93Um91dGVyLmdvKGFwcC51cmwpXHJcblxyXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxyXG5cdFx0XHRpZiBhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxyXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxyXG5cclxuXHRcdGVsc2UgaWYgb25fY2xpY2tcclxuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5NcclxuXHRcdFx0ZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7I3tvbl9jbGlja319KSgpXCJcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiI3tlLm1lc3NhZ2V9XFxyXFxuI3tlLnN0YWNrfVwiXHJcblx0XHRlbHNlXHJcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXHJcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcclxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblxyXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXHJcblx0XHRtaW5fbW9udGhzID0gMVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRtaW5fbW9udGhzID0gM1xyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxyXG5cdFx0ZW5kX2RhdGUgPSBzcGFjZT8uZW5kX2RhdGVcclxuXHRcdGlmIHNwYWNlPy5pc19wYWlkIGFuZCBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXHJcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXHJcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcclxuXHJcblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cclxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXHJcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdHdoZW4gJ25vcm1hbCdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XHJcblx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcclxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXHJcblxyXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcclxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XHJcblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxyXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcclxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcclxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcclxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxyXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxyXG5cclxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XHJcblx0XHRlbHNlXHJcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXHJcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxyXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcclxuXHRcdGlmIG9mZnNldFxyXG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxyXG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XHJcblxyXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxyXG5cdFx0REVWSUNFID1cclxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXHJcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xyXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcclxuXHRcdFx0aXBhZDogJ2lwYWQnXHJcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcclxuXHRcdFx0aXBvZDogJ2lwb2QnXHJcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcclxuXHRcdGJyb3dzZXIgPSB7fVxyXG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXHJcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcclxuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxyXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxyXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcclxuXHRcdFx0JydcclxuXHRcdFx0REVWSUNFLmRlc2t0b3BcclxuXHRcdF1cclxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXHJcblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XHJcblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0aWYgaWZyXHJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcclxuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXHJcblx0XHRcdGlmci5sb2FkIC0+XHJcblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxyXG5cdFx0XHRcdGlmIGlmckJvZHlcclxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XHJcblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXHJcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xyXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxyXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcclxuXHJcbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXHJcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxyXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcclxuXHJcblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGNoZWNrID0gZmFsc2VcclxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xyXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcclxuXHRcdFx0Y2hlY2sgPSB0cnVlXHJcblx0XHRyZXR1cm4gY2hlY2tcclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXHJcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcclxuXHRcdHBhcmVudHMgPSBbXVxyXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cclxuXHRcdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXHJcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXHJcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXHJcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcclxuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxyXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxyXG5cclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdGkgPSAwXHJcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxyXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGkrK1xyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXHJcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcclxuXHRcdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cclxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XHJcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxyXG5cclxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxyXG5cclxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxyXG5cclxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXHJcblxyXG5cdFx0XHRpZiAhdXNlclxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcclxuXHJcblx0XHRcdGlmIHJlc3VsdC5lcnJvclxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gdXNlclxyXG5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cclxuXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXHJcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cclxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XHJcblx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdGxlbiA9IGtleS5sZW5ndGhcclxuXHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRpKytcclxuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XHJcblxyXG5cdFx0aWYgIWFjY2Vzc190b2tlblxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcclxuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHJldHVybiB1c2VySWRcclxuXHRcdGVsc2VcclxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcclxuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxyXG5cclxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxyXG5cdFx0XHRpZiBvYmpcclxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXHJcblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXHJcblxyXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cclxuXHRcdHRyeVxyXG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXHJcblxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXHJcblx0XHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblxyXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXHJcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxyXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcclxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXHJcblxyXG5taXhpbiA9IChvYmopIC0+XHJcblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxyXG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cclxuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cclxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxyXG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cclxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcclxuXHJcbiNtaXhpbihfcy5leHBvcnRzKCkpXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6VcclxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XHJcblx0XHRpZiAhZGF0ZVxyXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcclxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXHJcblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcclxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXHJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cclxuXHRcdFx0aWYgaSA8IGRheXNcclxuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxyXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXHJcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxyXG5cclxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxyXG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xyXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcclxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxyXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXHJcblxyXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXHJcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcclxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcclxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcclxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXHJcblxyXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblxyXG5cdFx0aiA9IDBcclxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcclxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gMFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xyXG5cdFx0XHRcdGogPSBsZW4vMlxyXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XHJcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcclxuXHJcblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcclxuXHRcdFx0XHRcdGJyZWFrXHJcblxyXG5cdFx0XHRcdGkrK1xyXG5cclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxyXG5cclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxyXG5cclxuXHRcdGlmIGogPiBtYXhfaW5kZXhcclxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6VcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcclxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxyXG5cclxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Xy5leHRlbmQgU3RlZWRvcyxcclxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxyXG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXHJcblx0XHRcdGlmIGFwcFxyXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcclxuXHJcblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcclxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcclxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXHJcblx0XHRcdGlmIGlzSTE4blxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdFx0XHRyZXR1cm4gbG9jYWxlXHJcblxyXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxyXG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcclxuXHJcblxyXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxyXG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXHJcblx0XHRcdHZhbGlkID0gdHJ1ZVxyXG5cdFx0XHR1bmxlc3MgcHdkXHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcclxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yXHJcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcclxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxyXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXHJcbiNcdFx0XHRlbHNlXHJcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0aWYgdmFsaWRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxyXG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cclxuXHJcblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXHJcblxyXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxyXG5cdGRiQXBwcyA9IHt9XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZm9yRWFjaCAoYXBwKS0+XHJcblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcclxuXHJcblx0cmV0dXJuIGRiQXBwc1xyXG5cclxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSAoc3BhY2VfaWQpLT5cclxuXHRkYkRhc2hib2FyZHMgPSB7fVxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZvckVhY2ggKGRhc2hib2FyZCktPlxyXG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXHJcblxyXG5cdHJldHVybiBkYkRhc2hib2FyZHNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXHJcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXHJcblx0XHRyZXR1cm4gYXV0aFRva2VuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxyXG4jXHRcdGVsc2VcclxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcclxuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxyXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xyXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbjsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpIHtcbiAgICB2YXIgcmVmLCByZWYxLCByZWc7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoc2NhbGUgfHwgc2NhbGUgPT09IDApIHtcbiAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSk7XG4gICAgICB9XG4gICAgICBpZiAoIW5vdFRob3VzYW5kcykge1xuICAgICAgICBpZiAoIShzY2FsZSB8fCBzY2FsZSA9PT0gMCkpIHtcbiAgICAgICAgICBzY2FsZSA9IChyZWYgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMV0pICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZztcbiAgICAgICAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciB6b29tTmFtZSwgem9vbVNpemU7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICB9XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuICAgIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lO1xuICAgIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplO1xuICAgIGlmICghem9vbU5hbWUpIHtcbiAgICAgIHpvb21OYW1lID0gXCJsYXJnZVwiO1xuICAgICAgem9vbVNpemUgPSAxLjI7XG4gICAgfVxuICAgIGlmICh6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpKSB7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tXCIgKyB6b29tTmFtZSk7XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLCBhY2NvdW50Wm9vbVZhbHVlLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLCBhY2NvdW50Wm9vbVZhbHVlLnNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZiA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWYyID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjNbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWZbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjIuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYzID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZiwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWYudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHBhc3N3b3JQb2xpY3ksIHBhc3N3b3JQb2xpY3lFcnJvciwgcmVhc29uLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHZhbGlkO1xuICAgICAgcmVhc29uID0gdChcInBhc3N3b3JkX2ludmFsaWRcIik7XG4gICAgICB2YWxpZCA9IHRydWU7XG4gICAgICBpZiAoIXB3ZCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGFzc3dvclBvbGljeSA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEucG9saWN5IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcGFzc3dvclBvbGljeUVycm9yID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLnBvbGljeUVycm9yIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKHBhc3N3b3JQb2xpY3kpIHtcbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpKSB7XG4gICAgICAgICAgcmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiRGFzaGJvYXJkcztcbiAgZGJEYXNoYm9hcmRzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICByZXR1cm4gZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmV0dXJuIGRiRGFzaGJvYXJkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XHJcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICBNZXRlb3IubWV0aG9kc1xyXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxyXG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVzaDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRzZXQ6IFxyXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxyXG4gICAgICAgICAgICBlbWFpbHM6IFtcclxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxyXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgICAgICAgICBdXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcclxuICAgICAgICBwID0gbnVsbFxyXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxyXG4gICAgICAgICAgICBwID0gZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVsbDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgcFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcclxuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxyXG5cclxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXHJcbiAgICAgICAgJHNldDpcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgICBlbWFpbDogZW1haWxcclxuXHJcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICByZXR1cm4ge31cclxuXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cclxuICAgICAgICBzd2FsXHJcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXHJcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcclxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcclxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxyXG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcclxuIyMjXHJcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XHJcblxyXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcclxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xyXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxyXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XHJcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IubWV0aG9kc1xyXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XHJcbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XHJcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XHJcblx0fSkoKSxcclxuXHRyZXNldFBhc3N3b3JkOiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XHJcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR2ZXJpZnlFbWFpbDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5yb2xsQWNjb3VudDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXHJcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gIFxyXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcclxuXHRpZiAob3Jncy5jb3VudCgpPjApXHJcblx0e1xyXG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxyXG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fVx0XHJcblxyXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xyXG4gICAgXHRkYXRhOiB7XHJcblx0ICAgICAgXHRyZXQ6IDAsXHJcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcclxuICAgIFx0fVxyXG4gIFx0fSk7XHJcbn0pO1xyXG5cclxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxyXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XHJcbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXHJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXHJcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcclxuXHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxyXG5cdFx0c3BhY2VzID0gW11cclxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cclxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cclxuXHRpY29uOiBcImdsb2JlXCJcclxuXHRjb2xvcjogXCJibHVlXCJcclxuXHR0YWJsZUNvbHVtbnM6IFtcclxuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcclxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXHJcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxyXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcclxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxyXG5cdF1cclxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxyXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXHJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXHJcblx0c2hvd0RlbENvbHVtbjogZmFsc2VcclxuXHRkaXNhYmxlQWRkOiB0cnVlXHJcblx0cGFnZUxlbmd0aDogMTAwXHJcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcclxuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcclxuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXHJcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXHJcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xyXG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XHJcbiAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xyXG4gICAgdmFyIGs7XHJcbiAgICBpZiAobiA+PSAwKSB7XHJcbiAgICAgIGsgPSBuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IGxlbiArIG47XHJcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcclxuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufSIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuXHJcbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcclxuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxyXG4gICAgICB3d3c6IFxyXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcclxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cclxuXHRsaXN0Vmlld3MgPSB7fVxyXG5cclxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXHJcblxyXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cclxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblxyXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxyXG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcclxuXHJcblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cclxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcclxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxyXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBsaXN0Vmlld3NcclxuXHJcblxyXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxyXG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cclxuXHJcblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcclxuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xyXG5cclxuXHJcblxyXG5cclxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIi8vIFNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICd1c2Ugc3RyaWN0JztcclxuXHJcbi8vICAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XHJcblxyXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuLy8gICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4vLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xyXG4vLyAgICAgfVxyXG4vLyAgIH07XHJcbi8vICAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xyXG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcclxuLy8gICB9O1xyXG4vLyAgIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICB9O1xyXG5cclxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xyXG4vLyAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfVxyXG4vLyAgIH0pO1xyXG5cclxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXHJcbi8vICAgdmFyIGFwaSA9IHtcclxuLy8gICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XHJcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcclxuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuLy8gICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcclxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XHJcbi8vICAgICAgIH1cclxuLy8gICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcclxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuLy8gICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XHJcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcblxyXG4vLyAgICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuXHJcbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xyXG4vLyAgICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcclxuLy8gICAgICAgfVxyXG5cclxuLy8gICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xyXG4vLyAgICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcclxuLy8gICAgICAgfVxyXG5cclxuLy8gICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcclxuLy8gICAgIH1cclxuLy8gICB9O1xyXG5cclxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xyXG4vLyAgICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcclxuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4vLyAgICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH0pXHJcbi8vICAgICB9XHJcbi8vICAgfSlcclxuXHJcbi8vICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG4vLyAgICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcclxuLy8gICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcclxuLy8gICAgIC8vICAgfVxyXG4vLyAgICAgLy8gfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xyXG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xyXG5cclxuLy8gICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xyXG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcclxuLy8gICAgICAgfSk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XHJcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbi8vICAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcclxuXHJcbi8vICAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcclxuXHJcbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXHJcbi8vICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XHJcblxyXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcclxuLy8gICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xyXG5cclxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7ICBcclxuXHJcbi8vICAgICAvLyBzZXJ2ZXItb25seSBhcGlcclxuLy8gICAgIF8uZXh0ZW5kKGFwaSwge1xyXG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xyXG4vLyAgICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7XHJcbi8vICAgfVxyXG5cclxuLy8gICByZXR1cm4gYXBpO1xyXG4vLyB9KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcclxuXHJcblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXHJcblxyXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxyXG5cdFx0XHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXHJcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxyXG5cclxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcclxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblxyXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcclxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cclxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcclxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxyXG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cclxuXHRcclxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG4gICAgICAgIGlmIHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG4gICAgICAgICMgdGhlbiBjaGVjayBjb29raWVcclxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuICAgICAgICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLCBcclxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcclxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cclxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogW107XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge30iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXHJcblx0aWYgYXBwXHJcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcclxuXHRlbHNlXHJcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXHJcblxyXG5cdGlmICFyZWRpcmVjdFVybFxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuXHQjIGlmIHJlcS5ib2R5XHJcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHQjIGRlcy1jYmNcclxuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXHJcblx0XHRcdGtleTggPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDhcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDggLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXHJcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxyXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXHJcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0am9pbmVyID0gXCI/XCJcclxuXHJcblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxyXG5cclxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRyZXMuZW5kKClcclxuXHRyZXR1cm5cclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHQjIHRoaXMucGFyYW1zID1cclxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxyXG5cdFx0d2lkdGggPSA1MCA7XHJcblx0XHRoZWlnaHQgPSA1MCA7XHJcblx0XHRmb250U2l6ZSA9IDI4IDtcclxuXHRcdGlmIHJlcS5xdWVyeS53XHJcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XHJcblx0XHRpZiByZXEucXVlcnkuaFxyXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcclxuXHRcdGlmIHJlcS5xdWVyeS5mc1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XHJcblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XHJcblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxyXG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxyXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcclxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcclxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcclxuXHRcdGlmICF1c2VybmFtZVxyXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxyXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcclxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cclxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxyXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cclxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcclxuXHJcblx0XHRcdGluaXRpYWxzID0gJydcclxuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cclxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XHJcblx0XHRcdFx0PC90ZXh0PlxyXG5cdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cclxuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XHJcblx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXHJcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcclxuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cclxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cclxuICAgICAgICBpZiBzcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcclxuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcclxuXHJcblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xyXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxyXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblx0XHR1c2VyU3BhY2VzID0gW11cclxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcclxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cclxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxyXG5cclxuXHRcdGhhbmRsZTIgPSBudWxsXHJcblxyXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXHJcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcclxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0aWYgZG9jLnNwYWNlXHJcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcclxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcclxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXHJcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXHJcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxyXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XHJcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xyXG5cclxuXHRcdHNlbGYucmVhZHkoKTtcclxuXHJcblx0XHRzZWxmLm9uU3RvcCAtPlxyXG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXHJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxyXG5cdHVubGVzcyBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0dW5sZXNzIF9pZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJzdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xyXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xyXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9jb3JlXCIpO1xyXG5zdGVlZG9zTGljZW5zZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9saWNlbnNlXCIpO1xyXG5jbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcclxuXHJcbl9nZXRMb2NhbGUgPSAodXNlciktPlxyXG5cdGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnemgtY24nXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRlbHNlIGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnZW4tdXMnXHJcblx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRlbHNlXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRyZXR1cm4gbG9jYWxlXHJcblxyXG5nZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIik/LmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGV9KS5mZXRjaCgpO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsKHJlcSwgcmVzLCBuZXh0KS0+XHJcblx0dXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcblx0c3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnBhcmFtcz8uc3BhY2VJZFxyXG5cdGlmICF1c2VySWRcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDQwMyxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYiktPlxyXG5cdFx0XHRzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxyXG5cdFx0KShhdXRoVG9rZW4sIHNwYWNlSWQpXHJcblx0XHJcblx0dW5sZXNzIHVzZXJTZXNzaW9uXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiA1MDAsXHJcblx0XHRcdGRhdGE6IG51bGxcclxuXHRcdHJldHVyblxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge25hbWU6IDF9fSlcclxuXHJcblx0cmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xyXG4jXHRjb25zb2xlLnRpbWUoJ3RyYW5zbGF0aW9uT2JqZWN0cycpO1xyXG5cdGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtsb2NhbGU6IDF9fSkpXHJcblx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3RzKGxuZywgcmVzdWx0Lm9iamVjdHMpO1xyXG4jXHRjb25zb2xlLnRpbWVFbmQoJ3RyYW5zbGF0aW9uT2JqZWN0cycpO1xyXG5cdHJlc3VsdC51c2VyID0gdXNlclNlc3Npb25cclxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxyXG5cdHJlc3VsdC5hcHBzID0gY2xvbmUoQ3JlYXRvci5BcHBzKVxyXG5cdHJlc3VsdC5kYXNoYm9hcmRzID0gY2xvbmUoQ3JlYXRvci5EYXNoYm9hcmRzKVxyXG5cdHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKVxyXG5cdHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwgJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkXHJcblx0cGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jICh2LCB1c2VyU2Vzc2lvbiwgY2IpLT5cclxuXHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblxyXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XHJcblx0XHRpZiBuYW1lICE9ICdkZWZhdWx0J1xyXG5cdFx0XHRkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpXHJcblx0XHRcdF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgKHYsIGspLT5cclxuXHRcdFx0XHRfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKHYudG9Db25maWcoKSksIHNwYWNlSWQpXHJcbiNcdFx0XHRcdF9vYmoubmFtZSA9IFwiI3tuYW1lfS4je2t9XCJcclxuXHRcdFx0XHRfb2JqLm5hbWUgPSBrXHJcblx0XHRcdFx0X29iai5kYXRhYmFzZV9uYW1lID0gbmFtZVxyXG5cdFx0XHRcdF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbilcclxuXHRcdFx0XHRyZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29ialxyXG5cdFx0XHQpXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdHJlc3VsdC5hcHBzID0gXy5leHRlbmQgcmVzdWx0LmFwcHMsIGNsb25lKGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKVxyXG5cdFx0cmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZCByZXN1bHQuZGFzaGJvYXJkcywgZGF0YXNvdXJjZS5nZXREYXNoYm9hcmRzQ29uZmlnKClcclxuXHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKCByZXN1bHQuYXBwcyB8fCB7fSwgQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCkpXHJcblx0cmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZCggcmVzdWx0LmRhc2hib2FyZHMgfHwge30sIENyZWF0b3IuZ2V0REJEYXNoYm9hcmRzKHNwYWNlSWQpKVxyXG5cclxuXHRfQXBwcyA9IHt9XHJcblx0Xy5lYWNoIHJlc3VsdC5hcHBzLCAoYXBwLCBrZXkpIC0+XHJcblx0XHRpZiAhYXBwLl9pZFxyXG5cdFx0XHRhcHAuX2lkID0ga2V5XHJcblx0XHRpZiBhcHAuY29kZVxyXG5cdFx0XHRhcHAuX2RiaWQgPSBhcHAuX2lkXHJcblx0XHRcdGFwcC5faWQgPSBhcHAuY29kZVxyXG5cdFx0X0FwcHNbYXBwLl9pZF0gPSBhcHBcclxuXHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbkFwcHMobG5nLCBfQXBwcyk7XHJcblx0cmVzdWx0LmFwcHMgPSBfQXBwcztcclxuXHRhc3NpZ25lZF9tZW51cyA9IGNsb25lKHJlc3VsdC5hc3NpZ25lZF9tZW51cyk7XHJcblx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25NZW51cyhsbmcsIGFzc2lnbmVkX21lbnVzKTtcclxuXHRyZXN1bHQuYXNzaWduZWRfbWVudXMgPSBhc3NpZ25lZF9tZW51cztcclxuXHJcblx0X0Rhc2hib2FyZHMgPSB7fVxyXG5cdF8uZWFjaCByZXN1bHQuZGFzaGJvYXJkcywgKGRhc2hib2FyZCwga2V5KSAtPlxyXG5cdFx0aWYgIWRhc2hib2FyZC5faWRcclxuXHRcdFx0ZGFzaGJvYXJkLl9pZCA9IGtleVxyXG5cdFx0X0Rhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmRcclxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IF9EYXNoYm9hcmRzXHJcblxyXG5cdHJlc3VsdC5wbHVnaW5zID0gc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucz8oKVxyXG5cclxuXHRvYmplY3RzTGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0KHVzZXJJZCwgc3BhY2VJZCk7XHJcblxyXG5cdGlmIG9iamVjdHNMYXlvdXRcclxuXHRcdF8uZWFjaCBvYmplY3RzTGF5b3V0LCAob2JqZWN0TGF5b3V0KS0+XHJcblx0XHRcdF9vYmplY3QgPSBjbG9uZShyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdKTtcclxuXHRcdFx0aWYgX29iamVjdFxyXG5cdFx0XHRcdF9maWVsZHMgPSB7fTtcclxuXHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmZpZWxkcywgKF9pdGVtKS0+XHJcblx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXSA9IF9vYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXVxyXG5cdFx0XHRcdFx0aWYgXy5oYXMoX2l0ZW0sICdncm91cCcpXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5ncm91cCA9IF9pdGVtLmdyb3VwXHJcblx0XHRcdFx0XHRpZiBfaXRlbS5yZXF1aXJlZFxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8ucmVhZG9ubHkgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8uZGlzYWJsZWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8ucmVxdWlyZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRlbHNlIGlmIF9pdGVtLnJlYWRvbmx5XHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZWFkb25seSA9IHRydWVcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LmRpc2FibGVkID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8ucmVxdWlyZWQgPSBmYWxzZVxyXG5cdFx0XHRcdF9vYmplY3QuZmllbGRzID0gX2ZpZWxkc1xyXG5cclxuI1x0XHRcdFx0X2FjdGlvbnMgPSB7fTtcclxuI1x0XHRcdFx0Xy5lYWNoIG9iamVjdExheW91dC5hY3Rpb25zLCAoYWN0aW9uTmFtZSktPlxyXG4jXHRcdFx0XHRcdF9hY3Rpb25zW2FjdGlvbk5hbWVdID0gX29iamVjdC5hY3Rpb25zW2FjdGlvbk5hbWVdXHJcbiNcdFx0XHRcdF9vYmplY3QuYWN0aW9ucyA9IF9hY3Rpb25zXHJcblx0XHRcdFx0X29iamVjdC5hbGxvd19hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW11cclxuXHRcdFx0XHRfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdXHJcblx0XHRcdHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0gPSBfb2JqZWN0XHJcblx0IyBUT0RPIG9iamVjdCBsYXlvdXQg5piv5ZCm6ZyA6KaB5o6n5Yi25a6h5om56K6w5b2V5pi+56S677yfXHJcblx0c3BhY2VQcm9jZXNzRGVmaW5pdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInByb2Nlc3NfZGVmaW5pdGlvblwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgYWN0aXZlOiB0cnVlfSwge2ZpZWxkczoge29iamVjdF9uYW1lOiAxfX0pLmZldGNoKCk7XHJcblx0Xy5lYWNoIHNwYWNlUHJvY2Vzc0RlZmluaXRpb24sIChpdGVtKS0+XHJcblx0XHRyZXN1bHQub2JqZWN0c1tpdGVtLm9iamVjdF9uYW1lXT8uZW5hYmxlX3Byb2Nlc3MgPSB0cnVlXHJcblx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdGNvZGU6IDIwMCxcclxuXHRcdGRhdGE6IHJlc3VsdFxyXG4iLCJ2YXIgX2dldExvY2FsZSwgY2xvbmUsIGdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCwgc3RlZWRvc0F1dGgsIHN0ZWVkb3NDb3JlLCBzdGVlZG9zSTE4biwgc3RlZWRvc0xpY2Vuc2U7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZShcIkBzdGVlZG9zL2NvcmVcIik7XG5cbnN0ZWVkb3NMaWNlbnNlID0gcmVxdWlyZShcIkBzdGVlZG9zL2xpY2Vuc2VcIik7XG5cbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5fZ2V0TG9jYWxlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgbG9jYWxlLCByZWYsIHJlZjE7XG4gIGlmICgodXNlciAhPSBudWxsID8gKHJlZiA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnemgtY24nKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9IGVsc2UgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmMSA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmMS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ2VuLXVzJykge1xuICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH1cbiAgcmV0dXJuIGxvY2FsZTtcbn07XG5cbmdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgcmVmLCBzcGFjZVVzZXI7XG4gIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikpICE9IG51bGwgPyByZWYuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgIH0pLmZldGNoKCkgOiB2b2lkIDA7XG4gIH1cbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBfQXBwcywgX0Rhc2hib2FyZHMsIGFzc2lnbmVkX21lbnVzLCBhdXRoVG9rZW4sIGxuZywgb2JqZWN0c0xheW91dCwgcGVybWlzc2lvbnMsIHJlZiwgcmVzdWx0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VQcm9jZXNzRGVmaW5pdGlvbiwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddO1xuICBzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gIGlmICghdXNlcklkKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNDAzLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gIGlmICghdXNlclNlc3Npb24pIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA1MDAsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcbiAgbG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgbG9jYWxlOiAxXG4gICAgfVxuICB9KSk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0cyhsbmcsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvbjtcbiAgcmVzdWx0LnNwYWNlID0gc3BhY2U7XG4gIHJlc3VsdC5hcHBzID0gY2xvbmUoQ3JlYXRvci5BcHBzKTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBjbG9uZShDcmVhdG9yLkRhc2hib2FyZHMpO1xuICByZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cyk7XG4gIHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwoJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkKTtcbiAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgIHJldHVybiB2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgZGF0YXNvdXJjZU9iamVjdHM7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZGF0YXNvdXJjZU9iamVjdHMgPSBkYXRhc291cmNlLmdldE9iamVjdHMoKTtcbiAgICAgIHJldHVybiBfLmVhY2goZGF0YXNvdXJjZU9iamVjdHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgdmFyIF9vYmo7XG4gICAgICAgIF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZCk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMsIGNsb25lKGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKSk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXNoYm9hcmRzID0gXy5leHRlbmQocmVzdWx0LmRhc2hib2FyZHMsIGRhdGFzb3VyY2UuZ2V0RGFzaGJvYXJkc0NvbmZpZygpKTtcbiAgfSk7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMgfHwge30sIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpKTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZChyZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpO1xuICBfQXBwcyA9IHt9O1xuICBfLmVhY2gocmVzdWx0LmFwcHMsIGZ1bmN0aW9uKGFwcCwga2V5KSB7XG4gICAgaWYgKCFhcHAuX2lkKSB7XG4gICAgICBhcHAuX2lkID0ga2V5O1xuICAgIH1cbiAgICBpZiAoYXBwLmNvZGUpIHtcbiAgICAgIGFwcC5fZGJpZCA9IGFwcC5faWQ7XG4gICAgICBhcHAuX2lkID0gYXBwLmNvZGU7XG4gICAgfVxuICAgIHJldHVybiBfQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcbiAgcmVzdWx0LmFwcHMgPSBfQXBwcztcbiAgYXNzaWduZWRfbWVudXMgPSBjbG9uZShyZXN1bHQuYXNzaWduZWRfbWVudXMpO1xuICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xuICByZXN1bHQuYXNzaWduZWRfbWVudXMgPSBhc3NpZ25lZF9tZW51cztcbiAgX0Rhc2hib2FyZHMgPSB7fTtcbiAgXy5lYWNoKHJlc3VsdC5kYXNoYm9hcmRzLCBmdW5jdGlvbihkYXNoYm9hcmQsIGtleSkge1xuICAgIGlmICghZGFzaGJvYXJkLl9pZCkge1xuICAgICAgZGFzaGJvYXJkLl9pZCA9IGtleTtcbiAgICB9XG4gICAgcmV0dXJuIF9EYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfRGFzaGJvYXJkcztcbiAgcmVzdWx0LnBsdWdpbnMgPSB0eXBlb2Ygc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucyA9PT0gXCJmdW5jdGlvblwiID8gc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucygpIDogdm9pZCAwO1xuICBvYmplY3RzTGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0KHVzZXJJZCwgc3BhY2VJZCk7XG4gIGlmIChvYmplY3RzTGF5b3V0KSB7XG4gICAgXy5lYWNoKG9iamVjdHNMYXlvdXQsIGZ1bmN0aW9uKG9iamVjdExheW91dCkge1xuICAgICAgdmFyIF9maWVsZHMsIF9vYmplY3Q7XG4gICAgICBfb2JqZWN0ID0gY2xvbmUocmVzdWx0Lm9iamVjdHNbb2JqZWN0TGF5b3V0Lm9iamVjdF9uYW1lXSk7XG4gICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICBfZmllbGRzID0ge307XG4gICAgICAgIF8uZWFjaChvYmplY3RMYXlvdXQuZmllbGRzLCBmdW5jdGlvbihfaXRlbSkge1xuICAgICAgICAgIHZhciByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3O1xuICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdO1xuICAgICAgICAgIGlmIChfLmhhcyhfaXRlbSwgJ2dyb3VwJykpIHtcbiAgICAgICAgICAgIGlmICgocmVmMSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjEuZ3JvdXAgPSBfaXRlbS5ncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9pdGVtLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICBpZiAoKHJlZjIgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYyLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHJlZjMgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjQgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjQucmVxdWlyZWQgPSB0cnVlIDogdm9pZCAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAoX2l0ZW0ucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGlmICgocmVmNSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjUucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChyZWY2ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmNi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjcgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjcucmVxdWlyZWQgPSBmYWxzZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBfb2JqZWN0LmZpZWxkcyA9IF9maWVsZHM7XG4gICAgICAgIF9vYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdO1xuICAgICAgICBfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0gPSBfb2JqZWN0O1xuICAgIH0pO1xuICB9XG4gIHNwYWNlUHJvY2Vzc0RlZmluaXRpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwcm9jZXNzX2RlZmluaXRpb25cIikuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgYWN0aXZlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG9iamVjdF9uYW1lOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2goc3BhY2VQcm9jZXNzRGVmaW5pdGlvbiwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiAocmVmMSA9IHJlc3VsdC5vYmplY3RzW2l0ZW0ub2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmMS5lbmFibGVfcHJvY2VzcyA9IHRydWUgOiB2b2lkIDA7XG4gIH0pO1xuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRib2R5ID0gXCJcIlxyXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XHJcblx0XHRcdGJvZHkgKz0gY2h1bmtcclxuXHRcdClcclxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxyXG5cdFx0XHRcdHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpXHJcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxyXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0IyDnibnliKvmj5DphpLvvJrllYbmiLfns7vnu5/lr7nkuo7mlK/ku5jnu5PmnpzpgJrnn6XnmoTlhoXlrrnkuIDlrpropoHlgZrnrb7lkI3pqozor4Es5bm25qCh6aqM6L+U5Zue55qE6K6i5Y2V6YeR6aKd5piv5ZCm5LiO5ZWG5oi35L6n55qE6K6i5Y2V6YeR6aKd5LiA6Ie077yM6Ziy5q2i5pWw5o2u5rOE5ryP5a+86Ie05Ye6546w4oCc5YGH6YCa55+l4oCd77yM6YCg5oiQ6LWE6YeR5o2f5aSxXHJcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRcdFx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXHJcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcclxuXHRcdFx0XHRcdFx0Y29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWRcclxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxyXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXHJcblx0XHRcdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe19pZDogY29kZV91cmxfaWR9LCB7JHNldDoge3BhaWQ6IHRydWV9fSlcclxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpLCAoZXJyKS0+XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGFwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUnXHJcblx0XHRcdClcclxuXHRcdClcclxuXHRcdFxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXHJcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcclxuXHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cclxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XHJcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcclxuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXHJcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXHJcblx0XHRyZVZhbHVlID1cclxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdGlzTGltaXQgPSBmYWxzZVxyXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcclxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcclxuXHJcblx0XHRpZiBsaW1pdHMubGVuZ3RoXHJcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdFx0XHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cclxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xyXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcclxuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3NcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xyXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXHJcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcclxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXHJcblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxyXG5cclxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcclxuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcclxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcclxuXHJcblx0XHRpZiBpc0xpbWl0XHJcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxyXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxyXG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXHJcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cclxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcclxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblx0XHRyZXR1cm4gcmVWYWx1ZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcclxuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xyXG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xyXG5cclxuICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xyXG4gICAgICAgIG9iai5rZXkgPSBrZXk7XHJcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgIH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGMgPiAwKSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSkiLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XHJcblx0XHRjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpXHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHJcblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRpZiBzcGFjZV9pZFxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGVsc2VcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRyZXN1bHQgPSBbXVxyXG5cdFx0c3BhY2VzLmZvckVhY2ggKHMpIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGUgPSB7fVxyXG5cdFx0XHRcdGUuX2lkID0gcy5faWRcclxuXHRcdFx0XHRlLm5hbWUgPSBzLm5hbWVcclxuXHRcdFx0XHRlLmVyciA9IGVyclxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcclxuXHRcdGlmIHJlc3VsdC5sZW5ndGggPiAwXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbFxyXG5cdFx0XHRcdEVtYWlsLnNlbmRcclxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcclxuXHRcdFx0XHRcdGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb21cclxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcclxuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXHJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcclxuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xyXG5cclxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxyXG5cclxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXHJcblxyXG5cdFx0dW5sZXNzIHVzZXJfaWRcclxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxyXG5cclxuXHRcdHJldHVybiB1c2VybmFtZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXHJcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxyXG5cdFx0Y2hlY2sgZW5kX2RhdGUsIFN0cmluZyBcclxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcclxuXHJcblx0XHR1c2VyX2lkID0gdGhpcy51c2VySWRcclxuXHJcblx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0b3JkZXJfYm9keSA9IFtdXHJcblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XHJcblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXHJcblx0XHRcdG9yZGVyX2JvZHkucHVzaCBtLm5hbWVfemhcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgbm90IHNwYWNlLmlzX3BhaWRcclxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXHJcblx0XHRcdGlmIHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuKjEwMFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxyXG5cclxuXHRcdHJlc3VsdF9vYmogPSB7fVxyXG5cclxuXHRcdGF0dGFjaCA9IHt9XHJcblx0XHRhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWRcclxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblxyXG5cdFx0d3hwYXkgPSBXWFBheSh7XHJcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXHJcblx0XHR9KVxyXG5cclxuXHRcdHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XHJcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXHJcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHR0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcclxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXHJcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXHJcblx0XHRcdHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxyXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXHJcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxyXG5cdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKGVyciwgcmVzdWx0KSAtPiBcclxuXHRcdFx0XHRpZiBlcnIgXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xyXG5cdFx0XHRcdGlmIHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqID0ge31cclxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcclxuXHRcdFx0XHRcdG9iai5jcmVhdGVkID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XHJcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKVxyXG5cdFx0XHQpLCAoZSktPlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgZS5zdGFja1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblxyXG5cdFx0XHJcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJyk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coZS5zdGFjayk7XG4gICAgfSkpO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3RcclxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXHJcblxyXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcclxuXHJcblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XHJcbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXHJcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcclxuXHJcbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxyXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXHJcblxyXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcclxuICAgICAgICAgICAgX2lkOiB7XHJcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXHJcblxyXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEgfSB9KS5mZXRjaCgpXHJcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cclxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcclxuICAgICAgICAgICAgaWYgZmxcclxuICAgICAgICAgICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZVxyXG4gICAgICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXHJcbiAgICAgICAgICAgICAgICBpZiBwZXJtc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcclxuXHJcbiAgICAgICAgb3dzID0gb3dzLmZpbHRlciAobiktPlxyXG4gICAgICAgICAgICByZXR1cm4gbi5mbG93X25hbWVcclxuXHJcbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIF8uZWFjaChvd3MsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBmbCwgcGVybXM7XG4gICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGZsKSB7XG4gICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICAgIGlmIChwZXJtcykge1xuICAgICAgICAgIGlmIChwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKSkge1xuICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChvcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgb3dzID0gb3dzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5mbG93X25hbWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKVxyXG5cdFx0XHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcclxuXHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxyXG5cclxuXHRcdHVubGVzcyBpc1NwYWNlQWRtaW5cclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxyXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xyXG5cdFx0dXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcclxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXHJcblxyXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxyXG5cclxuXHRcdFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZClcclxuXHRcdGxvZ291dCA9IHRydWU7XHJcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXHJcblx0XHRcdGxvZ291dCA9IGZhbHNlXHJcblx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge2xvZ291dDogbG9nb3V0fSlcclxuXHRcdGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXHJcblx0XHRpZiBjaGFuZ2VkVXNlckluZm9cclxuXHRcdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHB1c2g6IHsnc2VydmljZXMucGFzc3dvcmRfaGlzdG9yeSc6IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcz8ucGFzc3dvcmQ/LmJjcnlwdH19KVxyXG5cclxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXHJcblx0XHRpZiB1c2VyQ1AubW9iaWxlICYmIHVzZXJDUC5tb2JpbGVfdmVyaWZpZWRcclxuXHRcdFx0bGFuZyA9ICdlbidcclxuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXHJcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcclxuXHRcdFx0U01TUXVldWUuc2VuZFxyXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxyXG5cdFx0XHRcdEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxyXG5cdFx0XHRcdFBhcmFtU3RyaW5nOiAnJyxcclxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXHJcblx0XHRcdFx0U2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxyXG5cdFx0XHRcdFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXHJcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXHJcblxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2hhbmdlZFVzZXJJbmZvLCBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCBsb2dvdXQsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmICghaXNTcGFjZUFkbWluKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV91c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgU3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBsb2dvdXQgPSB0cnVlO1xuICAgIGlmICh0aGlzLnVzZXJJZCA9PT0gdXNlcl9pZCkge1xuICAgICAgbG9nb3V0ID0gZmFsc2U7XG4gICAgfVxuICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7XG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH0pO1xuICAgIGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgaWYgKGNoYW5nZWRVc2VySW5mbykge1xuICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB1c2VyX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgJ3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiAocmVmMSA9IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjIuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cclxuXHJcbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXHJcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XHJcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cclxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0Y291bnRfZGF5cyA9IDBcclxuXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxyXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxyXG5cclxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxyXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXHJcblxyXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcclxuXHRcdCMgZG8gbm90aGluZ1xyXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cclxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxyXG5cclxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cclxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cclxuXHRsYXN0X2JpbGwgPSBudWxsXHJcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcclxuXHJcblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcclxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGNyZWF0ZWQ6IHtcclxuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdClcclxuXHRpZiBwYXltZW50X2JpbGxcclxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxyXG5cdGVsc2VcclxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXHJcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHJcblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdGlmIGFwcF9iaWxsXHJcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXHJcblxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXHJcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxyXG5cdHNldE9iaiA9IG5ldyBPYmplY3RcclxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxyXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcclxuXHJcbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XHJcblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcclxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHJcblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxyXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHR7XHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XHJcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XHJcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXHJcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcclxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XHJcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcclxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2VcclxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xyXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XHJcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cclxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxyXG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcclxuXHRkYi5iaWxsaW5ncy5maW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XHJcblx0XHR9XHJcblx0KS5mb3JFYWNoIChiaWxsKS0+XHJcblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxyXG5cclxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cclxuXHRtb2R1bGVzID0gbmV3IEFycmF5XHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXHJcblxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cclxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXHJcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcclxuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3JlYXRlZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcclxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xyXG5cdFx0XHQjICBkbyBub3RoaW5nXHJcblxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcclxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXHJcblxyXG5cdHJldHVybiBtb2R1bGVzXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxyXG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cclxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcclxuXHQpXHJcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxyXG5cclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXHJcblx0XHRyZXR1cm5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGRlYml0cyA9IDBcclxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdCkuZm9yRWFjaCgoYiktPlxyXG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcclxuXHRcdClcclxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcclxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXHJcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxyXG5cdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0aWYgZGViaXRzID4gMFxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXHJcblxyXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdGVsc2VcclxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxyXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcclxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxyXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXHJcblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcclxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cclxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcclxuXHJcblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHJcblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XHJcblxyXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcclxuXHJcblx0bSA9IG1vbWVudCgpXHJcblx0bm93ID0gbS5fZFxyXG5cclxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxyXG5cclxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXHJcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXHJcblxyXG5cdCMg5pu05pawbW9kdWxlc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcclxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXHJcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxyXG5cclxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXHJcblx0aWYgclxyXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XHJcblx0XHRcdG1jbCA9IG5ldyBPYmplY3RcclxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcclxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxyXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcclxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxyXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xyXG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcclxuXHJcblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcclxuXHJcbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XHJcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcclxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcclxuXHJcbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghZ29fbmV4dClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xyXG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXHJcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcclxuICAgICAgICByZXR1cm4gZGF0ZWtleTtcclxuICAgICAgfTtcclxuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XHJcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XHJcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcclxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXHJcbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5p+l6K+i5oC75pWwXHJcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xyXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cclxuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xyXG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxyXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xyXG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XHJcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcclxuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXHJcbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xyXG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcclxuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcclxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XHJcbiAgICAgICAgICByZXR1cm4gbW9kO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cclxuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XHJcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xyXG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcclxuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSkgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xyXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcclxuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xyXG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxyXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XHJcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXHJcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXHJcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXHJcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICBzdGVlZG9zOntcclxuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxyXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxyXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHdvcmtmbG93OntcclxuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNtczoge1xyXG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xyXG5cclxuICAgICAgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuc3RhY2spO1xyXG4gICAgfSkpO1xyXG5cclxuICB9XHJcblxyXG59KVxyXG5cclxuXHJcblxyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogMVxyXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxyXG4gICAgICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpKytcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDJcclxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDNcclxuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogNFxyXG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNaWdyYXRpb25zLmFkZFxyXG5cdFx0dmVyc2lvbjogNVxyXG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0XHR0cnlcclxuXHJcblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XHJcblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcclxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXHJcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcclxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXHJcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxyXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cclxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcclxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXHJcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0ZG93bjogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDZcclxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxyXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cclxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XHJcblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxyXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcclxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxyXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG4gICAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMgPSB7XHJcbiAgICAgICAgICAgIFwiY3JlYXRvclwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvclxyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvciA9IHtcclxuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgIH1cclxuXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByb290VVJMO1xuICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzID0ge1xuICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvcikge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTDtcbiAgfVxufSk7XG4iLCJpZihNZXRlb3IuaXNEZXZlbG9wbWVudCl7XHJcblx0Ly9NZXRlb3Ig54mI5pys5Y2H57qn5YiwMS45IOWPiuS7peS4iuaXtihub2RlIOeJiOacrCAxMSsp77yM5Y+v5Lul5Yig6Zmk5q2k5Luj56CBXHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZsYXQnLCB7XHJcblx0XHR2YWx1ZTogZnVuY3Rpb24oZGVwdGggPSAxKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAoZmxhdCwgdG9GbGF0dGVuKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZsYXQuY29uY2F0KChBcnJheS5pc0FycmF5KHRvRmxhdHRlbikgJiYgKGRlcHRoPjEpKSA/IHRvRmxhdHRlbi5mbGF0KGRlcHRoLTEpIDogdG9GbGF0dGVuKTtcclxuXHRcdFx0fSwgW10pO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59IiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdG5ldyBUYWJ1bGFyLlRhYmxlXHJcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXHJcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxyXG5cdFx0Y29sdW1uczogW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHRcdGRvbTogXCJ0cFwiXHJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cclxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2VcclxuXHRcdG9yZGVyaW5nOiBmYWxzZVxyXG5cdFx0cGFnZUxlbmd0aDogMTBcclxuXHRcdGluZm86IGZhbHNlXHJcblx0XHRzZWFyY2hpbmc6IHRydWVcclxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxyXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxyXG5cdFx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
