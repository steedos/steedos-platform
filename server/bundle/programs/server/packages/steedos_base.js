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
  var _Apps, _Dashboards, assigned_menus, authToken, lng, objectsLayout, permissions, ref, result, space, spaceId, userId, userSession;

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
      }

      return result.objects[objectLayout.object_name] = _object;
    });
  }

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
      },
      "workflow": {
        "url": rootURL
      }
    };
  }

  if (!Meteor.settings["public"].webservices.creator) {
    Meteor.settings["public"].webservices.creator = {
      "url": rootURL
    };
  }

  if (!Meteor.settings["public"].webservices.workflow) {
    Meteor.settings["public"].webservices.workflow = {
      "url": rootURL
    };
  }

  if (!Meteor.settings["public"].webservices.creator.url) {
    Meteor.settings["public"].webservices.creator.url = rootURL;
  }

  if (!Meteor.settings["public"].webservices.workflow.url) {
    return Meteor.settings["public"].webservices.workflow.url = rootURL;
  }
});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2Jvb3RzdHJhcC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRLZXlWYWx1ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvZ2V0X3NwYWNlX3VzZXJfY291bnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb3J0QnlOYW1lIiwibG9jYWxlIiwiU3RlZWRvcyIsInNvcnQiLCJwMSIsInAyIiwicDFfc29ydF9ubyIsInNvcnRfbm8iLCJwMl9zb3J0X25vIiwibmFtZSIsImxvY2FsZUNvbXBhcmUiLCJnZXRQcm9wZXJ0eSIsImsiLCJmb3JFYWNoIiwidCIsIm0iLCJwdXNoIiwicmVtb3ZlIiwiZnJvbSIsInRvIiwicmVzdCIsInNsaWNlIiwibGVuZ3RoIiwiYXBwbHkiLCJmaWx0ZXJQcm9wZXJ0eSIsImgiLCJsIiwiZyIsImQiLCJpbmNsdWRlcyIsIk9iamVjdCIsInVuZGVmaW5lZCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJyIiwiQ29va2llcyIsImNyeXB0byIsIm1peGluIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJyZWYiLCJyZWYxIiwicGhvbmUiLCJudW1iZXJUb1N0cmluZyIsIm51bWJlciIsInNjYWxlIiwibm90VGhvdXNhbmRzIiwicmVnIiwidG9TdHJpbmciLCJOdW1iZXIiLCJ0b0ZpeGVkIiwibWF0Y2giLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImF2YXRhclVybCIsImJhY2tncm91bmQiLCJyZWYyIiwidXJsIiwibG9nZ2luZ0luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIiQiLCJjc3MiLCJhYnNvbHV0ZVVybCIsImFkbWluIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJpc0NvcmRvdmEiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwiZXJyb3IxIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwic3BhY2VJZCIsImVuZF9kYXRlIiwibWluX21vbnRocyIsInNwYWNlIiwiaXNTcGFjZUFkbWluIiwic3BhY2VzIiwiaXNfcGFpZCIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlZjMiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsInNwbGl0Iiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJmdW5jIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwiYXV0b3J1biIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImdldFJlbGF0aXZlVXJsIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJwdWJsaXNoIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCIsInN0ZWVkb3NBdXRoIiwic3RlZWRvc0NvcmUiLCJzdGVlZG9zSTE4biIsInN0ZWVkb3NMaWNlbnNlIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJzcGFjZVVzZXIiLCJwcm9maWxlcyIsIl9BcHBzIiwiX0Rhc2hib2FyZHMiLCJhc3NpZ25lZF9tZW51cyIsImxuZyIsIm9iamVjdHNMYXlvdXQiLCJwZXJtaXNzaW9ucyIsInVzZXJTZXNzaW9uIiwid3JhcEFzeW5jIiwiY2IiLCJnZXRTZXNzaW9uIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsInRyYW5zbGF0aW9uT2JqZWN0cyIsIkFwcHMiLCJkYXNoYm9hcmRzIiwiRGFzaGJvYXJkcyIsIm9iamVjdF9saXN0dmlld3MiLCJvYmplY3Rfd29ya2Zsb3dzIiwiZ2V0VXNlck9iamVjdFBlcm1pc3Npb24iLCJzdGVlZG9zU2NoZW1hIiwiZ2V0RGF0YVNvdXJjZXMiLCJkYXRhc291cmNlIiwiZGF0YXNvdXJjZU9iamVjdHMiLCJnZXRPYmplY3RzIiwiX29iaiIsImNvbnZlcnRPYmplY3QiLCJ0b0NvbmZpZyIsImRhdGFiYXNlX25hbWUiLCJnZXRBcHBzQ29uZmlnIiwiZ2V0RGFzaGJvYXJkc0NvbmZpZyIsIl9kYmlkIiwidHJhbnNsYXRpb25BcHBzIiwidHJhbnNsYXRpb25NZW51cyIsInBsdWdpbnMiLCJnZXRQbHVnaW5zIiwib2JqZWN0TGF5b3V0IiwiX2ZpZWxkcyIsIl9vYmplY3QiLCJfaXRlbSIsInJlZjQiLCJyZWY1IiwicmVmNiIsInJlZjciLCJmaWVsZCIsImhhcyIsImdyb3VwIiwicmVxdWlyZWQiLCJyZWFkb25seSIsImRpc2FibGVkIiwiYWxsb3dfYWN0aW9ucyIsImFjdGlvbnMiLCJvbiIsImNodW5rIiwiYmluZEVudmlyb25tZW50IiwicGFyc2VyIiwieG1sMmpzIiwiUGFyc2VyIiwiZXhwbGljaXRBcnJheSIsImV4cGxpY2l0Um9vdCIsInBhcnNlU3RyaW5nIiwiZXJyIiwiV1hQYXkiLCJhdHRhY2giLCJicHIiLCJjb2RlX3VybF9pZCIsInNpZ24iLCJ3eHBheSIsImFwcGlkIiwibWNoX2lkIiwicGFydG5lcl9rZXkiLCJKU09OIiwicGFyc2UiLCJ0b3RhbF9mZWUiLCJiaWxsaW5nTWFuYWdlciIsInNwZWNpYWxfcGF5IiwidXNlcl9jb3VudCIsImxvZyIsImdldF9jb250YWN0c19saW1pdCIsImZyb21zIiwiZnJvbXNDaGlsZHJlbiIsImZyb21zQ2hpbGRyZW5JZHMiLCJpc0xpbWl0IiwibGVuMSIsImxpbWl0IiwibGltaXRzIiwibXlMaXRtaXRPcmdJZHMiLCJteU9yZ0lkIiwibXlPcmdJZHMiLCJteU9yZ3MiLCJvdXRzaWRlX29yZ2FuaXphdGlvbnMiLCJzZXR0aW5nIiwidGVtcElzTGltaXQiLCJ0b09yZ3MiLCJ0b3MiLCJTdHJpbmciLCJzcGFjZV9zZXR0aW5ncyIsInZhbHVlcyIsImludGVyc2VjdGlvbiIsInNldEtleVZhbHVlIiwiaW5zZXJ0IiwiYmlsbGluZ19zZXR0bGV1cCIsImFjY291bnRpbmdfbW9udGgiLCJFbWFpbCIsInRpbWUiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5IiwidGltZUVuZCIsInNldFVzZXJuYW1lIiwiaW52aXRlX3N0YXRlIiwiYmlsbGluZ19yZWNoYXJnZSIsIm5ld19pZCIsIm1vZHVsZV9uYW1lcyIsImxpc3RwcmljZXMiLCJvbmVfbW9udGhfeXVhbiIsIm9yZGVyX2JvZHkiLCJyZXN1bHRfb2JqIiwic3BhY2VfdXNlcl9jb3VudCIsImxpc3RwcmljZV9ybWIiLCJuYW1lX3poIiwiY3JlYXRlVW5pZmllZE9yZGVyIiwiam9pbiIsIm91dF90cmFkZV9ubyIsIm1vbWVudCIsImZvcm1hdCIsInNwYmlsbF9jcmVhdGVfaXAiLCJub3RpZnlfdXJsIiwidHJhZGVfdHlwZSIsInByb2R1Y3RfaWQiLCJpbmZvIiwiZ2V0X3NwYWNlX3VzZXJfY291bnQiLCJ1c2VyX2NvdW50X2luZm8iLCJ0b3RhbF91c2VyX2NvdW50IiwiYWNjZXB0ZWRfdXNlcl9jb3VudCIsImNyZWF0ZV9zZWNyZXQiLCJyZW1vdmVfc2VjcmV0IiwidG9rZW4iLCJjdXJTcGFjZVVzZXIiLCJvd3MiLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsImZsb3dfbmFtZSIsImNhbl9hZGQiLCJ1c2Vyc19jYW5fYWRkIiwib3Jnc19jYW5fYWRkIiwic29tZSIsInNldFNwYWNlVXNlclBhc3N3b3JkIiwic3BhY2VfdXNlcl9pZCIsImN1cnJlbnRVc2VyIiwibGFuZyIsInVzZXJDUCIsInNldFBhc3N3b3JkIiwibG9nb3V0IiwibW9iaWxlX3ZlcmlmaWVkIiwiU01TUXVldWUiLCJGb3JtYXQiLCJBY3Rpb24iLCJQYXJhbVN0cmluZyIsIlJlY051bSIsIlNpZ25OYW1lIiwiVGVtcGxhdGVDb2RlIiwiZ2V0X2FjY291bnRpbmdfcGVyaW9kIiwiY291bnRfZGF5cyIsImVuZF9kYXRlX3RpbWUiLCJzdGFydF9kYXRlX3RpbWUiLCJiaWxsaW5ncyIsInRyYW5zYWN0aW9uIiwiYmlsbGluZ19kYXRlIiwiZ2V0RGF0ZSIsInJlZnJlc2hfYmFsYW5jZSIsInJlZnJlc2hfZGF0ZSIsImFwcF9iaWxsIiwiYl9tIiwiYl9tX2QiLCJiaWxsIiwiY3JlZGl0cyIsImRlYml0cyIsImxhc3RfYmFsYW5jZSIsImxhc3RfYmlsbCIsInBheW1lbnRfYmlsbCIsInNldE9iaiIsIiRsdCIsImJpbGxpbmdfbW9udGgiLCJiYWxhbmNlIiwiZ2V0X2JhbGFuY2UiLCJtb2R1bGVfbmFtZSIsImxpc3RwcmljZSIsImFjY291bnRpbmdfZGF0ZSIsImFjY291bnRpbmdfZGF0ZV9mb3JtYXQiLCJkYXlzX251bWJlciIsIm5ld19iaWxsIiwiJGx0ZSIsIl9tYWtlTmV3SUQiLCJnZXRTcGFjZVVzZXJDb3VudCIsInJlY2FjdWxhdGVCYWxhbmNlIiwicmVmcmVzaF9kYXRlcyIsInJfZCIsImdldF9tb2R1bGVzIiwibV9jaGFuZ2Vsb2ciLCJtb2R1bGVzX2NoYW5nZWxvZ3MiLCJjaGFuZ2VfZGF0ZSIsIm9wZXJhdGlvbiIsImdldF9tb2R1bGVzX25hbWUiLCJtb2R1bGVzX25hbWUiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsIm9wZXJhdG9yX2lkIiwibmV3X21vZHVsZXMiLCJzcGFjZV91cGRhdGVfb2JqIiwiZGlmZmVyZW5jZSIsIl9kIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJkYXRlRm9ybWF0IiwiZGF0ZWtleSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJ5ZXN0ZXJEYXkiLCJkTm93IiwiZEJlZm9yZSIsImRhaWx5U3RhdGljc0NvdW50Iiwic3RhdGljcyIsIiRndCIsInN0YXRpY3NDb3VudCIsIm93bmVyTmFtZSIsImxhc3RMb2dvbiIsInNVc2VycyIsInNVc2VyIiwibGFzdE1vZGlmaWVkIiwib2JqQXJyIiwibW9kIiwicG9zdHNBdHRhY2htZW50cyIsImF0dFNpemUiLCJzaXplU3VtIiwicG9zdHMiLCJwb3N0IiwiYXR0cyIsImNmcyIsImF0dCIsIm9yaWdpbmFsIiwiZGFpbHlQb3N0c0F0dGFjaG1lbnRzIiwic3RlZWRvc19zdGF0aXN0aWNzIiwic3BhY2VfbmFtZSIsIm93bmVyX25hbWUiLCJzdGVlZG9zIiwid29ya2Zsb3ciLCJmbG93cyIsImZvcm1zIiwiZmxvd19yb2xlcyIsImZsb3dfcG9zaXRpb25zIiwiaW5zdGFuY2VzIiwiaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQiLCJkYWlseV9mbG93cyIsImRhaWx5X2Zvcm1zIiwiZGFpbHlfaW5zdGFuY2VzIiwiY21zIiwic2l0ZXMiLCJjbXNfc2l0ZXMiLCJjbXNfcG9zdHMiLCJwb3N0c19sYXN0X21vZGlmaWVkIiwicG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsImNvbW1lbnRzIiwiY21zX2NvbW1lbnRzIiwiZGFpbHlfc2l0ZXMiLCJkYWlseV9wb3N0cyIsImRhaWx5X2NvbW1lbnRzIiwiZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZSIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwicGFyZW50IiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwibW9udGhzIiwic2V0X29iaiIsInBtIiwic2V0TW9udGgiLCJyb290VVJMIiwiY3JlYXRvciIsIlRhYnVsYXIiLCJUYWJsZSIsImNvbHVtbnMiLCJvcmRlcmFibGUiLCJkb20iLCJsZW5ndGhDaGFuZ2UiLCJvcmRlcmluZyIsInNlYXJjaGluZyIsImF1dG9XaWR0aCIsImNoYW5nZVNlbGVjdG9yIiwiJGFuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEIsbUJBQWlCLFFBREQ7QUFFaEJJLFNBQU8sRUFBRSxRQUZPO0FBR2hCLFlBQVUsU0FITTtBQUloQkMsUUFBTSxFQUFFLFFBSlE7QUFLaEIsZ0NBQThCO0FBTGQsQ0FBRCxFQU1iLGNBTmEsQ0FBaEI7O0FBUUEsSUFBSUMsTUFBTSxDQUFDQyxRQUFQLElBQW1CRCxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLE9BQXZDLEVBQWdEO0FB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LENBQWU7QUNDYixTREFELElBQUlzZixRQUFRQyxLQUFaLENBQ0M7QUFBQXgxQixVQUFNLGdCQUFOO0FBQ0E2USxnQkFBWWpQLEdBQUd1RixJQURmO0FBRUFzdUIsYUFBUyxDQUNSO0FBQ0Nqa0IsWUFBTSxNQURQO0FBRUNra0IsaUJBQVc7QUFGWixLQURRLENBRlQ7QUFRQUMsU0FBSyxJQVJMO0FBU0E5YSxpQkFBYSxDQUFDLEtBQUQsRUFBUSxPQUFSLENBVGI7QUFVQSthLGtCQUFjLEtBVmQ7QUFXQUMsY0FBVSxLQVhWO0FBWUExYSxnQkFBWSxFQVpaO0FBYUE4TyxVQUFNLEtBYk47QUFjQTZMLGVBQVcsSUFkWDtBQWVBQyxlQUFXLElBZlg7QUFnQkFDLG9CQUFnQixVQUFDOWIsUUFBRCxFQUFXaFcsTUFBWDtBQUNmLFVBQUFuQyxHQUFBLEVBQUE0SCxLQUFBOztBQUFBLFdBQU96RixNQUFQO0FBQ0MsZUFBTztBQUFDOEUsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ0lHOztBREhKVyxjQUFRdVEsU0FBU3ZRLEtBQWpCOztBQUNBLFdBQU9BLEtBQVA7QUFDQyxhQUFBdVEsWUFBQSxRQUFBblksTUFBQW1ZLFNBQUErYixJQUFBLFlBQUFsMEIsSUFBbUJsQixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDOEksa0JBQVF1USxTQUFTK2IsSUFBVCxDQUFjLzFCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBT3lKLEtBQVA7QUFDQyxlQUFPO0FBQUNYLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPa1IsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcblx0Y2hlY2tOcG1WZXJzaW9uc1xyXG59IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHRcIm5vZGUtc2NoZWR1bGVcIjogXCJeMS4zLjFcIixcclxuXHRjb29raWVzOiBcIl4wLjYuMlwiLFxyXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxyXG5cdG1rZGlycDogXCJeMC4zLjVcIixcclxuXHRcInVybC1zZWFyY2gtcGFyYW1zLXBvbHlmaWxsXCI6IFwiXjcuMC4wXCIsXHJcbn0sICdzdGVlZG9zOmJhc2UnKTtcclxuXHJcbmlmIChNZXRlb3Iuc2V0dGluZ3MgJiYgTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcpIHtcclxuXHRjaGVja05wbVZlcnNpb25zKHtcclxuXHRcdFwid2VpeGluLXBheVwiOiBcIl4xLjEuN1wiXHJcblx0fSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG59IiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XHJcbiAgICBpZiAoIXRoaXMpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZighbG9jYWxlKXtcclxuICAgICAgICBsb2NhbGUgPSBTdGVlZG9zLmxvY2FsZSgpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNvcnQoZnVuY3Rpb24gKHAxLCBwMikge1xyXG5cdFx0dmFyIHAxX3NvcnRfbm8gPSBwMS5zb3J0X25vIHx8IDA7XHJcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcclxuXHRcdGlmKHAxX3NvcnRfbm8gIT0gcDJfc29ydF9ubyl7XHJcbiAgICAgICAgICAgIHJldHVybiBwMV9zb3J0X25vID4gcDJfc29ydF9ubyA/IC0xIDogMVxyXG4gICAgICAgIH1lbHNle1xyXG5cdFx0XHRyZXR1cm4gcDEubmFtZS5sb2NhbGVDb21wYXJlKHAyLm5hbWUsIGxvY2FsZSk7XHJcblx0XHR9XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5BcnJheS5wcm90b3R5cGUuZ2V0UHJvcGVydHkgPSBmdW5jdGlvbiAoaykge1xyXG4gICAgdmFyIHYgPSBuZXcgQXJyYXkoKTtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRba10gOiBudWxsO1xyXG4gICAgICAgIHYucHVzaChtKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHY7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qEcmVtb3Zl5Ye95pWwXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGZyb20sIHRvKSB7XHJcbiAgICBpZiAoZnJvbSA8IDApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB2YXIgcmVzdCA9IHRoaXMuc2xpY2UoKHRvIHx8IGZyb20pICsgMSB8fCB0aGlzLmxlbmd0aCk7XHJcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcclxuICAgIHJldHVybiB0aGlzLnB1c2guYXBwbHkodGhpcywgcmVzdCk7XHJcbn07XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maWx0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgZyA9IFtdO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcclxuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChtIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJpZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIl9pZFwiIGluIG0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtID0gbVtcIl9pZFwiXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBsLmluY2x1ZGVzKG0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIGcucHVzaCh0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBnO1xyXG59XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxyXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq5a+56LGhXHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XHJcbiAgICB2YXIgciA9IG51bGw7XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICByID0gdDtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByO1xyXG59IiwiU3RlZWRvcyA9XHJcblx0c2V0dGluZ3M6IHt9XHJcblx0ZGI6IGRiXHJcblx0c3Viczoge31cclxuXHRpc1Bob25lRW5hYmxlZDogLT5cclxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxyXG5cdG51bWJlclRvU3RyaW5nOiAobnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKS0+XHJcblx0XHRpZiB0eXBlb2YgbnVtYmVyID09IFwibnVtYmVyXCJcclxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcclxuXHJcblx0XHRpZiAhbnVtYmVyXHJcblx0XHRcdHJldHVybiAnJztcclxuXHJcblx0XHRpZiBudW1iZXIgIT0gXCJOYU5cIlxyXG5cdFx0XHRpZiBzY2FsZSB8fCBzY2FsZSA9PSAwXHJcblx0XHRcdFx0bnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSlcclxuXHRcdFx0dW5sZXNzIG5vdFRob3VzYW5kc1xyXG5cdFx0XHRcdGlmICEoc2NhbGUgfHwgc2NhbGUgPT0gMClcclxuXHRcdFx0XHRcdCMg5rKh5a6a5LmJc2NhbGXml7bvvIzmoLnmja7lsI/mlbDngrnkvY3nva7nrpflh7pzY2FsZeWAvFxyXG5cdFx0XHRcdFx0c2NhbGUgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pP1sxXT8ubGVuZ3RoXHJcblx0XHRcdFx0XHR1bmxlc3Mgc2NhbGVcclxuXHRcdFx0XHRcdFx0c2NhbGUgPSAwXHJcblx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nXHJcblx0XHRcdFx0aWYgc2NhbGUgPT0gMFxyXG5cdFx0XHRcdFx0cmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nXHJcblx0XHRcdFx0bnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJylcclxuXHRcdFx0cmV0dXJuIG51bWJlclxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gXCJcIlxyXG5cdHZhbGlKcXVlcnlTeW1ib2xzOiAoc3RyKS0+XHJcblx0XHQjIHJlZyA9IC9eW14hXCIjJCUmJygpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0rJC9nXHJcblx0XHRyZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpXHJcblx0XHRyZXR1cm4gcmVnLnRlc3Qoc3RyKVxyXG5cclxuIyMjXHJcbiMgS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXHJcbiMgQG5hbWVzcGFjZSBTdGVlZG9zXHJcbiMjI1xyXG5cclxuU3RlZWRvcy5nZXRIZWxwVXJsID0gKGxvY2FsZSktPlxyXG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXHJcblx0cmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHJcblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XHJcblx0XHRzd2FsKHt0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSwgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLCBodG1sOiB0cnVlLCB0eXBlOlwid2FybmluZ1wiLCBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpfSk7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJiZ19ib2R5XCJ9KVxyXG5cdFx0aWYgYWNjb3VudEJnQm9keVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSAoYWNjb3VudEJnQm9keVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0XHR1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsXHJcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXHJcblx0XHRpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXHJcblx0XHRcdGlmIHVybCA9PSBhdmF0YXJcclxuXHRcdFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKHVybCl9KVwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGJhY2tncm91bmQgPSBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8uYWRtaW4/LmJhY2tncm91bmRcclxuXHRcdFx0aWYgYmFja2dyb3VuZFxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcclxuXHJcblx0XHRpZiBpc05lZWRUb0xvY2FsXHJcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50QmdCb2R5VmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsdXJsKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsYXZhdGFyKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInNraW5cIn0pXHJcblx0XHRpZiBhY2NvdW50U2tpblxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudFNraW4udmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxyXG5cdFx0aWYgYWNjb3VudFpvb21cclxuXHRcdFx0cmV0dXJuIGFjY291bnRab29tLnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XHJcblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XHJcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXHJcblx0XHQkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XHJcblx0XHR6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0em9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemVcclxuXHRcdHVubGVzcyB6b29tTmFtZVxyXG5cdFx0XHR6b29tTmFtZSA9IFwibGFyZ2VcIlxyXG5cdFx0XHR6b29tU2l6ZSA9IDEuMlxyXG5cdFx0aWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxyXG5cdFx0XHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcclxuXHRcdFx0IyBpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcclxuXHRcdFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxyXG5cdFx0XHQjIFx0XHR6b29tU2l6ZSA9IDBcclxuXHRcdFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcclxuXHRcdFx0IyBlbHNlXHJcblx0XHRcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcclxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcclxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRab29tVmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0aWYgU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIixhY2NvdW50Wm9vbVZhbHVlLm5hbWUpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcclxuXHJcblx0U3RlZWRvcy5zaG93SGVscCA9ICh1cmwpLT5cclxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcclxuXHRcdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXHJcblxyXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXHJcblxyXG5cdFx0d2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKVxyXG5cclxuXHRTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9ICh1cmwpLT5cclxuXHRcdGF1dGhUb2tlbiA9IHt9O1xyXG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXHJcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XHJcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xyXG5cclxuXHRcdGxpbmtlciA9IFwiP1wiXHJcblxyXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0bGlua2VyID0gXCImXCJcclxuXHJcblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXHJcblxyXG5cdFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gKGFwcF9pZCktPlxyXG5cdFx0YXV0aFRva2VuID0ge307XHJcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcclxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcclxuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XHJcblx0XHRyZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbilcclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxyXG5cdFx0dXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXHJcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsIHVybFxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblxyXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsXHJcblx0XHRlbHNlXHJcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xyXG5cclxuXHRTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSAodXJsKS0+XHJcblx0XHRpZiB1cmxcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXHJcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXHJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XHJcblx0XHRcdFx0XHRpZiBlcnJvclxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3JcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcclxuXHJcblxyXG5cdFN0ZWVkb3Mub3BlbkFwcCA9IChhcHBfaWQpLT5cclxuXHRcdGlmICFNZXRlb3IudXNlcklkKClcclxuXHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG5cdFx0aWYgIWFwcFxyXG5cdFx0XHRGbG93Um91dGVyLmdvKFwiL1wiKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHQjIGNyZWF0b3JTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LndlYnNlcnZpY2VzPy5jcmVhdG9yXHJcblx0XHQjIGlmIGFwcC5faWQgPT0gXCJhZG1pblwiIGFuZCBjcmVhdG9yU2V0dGluZ3M/LnN0YXR1cyA9PSBcImFjdGl2ZVwiXHJcblx0XHQjIFx0dXJsID0gY3JlYXRvclNldHRpbmdzLnVybFxyXG5cdFx0IyBcdHJlZyA9IC9cXC8kL1xyXG5cdFx0IyBcdHVubGVzcyByZWcudGVzdCB1cmxcclxuXHRcdCMgXHRcdHVybCArPSBcIi9cIlxyXG5cdFx0IyBcdHVybCA9IFwiI3t1cmx9YXBwL2FkbWluXCJcclxuXHRcdCMgXHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxyXG5cdFx0IyBcdHJldHVyblxyXG5cclxuXHRcdG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrXHJcblx0XHRpZiBhcHAuaXNfdXNlX2llXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcclxuXHRcdFx0XHRpZiBvbl9jbGlja1xyXG5cdFx0XHRcdFx0cGF0aCA9IFwiYXBpL2FwcC9zc28vI3thcHBfaWR9P2F1dGhUb2tlbj0je0FjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCl9JnVzZXJJZD0je01ldGVvci51c2VySWQoKX1cIlxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmxcclxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcclxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cclxuXHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGVsc2UgaWYgZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oYXBwLnVybClcclxuXHJcblx0XHRlbHNlIGlmIGFwcC5pc191c2VfaWZyYW1lXHJcblx0XHRcdGlmIGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpXHJcblx0XHRcdGVsc2UgaWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKClcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS8je2FwcC5faWR9XCIpXHJcblxyXG5cdFx0ZWxzZSBpZiBvbl9jbGlja1xyXG5cdFx0XHQjIOi/memHjOaJp+ihjOeahOaYr+S4gOS4quS4jeW4puWPguaVsOeahOmXreWMheWHveaVsO+8jOeUqOadpemBv+WFjeWPmOmHj+axoeafk1xyXG5cdFx0XHRldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXsje29uX2NsaWNrfX0pKClcIlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRldmFsKGV2YWxGdW5TdHJpbmcpXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHQjIGp1c3QgY29uc29sZSB0aGUgZXJyb3Igd2hlbiBjYXRjaCBlcnJvclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCIje2UubWVzc2FnZX1cXHJcXG4je2Uuc3RhY2t9XCJcclxuXHRcdGVsc2VcclxuXHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHJcblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2tcclxuXHRcdFx0IyDpnIDopoHpgInkuK3lvZPliY1hcHDml7bvvIxvbl9jbGlja+WHveaVsOmHjOimgeWNleeLrOWKoOS4ilNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cdFx0XHRTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcclxuXHJcblx0U3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IChzcGFjZUlkKS0+XHJcblx0XHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcclxuXHRcdG1pbl9tb250aHMgPSAxXHJcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXHJcblx0XHRcdG1pbl9tb250aHMgPSAzXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXHJcblx0XHRlbmRfZGF0ZSA9IHNwYWNlPy5lbmRfZGF0ZVxyXG5cdFx0aWYgc3BhY2U/LmlzX3BhaWQgYW5kIGVuZF9kYXRlICE9IHVuZGVmaW5lZCBhbmQgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzKjMwKjI0KjM2MDAqMTAwMClcclxuXHRcdFx0IyDmj5DnpLrnlKjmiLfkvZnpop3kuI3otrNcclxuXHRcdFx0dG9hc3RyLmVycm9yIHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKVxyXG5cclxuXHRTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gKCktPlxyXG5cdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXHJcblx0XHR1bmxlc3MgYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSdcclxuXHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0d2hlbiAnbm9ybWFsJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTEyXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gNzVcclxuXHRcdFx0d2hlbiAnbGFyZ2UnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtNlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAxOTlcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gOVxyXG5cdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC0yNlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCMg5Yy65YiGSUXmtY/op4jlmahcclxuXHRcdFx0XHRcdGlmIFN0ZWVkb3MuZGV0ZWN0SUUoKVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAzMDNcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gNTNcclxuXHJcblx0XHRpZiAkKFwiLm1vZGFsXCIpLmxlbmd0aFxyXG5cdFx0XHQkKFwiLm1vZGFsXCIpLmVhY2ggLT5cclxuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAwXHJcblx0XHRcdFx0Zm9vdGVySGVpZ2h0ID0gMFxyXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gMFxyXG5cdFx0XHRcdCQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2ggLT5cclxuXHRcdFx0XHRcdGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxyXG5cdFx0XHRcdCQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2ggLT5cclxuXHRcdFx0XHRcdGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxyXG5cclxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodFxyXG5cdFx0XHRcdGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldFxyXG5cdFx0XHRcdGlmICQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpXHJcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIn0pXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcImF1dG9cIn0pXHJcblxyXG5cdFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSAob2Zmc2V0KS0+XHJcblx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0cmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1XHJcblx0XHR1bmxlc3MgU3RlZWRvcy5pc2lPUygpIG9yIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHQjIGlvc+WPiuaJi+acuuS4iuS4jemcgOimgeS4unpvb23mlL7lpKflip/og73pop3lpJborqHnrpdcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXHJcblx0XHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0XHR3aGVuICdsYXJnZSdcclxuXHRcdFx0XHRcdCMg5rWL5LiL5p2l6L+Z6YeM5LiN6ZyA6KaB6aKd5aSW5YeP5pWwXHJcblx0XHRcdFx0XHRyZVZhbHVlIC09IDUwXHJcblx0XHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXHJcblx0XHRcdFx0XHRyZVZhbHVlIC09IDE0NVxyXG5cdFx0aWYgb2Zmc2V0XHJcblx0XHRcdHJlVmFsdWUgLT0gb2Zmc2V0XHJcblx0XHRyZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcclxuXHJcblx0U3RlZWRvcy5pc2lPUyA9ICh1c2VyQWdlbnQsIGxhbmd1YWdlKS0+XHJcblx0XHRERVZJQ0UgPVxyXG5cdFx0XHRhbmRyb2lkOiAnYW5kcm9pZCdcclxuXHRcdFx0YmxhY2tiZXJyeTogJ2JsYWNrYmVycnknXHJcblx0XHRcdGRlc2t0b3A6ICdkZXNrdG9wJ1xyXG5cdFx0XHRpcGFkOiAnaXBhZCdcclxuXHRcdFx0aXBob25lOiAnaXBob25lJ1xyXG5cdFx0XHRpcG9kOiAnaXBvZCdcclxuXHRcdFx0bW9iaWxlOiAnbW9iaWxlJ1xyXG5cdFx0YnJvd3NlciA9IHt9XHJcblx0XHRjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSdcclxuXHRcdG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJ1xyXG5cdFx0dXNlckFnZW50ID0gKHVzZXJBZ2VudCBvciBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpXHJcblx0XHRsYW5ndWFnZSA9IGxhbmd1YWdlIG9yIG5hdmlnYXRvci5sYW5ndWFnZSBvciBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlXHJcblx0XHRkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSBvciB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgb3IgW1xyXG5cdFx0XHQnJ1xyXG5cdFx0XHRERVZJQ0UuZGVza3RvcFxyXG5cdFx0XVxyXG5cdFx0YnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV1cclxuXHRcdHJldHVybiBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBhZCBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBob25lIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcG9kXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoaXNJbmNsdWRlUGFyZW50cyktPlxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKClcclxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXHJcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xyXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxyXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcclxuXHJcblx0U3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSAodGFyZ2V0LCBpZnIpLT5cclxuXHRcdHVubGVzcyBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0dGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XHJcblx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRpZiBpZnJcclxuXHRcdFx0aWYgdHlwZW9mIGlmciA9PSAnc3RyaW5nJ1xyXG5cdFx0XHRcdGlmciA9IHRhcmdldC4kKGlmcilcclxuXHRcdFx0aWZyLmxvYWQgLT5cclxuXHRcdFx0XHRpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpXHJcblx0XHRcdFx0aWYgaWZyQm9keVxyXG5cdFx0XHRcdFx0aWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cclxuXHRcdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoc3BhY2VJZCx1c2VySWQsaXNJbmNsdWRlUGFyZW50cyktPlxyXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcclxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXHJcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXHJcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xyXG5cclxuI1x0U3RlZWRvcy5jaGFyZ2VBUEljaGVjayA9IChzcGFjZUlkKS0+XHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHQjVE9ETyDmt7vliqDmnI3liqHnq6/mmK/lkKbmiYvmnLrnmoTliKTmlq0o5L6d5o2ucmVxdWVzdClcclxuXHRTdGVlZG9zLmlzTW9iaWxlID0gKCktPlxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IChzcGFjZUlkLCB1c2VySWQpLT5cclxuXHRcdGlmICFzcGFjZUlkIHx8ICF1c2VySWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXHJcblx0XHRpZiAhc3BhY2UgfHwgIXNwYWNlLmFkbWluc1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRyZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKT49MFxyXG5cclxuXHRTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gKHNwYWNlSWQsYXBwX3ZlcnNpb24pLT5cclxuXHRcdGlmICFzcGFjZUlkXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0Y2hlY2sgPSBmYWxzZVxyXG5cdFx0bW9kdWxlcyA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpPy5tb2R1bGVzXHJcblx0XHRpZiBtb2R1bGVzIGFuZCBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKVxyXG5cdFx0XHRjaGVjayA9IHRydWVcclxuXHRcdHJldHVybiBjaGVja1xyXG5cclxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuaciee7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquimgeaVsOe7hG9yZ0lkc+S4reS7u+S9leS4gOS4que7hOe7h+acieadg+mZkOWwsei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxyXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XHJcblx0XHRpc09yZ0FkbWluID0gZmFsc2VcclxuXHRcdHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjpvcmdJZHN9fSx7ZmllbGRzOntwYXJlbnRzOjEsYWRtaW5zOjF9fSkuZmV0Y2goKVxyXG5cdFx0cGFyZW50cyA9IFtdXHJcblx0XHRhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlciAob3JnKSAtPlxyXG5cdFx0XHRpZiBvcmcucGFyZW50c1xyXG5cdFx0XHRcdHBhcmVudHMgPSBfLnVuaW9uIHBhcmVudHMsb3JnLnBhcmVudHNcclxuXHRcdFx0cmV0dXJuIG9yZy5hZG1pbnM/LmluY2x1ZGVzKHVzZXJJZClcclxuXHRcdGlmIGFsbG93QWNjZXNzT3Jncy5sZW5ndGhcclxuXHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBwYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLnVuaXEgcGFyZW50c1xyXG5cdFx0XHRpZiBwYXJlbnRzLmxlbmd0aCBhbmQgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtfaWQ6eyRpbjpwYXJlbnRzfSwgYWRtaW5zOnVzZXJJZH0pXHJcblx0XHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcclxuXHRcdHJldHVybiBpc09yZ0FkbWluXHJcblxyXG5cclxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuacieWFqOmDqOe7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquacieaVsOe7hG9yZ0lkc+S4reavj+S4que7hOe7h+mDveacieadg+mZkOaJjei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxyXG5cdFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gKG9yZ0lkcywgdXNlcklkKS0+XHJcblx0XHR1bmxlc3Mgb3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0aSA9IDBcclxuXHRcdHdoaWxlIGkgPCBvcmdJZHMubGVuZ3RoXHJcblx0XHRcdGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyBbb3JnSWRzW2ldXSwgdXNlcklkXHJcblx0XHRcdHVubGVzcyBpc09yZ0FkbWluXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0aSsrXHJcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxyXG5cclxuXHRTdGVlZG9zLmFic29sdXRlVXJsID0gKHVybCktPlxyXG5cdFx0aWYgdXJsXHJcblx0XHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxyXG5cdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcclxuXHRcdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxyXG5cdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XHJcblx0XHRlbHNlXHJcblx0XHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxyXG5cdFx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcclxuXHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblxyXG5cdCNcdOmAmui/h3JlcXVlc3QuaGVhZGVyc+OAgWNvb2tpZSDojrflvpfmnInmlYjnlKjmiLdcclxuXHRTdGVlZG9zLmdldEFQSUxvZ2luVXNlclx0PSAocmVxLCByZXMpIC0+XHJcblxyXG5cdFx0dXNlcm5hbWUgPSByZXEucXVlcnk/LnVzZXJuYW1lXHJcblxyXG5cdFx0cGFzc3dvcmQgPSByZXEucXVlcnk/LnBhc3N3b3JkXHJcblxyXG5cdFx0aWYgdXNlcm5hbWUgJiYgcGFzc3dvcmRcclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe3N0ZWVkb3NfaWQ6IHVzZXJuYW1lfSlcclxuXHJcblx0XHRcdGlmICF1c2VyXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBwYXNzd29yZFxyXG5cclxuXHRcdFx0aWYgcmVzdWx0LmVycm9yXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcilcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB1c2VyXHJcblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxyXG5cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcclxuXHJcblx0XHRpZiByZXEuaGVhZGVyc1xyXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxyXG5cclxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHQjXHTmo4Dmn6V1c2VySWTjgIFhdXRoVG9rZW7mmK/lkKbmnInmlYhcclxuXHRTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gKHVzZXJJZCwgYXV0aFRva2VuKSAtPlxyXG5cdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XHJcblx0U3RlZWRvcy5kZWNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XHJcblx0XHR0cnlcclxuXHRcdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRcdGxlbiA9IGtleS5sZW5ndGhcclxuXHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTMyID0ga2V5ICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxyXG5cclxuXHRcdFx0ZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0ZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XHJcblx0XHRcdHJldHVybiBwYXNzd29yZDtcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cclxuXHRTdGVlZG9zLmVuY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cclxuXHRcdGtleTMyID0gXCJcIlxyXG5cdFx0bGVuID0ga2V5Lmxlbmd0aFxyXG5cdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdGkrK1xyXG5cdFx0XHRrZXkzMiA9IGtleSArIGNcclxuXHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKVxyXG5cclxuXHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IChhY2Nlc3NfdG9rZW4pLT5cclxuXHJcblx0XHRpZiAhYWNjZXNzX3Rva2VuXHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cclxuXHRcdHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF1cclxuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pXHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkLCBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW59KVxyXG5cclxuXHRcdGlmIHVzZXJcclxuXHRcdFx0cmV0dXJuIHVzZXJJZFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHQjIOWmguaenHVzZXLooajmnKrmn6XliLDvvIzliJnkvb/nlKhvYXV0aDLljY/orq7nlJ/miJDnmoR0b2tlbuafpeaJvueUqOaIt1xyXG5cdFx0XHRjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuXHJcblxyXG5cdFx0XHRvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoeydhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlbn0pXHJcblx0XHRcdGlmIG9ialxyXG5cdFx0XHRcdCMg5Yik5patdG9rZW7nmoTmnInmlYjmnJ9cclxuXHRcdFx0XHRpZiBvYmo/LmV4cGlyZXMgPCBuZXcgRGF0ZSgpXHJcblx0XHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBleHBpcmVkLlwiXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIG9iaj8udXNlcklkXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBub3QgZm91bmQuXCJcclxuXHRcdHJldHVybiBudWxsXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxyXG5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cclxuXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXHJcblxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcclxuXHJcblx0XHRpZiByZXEuaGVhZGVyc1xyXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxyXG5cclxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdFx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcclxuXHJcblx0U3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gKHJlcSwgcmVzKSAtPlxyXG5cdFx0dHJ5XHJcblx0XHRcdHVzZXJJZCA9IHJlcS51c2VySWRcclxuXHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIixcclxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdGNhdGNoIGVcclxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IGUubWVzc2FnZSxcclxuXHRcdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHJcbiMgVGhpcyB3aWxsIGFkZCB1bmRlcnNjb3JlLnN0cmluZyBtZXRob2RzIHRvIFVuZGVyc2NvcmUuanNcclxuIyBleGNlcHQgZm9yIGluY2x1ZGUsIGNvbnRhaW5zLCByZXZlcnNlIGFuZCBqb2luIHRoYXQgYXJlXHJcbiMgZHJvcHBlZCBiZWNhdXNlIHRoZXkgY29sbGlkZSB3aXRoIHRoZSBmdW5jdGlvbnMgYWxyZWFkeVxyXG4jIGRlZmluZWQgYnkgVW5kZXJzY29yZS5qcy5cclxuXHJcbm1peGluID0gKG9iaikgLT5cclxuXHRfLmVhY2ggXy5mdW5jdGlvbnMob2JqKSwgKG5hbWUpIC0+XHJcblx0XHRpZiBub3QgX1tuYW1lXSBhbmQgbm90IF8ucHJvdG90eXBlW25hbWVdP1xyXG5cdFx0XHRmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXVxyXG5cdFx0XHRfLnByb3RvdHlwZVtuYW1lXSA9IC0+XHJcblx0XHRcdFx0YXJncyA9IFt0aGlzLl93cmFwcGVkXVxyXG5cdFx0XHRcdHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKVxyXG5cclxuI21peGluKF9zLmV4cG9ydHMoKSlcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG4jIOWIpOaWreaYr+WQpuaYr+iKguWBh+aXpVxyXG5cdFN0ZWVkb3MuaXNIb2xpZGF5ID0gKGRhdGUpLT5cclxuXHRcdGlmICFkYXRlXHJcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0ZGF5ID0gZGF0ZS5nZXREYXkoKVxyXG5cdFx0IyDlkajlha3lkajml6XkuLrlgYfmnJ9cclxuXHRcdGlmIGRheSBpcyA2IG9yIGRheSBpcyAwXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0IyDmoLnmja7kvKDlhaXml7bpl7QoZGF0ZSnorqHnrpflh6DkuKrlt6XkvZzml6UoZGF5cynlkI7nmoTml7bpl7QsZGF5c+ebruWJjeWPquiDveaYr+aVtOaVsFxyXG5cdFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IChkYXRlLCBkYXlzKS0+XHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHRjaGVjayBkYXlzLCBOdW1iZXJcclxuXHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRjYWN1bGF0ZURhdGUgPSAoaSwgZGF5cyktPlxyXG5cdFx0XHRpZiBpIDwgZGF5c1xyXG5cdFx0XHRcdHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0KjYwKjYwKjEwMDApXHJcblx0XHRcdFx0aWYgIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRjYWN1bGF0ZURhdGUoaSwgZGF5cylcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRjYWN1bGF0ZURhdGUoMCwgZGF5cylcclxuXHRcdHJldHVybiBwYXJhbV9kYXRlXHJcblxyXG5cdCMg6K6h566X5Y2K5Liq5bel5L2c5pel5ZCO55qE5pe26Ze0XHJcblx0IyDlj4LmlbAgbmV4dOWmguaenOS4unRydWXliJnooajnpLrlj6rorqHnrpdkYXRl5pe26Ze05ZCO6Z2i57Sn5o6l552A55qEdGltZV9wb2ludHNcclxuXHRTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gKGRhdGUsIG5leHQpIC0+XHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHR0aW1lX3BvaW50cyA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQ/LnRpbWVfcG9pbnRzXHJcblx0XHRpZiBub3QgdGltZV9wb2ludHMgb3IgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKVxyXG5cdFx0XHRjb25zb2xlLmVycm9yIFwidGltZV9wb2ludHMgaXMgbnVsbFwiXHJcblx0XHRcdHRpbWVfcG9pbnRzID0gW3tcImhvdXJcIjogOCwgXCJtaW51dGVcIjogMzAgfSwge1wiaG91clwiOiAxNCwgXCJtaW51dGVcIjogMzAgfV1cclxuXHJcblx0XHRsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGhcclxuXHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdHN0YXJ0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbMF0uaG91clxyXG5cdFx0c3RhcnRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzWzBdLm1pbnV0ZVxyXG5cdFx0ZW5kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbbGVuIC0gMV0uaG91clxyXG5cdFx0ZW5kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGVcclxuXHJcblx0XHRjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHJcblx0XHRqID0gMFxyXG5cdFx0bWF4X2luZGV4ID0gbGVuIC0gMVxyXG5cdFx0aWYgZGF0ZSA8IHN0YXJ0X2RhdGVcclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSAwXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOWKoOWNiuS4qnRpbWVfcG9pbnRzXHJcblx0XHRcdFx0aiA9IGxlbi8yXHJcblx0XHRlbHNlIGlmIGRhdGUgPj0gc3RhcnRfZGF0ZSBhbmQgZGF0ZSA8IGVuZF9kYXRlXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdHdoaWxlIGkgPCBtYXhfaW5kZXhcclxuXHRcdFx0XHRmaXJzdF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0XHRcdHNlY29uZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaV0uaG91clxyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpXS5taW51dGVcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpICsgMV0uaG91clxyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZVxyXG5cclxuXHRcdFx0XHRpZiBkYXRlID49IGZpcnN0X2RhdGUgYW5kIGRhdGUgPCBzZWNvbmRfZGF0ZVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHJcblx0XHRcdFx0aSsrXHJcblxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IGkgKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRqID0gaSArIGxlbi8yXHJcblxyXG5cdFx0ZWxzZSBpZiBkYXRlID49IGVuZF9kYXRlXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIGxlbi8yXHJcblxyXG5cdFx0aWYgaiA+IG1heF9pbmRleFxyXG5cdFx0XHQjIOmalOWkqemcgOWIpOaWreiKguWBh+aXpVxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSBkYXRlLCAxXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZVxyXG5cdFx0ZWxzZSBpZiBqIDw9IG1heF9pbmRleFxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqXS5ob3VyXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbal0ubWludXRlXHJcblxyXG5cdFx0cmV0dXJuIGNhY3VsYXRlZF9kYXRlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRfLmV4dGVuZCBTdGVlZG9zLFxyXG5cdFx0Z2V0U3RlZWRvc1Rva2VuOiAoYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XHJcblx0XHRcdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcblx0XHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZClcclxuXHRcdFx0aWYgYXBwXHJcblx0XHRcdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxyXG5cclxuXHRcdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxyXG5cdFx0XHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxyXG5cdFx0XHRcdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRcdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcclxuXHJcblx0XHRcdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0cmV0dXJuIHN0ZWVkb3NfdG9rZW5cclxuXHJcblx0XHRsb2NhbGU6ICh1c2VySWQsIGlzSTE4biktPlxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJJZH0se2ZpZWxkczoge2xvY2FsZTogMX19KVxyXG5cdFx0XHRsb2NhbGUgPSB1c2VyPy5sb2NhbGVcclxuXHRcdFx0aWYgaXNJMThuXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxyXG5cdFx0XHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0XHRcdHJldHVybiBsb2NhbGVcclxuXHJcblx0XHRjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiAodXNlcm5hbWUpIC0+XHJcblx0XHRcdHJldHVybiBub3QgTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyB1c2VybmFtZTogeyAkcmVnZXggOiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIikgfSB9KVxyXG5cclxuXHJcblx0XHR2YWxpZGF0ZVBhc3N3b3JkOiAocHdkKS0+XHJcblx0XHRcdHJlYXNvbiA9IHQgXCJwYXNzd29yZF9pbnZhbGlkXCJcclxuXHRcdFx0dmFsaWQgPSB0cnVlXHJcblx0XHRcdHVubGVzcyBwd2RcclxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblxyXG5cdFx0XHRwYXNzd29yUG9saWN5ID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeVxyXG5cdFx0XHRwYXNzd29yUG9saWN5RXJyb3IgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5RXJyb3JcclxuXHRcdFx0aWYgcGFzc3dvclBvbGljeVxyXG5cdFx0XHRcdGlmICEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpXHJcblx0XHRcdFx0XHRyZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3JcclxuXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR2YWxpZCA9IHRydWVcclxuI1x0XHRcdGVsc2VcclxuI1x0XHRcdFx0dW5sZXNzIC9cXGQrLy50ZXN0KHB3ZClcclxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcbiNcdFx0XHRcdHVubGVzcyAvW2EtekEtWl0rLy50ZXN0KHB3ZClcclxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcbiNcdFx0XHRcdGlmIHB3ZC5sZW5ndGggPCA4XHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHRpZiB2YWxpZFxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZXJyb3I6XHJcblx0XHRcdFx0XHRyZWFzb246IHJlYXNvblxyXG5cclxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXHJcblxyXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIilcclxuXHJcbkNyZWF0b3IuZ2V0REJBcHBzID0gKHNwYWNlX2lkKS0+XHJcblx0ZGJBcHBzID0ge31cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtzcGFjZTogc3BhY2VfaWQsaXNfY3JlYXRvcjp0cnVlLHZpc2libGU6dHJ1ZX0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mb3JFYWNoIChhcHApLT5cclxuXHRcdGRiQXBwc1thcHAuX2lkXSA9IGFwcFxyXG5cclxuXHRyZXR1cm4gZGJBcHBzXHJcblxyXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IChzcGFjZV9pZCktPlxyXG5cdGRiRGFzaGJvYXJkcyA9IHt9XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtzcGFjZTogc3BhY2VfaWR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZm9yRWFjaCAoZGFzaGJvYXJkKS0+XHJcblx0XHRkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmRcclxuXHJcblx0cmV0dXJuIGRiRGFzaGJvYXJkc1xyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblx0U3RlZWRvcy5nZXRBdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcylcclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cdFx0aWYgIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PSAnQmVhcmVyJ1xyXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cclxuXHRcdHJldHVybiBhdXRoVG9rZW5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdE1ldGVvci5hdXRvcnVuICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpXHJcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpXHJcbiNcdFx0ZWxzZVxyXG4jXHRcdFx0Y29uc29sZS5sb2coJ3JlbW92ZSBjdXJyZW50X2FwcF9pZC4uLicpO1xyXG4jXHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gKCktPlxyXG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXHJcblx0XHRcdHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJylcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XHJcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIG1peGluOyAgICAgICAgIFxuXG5TdGVlZG9zID0ge1xuICBzZXR0aW5nczoge30sXG4gIGRiOiBkYixcbiAgc3Viczoge30sXG4gIGlzUGhvbmVFbmFibGVkOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVmLCByZWYxO1xuICAgIHJldHVybiAhISgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyByZWYxLnBob25lIDogdm9pZCAwIDogdm9pZCAwKTtcbiAgfSxcbiAgbnVtYmVyVG9TdHJpbmc6IGZ1bmN0aW9uKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcykge1xuICAgIHZhciByZWYsIHJlZjEsIHJlZztcbiAgICBpZiAodHlwZW9mIG51bWJlciA9PT0gXCJudW1iZXJcIikge1xuICAgICAgbnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIGlmICghbnVtYmVyKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChudW1iZXIgIT09IFwiTmFOXCIpIHtcbiAgICAgIGlmIChzY2FsZSB8fCBzY2FsZSA9PT0gMCkge1xuICAgICAgICBudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKTtcbiAgICAgIH1cbiAgICAgIGlmICghbm90VGhvdXNhbmRzKSB7XG4gICAgICAgIGlmICghKHNjYWxlIHx8IHNjYWxlID09PSAwKSkge1xuICAgICAgICAgIHNjYWxlID0gKHJlZiA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLykpICE9IG51bGwgPyAocmVmMSA9IHJlZlsxXSkgIT0gbnVsbCA/IHJlZjEubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICAgIGlmICghc2NhbGUpIHtcbiAgICAgICAgICAgIHNjYWxlID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFwuKS9nO1xuICAgICAgICBpZiAoc2NhbGUgPT09IDApIHtcbiAgICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2c7XG4gICAgICAgIH1cbiAgICAgICAgbnVtYmVyID0gbnVtYmVyLnJlcGxhY2UocmVnLCAnJDEsJyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVtYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIHZhbGlKcXVlcnlTeW1ib2xzOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmVnO1xuICAgIHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIik7XG4gICAgcmV0dXJuIHJlZy50ZXN0KHN0cik7XG4gIH1cbn07XG5cblxuLypcbiAqIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxuICogQG5hbWVzcGFjZSBTdGVlZG9zXG4gKi9cblxuU3RlZWRvcy5nZXRIZWxwVXJsID0gZnVuY3Rpb24obG9jYWxlKSB7XG4gIHZhciBjb3VudHJ5O1xuICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgcmV0dXJuIFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgYXZhdGFyVXJsLCBiYWNrZ3JvdW5kLCByZWYsIHJlZjEsIHJlZjIsIHVybDtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgIH1cbiAgICB1cmwgPSBhY2NvdW50QmdCb2R5VmFsdWUudXJsO1xuICAgIGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXI7XG4gICAgaWYgKGFjY291bnRCZ0JvZHlWYWx1ZS51cmwpIHtcbiAgICAgIGlmICh1cmwgPT09IGF2YXRhcikge1xuICAgICAgICBhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhcjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKSkgKyBcIilcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYmFja2dyb3VuZCA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYyID0gcmVmMS5hZG1pbikgIT0gbnVsbCA/IHJlZjIuYmFja2dyb3VuZCA6IHZvaWQgMCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIjtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIHpvb21OYW1lLCB6b29tU2l6ZTtcbiAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpIHx8ICFTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0ge307XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgIGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgIH1cbiAgICAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG4gICAgem9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWU7XG4gICAgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemU7XG4gICAgaWYgKCF6b29tTmFtZSkge1xuICAgICAgem9vbU5hbWUgPSBcImxhcmdlXCI7XG4gICAgICB6b29tU2l6ZSA9IDEuMjtcbiAgICB9XG4gICAgaWYgKHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIikpIHtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS1cIiArIHpvb21OYW1lKTtcbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsIGFjY291bnRab29tVmFsdWUubmFtZSk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsIGFjY291bnRab29tVmFsdWUuc2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNob3dIZWxwID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNvdW50cnksIGxvY2FsZTtcbiAgICBsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpO1xuICAgIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICAgIHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbiAgICByZXR1cm4gd2luZG93Lm9wZW4odXJsLCAnX2hlbHAnLCAnRW5hYmxlVmlld1BvcnRTY2FsZT15ZXMnKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBsaW5rZXI7XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIGxpbmtlciA9IFwiP1wiO1xuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgbGlua2VyID0gXCImXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGF1dGhUb2tlbjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgcmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCB1cmw7XG4gICAgdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybCk7XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uID0gdXJsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5VcmxXaXRoSUUgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY21kLCBleGVjLCBvcGVuX3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIG9wZW5fdXJsID0gdXJsO1xuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICByZXR1cm4gZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgY21kLCBlLCBldmFsRnVuU3RyaW5nLCBleGVjLCBvbl9jbGljaywgb3Blbl91cmwsIHBhdGg7XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwKSB7XG4gICAgICBGbG93Um91dGVyLmdvKFwiL1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25fY2xpY2sgPSBhcHAub25fY2xpY2s7XG4gICAgaWYgKGFwcC5pc191c2VfaWUpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgaWYgKG9uX2NsaWNrKSB7XG4gICAgICAgICAgcGF0aCA9IFwiYXBpL2FwcC9zc28vXCIgKyBhcHBfaWQgKyBcIj9hdXRoVG9rZW49XCIgKyAoQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKSkgKyBcIiZ1c2VySWQ9XCIgKyAoTWV0ZW9yLnVzZXJJZCgpKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3Blbl91cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmw7XG4gICAgICAgIH1cbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgZXhlYyhjbWQsIGZ1bmN0aW9uKGVycm9yLCBzdGRvdXQsIHN0ZGVycikge1xuICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdG9hc3RyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybCkpIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oYXBwLnVybCk7XG4gICAgfSBlbHNlIGlmIChhcHAuaXNfdXNlX2lmcmFtZSkge1xuICAgICAgaWYgKGFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKTtcbiAgICAgIH0gZWxzZSBpZiAoU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvbl9jbGljaykge1xuICAgICAgZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7XCIgKyBvbl9jbGljayArIFwifSkoKVwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXZhbChldmFsRnVuU3RyaW5nKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSArIFwiXFxyXFxuXCIgKyBlLnN0YWNrKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgfVxuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSAmJiAhYXBwLmlzX3VzZV9pZSAmJiAhb25fY2xpY2spIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZCk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBlbmRfZGF0ZSwgbWluX21vbnRocywgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgfVxuICAgIG1pbl9tb250aHMgPSAxO1xuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICBtaW5fbW9udGhzID0gMztcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBlbmRfZGF0ZSA9IHNwYWNlICE9IG51bGwgPyBzcGFjZS5lbmRfZGF0ZSA6IHZvaWQgMDtcbiAgICBpZiAoKHNwYWNlICE9IG51bGwgPyBzcGFjZS5pc19wYWlkIDogdm9pZCAwKSAmJiBlbmRfZGF0ZSAhPT0gdm9pZCAwICYmIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyAqIDMwICogMjQgKiAzNjAwICogMTAwMCkpIHtcbiAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IodChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgb2Zmc2V0O1xuICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICBpZiAoIWFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJztcbiAgICB9XG4gICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMTI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2Zmc2V0ID0gNzU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAxOTk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTI2O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDMwMztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gNTM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmICgkKFwiLm1vZGFsXCIpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICQoXCIubW9kYWxcIikuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGZvb3RlckhlaWdodCwgaGVhZGVySGVpZ2h0LCBoZWlnaHQsIHRvdGFsSGVpZ2h0O1xuICAgICAgICBoZWFkZXJIZWlnaHQgPSAwO1xuICAgICAgICBmb290ZXJIZWlnaHQgPSAwO1xuICAgICAgICB0b3RhbEhlaWdodCA9IDA7XG4gICAgICAgICQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGhlYWRlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoXCIubW9kYWwtZm9vdGVyXCIsICQodGhpcykpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0O1xuICAgICAgICBoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXQ7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKSkge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogXCJhdXRvXCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIHJlVmFsdWU7XG4gICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgcmVWYWx1ZSA9IHdpbmRvdy5zY3JlZW4uaGVpZ2h0IC0gMTI2IC0gMTgwIC0gMjU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNTtcbiAgICB9XG4gICAgaWYgKCEoU3RlZWRvcy5pc2lPUygpIHx8IFN0ZWVkb3MuaXNNb2JpbGUoKSkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKTtcbiAgICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDUwO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSAxNDU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvZmZzZXQpIHtcbiAgICAgIHJlVmFsdWUgLT0gb2Zmc2V0O1xuICAgIH1cbiAgICByZXR1cm4gcmVWYWx1ZSArIFwicHhcIjtcbiAgfTtcbiAgU3RlZWRvcy5pc2lPUyA9IGZ1bmN0aW9uKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpIHtcbiAgICB2YXIgREVWSUNFLCBicm93c2VyLCBjb25FeHAsIGRldmljZSwgbnVtRXhwO1xuICAgIERFVklDRSA9IHtcbiAgICAgIGFuZHJvaWQ6ICdhbmRyb2lkJyxcbiAgICAgIGJsYWNrYmVycnk6ICdibGFja2JlcnJ5JyxcbiAgICAgIGRlc2t0b3A6ICdkZXNrdG9wJyxcbiAgICAgIGlwYWQ6ICdpcGFkJyxcbiAgICAgIGlwaG9uZTogJ2lwaG9uZScsXG4gICAgICBpcG9kOiAnaXBvZCcsXG4gICAgICBtb2JpbGU6ICdtb2JpbGUnXG4gICAgfTtcbiAgICBicm93c2VyID0ge307XG4gICAgY29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknO1xuICAgIG51bUV4cCA9ICcoXFxcXFMrW15cXFxcczo7OlxcXFwpXXwpJztcbiAgICB1c2VyQWdlbnQgPSAodXNlckFnZW50IHx8IG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKCk7XG4gICAgbGFuZ3VhZ2UgPSBsYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZTtcbiAgICBkZXZpY2UgPSB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKGFuZHJvaWR8aXBhZHxpcGhvbmV8aXBvZHxibGFja2JlcnJ5KScpKSB8fCB1c2VyQWdlbnQubWF0Y2gobmV3IFJlZ0V4cCgnKG1vYmlsZSknKSkgfHwgWycnLCBERVZJQ0UuZGVza3RvcF07XG4gICAgYnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV07XG4gICAgcmV0dXJuIGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBhZCB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwaG9uZSB8fCBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwb2Q7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlSWQsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5mb3JiaWROb2RlQ29udGV4dG1lbnUgPSBmdW5jdGlvbih0YXJnZXQsIGlmcikge1xuICAgIGlmICghU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGlmIChpZnIpIHtcbiAgICAgIGlmICh0eXBlb2YgaWZyID09PSAnc3RyaW5nJykge1xuICAgICAgICBpZnIgPSB0YXJnZXQuJChpZnIpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGlmci5sb2FkKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaWZyQm9keTtcbiAgICAgICAgaWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKTtcbiAgICAgICAgaWYgKGlmckJvZHkpIHtcbiAgICAgICAgICByZXR1cm4gaWZyQm9keVswXS5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uKGV2KSB7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCwgaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZV91c2VyO1xuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlciAhPSBudWxsID8gc3BhY2VfdXNlci5vcmdhbml6YXRpb25zIDogdm9pZCAwO1xuICAgIGlmICghb3JnYW5pemF0aW9ucykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoaXNJbmNsdWRlUGFyZW50cykge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG9yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIikpO1xuICAgICAgcmV0dXJuIF8udW5pb24ob3JnYW5pemF0aW9ucywgcGFyZW50cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcmdhbml6YXRpb25zO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuaXNNb2JpbGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCB8fCAhdXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgaWYgKCFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID49IDA7XG4gIH07XG4gIFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSBmdW5jdGlvbihzcGFjZUlkLCBhcHBfdmVyc2lvbikge1xuICAgIHZhciBjaGVjaywgbW9kdWxlcywgcmVmO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCkpICE9IG51bGwgPyByZWYubW9kdWxlcyA6IHZvaWQgMDtcbiAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmluY2x1ZGVzKGFwcF92ZXJzaW9uKSkge1xuICAgICAgY2hlY2sgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gY2hlY2s7XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgYWxsb3dBY2Nlc3NPcmdzLCBpc09yZ0FkbWluLCBwYXJlbnRzLCB1c2VPcmdzO1xuICAgIGlzT3JnQWRtaW4gPSBmYWxzZTtcbiAgICB1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IG9yZ0lkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxLFxuICAgICAgICBhZG1pbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHBhcmVudHMgPSBbXTtcbiAgICBhbGxvd0FjY2Vzc09yZ3MgPSB1c2VPcmdzLmZpbHRlcihmdW5jdGlvbihvcmcpIHtcbiAgICAgIHZhciByZWY7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWYgPSBvcmcuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHVzZXJJZCkgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgaWYgKGFsbG93QWNjZXNzT3Jncy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKHBhcmVudHMpO1xuICAgICAgcGFyZW50cyA9IF8udW5pcShwYXJlbnRzKTtcbiAgICAgIGlmIChwYXJlbnRzLmxlbmd0aCAmJiBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IHBhcmVudHNcbiAgICAgICAgfSxcbiAgICAgICAgYWRtaW5zOiB1c2VySWRcbiAgICAgIH0pKSB7XG4gICAgICAgIGlzT3JnQWRtaW4gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBpLCBpc09yZ0FkbWluO1xuICAgIGlmICghb3JnSWRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgb3JnSWRzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzKFtvcmdJZHNbaV1dLCB1c2VySWQpO1xuICAgICAgaWYgKCFpc09yZ0FkbWluKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaSsrO1xuICAgIH1cbiAgICByZXR1cm4gaXNPcmdBZG1pbjtcbiAgfTtcbiAgU3RlZWRvcy5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBlLCByb290X3VybDtcbiAgICBpZiAodXJsKSB7XG4gICAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFQSUxvZ2luVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcGFzc3dvcmQsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VybmFtZSA6IHZvaWQgMDtcbiAgICBwYXNzd29yZCA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5wYXNzd29yZCA6IHZvaWQgMDtcbiAgICBpZiAodXNlcm5hbWUgJiYgcGFzc3dvcmQpIHtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgc3RlZWRvc19pZDogdXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkKHVzZXIsIHBhc3N3b3JkKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdXNlcjtcbiAgICAgIH1cbiAgICB9XG4gICAgdXNlcklkID0gKHJlZjIgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYyW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYzID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmM1tcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSBmdW5jdGlvbih1c2VySWQsIGF1dGhUb2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbiwgdXNlcjtcbiAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgfSk7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICBTdGVlZG9zLmRlY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBkZWNpcGhlciwgZGVjaXBoZXJNc2csIGUsIGksIGtleTMyLCBsZW4sIG07XG4gICAgdHJ5IHtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSk7XG4gICAgICBwYXNzd29yZCA9IGRlY2lwaGVyTXNnLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5lbmNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaSwga2V5MzIsIGxlbiwgbTtcbiAgICBrZXkzMiA9IFwiXCI7XG4gICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgIGMgPSBcIlwiO1xuICAgICAgaSA9IDA7XG4gICAgICBtID0gMzIgLSBsZW47XG4gICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgfVxuICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgcGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgcmV0dXJuIHBhc3N3b3JkO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbiA9IGZ1bmN0aW9uKGFjY2Vzc190b2tlbikge1xuICAgIHZhciBjb2xsZWN0aW9uLCBoYXNoZWRUb2tlbiwgb2JqLCB1c2VyLCB1c2VySWQ7XG4gICAgaWYgKCFhY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdO1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbik7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlY3JldHMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgcmV0dXJuIHVzZXJJZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlbjtcbiAgICAgIG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICdhY2Nlc3NUb2tlbic6IGFjY2Vzc190b2tlblxuICAgICAgfSk7XG4gICAgICBpZiAob2JqKSB7XG4gICAgICAgIGlmICgob2JqICE9IG51bGwgPyBvYmouZXhwaXJlcyA6IHZvaWQgMCkgPCBuZXcgRGF0ZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIGV4cGlyZWQuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsID8gb2JqLnVzZXJJZCA6IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIiArIGFjY2Vzc190b2tlbiArIFwiIGlzIG5vdCBmb3VuZC5cIjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgcmVmLCByZWYxLCByZWYyLCByZWYzLCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjFbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMi5faWQgOiB2b2lkIDA7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gKHJlZjMgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pKSAhPSBudWxsID8gcmVmMy5faWQgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBlLCB1c2VyLCB1c2VySWQ7XG4gICAgdHJ5IHtcbiAgICAgIHVzZXJJZCA9IHJlcS51c2VySWQ7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIGNvZGU6IDQwMVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICBlID0gZXJyb3IxO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBcImVycm9yXCI6IGUubWVzc2FnZSxcbiAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbm1peGluID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBfLmVhY2goXy5mdW5jdGlvbnMob2JqKSwgZnVuY3Rpb24obmFtZSkge1xuICAgIHZhciBmdW5jO1xuICAgIGlmICghX1tuYW1lXSAmJiAoXy5wcm90b3R5cGVbbmFtZV0gPT0gbnVsbCkpIHtcbiAgICAgIGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdO1xuICAgICAgcmV0dXJuIF8ucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gW3RoaXMuX3dyYXBwZWRdO1xuICAgICAgICBwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cyk7XG4gICAgICAgIHJldHVybiByZXN1bHQuY2FsbCh0aGlzLCBmdW5jLmFwcGx5KF8sIGFyZ3MpKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgU3RlZWRvcy5pc0hvbGlkYXkgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgdmFyIGRheTtcbiAgICBpZiAoIWRhdGUpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICB9XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgZGF5ID0gZGF0ZS5nZXREYXkoKTtcbiAgICBpZiAoZGF5ID09PSA2IHx8IGRheSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gZnVuY3Rpb24oZGF0ZSwgZGF5cykge1xuICAgIHZhciBjYWN1bGF0ZURhdGUsIHBhcmFtX2RhdGU7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgY2hlY2soZGF5cywgTnVtYmVyKTtcbiAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgY2FjdWxhdGVEYXRlID0gZnVuY3Rpb24oaSwgZGF5cykge1xuICAgICAgaWYgKGkgPCBkYXlzKSB7XG4gICAgICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShwYXJhbV9kYXRlLmdldFRpbWUoKSArIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgICAgICBpZiAoIVN0ZWVkb3MuaXNIb2xpZGF5KHBhcmFtX2RhdGUpKSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGNhY3VsYXRlRGF0ZShpLCBkYXlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNhY3VsYXRlRGF0ZSgwLCBkYXlzKTtcbiAgICByZXR1cm4gcGFyYW1fZGF0ZTtcbiAgfTtcbiAgU3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IGZ1bmN0aW9uKGRhdGUsIG5leHQpIHtcbiAgICB2YXIgY2FjdWxhdGVkX2RhdGUsIGVuZF9kYXRlLCBmaXJzdF9kYXRlLCBpLCBqLCBsZW4sIG1heF9pbmRleCwgcmVmLCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZCkgIT0gbnVsbCA/IHJlZi50aW1lX3BvaW50cyA6IHZvaWQgMDtcbiAgICBpZiAoIXRpbWVfcG9pbnRzIHx8IF8uaXNFbXB0eSh0aW1lX3BvaW50cykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJ0aW1lX3BvaW50cyBpcyBudWxsXCIpO1xuICAgICAgdGltZV9wb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImhvdXJcIjogOCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJob3VyXCI6IDE0LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH1cbiAgICAgIF07XG4gICAgfVxuICAgIGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aDtcbiAgICBzdGFydF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBzdGFydF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzWzBdLmhvdXIpO1xuICAgIHN0YXJ0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1swXS5taW51dGUpO1xuICAgIGVuZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXIpO1xuICAgIGVuZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlKTtcbiAgICBjYWN1bGF0ZWRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGogPSAwO1xuICAgIG1heF9pbmRleCA9IGxlbiAtIDE7XG4gICAgaWYgKGRhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBzdGFydF9kYXRlICYmIGRhdGUgPCBlbmRfZGF0ZSkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IG1heF9pbmRleCkge1xuICAgICAgICBmaXJzdF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaV0uaG91cik7XG4gICAgICAgIGZpcnN0X2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpXS5taW51dGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpICsgMV0uaG91cik7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaSArIDFdLm1pbnV0ZSk7XG4gICAgICAgIGlmIChkYXRlID49IGZpcnN0X2RhdGUgJiYgZGF0ZSA8IHNlY29uZF9kYXRlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaSsrO1xuICAgICAgfVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IGkgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGkgKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGF0ZSA+PSBlbmRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGogPiBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lKGRhdGUsIDEpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlKTtcbiAgICB9IGVsc2UgaWYgKGogPD0gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbal0ubWludXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNhY3VsYXRlZF9kYXRlO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIF8uZXh0ZW5kKFN0ZWVkb3MsIHtcbiAgICBnZXRTdGVlZG9zVG9rZW46IGZ1bmN0aW9uKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbikge1xuICAgICAgdmFyIGFwcCwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgaGFzaGVkVG9rZW4sIGksIGl2LCBrZXkzMiwgbGVuLCBtLCBub3csIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlcjtcbiAgICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICAgICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICAgIH1cbiAgICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RlZWRvc190b2tlbjtcbiAgICB9LFxuICAgIGxvY2FsZTogZnVuY3Rpb24odXNlcklkLCBpc0kxOG4pIHtcbiAgICAgIHZhciBsb2NhbGUsIHVzZXI7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIGxvY2FsZTogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGxvY2FsZSA9IHVzZXIgIT0gbnVsbCA/IHVzZXIubG9jYWxlIDogdm9pZCAwO1xuICAgICAgaWYgKGlzSTE4bikge1xuICAgICAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbG9jYWxlO1xuICAgIH0sXG4gICAgY2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogZnVuY3Rpb24odXNlcm5hbWUpIHtcbiAgICAgIHJldHVybiAhTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VybmFtZToge1xuICAgICAgICAgICRyZWdleDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgdmFsaWRhdGVQYXNzd29yZDogZnVuY3Rpb24ocHdkKSB7XG4gICAgICB2YXIgcGFzc3dvclBvbGljeSwgcGFzc3dvclBvbGljeUVycm9yLCByZWFzb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdmFsaWQ7XG4gICAgICByZWFzb24gPSB0KFwicGFzc3dvcmRfaW52YWxpZFwiKTtcbiAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgIGlmICghcHdkKSB7XG4gICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBwYXNzd29yUG9saWN5ID0gKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYxID0gcmVmLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMS5wb2xpY3kgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBwYXNzd29yUG9saWN5RXJyb3IgPSAocmVmMiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXSkgIT0gbnVsbCA/IChyZWYzID0gcmVmMi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjMucG9saWN5RXJyb3IgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAocGFzc3dvclBvbGljeSkge1xuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJykpIHtcbiAgICAgICAgICByZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3I7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJEYXNoYm9hcmRzO1xuICBkYkRhc2hib2FyZHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGRhc2hib2FyZCkge1xuICAgIHJldHVybiBkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmQ7XG4gIH0pO1xuICByZXR1cm4gZGJEYXNoYm9hcmRzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfVxuICB9O1xufVxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG5cdFNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKHtmb3JlaWduX2tleTogTWF0Y2guT3B0aW9uYWwoQm9vbGVhbiksIHJlZmVyZW5jZXM6IE1hdGNoLk9wdGlvbmFsKE9iamVjdCl9KTtcclxufSkiLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICBNZXRlb3IubWV0aG9kc1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlVXNlckxhc3RMb2dvbjogKCkgLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7bGFzdF9sb2dvbjogbmV3IERhdGUoKX19KSAgXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgQWNjb3VudHMub25Mb2dpbiAoKS0+XHJcbiAgICAgICAgICAgIE1ldGVvci5jYWxsICd1cGRhdGVVc2VyTGFzdExvZ29uJyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGxhc3RfbG9nb246IG5ldyBEYXRlKClcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBBY2NvdW50cy5vbkxvZ2luKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNZXRlb3IuY2FsbCgndXBkYXRlVXNlckxhc3RMb2dvbicpO1xuICB9KTtcbn1cbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gIE1ldGVvci5tZXRob2RzXHJcbiAgICB1c2Vyc19hZGRfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XHJcbiAgICAgIGlmIGRiLnVzZXJzLmZpbmQoe1wiZW1haWxzLmFkZHJlc3NcIjogZW1haWx9KS5jb3VudCgpPjBcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPiAwIFxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRwdXNoOiBcclxuICAgICAgICAgICAgZW1haWxzOiBcclxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxyXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHNldDogXHJcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsXHJcbiAgICAgICAgICAgIGVtYWlsczogW1xyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXHJcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXHJcbiAgICAgICAgICAgIF1cclxuXHJcbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xyXG5cclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPj0gMlxyXG4gICAgICAgIHAgPSBudWxsXHJcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaCAoZSktPlxyXG4gICAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXHJcbiAgICAgICAgICAgIHAgPSBlXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIFxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRwdWxsOiBcclxuICAgICAgICAgICAgZW1haWxzOiBcclxuICAgICAgICAgICAgICBwXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwifVxyXG5cclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxyXG4gICAgICBcclxuXHJcbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xyXG5cclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlsc1xyXG4gICAgICBlbWFpbHMuZm9yRWFjaCAoZSktPlxyXG4gICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxyXG4gICAgICAgICAgZS5wcmltYXJ5ID0gdHJ1ZVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGUucHJpbWFyeSA9IGZhbHNlXHJcblxyXG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSxcclxuICAgICAgICAkc2V0OlxyXG4gICAgICAgICAgZW1haWxzOiBlbWFpbHNcclxuICAgICAgICAgIGVtYWlsOiBlbWFpbFxyXG5cclxuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7dXNlcjogdGhpcy51c2VySWR9LHskc2V0OiB7ZW1haWw6IGVtYWlsfX0sIHttdWx0aTogdHJ1ZX0pXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gKCktPlxyXG4gICAgICAgIHN3YWxcclxuICAgICAgICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcclxuICAgICAgICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxyXG4gICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxyXG4gICAgICAgICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxyXG4gICAgICAgICwgKGlucHV0VmFsdWUpIC0+XHJcbiAgICAgICAgICAgIE1ldGVvci5jYWxsIFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIChlcnJvciwgcmVzdWx0KS0+XHJcbiAgICAgICAgICAgICAgICBpZiByZXN1bHQ/LmVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgdG9hc3RyLmVycm9yIHJlc3VsdC5tZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbCB0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIlxyXG4jIyNcclxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cclxuXHJcbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxyXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcbiAgICAgICAgICAgICMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXHJcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXHJcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcclxuIyMjIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXNlcnNfYWRkX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmIChkYi51c2Vycy5maW5kKHtcbiAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbFxuICAgICAgfSkuY291bnQoKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdXNoOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbCxcbiAgICAgICAgICAgIGVtYWlsczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYWRkcmVzczogZW1haWwsXG4gICAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgcCwgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCh1c2VyLmVtYWlscyAhPSBudWxsKSAmJiB1c2VyLmVtYWlscy5sZW5ndGggPj0gMikge1xuICAgICAgICBwID0gbnVsbDtcbiAgICAgICAgdXNlci5lbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICAgIHAgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICBlbWFpbHM6IHBcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2F0X2xlYXN0X29uZVwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCEvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfc2V0X3ByaW1hcnlfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgZW1haWxzLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBlbWFpbHMgPSB1c2VyLmVtYWlscztcbiAgICAgIGVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUuYWRkcmVzcyA9PT0gZW1haWwpIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZS5wcmltYXJ5ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsczogZW1haWxzLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxuICAgICAgdGV4dDogdChcInByaW1hcnlfZW1haWxfbmVlZGVkX2Rlc2NyaXB0aW9uXCIpLFxuICAgICAgdHlwZTogJ2lucHV0JyxcbiAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxuICAgICAgY2xvc2VPbkNvbmZpcm06IGZhbHNlLFxuICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcbiAgICB9LCBmdW5jdGlvbihpbnB1dFZhbHVlKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgZnVuY3Rpb24oZXJyb3IsIHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgPyByZXN1bHQuZXJyb3IgOiB2b2lkIDApIHtcbiAgICAgICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHJlc3VsdC5tZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gc3dhbCh0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuXG5cbi8qXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICAqIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgcHJpbWFyeUVtYWlsID0gTWV0ZW9yLnVzZXIoKS5lbWFpbHM/WzBdPy5hZGRyZXNzXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xuICovXG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5tZXRob2RzXHJcbiAgICAgICAgdXBkYXRlVXNlckF2YXRhcjogKGF2YXRhcikgLT5cclxuICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7YXZhdGFyOiBhdmF0YXJ9fSkgICIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVwZGF0ZVVzZXJBdmF0YXI6IGZ1bmN0aW9uKGF2YXRhcikge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGF2YXRhcjogYXZhdGFyXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG4iLCJBY2NvdW50cy5lbWFpbFRlbXBsYXRlcyA9IHtcclxuXHRmcm9tOiAoZnVuY3Rpb24oKXtcclxuXHRcdHZhciBkZWZhdWx0RnJvbSA9IFwiU3RlZWRvcyA8bm9yZXBseUBtZXNzYWdlLnN0ZWVkb3MuY29tPlwiO1xyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncylcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cdFx0XHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsKVxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XHJcblxyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tKVxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XHJcblx0XHRcclxuXHRcdHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbTtcclxuXHR9KSgpLFxyXG5cdHJlc2V0UGFzc3dvcmQ6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgc3BsaXRzID0gdXJsLnNwbGl0KFwiL1wiKTtcclxuXHRcdFx0dmFyIHRva2VuQ29kZSA9IHNwbGl0c1tzcGxpdHMubGVuZ3RoLTFdO1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRfYm9keVwiLHt0b2tlbl9jb2RlOnRva2VuQ29kZX0sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHZlcmlmeUVtYWlsOiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9lbWFpbFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnJvbGxBY2NvdW50OiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2NyZWF0ZV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3N0YXJ0X3NlcnZpY2VcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH1cclxufTsiLCIvLyDkv67mlLlmdWxsbmFtZeWAvOaciemXrumimOeahG9yZ2FuaXphdGlvbnNcclxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL29yZ2FuaXphdGlvbnMvdXBncmFkZS9cIiwgZnVuY3Rpb24gKHJlcSwgcmVzLCBuZXh0KSB7XHJcbiAgXHJcblx0dmFyIG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe2Z1bGxuYW1lOi/mlrDpg6jpl6gvLG5hbWU6eyRuZTpcIuaWsOmDqOmXqFwifX0pO1xyXG5cdGlmIChvcmdzLmNvdW50KCk+MClcclxuXHR7XHJcblx0XHRvcmdzLmZvckVhY2ggKGZ1bmN0aW9uIChvcmcpXHJcblx0XHR7XHJcblx0XHRcdC8vIOiHquW3seWSjOWtkOmDqOmXqOeahGZ1bGxuYW1l5L+u5pS5XHJcblx0XHRcdGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZShvcmcuX2lkLCB7JHNldDoge2Z1bGxuYW1lOiBvcmcuY2FsY3VsYXRlRnVsbG5hbWUoKX19KTtcclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9XHRcclxuXHJcbiAgXHRKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XHJcbiAgICBcdGRhdGE6IHtcclxuXHQgICAgICBcdHJldDogMCxcclxuXHQgICAgICBcdG1zZzogXCJTdWNjZXNzZnVsbHlcIlxyXG4gICAgXHR9XHJcbiAgXHR9KTtcclxufSk7XHJcblxyXG4iLCJpZiBNZXRlb3IuaXNDb3Jkb3ZhXHJcbiAgICAgICAgTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgICAgICAgICAgICAgIFB1c2guQ29uZmlndXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFuZHJvaWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlicmF0ZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpb3M6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2U6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhckJhZGdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcclxuIiwiaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFB1c2guQ29uZmlndXJlKHtcbiAgICAgIGFuZHJvaWQ6IHtcbiAgICAgICAgc2VuZGVySUQ6IHdpbmRvdy5BTkRST0lEX1NFTkRFUl9JRCxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgIH0sXG4gICAgICBpb3M6IHtcbiAgICAgICAgYmFkZ2U6IHRydWUsXG4gICAgICAgIGNsZWFyQmFkZ2U6IHRydWUsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlNlbGVjdG9yID0ge31cclxuXHJcbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXHJcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gKHVzZXJJZCkgLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXHJcblx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKX1cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cclxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0aWYgIXVzZXIuaXNfY2xvdWRhZG1pblxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7YWRtaW5zOnskaW46W3VzZXJJZF19fSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpXHJcblx0XHRcdHNwYWNlcyA9IHNwYWNlcy5tYXAgKG4pIC0+IHJldHVybiBuLl9pZFxyXG5cdFx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cclxuXHRcdHJldHVybiBzZWxlY3RvclxyXG5cclxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcclxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gKHVzZXJJZCkgLT5cclxuXHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xyXG5cdFx0aWYgc3BhY2VJZFxyXG5cdFx0XHRpZiBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogc3BhY2VJZH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cclxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtzcGFjZTogMX19KS5mZXRjaCgpXHJcblx0XHRzcGFjZXMgPSBbXVxyXG5cdFx0Xy5lYWNoIHNwYWNlX3VzZXJzLCAodSktPlxyXG5cdFx0XHRzcGFjZXMucHVzaCh1LnNwYWNlKVxyXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPVxyXG5cdGljb246IFwiZ2xvYmVcIlxyXG5cdGNvbG9yOiBcImJsdWVcIlxyXG5cdHRhYmxlQ29sdW1uczogW1xyXG5cdFx0e25hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJ9LFxyXG5cdFx0e25hbWU6IFwibW9kdWxlc1wifSxcclxuXHRcdHtuYW1lOiBcInVzZXJfY291bnRcIn0sXHJcblx0XHR7bmFtZTogXCJlbmRfZGF0ZVwifSxcclxuXHRcdHtuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJ9LFxyXG5cdFx0e25hbWU6IFwib3JkZXJfcGFpZCgpXCJ9XHJcblx0XVxyXG5cdGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdXHJcblx0cm91dGVyQWRtaW46IFwiL2FkbWluXCJcclxuXHRzZWxlY3RvcjogKHVzZXJJZCkgLT5cclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXHJcblx0XHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLCBwYWlkOiB0cnVlfVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cclxuXHRcdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0XHRyZXR1cm4ge31cclxuXHRzaG93RWRpdENvbHVtbjogZmFsc2VcclxuXHRzaG93RGVsQ29sdW1uOiBmYWxzZVxyXG5cdGRpc2FibGVBZGQ6IHRydWVcclxuXHRwYWdlTGVuZ3RoOiAxMDBcclxuXHRvcmRlcjogW1swLCBcImRlc2NcIl1dXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdEBzcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWduc1xyXG5cdEBiaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkc1xyXG5cdEFkbWluQ29uZmlnPy5jb2xsZWN0aW9uc19hZGRcclxuXHRcdHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWdcclxuXHRcdGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWciLCIgICAgICAgICAgICAgXG5cblNlbGVjdG9yID0ge307XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGFkbWluczoge1xuICAgICAgICAgICRpbjogW3VzZXJJZF1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHNwYWNlcyA9IHNwYWNlcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZUlkLCBzcGFjZV91c2Vycywgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBpZiAoZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHUpIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh1LnNwYWNlKTtcbiAgICB9KTtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICRpbjogc3BhY2VzXG4gICAgfTtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPSB7XG4gIGljb246IFwiZ2xvYmVcIixcbiAgY29sb3I6IFwiYmx1ZVwiLFxuICB0YWJsZUNvbHVtbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJtb2R1bGVzXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcInVzZXJfY291bnRcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwiZW5kX2RhdGVcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfcGFpZCgpXCJcbiAgICB9XG4gIF0sXG4gIGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdLFxuICByb3V0ZXJBZG1pbjogXCIvYWRtaW5cIixcbiAgc2VsZWN0b3I6IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSxcbiAgc2hvd0VkaXRDb2x1bW46IGZhbHNlLFxuICBzaG93RGVsQ29sdW1uOiBmYWxzZSxcbiAgZGlzYWJsZUFkZDogdHJ1ZSxcbiAgcGFnZUxlbmd0aDogMTAwLFxuICBvcmRlcjogW1swLCBcImRlc2NcIl1dXG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdGhpcy5zcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWducztcbiAgdGhpcy5iaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3JkcztcbiAgcmV0dXJuIHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zX2FkZCh7XG4gICAgc3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZyxcbiAgICBiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnXG4gIH0pIDogdm9pZCAwO1xufSk7XG4iLCJpZiAoIVtdLmluY2x1ZGVzKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4Ki8gKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcclxuICAgIHZhciBsZW4gPSBwYXJzZUludChPLmxlbmd0aCkgfHwgMDtcclxuICAgIGlmIChsZW4gPT09IDApIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdmFyIG4gPSBwYXJzZUludChhcmd1bWVudHNbMV0pIHx8IDA7XHJcbiAgICB2YXIgaztcclxuICAgIGlmIChuID49IDApIHtcclxuICAgICAgayA9IG47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBrID0gbGVuICsgbjtcclxuICAgICAgaWYgKGsgPCAwKSB7ayA9IDA7fVxyXG4gICAgfVxyXG4gICAgdmFyIGN1cnJlbnRFbGVtZW50O1xyXG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcclxuICAgICAgY3VycmVudEVsZW1lbnQgPSBPW2tdO1xyXG4gICAgICBpZiAoc2VhcmNoRWxlbWVudCA9PT0gY3VycmVudEVsZW1lbnQgfHxcclxuICAgICAgICAgKHNlYXJjaEVsZW1lbnQgIT09IHNlYXJjaEVsZW1lbnQgJiYgY3VycmVudEVsZW1lbnQgIT09IGN1cnJlbnRFbGVtZW50KSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGsrKztcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9O1xyXG59IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xyXG5cclxuICBpZiAhU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlc1xyXG4gICAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9XHJcbiAgICAgIHd3dzogXHJcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxyXG4gICAgICAgIHVybDogXCIvXCIiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcztcbiAgaWYgKCFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzKSB7XG4gICAgcmV0dXJuIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSB7XG4gICAgICB3d3c6IHtcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiXG4gICAgICB9XG4gICAgfTtcbiAgfVxufSk7XG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cyktPlxyXG5cdGxpc3RWaWV3cyA9IHt9XHJcblxyXG5cdGtleXMgPSBfLmtleXMob2JqZWN0cylcclxuXHJcblx0b2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcclxuXHRcdG9iamVjdF9uYW1lOiB7JGluOiBrZXlzfSxcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZldGNoKClcclxuXHJcblx0X2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAob2JqZWN0X25hbWUpLT5cclxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cclxuXHRcdG9saXN0Vmlld3MgPSBfLmZpbHRlciBvYmplY3RzVmlld3MsIChvdiktPlxyXG5cdFx0XHRyZXR1cm4gb3Yub2JqZWN0X25hbWUgPT0gb2JqZWN0X25hbWVcclxuXHJcblx0XHRfLmVhY2ggb2xpc3RWaWV3cywgKGxpc3R2aWV3KS0+XHJcblx0XHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xyXG5cclxuXHRcdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xyXG5cclxuXHRfLmZvckVhY2ggb2JqZWN0cywgKG8sIGtleSktPlxyXG5cdFx0bGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KVxyXG5cdFx0aWYgIV8uaXNFbXB0eShsaXN0X3ZpZXcpXHJcblx0XHRcdGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3XHJcblx0cmV0dXJuIGxpc3RWaWV3c1xyXG5cclxuXHJcbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XHJcblx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxyXG5cclxuXHRvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xyXG5cdFx0b2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cclxuXHR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSlcclxuXHJcblx0b2JqZWN0X2xpc3R2aWV3LmZvckVhY2ggKGxpc3R2aWV3KS0+XHJcblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcclxuXHJcblx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXHJcblxyXG5cclxuXHJcblxyXG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKSB7XG4gIHZhciBfZ2V0VXNlck9iamVjdExpc3RWaWV3cywga2V5cywgbGlzdFZpZXdzLCBvYmplY3RzVmlld3M7XG4gIGxpc3RWaWV3cyA9IHt9O1xuICBrZXlzID0gXy5rZXlzKG9iamVjdHMpO1xuICBvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAkaW46IGtleXNcbiAgICB9LFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2xpc3RWaWV3cztcbiAgICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICAgIG9saXN0Vmlld3MgPSBfLmZpbHRlcihvYmplY3RzVmlld3MsIGZ1bmN0aW9uKG92KSB7XG4gICAgICByZXR1cm4gb3Yub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIF8uZWFjaChvbGlzdFZpZXdzLCBmdW5jdGlvbihsaXN0dmlldykge1xuICAgICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgICB9KTtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG4gIH07XG4gIF8uZm9yRWFjaChvYmplY3RzLCBmdW5jdGlvbihvLCBrZXkpIHtcbiAgICB2YXIgbGlzdF92aWV3O1xuICAgIGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSk7XG4gICAgaWYgKCFfLmlzRW1wdHkobGlzdF92aWV3KSkge1xuICAgICAgcmV0dXJuIGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0Vmlld3M7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2JqZWN0X2xpc3R2aWV3O1xuICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICBvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pO1xuICBvYmplY3RfbGlzdHZpZXcuZm9yRWFjaChmdW5jdGlvbihsaXN0dmlldykge1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gIH0pO1xuICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG59O1xuIiwiLy8gU2VydmVyU2Vzc2lvbiA9IChmdW5jdGlvbiAoKSB7XHJcbi8vICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gICB2YXIgQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzZXJ2ZXJfc2Vzc2lvbnMnKTtcclxuXHJcbi8vICAgdmFyIGNoZWNrRm9yS2V5ID0gZnVuY3Rpb24gKGtleSkge1xyXG4vLyAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XHJcbi8vICAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBrZXkhJyk7XHJcbi8vICAgICB9XHJcbi8vICAgfTtcclxuLy8gICB2YXIgZ2V0U2Vzc2lvblZhbHVlID0gZnVuY3Rpb24gKG9iaiwga2V5KSB7XHJcbi8vICAgICByZXR1cm4gb2JqICYmIG9iai52YWx1ZXMgJiYgb2JqLnZhbHVlc1trZXldO1xyXG4vLyAgIH07XHJcbi8vICAgdmFyIGNvbmRpdGlvbiA9IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIHJldHVybiB0cnVlO1xyXG4vLyAgIH07XHJcblxyXG4vLyAgIENvbGxlY3Rpb24uZGVueSh7XHJcbi8vICAgICAnaW5zZXJ0JzogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICAgIH0sXHJcbi8vICAgICAndXBkYXRlJyA6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgJ3JlbW92ZSc6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICB9XHJcbi8vICAgfSk7XHJcblxyXG4vLyAgIC8vIHB1YmxpYyBjbGllbnQgYW5kIHNlcnZlciBhcGlcclxuLy8gICB2YXIgYXBpID0ge1xyXG4vLyAgICAgJ2dldCc6IGZ1bmN0aW9uIChrZXkpIHtcclxuLy8gICAgICAgY29uc29sZS5sb2coQ29sbGVjdGlvbi5maW5kT25lKCkpO1xyXG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IENvbGxlY3Rpb24uZmluZE9uZSgpO1xyXG4vLyAgICAgICBpZihNZXRlb3IuaXNTZXJ2ZXIpe1xyXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgICAvLyB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxyXG4vLyAgICAgICAvLyAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xyXG4vLyAgICAgICByZXR1cm4gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgJ2VxdWFscyc6IGZ1bmN0aW9uIChrZXksIGV4cGVjdGVkLCBpZGVudGljYWwpIHtcclxuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcclxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuXHJcbi8vICAgICAgIHZhciB2YWx1ZSA9IGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xyXG5cclxuLy8gICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmIF8uaXNPYmplY3QoZXhwZWN0ZWQpKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIF8odmFsdWUpLmlzRXF1YWwoZXhwZWN0ZWQpO1xyXG4vLyAgICAgICB9XHJcblxyXG4vLyAgICAgICBpZiAoaWRlbnRpY2FsID09IGZhbHNlKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIGV4cGVjdGVkID09IHZhbHVlO1xyXG4vLyAgICAgICB9XHJcblxyXG4vLyAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT09IHZhbHVlO1xyXG4vLyAgICAgfVxyXG4vLyAgIH07XHJcblxyXG4vLyAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCl7XHJcbi8vICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XHJcbi8vICAgICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpe1xyXG4vLyAgICAgICAgIGlmKE1ldGVvci51c2VySWQoKSl7XHJcbi8vICAgICAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKCdzZXJ2ZXItc2Vzc2lvbicpO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgfSlcclxuLy8gICAgIH1cclxuLy8gICB9KVxyXG5cclxuLy8gICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XHJcbi8vICAgICAvLyBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAvLyAgIGlmIChDb2xsZWN0aW9uLmZpbmRPbmUoKSkge1xyXG4vLyAgICAgLy8gICAgIENvbGxlY3Rpb24ucmVtb3ZlKHt9KTsgLy8gY2xlYXIgb3V0IGFsbCBzdGFsZSBzZXNzaW9uc1xyXG4vLyAgICAgLy8gICB9XHJcbi8vICAgICAvLyB9KTtcclxuXHJcbi8vICAgICBNZXRlb3Iub25Db25uZWN0aW9uKGZ1bmN0aW9uIChjb25uZWN0aW9uKSB7XHJcbi8vICAgICAgIHZhciBjbGllbnRJRCA9IGNvbm5lY3Rpb24uaWQ7XHJcblxyXG4vLyAgICAgICBpZiAoIUNvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pKSB7XHJcbi8vICAgICAgICAgQ29sbGVjdGlvbi5pbnNlcnQoeyAnY2xpZW50SUQnOiBjbGllbnRJRCwgJ3ZhbHVlcyc6IHt9LCBcImNyZWF0ZWRcIjogbmV3IERhdGUoKSB9KTtcclxuLy8gICAgICAgfVxyXG5cclxuLy8gICAgICAgY29ubmVjdGlvbi5vbkNsb3NlKGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pO1xyXG4vLyAgICAgICB9KTtcclxuLy8gICAgIH0pO1xyXG5cclxuLy8gICAgIE1ldGVvci5wdWJsaXNoKCdzZXJ2ZXItc2Vzc2lvbicsIGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZCh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcclxuLy8gICAgIH0pO1xyXG5cclxuLy8gICAgIE1ldGVvci5tZXRob2RzKHtcclxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL2dldCc6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuLy8gICAgICAgICBpZiAoIXRoaXMucmFuZG9tU2VlZCkgcmV0dXJuO1xyXG5cclxuLy8gICAgICAgICBjaGVja0ZvcktleShrZXkpO1xyXG5cclxuLy8gICAgICAgICBpZiAoIWNvbmRpdGlvbihrZXksIHZhbHVlKSlcclxuLy8gICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ0ZhaWxlZCBjb25kaXRpb24gdmFsaWRhdGlvbi4nKTtcclxuXHJcbi8vICAgICAgICAgdmFyIHVwZGF0ZU9iaiA9IHt9O1xyXG4vLyAgICAgICAgIHVwZGF0ZU9ialsndmFsdWVzLicgKyBrZXldID0gdmFsdWU7XHJcblxyXG4vLyAgICAgICAgIENvbGxlY3Rpb24udXBkYXRlKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0sIHsgJHNldDogdXBkYXRlT2JqIH0pO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9KTsgIFxyXG5cclxuLy8gICAgIC8vIHNlcnZlci1vbmx5IGFwaVxyXG4vLyAgICAgXy5leHRlbmQoYXBpLCB7XHJcbi8vICAgICAgICdzZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9zZXQnLCBrZXksIHZhbHVlKTsgICAgICAgICAgXHJcbi8vICAgICAgIH0sXHJcbi8vICAgICAgICdzZXRDb25kaXRpb24nOiBmdW5jdGlvbiAobmV3Q29uZGl0aW9uKSB7XHJcbi8vICAgICAgICAgY29uZGl0aW9uID0gbmV3Q29uZGl0aW9uO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICB9KTtcclxuLy8gICB9XHJcblxyXG4vLyAgIHJldHVybiBhcGk7XHJcbi8vIH0pKCk7IiwiSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2dldC9hcHBzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0dXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCByZXEucXVlcnk/LnVzZXJJZFxyXG5cclxuXHRcdHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucXVlcnk/LnNwYWNlSWRcclxuXHJcblx0XHR1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpXHJcblx0XHRcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcclxuXHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxyXG5cdFx0XHRyZXR1cm47XHJcblxyXG5cdFx0dXNlcl9pZCA9IHVzZXIuX2lkXHJcblxyXG5cdFx0IyDmoKHpqoxzcGFjZeaYr+WQpuWtmOWcqFxyXG5cdFx0dXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZClcclxuXHJcblx0XHRsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcl9pZH0pLmxvY2FsZVxyXG5cdFx0aWYgbG9jYWxlID09IFwiZW4tdXNcIlxyXG5cdFx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcclxuXHRcdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblxyXG5cdFx0c3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcl9pZH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKVxyXG5cdFx0YXBwcyA9IGRiLmFwcHMuZmluZCh7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiB7JGluOnNwYWNlc319XX0se3NvcnQ6e3NvcnQ6MX19KS5mZXRjaCgpXHJcblxyXG5cdFx0YXBwcy5mb3JFYWNoIChhcHApIC0+XHJcblx0XHRcdGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSx7fSxsb2NhbGUpXHJcblxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgc3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YTogYXBwc31cclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IGVycm9yczogW3tlcnJvck1lc3NhZ2U6IGUubWVzc2FnZX1dfVxyXG5cdFxyXG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2dldC9hcHBzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcHMsIGUsIGxvY2FsZSwgcmVmLCByZWYxLCBzcGFjZV9pZCwgc3BhY2VzLCB1c2VyLCB1c2VyX2lkO1xuICB0cnkge1xuICAgIHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgKChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcklkIDogdm9pZCAwKTtcbiAgICBzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICB1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgICBsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pLmxvY2FsZTtcbiAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICB9XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgfVxuICAgIHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcl9pZFxuICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKTtcbiAgICBhcHBzID0gZGIuYXBwcy5maW5kKHtcbiAgICAgICRvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgICByZXR1cm4gYXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLCB7fSwgbG9jYWxlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICBkYXRhOiBhcHBzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuICAgIHRyeVxyXG4gICAgICAgICMgVE9ETyDnlKjmiLfnmbvlvZXpqozor4FcclxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblxyXG4gICAgICAgICMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XHJcbiAgICAgICAgaWYgcmVxLmJvZHlcclxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cclxuICAgICAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG4gICAgICAgIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG4gICAgICAgICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuICAgICAgICBpZiAhKHVzZXJJZCBhbmQgYXV0aFRva2VuKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIiwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xyXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XHJcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XHJcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcclxuICAgICAgICBkYXRhID0gW107XHJcbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAncm9sZXMnXVxyXG5cclxuICAgICAgICBpZiAhc3BhY2VcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICMgVE9ETyDnlKjmiLfmmK/lkKblsZ7kuo5zcGFjZVxyXG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsIHNwYWNlOiBzcGFjZX0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgIXNwYWNlX3VzZXJcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhZGJbbW9kZWxdXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhc2VsZWN0b3JcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgIW9wdGlvbnNcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcblxyXG4gICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKTtcclxuXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YTtcclxuICAgIGNhdGNoIGVcclxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiBbXTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG4gICAgICAgIGlmIHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG4gICAgICAgICMgdGhlbiBjaGVjayBjb29raWVcclxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuICAgICAgICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLCBcclxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcclxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnLCAncm9sZXMnXVxyXG5cclxuICAgICAgICBpZiAhc3BhY2VcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICMgVE9ETyDnlKjmiLfmmK/lkKblsZ7kuo5zcGFjZVxyXG4gICAgICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsIHNwYWNlOiBzcGFjZX0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgIXNwYWNlX3VzZXJcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhZGJbbW9kZWxdXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhc2VsZWN0b3JcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgIW9wdGlvbnNcclxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgICBpZiBtb2RlbCA9PSAnbWFpbF9hY2NvdW50cydcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fTtcclxuICAgICAgICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWRcclxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuICAgICAgICBcclxuICAgICAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YTtcclxuICAgIGNhdGNoIGVcclxuICAgICAgICBjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiB7fSIsInZhciBDb29raWVzO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAncm9sZXMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBbXVxuICAgIH0pO1xuICB9XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghKHVzZXJJZCAmJiBhdXRoVG9rZW4pKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKG1vZGVsID09PSAnbWFpbF9hY2NvdW50cycpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZDtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7fVxuICAgIH0pO1xuICB9XG59KTtcbiIsImNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpXHJcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIilcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZClcclxuXHRpZiBhcHBcclxuXHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcclxuXHRcdHJlZGlyZWN0VXJsID0gYXBwLnVybFxyXG5cdGVsc2VcclxuXHRcdHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXHJcblx0XHRyZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmxcclxuXHJcblx0aWYgIXJlZGlyZWN0VXJsXHJcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdFx0cmVzLmVuZCgpXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuXHQjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG5cdCMgaWYgcmVxLmJvZHlcclxuXHQjIFx0dXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cclxuXHQjIFx0YXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0IyAjIHRoZW4gY2hlY2sgY29va2llXHJcblx0IyBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHQjIFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHQjIFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0aWYgIXVzZXJJZCBhbmQgIWF1dGhUb2tlblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdGlmIHVzZXJcclxuXHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxyXG5cdFx0XHRpZiBhcHAuc2VjcmV0XHJcblx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXHJcblx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcclxuXHRcdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXHJcblxyXG5cdFx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdCMgZGVzLWNiY1xyXG5cdFx0XHRkZXNfaXYgPSBcIi04NzYyLWZjXCJcclxuXHRcdFx0a2V5OCA9IFwiXCJcclxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0aWYgbGVuIDwgOFxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gOCAtIGxlblxyXG5cdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gOFxyXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsOClcclxuXHRcdFx0ZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpXHJcblx0XHRcdGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSlcclxuXHRcdFx0ZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHRqb2luZXIgPSBcIj9cIlxyXG5cclxuXHRcdFx0aWYgcmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMVxyXG5cdFx0XHRcdGpvaW5lciA9IFwiJlwiXHJcblxyXG5cdFx0XHRyZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW5cclxuXHJcblx0XHRcdGlmIHVzZXIudXNlcm5hbWVcclxuXHRcdFx0XHRyZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPSN7ZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpfVwiXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCByZXR1cm51cmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdHJlcy5lbmQoKVxyXG5cdHJldHVyblxyXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBleHByZXNzO1xuXG5jcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5leHByZXNzID0gcmVxdWlyZShcImV4cHJlc3NcIik7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwLCBhdXRoVG9rZW4sIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGNvb2tpZXMsIGRlc19jaXBoZXIsIGRlc19jaXBoZXJlZE1zZywgZGVzX2l2LCBkZXNfc3RlZWRvc190b2tlbiwgaGFzaGVkVG9rZW4sIGksIGl2LCBqb2luZXIsIGtleTMyLCBrZXk4LCBsZW4sIG0sIG5vdywgcmVkaXJlY3RVcmwsIHJldHVybnVybCwgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyLCB1c2VySWQ7XG4gIGFwcCA9IGRiLmFwcHMuZmluZE9uZShyZXEucGFyYW1zLmFwcF9pZCk7XG4gIGlmIChhcHApIHtcbiAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgIHJlZGlyZWN0VXJsID0gYXBwLnVybDtcbiAgfSBlbHNlIHtcbiAgICBzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICByZWRpcmVjdFVybCA9IHJlcS5wYXJhbXMucmVkaXJlY3RVcmw7XG4gIH1cbiAgaWYgKCFyZWRpcmVjdFVybCkge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKCk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIGlmICghdXNlcklkICYmICFhdXRoVG9rZW4pIHtcbiAgICB1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl07XG4gICAgYXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdO1xuICB9XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgaXYgPSBhcHAuc2VjcmV0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgIH1cbiAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgIH1cbiAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICBzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgZGVzX2l2ID0gXCItODc2Mi1mY1wiO1xuICAgICAga2V5OCA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCA4KSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDggLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDgpIHtcbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgOCk7XG4gICAgICB9XG4gICAgICBkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSk7XG4gICAgICBkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pO1xuICAgICAgZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgICAgam9pbmVyID0gXCI/XCI7XG4gICAgICBpZiAocmVkaXJlY3RVcmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgICBqb2luZXIgPSBcIiZcIjtcbiAgICAgIH1cbiAgICAgIHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlbjtcbiAgICAgIGlmICh1c2VyLnVzZXJuYW1lKSB7XG4gICAgICAgIHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9XCIgKyAoZW5jb2RlVVJJKHVzZXIudXNlcm5hbWUpKTtcbiAgICAgIH1cbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCByZXR1cm51cmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuICByZXMud3JpdGVIZWFkKDQwMSk7XG4gIHJlcy5lbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRcclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRcdCMgdGhpcy5wYXJhbXMgPVxyXG5cdFx0IyBcdHVzZXJJZDogZGVjb2RlVVJJKHJlcS51cmwpLnJlcGxhY2UoL15cXC8vLCAnJykucmVwbGFjZSgvXFw/LiokLywgJycpXHJcblx0XHR3aWR0aCA9IDUwIDtcclxuXHRcdGhlaWdodCA9IDUwIDtcclxuXHRcdGZvbnRTaXplID0gMjggO1xyXG5cdFx0aWYgcmVxLnF1ZXJ5LndcclxuXHRcdCAgICB3aWR0aCA9IHJlcS5xdWVyeS53IDtcclxuXHRcdGlmIHJlcS5xdWVyeS5oXHJcblx0XHQgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5LmggO1xyXG5cdFx0aWYgcmVxLnF1ZXJ5LmZzXHJcbiAgICAgICAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzIDtcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgdXNlci5hdmF0YXJcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgdXNlci5wcm9maWxlPy5hdmF0YXJcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyVXJsXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgbm90IGZpbGU/XHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXHJcblx0XHRcdHN2ZyA9IFwiXCJcIlxyXG5cdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXHJcblx0XHRcdFx0XHQgdmlld0JveD1cIjAgMCA3MiA3MlwiIHN0eWxlPVwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPlxyXG5cdFx0XHRcdDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5cclxuXHRcdFx0XHRcdC5zdDB7ZmlsbDojRkZGRkZGO31cclxuXHRcdFx0XHRcdC5zdDF7ZmlsbDojRDBEMEQwO31cclxuXHRcdFx0XHQ8L3N0eWxlPlxyXG5cdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDBcIiBkPVwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcIi8+XHJcblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XHJcblx0XHRcdFx0XHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcIi8+XHJcblx0XHRcdFx0PC9nPlxyXG5cdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0PGc+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXHJcblx0XHRcdFx0XHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elwiLz5cclxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxyXG5cdFx0XHRcdFx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XCIvPlxyXG5cdFx0XHRcdFx0PC9nPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblx0XHRcdHJlcy53cml0ZSBzdmdcclxuI1x0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBTdGVlZG9zLmFic29sdXRlVXJsKFwiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9jbGllbnQvaW1hZ2VzL2RlZmF1bHQtYXZhdGFyLnBuZ1wiKVxyXG4jXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdHVzZXJuYW1lID0gdXNlci5uYW1lO1xyXG5cdFx0aWYgIXVzZXJuYW1lXHJcblx0XHRcdHVzZXJuYW1lID0gXCJcIlxyXG5cclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXHJcblxyXG5cdFx0XHRjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXHJcblxyXG5cdFx0XHR1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpXHJcblx0XHRcdGNvbG9yX2luZGV4ID0gMFxyXG5cdFx0XHRfLmVhY2ggdXNlcm5hbWVfYXJyYXksIChpdGVtKSAtPlxyXG5cdFx0XHRcdGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcclxuXHJcblx0XHRcdHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoXHJcblx0XHRcdGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxyXG5cdFx0XHQjY29sb3IgPSBcIiNENkRBRENcIlxyXG5cclxuXHRcdFx0aW5pdGlhbHMgPSAnJ1xyXG5cdFx0XHRpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxyXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxyXG5cclxuXHRcdFx0aW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXHJcblxyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0PD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XHJcblx0XHRcdDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiI3t3aWR0aH1cIiBoZWlnaHQ9XCIje2hlaWdodH1cIiBzdHlsZT1cIndpZHRoOiAje3dpZHRofXB4OyBoZWlnaHQ6ICN7aGVpZ2h0fXB4OyBiYWNrZ3JvdW5kLWNvbG9yOiAje2NvbG9yfTtcIj5cclxuXHRcdFx0XHQ8dGV4dCB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIHk9XCI1MCVcIiB4PVwiNTAlXCIgZHk9XCIwLjM2ZW1cIiBwb2ludGVyLWV2ZW50cz1cImF1dG9cIiBmaWxsPVwiI0ZGRkZGRlwiIGZvbnQtZmFtaWx5PVwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVwiIHN0eWxlPVwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAje2ZvbnRTaXplfXB4O1wiPlxyXG5cdFx0XHRcdFx0I3tpbml0aWFsc31cclxuXHRcdFx0XHQ8L3RleHQ+XHJcblx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcIlwiXCJcclxuXHJcblx0XHRcdHJlcy53cml0ZSBzdmdcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcclxuXHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xyXG5cdFx0XHRpZiByZXFNb2RpZmllZEhlYWRlciA9PSB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXHJcblx0XHRcdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXHJcblx0XHRcdFx0cmVzLndyaXRlSGVhZCAzMDRcclxuXHRcdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xyXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aFxyXG5cclxuXHRcdGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xyXG5cdFx0cmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGNvbG9yLCBjb2xvcl9pbmRleCwgY29sb3JzLCBmb250U2l6ZSwgaGVpZ2h0LCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVmMiwgcmVxTW9kaWZpZWRIZWFkZXIsIHN2ZywgdXNlciwgdXNlcm5hbWUsIHVzZXJuYW1lX2FycmF5LCB3aWR0aDtcbiAgICB3aWR0aCA9IDUwO1xuICAgIGhlaWdodCA9IDUwO1xuICAgIGZvbnRTaXplID0gMjg7XG4gICAgaWYgKHJlcS5xdWVyeS53KSB7XG4gICAgICB3aWR0aCA9IHJlcS5xdWVyeS53O1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmgpIHtcbiAgICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oO1xuICAgIH1cbiAgICBpZiAocmVxLnF1ZXJ5LmZzKSB7XG4gICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcztcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXIpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHVzZXIucHJvZmlsZSkgIT0gbnVsbCA/IHJlZi5hdmF0YXIgOiB2b2lkIDApIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyVXJsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmwpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgc3ZnID0gXCI8c3ZnIHZlcnNpb249XFxcIjEuMVxcXCIgaWQ9XFxcIkxheWVyXzFcXFwiIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgeG1sbnM6eGxpbms9XFxcImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcXFwiIHg9XFxcIjBweFxcXCIgeT1cXFwiMHB4XFxcIlxcblx0IHZpZXdCb3g9XFxcIjAgMCA3MiA3MlxcXCIgc3R5bGU9XFxcImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XFxcIiB4bWw6c3BhY2U9XFxcInByZXNlcnZlXFxcIj5cXG48c3R5bGUgdHlwZT1cXFwidGV4dC9jc3NcXFwiPlxcblx0LnN0MHtmaWxsOiNGRkZGRkY7fVxcblx0LnN0MXtmaWxsOiNEMEQwRDA7fVxcbjwvc3R5bGU+XFxuPGc+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QwXFxcIiBkPVxcXCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelxcXCIvPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxcblx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XFxcIi8+XFxuPC9nPlxcbjxnPlxcblx0PGc+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNS44LDQyLjZjOC4zLDAsMTUuMS02LjgsMTUuMS0xNS4xYzAtOC4zLTYuOC0xNS4xLTE1LjEtMTUuMWMtOC4zLDAtMTUuMSw2LjgtMTUuMSwxNS4xXFxuXHRcdFx0QzIwLjcsMzUuOCwyNy41LDQyLjYsMzUuOCw0Mi42elxcXCIvPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XFxuXHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcXFwiLz5cXG5cdDwvZz5cXG48L2c+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSB1c2VyLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSk7XG4gICAgICBjb2xvcl9pbmRleCA9IDA7XG4gICAgICBfLmVhY2godXNlcm5hbWVfYXJyYXksIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yX2luZGV4ICs9IGl0ZW0uY2hhckNvZGVBdCgwKTtcbiAgICAgIH0pO1xuICAgICAgcG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGg7XG4gICAgICBjb2xvciA9IGNvbG9yc1twb3NpdGlvbl07XG4gICAgICBpbml0aWFscyA9ICcnO1xuICAgICAgaWYgKHVzZXJuYW1lLmNoYXJDb2RlQXQoMCkgPiAyNTUpIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKTtcbiAgICAgIH1cbiAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKTtcbiAgICAgIHN2ZyA9IFwiPD94bWwgdmVyc2lvbj1cXFwiMS4wXFxcIiBlbmNvZGluZz1cXFwiVVRGLThcXFwiIHN0YW5kYWxvbmU9XFxcIm5vXFxcIj8+XFxuPHN2ZyB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJub25lXFxcIiB3aWR0aD1cXFwiXCIgKyB3aWR0aCArIFwiXFxcIiBoZWlnaHQ9XFxcIlwiICsgaGVpZ2h0ICsgXCJcXFwiIHN0eWxlPVxcXCJ3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgKyBoZWlnaHQgKyBcInB4OyBiYWNrZ3JvdW5kLWNvbG9yOiBcIiArIGNvbG9yICsgXCI7XFxcIj5cXG5cdDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI0ZGRkZGRlxcXCIgZm9udC1mYW1pbHk9XFxcIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IFwiICsgZm9udFNpemUgKyBcInB4O1xcXCI+XFxuXHRcdFwiICsgaW5pdGlhbHMgKyBcIlxcblx0PC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZjEgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMS50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYyID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjIudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblxyXG5cdFx0YWNjZXNzX3Rva2VuID0gcmVxLnF1ZXJ5Py5hY2Nlc3NfdG9rZW5cclxuXHJcblx0XHRpZiBTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMjAwXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGVsc2VcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHJcblxyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgYWNjZXNzX3Rva2VuLCByZWY7XG4gICAgYWNjZXNzX3Rva2VuID0gKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi5hY2Nlc3NfdG9rZW4gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbikpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoMjAwKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgTWV0ZW9yLnB1Ymxpc2ggJ2FwcHMnLCAoc3BhY2VJZCktPlxyXG4gICAgICAgIHVubGVzcyB0aGlzLnVzZXJJZFxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkeSgpXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIHNlbGVjdG9yID0ge3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fVxyXG4gICAgICAgIGlmIHNwYWNlSWRcclxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiBzcGFjZUlkfV19XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge3NvcnQ6IHtzb3J0OiAxfX0pO1xyXG4iLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdhcHBzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlxyXG5cclxuXHQjIHB1Ymxpc2ggdXNlcnMgc3BhY2VzXHJcblx0IyB3ZSBvbmx5IHB1Ymxpc2ggc3BhY2VzIGN1cnJlbnQgdXNlciBqb2luZWQuXHJcblx0TWV0ZW9yLnB1Ymxpc2ggJ215X3NwYWNlcycsIC0+XHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHJcblx0XHRzZWxmID0gdGhpcztcclxuXHRcdHVzZXJTcGFjZXMgPSBbXVxyXG5cdFx0c3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9LCB7ZmllbGRzOiB7c3BhY2U6MX19KVxyXG5cdFx0c3VzLmZvckVhY2ggKHN1KSAtPlxyXG5cdFx0XHR1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpXHJcblxyXG5cdFx0aGFuZGxlMiA9IG51bGxcclxuXHJcblx0XHQjIG9ubHkgcmV0dXJuIHVzZXIgam9pbmVkIHNwYWNlcywgYW5kIG9ic2VydmVzIHdoZW4gdXNlciBqb2luIG9yIGxlYXZlIGEgc3BhY2VcclxuXHRcdGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkub2JzZXJ2ZVxyXG5cdFx0XHRhZGRlZDogKGRvYykgLT5cclxuXHRcdFx0XHRpZiBkb2Muc3BhY2VcclxuXHRcdFx0XHRcdGlmIHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMFxyXG5cdFx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKVxyXG5cdFx0XHRcdFx0XHRvYnNlcnZlU3BhY2VzKClcclxuXHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRpZiBvbGREb2Muc3BhY2VcclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2Muc3BhY2VcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKVxyXG5cclxuXHRcdG9ic2VydmVTcGFjZXMgPSAtPlxyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcblx0XHRcdGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiB7JGluOiB1c2VyU3BhY2VzfX0pLm9ic2VydmVcclxuXHRcdFx0XHRhZGRlZDogKGRvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuYWRkZWQgXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jO1xyXG5cdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5faWQpXHJcblx0XHRcdFx0Y2hhbmdlZDogKG5ld0RvYywgb2xkRG9jKSAtPlxyXG5cdFx0XHRcdFx0c2VsZi5jaGFuZ2VkIFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYztcclxuXHRcdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxyXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5faWRcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZClcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzKCk7XHJcblxyXG5cdFx0c2VsZi5yZWFkeSgpO1xyXG5cclxuXHRcdHNlbGYub25TdG9wIC0+XHJcblx0XHRcdGhhbmRsZS5zdG9wKCk7XHJcblx0XHRcdGlmIGhhbmRsZTJcclxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcclxuIiwiTWV0ZW9yLnB1Ymxpc2goJ215X3NwYWNlcycsIGZ1bmN0aW9uKCkge1xuICB2YXIgaGFuZGxlLCBoYW5kbGUyLCBvYnNlcnZlU3BhY2VzLCBzZWxmLCBzdXMsIHVzZXJTcGFjZXM7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHNlbGYgPSB0aGlzO1xuICB1c2VyU3BhY2VzID0gW107XG4gIHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgc3BhY2U6IDFcbiAgICB9XG4gIH0pO1xuICBzdXMuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goc3Uuc3BhY2UpO1xuICB9KTtcbiAgaGFuZGxlMiA9IG51bGw7XG4gIGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHVzZXI6IHRoaXMudXNlcklkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkub2JzZXJ2ZSh7XG4gICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgaWYgKGRvYy5zcGFjZSkge1xuICAgICAgICBpZiAodXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwKSB7XG4gICAgICAgICAgdXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSk7XG4gICAgICAgICAgcmV0dXJuIG9ic2VydmVTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICBpZiAob2xkRG9jLnNwYWNlKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2Muc3BhY2UpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVTcGFjZXMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICAgIHJldHVybiBoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogdXNlclNwYWNlc1xuICAgICAgfVxuICAgIH0pLm9ic2VydmUoe1xuICAgICAgYWRkZWQ6IGZ1bmN0aW9uKGRvYykge1xuICAgICAgICBzZWxmLmFkZGVkKFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYyk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzLnB1c2goZG9jLl9pZCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogZnVuY3Rpb24obmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuY2hhbmdlZChcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2MpO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLl9pZCk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBvYnNlcnZlU3BhY2VzKCk7XG4gIHNlbGYucmVhZHkoKTtcbiAgcmV0dXJuIHNlbGYub25TdG9wKGZ1bmN0aW9uKCkge1xuICAgIGhhbmRsZS5zdG9wKCk7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIHJldHVybiBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCIjIHB1Ymxpc2ggc29tZSBvbmUgc3BhY2UncyBhdmF0YXJcclxuTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX2F2YXRhcicsIChzcGFjZUlkKS0+XHJcblx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7YXZhdGFyOiAxLG5hbWU6IDEsZW5hYmxlX3JlZ2lzdGVyOjF9fSk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdzcGFjZV9hdmF0YXInLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gIGlmICghc3BhY2VJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLnNwYWNlcy5maW5kKHtcbiAgICBfaWQ6IHNwYWNlSWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgYXZhdGFyOiAxLFxuICAgICAgbmFtZTogMSxcbiAgICAgIGVuYWJsZV9yZWdpc3RlcjogMVxuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdtb2R1bGVzJywgKCktPlxyXG5cdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7IiwiTWV0ZW9yLnB1Ymxpc2goJ21vZHVsZXMnLCBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgKF9pZCktPlxyXG5cdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHR1bmxlc3MgX2lkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe19pZDogX2lkfSk7IiwiTWV0ZW9yLnB1Ymxpc2goJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIGZ1bmN0aW9uKF9pZCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIV9pZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7XG4gICAgX2lkOiBfaWRcbiAgfSk7XG59KTtcbiIsInN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIik7XHJcbnN0ZWVkb3NJMThuID0gcmVxdWlyZShcIkBzdGVlZG9zL2kxOG5cIik7XHJcbnN0ZWVkb3NDb3JlID0gcmVxdWlyZShcIkBzdGVlZG9zL2NvcmVcIik7XHJcbnN0ZWVkb3NMaWNlbnNlID0gcmVxdWlyZShcIkBzdGVlZG9zL2xpY2Vuc2VcIik7XHJcbmNsb25lID0gcmVxdWlyZShcImNsb25lXCIpO1xyXG5cclxuX2dldExvY2FsZSA9ICh1c2VyKS0+XHJcblx0aWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICd6aC1jbidcclxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdGVsc2UgaWYgdXNlcj8ubG9jYWxlPy50b0xvY2FsZUxvd2VyQ2FzZSgpID09ICdlbi11cydcclxuXHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdGVsc2VcclxuXHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdHJldHVybiBsb2NhbGVcclxuXHJcbmdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCA9ICh1c2VySWQsIHNwYWNlSWQpLT5cclxuXHRzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge3Byb2ZpbGU6IDF9fSlcclxuXHRpZiBzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGVcclxuXHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKT8uZmluZCh7c3BhY2U6IHNwYWNlSWQsIHByb2ZpbGVzOiBzcGFjZVVzZXIucHJvZmlsZX0pLmZldGNoKCk7XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwocmVxLCByZXMsIG5leHQpLT5cclxuXHR1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ11cclxuXHRzcGFjZUlkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCByZXEucGFyYW1zPy5zcGFjZUlkXHJcblx0aWYgIXVzZXJJZFxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogNDAzLFxyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0YXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpXHJcblx0dXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKChhdXRoVG9rZW4sIHNwYWNlSWQsIGNiKS0+XHJcblx0XHRcdHN0ZWVkb3NBdXRoLmdldFNlc3Npb24oYXV0aFRva2VuLCBzcGFjZUlkKS50aGVuIChyZXNvbHZlLCByZWplY3QpLT5cclxuXHRcdFx0XHRjYihyZWplY3QsIHJlc29sdmUpXHJcblx0XHQpKGF1dGhUb2tlbiwgc3BhY2VJZClcclxuXHRcclxuXHR1bmxlc3MgdXNlclNlc3Npb25cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDUwMCxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdHNwYWNlID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlc1wiXS5maW5kT25lKHtfaWQ6IHNwYWNlSWR9LCB7ZmllbGRzOiB7bmFtZTogMX19KVxyXG5cclxuXHRyZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCk7XHJcbiNcdGNvbnNvbGUudGltZSgndHJhbnNsYXRpb25PYmplY3RzJyk7XHJcblx0bG5nID0gX2dldExvY2FsZShkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2xvY2FsZTogMX19KSlcclxuXHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdHMobG5nLCByZXN1bHQub2JqZWN0cyk7XHJcbiNcdGNvbnNvbGUudGltZUVuZCgndHJhbnNsYXRpb25PYmplY3RzJyk7XHJcblx0cmVzdWx0LnVzZXIgPSB1c2VyU2Vzc2lvblxyXG5cdHJlc3VsdC5zcGFjZSA9IHNwYWNlXHJcblx0cmVzdWx0LmFwcHMgPSBjbG9uZShDcmVhdG9yLkFwcHMpXHJcblx0cmVzdWx0LmRhc2hib2FyZHMgPSBjbG9uZShDcmVhdG9yLkRhc2hib2FyZHMpXHJcblx0cmVzdWx0Lm9iamVjdF9saXN0dmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgcmVzdWx0Lm9iamVjdHMpXHJcblx0cmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCAnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWRcclxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxyXG5cdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXHJcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcclxuXHRcdFx0Xy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCAodiwgayktPlxyXG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZClcclxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxyXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcclxuXHRcdFx0XHRfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lXHJcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxyXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXHJcblx0XHRcdClcclxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxyXG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgY2xvbmUoZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpXHJcblx0XHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kIHJlc3VsdC5kYXNoYm9hcmRzLCBkYXRhc291cmNlLmdldERhc2hib2FyZHNDb25maWcoKVxyXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQoIHJlc3VsdC5hcHBzIHx8IHt9LCBDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSlcclxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kKCByZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpXHJcblxyXG5cdF9BcHBzID0ge31cclxuXHRfLmVhY2ggcmVzdWx0LmFwcHMsIChhcHAsIGtleSkgLT5cclxuXHRcdGlmICFhcHAuX2lkXHJcblx0XHRcdGFwcC5faWQgPSBrZXlcclxuXHRcdGlmIGFwcC5jb2RlXHJcblx0XHRcdGFwcC5fZGJpZCA9IGFwcC5faWRcclxuXHRcdFx0YXBwLl9pZCA9IGFwcC5jb2RlXHJcblx0XHRfQXBwc1thcHAuX2lkXSA9IGFwcFxyXG5cdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcclxuXHRyZXN1bHQuYXBwcyA9IF9BcHBzO1xyXG5cdGFzc2lnbmVkX21lbnVzID0gY2xvbmUocmVzdWx0LmFzc2lnbmVkX21lbnVzKTtcclxuXHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xyXG5cdHJlc3VsdC5hc3NpZ25lZF9tZW51cyA9IGFzc2lnbmVkX21lbnVzO1xyXG5cclxuXHRfRGFzaGJvYXJkcyA9IHt9XHJcblx0Xy5lYWNoIHJlc3VsdC5kYXNoYm9hcmRzLCAoZGFzaGJvYXJkLCBrZXkpIC0+XHJcblx0XHRpZiAhZGFzaGJvYXJkLl9pZFxyXG5cdFx0XHRkYXNoYm9hcmQuX2lkID0ga2V5XHJcblx0XHRfRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxyXG5cdHJlc3VsdC5kYXNoYm9hcmRzID0gX0Rhc2hib2FyZHNcclxuXHJcblx0cmVzdWx0LnBsdWdpbnMgPSBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zPygpXHJcblxyXG5cdG9iamVjdHNMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQodXNlcklkLCBzcGFjZUlkKTtcclxuXHJcblx0aWYgb2JqZWN0c0xheW91dFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNMYXlvdXQsIChvYmplY3RMYXlvdXQpLT5cclxuXHRcdFx0X29iamVjdCA9IGNsb25lKHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0pO1xyXG5cdFx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdFx0X2ZpZWxkcyA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCBvYmplY3RMYXlvdXQuZmllbGRzLCAoX2l0ZW0pLT5cclxuXHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdXHJcblx0XHRcdFx0XHRpZiBfLmhhcyhfaXRlbSwgJ2dyb3VwJylcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/Lmdyb3VwID0gX2l0ZW0uZ3JvdXBcclxuXHRcdFx0XHRcdGlmIF9pdGVtLnJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZWFkb25seSA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5kaXNhYmxlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IGZhbHNlXHJcblx0XHRcdFx0X29iamVjdC5maWVsZHMgPSBfZmllbGRzXHJcblxyXG4jXHRcdFx0XHRfYWN0aW9ucyA9IHt9O1xyXG4jXHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmFjdGlvbnMsIChhY3Rpb25OYW1lKS0+XHJcbiNcdFx0XHRcdFx0X2FjdGlvbnNbYWN0aW9uTmFtZV0gPSBfb2JqZWN0LmFjdGlvbnNbYWN0aW9uTmFtZV1cclxuI1x0XHRcdFx0X29iamVjdC5hY3Rpb25zID0gX2FjdGlvbnNcclxuXHRcdFx0XHRfb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxyXG5cdFx0XHRyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdID0gX29iamVjdFxyXG5cclxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0Y29kZTogMjAwLFxyXG5cdFx0ZGF0YTogcmVzdWx0XHJcbiIsInZhciBfZ2V0TG9jYWxlLCBjbG9uZSwgZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0LCBzdGVlZG9zQXV0aCwgc3RlZWRvc0NvcmUsIHN0ZWVkb3NJMThuLCBzdGVlZG9zTGljZW5zZTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKFwiQHN0ZWVkb3MvY29yZVwiKTtcblxuc3RlZWRvc0xpY2Vuc2UgPSByZXF1aXJlKFwiQHN0ZWVkb3MvbGljZW5zZVwiKTtcblxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5cbl9nZXRMb2NhbGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBsb2NhbGUsIHJlZiwgcmVmMTtcbiAgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICd6aC1jbicpIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH0gZWxzZSBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYxID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYxLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnZW4tdXMnKSB7XG4gICAgbG9jYWxlID0gXCJlblwiO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICByZXR1cm4gbG9jYWxlO1xufTtcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciByZWYsIHNwYWNlVXNlcjtcbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgfSkuZmV0Y2goKSA6IHZvaWQgMDtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIF9BcHBzLCBfRGFzaGJvYXJkcywgYXNzaWduZWRfbWVudXMsIGF1dGhUb2tlbiwgbG5nLCBvYmplY3RzTGF5b3V0LCBwZXJtaXNzaW9ucywgcmVmLCByZXN1bHQsIHNwYWNlLCBzcGFjZUlkLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ107XG4gIHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDMsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkoYXV0aFRva2VuLCBzcGFjZUlkKTtcbiAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDUwMCxcbiAgICAgIGRhdGE6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgcmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xuICBsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBsb2NhbGU6IDFcbiAgICB9XG4gIH0pKTtcbiAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3RzKGxuZywgcmVzdWx0Lm9iamVjdHMpO1xuICByZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uO1xuICByZXN1bHQuc3BhY2UgPSBzcGFjZTtcbiAgcmVzdWx0LmFwcHMgPSBjbG9uZShDcmVhdG9yLkFwcHMpO1xuICByZXN1bHQuZGFzaGJvYXJkcyA9IGNsb25lKENyZWF0b3IuRGFzaGJvYXJkcyk7XG4gIHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCgnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWQpO1xuICBwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24odiwgdXNlclNlc3Npb24sIGNiKSB7XG4gICAgcmV0dXJuIHYuZ2V0VXNlck9iamVjdFBlcm1pc3Npb24odXNlclNlc3Npb24pLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHZhciBkYXRhc291cmNlT2JqZWN0cztcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBkYXRhc291cmNlT2JqZWN0cyA9IGRhdGFzb3VyY2UuZ2V0T2JqZWN0cygpO1xuICAgICAgcmV0dXJuIF8uZWFjaChkYXRhc291cmNlT2JqZWN0cywgZnVuY3Rpb24odiwgaykge1xuICAgICAgICB2YXIgX29iajtcbiAgICAgICAgX29iaiA9IENyZWF0b3IuY29udmVydE9iamVjdChjbG9uZSh2LnRvQ29uZmlnKCkpLCBzcGFjZUlkKTtcbiAgICAgICAgX29iai5uYW1lID0gaztcbiAgICAgICAgX29iai5kYXRhYmFzZV9uYW1lID0gbmFtZTtcbiAgICAgICAgX29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgcmVzdWx0LmFwcHMgPSBfLmV4dGVuZChyZXN1bHQuYXBwcywgY2xvbmUoZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpKTtcbiAgICByZXR1cm4gcmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZChyZXN1bHQuZGFzaGJvYXJkcywgZGF0YXNvdXJjZS5nZXREYXNoYm9hcmRzQ29uZmlnKCkpO1xuICB9KTtcbiAgcmVzdWx0LmFwcHMgPSBfLmV4dGVuZChyZXN1bHQuYXBwcyB8fCB7fSwgQ3JlYXRvci5nZXREQkFwcHMoc3BhY2VJZCkpO1xuICByZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kKHJlc3VsdC5kYXNoYm9hcmRzIHx8IHt9LCBDcmVhdG9yLmdldERCRGFzaGJvYXJkcyhzcGFjZUlkKSk7XG4gIF9BcHBzID0ge307XG4gIF8uZWFjaChyZXN1bHQuYXBwcywgZnVuY3Rpb24oYXBwLCBrZXkpIHtcbiAgICBpZiAoIWFwcC5faWQpIHtcbiAgICAgIGFwcC5faWQgPSBrZXk7XG4gICAgfVxuICAgIGlmIChhcHAuY29kZSkge1xuICAgICAgYXBwLl9kYmlkID0gYXBwLl9pZDtcbiAgICAgIGFwcC5faWQgPSBhcHAuY29kZTtcbiAgICB9XG4gICAgcmV0dXJuIF9BcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25BcHBzKGxuZywgX0FwcHMpO1xuICByZXN1bHQuYXBwcyA9IF9BcHBzO1xuICBhc3NpZ25lZF9tZW51cyA9IGNsb25lKHJlc3VsdC5hc3NpZ25lZF9tZW51cyk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uTWVudXMobG5nLCBhc3NpZ25lZF9tZW51cyk7XG4gIHJlc3VsdC5hc3NpZ25lZF9tZW51cyA9IGFzc2lnbmVkX21lbnVzO1xuICBfRGFzaGJvYXJkcyA9IHt9O1xuICBfLmVhY2gocmVzdWx0LmRhc2hib2FyZHMsIGZ1bmN0aW9uKGRhc2hib2FyZCwga2V5KSB7XG4gICAgaWYgKCFkYXNoYm9hcmQuX2lkKSB7XG4gICAgICBkYXNoYm9hcmQuX2lkID0ga2V5O1xuICAgIH1cbiAgICByZXR1cm4gX0Rhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmQ7XG4gIH0pO1xuICByZXN1bHQuZGFzaGJvYXJkcyA9IF9EYXNoYm9hcmRzO1xuICByZXN1bHQucGx1Z2lucyA9IHR5cGVvZiBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zID09PSBcImZ1bmN0aW9uXCIgPyBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zKCkgOiB2b2lkIDA7XG4gIG9iamVjdHNMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQodXNlcklkLCBzcGFjZUlkKTtcbiAgaWYgKG9iamVjdHNMYXlvdXQpIHtcbiAgICBfLmVhY2gob2JqZWN0c0xheW91dCwgZnVuY3Rpb24ob2JqZWN0TGF5b3V0KSB7XG4gICAgICB2YXIgX2ZpZWxkcywgX29iamVjdDtcbiAgICAgIF9vYmplY3QgPSBjbG9uZShyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdKTtcbiAgICAgIGlmIChfb2JqZWN0KSB7XG4gICAgICAgIF9maWVsZHMgPSB7fTtcbiAgICAgICAgXy5lYWNoKG9iamVjdExheW91dC5maWVsZHMsIGZ1bmN0aW9uKF9pdGVtKSB7XG4gICAgICAgICAgdmFyIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjc7XG4gICAgICAgICAgX2ZpZWxkc1tfaXRlbS5maWVsZF0gPSBfb2JqZWN0LmZpZWxkc1tfaXRlbS5maWVsZF07XG4gICAgICAgICAgaWYgKF8uaGFzKF9pdGVtLCAnZ3JvdXAnKSkge1xuICAgICAgICAgICAgaWYgKChyZWYxID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmMS5ncm91cCA9IF9pdGVtLmdyb3VwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoX2l0ZW0ucmVxdWlyZWQpIHtcbiAgICAgICAgICAgIGlmICgocmVmMiA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjIucmVhZG9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgocmVmMyA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjMuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAocmVmNCA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsID8gcmVmNC5yZXF1aXJlZCA9IHRydWUgOiB2b2lkIDA7XG4gICAgICAgICAgfSBlbHNlIGlmIChfaXRlbS5yZWFkb25seSkge1xuICAgICAgICAgICAgaWYgKChyZWY1ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmNS5yZWFkb25seSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHJlZjYgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWY2LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAocmVmNyA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsID8gcmVmNy5yZXF1aXJlZCA9IGZhbHNlIDogdm9pZCAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIF9vYmplY3QuZmllbGRzID0gX2ZpZWxkcztcbiAgICAgICAgX29iamVjdC5hbGxvd19hY3Rpb25zID0gb2JqZWN0TGF5b3V0LmFjdGlvbnMgfHwgW107XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0Lm9iamVjdHNbb2JqZWN0TGF5b3V0Lm9iamVjdF9uYW1lXSA9IF9vYmplY3Q7XG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBjb2RlOiAyMDAsXG4gICAgZGF0YTogcmVzdWx0XG4gIH0pO1xufSk7XG4iLCJKc29uUm91dGVzLmFkZCAncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHRyeVxyXG5cdFx0Ym9keSA9IFwiXCJcclxuXHRcdHJlcS5vbignZGF0YScsIChjaHVuayktPlxyXG5cdFx0XHRib2R5ICs9IGNodW5rXHJcblx0XHQpXHJcblx0XHRyZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKCgpLT5cclxuXHRcdFx0XHR4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKVxyXG5cdFx0XHRcdHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHsgdHJpbTp0cnVlLCBleHBsaWNpdEFycmF5OmZhbHNlLCBleHBsaWNpdFJvb3Q6ZmFsc2UgfSlcclxuXHRcdFx0XHRwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgKGVyciwgcmVzdWx0KS0+XHJcblx0XHRcdFx0XHRcdCMg54m55Yir5o+Q6YaS77ya5ZWG5oi357O757uf5a+55LqO5pSv5LuY57uT5p6c6YCa55+l55qE5YaF5a655LiA5a6a6KaB5YGa562+5ZCN6aqM6K+BLOW5tuagoemqjOi/lOWbnueahOiuouWNlemHkemineaYr+WQpuS4juWVhuaIt+S+p+eahOiuouWNlemHkemineS4gOiHtO+8jOmYsuatouaVsOaNruazhOa8j+WvvOiHtOWHuueOsOKAnOWBh+mAmuefpeKAne+8jOmAoOaIkOi1hOmHkeaNn+WksVxyXG5cdFx0XHRcdFx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cdFx0XHRcdFx0XHR3eHBheSA9IFdYUGF5KHtcclxuXHRcdFx0XHRcdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdFx0XHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdFx0XHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0c2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKVxyXG5cdFx0XHRcdFx0XHRhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpXHJcblx0XHRcdFx0XHRcdGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkXHJcblx0XHRcdFx0XHRcdGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZClcclxuXHRcdFx0XHRcdFx0aWYgYnByIGFuZCBicHIudG90YWxfZmVlIGlzIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSBhbmQgc2lnbiBpcyByZXN1bHQuc2lnblxyXG5cdFx0XHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtfaWQ6IGNvZGVfdXJsX2lkfSwgeyRzZXQ6IHtwYWlkOiB0cnVlfX0pXHJcblx0XHRcdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudClcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdClcclxuXHRcdFx0KSwgKGVyciktPlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJ1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblx0XHRcclxuXHRjYXRjaCBlXHJcblx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0cmVzLndyaXRlSGVhZCgyMDAsIHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCd9KVxyXG5cdHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpXHJcblxyXG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBib2R5LCBlO1xuICB0cnkge1xuICAgIGJvZHkgPSBcIlwiO1xuICAgIHJlcS5vbignZGF0YScsIGZ1bmN0aW9uKGNodW5rKSB7XG4gICAgICByZXR1cm4gYm9keSArPSBjaHVuaztcbiAgICB9KTtcbiAgICByZXEub24oJ2VuZCcsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHBhcnNlciwgeG1sMmpzO1xuICAgICAgeG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJyk7XG4gICAgICBwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7XG4gICAgICAgIHRyaW06IHRydWUsXG4gICAgICAgIGV4cGxpY2l0QXJyYXk6IGZhbHNlLFxuICAgICAgICBleHBsaWNpdFJvb3Q6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VTdHJpbmcoYm9keSwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgdmFyIFdYUGF5LCBhdHRhY2gsIGJwciwgY29kZV91cmxfaWQsIHNpZ24sIHd4cGF5O1xuICAgICAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICAgICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgICAgICB9KTtcbiAgICAgICAgc2lnbiA9IHd4cGF5LnNpZ24oXy5jbG9uZShyZXN1bHQpKTtcbiAgICAgICAgYXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKTtcbiAgICAgICAgY29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWQ7XG4gICAgICAgIGJwciA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZE9uZShjb2RlX3VybF9pZCk7XG4gICAgICAgIGlmIChicHIgJiYgYnByLnRvdGFsX2ZlZSA9PT0gTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpICYmIHNpZ24gPT09IHJlc3VsdC5zaWduKSB7XG4gICAgICAgICAgZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBjb2RlX3VybF9pZFxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSksIGZ1bmN0aW9uKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZScpO1xuICAgIH0pKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgfVxuICByZXMud3JpdGVIZWFkKDIwMCwge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ1xuICB9KTtcbiAgcmV0dXJuIHJlcy5lbmQoJzx4bWw+PHJldHVybl9jb2RlPjwhW0NEQVRBW1NVQ0NFU1NdXT48L3JldHVybl9jb2RlPjwveG1sPicpO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9jb250YWN0c19saW1pdDogKHNwYWNlKS0+XHJcblx0XHQjIOagueaNruW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h++8jOafpeivouWHuuW9k+WJjeeUqOaIt+mZkOWumueahOe7hOe7h+afpeeci+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7RcclxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4umZhbHNl6KGo56S65LiN6ZmQ5a6a57uE57uH6IyD5Zu077yM5Y2z6KGo56S66IO955yL5pW05Liq5bel5L2c5Yy655qE57uE57uHXHJcblx0XHQjIOm7mOiupOi/lOWbnumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWxnue7hOe7h1xyXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xyXG5cdFx0cmVWYWx1ZSA9XHJcblx0XHRcdGlzTGltaXQ6IHRydWVcclxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXHJcblx0XHRzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlLCBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIn0pXHJcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XHJcblxyXG5cdFx0aWYgbGltaXRzLmxlbmd0aFxyXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0XHRcdG15T3JnSWRzID0gbXlPcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdHJldHVybiByZVZhbHVlXHJcblx0XHRcdFxyXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXHJcblx0XHRcdGZvciBsaW1pdCBpbiBsaW1pdHNcclxuXHRcdFx0XHRmcm9tcyA9IGxpbWl0LmZyb21zXHJcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXHJcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBwYXJlbnRzOiB7JGluOiBmcm9tc319LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbj8ubWFwIChuKSAtPlxyXG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXHJcblx0XHRcdFx0Zm9yIG15T3JnSWQgaW4gbXlPcmdJZHNcclxuXHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcclxuXHRcdFx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdGlmIHRlbXBJc0xpbWl0XHJcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoIHRvc1xyXG5cdFx0XHRcdFx0XHRteUxpdG1pdE9yZ0lkcy5wdXNoIG15T3JnSWRcclxuXHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gXy51bmlxIG15TGl0bWl0T3JnSWRzXHJcblx0XHRcdGlmIG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXHJcblx0XHRcdFx0aXNMaW1pdCA9IGZhbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcSBfLmZsYXR0ZW4gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblxyXG5cdFx0aWYgaXNMaW1pdFxyXG5cdFx0XHR0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgX2lkOiB7JGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnN9fSwge2ZpZWxkczp7X2lkOiAxLCBwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInniLblrZDoioLngrnlhbPns7vnmoToioLngrnnrZvpgInlh7rmnaXlubblj5blh7rmnIDlpJblsYLoioLngrlcclxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcclxuXHRcdFx0b3JncyA9IF8uZmlsdGVyIHRvT3JncywgKG9yZykgLT5cclxuXHRcdFx0XHRwYXJlbnRzID0gb3JnLnBhcmVudHMgb3IgW11cclxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcCAobikgLT5cclxuXHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHJcblx0XHRyZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0XHJcblx0XHRyZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9uc1xyXG5cdFx0cmV0dXJuIHJlVmFsdWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBnZXRfY29udGFjdHNfbGltaXQ6IGZ1bmN0aW9uKHNwYWNlKSB7XG4gICAgdmFyIGZyb21zLCBmcm9tc0NoaWxkcmVuLCBmcm9tc0NoaWxkcmVuSWRzLCBpLCBpc0xpbWl0LCBqLCBsZW4sIGxlbjEsIGxpbWl0LCBsaW1pdHMsIG15TGl0bWl0T3JnSWRzLCBteU9yZ0lkLCBteU9yZ0lkcywgbXlPcmdzLCBvcmdzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMsIHJlVmFsdWUsIHNldHRpbmcsIHRlbXBJc0xpbWl0LCB0b09yZ3MsIHRvcztcbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICByZVZhbHVlID0ge1xuICAgICAgaXNMaW1pdDogdHJ1ZSxcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cbiAgICB9O1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiByZVZhbHVlO1xuICAgIH1cbiAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgc2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJcbiAgICB9KTtcbiAgICBsaW1pdHMgPSAoc2V0dGluZyAhPSBudWxsID8gc2V0dGluZy52YWx1ZXMgOiB2b2lkIDApIHx8IFtdO1xuICAgIGlmIChsaW1pdHMubGVuZ3RoKSB7XG4gICAgICBteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIHVzZXJzOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBteU9yZ0lkcyA9IG15T3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIGlmICghbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiByZVZhbHVlO1xuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBbXTtcbiAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGxpbWl0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBsaW1pdCA9IGxpbWl0c1tpXTtcbiAgICAgICAgZnJvbXMgPSBsaW1pdC5mcm9tcztcbiAgICAgICAgdG9zID0gbGltaXQudG9zO1xuICAgICAgICBmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgICAgcGFyZW50czoge1xuICAgICAgICAgICAgJGluOiBmcm9tc1xuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgX2lkOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4gIT0gbnVsbCA/IGZyb21zQ2hpbGRyZW4ubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICAgIH0pIDogdm9pZCAwO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gbXlPcmdJZHMubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgICAgbXlPcmdJZCA9IG15T3JnSWRzW2pdO1xuICAgICAgICAgIHRlbXBJc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgICAgdGVtcElzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGVtcElzTGltaXQpIHtcbiAgICAgICAgICAgIGlzTGltaXQgPSB0cnVlO1xuICAgICAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2godG9zKTtcbiAgICAgICAgICAgIG15TGl0bWl0T3JnSWRzLnB1c2gobXlPcmdJZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IF8udW5pcShteUxpdG1pdE9yZ0lkcyk7XG4gICAgICBpZiAobXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoKSB7XG4gICAgICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEoXy5mbGF0dGVuKG91dHNpZGVfb3JnYW5pemF0aW9ucykpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaXNMaW1pdCkge1xuICAgICAgdG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAkaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICBwYXJlbnRzOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBvcmdzID0gXy5maWx0ZXIodG9PcmdzLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgdmFyIHBhcmVudHM7XG4gICAgICAgIHBhcmVudHMgPSBvcmcucGFyZW50cyB8fCBbXTtcbiAgICAgICAgcmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSAmJiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMTtcbiAgICAgIH0pO1xuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdDtcbiAgICByZVZhbHVlLm91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG91dHNpZGVfb3JnYW5pemF0aW9ucztcbiAgICByZXR1cm4gcmVWYWx1ZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kcyh7XHJcbiAgICBzZXRLZXlWYWx1ZTogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcclxuICAgICAgICBjaGVjayh2YWx1ZSwgT2JqZWN0KTtcclxuXHJcbiAgICAgICAgb2JqID0ge307XHJcbiAgICAgICAgb2JqLnVzZXIgPSB0aGlzLnVzZXJJZDtcclxuICAgICAgICBvYmoua2V5ID0ga2V5O1xyXG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgYyA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmQoe1xyXG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICB9KS5jb3VudCgpO1xyXG4gICAgICAgIGlmIChjID4gMCkge1xyXG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy51cGRhdGUoe1xyXG4gICAgICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXHJcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgICAgICAkc2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmluc2VydChvYmopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn0pIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3NldHRsZXVwOiAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQ9XCJcIiktPlxyXG5cdFx0Y2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKVxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZylcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblxyXG5cdFx0aWYgbm90IHVzZXIuaXNfY2xvdWRhZG1pblxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcnXHJcblx0XHRzcGFjZXMgPSBbXVxyXG5cdFx0aWYgc3BhY2VfaWRcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VfaWQsIGlzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0cmVzdWx0ID0gW11cclxuXHRcdHNwYWNlcy5mb3JFYWNoIChzKSAtPlxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRlID0ge31cclxuXHRcdFx0XHRlLl9pZCA9IHMuX2lkXHJcblx0XHRcdFx0ZS5uYW1lID0gcy5uYW1lXHJcblx0XHRcdFx0ZS5lcnIgPSBlcnJcclxuXHRcdFx0XHRyZXN1bHQucHVzaCBlXHJcblx0XHRpZiByZXN1bHQubGVuZ3RoID4gMFxyXG5cdFx0XHRjb25zb2xlLmVycm9yIHJlc3VsdFxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWxcclxuXHRcdFx0XHRFbWFpbC5zZW5kXHJcblx0XHRcdFx0XHR0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nXHJcblx0XHRcdFx0XHRmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tXHJcblx0XHRcdFx0XHRzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnXHJcblx0XHRcdFx0XHR0ZXh0OiBKU09OLnN0cmluZ2lmeSgncmVzdWx0JzogcmVzdWx0KVxyXG5cdFx0XHRjYXRjaCBlcnJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyclxyXG5cdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nJyIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19zZXR0bGV1cDogZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgICB2YXIgRW1haWwsIGVyciwgcmVzdWx0LCBzcGFjZXMsIHVzZXI7XG4gICAgaWYgKHNwYWNlX2lkID09IG51bGwpIHtcbiAgICAgIHNwYWNlX2lkID0gXCJcIjtcbiAgICB9XG4gICAgY2hlY2soYWNjb3VudGluZ19tb250aCwgU3RyaW5nKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcnKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBpZiAoc3BhY2VfaWQpIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgX2lkOiBzcGFjZV9pZCxcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgaXNfcGFpZDogdHJ1ZVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlc3VsdCA9IFtdO1xuICAgIHNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgIHZhciBlLCBlcnI7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgZSA9IHt9O1xuICAgICAgICBlLl9pZCA9IHMuX2lkO1xuICAgICAgICBlLm5hbWUgPSBzLm5hbWU7XG4gICAgICAgIGUuZXJyID0gZXJyO1xuICAgICAgICByZXR1cm4gcmVzdWx0LnB1c2goZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3VsdCk7XG4gICAgICB0cnkge1xuICAgICAgICBFbWFpbCA9IFBhY2thZ2UuZW1haWwuRW1haWw7XG4gICAgICAgIEVtYWlsLnNlbmQoe1xuICAgICAgICAgIHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbScsXG4gICAgICAgICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICAgICAgICBzdWJqZWN0OiAnYmlsbGluZyBzZXR0bGV1cCByZXN1bHQnLFxuICAgICAgICAgIHRleHQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICdyZXN1bHQnOiByZXN1bHRcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcnKTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdHNldFVzZXJuYW1lOiAoc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSAtPlxyXG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XHJcblx0XHRjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcclxuXHJcblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJylcclxuXHJcblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCdlcnJvci1pbnZhbGlkLXVzZXInKVxyXG5cclxuXHRcdHVubGVzcyB1c2VyX2lkXHJcblx0XHRcdHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZFxyXG5cclxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblxyXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRzZXQ6IHt1c2VybmFtZTogdXNlcm5hbWV9fSlcclxuXHJcblx0XHRyZXR1cm4gdXNlcm5hbWVcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRVc2VybmFtZTogZnVuY3Rpb24oc3BhY2VfaWQsIHVzZXJuYW1lLCB1c2VyX2lkKSB7XG4gICAgdmFyIHNwYWNlVXNlcjtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcbiAgICBpZiAoIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpICYmIHVzZXJfaWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpO1xuICAgIH1cbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdlcnJvci1pbnZhbGlkLXVzZXInKTtcbiAgICB9XG4gICAgaWYgKCF1c2VyX2lkKSB7XG4gICAgICB1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWQ7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpO1xuICAgIH1cbiAgICBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICB1c2VybmFtZTogdXNlcm5hbWVcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdXNlcm5hbWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRiaWxsaW5nX3JlY2hhcmdlOiAodG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0XHRjaGVjayB0b3RhbF9mZWUsIE51bWJlclxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZyBcclxuXHRcdGNoZWNrIG5ld19pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbW9kdWxlX25hbWVzLCBBcnJheSBcclxuXHRcdGNoZWNrIGVuZF9kYXRlLCBTdHJpbmcgXHJcblx0XHRjaGVjayB1c2VyX2NvdW50LCBOdW1iZXIgXHJcblxyXG5cdFx0dXNlcl9pZCA9IHRoaXMudXNlcklkXHJcblxyXG5cdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdG9yZGVyX2JvZHkgPSBbXVxyXG5cdFx0ZGIubW9kdWxlcy5maW5kKHtuYW1lOiB7JGluOiBtb2R1bGVfbmFtZXN9fSkuZm9yRWFjaCAobSktPlxyXG5cdFx0XHRsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYlxyXG5cdFx0XHRvcmRlcl9ib2R5LnB1c2ggbS5uYW1lX3poXHJcblxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHRcdGlmIG5vdCBzcGFjZS5pc19wYWlkXHJcblx0XHRcdHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTpzcGFjZV9pZH0pLmNvdW50KClcclxuXHRcdFx0b25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlc1xyXG5cdFx0XHRpZiB0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbioxMDBcclxuXHRcdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pSN7b25lX21vbnRoX3l1YW59XCJcclxuXHJcblx0XHRyZXN1bHRfb2JqID0ge31cclxuXHJcblx0XHRhdHRhY2ggPSB7fVxyXG5cdFx0YXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkXHJcblx0XHRXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKVxyXG5cclxuXHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXHJcblx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxyXG5cdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0fSlcclxuXHJcblx0XHR3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xyXG5cdFx0XHRib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxyXG5cdFx0XHRvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcclxuXHRcdFx0dG90YWxfZmVlOiB0b3RhbF9mZWUsXHJcblx0XHRcdHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxyXG5cdFx0XHRub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxyXG5cdFx0XHR0cmFkZV90eXBlOiAnTkFUSVZFJyxcclxuXHRcdFx0cHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHRhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcclxuXHRcdH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKChlcnIsIHJlc3VsdCkgLT4gXHJcblx0XHRcdFx0aWYgZXJyIFxyXG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRpZiByZXN1bHRcclxuXHRcdFx0XHRcdG9iaiA9IHt9XHJcblx0XHRcdFx0XHRvYmouX2lkID0gbmV3X2lkXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZCA9IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRvYmouaW5mbyA9IHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZVxyXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkXHJcblx0XHRcdFx0XHRvYmouc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRcdFx0b2JqLnBhaWQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0b2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRcdFx0XHRcdG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblx0XHRcdFx0XHRvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iailcclxuXHRcdFx0KSwgKGUpLT5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJ1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nIGUuc3RhY2tcclxuXHRcdFx0KVxyXG5cdFx0KVxyXG5cclxuXHRcdFxyXG5cdFx0cmV0dXJuIFwic3VjY2Vzc1wiIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3JlY2hhcmdlOiBmdW5jdGlvbih0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgICB2YXIgV1hQYXksIGF0dGFjaCwgbGlzdHByaWNlcywgb25lX21vbnRoX3l1YW4sIG9yZGVyX2JvZHksIHJlc3VsdF9vYmosIHNwYWNlLCBzcGFjZV91c2VyX2NvdW50LCB1c2VyX2lkLCB3eHBheTtcbiAgICBjaGVjayh0b3RhbF9mZWUsIE51bWJlcik7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobmV3X2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG1vZHVsZV9uYW1lcywgQXJyYXkpO1xuICAgIGNoZWNrKGVuZF9kYXRlLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJfY291bnQsIE51bWJlcik7XG4gICAgdXNlcl9pZCA9IHRoaXMudXNlcklkO1xuICAgIGxpc3RwcmljZXMgPSAwO1xuICAgIG9yZGVyX2JvZHkgPSBbXTtcbiAgICBkYi5tb2R1bGVzLmZpbmQoe1xuICAgICAgbmFtZToge1xuICAgICAgICAkaW46IG1vZHVsZV9uYW1lc1xuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgICAgbGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWI7XG4gICAgICByZXR1cm4gb3JkZXJfYm9keS5wdXNoKG0ubmFtZV96aCk7XG4gICAgfSk7XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gICAgaWYgKCFzcGFjZS5pc19wYWlkKSB7XG4gICAgICBzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSkuY291bnQoKTtcbiAgICAgIG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXM7XG4gICAgICBpZiAodG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4gKiAxMDApIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6VcIiArIG9uZV9tb250aF95dWFuKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0X29iaiA9IHt9O1xuICAgIGF0dGFjaCA9IHt9O1xuICAgIGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZDtcbiAgICBXWFBheSA9IHJlcXVpcmUoJ3dlaXhpbi1wYXknKTtcbiAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgIG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxuICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgfSk7XG4gICAgd3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcbiAgICAgIGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXG4gICAgICBvdXRfdHJhZGVfbm86IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIHRvdGFsX2ZlZTogdG90YWxfZmVlLFxuICAgICAgc3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXG4gICAgICBub3RpZnlfdXJsOiBNZXRlb3IuYWJzb2x1dGVVcmwoKSArICdhcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLFxuICAgICAgdHJhZGVfdHlwZTogJ05BVElWRScsXG4gICAgICBwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICBhdHRhY2g6IEpTT04uc3RyaW5naWZ5KGF0dGFjaClcbiAgICB9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgdmFyIG9iajtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIuc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICBvYmogPSB7fTtcbiAgICAgICAgb2JqLl9pZCA9IG5ld19pZDtcbiAgICAgICAgb2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZTtcbiAgICAgICAgb2JqLmluZm8gPSByZXN1bHQ7XG4gICAgICAgIG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWU7XG4gICAgICAgIG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZDtcbiAgICAgICAgb2JqLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICAgIG9iai5wYWlkID0gZmFsc2U7XG4gICAgICAgIG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICAgICAgICBvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgb2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICAgICAgICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKTtcbiAgICAgIH1cbiAgICB9KSwgZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBiaWxsaW5nX3JlY2hhcmdlLmNvZmZlZScpO1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGUuc3RhY2spO1xuICAgIH0pKTtcbiAgICByZXR1cm4gXCJzdWNjZXNzXCI7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nXHJcblx0XHR1c2VyX2NvdW50X2luZm8gPSBuZXcgT2JqZWN0XHJcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcclxuXHRcdHVzZXJfY291bnRfaW5mby5hY2NlcHRlZF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0cmV0dXJuIHVzZXJfY291bnRfaW5mbyIsIk1ldGVvci5tZXRob2RzXHJcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0ZGIudXNlcnMuY3JlYXRlX3NlY3JldCB0aGlzLnVzZXJJZCwgbmFtZVxyXG5cclxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZCB8fCAhdG9rZW5cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKVxyXG5cclxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHRoaXMudXNlcklkfSwgeyRwdWxsOiB7XCJzZWNyZXRzXCI6IHtoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW59fX0pXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcbiAgICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiAoc3BhY2VJZCwgdXNlcklkKSAtPlxyXG4gICAgICAgIGNoZWNrIHNwYWNlSWQsIFN0cmluZ1xyXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXHJcblxyXG4gICAgICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtzcGFjZTogc3BhY2VJZCwgdXNlcjogdXNlcklkfSwge2ZpZWxkczoge29yZ2FuaXphdGlvbnM6IDF9fSlcclxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ25vdC1hdXRob3JpemVkJ1xyXG5cclxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XHJcbiAgICAgICAgICAgIF9pZDoge1xyXG4gICAgICAgICAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwge2ZpZWxkczoge3BhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cclxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQgfSwgeyBmaWVsZHM6IHsgb2JqZWN0X25hbWU6IDEsIGZsb3dfaWQ6IDEsIHNwYWNlOiAxIH0gfSkuZmV0Y2goKVxyXG4gICAgICAgIF8uZWFjaCBvd3MsKG8pIC0+XHJcbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7IGZpZWxkczogeyBuYW1lOiAxLCBwZXJtczogMSB9IH0pXHJcbiAgICAgICAgICAgIGlmIGZsXHJcbiAgICAgICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcclxuICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlXHJcblxyXG4gICAgICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xyXG4gICAgICAgICAgICAgICAgaWYgcGVybXNcclxuICAgICAgICAgICAgICAgICAgICBpZiBwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiBwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgb3JnYW5pemF0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXHJcblxyXG4gICAgICAgIG93cyA9IG93cy5maWx0ZXIgKG4pLT5cclxuICAgICAgICAgICAgcmV0dXJuIG4uZmxvd19uYW1lXHJcblxyXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbmFtZTogMSxcbiAgICAgICAgICBwZXJtczogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmIChmbCkge1xuICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWU7XG4gICAgICAgIG8uY2FuX2FkZCA9IGZhbHNlO1xuICAgICAgICBwZXJtcyA9IGZsLnBlcm1zO1xuICAgICAgICBpZiAocGVybXMpIHtcbiAgICAgICAgICBpZiAocGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSBpZiAocGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBpZiAoY3VyU3BhY2VVc2VyICYmIGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zICYmIF8uaW50ZXJzZWN0aW9uKGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAob3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSBfLnNvbWUob3JnYW5pemF0aW9ucywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIG93cyA9IG93cy5maWx0ZXIoZnVuY3Rpb24obikge1xuICAgICAgcmV0dXJuIG4uZmxvd19uYW1lO1xuICAgIH0pO1xuICAgIHJldHVybiBvd3M7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRzZXRTcGFjZVVzZXJQYXNzd29yZDogKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkgLT5cclxuXHRcdGlmICF0aGlzLnVzZXJJZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIilcclxuXHRcdFxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7X2lkOiBzcGFjZV9pZH0pXHJcblx0XHRpc1NwYWNlQWRtaW4gPSBzcGFjZT8uYWRtaW5zPy5pbmNsdWRlcyh0aGlzLnVzZXJJZClcclxuXHJcblx0XHR1bmxlc3MgaXNTcGFjZUFkbWluXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKVxyXG5cclxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe19pZDogc3BhY2VfdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcclxuXHRcdHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcl9pZH0pXHJcblx0XHRjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9KVxyXG5cclxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIilcclxuXHJcblx0XHRTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXHJcblxyXG5cdFx0QWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtsb2dvdXQ6IHRydWV9KVxyXG5cclxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXHJcblx0XHRpZiB1c2VyQ1AubW9iaWxlICYmIHVzZXJDUC5tb2JpbGVfdmVyaWZpZWRcclxuXHRcdFx0bGFuZyA9ICdlbidcclxuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXHJcblx0XHRcdFx0bGFuZyA9ICd6aC1DTidcclxuXHRcdFx0U01TUXVldWUuc2VuZFxyXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxyXG5cdFx0XHRcdEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxyXG5cdFx0XHRcdFBhcmFtU3RyaW5nOiAnJyxcclxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXHJcblx0XHRcdFx0U2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxyXG5cdFx0XHRcdFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXHJcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXHJcblxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY3VycmVudFVzZXIsIGlzU3BhY2VBZG1pbiwgbGFuZywgcmVmLCBzcGFjZSwgc3BhY2VVc2VyLCB1c2VyQ1AsIHVzZXJfaWQ7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpc1NwYWNlQWRtaW4gPSBzcGFjZSAhPSBudWxsID8gKHJlZiA9IHNwYWNlLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh0aGlzLnVzZXJJZCkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgaWYgKCFpc1NwYWNlQWRtaW4pIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuaCqOayoeacieadg+mZkOS/ruaUueivpeeUqOaIt+WvhueggVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XG4gICAgdXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KTtcbiAgICBjdXJyZW50VXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0pO1xuICAgIGlmIChzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInBlbmRpbmdcIiB8fCBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09PSBcInJlZnVzZWRcIikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpO1xuICAgIH1cbiAgICBTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7XG4gICAgICBsb2dvdXQ6IHRydWVcbiAgICB9KTtcbiAgICBpZiAodXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkKSB7XG4gICAgICBsYW5nID0gJ2VuJztcbiAgICAgIGlmICh1c2VyQ1AubG9jYWxlID09PSAnemgtY24nKSB7XG4gICAgICAgIGxhbmcgPSAnemgtQ04nO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cclxuXHJcbiMg6I635b6X57uT566X5ZGo5pyf5YaF55qE5Y+v57uT566X5pel5pWwXHJcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XHJcbiMgYWNjb3VudGluZ19tb250aCDnu5PnrpfmnIjvvIzmoLzlvI/vvJpZWVlZTU1cclxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0Y291bnRfZGF5cyA9IDBcclxuXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJ9KVxyXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxyXG5cclxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxyXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXHJcblxyXG5cdGlmIGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUgIyDov5nkuKrmnIjkuI3lnKjmnKzmrKHnu5PnrpfojIPlm7TkuYvlhoXvvIxjb3VudF9kYXlzPTBcclxuXHRcdCMgZG8gbm90aGluZ1xyXG5cdGVsc2UgaWYgc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlIGFuZCBmaXJzdF9kYXRlIDwgZW5kX2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcclxuXHRcdGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkvKDI0KjYwKjYwKjEwMDApICsgMVxyXG5cclxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxyXG5cclxuIyDph43nrpfov5nkuIDml6XnmoTkvZnpop1cclxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cclxuXHRsYXN0X2JpbGwgPSBudWxsXHJcblx0YmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgY3JlYXRlZDogcmVmcmVzaF9kYXRlfSlcclxuXHJcblx0IyDojrflj5bmraPluLjku5jmrL7nmoTlsI/kuo5yZWZyZXNoX2RhdGXnmoTmnIDov5HnmoTkuIDmnaHorrDlvZVcclxuXHRwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGNyZWF0ZWQ6IHtcclxuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdClcclxuXHRpZiBwYXltZW50X2JpbGxcclxuXHRcdGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbFxyXG5cdGVsc2VcclxuXHRcdCMg6I635Y+W5pyA5paw55qE57uT566X55qE5LiA5p2h6K6w5b2VXHJcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHJcblx0XHRhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0YmlsbGluZ19tb250aDogYl9tXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdGlmIGFwcF9iaWxsXHJcblx0XHRcdGxhc3RfYmlsbCA9IGFwcF9iaWxsXHJcblxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXHJcblx0Y3JlZGl0cyA9IGlmIGJpbGwuY3JlZGl0cyB0aGVuIGJpbGwuY3JlZGl0cyBlbHNlIDAuMFxyXG5cdHNldE9iaiA9IG5ldyBPYmplY3RcclxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZVxyXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe19pZDogYmlsbC5faWR9LCB7JHNldDogc2V0T2JqfSlcclxuXHJcbiMg57uT566X5b2T5pyI55qE5pSv5Ye65LiO5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKS0+XHJcblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKClcclxuXHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHJcblx0ZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cy9kYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKVxyXG5cdGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHR7XHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0YmlsbGluZ19kYXRlOiB7XHJcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXHJcblxyXG5cdG5vdyA9IG5ldyBEYXRlXHJcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XHJcblx0bmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpXHJcblx0bmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGhcclxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XHJcblx0bmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWVcclxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2VcclxuXHRuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdG5ld19iaWxsLmRlYml0cyA9IGRlYml0c1xyXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcclxuXHRuZXdfYmlsbC5jcmVhdGVkID0gbm93XHJcblx0bmV3X2JpbGwubW9kaWZpZWQgPSBub3dcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSAoc3BhY2VfaWQpLT5cclxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxyXG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcclxuXHRkYi5iaWxsaW5ncy5maW5kKFxyXG5cdFx0e1xyXG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdHRyYW5zYWN0aW9uOiB7JGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdfVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge2NyZWF0ZWQ6IDF9XHJcblx0XHR9XHJcblx0KS5mb3JFYWNoIChiaWxsKS0+XHJcblx0XHRyZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKVxyXG5cclxuXHRpZiByZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDBcclxuXHRcdF8uZWFjaCByZWZyZXNoX2RhdGVzLCAocl9kKS0+XHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cclxuXHRtb2R1bGVzID0gbmV3IEFycmF5XHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXHJcblxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2ggKG0pLT5cclxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXHJcblx0XHRcdFx0Y2hhbmdlX2RhdGU6IHtcclxuXHRcdFx0XHRcdCRsdGU6IGVuZF9kYXRlXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y3JlYXRlZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcclxuXHRcdGlmIG5vdCBtX2NoYW5nZWxvZ1xyXG5cdFx0XHQjICBkbyBub3RoaW5nXHJcblxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWuieijhe+8jOWboOatpOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZTxzdGFydGRhdGUgJiBvcGVyYXRpb2494oCcdW5pbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5Y246L2977yM5Zug5q2k5LiN6K6h566X6LS555SoXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSBhbmQgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09IFwidW5pbnN0YWxsXCJcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cdFx0IyDoi6Xor6XorrDlvZXnmoRjaGFuZ2VfZGF0ZeKJpXN0YXJ0ZGF0Ze+8jOivtOaYjuW9k+aciOWGheWPkeeUn+i/h+WuieijheaIluWNuOi9veeahOaTjeS9nO+8jOmcgOiuoeeul+i0ueeUqO+8jOWwhm1vZHVsZV9uYW1l5LiObW9kdWxlcy5saXN0cHJpY2XliqDlhaVtb2R1bGVz5pWw57uE5LitXHJcblx0XHRlbHNlIGlmIG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGVcclxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXHJcblxyXG5cdHJldHVybiBtb2R1bGVzXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gKCktPlxyXG5cdG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheVxyXG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cclxuXHRcdG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSlcclxuXHQpXHJcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxyXG5cclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXHJcblx0XHRyZXR1cm5cclxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGRlYml0cyA9IDBcclxuXHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGJpbGxpbmdfZGF0ZTogYl9tLFxyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdCkuZm9yRWFjaCgoYiktPlxyXG5cdFx0XHRkZWJpdHMgKz0gYi5kZWJpdHNcclxuXHRcdClcclxuXHRcdG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkfSwge3NvcnQ6IHttb2RpZmllZDogLTF9fSlcclxuXHRcdGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlXHJcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxyXG5cdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0aWYgZGViaXRzID4gMFxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQjIOW9k+aciOWImuWNh+e6p++8jOW5tuayoeacieaJo+asvlxyXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXHJcblxyXG5cdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRfaWQ6IHNwYWNlX2lkXHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkc2V0OiB7XHJcblx0XHRcdFx0XHRiYWxhbmNlOiBiYWxhbmNlLFxyXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdGVsc2VcclxuXHRcdCMg6I635b6X5YW257uT566X5a+56LGh5pel5pyfcGF5bWVudGRhdGVz5pWw57uE5ZKMY291bnRfZGF5c+WPr+e7k+eul+aXpeaVsFxyXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdGlmIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09IDBcclxuXHRcdFx0IyDkuZ/pnIDlr7nlvZPmnIjnmoTlhYXlgLzorrDlvZXmiafooYzmm7TmlrBcclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOa4hemZpOW9k+aciOeahOW3sue7k+eul+iusOW9lVxyXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdFx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXHJcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0XHR0cmFuc2FjdGlvbjoge1xyXG5cdFx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0KVxyXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXHJcblx0XHRcdG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcclxuXHRcdFx0aWYgbW9kdWxlcyBhbmQgIG1vZHVsZXMubGVuZ3RoPjBcclxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cclxuXHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSlcclxuXHJcblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcclxuXHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XHJcblx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZClcclxuXHJcblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XHJcblxyXG5cdG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcylcclxuXHJcblx0bSA9IG1vbWVudCgpXHJcblx0bm93ID0gbS5fZFxyXG5cclxuXHRzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdFxyXG5cclxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXHJcblx0aWYgc3BhY2UuaXNfcGFpZCBpc250IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWVcclxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXHJcblxyXG5cdCMg5pu05pawbW9kdWxlc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3dcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWRcclxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXHJcblx0c3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxyXG5cclxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXHJcblx0aWYgclxyXG5cdFx0Xy5lYWNoIG5ld19tb2R1bGVzLCAobW9kdWxlKS0+XHJcblx0XHRcdG1jbCA9IG5ldyBPYmplY3RcclxuXHRcdFx0bWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKClcclxuXHRcdFx0bWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxyXG5cdFx0XHRtY2wuc3BhY2UgPSBzcGFjZV9pZFxyXG5cdFx0XHRtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCJcclxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxyXG5cdFx0XHRtY2wuY3JlYXRlZCA9IG5vd1xyXG5cdFx0XHRkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbClcclxuXHJcblx0cmV0dXJuIiwiICAgICAgICAgICAgICAgICAgIFxuXG5iaWxsaW5nTWFuYWdlciA9IHt9O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgYmlsbGluZywgY291bnRfZGF5cywgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIGZpcnN0X2RhdGUsIHN0YXJ0X2RhdGUsIHN0YXJ0X2RhdGVfdGltZTtcbiAgY291bnRfZGF5cyA9IDA7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBiaWxsaW5nID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIlxuICB9KTtcbiAgZmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlO1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgc3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxIC0gZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpO1xuICBpZiAoZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSkge1xuXG4gIH0gZWxzZSBpZiAoc3RhcnRfZGF0ZSA8PSBmaXJzdF9kYXRlICYmIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9IGVsc2UgaWYgKGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBcImNvdW50X2RheXNcIjogY291bnRfZGF5c1xuICB9O1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSkge1xuICB2YXIgYXBwX2JpbGwsIGJfbSwgYl9tX2QsIGJpbGwsIGNyZWRpdHMsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIHBheW1lbnRfYmlsbCwgc2V0T2JqO1xuICBsYXN0X2JpbGwgPSBudWxsO1xuICBiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZVxuICB9KTtcbiAgcGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGNyZWF0ZWQ6IHtcbiAgICAgICRsdDogcmVmcmVzaF9kYXRlXG4gICAgfSxcbiAgICBiaWxsaW5nX21vbnRoOiBiaWxsLmJpbGxpbmdfbW9udGhcbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGlmIChwYXltZW50X2JpbGwpIHtcbiAgICBsYXN0X2JpbGwgPSBwYXltZW50X2JpbGw7XG4gIH0gZWxzZSB7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgYXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIGJpbGxpbmdfbW9udGg6IGJfbVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGFwcF9iaWxsKSB7XG4gICAgICBsYXN0X2JpbGwgPSBhcHBfYmlsbDtcbiAgICB9XG4gIH1cbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIGRlYml0cyA9IGJpbGwuZGViaXRzID8gYmlsbC5kZWJpdHMgOiAwLjA7XG4gIGNyZWRpdHMgPSBiaWxsLmNyZWRpdHMgPyBiaWxsLmNyZWRpdHMgOiAwLjA7XG4gIHNldE9iaiA9IG5ldyBPYmplY3Q7XG4gIHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgc2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGU7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IGJpbGwuX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzZXRPYmpcbiAgfSk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBjb3VudF9kYXlzLCBtb2R1bGVfbmFtZSwgbGlzdHByaWNlKSB7XG4gIHZhciBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGRheXNfbnVtYmVyLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBuZXdfYmlsbCwgbm93O1xuICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBkYXlzX251bWJlciA9IGFjY291bnRpbmdfZGF0ZS5nZXREYXRlKCk7XG4gIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgZGViaXRzID0gTnVtYmVyKCgoY291bnRfZGF5cyAvIGRheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpO1xuICBsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgYmlsbGluZ19kYXRlOiB7XG4gICAgICAkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgbGFzdF9iYWxhbmNlID0gbGFzdF9iaWxsICYmIGxhc3RfYmlsbC5iYWxhbmNlID8gbGFzdF9iaWxsLmJhbGFuY2UgOiAwLjA7XG4gIG5vdyA9IG5ldyBEYXRlO1xuICBuZXdfYmlsbCA9IG5ldyBPYmplY3Q7XG4gIG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKTtcbiAgbmV3X2JpbGwuYmlsbGluZ19tb250aCA9IGFjY291bnRpbmdfbW9udGg7XG4gIG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQ7XG4gIG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWQ7XG4gIG5ld19iaWxsLnRyYW5zYWN0aW9uID0gbW9kdWxlX25hbWU7XG4gIG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZTtcbiAgbmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gIG5ld19iaWxsLmRlYml0cyA9IGRlYml0cztcbiAgbmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKTtcbiAgbmV3X2JpbGwuY3JlYXRlZCA9IG5vdztcbiAgbmV3X2JpbGwubW9kaWZpZWQgPSBub3c7XG4gIHJldHVybiBkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLmNvdW50KCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZSA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciByZWZyZXNoX2RhdGVzO1xuICByZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5O1xuICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICBiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgJGluOiBbXCJQYXltZW50XCIsIFwiU2VydmljZSBhZGp1c3RtZW50XCJdXG4gICAgfVxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgY3JlYXRlZDogMVxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihiaWxsKSB7XG4gICAgcmV0dXJuIHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpO1xuICB9KTtcbiAgaWYgKHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBfLmVhY2gocmVmcmVzaF9kYXRlcywgZnVuY3Rpb24ocl9kKSB7XG4gICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpO1xuICAgIH0pO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgbW9kdWxlcywgc3RhcnRfZGF0ZTtcbiAgbW9kdWxlcyA9IG5ldyBBcnJheTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICBlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpO1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICB2YXIgbV9jaGFuZ2Vsb2c7XG4gICAgbV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBtb2R1bGU6IG0ubmFtZSxcbiAgICAgIGNoYW5nZV9kYXRlOiB7XG4gICAgICAgICRsdGU6IGVuZF9kYXRlXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgY3JlYXRlZDogLTFcbiAgICB9KTtcbiAgICBpZiAoIW1fY2hhbmdlbG9nKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwiaW5zdGFsbFwiKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJ1bmluc3RhbGxcIikge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlKSB7XG4gICAgICByZXR1cm4gbW9kdWxlcy5wdXNoKG0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbW9kdWxlc19uYW1lO1xuICBtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHJldHVybiBtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpO1xuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXNfbmFtZTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgYV9tLCBhY2NvdW50aW5nX2RhdGUsIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsIGJfbSwgYl9tX2QsIGJhbGFuY2UsIGRlYml0cywgbW9kdWxlcywgbW9kdWxlc19uYW1lLCBuZXdlc3RfYmlsbCwgcGVyaW9kX3Jlc3VsdCwgcmVtYWluaW5nX21vbnRocywgdXNlcl9jb3VudDtcbiAgaWYgKGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGFjY291bnRpbmdfbW9udGggPT09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICBkZWJpdHMgPSAwO1xuICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgICBiaWxsaW5nX2RhdGU6IGJfbSxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICByZXR1cm4gZGViaXRzICs9IGIuZGViaXRzO1xuICAgIH0pO1xuICAgIG5ld2VzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGJhbGFuY2UgPSBuZXdlc3RfYmlsbC5iYWxhbmNlO1xuICAgIHJlbWFpbmluZ19tb250aHMgPSAwO1xuICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgaWYgKGRlYml0cyA+IDApIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UgLyBkZWJpdHMpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgYmFsYW5jZTogYmFsYW5jZSxcbiAgICAgICAgXCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgIGlmIChwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PT0gMCkge1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgICAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIGRiLmJpbGxpbmdzLnJlbW92ZSh7XG4gICAgICAgIGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAgICRpbjogbW9kdWxlc19uYW1lXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgICAgbW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBfLmVhY2gobW9kdWxlcywgZnVuY3Rpb24obSkge1xuICAgICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgYV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIik7XG4gICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYV9tLCBzcGFjZV9pZCk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gZnVuY3Rpb24oc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpIHtcbiAgdmFyIG0sIG1vZHVsZXMsIG5ld19tb2R1bGVzLCBub3csIHIsIHNwYWNlLCBzcGFjZV91cGRhdGVfb2JqO1xuICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgbW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5O1xuICBuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpO1xuICBtID0gbW9tZW50KCk7XG4gIG5vdyA9IG0uX2Q7XG4gIHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0O1xuICBpZiAoc3BhY2UuaXNfcGFpZCAhPT0gdHJ1ZSkge1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouaXNfcGFpZCA9IHRydWU7XG4gICAgc3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGU7XG4gIH1cbiAgc3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzO1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93O1xuICBzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkX2J5ID0gb3BlcmF0b3JfaWQ7XG4gIHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSk7XG4gIHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gIHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgJHNldDogc3BhY2VfdXBkYXRlX29ialxuICB9KTtcbiAgaWYgKHIpIHtcbiAgICBfLmVhY2gobmV3X21vZHVsZXMsIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgdmFyIG1jbDtcbiAgICAgIG1jbCA9IG5ldyBPYmplY3Q7XG4gICAgICBtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKTtcbiAgICAgIG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZDtcbiAgICAgIG1jbC5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgbWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiO1xuICAgICAgbWNsLm1vZHVsZSA9IG1vZHVsZTtcbiAgICAgIG1jbC5jcmVhdGVkID0gbm93O1xuICAgICAgcmV0dXJuIGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKTtcbiAgICB9KTtcbiAgfVxufTtcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcclxuXHJcbiAgICB2YXIgc2NoZWR1bGUgPSByZXF1aXJlKCdub2RlLXNjaGVkdWxlJyk7XHJcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcclxuICAgIHZhciBydWxlID0gTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcztcclxuXHJcbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgc2NoZWR1bGUuc2NoZWR1bGVKb2IocnVsZSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghZ29fbmV4dClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIGdvX25leHQgPSBmYWxzZTtcclxuXHJcbiAgICAgIGNvbnNvbGUudGltZSgnc3RhdGlzdGljcycpO1xyXG4gICAgICAvLyDml6XmnJ/moLzlvI/ljJYgXHJcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcclxuICAgICAgICB2YXIgZGF0ZWtleSA9IFwiXCIrZGF0ZS5nZXRGdWxsWWVhcigpK1wiLVwiKyhkYXRlLmdldE1vbnRoKCkrMSkrXCItXCIrKGRhdGUuZ2V0RGF0ZSgpKTtcclxuICAgICAgICByZXR1cm4gZGF0ZWtleTtcclxuICAgICAgfTtcclxuICAgICAgLy8g6K6h566X5YmN5LiA5aSp5pe26Ze0XHJcbiAgICAgIHZhciB5ZXN0ZXJEYXkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XHJcbiAgICAgICAgdmFyIGRCZWZvcmUgPSBuZXcgRGF0ZShkTm93LmdldFRpbWUoKSAtIDI0KjM2MDAqMTAwMCk7ICAgLy/lvpfliLDliY3kuIDlpKnnmoTml7bpl7RcclxuICAgICAgICByZXR1cm4gZEJlZm9yZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g57uf6K6h5b2T5pel5pWw5o2uXHJcbiAgICAgIHZhciBkYWlseVN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5p+l6K+i5oC75pWwXHJcbiAgICAgIHZhciBzdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaLpeacieiAheWQjeWtl1xyXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG93bmVyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOiBzcGFjZVtcIm93bmVyXCJdfSk7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBvd25lci5uYW1lO1xyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmnIDov5HnmbvlvZXml6XmnJ9cclxuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBsYXN0TG9nb24gPSAwO1xyXG4gICAgICAgIHZhciBzVXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge2ZpZWxkczoge3VzZXI6IDF9fSk7IFxyXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xyXG4gICAgICAgICAgdmFyIHVzZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6c1VzZXJbXCJ1c2VyXCJdfSk7XHJcbiAgICAgICAgICBpZih1c2VyICYmIChsYXN0TG9nb24gPCB1c2VyLmxhc3RfbG9nb24pKXtcclxuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R5L+u5pS55pel5pyfXHJcbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgb2JqID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBsaW1pdDogMX0pO1xyXG4gICAgICAgIHZhciBvYmpBcnIgPSBvYmouZmV0Y2goKTtcclxuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcclxuICAgICAgICAgIHZhciBtb2QgPSBvYmpBcnJbMF0ubW9kaWZpZWQ7XHJcbiAgICAgICAgICByZXR1cm4gbW9kO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmlofnq6DpmYTku7blpKflsI9cclxuICAgICAgdmFyIHBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XHJcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xyXG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcclxuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOnBvc3RbXCJfaWRcIl19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSkgIFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xyXG4gICAgICB2YXIgZGFpbHlQb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcclxuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xyXG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOaPkuWFpeaVsOaNrlxyXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XHJcbiAgICAgICAgZGIuc3RlZWRvc19zdGF0aXN0aWNzLmluc2VydCh7XHJcbiAgICAgICAgICBzcGFjZTogc3BhY2VbXCJfaWRcIl0sXHJcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXHJcbiAgICAgICAgICBiYWxhbmNlOiBzcGFjZVtcImJhbGFuY2VcIl0sXHJcbiAgICAgICAgICBvd25lcl9uYW1lOiBvd25lck5hbWUoZGIudXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICBzdGVlZG9zOntcclxuICAgICAgICAgICAgdXNlcnM6IHN0YXRpY3NDb3VudChkYi5zcGFjZV91c2Vycywgc3BhY2UpLFxyXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxyXG4gICAgICAgICAgICBsYXN0X2xvZ29uOiBsYXN0TG9nb24oZGIudXNlcnMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHdvcmtmbG93OntcclxuICAgICAgICAgICAgZmxvd3M6IHN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmb3Jtczogc3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZsb3dfcG9zaXRpb25zOiBzdGF0aWNzQ291bnQoZGIuZmxvd19wb3NpdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VzOiBzdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2Zsb3dzOiBkYWlseVN0YXRpY3NDb3VudChkYi5mbG93cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mb3JtczogZGFpbHlTdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNtczoge1xyXG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0czogc3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGNvbW1lbnRzOiBzdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3NpdGVzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9jb21tZW50czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX2NvbW1lbnRzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzX2F0dGFjaG1lbnRzX3NpemU6IGRhaWx5UG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgXHJcbiAgICAgIGNvbnNvbGUudGltZUVuZCgnc3RhdGlzdGljcycpO1xyXG5cclxuICAgICAgZ29fbmV4dCA9IHRydWU7XHJcblxyXG4gICAgfSwgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUuc3RhY2spO1xyXG4gICAgfSkpO1xyXG5cclxuICB9XHJcblxyXG59KVxyXG5cclxuXHJcblxyXG5cclxuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogMVxyXG4gICAgICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cclxuICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YSA9IHtwYXJlbnQ6IHBhcmVudF9pZCwgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSwgc3BhY2U6IHNwYWNlX2lkLCBpbnN0YW5jZTogaW5zdGFuY2VfaWQsIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ119XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgaXNDdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J119LCB7JHNldDoge21ldGFkYXRhOiBtZXRhZGF0YX19KVxyXG4gICAgICAgICAgICAgICAgaSA9IDBcclxuICAgICAgICAgICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjogeyRleGlzdHM6IHRydWV9fSwge3NvcnQ6IHttb2RpZmllZDogLTF9LCBmaWVsZHM6IHtzcGFjZTogMSwgYXR0YWNobWVudHM6IDF9fSkuZm9yRWFjaCAoaW5zKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHNcclxuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZFxyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaCAoYXR0KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGF0dC5oaXN0b3J5c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0Lmhpc3RvcnlzLmZvckVhY2ggKGhpcykgLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpKytcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKVxyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDJcclxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIHN1Lm9yZ2FuaXphdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dfX0pXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMixcbiAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBvcmdhbml6YXRpb25zOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgb3JnYW5pemF0aW9uOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtzdS5vcmdhbml6YXRpb25dXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXInKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDNcclxuICAgICAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCdcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe2VtYWlsOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge3VzZXI6IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS51c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtlbWFpbDogYWRkcmVzc319KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAzLFxuICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICB1c2VyOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGFkZHJlc3MsIHU7XG4gICAgICAgICAgaWYgKHN1LnVzZXIpIHtcbiAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICAgICAgX2lkOiBzdS51c2VyXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgICAgIGVtYWlsczogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcykpIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBlbWFpbDogYWRkcmVzc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMyBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogNFxyXG4gICAgICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubydcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA0LFxuICAgIG5hbWU6ICfnu5lvcmdhbml6YXRpb25z6KGo6K6+572uc29ydF9ubycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA0IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIHNvcnRfbm86IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc29ydF9ubzogMTAwXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgbXVsdGk6IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNCBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNaWdyYXRpb25zLmFkZFxyXG5cdFx0dmVyc2lvbjogNVxyXG5cdFx0bmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0XHR0cnlcclxuXHJcblx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2ggKHN1KS0+XHJcblx0XHRcdFx0XHRpZiBub3Qgc3Uub3JnYW5pemF0aW9uc1xyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0XHRcdGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoIGlzIDFcclxuXHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXHJcblx0XHRcdFx0XHRcdFx0cm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe3NwYWNlOiBzdS5zcGFjZSwgcGFyZW50OiBudWxsfSlcclxuXHRcdFx0XHRcdFx0XHRpZiByb290X29yZ1xyXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIHJcclxuXHRcdFx0XHRcdFx0XHRcdFx0cm9vdF9vcmcudXBkYXRlVXNlcnMoKVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Igc3UuX2lkXHJcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxyXG5cdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMgPSBbXVxyXG5cdFx0XHRcdFx0XHRzdS5vcmdhbml6YXRpb25zLmZvckVhY2ggKG8pLT5cclxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzLnB1c2gobylcclxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdFx0XHRuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpXHJcblx0XHRcdFx0XHRcdFx0aWYgbmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLCBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdfX0pXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJ1xyXG5cdFx0ZG93bjogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA1LFxuICAgIG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIuc3BhY2VfdXNlcnMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgY2hlY2tfY291bnQsIG5ld19vcmdfaWRzLCByLCByZW1vdmVkX29yZ19pZHMsIHJvb3Rfb3JnO1xuICAgICAgICAgIGlmICghc3Uub3JnYW5pemF0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KCk7XG4gICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgcm9vdF9vcmcgPSBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNwYWNlOiBzdS5zcGFjZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGlmIChyb290X29yZykge1xuICAgICAgICAgICAgICAgIHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiByb290X29yZy5faWRcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAocikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKHN1Ll9pZCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgcmVtb3ZlZF9vcmdfaWRzID0gW107XG4gICAgICAgICAgICBzdS5vcmdhbml6YXRpb25zLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpO1xuICAgICAgICAgICAgICBpZiAoY2hlY2tfY291bnQgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVtb3ZlZF9vcmdfaWRzLnB1c2gobyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcyk7XG4gICAgICAgICAgICAgIGlmIChuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IG5ld19vcmdfaWRzWzBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDUgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDZcclxuXHRcdG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnXHJcblx0XHR1cDogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiB1cCdcclxuXHRcdFx0Y29uc29sZS50aW1lICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdCMg5riF56m6bW9kdWxlc+ihqFxyXG5cdFx0XHRcdGRiLm1vZHVsZXMucmVtb3ZlKHt9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDJcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDE4XHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiA0MFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cclxuXHRcdFx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XHJcblx0XHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdFx0c2V0X29iaiA9IHt9XHJcblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHRcdFx0XHRcdFx0YmFsYW5jZSA9IHMuYmFsYW5jZVxyXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IDBcclxuXHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxyXG5cdFx0XHRcdFx0XHRcdFx0bW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtuYW1lOiBwbX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiBtb2R1bGUgYW5kIG1vZHVsZS5saXN0cHJpY2VcclxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UvKGxpc3RwcmljZXMqdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgYmFsYW5jZSA8PSAwXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKVxyXG5cdFx0XHRcdFx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzLl9pZH0sIHskc2V0OiBzZXRfb2JqfSlcclxuXHRcdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Iocy5faWQpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImJpbGxpbmcgdXBncmFkZVwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcgdXBncmFkZSdcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNixcbiAgICBuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgc3RhcnRfZGF0ZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5tb2R1bGVzLnJlbW92ZSh7fSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+WfuuehgOeJiFwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDEuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMlxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMy4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAxOFxuICAgICAgICB9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogNi4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiA0MFxuICAgICAgICB9KTtcbiAgICAgICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgIGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgICBpc19wYWlkOiB0cnVlLFxuICAgICAgICAgIHVzZXJfbGltaXQ6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtb2R1bGVzOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKHMpIHtcbiAgICAgICAgICB2YXIgYmFsYW5jZSwgZSwgZW5kX2RhdGUsIGxpc3RwcmljZXMsIG1vbnRocywgc2V0X29iaiwgdXNlcl9jb3VudDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgc2V0X29iaiA9IHt9O1xuICAgICAgICAgICAgdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICAgICAgICBzcGFjZTogcy5faWQsXG4gICAgICAgICAgICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgICAgICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgICAgICBzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICAgICAgICAgICAgYmFsYW5jZSA9IHMuYmFsYW5jZTtcbiAgICAgICAgICAgIGlmIChiYWxhbmNlID4gMCkge1xuICAgICAgICAgICAgICBtb250aHMgPSAwO1xuICAgICAgICAgICAgICBsaXN0cHJpY2VzID0gMDtcbiAgICAgICAgICAgICAgXy5lYWNoKHMubW9kdWxlcywgZnVuY3Rpb24ocG0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbW9kdWxlO1xuICAgICAgICAgICAgICAgIG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBwbVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChtb2R1bGUgJiYgbW9kdWxlLmxpc3RwcmljZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZSAvIChsaXN0cHJpY2VzICogdXNlcl9jb3VudCkpLnRvRml4ZWQoKSkgKyAxO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgICBlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpICsgbW9udGhzKTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGJhbGFuY2UgPD0gMCkge1xuICAgICAgICAgICAgICBzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlO1xuICAgICAgICAgICAgICBzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpO1xuICAgICAgICAgICAgc2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcyk7XG4gICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICBfaWQ6IHMuX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICRzZXQ6IHNldF9vYmpcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCIpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzLl9pZCk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHNldF9vYmopO1xuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgdXBncmFkZVwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG4gICAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMgPSB7XHJcbiAgICAgICAgICAgIFwiY3JlYXRvclwiOiB7XHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwid29ya2Zsb3dcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XHJcbiAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcclxuICAgICAgICB9XHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy53b3JrZmxvd1xyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3cgPSB7XHJcbiAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcclxuICAgICAgICB9XHJcblxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmxcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTFxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3cudXJsXHJcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmwgPSByb290VVJMIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByb290VVJMO1xuICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzID0ge1xuICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgfSxcbiAgICAgIFwid29ya2Zsb3dcIjoge1xuICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IgPSB7XG4gICAgICBcInVybFwiOiByb290VVJMXG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy53b3JrZmxvdykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy53b3JrZmxvdyA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTDtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmwpIHtcbiAgICByZXR1cm4gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93LnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgKCktPlxyXG5cdG5ldyBUYWJ1bGFyLlRhYmxlXHJcblx0XHRuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXHJcblx0XHRjb2xsZWN0aW9uOiBkYi5hcHBzLFxyXG5cdFx0Y29sdW1uczogW1xyXG5cdFx0XHR7XHJcblx0XHRcdFx0ZGF0YTogXCJuYW1lXCJcclxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXHJcblx0XHRcdH1cclxuXHRcdF1cclxuXHRcdGRvbTogXCJ0cFwiXHJcblx0XHRleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl1cclxuXHRcdGxlbmd0aENoYW5nZTogZmFsc2VcclxuXHRcdG9yZGVyaW5nOiBmYWxzZVxyXG5cdFx0cGFnZUxlbmd0aDogMTBcclxuXHRcdGluZm86IGZhbHNlXHJcblx0XHRzZWFyY2hpbmc6IHRydWVcclxuXHRcdGF1dG9XaWR0aDogdHJ1ZVxyXG5cdFx0Y2hhbmdlU2VsZWN0b3I6IChzZWxlY3RvciwgdXNlcklkKSAtPlxyXG5cdFx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRzcGFjZSA9IHNlbGVjdG9yLnNwYWNlXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdGlmIHNlbGVjdG9yPy4kYW5kPy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF1cclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0XHRyZXR1cm4gc2VsZWN0b3IiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUYWJ1bGFyLlRhYmxlKHtcbiAgICBuYW1lOiBcImN1c3RvbWl6ZV9hcHBzXCIsXG4gICAgY29sbGVjdGlvbjogZGIuYXBwcyxcbiAgICBjb2x1bW5zOiBbXG4gICAgICB7XG4gICAgICAgIGRhdGE6IFwibmFtZVwiLFxuICAgICAgICBvcmRlcmFibGU6IGZhbHNlXG4gICAgICB9XG4gICAgXSxcbiAgICBkb206IFwidHBcIixcbiAgICBleHRyYUZpZWxkczogW1wiX2lkXCIsIFwic3BhY2VcIl0sXG4gICAgbGVuZ3RoQ2hhbmdlOiBmYWxzZSxcbiAgICBvcmRlcmluZzogZmFsc2UsXG4gICAgcGFnZUxlbmd0aDogMTAsXG4gICAgaW5mbzogZmFsc2UsXG4gICAgc2VhcmNoaW5nOiB0cnVlLFxuICAgIGF1dG9XaWR0aDogdHJ1ZSxcbiAgICBjaGFuZ2VTZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IsIHVzZXJJZCkge1xuICAgICAgdmFyIHJlZiwgc3BhY2U7XG4gICAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHNwYWNlID0gc2VsZWN0b3Iuc3BhY2U7XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIGlmICgoc2VsZWN0b3IgIT0gbnVsbCA/IChyZWYgPSBzZWxlY3Rvci4kYW5kKSAhPSBudWxsID8gcmVmLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgICAgc3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoIXNwYWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNlbGVjdG9yO1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==
