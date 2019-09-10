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
  "sprintf-js": "^1.0.3"
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
      var reason, valid;
      reason = t("password_invalid");
      valid = true;

      if (!pwd) {
        valid = false;
      }

      if (!/\d+/.test(pwd)) {
        valid = false;
      }

      if (!/[a-zA-Z]+/.test(pwd)) {
        valid = false;
      }

      if (pwd.length < 8) {
        valid = false;
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
  var USER_CONTEXT, authToken, permissions, ref, result, space, spaceId, userId, userSession;
  userId = req.headers['x-user-id'];
  spaceId = req.headers['x-space-id'] || ((ref = req.params) != null ? ref.spaceId : void 0);

  if (!userId) {
    JsonRoutes.sendResult(res, {
      code: 403,
      data: null
    });
    return;
  }

  USER_CONTEXT = Creator.getUserContext(userId, spaceId, true);

  if (!USER_CONTEXT) {
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
  result.USER_CONTEXT = USER_CONTEXT;
  result.space = space;
  result.apps = _.extend(Creator.getDBApps(spaceId), Creator.Apps);
  result.object_listviews = Creator.getUserObjectsListViews(userId, spaceId, result.objects);
  result.object_workflows = Meteor.call('object_workflows.get', spaceId, userId);
  authToken = Steedos.getAuthToken(req, res);
  userSession = Meteor.wrapAsync(function (authToken, spaceId, cb) {
    return steedosAuth.getSession(authToken, spaceId).then(function (resolve, reject) {
      return cb(reject, resolve);
    });
  })(authToken, spaceId);
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
                is_company: true,
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
Meteor.startup(function () {
  return Migrations.migrateTo('latest');
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMveHJ1bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy94cnVuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiTW9uZ28iLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsImlnbm9yZVVuZGVmaW5lZCIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsInJlZyIsIlJlZ0V4cCIsInRlc3QiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzQ2xpZW50Iiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwiYXZhdGFyVXJsIiwiYmFja2dyb3VuZCIsInJlZjIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiJCIsImNzcyIsImlzQ29yZG92YSIsImFic29sdXRlVXJsIiwiYWRtaW4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImdldCIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsInJlZGlyZWN0VG9TaWduSW4iLCJyZWRpcmVjdCIsImFjY291bnRzVXJsIiwic2lnbkluVXJsIiwid2Vic2VydmljZXMiLCJhY2NvdW50cyIsImhyZWYiLCJBY2NvdW50c1RlbXBsYXRlcyIsImdldFJvdXRlUGF0aCIsIkZsb3dSb3V0ZXIiLCJnbyIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsImVycm9yMSIsImNvbnNvbGUiLCJtZXNzYWdlIiwic3RhY2siLCJzZXQiLCJjaGVja1NwYWNlQmFsYW5jZSIsInNwYWNlSWQiLCJlbmRfZGF0ZSIsIm1pbl9tb250aHMiLCJzcGFjZSIsImlzU3BhY2VBZG1pbiIsInNwYWNlcyIsImlzX3BhaWQiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsIm1hdGNoIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiYWRtaW5zIiwiaXNMZWdhbFZlcnNpb24iLCJhcHBfdmVyc2lvbiIsImNoZWNrIiwibW9kdWxlcyIsImlzT3JnQWRtaW5CeU9yZ0lkcyIsIm9yZ0lkcyIsImFsbG93QWNjZXNzT3JncyIsImlzT3JnQWRtaW4iLCJ1c2VPcmdzIiwiZmlsdGVyIiwib3JnIiwidW5pcSIsImlzT3JnQWRtaW5CeUFsbE9yZ0lkcyIsImkiLCJyb290X3VybCIsIlVSTCIsInBhdGhuYW1lIiwiZ2V0QVBJTG9naW5Vc2VyIiwicmVxIiwicmVzIiwicGFzc3dvcmQiLCJyZWYzIiwicmVzdWx0IiwidXNlcm5hbWUiLCJxdWVyeSIsInVzZXJzIiwic3RlZWRvc19pZCIsIl9jaGVja1Bhc3N3b3JkIiwiRXJyb3IiLCJjaGVja0F1dGhUb2tlbiIsImhlYWRlcnMiLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImRlY3J5cHQiLCJpdiIsImMiLCJkZWNpcGhlciIsImRlY2lwaGVyTXNnIiwia2V5MzIiLCJsZW4iLCJjcmVhdGVEZWNpcGhlcml2IiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJlbmNyeXB0IiwiY2lwaGVyIiwiY2lwaGVyZWRNc2ciLCJjcmVhdGVDaXBoZXJpdiIsImdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsImNvbGxlY3Rpb24iLCJvYmoiLCJzcGxpdCIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiZnVuYyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiTnVtYmVyIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicmVhc29uIiwidmFsaWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwiU2VydmVyU2Vzc2lvbiIsIkNvbGxlY3Rpb24iLCJjaGVja0ZvcktleSIsImdldFNlc3Npb25WYWx1ZSIsInZhbHVlcyIsImNvbmRpdGlvbiIsImRlbnkiLCJhcGkiLCJsb2ciLCJzZXNzaW9uT2JqIiwiZXhwZWN0ZWQiLCJpZGVudGljYWwiLCJpc09iamVjdCIsImlzRXF1YWwiLCJzdWJzY3JpYmUiLCJvbkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY2xpZW50SUQiLCJpZCIsImluc2VydCIsIm9uQ2xvc2UiLCJwdWJsaXNoIiwicmFuZG9tU2VlZCIsInVwZGF0ZU9iaiIsIm5ld0NvbmRpdGlvbiIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwic3RlZWRvc0F1dGgiLCJVU0VSX0NPTlRFWFQiLCJwZXJtaXNzaW9ucyIsInVzZXJTZXNzaW9uIiwiZ2V0VXNlckNvbnRleHQiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIkFwcHMiLCJvYmplY3RfbGlzdHZpZXdzIiwib2JqZWN0X3dvcmtmbG93cyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0VXNlck9iamVjdFBlcm1pc3Npb24iLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwiZGF0YXNvdXJjZU9iamVjdHMiLCJnZXRPYmplY3RzIiwiX29iaiIsImNvbnZlcnRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJnZXRBcHBzQ29uZmlnIiwib24iLCJjaHVuayIsImJpbmRFbnZpcm9ubWVudCIsInBhcnNlciIsInhtbDJqcyIsIlBhcnNlciIsImV4cGxpY2l0QXJyYXkiLCJleHBsaWNpdFJvb3QiLCJwYXJzZVN0cmluZyIsImVyciIsIldYUGF5IiwiYXR0YWNoIiwiYnByIiwiY29kZV91cmxfaWQiLCJzaWduIiwid3hwYXkiLCJhcHBpZCIsIm1jaF9pZCIsInBhcnRuZXJfa2V5IiwiY2xvbmUiLCJ0b3RhbF9mZWUiLCJiaWxsaW5nTWFuYWdlciIsInNwZWNpYWxfcGF5IiwidXNlcl9jb3VudCIsImdldF9jb250YWN0c19saW1pdCIsImZyb21zIiwiZnJvbXNDaGlsZHJlbiIsImZyb21zQ2hpbGRyZW5JZHMiLCJpc0xpbWl0IiwibGVuMSIsImxpbWl0IiwibGltaXRzIiwibXlMaXRtaXRPcmdJZHMiLCJteU9yZ0lkIiwibXlPcmdJZHMiLCJteU9yZ3MiLCJvdXRzaWRlX29yZ2FuaXphdGlvbnMiLCJzZXR0aW5nIiwidGVtcElzTGltaXQiLCJ0b09yZ3MiLCJ0b3MiLCJTdHJpbmciLCJzcGFjZV9zZXR0aW5ncyIsImludGVyc2VjdGlvbiIsInNldEtleVZhbHVlIiwiYmlsbGluZ19zZXR0bGV1cCIsImFjY291bnRpbmdfbW9udGgiLCJFbWFpbCIsInRpbWUiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5IiwidGltZUVuZCIsInNldFVzZXJuYW1lIiwic3BhY2VVc2VyIiwiaW52aXRlX3N0YXRlIiwiYmlsbGluZ19yZWNoYXJnZSIsIm5ld19pZCIsIm1vZHVsZV9uYW1lcyIsImxpc3RwcmljZXMiLCJvbmVfbW9udGhfeXVhbiIsIm9yZGVyX2JvZHkiLCJyZXN1bHRfb2JqIiwic3BhY2VfdXNlcl9jb3VudCIsImxpc3RwcmljZV9ybWIiLCJuYW1lX3poIiwiY3JlYXRlVW5pZmllZE9yZGVyIiwiam9pbiIsIm91dF90cmFkZV9ubyIsIm1vbWVudCIsImZvcm1hdCIsInNwYmlsbF9jcmVhdGVfaXAiLCJub3RpZnlfdXJsIiwidHJhZGVfdHlwZSIsInByb2R1Y3RfaWQiLCJpbmZvIiwiZ2V0X3NwYWNlX3VzZXJfY291bnQiLCJ1c2VyX2NvdW50X2luZm8iLCJ0b3RhbF91c2VyX2NvdW50IiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImNyZWF0ZV9zZWNyZXQiLCJyZW1vdmVfc2VjcmV0IiwidG9rZW4iLCJjdXJTcGFjZVVzZXIiLCJvd3MiLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsInRvRml4ZWQiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJwYXJlbnQiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwiaXNfY29tcGFueSIsInVwZGF0ZVVzZXJzIiwibW9udGhzIiwic2V0X29iaiIsInBtIiwic2V0TW9udGgiLCJtaWdyYXRlVG8iLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJzZWFyY2hpbmciLCJhdXRvV2lkdGgiLCJjaGFuZ2VTZWxlY3RvciIsIiRhbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQkksU0FBTyxFQUFFLFFBRk87QUFHaEIsWUFBVSxTQUhNO0FBSWhCQyxRQUFNLEVBQUUsUUFKUTtBQUtoQixnQkFBYztBQUxFLENBQUQsRUFNYixjQU5hLENBQWhCOztBQVFBLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxPQUF2QyxFQUFnRDtBQUMvQ1Isa0JBQWdCLENBQUM7QUFDaEIsa0JBQWM7QUFERSxHQUFELEVBRWIsY0FGYSxDQUFoQjtBQUdBLEM7Ozs7Ozs7Ozs7O0FDZkQsSUFBSVMsS0FBSjtBQUFVUixNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNPLE9BQUssQ0FBQ04sQ0FBRCxFQUFHO0FBQUNNLFNBQUssR0FBQ04sQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQzs7QUFFVjtBQUNBO0FBQ0EsSUFBSUcsTUFBTSxDQUFDSSxRQUFYLEVBQXFCO0FBRXBCLE1BQUlDLFlBQVksR0FBRztBQUNsQkMsbUJBQWUsRUFBRTtBQURDLEdBQW5CO0FBSUEsUUFBTUMsY0FBYyxHQUFH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QStZLGtCQUFjLEtBVmQ7QUFXQUMsY0FBVSxLQVhWO0FBWUExWSxnQkFBWSxFQVpaO0FBYUE0TixVQUFNLEtBYk47QUFjQStLLGVBQVcsSUFkWDtBQWVBQyxlQUFXLElBZlg7QUFnQkFDLG9CQUFnQixVQUFDOVosUUFBRCxFQUFXalcsTUFBWDtBQUNmLFVBQUE5QixHQUFBLEVBQUErSCxLQUFBOztBQUFBLFdBQU9qRyxNQUFQO0FBQ0MsZUFBTztBQUFDc0YsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ0lHOztBREhKVyxjQUFRZ1EsU0FBU2hRLEtBQWpCOztBQUNBLFdBQU9BLEtBQVA7QUFDQyxhQUFBZ1EsWUFBQSxRQUFBL1gsTUFBQStYLFNBQUErWixJQUFBLFlBQUE5eEIsSUFBbUJqQixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDZ0osa0JBQVFnUSxTQUFTK1osSUFBVCxDQUFjMXpCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBTzJKLEtBQVA7QUFDQyxlQUFPO0FBQUNYLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPMlEsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXG5cdGNvb2tpZXM6IFwiXjAuNi4yXCIsXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxuXHRta2RpcnA6IFwiXjAuMy41XCIsXG5cdFwic3ByaW50Zi1qc1wiOiBcIl4xLjAuM1wiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXG5cdH0sICdzdGVlZG9zOmJhc2UnKTtcbn0iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbycgICAgICAgXG5cbi8vIFJldmVydCBjaGFuZ2UgZnJvbSBNZXRlb3IgMS42LjEgd2hvIHNldCBpZ25vcmVVbmRlZmluZWQ6IHRydWVcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG5cblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcblx0XHRpZ25vcmVVbmRlZmluZWQ6IGZhbHNlLFxuXHR9O1xuXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zdCBqc29uTW9uZ29PcHRpb25zID0gSlNPTi5wYXJzZShtb25nb09wdGlvblN0cik7XG5cblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xuXHR9XG5cblx0TW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMobW9uZ29PcHRpb25zKTtcbn1cblxuXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1blxuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgaWYgKCF0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWxvY2FsZSl7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcbiAgICB9XG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXG4gICAgICAgIH1lbHNle1xuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xuXHRcdH1cbiAgICB9KTtcbn07XG5cblxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcbiAgICAgICAgdi5wdXNoKG0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2O1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcbiAqL1xuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgZyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgZy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxuICovXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIHIgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICByID0gdDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByO1xufSIsIlN0ZWVkb3MgPVxuXHRzZXR0aW5nczoge31cblx0ZGI6IGRiXG5cdHN1YnM6IHt9XG5cdGlzUGhvbmVFbmFibGVkOiAtPlxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgbG9jYWxlKS0+XG5cdFx0aWYgdHlwZW9mIG51bWJlciA9PSBcIm51bWJlclwiXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxuXG5cdFx0aWYgIW51bWJlclxuXHRcdFx0cmV0dXJuICcnO1xuXG5cdFx0aWYgbnVtYmVyICE9IFwiTmFOXCJcblx0XHRcdHVubGVzcyBsb2NhbGVcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdCMg5Lit5paH5LiH5YiG5L2N6LSi5Yqh5Lq65ZGY55yL5LiN5oOv77yM5omA5Lul5pS55Li65Zu96ZmF5LiA5qC355qE5Y2D5YiG5L2NXG5cdFx0XHRcdHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxuXHRcdGlmIGFjY291bnRCZ0JvZHlcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcblx0XHRpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0XHRpZiB1cmwgPT0gYXZhdGFyXG5cdFx0XHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIGF2YXRhclVybCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOi/memHjOS4jeWPr+S7peeUqFN0ZWVkb3MuYWJzb2x1dGVVcmzvvIzlm6DkuLphcHDkuK3opoHku47mnKzlnLDmipPlj5botYTmupDlj6/ku6XliqDlv6vpgJ/luqblubboioLnuqbmtYHph49cblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tpZiBNZXRlb3IuaXNDb3Jkb3ZhIHRoZW4gdXJsIGVsc2UgTWV0ZW9yLmFic29sdXRlVXJsKHVybCl9KVwiXG5cdFx0ZWxzZVxuXHRcdFx0IyDov5nph4zkuI3lj6/ku6XnlKhTdGVlZG9zLmFic29sdXRlVXJs77yM5Zug5Li6YXBw5Lit6KaB5LuO5pys5Zyw5oqT5Y+W6LWE5rqQ5Y+v5Lul5Yqg5b+r6YCf5bqm5bm26IqC57qm5rWB6YePXG5cdFx0XHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXG5cdFx0XHRpZiBiYWNrZ3JvdW5kXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIGJhY2tncm91bmQgZWxzZSBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje2lmIE1ldGVvci5pc0NvcmRvdmEgdGhlbiBiYWNrZ3JvdW5kIGVsc2UgTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxuXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxuXHRcdGlmIGFjY291bnRTa2luXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXG5cdFx0aWYgYWNjb3VudFpvb21cblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcblx0XHR6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXG5cdFx0dW5sZXNzIHpvb21OYW1lXG5cdFx0XHR6b29tTmFtZSA9IFwibGFyZ2VcIlxuXHRcdFx0em9vbVNpemUgPSAxLjJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXG5cdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxuXHRcdFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxuXHRcdFx0IyBlbHNlXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxuXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcblxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcblxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblxuXHRcdGxpbmtlciA9IFwiP1wiXG5cblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxuXHRcdFx0bGlua2VyID0gXCImXCJcblxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cblx0XHRhdXRoVG9rZW4gPSB7fTtcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcblxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcblxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG5cblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblxuXHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4gPSAocmVkaXJlY3QpLT5cdFxuXHRcdGFjY291bnRzVXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmFjY291bnRzPy51cmxcblx0XHRpZiBhY2NvdW50c1VybCBcblx0XHRcdHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYWNjb3VudHNVcmwgKyBcIi9hdXRob3JpemU/cmVkaXJlY3RfdXJpPS9cIjtcblx0XHRlbHNlXG5cdFx0XHRzaWduSW5VcmwgPSBBY2NvdW50c1RlbXBsYXRlcy5nZXRSb3V0ZVBhdGgoXCJzaWduSW5cIilcblx0XHRcdGlmIHJlZGlyZWN0XG5cdFx0XHRcdGlmIHNpZ25JblVybC5pbmRleE9mKFwiP1wiKSA+IDBcblx0XHRcdFx0XHRzaWduSW5VcmwgKz0gXCImcmVkaXJlY3Q9I3tyZWRpcmVjdH1cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0c2lnbkluVXJsICs9IFwiP3JlZGlyZWN0PSN7cmVkaXJlY3R9XCJcblx0XHRcdEZsb3dSb3V0ZXIuZ28gc2lnbkluVXJsXG5cblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcblx0XHRpZiAhYXBwXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxuXHRcdFx0cmV0dXJuXG5cblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcblx0XHQjIFx0cmV0dXJuXG5cblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xuXHRcdGlmIGFwcC5pc191c2VfaWVcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdGlmIG9uX2NsaWNrXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxuXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxuXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5Ncblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXG5cdFx0XHR0cnlcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXG5cblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxuXHRcdHVubGVzcyBzcGFjZUlkXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRtaW5fbW9udGhzID0gMVxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcblx0XHRcdG1pbl9tb250aHMgPSAzXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXG5cdFx0aWYgc3BhY2U/LmlzX3BhaWQgYW5kIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXG5cblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XG5cdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXG5cblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXG5cblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XG5cdFx0ZWxzZVxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxuXHRcdGlmIG9mZnNldFxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcblxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cblx0XHRERVZJQ0UgPVxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xuXHRcdFx0aXBhZDogJ2lwYWQnXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXG5cdFx0XHRpcG9kOiAnaXBvZCdcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcblx0XHRicm93c2VyID0ge31cblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcblx0XHRcdCcnXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxuXHRcdF1cblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXG5cblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0cmV0dXJuXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRpZiBpZnJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxuXHRcdFx0aWZyLmxvYWQgLT5cblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxuXHRcdFx0XHRpZiBpZnJCb2R5XG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXG5cdFx0XHRyZXR1cm4gW11cblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXG5cbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxuXHRcdHJldHVybiBmYWxzZTtcblxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxuXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxuXHRcdGlmICFzcGFjZUlkXG5cdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRjaGVjayA9IGZhbHNlXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcblx0XHRcdGNoZWNrID0gdHJ1ZVxuXHRcdHJldHVybiBjaGVja1xuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXG5cdFx0cGFyZW50cyA9IFtdXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cblx0XHRcdGlmIG9yZy5wYXJlbnRzXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRlbHNlXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdGkgPSAwXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxuXHRcdFx0XHRicmVha1xuXHRcdFx0aSsrXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxuXHRcdGlmIHVybFxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0XHRlbHNlXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxuXHRcdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcblx0XHRcdGVsc2Vcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcblxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cblxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxuXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXG5cblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcblxuXHRcdFx0aWYgIXVzZXJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXG5cblx0XHRcdGlmIHJlc3VsdC5lcnJvclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdXNlclxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdHJldHVybiBmYWxzZVxuXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRpZiB1c2VyXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHJldHVybiBmYWxzZVxuXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0dHJ5XG5cdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXHRcdGNhdGNoIGVcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHRrZXkzMiA9IFwiXCJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0aWYgbGVuIDwgMzJcblx0XHRcdGMgPSBcIlwiXG5cdFx0XHRpID0gMFxuXHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdGkrK1xuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XG5cblx0XHRpZiAhYWNjZXNzX3Rva2VuXG5cdFx0XHRyZXR1cm4gbnVsbDtcblxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cblxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcblxuXHRcdGlmIHVzZXJcblx0XHRcdHJldHVybiB1c2VySWRcblx0XHRlbHNlXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxuXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXG5cdFx0XHRpZiBvYmpcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxuXHRcdHJldHVybiBudWxsXG5cblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBudWxsXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cblx0XHR0cnlcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcblxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcblxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdGNhdGNoIGVcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblxuXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXG5cbm1peGluID0gKG9iaikgLT5cblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcblxuI21peGluKF9zLmV4cG9ydHMoKSlcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XG5cdFx0aWYgIWRhdGVcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxuXHRcdFx0cmV0dXJuIHRydWVcblxuXHRcdHJldHVybiBmYWxzZVxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cblx0XHRcdGlmIGkgPCBkYXlzXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcblx0XHRcdHJldHVyblxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxuXHRcdHJldHVybiBwYXJhbV9kYXRlXG5cblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7Rcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cblxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxuXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cblx0XHRqID0gMFxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gMFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXG5cdFx0XHRcdGogPSBsZW4vMlxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcblx0XHRcdGkgPSAwXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcblxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxuXHRcdFx0XHRcdGJyZWFrXG5cblx0XHRcdFx0aSsrXG5cblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IGkgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcblxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcblxuXHRcdGlmIGogPiBtYXhfaW5kZXhcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcblxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Xy5leHRlbmQgU3RlZWRvcyxcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXG5cdFx0XHRpZiBhcHBcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxuXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG5cdFx0XHRcdGlmIHVzZXJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRcdFx0aSA9IDBcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdFx0XHRpKytcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcblxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cblxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXG5cdFx0XHRpZiBpc0kxOG5cblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXG5cdFx0XHRyZXR1cm4gbG9jYWxlXG5cblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcblxuXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxuXHRcdFx0dmFsaWQgPSB0cnVlXG5cdFx0XHR1bmxlc3MgcHdkXG5cdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXG5cdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0aWYgdmFsaWRcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxuXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxuXHRkYkFwcHMgPSB7fVxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxuXHRcdFx0bW9kaWZpZWQ6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZm9yRWFjaCAoYXBwKS0+XG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXG5cblx0cmV0dXJuIGRiQXBwc1xuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxuXHRcdHJldHVybiBhdXRoVG9rZW5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdE1ldGVvci5hdXRvcnVuICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcbiNcdFx0ZWxzZVxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIG1peGluOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgbG9jYWxlKSB7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoIWxvY2FsZSkge1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgIHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIGF2YXRhclVybCwgYmFja2dyb3VuZCwgcmVmLCByZWYxLCByZWYyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChhY2NvdW50QmdCb2R5VmFsdWUudXJsKSB7XG4gICAgICBpZiAodXJsID09PSBhdmF0YXIpIHtcbiAgICAgICAgYXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXI7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChNZXRlb3IuaXNDb3Jkb3ZhID8gYXZhdGFyVXJsIDogTWV0ZW9yLmFic29sdXRlVXJsKGF2YXRhclVybCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyB1cmwgOiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKSkgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tncm91bmQgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYWRtaW4pICE9IG51bGwgPyByZWYyLmJhY2tncm91bmQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYmFja2dyb3VuZCkge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGJhY2tncm91bmQgOiBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGJhY2tncm91bmQgOiBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluID0gZnVuY3Rpb24ocmVkaXJlY3QpIHtcbiAgICB2YXIgYWNjb3VudHNVcmwsIHJlZiwgcmVmMSwgcmVmMiwgc2lnbkluVXJsO1xuICAgIGFjY291bnRzVXJsID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFjY291bnRzKSAhPSBudWxsID8gcmVmMi51cmwgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaWYgKGFjY291bnRzVXJsKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhY2NvdW50c1VybCArIFwiL2F1dGhvcml6ZT9yZWRpcmVjdF91cmk9L1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWduSW5VcmwgPSBBY2NvdW50c1RlbXBsYXRlcy5nZXRSb3V0ZVBhdGgoXCJzaWduSW5cIik7XG4gICAgICBpZiAocmVkaXJlY3QpIHtcbiAgICAgICAgaWYgKHNpZ25JblVybC5pbmRleE9mKFwiP1wiKSA+IDApIHtcbiAgICAgICAgICBzaWduSW5VcmwgKz0gXCImcmVkaXJlY3Q9XCIgKyByZWRpcmVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaWduSW5VcmwgKz0gXCI/cmVkaXJlY3Q9XCIgKyByZWRpcmVjdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIuZ28oc2lnbkluVXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZiA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWYyID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjNbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWZbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjIuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYzID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZiwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWYudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHJlYXNvbiwgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIS9cXGQrLy50ZXN0KHB3ZCkpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghL1thLXpBLVpdKy8udGVzdChwd2QpKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAocHdkLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xufSkiLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7bGFzdF9sb2dvbjogbmV3IERhdGUoKX19KSAgXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gIE1ldGVvci5tZXRob2RzXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPiAwIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1c2g6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkc2V0OiBcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICBdXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXG4gICAgICAgIHAgPSBudWxsXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICAgIHAgPSBlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVsbDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBwXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXG4gICAgICBlbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxuXG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSxcbiAgICAgICAgJHNldDpcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcbiAgICAgIHJldHVybiB7fVxuXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XG4gICAgICAgIHN3YWxcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICAgICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cbiAgICAgICAgICAgICAgICBpZiByZXN1bHQ/LmVycm9yXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3dhbCB0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIlxuIyMjXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xuXHRmcm9tOiAoZnVuY3Rpb24oKXtcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xuXHR9KSgpLFxuXHRyZXNldFBhc3N3b3JkOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgc3BsaXRzID0gdXJsLnNwbGl0KFwiL1wiKTtcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRfYm9keVwiLHt0b2tlbl9jb2RlOnRva2VuQ29kZX0sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdHZlcmlmeUVtYWlsOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHRlbnJvbGxBY2NvdW50OiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3N0YXJ0X3NlcnZpY2VcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fVxufTsiLCIvLyDkv67mlLlmdWxsbmFtZeWAvOaciemXrumimOeahG9yZ2FuaXphdGlvbnNcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICBcblx0dmFyIG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe2Z1bGxuYW1lOi/mlrDpg6jpl6gvLG5hbWU6eyRuZTpcIuaWsOmDqOmXqFwifX0pO1xuXHRpZiAob3Jncy5jb3VudCgpPjApXG5cdHtcblx0XHRvcmdzLmZvckVhY2ggKGZ1bmN0aW9uIChvcmcpXG5cdFx0e1xuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcblx0XHRcdGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZShvcmcuX2lkLCB7JHNldDoge2Z1bGxuYW1lOiBvcmcuY2FsY3VsYXRlRnVsbG5hbWUoKX19KTtcblx0XHRcdFxuXHRcdH0pO1xuXHR9XHRcblxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBcdGRhdGE6IHtcblx0ICAgICAgXHRyZXQ6IDAsXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXG4gICAgXHR9XG4gIFx0fSk7XG59KTtcblxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxuICAgICAgICAgICAgICAgIFB1c2guQ29uZmlndXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblx0XHRcdHNwYWNlcyA9IHNwYWNlcy5tYXAgKG4pIC0+IHJldHVybiBuLl9pZFxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcblx0XHRpZiBzcGFjZUlkXG5cdFx0XHRpZiBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcblx0XHRzcGFjZXMgPSBbXVxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPVxuXHRpY29uOiBcImdsb2JlXCJcblx0Y29sb3I6IFwiYmx1ZVwiXG5cdHRhYmxlQ29sdW1uczogW1xuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxuXHRcdHtuYW1lOiBcInVzZXJfY291bnRcIn0sXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfcGFpZCgpXCJ9XG5cdF1cblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cblx0cm91dGVyQWRtaW46IFwiL2FkbWluXCJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRyZXR1cm4ge31cblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXG5cdGRpc2FibGVBZGQ6IHRydWVcblx0cGFnZUxlbmd0aDogMTAwXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXG5cdEBiaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkc1xuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xuXHRcdGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWciLCIgICAgICAgICAgICAgXG5cblNlbGVjdG9yID0ge307XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGFkbWluczoge1xuICAgICAgICAgICRpbjogW3VzZXJJZF1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHNwYWNlcyA9IHNwYWNlcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZUlkLCBzcGFjZV91c2Vycywgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBpZiAoZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHUpIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh1LnNwYWNlKTtcbiAgICB9KTtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICRpbjogc3BhY2VzXG4gICAgfTtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPSB7XG4gIGljb246IFwiZ2xvYmVcIixcbiAgY29sb3I6IFwiYmx1ZVwiLFxuICB0YWJsZUNvbHVtbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJtb2R1bGVzXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcInVzZXJfY291bnRcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwiZW5kX2RhdGVcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfcGFpZCgpXCJcbiAgICB9XG4gIF0sXG4gIGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdLFxuICByb3V0ZXJBZG1pbjogXCIvYWRtaW5cIixcbiAgc2VsZWN0b3I6IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSxcbiAgc2hvd0VkaXRDb2x1bW46IGZhbHNlLFxuICBzaG93RGVsQ29sdW1uOiBmYWxzZSxcbiAgZGlzYWJsZUFkZDogdHJ1ZSxcbiAgcGFnZUxlbmd0aDogMTAwLFxuICBvcmRlcjogW1swLCBcImRlc2NcIl1dXG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdGhpcy5zcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWducztcbiAgdGhpcy5iaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3JkcztcbiAgcmV0dXJuIHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zX2FkZCh7XG4gICAgc3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZyxcbiAgICBiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnXG4gIH0pIDogdm9pZCAwO1xufSk7XG4iLCJpZiAoIVtdLmluY2x1ZGVzKSB7XG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcbiAgICB2YXIgaztcbiAgICBpZiAobiA+PSAwKSB7XG4gICAgICBrID0gbjtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbiArIG47XG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XG4gICAgfVxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBPW2tdO1xuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaysrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcblxuICBpZiAhU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlc1xuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxuICAgICAgd3d3OiBcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cblx0bGlzdFZpZXdzID0ge31cblxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXG5cblx0b2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZmV0Y2goKVxuXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXHRcdG9saXN0Vmlld3MgPSBfLmZpbHRlciBvYmplY3RzVmlld3MsIChvdiktPlxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cblx0XHRfLmVhY2ggb2xpc3RWaWV3cywgKGxpc3R2aWV3KS0+XG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRcdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XG5cdFx0bGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KVxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGxpc3RWaWV3c1xuXG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblxuXHRvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KVxuXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cblxuXG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKSB7XG4gIHZhciBfZ2V0VXNlck9iamVjdExpc3RWaWV3cywga2V5cywgbGlzdFZpZXdzLCBvYmplY3RzVmlld3M7XG4gIGxpc3RWaWV3cyA9IHt9O1xuICBrZXlzID0gXy5rZXlzKG9iamVjdHMpO1xuICBvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAkaW46IGtleXNcbiAgICB9LFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2xpc3RWaWV3cztcbiAgICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICAgIG9saXN0Vmlld3MgPSBfLmZpbHRlcihvYmplY3RzVmlld3MsIGZ1bmN0aW9uKG92KSB7XG4gICAgICByZXR1cm4gb3Yub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIF8uZWFjaChvbGlzdFZpZXdzLCBmdW5jdGlvbihsaXN0dmlldykge1xuICAgICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgICB9KTtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG4gIH07XG4gIF8uZm9yRWFjaChvYmplY3RzLCBmdW5jdGlvbihvLCBrZXkpIHtcbiAgICB2YXIgbGlzdF92aWV3O1xuICAgIGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSk7XG4gICAgaWYgKCFfLmlzRW1wdHkobGlzdF92aWV3KSkge1xuICAgICAgcmV0dXJuIGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0Vmlld3M7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2JqZWN0X2xpc3R2aWV3O1xuICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICBvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pO1xuICBvYmplY3RfbGlzdHZpZXcuZm9yRWFjaChmdW5jdGlvbihsaXN0dmlldykge1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gIH0pO1xuICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG59O1xuIiwiU2VydmVyU2Vzc2lvbiA9IChmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzZXJ2ZXJfc2Vzc2lvbnMnKTtcblxuICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XG4gIH07XG4gIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgQ29sbGVjdGlvbi5kZW55KHtcbiAgICAnaW5zZXJ0JzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAndXBkYXRlJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgJ3JlbW92ZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxuICB2YXIgYXBpID0ge1xuICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XG4gICAgICB2YXIgc2Vzc2lvbk9iaiA9IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xuICAgICAgfVxuICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbiAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG4gICAgICByZXR1cm4gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG4gICAgfSxcbiAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xuICAgICAgdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG5cbiAgICAgIHZhciB2YWx1ZSA9IGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuXG4gICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIF8odmFsdWUpLmlzRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWRlbnRpY2FsID09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcbiAgICAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKCdzZXJ2ZXItc2Vzc2lvbicpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XG4gICAgLy8gICAgIENvbGxlY3Rpb24ucmVtb3ZlKHt9KTsgLy8gY2xlYXIgb3V0IGFsbCBzdGFsZSBzZXNzaW9uc1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuXG4gICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xuICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcblxuICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xuICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuICAgIH0pO1xuXG4gICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgJ3NlcnZlci1zZXNzaW9uL2dldCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbiAgICAgIH0sXG4gICAgICAnc2VydmVyLXNlc3Npb24vc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcblxuICAgICAgICBjaGVja0ZvcktleShrZXkpO1xuXG4gICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ0ZhaWxlZCBjb25kaXRpb24gdmFsaWRhdGlvbi4nKTtcblxuICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XG4gICAgICAgIHVwZGF0ZU9ialsndmFsdWVzLicgKyBrZXldID0gdmFsdWU7XG5cbiAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XG4gICAgICB9XG4gICAgfSk7ICBcblxuICAgIC8vIHNlcnZlci1vbmx5IGFwaVxuICAgIF8uZXh0ZW5kKGFwaSwge1xuICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9zZXQnLCBrZXksIHZhbHVlKTsgICAgICAgICAgXG4gICAgICB9LFxuICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcbiAgICAgICAgY29uZGl0aW9uID0gbmV3Q29uZGl0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGFwaTtcbn0pKCk7IiwiSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2dldC9hcHBzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXG5cblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXG5cblx0XHR1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpXG5cdFx0XG5cdFx0aWYgIXVzZXJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdHJldHVybjtcblxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxuXG5cdFx0IyDmoKHpqoxzcGFjZeaYr+WQpuWtmOWcqFxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cblx0XHRsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcl9pZH0pLmxvY2FsZVxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXG5cdFx0c3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcl9pZH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKVxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxuXG5cdFx0YXBwcy5mb3JFYWNoIChhcHApIC0+XG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cblx0XG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2dldC9hcHBzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcHMsIGUsIGxvY2FsZSwgcmVmLCByZWYxLCBzcGFjZV9pZCwgc3BhY2VzLCB1c2VyLCB1c2VyX2lkO1xuICB0cnkge1xuICAgIHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgKChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcklkIDogdm9pZCAwKTtcbiAgICBzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICB1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgICBsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pLmxvY2FsZTtcbiAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICB9XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgfVxuICAgIHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcl9pZFxuICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKTtcbiAgICBhcHBzID0gZGIuYXBwcy5maW5kKHtcbiAgICAgICRvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgICByZXR1cm4gYXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLCB7fSwgbG9jYWxlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICBkYXRhOiBhcHBzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuICAgICAgICBpZiByZXEuYm9keVxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgICAgICBkYXRhID0gW107XG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsIHNwYWNlOiBzcGFjZX0pXG4gICAgICAgIFxuICAgICAgICBpZiAhc3BhY2VfdXNlclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAhZGJbbW9kZWxdXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogW107XG5cblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuICAgICAgICBpZiByZXEuYm9keVxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgICAgICBkYXRhID0gW107XG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcbiAgICAgICAgXG4gICAgICAgIGlmICFzcGFjZV91c2VyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWRcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcbiAgICAgICAgXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YTtcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHt9IiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghKHVzZXJJZCAmJiBhdXRoVG9rZW4pKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAobW9kZWwgPT09ICdtYWlsX2FjY291bnRzJykge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0YXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKVxuXHRpZiBhcHBcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cdFx0cmVkaXJlY3RVcmwgPSBhcHAudXJsXG5cdGVsc2Vcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybFxuXG5cdGlmICFyZWRpcmVjdFVybFxuXHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0cmVzLmVuZCgpXG5cdFx0cmV0dXJuXG5cblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXG5cdCMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XG5cdCMgaWYgcmVxLmJvZHlcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXG5cdCMgXHRhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxuXHQjIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHQjIFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0aWYgIXVzZXJJZCBhbmQgIWF1dGhUb2tlblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdGlmIHVzZXJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0IyBkZXMtY2JjXG5cdFx0XHRkZXNfaXYgPSBcIi04NzYyLWZjXCJcblx0XHRcdGtleTggPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgOFxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gOCAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSA4XG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsOClcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxuXHRcdFx0ZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKVxuXHRcdFx0ZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdGpvaW5lciA9IFwiP1wiXG5cblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdFx0am9pbmVyID0gXCImXCJcblxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXG5cblx0XHRcdGlmIHVzZXIudXNlcm5hbWVcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHJldHVybnVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0cmVzLndyaXRlSGVhZCA0MDFcblx0cmVzLmVuZCgpXG5cdHJldHVyblxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0XHQjIHRoaXMucGFyYW1zID1cblx0XHQjIFx0dXNlcklkOiBkZWNvZGVVUkkocmVxLnVybCkucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcblx0XHR3aWR0aCA9IDUwIDtcblx0XHRoZWlnaHQgPSA1MCA7XG5cdFx0Zm9udFNpemUgPSAyOCA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lndcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lmhcblx0XHQgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5LmggO1xuXHRcdGlmIHJlcS5xdWVyeS5mc1xuICAgICAgICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnMgO1xuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHRcdFx0PHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuXHRcdFx0XHRcdC5zdDB7ZmlsbDojRkZGRkZGO31cblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcblx0XHRcdFx0XHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcIi8+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxuXHRcdFx0XHRcdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XCIvPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblx0XHRcdHJlcy53cml0ZSBzdmdcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHVzZXJuYW1lID0gdXNlci5uYW1lO1xuXHRcdGlmICF1c2VybmFtZVxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXG5cblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxuXG5cdFx0XHR1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XG5cdFx0XHRcdGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcblxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcblx0XHRcdGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcblxuXHRcdFx0aW5pdGlhbHMgPSAnJ1xuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcblxuXHRcdFx0aW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXG5cblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0PD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XG5cdFx0XHRcdFx0I3tpbml0aWFsc31cblx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcblx0XHRcdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XG5cdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuXHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcblxuXHRcdGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXG5cblx0XHRpZiBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgYWNjZXNzX3Rva2VuLCByZWY7XG4gICAgYWNjZXNzX3Rva2VuID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbikpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gICAgICAgIFxuXG4gICAgICAgIHNlbGVjdG9yID0ge3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fVxuICAgICAgICBpZiBzcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXG5cblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cblx0TWV0ZW9yLnB1Ymxpc2ggJ215X3NwYWNlcycsIC0+XG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblxuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHVzZXJTcGFjZXMgPSBbXVxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XG5cdFx0XHR1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpXG5cblx0XHRoYW5kbGUyID0gbnVsbFxuXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXG5cdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0aWYgZG9jLnNwYWNlXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXG5cdFx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKVxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRpZiBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXG5cblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuYWRkZWQgXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jO1xuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VkIFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYztcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZClcblxuXHRcdG9ic2VydmVTcGFjZXMoKTtcblxuXHRcdHNlbGYucmVhZHkoKTtcblxuXHRcdHNlbGYub25TdG9wIC0+XG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cblx0dW5sZXNzIHNwYWNlSWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7YXZhdGFyOiAxLG5hbWU6IDEsZW5hYmxlX3JlZ2lzdGVyOjF9fSk7XG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHR1bmxlc3MgX2lkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe19pZDogX2lkfSk7IiwiTWV0ZW9yLnB1Ymxpc2goJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIGZ1bmN0aW9uKF9pZCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIV9pZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7XG4gICAgX2lkOiBfaWRcbiAgfSk7XG59KTtcbiIsInN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsKHJlcSwgcmVzLCBuZXh0KS0+XG5cdHVzZXJJZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXVxuXHRzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucGFyYW1zPy5zcGFjZUlkXG5cdGlmICF1c2VySWRcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogNDAzLFxuXHRcdFx0ZGF0YTogbnVsbFxuXHRcdHJldHVyblxuXG5cdFVTRVJfQ09OVEVYVCA9IENyZWF0b3IuZ2V0VXNlckNvbnRleHQodXNlcklkLCBzcGFjZUlkLCB0cnVlKVxuXHR1bmxlc3MgVVNFUl9DT05URVhUXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDUwMCxcblx0XHRcdGRhdGE6IG51bGxcblx0XHRyZXR1cm5cblxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge25hbWU6IDF9fSlcblxuXHRyZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZClcblx0cmVzdWx0LlVTRVJfQ09OVEVYVCA9IFVTRVJfQ09OVEVYVFxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxuXHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHNcblx0cmVzdWx0Lm9iamVjdF9saXN0dmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgcmVzdWx0Lm9iamVjdHMpXG5cdHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwgJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkXG5cblx0YXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpXG5cblx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XG5cdFx0XHRzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XG5cdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcblxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxuXHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxuXHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XG5cdFx0aWYgbmFtZSAhPSAnZGVmYXVsdCdcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcblx0XHRcdF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgKHYsIGspLT5cblx0XHRcdFx0X29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdCh2LnRvQ29uZmlnKCkpXG4jXHRcdFx0XHRfb2JqLm5hbWUgPSBcIiN7bmFtZX0uI3trfVwiXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcblx0XHRcdFx0X29iai5kYXRhYmFzZV9uYW1lID0gbmFtZVxuXHRcdFx0XHRfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXG5cdFx0XHQpXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKClcblxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdGNvZGU6IDIwMCxcblx0XHRkYXRhOiByZXN1bHRcbiIsInZhciBzdGVlZG9zQXV0aDtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgYXV0aFRva2VuLCBwZXJtaXNzaW9ucywgcmVmLCByZXN1bHQsIHNwYWNlLCBzcGFjZUlkLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ107XG4gIHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDMsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIFVTRVJfQ09OVEVYVCA9IENyZWF0b3IuZ2V0VXNlckNvbnRleHQodXNlcklkLCBzcGFjZUlkLCB0cnVlKTtcbiAgaWYgKCFVU0VSX0NPTlRFWFQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA1MDAsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcbiAgcmVzdWx0LlVTRVJfQ09OVEVYVCA9IFVTRVJfQ09OVEVYVDtcbiAgcmVzdWx0LnNwYWNlID0gc3BhY2U7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQoQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCksIENyZWF0b3IuQXBwcyk7XG4gIHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCgnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gIHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbih2LCB1c2VyU2Vzc2lvbiwgY2IpIHtcbiAgICByZXR1cm4gdi5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIGRhdGFzb3VyY2VPYmplY3RzO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKCk7XG4gICAgICByZXR1cm4gXy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHZhciBfb2JqO1xuICAgICAgICBfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KHYudG9Db25maWcoKSk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJldHVybiByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKHJlc3VsdC5hcHBzLCBkYXRhc291cmNlLmdldEFwcHNDb25maWcoKSk7XG4gIH0pO1xuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XG5cdHRyeVxuXHRcdGJvZHkgPSBcIlwiXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XG5cdFx0XHRib2R5ICs9IGNodW5rXG5cdFx0KVxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxuXHRcdFx0XHR4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKVxuXHRcdFx0XHRwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7IHRyaW06dHJ1ZSwgZXhwbGljaXRBcnJheTpmYWxzZSwgZXhwbGljaXRSb290OmZhbHNlIH0pXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cblx0XHRcdFx0XHRcdCMg54m55Yir5o+Q6YaS77ya5ZWG5oi357O757uf5a+55LqO5pSv5LuY57uT5p6c6YCa55+l55qE5YaF5a655LiA5a6a6KaB5YGa562+5ZCN6aqM6K+BLOW5tuagoemqjOi/lOWbnueahOiuouWNlemHkemineaYr+WQpuS4juWVhuaIt+S+p+eahOiuouWNlemHkemineS4gOiHtO+8jOmYsuatouaVsOaNruazhOa8j+WvvOiHtOWHuueOsOKAnOWBh+mAmuefpeKAne+8jOmAoOaIkOi1hOmHkeaNn+WksVxuXHRcdFx0XHRcdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jylcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xuXHRcdFx0XHRcdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG5cdFx0XHRcdFx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSlcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcblx0XHRcdFx0XHRcdGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkXG5cdFx0XHRcdFx0XHRicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXG5cdFx0XHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtfaWQ6IGNvZGVfdXJsX2lkfSwgeyRzZXQ6IHtwYWlkOiB0cnVlfX0pXG5cdFx0XHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdClcblx0XHRcdCksIChlcnIpLT5cblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50J1xuXHRcdFx0KVxuXHRcdClcblx0XHRcblx0Y2F0Y2ggZVxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdHJlcy53cml0ZUhlYWQoMjAwLCB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnfSlcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcblxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm9keSwgZTtcbiAgdHJ5IHtcbiAgICBib2R5ID0gXCJcIjtcbiAgICByZXEub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgcmV0dXJuIGJvZHkgKz0gY2h1bms7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXJzZXIsIHhtbDJqcztcbiAgICAgIHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuICAgICAgcGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoe1xuICAgICAgICB0cmltOiB0cnVlLFxuICAgICAgICBleHBsaWNpdEFycmF5OiBmYWxzZSxcbiAgICAgICAgZXhwbGljaXRSb290OiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlU3RyaW5nKGJvZHksIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBXWFBheSwgYXR0YWNoLCBicHIsIGNvZGVfdXJsX2lkLCBzaWduLCB3eHBheTtcbiAgICAgICAgV1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jyk7XG4gICAgICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgICAgICBtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcbiAgICAgICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICAgICAgfSk7XG4gICAgICAgIHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSk7XG4gICAgICAgIGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaCk7XG4gICAgICAgIGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkO1xuICAgICAgICBicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpO1xuICAgICAgICBpZiAoYnByICYmIGJwci50b3RhbF9mZWUgPT09IE51bWJlcihyZXN1bHQudG90YWxfZmVlKSAmJiBzaWduID09PSByZXN1bHQuc2lnbikge1xuICAgICAgICAgIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogY29kZV91cmxfaWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gIH1cbiAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCdcbiAgfSk7XG4gIHJldHVybiByZXMuZW5kKCc8eG1sPjxyZXR1cm5fY29kZT48IVtDREFUQVtTVUNDRVNTXV0+PC9yZXR1cm5fY29kZT48L3htbD4nKTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4unRydWXooajnpLrpmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4fojIPlm7TvvIxvcmdhbml6YXRpb25z5YC86K6w5b2V6aKd5aSW55qE57uE57uH6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xuXHRcdGNoZWNrIHNwYWNlLCBTdHJpbmdcblx0XHRyZVZhbHVlID1cblx0XHRcdGlzTGltaXQ6IHRydWVcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cblx0XHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRcdHJldHVybiByZVZhbHVlXG5cdFx0aXNMaW1pdCA9IGZhbHNlXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXG5cdFx0bGltaXRzID0gc2V0dGluZz8udmFsdWVzIHx8IFtdO1xuXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxuXHRcdFx0bXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHVzZXJzOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblx0XHRcdHVubGVzcyBteU9yZ0lkcy5sZW5ndGhcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRcdFxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBbXVxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXG5cdFx0XHRcdHRvcyA9IGxpbWl0LnRvc1xuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxuXHRcdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0XHRpZiBmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGlmIGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XG5cdFx0XHRcdFx0XHRpc0xpbWl0ID0gdHJ1ZVxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcblxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHQjIOWmguaenOWPl+mZkOeahOe7hOe7h+S4quaVsOWwj+S6jueUqOaIt+aJgOWxnue7hOe7h+eahOS4quaVsO+8jOWImeivtOaYjuW9k+WJjeeUqOaIt+iHs+WwkeacieS4gOS4que7hOe7h+aYr+S4jeWPl+mZkOeahFxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cblx0XHRcdGVsc2Vcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcblxuXHRcdGlmIGlzTGltaXRcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ5bGe5LqO55So5oi35omA5bGe57uE57uH55qE5a2Q5a2Z6IqC54K555qE6IqC54K55Yig6ZmkXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSBhbmQgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDFcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxuXHRcdFx0XHRyZXR1cm4gbi5faWRcblxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXHRcdHJldHVybiByZVZhbHVlXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgICBjaGVjayhrZXksIFN0cmluZyk7XG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xuXG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xuICAgICAgICBvYmoua2V5ID0ga2V5O1xuICAgICAgICBvYmoudmFsdWUgPSB2YWx1ZTtcblxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xuICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICBpZiAoYyA+IDApIHtcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59KSIsIk1ldGVvci5tZXRob2RzXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XG5cdFx0Y2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKVxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpXG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXG5cdFx0XHRyZXR1cm5cblxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcblx0XHRzcGFjZXMgPSBbXVxuXHRcdGlmIHNwYWNlX2lkXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRlbHNlXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcblx0XHRyZXN1bHQgPSBbXVxuXHRcdHNwYWNlcy5mb3JFYWNoIChzKSAtPlxuXHRcdFx0dHJ5XG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXG5cdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0ZSA9IHt9XG5cdFx0XHRcdGUuX2lkID0gcy5faWRcblx0XHRcdFx0ZS5uYW1lID0gcy5uYW1lXG5cdFx0XHRcdGUuZXJyID0gZXJyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcblx0XHRpZiByZXN1bHQubGVuZ3RoID4gMFxuXHRcdFx0Y29uc29sZS5lcnJvciByZXN1bHRcblx0XHRcdHRyeVxuXHRcdFx0XHRFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWxcblx0XHRcdFx0RW1haWwuc2VuZFxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcblx0XHRcdFx0XHRmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tXG5cdFx0XHRcdFx0c3ViamVjdDogJ2JpbGxpbmcgc2V0dGxldXAgcmVzdWx0J1xuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXG5cdFx0XHRjYXRjaCBlcnJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuXG5cdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpIGFuZCB1c2VyX2lkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxuXG5cdFx0aWYgbm90IE1ldGVvci51c2VySWQoKVxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXG5cblx0XHR1bmxlc3MgdXNlcl9pZFxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXG5cblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIilcblxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcblxuXHRcdHJldHVybiB1c2VybmFtZVxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0YmlsbGluZ19yZWNoYXJnZTogKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZyBcblx0XHRjaGVjayBuZXdfaWQsIFN0cmluZyBcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxuXHRcdGNoZWNrIGVuZF9kYXRlLCBTdHJpbmcgXG5cdFx0Y2hlY2sgdXNlcl9jb3VudCwgTnVtYmVyIFxuXG5cdFx0dXNlcl9pZCA9IHRoaXMudXNlcklkXG5cblx0XHRsaXN0cHJpY2VzID0gMFxuXHRcdG9yZGVyX2JvZHkgPSBbXVxuXHRcdGRiLm1vZHVsZXMuZmluZCh7bmFtZTogeyRpbjogbW9kdWxlX25hbWVzfX0pLmZvckVhY2ggKG0pLT5cblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXG5cdFx0XHRvcmRlcl9ib2R5LnB1c2ggbS5uYW1lX3poXG5cblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxuXHRcdGlmIG5vdCBzcGFjZS5pc19wYWlkXG5cdFx0XHRzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXG5cdFx0XHRpZiB0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbioxMDBcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciAnZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6Uje29uZV9tb250aF95dWFufVwiXG5cblx0XHRyZXN1bHRfb2JqID0ge31cblxuXHRcdGF0dGFjaCA9IHt9XG5cdFx0YXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkXG5cdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5JylcblxuXHRcdHd4cGF5ID0gV1hQYXkoe1xuXHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG5cdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxuXHRcdH0pXG5cblx0XHR3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuXHRcdFx0Ym9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuXHRcdFx0dG90YWxfZmVlOiB0b3RhbF9mZWUsXG5cdFx0XHRzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG5cdFx0XHR0cmFkZV90eXBlOiAnTkFUSVZFJyxcblx0XHRcdHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuXHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKChlcnIsIHJlc3VsdCkgLT4gXG5cdFx0XHRcdGlmIGVyciBcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xuXHRcdFx0XHRpZiByZXN1bHRcblx0XHRcdFx0XHRvYmogPSB7fVxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcblx0XHRcdFx0XHRvYmouY3JlYXRlZCA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0b2JqLmluZm8gPSByZXN1bHRcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXG5cdFx0XHRcdFx0b2JqLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXG5cdFx0XHRcdFx0b2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcblx0XHRcdFx0XHRvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxuXHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iailcblx0XHRcdCksICgpLT5cblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50J1xuXHRcdFx0KVxuXHRcdClcblxuXHRcdFxuXHRcdHJldHVybiBcInN1Y2Nlc3NcIiIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19yZWNoYXJnZTogZnVuY3Rpb24odG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gICAgdmFyIFdYUGF5LCBhdHRhY2gsIGxpc3RwcmljZXMsIG9uZV9tb250aF95dWFuLCBvcmRlcl9ib2R5LCByZXN1bHRfb2JqLCBzcGFjZSwgc3BhY2VfdXNlcl9jb3VudCwgdXNlcl9pZCwgd3hwYXk7XG4gICAgY2hlY2sodG90YWxfZmVlLCBOdW1iZXIpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG5ld19pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhtb2R1bGVfbmFtZXMsIEFycmF5KTtcbiAgICBjaGVjayhlbmRfZGF0ZSwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VyX2NvdW50LCBOdW1iZXIpO1xuICAgIHVzZXJfaWQgPSB0aGlzLnVzZXJJZDtcbiAgICBsaXN0cHJpY2VzID0gMDtcbiAgICBvcmRlcl9ib2R5ID0gW107XG4gICAgZGIubW9kdWxlcy5maW5kKHtcbiAgICAgIG5hbWU6IHtcbiAgICAgICAgJGluOiBtb2R1bGVfbmFtZXNcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICAgIGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iO1xuICAgICAgcmV0dXJuIG9yZGVyX2JvZHkucHVzaChtLm5hbWVfemgpO1xuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UuaXNfcGFpZCkge1xuICAgICAgc3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgICBvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzO1xuICAgICAgaWYgKHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuICogMTAwKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lXCIgKyBvbmVfbW9udGhfeXVhbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdF9vYmogPSB7fTtcbiAgICBhdHRhY2ggPSB7fTtcbiAgICBhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWQ7XG4gICAgV1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jyk7XG4gICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICBtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcbiAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgIH0pO1xuICAgIHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XG4gICAgICBib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxuICAgICAgb3V0X3RyYWRlX25vOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICB0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcbiAgICAgIHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxuICAgICAgbm90aWZ5X3VybDogTWV0ZW9yLmFic29sdXRlVXJsKCkgKyAnYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JyxcbiAgICAgIHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxuICAgICAgcHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgYXR0YWNoOiBKU09OLnN0cmluZ2lmeShhdHRhY2gpXG4gICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgb2JqID0ge307XG4gICAgICAgIG9iai5faWQgPSBuZXdfaWQ7XG4gICAgICAgIG9iai5jcmVhdGVkID0gbmV3IERhdGU7XG4gICAgICAgIG9iai5pbmZvID0gcmVzdWx0O1xuICAgICAgICBvYmoudG90YWxfZmVlID0gdG90YWxfZmVlO1xuICAgICAgICBvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gICAgICAgIG9iai5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgICBvYmoucGFpZCA9IGZhbHNlO1xuICAgICAgICBvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgICAgICAgb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgIG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgICAgICAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iaik7XG4gICAgICB9XG4gICAgfSksIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCcpO1xuICAgIH0pKTtcbiAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXG5cblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXG5cblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xuXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXG5cbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXG5cbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSB9IH0pXG4gICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcbiAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXG5cbiAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcbiAgICAgICAgICAgIGlmIHBlcm1zXG4gICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBwZXJtczogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgIGlmIChwZXJtcykge1xuICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cblxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0Y291bnRfZGF5cyA9IDBcblxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxuXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXG5cblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxuXHRcdCMgZG8gbm90aGluZ1xuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxuXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cblx0bGFzdF9iaWxsID0gbnVsbFxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxuXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0Y3JlYXRlZDoge1xuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxuXHRcdFx0fSxcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0aWYgcGF5bWVudF9iaWxsXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXG5cdGVsc2Vcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcblxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0XHRpZiBhcHBfYmlsbFxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcblxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcblx0c2V0T2JqID0gbmV3IE9iamVjdFxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxuXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0bm93ID0gbmV3IERhdGVcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2Vcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcblx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHR7XG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cblx0XHR9XG5cdCkuZm9yRWFjaCAoYmlsbCktPlxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXG5cblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRtb2R1bGVzID0gbmV3IEFycmF5XG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y3JlYXRlZDogLTFcblx0XHRcdH1cblx0XHQpXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcblx0XHRcdCMgIGRvIG5vdGhpbmdcblxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxuXHRcdFx0IyAgZG8gbm90aGluZ1xuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cblx0cmV0dXJuIG1vZHVsZXNcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXG5cdClcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxuXG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdHJldHVyblxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRkZWJpdHMgPSAwXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdFx0e1xuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpLmZvckVhY2goKGIpLT5cblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xuXHRcdClcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2Vcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxuXHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRpZiBkZWJpdHMgPiAwXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXG5cblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcblx0XHRcdHtcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRlbHNlXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXG5cblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXG5cblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XG5cblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxuXG5cdG0gPSBtb21lbnQoKVxuXHRub3cgPSBtLl9kXG5cblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcblxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0IyDmm7TmlrBtb2R1bGVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXG5cdGlmIHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cblx0XHRcdG1jbCA9IG5ldyBPYmplY3Rcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxuXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcblxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XG5cbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XG5cbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghZ29fbmV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xuXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHJldHVybiBkYXRla2V5O1xuICAgICAgfTtcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xuICAgICAgfTtcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oC75pWwXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xuICAgICAgICAgIHJldHVybiBtb2Q7XG4gICAgICB9O1xuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KSAgXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5o+S5YWl5pWw5o2uXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RlZWRvczp7XG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmtmbG93OntcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY21zOiB7XG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcblxuICAgICAgZ29fbmV4dCA9IHRydWU7XG5cbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcbiAgICB9KSk7XG5cbiAgfVxuXG59KVxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDFcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXG4gICAgICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMlxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDNcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogNFxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNVxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRcdHRyeVxuXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIGlzX2NvbXBhbnk6IHRydWUsIHBhcmVudDogbnVsbH0pXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcblx0XHRcdFx0XHRcdFx0XHRpZiByXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIGlzX2NvbXBhbnk6IHRydWUsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDZcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdFx0dHJ5XG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovmoIflh4bniYhcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxuXHRcdFx0XHR9KVxuXG5cblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2Vcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+agh+WHhueJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5taWdyYXRlVG8gJ2xhdGVzdCdcblx0IyBNZXRlb3IuZGVmZXIgLT5cblx0IyBcdGlmIE1pZ3JhdGlvbnMuZ2V0VmVyc2lvbigpIGlzbnQgMFxuXHQjIFx0XHRNaWdyYXRpb25zLm1pZ3JhdGVUbyAnbGF0ZXN0J1xuXHQjIFx0ZWxzZVxuXHQjIFx0XHRjb250cm9sID0gTWlncmF0aW9ucy5fZ2V0Q29udHJvbCgpXG5cdCMgXHRcdGNvbnRyb2wudmVyc2lvbiA9IF8ubGFzdChNaWdyYXRpb25zLl9saXN0KS52ZXJzaW9uXG5cdCMgXHRcdE1pZ3JhdGlvbnMuX3NldENvbnRyb2wgY29udHJvbFxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLm1pZ3JhdGVUbygnbGF0ZXN0Jyk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cblx0bmV3IFRhYnVsYXIuVGFibGVcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG5cdFx0Y29sbGVjdGlvbjogZGIuYXBwcyxcblx0XHRjb2x1bW5zOiBbXG5cdFx0XHR7XG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2Vcblx0XHRcdH1cblx0XHRdXG5cdFx0ZG9tOiBcInRwXCJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlXG5cdFx0b3JkZXJpbmc6IGZhbHNlXG5cdFx0cGFnZUxlbmd0aDogMTBcblx0XHRpbmZvOiBmYWxzZVxuXHRcdHNlYXJjaGluZzogdHJ1ZVxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cblx0XHRcdHVubGVzcyB1c2VySWRcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuICAgIGNvbGxlY3Rpb246IGRiLmFwcHMsXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdLFxuICAgIGxlbmd0aENoYW5nZTogZmFsc2UsXG4gICAgb3JkZXJpbmc6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwLFxuICAgIGluZm86IGZhbHNlLFxuICAgIHNlYXJjaGluZzogdHJ1ZSxcbiAgICBhdXRvV2lkdGg6IHRydWUsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
