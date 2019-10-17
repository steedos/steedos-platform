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
var AccountsTemplates = Package['steedos:useraccounts-core'].AccountsTemplates;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var FS = Package['steedos:cfs-base-package'].FS;
var HTML = Package.htmljs.HTML;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare, Steedos, obj, billingManager, Selector, ServerSession, AjaxCollection, SteedosDataManager, SteedosOffice;

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
  "sprintf-js": "^1.0.3",
  "url-search-params-polyfill": "^7.0.0"
}, 'steedos:base');

if (Meteor.settings && Meteor.settings.billing) {
  checkNpmVersions({
    "weixin-pay": "^1.1.7"
  }, 'steedos:base');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"meteor_fix.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/meteor_fix.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);

// Revert change from Meteor 1.6.1 who set ignoreUndefined: true
// more information https://github.com/meteor/meteor/pull/9444
if (Meteor.isServer) {
  let mongoOptions = {
    ignoreUndefined: false
  };
  const mongoOptionStr = process.env.MONGO_OPTIONS;

  if (typeof mongoOptionStr !== 'undefined') {
    const jsonMongoOptions = JSON.parse(mongoOptionStr);
    mongoOptions = Object.assign({}, mongoOptions, jsonMongoOptions);
  }

  Mongo.setConnectionOptions(mongoOptions);
}

Meteor.autorun = Tracker.autorun;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"steedos_util.js":function(){

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
  numberToString: function (number, locale) {
    if (typeof number === "number") {
      number = number.toString();
    }

    if (!number) {
      return '';
    }

    if (number !== "NaN") {
      if (!locale) {
        locale = Steedos.locale();
      }

      if (locale === "zh-cn" || locale === "zh-CN") {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
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
    var avatar, avatarUrl, background, ref, ref1, ref2, url;

    if (Meteor.loggingIn() || !Steedos.userId()) {
      accountBgBodyValue = {};
      accountBgBodyValue.url = localStorage.getItem("accountBgBodyValue.url");
      accountBgBodyValue.avatar = localStorage.getItem("accountBgBodyValue.avatar");
    }

    url = accountBgBodyValue.url;
    avatar = accountBgBodyValue.avatar;

    if (accountBgBodyValue.url) {
      if (url === avatar) {
        avatarUrl = 'api/files/avatars/' + avatar;
        $("body").css("backgroundImage", "url(" + (Meteor.isCordova ? avatarUrl : Meteor.absoluteUrl(avatarUrl)) + ")");
      } else {
        $("body").css("backgroundImage", "url(" + (Meteor.isCordova ? url : Meteor.absoluteUrl(url)) + ")");
      }
    } else {
      background = (ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? (ref2 = ref1.admin) != null ? ref2.background : void 0 : void 0 : void 0;

      if (background) {
        $("body").css("backgroundImage", "url(" + (Meteor.isCordova ? background : Meteor.absoluteUrl(background)) + ")");
      } else {
        background = "/packages/steedos_theme/client/background/sea.jpg";
        $("body").css("backgroundImage", "url(" + (Meteor.isCordova ? background : Meteor.absoluteUrl(background)) + ")");
      }
    }

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

  Steedos.redirectToSignIn = function (redirect) {
    var accountsUrl, ref, ref1, ref2, signInUrl;
    accountsUrl = (ref = Meteor.settings["public"]) != null ? (ref1 = ref.webservices) != null ? (ref2 = ref1.accounts) != null ? ref2.url : void 0 : void 0 : void 0;

    if (accountsUrl) {
      return window.location.href = accountsUrl + "/authorize?redirect_uri=/";
    } else {
      signInUrl = AccountsTemplates.getRoutePath("signIn");

      if (redirect) {
        if (signInUrl.indexOf("?") > 0) {
          signInUrl += "&redirect=" + redirect;
        } else {
          signInUrl += "?redirect=" + redirect;
        }
      }

      return FlowRouter.go(signInUrl);
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
    if (Session.get('current_app_id')) {
      return Session.get('current_app_id');
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
ServerSession = function () {
  'use strict';

  var Collection = new Mongo.Collection('server_sessions');

  var checkForKey = function (key) {
    if (typeof key === 'undefined') {
      throw new Error('Please provide a key!');
    }
  };

  var getSessionValue = function (obj, key) {
    return obj && obj.values && obj.values[key];
  };

  var condition = function () {
    return true;
  };

  Collection.deny({
    'insert': function () {
      return true;
    },
    'update': function () {
      return true;
    },
    'remove': function () {
      return true;
    }
  }); // public client and server api

  var api = {
    'get': function (key) {
      console.log(Collection.findOne());
      var sessionObj = Collection.findOne();

      if (Meteor.isServer) {
        Meteor.call('server-session/get');
      } // var sessionObj = Meteor.isServer ? 
      //   Meteor.call('server-session/get') : Collection.findOne();


      return getSessionValue(sessionObj, key);
    },
    'equals': function (key, expected, identical) {
      var sessionObj = Meteor.isServer ? Meteor.call('server-session/get') : Collection.findOne();
      var value = getSessionValue(sessionObj, key);

      if (_.isObject(value) && _.isObject(expected)) {
        return _(value).isEqual(expected);
      }

      if (identical == false) {
        return expected == value;
      }

      return expected === value;
    }
  };
  Meteor.startup(function () {
    if (Meteor.isClient) {
      Tracker.autorun(function () {
        if (Meteor.userId()) {
          Meteor.subscribe('server-session');
        }
      });
    }
  });

  if (Meteor.isServer) {
    // Meteor.startup(function () {
    //   if (Collection.findOne()) {
    //     Collection.remove({}); // clear out all stale sessions
    //   }
    // });
    Meteor.onConnection(function (connection) {
      var clientID = connection.id;

      if (!Collection.findOne({
        'clientID': clientID
      })) {
        Collection.insert({
          'clientID': clientID,
          'values': {},
          "created": new Date()
        });
      }

      connection.onClose(function () {
        Collection.remove({
          'clientID': clientID
        });
      });
    });
    Meteor.publish('server-session', function () {
      return Collection.find({
        'clientID': this.connection.id
      });
    });
    Meteor.methods({
      'server-session/get': function () {
        return Collection.findOne({
          'clientID': this.connection.id
        });
      },
      'server-session/set': function (key, value) {
        if (!this.randomSeed) return;
        checkForKey(key);
        if (!condition(key, value)) throw new Meteor.Error('Failed condition validation.');
        var updateObj = {};
        updateObj['values.' + key] = value;
        Collection.update({
          'clientID': this.connection.id
        }, {
          $set: updateObj
        });
      }
    }); // server-only api

    _.extend(api, {
      'set': function (key, value) {
        Meteor.call('server-session/set', key, value);
      },
      'setCondition': function (newCondition) {
        condition = newCondition;
      }
    });
  }

  return api;
}();
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
    allow_models = ['space_users', 'organizations', 'flow_roles'];

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
    allow_models = ['space_users', 'organizations', 'flow_roles', 'mail_accounts'];

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
      res.setHeader("Location", Steedos.absoluteUrl("api/files/avatars/" + user.avatar));
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

}},"routes":{"bootstrap.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/routes/bootstrap.coffee                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var steedosAuth;
steedosAuth = require("@steedos/auth");
JsonRoutes.add("get", "/api/bootstrap/:spaceId/", function (req, res, next) {
  var authToken, permissions, ref, result, space, spaceId, tryFetchPluginsInfo, userId, userSession;
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
  result.user = userSession;
  result.space = space;
  result.apps = _.extend(Creator.getDBApps(spaceId), Creator.Apps);
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

        _obj = Creator.convertObject(v.toConfig());
        _obj.name = k;
        _obj.database_name = name;
        _obj.permissions = permissions(v, userSession);
        return result.objects[_obj.name] = _obj;
      });
    }
  });

  _.each(Creator.steedosSchema.getDataSources(), function (datasource, name) {
    return result.apps = _.extend(result.apps, datasource.getAppsConfig());
  });

  tryFetchPluginsInfo = function (fun) {
    try {
      return fun();
    } catch (error) {}
  };

  result.plugins = {};
  tryFetchPluginsInfo(function () {
    var ref1;
    return result.plugins["@steedos/core"] = {
      version: (ref1 = require("@steedos/core/package.json")) != null ? ref1.version : void 0
    };
  });
  tryFetchPluginsInfo(function () {
    var ref1;
    return result.plugins["@steedos/objectql"] = {
      version: (ref1 = require("@steedos/objectql/package.json")) != null ? ref1.version : void 0
    };
  });
  tryFetchPluginsInfo(function () {
    var ref1;
    return result.plugins["@steedos/accounts"] = {
      version: (ref1 = require("@steedos/accounts/package.json")) != null ? ref1.version : void 0
    };
  });
  tryFetchPluginsInfo(function () {
    var ref1;
    return result.plugins["@steedos/steedos-plugin-workflow"] = {
      version: (ref1 = require("@steedos/steedos-plugin-workflow/package.json")) != null ? ref1.version : void 0
    };
  });
  return JsonRoutes.sendResult(res, {
    code: 200,
    data: result
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api_billing_recharge_notify.coffee":function(require){

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
      return console.log('Failed to bind environment');
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
    }, function () {
      return console.log('Failed to bind environment');
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
    var currentUser, isSpaceAdmin, lang, ref, space, spaceUser, userCP, user_id;

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
    Accounts.setPassword(user_id, password, {
      logout: true
    });

    if (userCP.mobile) {
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
        msg: TAPi18n.__('sms.change_password.template', {
          name: currentUser.name
        }, lang)
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
    }, function () {
      console.log('Failed to bind environment');
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
          "name_zh": "审批王标准版",
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

}}}}},"tabular.coffee":function(){

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
require("/node_modules/meteor/steedos:base/lib/meteor_fix.js");
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

/* Exports */
Package._define("steedos:base", {
  ServerSession: ServerSession,
  Selector: Selector,
  Steedos: Steedos,
  AjaxCollection: AjaxCollection,
  SteedosDataManager: SteedosDataManager,
  SteedosOffice: SteedosOffice,
  billingManager: billingManager
});

})();

//# sourceURL=meteor://💻app/packages/steedos_base.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiTW9uZ28iLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsImlnbm9yZVVuZGVmaW5lZCIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsInJlZyIsIlJlZ0V4cCIsInRlc3QiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzQ2xpZW50Iiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwiYXZhdGFyVXJsIiwiYmFja2dyb3VuZCIsInJlZjIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiJCIsImNzcyIsImlzQ29yZG92YSIsImFic29sdXRlVXJsIiwiYWRtaW4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImdldCIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsInJlZGlyZWN0VG9TaWduSW4iLCJyZWRpcmVjdCIsImFjY291bnRzVXJsIiwic2lnbkluVXJsIiwid2Vic2VydmljZXMiLCJhY2NvdW50cyIsImhyZWYiLCJBY2NvdW50c1RlbXBsYXRlcyIsImdldFJvdXRlUGF0aCIsIkZsb3dSb3V0ZXIiLCJnbyIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsImVycm9yMSIsImNvbnNvbGUiLCJtZXNzYWdlIiwic3RhY2siLCJzZXQiLCJjaGVja1NwYWNlQmFsYW5jZSIsInNwYWNlSWQiLCJlbmRfZGF0ZSIsIm1pbl9tb250aHMiLCJzcGFjZSIsImlzU3BhY2VBZG1pbiIsInNwYWNlcyIsImlzX3BhaWQiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsIm1hdGNoIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiYWRtaW5zIiwiaXNMZWdhbFZlcnNpb24iLCJhcHBfdmVyc2lvbiIsImNoZWNrIiwibW9kdWxlcyIsImlzT3JnQWRtaW5CeU9yZ0lkcyIsIm9yZ0lkcyIsImFsbG93QWNjZXNzT3JncyIsImlzT3JnQWRtaW4iLCJ1c2VPcmdzIiwiZmlsdGVyIiwib3JnIiwidW5pcSIsImlzT3JnQWRtaW5CeUFsbE9yZ0lkcyIsImkiLCJyb290X3VybCIsIlVSTCIsInBhdGhuYW1lIiwiZ2V0QVBJTG9naW5Vc2VyIiwicmVxIiwicmVzIiwicGFzc3dvcmQiLCJyZWYzIiwicmVzdWx0IiwidXNlcm5hbWUiLCJxdWVyeSIsInVzZXJzIiwic3RlZWRvc19pZCIsIl9jaGVja1Bhc3N3b3JkIiwiRXJyb3IiLCJjaGVja0F1dGhUb2tlbiIsImhlYWRlcnMiLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImRlY3J5cHQiLCJpdiIsImMiLCJkZWNpcGhlciIsImRlY2lwaGVyTXNnIiwia2V5MzIiLCJsZW4iLCJjcmVhdGVEZWNpcGhlcml2IiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJlbmNyeXB0IiwiY2lwaGVyIiwiY2lwaGVyZWRNc2ciLCJjcmVhdGVDaXBoZXJpdiIsImdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsImNvbGxlY3Rpb24iLCJvYmoiLCJzcGxpdCIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiZnVuYyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiTnVtYmVyIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlYXNvbiIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwiU2VydmVyU2Vzc2lvbiIsIkNvbGxlY3Rpb24iLCJjaGVja0ZvcktleSIsImdldFNlc3Npb25WYWx1ZSIsInZhbHVlcyIsImNvbmRpdGlvbiIsImRlbnkiLCJhcGkiLCJsb2ciLCJzZXNzaW9uT2JqIiwiZXhwZWN0ZWQiLCJpZGVudGljYWwiLCJpc09iamVjdCIsImlzRXF1YWwiLCJzdWJzY3JpYmUiLCJvbkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY2xpZW50SUQiLCJpZCIsImluc2VydCIsIm9uQ2xvc2UiLCJwdWJsaXNoIiwicmFuZG9tU2VlZCIsInVwZGF0ZU9iaiIsIm5ld0NvbmRpdGlvbiIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwic3RlZWRvc0F1dGgiLCJwZXJtaXNzaW9ucyIsInRyeUZldGNoUGx1Z2luc0luZm8iLCJ1c2VyU2Vzc2lvbiIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJBcHBzIiwib2JqZWN0X2xpc3R2aWV3cyIsIm9iamVjdF93b3JrZmxvd3MiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJkYXRhc291cmNlT2JqZWN0cyIsImdldE9iamVjdHMiLCJfb2JqIiwiY29udmVydE9iamVjdCIsInRvQ29uZmlnIiwiZGF0YWJhc2VfbmFtZSIsImdldEFwcHNDb25maWciLCJmdW4iLCJwbHVnaW5zIiwidmVyc2lvbiIsIm9uIiwiY2h1bmsiLCJiaW5kRW52aXJvbm1lbnQiLCJwYXJzZXIiLCJ4bWwyanMiLCJQYXJzZXIiLCJleHBsaWNpdEFycmF5IiwiZXhwbGljaXRSb290IiwicGFyc2VTdHJpbmciLCJlcnIiLCJXWFBheSIsImF0dGFjaCIsImJwciIsImNvZGVfdXJsX2lkIiwic2lnbiIsInd4cGF5IiwiYXBwaWQiLCJtY2hfaWQiLCJwYXJ0bmVyX2tleSIsImNsb25lIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwicyIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJQYWNrYWdlIiwic2VuZCIsInN0cmluZ2lmeSIsInRpbWVFbmQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImJpbGxpbmdfcmVjaGFyZ2UiLCJuZXdfaWQiLCJtb2R1bGVfbmFtZXMiLCJsaXN0cHJpY2VzIiwib25lX21vbnRoX3l1YW4iLCJvcmRlcl9ib2R5IiwicmVzdWx0X29iaiIsInNwYWNlX3VzZXJfY291bnQiLCJsaXN0cHJpY2Vfcm1iIiwibmFtZV96aCIsImNyZWF0ZVVuaWZpZWRPcmRlciIsImpvaW4iLCJvdXRfdHJhZGVfbm8iLCJtb21lbnQiLCJmb3JtYXQiLCJzcGJpbGxfY3JlYXRlX2lwIiwibm90aWZ5X3VybCIsInRyYWRlX3R5cGUiLCJwcm9kdWN0X2lkIiwiaW5mbyIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJzZXRTcGFjZVVzZXJQYXNzd29yZCIsInNwYWNlX3VzZXJfaWQiLCJjdXJyZW50VXNlciIsImxhbmciLCJ1c2VyQ1AiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIlNNU1F1ZXVlIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsInRvRml4ZWQiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInVwIiwidXBkYXRlX2Nmc19pbnN0YW5jZSIsInBhcmVudF9pZCIsImluc3RhbmNlX2lkIiwiYXR0YWNoX3ZlcnNpb24iLCJpc0N1cnJlbnQiLCJtZXRhZGF0YSIsInBhcmVudCIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJhdHRhY2htZW50cyIsImlucyIsImF0dGFjaHMiLCJjdXJyZW50X3ZlciIsIl9yZXYiLCJoaXN0b3J5cyIsImhpcyIsImRvd24iLCJvcmdhbml6YXRpb24iLCJjaGVja19jb3VudCIsIm5ld19vcmdfaWRzIiwicmVtb3ZlZF9vcmdfaWRzIiwicm9vdF9vcmciLCJ1cGRhdGVVc2VycyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEIsbUJBQWlCLFFBREQ7QUFFaEJJLFNBQU8sRUFBRSxRQUZPO0FBR2hCLFlBQVUsU0FITTtBQUloQkMsUUFBTSxFQUFFLFFBSlE7QUFLaEIsZ0JBQWMsUUFMRTtBQU1oQixnQ0FBOEI7QUFOZCxDQUFELEVBT2IsY0FQYSxDQUFoQjs7QUFTQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsT0FBdkMsRUFBZ0Q7QUFDL0NSLGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGNBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7OztBQ2hCRCxJQUFJUyxLQUFKO0FB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QUEsV0FBT2pHLE1BQVA7QUFDQyxlQUFPO0FBQUNzRixlQUFLLENBQUM7QUFBUCxTQUFQO0FDSUc7O0FESEpXLGNBQVFvUSxTQUFTcFEsS0FBakI7O0FBQ0EsV0FBT0EsS0FBUDtBQUNDLGFBQUFvUSxZQUFBLFFBQUFuWSxNQUFBbVksU0FBQTRhLElBQUEsWUFBQS95QixJQUFtQmpCLE1BQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLElBQTRCLENBQTVCO0FBQ0NnSixrQkFBUW9RLFNBQVM0YSxJQUFULENBQWMzMEIsV0FBZCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFSO0FBRkY7QUNRSTs7QURMSixXQUFPMkosS0FBUDtBQUNDLGVBQU87QUFBQ1gsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ1NHOztBRFJKLGFBQU8rUSxRQUFQO0FBekJEO0FBQUEsR0FERCxDQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcblx0Y2hlY2tOcG1WZXJzaW9uc1xufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcblx0Y29va2llczogXCJeMC42LjJcIixcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXG5cdG1rZGlycDogXCJeMC4zLjVcIixcblx0XCJzcHJpbnRmLWpzXCI6IFwiXjEuMC4zXCIsXG5cdFwidXJsLXNlYXJjaC1wYXJhbXMtcG9seWZpbGxcIjogXCJeNy4wLjBcIixcbn0sICdzdGVlZG9zOmJhc2UnKTtcblxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZykge1xuXHRjaGVja05wbVZlcnNpb25zKHtcblx0XHRcIndlaXhpbi1wYXlcIjogXCJeMS4xLjdcIlxuXHR9LCAnc3RlZWRvczpiYXNlJyk7XG59IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nICAgICAgIFxuXG4vLyBSZXZlcnQgY2hhbmdlIGZyb20gTWV0ZW9yIDEuNi4xIHdobyBzZXQgaWdub3JlVW5kZWZpbmVkOiB0cnVlXG4vLyBtb3JlIGluZm9ybWF0aW9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL3B1bGwvOTQ0NFxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuXG5cdGxldCBtb25nb09wdGlvbnMgPSB7XG5cdFx0aWdub3JlVW5kZWZpbmVkOiBmYWxzZSxcblx0fTtcblxuXHRjb25zdCBtb25nb09wdGlvblN0ciA9IHByb2Nlc3MuZW52Lk1PTkdPX09QVElPTlM7XG5cdGlmICh0eXBlb2YgbW9uZ29PcHRpb25TdHIgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0Y29uc3QganNvbk1vbmdvT3B0aW9ucyA9IEpTT04ucGFyc2UobW9uZ29PcHRpb25TdHIpO1xuXG5cdFx0bW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgbW9uZ29PcHRpb25zLCBqc29uTW9uZ29PcHRpb25zKTtcblx0fVxuXG5cdE1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zKG1vbmdvT3B0aW9ucyk7XG59XG5cblxuTWV0ZW9yLmF1dG9ydW4gPSBUcmFja2VyLmF1dG9ydW5cbiIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xuICAgIGlmICghdGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFsb2NhbGUpe1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXG4gICAgfVxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxuICAgICAgICB9ZWxzZXtcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcblx0XHR9XG4gICAgfSk7XG59O1xuXG5cbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XG4gICAgICAgIHYucHVzaChtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdjtcbn1cblxuLypcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXG4gKi9cbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICBpZiAoZnJvbSA8IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcbn07XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XG4gKi9cbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIGcgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGQpIHtcbiAgICAgICAgICAgIGcucHVzaCh0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBnO1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xuICAgIHZhciByID0gbnVsbDtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XG4gICAgICAgIHZhciBkID0gZmFsc2U7XG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgciA9IHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcjtcbn0iLCJTdGVlZG9zID1cblx0c2V0dGluZ3M6IHt9XG5cdGRiOiBkYlxuXHRzdWJzOiB7fVxuXHRpc1Bob25lRW5hYmxlZDogLT5cblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIGxvY2FsZSktPlxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcblxuXHRcdGlmICFudW1iZXJcblx0XHRcdHJldHVybiAnJztcblxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXG5cdFx0XHR1bmxlc3MgbG9jYWxlXG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcblx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxuXHRcdFx0XHQjIOS4reaWh+S4h+WIhuS9jei0ouWKoeS6uuWRmOeci+S4jeaDr++8jOaJgOS7peaUueS4uuWbvemZheS4gOagt+eahOWNg+WIhuS9jVxuXHRcdFx0XHRyZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIFwiXCJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXG5cdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKVxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXG5cbiMjI1xuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiMgQG5hbWVzcGFjZSBTdGVlZG9zXG4jIyNcblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XG5cdFx0c3dhbCh7dGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSwgaHRtbDogdHJ1ZSwgdHlwZTpcIndhcm5pbmdcIiwgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKX0pO1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5OlwiYmdfYm9keVwifSlcblx0XHRpZiBhY2NvdW50QmdCb2R5XG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gKGFjY291bnRCZ0JvZHlWYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlID0ge31cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXG5cdFx0aWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdFx0aWYgdXJsID09IGF2YXRhclxuXHRcdFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje2lmIE1ldGVvci5pc0NvcmRvdmEgdGhlbiBhdmF0YXJVcmwgZWxzZSBNZXRlb3IuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDov5nph4zkuI3lj6/ku6XnlKhTdGVlZG9zLmFic29sdXRlVXJs77yM5Zug5Li6YXBw5Lit6KaB5LuO5pys5Zyw5oqT5Y+W6LWE5rqQ5Y+v5Lul5Yqg5b+r6YCf5bqm5bm26IqC57qm5rWB6YePXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIHVybCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpfSlcIlxuXHRcdGVsc2Vcblx0XHRcdCMg6L+Z6YeM5LiN5Y+v5Lul55SoU3RlZWRvcy5hYnNvbHV0ZVVybO+8jOWboOS4umFwcOS4reimgeS7juacrOWcsOaKk+WPlui1hOa6kOWPr+S7peWKoOW/q+mAn+W6puW5tuiKgue6pua1gemHj1xuXHRcdFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxuXHRcdFx0aWYgYmFja2dyb3VuZFxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje2lmIE1ldGVvci5pc0NvcmRvdmEgdGhlbiBiYWNrZ3JvdW5kIGVsc2UgTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tpZiBNZXRlb3IuaXNDb3Jkb3ZhIHRoZW4gYmFja2dyb3VuZCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcblx0XHRpZiBhY2NvdW50U2tpblxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxuXHRcdGlmIGFjY291bnRab29tXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxuXHRcdHVubGVzcyB6b29tTmFtZVxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcblx0XHRcdHpvb21TaXplID0gMS4yXG5cdFx0aWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxuXHRcdFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcblx0XHRcdCMgZWxzZVxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cblx0XHRsaW5rZXIgPSBcIj9cIlxuXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdGxpbmtlciA9IFwiJlwiXG5cblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cblx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluID0gKHJlZGlyZWN0KS0+XHRcblx0XHRhY2NvdW50c1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5hY2NvdW50cz8udXJsXG5cdFx0aWYgYWNjb3VudHNVcmwgXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFjY291bnRzVXJsICsgXCIvYXV0aG9yaXplP3JlZGlyZWN0X3VyaT0vXCI7XG5cdFx0ZWxzZVxuXHRcdFx0c2lnbkluVXJsID0gQWNjb3VudHNUZW1wbGF0ZXMuZ2V0Um91dGVQYXRoKFwic2lnbkluXCIpXG5cdFx0XHRpZiByZWRpcmVjdFxuXHRcdFx0XHRpZiBzaWduSW5VcmwuaW5kZXhPZihcIj9cIikgPiAwXG5cdFx0XHRcdFx0c2lnbkluVXJsICs9IFwiJnJlZGlyZWN0PSN7cmVkaXJlY3R9XCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHNpZ25JblVybCArPSBcIj9yZWRpcmVjdD0je3JlZGlyZWN0fVwiXG5cdFx0XHRGbG93Um91dGVyLmdvIHNpZ25JblVybFxuXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cdFx0aWYgIWFwcFxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcblx0XHRcdHJldHVyblxuXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cdFx0IyBcdHJldHVyblxuXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcblx0XHRpZiBhcHAuaXNfdXNlX2llXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xuXHRcdFx0XHRpZiBvbl9jbGlja1xuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XG5cdFx0XHRcdFx0aWYgZXJyb3Jcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxuXHRcdFx0XHRcdHJldHVyblxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcblxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcblxuXHRcdGVsc2UgaWYgb25fY2xpY2tcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3Jcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcblx0XHRlbHNlXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cblx0XHR1bmxlc3Mgc3BhY2VJZFxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0bWluX21vbnRocyA9IDFcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRtaW5fbW9udGhzID0gM1xuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxuXHRcdGlmIHNwYWNlPy5pc19wYWlkIGFuZCBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xuXHRcdFx0dG9hc3RyLmVycm9yIHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKVxuXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XG5cdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xuXHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdHdoZW4gJ25vcm1hbCdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTEyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxuXHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC02XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAxOTlcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XG5cdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAzMDNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xuXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAwXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXG5cdFx0XHRcdCQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XG5cdFx0XHRcdGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldFxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxuXG5cdFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSAob2Zmc2V0KS0+XG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxuXHRcdGVsc2Vcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHQjIGlvc+WPiuaJi+acuuS4iuS4jemcgOimgeS4unpvb23mlL7lpKflip/og73pop3lpJborqHnrpdcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcblx0XHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcblx0XHRpZiBvZmZzZXRcblx0XHRcdHJlVmFsdWUgLT0gb2Zmc2V0XG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG5cblx0U3RlZWRvcy5pc2lPUyA9ICh1c2VyQWdlbnQsIGxhbmd1YWdlKS0+XG5cdFx0REVWSUNFID1cblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xuXHRcdFx0YmxhY2tiZXJyeTogJ2JsYWNrYmVycnknXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcblx0XHRcdGlwYWQ6ICdpcGFkJ1xuXHRcdFx0aXBob25lOiAnaXBob25lJ1xuXHRcdFx0aXBvZDogJ2lwb2QnXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXG5cdFx0YnJvd3NlciA9IHt9XG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXG5cdFx0dXNlckFnZW50ID0gKHVzZXJBZ2VudCBvciBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXG5cdFx0XHQnJ1xuXHRcdFx0REVWSUNFLmRlc2t0b3Bcblx0XHRdXG5cdFx0YnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV1cblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxuXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdHJldHVyblxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgaWZyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXG5cdFx0XHRcdGlmciA9IHRhcmdldC4kKGlmcilcblx0XHRcdGlmci5sb2FkIC0+XG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jylcblx0XHRcdFx0aWYgaWZyQm9keVxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoc3BhY2VJZCx1c2VySWQsaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHQjVE9ETyDmt7vliqDmnI3liqHnq6/mmK/lkKbmiYvmnLrnmoTliKTmlq0o5L6d5o2ucmVxdWVzdClcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcblxuXHRTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gKHNwYWNlSWQsYXBwX3ZlcnNpb24pLT5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0Y2hlY2sgPSBmYWxzZVxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXG5cdFx0XHRjaGVjayA9IHRydWVcblx0XHRyZXR1cm4gY2hlY2tcblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuaciee7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquimgeaVsOe7hG9yZ0lkc+S4reS7u+S9leS4gOS4que7hOe7h+acieadg+mZkOWwsei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxuXHRcdHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjpvcmdJZHN9fSx7ZmllbGRzOntwYXJlbnRzOjEsYWRtaW5zOjF9fSkuZmV0Y2goKVxuXHRcdHBhcmVudHMgPSBbXVxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XG5cdFx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxuXHRcdGlmIGFsbG93QWNjZXNzT3Jncy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBwYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcblx0XHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHR1bmxlc3Mgb3JnSWRzLmxlbmd0aFxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRpID0gMFxuXHRcdHdoaWxlIGkgPCBvcmdJZHMubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cblx0XHRcdFx0YnJlYWtcblx0XHRcdGkrK1xuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXG5cdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcblx0XHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xuXHRTdGVlZG9zLmdldEFQSUxvZ2luVXNlclx0PSAocmVxLCByZXMpIC0+XG5cblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcblxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxuXG5cdFx0aWYgdXNlcm5hbWUgJiYgcGFzc3dvcmRcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXG5cblx0XHRcdGlmICF1c2VyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBwYXNzd29yZFxuXG5cdFx0XHRpZiByZXN1bHQuZXJyb3Jcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcilcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHVzZXJcblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRyZXR1cm4gZmFsc2VcblxuXHQjXHTmo4Dmn6V1c2VySWTjgIFhdXRoVG9rZW7mmK/lkKbmnInmlYhcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0aWYgdXNlclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdHRyeVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0ZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblx0XHRjYXRjaCBlXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0a2V5MzIgPSBcIlwiXG5cdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRjID0gXCJcIlxuXHRcdFx0aSA9IDBcblx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRpKytcblx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxuXG5cdFx0aWYgIWFjY2Vzc190b2tlblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pXG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXG5cblx0XHRpZiB1c2VyXG5cdFx0XHRyZXR1cm4gdXNlcklkXG5cdFx0ZWxzZVxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cblxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxuXHRcdFx0aWYgb2JqXG5cdFx0XHRcdCMg5Yik5patdG9rZW7nmoTmnInmlYjmnJ9cblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBub3QgZm91bmQuXCJcblx0XHRyZXR1cm4gbnVsbFxuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXG5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRjYXRjaCBlXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IGUubWVzc2FnZSxcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xuIyBleGNlcHQgZm9yIGluY2x1ZGUsIGNvbnRhaW5zLCByZXZlcnNlIGFuZCBqb2luIHRoYXQgYXJlXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxuXG5taXhpbiA9IChvYmopIC0+XG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cblx0XHRpZiBub3QgX1tuYW1lXSBhbmQgbm90IF8ucHJvdG90eXBlW25hbWVdP1xuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cblx0XHRcdFx0YXJncyA9IFt0aGlzLl93cmFwcGVkXVxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXG5cbiNtaXhpbihfcy5leHBvcnRzKCkpXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6Vcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxuXHRcdGlmICFkYXRlXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0ZGF5ID0gZGF0ZS5nZXREYXkoKVxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRyZXR1cm4gZmFsc2Vcblx0IyDmoLnmja7kvKDlhaXml7bpl7QoZGF0ZSnorqHnrpflh6DkuKrlt6XkvZzml6UoZGF5cynlkI7nmoTml7bpl7QsZGF5c+ebruWJjeWPquiDveaYr+aVtOaVsFxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRjaGVjayBkYXlzLCBOdW1iZXJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XG5cdFx0XHRpZiBpIDwgZGF5c1xuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXG5cdFx0XHRyZXR1cm5cblx0XHRjYWN1bGF0ZURhdGUoMCwgZGF5cylcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxuXG5cdCMg6K6h566X5Y2K5Liq5bel5L2c5pel5ZCO55qE5pe26Ze0XG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXG5cdFx0XHRjb25zb2xlLmVycm9yIFwidGltZV9wb2ludHMgaXMgbnVsbFwiXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXG5cblx0XHRsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGhcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdHN0YXJ0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbMF0uaG91clxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXG5cdFx0ZW5kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGVcblxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXG5cdFx0aiA9IDBcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXG5cdFx0aWYgZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IDBcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xuXHRcdFx0XHRqID0gbGVuLzJcblx0XHRlbHNlIGlmIGRhdGUgPj0gc3RhcnRfZGF0ZSBhbmQgZGF0ZSA8IGVuZF9kYXRlXG5cdFx0XHRpID0gMFxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxuXHRcdFx0XHRmaXJzdF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpXS5taW51dGVcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXG5cblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcblx0XHRcdFx0XHRicmVha1xuXG5cdFx0XHRcdGkrK1xuXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gaSArIGxlbi8yXG5cblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIGxlbi8yXG5cblx0XHRpZiBqID4gbWF4X2luZGV4XG5cdFx0XHQjIOmalOWkqemcgOWIpOaWreiKguWBh+aXpVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZVxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbal0ubWludXRlXG5cblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXG5cdFx0Z2V0U3RlZWRvc1Rva2VuOiAoYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxuXHRcdFx0aWYgYXBwXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblxuXHRcdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0XHRcdGkgPSAwXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRcdFx0aSsrXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXG5cblx0XHRsb2NhbGU6ICh1c2VySWQsIGlzSTE4biktPlxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxuXHRcdFx0aWYgaXNJMThuXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0cmV0dXJuIGxvY2FsZVxuXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXG5cblxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cblx0XHRcdHJlYXNvbiA9IHQgXCJwYXNzd29yZF9pbnZhbGlkXCJcblx0XHRcdHZhbGlkID0gdHJ1ZVxuXHRcdFx0dW5sZXNzIHB3ZFxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cblx0XHRcdHBhc3N3b3JQb2xpY3kgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5XG5cdFx0XHRwYXNzd29yUG9saWN5RXJyb3IgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5RXJyb3Jcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcblx0XHRcdFx0aWYgIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJylcblx0XHRcdFx0XHRyZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3Jcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR2YWxpZCA9IHRydWVcbiNcdFx0XHRlbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1xcZCsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdGlmIHB3ZC5sZW5ndGggPCA4XG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdGlmIHZhbGlkXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBlcnJvcjpcblx0XHRcdFx0XHRyZWFzb246IHJlYXNvblxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIilcblxuQ3JlYXRvci5nZXREQkFwcHMgPSAoc3BhY2VfaWQpLT5cblx0ZGJBcHBzID0ge31cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZvckVhY2ggKGFwcCktPlxuXHRcdGRiQXBwc1thcHAuX2lkXSA9IGFwcFxuXG5cdHJldHVybiBkYkFwcHNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHRTdGVlZG9zLmdldEF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcylcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRpZiAhYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09ICdCZWFyZXInXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cblx0XHRyZXR1cm4gYXV0aFRva2VuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpXG4jXHRcdGVsc2VcbiNcdFx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGN1cnJlbnRfYXBwX2lkLi4uJyk7XG4jXHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudF9hcHBfaWQnKVxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbjsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIGxvY2FsZSkge1xuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSBcIm51bWJlclwiKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG51bWJlciAhPT0gXCJOYU5cIikge1xuICAgICAgaWYgKCFsb2NhbGUpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIiB8fCBsb2NhbGUgPT09IFwiemgtQ05cIikge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdmFsaUpxdWVyeVN5bWJvbHM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZWc7XG4gICAgcmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKTtcbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCBhdmF0YXJVcmwsIGJhY2tncm91bmQsIHJlZiwgcmVmMSwgcmVmMiwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoYWNjb3VudEJnQm9keVZhbHVlLnVybCkge1xuICAgICAgaWYgKHVybCA9PT0gYXZhdGFyKSB7XG4gICAgICAgIGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGF2YXRhclVybCA6IE1ldGVvci5hYnNvbHV0ZVVybChhdmF0YXJVcmwpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChNZXRlb3IuaXNDb3Jkb3ZhID8gdXJsIDogTWV0ZW9yLmFic29sdXRlVXJsKHVybCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZ3JvdW5kID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFkbWluKSAhPSBudWxsID8gcmVmMi5iYWNrZ3JvdW5kIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJhY2tncm91bmQpIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyBiYWNrZ3JvdW5kIDogTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyBiYWNrZ3JvdW5kIDogTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciB6b29tTmFtZSwgem9vbVNpemU7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICB9XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuICAgIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lO1xuICAgIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplO1xuICAgIGlmICghem9vbU5hbWUpIHtcbiAgICAgIHpvb21OYW1lID0gXCJsYXJnZVwiO1xuICAgICAgem9vbVNpemUgPSAxLjI7XG4gICAgfVxuICAgIGlmICh6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpKSB7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tXCIgKyB6b29tTmFtZSk7XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLCBhY2NvdW50Wm9vbVZhbHVlLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLCBhY2NvdW50Wm9vbVZhbHVlLnNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbiA9IGZ1bmN0aW9uKHJlZGlyZWN0KSB7XG4gICAgdmFyIGFjY291bnRzVXJsLCByZWYsIHJlZjEsIHJlZjIsIHNpZ25JblVybDtcbiAgICBhY2NvdW50c1VybCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMSA9IHJlZi53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hY2NvdW50cykgIT0gbnVsbCA/IHJlZjIudXJsIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmIChhY2NvdW50c1VybCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYWNjb3VudHNVcmwgKyBcIi9hdXRob3JpemU/cmVkaXJlY3RfdXJpPS9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2lnbkluVXJsID0gQWNjb3VudHNUZW1wbGF0ZXMuZ2V0Um91dGVQYXRoKFwic2lnbkluXCIpO1xuICAgICAgaWYgKHJlZGlyZWN0KSB7XG4gICAgICAgIGlmIChzaWduSW5VcmwuaW5kZXhPZihcIj9cIikgPiAwKSB7XG4gICAgICAgICAgc2lnbkluVXJsICs9IFwiJnJlZGlyZWN0PVwiICsgcmVkaXJlY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2lnbkluVXJsICs9IFwiP3JlZGlyZWN0PVwiICsgcmVkaXJlY3Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBGbG93Um91dGVyLmdvKHNpZ25JblVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNoZWNrID0gZmFsc2U7XG4gICAgbW9kdWxlcyA9IChyZWYgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgICBwYXJlbnRzID0gXy51bmlvbihwYXJlbnRzLCBvcmcucGFyZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHJlZiA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZXN1bHQsIHVzZXIsIHVzZXJJZCwgdXNlcm5hbWU7XG4gICAgdXNlcm5hbWUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmMiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjJbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjMgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYzW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHVzZXJJZDtcbiAgICB1c2VySWQgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMVtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMiA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYyLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWYsIHNlY29uZF9kYXRlLCBzdGFydF9kYXRlLCB0aW1lX3BvaW50cztcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICB0aW1lX3BvaW50cyA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmLnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciBwYXNzd29yUG9saWN5LCBwYXNzd29yUG9saWN5RXJyb3IsIHJlYXNvbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB2YWxpZDtcbiAgICAgIHJlYXNvbiA9IHQoXCJwYXNzd29yZF9pbnZhbGlkXCIpO1xuICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgaWYgKCFwd2QpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhc3N3b3JQb2xpY3kgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9IChyZWYyID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfVxuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgTWV0ZW9yLm1ldGhvZHNcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVzaDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRzZXQ6IFxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIF1cblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcbiAgICAgICAgcCA9IG51bGxcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgICAgcCA9IGVcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxuICAgICAgICAgICRwdWxsOiBcbiAgICAgICAgICAgIGVtYWlsczogXG4gICAgICAgICAgICAgIHBcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cblxuICAgICAgcmV0dXJuIHt9XG5cbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XG4gICAgICBcblxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cbiAgICAgIGlmIG5vdCBAdXNlcklkP1xuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XG4gICAgICBpZiBub3QgZW1haWxcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXG5cbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxuICAgICAgICAkc2V0OlxuICAgICAgICAgIGVtYWlsczogZW1haWxzXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG5cbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgcmV0dXJuIHt9XG5cblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cbiAgICAgICAgc3dhbFxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXG4jIyNcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XG5cdGZyb206IChmdW5jdGlvbigpe1xuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcblx0XHRcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XG5cdH0pKCksXG5cdHJlc2V0UGFzc3dvcmQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fSxcblx0dmVyaWZ5RW1haWw6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdGVucm9sbEFjY291bnQ6IHtcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcblx0XHR9LFxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9XG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XG4gIFxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XG5cdGlmIChvcmdzLmNvdW50KCk+MClcblx0e1xuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcblx0XHR7XG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xuXHRcdFx0XG5cdFx0fSk7XG5cdH1cdFxuXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIFx0ZGF0YToge1xuXHQgICAgICBcdHJldDogMCxcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcbiAgICBcdH1cbiAgXHR9KTtcbn0pO1xuXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdGlmIE1ldGVvci5pc1NlcnZlclxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XG5cdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHVubGVzcyB1c2VySWRcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuXHRcdGlmIHNwYWNlSWRcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0aWYgIXVzZXJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRzZWxlY3RvciA9IHt9XG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxuXHRcdHNwYWNlcyA9IFtdXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cblx0XHRyZXR1cm4gc2VsZWN0b3JcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XG5cdGljb246IFwiZ2xvYmVcIlxuXHRjb2xvcjogXCJibHVlXCJcblx0dGFibGVDb2x1bW5zOiBbXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cblx0XVxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHRcdHJldHVybiB7fVxuXHRzaG93RWRpdENvbHVtbjogZmFsc2Vcblx0c2hvd0RlbENvbHVtbjogZmFsc2Vcblx0ZGlzYWJsZUFkZDogdHJ1ZVxuXHRwYWdlTGVuZ3RoOiAxMDBcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xuICAgIHZhciBrO1xuICAgIGlmIChuID49IDApIHtcbiAgICAgIGsgPSBuO1xuICAgIH0gZWxzZSB7XG4gICAgICBrID0gbGVuICsgbjtcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cbiAgICB9XG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xuICAgIHdoaWxlIChrIDwgbGVuKSB7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBrKys7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XG4gICAgICB3d3c6IFxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxuXHRsaXN0Vmlld3MgPSB7fVxuXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcblxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mZXRjaCgpXG5cblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcblxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xuXHRyZXR1cm4gbGlzdFZpZXdzXG5cblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuXHRcdHNwYWNlOiBzcGFjZUlkLFxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxuXHR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pXG5cblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XG5cblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXG5cblxuXG5cbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCJTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xuXG4gIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XG4gICAgfVxuICB9O1xuICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XG4gICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcbiAgfTtcbiAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBDb2xsZWN0aW9uLmRlbnkoe1xuICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcblxuICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXG4gIHZhciBhcGkgPSB7XG4gICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcbiAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XG4gICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XG4gICAgICB9XG4gICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcbiAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcbiAgICB9LFxuICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XG4gICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcblxuICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG5cbiAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xuICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xuICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG4gICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcbiAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXG4gICAgLy8gICB9XG4gICAgLy8gfSk7XG5cbiAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XG4gICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xuXG4gICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XG4gICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XG4gICAgICB9XG5cbiAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XG4gICAgfSk7XG5cbiAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuICAgICAgfSxcbiAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XG5cbiAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xuXG4gICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcbiAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcblxuICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcbiAgICAgIH1cbiAgICB9KTsgIFxuXG4gICAgLy8gc2VydmVyLW9ubHkgYXBpXG4gICAgXy5leHRlbmQoYXBpLCB7XG4gICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcbiAgICAgIH0sXG4gICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xuICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gYXBpO1xufSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcblxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcblxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcblx0XHRcblx0XHRpZiAhdXNlclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0cmV0dXJuO1xuXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXG5cblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcblxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXG5cblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXG5cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogMjAwXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxuXHRcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgICMgVE9ETyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXG4gICAgICAgICMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XG4gICAgICAgIGlmIHJlcS5ib2R5XG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxuICAgICAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cblxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXG4gICAgICAgIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIiwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgICAgIGRhdGEgPSBbXTtcbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcbiAgICAgICAgXG4gICAgICAgIGlmICFzcGFjZV91c2VyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKTtcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XG4gICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBbXTtcblxuXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XG4gICAgdHJ5XG4gICAgICAgICMgVE9ETyDnlKjmiLfnmbvlvZXpqozor4FcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXG4gICAgICAgICMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XG4gICAgICAgIGlmIHJlcS5ib2R5XG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxuICAgICAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cblxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXG4gICAgICAgIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIiwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgICAgIGRhdGEgPSBbXTtcbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cyddXG5cbiAgICAgICAgaWYgIXNwYWNlXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICMgVE9ETyDnlKjmiLfmmK/lkKblsZ7kuo5zcGFjZVxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxuICAgICAgICBcbiAgICAgICAgaWYgIXNwYWNlX3VzZXJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgIWRiW21vZGVsXVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAhc2VsZWN0b3JcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG5cbiAgICAgICAgaWYgIW9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuICAgICAgICBcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YToge30iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXG5cdGlmIGFwcFxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcblx0ZWxzZVxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXG5cblx0aWYgIXJlZGlyZWN0VXJsXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRyZXMuZW5kKClcblx0XHRyZXR1cm5cblxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XG5cblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcblx0IyBpZiByZXEuYm9keVxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0IyAjIHRoZW4gY2hlY2sgY29va2llXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0aWYgdXNlclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdGVsc2Vcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHQjIGRlcy1jYmNcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxuXHRcdFx0a2V5OCA9IFwiXCJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCA4XG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSA4IC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0am9pbmVyID0gXCI/XCJcblxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxuXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cblxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRyZXMud3JpdGVIZWFkIDQwMVxuXHRyZXMuZW5kKClcblx0cmV0dXJuXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHRcdCMgdGhpcy5wYXJhbXMgPVxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxuXHRcdHdpZHRoID0gNTAgO1xuXHRcdGhlaWdodCA9IDUwIDtcblx0XHRmb250U2l6ZSA9IDI4IDtcblx0XHRpZiByZXEucXVlcnkud1xuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcblx0XHRpZiByZXEucXVlcnkuaFxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG5cdFx0aWYgIXVzZXJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cblx0XHRcdFx0PC9zdHlsZT5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHQ8Zz5cblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxuXHRcdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9nPlxuXHRcdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9jbGllbnQvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZ1wiKVxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XG5cdFx0aWYgIXVzZXJuYW1lXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xuXG5cdFx0aWYgbm90IGZpbGU/XG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXG5cdFx0XHRjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXG5cblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcblx0XHRcdGNvbG9yX2luZGV4ID0gMFxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXG5cdFx0XHQjY29sb3IgPSBcIiNENkRBRENcIlxuXG5cdFx0XHRpbml0aWFscyA9ICcnXG5cdFx0XHRpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxuXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcblxuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cblx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiI3t3aWR0aH1cIiBoZWlnaHQ9XCIje2hlaWdodH1cIiBzdHlsZT1cIndpZHRoOiAje3dpZHRofXB4OyBoZWlnaHQ6ICN7aGVpZ2h0fXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yfTtcIj5cblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cblx0XHRcdFx0XHQje2luaXRpYWxzfVxuXHRcdFx0XHQ8L3RleHQ+XG5cdFx0XHQ8L3N2Zz5cblx0XHRcdFwiXCJcIlxuXG5cdFx0XHRyZXMud3JpdGUgc3ZnXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuXHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcblx0XHRcdFx0cmVzLndyaXRlSGVhZCAzMDRcblx0XHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRcdHJldHVyblxuXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aFxuXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXG5cdFx0cmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNvbG9yLCBjb2xvcl9pbmRleCwgY29sb3JzLCBmb250U2l6ZSwgaGVpZ2h0LCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVxTW9kaWZpZWRIZWFkZXIsIHN2ZywgdXNlciwgdXNlcm5hbWUsIHVzZXJuYW1lX2FycmF5LCB3aWR0aDtcbiAgICB3aWR0aCA9IDUwO1xuICAgIGhlaWdodCA9IDUwO1xuICAgIGZvbnRTaXplID0gMjg7XG4gICAgaWYgKHJlcS5xdWVyeS53KSB7XG4gICAgICB3aWR0aCA9IHJlcS5xdWVyeS53O1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmgpIHtcbiAgICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oO1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmZzKSB7XG4gICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcztcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXIpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHVzZXIucHJvZmlsZSkgIT0gbnVsbCA/IHJlZi5hdmF0YXIgOiB2b2lkIDApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyVXJsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgc3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgaWQ9XFxcIkxheWVyXzFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHg9XFxcIjBweFxcXCIgeT1cXFwiMHB4XFxcIlxcblx0IHZpZXdCb3g9XFxcIjAgMCA3MiA3MlxcXCIgc3R5bGU9XFxcImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XFxcIiB4bWw6c3BhY2U9XFxcInByZXNlcnZlXFxcIj5cXG48c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0LnN0MHtmaWxsOiNGRkZGRkY7fVxcblx0LnN0MXtmaWxsOiNEMEQwRDA7fVxcbjwvc3R5bGU+XFxuPGc+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QwXFxcIiBkPVxcXCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelxcXCIvPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxcblx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XFxcIi8+XFxuPC9nPlxcbjxnPlxcblx0PGc+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXFxuXHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elxcXCIvPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XFxuXHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcXFwiLz5cXG5cdDwvZz5cXG48L2c+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSk7XG4gICAgICBjb2xvcl9pbmRleCA9IDA7XG4gICAgICBfLmVhY2godXNlcm5hbWVfYXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcbiAgICAgIH0pO1xuICAgICAgcG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGg7XG4gICAgICBjb2xvciA9IGNvbG9yc1twb3NpdGlvbl07XG4gICAgICBpbml0aWFscyA9ICcnO1xuICAgICAgaWYgKHVzZXJuYW1lLmNoYXJDb2RlQXQoMCkgPiAyNTUpIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKTtcbiAgICAgIHN2ZyA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiIHN0YW5kYWxvbmU9XFxcIm5vXFxcIj8+XFxuPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJub25lXFxcIiB3aWR0aD1cXFwiXCIgKyB3aWR0aCArIFwiXFxcIiBoZWlnaHQ9XFxcIlwiICsgaGVpZ2h0ICsgXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgKyBoZWlnaHQgKyBcInB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGNvbG9yICsgXCI7XFxcIj5cXG5cdDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZm9udC1mYW1pbHk9XFxcIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcInB4O1xcXCI+XFxuXHRcdFwiICsgaW5pdGlhbHMgKyBcIlxcblx0PC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZjEgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMS50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYyID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjIudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXG5cdFx0YWNjZXNzX3Rva2VuID0gcmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cblxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcblx0XHRcdHJlcy53cml0ZUhlYWQgMjAwXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXHRcdGVsc2Vcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0XHRyZXMuZW5kKClcblx0XHRcdHJldHVyblxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ2FwcHMnLCAoc3BhY2VJZCktPlxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcbiAgICAgICAgXG5cbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XG4gICAgICAgIGlmIHNwYWNlSWRcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge3NvcnQ6IHtzb3J0OiAxfX0pO1xuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcblxuXHQjIHB1Ymxpc2ggdXNlcnMgc3BhY2VzXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXG5cdFx0c2VsZiA9IHRoaXM7XG5cdFx0dXNlclNwYWNlcyA9IFtdXG5cdFx0c3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9LCB7ZmllbGRzOiB7c3BhY2U6MX19KVxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcblxuXHRcdGhhbmRsZTIgPSBudWxsXG5cblx0XHQjIG9ubHkgcmV0dXJuIHVzZXIgam9pbmVkIHNwYWNlcywgYW5kIG9ic2VydmVzIHdoZW4gdXNlciBqb2luIG9yIGxlYXZlIGEgc3BhY2Vcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRpZiBkb2Muc3BhY2Vcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXG5cdFx0XHRcdFx0XHRvYnNlcnZlU3BhY2VzKClcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcblxuXHRcdG9ic2VydmVTcGFjZXMgPSAtPlxuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcblx0XHRcdGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiB7JGluOiB1c2VyU3BhY2VzfX0pLm9ic2VydmVcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XG5cdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5faWQpXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xuXHRcdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xuXG5cdFx0c2VsZi5yZWFkeSgpO1xuXG5cdFx0c2VsZi5vblN0b3AgLT5cblx0XHRcdGhhbmRsZS5zdG9wKCk7XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ215X3NwYWNlcycsIGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlLCBoYW5kbGUyLCBvYnNlcnZlU3BhY2VzLCBzZWxmLCBzdXMsIHVzZXJTcGFjZXM7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICB1c2VyU3BhY2VzID0gW107XG4gIHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xuICBzdXMuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpO1xuICB9KTtcbiAgaGFuZGxlMiA9IG51bGw7XG4gIGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgaWYgKGRvYy5zcGFjZSkge1xuICAgICAgICBpZiAodXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwKSB7XG4gICAgICAgICAgdXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSk7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmVTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICBpZiAob2xkRG9jLnNwYWNlKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2Muc3BhY2UpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVTcGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdXNlclNwYWNlc1xuICAgICAgfVxuICAgIH0pLm9ic2VydmUoe1xuICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgICBzZWxmLmFkZGVkKFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goZG9jLl9pZCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2hhbmdlZChcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2MpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLl9pZCk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBvYnNlcnZlU3BhY2VzKCk7XG4gIHNlbGYucmVhZHkoKTtcbiAgcmV0dXJuIHNlbGYub25TdG9wKGZ1bmN0aW9uKCkge1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIHJldHVybiBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIjIHB1Ymxpc2ggc29tZSBvbmUgc3BhY2UncyBhdmF0YXJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxuXHR1bmxlc3Mgc3BhY2VJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcbiIsIk1ldGVvci5wdWJsaXNoKCdzcGFjZV9hdmF0YXInLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLnNwYWNlcy5maW5kKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgYXZhdGFyOiAxLFxuICAgICAgbmFtZTogMSxcbiAgICAgIGVuYWJsZV9yZWdpc3RlcjogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdtb2R1bGVzJywgKCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHVubGVzcyBfaWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwic3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwocmVxLCByZXMsIG5leHQpLT5cblx0dXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddXG5cdHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5wYXJhbXM/LnNwYWNlSWRcblx0aWYgIXVzZXJJZFxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRjb2RlOiA0MDMsXG5cdFx0XHRkYXRhOiBudWxsXG5cdFx0cmV0dXJuXG5cblx0YXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpXG5cdHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYiktPlxuXHRcdFx0c3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXG5cdFx0KShhdXRoVG9rZW4sIHNwYWNlSWQpXG5cdFxuXHR1bmxlc3MgdXNlclNlc3Npb25cblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogNTAwLFxuXHRcdFx0ZGF0YTogbnVsbFxuXHRcdHJldHVyblxuXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7bmFtZTogMX19KVxuXG5cdHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKVxuXHRyZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uXG5cdHJlc3VsdC5zcGFjZSA9IHNwYWNlXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQgQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCksIENyZWF0b3IuQXBwc1xuXHRyZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cylcblx0cmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCAnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWRcblxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxuXHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XG5cdFx0aWYgbmFtZSAhPSAnZGVmYXVsdCdcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcblx0XHRcdF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgKHYsIGspLT5cblx0XHRcdFx0X29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdCh2LnRvQ29uZmlnKCkpXG4jXHRcdFx0XHRfb2JqLm5hbWUgPSBcIiN7bmFtZX0uI3trfVwiXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcblx0XHRcdFx0X29iai5kYXRhYmFzZV9uYW1lID0gbmFtZVxuXHRcdFx0XHRfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXG5cdFx0XHQpXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKClcblxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvID0gKGZ1biktPlxuXHRcdHRyeVxuXHRcdFx0IyDlm6DkuLpyZXF1aXJl5Ye95pWw5Lit5Y+C5pWw55So5Y+Y6YeP5Lyg5YWl55qE6K+d77yM5Y+v6IO95Lya6YCg5oiQ55u05o6l5oql6ZSZXG5cdFx0XHQjIOWFt+S9k2BuYW1lID0gXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIixpbmZvID0gcmVxdWlyZShuYW1lKWDkvJrmiqXplJnvvIzlj6rog73nlKhgaW5mbyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIilgXG5cdFx0XHQjIOS9huaYr2BuYW1lID0gXCJAc3RlZWRvcy9jb3JlL3BhY2thZ2UuanNvblwiLGluZm8gPSByZXF1aXJlKG5hbWUpYOWNtOS4jeS8muaKpemUmVxuXHRcdFx0IyDmiYDku6Xov5nph4zmiormlbTkuKpmdW7kvKDlhaXmiafooYxcblx0XHRcdGZ1bigpXG5cdFx0Y2F0Y2hcblxuXHRyZXN1bHQucGx1Z2lucyA9IHt9XG5cdHRyeUZldGNoUGx1Z2luc0luZm8gLT5cblx0XHRyZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL2NvcmVcIl0gPSB2ZXJzaW9uOiByZXF1aXJlKFwiQHN0ZWVkb3MvY29yZS9wYWNrYWdlLmpzb25cIik/LnZlcnNpb25cblx0dHJ5RmV0Y2hQbHVnaW5zSW5mbyAtPlxuXHRcdHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3Mvb2JqZWN0cWxcIl0gPSB2ZXJzaW9uOiByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWwvcGFja2FnZS5qc29uXCIpPy52ZXJzaW9uXG5cdHRyeUZldGNoUGx1Z2luc0luZm8gLT5cblx0XHRyZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL2FjY291bnRzXCJdID0gdmVyc2lvbjogcmVxdWlyZShcIkBzdGVlZG9zL2FjY291bnRzL3BhY2thZ2UuanNvblwiKT8udmVyc2lvblxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvIC0+XG5cdFx0cmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi13b3JrZmxvd1wiXSA9IHZlcnNpb246IHJlcXVpcmUoXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi13b3JrZmxvdy9wYWNrYWdlLmpzb25cIik/LnZlcnNpb25cblxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdGNvZGU6IDIwMCxcblx0XHRkYXRhOiByZXN1bHRcbiIsInZhciBzdGVlZG9zQXV0aDtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgcGVybWlzc2lvbnMsIHJlZiwgcmVzdWx0LCBzcGFjZSwgc3BhY2VJZCwgdHJ5RmV0Y2hQbHVnaW5zSW5mbywgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddO1xuICBzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gIGlmICghdXNlcklkKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNDAzLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gIGlmICghdXNlclNlc3Npb24pIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA1MDAsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcbiAgcmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvbjtcbiAgcmVzdWx0LnNwYWNlID0gc3BhY2U7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQoQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCksIENyZWF0b3IuQXBwcyk7XG4gIHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCgnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWQpO1xuICBwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24odiwgdXNlclNlc3Npb24sIGNiKSB7XG4gICAgcmV0dXJuIHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHZhciBkYXRhc291cmNlT2JqZWN0cztcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpO1xuICAgICAgcmV0dXJuIF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICB2YXIgX29iajtcbiAgICAgICAgX29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdCh2LnRvQ29uZmlnKCkpO1xuICAgICAgICBfb2JqLm5hbWUgPSBrO1xuICAgICAgICBfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lO1xuICAgICAgICBfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0Lm9iamVjdHNbX29iai5uYW1lXSA9IF9vYmo7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICByZXR1cm4gcmVzdWx0LmFwcHMgPSBfLmV4dGVuZChyZXN1bHQuYXBwcywgZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpO1xuICB9KTtcbiAgdHJ5RmV0Y2hQbHVnaW5zSW5mbyA9IGZ1bmN0aW9uKGZ1bikge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnVuKCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIH1cbiAgfTtcbiAgcmVzdWx0LnBsdWdpbnMgPSB7fTtcbiAgdHJ5RmV0Y2hQbHVnaW5zSW5mbyhmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmMTtcbiAgICByZXR1cm4gcmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9jb3JlXCJdID0ge1xuICAgICAgdmVyc2lvbjogKHJlZjEgPSByZXF1aXJlKFwiQHN0ZWVkb3MvY29yZS9wYWNrYWdlLmpzb25cIikpICE9IG51bGwgPyByZWYxLnZlcnNpb24gOiB2b2lkIDBcbiAgICB9O1xuICB9KTtcbiAgdHJ5RmV0Y2hQbHVnaW5zSW5mbyhmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmMTtcbiAgICByZXR1cm4gcmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9vYmplY3RxbFwiXSA9IHtcbiAgICAgIHZlcnNpb246IChyZWYxID0gcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsL3BhY2thZ2UuanNvblwiKSkgIT0gbnVsbCA/IHJlZjEudmVyc2lvbiA6IHZvaWQgMFxuICAgIH07XG4gIH0pO1xuICB0cnlGZXRjaFBsdWdpbnNJbmZvKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiByZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL2FjY291bnRzXCJdID0ge1xuICAgICAgdmVyc2lvbjogKHJlZjEgPSByZXF1aXJlKFwiQHN0ZWVkb3MvYWNjb3VudHMvcGFja2FnZS5qc29uXCIpKSAhPSBudWxsID8gcmVmMS52ZXJzaW9uIDogdm9pZCAwXG4gICAgfTtcbiAgfSk7XG4gIHRyeUZldGNoUGx1Z2luc0luZm8oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjE7XG4gICAgcmV0dXJuIHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3dcIl0gPSB7XG4gICAgICB2ZXJzaW9uOiAocmVmMSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi13b3JrZmxvdy9wYWNrYWdlLmpzb25cIikpICE9IG51bGwgPyByZWYxLnZlcnNpb24gOiB2b2lkIDBcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBjb2RlOiAyMDAsXG4gICAgZGF0YTogcmVzdWx0XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHRib2R5ID0gXCJcIlxuXHRcdHJlcS5vbignZGF0YScsIChjaHVuayktPlxuXHRcdFx0Ym9keSArPSBjaHVua1xuXHRcdClcblx0XHRyZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCgpLT5cblx0XHRcdFx0eG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJylcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxuXHRcdFx0XHRwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgKGVyciwgcmVzdWx0KS0+XG5cdFx0XHRcdFx0XHQjIOeJueWIq+aPkOmGku+8muWVhuaIt+ezu+e7n+WvueS6juaUr+S7mOe7k+aenOmAmuefpeeahOWGheWuueS4gOWumuimgeWBmuetvuWQjemqjOivgSzlubbmoKHpqozov5Tlm57nmoTorqLljZXph5Hpop3mmK/lkKbkuI7llYbmiLfkvqfnmoTorqLljZXph5Hpop3kuIDoh7TvvIzpmLLmraLmlbDmja7ms4TmvI/lr7zoh7Tlh7rnjrDigJzlgYfpgJrnn6XigJ3vvIzpgKDmiJDotYTph5HmjZ/lpLFcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXG5cdFx0XHRcdFx0XHR3eHBheSA9IFdYUGF5KHtcblx0XHRcdFx0XHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcblx0XHRcdFx0XHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXG5cdFx0XHRcdFx0XHRhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpXG5cdFx0XHRcdFx0XHRjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZFxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxuXHRcdFx0XHRcdFx0aWYgYnByIGFuZCBicHIudG90YWxfZmVlIGlzIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSBhbmQgc2lnbiBpcyByZXN1bHQuc2lnblxuXHRcdFx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7X2lkOiBjb2RlX3VybF9pZH0sIHskc2V0OiB7cGFpZDogdHJ1ZX19KVxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxuXHRcdFx0XHRcdFxuXHRcdFx0XHQpXG5cdFx0XHQpLCAoZXJyKS0+XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCdcblx0XHRcdClcblx0XHQpXG5cdFx0XG5cdGNhdGNoIGVcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXG5cdHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpXG5cblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XG5cdFx0IyDmoLnmja7lvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4fvvIzmn6Xor6Llh7rlvZPliY3nlKjmiLfpmZDlrprnmoTnu4Tnu4fmn6XnnIvojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXG5cdFx0IyDpu5jorqTov5Tlm57pmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4dcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXG5cdFx0cmVWYWx1ZSA9XG5cdFx0XHRpc0xpbWl0OiB0cnVlXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0c2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJ9KVxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcblxuXHRcdGlmIGxpbWl0cy5sZW5ndGhcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0XHRcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcblx0XHRcdFx0ZnJvbXMgPSBsaW1pdC5mcm9tc1xuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3Ncblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4/Lm1hcCAobikgLT5cblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcblx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRpZiB0ZW1wSXNMaW1pdFxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xuXHRcdFx0XHRcdFx0bXlMaXRtaXRPcmdJZHMucHVzaCBteU9yZ0lkXG5cblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXG5cdFx0XHRpZiBteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXG5cdFx0XHRlbHNlXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cblx0XHRpZiBpc0xpbWl0XG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ54i25a2Q6IqC54K55YWz57O755qE6IqC54K5562b6YCJ5Ye65p2l5bm25Y+W5Ye65pyA5aSW5bGC6IqC54K5XG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cblx0XHRcdFx0cGFyZW50cyA9IG9yZy5wYXJlbnRzIG9yIFtdXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cblx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XG5cdFx0cmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblx0XHRyZXR1cm4gcmVWYWx1ZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gICAgc2V0S2V5VmFsdWU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcblxuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgb2JqLmtleSA9IGtleTtcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XG5cbiAgICAgICAgdmFyIGMgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kKHtcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgaWYgKGMgPiAwKSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufSkiLCJNZXRlb3IubWV0aG9kc1xuXHRiaWxsaW5nX3NldHRsZXVwOiAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQ9XCJcIiktPlxuXHRcdGNoZWNrKGFjY291bnRpbmdfbW9udGgsIFN0cmluZylcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9LCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxuXG5cdFx0aWYgbm90IHVzZXIuaXNfY2xvdWRhZG1pblxuXHRcdFx0cmV0dXJuXG5cblx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcnXG5cdFx0c3BhY2VzID0gW11cblx0XHRpZiBzcGFjZV9pZFxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VfaWQsIGlzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0ZWxzZVxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0cmVzdWx0ID0gW11cblx0XHRzcGFjZXMuZm9yRWFjaCAocykgLT5cblx0XHRcdHRyeVxuXHRcdFx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKVxuXHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdGUgPSB7fVxuXHRcdFx0XHRlLl9pZCA9IHMuX2lkXG5cdFx0XHRcdGUubmFtZSA9IHMubmFtZVxuXHRcdFx0XHRlLmVyciA9IGVyclxuXHRcdFx0XHRyZXN1bHQucHVzaCBlXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aCA+IDBcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XG5cdFx0XHR0cnlcblx0XHRcdFx0RW1haWwgPSBQYWNrYWdlLmVtYWlsLkVtYWlsXG5cdFx0XHRcdEVtYWlsLnNlbmRcblx0XHRcdFx0XHR0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nXG5cdFx0XHRcdFx0ZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbVxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcblx0XHRcdFx0XHR0ZXh0OiBKU09OLnN0cmluZ2lmeSgncmVzdWx0JzogcmVzdWx0KVxuXHRcdFx0Y2F0Y2ggZXJyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXG5cdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nJyIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19zZXR0bGV1cDogZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgRW1haWwsIGVyciwgcmVzdWx0LCBzcGFjZXMsIHVzZXI7XG4gICAgaWYgKHNwYWNlX2lkID09IG51bGwpIHtcbiAgICAgIHNwYWNlX2lkID0gXCJcIjtcbiAgICB9XG4gICAgY2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcnKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgX2lkOiBzcGFjZV9pZCxcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlc3VsdCA9IFtdO1xuICAgIHNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBlLCBlcnI7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgZSA9IHt9O1xuICAgICAgICBlLl9pZCA9IHMuX2lkO1xuICAgICAgICBlLm5hbWUgPSBzLm5hbWU7XG4gICAgICAgIGUuZXJyID0gZXJyO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCk7XG4gICAgICB0cnkge1xuICAgICAgICBFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWw7XG4gICAgICAgIEVtYWlsLnNlbmQoe1xuICAgICAgICAgIHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbScsXG4gICAgICAgICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICAgICAgICBzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnLFxuICAgICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICdyZXN1bHQnOiByZXN1bHRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcnKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRVc2VybmFtZTogKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkgLT5cblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcblxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcblxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxuXG5cdFx0dW5sZXNzIHVzZXJfaWRcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxuXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IHVzZXJuYW1lfX0pXG5cblx0XHRyZXR1cm4gdXNlcm5hbWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkge1xuICAgIHZhciBzcGFjZVVzZXI7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG4gICAgaWYgKCFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSAmJiB1c2VyX2lkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnZXJyb3ItaW52YWxpZC11c2VyJyk7XG4gICAgfVxuICAgIGlmICghdXNlcl9pZCkge1xuICAgICAgdXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKTtcbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVzZXJuYW1lO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cblx0XHRjaGVjayB0b3RhbF9mZWUsIE51bWJlclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmcgXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXG5cdFx0Y2hlY2sgbW9kdWxlX25hbWVzLCBBcnJheSBcblx0XHRjaGVjayBlbmRfZGF0ZSwgU3RyaW5nIFxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcblxuXHRcdHVzZXJfaWQgPSB0aGlzLnVzZXJJZFxuXG5cdFx0bGlzdHByaWNlcyA9IDBcblx0XHRvcmRlcl9ib2R5ID0gW11cblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XG5cdFx0XHRsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYlxuXHRcdFx0b3JkZXJfYm9keS5wdXNoIG0ubmFtZV96aFxuXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblx0XHRpZiBub3Qgc3BhY2UuaXNfcGFpZFxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxuXHRcdFx0b25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlc1xuXHRcdFx0aWYgdG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4qMTAwXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxuXG5cdFx0cmVzdWx0X29iaiA9IHt9XG5cblx0XHRhdHRhY2ggPSB7fVxuXHRcdGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZFxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXG5cblx0XHR3eHBheSA9IFdYUGF5KHtcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcblx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuXHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcblx0XHR9KVxuXG5cdFx0d3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG5cdFx0XHRvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcblx0XHRcdHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG5cdFx0XHRub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuXHRcdFx0dHJhZGVfdHlwZTogJ05BVElWRScsXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG5cdFx0XHRhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcblx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgoZXJyLCByZXN1bHQpIC0+IFxuXHRcdFx0XHRpZiBlcnIgXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcblx0XHRcdFx0aWYgcmVzdWx0XG5cdFx0XHRcdFx0b2JqID0ge31cblx0XHRcdFx0XHRvYmouX2lkID0gbmV3X2lkXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZVxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XG5cdFx0XHRcdFx0b2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZVxuXHRcdFx0XHRcdG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRcdFx0b2JqLnBhaWQgPSBmYWxzZVxuXHRcdFx0XHRcdG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblx0XHRcdFx0XHRvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopXG5cdFx0XHQpLCAoKS0+XG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCdcblx0XHRcdClcblx0XHQpXG5cblx0XHRcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxuXHRcdHVzZXJfY291bnRfaW5mby5hY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0ZGIudXNlcnMuY3JlYXRlX3NlY3JldCB0aGlzLnVzZXJJZCwgbmFtZVxuXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxuXHRcdGlmICF0aGlzLnVzZXJJZCB8fCAhdG9rZW5cblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKVxuXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcbiAgICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiAoc3BhY2VJZCwgdXNlcklkKSAtPlxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcblxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ25vdC1hdXRob3JpemVkJ1xuXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge2ZpZWxkczoge3BhcmVudHM6IDF9fSkuZmV0Y2goKVxuXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEgfSB9KS5mZXRjaCgpXG4gICAgICAgIF8uZWFjaCBvd3MsKG8pIC0+XG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxuICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXG4gICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxuXG4gICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXG4gICAgICAgICAgICBpZiBwZXJtc1xuICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXG4gICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICBlbHNlIGlmIHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcblxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRzZXRTcGFjZVVzZXJQYXNzd29yZDogKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkgLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKVxuXHRcdFxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxuXHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXG5cdFx0dW5sZXNzIGlzU3BhY2VBZG1pblxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcblxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXG5cblx0XHRTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cblx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge2xvZ291dDogdHJ1ZX0pXG5cblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxuXHRcdGlmIHVzZXJDUC5tb2JpbGVcblx0XHRcdGxhbmcgPSAnZW4nXG5cdFx0XHRpZiB1c2VyQ1AubG9jYWxlIGlzICd6aC1jbidcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcblx0XHRcdFNNU1F1ZXVlLnNlbmRcblx0XHRcdFx0Rm9ybWF0OiAnSlNPTicsXG5cdFx0XHRcdEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuXHRcdFx0XHRQYXJhbVN0cmluZzogJycsXG5cdFx0XHRcdFJlY051bTogdXNlckNQLm1vYmlsZSxcblx0XHRcdFx0U2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuXHRcdFx0XHRUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuXHRcdFx0XHRtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7bmFtZTpjdXJyZW50VXNlci5uYW1lfSwgbGFuZylcblxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRTcGFjZVVzZXJQYXNzd29yZDogZnVuY3Rpb24oc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSB7XG4gICAgdmFyIGN1cnJlbnRVc2VyLCBpc1NwYWNlQWRtaW4sIGxhbmcsIHJlZiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmICghaXNTcGFjZUFkbWluKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV91c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgU3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge1xuICAgICAgbG9nb3V0OiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUpIHtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKHVzZXJDUC5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICByZXR1cm4gU01TUXVldWUuc2VuZCh7XG4gICAgICAgIEZvcm1hdDogJ0pTT04nLFxuICAgICAgICBBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcbiAgICAgICAgUGFyYW1TdHJpbmc6ICcnLFxuICAgICAgICBSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG4gICAgICAgIFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcbiAgICAgICAgVGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcbiAgICAgICAgbXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge1xuICAgICAgICAgIG5hbWU6IGN1cnJlbnRVc2VyLm5hbWVcbiAgICAgICAgfSwgbGFuZylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XG5cbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxuIyBhY2NvdW50aW5nX21vbnRoIOe7k+eul+aciO+8jOagvOW8j++8mllZWVlNTVxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdGNvdW50X2RheXMgPSAwXG5cblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcblxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxuXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcblx0XHQjIGRvIG5vdGhpbmdcblx0ZWxzZSBpZiBzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgYW5kIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cblxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XG5cdGxhc3RfYmlsbCA9IG51bGxcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcblxuXHQjIOiOt+WPluato+W4uOS7mOasvueahOWwj+S6jnJlZnJlc2hfZGF0ZeeahOacgOi/keeahOS4gOadoeiusOW9lVxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGNyZWF0ZWQ6IHtcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcblx0XHRcdH0sXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGlmIHBheW1lbnRfYmlsbFxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxuXHRlbHNlXG5cdFx0IyDojrflj5bmnIDmlrDnmoTnu5PnrpfnmoTkuIDmnaHorrDlvZVcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRzb3J0OiB7XG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdFx0aWYgYXBwX2JpbGxcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXG5cblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxuXHRjcmVkaXRzID0gaWYgYmlsbC5jcmVkaXRzIHRoZW4gYmlsbC5jcmVkaXRzIGVsc2UgMC4wXG5cdHNldE9iaiA9IG5ldyBPYmplY3Rcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcblxuIyDnu5PnrpflvZPmnIjnmoTmlK/lh7rkuI7kvZnpop1cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKVxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblxuXHRkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzL2RheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0XHRcdH1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXG5cdFx0XHR9XG5cdFx0fVxuXHQpXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdG5vdyA9IG5ldyBEYXRlXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxuXHRuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKClcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXG5cdG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXG5cdG5ld19iaWxsLmNyZWF0ZWQgPSBub3dcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XG5cdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0e1xuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XG5cdFx0fVxuXHQpLmZvckVhY2ggKGJpbGwpLT5cblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxuXG5cdGlmIHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMFxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0bW9kdWxlcyA9IG5ldyBBcnJheVxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxuXHRcdFx0XHRjaGFuZ2VfZGF0ZToge1xuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXG5cdFx0XHR9XG5cdFx0KVxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXG5cdFx0aWYgbm90IG1fY2hhbmdlbG9nXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJxpbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5a6J6KOF77yM5Zug5q2k6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJx1bmluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Lljbjovb3vvIzlm6DmraTkuI3orqHnrpfotLnnlKhcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcblx0XHRcdCMgIGRvIG5vdGhpbmdcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRl4omlc3RhcnRkYXRl77yM6K+05piO5b2T5pyI5YaF5Y+R55Sf6L+H5a6J6KOF5oiW5Y246L2955qE5pON5L2c77yM6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXG5cdHJldHVybiBtb2R1bGVzXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSAoKS0+XG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XG5cdFx0bW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKVxuXHQpXG5cdHJldHVybiBtb2R1bGVzX25hbWVcblxuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdGlmIGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHRyZXR1cm5cblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcblx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZGViaXRzID0gMFxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHRcdHtcblx0XHRcdFx0YmlsbGluZ19kYXRlOiBiX20sXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KS5mb3JFYWNoKChiKS0+XG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcblx0XHQpXG5cdFx0bmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWR9LCB7c29ydDoge21vZGlmaWVkOiAtMX19KVxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcblx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0aWYgZGViaXRzID4gMFxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxuXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXG5cdFx0XHR7XG5cdFx0XHRcdF9pZDogc3BhY2VfaWRcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdCRzZXQ6IHtcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0ZWxzZVxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0aWYgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT0gMFxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0ZWxzZVxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxuXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0XHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0KVxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxuXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxuXHRcdFx0bW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XG5cdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKVxuXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXG5cdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKVxuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxuXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcblxuXHRtID0gbW9tZW50KClcblx0bm93ID0gbS5fZFxuXG5cdHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0XG5cblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxuXHRpZiBzcGFjZS5pc19wYWlkIGlzbnQgdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxuXG5cdCMg5pu05pawbW9kdWxlc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vd1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxuXHRzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxuXHRpZiByXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XG5cdFx0XHRtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKVxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcblx0XHRcdG1jbC5zcGFjZSA9IHNwYWNlX2lkXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcblx0XHRcdG1jbC5jcmVhdGVkID0gbm93XG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcblxuXHRyZXR1cm4iLCIgICAgICAgICAgICAgICAgICAgXG5cbmJpbGxpbmdNYW5hZ2VyID0ge307XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBiaWxsaW5nLCBjb3VudF9kYXlzLCBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgZmlyc3RfZGF0ZSwgc3RhcnRfZGF0ZSwgc3RhcnRfZGF0ZV90aW1lO1xuICBjb3VudF9kYXlzID0gMDtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwiXG4gIH0pO1xuICBmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGU7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEgLSBlbmRfZGF0ZV90aW1lLmdldERhdGUoKSk7XG4gIGlmIChmaXJzdF9kYXRlID49IGVuZF9kYXRlKSB7XG5cbiAgfSBlbHNlIGlmIChzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgJiYgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH0gZWxzZSBpZiAoZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFwiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzXG4gIH07XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKSB7XG4gIHZhciBhcHBfYmlsbCwgYl9tLCBiX21fZCwgYmlsbCwgY3JlZGl0cywgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgcGF5bWVudF9iaWxsLCBzZXRPYmo7XG4gIGxhc3RfYmlsbCA9IG51bGw7XG4gIGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDogcmVmcmVzaF9kYXRlXG4gIH0pO1xuICBwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDoge1xuICAgICAgJGx0OiByZWZyZXNoX2RhdGVcbiAgICB9LFxuICAgIGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgaWYgKHBheW1lbnRfYmlsbCkge1xuICAgIGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbDtcbiAgfSBlbHNlIHtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICBhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgYmlsbGluZ19tb250aDogYl9tXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoYXBwX2JpbGwpIHtcbiAgICAgIGxhc3RfYmlsbCA9IGFwcF9iaWxsO1xuICAgIH1cbiAgfVxuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgZGViaXRzID0gYmlsbC5kZWJpdHMgPyBiaWxsLmRlYml0cyA6IDAuMDtcbiAgY3JlZGl0cyA9IGJpbGwuY3JlZGl0cyA/IGJpbGwuY3JlZGl0cyA6IDAuMDtcbiAgc2V0T2JqID0gbmV3IE9iamVjdDtcbiAgc2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogYmlsbC5faWRcbiAgfSwge1xuICAgICRzZXQ6IHNldE9ialxuICB9KTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpIHtcbiAgdmFyIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgZGF5c19udW1iZXIsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIG5ld19iaWxsLCBub3c7XG4gIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKTtcbiAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICBkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzIC8gZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSk7XG4gIGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBiaWxsaW5nX2RhdGU6IHtcbiAgICAgICRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgbm93ID0gbmV3IERhdGU7XG4gIG5ld19iaWxsID0gbmV3IE9iamVjdDtcbiAgbmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpO1xuICBuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aDtcbiAgbmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdDtcbiAgbmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZDtcbiAgbmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZTtcbiAgbmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlO1xuICBuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgbmV3X2JpbGwuZGViaXRzID0gZGViaXRzO1xuICBuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBuZXdfYmlsbC5jcmVhdGVkID0gbm93O1xuICBuZXdfYmlsbC5tb2RpZmllZCA9IG5vdztcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkuY291bnQoKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZnJlc2hfZGF0ZXM7XG4gIHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXk7XG4gIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgIGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAkaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl1cbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGJpbGwpIHtcbiAgICByZXR1cm4gcmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZCk7XG4gIH0pO1xuICBpZiAocmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWZyZXNoX2RhdGVzLCBmdW5jdGlvbihyX2QpIHtcbiAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBtb2R1bGVzLCBzdGFydF9kYXRlO1xuICBtb2R1bGVzID0gbmV3IEFycmF5O1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBtX2NoYW5nZWxvZztcbiAgICBtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG1vZHVsZTogbS5uYW1lLFxuICAgICAgY2hhbmdlX2RhdGU6IHtcbiAgICAgICAgJGx0ZTogZW5kX2RhdGVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH0pO1xuICAgIGlmICghbV9jaGFuZ2Vsb2cpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJpbnN0YWxsXCIpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcInVuaW5zdGFsbFwiKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGUpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXM7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtb2R1bGVzX25hbWU7XG4gIG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlc19uYW1lO1xufTtcblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciBhX20sIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgYl9tLCBiX21fZCwgYmFsYW5jZSwgZGViaXRzLCBtb2R1bGVzLCBtb2R1bGVzX25hbWUsIG5ld2VzdF9iaWxsLCBwZXJpb2RfcmVzdWx0LCByZW1haW5pbmdfbW9udGhzLCB1c2VyX2NvdW50O1xuICBpZiAoYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWNjb3VudGluZ19tb250aCA9PT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIGRlYml0cyA9IDA7XG4gICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICAgIGJpbGxpbmdfZGF0ZTogYl9tLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBkZWJpdHMgKz0gYi5kZWJpdHM7XG4gICAgfSk7XG4gICAgbmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2U7XG4gICAgcmVtYWluaW5nX21vbnRocyA9IDA7XG4gICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICBpZiAoZGViaXRzID4gMCkge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZSAvIGRlYml0cykgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBiYWxhbmNlOiBiYWxhbmNlLFxuICAgICAgICBcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgaWYgKHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09PSAwKSB7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgICAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgZGIuYmlsbGluZ3MucmVtb3ZlKHtcbiAgICAgICAgYmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChtb2R1bGVzLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSBmdW5jdGlvbihzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICB2YXIgbSwgbW9kdWxlcywgbmV3X21vZHVsZXMsIG5vdywgciwgc3BhY2UsIHNwYWNlX3VwZGF0ZV9vYmo7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXk7XG4gIG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcyk7XG4gIG0gPSBtb21lbnQoKTtcbiAgbm93ID0gbS5fZDtcbiAgc3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3Q7XG4gIGlmIChzcGFjZS5pc19wYWlkICE9PSB0cnVlKSB7XG4gICAgc3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZTtcbiAgICBzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZTtcbiAgfVxuICBzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3c7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZDtcbiAgc3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKTtcbiAgc3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzcGFjZV91cGRhdGVfb2JqXG4gIH0pO1xuICBpZiAocikge1xuICAgIF8uZWFjaChuZXdfbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICB2YXIgbWNsO1xuICAgICAgbWNsID0gbmV3IE9iamVjdDtcbiAgICAgIG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpO1xuICAgICAgbWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkO1xuICAgICAgbWNsLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCI7XG4gICAgICBtY2wubW9kdWxlID0gbW9kdWxlO1xuICAgICAgbWNsLmNyZWF0ZWQgPSBub3c7XG4gICAgICByZXR1cm4gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpO1xuICAgIH0pO1xuICB9XG59O1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XG5cbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXG4gICAgdmFyIHJ1bGUgPSBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzO1xuXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xuXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWdvX25leHQpXG4gICAgICAgIHJldHVybjtcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcblxuICAgICAgY29uc29sZS50aW1lKCdzdGF0aXN0aWNzJyk7XG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XG4gICAgICAgIHZhciBkYXRla2V5ID0gXCJcIitkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrKGRhdGUuZ2V0TW9udGgoKSsxKStcIi1cIisoZGF0ZS5nZXREYXRlKCkpO1xuICAgICAgICByZXR1cm4gZGF0ZWtleTtcbiAgICAgIH07XG4gICAgICAvLyDorqHnrpfliY3kuIDlpKnml7bpl7RcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxuICAgICAgICB2YXIgZEJlZm9yZSA9IG5ldyBEYXRlKGROb3cuZ2V0VGltZSgpIC0gMjQqMzYwMCoxMDAwKTsgICAvL+W+l+WIsOWJjeS4gOWkqeeahOaXtumXtFxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcbiAgICAgIH07XG4gICAgICAvLyDnu5/orqHlvZPml6XmlbDmja5cbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaAu+aVsFxuICAgICAgdmFyIHN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xuICAgICAgfTtcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6IHNwYWNlW1wib3duZXJcIl19KTtcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xuICAgICAgICByZXR1cm4gbmFtZTtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGxhc3RMb2dvbiA9IDA7XG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcbiAgICAgICAgICB2YXIgdXNlciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjpzVXNlcltcInVzZXJcIl19KTtcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvYmogPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGxpbWl0OiAxfSk7XG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXG4gICAgICAgICAgdmFyIG1vZCA9IG9iakFyclswXS5tb2RpZmllZDtcbiAgICAgICAgICByZXR1cm4gbW9kO1xuICAgICAgfTtcbiAgICAgIC8vIOaWh+eroOmZhOS7tuWkp+Wwj1xuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6cG9zdFtcIl9pZFwiXX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSkgIFxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cbiAgICAgIHZhciBkYWlseVBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xuICAgICAgICBkYi5zdGVlZG9zX3N0YXRpc3RpY3MuaW5zZXJ0KHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxuICAgICAgICAgIGJhbGFuY2U6IHNwYWNlW1wiYmFsYW5jZVwiXSxcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxuICAgICAgICAgIHN0ZWVkb3M6e1xuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGxhc3RfbG9nb246IGxhc3RMb2dvbihkYi51c2Vycywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB3b3JrZmxvdzp7XG4gICAgICAgICAgICBmbG93czogc3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19wb3NpdGlvbnM6IHN0YXRpY3NDb3VudChkYi5mbG93X3Bvc2l0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZmxvd3M6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNtczoge1xuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzOiBzdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgY29tbWVudHM6IHN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2NvbW1lbnRzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgY29uc29sZS50aW1lRW5kKCdzdGF0aXN0aWNzJyk7XG5cbiAgICAgIGdvX25leHQgPSB0cnVlO1xuXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuXG4gIH1cblxufSlcblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAxXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhID0ge3BhcmVudDogcGFyZW50X2lkLCBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSwgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLCBzcGFjZTogc3BhY2VfaWQsIGluc3RhbmNlOiBpbnN0YW5jZV9pZCwgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXX1cbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxuXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxuICAgICAgICAgICAgICAgIGkgPSAwXG4gICAgICAgICAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGZpZWxkczoge3NwYWNlOiAxLCBhdHRhY2htZW50czogMX19KS5mb3JFYWNoIChpbnMpIC0+XG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcblxuICAgICAgICAgICAgICAgICAgICBpKytcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3Uub3JnYW5pemF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OScsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAyIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvcmdhbml6YXRpb246IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAzXG4gICAgICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7ZW1haWw6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7dXNlcjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge2VtYWlsOiBhZGRyZXNzfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDMsXG4gICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMyB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHVzZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgYWRkcmVzcywgdTtcbiAgICAgICAgICBpZiAoc3UudXNlcikge1xuICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHN1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAzIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDRcbiAgICAgICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJ1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDQsXG4gICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgc29ydF9ubzoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAxMDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA0IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDVcblx0XHRuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCdcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0XHR0cnlcblxuXHRcdFx0XHRkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaCAoc3UpLT5cblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xuXHRcdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRcdFx0aWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggaXMgMVxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHN1LnNwYWNlLCBwYXJlbnQ6IG51bGx9KVxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcblx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcyA9IFtdXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxuXHRcdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcylcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNlxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0XHR0cnlcblx0XHRcdFx0IyDmuIXnqbptb2R1bGVz6KGoXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+agh+WHhueJiFwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMlxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMThcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG5cdFx0XHRcdH0pXG5cblxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxuXHRcdFx0XHRcdHRyeVxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxuXHRcdFx0XHRcdFx0c2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gMFxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe25hbWU6IHBtfSlcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZS8obGlzdHByaWNlcyp1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDFcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXG5cblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcblx0XHRcdFx0XHRcdHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcblx0XHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyB1cGdyYWRlXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdGRvd246IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBzdGFydF9kYXRlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm1vZHVsZXMucmVtb3ZlKHt9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5qCH5YeG54mIXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMS4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAyXG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAzLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiA2LjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICAgIGlzX3BhaWQ6IHRydWUsXG4gICAgICAgICAgdXNlcl9saW1pdDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHZhciBiYWxhbmNlLCBlLCBlbmRfZGF0ZSwgbGlzdHByaWNlcywgbW9udGhzLCBzZXRfb2JqLCB1c2VyX2NvdW50O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRfb2JqID0ge307XG4gICAgICAgICAgICB1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzLl9pZCxcbiAgICAgICAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gICAgICAgICAgICBiYWxhbmNlID0gcy5iYWxhbmNlO1xuICAgICAgICAgICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgICAgICAgIGxpc3RwcmljZXMgPSAwO1xuICAgICAgICAgICAgICBfLmVhY2gocy5tb2R1bGVzLCBmdW5jdGlvbihwbSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUubGlzdHByaWNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlIC8gKGxpc3RwcmljZXMgKiB1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDE7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgIGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFsYW5jZSA8PSAwKSB7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIik7XG4gICAgICAgICAgICBzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcy5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDogc2V0X29ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHMuX2lkKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2V0X29iaik7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyB1cGdyYWRlXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA2IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdG5ldyBUYWJ1bGFyLlRhYmxlXG5cdFx0bmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXG5cdFx0Y29sdW1uczogW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXG5cdFx0XHR9XG5cdFx0XVxuXHRcdGRvbTogXCJ0cFwiXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxuXHRcdG9yZGVyaW5nOiBmYWxzZVxuXHRcdHBhZ2VMZW5ndGg6IDEwXG5cdFx0aW5mbzogZmFsc2Vcblx0XHRzZWFyY2hpbmc6IHRydWVcblx0XHRhdXRvV2lkdGg6IHRydWVcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XG5cdFx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2Vcblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
