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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2Jvb3RzdHJhcC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRLZXlWYWx1ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvZ2V0X3NwYWNlX3VzZXJfY291bnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9kZXZlbG9wbWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb3J0QnlOYW1lIiwibG9jYWxlIiwiU3RlZWRvcyIsInNvcnQiLCJwMSIsInAyIiwicDFfc29ydF9ubyIsInNvcnRfbm8iLCJwMl9zb3J0X25vIiwibmFtZSIsImxvY2FsZUNvbXBhcmUiLCJnZXRQcm9wZXJ0eSIsImsiLCJmb3JFYWNoIiwidCIsIm0iLCJwdXNoIiwicmVtb3ZlIiwiZnJvbSIsInRvIiwicmVzdCIsInNsaWNlIiwibGVuZ3RoIiwiYXBwbHkiLCJmaWx0ZXJQcm9wZXJ0eSIsImgiLCJsIiwiZyIsImQiLCJpbmNsdWRlcyIsIk9iamVjdCIsInVuZGVmaW5lZCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJyIiwiQ29va2llcyIsImNyeXB0byIsIm1peGluIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJyZWYiLCJyZWYxIiwicGhvbmUiLCJudW1iZXJUb1N0cmluZyIsIm51bWJlciIsInNjYWxlIiwibm90VGhvdXNhbmRzIiwicmVnIiwidG9TdHJpbmciLCJOdW1iZXIiLCJ0b0ZpeGVkIiwibWF0Y2giLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsInVybCIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsIiQiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFic29sdXRlVXJsIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImlzQ29yZG92YSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsInJlZGlyZWN0VG9TaWduSW4iLCJGbG93Um91dGVyIiwiZ28iLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJlcnJvcjEiLCJjb25zb2xlIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJoYXNGZWF0dXJlIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJjc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJnZXRVc2VyT3JnYW5pemF0aW9ucyIsImlzSW5jbHVkZVBhcmVudHMiLCJvcmdhbml6YXRpb25zIiwicGFyZW50cyIsInNwYWNlX3VzZXIiLCJzcGFjZV91c2VycyIsImZpZWxkcyIsIl8iLCJmbGF0dGVuIiwiZmluZCIsIiRpbiIsImZldGNoIiwidW5pb24iLCJmb3JiaWROb2RlQ29udGV4dG1lbnUiLCJ0YXJnZXQiLCJpZnIiLCJkb2N1bWVudCIsImJvZHkiLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJwcmV2ZW50RGVmYXVsdCIsImxvYWQiLCJpZnJCb2R5IiwiY29udGVudHMiLCJpc1NlcnZlciIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsInBhc3N3b3JkIiwicmVmMiIsInJlZjMiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsInNwbGl0Iiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJmdW5jIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwiYXV0b3J1biIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsInN0ZWVkb3NBdXRoIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwidXNlclNlc3Npb24iLCJTdHJpbmciLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImdldFJlbGF0aXZlVXJsIiwiYXZhdGFyVXJsIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJwdWJsaXNoIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCIsInN0ZWVkb3NDb3JlIiwic3RlZWRvc0kxOG4iLCJzdGVlZG9zTGljZW5zZSIsInRvTG9jYWxlTG93ZXJDYXNlIiwic3BhY2VVc2VyIiwicHJvZmlsZXMiLCJfQXBwcyIsIl9EYXNoYm9hcmRzIiwiYXNzaWduZWRfbWVudXMiLCJsbmciLCJvYmplY3RzTGF5b3V0IiwicGVybWlzc2lvbnMiLCJzcGFjZVByb2Nlc3NEZWZpbml0aW9uIiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJ0cmFuc2xhdGlvbk9iamVjdHMiLCJBcHBzIiwiZGFzaGJvYXJkcyIsIkRhc2hib2FyZHMiLCJvYmplY3RfbGlzdHZpZXdzIiwib2JqZWN0X3dvcmtmbG93cyIsImdldFVzZXJPYmplY3RQZXJtaXNzaW9uIiwic3RlZWRvc1NjaGVtYSIsImdldERhdGFTb3VyY2VzIiwiZGF0YXNvdXJjZSIsImRhdGFzb3VyY2VPYmplY3RzIiwiZ2V0T2JqZWN0cyIsIl9vYmoiLCJjb252ZXJ0T2JqZWN0IiwidG9Db25maWciLCJkYXRhYmFzZV9uYW1lIiwiZ2V0QXBwc0NvbmZpZyIsImdldERhc2hib2FyZHNDb25maWciLCJfZGJpZCIsInRyYW5zbGF0aW9uQXBwcyIsInRyYW5zbGF0aW9uTWVudXMiLCJwbHVnaW5zIiwiZ2V0UGx1Z2lucyIsIm9iamVjdExheW91dCIsIl9maWVsZHMiLCJfb2JqZWN0IiwiX2l0ZW0iLCJyZWY0IiwicmVmNSIsInJlZjYiLCJyZWY3IiwiZmllbGQiLCJoYXMiLCJncm91cCIsInJlcXVpcmVkIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsImFsbG93X2FjdGlvbnMiLCJhY3Rpb25zIiwiYWxsb3dfcmVsYXRlZExpc3QiLCJyZWxhdGVkTGlzdCIsImFjdGl2ZSIsImVuYWJsZV9wcm9jZXNzIiwib24iLCJjaHVuayIsImJpbmRFbnZpcm9ubWVudCIsInBhcnNlciIsInhtbDJqcyIsIlBhcnNlciIsImV4cGxpY2l0QXJyYXkiLCJleHBsaWNpdFJvb3QiLCJwYXJzZVN0cmluZyIsImVyciIsIldYUGF5IiwiYXR0YWNoIiwiYnByIiwiY29kZV91cmxfaWQiLCJzaWduIiwid3hwYXkiLCJhcHBpZCIsIm1jaF9pZCIsInBhcnRuZXJfa2V5IiwiSlNPTiIsInBhcnNlIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJsb2ciLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwic3BhY2Vfc2V0dGluZ3MiLCJ2YWx1ZXMiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImluc2VydCIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwiaXNfcGFpZCIsInMiLCJjYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoIiwiUGFja2FnZSIsInNlbmQiLCJzdHJpbmdpZnkiLCJ0aW1lRW5kIiwic2V0VXNlcm5hbWUiLCJpbnZpdGVfc3RhdGUiLCJiaWxsaW5nX3JlY2hhcmdlIiwibmV3X2lkIiwibW9kdWxlX25hbWVzIiwibGlzdHByaWNlcyIsIm9uZV9tb250aF95dWFuIiwib3JkZXJfYm9keSIsInJlc3VsdF9vYmoiLCJzcGFjZV91c2VyX2NvdW50IiwibGlzdHByaWNlX3JtYiIsIm5hbWVfemgiLCJjcmVhdGVVbmlmaWVkT3JkZXIiLCJqb2luIiwib3V0X3RyYWRlX25vIiwibW9tZW50IiwiZm9ybWF0Iiwic3BiaWxsX2NyZWF0ZV9pcCIsIm5vdGlmeV91cmwiLCJ0cmFkZV90eXBlIiwicHJvZHVjdF9pZCIsImluZm8iLCJnZXRfc3BhY2VfdXNlcl9jb3VudCIsInVzZXJfY291bnRfaW5mbyIsInRvdGFsX3VzZXJfY291bnQiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3JlYXRlX3NlY3JldCIsInJlbW92ZV9zZWNyZXQiLCJ0b2tlbiIsImN1clNwYWNlVXNlciIsIm93cyIsImZsb3dfaWQiLCJmbCIsInBlcm1zIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY2hhbmdlZFVzZXJJbmZvIiwiY3VycmVudFVzZXIiLCJsYW5nIiwibG9nb3V0IiwidXNlckNQIiwic2V0UGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsIm1vYmlsZV92ZXJpZmllZCIsIlNNU1F1ZXVlIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwibW9kdWxlX25hbWUiLCJsaXN0cHJpY2UiLCJhY2NvdW50aW5nX2RhdGUiLCJhY2NvdW50aW5nX2RhdGVfZm9ybWF0IiwiZGF5c19udW1iZXIiLCJuZXdfYmlsbCIsIiRsdGUiLCJfbWFrZU5ld0lEIiwiZ2V0U3BhY2VVc2VyQ291bnQiLCJyZWNhY3VsYXRlQmFsYW5jZSIsInJlZnJlc2hfZGF0ZXMiLCJyX2QiLCJnZXRfbW9kdWxlcyIsIm1fY2hhbmdlbG9nIiwibW9kdWxlc19jaGFuZ2Vsb2dzIiwiY2hhbmdlX2RhdGUiLCJvcGVyYXRpb24iLCJnZXRfbW9kdWxlc19uYW1lIiwibW9kdWxlc19uYW1lIiwiYV9tIiwibmV3ZXN0X2JpbGwiLCJwZXJpb2RfcmVzdWx0IiwicmVtYWluaW5nX21vbnRocyIsImIiLCJvcGVyYXRvcl9pZCIsIm5ld19tb2R1bGVzIiwic3BhY2VfdXBkYXRlX29iaiIsImRpZmZlcmVuY2UiLCJfZCIsInVzZXJfbGltaXQiLCJtY2wiLCJvcGVyYXRvciIsImNyb24iLCJzdGF0aXN0aWNzIiwic2NoZWR1bGUiLCJydWxlIiwiZ29fbmV4dCIsInNjaGVkdWxlSm9iIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsImRhaWx5UG9zdHNBdHRhY2htZW50cyIsInN0ZWVkb3Nfc3RhdGlzdGljcyIsInNwYWNlX25hbWUiLCJvd25lcl9uYW1lIiwic3RlZWRvcyIsIndvcmtmbG93IiwiZmxvd3MiLCJmb3JtcyIsImZsb3dfcm9sZXMiLCJmbG93X3Bvc2l0aW9ucyIsImluc3RhbmNlcyIsImluc3RhbmNlc19sYXN0X21vZGlmaWVkIiwiZGFpbHlfZmxvd3MiLCJkYWlseV9mb3JtcyIsImRhaWx5X2luc3RhbmNlcyIsImNtcyIsInNpdGVzIiwiY21zX3NpdGVzIiwiY21zX3Bvc3RzIiwicG9zdHNfbGFzdF9tb2RpZmllZCIsInBvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJjb21tZW50cyIsImNtc19jb21tZW50cyIsImRhaWx5X3NpdGVzIiwiZGFpbHlfcG9zdHMiLCJkYWlseV9jb21tZW50cyIsImRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJNaWdyYXRpb25zIiwidmVyc2lvbiIsInVwIiwidXBkYXRlX2Nmc19pbnN0YW5jZSIsInBhcmVudF9pZCIsImluc3RhbmNlX2lkIiwiYXR0YWNoX3ZlcnNpb24iLCJpc0N1cnJlbnQiLCJtZXRhZGF0YSIsInBhcmVudCIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJhdHRhY2htZW50cyIsImlucyIsImF0dGFjaHMiLCJjdXJyZW50X3ZlciIsIl9yZXYiLCJoaXN0b3J5cyIsImhpcyIsImRvd24iLCJvcmdhbml6YXRpb24iLCJjaGVja19jb3VudCIsIm5ld19vcmdfaWRzIiwicmVtb3ZlZF9vcmdfaWRzIiwicm9vdF9vcmciLCJ1cGRhdGVVc2VycyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwicm9vdFVSTCIsImNyZWF0b3IiLCJpc0RldmVsb3BtZW50IiwiZGVmaW5lUHJvcGVydHkiLCJkZXB0aCIsInJlZHVjZSIsImZsYXQiLCJ0b0ZsYXR0ZW4iLCJpc0FycmF5IiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxv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WFY7QUFZQTNiLGdCQUFZLEVBWlo7QUFhQXFQLFVBQU0sS0FiTjtBQWNBdU0sZUFBVyxJQWRYO0FBZUFDLGVBQVcsSUFmWDtBQWdCQUMsb0JBQWdCLFVBQUMvYyxRQUFELEVBQVc3VixNQUFYO0FBQ2YsVUFBQW5DLEdBQUEsRUFBQXVILEtBQUE7O0FBQUEsV0FBT3BGLE1BQVA7QUFDQyxlQUFPO0FBQUN5RSxlQUFLLENBQUM7QUFBUCxTQUFQO0FDSUc7O0FESEpXLGNBQVF5USxTQUFTelEsS0FBakI7O0FBQ0EsV0FBT0EsS0FBUDtBQUNDLGFBQUF5USxZQUFBLFFBQUFoWSxNQUFBZ1ksU0FBQWdkLElBQUEsWUFBQWgxQixJQUFtQmxCLE1BQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLElBQTRCLENBQTVCO0FBQ0N5SSxrQkFBUXlRLFNBQVNnZCxJQUFULENBQWM3MkIsV0FBZCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFSO0FBRkY7QUNRSTs7QURMSixXQUFPb0osS0FBUDtBQUNDLGVBQU87QUFBQ1gsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ1NHOztBRFJKLGFBQU9vUixRQUFQO0FBekJEO0FBQUEsR0FERCxDQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcblx0Y29va2llczogXCJeMC42LjJcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG5cdG1rZGlycDogXCJeMC4zLjVcIixcblx0XCJ1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFwiOiBcIl43LjAuMFwiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXG5cdH0sICdzdGVlZG9zOmJhc2UnKTtcbn0iLCJBcnJheS5wcm90b3R5cGUuc29ydEJ5TmFtZSA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcbiAgICBpZiAoIXRoaXMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZighbG9jYWxlKXtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuICAgIH1cbiAgICB0aGlzLnNvcnQoZnVuY3Rpb24gKHAxLCBwMikge1xuXHRcdHZhciBwMV9zb3J0X25vID0gcDEuc29ydF9ubyB8fCAwO1xuXHRcdHZhciBwMl9zb3J0X25vID0gcDIuc29ydF9ubyB8fCAwO1xuXHRcdGlmKHAxX3NvcnRfbm8gIT0gcDJfc29ydF9ubyl7XG4gICAgICAgICAgICByZXR1cm4gcDFfc29ydF9ubyA+IHAyX3NvcnRfbm8gPyAtMSA6IDFcbiAgICAgICAgfWVsc2V7XG5cdFx0XHRyZXR1cm4gcDEubmFtZS5sb2NhbGVDb21wYXJlKHAyLm5hbWUsIGxvY2FsZSk7XG5cdFx0fVxuICAgIH0pO1xufTtcblxuXG5BcnJheS5wcm90b3R5cGUuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoaykge1xuICAgIHZhciB2ID0gbmV3IEFycmF5KCk7XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBtID0gdCA/IHRba10gOiBudWxsO1xuICAgICAgICB2LnB1c2gobSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHY7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahHJlbW92ZeWHveaVsFxuICovXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgaWYgKGZyb20gPCAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XG59O1xuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTlr7nosaFBcnJheVxuICovXG5BcnJheS5wcm90b3R5cGUuZmlsdGVyUHJvcGVydHkgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciBnID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xuICAgICAgICB2YXIgZCA9IGZhbHNlO1xuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKFwiaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiaWRcIl07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIl9pZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJfaWRcIl07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBsLmluY2x1ZGVzKG0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICBnLnB1c2godCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZztcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq5a+56LGhXG4gKi9cbkFycmF5LnByb3RvdHlwZS5maW5kUHJvcGVydHlCeVBLID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgciA9IG51bGw7XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xuICAgICAgICB2YXIgZCA9IGZhbHNlO1xuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIHIgPSB0O1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHI7XG59IiwiU3RlZWRvcyA9XG5cdHNldHRpbmdzOiB7fVxuXHRkYjogZGJcblx0c3Viczoge31cblx0aXNQaG9uZUVuYWJsZWQ6IC0+XG5cdFx0cmV0dXJuICEhTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lXG5cdG51bWJlclRvU3RyaW5nOiAobnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKS0+XG5cdFx0aWYgdHlwZW9mIG51bWJlciA9PSBcIm51bWJlclwiXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxuXG5cdFx0aWYgIW51bWJlclxuXHRcdFx0cmV0dXJuICcnO1xuXG5cdFx0aWYgbnVtYmVyICE9IFwiTmFOXCJcblx0XHRcdGlmIHNjYWxlIHx8IHNjYWxlID09IDBcblx0XHRcdFx0bnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSlcblx0XHRcdHVubGVzcyBub3RUaG91c2FuZHNcblx0XHRcdFx0aWYgIShzY2FsZSB8fCBzY2FsZSA9PSAwKVxuXHRcdFx0XHRcdCMg5rKh5a6a5LmJc2NhbGXml7bvvIzmoLnmja7lsI/mlbDngrnkvY3nva7nrpflh7pzY2FsZeWAvFxuXHRcdFx0XHRcdHNjYWxlID0gbnVtYmVyLm1hdGNoKC9cXC4oXFxkKykvKT9bMV0/Lmxlbmd0aFxuXHRcdFx0XHRcdHVubGVzcyBzY2FsZVxuXHRcdFx0XHRcdFx0c2NhbGUgPSAwXG5cdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZ1xuXHRcdFx0XHRpZiBzY2FsZSA9PSAwXG5cdFx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nXG5cdFx0XHRcdG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpXG5cdFx0XHRyZXR1cm4gbnVtYmVyXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFwiXCJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXG5cdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKVxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXG5cbiMjI1xuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiMgQG5hbWVzcGFjZSBTdGVlZG9zXG4jIyNcblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XG5cdFx0c3dhbCh7dGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSwgaHRtbDogdHJ1ZSwgdHlwZTpcIndhcm5pbmdcIiwgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKX0pO1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5OlwiYmdfYm9keVwifSlcblx0XHRpZiBhY2NvdW50QmdCb2R5XG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gKGFjY291bnRCZ0JvZHlWYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlID0ge31cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXG5cdFx0IyBpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0IyBcdGlmIHVybCA9PSBhdmF0YXJcblx0XHQjIFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKHVybCl9KVwiXG5cdFx0IyBlbHNlXG5cdFx0IyBcdGJhY2tncm91bmQgPSBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8uYWRtaW4/LmJhY2tncm91bmRcblx0XHQjIFx0aWYgYmFja2dyb3VuZFxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblx0XHQjIFx0ZWxzZVxuXHRcdCMgXHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcblx0XHRpZiBhY2NvdW50U2tpblxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxuXHRcdGlmIGFjY291bnRab29tXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxuXHRcdHVubGVzcyB6b29tTmFtZVxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcblx0XHRcdHpvb21TaXplID0gMS4yXG5cdFx0aWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxuXHRcdFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcblx0XHRcdCMgZWxzZVxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cblx0XHRsaW5rZXIgPSBcIj9cIlxuXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdGxpbmtlciA9IFwiJlwiXG5cblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cblxuXHRTdGVlZG9zLm9wZW5BcHAgPSAoYXBwX2lkKS0+XG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxuXHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXHRcdGlmICFhcHBcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXG5cdFx0XHRyZXR1cm5cblxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3Jcblx0XHQjIGlmIGFwcC5faWQgPT0gXCJhZG1pblwiIGFuZCBjcmVhdG9yU2V0dGluZ3M/LnN0YXR1cyA9PSBcImFjdGl2ZVwiXG5cdFx0IyBcdHVybCA9IGNyZWF0b3JTZXR0aW5ncy51cmxcblx0XHQjIFx0cmVnID0gL1xcLyQvXG5cdFx0IyBcdHVubGVzcyByZWcudGVzdCB1cmxcblx0XHQjIFx0XHR1cmwgKz0gXCIvXCJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxuXHRcdCMgXHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXHRcdCMgXHRyZXR1cm5cblxuXHRcdG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrXG5cdFx0aWYgYXBwLmlzX3VzZV9pZVxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0aWYgb25fY2xpY2tcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGVsc2UgaWYgZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpXG5cdFx0XHRGbG93Um91dGVyLmdvKGFwcC51cmwpXG5cblx0XHRlbHNlIGlmIGFwcC5pc191c2VfaWZyYW1lXG5cdFx0XHRpZiBhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcblx0XHRcdGVsc2UgaWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblx0XHRcdGVsc2Vcblx0XHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS8je2FwcC5faWR9XCIpXG5cblx0XHRlbHNlIGlmIG9uX2NsaWNrXG5cdFx0XHQjIOi/memHjOaJp+ihjOeahOaYr+S4gOS4quS4jeW4puWPguaVsOeahOmXreWMheWHveaVsO+8jOeUqOadpemBv+WFjeWPmOmHj+axoeafk1xuXHRcdFx0ZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7I3tvbl9jbGlja319KSgpXCJcblx0XHRcdHRyeVxuXHRcdFx0XHRldmFsKGV2YWxGdW5TdHJpbmcpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiI3tlLm1lc3NhZ2V9XFxyXFxuI3tlLnN0YWNrfVwiXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xuXHRcdFx0IyDpnIDopoHpgInkuK3lvZPliY1hcHDml7bvvIxvbl9jbGlja+WHveaVsOmHjOimgeWNleeLrOWKoOS4ilNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cblx0U3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IChzcGFjZUlkKS0+XG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdG1pbl9tb250aHMgPSAxXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0bWluX21vbnRocyA9IDNcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0ZW5kX2RhdGUgPSBzcGFjZT8uZW5kX2RhdGVcblx0XHRpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpIGFuZCBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xuXHRcdFx0dG9hc3RyLmVycm9yIHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKVxuXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XG5cdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xuXHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdHdoZW4gJ25vcm1hbCdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTEyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxuXHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC02XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAxOTlcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XG5cdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAzMDNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xuXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAwXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXG5cdFx0XHRcdCQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XG5cdFx0XHRcdGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldFxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxuXG5cdFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSAob2Zmc2V0KS0+XG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxuXHRcdGVsc2Vcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHQjIGlvc+WPiuaJi+acuuS4iuS4jemcgOimgeS4unpvb23mlL7lpKflip/og73pop3lpJborqHnrpdcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcblx0XHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcblx0XHRpZiBvZmZzZXRcblx0XHRcdHJlVmFsdWUgLT0gb2Zmc2V0XG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG5cblx0U3RlZWRvcy5pc2lPUyA9ICh1c2VyQWdlbnQsIGxhbmd1YWdlKS0+XG5cdFx0REVWSUNFID1cblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xuXHRcdFx0YmxhY2tiZXJyeTogJ2JsYWNrYmVycnknXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcblx0XHRcdGlwYWQ6ICdpcGFkJ1xuXHRcdFx0aXBob25lOiAnaXBob25lJ1xuXHRcdFx0aXBvZDogJ2lwb2QnXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXG5cdFx0YnJvd3NlciA9IHt9XG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXG5cdFx0dXNlckFnZW50ID0gKHVzZXJBZ2VudCBvciBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXG5cdFx0XHQnJ1xuXHRcdFx0REVWSUNFLmRlc2t0b3Bcblx0XHRdXG5cdFx0YnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV1cblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxuXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdHJldHVyblxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgaWZyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXG5cdFx0XHRcdGlmciA9IHRhcmdldC4kKGlmcilcblx0XHRcdGlmci5sb2FkIC0+XG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jylcblx0XHRcdFx0aWYgaWZyQm9keVxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoc3BhY2VJZCx1c2VySWQsaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHQjVE9ETyDmt7vliqDmnI3liqHnq6/mmK/lkKbmiYvmnLrnmoTliKTmlq0o5L6d5o2ucmVxdWVzdClcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcblxuXHRTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gKHNwYWNlSWQsYXBwX3ZlcnNpb24pLT5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0Y2hlY2sgPSBmYWxzZVxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXG5cdFx0XHRjaGVjayA9IHRydWVcblx0XHRyZXR1cm4gY2hlY2tcblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuaciee7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquimgeaVsOe7hG9yZ0lkc+S4reS7u+S9leS4gOS4que7hOe7h+acieadg+mZkOWwsei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxuXHRcdHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjpvcmdJZHN9fSx7ZmllbGRzOntwYXJlbnRzOjEsYWRtaW5zOjF9fSkuZmV0Y2goKVxuXHRcdHBhcmVudHMgPSBbXVxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XG5cdFx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxuXHRcdGlmIGFsbG93QWNjZXNzT3Jncy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBwYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcblx0XHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHR1bmxlc3Mgb3JnSWRzLmxlbmd0aFxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRpID0gMFxuXHRcdHdoaWxlIGkgPCBvcmdJZHMubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cblx0XHRcdFx0YnJlYWtcblx0XHRcdGkrK1xuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXG5cdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcblx0XHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xuXHRTdGVlZG9zLmdldEFQSUxvZ2luVXNlclx0PSAocmVxLCByZXMpIC0+XG5cblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcblxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxuXG5cdFx0aWYgdXNlcm5hbWUgJiYgcGFzc3dvcmRcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXG5cblx0XHRcdGlmICF1c2VyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBwYXNzd29yZFxuXG5cdFx0XHRpZiByZXN1bHQuZXJyb3Jcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcilcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHVzZXJcblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRyZXR1cm4gZmFsc2VcblxuXHQjXHTmo4Dmn6V1c2VySWTjgIFhdXRoVG9rZW7mmK/lkKbmnInmlYhcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0aWYgdXNlclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdHRyeVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0ZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblx0XHRjYXRjaCBlXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0a2V5MzIgPSBcIlwiXG5cdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRjID0gXCJcIlxuXHRcdFx0aSA9IDBcblx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRpKytcblx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxuXG5cdFx0aWYgIWFjY2Vzc190b2tlblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pXG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXG5cblx0XHRpZiB1c2VyXG5cdFx0XHRyZXR1cm4gdXNlcklkXG5cdFx0ZWxzZVxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cblxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxuXHRcdFx0aWYgb2JqXG5cdFx0XHRcdCMg5Yik5patdG9rZW7nmoTmnInmlYjmnJ9cblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBub3QgZm91bmQuXCJcblx0XHRyZXR1cm4gbnVsbFxuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXG5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRjYXRjaCBlXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IGUubWVzc2FnZSxcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xuIyBleGNlcHQgZm9yIGluY2x1ZGUsIGNvbnRhaW5zLCByZXZlcnNlIGFuZCBqb2luIHRoYXQgYXJlXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxuXG5taXhpbiA9IChvYmopIC0+XG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cblx0XHRpZiBub3QgX1tuYW1lXSBhbmQgbm90IF8ucHJvdG90eXBlW25hbWVdP1xuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cblx0XHRcdFx0YXJncyA9IFt0aGlzLl93cmFwcGVkXVxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXG5cbiNtaXhpbihfcy5leHBvcnRzKCkpXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6Vcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxuXHRcdGlmICFkYXRlXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0ZGF5ID0gZGF0ZS5nZXREYXkoKVxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRyZXR1cm4gZmFsc2Vcblx0IyDmoLnmja7kvKDlhaXml7bpl7QoZGF0ZSnorqHnrpflh6DkuKrlt6XkvZzml6UoZGF5cynlkI7nmoTml7bpl7QsZGF5c+ebruWJjeWPquiDveaYr+aVtOaVsFxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRjaGVjayBkYXlzLCBOdW1iZXJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XG5cdFx0XHRpZiBpIDwgZGF5c1xuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXG5cdFx0XHRyZXR1cm5cblx0XHRjYWN1bGF0ZURhdGUoMCwgZGF5cylcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxuXG5cdCMg6K6h566X5Y2K5Liq5bel5L2c5pel5ZCO55qE5pe26Ze0XG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXG5cdFx0XHRjb25zb2xlLmVycm9yIFwidGltZV9wb2ludHMgaXMgbnVsbFwiXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXG5cblx0XHRsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGhcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdHN0YXJ0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbMF0uaG91clxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXG5cdFx0ZW5kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGVcblxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXG5cdFx0aiA9IDBcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXG5cdFx0aWYgZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IDBcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xuXHRcdFx0XHRqID0gbGVuLzJcblx0XHRlbHNlIGlmIGRhdGUgPj0gc3RhcnRfZGF0ZSBhbmQgZGF0ZSA8IGVuZF9kYXRlXG5cdFx0XHRpID0gMFxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxuXHRcdFx0XHRmaXJzdF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpXS5taW51dGVcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXG5cblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcblx0XHRcdFx0XHRicmVha1xuXG5cdFx0XHRcdGkrK1xuXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gaSArIGxlbi8yXG5cblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIGxlbi8yXG5cblx0XHRpZiBqID4gbWF4X2luZGV4XG5cdFx0XHQjIOmalOWkqemcgOWIpOaWreiKguWBh+aXpVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZVxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbal0ubWludXRlXG5cblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXG5cdFx0Z2V0U3RlZWRvc1Rva2VuOiAoYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxuXHRcdFx0aWYgYXBwXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblxuXHRcdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0XHRcdGkgPSAwXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRcdFx0aSsrXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXG5cblx0XHRsb2NhbGU6ICh1c2VySWQsIGlzSTE4biktPlxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxuXHRcdFx0aWYgaXNJMThuXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0cmV0dXJuIGxvY2FsZVxuXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXG5cblxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cblx0XHRcdHJlYXNvbiA9IHQgXCJwYXNzd29yZF9pbnZhbGlkXCJcblx0XHRcdHZhbGlkID0gdHJ1ZVxuXHRcdFx0dW5sZXNzIHB3ZFxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cblx0XHRcdHBhc3N3b3JQb2xpY3kgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5XG5cdFx0XHRwYXNzd29yUG9saWN5RXJyb3IgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5RXJyb3Jcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcblx0XHRcdFx0aWYgIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJylcblx0XHRcdFx0XHRyZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3Jcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR2YWxpZCA9IHRydWVcbiNcdFx0XHRlbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1xcZCsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdGlmIHB3ZC5sZW5ndGggPCA4XG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdGlmIHZhbGlkXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBlcnJvcjpcblx0XHRcdFx0XHRyZWFzb246IHJlYXNvblxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIilcblxuQ3JlYXRvci5nZXREQkFwcHMgPSAoc3BhY2VfaWQpLT5cblx0ZGJBcHBzID0ge31cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZvckVhY2ggKGFwcCktPlxuXHRcdGRiQXBwc1thcHAuX2lkXSA9IGFwcFxuXG5cdHJldHVybiBkYkFwcHNcblxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSAoc3BhY2VfaWQpLT5cblx0ZGJEYXNoYm9hcmRzID0ge31cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtzcGFjZTogc3BhY2VfaWR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZvckVhY2ggKGRhc2hib2FyZCktPlxuXHRcdGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxuXG5cdHJldHVybiBkYkRhc2hib2FyZHNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHRTdGVlZG9zLmdldEF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcylcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRpZiAhYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09ICdCZWFyZXInXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cblx0XHRyZXR1cm4gYXV0aFRva2VuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpXG4jXHRcdGVsc2VcbiNcdFx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGN1cnJlbnRfYXBwX2lkLi4uJyk7XG4jXHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudF9hcHBfaWQnKVxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnYXBwX2lkJylcblx0XHRcdHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIG1peGluOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciByZWYsIHJlZjEsIHJlZztcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmIChzY2FsZSB8fCBzY2FsZSA9PT0gMCkge1xuICAgICAgICBudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90VGhvdXNhbmRzKSB7XG4gICAgICAgIGlmICghKHNjYWxlIHx8IHNjYWxlID09PSAwKSkge1xuICAgICAgICAgIHNjYWxlID0gKHJlZiA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLykpICE9IG51bGwgPyAocmVmMSA9IHJlZlsxXSkgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGlmICghc2NhbGUpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nO1xuICAgICAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2c7XG4gICAgICAgIH1cbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgY21kLCBlLCBldmFsRnVuU3RyaW5nLCBleGVjLCBvbl9jbGljaywgb3Blbl91cmwsIHBhdGg7XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwKSB7XG4gICAgICBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25fY2xpY2sgPSBhcHAub25fY2xpY2s7XG4gICAgaWYgKGFwcC5pc191c2VfaWUpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgaWYgKG9uX2NsaWNrKSB7XG4gICAgICAgICAgcGF0aCA9IFwiYXBpL2FwcC9zc28vXCIgKyBhcHBfaWQgKyBcIj9hdXRoVG9rZW49XCIgKyAoQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSkgKyBcIiZ1c2VySWQ9XCIgKyAoTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmw7XG4gICAgICAgIH1cbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybCkpIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oYXBwLnVybCk7XG4gICAgfSBlbHNlIGlmIChhcHAuaXNfdXNlX2lmcmFtZSkge1xuICAgICAgaWYgKGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKTtcbiAgICAgIH0gZWxzZSBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbl9jbGljaykge1xuICAgICAgZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7XCIgKyBvbl9jbGljayArIFwifSkoKVwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChldmFsRnVuU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSArIFwiXFxyXFxuXCIgKyBlLnN0YWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgfVxuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2spIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBlbmRfZGF0ZSwgbWluX21vbnRocywgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgfVxuICAgIG1pbl9tb250aHMgPSAxO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICBtaW5fbW9udGhzID0gMztcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBlbmRfZGF0ZSA9IHNwYWNlICE9IG51bGwgPyBzcGFjZS5lbmRfZGF0ZSA6IHZvaWQgMDtcbiAgICBpZiAoc3BhY2UgJiYgU3RlZWRvcy5oYXNGZWF0dXJlKCdwYWlkJywgc3BhY2UuX2lkKSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCkpICE9IG51bGwgPyByZWYubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWYgPSBvcmcuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjIgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYyW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYzID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmM1tcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjFbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMi5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjMgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmLCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZCkgIT0gbnVsbCA/IHJlZi50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5wb2xpY3kgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBwYXNzd29yUG9saWN5RXJyb3IgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAocGFzc3dvclBvbGljeSkge1xuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJykpIHtcbiAgICAgICAgICByZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3I7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJEYXNoYm9hcmRzO1xuICBkYkRhc2hib2FyZHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGRhc2hib2FyZCkge1xuICAgIHJldHVybiBkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmQ7XG4gIH0pO1xuICByZXR1cm4gZGJEYXNoYm9hcmRzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfVxuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgTWV0ZW9yLm1ldGhvZHNcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVzaDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRzZXQ6IFxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIF1cblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcbiAgICAgICAgcCA9IG51bGxcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgICAgcCA9IGVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdWxsOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIHBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBcblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXG5cbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxuICAgICAgICAkc2V0OlxuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG5cbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgcmV0dXJuIHt9XG5cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cbiAgICAgICAgc3dhbFxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXG4jIyNcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XG5cdGZyb206IChmdW5jdGlvbigpe1xuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XG5cdH0pKCksXG5cdHJlc2V0UGFzc3dvcmQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0dmVyaWZ5RW1haWw6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdGVucm9sbEFjY291bnQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9XG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XG5cdGlmIChvcmdzLmNvdW50KCk+MClcblx0e1xuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcblx0XHR7XG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cdFxuXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIFx0ZGF0YToge1xuXHQgICAgICBcdHJldDogMCxcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcbiAgICBcdH1cbiAgXHR9KTtcbn0pO1xuXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuXHRcdGlmIHNwYWNlSWRcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuXHRcdHNwYWNlcyA9IFtdXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XG5cdGljb246IFwiZ2xvYmVcIlxuXHRjb2xvcjogXCJibHVlXCJcblx0dGFibGVDb2x1bW5zOiBbXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cblx0XVxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdHJldHVybiB7fVxuXHRzaG93RWRpdENvbHVtbjogZmFsc2Vcblx0c2hvd0RlbENvbHVtbjogZmFsc2Vcblx0ZGlzYWJsZUFkZDogdHJ1ZVxuXHRwYWdlTGVuZ3RoOiAxMDBcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xuICAgIHZhciBrO1xuICAgIGlmIChuID49IDApIHtcbiAgICAgIGsgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuICsgbjtcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cbiAgICB9XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBrKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XG4gICAgICB3d3c6IFxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxuXHRsaXN0Vmlld3MgPSB7fVxuXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcblxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gbGlzdFZpZXdzXG5cblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pXG5cblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblxuXG5cbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcbi8vICAgJ3VzZSBzdHJpY3QnO1xuXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xuXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbi8vICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XG4vLyAgICAgfVxuLy8gICB9O1xuLy8gICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcbi8vICAgfTtcbi8vICAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgfTtcblxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfSxcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfVxuLy8gICB9KTtcblxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXG4vLyAgIHZhciBhcGkgPSB7XG4vLyAgICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XG4vLyAgICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XG4vLyAgICAgICB9XG4vLyAgICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcbi8vICAgICB9LFxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcblxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG5cbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcbi8vICAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xuLy8gICAgIH1cbi8vICAgfTtcblxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbi8vICAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XG4vLyAgICAgICAgIH1cbi8vICAgICAgIH0pXG4vLyAgICAgfVxuLy8gICB9KVxuXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbi8vICAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXG4vLyAgICAgLy8gICB9XG4vLyAgICAgLy8gfSk7XG5cbi8vICAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xuXG4vLyAgICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XG4vLyAgICAgICB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgfSk7XG5cbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xuXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XG5cbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xuXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcblxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcbi8vICAgICAgIH1cbi8vICAgICB9KTsgIFxuXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXG4vLyAgICAgXy5leHRlbmQoYXBpLCB7XG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcbi8vICAgICAgIH0sXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XG4vLyAgICAgICB9XG4vLyAgICAgfSk7XG4vLyAgIH1cblxuLy8gICByZXR1cm4gYXBpO1xuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcblxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcblxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblx0XHRcblx0XHRpZiAhdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcblxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXG5cblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxuXHRcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgIyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcbiAgICAgICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpXG4gICAgICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYikgLT5cbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgICAgICAgICAgY2IocmVqZWN0LCByZXNvbHZlKVxuICAgICAgICAgICAgKShhdXRoVG9rZW4sIHNwYWNlKVxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICAgICAgY29kZTogNTAwLFxuICAgICAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdXNlcklkID0gdXNlclNlc3Npb24udXNlcklkXG5cbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhZGJbbW9kZWxdXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG5cbiAgICAgICAgaWYgIW9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKClcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBbXVxuXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB0cnlcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXG4gICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgIWF1dGhUb2tlblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcbiAgICAgICAgZGF0YSA9IFtdXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnLCAncm9sZXMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMg55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpXG4gICAgICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKVxuICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIC0+XG4gICAgICAgICAgICBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICAgICAgICAgIGNiKHJlamVjdCwgcmVzb2x2ZSlcbiAgICAgICAgICAgICkoYXV0aFRva2VuLCBzcGFjZSlcbiAgICAgICAgdW5sZXNzIHVzZXJTZXNzaW9uXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOiAgXG4gICAgICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWRcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucylcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiB7fVxuIiwidmFyIENvb2tpZXMsIHN0ZWVkb3NBdXRoO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXG5cdGlmIGFwcFxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcblx0ZWxzZVxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXG5cblx0aWYgIXJlZGlyZWN0VXJsXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRyZXMuZW5kKClcblx0XHRyZXR1cm5cblxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XG5cblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcblx0IyBpZiByZXEuYm9keVxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0IyAjIHRoZW4gY2hlY2sgY29va2llXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0aWYgdXNlclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHQjIGRlcy1jYmNcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxuXHRcdFx0a2V5OCA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCA4XG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSA4IC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0am9pbmVyID0gXCI/XCJcblxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxuXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cblxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRyZXMud3JpdGVIZWFkIDQwMVxuXHRyZXMuZW5kKClcblx0cmV0dXJuXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdCMgdGhpcy5wYXJhbXMgPVxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuXHRcdHdpZHRoID0gNTAgO1xuXHRcdGhlaWdodCA9IDUwIDtcblx0XHRmb250U2l6ZSA9IDI4IDtcblx0XHRpZiByZXEucXVlcnkud1xuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcblx0XHRpZiByZXEucXVlcnkuaFxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG5cdFx0aWYgIXVzZXJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9jbGllbnQvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZ1wiKVxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XG5cdFx0aWYgIXVzZXJuYW1lXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXG5cdFx0XHRjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXG5cblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcblx0XHRcdGNvbG9yX2luZGV4ID0gMFxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXG5cdFx0XHQjY29sb3IgPSBcIiNENkRBRENcIlxuXG5cdFx0XHRpbml0aWFscyA9ICcnXG5cdFx0XHRpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxuXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcblxuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cblx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiI3t3aWR0aH1cIiBoZWlnaHQ9XCIje2hlaWdodH1cIiBzdHlsZT1cIndpZHRoOiAje3dpZHRofXB4OyBoZWlnaHQ6ICN7aGVpZ2h0fXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yfTtcIj5cblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cblx0XHRcdFx0XHQje2luaXRpYWxzfVxuXHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuXHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcblx0XHRcdFx0cmVzLndyaXRlSGVhZCAzMDRcblx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aFxuXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXG5cdFx0cmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNvbG9yLCBjb2xvcl9pbmRleCwgY29sb3JzLCBmb250U2l6ZSwgaGVpZ2h0LCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVxTW9kaWZpZWRIZWFkZXIsIHN2ZywgdXNlciwgdXNlcm5hbWUsIHVzZXJuYW1lX2FycmF5LCB3aWR0aDtcbiAgICB3aWR0aCA9IDUwO1xuICAgIGhlaWdodCA9IDUwO1xuICAgIGZvbnRTaXplID0gMjg7XG4gICAgaWYgKHJlcS5xdWVyeS53KSB7XG4gICAgICB3aWR0aCA9IHJlcS5xdWVyeS53O1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmgpIHtcbiAgICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oO1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmZzKSB7XG4gICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcztcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXIpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHVzZXIucHJvZmlsZSkgIT0gbnVsbCA/IHJlZi5hdmF0YXIgOiB2b2lkIDApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyVXJsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgc3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgaWQ9XFxcIkxheWVyXzFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHg9XFxcIjBweFxcXCIgeT1cXFwiMHB4XFxcIlxcblx0IHZpZXdCb3g9XFxcIjAgMCA3MiA3MlxcXCIgc3R5bGU9XFxcImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XFxcIiB4bWw6c3BhY2U9XFxcInByZXNlcnZlXFxcIj5cXG48c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0LnN0MHtmaWxsOiNGRkZGRkY7fVxcblx0LnN0MXtmaWxsOiNEMEQwRDA7fVxcbjwvc3R5bGU+XFxuPGc+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QwXFxcIiBkPVxcXCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelxcXCIvPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxcblx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XFxcIi8+XFxuPC9nPlxcbjxnPlxcblx0PGc+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXFxuXHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elxcXCIvPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XFxuXHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcXFwiLz5cXG5cdDwvZz5cXG48L2c+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSk7XG4gICAgICBjb2xvcl9pbmRleCA9IDA7XG4gICAgICBfLmVhY2godXNlcm5hbWVfYXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcbiAgICAgIH0pO1xuICAgICAgcG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGg7XG4gICAgICBjb2xvciA9IGNvbG9yc1twb3NpdGlvbl07XG4gICAgICBpbml0aWFscyA9ICcnO1xuICAgICAgaWYgKHVzZXJuYW1lLmNoYXJDb2RlQXQoMCkgPiAyNTUpIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKTtcbiAgICAgIHN2ZyA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiIHN0YW5kYWxvbmU9XFxcIm5vXFxcIj8+XFxuPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJub25lXFxcIiB3aWR0aD1cXFwiXCIgKyB3aWR0aCArIFwiXFxcIiBoZWlnaHQ9XFxcIlwiICsgaGVpZ2h0ICsgXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgKyBoZWlnaHQgKyBcInB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGNvbG9yICsgXCI7XFxcIj5cXG5cdDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZm9udC1mYW1pbHk9XFxcIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcInB4O1xcXCI+XFxuXHRcdFwiICsgaW5pdGlhbHMgKyBcIlxcblx0PC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZjEgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMS50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYyID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjIudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdFx0YWNjZXNzX3Rva2VuID0gcmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcblx0XHRcdHJlcy53cml0ZUhlYWQgMjAwXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ2FwcHMnLCAoc3BhY2VJZCktPlxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcbiAgICAgICAgXG5cbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XG4gICAgICAgIGlmIHNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge3NvcnQ6IHtzb3J0OiAxfX0pO1xuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcblxuXHQjIHB1Ymxpc2ggdXNlcnMgc3BhY2VzXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXG5cdFx0c2VsZiA9IHRoaXM7XG5cdFx0dXNlclNwYWNlcyA9IFtdXG5cdFx0c3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9LCB7ZmllbGRzOiB7c3BhY2U6MX19KVxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcblxuXHRcdGhhbmRsZTIgPSBudWxsXG5cblx0XHQjIG9ubHkgcmV0dXJuIHVzZXIgam9pbmVkIHNwYWNlcywgYW5kIG9ic2VydmVzIHdoZW4gdXNlciBqb2luIG9yIGxlYXZlIGEgc3BhY2Vcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRpZiBkb2Muc3BhY2Vcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXG5cdFx0XHRcdFx0XHRvYnNlcnZlU3BhY2VzKClcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcblxuXHRcdG9ic2VydmVTcGFjZXMgPSAtPlxuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcblx0XHRcdGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiB7JGluOiB1c2VyU3BhY2VzfX0pLm9ic2VydmVcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XG5cdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5faWQpXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xuXHRcdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xuXG5cdFx0c2VsZi5yZWFkeSgpO1xuXG5cdFx0c2VsZi5vblN0b3AgLT5cblx0XHRcdGhhbmRsZS5zdG9wKCk7XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ215X3NwYWNlcycsIGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlLCBoYW5kbGUyLCBvYnNlcnZlU3BhY2VzLCBzZWxmLCBzdXMsIHVzZXJTcGFjZXM7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICB1c2VyU3BhY2VzID0gW107XG4gIHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xuICBzdXMuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpO1xuICB9KTtcbiAgaGFuZGxlMiA9IG51bGw7XG4gIGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgaWYgKGRvYy5zcGFjZSkge1xuICAgICAgICBpZiAodXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwKSB7XG4gICAgICAgICAgdXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSk7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmVTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICBpZiAob2xkRG9jLnNwYWNlKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2Muc3BhY2UpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVTcGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdXNlclNwYWNlc1xuICAgICAgfVxuICAgIH0pLm9ic2VydmUoe1xuICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgICBzZWxmLmFkZGVkKFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goZG9jLl9pZCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2hhbmdlZChcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2MpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLl9pZCk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBvYnNlcnZlU3BhY2VzKCk7XG4gIHNlbGYucmVhZHkoKTtcbiAgcmV0dXJuIHNlbGYub25TdG9wKGZ1bmN0aW9uKCkge1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIHJldHVybiBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIjIHB1Ymxpc2ggc29tZSBvbmUgc3BhY2UncyBhdmF0YXJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxuXHR1bmxlc3Mgc3BhY2VJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcbiIsIk1ldGVvci5wdWJsaXNoKCdzcGFjZV9hdmF0YXInLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLnNwYWNlcy5maW5kKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgYXZhdGFyOiAxLFxuICAgICAgbmFtZTogMSxcbiAgICAgIGVuYWJsZV9yZWdpc3RlcjogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdtb2R1bGVzJywgKCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHVubGVzcyBfaWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwic3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9jb3JlXCIpO1xuc3RlZWRvc0xpY2Vuc2UgPSByZXF1aXJlKFwiQHN0ZWVkb3MvbGljZW5zZVwiKTtcbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5fZ2V0TG9jYWxlID0gKHVzZXIpLT5cblx0aWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICd6aC1jbidcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0ZWxzZSBpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VuLXVzJ1xuXHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRlbHNlXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdHJldHVybiBsb2NhbGVcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0ID0gKHVzZXJJZCwgc3BhY2VJZCktPlxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpPy5maW5kKHtzcGFjZTogc3BhY2VJZCwgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlfSkuZmV0Y2goKTtcblxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvYm9vdHN0cmFwLzpzcGFjZUlkL1wiLChyZXEsIHJlcywgbmV4dCktPlxuXHR1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ11cblx0c3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnBhcmFtcz8uc3BhY2VJZFxuXHRpZiAhdXNlcklkXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDQwMyxcblx0XHRcdGRhdGE6IG51bGxcblx0XHRyZXR1cm5cblxuXHRhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcylcblx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XG5cdFx0XHRzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XG5cdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcblx0XG5cdHVubGVzcyB1c2VyU2Vzc2lvblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiA1MDAsXG5cdFx0XHRkYXRhOiBudWxsXG5cdFx0cmV0dXJuXG5cblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHtuYW1lOiAxfX0pXG5cblx0cmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xuI1x0Y29uc29sZS50aW1lKCd0cmFuc2xhdGlvbk9iamVjdHMnKTtcblx0bG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2xvY2FsZTogMX19KSlcblx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3RzKGxuZywgcmVzdWx0Lm9iamVjdHMpO1xuI1x0Y29uc29sZS50aW1lRW5kKCd0cmFuc2xhdGlvbk9iamVjdHMnKTtcblx0cmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvblxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxuXHRyZXN1bHQuYXBwcyA9IGNsb25lKENyZWF0b3IuQXBwcylcblx0cmVzdWx0LmRhc2hib2FyZHMgPSBjbG9uZShDcmVhdG9yLkRhc2hib2FyZHMpXG5cdHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKVxuXHRyZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsICdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZFxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxuXHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XG5cdFx0aWYgbmFtZSAhPSAnZGVmYXVsdCdcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcblx0XHRcdF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgKHYsIGspLT5cblx0XHRcdFx0X29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZSh2LnRvQ29uZmlnKCkpLCBzcGFjZUlkKVxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxuXHRcdFx0XHRfb2JqLm5hbWUgPSBrXG5cdFx0XHRcdF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWVcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxuXHRcdFx0XHRyZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29ialxuXHRcdFx0KVxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxuXHRcdHJlc3VsdC5hcHBzID0gXy5leHRlbmQgcmVzdWx0LmFwcHMsIGNsb25lKGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKVxuXHRcdHJlc3VsdC5kYXNoYm9hcmRzID0gXy5leHRlbmQgcmVzdWx0LmRhc2hib2FyZHMsIGRhdGFzb3VyY2UuZ2V0RGFzaGJvYXJkc0NvbmZpZygpXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQoIHJlc3VsdC5hcHBzIHx8IHt9LCBDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSlcblx0cmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZCggcmVzdWx0LmRhc2hib2FyZHMgfHwge30sIENyZWF0b3IuZ2V0REJEYXNoYm9hcmRzKHNwYWNlSWQpKVxuXG5cdF9BcHBzID0ge31cblx0Xy5lYWNoIHJlc3VsdC5hcHBzLCAoYXBwLCBrZXkpIC0+XG5cdFx0aWYgIWFwcC5faWRcblx0XHRcdGFwcC5faWQgPSBrZXlcblx0XHRpZiBhcHAuY29kZVxuXHRcdFx0YXBwLl9kYmlkID0gYXBwLl9pZFxuXHRcdFx0YXBwLl9pZCA9IGFwcC5jb2RlXG5cdFx0X0FwcHNbYXBwLl9pZF0gPSBhcHBcblx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25BcHBzKGxuZywgX0FwcHMpO1xuXHRyZXN1bHQuYXBwcyA9IF9BcHBzO1xuXHRhc3NpZ25lZF9tZW51cyA9IGNsb25lKHJlc3VsdC5hc3NpZ25lZF9tZW51cyk7XG5cdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uTWVudXMobG5nLCBhc3NpZ25lZF9tZW51cyk7XG5cdHJlc3VsdC5hc3NpZ25lZF9tZW51cyA9IGFzc2lnbmVkX21lbnVzO1xuXG5cdF9EYXNoYm9hcmRzID0ge31cblx0Xy5lYWNoIHJlc3VsdC5kYXNoYm9hcmRzLCAoZGFzaGJvYXJkLCBrZXkpIC0+XG5cdFx0aWYgIWRhc2hib2FyZC5faWRcblx0XHRcdGRhc2hib2FyZC5faWQgPSBrZXlcblx0XHRfRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IF9EYXNoYm9hcmRzXG5cblx0cmVzdWx0LnBsdWdpbnMgPSBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zPygpXG5cblx0b2JqZWN0c0xheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCh1c2VySWQsIHNwYWNlSWQpO1xuXG5cdGlmIG9iamVjdHNMYXlvdXRcblx0XHRfLmVhY2ggb2JqZWN0c0xheW91dCwgKG9iamVjdExheW91dCktPlxuXHRcdFx0X29iamVjdCA9IGNsb25lKHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0pO1xuXHRcdFx0aWYgX29iamVjdFxuXHRcdFx0XHRfZmllbGRzID0ge307XG5cdFx0XHRcdF8uZWFjaCBvYmplY3RMYXlvdXQuZmllbGRzLCAoX2l0ZW0pLT5cblx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXSA9IF9vYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXVxuXHRcdFx0XHRcdGlmIF8uaGFzKF9pdGVtLCAnZ3JvdXAnKVxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/Lmdyb3VwID0gX2l0ZW0uZ3JvdXBcblx0XHRcdFx0XHRpZiBfaXRlbS5yZXF1aXJlZFxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlYWRvbmx5ID0gZmFsc2Vcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5kaXNhYmxlZCA9IGZhbHNlXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8ucmVxdWlyZWQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZSBpZiBfaXRlbS5yZWFkb25seVxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlYWRvbmx5ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LmRpc2FibGVkID0gdHJ1ZVxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlcXVpcmVkID0gZmFsc2Vcblx0XHRcdFx0X29iamVjdC5maWVsZHMgPSBfZmllbGRzXG5cbiNcdFx0XHRcdF9hY3Rpb25zID0ge307XG4jXHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmFjdGlvbnMsIChhY3Rpb25OYW1lKS0+XG4jXHRcdFx0XHRcdF9hY3Rpb25zW2FjdGlvbk5hbWVdID0gX29iamVjdC5hY3Rpb25zW2FjdGlvbk5hbWVdXG4jXHRcdFx0XHRfb2JqZWN0LmFjdGlvbnMgPSBfYWN0aW9uc1xuXHRcdFx0XHRfb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxuXHRcdFx0XHRfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdXG5cdFx0XHRyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdID0gX29iamVjdFxuXHQjIFRPRE8gb2JqZWN0IGxheW91dCDmmK/lkKbpnIDopoHmjqfliLblrqHmibnorrDlvZXmmL7npLrvvJ9cblx0c3BhY2VQcm9jZXNzRGVmaW5pdGlvbiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInByb2Nlc3NfZGVmaW5pdGlvblwiKS5maW5kKHtzcGFjZTogc3BhY2VJZCwgYWN0aXZlOiB0cnVlfSwge2ZpZWxkczoge29iamVjdF9uYW1lOiAxfX0pLmZldGNoKCk7XG5cdF8uZWFjaCBzcGFjZVByb2Nlc3NEZWZpbml0aW9uLCAoaXRlbSktPlxuXHRcdHJlc3VsdC5vYmplY3RzW2l0ZW0ub2JqZWN0X25hbWVdPy5lbmFibGVfcHJvY2VzcyA9IHRydWVcblx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRjb2RlOiAyMDAsXG5cdFx0ZGF0YTogcmVzdWx0XG4iLCJ2YXIgX2dldExvY2FsZSwgY2xvbmUsIGdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCwgc3RlZWRvc0F1dGgsIHN0ZWVkb3NDb3JlLCBzdGVlZG9zSTE4biwgc3RlZWRvc0xpY2Vuc2U7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XG5cbnN0ZWVkb3NDb3JlID0gcmVxdWlyZShcIkBzdGVlZG9zL2NvcmVcIik7XG5cbnN0ZWVkb3NMaWNlbnNlID0gcmVxdWlyZShcIkBzdGVlZG9zL2xpY2Vuc2VcIik7XG5cbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xuXG5fZ2V0TG9jYWxlID0gZnVuY3Rpb24odXNlcikge1xuICB2YXIgbG9jYWxlLCByZWYsIHJlZjE7XG4gIGlmICgodXNlciAhPSBudWxsID8gKHJlZiA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnemgtY24nKSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9IGVsc2UgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmMSA9IHVzZXIubG9jYWxlKSAhPSBudWxsID8gcmVmMS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ2VuLXVzJykge1xuICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH1cbiAgcmV0dXJuIGxvY2FsZTtcbn07XG5cbmdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCkge1xuICB2YXIgcmVmLCBzcGFjZVVzZXI7XG4gIHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIHVzZXI6IHVzZXJJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBwcm9maWxlOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZSkge1xuICAgIHJldHVybiAocmVmID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIikpICE9IG51bGwgPyByZWYuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZVxuICAgIH0pLmZldGNoKCkgOiB2b2lkIDA7XG4gIH1cbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBfQXBwcywgX0Rhc2hib2FyZHMsIGFzc2lnbmVkX21lbnVzLCBhdXRoVG9rZW4sIGxuZywgb2JqZWN0c0xheW91dCwgcGVybWlzc2lvbnMsIHJlZiwgcmVzdWx0LCBzcGFjZSwgc3BhY2VJZCwgc3BhY2VQcm9jZXNzRGVmaW5pdGlvbiwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddO1xuICBzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gIGlmICghdXNlcklkKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNDAzLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gIGlmICghdXNlclNlc3Npb24pIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA1MDAsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcbiAgbG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgbG9jYWxlOiAxXG4gICAgfVxuICB9KSk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0cyhsbmcsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvbjtcbiAgcmVzdWx0LnNwYWNlID0gc3BhY2U7XG4gIHJlc3VsdC5hcHBzID0gY2xvbmUoQ3JlYXRvci5BcHBzKTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBjbG9uZShDcmVhdG9yLkRhc2hib2FyZHMpO1xuICByZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cyk7XG4gIHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwoJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkKTtcbiAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgIHJldHVybiB2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgZGF0YXNvdXJjZU9iamVjdHM7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZGF0YXNvdXJjZU9iamVjdHMgPSBkYXRhc291cmNlLmdldE9iamVjdHMoKTtcbiAgICAgIHJldHVybiBfLmVhY2goZGF0YXNvdXJjZU9iamVjdHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgdmFyIF9vYmo7XG4gICAgICAgIF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZCk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMsIGNsb25lKGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKSk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXNoYm9hcmRzID0gXy5leHRlbmQocmVzdWx0LmRhc2hib2FyZHMsIGRhdGFzb3VyY2UuZ2V0RGFzaGJvYXJkc0NvbmZpZygpKTtcbiAgfSk7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMgfHwge30sIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpKTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZChyZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpO1xuICBfQXBwcyA9IHt9O1xuICBfLmVhY2gocmVzdWx0LmFwcHMsIGZ1bmN0aW9uKGFwcCwga2V5KSB7XG4gICAgaWYgKCFhcHAuX2lkKSB7XG4gICAgICBhcHAuX2lkID0ga2V5O1xuICAgIH1cbiAgICBpZiAoYXBwLmNvZGUpIHtcbiAgICAgIGFwcC5fZGJpZCA9IGFwcC5faWQ7XG4gICAgICBhcHAuX2lkID0gYXBwLmNvZGU7XG4gICAgfVxuICAgIHJldHVybiBfQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcbiAgcmVzdWx0LmFwcHMgPSBfQXBwcztcbiAgYXNzaWduZWRfbWVudXMgPSBjbG9uZShyZXN1bHQuYXNzaWduZWRfbWVudXMpO1xuICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xuICByZXN1bHQuYXNzaWduZWRfbWVudXMgPSBhc3NpZ25lZF9tZW51cztcbiAgX0Rhc2hib2FyZHMgPSB7fTtcbiAgXy5lYWNoKHJlc3VsdC5kYXNoYm9hcmRzLCBmdW5jdGlvbihkYXNoYm9hcmQsIGtleSkge1xuICAgIGlmICghZGFzaGJvYXJkLl9pZCkge1xuICAgICAgZGFzaGJvYXJkLl9pZCA9IGtleTtcbiAgICB9XG4gICAgcmV0dXJuIF9EYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfRGFzaGJvYXJkcztcbiAgcmVzdWx0LnBsdWdpbnMgPSB0eXBlb2Ygc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucyA9PT0gXCJmdW5jdGlvblwiID8gc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucygpIDogdm9pZCAwO1xuICBvYmplY3RzTGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0KHVzZXJJZCwgc3BhY2VJZCk7XG4gIGlmIChvYmplY3RzTGF5b3V0KSB7XG4gICAgXy5lYWNoKG9iamVjdHNMYXlvdXQsIGZ1bmN0aW9uKG9iamVjdExheW91dCkge1xuICAgICAgdmFyIF9maWVsZHMsIF9vYmplY3Q7XG4gICAgICBfb2JqZWN0ID0gY2xvbmUocmVzdWx0Lm9iamVjdHNbb2JqZWN0TGF5b3V0Lm9iamVjdF9uYW1lXSk7XG4gICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICBfZmllbGRzID0ge307XG4gICAgICAgIF8uZWFjaChvYmplY3RMYXlvdXQuZmllbGRzLCBmdW5jdGlvbihfaXRlbSkge1xuICAgICAgICAgIHZhciByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3O1xuICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdO1xuICAgICAgICAgIGlmIChfLmhhcyhfaXRlbSwgJ2dyb3VwJykpIHtcbiAgICAgICAgICAgIGlmICgocmVmMSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjEuZ3JvdXAgPSBfaXRlbS5ncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9pdGVtLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICBpZiAoKHJlZjIgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYyLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHJlZjMgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjQgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjQucmVxdWlyZWQgPSB0cnVlIDogdm9pZCAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAoX2l0ZW0ucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGlmICgocmVmNSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjUucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChyZWY2ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmNi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjcgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjcucmVxdWlyZWQgPSBmYWxzZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBfb2JqZWN0LmZpZWxkcyA9IF9maWVsZHM7XG4gICAgICAgIF9vYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdO1xuICAgICAgICBfb2JqZWN0LmFsbG93X3JlbGF0ZWRMaXN0ID0gb2JqZWN0TGF5b3V0LnJlbGF0ZWRMaXN0IHx8IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0gPSBfb2JqZWN0O1xuICAgIH0pO1xuICB9XG4gIHNwYWNlUHJvY2Vzc0RlZmluaXRpb24gPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJwcm9jZXNzX2RlZmluaXRpb25cIikuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgYWN0aXZlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG9iamVjdF9uYW1lOiAxXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfLmVhY2goc3BhY2VQcm9jZXNzRGVmaW5pdGlvbiwgZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiAocmVmMSA9IHJlc3VsdC5vYmplY3RzW2l0ZW0ub2JqZWN0X25hbWVdKSAhPSBudWxsID8gcmVmMS5lbmFibGVfcHJvY2VzcyA9IHRydWUgOiB2b2lkIDA7XG4gIH0pO1xuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdGJvZHkgPSBcIlwiXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XG5cdFx0XHRib2R5ICs9IGNodW5rXG5cdFx0KVxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxuXHRcdFx0XHR4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKVxuXHRcdFx0XHRwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7IHRyaW06dHJ1ZSwgZXhwbGljaXRBcnJheTpmYWxzZSwgZXhwbGljaXRSb290OmZhbHNlIH0pXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdCMg54m55Yir5o+Q6YaS77ya5ZWG5oi357O757uf5a+55LqO5pSv5LuY57uT5p6c6YCa55+l55qE5YaF5a655LiA5a6a6KaB5YGa562+5ZCN6aqM6K+BLOW5tuagoemqjOi/lOWbnueahOiuouWNlemHkemineaYr+WQpuS4juWVhuaIt+S+p+eahOiuouWNlemHkemineS4gOiHtO+8jOmYsuatouaVsOaNruazhOa8j+WvvOiHtOWHuueOsOKAnOWBh+mAmuefpeKAne+8jOmAoOaIkOi1hOmHkeaNn+WksVxuXHRcdFx0XHRcdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jylcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xuXHRcdFx0XHRcdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG5cdFx0XHRcdFx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSlcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcblx0XHRcdFx0XHRcdGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkXG5cdFx0XHRcdFx0XHRicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXG5cdFx0XHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtfaWQ6IGNvZGVfdXJsX2lkfSwgeyRzZXQ6IHtwYWlkOiB0cnVlfX0pXG5cdFx0XHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdClcblx0XHRcdCksIChlcnIpLT5cblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJ1xuXHRcdFx0KVxuXHRcdClcblx0XHRcblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdHJlcy53cml0ZUhlYWQoMjAwLCB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnfSlcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcblxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm9keSwgZTtcbiAgdHJ5IHtcbiAgICBib2R5ID0gXCJcIjtcbiAgICByZXEub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgcmV0dXJuIGJvZHkgKz0gY2h1bms7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXJzZXIsIHhtbDJqcztcbiAgICAgIHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuICAgICAgcGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoe1xuICAgICAgICB0cmltOiB0cnVlLFxuICAgICAgICBleHBsaWNpdEFycmF5OiBmYWxzZSxcbiAgICAgICAgZXhwbGljaXRSb290OiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlU3RyaW5nKGJvZHksIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBXWFBheSwgYXR0YWNoLCBicHIsIGNvZGVfdXJsX2lkLCBzaWduLCB3eHBheTtcbiAgICAgICAgV1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jyk7XG4gICAgICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgICAgICBtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcbiAgICAgICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICAgICAgfSk7XG4gICAgICAgIHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSk7XG4gICAgICAgIGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaCk7XG4gICAgICAgIGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkO1xuICAgICAgICBicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpO1xuICAgICAgICBpZiAoYnByICYmIGJwci50b3RhbF9mZWUgPT09IE51bWJlcihyZXN1bHQudG90YWxfZmVlKSAmJiBzaWduID09PSByZXN1bHQuc2lnbikge1xuICAgICAgICAgIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogY29kZV91cmxfaWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGFwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUnKTtcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gIH1cbiAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCdcbiAgfSk7XG4gIHJldHVybiByZXMuZW5kKCc8eG1sPjxyZXR1cm5fY29kZT48IVtDREFUQVtTVUNDRVNTXV0+PC9yZXR1cm5fY29kZT48L3htbD4nKTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4unRydWXooajnpLrpmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4fojIPlm7TvvIxvcmdhbml6YXRpb25z5YC86K6w5b2V6aKd5aSW55qE57uE57uH6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xuXHRcdGNoZWNrIHNwYWNlLCBTdHJpbmdcblx0XHRyZVZhbHVlID1cblx0XHRcdGlzTGltaXQ6IHRydWVcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXG5cdFx0bGltaXRzID0gc2V0dGluZz8udmFsdWVzIHx8IFtdO1xuXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxuXHRcdFx0bXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHVzZXJzOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdHVubGVzcyBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRcdFxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBbXVxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXG5cdFx0XHRcdHRvcyA9IGxpbWl0LnRvc1xuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxuXHRcdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0XHRpZiBmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XG5cdFx0XHRcdFx0XHRpc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcblxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHQjIOWmguaenOWPl+mZkOeahOe7hOe7h+S4quaVsOWwj+S6jueUqOaIt+aJgOWxnue7hOe7h+eahOS4quaVsO+8jOWImeivtOaYjuW9k+WJjeeUqOaIt+iHs+WwkeacieS4gOS4que7hOe7h+aYr+S4jeWPl+mZkOeahFxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRcdGVsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblxuXHRcdGlmIGlzTGltaXRcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ5bGe5LqO55So5oi35omA5bGe57uE57uH55qE5a2Q5a2Z6IqC54K555qE6IqC54K55Yig6ZmkXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSBhbmQgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDFcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXHRcdHJldHVybiByZVZhbHVlXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjaGVjayhrZXksIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xuXG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xuICAgICAgICBvYmoua2V5ID0ga2V5O1xuICAgICAgICBvYmoudmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xuICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KSIsIk1ldGVvci5tZXRob2RzXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XG5cdFx0Y2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKVxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpXG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXG5cdFx0XHRyZXR1cm5cblxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcblx0XHRzcGFjZXMgPSBbXVxuXHRcdGlmIHNwYWNlX2lkXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRlbHNlXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRyZXN1bHQgPSBbXVxuXHRcdHNwYWNlcy5mb3JFYWNoIChzKSAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXG5cdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0ZSA9IHt9XG5cdFx0XHRcdGUuX2lkID0gcy5faWRcblx0XHRcdFx0ZS5uYW1lID0gcy5uYW1lXG5cdFx0XHRcdGUuZXJyID0gZXJyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcblx0XHRpZiByZXN1bHQubGVuZ3RoID4gMFxuXHRcdFx0Y29uc29sZS5lcnJvciByZXN1bHRcblx0XHRcdHRyeVxuXHRcdFx0XHRFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWxcblx0XHRcdFx0RW1haWwuc2VuZFxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcblx0XHRcdFx0XHRmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tXG5cdFx0XHRcdFx0c3ViamVjdDogJ2JpbGxpbmcgc2V0dGxldXAgcmVzdWx0J1xuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXG5cdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuXG5cdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpIGFuZCB1c2VyX2lkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxuXG5cdFx0aWYgbm90IE1ldGVvci51c2VySWQoKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXG5cblx0XHR1bmxlc3MgdXNlcl9pZFxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcblxuXHRcdHJldHVybiB1c2VybmFtZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0YmlsbGluZ19yZWNoYXJnZTogKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZyBcblx0XHRjaGVjayBuZXdfaWQsIFN0cmluZyBcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxuXHRcdGNoZWNrIGVuZF9kYXRlLCBTdHJpbmcgXG5cdFx0Y2hlY2sgdXNlcl9jb3VudCwgTnVtYmVyIFxuXG5cdFx0dXNlcl9pZCA9IHRoaXMudXNlcklkXG5cblx0XHRsaXN0cHJpY2VzID0gMFxuXHRcdG9yZGVyX2JvZHkgPSBbXVxuXHRcdGRiLm1vZHVsZXMuZmluZCh7bmFtZTogeyRpbjogbW9kdWxlX25hbWVzfX0pLmZvckVhY2ggKG0pLT5cblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXG5cdFx0XHRvcmRlcl9ib2R5LnB1c2ggbS5uYW1lX3poXG5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRcdGlmIG5vdCBzcGFjZS5pc19wYWlkXG5cdFx0XHRzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXG5cdFx0XHRpZiB0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbioxMDBcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciAnZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6Uje29uZV9tb250aF95dWFufVwiXG5cblx0XHRyZXN1bHRfb2JqID0ge31cblxuXHRcdGF0dGFjaCA9IHt9XG5cdFx0YXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkXG5cdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5JylcblxuXHRcdHd4cGF5ID0gV1hQYXkoe1xuXHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG5cdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxuXHRcdH0pXG5cblx0XHR3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuXHRcdFx0Ym9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuXHRcdFx0dG90YWxfZmVlOiB0b3RhbF9mZWUsXG5cdFx0XHRzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG5cdFx0XHR0cmFkZV90eXBlOiAnTkFUSVZFJyxcblx0XHRcdHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuXHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKChlcnIsIHJlc3VsdCkgLT4gXG5cdFx0XHRcdGlmIGVyciBcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xuXHRcdFx0XHRpZiByZXN1bHRcblx0XHRcdFx0XHRvYmogPSB7fVxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcblx0XHRcdFx0XHRvYmouY3JlYXRlZCA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0b2JqLmluZm8gPSByZXN1bHRcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXG5cdFx0XHRcdFx0b2JqLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXG5cdFx0XHRcdFx0b2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcblx0XHRcdFx0XHRvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxuXHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iailcblx0XHRcdCksIChlKS0+XG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUnXG5cdFx0XHRcdGNvbnNvbGUubG9nIGUuc3RhY2tcblx0XHRcdClcblx0XHQpXG5cblx0XHRcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJyk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coZS5zdGFjayk7XG4gICAgfSkpO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3Rcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcblxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcblxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXG5cbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcblxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcblxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQgfSwgeyBmaWVsZHM6IHsgb2JqZWN0X25hbWU6IDEsIGZsb3dfaWQ6IDEsIHNwYWNlOiAxIH0gfSkuZmV0Y2goKVxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcbiAgICAgICAgICAgIGlmIGZsXG4gICAgICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXG4gICAgICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcblxuICAgICAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcbiAgICAgICAgICAgICAgICBpZiBwZXJtc1xuICAgICAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcblxuICAgICAgICBvd3MgPSBvd3MuZmlsdGVyIChuKS0+XG4gICAgICAgICAgICByZXR1cm4gbi5mbG93X25hbWVcblxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmwpIHtcbiAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXG5cdFx0XG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZV9pZH0pXG5cdFx0aXNTcGFjZUFkbWluID0gc3BhY2U/LmFkbWlucz8uaW5jbHVkZXModGhpcy51c2VySWQpXG5cblx0XHR1bmxlc3MgaXNTcGFjZUFkbWluXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcblxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe19pZDogc3BhY2VfdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblx0XHR1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XG5cdFx0dXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIilcblxuXHRcdFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZClcblx0XHRsb2dvdXQgPSB0cnVlO1xuXHRcdGlmIHRoaXMudXNlcklkID09IHVzZXJfaWRcblx0XHRcdGxvZ291dCA9IGZhbHNlXG5cdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtsb2dvdXQ6IGxvZ291dH0pXG5cdFx0Y2hhbmdlZFVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRpZiBjaGFuZ2VkVXNlckluZm9cblx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRwdXNoOiB7J3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiBjaGFuZ2VkVXNlckluZm8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHR9fSlcblxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3Jyxcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjaGFuZ2VkVXNlckluZm8sIGN1cnJlbnRVc2VyLCBpc1NwYWNlQWRtaW4sIGxhbmcsIGxvZ291dCwgcmVmLCByZWYxLCByZWYyLCBzcGFjZSwgc3BhY2VVc2VyLCB1c2VyQ1AsIHVzZXJfaWQ7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpc1NwYWNlQWRtaW4gPSBzcGFjZSAhPSBudWxsID8gKHJlZiA9IHNwYWNlLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh0aGlzLnVzZXJJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaWYgKCFpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XG4gICAgdXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpO1xuICAgIH1cbiAgICBTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIGxvZ291dCA9IHRydWU7XG4gICAgaWYgKHRoaXMudXNlcklkID09PSB1c2VyX2lkKSB7XG4gICAgICBsb2dvdXQgPSBmYWxzZTtcbiAgICB9XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtcbiAgICAgIGxvZ291dDogbG9nb3V0XG4gICAgfSk7XG4gICAgY2hhbmdlZFVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KTtcbiAgICBpZiAoY2hhbmdlZFVzZXJJbmZvKSB7XG4gICAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHVzZXJfaWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAnc2VydmljZXMucGFzc3dvcmRfaGlzdG9yeSc6IChyZWYxID0gY2hhbmdlZFVzZXJJbmZvLnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMi5iY3J5cHQgOiB2b2lkIDAgOiB2b2lkIDBcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICh1c2VyQ1AubW9iaWxlICYmIHVzZXJDUC5tb2JpbGVfdmVyaWZpZWQpIHtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKHVzZXJDUC5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICByZXR1cm4gU01TUXVldWUuc2VuZCh7XG4gICAgICAgIEZvcm1hdDogJ0pTT04nLFxuICAgICAgICBBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcbiAgICAgICAgUGFyYW1TdHJpbmc6ICcnLFxuICAgICAgICBSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG4gICAgICAgIFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcbiAgICAgICAgVGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcbiAgICAgICAgbXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYmlsbGluZ01hbmFnZXIgPSB7fVxuXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxuIyBzcGFjZV9pZCDnu5Pnrpflr7nosaHlt6XkvZzljLpcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRjb3VudF9kYXlzID0gMFxuXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcblx0Zmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlXG5cblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0c3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMS1lbmRfZGF0ZV90aW1lLmdldERhdGUoKSlcblxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXG5cdFx0IyBkbyBub3RoaW5nXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblx0ZWxzZSBpZiBmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXG5cdHJldHVybiB7XCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXN9XG5cbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSAoc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSktPlxuXHRsYXN0X2JpbGwgPSBudWxsXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXG5cblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRjcmVhdGVkOiB7XG5cdFx0XHRcdCRsdDogcmVmcmVzaF9kYXRlXG5cdFx0XHR9LFxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRpZiBwYXltZW50X2JpbGxcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcblx0ZWxzZVxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRcdGlmIGFwcF9iaWxsXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxuXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdGRlYml0cyA9IGlmIGJpbGwuZGViaXRzIHRoZW4gYmlsbC5kZWJpdHMgZWxzZSAwLjBcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XG5cdHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXG5cbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxuXHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xuXHRcdFx0XHQkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRuZXdfYmlsbCA9IG5ldyBPYmplY3Rcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXG5cdG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXG5cdG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZVxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcblx0bmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XG5cdGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XG5cdGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0cmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheVxuXHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdHtcblx0XHRcdGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxuXHRcdH1cblx0KS5mb3JFYWNoIChiaWxsKS0+XG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcblxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdG1vZHVsZXMgPSBuZXcgQXJyYXlcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XG5cdFx0bV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRtb2R1bGU6IG0ubmFtZSxcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRjcmVhdGVkOiAtMVxuXHRcdFx0fVxuXHRcdClcblx0XHQjIOiLpeacquiOt+W+l+WPr+WMuemFjeeahOiusOW9le+8jOivtOaYjuivpW1vZHVsZeacquWuieijhe+8jOW9k+aciOS4jeiuoeeul+i0ueeUqFxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xuXHRcdFx0IyAgZG8gbm90aGluZ1xuXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblxuXHRyZXR1cm4gbW9kdWxlc1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCgobSktPlxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcblx0KVxuXHRyZXR1cm4gbW9kdWxlc19uYW1lXG5cblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0cmV0dXJuXG5cdGlmIGFjY291bnRpbmdfbW9udGggPT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGRlYml0cyA9IDBcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0XHR7XG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCkuZm9yRWFjaCgoYiktPlxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXG5cdFx0KVxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxuXHRcdHJlbWFpbmluZ19tb250aHMgPSAwXG5cdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdGlmIGRlYml0cyA+IDBcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UvZGViaXRzKSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IDFcblxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcblx0XHRcdFx0XHRcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdGVsc2Vcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcblx0XHRwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGVsc2Vcblx0XHRcdHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZClcblxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcblx0XHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0ZGIuYmlsbGluZ3MucmVtb3ZlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdFx0IyDnu5PnrpflvZPmnIjnmoRBUFDkvb/nlKjlkI7kvZnpop1cblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXG5cdFx0XHRcdF8uZWFjaCBtb2R1bGVzLCAobSktPlxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcblxuXHRcdGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSAoc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblxuXHRtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXlcblxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXG5cblx0bSA9IG1vbWVudCgpXG5cdG5vdyA9IG0uX2RcblxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxuXG5cdCMg5pu05pawc3BhY2XmmK/lkKbkuJPkuJrniYjnmoTmoIforrBcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGVcblxuXHQjIOabtOaWsG1vZHVsZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXG5cdHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSlcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXG5cdHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzcGFjZV9pZH0sIHskc2V0OiBzcGFjZV91cGRhdGVfb2JqfSlcblx0aWYgclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxuXHRcdFx0bWNsID0gbmV3IE9iamVjdFxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXG5cdFx0XHRtY2wubW9kdWxlID0gbW9kdWxlXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXG5cblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblxuICBpZiAoTWV0ZW9yLnNldHRpbmdzLmNyb24gJiYgTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcykge1xuXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xuICAgIC8vIOWumuaXtuaJp+ihjOe7n+iuoVxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcblxuICAgIHZhciBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFnb19uZXh0KVxuICAgICAgICByZXR1cm47XG4gICAgICBnb19uZXh0ID0gZmFsc2U7XG5cbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XG4gICAgICB9O1xuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZE5vdyA9IG5ldyBEYXRlKCk7ICAgLy/lvZPliY3ml7bpl7RcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XG4gICAgICB9O1xuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjpzcGFjZVtcIl9pZFwiXSxcImNyZWF0ZWRcIjp7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6LmgLvmlbBcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcbiAgICAgIHZhciBvd25lck5hbWUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXG4gICAgICB2YXIgbGFzdExvZ29uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcbiAgICAgICAgc1VzZXJzLmZvckVhY2goZnVuY3Rpb24gKHNVc2VyKSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XG4gICAgICAgICAgICBsYXN0TG9nb24gPSB1c2VyLmxhc3RfbG9nb247XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbGFzdExvZ29uO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xuICAgICAgdmFyIGxhc3RNb2RpZmllZCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XG4gICAgICAgIGlmKG9iakFyci5sZW5ndGggPiAwKVxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XG4gICAgICAgICAgcmV0dXJuIG1vZDtcbiAgICAgIH07XG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pICBcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5b2T5pel5paw5aKe6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOiBwb3N0W1wiX2lkXCJdLCBcInVwbG9hZGVkQXRcIjogeyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDmj5LlhaXmlbDmja5cbiAgICAgIGRiLnNwYWNlcy5maW5kKHtcImlzX3BhaWRcIjp0cnVlfSkuZm9yRWFjaChmdW5jdGlvbiAoc3BhY2UpIHtcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxuICAgICAgICAgIHNwYWNlX25hbWU6IHNwYWNlW1wibmFtZVwiXSxcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBzdGVlZG9zOntcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHN0YXRpY3NDb3VudChkYi5vcmdhbml6YXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgd29ya2Zsb3c6e1xuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19yb2xlczogc3RhdGljc0NvdW50KGRiLmZsb3dfcm9sZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9pbnN0YW5jZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjbXM6IHtcbiAgICAgICAgICAgIHNpdGVzOiBzdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogcG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xuXG4gICAgICBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIH0sIGZ1bmN0aW9uIChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IHN0YXRpc3RpY3MuanMnKTtcbiAgICAgIGNvbnNvbGUubG9nKGUuc3RhY2spO1xuICAgIH0pKTtcblxuICB9XG5cbn0pXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMVxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IChwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCktPlxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcbiAgICAgICAgICAgICAgICBpID0gMFxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpXG5cbiAgICAgICAgICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJykiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAxLFxuICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBpLCB1cGRhdGVfY2ZzX2luc3RhbmNlO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IGZ1bmN0aW9uKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRfaWQsXG4gICAgICAgICAgICBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZV9pZCxcbiAgICAgICAgICAgIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0N1cnJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICAgICBcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGlucykge1xuICAgICAgICAgIHZhciBhdHRhY2hzLCBpbnN0YW5jZV9pZCwgc3BhY2VfaWQ7XG4gICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50cztcbiAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZTtcbiAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWQ7XG4gICAgICAgICAgYXR0YWNocy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmVyLCBwYXJlbnRfaWQ7XG4gICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50O1xuICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldjtcbiAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChhdHQuaGlzdG9yeXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dC5oaXN0b3J5cy5mb3JFYWNoKGZ1bmN0aW9uKGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGkrKztcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAyXG4gICAgICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OSdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe29yZ2FuaXphdGlvbnM6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogM1xuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3UudXNlcn0sIHtmaWVsZHM6IHtlbWFpbHM6IDF9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiA0XG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7c29ydF9ubzogeyRleGlzdHM6IGZhbHNlfX0sIHskc2V0OiB7c29ydF9ubzogMTAwfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA1XG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdFx0dHJ5XG5cblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcblx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcblx0XHRcdFx0XHRcdFx0XHRyID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLCBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZH19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxuXHRcdFx0XHRcdGVsc2UgaWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KClcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXG5cdFx0XHRcdFx0XHRpZiByZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHN9fSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDZcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdFx0dHJ5XG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxuXHRcdFx0XHR9KVxuXG5cblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2Vcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuICAgIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKVxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMgPSB7XG4gICAgICAgICAgICBcImNyZWF0b3JcIjoge1xuICAgICAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XG4gICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByb290VVJMO1xuICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzID0ge1xuICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvcikge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTDtcbiAgfVxufSk7XG4iLCJpZihNZXRlb3IuaXNEZXZlbG9wbWVudCl7XG5cdC8vTWV0ZW9yIOeJiOacrOWNh+e6p+WIsDEuOSDlj4rku6XkuIrml7Yobm9kZSDniYjmnKwgMTErKe+8jOWPr+S7peWIoOmZpOatpOS7o+eggVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmxhdCcsIHtcblx0XHR2YWx1ZTogZnVuY3Rpb24oZGVwdGggPSAxKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5yZWR1Y2UoZnVuY3Rpb24gKGZsYXQsIHRvRmxhdHRlbikge1xuXHRcdFx0XHRyZXR1cm4gZmxhdC5jb25jYXQoKEFycmF5LmlzQXJyYXkodG9GbGF0dGVuKSAmJiAoZGVwdGg+MSkpID8gdG9GbGF0dGVuLmZsYXQoZGVwdGgtMSkgOiB0b0ZsYXR0ZW4pO1xuXHRcdFx0fSwgW10pO1xuXHRcdH1cblx0fSk7XG59IiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRuZXcgVGFidWxhci5UYWJsZVxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxuXHRcdGNvbHVtbnM6IFtcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZVxuXHRcdFx0fVxuXHRcdF1cblx0XHRkb206IFwidHBcIlxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2Vcblx0XHRvcmRlcmluZzogZmFsc2Vcblx0XHRwYWdlTGVuZ3RoOiAxMFxuXHRcdGluZm86IGZhbHNlXG5cdFx0c2VhcmNoaW5nOiB0cnVlXG5cdFx0YXV0b1dpZHRoOiB0cnVlXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxuXHRcdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
