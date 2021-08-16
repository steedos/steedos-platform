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

if (Meteor.settings && Meteor.settings.billing) {
  checkNpmVersions({
    "weixin-pay": "^1.1.7"
  }, 'steedos:base');
}
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

if (Meteor.isServer) {
  Steedos.formatIndex = function (array) {
    var indexName, isdocumentDB, object, ref, ref1, ref2;
    object = {
      background: true
    };
    isdocumentDB = ((ref = Meteor.settings) != null ? (ref1 = ref.datasources) != null ? (ref2 = ref1["default"]) != null ? ref2.documentDB : void 0 : void 0 : void 0) || false;

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

}},"routes":{"api_billing_recharge_notify.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/routes/api_billing_recharge_notify.coffee                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

},"billing_settleup.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/billing_settleup.coffee                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

},"billing_recharge.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/billing_recharge.coffee                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL21ldGhvZHMvc2V0S2V5VmFsdWUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2dldF9zcGFjZV91c2VyX2NvdW50LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9zY2hlZHVsZS9zdGF0aXN0aWNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YxLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YxLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Mi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Mi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjYuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjYuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvZGV2ZWxvcG1lbnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvdGFidWxhci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiY29va2llcyIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiYmlsbGluZyIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNDbGllbnQiLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsInR5cGUiLCJjb25maXJtQnV0dG9uVGV4dCIsImdldEFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHkiLCJzdGVlZG9zX2tleXZhbHVlcyIsImZpbmRPbmUiLCJ1c2VyIiwidXNlcklkIiwia2V5IiwidmFsdWUiLCJhcHBseUFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHlWYWx1ZSIsImlzTmVlZFRvTG9jYWwiLCJhdmF0YXIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCIkIiwicmVtb3ZlQ2xhc3MiLCJTZXNzaW9uIiwiZ2V0IiwiYWRkQ2xhc3MiLCJzaG93SGVscCIsImdldExvY2FsZSIsIndpbmRvdyIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJhdXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhYnNvbHV0ZVVybCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJpc0NvcmRvdmEiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwiZXJyb3IxIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwic3BhY2VJZCIsImVuZF9kYXRlIiwibWluX21vbnRocyIsInNwYWNlIiwiaXNTcGFjZUFkbWluIiwic3BhY2VzIiwiaGFzRmVhdHVyZSIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiY3NzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlZjIiLCJyZWYzIiwicmVzdWx0IiwidXNlcm5hbWUiLCJxdWVyeSIsInVzZXJzIiwic3RlZWRvc19pZCIsIl9jaGVja1Bhc3N3b3JkIiwiRXJyb3IiLCJjaGVja0F1dGhUb2tlbiIsImhlYWRlcnMiLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImRlY3J5cHQiLCJpdiIsImMiLCJkZWNpcGhlciIsImRlY2lwaGVyTXNnIiwia2V5MzIiLCJsZW4iLCJjcmVhdGVEZWNpcGhlcml2IiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJlbmNyeXB0IiwiY2lwaGVyIiwiY2lwaGVyZWRNc2ciLCJjcmVhdGVDaXBoZXJpdiIsImdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsImNvbGxlY3Rpb24iLCJvYmoiLCJzcGxpdCIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiZnVuYyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlYXNvbiIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0REJEYXNoYm9hcmRzIiwiZGJEYXNoYm9hcmRzIiwiZGFzaGJvYXJkIiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiam9pbiIsInN0YXJ0dXAiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZm9yZWlnbl9rZXkiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInJlZmVyZW5jZXMiLCJtZXRob2RzIiwidXBkYXRlVXNlckxhc3RMb2dvbiIsIiRzZXQiLCJsYXN0X2xvZ29uIiwib25Mb2dpbiIsInVzZXJzX2FkZF9lbWFpbCIsImVtYWlsIiwiY291bnQiLCJlbWFpbHMiLCJkaXJlY3QiLCIkcHVzaCIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsInVzZXJzX3JlbW92ZV9lbWFpbCIsInAiLCIkcHVsbCIsInVzZXJzX3ZlcmlmeV9lbWFpbCIsInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsIiwicHJpbWFyeSIsIm11bHRpIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNsb3NlT25Db25maXJtIiwiYW5pbWF0aW9uIiwiaW5wdXRWYWx1ZSIsInVwZGF0ZVVzZXJBdmF0YXIiLCJlbWFpbFRlbXBsYXRlcyIsImRlZmF1bHRGcm9tIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJzcGxpdHMiLCJ0b2tlbkNvZGUiLCJncmVldGluZyIsInByb2ZpbGUiLCJ0b2tlbl9jb2RlIiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiYWRkIiwib3JncyIsImZ1bGxuYW1lIiwiJG5lIiwiY2FsY3VsYXRlRnVsbG5hbWUiLCJyZXQiLCJtc2ciLCJQdXNoIiwiQ29uZmlndXJlIiwic2VuZGVySUQiLCJBTkRST0lEX1NFTkRFUl9JRCIsInNvdW5kIiwidmlicmF0ZSIsImlvcyIsImJhZGdlIiwiY2xlYXJCYWRnZSIsImFsZXJ0IiwiYXBwTmFtZSIsIlNlbGVjdG9yIiwic2VsZWN0b3JDaGVja1NwYWNlQWRtaW4iLCJzZWxlY3RvciIsImlzX2Nsb3VkYWRtaW4iLCJtYXAiLCJuIiwic2VsZWN0b3JDaGVja1NwYWNlIiwidSIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJhZG1pbkNvbmZpZyIsImljb24iLCJjb2xvciIsInRhYmxlQ29sdW1ucyIsImV4dHJhRmllbGRzIiwicm91dGVyQWRtaW4iLCJwYWlkIiwic2hvd0VkaXRDb2x1bW4iLCJzaG93RGVsQ29sdW1uIiwiZGlzYWJsZUFkZCIsInBhZ2VMZW5ndGgiLCJvcmRlciIsInNwYWNlX3VzZXJfc2lnbnMiLCJBZG1pbkNvbmZpZyIsImNvbGxlY3Rpb25zX2FkZCIsInNlYXJjaEVsZW1lbnQiLCJPIiwiY3VycmVudEVsZW1lbnQiLCJ3ZWJzZXJ2aWNlcyIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwidXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJnZXRTcGFjZSIsIiRvciIsIiRleGlzdHMiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJzdGVlZG9zQXV0aCIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsInVzZXJTZXNzaW9uIiwiU3RyaW5nIiwid3JhcEFzeW5jIiwiY2IiLCJnZXRTZXNzaW9uIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJleHByZXNzIiwiZGVzX2NpcGhlciIsImRlc19jaXBoZXJlZE1zZyIsImRlc19pdiIsImRlc19zdGVlZG9zX3Rva2VuIiwiam9pbmVyIiwia2V5OCIsInJlZGlyZWN0VXJsIiwicmV0dXJudXJsIiwicGFyYW1zIiwid3JpdGVIZWFkIiwiZW5kIiwiZW5jb2RlVVJJIiwic2V0SGVhZGVyIiwiY29sb3JfaW5kZXgiLCJjb2xvcnMiLCJmb250U2l6ZSIsImluaXRpYWxzIiwicG9zaXRpb24iLCJyZXFNb2RpZmllZEhlYWRlciIsInN2ZyIsInVzZXJuYW1lX2FycmF5Iiwid2lkdGgiLCJ3IiwiZnMiLCJnZXRSZWxhdGl2ZVVybCIsImF2YXRhclVybCIsImZpbGUiLCJ3cml0ZSIsIml0ZW0iLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ0b1VUQ1N0cmluZyIsInJlYWRTdHJlYW0iLCJwaXBlIiwicHVibGlzaCIsInJlYWR5IiwiaGFuZGxlIiwiaGFuZGxlMiIsIm9ic2VydmVTcGFjZXMiLCJzZWxmIiwic3VzIiwidXNlclNwYWNlcyIsInVzZXJfYWNjZXB0ZWQiLCJzdSIsIm9ic2VydmUiLCJhZGRlZCIsImRvYyIsInJlbW92ZWQiLCJvbGREb2MiLCJ3aXRob3V0Iiwic3RvcCIsImNoYW5nZWQiLCJuZXdEb2MiLCJvblN0b3AiLCJlbmFibGVfcmVnaXN0ZXIiLCJvbiIsImNodW5rIiwiYmluZEVudmlyb25tZW50IiwicGFyc2VyIiwieG1sMmpzIiwiUGFyc2VyIiwiZXhwbGljaXRBcnJheSIsImV4cGxpY2l0Um9vdCIsInBhcnNlU3RyaW5nIiwiZXJyIiwiV1hQYXkiLCJhdHRhY2giLCJicHIiLCJjb2RlX3VybF9pZCIsInNpZ24iLCJ3eHBheSIsImFwcGlkIiwibWNoX2lkIiwicGFydG5lcl9rZXkiLCJjbG9uZSIsIkpTT04iLCJwYXJzZSIsInRvdGFsX2ZlZSIsImJpbGxpbmdNYW5hZ2VyIiwic3BlY2lhbF9wYXkiLCJ1c2VyX2NvdW50IiwibG9nIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJiaWxsaW5nX3NldHRsZXVwIiwiYWNjb3VudGluZ19tb250aCIsIkVtYWlsIiwidGltZSIsImlzX3BhaWQiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5IiwidGltZUVuZCIsInNldFVzZXJuYW1lIiwic3BhY2VVc2VyIiwiaW52aXRlX3N0YXRlIiwiYmlsbGluZ19yZWNoYXJnZSIsIm5ld19pZCIsIm1vZHVsZV9uYW1lcyIsImxpc3RwcmljZXMiLCJvbmVfbW9udGhfeXVhbiIsIm9yZGVyX2JvZHkiLCJyZXN1bHRfb2JqIiwic3BhY2VfdXNlcl9jb3VudCIsImxpc3RwcmljZV9ybWIiLCJuYW1lX3poIiwiY3JlYXRlVW5pZmllZE9yZGVyIiwib3V0X3RyYWRlX25vIiwibW9tZW50IiwiZm9ybWF0Iiwic3BiaWxsX2NyZWF0ZV9pcCIsIm5vdGlmeV91cmwiLCJ0cmFkZV90eXBlIiwicHJvZHVjdF9pZCIsImluZm8iLCJnZXRfc3BhY2VfdXNlcl9jb3VudCIsInVzZXJfY291bnRfaW5mbyIsInRvdGFsX3VzZXJfY291bnQiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3JlYXRlX3NlY3JldCIsInJlbW92ZV9zZWNyZXQiLCJ0b2tlbiIsImN1clNwYWNlVXNlciIsIm93cyIsImZsb3dfaWQiLCJmbCIsInBlcm1zIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY2hhbmdlZFVzZXJJbmZvIiwiY3VycmVudFVzZXIiLCJsYW5nIiwibG9nb3V0IiwidXNlckNQIiwic2V0UGFzc3dvcmQiLCJzZXJ2aWNlcyIsImJjcnlwdCIsIm1vYmlsZV92ZXJpZmllZCIsIlNNU1F1ZXVlIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwibW9kdWxlX25hbWUiLCJsaXN0cHJpY2UiLCJhY2NvdW50aW5nX2RhdGUiLCJhY2NvdW50aW5nX2RhdGVfZm9ybWF0IiwiZGF5c19udW1iZXIiLCJuZXdfYmlsbCIsIiRsdGUiLCJfbWFrZU5ld0lEIiwiZ2V0U3BhY2VVc2VyQ291bnQiLCJyZWNhY3VsYXRlQmFsYW5jZSIsInJlZnJlc2hfZGF0ZXMiLCJyX2QiLCJnZXRfbW9kdWxlcyIsIm1fY2hhbmdlbG9nIiwibW9kdWxlc19jaGFuZ2Vsb2dzIiwiY2hhbmdlX2RhdGUiLCJvcGVyYXRpb24iLCJnZXRfbW9kdWxlc19uYW1lIiwibW9kdWxlc19uYW1lIiwiYV9tIiwibmV3ZXN0X2JpbGwiLCJwZXJpb2RfcmVzdWx0IiwicmVtYWluaW5nX21vbnRocyIsImIiLCJvcGVyYXRvcl9pZCIsIm5ld19tb2R1bGVzIiwic3BhY2VfdXBkYXRlX29iaiIsImRpZmZlcmVuY2UiLCJfZCIsInVzZXJfbGltaXQiLCJtY2wiLCJvcGVyYXRvciIsImNyb24iLCJzdGF0aXN0aWNzIiwic2NoZWR1bGUiLCJydWxlIiwiZ29fbmV4dCIsInNjaGVkdWxlSm9iIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsImRhaWx5UG9zdHNBdHRhY2htZW50cyIsInN0ZWVkb3Nfc3RhdGlzdGljcyIsInNwYWNlX25hbWUiLCJvd25lcl9uYW1lIiwic3RlZWRvcyIsIndvcmtmbG93IiwiZmxvd3MiLCJmb3JtcyIsImZsb3dfcm9sZXMiLCJmbG93X3Bvc2l0aW9ucyIsImluc3RhbmNlcyIsImluc3RhbmNlc19sYXN0X21vZGlmaWVkIiwiZGFpbHlfZmxvd3MiLCJkYWlseV9mb3JtcyIsImRhaWx5X2luc3RhbmNlcyIsImNtcyIsInNpdGVzIiwiY21zX3NpdGVzIiwiY21zX3Bvc3RzIiwicG9zdHNfbGFzdF9tb2RpZmllZCIsInBvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJjb21tZW50cyIsImNtc19jb21tZW50cyIsImRhaWx5X3NpdGVzIiwiZGFpbHlfcG9zdHMiLCJkYWlseV9jb21tZW50cyIsImRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemUiLCJNaWdyYXRpb25zIiwidmVyc2lvbiIsInVwIiwidXBkYXRlX2Nmc19pbnN0YW5jZSIsInBhcmVudF9pZCIsImluc3RhbmNlX2lkIiwiYXR0YWNoX3ZlcnNpb24iLCJpc0N1cnJlbnQiLCJtZXRhZGF0YSIsInBhcmVudCIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJhdHRhY2htZW50cyIsImlucyIsImF0dGFjaHMiLCJjdXJyZW50X3ZlciIsIl9yZXYiLCJoaXN0b3J5cyIsImhpcyIsImRvd24iLCJvcmdhbml6YXRpb24iLCJjaGVja19jb3VudCIsIm5ld19vcmdfaWRzIiwicmVtb3ZlZF9vcmdfaWRzIiwicm9vdF9vcmciLCJ1cGRhdGVVc2VycyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwicm9vdFVSTCIsImNyZWF0b3IiLCJwcm9jZXNzIiwiZW52IiwiQ1JFQVRPUl9OT0RFX0VOViIsImRlZmluZVByb3BlcnR5IiwiZGVwdGgiLCJyZWR1Y2UiLCJmbGF0IiwidG9GbGF0dGVuIiwiaXNBcnJheSIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsInNlYXJjaGluZyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwiJGFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQkksU0FBTyxFQUFFLFFBRk87QUFHaEIsWUFBVSxTQUhNO0FBSWhCQyxRQUFNLEVBQUUsUUFKUTtBQUtoQixnQ0FBOEI7QUFMZCxDQUFELEVBTWIsY0FOYSxDQUFoQjs7QUFRQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsT0FBdkMsRUFBZ0Q7QUFDL0NSLGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGNBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7OztBQ2ZEUyxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLFVBQWhCLEdBQTZCLFVBQVVDLE1BQVYsRUFBa0I7QUFDM0MsTUFBSSxDQUFDLElBQUwsRUFBVztBQUNQO0FBQ0g7O0FBQ0QsTUFBRyxDQUFDQSxNQUFKLEVBQVc7QUFDUEEsVUFBTSxHQUFHQyxPQUFPLENBQUNELE1BQVIsRUFBVDtBQUNIOztBQUNELE9BQUtFLElBQUwsQ0FBVSxVQUFVQyxFQUFWLEVBQWNDLEVBQWQsRUFBa0I7QUFDOUIsUUFBSUMsVUFBVSxHQUFHRixFQUFFLENBQUNHLE9BQUgsSUFBYyxDQUEvQjtBQUNBLFFBQUlDLFVBQVUsR0FBR0gsRUFBRSxDQUFDRSxPQUFILElBQWMsQ0FBL0I7O0FBQ0EsUUFBR0QsVUFBVSxJQUFJRSxVQUFqQixFQUE0QjtBQUNsQixhQUFPRixVQUFVLEdBQUdFLFVBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixDQUF0QztBQUNILEtBRlAsTUFFVztBQUNWLGFBQU9KLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRQyxhQUFSLENBQXNCTCxFQUFFLENBQUNJLElBQXpCLEVBQStCUixNQUEvQixDQUFQO0FBQ0E7QUFDRSxHQVJEO0FBU0gsQ0FoQkQ7O0FBbUJBSCxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JZLFdBQWhCLEdBQThCLFVBQVVDLENBQVYsRUFBYTtBQUN2QyxNQUFJcEIsQ0FBQyxHQUFHLElBQUlNLEtBQUosRUFBUjtBQUNBLE9BQUtlLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ0YsQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQXBCLEtBQUMsQ0FBQ3dCLElBQUYsQ0FBT0QsQ0FBUDtBQUNILEdBSEQ7QUFJQSxTQUFPdkIsQ0FBUDtBQUNILENBUEQ7QUFTQTs7Ozs7QUFHQU0sS0FBSyxDQUFDQyxTQUFOLENBQWdCa0IsTUFBaEIsR0FBeUIsVUFBVUMsSUFBVixFQUFnQkMsRUFBaEIsRUFBb0I7QUFDekMsTUFBSUQsSUFBSSxHQUFHLENBQVgsRUFBYztBQUNWO0FBQ0g7O0FBQ0QsTUFBSUUsSUFBSSxHQUFHLEtBQUtDLEtBQUwsQ0FBVyxDQUFDRixFQUFFLElBQUlELElBQVAsSUFBZSxDQUFmLElBQW9CLEtBQUtJLE1BQXBDLENBQVg7QUFDQSxPQUFLQSxNQUFMLEdBQWNKLElBQUksR0FBRyxDQUFQLEdBQVcsS0FBS0ksTUFBTCxHQUFjSixJQUF6QixHQUFnQ0EsSUFBOUM7QUFDQSxTQUFPLEtBQUtGLElBQUwsQ0FBVU8sS0FBVixDQUFnQixJQUFoQixFQUFzQkgsSUFBdEIsQ0FBUDtBQUNILENBUEQ7QUFTQTs7Ozs7O0FBSUF0QixLQUFLLENBQUNDLFNBQU4sQ0FBZ0J5QixjQUFoQixHQUFpQyxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDN0MsTUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQSxPQUFLZCxPQUFMLENBQWEsVUFBVUMsQ0FBVixFQUFhO0FBQ3RCLFFBQUlDLENBQUMsR0FBR0QsQ0FBQyxHQUFHQSxDQUFDLENBQUNXLENBQUQsQ0FBSixHQUFVLElBQW5CO0FBQ0EsUUFBSUcsQ0FBQyxHQUFHLEtBQVI7O0FBQ0EsUUFBSWIsQ0FBQyxZQUFZakIsS0FBakIsRUFBd0I7QUFDcEI4QixPQUFDLEdBQUdiLENBQUMsQ0FBQ2MsUUFBRixDQUFXSCxDQUFYLENBQUo7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFJWCxDQUFDLFlBQVllLE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUksUUFBUWYsQ0FBWixFQUFlO0FBQ1hBLFdBQUMsR0FBR0EsQ0FBQyxDQUFDLElBQUQsQ0FBTDtBQUNILFNBRkQsTUFFTyxJQUFJLFNBQVNBLENBQWIsRUFBZ0I7QUFDbkJBLFdBQUMsR0FBR0EsQ0FBQyxDQUFDLEtBQUQsQ0FBTDtBQUNIO0FBRUo7O0FBQ0QsVUFBSVcsQ0FBQyxZQUFZNUIsS0FBakIsRUFBd0I7QUFDcEI4QixTQUFDLEdBQUlGLENBQUMsS0FBS0ssU0FBUCxHQUFvQixLQUFwQixHQUE0QkwsQ0FBQyxDQUFDRyxRQUFGLENBQVdkLENBQVgsQ0FBaEM7QUFDSCxPQUZELE1BRU87QUFDSGEsU0FBQyxHQUFJRixDQUFDLEtBQUtLLFNBQVAsR0FBb0IsS0FBcEIsR0FBNEJoQixDQUFDLElBQUlXLENBQXJDO0FBQ0g7QUFDSjs7QUFFRCxRQUFJRSxDQUFKLEVBQU87QUFDSEQsT0FBQyxDQUFDWCxJQUFGLENBQU9GLENBQVA7QUFDSDtBQUNKLEdBeEJEO0FBeUJBLFNBQU9hLENBQVA7QUFDSCxDQTVCRDtBQThCQTs7Ozs7O0FBSUE3QixLQUFLLENBQUNDLFNBQU4sQ0FBZ0JpQyxnQkFBaEIsR0FBbUMsVUFBVVAsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0FBQy9DLE1BQUlPLENBQUMsR0FBRyxJQUFSO0FBQ0EsT0FBS3BCLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ1csQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQSxRQUFJRyxDQUFDLEdBQUcsS0FBUjs7QUFDQSxRQUFJYixDQUFDLFlBQVlqQixLQUFqQixFQUF3QjtBQUNwQjhCLE9BQUMsR0FBR2IsQ0FBQyxDQUFDYyxRQUFGLENBQVdILENBQVgsQ0FBSjtBQUNILEtBRkQsTUFFTztBQUNIRSxPQUFDLEdBQUlGLENBQUMsS0FBS0ssU0FBUCxHQUFvQixLQUFwQixHQUE0QmhCLENBQUMsSUFBSVcsQ0FBckM7QUFDSDs7QUFFRCxRQUFJRSxDQUFKLEVBQU87QUFDSEssT0FBQyxHQUFHbkIsQ0FBSjtBQUNIO0FBQ0osR0FaRDtBQWFBLFNBQU9tQixDQUFQO0FBQ0gsQ0FoQkQsQzs7Ozs7Ozs7Ozs7O0FDOUVBLElBQUFDLE9BQUEsRUFBQUMsTUFBQSxFQUFBQyxLQUFBO0FBQUFsQyxVQUNDO0FBQUFOLFlBQVUsRUFBVjtBQUNBeUMsTUFBSUEsRUFESjtBQUVBQyxRQUFNLEVBRk47QUFHQUMsa0JBQWdCO0FBQ2YsUUFBQUMsR0FBQSxFQUFBQyxJQUFBO0FBQUEsV0FBTyxDQUFDLEdBQUFELE1BQUE3QyxPQUFBQyxRQUFBLGFBQUE2QyxPQUFBRCxJQUFBLHFCQUFBQyxLQUEwQkMsS0FBMUIsR0FBMEIsTUFBMUIsR0FBMEIsTUFBMUIsQ0FBUjtBQUpEO0FBS0FDLGtCQUFnQixVQUFDQyxNQUFELEVBQVNDLEtBQVQsRUFBZ0JDLFlBQWhCO0FBQ2YsUUFBQU4sR0FBQSxFQUFBQyxJQUFBLEVBQUFNLEdBQUE7O0FBQUEsUUFBRyxPQUFPSCxNQUFQLEtBQWlCLFFBQXBCO0FBQ0NBLGVBQVNBLE9BQU9JLFFBQVAsRUFBVDtBQ01FOztBREpILFFBQUcsQ0FBQ0osTUFBSjtBQUNDLGFBQU8sRUFBUDtBQ01FOztBREpILFFBQUdBLFdBQVUsS0FBYjtBQUNDLFVBQUdDLFNBQVNBLFVBQVMsQ0FBckI7QUFDQ0QsaUJBQVNLLE9BQU9MLE1BQVAsRUFBZU0sT0FBZixDQUF1QkwsS0FBdkIsQ0FBVDtBQ01HOztBRExKLFdBQU9DLFlBQVA7QUFDQyxZQUFHLEVBQUVELFNBQVNBLFVBQVMsQ0FBcEIsQ0FBSDtBQUVDQSxrQkFBQSxDQUFBTCxNQUFBSSxPQUFBTyxLQUFBLHdCQUFBVixPQUFBRCxJQUFBLGNBQUFDLEtBQXFDbkIsTUFBckMsR0FBcUMsTUFBckMsR0FBcUMsTUFBckM7O0FBQ0EsZUFBT3VCLEtBQVA7QUFDQ0Esb0JBQVEsQ0FBUjtBQUpGO0FDV0s7O0FETkxFLGNBQU0scUJBQU47O0FBQ0EsWUFBR0YsVUFBUyxDQUFaO0FBQ0NFLGdCQUFNLHFCQUFOO0FDUUk7O0FEUExILGlCQUFTQSxPQUFPUSxPQUFQLENBQWVMLEdBQWYsRUFBb0IsS0FBcEIsQ0FBVDtBQ1NHOztBRFJKLGFBQU9ILE1BQVA7QUFiRDtBQWVDLGFBQU8sRUFBUDtBQ1VFO0FEckNKO0FBNEJBUyxxQkFBbUIsVUFBQ0MsR0FBRDtBQUVsQixRQUFBUCxHQUFBO0FBQUFBLFVBQU0sSUFBSVEsTUFBSixDQUFXLDJDQUFYLENBQU47QUFDQSxXQUFPUixJQUFJUyxJQUFKLENBQVNGLEdBQVQsQ0FBUDtBQS9CRDtBQUFBLENBREQsQyxDQWtDQTs7Ozs7QUFLQXBELFFBQVF1RCxVQUFSLEdBQXFCLFVBQUN4RCxNQUFEO0FBQ3BCLE1BQUF5RCxPQUFBO0FBQUFBLFlBQVV6RCxPQUFPMEQsU0FBUCxDQUFpQixDQUFqQixDQUFWO0FBQ0EsU0FBTyw0QkFBNEJELE9BQTVCLEdBQXNDLFFBQTdDO0FBRm9CLENBQXJCOztBQUlBLElBQUcvRCxPQUFPaUUsUUFBVjtBQUVDMUQsVUFBUTJELGtCQUFSLEdBQTZCO0FDZ0IxQixXRGZGQyxLQUFLO0FBQUNDLGFBQU9DLFFBQVFDLEVBQVIsQ0FBVyx1QkFBWCxDQUFSO0FBQTZDQyxZQUFNRixRQUFRQyxFQUFSLENBQVcsc0JBQVgsQ0FBbkQ7QUFBdUZFLFlBQU0sSUFBN0Y7QUFBbUdDLFlBQUssU0FBeEc7QUFBbUhDLHlCQUFtQkwsUUFBUUMsRUFBUixDQUFXLElBQVg7QUFBdEksS0FBTCxDQ2VFO0FEaEIwQixHQUE3Qjs7QUFHQS9ELFVBQVFvRSxxQkFBUixHQUFnQztBQUMvQixRQUFBQyxhQUFBO0FBQUFBLG9CQUFnQmxDLEdBQUdtQyxpQkFBSCxDQUFxQkMsT0FBckIsQ0FBNkI7QUFBQ0MsWUFBS3hFLFFBQVF5RSxNQUFSLEVBQU47QUFBdUJDLFdBQUk7QUFBM0IsS0FBN0IsQ0FBaEI7O0FBQ0EsUUFBR0wsYUFBSDtBQUNDLGFBQU9BLGNBQWNNLEtBQXJCO0FBREQ7QUFHQyxhQUFPLEVBQVA7QUMwQkU7QUQvQjRCLEdBQWhDOztBQU9BM0UsVUFBUTRFLHVCQUFSLEdBQWtDLFVBQUNDLGtCQUFELEVBQW9CQyxhQUFwQjtBQUNqQyxRQUFBQyxNQUFBLEVBQUFDLEdBQUE7O0FBQUEsUUFBR3ZGLE9BQU93RixTQUFQLE1BQXNCLENBQUNqRixRQUFReUUsTUFBUixFQUExQjtBQUVDSSwyQkFBcUIsRUFBckI7QUFDQUEseUJBQW1CRyxHQUFuQixHQUF5QkUsYUFBYUMsT0FBYixDQUFxQix3QkFBckIsQ0FBekI7QUFDQU4seUJBQW1CRSxNQUFuQixHQUE0QkcsYUFBYUMsT0FBYixDQUFxQiwyQkFBckIsQ0FBNUI7QUMyQkU7O0FEekJISCxVQUFNSCxtQkFBbUJHLEdBQXpCO0FBQ0FELGFBQVNGLG1CQUFtQkUsTUFBNUI7O0FBZUEsUUFBR0QsYUFBSDtBQUNDLFVBQUdyRixPQUFPd0YsU0FBUCxFQUFIO0FBRUM7QUNZRzs7QURUSixVQUFHakYsUUFBUXlFLE1BQVIsRUFBSDtBQUNDLFlBQUdPLEdBQUg7QUFDQ0UsdUJBQWFFLE9BQWIsQ0FBcUIsd0JBQXJCLEVBQThDSixHQUE5QztBQ1dLLGlCRFZMRSxhQUFhRSxPQUFiLENBQXFCLDJCQUFyQixFQUFpREwsTUFBakQsQ0NVSztBRFpOO0FBSUNHLHVCQUFhRyxVQUFiLENBQXdCLHdCQUF4QjtBQ1dLLGlCRFZMSCxhQUFhRyxVQUFiLENBQXdCLDJCQUF4QixDQ1VLO0FEaEJQO0FBTkQ7QUN5Qkc7QURoRDhCLEdBQWxDOztBQXFDQXJGLFVBQVFzRixtQkFBUixHQUE4QjtBQUM3QixRQUFBQyxXQUFBO0FBQUFBLGtCQUFjcEQsR0FBR21DLGlCQUFILENBQXFCQyxPQUFyQixDQUE2QjtBQUFDQyxZQUFLeEUsUUFBUXlFLE1BQVIsRUFBTjtBQUF1QkMsV0FBSTtBQUEzQixLQUE3QixDQUFkOztBQUNBLFFBQUdhLFdBQUg7QUFDQyxhQUFPQSxZQUFZWixLQUFuQjtBQUREO0FBR0MsYUFBTyxFQUFQO0FDa0JFO0FEdkIwQixHQUE5Qjs7QUFPQTNFLFVBQVF3RixtQkFBUixHQUE4QjtBQUM3QixRQUFBQyxXQUFBO0FBQUFBLGtCQUFjdEQsR0FBR21DLGlCQUFILENBQXFCQyxPQUFyQixDQUE2QjtBQUFDQyxZQUFLeEUsUUFBUXlFLE1BQVIsRUFBTjtBQUF1QkMsV0FBSTtBQUEzQixLQUE3QixDQUFkOztBQUNBLFFBQUdlLFdBQUg7QUFDQyxhQUFPQSxZQUFZZCxLQUFuQjtBQUREO0FBR0MsYUFBTyxFQUFQO0FDdUJFO0FENUIwQixHQUE5Qjs7QUFPQTNFLFVBQVEwRixxQkFBUixHQUFnQyxVQUFDQyxnQkFBRCxFQUFrQmIsYUFBbEI7QUFDL0IsUUFBQWMsUUFBQSxFQUFBQyxRQUFBOztBQUFBLFFBQUdwRyxPQUFPd0YsU0FBUCxNQUFzQixDQUFDakYsUUFBUXlFLE1BQVIsRUFBMUI7QUFFQ2tCLHlCQUFtQixFQUFuQjtBQUNBQSx1QkFBaUJwRixJQUFqQixHQUF3QjJFLGFBQWFDLE9BQWIsQ0FBcUIsdUJBQXJCLENBQXhCO0FBQ0FRLHVCQUFpQkcsSUFBakIsR0FBd0JaLGFBQWFDLE9BQWIsQ0FBcUIsdUJBQXJCLENBQXhCO0FDd0JFOztBRHZCSFksTUFBRSxNQUFGLEVBQVVDLFdBQVYsQ0FBc0IsYUFBdEIsRUFBcUNBLFdBQXJDLENBQWlELFlBQWpELEVBQStEQSxXQUEvRCxDQUEyRSxrQkFBM0U7QUFDQUosZUFBV0QsaUJBQWlCcEYsSUFBNUI7QUFDQXNGLGVBQVdGLGlCQUFpQkcsSUFBNUI7O0FBQ0EsU0FBT0YsUUFBUDtBQUNDQSxpQkFBVyxPQUFYO0FBQ0FDLGlCQUFXLEdBQVg7QUN5QkU7O0FEeEJILFFBQUdELFlBQVksQ0FBQ0ssUUFBUUMsR0FBUixDQUFZLGVBQVosQ0FBaEI7QUFDQ0gsUUFBRSxNQUFGLEVBQVVJLFFBQVYsQ0FBbUIsVUFBUVAsUUFBM0I7QUMwQkU7O0FEbEJILFFBQUdkLGFBQUg7QUFDQyxVQUFHckYsT0FBT3dGLFNBQVAsRUFBSDtBQUVDO0FDbUJHOztBRGhCSixVQUFHakYsUUFBUXlFLE1BQVIsRUFBSDtBQUNDLFlBQUdrQixpQkFBaUJwRixJQUFwQjtBQUNDMkUsdUJBQWFFLE9BQWIsQ0FBcUIsdUJBQXJCLEVBQTZDTyxpQkFBaUJwRixJQUE5RDtBQ2tCSyxpQkRqQkwyRSxhQUFhRSxPQUFiLENBQXFCLHVCQUFyQixFQUE2Q08saUJBQWlCRyxJQUE5RCxDQ2lCSztBRG5CTjtBQUlDWix1QkFBYUcsVUFBYixDQUF3Qix1QkFBeEI7QUNrQkssaUJEakJMSCxhQUFhRyxVQUFiLENBQXdCLHVCQUF4QixDQ2lCSztBRHZCUDtBQU5EO0FDZ0NHO0FEckQ0QixHQUFoQzs7QUFtQ0FyRixVQUFRb0csUUFBUixHQUFtQixVQUFDcEIsR0FBRDtBQUNsQixRQUFBeEIsT0FBQSxFQUFBekQsTUFBQTtBQUFBQSxhQUFTQyxRQUFRcUcsU0FBUixFQUFUO0FBQ0E3QyxjQUFVekQsT0FBTzBELFNBQVAsQ0FBaUIsQ0FBakIsQ0FBVjtBQUVBdUIsVUFBTUEsT0FBTyw0QkFBNEJ4QixPQUE1QixHQUFzQyxRQUFuRDtBQ3FCRSxXRG5CRjhDLE9BQU9DLElBQVAsQ0FBWXZCLEdBQVosRUFBaUIsT0FBakIsRUFBMEIseUJBQTFCLENDbUJFO0FEekJnQixHQUFuQjs7QUFRQWhGLFVBQVF3RyxlQUFSLEdBQTBCLFVBQUN4QixHQUFEO0FBQ3pCLFFBQUF5QixTQUFBLEVBQUFDLE1BQUE7QUFBQUQsZ0JBQVksRUFBWjtBQUNBQSxjQUFVLFNBQVYsSUFBdUJ6RyxRQUFRMkcsVUFBUixFQUF2QjtBQUNBRixjQUFVLFdBQVYsSUFBeUJoSCxPQUFPZ0YsTUFBUCxFQUF6QjtBQUNBZ0MsY0FBVSxjQUFWLElBQTRCRyxTQUFTQyxpQkFBVCxFQUE1QjtBQUVBSCxhQUFTLEdBQVQ7O0FBRUEsUUFBRzFCLElBQUk4QixPQUFKLENBQVksR0FBWixJQUFtQixDQUFDLENBQXZCO0FBQ0NKLGVBQVMsR0FBVDtBQ21CRTs7QURqQkgsV0FBTzFCLE1BQU0wQixNQUFOLEdBQWVYLEVBQUVnQixLQUFGLENBQVFOLFNBQVIsQ0FBdEI7QUFYeUIsR0FBMUI7O0FBYUF6RyxVQUFRZ0gsa0JBQVIsR0FBNkIsVUFBQ0MsTUFBRDtBQUM1QixRQUFBUixTQUFBO0FBQUFBLGdCQUFZLEVBQVo7QUFDQUEsY0FBVSxTQUFWLElBQXVCekcsUUFBUTJHLFVBQVIsRUFBdkI7QUFDQUYsY0FBVSxXQUFWLElBQXlCaEgsT0FBT2dGLE1BQVAsRUFBekI7QUFDQWdDLGNBQVUsY0FBVixJQUE0QkcsU0FBU0MsaUJBQVQsRUFBNUI7QUFDQSxXQUFPLG1CQUFtQkksTUFBbkIsR0FBNEIsR0FBNUIsR0FBa0NsQixFQUFFZ0IsS0FBRixDQUFRTixTQUFSLENBQXpDO0FBTDRCLEdBQTdCOztBQU9BekcsVUFBUWtILGdCQUFSLEdBQTJCLFVBQUNELE1BQUQ7QUFDMUIsUUFBQUUsR0FBQSxFQUFBbkMsR0FBQTtBQUFBQSxVQUFNaEYsUUFBUWdILGtCQUFSLENBQTJCQyxNQUEzQixDQUFOO0FBQ0FqQyxVQUFNaEYsUUFBUW9ILFdBQVIsQ0FBb0JwQyxHQUFwQixDQUFOO0FBRUFtQyxVQUFNaEYsR0FBR2tGLElBQUgsQ0FBUTlDLE9BQVIsQ0FBZ0IwQyxNQUFoQixDQUFOOztBQUVBLFFBQUcsQ0FBQ0UsSUFBSUcsYUFBTCxJQUFzQixDQUFDdEgsUUFBUXVILFFBQVIsRUFBdkIsSUFBNkMsQ0FBQ3ZILFFBQVF3SCxTQUFSLEVBQWpEO0FDbUJJLGFEbEJIbEIsT0FBT21CLFFBQVAsR0FBa0J6QyxHQ2tCZjtBRG5CSjtBQ3FCSSxhRGxCSGhGLFFBQVEwSCxVQUFSLENBQW1CMUMsR0FBbkIsQ0NrQkc7QUFDRDtBRDVCdUIsR0FBM0I7O0FBV0FoRixVQUFRMkgsYUFBUixHQUF3QixVQUFDM0MsR0FBRDtBQUN2QixRQUFBNEMsR0FBQSxFQUFBQyxJQUFBLEVBQUFDLFFBQUE7O0FBQUEsUUFBRzlDLEdBQUg7QUFDQyxVQUFHaEYsUUFBUStILE1BQVIsRUFBSDtBQUNDRixlQUFPRyxHQUFHQyxPQUFILENBQVcsZUFBWCxFQUE0QkosSUFBbkM7QUFDQUMsbUJBQVc5QyxHQUFYO0FBQ0E0QyxjQUFNLDBCQUF3QkUsUUFBeEIsR0FBaUMsSUFBdkM7QUNxQkksZURwQkpELEtBQUtELEdBQUwsRUFBVSxVQUFDTSxLQUFELEVBQVFDLE1BQVIsRUFBZ0JDLE1BQWhCO0FBQ1QsY0FBR0YsS0FBSDtBQUNDRyxtQkFBT0gsS0FBUCxDQUFhQSxLQUFiO0FDcUJLO0FEdkJQLFVDb0JJO0FEeEJMO0FDOEJLLGVEckJKbEksUUFBUTBILFVBQVIsQ0FBbUIxQyxHQUFuQixDQ3FCSTtBRC9CTjtBQ2lDRztBRGxDb0IsR0FBeEI7O0FBY0FoRixVQUFRc0ksT0FBUixHQUFrQixVQUFDckIsTUFBRDtBQUNqQixRQUFBRSxHQUFBLEVBQUFTLEdBQUEsRUFBQVcsQ0FBQSxFQUFBQyxhQUFBLEVBQUFYLElBQUEsRUFBQVksUUFBQSxFQUFBWCxRQUFBLEVBQUFZLElBQUE7O0FBQUEsUUFBRyxDQUFDakosT0FBT2dGLE1BQVAsRUFBSjtBQUNDekUsY0FBUTJJLGdCQUFSO0FBQ0EsYUFBTyxJQUFQO0FDd0JFOztBRHRCSHhCLFVBQU1oRixHQUFHa0YsSUFBSCxDQUFROUMsT0FBUixDQUFnQjBDLE1BQWhCLENBQU47O0FBQ0EsUUFBRyxDQUFDRSxHQUFKO0FBQ0N5QixpQkFBV0MsRUFBWCxDQUFjLEdBQWQ7QUFDQTtBQ3dCRTs7QURaSEosZUFBV3RCLElBQUlzQixRQUFmOztBQUNBLFFBQUd0QixJQUFJMkIsU0FBUDtBQUNDLFVBQUc5SSxRQUFRK0gsTUFBUixFQUFIO0FBQ0NGLGVBQU9HLEdBQUdDLE9BQUgsQ0FBVyxlQUFYLEVBQTRCSixJQUFuQzs7QUFDQSxZQUFHWSxRQUFIO0FBQ0NDLGlCQUFPLGlCQUFlekIsTUFBZixHQUFzQixhQUF0QixHQUFtQ0wsU0FBU0MsaUJBQVQsRUFBbkMsR0FBZ0UsVUFBaEUsR0FBMEVwSCxPQUFPZ0YsTUFBUCxFQUFqRjtBQUNBcUQscUJBQVd4QixPQUFPbUIsUUFBUCxDQUFnQnNCLE1BQWhCLEdBQXlCLEdBQXpCLEdBQStCTCxJQUExQztBQUZEO0FBSUNaLHFCQUFXOUgsUUFBUWdILGtCQUFSLENBQTJCQyxNQUEzQixDQUFYO0FBQ0FhLHFCQUFXeEIsT0FBT21CLFFBQVAsQ0FBZ0JzQixNQUFoQixHQUF5QixHQUF6QixHQUErQmpCLFFBQTFDO0FDY0k7O0FEYkxGLGNBQU0sMEJBQXdCRSxRQUF4QixHQUFpQyxJQUF2QztBQUNBRCxhQUFLRCxHQUFMLEVBQVUsVUFBQ00sS0FBRCxFQUFRQyxNQUFSLEVBQWdCQyxNQUFoQjtBQUNULGNBQUdGLEtBQUg7QUFDQ0csbUJBQU9ILEtBQVAsQ0FBYUEsS0FBYjtBQ2VLO0FEakJQO0FBVEQ7QUFjQ2xJLGdCQUFRa0gsZ0JBQVIsQ0FBeUJELE1BQXpCO0FBZkY7QUFBQSxXQWlCSyxJQUFHOUUsR0FBR2tGLElBQUgsQ0FBUTJCLGFBQVIsQ0FBc0I3QixJQUFJbkMsR0FBMUIsQ0FBSDtBQUNKNEQsaUJBQVdDLEVBQVgsQ0FBYzFCLElBQUluQyxHQUFsQjtBQURJLFdBR0EsSUFBR21DLElBQUk4QixhQUFQO0FBQ0osVUFBRzlCLElBQUlHLGFBQUosSUFBcUIsQ0FBQ3RILFFBQVF1SCxRQUFSLEVBQXRCLElBQTRDLENBQUN2SCxRQUFRd0gsU0FBUixFQUFoRDtBQUNDeEgsZ0JBQVEwSCxVQUFSLENBQW1CMUgsUUFBUW9ILFdBQVIsQ0FBb0IsaUJBQWlCRCxJQUFJK0IsR0FBekMsQ0FBbkI7QUFERCxhQUVLLElBQUdsSixRQUFRdUgsUUFBUixNQUFzQnZILFFBQVF3SCxTQUFSLEVBQXpCO0FBQ0p4SCxnQkFBUWtILGdCQUFSLENBQXlCRCxNQUF6QjtBQURJO0FBR0oyQixtQkFBV0MsRUFBWCxDQUFjLGtCQUFnQjFCLElBQUkrQixHQUFsQztBQU5HO0FBQUEsV0FRQSxJQUFHVCxRQUFIO0FBRUpELHNCQUFnQixpQkFBZUMsUUFBZixHQUF3QixNQUF4Qzs7QUFDQTtBQUNDVSxhQUFLWCxhQUFMO0FBREQsZUFBQVksTUFBQTtBQUVNYixZQUFBYSxNQUFBO0FBRUxDLGdCQUFRbkIsS0FBUixDQUFjLDhEQUFkO0FBQ0FtQixnQkFBUW5CLEtBQVIsQ0FBaUJLLEVBQUVlLE9BQUYsR0FBVSxNQUFWLEdBQWdCZixFQUFFZ0IsS0FBbkM7QUFSRztBQUFBO0FBVUp2SixjQUFRa0gsZ0JBQVIsQ0FBeUJELE1BQXpCO0FDZUU7O0FEYkgsUUFBRyxDQUFDRSxJQUFJRyxhQUFMLElBQXNCLENBQUN0SCxRQUFRdUgsUUFBUixFQUF2QixJQUE2QyxDQUFDdkgsUUFBUXdILFNBQVIsRUFBOUMsSUFBcUUsQ0FBQ0wsSUFBSTJCLFNBQTFFLElBQXVGLENBQUNMLFFBQTNGO0FDZUksYURiSHhDLFFBQVF1RCxHQUFSLENBQVksZ0JBQVosRUFBOEJ2QyxNQUE5QixDQ2FHO0FBQ0Q7QUQ3RWMsR0FBbEI7O0FBaUVBakgsVUFBUXlKLGlCQUFSLEdBQTRCLFVBQUNDLE9BQUQ7QUFDM0IsUUFBQUMsUUFBQSxFQUFBQyxVQUFBLEVBQUFDLEtBQUE7O0FBQUEsU0FBT0gsT0FBUDtBQUNDQSxnQkFBVTFKLFFBQVEwSixPQUFSLEVBQVY7QUNnQkU7O0FEZkhFLGlCQUFhLENBQWI7O0FBQ0EsUUFBRzVKLFFBQVE4SixZQUFSLEVBQUg7QUFDQ0YsbUJBQWEsQ0FBYjtBQ2lCRTs7QURoQkhDLFlBQVExSCxHQUFHNEgsTUFBSCxDQUFVeEYsT0FBVixDQUFrQm1GLE9BQWxCLENBQVI7QUFDQUMsZUFBQUUsU0FBQSxPQUFXQSxNQUFPRixRQUFsQixHQUFrQixNQUFsQjs7QUFDQSxRQUFHRSxTQUFTN0osUUFBUWdLLFVBQVIsQ0FBbUIsTUFBbkIsRUFBMkJILE1BQU1YLEdBQWpDLENBQVQsSUFBbURTLGFBQVksTUFBL0QsSUFBOEVBLFdBQVcsSUFBSU0sSUFBSixFQUFaLElBQTBCTCxhQUFXLEVBQVgsR0FBYyxFQUFkLEdBQWlCLElBQWpCLEdBQXNCLElBQWhJO0FDa0JJLGFEaEJIdkIsT0FBT0gsS0FBUCxDQUFhdEgsRUFBRSw0QkFBRixDQUFiLENDZ0JHO0FBQ0Q7QUQzQndCLEdBQTVCOztBQVlBWixVQUFRa0ssaUJBQVIsR0FBNEI7QUFDM0IsUUFBQXZFLGdCQUFBLEVBQUF3RSxNQUFBO0FBQUF4RSx1QkFBbUIzRixRQUFRd0YsbUJBQVIsRUFBbkI7O0FBQ0EsU0FBT0csaUJBQWlCcEYsSUFBeEI7QUFDQ29GLHVCQUFpQnBGLElBQWpCLEdBQXdCLE9BQXhCO0FDbUJFOztBRGxCSCxZQUFPb0YsaUJBQWlCcEYsSUFBeEI7QUFBQSxXQUNNLFFBRE47QUFFRSxZQUFHUCxRQUFRdUgsUUFBUixFQUFIO0FBQ0M0QyxtQkFBUyxDQUFDLEVBQVY7QUFERDtBQUdDQSxtQkFBUyxFQUFUO0FDb0JJOztBRHhCRDs7QUFETixXQU1NLE9BTk47QUFPRSxZQUFHbkssUUFBUXVILFFBQVIsRUFBSDtBQUNDNEMsbUJBQVMsQ0FBQyxDQUFWO0FBREQ7QUFJQyxjQUFHbkssUUFBUW9LLFFBQVIsRUFBSDtBQUNDRCxxQkFBUyxHQUFUO0FBREQ7QUFHQ0EscUJBQVMsQ0FBVDtBQVBGO0FDNkJLOztBRDlCRDs7QUFOTixXQWVNLGFBZk47QUFnQkUsWUFBR25LLFFBQVF1SCxRQUFSLEVBQUg7QUFDQzRDLG1CQUFTLENBQUMsRUFBVjtBQUREO0FBSUMsY0FBR25LLFFBQVFvSyxRQUFSLEVBQUg7QUFDQ0QscUJBQVMsR0FBVDtBQUREO0FBR0NBLHFCQUFTLEVBQVQ7QUFQRjtBQytCSzs7QUQvQ1A7O0FBeUJBLFFBQUdwRSxFQUFFLFFBQUYsRUFBWTNFLE1BQWY7QUN5QkksYUR4QkgyRSxFQUFFLFFBQUYsRUFBWXNFLElBQVosQ0FBaUI7QUFDaEIsWUFBQUMsWUFBQSxFQUFBQyxZQUFBLEVBQUFDLE1BQUEsRUFBQUMsV0FBQTtBQUFBRix1QkFBZSxDQUFmO0FBQ0FELHVCQUFlLENBQWY7QUFDQUcsc0JBQWMsQ0FBZDtBQUNBMUUsVUFBRSxlQUFGLEVBQW1CQSxFQUFFLElBQUYsQ0FBbkIsRUFBNEJzRSxJQUE1QixDQUFpQztBQzBCM0IsaUJEekJMRSxnQkFBZ0J4RSxFQUFFLElBQUYsRUFBUTJFLFdBQVIsQ0FBb0IsS0FBcEIsQ0N5Qlg7QUQxQk47QUFFQTNFLFVBQUUsZUFBRixFQUFtQkEsRUFBRSxJQUFGLENBQW5CLEVBQTRCc0UsSUFBNUIsQ0FBaUM7QUMyQjNCLGlCRDFCTEMsZ0JBQWdCdkUsRUFBRSxJQUFGLEVBQVEyRSxXQUFSLENBQW9CLEtBQXBCLENDMEJYO0FEM0JOO0FBR0FELHNCQUFjRixlQUFlRCxZQUE3QjtBQUNBRSxpQkFBU3pFLEVBQUUsTUFBRixFQUFVNEUsV0FBVixLQUEwQkYsV0FBMUIsR0FBd0NOLE1BQWpEOztBQUNBLFlBQUdwRSxFQUFFLElBQUYsRUFBUTZFLFFBQVIsQ0FBaUIsa0JBQWpCLENBQUg7QUMyQk0saUJEMUJMN0UsRUFBRSxhQUFGLEVBQWdCQSxFQUFFLElBQUYsQ0FBaEIsRUFBeUI4RSxHQUF6QixDQUE2QjtBQUFDLDBCQUFpQkwsU0FBTyxJQUF6QjtBQUE4QixzQkFBYUEsU0FBTztBQUFsRCxXQUE3QixDQzBCSztBRDNCTjtBQ2dDTSxpQkQ3Qkx6RSxFQUFFLGFBQUYsRUFBZ0JBLEVBQUUsSUFBRixDQUFoQixFQUF5QjhFLEdBQXpCLENBQTZCO0FBQUMsMEJBQWlCTCxTQUFPLElBQXpCO0FBQThCLHNCQUFVO0FBQXhDLFdBQTdCLENDNkJLO0FBSUQ7QUQvQ04sUUN3Qkc7QUF5QkQ7QUQvRXdCLEdBQTVCOztBQThDQXhLLFVBQVE4SyxpQkFBUixHQUE0QixVQUFDWCxNQUFEO0FBQzNCLFFBQUF4RSxnQkFBQSxFQUFBb0YsT0FBQTs7QUFBQSxRQUFHL0ssUUFBUXVILFFBQVIsRUFBSDtBQUNDd0QsZ0JBQVV6RSxPQUFPMEUsTUFBUCxDQUFjUixNQUFkLEdBQXVCLEdBQXZCLEdBQTZCLEdBQTdCLEdBQW1DLEVBQTdDO0FBREQ7QUFHQ08sZ0JBQVVoRixFQUFFTyxNQUFGLEVBQVVrRSxNQUFWLEtBQXFCLEdBQXJCLEdBQTJCLEVBQXJDO0FDcUNFOztBRHBDSCxVQUFPeEssUUFBUWlMLEtBQVIsTUFBbUJqTCxRQUFRdUgsUUFBUixFQUExQjtBQUVDNUIseUJBQW1CM0YsUUFBUXdGLG1CQUFSLEVBQW5COztBQUNBLGNBQU9HLGlCQUFpQnBGLElBQXhCO0FBQUEsYUFDTSxPQUROO0FBR0V3SyxxQkFBVyxFQUFYO0FBRkk7O0FBRE4sYUFJTSxhQUpOO0FBS0VBLHFCQUFXLEdBQVg7QUFMRjtBQzJDRTs7QURyQ0gsUUFBR1osTUFBSDtBQUNDWSxpQkFBV1osTUFBWDtBQ3VDRTs7QUR0Q0gsV0FBT1ksVUFBVSxJQUFqQjtBQWhCMkIsR0FBNUI7O0FBa0JBL0ssVUFBUWlMLEtBQVIsR0FBZ0IsVUFBQ0MsU0FBRCxFQUFZQyxRQUFaO0FBQ2YsUUFBQUMsTUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBO0FBQUFKLGFBQ0M7QUFBQUssZUFBUyxTQUFUO0FBQ0FDLGtCQUFZLFlBRFo7QUFFQUMsZUFBUyxTQUZUO0FBR0FDLFlBQU0sTUFITjtBQUlBQyxjQUFRLFFBSlI7QUFLQUMsWUFBTSxNQUxOO0FBTUFDLGNBQVE7QUFOUixLQUREO0FBUUFWLGNBQVUsRUFBVjtBQUNBQyxhQUFTLHFCQUFUO0FBQ0FFLGFBQVMscUJBQVQ7QUFDQU4sZ0JBQVksQ0FBQ0EsYUFBYWMsVUFBVWQsU0FBeEIsRUFBbUNlLFdBQW5DLEVBQVo7QUFDQWQsZUFBV0EsWUFBWWEsVUFBVWIsUUFBdEIsSUFBa0NhLFVBQVVFLGVBQXZEO0FBQ0FYLGFBQVNMLFVBQVVqSSxLQUFWLENBQWdCLElBQUlJLE1BQUosQ0FBVyx1Q0FBWCxDQUFoQixLQUF3RTZILFVBQVVqSSxLQUFWLENBQWdCLElBQUlJLE1BQUosQ0FBVyxVQUFYLENBQWhCLENBQXhFLElBQW1ILENBQzNILEVBRDJILEVBRTNIK0gsT0FBT08sT0FGb0gsQ0FBNUg7QUFJQU4sWUFBUUUsTUFBUixHQUFpQkEsT0FBTyxDQUFQLENBQWpCO0FBQ0EsV0FBT0YsUUFBUUUsTUFBUixLQUFrQkgsT0FBT1EsSUFBekIsSUFBaUNQLFFBQVFFLE1BQVIsS0FBa0JILE9BQU9TLE1BQTFELElBQW9FUixRQUFRRSxNQUFSLEtBQWtCSCxPQUFPVSxJQUFwRztBQW5CZSxHQUFoQjs7QUFxQkE5TCxVQUFRbU0sb0JBQVIsR0FBK0IsVUFBQ0MsZ0JBQUQ7QUFDOUIsUUFBQUMsYUFBQSxFQUFBQyxPQUFBLEVBQUE1QyxPQUFBLEVBQUE2QyxVQUFBLEVBQUE5SCxNQUFBO0FBQUFBLGFBQVNoRixPQUFPZ0YsTUFBUCxFQUFUO0FBQ0FpRixjQUFVMUosUUFBUTBKLE9BQVIsRUFBVjtBQUNBNkMsaUJBQWFwSyxHQUFHcUssV0FBSCxDQUFlakksT0FBZixDQUF1QjtBQUFDQyxZQUFLQyxNQUFOO0FBQWFvRixhQUFNSDtBQUFuQixLQUF2QixFQUFtRDtBQUFBK0MsY0FBTztBQUFDSix1QkFBYztBQUFmO0FBQVAsS0FBbkQsQ0FBYjtBQUNBQSxvQkFBQUUsY0FBQSxPQUFnQkEsV0FBWUYsYUFBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsU0FBT0EsYUFBUDtBQUNDLGFBQU8sRUFBUDtBQytDRTs7QUQ5Q0gsUUFBR0QsZ0JBQUg7QUFDQ0UsZ0JBQVVJLEVBQUVDLE9BQUYsQ0FBVXhLLEdBQUdrSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFBMUQsYUFBSTtBQUFDMkQsZUFBSVI7QUFBTDtBQUFKLE9BQXRCLEVBQStDUyxLQUEvQyxHQUF1RHJNLFdBQXZELENBQW1FLFNBQW5FLENBQVYsQ0FBVjtBQUNBLGFBQU9pTSxFQUFFSyxLQUFGLENBQVFWLGFBQVIsRUFBc0JDLE9BQXRCLENBQVA7QUFGRDtBQUlDLGFBQU9ELGFBQVA7QUNvREU7QUQvRDJCLEdBQS9COztBQWFBck0sVUFBUWdOLHFCQUFSLEdBQWdDLFVBQUNDLE1BQUQsRUFBU0MsR0FBVDtBQUMvQixTQUFPbE4sUUFBUStILE1BQVIsRUFBUDtBQUNDO0FDcURFOztBRHBESGtGLFdBQU9FLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxnQkFBckIsQ0FBc0MsYUFBdEMsRUFBcUQsVUFBQ0MsRUFBRDtBQUNwREEsU0FBR0MsY0FBSDtBQUNBLGFBQU8sS0FBUDtBQUZEOztBQUdBLFFBQUdMLEdBQUg7QUFDQyxVQUFHLE9BQU9BLEdBQVAsS0FBYyxRQUFqQjtBQUNDQSxjQUFNRCxPQUFPbEgsQ0FBUCxDQUFTbUgsR0FBVCxDQUFOO0FDdURHOztBQUNELGFEdkRIQSxJQUFJTSxJQUFKLENBQVM7QUFDUixZQUFBQyxPQUFBO0FBQUFBLGtCQUFVUCxJQUFJUSxRQUFKLEdBQWVkLElBQWYsQ0FBb0IsTUFBcEIsQ0FBVjs7QUFDQSxZQUFHYSxPQUFIO0FDeURNLGlCRHhETEEsUUFBUSxDQUFSLEVBQVdKLGdCQUFYLENBQTRCLGFBQTVCLEVBQTJDLFVBQUNDLEVBQUQ7QUFDMUNBLGVBQUdDLGNBQUg7QUFDQSxtQkFBTyxLQUFQO0FBRkQsWUN3REs7QUFJRDtBRC9ETixRQ3VERztBQVVEO0FEMUU0QixHQUFoQztBQzRFQTs7QUQ1REQsSUFBRzlOLE9BQU9rTyxRQUFWO0FBQ0MzTixVQUFRbU0sb0JBQVIsR0FBK0IsVUFBQ3pDLE9BQUQsRUFBU2pGLE1BQVQsRUFBZ0IySCxnQkFBaEI7QUFDOUIsUUFBQUMsYUFBQSxFQUFBQyxPQUFBLEVBQUFDLFVBQUE7QUFBQUEsaUJBQWFwSyxHQUFHcUssV0FBSCxDQUFlakksT0FBZixDQUF1QjtBQUFDQyxZQUFLQyxNQUFOO0FBQWFvRixhQUFNSDtBQUFuQixLQUF2QixFQUFtRDtBQUFBK0MsY0FBTztBQUFDSix1QkFBYztBQUFmO0FBQVAsS0FBbkQsQ0FBYjtBQUNBQSxvQkFBQUUsY0FBQSxPQUFnQkEsV0FBWUYsYUFBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsU0FBT0EsYUFBUDtBQUNDLGFBQU8sRUFBUDtBQ3VFRTs7QUR0RUgsUUFBR0QsZ0JBQUg7QUFDQ0UsZ0JBQVVJLEVBQUVDLE9BQUYsQ0FBVXhLLEdBQUdrSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFBMUQsYUFBSTtBQUFDMkQsZUFBSVI7QUFBTDtBQUFKLE9BQXRCLEVBQStDUyxLQUEvQyxHQUF1RHJNLFdBQXZELENBQW1FLFNBQW5FLENBQVYsQ0FBVjtBQUNBLGFBQU9pTSxFQUFFSyxLQUFGLENBQVFWLGFBQVIsRUFBc0JDLE9BQXRCLENBQVA7QUFGRDtBQUlDLGFBQU9ELGFBQVA7QUM0RUU7QURyRjJCLEdBQS9CO0FDdUZBOztBRDFFRCxJQUFHNU0sT0FBT2tPLFFBQVY7QUFDQzNMLFlBQVVpRyxRQUFRLFNBQVIsQ0FBVjs7QUFFQWpJLFVBQVF1SCxRQUFSLEdBQW1CO0FBQ2xCLFdBQU8sS0FBUDtBQURrQixHQUFuQjs7QUFHQXZILFVBQVE4SixZQUFSLEdBQXVCLFVBQUNKLE9BQUQsRUFBVWpGLE1BQVY7QUFDdEIsUUFBQW9GLEtBQUE7O0FBQUEsUUFBRyxDQUFDSCxPQUFELElBQVksQ0FBQ2pGLE1BQWhCO0FBQ0MsYUFBTyxLQUFQO0FDNkVFOztBRDVFSG9GLFlBQVExSCxHQUFHNEgsTUFBSCxDQUFVeEYsT0FBVixDQUFrQm1GLE9BQWxCLENBQVI7O0FBQ0EsUUFBRyxDQUFDRyxLQUFELElBQVUsQ0FBQ0EsTUFBTStELE1BQXBCO0FBQ0MsYUFBTyxLQUFQO0FDOEVFOztBRDdFSCxXQUFPL0QsTUFBTStELE1BQU4sQ0FBYTlHLE9BQWIsQ0FBcUJyQyxNQUFyQixLQUE4QixDQUFyQztBQU5zQixHQUF2Qjs7QUFRQXpFLFVBQVE2TixjQUFSLEdBQXlCLFVBQUNuRSxPQUFELEVBQVNvRSxXQUFUO0FBQ3hCLFFBQUFDLEtBQUEsRUFBQUMsT0FBQSxFQUFBMUwsR0FBQTs7QUFBQSxRQUFHLENBQUNvSCxPQUFKO0FBQ0MsYUFBTyxLQUFQO0FDZ0ZFOztBRC9FSHFFLFlBQVEsS0FBUjtBQUNBQyxjQUFBLENBQUExTCxNQUFBSCxHQUFBNEgsTUFBQSxDQUFBeEYsT0FBQSxDQUFBbUYsT0FBQSxhQUFBcEgsSUFBc0MwTCxPQUF0QyxHQUFzQyxNQUF0Qzs7QUFDQSxRQUFHQSxXQUFZQSxRQUFRck0sUUFBUixDQUFpQm1NLFdBQWpCLENBQWY7QUFDQ0MsY0FBUSxJQUFSO0FDaUZFOztBRGhGSCxXQUFPQSxLQUFQO0FBUHdCLEdBQXpCOztBQVVBL04sVUFBUWlPLGtCQUFSLEdBQTZCLFVBQUNDLE1BQUQsRUFBU3pKLE1BQVQ7QUFDNUIsUUFBQTBKLGVBQUEsRUFBQUMsVUFBQSxFQUFBOUIsT0FBQSxFQUFBK0IsT0FBQTtBQUFBRCxpQkFBYSxLQUFiO0FBQ0FDLGNBQVVsTSxHQUFHa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQzFELFdBQUs7QUFBQzJELGFBQUlxQjtBQUFMO0FBQU4sS0FBdEIsRUFBMEM7QUFBQ3pCLGNBQU87QUFBQ0gsaUJBQVEsQ0FBVDtBQUFXc0IsZ0JBQU87QUFBbEI7QUFBUixLQUExQyxFQUF5RWQsS0FBekUsRUFBVjtBQUNBUixjQUFVLEVBQVY7QUFDQTZCLHNCQUFrQkUsUUFBUUMsTUFBUixDQUFlLFVBQUNDLEdBQUQ7QUFDaEMsVUFBQWpNLEdBQUE7O0FBQUEsVUFBR2lNLElBQUlqQyxPQUFQO0FBQ0NBLGtCQUFVSSxFQUFFSyxLQUFGLENBQVFULE9BQVIsRUFBZ0JpQyxJQUFJakMsT0FBcEIsQ0FBVjtBQzRGRzs7QUQzRkosY0FBQWhLLE1BQUFpTSxJQUFBWCxNQUFBLFlBQUF0TCxJQUFtQlgsUUFBbkIsQ0FBNEI4QyxNQUE1QixJQUFPLE1BQVA7QUFIaUIsTUFBbEI7O0FBSUEsUUFBRzBKLGdCQUFnQi9NLE1BQW5CO0FBQ0NnTixtQkFBYSxJQUFiO0FBREQ7QUFHQzlCLGdCQUFVSSxFQUFFQyxPQUFGLENBQVVMLE9BQVYsQ0FBVjtBQUNBQSxnQkFBVUksRUFBRThCLElBQUYsQ0FBT2xDLE9BQVAsQ0FBVjs7QUFDQSxVQUFHQSxRQUFRbEwsTUFBUixJQUFtQmUsR0FBR2tLLGFBQUgsQ0FBaUI5SCxPQUFqQixDQUF5QjtBQUFDMkUsYUFBSTtBQUFDMkQsZUFBSVA7QUFBTCxTQUFMO0FBQW9Cc0IsZ0JBQU9uSjtBQUEzQixPQUF6QixDQUF0QjtBQUNDMkoscUJBQWEsSUFBYjtBQU5GO0FDMEdHOztBRG5HSCxXQUFPQSxVQUFQO0FBZjRCLEdBQTdCOztBQW1CQXBPLFVBQVF5TyxxQkFBUixHQUFnQyxVQUFDUCxNQUFELEVBQVN6SixNQUFUO0FBQy9CLFFBQUFpSyxDQUFBLEVBQUFOLFVBQUE7O0FBQUEsU0FBT0YsT0FBTzlNLE1BQWQ7QUFDQyxhQUFPLElBQVA7QUNvR0U7O0FEbkdIc04sUUFBSSxDQUFKOztBQUNBLFdBQU1BLElBQUlSLE9BQU85TSxNQUFqQjtBQUNDZ04sbUJBQWFwTyxRQUFRaU8sa0JBQVIsQ0FBMkIsQ0FBQ0MsT0FBT1EsQ0FBUCxDQUFELENBQTNCLEVBQXdDakssTUFBeEMsQ0FBYjs7QUFDQSxXQUFPMkosVUFBUDtBQUNDO0FDcUdHOztBRHBHSk07QUFKRDs7QUFLQSxXQUFPTixVQUFQO0FBVCtCLEdBQWhDOztBQVdBcE8sVUFBUW9ILFdBQVIsR0FBc0IsVUFBQ3BDLEdBQUQ7QUFDckIsUUFBQXVELENBQUEsRUFBQW9HLFFBQUE7O0FBQUEsUUFBRzNKLEdBQUg7QUFFQ0EsWUFBTUEsSUFBSTlCLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUN1R0U7O0FEdEdILFFBQUl6RCxPQUFPK0gsU0FBWDtBQUNDLGFBQU8vSCxPQUFPMkgsV0FBUCxDQUFtQnBDLEdBQW5CLENBQVA7QUFERDtBQUdDLFVBQUd2RixPQUFPaUUsUUFBVjtBQUNDO0FBQ0NpTCxxQkFBVyxJQUFJQyxHQUFKLENBQVFuUCxPQUFPMkgsV0FBUCxFQUFSLENBQVg7O0FBQ0EsY0FBR3BDLEdBQUg7QUFDQyxtQkFBTzJKLFNBQVNFLFFBQVQsR0FBb0I3SixHQUEzQjtBQUREO0FBR0MsbUJBQU8ySixTQUFTRSxRQUFoQjtBQUxGO0FBQUEsaUJBQUF6RixNQUFBO0FBTU1iLGNBQUFhLE1BQUE7QUFDTCxpQkFBTzNKLE9BQU8ySCxXQUFQLENBQW1CcEMsR0FBbkIsQ0FBUDtBQVJGO0FBQUE7QUNvSEssZUQxR0p2RixPQUFPMkgsV0FBUCxDQUFtQnBDLEdBQW5CLENDMEdJO0FEdkhOO0FDeUhHO0FEN0hrQixHQUF0Qjs7QUFvQkFoRixVQUFROE8sZUFBUixHQUEwQixVQUFDQyxHQUFELEVBQU1DLEdBQU47QUFFekIsUUFBQXZJLFNBQUEsRUFBQWxILE9BQUEsRUFBQTBQLFFBQUEsRUFBQTNNLEdBQUEsRUFBQUMsSUFBQSxFQUFBMk0sSUFBQSxFQUFBQyxJQUFBLEVBQUFDLE1BQUEsRUFBQTVLLElBQUEsRUFBQUMsTUFBQSxFQUFBNEssUUFBQTtBQUFBQSxlQUFBLENBQUEvTSxNQUFBeU0sSUFBQU8sS0FBQSxZQUFBaE4sSUFBc0IrTSxRQUF0QixHQUFzQixNQUF0QjtBQUVBSixlQUFBLENBQUExTSxPQUFBd00sSUFBQU8sS0FBQSxZQUFBL00sS0FBc0IwTSxRQUF0QixHQUFzQixNQUF0Qjs7QUFFQSxRQUFHSSxZQUFZSixRQUFmO0FBQ0N6SyxhQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUI7QUFBQ2lMLG9CQUFZSDtBQUFiLE9BQWpCLENBQVA7O0FBRUEsVUFBRyxDQUFDN0ssSUFBSjtBQUNDLGVBQU8sS0FBUDtBQzJHRzs7QUR6R0o0SyxlQUFTeEksU0FBUzZJLGNBQVQsQ0FBd0JqTCxJQUF4QixFQUE4QnlLLFFBQTlCLENBQVQ7O0FBRUEsVUFBR0csT0FBT2xILEtBQVY7QUFDQyxjQUFNLElBQUl3SCxLQUFKLENBQVVOLE9BQU9sSCxLQUFqQixDQUFOO0FBREQ7QUFHQyxlQUFPMUQsSUFBUDtBQVhGO0FDc0hHOztBRHpHSEMsYUFBQSxDQUFBeUssT0FBQUgsSUFBQU8sS0FBQSxZQUFBSixLQUFvQixXQUFwQixJQUFvQixNQUFwQjtBQUVBekksZ0JBQUEsQ0FBQTBJLE9BQUFKLElBQUFPLEtBQUEsWUFBQUgsS0FBdUIsY0FBdkIsSUFBdUIsTUFBdkI7O0FBRUEsUUFBR25QLFFBQVEyUCxjQUFSLENBQXVCbEwsTUFBdkIsRUFBOEJnQyxTQUE5QixDQUFIO0FBQ0MsYUFBT3RFLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCO0FBQUMyRSxhQUFLekU7QUFBTixPQUFqQixDQUFQO0FDMkdFOztBRHpHSGxGLGNBQVUsSUFBSXlDLE9BQUosQ0FBWStNLEdBQVosRUFBaUJDLEdBQWpCLENBQVY7O0FBRUEsUUFBR0QsSUFBSWEsT0FBUDtBQUNDbkwsZUFBU3NLLElBQUlhLE9BQUosQ0FBWSxXQUFaLENBQVQ7QUFDQW5KLGtCQUFZc0ksSUFBSWEsT0FBSixDQUFZLGNBQVosQ0FBWjtBQzBHRTs7QUR2R0gsUUFBRyxDQUFDbkwsTUFBRCxJQUFXLENBQUNnQyxTQUFmO0FBQ0NoQyxlQUFTbEYsUUFBUTJHLEdBQVIsQ0FBWSxXQUFaLENBQVQ7QUFDQU8sa0JBQVlsSCxRQUFRMkcsR0FBUixDQUFZLGNBQVosQ0FBWjtBQ3lHRTs7QUR2R0gsUUFBRyxDQUFDekIsTUFBRCxJQUFXLENBQUNnQyxTQUFmO0FBQ0MsYUFBTyxLQUFQO0FDeUdFOztBRHZHSCxRQUFHekcsUUFBUTJQLGNBQVIsQ0FBdUJsTCxNQUF2QixFQUErQmdDLFNBQS9CLENBQUg7QUFDQyxhQUFPdEUsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUI7QUFBQzJFLGFBQUt6RTtBQUFOLE9BQWpCLENBQVA7QUMyR0U7O0FEekdILFdBQU8sS0FBUDtBQTNDeUIsR0FBMUI7O0FBOENBekUsVUFBUTJQLGNBQVIsR0FBeUIsVUFBQ2xMLE1BQUQsRUFBU2dDLFNBQVQ7QUFDeEIsUUFBQW9KLFdBQUEsRUFBQXJMLElBQUE7O0FBQUEsUUFBR0MsVUFBV2dDLFNBQWQ7QUFDQ29KLG9CQUFjakosU0FBU2tKLGVBQVQsQ0FBeUJySixTQUF6QixDQUFkO0FBQ0FqQyxhQUFPL0UsT0FBTzhQLEtBQVAsQ0FBYWhMLE9BQWIsQ0FDTjtBQUFBMkUsYUFBS3pFLE1BQUw7QUFDQSxtREFBMkNvTDtBQUQzQyxPQURNLENBQVA7O0FBR0EsVUFBR3JMLElBQUg7QUFDQyxlQUFPLElBQVA7QUFERDtBQUdDLGVBQU8sS0FBUDtBQVJGO0FDcUhHOztBRDVHSCxXQUFPLEtBQVA7QUFWd0IsR0FBekI7QUN5SEE7O0FENUdELElBQUcvRSxPQUFPa08sUUFBVjtBQUNDMUwsV0FBU2dHLFFBQVEsUUFBUixDQUFUOztBQUNBakksVUFBUStQLE9BQVIsR0FBa0IsVUFBQ2QsUUFBRCxFQUFXdkssR0FBWCxFQUFnQnNMLEVBQWhCO0FBQ2pCLFFBQUFDLENBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBLEVBQUE1SCxDQUFBLEVBQUFtRyxDQUFBLEVBQUEwQixLQUFBLEVBQUFDLEdBQUEsRUFBQXhQLENBQUE7O0FBQUE7QUFDQ3VQLGNBQVEsRUFBUjtBQUNBQyxZQUFNM0wsSUFBSXRELE1BQVY7O0FBQ0EsVUFBR2lQLE1BQU0sRUFBVDtBQUNDSixZQUFJLEVBQUo7QUFDQXZCLFlBQUksQ0FBSjtBQUNBN04sWUFBSSxLQUFLd1AsR0FBVDs7QUFDQSxlQUFNM0IsSUFBSTdOLENBQVY7QUFDQ29QLGNBQUksTUFBTUEsQ0FBVjtBQUNBdkI7QUFGRDs7QUFHQTBCLGdCQUFRMUwsTUFBTXVMLENBQWQ7QUFQRCxhQVFLLElBQUdJLE9BQU8sRUFBVjtBQUNKRCxnQkFBUTFMLElBQUl2RCxLQUFKLENBQVUsQ0FBVixFQUFhLEVBQWIsQ0FBUjtBQ2lIRzs7QUQvR0orTyxpQkFBV2pPLE9BQU9xTyxnQkFBUCxDQUF3QixhQUF4QixFQUF1QyxJQUFJQyxNQUFKLENBQVdILEtBQVgsRUFBa0IsTUFBbEIsQ0FBdkMsRUFBa0UsSUFBSUcsTUFBSixDQUFXUCxFQUFYLEVBQWUsTUFBZixDQUFsRSxDQUFYO0FBRUFHLG9CQUFjSSxPQUFPQyxNQUFQLENBQWMsQ0FBQ04sU0FBU08sTUFBVCxDQUFnQnhCLFFBQWhCLEVBQTBCLFFBQTFCLENBQUQsRUFBc0NpQixTQUFTUSxLQUFULEVBQXRDLENBQWQsQ0FBZDtBQUVBekIsaUJBQVdrQixZQUFZck4sUUFBWixFQUFYO0FBQ0EsYUFBT21NLFFBQVA7QUFuQkQsYUFBQTdGLE1BQUE7QUFvQk1iLFVBQUFhLE1BQUE7QUFDTCxhQUFPNkYsUUFBUDtBQ2dIRTtBRHRJYyxHQUFsQjs7QUF3QkFqUCxVQUFRMlEsT0FBUixHQUFrQixVQUFDMUIsUUFBRCxFQUFXdkssR0FBWCxFQUFnQnNMLEVBQWhCO0FBQ2pCLFFBQUFDLENBQUEsRUFBQVcsTUFBQSxFQUFBQyxXQUFBLEVBQUFuQyxDQUFBLEVBQUEwQixLQUFBLEVBQUFDLEdBQUEsRUFBQXhQLENBQUE7QUFBQXVQLFlBQVEsRUFBUjtBQUNBQyxVQUFNM0wsSUFBSXRELE1BQVY7O0FBQ0EsUUFBR2lQLE1BQU0sRUFBVDtBQUNDSixVQUFJLEVBQUo7QUFDQXZCLFVBQUksQ0FBSjtBQUNBN04sVUFBSSxLQUFLd1AsR0FBVDs7QUFDQSxhQUFNM0IsSUFBSTdOLENBQVY7QUFDQ29QLFlBQUksTUFBTUEsQ0FBVjtBQUNBdkI7QUFGRDs7QUFHQTBCLGNBQVExTCxNQUFNdUwsQ0FBZDtBQVBELFdBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELGNBQVExTCxJQUFJdkQsS0FBSixDQUFVLENBQVYsRUFBYSxFQUFiLENBQVI7QUNtSEU7O0FEakhIeVAsYUFBUzNPLE9BQU82TyxjQUFQLENBQXNCLGFBQXRCLEVBQXFDLElBQUlQLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUFyQyxFQUFnRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWhFLENBQVQ7QUFFQWEsa0JBQWNOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDSSxPQUFPSCxNQUFQLENBQWMsSUFBSUYsTUFBSixDQUFXdEIsUUFBWCxFQUFxQixNQUFyQixDQUFkLENBQUQsRUFBOEMyQixPQUFPRixLQUFQLEVBQTlDLENBQWQsQ0FBZDtBQUVBekIsZUFBVzRCLFlBQVkvTixRQUFaLENBQXFCLFFBQXJCLENBQVg7QUFFQSxXQUFPbU0sUUFBUDtBQXBCaUIsR0FBbEI7O0FBc0JBalAsVUFBUStRLHdCQUFSLEdBQW1DLFVBQUNDLFlBQUQ7QUFFbEMsUUFBQUMsVUFBQSxFQUFBcEIsV0FBQSxFQUFBcUIsR0FBQSxFQUFBMU0sSUFBQSxFQUFBQyxNQUFBOztBQUFBLFFBQUcsQ0FBQ3VNLFlBQUo7QUFDQyxhQUFPLElBQVA7QUNnSEU7O0FEOUdIdk0sYUFBU3VNLGFBQWFHLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBVDtBQUVBdEIsa0JBQWNqSixTQUFTa0osZUFBVCxDQUF5QmtCLFlBQXpCLENBQWQ7QUFFQXhNLFdBQU9yQyxHQUFHb04sS0FBSCxDQUFTaEwsT0FBVCxDQUFpQjtBQUFDMkUsV0FBS3pFLE1BQU47QUFBYyw2QkFBdUJvTDtBQUFyQyxLQUFqQixDQUFQOztBQUVBLFFBQUdyTCxJQUFIO0FBQ0MsYUFBT0MsTUFBUDtBQUREO0FBSUN3TSxtQkFBYUcsYUFBYUMsV0FBYixDQUF5QkMsV0FBdEM7QUFFQUosWUFBTUQsV0FBVzFNLE9BQVgsQ0FBbUI7QUFBQyx1QkFBZXlNO0FBQWhCLE9BQW5CLENBQU47O0FBQ0EsVUFBR0UsR0FBSDtBQUVDLGFBQUFBLE9BQUEsT0FBR0EsSUFBS0ssT0FBUixHQUFRLE1BQVIsSUFBa0IsSUFBSXRILElBQUosRUFBbEI7QUFDQyxpQkFBTyx5QkFBdUIrRyxZQUF2QixHQUFvQyxjQUEzQztBQUREO0FBR0MsaUJBQUFFLE9BQUEsT0FBT0EsSUFBS3pNLE1BQVosR0FBWSxNQUFaO0FBTEY7QUFBQTtBQU9DLGVBQU8seUJBQXVCdU0sWUFBdkIsR0FBb0MsZ0JBQTNDO0FBZEY7QUMrSEc7O0FEaEhILFdBQU8sSUFBUDtBQTFCa0MsR0FBbkM7O0FBNEJBaFIsVUFBUXdSLHNCQUFSLEdBQWlDLFVBQUN6QyxHQUFELEVBQU1DLEdBQU47QUFFaEMsUUFBQXZJLFNBQUEsRUFBQWxILE9BQUEsRUFBQStDLEdBQUEsRUFBQUMsSUFBQSxFQUFBMk0sSUFBQSxFQUFBQyxJQUFBLEVBQUExSyxNQUFBO0FBQUFBLGFBQUEsQ0FBQW5DLE1BQUF5TSxJQUFBTyxLQUFBLFlBQUFoTixJQUFvQixXQUFwQixJQUFvQixNQUFwQjtBQUVBbUUsZ0JBQUEsQ0FBQWxFLE9BQUF3TSxJQUFBTyxLQUFBLFlBQUEvTSxLQUF1QixjQUF2QixJQUF1QixNQUF2Qjs7QUFFQSxRQUFHdkMsUUFBUTJQLGNBQVIsQ0FBdUJsTCxNQUF2QixFQUE4QmdDLFNBQTlCLENBQUg7QUFDQyxjQUFBeUksT0FBQS9NLEdBQUFvTixLQUFBLENBQUFoTCxPQUFBO0FDZ0hLMkUsYUFBS3pFO0FEaEhWLGFDaUhVLElEakhWLEdDaUhpQnlLLEtEakh1QmhHLEdBQXhDLEdBQXdDLE1BQXhDO0FDa0hFOztBRGhISDNKLGNBQVUsSUFBSXlDLE9BQUosQ0FBWStNLEdBQVosRUFBaUJDLEdBQWpCLENBQVY7O0FBRUEsUUFBR0QsSUFBSWEsT0FBUDtBQUNDbkwsZUFBU3NLLElBQUlhLE9BQUosQ0FBWSxXQUFaLENBQVQ7QUFDQW5KLGtCQUFZc0ksSUFBSWEsT0FBSixDQUFZLGNBQVosQ0FBWjtBQ2lIRTs7QUQ5R0gsUUFBRyxDQUFDbkwsTUFBRCxJQUFXLENBQUNnQyxTQUFmO0FBQ0NoQyxlQUFTbEYsUUFBUTJHLEdBQVIsQ0FBWSxXQUFaLENBQVQ7QUFDQU8sa0JBQVlsSCxRQUFRMkcsR0FBUixDQUFZLGNBQVosQ0FBWjtBQ2dIRTs7QUQ5R0gsUUFBRyxDQUFDekIsTUFBRCxJQUFXLENBQUNnQyxTQUFmO0FBQ0MsYUFBTyxJQUFQO0FDZ0hFOztBRDlHSCxRQUFHekcsUUFBUTJQLGNBQVIsQ0FBdUJsTCxNQUF2QixFQUErQmdDLFNBQS9CLENBQUg7QUFDQyxjQUFBMEksT0FBQWhOLEdBQUFvTixLQUFBLENBQUFoTCxPQUFBO0FDZ0hLMkUsYUFBS3pFO0FEaEhWLGFDaUhVLElEakhWLEdDaUhpQjBLLEtEakh1QmpHLEdBQXhDLEdBQXdDLE1BQXhDO0FDa0hFO0FEMUk2QixHQUFqQzs7QUEwQkFsSixVQUFReVIsc0JBQVIsR0FBaUMsVUFBQzFDLEdBQUQsRUFBTUMsR0FBTjtBQUNoQyxRQUFBekcsQ0FBQSxFQUFBL0QsSUFBQSxFQUFBQyxNQUFBOztBQUFBO0FBQ0NBLGVBQVNzSyxJQUFJdEssTUFBYjtBQUVBRCxhQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUI7QUFBQzJFLGFBQUt6RTtBQUFOLE9BQWpCLENBQVA7O0FBRUEsVUFBRyxDQUFDQSxNQUFELElBQVcsQ0FBQ0QsSUFBZjtBQUNDa04sbUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNDO0FBQUE0QyxnQkFDQztBQUFBLHFCQUFTO0FBQVQsV0FERDtBQUVBQyxnQkFBTTtBQUZOLFNBREQ7QUFJQSxlQUFPLEtBQVA7QUFMRDtBQU9DLGVBQU8sSUFBUDtBQVpGO0FBQUEsYUFBQXpJLE1BQUE7QUFhTWIsVUFBQWEsTUFBQTs7QUFDTCxVQUFHLENBQUMzRSxNQUFELElBQVcsQ0FBQ0QsSUFBZjtBQUNDa04sbUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNDO0FBQUE2QyxnQkFBTSxHQUFOO0FBQ0FELGdCQUNDO0FBQUEscUJBQVNySixFQUFFZSxPQUFYO0FBQ0EsdUJBQVc7QUFEWDtBQUZELFNBREQ7QUFLQSxlQUFPLEtBQVA7QUFwQkY7QUMrSUc7QURoSjZCLEdBQWpDO0FDa0pBOztBRHJIRHBILFFBQVEsVUFBQ2dQLEdBQUQ7QUN3SE4sU0R2SER4RSxFQUFFckMsSUFBRixDQUFPcUMsRUFBRW9GLFNBQUYsQ0FBWVosR0FBWixDQUFQLEVBQXlCLFVBQUMzUSxJQUFEO0FBQ3hCLFFBQUF3UixJQUFBOztBQUFBLFFBQUcsQ0FBSXJGLEVBQUVuTSxJQUFGLENBQUosSUFBb0JtTSxFQUFBN00sU0FBQSxDQUFBVSxJQUFBLFNBQXZCO0FBQ0N3UixhQUFPckYsRUFBRW5NLElBQUYsSUFBVTJRLElBQUkzUSxJQUFKLENBQWpCO0FDeUhHLGFEeEhIbU0sRUFBRTdNLFNBQUYsQ0FBWVUsSUFBWixJQUFvQjtBQUNuQixZQUFBeVIsSUFBQTtBQUFBQSxlQUFPLENBQUMsS0FBS0MsUUFBTixDQUFQO0FBQ0FuUixhQUFLTyxLQUFMLENBQVcyUSxJQUFYLEVBQWlCRSxTQUFqQjtBQUNBLGVBQU85QyxPQUFPK0MsSUFBUCxDQUFZLElBQVosRUFBa0JKLEtBQUsxUSxLQUFMLENBQVdxTCxDQUFYLEVBQWNzRixJQUFkLENBQWxCLENBQVA7QUFIbUIsT0N3SGpCO0FBTUQ7QURqSUosSUN1SEM7QUR4SE0sQ0FBUjs7QUFXQSxJQUFHdlMsT0FBT2tPLFFBQVY7QUFFQzNOLFVBQVFvUyxTQUFSLEdBQW9CLFVBQUNDLElBQUQ7QUFDbkIsUUFBQUMsR0FBQTs7QUFBQSxRQUFHLENBQUNELElBQUo7QUFDQ0EsYUFBTyxJQUFJcEksSUFBSixFQUFQO0FDNEhFOztBRDNISDhELFVBQU1zRSxJQUFOLEVBQVlwSSxJQUFaO0FBQ0FxSSxVQUFNRCxLQUFLRSxNQUFMLEVBQU47O0FBRUEsUUFBR0QsUUFBTyxDQUFQLElBQVlBLFFBQU8sQ0FBdEI7QUFDQyxhQUFPLElBQVA7QUM0SEU7O0FEMUhILFdBQU8sS0FBUDtBQVRtQixHQUFwQjs7QUFXQXRTLFVBQVF3UyxtQkFBUixHQUE4QixVQUFDSCxJQUFELEVBQU9JLElBQVA7QUFDN0IsUUFBQUMsWUFBQSxFQUFBQyxVQUFBO0FBQUE1RSxVQUFNc0UsSUFBTixFQUFZcEksSUFBWjtBQUNBOEQsVUFBTTBFLElBQU4sRUFBWTFQLE1BQVo7QUFDQTRQLGlCQUFhLElBQUkxSSxJQUFKLENBQVNvSSxJQUFULENBQWI7O0FBQ0FLLG1CQUFlLFVBQUNoRSxDQUFELEVBQUkrRCxJQUFKO0FBQ2QsVUFBRy9ELElBQUkrRCxJQUFQO0FBQ0NFLHFCQUFhLElBQUkxSSxJQUFKLENBQVMwSSxXQUFXQyxPQUFYLEtBQXVCLEtBQUcsRUFBSCxHQUFNLEVBQU4sR0FBUyxJQUF6QyxDQUFiOztBQUNBLFlBQUcsQ0FBQzVTLFFBQVFvUyxTQUFSLENBQWtCTyxVQUFsQixDQUFKO0FBQ0NqRTtBQzZISTs7QUQ1SExnRSxxQkFBYWhFLENBQWIsRUFBZ0IrRCxJQUFoQjtBQzhIRztBRG5JVSxLQUFmOztBQU9BQyxpQkFBYSxDQUFiLEVBQWdCRCxJQUFoQjtBQUNBLFdBQU9FLFVBQVA7QUFaNkIsR0FBOUI7O0FBZ0JBM1MsVUFBUTZTLDBCQUFSLEdBQXFDLFVBQUNSLElBQUQsRUFBT1MsSUFBUDtBQUNwQyxRQUFBQyxjQUFBLEVBQUFwSixRQUFBLEVBQUFxSixVQUFBLEVBQUF0RSxDQUFBLEVBQUF1RSxDQUFBLEVBQUE1QyxHQUFBLEVBQUE2QyxTQUFBLEVBQUE1USxHQUFBLEVBQUE2USxXQUFBLEVBQUFDLFVBQUEsRUFBQUMsV0FBQTtBQUFBdEYsVUFBTXNFLElBQU4sRUFBWXBJLElBQVo7QUFDQW9KLGtCQUFBLENBQUEvUSxNQUFBN0MsT0FBQUMsUUFBQSxDQUFBNFQsTUFBQSxZQUFBaFIsSUFBc0MrUSxXQUF0QyxHQUFzQyxNQUF0Qzs7QUFDQSxRQUFHLENBQUlBLFdBQUosSUFBbUIzRyxFQUFFNkcsT0FBRixDQUFVRixXQUFWLENBQXRCO0FBQ0NoSyxjQUFRbkIsS0FBUixDQUFjLHFCQUFkO0FBQ0FtTCxvQkFBYyxDQUFDO0FBQUMsZ0JBQVEsQ0FBVDtBQUFZLGtCQUFVO0FBQXRCLE9BQUQsRUFBNkI7QUFBQyxnQkFBUSxFQUFUO0FBQWEsa0JBQVU7QUFBdkIsT0FBN0IsQ0FBZDtBQ3NJRTs7QURwSUhoRCxVQUFNZ0QsWUFBWWpTLE1BQWxCO0FBQ0FnUyxpQkFBYSxJQUFJbkosSUFBSixDQUFTb0ksSUFBVCxDQUFiO0FBQ0ExSSxlQUFXLElBQUlNLElBQUosQ0FBU29JLElBQVQsQ0FBWDtBQUNBZSxlQUFXSSxRQUFYLENBQW9CSCxZQUFZLENBQVosRUFBZUksSUFBbkM7QUFDQUwsZUFBV00sVUFBWCxDQUFzQkwsWUFBWSxDQUFaLEVBQWVNLE1BQXJDO0FBQ0FoSyxhQUFTNkosUUFBVCxDQUFrQkgsWUFBWWhELE1BQU0sQ0FBbEIsRUFBcUJvRCxJQUF2QztBQUNBOUosYUFBUytKLFVBQVQsQ0FBb0JMLFlBQVloRCxNQUFNLENBQWxCLEVBQXFCc0QsTUFBekM7QUFFQVoscUJBQWlCLElBQUk5SSxJQUFKLENBQVNvSSxJQUFULENBQWpCO0FBRUFZLFFBQUksQ0FBSjtBQUNBQyxnQkFBWTdDLE1BQU0sQ0FBbEI7O0FBQ0EsUUFBR2dDLE9BQU9lLFVBQVY7QUFDQyxVQUFHTixJQUFIO0FBQ0NHLFlBQUksQ0FBSjtBQUREO0FBSUNBLFlBQUk1QyxNQUFJLENBQVI7QUFMRjtBQUFBLFdBTUssSUFBR2dDLFFBQVFlLFVBQVIsSUFBdUJmLE9BQU8xSSxRQUFqQztBQUNKK0UsVUFBSSxDQUFKOztBQUNBLGFBQU1BLElBQUl3RSxTQUFWO0FBQ0NGLHFCQUFhLElBQUkvSSxJQUFKLENBQVNvSSxJQUFULENBQWI7QUFDQWMsc0JBQWMsSUFBSWxKLElBQUosQ0FBU29JLElBQVQsQ0FBZDtBQUNBVyxtQkFBV1EsUUFBWCxDQUFvQkgsWUFBWTNFLENBQVosRUFBZStFLElBQW5DO0FBQ0FULG1CQUFXVSxVQUFYLENBQXNCTCxZQUFZM0UsQ0FBWixFQUFlaUYsTUFBckM7QUFDQVIsb0JBQVlLLFFBQVosQ0FBcUJILFlBQVkzRSxJQUFJLENBQWhCLEVBQW1CK0UsSUFBeEM7QUFDQU4sb0JBQVlPLFVBQVosQ0FBdUJMLFlBQVkzRSxJQUFJLENBQWhCLEVBQW1CaUYsTUFBMUM7O0FBRUEsWUFBR3RCLFFBQVFXLFVBQVIsSUFBdUJYLE9BQU9jLFdBQWpDO0FBQ0M7QUNtSUk7O0FEaklMekU7QUFYRDs7QUFhQSxVQUFHb0UsSUFBSDtBQUNDRyxZQUFJdkUsSUFBSSxDQUFSO0FBREQ7QUFHQ3VFLFlBQUl2RSxJQUFJMkIsTUFBSSxDQUFaO0FBbEJHO0FBQUEsV0FvQkEsSUFBR2dDLFFBQVExSSxRQUFYO0FBQ0osVUFBR21KLElBQUg7QUFDQ0csWUFBSUMsWUFBWSxDQUFoQjtBQUREO0FBR0NELFlBQUlDLFlBQVk3QyxNQUFJLENBQXBCO0FBSkc7QUN3SUY7O0FEbElILFFBQUc0QyxJQUFJQyxTQUFQO0FBRUNILHVCQUFpQi9TLFFBQVF3UyxtQkFBUixDQUE0QkgsSUFBNUIsRUFBa0MsQ0FBbEMsQ0FBakI7QUFDQVUscUJBQWVTLFFBQWYsQ0FBd0JILFlBQVlKLElBQUlDLFNBQUosR0FBZ0IsQ0FBNUIsRUFBK0JPLElBQXZEO0FBQ0FWLHFCQUFlVyxVQUFmLENBQTBCTCxZQUFZSixJQUFJQyxTQUFKLEdBQWdCLENBQTVCLEVBQStCUyxNQUF6RDtBQUpELFdBS0ssSUFBR1YsS0FBS0MsU0FBUjtBQUNKSCxxQkFBZVMsUUFBZixDQUF3QkgsWUFBWUosQ0FBWixFQUFlUSxJQUF2QztBQUNBVixxQkFBZVcsVUFBZixDQUEwQkwsWUFBWUosQ0FBWixFQUFlVSxNQUF6QztBQ21JRTs7QURqSUgsV0FBT1osY0FBUDtBQTVEb0MsR0FBckM7QUNnTUE7O0FEbElELElBQUd0VCxPQUFPa08sUUFBVjtBQUNDakIsSUFBRWtILE1BQUYsQ0FBUzVULE9BQVQsRUFDQztBQUFBNlQscUJBQWlCLFVBQUNDLEtBQUQsRUFBUXJQLE1BQVIsRUFBZ0JnQyxTQUFoQjtBQUNoQixVQUFBVSxHQUFBLEVBQUE4SSxDQUFBLEVBQUFXLE1BQUEsRUFBQUMsV0FBQSxFQUFBaEIsV0FBQSxFQUFBbkIsQ0FBQSxFQUFBc0IsRUFBQSxFQUFBSSxLQUFBLEVBQUFDLEdBQUEsRUFBQXhQLENBQUEsRUFBQWtULEdBQUEsRUFBQUMsTUFBQSxFQUFBeEUsVUFBQSxFQUFBeUUsYUFBQSxFQUFBelAsSUFBQTtBQUFBdkMsZUFBU2dHLFFBQVEsUUFBUixDQUFUO0FBQ0FkLFlBQU1oRixHQUFHa0YsSUFBSCxDQUFROUMsT0FBUixDQUFnQnVQLEtBQWhCLENBQU47O0FBQ0EsVUFBRzNNLEdBQUg7QUFDQzZNLGlCQUFTN00sSUFBSTZNLE1BQWI7QUNzSUc7O0FEcElKLFVBQUd2UCxVQUFXZ0MsU0FBZDtBQUNDb0osc0JBQWNqSixTQUFTa0osZUFBVCxDQUF5QnJKLFNBQXpCLENBQWQ7QUFDQWpDLGVBQU8vRSxPQUFPOFAsS0FBUCxDQUFhaEwsT0FBYixDQUNOO0FBQUEyRSxlQUFLekUsTUFBTDtBQUNBLHFEQUEyQ29MO0FBRDNDLFNBRE0sQ0FBUDs7QUFHQSxZQUFHckwsSUFBSDtBQUNDZ0wsdUJBQWFoTCxLQUFLZ0wsVUFBbEI7O0FBQ0EsY0FBR3JJLElBQUk2TSxNQUFQO0FBQ0NoRSxpQkFBSzdJLElBQUk2TSxNQUFUO0FBREQ7QUFHQ2hFLGlCQUFLLGtCQUFMO0FDdUlLOztBRHRJTitELGdCQUFNRyxTQUFTLElBQUlqSyxJQUFKLEdBQVcySSxPQUFYLEtBQXFCLElBQTlCLEVBQW9DOVAsUUFBcEMsRUFBTjtBQUNBc04sa0JBQVEsRUFBUjtBQUNBQyxnQkFBTWIsV0FBV3BPLE1BQWpCOztBQUNBLGNBQUdpUCxNQUFNLEVBQVQ7QUFDQ0osZ0JBQUksRUFBSjtBQUNBdkIsZ0JBQUksQ0FBSjtBQUNBN04sZ0JBQUksS0FBS3dQLEdBQVQ7O0FBQ0EsbUJBQU0zQixJQUFJN04sQ0FBVjtBQUNDb1Asa0JBQUksTUFBTUEsQ0FBVjtBQUNBdkI7QUFGRDs7QUFHQTBCLG9CQUFRWixhQUFhUyxDQUFyQjtBQVBELGlCQVFLLElBQUdJLE9BQU8sRUFBVjtBQUNKRCxvQkFBUVosV0FBV3JPLEtBQVgsQ0FBaUIsQ0FBakIsRUFBbUIsRUFBbkIsQ0FBUjtBQ3lJSzs7QUR2SU55UCxtQkFBUzNPLE9BQU82TyxjQUFQLENBQXNCLGFBQXRCLEVBQXFDLElBQUlQLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUFyQyxFQUFnRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWhFLENBQVQ7QUFFQWEsd0JBQWNOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDSSxPQUFPSCxNQUFQLENBQWMsSUFBSUYsTUFBSixDQUFXd0QsR0FBWCxFQUFnQixNQUFoQixDQUFkLENBQUQsRUFBeUNuRCxPQUFPRixLQUFQLEVBQXpDLENBQWQsQ0FBZDtBQUVBdUQsMEJBQWdCcEQsWUFBWS9OLFFBQVosQ0FBcUIsUUFBckIsQ0FBaEI7QUE3QkY7QUNxS0k7O0FEdElKLGFBQU9tUixhQUFQO0FBckNEO0FBdUNBbFUsWUFBUSxVQUFDMEUsTUFBRCxFQUFTMFAsTUFBVDtBQUNQLFVBQUFwVSxNQUFBLEVBQUF5RSxJQUFBO0FBQUFBLGFBQU9yQyxHQUFHb04sS0FBSCxDQUFTaEwsT0FBVCxDQUFpQjtBQUFDMkUsYUFBSXpFO0FBQUwsT0FBakIsRUFBOEI7QUFBQ2dJLGdCQUFRO0FBQUMxTSxrQkFBUTtBQUFUO0FBQVQsT0FBOUIsQ0FBUDtBQUNBQSxlQUFBeUUsUUFBQSxPQUFTQSxLQUFNekUsTUFBZixHQUFlLE1BQWY7O0FBQ0EsVUFBR29VLE1BQUg7QUFDQyxZQUFHcFUsV0FBVSxPQUFiO0FBQ0NBLG1CQUFTLElBQVQ7QUMrSUk7O0FEOUlMLFlBQUdBLFdBQVUsT0FBYjtBQUNDQSxtQkFBUyxPQUFUO0FBSkY7QUNxSkk7O0FEaEpKLGFBQU9BLE1BQVA7QUEvQ0Q7QUFpREFxVSwrQkFBMkIsVUFBQy9FLFFBQUQ7QUFDMUIsYUFBTyxDQUFJNVAsT0FBTzhQLEtBQVAsQ0FBYWhMLE9BQWIsQ0FBcUI7QUFBRThLLGtCQUFVO0FBQUVnRixrQkFBUyxJQUFJaFIsTUFBSixDQUFXLE1BQU01RCxPQUFPNlUsYUFBUCxDQUFxQmpGLFFBQXJCLEVBQStCa0YsSUFBL0IsRUFBTixHQUE4QyxHQUF6RCxFQUE4RCxHQUE5RDtBQUFYO0FBQVosT0FBckIsQ0FBWDtBQWxERDtBQXFEQUMsc0JBQWtCLFVBQUNDLEdBQUQ7QUFDakIsVUFBQUMsYUFBQSxFQUFBQyxrQkFBQSxFQUFBQyxNQUFBLEVBQUF0UyxHQUFBLEVBQUFDLElBQUEsRUFBQTJNLElBQUEsRUFBQUMsSUFBQSxFQUFBMEYsS0FBQTtBQUFBRCxlQUFTaFUsRUFBRSxrQkFBRixDQUFUO0FBQ0FpVSxjQUFRLElBQVI7O0FBQ0EsV0FBT0osR0FBUDtBQUNDSSxnQkFBUSxLQUFSO0FDc0pHOztBRHBKSkgsc0JBQUEsQ0FBQXBTLE1BQUE3QyxPQUFBQyxRQUFBLHVCQUFBNkMsT0FBQUQsSUFBQTJNLFFBQUEsWUFBQTFNLEtBQWtEdVMsTUFBbEQsR0FBa0QsTUFBbEQsR0FBa0QsTUFBbEQ7QUFDQUgsMkJBQUEsQ0FBQXpGLE9BQUF6UCxPQUFBQyxRQUFBLHVCQUFBeVAsT0FBQUQsS0FBQUQsUUFBQSxZQUFBRSxLQUF1RDRGLFdBQXZELEdBQXVELE1BQXZELEdBQXVELE1BQXZEOztBQUNBLFVBQUdMLGFBQUg7QUFDQyxZQUFHLENBQUUsSUFBSXJSLE1BQUosQ0FBV3FSLGFBQVgsQ0FBRCxDQUE0QnBSLElBQTVCLENBQWlDbVIsT0FBTyxFQUF4QyxDQUFKO0FBQ0NHLG1CQUFTRCxrQkFBVDtBQUNBRSxrQkFBUSxLQUFSO0FBRkQ7QUFJQ0Esa0JBQVEsSUFBUjtBQUxGO0FDNEpJOztBRC9JSixVQUFHQSxLQUFIO0FBQ0MsZUFBTyxJQUFQO0FBREQ7QUFHQyxlQUFPO0FBQUEzTSxpQkFDTjtBQUFBME0sb0JBQVFBO0FBQVI7QUFETSxTQUFQO0FDcUpHO0FEbE9MO0FBQUEsR0FERDtBQ3NPQTs7QURySkQ1VSxRQUFRZ1YsdUJBQVIsR0FBa0MsVUFBQzVSLEdBQUQ7QUFDakMsU0FBT0EsSUFBSUYsT0FBSixDQUFZLG1DQUFaLEVBQWlELE1BQWpELENBQVA7QUFEaUMsQ0FBbEM7O0FBR0FsRCxRQUFRaVYsc0JBQVIsR0FBaUMsVUFBQzdSLEdBQUQ7QUFDaEMsU0FBT0EsSUFBSUYsT0FBSixDQUFZLGlFQUFaLEVBQStFLEVBQS9FLENBQVA7QUFEZ0MsQ0FBakM7O0FBR0FnUyxRQUFRQyxTQUFSLEdBQW9CLFVBQUNDLFFBQUQ7QUFDbkIsTUFBQUMsTUFBQTtBQUFBQSxXQUFTLEVBQVQ7QUFDQUgsVUFBUUksV0FBUixDQUFvQixNQUFwQixFQUE0QjFJLElBQTVCLENBQWlDO0FBQUMvQyxXQUFPdUwsUUFBUjtBQUFpQkcsZ0JBQVcsSUFBNUI7QUFBaUNDLGFBQVE7QUFBekMsR0FBakMsRUFBaUY7QUFDaEYvSSxZQUFRO0FBQ1BnSixlQUFTLENBREY7QUFFUEMsa0JBQVksQ0FGTDtBQUdQQyxnQkFBVSxDQUhIO0FBSVBDLG1CQUFhO0FBSk47QUFEd0UsR0FBakYsRUFPR2pWLE9BUEgsQ0FPVyxVQUFDd0csR0FBRDtBQytKUixXRDlKRmtPLE9BQU9sTyxJQUFJK0IsR0FBWCxJQUFrQi9CLEdDOEpoQjtBRHRLSDtBQVVBLFNBQU9rTyxNQUFQO0FBWm1CLENBQXBCOztBQWNBSCxRQUFRVyxlQUFSLEdBQTBCLFVBQUNULFFBQUQ7QUFDekIsTUFBQVUsWUFBQTtBQUFBQSxpQkFBZSxFQUFmO0FBQ0FaLFVBQVFJLFdBQVIsQ0FBb0IsV0FBcEIsRUFBaUMxSSxJQUFqQyxDQUFzQztBQUFDL0MsV0FBT3VMO0FBQVIsR0FBdEMsRUFBeUQ7QUFDeEQzSSxZQUFRO0FBQ1BnSixlQUFTLENBREY7QUFFUEMsa0JBQVksQ0FGTDtBQUdQQyxnQkFBVSxDQUhIO0FBSVBDLG1CQUFhO0FBSk47QUFEZ0QsR0FBekQsRUFPR2pWLE9BUEgsQ0FPVyxVQUFDb1YsU0FBRDtBQ21LUixXRGxLRkQsYUFBYUMsVUFBVTdNLEdBQXZCLElBQThCNk0sU0NrSzVCO0FEMUtIO0FBVUEsU0FBT0QsWUFBUDtBQVp5QixDQUExQjs7QUFjQSxJQUFHclcsT0FBT2tPLFFBQVY7QUFDQzNMLFlBQVVpRyxRQUFRLFNBQVIsQ0FBVjs7QUFDQWpJLFVBQVFnVyxZQUFSLEdBQXVCLFVBQUNqSCxHQUFELEVBQU1DLEdBQU47QUFDdEIsUUFBQXZJLFNBQUEsRUFBQWxILE9BQUE7QUFBQUEsY0FBVSxJQUFJeUMsT0FBSixDQUFZK00sR0FBWixFQUFpQkMsR0FBakIsQ0FBVjtBQUNBdkksZ0JBQVlzSSxJQUFJYSxPQUFKLENBQVksY0FBWixLQUErQnJRLFFBQVEyRyxHQUFSLENBQVksY0FBWixDQUEzQzs7QUFDQSxRQUFHLENBQUNPLFNBQUQsSUFBY3NJLElBQUlhLE9BQUosQ0FBWXFHLGFBQTFCLElBQTJDbEgsSUFBSWEsT0FBSixDQUFZcUcsYUFBWixDQUEwQjlFLEtBQTFCLENBQWdDLEdBQWhDLEVBQXFDLENBQXJDLE1BQTJDLFFBQXpGO0FBQ0MxSyxrQkFBWXNJLElBQUlhLE9BQUosQ0FBWXFHLGFBQVosQ0FBMEI5RSxLQUExQixDQUFnQyxHQUFoQyxFQUFxQyxDQUFyQyxDQUFaO0FDcUtFOztBRHBLSCxXQUFPMUssU0FBUDtBQUxzQixHQUF2QjtBQzRLQTs7QURyS0QsSUFBR2hILE9BQU9pRSxRQUFWO0FBQ0NqRSxTQUFPeVcsT0FBUCxDQUFlO0FBQ2QsUUFBR2pRLFFBQVFDLEdBQVIsQ0FBWSxnQkFBWixDQUFIO0FDd0tJLGFEdktIaVEsZUFBZS9RLE9BQWYsQ0FBdUIsZ0JBQXZCLEVBQXlDYSxRQUFRQyxHQUFSLENBQVksZ0JBQVosQ0FBekMsQ0N1S0c7QUFDRDtBRDFLSjs7QUFNQWxHLFVBQVFvVyxlQUFSLEdBQTBCO0FBQ3pCLFFBQUduUSxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFIO0FBQ0MsYUFBT0QsUUFBUUMsR0FBUixDQUFZLFFBQVosQ0FBUDtBQUREO0FBR0MsYUFBT2lRLGVBQWVoUixPQUFmLENBQXVCLGdCQUF2QixDQUFQO0FDdUtFO0FEM0tzQixHQUExQjtBQzZLQTs7QUR2S0QsSUFBRzFGLE9BQU9rTyxRQUFWO0FBQ0MzTixVQUFRcVcsV0FBUixHQUFzQixVQUFDQyxLQUFEO0FBQ3JCLFFBQUFDLFNBQUEsRUFBQUMsWUFBQSxFQUFBQyxNQUFBLEVBQUFuVSxHQUFBLEVBQUFDLElBQUEsRUFBQTJNLElBQUE7QUFBQXVILGFBQVM7QUFDRkMsa0JBQVk7QUFEVixLQUFUO0FBR0FGLG1CQUFBLEVBQUFsVSxNQUFBN0MsT0FBQUMsUUFBQSxhQUFBNkMsT0FBQUQsSUFBQXFVLFdBQUEsYUFBQXpILE9BQUEzTSxLQUFBLHNCQUFBMk0sS0FBc0QwSCxVQUF0RCxHQUFzRCxNQUF0RCxHQUFzRCxNQUF0RCxHQUFzRCxNQUF0RCxLQUFvRSxLQUFwRTs7QUFDQSxRQUFHSixZQUFIO0FBQ0MsVUFBR0YsTUFBTWxWLE1BQU4sR0FBZSxDQUFsQjtBQUNDbVYsb0JBQVlELE1BQU1PLElBQU4sQ0FBVyxHQUFYLENBQVo7QUFDQUosZUFBT2xXLElBQVAsR0FBY2dXLFNBQWQ7O0FBRUEsWUFBSUEsVUFBVW5WLE1BQVYsR0FBbUIsRUFBdkI7QUFDQ3FWLGlCQUFPbFcsSUFBUCxHQUFjZ1csVUFBVTlTLFNBQVYsQ0FBb0IsQ0FBcEIsRUFBc0IsRUFBdEIsQ0FBZDtBQUxGO0FBREQ7QUNrTEc7O0FEMUtILFdBQU9nVCxNQUFQO0FBYnFCLEdBQXRCO0FDMExBLEM7Ozs7Ozs7Ozs7O0FDbGtDRGhYLE1BQU0sQ0FBQ3FYLE9BQVAsQ0FBZSxZQUFZO0FBQzFCQyxjQUFZLENBQUNDLGFBQWIsQ0FBMkI7QUFBQ0MsZUFBVyxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUFkO0FBQXVDQyxjQUFVLEVBQUVILEtBQUssQ0FBQ0MsUUFBTixDQUFldlYsTUFBZjtBQUFuRCxHQUEzQjtBQUNBLENBRkQsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBR25DLE9BQU9rTyxRQUFWO0FBQ1FsTyxTQUFPNlgsT0FBUCxDQUNRO0FBQUFDLHlCQUFxQjtBQUNiLFVBQU8sS0FBQTlTLE1BQUEsUUFBUDtBQUNRO0FDQ3pCOztBQUNELGFEQWtCdEMsR0FBR29OLEtBQUgsQ0FBU2tCLE1BQVQsQ0FBZ0I7QUFBQ3ZILGFBQUssS0FBQ3pFO0FBQVAsT0FBaEIsRUFBZ0M7QUFBQytTLGNBQU07QUFBQ0Msc0JBQVksSUFBSXhOLElBQUo7QUFBYjtBQUFQLE9BQWhDLENDQWxCO0FESlU7QUFBQSxHQURSO0FDY1A7O0FETkQsSUFBR3hLLE9BQU9pRSxRQUFWO0FBQ1FrRCxXQUFTOFEsT0FBVCxDQUFpQjtBQ1NyQixXRFJRalksT0FBTzBTLElBQVAsQ0FBWSxxQkFBWixDQ1FSO0FEVEk7QUNXUCxDOzs7Ozs7Ozs7Ozs7QUNyQkQsSUFBRzFTLE9BQU9rTyxRQUFWO0FBQ0VsTyxTQUFPNlgsT0FBUCxDQUNFO0FBQUFLLHFCQUFpQixVQUFDQyxLQUFEO0FBQ2YsVUFBQXBULElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUN5RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDS0Q7O0FESkQsVUFBRyxDQUFJc08sS0FBUDtBQUNFLGVBQU87QUFBQzFQLGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUNTRDs7QURSRCxVQUFHLENBQUksMkZBQTJGaEcsSUFBM0YsQ0FBZ0dzVSxLQUFoRyxDQUFQO0FBQ0UsZUFBTztBQUFDMVAsaUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ2FEOztBRFpELFVBQUduSCxHQUFHb04sS0FBSCxDQUFTM0MsSUFBVCxDQUFjO0FBQUMsMEJBQWtCZ0w7QUFBbkIsT0FBZCxFQUF5Q0MsS0FBekMsS0FBaUQsQ0FBcEQ7QUFDRSxlQUFPO0FBQUMzUCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDbUJEOztBRGpCRDlFLGFBQU9yQyxHQUFHb04sS0FBSCxDQUFTaEwsT0FBVCxDQUFpQjtBQUFBMkUsYUFBSyxLQUFLekU7QUFBVixPQUFqQixDQUFQOztBQUNBLFVBQUdELEtBQUFzVCxNQUFBLFlBQWlCdFQsS0FBS3NULE1BQUwsQ0FBWTFXLE1BQVosR0FBcUIsQ0FBekM7QUFDRWUsV0FBR29OLEtBQUgsQ0FBU3dJLE1BQVQsQ0FBZ0J0SCxNQUFoQixDQUF1QjtBQUFDdkgsZUFBSyxLQUFLekU7QUFBWCxTQUF2QixFQUNFO0FBQUF1VCxpQkFDRTtBQUFBRixvQkFDRTtBQUFBRyx1QkFBU0wsS0FBVDtBQUNBTSx3QkFBVTtBQURWO0FBREY7QUFERixTQURGO0FBREY7QUFPRS9WLFdBQUdvTixLQUFILENBQVN3SSxNQUFULENBQWdCdEgsTUFBaEIsQ0FBdUI7QUFBQ3ZILGVBQUssS0FBS3pFO0FBQVgsU0FBdkIsRUFDRTtBQUFBK1MsZ0JBQ0U7QUFBQWhJLHdCQUFZb0ksS0FBWjtBQUNBRSxvQkFBUSxDQUNOO0FBQUFHLHVCQUFTTCxLQUFUO0FBQ0FNLHdCQUFVO0FBRFYsYUFETTtBQURSO0FBREYsU0FERjtBQ3NDRDs7QUQ5QkR0UixlQUFTdVIscUJBQVQsQ0FBK0IsS0FBSzFULE1BQXBDLEVBQTRDbVQsS0FBNUM7QUFFQSxhQUFPLEVBQVA7QUE1QkY7QUE4QkFRLHdCQUFvQixVQUFDUixLQUFEO0FBQ2xCLFVBQUFTLENBQUEsRUFBQTdULElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUN5RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDbUNEOztBRGxDRCxVQUFHLENBQUlzTyxLQUFQO0FBQ0UsZUFBTztBQUFDMVAsaUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ3VDRDs7QURyQ0Q5RSxhQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUI7QUFBQTJFLGFBQUssS0FBS3pFO0FBQVYsT0FBakIsQ0FBUDs7QUFDQSxVQUFHRCxLQUFBc1QsTUFBQSxZQUFpQnRULEtBQUtzVCxNQUFMLENBQVkxVyxNQUFaLElBQXNCLENBQTFDO0FBQ0VpWCxZQUFJLElBQUo7QUFDQTdULGFBQUtzVCxNQUFMLENBQVluWCxPQUFaLENBQW9CLFVBQUM0SCxDQUFEO0FBQ2xCLGNBQUdBLEVBQUUwUCxPQUFGLEtBQWFMLEtBQWhCO0FBQ0VTLGdCQUFJOVAsQ0FBSjtBQ3lDRDtBRDNDSDtBQUtBcEcsV0FBR29OLEtBQUgsQ0FBU3dJLE1BQVQsQ0FBZ0J0SCxNQUFoQixDQUF1QjtBQUFDdkgsZUFBSyxLQUFLekU7QUFBWCxTQUF2QixFQUNFO0FBQUE2VCxpQkFDRTtBQUFBUixvQkFDRU87QUFERjtBQURGLFNBREY7QUFQRjtBQVlFLGVBQU87QUFBQ25RLGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUMrQ0Q7O0FEN0NELGFBQU8sRUFBUDtBQW5ERjtBQXFEQWlQLHdCQUFvQixVQUFDWCxLQUFEO0FBQ2xCLFVBQU8sS0FBQW5ULE1BQUEsUUFBUDtBQUNFLGVBQU87QUFBQ3lELGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUNrREQ7O0FEakRELFVBQUcsQ0FBSXNPLEtBQVA7QUFDRSxlQUFPO0FBQUMxUCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDc0REOztBRHJERCxVQUFHLENBQUksMkZBQTJGaEcsSUFBM0YsQ0FBZ0dzVSxLQUFoRyxDQUFQO0FBQ0UsZUFBTztBQUFDMVAsaUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQzBERDs7QUR2REQxQyxlQUFTdVIscUJBQVQsQ0FBK0IsS0FBSzFULE1BQXBDLEVBQTRDbVQsS0FBNUM7QUFFQSxhQUFPLEVBQVA7QUFoRUY7QUFrRUFZLDZCQUF5QixVQUFDWixLQUFEO0FBQ3ZCLFVBQUFFLE1BQUEsRUFBQXRULElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUN5RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDNEREOztBRDNERCxVQUFHLENBQUlzTyxLQUFQO0FBQ0UsZUFBTztBQUFDMVAsaUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ2dFRDs7QUQ5REQ5RSxhQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUI7QUFBQTJFLGFBQUssS0FBS3pFO0FBQVYsT0FBakIsQ0FBUDtBQUNBcVQsZUFBU3RULEtBQUtzVCxNQUFkO0FBQ0FBLGFBQU9uWCxPQUFQLENBQWUsVUFBQzRILENBQUQ7QUFDYixZQUFHQSxFQUFFMFAsT0FBRixLQUFhTCxLQUFoQjtBQ2tFRSxpQkRqRUFyUCxFQUFFa1EsT0FBRixHQUFZLElDaUVaO0FEbEVGO0FDb0VFLGlCRGpFQWxRLEVBQUVrUSxPQUFGLEdBQVksS0NpRVo7QUFDRDtBRHRFSDtBQU1BdFcsU0FBR29OLEtBQUgsQ0FBU3dJLE1BQVQsQ0FBZ0J0SCxNQUFoQixDQUF1QjtBQUFDdkgsYUFBSyxLQUFLekU7QUFBWCxPQUF2QixFQUNFO0FBQUErUyxjQUNFO0FBQUFNLGtCQUFRQSxNQUFSO0FBQ0FGLGlCQUFPQTtBQURQO0FBREYsT0FERjtBQUtBelYsU0FBR3FLLFdBQUgsQ0FBZXVMLE1BQWYsQ0FBc0J0SCxNQUF0QixDQUE2QjtBQUFDak0sY0FBTSxLQUFLQztBQUFaLE9BQTdCLEVBQWlEO0FBQUMrUyxjQUFNO0FBQUNJLGlCQUFPQTtBQUFSO0FBQVAsT0FBakQsRUFBeUU7QUFBQ2MsZUFBTztBQUFSLE9BQXpFO0FBQ0EsYUFBTyxFQUFQO0FBdEZGO0FBQUEsR0FERjtBQ3VLRDs7QUQ1RUQsSUFBR2paLE9BQU9pRSxRQUFWO0FBQ0kxRCxVQUFRMlgsZUFBUixHQUEwQjtBQytFMUIsV0Q5RUkvVCxLQUNJO0FBQUFDLGFBQU9qRCxFQUFFLHNCQUFGLENBQVA7QUFDQW9ELFlBQU1wRCxFQUFFLGtDQUFGLENBRE47QUFFQXNELFlBQU0sT0FGTjtBQUdBeVUsd0JBQWtCLEtBSGxCO0FBSUFDLHNCQUFnQixLQUpoQjtBQUtBQyxpQkFBVztBQUxYLEtBREosRUFPRSxVQUFDQyxVQUFEO0FDK0VKLGFEOUVNclosT0FBTzBTLElBQVAsQ0FBWSxpQkFBWixFQUErQjJHLFVBQS9CLEVBQTJDLFVBQUM1USxLQUFELEVBQVFrSCxNQUFSO0FBQ3ZDLFlBQUFBLFVBQUEsT0FBR0EsT0FBUWxILEtBQVgsR0FBVyxNQUFYO0FDK0VOLGlCRDlFVUcsT0FBT0gsS0FBUCxDQUFha0gsT0FBTzlGLE9BQXBCLENDOEVWO0FEL0VNO0FDaUZOLGlCRDlFVTFGLEtBQUtoRCxFQUFFLHVCQUFGLENBQUwsRUFBaUMsRUFBakMsRUFBcUMsU0FBckMsQ0M4RVY7QUFDRDtBRG5GRyxRQzhFTjtBRHRGRSxNQzhFSjtBRC9FMEIsR0FBMUI7QUNnR0gsQyxDRGxGRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRTNHQSxJQUFHbkIsT0FBT2tPLFFBQVY7QUFDSWxPLFNBQU82WCxPQUFQLENBQ0k7QUFBQXlCLHNCQUFrQixVQUFDaFUsTUFBRDtBQUNWLFVBQU8sS0FBQU4sTUFBQSxRQUFQO0FBQ1E7QUNDakI7O0FBQ0QsYURBVXRDLEdBQUdvTixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUN2SCxhQUFLLEtBQUN6RTtBQUFQLE9BQWhCLEVBQWdDO0FBQUMrUyxjQUFNO0FBQUN6UyxrQkFBUUE7QUFBVDtBQUFQLE9BQWhDLENDQVY7QURKRTtBQUFBLEdBREo7QUNjSCxDOzs7Ozs7Ozs7OztBQ2ZENkIsUUFBUSxDQUFDb1MsY0FBVCxHQUEwQjtBQUN6QmhZLE1BQUksRUFBRyxZQUFVO0FBQ2hCLFFBQUlpWSxXQUFXLEdBQUcsdUNBQWxCO0FBQ0EsUUFBRyxDQUFDeFosTUFBTSxDQUFDQyxRQUFYLEVBQ0MsT0FBT3VaLFdBQVA7QUFFRCxRQUFHLENBQUN4WixNQUFNLENBQUNDLFFBQVAsQ0FBZ0JrWSxLQUFwQixFQUNDLE9BQU9xQixXQUFQO0FBRUQsUUFBRyxDQUFDeFosTUFBTSxDQUFDQyxRQUFQLENBQWdCa1ksS0FBaEIsQ0FBc0I1VyxJQUExQixFQUNDLE9BQU9pWSxXQUFQO0FBRUQsV0FBT3haLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQmtZLEtBQWhCLENBQXNCNVcsSUFBN0I7QUFDQSxHQVpLLEVBRG1CO0FBY3pCa1ksZUFBYSxFQUFFO0FBQ2RDLFdBQU8sRUFBRSxVQUFVM1UsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZGlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUMxQixVQUFJb1UsTUFBTSxHQUFHcFUsR0FBRyxDQUFDbU0sS0FBSixDQUFVLEdBQVYsQ0FBYjtBQUNBLFVBQUlrSSxTQUFTLEdBQUdELE1BQU0sQ0FBQ0EsTUFBTSxDQUFDaFksTUFBUCxHQUFjLENBQWYsQ0FBdEI7QUFDQSxVQUFJa1ksUUFBUSxHQUFHOVUsSUFBSSxDQUFDK1UsT0FBTCxJQUFnQi9VLElBQUksQ0FBQytVLE9BQUwsQ0FBYWhaLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDK1UsT0FBTCxDQUFhaFosSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPdVosUUFBUSxHQUFHLE1BQVgsR0FBb0J4VixPQUFPLENBQUNDLEVBQVIsQ0FBVyxpQ0FBWCxFQUE2QztBQUFDeVYsa0JBQVUsRUFBQ0g7QUFBWixPQUE3QyxFQUFvRTdVLElBQUksQ0FBQ3pFLE1BQXpFLENBQXBCLEdBQXVHLE1BQXZHLEdBQWdIaUYsR0FBaEgsR0FBc0gsTUFBdEgsR0FBK0hsQixPQUFPLENBQUNDLEVBQVIsQ0FBVyxvQkFBWCxFQUFnQyxFQUFoQyxFQUFtQ1MsSUFBSSxDQUFDekUsTUFBeEMsQ0FBL0gsR0FBaUwsSUFBeEw7QUFDQTtBQVRhLEdBZFU7QUF5QnpCMFosYUFBVyxFQUFFO0FBQ1pOLFdBQU8sRUFBRSxVQUFVM1UsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVywwQkFBWCxFQUFzQyxFQUF0QyxFQUF5Q1MsSUFBSSxDQUFDekUsTUFBOUMsQ0FBUDtBQUNBLEtBSFc7QUFJWmlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUMxQixVQUFJc1UsUUFBUSxHQUFHOVUsSUFBSSxDQUFDK1UsT0FBTCxJQUFnQi9VLElBQUksQ0FBQytVLE9BQUwsQ0FBYWhaLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDK1UsT0FBTCxDQUFhaFosSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPdVosUUFBUSxHQUFHLE1BQVgsR0FBb0J4VixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBcEIsR0FBOEUsTUFBOUUsR0FBdUZpRixHQUF2RixHQUE2RixNQUE3RixHQUFzR2xCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUN6RSxNQUF4QyxDQUF0RyxHQUF3SixJQUEvSjtBQUNBO0FBUFcsR0F6Qlk7QUFrQ3pCMlosZUFBYSxFQUFFO0FBQ2RQLFdBQU8sRUFBRSxVQUFVM1UsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZGlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCUSxHQUFoQixFQUFxQjtBQUMxQixVQUFJc1UsUUFBUSxHQUFHOVUsSUFBSSxDQUFDK1UsT0FBTCxJQUFnQi9VLElBQUksQ0FBQytVLE9BQUwsQ0FBYWhaLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDK1UsT0FBTCxDQUFhaFosSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPdVosUUFBUSxHQUFHLE1BQVgsR0FBb0J4VixPQUFPLENBQUNDLEVBQVIsQ0FBVywyQkFBWCxFQUF1QyxFQUF2QyxFQUEwQ1MsSUFBSSxDQUFDekUsTUFBL0MsQ0FBcEIsR0FBNkUsTUFBN0UsR0FBc0ZpRixHQUF0RixHQUE0RixNQUE1RixHQUFxR2xCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUN6RSxNQUF4QyxDQUFyRyxHQUF1SixJQUE5SjtBQUNBO0FBUGE7QUFsQ1UsQ0FBMUIsQzs7Ozs7Ozs7Ozs7QUNBQTtBQUNBMlIsVUFBVSxDQUFDaUksR0FBWCxDQUFlLEtBQWYsRUFBc0IsNkJBQXRCLEVBQXFELFVBQVU1SyxHQUFWLEVBQWVDLEdBQWYsRUFBb0I4RCxJQUFwQixFQUEwQjtBQUU5RSxNQUFJOEcsSUFBSSxHQUFHelgsRUFBRSxDQUFDa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQ2lOLFlBQVEsRUFBQyxLQUFWO0FBQWdCdFosUUFBSSxFQUFDO0FBQUN1WixTQUFHLEVBQUM7QUFBTDtBQUFyQixHQUF0QixDQUFYOztBQUNBLE1BQUlGLElBQUksQ0FBQy9CLEtBQUwsS0FBYSxDQUFqQixFQUNBO0FBQ0MrQixRQUFJLENBQUNqWixPQUFMLENBQWMsVUFBVTROLEdBQVYsRUFDZDtBQUNDO0FBQ0FwTSxRQUFFLENBQUNrSyxhQUFILENBQWlCMEwsTUFBakIsQ0FBd0J0SCxNQUF4QixDQUErQmxDLEdBQUcsQ0FBQ3JGLEdBQW5DLEVBQXdDO0FBQUNzTyxZQUFJLEVBQUU7QUFBQ3FDLGtCQUFRLEVBQUV0TCxHQUFHLENBQUN3TCxpQkFBSjtBQUFYO0FBQVAsT0FBeEM7QUFFQSxLQUxEO0FBTUE7O0FBRUNySSxZQUFVLENBQUNDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUEyQjtBQUN6QjRDLFFBQUksRUFBRTtBQUNIb0ksU0FBRyxFQUFFLENBREY7QUFFSEMsU0FBRyxFQUFFO0FBRkY7QUFEbUIsR0FBM0I7QUFNRixDQW5CRCxFOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFHeGEsT0FBTytILFNBQVY7QUFDUS9ILFNBQU9xWCxPQUFQLENBQWU7QUNDbkIsV0RBWW9ELEtBQUtDLFNBQUwsQ0FDUTtBQUFBMU8sZUFDUTtBQUFBMk8sa0JBQVU5VCxPQUFPK1QsaUJBQWpCO0FBQ0FDLGVBQU8sSUFEUDtBQUVBQyxpQkFBUztBQUZULE9BRFI7QUFJQUMsV0FDUTtBQUFBQyxlQUFPLElBQVA7QUFDQUMsb0JBQVksSUFEWjtBQUVBSixlQUFPLElBRlA7QUFHQUssZUFBTztBQUhQLE9BTFI7QUFTQUMsZUFBUztBQVRULEtBRFIsQ0NBWjtBRERJO0FDZ0JQLEM7Ozs7Ozs7Ozs7OztBQ2pCREMsV0FBVyxFQUFYOztBQUdBQSxTQUFTQyx1QkFBVCxHQUFtQyxVQUFDclcsTUFBRDtBQUNsQyxNQUFBc1csUUFBQSxFQUFBaFIsTUFBQSxFQUFBdkYsSUFBQTs7QUFBQSxNQUFHL0UsT0FBT2lFLFFBQVY7QUFDQ2UsYUFBU2hGLE9BQU9nRixNQUFQLEVBQVQ7O0FBQ0EsU0FBT0EsTUFBUDtBQUNDLGFBQU87QUFBQ3lFLGFBQUssQ0FBQztBQUFQLE9BQVA7QUNLRTs7QURKSCxRQUFHbEosUUFBUThKLFlBQVIsRUFBSDtBQUNDLGFBQU87QUFBQ0QsZUFBTzVELFFBQVFDLEdBQVIsQ0FBWSxTQUFaO0FBQVIsT0FBUDtBQUREO0FBR0MsYUFBTztBQUFDZ0QsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQVBGO0FDa0JFOztBRFRGLE1BQUd6SixPQUFPa08sUUFBVjtBQUNDLFNBQU9sSixNQUFQO0FBQ0MsYUFBTztBQUFDeUUsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ2FFOztBRFpIMUUsV0FBT3JDLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCRSxNQUFqQixFQUF5QjtBQUFDZ0ksY0FBUTtBQUFDdU8sdUJBQWU7QUFBaEI7QUFBVCxLQUF6QixDQUFQOztBQUNBLFFBQUcsQ0FBQ3hXLElBQUo7QUFDQyxhQUFPO0FBQUMwRSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDb0JFOztBRG5CSDZSLGVBQVcsRUFBWDs7QUFDQSxRQUFHLENBQUN2VyxLQUFLd1csYUFBVDtBQUNDalIsZUFBUzVILEdBQUc0SCxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQ2dCLGdCQUFPO0FBQUNmLGVBQUksQ0FBQ3BJLE1BQUQ7QUFBTDtBQUFSLE9BQWYsRUFBd0M7QUFBQ2dJLGdCQUFRO0FBQUN2RCxlQUFLO0FBQU47QUFBVCxPQUF4QyxFQUE0RDRELEtBQTVELEVBQVQ7QUFDQS9DLGVBQVNBLE9BQU9rUixHQUFQLENBQVcsVUFBQ0MsQ0FBRDtBQUFPLGVBQU9BLEVBQUVoUyxHQUFUO0FBQWxCLFFBQVQ7QUFDQTZSLGVBQVNsUixLQUFULEdBQWlCO0FBQUNnRCxhQUFLOUM7QUFBTixPQUFqQjtBQ2lDRTs7QURoQ0gsV0FBT2dSLFFBQVA7QUNrQ0M7QUR2RGdDLENBQW5DOztBQXdCQUYsU0FBU00sa0JBQVQsR0FBOEIsVUFBQzFXLE1BQUQ7QUFDN0IsTUFBQXNXLFFBQUEsRUFBQXJSLE9BQUEsRUFBQThDLFdBQUEsRUFBQXpDLE1BQUEsRUFBQXZGLElBQUE7O0FBQUEsTUFBRy9FLE9BQU9pRSxRQUFWO0FBQ0NlLGFBQVNoRixPQUFPZ0YsTUFBUCxFQUFUOztBQUNBLFNBQU9BLE1BQVA7QUFDQyxhQUFPO0FBQUN5RSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDc0NFOztBRHJDSFEsY0FBVXpELFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVY7O0FBQ0EsUUFBR3dELE9BQUg7QUFDQyxVQUFHdkgsR0FBR3FLLFdBQUgsQ0FBZWpJLE9BQWYsQ0FBdUI7QUFBQ0MsY0FBTUMsTUFBUDtBQUFjb0YsZUFBT0g7QUFBckIsT0FBdkIsRUFBc0Q7QUFBQytDLGdCQUFRO0FBQUN2RCxlQUFLO0FBQU47QUFBVCxPQUF0RCxDQUFIO0FBQ0MsZUFBTztBQUFDVyxpQkFBT0g7QUFBUixTQUFQO0FBREQ7QUFHQyxlQUFPO0FBQUNSLGVBQUssQ0FBQztBQUFQLFNBQVA7QUFKRjtBQUFBO0FBTUMsYUFBTztBQUFDQSxhQUFLLENBQUM7QUFBUCxPQUFQO0FBWEY7QUNpRUU7O0FEcERGLE1BQUd6SixPQUFPa08sUUFBVjtBQUNDLFNBQU9sSixNQUFQO0FBQ0MsYUFBTztBQUFDeUUsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ3dERTs7QUR2REgxRSxXQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUJFLE1BQWpCLEVBQXlCO0FBQUNnSSxjQUFRO0FBQUN2RCxhQUFLO0FBQU47QUFBVCxLQUF6QixDQUFQOztBQUNBLFFBQUcsQ0FBQzFFLElBQUo7QUFDQyxhQUFPO0FBQUMwRSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDK0RFOztBRDlESDZSLGVBQVcsRUFBWDtBQUNBdk8sa0JBQWNySyxHQUFHcUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUNwSSxZQUFNQztBQUFQLEtBQXBCLEVBQW9DO0FBQUNnSSxjQUFRO0FBQUM1QyxlQUFPO0FBQVI7QUFBVCxLQUFwQyxFQUEwRGlELEtBQTFELEVBQWQ7QUFDQS9DLGFBQVMsRUFBVDs7QUFDQTJDLE1BQUVyQyxJQUFGLENBQU9tQyxXQUFQLEVBQW9CLFVBQUM0TyxDQUFEO0FDc0VoQixhRHJFSHJSLE9BQU9qSixJQUFQLENBQVlzYSxFQUFFdlIsS0FBZCxDQ3FFRztBRHRFSjs7QUFFQWtSLGFBQVNsUixLQUFULEdBQWlCO0FBQUNnRCxXQUFLOUM7QUFBTixLQUFqQjtBQUNBLFdBQU9nUixRQUFQO0FDeUVDO0FEbkcyQixDQUE5Qjs7QUE0QkE1WSxHQUFHa1osbUJBQUgsQ0FBdUJDLFdBQXZCLEdBQ0M7QUFBQUMsUUFBTSxPQUFOO0FBQ0FDLFNBQU8sTUFEUDtBQUVBQyxnQkFBYyxDQUNiO0FBQUNsYixVQUFNO0FBQVAsR0FEYSxFQUViO0FBQUNBLFVBQU07QUFBUCxHQUZhLEVBR2I7QUFBQ0EsVUFBTTtBQUFQLEdBSGEsRUFJYjtBQUFDQSxVQUFNO0FBQVAsR0FKYSxFQUtiO0FBQUNBLFVBQU07QUFBUCxHQUxhLEVBTWI7QUFBQ0EsVUFBTTtBQUFQLEdBTmEsQ0FGZDtBQVVBbWIsZUFBYSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFdBQTdCLENBVmI7QUFXQUMsZUFBYSxRQVhiO0FBWUFaLFlBQVUsVUFBQ3RXLE1BQUQ7QUFDVCxRQUFHaEYsT0FBT2lFLFFBQVY7QUFDQyxVQUFHMUQsUUFBUThKLFlBQVIsRUFBSDtBQUNDLGVBQU87QUFBQ0QsaUJBQU81RCxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFSO0FBQWdDMFYsZ0JBQU07QUFBdEMsU0FBUDtBQUREO0FBR0MsZUFBTztBQUFDMVMsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQUpGO0FDNEZHOztBRHRGSCxRQUFHekosT0FBT2tPLFFBQVY7QUFDQyxhQUFPLEVBQVA7QUN3RkU7QUQ1R0o7QUFxQkFrTyxrQkFBZ0IsS0FyQmhCO0FBc0JBQyxpQkFBZSxLQXRCZjtBQXVCQUMsY0FBWSxJQXZCWjtBQXdCQUMsY0FBWSxHQXhCWjtBQXlCQUMsU0FBTyxDQUFDLENBQUMsQ0FBRCxFQUFJLE1BQUosQ0FBRDtBQXpCUCxDQUREO0FBNEJBeGMsT0FBT3FYLE9BQVAsQ0FBZTtBQUNkLE9BQUNvRixnQkFBRCxHQUFvQi9aLEdBQUcrWixnQkFBdkI7QUFDQSxPQUFDYixtQkFBRCxHQUF1QmxaLEdBQUdrWixtQkFBMUI7QUMyRkMsU0FBTyxPQUFPYyxXQUFQLEtBQXVCLFdBQXZCLElBQXNDQSxnQkFBZ0IsSUFBdEQsR0QxRlJBLFlBQWFDLGVBQWIsQ0FDQztBQUFBRixzQkFBa0IvWixHQUFHK1osZ0JBQUgsQ0FBb0JaLFdBQXRDO0FBQ0FELHlCQUFxQmxaLEdBQUdrWixtQkFBSCxDQUF1QkM7QUFENUMsR0FERCxDQzBGUSxHRDFGUixNQzBGQztBRDdGRixHOzs7Ozs7Ozs7OztBRW5GQSxJQUFJLENBQUMsR0FBRzNaLFFBQVIsRUFBa0I7QUFDaEIvQixPQUFLLENBQUNDLFNBQU4sQ0FBZ0I4QixRQUFoQixHQUEyQixVQUFTMGE7QUFBYztBQUF2QixJQUF5QztBQUNsRTs7QUFDQSxRQUFJQyxDQUFDLEdBQUcxYSxNQUFNLENBQUMsSUFBRCxDQUFkO0FBQ0EsUUFBSXlPLEdBQUcsR0FBRzZELFFBQVEsQ0FBQ29JLENBQUMsQ0FBQ2xiLE1BQUgsQ0FBUixJQUFzQixDQUFoQzs7QUFDQSxRQUFJaVAsR0FBRyxLQUFLLENBQVosRUFBZTtBQUNiLGFBQU8sS0FBUDtBQUNEOztBQUNELFFBQUk2SyxDQUFDLEdBQUdoSCxRQUFRLENBQUNoQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQVIsSUFBMEIsQ0FBbEM7QUFDQSxRQUFJeFIsQ0FBSjs7QUFDQSxRQUFJd2EsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNWeGEsT0FBQyxHQUFHd2EsQ0FBSjtBQUNELEtBRkQsTUFFTztBQUNMeGEsT0FBQyxHQUFHMlAsR0FBRyxHQUFHNkssQ0FBVjs7QUFDQSxVQUFJeGEsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUFDQSxTQUFDLEdBQUcsQ0FBSjtBQUFPO0FBQ3BCOztBQUNELFFBQUk2YixjQUFKOztBQUNBLFdBQU83YixDQUFDLEdBQUcyUCxHQUFYLEVBQWdCO0FBQ2RrTSxvQkFBYyxHQUFHRCxDQUFDLENBQUM1YixDQUFELENBQWxCOztBQUNBLFVBQUkyYixhQUFhLEtBQUtFLGNBQWxCLElBQ0FGLGFBQWEsS0FBS0EsYUFBbEIsSUFBbUNFLGNBQWMsS0FBS0EsY0FEMUQsRUFDMkU7QUFDekUsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0Q3YixPQUFDO0FBQ0Y7O0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0F6QkQ7QUEwQkQsQzs7Ozs7Ozs7Ozs7O0FDM0JEakIsT0FBT3FYLE9BQVAsQ0FBZTtBQUNiOVcsVUFBUU4sUUFBUixDQUFpQjhjLFdBQWpCLEdBQStCL2MsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUI4YyxXQUF0RDs7QUFFQSxNQUFHLENBQUN4YyxRQUFRTixRQUFSLENBQWlCOGMsV0FBckI7QUNBRSxXRENBeGMsUUFBUU4sUUFBUixDQUFpQjhjLFdBQWpCLEdBQ0U7QUFBQUMsV0FDRTtBQUFBQyxnQkFBUSxRQUFSO0FBQ0ExWCxhQUFLO0FBREw7QUFERixLQ0ZGO0FBTUQ7QURUSCxHOzs7Ozs7Ozs7Ozs7QUVBQWtRLFFBQVF5SCx1QkFBUixHQUFrQyxVQUFDbFksTUFBRCxFQUFTaUYsT0FBVCxFQUFrQmtULE9BQWxCO0FBQ2pDLE1BQUFDLHVCQUFBLEVBQUFDLElBQUEsRUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBRCxjQUFZLEVBQVo7QUFFQUQsU0FBT3BRLEVBQUVvUSxJQUFGLENBQU9GLE9BQVAsQ0FBUDtBQUVBSSxpQkFBZTlILFFBQVErSCxhQUFSLENBQXNCLGtCQUF0QixFQUEwQ3JRLElBQTFDLENBQStDO0FBQzdEc1EsaUJBQWE7QUFBQ3JRLFdBQUtpUTtBQUFOLEtBRGdEO0FBRTdEalQsV0FBT0gsT0FGc0Q7QUFHN0QsV0FBTyxDQUFDO0FBQUN5VCxhQUFPMVk7QUFBUixLQUFELEVBQWtCO0FBQUMyWSxjQUFRO0FBQVQsS0FBbEI7QUFIc0QsR0FBL0MsRUFJWjtBQUNGM1EsWUFBUTtBQUNQZ0osZUFBUyxDQURGO0FBRVBFLGdCQUFVLENBRkg7QUFHUEQsa0JBQVksQ0FITDtBQUlQRSxtQkFBYTtBQUpOO0FBRE4sR0FKWSxFQVdaOUksS0FYWSxFQUFmOztBQWFBK1AsNEJBQTBCLFVBQUNLLFdBQUQ7QUFDekIsUUFBQUcsdUJBQUEsRUFBQUMsVUFBQTs7QUFBQUQsOEJBQTBCLEVBQTFCO0FBQ0FDLGlCQUFhNVEsRUFBRTRCLE1BQUYsQ0FBUzBPLFlBQVQsRUFBdUIsVUFBQ08sRUFBRDtBQUNuQyxhQUFPQSxHQUFHTCxXQUFILEtBQWtCQSxXQUF6QjtBQURZLE1BQWI7O0FBR0F4USxNQUFFckMsSUFBRixDQUFPaVQsVUFBUCxFQUFtQixVQUFDRSxRQUFEO0FDUWYsYURQSEgsd0JBQXdCRyxTQUFTdFUsR0FBakMsSUFBd0NzVSxRQ09yQztBRFJKOztBQUdBLFdBQU9ILHVCQUFQO0FBUnlCLEdBQTFCOztBQVVBM1EsSUFBRS9MLE9BQUYsQ0FBVWljLE9BQVYsRUFBbUIsVUFBQ2EsQ0FBRCxFQUFJL1ksR0FBSjtBQUNsQixRQUFBZ1osU0FBQTtBQUFBQSxnQkFBWWIsd0JBQXdCblksR0FBeEIsQ0FBWjs7QUFDQSxRQUFHLENBQUNnSSxFQUFFNkcsT0FBRixDQUFVbUssU0FBVixDQUFKO0FDU0ksYURSSFgsVUFBVXJZLEdBQVYsSUFBaUJnWixTQ1FkO0FBQ0Q7QURaSjs7QUFJQSxTQUFPWCxTQUFQO0FBaENpQyxDQUFsQzs7QUFtQ0E3SCxRQUFReUksc0JBQVIsR0FBaUMsVUFBQ2xaLE1BQUQsRUFBU2lGLE9BQVQsRUFBa0J3VCxXQUFsQjtBQUNoQyxNQUFBRyx1QkFBQSxFQUFBTyxlQUFBOztBQUFBUCw0QkFBMEIsRUFBMUI7QUFFQU8sb0JBQWtCMUksUUFBUStILGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDclEsSUFBMUMsQ0FBK0M7QUFDaEVzUSxpQkFBYUEsV0FEbUQ7QUFFaEVyVCxXQUFPSCxPQUZ5RDtBQUdoRSxXQUFPLENBQUM7QUFBQ3lULGFBQU8xWTtBQUFSLEtBQUQsRUFBa0I7QUFBQzJZLGNBQVE7QUFBVCxLQUFsQjtBQUh5RCxHQUEvQyxFQUlmO0FBQ0YzUSxZQUFRO0FBQ1BnSixlQUFTLENBREY7QUFFUEUsZ0JBQVUsQ0FGSDtBQUdQRCxrQkFBWSxDQUhMO0FBSVBFLG1CQUFhO0FBSk47QUFETixHQUplLENBQWxCO0FBYUFnSSxrQkFBZ0JqZCxPQUFoQixDQUF3QixVQUFDNmMsUUFBRDtBQ2dCckIsV0RmRkgsd0JBQXdCRyxTQUFTdFUsR0FBakMsSUFBd0NzVSxRQ2V0QztBRGhCSDtBQUdBLFNBQU9ILHVCQUFQO0FBbkJnQyxDQUFqQyxDOzs7Ozs7Ozs7OztBRW5DQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSxROzs7Ozs7Ozs7Ozs7QUMzSEEzTCxXQUFXaUksR0FBWCxDQUFlLEtBQWYsRUFBc0IsZUFBdEIsRUFBdUMsVUFBQzVLLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUN0QyxNQUFBekwsSUFBQSxFQUFBa0IsQ0FBQSxFQUFBeEksTUFBQSxFQUFBdUMsR0FBQSxFQUFBQyxJQUFBLEVBQUE2UyxRQUFBLEVBQUFyTCxNQUFBLEVBQUF2RixJQUFBLEVBQUFxWixPQUFBOztBQUFBO0FBQ0NBLGNBQVU5TyxJQUFJYSxPQUFKLENBQVksV0FBWixPQUFBdE4sTUFBQXlNLElBQUFPLEtBQUEsWUFBQWhOLElBQXVDbUMsTUFBdkMsR0FBdUMsTUFBdkMsQ0FBVjtBQUVBMlEsZUFBV3JHLElBQUlhLE9BQUosQ0FBWSxZQUFaLE9BQUFyTixPQUFBd00sSUFBQU8sS0FBQSxZQUFBL00sS0FBd0NtSCxPQUF4QyxHQUF3QyxNQUF4QyxDQUFYO0FBRUFsRixXQUFPeEUsUUFBUThPLGVBQVIsQ0FBd0JDLEdBQXhCLEVBQTZCQyxHQUE3QixDQUFQOztBQUVBLFFBQUcsQ0FBQ3hLLElBQUo7QUFDQ2tOLGlCQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQztBQUFBNkMsY0FBTSxHQUFOO0FBQ0FELGNBQ0M7QUFBQSxtQkFBUyxvREFBVDtBQUNBLHFCQUFXO0FBRFg7QUFGRCxPQUREO0FBS0E7QUNDRTs7QURDSGlNLGNBQVVyWixLQUFLMEUsR0FBZjtBQUdBNFUsa0JBQWNDLFFBQWQsQ0FBdUIzSSxRQUF2QjtBQUVBclYsYUFBU29DLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCO0FBQUMyRSxXQUFJMlU7QUFBTCxLQUFqQixFQUFnQzlkLE1BQXpDOztBQUNBLFFBQUdBLFdBQVUsT0FBYjtBQUNDQSxlQUFTLElBQVQ7QUNBRTs7QURDSCxRQUFHQSxXQUFVLE9BQWI7QUFDQ0EsZUFBUyxPQUFUO0FDQ0U7O0FEQ0hnSyxhQUFTNUgsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDcEksWUFBTXFaO0FBQVAsS0FBcEIsRUFBcUMvUSxLQUFyQyxHQUE2Q3JNLFdBQTdDLENBQXlELE9BQXpELENBQVQ7QUFDQTRHLFdBQU9sRixHQUFHa0YsSUFBSCxDQUFRdUYsSUFBUixDQUFhO0FBQUNvUixXQUFLLENBQUM7QUFBQ25VLGVBQU87QUFBQ29VLG1CQUFTO0FBQVY7QUFBUixPQUFELEVBQTRCO0FBQUNwVSxlQUFPO0FBQUNnRCxlQUFJOUM7QUFBTDtBQUFSLE9BQTVCO0FBQU4sS0FBYixFQUF1RTtBQUFDOUosWUFBSztBQUFDQSxjQUFLO0FBQU47QUFBTixLQUF2RSxFQUF3RjZNLEtBQXhGLEVBQVA7QUFFQXpGLFNBQUsxRyxPQUFMLENBQWEsVUFBQ3dHLEdBQUQ7QUNrQlQsYURqQkhBLElBQUk1RyxJQUFKLEdBQVd1RCxRQUFRQyxFQUFSLENBQVdvRCxJQUFJNUcsSUFBZixFQUFvQixFQUFwQixFQUF1QlIsTUFBdkIsQ0NpQlI7QURsQko7QUNvQkUsV0RqQkYyUixXQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQztBQUFBNkMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFBRThLLGdCQUFRLFNBQVY7QUFBcUI5SyxjQUFNdks7QUFBM0I7QUFETixLQURELENDaUJFO0FEakRILFdBQUFhLEtBQUE7QUFtQ01LLFFBQUFMLEtBQUE7QUFDTG1CLFlBQVFuQixLQUFSLENBQWNLLEVBQUVnQixLQUFoQjtBQ3VCRSxXRHRCRm1JLFdBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNDO0FBQUE2QyxZQUFNLEdBQU47QUFDQUQsWUFBTTtBQUFFc00sZ0JBQVEsQ0FBQztBQUFDQyx3QkFBYzVWLEVBQUVlO0FBQWpCLFNBQUQ7QUFBVjtBQUROLEtBREQsQ0NzQkU7QUFVRDtBRHRFSCxHOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFBdEgsT0FBQSxFQUFBb2MsV0FBQTtBQUFBcGMsVUFBVWlHLFFBQVEsU0FBUixDQUFWO0FBQ0FtVyxjQUFjblcsUUFBUSxlQUFSLENBQWQ7QUFFQXlKLFdBQVdpSSxHQUFYLENBQWUsTUFBZixFQUF1QixzQkFBdkIsRUFBK0MsVUFBQzVLLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUMzQyxNQUFBdUwsWUFBQSxFQUFBNVgsU0FBQSxFQUFBbEgsT0FBQSxFQUFBcVMsSUFBQSxFQUFBckosQ0FBQSxFQUFBK1YsS0FBQSxFQUFBQyxPQUFBLEVBQUF4RCxRQUFBLEVBQUFsUixLQUFBLEVBQUFwRixNQUFBLEVBQUErWixXQUFBOztBQUFBO0FBQ0lqZixjQUFVLElBQUl5QyxPQUFKLENBQWErTSxHQUFiLEVBQWtCQyxHQUFsQixDQUFWO0FBQ0F2SSxnQkFBWXNJLElBQUkzQixJQUFKLENBQVMsY0FBVCxLQUE0QjdOLFFBQVEyRyxHQUFSLENBQVksY0FBWixDQUF4Qzs7QUFFQSxRQUFHLENBQUNPLFNBQUo7QUFDSWlMLGlCQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQTtBQUFBNkMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUywwQ0FBVDtBQUNBLHNCQUFZLFlBRFo7QUFFQSxxQkFBVztBQUZYO0FBRkosT0FEQTtBQU1BO0FDTVA7O0FESkcwTSxZQUFRdlAsSUFBSTNCLElBQUosQ0FBU2tSLEtBQWpCO0FBQ0F2RCxlQUFXaE0sSUFBSTNCLElBQUosQ0FBUzJOLFFBQXBCO0FBQ0F3RCxjQUFVeFAsSUFBSTNCLElBQUosQ0FBU21SLE9BQW5CO0FBQ0ExVSxZQUFRa0YsSUFBSTNCLElBQUosQ0FBU3ZELEtBQWpCO0FBQ0ErSCxXQUFPLEVBQVA7QUFDQXlNLG1CQUFlLENBQUMsYUFBRCxFQUFnQixlQUFoQixFQUFpQyxZQUFqQyxFQUErQyxPQUEvQyxDQUFmOztBQUVBLFFBQUcsQ0FBQ3hVLEtBQUo7QUFDSTZILGlCQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQTtBQUFBNkMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUIvSCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNPUDs7QURKR2tFLFVBQU1sRSxLQUFOLEVBQWE0VSxNQUFiO0FBQ0ExUSxVQUFNdEgsU0FBTixFQUFpQmdZLE1BQWpCO0FBQ0FELGtCQUFjL2UsT0FBT2lmLFNBQVAsQ0FBaUIsVUFBQ2pZLFNBQUQsRUFBWWlELE9BQVosRUFBcUJpVixFQUFyQjtBQ01qQyxhRExNUCxZQUFZUSxVQUFaLENBQXVCblksU0FBdkIsRUFBa0NpRCxPQUFsQyxFQUEyQ21WLElBQTNDLENBQWdELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQ01wRCxlRExRSixHQUFHSSxNQUFILEVBQVdELE9BQVgsQ0NLUjtBRE5JLFFDS047QUROZ0IsT0FHUnJZLFNBSFEsRUFHR29ELEtBSEgsQ0FBZDs7QUFJQSxTQUFPMlUsV0FBUDtBQUNJOU0saUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNJO0FBQUE2QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLGFBQVQ7QUFDQSxxQkFBVztBQURYO0FBRkosT0FESjtBQUtBO0FDU1A7O0FEUkduTixhQUFTK1osWUFBWS9aLE1BQXJCOztBQUVBLFFBQUcsQ0FBQzRaLGFBQWExYyxRQUFiLENBQXNCMmMsS0FBdEIsQ0FBSjtBQUNJNU0saUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNBO0FBQUE2QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQjBNLEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ1dQOztBRFRHLFFBQUcsQ0FBQ25jLEdBQUdtYyxLQUFILENBQUo7QUFDSTVNLGlCQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQTtBQUFBNkMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUIwTSxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNhUDs7QURYRyxRQUFHLENBQUN2RCxRQUFKO0FBQ0lBLGlCQUFXLEVBQVg7QUNhUDs7QURYRyxRQUFHLENBQUN3RCxPQUFKO0FBQ0lBLGdCQUFVLEVBQVY7QUNhUDs7QURYR3hELGFBQVNsUixLQUFULEdBQWlCQSxLQUFqQjtBQUVBK0gsV0FBT3pQLEdBQUdtYyxLQUFILEVBQVUxUixJQUFWLENBQWVtTyxRQUFmLEVBQXlCd0QsT0FBekIsRUFBa0N6UixLQUFsQyxFQUFQO0FDWUosV0RWSTRFLFdBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNJO0FBQUE2QyxZQUFNLEdBQU47QUFDQUQsWUFBTUE7QUFETixLQURKLENDVUo7QURoRkEsV0FBQTFKLEtBQUE7QUF5RU1LLFFBQUFMLEtBQUE7QUFDRm1CLFlBQVFuQixLQUFSLENBQWNLLEVBQUVnQixLQUFoQjtBQ2FKLFdEWkltSSxXQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDSTtBQUFBNkMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFETixLQURKLENDWUo7QUFJRDtBRDVGSDtBQWlGQUYsV0FBV2lJLEdBQVgsQ0FBZSxNQUFmLEVBQXVCLHlCQUF2QixFQUFrRCxVQUFDNUssR0FBRCxFQUFNQyxHQUFOLEVBQVc4RCxJQUFYO0FBQzlDLE1BQUF1TCxZQUFBLEVBQUE1WCxTQUFBLEVBQUFsSCxPQUFBLEVBQUFxUyxJQUFBLEVBQUFySixDQUFBLEVBQUErVixLQUFBLEVBQUFDLE9BQUEsRUFBQXhELFFBQUEsRUFBQWxSLEtBQUEsRUFBQXBGLE1BQUEsRUFBQStaLFdBQUE7O0FBQUE7QUFDSWpmLGNBQVUsSUFBSXlDLE9BQUosQ0FBYStNLEdBQWIsRUFBa0JDLEdBQWxCLENBQVY7QUFDQXZJLGdCQUFZc0ksSUFBSTNCLElBQUosQ0FBUyxjQUFULEtBQTRCN04sUUFBUTJHLEdBQVIsQ0FBWSxjQUFaLENBQXhDOztBQUVBLFFBQUcsQ0FBQ08sU0FBSjtBQUNJaUwsaUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNBO0FBQUE2QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLDBDQUFUO0FBQ0Esc0JBQVksWUFEWjtBQUVBLHFCQUFXO0FBRlg7QUFGSixPQURBO0FBTUE7QUNpQlA7O0FEZkcwTSxZQUFRdlAsSUFBSTNCLElBQUosQ0FBU2tSLEtBQWpCO0FBQ0F2RCxlQUFXaE0sSUFBSTNCLElBQUosQ0FBUzJOLFFBQXBCO0FBQ0F3RCxjQUFVeFAsSUFBSTNCLElBQUosQ0FBU21SLE9BQW5CO0FBQ0ExVSxZQUFRa0YsSUFBSTNCLElBQUosQ0FBU3ZELEtBQWpCO0FBQ0ErSCxXQUFPLEVBQVA7QUFDQXlNLG1CQUFlLENBQUMsYUFBRCxFQUFnQixlQUFoQixFQUFpQyxZQUFqQyxFQUErQyxlQUEvQyxFQUFnRSxPQUFoRSxDQUFmOztBQUVBLFFBQUcsQ0FBQ3hVLEtBQUo7QUFDSTZILGlCQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDQTtBQUFBNkMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUIvSCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNrQlA7O0FEZkdrRSxVQUFNbEUsS0FBTixFQUFhNFUsTUFBYjtBQUNBMVEsVUFBTXRILFNBQU4sRUFBaUJnWSxNQUFqQjtBQUNBRCxrQkFBYy9lLE9BQU9pZixTQUFQLENBQWlCLFVBQUNqWSxTQUFELEVBQVlpRCxPQUFaLEVBQXFCaVYsRUFBckI7QUNpQmpDLGFEaEJNUCxZQUFZUSxVQUFaLENBQXVCblksU0FBdkIsRUFBa0NpRCxPQUFsQyxFQUEyQ21WLElBQTNDLENBQWdELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQ2lCcEQsZURoQlFKLEdBQUdJLE1BQUgsRUFBV0QsT0FBWCxDQ2dCUjtBRGpCSSxRQ2dCTjtBRGpCZ0IsT0FHUnJZLFNBSFEsRUFHR29ELEtBSEgsQ0FBZDs7QUFJQSxTQUFPMlUsV0FBUDtBQUNJOU0saUJBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNJO0FBQUE2QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLGFBQVQ7QUFDQSxxQkFBVztBQURYO0FBRkosT0FESjtBQUtBO0FDb0JQOztBRG5CR25OLGFBQVMrWixZQUFZL1osTUFBckI7O0FBRUEsUUFBRyxDQUFDNFosYUFBYTFjLFFBQWIsQ0FBc0IyYyxLQUF0QixDQUFKO0FBQ0k1TSxpQkFBV0MsVUFBWCxDQUFzQjNDLEdBQXRCLEVBQ0E7QUFBQTZDLGNBQU0sR0FBTjtBQUNBRCxjQUNJO0FBQUEsbUJBQVMsbUJBQW1CME0sS0FBNUI7QUFDQSxxQkFBVztBQURYO0FBRkosT0FEQTtBQUtBO0FDc0JQOztBRHBCRyxRQUFHLENBQUNuYyxHQUFHbWMsS0FBSCxDQUFKO0FBQ0k1TSxpQkFBV0MsVUFBWCxDQUFzQjNDLEdBQXRCLEVBQ0E7QUFBQTZDLGNBQU0sR0FBTjtBQUNBRCxjQUNJO0FBQUEsbUJBQVMsbUJBQW1CME0sS0FBNUI7QUFDQSxxQkFBVztBQURYO0FBRkosT0FEQTtBQUtBO0FDd0JQOztBRHRCRyxRQUFHLENBQUN2RCxRQUFKO0FBQ0lBLGlCQUFXLEVBQVg7QUN3QlA7O0FEdEJHLFFBQUcsQ0FBQ3dELE9BQUo7QUFDSUEsZ0JBQVUsRUFBVjtBQ3dCUDs7QUR0QkcsUUFBR0QsVUFBUyxlQUFaO0FBQ0l2RCxpQkFBVyxFQUFYO0FBQ0FBLGVBQVNvQyxLQUFULEdBQWlCMVksTUFBakI7QUFDQW1OLGFBQU96UCxHQUFHbWMsS0FBSCxFQUFVL1osT0FBVixDQUFrQndXLFFBQWxCLENBQVA7QUFISjtBQUtJQSxlQUFTbFIsS0FBVCxHQUFpQkEsS0FBakI7QUFFQStILGFBQU96UCxHQUFHbWMsS0FBSCxFQUFVL1osT0FBVixDQUFrQndXLFFBQWxCLEVBQTRCd0QsT0FBNUIsQ0FBUDtBQ3VCUDs7QUFDRCxXRHRCSTdNLFdBQVdDLFVBQVgsQ0FBc0IzQyxHQUF0QixFQUNJO0FBQUE2QyxZQUFNLEdBQU47QUFDQUQsWUFBTUE7QUFETixLQURKLENDc0JKO0FEakdBLFdBQUExSixLQUFBO0FBOEVNSyxRQUFBTCxLQUFBO0FBQ0ZtQixZQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEI7QUN5QkosV0R4QkltSSxXQUFXQyxVQUFYLENBQXNCM0MsR0FBdEIsRUFDSTtBQUFBNkMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFETixLQURKLENDd0JKO0FBSUQ7QUQ3R0gsRzs7Ozs7Ozs7Ozs7O0FFcEZBLElBQUE1UCxPQUFBLEVBQUFDLE1BQUEsRUFBQStjLE9BQUE7QUFBQS9jLFNBQVNnRyxRQUFRLFFBQVIsQ0FBVDtBQUNBakcsVUFBVWlHLFFBQVEsU0FBUixDQUFWO0FBQ0ErVyxVQUFVL1csUUFBUSxTQUFSLENBQVY7QUFFQXlKLFdBQVdpSSxHQUFYLENBQWUsS0FBZixFQUFzQix3QkFBdEIsRUFBZ0QsVUFBQzVLLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUUvQyxNQUFBM0wsR0FBQSxFQUFBVixTQUFBLEVBQUF3SixDQUFBLEVBQUFXLE1BQUEsRUFBQUMsV0FBQSxFQUFBdFIsT0FBQSxFQUFBMGYsVUFBQSxFQUFBQyxlQUFBLEVBQUFDLE1BQUEsRUFBQUMsaUJBQUEsRUFBQXZQLFdBQUEsRUFBQW5CLENBQUEsRUFBQXNCLEVBQUEsRUFBQXFQLE1BQUEsRUFBQWpQLEtBQUEsRUFBQWtQLElBQUEsRUFBQWpQLEdBQUEsRUFBQXhQLENBQUEsRUFBQWtULEdBQUEsRUFBQXdMLFdBQUEsRUFBQUMsU0FBQSxFQUFBeEwsTUFBQSxFQUFBeEUsVUFBQSxFQUFBeUUsYUFBQSxFQUFBelAsSUFBQSxFQUFBQyxNQUFBO0FBQUEwQyxRQUFNaEYsR0FBR2tGLElBQUgsQ0FBUTlDLE9BQVIsQ0FBZ0J3SyxJQUFJMFEsTUFBSixDQUFXeFksTUFBM0IsQ0FBTjs7QUFDQSxNQUFHRSxHQUFIO0FBQ0M2TSxhQUFTN00sSUFBSTZNLE1BQWI7QUFDQXVMLGtCQUFjcFksSUFBSW5DLEdBQWxCO0FBRkQ7QUFJQ2dQLGFBQVMsa0JBQVQ7QUFDQXVMLGtCQUFjeFEsSUFBSTBRLE1BQUosQ0FBV0YsV0FBekI7QUNLQzs7QURIRixNQUFHLENBQUNBLFdBQUo7QUFDQ3ZRLFFBQUkwUSxTQUFKLENBQWMsR0FBZDtBQUNBMVEsUUFBSTJRLEdBQUo7QUFDQTtBQ0tDOztBREhGcGdCLFlBQVUsSUFBSXlDLE9BQUosQ0FBYStNLEdBQWIsRUFBa0JDLEdBQWxCLENBQVY7O0FBWUEsTUFBRyxDQUFDdkssTUFBRCxJQUFZLENBQUNnQyxTQUFoQjtBQUNDaEMsYUFBU3NLLElBQUlPLEtBQUosQ0FBVSxXQUFWLENBQVQ7QUFDQTdJLGdCQUFZc0ksSUFBSU8sS0FBSixDQUFVLGNBQVYsQ0FBWjtBQ05DOztBRFFGLE1BQUc3SyxVQUFXZ0MsU0FBZDtBQUNDb0osa0JBQWNqSixTQUFTa0osZUFBVCxDQUF5QnJKLFNBQXpCLENBQWQ7QUFDQWpDLFdBQU8vRSxPQUFPOFAsS0FBUCxDQUFhaEwsT0FBYixDQUNOO0FBQUEyRSxXQUFLekUsTUFBTDtBQUNBLGlEQUEyQ29MO0FBRDNDLEtBRE0sQ0FBUDs7QUFHQSxRQUFHckwsSUFBSDtBQUNDZ0wsbUJBQWFoTCxLQUFLZ0wsVUFBbEI7O0FBQ0EsVUFBR3JJLElBQUk2TSxNQUFQO0FBQ0NoRSxhQUFLN0ksSUFBSTZNLE1BQVQ7QUFERDtBQUdDaEUsYUFBSyxrQkFBTDtBQ0xHOztBRE1KK0QsWUFBTUcsU0FBUyxJQUFJakssSUFBSixHQUFXMkksT0FBWCxLQUFxQixJQUE5QixFQUFvQzlQLFFBQXBDLEVBQU47QUFDQXNOLGNBQVEsRUFBUjtBQUNBQyxZQUFNYixXQUFXcE8sTUFBakI7O0FBQ0EsVUFBR2lQLE1BQU0sRUFBVDtBQUNDSixZQUFJLEVBQUo7QUFDQXZCLFlBQUksQ0FBSjtBQUNBN04sWUFBSSxLQUFLd1AsR0FBVDs7QUFDQSxlQUFNM0IsSUFBSTdOLENBQVY7QUFDQ29QLGNBQUksTUFBTUEsQ0FBVjtBQUNBdkI7QUFGRDs7QUFHQTBCLGdCQUFRWixhQUFhUyxDQUFyQjtBQVBELGFBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELGdCQUFRWixXQUFXck8sS0FBWCxDQUFpQixDQUFqQixFQUFtQixFQUFuQixDQUFSO0FDSEc7O0FES0p5UCxlQUFTM08sT0FBTzZPLGNBQVAsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBSVAsTUFBSixDQUFXSCxLQUFYLEVBQWtCLE1BQWxCLENBQXJDLEVBQWdFLElBQUlHLE1BQUosQ0FBV1AsRUFBWCxFQUFlLE1BQWYsQ0FBaEUsQ0FBVDtBQUVBYSxvQkFBY04sT0FBT0MsTUFBUCxDQUFjLENBQUNJLE9BQU9ILE1BQVAsQ0FBYyxJQUFJRixNQUFKLENBQVd3RCxHQUFYLEVBQWdCLE1BQWhCLENBQWQsQ0FBRCxFQUF5Q25ELE9BQU9GLEtBQVAsRUFBekMsQ0FBZCxDQUFkO0FBRUF1RCxzQkFBZ0JwRCxZQUFZL04sUUFBWixDQUFxQixRQUFyQixDQUFoQjtBQUdBcWMsZUFBUyxVQUFUO0FBQ0FHLGFBQU8sRUFBUDtBQUNBalAsWUFBTWIsV0FBV3BPLE1BQWpCOztBQUNBLFVBQUdpUCxNQUFNLENBQVQ7QUFDQ0osWUFBSSxFQUFKO0FBQ0F2QixZQUFJLENBQUo7QUFDQTdOLFlBQUksSUFBSXdQLEdBQVI7O0FBQ0EsZUFBTTNCLElBQUk3TixDQUFWO0FBQ0NvUCxjQUFJLE1BQU1BLENBQVY7QUFDQXZCO0FBRkQ7O0FBR0E0USxlQUFPOVAsYUFBYVMsQ0FBcEI7QUFQRCxhQVFLLElBQUdJLE9BQU8sQ0FBVjtBQUNKaVAsZUFBTzlQLFdBQVdyTyxLQUFYLENBQWlCLENBQWpCLEVBQW1CLENBQW5CLENBQVA7QUNORzs7QURPSjhkLG1CQUFhaGQsT0FBTzZPLGNBQVAsQ0FBc0IsU0FBdEIsRUFBaUMsSUFBSVAsTUFBSixDQUFXK08sSUFBWCxFQUFpQixNQUFqQixDQUFqQyxFQUEyRCxJQUFJL08sTUFBSixDQUFXNE8sTUFBWCxFQUFtQixNQUFuQixDQUEzRCxDQUFiO0FBQ0FELHdCQUFrQjNPLE9BQU9DLE1BQVAsQ0FBYyxDQUFDeU8sV0FBV3hPLE1BQVgsQ0FBa0IsSUFBSUYsTUFBSixDQUFXd0QsR0FBWCxFQUFnQixNQUFoQixDQUFsQixDQUFELEVBQTZDa0wsV0FBV3ZPLEtBQVgsRUFBN0MsQ0FBZCxDQUFsQjtBQUNBME8sMEJBQW9CRixnQkFBZ0JwYyxRQUFoQixDQUF5QixRQUF6QixDQUFwQjtBQUVBdWMsZUFBUyxHQUFUOztBQUVBLFVBQUdFLFlBQVl6WSxPQUFaLENBQW9CLEdBQXBCLElBQTJCLENBQUMsQ0FBL0I7QUFDQ3VZLGlCQUFTLEdBQVQ7QUNQRzs7QURTSkcsa0JBQVlELGNBQWNGLE1BQWQsR0FBdUIsWUFBdkIsR0FBc0M1YSxNQUF0QyxHQUErQyxnQkFBL0MsR0FBa0VnQyxTQUFsRSxHQUE4RSxvQkFBOUUsR0FBcUcrSSxVQUFyRyxHQUFrSCx1QkFBbEgsR0FBNEl5RSxhQUE1SSxHQUE0SixxQkFBNUosR0FBb0xtTCxpQkFBaE07O0FBRUEsVUFBRzVhLEtBQUs2SyxRQUFSO0FBQ0NtUSxxQkFBYSx5QkFBdUJJLFVBQVVwYixLQUFLNkssUUFBZixDQUFwQztBQ1JHOztBRFNKTCxVQUFJNlEsU0FBSixDQUFjLFVBQWQsRUFBMEJMLFNBQTFCO0FBQ0F4USxVQUFJMFEsU0FBSixDQUFjLEdBQWQ7QUFDQTFRLFVBQUkyUSxHQUFKO0FBQ0E7QUE3REY7QUN1REU7O0FEUUYzUSxNQUFJMFEsU0FBSixDQUFjLEdBQWQ7QUFDQTFRLE1BQUkyUSxHQUFKO0FBL0ZELEc7Ozs7Ozs7Ozs7OztBRUpBbGdCLE9BQU9xWCxPQUFQLENBQWU7QUNDYixTRENEcEYsV0FBV2lJLEdBQVgsQ0FBZSxLQUFmLEVBQXNCLGlCQUF0QixFQUF5QyxVQUFDNUssR0FBRCxFQUFNQyxHQUFOLEVBQVc4RCxJQUFYO0FBR3hDLFFBQUEwSSxLQUFBLEVBQUFzRSxXQUFBLEVBQUFDLE1BQUEsRUFBQUMsUUFBQSxFQUFBeFYsTUFBQSxFQUFBeVYsUUFBQSxFQUFBQyxRQUFBLEVBQUE1ZCxHQUFBLEVBQUFDLElBQUEsRUFBQTJNLElBQUEsRUFBQWlSLGlCQUFBLEVBQUFDLEdBQUEsRUFBQTViLElBQUEsRUFBQTZLLFFBQUEsRUFBQWdSLGNBQUEsRUFBQUMsS0FBQTtBQUFBQSxZQUFRLEVBQVI7QUFDQTlWLGFBQVMsRUFBVDtBQUNBd1YsZUFBVyxFQUFYOztBQUNBLFFBQUdqUixJQUFJTyxLQUFKLENBQVVpUixDQUFiO0FBQ0lELGNBQVF2UixJQUFJTyxLQUFKLENBQVVpUixDQUFsQjtBQ0REOztBREVILFFBQUd4UixJQUFJTyxLQUFKLENBQVUvTixDQUFiO0FBQ0lpSixlQUFTdUUsSUFBSU8sS0FBSixDQUFVL04sQ0FBbkI7QUNBRDs7QURDSCxRQUFHd04sSUFBSU8sS0FBSixDQUFVa1IsRUFBYjtBQUNVUixpQkFBV2pSLElBQUlPLEtBQUosQ0FBVWtSLEVBQXJCO0FDQ1A7O0FEQ0hoYyxXQUFPckMsR0FBR29OLEtBQUgsQ0FBU2hMLE9BQVQsQ0FBaUJ3SyxJQUFJMFEsTUFBSixDQUFXaGIsTUFBNUIsQ0FBUDs7QUFDQSxRQUFHLENBQUNELElBQUo7QUFDQ3dLLFVBQUkwUSxTQUFKLENBQWMsR0FBZDtBQUNBMVEsVUFBSTJRLEdBQUo7QUFDQTtBQ0NFOztBRENILFFBQUduYixLQUFLTyxNQUFSO0FBQ0NpSyxVQUFJNlEsU0FBSixDQUFjLFVBQWQsRUFBMEIzSyxRQUFRdUwsY0FBUixDQUF1Qix1QkFBdUJqYyxLQUFLTyxNQUFuRCxDQUExQjtBQUNBaUssVUFBSTBRLFNBQUosQ0FBYyxHQUFkO0FBQ0ExUSxVQUFJMlEsR0FBSjtBQUNBO0FDQ0U7O0FEQ0gsU0FBQXJkLE1BQUFrQyxLQUFBK1UsT0FBQSxZQUFBalgsSUFBaUJ5QyxNQUFqQixHQUFpQixNQUFqQjtBQUNDaUssVUFBSTZRLFNBQUosQ0FBYyxVQUFkLEVBQTBCcmIsS0FBSytVLE9BQUwsQ0FBYXhVLE1BQXZDO0FBQ0FpSyxVQUFJMFEsU0FBSixDQUFjLEdBQWQ7QUFDQTFRLFVBQUkyUSxHQUFKO0FBQ0E7QUNDRTs7QURDSCxRQUFHbmIsS0FBS2tjLFNBQVI7QUFDQzFSLFVBQUk2USxTQUFKLENBQWMsVUFBZCxFQUEwQnJiLEtBQUtrYyxTQUEvQjtBQUNBMVIsVUFBSTBRLFNBQUosQ0FBYyxHQUFkO0FBQ0ExUSxVQUFJMlEsR0FBSjtBQUNBO0FDQ0U7O0FEQ0gsUUFBTyxPQUFBZ0IsSUFBQSxvQkFBQUEsU0FBQSxJQUFQO0FBQ0MzUixVQUFJNlEsU0FBSixDQUFjLHFCQUFkLEVBQXFDLFFBQXJDO0FBQ0E3USxVQUFJNlEsU0FBSixDQUFjLGNBQWQsRUFBOEIsZUFBOUI7QUFDQTdRLFVBQUk2USxTQUFKLENBQWMsZUFBZCxFQUErQiwwQkFBL0I7QUFDQU8sWUFBTSxpOEJBQU47QUFzQkFwUixVQUFJNFIsS0FBSixDQUFVUixHQUFWO0FBR0FwUixVQUFJMlEsR0FBSjtBQUNBO0FDdEJFOztBRHdCSHRRLGVBQVc3SyxLQUFLakUsSUFBaEI7O0FBQ0EsUUFBRyxDQUFDOE8sUUFBSjtBQUNDQSxpQkFBVyxFQUFYO0FDdEJFOztBRHdCSEwsUUFBSTZRLFNBQUosQ0FBYyxxQkFBZCxFQUFxQyxRQUFyQzs7QUFFQSxRQUFPLE9BQUFjLElBQUEsb0JBQUFBLFNBQUEsSUFBUDtBQUNDM1IsVUFBSTZRLFNBQUosQ0FBYyxjQUFkLEVBQThCLGVBQTlCO0FBQ0E3USxVQUFJNlEsU0FBSixDQUFjLGVBQWQsRUFBK0IsMEJBQS9CO0FBRUFFLGVBQVMsQ0FBQyxTQUFELEVBQVcsU0FBWCxFQUFxQixTQUFyQixFQUErQixTQUEvQixFQUF5QyxTQUF6QyxFQUFtRCxTQUFuRCxFQUE2RCxTQUE3RCxFQUF1RSxTQUF2RSxFQUFpRixTQUFqRixFQUEyRixTQUEzRixFQUFxRyxTQUFyRyxFQUErRyxTQUEvRyxFQUF5SCxTQUF6SCxFQUFtSSxTQUFuSSxFQUE2SSxTQUE3SSxFQUF1SixTQUF2SixFQUFpSyxTQUFqSyxFQUEySyxTQUEzSyxDQUFUO0FBRUFNLHVCQUFpQnpnQixNQUFNb0IsSUFBTixDQUFXcU8sUUFBWCxDQUFqQjtBQUNBeVEsb0JBQWMsQ0FBZDs7QUFDQXBULFFBQUVyQyxJQUFGLENBQU9nVyxjQUFQLEVBQXVCLFVBQUNRLElBQUQ7QUN6QmxCLGVEMEJKZixlQUFlZSxLQUFLQyxVQUFMLENBQWdCLENBQWhCLENDMUJYO0FEeUJMOztBQUdBWixpQkFBV0osY0FBY0MsT0FBTzNlLE1BQWhDO0FBQ0FvYSxjQUFRdUUsT0FBT0csUUFBUCxDQUFSO0FBR0FELGlCQUFXLEVBQVg7O0FBQ0EsVUFBRzVRLFNBQVN5UixVQUFULENBQW9CLENBQXBCLElBQXVCLEdBQTFCO0FBQ0NiLG1CQUFXNVEsU0FBUzBSLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBWDtBQUREO0FBR0NkLG1CQUFXNVEsU0FBUzBSLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBWDtBQzNCRzs7QUQ2QkpkLGlCQUFXQSxTQUFTZSxXQUFULEVBQVg7QUFFQVosWUFBTSw2SUFFaUVFLEtBRmpFLEdBRXVFLGNBRnZFLEdBRW1GOVYsTUFGbkYsR0FFMEYsb0JBRjFGLEdBRTRHOFYsS0FGNUcsR0FFa0gsY0FGbEgsR0FFZ0k5VixNQUZoSSxHQUV1SSx3QkFGdkksR0FFK0pnUixLQUYvSixHQUVxSyxtUEFGckssR0FHd053RSxRQUh4TixHQUdpTyxZQUhqTyxHQUlGQyxRQUpFLEdBSU8sb0JBSmI7QUFTQWpSLFVBQUk0UixLQUFKLENBQVVSLEdBQVY7QUFDQXBSLFVBQUkyUSxHQUFKO0FBQ0E7QUNwQ0U7O0FEc0NIUSx3QkFBb0JwUixJQUFJYSxPQUFKLENBQVksbUJBQVosQ0FBcEI7O0FBQ0EsUUFBR3VRLHFCQUFBLElBQUg7QUFDQyxVQUFHQSx1QkFBQSxDQUFBNWQsT0FBQWlDLEtBQUFtUixRQUFBLFlBQUFwVCxLQUFvQzBlLFdBQXBDLEtBQXFCLE1BQXJCLENBQUg7QUFDQ2pTLFlBQUk2USxTQUFKLENBQWMsZUFBZCxFQUErQk0saUJBQS9CO0FBQ0FuUixZQUFJMFEsU0FBSixDQUFjLEdBQWQ7QUFDQTFRLFlBQUkyUSxHQUFKO0FBQ0E7QUFMRjtBQzlCRzs7QURxQ0gzUSxRQUFJNlEsU0FBSixDQUFjLGVBQWQsSUFBQTNRLE9BQUExSyxLQUFBbVIsUUFBQSxZQUFBekcsS0FBOEMrUixXQUE5QyxLQUErQixNQUEvQixLQUErRCxJQUFJaFgsSUFBSixHQUFXZ1gsV0FBWCxFQUEvRDtBQUNBalMsUUFBSTZRLFNBQUosQ0FBYyxjQUFkLEVBQThCLFlBQTlCO0FBQ0E3USxRQUFJNlEsU0FBSixDQUFjLGdCQUFkLEVBQWdDYyxLQUFLdmYsTUFBckM7QUFFQXVmLFNBQUtPLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCblMsR0FBckI7QUEzSEQsSUNEQztBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBdlAsT0FBT3FYLE9BQVAsQ0FBZTtBQ0NiLFNEQURwRixXQUFXaUksR0FBWCxDQUFlLEtBQWYsRUFBc0IsbUJBQXRCLEVBQTJDLFVBQUM1SyxHQUFELEVBQU1DLEdBQU4sRUFBVzhELElBQVg7QUFFMUMsUUFBQTlCLFlBQUEsRUFBQTFPLEdBQUE7QUFBQTBPLG1CQUFBLENBQUExTyxNQUFBeU0sSUFBQU8sS0FBQSxZQUFBaE4sSUFBMEIwTyxZQUExQixHQUEwQixNQUExQjs7QUFFQSxRQUFHaFIsUUFBUStRLHdCQUFSLENBQWlDQyxZQUFqQyxDQUFIO0FBQ0NoQyxVQUFJMFEsU0FBSixDQUFjLEdBQWQ7QUFDQTFRLFVBQUkyUSxHQUFKO0FBRkQ7QUFLQzNRLFVBQUkwUSxTQUFKLENBQWMsR0FBZDtBQUNBMVEsVUFBSTJRLEdBQUo7QUNERTtBRFRKLElDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFHbGdCLE9BQU9rTyxRQUFWO0FBQ0lsTyxTQUFPMmhCLE9BQVAsQ0FBZSxNQUFmLEVBQXVCLFVBQUMxWCxPQUFEO0FBQ25CLFFBQUFxUixRQUFBOztBQUFBLFNBQU8sS0FBS3RXLE1BQVo7QUFDSSxhQUFPLEtBQUs0YyxLQUFMLEVBQVA7QUNFUDs7QURDR3RHLGVBQVc7QUFBQ2xSLGFBQU87QUFBQ29VLGlCQUFTO0FBQVY7QUFBUixLQUFYOztBQUNBLFFBQUd2VSxPQUFIO0FBQ0lxUixpQkFBVztBQUFDaUQsYUFBSyxDQUFDO0FBQUNuVSxpQkFBTztBQUFDb1UscUJBQVM7QUFBVjtBQUFSLFNBQUQsRUFBNEI7QUFBQ3BVLGlCQUFPSDtBQUFSLFNBQTVCO0FBQU4sT0FBWDtBQ2VQOztBRGJHLFdBQU92SCxHQUFHa0YsSUFBSCxDQUFRdUYsSUFBUixDQUFhbU8sUUFBYixFQUF1QjtBQUFDOWEsWUFBTTtBQUFDQSxjQUFNO0FBQVA7QUFBUCxLQUF2QixDQUFQO0FBVEo7QUM2QkgsQzs7Ozs7Ozs7Ozs7O0FDMUJBUixPQUFPMmhCLE9BQVAsQ0FBZSxXQUFmLEVBQTRCO0FBQzNCLE1BQUFFLE1BQUEsRUFBQUMsT0FBQSxFQUFBQyxhQUFBLEVBQUFDLElBQUEsRUFBQUMsR0FBQSxFQUFBQyxVQUFBOztBQUFBLE9BQU8sS0FBS2xkLE1BQVo7QUFDQyxXQUFPLEtBQUs0YyxLQUFMLEVBQVA7QUNGQTs7QURLREksU0FBTyxJQUFQO0FBQ0FFLGVBQWEsRUFBYjtBQUNBRCxRQUFNdmYsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDcEksVUFBTSxLQUFLQyxNQUFaO0FBQW9CbWQsbUJBQWU7QUFBbkMsR0FBcEIsRUFBOEQ7QUFBQ25WLFlBQVE7QUFBQzVDLGFBQU07QUFBUDtBQUFULEdBQTlELENBQU47QUFDQTZYLE1BQUkvZ0IsT0FBSixDQUFZLFVBQUNraEIsRUFBRDtBQ0lWLFdESERGLFdBQVc3Z0IsSUFBWCxDQUFnQitnQixHQUFHaFksS0FBbkIsQ0NHQztBREpGO0FBR0EwWCxZQUFVLElBQVY7QUFHQUQsV0FBU25mLEdBQUdxSyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQ3BJLFVBQU0sS0FBS0MsTUFBWjtBQUFvQm1kLG1CQUFlO0FBQW5DLEdBQXBCLEVBQThERSxPQUE5RCxDQUNSO0FBQUFDLFdBQU8sVUFBQ0MsR0FBRDtBQUNOLFVBQUdBLElBQUluWSxLQUFQO0FBQ0MsWUFBRzhYLFdBQVc3YSxPQUFYLENBQW1Ca2IsSUFBSW5ZLEtBQXZCLElBQWdDLENBQW5DO0FBQ0M4WCxxQkFBVzdnQixJQUFYLENBQWdCa2hCLElBQUluWSxLQUFwQjtBQ0tJLGlCREpKMlgsZUNJSTtBRFBOO0FDU0c7QURWSjtBQUtBUyxhQUFTLFVBQUNDLE1BQUQ7QUFDUixVQUFHQSxPQUFPclksS0FBVjtBQUNDNFgsYUFBS1EsT0FBTCxDQUFhLFFBQWIsRUFBdUJDLE9BQU9yWSxLQUE5QjtBQ1FHLGVEUEg4WCxhQUFhalYsRUFBRXlWLE9BQUYsQ0FBVVIsVUFBVixFQUFzQk8sT0FBT3JZLEtBQTdCLENDT1Y7QUFDRDtBRGhCSjtBQUFBLEdBRFEsQ0FBVDs7QUFXQTJYLGtCQUFnQjtBQUNmLFFBQUdELE9BQUg7QUFDQ0EsY0FBUWEsSUFBUjtBQ1VDOztBQUNELFdEVkRiLFVBQVVwZixHQUFHNEgsTUFBSCxDQUFVNkMsSUFBVixDQUFlO0FBQUMxRCxXQUFLO0FBQUMyRCxhQUFLOFU7QUFBTjtBQUFOLEtBQWYsRUFBeUNHLE9BQXpDLENBQ1Q7QUFBQUMsYUFBTyxVQUFDQyxHQUFEO0FBQ05QLGFBQUtNLEtBQUwsQ0FBVyxRQUFYLEVBQXFCQyxJQUFJOVksR0FBekIsRUFBOEI4WSxHQUE5QjtBQ2VHLGVEZEhMLFdBQVc3Z0IsSUFBWCxDQUFnQmtoQixJQUFJOVksR0FBcEIsQ0NjRztBRGhCSjtBQUdBbVosZUFBUyxVQUFDQyxNQUFELEVBQVNKLE1BQVQ7QUNnQkwsZURmSFQsS0FBS1ksT0FBTCxDQUFhLFFBQWIsRUFBdUJDLE9BQU9wWixHQUE5QixFQUFtQ29aLE1BQW5DLENDZUc7QURuQko7QUFLQUwsZUFBUyxVQUFDQyxNQUFEO0FBQ1JULGFBQUtRLE9BQUwsQ0FBYSxRQUFiLEVBQXVCQyxPQUFPaFosR0FBOUI7QUNpQkcsZURoQkh5WSxhQUFhalYsRUFBRXlWLE9BQUYsQ0FBVVIsVUFBVixFQUFzQk8sT0FBT2haLEdBQTdCLENDZ0JWO0FEdkJKO0FBQUEsS0FEUyxDQ1VUO0FEYmMsR0FBaEI7O0FBYUFzWTtBQUVBQyxPQUFLSixLQUFMO0FDa0JBLFNEaEJBSSxLQUFLYyxNQUFMLENBQVk7QUFDWGpCLFdBQU9jLElBQVA7O0FBQ0EsUUFBR2IsT0FBSDtBQ2lCRyxhRGhCRkEsUUFBUWEsSUFBUixFQ2dCRTtBQUNEO0FEcEJILElDZ0JBO0FEMURELEc7Ozs7Ozs7Ozs7OztBRUhEM2lCLE9BQU8yaEIsT0FBUCxDQUFlLGNBQWYsRUFBK0IsVUFBQzFYLE9BQUQ7QUFDOUIsT0FBT0EsT0FBUDtBQUNDLFdBQU8sS0FBSzJYLEtBQUwsRUFBUDtBQ0FDOztBREVGLFNBQU9sZixHQUFHNEgsTUFBSCxDQUFVNkMsSUFBVixDQUFlO0FBQUMxRCxTQUFLUTtBQUFOLEdBQWYsRUFBK0I7QUFBQytDLFlBQVE7QUFBQzFILGNBQVEsQ0FBVDtBQUFXeEUsWUFBTSxDQUFqQjtBQUFtQmlpQix1QkFBZ0I7QUFBbkM7QUFBVCxHQUEvQixDQUFQO0FBSkQsRzs7Ozs7Ozs7Ozs7O0FFREEvaUIsT0FBTzJoQixPQUFQLENBQWUsU0FBZixFQUEwQjtBQUN6QixPQUFPLEtBQUszYyxNQUFaO0FBQ0MsV0FBTyxLQUFLNGMsS0FBTCxFQUFQO0FDQ0M7O0FEQ0YsU0FBT2xmLEdBQUc2TCxPQUFILENBQVdwQixJQUFYLEVBQVA7QUFKRCxHOzs7Ozs7Ozs7Ozs7QUVBQW5OLE9BQU8yaEIsT0FBUCxDQUFlLDZCQUFmLEVBQThDLFVBQUNsWSxHQUFEO0FBQzdDLE9BQU8sS0FBS3pFLE1BQVo7QUFDQyxXQUFPLEtBQUs0YyxLQUFMLEVBQVA7QUNDQzs7QURDRixPQUFPblksR0FBUDtBQUNDLFdBQU8sS0FBS21ZLEtBQUwsRUFBUDtBQ0NDOztBRENGLFNBQU9sZixHQUFHa1osbUJBQUgsQ0FBdUJ6TyxJQUF2QixDQUE0QjtBQUFDMUQsU0FBS0E7QUFBTixHQUE1QixDQUFQO0FBUEQsRzs7Ozs7Ozs7Ozs7O0FFQUF3SSxXQUFXaUksR0FBWCxDQUFlLE1BQWYsRUFBdUIsOEJBQXZCLEVBQXVELFVBQUM1SyxHQUFELEVBQU1DLEdBQU4sRUFBVzhELElBQVg7QUFDdEQsTUFBQTFGLElBQUEsRUFBQTdFLENBQUE7O0FBQUE7QUFDQzZFLFdBQU8sRUFBUDtBQUNBMkIsUUFBSTBULEVBQUosQ0FBTyxNQUFQLEVBQWUsVUFBQ0MsS0FBRDtBQ0VYLGFEREh0VixRQUFRc1YsS0NDTDtBREZKO0FBR0EzVCxRQUFJMFQsRUFBSixDQUFPLEtBQVAsRUFBY2hqQixPQUFPa2pCLGVBQVAsQ0FBd0I7QUFDcEMsVUFBQUMsTUFBQSxFQUFBQyxNQUFBO0FBQUFBLGVBQVM1YSxRQUFRLFFBQVIsQ0FBVDtBQUNBMmEsZUFBUyxJQUFJQyxPQUFPQyxNQUFYLENBQWtCO0FBQUV2TyxjQUFLLElBQVA7QUFBYXdPLHVCQUFjLEtBQTNCO0FBQWtDQyxzQkFBYTtBQUEvQyxPQUFsQixDQUFUO0FDT0UsYURORkosT0FBT0ssV0FBUCxDQUFtQjdWLElBQW5CLEVBQXlCLFVBQUM4VixHQUFELEVBQU05VCxNQUFOO0FBRXZCLFlBQUErVCxLQUFBLEVBQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLElBQUEsRUFBQUMsS0FBQTtBQUFBTCxnQkFBUWxiLFFBQVEsWUFBUixDQUFSO0FBQ0F1YixnQkFBUUwsTUFBTTtBQUNiTSxpQkFBT2hrQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QjhqQixLQURsQjtBQUViQyxrQkFBUWprQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QitqQixNQUZuQjtBQUdiQyx1QkFBYWxrQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QmdrQjtBQUh4QixTQUFOLENBQVI7QUFLQUosZUFBT0MsTUFBTUQsSUFBTixDQUFXN1csRUFBRWtYLEtBQUYsQ0FBUXhVLE1BQVIsQ0FBWCxDQUFQO0FBQ0FnVSxpQkFBU1MsS0FBS0MsS0FBTCxDQUFXMVUsT0FBT2dVLE1BQWxCLENBQVQ7QUFDQUUsc0JBQWNGLE9BQU9FLFdBQXJCO0FBQ0FELGNBQU1saEIsR0FBR2taLG1CQUFILENBQXVCOVcsT0FBdkIsQ0FBK0IrZSxXQUEvQixDQUFOOztBQUNBLFlBQUdELE9BQVFBLElBQUlVLFNBQUosS0FBaUJoaEIsT0FBT3FNLE9BQU8yVSxTQUFkLENBQXpCLElBQXNEUixTQUFRblUsT0FBT21VLElBQXhFO0FBQ0NwaEIsYUFBR2taLG1CQUFILENBQXVCNUssTUFBdkIsQ0FBOEI7QUFBQ3ZILGlCQUFLb2E7QUFBTixXQUE5QixFQUFrRDtBQUFDOUwsa0JBQU07QUFBQ29FLG9CQUFNO0FBQVA7QUFBUCxXQUFsRDtBQ2FHLGlCRFpIb0ksZUFBZUMsV0FBZixDQUEyQlosSUFBSXhaLEtBQS9CLEVBQXNDd1osSUFBSXJWLE9BQTFDLEVBQW1EakwsT0FBT3FNLE9BQU8yVSxTQUFkLENBQW5ELEVBQTZFVixJQUFJM04sVUFBakYsRUFBNkYyTixJQUFJMVosUUFBakcsRUFBMkcwWixJQUFJYSxVQUEvRyxDQ1lHO0FBQ0Q7QUQzQkwsUUNNRTtBRFRpQyxLQUF2QixFQW9CVixVQUFDaEIsR0FBRDtBQUNGN1osY0FBUW5CLEtBQVIsQ0FBY2diLElBQUkzWixLQUFsQjtBQ2FFLGFEWkZGLFFBQVE4YSxHQUFSLENBQVksZ0VBQVosQ0NZRTtBRGxDVSxNQUFkO0FBTEQsV0FBQWpjLEtBQUE7QUErQk1LLFFBQUFMLEtBQUE7QUFDTG1CLFlBQVFuQixLQUFSLENBQWNLLEVBQUVnQixLQUFoQjtBQ1lDOztBRFZGeUYsTUFBSTBRLFNBQUosQ0FBYyxHQUFkLEVBQW1CO0FBQUMsb0JBQWdCO0FBQWpCLEdBQW5CO0FDY0MsU0RiRDFRLElBQUkyUSxHQUFKLENBQVEsMkRBQVIsQ0NhQztBRGpERixHOzs7Ozs7Ozs7Ozs7QUVBQWxnQixPQUFPNlgsT0FBUCxDQUNDO0FBQUE4TSxzQkFBb0IsVUFBQ3ZhLEtBQUQ7QUFLbkIsUUFBQXdhLEtBQUEsRUFBQUMsYUFBQSxFQUFBQyxnQkFBQSxFQUFBN1YsQ0FBQSxFQUFBOFYsT0FBQSxFQUFBdlIsQ0FBQSxFQUFBNUMsR0FBQSxFQUFBb1UsSUFBQSxFQUFBQyxLQUFBLEVBQUFDLE1BQUEsRUFBQUMsY0FBQSxFQUFBQyxPQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBbkwsSUFBQSxFQUFBb0wscUJBQUEsRUFBQWphLE9BQUEsRUFBQWthLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxNQUFBLEVBQUFDLEdBQUE7QUFBQXJYLFVBQU1sRSxLQUFOLEVBQWE0VSxNQUFiO0FBQ0ExVCxjQUNDO0FBQUF5WixlQUFTLElBQVQ7QUFDQVEsNkJBQXVCO0FBRHZCLEtBREQ7O0FBR0EsU0FBTyxLQUFLdmdCLE1BQVo7QUFDQyxhQUFPc0csT0FBUDtBQ0RFOztBREVIeVosY0FBVSxLQUFWO0FBQ0FRLDRCQUF3QixFQUF4QjtBQUNBQyxjQUFVOWlCLEdBQUdrakIsY0FBSCxDQUFrQjlnQixPQUFsQixDQUEwQjtBQUFDc0YsYUFBT0EsS0FBUjtBQUFlbkYsV0FBSztBQUFwQixLQUExQixDQUFWO0FBQ0FpZ0IsYUFBQSxDQUFBTSxXQUFBLE9BQVNBLFFBQVNLLE1BQWxCLEdBQWtCLE1BQWxCLEtBQTRCLEVBQTVCOztBQUVBLFFBQUdYLE9BQU92akIsTUFBVjtBQUNDMmpCLGVBQVM1aUIsR0FBR2tLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUMvQyxlQUFPQSxLQUFSO0FBQWUwRixlQUFPLEtBQUs5SztBQUEzQixPQUF0QixFQUEwRDtBQUFDZ0ksZ0JBQU87QUFBQ3ZELGVBQUs7QUFBTjtBQUFSLE9BQTFELENBQVQ7QUFDQTRiLGlCQUFXQyxPQUFPOUosR0FBUCxDQUFXLFVBQUNDLENBQUQ7QUFDckIsZUFBT0EsRUFBRWhTLEdBQVQ7QUFEVSxRQUFYOztBQUVBLFdBQU80YixTQUFTMWpCLE1BQWhCO0FBQ0MsZUFBTzJKLE9BQVA7QUNVRzs7QURSSjZaLHVCQUFpQixFQUFqQjs7QUFDQSxXQUFBbFcsSUFBQSxHQUFBMkIsTUFBQXNVLE9BQUF2akIsTUFBQSxFQUFBc04sSUFBQTJCLEdBQUEsRUFBQTNCLEdBQUE7QUNVS2dXLGdCQUFRQyxPQUFPalcsQ0FBUCxDQUFSO0FEVEoyVixnQkFBUUssTUFBTUwsS0FBZDtBQUNBZSxjQUFNVixNQUFNVSxHQUFaO0FBQ0FkLHdCQUFnQm5pQixHQUFHa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQy9DLGlCQUFPQSxLQUFSO0FBQWV5QyxtQkFBUztBQUFDTyxpQkFBS3dYO0FBQU47QUFBeEIsU0FBdEIsRUFBNkQ7QUFBQzVYLGtCQUFPO0FBQUN2RCxpQkFBSztBQUFOO0FBQVIsU0FBN0QsQ0FBaEI7QUFDQXFiLDJCQUFBRCxpQkFBQSxPQUFtQkEsY0FBZXJKLEdBQWYsQ0FBbUIsVUFBQ0MsQ0FBRDtBQUNyQyxpQkFBT0EsRUFBRWhTLEdBQVQ7QUFEa0IsVUFBbkIsR0FBbUIsTUFBbkI7O0FBRUEsYUFBQStKLElBQUEsR0FBQXdSLE9BQUFLLFNBQUExakIsTUFBQSxFQUFBNlIsSUFBQXdSLElBQUEsRUFBQXhSLEdBQUE7QUNxQk00UixvQkFBVUMsU0FBUzdSLENBQVQsQ0FBVjtBRHBCTGlTLHdCQUFjLEtBQWQ7O0FBQ0EsY0FBR2IsTUFBTXZkLE9BQU4sQ0FBYytkLE9BQWQsSUFBeUIsQ0FBQyxDQUE3QjtBQUNDSywwQkFBYyxJQUFkO0FBREQ7QUFHQyxnQkFBR1gsaUJBQWlCemQsT0FBakIsQ0FBeUIrZCxPQUF6QixJQUFvQyxDQUFDLENBQXhDO0FBQ0NLLDRCQUFjLElBQWQ7QUFKRjtBQzJCTTs7QUR0Qk4sY0FBR0EsV0FBSDtBQUNDVixzQkFBVSxJQUFWO0FBQ0FRLGtDQUFzQmxrQixJQUF0QixDQUEyQnNrQixHQUEzQjtBQUNBUiwyQkFBZTlqQixJQUFmLENBQW9CK2pCLE9BQXBCO0FDd0JLO0FEbENQO0FBTkQ7O0FBa0JBRCx1QkFBaUJsWSxFQUFFOEIsSUFBRixDQUFPb1csY0FBUCxDQUFqQjs7QUFDQSxVQUFHQSxlQUFleGpCLE1BQWYsR0FBd0IwakIsU0FBUzFqQixNQUFwQztBQUVDb2pCLGtCQUFVLEtBQVY7QUFDQVEsZ0NBQXdCLEVBQXhCO0FBSEQ7QUFLQ0EsZ0NBQXdCdFksRUFBRThCLElBQUYsQ0FBTzlCLEVBQUVDLE9BQUYsQ0FBVXFZLHFCQUFWLENBQVAsQ0FBeEI7QUFoQ0Y7QUMwREc7O0FEeEJILFFBQUdSLE9BQUg7QUFDQ1csZUFBU2hqQixHQUFHa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQy9DLGVBQU9BLEtBQVI7QUFBZVgsYUFBSztBQUFDMkQsZUFBS21ZO0FBQU47QUFBcEIsT0FBdEIsRUFBeUU7QUFBQ3ZZLGdCQUFPO0FBQUN2RCxlQUFLLENBQU47QUFBU29ELG1CQUFTO0FBQWxCO0FBQVIsT0FBekUsRUFBd0dRLEtBQXhHLEVBQVQ7QUFHQThNLGFBQU9sTixFQUFFNEIsTUFBRixDQUFTNlcsTUFBVCxFQUFpQixVQUFDNVcsR0FBRDtBQUN2QixZQUFBakMsT0FBQTtBQUFBQSxrQkFBVWlDLElBQUlqQyxPQUFKLElBQWUsRUFBekI7QUFDQSxlQUFPSSxFQUFFNlksWUFBRixDQUFlalosT0FBZixFQUF3QjBZLHFCQUF4QixFQUErQzVqQixNQUEvQyxHQUF3RCxDQUF4RCxJQUE4RHNMLEVBQUU2WSxZQUFGLENBQWVqWixPQUFmLEVBQXdCd1ksUUFBeEIsRUFBa0MxakIsTUFBbEMsR0FBMkMsQ0FBaEg7QUFGTSxRQUFQO0FBR0E0akIsOEJBQXdCcEwsS0FBS3FCLEdBQUwsQ0FBUyxVQUFDQyxDQUFEO0FBQ2hDLGVBQU9BLEVBQUVoUyxHQUFUO0FBRHVCLFFBQXhCO0FDc0NFOztBRG5DSDZCLFlBQVF5WixPQUFSLEdBQWtCQSxPQUFsQjtBQUNBelosWUFBUWlhLHFCQUFSLEdBQWdDQSxxQkFBaEM7QUFDQSxXQUFPamEsT0FBUDtBQTlERDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7QUVBQXRMLE1BQU0sQ0FBQzZYLE9BQVAsQ0FBZTtBQUNYa08sYUFBVyxFQUFFLFVBQVM5Z0IsR0FBVCxFQUFjQyxLQUFkLEVBQXFCO0FBQzlCb0osU0FBSyxDQUFDckosR0FBRCxFQUFNK1osTUFBTixDQUFMO0FBQ0ExUSxTQUFLLENBQUNwSixLQUFELEVBQVEvQyxNQUFSLENBQUw7QUFFQXNQLE9BQUcsR0FBRyxFQUFOO0FBQ0FBLE9BQUcsQ0FBQzFNLElBQUosR0FBVyxLQUFLQyxNQUFoQjtBQUNBeU0sT0FBRyxDQUFDeE0sR0FBSixHQUFVQSxHQUFWO0FBQ0F3TSxPQUFHLENBQUN2TSxLQUFKLEdBQVlBLEtBQVo7QUFFQSxRQUFJc0wsQ0FBQyxHQUFHOU4sRUFBRSxDQUFDbUMsaUJBQUgsQ0FBcUJzSSxJQUFyQixDQUEwQjtBQUM5QnBJLFVBQUksRUFBRSxLQUFLQyxNQURtQjtBQUU5QkMsU0FBRyxFQUFFQTtBQUZ5QixLQUExQixFQUdMbVQsS0FISyxFQUFSOztBQUlBLFFBQUk1SCxDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1A5TixRQUFFLENBQUNtQyxpQkFBSCxDQUFxQm1NLE1BQXJCLENBQTRCO0FBQ3hCak0sWUFBSSxFQUFFLEtBQUtDLE1BRGE7QUFFeEJDLFdBQUcsRUFBRUE7QUFGbUIsT0FBNUIsRUFHRztBQUNDOFMsWUFBSSxFQUFFO0FBQ0Y3UyxlQUFLLEVBQUVBO0FBREw7QUFEUCxPQUhIO0FBUUgsS0FURCxNQVNPO0FBQ0h4QyxRQUFFLENBQUNtQyxpQkFBSCxDQUFxQm1oQixNQUFyQixDQUE0QnZVLEdBQTVCO0FBQ0g7O0FBRUQsV0FBTyxJQUFQO0FBQ0g7QUE1QlUsQ0FBZixFOzs7Ozs7Ozs7Ozs7QUNBQXpSLE9BQU82WCxPQUFQLENBQ0M7QUFBQW9PLG9CQUFrQixVQUFDQyxnQkFBRCxFQUFtQnZRLFFBQW5CO0FBQ2pCLFFBQUF3USxLQUFBLEVBQUExQyxHQUFBLEVBQUE5VCxNQUFBLEVBQUFyRixNQUFBLEVBQUF2RixJQUFBOztBQ0NFLFFBQUk0USxZQUFZLElBQWhCLEVBQXNCO0FERllBLGlCQUFTLEVBQVQ7QUNJakM7O0FESEhySCxVQUFNNFgsZ0JBQU4sRUFBd0JsSCxNQUF4QjtBQUNBMVEsVUFBTXFILFFBQU4sRUFBZ0JxSixNQUFoQjtBQUVBamEsV0FBT3JDLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCO0FBQUMyRSxXQUFLLEtBQUt6RTtBQUFYLEtBQWpCLEVBQXFDO0FBQUNnSSxjQUFRO0FBQUN1Tyx1QkFBZTtBQUFoQjtBQUFULEtBQXJDLENBQVA7O0FBRUEsUUFBRyxDQUFJeFcsS0FBS3dXLGFBQVo7QUFDQztBQ1NFOztBRFBIM1IsWUFBUXdjLElBQVIsQ0FBYSxTQUFiO0FBQ0E5YixhQUFTLEVBQVQ7O0FBQ0EsUUFBR3FMLFFBQUg7QUFDQ3JMLGVBQVM1SCxHQUFHNEgsTUFBSCxDQUFVNkMsSUFBVixDQUFlO0FBQUMxRCxhQUFLa00sUUFBTjtBQUFnQjBRLGlCQUFTO0FBQXpCLE9BQWYsRUFBK0M7QUFBQ3JaLGdCQUFRO0FBQUN2RCxlQUFLO0FBQU47QUFBVCxPQUEvQyxDQUFUO0FBREQ7QUFHQ2EsZUFBUzVILEdBQUc0SCxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQ2taLGlCQUFTO0FBQVYsT0FBZixFQUFnQztBQUFDclosZ0JBQVE7QUFBQ3ZELGVBQUs7QUFBTjtBQUFULE9BQWhDLENBQVQ7QUNzQkU7O0FEckJIa0csYUFBUyxFQUFUO0FBQ0FyRixXQUFPcEosT0FBUCxDQUFlLFVBQUNvbEIsQ0FBRDtBQUNkLFVBQUF4ZCxDQUFBLEVBQUEyYSxHQUFBOztBQUFBO0FDd0JLLGVEdkJKYyxlQUFlZ0MsNEJBQWYsQ0FBNENMLGdCQUE1QyxFQUE4REksRUFBRTdjLEdBQWhFLENDdUJJO0FEeEJMLGVBQUFoQixLQUFBO0FBRU1nYixjQUFBaGIsS0FBQTtBQUNMSyxZQUFJLEVBQUo7QUFDQUEsVUFBRVcsR0FBRixHQUFRNmMsRUFBRTdjLEdBQVY7QUFDQVgsVUFBRWhJLElBQUYsR0FBU3dsQixFQUFFeGxCLElBQVg7QUFDQWdJLFVBQUUyYSxHQUFGLEdBQVFBLEdBQVI7QUN5QkksZUR4Qko5VCxPQUFPdE8sSUFBUCxDQUFZeUgsQ0FBWixDQ3dCSTtBQUNEO0FEakNMOztBQVNBLFFBQUc2RyxPQUFPaE8sTUFBUCxHQUFnQixDQUFuQjtBQUNDaUksY0FBUW5CLEtBQVIsQ0FBY2tILE1BQWQ7O0FBQ0E7QUFDQ3dXLGdCQUFRSyxRQUFRck8sS0FBUixDQUFjZ08sS0FBdEI7QUFDQUEsY0FBTU0sSUFBTixDQUNDO0FBQUFqbEIsY0FBSSxxQkFBSjtBQUNBRCxnQkFBTTRGLFNBQVNvUyxjQUFULENBQXdCaFksSUFEOUI7QUFFQW1ZLG1CQUFTLHlCQUZUO0FBR0FuVixnQkFBTTZmLEtBQUtzQyxTQUFMLENBQWU7QUFBQSxzQkFBVS9XO0FBQVYsV0FBZjtBQUhOLFNBREQ7QUFGRCxlQUFBbEgsS0FBQTtBQU9NZ2IsY0FBQWhiLEtBQUE7QUFDTG1CLGdCQUFRbkIsS0FBUixDQUFjZ2IsR0FBZDtBQVZGO0FDMENHOztBQUNELFdEaENGN1osUUFBUStjLE9BQVIsQ0FBZ0IsU0FBaEIsQ0NnQ0U7QURwRUg7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBM21CLE9BQU82WCxPQUFQLENBQ0M7QUFBQStPLGVBQWEsVUFBQ2pSLFFBQUQsRUFBVy9GLFFBQVgsRUFBcUJ3TyxPQUFyQjtBQUNaLFFBQUF5SSxTQUFBO0FBQUF2WSxVQUFNcUgsUUFBTixFQUFnQnFKLE1BQWhCO0FBQ0ExUSxVQUFNc0IsUUFBTixFQUFnQm9QLE1BQWhCOztBQUVBLFFBQUcsQ0FBQ3plLFFBQVE4SixZQUFSLENBQXFCc0wsUUFBckIsRUFBK0IzVixPQUFPZ0YsTUFBUCxFQUEvQixDQUFELElBQXFEb1osT0FBeEQ7QUFDQyxZQUFNLElBQUlwZSxPQUFPaVEsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyQkFBdEIsQ0FBTjtBQ0NFOztBRENILFFBQUcsQ0FBSWpRLE9BQU9nRixNQUFQLEVBQVA7QUFDQyxZQUFNLElBQUloRixPQUFPaVEsS0FBWCxDQUFpQixHQUFqQixFQUFxQixvQkFBckIsQ0FBTjtBQ0NFOztBRENILFNBQU9tTyxPQUFQO0FBQ0NBLGdCQUFVcGUsT0FBTytFLElBQVAsR0FBYzBFLEdBQXhCO0FDQ0U7O0FEQ0hvZCxnQkFBWW5rQixHQUFHcUssV0FBSCxDQUFlakksT0FBZixDQUF1QjtBQUFDQyxZQUFNcVosT0FBUDtBQUFnQmhVLGFBQU91TDtBQUF2QixLQUF2QixDQUFaOztBQUVBLFFBQUdrUixVQUFVQyxZQUFWLEtBQTBCLFNBQTFCLElBQXVDRCxVQUFVQyxZQUFWLEtBQTBCLFNBQXBFO0FBQ0MsWUFBTSxJQUFJOW1CLE9BQU9pUSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLHVCQUF0QixDQUFOO0FDR0U7O0FEREh2TixPQUFHb04sS0FBSCxDQUFTa0IsTUFBVCxDQUFnQjtBQUFDdkgsV0FBSzJVO0FBQU4sS0FBaEIsRUFBZ0M7QUFBQ3JHLFlBQU07QUFBQ25JLGtCQUFVQTtBQUFYO0FBQVAsS0FBaEM7QUFFQSxXQUFPQSxRQUFQO0FBcEJEO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQTVQLE9BQU82WCxPQUFQLENBQ0M7QUFBQWtQLG9CQUFrQixVQUFDekMsU0FBRCxFQUFZM08sUUFBWixFQUFzQnFSLE1BQXRCLEVBQThCQyxZQUE5QixFQUE0Qy9jLFFBQTVDLEVBQXNEdWEsVUFBdEQ7QUFDakIsUUFBQWYsS0FBQSxFQUFBQyxNQUFBLEVBQUF1RCxVQUFBLEVBQUFDLGNBQUEsRUFBQUMsVUFBQSxFQUFBQyxVQUFBLEVBQUFqZCxLQUFBLEVBQUFrZCxnQkFBQSxFQUFBbEosT0FBQSxFQUFBMkYsS0FBQTtBQUFBelYsVUFBTWdXLFNBQU4sRUFBaUJoaEIsTUFBakI7QUFDQWdMLFVBQU1xSCxRQUFOLEVBQWdCcUosTUFBaEI7QUFDQTFRLFVBQU0wWSxNQUFOLEVBQWNoSSxNQUFkO0FBQ0ExUSxVQUFNMlksWUFBTixFQUFvQjltQixLQUFwQjtBQUNBbU8sVUFBTXBFLFFBQU4sRUFBZ0I4VSxNQUFoQjtBQUNBMVEsVUFBTW1XLFVBQU4sRUFBa0JuaEIsTUFBbEI7QUFFQThhLGNBQVUsS0FBS3BaLE1BQWY7QUFFQWtpQixpQkFBYSxDQUFiO0FBQ0FFLGlCQUFhLEVBQWI7QUFDQTFrQixPQUFHNkwsT0FBSCxDQUFXcEIsSUFBWCxDQUFnQjtBQUFDck0sWUFBTTtBQUFDc00sYUFBSzZaO0FBQU47QUFBUCxLQUFoQixFQUE2Qy9sQixPQUE3QyxDQUFxRCxVQUFDRSxDQUFEO0FBQ3BEOGxCLG9CQUFjOWxCLEVBQUVtbUIsYUFBaEI7QUNJRyxhREhISCxXQUFXL2xCLElBQVgsQ0FBZ0JELEVBQUVvbUIsT0FBbEIsQ0NHRztBRExKO0FBSUFwZCxZQUFRMUgsR0FBRzRILE1BQUgsQ0FBVXhGLE9BQVYsQ0FBa0I2USxRQUFsQixDQUFSOztBQUNBLFFBQUcsQ0FBSXZMLE1BQU1pYyxPQUFiO0FBQ0NpQix5QkFBbUI1a0IsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDL0MsZUFBTXVMO0FBQVAsT0FBcEIsRUFBc0N5QyxLQUF0QyxFQUFuQjtBQUNBK08sdUJBQWlCRyxtQkFBbUJKLFVBQXBDOztBQUNBLFVBQUc1QyxZQUFZNkMsaUJBQWUsR0FBOUI7QUFDQyxjQUFNLElBQUlubkIsT0FBT2lRLEtBQVgsQ0FBaUIsUUFBakIsRUFBMkIsc0JBQW9Ca1gsY0FBL0MsQ0FBTjtBQUpGO0FDV0c7O0FETEhFLGlCQUFhLEVBQWI7QUFFQTFELGFBQVMsRUFBVDtBQUNBQSxXQUFPRSxXQUFQLEdBQXFCbUQsTUFBckI7QUFDQXRELFlBQVFsYixRQUFRLFlBQVIsQ0FBUjtBQUVBdWIsWUFBUUwsTUFBTTtBQUNiTSxhQUFPaGtCLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCOGpCLEtBRGxCO0FBRWJDLGNBQVFqa0IsT0FBT0MsUUFBUCxDQUFnQkMsT0FBaEIsQ0FBd0IrakIsTUFGbkI7QUFHYkMsbUJBQWFsa0IsT0FBT0MsUUFBUCxDQUFnQkMsT0FBaEIsQ0FBd0Jna0I7QUFIeEIsS0FBTixDQUFSO0FBTUFILFVBQU0wRCxrQkFBTixDQUF5QjtBQUN4QjlaLFlBQU15WixXQUFXaFEsSUFBWCxDQUFnQixHQUFoQixDQURrQjtBQUV4QnNRLG9CQUFjQyxTQUFTQyxNQUFULENBQWdCLG1CQUFoQixDQUZVO0FBR3hCdEQsaUJBQVdBLFNBSGE7QUFJeEJ1RCx3QkFBa0IsV0FKTTtBQUt4QkMsa0JBQVk5bkIsT0FBTzJILFdBQVAsS0FBdUIsNkJBTFg7QUFNeEJvZ0Isa0JBQVksUUFOWTtBQU94QkMsa0JBQVlMLFNBQVNDLE1BQVQsQ0FBZ0IsbUJBQWhCLENBUFk7QUFReEJqRSxjQUFRUyxLQUFLc0MsU0FBTCxDQUFlL0MsTUFBZjtBQVJnQixLQUF6QixFQVNHM2pCLE9BQU9rakIsZUFBUCxDQUF3QixVQUFDTyxHQUFELEVBQU05VCxNQUFOO0FBQ3pCLFVBQUE4QixHQUFBOztBQUFBLFVBQUdnUyxHQUFIO0FBQ0M3WixnQkFBUW5CLEtBQVIsQ0FBY2diLElBQUkzWixLQUFsQjtBQ0tFOztBREpILFVBQUc2RixNQUFIO0FBQ0M4QixjQUFNLEVBQU47QUFDQUEsWUFBSWhJLEdBQUosR0FBVXVkLE1BQVY7QUFDQXZWLFlBQUl1RSxPQUFKLEdBQWMsSUFBSXhMLElBQUosRUFBZDtBQUNBaUgsWUFBSXdXLElBQUosR0FBV3RZLE1BQVg7QUFDQThCLFlBQUk2UyxTQUFKLEdBQWdCQSxTQUFoQjtBQUNBN1MsWUFBSXdFLFVBQUosR0FBaUJtSSxPQUFqQjtBQUNBM00sWUFBSXJILEtBQUosR0FBWXVMLFFBQVo7QUFDQWxFLFlBQUkwSyxJQUFKLEdBQVcsS0FBWDtBQUNBMUssWUFBSWxELE9BQUosR0FBYzBZLFlBQWQ7QUFDQXhWLFlBQUl2SCxRQUFKLEdBQWVBLFFBQWY7QUFDQXVILFlBQUlnVCxVQUFKLEdBQWlCQSxVQUFqQjtBQ01HLGVETEgvaEIsR0FBR2taLG1CQUFILENBQXVCb0ssTUFBdkIsQ0FBOEJ2VSxHQUE5QixDQ0tHO0FBQ0Q7QURyQnFCLEtBQXZCLEVBZ0JDLFVBQUMzSSxDQUFEO0FBQ0ZjLGNBQVE4YSxHQUFSLENBQVkscURBQVo7QUNPRSxhRE5GOWEsUUFBUThhLEdBQVIsQ0FBWTViLEVBQUVnQixLQUFkLENDTUU7QUR4QkQsTUFUSDtBQWdDQSxXQUFPLFNBQVA7QUFuRUQ7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBOUosT0FBTzZYLE9BQVAsQ0FDQztBQUFBcVEsd0JBQXNCLFVBQUN2UyxRQUFEO0FBQ3JCLFFBQUF3UyxlQUFBO0FBQUE3WixVQUFNcUgsUUFBTixFQUFnQnFKLE1BQWhCO0FBQ0FtSixzQkFBa0IsSUFBSWhtQixNQUFKLEVBQWxCO0FBQ0FnbUIsb0JBQWdCQyxnQkFBaEIsR0FBbUMxbEIsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDL0MsYUFBT3VMO0FBQVIsS0FBcEIsRUFBdUN5QyxLQUF2QyxFQUFuQztBQUNBK1Asb0JBQWdCRSxtQkFBaEIsR0FBc0MzbEIsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDL0MsYUFBT3VMLFFBQVI7QUFBa0J3TSxxQkFBZTtBQUFqQyxLQUFwQixFQUE0RC9KLEtBQTVELEVBQXRDO0FBQ0EsV0FBTytQLGVBQVA7QUFMRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FDQUFub0IsT0FBTzZYLE9BQVAsQ0FDQztBQUFBeVEsaUJBQWUsVUFBQ3huQixJQUFEO0FBQ2QsUUFBRyxDQUFDLEtBQUtrRSxNQUFUO0FBQ0MsYUFBTyxLQUFQO0FDQ0U7O0FBQ0QsV0RBRnRDLEdBQUdvTixLQUFILENBQVN3WSxhQUFULENBQXVCLEtBQUt0akIsTUFBNUIsRUFBb0NsRSxJQUFwQyxDQ0FFO0FESkg7QUFNQXluQixpQkFBZSxVQUFDQyxLQUFEO0FBQ2QsUUFBQXBZLFdBQUE7O0FBQUEsUUFBRyxDQUFDLEtBQUtwTCxNQUFOLElBQWdCLENBQUN3akIsS0FBcEI7QUFDQyxhQUFPLEtBQVA7QUNFRTs7QURBSHBZLGtCQUFjakosU0FBU2tKLGVBQVQsQ0FBeUJtWSxLQUF6QixDQUFkO0FBRUE1ZSxZQUFROGEsR0FBUixDQUFZLE9BQVosRUFBcUI4RCxLQUFyQjtBQ0NFLFdEQ0Y5bEIsR0FBR29OLEtBQUgsQ0FBU2tCLE1BQVQsQ0FBZ0I7QUFBQ3ZILFdBQUssS0FBS3pFO0FBQVgsS0FBaEIsRUFBb0M7QUFBQzZULGFBQU87QUFBQyxtQkFBVztBQUFDekksdUJBQWFBO0FBQWQ7QUFBWjtBQUFSLEtBQXBDLENDREU7QURiSDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFwUSxPQUFPNlgsT0FBUCxDQUNJO0FBQUEsMEJBQXdCLFVBQUM1TixPQUFELEVBQVVqRixNQUFWO0FBQ3BCLFFBQUF5akIsWUFBQSxFQUFBN2IsYUFBQSxFQUFBOGIsR0FBQTtBQUFBcGEsVUFBTXJFLE9BQU4sRUFBZStVLE1BQWY7QUFDQTFRLFVBQU10SixNQUFOLEVBQWNnYSxNQUFkO0FBRUF5SixtQkFBZWhULFFBQVFJLFdBQVIsQ0FBb0IsYUFBcEIsRUFBbUMvUSxPQUFuQyxDQUEyQztBQUFDc0YsYUFBT0gsT0FBUjtBQUFpQmxGLFlBQU1DO0FBQXZCLEtBQTNDLEVBQTJFO0FBQUNnSSxjQUFRO0FBQUNKLHVCQUFlO0FBQWhCO0FBQVQsS0FBM0UsQ0FBZjs7QUFDQSxRQUFHLENBQUM2YixZQUFKO0FBQ0ksWUFBTSxJQUFJem9CLE9BQU9pUSxLQUFYLENBQWlCLGdCQUFqQixDQUFOO0FDUVA7O0FETkdyRCxvQkFBZ0I2SSxRQUFRK0gsYUFBUixDQUFzQixlQUF0QixFQUF1Q3JRLElBQXZDLENBQTRDO0FBQ3hEMUQsV0FBSztBQUNEMkQsYUFBS3FiLGFBQWE3YjtBQURqQjtBQURtRCxLQUE1QyxFQUliO0FBQUNJLGNBQVE7QUFBQ0gsaUJBQVM7QUFBVjtBQUFULEtBSmEsRUFJV1EsS0FKWCxFQUFoQjtBQU1BcWIsVUFBTWpULFFBQVErSCxhQUFSLENBQXNCLGtCQUF0QixFQUEwQ3JRLElBQTFDLENBQStDO0FBQUUvQyxhQUFPSDtBQUFULEtBQS9DLEVBQW1FO0FBQUUrQyxjQUFRO0FBQUV5USxxQkFBYSxDQUFmO0FBQWtCa0wsaUJBQVMsQ0FBM0I7QUFBOEJ2ZSxlQUFPO0FBQXJDO0FBQVYsS0FBbkUsRUFBeUhpRCxLQUF6SCxFQUFOOztBQUNBSixNQUFFckMsSUFBRixDQUFPOGQsR0FBUCxFQUFXLFVBQUMxSyxDQUFEO0FBQ1AsVUFBQTRLLEVBQUEsRUFBQUMsS0FBQTtBQUFBRCxXQUFLblQsUUFBUStILGFBQVIsQ0FBc0IsT0FBdEIsRUFBK0IxWSxPQUEvQixDQUF1Q2taLEVBQUUySyxPQUF6QyxFQUFrRDtBQUFFM2IsZ0JBQVE7QUFBRWxNLGdCQUFNLENBQVI7QUFBVytuQixpQkFBTztBQUFsQjtBQUFWLE9BQWxELENBQUw7O0FBQ0EsVUFBR0QsRUFBSDtBQUNJNUssVUFBRThLLFNBQUYsR0FBY0YsR0FBRzluQixJQUFqQjtBQUNBa2QsVUFBRStLLE9BQUYsR0FBWSxLQUFaO0FBRUFGLGdCQUFRRCxHQUFHQyxLQUFYOztBQUNBLFlBQUdBLEtBQUg7QUFDSSxjQUFHQSxNQUFNRyxhQUFOLElBQXVCSCxNQUFNRyxhQUFOLENBQW9COW1CLFFBQXBCLENBQTZCOEMsTUFBN0IsQ0FBMUI7QUN3QlIsbUJEdkJZZ1osRUFBRStLLE9BQUYsR0FBWSxJQ3VCeEI7QUR4QlEsaUJBRUssSUFBR0YsTUFBTUksWUFBTixJQUFzQkosTUFBTUksWUFBTixDQUFtQnRuQixNQUFuQixHQUE0QixDQUFyRDtBQUNELGdCQUFHOG1CLGdCQUFnQkEsYUFBYTdiLGFBQTdCLElBQThDSyxFQUFFNlksWUFBRixDQUFlMkMsYUFBYTdiLGFBQTVCLEVBQTJDaWMsTUFBTUksWUFBakQsRUFBK0R0bkIsTUFBL0QsR0FBd0UsQ0FBekg7QUN3QlYscUJEdkJjcWMsRUFBRStLLE9BQUYsR0FBWSxJQ3VCMUI7QUR4QlU7QUFHSSxrQkFBR25jLGFBQUg7QUN3QlosdUJEdkJnQm9SLEVBQUUrSyxPQUFGLEdBQVk5YixFQUFFaWMsSUFBRixDQUFPdGMsYUFBUCxFQUFzQixVQUFDa0MsR0FBRDtBQUM5Qix5QkFBT0EsSUFBSWpDLE9BQUosSUFBZUksRUFBRTZZLFlBQUYsQ0FBZWhYLElBQUlqQyxPQUFuQixFQUE0QmdjLE1BQU1JLFlBQWxDLEVBQWdEdG5CLE1BQWhELEdBQXlELENBQS9FO0FBRFEsa0JDdUI1QjtBRDNCUTtBQURDO0FBSFQ7QUFMSjtBQzJDTDtBRDdDQzs7QUFrQkErbUIsVUFBTUEsSUFBSTdaLE1BQUosQ0FBVyxVQUFDNE0sQ0FBRDtBQUNiLGFBQU9BLEVBQUVxTixTQUFUO0FBREUsTUFBTjtBQUdBLFdBQU9KLEdBQVA7QUFwQ0o7QUFBQSxDQURKLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBMW9CLE9BQU82WCxPQUFQLENBQ0M7QUFBQXNSLHdCQUFzQixVQUFDQyxhQUFELEVBQWdCelQsUUFBaEIsRUFBMEJuRyxRQUExQjtBQUNyQixRQUFBNlosZUFBQSxFQUFBQyxXQUFBLEVBQUFqZixZQUFBLEVBQUFrZixJQUFBLEVBQUFDLE1BQUEsRUFBQTNtQixHQUFBLEVBQUFDLElBQUEsRUFBQTJNLElBQUEsRUFBQXJGLEtBQUEsRUFBQXljLFNBQUEsRUFBQTRDLE1BQUEsRUFBQXJMLE9BQUE7O0FBQUEsUUFBRyxDQUFDLEtBQUtwWixNQUFUO0FBQ0MsWUFBTSxJQUFJaEYsT0FBT2lRLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsTUFBdEIsQ0FBTjtBQ0VFOztBREFIN0YsWUFBUTFILEdBQUc0SCxNQUFILENBQVV4RixPQUFWLENBQWtCO0FBQUMyRSxXQUFLa007QUFBTixLQUFsQixDQUFSO0FBQ0F0TCxtQkFBQUQsU0FBQSxRQUFBdkgsTUFBQXVILE1BQUErRCxNQUFBLFlBQUF0TCxJQUE4QlgsUUFBOUIsQ0FBdUMsS0FBSzhDLE1BQTVDLElBQWUsTUFBZixHQUFlLE1BQWY7O0FBRUEsU0FBT3FGLFlBQVA7QUFDQyxZQUFNLElBQUlySyxPQUFPaVEsS0FBWCxDQUFpQixHQUFqQixFQUFzQixjQUF0QixDQUFOO0FDR0U7O0FEREg0VyxnQkFBWW5rQixHQUFHcUssV0FBSCxDQUFlakksT0FBZixDQUF1QjtBQUFDMkUsV0FBSzJmLGFBQU47QUFBcUJoZixhQUFPdUw7QUFBNUIsS0FBdkIsQ0FBWjtBQUNBeUksY0FBVXlJLFVBQVU5aEIsSUFBcEI7QUFDQTBrQixhQUFTL21CLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCO0FBQUMyRSxXQUFLMlU7QUFBTixLQUFqQixDQUFUO0FBQ0FrTCxrQkFBYzVtQixHQUFHb04sS0FBSCxDQUFTaEwsT0FBVCxDQUFpQjtBQUFDMkUsV0FBSyxLQUFLekU7QUFBWCxLQUFqQixDQUFkOztBQUVBLFFBQUc2aEIsVUFBVUMsWUFBVixLQUEwQixTQUExQixJQUF1Q0QsVUFBVUMsWUFBVixLQUEwQixTQUFwRTtBQUNDLFlBQU0sSUFBSTltQixPQUFPaVEsS0FBWCxDQUFpQixHQUFqQixFQUFzQixzQkFBdEIsQ0FBTjtBQ1NFOztBRFBIMVAsWUFBUXdVLGdCQUFSLENBQXlCdkYsUUFBekI7QUFDQWdhLGFBQVMsSUFBVDs7QUFDQSxRQUFHLEtBQUt4a0IsTUFBTCxLQUFlb1osT0FBbEI7QUFDQ29MLGVBQVMsS0FBVDtBQ1NFOztBRFJIcmlCLGFBQVN1aUIsV0FBVCxDQUFxQnRMLE9BQXJCLEVBQThCNU8sUUFBOUIsRUFBd0M7QUFBQ2dhLGNBQVFBO0FBQVQsS0FBeEM7QUFDQUgsc0JBQWtCM21CLEdBQUdvTixLQUFILENBQVNoTCxPQUFULENBQWlCO0FBQUMyRSxXQUFLMlU7QUFBTixLQUFqQixDQUFsQjs7QUFDQSxRQUFHaUwsZUFBSDtBQUNDM21CLFNBQUdvTixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUN2SCxhQUFLMlU7QUFBTixPQUFoQixFQUFnQztBQUFDN0YsZUFBTztBQUFDLHdDQUFBelYsT0FBQXVtQixnQkFBQU0sUUFBQSxhQUFBbGEsT0FBQTNNLEtBQUEwTSxRQUFBLFlBQUFDLEtBQWlFbWEsTUFBakUsR0FBaUUsTUFBakUsR0FBaUU7QUFBbEU7QUFBUixPQUFoQztBQ29CRTs7QURqQkgsUUFBR0gsT0FBT25kLE1BQVAsSUFBaUJtZCxPQUFPSSxlQUEzQjtBQUNDTixhQUFPLElBQVA7O0FBQ0EsVUFBR0UsT0FBT25wQixNQUFQLEtBQWlCLE9BQXBCO0FBQ0NpcEIsZUFBTyxPQUFQO0FDbUJHOztBQUNELGFEbkJITyxTQUFTckQsSUFBVCxDQUNDO0FBQUFzRCxnQkFBUSxNQUFSO0FBQ0FDLGdCQUFRLGVBRFI7QUFFQUMscUJBQWEsRUFGYjtBQUdBQyxnQkFBUVQsT0FBT25kLE1BSGY7QUFJQTZkLGtCQUFVLE1BSlY7QUFLQUMsc0JBQWMsY0FMZDtBQU1BNVAsYUFBS25XLFFBQVFDLEVBQVIsQ0FBVyw4QkFBWCxFQUEyQyxFQUEzQyxFQUErQ2lsQixJQUEvQztBQU5MLE9BREQsQ0NtQkc7QUFTRDtBRDVESjtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFoRixpQkFBaUIsRUFBakI7O0FBS0FBLGVBQWU4RixxQkFBZixHQUF1QyxVQUFDMVUsUUFBRCxFQUFXdVEsZ0JBQVg7QUFDdEMsTUFBQWhtQixPQUFBLEVBQUFvcUIsVUFBQSxFQUFBcGdCLFFBQUEsRUFBQXFnQixhQUFBLEVBQUFoWCxVQUFBLEVBQUFJLFVBQUEsRUFBQTZXLGVBQUE7QUFBQUYsZUFBYSxDQUFiO0FBRUFDLGtCQUFnQixJQUFJL2YsSUFBSixDQUFTaUssU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQVQsRUFBZ0QrUyxTQUFTeVIsaUJBQWlCeGtCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBaEQsRUFBdUYsQ0FBdkYsQ0FBaEI7QUFDQXdJLGFBQVd5ZCxPQUFPNEMsY0FBY3BYLE9BQWQsRUFBUCxFQUFnQ3lVLE1BQWhDLENBQXVDLFVBQXZDLENBQVg7QUFFQTFuQixZQUFVd0MsR0FBRytuQixRQUFILENBQVkzbEIsT0FBWixDQUFvQjtBQUFDc0YsV0FBT3VMLFFBQVI7QUFBa0IrVSxpQkFBYTtBQUEvQixHQUFwQixDQUFWO0FBQ0FuWCxlQUFhclQsUUFBUXlxQixZQUFyQjtBQUVBaFgsZUFBYXVTLG1CQUFtQixJQUFoQztBQUNBc0Usb0JBQWtCLElBQUloZ0IsSUFBSixDQUFTaUssU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQVQsRUFBZ0QrUyxTQUFTeVIsaUJBQWlCeGtCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBaEQsRUFBdUYsSUFBRTZvQixjQUFjSyxPQUFkLEVBQXpGLENBQWxCOztBQUVBLE1BQUdyWCxjQUFjckosUUFBakIsVUFFSyxJQUFHeUosY0FBY0osVUFBZCxJQUE2QkEsYUFBYXJKLFFBQTdDO0FBQ0pvZ0IsaUJBQWEsQ0FBQ0MsZ0JBQWdCQyxlQUFqQixLQUFtQyxLQUFHLEVBQUgsR0FBTSxFQUFOLEdBQVMsSUFBNUMsSUFBb0QsQ0FBakU7QUFESSxTQUVBLElBQUdqWCxhQUFhSSxVQUFoQjtBQUNKMlcsaUJBQWEsQ0FBQ0MsZ0JBQWdCQyxlQUFqQixLQUFtQyxLQUFHLEVBQUgsR0FBTSxFQUFOLEdBQVMsSUFBNUMsSUFBb0QsQ0FBakU7QUNBQzs7QURFRixTQUFPO0FBQUMsa0JBQWNGO0FBQWYsR0FBUDtBQW5Cc0MsQ0FBdkM7O0FBc0JBL0YsZUFBZXNHLGVBQWYsR0FBaUMsVUFBQ2xWLFFBQUQsRUFBV21WLFlBQVg7QUFDaEMsTUFBQUMsUUFBQSxFQUFBQyxHQUFBLEVBQUFDLEtBQUEsRUFBQUMsSUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBLEVBQUFDLFlBQUEsRUFBQUMsTUFBQTtBQUFBRixjQUFZLElBQVo7QUFDQUosU0FBT3hvQixHQUFHK25CLFFBQUgsQ0FBWTNsQixPQUFaLENBQW9CO0FBQUNzRixXQUFPdUwsUUFBUjtBQUFrQkssYUFBUzhVO0FBQTNCLEdBQXBCLENBQVA7QUFHQVMsaUJBQWU3b0IsR0FBRytuQixRQUFILENBQVkzbEIsT0FBWixDQUNkO0FBQ0NzRixXQUFPdUwsUUFEUjtBQUVDSyxhQUFTO0FBQ1J5VixXQUFLWDtBQURHLEtBRlY7QUFLQ1ksbUJBQWVSLEtBQUtRO0FBTHJCLEdBRGMsRUFRZDtBQUNDbHJCLFVBQU07QUFDTDBWLGdCQUFVLENBQUM7QUFETjtBQURQLEdBUmMsQ0FBZjs7QUFjQSxNQUFHcVYsWUFBSDtBQUNDRCxnQkFBWUMsWUFBWjtBQUREO0FBSUNOLFlBQVEsSUFBSXpnQixJQUFKLENBQVNpSyxTQUFTeVcsS0FBS1EsYUFBTCxDQUFtQmhxQixLQUFuQixDQUF5QixDQUF6QixFQUEyQixDQUEzQixDQUFULENBQVQsRUFBa0QrUyxTQUFTeVcsS0FBS1EsYUFBTCxDQUFtQmhxQixLQUFuQixDQUF5QixDQUF6QixFQUEyQixDQUEzQixDQUFULENBQWxELEVBQTJGLENBQTNGLENBQVI7QUFDQXNwQixVQUFNckQsT0FBT3NELE1BQU05WCxPQUFOLEtBQWlCOFgsTUFBTUwsT0FBTixLQUFnQixFQUFoQixHQUFtQixFQUFuQixHQUFzQixFQUF0QixHQUF5QixJQUFqRCxFQUF3RGhELE1BQXhELENBQStELFFBQS9ELENBQU47QUFFQW1ELGVBQVdyb0IsR0FBRytuQixRQUFILENBQVkzbEIsT0FBWixDQUNWO0FBQ0NzRixhQUFPdUwsUUFEUjtBQUVDK1YscUJBQWVWO0FBRmhCLEtBRFUsRUFLVjtBQUNDeHFCLFlBQU07QUFDTDBWLGtCQUFVLENBQUM7QUFETjtBQURQLEtBTFUsQ0FBWDs7QUFXQSxRQUFHNlUsUUFBSDtBQUNDTyxrQkFBWVAsUUFBWjtBQW5CRjtBQ2dCRTs7QURLRk0saUJBQWtCQyxhQUFjQSxVQUFVSyxPQUF4QixHQUFxQ0wsVUFBVUssT0FBL0MsR0FBNEQsR0FBOUU7QUFFQVAsV0FBWUYsS0FBS0UsTUFBTCxHQUFpQkYsS0FBS0UsTUFBdEIsR0FBa0MsR0FBOUM7QUFDQUQsWUFBYUQsS0FBS0MsT0FBTCxHQUFrQkQsS0FBS0MsT0FBdkIsR0FBb0MsR0FBakQ7QUFDQUssV0FBUyxJQUFJcnBCLE1BQUosRUFBVDtBQUNBcXBCLFNBQU9HLE9BQVAsR0FBaUJyb0IsT0FBTyxDQUFDK25CLGVBQWVGLE9BQWYsR0FBeUJDLE1BQTFCLEVBQWtDN25CLE9BQWxDLENBQTBDLENBQTFDLENBQVAsQ0FBakI7QUFDQWlvQixTQUFPdFYsUUFBUCxHQUFrQixJQUFJMUwsSUFBSixFQUFsQjtBQ0pDLFNES0Q5SCxHQUFHK25CLFFBQUgsQ0FBWW5TLE1BQVosQ0FBbUJ0SCxNQUFuQixDQUEwQjtBQUFDdkgsU0FBS3loQixLQUFLemhCO0FBQVgsR0FBMUIsRUFBMkM7QUFBQ3NPLFVBQU15VDtBQUFQLEdBQTNDLENDTEM7QUQxQytCLENBQWpDOztBQWtEQWpILGVBQWVxSCxXQUFmLEdBQTZCLFVBQUNqVyxRQUFELEVBQVd1USxnQkFBWCxFQUE2QnpCLFVBQTdCLEVBQXlDNkYsVUFBekMsRUFBcUR1QixXQUFyRCxFQUFrRUMsU0FBbEU7QUFDNUIsTUFBQUMsZUFBQSxFQUFBQyxzQkFBQSxFQUFBQyxXQUFBLEVBQUFiLE1BQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBLEVBQUFZLFFBQUEsRUFBQTVYLEdBQUE7QUFBQXlYLG9CQUFrQixJQUFJdmhCLElBQUosQ0FBU2lLLFNBQVN5UixpQkFBaUJ4a0IsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEK1MsU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQWxCO0FBQ0F1cUIsZ0JBQWNGLGdCQUFnQm5CLE9BQWhCLEVBQWQ7QUFDQW9CLDJCQUF5QnJFLE9BQU9vRSxlQUFQLEVBQXdCbkUsTUFBeEIsQ0FBK0IsVUFBL0IsQ0FBekI7QUFFQXdELFdBQVM5bkIsT0FBTyxDQUFFZ25CLGFBQVcyQixXQUFaLEdBQTJCeEgsVUFBM0IsR0FBd0NxSCxTQUF6QyxFQUFvRHZvQixPQUFwRCxDQUE0RCxDQUE1RCxDQUFQLENBQVQ7QUFDQStuQixjQUFZNW9CLEdBQUcrbkIsUUFBSCxDQUFZM2xCLE9BQVosQ0FDWDtBQUNDc0YsV0FBT3VMLFFBRFI7QUFFQ2dWLGtCQUFjO0FBQ2J3QixZQUFNSDtBQURPO0FBRmYsR0FEVyxFQU9YO0FBQ0N4ckIsVUFBTTtBQUNMMFYsZ0JBQVUsQ0FBQztBQUROO0FBRFAsR0FQVyxDQUFaO0FBYUFtVixpQkFBa0JDLGFBQWNBLFVBQVVLLE9BQXhCLEdBQXFDTCxVQUFVSyxPQUEvQyxHQUE0RCxHQUE5RTtBQUVBclgsUUFBTSxJQUFJOUosSUFBSixFQUFOO0FBQ0EwaEIsYUFBVyxJQUFJL3BCLE1BQUosRUFBWDtBQUNBK3BCLFdBQVN6aUIsR0FBVCxHQUFlL0csR0FBRytuQixRQUFILENBQVkyQixVQUFaLEVBQWY7QUFDQUYsV0FBU1IsYUFBVCxHQUF5QnhGLGdCQUF6QjtBQUNBZ0csV0FBU3ZCLFlBQVQsR0FBd0JxQixzQkFBeEI7QUFDQUUsV0FBUzloQixLQUFULEdBQWlCdUwsUUFBakI7QUFDQXVXLFdBQVN4QixXQUFULEdBQXVCbUIsV0FBdkI7QUFDQUssV0FBU0osU0FBVCxHQUFxQkEsU0FBckI7QUFDQUksV0FBU3pILFVBQVQsR0FBc0JBLFVBQXRCO0FBQ0F5SCxXQUFTZCxNQUFULEdBQWtCQSxNQUFsQjtBQUNBYyxXQUFTUCxPQUFULEdBQW1Ccm9CLE9BQU8sQ0FBQytuQixlQUFlRCxNQUFoQixFQUF3QjduQixPQUF4QixDQUFnQyxDQUFoQyxDQUFQLENBQW5CO0FBQ0Eyb0IsV0FBU2xXLE9BQVQsR0FBbUIxQixHQUFuQjtBQUNBNFgsV0FBU2hXLFFBQVQsR0FBb0I1QixHQUFwQjtBQ0pDLFNES0Q1UixHQUFHK25CLFFBQUgsQ0FBWW5TLE1BQVosQ0FBbUIwTixNQUFuQixDQUEwQmtHLFFBQTFCLENDTEM7QUQ3QjJCLENBQTdCOztBQW9DQTNILGVBQWU4SCxpQkFBZixHQUFtQyxVQUFDMVcsUUFBRDtBQ0hqQyxTRElEalQsR0FBR3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDL0MsV0FBT3VMLFFBQVI7QUFBa0J3TSxtQkFBZTtBQUFqQyxHQUFwQixFQUE0RC9KLEtBQTVELEVDSkM7QURHaUMsQ0FBbkM7O0FBR0FtTSxlQUFlK0gsaUJBQWYsR0FBbUMsVUFBQ3BHLGdCQUFELEVBQW1CdlEsUUFBbkI7QUFDbEMsTUFBQTRXLGFBQUE7QUFBQUEsa0JBQWdCLElBQUlwc0IsS0FBSixFQUFoQjtBQUNBdUMsS0FBRytuQixRQUFILENBQVl0ZCxJQUFaLENBQ0M7QUFDQ3VlLG1CQUFleEYsZ0JBRGhCO0FBRUM5YixXQUFPdUwsUUFGUjtBQUdDK1UsaUJBQWE7QUFBQ3RkLFdBQUssQ0FBQyxTQUFELEVBQVksb0JBQVo7QUFBTjtBQUhkLEdBREQsRUFNQztBQUNDNU0sVUFBTTtBQUFDd1YsZUFBUztBQUFWO0FBRFAsR0FORCxFQVNFOVUsT0FURixDQVNVLFVBQUNncUIsSUFBRDtBQ0dQLFdERkZxQixjQUFjbHJCLElBQWQsQ0FBbUI2cEIsS0FBS2xWLE9BQXhCLENDRUU7QURaSDs7QUFZQSxNQUFHdVcsY0FBYzVxQixNQUFkLEdBQXVCLENBQTFCO0FDR0csV0RGRnNMLEVBQUVyQyxJQUFGLENBQU8yaEIsYUFBUCxFQUFzQixVQUFDQyxHQUFEO0FDR2xCLGFERkhqSSxlQUFlc0csZUFBZixDQUErQmxWLFFBQS9CLEVBQXlDNlcsR0FBekMsQ0NFRztBREhKLE1DRUU7QUFHRDtBRHBCZ0MsQ0FBbkM7O0FBa0JBakksZUFBZWtJLFdBQWYsR0FBNkIsVUFBQzlXLFFBQUQsRUFBV3VRLGdCQUFYO0FBQzVCLE1BQUFoYyxRQUFBLEVBQUFxZ0IsYUFBQSxFQUFBaGMsT0FBQSxFQUFBb0YsVUFBQTtBQUFBcEYsWUFBVSxJQUFJcE8sS0FBSixFQUFWO0FBQ0F3VCxlQUFhdVMsbUJBQW1CLElBQWhDO0FBQ0FxRSxrQkFBZ0IsSUFBSS9mLElBQUosQ0FBU2lLLFNBQVN5UixpQkFBaUJ4a0IsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEK1MsU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQWhCO0FBQ0F3SSxhQUFXeWQsT0FBTzRDLGNBQWNwWCxPQUFkLEVBQVAsRUFBZ0N5VSxNQUFoQyxDQUF1QyxVQUF2QyxDQUFYO0FBRUFsbEIsS0FBRzZMLE9BQUgsQ0FBV3BCLElBQVgsR0FBa0JqTSxPQUFsQixDQUEwQixVQUFDRSxDQUFEO0FBQ3pCLFFBQUFzckIsV0FBQTtBQUFBQSxrQkFBY2hxQixHQUFHaXFCLGtCQUFILENBQXNCN25CLE9BQXRCLENBQ2I7QUFDQ3NGLGFBQU91TCxRQURSO0FBRUNoVyxjQUFReUIsRUFBRU4sSUFGWDtBQUdDOHJCLG1CQUFhO0FBQ1pULGNBQU1qaUI7QUFETTtBQUhkLEtBRGEsRUFRYjtBQUNDOEwsZUFBUyxDQUFDO0FBRFgsS0FSYSxDQUFkOztBQWFBLFFBQUcsQ0FBSTBXLFdBQVAsVUFJSyxJQUFHQSxZQUFZRSxXQUFaLEdBQTBCalosVUFBMUIsSUFBeUMrWSxZQUFZRyxTQUFaLEtBQXlCLFNBQXJFO0FDQ0QsYURBSHRlLFFBQVFsTixJQUFSLENBQWFELENBQWIsQ0NBRztBRERDLFdBR0EsSUFBR3NyQixZQUFZRSxXQUFaLEdBQTBCalosVUFBMUIsSUFBeUMrWSxZQUFZRyxTQUFaLEtBQXlCLFdBQXJFLFVBR0EsSUFBR0gsWUFBWUUsV0FBWixJQUEyQmpaLFVBQTlCO0FDREQsYURFSHBGLFFBQVFsTixJQUFSLENBQWFELENBQWIsQ0NGRztBQUNEO0FEeEJKO0FBMkJBLFNBQU9tTixPQUFQO0FBakM0QixDQUE3Qjs7QUFtQ0FnVyxlQUFldUksZ0JBQWYsR0FBa0M7QUFDakMsTUFBQUMsWUFBQTtBQUFBQSxpQkFBZSxJQUFJNXNCLEtBQUosRUFBZjtBQUNBdUMsS0FBRzZMLE9BQUgsQ0FBV3BCLElBQVgsR0FBa0JqTSxPQUFsQixDQUEwQixVQUFDRSxDQUFEO0FDRXZCLFdEREYyckIsYUFBYTFyQixJQUFiLENBQWtCRCxFQUFFTixJQUFwQixDQ0NFO0FERkg7QUFHQSxTQUFPaXNCLFlBQVA7QUFMaUMsQ0FBbEM7O0FBUUF4SSxlQUFlZ0MsNEJBQWYsR0FBOEMsVUFBQ0wsZ0JBQUQsRUFBbUJ2USxRQUFuQjtBQUM3QyxNQUFBcVgsR0FBQSxFQUFBakIsZUFBQSxFQUFBQyxzQkFBQSxFQUFBaEIsR0FBQSxFQUFBQyxLQUFBLEVBQUFVLE9BQUEsRUFBQVAsTUFBQSxFQUFBN2MsT0FBQSxFQUFBd2UsWUFBQSxFQUFBRSxXQUFBLEVBQUFDLGFBQUEsRUFBQUMsZ0JBQUEsRUFBQTFJLFVBQUE7O0FBQUEsTUFBR3lCLG1CQUFvQnlCLFNBQVNDLE1BQVQsQ0FBZ0IsUUFBaEIsQ0FBdkI7QUFDQztBQ0dDOztBREZGLE1BQUcxQixxQkFBcUJ5QixTQUFTQyxNQUFULENBQWdCLFFBQWhCLENBQXhCO0FBRUNyRCxtQkFBZStILGlCQUFmLENBQWlDcEcsZ0JBQWpDLEVBQW1EdlEsUUFBbkQ7QUFFQXlWLGFBQVMsQ0FBVDtBQUNBMkIsbUJBQWV4SSxlQUFldUksZ0JBQWYsRUFBZjtBQUNBN0IsWUFBUSxJQUFJemdCLElBQUosQ0FBU2lLLFNBQVN5UixpQkFBaUJ4a0IsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEK1MsU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQVI7QUFDQXNwQixVQUFNckQsT0FBT3NELE1BQU05WCxPQUFOLEtBQWlCOFgsTUFBTUwsT0FBTixLQUFnQixFQUFoQixHQUFtQixFQUFuQixHQUFzQixFQUF0QixHQUF5QixJQUFqRCxFQUF3RGhELE1BQXhELENBQStELFVBQS9ELENBQU47QUFDQWxsQixPQUFHK25CLFFBQUgsQ0FBWXRkLElBQVosQ0FDQztBQUNDd2Qsb0JBQWNLLEdBRGY7QUFFQzVnQixhQUFPdUwsUUFGUjtBQUdDK1UsbUJBQWE7QUFDWnRkLGFBQUsyZjtBQURPO0FBSGQsS0FERCxFQVFFN3JCLE9BUkYsQ0FRVSxVQUFDa3NCLENBQUQ7QUNBTixhRENIaEMsVUFBVWdDLEVBQUVoQyxNQ0RUO0FEUko7QUFXQTZCLGtCQUFjdnFCLEdBQUcrbkIsUUFBSCxDQUFZM2xCLE9BQVosQ0FBb0I7QUFBQ3NGLGFBQU91TDtBQUFSLEtBQXBCLEVBQXVDO0FBQUNuVixZQUFNO0FBQUMwVixrQkFBVSxDQUFDO0FBQVo7QUFBUCxLQUF2QyxDQUFkO0FBQ0F5VixjQUFVc0IsWUFBWXRCLE9BQXRCO0FBQ0F3Qix1QkFBbUIsQ0FBbkI7O0FBQ0EsUUFBR3hCLFVBQVUsQ0FBYjtBQUNDLFVBQUdQLFNBQVMsQ0FBWjtBQUNDK0IsMkJBQW1CMVksU0FBU2tYLFVBQVFQLE1BQWpCLElBQTJCLENBQTlDO0FBREQ7QUFJQytCLDJCQUFtQixDQUFuQjtBQUxGO0FDV0c7O0FBQ0QsV0RMRnpxQixHQUFHNEgsTUFBSCxDQUFVZ08sTUFBVixDQUFpQnRILE1BQWpCLENBQ0M7QUFDQ3ZILFdBQUtrTTtBQUROLEtBREQsRUFJQztBQUNDb0MsWUFBTTtBQUNMNFQsaUJBQVNBLE9BREo7QUFFTCxvQ0FBNEJ3QjtBQUZ2QjtBQURQLEtBSkQsQ0NLRTtBRGxDSDtBQTBDQ0Qsb0JBQWdCM0ksZUFBZThGLHFCQUFmLENBQXFDMVUsUUFBckMsRUFBK0N1USxnQkFBL0MsQ0FBaEI7O0FBQ0EsUUFBR2dILGNBQWMsWUFBZCxNQUErQixDQUFsQztBQUVDM0kscUJBQWUrSCxpQkFBZixDQUFpQ3BHLGdCQUFqQyxFQUFtRHZRLFFBQW5EO0FBRkQ7QUFLQzhPLG1CQUFhRixlQUFlOEgsaUJBQWYsQ0FBaUMxVyxRQUFqQyxDQUFiO0FBR0FvWCxxQkFBZXhJLGVBQWV1SSxnQkFBZixFQUFmO0FBQ0FmLHdCQUFrQixJQUFJdmhCLElBQUosQ0FBU2lLLFNBQVN5UixpQkFBaUJ4a0IsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEK1MsU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQWxCO0FBQ0FzcUIsK0JBQXlCckUsT0FBT29FLGVBQVAsRUFBd0JuRSxNQUF4QixDQUErQixVQUEvQixDQUF6QjtBQUNBbGxCLFNBQUcrbkIsUUFBSCxDQUFZbnBCLE1BQVosQ0FDQztBQUNDcXBCLHNCQUFjcUIsc0JBRGY7QUFFQzVoQixlQUFPdUwsUUFGUjtBQUdDK1UscUJBQWE7QUFDWnRkLGVBQUsyZjtBQURPO0FBSGQsT0FERDtBQVVBeEkscUJBQWUrSCxpQkFBZixDQUFpQ3BHLGdCQUFqQyxFQUFtRHZRLFFBQW5EO0FBR0FwSCxnQkFBVWdXLGVBQWVrSSxXQUFmLENBQTJCOVcsUUFBM0IsRUFBcUN1USxnQkFBckMsQ0FBVjs7QUFDQSxVQUFHM1gsV0FBYUEsUUFBUTVNLE1BQVIsR0FBZSxDQUEvQjtBQUNDc0wsVUFBRXJDLElBQUYsQ0FBTzJELE9BQVAsRUFBZ0IsVUFBQ25OLENBQUQ7QUNQVixpQkRRTG1qQixlQUFlcUgsV0FBZixDQUEyQmpXLFFBQTNCLEVBQXFDdVEsZ0JBQXJDLEVBQXVEekIsVUFBdkQsRUFBbUV5SSxjQUFjLFlBQWQsQ0FBbkUsRUFBZ0c5ckIsRUFBRU4sSUFBbEcsRUFBd0dNLEVBQUUwcUIsU0FBMUcsQ0NSSztBRE9OO0FBMUJGO0FDc0JHOztBRE9Ia0IsVUFBTXJGLE9BQU8sSUFBSW5kLElBQUosQ0FBU2lLLFNBQVN5UixpQkFBaUJ4a0IsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEK1MsU0FBU3lSLGlCQUFpQnhrQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLEVBQTBGeVIsT0FBMUYsRUFBUCxFQUE0R3lVLE1BQTVHLENBQW1ILFFBQW5ILENBQU47QUNMRSxXRE1GckQsZUFBZWdDLDRCQUFmLENBQTRDeUcsR0FBNUMsRUFBaURyWCxRQUFqRCxDQ05FO0FBQ0Q7QUR2RTJDLENBQTlDOztBQThFQTRPLGVBQWVDLFdBQWYsR0FBNkIsVUFBQzdPLFFBQUQsRUFBV3NSLFlBQVgsRUFBeUIzQyxTQUF6QixFQUFvQytJLFdBQXBDLEVBQWlEbmpCLFFBQWpELEVBQTJEdWEsVUFBM0Q7QUFDNUIsTUFBQXJqQixDQUFBLEVBQUFtTixPQUFBLEVBQUErZSxXQUFBLEVBQUFoWixHQUFBLEVBQUFoUyxDQUFBLEVBQUE4SCxLQUFBLEVBQUFtakIsZ0JBQUE7QUFBQW5qQixVQUFRMUgsR0FBRzRILE1BQUgsQ0FBVXhGLE9BQVYsQ0FBa0I2USxRQUFsQixDQUFSO0FBRUFwSCxZQUFVbkUsTUFBTW1FLE9BQU4sSUFBaUIsSUFBSXBPLEtBQUosRUFBM0I7QUFFQW10QixnQkFBY3JnQixFQUFFdWdCLFVBQUYsQ0FBYXZHLFlBQWIsRUFBMkIxWSxPQUEzQixDQUFkO0FBRUFuTixNQUFJdW1CLFFBQUo7QUFDQXJULFFBQU1sVCxFQUFFcXNCLEVBQVI7QUFFQUYscUJBQW1CLElBQUlwckIsTUFBSixFQUFuQjs7QUFHQSxNQUFHaUksTUFBTWljLE9BQU4sS0FBbUIsSUFBdEI7QUFDQ2tILHFCQUFpQmxILE9BQWpCLEdBQTJCLElBQTNCO0FBQ0FrSCxxQkFBaUI1WixVQUFqQixHQUE4QixJQUFJbkosSUFBSixFQUE5QjtBQ1JDOztBRFdGK2lCLG1CQUFpQmhmLE9BQWpCLEdBQTJCMFksWUFBM0I7QUFDQXNHLG1CQUFpQnJYLFFBQWpCLEdBQTRCNUIsR0FBNUI7QUFDQWlaLG1CQUFpQnBYLFdBQWpCLEdBQStCa1gsV0FBL0I7QUFDQUUsbUJBQWlCcmpCLFFBQWpCLEdBQTRCLElBQUlNLElBQUosQ0FBU04sUUFBVCxDQUE1QjtBQUNBcWpCLG1CQUFpQkcsVUFBakIsR0FBOEJqSixVQUE5QjtBQUVBbmlCLE1BQUlJLEdBQUc0SCxNQUFILENBQVVnTyxNQUFWLENBQWlCdEgsTUFBakIsQ0FBd0I7QUFBQ3ZILFNBQUtrTTtBQUFOLEdBQXhCLEVBQXlDO0FBQUNvQyxVQUFNd1Y7QUFBUCxHQUF6QyxDQUFKOztBQUNBLE1BQUdqckIsQ0FBSDtBQUNDMkssTUFBRXJDLElBQUYsQ0FBTzBpQixXQUFQLEVBQW9CLFVBQUMzdEIsTUFBRDtBQUNuQixVQUFBZ3VCLEdBQUE7QUFBQUEsWUFBTSxJQUFJeHJCLE1BQUosRUFBTjtBQUNBd3JCLFVBQUlsa0IsR0FBSixHQUFVL0csR0FBR2lxQixrQkFBSCxDQUFzQlAsVUFBdEIsRUFBVjtBQUNBdUIsVUFBSWYsV0FBSixHQUFrQnhyQixFQUFFd21CLE1BQUYsQ0FBUyxVQUFULENBQWxCO0FBQ0ErRixVQUFJQyxRQUFKLEdBQWVQLFdBQWY7QUFDQU0sVUFBSXZqQixLQUFKLEdBQVl1TCxRQUFaO0FBQ0FnWSxVQUFJZCxTQUFKLEdBQWdCLFNBQWhCO0FBQ0FjLFVBQUlodUIsTUFBSixHQUFhQSxNQUFiO0FBQ0FndUIsVUFBSTNYLE9BQUosR0FBYzFCLEdBQWQ7QUNMRyxhRE1INVIsR0FBR2lxQixrQkFBSCxDQUFzQjNHLE1BQXRCLENBQTZCMkgsR0FBN0IsQ0NORztBREhKO0FDS0M7QUQvQjBCLENBQTdCLEM7Ozs7Ozs7Ozs7O0FFL1BBM3RCLE1BQU0sQ0FBQ3FYLE9BQVAsQ0FBZSxZQUFZO0FBRXpCLE1BQUlyWCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0I0dEIsSUFBaEIsSUFBd0I3dEIsTUFBTSxDQUFDQyxRQUFQLENBQWdCNHRCLElBQWhCLENBQXFCQyxVQUFqRCxFQUE2RDtBQUUzRCxRQUFJQyxRQUFRLEdBQUd2bEIsT0FBTyxDQUFDLGVBQUQsQ0FBdEIsQ0FGMkQsQ0FHM0Q7OztBQUNBLFFBQUl3bEIsSUFBSSxHQUFHaHVCLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQjR0QixJQUFoQixDQUFxQkMsVUFBaEM7QUFFQSxRQUFJRyxPQUFPLEdBQUcsSUFBZDtBQUVBRixZQUFRLENBQUNHLFdBQVQsQ0FBcUJGLElBQXJCLEVBQTJCaHVCLE1BQU0sQ0FBQ2tqQixlQUFQLENBQXVCLFlBQVk7QUFDNUQsVUFBSSxDQUFDK0ssT0FBTCxFQUNFO0FBQ0ZBLGFBQU8sR0FBRyxLQUFWO0FBRUFya0IsYUFBTyxDQUFDd2MsSUFBUixDQUFhLFlBQWIsRUFMNEQsQ0FNNUQ7O0FBQ0EsVUFBSStILFVBQVUsR0FBRyxVQUFVdmIsSUFBVixFQUFnQjtBQUMvQixZQUFJd2IsT0FBTyxHQUFHLEtBQUd4YixJQUFJLENBQUN5YixXQUFMLEVBQUgsR0FBc0IsR0FBdEIsSUFBMkJ6YixJQUFJLENBQUMwYixRQUFMLEtBQWdCLENBQTNDLElBQThDLEdBQTlDLEdBQW1EMWIsSUFBSSxDQUFDZ1ksT0FBTCxFQUFqRTtBQUNBLGVBQU93RCxPQUFQO0FBQ0QsT0FIRCxDQVA0RCxDQVc1RDs7O0FBQ0EsVUFBSUcsU0FBUyxHQUFHLFlBQVk7QUFDMUIsWUFBSUMsSUFBSSxHQUFHLElBQUloa0IsSUFBSixFQUFYLENBRDBCLENBQ0Q7O0FBQ3pCLFlBQUlpa0IsT0FBTyxHQUFHLElBQUlqa0IsSUFBSixDQUFTZ2tCLElBQUksQ0FBQ3JiLE9BQUwsS0FBaUIsS0FBRyxJQUFILEdBQVEsSUFBbEMsQ0FBZCxDQUYwQixDQUUrQjs7QUFDekQsZUFBT3NiLE9BQVA7QUFDRCxPQUpELENBWjRELENBaUI1RDs7O0FBQ0EsVUFBSUMsaUJBQWlCLEdBQUcsVUFBVWxkLFVBQVYsRUFBc0JwSCxLQUF0QixFQUE2QjtBQUNuRCxZQUFJdWtCLE9BQU8sR0FBR25kLFVBQVUsQ0FBQ3JFLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUS9DLEtBQUssQ0FBQyxLQUFELENBQWQ7QUFBc0IscUJBQVU7QUFBQ3drQixlQUFHLEVBQUVMLFNBQVM7QUFBZjtBQUFoQyxTQUFoQixDQUFkO0FBQ0EsZUFBT0ksT0FBTyxDQUFDdlcsS0FBUixFQUFQO0FBQ0QsT0FIRCxDQWxCNEQsQ0FzQjVEOzs7QUFDQSxVQUFJeVcsWUFBWSxHQUFHLFVBQVVyZCxVQUFWLEVBQXNCcEgsS0FBdEIsRUFBNkI7QUFDOUMsWUFBSXVrQixPQUFPLEdBQUduZCxVQUFVLENBQUNyRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQWQ7QUFDQSxlQUFPdWtCLE9BQU8sQ0FBQ3ZXLEtBQVIsRUFBUDtBQUNELE9BSEQsQ0F2QjRELENBMkI1RDs7O0FBQ0EsVUFBSTBXLFNBQVMsR0FBRyxVQUFVdGQsVUFBVixFQUFzQnBILEtBQXRCLEVBQTZCO0FBQzNDLFlBQUlzVCxLQUFLLEdBQUdsTSxVQUFVLENBQUMxTSxPQUFYLENBQW1CO0FBQUMsaUJBQU9zRixLQUFLLENBQUMsT0FBRDtBQUFiLFNBQW5CLENBQVo7QUFDQSxZQUFJdEosSUFBSSxHQUFHNGMsS0FBSyxDQUFDNWMsSUFBakI7QUFDQSxlQUFPQSxJQUFQO0FBQ0QsT0FKRCxDQTVCNEQsQ0FpQzVEOzs7QUFDQSxVQUFJaXVCLFNBQVMsR0FBRyxVQUFVdmQsVUFBVixFQUFzQnBILEtBQXRCLEVBQTZCO0FBQzNDLFlBQUkya0IsU0FBUyxHQUFHLENBQWhCO0FBQ0EsWUFBSUMsTUFBTSxHQUFHdHNCLEVBQUUsQ0FBQ3FLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDLG1CQUFTL0MsS0FBSyxDQUFDLEtBQUQ7QUFBZixTQUFwQixFQUE2QztBQUFDNEMsZ0JBQU0sRUFBRTtBQUFDakksZ0JBQUksRUFBRTtBQUFQO0FBQVQsU0FBN0MsQ0FBYjtBQUNBaXFCLGNBQU0sQ0FBQzl0QixPQUFQLENBQWUsVUFBVSt0QixLQUFWLEVBQWlCO0FBQzlCLGNBQUlscUIsSUFBSSxHQUFHeU0sVUFBVSxDQUFDMU0sT0FBWCxDQUFtQjtBQUFDLG1CQUFNbXFCLEtBQUssQ0FBQyxNQUFEO0FBQVosV0FBbkIsQ0FBWDs7QUFDQSxjQUFHbHFCLElBQUksSUFBS2dxQixTQUFTLEdBQUdocUIsSUFBSSxDQUFDaVQsVUFBN0IsRUFBeUM7QUFDdkMrVyxxQkFBUyxHQUFHaHFCLElBQUksQ0FBQ2lULFVBQWpCO0FBQ0Q7QUFDRixTQUxEO0FBTUEsZUFBTytXLFNBQVA7QUFDRCxPQVZELENBbEM0RCxDQTZDNUQ7OztBQUNBLFVBQUlHLFlBQVksR0FBRyxVQUFVMWQsVUFBVixFQUFzQnBILEtBQXRCLEVBQTZCO0FBQzlDLFlBQUlxSCxHQUFHLEdBQUdELFVBQVUsQ0FBQ3JFLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUy9DLEtBQUssQ0FBQyxLQUFEO0FBQWYsU0FBaEIsRUFBeUM7QUFBQzVKLGNBQUksRUFBRTtBQUFDMFYsb0JBQVEsRUFBRSxDQUFDO0FBQVosV0FBUDtBQUF1QitPLGVBQUssRUFBRTtBQUE5QixTQUF6QyxDQUFWO0FBQ0EsWUFBSWtLLE1BQU0sR0FBRzFkLEdBQUcsQ0FBQ3BFLEtBQUosRUFBYjtBQUNBLFlBQUc4aEIsTUFBTSxDQUFDeHRCLE1BQVAsR0FBZ0IsQ0FBbkIsRUFDRSxJQUFJeXRCLEdBQUcsR0FBR0QsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFValosUUFBcEI7QUFDQSxlQUFPa1osR0FBUDtBQUNILE9BTkQsQ0E5QzRELENBcUQ1RDs7O0FBQ0EsVUFBSUMsZ0JBQWdCLEdBQUcsVUFBVTdkLFVBQVYsRUFBc0JwSCxLQUF0QixFQUE2QjtBQUNsRCxZQUFJa2xCLE9BQU8sR0FBRyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLENBQWQ7QUFDQSxZQUFJQyxLQUFLLEdBQUdoZSxVQUFVLENBQUNyRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQVo7QUFDQW9sQixhQUFLLENBQUN0dUIsT0FBTixDQUFjLFVBQVV1dUIsSUFBVixFQUFnQjtBQUM1QixjQUFJQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQ0gsS0FBSixDQUFVcmlCLElBQVYsQ0FBZTtBQUFDLG9CQUFPc2lCLElBQUksQ0FBQyxLQUFEO0FBQVosV0FBZixDQUFYO0FBQ0FDLGNBQUksQ0FBQ3h1QixPQUFMLENBQWEsVUFBVTB1QixHQUFWLEVBQWU7QUFDMUJOLG1CQUFPLEdBQUdNLEdBQUcsQ0FBQ0MsUUFBSixDQUFheHBCLElBQXZCO0FBQ0FrcEIsbUJBQU8sSUFBSUQsT0FBWDtBQUNELFdBSEQ7QUFJRCxTQU5EO0FBT0EsZUFBT0MsT0FBUDtBQUNELE9BWkQsQ0F0RDRELENBbUU1RDs7O0FBQ0EsVUFBSU8scUJBQXFCLEdBQUcsVUFBVXRlLFVBQVYsRUFBc0JwSCxLQUF0QixFQUE2QjtBQUN2RCxZQUFJa2xCLE9BQU8sR0FBRyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLENBQWQ7QUFDQSxZQUFJQyxLQUFLLEdBQUdoZSxVQUFVLENBQUNyRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQVo7QUFDQW9sQixhQUFLLENBQUN0dUIsT0FBTixDQUFjLFVBQVV1dUIsSUFBVixFQUFnQjtBQUM1QixjQUFJQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQ0gsS0FBSixDQUFVcmlCLElBQVYsQ0FBZTtBQUFDLG9CQUFRc2lCLElBQUksQ0FBQyxLQUFELENBQWI7QUFBc0IsMEJBQWM7QUFBQ2IsaUJBQUcsRUFBRUwsU0FBUztBQUFmO0FBQXBDLFdBQWYsQ0FBWDtBQUNBbUIsY0FBSSxDQUFDeHVCLE9BQUwsQ0FBYSxVQUFVMHVCLEdBQVYsRUFBZTtBQUMxQk4sbUJBQU8sR0FBR00sR0FBRyxDQUFDQyxRQUFKLENBQWF4cEIsSUFBdkI7QUFDQWtwQixtQkFBTyxJQUFJRCxPQUFYO0FBQ0QsV0FIRDtBQUlELFNBTkQ7QUFPQSxlQUFPQyxPQUFQO0FBQ0QsT0FaRCxDQXBFNEQsQ0FpRjVEOzs7QUFDQTdzQixRQUFFLENBQUM0SCxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQyxtQkFBVTtBQUFYLE9BQWYsRUFBaUNqTSxPQUFqQyxDQUF5QyxVQUFVa0osS0FBVixFQUFpQjtBQUN4RDFILFVBQUUsQ0FBQ3F0QixrQkFBSCxDQUFzQi9KLE1BQXRCLENBQTZCO0FBQzNCNWIsZUFBSyxFQUFFQSxLQUFLLENBQUMsS0FBRCxDQURlO0FBRTNCNGxCLG9CQUFVLEVBQUU1bEIsS0FBSyxDQUFDLE1BQUQsQ0FGVTtBQUczQnVoQixpQkFBTyxFQUFFdmhCLEtBQUssQ0FBQyxTQUFELENBSGE7QUFJM0I2bEIsb0JBQVUsRUFBRW5CLFNBQVMsQ0FBQ3BzQixFQUFFLENBQUNvTixLQUFKLEVBQVcxRixLQUFYLENBSk07QUFLM0I0TCxpQkFBTyxFQUFFLElBQUl4TCxJQUFKLEVBTGtCO0FBTTNCMGxCLGlCQUFPLEVBQUM7QUFDTnBnQixpQkFBSyxFQUFFK2UsWUFBWSxDQUFDbnNCLEVBQUUsQ0FBQ3FLLFdBQUosRUFBaUIzQyxLQUFqQixDQURiO0FBRU53Qyx5QkFBYSxFQUFFaWlCLFlBQVksQ0FBQ25zQixFQUFFLENBQUNrSyxhQUFKLEVBQW1CeEMsS0FBbkIsQ0FGckI7QUFHTjROLHNCQUFVLEVBQUUrVyxTQUFTLENBQUNyc0IsRUFBRSxDQUFDb04sS0FBSixFQUFXMUYsS0FBWDtBQUhmLFdBTm1CO0FBVzNCK2xCLGtCQUFRLEVBQUM7QUFDUEMsaUJBQUssRUFBRXZCLFlBQVksQ0FBQ25zQixFQUFFLENBQUMwdEIsS0FBSixFQUFXaG1CLEtBQVgsQ0FEWjtBQUVQaW1CLGlCQUFLLEVBQUV4QixZQUFZLENBQUNuc0IsRUFBRSxDQUFDMnRCLEtBQUosRUFBV2ptQixLQUFYLENBRlo7QUFHUGttQixzQkFBVSxFQUFFekIsWUFBWSxDQUFDbnNCLEVBQUUsQ0FBQzR0QixVQUFKLEVBQWdCbG1CLEtBQWhCLENBSGpCO0FBSVBtbUIsMEJBQWMsRUFBRTFCLFlBQVksQ0FBQ25zQixFQUFFLENBQUM2dEIsY0FBSixFQUFvQm5tQixLQUFwQixDQUpyQjtBQUtQb21CLHFCQUFTLEVBQUUzQixZQUFZLENBQUNuc0IsRUFBRSxDQUFDOHRCLFNBQUosRUFBZXBtQixLQUFmLENBTGhCO0FBTVBxbUIsbUNBQXVCLEVBQUV2QixZQUFZLENBQUN4c0IsRUFBRSxDQUFDOHRCLFNBQUosRUFBZXBtQixLQUFmLENBTjlCO0FBT1BzbUIsdUJBQVcsRUFBRWhDLGlCQUFpQixDQUFDaHNCLEVBQUUsQ0FBQzB0QixLQUFKLEVBQVdobUIsS0FBWCxDQVB2QjtBQVFQdW1CLHVCQUFXLEVBQUVqQyxpQkFBaUIsQ0FBQ2hzQixFQUFFLENBQUMydEIsS0FBSixFQUFXam1CLEtBQVgsQ0FSdkI7QUFTUHdtQiwyQkFBZSxFQUFFbEMsaUJBQWlCLENBQUNoc0IsRUFBRSxDQUFDOHRCLFNBQUosRUFBZXBtQixLQUFmO0FBVDNCLFdBWGtCO0FBc0IzQnltQixhQUFHLEVBQUU7QUFDSEMsaUJBQUssRUFBRWpDLFlBQVksQ0FBQ25zQixFQUFFLENBQUNxdUIsU0FBSixFQUFlM21CLEtBQWYsQ0FEaEI7QUFFSG9sQixpQkFBSyxFQUFFWCxZQUFZLENBQUNuc0IsRUFBRSxDQUFDc3VCLFNBQUosRUFBZTVtQixLQUFmLENBRmhCO0FBR0g2bUIsK0JBQW1CLEVBQUUvQixZQUFZLENBQUN4c0IsRUFBRSxDQUFDc3VCLFNBQUosRUFBZTVtQixLQUFmLENBSDlCO0FBSUg4bUIsa0NBQXNCLEVBQUU3QixnQkFBZ0IsQ0FBQzNzQixFQUFFLENBQUNzdUIsU0FBSixFQUFlNW1CLEtBQWYsQ0FKckM7QUFLSCttQixvQkFBUSxFQUFFdEMsWUFBWSxDQUFDbnNCLEVBQUUsQ0FBQzB1QixZQUFKLEVBQWtCaG5CLEtBQWxCLENBTG5CO0FBTUhpbkIsdUJBQVcsRUFBRTNDLGlCQUFpQixDQUFDaHNCLEVBQUUsQ0FBQ3F1QixTQUFKLEVBQWUzbUIsS0FBZixDQU4zQjtBQU9Ia25CLHVCQUFXLEVBQUU1QyxpQkFBaUIsQ0FBQ2hzQixFQUFFLENBQUNzdUIsU0FBSixFQUFlNW1CLEtBQWYsQ0FQM0I7QUFRSG1uQiwwQkFBYyxFQUFFN0MsaUJBQWlCLENBQUNoc0IsRUFBRSxDQUFDMHVCLFlBQUosRUFBa0JobkIsS0FBbEIsQ0FSOUI7QUFTSG9uQix3Q0FBNEIsRUFBRTFCLHFCQUFxQixDQUFDcHRCLEVBQUUsQ0FBQ3N1QixTQUFKLEVBQWU1bUIsS0FBZjtBQVRoRDtBQXRCc0IsU0FBN0I7QUFrQ0QsT0FuQ0Q7QUFxQ0FSLGFBQU8sQ0FBQytjLE9BQVIsQ0FBZ0IsWUFBaEI7QUFFQXNILGFBQU8sR0FBRyxJQUFWO0FBRUQsS0EzSDBCLEVBMkh4QixVQUFVbmxCLENBQVYsRUFBYTtBQUNkYyxhQUFPLENBQUM4YSxHQUFSLENBQVksMkNBQVo7QUFDQTlhLGFBQU8sQ0FBQzhhLEdBQVIsQ0FBWTViLENBQUMsQ0FBQ2dCLEtBQWQ7QUFDRCxLQTlIMEIsQ0FBM0I7QUFnSUQ7QUFFRixDQTVJRCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTlKLE9BQU9xWCxPQUFQLENBQWU7QUNDYixTREFFb2EsV0FBV3ZYLEdBQVgsQ0FDSTtBQUFBd1gsYUFBUyxDQUFUO0FBQ0E1d0IsVUFBTSxnREFETjtBQUVBNndCLFFBQUk7QUFDQSxVQUFBN29CLENBQUEsRUFBQW1HLENBQUEsRUFBQTJpQixtQkFBQTtBQUFBaG9CLGNBQVF3YyxJQUFSLENBQWEsc0JBQWI7O0FBQ0E7QUFDSXdMLDhCQUFzQixVQUFDQyxTQUFELEVBQVlsYyxRQUFaLEVBQXNCbWMsV0FBdEIsRUFBbUNDLGNBQW5DLEVBQW1EQyxTQUFuRDtBQUNsQixjQUFBQyxRQUFBO0FBQUFBLHFCQUFXO0FBQUNDLG9CQUFRTCxTQUFUO0FBQW9CblUsbUJBQU9xVSxlQUFlLFlBQWYsQ0FBM0I7QUFBeUQ5Qix3QkFBWThCLGVBQWUsaUJBQWYsQ0FBckU7QUFBd0czbkIsbUJBQU91TCxRQUEvRztBQUF5SHdjLHNCQUFVTCxXQUFuSTtBQUFnSk0scUJBQVNMLGVBQWUsU0FBZjtBQUF6SixXQUFYOztBQUNBLGNBQUdDLFNBQUg7QUFDSUMscUJBQVNJLE9BQVQsR0FBbUIsSUFBbkI7QUNVYjs7QUFDRCxpQkRUVTFDLElBQUlhLFNBQUosQ0FBY3hmLE1BQWQsQ0FBcUI7QUFBQ3ZILGlCQUFLc29CLGVBQWUsTUFBZjtBQUFOLFdBQXJCLEVBQW9EO0FBQUNoYSxrQkFBTTtBQUFDa2Esd0JBQVVBO0FBQVg7QUFBUCxXQUFwRCxDQ1NWO0FEZDRCLFNBQXRCOztBQU1BaGpCLFlBQUksQ0FBSjtBQUNBdk0sV0FBRzh0QixTQUFILENBQWFyakIsSUFBYixDQUFrQjtBQUFDLGlDQUF1QjtBQUFDcVIscUJBQVM7QUFBVjtBQUF4QixTQUFsQixFQUE0RDtBQUFDaGUsZ0JBQU07QUFBQzBWLHNCQUFVLENBQUM7QUFBWixXQUFQO0FBQXVCbEosa0JBQVE7QUFBQzVDLG1CQUFPLENBQVI7QUFBV2tvQix5QkFBYTtBQUF4QjtBQUEvQixTQUE1RCxFQUF3SHB4QixPQUF4SCxDQUFnSSxVQUFDcXhCLEdBQUQ7QUFDNUgsY0FBQUMsT0FBQSxFQUFBVixXQUFBLEVBQUFuYyxRQUFBO0FBQUE2YyxvQkFBVUQsSUFBSUQsV0FBZDtBQUNBM2MscUJBQVc0YyxJQUFJbm9CLEtBQWY7QUFDQTBuQix3QkFBY1MsSUFBSTlvQixHQUFsQjtBQUNBK29CLGtCQUFRdHhCLE9BQVIsQ0FBZ0IsVUFBQzB1QixHQUFEO0FBQ1osZ0JBQUE2QyxXQUFBLEVBQUFaLFNBQUE7QUFBQVksMEJBQWM3QyxJQUFJeUMsT0FBbEI7QUFDQVIsd0JBQVlZLFlBQVlDLElBQXhCO0FBQ0FkLGdDQUFvQkMsU0FBcEIsRUFBK0JsYyxRQUEvQixFQUF5Q21jLFdBQXpDLEVBQXNEVyxXQUF0RCxFQUFtRSxJQUFuRTs7QUFFQSxnQkFBRzdDLElBQUkrQyxRQUFQO0FDOEJWLHFCRDdCYy9DLElBQUkrQyxRQUFKLENBQWF6eEIsT0FBYixDQUFxQixVQUFDMHhCLEdBQUQ7QUM4QmpDLHVCRDdCZ0JoQixvQkFBb0JDLFNBQXBCLEVBQStCbGMsUUFBL0IsRUFBeUNtYyxXQUF6QyxFQUFzRGMsR0FBdEQsRUFBMkQsS0FBM0QsQ0M2QmhCO0FEOUJZLGdCQzZCZDtBQUdEO0FEdENPO0FDd0NWLGlCRC9CVTNqQixHQytCVjtBRDVDTTtBQVJKLGVBQUF4RyxLQUFBO0FBdUJNSyxZQUFBTCxLQUFBO0FBQ0ZtQixnQkFBUW5CLEtBQVIsQ0FBY0ssQ0FBZDtBQ2lDVDs7QUFDRCxhRGhDTWMsUUFBUStjLE9BQVIsQ0FBZ0Isc0JBQWhCLENDZ0NOO0FEOURFO0FBK0JBa00sVUFBTTtBQ2tDUixhRGpDTWpwQixRQUFROGEsR0FBUixDQUFZLGdCQUFaLENDaUNOO0FEakVFO0FBQUEsR0FESixDQ0FGO0FEREYsRzs7Ozs7Ozs7Ozs7O0FFQUExa0IsT0FBT3FYLE9BQVAsQ0FBZTtBQ0NiLFNEQUVvYSxXQUFXdlgsR0FBWCxDQUNJO0FBQUF3WCxhQUFTLENBQVQ7QUFDQTV3QixVQUFNLHNCQUROO0FBRUE2d0IsUUFBSTtBQUNBLFVBQUFuZ0IsVUFBQSxFQUFBMUksQ0FBQTtBQUFBYyxjQUFROGEsR0FBUixDQUFZLGNBQVo7QUFDQTlhLGNBQVF3YyxJQUFSLENBQWEsb0JBQWI7O0FBQ0E7QUFDSTVVLHFCQUFhOU8sR0FBR3FLLFdBQWhCO0FBQ0F5RSxtQkFBV3JFLElBQVgsQ0FBZ0I7QUFBQ1AseUJBQWU7QUFBQzRSLHFCQUFTO0FBQVY7QUFBaEIsU0FBaEIsRUFBbUQ7QUFBQ3hSLGtCQUFRO0FBQUM4bEIsMEJBQWM7QUFBZjtBQUFULFNBQW5ELEVBQWdGNXhCLE9BQWhGLENBQXdGLFVBQUNraEIsRUFBRDtBQUNwRixjQUFHQSxHQUFHMFEsWUFBTjtBQ1VSLG1CRFRZdGhCLFdBQVc4RyxNQUFYLENBQWtCdEgsTUFBbEIsQ0FBeUJvUixHQUFHM1ksR0FBNUIsRUFBaUM7QUFBQ3NPLG9CQUFNO0FBQUNuTCwrQkFBZSxDQUFDd1YsR0FBRzBRLFlBQUo7QUFBaEI7QUFBUCxhQUFqQyxDQ1NaO0FBS0Q7QURoQks7QUFGSixlQUFBcnFCLEtBQUE7QUFNTUssWUFBQUwsS0FBQTtBQUNGbUIsZ0JBQVFuQixLQUFSLENBQWNLLENBQWQ7QUNnQlQ7O0FBQ0QsYURmTWMsUUFBUStjLE9BQVIsQ0FBZ0Isb0JBQWhCLENDZU47QUQ3QkU7QUFlQWtNLFVBQU07QUNpQlIsYURoQk1qcEIsUUFBUThhLEdBQVIsQ0FBWSxnQkFBWixDQ2dCTjtBRGhDRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBMWtCLE9BQU9xWCxPQUFQLENBQWU7QUNDYixTREFFb2EsV0FBV3ZYLEdBQVgsQ0FDSTtBQUFBd1gsYUFBUyxDQUFUO0FBQ0E1d0IsVUFBTSx3QkFETjtBQUVBNndCLFFBQUk7QUFDQSxVQUFBbmdCLFVBQUEsRUFBQTFJLENBQUE7QUFBQWMsY0FBUThhLEdBQVIsQ0FBWSxjQUFaO0FBQ0E5YSxjQUFRd2MsSUFBUixDQUFhLDBCQUFiOztBQUNBO0FBQ0k1VSxxQkFBYTlPLEdBQUdxSyxXQUFoQjtBQUNBeUUsbUJBQVdyRSxJQUFYLENBQWdCO0FBQUNnTCxpQkFBTztBQUFDcUcscUJBQVM7QUFBVjtBQUFSLFNBQWhCLEVBQTJDO0FBQUN4UixrQkFBUTtBQUFDakksa0JBQU07QUFBUDtBQUFULFNBQTNDLEVBQWdFN0QsT0FBaEUsQ0FBd0UsVUFBQ2toQixFQUFEO0FBQ3BFLGNBQUE1SixPQUFBLEVBQUFtRCxDQUFBOztBQUFBLGNBQUd5RyxHQUFHcmQsSUFBTjtBQUNJNFcsZ0JBQUlqWixHQUFHb04sS0FBSCxDQUFTaEwsT0FBVCxDQUFpQjtBQUFDMkUsbUJBQUsyWSxHQUFHcmQ7QUFBVCxhQUFqQixFQUFpQztBQUFDaUksc0JBQVE7QUFBQ3FMLHdCQUFRO0FBQVQ7QUFBVCxhQUFqQyxDQUFKOztBQUNBLGdCQUFHc0QsS0FBS0EsRUFBRXRELE1BQVAsSUFBaUJzRCxFQUFFdEQsTUFBRixDQUFTMVcsTUFBVCxHQUFrQixDQUF0QztBQUNJLGtCQUFHLDJGQUEyRmtDLElBQTNGLENBQWdHOFgsRUFBRXRELE1BQUYsQ0FBUyxDQUFULEVBQVlHLE9BQTVHLENBQUg7QUFDSUEsMEJBQVVtRCxFQUFFdEQsTUFBRixDQUFTLENBQVQsRUFBWUcsT0FBdEI7QUNpQmhCLHVCRGhCZ0JoSCxXQUFXOEcsTUFBWCxDQUFrQnRILE1BQWxCLENBQXlCb1IsR0FBRzNZLEdBQTVCLEVBQWlDO0FBQUNzTyx3QkFBTTtBQUFDSSwyQkFBT0s7QUFBUjtBQUFQLGlCQUFqQyxDQ2dCaEI7QURuQlE7QUFGSjtBQzRCVDtBRDdCSztBQUZKLGVBQUEvUCxLQUFBO0FBV01LLFlBQUFMLEtBQUE7QUFDRm1CLGdCQUFRbkIsS0FBUixDQUFjSyxDQUFkO0FDd0JUOztBQUNELGFEdkJNYyxRQUFRK2MsT0FBUixDQUFnQiwwQkFBaEIsQ0N1Qk47QUQxQ0U7QUFvQkFrTSxVQUFNO0FDeUJSLGFEeEJNanBCLFFBQVE4YSxHQUFSLENBQVksZ0JBQVosQ0N3Qk47QUQ3Q0U7QUFBQSxHQURKLENDQUY7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQTFrQixPQUFPcVgsT0FBUCxDQUFlO0FDQ2IsU0RBRW9hLFdBQVd2WCxHQUFYLENBQ0k7QUFBQXdYLGFBQVMsQ0FBVDtBQUNBNXdCLFVBQU0sMEJBRE47QUFFQTZ3QixRQUFJO0FBQ0EsVUFBQTdvQixDQUFBO0FBQUFjLGNBQVE4YSxHQUFSLENBQVksY0FBWjtBQUNBOWEsY0FBUXdjLElBQVIsQ0FBYSwrQkFBYjs7QUFDQTtBQUNJMWpCLFdBQUdrSyxhQUFILENBQWlCMEwsTUFBakIsQ0FBd0J0SCxNQUF4QixDQUErQjtBQUFDcFEsbUJBQVM7QUFBQzRkLHFCQUFTO0FBQVY7QUFBVixTQUEvQixFQUE0RDtBQUFDekcsZ0JBQU07QUFBQ25YLHFCQUFTO0FBQVY7QUFBUCxTQUE1RCxFQUFvRjtBQUFDcVksaUJBQU87QUFBUixTQUFwRjtBQURKLGVBQUF4USxLQUFBO0FBRU1LLFlBQUFMLEtBQUE7QUFDRm1CLGdCQUFRbkIsS0FBUixDQUFjSyxDQUFkO0FDYVQ7O0FBQ0QsYURaTWMsUUFBUStjLE9BQVIsQ0FBZ0IsK0JBQWhCLENDWU47QUR0QkU7QUFXQWtNLFVBQU07QUNjUixhRGJNanBCLFFBQVE4YSxHQUFSLENBQVksZ0JBQVosQ0NhTjtBRHpCRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBMWtCLE9BQU9xWCxPQUFQLENBQWU7QUNDYixTREFEb2EsV0FBV3ZYLEdBQVgsQ0FDQztBQUFBd1gsYUFBUyxDQUFUO0FBQ0E1d0IsVUFBTSxxQ0FETjtBQUVBNndCLFFBQUk7QUFDSCxVQUFBN29CLENBQUE7QUFBQWMsY0FBUThhLEdBQVIsQ0FBWSxjQUFaO0FBQ0E5YSxjQUFRd2MsSUFBUixDQUFhLDhCQUFiOztBQUNBO0FBRUMxakIsV0FBR3FLLFdBQUgsQ0FBZUksSUFBZixHQUFzQmpNLE9BQXRCLENBQThCLFVBQUNraEIsRUFBRDtBQUM3QixjQUFBMlEsV0FBQSxFQUFBQyxXQUFBLEVBQUExd0IsQ0FBQSxFQUFBMndCLGVBQUEsRUFBQUMsUUFBQTs7QUFBQSxjQUFHLENBQUk5USxHQUFHeFYsYUFBVjtBQUNDO0FDRUs7O0FERE4sY0FBR3dWLEdBQUd4VixhQUFILENBQWlCakwsTUFBakIsS0FBMkIsQ0FBOUI7QUFDQ294QiwwQkFBY3J3QixHQUFHa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0JpVixHQUFHeFYsYUFBSCxDQUFpQixDQUFqQixDQUF0QixFQUEyQ3dMLEtBQTNDLEVBQWQ7O0FBQ0EsZ0JBQUcyYSxnQkFBZSxDQUFsQjtBQUNDRyx5QkFBV3h3QixHQUFHa0ssYUFBSCxDQUFpQjlILE9BQWpCLENBQXlCO0FBQUNzRix1QkFBT2dZLEdBQUdoWSxLQUFYO0FBQWtCOG5CLHdCQUFRO0FBQTFCLGVBQXpCLENBQVg7O0FBQ0Esa0JBQUdnQixRQUFIO0FBQ0M1d0Isb0JBQUlJLEdBQUdxSyxXQUFILENBQWV1TCxNQUFmLENBQXNCdEgsTUFBdEIsQ0FBNkI7QUFBQ3ZILHVCQUFLMlksR0FBRzNZO0FBQVQsaUJBQTdCLEVBQTRDO0FBQUNzTyx3QkFBTTtBQUFDbkwsbUNBQWUsQ0FBQ3NtQixTQUFTenBCLEdBQVYsQ0FBaEI7QUFBZ0NxcEIsa0NBQWNJLFNBQVN6cEI7QUFBdkQ7QUFBUCxpQkFBNUMsQ0FBSjs7QUFDQSxvQkFBR25ILENBQUg7QUNhVSx5QkRaVDR3QixTQUFTQyxXQUFULEVDWVM7QURmWDtBQUFBO0FBS0N2cEIsd0JBQVFuQixLQUFSLENBQWMsOEJBQWQ7QUNjUSx1QkRiUm1CLFFBQVFuQixLQUFSLENBQWMyWixHQUFHM1ksR0FBakIsQ0NhUTtBRHJCVjtBQUZEO0FBQUEsaUJBV0ssSUFBRzJZLEdBQUd4VixhQUFILENBQWlCakwsTUFBakIsR0FBMEIsQ0FBN0I7QUFDSnN4Qiw4QkFBa0IsRUFBbEI7QUFDQTdRLGVBQUd4VixhQUFILENBQWlCMUwsT0FBakIsQ0FBeUIsVUFBQzhjLENBQUQ7QUFDeEIrVSw0QkFBY3J3QixHQUFHa0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I2USxDQUF0QixFQUF5QjVGLEtBQXpCLEVBQWQ7O0FBQ0Esa0JBQUcyYSxnQkFBZSxDQUFsQjtBQ2dCUyx1QkRmUkUsZ0JBQWdCNXhCLElBQWhCLENBQXFCMmMsQ0FBckIsQ0NlUTtBQUNEO0FEbkJUOztBQUlBLGdCQUFHaVYsZ0JBQWdCdHhCLE1BQWhCLEdBQXlCLENBQTVCO0FBQ0NxeEIsNEJBQWMvbEIsRUFBRXVnQixVQUFGLENBQWFwTCxHQUFHeFYsYUFBaEIsRUFBK0JxbUIsZUFBL0IsQ0FBZDs7QUFDQSxrQkFBR0QsWUFBWTl3QixRQUFaLENBQXFCa2dCLEdBQUcwUSxZQUF4QixDQUFIO0FDa0JTLHVCRGpCUnB3QixHQUFHcUssV0FBSCxDQUFldUwsTUFBZixDQUFzQnRILE1BQXRCLENBQTZCO0FBQUN2SCx1QkFBSzJZLEdBQUczWTtBQUFULGlCQUE3QixFQUE0QztBQUFDc08sd0JBQU07QUFBQ25MLG1DQUFlb21CO0FBQWhCO0FBQVAsaUJBQTVDLENDaUJRO0FEbEJUO0FDMEJTLHVCRHZCUnR3QixHQUFHcUssV0FBSCxDQUFldUwsTUFBZixDQUFzQnRILE1BQXRCLENBQTZCO0FBQUN2SCx1QkFBSzJZLEdBQUczWTtBQUFULGlCQUE3QixFQUE0QztBQUFDc08sd0JBQU07QUFBQ25MLG1DQUFlb21CLFdBQWhCO0FBQTZCRixrQ0FBY0UsWUFBWSxDQUFaO0FBQTNDO0FBQVAsaUJBQTVDLENDdUJRO0FENUJWO0FBTkk7QUM0Q0M7QUQxRFA7QUFGRCxlQUFBdnFCLEtBQUE7QUE2Qk1LLFlBQUFMLEtBQUE7QUFDTG1CLGdCQUFRbkIsS0FBUixDQUFjLDhCQUFkO0FBQ0FtQixnQkFBUW5CLEtBQVIsQ0FBY0ssRUFBRWdCLEtBQWhCO0FDbUNHOztBQUNELGFEbENIRixRQUFRK2MsT0FBUixDQUFnQiw4QkFBaEIsQ0NrQ0c7QUR4RUo7QUF1Q0FrTSxVQUFNO0FDb0NGLGFEbkNIanBCLFFBQVE4YSxHQUFSLENBQVksZ0JBQVosQ0NtQ0c7QUQzRUo7QUFBQSxHQURELENDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQTFrQixPQUFPcVgsT0FBUCxDQUFlO0FDQ2IsU0RBRG9hLFdBQVd2WCxHQUFYLENBQ0M7QUFBQXdYLGFBQVMsQ0FBVDtBQUNBNXdCLFVBQU0sUUFETjtBQUVBNndCLFFBQUk7QUFDSCxVQUFBN29CLENBQUEsRUFBQTZLLFVBQUE7QUFBQS9KLGNBQVE4YSxHQUFSLENBQVksY0FBWjtBQUNBOWEsY0FBUXdjLElBQVIsQ0FBYSxpQkFBYjs7QUFDQTtBQUVDMWpCLFdBQUc2TCxPQUFILENBQVdqTixNQUFYLENBQWtCLEVBQWxCO0FBRUFvQixXQUFHNkwsT0FBSCxDQUFXeVgsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyxtQkFEVTtBQUVqQixxQkFBVyxtQkFGTTtBQUdqQixrQkFBUSxtQkFIUztBQUlqQixxQkFBVyxRQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFTQXRqQixXQUFHNkwsT0FBSCxDQUFXeVgsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyx1QkFEVTtBQUVqQixxQkFBVyx1QkFGTTtBQUdqQixrQkFBUSx1QkFIUztBQUlqQixxQkFBVyxXQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFTQXRqQixXQUFHNkwsT0FBSCxDQUFXeVgsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyxxQkFEVTtBQUVqQixxQkFBVyxxQkFGTTtBQUdqQixrQkFBUSxxQkFIUztBQUlqQixxQkFBVyxXQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFVQXJTLHFCQUFhLElBQUluSixJQUFKLENBQVNtZCxPQUFPLElBQUluZCxJQUFKLEVBQVAsRUFBaUJvZCxNQUFqQixDQUF3QixZQUF4QixDQUFULENBQWI7QUFDQWxsQixXQUFHNEgsTUFBSCxDQUFVNkMsSUFBVixDQUFlO0FBQUNrWixtQkFBUyxJQUFWO0FBQWdCcUgsc0JBQVk7QUFBQ2xQLHFCQUFTO0FBQVYsV0FBNUI7QUFBOENqUSxtQkFBUztBQUFDaVEscUJBQVM7QUFBVjtBQUF2RCxTQUFmLEVBQXdGdGQsT0FBeEYsQ0FBZ0csVUFBQ29sQixDQUFEO0FBQy9GLGNBQUFxRixPQUFBLEVBQUE3aUIsQ0FBQSxFQUFBb0IsUUFBQSxFQUFBZ2QsVUFBQSxFQUFBa00sTUFBQSxFQUFBQyxPQUFBLEVBQUE1TyxVQUFBOztBQUFBO0FBQ0M0TyxzQkFBVSxFQUFWO0FBQ0E1Tyx5QkFBYS9oQixHQUFHcUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUMvQyxxQkFBT2tjLEVBQUU3YyxHQUFWO0FBQWUwWSw2QkFBZTtBQUE5QixhQUFwQixFQUF5RC9KLEtBQXpELEVBQWI7QUFDQWliLG9CQUFRM0YsVUFBUixHQUFxQmpKLFVBQXJCO0FBQ0FrSCxzQkFBVXJGLEVBQUVxRixPQUFaOztBQUNBLGdCQUFHQSxVQUFVLENBQWI7QUFDQ3lILHVCQUFTLENBQVQ7QUFDQWxNLDJCQUFhLENBQWI7O0FBQ0FqYSxnQkFBRXJDLElBQUYsQ0FBTzBiLEVBQUUvWCxPQUFULEVBQWtCLFVBQUMra0IsRUFBRDtBQUNqQixvQkFBQTN6QixNQUFBO0FBQUFBLHlCQUFTK0MsR0FBRzZMLE9BQUgsQ0FBV3pKLE9BQVgsQ0FBbUI7QUFBQ2hFLHdCQUFNd3lCO0FBQVAsaUJBQW5CLENBQVQ7O0FBQ0Esb0JBQUczekIsVUFBV0EsT0FBT21zQixTQUFyQjtBQ1dVLHlCRFZUNUUsY0FBY3ZuQixPQUFPbXNCLFNDVVo7QUFDRDtBRGRWOztBQUlBc0gsdUJBQVMzZSxTQUFTLENBQUNrWCxXQUFTekUsYUFBV3pDLFVBQXBCLENBQUQsRUFBa0NsaEIsT0FBbEMsRUFBVCxJQUF3RCxDQUFqRTtBQUNBMkcseUJBQVcsSUFBSU0sSUFBSixFQUFYO0FBQ0FOLHVCQUFTcXBCLFFBQVQsQ0FBa0JycEIsU0FBU29rQixRQUFULEtBQW9COEUsTUFBdEM7QUFDQWxwQix5QkFBVyxJQUFJTSxJQUFKLENBQVNtZCxPQUFPemQsUUFBUCxFQUFpQjBkLE1BQWpCLENBQXdCLFlBQXhCLENBQVQsQ0FBWDtBQUNBeUwsc0JBQVExZixVQUFSLEdBQXFCQSxVQUFyQjtBQUNBMGYsc0JBQVFucEIsUUFBUixHQUFtQkEsUUFBbkI7QUFaRCxtQkFjSyxJQUFHeWhCLFdBQVcsQ0FBZDtBQUNKMEgsc0JBQVExZixVQUFSLEdBQXFCQSxVQUFyQjtBQUNBMGYsc0JBQVFucEIsUUFBUixHQUFtQixJQUFJTSxJQUFKLEVBQW5CO0FDWU07O0FEVlA4YixjQUFFL1gsT0FBRixDQUFVbE4sSUFBVixDQUFlLG1CQUFmO0FBQ0FneUIsb0JBQVE5a0IsT0FBUixHQUFrQnRCLEVBQUU4QixJQUFGLENBQU91WCxFQUFFL1gsT0FBVCxDQUFsQjtBQ1lNLG1CRFhON0wsR0FBRzRILE1BQUgsQ0FBVWdPLE1BQVYsQ0FBaUJ0SCxNQUFqQixDQUF3QjtBQUFDdkgsbUJBQUs2YyxFQUFFN2M7QUFBUixhQUF4QixFQUFzQztBQUFDc08sb0JBQU1zYjtBQUFQLGFBQXRDLENDV007QURwQ1AsbUJBQUE1cUIsS0FBQTtBQTBCTUssZ0JBQUFMLEtBQUE7QUFDTG1CLG9CQUFRbkIsS0FBUixDQUFjLHVCQUFkO0FBQ0FtQixvQkFBUW5CLEtBQVIsQ0FBYzZkLEVBQUU3YyxHQUFoQjtBQUNBRyxvQkFBUW5CLEtBQVIsQ0FBYzRxQixPQUFkO0FDaUJNLG1CRGhCTnpwQixRQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEIsQ0NnQk07QUFDRDtBRGhEUDtBQWpDRCxlQUFBckIsS0FBQTtBQWtFTUssWUFBQUwsS0FBQTtBQUNMbUIsZ0JBQVFuQixLQUFSLENBQWMsaUJBQWQ7QUFDQW1CLGdCQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEI7QUNtQkc7O0FBQ0QsYURsQkhGLFFBQVErYyxPQUFSLENBQWdCLGlCQUFoQixDQ2tCRztBRDdGSjtBQTRFQWtNLFVBQU07QUNvQkYsYURuQkhqcEIsUUFBUThhLEdBQVIsQ0FBWSxnQkFBWixDQ21CRztBRGhHSjtBQUFBLEdBREQsQ0NBQztBRERGLEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBMWtCLE9BQU9xWCxPQUFQLENBQWU7QUFDWCxNQUFBbWMsT0FBQTtBQUFBQSxZQUFVeHpCLE9BQU8ySCxXQUFQLEVBQVY7O0FBQ0EsTUFBRyxDQUFDM0gsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUI4YyxXQUEzQjtBQUNJL2MsV0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUI4YyxXQUF2QixHQUFxQztBQUNqQyxpQkFBVztBQUNQLGVBQU95VztBQURBO0FBRHNCLEtBQXJDO0FDTUw7O0FEQUMsTUFBRyxDQUFDeHpCLE9BQU9DLFFBQVAsQ0FBZSxRQUFmLEVBQXVCOGMsV0FBdkIsQ0FBbUMwVyxPQUF2QztBQUNJenpCLFdBQU9DLFFBQVAsQ0FBZSxRQUFmLEVBQXVCOGMsV0FBdkIsQ0FBbUMwVyxPQUFuQyxHQUE2QztBQUN6QyxhQUFPRDtBQURrQyxLQUE3QztBQ0lMOztBREFDLE1BQUcsQ0FBQ3h6QixPQUFPQyxRQUFQLENBQWUsUUFBZixFQUF1QjhjLFdBQXZCLENBQW1DMFcsT0FBbkMsQ0FBMkNsdUIsR0FBL0M7QUNFQSxXRERJdkYsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUI4YyxXQUF2QixDQUFtQzBXLE9BQW5DLENBQTJDbHVCLEdBQTNDLEdBQWlEaXVCLE9DQ3JEO0FBQ0Q7QURqQkgsRzs7Ozs7Ozs7Ozs7QUVBQSxJQUFHRSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsZ0JBQVosSUFBZ0MsYUFBbkMsRUFBaUQ7QUFDaEQ7QUFDQXp4QixRQUFNLENBQUMweEIsY0FBUCxDQUFzQjF6QixLQUFLLENBQUNDLFNBQTVCLEVBQXVDLE1BQXZDLEVBQStDO0FBQzlDOEUsU0FBSyxFQUFFLFlBQW9CO0FBQUEsVUFBWDR1QixLQUFXLHVFQUFILENBQUc7QUFDMUIsYUFBTyxLQUFLQyxNQUFMLENBQVksVUFBVUMsSUFBVixFQUFnQkMsU0FBaEIsRUFBMkI7QUFDN0MsZUFBT0QsSUFBSSxDQUFDampCLE1BQUwsQ0FBYTVRLEtBQUssQ0FBQyt6QixPQUFOLENBQWNELFNBQWQsS0FBNkJILEtBQUssR0FBQyxDQUFwQyxHQUEwQ0csU0FBUyxDQUFDRCxJQUFWLENBQWVGLEtBQUssR0FBQyxDQUFyQixDQUExQyxHQUFvRUcsU0FBaEYsQ0FBUDtBQUNBLE9BRk0sRUFFSixFQUZJLENBQVA7QUFHQTtBQUw2QyxHQUEvQztBQU9BLEM7Ozs7Ozs7Ozs7OztBQ1REajBCLE9BQU9xWCxPQUFQLENBQWU7QUNDYixTREFELElBQUk4YyxRQUFRQyxLQUFaLENBQ0M7QUFBQXR6QixVQUFNLGdCQUFOO0FBQ0EwUSxnQkFBWTlPLEdBQUdrRixJQURmO0FBRUF5c0IsYUFBUyxDQUNSO0FBQ0NsaUIsWUFBTSxNQURQO0FBRUNtaUIsaUJBQVc7QUFGWixLQURRLENBRlQ7QUFRQUMsU0FBSyxJQVJMO0FBU0F0WSxpQkFBYSxDQUFDLEtBQUQsRUFBUSxPQUFSLENBVGI7QUFVQXVZLGtCQUFjLEtBVmQ7QUFXQUMsY0FBVSxLQVhWO0FBWUFsWSxnQkFBWSxFQVpaO0FBYUEwTCxVQUFNLEtBYk47QUFjQXlNLGVBQVcsSUFkWDtBQWVBQyxlQUFXLElBZlg7QUFnQkFDLG9CQUFnQixVQUFDdFosUUFBRCxFQUFXdFcsTUFBWDtBQUNmLFVBQUFuQyxHQUFBLEVBQUF1SCxLQUFBOztBQUFBLFdBQU9wRixNQUFQO0FBQ0MsZUFBTztBQUFDeUUsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ0lHOztBREhKVyxjQUFRa1IsU0FBU2xSLEtBQWpCOztBQUNBLFdBQU9BLEtBQVA7QUFDQyxhQUFBa1IsWUFBQSxRQUFBelksTUFBQXlZLFNBQUF1WixJQUFBLFlBQUFoeUIsSUFBbUJsQixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDeUksa0JBQVFrUixTQUFTdVosSUFBVCxDQUFjN3pCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBT29KLEtBQVA7QUFDQyxlQUFPO0FBQUNYLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPNlIsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0Y2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcclxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxyXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxyXG5cdG1rZGlycDogXCJeMC4zLjVcIixcclxuXHRcInVybC1zZWFyY2gtcGFyYW1zLXBvbHlmaWxsXCI6IFwiXjcuMC4wXCIsXHJcbn0sICdzdGVlZG9zOmJhc2UnKTtcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcpIHtcclxuXHRjaGVja05wbVZlcnNpb25zKHtcclxuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXHJcblx0fSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG59IiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XHJcbiAgICBpZiAoIXRoaXMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZighbG9jYWxlKXtcclxuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNvcnQoZnVuY3Rpb24gKHAxLCBwMikge1xyXG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XHJcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcclxuXHRcdGlmKHAxX3NvcnRfbm8gIT0gcDJfc29ydF9ubyl7XHJcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxyXG4gICAgICAgIH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcDEubmFtZS5sb2NhbGVDb21wYXJlKHAyLm5hbWUsIGxvY2FsZSk7XHJcblx0XHR9XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5BcnJheS5wcm90b3R5cGUuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoaykge1xyXG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRba10gOiBudWxsO1xyXG4gICAgICAgIHYucHVzaChtKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XHJcbiAgICBpZiAoZnJvbSA8IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcclxuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgZyA9IFtdO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcclxuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIl9pZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBsLmluY2x1ZGVzKG0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIGcucHVzaCh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBnO1xyXG59XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq5a+56LGhXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgciA9IG51bGw7XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByO1xyXG59IiwiU3RlZWRvcyA9XHJcblx0c2V0dGluZ3M6IHt9XHJcblx0ZGI6IGRiXHJcblx0c3Viczoge31cclxuXHRpc1Bob25lRW5hYmxlZDogLT5cclxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxyXG5cdG51bWJlclRvU3RyaW5nOiAobnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKS0+XHJcblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcclxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcclxuXHJcblx0XHRpZiAhbnVtYmVyXHJcblx0XHRcdHJldHVybiAnJztcclxuXHJcblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxyXG5cdFx0XHRpZiBzY2FsZSB8fCBzY2FsZSA9PSAwXHJcblx0XHRcdFx0bnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSlcclxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xyXG5cdFx0XHRcdGlmICEoc2NhbGUgfHwgc2NhbGUgPT0gMClcclxuXHRcdFx0XHRcdCMg5rKh5a6a5LmJc2NhbGXml7bvvIzmoLnmja7lsI/mlbDngrnkvY3nva7nrpflh7pzY2FsZeWAvFxyXG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXHJcblx0XHRcdFx0XHR1bmxlc3Mgc2NhbGVcclxuXHRcdFx0XHRcdFx0c2NhbGUgPSAwXHJcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXHJcblx0XHRcdFx0aWYgc2NhbGUgPT0gMFxyXG5cdFx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nXHJcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcclxuXHRcdFx0cmV0dXJuIG51bWJlclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gXCJcIlxyXG5cdHZhbGlKcXVlcnlTeW1ib2xzOiAoc3RyKS0+XHJcblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXHJcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXHJcblx0XHRyZXR1cm4gcmVnLnRlc3Qoc3RyKVxyXG5cclxuIyMjXHJcbiMgS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXHJcbiMgQG5hbWVzcGFjZSBTdGVlZG9zXHJcbiMjI1xyXG5cclxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxyXG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXHJcblx0cmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XHJcblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxyXG5cdFx0aWYgYWNjb3VudEJnQm9keVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXHJcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXHJcblx0XHQjIGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdCMgXHRpZiB1cmwgPT0gYXZhdGFyXHJcblx0XHQjIFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXHJcblx0XHQjIFx0ZWxzZVxyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKHVybCl9KVwiXHJcblx0XHQjIGVsc2VcclxuXHRcdCMgXHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXHJcblx0XHQjIFx0aWYgYmFja2dyb3VuZFxyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cdFx0IyBcdGVsc2VcclxuXHRcdCMgXHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cclxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcclxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcclxuXHRcdGlmIGFjY291bnRTa2luXHJcblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXHJcblx0XHRpZiBhY2NvdW50Wm9vbVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcclxuXHRcdHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxyXG5cdFx0dW5sZXNzIHpvb21OYW1lXHJcblx0XHRcdHpvb21OYW1lID0gXCJsYXJnZVwiXHJcblx0XHRcdHpvb21TaXplID0gMS4yXHJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXHJcblx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxyXG5cdFx0XHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXHJcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxyXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxyXG5cdFx0XHQjIGVsc2VcclxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cclxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxyXG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxyXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHJcblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxyXG5cdFx0YXV0aFRva2VuID0ge307XHJcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcclxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcclxuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XHJcblxyXG5cdFx0bGlua2VyID0gXCI/XCJcclxuXHJcblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxyXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxyXG5cclxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcclxuXHJcblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcclxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXHJcblxyXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuXHJcblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcclxuXHRcdGVsc2VcclxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XHJcblxyXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXHJcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcclxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcclxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cclxuXHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxyXG5cclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxyXG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxyXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblx0XHRpZiAhYXBwXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3JcclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcclxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXHJcblx0XHQjIFx0cmVnID0gL1xcLyQvXHJcblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxyXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXHJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxyXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblx0XHQjIFx0cmV0dXJuXHJcblxyXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcclxuXHRcdGlmIGFwcC5pc191c2VfaWVcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdGlmIG9uX2NsaWNrXHJcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxyXG5cclxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcclxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcclxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcclxuXHJcblx0XHRlbHNlIGlmIG9uX2NsaWNrXHJcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXHJcblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xyXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cclxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0bWluX21vbnRocyA9IDFcclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0bWluX21vbnRocyA9IDNcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXHJcblx0XHRpZiBzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpIGFuZCBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXHJcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXHJcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcclxuXHJcblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cclxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXHJcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdHdoZW4gJ25vcm1hbCdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XHJcblx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcclxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXHJcblxyXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcclxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XHJcblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxyXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcclxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcclxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcclxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxyXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxyXG5cclxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XHJcblx0XHRlbHNlXHJcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXHJcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxyXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcclxuXHRcdGlmIG9mZnNldFxyXG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxyXG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XHJcblxyXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxyXG5cdFx0REVWSUNFID1cclxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXHJcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xyXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcclxuXHRcdFx0aXBhZDogJ2lwYWQnXHJcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcclxuXHRcdFx0aXBvZDogJ2lwb2QnXHJcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcclxuXHRcdGJyb3dzZXIgPSB7fVxyXG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXHJcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcclxuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxyXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxyXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcclxuXHRcdFx0JydcclxuXHRcdFx0REVWSUNFLmRlc2t0b3BcclxuXHRcdF1cclxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXHJcblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XHJcblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0aWYgaWZyXHJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcclxuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXHJcblx0XHRcdGlmci5sb2FkIC0+XHJcblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxyXG5cdFx0XHRcdGlmIGlmckJvZHlcclxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XHJcblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXHJcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xyXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxyXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcclxuXHJcbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXHJcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxyXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcclxuXHJcblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGNoZWNrID0gZmFsc2VcclxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xyXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcclxuXHRcdFx0Y2hlY2sgPSB0cnVlXHJcblx0XHRyZXR1cm4gY2hlY2tcclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXHJcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcclxuXHRcdHBhcmVudHMgPSBbXVxyXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cclxuXHRcdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXHJcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXHJcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXHJcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcclxuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxyXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxyXG5cclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdGkgPSAwXHJcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxyXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGkrK1xyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXHJcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcclxuXHRcdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cclxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XHJcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxyXG5cclxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxyXG5cclxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxyXG5cclxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXHJcblxyXG5cdFx0XHRpZiAhdXNlclxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcclxuXHJcblx0XHRcdGlmIHJlc3VsdC5lcnJvclxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gdXNlclxyXG5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cclxuXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXHJcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cclxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XHJcblx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdGxlbiA9IGtleS5sZW5ndGhcclxuXHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRpKytcclxuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XHJcblxyXG5cdFx0aWYgIWFjY2Vzc190b2tlblxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcclxuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHJldHVybiB1c2VySWRcclxuXHRcdGVsc2VcclxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcclxuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxyXG5cclxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxyXG5cdFx0XHRpZiBvYmpcclxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXHJcblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXHJcblxyXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cclxuXHRcdHRyeVxyXG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXHJcblxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXHJcblx0XHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblxyXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXHJcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxyXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcclxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXHJcblxyXG5taXhpbiA9IChvYmopIC0+XHJcblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxyXG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cclxuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cclxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxyXG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cclxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcclxuXHJcbiNtaXhpbihfcy5leHBvcnRzKCkpXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6VcclxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XHJcblx0XHRpZiAhZGF0ZVxyXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcclxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXHJcblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcclxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXHJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cclxuXHRcdFx0aWYgaSA8IGRheXNcclxuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxyXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXHJcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxyXG5cclxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxyXG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xyXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcclxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxyXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXHJcblxyXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXHJcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcclxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcclxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcclxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXHJcblxyXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblxyXG5cdFx0aiA9IDBcclxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcclxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gMFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xyXG5cdFx0XHRcdGogPSBsZW4vMlxyXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XHJcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcclxuXHJcblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcclxuXHRcdFx0XHRcdGJyZWFrXHJcblxyXG5cdFx0XHRcdGkrK1xyXG5cclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxyXG5cclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxyXG5cclxuXHRcdGlmIGogPiBtYXhfaW5kZXhcclxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6VcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcclxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxyXG5cclxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Xy5leHRlbmQgU3RlZWRvcyxcclxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxyXG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXHJcblx0XHRcdGlmIGFwcFxyXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcclxuXHJcblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcclxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcclxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXHJcblx0XHRcdGlmIGlzSTE4blxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdFx0XHRyZXR1cm4gbG9jYWxlXHJcblxyXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxyXG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcclxuXHJcblxyXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxyXG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXHJcblx0XHRcdHZhbGlkID0gdHJ1ZVxyXG5cdFx0XHR1bmxlc3MgcHdkXHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcclxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yXHJcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcclxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxyXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXHJcbiNcdFx0XHRlbHNlXHJcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0aWYgdmFsaWRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxyXG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cclxuXHJcblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXHJcblxyXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxyXG5cdGRiQXBwcyA9IHt9XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZm9yRWFjaCAoYXBwKS0+XHJcblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcclxuXHJcblx0cmV0dXJuIGRiQXBwc1xyXG5cclxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSAoc3BhY2VfaWQpLT5cclxuXHRkYkRhc2hib2FyZHMgPSB7fVxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZvckVhY2ggKGRhc2hib2FyZCktPlxyXG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXHJcblxyXG5cdHJldHVybiBkYkRhc2hib2FyZHNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXHJcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXHJcblx0XHRyZXR1cm4gYXV0aFRva2VuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxyXG4jXHRcdGVsc2VcclxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcclxuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxyXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvcy5mb3JtYXRJbmRleCA9IChhcnJheSkgLT5cclxuXHRcdG9iamVjdCA9IHtcclxuICAgICAgICBcdGJhY2tncm91bmQ6IHRydWVcclxuICAgIFx0fTtcclxuXHRcdGlzZG9jdW1lbnREQiA9IE1ldGVvci5zZXR0aW5ncz8uZGF0YXNvdXJjZXM/LmRlZmF1bHQ/LmRvY3VtZW50REIgfHwgZmFsc2U7XHJcblx0XHRpZiBpc2RvY3VtZW50REJcclxuXHRcdFx0aWYgYXJyYXkubGVuZ3RoID4gMFxyXG5cdFx0XHRcdGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xyXG5cdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpXHJcblx0XHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCw1Mik7XHJcblxyXG5cdFx0cmV0dXJuIG9iamVjdDsiLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbjsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpIHtcbiAgICB2YXIgcmVmLCByZWYxLCByZWc7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoc2NhbGUgfHwgc2NhbGUgPT09IDApIHtcbiAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSk7XG4gICAgICB9XG4gICAgICBpZiAoIW5vdFRob3VzYW5kcykge1xuICAgICAgICBpZiAoIShzY2FsZSB8fCBzY2FsZSA9PT0gMCkpIHtcbiAgICAgICAgICBzY2FsZSA9IChyZWYgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMV0pICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZztcbiAgICAgICAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciB6b29tTmFtZSwgem9vbVNpemU7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICB9XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuICAgIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lO1xuICAgIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplO1xuICAgIGlmICghem9vbU5hbWUpIHtcbiAgICAgIHpvb21OYW1lID0gXCJsYXJnZVwiO1xuICAgICAgem9vbVNpemUgPSAxLjI7XG4gICAgfVxuICAgIGlmICh6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpKSB7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tXCIgKyB6b29tTmFtZSk7XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLCBhY2NvdW50Wm9vbVZhbHVlLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLCBhY2NvdW50Wm9vbVZhbHVlLnNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZiA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWYyID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjNbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWZbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjIuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYzID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZiwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWYudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHBhc3N3b3JQb2xpY3ksIHBhc3N3b3JQb2xpY3lFcnJvciwgcmVhc29uLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHZhbGlkO1xuICAgICAgcmVhc29uID0gdChcInBhc3N3b3JkX2ludmFsaWRcIik7XG4gICAgICB2YWxpZCA9IHRydWU7XG4gICAgICBpZiAoIXB3ZCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGFzc3dvclBvbGljeSA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEucG9saWN5IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcGFzc3dvclBvbGljeUVycm9yID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLnBvbGljeUVycm9yIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKHBhc3N3b3JQb2xpY3kpIHtcbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpKSB7XG4gICAgICAgICAgcmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiRGFzaGJvYXJkcztcbiAgZGJEYXNoYm9hcmRzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICByZXR1cm4gZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmV0dXJuIGRiRGFzaGJvYXJkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmZvcm1hdEluZGV4ID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgICB2YXIgaW5kZXhOYW1lLCBpc2RvY3VtZW50REIsIG9iamVjdCwgcmVmLCByZWYxLCByZWYyO1xuICAgIG9iamVjdCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWVcbiAgICB9O1xuICAgIGlzZG9jdW1lbnREQiA9ICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYuZGF0YXNvdXJjZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjFbXCJkZWZhdWx0XCJdKSAhPSBudWxsID8gcmVmMi5kb2N1bWVudERCIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwKSB8fCBmYWxzZTtcbiAgICBpZiAoaXNkb2N1bWVudERCKSB7XG4gICAgICBpZiAoYXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgICBpbmRleE5hbWUgPSBhcnJheS5qb2luKFwiLlwiKTtcbiAgICAgICAgb2JqZWN0Lm5hbWUgPSBpbmRleE5hbWU7XG4gICAgICAgIGlmIChpbmRleE5hbWUubGVuZ3RoID4gNTIpIHtcbiAgICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCwgNTIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvYmplY3Q7XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xyXG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1c2g6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXHJcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkc2V0OiBcclxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcclxuICAgICAgICAgICAgZW1haWxzOiBbXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgICAgICAgXVxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcCA9IG51bGxcclxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgICAgcCA9IGVcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1bGw6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIHBcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XHJcbiAgICAgIFxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXHJcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcclxuXHJcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxyXG4gICAgICAgICRzZXQ6XHJcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xyXG4gICAgICAgICAgZW1haWw6IGVtYWlsXHJcblxyXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XHJcbiAgICAgICAgc3dhbFxyXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxyXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXHJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cclxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXHJcbiMjI1xyXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxyXG5cclxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXHJcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcclxuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcclxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xyXG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxyXG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xyXG5cdGZyb206IChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XHJcblx0XHRcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xyXG5cdH0pKCksXHJcblx0cmVzZXRQYXNzd29yZDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xyXG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0dmVyaWZ5RW1haWw6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVucm9sbEFjY291bnQ6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xyXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcclxuICBcclxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XHJcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxyXG5cdHtcclxuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcclxuXHRcdHtcclxuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcclxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cdFxyXG5cclxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgIFx0ZGF0YToge1xyXG5cdCAgICAgIFx0cmV0OiAwLFxyXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXHJcbiAgICBcdH1cclxuICBcdH0pO1xyXG59KTtcclxuXHJcbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcclxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxyXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxyXG5cclxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcclxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcclxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XHJcblx0XHRpZiBzcGFjZUlkXHJcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XHJcblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXHJcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cclxuXHRcdHJldHVybiBzZWxlY3RvclxyXG5cclxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XHJcblx0aWNvbjogXCJnbG9iZVwiXHJcblx0Y29sb3I6IFwiYmx1ZVwiXHJcblx0dGFibGVDb2x1bW5zOiBbXHJcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXHJcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxyXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcclxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxyXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cclxuXHRdXHJcblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cclxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxyXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdHJldHVybiB7fVxyXG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxyXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXHJcblx0ZGlzYWJsZUFkZDogdHJ1ZVxyXG5cdHBhZ2VMZW5ndGg6IDEwMFxyXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXHJcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXHJcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxyXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xyXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcclxuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xyXG4gICAgaWYgKGxlbiA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcclxuICAgIHZhciBrO1xyXG4gICAgaWYgKG4gPj0gMCkge1xyXG4gICAgICBrID0gbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSBsZW4gKyBuO1xyXG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XHJcbiAgICB9XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XHJcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaysrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXHJcblxyXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXHJcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cclxuICAgICAgd3d3OiBcclxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXHJcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XHJcblx0bGlzdFZpZXdzID0ge31cclxuXHJcblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxyXG5cclxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xyXG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cclxuXHR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZmV0Y2goKVxyXG5cclxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxyXG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XHJcblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cclxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cclxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XHJcblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXHJcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3RfdmlldylcclxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gbGlzdFZpZXdzXHJcblxyXG5cclxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblxyXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cclxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xyXG5cclxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblxyXG5cclxuXHJcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuLy8gICAndXNlIHN0cmljdCc7XHJcblxyXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xyXG5cclxuLy8gICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcclxuLy8gICAgIH1cclxuLy8gICB9O1xyXG4vLyAgIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcclxuLy8gICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XHJcbi8vICAgfTtcclxuLy8gICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgfTtcclxuXHJcbi8vICAgQ29sbGVjdGlvbi5kZW55KHtcclxuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICAgIH0sXHJcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICAgIH1cclxuLy8gICB9KTtcclxuXHJcbi8vICAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxyXG4vLyAgIHZhciBhcGkgPSB7XHJcbi8vICAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xyXG4vLyAgICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XHJcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbi8vICAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbi8vICAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuLy8gICAgIH0sXHJcbi8vICAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xyXG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxyXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xyXG5cclxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XHJcblxyXG4vLyAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcclxuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcclxuLy8gICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XHJcbi8vICAgICB9XHJcbi8vICAgfTtcclxuXHJcbi8vICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcclxuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcclxuLy8gICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9KVxyXG4vLyAgICAgfVxyXG4vLyAgIH0pXHJcblxyXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuLy8gICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XHJcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXHJcbi8vICAgICAvLyAgIH1cclxuLy8gICAgIC8vIH0pO1xyXG5cclxuLy8gICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcclxuLy8gICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcclxuXHJcbi8vICAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcclxuLy8gICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xyXG4vLyAgICAgICB9XHJcblxyXG4vLyAgICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XHJcbi8vICAgICAgIH0pO1xyXG4vLyAgICAgfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xyXG4vLyAgICAgfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLm1ldGhvZHMoe1xyXG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbi8vICAgICAgIH0sXHJcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XHJcblxyXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XHJcblxyXG4vLyAgICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxyXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xyXG5cclxuLy8gICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XHJcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcclxuXHJcbi8vICAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0pOyAgXHJcblxyXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXHJcbi8vICAgICBfLmV4dGVuZChhcGksIHtcclxuLy8gICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcclxuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0pO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgcmV0dXJuIGFwaTtcclxuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXHJcblxyXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxyXG5cclxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcclxuXHRcdFxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxyXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHJcblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXHJcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxyXG5cclxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxyXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHJcblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXHJcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcclxuXHJcblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cclxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XHJcblx0XHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzIClcclxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuICAgICAgICBpZiAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsXHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXHJcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZVxyXG4gICAgICAgIGRhdGEgPSBbXVxyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICMg55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcclxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcclxuICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIC0+XHJcbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XHJcbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXHJcbiAgICAgICAgICAgICkoYXV0aFRva2VuLCBzcGFjZSlcclxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICBpZiAhZGJbbW9kZWxdXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fVxyXG5cclxuICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcblxyXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKVxyXG5cclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcclxuICAgIGNhdGNoIGVcclxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdXHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXHJcbiAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgIWF1dGhUb2tlblxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxyXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxyXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3JcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcclxuICAgICAgICBkYXRhID0gW11cclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICMg55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY2hlY2soc3BhY2UsIFN0cmluZylcclxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcclxuICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIC0+XHJcbiAgICAgICAgICAgIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpIC0+XHJcbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXHJcbiAgICAgICAgICAgICkoYXV0aFRva2VuLCBzcGFjZSlcclxuICAgICAgICB1bmxlc3MgdXNlclNlc3Npb25cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcclxuICAgICAgICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6XHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICBpZiAhZGJbbW9kZWxdXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTpcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fVxyXG5cclxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcblxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpXHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgY2F0Y2ggZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge31cclxuIiwidmFyIENvb2tpZXMsIHN0ZWVkb3NBdXRoO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKTtcbiAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICAgIH0pO1xuICAgIH0pKGF1dGhUb2tlbiwgc3BhY2UpO1xuICAgIGlmICghdXNlclNlc3Npb24pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNTAwLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VySWQgPSB1c2VyU2Vzc2lvbi51c2VySWQ7XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXHJcblx0aWYgYXBwXHJcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcclxuXHRlbHNlXHJcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXHJcblxyXG5cdGlmICFyZWRpcmVjdFVybFxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuXHQjIGlmIHJlcS5ib2R5XHJcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHQjIGRlcy1jYmNcclxuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXHJcblx0XHRcdGtleTggPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDhcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDggLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXHJcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxyXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXHJcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0am9pbmVyID0gXCI/XCJcclxuXHJcblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxyXG5cclxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRyZXMuZW5kKClcclxuXHRyZXR1cm5cclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHQjIHRoaXMucGFyYW1zID1cclxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxyXG5cdFx0d2lkdGggPSA1MCA7XHJcblx0XHRoZWlnaHQgPSA1MCA7XHJcblx0XHRmb250U2l6ZSA9IDI4IDtcclxuXHRcdGlmIHJlcS5xdWVyeS53XHJcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XHJcblx0XHRpZiByZXEucXVlcnkuaFxyXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcclxuXHRcdGlmIHJlcS5xdWVyeS5mc1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XHJcblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XHJcblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxyXG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxyXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcclxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcclxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcclxuXHRcdGlmICF1c2VybmFtZVxyXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxyXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcclxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cclxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxyXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cclxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcclxuXHJcblx0XHRcdGluaXRpYWxzID0gJydcclxuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cclxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XHJcblx0XHRcdFx0PC90ZXh0PlxyXG5cdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cclxuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XHJcblx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXHJcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcclxuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cclxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cclxuICAgICAgICBpZiBzcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcclxuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcclxuXHJcblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xyXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxyXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblx0XHR1c2VyU3BhY2VzID0gW11cclxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcclxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cclxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxyXG5cclxuXHRcdGhhbmRsZTIgPSBudWxsXHJcblxyXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXHJcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcclxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0aWYgZG9jLnNwYWNlXHJcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcclxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcclxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXHJcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXHJcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxyXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XHJcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xyXG5cclxuXHRcdHNlbGYucmVhZHkoKTtcclxuXHJcblx0XHRzZWxmLm9uU3RvcCAtPlxyXG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXHJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxyXG5cdHVubGVzcyBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0dW5sZXNzIF9pZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Ym9keSA9IFwiXCJcclxuXHRcdHJlcS5vbignZGF0YScsIChjaHVuayktPlxyXG5cdFx0XHRib2R5ICs9IGNodW5rXHJcblx0XHQpXHJcblx0XHRyZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCgpLT5cclxuXHRcdFx0XHR4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKVxyXG5cdFx0XHRcdHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHsgdHJpbTp0cnVlLCBleHBsaWNpdEFycmF5OmZhbHNlLCBleHBsaWNpdFJvb3Q6ZmFsc2UgfSlcclxuXHRcdFx0XHRwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgKGVyciwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdCMg54m55Yir5o+Q6YaS77ya5ZWG5oi357O757uf5a+55LqO5pSv5LuY57uT5p6c6YCa55+l55qE5YaF5a655LiA5a6a6KaB5YGa562+5ZCN6aqM6K+BLOW5tuagoemqjOi/lOWbnueahOiuouWNlemHkemineaYr+WQpuS4juWVhuaIt+S+p+eahOiuouWNlemHkemineS4gOiHtO+8jOmYsuatouaVsOaNruazhOa8j+WvvOiHtOWHuueOsOKAnOWBh+mAmuefpeKAne+8jOmAoOaIkOi1hOmHkeaNn+WksVxyXG5cdFx0XHRcdFx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cdFx0XHRcdFx0XHR3eHBheSA9IFdYUGF5KHtcclxuXHRcdFx0XHRcdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdFx0XHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0c2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKVxyXG5cdFx0XHRcdFx0XHRhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpXHJcblx0XHRcdFx0XHRcdGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkXHJcblx0XHRcdFx0XHRcdGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZClcclxuXHRcdFx0XHRcdFx0aWYgYnByIGFuZCBicHIudG90YWxfZmVlIGlzIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSBhbmQgc2lnbiBpcyByZXN1bHQuc2lnblxyXG5cdFx0XHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtfaWQ6IGNvZGVfdXJsX2lkfSwgeyRzZXQ6IHtwYWlkOiB0cnVlfX0pXHJcblx0XHRcdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudClcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdClcclxuXHRcdFx0KSwgKGVyciktPlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJ1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblx0XHRcclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0cmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCd9KVxyXG5cdHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpXHJcblxyXG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib2R5LCBlO1xuICB0cnkge1xuICAgIGJvZHkgPSBcIlwiO1xuICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICByZXR1cm4gYm9keSArPSBjaHVuaztcbiAgICB9KTtcbiAgICByZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcnNlciwgeG1sMmpzO1xuICAgICAgeG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG4gICAgICBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7XG4gICAgICAgIHRyaW06IHRydWUsXG4gICAgICAgIGV4cGxpY2l0QXJyYXk6IGZhbHNlLFxuICAgICAgICBleHBsaWNpdFJvb3Q6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIFdYUGF5LCBhdHRhY2gsIGJwciwgY29kZV91cmxfaWQsIHNpZ24sIHd4cGF5O1xuICAgICAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICAgICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgICAgICB9KTtcbiAgICAgICAgc2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKTtcbiAgICAgICAgYXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKTtcbiAgICAgICAgY29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWQ7XG4gICAgICAgIGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZCk7XG4gICAgICAgIGlmIChicHIgJiYgYnByLnRvdGFsX2ZlZSA9PT0gTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpICYmIHNpZ24gPT09IHJlc3VsdC5zaWduKSB7XG4gICAgICAgICAgZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBjb2RlX3VybF9pZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSksIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZScpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgfVxuICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ1xuICB9KTtcbiAgcmV0dXJuIHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XHJcblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7RcclxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXHJcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xyXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xyXG5cdFx0cmVWYWx1ZSA9XHJcblx0XHRcdGlzTGltaXQ6IHRydWVcclxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXHJcblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXHJcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XHJcblxyXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxyXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRcdFxyXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXHJcblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcclxuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXHJcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXHJcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXHJcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcclxuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcclxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XHJcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xyXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcclxuXHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXHJcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXHJcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblxyXG5cdFx0aWYgaXNMaW1pdFxyXG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcclxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cclxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cclxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHJcblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XHJcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xyXG5cdFx0cmV0dXJuIHJlVmFsdWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcclxuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcclxuXHJcbiAgICAgICAgb2JqID0ge307XHJcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcclxuICAgICAgICBvYmoua2V5ID0ga2V5O1xyXG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xyXG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICB9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjID4gMCkge1xyXG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0pIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3NldHRsZXVwOiAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQ9XCJcIiktPlxyXG5cdFx0Y2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKVxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZylcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblxyXG5cdFx0aWYgbm90IHVzZXIuaXNfY2xvdWRhZG1pblxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcnXHJcblx0XHRzcGFjZXMgPSBbXVxyXG5cdFx0aWYgc3BhY2VfaWRcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VfaWQsIGlzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdHNwYWNlcy5mb3JFYWNoIChzKSAtPlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRlID0ge31cclxuXHRcdFx0XHRlLl9pZCA9IHMuX2lkXHJcblx0XHRcdFx0ZS5uYW1lID0gcy5uYW1lXHJcblx0XHRcdFx0ZS5lcnIgPSBlcnJcclxuXHRcdFx0XHRyZXN1bHQucHVzaCBlXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoID4gMFxyXG5cdFx0XHRjb25zb2xlLmVycm9yIHJlc3VsdFxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWxcclxuXHRcdFx0XHRFbWFpbC5zZW5kXHJcblx0XHRcdFx0XHR0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nXHJcblx0XHRcdFx0XHRmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tXHJcblx0XHRcdFx0XHRzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnXHJcblx0XHRcdFx0XHR0ZXh0OiBKU09OLnN0cmluZ2lmeSgncmVzdWx0JzogcmVzdWx0KVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyclxyXG5cdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nJyIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19zZXR0bGV1cDogZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgRW1haWwsIGVyciwgcmVzdWx0LCBzcGFjZXMsIHVzZXI7XG4gICAgaWYgKHNwYWNlX2lkID09IG51bGwpIHtcbiAgICAgIHNwYWNlX2lkID0gXCJcIjtcbiAgICB9XG4gICAgY2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcnKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgX2lkOiBzcGFjZV9pZCxcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlc3VsdCA9IFtdO1xuICAgIHNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBlLCBlcnI7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgZSA9IHt9O1xuICAgICAgICBlLl9pZCA9IHMuX2lkO1xuICAgICAgICBlLm5hbWUgPSBzLm5hbWU7XG4gICAgICAgIGUuZXJyID0gZXJyO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCk7XG4gICAgICB0cnkge1xuICAgICAgICBFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWw7XG4gICAgICAgIEVtYWlsLnNlbmQoe1xuICAgICAgICAgIHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbScsXG4gICAgICAgICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICAgICAgICBzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnLFxuICAgICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICdyZXN1bHQnOiByZXN1bHRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcnKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XHJcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcclxuXHJcblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcclxuXHJcblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxyXG5cclxuXHRcdHVubGVzcyB1c2VyX2lkXHJcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxyXG5cclxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblxyXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcclxuXHJcblx0XHRyZXR1cm4gdXNlcm5hbWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3JlY2hhcmdlOiAodG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0XHRjaGVjayB0b3RhbF9mZWUsIE51bWJlclxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZyBcclxuXHRcdGNoZWNrIG5ld19pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbW9kdWxlX25hbWVzLCBBcnJheSBcclxuXHRcdGNoZWNrIGVuZF9kYXRlLCBTdHJpbmcgXHJcblx0XHRjaGVjayB1c2VyX2NvdW50LCBOdW1iZXIgXHJcblxyXG5cdFx0dXNlcl9pZCA9IHRoaXMudXNlcklkXHJcblxyXG5cdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdG9yZGVyX2JvZHkgPSBbXVxyXG5cdFx0ZGIubW9kdWxlcy5maW5kKHtuYW1lOiB7JGluOiBtb2R1bGVfbmFtZXN9fSkuZm9yRWFjaCAobSktPlxyXG5cdFx0XHRsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYlxyXG5cdFx0XHRvcmRlcl9ib2R5LnB1c2ggbS5uYW1lX3poXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmIG5vdCBzcGFjZS5pc19wYWlkXHJcblx0XHRcdHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZH0pLmNvdW50KClcclxuXHRcdFx0b25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlc1xyXG5cdFx0XHRpZiB0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbioxMDBcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pSN7b25lX21vbnRoX3l1YW59XCJcclxuXHJcblx0XHRyZXN1bHRfb2JqID0ge31cclxuXHJcblx0XHRhdHRhY2ggPSB7fVxyXG5cdFx0YXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkXHJcblx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cclxuXHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxyXG5cdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0fSlcclxuXHJcblx0XHR3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xyXG5cdFx0XHRib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxyXG5cdFx0XHRvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcclxuXHRcdFx0dG90YWxfZmVlOiB0b3RhbF9mZWUsXHJcblx0XHRcdHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxyXG5cdFx0XHRub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxyXG5cdFx0XHR0cmFkZV90eXBlOiAnTkFUSVZFJyxcclxuXHRcdFx0cHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHRhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcclxuXHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKChlcnIsIHJlc3VsdCkgLT4gXHJcblx0XHRcdFx0aWYgZXJyIFxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRpZiByZXN1bHRcclxuXHRcdFx0XHRcdG9iaiA9IHt9XHJcblx0XHRcdFx0XHRvYmouX2lkID0gbmV3X2lkXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZCA9IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRvYmouaW5mbyA9IHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZVxyXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXHJcblx0XHRcdFx0XHRvYmouc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRcdFx0b2JqLnBhaWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0b2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRcdFx0XHRcdG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblx0XHRcdFx0XHRvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iailcclxuXHRcdFx0KSwgKGUpLT5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJ1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIGUuc3RhY2tcclxuXHRcdFx0KVxyXG5cdFx0KVxyXG5cclxuXHRcdFxyXG5cdFx0cmV0dXJuIFwic3VjY2Vzc1wiIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3JlY2hhcmdlOiBmdW5jdGlvbih0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgICB2YXIgV1hQYXksIGF0dGFjaCwgbGlzdHByaWNlcywgb25lX21vbnRoX3l1YW4sIG9yZGVyX2JvZHksIHJlc3VsdF9vYmosIHNwYWNlLCBzcGFjZV91c2VyX2NvdW50LCB1c2VyX2lkLCB3eHBheTtcbiAgICBjaGVjayh0b3RhbF9mZWUsIE51bWJlcik7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobmV3X2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG1vZHVsZV9uYW1lcywgQXJyYXkpO1xuICAgIGNoZWNrKGVuZF9kYXRlLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJfY291bnQsIE51bWJlcik7XG4gICAgdXNlcl9pZCA9IHRoaXMudXNlcklkO1xuICAgIGxpc3RwcmljZXMgPSAwO1xuICAgIG9yZGVyX2JvZHkgPSBbXTtcbiAgICBkYi5tb2R1bGVzLmZpbmQoe1xuICAgICAgbmFtZToge1xuICAgICAgICAkaW46IG1vZHVsZV9uYW1lc1xuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgbGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWI7XG4gICAgICByZXR1cm4gb3JkZXJfYm9keS5wdXNoKG0ubmFtZV96aCk7XG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICBzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSkuY291bnQoKTtcbiAgICAgIG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXM7XG4gICAgICBpZiAodG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4gKiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6VcIiArIG9uZV9tb250aF95dWFuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0X29iaiA9IHt9O1xuICAgIGF0dGFjaCA9IHt9O1xuICAgIGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZDtcbiAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgfSk7XG4gICAgd3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcbiAgICAgIGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG4gICAgICBvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICBub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuICAgICAgdHJhZGVfdHlwZTogJ05BVElWRScsXG4gICAgICBwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICBhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcbiAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLl9pZCA9IG5ld19pZDtcbiAgICAgICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZTtcbiAgICAgICAgb2JqLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWU7XG4gICAgICAgIG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgICAgICAgb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgIG9iai5wYWlkID0gZmFsc2U7XG4gICAgICAgIG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICAgICAgICBvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgb2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICAgICAgICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKTtcbiAgICAgIH1cbiAgICB9KSwgZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBiaWxsaW5nX3JlY2hhcmdlLmNvZmZlZScpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGUuc3RhY2spO1xuICAgIH0pKTtcbiAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXHJcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XHJcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcclxuXHRcdHVzZXJfY291bnRfaW5mby5hY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXHJcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0ZGIudXNlcnMuY3JlYXRlX3NlY3JldCB0aGlzLnVzZXJJZCwgbmFtZVxyXG5cclxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZCB8fCAhdG9rZW5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKVxyXG5cclxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcbiAgICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiAoc3BhY2VJZCwgdXNlcklkKSAtPlxyXG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xyXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXHJcblxyXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcclxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ25vdC1hdXRob3JpemVkJ1xyXG5cclxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XHJcbiAgICAgICAgICAgIF9pZDoge1xyXG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge2ZpZWxkczoge3BhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cclxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQgfSwgeyBmaWVsZHM6IHsgb2JqZWN0X25hbWU6IDEsIGZsb3dfaWQ6IDEsIHNwYWNlOiAxIH0gfSkuZmV0Y2goKVxyXG4gICAgICAgIF8uZWFjaCBvd3MsKG8pIC0+XHJcbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSB9IH0pXHJcbiAgICAgICAgICAgIGlmIGZsXHJcbiAgICAgICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcclxuICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXHJcblxyXG4gICAgICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xyXG4gICAgICAgICAgICAgICAgaWYgcGVybXNcclxuICAgICAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXHJcblxyXG4gICAgICAgIG93cyA9IG93cy5maWx0ZXIgKG4pLT5cclxuICAgICAgICAgICAgcmV0dXJuIG4uZmxvd19uYW1lXHJcblxyXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBwZXJtczogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmbCkge1xuICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgICBwZXJtcyA9IGZsLnBlcm1zO1xuICAgICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSBfLnNvbWUob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG93cyA9IG93cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uZmxvd19uYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBvd3M7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRzZXRTcGFjZVVzZXJQYXNzd29yZDogKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkgLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIilcclxuXHRcdFxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZV9pZH0pXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBzcGFjZT8uYWRtaW5zPy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcclxuXHJcblx0XHR1bmxlc3MgaXNTcGFjZUFkbWluXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKVxyXG5cclxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe19pZDogc3BhY2VfdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcclxuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXHJcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9KVxyXG5cclxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIilcclxuXHJcblx0XHRTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXHJcblx0XHRsb2dvdXQgPSB0cnVlO1xyXG5cdFx0aWYgdGhpcy51c2VySWQgPT0gdXNlcl9pZFxyXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxyXG5cdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtsb2dvdXQ6IGxvZ291dH0pXHJcblx0XHRjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxyXG5cdFx0aWYgY2hhbmdlZFVzZXJJbmZvXHJcblx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRwdXNoOiB7J3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiBjaGFuZ2VkVXNlckluZm8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHR9fSlcclxuXHJcblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxyXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXHJcblx0XHRcdGxhbmcgPSAnZW4nXHJcblx0XHRcdGlmIHVzZXJDUC5sb2NhbGUgaXMgJ3poLWNuJ1xyXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXHJcblx0XHRcdFNNU1F1ZXVlLnNlbmRcclxuXHRcdFx0XHRGb3JtYXQ6ICdKU09OJyxcclxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcclxuXHRcdFx0XHRQYXJhbVN0cmluZzogJycsXHJcblx0XHRcdFx0UmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxyXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcclxuXHRcdFx0XHRUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxyXG5cdFx0XHRcdG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRTcGFjZVVzZXJQYXNzd29yZDogZnVuY3Rpb24oc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSB7XG4gICAgdmFyIGNoYW5nZWRVc2VySW5mbywgY3VycmVudFVzZXIsIGlzU3BhY2VBZG1pbiwgbGFuZywgbG9nb3V0LCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcl9pZDtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBpZiAoIWlzU3BhY2VBZG1pbikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgbG9nb3V0ID0gdHJ1ZTtcbiAgICBpZiAodGhpcy51c2VySWQgPT09IHVzZXJfaWQpIHtcbiAgICAgIGxvZ291dCA9IGZhbHNlO1xuICAgIH1cbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge1xuICAgICAgbG9nb3V0OiBsb2dvdXRcbiAgICB9KTtcbiAgICBjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGlmIChjaGFuZ2VkVXNlckluZm8pIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgfSwge1xuICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogKHJlZjEgPSBjaGFuZ2VkVXNlckluZm8uc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGFzc3dvcmQpICE9IG51bGwgPyByZWYyLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBTTVNRdWV1ZS5zZW5kKHtcbiAgICAgICAgRm9ybWF0OiAnSlNPTicsXG4gICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuICAgICAgICBQYXJhbVN0cmluZzogJycsXG4gICAgICAgIFJlY051bTogdXNlckNQLm1vYmlsZSxcbiAgICAgICAgU2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuICAgICAgICBUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuICAgICAgICBtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XHJcblxyXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxyXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxyXG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxyXG5cdGNvdW50X2RheXMgPSAwXHJcblxyXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcclxuXHJcblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcclxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcclxuXHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxyXG5cclxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXHJcblx0XHQjIGRvIG5vdGhpbmdcclxuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHJcblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cclxuXHJcbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XHJcblx0bGFzdF9iaWxsID0gbnVsbFxyXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXHJcblxyXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXHJcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdHtcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRjcmVhdGVkOiB7XHJcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0aWYgcGF5bWVudF9iaWxsXHJcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcclxuXHRlbHNlXHJcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblxyXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0XHRpZiBhcHBfYmlsbFxyXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxyXG5cclxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcclxuXHJcblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxyXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcclxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XHJcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXHJcblxyXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxyXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxyXG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXHJcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblxyXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcclxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xyXG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KVxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxyXG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxyXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXHJcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXHJcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXHJcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcclxuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xyXG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XHJcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XHJcblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cclxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XHJcblx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdHtcclxuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxyXG5cdFx0fVxyXG5cdCkuZm9yRWFjaCAoYmlsbCktPlxyXG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcclxuXHJcblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0bW9kdWxlcyA9IG5ldyBBcnJheVxyXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XHJcblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxyXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XHJcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXHJcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxyXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXHJcblx0XHRcdCMgIGRvIG5vdGhpbmdcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cclxuXHRyZXR1cm4gbW9kdWxlc1xyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cclxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XHJcblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXHJcblx0KVxyXG5cdHJldHVybiBtb2R1bGVzX25hbWVcclxuXHJcblxyXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XHJcblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0cmV0dXJuXHJcblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcclxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXHJcblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRkZWJpdHMgPSAwXHJcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpLmZvckVhY2goKGIpLT5cclxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXHJcblx0XHQpXHJcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXHJcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxyXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcclxuXHRcdGlmIGJhbGFuY2UgPiAwXHJcblx0XHRcdGlmIGRlYml0cyA+IDBcclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxyXG5cclxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcclxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRlbHNlXHJcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcclxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXHJcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxyXG5cclxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcclxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxyXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXHJcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XHJcblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXHJcblxyXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxyXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblxyXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxyXG5cclxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXHJcblxyXG5cdG0gPSBtb21lbnQoKVxyXG5cdG5vdyA9IG0uX2RcclxuXHJcblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcclxuXHJcblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxyXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHQjIOabtOaWsG1vZHVsZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXHJcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxyXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHJcblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxyXG5cdGlmIHJcclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxyXG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XHJcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXHJcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcclxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcclxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcclxuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXHJcblxyXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XHJcblxyXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xyXG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXHJcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XHJcblxyXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIWdvX25leHQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBnb19uZXh0ID0gZmFsc2U7XHJcblxyXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcclxuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxyXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxyXG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxyXG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XHJcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxyXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaAu+aVsFxyXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcclxuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xyXG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXHJcbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcclxuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcclxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcclxuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xyXG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XHJcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xyXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcclxuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XHJcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xyXG4gICAgICAgICAgcmV0dXJuIG1vZDtcclxuICAgICAgfTtcclxuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXHJcbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XHJcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XHJcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcclxuICAgICAgICAgIH0pICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cclxuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcclxuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XHJcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xyXG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmj5LlhaXmlbDmja5cclxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xyXG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xyXG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxyXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxyXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxyXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXHJcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgc3RlZWRvczp7XHJcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB3b3JrZmxvdzp7XHJcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjbXM6IHtcclxuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcclxuXHJcbiAgICAgIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIH0sIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogc3RhdGlzdGljcy5qcycpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcclxuICAgIH0pKTtcclxuXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDFcclxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcclxuICAgICAgICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaSsrXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAyXHJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAzXHJcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDRcclxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDVcclxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdFx0dHJ5XHJcblxyXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxyXG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXHJcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXHJcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cclxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcclxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXHJcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdE1pZ3JhdGlvbnMuYWRkXHJcblx0XHR2ZXJzaW9uOiA2XHJcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcclxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcclxuXHRcdFx0XHR9KVxyXG5cclxuXHJcblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxyXG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XHJcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2VcclxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXHJcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cclxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcclxuXHJcblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcclxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcclxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRkb3duOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cclxuICAgIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKVxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xyXG4gICAgICAgICAgICBcImNyZWF0b3JcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XHJcbiAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcclxuICAgICAgICB9XHJcblxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmxcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiaWYocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKXtcclxuXHQvL01ldGVvciDniYjmnKzljYfnuqfliLAxLjkg5Y+K5Lul5LiK5pe2KG5vZGUg54mI5pysIDExKynvvIzlj6/ku6XliKDpmaTmraTku6PnoIFcclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoQXJyYXkucHJvdG90eXBlLCAnZmxhdCcsIHtcclxuXHRcdHZhbHVlOiBmdW5jdGlvbihkZXB0aCA9IDEpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uIChmbGF0LCB0b0ZsYXR0ZW4pIHtcclxuXHRcdFx0XHRyZXR1cm4gZmxhdC5jb25jYXQoKEFycmF5LmlzQXJyYXkodG9GbGF0dGVuKSAmJiAoZGVwdGg+MSkpID8gdG9GbGF0dGVuLmZsYXQoZGVwdGgtMSkgOiB0b0ZsYXR0ZW4pO1xyXG5cdFx0XHR9LCBbXSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn0iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0bmV3IFRhYnVsYXIuVGFibGVcclxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcclxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXHJcblx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdFx0ZG9tOiBcInRwXCJcclxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxyXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxyXG5cdFx0b3JkZXJpbmc6IGZhbHNlXHJcblx0XHRwYWdlTGVuZ3RoOiAxMFxyXG5cdFx0aW5mbzogZmFsc2VcclxuXHRcdHNlYXJjaGluZzogdHJ1ZVxyXG5cdFx0YXV0b1dpZHRoOiB0cnVlXHJcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XHJcblx0XHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2VcclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
