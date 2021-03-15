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

},"lib":{"steedos_util.js":function(){

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

},"core.coffee":function(require){

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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"simple_schema_extend.js":function(){

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

},"methods":{"apps_init.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/apps_init.coffee                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utc_offset.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/utc_offset.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"last_logon.coffee":function(){

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

},"user_add_email.coffee":function(){

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

},"user_avatar.coffee":function(){

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

},"email_templates_reset.js":function(){

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

},"upgrade_data.js":function(){

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

}},"steedos":{"push.coffee":function(){

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

}},"admin.coffee":function(){

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

},"array_includes.js":function(){

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

},"settings.coffee":function(){

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

},"user_object_view.coffee":function(){

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

},"server_session.js":function(){

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

}},"routes":{"api_get_apps.coffee":function(){

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

},"collection.coffee":function(require){

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

},"sso.coffee":function(require){

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

},"avatar.coffee":function(){

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

},"access_token.coffee":function(){

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

}},"server":{"publications":{"apps.coffee":function(){

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

},"my_spaces.coffee":function(){

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

},"space_avatar.coffee":function(){

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

},"modules.coffee":function(){

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

},"weixin_pay_code_url.coffee":function(){

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

}},"routes":{"api_billing_recharge_notify.coffee":function(require){

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

}},"methods":{"my_contacts_limit.coffee":function(){

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

},"setKeyValue.js":function(){

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

},"billing_settleup.coffee":function(){

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

},"setUsername.coffee":function(){

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

},"billing_recharge.coffee":function(require){

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

},"get_space_user_count.coffee":function(){

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

},"user_secret.coffee":function(){

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

},"object_workflows.coffee":function(){

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

},"update_server_session.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/update_server_session.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_space_user_password.coffee":function(){

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

}},"lib":{"billing_manager.coffee":function(require,exports,module){

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

}},"schedule":{"statistics.js":function(require){

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

},"billing.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/schedule/billing.coffee                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"startup":{"migrations":{"v1.coffee":function(){

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

},"v2.coffee":function(){

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

},"v3.coffee":function(){

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

},"v4.coffee":function(){

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

},"v5.coffee":function(){

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

},"v6.coffee":function(require,exports,module){

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

},"xrun.coffee":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/xrun.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup.coffee":function(){

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

},"development.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/development.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"tabular.coffee":function(){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL21ldGhvZHMvc2V0S2V5VmFsdWUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2dldF9zcGFjZV91c2VyX2NvdW50LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9zY2hlZHVsZS9zdGF0aXN0aWNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YxLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YxLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Mi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Mi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjYuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjYuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvZGV2ZWxvcG1lbnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvdGFidWxhci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiY29va2llcyIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiYmlsbGluZyIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNDbGllbnQiLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsInR5cGUiLCJjb25maXJtQnV0dG9uVGV4dCIsImdldEFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHkiLCJzdGVlZG9zX2tleXZhbHVlcyIsImZpbmRPbmUiLCJ1c2VyIiwidXNlcklkIiwia2V5IiwidmFsdWUiLCJhcHBseUFjY291bnRCZ0JvZHlWYWx1ZSIsImFjY291bnRCZ0JvZHlWYWx1ZSIsImlzTmVlZFRvTG9jYWwiLCJhdmF0YXIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCIkIiwicmVtb3ZlQ2xhc3MiLCJTZXNzaW9uIiwiZ2V0IiwiYWRkQ2xhc3MiLCJzaG93SGVscCIsImdldExvY2FsZSIsIndpbmRvdyIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJhdXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhYnNvbHV0ZVVybCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJpc0NvcmRvdmEiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwiZXJyb3IxIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwic3BhY2VJZCIsImVuZF9kYXRlIiwibWluX21vbnRocyIsInNwYWNlIiwiaXNTcGFjZUFkbWluIiwic3BhY2VzIiwiaGFzRmVhdHVyZSIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiY3NzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlZjIiLCJyZWYzIiwicmVzdWx0IiwidXNlcm5hbWUiLCJxdWVyeSIsInVzZXJzIiwic3RlZWRvc19pZCIsIl9jaGVja1Bhc3N3b3JkIiwiRXJyb3IiLCJjaGVja0F1dGhUb2tlbiIsImhlYWRlcnMiLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImRlY3J5cHQiLCJpdiIsImMiLCJkZWNpcGhlciIsImRlY2lwaGVyTXNnIiwia2V5MzIiLCJsZW4iLCJjcmVhdGVEZWNpcGhlcml2IiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJlbmNyeXB0IiwiY2lwaGVyIiwiY2lwaGVyZWRNc2ciLCJjcmVhdGVDaXBoZXJpdiIsImdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsImNvbGxlY3Rpb24iLCJvYmoiLCJzcGxpdCIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiZnVuYyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlYXNvbiIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0REJEYXNoYm9hcmRzIiwiZGJEYXNoYm9hcmRzIiwiZGFzaGJvYXJkIiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsInN0YXJ0dXAiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZm9yZWlnbl9rZXkiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInJlZmVyZW5jZXMiLCJtZXRob2RzIiwidXBkYXRlVXNlckxhc3RMb2dvbiIsIiRzZXQiLCJsYXN0X2xvZ29uIiwib25Mb2dpbiIsInVzZXJzX2FkZF9lbWFpbCIsImVtYWlsIiwiY291bnQiLCJlbWFpbHMiLCJkaXJlY3QiLCIkcHVzaCIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsInVzZXJzX3JlbW92ZV9lbWFpbCIsInAiLCIkcHVsbCIsInVzZXJzX3ZlcmlmeV9lbWFpbCIsInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsIiwicHJpbWFyeSIsIm11bHRpIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNsb3NlT25Db25maXJtIiwiYW5pbWF0aW9uIiwiaW5wdXRWYWx1ZSIsInVwZGF0ZVVzZXJBdmF0YXIiLCJlbWFpbFRlbXBsYXRlcyIsImRlZmF1bHRGcm9tIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJzcGxpdHMiLCJ0b2tlbkNvZGUiLCJncmVldGluZyIsInByb2ZpbGUiLCJ0b2tlbl9jb2RlIiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiYWRkIiwib3JncyIsImZ1bGxuYW1lIiwiJG5lIiwiY2FsY3VsYXRlRnVsbG5hbWUiLCJyZXQiLCJtc2ciLCJQdXNoIiwiQ29uZmlndXJlIiwic2VuZGVySUQiLCJBTkRST0lEX1NFTkRFUl9JRCIsInNvdW5kIiwidmlicmF0ZSIsImlvcyIsImJhZGdlIiwiY2xlYXJCYWRnZSIsImFsZXJ0IiwiYXBwTmFtZSIsIlNlbGVjdG9yIiwic2VsZWN0b3JDaGVja1NwYWNlQWRtaW4iLCJzZWxlY3RvciIsImlzX2Nsb3VkYWRtaW4iLCJtYXAiLCJuIiwic2VsZWN0b3JDaGVja1NwYWNlIiwidSIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJhZG1pbkNvbmZpZyIsImljb24iLCJjb2xvciIsInRhYmxlQ29sdW1ucyIsImV4dHJhRmllbGRzIiwicm91dGVyQWRtaW4iLCJwYWlkIiwic2hvd0VkaXRDb2x1bW4iLCJzaG93RGVsQ29sdW1uIiwiZGlzYWJsZUFkZCIsInBhZ2VMZW5ndGgiLCJvcmRlciIsInNwYWNlX3VzZXJfc2lnbnMiLCJBZG1pbkNvbmZpZyIsImNvbGxlY3Rpb25zX2FkZCIsInNlYXJjaEVsZW1lbnQiLCJPIiwiY3VycmVudEVsZW1lbnQiLCJ3ZWJzZXJ2aWNlcyIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwidXNlcl9pZCIsInV1Zmxvd01hbmFnZXIiLCJnZXRTcGFjZSIsIiRvciIsIiRleGlzdHMiLCJlcnJvcnMiLCJlcnJvck1lc3NhZ2UiLCJzdGVlZG9zQXV0aCIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsInVzZXJTZXNzaW9uIiwiU3RyaW5nIiwid3JhcEFzeW5jIiwiY2IiLCJnZXRTZXNzaW9uIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJleHByZXNzIiwiZGVzX2NpcGhlciIsImRlc19jaXBoZXJlZE1zZyIsImRlc19pdiIsImRlc19zdGVlZG9zX3Rva2VuIiwiam9pbmVyIiwia2V5OCIsInJlZGlyZWN0VXJsIiwicmV0dXJudXJsIiwicGFyYW1zIiwid3JpdGVIZWFkIiwiZW5kIiwiZW5jb2RlVVJJIiwic2V0SGVhZGVyIiwiY29sb3JfaW5kZXgiLCJjb2xvcnMiLCJmb250U2l6ZSIsImluaXRpYWxzIiwicG9zaXRpb24iLCJyZXFNb2RpZmllZEhlYWRlciIsInN2ZyIsInVzZXJuYW1lX2FycmF5Iiwid2lkdGgiLCJ3IiwiZnMiLCJnZXRSZWxhdGl2ZVVybCIsImF2YXRhclVybCIsImZpbGUiLCJ3cml0ZSIsIml0ZW0iLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ0b1VUQ1N0cmluZyIsInJlYWRTdHJlYW0iLCJwaXBlIiwicHVibGlzaCIsInJlYWR5IiwiaGFuZGxlIiwiaGFuZGxlMiIsIm9ic2VydmVTcGFjZXMiLCJzZWxmIiwic3VzIiwidXNlclNwYWNlcyIsInVzZXJfYWNjZXB0ZWQiLCJzdSIsIm9ic2VydmUiLCJhZGRlZCIsImRvYyIsInJlbW92ZWQiLCJvbGREb2MiLCJ3aXRob3V0Iiwic3RvcCIsImNoYW5nZWQiLCJuZXdEb2MiLCJvblN0b3AiLCJlbmFibGVfcmVnaXN0ZXIiLCJvbiIsImNodW5rIiwiYmluZEVudmlyb25tZW50IiwicGFyc2VyIiwieG1sMmpzIiwiUGFyc2VyIiwiZXhwbGljaXRBcnJheSIsImV4cGxpY2l0Um9vdCIsInBhcnNlU3RyaW5nIiwiZXJyIiwiV1hQYXkiLCJhdHRhY2giLCJicHIiLCJjb2RlX3VybF9pZCIsInNpZ24iLCJ3eHBheSIsImFwcGlkIiwibWNoX2lkIiwicGFydG5lcl9rZXkiLCJjbG9uZSIsIkpTT04iLCJwYXJzZSIsInRvdGFsX2ZlZSIsImJpbGxpbmdNYW5hZ2VyIiwic3BlY2lhbF9wYXkiLCJ1c2VyX2NvdW50IiwibG9nIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJiaWxsaW5nX3NldHRsZXVwIiwiYWNjb3VudGluZ19tb250aCIsIkVtYWlsIiwidGltZSIsImlzX3BhaWQiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5IiwidGltZUVuZCIsInNldFVzZXJuYW1lIiwic3BhY2VVc2VyIiwiaW52aXRlX3N0YXRlIiwiYmlsbGluZ19yZWNoYXJnZSIsIm5ld19pZCIsIm1vZHVsZV9uYW1lcyIsImxpc3RwcmljZXMiLCJvbmVfbW9udGhfeXVhbiIsIm9yZGVyX2JvZHkiLCJyZXN1bHRfb2JqIiwic3BhY2VfdXNlcl9jb3VudCIsImxpc3RwcmljZV9ybWIiLCJuYW1lX3poIiwiY3JlYXRlVW5pZmllZE9yZGVyIiwiam9pbiIsIm91dF90cmFkZV9ubyIsIm1vbWVudCIsImZvcm1hdCIsInNwYmlsbF9jcmVhdGVfaXAiLCJub3RpZnlfdXJsIiwidHJhZGVfdHlwZSIsInByb2R1Y3RfaWQiLCJpbmZvIiwiZ2V0X3NwYWNlX3VzZXJfY291bnQiLCJ1c2VyX2NvdW50X2luZm8iLCJ0b3RhbF91c2VyX2NvdW50IiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImNyZWF0ZV9zZWNyZXQiLCJyZW1vdmVfc2VjcmV0IiwidG9rZW4iLCJjdXJTcGFjZVVzZXIiLCJvd3MiLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsInNldFNwYWNlVXNlclBhc3N3b3JkIiwic3BhY2VfdXNlcl9pZCIsImNoYW5nZWRVc2VySW5mbyIsImN1cnJlbnRVc2VyIiwibGFuZyIsImxvZ291dCIsInVzZXJDUCIsInNldFBhc3N3b3JkIiwic2VydmljZXMiLCJiY3J5cHQiLCJtb2JpbGVfdmVyaWZpZWQiLCJTTVNRdWV1ZSIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJjb3VudF9kYXlzIiwiZW5kX2RhdGVfdGltZSIsInN0YXJ0X2RhdGVfdGltZSIsImJpbGxpbmdzIiwidHJhbnNhY3Rpb24iLCJiaWxsaW5nX2RhdGUiLCJnZXREYXRlIiwicmVmcmVzaF9iYWxhbmNlIiwicmVmcmVzaF9kYXRlIiwiYXBwX2JpbGwiLCJiX20iLCJiX21fZCIsImJpbGwiLCJjcmVkaXRzIiwiZGViaXRzIiwibGFzdF9iYWxhbmNlIiwibGFzdF9iaWxsIiwicGF5bWVudF9iaWxsIiwic2V0T2JqIiwiJGx0IiwiYmlsbGluZ19tb250aCIsImJhbGFuY2UiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJwYXJlbnQiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwiaXNEZXZlbG9wbWVudCIsImRlZmluZVByb3BlcnR5IiwiZGVwdGgiLCJyZWR1Y2UiLCJmbGF0IiwidG9GbGF0dGVuIiwiaXNBcnJheSIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsInNlYXJjaGluZyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwiJGFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztB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a05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxuXHRcInVybC1zZWFyY2gtcGFyYW1zLXBvbHlmaWxsXCI6IFwiXjcuMC4wXCIsXG59LCAnc3RlZWRvczpiYXNlJyk7XG5cbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcpIHtcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XG5cdFx0XCJ3ZWl4aW4tcGF5XCI6IFwiXjEuMS43XCJcblx0fSwgJ3N0ZWVkb3M6YmFzZScpO1xufSIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIGlmICghdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFsb2NhbGUpe1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG4gICAgfVxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxuICAgICAgICB9ZWxzZXtcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcblx0XHR9XG4gICAgfSk7XG59O1xuXG5cbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XG4gICAgICAgIHYucHVzaChtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdjtcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XG4gKi9cbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIGcgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIGcucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnO1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciByID0gbnVsbDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcjtcbn0iLCJTdGVlZG9zID1cblx0c2V0dGluZ3M6IHt9XG5cdGRiOiBkYlxuXHRzdWJzOiB7fVxuXHRpc1Bob25lRW5hYmxlZDogLT5cblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXG5cblx0XHRpZiAhbnVtYmVyXG5cdFx0XHRyZXR1cm4gJyc7XG5cblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxuXHRcdFx0aWYgc2NhbGUgfHwgc2NhbGUgPT0gMFxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xuXHRcdFx0XHRpZiAhKHNjYWxlIHx8IHNjYWxlID09IDApXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXG5cdFx0XHRcdFx0dW5sZXNzIHNjYWxlXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXG5cdFx0XHRcdGlmIHNjYWxlID09IDBcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcblx0XHRcdHJldHVybiBudW1iZXJcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxuXHRcdGlmIGFjY291bnRCZ0JvZHlcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcblx0XHQjIGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHQjIFx0aWYgdXJsID09IGF2YXRhclxuXHRcdCMgXHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXG5cdFx0IyBcdGVsc2Vcblx0XHQjIFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcblx0XHQjIGVsc2Vcblx0XHQjIFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxuXHRcdCMgXHRpZiBiYWNrZ3JvdW5kXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxuXHRcdGlmIGFjY291bnRTa2luXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXG5cdFx0aWYgYWNjb3VudFpvb21cblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcblx0XHR6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXG5cdFx0dW5sZXNzIHpvb21OYW1lXG5cdFx0XHR6b29tTmFtZSA9IFwibGFyZ2VcIlxuXHRcdFx0em9vbVNpemUgPSAxLjJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXG5cdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxuXHRcdFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxuXHRcdFx0IyBlbHNlXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcblxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblxuXHRcdGxpbmtlciA9IFwiP1wiXG5cblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0bGlua2VyID0gXCImXCJcblxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG5cblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblxuXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cdFx0aWYgIWFwcFxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcblx0XHRcdHJldHVyblxuXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cdFx0IyBcdHJldHVyblxuXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcblx0XHRpZiBhcHAuaXNfdXNlX2llXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRpZiBvbl9jbGlja1xuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcblxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcblxuXHRcdGVsc2UgaWYgb25fY2xpY2tcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0bWluX21vbnRocyA9IDFcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRtaW5fbW9udGhzID0gM1xuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxuXHRcdGlmIHNwYWNlICYmIFN0ZWVkb3MuaGFzRmVhdHVyZSgncGFpZCcsIHNwYWNlLl9pZCkgYW5kIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXG5cblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XG5cdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXG5cblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXG5cblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XG5cdFx0ZWxzZVxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxuXHRcdGlmIG9mZnNldFxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcblxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cblx0XHRERVZJQ0UgPVxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xuXHRcdFx0aXBhZDogJ2lwYWQnXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXG5cdFx0XHRpcG9kOiAnaXBvZCdcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcblx0XHRicm93c2VyID0ge31cblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcblx0XHRcdCcnXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxuXHRcdF1cblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXG5cblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBpZnJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxuXHRcdFx0aWZyLmxvYWQgLT5cblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxuXHRcdFx0XHRpZiBpZnJCb2R5XG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxuXHRcdHJldHVybiBmYWxzZTtcblxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxuXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRjaGVjayA9IGZhbHNlXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcblx0XHRcdGNoZWNrID0gdHJ1ZVxuXHRcdHJldHVybiBjaGVja1xuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXG5cdFx0cGFyZW50cyA9IFtdXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cblx0XHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGkgPSAwXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxuXHRcdFx0XHRicmVha1xuXHRcdFx0aSsrXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxuXHRcdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcblx0XHRcdGVsc2Vcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcblxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cblxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxuXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXG5cblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcblxuXHRcdFx0aWYgIXVzZXJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXG5cblx0XHRcdGlmIHJlc3VsdC5lcnJvclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdXNlclxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRpZiB1c2VyXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0dHJ5XG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXHRcdGNhdGNoIGVcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHRrZXkzMiA9IFwiXCJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0aWYgbGVuIDwgMzJcblx0XHRcdGMgPSBcIlwiXG5cdFx0XHRpID0gMFxuXHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdGkrK1xuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XG5cblx0XHRpZiAhYWNjZXNzX3Rva2VuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcblxuXHRcdGlmIHVzZXJcblx0XHRcdHJldHVybiB1c2VySWRcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxuXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXG5cdFx0XHRpZiBvYmpcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxuXHRcdHJldHVybiBudWxsXG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcblxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhdGNoIGVcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXG5cbm1peGluID0gKG9iaikgLT5cblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcblxuI21peGluKF9zLmV4cG9ydHMoKSlcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XG5cdFx0aWYgIWRhdGVcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdHJldHVybiBmYWxzZVxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cblx0XHRcdGlmIGkgPCBkYXlzXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcblx0XHRcdHJldHVyblxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxuXHRcdHJldHVybiBwYXJhbV9kYXRlXG5cblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7Rcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cblxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxuXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cblx0XHRqID0gMFxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gMFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXG5cdFx0XHRcdGogPSBsZW4vMlxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcblx0XHRcdGkgPSAwXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcblxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxuXHRcdFx0XHRcdGJyZWFrXG5cblx0XHRcdFx0aSsrXG5cblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IGkgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcblxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcblxuXHRcdGlmIGogPiBtYXhfaW5kZXhcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcblxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Xy5leHRlbmQgU3RlZWRvcyxcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXG5cdFx0XHRpZiBhcHBcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRcdFx0aSA9IDBcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdFx0XHRpKytcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cblxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXG5cdFx0XHRpZiBpc0kxOG5cblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRyZXR1cm4gbG9jYWxlXG5cblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcblxuXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxuXHRcdFx0dmFsaWQgPSB0cnVlXG5cdFx0XHR1bmxlc3MgcHdkXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcblxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcblx0XHRcdHBhc3N3b3JQb2xpY3lFcnJvciA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lFcnJvclxuXHRcdFx0aWYgcGFzc3dvclBvbGljeVxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxuXHRcdFx0XHRcdHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHZhbGlkID0gdHJ1ZVxuI1x0XHRcdGVsc2VcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0aWYgdmFsaWRcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxuXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxuXHRkYkFwcHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoYXBwKS0+XG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXG5cblx0cmV0dXJuIGRiQXBwc1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IChzcGFjZV9pZCktPlxuXHRkYkRhc2hib2FyZHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoZGFzaGJvYXJkKS0+XG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXG5cblx0cmV0dXJuIGRiRGFzaGJvYXJkc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxuXHRcdHJldHVybiBhdXRoVG9rZW5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5hdXRvcnVuICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcbiNcdFx0ZWxzZVxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW47ICAgICAgICAgXG5cblN0ZWVkb3MgPSB7XG4gIHNldHRpbmdzOiB7fSxcbiAgZGI6IGRiLFxuICBzdWJzOiB7fSxcbiAgaXNQaG9uZUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgcmV0dXJuICEhKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDAgOiB2b2lkIDApO1xuICB9LFxuICBudW1iZXJUb1N0cmluZzogZnVuY3Rpb24obnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKSB7XG4gICAgdmFyIHJlZiwgcmVmMSwgcmVnO1xuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSBcIm51bWJlclwiKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG51bWJlciAhPT0gXCJOYU5cIikge1xuICAgICAgaWYgKHNjYWxlIHx8IHNjYWxlID09PSAwKSB7XG4gICAgICAgIG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFub3RUaG91c2FuZHMpIHtcbiAgICAgICAgaWYgKCEoc2NhbGUgfHwgc2NhbGUgPT09IDApKSB7XG4gICAgICAgICAgc2NhbGUgPSAocmVmID0gbnVtYmVyLm1hdGNoKC9cXC4oXFxkKykvKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmWzFdKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKCFzY2FsZSkge1xuICAgICAgICAgICAgc2NhbGUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2c7XG4gICAgICAgIGlmIChzY2FsZSA9PT0gMCkge1xuICAgICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZztcbiAgICAgICAgfVxuICAgICAgICBudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdmFsaUpxdWVyeVN5bWJvbHM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZWc7XG4gICAgcmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKTtcbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIiwgdXJsKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsIGF2YXRhcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50U2tpbjtcbiAgICBhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJza2luXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFNraW4pIHtcbiAgICAgIHJldHVybiBhY2NvdW50U2tpbi52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tO1xuICAgIGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInpvb21cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50Wm9vbSkge1xuICAgICAgcmV0dXJuIGFjY291bnRab29tLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRab29tVmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgem9vbU5hbWUsIHpvb21TaXplO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgfVxuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcbiAgICB6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZTtcbiAgICB6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZTtcbiAgICBpZiAoIXpvb21OYW1lKSB7XG4gICAgICB6b29tTmFtZSA9IFwibGFyZ2VcIjtcbiAgICAgIHpvb21TaXplID0gMS4yO1xuICAgIH1cbiAgICBpZiAoem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKSkge1xuICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLVwiICsgem9vbU5hbWUpO1xuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIiwgYWNjb3VudFpvb21WYWx1ZS5uYW1lKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIiwgYWNjb3VudFpvb21WYWx1ZS5zaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmIChzcGFjZSAmJiBTdGVlZG9zLmhhc0ZlYXR1cmUoJ3BhaWQnLCBzcGFjZS5faWQpICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNoZWNrID0gZmFsc2U7XG4gICAgbW9kdWxlcyA9IChyZWYgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgICBwYXJlbnRzID0gXy51bmlvbihwYXJlbnRzLCBvcmcucGFyZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHJlZiA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZXN1bHQsIHVzZXIsIHVzZXJJZCwgdXNlcm5hbWU7XG4gICAgdXNlcm5hbWUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmMiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjJbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjMgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYzW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHVzZXJJZDtcbiAgICB1c2VySWQgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMVtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMiA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYyLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWYsIHNlY29uZF9kYXRlLCBzdGFydF9kYXRlLCB0aW1lX3BvaW50cztcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICB0aW1lX3BvaW50cyA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmLnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciBwYXNzd29yUG9saWN5LCBwYXNzd29yUG9saWN5RXJyb3IsIHJlYXNvbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB2YWxpZDtcbiAgICAgIHJlYXNvbiA9IHQoXCJwYXNzd29yZF9pbnZhbGlkXCIpO1xuICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgaWYgKCFwd2QpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhc3N3b3JQb2xpY3kgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9IChyZWYyID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkRhc2hib2FyZHM7XG4gIGRiRGFzaGJvYXJkcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJldHVybiBkYkRhc2hib2FyZHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmb3JlaWduX2tleTogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksIHJlZmVyZW5jZXM6IE1hdGNoLk9wdGlvbmFsKE9iamVjdCl9KTtcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgICAgICAgICAgdXBkYXRlVXNlckxhc3RMb2dvbjogKCkgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsICd1cGRhdGVVc2VyTGFzdExvZ29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGxhc3RfbG9nb246IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNZXRlb3IuY2FsbCgndXBkYXRlVXNlckxhc3RMb2dvbicpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICBNZXRlb3IubWV0aG9kc1xuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIGlmIGRiLnVzZXJzLmZpbmQoe1wiZW1haWxzLmFkZHJlc3NcIjogZW1haWx9KS5jb3VudCgpPjBcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdXNoOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHNldDogXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgXVxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPj0gMlxuICAgICAgICBwID0gbnVsbFxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgICBwID0gZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1bGw6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgcFxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwifVxuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cbiAgICAgIFxuXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlsc1xuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXG4gICAgICAgICAgZS5wcmltYXJ5ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcblxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXG4gICAgICAgICRzZXQ6XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcbiAgICAgICAgICBlbWFpbDogZW1haWxcblxuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7dXNlcjogdGhpcy51c2VySWR9LHskc2V0OiB7ZW1haWw6IGVtYWlsfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICByZXR1cm4ge31cblxuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gKCktPlxuICAgICAgICBzd2FsXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cbiAgICAgICAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIChlcnJvciwgcmVzdWx0KS0+XG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcbiMjI1xuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuIyMjIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXNlcnNfYWRkX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChkYi51c2Vycy5maW5kKHtcbiAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbFxuICAgICAgfSkuY291bnQoKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbCxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgcCwgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPj0gMikge1xuICAgICAgICBwID0gbnVsbDtcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICAgIHAgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgZW1haWxzLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlscztcbiAgICAgIGVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICB9LCBmdW5jdGlvbihpbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgPyByZXN1bHQuZXJyb3IgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3dhbCh0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuXG5cbi8qXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICAqIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuICovXG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7YXZhdGFyOiBhdmF0YXJ9fSkgICIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJBdmF0YXI6IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGF2YXRhcjogYXZhdGFyXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCJBY2NvdW50cy5lbWFpbFRlbXBsYXRlcyA9IHtcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncylcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbTtcblx0fSkoKSxcblx0cmVzZXRQYXNzd29yZDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHR2ZXJpZnlFbWFpbDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9lbWFpbFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0ZW5yb2xsQWNjb3VudDoge1xuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2NyZWF0ZV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH1cbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcbiAgXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxuXHR7XG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxuXHRcdHtcblx0XHRcdC8vIOiHquW3seWSjOWtkOmDqOmXqOeahGZ1bGxuYW1l5L+u5pS5XG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XG5cdFx0XHRcblx0XHR9KTtcblx0fVx0XG5cbiAgXHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgXHRkYXRhOiB7XG5cdCAgICAgIFx0cmV0OiAwLFxuXHQgICAgICBcdG1zZzogXCJTdWNjZXNzZnVsbHlcIlxuICAgIFx0fVxuICBcdH0pO1xufSk7XG5cbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcbiAgICAgICAgTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBpb3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuIiwiaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFB1c2guQ29uZmlndXJlKHtcbiAgICAgIGFuZHJvaWQ6IHtcbiAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRCxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBpb3M6IHtcbiAgICAgICAgYmFkZ2U6IHRydWUsXG4gICAgICAgIGNsZWFyQmFkZ2U6IHRydWUsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNlbGVjdG9yID0ge31cblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7YWRtaW5zOnskaW46W3VzZXJJZF19fSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gKHVzZXJJZCkgLT5cblx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG5cdFx0aWYgc3BhY2VJZFxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRpZiAhdXNlclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHNlbGVjdG9yID0ge31cblx0XHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXG5cdFx0c3BhY2VzID0gW11cblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XG5cdFx0XHRzcGFjZXMucHVzaCh1LnNwYWNlKVxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxuXHRcdHJldHVybiBzZWxlY3RvclxuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cblx0aWNvbjogXCJnbG9iZVwiXG5cdGNvbG9yOiBcImJsdWVcIlxuXHR0YWJsZUNvbHVtbnM6IFtcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXG5cdFx0e25hbWU6IFwibW9kdWxlc1wifSxcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJ9LFxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxuXHRdXG5cdGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdFx0cmV0dXJuIHt9XG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxuXHRzaG93RGVsQ29sdW1uOiBmYWxzZVxuXHRkaXNhYmxlQWRkOiB0cnVlXG5cdHBhZ2VMZW5ndGg6IDEwMFxuXHRvcmRlcjogW1swLCBcImRlc2NcIl1dXG5cbk1ldGVvci5zdGFydHVwIC0+XG5cdEBzcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWduc1xuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxuXHRcdHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWdcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG4gPSBwYXJzZUludChhcmd1bWVudHNbMV0pIHx8IDA7XG4gICAgdmFyIGs7XG4gICAgaWYgKG4gPj0gMCkge1xuICAgICAgayA9IG47XG4gICAgfSBlbHNlIHtcbiAgICAgIGsgPSBsZW4gKyBuO1xuICAgICAgaWYgKGsgPCAwKSB7ayA9IDA7fVxuICAgIH1cbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxuICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGsrKztcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufSIsIk1ldGVvci5zdGFydHVwIC0+XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXG5cbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cbiAgICAgIHd3dzogXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XG5cdGxpc3RWaWV3cyA9IHt9XG5cblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxuXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZldGNoKClcblxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxuXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXHRfLmZvckVhY2ggb2JqZWN0cywgKG8sIGtleSktPlxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3Rfdmlldylcblx0XHRcdGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3XG5cdHJldHVybiBsaXN0Vmlld3NcblxuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSlcblxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcblxuXG5cblxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIi8vIFNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xuLy8gICAndXNlIHN0cmljdCc7XG5cbi8vICAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XG5cbi8vICAgdmFyIGNoZWNrRm9yS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuLy8gICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcbi8vICAgICB9XG4vLyAgIH07XG4vLyAgIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcbi8vICAgICByZXR1cm4gb2JqICYmIG9iai52YWx1ZXMgJiYgb2JqLnZhbHVlc1trZXldO1xuLy8gICB9O1xuLy8gICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xuLy8gICAgIHJldHVybiB0cnVlO1xuLy8gICB9O1xuXG4vLyAgIENvbGxlY3Rpb24uZGVueSh7XG4vLyAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH0sXG4vLyAgICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9LFxuLy8gICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcbi8vICAgICB9XG4vLyAgIH0pO1xuXG4vLyAgIC8vIHB1YmxpYyBjbGllbnQgYW5kIHNlcnZlciBhcGlcbi8vICAgdmFyIGFwaSA9IHtcbi8vICAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xuLy8gICAgICAgY29uc29sZS5sb2coQ29sbGVjdGlvbi5maW5kT25lKCkpO1xuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbi8vICAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKTtcbi8vICAgICAgIH1cbi8vICAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAvLyAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuLy8gICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuLy8gICAgIH0sXG4vLyAgICAgJ2VxdWFscyc6IGZ1bmN0aW9uIChrZXksIGV4cGVjdGVkLCBpZGVudGljYWwpIHtcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuXG4vLyAgICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcblxuLy8gICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmIF8uaXNPYmplY3QoZXhwZWN0ZWQpKSB7XG4vLyAgICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xuLy8gICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XG4vLyAgICAgICB9XG5cbi8vICAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XG4vLyAgICAgfVxuLy8gICB9O1xuXG4vLyAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCl7XG4vLyAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuLy8gICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XG4vLyAgICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcbi8vICAgICAgICAgfVxuLy8gICAgICAgfSlcbi8vICAgICB9XG4vLyAgIH0pXG5cbi8vICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuLy8gICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbi8vICAgICAvLyAgIGlmIChDb2xsZWN0aW9uLmZpbmRPbmUoKSkge1xuLy8gICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcbi8vICAgICAvLyAgIH1cbi8vICAgICAvLyB9KTtcblxuLy8gICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcbi8vICAgICAgIHZhciBjbGllbnRJRCA9IGNvbm5lY3Rpb24uaWQ7XG5cbi8vICAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5pbnNlcnQoeyAnY2xpZW50SUQnOiBjbGllbnRJRCwgJ3ZhbHVlcyc6IHt9LCBcImNyZWF0ZWRcIjogbmV3IERhdGUoKSB9KTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgY29ubmVjdGlvbi5vbkNsb3NlKGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcbi8vICAgICAgIH0pO1xuLy8gICAgIH0pO1xuXG4vLyAgICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZCh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbi8vICAgICB9KTtcblxuLy8gICAgIE1ldGVvci5tZXRob2RzKHtcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4vLyAgICAgICB9LFxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XG5cbi8vICAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcblxuLy8gICAgICAgICBpZiAoIWNvbmRpdGlvbihrZXksIHZhbHVlKSlcbi8vICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XG5cbi8vICAgICAgICAgdmFyIHVwZGF0ZU9iaiA9IHt9O1xuLy8gICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xuXG4vLyAgICAgICAgIENvbGxlY3Rpb24udXBkYXRlKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0sIHsgJHNldDogdXBkYXRlT2JqIH0pO1xuLy8gICAgICAgfVxuLy8gICAgIH0pOyAgXG5cbi8vICAgICAvLyBzZXJ2ZXItb25seSBhcGlcbi8vICAgICBfLmV4dGVuZChhcGksIHtcbi8vICAgICAgICdzZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxuLy8gICAgICAgfSxcbi8vICAgICAgICdzZXRDb25kaXRpb24nOiBmdW5jdGlvbiAobmV3Q29uZGl0aW9uKSB7XG4vLyAgICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcbi8vICAgICAgIH1cbi8vICAgICB9KTtcbi8vICAgfVxuXG4vLyAgIHJldHVybiBhcGk7XG4vLyB9KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0dXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCByZXEucXVlcnk/LnVzZXJJZFxuXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxuXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxuXHRcdFxuXHRcdGlmICF1c2VyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRyZXR1cm47XG5cblx0XHR1c2VyX2lkID0gdXNlci5faWRcblxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxuXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcblxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcblxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogYXBwc31cblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiAyMDBcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XG5cdFxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB0cnlcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXG4gICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgIWF1dGhUb2tlblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcbiAgICAgICAgZGF0YSA9IFtdXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXG5cbiAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpXG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogW11cblxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKVxuICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICFhdXRoVG9rZW5cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWxcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9uc1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlXG4gICAgICAgIGRhdGEgPSBbXVxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAjIOeUqOaIt+eZu+W9lemqjOivgVxuICAgICAgICBjaGVjayhzcGFjZSwgU3RyaW5nKVxuICAgICAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZylcbiAgICAgICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSAtPlxuICAgICAgICAgICAgc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgICAgICAgICBjYihyZWplY3QsIHJlc29sdmUpXG4gICAgICAgICAgICApKGF1dGhUb2tlbiwgc3BhY2UpXG4gICAgICAgIHVubGVzcyB1c2VyU2Vzc2lvblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImF1dGggZmFpbGVkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZFxuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge31cblxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge31cbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKVxuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHt9XG4iLCJ2YXIgQ29va2llcywgc3RlZWRvc0F1dGg7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgY2hlY2soYXV0aFRva2VuLCBTdHJpbmcpO1xuICAgIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgICAgfSk7XG4gICAgfSkoYXV0aFRva2VuLCBzcGFjZSk7XG4gICAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA1MDAsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJJZCA9IHVzZXJTZXNzaW9uLnVzZXJJZDtcbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKG1vZGVsID09PSAnbWFpbF9hY2NvdW50cycpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pO1xuICB9XG59KTtcbiIsImNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKVxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZClcblx0aWYgYXBwXG5cdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXHRcdHJlZGlyZWN0VXJsID0gYXBwLnVybFxuXHRlbHNlXG5cdFx0c2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRyZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmxcblxuXHRpZiAhcmVkaXJlY3RVcmxcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdHJlcy5lbmQoKVxuXHRcdHJldHVyblxuXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuXHQjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuXHQjIGlmIHJlcS5ib2R5XG5cdCMgXHR1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxuXHQjIFx0YXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHQjICMgdGhlbiBjaGVjayBjb29raWVcblx0IyBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdCMgXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cblx0XHR1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl1cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRpZiB1c2VyXG5cdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdCMgZGVzLWNiY1xuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXG5cdFx0XHRrZXk4ID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDhcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDggLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gOFxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXG5cdFx0XHRkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSlcblx0XHRcdGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSlcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRqb2luZXIgPSBcIj9cIlxuXG5cdFx0XHRpZiByZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xXG5cdFx0XHRcdGpvaW5lciA9IFwiJlwiXG5cblx0XHRcdHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlblxuXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXG5cdFx0XHRcdHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9I3tlbmNvZGVVUkkodXNlci51c2VybmFtZSl9XCJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCByZXR1cm51cmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdHJlcy53cml0ZUhlYWQgNDAxXG5cdHJlcy5lbmQoKVxuXHRyZXR1cm5cbiIsInZhciBDb29raWVzLCBjcnlwdG8sIGV4cHJlc3M7XG5cbmNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHAsIGF1dGhUb2tlbiwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgY29va2llcywgZGVzX2NpcGhlciwgZGVzX2NpcGhlcmVkTXNnLCBkZXNfaXYsIGRlc19zdGVlZG9zX3Rva2VuLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGpvaW5lciwga2V5MzIsIGtleTgsIGxlbiwgbSwgbm93LCByZWRpcmVjdFVybCwgcmV0dXJudXJsLCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgYXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKTtcbiAgaWYgKGFwcCkge1xuICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgcmVkaXJlY3RVcmwgPSBhcHAudXJsO1xuICB9IGVsc2Uge1xuICAgIHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgIHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybDtcbiAgfVxuICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgaWYgKCF1c2VySWQgJiYgIWF1dGhUb2tlbikge1xuICAgIHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIH1cbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgfVxuICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBkZXNfaXYgPSBcIi04NzYyLWZjXCI7XG4gICAgICBrZXk4ID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDgpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gOCAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gOCkge1xuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLCA4KTtcbiAgICAgIH1cbiAgICAgIGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKTtcbiAgICAgIGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSk7XG4gICAgICBkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBqb2luZXIgPSBcIj9cIjtcbiAgICAgIGlmIChyZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICAgIGpvaW5lciA9IFwiJlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuO1xuICAgICAgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT1cIiArIChlbmNvZGVVUkkodXNlci51c2VybmFtZSkpO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHJldHVybnVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgcmVzLmVuZCgpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdFx0IyB0aGlzLnBhcmFtcyA9XG5cdFx0IyBcdHVzZXJJZDogZGVjb2RlVVJJKHJlcS51cmwpLnJlcGxhY2UoL15cXC8vLCAnJykucmVwbGFjZSgvXFw/LiokLywgJycpXG5cdFx0d2lkdGggPSA1MCA7XG5cdFx0aGVpZ2h0ID0gNTAgO1xuXHRcdGZvbnRTaXplID0gMjggO1xuXHRcdGlmIHJlcS5xdWVyeS53XG5cdFx0ICAgIHdpZHRoID0gcmVxLnF1ZXJ5LncgO1xuXHRcdGlmIHJlcS5xdWVyeS5oXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcblx0XHRpZiByZXEucXVlcnkuZnNcbiAgICAgICAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzIDtcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcblx0XHRpZiAhdXNlclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLnByb2ZpbGU/LmF2YXRhclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxuXHRcdFx0XHRcdCB2aWV3Qm94PVwiMCAwIDcyIDcyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XG5cdFx0XHRcdDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XG5cdFx0XHRcdFx0LnN0MXtmaWxsOiNEMEQwRDA7fVxuXHRcdFx0XHQ8L3N0eWxlPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelwiLz5cblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxnPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcblx0XHRcdFx0XHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elwiLz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcblx0XHRcdFx0XHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcIi8+XG5cdFx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG4jXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvcGFja2FnZXMvc3RlZWRvc19iYXNlL2NsaWVudC9pbWFnZXMvZGVmYXVsdC1hdmF0YXIucG5nXCIpXG4jXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcblx0XHRpZiAhdXNlcm5hbWVcblx0XHRcdHVzZXJuYW1lID0gXCJcIlxuXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cblx0XHRcdGNvbG9ycyA9IFsnI0Y0NDMzNicsJyNFOTFFNjMnLCcjOUMyN0IwJywnIzY3M0FCNycsJyMzRjUxQjUnLCcjMjE5NkYzJywnIzAzQTlGNCcsJyMwMEJDRDQnLCcjMDA5Njg4JywnIzRDQUY1MCcsJyM4QkMzNEEnLCcjQ0REQzM5JywnI0ZGQzEwNycsJyNGRjk4MDAnLCcjRkY1NzIyJywnIzc5NTU0OCcsJyM5RTlFOUUnLCcjNjA3RDhCJ11cblxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxuXHRcdFx0Y29sb3JfaW5kZXggPSAwXG5cdFx0XHRfLmVhY2ggdXNlcm5hbWVfYXJyYXksIChpdGVtKSAtPlxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG5cblx0XHRcdHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cblx0XHRcdCNjb2xvciA9IFwiI0Q2REFEQ1wiXG5cblx0XHRcdGluaXRpYWxzID0gJydcblx0XHRcdGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpXG5cblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxuXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgd2lkdGg9XCIje3dpZHRofVwiIGhlaWdodD1cIiN7aGVpZ2h0fVwiIHN0eWxlPVwid2lkdGg6ICN7d2lkdGh9cHg7IGhlaWdodDogI3toZWlnaHR9cHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxuXHRcdFx0XHQ8dGV4dCB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIHk9XCI1MCVcIiB4PVwiNTAlXCIgZHk9XCIwLjM2ZW1cIiBwb2ludGVyLWV2ZW50cz1cImF1dG9cIiBmaWxsPVwiI0ZGRkZGRlwiIGZvbnQtZmFtaWx5PVwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVwiIHN0eWxlPVwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAje2ZvbnRTaXplfXB4O1wiPlxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XG5cdFx0XHRcdDwvdGV4dD5cblx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cblx0XHRcdHJlcy53cml0ZSBzdmdcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG5cdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXI/XG5cdFx0XHRpZiByZXFNb2RpZmllZEhlYWRlciA9PSB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxuXHRcdFx0XHRyZXMud3JpdGVIZWFkIDMwNFxuXHRcdFx0XHRyZXMuZW5kKClcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXG5cblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcblx0XHRyZXR1cm4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9yX2luZGV4LCBjb2xvcnMsIGZvbnRTaXplLCBoZWlnaHQsIGluaXRpYWxzLCBwb3NpdGlvbiwgcmVmLCByZWYxLCByZWYyLCByZXFNb2RpZmllZEhlYWRlciwgc3ZnLCB1c2VyLCB1c2VybmFtZSwgdXNlcm5hbWVfYXJyYXksIHdpZHRoO1xuICAgIHdpZHRoID0gNTA7XG4gICAgaGVpZ2h0ID0gNTA7XG4gICAgZm9udFNpemUgPSAyODtcbiAgICBpZiAocmVxLnF1ZXJ5LncpIHtcbiAgICAgIHdpZHRoID0gcmVxLnF1ZXJ5Lnc7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuaCkge1xuICAgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5Lmg7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuZnMpIHtcbiAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzO1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKSk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgocmVmID0gdXNlci5wcm9maWxlKSAhPSBudWxsID8gcmVmLmF2YXRhciA6IHZvaWQgMCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXIpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXJVcmwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBzdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiBpZD1cXFwiTGF5ZXJfMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeD1cXFwiMHB4XFxcIiB5PVxcXCIwcHhcXFwiXFxuXHQgdmlld0JveD1cXFwiMCAwIDcyIDcyXFxcIiBzdHlsZT1cXFwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiPlxcbjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XFxuXHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XFxuPC9zdHlsZT5cXG48Zz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDBcXFwiIGQ9XFxcIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XFxcIi8+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XFxuXHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcXFwiLz5cXG48L2c+XFxuPGc+XFxuXHQ8Zz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcXG5cdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XFxcIi8+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcXG5cdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elxcXCIvPlxcblx0PC9nPlxcbjwvZz5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHVzZXIubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgdXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKTtcbiAgICAgIGNvbG9yX2luZGV4ID0gMDtcbiAgICAgIF8uZWFjaCh1c2VybmFtZV9hcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gY29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuICAgICAgfSk7XG4gICAgICBwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCJcIiArIHdpZHRoICsgXCJcXFwiIGhlaWdodD1cXFwiXCIgKyBoZWlnaHQgKyBcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweDsgaGVpZ2h0OiBcIiArIGhlaWdodCArIFwicHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcblx0PHRleHQgdGV4dC1hbmNob3I9XFxcIm1pZGRsZVxcXCIgeT1cXFwiNTAlXFxcIiB4PVxcXCI1MCVcXFwiIGR5PVxcXCIwLjM2ZW1cXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJhdXRvXFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmb250LWZhbWlseT1cXFwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVxcXCIgc3R5bGU9XFxcImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogXCIgKyBmb250U2l6ZSArIFwicHg7XFxcIj5cXG5cdFx0XCIgKyBpbml0aWFscyArIFwiXFxuXHQ8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmMSA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCAoKHJlZjIgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSB8fCBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJyk7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aCk7XG4gICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUocmVzKTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0XHRhY2Nlc3NfdG9rZW4gPSByZXEucXVlcnk/LmFjY2Vzc190b2tlblxuXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAyMDBcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IucHVibGlzaCAnYXBwcycsIChzcGFjZUlkKS0+XG4gICAgICAgIHVubGVzcyB0aGlzLnVzZXJJZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxuICAgICAgICBcblxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cbiAgICAgICAgaWYgc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiBzcGFjZUlkfV19XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7c29ydDoge3NvcnQ6IDF9fSk7XG4iLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdhcHBzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlxuXG5cdCMgcHVibGlzaCB1c2VycyBzcGFjZXNcblx0IyB3ZSBvbmx5IHB1Ymxpc2ggc3BhY2VzIGN1cnJlbnQgdXNlciBqb2luZWQuXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cblx0XHRzZWxmID0gdGhpcztcblx0XHR1c2VyU3BhY2VzID0gW11cblx0XHRzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0sIHtmaWVsZHM6IHtzcGFjZToxfX0pXG5cdFx0c3VzLmZvckVhY2ggKHN1KSAtPlxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxuXG5cdFx0aGFuZGxlMiA9IG51bGxcblxuXHRcdCMgb25seSByZXR1cm4gdXNlciBqb2luZWQgc3BhY2VzLCBhbmQgb2JzZXJ2ZXMgd2hlbiB1c2VyIGpvaW4gb3IgbGVhdmUgYSBzcGFjZVxuXHRcdGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkub2JzZXJ2ZVxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdGlmIGRvYy5zcGFjZVxuXHRcdFx0XHRcdGlmIHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMFxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcblx0XHRcdFx0XHRcdG9ic2VydmVTcGFjZXMoKVxuXHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcyA9IC0+XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuXHRcdFx0aGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJTcGFjZXN9fSkub2JzZXJ2ZVxuXHRcdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcblx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLl9pZClcblx0XHRcdFx0Y2hhbmdlZDogKG5ld0RvYywgb2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XG5cdFx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5faWRcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXG5cblx0XHRvYnNlcnZlU3BhY2VzKCk7XG5cblx0XHRzZWxmLnJlYWR5KCk7XG5cblx0XHRzZWxmLm9uU3RvcCAtPlxuXHRcdFx0aGFuZGxlLnN0b3AoKTtcblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG4iLCJNZXRlb3IucHVibGlzaCgnbXlfc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGUsIGhhbmRsZTIsIG9ic2VydmVTcGFjZXMsIHNlbGYsIHN1cywgdXNlclNwYWNlcztcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIHVzZXJTcGFjZXMgPSBbXTtcbiAgc3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBzcGFjZTogMVxuICAgIH1cbiAgfSk7XG4gIHN1cy5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSk7XG4gIH0pO1xuICBoYW5kbGUyID0gbnVsbDtcbiAgaGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICBpZiAoZG9jLnNwYWNlKSB7XG4gICAgICAgIGlmICh1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDApIHtcbiAgICAgICAgICB1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKTtcbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgIGlmIChvbGREb2Muc3BhY2UpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZSk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgb2JzZXJ2ZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiB1c2VyU3BhY2VzXG4gICAgICB9XG4gICAgfSkub2JzZXJ2ZSh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgIHNlbGYuYWRkZWQoXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2MsIG9sZERvYykge1xuICAgICAgICByZXR1cm4gc2VsZi5jaGFuZ2VkKFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2MuX2lkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG9ic2VydmVTcGFjZXMoKTtcbiAgc2VsZi5yZWFkeSgpO1xuICByZXR1cm4gc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgcmV0dXJuIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIiMgcHVibGlzaCBzb21lIG9uZSBzcGFjZSdzIGF2YXRhclxuTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX2F2YXRhcicsIChzcGFjZUlkKS0+XG5cdHVubGVzcyBzcGFjZUlkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX2F2YXRhcicsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgaWYgKCFzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuc3BhY2VzLmZpbmQoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhdmF0YXI6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZW5hYmxlX3JlZ2lzdGVyOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ21vZHVsZXMnLCAoKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7IiwiTWV0ZW9yLnB1Ymxpc2goJ21vZHVsZXMnLCBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgKF9pZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0dW5sZXNzIF9pZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRib2R5ID0gXCJcIlxuXHRcdHJlcS5vbignZGF0YScsIChjaHVuayktPlxuXHRcdFx0Ym9keSArPSBjaHVua1xuXHRcdClcblx0XHRyZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCgpLT5cblx0XHRcdFx0eG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJylcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxuXHRcdFx0XHRwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgKGVyciwgcmVzdWx0KS0+XG5cdFx0XHRcdFx0XHQjIOeJueWIq+aPkOmGku+8muWVhuaIt+ezu+e7n+WvueS6juaUr+S7mOe7k+aenOmAmuefpeeahOWGheWuueS4gOWumuimgeWBmuetvuWQjemqjOivgSzlubbmoKHpqozov5Tlm57nmoTorqLljZXph5Hpop3mmK/lkKbkuI7llYbmiLfkvqfnmoTorqLljZXph5Hpop3kuIDoh7TvvIzpmLLmraLmlbDmja7ms4TmvI/lr7zoh7Tlh7rnjrDigJzlgYfpgJrnn6XigJ3vvIzpgKDmiJDotYTph5HmjZ/lpLFcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXG5cdFx0XHRcdFx0XHR3eHBheSA9IFdYUGF5KHtcblx0XHRcdFx0XHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcblx0XHRcdFx0XHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXG5cdFx0XHRcdFx0XHRhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpXG5cdFx0XHRcdFx0XHRjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZFxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxuXHRcdFx0XHRcdFx0aWYgYnByIGFuZCBicHIudG90YWxfZmVlIGlzIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSBhbmQgc2lnbiBpcyByZXN1bHQuc2lnblxuXHRcdFx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7X2lkOiBjb2RlX3VybF9pZH0sIHskc2V0OiB7cGFpZDogdHJ1ZX19KVxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQpXG5cdFx0XHQpLCAoZXJyKS0+XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSdcblx0XHRcdClcblx0XHQpXG5cdFx0XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXG5cdHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpXG5cblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XG5cdFx0IyDmoLnmja7lvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4fvvIzmn6Xor6Llh7rlvZPliY3nlKjmiLfpmZDlrprnmoTnu4Tnu4fmn6XnnIvojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXG5cdFx0IyDpu5jorqTov5Tlm57pmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4dcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXG5cdFx0cmVWYWx1ZSA9XG5cdFx0XHRpc0xpbWl0OiB0cnVlXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0c2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJ9KVxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcblxuXHRcdGlmIGxpbWl0cy5sZW5ndGhcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0XHRcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcblx0XHRcdFx0ZnJvbXMgPSBsaW1pdC5mcm9tc1xuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3Ncblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4/Lm1hcCAobikgLT5cblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcblx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRpZiB0ZW1wSXNMaW1pdFxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xuXHRcdFx0XHRcdFx0bXlMaXRtaXRPcmdJZHMucHVzaCBteU9yZ0lkXG5cblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXG5cdFx0XHRpZiBteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cblx0XHRpZiBpc0xpbWl0XG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ54i25a2Q6IqC54K55YWz57O755qE6IqC54K5562b6YCJ5Ye65p2l5bm25Y+W5Ye65pyA5aSW5bGC6IqC54K5XG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cblx0XHRcdFx0cGFyZW50cyA9IG9yZy5wYXJlbnRzIG9yIFtdXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XG5cdFx0cmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblx0XHRyZXR1cm4gcmVWYWx1ZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICAgc2V0S2V5VmFsdWU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcblxuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgb2JqLmtleSA9IGtleTtcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgdmFyIGMgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kKHtcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSkiLCJNZXRlb3IubWV0aG9kc1xuXHRiaWxsaW5nX3NldHRsZXVwOiAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQ9XCJcIiktPlxuXHRcdGNoZWNrKGFjY291bnRpbmdfbW9udGgsIFN0cmluZylcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9LCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxuXG5cdFx0aWYgbm90IHVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0cmV0dXJuXG5cblx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcnXG5cdFx0c3BhY2VzID0gW11cblx0XHRpZiBzcGFjZV9pZFxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VfaWQsIGlzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0ZWxzZVxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0cmVzdWx0ID0gW11cblx0XHRzcGFjZXMuZm9yRWFjaCAocykgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKVxuXHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdGUgPSB7fVxuXHRcdFx0XHRlLl9pZCA9IHMuX2lkXG5cdFx0XHRcdGUubmFtZSA9IHMubmFtZVxuXHRcdFx0XHRlLmVyciA9IGVyclxuXHRcdFx0XHRyZXN1bHQucHVzaCBlXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aCA+IDBcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XG5cdFx0XHR0cnlcblx0XHRcdFx0RW1haWwgPSBQYWNrYWdlLmVtYWlsLkVtYWlsXG5cdFx0XHRcdEVtYWlsLnNlbmRcblx0XHRcdFx0XHR0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nXG5cdFx0XHRcdFx0ZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbVxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcblx0XHRcdFx0XHR0ZXh0OiBKU09OLnN0cmluZ2lmeSgncmVzdWx0JzogcmVzdWx0KVxuXHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXG5cdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nJyIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19zZXR0bGV1cDogZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgRW1haWwsIGVyciwgcmVzdWx0LCBzcGFjZXMsIHVzZXI7XG4gICAgaWYgKHNwYWNlX2lkID09IG51bGwpIHtcbiAgICAgIHNwYWNlX2lkID0gXCJcIjtcbiAgICB9XG4gICAgY2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcnKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgX2lkOiBzcGFjZV9pZCxcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlc3VsdCA9IFtdO1xuICAgIHNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBlLCBlcnI7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgZSA9IHt9O1xuICAgICAgICBlLl9pZCA9IHMuX2lkO1xuICAgICAgICBlLm5hbWUgPSBzLm5hbWU7XG4gICAgICAgIGUuZXJyID0gZXJyO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCk7XG4gICAgICB0cnkge1xuICAgICAgICBFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWw7XG4gICAgICAgIEVtYWlsLnNlbmQoe1xuICAgICAgICAgIHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbScsXG4gICAgICAgICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICAgICAgICBzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnLFxuICAgICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICdyZXN1bHQnOiByZXN1bHRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcnKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRVc2VybmFtZTogKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkgLT5cblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcblxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcblxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxuXG5cdFx0dW5sZXNzIHVzZXJfaWRcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxuXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IHVzZXJuYW1lfX0pXG5cblx0XHRyZXR1cm4gdXNlcm5hbWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkge1xuICAgIHZhciBzcGFjZVVzZXI7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG4gICAgaWYgKCFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSAmJiB1c2VyX2lkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnZXJyb3ItaW52YWxpZC11c2VyJyk7XG4gICAgfVxuICAgIGlmICghdXNlcl9pZCkge1xuICAgICAgdXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKTtcbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVzZXJuYW1lO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cblx0XHRjaGVjayB0b3RhbF9mZWUsIE51bWJlclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmcgXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXG5cdFx0Y2hlY2sgbW9kdWxlX25hbWVzLCBBcnJheSBcblx0XHRjaGVjayBlbmRfZGF0ZSwgU3RyaW5nIFxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcblxuXHRcdHVzZXJfaWQgPSB0aGlzLnVzZXJJZFxuXG5cdFx0bGlzdHByaWNlcyA9IDBcblx0XHRvcmRlcl9ib2R5ID0gW11cblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XG5cdFx0XHRsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYlxuXHRcdFx0b3JkZXJfYm9keS5wdXNoIG0ubmFtZV96aFxuXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0XHRpZiBub3Qgc3BhY2UuaXNfcGFpZFxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxuXHRcdFx0b25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlc1xuXHRcdFx0aWYgdG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4qMTAwXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxuXG5cdFx0cmVzdWx0X29iaiA9IHt9XG5cblx0XHRhdHRhY2ggPSB7fVxuXHRcdGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZFxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXG5cblx0XHR3eHBheSA9IFdYUGF5KHtcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcblx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuXHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcblx0XHR9KVxuXG5cdFx0d3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG5cdFx0XHRvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcblx0XHRcdHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG5cdFx0XHRub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuXHRcdFx0dHJhZGVfdHlwZTogJ05BVElWRScsXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG5cdFx0XHRhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcblx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgoZXJyLCByZXN1bHQpIC0+IFxuXHRcdFx0XHRpZiBlcnIgXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcblx0XHRcdFx0aWYgcmVzdWx0XG5cdFx0XHRcdFx0b2JqID0ge31cblx0XHRcdFx0XHRvYmouX2lkID0gbmV3X2lkXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZVxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XG5cdFx0XHRcdFx0b2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZVxuXHRcdFx0XHRcdG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRcdFx0b2JqLnBhaWQgPSBmYWxzZVxuXHRcdFx0XHRcdG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblx0XHRcdFx0XHRvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopXG5cdFx0XHQpLCAoZSktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJ1xuXHRcdFx0XHRjb25zb2xlLmxvZyBlLnN0YWNrXG5cdFx0XHQpXG5cdFx0KVxuXG5cdFx0XG5cdFx0cmV0dXJuIFwic3VjY2Vzc1wiIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3JlY2hhcmdlOiBmdW5jdGlvbih0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgICB2YXIgV1hQYXksIGF0dGFjaCwgbGlzdHByaWNlcywgb25lX21vbnRoX3l1YW4sIG9yZGVyX2JvZHksIHJlc3VsdF9vYmosIHNwYWNlLCBzcGFjZV91c2VyX2NvdW50LCB1c2VyX2lkLCB3eHBheTtcbiAgICBjaGVjayh0b3RhbF9mZWUsIE51bWJlcik7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobmV3X2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG1vZHVsZV9uYW1lcywgQXJyYXkpO1xuICAgIGNoZWNrKGVuZF9kYXRlLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJfY291bnQsIE51bWJlcik7XG4gICAgdXNlcl9pZCA9IHRoaXMudXNlcklkO1xuICAgIGxpc3RwcmljZXMgPSAwO1xuICAgIG9yZGVyX2JvZHkgPSBbXTtcbiAgICBkYi5tb2R1bGVzLmZpbmQoe1xuICAgICAgbmFtZToge1xuICAgICAgICAkaW46IG1vZHVsZV9uYW1lc1xuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgbGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWI7XG4gICAgICByZXR1cm4gb3JkZXJfYm9keS5wdXNoKG0ubmFtZV96aCk7XG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICBzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSkuY291bnQoKTtcbiAgICAgIG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXM7XG4gICAgICBpZiAodG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4gKiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6VcIiArIG9uZV9tb250aF95dWFuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0X29iaiA9IHt9O1xuICAgIGF0dGFjaCA9IHt9O1xuICAgIGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZDtcbiAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgfSk7XG4gICAgd3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcbiAgICAgIGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG4gICAgICBvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICBub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuICAgICAgdHJhZGVfdHlwZTogJ05BVElWRScsXG4gICAgICBwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICBhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcbiAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLl9pZCA9IG5ld19pZDtcbiAgICAgICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZTtcbiAgICAgICAgb2JqLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWU7XG4gICAgICAgIG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgICAgICAgb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgIG9iai5wYWlkID0gZmFsc2U7XG4gICAgICAgIG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICAgICAgICBvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgb2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICAgICAgICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKTtcbiAgICAgIH1cbiAgICB9KSwgZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBiaWxsaW5nX3JlY2hhcmdlLmNvZmZlZScpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGUuc3RhY2spO1xuICAgIH0pKTtcbiAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXG5cblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXG5cblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xuXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXG5cbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXG5cbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSB9IH0pXG4gICAgICAgICAgICBpZiBmbFxuICAgICAgICAgICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZVxuICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXG4gICAgICAgICAgICAgICAgaWYgcGVybXNcbiAgICAgICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG5cbiAgICAgICAgb3dzID0gb3dzLmZpbHRlciAobiktPlxuICAgICAgICAgICAgcmV0dXJuIG4uZmxvd19uYW1lXG5cbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIF8uZWFjaChvd3MsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBmbCwgcGVybXM7XG4gICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGZsKSB7XG4gICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICAgIGlmIChwZXJtcykge1xuICAgICAgICAgIGlmIChwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKSkge1xuICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChvcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgb3dzID0gb3dzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5mbG93X25hbWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRTcGFjZVVzZXJQYXNzd29yZDogKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkgLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKVxuXHRcdFxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxuXHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXG5cdFx0dW5sZXNzIGlzU3BhY2VBZG1pblxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXG5cblx0XHRTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cdFx0bG9nb3V0ID0gdHJ1ZTtcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7bG9nb3V0OiBsb2dvdXR9KVxuXHRcdGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0aWYgY2hhbmdlZFVzZXJJbmZvXG5cdFx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskcHVzaDogeydzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogY2hhbmdlZFVzZXJJbmZvLnNlcnZpY2VzPy5wYXNzd29yZD8uYmNyeXB0fX0pXG5cblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxuXHRcdGlmIHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZFxuXHRcdFx0bGFuZyA9ICdlbidcblx0XHRcdGlmIHVzZXJDUC5sb2NhbGUgaXMgJ3poLWNuJ1xuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xuXHRcdFx0U01TUXVldWUuc2VuZFxuXHRcdFx0XHRGb3JtYXQ6ICdKU09OJyxcblx0XHRcdFx0QWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG5cdFx0XHRcdFBhcmFtU3RyaW5nOiAnJyxcblx0XHRcdFx0UmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuXHRcdFx0XHRTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG5cdFx0XHRcdFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG5cdFx0XHRcdG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2hhbmdlZFVzZXJJbmZvLCBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCBsb2dvdXQsIHJlZiwgcmVmMSwgcmVmMiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmICghaXNTcGFjZUFkbWluKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV91c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgU3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBsb2dvdXQgPSB0cnVlO1xuICAgIGlmICh0aGlzLnVzZXJJZCA9PT0gdXNlcl9pZCkge1xuICAgICAgbG9nb3V0ID0gZmFsc2U7XG4gICAgfVxuICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7XG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH0pO1xuICAgIGNoYW5nZWRVc2VySW5mbyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgaWYgKGNoYW5nZWRVc2VySW5mbykge1xuICAgICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB1c2VyX2lkXG4gICAgICB9LCB7XG4gICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgJ3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiAocmVmMSA9IGNoYW5nZWRVc2VySW5mby5zZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjIuYmNyeXB0IDogdm9pZCAwIDogdm9pZCAwXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cblxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0Y291bnRfZGF5cyA9IDBcblxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxuXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXG5cblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxuXHRcdCMgZG8gbm90aGluZ1xuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxuXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cblx0bGFzdF9iaWxsID0gbnVsbFxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxuXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0Y3JlYXRlZDoge1xuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxuXHRcdFx0fSxcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0aWYgcGF5bWVudF9iaWxsXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXG5cdGVsc2Vcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcblxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0XHRpZiBhcHBfYmlsbFxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcblxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcblx0c2V0T2JqID0gbmV3IE9iamVjdFxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxuXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0bm93ID0gbmV3IERhdGVcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2Vcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcblx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHR7XG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cblx0XHR9XG5cdCkuZm9yRWFjaCAoYmlsbCktPlxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXG5cblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRtb2R1bGVzID0gbmV3IEFycmF5XG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y3JlYXRlZDogLTFcblx0XHRcdH1cblx0XHQpXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcblx0XHRcdCMgIGRvIG5vdGhpbmdcblxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxuXHRcdFx0IyAgZG8gbm90aGluZ1xuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cblx0cmV0dXJuIG1vZHVsZXNcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXG5cdClcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxuXG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdHJldHVyblxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRkZWJpdHMgPSAwXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdFx0e1xuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpLmZvckVhY2goKGIpLT5cblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xuXHRcdClcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2Vcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxuXHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRpZiBkZWJpdHMgPiAwXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXG5cblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcblx0XHRcdHtcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRlbHNlXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXG5cblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXG5cblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XG5cblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxuXG5cdG0gPSBtb21lbnQoKVxuXHRub3cgPSBtLl9kXG5cblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcblxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0IyDmm7TmlrBtb2R1bGVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXG5cdGlmIHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cblx0XHRcdG1jbCA9IG5ldyBPYmplY3Rcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxuXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcblxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XG5cbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XG5cbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghZ29fbmV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xuXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHJldHVybiBkYXRla2V5O1xuICAgICAgfTtcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xuICAgICAgfTtcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oC75pWwXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xuICAgICAgICAgIHJldHVybiBtb2Q7XG4gICAgICB9O1xuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KSAgXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5o+S5YWl5pWw5o2uXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RlZWRvczp7XG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmtmbG93OntcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY21zOiB7XG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcblxuICAgICAgZ29fbmV4dCA9IHRydWU7XG5cbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICB9KSk7XG5cbiAgfVxuXG59KVxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDFcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXG4gICAgICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMlxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDNcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogNFxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNVxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRcdHRyeVxuXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcblx0XHRcdFx0XHRcdFx0XHRpZiByXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA2XG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRcdHRyeVxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcblx0XHRcdFx0fSlcblxuXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcblxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cbiAgICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKClcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xuICAgICAgICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiaWYoTWV0ZW9yLmlzRGV2ZWxvcG1lbnQpe1xuXHQvL01ldGVvciDniYjmnKzljYfnuqfliLAxLjkg5Y+K5Lul5LiK5pe2KG5vZGUg54mI5pysIDExKynvvIzlj6/ku6XliKDpmaTmraTku6PnoIFcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEFycmF5LnByb3RvdHlwZSwgJ2ZsYXQnLCB7XG5cdFx0dmFsdWU6IGZ1bmN0aW9uKGRlcHRoID0gMSkge1xuXHRcdFx0cmV0dXJuIHRoaXMucmVkdWNlKGZ1bmN0aW9uIChmbGF0LCB0b0ZsYXR0ZW4pIHtcblx0XHRcdFx0cmV0dXJuIGZsYXQuY29uY2F0KChBcnJheS5pc0FycmF5KHRvRmxhdHRlbikgJiYgKGRlcHRoPjEpKSA/IHRvRmxhdHRlbi5mbGF0KGRlcHRoLTEpIDogdG9GbGF0dGVuKTtcblx0XHRcdH0sIFtdKTtcblx0XHR9XG5cdH0pO1xufSIsIk1ldGVvci5zdGFydHVwICgpLT5cblx0bmV3IFRhYnVsYXIuVGFibGVcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG5cdFx0Y29sbGVjdGlvbjogZGIuYXBwcyxcblx0XHRjb2x1bW5zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2Vcblx0XHRcdH1cblx0XHRdXG5cdFx0ZG9tOiBcInRwXCJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlXG5cdFx0b3JkZXJpbmc6IGZhbHNlXG5cdFx0cGFnZUxlbmd0aDogMTBcblx0XHRpbmZvOiBmYWxzZVxuXHRcdHNlYXJjaGluZzogdHJ1ZVxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cblx0XHRcdHVubGVzcyB1c2VySWRcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuICAgIGNvbGxlY3Rpb246IGRiLmFwcHMsXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdLFxuICAgIGxlbmd0aENoYW5nZTogZmFsc2UsXG4gICAgb3JkZXJpbmc6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwLFxuICAgIGluZm86IGZhbHNlLFxuICAgIHNlYXJjaGluZzogdHJ1ZSxcbiAgICBhdXRvV2lkdGg6IHRydWUsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
