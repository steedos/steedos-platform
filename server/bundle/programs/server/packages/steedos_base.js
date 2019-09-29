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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS90YWJ1bGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvdGFidWxhci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiY29va2llcyIsIm1rZGlycCIsIk1ldGVvciIsInNldHRpbmdzIiwiYmlsbGluZyIsIk1vbmdvIiwiaXNTZXJ2ZXIiLCJtb25nb09wdGlvbnMiLCJpZ25vcmVVbmRlZmluZWQiLCJtb25nb09wdGlvblN0ciIsInByb2Nlc3MiLCJlbnYiLCJNT05HT19PUFRJT05TIiwianNvbk1vbmdvT3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsIk9iamVjdCIsImFzc2lnbiIsInNldENvbm5lY3Rpb25PcHRpb25zIiwiYXV0b3J1biIsIlRyYWNrZXIiLCJBcnJheSIsInByb3RvdHlwZSIsInNvcnRCeU5hbWUiLCJsb2NhbGUiLCJTdGVlZG9zIiwic29ydCIsInAxIiwicDIiLCJwMV9zb3J0X25vIiwic29ydF9ubyIsInAyX3NvcnRfbm8iLCJuYW1lIiwibG9jYWxlQ29tcGFyZSIsImdldFByb3BlcnR5IiwiayIsImZvckVhY2giLCJ0IiwibSIsInB1c2giLCJyZW1vdmUiLCJmcm9tIiwidG8iLCJyZXN0Iiwic2xpY2UiLCJsZW5ndGgiLCJhcHBseSIsImZpbHRlclByb3BlcnR5IiwiaCIsImwiLCJnIiwiZCIsImluY2x1ZGVzIiwidW5kZWZpbmVkIiwiZmluZFByb3BlcnR5QnlQSyIsInIiLCJDb29raWVzIiwiY3J5cHRvIiwibWl4aW4iLCJkYiIsInN1YnMiLCJpc1Bob25lRW5hYmxlZCIsInJlZiIsInJlZjEiLCJwaG9uZSIsIm51bWJlclRvU3RyaW5nIiwibnVtYmVyIiwidG9TdHJpbmciLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJyZWciLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImF2YXRhclVybCIsImJhY2tncm91bmQiLCJyZWYyIiwidXJsIiwibG9nZ2luZ0luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIiQiLCJjc3MiLCJpc0NvcmRvdmEiLCJhYnNvbHV0ZVVybCIsImFkbWluIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJyZWRpcmVjdFRvU2lnbkluIiwicmVkaXJlY3QiLCJhY2NvdW50c1VybCIsInNpZ25JblVybCIsIndlYnNlcnZpY2VzIiwiYWNjb3VudHMiLCJocmVmIiwiQWNjb3VudHNUZW1wbGF0ZXMiLCJnZXRSb3V0ZVBhdGgiLCJGbG93Um91dGVyIiwiZ28iLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJlcnJvcjEiLCJjb25zb2xlIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJpc19wYWlkIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJtYXRjaCIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiXyIsImZsYXR0ZW4iLCJmaW5kIiwiJGluIiwiZmV0Y2giLCJ1bmlvbiIsImZvcmJpZE5vZGVDb250ZXh0bWVudSIsInRhcmdldCIsImlmciIsImRvY3VtZW50IiwiYm9keSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInByZXZlbnREZWZhdWx0IiwibG9hZCIsImlmckJvZHkiLCJjb250ZW50cyIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsInBhc3N3b3JkIiwicmVmMyIsInJlc3VsdCIsInVzZXJuYW1lIiwicXVlcnkiLCJ1c2VycyIsInN0ZWVkb3NfaWQiLCJfY2hlY2tQYXNzd29yZCIsIkVycm9yIiwiY2hlY2tBdXRoVG9rZW4iLCJoZWFkZXJzIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwic3BsaXQiLCJvQXV0aDJTZXJ2ZXIiLCJjb2xsZWN0aW9ucyIsImFjY2Vzc1Rva2VuIiwiZXhwaXJlcyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJBUElBdXRoZW50aWNhdGlvbkNoZWNrIiwiSnNvblJvdXRlcyIsInNlbmRSZXN1bHQiLCJkYXRhIiwiY29kZSIsImZ1bmN0aW9ucyIsImZ1bmMiLCJhcmdzIiwiX3dyYXBwZWQiLCJhcmd1bWVudHMiLCJjYWxsIiwiaXNIb2xpZGF5IiwiZGF0ZSIsImRheSIsImdldERheSIsImNhY3VsYXRlV29ya2luZ1RpbWUiLCJkYXlzIiwiY2FjdWxhdGVEYXRlIiwicGFyYW1fZGF0ZSIsIk51bWJlciIsImdldFRpbWUiLCJjYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSIsIm5leHQiLCJjYWN1bGF0ZWRfZGF0ZSIsImZpcnN0X2RhdGUiLCJqIiwibWF4X2luZGV4Iiwic2Vjb25kX2RhdGUiLCJzdGFydF9kYXRlIiwidGltZV9wb2ludHMiLCJyZW1pbmQiLCJpc0VtcHR5Iiwic2V0SG91cnMiLCJob3VyIiwic2V0TWludXRlcyIsIm1pbnV0ZSIsImV4dGVuZCIsImdldFN0ZWVkb3NUb2tlbiIsImFwcElkIiwibm93Iiwic2VjcmV0Iiwic3RlZWRvc190b2tlbiIsInBhcnNlSW50IiwiaXNJMThuIiwiY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eSIsIiRyZWdleCIsIl9lc2NhcGVSZWdFeHAiLCJ0cmltIiwidmFsaWRhdGVQYXNzd29yZCIsInB3ZCIsInJlYXNvbiIsInZhbGlkIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJyZW1vdmVTcGVjaWFsQ2hhcmFjdGVyIiwiQ3JlYXRvciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldEF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsInN0YXJ0dXAiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZm9yZWlnbl9rZXkiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInJlZmVyZW5jZXMiLCJtZXRob2RzIiwidXBkYXRlVXNlckxhc3RMb2dvbiIsIiRzZXQiLCJsYXN0X2xvZ29uIiwib25Mb2dpbiIsInVzZXJzX2FkZF9lbWFpbCIsImVtYWlsIiwiY291bnQiLCJlbWFpbHMiLCJkaXJlY3QiLCIkcHVzaCIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsInVzZXJzX3JlbW92ZV9lbWFpbCIsInAiLCIkcHVsbCIsInVzZXJzX3ZlcmlmeV9lbWFpbCIsInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsIiwicHJpbWFyeSIsIm11bHRpIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNsb3NlT25Db25maXJtIiwiYW5pbWF0aW9uIiwiaW5wdXRWYWx1ZSIsInVwZGF0ZVVzZXJBdmF0YXIiLCJlbWFpbFRlbXBsYXRlcyIsImRlZmF1bHRGcm9tIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJzcGxpdHMiLCJ0b2tlbkNvZGUiLCJncmVldGluZyIsInByb2ZpbGUiLCJ0b2tlbl9jb2RlIiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiYWRkIiwib3JncyIsImZ1bGxuYW1lIiwiJG5lIiwiY2FsY3VsYXRlRnVsbG5hbWUiLCJyZXQiLCJtc2ciLCJQdXNoIiwiQ29uZmlndXJlIiwic2VuZGVySUQiLCJBTkRST0lEX1NFTkRFUl9JRCIsInNvdW5kIiwidmlicmF0ZSIsImlvcyIsImJhZGdlIiwiY2xlYXJCYWRnZSIsImFsZXJ0IiwiYXBwTmFtZSIsIlNlbGVjdG9yIiwic2VsZWN0b3JDaGVja1NwYWNlQWRtaW4iLCJzZWxlY3RvciIsImlzX2Nsb3VkYWRtaW4iLCJtYXAiLCJuIiwic2VsZWN0b3JDaGVja1NwYWNlIiwidSIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJhZG1pbkNvbmZpZyIsImljb24iLCJjb2xvciIsInRhYmxlQ29sdW1ucyIsImV4dHJhRmllbGRzIiwicm91dGVyQWRtaW4iLCJwYWlkIiwic2hvd0VkaXRDb2x1bW4iLCJzaG93RGVsQ29sdW1uIiwiZGlzYWJsZUFkZCIsInBhZ2VMZW5ndGgiLCJvcmRlciIsInNwYWNlX3VzZXJfc2lnbnMiLCJBZG1pbkNvbmZpZyIsImNvbGxlY3Rpb25zX2FkZCIsInNlYXJjaEVsZW1lbnQiLCJPIiwiY3VycmVudEVsZW1lbnQiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsIlNlcnZlclNlc3Npb24iLCJDb2xsZWN0aW9uIiwiY2hlY2tGb3JLZXkiLCJnZXRTZXNzaW9uVmFsdWUiLCJ2YWx1ZXMiLCJjb25kaXRpb24iLCJkZW55IiwiYXBpIiwibG9nIiwic2Vzc2lvbk9iaiIsImV4cGVjdGVkIiwiaWRlbnRpY2FsIiwiaXNPYmplY3QiLCJpc0VxdWFsIiwic3Vic2NyaWJlIiwib25Db25uZWN0aW9uIiwiY29ubmVjdGlvbiIsImNsaWVudElEIiwiaWQiLCJpbnNlcnQiLCJvbkNsb3NlIiwicHVibGlzaCIsInJhbmRvbVNlZWQiLCJ1cGRhdGVPYmoiLCJuZXdDb25kaXRpb24iLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImZpbGUiLCJ3cml0ZSIsIml0ZW0iLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ0b1VUQ1N0cmluZyIsInJlYWRTdHJlYW0iLCJwaXBlIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsInN0ZWVkb3NBdXRoIiwiVVNFUl9DT05URVhUIiwicGVybWlzc2lvbnMiLCJ1c2VyU2Vzc2lvbiIsImdldFVzZXJDb250ZXh0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJBcHBzIiwib2JqZWN0X2xpc3R2aWV3cyIsIm9iamVjdF93b3JrZmxvd3MiLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImdldFVzZXJPYmplY3RQZXJtaXNzaW9uIiwic3RlZWRvc1NjaGVtYSIsImdldERhdGFTb3VyY2VzIiwiZGF0YXNvdXJjZSIsImRhdGFzb3VyY2VPYmplY3RzIiwiZ2V0T2JqZWN0cyIsIl9vYmoiLCJjb252ZXJ0T2JqZWN0IiwidG9Db25maWciLCJkYXRhYmFzZV9uYW1lIiwiZ2V0QXBwc0NvbmZpZyIsIm9uIiwiY2h1bmsiLCJiaW5kRW52aXJvbm1lbnQiLCJwYXJzZXIiLCJ4bWwyanMiLCJQYXJzZXIiLCJleHBsaWNpdEFycmF5IiwiZXhwbGljaXRSb290IiwicGFyc2VTdHJpbmciLCJlcnIiLCJXWFBheSIsImF0dGFjaCIsImJwciIsImNvZGVfdXJsX2lkIiwic2lnbiIsInd4cGF5IiwiYXBwaWQiLCJtY2hfaWQiLCJwYXJ0bmVyX2tleSIsImNsb25lIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwicyIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJQYWNrYWdlIiwic2VuZCIsInN0cmluZ2lmeSIsInRpbWVFbmQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImJpbGxpbmdfcmVjaGFyZ2UiLCJuZXdfaWQiLCJtb2R1bGVfbmFtZXMiLCJsaXN0cHJpY2VzIiwib25lX21vbnRoX3l1YW4iLCJvcmRlcl9ib2R5IiwicmVzdWx0X29iaiIsInNwYWNlX3VzZXJfY291bnQiLCJsaXN0cHJpY2Vfcm1iIiwibmFtZV96aCIsImNyZWF0ZVVuaWZpZWRPcmRlciIsImpvaW4iLCJvdXRfdHJhZGVfbm8iLCJtb21lbnQiLCJmb3JtYXQiLCJzcGJpbGxfY3JlYXRlX2lwIiwibm90aWZ5X3VybCIsInRyYWRlX3R5cGUiLCJwcm9kdWN0X2lkIiwiaW5mbyIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJjb3VudF9kYXlzIiwiZW5kX2RhdGVfdGltZSIsInN0YXJ0X2RhdGVfdGltZSIsImJpbGxpbmdzIiwidHJhbnNhY3Rpb24iLCJiaWxsaW5nX2RhdGUiLCJnZXREYXRlIiwicmVmcmVzaF9iYWxhbmNlIiwicmVmcmVzaF9kYXRlIiwiYXBwX2JpbGwiLCJiX20iLCJiX21fZCIsImJpbGwiLCJjcmVkaXRzIiwiZGViaXRzIiwibGFzdF9iYWxhbmNlIiwibGFzdF9iaWxsIiwicGF5bWVudF9iaWxsIiwic2V0T2JqIiwiJGx0IiwiYmlsbGluZ19tb250aCIsImJhbGFuY2UiLCJ0b0ZpeGVkIiwiZ2V0X2JhbGFuY2UiLCJtb2R1bGVfbmFtZSIsImxpc3RwcmljZSIsImFjY291bnRpbmdfZGF0ZSIsImFjY291bnRpbmdfZGF0ZV9mb3JtYXQiLCJkYXlzX251bWJlciIsIm5ld19iaWxsIiwiJGx0ZSIsIl9tYWtlTmV3SUQiLCJnZXRTcGFjZVVzZXJDb3VudCIsInJlY2FjdWxhdGVCYWxhbmNlIiwicmVmcmVzaF9kYXRlcyIsInJfZCIsImdldF9tb2R1bGVzIiwibV9jaGFuZ2Vsb2ciLCJtb2R1bGVzX2NoYW5nZWxvZ3MiLCJjaGFuZ2VfZGF0ZSIsIm9wZXJhdGlvbiIsImdldF9tb2R1bGVzX25hbWUiLCJtb2R1bGVzX25hbWUiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsIm9wZXJhdG9yX2lkIiwibmV3X21vZHVsZXMiLCJzcGFjZV91cGRhdGVfb2JqIiwiZGlmZmVyZW5jZSIsIl9kIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJkYXRlRm9ybWF0IiwiZGF0ZWtleSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJ5ZXN0ZXJEYXkiLCJkTm93IiwiZEJlZm9yZSIsImRhaWx5U3RhdGljc0NvdW50Iiwic3RhdGljcyIsIiRndCIsInN0YXRpY3NDb3VudCIsIm93bmVyTmFtZSIsImxhc3RMb2dvbiIsInNVc2VycyIsInNVc2VyIiwibGFzdE1vZGlmaWVkIiwib2JqQXJyIiwibW9kIiwicG9zdHNBdHRhY2htZW50cyIsImF0dFNpemUiLCJzaXplU3VtIiwicG9zdHMiLCJwb3N0IiwiYXR0cyIsImNmcyIsImF0dCIsIm9yaWdpbmFsIiwiZGFpbHlQb3N0c0F0dGFjaG1lbnRzIiwic3RlZWRvc19zdGF0aXN0aWNzIiwic3BhY2VfbmFtZSIsIm93bmVyX25hbWUiLCJzdGVlZG9zIiwid29ya2Zsb3ciLCJmbG93cyIsImZvcm1zIiwiZmxvd19yb2xlcyIsImZsb3dfcG9zaXRpb25zIiwiaW5zdGFuY2VzIiwiaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQiLCJkYWlseV9mbG93cyIsImRhaWx5X2Zvcm1zIiwiZGFpbHlfaW5zdGFuY2VzIiwiY21zIiwic2l0ZXMiLCJjbXNfc2l0ZXMiLCJjbXNfcG9zdHMiLCJwb3N0c19sYXN0X21vZGlmaWVkIiwicG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsImNvbW1lbnRzIiwiY21zX2NvbW1lbnRzIiwiZGFpbHlfc2l0ZXMiLCJkYWlseV9wb3N0cyIsImRhaWx5X2NvbW1lbnRzIiwiZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwicGFyZW50IiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwibW9udGhzIiwic2V0X29iaiIsInBtIiwic2V0TW9udGgiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJzZWFyY2hpbmciLCJhdXRvV2lkdGgiLCJjaGFuZ2VTZWxlY3RvciIsIiRhbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7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Q0MsYUFBQWdRLFlBQUEsUUFBQS9YLE1BQUErWCxTQUFBNlosSUFBQSxZQUFBNXhCLElBQW1CakIsTUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsSUFBNEIsQ0FBNUI7QUFDQ2dKLGtCQUFRZ1EsU0FBUzZaLElBQVQsQ0FBY3h6QixXQUFkLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLENBQVI7QUFGRjtBQ1FJOztBRExKLFdBQU8ySixLQUFQO0FBQ0MsZUFBTztBQUFDWCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBTzJRLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXHJcblx0Y29va2llczogXCJeMC42LjJcIixcclxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJzcHJpbnRmLWpzXCI6IFwiXjEuMC4zXCIsXHJcbn0sICdzdGVlZG9zOmJhc2UnKTtcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcpIHtcclxuXHRjaGVja05wbVZlcnNpb25zKHtcclxuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXHJcblx0fSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG59IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nICAgICAgIFxyXG5cclxuLy8gUmV2ZXJ0IGNoYW5nZSBmcm9tIE1ldGVvciAxLjYuMSB3aG8gc2V0IGlnbm9yZVVuZGVmaW5lZDogdHJ1ZVxyXG4vLyBtb3JlIGluZm9ybWF0aW9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tZXRlb3IvbWV0ZW9yL3B1bGwvOTQ0NFxyXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XHJcblxyXG5cdGxldCBtb25nb09wdGlvbnMgPSB7XHJcblx0XHRpZ25vcmVVbmRlZmluZWQ6IGZhbHNlLFxyXG5cdH07XHJcblxyXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcclxuXHRpZiAodHlwZW9mIG1vbmdvT3B0aW9uU3RyICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0Y29uc3QganNvbk1vbmdvT3B0aW9ucyA9IEpTT04ucGFyc2UobW9uZ29PcHRpb25TdHIpO1xyXG5cclxuXHRcdG1vbmdvT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG1vbmdvT3B0aW9ucywganNvbk1vbmdvT3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRNb25nby5zZXRDb25uZWN0aW9uT3B0aW9ucyhtb25nb09wdGlvbnMpO1xyXG59XHJcblxyXG5cclxuTWV0ZW9yLmF1dG9ydW4gPSBUcmFja2VyLmF1dG9ydW5cclxuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XHJcbiAgICBpZiAoIXRoaXMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZighbG9jYWxlKXtcclxuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNvcnQoZnVuY3Rpb24gKHAxLCBwMikge1xyXG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XHJcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcclxuXHRcdGlmKHAxX3NvcnRfbm8gIT0gcDJfc29ydF9ubyl7XHJcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxyXG4gICAgICAgIH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcDEubmFtZS5sb2NhbGVDb21wYXJlKHAyLm5hbWUsIGxvY2FsZSk7XHJcblx0XHR9XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5BcnJheS5wcm90b3R5cGUuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoaykge1xyXG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRba10gOiBudWxsO1xyXG4gICAgICAgIHYucHVzaChtKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XHJcbiAgICBpZiAoZnJvbSA8IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcclxuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgZyA9IFtdO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcclxuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIl9pZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBsLmluY2x1ZGVzKG0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIGcucHVzaCh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBnO1xyXG59XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq5a+56LGhXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgciA9IG51bGw7XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByO1xyXG59IiwiU3RlZWRvcyA9XHJcblx0c2V0dGluZ3M6IHt9XHJcblx0ZGI6IGRiXHJcblx0c3Viczoge31cclxuXHRpc1Bob25lRW5hYmxlZDogLT5cclxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxyXG5cdG51bWJlclRvU3RyaW5nOiAobnVtYmVyLCBsb2NhbGUpLT5cclxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxyXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxyXG5cclxuXHRcdGlmICFudW1iZXJcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cclxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXHJcblx0XHRcdHVubGVzcyBsb2NhbGVcclxuXHRcdFx0XHRsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcblx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCIgfHwgbG9jYWxlID09IFwiemgtQ05cIlxyXG5cdFx0XHRcdCMg5Lit5paH5LiH5YiG5L2N6LSi5Yqh5Lq65ZGY55yL5LiN5oOv77yM5omA5Lul5pS55Li65Zu96ZmF5LiA5qC355qE5Y2D5YiG5L2NXHJcblx0XHRcdFx0cmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiXCJcclxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxyXG5cdFx0IyByZWcgPSAvXlteIVwiIyQlJicoKSorLC4vOjs8PT4/QFtcXF1eYHt8fX5dKyQvZ1xyXG5cdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKVxyXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcclxuXHJcbiMjI1xyXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxyXG4jIEBuYW1lc3BhY2UgU3RlZWRvc1xyXG4jIyNcclxuXHJcblN0ZWVkb3MuZ2V0SGVscFVybCA9IChsb2NhbGUpLT5cclxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxyXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblxyXG5cdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gKCktPlxyXG5cdFx0c3dhbCh7dGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSwgaHRtbDogdHJ1ZSwgdHlwZTpcIndhcm5pbmdcIiwgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKX0pO1xyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5OlwiYmdfYm9keVwifSlcclxuXHRcdGlmIGFjY291bnRCZ0JvZHlcclxuXHRcdFx0cmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gKGFjY291bnRCZ0JvZHlWYWx1ZSxpc05lZWRUb0xvY2FsKS0+XHJcblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlID0ge31cclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXHJcblxyXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxyXG5cdFx0YXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclxyXG5cdFx0aWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxyXG5cdFx0XHRpZiB1cmwgPT0gYXZhdGFyXHJcblx0XHRcdFx0YXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXJcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje2lmIE1ldGVvci5pc0NvcmRvdmEgdGhlbiBhdmF0YXJVcmwgZWxzZSBNZXRlb3IuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg6L+Z6YeM5LiN5Y+v5Lul55SoU3RlZWRvcy5hYnNvbHV0ZVVybO+8jOWboOS4umFwcOS4reimgeS7juacrOWcsOaKk+WPlui1hOa6kOWPr+S7peWKoOW/q+mAn+W6puW5tuiKgue6pua1gemHj1xyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIHVybCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpfSlcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOi/memHjOS4jeWPr+S7peeUqFN0ZWVkb3MuYWJzb2x1dGVVcmzvvIzlm6DkuLphcHDkuK3opoHku47mnKzlnLDmipPlj5botYTmupDlj6/ku6XliqDlv6vpgJ/luqblubboioLnuqbmtYHph49cclxuXHRcdFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxyXG5cdFx0XHRpZiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tpZiBNZXRlb3IuaXNDb3Jkb3ZhIHRoZW4gYmFja2dyb3VuZCBlbHNlIE1ldGVvci5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7aWYgTWV0ZW9yLmlzQ29yZG92YSB0aGVuIGJhY2tncm91bmQgZWxzZSBNZXRlb3IuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXHJcblxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxyXG5cdFx0aWYgYWNjb3VudFNraW5cclxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcclxuXHRcdGlmIGFjY291bnRab29tXHJcblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xyXG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXHJcblx0XHR1bmxlc3Mgem9vbU5hbWVcclxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcclxuXHRcdFx0em9vbVNpemUgPSAxLjJcclxuXHRcdGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcclxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXHJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcclxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXHJcblx0XHRcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXHJcblx0XHRcdCMgZWxzZVxyXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRpZiBpc05lZWRUb0xvY2FsXHJcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXHJcblxyXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XHJcblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXHJcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxyXG5cclxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxyXG5cclxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcclxuXHJcblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHJcblx0XHRsaW5rZXIgPSBcIj9cIlxyXG5cclxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXHJcblx0XHRcdGxpbmtlciA9IFwiJlwiXHJcblxyXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdGF1dGhUb2tlbiA9IHt9O1xyXG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXHJcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XHJcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xyXG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXHJcblxyXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcclxuXHJcblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcclxuXHJcblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxyXG5cdFx0aWYgdXJsXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcclxuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblxyXG5cdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbiA9IChyZWRpcmVjdCktPlx0XHJcblx0XHRhY2NvdW50c1VybCA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5hY2NvdW50cz8udXJsXHJcblx0XHRpZiBhY2NvdW50c1VybCBcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBhY2NvdW50c1VybCArIFwiL2F1dGhvcml6ZT9yZWRpcmVjdF91cmk9L1wiO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzaWduSW5VcmwgPSBBY2NvdW50c1RlbXBsYXRlcy5nZXRSb3V0ZVBhdGgoXCJzaWduSW5cIilcclxuXHRcdFx0aWYgcmVkaXJlY3RcclxuXHRcdFx0XHRpZiBzaWduSW5VcmwuaW5kZXhPZihcIj9cIikgPiAwXHJcblx0XHRcdFx0XHRzaWduSW5VcmwgKz0gXCImcmVkaXJlY3Q9I3tyZWRpcmVjdH1cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHNpZ25JblVybCArPSBcIj9yZWRpcmVjdD0je3JlZGlyZWN0fVwiXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28gc2lnbkluVXJsXHJcblxyXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cclxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcclxuXHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG5cdFx0aWYgIWFwcFxyXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXHJcblx0XHQjIGlmIGFwcC5faWQgPT0gXCJhZG1pblwiIGFuZCBjcmVhdG9yU2V0dGluZ3M/LnN0YXR1cyA9PSBcImFjdGl2ZVwiXHJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxyXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xyXG5cdFx0IyBcdHVubGVzcyByZWcudGVzdCB1cmxcclxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxyXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcclxuXHRcdCMgXHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxyXG5cdFx0IyBcdHJldHVyblxyXG5cclxuXHRcdG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrXHJcblx0XHRpZiBhcHAuaXNfdXNlX2llXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcclxuXHRcdFx0XHRpZiBvbl9jbGlja1xyXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmxcclxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcclxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cclxuXHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGVsc2UgaWYgZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcclxuXHJcblx0XHRlbHNlIGlmIGFwcC5pc191c2VfaWZyYW1lXHJcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXHJcblx0XHRcdGVsc2UgaWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS8je2FwcC5faWR9XCIpXHJcblxyXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xyXG5cdFx0XHQjIOi/memHjOaJp+ihjOeahOaYr+S4gOS4quS4jeW4puWPguaVsOeahOmXreWMheWHveaVsO+8jOeUqOadpemBv+WFjeWPmOmHj+axoeafk1xyXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRldmFsKGV2YWxGdW5TdHJpbmcpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHJcblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcclxuXHRcdFx0IyDpnIDopoHpgInkuK3lvZPliY1hcHDml7bvvIxvbl9jbGlja+WHveaVsOmHjOimgeWNleeLrOWKoOS4ilNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcclxuXHJcblx0U3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IChzcGFjZUlkKS0+XHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcclxuXHRcdG1pbl9tb250aHMgPSAxXHJcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXHJcblx0XHRcdG1pbl9tb250aHMgPSAzXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXHJcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxyXG5cdFx0aWYgc3BhY2U/LmlzX3BhaWQgYW5kIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcclxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcclxuXHRcdFx0dG9hc3RyLmVycm9yIHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKVxyXG5cclxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxyXG5cdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXHJcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcclxuXHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTEyXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcclxuXHRcdFx0d2hlbiAnbGFyZ2UnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAxOTlcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxyXG5cdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAzMDNcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcclxuXHJcblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxyXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cclxuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAwXHJcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxyXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxyXG5cdFx0XHRcdCQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2ggLT5cclxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxyXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cclxuXHRcdFx0XHRcdGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxyXG5cclxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxyXG5cdFx0XHRcdGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldFxyXG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXHJcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXHJcblxyXG5cdFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSAob2Zmc2V0KS0+XHJcblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XHJcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHQjIGlvc+WPiuaJi+acuuS4iuS4jemcgOimgeS4unpvb23mlL7lpKflip/og73pop3lpJborqHnrpdcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXHJcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0XHR3aGVuICdsYXJnZSdcclxuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXHJcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXHJcblx0XHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXHJcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxyXG5cdFx0aWYgb2Zmc2V0XHJcblx0XHRcdHJlVmFsdWUgLT0gb2Zmc2V0XHJcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcclxuXHJcblx0U3RlZWRvcy5pc2lPUyA9ICh1c2VyQWdlbnQsIGxhbmd1YWdlKS0+XHJcblx0XHRERVZJQ0UgPVxyXG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcclxuXHRcdFx0YmxhY2tiZXJyeTogJ2JsYWNrYmVycnknXHJcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xyXG5cdFx0XHRpcGFkOiAnaXBhZCdcclxuXHRcdFx0aXBob25lOiAnaXBob25lJ1xyXG5cdFx0XHRpcG9kOiAnaXBvZCdcclxuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xyXG5cdFx0YnJvd3NlciA9IHt9XHJcblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcclxuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xyXG5cdFx0dXNlckFnZW50ID0gKHVzZXJBZ2VudCBvciBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpXHJcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXHJcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xyXG5cdFx0XHQnJ1xyXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxyXG5cdFx0XVxyXG5cdFx0YnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV1cclxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoaXNJbmNsdWRlUGFyZW50cyktPlxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcclxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXHJcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xyXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxyXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcclxuXHJcblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cclxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRpZiBpZnJcclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xyXG5cdFx0XHRcdGlmciA9IHRhcmdldC4kKGlmcilcclxuXHRcdFx0aWZyLmxvYWQgLT5cclxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXHJcblx0XHRcdFx0aWYgaWZyQm9keVxyXG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cclxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoc3BhY2VJZCx1c2VySWQsaXNJbmNsdWRlUGFyZW50cyktPlxyXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcclxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXHJcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXHJcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xyXG5cclxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHQjVE9ETyDmt7vliqDmnI3liqHnq6/mmK/lkKbmiYvmnLrnmoTliKTmlq0o5L6d5o2ucmVxdWVzdClcclxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXHJcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxyXG5cclxuXHRTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gKHNwYWNlSWQsYXBwX3ZlcnNpb24pLT5cclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0Y2hlY2sgPSBmYWxzZVxyXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXHJcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxyXG5cdFx0XHRjaGVjayA9IHRydWVcclxuXHRcdHJldHVybiBjaGVja1xyXG5cclxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuaciee7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquimgeaVsOe7hG9yZ0lkc+S4reS7u+S9leS4gOS4que7hOe7h+acieadg+mZkOWwsei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxyXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XHJcblx0XHRpc09yZ0FkbWluID0gZmFsc2VcclxuXHRcdHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjpvcmdJZHN9fSx7ZmllbGRzOntwYXJlbnRzOjEsYWRtaW5zOjF9fSkuZmV0Y2goKVxyXG5cdFx0cGFyZW50cyA9IFtdXHJcblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxyXG5cdFx0XHRpZiBvcmcucGFyZW50c1xyXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcclxuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcclxuXHRcdGlmIGFsbG93QWNjZXNzT3Jncy5sZW5ndGhcclxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBwYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xyXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXHJcblx0XHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcclxuXHRcdHJldHVybiBpc09yZ0FkbWluXHJcblxyXG5cclxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxyXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XHJcblx0XHR1bmxlc3Mgb3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0aSA9IDBcclxuXHRcdHdoaWxlIGkgPCBvcmdJZHMubGVuZ3RoXHJcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXHJcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0aSsrXHJcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxyXG5cclxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxyXG5cdFx0aWYgdXJsXHJcblx0XHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxyXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcclxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxyXG5cdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxyXG5cdFx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcclxuXHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblxyXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcclxuXHRTdGVlZG9zLmdldEFQSUxvZ2luVXNlclx0PSAocmVxLCByZXMpIC0+XHJcblxyXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXHJcblxyXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXHJcblxyXG5cdFx0aWYgdXNlcm5hbWUgJiYgcGFzc3dvcmRcclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcclxuXHJcblx0XHRcdGlmICF1c2VyXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBwYXNzd29yZFxyXG5cclxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcilcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB1c2VyXHJcblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxyXG5cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcclxuXHJcblx0XHRpZiByZXEuaGVhZGVyc1xyXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxyXG5cclxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHQjXHTmo4Dmn6V1c2VySWTjgIFhdXRoVG9rZW7mmK/lkKbmnInmlYhcclxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxyXG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XHJcblx0XHR0cnlcclxuXHRcdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcclxuXHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTMyID0ga2V5ICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxyXG5cclxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0ZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XHJcblx0XHRcdHJldHVybiBwYXNzd29yZDtcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cclxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cclxuXHRcdGtleTMyID0gXCJcIlxyXG5cdFx0bGVuID0ga2V5Lmxlbmd0aFxyXG5cdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcclxuXHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxyXG5cclxuXHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cclxuXHJcblx0XHRpZiAhYWNjZXNzX3Rva2VuXHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cclxuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pXHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxyXG5cclxuXHRcdGlmIHVzZXJcclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xyXG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXHJcblxyXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXHJcblx0XHRcdGlmIG9ialxyXG5cdFx0XHRcdCMg5Yik5patdG9rZW7nmoTmnInmlYjmnJ9cclxuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBub3QgZm91bmQuXCJcclxuXHRcdHJldHVybiBudWxsXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxyXG5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cclxuXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXHJcblxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcclxuXHJcblx0XHRpZiByZXEuaGVhZGVyc1xyXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxyXG5cclxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcclxuXHJcblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxyXG5cdFx0dHJ5XHJcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcclxuXHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcclxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IGUubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHJcbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcclxuIyBleGNlcHQgZm9yIGluY2x1ZGUsIGNvbnRhaW5zLCByZXZlcnNlIGFuZCBqb2luIHRoYXQgYXJlXHJcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxyXG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cclxuXHJcbm1peGluID0gKG9iaikgLT5cclxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XHJcblx0XHRpZiBub3QgX1tuYW1lXSBhbmQgbm90IF8ucHJvdG90eXBlW25hbWVdP1xyXG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxyXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XHJcblx0XHRcdFx0YXJncyA9IFt0aGlzLl93cmFwcGVkXVxyXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxyXG5cclxuI21peGluKF9zLmV4cG9ydHMoKSlcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxyXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cclxuXHRcdGlmICFkYXRlXHJcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0ZGF5ID0gZGF0ZS5nZXREYXkoKVxyXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cclxuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0IyDmoLnmja7kvKDlhaXml7bpl7QoZGF0ZSnorqHnrpflh6DkuKrlt6XkvZzml6UoZGF5cynlkI7nmoTml7bpl7QsZGF5c+ebruWJjeWPquiDveaYr+aVtOaVsFxyXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHRjaGVjayBkYXlzLCBOdW1iZXJcclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxyXG5cdFx0XHRpZiBpIDwgZGF5c1xyXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXHJcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRjYWN1bGF0ZURhdGUoMCwgZGF5cylcclxuXHRcdHJldHVybiBwYXJhbV9kYXRlXHJcblxyXG5cdCMg6K6h566X5Y2K5Liq5bel5L2c5pel5ZCO55qE5pe26Ze0XHJcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcclxuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXHJcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIFwidGltZV9wb2ludHMgaXMgbnVsbFwiXHJcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cclxuXHJcblx0XHRsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGhcclxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdHN0YXJ0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbMF0uaG91clxyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxyXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxyXG5cdFx0ZW5kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGVcclxuXHJcblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHJcblx0XHRqID0gMFxyXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxyXG5cdFx0aWYgZGF0ZSA8IHN0YXJ0X2RhdGVcclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSAwXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXHJcblx0XHRcdFx0aiA9IGxlbi8yXHJcblx0XHRlbHNlIGlmIGRhdGUgPj0gc3RhcnRfZGF0ZSBhbmQgZGF0ZSA8IGVuZF9kYXRlXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcclxuXHRcdFx0XHRmaXJzdF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpXS5taW51dGVcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxyXG5cclxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHJcblx0XHRcdFx0aSsrXHJcblxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IGkgKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRqID0gaSArIGxlbi8yXHJcblxyXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIGxlbi8yXHJcblxyXG5cdFx0aWYgaiA+IG1heF9pbmRleFxyXG5cdFx0XHQjIOmalOWkqemcgOWIpOaWreiKguWBh+aXpVxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZVxyXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbal0ubWludXRlXHJcblxyXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxyXG5cdFx0Z2V0U3RlZWRvc1Rva2VuOiAoYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XHJcblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcclxuXHRcdFx0aWYgYXBwXHJcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxyXG5cclxuXHRcdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxyXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcclxuXHJcblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cclxuXHJcblx0XHRsb2NhbGU6ICh1c2VySWQsIGlzSTE4biktPlxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxyXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcclxuXHRcdFx0aWYgaXNJMThuXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0XHRcdHJldHVybiBsb2NhbGVcclxuXHJcblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XHJcblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxyXG5cclxuXHJcblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XHJcblx0XHRcdHJlYXNvbiA9IHQgXCJwYXNzd29yZF9pbnZhbGlkXCJcclxuXHRcdFx0dmFsaWQgPSB0cnVlXHJcblx0XHRcdHVubGVzcyBwd2RcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0aWYgdmFsaWRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxyXG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cclxuXHJcblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXHJcblxyXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxyXG5cdGRiQXBwcyA9IHt9XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZm9yRWFjaCAoYXBwKS0+XHJcblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcclxuXHJcblx0cmV0dXJuIGRiQXBwc1xyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcylcclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cclxuXHRcdHJldHVybiBhdXRoVG9rZW5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5hdXRvcnVuICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpXHJcbiNcdFx0ZWxzZVxyXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xyXG4jXHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxyXG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xyXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbjsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIGxvY2FsZSkge1xuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSBcIm51bWJlclwiKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG51bWJlciAhPT0gXCJOYU5cIikge1xuICAgICAgaWYgKCFsb2NhbGUpIHtcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIiB8fCBsb2NhbGUgPT09IFwiemgtQ05cIikge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdmFsaUpxdWVyeVN5bWJvbHM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZWc7XG4gICAgcmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKTtcbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCBhdmF0YXJVcmwsIGJhY2tncm91bmQsIHJlZiwgcmVmMSwgcmVmMiwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoYWNjb3VudEJnQm9keVZhbHVlLnVybCkge1xuICAgICAgaWYgKHVybCA9PT0gYXZhdGFyKSB7XG4gICAgICAgIGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoTWV0ZW9yLmlzQ29yZG92YSA/IGF2YXRhclVybCA6IE1ldGVvci5hYnNvbHV0ZVVybChhdmF0YXJVcmwpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChNZXRlb3IuaXNDb3Jkb3ZhID8gdXJsIDogTWV0ZW9yLmFic29sdXRlVXJsKHVybCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZ3JvdW5kID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFkbWluKSAhPSBudWxsID8gcmVmMi5iYWNrZ3JvdW5kIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJhY2tncm91bmQpIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyBiYWNrZ3JvdW5kIDogTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKE1ldGVvci5pc0NvcmRvdmEgPyBiYWNrZ3JvdW5kIDogTWV0ZW9yLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciB6b29tTmFtZSwgem9vbVNpemU7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICB9XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuICAgIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lO1xuICAgIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplO1xuICAgIGlmICghem9vbU5hbWUpIHtcbiAgICAgIHpvb21OYW1lID0gXCJsYXJnZVwiO1xuICAgICAgem9vbVNpemUgPSAxLjI7XG4gICAgfVxuICAgIGlmICh6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpKSB7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tXCIgKyB6b29tTmFtZSk7XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLCBhY2NvdW50Wm9vbVZhbHVlLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLCBhY2NvdW50Wm9vbVZhbHVlLnNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbiA9IGZ1bmN0aW9uKHJlZGlyZWN0KSB7XG4gICAgdmFyIGFjY291bnRzVXJsLCByZWYsIHJlZjEsIHJlZjIsIHNpZ25JblVybDtcbiAgICBhY2NvdW50c1VybCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMSA9IHJlZi53ZWJzZXJ2aWNlcykgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hY2NvdW50cykgIT0gbnVsbCA/IHJlZjIudXJsIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmIChhY2NvdW50c1VybCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYWNjb3VudHNVcmwgKyBcIi9hdXRob3JpemU/cmVkaXJlY3RfdXJpPS9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc2lnbkluVXJsID0gQWNjb3VudHNUZW1wbGF0ZXMuZ2V0Um91dGVQYXRoKFwic2lnbkluXCIpO1xuICAgICAgaWYgKHJlZGlyZWN0KSB7XG4gICAgICAgIGlmIChzaWduSW5VcmwuaW5kZXhPZihcIj9cIikgPiAwKSB7XG4gICAgICAgICAgc2lnbkluVXJsICs9IFwiJnJlZGlyZWN0PVwiICsgcmVkaXJlY3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2lnbkluVXJsICs9IFwiP3JlZGlyZWN0PVwiICsgcmVkaXJlY3Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBGbG93Um91dGVyLmdvKHNpZ25JblVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNoZWNrID0gZmFsc2U7XG4gICAgbW9kdWxlcyA9IChyZWYgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgICBwYXJlbnRzID0gXy51bmlvbihwYXJlbnRzLCBvcmcucGFyZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHJlZiA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZXN1bHQsIHVzZXIsIHVzZXJJZCwgdXNlcm5hbWU7XG4gICAgdXNlcm5hbWUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmMiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjJbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjMgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYzW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHVzZXJJZDtcbiAgICB1c2VySWQgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMVtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMiA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYyLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWYsIHNlY29uZF9kYXRlLCBzdGFydF9kYXRlLCB0aW1lX3BvaW50cztcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICB0aW1lX3BvaW50cyA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmLnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciByZWFzb24sIHZhbGlkO1xuICAgICAgcmVhc29uID0gdChcInBhc3N3b3JkX2ludmFsaWRcIik7XG4gICAgICB2YWxpZCA9IHRydWU7XG4gICAgICBpZiAoIXB3ZCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCEvXFxkKy8udGVzdChwd2QpKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIS9bYS16QS1aXSsvLnRlc3QocHdkKSkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHB3ZC5sZW5ndGggPCA4KSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xyXG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1c2g6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXHJcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkc2V0OiBcclxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcclxuICAgICAgICAgICAgZW1haWxzOiBbXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgICAgICAgXVxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcCA9IG51bGxcclxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgICAgcCA9IGVcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1bGw6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIHBcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XHJcbiAgICAgIFxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXHJcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcclxuXHJcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxyXG4gICAgICAgICRzZXQ6XHJcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xyXG4gICAgICAgICAgZW1haWw6IGVtYWlsXHJcblxyXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XHJcbiAgICAgICAgc3dhbFxyXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxyXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXHJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cclxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXHJcbiMjI1xyXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxyXG5cclxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXHJcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcclxuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcclxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xyXG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxyXG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xyXG5cdGZyb206IChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XHJcblx0XHRcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xyXG5cdH0pKCksXHJcblx0cmVzZXRQYXNzd29yZDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xyXG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0dmVyaWZ5RW1haWw6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVucm9sbEFjY291bnQ6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xyXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcclxuICBcclxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XHJcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxyXG5cdHtcclxuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcclxuXHRcdHtcclxuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcclxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cdFxyXG5cclxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgIFx0ZGF0YToge1xyXG5cdCAgICAgIFx0cmV0OiAwLFxyXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXHJcbiAgICBcdH1cclxuICBcdH0pO1xyXG59KTtcclxuXHJcbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcclxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxyXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxyXG5cclxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcclxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcclxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XHJcblx0XHRpZiBzcGFjZUlkXHJcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XHJcblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXHJcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cclxuXHRcdHJldHVybiBzZWxlY3RvclxyXG5cclxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XHJcblx0aWNvbjogXCJnbG9iZVwiXHJcblx0Y29sb3I6IFwiYmx1ZVwiXHJcblx0dGFibGVDb2x1bW5zOiBbXHJcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXHJcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxyXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcclxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxyXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cclxuXHRdXHJcblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cclxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxyXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdHJldHVybiB7fVxyXG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxyXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXHJcblx0ZGlzYWJsZUFkZDogdHJ1ZVxyXG5cdHBhZ2VMZW5ndGg6IDEwMFxyXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXHJcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXHJcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxyXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xyXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcclxuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xyXG4gICAgaWYgKGxlbiA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcclxuICAgIHZhciBrO1xyXG4gICAgaWYgKG4gPj0gMCkge1xyXG4gICAgICBrID0gbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSBsZW4gKyBuO1xyXG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XHJcbiAgICB9XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XHJcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaysrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXHJcblxyXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXHJcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cclxuICAgICAgd3d3OiBcclxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXHJcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XHJcblx0bGlzdFZpZXdzID0ge31cclxuXHJcblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxyXG5cclxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xyXG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cclxuXHR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZmV0Y2goKVxyXG5cclxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxyXG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XHJcblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cclxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cclxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XHJcblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXHJcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3RfdmlldylcclxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gbGlzdFZpZXdzXHJcblxyXG5cclxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblxyXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cclxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xyXG5cclxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblxyXG5cclxuXHJcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCJTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xyXG5cclxuICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcclxuICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XHJcbiAgfTtcclxuICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfTtcclxuXHJcbiAgQ29sbGVjdGlvbi5kZW55KHtcclxuICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcbiAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxyXG4gIHZhciBhcGkgPSB7XHJcbiAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XHJcbiAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbiAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XHJcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbiAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbiAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuICAgIH0sXHJcbiAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xyXG4gICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxyXG4gICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xyXG5cclxuICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XHJcblxyXG4gICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcclxuICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcclxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcclxuICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH0pXHJcblxyXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XHJcbiAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXHJcbiAgICAvLyAgIH1cclxuICAgIC8vIH0pO1xyXG5cclxuICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcclxuICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcclxuXHJcbiAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcclxuICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbiAgICAgIH0sXHJcbiAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XHJcblxyXG4gICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxyXG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xyXG5cclxuICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XHJcbiAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XHJcbiAgICAgIH1cclxuICAgIH0pOyAgXHJcblxyXG4gICAgLy8gc2VydmVyLW9ubHkgYXBpXHJcbiAgICBfLmV4dGVuZChhcGksIHtcclxuICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcclxuICAgICAgfSxcclxuICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcclxuICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGFwaTtcclxufSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXHJcblxyXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxyXG5cclxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcclxuXHRcdFxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxyXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHJcblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXHJcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxyXG5cclxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxyXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHJcblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXHJcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcclxuXHJcblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cclxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XHJcblx0XHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcyddXHJcblxyXG4gICAgICAgIGlmICFzcGFjZVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXHJcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcclxuICAgICAgICBcclxuICAgICAgICBpZiAhc3BhY2VfdXNlclxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFkYlttb2RlbF1cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG5cclxuICAgICAgICBpZiAhb3B0aW9uc1xyXG4gICAgICAgICAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuXHJcbiAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xyXG5cclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xyXG4gICAgY2F0Y2ggZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuICAgIHRyeVxyXG4gICAgICAgICMgVE9ETyDnlKjmiLfnmbvlvZXpqozor4FcclxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblxyXG4gICAgICAgICMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XHJcbiAgICAgICAgaWYgcmVxLmJvZHlcclxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cclxuICAgICAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG4gICAgICAgIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG4gICAgICAgICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuICAgICAgICBpZiAhKHVzZXJJZCBhbmQgYXV0aFRva2VuKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIiwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xyXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XHJcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XHJcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcclxuICAgICAgICBkYXRhID0gW107XHJcbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cyddXHJcblxyXG4gICAgICAgIGlmICFzcGFjZVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXHJcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcclxuICAgICAgICBcclxuICAgICAgICBpZiAhc3BhY2VfdXNlclxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFkYlttb2RlbF1cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG5cclxuICAgICAgICBpZiAhb3B0aW9uc1xyXG4gICAgICAgICAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgICAgIGlmIG1vZGVsID09ICdtYWlsX2FjY291bnRzJ1xyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xyXG4gICAgY2F0Y2ggZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IHt9IiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghKHVzZXJJZCAmJiBhdXRoVG9rZW4pKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAobW9kZWwgPT09ICdtYWlsX2FjY291bnRzJykge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKVxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcblx0YXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKVxyXG5cdGlmIGFwcFxyXG5cdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxyXG5cdFx0cmVkaXJlY3RVcmwgPSBhcHAudXJsXHJcblx0ZWxzZVxyXG5cdFx0c2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybFxyXG5cclxuXHRpZiAhcmVkaXJlY3RVcmxcclxuXHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRyZXMuZW5kKClcclxuXHRcdHJldHVyblxyXG5cclxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblxyXG5cdCMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XHJcblx0IyBpZiByZXEuYm9keVxyXG5cdCMgXHR1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG5cdCMgXHRhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHQjICMgdGhlbiBjaGVjayBjb29raWVcclxuXHQjIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdCMgXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl1cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXHJcblx0XHRcdGlmIGFwcC5zZWNyZXRcclxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxyXG5cdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcclxuXHJcblx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0IyBkZXMtY2JjXHJcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxyXG5cdFx0XHRrZXk4ID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCA4XHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSA4IC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSA4XHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxyXG5cdFx0XHRkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSlcclxuXHRcdFx0ZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKVxyXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdGpvaW5lciA9IFwiP1wiXHJcblxyXG5cdFx0XHRpZiByZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xXHJcblx0XHRcdFx0am9pbmVyID0gXCImXCJcclxuXHJcblx0XHRcdHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlblxyXG5cclxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxyXG5cdFx0XHRcdHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9I3tlbmNvZGVVUkkodXNlci51c2VybmFtZSl9XCJcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHJldHVybnVybFxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0cmVzLmVuZCgpXHJcblx0cmV0dXJuXHJcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIGV4cHJlc3M7XG5cbmNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHAsIGF1dGhUb2tlbiwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgY29va2llcywgZGVzX2NpcGhlciwgZGVzX2NpcGhlcmVkTXNnLCBkZXNfaXYsIGRlc19zdGVlZG9zX3Rva2VuLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGpvaW5lciwga2V5MzIsIGtleTgsIGxlbiwgbSwgbm93LCByZWRpcmVjdFVybCwgcmV0dXJudXJsLCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgYXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKTtcbiAgaWYgKGFwcCkge1xuICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgcmVkaXJlY3RVcmwgPSBhcHAudXJsO1xuICB9IGVsc2Uge1xuICAgIHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgIHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybDtcbiAgfVxuICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgaWYgKCF1c2VySWQgJiYgIWF1dGhUb2tlbikge1xuICAgIHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIH1cbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgfVxuICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBkZXNfaXYgPSBcIi04NzYyLWZjXCI7XG4gICAgICBrZXk4ID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDgpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gOCAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gOCkge1xuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLCA4KTtcbiAgICAgIH1cbiAgICAgIGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKTtcbiAgICAgIGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSk7XG4gICAgICBkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBqb2luZXIgPSBcIj9cIjtcbiAgICAgIGlmIChyZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICAgIGpvaW5lciA9IFwiJlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuO1xuICAgICAgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT1cIiArIChlbmNvZGVVUkkodXNlci51c2VybmFtZSkpO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHJldHVybnVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgcmVzLmVuZCgpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFxyXG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdFx0IyB0aGlzLnBhcmFtcyA9XHJcblx0XHQjIFx0dXNlcklkOiBkZWNvZGVVUkkocmVxLnVybCkucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcclxuXHRcdHdpZHRoID0gNTAgO1xyXG5cdFx0aGVpZ2h0ID0gNTAgO1xyXG5cdFx0Zm9udFNpemUgPSAyOCA7XHJcblx0XHRpZiByZXEucXVlcnkud1xyXG5cdFx0ICAgIHdpZHRoID0gcmVxLnF1ZXJ5LncgO1xyXG5cdFx0aWYgcmVxLnF1ZXJ5LmhcclxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XHJcblx0XHRpZiByZXEucXVlcnkuZnNcclxuICAgICAgICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnMgO1xyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLnByb2ZpbGU/LmF2YXRhclxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhclxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcclxuXHRcdFx0XHRcdCB2aWV3Qm94PVwiMCAwIDcyIDcyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XHJcblx0XHRcdFx0PHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxyXG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxyXG5cdFx0XHRcdFx0LnN0MXtmaWxsOiNEMEQwRDA7fVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PGc+XHJcblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelwiLz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcclxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PGc+XHJcblx0XHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcclxuXHRcdFx0XHRcdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XCIvPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XHJcblx0XHRcdFx0XHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcIi8+XHJcblx0XHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9nPlxyXG5cdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcIlwiXCJcclxuXHRcdFx0cmVzLndyaXRlIHN2Z1xyXG4jXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvcGFja2FnZXMvc3RlZWRvc19iYXNlL2NsaWVudC9pbWFnZXMvZGVmYXVsdC1hdmF0YXIucG5nXCIpXHJcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XHJcblx0XHRpZiAhdXNlcm5hbWVcclxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXHJcblxyXG5cdFx0aWYgbm90IGZpbGU/XHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcclxuXHJcblx0XHRcdGNvbG9ycyA9IFsnI0Y0NDMzNicsJyNFOTFFNjMnLCcjOUMyN0IwJywnIzY3M0FCNycsJyMzRjUxQjUnLCcjMjE5NkYzJywnIzAzQTlGNCcsJyMwMEJDRDQnLCcjMDA5Njg4JywnIzRDQUY1MCcsJyM4QkMzNEEnLCcjQ0REQzM5JywnI0ZGQzEwNycsJyNGRjk4MDAnLCcjRkY1NzIyJywnIzc5NTU0OCcsJyM5RTlFOUUnLCcjNjA3RDhCJ11cclxuXHJcblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcclxuXHRcdFx0Y29sb3JfaW5kZXggPSAwXHJcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XHJcblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xyXG5cclxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcclxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXHJcblx0XHRcdCNjb2xvciA9IFwiI0Q2REFEQ1wiXHJcblxyXG5cdFx0XHRpbml0aWFscyA9ICcnXHJcblx0XHRcdGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpXHJcblxyXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcclxuXHJcblx0XHRcdHN2ZyA9IFwiXCJcIlxyXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cclxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgd2lkdGg9XCIje3dpZHRofVwiIGhlaWdodD1cIiN7aGVpZ2h0fVwiIHN0eWxlPVwid2lkdGg6ICN7d2lkdGh9cHg7IGhlaWdodDogI3toZWlnaHR9cHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxyXG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XHJcblx0XHRcdFx0XHQje2luaXRpYWxzfVxyXG5cdFx0XHRcdDwvdGV4dD5cclxuXHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cclxuXHRcdFx0cmVzLndyaXRlIHN2Z1xyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xyXG5cdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXI/XHJcblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcclxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcclxuXHRcdFx0XHRyZXMud3JpdGVIZWFkIDMwNFxyXG5cdFx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxyXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXHJcblxyXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXHJcblx0XHRyZXR1cm4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9yX2luZGV4LCBjb2xvcnMsIGZvbnRTaXplLCBoZWlnaHQsIGluaXRpYWxzLCBwb3NpdGlvbiwgcmVmLCByZWYxLCByZWYyLCByZXFNb2RpZmllZEhlYWRlciwgc3ZnLCB1c2VyLCB1c2VybmFtZSwgdXNlcm5hbWVfYXJyYXksIHdpZHRoO1xuICAgIHdpZHRoID0gNTA7XG4gICAgaGVpZ2h0ID0gNTA7XG4gICAgZm9udFNpemUgPSAyODtcbiAgICBpZiAocmVxLnF1ZXJ5LncpIHtcbiAgICAgIHdpZHRoID0gcmVxLnF1ZXJ5Lnc7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuaCkge1xuICAgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5Lmg7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuZnMpIHtcbiAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzO1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKSk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgocmVmID0gdXNlci5wcm9maWxlKSAhPSBudWxsID8gcmVmLmF2YXRhciA6IHZvaWQgMCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXIpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXJVcmwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBzdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiBpZD1cXFwiTGF5ZXJfMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeD1cXFwiMHB4XFxcIiB5PVxcXCIwcHhcXFwiXFxuXHQgdmlld0JveD1cXFwiMCAwIDcyIDcyXFxcIiBzdHlsZT1cXFwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiPlxcbjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XFxuXHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XFxuPC9zdHlsZT5cXG48Zz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDBcXFwiIGQ9XFxcIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XFxcIi8+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XFxuXHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcXFwiLz5cXG48L2c+XFxuPGc+XFxuXHQ8Zz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcXG5cdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XFxcIi8+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcXG5cdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elxcXCIvPlxcblx0PC9nPlxcbjwvZz5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHVzZXIubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgdXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKTtcbiAgICAgIGNvbG9yX2luZGV4ID0gMDtcbiAgICAgIF8uZWFjaCh1c2VybmFtZV9hcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gY29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuICAgICAgfSk7XG4gICAgICBwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCJcIiArIHdpZHRoICsgXCJcXFwiIGhlaWdodD1cXFwiXCIgKyBoZWlnaHQgKyBcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweDsgaGVpZ2h0OiBcIiArIGhlaWdodCArIFwicHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcblx0PHRleHQgdGV4dC1hbmNob3I9XFxcIm1pZGRsZVxcXCIgeT1cXFwiNTAlXFxcIiB4PVxcXCI1MCVcXFwiIGR5PVxcXCIwLjM2ZW1cXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJhdXRvXFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmb250LWZhbWlseT1cXFwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVxcXCIgc3R5bGU9XFxcImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogXCIgKyBmb250U2l6ZSArIFwicHg7XFxcIj5cXG5cdFx0XCIgKyBpbml0aWFscyArIFwiXFxuXHQ8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmMSA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCAoKHJlZjIgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSB8fCBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJyk7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aCk7XG4gICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUocmVzKTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcblx0XHRhY2Nlc3NfdG9rZW4gPSByZXEucXVlcnk/LmFjY2Vzc190b2tlblxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAyMDBcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IucHVibGlzaCAnYXBwcycsIChzcGFjZUlkKS0+XHJcbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XHJcbiAgICAgICAgaWYgc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7c29ydDoge3NvcnQ6IDF9fSk7XHJcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXHJcblxyXG5cdCMgcHVibGlzaCB1c2VycyBzcGFjZXNcclxuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cclxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cdFx0dXNlclNwYWNlcyA9IFtdXHJcblx0XHRzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0sIHtmaWVsZHM6IHtzcGFjZToxfX0pXHJcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XHJcblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcclxuXHJcblx0XHRoYW5kbGUyID0gbnVsbFxyXG5cclxuXHRcdCMgb25seSByZXR1cm4gdXNlciBqb2luZWQgc3BhY2VzLCBhbmQgb2JzZXJ2ZXMgd2hlbiB1c2VyIGpvaW4gb3IgbGVhdmUgYSBzcGFjZVxyXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXHJcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxyXG5cdFx0XHRcdGlmIGRvYy5zcGFjZVxyXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXHJcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXHJcblx0XHRcdFx0XHRcdG9ic2VydmVTcGFjZXMoKVxyXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxyXG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxyXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZVxyXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcyA9IC0+XHJcblx0XHRcdGlmIGhhbmRsZTJcclxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcclxuXHRcdFx0aGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJTcGFjZXN9fSkub2JzZXJ2ZVxyXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxyXG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLl9pZClcclxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xyXG5cdFx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxyXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxyXG5cclxuXHRcdG9ic2VydmVTcGFjZXMoKTtcclxuXHJcblx0XHRzZWxmLnJlYWR5KCk7XHJcblxyXG5cdFx0c2VsZi5vblN0b3AgLT5cclxuXHRcdFx0aGFuZGxlLnN0b3AoKTtcclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnbXlfc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGUsIGhhbmRsZTIsIG9ic2VydmVTcGFjZXMsIHNlbGYsIHN1cywgdXNlclNwYWNlcztcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIHVzZXJTcGFjZXMgPSBbXTtcbiAgc3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBzcGFjZTogMVxuICAgIH1cbiAgfSk7XG4gIHN1cy5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSk7XG4gIH0pO1xuICBoYW5kbGUyID0gbnVsbDtcbiAgaGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICBpZiAoZG9jLnNwYWNlKSB7XG4gICAgICAgIGlmICh1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDApIHtcbiAgICAgICAgICB1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKTtcbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgIGlmIChvbGREb2Muc3BhY2UpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZSk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgb2JzZXJ2ZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiB1c2VyU3BhY2VzXG4gICAgICB9XG4gICAgfSkub2JzZXJ2ZSh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgIHNlbGYuYWRkZWQoXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2MsIG9sZERvYykge1xuICAgICAgICByZXR1cm4gc2VsZi5jaGFuZ2VkKFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2MuX2lkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG9ic2VydmVTcGFjZXMoKTtcbiAgc2VsZi5yZWFkeSgpO1xuICByZXR1cm4gc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgcmV0dXJuIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIiMgcHVibGlzaCBzb21lIG9uZSBzcGFjZSdzIGF2YXRhclxyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cclxuXHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcclxuIiwiTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX2F2YXRhcicsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgaWYgKCFzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuc3BhY2VzLmZpbmQoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhdmF0YXI6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZW5hYmxlX3JlZ2lzdGVyOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ21vZHVsZXMnLCAoKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHVubGVzcyBfaWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwic3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsKHJlcSwgcmVzLCBuZXh0KS0+XHJcblx0dXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcblx0c3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnBhcmFtcz8uc3BhY2VJZFxyXG5cdGlmICF1c2VySWRcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDQwMyxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdFVTRVJfQ09OVEVYVCA9IENyZWF0b3IuZ2V0VXNlckNvbnRleHQodXNlcklkLCBzcGFjZUlkLCB0cnVlKVxyXG5cdHVubGVzcyBVU0VSX0NPTlRFWFRcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDUwMCxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7bmFtZTogMX19KVxyXG5cclxuXHRyZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZClcclxuXHRyZXN1bHQuVVNFUl9DT05URVhUID0gVVNFUl9DT05URVhUXHJcblx0cmVzdWx0LnNwYWNlID0gc3BhY2VcclxuXHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHNcclxuXHRyZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cylcclxuXHRyZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsICdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZFxyXG5cclxuXHRhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcylcclxuXHJcblx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XHJcblx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cclxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcclxuXHJcblx0cGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jICh2LCB1c2VyU2Vzc2lvbiwgY2IpLT5cclxuXHRcdHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblxyXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XHJcblx0XHRpZiBuYW1lICE9ICdkZWZhdWx0J1xyXG5cdFx0XHRkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpXHJcblx0XHRcdF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgKHYsIGspLT5cclxuXHRcdFx0XHRfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KHYudG9Db25maWcoKSlcclxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxyXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcclxuXHRcdFx0XHRfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lXHJcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxyXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXHJcblx0XHRcdClcclxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxyXG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKClcclxuXHJcblx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdGNvZGU6IDIwMCxcclxuXHRcdGRhdGE6IHJlc3VsdFxyXG4iLCJ2YXIgc3RlZWRvc0F1dGg7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBVU0VSX0NPTlRFWFQsIGF1dGhUb2tlbiwgcGVybWlzc2lvbnMsIHJlZiwgcmVzdWx0LCBzcGFjZSwgc3BhY2VJZCwgdXNlcklkLCB1c2VyU2Vzc2lvbjtcbiAgdXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddO1xuICBzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZiA9IHJlcS5wYXJhbXMpICE9IG51bGwgPyByZWYuc3BhY2VJZCA6IHZvaWQgMCk7XG4gIGlmICghdXNlcklkKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNDAzLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBVU0VSX0NPTlRFWFQgPSBDcmVhdG9yLmdldFVzZXJDb250ZXh0KHVzZXJJZCwgc3BhY2VJZCwgdHJ1ZSk7XG4gIGlmICghVVNFUl9DT05URVhUKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNTAwLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICByZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJlc3VsdC5VU0VSX0NPTlRFWFQgPSBVU0VSX0NPTlRFWFQ7XG4gIHJlc3VsdC5zcGFjZSA9IHNwYWNlO1xuICByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHMpO1xuICByZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cyk7XG4gIHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwoJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkKTtcbiAgYXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpO1xuICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShhdXRoVG9rZW4sIHNwYWNlSWQpO1xuICBwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24odiwgdXNlclNlc3Npb24sIGNiKSB7XG4gICAgcmV0dXJuIHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHZhciBkYXRhc291cmNlT2JqZWN0cztcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpO1xuICAgICAgcmV0dXJuIF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICB2YXIgX29iajtcbiAgICAgICAgX29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdCh2LnRvQ29uZmlnKCkpO1xuICAgICAgICBfb2JqLm5hbWUgPSBrO1xuICAgICAgICBfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lO1xuICAgICAgICBfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0Lm9iamVjdHNbX29iai5uYW1lXSA9IF9vYmo7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICByZXR1cm4gcmVzdWx0LmFwcHMgPSBfLmV4dGVuZChyZXN1bHQuYXBwcywgZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpO1xuICB9KTtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBjb2RlOiAyMDAsXG4gICAgZGF0YTogcmVzdWx0XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Ym9keSA9IFwiXCJcclxuXHRcdHJlcS5vbignZGF0YScsIChjaHVuayktPlxyXG5cdFx0XHRib2R5ICs9IGNodW5rXHJcblx0XHQpXHJcblx0XHRyZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCgpLT5cclxuXHRcdFx0XHR4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKVxyXG5cdFx0XHRcdHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHsgdHJpbTp0cnVlLCBleHBsaWNpdEFycmF5OmZhbHNlLCBleHBsaWNpdFJvb3Q6ZmFsc2UgfSlcclxuXHRcdFx0XHRwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgKGVyciwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdCMg54m55Yir5o+Q6YaS77ya5ZWG5oi357O757uf5a+55LqO5pSv5LuY57uT5p6c6YCa55+l55qE5YaF5a655LiA5a6a6KaB5YGa562+5ZCN6aqM6K+BLOW5tuagoemqjOi/lOWbnueahOiuouWNlemHkemineaYr+WQpuS4juWVhuaIt+S+p+eahOiuouWNlemHkemineS4gOiHtO+8jOmYsuatouaVsOaNruazhOa8j+WvvOiHtOWHuueOsOKAnOWBh+mAmuefpeKAne+8jOmAoOaIkOi1hOmHkeaNn+WksVxyXG5cdFx0XHRcdFx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cdFx0XHRcdFx0XHR3eHBheSA9IFdYUGF5KHtcclxuXHRcdFx0XHRcdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdFx0XHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0c2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKVxyXG5cdFx0XHRcdFx0XHRhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpXHJcblx0XHRcdFx0XHRcdGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkXHJcblx0XHRcdFx0XHRcdGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZClcclxuXHRcdFx0XHRcdFx0aWYgYnByIGFuZCBicHIudG90YWxfZmVlIGlzIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSBhbmQgc2lnbiBpcyByZXN1bHQuc2lnblxyXG5cdFx0XHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtfaWQ6IGNvZGVfdXJsX2lkfSwgeyRzZXQ6IHtwYWlkOiB0cnVlfX0pXHJcblx0XHRcdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudClcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdClcclxuXHRcdFx0KSwgKGVyciktPlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50J1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblx0XHRcclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0cmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCd9KVxyXG5cdHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpXHJcblxyXG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib2R5LCBlO1xuICB0cnkge1xuICAgIGJvZHkgPSBcIlwiO1xuICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICByZXR1cm4gYm9keSArPSBjaHVuaztcbiAgICB9KTtcbiAgICByZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcnNlciwgeG1sMmpzO1xuICAgICAgeG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG4gICAgICBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7XG4gICAgICAgIHRyaW06IHRydWUsXG4gICAgICAgIGV4cGxpY2l0QXJyYXk6IGZhbHNlLFxuICAgICAgICBleHBsaWNpdFJvb3Q6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIFdYUGF5LCBhdHRhY2gsIGJwciwgY29kZV91cmxfaWQsIHNpZ24sIHd4cGF5O1xuICAgICAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICAgICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgICAgICB9KTtcbiAgICAgICAgc2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKTtcbiAgICAgICAgYXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKTtcbiAgICAgICAgY29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWQ7XG4gICAgICAgIGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZCk7XG4gICAgICAgIGlmIChicHIgJiYgYnByLnRvdGFsX2ZlZSA9PT0gTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpICYmIHNpZ24gPT09IHJlc3VsdC5zaWduKSB7XG4gICAgICAgICAgZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBjb2RlX3VybF9pZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSksIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCcpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgfVxuICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ1xuICB9KTtcbiAgcmV0dXJuIHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XHJcblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7RcclxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXHJcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xyXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xyXG5cdFx0cmVWYWx1ZSA9XHJcblx0XHRcdGlzTGltaXQ6IHRydWVcclxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXHJcblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXHJcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XHJcblxyXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxyXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRcdFxyXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXHJcblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcclxuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXHJcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXHJcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXHJcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcclxuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcclxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XHJcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xyXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcclxuXHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXHJcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXHJcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblxyXG5cdFx0aWYgaXNMaW1pdFxyXG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcclxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cclxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cclxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHJcblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XHJcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xyXG5cdFx0cmV0dXJuIHJlVmFsdWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcclxuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcclxuXHJcbiAgICAgICAgb2JqID0ge307XHJcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcclxuICAgICAgICBvYmoua2V5ID0ga2V5O1xyXG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xyXG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICB9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjID4gMCkge1xyXG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0pIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3NldHRsZXVwOiAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQ9XCJcIiktPlxyXG5cdFx0Y2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKVxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZylcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblxyXG5cdFx0aWYgbm90IHVzZXIuaXNfY2xvdWRhZG1pblxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcnXHJcblx0XHRzcGFjZXMgPSBbXVxyXG5cdFx0aWYgc3BhY2VfaWRcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VfaWQsIGlzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdHNwYWNlcy5mb3JFYWNoIChzKSAtPlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRlID0ge31cclxuXHRcdFx0XHRlLl9pZCA9IHMuX2lkXHJcblx0XHRcdFx0ZS5uYW1lID0gcy5uYW1lXHJcblx0XHRcdFx0ZS5lcnIgPSBlcnJcclxuXHRcdFx0XHRyZXN1bHQucHVzaCBlXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoID4gMFxyXG5cdFx0XHRjb25zb2xlLmVycm9yIHJlc3VsdFxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWxcclxuXHRcdFx0XHRFbWFpbC5zZW5kXHJcblx0XHRcdFx0XHR0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nXHJcblx0XHRcdFx0XHRmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tXHJcblx0XHRcdFx0XHRzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnXHJcblx0XHRcdFx0XHR0ZXh0OiBKU09OLnN0cmluZ2lmeSgncmVzdWx0JzogcmVzdWx0KVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyclxyXG5cdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nJyIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19zZXR0bGV1cDogZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgRW1haWwsIGVyciwgcmVzdWx0LCBzcGFjZXMsIHVzZXI7XG4gICAgaWYgKHNwYWNlX2lkID09IG51bGwpIHtcbiAgICAgIHNwYWNlX2lkID0gXCJcIjtcbiAgICB9XG4gICAgY2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcnKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgX2lkOiBzcGFjZV9pZCxcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlc3VsdCA9IFtdO1xuICAgIHNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBlLCBlcnI7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgZSA9IHt9O1xuICAgICAgICBlLl9pZCA9IHMuX2lkO1xuICAgICAgICBlLm5hbWUgPSBzLm5hbWU7XG4gICAgICAgIGUuZXJyID0gZXJyO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCk7XG4gICAgICB0cnkge1xuICAgICAgICBFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWw7XG4gICAgICAgIEVtYWlsLnNlbmQoe1xuICAgICAgICAgIHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbScsXG4gICAgICAgICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICAgICAgICBzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnLFxuICAgICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICdyZXN1bHQnOiByZXN1bHRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcnKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XHJcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcclxuXHJcblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcclxuXHJcblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxyXG5cclxuXHRcdHVubGVzcyB1c2VyX2lkXHJcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxyXG5cclxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblxyXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcclxuXHJcblx0XHRyZXR1cm4gdXNlcm5hbWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3JlY2hhcmdlOiAodG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0XHRjaGVjayB0b3RhbF9mZWUsIE51bWJlclxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZyBcclxuXHRcdGNoZWNrIG5ld19pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbW9kdWxlX25hbWVzLCBBcnJheSBcclxuXHRcdGNoZWNrIGVuZF9kYXRlLCBTdHJpbmcgXHJcblx0XHRjaGVjayB1c2VyX2NvdW50LCBOdW1iZXIgXHJcblxyXG5cdFx0dXNlcl9pZCA9IHRoaXMudXNlcklkXHJcblxyXG5cdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdG9yZGVyX2JvZHkgPSBbXVxyXG5cdFx0ZGIubW9kdWxlcy5maW5kKHtuYW1lOiB7JGluOiBtb2R1bGVfbmFtZXN9fSkuZm9yRWFjaCAobSktPlxyXG5cdFx0XHRsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYlxyXG5cdFx0XHRvcmRlcl9ib2R5LnB1c2ggbS5uYW1lX3poXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmIG5vdCBzcGFjZS5pc19wYWlkXHJcblx0XHRcdHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZH0pLmNvdW50KClcclxuXHRcdFx0b25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlc1xyXG5cdFx0XHRpZiB0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbioxMDBcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pSN7b25lX21vbnRoX3l1YW59XCJcclxuXHJcblx0XHRyZXN1bHRfb2JqID0ge31cclxuXHJcblx0XHRhdHRhY2ggPSB7fVxyXG5cdFx0YXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkXHJcblx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cclxuXHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxyXG5cdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0fSlcclxuXHJcblx0XHR3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xyXG5cdFx0XHRib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxyXG5cdFx0XHRvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcclxuXHRcdFx0dG90YWxfZmVlOiB0b3RhbF9mZWUsXHJcblx0XHRcdHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxyXG5cdFx0XHRub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxyXG5cdFx0XHR0cmFkZV90eXBlOiAnTkFUSVZFJyxcclxuXHRcdFx0cHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHRhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcclxuXHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKChlcnIsIHJlc3VsdCkgLT4gXHJcblx0XHRcdFx0aWYgZXJyIFxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRpZiByZXN1bHRcclxuXHRcdFx0XHRcdG9iaiA9IHt9XHJcblx0XHRcdFx0XHRvYmouX2lkID0gbmV3X2lkXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZCA9IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRvYmouaW5mbyA9IHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZVxyXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXHJcblx0XHRcdFx0XHRvYmouc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRcdFx0b2JqLnBhaWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0b2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRcdFx0XHRcdG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblx0XHRcdFx0XHRvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iailcclxuXHRcdFx0KSwgKCktPlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCdcclxuXHRcdFx0KVxyXG5cdFx0KVxyXG5cclxuXHRcdFxyXG5cdFx0cmV0dXJuIFwic3VjY2Vzc1wiIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3JlY2hhcmdlOiBmdW5jdGlvbih0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgICB2YXIgV1hQYXksIGF0dGFjaCwgbGlzdHByaWNlcywgb25lX21vbnRoX3l1YW4sIG9yZGVyX2JvZHksIHJlc3VsdF9vYmosIHNwYWNlLCBzcGFjZV91c2VyX2NvdW50LCB1c2VyX2lkLCB3eHBheTtcbiAgICBjaGVjayh0b3RhbF9mZWUsIE51bWJlcik7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobmV3X2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG1vZHVsZV9uYW1lcywgQXJyYXkpO1xuICAgIGNoZWNrKGVuZF9kYXRlLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJfY291bnQsIE51bWJlcik7XG4gICAgdXNlcl9pZCA9IHRoaXMudXNlcklkO1xuICAgIGxpc3RwcmljZXMgPSAwO1xuICAgIG9yZGVyX2JvZHkgPSBbXTtcbiAgICBkYi5tb2R1bGVzLmZpbmQoe1xuICAgICAgbmFtZToge1xuICAgICAgICAkaW46IG1vZHVsZV9uYW1lc1xuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgbGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWI7XG4gICAgICByZXR1cm4gb3JkZXJfYm9keS5wdXNoKG0ubmFtZV96aCk7XG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICBzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSkuY291bnQoKTtcbiAgICAgIG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXM7XG4gICAgICBpZiAodG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4gKiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6VcIiArIG9uZV9tb250aF95dWFuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0X29iaiA9IHt9O1xuICAgIGF0dGFjaCA9IHt9O1xuICAgIGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZDtcbiAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgfSk7XG4gICAgd3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcbiAgICAgIGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG4gICAgICBvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICBub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuICAgICAgdHJhZGVfdHlwZTogJ05BVElWRScsXG4gICAgICBwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICBhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcbiAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLl9pZCA9IG5ld19pZDtcbiAgICAgICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZTtcbiAgICAgICAgb2JqLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWU7XG4gICAgICAgIG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgICAgICAgb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgIG9iai5wYWlkID0gZmFsc2U7XG4gICAgICAgIG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICAgICAgICBvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgb2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICAgICAgICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKTtcbiAgICAgIH1cbiAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3RcclxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXHJcblxyXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcclxuXHJcblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XHJcbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXHJcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcclxuXHJcbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxyXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXHJcblxyXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcclxuICAgICAgICAgICAgX2lkOiB7XHJcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXHJcblxyXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEgfSB9KS5mZXRjaCgpXHJcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cclxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcclxuICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXHJcbiAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXHJcblxyXG4gICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXHJcbiAgICAgICAgICAgIGlmIHBlcm1zXHJcbiAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxyXG4gICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG5cclxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XHJcblxyXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxyXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxyXG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxyXG5cdGNvdW50X2RheXMgPSAwXHJcblxyXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcclxuXHJcblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcclxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcclxuXHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxyXG5cclxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXHJcblx0XHQjIGRvIG5vdGhpbmdcclxuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHJcblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cclxuXHJcbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XHJcblx0bGFzdF9iaWxsID0gbnVsbFxyXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXHJcblxyXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXHJcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdHtcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRjcmVhdGVkOiB7XHJcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0aWYgcGF5bWVudF9iaWxsXHJcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcclxuXHRlbHNlXHJcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblxyXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0XHRpZiBhcHBfYmlsbFxyXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxyXG5cclxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcclxuXHJcblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxyXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcclxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XHJcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXHJcblxyXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxyXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxyXG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXHJcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblxyXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcclxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xyXG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KVxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxyXG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxyXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXHJcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXHJcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXHJcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcclxuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xyXG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XHJcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XHJcblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cclxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XHJcblx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdHtcclxuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxyXG5cdFx0fVxyXG5cdCkuZm9yRWFjaCAoYmlsbCktPlxyXG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcclxuXHJcblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0bW9kdWxlcyA9IG5ldyBBcnJheVxyXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XHJcblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxyXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XHJcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXHJcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxyXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXHJcblx0XHRcdCMgIGRvIG5vdGhpbmdcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cclxuXHRyZXR1cm4gbW9kdWxlc1xyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cclxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XHJcblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXHJcblx0KVxyXG5cdHJldHVybiBtb2R1bGVzX25hbWVcclxuXHJcblxyXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XHJcblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0cmV0dXJuXHJcblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcclxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXHJcblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRkZWJpdHMgPSAwXHJcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpLmZvckVhY2goKGIpLT5cclxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXHJcblx0XHQpXHJcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXHJcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxyXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcclxuXHRcdGlmIGJhbGFuY2UgPiAwXHJcblx0XHRcdGlmIGRlYml0cyA+IDBcclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxyXG5cclxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcclxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRlbHNlXHJcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcclxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXHJcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxyXG5cclxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcclxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxyXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXHJcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XHJcblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXHJcblxyXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxyXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblxyXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxyXG5cclxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXHJcblxyXG5cdG0gPSBtb21lbnQoKVxyXG5cdG5vdyA9IG0uX2RcclxuXHJcblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcclxuXHJcblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxyXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHQjIOabtOaWsG1vZHVsZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXHJcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxyXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHJcblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxyXG5cdGlmIHJcclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxyXG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XHJcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXHJcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcclxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcclxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcclxuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXHJcblxyXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XHJcblxyXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xyXG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXHJcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XHJcblxyXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIWdvX25leHQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBnb19uZXh0ID0gZmFsc2U7XHJcblxyXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcclxuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxyXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxyXG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxyXG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XHJcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxyXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaAu+aVsFxyXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcclxuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xyXG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXHJcbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcclxuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcclxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcclxuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xyXG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XHJcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xyXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcclxuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XHJcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xyXG4gICAgICAgICAgcmV0dXJuIG1vZDtcclxuICAgICAgfTtcclxuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXHJcbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XHJcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XHJcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcclxuICAgICAgICAgIH0pICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cclxuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcclxuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XHJcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xyXG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmj5LlhaXmlbDmja5cclxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xyXG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xyXG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxyXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxyXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxyXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXHJcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgc3RlZWRvczp7XHJcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB3b3JrZmxvdzp7XHJcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjbXM6IHtcclxuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcclxuXHJcbiAgICAgIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XHJcbiAgICB9KSk7XHJcblxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5cclxuXHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAxXHJcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IChwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCktPlxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhID0ge3BhcmVudDogcGFyZW50X2lkLCBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSwgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLCBzcGFjZTogc3BhY2VfaWQsIGluc3RhbmNlOiBpbnN0YW5jZV9pZCwgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXX1cclxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXHJcbiAgICAgICAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGZpZWxkczoge3NwYWNlOiAxLCBhdHRhY2htZW50czogMX19KS5mb3JFYWNoIChpbnMpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGkrK1xyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJykiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAxLFxuICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBpLCB1cGRhdGVfY2ZzX2luc3RhbmNlO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IGZ1bmN0aW9uKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRfaWQsXG4gICAgICAgICAgICBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZV9pZCxcbiAgICAgICAgICAgIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0N1cnJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICAgICBcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGlucykge1xuICAgICAgICAgIHZhciBhdHRhY2hzLCBpbnN0YW5jZV9pZCwgc3BhY2VfaWQ7XG4gICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50cztcbiAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZTtcbiAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWQ7XG4gICAgICAgICAgYXR0YWNocy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmVyLCBwYXJlbnRfaWQ7XG4gICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50O1xuICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldjtcbiAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChhdHQuaGlzdG9yeXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dC5oaXN0b3J5cy5mb3JFYWNoKGZ1bmN0aW9uKGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGkrKztcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogMlxyXG4gICAgICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OSdcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXInXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe29yZ2FuaXphdGlvbnM6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uOiAxfX0pLmZvckVhY2ggKHN1KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgc3Uub3JnYW5pemF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXInXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OScsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAyIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvcmdhbml6YXRpb246IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogM1xyXG4gICAgICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7ZW1haWw6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7dXNlcjogMX19KS5mb3JFYWNoIChzdSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3UudXNlcn0sIHtmaWVsZHM6IHtlbWFpbHM6IDF9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge2VtYWlsOiBhZGRyZXNzfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDMsXG4gICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMyB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHVzZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgYWRkcmVzcywgdTtcbiAgICAgICAgICBpZiAoc3UudXNlcikge1xuICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHN1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAzIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiA0XHJcbiAgICAgICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJ1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7c29ydF9ubzogeyRleGlzdHM6IGZhbHNlfX0sIHskc2V0OiB7c29ydF9ubzogMTAwfX0sIHttdWx0aTogdHJ1ZX0pXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDQsXG4gICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgc29ydF9ubzoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAxMDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA0IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdE1pZ3JhdGlvbnMuYWRkXHJcblx0XHR2ZXJzaW9uOiA1XHJcblx0XHRuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCdcclxuXHRcdHVwOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IHVwJ1xyXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXHJcblx0XHRcdHRyeVxyXG5cclxuXHRcdFx0XHRkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaCAoc3UpLT5cclxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0aWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggaXMgMVxyXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcclxuXHRcdFx0XHRcdFx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHN1LnNwYWNlLCBwYXJlbnQ6IG51bGx9KVxyXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXHJcblx0XHRcdFx0XHRcdFx0XHRyID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLCBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZH19KVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcclxuXHRcdFx0XHRcdGVsc2UgaWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxXHJcblx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcyA9IFtdXHJcblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxyXG5cdFx0XHRcdFx0XHRpZiByZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRcdG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcylcclxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXHJcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHN9fSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcclxuXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXHJcblx0XHRkb3duOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNaWdyYXRpb25zLmFkZFxyXG5cdFx0dmVyc2lvbjogNlxyXG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcclxuXHRcdHVwOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IHVwJ1xyXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0IyDmuIXnqbptb2R1bGVz6KGoXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5qCH5YeG54mIXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMlxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMThcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDQwXHJcblx0XHRcdFx0fSlcclxuXHJcblxyXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXHJcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cclxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0c2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXHJcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXHJcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gMFxyXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXHJcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe25hbWU6IHBtfSlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2VcclxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZS8obGlzdHByaWNlcyp1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDFcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxyXG5cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlXHJcblxyXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXHJcblx0XHRcdFx0XHRcdHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpXHJcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCJcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyB1cGdyYWRlXCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyB1cGdyYWRlJ1xyXG5cdFx0ZG93bjogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBzdGFydF9kYXRlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm1vZHVsZXMucmVtb3ZlKHt9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5qCH5YeG54mIXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMS4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAyXG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAzLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiA2LjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICAgIGlzX3BhaWQ6IHRydWUsXG4gICAgICAgICAgdXNlcl9saW1pdDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHZhciBiYWxhbmNlLCBlLCBlbmRfZGF0ZSwgbGlzdHByaWNlcywgbW9udGhzLCBzZXRfb2JqLCB1c2VyX2NvdW50O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRfb2JqID0ge307XG4gICAgICAgICAgICB1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzLl9pZCxcbiAgICAgICAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gICAgICAgICAgICBiYWxhbmNlID0gcy5iYWxhbmNlO1xuICAgICAgICAgICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgICAgICAgIGxpc3RwcmljZXMgPSAwO1xuICAgICAgICAgICAgICBfLmVhY2gocy5tb2R1bGVzLCBmdW5jdGlvbihwbSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUubGlzdHByaWNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlIC8gKGxpc3RwcmljZXMgKiB1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDE7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgIGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFsYW5jZSA8PSAwKSB7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIik7XG4gICAgICAgICAgICBzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcy5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDogc2V0X29ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHMuX2lkKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2V0X29iaik7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyB1cGdyYWRlXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA2IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0bmV3IFRhYnVsYXIuVGFibGVcclxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcclxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXHJcblx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdFx0ZG9tOiBcInRwXCJcclxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxyXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxyXG5cdFx0b3JkZXJpbmc6IGZhbHNlXHJcblx0XHRwYWdlTGVuZ3RoOiAxMFxyXG5cdFx0aW5mbzogZmFsc2VcclxuXHRcdHNlYXJjaGluZzogdHJ1ZVxyXG5cdFx0YXV0b1dpZHRoOiB0cnVlXHJcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XHJcblx0XHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2VcclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
