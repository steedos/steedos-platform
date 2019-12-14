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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGVvcl9maXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc3RlZWRvc191dGlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvY29yZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2ltcGxlX3NjaGVtYV9leHRlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy9sYXN0X2xvZ29uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYWRkX2VtYWlsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL21ldGhvZHMvdXNlcl9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvZW1haWxfdGVtcGxhdGVzX3Jlc2V0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL21ldGhvZHMvdXBncmFkZV9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3N0ZWVkb3MvcHVzaC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2FkbWluLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9hcnJheV9pbmNsdWRlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9zZXR0aW5ncy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi91c2VyX29iamVjdF92aWV3LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9zZXJ2ZXJfc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hcGlfZ2V0X2FwcHMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2NvbGxlY3Rpb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL3Nzby5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvcm91dGVzL2FjY2Vzc190b2tlbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9teV9zcGFjZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL3NwYWNlX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcHVibGljYXRpb25zL21vZHVsZXMuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy93ZWl4aW5fcGF5X2NvZGVfdXJsLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9ib290c3RyYXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2FwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19zZXR0bGV1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiTW9uZ28iLCJpc1NlcnZlciIsIm1vbmdvT3B0aW9ucyIsImlnbm9yZVVuZGVmaW5lZCIsIm1vbmdvT3B0aW9uU3RyIiwicHJvY2VzcyIsImVudiIsIk1PTkdPX09QVElPTlMiLCJqc29uTW9uZ29PcHRpb25zIiwiSlNPTiIsInBhcnNlIiwiT2JqZWN0IiwiYXNzaWduIiwic2V0Q29ubmVjdGlvbk9wdGlvbnMiLCJhdXRvcnVuIiwiVHJhY2tlciIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsImRiIiwic3VicyIsImlzUGhvbmVFbmFibGVkIiwicmVmIiwicmVmMSIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJ0b1N0cmluZyIsInJlcGxhY2UiLCJ2YWxpSnF1ZXJ5U3ltYm9scyIsInN0ciIsInJlZyIsIlJlZ0V4cCIsInRlc3QiLCJnZXRIZWxwVXJsIiwiY291bnRyeSIsInN1YnN0cmluZyIsImlzQ2xpZW50Iiwic3BhY2VVcGdyYWRlZE1vZGFsIiwic3dhbCIsInRpdGxlIiwiVEFQaTE4biIsIl9fIiwidGV4dCIsImh0bWwiLCJ0eXBlIiwiY29uZmlybUJ1dHRvblRleHQiLCJnZXRBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5Iiwic3RlZWRvc19rZXl2YWx1ZXMiLCJmaW5kT25lIiwidXNlciIsInVzZXJJZCIsImtleSIsInZhbHVlIiwiYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUiLCJhY2NvdW50QmdCb2R5VmFsdWUiLCJpc05lZWRUb0xvY2FsIiwiYXZhdGFyIiwiYXZhdGFyVXJsIiwiYmFja2dyb3VuZCIsInJlZjIiLCJ1cmwiLCJsb2dnaW5nSW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiJCIsImNzcyIsImFic29sdXRlVXJsIiwiYWRtaW4iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJ6b29tTmFtZSIsInpvb21TaXplIiwic2l6ZSIsInJlbW92ZUNsYXNzIiwiU2Vzc2lvbiIsImdldCIsImFkZENsYXNzIiwic2hvd0hlbHAiLCJnZXRMb2NhbGUiLCJ3aW5kb3ciLCJvcGVuIiwiZ2V0VXJsV2l0aFRva2VuIiwiYXV0aFRva2VuIiwibGlua2VyIiwiZ2V0U3BhY2VJZCIsIkFjY291bnRzIiwiX3N0b3JlZExvZ2luVG9rZW4iLCJpbmRleE9mIiwicGFyYW0iLCJnZXRBcHBVcmxXaXRoVG9rZW4iLCJhcHBfaWQiLCJvcGVuQXBwV2l0aFRva2VuIiwiYXBwIiwiYXBwcyIsImlzX25ld193aW5kb3ciLCJpc01vYmlsZSIsImlzQ29yZG92YSIsImxvY2F0aW9uIiwib3BlbldpbmRvdyIsIm9wZW5VcmxXaXRoSUUiLCJjbWQiLCJleGVjIiwib3Blbl91cmwiLCJpc05vZGUiLCJudyIsInJlcXVpcmUiLCJlcnJvciIsInN0ZG91dCIsInN0ZGVyciIsInRvYXN0ciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicGF0aCIsInJlZGlyZWN0VG9TaWduSW4iLCJGbG93Um91dGVyIiwiZ28iLCJpc191c2VfaWUiLCJvcmlnaW4iLCJpc0ludGVybmFsQXBwIiwiaXNfdXNlX2lmcmFtZSIsIl9pZCIsImV2YWwiLCJlcnJvcjEiLCJjb25zb2xlIiwibWVzc2FnZSIsInN0YWNrIiwic2V0IiwiY2hlY2tTcGFjZUJhbGFuY2UiLCJzcGFjZUlkIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJpc19wYWlkIiwiRGF0ZSIsInNldE1vZGFsTWF4SGVpZ2h0Iiwib2Zmc2V0IiwiZGV0ZWN0SUUiLCJlYWNoIiwiZm9vdGVySGVpZ2h0IiwiaGVhZGVySGVpZ2h0IiwiaGVpZ2h0IiwidG90YWxIZWlnaHQiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwiaGFzQ2xhc3MiLCJnZXRNb2RhbE1heEhlaWdodCIsInJlVmFsdWUiLCJzY3JlZW4iLCJpc2lPUyIsInVzZXJBZ2VudCIsImxhbmd1YWdlIiwiREVWSUNFIiwiYnJvd3NlciIsImNvbkV4cCIsImRldmljZSIsIm51bUV4cCIsImFuZHJvaWQiLCJibGFja2JlcnJ5IiwiZGVza3RvcCIsImlwYWQiLCJpcGhvbmUiLCJpcG9kIiwibW9iaWxlIiwibmF2aWdhdG9yIiwidG9Mb3dlckNhc2UiLCJicm93c2VyTGFuZ3VhZ2UiLCJtYXRjaCIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiXyIsImZsYXR0ZW4iLCJmaW5kIiwiJGluIiwiZmV0Y2giLCJ1bmlvbiIsImZvcmJpZE5vZGVDb250ZXh0bWVudSIsInRhcmdldCIsImlmciIsImRvY3VtZW50IiwiYm9keSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInByZXZlbnREZWZhdWx0IiwibG9hZCIsImlmckJvZHkiLCJjb250ZW50cyIsImFkbWlucyIsImlzTGVnYWxWZXJzaW9uIiwiYXBwX3ZlcnNpb24iLCJjaGVjayIsIm1vZHVsZXMiLCJpc09yZ0FkbWluQnlPcmdJZHMiLCJvcmdJZHMiLCJhbGxvd0FjY2Vzc09yZ3MiLCJpc09yZ0FkbWluIiwidXNlT3JncyIsImZpbHRlciIsIm9yZyIsInVuaXEiLCJpc09yZ0FkbWluQnlBbGxPcmdJZHMiLCJpIiwicm9vdF91cmwiLCJVUkwiLCJwYXRobmFtZSIsImdldEFQSUxvZ2luVXNlciIsInJlcSIsInJlcyIsInBhc3N3b3JkIiwicmVmMyIsInJlc3VsdCIsInVzZXJuYW1lIiwicXVlcnkiLCJ1c2VycyIsInN0ZWVkb3NfaWQiLCJfY2hlY2tQYXNzd29yZCIsIkVycm9yIiwiY2hlY2tBdXRoVG9rZW4iLCJoZWFkZXJzIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwic3BsaXQiLCJvQXV0aDJTZXJ2ZXIiLCJjb2xsZWN0aW9ucyIsImFjY2Vzc1Rva2VuIiwiZXhwaXJlcyIsImdldFVzZXJJZEZyb21BdXRoVG9rZW4iLCJBUElBdXRoZW50aWNhdGlvbkNoZWNrIiwiSnNvblJvdXRlcyIsInNlbmRSZXN1bHQiLCJkYXRhIiwiY29kZSIsImZ1bmN0aW9ucyIsImZ1bmMiLCJhcmdzIiwiX3dyYXBwZWQiLCJhcmd1bWVudHMiLCJjYWxsIiwiaXNIb2xpZGF5IiwiZGF0ZSIsImRheSIsImdldERheSIsImNhY3VsYXRlV29ya2luZ1RpbWUiLCJkYXlzIiwiY2FjdWxhdGVEYXRlIiwicGFyYW1fZGF0ZSIsIk51bWJlciIsImdldFRpbWUiLCJjYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSIsIm5leHQiLCJjYWN1bGF0ZWRfZGF0ZSIsImZpcnN0X2RhdGUiLCJqIiwibWF4X2luZGV4Iiwic2Vjb25kX2RhdGUiLCJzdGFydF9kYXRlIiwidGltZV9wb2ludHMiLCJyZW1pbmQiLCJpc0VtcHR5Iiwic2V0SG91cnMiLCJob3VyIiwic2V0TWludXRlcyIsIm1pbnV0ZSIsImV4dGVuZCIsImdldFN0ZWVkb3NUb2tlbiIsImFwcElkIiwibm93Iiwic2VjcmV0Iiwic3RlZWRvc190b2tlbiIsInBhcnNlSW50IiwiaXNJMThuIiwiY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eSIsIiRyZWdleCIsIl9lc2NhcGVSZWdFeHAiLCJ0cmltIiwidmFsaWRhdGVQYXNzd29yZCIsInB3ZCIsInBhc3N3b3JQb2xpY3kiLCJwYXNzd29yUG9saWN5RXJyb3IiLCJyZWFzb24iLCJ2YWxpZCIsInBvbGljeSIsInBvbGljeUVycm9yIiwiY29udmVydFNwZWNpYWxDaGFyYWN0ZXIiLCJyZW1vdmVTcGVjaWFsQ2hhcmFjdGVyIiwiQ3JlYXRvciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldEF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsInN0YXJ0dXAiLCJTaW1wbGVTY2hlbWEiLCJleHRlbmRPcHRpb25zIiwiZm9yZWlnbl9rZXkiLCJNYXRjaCIsIk9wdGlvbmFsIiwiQm9vbGVhbiIsInJlZmVyZW5jZXMiLCJtZXRob2RzIiwidXBkYXRlVXNlckxhc3RMb2dvbiIsIiRzZXQiLCJsYXN0X2xvZ29uIiwib25Mb2dpbiIsInVzZXJzX2FkZF9lbWFpbCIsImVtYWlsIiwiY291bnQiLCJlbWFpbHMiLCJkaXJlY3QiLCIkcHVzaCIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsInVzZXJzX3JlbW92ZV9lbWFpbCIsInAiLCIkcHVsbCIsInVzZXJzX3ZlcmlmeV9lbWFpbCIsInVzZXJzX3NldF9wcmltYXJ5X2VtYWlsIiwicHJpbWFyeSIsIm11bHRpIiwic2hvd0NhbmNlbEJ1dHRvbiIsImNsb3NlT25Db25maXJtIiwiYW5pbWF0aW9uIiwiaW5wdXRWYWx1ZSIsInVwZGF0ZVVzZXJBdmF0YXIiLCJlbWFpbFRlbXBsYXRlcyIsImRlZmF1bHRGcm9tIiwicmVzZXRQYXNzd29yZCIsInN1YmplY3QiLCJzcGxpdHMiLCJ0b2tlbkNvZGUiLCJncmVldGluZyIsInByb2ZpbGUiLCJ0b2tlbl9jb2RlIiwidmVyaWZ5RW1haWwiLCJlbnJvbGxBY2NvdW50IiwiYWRkIiwib3JncyIsImZ1bGxuYW1lIiwiJG5lIiwiY2FsY3VsYXRlRnVsbG5hbWUiLCJyZXQiLCJtc2ciLCJQdXNoIiwiQ29uZmlndXJlIiwic2VuZGVySUQiLCJBTkRST0lEX1NFTkRFUl9JRCIsInNvdW5kIiwidmlicmF0ZSIsImlvcyIsImJhZGdlIiwiY2xlYXJCYWRnZSIsImFsZXJ0IiwiYXBwTmFtZSIsIlNlbGVjdG9yIiwic2VsZWN0b3JDaGVja1NwYWNlQWRtaW4iLCJzZWxlY3RvciIsImlzX2Nsb3VkYWRtaW4iLCJtYXAiLCJuIiwic2VsZWN0b3JDaGVja1NwYWNlIiwidSIsImJpbGxpbmdfcGF5X3JlY29yZHMiLCJhZG1pbkNvbmZpZyIsImljb24iLCJjb2xvciIsInRhYmxlQ29sdW1ucyIsImV4dHJhRmllbGRzIiwicm91dGVyQWRtaW4iLCJwYWlkIiwic2hvd0VkaXRDb2x1bW4iLCJzaG93RGVsQ29sdW1uIiwiZGlzYWJsZUFkZCIsInBhZ2VMZW5ndGgiLCJvcmRlciIsInNwYWNlX3VzZXJfc2lnbnMiLCJBZG1pbkNvbmZpZyIsImNvbGxlY3Rpb25zX2FkZCIsInNlYXJjaEVsZW1lbnQiLCJPIiwiY3VycmVudEVsZW1lbnQiLCJ3ZWJzZXJ2aWNlcyIsInd3dyIsInN0YXR1cyIsImdldFVzZXJPYmplY3RzTGlzdFZpZXdzIiwib2JqZWN0cyIsIl9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwia2V5cyIsImxpc3RWaWV3cyIsIm9iamVjdHNWaWV3cyIsImdldENvbGxlY3Rpb24iLCJvYmplY3RfbmFtZSIsIm93bmVyIiwic2hhcmVkIiwiX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MiLCJvbGlzdFZpZXdzIiwib3YiLCJsaXN0dmlldyIsIm8iLCJsaXN0X3ZpZXciLCJnZXRVc2VyT2JqZWN0TGlzdFZpZXdzIiwib2JqZWN0X2xpc3R2aWV3IiwiU2VydmVyU2Vzc2lvbiIsIkNvbGxlY3Rpb24iLCJjaGVja0ZvcktleSIsImdldFNlc3Npb25WYWx1ZSIsInZhbHVlcyIsImNvbmRpdGlvbiIsImRlbnkiLCJhcGkiLCJsb2ciLCJzZXNzaW9uT2JqIiwiZXhwZWN0ZWQiLCJpZGVudGljYWwiLCJpc09iamVjdCIsImlzRXF1YWwiLCJzdWJzY3JpYmUiLCJvbkNvbm5lY3Rpb24iLCJjb25uZWN0aW9uIiwiY2xpZW50SUQiLCJpZCIsImluc2VydCIsIm9uQ2xvc2UiLCJwdWJsaXNoIiwicmFuZG9tU2VlZCIsInVwZGF0ZU9iaiIsIm5ld0NvbmRpdGlvbiIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwiYWxsb3dfbW9kZWxzIiwibW9kZWwiLCJvcHRpb25zIiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwic3RlZWRvc0F1dGgiLCJwZXJtaXNzaW9ucyIsInRyeUZldGNoUGx1Z2luc0luZm8iLCJ1c2VyU2Vzc2lvbiIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZ2V0QWxsUGVybWlzc2lvbnMiLCJBcHBzIiwib2JqZWN0X2xpc3R2aWV3cyIsIm9iamVjdF93b3JrZmxvd3MiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJkYXRhc291cmNlT2JqZWN0cyIsImdldE9iamVjdHMiLCJfb2JqIiwiY29udmVydE9iamVjdCIsInRvQ29uZmlnIiwiZGF0YWJhc2VfbmFtZSIsImdldEFwcHNDb25maWciLCJmdW4iLCJwbHVnaW5zIiwidmVyc2lvbiIsIm9uIiwiY2h1bmsiLCJiaW5kRW52aXJvbm1lbnQiLCJwYXJzZXIiLCJ4bWwyanMiLCJQYXJzZXIiLCJleHBsaWNpdEFycmF5IiwiZXhwbGljaXRSb290IiwicGFyc2VTdHJpbmciLCJlcnIiLCJXWFBheSIsImF0dGFjaCIsImJwciIsImNvZGVfdXJsX2lkIiwic2lnbiIsInd4cGF5IiwiYXBwaWQiLCJtY2hfaWQiLCJwYXJ0bmVyX2tleSIsImNsb25lIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJ0aW1lIiwicyIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJQYWNrYWdlIiwic2VuZCIsInN0cmluZ2lmeSIsInRpbWVFbmQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImJpbGxpbmdfcmVjaGFyZ2UiLCJuZXdfaWQiLCJtb2R1bGVfbmFtZXMiLCJsaXN0cHJpY2VzIiwib25lX21vbnRoX3l1YW4iLCJvcmRlcl9ib2R5IiwicmVzdWx0X29iaiIsInNwYWNlX3VzZXJfY291bnQiLCJsaXN0cHJpY2Vfcm1iIiwibmFtZV96aCIsImNyZWF0ZVVuaWZpZWRPcmRlciIsImpvaW4iLCJvdXRfdHJhZGVfbm8iLCJtb21lbnQiLCJmb3JtYXQiLCJzcGJpbGxfY3JlYXRlX2lwIiwibm90aWZ5X3VybCIsInRyYWRlX3R5cGUiLCJwcm9kdWN0X2lkIiwiaW5mbyIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwiZmxvd19pZCIsImZsIiwicGVybXMiLCJmbG93X25hbWUiLCJjYW5fYWRkIiwidXNlcnNfY2FuX2FkZCIsIm9yZ3NfY2FuX2FkZCIsInNvbWUiLCJzZXRTcGFjZVVzZXJQYXNzd29yZCIsInNwYWNlX3VzZXJfaWQiLCJjdXJyZW50VXNlciIsImxhbmciLCJ1c2VyQ1AiLCJzZXRQYXNzd29yZCIsImxvZ291dCIsIlNNU1F1ZXVlIiwiRm9ybWF0IiwiQWN0aW9uIiwiUGFyYW1TdHJpbmciLCJSZWNOdW0iLCJTaWduTmFtZSIsIlRlbXBsYXRlQ29kZSIsImdldF9hY2NvdW50aW5nX3BlcmlvZCIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsInRvRml4ZWQiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInVwIiwidXBkYXRlX2Nmc19pbnN0YW5jZSIsInBhcmVudF9pZCIsImluc3RhbmNlX2lkIiwiYXR0YWNoX3ZlcnNpb24iLCJpc0N1cnJlbnQiLCJtZXRhZGF0YSIsInBhcmVudCIsImluc3RhbmNlIiwiYXBwcm92ZSIsImN1cnJlbnQiLCJhdHRhY2htZW50cyIsImlucyIsImF0dGFjaHMiLCJjdXJyZW50X3ZlciIsIl9yZXYiLCJoaXN0b3J5cyIsImhpcyIsImRvd24iLCJvcmdhbml6YXRpb24iLCJjaGVja19jb3VudCIsIm5ld19vcmdfaWRzIiwicmVtb3ZlZF9vcmdfaWRzIiwicm9vdF9vcmciLCJ1cGRhdGVVc2VycyIsIm1vbnRocyIsInNldF9vYmoiLCJwbSIsInNldE1vbnRoIiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEIsbUJBQWlCLFFBREQ7QUFFaEJJLFNBQU8sRUFBRSxRQUZPO0FBR2hCLFlBQVUsU0FITTtBQUloQkMsUUFBTSxFQUFFLFFBSlE7QUFLaEIsZ0JBQWMsUUFMRTtBQU1oQixnQ0FBOEI7QUFOZCxDQUFELEVBT2IsY0FQYSxDQUFoQjs7QUFTQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsT0FBdkMsRUFBZ0Q7QUFDL0NSLGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGNBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7OztBQ2hCRCxJQUFJUyxLQUFKO0FBQVVSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ08sT0FBSyxDQUFDTixDQUFELEVBQUc7QUFBQ00sU0FBSyxHQUFDTixDQUFOO0FBQVE7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QyxvQkFBZ0IsVUFBQzVhLFFBQUQsRUFBVzdWLE1BQVg7QUFDZixVQUFBOUIsR0FBQSxFQUFBdUgsS0FBQTs7QUFBQSxXQUFPekYsTUFBUDtBQUNDLGVBQU87QUFBQzhFLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNJRzs7QURISlcsY0FBUW9RLFNBQVNwUSxLQUFqQjs7QUFDQSxXQUFPQSxLQUFQO0FBQ0MsYUFBQW9RLFlBQUEsUUFBQTNYLE1BQUEyWCxTQUFBNmEsSUFBQSxZQUFBeHlCLElBQW1CakIsTUFBbkIsR0FBbUIsTUFBbkIsR0FBbUIsTUFBbkIsSUFBNEIsQ0FBNUI7QUFDQ3dJLGtCQUFRb1EsU0FBUzZhLElBQVQsQ0FBY3AwQixXQUFkLENBQTBCLE9BQTFCLEVBQW1DLENBQW5DLENBQVI7QUFGRjtBQ1FJOztBRExKLFdBQU9tSixLQUFQO0FBQ0MsZUFBTztBQUFDWCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBTytRLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRjaGVja05wbVZlcnNpb25zXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxuXHRcInNwcmludGYtanNcIjogXCJeMS4wLjNcIixcblx0XCJ1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFwiOiBcIl43LjAuMFwiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nKSB7XG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXG5cdH0sICdzdGVlZG9zOmJhc2UnKTtcbn0iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbycgICAgICAgXG5cbi8vIFJldmVydCBjaGFuZ2UgZnJvbSBNZXRlb3IgMS42LjEgd2hvIHNldCBpZ25vcmVVbmRlZmluZWQ6IHRydWVcbi8vIG1vcmUgaW5mb3JtYXRpb24gaHR0cHM6Ly9naXRodWIuY29tL21ldGVvci9tZXRlb3IvcHVsbC85NDQ0XG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG5cblx0bGV0IG1vbmdvT3B0aW9ucyA9IHtcblx0XHRpZ25vcmVVbmRlZmluZWQ6IGZhbHNlLFxuXHR9O1xuXG5cdGNvbnN0IG1vbmdvT3B0aW9uU3RyID0gcHJvY2Vzcy5lbnYuTU9OR09fT1BUSU9OUztcblx0aWYgKHR5cGVvZiBtb25nb09wdGlvblN0ciAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRjb25zdCBqc29uTW9uZ29PcHRpb25zID0gSlNPTi5wYXJzZShtb25nb09wdGlvblN0cik7XG5cblx0XHRtb25nb09wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBtb25nb09wdGlvbnMsIGpzb25Nb25nb09wdGlvbnMpO1xuXHR9XG5cblx0TW9uZ28uc2V0Q29ubmVjdGlvbk9wdGlvbnMobW9uZ29PcHRpb25zKTtcbn1cblxuXG5NZXRlb3IuYXV0b3J1biA9IFRyYWNrZXIuYXV0b3J1blxuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgaWYgKCF0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWxvY2FsZSl7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcbiAgICB9XG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXG4gICAgICAgIH1lbHNle1xuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xuXHRcdH1cbiAgICB9KTtcbn07XG5cblxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcbiAgICAgICAgdi5wdXNoKG0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2O1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcbiAqL1xuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgZyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgZy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxuICovXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIHIgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICByID0gdDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByO1xufSIsIlN0ZWVkb3MgPVxuXHRzZXR0aW5nczoge31cblx0ZGI6IGRiXG5cdHN1YnM6IHt9XG5cdGlzUGhvbmVFbmFibGVkOiAtPlxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgbG9jYWxlKS0+XG5cdFx0aWYgdHlwZW9mIG51bWJlciA9PSBcIm51bWJlclwiXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxuXG5cdFx0aWYgIW51bWJlclxuXHRcdFx0cmV0dXJuICcnO1xuXG5cdFx0aWYgbnVtYmVyICE9IFwiTmFOXCJcblx0XHRcdHVubGVzcyBsb2NhbGVcblx0XHRcdFx0bG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxuXHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIiB8fCBsb2NhbGUgPT0gXCJ6aC1DTlwiXG5cdFx0XHRcdCMg5Lit5paH5LiH5YiG5L2N6LSi5Yqh5Lq65ZGY55yL5LiN5oOv77yM5omA5Lul5pS55Li65Zu96ZmF5LiA5qC355qE5Y2D5YiG5L2NXG5cdFx0XHRcdHJldHVybiBudW1iZXIucmVwbGFjZSgvXFxCKD89KFxcZHszfSkrKD8hXFxkKSkvZywgJywnKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gbnVtYmVyLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gXCJcIlxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcblxuIyMjXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcbiMjI1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XG5cblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxuXHRcdGlmIGFjY291bnRCZ0JvZHlcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxuXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcblx0XHRpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0XHRpZiB1cmwgPT0gYXZhdGFyXG5cdFx0XHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxuXHRcdFx0ZWxzZVxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcblx0XHRlbHNlXG5cdFx0XHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXG5cdFx0XHRpZiBiYWNrZ3JvdW5kXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblx0XHRcdGVsc2Vcblx0XHRcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcblx0XHRpZiBhY2NvdW50U2tpblxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxuXHRcdGlmIGFjY291bnRab29tXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxuXHRcdHVubGVzcyB6b29tTmFtZVxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcblx0XHRcdHpvb21TaXplID0gMS4yXG5cdFx0aWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxuXHRcdFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcblx0XHRcdCMgZWxzZVxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cblx0XHRsaW5rZXIgPSBcIj9cIlxuXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdGxpbmtlciA9IFwiJlwiXG5cblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cblxuXHRTdGVlZG9zLm9wZW5BcHAgPSAoYXBwX2lkKS0+XG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxuXHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXHRcdGlmICFhcHBcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXG5cdFx0XHRyZXR1cm5cblxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3Jcblx0XHQjIGlmIGFwcC5faWQgPT0gXCJhZG1pblwiIGFuZCBjcmVhdG9yU2V0dGluZ3M/LnN0YXR1cyA9PSBcImFjdGl2ZVwiXG5cdFx0IyBcdHVybCA9IGNyZWF0b3JTZXR0aW5ncy51cmxcblx0XHQjIFx0cmVnID0gL1xcLyQvXG5cdFx0IyBcdHVubGVzcyByZWcudGVzdCB1cmxcblx0XHQjIFx0XHR1cmwgKz0gXCIvXCJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxuXHRcdCMgXHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXHRcdCMgXHRyZXR1cm5cblxuXHRcdG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrXG5cdFx0aWYgYXBwLmlzX3VzZV9pZVxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0aWYgb25fY2xpY2tcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGVsc2UgaWYgZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpXG5cdFx0XHRGbG93Um91dGVyLmdvKGFwcC51cmwpXG5cblx0XHRlbHNlIGlmIGFwcC5pc191c2VfaWZyYW1lXG5cdFx0XHRpZiBhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcblx0XHRcdGVsc2UgaWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblx0XHRcdGVsc2Vcblx0XHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS8je2FwcC5faWR9XCIpXG5cblx0XHRlbHNlIGlmIG9uX2NsaWNrXG5cdFx0XHQjIOi/memHjOaJp+ihjOeahOaYr+S4gOS4quS4jeW4puWPguaVsOeahOmXreWMheWHveaVsO+8jOeUqOadpemBv+WFjeWPmOmHj+axoeafk1xuXHRcdFx0ZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7I3tvbl9jbGlja319KSgpXCJcblx0XHRcdHRyeVxuXHRcdFx0XHRldmFsKGV2YWxGdW5TdHJpbmcpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiI3tlLm1lc3NhZ2V9XFxyXFxuI3tlLnN0YWNrfVwiXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xuXHRcdFx0IyDpnIDopoHpgInkuK3lvZPliY1hcHDml7bvvIxvbl9jbGlja+WHveaVsOmHjOimgeWNleeLrOWKoOS4ilNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cblx0U3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IChzcGFjZUlkKS0+XG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdG1pbl9tb250aHMgPSAxXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0bWluX21vbnRocyA9IDNcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0ZW5kX2RhdGUgPSBzcGFjZT8uZW5kX2RhdGVcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcblxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXG5cdFx0XHR3aGVuICdub3JtYWwnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcblx0XHRcdHdoZW4gJ2xhcmdlJ1xuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcblxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcblxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcblx0XHRlbHNlXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XG5cdFx0aWYgb2Zmc2V0XG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxuXHRcdERFVklDRSA9XG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXG5cdFx0XHRpcGFkOiAnaXBhZCdcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcblx0XHRcdGlwb2Q6ICdpcG9kJ1xuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xuXHRcdGJyb3dzZXIgPSB7fVxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2Vcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xuXHRcdFx0Jydcblx0XHRcdERFVklDRS5kZXNrdG9wXG5cdFx0XVxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcblxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0XHRyZXR1cm5cblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGlmIGlmclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXG5cdFx0XHRpZnIubG9hZCAtPlxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXG5cdFx0XHRcdGlmIGlmckJvZHlcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcblxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXG5cblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XG5cdFx0aWYgIXNwYWNlSWRcblx0XHRcdHJldHVybiBmYWxzZVxuXHRcdGNoZWNrID0gZmFsc2Vcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxuXHRcdFx0Y2hlY2sgPSB0cnVlXG5cdFx0cmV0dXJuIGNoZWNrXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHRpc09yZ0FkbWluID0gZmFsc2Vcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcblx0XHRwYXJlbnRzID0gW11cblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxuXHRcdFx0aWYgb3JnLnBhcmVudHNcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxuXHRcdGVsc2Vcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cblxuXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcblx0XHRcdHJldHVybiB0cnVlXG5cdFx0aSA9IDBcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRpKytcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdFx0aWYgdXJsXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuXHRcdGVsc2Vcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0XHR0cnlcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxuXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXG5cblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcblxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxuXG5cdFx0XHRpZiAhdXNlclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcblxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB1c2VyXG5cblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXG5cblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXG5cblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2VcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdGlmIHVzZXJcblx0XHRcdFx0cmV0dXJuIHRydWVcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0cmV0dXJuIGZhbHNlXG5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cblx0XHR0cnlcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0aSA9IDBcblx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxuXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdGtleTMyID0gXCJcIlxuXHRcdGxlbiA9IGtleS5sZW5ndGhcblx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0YyA9IFwiXCJcblx0XHRcdGkgPSAwXG5cdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0aSsrXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdHJldHVybiBwYXNzd29yZDtcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cblxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxuXG5cdFx0aWYgdXNlclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxuXHRcdGVsc2Vcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXG5cblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcblx0XHRcdGlmIG9ialxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXG5cdFx0cmV0dXJuIG51bGxcblxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG5cblx0XHRpZiByZXEuaGVhZGVyc1xuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXG5cblx0XHQjIHRoZW4gY2hlY2sgY29va2llXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXG5cblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxuXHRcdHRyeVxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxuXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxuXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcblx0XHRcdFx0XHRjb2RlOiA0MDEsXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0Y2F0Y2ggZVxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXG5cbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cblxubWl4aW4gPSAob2JqKSAtPlxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxuXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cblx0XHRpZiAhZGF0ZVxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXG5cdFx0XHRyZXR1cm4gdHJ1ZVxuXG5cdFx0cmV0dXJuIGZhbHNlXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxuXHRcdFx0aWYgaSA8IGRheXNcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxuXHRcdFx0cmV0dXJuXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcblxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxuXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXG5cblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblxuXHRcdGogPSAwXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSAwXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcblx0XHRcdFx0aiA9IGxlbi8yXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxuXHRcdFx0aSA9IDBcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxuXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXG5cdFx0XHRcdFx0YnJlYWtcblxuXHRcdFx0XHRpKytcblxuXHRcdFx0aWYgbmV4dFxuXHRcdFx0XHRqID0gaSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxuXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxuXG5cdFx0aWYgaiA+IG1heF9pbmRleFxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6Vcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxuXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcblx0XHRcdGlmIGFwcFxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cblx0XHRcdFx0aWYgdXNlclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdFx0XHRpID0gMFxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0XHRcdGkrK1xuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcblxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxuXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxuXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcblx0XHRcdGlmIGlzSTE4blxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcblx0XHRcdHJldHVybiBsb2NhbGVcblxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxuXG5cblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXG5cdFx0XHR2YWxpZCA9IHRydWVcblx0XHRcdHVubGVzcyBwd2Rcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXG5cdFx0XHRwYXNzd29yUG9saWN5ID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeVxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XG5cdFx0XHRcdGlmICEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXG4jXHRcdFx0ZWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRpZiB2YWxpZFxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XG5cdGRiQXBwcyA9IHt9XG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KS5mb3JFYWNoIChhcHApLT5cblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcblxuXHRyZXR1cm4gZGJBcHBzXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxuI1x0XHRlbHNlXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcblx0XHRcdHJldHVybiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW47ICAgICAgICAgXG5cblN0ZWVkb3MgPSB7XG4gIHNldHRpbmdzOiB7fSxcbiAgZGI6IGRiLFxuICBzdWJzOiB7fSxcbiAgaXNQaG9uZUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgcmV0dXJuICEhKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDAgOiB2b2lkIDApO1xuICB9LFxuICBudW1iZXJUb1N0cmluZzogZnVuY3Rpb24obnVtYmVyLCBsb2NhbGUpIHtcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmICghbG9jYWxlKSB7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKCk7XG4gICAgICB9XG4gICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIgfHwgbG9jYWxlID09PSBcInpoLUNOXCIpIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bWJlci5yZXBsYWNlKC9cXEIoPz0oXFxkezN9KSsoPyFcXGQpKS9nLCAnLCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgYXZhdGFyVXJsLCBiYWNrZ3JvdW5kLCByZWYsIHJlZjEsIHJlZjIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGFjY291bnRCZ0JvZHlWYWx1ZS51cmwpIHtcbiAgICAgIGlmICh1cmwgPT09IGF2YXRhcikge1xuICAgICAgICBhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhcjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKSkgKyBcIilcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYmFja2dyb3VuZCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hZG1pbikgIT0gbnVsbCA/IHJlZjIuYmFja2dyb3VuZCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgY21kLCBlLCBldmFsRnVuU3RyaW5nLCBleGVjLCBvbl9jbGljaywgb3Blbl91cmwsIHBhdGg7XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwKSB7XG4gICAgICBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25fY2xpY2sgPSBhcHAub25fY2xpY2s7XG4gICAgaWYgKGFwcC5pc191c2VfaWUpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgaWYgKG9uX2NsaWNrKSB7XG4gICAgICAgICAgcGF0aCA9IFwiYXBpL2FwcC9zc28vXCIgKyBhcHBfaWQgKyBcIj9hdXRoVG9rZW49XCIgKyAoQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSkgKyBcIiZ1c2VySWQ9XCIgKyAoTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmw7XG4gICAgICAgIH1cbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybCkpIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oYXBwLnVybCk7XG4gICAgfSBlbHNlIGlmIChhcHAuaXNfdXNlX2lmcmFtZSkge1xuICAgICAgaWYgKGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKTtcbiAgICAgIH0gZWxzZSBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbl9jbGljaykge1xuICAgICAgZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7XCIgKyBvbl9jbGljayArIFwifSkoKVwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChldmFsRnVuU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSArIFwiXFxyXFxuXCIgKyBlLnN0YWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgfVxuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2spIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBlbmRfZGF0ZSwgbWluX21vbnRocywgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgfVxuICAgIG1pbl9tb250aHMgPSAxO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICBtaW5fbW9udGhzID0gMztcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBlbmRfZGF0ZSA9IHNwYWNlICE9IG51bGwgPyBzcGFjZS5lbmRfZGF0ZSA6IHZvaWQgMDtcbiAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCkpICE9IG51bGwgPyByZWYubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWYgPSBvcmcuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjIgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYyW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYzID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmM1tcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjFbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMi5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjMgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmLCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZCkgIT0gbnVsbCA/IHJlZi50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5wb2xpY3kgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBwYXNzd29yUG9saWN5RXJyb3IgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAocGFzc3dvclBvbGljeSkge1xuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJykpIHtcbiAgICAgICAgICByZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3I7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xufSkiLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7bGFzdF9sb2dvbjogbmV3IERhdGUoKX19KSAgXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gIE1ldGVvci5tZXRob2RzXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPiAwIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1c2g6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkc2V0OiBcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICBdXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXG4gICAgICAgIHAgPSBudWxsXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICAgIHAgPSBlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVsbDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBwXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXG4gICAgICBlbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxuXG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSxcbiAgICAgICAgJHNldDpcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcbiAgICAgIHJldHVybiB7fVxuXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XG4gICAgICAgIHN3YWxcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICAgICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cbiAgICAgICAgICAgICAgICBpZiByZXN1bHQ/LmVycm9yXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3dhbCB0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIlxuIyMjXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xuXHRmcm9tOiAoZnVuY3Rpb24oKXtcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xuXHR9KSgpLFxuXHRyZXNldFBhc3N3b3JkOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgc3BsaXRzID0gdXJsLnNwbGl0KFwiL1wiKTtcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRfYm9keVwiLHt0b2tlbl9jb2RlOnRva2VuQ29kZX0sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdHZlcmlmeUVtYWlsOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHRlbnJvbGxBY2NvdW50OiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3N0YXJ0X3NlcnZpY2VcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fVxufTsiLCIvLyDkv67mlLlmdWxsbmFtZeWAvOaciemXrumimOeahG9yZ2FuaXphdGlvbnNcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICBcblx0dmFyIG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe2Z1bGxuYW1lOi/mlrDpg6jpl6gvLG5hbWU6eyRuZTpcIuaWsOmDqOmXqFwifX0pO1xuXHRpZiAob3Jncy5jb3VudCgpPjApXG5cdHtcblx0XHRvcmdzLmZvckVhY2ggKGZ1bmN0aW9uIChvcmcpXG5cdFx0e1xuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcblx0XHRcdGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZShvcmcuX2lkLCB7JHNldDoge2Z1bGxuYW1lOiBvcmcuY2FsY3VsYXRlRnVsbG5hbWUoKX19KTtcblx0XHRcdFxuXHRcdH0pO1xuXHR9XHRcblxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBcdGRhdGE6IHtcblx0ICAgICAgXHRyZXQ6IDAsXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXG4gICAgXHR9XG4gIFx0fSk7XG59KTtcblxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxuICAgICAgICAgICAgICAgIFB1c2guQ29uZmlndXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblx0XHRcdHNwYWNlcyA9IHNwYWNlcy5tYXAgKG4pIC0+IHJldHVybiBuLl9pZFxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcblx0XHRpZiBzcGFjZUlkXG5cdFx0XHRpZiBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcblx0XHRzcGFjZXMgPSBbXVxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPVxuXHRpY29uOiBcImdsb2JlXCJcblx0Y29sb3I6IFwiYmx1ZVwiXG5cdHRhYmxlQ29sdW1uczogW1xuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxuXHRcdHtuYW1lOiBcInVzZXJfY291bnRcIn0sXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfcGFpZCgpXCJ9XG5cdF1cblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cblx0cm91dGVyQWRtaW46IFwiL2FkbWluXCJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRyZXR1cm4ge31cblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXG5cdGRpc2FibGVBZGQ6IHRydWVcblx0cGFnZUxlbmd0aDogMTAwXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXG5cdEBiaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkc1xuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xuXHRcdGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWciLCIgICAgICAgICAgICAgXG5cblNlbGVjdG9yID0ge307XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGFkbWluczoge1xuICAgICAgICAgICRpbjogW3VzZXJJZF1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHNwYWNlcyA9IHNwYWNlcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZUlkLCBzcGFjZV91c2Vycywgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBpZiAoZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHUpIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh1LnNwYWNlKTtcbiAgICB9KTtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICRpbjogc3BhY2VzXG4gICAgfTtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPSB7XG4gIGljb246IFwiZ2xvYmVcIixcbiAgY29sb3I6IFwiYmx1ZVwiLFxuICB0YWJsZUNvbHVtbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJtb2R1bGVzXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcInVzZXJfY291bnRcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwiZW5kX2RhdGVcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfcGFpZCgpXCJcbiAgICB9XG4gIF0sXG4gIGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdLFxuICByb3V0ZXJBZG1pbjogXCIvYWRtaW5cIixcbiAgc2VsZWN0b3I6IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSxcbiAgc2hvd0VkaXRDb2x1bW46IGZhbHNlLFxuICBzaG93RGVsQ29sdW1uOiBmYWxzZSxcbiAgZGlzYWJsZUFkZDogdHJ1ZSxcbiAgcGFnZUxlbmd0aDogMTAwLFxuICBvcmRlcjogW1swLCBcImRlc2NcIl1dXG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdGhpcy5zcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWducztcbiAgdGhpcy5iaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3JkcztcbiAgcmV0dXJuIHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zX2FkZCh7XG4gICAgc3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZyxcbiAgICBiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnXG4gIH0pIDogdm9pZCAwO1xufSk7XG4iLCJpZiAoIVtdLmluY2x1ZGVzKSB7XG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcbiAgICB2YXIgaztcbiAgICBpZiAobiA+PSAwKSB7XG4gICAgICBrID0gbjtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbiArIG47XG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XG4gICAgfVxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBPW2tdO1xuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaysrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcblxuICBpZiAhU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlc1xuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxuICAgICAgd3d3OiBcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cblx0bGlzdFZpZXdzID0ge31cblxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXG5cblx0b2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZmV0Y2goKVxuXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXHRcdG9saXN0Vmlld3MgPSBfLmZpbHRlciBvYmplY3RzVmlld3MsIChvdiktPlxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cblx0XHRfLmVhY2ggb2xpc3RWaWV3cywgKGxpc3R2aWV3KS0+XG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRcdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XG5cdFx0bGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KVxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGxpc3RWaWV3c1xuXG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblxuXHRvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KVxuXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cblxuXG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKSB7XG4gIHZhciBfZ2V0VXNlck9iamVjdExpc3RWaWV3cywga2V5cywgbGlzdFZpZXdzLCBvYmplY3RzVmlld3M7XG4gIGxpc3RWaWV3cyA9IHt9O1xuICBrZXlzID0gXy5rZXlzKG9iamVjdHMpO1xuICBvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAkaW46IGtleXNcbiAgICB9LFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2xpc3RWaWV3cztcbiAgICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICAgIG9saXN0Vmlld3MgPSBfLmZpbHRlcihvYmplY3RzVmlld3MsIGZ1bmN0aW9uKG92KSB7XG4gICAgICByZXR1cm4gb3Yub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIF8uZWFjaChvbGlzdFZpZXdzLCBmdW5jdGlvbihsaXN0dmlldykge1xuICAgICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgICB9KTtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG4gIH07XG4gIF8uZm9yRWFjaChvYmplY3RzLCBmdW5jdGlvbihvLCBrZXkpIHtcbiAgICB2YXIgbGlzdF92aWV3O1xuICAgIGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSk7XG4gICAgaWYgKCFfLmlzRW1wdHkobGlzdF92aWV3KSkge1xuICAgICAgcmV0dXJuIGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0Vmlld3M7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2JqZWN0X2xpc3R2aWV3O1xuICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICBvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pO1xuICBvYmplY3RfbGlzdHZpZXcuZm9yRWFjaChmdW5jdGlvbihsaXN0dmlldykge1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gIH0pO1xuICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG59O1xuIiwiU2VydmVyU2Vzc2lvbiA9IChmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzZXJ2ZXJfc2Vzc2lvbnMnKTtcblxuICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xuICAgIH1cbiAgfTtcbiAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xuICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XG4gIH07XG4gIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgQ29sbGVjdGlvbi5kZW55KHtcbiAgICAnaW5zZXJ0JzogZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICAndXBkYXRlJyA6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgJ3JlbW92ZSc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxuICB2YXIgYXBpID0ge1xuICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XG4gICAgICB2YXIgc2Vzc2lvbk9iaiA9IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xuICAgICAgfVxuICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbiAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG4gICAgICByZXR1cm4gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG4gICAgfSxcbiAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xuICAgICAgdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbiAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG5cbiAgICAgIHZhciB2YWx1ZSA9IGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuXG4gICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIF8odmFsdWUpLmlzRXF1YWwoZXhwZWN0ZWQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaWRlbnRpY2FsID09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcbiAgICB9XG4gIH07XG5cbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcbiAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcbiAgICAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKCdzZXJ2ZXItc2Vzc2lvbicpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSlcblxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XG4gICAgLy8gICAgIENvbGxlY3Rpb24ucmVtb3ZlKHt9KTsgLy8gY2xlYXIgb3V0IGFsbCBzdGFsZSBzZXNzaW9uc1xuICAgIC8vICAgfVxuICAgIC8vIH0pO1xuXG4gICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xuICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcblxuICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xuICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xuICAgICAgfVxuXG4gICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xuICAgICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuICAgIH0pO1xuXG4gICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgJ3NlcnZlci1zZXNzaW9uL2dldCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbiAgICAgIH0sXG4gICAgICAnc2VydmVyLXNlc3Npb24vc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcblxuICAgICAgICBjaGVja0ZvcktleShrZXkpO1xuXG4gICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxuICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ0ZhaWxlZCBjb25kaXRpb24gdmFsaWRhdGlvbi4nKTtcblxuICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XG4gICAgICAgIHVwZGF0ZU9ialsndmFsdWVzLicgKyBrZXldID0gdmFsdWU7XG5cbiAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XG4gICAgICB9XG4gICAgfSk7ICBcblxuICAgIC8vIHNlcnZlci1vbmx5IGFwaVxuICAgIF8uZXh0ZW5kKGFwaSwge1xuICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9zZXQnLCBrZXksIHZhbHVlKTsgICAgICAgICAgXG4gICAgICB9LFxuICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcbiAgICAgICAgY29uZGl0aW9uID0gbmV3Q29uZGl0aW9uO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGFwaTtcbn0pKCk7IiwiSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2dldC9hcHBzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXG5cblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXG5cblx0XHR1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpXG5cdFx0XG5cdFx0aWYgIXVzZXJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdHJldHVybjtcblxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxuXG5cdFx0IyDmoKHpqoxzcGFjZeaYr+WQpuWtmOWcqFxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cblx0XHRsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcl9pZH0pLmxvY2FsZVxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXG5cdFx0c3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcl9pZH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKVxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxuXG5cdFx0YXBwcy5mb3JFYWNoIChhcHApIC0+XG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cblx0XG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2dldC9hcHBzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcHMsIGUsIGxvY2FsZSwgcmVmLCByZWYxLCBzcGFjZV9pZCwgc3BhY2VzLCB1c2VyLCB1c2VyX2lkO1xuICB0cnkge1xuICAgIHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgKChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcklkIDogdm9pZCAwKTtcbiAgICBzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICB1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgICBsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pLmxvY2FsZTtcbiAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICB9XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgfVxuICAgIHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcl9pZFxuICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKTtcbiAgICBhcHBzID0gZGIuYXBwcy5maW5kKHtcbiAgICAgICRvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgICByZXR1cm4gYXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLCB7fSwgbG9jYWxlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICBkYXRhOiBhcHBzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuICAgICAgICBpZiByZXEuYm9keVxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgICAgICBkYXRhID0gW107XG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJ11cblxuICAgICAgICBpZiAhc3BhY2VcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsIHNwYWNlOiBzcGFjZX0pXG4gICAgICAgIFxuICAgICAgICBpZiAhc3BhY2VfdXNlclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICBpZiAhZGJbbW9kZWxdXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFzZWxlY3RvclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcblxuICAgICAgICBpZiAhb3B0aW9uc1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogW107XG5cblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcblxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxuICAgICAgICBpZiByZXEuYm9keVxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXG5cbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgICAgICBkYXRhID0gW107XG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOiBcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcbiAgICAgICAgXG4gICAgICAgIGlmICFzcGFjZV91c2VyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6IFxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIGlmICFkYlttb2RlbF1cbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTogXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuXG4gICAgICAgIGlmICFvcHRpb25zXG4gICAgICAgICAgICBvcHRpb25zID0ge307XG5cbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWRcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcbiAgICAgICAgXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YTtcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IHt9IiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghKHVzZXJJZCAmJiBhdXRoVG9rZW4pKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAobW9kZWwgPT09ICdtYWlsX2FjY291bnRzJykge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0YXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKVxuXHRpZiBhcHBcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cdFx0cmVkaXJlY3RVcmwgPSBhcHAudXJsXG5cdGVsc2Vcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybFxuXG5cdGlmICFyZWRpcmVjdFVybFxuXHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0cmVzLmVuZCgpXG5cdFx0cmV0dXJuXG5cblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXG5cdCMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XG5cdCMgaWYgcmVxLmJvZHlcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXG5cdCMgXHRhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxuXHQjIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHQjIFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0aWYgIXVzZXJJZCBhbmQgIWF1dGhUb2tlblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdGlmIHVzZXJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0IyBkZXMtY2JjXG5cdFx0XHRkZXNfaXYgPSBcIi04NzYyLWZjXCJcblx0XHRcdGtleTggPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgOFxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gOCAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSA4XG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsOClcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxuXHRcdFx0ZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKVxuXHRcdFx0ZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdGpvaW5lciA9IFwiP1wiXG5cblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdFx0am9pbmVyID0gXCImXCJcblxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXG5cblx0XHRcdGlmIHVzZXIudXNlcm5hbWVcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHJldHVybnVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0cmVzLndyaXRlSGVhZCA0MDFcblx0cmVzLmVuZCgpXG5cdHJldHVyblxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0XHQjIHRoaXMucGFyYW1zID1cblx0XHQjIFx0dXNlcklkOiBkZWNvZGVVUkkocmVxLnVybCkucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcblx0XHR3aWR0aCA9IDUwIDtcblx0XHRoZWlnaHQgPSA1MCA7XG5cdFx0Zm9udFNpemUgPSAyOCA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lndcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lmhcblx0XHQgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5LmggO1xuXHRcdGlmIHJlcS5xdWVyeS5mc1xuICAgICAgICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnMgO1xuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHRcdFx0PHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuXHRcdFx0XHRcdC5zdDB7ZmlsbDojRkZGRkZGO31cblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcblx0XHRcdFx0XHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcIi8+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxuXHRcdFx0XHRcdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XCIvPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblx0XHRcdHJlcy53cml0ZSBzdmdcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHVzZXJuYW1lID0gdXNlci5uYW1lO1xuXHRcdGlmICF1c2VybmFtZVxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXG5cblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcblxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxuXG5cdFx0XHR1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XG5cdFx0XHRcdGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcblxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcblx0XHRcdGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcblxuXHRcdFx0aW5pdGlhbHMgPSAnJ1xuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcblx0XHRcdGVsc2Vcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcblxuXHRcdFx0aW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXG5cblx0XHRcdHN2ZyA9IFwiXCJcIlxuXHRcdFx0PD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XG5cdFx0XHRcdFx0I3tpbml0aWFsc31cblx0XHRcdFx0PC90ZXh0PlxuXHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblxuXHRcdFx0cmVzLndyaXRlIHN2Z1xuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcblx0XHRcdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XG5cdFx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0XHRyZXR1cm5cblxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxuXHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcblxuXHRcdGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cblxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXG5cblx0XHRpZiBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblx0XHRlbHNlXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXG5cblxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgYWNjZXNzX3Rva2VuLCByZWY7XG4gICAgYWNjZXNzX3Rva2VuID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbikpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXG4gICAgICAgIFxuXG4gICAgICAgIHNlbGVjdG9yID0ge3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fVxuICAgICAgICBpZiBzcGFjZUlkXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXG5cblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cblx0TWV0ZW9yLnB1Ymxpc2ggJ215X3NwYWNlcycsIC0+XG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblxuXHRcdHNlbGYgPSB0aGlzO1xuXHRcdHVzZXJTcGFjZXMgPSBbXVxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XG5cdFx0XHR1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpXG5cblx0XHRoYW5kbGUyID0gbnVsbFxuXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXG5cdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0aWYgZG9jLnNwYWNlXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXG5cdFx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKVxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxuXHRcdFx0XHRpZiBvbGREb2Muc3BhY2Vcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXG5cblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuYWRkZWQgXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jO1xuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VkIFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYztcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZClcblxuXHRcdG9ic2VydmVTcGFjZXMoKTtcblxuXHRcdHNlbGYucmVhZHkoKTtcblxuXHRcdHNlbGYub25TdG9wIC0+XG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xuXHRcdFx0aWYgaGFuZGxlMlxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cblx0dW5sZXNzIHNwYWNlSWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0cmV0dXJuIGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7YXZhdGFyOiAxLG5hbWU6IDEsZW5hYmxlX3JlZ2lzdGVyOjF9fSk7XG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cblx0dW5sZXNzIHRoaXMudXNlcklkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHR1bmxlc3MgX2lkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe19pZDogX2lkfSk7IiwiTWV0ZW9yLnB1Ymxpc2goJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIGZ1bmN0aW9uKF9pZCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIV9pZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7XG4gICAgX2lkOiBfaWRcbiAgfSk7XG59KTtcbiIsInN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsKHJlcSwgcmVzLCBuZXh0KS0+XG5cdHVzZXJJZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXVxuXHRzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucGFyYW1zPy5zcGFjZUlkXG5cdGlmICF1c2VySWRcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuXHRcdFx0Y29kZTogNDAzLFxuXHRcdFx0ZGF0YTogbnVsbFxuXHRcdHJldHVyblxuXG5cdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxuXHR1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpLT5cblx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxuXHRcdCkoYXV0aFRva2VuLCBzcGFjZUlkKVxuXHRcblx0dW5sZXNzIHVzZXJTZXNzaW9uXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDUwMCxcblx0XHRcdGRhdGE6IG51bGxcblx0XHRyZXR1cm5cblxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge25hbWU6IDF9fSlcblxuXHRyZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZClcblx0cmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvblxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxuXHRyZXN1bHQuYXBwcyA9IF8uZXh0ZW5kIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHNcblx0cmVzdWx0Lm9iamVjdF9saXN0dmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgcmVzdWx0Lm9iamVjdHMpXG5cdHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwgJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkXG5cblx0cGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jICh2LCB1c2VyU2Vzc2lvbiwgY2IpLT5cblx0XHR2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcblxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXG5cdFx0XHRkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpXG5cdFx0XHRfLmVhY2goZGF0YXNvdXJjZU9iamVjdHMsICh2LCBrKS0+XG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3Qodi50b0NvbmZpZygpKVxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxuXHRcdFx0XHRfb2JqLm5hbWUgPSBrXG5cdFx0XHRcdF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWVcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxuXHRcdFx0XHRyZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29ialxuXHRcdFx0KVxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxuXHRcdHJlc3VsdC5hcHBzID0gXy5leHRlbmQgcmVzdWx0LmFwcHMsIGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpXG5cblx0dHJ5RmV0Y2hQbHVnaW5zSW5mbyA9IChmdW4pLT5cblx0XHR0cnlcblx0XHRcdCMg5Zug5Li6cmVxdWlyZeWHveaVsOS4reWPguaVsOeUqOWPmOmHj+S8oOWFpeeahOivne+8jOWPr+iDveS8mumAoOaIkOebtOaOpeaKpemUmVxuXHRcdFx0IyDlhbfkvZNgbmFtZSA9IFwiQHN0ZWVkb3Mvb2JqZWN0cWwvcGFja2FnZS5qc29uXCIsaW5mbyA9IHJlcXVpcmUobmFtZSlg5Lya5oql6ZSZ77yM5Y+q6IO955SoYGluZm8gPSByZXF1aXJlKFwiQHN0ZWVkb3Mvb2JqZWN0cWwvcGFja2FnZS5qc29uXCIpYFxuXHRcdFx0IyDkvYbmmK9gbmFtZSA9IFwiQHN0ZWVkb3MvY29yZS9wYWNrYWdlLmpzb25cIixpbmZvID0gcmVxdWlyZShuYW1lKWDljbTkuI3kvJrmiqXplJlcblx0XHRcdCMg5omA5Lul6L+Z6YeM5oqK5pW05LiqZnVu5Lyg5YWl5omn6KGMXG5cdFx0XHRmdW4oKVxuXHRcdGNhdGNoXG5cblx0cmVzdWx0LnBsdWdpbnMgPSB7fVxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvIC0+XG5cdFx0cmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9jb3JlXCJdID0gdmVyc2lvbjogcmVxdWlyZShcIkBzdGVlZG9zL2NvcmUvcGFja2FnZS5qc29uXCIpPy52ZXJzaW9uXG5cdHRyeUZldGNoUGx1Z2luc0luZm8gLT5cblx0XHRyZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL29iamVjdHFsXCJdID0gdmVyc2lvbjogcmVxdWlyZShcIkBzdGVlZG9zL29iamVjdHFsL3BhY2thZ2UuanNvblwiKT8udmVyc2lvblxuXHR0cnlGZXRjaFBsdWdpbnNJbmZvIC0+XG5cdFx0cmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9hY2NvdW50c1wiXSA9IHZlcnNpb246IHJlcXVpcmUoXCJAc3RlZWRvcy9hY2NvdW50cy9wYWNrYWdlLmpzb25cIik/LnZlcnNpb25cblx0dHJ5RmV0Y2hQbHVnaW5zSW5mbyAtPlxuXHRcdHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3dcIl0gPSB2ZXJzaW9uOiByZXF1aXJlKFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3cvcGFja2FnZS5qc29uXCIpPy52ZXJzaW9uXG5cblx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRjb2RlOiAyMDAsXG5cdFx0ZGF0YTogcmVzdWx0XG4iLCJ2YXIgc3RlZWRvc0F1dGg7XG5cbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhdXRoVG9rZW4sIHBlcm1pc3Npb25zLCByZWYsIHJlc3VsdCwgc3BhY2UsIHNwYWNlSWQsIHRyeUZldGNoUGx1Z2luc0luZm8sIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHVzZXJJZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXTtcbiAgc3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDQwMyxcbiAgICAgIGRhdGE6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpO1xuICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShhdXRoVG9rZW4sIHNwYWNlSWQpO1xuICBpZiAoIXVzZXJTZXNzaW9uKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNTAwLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICByZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCk7XG4gIHJlc3VsdC51c2VyID0gdXNlclNlc3Npb247XG4gIHJlc3VsdC5zcGFjZSA9IHNwYWNlO1xuICByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpLCBDcmVhdG9yLkFwcHMpO1xuICByZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cyk7XG4gIHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwoJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkKTtcbiAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgIHJldHVybiB2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgZGF0YXNvdXJjZU9iamVjdHM7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZGF0YXNvdXJjZU9iamVjdHMgPSBkYXRhc291cmNlLmdldE9iamVjdHMoKTtcbiAgICAgIHJldHVybiBfLmVhY2goZGF0YXNvdXJjZU9iamVjdHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgdmFyIF9vYmo7XG4gICAgICAgIF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3Qodi50b0NvbmZpZygpKTtcbiAgICAgICAgX29iai5uYW1lID0gaztcbiAgICAgICAgX29iai5kYXRhYmFzZV9uYW1lID0gbmFtZTtcbiAgICAgICAgX29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgcmV0dXJuIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMsIGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKTtcbiAgfSk7XG4gIHRyeUZldGNoUGx1Z2luc0luZm8gPSBmdW5jdGlvbihmdW4pIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bigpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICB9XG4gIH07XG4gIHJlc3VsdC5wbHVnaW5zID0ge307XG4gIHRyeUZldGNoUGx1Z2luc0luZm8oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjE7XG4gICAgcmV0dXJuIHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3MvY29yZVwiXSA9IHtcbiAgICAgIHZlcnNpb246IChyZWYxID0gcmVxdWlyZShcIkBzdGVlZG9zL2NvcmUvcGFja2FnZS5qc29uXCIpKSAhPSBudWxsID8gcmVmMS52ZXJzaW9uIDogdm9pZCAwXG4gICAgfTtcbiAgfSk7XG4gIHRyeUZldGNoUGx1Z2luc0luZm8oZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjE7XG4gICAgcmV0dXJuIHJlc3VsdC5wbHVnaW5zW1wiQHN0ZWVkb3Mvb2JqZWN0cWxcIl0gPSB7XG4gICAgICB2ZXJzaW9uOiAocmVmMSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9vYmplY3RxbC9wYWNrYWdlLmpzb25cIikpICE9IG51bGwgPyByZWYxLnZlcnNpb24gOiB2b2lkIDBcbiAgICB9O1xuICB9KTtcbiAgdHJ5RmV0Y2hQbHVnaW5zSW5mbyhmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmMTtcbiAgICByZXR1cm4gcmVzdWx0LnBsdWdpbnNbXCJAc3RlZWRvcy9hY2NvdW50c1wiXSA9IHtcbiAgICAgIHZlcnNpb246IChyZWYxID0gcmVxdWlyZShcIkBzdGVlZG9zL2FjY291bnRzL3BhY2thZ2UuanNvblwiKSkgIT0gbnVsbCA/IHJlZjEudmVyc2lvbiA6IHZvaWQgMFxuICAgIH07XG4gIH0pO1xuICB0cnlGZXRjaFBsdWdpbnNJbmZvKGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYxO1xuICAgIHJldHVybiByZXN1bHQucGx1Z2luc1tcIkBzdGVlZG9zL3N0ZWVkb3MtcGx1Z2luLXdvcmtmbG93XCJdID0ge1xuICAgICAgdmVyc2lvbjogKHJlZjEgPSByZXF1aXJlKFwiQHN0ZWVkb3Mvc3RlZWRvcy1wbHVnaW4td29ya2Zsb3cvcGFja2FnZS5qc29uXCIpKSAhPSBudWxsID8gcmVmMS52ZXJzaW9uIDogdm9pZCAwXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgY29kZTogMjAwLFxuICAgIGRhdGE6IHJlc3VsdFxuICB9KTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0dHJ5XG5cdFx0Ym9keSA9IFwiXCJcblx0XHRyZXEub24oJ2RhdGEnLCAoY2h1bmspLT5cblx0XHRcdGJvZHkgKz0gY2h1bmtcblx0XHQpXG5cdFx0cmVxLm9uKCdlbmQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgoKS0+XG5cdFx0XHRcdHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpXG5cdFx0XHRcdHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHsgdHJpbTp0cnVlLCBleHBsaWNpdEFycmF5OmZhbHNlLCBleHBsaWNpdFJvb3Q6ZmFsc2UgfSlcblx0XHRcdFx0cGFyc2VyLnBhcnNlU3RyaW5nKGJvZHksIChlcnIsIHJlc3VsdCktPlxuXHRcdFx0XHRcdFx0IyDnibnliKvmj5DphpLvvJrllYbmiLfns7vnu5/lr7nkuo7mlK/ku5jnu5PmnpzpgJrnn6XnmoTlhoXlrrnkuIDlrpropoHlgZrnrb7lkI3pqozor4Es5bm25qCh6aqM6L+U5Zue55qE6K6i5Y2V6YeR6aKd5piv5ZCm5LiO5ZWG5oi35L6n55qE6K6i5Y2V6YeR6aKd5LiA6Ie077yM6Ziy5q2i5pWw5o2u5rOE5ryP5a+86Ie05Ye6546w4oCc5YGH6YCa55+l4oCd77yM6YCg5oiQ6LWE6YeR5o2f5aSxXG5cdFx0XHRcdFx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxuXHRcdFx0XHRcdFx0d3hwYXkgPSBXWFBheSh7XG5cdFx0XHRcdFx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcblx0XHRcdFx0XHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG5cdFx0XHRcdFx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0c2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKVxuXHRcdFx0XHRcdFx0YXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKVxuXHRcdFx0XHRcdFx0Y29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWRcblx0XHRcdFx0XHRcdGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZClcblx0XHRcdFx0XHRcdGlmIGJwciBhbmQgYnByLnRvdGFsX2ZlZSBpcyBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgYW5kIHNpZ24gaXMgcmVzdWx0LnNpZ25cblx0XHRcdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe19pZDogY29kZV91cmxfaWR9LCB7JHNldDoge3BhaWQ6IHRydWV9fSlcblx0XHRcdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudClcblx0XHRcdFx0XHRcblx0XHRcdFx0KVxuXHRcdFx0KSwgKGVyciktPlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnXG5cdFx0XHQpXG5cdFx0KVxuXHRcdFxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0cmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCd9KVxuXHRyZXMuZW5kKCc8eG1sPjxyZXR1cm5fY29kZT48IVtDREFUQVtTVUNDRVNTXV0+PC9yZXR1cm5fY29kZT48L3htbD4nKVxuXG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib2R5LCBlO1xuICB0cnkge1xuICAgIGJvZHkgPSBcIlwiO1xuICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICByZXR1cm4gYm9keSArPSBjaHVuaztcbiAgICB9KTtcbiAgICByZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcnNlciwgeG1sMmpzO1xuICAgICAgeG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG4gICAgICBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7XG4gICAgICAgIHRyaW06IHRydWUsXG4gICAgICAgIGV4cGxpY2l0QXJyYXk6IGZhbHNlLFxuICAgICAgICBleHBsaWNpdFJvb3Q6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIFdYUGF5LCBhdHRhY2gsIGJwciwgY29kZV91cmxfaWQsIHNpZ24sIHd4cGF5O1xuICAgICAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICAgICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgICAgICB9KTtcbiAgICAgICAgc2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKTtcbiAgICAgICAgYXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKTtcbiAgICAgICAgY29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWQ7XG4gICAgICAgIGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZCk7XG4gICAgICAgIGlmIChicHIgJiYgYnByLnRvdGFsX2ZlZSA9PT0gTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpICYmIHNpZ24gPT09IHJlc3VsdC5zaWduKSB7XG4gICAgICAgICAgZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBjb2RlX3VybF9pZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSksIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCcpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgfVxuICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ1xuICB9KTtcbiAgcmV0dXJuIHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfY29udGFjdHNfbGltaXQ6IChzcGFjZSktPlxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLpmYWxzZeihqOekuuS4jemZkOWumue7hOe7h+iMg+WbtO+8jOWNs+ihqOekuuiDveeci+aVtOS4quW3peS9nOWMuueahOe7hOe7h1xuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xuXHRcdHJlVmFsdWUgPVxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XG5cblx0XHRpZiBsaW1pdHMubGVuZ3RoXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRteU9yZ0lkcyA9IG15T3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdFx0XG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXG5cdFx0XHRmb3IgbGltaXQgaW4gbGltaXRzXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgcGFyZW50czogeyRpbjogZnJvbXN9fSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHRcdGZvciBteU9yZ0lkIGluIG15T3JnSWRzXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCB0b3Ncblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxuXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IF8udW5pcSBteUxpdG1pdE9yZ0lkc1xuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXG5cdFx0XHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEgXy5mbGF0dGVuIG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXG5cdFx0aWYgaXNMaW1pdFxuXHRcdFx0dG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIF9pZDogeyRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zfX0sIHtmaWVsZHM6e19pZDogMSwgcGFyZW50czogMX19KS5mZXRjaCgpXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcblx0XHRcdG9yZ3MgPSBfLmZpbHRlciB0b09yZ3MsIChvcmcpIC0+XG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXG5cdFx0cmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdFxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cdFx0cmV0dXJuIHJlVmFsdWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0X2NvbnRhY3RzX2xpbWl0OiBmdW5jdGlvbihzcGFjZSkge1xuICAgIHZhciBmcm9tcywgZnJvbXNDaGlsZHJlbiwgZnJvbXNDaGlsZHJlbklkcywgaSwgaXNMaW1pdCwgaiwgbGVuLCBsZW4xLCBsaW1pdCwgbGltaXRzLCBteUxpdG1pdE9yZ0lkcywgbXlPcmdJZCwgbXlPcmdJZHMsIG15T3Jncywgb3Jncywgb3V0c2lkZV9vcmdhbml6YXRpb25zLCByZVZhbHVlLCBzZXR0aW5nLCB0ZW1wSXNMaW1pdCwgdG9PcmdzLCB0b3M7XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgcmVWYWx1ZSA9IHtcbiAgICAgIGlzTGltaXQ6IHRydWUsXG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG4gICAgfTtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICB9XG4gICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgIHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wiXG4gICAgfSk7XG4gICAgbGltaXRzID0gKHNldHRpbmcgIT0gbnVsbCA/IHNldHRpbmcudmFsdWVzIDogdm9pZCAwKSB8fCBbXTtcbiAgICBpZiAobGltaXRzLmxlbmd0aCkge1xuICAgICAgbXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICB1c2VyczogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXlPcmdJZHMgPSBteU9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBpZiAoIW15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaW1pdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdHNbaV07XG4gICAgICAgIGZyb21zID0gbGltaXQuZnJvbXM7XG4gICAgICAgIHRvcyA9IGxpbWl0LnRvcztcbiAgICAgICAgZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgIHBhcmVudHM6IHtcbiAgICAgICAgICAgICRpbjogZnJvbXNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuICE9IG51bGwgPyBmcm9tc0NoaWxkcmVuLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KSA6IHZvaWQgMDtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IG15T3JnSWRzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIG15T3JnSWQgPSBteU9yZ0lkc1tqXTtcbiAgICAgICAgICB0ZW1wSXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRlbXBJc0xpbWl0KSB7XG4gICAgICAgICAgICBpc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoKHRvcyk7XG4gICAgICAgICAgICBteUxpdG1pdE9yZ0lkcy5wdXNoKG15T3JnSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEobXlMaXRtaXRPcmdJZHMpO1xuICAgICAgaWYgKG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxKF8uZmxhdHRlbihvdXRzaWRlX29yZ2FuaXphdGlvbnMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTGltaXQpIHtcbiAgICAgIHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgcGFyZW50czogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgb3JncyA9IF8uZmlsdGVyKHRvT3JncywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgIHZhciBwYXJlbnRzO1xuICAgICAgICBwYXJlbnRzID0gb3JnLnBhcmVudHMgfHwgW107XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgJiYgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDE7XG4gICAgICB9KTtcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXQ7XG4gICAgcmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnM7XG4gICAgcmV0dXJuIHJlVmFsdWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcbiAgICAgICAgY2hlY2sodmFsdWUsIE9iamVjdCk7XG5cbiAgICAgICAgb2JqID0ge307XG4gICAgICAgIG9iai51c2VyID0gdGhpcy51c2VySWQ7XG4gICAgICAgIG9iai5rZXkgPSBrZXk7XG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy5pbnNlcnQob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pIiwiTWV0ZW9yLm1ldGhvZHNcblx0YmlsbGluZ19zZXR0bGV1cDogKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkPVwiXCIpLT5cblx0XHRjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZylcblxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcblxuXHRcdGlmIG5vdCB1c2VyLmlzX2Nsb3VkYWRtaW5cblx0XHRcdHJldHVyblxuXG5cdFx0Y29uc29sZS50aW1lICdiaWxsaW5nJ1xuXHRcdHNwYWNlcyA9IFtdXG5cdFx0aWYgc3BhY2VfaWRcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlX2lkLCBpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdGVsc2Vcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdHJlc3VsdCA9IFtdXG5cdFx0c3BhY2VzLmZvckVhY2ggKHMpIC0+XG5cdFx0XHR0cnlcblx0XHRcdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZClcblx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRlID0ge31cblx0XHRcdFx0ZS5faWQgPSBzLl9pZFxuXHRcdFx0XHRlLm5hbWUgPSBzLm5hbWVcblx0XHRcdFx0ZS5lcnIgPSBlcnJcblx0XHRcdFx0cmVzdWx0LnB1c2ggZVxuXHRcdGlmIHJlc3VsdC5sZW5ndGggPiAwXG5cdFx0XHRjb25zb2xlLmVycm9yIHJlc3VsdFxuXHRcdFx0dHJ5XG5cdFx0XHRcdEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbFxuXHRcdFx0XHRFbWFpbC5zZW5kXG5cdFx0XHRcdFx0dG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJ1xuXHRcdFx0XHRcdGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb21cblx0XHRcdFx0XHRzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnXG5cdFx0XHRcdFx0dGV4dDogSlNPTi5zdHJpbmdpZnkoJ3Jlc3VsdCc6IHJlc3VsdClcblx0XHRcdGNhdGNoIGVyclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyclxuXHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyciLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfc2V0dGxldXA6IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gICAgdmFyIEVtYWlsLCBlcnIsIHJlc3VsdCwgc3BhY2VzLCB1c2VyO1xuICAgIGlmIChzcGFjZV9pZCA9PSBudWxsKSB7XG4gICAgICBzcGFjZV9pZCA9IFwiXCI7XG4gICAgfVxuICAgIGNoZWNrKGFjY291bnRpbmdfbW9udGgsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS50aW1lKCdiaWxsaW5nJyk7XG4gICAgc3BhY2VzID0gW107XG4gICAgaWYgKHNwYWNlX2lkKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIF9pZDogc3BhY2VfaWQsXG4gICAgICAgIGlzX3BhaWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGlzX3BhaWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXN1bHQgPSBbXTtcbiAgICBzcGFjZXMuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICB2YXIgZSwgZXJyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGUgPSB7fTtcbiAgICAgICAgZS5faWQgPSBzLl9pZDtcbiAgICAgICAgZS5uYW1lID0gcy5uYW1lO1xuICAgICAgICBlLmVyciA9IGVycjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS5lcnJvcihyZXN1bHQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgRW1haWwgPSBQYWNrYWdlLmVtYWlsLkVtYWlsO1xuICAgICAgICBFbWFpbC5zZW5kKHtcbiAgICAgICAgICB0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nLFxuICAgICAgICAgIGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb20sXG4gICAgICAgICAgc3ViamVjdDogJ2JpbGxpbmcgc2V0dGxldXAgcmVzdWx0JyxcbiAgICAgICAgICB0ZXh0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAncmVzdWx0JzogcmVzdWx0XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nJyk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG5cdFx0Y2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG5cblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpXG5cblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwnZXJyb3ItaW52YWxpZC11c2VyJylcblxuXHRcdHVubGVzcyB1c2VyX2lkXG5cdFx0XHR1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWRcblxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxuXG5cdFx0cmV0dXJuIHVzZXJuYW1lXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRiaWxsaW5nX3JlY2hhcmdlOiAodG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdFx0Y2hlY2sgdG90YWxfZmVlLCBOdW1iZXJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nIFxuXHRcdGNoZWNrIG5ld19pZCwgU3RyaW5nIFxuXHRcdGNoZWNrIG1vZHVsZV9uYW1lcywgQXJyYXkgXG5cdFx0Y2hlY2sgZW5kX2RhdGUsIFN0cmluZyBcblx0XHRjaGVjayB1c2VyX2NvdW50LCBOdW1iZXIgXG5cblx0XHR1c2VyX2lkID0gdGhpcy51c2VySWRcblxuXHRcdGxpc3RwcmljZXMgPSAwXG5cdFx0b3JkZXJfYm9keSA9IFtdXG5cdFx0ZGIubW9kdWxlcy5maW5kKHtuYW1lOiB7JGluOiBtb2R1bGVfbmFtZXN9fSkuZm9yRWFjaCAobSktPlxuXHRcdFx0bGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWJcblx0XHRcdG9yZGVyX2JvZHkucHVzaCBtLm5hbWVfemhcblxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cdFx0aWYgbm90IHNwYWNlLmlzX3BhaWRcblx0XHRcdHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZH0pLmNvdW50KClcblx0XHRcdG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXNcblx0XHRcdGlmIHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuKjEwMFxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pSN7b25lX21vbnRoX3l1YW59XCJcblxuXHRcdHJlc3VsdF9vYmogPSB7fVxuXG5cdFx0YXR0YWNoID0ge31cblx0XHRhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWRcblx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxuXG5cdFx0d3hwYXkgPSBXWFBheSh7XG5cdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG5cdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcblx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXG5cdFx0fSlcblxuXHRcdHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XG5cdFx0XHRib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxuXHRcdFx0b3V0X3RyYWRlX25vOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG5cdFx0XHR0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcblx0XHRcdHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxuXHRcdFx0bm90aWZ5X3VybDogTWV0ZW9yLmFic29sdXRlVXJsKCkgKyAnYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5Jyxcblx0XHRcdHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxuXHRcdFx0cHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuXHRcdFx0YXR0YWNoOiBKU09OLnN0cmluZ2lmeShhdHRhY2gpXG5cdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKGVyciwgcmVzdWx0KSAtPiBcblx0XHRcdFx0aWYgZXJyIFxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXG5cdFx0XHRcdGlmIHJlc3VsdFxuXHRcdFx0XHRcdG9iaiA9IHt9XG5cdFx0XHRcdFx0b2JqLl9pZCA9IG5ld19pZFxuXHRcdFx0XHRcdG9iai5jcmVhdGVkID0gbmV3IERhdGVcblx0XHRcdFx0XHRvYmouaW5mbyA9IHJlc3VsdFxuXHRcdFx0XHRcdG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWVcblx0XHRcdFx0XHRvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcblx0XHRcdFx0XHRvYmouc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0XHRcdG9iai5wYWlkID0gZmFsc2Vcblx0XHRcdFx0XHRvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRcdFx0XHRcdG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXG5cdFx0XHRcdFx0b2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XG5cdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKVxuXHRcdFx0KSwgKCktPlxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQnXG5cdFx0XHQpXG5cdFx0KVxuXG5cdFx0XG5cdFx0cmV0dXJuIFwic3VjY2Vzc1wiIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3JlY2hhcmdlOiBmdW5jdGlvbih0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgICB2YXIgV1hQYXksIGF0dGFjaCwgbGlzdHByaWNlcywgb25lX21vbnRoX3l1YW4sIG9yZGVyX2JvZHksIHJlc3VsdF9vYmosIHNwYWNlLCBzcGFjZV91c2VyX2NvdW50LCB1c2VyX2lkLCB3eHBheTtcbiAgICBjaGVjayh0b3RhbF9mZWUsIE51bWJlcik7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobmV3X2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG1vZHVsZV9uYW1lcywgQXJyYXkpO1xuICAgIGNoZWNrKGVuZF9kYXRlLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJfY291bnQsIE51bWJlcik7XG4gICAgdXNlcl9pZCA9IHRoaXMudXNlcklkO1xuICAgIGxpc3RwcmljZXMgPSAwO1xuICAgIG9yZGVyX2JvZHkgPSBbXTtcbiAgICBkYi5tb2R1bGVzLmZpbmQoe1xuICAgICAgbmFtZToge1xuICAgICAgICAkaW46IG1vZHVsZV9uYW1lc1xuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgbGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWI7XG4gICAgICByZXR1cm4gb3JkZXJfYm9keS5wdXNoKG0ubmFtZV96aCk7XG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICBzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSkuY291bnQoKTtcbiAgICAgIG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXM7XG4gICAgICBpZiAodG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4gKiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6VcIiArIG9uZV9tb250aF95dWFuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0X29iaiA9IHt9O1xuICAgIGF0dGFjaCA9IHt9O1xuICAgIGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZDtcbiAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgfSk7XG4gICAgd3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcbiAgICAgIGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG4gICAgICBvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICBub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuICAgICAgdHJhZGVfdHlwZTogJ05BVElWRScsXG4gICAgICBwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICBhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcbiAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLl9pZCA9IG5ld19pZDtcbiAgICAgICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZTtcbiAgICAgICAgb2JqLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWU7XG4gICAgICAgIG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgICAgICAgb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgIG9iai5wYWlkID0gZmFsc2U7XG4gICAgICAgIG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICAgICAgICBvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgb2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICAgICAgICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKTtcbiAgICAgIH1cbiAgICB9KSwgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50Jyk7XG4gICAgfSkpO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3Rcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcblxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcblxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXG5cbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcblxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcblxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQgfSwgeyBmaWVsZHM6IHsgb2JqZWN0X25hbWU6IDEsIGZsb3dfaWQ6IDEsIHNwYWNlOiAxIH0gfSkuZmV0Y2goKVxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcbiAgICAgICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZVxuICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcblxuICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xuICAgICAgICAgICAgaWYgcGVybXNcbiAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxuICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXG5cbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIF8uZWFjaChvd3MsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBmbCwgcGVybXM7XG4gICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICBwZXJtcyA9IGZsLnBlcm1zO1xuICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgIGlmIChwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKSkge1xuICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGlmIChjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChvcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSBfLnNvbWUob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvd3M7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0U3BhY2VVc2VyUGFzc3dvcmQ6IChzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIC0+XG5cdFx0aWYgIXRoaXMudXNlcklkXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIilcblx0XHRcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcblx0XHRpc1NwYWNlQWRtaW4gPSBzcGFjZT8uYWRtaW5zPy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcblxuXHRcdHVubGVzcyBpc1NwYWNlQWRtaW5cblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKVxuXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxuXG5cdFx0U3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKVxuXG5cdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtsb2dvdXQ6IHRydWV9KVxuXG5cdFx0IyDlpoLmnpznlKjmiLfmiYvmnLrlj7fpgJrov4fpqozor4HvvIzlsLHlj5Hnn63kv6Hmj5DphpJcblx0XHRpZiB1c2VyQ1AubW9iaWxlXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3Jyxcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge25hbWU6Y3VycmVudFVzZXIubmFtZX0sIGxhbmcpXG5cbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCByZWYsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcl9pZDtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBpZiAoIWlzU3BhY2VBZG1pbikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtcbiAgICAgIGxvZ291dDogdHJ1ZVxuICAgIH0pO1xuICAgIGlmICh1c2VyQ1AubW9iaWxlKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHtcbiAgICAgICAgICBuYW1lOiBjdXJyZW50VXNlci5uYW1lXG4gICAgICAgIH0sIGxhbmcpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYmlsbGluZ01hbmFnZXIgPSB7fVxuXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxuIyBzcGFjZV9pZCDnu5Pnrpflr7nosaHlt6XkvZzljLpcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRjb3VudF9kYXlzID0gMFxuXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcblx0Zmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlXG5cblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0c3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMS1lbmRfZGF0ZV90aW1lLmdldERhdGUoKSlcblxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXG5cdFx0IyBkbyBub3RoaW5nXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblx0ZWxzZSBpZiBmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZVxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxuXG5cdHJldHVybiB7XCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXN9XG5cbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSAoc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSktPlxuXHRsYXN0X2JpbGwgPSBudWxsXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXG5cblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRjcmVhdGVkOiB7XG5cdFx0XHRcdCRsdDogcmVmcmVzaF9kYXRlXG5cdFx0XHR9LFxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRpZiBwYXltZW50X2JpbGxcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcblx0ZWxzZVxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdFx0e1xuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0c29ydDoge1xuXHRcdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRcdGlmIGFwcF9iaWxsXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxuXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxuXG5cdGRlYml0cyA9IGlmIGJpbGwuZGViaXRzIHRoZW4gYmlsbC5kZWJpdHMgZWxzZSAwLjBcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XG5cdHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXG5cbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxuXHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXG5cblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxuXHRcdHtcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xuXHRcdFx0XHQkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdFx0XHR9XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7XG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxuXHRcdFx0fVxuXHRcdH1cblx0KVxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRub3cgPSBuZXcgRGF0ZVxuXHRuZXdfYmlsbCA9IG5ldyBPYmplY3Rcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXG5cdG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXG5cdG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZVxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcblx0bmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XG5cdGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XG5cdGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0cmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheVxuXHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdHtcblx0XHRcdGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cblx0XHR9LFxuXHRcdHtcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxuXHRcdH1cblx0KS5mb3JFYWNoIChiaWxsKS0+XG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcblxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpXG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XG5cdG1vZHVsZXMgPSBuZXcgQXJyYXlcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcblxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XG5cdFx0bV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRtb2R1bGU6IG0ubmFtZSxcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHRjcmVhdGVkOiAtMVxuXHRcdFx0fVxuXHRcdClcblx0XHQjIOiLpeacquiOt+W+l+WPr+WMuemFjeeahOiusOW9le+8jOivtOaYjuivpW1vZHVsZeacquWuieijhe+8jOW9k+aciOS4jeiuoeeul+i0ueeUqFxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xuXHRcdFx0IyAgZG8gbm90aGluZ1xuXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXG5cdFx0XHQjICBkbyBub3RoaW5nXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcblxuXHRyZXR1cm4gbW9kdWxlc1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCgobSktPlxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcblx0KVxuXHRyZXR1cm4gbW9kdWxlc19uYW1lXG5cblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0cmV0dXJuXG5cdGlmIGFjY291bnRpbmdfbW9udGggPT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGRlYml0cyA9IDBcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXG5cdFx0XHR7XG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdHRyYW5zYWN0aW9uOiB7XG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdCkuZm9yRWFjaCgoYiktPlxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXG5cdFx0KVxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxuXHRcdHJlbWFpbmluZ19tb250aHMgPSAwXG5cdFx0aWYgYmFsYW5jZSA+IDBcblx0XHRcdGlmIGRlYml0cyA+IDBcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UvZGViaXRzKSArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IDFcblxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxuXHRcdFx0e1xuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHQkc2V0OiB7XG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcblx0XHRcdFx0XHRcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpXG5cdGVsc2Vcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcblx0XHRwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdGVsc2Vcblx0XHRcdHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZClcblxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcblx0XHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXHRcdFx0ZGIuYmlsbGluZ3MucmVtb3ZlKFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdClcblx0XHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcblxuXHRcdFx0IyDnu5PnrpflvZPmnIjnmoRBUFDkvb/nlKjlkI7kvZnpop1cblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXG5cdFx0XHRcdF8uZWFjaCBtb2R1bGVzLCAobSktPlxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcblxuXHRcdGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKVxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSAoc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcblxuXHRtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXlcblxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXG5cblx0bSA9IG1vbWVudCgpXG5cdG5vdyA9IG0uX2RcblxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxuXG5cdCMg5pu05pawc3BhY2XmmK/lkKbkuJPkuJrniYjnmoTmoIforrBcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGVcblxuXHQjIOabtOaWsG1vZHVsZXNcblx0c3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXG5cdHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSlcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxuXG5cdHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzcGFjZV9pZH0sIHskc2V0OiBzcGFjZV91cGRhdGVfb2JqfSlcblx0aWYgclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxuXHRcdFx0bWNsID0gbmV3IE9iamVjdFxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXG5cdFx0XHRtY2wubW9kdWxlID0gbW9kdWxlXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXG5cblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblxuICBpZiAoTWV0ZW9yLnNldHRpbmdzLmNyb24gJiYgTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcykge1xuXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xuICAgIC8vIOWumuaXtuaJp+ihjOe7n+iuoVxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcblxuICAgIHZhciBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFnb19uZXh0KVxuICAgICAgICByZXR1cm47XG4gICAgICBnb19uZXh0ID0gZmFsc2U7XG5cbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XG4gICAgICB9O1xuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZE5vdyA9IG5ldyBEYXRlKCk7ICAgLy/lvZPliY3ml7bpl7RcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XG4gICAgICB9O1xuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjpzcGFjZVtcIl9pZFwiXSxcImNyZWF0ZWRcIjp7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6LmgLvmlbBcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcbiAgICAgIH07XG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcbiAgICAgIHZhciBvd25lck5hbWUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICB9O1xuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXG4gICAgICB2YXIgbGFzdExvZ29uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcbiAgICAgICAgc1VzZXJzLmZvckVhY2goZnVuY3Rpb24gKHNVc2VyKSB7XG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XG4gICAgICAgICAgICBsYXN0TG9nb24gPSB1c2VyLmxhc3RfbG9nb247XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gbGFzdExvZ29uO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xuICAgICAgdmFyIGxhc3RNb2RpZmllZCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XG4gICAgICAgIGlmKG9iakFyci5sZW5ndGggPiAwKVxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XG4gICAgICAgICAgcmV0dXJuIG1vZDtcbiAgICAgIH07XG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xuICAgICAgICAgIH0pICBcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5b2T5pel5paw5aKe6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOiBwb3N0W1wiX2lkXCJdLCBcInVwbG9hZGVkQXRcIjogeyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcbiAgICAgIH07XG4gICAgICAvLyDmj5LlhaXmlbDmja5cbiAgICAgIGRiLnNwYWNlcy5maW5kKHtcImlzX3BhaWRcIjp0cnVlfSkuZm9yRWFjaChmdW5jdGlvbiAoc3BhY2UpIHtcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxuICAgICAgICAgIHNwYWNlX25hbWU6IHNwYWNlW1wibmFtZVwiXSxcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcbiAgICAgICAgICBzdGVlZG9zOntcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHN0YXRpY3NDb3VudChkYi5vcmdhbml6YXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgd29ya2Zsb3c6e1xuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZmxvd19yb2xlczogc3RhdGljc0NvdW50KGRiLmZsb3dfcm9sZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxuICAgICAgICAgICAgaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9pbnN0YW5jZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjbXM6IHtcbiAgICAgICAgICAgIHNpdGVzOiBzdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogcG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xuXG4gICAgICBnb19uZXh0ID0gdHJ1ZTtcblxuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudCcpO1xuICAgIH0pKTtcblxuICB9XG5cbn0pXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMVxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xuICAgICAgICB1cDogLT5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IChwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCktPlxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWVcblxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcbiAgICAgICAgICAgICAgICBpID0gMFxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpXG5cbiAgICAgICAgICAgICAgICAgICAgaSsrXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJykiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAxLFxuICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBpLCB1cGRhdGVfY2ZzX2luc3RhbmNlO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IGZ1bmN0aW9uKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRfaWQsXG4gICAgICAgICAgICBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZV9pZCxcbiAgICAgICAgICAgIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0N1cnJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICAgICBcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGlucykge1xuICAgICAgICAgIHZhciBhdHRhY2hzLCBpbnN0YW5jZV9pZCwgc3BhY2VfaWQ7XG4gICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50cztcbiAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZTtcbiAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWQ7XG4gICAgICAgICAgYXR0YWNocy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmVyLCBwYXJlbnRfaWQ7XG4gICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50O1xuICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldjtcbiAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChhdHQuaGlzdG9yeXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dC5oaXN0b3J5cy5mb3JFYWNoKGZ1bmN0aW9uKGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGkrKztcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiAyXG4gICAgICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OSdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXInXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe29yZ2FuaXphdGlvbnM6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogM1xuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3UudXNlcn0sIHtmaWVsZHM6IHtlbWFpbHM6IDF9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxuICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIGNhdGNoIGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgICBNaWdyYXRpb25zLmFkZFxuICAgICAgICB2ZXJzaW9uOiA0XG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IHVwJ1xuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7c29ydF9ubzogeyRleGlzdHM6IGZhbHNlfX0sIHskc2V0OiB7c29ydF9ubzogMTAwfX0sIHttdWx0aTogdHJ1ZX0pXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgIGRvd246IC0+XG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IGRvd24nXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA1XG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXG5cdFx0dXA6IC0+XG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IHVwJ1xuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xuXHRcdFx0dHJ5XG5cblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcblx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcblx0XHRcdFx0XHRcdFx0XHRyID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLCBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZH19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxuXHRcdFx0XHRcdGVsc2UgaWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KClcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXG5cdFx0XHRcdFx0XHRpZiByZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHN9fSlcblx0XHRcdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuXHRNaWdyYXRpb25zLmFkZFxuXHRcdHZlcnNpb246IDZcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xuXHRcdFx0dHJ5XG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovmoIflh4bniYhcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcblx0XHRcdFx0fSlcblxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxuXHRcdFx0XHR9KVxuXG5cblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cblx0XHRcdFx0XHR0cnlcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2Vcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2Vcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxuXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxuXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXG5cdFx0XHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRkb3duOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+agh+WHhueJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRuZXcgVGFidWxhci5UYWJsZVxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxuXHRcdGNvbHVtbnM6IFtcblx0XHRcdHtcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZVxuXHRcdFx0fVxuXHRcdF1cblx0XHRkb206IFwidHBcIlxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2Vcblx0XHRvcmRlcmluZzogZmFsc2Vcblx0XHRwYWdlTGVuZ3RoOiAxMFxuXHRcdGluZm86IGZhbHNlXG5cdFx0c2VhcmNoaW5nOiB0cnVlXG5cdFx0YXV0b1dpZHRoOiB0cnVlXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxuXHRcdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXG5cdFx0XHR1bmxlc3Mgc3BhY2Vcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
