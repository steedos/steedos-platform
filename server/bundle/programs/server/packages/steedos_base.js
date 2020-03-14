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
        $("body").css("backgroundImage", "url(" + Steedos.absoluteUrl(avatarUrl) + ")");
      } else {
        $("body").css("backgroundImage", "url(" + Steedos.absoluteUrl(url) + ")");
      }
    } else {
      background = (ref = Meteor.settings) != null ? (ref1 = ref["public"]) != null ? (ref2 = ref1.admin) != null ? ref2.background : void 0 : void 0 : void 0;

      if (background) {
        $("body").css("backgroundImage", "url(" + Steedos.absoluteUrl(background) + ")");
      } else {
        background = "/packages/steedos_theme/client/background/sea.jpg";
        $("body").css("backgroundImage", "url(" + Steedos.absoluteUrl(background) + ")");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiTW9uZ28iLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsImlnbm9yZVVuZGVmaW5lZCIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsInJlZyIsIlJlZ0V4cCIsInRlc3QiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzQ2xpZW50Iiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwiYXZhdGFyVXJsIiwiYmFja2dyb3VuZCIsInJlZjIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiJCIsImNzcyIsImFic29sdXRlVXJsIiwiYWRtaW4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImdldCIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImlzQ29yZG92YSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsInJlZGlyZWN0VG9TaWduSW4iLCJGbG93Um91dGVyIiwiZ28iLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJlcnJvcjEiLCJjb25zb2xlIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJpc19wYWlkIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJtYXRjaCIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiXyIsImZsYXR0ZW4iLCJmaW5kIiwiJGluIiwiZmV0Y2giLCJ1bmlvbiIsImZvcmJpZE5vZGVDb250ZXh0bWVudSIsInRhcmdldCIsImlmciIsImRvY3VtZW50IiwiYm9keSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInByZXZlbnREZWZhdWx0IiwibG9hZCIsImlmckJvZHkiLCJjb250ZW50cyIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsInBhc3N3b3JkIiwicmVmMyIsInJlc3VsdCIsInVzZXJuYW1lIiwicXVlcnkiLCJ1c2VycyIsInN0ZWVkb3NfaWQiLCJfY2hlY2tQYXNzd29yZCIsIkVycm9yIiwiY2hlY2tBdXRoVG9rZW4iLCJoZWFkZXJzIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwic3BsaXQiLCJvQXV0aDJTZXJ2ZXIiLCJjb2xsZWN0aW9ucyIsImFjY2Vzc1Rva2VuIiwiZXhwaXJlcyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJBUElBdXRoZW50aWNhdGlvbkNoZWNrIiwiSnNvblJvdXRlcyIsInNlbmRSZXN1bHQiLCJkYXRhIiwiY29kZSIsImZ1bmN0aW9ucyIsImZ1bmMiLCJhcmdzIiwiX3dyYXBwZWQiLCJhcmd1bWVudHMiLCJjYWxsIiwiaXNIb2xpZGF5IiwiZGF0ZSIsImRheSIsImdldERheSIsImNhY3VsYXRlV29ya2luZ1RpbWUiLCJkYXlzIiwiY2FjdWxhdGVEYXRlIiwicGFyYW1fZGF0ZSIsIk51bWJlciIsImdldFRpbWUiLCJjYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSIsIm5leHQiLCJjYWN1bGF0ZWRfZGF0ZSIsImZpcnN0X2RhdGUiLCJqIiwibWF4X2luZGV4Iiwic2Vjb25kX2RhdGUiLCJzdGFydF9kYXRlIiwidGltZV9wb2ludHMiLCJyZW1pbmQiLCJpc0VtcHR5Iiwic2V0SG91cnMiLCJob3VyIiwic2V0TWludXRlcyIsIm1pbnV0ZSIsImV4dGVuZCIsImdldFN0ZWVkb3NUb2tlbiIsImFwcElkIiwibm93Iiwic2VjcmV0Iiwic3RlZWRvc190b2tlbiIsInBhcnNlSW50IiwiaXNJMThuIiwiY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eSIsIiRyZWdleCIsIl9lc2NhcGVSZWdFeHAiLCJ0cmltIiwidmFsaWRhdGVQYXNzd29yZCIsInB3ZCIsInBhc3N3b3JQb2xpY3kiLCJwYXNzd29yUG9saWN5RXJyb3IiLCJyZWFzb24iLCJ2YWxpZCIsInBvbGljeSIsInBvbGljeUVycm9yIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJyZW1vdmVTcGVjaWFsQ2hhcmFjdGVyIiwiQ3JlYXRvciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldEF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsInN0YXJ0dXAiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZm9yZWlnbl9rZXkiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInJlZmVyZW5jZXMiLCJtZXRob2RzIiwidXBkYXRlVXNlckxhc3RMb2dvbiIsIiRzZXQiLCJsYXN0X2xvZ29uIiwib25Mb2dpbiIsInVzZXJzX2FkZF9lbWFpbCIsImVtYWlsIiwiY291bnQiLCJlbWFpbHMiLCJkaXJlY3QiLCIkcHVzaCIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsInVzZXJzX3JlbW92ZV9lbWFpbCIsInAiLCIkcHVsbCIsInVzZXJzX3ZlcmlmeV9lbWFpbCIsInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsIiwicHJpbWFyeSIsIm11bHRpIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNsb3NlT25Db25maXJtIiwiYW5pbWF0aW9uIiwiaW5wdXRWYWx1ZSIsInVwZGF0ZVVzZXJBdmF0YXIiLCJlbWFpbFRlbXBsYXRlcyIsImRlZmF1bHRGcm9tIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJzcGxpdHMiLCJ0b2tlbkNvZGUiLCJncmVldGluZyIsInByb2ZpbGUiLCJ0b2tlbl9jb2RlIiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiYWRkIiwib3JncyIsImZ1bGxuYW1lIiwiJG5lIiwiY2FsY3VsYXRlRnVsbG5hbWUiLCJyZXQiLCJtc2ciLCJQdXNoIiwiQ29uZmlndXJlIiwic2VuZGVySUQiLCJBTkRST0lEX1NFTkRFUl9JRCIsInNvdW5kIiwidmlicmF0ZSIsImlvcyIsImJhZGdlIiwiY2xlYXJCYWRnZSIsImFsZXJ0IiwiYXBwTmFtZSIsIlNlbGVjdG9yIiwic2VsZWN0b3JDaGVja1NwYWNlQWRtaW4iLCJzZWxlY3RvciIsImlzX2Nsb3VkYWRtaW4iLCJtYXAiLCJuIiwic2VsZWN0b3JDaGVja1NwYWNlIiwidSIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJhZG1pbkNvbmZpZyIsImljb24iLCJjb2xvciIsInRhYmxlQ29sdW1ucyIsImV4dHJhRmllbGRzIiwicm91dGVyQWRtaW4iLCJwYWlkIiwic2hvd0VkaXRDb2x1bW4iLCJzaG93RGVsQ29sdW1uIiwiZGlzYWJsZUFkZCIsInBhZ2VMZW5ndGgiLCJvcmRlciIsInNwYWNlX3VzZXJfc2lnbnMiLCJBZG1pbkNvbmZpZyIsImNvbGxlY3Rpb25zX2FkZCIsInNlYXJjaEVsZW1lbnQiLCJPIiwiY3VycmVudEVsZW1lbnQiLCJ3ZWJzZXJ2aWNlcyIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwiU2VydmVyU2Vzc2lvbiIsIkNvbGxlY3Rpb24iLCJjaGVja0ZvcktleSIsImdldFNlc3Npb25WYWx1ZSIsInZhbHVlcyIsImNvbmRpdGlvbiIsImRlbnkiLCJhcGkiLCJsb2ciLCJzZXNzaW9uT2JqIiwiZXhwZWN0ZWQiLCJpZGVudGljYWwiLCJpc09iamVjdCIsImlzRXF1YWwiLCJzdWJzY3JpYmUiLCJvbkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY2xpZW50SUQiLCJpZCIsImluc2VydCIsIm9uQ2xvc2UiLCJwdWJsaXNoIiwicmFuZG9tU2VlZCIsInVwZGF0ZU9iaiIsIm5ld0NvbmRpdGlvbiIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwic3RlZWRvc0F1dGgiLCJwZXJtaXNzaW9ucyIsInRyeUZldGNoUGx1Z2luc0luZm8iLCJ1c2VyU2Vzc2lvbiIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJBcHBzIiwib2JqZWN0X2xpc3R2aWV3cyIsIm9iamVjdF93b3JrZmxvd3MiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJkYXRhc291cmNlT2JqZWN0cyIsImdldE9iamVjdHMiLCJfb2JqIiwiY29udmVydE9iamVjdCIsInRvQ29uZmlnIiwiZGF0YWJhc2VfbmFtZSIsImdldEFwcHNDb25maWciLCJmdW4iLCJwbHVnaW5zIiwidmVyc2lvbiIsIm9uIiwiY2h1bmsiLCJiaW5kRW52aXJvbm1lbnQiLCJwYXJzZXIiLCJ4bWwyanMiLCJQYXJzZXIiLCJleHBsaWNpdEFycmF5IiwiZXhwbGljaXRSb290IiwicGFyc2VTdHJpbmciLCJlcnIiLCJXWFBheSIsImF0dGFjaCIsImJwciIsImNvZGVfdXJsX2lkIiwic2lnbiIsInd4cGF5IiwiYXBwaWQiLCJtY2hfaWQiLCJwYXJ0bmVyX2tleSIsImNsb25lIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwicyIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJQYWNrYWdlIiwic2VuZCIsInN0cmluZ2lmeSIsInRpbWVFbmQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImJpbGxpbmdfcmVjaGFyZ2UiLCJuZXdfaWQiLCJtb2R1bGVfbmFtZXMiLCJsaXN0cHJpY2VzIiwib25lX21vbnRoX3l1YW4iLCJvcmRlcl9ib2R5IiwicmVzdWx0X29iaiIsInNwYWNlX3VzZXJfY291bnQiLCJsaXN0cHJpY2Vfcm1iIiwibmFtZV96aCIsImNyZWF0ZVVuaWZpZWRPcmRlciIsImpvaW4iLCJvdXRfdHJhZGVfbm8iLCJtb21lbnQiLCJmb3JtYXQiLCJzcGJpbGxfY3JlYXRlX2lwIiwibm90aWZ5X3VybCIsInRyYWRlX3R5cGUiLCJwcm9kdWN0X2lkIiwiaW5mbyIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJzZXRTcGFjZVVzZXJQYXNzd29yZCIsInNwYWNlX3VzZXJfaWQiLCJjdXJyZW50VXNlciIsImxhbmciLCJ1c2VyQ1AiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIlNNU1F1ZXVlIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsInRvRml4ZWQiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInVwIiwidXBkYXRlX2Nmc19pbnN0YW5jZSIsInBhcmVudF9pZCIsImluc3RhbmNlX2lkIiwiYXR0YWNoX3ZlcnNpb24iLCJpc0N1cnJlbnQiLCJtZXRhZGF0YSIsInBhcmVudCIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJhdHRhY2htZW50cyIsImlucyIsImF0dGFjaHMiLCJjdXJyZW50X3ZlciIsIl9yZXYiLCJoaXN0b3J5cyIsImhpcyIsImRvd24iLCJvcmdhbml6YXRpb24iLCJjaGVja19jb3VudCIsIm5ld19vcmdfaWRzIiwicmVtb3ZlZF9vcmdfaWRzIiwicm9vdF9vcmciLCJ1cGRhdGVVc2VycyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQkksU0FBTyxFQUFFLFFBRk87QUFHaEIsWUFBVSxTQUhNO0FBSWhCQyxRQUFNLEVBQUUsUUFKUTtBQUtoQixnQkFBYyxRQUxFO0FBTWhCLGdDQUE4QjtBQU5kLENBQUQsRUFPYixjQVBhLENBQWhCOztBQVNBLElBQUlDLE1BQU0sQ0FBQ0MsUUFBUCxJQUFtQkQsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxPQUF2QyxFQUFnRDtBQUMvQ1Isa0JBQWdCLENBQUM7QUFDaEIsa0JBQWM7QUFERSxHQUFELEVBRWIsY0FGYSxDQUFoQjtBQUdBLEM7Ozs7Ozs7Ozs7O0FDaEJELElBQUlTLEtBQUo7QUFBVVIsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDTyxPQUFLLENBQUNOLENBQUQsRUFBRztBQUFDTSxTQUFLLEdBQUNOLENBQU47QUFBUTs7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LEVBQVEsT0FBUixDQVRiO0FBVUE2WixrQkFBYyxLQVZkO0FBV0FDLGNBQVUsS0FYVjtBQVlBeFosZ0JBQVksRUFaWjtBQWFBK04sVUFBTSxLQWJOO0FBY0EwTCxlQUFXLElBZFg7QUFlQUMsZUFBVyxJQWZYO0FBZ0JBQyxvQkFBZ0IsVUFBQzVhLFFBQUQsRUFBVzdWLE1BQVg7QUFDZixVQUFBOUIsR0FBQSxFQUFBdUgsS0FBQTs7QUFBQSxXQUFPekYsTUFBUDtBQUNDLGVBQU87QUFBQzhFLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNJRzs7QURISlcsY0FBUW9RLFNBQVNwUSxLQUFqQjs7QUFDQSxXQUFPQSxLQUFQO0FBQ0MsYUFBQW9RLFlBQUEsUUFBQTNYLE1BQUEyWCxTQUFBNmEsSUFBQSxZQUFBeHlCLElBQW1CakIsTUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsSUFBNEIsQ0FBNUI7QUFDQ3dJLGtCQUFRb1EsU0FBUzZhLElBQVQsQ0FBY3AwQixXQUFkLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLENBQVI7QUFGRjtBQ1FJOztBRExKLFdBQU9tSixLQUFQO0FBQ0MsZUFBTztBQUFDWCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBTytRLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXHJcblx0Y29va2llczogXCJeMC42LjJcIixcclxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJzcHJpbnRmLWpzXCI6IFwiXjEuMC4zXCIsXHJcblx0XCJ1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFwiOiBcIl43LjAuMFwiLFxyXG59LCAnc3RlZWRvczpiYXNlJyk7XHJcblxyXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nKSB7XHJcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XHRcIndlaXhpbi1wYXlcIjogXCJeMS4xLjdcIlxyXG5cdH0sICdzdGVlZG9zOmJhc2UnKTtcclxufSIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJyAgICAgICBcclxuXHJcbi8vIFJldmVydCBjaGFuZ2UgZnJvbSBNZXRlb3IgMS42LjEgd2hvIHNldCBpZ25vcmVVbmRlZmluZWQ6IHRydWVcclxuLy8gbW9yZSBpbmZvcm1hdGlvbiBodHRwczovL2dpdGh1Yi5jb20vbWV0ZW9yL21ldGVvci9wdWxsLzk0NDRcclxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG5cclxuXHRsZXQgbW9uZ29PcHRpb25zID0ge1xyXG5cdFx0aWdub3JlVW5kZWZpbmVkOiBmYWxzZSxcclxuXHR9O1xyXG5cclxuXHRjb25zdCBtb25nb09wdGlvblN0ciA9IHByb2Nlc3MuZW52Lk1PTkdPX09QVElPTlM7XHJcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdGNvbnN0IGpzb25Nb25nb09wdGlvbnMgPSBKU09OLnBhcnNlKG1vbmdvT3B0aW9uU3RyKTtcclxuXHJcblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xyXG5cdH1cclxuXHJcblx0TW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMobW9uZ29PcHRpb25zKTtcclxufVxyXG5cclxuXHJcbk1ldGVvci5hdXRvcnVuID0gVHJhY2tlci5hdXRvcnVuXHJcbiIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgaWYgKCF0aGlzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYoIWxvY2FsZSl7XHJcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcclxuXHRcdHZhciBwMV9zb3J0X25vID0gcDEuc29ydF9ubyB8fCAwO1xyXG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XHJcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xyXG4gICAgICAgICAgICByZXR1cm4gcDFfc29ydF9ubyA+IHAyX3NvcnRfbm8gPyAtMSA6IDFcclxuICAgICAgICB9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xyXG5cdFx0fVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcclxuICAgIHZhciB2ID0gbmV3IEFycmF5KCk7XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcclxuICAgICAgICB2LnB1c2gobSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB2O1xyXG59XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahHJlbW92ZeWHveaVsFxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xyXG4gICAgaWYgKGZyb20gPCAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xyXG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XHJcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xyXG59O1xyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcclxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUuZmlsdGVyUHJvcGVydHkgPSBmdW5jdGlvbiAoaCwgbCkge1xyXG4gICAgdmFyIGcgPSBbXTtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xyXG4gICAgICAgIHZhciBkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiaWRcIiBpbiBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJfaWRcIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICBnLnB1c2godCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZztcclxufVxyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcclxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xyXG4gICAgdmFyIHIgPSBudWxsO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcclxuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcjtcclxufSIsIlN0ZWVkb3MgPVxyXG5cdHNldHRpbmdzOiB7fVxyXG5cdGRiOiBkYlxyXG5cdHN1YnM6IHt9XHJcblx0aXNQaG9uZUVuYWJsZWQ6IC0+XHJcblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcclxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgbG9jYWxlKS0+XHJcblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcclxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcclxuXHJcblx0XHRpZiAhbnVtYmVyXHJcblx0XHRcdHJldHVybiAnJztcclxuXHJcblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxyXG5cdFx0XHR1bmxlc3MgbG9jYWxlXHJcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG5cdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiIHx8IGxvY2FsZSA9PSBcInpoLUNOXCJcclxuXHRcdFx0XHQjIOS4reaWh+S4h+WIhuS9jei0ouWKoeS6uuWRmOeci+S4jeaDr++8jOaJgOS7peaUueS4uuWbvemZheS4gOagt+eahOWNg+WIhuS9jVxyXG5cdFx0XHRcdHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIlwiXHJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cclxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcclxuXHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIilcclxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXHJcblxyXG4jIyNcclxuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cclxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcclxuIyMjXHJcblxyXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XHJcblx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cclxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXHJcblx0XHRpZiBhY2NvdW50QmdCb2R5XHJcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcclxuXHRcdGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdFx0aWYgdXJsID09IGF2YXRhclxyXG5cdFx0XHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxyXG5cdFx0XHRpZiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cclxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcclxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcclxuXHRcdGlmIGFjY291bnRTa2luXHJcblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXHJcblx0XHRpZiBhY2NvdW50Wm9vbVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcclxuXHRcdHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxyXG5cdFx0dW5sZXNzIHpvb21OYW1lXHJcblx0XHRcdHpvb21OYW1lID0gXCJsYXJnZVwiXHJcblx0XHRcdHpvb21TaXplID0gMS4yXHJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXHJcblx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxyXG5cdFx0XHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXHJcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxyXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxyXG5cdFx0XHQjIGVsc2VcclxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cclxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxyXG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxyXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHJcblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxyXG5cdFx0YXV0aFRva2VuID0ge307XHJcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcclxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcclxuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XHJcblxyXG5cdFx0bGlua2VyID0gXCI/XCJcclxuXHJcblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxyXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxyXG5cclxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcclxuXHJcblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcclxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXHJcblxyXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuXHJcblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcclxuXHRcdGVsc2VcclxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XHJcblxyXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXHJcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcclxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcclxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cclxuXHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxyXG5cclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxyXG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxyXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblx0XHRpZiAhYXBwXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3JcclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcclxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXHJcblx0XHQjIFx0cmVnID0gL1xcLyQvXHJcblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxyXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXHJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxyXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblx0XHQjIFx0cmV0dXJuXHJcblxyXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcclxuXHRcdGlmIGFwcC5pc191c2VfaWVcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdGlmIG9uX2NsaWNrXHJcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxyXG5cclxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcclxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcclxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcclxuXHJcblx0XHRlbHNlIGlmIG9uX2NsaWNrXHJcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXHJcblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xyXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cclxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0bWluX21vbnRocyA9IDFcclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0bWluX21vbnRocyA9IDNcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXHJcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxyXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xyXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXHJcblxyXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XHJcblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xyXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHR3aGVuICdub3JtYWwnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxyXG5cdFx0XHR3aGVuICdsYXJnZSdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC02XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XHJcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xyXG5cclxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXHJcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxyXG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcclxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXHJcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblxyXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XHJcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcclxuXHJcblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cclxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcclxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcclxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XHJcblx0XHRpZiBvZmZzZXRcclxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcclxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xyXG5cclxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cclxuXHRcdERFVklDRSA9XHJcblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xyXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcclxuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXHJcblx0XHRcdGlwYWQ6ICdpcGFkJ1xyXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXHJcblx0XHRcdGlwb2Q6ICdpcG9kJ1xyXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXHJcblx0XHRicm93c2VyID0ge31cclxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xyXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXHJcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcclxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2VcclxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXHJcblx0XHRcdCcnXHJcblx0XHRcdERFVklDRS5kZXNrdG9wXHJcblx0XHRdXHJcblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxyXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcclxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXHJcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXHJcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xyXG5cclxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGlmIGlmclxyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXHJcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxyXG5cdFx0XHRpZnIubG9hZCAtPlxyXG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5JylcclxuXHRcdFx0XHRpZiBpZnJCb2R5XHJcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxyXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXHJcblxyXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRjaGVjayA9IGZhbHNlXHJcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcclxuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXHJcblx0XHRcdGNoZWNrID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGNoZWNrXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxyXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXHJcblx0XHRwYXJlbnRzID0gW11cclxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XHJcblx0XHRcdGlmIG9yZy5wYXJlbnRzXHJcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xyXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxyXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXHJcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcclxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRpID0gMFxyXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcclxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRpKytcclxuXHRcdHJldHVybiBpc09yZ0FkbWluXHJcblxyXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XHJcblx0XHRpZiB1cmxcclxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxyXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXHJcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXHJcblx0XHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHJcblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xyXG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cclxuXHJcblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcclxuXHJcblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcclxuXHJcblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXHJcblxyXG5cdFx0XHRpZiByZXN1bHQuZXJyb3JcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHVzZXJcclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxyXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XHJcblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cclxuXHRcdHRyeVxyXG5cdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcclxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdGtleTMyID0ga2V5ICsgY1xyXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxyXG5cclxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxyXG5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXHJcblxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRyZXR1cm4gdXNlcklkXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cclxuXHJcblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcclxuXHRcdFx0aWYgb2JqXHJcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xyXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxyXG5cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XHJcblx0XHR0cnlcclxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxyXG5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cclxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xyXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcclxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XHJcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxyXG5cclxubWl4aW4gPSAob2JqKSAtPlxyXG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cclxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XHJcblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXHJcblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cclxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXHJcblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXHJcblxyXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXHJcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxyXG5cdFx0aWYgIWRhdGVcclxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXHJcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xyXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XHJcblx0XHRcdGlmIGkgPCBkYXlzXHJcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcclxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxyXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcclxuXHJcblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7RcclxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xyXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcclxuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcclxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxyXG5cclxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxyXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXHJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXHJcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXHJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxyXG5cclxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cclxuXHRcdGogPSAwXHJcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXHJcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IDBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcclxuXHRcdFx0XHRqID0gbGVuLzJcclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxyXG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXHJcblxyXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXHJcblx0XHRcdFx0XHRicmVha1xyXG5cclxuXHRcdFx0XHRpKytcclxuXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gaSArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcclxuXHJcblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcclxuXHJcblx0XHRpZiBqID4gbWF4X2luZGV4XHJcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXHJcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcclxuXHJcblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXHJcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cclxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxyXG5cdFx0XHRpZiBhcHBcclxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblxyXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXHJcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXHJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxyXG5cclxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXHJcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxyXG5cdFx0XHRpZiBpc0kxOG5cclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRcdFx0cmV0dXJuIGxvY2FsZVxyXG5cclxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cclxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXHJcblxyXG5cclxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cclxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxyXG5cdFx0XHR2YWxpZCA9IHRydWVcclxuXHRcdFx0dW5sZXNzIHB3ZFxyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHJcblx0XHRcdHBhc3N3b3JQb2xpY3kgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5XHJcblx0XHRcdHBhc3N3b3JQb2xpY3lFcnJvciA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lFcnJvclxyXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XHJcblx0XHRcdFx0aWYgIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJylcclxuXHRcdFx0XHRcdHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvclxyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHZhbGlkID0gdHJ1ZVxyXG4jXHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHR1bmxlc3MgL1xcZCsvLnRlc3QocHdkKVxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuI1x0XHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcclxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdGlmIHZhbGlkXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBlcnJvcjpcclxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXHJcblxyXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcclxuXHJcblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxyXG5cclxuQ3JlYXRvci5nZXREQkFwcHMgPSAoc3BhY2VfaWQpLT5cclxuXHRkYkFwcHMgPSB7fVxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZvckVhY2ggKGFwcCktPlxyXG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXHJcblxyXG5cdHJldHVybiBkYkFwcHNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXHJcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXHJcblx0XHRyZXR1cm4gYXV0aFRva2VuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxyXG4jXHRcdGVsc2VcclxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcclxuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXHJcblx0XHRcdHJldHVybiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW47ICAgICAgICAgXG5cblN0ZWVkb3MgPSB7XG4gIHNldHRpbmdzOiB7fSxcbiAgZGI6IGRiLFxuICBzdWJzOiB7fSxcbiAgaXNQaG9uZUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgcmV0dXJuICEhKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDAgOiB2b2lkIDApO1xuICB9LFxuICBudW1iZXJUb1N0cmluZzogZnVuY3Rpb24obnVtYmVyLCBsb2NhbGUpIHtcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmICghbG9jYWxlKSB7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIgfHwgbG9jYWxlID09PSBcInpoLUNOXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgYXZhdGFyVXJsLCBiYWNrZ3JvdW5kLCByZWYsIHJlZjEsIHJlZjIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGFjY291bnRCZ0JvZHlWYWx1ZS51cmwpIHtcbiAgICAgIGlmICh1cmwgPT09IGF2YXRhcikge1xuICAgICAgICBhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhcjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKSkgKyBcIilcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYmFja2dyb3VuZCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hZG1pbikgIT0gbnVsbCA/IHJlZjIuYmFja2dyb3VuZCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgY21kLCBlLCBldmFsRnVuU3RyaW5nLCBleGVjLCBvbl9jbGljaywgb3Blbl91cmwsIHBhdGg7XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwKSB7XG4gICAgICBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25fY2xpY2sgPSBhcHAub25fY2xpY2s7XG4gICAgaWYgKGFwcC5pc191c2VfaWUpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgaWYgKG9uX2NsaWNrKSB7XG4gICAgICAgICAgcGF0aCA9IFwiYXBpL2FwcC9zc28vXCIgKyBhcHBfaWQgKyBcIj9hdXRoVG9rZW49XCIgKyAoQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSkgKyBcIiZ1c2VySWQ9XCIgKyAoTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmw7XG4gICAgICAgIH1cbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybCkpIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oYXBwLnVybCk7XG4gICAgfSBlbHNlIGlmIChhcHAuaXNfdXNlX2lmcmFtZSkge1xuICAgICAgaWYgKGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKTtcbiAgICAgIH0gZWxzZSBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbl9jbGljaykge1xuICAgICAgZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7XCIgKyBvbl9jbGljayArIFwifSkoKVwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChldmFsRnVuU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSArIFwiXFxyXFxuXCIgKyBlLnN0YWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgfVxuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2spIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBlbmRfZGF0ZSwgbWluX21vbnRocywgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgfVxuICAgIG1pbl9tb250aHMgPSAxO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICBtaW5fbW9udGhzID0gMztcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBlbmRfZGF0ZSA9IHNwYWNlICE9IG51bGwgPyBzcGFjZS5lbmRfZGF0ZSA6IHZvaWQgMDtcbiAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCkpICE9IG51bGwgPyByZWYubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWYgPSBvcmcuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjIgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYyW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYzID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmM1tcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjFbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMi5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjMgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmLCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZCkgIT0gbnVsbCA/IHJlZi50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5wb2xpY3kgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBwYXNzd29yUG9saWN5RXJyb3IgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAocGFzc3dvclBvbGljeSkge1xuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJykpIHtcbiAgICAgICAgICByZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3I7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XHJcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICBNZXRlb3IubWV0aG9kc1xyXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxyXG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVzaDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRzZXQ6IFxyXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxyXG4gICAgICAgICAgICBlbWFpbHM6IFtcclxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxyXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgICAgICAgICBdXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcclxuICAgICAgICBwID0gbnVsbFxyXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxyXG4gICAgICAgICAgICBwID0gZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVsbDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgcFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcclxuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxyXG5cclxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXHJcbiAgICAgICAgJHNldDpcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgICBlbWFpbDogZW1haWxcclxuXHJcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICByZXR1cm4ge31cclxuXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cclxuICAgICAgICBzd2FsXHJcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXHJcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcclxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcclxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxyXG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcclxuIyMjXHJcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XHJcblxyXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcclxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xyXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxyXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XHJcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IubWV0aG9kc1xyXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XHJcbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XHJcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XHJcblx0fSkoKSxcclxuXHRyZXNldFBhc3N3b3JkOiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XHJcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR2ZXJpZnlFbWFpbDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5yb2xsQWNjb3VudDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXHJcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gIFxyXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcclxuXHRpZiAob3Jncy5jb3VudCgpPjApXHJcblx0e1xyXG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxyXG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fVx0XHJcblxyXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xyXG4gICAgXHRkYXRhOiB7XHJcblx0ICAgICAgXHRyZXQ6IDAsXHJcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcclxuICAgIFx0fVxyXG4gIFx0fSk7XHJcbn0pO1xyXG5cclxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxyXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XHJcbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXHJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXHJcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcclxuXHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxyXG5cdFx0c3BhY2VzID0gW11cclxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cclxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cclxuXHRpY29uOiBcImdsb2JlXCJcclxuXHRjb2xvcjogXCJibHVlXCJcclxuXHR0YWJsZUNvbHVtbnM6IFtcclxuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcclxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXHJcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxyXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcclxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxyXG5cdF1cclxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxyXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXHJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXHJcblx0c2hvd0RlbENvbHVtbjogZmFsc2VcclxuXHRkaXNhYmxlQWRkOiB0cnVlXHJcblx0cGFnZUxlbmd0aDogMTAwXHJcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcclxuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcclxuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXHJcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXHJcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xyXG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XHJcbiAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xyXG4gICAgdmFyIGs7XHJcbiAgICBpZiAobiA+PSAwKSB7XHJcbiAgICAgIGsgPSBuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IGxlbiArIG47XHJcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcclxuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufSIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuXHJcbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcclxuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxyXG4gICAgICB3d3c6IFxyXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcclxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cclxuXHRsaXN0Vmlld3MgPSB7fVxyXG5cclxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXHJcblxyXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cclxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblxyXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxyXG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcclxuXHJcblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cclxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcclxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxyXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBsaXN0Vmlld3NcclxuXHJcblxyXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxyXG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cclxuXHJcblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcclxuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xyXG5cclxuXHJcblxyXG5cclxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIlNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XHJcblxyXG4gIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcclxuICB9O1xyXG4gIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9O1xyXG5cclxuICBDb2xsZWN0aW9uLmRlbnkoe1xyXG4gICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG4gICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXHJcbiAgdmFyIGFwaSA9IHtcclxuICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcclxuICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcclxuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcclxuICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xyXG4gICAgfSxcclxuICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XHJcbiAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcblxyXG4gICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuXHJcbiAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xyXG4gICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xyXG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xyXG4gICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcclxuICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4gICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG4gICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcclxuICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcclxuICAgIC8vICAgfVxyXG4gICAgLy8gfSk7XHJcblxyXG4gICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xyXG4gICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xyXG5cclxuICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xyXG4gICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBNZXRlb3IubWV0aG9kcyh7XHJcbiAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcclxuICAgICAgfSxcclxuICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcclxuXHJcbiAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXHJcbiAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XHJcblxyXG4gICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcclxuICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xyXG5cclxuICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7ICBcclxuXHJcbiAgICAvLyBzZXJ2ZXItb25seSBhcGlcclxuICAgIF8uZXh0ZW5kKGFwaSwge1xyXG4gICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxyXG4gICAgICB9LFxyXG4gICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xyXG4gICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gYXBpO1xyXG59KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcclxuXHJcblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXHJcblxyXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxyXG5cdFx0XHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXHJcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxyXG5cclxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcclxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblxyXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcclxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cclxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcclxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxyXG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cclxuXHRcclxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG4gICAgICAgIGlmIHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG4gICAgICAgICMgdGhlbiBjaGVjayBjb29raWVcclxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuICAgICAgICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLCBcclxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcclxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cclxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogW107XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge30iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXHJcblx0aWYgYXBwXHJcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcclxuXHRlbHNlXHJcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXHJcblxyXG5cdGlmICFyZWRpcmVjdFVybFxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuXHQjIGlmIHJlcS5ib2R5XHJcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHQjIGRlcy1jYmNcclxuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXHJcblx0XHRcdGtleTggPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDhcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDggLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXHJcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxyXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXHJcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0am9pbmVyID0gXCI/XCJcclxuXHJcblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxyXG5cclxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRyZXMuZW5kKClcclxuXHRyZXR1cm5cclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHQjIHRoaXMucGFyYW1zID1cclxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxyXG5cdFx0d2lkdGggPSA1MCA7XHJcblx0XHRoZWlnaHQgPSA1MCA7XHJcblx0XHRmb250U2l6ZSA9IDI4IDtcclxuXHRcdGlmIHJlcS5xdWVyeS53XHJcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XHJcblx0XHRpZiByZXEucXVlcnkuaFxyXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcclxuXHRcdGlmIHJlcS5xdWVyeS5mc1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XHJcblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XHJcblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxyXG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxyXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcclxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcclxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcclxuXHRcdGlmICF1c2VybmFtZVxyXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxyXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcclxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cclxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxyXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cclxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcclxuXHJcblx0XHRcdGluaXRpYWxzID0gJydcclxuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cclxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XHJcblx0XHRcdFx0PC90ZXh0PlxyXG5cdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cclxuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XHJcblx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXHJcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcclxuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cclxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cclxuICAgICAgICBpZiBzcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcclxuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcclxuXHJcblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xyXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxyXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblx0XHR1c2VyU3BhY2VzID0gW11cclxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcclxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cclxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxyXG5cclxuXHRcdGhhbmRsZTIgPSBudWxsXHJcblxyXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXHJcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcclxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0aWYgZG9jLnNwYWNlXHJcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcclxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcclxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXHJcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXHJcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxyXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XHJcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xyXG5cclxuXHRcdHNlbGYucmVhZHkoKTtcclxuXHJcblx0XHRzZWxmLm9uU3RvcCAtPlxyXG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXHJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxyXG5cdHVubGVzcyBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0dW5sZXNzIF9pZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJzdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwocmVxLCByZXMsIG5leHQpLT5cclxuXHR1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuXHRzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucGFyYW1zPy5zcGFjZUlkXHJcblx0aWYgIXVzZXJJZFxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogNDAzLFxyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0YXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XHJcblx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cclxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcclxuXHRcclxuXHR1bmxlc3MgdXNlclNlc3Npb25cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDUwMCxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7bmFtZTogMX19KVxyXG5cclxuXHRyZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZClcclxuXHRyZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uXHJcblx0cmVzdWx0LnNwYWNlID0gc3BhY2VcclxuXHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHNcclxuXHRyZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cylcclxuXHRyZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsICdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZFxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxyXG5cdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXHJcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcclxuXHRcdFx0Xy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCAodiwgayktPlxyXG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3Qodi50b0NvbmZpZygpKVxyXG4jXHRcdFx0XHRfb2JqLm5hbWUgPSBcIiN7bmFtZX0uI3trfVwiXHJcblx0XHRcdFx0X29iai5uYW1lID0ga1xyXG5cdFx0XHRcdF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWVcclxuXHRcdFx0XHRfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pXHJcblx0XHRcdFx0cmVzdWx0Lm9iamVjdHNbX29iai5uYW1lXSA9IF9vYmpcclxuXHRcdFx0KVxyXG5cdF8uZWFjaCBDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgKGRhdGFzb3VyY2UsIG5hbWUpIC0+XHJcblx0XHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIHJlc3VsdC5hcHBzLCBkYXRhc291cmNlLmdldEFwcHNDb25maWcoKVxyXG5cclxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvID0gKGZ1biktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdCMg5Zug5Li6cmVxdWlyZeWHveaVsOS4reWPguaVsOeUqOWPmOmHj+S8oOWFpeeahOivne+8jOWPr+iDveS8mumAoOaIkOebtOaOpeaKpemUmVxyXG5cdFx0XHQjIOWFt+S9k2BuYW1lID0gXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIixpbmZvID0gcmVxdWlyZShuYW1lKWDkvJrmiqXplJnvvIzlj6rog73nlKhgaW5mbyA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIilgXHJcblx0XHRcdCMg5L2G5pivYG5hbWUgPSBcIkBzdGVlZG9zL2NvcmUvcGFja2FnZS5qc29uXCIsaW5mbyA9IHJlcXVpcmUobmFtZSlg5Y205LiN5Lya5oql6ZSZXHJcblx0XHRcdCMg5omA5Lul6L+Z6YeM5oqK5pW05LiqZnVu5Lyg5YWl5omn6KGMXHJcblx0XHRcdGZ1bigpXHJcblx0XHRjYXRjaFxyXG5cclxuXHRyZXN1bHQucGx1Z2lucyA9IHt9XHJcblx0dHJ5RmV0Y2hQbHVnaW5zSW5mbyAtPlxyXG5cdFx0cmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9jb3JlXCJdID0gdmVyc2lvbjogcmVxdWlyZShcIkBzdGVlZG9zL2NvcmUvcGFja2FnZS5qc29uXCIpPy52ZXJzaW9uXHJcblx0dHJ5RmV0Y2hQbHVnaW5zSW5mbyAtPlxyXG5cdFx0cmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9vYmplY3RxbFwiXSA9IHZlcnNpb246IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIik/LnZlcnNpb25cclxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvIC0+XHJcblx0XHRyZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL2FjY291bnRzXCJdID0gdmVyc2lvbjogcmVxdWlyZShcIkBzdGVlZG9zL2FjY291bnRzL3BhY2thZ2UuanNvblwiKT8udmVyc2lvblxyXG5cdHRyeUZldGNoUGx1Z2luc0luZm8gLT5cclxuXHRcdHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3dcIl0gPSB2ZXJzaW9uOiByZXF1aXJlKFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3cvcGFja2FnZS5qc29uXCIpPy52ZXJzaW9uXHJcblxyXG5cdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRjb2RlOiAyMDAsXHJcblx0XHRkYXRhOiByZXN1bHRcclxuIiwidmFyIHN0ZWVkb3NBdXRoO1xuXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvYm9vdHN0cmFwLzpzcGFjZUlkL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXV0aFRva2VuLCBwZXJtaXNzaW9ucywgcmVmLCByZXN1bHQsIHNwYWNlLCBzcGFjZUlkLCB0cnlGZXRjaFBsdWdpbnNJbmZvLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ107XG4gIHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDMsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkoYXV0aFRva2VuLCBzcGFjZUlkKTtcbiAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDUwMCxcbiAgICAgIGRhdGE6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgcmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xuICByZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uO1xuICByZXN1bHQuc3BhY2UgPSBzcGFjZTtcbiAgcmVzdWx0LmFwcHMgPSBfLmV4dGVuZChDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSwgQ3JlYXRvci5BcHBzKTtcbiAgcmVzdWx0Lm9iamVjdF9saXN0dmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgcmVzdWx0Lm9iamVjdHMpO1xuICByZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsKCdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbih2LCB1c2VyU2Vzc2lvbiwgY2IpIHtcbiAgICByZXR1cm4gdi5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIGRhdGFzb3VyY2VPYmplY3RzO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKCk7XG4gICAgICByZXR1cm4gXy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHZhciBfb2JqO1xuICAgICAgICBfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KHYudG9Db25maWcoKSk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJldHVybiByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKHJlc3VsdC5hcHBzLCBkYXRhc291cmNlLmdldEFwcHNDb25maWcoKSk7XG4gIH0pO1xuICB0cnlGZXRjaFBsdWdpbnNJbmZvID0gZnVuY3Rpb24oZnVuKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW4oKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgfVxuICB9O1xuICByZXN1bHQucGx1Z2lucyA9IHt9O1xuICB0cnlGZXRjaFBsdWdpbnNJbmZvKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiByZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL2NvcmVcIl0gPSB7XG4gICAgICB2ZXJzaW9uOiAocmVmMSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9jb3JlL3BhY2thZ2UuanNvblwiKSkgIT0gbnVsbCA/IHJlZjEudmVyc2lvbiA6IHZvaWQgMFxuICAgIH07XG4gIH0pO1xuICB0cnlGZXRjaFBsdWdpbnNJbmZvKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiByZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL29iamVjdHFsXCJdID0ge1xuICAgICAgdmVyc2lvbjogKHJlZjEgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWwvcGFja2FnZS5qc29uXCIpKSAhPSBudWxsID8gcmVmMS52ZXJzaW9uIDogdm9pZCAwXG4gICAgfTtcbiAgfSk7XG4gIHRyeUZldGNoUGx1Z2luc0luZm8oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjE7XG4gICAgcmV0dXJuIHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3MvYWNjb3VudHNcIl0gPSB7XG4gICAgICB2ZXJzaW9uOiAocmVmMSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hY2NvdW50cy9wYWNrYWdlLmpzb25cIikpICE9IG51bGwgPyByZWYxLnZlcnNpb24gOiB2b2lkIDBcbiAgICB9O1xuICB9KTtcbiAgdHJ5RmV0Y2hQbHVnaW5zSW5mbyhmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmMTtcbiAgICByZXR1cm4gcmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9zdGVlZG9zLXBsdWdpbi13b3JrZmxvd1wiXSA9IHtcbiAgICAgIHZlcnNpb246IChyZWYxID0gcmVxdWlyZShcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXdvcmtmbG93L3BhY2thZ2UuanNvblwiKSkgIT0gbnVsbCA/IHJlZjEudmVyc2lvbiA6IHZvaWQgMFxuICAgIH07XG4gIH0pO1xuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRib2R5ID0gXCJcIlxyXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XHJcblx0XHRcdGJvZHkgKz0gY2h1bmtcclxuXHRcdClcclxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxyXG5cdFx0XHRcdHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpXHJcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxyXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0IyDnibnliKvmj5DphpLvvJrllYbmiLfns7vnu5/lr7nkuo7mlK/ku5jnu5PmnpzpgJrnn6XnmoTlhoXlrrnkuIDlrpropoHlgZrnrb7lkI3pqozor4Es5bm25qCh6aqM6L+U5Zue55qE6K6i5Y2V6YeR6aKd5piv5ZCm5LiO5ZWG5oi35L6n55qE6K6i5Y2V6YeR6aKd5LiA6Ie077yM6Ziy5q2i5pWw5o2u5rOE5ryP5a+86Ie05Ye6546w4oCc5YGH6YCa55+l4oCd77yM6YCg5oiQ6LWE6YeR5o2f5aSxXHJcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRcdFx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXHJcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcclxuXHRcdFx0XHRcdFx0Y29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWRcclxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxyXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXHJcblx0XHRcdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe19pZDogY29kZV91cmxfaWR9LCB7JHNldDoge3BhaWQ6IHRydWV9fSlcclxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpLCAoZXJyKS0+XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnXHJcblx0XHRcdClcclxuXHRcdClcclxuXHRcdFxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXHJcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcclxuXHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cclxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XHJcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcclxuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXHJcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXHJcblx0XHRyZVZhbHVlID1cclxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdGlzTGltaXQgPSBmYWxzZVxyXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcclxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcclxuXHJcblx0XHRpZiBsaW1pdHMubGVuZ3RoXHJcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdFx0XHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cclxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xyXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcclxuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3NcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xyXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXHJcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcclxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXHJcblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxyXG5cclxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcclxuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcclxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcclxuXHJcblx0XHRpZiBpc0xpbWl0XHJcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxyXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxyXG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXHJcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cclxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcclxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblx0XHRyZXR1cm4gcmVWYWx1ZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcclxuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xyXG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xyXG5cclxuICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xyXG4gICAgICAgIG9iai5rZXkgPSBrZXk7XHJcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgIH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGMgPiAwKSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSkiLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XHJcblx0XHRjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpXHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHJcblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRpZiBzcGFjZV9pZFxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGVsc2VcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRyZXN1bHQgPSBbXVxyXG5cdFx0c3BhY2VzLmZvckVhY2ggKHMpIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGUgPSB7fVxyXG5cdFx0XHRcdGUuX2lkID0gcy5faWRcclxuXHRcdFx0XHRlLm5hbWUgPSBzLm5hbWVcclxuXHRcdFx0XHRlLmVyciA9IGVyclxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcclxuXHRcdGlmIHJlc3VsdC5sZW5ndGggPiAwXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbFxyXG5cdFx0XHRcdEVtYWlsLnNlbmRcclxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcclxuXHRcdFx0XHRcdGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb21cclxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcclxuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXHJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcclxuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xyXG5cclxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxyXG5cclxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXHJcblxyXG5cdFx0dW5sZXNzIHVzZXJfaWRcclxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxyXG5cclxuXHRcdHJldHVybiB1c2VybmFtZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXHJcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxyXG5cdFx0Y2hlY2sgZW5kX2RhdGUsIFN0cmluZyBcclxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcclxuXHJcblx0XHR1c2VyX2lkID0gdGhpcy51c2VySWRcclxuXHJcblx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0b3JkZXJfYm9keSA9IFtdXHJcblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XHJcblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXHJcblx0XHRcdG9yZGVyX2JvZHkucHVzaCBtLm5hbWVfemhcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgbm90IHNwYWNlLmlzX3BhaWRcclxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXHJcblx0XHRcdGlmIHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuKjEwMFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxyXG5cclxuXHRcdHJlc3VsdF9vYmogPSB7fVxyXG5cclxuXHRcdGF0dGFjaCA9IHt9XHJcblx0XHRhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWRcclxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblxyXG5cdFx0d3hwYXkgPSBXWFBheSh7XHJcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXHJcblx0XHR9KVxyXG5cclxuXHRcdHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XHJcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXHJcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHR0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcclxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXHJcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXHJcblx0XHRcdHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxyXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXHJcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxyXG5cdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKGVyciwgcmVzdWx0KSAtPiBcclxuXHRcdFx0XHRpZiBlcnIgXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xyXG5cdFx0XHRcdGlmIHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqID0ge31cclxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcclxuXHRcdFx0XHRcdG9iai5jcmVhdGVkID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XHJcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKVxyXG5cdFx0XHQpLCAoKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50J1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblxyXG5cdFx0XHJcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xyXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXHJcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcclxuXHJcblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcclxuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xyXG5cclxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXHJcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcclxuXHJcbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xyXG4gICAgICAgICAgICBfaWQ6IHtcclxuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHJcbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcclxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxyXG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxyXG4gICAgICAgICAgICBpZiBmbFxyXG4gICAgICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXHJcbiAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxyXG5cclxuICAgICAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcclxuICAgICAgICAgICAgICAgIGlmIHBlcm1zXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG5cclxuICAgICAgICBvd3MgPSBvd3MuZmlsdGVyIChuKS0+XHJcbiAgICAgICAgICAgIHJldHVybiBuLmZsb3dfbmFtZVxyXG5cclxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmwpIHtcbiAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0U3BhY2VVc2VyUGFzc3dvcmQ6IChzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIC0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXHJcblx0XHRcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxyXG5cdFx0aXNTcGFjZUFkbWluID0gc3BhY2U/LmFkbWlucz8uaW5jbHVkZXModGhpcy51c2VySWQpXHJcblxyXG5cdFx0dW5sZXNzIGlzU3BhY2VBZG1pblxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcclxuXHJcblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblx0XHR1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XHJcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxyXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXHJcblxyXG5cdFx0U3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKVxyXG5cclxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7bG9nb3V0OiB0cnVlfSlcclxuXHJcblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxyXG5cdFx0aWYgdXNlckNQLm1vYmlsZVxyXG5cdFx0XHRsYW5nID0gJ2VuJ1xyXG5cdFx0XHRpZiB1c2VyQ1AubG9jYWxlIGlzICd6aC1jbidcclxuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xyXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXHJcblx0XHRcdFx0Rm9ybWF0OiAnSlNPTicsXHJcblx0XHRcdFx0QWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXHJcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxyXG5cdFx0XHRcdFJlY051bTogdXNlckNQLm1vYmlsZSxcclxuXHRcdFx0XHRTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXHJcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcclxuXHRcdFx0XHRtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7bmFtZTpjdXJyZW50VXNlci5uYW1lfSwgbGFuZylcclxuXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCByZWYsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcl9pZDtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBpZiAoIWlzU3BhY2VBZG1pbikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtcbiAgICAgIGxvZ291dDogdHJ1ZVxuICAgIH0pO1xuICAgIGlmICh1c2VyQ1AubW9iaWxlKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHtcbiAgICAgICAgICBuYW1lOiBjdXJyZW50VXNlci5uYW1lXG4gICAgICAgIH0sIGxhbmcpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYmlsbGluZ01hbmFnZXIgPSB7fVxyXG5cclxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcclxuIyBzcGFjZV9pZCDnu5Pnrpflr7nosaHlt6XkvZzljLpcclxuIyBhY2NvdW50aW5nX21vbnRoIOe7k+eul+aciO+8jOagvOW8j++8mllZWVlNTVxyXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cclxuXHRjb3VudF9kYXlzID0gMFxyXG5cclxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXHJcblxyXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXHJcblx0Zmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlXHJcblxyXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXHJcblx0c3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMS1lbmRfZGF0ZV90aW1lLmdldERhdGUoKSlcclxuXHJcblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxyXG5cdFx0IyBkbyBub3RoaW5nXHJcblx0ZWxzZSBpZiBzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgYW5kIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZVxyXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXHJcblx0ZWxzZSBpZiBmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZVxyXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXHJcblxyXG5cdHJldHVybiB7XCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXN9XHJcblxyXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxyXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSAoc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSktPlxyXG5cdGxhc3RfYmlsbCA9IG51bGxcclxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxyXG5cclxuXHQjIOiOt+WPluato+W4uOS7mOasvueahOWwj+S6jnJlZnJlc2hfZGF0ZeeahOacgOi/keeahOS4gOadoeiusOW9lVxyXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHR7XHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0Y3JlYXRlZDoge1xyXG5cdFx0XHRcdCRsdDogcmVmcmVzaF9kYXRlXHJcblx0XHRcdH0sXHJcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KVxyXG5cdGlmIHBheW1lbnRfYmlsbFxyXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXHJcblx0ZWxzZVxyXG5cdFx0IyDojrflj5bmnIDmlrDnmoTnu5PnrpfnmoTkuIDmnaHorrDlvZVcclxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKVxyXG5cclxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0aWYgYXBwX2JpbGxcclxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcclxuXHJcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXHJcblxyXG5cdGRlYml0cyA9IGlmIGJpbGwuZGViaXRzIHRoZW4gYmlsbC5kZWJpdHMgZWxzZSAwLjBcclxuXHRjcmVkaXRzID0gaWYgYmlsbC5jcmVkaXRzIHRoZW4gYmlsbC5jcmVkaXRzIGVsc2UgMC4wXHJcblx0c2V0T2JqID0gbmV3IE9iamVjdFxyXG5cdHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxyXG5cdHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlXHJcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxyXG5cclxuIyDnu5PnrpflvZPmnIjnmoTmlK/lh7rkuI7kvZnpop1cclxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cclxuXHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKVxyXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cclxuXHRkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzL2RheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpXHJcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdHtcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcclxuXHRcdFx0XHQkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdClcclxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcclxuXHJcblx0bm93ID0gbmV3IERhdGVcclxuXHRuZXdfYmlsbCA9IG5ldyBPYmplY3RcclxuXHRuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKClcclxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxyXG5cdG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcclxuXHRuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxyXG5cdG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZVxyXG5cdG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XHJcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXHJcblx0bmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxyXG5cdG5ld19iaWxsLmNyZWF0ZWQgPSBub3dcclxuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xyXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxyXG5cdGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XHJcblx0cmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheVxyXG5cdGRiLmJpbGxpbmdzLmZpbmQoXHJcblx0XHR7XHJcblx0XHRcdGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cclxuXHRcdH1cclxuXHQpLmZvckVhY2ggKGJpbGwpLT5cclxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXHJcblxyXG5cdGlmIHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxyXG5cdG1vZHVsZXMgPSBuZXcgQXJyYXlcclxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxyXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcclxuXHJcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxyXG5cdFx0bV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRtb2R1bGU6IG0ubmFtZSxcclxuXHRcdFx0XHRjaGFuZ2VfZGF0ZToge1xyXG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjcmVhdGVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0XHQjIOiLpeacquiOt+W+l+WPr+WMuemFjeeahOiusOW9le+8jOivtOaYjuivpW1vZHVsZeacquWuieijhe+8jOW9k+aciOS4jeiuoeeul+i0ueeUqFxyXG5cdFx0aWYgbm90IG1fY2hhbmdlbG9nXHJcblx0XHRcdCMgIGRvIG5vdGhpbmdcclxuXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJxpbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5a6J6KOF77yM5Zug5q2k6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcclxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJx1bmluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Lljbjovb3vvIzlm6DmraTkuI3orqHnrpfotLnnlKhcclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxyXG5cdFx0XHQjICBkbyBub3RoaW5nXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRl4omlc3RhcnRkYXRl77yM6K+05piO5b2T5pyI5YaF5Y+R55Sf6L+H5a6J6KOF5oiW5Y246L2955qE5pON5L2c77yM6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcclxuXHJcblx0cmV0dXJuIG1vZHVsZXNcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSAoKS0+XHJcblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XHJcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCgobSktPlxyXG5cdFx0bW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKVxyXG5cdClcclxuXHRyZXR1cm4gbW9kdWxlc19uYW1lXHJcblxyXG5cclxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxyXG5cdGlmIGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcclxuXHRcdHJldHVyblxyXG5cdGlmIGFjY291bnRpbmdfbW9udGggPT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXHJcblx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxyXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0ZGViaXRzID0gMFxyXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXHJcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YmlsbGluZ19kYXRlOiBiX20sXHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdHRyYW5zYWN0aW9uOiB7XHJcblx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KS5mb3JFYWNoKChiKS0+XHJcblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xyXG5cdFx0KVxyXG5cdFx0bmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWR9LCB7c29ydDoge21vZGlmaWVkOiAtMX19KVxyXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2VcclxuXHRcdHJlbWFpbmluZ19tb250aHMgPSAwXHJcblx0XHRpZiBiYWxhbmNlID4gMFxyXG5cdFx0XHRpZiBkZWJpdHMgPiAwXHJcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UvZGViaXRzKSArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XHJcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IDFcclxuXHJcblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfaWRcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdFx0XHRcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0ZWxzZVxyXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXHJcblx0XHRwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxyXG5cdFx0aWYgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT0gMFxyXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZClcclxuXHJcblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXHJcblx0XHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxyXG5cdFx0XHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdFx0ZGIuYmlsbGluZ3MucmVtb3ZlKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRcdHRyYW5zYWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdFx0IyDnu5PnrpflvZPmnIjnmoRBUFDkvb/nlKjlkI7kvZnpop1cclxuXHRcdFx0bW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxyXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxyXG5cdFx0XHRcdF8uZWFjaCBtb2R1bGVzLCAobSktPlxyXG5cdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKVxyXG5cclxuXHRcdGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKVxyXG5cdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSAoc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cclxuXHRtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXlcclxuXHJcblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxyXG5cclxuXHRtID0gbW9tZW50KClcclxuXHRub3cgPSBtLl9kXHJcblxyXG5cdHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0XHJcblxyXG5cdCMg5pu05pawc3BhY2XmmK/lkKbkuJPkuJrniYjnmoTmoIforrBcclxuXHRpZiBzcGFjZS5pc19wYWlkIGlzbnQgdHJ1ZVxyXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxyXG5cdFx0c3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGVcclxuXHJcblx0IyDmm7TmlrBtb2R1bGVzXHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vd1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxyXG5cdHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSlcclxuXHRzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XHJcblxyXG5cdHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzcGFjZV9pZH0sIHskc2V0OiBzcGFjZV91cGRhdGVfb2JqfSlcclxuXHRpZiByXHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cclxuXHRcdFx0bWNsID0gbmV3IE9iamVjdFxyXG5cdFx0XHRtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRcdG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkXHJcblx0XHRcdG1jbC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxyXG5cdFx0XHRtY2wubW9kdWxlID0gbW9kdWxlXHJcblx0XHRcdG1jbC5jcmVhdGVkID0gbm93XHJcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxyXG5cclxuXHRyZXR1cm4iLCIgICAgICAgICAgICAgICAgICAgXG5cbmJpbGxpbmdNYW5hZ2VyID0ge307XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBiaWxsaW5nLCBjb3VudF9kYXlzLCBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgZmlyc3RfZGF0ZSwgc3RhcnRfZGF0ZSwgc3RhcnRfZGF0ZV90aW1lO1xuICBjb3VudF9kYXlzID0gMDtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwiXG4gIH0pO1xuICBmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGU7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEgLSBlbmRfZGF0ZV90aW1lLmdldERhdGUoKSk7XG4gIGlmIChmaXJzdF9kYXRlID49IGVuZF9kYXRlKSB7XG5cbiAgfSBlbHNlIGlmIChzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgJiYgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH0gZWxzZSBpZiAoZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFwiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzXG4gIH07XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKSB7XG4gIHZhciBhcHBfYmlsbCwgYl9tLCBiX21fZCwgYmlsbCwgY3JlZGl0cywgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgcGF5bWVudF9iaWxsLCBzZXRPYmo7XG4gIGxhc3RfYmlsbCA9IG51bGw7XG4gIGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDogcmVmcmVzaF9kYXRlXG4gIH0pO1xuICBwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDoge1xuICAgICAgJGx0OiByZWZyZXNoX2RhdGVcbiAgICB9LFxuICAgIGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgaWYgKHBheW1lbnRfYmlsbCkge1xuICAgIGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbDtcbiAgfSBlbHNlIHtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICBhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgYmlsbGluZ19tb250aDogYl9tXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoYXBwX2JpbGwpIHtcbiAgICAgIGxhc3RfYmlsbCA9IGFwcF9iaWxsO1xuICAgIH1cbiAgfVxuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgZGViaXRzID0gYmlsbC5kZWJpdHMgPyBiaWxsLmRlYml0cyA6IDAuMDtcbiAgY3JlZGl0cyA9IGJpbGwuY3JlZGl0cyA/IGJpbGwuY3JlZGl0cyA6IDAuMDtcbiAgc2V0T2JqID0gbmV3IE9iamVjdDtcbiAgc2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogYmlsbC5faWRcbiAgfSwge1xuICAgICRzZXQ6IHNldE9ialxuICB9KTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpIHtcbiAgdmFyIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgZGF5c19udW1iZXIsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIG5ld19iaWxsLCBub3c7XG4gIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKTtcbiAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICBkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzIC8gZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSk7XG4gIGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBiaWxsaW5nX2RhdGU6IHtcbiAgICAgICRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgbm93ID0gbmV3IERhdGU7XG4gIG5ld19iaWxsID0gbmV3IE9iamVjdDtcbiAgbmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpO1xuICBuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aDtcbiAgbmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdDtcbiAgbmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZDtcbiAgbmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZTtcbiAgbmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlO1xuICBuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgbmV3X2JpbGwuZGViaXRzID0gZGViaXRzO1xuICBuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBuZXdfYmlsbC5jcmVhdGVkID0gbm93O1xuICBuZXdfYmlsbC5tb2RpZmllZCA9IG5vdztcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkuY291bnQoKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZnJlc2hfZGF0ZXM7XG4gIHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXk7XG4gIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgIGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAkaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl1cbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGJpbGwpIHtcbiAgICByZXR1cm4gcmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZCk7XG4gIH0pO1xuICBpZiAocmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWZyZXNoX2RhdGVzLCBmdW5jdGlvbihyX2QpIHtcbiAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBtb2R1bGVzLCBzdGFydF9kYXRlO1xuICBtb2R1bGVzID0gbmV3IEFycmF5O1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBtX2NoYW5nZWxvZztcbiAgICBtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG1vZHVsZTogbS5uYW1lLFxuICAgICAgY2hhbmdlX2RhdGU6IHtcbiAgICAgICAgJGx0ZTogZW5kX2RhdGVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH0pO1xuICAgIGlmICghbV9jaGFuZ2Vsb2cpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJpbnN0YWxsXCIpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcInVuaW5zdGFsbFwiKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGUpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXM7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtb2R1bGVzX25hbWU7XG4gIG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlc19uYW1lO1xufTtcblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciBhX20sIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgYl9tLCBiX21fZCwgYmFsYW5jZSwgZGViaXRzLCBtb2R1bGVzLCBtb2R1bGVzX25hbWUsIG5ld2VzdF9iaWxsLCBwZXJpb2RfcmVzdWx0LCByZW1haW5pbmdfbW9udGhzLCB1c2VyX2NvdW50O1xuICBpZiAoYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWNjb3VudGluZ19tb250aCA9PT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIGRlYml0cyA9IDA7XG4gICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICAgIGJpbGxpbmdfZGF0ZTogYl9tLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBkZWJpdHMgKz0gYi5kZWJpdHM7XG4gICAgfSk7XG4gICAgbmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2U7XG4gICAgcmVtYWluaW5nX21vbnRocyA9IDA7XG4gICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICBpZiAoZGViaXRzID4gMCkge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZSAvIGRlYml0cykgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBiYWxhbmNlOiBiYWxhbmNlLFxuICAgICAgICBcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgaWYgKHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09PSAwKSB7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgICAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgZGIuYmlsbGluZ3MucmVtb3ZlKHtcbiAgICAgICAgYmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChtb2R1bGVzLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSBmdW5jdGlvbihzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICB2YXIgbSwgbW9kdWxlcywgbmV3X21vZHVsZXMsIG5vdywgciwgc3BhY2UsIHNwYWNlX3VwZGF0ZV9vYmo7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXk7XG4gIG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcyk7XG4gIG0gPSBtb21lbnQoKTtcbiAgbm93ID0gbS5fZDtcbiAgc3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3Q7XG4gIGlmIChzcGFjZS5pc19wYWlkICE9PSB0cnVlKSB7XG4gICAgc3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZTtcbiAgICBzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZTtcbiAgfVxuICBzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3c7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZDtcbiAgc3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKTtcbiAgc3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzcGFjZV91cGRhdGVfb2JqXG4gIH0pO1xuICBpZiAocikge1xuICAgIF8uZWFjaChuZXdfbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICB2YXIgbWNsO1xuICAgICAgbWNsID0gbmV3IE9iamVjdDtcbiAgICAgIG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpO1xuICAgICAgbWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkO1xuICAgICAgbWNsLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCI7XG4gICAgICBtY2wubW9kdWxlID0gbW9kdWxlO1xuICAgICAgbWNsLmNyZWF0ZWQgPSBub3c7XG4gICAgICByZXR1cm4gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpO1xuICAgIH0pO1xuICB9XG59O1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG5cclxuICBpZiAoTWV0ZW9yLnNldHRpbmdzLmNyb24gJiYgTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcykge1xyXG5cclxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcclxuICAgIC8vIOWumuaXtuaJp+ihjOe7n+iuoVxyXG4gICAgdmFyIHJ1bGUgPSBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzO1xyXG5cclxuICAgIHZhciBnb19uZXh0ID0gdHJ1ZTtcclxuXHJcbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCFnb19uZXh0KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xyXG5cclxuICAgICAgY29uc29sZS50aW1lKCdzdGF0aXN0aWNzJyk7XHJcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcclxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgIHZhciBkYXRla2V5ID0gXCJcIitkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrKGRhdGUuZ2V0TW9udGgoKSsxKStcIi1cIisoZGF0ZS5nZXREYXRlKCkpO1xyXG4gICAgICAgIHJldHVybiBkYXRla2V5O1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDorqHnrpfliY3kuIDlpKnml7bpl7RcclxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZE5vdyA9IG5ldyBEYXRlKCk7ICAgLy/lvZPliY3ml7bpl7RcclxuICAgICAgICB2YXIgZEJlZm9yZSA9IG5ldyBEYXRlKGROb3cuZ2V0VGltZSgpIC0gMjQqMzYwMCoxMDAwKTsgICAvL+W+l+WIsOWJjeS4gOWkqeeahOaXtumXtFxyXG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDnu5/orqHlvZPml6XmlbDmja5cclxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjpzcGFjZVtcIl9pZFwiXSxcImNyZWF0ZWRcIjp7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcclxuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmn6Xor6LmgLvmlbBcclxuICAgICAgdmFyIHN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXHJcbiAgICAgIHZhciBvd25lck5hbWUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6IHNwYWNlW1wib3duZXJcIl19KTtcclxuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xyXG4gICAgICB2YXIgbGFzdExvZ29uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGxhc3RMb2dvbiA9IDA7XHJcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXHJcbiAgICAgICAgc1VzZXJzLmZvckVhY2goZnVuY3Rpb24gKHNVc2VyKSB7XHJcbiAgICAgICAgICB2YXIgdXNlciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjpzVXNlcltcInVzZXJcIl19KTtcclxuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xyXG4gICAgICAgICAgICBsYXN0TG9nb24gPSB1c2VyLmxhc3RfbG9nb247XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGFzdExvZ29uO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cclxuICAgICAgdmFyIGxhc3RNb2RpZmllZCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBvYmogPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGxpbWl0OiAxfSk7XHJcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xyXG4gICAgICAgIGlmKG9iakFyci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgdmFyIG1vZCA9IG9iakFyclswXS5tb2RpZmllZDtcclxuICAgICAgICAgIHJldHVybiBtb2Q7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOaWh+eroOmZhOS7tuWkp+Wwj1xyXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcclxuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XHJcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xyXG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6cG9zdFtcIl9pZFwiXX0pO1xyXG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcclxuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xyXG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XHJcbiAgICAgICAgICB9KSAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5b2T5pel5paw5aKe6ZmE5Lu25aSn5bCPXHJcbiAgICAgIHZhciBkYWlseVBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XHJcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xyXG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcclxuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOiBwb3N0W1wiX2lkXCJdLCBcInVwbG9hZGVkQXRcIjogeyRndDogeWVzdGVyRGF5KCl9fSk7XHJcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XHJcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5o+S5YWl5pWw5o2uXHJcbiAgICAgIGRiLnNwYWNlcy5maW5kKHtcImlzX3BhaWRcIjp0cnVlfSkuZm9yRWFjaChmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICBkYi5zdGVlZG9zX3N0YXRpc3RpY3MuaW5zZXJ0KHtcclxuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcclxuICAgICAgICAgIHNwYWNlX25hbWU6IHNwYWNlW1wibmFtZVwiXSxcclxuICAgICAgICAgIGJhbGFuY2U6IHNwYWNlW1wiYmFsYW5jZVwiXSxcclxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxyXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcclxuICAgICAgICAgIHN0ZWVkb3M6e1xyXG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHN0YXRpY3NDb3VudChkYi5vcmdhbml6YXRpb25zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGxhc3RfbG9nb246IGxhc3RMb2dvbihkYi51c2Vycywgc3BhY2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgd29ya2Zsb3c6e1xyXG4gICAgICAgICAgICBmbG93czogc3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZmxvd19yb2xlczogc3RhdGljc0NvdW50KGRiLmZsb3dfcm9sZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZmxvd19wb3NpdGlvbnM6IHN0YXRpY3NDb3VudChkYi5mbG93X3Bvc2l0aW9ucywgc3BhY2UpLFxyXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfZmxvd3M6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9pbnN0YW5jZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY21zOiB7XHJcbiAgICAgICAgICAgIHNpdGVzOiBzdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzOiBzdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogcG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgY29tbWVudHM6IHN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9wb3N0czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2NvbW1lbnRzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgY29uc29sZS50aW1lRW5kKCdzdGF0aXN0aWNzJyk7XHJcblxyXG4gICAgICBnb19uZXh0ID0gdHJ1ZTtcclxuXHJcbiAgICB9LCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCcpO1xyXG4gICAgfSkpO1xyXG5cclxuICB9XHJcblxyXG59KVxyXG5cclxuXHJcblxyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogMVxyXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxyXG4gICAgICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpKytcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDJcclxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDNcclxuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogNFxyXG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNaWdyYXRpb25zLmFkZFxyXG5cdFx0dmVyc2lvbjogNVxyXG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0XHR0cnlcclxuXHJcblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XHJcblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcclxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXHJcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcclxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXHJcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxyXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cclxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcclxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXHJcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0ZG93bjogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDZcclxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxyXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+agh+WHhueJiFwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cclxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XHJcblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxyXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcclxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxyXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+agh+WHhueJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdG5ldyBUYWJ1bGFyLlRhYmxlXHJcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXHJcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxyXG5cdFx0Y29sdW1uczogW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHRcdGRvbTogXCJ0cFwiXHJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cclxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2VcclxuXHRcdG9yZGVyaW5nOiBmYWxzZVxyXG5cdFx0cGFnZUxlbmd0aDogMTBcclxuXHRcdGluZm86IGZhbHNlXHJcblx0XHRzZWFyY2hpbmc6IHRydWVcclxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxyXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxyXG5cdFx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
