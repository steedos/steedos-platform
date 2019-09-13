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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMveHJ1bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy94cnVuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiTW9uZ28iLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsImlnbm9yZVVuZGVmaW5lZCIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsInJlZyIsIlJlZ0V4cCIsInRlc3QiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzQ2xpZW50Iiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwiYXZhdGFyVXJsIiwiYmFja2dyb3VuZCIsInJlZjIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiJCIsImNzcyIsImlzQ29yZG92YSIsImFic29sdXRlVXJsIiwiYWRtaW4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImdldCIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsInJlZGlyZWN0VG9TaWduSW4iLCJyZWRpcmVjdCIsImFjY291bnRzVXJsIiwic2lnbkluVXJsIiwid2Vic2VydmljZXMiLCJhY2NvdW50cyIsImhyZWYiLCJBY2NvdW50c1RlbXBsYXRlcyIsImdldFJvdXRlUGF0aCIsIkZsb3dSb3V0ZXIiLCJnbyIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsImVycm9yMSIsImNvbnNvbGUiLCJtZXNzYWdlIiwic3RhY2siLCJzZXQiLCJjaGVja1NwYWNlQmFsYW5jZSIsInNwYWNlSWQiLCJlbmRfZGF0ZSIsIm1pbl9tb250aHMiLCJzcGFjZSIsImlzU3BhY2VBZG1pbiIsInNwYWNlcyIsImlzX3BhaWQiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsIm1hdGNoIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiYWRtaW5zIiwiaXNMZWdhbFZlcnNpb24iLCJhcHBfdmVyc2lvbiIsImNoZWNrIiwibW9kdWxlcyIsImlzT3JnQWRtaW5CeU9yZ0lkcyIsIm9yZ0lkcyIsImFsbG93QWNjZXNzT3JncyIsImlzT3JnQWRtaW4iLCJ1c2VPcmdzIiwiZmlsdGVyIiwib3JnIiwidW5pcSIsImlzT3JnQWRtaW5CeUFsbE9yZ0lkcyIsImkiLCJyb290X3VybCIsIlVSTCIsInBhdGhuYW1lIiwiZ2V0QVBJTG9naW5Vc2VyIiwicmVxIiwicmVzIiwicGFzc3dvcmQiLCJyZWYzIiwicmVzdWx0IiwidXNlcm5hbWUiLCJxdWVyeSIsInVzZXJzIiwic3RlZWRvc19pZCIsIl9jaGVja1Bhc3N3b3JkIiwiRXJyb3IiLCJjaGVja0F1dGhUb2tlbiIsImhlYWRlcnMiLCJoYXNoZWRUb2tlbiIsIl9oYXNoTG9naW5Ub2tlbiIsImRlY3J5cHQiLCJpdiIsImMiLCJkZWNpcGhlciIsImRlY2lwaGVyTXNnIiwia2V5MzIiLCJsZW4iLCJjcmVhdGVEZWNpcGhlcml2IiwiQnVmZmVyIiwiY29uY2F0IiwidXBkYXRlIiwiZmluYWwiLCJlbmNyeXB0IiwiY2lwaGVyIiwiY2lwaGVyZWRNc2ciLCJjcmVhdGVDaXBoZXJpdiIsImdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiIsImFjY2Vzc190b2tlbiIsImNvbGxlY3Rpb24iLCJvYmoiLCJzcGxpdCIsIm9BdXRoMlNlcnZlciIsImNvbGxlY3Rpb25zIiwiYWNjZXNzVG9rZW4iLCJleHBpcmVzIiwiZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiIsIkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2siLCJKc29uUm91dGVzIiwic2VuZFJlc3VsdCIsImRhdGEiLCJjb2RlIiwiZnVuY3Rpb25zIiwiZnVuYyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiTnVtYmVyIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicmVhc29uIiwidmFsaWQiLCJjb252ZXJ0U3BlY2lhbENoYXJhY3RlciIsInJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIiLCJDcmVhdG9yIiwiZ2V0REJBcHBzIiwic3BhY2VfaWQiLCJkYkFwcHMiLCJDb2xsZWN0aW9ucyIsImlzX2NyZWF0b3IiLCJ2aXNpYmxlIiwiY3JlYXRlZCIsImNyZWF0ZWRfYnkiLCJtb2RpZmllZCIsIm1vZGlmaWVkX2J5IiwiZ2V0QXV0aFRva2VuIiwiYXV0aG9yaXphdGlvbiIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwiU2VydmVyU2Vzc2lvbiIsIkNvbGxlY3Rpb24iLCJjaGVja0ZvcktleSIsImdldFNlc3Npb25WYWx1ZSIsInZhbHVlcyIsImNvbmRpdGlvbiIsImRlbnkiLCJhcGkiLCJsb2ciLCJzZXNzaW9uT2JqIiwiZXhwZWN0ZWQiLCJpZGVudGljYWwiLCJpc09iamVjdCIsImlzRXF1YWwiLCJzdWJzY3JpYmUiLCJvbkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY2xpZW50SUQiLCJpZCIsImluc2VydCIsIm9uQ2xvc2UiLCJwdWJsaXNoIiwicmFuZG9tU2VlZCIsInVwZGF0ZU9iaiIsIm5ld0NvbmRpdGlvbiIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwic3RlZWRvc0F1dGgiLCJVU0VSX0NPTlRFWFQiLCJwZXJtaXNzaW9ucyIsInVzZXJTZXNzaW9uIiwiZ2V0VXNlckNvbnRleHQiLCJnZXRBbGxQZXJtaXNzaW9ucyIsIkFwcHMiLCJvYmplY3RfbGlzdHZpZXdzIiwib2JqZWN0X3dvcmtmbG93cyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0VXNlck9iamVjdFBlcm1pc3Npb24iLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwiZGF0YXNvdXJjZU9iamVjdHMiLCJnZXRPYmplY3RzIiwiX29iaiIsImNvbnZlcnRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJnZXRBcHBzQ29uZmlnIiwib24iLCJjaHVuayIsImJpbmRFbnZpcm9ubWVudCIsInBhcnNlciIsInhtbDJqcyIsIlBhcnNlciIsImV4cGxpY2l0QXJyYXkiLCJleHBsaWNpdFJvb3QiLCJwYXJzZVN0cmluZyIsImVyciIsIldYUGF5IiwiYXR0YWNoIiwiYnByIiwiY29kZV91cmxfaWQiLCJzaWduIiwid3hwYXkiLCJhcHBpZCIsIm1jaF9pZCIsInBhcnRuZXJfa2V5IiwiY2xvbmUiLCJ0b3RhbF9mZWUiLCJiaWxsaW5nTWFuYWdlciIsInNwZWNpYWxfcGF5IiwidXNlcl9jb3VudCIsImdldF9jb250YWN0c19saW1pdCIsImZyb21zIiwiZnJvbXNDaGlsZHJlbiIsImZyb21zQ2hpbGRyZW5JZHMiLCJpc0xpbWl0IiwibGVuMSIsImxpbWl0IiwibGltaXRzIiwibXlMaXRtaXRPcmdJZHMiLCJteU9yZ0lkIiwibXlPcmdJZHMiLCJteU9yZ3MiLCJvdXRzaWRlX29yZ2FuaXphdGlvbnMiLCJzZXR0aW5nIiwidGVtcElzTGltaXQiLCJ0b09yZ3MiLCJ0b3MiLCJTdHJpbmciLCJzcGFjZV9zZXR0aW5ncyIsImludGVyc2VjdGlvbiIsInNldEtleVZhbHVlIiwiYmlsbGluZ19zZXR0bGV1cCIsImFjY291bnRpbmdfbW9udGgiLCJFbWFpbCIsInRpbWUiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5IiwidGltZUVuZCIsInNldFVzZXJuYW1lIiwic3BhY2VVc2VyIiwiaW52aXRlX3N0YXRlIiwiYmlsbGluZ19yZWNoYXJnZSIsIm5ld19pZCIsIm1vZHVsZV9uYW1lcyIsImxpc3RwcmljZXMiLCJvbmVfbW9udGhfeXVhbiIsIm9yZGVyX2JvZHkiLCJyZXN1bHRfb2JqIiwic3BhY2VfdXNlcl9jb3VudCIsImxpc3RwcmljZV9ybWIiLCJuYW1lX3poIiwiY3JlYXRlVW5pZmllZE9yZGVyIiwiam9pbiIsIm91dF90cmFkZV9ubyIsIm1vbWVudCIsImZvcm1hdCIsInNwYmlsbF9jcmVhdGVfaXAiLCJub3RpZnlfdXJsIiwidHJhZGVfdHlwZSIsInByb2R1Y3RfaWQiLCJpbmZvIiwiZ2V0X3NwYWNlX3VzZXJfY291bnQiLCJ1c2VyX2NvdW50X2luZm8iLCJ0b3RhbF91c2VyX2NvdW50IiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImNyZWF0ZV9zZWNyZXQiLCJyZW1vdmVfc2VjcmV0IiwidG9rZW4iLCJjdXJTcGFjZVVzZXIiLCJvd3MiLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsInRvRml4ZWQiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJwYXJlbnQiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsIm1pZ3JhdGVUbyIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsInNlYXJjaGluZyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwiJGFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7QUFHckJILGdCQUFnQixDQUFDO0FBQ2hCLG1CQUFpQixRQUREO0FBRWhCSSxTQUFPLEVBQUUsUUFGTztBQUdoQixZQUFVLFNBSE07QUFJaEJDLFFBQU0sRUFBRSxRQUpRO0FBS2hCLGdCQUFjO0FBTEUsQ0FBRCxFQU1iLGNBTmEsQ0FBaEI7O0FBUUEsSUFBSUMsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLE9BQXZDLEVBQWdEO0FBQy9DUixrQkFBZ0IsQ0FBQztBQUNoQixrQkFBYztBQURFLEdBQUQsRUFFYixjQUZhLENBQWhCO0FBR0EsQzs7Ozs7Ozs7Ozs7QUNmRCxJQUFJUyxLQUFKO0FBQVVSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ08sT0FBSyxDQUFDTixDQUFELEVBQUc7QUFBQ00sU0FBSyxHQUFDTixDQUFOO0FBQVE7O0FBQWxCLENBQTNCLEVBQStDLENBQS9DOztBQUVWO0FBQ0E7QUFDQSxJQUFJRyxNQUFNLENBQUNJLFFBQVgsRUFBcUI7QUFFcEIsTUFBSUMsWUFBWSxHQUFHO0FBQ2xCQyxtQkFBZSxFQUFFO0FBREMsR0FBbkI7QUFJQSxRQUFNQyxjQUFjLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxhQUFuQzs7QUFDQSxNQUFJLE9BQU9ILGNBQVAsS0FBMEIsV0FBOUIsRUFBMkM7QUFDMUMsVUFBTUksZ0JBQWdCLEdBQUdDLElBQUksQ0FBQ0MsS0FBTCxDQUFXTixjQUFYLENBQXpCO0FBRUFGLGdCQUFZLEdBQUdTLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JWLFlBQWxCLEVBQWdDTSxnQkFBaEMsQ0FBZjtBQUNBOztBQUVEUixPQUFLLENBQUNhLG9CQUFOLENBQTJCWCxZQUEzQjtBQUNBOztBQUdETCxNQUFNLENBQUNpQixPQUFQLEdBQWlCQyxPQUFPLENBQUNELE9BQXpCLEM7Ozs7Ozs7Ozs7O0FDckJBRSxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLFVBQWhCLEdBQTZCLFVBQVVDLE1BQVYsRUFBa0I7QUFDM0MsTUFBSSxDQUFDLElBQUwsRUFBVztBQUNQO0FBQ0g7O0FBQ0QsTUFBRyxDQUFDQSxNQUFKLEVBQVc7QUFDUEEsVUFBTSxHQUFHQyxPQUFPLENBQUNELE1BQVIsRUFBVDtBQUNIOztBQUNELE9BQUtFLElBQUwsQ0FBVSxVQUFVQyxFQUFWLEVBQWNDLEVBQWQsRUFBa0I7QUFDOUIsUUFBSUMsVUFBVSxHQUFHRixFQUFFLENBQUNHLE9BQUgsSUFBYyxDQUEvQjtBQUNBLFFBQUlDLFVBQVUsR0FBR0gsRUFBRSxDQUFDRSxPQUFILElBQWMsQ0FBL0I7O0FBQ0EsUUFBR0QsVUFBVSxJQUFJRSxVQUFqQixFQUE0QjtBQUNsQixhQUFPRixVQUFVLEdBQUdFLFVBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixDQUF0QztBQUNILEtBRlAsTUFFVztBQUNWLGFBQU9KLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRQyxhQUFSLENBQXNCTCxFQUFFLENBQUNJLElBQXpCLEVBQStCUixNQUEvQixDQUFQO0FBQ0E7QUFDRSxHQVJEO0FBU0gsQ0FoQkQ7O0FBbUJBSCxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JZLFdBQWhCLEdBQThCLFVBQVVDLENBQVYsRUFBYTtBQUN2QyxNQUFJcEMsQ0FBQyxHQUFHLElBQUlzQixLQUFKLEVBQVI7QUFDQSxPQUFLZSxPQUFMLENBQWEsVUFBVUMsQ0FBVixFQUFhO0FBQ3RCLFFBQUlDLENBQUMsR0FBR0QsQ0FBQyxHQUFHQSxDQUFDLENBQUNGLENBQUQsQ0FBSixHQUFVLElBQW5CO0FBQ0FwQyxLQUFDLENBQUN3QyxJQUFGLENBQU9ELENBQVA7QUFDSCxHQUhEO0FBSUEsU0FBT3ZDLENBQVA7QUFDSCxDQVBEO0FBU0E7Ozs7O0FBR0FzQixLQUFLLENBQUNDLFNBQU4sQ0FBZ0JrQixNQUFoQixHQUF5QixVQUFVQyxJQUFWLEVBQWdCQyxFQUFoQixFQUFvQjtBQUN6QyxNQUFJRCxJQUFJLEdBQUcsQ0FBWCxFQUFjO0FBQ1Y7QUFDSDs7QUFDRCxNQUFJRSxJQUFJLEdBQUcsS0FBS0MsS0FBTCxDQUFXLENBQUNGLEVBQUUsSUFBSUQsSUFBUCxJQUFlLENBQWYsSUFBb0IsS0FBS0ksTUFBcEMsQ0FBWDtBQUNBLE9BQUtBLE1BQUwsR0FBY0osSUFBSSxHQUFHLENBQVAsR0FBVyxLQUFLSSxNQUFMLEdBQWNKLElBQXpCLEdBQWdDQSxJQUE5QztBQUNBLFNBQU8sS0FBS0YsSUFBTCxDQUFVTyxLQUFWLENBQWdCLElBQWhCLEVBQXNCSCxJQUF0QixDQUFQO0FBQ0gsQ0FQRDtBQVNBOzs7Ozs7QUFJQXRCLEtBQUssQ0FBQ0MsU0FBTixDQUFnQnlCLGNBQWhCLEdBQWlDLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUM3QyxNQUFJQyxDQUFDLEdBQUcsRUFBUjtBQUNBLE9BQUtkLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ1csQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQSxRQUFJRyxDQUFDLEdBQUcsS0FBUjs7QUFDQSxRQUFJYixDQUFDLFlBQVlqQixLQUFqQixFQUF3QjtBQUNwQjhCLE9BQUMsR0FBR2IsQ0FBQyxDQUFDYyxRQUFGLENBQVdILENBQVgsQ0FBSjtBQUNILEtBRkQsTUFFTztBQUNILFVBQUlYLENBQUMsWUFBWXRCLE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUksUUFBUXNCLENBQVosRUFBZTtBQUNYQSxXQUFDLEdBQUdBLENBQUMsQ0FBQyxJQUFELENBQUw7QUFDSCxTQUZELE1BRU8sSUFBSSxTQUFTQSxDQUFiLEVBQWdCO0FBQ25CQSxXQUFDLEdBQUdBLENBQUMsQ0FBQyxLQUFELENBQUw7QUFDSDtBQUVKOztBQUNELFVBQUlXLENBQUMsWUFBWTVCLEtBQWpCLEVBQXdCO0FBQ3BCOEIsU0FBQyxHQUFJRixDQUFDLEtBQUtJLFNBQVAsR0FBb0IsS0FBcEIsR0FBNEJKLENBQUMsQ0FBQ0csUUFBRixDQUFXZCxDQUFYLENBQWhDO0FBQ0gsT0FGRCxNQUVPO0FBQ0hhLFNBQUMsR0FBSUYsQ0FBQyxLQUFLSSxTQUFQLEdBQW9CLEtBQXBCLEdBQTRCZixDQUFDLElBQUlXLENBQXJDO0FBQ0g7QUFDSjs7QUFFRCxRQUFJRSxDQUFKLEVBQU87QUFDSEQsT0FBQyxDQUFDWCxJQUFGLENBQU9GLENBQVA7QUFDSDtBQUNKLEdBeEJEO0FBeUJBLFNBQU9hLENBQVA7QUFDSCxDQTVCRDtBQThCQTs7Ozs7O0FBSUE3QixLQUFLLENBQUNDLFNBQU4sQ0FBZ0JnQyxnQkFBaEIsR0FBbUMsVUFBVU4sQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0FBQy9DLE1BQUlNLENBQUMsR0FBRyxJQUFSO0FBQ0EsT0FBS25CLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ1csQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQSxRQUFJRyxDQUFDLEdBQUcsS0FBUjs7QUFDQSxRQUFJYixDQUFDLFlBQVlqQixLQUFqQixFQUF3QjtBQUNwQjhCLE9BQUMsR0FBR2IsQ0FBQyxDQUFDYyxRQUFGLENBQVdILENBQVgsQ0FBSjtBQUNILEtBRkQsTUFFTztBQUNIRSxPQUFDLEdBQUlGLENBQUMsS0FBS0ksU0FBUCxHQUFvQixLQUFwQixHQUE0QmYsQ0FBQyxJQUFJVyxDQUFyQztBQUNIOztBQUVELFFBQUlFLENBQUosRUFBTztBQUNISSxPQUFDLEdBQUdsQixDQUFKO0FBQ0g7QUFDSixHQVpEO0FBYUEsU0FBT2tCLENBQVA7QUFDSCxDQWhCRCxDOzs7Ozs7Ozs7Ozs7QUM5RUEsSUFBQUMsT0FBQSxFQUFBQyxNQUFBLEVBQUFDLEtBQUE7QUFBQWpDLFVBQ0M7QUFBQXRCLFlBQVUsRUFBVjtBQUNBd0QsTUFBSUEsRUFESjtBQUVBQyxRQUFNLEVBRk47QUFHQUMsa0JBQWdCO0FBQ2YsUUFBQUMsR0FBQSxFQUFBQyxJQUFBO0FBQUEsV0FBTyxDQUFDLEdBQUFELE1BQUE1RCxPQUFBQyxRQUFBLGFBQUE0RCxPQUFBRCxJQUFBLHFCQUFBQyxLQUEwQkMsS0FBMUIsR0FBMEIsTUFBMUIsR0FBMEIsTUFBMUIsQ0FBUjtBQUpEO0FBS0FDLGtCQUFnQixVQUFDQyxNQUFELEVBQVMxQyxNQUFUO0FBQ2YsUUFBRyxPQUFPMEMsTUFBUCxLQUFpQixRQUFwQjtBQUNDQSxlQUFTQSxPQUFPQyxRQUFQLEVBQVQ7QUNLRTs7QURISCxRQUFHLENBQUNELE1BQUo7QUFDQyxhQUFPLEVBQVA7QUNLRTs7QURISCxRQUFHQSxXQUFVLEtBQWI7QUFDQyxXQUFPMUMsTUFBUDtBQUNDQSxpQkFBU0MsUUFBUUQsTUFBUixFQUFUO0FDS0c7O0FESkosVUFBR0EsV0FBVSxPQUFWLElBQXFCQSxXQUFVLE9BQWxDO0FBRUMsZUFBTzBDLE9BQU9FLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxHQUF4QyxDQUFQO0FBRkQ7QUFJQyxlQUFPRixPQUFPRSxPQUFQLENBQWUsdUJBQWYsRUFBd0MsR0FBeEMsQ0FBUDtBQVBGO0FBQUE7QUFTQyxhQUFPLEVBQVA7QUNNRTtBRDNCSjtBQXNCQUMscUJBQW1CLFVBQUNDLEdBQUQ7QUFFbEIsUUFBQUMsR0FBQTtBQUFBQSxVQUFNLElBQUlDLE1BQUosQ0FBVywyQ0FBWCxDQUFOO0FBQ0EsV0FBT0QsSUFBSUUsSUFBSixDQUFTSCxHQUFULENBQVA7QUF6QkQ7QUFBQSxDQURELEMsQ0E0QkE7Ozs7O0FBS0E3QyxRQUFRaUQsVUFBUixHQUFxQixVQUFDbEQsTUFBRDtBQUNwQixNQUFBbUQsT0FBQTtBQUFBQSxZQUFVbkQsT0FBT29ELFNBQVAsQ0FBaUIsQ0FBakIsQ0FBVjtBQUNBLFNBQU8sNEJBQTRCRCxPQUE1QixHQUFzQyxRQUE3QztBQUZvQixDQUFyQjs7QUFJQSxJQUFHekUsT0FBTzJFLFFBQVY7QUFFQ3BELFVBQVFxRCxrQkFBUixHQUE2QjtBQ1kxQixXRFhGQyxLQUFLO0FBQUNDLGFBQU9DLFFBQVFDLEVBQVIsQ0FBVyx1QkFBWCxDQUFSO0FBQTZDQyxZQUFNRixRQUFRQyxFQUFSLENBQVcsc0JBQVgsQ0FBbkQ7QUFBdUZFLFlBQU0sSUFBN0Y7QUFBbUdDLFlBQUssU0FBeEc7QUFBbUhDLHlCQUFtQkwsUUFBUUMsRUFBUixDQUFXLElBQVg7QUFBdEksS0FBTCxDQ1dFO0FEWjBCLEdBQTdCOztBQUdBekQsVUFBUThELHFCQUFSLEdBQWdDO0FBQy9CLFFBQUFDLGFBQUE7QUFBQUEsb0JBQWdCN0IsR0FBRzhCLGlCQUFILENBQXFCQyxPQUFyQixDQUE2QjtBQUFDQyxZQUFLbEUsUUFBUW1FLE1BQVIsRUFBTjtBQUF1QkMsV0FBSTtBQUEzQixLQUE3QixDQUFoQjs7QUFDQSxRQUFHTCxhQUFIO0FBQ0MsYUFBT0EsY0FBY00sS0FBckI7QUFERDtBQUdDLGFBQU8sRUFBUDtBQ3NCRTtBRDNCNEIsR0FBaEM7O0FBT0FyRSxVQUFRc0UsdUJBQVIsR0FBa0MsVUFBQ0Msa0JBQUQsRUFBb0JDLGFBQXBCO0FBQ2pDLFFBQUFDLE1BQUEsRUFBQUMsU0FBQSxFQUFBQyxVQUFBLEVBQUF0QyxHQUFBLEVBQUFDLElBQUEsRUFBQXNDLElBQUEsRUFBQUMsR0FBQTs7QUFBQSxRQUFHcEcsT0FBT3FHLFNBQVAsTUFBc0IsQ0FBQzlFLFFBQVFtRSxNQUFSLEVBQTFCO0FBRUNJLDJCQUFxQixFQUFyQjtBQUNBQSx5QkFBbUJNLEdBQW5CLEdBQXlCRSxhQUFhQyxPQUFiLENBQXFCLHdCQUFyQixDQUF6QjtBQUNBVCx5QkFBbUJFLE1BQW5CLEdBQTRCTSxhQUFhQyxPQUFiLENBQXFCLDJCQUFyQixDQUE1QjtBQ3VCRTs7QURyQkhILFVBQU1OLG1CQUFtQk0sR0FBekI7QUFDQUosYUFBU0YsbUJBQW1CRSxNQUE1Qjs7QUFDQSxRQUFHRixtQkFBbUJNLEdBQXRCO0FBQ0MsVUFBR0EsUUFBT0osTUFBVjtBQUNDQyxvQkFBWSx1QkFBdUJELE1BQW5DO0FBQ0FRLFVBQUUsTUFBRixFQUFVQyxHQUFWLENBQWMsaUJBQWQsRUFBZ0MsVUFBVXpHLE9BQU8wRyxTQUFQLEdBQXNCVCxTQUF0QixHQUFxQ2pHLE9BQU8yRyxXQUFQLENBQW1CVixTQUFuQixDQUEvQyxJQUE2RSxHQUE3RztBQUZEO0FBS0NPLFVBQUUsTUFBRixFQUFVQyxHQUFWLENBQWMsaUJBQWQsRUFBZ0MsVUFBVXpHLE9BQU8wRyxTQUFQLEdBQXNCTixHQUF0QixHQUErQnBHLE9BQU8yRyxXQUFQLENBQW1CUCxHQUFuQixDQUF6QyxJQUFpRSxHQUFqRztBQU5GO0FBQUE7QUFTQ0YsbUJBQUEsQ0FBQXRDLE1BQUE1RCxPQUFBQyxRQUFBLGFBQUE0RCxPQUFBRCxJQUFBLHNCQUFBdUMsT0FBQXRDLEtBQUErQyxLQUFBLFlBQUFULEtBQTZDRCxVQUE3QyxHQUE2QyxNQUE3QyxHQUE2QyxNQUE3QyxHQUE2QyxNQUE3Qzs7QUFDQSxVQUFHQSxVQUFIO0FBQ0NNLFVBQUUsTUFBRixFQUFVQyxHQUFWLENBQWMsaUJBQWQsRUFBZ0MsVUFBVXpHLE9BQU8wRyxTQUFQLEdBQXNCUixVQUF0QixHQUFzQ2xHLE9BQU8yRyxXQUFQLENBQW1CVCxVQUFuQixDQUFoRCxJQUErRSxHQUEvRztBQUREO0FBR0NBLHFCQUFhLG1EQUFiO0FBQ0FNLFVBQUUsTUFBRixFQUFVQyxHQUFWLENBQWMsaUJBQWQsRUFBZ0MsVUFBVXpHLE9BQU8wRyxTQUFQLEdBQXNCUixVQUF0QixHQUFzQ2xHLE9BQU8yRyxXQUFQLENBQW1CVCxVQUFuQixDQUFoRCxJQUErRSxHQUEvRztBQWRGO0FDcUNHOztBRHJCSCxRQUFHSCxhQUFIO0FBQ0MsVUFBRy9GLE9BQU9xRyxTQUFQLEVBQUg7QUFFQztBQ3NCRzs7QURuQkosVUFBRzlFLFFBQVFtRSxNQUFSLEVBQUg7QUFDQyxZQUFHVSxHQUFIO0FBQ0NFLHVCQUFhTyxPQUFiLENBQXFCLHdCQUFyQixFQUE4Q1QsR0FBOUM7QUNxQkssaUJEcEJMRSxhQUFhTyxPQUFiLENBQXFCLDJCQUFyQixFQUFpRGIsTUFBakQsQ0NvQks7QUR0Qk47QUFJQ00sdUJBQWFRLFVBQWIsQ0FBd0Isd0JBQXhCO0FDcUJLLGlCRHBCTFIsYUFBYVEsVUFBYixDQUF3QiwyQkFBeEIsQ0NvQks7QUQxQlA7QUFORDtBQ21DRztBRDVEOEIsR0FBbEM7O0FBdUNBdkYsVUFBUXdGLG1CQUFSLEdBQThCO0FBQzdCLFFBQUFDLFdBQUE7QUFBQUEsa0JBQWN2RCxHQUFHOEIsaUJBQUgsQ0FBcUJDLE9BQXJCLENBQTZCO0FBQUNDLFlBQUtsRSxRQUFRbUUsTUFBUixFQUFOO0FBQXVCQyxXQUFJO0FBQTNCLEtBQTdCLENBQWQ7O0FBQ0EsUUFBR3FCLFdBQUg7QUFDQyxhQUFPQSxZQUFZcEIsS0FBbkI7QUFERDtBQUdDLGFBQU8sRUFBUDtBQzRCRTtBRGpDMEIsR0FBOUI7O0FBT0FyRSxVQUFRMEYsbUJBQVIsR0FBOEI7QUFDN0IsUUFBQUMsV0FBQTtBQUFBQSxrQkFBY3pELEdBQUc4QixpQkFBSCxDQUFxQkMsT0FBckIsQ0FBNkI7QUFBQ0MsWUFBS2xFLFFBQVFtRSxNQUFSLEVBQU47QUFBdUJDLFdBQUk7QUFBM0IsS0FBN0IsQ0FBZDs7QUFDQSxRQUFHdUIsV0FBSDtBQUNDLGFBQU9BLFlBQVl0QixLQUFuQjtBQUREO0FBR0MsYUFBTyxFQUFQO0FDaUNFO0FEdEMwQixHQUE5Qjs7QUFPQXJFLFVBQVE0RixxQkFBUixHQUFnQyxVQUFDQyxnQkFBRCxFQUFrQnJCLGFBQWxCO0FBQy9CLFFBQUFzQixRQUFBLEVBQUFDLFFBQUE7O0FBQUEsUUFBR3RILE9BQU9xRyxTQUFQLE1BQXNCLENBQUM5RSxRQUFRbUUsTUFBUixFQUExQjtBQUVDMEIseUJBQW1CLEVBQW5CO0FBQ0FBLHVCQUFpQnRGLElBQWpCLEdBQXdCd0UsYUFBYUMsT0FBYixDQUFxQix1QkFBckIsQ0FBeEI7QUFDQWEsdUJBQWlCRyxJQUFqQixHQUF3QmpCLGFBQWFDLE9BQWIsQ0FBcUIsdUJBQXJCLENBQXhCO0FDa0NFOztBRGpDSEMsTUFBRSxNQUFGLEVBQVVnQixXQUFWLENBQXNCLGFBQXRCLEVBQXFDQSxXQUFyQyxDQUFpRCxZQUFqRCxFQUErREEsV0FBL0QsQ0FBMkUsa0JBQTNFO0FBQ0FILGVBQVdELGlCQUFpQnRGLElBQTVCO0FBQ0F3RixlQUFXRixpQkFBaUJHLElBQTVCOztBQUNBLFNBQU9GLFFBQVA7QUFDQ0EsaUJBQVcsT0FBWDtBQUNBQyxpQkFBVyxHQUFYO0FDbUNFOztBRGxDSCxRQUFHRCxZQUFZLENBQUNJLFFBQVFDLEdBQVIsQ0FBWSxlQUFaLENBQWhCO0FBQ0NsQixRQUFFLE1BQUYsRUFBVW1CLFFBQVYsQ0FBbUIsVUFBUU4sUUFBM0I7QUNvQ0U7O0FENUJILFFBQUd0QixhQUFIO0FBQ0MsVUFBRy9GLE9BQU9xRyxTQUFQLEVBQUg7QUFFQztBQzZCRzs7QUQxQkosVUFBRzlFLFFBQVFtRSxNQUFSLEVBQUg7QUFDQyxZQUFHMEIsaUJBQWlCdEYsSUFBcEI7QUFDQ3dFLHVCQUFhTyxPQUFiLENBQXFCLHVCQUFyQixFQUE2Q08saUJBQWlCdEYsSUFBOUQ7QUM0QkssaUJEM0JMd0UsYUFBYU8sT0FBYixDQUFxQix1QkFBckIsRUFBNkNPLGlCQUFpQkcsSUFBOUQsQ0MyQks7QUQ3Qk47QUFJQ2pCLHVCQUFhUSxVQUFiLENBQXdCLHVCQUF4QjtBQzRCSyxpQkQzQkxSLGFBQWFRLFVBQWIsQ0FBd0IsdUJBQXhCLENDMkJLO0FEakNQO0FBTkQ7QUMwQ0c7QUQvRDRCLEdBQWhDOztBQW1DQXZGLFVBQVFxRyxRQUFSLEdBQW1CLFVBQUN4QixHQUFEO0FBQ2xCLFFBQUEzQixPQUFBLEVBQUFuRCxNQUFBO0FBQUFBLGFBQVNDLFFBQVFzRyxTQUFSLEVBQVQ7QUFDQXBELGNBQVVuRCxPQUFPb0QsU0FBUCxDQUFpQixDQUFqQixDQUFWO0FBRUEwQixVQUFNQSxPQUFPLDRCQUE0QjNCLE9BQTVCLEdBQXNDLFFBQW5EO0FDK0JFLFdEN0JGcUQsT0FBT0MsSUFBUCxDQUFZM0IsR0FBWixFQUFpQixPQUFqQixFQUEwQix5QkFBMUIsQ0M2QkU7QURuQ2dCLEdBQW5COztBQVFBN0UsVUFBUXlHLGVBQVIsR0FBMEIsVUFBQzVCLEdBQUQ7QUFDekIsUUFBQTZCLFNBQUEsRUFBQUMsTUFBQTtBQUFBRCxnQkFBWSxFQUFaO0FBQ0FBLGNBQVUsU0FBVixJQUF1QjFHLFFBQVE0RyxVQUFSLEVBQXZCO0FBQ0FGLGNBQVUsV0FBVixJQUF5QmpJLE9BQU8wRixNQUFQLEVBQXpCO0FBQ0F1QyxjQUFVLGNBQVYsSUFBNEJHLFNBQVNDLGlCQUFULEVBQTVCO0FBRUFILGFBQVMsR0FBVDs7QUFFQSxRQUFHOUIsSUFBSWtDLE9BQUosQ0FBWSxHQUFaLElBQW1CLENBQUMsQ0FBdkI7QUFDQ0osZUFBUyxHQUFUO0FDNkJFOztBRDNCSCxXQUFPOUIsTUFBTThCLE1BQU4sR0FBZTFCLEVBQUUrQixLQUFGLENBQVFOLFNBQVIsQ0FBdEI7QUFYeUIsR0FBMUI7O0FBYUExRyxVQUFRaUgsa0JBQVIsR0FBNkIsVUFBQ0MsTUFBRDtBQUM1QixRQUFBUixTQUFBO0FBQUFBLGdCQUFZLEVBQVo7QUFDQUEsY0FBVSxTQUFWLElBQXVCMUcsUUFBUTRHLFVBQVIsRUFBdkI7QUFDQUYsY0FBVSxXQUFWLElBQXlCakksT0FBTzBGLE1BQVAsRUFBekI7QUFDQXVDLGNBQVUsY0FBVixJQUE0QkcsU0FBU0MsaUJBQVQsRUFBNUI7QUFDQSxXQUFPLG1CQUFtQkksTUFBbkIsR0FBNEIsR0FBNUIsR0FBa0NqQyxFQUFFK0IsS0FBRixDQUFRTixTQUFSLENBQXpDO0FBTDRCLEdBQTdCOztBQU9BMUcsVUFBUW1ILGdCQUFSLEdBQTJCLFVBQUNELE1BQUQ7QUFDMUIsUUFBQUUsR0FBQSxFQUFBdkMsR0FBQTtBQUFBQSxVQUFNN0UsUUFBUWlILGtCQUFSLENBQTJCQyxNQUEzQixDQUFOO0FBQ0FyQyxVQUFNN0UsUUFBUW9GLFdBQVIsQ0FBb0JQLEdBQXBCLENBQU47QUFFQXVDLFVBQU1sRixHQUFHbUYsSUFBSCxDQUFRcEQsT0FBUixDQUFnQmlELE1BQWhCLENBQU47O0FBRUEsUUFBRyxDQUFDRSxJQUFJRSxhQUFMLElBQXNCLENBQUN0SCxRQUFRdUgsUUFBUixFQUF2QixJQUE2QyxDQUFDdkgsUUFBUW1GLFNBQVIsRUFBakQ7QUM2QkksYUQ1QkhvQixPQUFPaUIsUUFBUCxHQUFrQjNDLEdDNEJmO0FEN0JKO0FDK0JJLGFENUJIN0UsUUFBUXlILFVBQVIsQ0FBbUI1QyxHQUFuQixDQzRCRztBQUNEO0FEdEN1QixHQUEzQjs7QUFXQTdFLFVBQVEwSCxhQUFSLEdBQXdCLFVBQUM3QyxHQUFEO0FBQ3ZCLFFBQUE4QyxHQUFBLEVBQUFDLElBQUEsRUFBQUMsUUFBQTs7QUFBQSxRQUFHaEQsR0FBSDtBQUNDLFVBQUc3RSxRQUFROEgsTUFBUixFQUFIO0FBQ0NGLGVBQU9HLEdBQUdDLE9BQUgsQ0FBVyxlQUFYLEVBQTRCSixJQUFuQztBQUNBQyxtQkFBV2hELEdBQVg7QUFDQThDLGNBQU0sMEJBQXdCRSxRQUF4QixHQUFpQyxJQUF2QztBQytCSSxlRDlCSkQsS0FBS0QsR0FBTCxFQUFVLFVBQUNNLEtBQUQsRUFBUUMsTUFBUixFQUFnQkMsTUFBaEI7QUFDVCxjQUFHRixLQUFIO0FBQ0NHLG1CQUFPSCxLQUFQLENBQWFBLEtBQWI7QUMrQks7QURqQ1AsVUM4Qkk7QURsQ0w7QUN3Q0ssZUQvQkpqSSxRQUFReUgsVUFBUixDQUFtQjVDLEdBQW5CLENDK0JJO0FEekNOO0FDMkNHO0FENUNvQixHQUF4Qjs7QUFhQTdFLFVBQVFxSSxnQkFBUixHQUEyQixVQUFDQyxRQUFEO0FBQzFCLFFBQUFDLFdBQUEsRUFBQWxHLEdBQUEsRUFBQUMsSUFBQSxFQUFBc0MsSUFBQSxFQUFBNEQsU0FBQTtBQUFBRCxrQkFBQSxDQUFBbEcsTUFBQTVELE9BQUFDLFFBQUEsdUJBQUE0RCxPQUFBRCxJQUFBb0csV0FBQSxhQUFBN0QsT0FBQXRDLEtBQUFvRyxRQUFBLFlBQUE5RCxLQUE2REMsR0FBN0QsR0FBNkQsTUFBN0QsR0FBNkQsTUFBN0QsR0FBNkQsTUFBN0Q7O0FBQ0EsUUFBRzBELFdBQUg7QUNtQ0ksYURsQ0hoQyxPQUFPaUIsUUFBUCxDQUFnQm1CLElBQWhCLEdBQXVCSixjQUFjLDJCQ2tDbEM7QURuQ0o7QUFHQ0Msa0JBQVlJLGtCQUFrQkMsWUFBbEIsQ0FBK0IsUUFBL0IsQ0FBWjs7QUFDQSxVQUFHUCxRQUFIO0FBQ0MsWUFBR0UsVUFBVXpCLE9BQVYsQ0FBa0IsR0FBbEIsSUFBeUIsQ0FBNUI7QUFDQ3lCLHVCQUFhLGVBQWFGLFFBQTFCO0FBREQ7QUFHQ0UsdUJBQWEsZUFBYUYsUUFBMUI7QUFKRjtBQ3dDSTs7QUFDRCxhRHBDSFEsV0FBV0MsRUFBWCxDQUFjUCxTQUFkLENDb0NHO0FBQ0Q7QURoRHVCLEdBQTNCOztBQWFBeEksVUFBUWdKLE9BQVIsR0FBa0IsVUFBQzlCLE1BQUQ7QUFDakIsUUFBQUUsR0FBQSxFQUFBTyxHQUFBLEVBQUFzQixDQUFBLEVBQUFDLGFBQUEsRUFBQXRCLElBQUEsRUFBQXVCLFFBQUEsRUFBQXRCLFFBQUEsRUFBQXVCLElBQUE7O0FBQUEsUUFBRyxDQUFDM0ssT0FBTzBGLE1BQVAsRUFBSjtBQUNDbkUsY0FBUXFJLGdCQUFSO0FBQ0EsYUFBTyxJQUFQO0FDdUNFOztBRHJDSGpCLFVBQU1sRixHQUFHbUYsSUFBSCxDQUFRcEQsT0FBUixDQUFnQmlELE1BQWhCLENBQU47O0FBQ0EsUUFBRyxDQUFDRSxHQUFKO0FBQ0MwQixpQkFBV0MsRUFBWCxDQUFjLEdBQWQ7QUFDQTtBQ3VDRTs7QUQzQkhJLGVBQVcvQixJQUFJK0IsUUFBZjs7QUFDQSxRQUFHL0IsSUFBSWlDLFNBQVA7QUFDQyxVQUFHckosUUFBUThILE1BQVIsRUFBSDtBQUNDRixlQUFPRyxHQUFHQyxPQUFILENBQVcsZUFBWCxFQUE0QkosSUFBbkM7O0FBQ0EsWUFBR3VCLFFBQUg7QUFDQ0MsaUJBQU8saUJBQWVsQyxNQUFmLEdBQXNCLGFBQXRCLEdBQW1DTCxTQUFTQyxpQkFBVCxFQUFuQyxHQUFnRSxVQUFoRSxHQUEwRXJJLE9BQU8wRixNQUFQLEVBQWpGO0FBQ0EwRCxxQkFBV3RCLE9BQU9pQixRQUFQLENBQWdCOEIsTUFBaEIsR0FBeUIsR0FBekIsR0FBK0JGLElBQTFDO0FBRkQ7QUFJQ3ZCLHFCQUFXN0gsUUFBUWlILGtCQUFSLENBQTJCQyxNQUEzQixDQUFYO0FBQ0FXLHFCQUFXdEIsT0FBT2lCLFFBQVAsQ0FBZ0I4QixNQUFoQixHQUF5QixHQUF6QixHQUErQnpCLFFBQTFDO0FDNkJJOztBRDVCTEYsY0FBTSwwQkFBd0JFLFFBQXhCLEdBQWlDLElBQXZDO0FBQ0FELGFBQUtELEdBQUwsRUFBVSxVQUFDTSxLQUFELEVBQVFDLE1BQVIsRUFBZ0JDLE1BQWhCO0FBQ1QsY0FBR0YsS0FBSDtBQUNDRyxtQkFBT0gsS0FBUCxDQUFhQSxLQUFiO0FDOEJLO0FEaENQO0FBVEQ7QUFjQ2pJLGdCQUFRbUgsZ0JBQVIsQ0FBeUJELE1BQXpCO0FBZkY7QUFBQSxXQWlCSyxJQUFHaEYsR0FBR21GLElBQUgsQ0FBUWtDLGFBQVIsQ0FBc0JuQyxJQUFJdkMsR0FBMUIsQ0FBSDtBQUNKaUUsaUJBQVdDLEVBQVgsQ0FBYzNCLElBQUl2QyxHQUFsQjtBQURJLFdBR0EsSUFBR3VDLElBQUlvQyxhQUFQO0FBQ0osVUFBR3BDLElBQUlFLGFBQUosSUFBcUIsQ0FBQ3RILFFBQVF1SCxRQUFSLEVBQXRCLElBQTRDLENBQUN2SCxRQUFRbUYsU0FBUixFQUFoRDtBQUNDbkYsZ0JBQVF5SCxVQUFSLENBQW1CekgsUUFBUW9GLFdBQVIsQ0FBb0IsaUJBQWlCZ0MsSUFBSXFDLEdBQXpDLENBQW5CO0FBREQsYUFFSyxJQUFHekosUUFBUXVILFFBQVIsTUFBc0J2SCxRQUFRbUYsU0FBUixFQUF6QjtBQUNKbkYsZ0JBQVFtSCxnQkFBUixDQUF5QkQsTUFBekI7QUFESTtBQUdKNEIsbUJBQVdDLEVBQVgsQ0FBYyxrQkFBZ0IzQixJQUFJcUMsR0FBbEM7QUFORztBQUFBLFdBUUEsSUFBR04sUUFBSDtBQUVKRCxzQkFBZ0IsaUJBQWVDLFFBQWYsR0FBd0IsTUFBeEM7O0FBQ0E7QUFDQ08sYUFBS1IsYUFBTDtBQURELGVBQUFTLE1BQUE7QUFFTVYsWUFBQVUsTUFBQTtBQUVMQyxnQkFBUTNCLEtBQVIsQ0FBYyw4REFBZDtBQUNBMkIsZ0JBQVEzQixLQUFSLENBQWlCZ0IsRUFBRVksT0FBRixHQUFVLE1BQVYsR0FBZ0JaLEVBQUVhLEtBQW5DO0FBUkc7QUFBQTtBQVVKOUosY0FBUW1ILGdCQUFSLENBQXlCRCxNQUF6QjtBQzhCRTs7QUQ1QkgsUUFBRyxDQUFDRSxJQUFJRSxhQUFMLElBQXNCLENBQUN0SCxRQUFRdUgsUUFBUixFQUF2QixJQUE2QyxDQUFDdkgsUUFBUW1GLFNBQVIsRUFBOUMsSUFBcUUsQ0FBQ2lDLElBQUlpQyxTQUExRSxJQUF1RixDQUFDRixRQUEzRjtBQzhCSSxhRDVCSGpELFFBQVE2RCxHQUFSLENBQVksZ0JBQVosRUFBOEI3QyxNQUE5QixDQzRCRztBQUNEO0FENUZjLEdBQWxCOztBQWlFQWxILFVBQVFnSyxpQkFBUixHQUE0QixVQUFDQyxPQUFEO0FBQzNCLFFBQUFDLFFBQUEsRUFBQUMsVUFBQSxFQUFBQyxLQUFBOztBQUFBLFNBQU9ILE9BQVA7QUFDQ0EsZ0JBQVVqSyxRQUFRaUssT0FBUixFQUFWO0FDK0JFOztBRDlCSEUsaUJBQWEsQ0FBYjs7QUFDQSxRQUFHbkssUUFBUXFLLFlBQVIsRUFBSDtBQUNDRixtQkFBYSxDQUFiO0FDZ0NFOztBRC9CSEMsWUFBUWxJLEdBQUdvSSxNQUFILENBQVVyRyxPQUFWLENBQWtCZ0csT0FBbEIsQ0FBUjtBQUNBQyxlQUFBRSxTQUFBLE9BQVdBLE1BQU9GLFFBQWxCLEdBQWtCLE1BQWxCOztBQUNBLFNBQUFFLFNBQUEsT0FBR0EsTUFBT0csT0FBVixHQUFVLE1BQVYsS0FBc0JMLGFBQVksTUFBbEMsSUFBaURBLFdBQVcsSUFBSU0sSUFBSixFQUFaLElBQTBCTCxhQUFXLEVBQVgsR0FBYyxFQUFkLEdBQWlCLElBQWpCLEdBQXNCLElBQWhHO0FDaUNJLGFEL0JIL0IsT0FBT0gsS0FBUCxDQUFhckgsRUFBRSw0QkFBRixDQUFiLENDK0JHO0FBQ0Q7QUQxQ3dCLEdBQTVCOztBQVlBWixVQUFReUssaUJBQVIsR0FBNEI7QUFDM0IsUUFBQTVFLGdCQUFBLEVBQUE2RSxNQUFBO0FBQUE3RSx1QkFBbUI3RixRQUFRMEYsbUJBQVIsRUFBbkI7O0FBQ0EsU0FBT0csaUJBQWlCdEYsSUFBeEI7QUFDQ3NGLHVCQUFpQnRGLElBQWpCLEdBQXdCLE9BQXhCO0FDa0NFOztBRGpDSCxZQUFPc0YsaUJBQWlCdEYsSUFBeEI7QUFBQSxXQUNNLFFBRE47QUFFRSxZQUFHUCxRQUFRdUgsUUFBUixFQUFIO0FBQ0NtRCxtQkFBUyxDQUFDLEVBQVY7QUFERDtBQUdDQSxtQkFBUyxFQUFUO0FDbUNJOztBRHZDRDs7QUFETixXQU1NLE9BTk47QUFPRSxZQUFHMUssUUFBUXVILFFBQVIsRUFBSDtBQUNDbUQsbUJBQVMsQ0FBQyxDQUFWO0FBREQ7QUFJQyxjQUFHMUssUUFBUTJLLFFBQVIsRUFBSDtBQUNDRCxxQkFBUyxHQUFUO0FBREQ7QUFHQ0EscUJBQVMsQ0FBVDtBQVBGO0FDNENLOztBRDdDRDs7QUFOTixXQWVNLGFBZk47QUFnQkUsWUFBRzFLLFFBQVF1SCxRQUFSLEVBQUg7QUFDQ21ELG1CQUFTLENBQUMsRUFBVjtBQUREO0FBSUMsY0FBRzFLLFFBQVEySyxRQUFSLEVBQUg7QUFDQ0QscUJBQVMsR0FBVDtBQUREO0FBR0NBLHFCQUFTLEVBQVQ7QUFQRjtBQzhDSzs7QUQ5RFA7O0FBeUJBLFFBQUd6RixFQUFFLFFBQUYsRUFBWTdELE1BQWY7QUN3Q0ksYUR2Q0g2RCxFQUFFLFFBQUYsRUFBWTJGLElBQVosQ0FBaUI7QUFDaEIsWUFBQUMsWUFBQSxFQUFBQyxZQUFBLEVBQUFDLE1BQUEsRUFBQUMsV0FBQTtBQUFBRix1QkFBZSxDQUFmO0FBQ0FELHVCQUFlLENBQWY7QUFDQUcsc0JBQWMsQ0FBZDtBQUNBL0YsVUFBRSxlQUFGLEVBQW1CQSxFQUFFLElBQUYsQ0FBbkIsRUFBNEIyRixJQUE1QixDQUFpQztBQ3lDM0IsaUJEeENMRSxnQkFBZ0I3RixFQUFFLElBQUYsRUFBUWdHLFdBQVIsQ0FBb0IsS0FBcEIsQ0N3Q1g7QUR6Q047QUFFQWhHLFVBQUUsZUFBRixFQUFtQkEsRUFBRSxJQUFGLENBQW5CLEVBQTRCMkYsSUFBNUIsQ0FBaUM7QUMwQzNCLGlCRHpDTEMsZ0JBQWdCNUYsRUFBRSxJQUFGLEVBQVFnRyxXQUFSLENBQW9CLEtBQXBCLENDeUNYO0FEMUNOO0FBR0FELHNCQUFjRixlQUFlRCxZQUE3QjtBQUNBRSxpQkFBUzlGLEVBQUUsTUFBRixFQUFVaUcsV0FBVixLQUEwQkYsV0FBMUIsR0FBd0NOLE1BQWpEOztBQUNBLFlBQUd6RixFQUFFLElBQUYsRUFBUWtHLFFBQVIsQ0FBaUIsa0JBQWpCLENBQUg7QUMwQ00saUJEekNMbEcsRUFBRSxhQUFGLEVBQWdCQSxFQUFFLElBQUYsQ0FBaEIsRUFBeUJDLEdBQXpCLENBQTZCO0FBQUMsMEJBQWlCNkYsU0FBTyxJQUF6QjtBQUE4QixzQkFBYUEsU0FBTztBQUFsRCxXQUE3QixDQ3lDSztBRDFDTjtBQytDTSxpQkQ1Q0w5RixFQUFFLGFBQUYsRUFBZ0JBLEVBQUUsSUFBRixDQUFoQixFQUF5QkMsR0FBekIsQ0FBNkI7QUFBQywwQkFBaUI2RixTQUFPLElBQXpCO0FBQThCLHNCQUFVO0FBQXhDLFdBQTdCLENDNENLO0FBSUQ7QUQ5RE4sUUN1Q0c7QUF5QkQ7QUQ5RndCLEdBQTVCOztBQThDQS9LLFVBQVFvTCxpQkFBUixHQUE0QixVQUFDVixNQUFEO0FBQzNCLFFBQUE3RSxnQkFBQSxFQUFBd0YsT0FBQTs7QUFBQSxRQUFHckwsUUFBUXVILFFBQVIsRUFBSDtBQUNDOEQsZ0JBQVU5RSxPQUFPK0UsTUFBUCxDQUFjUCxNQUFkLEdBQXVCLEdBQXZCLEdBQTZCLEdBQTdCLEdBQW1DLEVBQTdDO0FBREQ7QUFHQ00sZ0JBQVVwRyxFQUFFc0IsTUFBRixFQUFVd0UsTUFBVixLQUFxQixHQUFyQixHQUEyQixFQUFyQztBQ29ERTs7QURuREgsVUFBTy9LLFFBQVF1TCxLQUFSLE1BQW1CdkwsUUFBUXVILFFBQVIsRUFBMUI7QUFFQzFCLHlCQUFtQjdGLFFBQVEwRixtQkFBUixFQUFuQjs7QUFDQSxjQUFPRyxpQkFBaUJ0RixJQUF4QjtBQUFBLGFBQ00sT0FETjtBQUdFOEsscUJBQVcsRUFBWDtBQUZJOztBQUROLGFBSU0sYUFKTjtBQUtFQSxxQkFBVyxHQUFYO0FBTEY7QUMwREU7O0FEcERILFFBQUdYLE1BQUg7QUFDQ1csaUJBQVdYLE1BQVg7QUNzREU7O0FEckRILFdBQU9XLFVBQVUsSUFBakI7QUFoQjJCLEdBQTVCOztBQWtCQXJMLFVBQVF1TCxLQUFSLEdBQWdCLFVBQUNDLFNBQUQsRUFBWUMsUUFBWjtBQUNmLFFBQUFDLE1BQUEsRUFBQUMsT0FBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUEsRUFBQUMsTUFBQTtBQUFBSixhQUNDO0FBQUFLLGVBQVMsU0FBVDtBQUNBQyxrQkFBWSxZQURaO0FBRUFDLGVBQVMsU0FGVDtBQUdBQyxZQUFNLE1BSE47QUFJQUMsY0FBUSxRQUpSO0FBS0FDLFlBQU0sTUFMTjtBQU1BQyxjQUFRO0FBTlIsS0FERDtBQVFBVixjQUFVLEVBQVY7QUFDQUMsYUFBUyxxQkFBVDtBQUNBRSxhQUFTLHFCQUFUO0FBQ0FOLGdCQUFZLENBQUNBLGFBQWFjLFVBQVVkLFNBQXhCLEVBQW1DZSxXQUFuQyxFQUFaO0FBQ0FkLGVBQVdBLFlBQVlhLFVBQVViLFFBQXRCLElBQWtDYSxVQUFVRSxlQUF2RDtBQUNBWCxhQUFTTCxVQUFVaUIsS0FBVixDQUFnQixJQUFJMUosTUFBSixDQUFXLHVDQUFYLENBQWhCLEtBQXdFeUksVUFBVWlCLEtBQVYsQ0FBZ0IsSUFBSTFKLE1BQUosQ0FBVyxVQUFYLENBQWhCLENBQXhFLElBQW1ILENBQzNILEVBRDJILEVBRTNIMkksT0FBT08sT0FGb0gsQ0FBNUg7QUFJQU4sWUFBUUUsTUFBUixHQUFpQkEsT0FBTyxDQUFQLENBQWpCO0FBQ0EsV0FBT0YsUUFBUUUsTUFBUixLQUFrQkgsT0FBT1EsSUFBekIsSUFBaUNQLFFBQVFFLE1BQVIsS0FBa0JILE9BQU9TLE1BQTFELElBQW9FUixRQUFRRSxNQUFSLEtBQWtCSCxPQUFPVSxJQUFwRztBQW5CZSxHQUFoQjs7QUFxQkFwTSxVQUFRME0sb0JBQVIsR0FBK0IsVUFBQ0MsZ0JBQUQ7QUFDOUIsUUFBQUMsYUFBQSxFQUFBQyxPQUFBLEVBQUE1QyxPQUFBLEVBQUE2QyxVQUFBLEVBQUEzSSxNQUFBO0FBQUFBLGFBQVMxRixPQUFPMEYsTUFBUCxFQUFUO0FBQ0E4RixjQUFVakssUUFBUWlLLE9BQVIsRUFBVjtBQUNBNkMsaUJBQWE1SyxHQUFHNkssV0FBSCxDQUFlOUksT0FBZixDQUF1QjtBQUFDQyxZQUFLQyxNQUFOO0FBQWFpRyxhQUFNSDtBQUFuQixLQUF2QixFQUFtRDtBQUFBK0MsY0FBTztBQUFDSix1QkFBYztBQUFmO0FBQVAsS0FBbkQsQ0FBYjtBQUNBQSxvQkFBQUUsY0FBQSxPQUFnQkEsV0FBWUYsYUFBNUIsR0FBNEIsTUFBNUI7O0FBQ0EsU0FBT0EsYUFBUDtBQUNDLGFBQU8sRUFBUDtBQzhERTs7QUQ3REgsUUFBR0QsZ0JBQUg7QUFDQ0UsZ0JBQVVJLEVBQUVDLE9BQUYsQ0FBVWhMLEdBQUcwSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFBMUQsYUFBSTtBQUFDMkQsZUFBSVI7QUFBTDtBQUFKLE9BQXRCLEVBQStDUyxLQUEvQyxHQUF1RDVNLFdBQXZELENBQW1FLFNBQW5FLENBQVYsQ0FBVjtBQUNBLGFBQU93TSxFQUFFSyxLQUFGLENBQVFWLGFBQVIsRUFBc0JDLE9BQXRCLENBQVA7QUFGRDtBQUlDLGFBQU9ELGFBQVA7QUNtRUU7QUQ5RTJCLEdBQS9COztBQWFBNU0sVUFBUXVOLHFCQUFSLEdBQWdDLFVBQUNDLE1BQUQsRUFBU0MsR0FBVDtBQUMvQixTQUFPek4sUUFBUThILE1BQVIsRUFBUDtBQUNDO0FDb0VFOztBRG5FSDBGLFdBQU9FLFFBQVAsQ0FBZ0JDLElBQWhCLENBQXFCQyxnQkFBckIsQ0FBc0MsYUFBdEMsRUFBcUQsVUFBQ0MsRUFBRDtBQUNwREEsU0FBR0MsY0FBSDtBQUNBLGFBQU8sS0FBUDtBQUZEOztBQUdBLFFBQUdMLEdBQUg7QUFDQyxVQUFHLE9BQU9BLEdBQVAsS0FBYyxRQUFqQjtBQUNDQSxjQUFNRCxPQUFPdkksQ0FBUCxDQUFTd0ksR0FBVCxDQUFOO0FDc0VHOztBQUNELGFEdEVIQSxJQUFJTSxJQUFKLENBQVM7QUFDUixZQUFBQyxPQUFBO0FBQUFBLGtCQUFVUCxJQUFJUSxRQUFKLEdBQWVkLElBQWYsQ0FBb0IsTUFBcEIsQ0FBVjs7QUFDQSxZQUFHYSxPQUFIO0FDd0VNLGlCRHZFTEEsUUFBUSxDQUFSLEVBQVdKLGdCQUFYLENBQTRCLGFBQTVCLEVBQTJDLFVBQUNDLEVBQUQ7QUFDMUNBLGVBQUdDLGNBQUg7QUFDQSxtQkFBTyxLQUFQO0FBRkQsWUN1RUs7QUFJRDtBRDlFTixRQ3NFRztBQVVEO0FEekY0QixHQUFoQztBQzJGQTs7QUQzRUQsSUFBR3JQLE9BQU9JLFFBQVY7QUFDQ21CLFVBQVEwTSxvQkFBUixHQUErQixVQUFDekMsT0FBRCxFQUFTOUYsTUFBVCxFQUFnQndJLGdCQUFoQjtBQUM5QixRQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQUMsVUFBQTtBQUFBQSxpQkFBYTVLLEdBQUc2SyxXQUFILENBQWU5SSxPQUFmLENBQXVCO0FBQUNDLFlBQUtDLE1BQU47QUFBYWlHLGFBQU1IO0FBQW5CLEtBQXZCLEVBQW1EO0FBQUErQyxjQUFPO0FBQUNKLHVCQUFjO0FBQWY7QUFBUCxLQUFuRCxDQUFiO0FBQ0FBLG9CQUFBRSxjQUFBLE9BQWdCQSxXQUFZRixhQUE1QixHQUE0QixNQUE1Qjs7QUFDQSxTQUFPQSxhQUFQO0FBQ0MsYUFBTyxFQUFQO0FDc0ZFOztBRHJGSCxRQUFHRCxnQkFBSDtBQUNDRSxnQkFBVUksRUFBRUMsT0FBRixDQUFVaEwsR0FBRzBLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUExRCxhQUFJO0FBQUMyRCxlQUFJUjtBQUFMO0FBQUosT0FBdEIsRUFBK0NTLEtBQS9DLEdBQXVENU0sV0FBdkQsQ0FBbUUsU0FBbkUsQ0FBVixDQUFWO0FBQ0EsYUFBT3dNLEVBQUVLLEtBQUYsQ0FBUVYsYUFBUixFQUFzQkMsT0FBdEIsQ0FBUDtBQUZEO0FBSUMsYUFBT0QsYUFBUDtBQzJGRTtBRHBHMkIsR0FBL0I7QUNzR0E7O0FEekZELElBQUduTyxPQUFPSSxRQUFWO0FBQ0NrRCxZQUFVaUcsUUFBUSxTQUFSLENBQVY7O0FBRUFoSSxVQUFRdUgsUUFBUixHQUFtQjtBQUNsQixXQUFPLEtBQVA7QUFEa0IsR0FBbkI7O0FBR0F2SCxVQUFRcUssWUFBUixHQUF1QixVQUFDSixPQUFELEVBQVU5RixNQUFWO0FBQ3RCLFFBQUFpRyxLQUFBOztBQUFBLFFBQUcsQ0FBQ0gsT0FBRCxJQUFZLENBQUM5RixNQUFoQjtBQUNDLGFBQU8sS0FBUDtBQzRGRTs7QUQzRkhpRyxZQUFRbEksR0FBR29JLE1BQUgsQ0FBVXJHLE9BQVYsQ0FBa0JnRyxPQUFsQixDQUFSOztBQUNBLFFBQUcsQ0FBQ0csS0FBRCxJQUFVLENBQUNBLE1BQU04RCxNQUFwQjtBQUNDLGFBQU8sS0FBUDtBQzZGRTs7QUQ1RkgsV0FBTzlELE1BQU04RCxNQUFOLENBQWFuSCxPQUFiLENBQXFCNUMsTUFBckIsS0FBOEIsQ0FBckM7QUFOc0IsR0FBdkI7O0FBUUFuRSxVQUFRbU8sY0FBUixHQUF5QixVQUFDbEUsT0FBRCxFQUFTbUUsV0FBVDtBQUN4QixRQUFBQyxLQUFBLEVBQUFDLE9BQUEsRUFBQWpNLEdBQUE7O0FBQUEsUUFBRyxDQUFDNEgsT0FBSjtBQUNDLGFBQU8sS0FBUDtBQytGRTs7QUQ5RkhvRSxZQUFRLEtBQVI7QUFDQUMsY0FBQSxDQUFBak0sTUFBQUgsR0FBQW9JLE1BQUEsQ0FBQXJHLE9BQUEsQ0FBQWdHLE9BQUEsYUFBQTVILElBQXNDaU0sT0FBdEMsR0FBc0MsTUFBdEM7O0FBQ0EsUUFBR0EsV0FBWUEsUUFBUTNNLFFBQVIsQ0FBaUJ5TSxXQUFqQixDQUFmO0FBQ0NDLGNBQVEsSUFBUjtBQ2dHRTs7QUQvRkgsV0FBT0EsS0FBUDtBQVB3QixHQUF6Qjs7QUFVQXJPLFVBQVF1TyxrQkFBUixHQUE2QixVQUFDQyxNQUFELEVBQVNySyxNQUFUO0FBQzVCLFFBQUFzSyxlQUFBLEVBQUFDLFVBQUEsRUFBQTdCLE9BQUEsRUFBQThCLE9BQUE7QUFBQUQsaUJBQWEsS0FBYjtBQUNBQyxjQUFVek0sR0FBRzBLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUMxRCxXQUFLO0FBQUMyRCxhQUFJb0I7QUFBTDtBQUFOLEtBQXRCLEVBQTBDO0FBQUN4QixjQUFPO0FBQUNILGlCQUFRLENBQVQ7QUFBV3FCLGdCQUFPO0FBQWxCO0FBQVIsS0FBMUMsRUFBeUViLEtBQXpFLEVBQVY7QUFDQVIsY0FBVSxFQUFWO0FBQ0E0QixzQkFBa0JFLFFBQVFDLE1BQVIsQ0FBZSxVQUFDQyxHQUFEO0FBQ2hDLFVBQUF4TSxHQUFBOztBQUFBLFVBQUd3TSxJQUFJaEMsT0FBUDtBQUNDQSxrQkFBVUksRUFBRUssS0FBRixDQUFRVCxPQUFSLEVBQWdCZ0MsSUFBSWhDLE9BQXBCLENBQVY7QUMyR0c7O0FEMUdKLGNBQUF4SyxNQUFBd00sSUFBQVgsTUFBQSxZQUFBN0wsSUFBbUJWLFFBQW5CLENBQTRCd0MsTUFBNUIsSUFBTyxNQUFQO0FBSGlCLE1BQWxCOztBQUlBLFFBQUdzSyxnQkFBZ0JyTixNQUFuQjtBQUNDc04sbUJBQWEsSUFBYjtBQUREO0FBR0M3QixnQkFBVUksRUFBRUMsT0FBRixDQUFVTCxPQUFWLENBQVY7QUFDQUEsZ0JBQVVJLEVBQUU2QixJQUFGLENBQU9qQyxPQUFQLENBQVY7O0FBQ0EsVUFBR0EsUUFBUXpMLE1BQVIsSUFBbUJjLEdBQUcwSyxhQUFILENBQWlCM0ksT0FBakIsQ0FBeUI7QUFBQ3dGLGFBQUk7QUFBQzJELGVBQUlQO0FBQUwsU0FBTDtBQUFvQnFCLGdCQUFPL0o7QUFBM0IsT0FBekIsQ0FBdEI7QUFDQ3VLLHFCQUFhLElBQWI7QUFORjtBQ3lIRzs7QURsSEgsV0FBT0EsVUFBUDtBQWY0QixHQUE3Qjs7QUFtQkExTyxVQUFRK08scUJBQVIsR0FBZ0MsVUFBQ1AsTUFBRCxFQUFTckssTUFBVDtBQUMvQixRQUFBNkssQ0FBQSxFQUFBTixVQUFBOztBQUFBLFNBQU9GLE9BQU9wTixNQUFkO0FBQ0MsYUFBTyxJQUFQO0FDbUhFOztBRGxISDROLFFBQUksQ0FBSjs7QUFDQSxXQUFNQSxJQUFJUixPQUFPcE4sTUFBakI7QUFDQ3NOLG1CQUFhMU8sUUFBUXVPLGtCQUFSLENBQTJCLENBQUNDLE9BQU9RLENBQVAsQ0FBRCxDQUEzQixFQUF3QzdLLE1BQXhDLENBQWI7O0FBQ0EsV0FBT3VLLFVBQVA7QUFDQztBQ29IRzs7QURuSEpNO0FBSkQ7O0FBS0EsV0FBT04sVUFBUDtBQVQrQixHQUFoQzs7QUFXQTFPLFVBQVFvRixXQUFSLEdBQXNCLFVBQUNQLEdBQUQ7QUFDckIsUUFBQW9FLENBQUEsRUFBQWdHLFFBQUE7O0FBQUEsUUFBR3BLLEdBQUg7QUFFQ0EsWUFBTUEsSUFBSWxDLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNzSEU7O0FEckhILFFBQUlsRSxPQUFPMEcsU0FBWDtBQUNDLGFBQU8xRyxPQUFPMkcsV0FBUCxDQUFtQlAsR0FBbkIsQ0FBUDtBQUREO0FBR0MsVUFBR3BHLE9BQU8yRSxRQUFWO0FBQ0M7QUFDQzZMLHFCQUFXLElBQUlDLEdBQUosQ0FBUXpRLE9BQU8yRyxXQUFQLEVBQVIsQ0FBWDs7QUFDQSxjQUFHUCxHQUFIO0FBQ0MsbUJBQU9vSyxTQUFTRSxRQUFULEdBQW9CdEssR0FBM0I7QUFERDtBQUdDLG1CQUFPb0ssU0FBU0UsUUFBaEI7QUFMRjtBQUFBLGlCQUFBeEYsTUFBQTtBQU1NVixjQUFBVSxNQUFBO0FBQ0wsaUJBQU9sTCxPQUFPMkcsV0FBUCxDQUFtQlAsR0FBbkIsQ0FBUDtBQVJGO0FBQUE7QUNtSUssZUR6SEpwRyxPQUFPMkcsV0FBUCxDQUFtQlAsR0FBbkIsQ0N5SEk7QUR0SU47QUN3SUc7QUQ1SWtCLEdBQXRCOztBQW9CQTdFLFVBQVFvUCxlQUFSLEdBQTBCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTjtBQUV6QixRQUFBNUksU0FBQSxFQUFBbkksT0FBQSxFQUFBZ1IsUUFBQSxFQUFBbE4sR0FBQSxFQUFBQyxJQUFBLEVBQUFzQyxJQUFBLEVBQUE0SyxJQUFBLEVBQUFDLE1BQUEsRUFBQXZMLElBQUEsRUFBQUMsTUFBQSxFQUFBdUwsUUFBQTtBQUFBQSxlQUFBLENBQUFyTixNQUFBZ04sSUFBQU0sS0FBQSxZQUFBdE4sSUFBc0JxTixRQUF0QixHQUFzQixNQUF0QjtBQUVBSCxlQUFBLENBQUFqTixPQUFBK00sSUFBQU0sS0FBQSxZQUFBck4sS0FBc0JpTixRQUF0QixHQUFzQixNQUF0Qjs7QUFFQSxRQUFHRyxZQUFZSCxRQUFmO0FBQ0NyTCxhQUFPaEMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUI7QUFBQzRMLG9CQUFZSDtBQUFiLE9BQWpCLENBQVA7O0FBRUEsVUFBRyxDQUFDeEwsSUFBSjtBQUNDLGVBQU8sS0FBUDtBQzBIRzs7QUR4SEp1TCxlQUFTNUksU0FBU2lKLGNBQVQsQ0FBd0I1TCxJQUF4QixFQUE4QnFMLFFBQTlCLENBQVQ7O0FBRUEsVUFBR0UsT0FBT3hILEtBQVY7QUFDQyxjQUFNLElBQUk4SCxLQUFKLENBQVVOLE9BQU94SCxLQUFqQixDQUFOO0FBREQ7QUFHQyxlQUFPL0QsSUFBUDtBQVhGO0FDcUlHOztBRHhISEMsYUFBQSxDQUFBUyxPQUFBeUssSUFBQU0sS0FBQSxZQUFBL0ssS0FBb0IsV0FBcEIsSUFBb0IsTUFBcEI7QUFFQThCLGdCQUFBLENBQUE4SSxPQUFBSCxJQUFBTSxLQUFBLFlBQUFILEtBQXVCLGNBQXZCLElBQXVCLE1BQXZCOztBQUVBLFFBQUd4UCxRQUFRZ1EsY0FBUixDQUF1QjdMLE1BQXZCLEVBQThCdUMsU0FBOUIsQ0FBSDtBQUNDLGFBQU94RSxHQUFHME4sS0FBSCxDQUFTM0wsT0FBVCxDQUFpQjtBQUFDd0YsYUFBS3RGO0FBQU4sT0FBakIsQ0FBUDtBQzBIRTs7QUR4SEg1RixjQUFVLElBQUl3RCxPQUFKLENBQVlzTixHQUFaLEVBQWlCQyxHQUFqQixDQUFWOztBQUVBLFFBQUdELElBQUlZLE9BQVA7QUFDQzlMLGVBQVNrTCxJQUFJWSxPQUFKLENBQVksV0FBWixDQUFUO0FBQ0F2SixrQkFBWTJJLElBQUlZLE9BQUosQ0FBWSxjQUFaLENBQVo7QUN5SEU7O0FEdEhILFFBQUcsQ0FBQzlMLE1BQUQsSUFBVyxDQUFDdUMsU0FBZjtBQUNDdkMsZUFBUzVGLFFBQVE0SCxHQUFSLENBQVksV0FBWixDQUFUO0FBQ0FPLGtCQUFZbkksUUFBUTRILEdBQVIsQ0FBWSxjQUFaLENBQVo7QUN3SEU7O0FEdEhILFFBQUcsQ0FBQ2hDLE1BQUQsSUFBVyxDQUFDdUMsU0FBZjtBQUNDLGFBQU8sS0FBUDtBQ3dIRTs7QUR0SEgsUUFBRzFHLFFBQVFnUSxjQUFSLENBQXVCN0wsTUFBdkIsRUFBK0J1QyxTQUEvQixDQUFIO0FBQ0MsYUFBT3hFLEdBQUcwTixLQUFILENBQVMzTCxPQUFULENBQWlCO0FBQUN3RixhQUFLdEY7QUFBTixPQUFqQixDQUFQO0FDMEhFOztBRHhISCxXQUFPLEtBQVA7QUEzQ3lCLEdBQTFCOztBQThDQW5FLFVBQVFnUSxjQUFSLEdBQXlCLFVBQUM3TCxNQUFELEVBQVN1QyxTQUFUO0FBQ3hCLFFBQUF3SixXQUFBLEVBQUFoTSxJQUFBOztBQUFBLFFBQUdDLFVBQVd1QyxTQUFkO0FBQ0N3SixvQkFBY3JKLFNBQVNzSixlQUFULENBQXlCekosU0FBekIsQ0FBZDtBQUNBeEMsYUFBT3pGLE9BQU9tUixLQUFQLENBQWEzTCxPQUFiLENBQ047QUFBQXdGLGFBQUt0RixNQUFMO0FBQ0EsbURBQTJDK0w7QUFEM0MsT0FETSxDQUFQOztBQUdBLFVBQUdoTSxJQUFIO0FBQ0MsZUFBTyxJQUFQO0FBREQ7QUFHQyxlQUFPLEtBQVA7QUFSRjtBQ29JRzs7QUQzSEgsV0FBTyxLQUFQO0FBVndCLEdBQXpCO0FDd0lBOztBRDNIRCxJQUFHekYsT0FBT0ksUUFBVjtBQUNDbUQsV0FBU2dHLFFBQVEsUUFBUixDQUFUOztBQUNBaEksVUFBUW9RLE9BQVIsR0FBa0IsVUFBQ2IsUUFBRCxFQUFXbkwsR0FBWCxFQUFnQmlNLEVBQWhCO0FBQ2pCLFFBQUFDLENBQUEsRUFBQUMsUUFBQSxFQUFBQyxXQUFBLEVBQUF2SCxDQUFBLEVBQUErRixDQUFBLEVBQUF5QixLQUFBLEVBQUFDLEdBQUEsRUFBQTdQLENBQUE7O0FBQUE7QUFDQzRQLGNBQVEsRUFBUjtBQUNBQyxZQUFNdE0sSUFBSWhELE1BQVY7O0FBQ0EsVUFBR3NQLE1BQU0sRUFBVDtBQUNDSixZQUFJLEVBQUo7QUFDQXRCLFlBQUksQ0FBSjtBQUNBbk8sWUFBSSxLQUFLNlAsR0FBVDs7QUFDQSxlQUFNMUIsSUFBSW5PLENBQVY7QUFDQ3lQLGNBQUksTUFBTUEsQ0FBVjtBQUNBdEI7QUFGRDs7QUFHQXlCLGdCQUFRck0sTUFBTWtNLENBQWQ7QUFQRCxhQVFLLElBQUdJLE9BQU8sRUFBVjtBQUNKRCxnQkFBUXJNLElBQUlqRCxLQUFKLENBQVUsQ0FBVixFQUFhLEVBQWIsQ0FBUjtBQ2dJRzs7QUQ5SEpvUCxpQkFBV3ZPLE9BQU8yTyxnQkFBUCxDQUF3QixhQUF4QixFQUF1QyxJQUFJQyxNQUFKLENBQVdILEtBQVgsRUFBa0IsTUFBbEIsQ0FBdkMsRUFBa0UsSUFBSUcsTUFBSixDQUFXUCxFQUFYLEVBQWUsTUFBZixDQUFsRSxDQUFYO0FBRUFHLG9CQUFjSSxPQUFPQyxNQUFQLENBQWMsQ0FBQ04sU0FBU08sTUFBVCxDQUFnQnZCLFFBQWhCLEVBQTBCLFFBQTFCLENBQUQsRUFBc0NnQixTQUFTUSxLQUFULEVBQXRDLENBQWQsQ0FBZDtBQUVBeEIsaUJBQVdpQixZQUFZOU4sUUFBWixFQUFYO0FBQ0EsYUFBTzZNLFFBQVA7QUFuQkQsYUFBQTVGLE1BQUE7QUFvQk1WLFVBQUFVLE1BQUE7QUFDTCxhQUFPNEYsUUFBUDtBQytIRTtBRHJKYyxHQUFsQjs7QUF3QkF2UCxVQUFRZ1IsT0FBUixHQUFrQixVQUFDekIsUUFBRCxFQUFXbkwsR0FBWCxFQUFnQmlNLEVBQWhCO0FBQ2pCLFFBQUFDLENBQUEsRUFBQVcsTUFBQSxFQUFBQyxXQUFBLEVBQUFsQyxDQUFBLEVBQUF5QixLQUFBLEVBQUFDLEdBQUEsRUFBQTdQLENBQUE7QUFBQTRQLFlBQVEsRUFBUjtBQUNBQyxVQUFNdE0sSUFBSWhELE1BQVY7O0FBQ0EsUUFBR3NQLE1BQU0sRUFBVDtBQUNDSixVQUFJLEVBQUo7QUFDQXRCLFVBQUksQ0FBSjtBQUNBbk8sVUFBSSxLQUFLNlAsR0FBVDs7QUFDQSxhQUFNMUIsSUFBSW5PLENBQVY7QUFDQ3lQLFlBQUksTUFBTUEsQ0FBVjtBQUNBdEI7QUFGRDs7QUFHQXlCLGNBQVFyTSxNQUFNa00sQ0FBZDtBQVBELFdBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELGNBQVFyTSxJQUFJakQsS0FBSixDQUFVLENBQVYsRUFBYSxFQUFiLENBQVI7QUNrSUU7O0FEaElIOFAsYUFBU2pQLE9BQU9tUCxjQUFQLENBQXNCLGFBQXRCLEVBQXFDLElBQUlQLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUFyQyxFQUFnRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWhFLENBQVQ7QUFFQWEsa0JBQWNOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDSSxPQUFPSCxNQUFQLENBQWMsSUFBSUYsTUFBSixDQUFXckIsUUFBWCxFQUFxQixNQUFyQixDQUFkLENBQUQsRUFBOEMwQixPQUFPRixLQUFQLEVBQTlDLENBQWQsQ0FBZDtBQUVBeEIsZUFBVzJCLFlBQVl4TyxRQUFaLENBQXFCLFFBQXJCLENBQVg7QUFFQSxXQUFPNk0sUUFBUDtBQXBCaUIsR0FBbEI7O0FBc0JBdlAsVUFBUW9SLHdCQUFSLEdBQW1DLFVBQUNDLFlBQUQ7QUFFbEMsUUFBQUMsVUFBQSxFQUFBcEIsV0FBQSxFQUFBcUIsR0FBQSxFQUFBck4sSUFBQSxFQUFBQyxNQUFBOztBQUFBLFFBQUcsQ0FBQ2tOLFlBQUo7QUFDQyxhQUFPLElBQVA7QUMrSEU7O0FEN0hIbE4sYUFBU2tOLGFBQWFHLEtBQWIsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsQ0FBVDtBQUVBdEIsa0JBQWNySixTQUFTc0osZUFBVCxDQUF5QmtCLFlBQXpCLENBQWQ7QUFFQW5OLFdBQU9oQyxHQUFHME4sS0FBSCxDQUFTM0wsT0FBVCxDQUFpQjtBQUFDd0YsV0FBS3RGLE1BQU47QUFBYyw2QkFBdUIrTDtBQUFyQyxLQUFqQixDQUFQOztBQUVBLFFBQUdoTSxJQUFIO0FBQ0MsYUFBT0MsTUFBUDtBQUREO0FBSUNtTixtQkFBYUcsYUFBYUMsV0FBYixDQUF5QkMsV0FBdEM7QUFFQUosWUFBTUQsV0FBV3JOLE9BQVgsQ0FBbUI7QUFBQyx1QkFBZW9OO0FBQWhCLE9BQW5CLENBQU47O0FBQ0EsVUFBR0UsR0FBSDtBQUVDLGFBQUFBLE9BQUEsT0FBR0EsSUFBS0ssT0FBUixHQUFRLE1BQVIsSUFBa0IsSUFBSXBILElBQUosRUFBbEI7QUFDQyxpQkFBTyx5QkFBdUI2RyxZQUF2QixHQUFvQyxjQUEzQztBQUREO0FBR0MsaUJBQUFFLE9BQUEsT0FBT0EsSUFBS3BOLE1BQVosR0FBWSxNQUFaO0FBTEY7QUFBQTtBQU9DLGVBQU8seUJBQXVCa04sWUFBdkIsR0FBb0MsZ0JBQTNDO0FBZEY7QUM4SUc7O0FEL0hILFdBQU8sSUFBUDtBQTFCa0MsR0FBbkM7O0FBNEJBclIsVUFBUTZSLHNCQUFSLEdBQWlDLFVBQUN4QyxHQUFELEVBQU1DLEdBQU47QUFFaEMsUUFBQTVJLFNBQUEsRUFBQW5JLE9BQUEsRUFBQThELEdBQUEsRUFBQUMsSUFBQSxFQUFBc0MsSUFBQSxFQUFBNEssSUFBQSxFQUFBckwsTUFBQTtBQUFBQSxhQUFBLENBQUE5QixNQUFBZ04sSUFBQU0sS0FBQSxZQUFBdE4sSUFBb0IsV0FBcEIsSUFBb0IsTUFBcEI7QUFFQXFFLGdCQUFBLENBQUFwRSxPQUFBK00sSUFBQU0sS0FBQSxZQUFBck4sS0FBdUIsY0FBdkIsSUFBdUIsTUFBdkI7O0FBRUEsUUFBR3RDLFFBQVFnUSxjQUFSLENBQXVCN0wsTUFBdkIsRUFBOEJ1QyxTQUE5QixDQUFIO0FBQ0MsY0FBQTlCLE9BQUExQyxHQUFBME4sS0FBQSxDQUFBM0wsT0FBQTtBQytIS3dGLGFBQUt0RjtBRC9IVixhQ2dJVSxJRGhJVixHQ2dJaUJTLEtEaEl1QjZFLEdBQXhDLEdBQXdDLE1BQXhDO0FDaUlFOztBRC9ISGxMLGNBQVUsSUFBSXdELE9BQUosQ0FBWXNOLEdBQVosRUFBaUJDLEdBQWpCLENBQVY7O0FBRUEsUUFBR0QsSUFBSVksT0FBUDtBQUNDOUwsZUFBU2tMLElBQUlZLE9BQUosQ0FBWSxXQUFaLENBQVQ7QUFDQXZKLGtCQUFZMkksSUFBSVksT0FBSixDQUFZLGNBQVosQ0FBWjtBQ2dJRTs7QUQ3SEgsUUFBRyxDQUFDOUwsTUFBRCxJQUFXLENBQUN1QyxTQUFmO0FBQ0N2QyxlQUFTNUYsUUFBUTRILEdBQVIsQ0FBWSxXQUFaLENBQVQ7QUFDQU8sa0JBQVluSSxRQUFRNEgsR0FBUixDQUFZLGNBQVosQ0FBWjtBQytIRTs7QUQ3SEgsUUFBRyxDQUFDaEMsTUFBRCxJQUFXLENBQUN1QyxTQUFmO0FBQ0MsYUFBTyxJQUFQO0FDK0hFOztBRDdISCxRQUFHMUcsUUFBUWdRLGNBQVIsQ0FBdUI3TCxNQUF2QixFQUErQnVDLFNBQS9CLENBQUg7QUFDQyxjQUFBOEksT0FBQXROLEdBQUEwTixLQUFBLENBQUEzTCxPQUFBO0FDK0hLd0YsYUFBS3RGO0FEL0hWLGFDZ0lVLElEaElWLEdDZ0lpQnFMLEtEaEl1Qi9GLEdBQXhDLEdBQXdDLE1BQXhDO0FDaUlFO0FEeko2QixHQUFqQzs7QUEwQkF6SixVQUFROFIsc0JBQVIsR0FBaUMsVUFBQ3pDLEdBQUQsRUFBTUMsR0FBTjtBQUNoQyxRQUFBckcsQ0FBQSxFQUFBL0UsSUFBQSxFQUFBQyxNQUFBOztBQUFBO0FBQ0NBLGVBQVNrTCxJQUFJbEwsTUFBYjtBQUVBRCxhQUFPaEMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUI7QUFBQ3dGLGFBQUt0RjtBQUFOLE9BQWpCLENBQVA7O0FBRUEsVUFBRyxDQUFDQSxNQUFELElBQVcsQ0FBQ0QsSUFBZjtBQUNDNk4sbUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNDO0FBQUEyQyxnQkFDQztBQUFBLHFCQUFTO0FBQVQsV0FERDtBQUVBQyxnQkFBTTtBQUZOLFNBREQ7QUFJQSxlQUFPLEtBQVA7QUFMRDtBQU9DLGVBQU8sSUFBUDtBQVpGO0FBQUEsYUFBQXZJLE1BQUE7QUFhTVYsVUFBQVUsTUFBQTs7QUFDTCxVQUFHLENBQUN4RixNQUFELElBQVcsQ0FBQ0QsSUFBZjtBQUNDNk4sbUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNDO0FBQUE0QyxnQkFBTSxHQUFOO0FBQ0FELGdCQUNDO0FBQUEscUJBQVNoSixFQUFFWSxPQUFYO0FBQ0EsdUJBQVc7QUFEWDtBQUZELFNBREQ7QUFLQSxlQUFPLEtBQVA7QUFwQkY7QUM4Skc7QUQvSjZCLEdBQWpDO0FDaUtBOztBRHBJRDVILFFBQVEsVUFBQ3NQLEdBQUQ7QUN1SU4sU0R0SUR0RSxFQUFFckMsSUFBRixDQUFPcUMsRUFBRWtGLFNBQUYsQ0FBWVosR0FBWixDQUFQLEVBQXlCLFVBQUNoUixJQUFEO0FBQ3hCLFFBQUE2UixJQUFBOztBQUFBLFFBQUcsQ0FBSW5GLEVBQUUxTSxJQUFGLENBQUosSUFBb0IwTSxFQUFBcE4sU0FBQSxDQUFBVSxJQUFBLFNBQXZCO0FBQ0M2UixhQUFPbkYsRUFBRTFNLElBQUYsSUFBVWdSLElBQUloUixJQUFKLENBQWpCO0FDd0lHLGFEdklIME0sRUFBRXBOLFNBQUYsQ0FBWVUsSUFBWixJQUFvQjtBQUNuQixZQUFBOFIsSUFBQTtBQUFBQSxlQUFPLENBQUMsS0FBS0MsUUFBTixDQUFQO0FBQ0F4UixhQUFLTyxLQUFMLENBQVdnUixJQUFYLEVBQWlCRSxTQUFqQjtBQUNBLGVBQU85QyxPQUFPK0MsSUFBUCxDQUFZLElBQVosRUFBa0JKLEtBQUsvUSxLQUFMLENBQVc0TCxDQUFYLEVBQWNvRixJQUFkLENBQWxCLENBQVA7QUFIbUIsT0N1SWpCO0FBTUQ7QURoSkosSUNzSUM7QUR2SU0sQ0FBUjs7QUFXQSxJQUFHNVQsT0FBT0ksUUFBVjtBQUVDbUIsVUFBUXlTLFNBQVIsR0FBb0IsVUFBQ0MsSUFBRDtBQUNuQixRQUFBQyxHQUFBOztBQUFBLFFBQUcsQ0FBQ0QsSUFBSjtBQUNDQSxhQUFPLElBQUlsSSxJQUFKLEVBQVA7QUMySUU7O0FEMUlINkQsVUFBTXFFLElBQU4sRUFBWWxJLElBQVo7QUFDQW1JLFVBQU1ELEtBQUtFLE1BQUwsRUFBTjs7QUFFQSxRQUFHRCxRQUFPLENBQVAsSUFBWUEsUUFBTyxDQUF0QjtBQUNDLGFBQU8sSUFBUDtBQzJJRTs7QUR6SUgsV0FBTyxLQUFQO0FBVG1CLEdBQXBCOztBQVdBM1MsVUFBUTZTLG1CQUFSLEdBQThCLFVBQUNILElBQUQsRUFBT0ksSUFBUDtBQUM3QixRQUFBQyxZQUFBLEVBQUFDLFVBQUE7QUFBQTNFLFVBQU1xRSxJQUFOLEVBQVlsSSxJQUFaO0FBQ0E2RCxVQUFNeUUsSUFBTixFQUFZRyxNQUFaO0FBQ0FELGlCQUFhLElBQUl4SSxJQUFKLENBQVNrSSxJQUFULENBQWI7O0FBQ0FLLG1CQUFlLFVBQUMvRCxDQUFELEVBQUk4RCxJQUFKO0FBQ2QsVUFBRzlELElBQUk4RCxJQUFQO0FBQ0NFLHFCQUFhLElBQUl4SSxJQUFKLENBQVN3SSxXQUFXRSxPQUFYLEtBQXVCLEtBQUcsRUFBSCxHQUFNLEVBQU4sR0FBUyxJQUF6QyxDQUFiOztBQUNBLFlBQUcsQ0FBQ2xULFFBQVF5UyxTQUFSLENBQWtCTyxVQUFsQixDQUFKO0FBQ0NoRTtBQzRJSTs7QUQzSUwrRCxxQkFBYS9ELENBQWIsRUFBZ0I4RCxJQUFoQjtBQzZJRztBRGxKVSxLQUFmOztBQU9BQyxpQkFBYSxDQUFiLEVBQWdCRCxJQUFoQjtBQUNBLFdBQU9FLFVBQVA7QUFaNkIsR0FBOUI7O0FBZ0JBaFQsVUFBUW1ULDBCQUFSLEdBQXFDLFVBQUNULElBQUQsRUFBT1UsSUFBUDtBQUNwQyxRQUFBQyxjQUFBLEVBQUFuSixRQUFBLEVBQUFvSixVQUFBLEVBQUF0RSxDQUFBLEVBQUF1RSxDQUFBLEVBQUE3QyxHQUFBLEVBQUE4QyxTQUFBLEVBQUFuUixHQUFBLEVBQUFvUixXQUFBLEVBQUFDLFVBQUEsRUFBQUMsV0FBQTtBQUFBdEYsVUFBTXFFLElBQU4sRUFBWWxJLElBQVo7QUFDQW1KLGtCQUFBLENBQUF0UixNQUFBNUQsT0FBQUMsUUFBQSxDQUFBa1YsTUFBQSxZQUFBdlIsSUFBc0NzUixXQUF0QyxHQUFzQyxNQUF0Qzs7QUFDQSxRQUFHLENBQUlBLFdBQUosSUFBbUIxRyxFQUFFNEcsT0FBRixDQUFVRixXQUFWLENBQXRCO0FBQ0MvSixjQUFRM0IsS0FBUixDQUFjLHFCQUFkO0FBQ0EwTCxvQkFBYyxDQUFDO0FBQUMsZ0JBQVEsQ0FBVDtBQUFZLGtCQUFVO0FBQXRCLE9BQUQsRUFBNkI7QUFBQyxnQkFBUSxFQUFUO0FBQWEsa0JBQVU7QUFBdkIsT0FBN0IsQ0FBZDtBQ3FKRTs7QURuSkhqRCxVQUFNaUQsWUFBWXZTLE1BQWxCO0FBQ0FzUyxpQkFBYSxJQUFJbEosSUFBSixDQUFTa0ksSUFBVCxDQUFiO0FBQ0F4SSxlQUFXLElBQUlNLElBQUosQ0FBU2tJLElBQVQsQ0FBWDtBQUNBZ0IsZUFBV0ksUUFBWCxDQUFvQkgsWUFBWSxDQUFaLEVBQWVJLElBQW5DO0FBQ0FMLGVBQVdNLFVBQVgsQ0FBc0JMLFlBQVksQ0FBWixFQUFlTSxNQUFyQztBQUNBL0osYUFBUzRKLFFBQVQsQ0FBa0JILFlBQVlqRCxNQUFNLENBQWxCLEVBQXFCcUQsSUFBdkM7QUFDQTdKLGFBQVM4SixVQUFULENBQW9CTCxZQUFZakQsTUFBTSxDQUFsQixFQUFxQnVELE1BQXpDO0FBRUFaLHFCQUFpQixJQUFJN0ksSUFBSixDQUFTa0ksSUFBVCxDQUFqQjtBQUVBYSxRQUFJLENBQUo7QUFDQUMsZ0JBQVk5QyxNQUFNLENBQWxCOztBQUNBLFFBQUdnQyxPQUFPZ0IsVUFBVjtBQUNDLFVBQUdOLElBQUg7QUFDQ0csWUFBSSxDQUFKO0FBREQ7QUFJQ0EsWUFBSTdDLE1BQUksQ0FBUjtBQUxGO0FBQUEsV0FNSyxJQUFHZ0MsUUFBUWdCLFVBQVIsSUFBdUJoQixPQUFPeEksUUFBakM7QUFDSjhFLFVBQUksQ0FBSjs7QUFDQSxhQUFNQSxJQUFJd0UsU0FBVjtBQUNDRixxQkFBYSxJQUFJOUksSUFBSixDQUFTa0ksSUFBVCxDQUFiO0FBQ0FlLHNCQUFjLElBQUlqSixJQUFKLENBQVNrSSxJQUFULENBQWQ7QUFDQVksbUJBQVdRLFFBQVgsQ0FBb0JILFlBQVkzRSxDQUFaLEVBQWUrRSxJQUFuQztBQUNBVCxtQkFBV1UsVUFBWCxDQUFzQkwsWUFBWTNFLENBQVosRUFBZWlGLE1BQXJDO0FBQ0FSLG9CQUFZSyxRQUFaLENBQXFCSCxZQUFZM0UsSUFBSSxDQUFoQixFQUFtQitFLElBQXhDO0FBQ0FOLG9CQUFZTyxVQUFaLENBQXVCTCxZQUFZM0UsSUFBSSxDQUFoQixFQUFtQmlGLE1BQTFDOztBQUVBLFlBQUd2QixRQUFRWSxVQUFSLElBQXVCWixPQUFPZSxXQUFqQztBQUNDO0FDa0pJOztBRGhKTHpFO0FBWEQ7O0FBYUEsVUFBR29FLElBQUg7QUFDQ0csWUFBSXZFLElBQUksQ0FBUjtBQUREO0FBR0N1RSxZQUFJdkUsSUFBSTBCLE1BQUksQ0FBWjtBQWxCRztBQUFBLFdBb0JBLElBQUdnQyxRQUFReEksUUFBWDtBQUNKLFVBQUdrSixJQUFIO0FBQ0NHLFlBQUlDLFlBQVksQ0FBaEI7QUFERDtBQUdDRCxZQUFJQyxZQUFZOUMsTUFBSSxDQUFwQjtBQUpHO0FDdUpGOztBRGpKSCxRQUFHNkMsSUFBSUMsU0FBUDtBQUVDSCx1QkFBaUJyVCxRQUFRNlMsbUJBQVIsQ0FBNEJILElBQTVCLEVBQWtDLENBQWxDLENBQWpCO0FBQ0FXLHFCQUFlUyxRQUFmLENBQXdCSCxZQUFZSixJQUFJQyxTQUFKLEdBQWdCLENBQTVCLEVBQStCTyxJQUF2RDtBQUNBVixxQkFBZVcsVUFBZixDQUEwQkwsWUFBWUosSUFBSUMsU0FBSixHQUFnQixDQUE1QixFQUErQlMsTUFBekQ7QUFKRCxXQUtLLElBQUdWLEtBQUtDLFNBQVI7QUFDSkgscUJBQWVTLFFBQWYsQ0FBd0JILFlBQVlKLENBQVosRUFBZVEsSUFBdkM7QUFDQVYscUJBQWVXLFVBQWYsQ0FBMEJMLFlBQVlKLENBQVosRUFBZVUsTUFBekM7QUNrSkU7O0FEaEpILFdBQU9aLGNBQVA7QUE1RG9DLEdBQXJDO0FDK01BOztBRGpKRCxJQUFHNVUsT0FBT0ksUUFBVjtBQUNDb08sSUFBRWlILE1BQUYsQ0FBU2xVLE9BQVQsRUFDQztBQUFBbVUscUJBQWlCLFVBQUNDLEtBQUQsRUFBUWpRLE1BQVIsRUFBZ0J1QyxTQUFoQjtBQUNoQixVQUFBVSxHQUFBLEVBQUFrSixDQUFBLEVBQUFXLE1BQUEsRUFBQUMsV0FBQSxFQUFBaEIsV0FBQSxFQUFBbEIsQ0FBQSxFQUFBcUIsRUFBQSxFQUFBSSxLQUFBLEVBQUFDLEdBQUEsRUFBQTdQLENBQUEsRUFBQXdULEdBQUEsRUFBQUMsTUFBQSxFQUFBekUsVUFBQSxFQUFBMEUsYUFBQSxFQUFBclEsSUFBQTtBQUFBbEMsZUFBU2dHLFFBQVEsUUFBUixDQUFUO0FBQ0FaLFlBQU1sRixHQUFHbUYsSUFBSCxDQUFRcEQsT0FBUixDQUFnQm1RLEtBQWhCLENBQU47O0FBQ0EsVUFBR2hOLEdBQUg7QUFDQ2tOLGlCQUFTbE4sSUFBSWtOLE1BQWI7QUNxSkc7O0FEbkpKLFVBQUduUSxVQUFXdUMsU0FBZDtBQUNDd0osc0JBQWNySixTQUFTc0osZUFBVCxDQUF5QnpKLFNBQXpCLENBQWQ7QUFDQXhDLGVBQU96RixPQUFPbVIsS0FBUCxDQUFhM0wsT0FBYixDQUNOO0FBQUF3RixlQUFLdEYsTUFBTDtBQUNBLHFEQUEyQytMO0FBRDNDLFNBRE0sQ0FBUDs7QUFHQSxZQUFHaE0sSUFBSDtBQUNDMkwsdUJBQWEzTCxLQUFLMkwsVUFBbEI7O0FBQ0EsY0FBR3pJLElBQUlrTixNQUFQO0FBQ0NqRSxpQkFBS2pKLElBQUlrTixNQUFUO0FBREQ7QUFHQ2pFLGlCQUFLLGtCQUFMO0FDc0pLOztBRHJKTmdFLGdCQUFNRyxTQUFTLElBQUloSyxJQUFKLEdBQVcwSSxPQUFYLEtBQXFCLElBQTlCLEVBQW9DeFEsUUFBcEMsRUFBTjtBQUNBK04sa0JBQVEsRUFBUjtBQUNBQyxnQkFBTWIsV0FBV3pPLE1BQWpCOztBQUNBLGNBQUdzUCxNQUFNLEVBQVQ7QUFDQ0osZ0JBQUksRUFBSjtBQUNBdEIsZ0JBQUksQ0FBSjtBQUNBbk8sZ0JBQUksS0FBSzZQLEdBQVQ7O0FBQ0EsbUJBQU0xQixJQUFJbk8sQ0FBVjtBQUNDeVAsa0JBQUksTUFBTUEsQ0FBVjtBQUNBdEI7QUFGRDs7QUFHQXlCLG9CQUFRWixhQUFhUyxDQUFyQjtBQVBELGlCQVFLLElBQUdJLE9BQU8sRUFBVjtBQUNKRCxvQkFBUVosV0FBVzFPLEtBQVgsQ0FBaUIsQ0FBakIsRUFBbUIsRUFBbkIsQ0FBUjtBQ3dKSzs7QUR0Sk44UCxtQkFBU2pQLE9BQU9tUCxjQUFQLENBQXNCLGFBQXRCLEVBQXFDLElBQUlQLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUFyQyxFQUFnRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWhFLENBQVQ7QUFFQWEsd0JBQWNOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDSSxPQUFPSCxNQUFQLENBQWMsSUFBSUYsTUFBSixDQUFXeUQsR0FBWCxFQUFnQixNQUFoQixDQUFkLENBQUQsRUFBeUNwRCxPQUFPRixLQUFQLEVBQXpDLENBQWQsQ0FBZDtBQUVBd0QsMEJBQWdCckQsWUFBWXhPLFFBQVosQ0FBcUIsUUFBckIsQ0FBaEI7QUE3QkY7QUNvTEk7O0FEckpKLGFBQU82UixhQUFQO0FBckNEO0FBdUNBeFUsWUFBUSxVQUFDb0UsTUFBRCxFQUFTc1EsTUFBVDtBQUNQLFVBQUExVSxNQUFBLEVBQUFtRSxJQUFBO0FBQUFBLGFBQU9oQyxHQUFHME4sS0FBSCxDQUFTM0wsT0FBVCxDQUFpQjtBQUFDd0YsYUFBSXRGO0FBQUwsT0FBakIsRUFBOEI7QUFBQzZJLGdCQUFRO0FBQUNqTixrQkFBUTtBQUFUO0FBQVQsT0FBOUIsQ0FBUDtBQUNBQSxlQUFBbUUsUUFBQSxPQUFTQSxLQUFNbkUsTUFBZixHQUFlLE1BQWY7O0FBQ0EsVUFBRzBVLE1BQUg7QUFDQyxZQUFHMVUsV0FBVSxPQUFiO0FBQ0NBLG1CQUFTLElBQVQ7QUM4Skk7O0FEN0pMLFlBQUdBLFdBQVUsT0FBYjtBQUNDQSxtQkFBUyxPQUFUO0FBSkY7QUNvS0k7O0FEL0pKLGFBQU9BLE1BQVA7QUEvQ0Q7QUFpREEyVSwrQkFBMkIsVUFBQ2hGLFFBQUQ7QUFDMUIsYUFBTyxDQUFJalIsT0FBT21SLEtBQVAsQ0FBYTNMLE9BQWIsQ0FBcUI7QUFBRXlMLGtCQUFVO0FBQUVpRixrQkFBUyxJQUFJNVIsTUFBSixDQUFXLE1BQU10RSxPQUFPbVcsYUFBUCxDQUFxQmxGLFFBQXJCLEVBQStCbUYsSUFBL0IsRUFBTixHQUE4QyxHQUF6RCxFQUE4RCxHQUE5RDtBQUFYO0FBQVosT0FBckIsQ0FBWDtBQWxERDtBQXFEQUMsc0JBQWtCLFVBQUNDLEdBQUQ7QUFDakIsVUFBQUMsTUFBQSxFQUFBQyxLQUFBO0FBQUFELGVBQVNwVSxFQUFFLGtCQUFGLENBQVQ7QUFDQXFVLGNBQVEsSUFBUjs7QUFDQSxXQUFPRixHQUFQO0FBQ0NFLGdCQUFRLEtBQVI7QUNxS0c7O0FEcEtKLFdBQU8sTUFBTWpTLElBQU4sQ0FBVytSLEdBQVgsQ0FBUDtBQUNDRSxnQkFBUSxLQUFSO0FDc0tHOztBRHJLSixXQUFPLFlBQVlqUyxJQUFaLENBQWlCK1IsR0FBakIsQ0FBUDtBQUNDRSxnQkFBUSxLQUFSO0FDdUtHOztBRHRLSixVQUFHRixJQUFJM1QsTUFBSixHQUFhLENBQWhCO0FBQ0M2VCxnQkFBUSxLQUFSO0FDd0tHOztBRHZLSixVQUFHQSxLQUFIO0FBQ0MsZUFBTyxJQUFQO0FBREQ7QUFHQyxlQUFPO0FBQUFoTixpQkFDTjtBQUFBK00sb0JBQVFBO0FBQVI7QUFETSxTQUFQO0FDNktHO0FEaFBMO0FBQUEsR0FERDtBQ29QQTs7QUQ3S0RoVixRQUFRa1YsdUJBQVIsR0FBa0MsVUFBQ3JTLEdBQUQ7QUFDakMsU0FBT0EsSUFBSUYsT0FBSixDQUFZLG1DQUFaLEVBQWlELE1BQWpELENBQVA7QUFEaUMsQ0FBbEM7O0FBR0EzQyxRQUFRbVYsc0JBQVIsR0FBaUMsVUFBQ3RTLEdBQUQ7QUFDaEMsU0FBT0EsSUFBSUYsT0FBSixDQUFZLGlFQUFaLEVBQStFLEVBQS9FLENBQVA7QUFEZ0MsQ0FBakM7O0FBR0F5UyxRQUFRQyxTQUFSLEdBQW9CLFVBQUNDLFFBQUQ7QUFDbkIsTUFBQUMsTUFBQTtBQUFBQSxXQUFTLEVBQVQ7QUFDQUgsVUFBUUksV0FBUixDQUFvQixNQUFwQixFQUE0QnJJLElBQTVCLENBQWlDO0FBQUMvQyxXQUFPa0wsUUFBUjtBQUFpQkcsZ0JBQVcsSUFBNUI7QUFBaUNDLGFBQVE7QUFBekMsR0FBakMsRUFBaUY7QUFDaEYxSSxZQUFRO0FBQ1AySSxlQUFTLENBREY7QUFFUEMsa0JBQVksQ0FGTDtBQUdQQyxnQkFBVSxDQUhIO0FBSVBDLG1CQUFhO0FBSk47QUFEd0UsR0FBakYsRUFPR25WLE9BUEgsQ0FPVyxVQUFDeUcsR0FBRDtBQ3VMUixXRHRMRm1PLE9BQU9uTyxJQUFJcUMsR0FBWCxJQUFrQnJDLEdDc0xoQjtBRDlMSDtBQVVBLFNBQU9tTyxNQUFQO0FBWm1CLENBQXBCOztBQWNBLElBQUc5VyxPQUFPSSxRQUFWO0FBQ0NrRCxZQUFVaUcsUUFBUSxTQUFSLENBQVY7O0FBQ0FoSSxVQUFRK1YsWUFBUixHQUF1QixVQUFDMUcsR0FBRCxFQUFNQyxHQUFOO0FBQ3RCLFFBQUE1SSxTQUFBLEVBQUFuSSxPQUFBO0FBQUFBLGNBQVUsSUFBSXdELE9BQUosQ0FBWXNOLEdBQVosRUFBaUJDLEdBQWpCLENBQVY7QUFDQTVJLGdCQUFZMkksSUFBSVksT0FBSixDQUFZLGNBQVosS0FBK0IxUixRQUFRNEgsR0FBUixDQUFZLGNBQVosQ0FBM0M7O0FBQ0EsUUFBRyxDQUFDTyxTQUFELElBQWMySSxJQUFJWSxPQUFKLENBQVkrRixhQUExQixJQUEyQzNHLElBQUlZLE9BQUosQ0FBWStGLGFBQVosQ0FBMEJ4RSxLQUExQixDQUFnQyxHQUFoQyxFQUFxQyxDQUFyQyxNQUEyQyxRQUF6RjtBQUNDOUssa0JBQVkySSxJQUFJWSxPQUFKLENBQVkrRixhQUFaLENBQTBCeEUsS0FBMUIsQ0FBZ0MsR0FBaEMsRUFBcUMsQ0FBckMsQ0FBWjtBQ3lMRTs7QUR4TEgsV0FBTzlLLFNBQVA7QUFMc0IsR0FBdkI7QUNnTUE7O0FEekxELElBQUdqSSxPQUFPMkUsUUFBVjtBQUNDM0UsU0FBT2lCLE9BQVAsQ0FBZTtBQUNkLFFBQUd3RyxRQUFRQyxHQUFSLENBQVksZ0JBQVosQ0FBSDtBQzRMSSxhRDNMSDhQLGVBQWUzUSxPQUFmLENBQXVCLGdCQUF2QixFQUF5Q1ksUUFBUUMsR0FBUixDQUFZLGdCQUFaLENBQXpDLENDMkxHO0FBQ0Q7QUQ5TEo7O0FBTUFuRyxVQUFRa1csZUFBUixHQUEwQjtBQUN6QixRQUFHaFEsUUFBUUMsR0FBUixDQUFZLGdCQUFaLENBQUg7QUFDQyxhQUFPRCxRQUFRQyxHQUFSLENBQVksZ0JBQVosQ0FBUDtBQUREO0FBR0MsYUFBTzhQLGVBQWVqUixPQUFmLENBQXVCLGdCQUF2QixDQUFQO0FDMkxFO0FEL0xzQixHQUExQjtBQ2lNQSxDOzs7Ozs7Ozs7OztBQ2xqQ0R2RyxNQUFNLENBQUMwWCxPQUFQLENBQWUsWUFBWTtBQUMxQkMsY0FBWSxDQUFDQyxhQUFiLENBQTJCO0FBQUNDLGVBQVcsRUFBRUMsS0FBSyxDQUFDQyxRQUFOLENBQWVDLE9BQWYsQ0FBZDtBQUF1Q0MsY0FBVSxFQUFFSCxLQUFLLENBQUNDLFFBQU4sQ0FBZWpYLE1BQWY7QUFBbkQsR0FBM0I7QUFDQSxDQUZELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0FBLElBQUdkLE9BQU9JLFFBQVY7QUFDUUosU0FBT2tZLE9BQVAsQ0FDUTtBQUFBQyx5QkFBcUI7QUFDYixVQUFPLEtBQUF6UyxNQUFBLFFBQVA7QUFDUTtBQ0N6Qjs7QUFDRCxhREFrQmpDLEdBQUcwTixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUNySCxhQUFLLEtBQUN0RjtBQUFQLE9BQWhCLEVBQWdDO0FBQUMwUyxjQUFNO0FBQUNDLHNCQUFZLElBQUl0TSxJQUFKO0FBQWI7QUFBUCxPQUFoQyxDQ0FsQjtBREpVO0FBQUEsR0FEUjtBQ2NQOztBRE5ELElBQUcvTCxPQUFPMkUsUUFBVjtBQUNReUQsV0FBU2tRLE9BQVQsQ0FBaUI7QUNTckIsV0RSUXRZLE9BQU8rVCxJQUFQLENBQVkscUJBQVosQ0NRUjtBRFRJO0FDV1AsQzs7Ozs7Ozs7Ozs7O0FDckJELElBQUcvVCxPQUFPSSxRQUFWO0FBQ0VKLFNBQU9rWSxPQUFQLENBQ0U7QUFBQUsscUJBQWlCLFVBQUNDLEtBQUQ7QUFDZixVQUFBL1MsSUFBQTs7QUFBQSxVQUFPLEtBQUFDLE1BQUEsUUFBUDtBQUNFLGVBQU87QUFBQzhELGlCQUFPLElBQVI7QUFBYzRCLG1CQUFTO0FBQXZCLFNBQVA7QUNLRDs7QURKRCxVQUFHLENBQUlvTixLQUFQO0FBQ0UsZUFBTztBQUFDaFAsaUJBQU8sSUFBUjtBQUFjNEIsbUJBQVM7QUFBdkIsU0FBUDtBQ1NEOztBRFJELFVBQUcsQ0FBSSwyRkFBMkY3RyxJQUEzRixDQUFnR2lVLEtBQWhHLENBQVA7QUFDRSxlQUFPO0FBQUNoUCxpQkFBTyxJQUFSO0FBQWM0QixtQkFBUztBQUF2QixTQUFQO0FDYUQ7O0FEWkQsVUFBRzNILEdBQUcwTixLQUFILENBQVN6QyxJQUFULENBQWM7QUFBQywwQkFBa0I4SjtBQUFuQixPQUFkLEVBQXlDQyxLQUF6QyxLQUFpRCxDQUFwRDtBQUNFLGVBQU87QUFBQ2pQLGlCQUFPLElBQVI7QUFBYzRCLG1CQUFTO0FBQXZCLFNBQVA7QUNtQkQ7O0FEakJEM0YsYUFBT2hDLEdBQUcwTixLQUFILENBQVMzTCxPQUFULENBQWlCO0FBQUF3RixhQUFLLEtBQUt0RjtBQUFWLE9BQWpCLENBQVA7O0FBQ0EsVUFBR0QsS0FBQWlULE1BQUEsWUFBaUJqVCxLQUFLaVQsTUFBTCxDQUFZL1YsTUFBWixHQUFxQixDQUF6QztBQUNFYyxXQUFHME4sS0FBSCxDQUFTd0gsTUFBVCxDQUFnQnRHLE1BQWhCLENBQXVCO0FBQUNySCxlQUFLLEtBQUt0RjtBQUFYLFNBQXZCLEVBQ0U7QUFBQWtULGlCQUNFO0FBQUFGLG9CQUNFO0FBQUFHLHVCQUFTTCxLQUFUO0FBQ0FNLHdCQUFVO0FBRFY7QUFERjtBQURGLFNBREY7QUFERjtBQU9FclYsV0FBRzBOLEtBQUgsQ0FBU3dILE1BQVQsQ0FBZ0J0RyxNQUFoQixDQUF1QjtBQUFDckgsZUFBSyxLQUFLdEY7QUFBWCxTQUF2QixFQUNFO0FBQUEwUyxnQkFDRTtBQUFBaEgsd0JBQVlvSCxLQUFaO0FBQ0FFLG9CQUFRLENBQ047QUFBQUcsdUJBQVNMLEtBQVQ7QUFDQU0sd0JBQVU7QUFEVixhQURNO0FBRFI7QUFERixTQURGO0FDc0NEOztBRDlCRDFRLGVBQVMyUSxxQkFBVCxDQUErQixLQUFLclQsTUFBcEMsRUFBNEM4UyxLQUE1QztBQUVBLGFBQU8sRUFBUDtBQTVCRjtBQThCQVEsd0JBQW9CLFVBQUNSLEtBQUQ7QUFDbEIsVUFBQVMsQ0FBQSxFQUFBeFQsSUFBQTs7QUFBQSxVQUFPLEtBQUFDLE1BQUEsUUFBUDtBQUNFLGVBQU87QUFBQzhELGlCQUFPLElBQVI7QUFBYzRCLG1CQUFTO0FBQXZCLFNBQVA7QUNtQ0Q7O0FEbENELFVBQUcsQ0FBSW9OLEtBQVA7QUFDRSxlQUFPO0FBQUNoUCxpQkFBTyxJQUFSO0FBQWM0QixtQkFBUztBQUF2QixTQUFQO0FDdUNEOztBRHJDRDNGLGFBQU9oQyxHQUFHME4sS0FBSCxDQUFTM0wsT0FBVCxDQUFpQjtBQUFBd0YsYUFBSyxLQUFLdEY7QUFBVixPQUFqQixDQUFQOztBQUNBLFVBQUdELEtBQUFpVCxNQUFBLFlBQWlCalQsS0FBS2lULE1BQUwsQ0FBWS9WLE1BQVosSUFBc0IsQ0FBMUM7QUFDRXNXLFlBQUksSUFBSjtBQUNBeFQsYUFBS2lULE1BQUwsQ0FBWXhXLE9BQVosQ0FBb0IsVUFBQ3NJLENBQUQ7QUFDbEIsY0FBR0EsRUFBRXFPLE9BQUYsS0FBYUwsS0FBaEI7QUFDRVMsZ0JBQUl6TyxDQUFKO0FDeUNEO0FEM0NIO0FBS0EvRyxXQUFHME4sS0FBSCxDQUFTd0gsTUFBVCxDQUFnQnRHLE1BQWhCLENBQXVCO0FBQUNySCxlQUFLLEtBQUt0RjtBQUFYLFNBQXZCLEVBQ0U7QUFBQXdULGlCQUNFO0FBQUFSLG9CQUNFTztBQURGO0FBREYsU0FERjtBQVBGO0FBWUUsZUFBTztBQUFDelAsaUJBQU8sSUFBUjtBQUFjNEIsbUJBQVM7QUFBdkIsU0FBUDtBQytDRDs7QUQ3Q0QsYUFBTyxFQUFQO0FBbkRGO0FBcURBK04sd0JBQW9CLFVBQUNYLEtBQUQ7QUFDbEIsVUFBTyxLQUFBOVMsTUFBQSxRQUFQO0FBQ0UsZUFBTztBQUFDOEQsaUJBQU8sSUFBUjtBQUFjNEIsbUJBQVM7QUFBdkIsU0FBUDtBQ2tERDs7QURqREQsVUFBRyxDQUFJb04sS0FBUDtBQUNFLGVBQU87QUFBQ2hQLGlCQUFPLElBQVI7QUFBYzRCLG1CQUFTO0FBQXZCLFNBQVA7QUNzREQ7O0FEckRELFVBQUcsQ0FBSSwyRkFBMkY3RyxJQUEzRixDQUFnR2lVLEtBQWhHLENBQVA7QUFDRSxlQUFPO0FBQUNoUCxpQkFBTyxJQUFSO0FBQWM0QixtQkFBUztBQUF2QixTQUFQO0FDMEREOztBRHZERGhELGVBQVMyUSxxQkFBVCxDQUErQixLQUFLclQsTUFBcEMsRUFBNEM4UyxLQUE1QztBQUVBLGFBQU8sRUFBUDtBQWhFRjtBQWtFQVksNkJBQXlCLFVBQUNaLEtBQUQ7QUFDdkIsVUFBQUUsTUFBQSxFQUFBalQsSUFBQTs7QUFBQSxVQUFPLEtBQUFDLE1BQUEsUUFBUDtBQUNFLGVBQU87QUFBQzhELGlCQUFPLElBQVI7QUFBYzRCLG1CQUFTO0FBQXZCLFNBQVA7QUM0REQ7O0FEM0RELFVBQUcsQ0FBSW9OLEtBQVA7QUFDRSxlQUFPO0FBQUNoUCxpQkFBTyxJQUFSO0FBQWM0QixtQkFBUztBQUF2QixTQUFQO0FDZ0VEOztBRDlERDNGLGFBQU9oQyxHQUFHME4sS0FBSCxDQUFTM0wsT0FBVCxDQUFpQjtBQUFBd0YsYUFBSyxLQUFLdEY7QUFBVixPQUFqQixDQUFQO0FBQ0FnVCxlQUFTalQsS0FBS2lULE1BQWQ7QUFDQUEsYUFBT3hXLE9BQVAsQ0FBZSxVQUFDc0ksQ0FBRDtBQUNiLFlBQUdBLEVBQUVxTyxPQUFGLEtBQWFMLEtBQWhCO0FDa0VFLGlCRGpFQWhPLEVBQUU2TyxPQUFGLEdBQVksSUNpRVo7QURsRUY7QUNvRUUsaUJEakVBN08sRUFBRTZPLE9BQUYsR0FBWSxLQ2lFWjtBQUNEO0FEdEVIO0FBTUE1VixTQUFHME4sS0FBSCxDQUFTd0gsTUFBVCxDQUFnQnRHLE1BQWhCLENBQXVCO0FBQUNySCxhQUFLLEtBQUt0RjtBQUFYLE9BQXZCLEVBQ0U7QUFBQTBTLGNBQ0U7QUFBQU0sa0JBQVFBLE1BQVI7QUFDQUYsaUJBQU9BO0FBRFA7QUFERixPQURGO0FBS0EvVSxTQUFHNkssV0FBSCxDQUFlcUssTUFBZixDQUFzQnRHLE1BQXRCLENBQTZCO0FBQUM1TSxjQUFNLEtBQUtDO0FBQVosT0FBN0IsRUFBaUQ7QUFBQzBTLGNBQU07QUFBQ0ksaUJBQU9BO0FBQVI7QUFBUCxPQUFqRCxFQUF5RTtBQUFDYyxlQUFPO0FBQVIsT0FBekU7QUFDQSxhQUFPLEVBQVA7QUF0RkY7QUFBQSxHQURGO0FDdUtEOztBRDVFRCxJQUFHdFosT0FBTzJFLFFBQVY7QUFDSXBELFVBQVFnWCxlQUFSLEdBQTBCO0FDK0UxQixXRDlFSTFULEtBQ0k7QUFBQUMsYUFBTzNDLEVBQUUsc0JBQUYsQ0FBUDtBQUNBOEMsWUFBTTlDLEVBQUUsa0NBQUYsQ0FETjtBQUVBZ0QsWUFBTSxPQUZOO0FBR0FvVSx3QkFBa0IsS0FIbEI7QUFJQUMsc0JBQWdCLEtBSmhCO0FBS0FDLGlCQUFXO0FBTFgsS0FESixFQU9FLFVBQUNDLFVBQUQ7QUMrRUosYUQ5RU0xWixPQUFPK1QsSUFBUCxDQUFZLGlCQUFaLEVBQStCMkYsVUFBL0IsRUFBMkMsVUFBQ2xRLEtBQUQsRUFBUXdILE1BQVI7QUFDdkMsWUFBQUEsVUFBQSxPQUFHQSxPQUFReEgsS0FBWCxHQUFXLE1BQVg7QUMrRU4saUJEOUVVRyxPQUFPSCxLQUFQLENBQWF3SCxPQUFPNUYsT0FBcEIsQ0M4RVY7QUQvRU07QUNpRk4saUJEOUVVdkcsS0FBSzFDLEVBQUUsdUJBQUYsQ0FBTCxFQUFpQyxFQUFqQyxFQUFxQyxTQUFyQyxDQzhFVjtBQUNEO0FEbkZHLFFDOEVOO0FEdEZFLE1DOEVKO0FEL0UwQixHQUExQjtBQ2dHSCxDLENEbEZEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FFM0dBLElBQUduQyxPQUFPSSxRQUFWO0FBQ0lKLFNBQU9rWSxPQUFQLENBQ0k7QUFBQXlCLHNCQUFrQixVQUFDM1QsTUFBRDtBQUNWLFVBQU8sS0FBQU4sTUFBQSxRQUFQO0FBQ1E7QUNDakI7O0FBQ0QsYURBVWpDLEdBQUcwTixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUNySCxhQUFLLEtBQUN0RjtBQUFQLE9BQWhCLEVBQWdDO0FBQUMwUyxjQUFNO0FBQUNwUyxrQkFBUUE7QUFBVDtBQUFQLE9BQWhDLENDQVY7QURKRTtBQUFBLEdBREo7QUNjSCxDOzs7Ozs7Ozs7OztBQ2ZEb0MsUUFBUSxDQUFDd1IsY0FBVCxHQUEwQjtBQUN6QnJYLE1BQUksRUFBRyxZQUFVO0FBQ2hCLFFBQUlzWCxXQUFXLEdBQUcsdUNBQWxCO0FBQ0EsUUFBRyxDQUFDN1osTUFBTSxDQUFDQyxRQUFYLEVBQ0MsT0FBTzRaLFdBQVA7QUFFRCxRQUFHLENBQUM3WixNQUFNLENBQUNDLFFBQVAsQ0FBZ0J1WSxLQUFwQixFQUNDLE9BQU9xQixXQUFQO0FBRUQsUUFBRyxDQUFDN1osTUFBTSxDQUFDQyxRQUFQLENBQWdCdVksS0FBaEIsQ0FBc0JqVyxJQUExQixFQUNDLE9BQU9zWCxXQUFQO0FBRUQsV0FBTzdaLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQnVZLEtBQWhCLENBQXNCalcsSUFBN0I7QUFDQSxHQVpLLEVBRG1CO0FBY3pCdVgsZUFBYSxFQUFFO0FBQ2RDLFdBQU8sRUFBRSxVQUFVdFUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDbkUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZDJELFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJNFQsTUFBTSxHQUFHNVQsR0FBRyxDQUFDMk0sS0FBSixDQUFVLEdBQVYsQ0FBYjtBQUNBLFVBQUlrSCxTQUFTLEdBQUdELE1BQU0sQ0FBQ0EsTUFBTSxDQUFDclgsTUFBUCxHQUFjLENBQWYsQ0FBdEI7QUFDQSxVQUFJdVgsUUFBUSxHQUFHelUsSUFBSSxDQUFDMFUsT0FBTCxJQUFnQjFVLElBQUksQ0FBQzBVLE9BQUwsQ0FBYXJZLElBQTdCLEdBQW9DaUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ25FLE1BQXZDLElBQWlEbUUsSUFBSSxDQUFDMFUsT0FBTCxDQUFhclksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0dpRCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDbkUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPNFksUUFBUSxHQUFHLE1BQVgsR0FBb0JuVixPQUFPLENBQUNDLEVBQVIsQ0FBVyxpQ0FBWCxFQUE2QztBQUFDb1Ysa0JBQVUsRUFBQ0g7QUFBWixPQUE3QyxFQUFvRXhVLElBQUksQ0FBQ25FLE1BQXpFLENBQXBCLEdBQXVHLE1BQXZHLEdBQWdIOEUsR0FBaEgsR0FBc0gsTUFBdEgsR0FBK0hyQixPQUFPLENBQUNDLEVBQVIsQ0FBVyxvQkFBWCxFQUFnQyxFQUFoQyxFQUFtQ1MsSUFBSSxDQUFDbkUsTUFBeEMsQ0FBL0gsR0FBaUwsSUFBeEw7QUFDQTtBQVRhLEdBZFU7QUF5QnpCK1ksYUFBVyxFQUFFO0FBQ1pOLFdBQU8sRUFBRSxVQUFVdFUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVywwQkFBWCxFQUFzQyxFQUF0QyxFQUF5Q1MsSUFBSSxDQUFDbkUsTUFBOUMsQ0FBUDtBQUNBLEtBSFc7QUFJWjJELFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJOFQsUUFBUSxHQUFHelUsSUFBSSxDQUFDMFUsT0FBTCxJQUFnQjFVLElBQUksQ0FBQzBVLE9BQUwsQ0FBYXJZLElBQTdCLEdBQW9DaUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ25FLE1BQXZDLElBQWlEbUUsSUFBSSxDQUFDMFUsT0FBTCxDQUFhclksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0dpRCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDbkUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPNFksUUFBUSxHQUFHLE1BQVgsR0FBb0JuVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDbkUsTUFBaEQsQ0FBcEIsR0FBOEUsTUFBOUUsR0FBdUY4RSxHQUF2RixHQUE2RixNQUE3RixHQUFzR3JCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUNuRSxNQUF4QyxDQUF0RyxHQUF3SixJQUEvSjtBQUNBO0FBUFcsR0F6Qlk7QUFrQ3pCZ1osZUFBYSxFQUFFO0FBQ2RQLFdBQU8sRUFBRSxVQUFVdFUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDbkUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZDJELFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJOFQsUUFBUSxHQUFHelUsSUFBSSxDQUFDMFUsT0FBTCxJQUFnQjFVLElBQUksQ0FBQzBVLE9BQUwsQ0FBYXJZLElBQTdCLEdBQW9DaUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ25FLE1BQXZDLElBQWlEbUUsSUFBSSxDQUFDMFUsT0FBTCxDQUFhclksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0dpRCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDbkUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPNFksUUFBUSxHQUFHLE1BQVgsR0FBb0JuVixPQUFPLENBQUNDLEVBQVIsQ0FBVywyQkFBWCxFQUF1QyxFQUF2QyxFQUEwQ1MsSUFBSSxDQUFDbkUsTUFBL0MsQ0FBcEIsR0FBNkUsTUFBN0UsR0FBc0Y4RSxHQUF0RixHQUE0RixNQUE1RixHQUFxR3JCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUNuRSxNQUF4QyxDQUFyRyxHQUF1SixJQUE5SjtBQUNBO0FBUGE7QUFsQ1UsQ0FBMUIsQzs7Ozs7Ozs7Ozs7QUNBQTtBQUNBZ1MsVUFBVSxDQUFDaUgsR0FBWCxDQUFlLEtBQWYsRUFBc0IsNkJBQXRCLEVBQXFELFVBQVUzSixHQUFWLEVBQWVDLEdBQWYsRUFBb0I4RCxJQUFwQixFQUEwQjtBQUU5RSxNQUFJNkYsSUFBSSxHQUFHL1csRUFBRSxDQUFDMEssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQytMLFlBQVEsRUFBQyxLQUFWO0FBQWdCM1ksUUFBSSxFQUFDO0FBQUM0WSxTQUFHLEVBQUM7QUFBTDtBQUFyQixHQUF0QixDQUFYOztBQUNBLE1BQUlGLElBQUksQ0FBQy9CLEtBQUwsS0FBYSxDQUFqQixFQUNBO0FBQ0MrQixRQUFJLENBQUN0WSxPQUFMLENBQWMsVUFBVWtPLEdBQVYsRUFDZDtBQUNDO0FBQ0EzTSxRQUFFLENBQUMwSyxhQUFILENBQWlCd0ssTUFBakIsQ0FBd0J0RyxNQUF4QixDQUErQmpDLEdBQUcsQ0FBQ3BGLEdBQW5DLEVBQXdDO0FBQUNvTixZQUFJLEVBQUU7QUFBQ3FDLGtCQUFRLEVBQUVySyxHQUFHLENBQUN1SyxpQkFBSjtBQUFYO0FBQVAsT0FBeEM7QUFFQSxLQUxEO0FBTUE7O0FBRUNySCxZQUFVLENBQUNDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUEyQjtBQUN6QjJDLFFBQUksRUFBRTtBQUNIb0gsU0FBRyxFQUFFLENBREY7QUFFSEMsU0FBRyxFQUFFO0FBRkY7QUFEbUIsR0FBM0I7QUFNRixDQW5CRCxFOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFHN2EsT0FBTzBHLFNBQVY7QUFDUTFHLFNBQU8wWCxPQUFQLENBQWU7QUNDbkIsV0RBWW9ELEtBQUtDLFNBQUwsQ0FDUTtBQUFBek4sZUFDUTtBQUFBME4sa0JBQVVsVCxPQUFPbVQsaUJBQWpCO0FBQ0FDLGVBQU8sSUFEUDtBQUVBQyxpQkFBUztBQUZULE9BRFI7QUFJQUMsV0FDUTtBQUFBQyxlQUFPLElBQVA7QUFDQUMsb0JBQVksSUFEWjtBQUVBSixlQUFPLElBRlA7QUFHQUssZUFBTztBQUhQLE9BTFI7QUFTQUMsZUFBUztBQVRULEtBRFIsQ0NBWjtBRERJO0FDZ0JQLEM7Ozs7Ozs7Ozs7OztBQ2pCREMsV0FBVyxFQUFYOztBQUdBQSxTQUFTQyx1QkFBVCxHQUFtQyxVQUFDaFcsTUFBRDtBQUNsQyxNQUFBaVcsUUFBQSxFQUFBOVAsTUFBQSxFQUFBcEcsSUFBQTs7QUFBQSxNQUFHekYsT0FBTzJFLFFBQVY7QUFDQ2UsYUFBUzFGLE9BQU8wRixNQUFQLEVBQVQ7O0FBQ0EsU0FBT0EsTUFBUDtBQUNDLGFBQU87QUFBQ3NGLGFBQUssQ0FBQztBQUFQLE9BQVA7QUNLRTs7QURKSCxRQUFHekosUUFBUXFLLFlBQVIsRUFBSDtBQUNDLGFBQU87QUFBQ0QsZUFBT2xFLFFBQVFDLEdBQVIsQ0FBWSxTQUFaO0FBQVIsT0FBUDtBQUREO0FBR0MsYUFBTztBQUFDc0QsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQVBGO0FDa0JFOztBRFRGLE1BQUdoTCxPQUFPSSxRQUFWO0FBQ0MsU0FBT3NGLE1BQVA7QUFDQyxhQUFPO0FBQUNzRixhQUFLLENBQUM7QUFBUCxPQUFQO0FDYUU7O0FEWkh2RixXQUFPaEMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUJFLE1BQWpCLEVBQXlCO0FBQUM2SSxjQUFRO0FBQUNxTix1QkFBZTtBQUFoQjtBQUFULEtBQXpCLENBQVA7O0FBQ0EsUUFBRyxDQUFDblcsSUFBSjtBQUNDLGFBQU87QUFBQ3VGLGFBQUssQ0FBQztBQUFQLE9BQVA7QUNvQkU7O0FEbkJIMlEsZUFBVyxFQUFYOztBQUNBLFFBQUcsQ0FBQ2xXLEtBQUttVyxhQUFUO0FBQ0MvUCxlQUFTcEksR0FBR29JLE1BQUgsQ0FBVTZDLElBQVYsQ0FBZTtBQUFDZSxnQkFBTztBQUFDZCxlQUFJLENBQUNqSixNQUFEO0FBQUw7QUFBUixPQUFmLEVBQXdDO0FBQUM2SSxnQkFBUTtBQUFDdkQsZUFBSztBQUFOO0FBQVQsT0FBeEMsRUFBNEQ0RCxLQUE1RCxFQUFUO0FBQ0EvQyxlQUFTQSxPQUFPZ1EsR0FBUCxDQUFXLFVBQUNDLENBQUQ7QUFBTyxlQUFPQSxFQUFFOVEsR0FBVDtBQUFsQixRQUFUO0FBQ0EyUSxlQUFTaFEsS0FBVCxHQUFpQjtBQUFDZ0QsYUFBSzlDO0FBQU4sT0FBakI7QUNpQ0U7O0FEaENILFdBQU84UCxRQUFQO0FDa0NDO0FEdkRnQyxDQUFuQzs7QUF3QkFGLFNBQVNNLGtCQUFULEdBQThCLFVBQUNyVyxNQUFEO0FBQzdCLE1BQUFpVyxRQUFBLEVBQUFuUSxPQUFBLEVBQUE4QyxXQUFBLEVBQUF6QyxNQUFBLEVBQUFwRyxJQUFBOztBQUFBLE1BQUd6RixPQUFPMkUsUUFBVjtBQUNDZSxhQUFTMUYsT0FBTzBGLE1BQVAsRUFBVDs7QUFDQSxTQUFPQSxNQUFQO0FBQ0MsYUFBTztBQUFDc0YsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ3NDRTs7QURyQ0hRLGNBQVUvRCxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFWOztBQUNBLFFBQUc4RCxPQUFIO0FBQ0MsVUFBRy9ILEdBQUc2SyxXQUFILENBQWU5SSxPQUFmLENBQXVCO0FBQUNDLGNBQU1DLE1BQVA7QUFBY2lHLGVBQU9IO0FBQXJCLE9BQXZCLEVBQXNEO0FBQUMrQyxnQkFBUTtBQUFDdkQsZUFBSztBQUFOO0FBQVQsT0FBdEQsQ0FBSDtBQUNDLGVBQU87QUFBQ1csaUJBQU9IO0FBQVIsU0FBUDtBQUREO0FBR0MsZUFBTztBQUFDUixlQUFLLENBQUM7QUFBUCxTQUFQO0FBSkY7QUFBQTtBQU1DLGFBQU87QUFBQ0EsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQVhGO0FDaUVFOztBRHBERixNQUFHaEwsT0FBT0ksUUFBVjtBQUNDLFNBQU9zRixNQUFQO0FBQ0MsYUFBTztBQUFDc0YsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ3dERTs7QUR2REh2RixXQUFPaEMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUJFLE1BQWpCLEVBQXlCO0FBQUM2SSxjQUFRO0FBQUN2RCxhQUFLO0FBQU47QUFBVCxLQUF6QixDQUFQOztBQUNBLFFBQUcsQ0FBQ3ZGLElBQUo7QUFDQyxhQUFPO0FBQUN1RixhQUFLLENBQUM7QUFBUCxPQUFQO0FDK0RFOztBRDlESDJRLGVBQVcsRUFBWDtBQUNBck4sa0JBQWM3SyxHQUFHNkssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUNqSixZQUFNQztBQUFQLEtBQXBCLEVBQW9DO0FBQUM2SSxjQUFRO0FBQUM1QyxlQUFPO0FBQVI7QUFBVCxLQUFwQyxFQUEwRGlELEtBQTFELEVBQWQ7QUFDQS9DLGFBQVMsRUFBVDs7QUFDQTJDLE1BQUVyQyxJQUFGLENBQU9tQyxXQUFQLEVBQW9CLFVBQUMwTixDQUFEO0FDc0VoQixhRHJFSG5RLE9BQU94SixJQUFQLENBQVkyWixFQUFFclEsS0FBZCxDQ3FFRztBRHRFSjs7QUFFQWdRLGFBQVNoUSxLQUFULEdBQWlCO0FBQUNnRCxXQUFLOUM7QUFBTixLQUFqQjtBQUNBLFdBQU84UCxRQUFQO0FDeUVDO0FEbkcyQixDQUE5Qjs7QUE0QkFsWSxHQUFHd1ksbUJBQUgsQ0FBdUJDLFdBQXZCLEdBQ0M7QUFBQUMsUUFBTSxPQUFOO0FBQ0FDLFNBQU8sTUFEUDtBQUVBQyxnQkFBYyxDQUNiO0FBQUN2YSxVQUFNO0FBQVAsR0FEYSxFQUViO0FBQUNBLFVBQU07QUFBUCxHQUZhLEVBR2I7QUFBQ0EsVUFBTTtBQUFQLEdBSGEsRUFJYjtBQUFDQSxVQUFNO0FBQVAsR0FKYSxFQUtiO0FBQUNBLFVBQU07QUFBUCxHQUxhLEVBTWI7QUFBQ0EsVUFBTTtBQUFQLEdBTmEsQ0FGZDtBQVVBd2EsZUFBYSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFdBQTdCLENBVmI7QUFXQUMsZUFBYSxRQVhiO0FBWUFaLFlBQVUsVUFBQ2pXLE1BQUQ7QUFDVCxRQUFHMUYsT0FBTzJFLFFBQVY7QUFDQyxVQUFHcEQsUUFBUXFLLFlBQVIsRUFBSDtBQUNDLGVBQU87QUFBQ0QsaUJBQU9sRSxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFSO0FBQWdDOFUsZ0JBQU07QUFBdEMsU0FBUDtBQUREO0FBR0MsZUFBTztBQUFDeFIsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQUpGO0FDNEZHOztBRHRGSCxRQUFHaEwsT0FBT0ksUUFBVjtBQUNDLGFBQU8sRUFBUDtBQ3dGRTtBRDVHSjtBQXFCQXFjLGtCQUFnQixLQXJCaEI7QUFzQkFDLGlCQUFlLEtBdEJmO0FBdUJBQyxjQUFZLElBdkJaO0FBd0JBQyxjQUFZLEdBeEJaO0FBeUJBQyxTQUFPLENBQUMsQ0FBQyxDQUFELEVBQUksTUFBSixDQUFEO0FBekJQLENBREQ7QUE0QkE3YyxPQUFPMFgsT0FBUCxDQUFlO0FBQ2QsT0FBQ29GLGdCQUFELEdBQW9CclosR0FBR3FaLGdCQUF2QjtBQUNBLE9BQUNiLG1CQUFELEdBQXVCeFksR0FBR3dZLG1CQUExQjtBQzJGQyxTQUFPLE9BQU9jLFdBQVAsS0FBdUIsV0FBdkIsSUFBc0NBLGdCQUFnQixJQUF0RCxHRDFGUkEsWUFBYUMsZUFBYixDQUNDO0FBQUFGLHNCQUFrQnJaLEdBQUdxWixnQkFBSCxDQUFvQlosV0FBdEM7QUFDQUQseUJBQXFCeFksR0FBR3dZLG1CQUFILENBQXVCQztBQUQ1QyxHQURELENDMEZRLEdEMUZSLE1DMEZDO0FEN0ZGLEc7Ozs7Ozs7Ozs7O0FFbkZBLElBQUksQ0FBQyxHQUFHaFosUUFBUixFQUFrQjtBQUNoQi9CLE9BQUssQ0FBQ0MsU0FBTixDQUFnQjhCLFFBQWhCLEdBQTJCLFVBQVMrWjtBQUFjO0FBQXZCLElBQXlDO0FBQ2xFOztBQUNBLFFBQUlDLENBQUMsR0FBR3BjLE1BQU0sQ0FBQyxJQUFELENBQWQ7QUFDQSxRQUFJbVIsR0FBRyxHQUFHOEQsUUFBUSxDQUFDbUgsQ0FBQyxDQUFDdmEsTUFBSCxDQUFSLElBQXNCLENBQWhDOztBQUNBLFFBQUlzUCxHQUFHLEtBQUssQ0FBWixFQUFlO0FBQ2IsYUFBTyxLQUFQO0FBQ0Q7O0FBQ0QsUUFBSTZKLENBQUMsR0FBRy9GLFFBQVEsQ0FBQ2pDLFNBQVMsQ0FBQyxDQUFELENBQVYsQ0FBUixJQUEwQixDQUFsQztBQUNBLFFBQUk3UixDQUFKOztBQUNBLFFBQUk2WixDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1Y3WixPQUFDLEdBQUc2WixDQUFKO0FBQ0QsS0FGRCxNQUVPO0FBQ0w3WixPQUFDLEdBQUdnUSxHQUFHLEdBQUc2SixDQUFWOztBQUNBLFVBQUk3WixDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQUNBLFNBQUMsR0FBRyxDQUFKO0FBQU87QUFDcEI7O0FBQ0QsUUFBSWtiLGNBQUo7O0FBQ0EsV0FBT2xiLENBQUMsR0FBR2dRLEdBQVgsRUFBZ0I7QUFDZGtMLG9CQUFjLEdBQUdELENBQUMsQ0FBQ2piLENBQUQsQ0FBbEI7O0FBQ0EsVUFBSWdiLGFBQWEsS0FBS0UsY0FBbEIsSUFDQUYsYUFBYSxLQUFLQSxhQUFsQixJQUFtQ0UsY0FBYyxLQUFLQSxjQUQxRCxFQUMyRTtBQUN6RSxlQUFPLElBQVA7QUFDRDs7QUFDRGxiLE9BQUM7QUFDRjs7QUFDRCxXQUFPLEtBQVA7QUFDRCxHQXpCRDtBQTBCRCxDOzs7Ozs7Ozs7Ozs7QUMzQkRqQyxPQUFPMFgsT0FBUCxDQUFlO0FBQ2JuVyxVQUFRdEIsUUFBUixDQUFpQitKLFdBQWpCLEdBQStCaEssT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUIrSixXQUF0RDs7QUFFQSxNQUFHLENBQUN6SSxRQUFRdEIsUUFBUixDQUFpQitKLFdBQXJCO0FDQUUsV0RDQXpJLFFBQVF0QixRQUFSLENBQWlCK0osV0FBakIsR0FDRTtBQUFBb1QsV0FDRTtBQUFBQyxnQkFBUSxRQUFSO0FBQ0FqWCxhQUFLO0FBREw7QUFERixLQ0ZGO0FBTUQ7QURUSCxHOzs7Ozs7Ozs7Ozs7QUVBQXVRLFFBQVEyRyx1QkFBUixHQUFrQyxVQUFDNVgsTUFBRCxFQUFTOEYsT0FBVCxFQUFrQitSLE9BQWxCO0FBQ2pDLE1BQUFDLHVCQUFBLEVBQUFDLElBQUEsRUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBRCxjQUFZLEVBQVo7QUFFQUQsU0FBT2pQLEVBQUVpUCxJQUFGLENBQU9GLE9BQVAsQ0FBUDtBQUVBSSxpQkFBZWhILFFBQVFpSCxhQUFSLENBQXNCLGtCQUF0QixFQUEwQ2xQLElBQTFDLENBQStDO0FBQzdEbVAsaUJBQWE7QUFBQ2xQLFdBQUs4TztBQUFOLEtBRGdEO0FBRTdEOVIsV0FBT0gsT0FGc0Q7QUFHN0QsV0FBTyxDQUFDO0FBQUNzUyxhQUFPcFk7QUFBUixLQUFELEVBQWtCO0FBQUNxWSxjQUFRO0FBQVQsS0FBbEI7QUFIc0QsR0FBL0MsRUFJWjtBQUNGeFAsWUFBUTtBQUNQMkksZUFBUyxDQURGO0FBRVBFLGdCQUFVLENBRkg7QUFHUEQsa0JBQVksQ0FITDtBQUlQRSxtQkFBYTtBQUpOO0FBRE4sR0FKWSxFQVdaekksS0FYWSxFQUFmOztBQWFBNE8sNEJBQTBCLFVBQUNLLFdBQUQ7QUFDekIsUUFBQUcsdUJBQUEsRUFBQUMsVUFBQTs7QUFBQUQsOEJBQTBCLEVBQTFCO0FBQ0FDLGlCQUFhelAsRUFBRTJCLE1BQUYsQ0FBU3dOLFlBQVQsRUFBdUIsVUFBQ08sRUFBRDtBQUNuQyxhQUFPQSxHQUFHTCxXQUFILEtBQWtCQSxXQUF6QjtBQURZLE1BQWI7O0FBR0FyUCxNQUFFckMsSUFBRixDQUFPOFIsVUFBUCxFQUFtQixVQUFDRSxRQUFEO0FDUWYsYURQSEgsd0JBQXdCRyxTQUFTblQsR0FBakMsSUFBd0NtVCxRQ09yQztBRFJKOztBQUdBLFdBQU9ILHVCQUFQO0FBUnlCLEdBQTFCOztBQVVBeFAsSUFBRXRNLE9BQUYsQ0FBVXFiLE9BQVYsRUFBbUIsVUFBQ2EsQ0FBRCxFQUFJelksR0FBSjtBQUNsQixRQUFBMFksU0FBQTtBQUFBQSxnQkFBWWIsd0JBQXdCN1gsR0FBeEIsQ0FBWjs7QUFDQSxRQUFHLENBQUM2SSxFQUFFNEcsT0FBRixDQUFVaUosU0FBVixDQUFKO0FDU0ksYURSSFgsVUFBVS9YLEdBQVYsSUFBaUIwWSxTQ1FkO0FBQ0Q7QURaSjs7QUFJQSxTQUFPWCxTQUFQO0FBaENpQyxDQUFsQzs7QUFtQ0EvRyxRQUFRMkgsc0JBQVIsR0FBaUMsVUFBQzVZLE1BQUQsRUFBUzhGLE9BQVQsRUFBa0JxUyxXQUFsQjtBQUNoQyxNQUFBRyx1QkFBQSxFQUFBTyxlQUFBOztBQUFBUCw0QkFBMEIsRUFBMUI7QUFFQU8sb0JBQWtCNUgsUUFBUWlILGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDbFAsSUFBMUMsQ0FBK0M7QUFDaEVtUCxpQkFBYUEsV0FEbUQ7QUFFaEVsUyxXQUFPSCxPQUZ5RDtBQUdoRSxXQUFPLENBQUM7QUFBQ3NTLGFBQU9wWTtBQUFSLEtBQUQsRUFBa0I7QUFBQ3FZLGNBQVE7QUFBVCxLQUFsQjtBQUh5RCxHQUEvQyxFQUlmO0FBQ0Z4UCxZQUFRO0FBQ1AySSxlQUFTLENBREY7QUFFUEUsZ0JBQVUsQ0FGSDtBQUdQRCxrQkFBWSxDQUhMO0FBSVBFLG1CQUFhO0FBSk47QUFETixHQUplLENBQWxCO0FBYUFrSCxrQkFBZ0JyYyxPQUFoQixDQUF3QixVQUFDaWMsUUFBRDtBQ2dCckIsV0RmRkgsd0JBQXdCRyxTQUFTblQsR0FBakMsSUFBd0NtVCxRQ2V0QztBRGhCSDtBQUdBLFNBQU9ILHVCQUFQO0FBbkJnQyxDQUFqQyxDOzs7Ozs7Ozs7OztBRW5DQVEsYUFBYSxHQUFJLFlBQVk7QUFDM0I7O0FBRUEsTUFBSUMsVUFBVSxHQUFHLElBQUl0ZSxLQUFLLENBQUNzZSxVQUFWLENBQXFCLGlCQUFyQixDQUFqQjs7QUFFQSxNQUFJQyxXQUFXLEdBQUcsVUFBVS9ZLEdBQVYsRUFBZTtBQUMvQixRQUFJLE9BQU9BLEdBQVAsS0FBZSxXQUFuQixFQUFnQztBQUM5QixZQUFNLElBQUkyTCxLQUFKLENBQVUsdUJBQVYsQ0FBTjtBQUNEO0FBQ0YsR0FKRDs7QUFLQSxNQUFJcU4sZUFBZSxHQUFHLFVBQVU3TCxHQUFWLEVBQWVuTixHQUFmLEVBQW9CO0FBQ3hDLFdBQU9tTixHQUFHLElBQUlBLEdBQUcsQ0FBQzhMLE1BQVgsSUFBcUI5TCxHQUFHLENBQUM4TCxNQUFKLENBQVdqWixHQUFYLENBQTVCO0FBQ0QsR0FGRDs7QUFHQSxNQUFJa1osU0FBUyxHQUFHLFlBQVk7QUFDMUIsV0FBTyxJQUFQO0FBQ0QsR0FGRDs7QUFJQUosWUFBVSxDQUFDSyxJQUFYLENBQWdCO0FBQ2QsY0FBVSxZQUFZO0FBQ3BCLGFBQU8sSUFBUDtBQUNELEtBSGE7QUFJZCxjQUFXLFlBQVk7QUFDckIsYUFBTyxJQUFQO0FBQ0QsS0FOYTtBQU9kLGNBQVUsWUFBWTtBQUNwQixhQUFPLElBQVA7QUFDRDtBQVRhLEdBQWhCLEVBakIyQixDQTZCM0I7O0FBQ0EsTUFBSUMsR0FBRyxHQUFHO0FBQ1IsV0FBTyxVQUFVcFosR0FBVixFQUFlO0FBQ3BCd0YsYUFBTyxDQUFDNlQsR0FBUixDQUFZUCxVQUFVLENBQUNqWixPQUFYLEVBQVo7QUFDQSxVQUFJeVosVUFBVSxHQUFHUixVQUFVLENBQUNqWixPQUFYLEVBQWpCOztBQUNBLFVBQUd4RixNQUFNLENBQUNJLFFBQVYsRUFBbUI7QUFDakJKLGNBQU0sQ0FBQytULElBQVAsQ0FBWSxvQkFBWjtBQUNELE9BTG1CLENBTXBCO0FBQ0E7OztBQUNBLGFBQU80SyxlQUFlLENBQUNNLFVBQUQsRUFBYXRaLEdBQWIsQ0FBdEI7QUFDRCxLQVZPO0FBV1IsY0FBVSxVQUFVQSxHQUFWLEVBQWV1WixRQUFmLEVBQXlCQyxTQUF6QixFQUFvQztBQUM1QyxVQUFJRixVQUFVLEdBQUdqZixNQUFNLENBQUNJLFFBQVAsR0FDZkosTUFBTSxDQUFDK1QsSUFBUCxDQUFZLG9CQUFaLENBRGUsR0FDcUIwSyxVQUFVLENBQUNqWixPQUFYLEVBRHRDO0FBR0EsVUFBSUksS0FBSyxHQUFHK1ksZUFBZSxDQUFDTSxVQUFELEVBQWF0WixHQUFiLENBQTNCOztBQUVBLFVBQUk2SSxDQUFDLENBQUM0USxRQUFGLENBQVd4WixLQUFYLEtBQXFCNEksQ0FBQyxDQUFDNFEsUUFBRixDQUFXRixRQUFYLENBQXpCLEVBQStDO0FBQzdDLGVBQU8xUSxDQUFDLENBQUM1SSxLQUFELENBQUQsQ0FBU3laLE9BQVQsQ0FBaUJILFFBQWpCLENBQVA7QUFDRDs7QUFFRCxVQUFJQyxTQUFTLElBQUksS0FBakIsRUFBd0I7QUFDdEIsZUFBT0QsUUFBUSxJQUFJdFosS0FBbkI7QUFDRDs7QUFFRCxhQUFPc1osUUFBUSxLQUFLdFosS0FBcEI7QUFDRDtBQTFCTyxHQUFWO0FBNkJBNUYsUUFBTSxDQUFDMFgsT0FBUCxDQUFlLFlBQVU7QUFDdkIsUUFBSTFYLE1BQU0sQ0FBQzJFLFFBQVgsRUFBcUI7QUFDbkJ6RCxhQUFPLENBQUNELE9BQVIsQ0FBZ0IsWUFBVTtBQUN4QixZQUFHakIsTUFBTSxDQUFDMEYsTUFBUCxFQUFILEVBQW1CO0FBQ2pCMUYsZ0JBQU0sQ0FBQ3NmLFNBQVAsQ0FBaUIsZ0JBQWpCO0FBQ0Q7QUFDRixPQUpEO0FBS0Q7QUFDRixHQVJEOztBQVVBLE1BQUl0ZixNQUFNLENBQUNJLFFBQVgsRUFBcUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBSixVQUFNLENBQUN1ZixZQUFQLENBQW9CLFVBQVVDLFVBQVYsRUFBc0I7QUFDeEMsVUFBSUMsUUFBUSxHQUFHRCxVQUFVLENBQUNFLEVBQTFCOztBQUVBLFVBQUksQ0FBQ2pCLFVBQVUsQ0FBQ2paLE9BQVgsQ0FBbUI7QUFBRSxvQkFBWWlhO0FBQWQsT0FBbkIsQ0FBTCxFQUFtRDtBQUNqRGhCLGtCQUFVLENBQUNrQixNQUFYLENBQWtCO0FBQUUsc0JBQVlGLFFBQWQ7QUFBd0Isb0JBQVUsRUFBbEM7QUFBc0MscUJBQVcsSUFBSTFULElBQUo7QUFBakQsU0FBbEI7QUFDRDs7QUFFRHlULGdCQUFVLENBQUNJLE9BQVgsQ0FBbUIsWUFBWTtBQUM3Qm5CLGtCQUFVLENBQUNuYyxNQUFYLENBQWtCO0FBQUUsc0JBQVltZDtBQUFkLFNBQWxCO0FBQ0QsT0FGRDtBQUdELEtBVkQ7QUFZQXpmLFVBQU0sQ0FBQzZmLE9BQVAsQ0FBZSxnQkFBZixFQUFpQyxZQUFZO0FBQzNDLGFBQU9wQixVQUFVLENBQUMvUCxJQUFYLENBQWdCO0FBQUUsb0JBQVksS0FBSzhRLFVBQUwsQ0FBZ0JFO0FBQTlCLE9BQWhCLENBQVA7QUFDRCxLQUZEO0FBSUExZixVQUFNLENBQUNrWSxPQUFQLENBQWU7QUFDYiw0QkFBc0IsWUFBWTtBQUNoQyxlQUFPdUcsVUFBVSxDQUFDalosT0FBWCxDQUFtQjtBQUFFLHNCQUFZLEtBQUtnYSxVQUFMLENBQWdCRTtBQUE5QixTQUFuQixDQUFQO0FBQ0QsT0FIWTtBQUliLDRCQUFzQixVQUFVL1osR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQzFDLFlBQUksQ0FBQyxLQUFLa2EsVUFBVixFQUFzQjtBQUV0QnBCLG1CQUFXLENBQUMvWSxHQUFELENBQVg7QUFFQSxZQUFJLENBQUNrWixTQUFTLENBQUNsWixHQUFELEVBQU1DLEtBQU4sQ0FBZCxFQUNFLE1BQU0sSUFBSTVGLE1BQU0sQ0FBQ3NSLEtBQVgsQ0FBaUIsOEJBQWpCLENBQU47QUFFRixZQUFJeU8sU0FBUyxHQUFHLEVBQWhCO0FBQ0FBLGlCQUFTLENBQUMsWUFBWXBhLEdBQWIsQ0FBVCxHQUE2QkMsS0FBN0I7QUFFQTZZLGtCQUFVLENBQUNwTSxNQUFYLENBQWtCO0FBQUUsc0JBQVksS0FBS21OLFVBQUwsQ0FBZ0JFO0FBQTlCLFNBQWxCLEVBQXNEO0FBQUV0SCxjQUFJLEVBQUUySDtBQUFSLFNBQXREO0FBQ0Q7QUFoQlksS0FBZixFQXZCbUIsQ0EwQ25COztBQUNBdlIsS0FBQyxDQUFDaUgsTUFBRixDQUFTc0osR0FBVCxFQUFjO0FBQ1osYUFBTyxVQUFVcFosR0FBVixFQUFlQyxLQUFmLEVBQXNCO0FBQzNCNUYsY0FBTSxDQUFDK1QsSUFBUCxDQUFZLG9CQUFaLEVBQWtDcE8sR0FBbEMsRUFBdUNDLEtBQXZDO0FBQ0QsT0FIVztBQUlaLHNCQUFnQixVQUFVb2EsWUFBVixFQUF3QjtBQUN0Q25CLGlCQUFTLEdBQUdtQixZQUFaO0FBQ0Q7QUFOVyxLQUFkO0FBUUQ7O0FBRUQsU0FBT2pCLEdBQVA7QUFDRCxDQTNIZSxFQUFoQixDOzs7Ozs7Ozs7Ozs7QUNBQXpMLFdBQVdpSCxHQUFYLENBQWUsS0FBZixFQUFzQixlQUF0QixFQUF1QyxVQUFDM0osR0FBRCxFQUFNQyxHQUFOLEVBQVc4RCxJQUFYO0FBQ3RDLE1BQUEvTCxJQUFBLEVBQUE0QixDQUFBLEVBQUFsSixNQUFBLEVBQUFzQyxHQUFBLEVBQUFDLElBQUEsRUFBQWdULFFBQUEsRUFBQWhMLE1BQUEsRUFBQXBHLElBQUEsRUFBQXdhLE9BQUE7O0FBQUE7QUFDQ0EsY0FBVXJQLElBQUlZLE9BQUosQ0FBWSxXQUFaLE9BQUE1TixNQUFBZ04sSUFBQU0sS0FBQSxZQUFBdE4sSUFBdUM4QixNQUF2QyxHQUF1QyxNQUF2QyxDQUFWO0FBRUFtUixlQUFXakcsSUFBSVksT0FBSixDQUFZLFlBQVosT0FBQTNOLE9BQUErTSxJQUFBTSxLQUFBLFlBQUFyTixLQUF3QzJILE9BQXhDLEdBQXdDLE1BQXhDLENBQVg7QUFFQS9GLFdBQU9sRSxRQUFRb1AsZUFBUixDQUF3QkMsR0FBeEIsRUFBNkJDLEdBQTdCLENBQVA7O0FBRUEsUUFBRyxDQUFDcEwsSUFBSjtBQUNDNk4saUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNDO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDQztBQUFBLG1CQUFTLG9EQUFUO0FBQ0EscUJBQVc7QUFEWDtBQUZELE9BREQ7QUFLQTtBQ0NFOztBRENIeU0sY0FBVXhhLEtBQUt1RixHQUFmO0FBR0FrVixrQkFBY0MsUUFBZCxDQUF1QnRKLFFBQXZCO0FBRUF2VixhQUFTbUMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUI7QUFBQ3dGLFdBQUlpVjtBQUFMLEtBQWpCLEVBQWdDM2UsTUFBekM7O0FBQ0EsUUFBR0EsV0FBVSxPQUFiO0FBQ0NBLGVBQVMsSUFBVDtBQ0FFOztBRENILFFBQUdBLFdBQVUsT0FBYjtBQUNDQSxlQUFTLE9BQVQ7QUNDRTs7QURDSHVLLGFBQVNwSSxHQUFHNkssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUNqSixZQUFNd2E7QUFBUCxLQUFwQixFQUFxQ3JSLEtBQXJDLEdBQTZDNU0sV0FBN0MsQ0FBeUQsT0FBekQsQ0FBVDtBQUNBNEcsV0FBT25GLEdBQUdtRixJQUFILENBQVE4RixJQUFSLENBQWE7QUFBQzBSLFdBQUssQ0FBQztBQUFDelUsZUFBTztBQUFDMFUsbUJBQVM7QUFBVjtBQUFSLE9BQUQsRUFBNEI7QUFBQzFVLGVBQU87QUFBQ2dELGVBQUk5QztBQUFMO0FBQVIsT0FBNUI7QUFBTixLQUFiLEVBQXVFO0FBQUNySyxZQUFLO0FBQUNBLGNBQUs7QUFBTjtBQUFOLEtBQXZFLEVBQXdGb04sS0FBeEYsRUFBUDtBQUVBaEcsU0FBSzFHLE9BQUwsQ0FBYSxVQUFDeUcsR0FBRDtBQ2tCVCxhRGpCSEEsSUFBSTdHLElBQUosR0FBV2lELFFBQVFDLEVBQVIsQ0FBVzJELElBQUk3RyxJQUFmLEVBQW9CLEVBQXBCLEVBQXVCUixNQUF2QixDQ2lCUjtBRGxCSjtBQ29CRSxXRGpCRmdTLFdBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNDO0FBQUE0QyxZQUFNLEdBQU47QUFDQUQsWUFBTTtBQUFFNkosZ0JBQVEsU0FBVjtBQUFxQjdKLGNBQU01SztBQUEzQjtBQUROLEtBREQsQ0NpQkU7QURqREgsV0FBQVksS0FBQTtBQW1DTWdCLFFBQUFoQixLQUFBO0FBQ0wyQixZQUFRM0IsS0FBUixDQUFjZ0IsRUFBRWEsS0FBaEI7QUN1QkUsV0R0QkZpSSxXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQztBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFBRThNLGdCQUFRLENBQUM7QUFBQ0Msd0JBQWMvVixFQUFFWTtBQUFqQixTQUFEO0FBQVY7QUFETixLQURELENDc0JFO0FBVUQ7QUR0RUgsRzs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQTlILE9BQUE7QUFBQUEsVUFBVWlHLFFBQVEsU0FBUixDQUFWO0FBRUErSixXQUFXaUgsR0FBWCxDQUFlLE1BQWYsRUFBdUIsc0JBQXZCLEVBQStDLFVBQUMzSixHQUFELEVBQU1DLEdBQU4sRUFBVzhELElBQVg7QUFDM0MsTUFBQTZMLFlBQUEsRUFBQXZZLFNBQUEsRUFBQW5JLE9BQUEsRUFBQTBULElBQUEsRUFBQWhKLENBQUEsRUFBQWlXLEtBQUEsRUFBQUMsT0FBQSxFQUFBL0UsUUFBQSxFQUFBaFEsS0FBQSxFQUFBMEMsVUFBQSxFQUFBM0ksTUFBQTs7QUFBQTtBQUVJNUYsY0FBVSxJQUFJd0QsT0FBSixDQUFhc04sR0FBYixFQUFrQkMsR0FBbEIsQ0FBVjs7QUFHQSxRQUFHRCxJQUFJMUIsSUFBUDtBQUNJeEosZUFBU2tMLElBQUkxQixJQUFKLENBQVMsV0FBVCxDQUFUO0FBQ0FqSCxrQkFBWTJJLElBQUkxQixJQUFKLENBQVMsY0FBVCxDQUFaO0FDQ1A7O0FERUcsUUFBRyxDQUFDeEosTUFBRCxJQUFXLENBQUN1QyxTQUFmO0FBQ0l2QyxlQUFTNUYsUUFBUTRILEdBQVIsQ0FBWSxXQUFaLENBQVQ7QUFDQU8sa0JBQVluSSxRQUFRNEgsR0FBUixDQUFZLGNBQVosQ0FBWjtBQ0FQOztBREVHLFFBQUcsRUFBRWhDLFVBQVd1QyxTQUFiLENBQUg7QUFDSXFMLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUywwQ0FBVDtBQUNBLHNCQUFZLFlBRFo7QUFFQSxxQkFBVztBQUZYO0FBRkosT0FEQTtBQU1BO0FDRVA7O0FEQUdpTixZQUFRN1AsSUFBSTFCLElBQUosQ0FBU3VSLEtBQWpCO0FBQ0E5RSxlQUFXL0ssSUFBSTFCLElBQUosQ0FBU3lNLFFBQXBCO0FBQ0ErRSxjQUFVOVAsSUFBSTFCLElBQUosQ0FBU3dSLE9BQW5CO0FBQ0EvVSxZQUFRaUYsSUFBSTFCLElBQUosQ0FBU3ZELEtBQWpCO0FBQ0E2SCxXQUFPLEVBQVA7QUFDQWdOLG1CQUFlLENBQUMsYUFBRCxFQUFnQixlQUFoQixFQUFpQyxZQUFqQyxDQUFmOztBQUVBLFFBQUcsQ0FBQzdVLEtBQUo7QUFDSTJILGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUI3SCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNHUDs7QURBRzBDLGlCQUFhNUssR0FBRzZLLFdBQUgsQ0FBZTlJLE9BQWYsQ0FBdUI7QUFBQ0MsWUFBTUMsTUFBUDtBQUFlaUcsYUFBT0E7QUFBdEIsS0FBdkIsQ0FBYjs7QUFFQSxRQUFHLENBQUMwQyxVQUFKO0FBQ0lpRixpQkFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0E7QUFBQTRDLGNBQU0sR0FBTjtBQUNBRCxjQUNJO0FBQUEsbUJBQVMsbUJBQW1CN0gsS0FBNUI7QUFDQSxxQkFBVztBQURYO0FBRkosT0FEQTtBQUtBO0FDTVA7O0FESkcsUUFBRyxDQUFDNlUsYUFBYXRkLFFBQWIsQ0FBc0J1ZCxLQUF0QixDQUFKO0FBQ0luTixpQkFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0E7QUFBQTRDLGNBQU0sR0FBTjtBQUNBRCxjQUNJO0FBQUEsbUJBQVMsbUJBQW1CaU4sS0FBNUI7QUFDQSxxQkFBVztBQURYO0FBRkosT0FEQTtBQUtBO0FDUVA7O0FETkcsUUFBRyxDQUFDaGQsR0FBR2dkLEtBQUgsQ0FBSjtBQUNJbk4saUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQmlOLEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ1VQOztBRFJHLFFBQUcsQ0FBQzlFLFFBQUo7QUFDSUEsaUJBQVcsRUFBWDtBQ1VQOztBRFJHLFFBQUcsQ0FBQytFLE9BQUo7QUFDSUEsZ0JBQVUsRUFBVjtBQ1VQOztBRFJHL0UsYUFBU2hRLEtBQVQsR0FBaUJBLEtBQWpCO0FBRUE2SCxXQUFPL1AsR0FBR2dkLEtBQUgsRUFBVS9SLElBQVYsQ0FBZWlOLFFBQWYsRUFBeUIrRSxPQUF6QixFQUFrQzlSLEtBQWxDLEVBQVA7QUNTSixXRFBJMEUsV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0k7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNQTtBQUROLEtBREosQ0NPSjtBRGxGQSxXQUFBaEssS0FBQTtBQThFTWdCLFFBQUFoQixLQUFBO0FBQ0YyQixZQUFRM0IsS0FBUixDQUFjZ0IsRUFBRWEsS0FBaEI7QUNVSixXRFRJaUksV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0k7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNO0FBRE4sS0FESixDQ1NKO0FBSUQ7QUQ5Rkg7QUFzRkFGLFdBQVdpSCxHQUFYLENBQWUsTUFBZixFQUF1Qix5QkFBdkIsRUFBa0QsVUFBQzNKLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUM5QyxNQUFBNkwsWUFBQSxFQUFBdlksU0FBQSxFQUFBbkksT0FBQSxFQUFBMFQsSUFBQSxFQUFBaEosQ0FBQSxFQUFBaVcsS0FBQSxFQUFBQyxPQUFBLEVBQUEvRSxRQUFBLEVBQUFoUSxLQUFBLEVBQUEwQyxVQUFBLEVBQUEzSSxNQUFBOztBQUFBO0FBRUk1RixjQUFVLElBQUl3RCxPQUFKLENBQWFzTixHQUFiLEVBQWtCQyxHQUFsQixDQUFWOztBQUdBLFFBQUdELElBQUkxQixJQUFQO0FBQ0l4SixlQUFTa0wsSUFBSTFCLElBQUosQ0FBUyxXQUFULENBQVQ7QUFDQWpILGtCQUFZMkksSUFBSTFCLElBQUosQ0FBUyxjQUFULENBQVo7QUNVUDs7QURQRyxRQUFHLENBQUN4SixNQUFELElBQVcsQ0FBQ3VDLFNBQWY7QUFDSXZDLGVBQVM1RixRQUFRNEgsR0FBUixDQUFZLFdBQVosQ0FBVDtBQUNBTyxrQkFBWW5JLFFBQVE0SCxHQUFSLENBQVksY0FBWixDQUFaO0FDU1A7O0FEUEcsUUFBRyxFQUFFaEMsVUFBV3VDLFNBQWIsQ0FBSDtBQUNJcUwsaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLDBDQUFUO0FBQ0Esc0JBQVksWUFEWjtBQUVBLHFCQUFXO0FBRlg7QUFGSixPQURBO0FBTUE7QUNXUDs7QURUR2lOLFlBQVE3UCxJQUFJMUIsSUFBSixDQUFTdVIsS0FBakI7QUFDQTlFLGVBQVcvSyxJQUFJMUIsSUFBSixDQUFTeU0sUUFBcEI7QUFDQStFLGNBQVU5UCxJQUFJMUIsSUFBSixDQUFTd1IsT0FBbkI7QUFDQS9VLFlBQVFpRixJQUFJMUIsSUFBSixDQUFTdkQsS0FBakI7QUFDQTZILFdBQU8sRUFBUDtBQUNBZ04sbUJBQWUsQ0FBQyxhQUFELEVBQWdCLGVBQWhCLEVBQWlDLFlBQWpDLEVBQStDLGVBQS9DLENBQWY7O0FBRUEsUUFBRyxDQUFDN1UsS0FBSjtBQUNJMkgsaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQjdILEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ1lQOztBRFRHMEMsaUJBQWE1SyxHQUFHNkssV0FBSCxDQUFlOUksT0FBZixDQUF1QjtBQUFDQyxZQUFNQyxNQUFQO0FBQWVpRyxhQUFPQTtBQUF0QixLQUF2QixDQUFiOztBQUVBLFFBQUcsQ0FBQzBDLFVBQUo7QUFDSWlGLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUI3SCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNlUDs7QURiRyxRQUFHLENBQUM2VSxhQUFhdGQsUUFBYixDQUFzQnVkLEtBQXRCLENBQUo7QUFDSW5OLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUJpTixLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNpQlA7O0FEZkcsUUFBRyxDQUFDaGQsR0FBR2dkLEtBQUgsQ0FBSjtBQUNJbk4saUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQmlOLEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ21CUDs7QURqQkcsUUFBRyxDQUFDOUUsUUFBSjtBQUNJQSxpQkFBVyxFQUFYO0FDbUJQOztBRGpCRyxRQUFHLENBQUMrRSxPQUFKO0FBQ0lBLGdCQUFVLEVBQVY7QUNtQlA7O0FEakJHLFFBQUdELFVBQVMsZUFBWjtBQUNJOUUsaUJBQVcsRUFBWDtBQUNBQSxlQUFTbUMsS0FBVCxHQUFpQnBZLE1BQWpCO0FBQ0E4TixhQUFPL1AsR0FBR2dkLEtBQUgsRUFBVWpiLE9BQVYsQ0FBa0JtVyxRQUFsQixDQUFQO0FBSEo7QUFLSUEsZUFBU2hRLEtBQVQsR0FBaUJBLEtBQWpCO0FBRUE2SCxhQUFPL1AsR0FBR2dkLEtBQUgsRUFBVWpiLE9BQVYsQ0FBa0JtVyxRQUFsQixFQUE0QitFLE9BQTVCLENBQVA7QUNrQlA7O0FBQ0QsV0RqQklwTixXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDSTtBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU1BO0FBRE4sS0FESixDQ2lCSjtBRGpHQSxXQUFBaEssS0FBQTtBQW1GTWdCLFFBQUFoQixLQUFBO0FBQ0YyQixZQUFRM0IsS0FBUixDQUFjZ0IsRUFBRWEsS0FBaEI7QUNvQkosV0RuQklpSSxXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDSTtBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFETixLQURKLENDbUJKO0FBSUQ7QUQ3R0gsRzs7Ozs7Ozs7Ozs7O0FFeEZBLElBQUFsUSxPQUFBLEVBQUFDLE1BQUEsRUFBQW9kLE9BQUE7QUFBQXBkLFNBQVNnRyxRQUFRLFFBQVIsQ0FBVDtBQUNBakcsVUFBVWlHLFFBQVEsU0FBUixDQUFWO0FBQ0FvWCxVQUFVcFgsUUFBUSxTQUFSLENBQVY7QUFFQStKLFdBQVdpSCxHQUFYLENBQWUsS0FBZixFQUFzQix3QkFBdEIsRUFBZ0QsVUFBQzNKLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUUvQyxNQUFBaE0sR0FBQSxFQUFBVixTQUFBLEVBQUE0SixDQUFBLEVBQUFXLE1BQUEsRUFBQUMsV0FBQSxFQUFBM1MsT0FBQSxFQUFBOGdCLFVBQUEsRUFBQUMsZUFBQSxFQUFBQyxNQUFBLEVBQUFDLGlCQUFBLEVBQUF0UCxXQUFBLEVBQUFsQixDQUFBLEVBQUFxQixFQUFBLEVBQUFvUCxNQUFBLEVBQUFoUCxLQUFBLEVBQUFpUCxJQUFBLEVBQUFoUCxHQUFBLEVBQUE3UCxDQUFBLEVBQUF3VCxHQUFBLEVBQUFzTCxXQUFBLEVBQUFDLFNBQUEsRUFBQXRMLE1BQUEsRUFBQXpFLFVBQUEsRUFBQTBFLGFBQUEsRUFBQXJRLElBQUEsRUFBQUMsTUFBQTtBQUFBaUQsUUFBTWxGLEdBQUdtRixJQUFILENBQVFwRCxPQUFSLENBQWdCb0wsSUFBSXdRLE1BQUosQ0FBVzNZLE1BQTNCLENBQU47O0FBQ0EsTUFBR0UsR0FBSDtBQUNDa04sYUFBU2xOLElBQUlrTixNQUFiO0FBQ0FxTCxrQkFBY3ZZLElBQUl2QyxHQUFsQjtBQUZEO0FBSUN5UCxhQUFTLGtCQUFUO0FBQ0FxTCxrQkFBY3RRLElBQUl3USxNQUFKLENBQVdGLFdBQXpCO0FDS0M7O0FESEYsTUFBRyxDQUFDQSxXQUFKO0FBQ0NyUSxRQUFJd1EsU0FBSixDQUFjLEdBQWQ7QUFDQXhRLFFBQUl5USxHQUFKO0FBQ0E7QUNLQzs7QURIRnhoQixZQUFVLElBQUl3RCxPQUFKLENBQWFzTixHQUFiLEVBQWtCQyxHQUFsQixDQUFWOztBQVlBLE1BQUcsQ0FBQ25MLE1BQUQsSUFBWSxDQUFDdUMsU0FBaEI7QUFDQ3ZDLGFBQVNrTCxJQUFJTSxLQUFKLENBQVUsV0FBVixDQUFUO0FBQ0FqSixnQkFBWTJJLElBQUlNLEtBQUosQ0FBVSxjQUFWLENBQVo7QUNOQzs7QURRRixNQUFHeEwsVUFBV3VDLFNBQWQ7QUFDQ3dKLGtCQUFjckosU0FBU3NKLGVBQVQsQ0FBeUJ6SixTQUF6QixDQUFkO0FBQ0F4QyxXQUFPekYsT0FBT21SLEtBQVAsQ0FBYTNMLE9BQWIsQ0FDTjtBQUFBd0YsV0FBS3RGLE1BQUw7QUFDQSxpREFBMkMrTDtBQUQzQyxLQURNLENBQVA7O0FBR0EsUUFBR2hNLElBQUg7QUFDQzJMLG1CQUFhM0wsS0FBSzJMLFVBQWxCOztBQUNBLFVBQUd6SSxJQUFJa04sTUFBUDtBQUNDakUsYUFBS2pKLElBQUlrTixNQUFUO0FBREQ7QUFHQ2pFLGFBQUssa0JBQUw7QUNMRzs7QURNSmdFLFlBQU1HLFNBQVMsSUFBSWhLLElBQUosR0FBVzBJLE9BQVgsS0FBcUIsSUFBOUIsRUFBb0N4USxRQUFwQyxFQUFOO0FBQ0ErTixjQUFRLEVBQVI7QUFDQUMsWUFBTWIsV0FBV3pPLE1BQWpCOztBQUNBLFVBQUdzUCxNQUFNLEVBQVQ7QUFDQ0osWUFBSSxFQUFKO0FBQ0F0QixZQUFJLENBQUo7QUFDQW5PLFlBQUksS0FBSzZQLEdBQVQ7O0FBQ0EsZUFBTTFCLElBQUluTyxDQUFWO0FBQ0N5UCxjQUFJLE1BQU1BLENBQVY7QUFDQXRCO0FBRkQ7O0FBR0F5QixnQkFBUVosYUFBYVMsQ0FBckI7QUFQRCxhQVFLLElBQUdJLE9BQU8sRUFBVjtBQUNKRCxnQkFBUVosV0FBVzFPLEtBQVgsQ0FBaUIsQ0FBakIsRUFBbUIsRUFBbkIsQ0FBUjtBQ0hHOztBREtKOFAsZUFBU2pQLE9BQU9tUCxjQUFQLENBQXNCLGFBQXRCLEVBQXFDLElBQUlQLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUFyQyxFQUFnRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWhFLENBQVQ7QUFFQWEsb0JBQWNOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDSSxPQUFPSCxNQUFQLENBQWMsSUFBSUYsTUFBSixDQUFXeUQsR0FBWCxFQUFnQixNQUFoQixDQUFkLENBQUQsRUFBeUNwRCxPQUFPRixLQUFQLEVBQXpDLENBQWQsQ0FBZDtBQUVBd0Qsc0JBQWdCckQsWUFBWXhPLFFBQVosQ0FBcUIsUUFBckIsQ0FBaEI7QUFHQTZjLGVBQVMsVUFBVDtBQUNBRyxhQUFPLEVBQVA7QUFDQWhQLFlBQU1iLFdBQVd6TyxNQUFqQjs7QUFDQSxVQUFHc1AsTUFBTSxDQUFUO0FBQ0NKLFlBQUksRUFBSjtBQUNBdEIsWUFBSSxDQUFKO0FBQ0FuTyxZQUFJLElBQUk2UCxHQUFSOztBQUNBLGVBQU0xQixJQUFJbk8sQ0FBVjtBQUNDeVAsY0FBSSxNQUFNQSxDQUFWO0FBQ0F0QjtBQUZEOztBQUdBMFEsZUFBTzdQLGFBQWFTLENBQXBCO0FBUEQsYUFRSyxJQUFHSSxPQUFPLENBQVY7QUFDSmdQLGVBQU83UCxXQUFXMU8sS0FBWCxDQUFpQixDQUFqQixFQUFtQixDQUFuQixDQUFQO0FDTkc7O0FET0prZSxtQkFBYXJkLE9BQU9tUCxjQUFQLENBQXNCLFNBQXRCLEVBQWlDLElBQUlQLE1BQUosQ0FBVzhPLElBQVgsRUFBaUIsTUFBakIsQ0FBakMsRUFBMkQsSUFBSTlPLE1BQUosQ0FBVzJPLE1BQVgsRUFBbUIsTUFBbkIsQ0FBM0QsQ0FBYjtBQUNBRCx3QkFBa0IxTyxPQUFPQyxNQUFQLENBQWMsQ0FBQ3dPLFdBQVd2TyxNQUFYLENBQWtCLElBQUlGLE1BQUosQ0FBV3lELEdBQVgsRUFBZ0IsTUFBaEIsQ0FBbEIsQ0FBRCxFQUE2Q2dMLFdBQVd0TyxLQUFYLEVBQTdDLENBQWQsQ0FBbEI7QUFDQXlPLDBCQUFvQkYsZ0JBQWdCNWMsUUFBaEIsQ0FBeUIsUUFBekIsQ0FBcEI7QUFFQStjLGVBQVMsR0FBVDs7QUFFQSxVQUFHRSxZQUFZNVksT0FBWixDQUFvQixHQUFwQixJQUEyQixDQUFDLENBQS9CO0FBQ0MwWSxpQkFBUyxHQUFUO0FDUEc7O0FEU0pHLGtCQUFZRCxjQUFjRixNQUFkLEdBQXVCLFlBQXZCLEdBQXNDdGIsTUFBdEMsR0FBK0MsZ0JBQS9DLEdBQWtFdUMsU0FBbEUsR0FBOEUsb0JBQTlFLEdBQXFHbUosVUFBckcsR0FBa0gsdUJBQWxILEdBQTRJMEUsYUFBNUksR0FBNEoscUJBQTVKLEdBQW9MaUwsaUJBQWhNOztBQUVBLFVBQUd0YixLQUFLd0wsUUFBUjtBQUNDa1EscUJBQWEseUJBQXVCSSxVQUFVOWIsS0FBS3dMLFFBQWYsQ0FBcEM7QUNSRzs7QURTSkosVUFBSTJRLFNBQUosQ0FBYyxVQUFkLEVBQTBCTCxTQUExQjtBQUNBdFEsVUFBSXdRLFNBQUosQ0FBYyxHQUFkO0FBQ0F4USxVQUFJeVEsR0FBSjtBQUNBO0FBN0RGO0FDdURFOztBRFFGelEsTUFBSXdRLFNBQUosQ0FBYyxHQUFkO0FBQ0F4USxNQUFJeVEsR0FBSjtBQS9GRCxHOzs7Ozs7Ozs7Ozs7QUVKQXRoQixPQUFPMFgsT0FBUCxDQUFlO0FDQ2IsU0RDRHBFLFdBQVdpSCxHQUFYLENBQWUsS0FBZixFQUFzQixpQkFBdEIsRUFBeUMsVUFBQzNKLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUd4QyxRQUFBeUgsS0FBQSxFQUFBcUYsV0FBQSxFQUFBQyxNQUFBLEVBQUFDLFFBQUEsRUFBQXJWLE1BQUEsRUFBQXNWLFFBQUEsRUFBQUMsUUFBQSxFQUFBamUsR0FBQSxFQUFBQyxJQUFBLEVBQUFzQyxJQUFBLEVBQUEyYixpQkFBQSxFQUFBQyxHQUFBLEVBQUF0YyxJQUFBLEVBQUF3TCxRQUFBLEVBQUErUSxjQUFBLEVBQUFDLEtBQUE7QUFBQUEsWUFBUSxFQUFSO0FBQ0EzVixhQUFTLEVBQVQ7QUFDQXFWLGVBQVcsRUFBWDs7QUFDQSxRQUFHL1EsSUFBSU0sS0FBSixDQUFVZ1IsQ0FBYjtBQUNJRCxjQUFRclIsSUFBSU0sS0FBSixDQUFVZ1IsQ0FBbEI7QUNERDs7QURFSCxRQUFHdFIsSUFBSU0sS0FBSixDQUFVcE8sQ0FBYjtBQUNJd0osZUFBU3NFLElBQUlNLEtBQUosQ0FBVXBPLENBQW5CO0FDQUQ7O0FEQ0gsUUFBRzhOLElBQUlNLEtBQUosQ0FBVWlSLEVBQWI7QUFDVVIsaUJBQVcvUSxJQUFJTSxLQUFKLENBQVVpUixFQUFyQjtBQ0NQOztBRENIMWMsV0FBT2hDLEdBQUcwTixLQUFILENBQVMzTCxPQUFULENBQWlCb0wsSUFBSXdRLE1BQUosQ0FBVzFiLE1BQTVCLENBQVA7O0FBQ0EsUUFBRyxDQUFDRCxJQUFKO0FBQ0NvTCxVQUFJd1EsU0FBSixDQUFjLEdBQWQ7QUFDQXhRLFVBQUl5USxHQUFKO0FBQ0E7QUNDRTs7QURDSCxRQUFHN2IsS0FBS08sTUFBUjtBQUNDNkssVUFBSTJRLFNBQUosQ0FBYyxVQUFkLEVBQTBCamdCLFFBQVFvRixXQUFSLENBQW9CLHVCQUF1QmxCLEtBQUtPLE1BQWhELENBQTFCO0FBQ0E2SyxVQUFJd1EsU0FBSixDQUFjLEdBQWQ7QUFDQXhRLFVBQUl5USxHQUFKO0FBQ0E7QUNDRTs7QURDSCxTQUFBMWQsTUFBQTZCLEtBQUEwVSxPQUFBLFlBQUF2VyxJQUFpQm9DLE1BQWpCLEdBQWlCLE1BQWpCO0FBQ0M2SyxVQUFJMlEsU0FBSixDQUFjLFVBQWQsRUFBMEIvYixLQUFLMFUsT0FBTCxDQUFhblUsTUFBdkM7QUFDQTZLLFVBQUl3USxTQUFKLENBQWMsR0FBZDtBQUNBeFEsVUFBSXlRLEdBQUo7QUFDQTtBQ0NFOztBRENILFFBQUc3YixLQUFLUSxTQUFSO0FBQ0M0SyxVQUFJMlEsU0FBSixDQUFjLFVBQWQsRUFBMEIvYixLQUFLUSxTQUEvQjtBQUNBNEssVUFBSXdRLFNBQUosQ0FBYyxHQUFkO0FBQ0F4USxVQUFJeVEsR0FBSjtBQUNBO0FDQ0U7O0FEQ0gsUUFBTyxPQUFBYyxJQUFBLG9CQUFBQSxTQUFBLElBQVA7QUFDQ3ZSLFVBQUkyUSxTQUFKLENBQWMscUJBQWQsRUFBcUMsUUFBckM7QUFDQTNRLFVBQUkyUSxTQUFKLENBQWMsY0FBZCxFQUE4QixlQUE5QjtBQUNBM1EsVUFBSTJRLFNBQUosQ0FBYyxlQUFkLEVBQStCLDBCQUEvQjtBQUNBTyxZQUFNLGk4QkFBTjtBQXNCQWxSLFVBQUl3UixLQUFKLENBQVVOLEdBQVY7QUFHQWxSLFVBQUl5USxHQUFKO0FBQ0E7QUN0QkU7O0FEd0JIclEsZUFBV3hMLEtBQUszRCxJQUFoQjs7QUFDQSxRQUFHLENBQUNtUCxRQUFKO0FBQ0NBLGlCQUFXLEVBQVg7QUN0QkU7O0FEd0JISixRQUFJMlEsU0FBSixDQUFjLHFCQUFkLEVBQXFDLFFBQXJDOztBQUVBLFFBQU8sT0FBQVksSUFBQSxvQkFBQUEsU0FBQSxJQUFQO0FBQ0N2UixVQUFJMlEsU0FBSixDQUFjLGNBQWQsRUFBOEIsZUFBOUI7QUFDQTNRLFVBQUkyUSxTQUFKLENBQWMsZUFBZCxFQUErQiwwQkFBL0I7QUFFQUUsZUFBUyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELEVBQXVFLFNBQXZFLEVBQWlGLFNBQWpGLEVBQTJGLFNBQTNGLEVBQXFHLFNBQXJHLEVBQStHLFNBQS9HLEVBQXlILFNBQXpILEVBQW1JLFNBQW5JLEVBQTZJLFNBQTdJLEVBQXVKLFNBQXZKLEVBQWlLLFNBQWpLLEVBQTJLLFNBQTNLLENBQVQ7QUFFQU0sdUJBQWlCN2dCLE1BQU1vQixJQUFOLENBQVcwTyxRQUFYLENBQWpCO0FBQ0F3USxvQkFBYyxDQUFkOztBQUNBalQsUUFBRXJDLElBQUYsQ0FBTzZWLGNBQVAsRUFBdUIsVUFBQ00sSUFBRDtBQ3pCbEIsZUQwQkpiLGVBQWVhLEtBQUtDLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0MxQlg7QUR5Qkw7O0FBR0FWLGlCQUFXSixjQUFjQyxPQUFPL2UsTUFBaEM7QUFDQXlaLGNBQVFzRixPQUFPRyxRQUFQLENBQVI7QUFHQUQsaUJBQVcsRUFBWDs7QUFDQSxVQUFHM1EsU0FBU3NSLFVBQVQsQ0FBb0IsQ0FBcEIsSUFBdUIsR0FBMUI7QUFDQ1gsbUJBQVczUSxTQUFTdVIsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFYO0FBREQ7QUFHQ1osbUJBQVczUSxTQUFTdVIsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixDQUFYO0FDM0JHOztBRDZCSlosaUJBQVdBLFNBQVNhLFdBQVQsRUFBWDtBQUVBVixZQUFNLDZJQUVpRUUsS0FGakUsR0FFdUUsY0FGdkUsR0FFbUYzVixNQUZuRixHQUUwRixvQkFGMUYsR0FFNEcyVixLQUY1RyxHQUVrSCxjQUZsSCxHQUVnSTNWLE1BRmhJLEdBRXVJLHdCQUZ2SSxHQUUrSjhQLEtBRi9KLEdBRXFLLG1QQUZySyxHQUd3TnVGLFFBSHhOLEdBR2lPLFlBSGpPLEdBSUZDLFFBSkUsR0FJTyxvQkFKYjtBQVNBL1EsVUFBSXdSLEtBQUosQ0FBVU4sR0FBVjtBQUNBbFIsVUFBSXlRLEdBQUo7QUFDQTtBQ3BDRTs7QURzQ0hRLHdCQUFvQmxSLElBQUlZLE9BQUosQ0FBWSxtQkFBWixDQUFwQjs7QUFDQSxRQUFHc1EscUJBQUEsSUFBSDtBQUNDLFVBQUdBLHVCQUFBLENBQUFqZSxPQUFBNEIsS0FBQTJSLFFBQUEsWUFBQXZULEtBQW9DNmUsV0FBcEMsS0FBcUIsTUFBckIsQ0FBSDtBQUNDN1IsWUFBSTJRLFNBQUosQ0FBYyxlQUFkLEVBQStCTSxpQkFBL0I7QUFDQWpSLFlBQUl3USxTQUFKLENBQWMsR0FBZDtBQUNBeFEsWUFBSXlRLEdBQUo7QUFDQTtBQUxGO0FDOUJHOztBRHFDSHpRLFFBQUkyUSxTQUFKLENBQWMsZUFBZCxJQUFBcmIsT0FBQVYsS0FBQTJSLFFBQUEsWUFBQWpSLEtBQThDdWMsV0FBOUMsS0FBK0IsTUFBL0IsS0FBK0QsSUFBSTNXLElBQUosR0FBVzJXLFdBQVgsRUFBL0Q7QUFDQTdSLFFBQUkyUSxTQUFKLENBQWMsY0FBZCxFQUE4QixZQUE5QjtBQUNBM1EsUUFBSTJRLFNBQUosQ0FBYyxnQkFBZCxFQUFnQ1ksS0FBS3pmLE1BQXJDO0FBRUF5ZixTQUFLTyxVQUFMLENBQWdCQyxJQUFoQixDQUFxQi9SLEdBQXJCO0FBM0hELElDREM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQTdRLE9BQU8wWCxPQUFQLENBQWU7QUNDYixTREFEcEUsV0FBV2lILEdBQVgsQ0FBZSxLQUFmLEVBQXNCLG1CQUF0QixFQUEyQyxVQUFDM0osR0FBRCxFQUFNQyxHQUFOLEVBQVc4RCxJQUFYO0FBRTFDLFFBQUEvQixZQUFBLEVBQUFoUCxHQUFBO0FBQUFnUCxtQkFBQSxDQUFBaFAsTUFBQWdOLElBQUFNLEtBQUEsWUFBQXROLElBQTBCZ1AsWUFBMUIsR0FBMEIsTUFBMUI7O0FBRUEsUUFBR3JSLFFBQVFvUix3QkFBUixDQUFpQ0MsWUFBakMsQ0FBSDtBQUNDL0IsVUFBSXdRLFNBQUosQ0FBYyxHQUFkO0FBQ0F4USxVQUFJeVEsR0FBSjtBQUZEO0FBS0N6USxVQUFJd1EsU0FBSixDQUFjLEdBQWQ7QUFDQXhRLFVBQUl5USxHQUFKO0FDREU7QURUSixJQ0FDO0FEREYsRzs7Ozs7Ozs7Ozs7O0FFQUEsSUFBR3RoQixPQUFPSSxRQUFWO0FBQ0lKLFNBQU82ZixPQUFQLENBQWUsTUFBZixFQUF1QixVQUFDclUsT0FBRDtBQUNuQixRQUFBbVEsUUFBQTs7QUFBQSxTQUFPLEtBQUtqVyxNQUFaO0FBQ0ksYUFBTyxLQUFLbWQsS0FBTCxFQUFQO0FDRVA7O0FEQ0dsSCxlQUFXO0FBQUNoUSxhQUFPO0FBQUMwVSxpQkFBUztBQUFWO0FBQVIsS0FBWDs7QUFDQSxRQUFHN1UsT0FBSDtBQUNJbVEsaUJBQVc7QUFBQ3lFLGFBQUssQ0FBQztBQUFDelUsaUJBQU87QUFBQzBVLHFCQUFTO0FBQVY7QUFBUixTQUFELEVBQTRCO0FBQUMxVSxpQkFBT0g7QUFBUixTQUE1QjtBQUFOLE9BQVg7QUNlUDs7QURiRyxXQUFPL0gsR0FBR21GLElBQUgsQ0FBUThGLElBQVIsQ0FBYWlOLFFBQWIsRUFBdUI7QUFBQ25hLFlBQU07QUFBQ0EsY0FBTTtBQUFQO0FBQVAsS0FBdkIsQ0FBUDtBQVRKO0FDNkJILEM7Ozs7Ozs7Ozs7OztBQzFCQXhCLE9BQU82ZixPQUFQLENBQWUsV0FBZixFQUE0QjtBQUMzQixNQUFBaUQsTUFBQSxFQUFBQyxPQUFBLEVBQUFDLGFBQUEsRUFBQUMsSUFBQSxFQUFBQyxHQUFBLEVBQUFDLFVBQUE7O0FBQUEsT0FBTyxLQUFLemQsTUFBWjtBQUNDLFdBQU8sS0FBS21kLEtBQUwsRUFBUDtBQ0ZBOztBREtESSxTQUFPLElBQVA7QUFDQUUsZUFBYSxFQUFiO0FBQ0FELFFBQU16ZixHQUFHNkssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUNqSixVQUFNLEtBQUtDLE1BQVo7QUFBb0IwZCxtQkFBZTtBQUFuQyxHQUFwQixFQUE4RDtBQUFDN1UsWUFBUTtBQUFDNUMsYUFBTTtBQUFQO0FBQVQsR0FBOUQsQ0FBTjtBQUNBdVgsTUFBSWhoQixPQUFKLENBQVksVUFBQ21oQixFQUFEO0FDSVYsV0RIREYsV0FBVzlnQixJQUFYLENBQWdCZ2hCLEdBQUcxWCxLQUFuQixDQ0dDO0FESkY7QUFHQW9YLFlBQVUsSUFBVjtBQUdBRCxXQUFTcmYsR0FBRzZLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDakosVUFBTSxLQUFLQyxNQUFaO0FBQW9CMGQsbUJBQWU7QUFBbkMsR0FBcEIsRUFBOERFLE9BQTlELENBQ1I7QUFBQUMsV0FBTyxVQUFDQyxHQUFEO0FBQ04sVUFBR0EsSUFBSTdYLEtBQVA7QUFDQyxZQUFHd1gsV0FBVzdhLE9BQVgsQ0FBbUJrYixJQUFJN1gsS0FBdkIsSUFBZ0MsQ0FBbkM7QUFDQ3dYLHFCQUFXOWdCLElBQVgsQ0FBZ0JtaEIsSUFBSTdYLEtBQXBCO0FDS0ksaUJESkpxWCxlQ0lJO0FEUE47QUNTRztBRFZKO0FBS0FTLGFBQVMsVUFBQ0MsTUFBRDtBQUNSLFVBQUdBLE9BQU8vWCxLQUFWO0FBQ0NzWCxhQUFLUSxPQUFMLENBQWEsUUFBYixFQUF1QkMsT0FBTy9YLEtBQTlCO0FDUUcsZURQSHdYLGFBQWEzVSxFQUFFbVYsT0FBRixDQUFVUixVQUFWLEVBQXNCTyxPQUFPL1gsS0FBN0IsQ0NPVjtBQUNEO0FEaEJKO0FBQUEsR0FEUSxDQUFUOztBQVdBcVgsa0JBQWdCO0FBQ2YsUUFBR0QsT0FBSDtBQUNDQSxjQUFRYSxJQUFSO0FDVUM7O0FBQ0QsV0RWRGIsVUFBVXRmLEdBQUdvSSxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQzFELFdBQUs7QUFBQzJELGFBQUt3VTtBQUFOO0FBQU4sS0FBZixFQUF5Q0csT0FBekMsQ0FDVDtBQUFBQyxhQUFPLFVBQUNDLEdBQUQ7QUFDTlAsYUFBS00sS0FBTCxDQUFXLFFBQVgsRUFBcUJDLElBQUl4WSxHQUF6QixFQUE4QndZLEdBQTlCO0FDZUcsZURkSEwsV0FBVzlnQixJQUFYLENBQWdCbWhCLElBQUl4WSxHQUFwQixDQ2NHO0FEaEJKO0FBR0E2WSxlQUFTLFVBQUNDLE1BQUQsRUFBU0osTUFBVDtBQ2dCTCxlRGZIVCxLQUFLWSxPQUFMLENBQWEsUUFBYixFQUF1QkMsT0FBTzlZLEdBQTlCLEVBQW1DOFksTUFBbkMsQ0NlRztBRG5CSjtBQUtBTCxlQUFTLFVBQUNDLE1BQUQ7QUFDUlQsYUFBS1EsT0FBTCxDQUFhLFFBQWIsRUFBdUJDLE9BQU8xWSxHQUE5QjtBQ2lCRyxlRGhCSG1ZLGFBQWEzVSxFQUFFbVYsT0FBRixDQUFVUixVQUFWLEVBQXNCTyxPQUFPMVksR0FBN0IsQ0NnQlY7QUR2Qko7QUFBQSxLQURTLENDVVQ7QURiYyxHQUFoQjs7QUFhQWdZO0FBRUFDLE9BQUtKLEtBQUw7QUNrQkEsU0RoQkFJLEtBQUtjLE1BQUwsQ0FBWTtBQUNYakIsV0FBT2MsSUFBUDs7QUFDQSxRQUFHYixPQUFIO0FDaUJHLGFEaEJGQSxRQUFRYSxJQUFSLEVDZ0JFO0FBQ0Q7QURwQkgsSUNnQkE7QUQxREQsRzs7Ozs7Ozs7Ozs7O0FFSEQ1akIsT0FBTzZmLE9BQVAsQ0FBZSxjQUFmLEVBQStCLFVBQUNyVSxPQUFEO0FBQzlCLE9BQU9BLE9BQVA7QUFDQyxXQUFPLEtBQUtxWCxLQUFMLEVBQVA7QUNBQzs7QURFRixTQUFPcGYsR0FBR29JLE1BQUgsQ0FBVTZDLElBQVYsQ0FBZTtBQUFDMUQsU0FBS1E7QUFBTixHQUFmLEVBQStCO0FBQUMrQyxZQUFRO0FBQUN2SSxjQUFRLENBQVQ7QUFBV2xFLFlBQU0sQ0FBakI7QUFBbUJraUIsdUJBQWdCO0FBQW5DO0FBQVQsR0FBL0IsQ0FBUDtBQUpELEc7Ozs7Ozs7Ozs7OztBRURBaGtCLE9BQU82ZixPQUFQLENBQWUsU0FBZixFQUEwQjtBQUN6QixPQUFPLEtBQUtuYSxNQUFaO0FBQ0MsV0FBTyxLQUFLbWQsS0FBTCxFQUFQO0FDQ0M7O0FEQ0YsU0FBT3BmLEdBQUdvTSxPQUFILENBQVduQixJQUFYLEVBQVA7QUFKRCxHOzs7Ozs7Ozs7Ozs7QUVBQTFPLE9BQU82ZixPQUFQLENBQWUsNkJBQWYsRUFBOEMsVUFBQzdVLEdBQUQ7QUFDN0MsT0FBTyxLQUFLdEYsTUFBWjtBQUNDLFdBQU8sS0FBS21kLEtBQUwsRUFBUDtBQ0NDOztBRENGLE9BQU83WCxHQUFQO0FBQ0MsV0FBTyxLQUFLNlgsS0FBTCxFQUFQO0FDQ0M7O0FEQ0YsU0FBT3BmLEdBQUd3WSxtQkFBSCxDQUF1QnZOLElBQXZCLENBQTRCO0FBQUMxRCxTQUFLQTtBQUFOLEdBQTVCLENBQVA7QUFQRCxHOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFBaVosV0FBQTtBQUFBQSxjQUFjMWEsUUFBUSxlQUFSLENBQWQ7QUFFQStKLFdBQVdpSCxHQUFYLENBQWUsS0FBZixFQUFzQiwwQkFBdEIsRUFBaUQsVUFBQzNKLEdBQUQsRUFBTUMsR0FBTixFQUFXOEQsSUFBWDtBQUNoRCxNQUFBdVAsWUFBQSxFQUFBamMsU0FBQSxFQUFBa2MsV0FBQSxFQUFBdmdCLEdBQUEsRUFBQW9OLE1BQUEsRUFBQXJGLEtBQUEsRUFBQUgsT0FBQSxFQUFBOUYsTUFBQSxFQUFBMGUsV0FBQTtBQUFBMWUsV0FBU2tMLElBQUlZLE9BQUosQ0FBWSxXQUFaLENBQVQ7QUFDQWhHLFlBQVVvRixJQUFJWSxPQUFKLENBQVksWUFBWixPQUFBNU4sTUFBQWdOLElBQUF3USxNQUFBLFlBQUF4ZCxJQUF5QzRILE9BQXpDLEdBQXlDLE1BQXpDLENBQVY7O0FBQ0EsTUFBRyxDQUFDOUYsTUFBSjtBQUNDNE4sZUFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNO0FBRE4sS0FERDtBQUdBO0FDS0M7O0FESEYwUSxpQkFBZXZOLFFBQVEwTixjQUFSLENBQXVCM2UsTUFBdkIsRUFBK0I4RixPQUEvQixFQUF3QyxJQUF4QyxDQUFmOztBQUNBLE9BQU8wWSxZQUFQO0FBQ0M1USxlQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQztBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFETixLQUREO0FBR0E7QUNNQzs7QURKRjdILFVBQVFnTCxRQUFRSSxXQUFSLENBQW9CLFFBQXBCLEVBQThCdlIsT0FBOUIsQ0FBc0M7QUFBQ3dGLFNBQUtRO0FBQU4sR0FBdEMsRUFBc0Q7QUFBQytDLFlBQVE7QUFBQ3pNLFlBQU07QUFBUDtBQUFULEdBQXRELENBQVI7QUFFQWtQLFdBQVMyRixRQUFRMk4saUJBQVIsQ0FBMEI5WSxPQUExQixFQUFtQzlGLE1BQW5DLENBQVQ7QUFDQXNMLFNBQU9rVCxZQUFQLEdBQXNCQSxZQUF0QjtBQUNBbFQsU0FBT3JGLEtBQVAsR0FBZUEsS0FBZjtBQUNBcUYsU0FBT3BJLElBQVAsR0FBYzRGLEVBQUVpSCxNQUFGLENBQVNrQixRQUFRQyxTQUFSLENBQWtCcEwsT0FBbEIsQ0FBVCxFQUFxQ21MLFFBQVE0TixJQUE3QyxDQUFkO0FBQ0F2VCxTQUFPd1QsZ0JBQVAsR0FBMEI3TixRQUFRMkcsdUJBQVIsQ0FBZ0M1WCxNQUFoQyxFQUF3QzhGLE9BQXhDLEVBQWlEd0YsT0FBT3VNLE9BQXhELENBQTFCO0FBQ0F2TSxTQUFPeVQsZ0JBQVAsR0FBMEJ6a0IsT0FBTytULElBQVAsQ0FBWSxzQkFBWixFQUFvQ3ZJLE9BQXBDLEVBQTZDOUYsTUFBN0MsQ0FBMUI7QUFFQXVDLGNBQVkxRyxRQUFRK1YsWUFBUixDQUFxQjFHLEdBQXJCLEVBQTBCQyxHQUExQixDQUFaO0FBRUF1VCxnQkFBY3BrQixPQUFPMGtCLFNBQVAsQ0FBaUIsVUFBQ3pjLFNBQUQsRUFBWXVELE9BQVosRUFBcUJtWixFQUFyQjtBQ1M1QixXRFJEVixZQUFZVyxVQUFaLENBQXVCM2MsU0FBdkIsRUFBa0N1RCxPQUFsQyxFQUEyQ3FaLElBQTNDLENBQWdELFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQ1M3QyxhRFJGSixHQUFHSSxNQUFILEVBQVdELE9BQVgsQ0NRRTtBRFRILE1DUUM7QURUVyxLQUdYN2MsU0FIVyxFQUdBdUQsT0FIQSxDQUFkO0FBS0EyWSxnQkFBY25rQixPQUFPMGtCLFNBQVAsQ0FBaUIsVUFBQzdrQixDQUFELEVBQUl1a0IsV0FBSixFQUFpQk8sRUFBakI7QUNTNUIsV0RSRjlrQixFQUFFbWxCLHVCQUFGLENBQTBCWixXQUExQixFQUF1Q1MsSUFBdkMsQ0FBNEMsVUFBQ0MsT0FBRCxFQUFVQyxNQUFWO0FDU3hDLGFEUkhKLEdBQUdJLE1BQUgsRUFBV0QsT0FBWCxDQ1FHO0FEVEosTUNRRTtBRFRXLElBQWQ7O0FBSUF0VyxJQUFFckMsSUFBRixDQUFPd0ssUUFBUXNPLGFBQVIsQ0FBc0JDLGNBQXRCLEVBQVAsRUFBK0MsVUFBQ0MsVUFBRCxFQUFhcmpCLElBQWI7QUFDOUMsUUFBQXNqQixpQkFBQTs7QUFBQSxRQUFHdGpCLFNBQVEsU0FBWDtBQUNDc2pCLDBCQUFvQkQsV0FBV0UsVUFBWCxFQUFwQjtBQ1dHLGFEVkg3VyxFQUFFckMsSUFBRixDQUFPaVosaUJBQVAsRUFBMEIsVUFBQ3ZsQixDQUFELEVBQUlvQyxDQUFKO0FBQ3pCLFlBQUFxakIsSUFBQTs7QUFBQUEsZUFBTzNPLFFBQVE0TyxhQUFSLENBQXNCMWxCLEVBQUUybEIsUUFBRixFQUF0QixDQUFQO0FBRUFGLGFBQUt4akIsSUFBTCxHQUFZRyxDQUFaO0FBQ0FxakIsYUFBS0csYUFBTCxHQUFxQjNqQixJQUFyQjtBQUNBd2pCLGFBQUtuQixXQUFMLEdBQW1CQSxZQUFZdGtCLENBQVosRUFBZXVrQixXQUFmLENBQW5CO0FDV0ksZURWSnBULE9BQU91TSxPQUFQLENBQWUrSCxLQUFLeGpCLElBQXBCLElBQTRCd2pCLElDVXhCO0FEaEJMLFFDVUc7QUFRRDtBRHJCSjs7QUFXQTlXLElBQUVyQyxJQUFGLENBQU93SyxRQUFRc08sYUFBUixDQUFzQkMsY0FBdEIsRUFBUCxFQUErQyxVQUFDQyxVQUFELEVBQWFyakIsSUFBYjtBQ2E1QyxXRFpGa1AsT0FBT3BJLElBQVAsR0FBYzRGLEVBQUVpSCxNQUFGLENBQVN6RSxPQUFPcEksSUFBaEIsRUFBc0J1YyxXQUFXTyxhQUFYLEVBQXRCLENDWVo7QURiSDs7QUNlQyxTRFpEcFMsV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTRDLFVBQU0sR0FBTjtBQUNBRCxVQUFNeEM7QUFETixHQURELENDWUM7QUQ5REYsRzs7Ozs7Ozs7Ozs7O0FFRkFzQyxXQUFXaUgsR0FBWCxDQUFlLE1BQWYsRUFBdUIsOEJBQXZCLEVBQXVELFVBQUMzSixHQUFELEVBQU1DLEdBQU4sRUFBVzhELElBQVg7QUFDdEQsTUFBQXpGLElBQUEsRUFBQTFFLENBQUE7O0FBQUE7QUFDQzBFLFdBQU8sRUFBUDtBQUNBMEIsUUFBSStVLEVBQUosQ0FBTyxNQUFQLEVBQWUsVUFBQ0MsS0FBRDtBQ0VYLGFEREgxVyxRQUFRMFcsS0NDTDtBREZKO0FBR0FoVixRQUFJK1UsRUFBSixDQUFPLEtBQVAsRUFBYzNsQixPQUFPNmxCLGVBQVAsQ0FBd0I7QUFDcEMsVUFBQUMsTUFBQSxFQUFBQyxNQUFBO0FBQUFBLGVBQVN4YyxRQUFRLFFBQVIsQ0FBVDtBQUNBdWMsZUFBUyxJQUFJQyxPQUFPQyxNQUFYLENBQWtCO0FBQUU1UCxjQUFLLElBQVA7QUFBYTZQLHVCQUFjLEtBQTNCO0FBQWtDQyxzQkFBYTtBQUEvQyxPQUFsQixDQUFUO0FDT0UsYURORkosT0FBT0ssV0FBUCxDQUFtQmpYLElBQW5CLEVBQXlCLFVBQUNrWCxHQUFELEVBQU1wVixNQUFOO0FBRXZCLFlBQUFxVixLQUFBLEVBQUFDLE1BQUEsRUFBQUMsR0FBQSxFQUFBQyxXQUFBLEVBQUFDLElBQUEsRUFBQUMsS0FBQTtBQUFBTCxnQkFBUTljLFFBQVEsWUFBUixDQUFSO0FBQ0FtZCxnQkFBUUwsTUFBTTtBQUNiTSxpQkFBTzNtQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QnltQixLQURsQjtBQUViQyxrQkFBUTVtQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QjBtQixNQUZuQjtBQUdiQyx1QkFBYTdtQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QjJtQjtBQUh4QixTQUFOLENBQVI7QUFLQUosZUFBT0MsTUFBTUQsSUFBTixDQUFXalksRUFBRXNZLEtBQUYsQ0FBUTlWLE1BQVIsQ0FBWCxDQUFQO0FBQ0FzVixpQkFBUzFsQixLQUFLQyxLQUFMLENBQVdtUSxPQUFPc1YsTUFBbEIsQ0FBVDtBQUNBRSxzQkFBY0YsT0FBT0UsV0FBckI7QUFDQUQsY0FBTTlpQixHQUFHd1ksbUJBQUgsQ0FBdUJ6VyxPQUF2QixDQUErQmdoQixXQUEvQixDQUFOOztBQUNBLFlBQUdELE9BQVFBLElBQUlRLFNBQUosS0FBaUJ2UyxPQUFPeEQsT0FBTytWLFNBQWQsQ0FBekIsSUFBc0ROLFNBQVF6VixPQUFPeVYsSUFBeEU7QUFDQ2hqQixhQUFHd1ksbUJBQUgsQ0FBdUI1SixNQUF2QixDQUE4QjtBQUFDckgsaUJBQUt3YjtBQUFOLFdBQTlCLEVBQWtEO0FBQUNwTyxrQkFBTTtBQUFDb0Usb0JBQU07QUFBUDtBQUFQLFdBQWxEO0FDYUcsaUJEWkh3SyxlQUFlQyxXQUFmLENBQTJCVixJQUFJNWEsS0FBL0IsRUFBc0M0YSxJQUFJMVcsT0FBMUMsRUFBbUQyRSxPQUFPeEQsT0FBTytWLFNBQWQsQ0FBbkQsRUFBNkVSLElBQUlwUCxVQUFqRixFQUE2Rm9QLElBQUk5YSxRQUFqRyxFQUEyRzhhLElBQUlXLFVBQS9HLENDWUc7QUFDRDtBRDNCTCxRQ01FO0FEVGlDLEtBQXZCLEVBb0JWLFVBQUNkLEdBQUQ7QUFDRmpiLGNBQVEzQixLQUFSLENBQWM0YyxJQUFJL2EsS0FBbEI7QUNhRSxhRFpGRixRQUFRNlQsR0FBUixDQUFZLDRCQUFaLENDWUU7QURsQ1UsTUFBZDtBQUxELFdBQUF4VixLQUFBO0FBK0JNZ0IsUUFBQWhCLEtBQUE7QUFDTDJCLFlBQVEzQixLQUFSLENBQWNnQixFQUFFYSxLQUFoQjtBQ1lDOztBRFZGd0YsTUFBSXdRLFNBQUosQ0FBYyxHQUFkLEVBQW1CO0FBQUMsb0JBQWdCO0FBQWpCLEdBQW5CO0FDY0MsU0RiRHhRLElBQUl5USxHQUFKLENBQVEsMkRBQVIsQ0NhQztBRGpERixHOzs7Ozs7Ozs7Ozs7QUVBQXRoQixPQUFPa1ksT0FBUCxDQUNDO0FBQUFpUCxzQkFBb0IsVUFBQ3hiLEtBQUQ7QUFLbkIsUUFBQXliLEtBQUEsRUFBQUMsYUFBQSxFQUFBQyxnQkFBQSxFQUFBL1csQ0FBQSxFQUFBZ1gsT0FBQSxFQUFBelMsQ0FBQSxFQUFBN0MsR0FBQSxFQUFBdVYsSUFBQSxFQUFBQyxLQUFBLEVBQUFDLE1BQUEsRUFBQUMsY0FBQSxFQUFBQyxPQUFBLEVBQUFDLFFBQUEsRUFBQUMsTUFBQSxFQUFBdE4sSUFBQSxFQUFBdU4scUJBQUEsRUFBQW5iLE9BQUEsRUFBQW9iLE9BQUEsRUFBQUMsV0FBQSxFQUFBQyxNQUFBLEVBQUFDLEdBQUE7QUFBQXZZLFVBQU1qRSxLQUFOLEVBQWF5YyxNQUFiO0FBQ0F4YixjQUNDO0FBQUEyYSxlQUFTLElBQVQ7QUFDQVEsNkJBQXVCO0FBRHZCLEtBREQ7O0FBR0EsU0FBTyxLQUFLcmlCLE1BQVo7QUFDQyxhQUFPa0gsT0FBUDtBQ0RFOztBREVIMmEsY0FBVSxLQUFWO0FBQ0FRLDRCQUF3QixFQUF4QjtBQUNBQyxjQUFVdmtCLEdBQUc0a0IsY0FBSCxDQUFrQjdpQixPQUFsQixDQUEwQjtBQUFDbUcsYUFBT0EsS0FBUjtBQUFlaEcsV0FBSztBQUFwQixLQUExQixDQUFWO0FBQ0EraEIsYUFBQSxDQUFBTSxXQUFBLE9BQVNBLFFBQVNwSixNQUFsQixHQUFrQixNQUFsQixLQUE0QixFQUE1Qjs7QUFFQSxRQUFHOEksT0FBTy9rQixNQUFWO0FBQ0NtbEIsZUFBU3JrQixHQUFHMEssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQy9DLGVBQU9BLEtBQVI7QUFBZXdGLGVBQU8sS0FBS3pMO0FBQTNCLE9BQXRCLEVBQTBEO0FBQUM2SSxnQkFBTztBQUFDdkQsZUFBSztBQUFOO0FBQVIsT0FBMUQsQ0FBVDtBQUNBNmMsaUJBQVdDLE9BQU9qTSxHQUFQLENBQVcsVUFBQ0MsQ0FBRDtBQUNyQixlQUFPQSxFQUFFOVEsR0FBVDtBQURVLFFBQVg7O0FBRUEsV0FBTzZjLFNBQVNsbEIsTUFBaEI7QUFDQyxlQUFPaUssT0FBUDtBQ1VHOztBRFJKK2EsdUJBQWlCLEVBQWpCOztBQUNBLFdBQUFwWCxJQUFBLEdBQUEwQixNQUFBeVYsT0FBQS9rQixNQUFBLEVBQUE0TixJQUFBMEIsR0FBQSxFQUFBMUIsR0FBQTtBQ1VLa1gsZ0JBQVFDLE9BQU9uWCxDQUFQLENBQVI7QURUSjZXLGdCQUFRSyxNQUFNTCxLQUFkO0FBQ0FlLGNBQU1WLE1BQU1VLEdBQVo7QUFDQWQsd0JBQWdCNWpCLEdBQUcwSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFDL0MsaUJBQU9BLEtBQVI7QUFBZXlDLG1CQUFTO0FBQUNPLGlCQUFLeVk7QUFBTjtBQUF4QixTQUF0QixFQUE2RDtBQUFDN1ksa0JBQU87QUFBQ3ZELGlCQUFLO0FBQU47QUFBUixTQUE3RCxDQUFoQjtBQUNBc2MsMkJBQUFELGlCQUFBLE9BQW1CQSxjQUFleEwsR0FBZixDQUFtQixVQUFDQyxDQUFEO0FBQ3JDLGlCQUFPQSxFQUFFOVEsR0FBVDtBQURrQixVQUFuQixHQUFtQixNQUFuQjs7QUFFQSxhQUFBOEosSUFBQSxHQUFBMFMsT0FBQUssU0FBQWxsQixNQUFBLEVBQUFtUyxJQUFBMFMsSUFBQSxFQUFBMVMsR0FBQTtBQ3FCTThTLG9CQUFVQyxTQUFTL1MsQ0FBVCxDQUFWO0FEcEJMbVQsd0JBQWMsS0FBZDs7QUFDQSxjQUFHYixNQUFNOWUsT0FBTixDQUFjc2YsT0FBZCxJQUF5QixDQUFDLENBQTdCO0FBQ0NLLDBCQUFjLElBQWQ7QUFERDtBQUdDLGdCQUFHWCxpQkFBaUJoZixPQUFqQixDQUF5QnNmLE9BQXpCLElBQW9DLENBQUMsQ0FBeEM7QUFDQ0ssNEJBQWMsSUFBZDtBQUpGO0FDMkJNOztBRHRCTixjQUFHQSxXQUFIO0FBQ0NWLHNCQUFVLElBQVY7QUFDQVEsa0NBQXNCMWxCLElBQXRCLENBQTJCOGxCLEdBQTNCO0FBQ0FSLDJCQUFldGxCLElBQWYsQ0FBb0J1bEIsT0FBcEI7QUN3Qks7QURsQ1A7QUFORDs7QUFrQkFELHVCQUFpQm5aLEVBQUU2QixJQUFGLENBQU9zWCxjQUFQLENBQWpCOztBQUNBLFVBQUdBLGVBQWVobEIsTUFBZixHQUF3QmtsQixTQUFTbGxCLE1BQXBDO0FBRUM0a0Isa0JBQVUsS0FBVjtBQUNBUSxnQ0FBd0IsRUFBeEI7QUFIRDtBQUtDQSxnQ0FBd0J2WixFQUFFNkIsSUFBRixDQUFPN0IsRUFBRUMsT0FBRixDQUFVc1oscUJBQVYsQ0FBUCxDQUF4QjtBQWhDRjtBQzBERzs7QUR4QkgsUUFBR1IsT0FBSDtBQUNDVyxlQUFTemtCLEdBQUcwSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFDL0MsZUFBT0EsS0FBUjtBQUFlWCxhQUFLO0FBQUMyRCxlQUFLb1o7QUFBTjtBQUFwQixPQUF0QixFQUF5RTtBQUFDeFosZ0JBQU87QUFBQ3ZELGVBQUssQ0FBTjtBQUFTb0QsbUJBQVM7QUFBbEI7QUFBUixPQUF6RSxFQUF3R1EsS0FBeEcsRUFBVDtBQUdBNEwsYUFBT2hNLEVBQUUyQixNQUFGLENBQVMrWCxNQUFULEVBQWlCLFVBQUM5WCxHQUFEO0FBQ3ZCLFlBQUFoQyxPQUFBO0FBQUFBLGtCQUFVZ0MsSUFBSWhDLE9BQUosSUFBZSxFQUF6QjtBQUNBLGVBQU9JLEVBQUU4WixZQUFGLENBQWVsYSxPQUFmLEVBQXdCMloscUJBQXhCLEVBQStDcGxCLE1BQS9DLEdBQXdELENBQXhELElBQThENkwsRUFBRThaLFlBQUYsQ0FBZWxhLE9BQWYsRUFBd0J5WixRQUF4QixFQUFrQ2xsQixNQUFsQyxHQUEyQyxDQUFoSDtBQUZNLFFBQVA7QUFHQW9sQiw4QkFBd0J2TixLQUFLcUIsR0FBTCxDQUFTLFVBQUNDLENBQUQ7QUFDaEMsZUFBT0EsRUFBRTlRLEdBQVQ7QUFEdUIsUUFBeEI7QUNzQ0U7O0FEbkNINEIsWUFBUTJhLE9BQVIsR0FBa0JBLE9BQWxCO0FBQ0EzYSxZQUFRbWIscUJBQVIsR0FBZ0NBLHFCQUFoQztBQUNBLFdBQU9uYixPQUFQO0FBOUREO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7OztBRUFBNU0sTUFBTSxDQUFDa1ksT0FBUCxDQUFlO0FBQ1hxUSxhQUFXLEVBQUUsVUFBUzVpQixHQUFULEVBQWNDLEtBQWQsRUFBcUI7QUFDOUJnSyxTQUFLLENBQUNqSyxHQUFELEVBQU15aUIsTUFBTixDQUFMO0FBQ0F4WSxTQUFLLENBQUNoSyxLQUFELEVBQVE5RSxNQUFSLENBQUw7QUFFQWdTLE9BQUcsR0FBRyxFQUFOO0FBQ0FBLE9BQUcsQ0FBQ3JOLElBQUosR0FBVyxLQUFLQyxNQUFoQjtBQUNBb04sT0FBRyxDQUFDbk4sR0FBSixHQUFVQSxHQUFWO0FBQ0FtTixPQUFHLENBQUNsTixLQUFKLEdBQVlBLEtBQVo7QUFFQSxRQUFJaU0sQ0FBQyxHQUFHcE8sRUFBRSxDQUFDOEIsaUJBQUgsQ0FBcUJtSixJQUFyQixDQUEwQjtBQUM5QmpKLFVBQUksRUFBRSxLQUFLQyxNQURtQjtBQUU5QkMsU0FBRyxFQUFFQTtBQUZ5QixLQUExQixFQUdMOFMsS0FISyxFQUFSOztBQUlBLFFBQUk1RyxDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1BwTyxRQUFFLENBQUM4QixpQkFBSCxDQUFxQjhNLE1BQXJCLENBQTRCO0FBQ3hCNU0sWUFBSSxFQUFFLEtBQUtDLE1BRGE7QUFFeEJDLFdBQUcsRUFBRUE7QUFGbUIsT0FBNUIsRUFHRztBQUNDeVMsWUFBSSxFQUFFO0FBQ0Z4UyxlQUFLLEVBQUVBO0FBREw7QUFEUCxPQUhIO0FBUUgsS0FURCxNQVNPO0FBQ0huQyxRQUFFLENBQUM4QixpQkFBSCxDQUFxQm9hLE1BQXJCLENBQTRCN00sR0FBNUI7QUFDSDs7QUFFRCxXQUFPLElBQVA7QUFDSDtBQTVCVSxDQUFmLEU7Ozs7Ozs7Ozs7OztBQ0FBOVMsT0FBT2tZLE9BQVAsQ0FDQztBQUFBc1Esb0JBQWtCLFVBQUNDLGdCQUFELEVBQW1CNVIsUUFBbkI7QUFDakIsUUFBQTZSLEtBQUEsRUFBQXRDLEdBQUEsRUFBQXBWLE1BQUEsRUFBQW5GLE1BQUEsRUFBQXBHLElBQUE7O0FDQ0UsUUFBSW9SLFlBQVksSUFBaEIsRUFBc0I7QURGWUEsaUJBQVMsRUFBVDtBQ0lqQzs7QURISGpILFVBQU02WSxnQkFBTixFQUF3QkwsTUFBeEI7QUFDQXhZLFVBQU1pSCxRQUFOLEVBQWdCdVIsTUFBaEI7QUFFQTNpQixXQUFPaEMsR0FBRzBOLEtBQUgsQ0FBUzNMLE9BQVQsQ0FBaUI7QUFBQ3dGLFdBQUssS0FBS3RGO0FBQVgsS0FBakIsRUFBcUM7QUFBQzZJLGNBQVE7QUFBQ3FOLHVCQUFlO0FBQWhCO0FBQVQsS0FBckMsQ0FBUDs7QUFFQSxRQUFHLENBQUluVyxLQUFLbVcsYUFBWjtBQUNDO0FDU0U7O0FEUEh6USxZQUFRd2QsSUFBUixDQUFhLFNBQWI7QUFDQTljLGFBQVMsRUFBVDs7QUFDQSxRQUFHZ0wsUUFBSDtBQUNDaEwsZUFBU3BJLEdBQUdvSSxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQzFELGFBQUs2TCxRQUFOO0FBQWdCL0ssaUJBQVM7QUFBekIsT0FBZixFQUErQztBQUFDeUMsZ0JBQVE7QUFBQ3ZELGVBQUs7QUFBTjtBQUFULE9BQS9DLENBQVQ7QUFERDtBQUdDYSxlQUFTcEksR0FBR29JLE1BQUgsQ0FBVTZDLElBQVYsQ0FBZTtBQUFDNUMsaUJBQVM7QUFBVixPQUFmLEVBQWdDO0FBQUN5QyxnQkFBUTtBQUFDdkQsZUFBSztBQUFOO0FBQVQsT0FBaEMsQ0FBVDtBQ3NCRTs7QURyQkhnRyxhQUFTLEVBQVQ7QUFDQW5GLFdBQU8zSixPQUFQLENBQWUsVUFBQzBtQixDQUFEO0FBQ2QsVUFBQXBlLENBQUEsRUFBQTRiLEdBQUE7O0FBQUE7QUN3QkssZUR2QkpZLGVBQWU2Qiw0QkFBZixDQUE0Q0osZ0JBQTVDLEVBQThERyxFQUFFNWQsR0FBaEUsQ0N1Qkk7QUR4QkwsZUFBQXhCLEtBQUE7QUFFTTRjLGNBQUE1YyxLQUFBO0FBQ0xnQixZQUFJLEVBQUo7QUFDQUEsVUFBRVEsR0FBRixHQUFRNGQsRUFBRTVkLEdBQVY7QUFDQVIsVUFBRTFJLElBQUYsR0FBUzhtQixFQUFFOW1CLElBQVg7QUFDQTBJLFVBQUU0YixHQUFGLEdBQVFBLEdBQVI7QUN5QkksZUR4QkpwVixPQUFPM08sSUFBUCxDQUFZbUksQ0FBWixDQ3dCSTtBQUNEO0FEakNMOztBQVNBLFFBQUd3RyxPQUFPck8sTUFBUCxHQUFnQixDQUFuQjtBQUNDd0ksY0FBUTNCLEtBQVIsQ0FBY3dILE1BQWQ7O0FBQ0E7QUFDQzBYLGdCQUFRSSxRQUFRdFEsS0FBUixDQUFja1EsS0FBdEI7QUFDQUEsY0FBTUssSUFBTixDQUNDO0FBQUF2bUIsY0FBSSxxQkFBSjtBQUNBRCxnQkFBTTZGLFNBQVN3UixjQUFULENBQXdCclgsSUFEOUI7QUFFQXdYLG1CQUFTLHlCQUZUO0FBR0E5VSxnQkFBTXJFLEtBQUtvb0IsU0FBTCxDQUFlO0FBQUEsc0JBQVVoWTtBQUFWLFdBQWY7QUFITixTQUREO0FBRkQsZUFBQXhILEtBQUE7QUFPTTRjLGNBQUE1YyxLQUFBO0FBQ0wyQixnQkFBUTNCLEtBQVIsQ0FBYzRjLEdBQWQ7QUFWRjtBQzBDRzs7QUFDRCxXRGhDRmpiLFFBQVE4ZCxPQUFSLENBQWdCLFNBQWhCLENDZ0NFO0FEcEVIO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQWpwQixPQUFPa1ksT0FBUCxDQUNDO0FBQUFnUixlQUFhLFVBQUNyUyxRQUFELEVBQVc1RixRQUFYLEVBQXFCZ1AsT0FBckI7QUFDWixRQUFBa0osU0FBQTtBQUFBdlosVUFBTWlILFFBQU4sRUFBZ0J1UixNQUFoQjtBQUNBeFksVUFBTXFCLFFBQU4sRUFBZ0JtWCxNQUFoQjs7QUFFQSxRQUFHLENBQUM3bUIsUUFBUXFLLFlBQVIsQ0FBcUJpTCxRQUFyQixFQUErQjdXLE9BQU8wRixNQUFQLEVBQS9CLENBQUQsSUFBcUR1YSxPQUF4RDtBQUNDLFlBQU0sSUFBSWpnQixPQUFPc1IsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyQkFBdEIsQ0FBTjtBQ0NFOztBRENILFFBQUcsQ0FBSXRSLE9BQU8wRixNQUFQLEVBQVA7QUFDQyxZQUFNLElBQUkxRixPQUFPc1IsS0FBWCxDQUFpQixHQUFqQixFQUFxQixvQkFBckIsQ0FBTjtBQ0NFOztBRENILFNBQU8yTyxPQUFQO0FBQ0NBLGdCQUFVamdCLE9BQU95RixJQUFQLEdBQWN1RixHQUF4QjtBQ0NFOztBRENIbWUsZ0JBQVkxbEIsR0FBRzZLLFdBQUgsQ0FBZTlJLE9BQWYsQ0FBdUI7QUFBQ0MsWUFBTXdhLE9BQVA7QUFBZ0J0VSxhQUFPa0w7QUFBdkIsS0FBdkIsQ0FBWjs7QUFFQSxRQUFHc1MsVUFBVUMsWUFBVixLQUEwQixTQUExQixJQUF1Q0QsVUFBVUMsWUFBVixLQUEwQixTQUFwRTtBQUNDLFlBQU0sSUFBSXBwQixPQUFPc1IsS0FBWCxDQUFpQixHQUFqQixFQUFzQix1QkFBdEIsQ0FBTjtBQ0dFOztBRERIN04sT0FBRzBOLEtBQUgsQ0FBU2tCLE1BQVQsQ0FBZ0I7QUFBQ3JILFdBQUtpVjtBQUFOLEtBQWhCLEVBQWdDO0FBQUM3SCxZQUFNO0FBQUNuSCxrQkFBVUE7QUFBWDtBQUFQLEtBQWhDO0FBRUEsV0FBT0EsUUFBUDtBQXBCRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFqUixPQUFPa1ksT0FBUCxDQUNDO0FBQUFtUixvQkFBa0IsVUFBQ3RDLFNBQUQsRUFBWWxRLFFBQVosRUFBc0J5UyxNQUF0QixFQUE4QkMsWUFBOUIsRUFBNEM5ZCxRQUE1QyxFQUFzRHliLFVBQXREO0FBQ2pCLFFBQUFiLEtBQUEsRUFBQUMsTUFBQSxFQUFBa0QsVUFBQSxFQUFBQyxjQUFBLEVBQUFDLFVBQUEsRUFBQUMsVUFBQSxFQUFBaGUsS0FBQSxFQUFBaWUsZ0JBQUEsRUFBQTNKLE9BQUEsRUFBQXlHLEtBQUE7QUFBQTlXLFVBQU1tWCxTQUFOLEVBQWlCdlMsTUFBakI7QUFDQTVFLFVBQU1pSCxRQUFOLEVBQWdCdVIsTUFBaEI7QUFDQXhZLFVBQU0wWixNQUFOLEVBQWNsQixNQUFkO0FBQ0F4WSxVQUFNMlosWUFBTixFQUFvQnBvQixLQUFwQjtBQUNBeU8sVUFBTW5FLFFBQU4sRUFBZ0IyYyxNQUFoQjtBQUNBeFksVUFBTXNYLFVBQU4sRUFBa0IxUyxNQUFsQjtBQUVBeUwsY0FBVSxLQUFLdmEsTUFBZjtBQUVBOGpCLGlCQUFhLENBQWI7QUFDQUUsaUJBQWEsRUFBYjtBQUNBam1CLE9BQUdvTSxPQUFILENBQVduQixJQUFYLENBQWdCO0FBQUM1TSxZQUFNO0FBQUM2TSxhQUFLNGE7QUFBTjtBQUFQLEtBQWhCLEVBQTZDcm5CLE9BQTdDLENBQXFELFVBQUNFLENBQUQ7QUFDcERvbkIsb0JBQWNwbkIsRUFBRXluQixhQUFoQjtBQ0lHLGFESEhILFdBQVdybkIsSUFBWCxDQUFnQkQsRUFBRTBuQixPQUFsQixDQ0dHO0FETEo7QUFJQW5lLFlBQVFsSSxHQUFHb0ksTUFBSCxDQUFVckcsT0FBVixDQUFrQnFSLFFBQWxCLENBQVI7O0FBQ0EsUUFBRyxDQUFJbEwsTUFBTUcsT0FBYjtBQUNDOGQseUJBQW1Cbm1CLEdBQUc2SyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQy9DLGVBQU1rTDtBQUFQLE9BQXBCLEVBQXNDNEIsS0FBdEMsRUFBbkI7QUFDQWdSLHVCQUFpQkcsbUJBQW1CSixVQUFwQzs7QUFDQSxVQUFHekMsWUFBWTBDLGlCQUFlLEdBQTlCO0FBQ0MsY0FBTSxJQUFJenBCLE9BQU9zUixLQUFYLENBQWlCLFFBQWpCLEVBQTJCLHNCQUFvQm1ZLGNBQS9DLENBQU47QUFKRjtBQ1dHOztBRExIRSxpQkFBYSxFQUFiO0FBRUFyRCxhQUFTLEVBQVQ7QUFDQUEsV0FBT0UsV0FBUCxHQUFxQjhDLE1BQXJCO0FBQ0FqRCxZQUFROWMsUUFBUSxZQUFSLENBQVI7QUFFQW1kLFlBQVFMLE1BQU07QUFDYk0sYUFBTzNtQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QnltQixLQURsQjtBQUViQyxjQUFRNW1CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCMG1CLE1BRm5CO0FBR2JDLG1CQUFhN21CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCMm1CO0FBSHhCLEtBQU4sQ0FBUjtBQU1BSCxVQUFNcUQsa0JBQU4sQ0FBeUI7QUFDeEI3YSxZQUFNd2EsV0FBV00sSUFBWCxDQUFnQixHQUFoQixDQURrQjtBQUV4QkMsb0JBQWNDLFNBQVNDLE1BQVQsQ0FBZ0IsbUJBQWhCLENBRlU7QUFHeEJwRCxpQkFBV0EsU0FIYTtBQUl4QnFELHdCQUFrQixXQUpNO0FBS3hCQyxrQkFBWXJxQixPQUFPMkcsV0FBUCxLQUF1Qiw2QkFMWDtBQU14QjJqQixrQkFBWSxRQU5ZO0FBT3hCQyxrQkFBWUwsU0FBU0MsTUFBVCxDQUFnQixtQkFBaEIsQ0FQWTtBQVF4QjdELGNBQVExbEIsS0FBS29vQixTQUFMLENBQWUxQyxNQUFmO0FBUmdCLEtBQXpCLEVBU0d0bUIsT0FBTzZsQixlQUFQLENBQXdCLFVBQUNPLEdBQUQsRUFBTXBWLE1BQU47QUFDekIsVUFBQThCLEdBQUE7O0FBQUEsVUFBR3NULEdBQUg7QUFDQ2piLGdCQUFRM0IsS0FBUixDQUFjNGMsSUFBSS9hLEtBQWxCO0FDS0U7O0FESkgsVUFBRzJGLE1BQUg7QUFDQzhCLGNBQU0sRUFBTjtBQUNBQSxZQUFJOUgsR0FBSixHQUFVc2UsTUFBVjtBQUNBeFcsWUFBSW9FLE9BQUosR0FBYyxJQUFJbkwsSUFBSixFQUFkO0FBQ0ErRyxZQUFJMFgsSUFBSixHQUFXeFosTUFBWDtBQUNBOEIsWUFBSWlVLFNBQUosR0FBZ0JBLFNBQWhCO0FBQ0FqVSxZQUFJcUUsVUFBSixHQUFpQjhJLE9BQWpCO0FBQ0FuTixZQUFJbkgsS0FBSixHQUFZa0wsUUFBWjtBQUNBL0QsWUFBSTBKLElBQUosR0FBVyxLQUFYO0FBQ0ExSixZQUFJakQsT0FBSixHQUFjMFosWUFBZDtBQUNBelcsWUFBSXJILFFBQUosR0FBZUEsUUFBZjtBQUNBcUgsWUFBSW9VLFVBQUosR0FBaUJBLFVBQWpCO0FDTUcsZURMSHpqQixHQUFHd1ksbUJBQUgsQ0FBdUIwRCxNQUF2QixDQUE4QjdNLEdBQTlCLENDS0c7QUFDRDtBRHJCcUIsS0FBdkIsRUFnQkM7QUNPQSxhRE5GM0gsUUFBUTZULEdBQVIsQ0FBWSw0QkFBWixDQ01FO0FEdkJELE1BVEg7QUErQkEsV0FBTyxTQUFQO0FBbEVEO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUVBQWhmLE9BQU9rWSxPQUFQLENBQ0M7QUFBQXVTLHdCQUFzQixVQUFDNVQsUUFBRDtBQUNyQixRQUFBNlQsZUFBQTtBQUFBOWEsVUFBTWlILFFBQU4sRUFBZ0J1UixNQUFoQjtBQUNBc0Msc0JBQWtCLElBQUk1cEIsTUFBSixFQUFsQjtBQUNBNHBCLG9CQUFnQkMsZ0JBQWhCLEdBQW1DbG5CLEdBQUc2SyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQy9DLGFBQU9rTDtBQUFSLEtBQXBCLEVBQXVDNEIsS0FBdkMsRUFBbkM7QUFDQWlTLG9CQUFnQkUsbUJBQWhCLEdBQXNDbm5CLEdBQUc2SyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQy9DLGFBQU9rTCxRQUFSO0FBQWtCdU0scUJBQWU7QUFBakMsS0FBcEIsRUFBNEQzSyxLQUE1RCxFQUF0QztBQUNBLFdBQU9pUyxlQUFQO0FBTEQ7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBQ0FBMXFCLE9BQU9rWSxPQUFQLENBQ0M7QUFBQTJTLGlCQUFlLFVBQUMvb0IsSUFBRDtBQUNkLFFBQUcsQ0FBQyxLQUFLNEQsTUFBVDtBQUNDLGFBQU8sS0FBUDtBQ0NFOztBQUNELFdEQUZqQyxHQUFHME4sS0FBSCxDQUFTMFosYUFBVCxDQUF1QixLQUFLbmxCLE1BQTVCLEVBQW9DNUQsSUFBcEMsQ0NBRTtBREpIO0FBTUFncEIsaUJBQWUsVUFBQ0MsS0FBRDtBQUNkLFFBQUF0WixXQUFBOztBQUFBLFFBQUcsQ0FBQyxLQUFLL0wsTUFBTixJQUFnQixDQUFDcWxCLEtBQXBCO0FBQ0MsYUFBTyxLQUFQO0FDRUU7O0FEQUh0WixrQkFBY3JKLFNBQVNzSixlQUFULENBQXlCcVosS0FBekIsQ0FBZDtBQUVBNWYsWUFBUTZULEdBQVIsQ0FBWSxPQUFaLEVBQXFCK0wsS0FBckI7QUNDRSxXRENGdG5CLEdBQUcwTixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUNySCxXQUFLLEtBQUt0RjtBQUFYLEtBQWhCLEVBQW9DO0FBQUN3VCxhQUFPO0FBQUMsbUJBQVc7QUFBQ3pILHVCQUFhQTtBQUFkO0FBQVo7QUFBUixLQUFwQyxDQ0RFO0FEYkg7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBelIsT0FBT2tZLE9BQVAsQ0FDSTtBQUFBLDBCQUF3QixVQUFDMU0sT0FBRCxFQUFVOUYsTUFBVjtBQUNwQixRQUFBc2xCLFlBQUEsRUFBQTdjLGFBQUEsRUFBQThjLEdBQUE7QUFBQXJiLFVBQU1wRSxPQUFOLEVBQWU0YyxNQUFmO0FBQ0F4WSxVQUFNbEssTUFBTixFQUFjMGlCLE1BQWQ7QUFFQTRDLG1CQUFlclUsUUFBUUksV0FBUixDQUFvQixhQUFwQixFQUFtQ3ZSLE9BQW5DLENBQTJDO0FBQUNtRyxhQUFPSCxPQUFSO0FBQWlCL0YsWUFBTUM7QUFBdkIsS0FBM0MsRUFBMkU7QUFBQzZJLGNBQVE7QUFBQ0osdUJBQWU7QUFBaEI7QUFBVCxLQUEzRSxDQUFmOztBQUNBLFFBQUcsQ0FBQzZjLFlBQUo7QUFDSSxZQUFNLElBQUlockIsT0FBT3NSLEtBQVgsQ0FBaUIsZ0JBQWpCLENBQU47QUNRUDs7QUROR25ELG9CQUFnQndJLFFBQVFpSCxhQUFSLENBQXNCLGVBQXRCLEVBQXVDbFAsSUFBdkMsQ0FBNEM7QUFDeEQxRCxXQUFLO0FBQ0QyRCxhQUFLcWMsYUFBYTdjO0FBRGpCO0FBRG1ELEtBQTVDLEVBSWI7QUFBQ0ksY0FBUTtBQUFDSCxpQkFBUztBQUFWO0FBQVQsS0FKYSxFQUlXUSxLQUpYLEVBQWhCO0FBTUFxYyxVQUFNdFUsUUFBUWlILGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDbFAsSUFBMUMsQ0FBK0M7QUFBRS9DLGFBQU9IO0FBQVQsS0FBL0MsRUFBbUU7QUFBRStDLGNBQVE7QUFBRXNQLHFCQUFhLENBQWY7QUFBa0JxTixpQkFBUyxDQUEzQjtBQUE4QnZmLGVBQU87QUFBckM7QUFBVixLQUFuRSxFQUF5SGlELEtBQXpILEVBQU47O0FBQ0FKLE1BQUVyQyxJQUFGLENBQU84ZSxHQUFQLEVBQVcsVUFBQzdNLENBQUQ7QUFDUCxVQUFBK00sRUFBQSxFQUFBQyxLQUFBO0FBQUFELFdBQUt4VSxRQUFRaUgsYUFBUixDQUFzQixPQUF0QixFQUErQnBZLE9BQS9CLENBQXVDNFksRUFBRThNLE9BQXpDLEVBQWtEO0FBQUUzYyxnQkFBUTtBQUFFek0sZ0JBQU0sQ0FBUjtBQUFXc3BCLGlCQUFPO0FBQWxCO0FBQVYsT0FBbEQsQ0FBTDtBQUNBaE4sUUFBRWlOLFNBQUYsR0FBY0YsR0FBR3JwQixJQUFqQjtBQUNBc2MsUUFBRWtOLE9BQUYsR0FBWSxLQUFaO0FBRUFGLGNBQVFELEdBQUdDLEtBQVg7O0FBQ0EsVUFBR0EsS0FBSDtBQUNJLFlBQUdBLE1BQU1HLGFBQU4sSUFBdUJILE1BQU1HLGFBQU4sQ0FBb0Jyb0IsUUFBcEIsQ0FBNkJ3QyxNQUE3QixDQUExQjtBQ3dCTixpQkR2QlUwWSxFQUFFa04sT0FBRixHQUFZLElDdUJ0QjtBRHhCTSxlQUVLLElBQUdGLE1BQU1JLFlBQU4sSUFBc0JKLE1BQU1JLFlBQU4sQ0FBbUI3b0IsTUFBbkIsR0FBNEIsQ0FBckQ7QUFDRCxjQUFHcW9CLGdCQUFnQkEsYUFBYTdjLGFBQTdCLElBQThDSyxFQUFFOFosWUFBRixDQUFlMEMsYUFBYTdjLGFBQTVCLEVBQTJDaWQsTUFBTUksWUFBakQsRUFBK0Q3b0IsTUFBL0QsR0FBd0UsQ0FBekg7QUN3QlIsbUJEdkJZeWIsRUFBRWtOLE9BQUYsR0FBWSxJQ3VCeEI7QUR4QlE7QUFHSSxnQkFBR25kLGFBQUg7QUN3QlYscUJEdkJjaVEsRUFBRWtOLE9BQUYsR0FBWTljLEVBQUVpZCxJQUFGLENBQU90ZCxhQUFQLEVBQXNCLFVBQUNpQyxHQUFEO0FBQzlCLHVCQUFPQSxJQUFJaEMsT0FBSixJQUFlSSxFQUFFOFosWUFBRixDQUFlbFksSUFBSWhDLE9BQW5CLEVBQTRCZ2QsTUFBTUksWUFBbEMsRUFBZ0Q3b0IsTUFBaEQsR0FBeUQsQ0FBL0U7QUFEUSxnQkN1QjFCO0FEM0JNO0FBREM7QUFIVDtBQ3FDTDtBRDNDQzs7QUFpQkEsV0FBT3NvQixHQUFQO0FBaENKO0FBQUEsQ0FESixFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUVBQWpFLGlCQUFpQixFQUFqQjs7QUFLQUEsZUFBZTBFLHFCQUFmLEdBQXVDLFVBQUM3VSxRQUFELEVBQVc0UixnQkFBWDtBQUN0QyxNQUFBdm9CLE9BQUEsRUFBQXlyQixVQUFBLEVBQUFsZ0IsUUFBQSxFQUFBbWdCLGFBQUEsRUFBQS9XLFVBQUEsRUFBQUksVUFBQSxFQUFBNFcsZUFBQTtBQUFBRixlQUFhLENBQWI7QUFFQUMsa0JBQWdCLElBQUk3ZixJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFoQjtBQUNBK0ksYUFBV3llLE9BQU8wQixjQUFjblgsT0FBZCxFQUFQLEVBQWdDMFYsTUFBaEMsQ0FBdUMsVUFBdkMsQ0FBWDtBQUVBanFCLFlBQVV1RCxHQUFHcW9CLFFBQUgsQ0FBWXRtQixPQUFaLENBQW9CO0FBQUNtRyxXQUFPa0wsUUFBUjtBQUFrQmtWLGlCQUFhO0FBQS9CLEdBQXBCLENBQVY7QUFDQWxYLGVBQWEzVSxRQUFROHJCLFlBQXJCO0FBRUEvVyxlQUFhd1QsbUJBQW1CLElBQWhDO0FBQ0FvRCxvQkFBa0IsSUFBSTlmLElBQUosQ0FBU2dLLFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEcVQsU0FBUzBTLGlCQUFpQi9sQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLElBQUVrcEIsY0FBY0ssT0FBZCxFQUF6RixDQUFsQjs7QUFFQSxNQUFHcFgsY0FBY3BKLFFBQWpCLFVBRUssSUFBR3dKLGNBQWNKLFVBQWQsSUFBNkJBLGFBQWFwSixRQUE3QztBQUNKa2dCLGlCQUFhLENBQUNDLGdCQUFnQkMsZUFBakIsS0FBbUMsS0FBRyxFQUFILEdBQU0sRUFBTixHQUFTLElBQTVDLElBQW9ELENBQWpFO0FBREksU0FFQSxJQUFHaFgsYUFBYUksVUFBaEI7QUFDSjBXLGlCQUFhLENBQUNDLGdCQUFnQkMsZUFBakIsS0FBbUMsS0FBRyxFQUFILEdBQU0sRUFBTixHQUFTLElBQTVDLElBQW9ELENBQWpFO0FDQUM7O0FERUYsU0FBTztBQUFDLGtCQUFjRjtBQUFmLEdBQVA7QUFuQnNDLENBQXZDOztBQXNCQTNFLGVBQWVrRixlQUFmLEdBQWlDLFVBQUNyVixRQUFELEVBQVdzVixZQUFYO0FBQ2hDLE1BQUFDLFFBQUEsRUFBQUMsR0FBQSxFQUFBQyxLQUFBLEVBQUFDLElBQUEsRUFBQUMsT0FBQSxFQUFBQyxNQUFBLEVBQUFDLFlBQUEsRUFBQUMsU0FBQSxFQUFBQyxZQUFBLEVBQUFDLE1BQUE7QUFBQUYsY0FBWSxJQUFaO0FBQ0FKLFNBQU85b0IsR0FBR3FvQixRQUFILENBQVl0bUIsT0FBWixDQUFvQjtBQUFDbUcsV0FBT2tMLFFBQVI7QUFBa0JLLGFBQVNpVjtBQUEzQixHQUFwQixDQUFQO0FBR0FTLGlCQUFlbnBCLEdBQUdxb0IsUUFBSCxDQUFZdG1CLE9BQVosQ0FDZDtBQUNDbUcsV0FBT2tMLFFBRFI7QUFFQ0ssYUFBUztBQUNSNFYsV0FBS1g7QUFERyxLQUZWO0FBS0NZLG1CQUFlUixLQUFLUTtBQUxyQixHQURjLEVBUWQ7QUFDQ3ZyQixVQUFNO0FBQ0w0VixnQkFBVSxDQUFDO0FBRE47QUFEUCxHQVJjLENBQWY7O0FBY0EsTUFBR3dWLFlBQUg7QUFDQ0QsZ0JBQVlDLFlBQVo7QUFERDtBQUlDTixZQUFRLElBQUl2Z0IsSUFBSixDQUFTZ0ssU0FBU3dXLEtBQUtRLGFBQUwsQ0FBbUJycUIsS0FBbkIsQ0FBeUIsQ0FBekIsRUFBMkIsQ0FBM0IsQ0FBVCxDQUFULEVBQWtEcVQsU0FBU3dXLEtBQUtRLGFBQUwsQ0FBbUJycUIsS0FBbkIsQ0FBeUIsQ0FBekIsRUFBMkIsQ0FBM0IsQ0FBVCxDQUFsRCxFQUEyRixDQUEzRixDQUFSO0FBQ0EycEIsVUFBTW5DLE9BQU9vQyxNQUFNN1gsT0FBTixLQUFpQjZYLE1BQU1MLE9BQU4sS0FBZ0IsRUFBaEIsR0FBbUIsRUFBbkIsR0FBc0IsRUFBdEIsR0FBeUIsSUFBakQsRUFBd0Q5QixNQUF4RCxDQUErRCxRQUEvRCxDQUFOO0FBRUFpQyxlQUFXM29CLEdBQUdxb0IsUUFBSCxDQUFZdG1CLE9BQVosQ0FDVjtBQUNDbUcsYUFBT2tMLFFBRFI7QUFFQ2tXLHFCQUFlVjtBQUZoQixLQURVLEVBS1Y7QUFDQzdxQixZQUFNO0FBQ0w0VixrQkFBVSxDQUFDO0FBRE47QUFEUCxLQUxVLENBQVg7O0FBV0EsUUFBR2dWLFFBQUg7QUFDQ08sa0JBQVlQLFFBQVo7QUFuQkY7QUNnQkU7O0FES0ZNLGlCQUFrQkMsYUFBY0EsVUFBVUssT0FBeEIsR0FBcUNMLFVBQVVLLE9BQS9DLEdBQTRELEdBQTlFO0FBRUFQLFdBQVlGLEtBQUtFLE1BQUwsR0FBaUJGLEtBQUtFLE1BQXRCLEdBQWtDLEdBQTlDO0FBQ0FELFlBQWFELEtBQUtDLE9BQUwsR0FBa0JELEtBQUtDLE9BQXZCLEdBQW9DLEdBQWpEO0FBQ0FLLFdBQVMsSUFBSS9yQixNQUFKLEVBQVQ7QUFDQStyQixTQUFPRyxPQUFQLEdBQWlCeFksT0FBTyxDQUFDa1ksZUFBZUYsT0FBZixHQUF5QkMsTUFBMUIsRUFBa0NRLE9BQWxDLENBQTBDLENBQTFDLENBQVAsQ0FBakI7QUFDQUosU0FBT3pWLFFBQVAsR0FBa0IsSUFBSXJMLElBQUosRUFBbEI7QUNKQyxTREtEdEksR0FBR3FvQixRQUFILENBQVluVCxNQUFaLENBQW1CdEcsTUFBbkIsQ0FBMEI7QUFBQ3JILFNBQUt1aEIsS0FBS3ZoQjtBQUFYLEdBQTFCLEVBQTJDO0FBQUNvTixVQUFNeVU7QUFBUCxHQUEzQyxDQ0xDO0FEMUMrQixDQUFqQzs7QUFrREE3RixlQUFla0csV0FBZixHQUE2QixVQUFDclcsUUFBRCxFQUFXNFIsZ0JBQVgsRUFBNkJ2QixVQUE3QixFQUF5Q3lFLFVBQXpDLEVBQXFEd0IsV0FBckQsRUFBa0VDLFNBQWxFO0FBQzVCLE1BQUFDLGVBQUEsRUFBQUMsc0JBQUEsRUFBQUMsV0FBQSxFQUFBZCxNQUFBLEVBQUFDLFlBQUEsRUFBQUMsU0FBQSxFQUFBYSxRQUFBLEVBQUE1WCxHQUFBO0FBQUF5WCxvQkFBa0IsSUFBSXRoQixJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFsQjtBQUNBNnFCLGdCQUFjRixnQkFBZ0JwQixPQUFoQixFQUFkO0FBQ0FxQiwyQkFBeUJwRCxPQUFPbUQsZUFBUCxFQUF3QmxELE1BQXhCLENBQStCLFVBQS9CLENBQXpCO0FBRUFzQyxXQUFTalksT0FBTyxDQUFFbVgsYUFBVzRCLFdBQVosR0FBMkJyRyxVQUEzQixHQUF3Q2tHLFNBQXpDLEVBQW9ESCxPQUFwRCxDQUE0RCxDQUE1RCxDQUFQLENBQVQ7QUFDQU4sY0FBWWxwQixHQUFHcW9CLFFBQUgsQ0FBWXRtQixPQUFaLENBQ1g7QUFDQ21HLFdBQU9rTCxRQURSO0FBRUNtVixrQkFBYztBQUNieUIsWUFBTUg7QUFETztBQUZmLEdBRFcsRUFPWDtBQUNDOXJCLFVBQU07QUFDTDRWLGdCQUFVLENBQUM7QUFETjtBQURQLEdBUFcsQ0FBWjtBQWFBc1YsaUJBQWtCQyxhQUFjQSxVQUFVSyxPQUF4QixHQUFxQ0wsVUFBVUssT0FBL0MsR0FBNEQsR0FBOUU7QUFFQXBYLFFBQU0sSUFBSTdKLElBQUosRUFBTjtBQUNBeWhCLGFBQVcsSUFBSTFzQixNQUFKLEVBQVg7QUFDQTBzQixXQUFTeGlCLEdBQVQsR0FBZXZILEdBQUdxb0IsUUFBSCxDQUFZNEIsVUFBWixFQUFmO0FBQ0FGLFdBQVNULGFBQVQsR0FBeUJ0RSxnQkFBekI7QUFDQStFLFdBQVN4QixZQUFULEdBQXdCc0Isc0JBQXhCO0FBQ0FFLFdBQVM3aEIsS0FBVCxHQUFpQmtMLFFBQWpCO0FBQ0EyVyxXQUFTekIsV0FBVCxHQUF1Qm9CLFdBQXZCO0FBQ0FLLFdBQVNKLFNBQVQsR0FBcUJBLFNBQXJCO0FBQ0FJLFdBQVN0RyxVQUFULEdBQXNCQSxVQUF0QjtBQUNBc0csV0FBU2YsTUFBVCxHQUFrQkEsTUFBbEI7QUFDQWUsV0FBU1IsT0FBVCxHQUFtQnhZLE9BQU8sQ0FBQ2tZLGVBQWVELE1BQWhCLEVBQXdCUSxPQUF4QixDQUFnQyxDQUFoQyxDQUFQLENBQW5CO0FBQ0FPLFdBQVN0VyxPQUFULEdBQW1CdEIsR0FBbkI7QUFDQTRYLFdBQVNwVyxRQUFULEdBQW9CeEIsR0FBcEI7QUNKQyxTREtEblMsR0FBR3FvQixRQUFILENBQVluVCxNQUFaLENBQW1CZ0gsTUFBbkIsQ0FBMEI2TixRQUExQixDQ0xDO0FEN0IyQixDQUE3Qjs7QUFvQ0F4RyxlQUFlMkcsaUJBQWYsR0FBbUMsVUFBQzlXLFFBQUQ7QUNIakMsU0RJRHBULEdBQUc2SyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQy9DLFdBQU9rTCxRQUFSO0FBQWtCdU0sbUJBQWU7QUFBakMsR0FBcEIsRUFBNEQzSyxLQUE1RCxFQ0pDO0FER2lDLENBQW5DOztBQUdBdU8sZUFBZTRHLGlCQUFmLEdBQW1DLFVBQUNuRixnQkFBRCxFQUFtQjVSLFFBQW5CO0FBQ2xDLE1BQUFnWCxhQUFBO0FBQUFBLGtCQUFnQixJQUFJMXNCLEtBQUosRUFBaEI7QUFDQXNDLEtBQUdxb0IsUUFBSCxDQUFZcGQsSUFBWixDQUNDO0FBQ0NxZSxtQkFBZXRFLGdCQURoQjtBQUVDOWMsV0FBT2tMLFFBRlI7QUFHQ2tWLGlCQUFhO0FBQUNwZCxXQUFLLENBQUMsU0FBRCxFQUFZLG9CQUFaO0FBQU47QUFIZCxHQURELEVBTUM7QUFDQ25OLFVBQU07QUFBQzBWLGVBQVM7QUFBVjtBQURQLEdBTkQsRUFTRWhWLE9BVEYsQ0FTVSxVQUFDcXFCLElBQUQ7QUNHUCxXREZGc0IsY0FBY3hyQixJQUFkLENBQW1Ca3FCLEtBQUtyVixPQUF4QixDQ0VFO0FEWkg7O0FBWUEsTUFBRzJXLGNBQWNsckIsTUFBZCxHQUF1QixDQUExQjtBQ0dHLFdERkY2TCxFQUFFckMsSUFBRixDQUFPMGhCLGFBQVAsRUFBc0IsVUFBQ0MsR0FBRDtBQ0dsQixhREZIOUcsZUFBZWtGLGVBQWYsQ0FBK0JyVixRQUEvQixFQUF5Q2lYLEdBQXpDLENDRUc7QURISixNQ0VFO0FBR0Q7QURwQmdDLENBQW5DOztBQWtCQTlHLGVBQWUrRyxXQUFmLEdBQTZCLFVBQUNsWCxRQUFELEVBQVc0UixnQkFBWDtBQUM1QixNQUFBaGQsUUFBQSxFQUFBbWdCLGFBQUEsRUFBQS9iLE9BQUEsRUFBQW9GLFVBQUE7QUFBQXBGLFlBQVUsSUFBSTFPLEtBQUosRUFBVjtBQUNBOFQsZUFBYXdULG1CQUFtQixJQUFoQztBQUNBbUQsa0JBQWdCLElBQUk3ZixJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFoQjtBQUNBK0ksYUFBV3llLE9BQU8wQixjQUFjblgsT0FBZCxFQUFQLEVBQWdDMFYsTUFBaEMsQ0FBdUMsVUFBdkMsQ0FBWDtBQUVBMW1CLEtBQUdvTSxPQUFILENBQVduQixJQUFYLEdBQWtCeE0sT0FBbEIsQ0FBMEIsVUFBQ0UsQ0FBRDtBQUN6QixRQUFBNHJCLFdBQUE7QUFBQUEsa0JBQWN2cUIsR0FBR3dxQixrQkFBSCxDQUFzQnpvQixPQUF0QixDQUNiO0FBQ0NtRyxhQUFPa0wsUUFEUjtBQUVDbFgsY0FBUXlDLEVBQUVOLElBRlg7QUFHQ29zQixtQkFBYTtBQUNaVCxjQUFNaGlCO0FBRE07QUFIZCxLQURhLEVBUWI7QUFDQ3lMLGVBQVMsQ0FBQztBQURYLEtBUmEsQ0FBZDs7QUFhQSxRQUFHLENBQUk4VyxXQUFQLFVBSUssSUFBR0EsWUFBWUUsV0FBWixHQUEwQmpaLFVBQTFCLElBQXlDK1ksWUFBWUcsU0FBWixLQUF5QixTQUFyRTtBQ0NELGFEQUh0ZSxRQUFReE4sSUFBUixDQUFhRCxDQUFiLENDQUc7QUREQyxXQUdBLElBQUc0ckIsWUFBWUUsV0FBWixHQUEwQmpaLFVBQTFCLElBQXlDK1ksWUFBWUcsU0FBWixLQUF5QixXQUFyRSxVQUdBLElBQUdILFlBQVlFLFdBQVosSUFBMkJqWixVQUE5QjtBQ0RELGFERUhwRixRQUFReE4sSUFBUixDQUFhRCxDQUFiLENDRkc7QUFDRDtBRHhCSjtBQTJCQSxTQUFPeU4sT0FBUDtBQWpDNEIsQ0FBN0I7O0FBbUNBbVgsZUFBZW9ILGdCQUFmLEdBQWtDO0FBQ2pDLE1BQUFDLFlBQUE7QUFBQUEsaUJBQWUsSUFBSWx0QixLQUFKLEVBQWY7QUFDQXNDLEtBQUdvTSxPQUFILENBQVduQixJQUFYLEdBQWtCeE0sT0FBbEIsQ0FBMEIsVUFBQ0UsQ0FBRDtBQ0V2QixXRERGaXNCLGFBQWFoc0IsSUFBYixDQUFrQkQsRUFBRU4sSUFBcEIsQ0NDRTtBREZIO0FBR0EsU0FBT3VzQixZQUFQO0FBTGlDLENBQWxDOztBQVFBckgsZUFBZTZCLDRCQUFmLEdBQThDLFVBQUNKLGdCQUFELEVBQW1CNVIsUUFBbkI7QUFDN0MsTUFBQXlYLEdBQUEsRUFBQWpCLGVBQUEsRUFBQUMsc0JBQUEsRUFBQWpCLEdBQUEsRUFBQUMsS0FBQSxFQUFBVSxPQUFBLEVBQUFQLE1BQUEsRUFBQTVjLE9BQUEsRUFBQXdlLFlBQUEsRUFBQUUsV0FBQSxFQUFBQyxhQUFBLEVBQUFDLGdCQUFBLEVBQUF2SCxVQUFBOztBQUFBLE1BQUd1QixtQkFBb0J5QixTQUFTQyxNQUFULENBQWdCLFFBQWhCLENBQXZCO0FBQ0M7QUNHQzs7QURGRixNQUFHMUIscUJBQXFCeUIsU0FBU0MsTUFBVCxDQUFnQixRQUFoQixDQUF4QjtBQUVDbkQsbUJBQWU0RyxpQkFBZixDQUFpQ25GLGdCQUFqQyxFQUFtRDVSLFFBQW5EO0FBRUE0VixhQUFTLENBQVQ7QUFDQTRCLG1CQUFlckgsZUFBZW9ILGdCQUFmLEVBQWY7QUFDQTlCLFlBQVEsSUFBSXZnQixJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFSO0FBQ0EycEIsVUFBTW5DLE9BQU9vQyxNQUFNN1gsT0FBTixLQUFpQjZYLE1BQU1MLE9BQU4sS0FBZ0IsRUFBaEIsR0FBbUIsRUFBbkIsR0FBc0IsRUFBdEIsR0FBeUIsSUFBakQsRUFBd0Q5QixNQUF4RCxDQUErRCxVQUEvRCxDQUFOO0FBQ0ExbUIsT0FBR3FvQixRQUFILENBQVlwZCxJQUFaLENBQ0M7QUFDQ3NkLG9CQUFjSyxHQURmO0FBRUMxZ0IsYUFBT2tMLFFBRlI7QUFHQ2tWLG1CQUFhO0FBQ1pwZCxhQUFLMGY7QUFETztBQUhkLEtBREQsRUFRRW5zQixPQVJGLENBUVUsVUFBQ3dzQixDQUFEO0FDQU4sYURDSGpDLFVBQVVpQyxFQUFFakMsTUNEVDtBRFJKO0FBV0E4QixrQkFBYzlxQixHQUFHcW9CLFFBQUgsQ0FBWXRtQixPQUFaLENBQW9CO0FBQUNtRyxhQUFPa0w7QUFBUixLQUFwQixFQUF1QztBQUFDclYsWUFBTTtBQUFDNFYsa0JBQVUsQ0FBQztBQUFaO0FBQVAsS0FBdkMsQ0FBZDtBQUNBNFYsY0FBVXVCLFlBQVl2QixPQUF0QjtBQUNBeUIsdUJBQW1CLENBQW5COztBQUNBLFFBQUd6QixVQUFVLENBQWI7QUFDQyxVQUFHUCxTQUFTLENBQVo7QUFDQ2dDLDJCQUFtQjFZLFNBQVNpWCxVQUFRUCxNQUFqQixJQUEyQixDQUE5QztBQUREO0FBSUNnQywyQkFBbUIsQ0FBbkI7QUFMRjtBQ1dHOztBQUNELFdETEZockIsR0FBR29JLE1BQUgsQ0FBVThNLE1BQVYsQ0FBaUJ0RyxNQUFqQixDQUNDO0FBQ0NySCxXQUFLNkw7QUFETixLQURELEVBSUM7QUFDQ3VCLFlBQU07QUFDTDRVLGlCQUFTQSxPQURKO0FBRUwsb0NBQTRCeUI7QUFGdkI7QUFEUCxLQUpELENDS0U7QURsQ0g7QUEwQ0NELG9CQUFnQnhILGVBQWUwRSxxQkFBZixDQUFxQzdVLFFBQXJDLEVBQStDNFIsZ0JBQS9DLENBQWhCOztBQUNBLFFBQUcrRixjQUFjLFlBQWQsTUFBK0IsQ0FBbEM7QUFFQ3hILHFCQUFlNEcsaUJBQWYsQ0FBaUNuRixnQkFBakMsRUFBbUQ1UixRQUFuRDtBQUZEO0FBS0NxUSxtQkFBYUYsZUFBZTJHLGlCQUFmLENBQWlDOVcsUUFBakMsQ0FBYjtBQUdBd1gscUJBQWVySCxlQUFlb0gsZ0JBQWYsRUFBZjtBQUNBZix3QkFBa0IsSUFBSXRoQixJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFsQjtBQUNBNHFCLCtCQUF5QnBELE9BQU9tRCxlQUFQLEVBQXdCbEQsTUFBeEIsQ0FBK0IsVUFBL0IsQ0FBekI7QUFDQTFtQixTQUFHcW9CLFFBQUgsQ0FBWXhwQixNQUFaLENBQ0M7QUFDQzBwQixzQkFBY3NCLHNCQURmO0FBRUMzaEIsZUFBT2tMLFFBRlI7QUFHQ2tWLHFCQUFhO0FBQ1pwZCxlQUFLMGY7QUFETztBQUhkLE9BREQ7QUFVQXJILHFCQUFlNEcsaUJBQWYsQ0FBaUNuRixnQkFBakMsRUFBbUQ1UixRQUFuRDtBQUdBaEgsZ0JBQVVtWCxlQUFlK0csV0FBZixDQUEyQmxYLFFBQTNCLEVBQXFDNFIsZ0JBQXJDLENBQVY7O0FBQ0EsVUFBRzVZLFdBQWFBLFFBQVFsTixNQUFSLEdBQWUsQ0FBL0I7QUFDQzZMLFVBQUVyQyxJQUFGLENBQU8wRCxPQUFQLEVBQWdCLFVBQUN6TixDQUFEO0FDUFYsaUJEUUw0a0IsZUFBZWtHLFdBQWYsQ0FBMkJyVyxRQUEzQixFQUFxQzRSLGdCQUFyQyxFQUF1RHZCLFVBQXZELEVBQW1Fc0gsY0FBYyxZQUFkLENBQW5FLEVBQWdHcHNCLEVBQUVOLElBQWxHLEVBQXdHTSxFQUFFZ3JCLFNBQTFHLENDUks7QURPTjtBQTFCRjtBQ3NCRzs7QURPSGtCLFVBQU1wRSxPQUFPLElBQUluZSxJQUFKLENBQVNnSyxTQUFTMFMsaUJBQWlCL2xCLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRHFULFNBQVMwUyxpQkFBaUIvbEIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixFQUEwRitSLE9BQTFGLEVBQVAsRUFBNEcwVixNQUE1RyxDQUFtSCxRQUFuSCxDQUFOO0FDTEUsV0RNRm5ELGVBQWU2Qiw0QkFBZixDQUE0Q3lGLEdBQTVDLEVBQWlEelgsUUFBakQsQ0NORTtBQUNEO0FEdkUyQyxDQUE5Qzs7QUE4RUFtUSxlQUFlQyxXQUFmLEdBQTZCLFVBQUNwUSxRQUFELEVBQVcwUyxZQUFYLEVBQXlCeEMsU0FBekIsRUFBb0M0SCxXQUFwQyxFQUFpRGxqQixRQUFqRCxFQUEyRHliLFVBQTNEO0FBQzVCLE1BQUE5a0IsQ0FBQSxFQUFBeU4sT0FBQSxFQUFBK2UsV0FBQSxFQUFBaFosR0FBQSxFQUFBdlMsQ0FBQSxFQUFBc0ksS0FBQSxFQUFBa2pCLGdCQUFBO0FBQUFsakIsVUFBUWxJLEdBQUdvSSxNQUFILENBQVVyRyxPQUFWLENBQWtCcVIsUUFBbEIsQ0FBUjtBQUVBaEgsWUFBVWxFLE1BQU1rRSxPQUFOLElBQWlCLElBQUkxTyxLQUFKLEVBQTNCO0FBRUF5dEIsZ0JBQWNwZ0IsRUFBRXNnQixVQUFGLENBQWF2RixZQUFiLEVBQTJCMVosT0FBM0IsQ0FBZDtBQUVBek4sTUFBSThuQixRQUFKO0FBQ0F0VSxRQUFNeFQsRUFBRTJzQixFQUFSO0FBRUFGLHFCQUFtQixJQUFJL3RCLE1BQUosRUFBbkI7O0FBR0EsTUFBRzZLLE1BQU1HLE9BQU4sS0FBbUIsSUFBdEI7QUFDQytpQixxQkFBaUIvaUIsT0FBakIsR0FBMkIsSUFBM0I7QUFDQStpQixxQkFBaUI1WixVQUFqQixHQUE4QixJQUFJbEosSUFBSixFQUE5QjtBQ1JDOztBRFdGOGlCLG1CQUFpQmhmLE9BQWpCLEdBQTJCMFosWUFBM0I7QUFDQXNGLG1CQUFpQnpYLFFBQWpCLEdBQTRCeEIsR0FBNUI7QUFDQWlaLG1CQUFpQnhYLFdBQWpCLEdBQStCc1gsV0FBL0I7QUFDQUUsbUJBQWlCcGpCLFFBQWpCLEdBQTRCLElBQUlNLElBQUosQ0FBU04sUUFBVCxDQUE1QjtBQUNBb2pCLG1CQUFpQkcsVUFBakIsR0FBOEI5SCxVQUE5QjtBQUVBN2pCLE1BQUlJLEdBQUdvSSxNQUFILENBQVU4TSxNQUFWLENBQWlCdEcsTUFBakIsQ0FBd0I7QUFBQ3JILFNBQUs2TDtBQUFOLEdBQXhCLEVBQXlDO0FBQUN1QixVQUFNeVc7QUFBUCxHQUF6QyxDQUFKOztBQUNBLE1BQUd4ckIsQ0FBSDtBQUNDbUwsTUFBRXJDLElBQUYsQ0FBT3lpQixXQUFQLEVBQW9CLFVBQUNqdkIsTUFBRDtBQUNuQixVQUFBc3ZCLEdBQUE7QUFBQUEsWUFBTSxJQUFJbnVCLE1BQUosRUFBTjtBQUNBbXVCLFVBQUlqa0IsR0FBSixHQUFVdkgsR0FBR3dxQixrQkFBSCxDQUFzQlAsVUFBdEIsRUFBVjtBQUNBdUIsVUFBSWYsV0FBSixHQUFrQjlyQixFQUFFK25CLE1BQUYsQ0FBUyxVQUFULENBQWxCO0FBQ0E4RSxVQUFJQyxRQUFKLEdBQWVQLFdBQWY7QUFDQU0sVUFBSXRqQixLQUFKLEdBQVlrTCxRQUFaO0FBQ0FvWSxVQUFJZCxTQUFKLEdBQWdCLFNBQWhCO0FBQ0FjLFVBQUl0dkIsTUFBSixHQUFhQSxNQUFiO0FBQ0FzdkIsVUFBSS9YLE9BQUosR0FBY3RCLEdBQWQ7QUNMRyxhRE1IblMsR0FBR3dxQixrQkFBSCxDQUFzQnRPLE1BQXRCLENBQTZCc1AsR0FBN0IsQ0NORztBREhKO0FDS0M7QUQvQjBCLENBQTdCLEM7Ozs7Ozs7Ozs7O0FFL1BBanZCLE1BQU0sQ0FBQzBYLE9BQVAsQ0FBZSxZQUFZO0FBRXpCLE1BQUkxWCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JrdkIsSUFBaEIsSUFBd0JudkIsTUFBTSxDQUFDQyxRQUFQLENBQWdCa3ZCLElBQWhCLENBQXFCQyxVQUFqRCxFQUE2RDtBQUUzRCxRQUFJQyxRQUFRLEdBQUc5bEIsT0FBTyxDQUFDLGVBQUQsQ0FBdEIsQ0FGMkQsQ0FHM0Q7OztBQUNBLFFBQUkrbEIsSUFBSSxHQUFHdHZCLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQmt2QixJQUFoQixDQUFxQkMsVUFBaEM7QUFFQSxRQUFJRyxPQUFPLEdBQUcsSUFBZDtBQUVBRixZQUFRLENBQUNHLFdBQVQsQ0FBcUJGLElBQXJCLEVBQTJCdHZCLE1BQU0sQ0FBQzZsQixlQUFQLENBQXVCLFlBQVk7QUFDNUQsVUFBSSxDQUFDMEosT0FBTCxFQUNFO0FBQ0ZBLGFBQU8sR0FBRyxLQUFWO0FBRUFwa0IsYUFBTyxDQUFDd2QsSUFBUixDQUFhLFlBQWIsRUFMNEQsQ0FNNUQ7O0FBQ0EsVUFBSThHLFVBQVUsR0FBRyxVQUFVeGIsSUFBVixFQUFnQjtBQUMvQixZQUFJeWIsT0FBTyxHQUFHLEtBQUd6YixJQUFJLENBQUMwYixXQUFMLEVBQUgsR0FBc0IsR0FBdEIsSUFBMkIxYixJQUFJLENBQUMyYixRQUFMLEtBQWdCLENBQTNDLElBQThDLEdBQTlDLEdBQW1EM2IsSUFBSSxDQUFDZ1ksT0FBTCxFQUFqRTtBQUNBLGVBQU95RCxPQUFQO0FBQ0QsT0FIRCxDQVA0RCxDQVc1RDs7O0FBQ0EsVUFBSUcsU0FBUyxHQUFHLFlBQVk7QUFDMUIsWUFBSUMsSUFBSSxHQUFHLElBQUkvakIsSUFBSixFQUFYLENBRDBCLENBQ0Q7O0FBQ3pCLFlBQUlna0IsT0FBTyxHQUFHLElBQUloa0IsSUFBSixDQUFTK2pCLElBQUksQ0FBQ3JiLE9BQUwsS0FBaUIsS0FBRyxJQUFILEdBQVEsSUFBbEMsQ0FBZCxDQUYwQixDQUUrQjs7QUFDekQsZUFBT3NiLE9BQVA7QUFDRCxPQUpELENBWjRELENBaUI1RDs7O0FBQ0EsVUFBSUMsaUJBQWlCLEdBQUcsVUFBVW5kLFVBQVYsRUFBc0JsSCxLQUF0QixFQUE2QjtBQUNuRCxZQUFJc2tCLE9BQU8sR0FBR3BkLFVBQVUsQ0FBQ25FLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUS9DLEtBQUssQ0FBQyxLQUFELENBQWQ7QUFBc0IscUJBQVU7QUFBQ3VrQixlQUFHLEVBQUVMLFNBQVM7QUFBZjtBQUFoQyxTQUFoQixDQUFkO0FBQ0EsZUFBT0ksT0FBTyxDQUFDeFgsS0FBUixFQUFQO0FBQ0QsT0FIRCxDQWxCNEQsQ0FzQjVEOzs7QUFDQSxVQUFJMFgsWUFBWSxHQUFHLFVBQVV0ZCxVQUFWLEVBQXNCbEgsS0FBdEIsRUFBNkI7QUFDOUMsWUFBSXNrQixPQUFPLEdBQUdwZCxVQUFVLENBQUNuRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQWQ7QUFDQSxlQUFPc2tCLE9BQU8sQ0FBQ3hYLEtBQVIsRUFBUDtBQUNELE9BSEQsQ0F2QjRELENBMkI1RDs7O0FBQ0EsVUFBSTJYLFNBQVMsR0FBRyxVQUFVdmQsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQzNDLFlBQUltUyxLQUFLLEdBQUdqTCxVQUFVLENBQUNyTixPQUFYLENBQW1CO0FBQUMsaUJBQU9tRyxLQUFLLENBQUMsT0FBRDtBQUFiLFNBQW5CLENBQVo7QUFDQSxZQUFJN0osSUFBSSxHQUFHZ2MsS0FBSyxDQUFDaGMsSUFBakI7QUFDQSxlQUFPQSxJQUFQO0FBQ0QsT0FKRCxDQTVCNEQsQ0FpQzVEOzs7QUFDQSxVQUFJdXVCLFNBQVMsR0FBRyxVQUFVeGQsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQzNDLFlBQUkwa0IsU0FBUyxHQUFHLENBQWhCO0FBQ0EsWUFBSUMsTUFBTSxHQUFHN3NCLEVBQUUsQ0FBQzZLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDLG1CQUFTL0MsS0FBSyxDQUFDLEtBQUQ7QUFBZixTQUFwQixFQUE2QztBQUFDNEMsZ0JBQU0sRUFBRTtBQUFDOUksZ0JBQUksRUFBRTtBQUFQO0FBQVQsU0FBN0MsQ0FBYjtBQUNBNnFCLGNBQU0sQ0FBQ3B1QixPQUFQLENBQWUsVUFBVXF1QixLQUFWLEVBQWlCO0FBQzlCLGNBQUk5cUIsSUFBSSxHQUFHb04sVUFBVSxDQUFDck4sT0FBWCxDQUFtQjtBQUFDLG1CQUFNK3FCLEtBQUssQ0FBQyxNQUFEO0FBQVosV0FBbkIsQ0FBWDs7QUFDQSxjQUFHOXFCLElBQUksSUFBSzRxQixTQUFTLEdBQUc1cUIsSUFBSSxDQUFDNFMsVUFBN0IsRUFBeUM7QUFDdkNnWSxxQkFBUyxHQUFHNXFCLElBQUksQ0FBQzRTLFVBQWpCO0FBQ0Q7QUFDRixTQUxEO0FBTUEsZUFBT2dZLFNBQVA7QUFDRCxPQVZELENBbEM0RCxDQTZDNUQ7OztBQUNBLFVBQUlHLFlBQVksR0FBRyxVQUFVM2QsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQzlDLFlBQUltSCxHQUFHLEdBQUdELFVBQVUsQ0FBQ25FLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUy9DLEtBQUssQ0FBQyxLQUFEO0FBQWYsU0FBaEIsRUFBeUM7QUFBQ25LLGNBQUksRUFBRTtBQUFDNFYsb0JBQVEsRUFBRSxDQUFDO0FBQVosV0FBUDtBQUF1QnFRLGVBQUssRUFBRTtBQUE5QixTQUF6QyxDQUFWO0FBQ0EsWUFBSWdKLE1BQU0sR0FBRzNkLEdBQUcsQ0FBQ2xFLEtBQUosRUFBYjtBQUNBLFlBQUc2aEIsTUFBTSxDQUFDOXRCLE1BQVAsR0FBZ0IsQ0FBbkIsRUFDRSxJQUFJK3RCLEdBQUcsR0FBR0QsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVclosUUFBcEI7QUFDQSxlQUFPc1osR0FBUDtBQUNILE9BTkQsQ0E5QzRELENBcUQ1RDs7O0FBQ0EsVUFBSUMsZ0JBQWdCLEdBQUcsVUFBVTlkLFVBQVYsRUFBc0JsSCxLQUF0QixFQUE2QjtBQUNsRCxZQUFJaWxCLE9BQU8sR0FBRyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLENBQWQ7QUFDQSxZQUFJQyxLQUFLLEdBQUdqZSxVQUFVLENBQUNuRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQVo7QUFDQW1sQixhQUFLLENBQUM1dUIsT0FBTixDQUFjLFVBQVU2dUIsSUFBVixFQUFnQjtBQUM1QixjQUFJQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQ0gsS0FBSixDQUFVcGlCLElBQVYsQ0FBZTtBQUFDLG9CQUFPcWlCLElBQUksQ0FBQyxLQUFEO0FBQVosV0FBZixDQUFYO0FBQ0FDLGNBQUksQ0FBQzl1QixPQUFMLENBQWEsVUFBVWd2QixHQUFWLEVBQWU7QUFDMUJOLG1CQUFPLEdBQUdNLEdBQUcsQ0FBQ0MsUUFBSixDQUFhNXBCLElBQXZCO0FBQ0FzcEIsbUJBQU8sSUFBSUQsT0FBWDtBQUNELFdBSEQ7QUFJRCxTQU5EO0FBT0EsZUFBT0MsT0FBUDtBQUNELE9BWkQsQ0F0RDRELENBbUU1RDs7O0FBQ0EsVUFBSU8scUJBQXFCLEdBQUcsVUFBVXZlLFVBQVYsRUFBc0JsSCxLQUF0QixFQUE2QjtBQUN2RCxZQUFJaWxCLE9BQU8sR0FBRyxDQUFkO0FBQ0EsWUFBSUMsT0FBTyxHQUFHLENBQWQ7QUFDQSxZQUFJQyxLQUFLLEdBQUdqZSxVQUFVLENBQUNuRSxJQUFYLENBQWdCO0FBQUMsbUJBQVMvQyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQVo7QUFDQW1sQixhQUFLLENBQUM1dUIsT0FBTixDQUFjLFVBQVU2dUIsSUFBVixFQUFnQjtBQUM1QixjQUFJQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQ0gsS0FBSixDQUFVcGlCLElBQVYsQ0FBZTtBQUFDLG9CQUFRcWlCLElBQUksQ0FBQyxLQUFELENBQWI7QUFBc0IsMEJBQWM7QUFBQ2IsaUJBQUcsRUFBRUwsU0FBUztBQUFmO0FBQXBDLFdBQWYsQ0FBWDtBQUNBbUIsY0FBSSxDQUFDOXVCLE9BQUwsQ0FBYSxVQUFVZ3ZCLEdBQVYsRUFBZTtBQUMxQk4sbUJBQU8sR0FBR00sR0FBRyxDQUFDQyxRQUFKLENBQWE1cEIsSUFBdkI7QUFDQXNwQixtQkFBTyxJQUFJRCxPQUFYO0FBQ0QsV0FIRDtBQUlELFNBTkQ7QUFPQSxlQUFPQyxPQUFQO0FBQ0QsT0FaRCxDQXBFNEQsQ0FpRjVEOzs7QUFDQXB0QixRQUFFLENBQUNvSSxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQyxtQkFBVTtBQUFYLE9BQWYsRUFBaUN4TSxPQUFqQyxDQUF5QyxVQUFVeUosS0FBVixFQUFpQjtBQUN4RGxJLFVBQUUsQ0FBQzR0QixrQkFBSCxDQUFzQjFSLE1BQXRCLENBQTZCO0FBQzNCaFUsZUFBSyxFQUFFQSxLQUFLLENBQUMsS0FBRCxDQURlO0FBRTNCMmxCLG9CQUFVLEVBQUUzbEIsS0FBSyxDQUFDLE1BQUQsQ0FGVTtBQUczQnFoQixpQkFBTyxFQUFFcmhCLEtBQUssQ0FBQyxTQUFELENBSGE7QUFJM0I0bEIsb0JBQVUsRUFBRW5CLFNBQVMsQ0FBQzNzQixFQUFFLENBQUMwTixLQUFKLEVBQVd4RixLQUFYLENBSk07QUFLM0J1TCxpQkFBTyxFQUFFLElBQUluTCxJQUFKLEVBTGtCO0FBTTNCeWxCLGlCQUFPLEVBQUM7QUFDTnJnQixpQkFBSyxFQUFFZ2YsWUFBWSxDQUFDMXNCLEVBQUUsQ0FBQzZLLFdBQUosRUFBaUIzQyxLQUFqQixDQURiO0FBRU53Qyx5QkFBYSxFQUFFZ2lCLFlBQVksQ0FBQzFzQixFQUFFLENBQUMwSyxhQUFKLEVBQW1CeEMsS0FBbkIsQ0FGckI7QUFHTjBNLHNCQUFVLEVBQUVnWSxTQUFTLENBQUM1c0IsRUFBRSxDQUFDME4sS0FBSixFQUFXeEYsS0FBWDtBQUhmLFdBTm1CO0FBVzNCOGxCLGtCQUFRLEVBQUM7QUFDUEMsaUJBQUssRUFBRXZCLFlBQVksQ0FBQzFzQixFQUFFLENBQUNpdUIsS0FBSixFQUFXL2xCLEtBQVgsQ0FEWjtBQUVQZ21CLGlCQUFLLEVBQUV4QixZQUFZLENBQUMxc0IsRUFBRSxDQUFDa3VCLEtBQUosRUFBV2htQixLQUFYLENBRlo7QUFHUGltQixzQkFBVSxFQUFFekIsWUFBWSxDQUFDMXNCLEVBQUUsQ0FBQ211QixVQUFKLEVBQWdCam1CLEtBQWhCLENBSGpCO0FBSVBrbUIsMEJBQWMsRUFBRTFCLFlBQVksQ0FBQzFzQixFQUFFLENBQUNvdUIsY0FBSixFQUFvQmxtQixLQUFwQixDQUpyQjtBQUtQbW1CLHFCQUFTLEVBQUUzQixZQUFZLENBQUMxc0IsRUFBRSxDQUFDcXVCLFNBQUosRUFBZW5tQixLQUFmLENBTGhCO0FBTVBvbUIsbUNBQXVCLEVBQUV2QixZQUFZLENBQUMvc0IsRUFBRSxDQUFDcXVCLFNBQUosRUFBZW5tQixLQUFmLENBTjlCO0FBT1BxbUIsdUJBQVcsRUFBRWhDLGlCQUFpQixDQUFDdnNCLEVBQUUsQ0FBQ2l1QixLQUFKLEVBQVcvbEIsS0FBWCxDQVB2QjtBQVFQc21CLHVCQUFXLEVBQUVqQyxpQkFBaUIsQ0FBQ3ZzQixFQUFFLENBQUNrdUIsS0FBSixFQUFXaG1CLEtBQVgsQ0FSdkI7QUFTUHVtQiwyQkFBZSxFQUFFbEMsaUJBQWlCLENBQUN2c0IsRUFBRSxDQUFDcXVCLFNBQUosRUFBZW5tQixLQUFmO0FBVDNCLFdBWGtCO0FBc0IzQndtQixhQUFHLEVBQUU7QUFDSEMsaUJBQUssRUFBRWpDLFlBQVksQ0FBQzFzQixFQUFFLENBQUM0dUIsU0FBSixFQUFlMW1CLEtBQWYsQ0FEaEI7QUFFSG1sQixpQkFBSyxFQUFFWCxZQUFZLENBQUMxc0IsRUFBRSxDQUFDNnVCLFNBQUosRUFBZTNtQixLQUFmLENBRmhCO0FBR0g0bUIsK0JBQW1CLEVBQUUvQixZQUFZLENBQUMvc0IsRUFBRSxDQUFDNnVCLFNBQUosRUFBZTNtQixLQUFmLENBSDlCO0FBSUg2bUIsa0NBQXNCLEVBQUU3QixnQkFBZ0IsQ0FBQ2x0QixFQUFFLENBQUM2dUIsU0FBSixFQUFlM21CLEtBQWYsQ0FKckM7QUFLSDhtQixvQkFBUSxFQUFFdEMsWUFBWSxDQUFDMXNCLEVBQUUsQ0FBQ2l2QixZQUFKLEVBQWtCL21CLEtBQWxCLENBTG5CO0FBTUhnbkIsdUJBQVcsRUFBRTNDLGlCQUFpQixDQUFDdnNCLEVBQUUsQ0FBQzR1QixTQUFKLEVBQWUxbUIsS0FBZixDQU4zQjtBQU9IaW5CLHVCQUFXLEVBQUU1QyxpQkFBaUIsQ0FBQ3ZzQixFQUFFLENBQUM2dUIsU0FBSixFQUFlM21CLEtBQWYsQ0FQM0I7QUFRSGtuQiwwQkFBYyxFQUFFN0MsaUJBQWlCLENBQUN2c0IsRUFBRSxDQUFDaXZCLFlBQUosRUFBa0IvbUIsS0FBbEIsQ0FSOUI7QUFTSG1uQix3Q0FBNEIsRUFBRTFCLHFCQUFxQixDQUFDM3RCLEVBQUUsQ0FBQzZ1QixTQUFKLEVBQWUzbUIsS0FBZjtBQVRoRDtBQXRCc0IsU0FBN0I7QUFrQ0QsT0FuQ0Q7QUFxQ0FSLGFBQU8sQ0FBQzhkLE9BQVIsQ0FBZ0IsWUFBaEI7QUFFQXNHLGFBQU8sR0FBRyxJQUFWO0FBRUQsS0EzSDBCLEVBMkh4QixZQUFZO0FBQ2Jwa0IsYUFBTyxDQUFDNlQsR0FBUixDQUFZLDRCQUFaO0FBQ0QsS0E3SDBCLENBQTNCO0FBK0hEO0FBRUYsQ0EzSUQsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUFoZixPQUFPMFgsT0FBUCxDQUFlO0FDQ2IsU0RBRXFiLFdBQVd4WSxHQUFYLENBQ0k7QUFBQXlZLGFBQVMsQ0FBVDtBQUNBbHhCLFVBQU0sZ0RBRE47QUFFQW14QixRQUFJO0FBQ0EsVUFBQXpvQixDQUFBLEVBQUErRixDQUFBLEVBQUEyaUIsbUJBQUE7QUFBQS9uQixjQUFRd2QsSUFBUixDQUFhLHNCQUFiOztBQUNBO0FBQ0l1Syw4QkFBc0IsVUFBQ0MsU0FBRCxFQUFZdGMsUUFBWixFQUFzQnVjLFdBQXRCLEVBQW1DQyxjQUFuQyxFQUFtREMsU0FBbkQ7QUFDbEIsY0FBQUMsUUFBQTtBQUFBQSxxQkFBVztBQUFDQyxvQkFBUUwsU0FBVDtBQUFvQnJWLG1CQUFPdVYsZUFBZSxZQUFmLENBQTNCO0FBQXlEOUIsd0JBQVk4QixlQUFlLGlCQUFmLENBQXJFO0FBQXdHMW5CLG1CQUFPa0wsUUFBL0c7QUFBeUg0YyxzQkFBVUwsV0FBbkk7QUFBZ0pNLHFCQUFTTCxlQUFlLFNBQWY7QUFBekosV0FBWDs7QUFDQSxjQUFHQyxTQUFIO0FBQ0lDLHFCQUFTSSxPQUFULEdBQW1CLElBQW5CO0FDVWI7O0FBQ0QsaUJEVFUxQyxJQUFJYSxTQUFKLENBQWN6ZixNQUFkLENBQXFCO0FBQUNySCxpQkFBS3FvQixlQUFlLE1BQWY7QUFBTixXQUFyQixFQUFvRDtBQUFDamIsa0JBQU07QUFBQ21iLHdCQUFVQTtBQUFYO0FBQVAsV0FBcEQsQ0NTVjtBRGQ0QixTQUF0Qjs7QUFNQWhqQixZQUFJLENBQUo7QUFDQTlNLFdBQUdxdUIsU0FBSCxDQUFhcGpCLElBQWIsQ0FBa0I7QUFBQyxpQ0FBdUI7QUFBQzJSLHFCQUFTO0FBQVY7QUFBeEIsU0FBbEIsRUFBNEQ7QUFBQzdlLGdCQUFNO0FBQUM0VixzQkFBVSxDQUFDO0FBQVosV0FBUDtBQUF1QjdJLGtCQUFRO0FBQUM1QyxtQkFBTyxDQUFSO0FBQVdpb0IseUJBQWE7QUFBeEI7QUFBL0IsU0FBNUQsRUFBd0gxeEIsT0FBeEgsQ0FBZ0ksVUFBQzJ4QixHQUFEO0FBQzVILGNBQUFDLE9BQUEsRUFBQVYsV0FBQSxFQUFBdmMsUUFBQTtBQUFBaWQsb0JBQVVELElBQUlELFdBQWQ7QUFDQS9jLHFCQUFXZ2QsSUFBSWxvQixLQUFmO0FBQ0F5bkIsd0JBQWNTLElBQUk3b0IsR0FBbEI7QUFDQThvQixrQkFBUTV4QixPQUFSLENBQWdCLFVBQUNndkIsR0FBRDtBQUNaLGdCQUFBNkMsV0FBQSxFQUFBWixTQUFBO0FBQUFZLDBCQUFjN0MsSUFBSXlDLE9BQWxCO0FBQ0FSLHdCQUFZWSxZQUFZQyxJQUF4QjtBQUNBZCxnQ0FBb0JDLFNBQXBCLEVBQStCdGMsUUFBL0IsRUFBeUN1YyxXQUF6QyxFQUFzRFcsV0FBdEQsRUFBbUUsSUFBbkU7O0FBRUEsZ0JBQUc3QyxJQUFJK0MsUUFBUDtBQzhCVixxQkQ3QmMvQyxJQUFJK0MsUUFBSixDQUFhL3hCLE9BQWIsQ0FBcUIsVUFBQ2d5QixHQUFEO0FDOEJqQyx1QkQ3QmdCaEIsb0JBQW9CQyxTQUFwQixFQUErQnRjLFFBQS9CLEVBQXlDdWMsV0FBekMsRUFBc0RjLEdBQXRELEVBQTJELEtBQTNELENDNkJoQjtBRDlCWSxnQkM2QmQ7QUFHRDtBRHRDTztBQ3dDVixpQkQvQlUzakIsR0MrQlY7QUQ1Q007QUFSSixlQUFBL0csS0FBQTtBQXVCTWdCLFlBQUFoQixLQUFBO0FBQ0YyQixnQkFBUTNCLEtBQVIsQ0FBY2dCLENBQWQ7QUNpQ1Q7O0FBQ0QsYURoQ01XLFFBQVE4ZCxPQUFSLENBQWdCLHNCQUFoQixDQ2dDTjtBRDlERTtBQStCQWtMLFVBQU07QUNrQ1IsYURqQ01ocEIsUUFBUTZULEdBQVIsQ0FBWSxnQkFBWixDQ2lDTjtBRGpFRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBaGYsT0FBTzBYLE9BQVAsQ0FBZTtBQ0NiLFNEQUVxYixXQUFXeFksR0FBWCxDQUNJO0FBQUF5WSxhQUFTLENBQVQ7QUFDQWx4QixVQUFNLHNCQUROO0FBRUFteEIsUUFBSTtBQUNBLFVBQUFwZ0IsVUFBQSxFQUFBckksQ0FBQTtBQUFBVyxjQUFRNlQsR0FBUixDQUFZLGNBQVo7QUFDQTdULGNBQVF3ZCxJQUFSLENBQWEsb0JBQWI7O0FBQ0E7QUFDSTlWLHFCQUFhcFAsR0FBRzZLLFdBQWhCO0FBQ0F1RSxtQkFBV25FLElBQVgsQ0FBZ0I7QUFBQ1AseUJBQWU7QUFBQ2tTLHFCQUFTO0FBQVY7QUFBaEIsU0FBaEIsRUFBbUQ7QUFBQzlSLGtCQUFRO0FBQUM2bEIsMEJBQWM7QUFBZjtBQUFULFNBQW5ELEVBQWdGbHlCLE9BQWhGLENBQXdGLFVBQUNtaEIsRUFBRDtBQUNwRixjQUFHQSxHQUFHK1EsWUFBTjtBQ1VSLG1CRFRZdmhCLFdBQVc4RixNQUFYLENBQWtCdEcsTUFBbEIsQ0FBeUJnUixHQUFHclksR0FBNUIsRUFBaUM7QUFBQ29OLG9CQUFNO0FBQUNqSywrQkFBZSxDQUFDa1YsR0FBRytRLFlBQUo7QUFBaEI7QUFBUCxhQUFqQyxDQ1NaO0FBS0Q7QURoQks7QUFGSixlQUFBNXFCLEtBQUE7QUFNTWdCLFlBQUFoQixLQUFBO0FBQ0YyQixnQkFBUTNCLEtBQVIsQ0FBY2dCLENBQWQ7QUNnQlQ7O0FBQ0QsYURmTVcsUUFBUThkLE9BQVIsQ0FBZ0Isb0JBQWhCLENDZU47QUQ3QkU7QUFlQWtMLFVBQU07QUNpQlIsYURoQk1ocEIsUUFBUTZULEdBQVIsQ0FBWSxnQkFBWixDQ2dCTjtBRGhDRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBaGYsT0FBTzBYLE9BQVAsQ0FBZTtBQ0NiLFNEQUVxYixXQUFXeFksR0FBWCxDQUNJO0FBQUF5WSxhQUFTLENBQVQ7QUFDQWx4QixVQUFNLHdCQUROO0FBRUFteEIsUUFBSTtBQUNBLFVBQUFwZ0IsVUFBQSxFQUFBckksQ0FBQTtBQUFBVyxjQUFRNlQsR0FBUixDQUFZLGNBQVo7QUFDQTdULGNBQVF3ZCxJQUFSLENBQWEsMEJBQWI7O0FBQ0E7QUFDSTlWLHFCQUFhcFAsR0FBRzZLLFdBQWhCO0FBQ0F1RSxtQkFBV25FLElBQVgsQ0FBZ0I7QUFBQzhKLGlCQUFPO0FBQUM2SCxxQkFBUztBQUFWO0FBQVIsU0FBaEIsRUFBMkM7QUFBQzlSLGtCQUFRO0FBQUM5SSxrQkFBTTtBQUFQO0FBQVQsU0FBM0MsRUFBZ0V2RCxPQUFoRSxDQUF3RSxVQUFDbWhCLEVBQUQ7QUFDcEUsY0FBQXhLLE9BQUEsRUFBQW1ELENBQUE7O0FBQUEsY0FBR3FILEdBQUc1ZCxJQUFOO0FBQ0l1VyxnQkFBSXZZLEdBQUcwTixLQUFILENBQVMzTCxPQUFULENBQWlCO0FBQUN3RixtQkFBS3FZLEdBQUc1ZDtBQUFULGFBQWpCLEVBQWlDO0FBQUM4SSxzQkFBUTtBQUFDbUssd0JBQVE7QUFBVDtBQUFULGFBQWpDLENBQUo7O0FBQ0EsZ0JBQUdzRCxLQUFLQSxFQUFFdEQsTUFBUCxJQUFpQnNELEVBQUV0RCxNQUFGLENBQVMvVixNQUFULEdBQWtCLENBQXRDO0FBQ0ksa0JBQUcsMkZBQTJGNEIsSUFBM0YsQ0FBZ0d5WCxFQUFFdEQsTUFBRixDQUFTLENBQVQsRUFBWUcsT0FBNUcsQ0FBSDtBQUNJQSwwQkFBVW1ELEVBQUV0RCxNQUFGLENBQVMsQ0FBVCxFQUFZRyxPQUF0QjtBQ2lCaEIsdUJEaEJnQmhHLFdBQVc4RixNQUFYLENBQWtCdEcsTUFBbEIsQ0FBeUJnUixHQUFHclksR0FBNUIsRUFBaUM7QUFBQ29OLHdCQUFNO0FBQUNJLDJCQUFPSztBQUFSO0FBQVAsaUJBQWpDLENDZ0JoQjtBRG5CUTtBQUZKO0FDNEJUO0FEN0JLO0FBRkosZUFBQXJQLEtBQUE7QUFXTWdCLFlBQUFoQixLQUFBO0FBQ0YyQixnQkFBUTNCLEtBQVIsQ0FBY2dCLENBQWQ7QUN3QlQ7O0FBQ0QsYUR2Qk1XLFFBQVE4ZCxPQUFSLENBQWdCLDBCQUFoQixDQ3VCTjtBRDFDRTtBQW9CQWtMLFVBQU07QUN5QlIsYUR4Qk1ocEIsUUFBUTZULEdBQVIsQ0FBWSxnQkFBWixDQ3dCTjtBRDdDRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBaGYsT0FBTzBYLE9BQVAsQ0FBZTtBQ0NiLFNEQUVxYixXQUFXeFksR0FBWCxDQUNJO0FBQUF5WSxhQUFTLENBQVQ7QUFDQWx4QixVQUFNLDBCQUROO0FBRUFteEIsUUFBSTtBQUNBLFVBQUF6b0IsQ0FBQTtBQUFBVyxjQUFRNlQsR0FBUixDQUFZLGNBQVo7QUFDQTdULGNBQVF3ZCxJQUFSLENBQWEsK0JBQWI7O0FBQ0E7QUFDSWxsQixXQUFHMEssYUFBSCxDQUFpQndLLE1BQWpCLENBQXdCdEcsTUFBeEIsQ0FBK0I7QUFBQ3pRLG1CQUFTO0FBQUN5ZSxxQkFBUztBQUFWO0FBQVYsU0FBL0IsRUFBNEQ7QUFBQ2pJLGdCQUFNO0FBQUN4VyxxQkFBUztBQUFWO0FBQVAsU0FBNUQsRUFBb0Y7QUFBQzBYLGlCQUFPO0FBQVIsU0FBcEY7QUFESixlQUFBOVAsS0FBQTtBQUVNZ0IsWUFBQWhCLEtBQUE7QUFDRjJCLGdCQUFRM0IsS0FBUixDQUFjZ0IsQ0FBZDtBQ2FUOztBQUNELGFEWk1XLFFBQVE4ZCxPQUFSLENBQWdCLCtCQUFoQixDQ1lOO0FEdEJFO0FBV0FrTCxVQUFNO0FDY1IsYURiTWhwQixRQUFRNlQsR0FBUixDQUFZLGdCQUFaLENDYU47QUR6QkU7QUFBQSxHQURKLENDQUY7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQWhmLE9BQU8wWCxPQUFQLENBQWU7QUNDYixTREFEcWIsV0FBV3hZLEdBQVgsQ0FDQztBQUFBeVksYUFBUyxDQUFUO0FBQ0FseEIsVUFBTSxxQ0FETjtBQUVBbXhCLFFBQUk7QUFDSCxVQUFBem9CLENBQUE7QUFBQVcsY0FBUTZULEdBQVIsQ0FBWSxjQUFaO0FBQ0E3VCxjQUFRd2QsSUFBUixDQUFhLDhCQUFiOztBQUNBO0FBRUNsbEIsV0FBRzZLLFdBQUgsQ0FBZUksSUFBZixHQUFzQnhNLE9BQXRCLENBQThCLFVBQUNtaEIsRUFBRDtBQUM3QixjQUFBZ1IsV0FBQSxFQUFBQyxXQUFBLEVBQUFqeEIsQ0FBQSxFQUFBa3hCLGVBQUEsRUFBQUMsUUFBQTs7QUFBQSxjQUFHLENBQUluUixHQUFHbFYsYUFBVjtBQUNDO0FDRUs7O0FERE4sY0FBR2tWLEdBQUdsVixhQUFILENBQWlCeEwsTUFBakIsS0FBMkIsQ0FBOUI7QUFDQzB4QiwwQkFBYzV3QixHQUFHMEssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0IyVSxHQUFHbFYsYUFBSCxDQUFpQixDQUFqQixDQUF0QixFQUEyQ3NLLEtBQTNDLEVBQWQ7O0FBQ0EsZ0JBQUc0YixnQkFBZSxDQUFsQjtBQUNDRyx5QkFBVy93QixHQUFHMEssYUFBSCxDQUFpQjNJLE9BQWpCLENBQXlCO0FBQUNtRyx1QkFBTzBYLEdBQUcxWCxLQUFYO0FBQWtCNm5CLHdCQUFRO0FBQTFCLGVBQXpCLENBQVg7O0FBQ0Esa0JBQUdnQixRQUFIO0FBQ0NueEIsb0JBQUlJLEdBQUc2SyxXQUFILENBQWVxSyxNQUFmLENBQXNCdEcsTUFBdEIsQ0FBNkI7QUFBQ3JILHVCQUFLcVksR0FBR3JZO0FBQVQsaUJBQTdCLEVBQTRDO0FBQUNvTix3QkFBTTtBQUFDakssbUNBQWUsQ0FBQ3FtQixTQUFTeHBCLEdBQVYsQ0FBaEI7QUFBZ0NvcEIsa0NBQWNJLFNBQVN4cEI7QUFBdkQ7QUFBUCxpQkFBNUMsQ0FBSjs7QUFDQSxvQkFBRzNILENBQUg7QUNhVSx5QkRaVG14QixTQUFTQyxXQUFULEVDWVM7QURmWDtBQUFBO0FBS0N0cEIsd0JBQVEzQixLQUFSLENBQWMsOEJBQWQ7QUNjUSx1QkRiUjJCLFFBQVEzQixLQUFSLENBQWM2WixHQUFHclksR0FBakIsQ0NhUTtBRHJCVjtBQUZEO0FBQUEsaUJBV0ssSUFBR3FZLEdBQUdsVixhQUFILENBQWlCeEwsTUFBakIsR0FBMEIsQ0FBN0I7QUFDSjR4Qiw4QkFBa0IsRUFBbEI7QUFDQWxSLGVBQUdsVixhQUFILENBQWlCak0sT0FBakIsQ0FBeUIsVUFBQ2tjLENBQUQ7QUFDeEJpVyw0QkFBYzV3QixHQUFHMEssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0IwUCxDQUF0QixFQUF5QjNGLEtBQXpCLEVBQWQ7O0FBQ0Esa0JBQUc0YixnQkFBZSxDQUFsQjtBQ2dCUyx1QkRmUkUsZ0JBQWdCbHlCLElBQWhCLENBQXFCK2IsQ0FBckIsQ0NlUTtBQUNEO0FEbkJUOztBQUlBLGdCQUFHbVcsZ0JBQWdCNXhCLE1BQWhCLEdBQXlCLENBQTVCO0FBQ0MyeEIsNEJBQWM5bEIsRUFBRXNnQixVQUFGLENBQWF6TCxHQUFHbFYsYUFBaEIsRUFBK0JvbUIsZUFBL0IsQ0FBZDs7QUFDQSxrQkFBR0QsWUFBWXB4QixRQUFaLENBQXFCbWdCLEdBQUcrUSxZQUF4QixDQUFIO0FDa0JTLHVCRGpCUjN3QixHQUFHNkssV0FBSCxDQUFlcUssTUFBZixDQUFzQnRHLE1BQXRCLENBQTZCO0FBQUNySCx1QkFBS3FZLEdBQUdyWTtBQUFULGlCQUE3QixFQUE0QztBQUFDb04sd0JBQU07QUFBQ2pLLG1DQUFlbW1CO0FBQWhCO0FBQVAsaUJBQTVDLENDaUJRO0FEbEJUO0FDMEJTLHVCRHZCUjd3QixHQUFHNkssV0FBSCxDQUFlcUssTUFBZixDQUFzQnRHLE1BQXRCLENBQTZCO0FBQUNySCx1QkFBS3FZLEdBQUdyWTtBQUFULGlCQUE3QixFQUE0QztBQUFDb04sd0JBQU07QUFBQ2pLLG1DQUFlbW1CLFdBQWhCO0FBQTZCRixrQ0FBY0UsWUFBWSxDQUFaO0FBQTNDO0FBQVAsaUJBQTVDLENDdUJRO0FENUJWO0FBTkk7QUM0Q0M7QUQxRFA7QUFGRCxlQUFBOXFCLEtBQUE7QUE2Qk1nQixZQUFBaEIsS0FBQTtBQUNMMkIsZ0JBQVEzQixLQUFSLENBQWMsOEJBQWQ7QUFDQTJCLGdCQUFRM0IsS0FBUixDQUFjZ0IsRUFBRWEsS0FBaEI7QUNtQ0c7O0FBQ0QsYURsQ0hGLFFBQVE4ZCxPQUFSLENBQWdCLDhCQUFoQixDQ2tDRztBRHhFSjtBQXVDQWtMLFVBQU07QUNvQ0YsYURuQ0hocEIsUUFBUTZULEdBQVIsQ0FBWSxnQkFBWixDQ21DRztBRDNFSjtBQUFBLEdBREQsQ0NBQztBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBaGYsT0FBTzBYLE9BQVAsQ0FBZTtBQ0NiLFNEQURxYixXQUFXeFksR0FBWCxDQUNDO0FBQUF5WSxhQUFTLENBQVQ7QUFDQWx4QixVQUFNLFFBRE47QUFFQW14QixRQUFJO0FBQ0gsVUFBQXpvQixDQUFBLEVBQUF5SyxVQUFBO0FBQUE5SixjQUFRNlQsR0FBUixDQUFZLGNBQVo7QUFDQTdULGNBQVF3ZCxJQUFSLENBQWEsaUJBQWI7O0FBQ0E7QUFFQ2xsQixXQUFHb00sT0FBSCxDQUFXdk4sTUFBWCxDQUFrQixFQUFsQjtBQUVBbUIsV0FBR29NLE9BQUgsQ0FBVzhQLE1BQVgsQ0FBa0I7QUFDakIsaUJBQU8sbUJBRFU7QUFFakIscUJBQVcsbUJBRk07QUFHakIsa0JBQVEsbUJBSFM7QUFJakIscUJBQVcsUUFKTTtBQUtqQix1QkFBYSxHQUxJO0FBTWpCLDJCQUFpQjtBQU5BLFNBQWxCO0FBU0FsYyxXQUFHb00sT0FBSCxDQUFXOFAsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyx1QkFEVTtBQUVqQixxQkFBVyx1QkFGTTtBQUdqQixrQkFBUSx1QkFIUztBQUlqQixxQkFBVyxXQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFTQWxjLFdBQUdvTSxPQUFILENBQVc4UCxNQUFYLENBQWtCO0FBQ2pCLGlCQUFPLHFCQURVO0FBRWpCLHFCQUFXLHFCQUZNO0FBR2pCLGtCQUFRLHFCQUhTO0FBSWpCLHFCQUFXLFdBSk07QUFLakIsdUJBQWEsR0FMSTtBQU1qQiwyQkFBaUI7QUFOQSxTQUFsQjtBQVVBMUsscUJBQWEsSUFBSWxKLElBQUosQ0FBU21lLE9BQU8sSUFBSW5lLElBQUosRUFBUCxFQUFpQm9lLE1BQWpCLENBQXdCLFlBQXhCLENBQVQsQ0FBYjtBQUNBMW1CLFdBQUdvSSxNQUFILENBQVU2QyxJQUFWLENBQWU7QUFBQzVDLG1CQUFTLElBQVY7QUFBZ0JrakIsc0JBQVk7QUFBQzNPLHFCQUFTO0FBQVYsV0FBNUI7QUFBOEN4USxtQkFBUztBQUFDd1EscUJBQVM7QUFBVjtBQUF2RCxTQUFmLEVBQXdGbmUsT0FBeEYsQ0FBZ0csVUFBQzBtQixDQUFEO0FBQy9GLGNBQUFvRSxPQUFBLEVBQUF4aUIsQ0FBQSxFQUFBaUIsUUFBQSxFQUFBK2QsVUFBQSxFQUFBa0wsTUFBQSxFQUFBQyxPQUFBLEVBQUF6TixVQUFBOztBQUFBO0FBQ0N5TixzQkFBVSxFQUFWO0FBQ0F6Tix5QkFBYXpqQixHQUFHNkssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUMvQyxxQkFBT2lkLEVBQUU1ZCxHQUFWO0FBQWVvWSw2QkFBZTtBQUE5QixhQUFwQixFQUF5RDNLLEtBQXpELEVBQWI7QUFDQWtjLG9CQUFRM0YsVUFBUixHQUFxQjlILFVBQXJCO0FBQ0E4RixzQkFBVXBFLEVBQUVvRSxPQUFaOztBQUNBLGdCQUFHQSxVQUFVLENBQWI7QUFDQzBILHVCQUFTLENBQVQ7QUFDQWxMLDJCQUFhLENBQWI7O0FBQ0FoYixnQkFBRXJDLElBQUYsQ0FBT3ljLEVBQUUvWSxPQUFULEVBQWtCLFVBQUMra0IsRUFBRDtBQUNqQixvQkFBQWoxQixNQUFBO0FBQUFBLHlCQUFTOEQsR0FBR29NLE9BQUgsQ0FBV3JLLE9BQVgsQ0FBbUI7QUFBQzFELHdCQUFNOHlCO0FBQVAsaUJBQW5CLENBQVQ7O0FBQ0Esb0JBQUdqMUIsVUFBV0EsT0FBT3l0QixTQUFyQjtBQ1dVLHlCRFZUNUQsY0FBYzdwQixPQUFPeXRCLFNDVVo7QUFDRDtBRGRWOztBQUlBc0gsdUJBQVMzZSxTQUFTLENBQUNpWCxXQUFTeEQsYUFBV3RDLFVBQXBCLENBQUQsRUFBa0MrRixPQUFsQyxFQUFULElBQXdELENBQWpFO0FBQ0F4aEIseUJBQVcsSUFBSU0sSUFBSixFQUFYO0FBQ0FOLHVCQUFTb3BCLFFBQVQsQ0FBa0JwcEIsU0FBU21rQixRQUFULEtBQW9COEUsTUFBdEM7QUFDQWpwQix5QkFBVyxJQUFJTSxJQUFKLENBQVNtZSxPQUFPemUsUUFBUCxFQUFpQjBlLE1BQWpCLENBQXdCLFlBQXhCLENBQVQsQ0FBWDtBQUNBd0ssc0JBQVExZixVQUFSLEdBQXFCQSxVQUFyQjtBQUNBMGYsc0JBQVFscEIsUUFBUixHQUFtQkEsUUFBbkI7QUFaRCxtQkFjSyxJQUFHdWhCLFdBQVcsQ0FBZDtBQUNKMkgsc0JBQVExZixVQUFSLEdBQXFCQSxVQUFyQjtBQUNBMGYsc0JBQVFscEIsUUFBUixHQUFtQixJQUFJTSxJQUFKLEVBQW5CO0FDWU07O0FEVlA2YyxjQUFFL1ksT0FBRixDQUFVeE4sSUFBVixDQUFlLG1CQUFmO0FBQ0FzeUIsb0JBQVE5a0IsT0FBUixHQUFrQnJCLEVBQUU2QixJQUFGLENBQU91WSxFQUFFL1ksT0FBVCxDQUFsQjtBQ1lNLG1CRFhOcE0sR0FBR29JLE1BQUgsQ0FBVThNLE1BQVYsQ0FBaUJ0RyxNQUFqQixDQUF3QjtBQUFDckgsbUJBQUs0ZCxFQUFFNWQ7QUFBUixhQUF4QixFQUFzQztBQUFDb04sb0JBQU11YztBQUFQLGFBQXRDLENDV007QURwQ1AsbUJBQUFuckIsS0FBQTtBQTBCTWdCLGdCQUFBaEIsS0FBQTtBQUNMMkIsb0JBQVEzQixLQUFSLENBQWMsdUJBQWQ7QUFDQTJCLG9CQUFRM0IsS0FBUixDQUFjb2YsRUFBRTVkLEdBQWhCO0FBQ0FHLG9CQUFRM0IsS0FBUixDQUFjbXJCLE9BQWQ7QUNpQk0sbUJEaEJOeHBCLFFBQVEzQixLQUFSLENBQWNnQixFQUFFYSxLQUFoQixDQ2dCTTtBQUNEO0FEaERQO0FBakNELGVBQUE3QixLQUFBO0FBa0VNZ0IsWUFBQWhCLEtBQUE7QUFDTDJCLGdCQUFRM0IsS0FBUixDQUFjLGlCQUFkO0FBQ0EyQixnQkFBUTNCLEtBQVIsQ0FBY2dCLEVBQUVhLEtBQWhCO0FDbUJHOztBQUNELGFEbEJIRixRQUFROGQsT0FBUixDQUFnQixpQkFBaEIsQ0NrQkc7QUQ3Rko7QUE0RUFrTCxVQUFNO0FDb0JGLGFEbkJIaHBCLFFBQVE2VCxHQUFSLENBQVksZ0JBQVosQ0NtQkc7QURoR0o7QUFBQSxHQURELENDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQWhmLE9BQU8wWCxPQUFQLENBQWU7QUNDYixTREFEcWIsV0FBVytCLFNBQVgsQ0FBcUIsUUFBckIsQ0NBQztBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBOTBCLE9BQU8wWCxPQUFQLENBQWU7QUNDYixTREFELElBQUlxZCxRQUFRQyxLQUFaLENBQ0M7QUFBQWx6QixVQUFNLGdCQUFOO0FBQ0ErUSxnQkFBWXBQLEdBQUdtRixJQURmO0FBRUFxc0IsYUFBUyxDQUNSO0FBQ0N6aEIsWUFBTSxNQURQO0FBRUMwaEIsaUJBQVc7QUFGWixLQURRLENBRlQ7QUFRQUMsU0FBSyxJQVJMO0FBU0E3WSxpQkFBYSxDQUFDLEtBQUQsRUFBUSxPQUFSLENBVGI7QUFVQThZLGtCQUFjLEtBVmQ7QUFXQUMsY0FBVSxLQVhWO0FBWUF6WSxnQkFBWSxFQVpaO0FBYUE0TixVQUFNLEtBYk47QUFjQThLLGVBQVcsSUFkWDtBQWVBQyxlQUFXLElBZlg7QUFnQkFDLG9CQUFnQixVQUFDN1osUUFBRCxFQUFXalcsTUFBWDtBQUNmLFVBQUE5QixHQUFBLEVBQUErSCxLQUFBOztBQUFBLFdBQU9qRyxNQUFQO0FBQ0MsZUFBTztBQUFDc0YsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ0lHOztBREhKVyxjQUFRZ1EsU0FBU2hRLEtBQWpCOztBQUNBLFdBQU9BLEtBQVA7QUFDQyxhQUFBZ1EsWUFBQSxRQUFBL1gsTUFBQStYLFNBQUE4WixJQUFBLFlBQUE3eEIsSUFBbUJqQixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDZ0osa0JBQVFnUSxTQUFTOFosSUFBVCxDQUFjenpCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBTzJKLEtBQVA7QUFDQyxlQUFPO0FBQUNYLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPMlEsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0Y2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcclxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxyXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxyXG5cdG1rZGlycDogXCJeMC4zLjVcIixcclxuXHRcInNwcmludGYtanNcIjogXCJeMS4wLjNcIixcclxufSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZykge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFx0XCJ3ZWl4aW4tcGF5XCI6IFwiXjEuMS43XCJcclxuXHR9LCAnc3RlZWRvczpiYXNlJyk7XHJcbn0iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbycgICAgICAgXHJcblxyXG4vLyBSZXZlcnQgY2hhbmdlIGZyb20gTWV0ZW9yIDEuNi4xIHdobyBzZXQgaWdub3JlVW5kZWZpbmVkOiB0cnVlXHJcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XHJcbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuXHJcblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcclxuXHRcdGlnbm9yZVVuZGVmaW5lZDogZmFsc2UsXHJcblx0fTtcclxuXHJcblx0Y29uc3QgbW9uZ29PcHRpb25TdHIgPSBwcm9jZXNzLmVudi5NT05HT19PUFRJT05TO1xyXG5cdGlmICh0eXBlb2YgbW9uZ29PcHRpb25TdHIgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRjb25zdCBqc29uTW9uZ29PcHRpb25zID0gSlNPTi5wYXJzZShtb25nb09wdGlvblN0cik7XHJcblxyXG5cdFx0bW9uZ29PcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgbW9uZ29PcHRpb25zLCBqc29uTW9uZ29PcHRpb25zKTtcclxuXHR9XHJcblxyXG5cdE1vbmdvLnNldENvbm5lY3Rpb25PcHRpb25zKG1vbmdvT3B0aW9ucyk7XHJcbn1cclxuXHJcblxyXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1blxyXG4iLCJBcnJheS5wcm90b3R5cGUuc29ydEJ5TmFtZSA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcclxuICAgIGlmICghdGhpcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKCFsb2NhbGUpe1xyXG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcclxuICAgIH1cclxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XHJcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcclxuXHRcdHZhciBwMl9zb3J0X25vID0gcDIuc29ydF9ubyB8fCAwO1xyXG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcclxuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXHJcbiAgICAgICAgfWVsc2V7XHJcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcclxuXHRcdH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XHJcbiAgICAgICAgdi5wdXNoKG0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdjtcclxufVxyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIGlmIChmcm9tIDwgMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcclxuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xyXG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcclxufTtcclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTlr7nosaFBcnJheVxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciBnID0gW107XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiaWRcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgZy5wdXNoKHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGc7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maW5kUHJvcGVydHlCeVBLID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciByID0gbnVsbDtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xyXG4gICAgICAgIHZhciBkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHI7XHJcbn0iLCJTdGVlZG9zID1cclxuXHRzZXR0aW5nczoge31cclxuXHRkYjogZGJcclxuXHRzdWJzOiB7fVxyXG5cdGlzUGhvbmVFbmFibGVkOiAtPlxyXG5cdFx0cmV0dXJuICEhTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lXHJcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIGxvY2FsZSktPlxyXG5cdFx0aWYgdHlwZW9mIG51bWJlciA9PSBcIm51bWJlclwiXHJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgIW51bWJlclxyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblxyXG5cdFx0aWYgbnVtYmVyICE9IFwiTmFOXCJcclxuXHRcdFx0dW5sZXNzIGxvY2FsZVxyXG5cdFx0XHRcdGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcclxuXHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXHJcblx0XHRcdFx0IyDkuK3mlofkuIfliIbkvY3otKLliqHkurrlkZjnnIvkuI3mg6/vvIzmiYDku6XmlLnkuLrlm73pmYXkuIDmoLfnmoTljYPliIbkvY1cclxuXHRcdFx0XHRyZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gXCJcIlxyXG5cdHZhbGlKcXVlcnlTeW1ib2xzOiAoc3RyKS0+XHJcblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXHJcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXHJcblx0XHRyZXR1cm4gcmVnLnRlc3Qoc3RyKVxyXG5cclxuIyMjXHJcbiMgS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXHJcbiMgQG5hbWVzcGFjZSBTdGVlZG9zXHJcbiMjI1xyXG5cclxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxyXG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXHJcblx0cmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XHJcblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxyXG5cdFx0aWYgYWNjb3VudEJnQm9keVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXHJcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXHJcblx0XHRpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXHJcblx0XHRcdGlmIHVybCA9PSBhdmF0YXJcclxuXHRcdFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIGF2YXRhclVybCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDov5nph4zkuI3lj6/ku6XnlKhTdGVlZG9zLmFic29sdXRlVXJs77yM5Zug5Li6YXBw5Lit6KaB5LuO5pys5Zyw5oqT5Y+W6LWE5rqQ5Y+v5Lul5Yqg5b+r6YCf5bqm5bm26IqC57qm5rWB6YePXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tpZiBNZXRlb3IuaXNDb3Jkb3ZhIHRoZW4gdXJsIGVsc2UgTWV0ZW9yLmFic29sdXRlVXJsKHVybCl9KVwiXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg6L+Z6YeM5LiN5Y+v5Lul55SoU3RlZWRvcy5hYnNvbHV0ZVVybO+8jOWboOS4umFwcOS4reimgeS7juacrOWcsOaKk+WPlui1hOa6kOWPr+S7peWKoOW/q+mAn+W6puW5tuiKgue6pua1gemHj1xyXG5cdFx0XHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXHJcblx0XHRcdGlmIGJhY2tncm91bmRcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje2lmIE1ldGVvci5pc0NvcmRvdmEgdGhlbiBiYWNrZ3JvdW5kIGVsc2UgTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tpZiBNZXRlb3IuaXNDb3Jkb3ZhIHRoZW4gYmFja2dyb3VuZCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcclxuXHJcblx0XHRpZiBpc05lZWRUb0xvY2FsXHJcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsYXZhdGFyKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInNraW5cIn0pXHJcblx0XHRpZiBhY2NvdW50U2tpblxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxyXG5cdFx0aWYgYWNjb3VudFpvb21cclxuXHRcdFx0cmV0dXJuIGFjY291bnRab29tLnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XHJcblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XHJcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XHJcblx0XHR6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0em9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemVcclxuXHRcdHVubGVzcyB6b29tTmFtZVxyXG5cdFx0XHR6b29tTmFtZSA9IFwibGFyZ2VcIlxyXG5cdFx0XHR6b29tU2l6ZSA9IDEuMlxyXG5cdFx0aWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxyXG5cdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcclxuXHRcdFx0IyBpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcclxuXHRcdFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxyXG5cdFx0XHQjIFx0XHR6b29tU2l6ZSA9IDBcclxuXHRcdFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcclxuXHRcdFx0IyBlbHNlXHJcblx0XHRcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcclxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcclxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRab29tVmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIixhY2NvdW50Wm9vbVZhbHVlLm5hbWUpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcclxuXHJcblx0U3RlZWRvcy5zaG93SGVscCA9ICh1cmwpLT5cclxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcclxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXHJcblxyXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXHJcblxyXG5cdFx0d2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxyXG5cclxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cclxuXHRcdGF1dGhUb2tlbiA9IHt9O1xyXG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXHJcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XHJcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xyXG5cclxuXHRcdGxpbmtlciA9IFwiP1wiXHJcblxyXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0bGlua2VyID0gXCImXCJcclxuXHJcblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXHJcblxyXG5cdFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gKGFwcF9pZCktPlxyXG5cdFx0YXV0aFRva2VuID0ge307XHJcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcclxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcclxuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XHJcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxyXG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXHJcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIHVybFxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblxyXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXHJcblx0XHRlbHNlXHJcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xyXG5cclxuXHRTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSAodXJsKS0+XHJcblx0XHRpZiB1cmxcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXHJcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXHJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XHJcblx0XHRcdFx0XHRpZiBlcnJvclxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3JcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcclxuXHJcblx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluID0gKHJlZGlyZWN0KS0+XHRcclxuXHRcdGFjY291bnRzVXJsID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmFjY291bnRzPy51cmxcclxuXHRcdGlmIGFjY291bnRzVXJsIFxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24uaHJlZiA9IGFjY291bnRzVXJsICsgXCIvYXV0aG9yaXplP3JlZGlyZWN0X3VyaT0vXCI7XHJcblx0XHRlbHNlXHJcblx0XHRcdHNpZ25JblVybCA9IEFjY291bnRzVGVtcGxhdGVzLmdldFJvdXRlUGF0aChcInNpZ25JblwiKVxyXG5cdFx0XHRpZiByZWRpcmVjdFxyXG5cdFx0XHRcdGlmIHNpZ25JblVybC5pbmRleE9mKFwiP1wiKSA+IDBcclxuXHRcdFx0XHRcdHNpZ25JblVybCArPSBcIiZyZWRpcmVjdD0je3JlZGlyZWN0fVwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0c2lnbkluVXJsICs9IFwiP3JlZGlyZWN0PSN7cmVkaXJlY3R9XCJcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyBzaWduSW5VcmxcclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxyXG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxyXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblx0XHRpZiAhYXBwXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3JcclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcclxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXHJcblx0XHQjIFx0cmVnID0gL1xcLyQvXHJcblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxyXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXHJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxyXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblx0XHQjIFx0cmV0dXJuXHJcblxyXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcclxuXHRcdGlmIGFwcC5pc191c2VfaWVcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdGlmIG9uX2NsaWNrXHJcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxyXG5cclxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcclxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcclxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcclxuXHJcblx0XHRlbHNlIGlmIG9uX2NsaWNrXHJcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXHJcblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xyXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cclxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0bWluX21vbnRocyA9IDFcclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0bWluX21vbnRocyA9IDNcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXHJcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxyXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xyXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXHJcblxyXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XHJcblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xyXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHR3aGVuICdub3JtYWwnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxyXG5cdFx0XHR3aGVuICdsYXJnZSdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC02XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XHJcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xyXG5cclxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXHJcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxyXG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcclxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXHJcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblxyXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XHJcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcclxuXHJcblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cclxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcclxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcclxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XHJcblx0XHRpZiBvZmZzZXRcclxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcclxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xyXG5cclxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cclxuXHRcdERFVklDRSA9XHJcblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xyXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcclxuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXHJcblx0XHRcdGlwYWQ6ICdpcGFkJ1xyXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXHJcblx0XHRcdGlwb2Q6ICdpcG9kJ1xyXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXHJcblx0XHRicm93c2VyID0ge31cclxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xyXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXHJcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcclxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2VcclxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXHJcblx0XHRcdCcnXHJcblx0XHRcdERFVklDRS5kZXNrdG9wXHJcblx0XHRdXHJcblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxyXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcclxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXHJcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXHJcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xyXG5cclxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGlmIGlmclxyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXHJcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxyXG5cdFx0XHRpZnIubG9hZCAtPlxyXG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5JylcclxuXHRcdFx0XHRpZiBpZnJCb2R5XHJcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxyXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXHJcblxyXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRjaGVjayA9IGZhbHNlXHJcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcclxuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXHJcblx0XHRcdGNoZWNrID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGNoZWNrXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxyXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXHJcblx0XHRwYXJlbnRzID0gW11cclxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XHJcblx0XHRcdGlmIG9yZy5wYXJlbnRzXHJcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xyXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxyXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXHJcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcclxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRpID0gMFxyXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcclxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRpKytcclxuXHRcdHJldHVybiBpc09yZ0FkbWluXHJcblxyXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XHJcblx0XHRpZiB1cmxcclxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxyXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXHJcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXHJcblx0XHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHJcblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xyXG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cclxuXHJcblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcclxuXHJcblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcclxuXHJcblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXHJcblxyXG5cdFx0XHRpZiByZXN1bHQuZXJyb3JcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHVzZXJcclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxyXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XHJcblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cclxuXHRcdHRyeVxyXG5cdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcclxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdGtleTMyID0ga2V5ICsgY1xyXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxyXG5cclxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxyXG5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXHJcblxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRyZXR1cm4gdXNlcklkXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cclxuXHJcblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcclxuXHRcdFx0aWYgb2JqXHJcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xyXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxyXG5cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XHJcblx0XHR0cnlcclxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxyXG5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cclxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xyXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcclxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XHJcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxyXG5cclxubWl4aW4gPSAob2JqKSAtPlxyXG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cclxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XHJcblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXHJcblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cclxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXHJcblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXHJcblxyXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXHJcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxyXG5cdFx0aWYgIWRhdGVcclxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXHJcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xyXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XHJcblx0XHRcdGlmIGkgPCBkYXlzXHJcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcclxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxyXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcclxuXHJcblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7RcclxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xyXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcclxuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcclxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxyXG5cclxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxyXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXHJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXHJcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXHJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxyXG5cclxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cclxuXHRcdGogPSAwXHJcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXHJcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IDBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcclxuXHRcdFx0XHRqID0gbGVuLzJcclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxyXG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXHJcblxyXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXHJcblx0XHRcdFx0XHRicmVha1xyXG5cclxuXHRcdFx0XHRpKytcclxuXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gaSArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcclxuXHJcblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcclxuXHJcblx0XHRpZiBqID4gbWF4X2luZGV4XHJcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXHJcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcclxuXHJcblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXHJcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cclxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxyXG5cdFx0XHRpZiBhcHBcclxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblxyXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXHJcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXHJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxyXG5cclxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXHJcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxyXG5cdFx0XHRpZiBpc0kxOG5cclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRcdFx0cmV0dXJuIGxvY2FsZVxyXG5cclxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cclxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXHJcblxyXG5cclxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cclxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxyXG5cdFx0XHR2YWxpZCA9IHRydWVcclxuXHRcdFx0dW5sZXNzIHB3ZFxyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdGlmIHB3ZC5sZW5ndGggPCA4XHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHRpZiB2YWxpZFxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XHJcblx0XHRcdFx0XHRyZWFzb246IHJlYXNvblxyXG5cclxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIilcclxuXHJcbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XHJcblx0ZGJBcHBzID0ge31cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mb3JFYWNoIChhcHApLT5cclxuXHRcdGRiQXBwc1thcHAuX2lkXSA9IGFwcFxyXG5cclxuXHRyZXR1cm4gZGJBcHBzXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHRTdGVlZG9zLmdldEF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblx0XHRpZiAhYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09ICdCZWFyZXInXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxyXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxyXG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcclxuI1x0XHRlbHNlXHJcbiNcdFx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGN1cnJlbnRfYXBwX2lkLi4uJyk7XHJcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXHJcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XHJcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIG1peGluOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgbG9jYWxlKSB7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoIWxvY2FsZSkge1xuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpO1xuICAgICAgfVxuICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PT0gXCJ6aC1DTlwiKSB7XG4gICAgICAgIHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIGF2YXRhclVybCwgYmFja2dyb3VuZCwgcmVmLCByZWYxLCByZWYyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChhY2NvdW50QmdCb2R5VmFsdWUudXJsKSB7XG4gICAgICBpZiAodXJsID09PSBhdmF0YXIpIHtcbiAgICAgICAgYXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXI7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChNZXRlb3IuaXNDb3Jkb3ZhID8gYXZhdGFyVXJsIDogTWV0ZW9yLmFic29sdXRlVXJsKGF2YXRhclVybCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyB1cmwgOiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKSkgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tncm91bmQgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYWRtaW4pICE9IG51bGwgPyByZWYyLmJhY2tncm91bmQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYmFja2dyb3VuZCkge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGJhY2tncm91bmQgOiBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGJhY2tncm91bmQgOiBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluID0gZnVuY3Rpb24ocmVkaXJlY3QpIHtcbiAgICB2YXIgYWNjb3VudHNVcmwsIHJlZiwgcmVmMSwgcmVmMiwgc2lnbkluVXJsO1xuICAgIGFjY291bnRzVXJsID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLndlYnNlcnZpY2VzKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFjY291bnRzKSAhPSBudWxsID8gcmVmMi51cmwgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaWYgKGFjY291bnRzVXJsKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSBhY2NvdW50c1VybCArIFwiL2F1dGhvcml6ZT9yZWRpcmVjdF91cmk9L1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaWduSW5VcmwgPSBBY2NvdW50c1RlbXBsYXRlcy5nZXRSb3V0ZVBhdGgoXCJzaWduSW5cIik7XG4gICAgICBpZiAocmVkaXJlY3QpIHtcbiAgICAgICAgaWYgKHNpZ25JblVybC5pbmRleE9mKFwiP1wiKSA+IDApIHtcbiAgICAgICAgICBzaWduSW5VcmwgKz0gXCImcmVkaXJlY3Q9XCIgKyByZWRpcmVjdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaWduSW5VcmwgKz0gXCI/cmVkaXJlY3Q9XCIgKyByZWRpcmVjdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIEZsb3dSb3V0ZXIuZ28oc2lnbkluVXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZiA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWYyID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjNbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWZbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjIuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYzID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZiwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWYudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHJlYXNvbiwgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIS9cXGQrLy50ZXN0KHB3ZCkpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghL1thLXpBLVpdKy8udGVzdChwd2QpKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAocHdkLmxlbmd0aCA8IDgpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XHJcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICBNZXRlb3IubWV0aG9kc1xyXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxyXG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVzaDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRzZXQ6IFxyXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxyXG4gICAgICAgICAgICBlbWFpbHM6IFtcclxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxyXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgICAgICAgICBdXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcclxuICAgICAgICBwID0gbnVsbFxyXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxyXG4gICAgICAgICAgICBwID0gZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVsbDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgcFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcclxuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxyXG5cclxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXHJcbiAgICAgICAgJHNldDpcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgICBlbWFpbDogZW1haWxcclxuXHJcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICByZXR1cm4ge31cclxuXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cclxuICAgICAgICBzd2FsXHJcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXHJcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcclxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcclxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxyXG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcclxuIyMjXHJcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XHJcblxyXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcclxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xyXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxyXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XHJcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IubWV0aG9kc1xyXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XHJcbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XHJcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XHJcblx0fSkoKSxcclxuXHRyZXNldFBhc3N3b3JkOiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XHJcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR2ZXJpZnlFbWFpbDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5yb2xsQWNjb3VudDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXHJcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gIFxyXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcclxuXHRpZiAob3Jncy5jb3VudCgpPjApXHJcblx0e1xyXG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxyXG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fVx0XHJcblxyXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xyXG4gICAgXHRkYXRhOiB7XHJcblx0ICAgICAgXHRyZXQ6IDAsXHJcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcclxuICAgIFx0fVxyXG4gIFx0fSk7XHJcbn0pO1xyXG5cclxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxyXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XHJcbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXHJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXHJcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcclxuXHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxyXG5cdFx0c3BhY2VzID0gW11cclxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cclxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cclxuXHRpY29uOiBcImdsb2JlXCJcclxuXHRjb2xvcjogXCJibHVlXCJcclxuXHR0YWJsZUNvbHVtbnM6IFtcclxuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcclxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXHJcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxyXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcclxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxyXG5cdF1cclxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxyXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXHJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXHJcblx0c2hvd0RlbENvbHVtbjogZmFsc2VcclxuXHRkaXNhYmxlQWRkOiB0cnVlXHJcblx0cGFnZUxlbmd0aDogMTAwXHJcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcclxuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcclxuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXHJcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXHJcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xyXG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XHJcbiAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xyXG4gICAgdmFyIGs7XHJcbiAgICBpZiAobiA+PSAwKSB7XHJcbiAgICAgIGsgPSBuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IGxlbiArIG47XHJcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcclxuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufSIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuXHJcbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcclxuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxyXG4gICAgICB3d3c6IFxyXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcclxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cclxuXHRsaXN0Vmlld3MgPSB7fVxyXG5cclxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXHJcblxyXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cclxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblxyXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxyXG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcclxuXHJcblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cclxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcclxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxyXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBsaXN0Vmlld3NcclxuXHJcblxyXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxyXG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cclxuXHJcblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcclxuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xyXG5cclxuXHJcblxyXG5cclxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIlNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XHJcblxyXG4gIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcclxuICB9O1xyXG4gIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBDb2xsZWN0aW9uLmRlbnkoe1xyXG4gICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXHJcbiAgdmFyIGFwaSA9IHtcclxuICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcclxuICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcclxuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcclxuICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xyXG4gICAgfSxcclxuICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XHJcbiAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcblxyXG4gICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuXHJcbiAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xyXG4gICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xyXG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xyXG4gICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG4gICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcclxuICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xyXG4gICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xyXG5cclxuICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xyXG4gICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRlb3IubWV0aG9kcyh7XHJcbiAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcclxuICAgICAgfSxcclxuICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XHJcblxyXG4gICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcclxuICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7ICBcclxuXHJcbiAgICAvLyBzZXJ2ZXItb25seSBhcGlcclxuICAgIF8uZXh0ZW5kKGFwaSwge1xyXG4gICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xyXG4gICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXBpO1xyXG59KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcclxuXHJcblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXHJcblxyXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxyXG5cdFx0XHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXHJcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxyXG5cclxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcclxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblxyXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcclxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cclxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcclxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxyXG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cclxuXHRcclxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG4gICAgICAgIGlmIHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG4gICAgICAgICMgdGhlbiBjaGVjayBjb29raWVcclxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuICAgICAgICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLCBcclxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcclxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cclxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogW107XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge30iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXHJcblx0aWYgYXBwXHJcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcclxuXHRlbHNlXHJcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXHJcblxyXG5cdGlmICFyZWRpcmVjdFVybFxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuXHQjIGlmIHJlcS5ib2R5XHJcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHQjIGRlcy1jYmNcclxuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXHJcblx0XHRcdGtleTggPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDhcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDggLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXHJcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxyXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXHJcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0am9pbmVyID0gXCI/XCJcclxuXHJcblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxyXG5cclxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRyZXMuZW5kKClcclxuXHRyZXR1cm5cclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHQjIHRoaXMucGFyYW1zID1cclxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxyXG5cdFx0d2lkdGggPSA1MCA7XHJcblx0XHRoZWlnaHQgPSA1MCA7XHJcblx0XHRmb250U2l6ZSA9IDI4IDtcclxuXHRcdGlmIHJlcS5xdWVyeS53XHJcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XHJcblx0XHRpZiByZXEucXVlcnkuaFxyXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcclxuXHRcdGlmIHJlcS5xdWVyeS5mc1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XHJcblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XHJcblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxyXG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxyXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcclxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcclxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcclxuXHRcdGlmICF1c2VybmFtZVxyXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxyXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcclxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cclxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxyXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cclxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcclxuXHJcblx0XHRcdGluaXRpYWxzID0gJydcclxuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cclxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XHJcblx0XHRcdFx0PC90ZXh0PlxyXG5cdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cclxuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XHJcblx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXHJcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcclxuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cclxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cclxuICAgICAgICBpZiBzcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcclxuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcclxuXHJcblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xyXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxyXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblx0XHR1c2VyU3BhY2VzID0gW11cclxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcclxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cclxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxyXG5cclxuXHRcdGhhbmRsZTIgPSBudWxsXHJcblxyXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXHJcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcclxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0aWYgZG9jLnNwYWNlXHJcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcclxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcclxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXHJcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXHJcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxyXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XHJcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xyXG5cclxuXHRcdHNlbGYucmVhZHkoKTtcclxuXHJcblx0XHRzZWxmLm9uU3RvcCAtPlxyXG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXHJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxyXG5cdHVubGVzcyBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0dW5sZXNzIF9pZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJzdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwocmVxLCByZXMsIG5leHQpLT5cclxuXHR1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuXHRzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucGFyYW1zPy5zcGFjZUlkXHJcblx0aWYgIXVzZXJJZFxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogNDAzLFxyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0VVNFUl9DT05URVhUID0gQ3JlYXRvci5nZXRVc2VyQ29udGV4dCh1c2VySWQsIHNwYWNlSWQsIHRydWUpXHJcblx0dW5sZXNzIFVTRVJfQ09OVEVYVFxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogNTAwLFxyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHtuYW1lOiAxfX0pXHJcblxyXG5cdHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKVxyXG5cdHJlc3VsdC5VU0VSX0NPTlRFWFQgPSBVU0VSX0NPTlRFWFRcclxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxyXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQgQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCksIENyZWF0b3IuQXBwc1xyXG5cdHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKVxyXG5cdHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwgJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkXHJcblxyXG5cdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cclxuXHR1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpLT5cclxuXHRcdFx0c3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHRcdCkoYXV0aFRva2VuLCBzcGFjZUlkKVxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxyXG5cdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXHJcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcclxuXHRcdFx0Xy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCAodiwgayktPlxyXG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3Qodi50b0NvbmZpZygpKVxyXG4jXHRcdFx0XHRfb2JqLm5hbWUgPSBcIiN7bmFtZX0uI3trfVwiXHJcblx0XHRcdFx0X29iai5uYW1lID0ga1xyXG5cdFx0XHRcdF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWVcclxuXHRcdFx0XHRfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pXHJcblx0XHRcdFx0cmVzdWx0Lm9iamVjdHNbX29iai5uYW1lXSA9IF9vYmpcclxuXHRcdFx0KVxyXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XHJcblx0XHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIHJlc3VsdC5hcHBzLCBkYXRhc291cmNlLmdldEFwcHNDb25maWcoKVxyXG5cclxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0Y29kZTogMjAwLFxyXG5cdFx0ZGF0YTogcmVzdWx0XHJcbiIsInZhciBzdGVlZG9zQXV0aDtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIFVTRVJfQ09OVEVYVCwgYXV0aFRva2VuLCBwZXJtaXNzaW9ucywgcmVmLCByZXN1bHQsIHNwYWNlLCBzcGFjZUlkLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ107XG4gIHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDMsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIFVTRVJfQ09OVEVYVCA9IENyZWF0b3IuZ2V0VXNlckNvbnRleHQodXNlcklkLCBzcGFjZUlkLCB0cnVlKTtcbiAgaWYgKCFVU0VSX0NPTlRFWFQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA1MDAsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgbmFtZTogMVxuICAgIH1cbiAgfSk7XG4gIHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcbiAgcmVzdWx0LlVTRVJfQ09OVEVYVCA9IFVTRVJfQ09OVEVYVDtcbiAgcmVzdWx0LnNwYWNlID0gc3BhY2U7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQoQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCksIENyZWF0b3IuQXBwcyk7XG4gIHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCgnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWQpO1xuICBhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcyk7XG4gIHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbihhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKSB7XG4gICAgcmV0dXJuIHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pKGF1dGhUb2tlbiwgc3BhY2VJZCk7XG4gIHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbih2LCB1c2VyU2Vzc2lvbiwgY2IpIHtcbiAgICByZXR1cm4gdi5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIGRhdGFzb3VyY2VPYmplY3RzO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKCk7XG4gICAgICByZXR1cm4gXy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHZhciBfb2JqO1xuICAgICAgICBfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KHYudG9Db25maWcoKSk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJldHVybiByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKHJlc3VsdC5hcHBzLCBkYXRhc291cmNlLmdldEFwcHNDb25maWcoKSk7XG4gIH0pO1xuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRib2R5ID0gXCJcIlxyXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XHJcblx0XHRcdGJvZHkgKz0gY2h1bmtcclxuXHRcdClcclxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxyXG5cdFx0XHRcdHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpXHJcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxyXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0IyDnibnliKvmj5DphpLvvJrllYbmiLfns7vnu5/lr7nkuo7mlK/ku5jnu5PmnpzpgJrnn6XnmoTlhoXlrrnkuIDlrpropoHlgZrnrb7lkI3pqozor4Es5bm25qCh6aqM6L+U5Zue55qE6K6i5Y2V6YeR6aKd5piv5ZCm5LiO5ZWG5oi35L6n55qE6K6i5Y2V6YeR6aKd5LiA6Ie077yM6Ziy5q2i5pWw5o2u5rOE5ryP5a+86Ie05Ye6546w4oCc5YGH6YCa55+l4oCd77yM6YCg5oiQ6LWE6YeR5o2f5aSxXHJcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRcdFx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXHJcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcclxuXHRcdFx0XHRcdFx0Y29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWRcclxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxyXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXHJcblx0XHRcdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe19pZDogY29kZV91cmxfaWR9LCB7JHNldDoge3BhaWQ6IHRydWV9fSlcclxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpLCAoZXJyKS0+XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnXHJcblx0XHRcdClcclxuXHRcdClcclxuXHRcdFxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXHJcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcclxuXHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cclxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XHJcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcclxuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXHJcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXHJcblx0XHRyZVZhbHVlID1cclxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdGlzTGltaXQgPSBmYWxzZVxyXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcclxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcclxuXHJcblx0XHRpZiBsaW1pdHMubGVuZ3RoXHJcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdFx0XHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cclxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xyXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcclxuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3NcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xyXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXHJcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcclxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXHJcblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxyXG5cclxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcclxuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcclxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcclxuXHJcblx0XHRpZiBpc0xpbWl0XHJcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxyXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxyXG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXHJcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cclxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcclxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblx0XHRyZXR1cm4gcmVWYWx1ZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcclxuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xyXG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xyXG5cclxuICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xyXG4gICAgICAgIG9iai5rZXkgPSBrZXk7XHJcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgIH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGMgPiAwKSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSkiLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XHJcblx0XHRjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpXHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHJcblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRpZiBzcGFjZV9pZFxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGVsc2VcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRyZXN1bHQgPSBbXVxyXG5cdFx0c3BhY2VzLmZvckVhY2ggKHMpIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGUgPSB7fVxyXG5cdFx0XHRcdGUuX2lkID0gcy5faWRcclxuXHRcdFx0XHRlLm5hbWUgPSBzLm5hbWVcclxuXHRcdFx0XHRlLmVyciA9IGVyclxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcclxuXHRcdGlmIHJlc3VsdC5sZW5ndGggPiAwXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbFxyXG5cdFx0XHRcdEVtYWlsLnNlbmRcclxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcclxuXHRcdFx0XHRcdGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb21cclxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcclxuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXHJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcclxuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xyXG5cclxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxyXG5cclxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXHJcblxyXG5cdFx0dW5sZXNzIHVzZXJfaWRcclxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxyXG5cclxuXHRcdHJldHVybiB1c2VybmFtZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXHJcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxyXG5cdFx0Y2hlY2sgZW5kX2RhdGUsIFN0cmluZyBcclxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcclxuXHJcblx0XHR1c2VyX2lkID0gdGhpcy51c2VySWRcclxuXHJcblx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0b3JkZXJfYm9keSA9IFtdXHJcblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XHJcblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXHJcblx0XHRcdG9yZGVyX2JvZHkucHVzaCBtLm5hbWVfemhcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgbm90IHNwYWNlLmlzX3BhaWRcclxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXHJcblx0XHRcdGlmIHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuKjEwMFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxyXG5cclxuXHRcdHJlc3VsdF9vYmogPSB7fVxyXG5cclxuXHRcdGF0dGFjaCA9IHt9XHJcblx0XHRhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWRcclxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblxyXG5cdFx0d3hwYXkgPSBXWFBheSh7XHJcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXHJcblx0XHR9KVxyXG5cclxuXHRcdHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XHJcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXHJcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHR0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcclxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXHJcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXHJcblx0XHRcdHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxyXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXHJcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxyXG5cdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKGVyciwgcmVzdWx0KSAtPiBcclxuXHRcdFx0XHRpZiBlcnIgXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xyXG5cdFx0XHRcdGlmIHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqID0ge31cclxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcclxuXHRcdFx0XHRcdG9iai5jcmVhdGVkID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XHJcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKVxyXG5cdFx0XHQpLCAoKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50J1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblxyXG5cdFx0XHJcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xyXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXHJcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcclxuXHJcblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcclxuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xyXG5cclxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXHJcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcclxuXHJcbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xyXG4gICAgICAgICAgICBfaWQ6IHtcclxuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHJcbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcclxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxyXG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxyXG4gICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcclxuICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcclxuICAgICAgICAgICAgaWYgcGVybXNcclxuICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXHJcbiAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXHJcblxyXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBwZXJtczogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgIGlmIChwZXJtcykge1xuICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cclxuXHJcbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXHJcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XHJcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cclxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0Y291bnRfZGF5cyA9IDBcclxuXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxyXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxyXG5cclxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxyXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXHJcblxyXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcclxuXHRcdCMgZG8gbm90aGluZ1xyXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cclxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxyXG5cclxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cclxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cclxuXHRsYXN0X2JpbGwgPSBudWxsXHJcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcclxuXHJcblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcclxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGNyZWF0ZWQ6IHtcclxuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdClcclxuXHRpZiBwYXltZW50X2JpbGxcclxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxyXG5cdGVsc2VcclxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXHJcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHJcblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdGlmIGFwcF9iaWxsXHJcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXHJcblxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXHJcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxyXG5cdHNldE9iaiA9IG5ldyBPYmplY3RcclxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxyXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcclxuXHJcbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XHJcblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcclxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHJcblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxyXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHR7XHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XHJcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XHJcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXHJcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcclxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XHJcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcclxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2VcclxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xyXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XHJcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cclxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxyXG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcclxuXHRkYi5iaWxsaW5ncy5maW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XHJcblx0XHR9XHJcblx0KS5mb3JFYWNoIChiaWxsKS0+XHJcblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxyXG5cclxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cclxuXHRtb2R1bGVzID0gbmV3IEFycmF5XHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXHJcblxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cclxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXHJcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcclxuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3JlYXRlZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcclxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xyXG5cdFx0XHQjICBkbyBub3RoaW5nXHJcblxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcclxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXHJcblxyXG5cdHJldHVybiBtb2R1bGVzXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxyXG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cclxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcclxuXHQpXHJcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxyXG5cclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXHJcblx0XHRyZXR1cm5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGRlYml0cyA9IDBcclxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdCkuZm9yRWFjaCgoYiktPlxyXG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcclxuXHRcdClcclxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcclxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXHJcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxyXG5cdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0aWYgZGViaXRzID4gMFxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXHJcblxyXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdGVsc2VcclxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxyXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcclxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxyXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXHJcblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcclxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cclxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcclxuXHJcblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHJcblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XHJcblxyXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcclxuXHJcblx0bSA9IG1vbWVudCgpXHJcblx0bm93ID0gbS5fZFxyXG5cclxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxyXG5cclxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXHJcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXHJcblxyXG5cdCMg5pu05pawbW9kdWxlc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcclxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXHJcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxyXG5cclxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXHJcblx0aWYgclxyXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XHJcblx0XHRcdG1jbCA9IG5ldyBPYmplY3RcclxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcclxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxyXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcclxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxyXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xyXG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcclxuXHJcblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcclxuXHJcbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XHJcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcclxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcclxuXHJcbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghZ29fbmV4dClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xyXG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXHJcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcclxuICAgICAgICByZXR1cm4gZGF0ZWtleTtcclxuICAgICAgfTtcclxuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XHJcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XHJcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcclxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXHJcbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5p+l6K+i5oC75pWwXHJcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xyXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cclxuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xyXG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxyXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xyXG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XHJcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcclxuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXHJcbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xyXG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcclxuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcclxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XHJcbiAgICAgICAgICByZXR1cm4gbW9kO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cclxuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XHJcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xyXG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcclxuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSkgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xyXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcclxuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xyXG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxyXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XHJcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXHJcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXHJcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXHJcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICBzdGVlZG9zOntcclxuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxyXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxyXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHdvcmtmbG93OntcclxuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNtczoge1xyXG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xyXG5cclxuICAgICAgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcclxuICAgIH0pKTtcclxuXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDFcclxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcclxuICAgICAgICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaSsrXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAyXHJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAzXHJcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDRcclxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDVcclxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdFx0dHJ5XHJcblxyXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxyXG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXHJcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXHJcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cclxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcclxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXHJcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdE1pZ3JhdGlvbnMuYWRkXHJcblx0XHR2ZXJzaW9uOiA2XHJcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcclxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovmoIflh4bniYhcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcclxuXHRcdFx0XHR9KVxyXG5cclxuXHJcblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxyXG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XHJcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2VcclxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXHJcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cclxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcclxuXHJcblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcclxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcclxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRkb3duOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovmoIflh4bniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5taWdyYXRlVG8gJ2xhdGVzdCdcclxuXHQjIE1ldGVvci5kZWZlciAtPlxyXG5cdCMgXHRpZiBNaWdyYXRpb25zLmdldFZlcnNpb24oKSBpc250IDBcclxuXHQjIFx0XHRNaWdyYXRpb25zLm1pZ3JhdGVUbyAnbGF0ZXN0J1xyXG5cdCMgXHRlbHNlXHJcblx0IyBcdFx0Y29udHJvbCA9IE1pZ3JhdGlvbnMuX2dldENvbnRyb2woKVxyXG5cdCMgXHRcdGNvbnRyb2wudmVyc2lvbiA9IF8ubGFzdChNaWdyYXRpb25zLl9saXN0KS52ZXJzaW9uXHJcblx0IyBcdFx0TWlncmF0aW9ucy5fc2V0Q29udHJvbCBjb250cm9sXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5taWdyYXRlVG8oJ2xhdGVzdCcpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0bmV3IFRhYnVsYXIuVGFibGVcclxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcclxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXHJcblx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdFx0ZG9tOiBcInRwXCJcclxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxyXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxyXG5cdFx0b3JkZXJpbmc6IGZhbHNlXHJcblx0XHRwYWdlTGVuZ3RoOiAxMFxyXG5cdFx0aW5mbzogZmFsc2VcclxuXHRcdHNlYXJjaGluZzogdHJ1ZVxyXG5cdFx0YXV0b1dpZHRoOiB0cnVlXHJcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XHJcblx0XHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2VcclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
