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
  var _Apps, _Dashboards, assigned_menus, authToken, e, lng, objectsLayout, permissions, ref, result, space, spaceId, userId, userSession;

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
  console.time('license1');

  try {
    result.license = steedosLicense.getLicense(spaceId);
  } catch (error) {
    e = error;
    console.error("getLicense", e.message);
  }

  console.timeEnd('license1');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2Jvb3RzdHJhcC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRLZXlWYWx1ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvZ2V0X3NwYWNlX3VzZXJfY291bnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb3J0QnlOYW1lIiwibG9jYWxlIiwiU3RlZWRvcyIsInNvcnQiLCJwMSIsInAyIiwicDFfc29ydF9ubyIsInNvcnRfbm8iLCJwMl9zb3J0X25vIiwibmFtZSIsImxvY2FsZUNvbXBhcmUiLCJnZXRQcm9wZXJ0eSIsImsiLCJmb3JFYWNoIiwidCIsIm0iLCJwdXNoIiwicmVtb3ZlIiwiZnJvbSIsInRvIiwicmVzdCIsInNsaWNlIiwibGVuZ3RoIiwiYXBwbHkiLCJmaWx0ZXJQcm9wZXJ0eSIsImgiLCJsIiwiZyIsImQiLCJpbmNsdWRlcyIsIk9iamVjdCIsInVuZGVmaW5lZCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJyIiwiQ29va2llcyIsImNyeXB0byIsIm1peGluIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJyZWYiLCJyZWYxIiwicGhvbmUiLCJudW1iZXJUb1N0cmluZyIsIm51bWJlciIsInNjYWxlIiwibm90VGhvdXNhbmRzIiwicmVnIiwidG9TdHJpbmciLCJOdW1iZXIiLCJ0b0ZpeGVkIiwibWF0Y2giLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImF2YXRhclVybCIsImJhY2tncm91bmQiLCJyZWYyIiwidXJsIiwibG9nZ2luZ0luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIiQiLCJjc3MiLCJhYnNvbHV0ZVVybCIsImFkbWluIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJpc0NvcmRvdmEiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwiZXJyb3IxIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwic3BhY2VJZCIsImVuZF9kYXRlIiwibWluX21vbnRocyIsInNwYWNlIiwiaXNTcGFjZUFkbWluIiwic3BhY2VzIiwiaXNfcGFpZCIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlZjMiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsInNwbGl0Iiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJmdW5jIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwiYXV0b3J1biIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImdldFJlbGF0aXZlVXJsIiwiZmlsZSIsIndyaXRlIiwiaXRlbSIsImNoYXJDb2RlQXQiLCJzdWJzdHIiLCJ0b1VwcGVyQ2FzZSIsInRvVVRDU3RyaW5nIiwicmVhZFN0cmVhbSIsInBpcGUiLCJwdWJsaXNoIiwicmVhZHkiLCJoYW5kbGUiLCJoYW5kbGUyIiwib2JzZXJ2ZVNwYWNlcyIsInNlbGYiLCJzdXMiLCJ1c2VyU3BhY2VzIiwidXNlcl9hY2NlcHRlZCIsInN1Iiwib2JzZXJ2ZSIsImFkZGVkIiwiZG9jIiwicmVtb3ZlZCIsIm9sZERvYyIsIndpdGhvdXQiLCJzdG9wIiwiY2hhbmdlZCIsIm5ld0RvYyIsIm9uU3RvcCIsImVuYWJsZV9yZWdpc3RlciIsIl9nZXRMb2NhbGUiLCJjbG9uZSIsImdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCIsInN0ZWVkb3NBdXRoIiwic3RlZWRvc0NvcmUiLCJzdGVlZG9zSTE4biIsInN0ZWVkb3NMaWNlbnNlIiwidG9Mb2NhbGVMb3dlckNhc2UiLCJzcGFjZVVzZXIiLCJwcm9maWxlcyIsIl9BcHBzIiwiX0Rhc2hib2FyZHMiLCJhc3NpZ25lZF9tZW51cyIsImxuZyIsIm9iamVjdHNMYXlvdXQiLCJwZXJtaXNzaW9ucyIsInVzZXJTZXNzaW9uIiwid3JhcEFzeW5jIiwiY2IiLCJnZXRTZXNzaW9uIiwidGhlbiIsInJlc29sdmUiLCJyZWplY3QiLCJnZXRBbGxQZXJtaXNzaW9ucyIsInRyYW5zbGF0aW9uT2JqZWN0cyIsIkFwcHMiLCJkYXNoYm9hcmRzIiwiRGFzaGJvYXJkcyIsIm9iamVjdF9saXN0dmlld3MiLCJvYmplY3Rfd29ya2Zsb3dzIiwidGltZSIsImxpY2Vuc2UiLCJnZXRMaWNlbnNlIiwidGltZUVuZCIsImdldFVzZXJPYmplY3RQZXJtaXNzaW9uIiwic3RlZWRvc1NjaGVtYSIsImdldERhdGFTb3VyY2VzIiwiZGF0YXNvdXJjZSIsImRhdGFzb3VyY2VPYmplY3RzIiwiZ2V0T2JqZWN0cyIsIl9vYmoiLCJjb252ZXJ0T2JqZWN0IiwidG9Db25maWciLCJkYXRhYmFzZV9uYW1lIiwiZ2V0QXBwc0NvbmZpZyIsImdldERhc2hib2FyZHNDb25maWciLCJfZGJpZCIsInRyYW5zbGF0aW9uQXBwcyIsInRyYW5zbGF0aW9uTWVudXMiLCJwbHVnaW5zIiwiZ2V0UGx1Z2lucyIsIm9iamVjdExheW91dCIsIl9maWVsZHMiLCJfb2JqZWN0IiwiX2l0ZW0iLCJyZWY0IiwicmVmNSIsInJlZjYiLCJyZWY3IiwiZmllbGQiLCJoYXMiLCJncm91cCIsInJlcXVpcmVkIiwicmVhZG9ubHkiLCJkaXNhYmxlZCIsImFsbG93X2FjdGlvbnMiLCJhY3Rpb25zIiwib24iLCJjaHVuayIsImJpbmRFbnZpcm9ubWVudCIsInBhcnNlciIsInhtbDJqcyIsIlBhcnNlciIsImV4cGxpY2l0QXJyYXkiLCJleHBsaWNpdFJvb3QiLCJwYXJzZVN0cmluZyIsImVyciIsIldYUGF5IiwiYXR0YWNoIiwiYnByIiwiY29kZV91cmxfaWQiLCJzaWduIiwid3hwYXkiLCJhcHBpZCIsIm1jaF9pZCIsInBhcnRuZXJfa2V5IiwiSlNPTiIsInBhcnNlIiwidG90YWxfZmVlIiwiYmlsbGluZ01hbmFnZXIiLCJzcGVjaWFsX3BheSIsInVzZXJfY291bnQiLCJsb2ciLCJnZXRfY29udGFjdHNfbGltaXQiLCJmcm9tcyIsImZyb21zQ2hpbGRyZW4iLCJmcm9tc0NoaWxkcmVuSWRzIiwiaXNMaW1pdCIsImxlbjEiLCJsaW1pdCIsImxpbWl0cyIsIm15TGl0bWl0T3JnSWRzIiwibXlPcmdJZCIsIm15T3JnSWRzIiwibXlPcmdzIiwib3V0c2lkZV9vcmdhbml6YXRpb25zIiwic2V0dGluZyIsInRlbXBJc0xpbWl0IiwidG9PcmdzIiwidG9zIiwiU3RyaW5nIiwic3BhY2Vfc2V0dGluZ3MiLCJ2YWx1ZXMiLCJpbnRlcnNlY3Rpb24iLCJzZXRLZXlWYWx1ZSIsImluc2VydCIsImJpbGxpbmdfc2V0dGxldXAiLCJhY2NvdW50aW5nX21vbnRoIiwiRW1haWwiLCJzIiwiY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCIsIlBhY2thZ2UiLCJzZW5kIiwic3RyaW5naWZ5Iiwic2V0VXNlcm5hbWUiLCJpbnZpdGVfc3RhdGUiLCJiaWxsaW5nX3JlY2hhcmdlIiwibmV3X2lkIiwibW9kdWxlX25hbWVzIiwibGlzdHByaWNlcyIsIm9uZV9tb250aF95dWFuIiwib3JkZXJfYm9keSIsInJlc3VsdF9vYmoiLCJzcGFjZV91c2VyX2NvdW50IiwibGlzdHByaWNlX3JtYiIsIm5hbWVfemgiLCJjcmVhdGVVbmlmaWVkT3JkZXIiLCJqb2luIiwib3V0X3RyYWRlX25vIiwibW9tZW50IiwiZm9ybWF0Iiwic3BiaWxsX2NyZWF0ZV9pcCIsIm5vdGlmeV91cmwiLCJ0cmFkZV90eXBlIiwicHJvZHVjdF9pZCIsImluZm8iLCJnZXRfc3BhY2VfdXNlcl9jb3VudCIsInVzZXJfY291bnRfaW5mbyIsInRvdGFsX3VzZXJfY291bnQiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3JlYXRlX3NlY3JldCIsInJlbW92ZV9zZWNyZXQiLCJ0b2tlbiIsImN1clNwYWNlVXNlciIsIm93cyIsImZsb3dfaWQiLCJmbCIsInBlcm1zIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY3VycmVudFVzZXIiLCJsYW5nIiwidXNlckNQIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJtb2JpbGVfdmVyaWZpZWQiLCJTTVNRdWV1ZSIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJjb3VudF9kYXlzIiwiZW5kX2RhdGVfdGltZSIsInN0YXJ0X2RhdGVfdGltZSIsImJpbGxpbmdzIiwidHJhbnNhY3Rpb24iLCJiaWxsaW5nX2RhdGUiLCJnZXREYXRlIiwicmVmcmVzaF9iYWxhbmNlIiwicmVmcmVzaF9kYXRlIiwiYXBwX2JpbGwiLCJiX20iLCJiX21fZCIsImJpbGwiLCJjcmVkaXRzIiwiZGViaXRzIiwibGFzdF9iYWxhbmNlIiwibGFzdF9iaWxsIiwicGF5bWVudF9iaWxsIiwic2V0T2JqIiwiJGx0IiwiYmlsbGluZ19tb250aCIsImJhbGFuY2UiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJwYXJlbnQiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQkksU0FBTyxFQUFFLFFBRk87QUFHaEIsWUFBVSxTQUhNO0FBSWhCQyxRQUFNLEVBQUUsUUFKUTtBQUtoQixnQ0FBOEI7QUFMZCxDQUFELEVBTWIsY0FOYSxDQUFoQjs7QUFRQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFB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QVI7QUFGRjtBQ1FJOztBRExKLFdBQU95SixLQUFQO0FBQ0MsZUFBTztBQUFDWCxlQUFLLENBQUM7QUFBUCxTQUFQO0FDU0c7O0FEUkosYUFBT2tSLFFBQVA7QUF6QkQ7QUFBQSxHQURELENDQUM7QURERixHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnNcclxufSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcclxuY2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXHJcblx0Y29va2llczogXCJeMC42LjJcIixcclxuXHRcInhtbDJqc1wiOiBcIl4wLjQuMTlcIixcclxuXHRta2RpcnA6IFwiXjAuMy41XCIsXHJcblx0XCJ1cmwtc2VhcmNoLXBhcmFtcy1wb2x5ZmlsbFwiOiBcIl43LjAuMFwiLFxyXG59LCAnc3RlZWRvczpiYXNlJyk7XHJcblxyXG5pZiAoTWV0ZW9yLnNldHRpbmdzICYmIE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nKSB7XHJcblx0Y2hlY2tOcG1WZXJzaW9ucyh7XHJcblx0XHRcIndlaXhpbi1wYXlcIjogXCJeMS4xLjdcIlxyXG5cdH0sICdzdGVlZG9zOmJhc2UnKTtcclxufSIsIkFycmF5LnByb3RvdHlwZS5zb3J0QnlOYW1lID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgaWYgKCF0aGlzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYoIWxvY2FsZSl7XHJcbiAgICAgICAgbG9jYWxlID0gU3RlZWRvcy5sb2NhbGUoKVxyXG4gICAgfVxyXG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcclxuXHRcdHZhciBwMV9zb3J0X25vID0gcDEuc29ydF9ubyB8fCAwO1xyXG5cdFx0dmFyIHAyX3NvcnRfbm8gPSBwMi5zb3J0X25vIHx8IDA7XHJcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xyXG4gICAgICAgICAgICByZXR1cm4gcDFfc29ydF9ubyA+IHAyX3NvcnRfbm8gPyAtMSA6IDFcclxuICAgICAgICB9ZWxzZXtcclxuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xyXG5cdFx0fVxyXG4gICAgfSk7XHJcbn07XHJcblxyXG5cclxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcclxuICAgIHZhciB2ID0gbmV3IEFycmF5KCk7XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcclxuICAgICAgICB2LnB1c2gobSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB2O1xyXG59XHJcblxyXG4vKlxyXG4gKiDmt7vliqBBcnJheeeahHJlbW92ZeWHveaVsFxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xyXG4gICAgaWYgKGZyb20gPCAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdmFyIHJlc3QgPSB0aGlzLnNsaWNlKCh0byB8fCBmcm9tKSArIDEgfHwgdGhpcy5sZW5ndGgpO1xyXG4gICAgdGhpcy5sZW5ndGggPSBmcm9tIDwgMCA/IHRoaXMubGVuZ3RoICsgZnJvbSA6IGZyb207XHJcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xyXG59O1xyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcclxuICogcmV0dXJuIOespuWQiOadoeS7tueahOWvueixoUFycmF5XHJcbiAqL1xyXG5BcnJheS5wcm90b3R5cGUuZmlsdGVyUHJvcGVydHkgPSBmdW5jdGlvbiAoaCwgbCkge1xyXG4gICAgdmFyIGcgPSBbXTtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xyXG4gICAgICAgIHZhciBkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiaWRcIiBpbiBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJpZFwiXTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbSA9IG1bXCJfaWRcIl07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZCkge1xyXG4gICAgICAgICAgICBnLnB1c2godCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZztcclxufVxyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoTov4fmu6TlmahcclxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLmZpbmRQcm9wZXJ0eUJ5UEsgPSBmdW5jdGlvbiAoaCwgbCkge1xyXG4gICAgdmFyIHIgPSBudWxsO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtoXSA6IG51bGw7XHJcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcclxuICAgICAgICBpZiAobSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIGQgPSBtLmluY2x1ZGVzKGwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbSA9PSBsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgciA9IHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcjtcclxufSIsIlN0ZWVkb3MgPVxyXG5cdHNldHRpbmdzOiB7fVxyXG5cdGRiOiBkYlxyXG5cdHN1YnM6IHt9XHJcblx0aXNQaG9uZUVuYWJsZWQ6IC0+XHJcblx0XHRyZXR1cm4gISFNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8ucGhvbmVcclxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcyktPlxyXG5cdFx0aWYgdHlwZW9mIG51bWJlciA9PSBcIm51bWJlclwiXHJcblx0XHRcdG51bWJlciA9IG51bWJlci50b1N0cmluZygpXHJcblxyXG5cdFx0aWYgIW51bWJlclxyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblxyXG5cdFx0aWYgbnVtYmVyICE9IFwiTmFOXCJcclxuXHRcdFx0aWYgc2NhbGUgfHwgc2NhbGUgPT0gMFxyXG5cdFx0XHRcdG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpXHJcblx0XHRcdHVubGVzcyBub3RUaG91c2FuZHNcclxuXHRcdFx0XHRpZiAhKHNjYWxlIHx8IHNjYWxlID09IDApXHJcblx0XHRcdFx0XHQjIOayoeWumuS5iXNjYWxl5pe277yM5qC55o2u5bCP5pWw54K55L2N572u566X5Ye6c2NhbGXlgLxcclxuXHRcdFx0XHRcdHNjYWxlID0gbnVtYmVyLm1hdGNoKC9cXC4oXFxkKykvKT9bMV0/Lmxlbmd0aFxyXG5cdFx0XHRcdFx0dW5sZXNzIHNjYWxlXHJcblx0XHRcdFx0XHRcdHNjYWxlID0gMFxyXG5cdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZ1xyXG5cdFx0XHRcdGlmIHNjYWxlID09IDBcclxuXHRcdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZ1xyXG5cdFx0XHRcdG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpXHJcblx0XHRcdHJldHVybiBudW1iZXJcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIFwiXCJcclxuXHR2YWxpSnF1ZXJ5U3ltYm9sczogKHN0ciktPlxyXG5cdFx0IyByZWcgPSAvXlteIVwiIyQlJicoKSorLC4vOjs8PT4/QFtcXF1eYHt8fX5dKyQvZ1xyXG5cdFx0cmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKVxyXG5cdFx0cmV0dXJuIHJlZy50ZXN0KHN0cilcclxuXHJcbiMjI1xyXG4jIEtpY2sgb2ZmIHRoZSBnbG9iYWwgbmFtZXNwYWNlIGZvciBTdGVlZG9zLlxyXG4jIEBuYW1lc3BhY2UgU3RlZWRvc1xyXG4jIyNcclxuXHJcblN0ZWVkb3MuZ2V0SGVscFVybCA9IChsb2NhbGUpLT5cclxuXHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxyXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblxyXG5cdFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gKCktPlxyXG5cdFx0c3dhbCh7dGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSwgaHRtbDogdHJ1ZSwgdHlwZTpcIndhcm5pbmdcIiwgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKX0pO1xyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5OlwiYmdfYm9keVwifSlcclxuXHRcdGlmIGFjY291bnRCZ0JvZHlcclxuXHRcdFx0cmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gKGFjY291bnRCZ0JvZHlWYWx1ZSxpc05lZWRUb0xvY2FsKS0+XHJcblx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlID0ge31cclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKVxyXG5cdFx0XHRhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpXHJcblxyXG5cdFx0dXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybFxyXG5cdFx0YXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclxyXG5cdFx0aWYgYWNjb3VudEJnQm9keVZhbHVlLnVybFxyXG5cdFx0XHRpZiB1cmwgPT0gYXZhdGFyXHJcblx0XHRcdFx0YXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXJcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYXZhdGFyVXJsKX0pXCJcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpfSlcIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRiYWNrZ3JvdW5kID0gTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LmFkbWluPy5iYWNrZ3JvdW5kXHJcblx0XHRcdGlmIGJhY2tncm91bmRcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCJcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCl9KVwiXHJcblxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLGF2YXRhcilcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJza2luXCJ9KVxyXG5cdFx0aWYgYWNjb3VudFNraW5cclxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwiem9vbVwifSlcclxuXHRcdGlmIGFjY291bnRab29tXHJcblx0XHRcdHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gKGFjY291bnRab29tVmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSB7fVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cdFx0JChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xyXG5cdFx0em9vbU5hbWUgPSBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplXHJcblx0XHR1bmxlc3Mgem9vbU5hbWVcclxuXHRcdFx0em9vbU5hbWUgPSBcImxhcmdlXCJcclxuXHRcdFx0em9vbVNpemUgPSAxLjJcclxuXHRcdGlmIHpvb21OYW1lICYmICFTZXNzaW9uLmdldChcImluc3RhbmNlUHJpbnRcIilcclxuXHRcdFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRcdCMgaWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHQjIFx0aWYgYWNjb3VudFpvb21WYWx1ZS5zaXplID09IFwiMVwiXHJcblx0XHRcdCMgXHRcdCMgbm9kZS13ZWJraXTkuK1zaXpl5Li6MOaJjeihqOekujEwMCVcclxuXHRcdFx0IyBcdFx0em9vbVNpemUgPSAwXHJcblx0XHRcdCMgXHRudy5XaW5kb3cuZ2V0KCkuem9vbUxldmVsID0gTnVtYmVyLnBhcnNlRmxvYXQoem9vbVNpemUpXHJcblx0XHRcdCMgZWxzZVxyXG5cdFx0XHQjIFx0JChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLSN7em9vbU5hbWV9XCIpXHJcblx0XHRpZiBpc05lZWRUb0xvY2FsXHJcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG5cdFx0XHRcdCMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2U3RlZWRvcy51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG5cdFx0XHRcdHJldHVyblxyXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cclxuXHRcdFx0IyDnmbvlvZXnlYzpnaLkuI3orr7nva5sb2NhbFN0b3JhZ2XvvIzlm6DkuLrnmbvlvZXnlYzpnaJhY2NvdW50Wm9vbVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdGlmIFN0ZWVkb3MudXNlcklkKClcclxuXHRcdFx0XHRpZiBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIsYWNjb3VudFpvb21WYWx1ZS5uYW1lKVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIixhY2NvdW50Wm9vbVZhbHVlLnNpemUpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXHJcblxyXG5cdFN0ZWVkb3Muc2hvd0hlbHAgPSAodXJsKS0+XHJcblx0XHRsb2NhbGUgPSBTdGVlZG9zLmdldExvY2FsZSgpXHJcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxyXG5cclxuXHRcdHVybCA9IHVybCB8fCBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxyXG5cclxuXHRcdHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJylcclxuXHJcblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHJcblx0XHRsaW5rZXIgPSBcIj9cIlxyXG5cclxuXHRcdGlmIHVybC5pbmRleE9mKFwiP1wiKSA+IC0xXHJcblx0XHRcdGxpbmtlciA9IFwiJlwiXHJcblxyXG5cdFx0cmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdGF1dGhUb2tlbiA9IHt9O1xyXG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXHJcblx0XHRhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XHJcblx0XHRhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xyXG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXHJcblxyXG5cdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IChhcHBfaWQpLT5cclxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0dXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCB1cmxcclxuXHJcblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcclxuXHJcblx0U3RlZWRvcy5vcGVuVXJsV2l0aElFID0gKHVybCktPlxyXG5cdFx0aWYgdXJsXHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcclxuXHRcdFx0XHRvcGVuX3VybCA9IHVybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblxyXG5cclxuXHRTdGVlZG9zLm9wZW5BcHAgPSAoYXBwX2lkKS0+XHJcblx0XHRpZiAhTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHRcdFN0ZWVkb3MucmVkaXJlY3RUb1NpZ25JbigpXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblxyXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuXHRcdGlmICFhcHBcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9cIilcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0IyBjcmVhdG9yU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy53ZWJzZXJ2aWNlcz8uY3JlYXRvclxyXG5cdFx0IyBpZiBhcHAuX2lkID09IFwiYWRtaW5cIiBhbmQgY3JlYXRvclNldHRpbmdzPy5zdGF0dXMgPT0gXCJhY3RpdmVcIlxyXG5cdFx0IyBcdHVybCA9IGNyZWF0b3JTZXR0aW5ncy51cmxcclxuXHRcdCMgXHRyZWcgPSAvXFwvJC9cclxuXHRcdCMgXHR1bmxlc3MgcmVnLnRlc3QgdXJsXHJcblx0XHQjIFx0XHR1cmwgKz0gXCIvXCJcclxuXHRcdCMgXHR1cmwgPSBcIiN7dXJsfWFwcC9hZG1pblwiXHJcblx0XHQjIFx0U3RlZWRvcy5vcGVuV2luZG93KHVybClcclxuXHRcdCMgXHRyZXR1cm5cclxuXHJcblx0XHRvbl9jbGljayA9IGFwcC5vbl9jbGlja1xyXG5cdFx0aWYgYXBwLmlzX3VzZV9pZVxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXHJcblx0XHRcdFx0aWYgb25fY2xpY2tcclxuXHRcdFx0XHRcdHBhdGggPSBcImFwaS9hcHAvc3NvLyN7YXBwX2lkfT9hdXRoVG9rZW49I3tBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpfSZ1c2VySWQ9I3tNZXRlb3IudXNlcklkKCl9XCJcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gYXBwX2lkXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsXHJcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXHJcblx0XHRcdFx0ZXhlYyBjbWQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIC0+XHJcblx0XHRcdFx0XHRpZiBlcnJvclxyXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3JcclxuXHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHJcblx0XHRlbHNlIGlmIGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKVxyXG5cdFx0XHRGbG93Um91dGVyLmdvKGFwcC51cmwpXHJcblxyXG5cdFx0ZWxzZSBpZiBhcHAuaXNfdXNlX2lmcmFtZVxyXG5cdFx0XHRpZiBhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpKVxyXG5cdFx0XHRlbHNlIGlmIFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpXHJcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvI3thcHAuX2lkfVwiKVxyXG5cclxuXHRcdGVsc2UgaWYgb25fY2xpY2tcclxuXHRcdFx0IyDov5nph4zmiafooYznmoTmmK/kuIDkuKrkuI3luKblj4LmlbDnmoTpl63ljIXlh73mlbDvvIznlKjmnaXpgb/lhY3lj5jph4/msaHmn5NcclxuXHRcdFx0ZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7I3tvbl9jbGlja319KSgpXCJcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0ZXZhbChldmFsRnVuU3RyaW5nKVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0IyBqdXN0IGNvbnNvbGUgdGhlIGVycm9yIHdoZW4gY2F0Y2ggZXJyb3JcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiY2F0Y2ggc29tZSBlcnJvciB3aGVuIGV2YWwgdGhlIG9uX2NsaWNrIHNjcmlwdCBmb3IgYXBwIGxpbms6XCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiI3tlLm1lc3NhZ2V9XFxyXFxuI3tlLnN0YWNrfVwiXHJcblx0XHRlbHNlXHJcblx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrXHJcblx0XHRcdCMg6ZyA6KaB6YCJ5Lit5b2T5YmNYXBw5pe277yMb25fY2xpY2vlh73mlbDph4zopoHljZXni6zliqDkuIpTZXNzaW9uLnNldChcImN1cnJlbnRfYXBwX2lkXCIsIGFwcF9pZClcclxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblxyXG5cdFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSAoc3BhY2VJZCktPlxyXG5cdFx0dW5sZXNzIHNwYWNlSWRcclxuXHRcdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXHJcblx0XHRtaW5fbW9udGhzID0gMVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRtaW5fbW9udGhzID0gM1xyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxyXG5cdFx0ZW5kX2RhdGUgPSBzcGFjZT8uZW5kX2RhdGVcclxuXHRcdGlmIHNwYWNlPy5pc19wYWlkIGFuZCBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXHJcblx0XHRcdCMg5o+Q56S655So5oi35L2Z6aKd5LiN6LazXHJcblx0XHRcdHRvYXN0ci5lcnJvciB0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIilcclxuXHJcblx0U3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9ICgpLT5cclxuXHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnXHJcblx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdHdoZW4gJ25vcm1hbCdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC0xMlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdG9mZnNldCA9IDc1XHJcblx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMTk5XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDlcclxuXHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMjZcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXHJcblx0XHRcdFx0XHRpZiBTdGVlZG9zLmRldGVjdElFKClcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gMzAzXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDUzXHJcblxyXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcclxuXHRcdFx0JChcIi5tb2RhbFwiKS5lYWNoIC0+XHJcblx0XHRcdFx0aGVhZGVySGVpZ2h0ID0gMFxyXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcclxuXHRcdFx0XHR0b3RhbEhlaWdodCA9IDBcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHRcdFx0XHQkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoIC0+XHJcblx0XHRcdFx0XHRmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcclxuXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHRcclxuXHRcdFx0XHRoZWlnaHQgPSAkKFwiYm9keVwiKS5pbm5lckhlaWdodCgpIC0gdG90YWxIZWlnaHQgLSBvZmZzZXRcclxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxyXG5cdFx0XHRcdFx0JChcIi5tb2RhbC1ib2R5XCIsJCh0aGlzKSkuY3NzKHtcIm1heC1oZWlnaHRcIjogXCIje2hlaWdodH1weFwiLCBcImhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCJ9KVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxyXG5cclxuXHRTdGVlZG9zLmdldE1vZGFsTWF4SGVpZ2h0ID0gKG9mZnNldCktPlxyXG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1XHJcblx0XHRlbHNlXHJcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNpT1MoKSBvciBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0IyBpb3Plj4rmiYvmnLrkuIrkuI3pnIDopoHkuLp6b29t5pS+5aSn5Yqf6IO96aKd5aSW6K6h566XXHJcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxyXG5cdFx0XHRzd2l0Y2ggYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0d2hlbiAnbGFyZ2UnXHJcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSA1MFxyXG5cdFx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcclxuXHRcdGlmIG9mZnNldFxyXG5cdFx0XHRyZVZhbHVlIC09IG9mZnNldFxyXG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XHJcblxyXG5cdFN0ZWVkb3MuaXNpT1MgPSAodXNlckFnZW50LCBsYW5ndWFnZSktPlxyXG5cdFx0REVWSUNFID1cclxuXHRcdFx0YW5kcm9pZDogJ2FuZHJvaWQnXHJcblx0XHRcdGJsYWNrYmVycnk6ICdibGFja2JlcnJ5J1xyXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcclxuXHRcdFx0aXBhZDogJ2lwYWQnXHJcblx0XHRcdGlwaG9uZTogJ2lwaG9uZSdcclxuXHRcdFx0aXBvZDogJ2lwb2QnXHJcblx0XHRcdG1vYmlsZTogJ21vYmlsZSdcclxuXHRcdGJyb3dzZXIgPSB7fVxyXG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXHJcblx0XHRudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSdcclxuXHRcdHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgb3IgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKVxyXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxyXG5cdFx0ZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgb3IgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIG9yIFtcclxuXHRcdFx0JydcclxuXHRcdFx0REVWSUNFLmRlc2t0b3BcclxuXHRcdF1cclxuXHRcdGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdXHJcblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxyXG5cdFx0c3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpXHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XHJcblx0XHR1bmxlc3MgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0aWYgaWZyXHJcblx0XHRcdGlmIHR5cGVvZiBpZnIgPT0gJ3N0cmluZydcclxuXHRcdFx0XHRpZnIgPSB0YXJnZXQuJChpZnIpXHJcblx0XHRcdGlmci5sb2FkIC0+XHJcblx0XHRcdFx0aWZyQm9keSA9IGlmci5jb250ZW50cygpLmZpbmQoJ2JvZHknKVxyXG5cdFx0XHRcdGlmIGlmckJvZHlcclxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XHJcblx0XHRcdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KClcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gKHNwYWNlSWQsdXNlcklkLGlzSW5jbHVkZVBhcmVudHMpLT5cclxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXHJcblx0XHRvcmdhbml6YXRpb25zID0gc3BhY2VfdXNlcj8ub3JnYW5pemF0aW9uc1xyXG5cdFx0dW5sZXNzIG9yZ2FuaXphdGlvbnNcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBpc0luY2x1ZGVQYXJlbnRzXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gZGIub3JnYW5pemF0aW9ucy5maW5kKF9pZDp7JGluOm9yZ2FuaXphdGlvbnN9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKVxyXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIG9yZ2FuaXphdGlvbnNcclxuXHJcbiNcdFN0ZWVkb3MuY2hhcmdlQVBJY2hlY2sgPSAoc3BhY2VJZCktPlxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Q29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblx0I1RPRE8g5re75Yqg5pyN5Yqh56uv5piv5ZCm5omL5py655qE5Yik5patKOS+neaNrnJlcXVlc3QpXHJcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XHJcblx0XHRpZiAhc3BhY2VJZCB8fCAhdXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxyXG5cdFx0aWYgIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnNcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcclxuXHJcblx0U3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IChzcGFjZUlkLGFwcF92ZXJzaW9uKS0+XHJcblx0XHRpZiAhc3BhY2VJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGNoZWNrID0gZmFsc2VcclxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xyXG5cdFx0aWYgbW9kdWxlcyBhbmQgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbilcclxuXHRcdFx0Y2hlY2sgPSB0cnVlXHJcblx0XHRyZXR1cm4gY2hlY2tcclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6ropoHmlbDnu4RvcmdJZHPkuK3ku7vkvZXkuIDkuKrnu4Tnu4fmnInmnYPpmZDlsLHov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0aXNPcmdBZG1pbiA9IGZhbHNlXHJcblx0XHR1c2VPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtfaWQ6IHskaW46b3JnSWRzfX0se2ZpZWxkczp7cGFyZW50czoxLGFkbWluczoxfX0pLmZldGNoKClcclxuXHRcdHBhcmVudHMgPSBbXVxyXG5cdFx0YWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIgKG9yZykgLT5cclxuXHRcdFx0aWYgb3JnLnBhcmVudHNcclxuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXHJcblx0XHRcdHJldHVybiBvcmcuYWRtaW5zPy5pbmNsdWRlcyh1c2VySWQpXHJcblx0XHRpZiBhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoXHJcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHBhcmVudHMgPSBfLmZsYXR0ZW4gcGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcclxuXHRcdFx0aWYgcGFyZW50cy5sZW5ndGggYW5kIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7X2lkOnskaW46cGFyZW50c30sIGFkbWluczp1c2VySWR9KVxyXG5cdFx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXHJcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxyXG5cclxuXHJcblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2VcclxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxyXG5cdFx0dW5sZXNzIG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdGkgPSAwXHJcblx0XHR3aGlsZSBpIDwgb3JnSWRzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxyXG5cdFx0XHR1bmxlc3MgaXNPcmdBZG1pblxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGkrK1xyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXHJcblx0XHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0XHR0cnlcclxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcclxuXHRcdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cclxuXHQjXHTpgJrov4dyZXF1ZXN0LmhlYWRlcnPjgIFjb29raWUg6I635b6X5pyJ5pWI55So5oi3XHJcblx0U3RlZWRvcy5nZXRBUElMb2dpblVzZXJcdD0gKHJlcSwgcmVzKSAtPlxyXG5cclxuXHRcdHVzZXJuYW1lID0gcmVxLnF1ZXJ5Py51c2VybmFtZVxyXG5cclxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxyXG5cclxuXHRcdGlmIHVzZXJuYW1lICYmIHBhc3N3b3JkXHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXHJcblxyXG5cdFx0XHRpZiAhdXNlclxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdFx0cmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQgdXNlciwgcGFzc3dvcmRcclxuXHJcblx0XHRcdGlmIHJlc3VsdC5lcnJvclxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gdXNlclxyXG5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cclxuXHJcblx0XHRhdXRoVG9rZW4gPSByZXEucXVlcnk/W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0I1x05qOA5p+ldXNlcklk44CBYXV0aFRva2Vu5piv5ZCm5pyJ5pWIXHJcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cclxuXHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0aWYgdXNlclxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xyXG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0dHJ5XHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdHdoaWxlIGkgPCBtXHJcblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRrZXkzMiA9IGtleSArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRcdGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0cGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XHJcblx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdGxlbiA9IGtleS5sZW5ndGhcclxuXHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdGkgPSAwXHJcblx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRpKytcclxuXHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcclxuXHJcblx0XHRjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcclxuXHJcblx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihwYXNzd29yZCwgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdHJldHVybiBwYXNzd29yZDtcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSAoYWNjZXNzX3Rva2VuKS0+XHJcblxyXG5cdFx0aWYgIWFjY2Vzc190b2tlblxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHJcblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZCwgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VufSlcclxuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHJldHVybiB1c2VySWRcclxuXHRcdGVsc2VcclxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcclxuXHRcdFx0Y29sbGVjdGlvbiA9IG9BdXRoMlNlcnZlci5jb2xsZWN0aW9ucy5hY2Nlc3NUb2tlblxyXG5cclxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxyXG5cdFx0XHRpZiBvYmpcclxuXHRcdFx0XHQjIOWIpOaWrXRva2Vu55qE5pyJ5pWI5pyfXHJcblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxyXG5cdFx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgZXhwaXJlZC5cIlxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIFwib2F1dGgyIGFjY2VzcyB0b2tlbjpcIithY2Nlc3NfdG9rZW4rXCIgaXMgbm90IGZvdW5kLlwiXHJcblx0XHRyZXR1cm4gbnVsbFxyXG5cclxuXHRTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSAocmVxLCByZXMpLT5cclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XHJcblxyXG5cdFx0aWYgcmVxLmhlYWRlcnNcclxuXHRcdFx0dXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl1cclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cclxuXHJcblx0XHQjIHRoZW4gY2hlY2sgY29va2llXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRcdFx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGxcclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKVxyXG5cdFx0XHRyZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KT8uX2lkXHJcblxyXG5cdFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IChyZXEsIHJlcykgLT5cclxuXHRcdHRyeVxyXG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXHJcblxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWR9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJJZCB8fCAhdXNlclxyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWQgT3IgYWNjZXNzX3Rva2VuXCIsXHJcblx0XHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRjYXRjaCBlXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBlLm1lc3NhZ2UsXHJcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblxyXG4jIFRoaXMgd2lsbCBhZGQgdW5kZXJzY29yZS5zdHJpbmcgbWV0aG9kcyB0byBVbmRlcnNjb3JlLmpzXHJcbiMgZXhjZXB0IGZvciBpbmNsdWRlLCBjb250YWlucywgcmV2ZXJzZSBhbmQgam9pbiB0aGF0IGFyZVxyXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcclxuIyBkZWZpbmVkIGJ5IFVuZGVyc2NvcmUuanMuXHJcblxyXG5taXhpbiA9IChvYmopIC0+XHJcblx0Xy5lYWNoIF8uZnVuY3Rpb25zKG9iaiksIChuYW1lKSAtPlxyXG5cdFx0aWYgbm90IF9bbmFtZV0gYW5kIG5vdCBfLnByb3RvdHlwZVtuYW1lXT9cclxuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cclxuXHRcdFx0Xy5wcm90b3R5cGVbbmFtZV0gPSAtPlxyXG5cdFx0XHRcdGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF1cclxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSlcclxuXHJcbiNtaXhpbihfcy5leHBvcnRzKCkpXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6VcclxuXHRTdGVlZG9zLmlzSG9saWRheSA9IChkYXRlKS0+XHJcblx0XHRpZiAhZGF0ZVxyXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGRheSA9IGRhdGUuZ2V0RGF5KClcclxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXHJcblx0XHRpZiBkYXkgaXMgNiBvciBkYXkgaXMgMFxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdCMg5qC55o2u5Lyg5YWl5pe26Ze0KGRhdGUp6K6h566X5Yeg5Liq5bel5L2c5pelKGRheXMp5ZCO55qE5pe26Ze0LGRheXPnm67liY3lj6rog73mmK/mlbTmlbBcclxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0Y2hlY2sgZGF5cywgTnVtYmVyXHJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0Y2FjdWxhdGVEYXRlID0gKGksIGRheXMpLT5cclxuXHRcdFx0aWYgaSA8IGRheXNcclxuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxyXG5cdFx0XHRcdGlmICFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKVxyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0Y2FjdWxhdGVEYXRlKDAsIGRheXMpXHJcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxyXG5cclxuXHQjIOiuoeeul+WNiuS4quW3peS9nOaXpeWQjueahOaXtumXtFxyXG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVBsdXNIYWxmV29ya2luZ0RheSA9IChkYXRlLCBuZXh0KSAtPlxyXG5cdFx0Y2hlY2sgZGF0ZSwgRGF0ZVxyXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xyXG5cdFx0aWYgbm90IHRpbWVfcG9pbnRzIG9yIF8uaXNFbXB0eSh0aW1lX3BvaW50cylcclxuXHRcdFx0Y29uc29sZS5lcnJvciBcInRpbWVfcG9pbnRzIGlzIG51bGxcIlxyXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXHJcblxyXG5cdFx0bGVuID0gdGltZV9wb2ludHMubGVuZ3RoXHJcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRzdGFydF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzWzBdLmhvdXJcclxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcclxuXHRcdGVuZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLmhvdXJcclxuXHRcdGVuZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbbGVuIC0gMV0ubWludXRlXHJcblxyXG5cdFx0Y2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblxyXG5cdFx0aiA9IDBcclxuXHRcdG1heF9pbmRleCA9IGxlbiAtIDFcclxuXHRcdGlmIGRhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gMFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xyXG5cdFx0XHRcdGogPSBsZW4vMlxyXG5cdFx0ZWxzZSBpZiBkYXRlID49IHN0YXJ0X2RhdGUgYW5kIGRhdGUgPCBlbmRfZGF0ZVxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHR3aGlsZSBpIDwgbWF4X2luZGV4XHJcblx0XHRcdFx0Zmlyc3RfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2ldLmhvdXJcclxuXHRcdFx0XHRmaXJzdF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaV0ubWludXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcclxuXHRcdFx0XHRzZWNvbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGVcclxuXHJcblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcclxuXHRcdFx0XHRcdGJyZWFrXHJcblxyXG5cdFx0XHRcdGkrK1xyXG5cclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aiA9IGkgKyBsZW4vMlxyXG5cclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBlbmRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyBsZW4vMlxyXG5cclxuXHRcdGlmIGogPiBtYXhfaW5kZXhcclxuXHRcdFx0IyDpmpTlpKnpnIDliKTmlq3oioLlgYfml6VcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGVcclxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbal0uaG91clxyXG5cdFx0XHRjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2pdLm1pbnV0ZVxyXG5cclxuXHRcdHJldHVybiBjYWN1bGF0ZWRfZGF0ZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0Xy5leHRlbmQgU3RlZWRvcyxcclxuXHRcdGdldFN0ZWVkb3NUb2tlbjogKGFwcElkLCB1c2VySWQsIGF1dGhUb2tlbiktPlxyXG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5cdFx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpXHJcblx0XHRcdGlmIGFwcFxyXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcclxuXHJcblx0XHRcdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcclxuXHRcdFx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdFx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcclxuXHRcdFx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0XHRcdGlmIGxlbiA8IDMyXHJcblx0XHRcdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0XHRcdG0gPSAzMiAtIGxlblxyXG5cdFx0XHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdFx0XHRpKytcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0bG9jYWxlOiAodXNlcklkLCBpc0kxOG4pLT5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcclxuXHRcdFx0bG9jYWxlID0gdXNlcj8ubG9jYWxlXHJcblx0XHRcdGlmIGlzSTE4blxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcclxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cdFx0XHRyZXR1cm4gbG9jYWxlXHJcblxyXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxyXG5cdFx0XHRyZXR1cm4gbm90IE1ldGVvci51c2Vycy5maW5kT25lKHsgdXNlcm5hbWU6IHsgJHJlZ2V4IDogbmV3IFJlZ0V4cChcIl5cIiArIE1ldGVvci5fZXNjYXBlUmVnRXhwKHVzZXJuYW1lKS50cmltKCkgKyBcIiRcIiwgXCJpXCIpIH0gfSlcclxuXHJcblxyXG5cdFx0dmFsaWRhdGVQYXNzd29yZDogKHB3ZCktPlxyXG5cdFx0XHRyZWFzb24gPSB0IFwicGFzc3dvcmRfaW52YWxpZFwiXHJcblx0XHRcdHZhbGlkID0gdHJ1ZVxyXG5cdFx0XHR1bmxlc3MgcHdkXHJcblx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cclxuXHRcdFx0cGFzc3dvclBvbGljeSA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lcclxuXHRcdFx0cGFzc3dvclBvbGljeUVycm9yID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeUVycm9yXHJcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcclxuXHRcdFx0XHRpZiAhKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKVxyXG5cdFx0XHRcdFx0cmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yXHJcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0dmFsaWQgPSB0cnVlXHJcbiNcdFx0XHRlbHNlXHJcbiNcdFx0XHRcdHVubGVzcyAvXFxkKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXHJcbiNcdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG4jXHRcdFx0XHRpZiBwd2QubGVuZ3RoIDwgOFxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHRcdFx0aWYgdmFsaWRcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGVycm9yOlxyXG5cdFx0XHRcdFx0cmVhc29uOiByZWFzb25cclxuXHJcblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSAoc3RyKS0+XHJcblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKVxyXG5cclxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpXHJcblxyXG5DcmVhdG9yLmdldERCQXBwcyA9IChzcGFjZV9pZCktPlxyXG5cdGRiQXBwcyA9IHt9XHJcblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZm9yRWFjaCAoYXBwKS0+XHJcblx0XHRkYkFwcHNbYXBwLl9pZF0gPSBhcHBcclxuXHJcblx0cmV0dXJuIGRiQXBwc1xyXG5cclxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSAoc3BhY2VfaWQpLT5cclxuXHRkYkRhc2hib2FyZHMgPSB7fVxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZvckVhY2ggKGRhc2hib2FyZCktPlxyXG5cdFx0ZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkXHJcblxyXG5cdHJldHVybiBkYkRhc2hib2FyZHNcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpXHJcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHRcdGlmICFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT0gJ0JlYXJlcidcclxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdXHJcblx0XHRyZXR1cm4gYXV0aFRva2VuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKVxyXG5cdFx0XHRzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKVxyXG4jXHRcdGVsc2VcclxuI1x0XHRcdGNvbnNvbGUubG9nKCdyZW1vdmUgY3VycmVudF9hcHBfaWQuLi4nKTtcclxuI1x0XHRcdHNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cclxuXHRcdGlmIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxyXG5cdFx0XHRyZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xyXG4iLCJ2YXIgQ29va2llcywgY3J5cHRvLCBtaXhpbjsgICAgICAgICBcblxuU3RlZWRvcyA9IHtcbiAgc2V0dGluZ3M6IHt9LFxuICBkYjogZGIsXG4gIHN1YnM6IHt9LFxuICBpc1Bob25lRW5hYmxlZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZiwgcmVmMTtcbiAgICByZXR1cm4gISEoKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gcmVmMS5waG9uZSA6IHZvaWQgMCA6IHZvaWQgMCk7XG4gIH0sXG4gIG51bWJlclRvU3RyaW5nOiBmdW5jdGlvbihudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpIHtcbiAgICB2YXIgcmVmLCByZWYxLCByZWc7XG4gICAgaWYgKHR5cGVvZiBudW1iZXIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIG51bWJlciA9IG51bWJlci50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAoIW51bWJlcikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAobnVtYmVyICE9PSBcIk5hTlwiKSB7XG4gICAgICBpZiAoc2NhbGUgfHwgc2NhbGUgPT09IDApIHtcbiAgICAgICAgbnVtYmVyID0gTnVtYmVyKG51bWJlcikudG9GaXhlZChzY2FsZSk7XG4gICAgICB9XG4gICAgICBpZiAoIW5vdFRob3VzYW5kcykge1xuICAgICAgICBpZiAoIShzY2FsZSB8fCBzY2FsZSA9PT0gMCkpIHtcbiAgICAgICAgICBzY2FsZSA9IChyZWYgPSBudW1iZXIubWF0Y2goL1xcLihcXGQrKS8pKSAhPSBudWxsID8gKHJlZjEgPSByZWZbMV0pICE9IG51bGwgPyByZWYxLmxlbmd0aCA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgICAgICBpZiAoIXNjYWxlKSB7XG4gICAgICAgICAgICBzY2FsZSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcLikvZztcbiAgICAgICAgaWYgKHNjYWxlID09PSAwKSB7XG4gICAgICAgICAgcmVnID0gLyhcXGQpKD89KFxcZHszfSkrXFxiKS9nO1xuICAgICAgICB9XG4gICAgICAgIG51bWJlciA9IG51bWJlci5yZXBsYWNlKHJlZywgJyQxLCcpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICB2YWxpSnF1ZXJ5U3ltYm9sczogZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJlZztcbiAgICByZWcgPSBuZXcgUmVnRXhwKFwiXlteIVxcXCIjJCUmJygpKlxcKyxcXC5cXC86Ozw9Pj9AW1xcXFxdXmB7fH1+XSskXCIpO1xuICAgIHJldHVybiByZWcudGVzdChzdHIpO1xuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgU3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gc3dhbCh7XG4gICAgICB0aXRsZTogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190aXRsZVwiKSxcbiAgICAgIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSxcbiAgICAgIGh0bWw6IHRydWUsXG4gICAgICB0eXBlOiBcIndhcm5pbmdcIixcbiAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIilcbiAgICB9KTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudEJnQm9keTtcbiAgICBhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcImJnX2JvZHlcIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50QmdCb2R5KSB7XG4gICAgICByZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRCZ0JvZHlWYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciBhdmF0YXIsIGF2YXRhclVybCwgYmFja2dyb3VuZCwgcmVmLCByZWYxLCByZWYyLCB1cmw7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlID0ge307XG4gICAgICBhY2NvdW50QmdCb2R5VmFsdWUudXJsID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICB9XG4gICAgdXJsID0gYWNjb3VudEJnQm9keVZhbHVlLnVybDtcbiAgICBhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyO1xuICAgIGlmIChhY2NvdW50QmdCb2R5VmFsdWUudXJsKSB7XG4gICAgICBpZiAodXJsID09PSBhdmF0YXIpIHtcbiAgICAgICAgYXZhdGFyVXJsID0gJ2FwaS9maWxlcy9hdmF0YXJzLycgKyBhdmF0YXI7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKSkgKyBcIilcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhY2tncm91bmQgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWZbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMiA9IHJlZjEuYWRtaW4pICE9IG51bGwgPyByZWYyLmJhY2tncm91bmQgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBpZiAoYmFja2dyb3VuZCkge1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKSkgKyBcIilcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYWNrZ3JvdW5kID0gXCIvcGFja2FnZXMvc3RlZWRvc190aGVtZS9jbGllbnQvYmFja2dyb3VuZC9zZWEuanBnXCI7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpKSArIFwiKVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTmVlZFRvTG9jYWwpIHtcbiAgICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKFN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLCB1cmwpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIiwgYXZhdGFyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIik7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRTa2luO1xuICAgIGFjY291bnRTa2luID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInNraW5cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50U2tpbikge1xuICAgICAgcmV0dXJuIGFjY291bnRTa2luLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFpvb207XG4gICAgYWNjb3VudFpvb20gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiem9vbVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRab29tKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFpvb20udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudFpvb21WYWx1ZSwgaXNOZWVkVG9Mb2NhbCkge1xuICAgIHZhciB6b29tTmFtZSwgem9vbVNpemU7XG4gICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSB8fCAhU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIik7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICB9XG4gICAgJChcImJvZHlcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLW5vcm1hbFwiKS5yZW1vdmVDbGFzcyhcInpvb20tbGFyZ2VcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWV4dHJhLWxhcmdlXCIpO1xuICAgIHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lO1xuICAgIHpvb21TaXplID0gYWNjb3VudFpvb21WYWx1ZS5zaXplO1xuICAgIGlmICghem9vbU5hbWUpIHtcbiAgICAgIHpvb21OYW1lID0gXCJsYXJnZVwiO1xuICAgICAgem9vbVNpemUgPSAxLjI7XG4gICAgfVxuICAgIGlmICh6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpKSB7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tXCIgKyB6b29tTmFtZSk7XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLCBhY2NvdW50Wm9vbVZhbHVlLm5hbWUpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLCBhY2NvdW50Wm9vbVZhbHVlLnNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKChzcGFjZSAhPSBudWxsID8gc3BhY2UuaXNfcGFpZCA6IHZvaWQgMCkgJiYgZW5kX2RhdGUgIT09IHZvaWQgMCAmJiAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMgKiAzMCAqIDI0ICogMzYwMCAqIDEwMDApKSB7XG4gICAgICByZXR1cm4gdG9hc3RyLmVycm9yKHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKSk7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLnNldE1vZGFsTWF4SGVpZ2h0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tVmFsdWUsIG9mZnNldDtcbiAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgaWYgKCFhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9ICdsYXJnZSc7XG4gICAgfVxuICAgIHN3aXRjaCAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBjYXNlICdub3JtYWwnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTEyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9mZnNldCA9IDc1O1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICAgICAgb2Zmc2V0ID0gLTY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMTk5O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0yNjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoU3RlZWRvcy5kZXRlY3RJRSgpKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSAzMDM7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDUzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoJChcIi5tb2RhbFwiKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAkKFwiLm1vZGFsXCIpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBmb290ZXJIZWlnaHQsIGhlYWRlckhlaWdodCwgaGVpZ2h0LCB0b3RhbEhlaWdodDtcbiAgICAgICAgaGVhZGVySGVpZ2h0ID0gMDtcbiAgICAgICAgZm9vdGVySGVpZ2h0ID0gMDtcbiAgICAgICAgdG90YWxIZWlnaHQgPSAwO1xuICAgICAgICAkKFwiLm1vZGFsLWhlYWRlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKFwiLm1vZGFsLWZvb3RlclwiLCAkKHRoaXMpKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBmb290ZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0b3RhbEhlaWdodCA9IGhlYWRlckhlaWdodCArIGZvb3RlckhlaWdodDtcbiAgICAgICAgaGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0O1xuICAgICAgICBpZiAoJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIikpIHtcbiAgICAgICAgICByZXR1cm4gJChcIi5tb2RhbC1ib2R5XCIsICQodGhpcykpLmNzcyh7XG4gICAgICAgICAgICBcIm1heC1oZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiLFxuICAgICAgICAgICAgXCJoZWlnaHRcIjogaGVpZ2h0ICsgXCJweFwiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IFwiYXV0b1wiXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCByZVZhbHVlO1xuICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHJlVmFsdWUgPSB3aW5kb3cuc2NyZWVuLmhlaWdodCAtIDEyNiAtIDE4MCAtIDI1O1xuICAgIH0gZWxzZSB7XG4gICAgICByZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjU7XG4gICAgfVxuICAgIGlmICghKFN0ZWVkb3MuaXNpT1MoKSB8fCBTdGVlZG9zLmlzTW9iaWxlKCkpKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKCk7XG4gICAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgICBjYXNlICdsYXJnZSc6XG4gICAgICAgICAgcmVWYWx1ZSAtPSA1MDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXh0cmEtbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gMTQ1O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob2Zmc2V0KSB7XG4gICAgICByZVZhbHVlIC09IG9mZnNldDtcbiAgICB9XG4gICAgcmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG4gIH07XG4gIFN0ZWVkb3MuaXNpT1MgPSBmdW5jdGlvbih1c2VyQWdlbnQsIGxhbmd1YWdlKSB7XG4gICAgdmFyIERFVklDRSwgYnJvd3NlciwgY29uRXhwLCBkZXZpY2UsIG51bUV4cDtcbiAgICBERVZJQ0UgPSB7XG4gICAgICBhbmRyb2lkOiAnYW5kcm9pZCcsXG4gICAgICBibGFja2JlcnJ5OiAnYmxhY2tiZXJyeScsXG4gICAgICBkZXNrdG9wOiAnZGVza3RvcCcsXG4gICAgICBpcGFkOiAnaXBhZCcsXG4gICAgICBpcGhvbmU6ICdpcGhvbmUnLFxuICAgICAgaXBvZDogJ2lwb2QnLFxuICAgICAgbW9iaWxlOiAnbW9iaWxlJ1xuICAgIH07XG4gICAgYnJvd3NlciA9IHt9O1xuICAgIGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJztcbiAgICBudW1FeHAgPSAnKFxcXFxTK1teXFxcXHM6OzpcXFxcKV18KSc7XG4gICAgdXNlckFnZW50ID0gKHVzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpO1xuICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2U7XG4gICAgZGV2aWNlID0gdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhhbmRyb2lkfGlwYWR8aXBob25lfGlwb2R8YmxhY2tiZXJyeSknKSkgfHwgdXNlckFnZW50Lm1hdGNoKG5ldyBSZWdFeHAoJyhtb2JpbGUpJykpIHx8IFsnJywgREVWSUNFLmRlc2t0b3BdO1xuICAgIGJyb3dzZXIuZGV2aWNlID0gZGV2aWNlWzFdO1xuICAgIHJldHVybiBicm93c2VyLmRldmljZSA9PT0gREVWSUNFLmlwYWQgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGhvbmUgfHwgYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcG9kO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oaXNJbmNsdWRlUGFyZW50cykge1xuICAgIHZhciBvcmdhbml6YXRpb25zLCBwYXJlbnRzLCBzcGFjZUlkLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gZnVuY3Rpb24odGFyZ2V0LCBpZnIpIHtcbiAgICBpZiAoIVN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGFyZ2V0LmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBpZiAoaWZyKSB7XG4gICAgICBpZiAodHlwZW9mIGlmciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWZyID0gdGFyZ2V0LiQoaWZyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpZnIubG9hZChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGlmckJvZHk7XG4gICAgICAgIGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jyk7XG4gICAgICAgIGlmIChpZnJCb2R5KSB7XG4gICAgICAgICAgcmV0dXJuIGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQsIGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VfdXNlcjtcbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgb3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXIgIT0gbnVsbCA/IHNwYWNlX3VzZXIub3JnYW5pemF0aW9ucyA6IHZvaWQgMDtcbiAgICBpZiAoIW9yZ2FuaXphdGlvbnMpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4oZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpKTtcbiAgICAgIHJldHVybiBfLnVuaW9uKG9yZ2FuaXphdGlvbnMsIHBhcmVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb3JnYW5pemF0aW9ucztcbiAgICB9XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmlzTW9iaWxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmlzU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQgfHwgIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGlmICghc3BhY2UgfHwgIXNwYWNlLmFkbWlucykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2UuYWRtaW5zLmluZGV4T2YodXNlcklkKSA+PSAwO1xuICB9O1xuICBTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gZnVuY3Rpb24oc3BhY2VJZCwgYXBwX3ZlcnNpb24pIHtcbiAgICB2YXIgY2hlY2ssIG1vZHVsZXMsIHJlZjtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY2hlY2sgPSBmYWxzZTtcbiAgICBtb2R1bGVzID0gKHJlZiA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmLm1vZHVsZXMgOiB2b2lkIDA7XG4gICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5pbmNsdWRlcyhhcHBfdmVyc2lvbikpIHtcbiAgICAgIGNoZWNrID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGNoZWNrO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGFsbG93QWNjZXNzT3JncywgaXNPcmdBZG1pbiwgcGFyZW50cywgdXNlT3JncztcbiAgICBpc09yZ0FkbWluID0gZmFsc2U7XG4gICAgdXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBvcmdJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMSxcbiAgICAgICAgYWRtaW5zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBwYXJlbnRzID0gW107XG4gICAgYWxsb3dBY2Nlc3NPcmdzID0gdXNlT3Jncy5maWx0ZXIoZnVuY3Rpb24ob3JnKSB7XG4gICAgICB2YXIgcmVmO1xuICAgICAgaWYgKG9yZy5wYXJlbnRzKSB7XG4gICAgICAgIHBhcmVudHMgPSBfLnVuaW9uKHBhcmVudHMsIG9yZy5wYXJlbnRzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAocmVmID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZi5pbmNsdWRlcyh1c2VySWQpIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIGlmIChhbGxvd0FjY2Vzc09yZ3MubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50cyA9IF8uZmxhdHRlbihwYXJlbnRzKTtcbiAgICAgIHBhcmVudHMgPSBfLnVuaXEocGFyZW50cyk7XG4gICAgICBpZiAocGFyZW50cy5sZW5ndGggJiYgZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBwYXJlbnRzXG4gICAgICAgIH0sXG4gICAgICAgIGFkbWluczogdXNlcklkXG4gICAgICB9KSkge1xuICAgICAgICBpc09yZ0FkbWluID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuaXNPcmdBZG1pbkJ5QWxsT3JnSWRzID0gZnVuY3Rpb24ob3JnSWRzLCB1c2VySWQpIHtcbiAgICB2YXIgaSwgaXNPcmdBZG1pbjtcbiAgICBpZiAoIW9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgIGlzT3JnQWRtaW4gPSBTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyhbb3JnSWRzW2ldXSwgdXNlcklkKTtcbiAgICAgIGlmICghaXNPcmdBZG1pbikge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIGlzT3JnQWRtaW47XG4gIH07XG4gIFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgZSwgcm9vdF91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgICBlID0gZXJyb3IxO1xuICAgICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBUElMb2dpblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHBhc3N3b3JkLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlc3VsdCwgdXNlciwgdXNlcklkLCB1c2VybmFtZTtcbiAgICB1c2VybmFtZSA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcm5hbWUgOiB2b2lkIDA7XG4gICAgcGFzc3dvcmQgPSAocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEucGFzc3dvcmQgOiB2b2lkIDA7XG4gICAgaWYgKHVzZXJuYW1lICYmIHBhc3N3b3JkKSB7XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHN0ZWVkb3NfaWQ6IHVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCh1c2VyLCBwYXNzd29yZCk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyZXN1bHQuZXJyb3IpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVzZXI7XG4gICAgICB9XG4gICAgfVxuICAgIHVzZXJJZCA9IChyZWYyID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMltcIlgtVXNlci1JZFwiXSA6IHZvaWQgMDtcbiAgICBhdXRoVG9rZW4gPSAocmVmMyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjNbXCJYLUF1dGgtVG9rZW5cIl0gOiB2b2lkIDA7XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pKSB7XG4gICAgICByZXR1cm4gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNoZWNrQXV0aFRva2VuID0gZnVuY3Rpb24odXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW4sIHVzZXI7XG4gICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgU3RlZWRvcy5kZWNyeXB0ID0gZnVuY3Rpb24ocGFzc3dvcmQsIGtleSwgaXYpIHtcbiAgICB2YXIgYywgZGVjaXBoZXIsIGRlY2lwaGVyTXNnLCBlLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIHRyeSB7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgIGMgPSBcIlwiO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IGtleS5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgcGFzc3dvcmQgPSBkZWNpcGhlck1zZy50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHBhc3N3b3JkO1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZW5jcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGksIGtleTMyLCBsZW4sIG07XG4gICAga2V5MzIgPSBcIlwiO1xuICAgIGxlbiA9IGtleS5sZW5ndGg7XG4gICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICBjID0gXCJcIjtcbiAgICAgIGkgPSAwO1xuICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGtleTMyID0ga2V5ICsgYztcbiAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgIH1cbiAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgIHBhc3N3b3JkID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpO1xuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4gPSBmdW5jdGlvbihhY2Nlc3NfdG9rZW4pIHtcbiAgICB2YXIgY29sbGVjdGlvbiwgaGFzaGVkVG9rZW4sIG9iaiwgdXNlciwgdXNlcklkO1xuICAgIGlmICghYWNjZXNzX3Rva2VuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXTtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZWNyZXRzLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHJldHVybiB1c2VySWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW47XG4gICAgICBvYmogPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW5cbiAgICAgIH0pO1xuICAgICAgaWYgKG9iaikge1xuICAgICAgICBpZiAoKG9iaiAhPSBudWxsID8gb2JqLmV4cGlyZXMgOiB2b2lkIDApIDwgbmV3IERhdGUoKSkge1xuICAgICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBleHBpcmVkLlwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBvYmogIT0gbnVsbCA/IG9iai51c2VySWQgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIgKyBhY2Nlc3NfdG9rZW4gKyBcIiBpcyBub3QgZm91bmQuXCI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuICBTdGVlZG9zLmdldFVzZXJJZEZyb21BdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgdXNlcklkO1xuICAgIHVzZXJJZCA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWZbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjIuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuaGVhZGVycykge1xuICAgICAgdXNlcklkID0gcmVxLmhlYWRlcnNbXCJ4LXVzZXItaWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIChyZWYzID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdXNlcklkXG4gICAgICB9KSkgIT0gbnVsbCA/IHJlZjMuX2lkIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5BUElBdXRoZW50aWNhdGlvbkNoZWNrID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgZSwgdXNlciwgdXNlcklkO1xuICAgIHRyeSB7XG4gICAgICB1c2VySWQgPSByZXEudXNlcklkO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb2RlOiA0MDFcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZSA9IGVycm9yMTtcbiAgICAgIGlmICghdXNlcklkIHx8ICF1c2VyKSB7XG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgXCJlcnJvclwiOiBlLm1lc3NhZ2UsXG4gICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5taXhpbiA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gXy5lYWNoKF8uZnVuY3Rpb25zKG9iaiksIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgZnVuYztcbiAgICBpZiAoIV9bbmFtZV0gJiYgKF8ucHJvdG90eXBlW25hbWVdID09IG51bGwpKSB7XG4gICAgICBmdW5jID0gX1tuYW1lXSA9IG9ialtuYW1lXTtcbiAgICAgIHJldHVybiBfLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IFt0aGlzLl93cmFwcGVkXTtcbiAgICAgICAgcHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmNhbGwodGhpcywgZnVuYy5hcHBseShfLCBhcmdzKSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuaXNIb2xpZGF5ID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgIHZhciBkYXk7XG4gICAgaWYgKCFkYXRlKSB7XG4gICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgfVxuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGRheSA9IGRhdGUuZ2V0RGF5KCk7XG4gICAgaWYgKGRheSA9PT0gNiB8fCBkYXkgPT09IDApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZSA9IGZ1bmN0aW9uKGRhdGUsIGRheXMpIHtcbiAgICB2YXIgY2FjdWxhdGVEYXRlLCBwYXJhbV9kYXRlO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIGNoZWNrKGRheXMsIE51bWJlcik7XG4gICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGNhY3VsYXRlRGF0ZSA9IGZ1bmN0aW9uKGksIGRheXMpIHtcbiAgICAgIGlmIChpIDwgZGF5cykge1xuICAgICAgICBwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICAgICAgaWYgKCFTdGVlZG9zLmlzSG9saWRheShwYXJhbV9kYXRlKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBjYWN1bGF0ZURhdGUoaSwgZGF5cyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjYWN1bGF0ZURhdGUoMCwgZGF5cyk7XG4gICAgcmV0dXJuIHBhcmFtX2RhdGU7XG4gIH07XG4gIFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSBmdW5jdGlvbihkYXRlLCBuZXh0KSB7XG4gICAgdmFyIGNhY3VsYXRlZF9kYXRlLCBlbmRfZGF0ZSwgZmlyc3RfZGF0ZSwgaSwgaiwgbGVuLCBtYXhfaW5kZXgsIHJlZiwgc2Vjb25kX2RhdGUsIHN0YXJ0X2RhdGUsIHRpbWVfcG9pbnRzO1xuICAgIGNoZWNrKGRhdGUsIERhdGUpO1xuICAgIHRpbWVfcG9pbnRzID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWYudGltZV9wb2ludHMgOiB2b2lkIDA7XG4gICAgaWYgKCF0aW1lX3BvaW50cyB8fCBfLmlzRW1wdHkodGltZV9wb2ludHMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwidGltZV9wb2ludHMgaXMgbnVsbFwiKTtcbiAgICAgIHRpbWVfcG9pbnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgXCJob3VyXCI6IDgsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiaG91clwiOiAxNCxcbiAgICAgICAgICBcIm1pbnV0ZVwiOiAzMFxuICAgICAgICB9XG4gICAgICBdO1xuICAgIH1cbiAgICBsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGg7XG4gICAgc3RhcnRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIGVuZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgc3RhcnRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1swXS5ob3VyKTtcbiAgICBzdGFydF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbMF0ubWludXRlKTtcbiAgICBlbmRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyKTtcbiAgICBlbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZSk7XG4gICAgY2FjdWxhdGVkX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBqID0gMDtcbiAgICBtYXhfaW5kZXggPSBsZW4gLSAxO1xuICAgIGlmIChkYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgaiA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gc3RhcnRfZGF0ZSAmJiBkYXRlIDwgZW5kX2RhdGUpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBtYXhfaW5kZXgpIHtcbiAgICAgICAgZmlyc3RfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ldLmhvdXIpO1xuICAgICAgICBmaXJzdF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaV0ubWludXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbaSArIDFdLmhvdXIpO1xuICAgICAgICBzZWNvbmRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2kgKyAxXS5taW51dGUpO1xuICAgICAgICBpZiAoZGF0ZSA+PSBmaXJzdF9kYXRlICYmIGRhdGUgPCBzZWNvbmRfZGF0ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBpICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBpICsgbGVuIC8gMjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGUgPj0gZW5kX2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IG1heF9pbmRleCArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqID4gbWF4X2luZGV4KSB7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZSA9IFN0ZWVkb3MuY2FjdWxhdGVXb3JraW5nVGltZShkYXRlLCAxKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5ob3VyKTtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXModGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZSk7XG4gICAgfSBlbHNlIGlmIChqIDw9IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbal0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2pdLm1pbnV0ZSk7XG4gICAgfVxuICAgIHJldHVybiBjYWN1bGF0ZWRfZGF0ZTtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBfLmV4dGVuZChTdGVlZG9zLCB7XG4gICAgZ2V0U3RlZWRvc1Rva2VuOiBmdW5jdGlvbihhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pIHtcbiAgICAgIHZhciBhcHAsIGMsIGNpcGhlciwgY2lwaGVyZWRNc2csIGhhc2hlZFRva2VuLCBpLCBpdiwga2V5MzIsIGxlbiwgbSwgbm93LCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXI7XG4gICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBJZCk7XG4gICAgICBpZiAoYXBwKSB7XG4gICAgICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgICB9XG4gICAgICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgIF9pZDogdXNlcklkLFxuICAgICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICAgICAgaWYgKGFwcC5zZWNyZXQpIHtcbiAgICAgICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAgICAgIGtleTMyID0gXCJcIjtcbiAgICAgICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgICAgIGMgPSBcIlwiO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDMyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSk7XG4gICAgICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHN0ZWVkb3NfdG9rZW47XG4gICAgfSxcbiAgICBsb2NhbGU6IGZ1bmN0aW9uKHVzZXJJZCwgaXNJMThuKSB7XG4gICAgICB2YXIgbG9jYWxlLCB1c2VyO1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBsb2NhbGU6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBsb2NhbGUgPSB1c2VyICE9IG51bGwgPyB1c2VyLmxvY2FsZSA6IHZvaWQgMDtcbiAgICAgIGlmIChpc0kxOG4pIHtcbiAgICAgICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGxvY2FsZTtcbiAgICB9LFxuICAgIGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6IGZ1bmN0aW9uKHVzZXJuYW1lKSB7XG4gICAgICByZXR1cm4gIU1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcm5hbWU6IHtcbiAgICAgICAgICAkcmVnZXg6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHZhbGlkYXRlUGFzc3dvcmQ6IGZ1bmN0aW9uKHB3ZCkge1xuICAgICAgdmFyIHBhc3N3b3JQb2xpY3ksIHBhc3N3b3JQb2xpY3lFcnJvciwgcmVhc29uLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHZhbGlkO1xuICAgICAgcmVhc29uID0gdChcInBhc3N3b3JkX2ludmFsaWRcIik7XG4gICAgICB2YWxpZCA9IHRydWU7XG4gICAgICBpZiAoIXB3ZCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGFzc3dvclBvbGljeSA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMSA9IHJlZi5wYXNzd29yZCkgIT0gbnVsbCA/IHJlZjEucG9saWN5IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgcGFzc3dvclBvbGljeUVycm9yID0gKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMyA9IHJlZjIucGFzc3dvcmQpICE9IG51bGwgPyByZWYzLnBvbGljeUVycm9yIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKHBhc3N3b3JQb2xpY3kpIHtcbiAgICAgICAgaWYgKCEobmV3IFJlZ0V4cChwYXNzd29yUG9saWN5KSkudGVzdChwd2QgfHwgJycpKSB7XG4gICAgICAgICAgcmVhc29uID0gcGFzc3dvclBvbGljeUVycm9yO1xuICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB7XG4gICAgICAgICAgICByZWFzb246IHJlYXNvblxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIik7XG59O1xuXG5TdGVlZG9zLnJlbW92ZVNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIik7XG59O1xuXG5DcmVhdG9yLmdldERCQXBwcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkFwcHM7XG4gIGRiQXBwcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiYXBwc1wiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgaXNfY3JlYXRvcjogdHJ1ZSxcbiAgICB2aXNpYmxlOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICByZXR1cm4gZGJBcHBzW2FwcC5faWRdID0gYXBwO1xuICB9KTtcbiAgcmV0dXJuIGRiQXBwcztcbn07XG5cbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiRGFzaGJvYXJkcztcbiAgZGJEYXNoYm9hcmRzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJkYXNoYm9hcmRcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZm9yRWFjaChmdW5jdGlvbihkYXNoYm9hcmQpIHtcbiAgICByZXR1cm4gZGJEYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmV0dXJuIGRiRGFzaGJvYXJkcztcbn07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuICBTdGVlZG9zLmdldEF1dGhUb2tlbiA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgY29va2llcztcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzWyd4LWF1dGgtdG9rZW4nXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVswXSA9PT0gJ0JlYXJlcicpIHtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGF1dGhUb2tlbjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBNZXRlb3IuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcsIFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKTtcbiAgICB9XG4gIH0pO1xuICBTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnYXBwX2lkJykpIHtcbiAgICAgIHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdjdXJyZW50X2FwcF9pZCcpO1xuICAgIH1cbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuXHRTaW1wbGVTY2hlbWEuZXh0ZW5kT3B0aW9ucyh7Zm9yZWlnbl9rZXk6IE1hdGNoLk9wdGlvbmFsKEJvb2xlYW4pLCByZWZlcmVuY2VzOiBNYXRjaC5PcHRpb25hbChPYmplY3QpfSk7XHJcbn0pIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJMYXN0TG9nb246ICgpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2xhc3RfbG9nb246IG5ldyBEYXRlKCl9fSkgIFxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCAndXBkYXRlVXNlckxhc3RMb2dvbiciLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgQWNjb3VudHMub25Mb2dpbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmNhbGwoJ3VwZGF0ZVVzZXJMYXN0TG9nb24nKTtcbiAgfSk7XG59XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICBNZXRlb3IubWV0aG9kc1xyXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbClcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxyXG4gICAgICBpZiBkYi51c2Vycy5maW5kKHtcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsfSkuY291bnQoKT4wXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID4gMCBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVzaDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcclxuICAgICAgICAgICRzZXQ6IFxyXG4gICAgICAgICAgICBzdGVlZG9zX2lkOiBlbWFpbFxyXG4gICAgICAgICAgICBlbWFpbHM6IFtcclxuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbFxyXG4gICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxyXG4gICAgICAgICAgICBdXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGlmIHVzZXIuZW1haWxzPyBhbmQgdXNlci5lbWFpbHMubGVuZ3RoID49IDJcclxuICAgICAgICBwID0gbnVsbFxyXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICAgIGlmIGUuYWRkcmVzcyA9PSBlbWFpbFxyXG4gICAgICAgICAgICBwID0gZVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkcHVsbDogXHJcbiAgICAgICAgICAgIGVtYWlsczogXHJcbiAgICAgICAgICAgICAgcFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIn1cclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgXHJcblxyXG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcclxuXHJcbiAgICAgIHJldHVybiB7fVxyXG5cclxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XHJcbiAgICAgIGlmIG5vdCBAdXNlcklkP1xyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IGVtYWlsXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwifVxyXG5cclxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcclxuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHNcclxuICAgICAgZW1haWxzLmZvckVhY2ggKGUpLT5cclxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgIGUucHJpbWFyeSA9IHRydWVcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxyXG5cclxuICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sXHJcbiAgICAgICAgJHNldDpcclxuICAgICAgICAgIGVtYWlsczogZW1haWxzXHJcbiAgICAgICAgICBlbWFpbDogZW1haWxcclxuXHJcbiAgICAgIGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe3VzZXI6IHRoaXMudXNlcklkfSx7JHNldDoge2VtYWlsOiBlbWFpbH19LCB7bXVsdGk6IHRydWV9KVxyXG4gICAgICByZXR1cm4ge31cclxuXHJcblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9ICgpLT5cclxuICAgICAgICBzd2FsXHJcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXHJcbiAgICAgICAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcclxuICAgICAgICAgICAgdHlwZTogJ2lucHV0JyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcclxuICAgICAgICAgICAgYW5pbWF0aW9uOiBcInNsaWRlLWZyb20tdG9wXCJcclxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxyXG4gICAgICAgICAgICBNZXRlb3IuY2FsbCBcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCAoZXJyb3IsIHJlc3VsdCktPlxyXG4gICAgICAgICAgICAgICAgaWYgcmVzdWx0Py5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwgdChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCJcclxuIyMjXHJcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XHJcblxyXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcclxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxyXG4gICAgICAgICAgICAjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtk1ldGVvci51c2VySWQoKeS4jei2s+S6juivgeaYjuW3sueZu+W9leeKtuaAgVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xyXG4gICAgICAgICAgaWYgIXByaW1hcnlFbWFpbFxyXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XHJcbiMjIyIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHVzZXJzX2FkZF9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoZGIudXNlcnMuZmluZCh7XG4gICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgIH0pLmNvdW50KCkgPiAwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9leGlzdHNcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICAgZW1haWxzOiB7XG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWwsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsLFxuICAgICAgICAgICAgICAgIHZlcmlmaWVkOiBmYWxzZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfcmVtb3ZlX2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIHAsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGlmICgodXNlci5lbWFpbHMgIT0gbnVsbCkgJiYgdXNlci5lbWFpbHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgcCA9IG51bGw7XG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgICBwID0gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgZW1haWxzOiBwXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9hdF9sZWFzdF9vbmVcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdChlbWFpbCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiBmdW5jdGlvbihlbWFpbCkge1xuICAgICAgdmFyIGVtYWlscywgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgIH0pO1xuICAgICAgZW1haWxzID0gdXNlci5lbWFpbHM7XG4gICAgICBlbWFpbHMuZm9yRWFjaChmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLmFkZHJlc3MgPT09IGVtYWlsKSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGUucHJpbWFyeSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbHM6IGVtYWlscyxcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgdXNlcjogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgJHNldDoge1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIG11bHRpOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZFwiKSxcbiAgICAgIHRleHQ6IHQoXCJwcmltYXJ5X2VtYWlsX25lZWRlZF9kZXNjcmlwdGlvblwiKSxcbiAgICAgIHR5cGU6ICdpbnB1dCcsXG4gICAgICBzaG93Q2FuY2VsQnV0dG9uOiBmYWxzZSxcbiAgICAgIGNsb3NlT25Db25maXJtOiBmYWxzZSxcbiAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXG4gICAgfSwgZnVuY3Rpb24oaW5wdXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKFwidXNlcnNfYWRkX2VtYWlsXCIsIGlucHV0VmFsdWUsIGZ1bmN0aW9uKGVycm9yLCByZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsID8gcmVzdWx0LmVycm9yIDogdm9pZCAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcihyZXN1bHQubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHN3YWwodChcInByaW1hcnlfZW1haWxfdXBkYXRlZFwiKSwgXCJcIiwgXCJzdWNjZXNzXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcbn1cblxuXG4vKlxuICAgIFRyYWNrZXIuYXV0b3J1biAoYykgLT5cblxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXG4gICAgICAgICAgaWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG4gICAgICAgICAgICAgKiDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIHByaW1hcnlFbWFpbCA9IE1ldGVvci51c2VyKCkuZW1haWxzP1swXT8uYWRkcmVzc1xuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcbiAgICAgICAgICAgICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwoKTtcbiAqL1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IubWV0aG9kc1xyXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XHJcbiAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAgICAgZGIudXNlcnMudXBkYXRlKHtfaWQ6IEB1c2VySWR9LCB7JHNldDoge2F2YXRhcjogYXZhdGFyfX0pICAiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1cGRhdGVVc2VyQXZhdGFyOiBmdW5jdGlvbihhdmF0YXIpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBhdmF0YXI6IGF2YXRhclxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuIiwiQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMgPSB7XHJcblx0ZnJvbTogKGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0aWYoIU1ldGVvci5zZXR0aW5ncy5lbWFpbClcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwuZnJvbSlcclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb207XHJcblx0fSkoKSxcclxuXHRyZXNldFBhc3N3b3JkOiB7XHJcblx0XHRzdWJqZWN0OiBmdW5jdGlvbiAodXNlcikge1xyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIHNwbGl0cyA9IHVybC5zcGxpdChcIi9cIik7XHJcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3Jlc2V0X3Bhc3N3b3JkX2JvZHlcIix7dG9rZW5fY29kZTp0b2tlbkNvZGV9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fSxcclxuXHR2ZXJpZnlFbWFpbDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfZW1haWxcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5yb2xsQWNjb3VudDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9jcmVhdGVfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9zdGFydF9zZXJ2aWNlXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9XHJcbn07IiwiLy8g5L+u5pS5ZnVsbG5hbWXlgLzmnInpl67popjnmoRvcmdhbml6YXRpb25zXHJcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xyXG4gIFxyXG5cdHZhciBvcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtmdWxsbmFtZTov5paw6YOo6ZeoLyxuYW1lOnskbmU6XCLmlrDpg6jpl6hcIn19KTtcclxuXHRpZiAob3Jncy5jb3VudCgpPjApXHJcblx0e1xyXG5cdFx0b3Jncy5mb3JFYWNoIChmdW5jdGlvbiAob3JnKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyDoh6rlt7HlkozlrZDpg6jpl6jnmoRmdWxsbmFtZeS/ruaUuVxyXG5cdFx0XHRkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUob3JnLl9pZCwgeyRzZXQ6IHtmdWxsbmFtZTogb3JnLmNhbGN1bGF0ZUZ1bGxuYW1lKCl9fSk7XHJcblx0XHRcdFxyXG5cdFx0fSk7XHJcblx0fVx0XHJcblxyXG4gIFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xyXG4gICAgXHRkYXRhOiB7XHJcblx0ICAgICAgXHRyZXQ6IDAsXHJcblx0ICAgICAgXHRtc2c6IFwiU3VjY2Vzc2Z1bGx5XCJcclxuICAgIFx0fVxyXG4gIFx0fSk7XHJcbn0pO1xyXG5cclxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxyXG4gICAgICAgIE1ldGVvci5zdGFydHVwIC0+XHJcbiAgICAgICAgICAgICAgICBQdXNoLkNvbmZpZ3VyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSURcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW9zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhZGdlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXHJcbiIsImlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBQdXNoLkNvbmZpZ3VyZSh7XG4gICAgICBhbmRyb2lkOiB7XG4gICAgICAgIHNlbmRlcklEOiB3aW5kb3cuQU5EUk9JRF9TRU5ERVJfSUQsXG4gICAgICAgIHNvdW5kOiB0cnVlLFxuICAgICAgICB2aWJyYXRlOiB0cnVlXG4gICAgICB9LFxuICAgICAgaW9zOiB7XG4gICAgICAgIGJhZGdlOiB0cnVlLFxuICAgICAgICBjbGVhckJhZGdlOiB0cnVlLFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgYWxlcnQ6IHRydWVcbiAgICAgIH0sXG4gICAgICBhcHBOYW1lOiBcIndvcmtmbG93XCJcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJTZWxlY3RvciA9IHt9XHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIil9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2FkbWluczp7JGluOlt1c2VySWRdfX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHRzcGFjZXMgPSBzcGFjZXMubWFwIChuKSAtPiByZXR1cm4gbi5faWRcclxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XHJcblx0XHRyZXR1cm4gc2VsZWN0b3JcclxuXHJcbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXHJcblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9ICh1c2VySWQpIC0+XHJcblx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcclxuXHRcdGlmIHNwYWNlSWRcclxuXHRcdFx0aWYgZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLHNwYWNlOiBzcGFjZUlkfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0c2VsZWN0b3IgPSB7fVxyXG5cdFx0c3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7c3BhY2U6IDF9fSkuZmV0Y2goKVxyXG5cdFx0c3BhY2VzID0gW11cclxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cclxuXHRcdFx0c3BhY2VzLnB1c2godS5zcGFjZSlcclxuXHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID1cclxuXHRpY29uOiBcImdsb2JlXCJcclxuXHRjb2xvcjogXCJibHVlXCJcclxuXHR0YWJsZUNvbHVtbnM6IFtcclxuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcclxuXHRcdHtuYW1lOiBcIm1vZHVsZXNcIn0sXHJcblx0XHR7bmFtZTogXCJ1c2VyX2NvdW50XCJ9LFxyXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwifSxcclxuXHRcdHtuYW1lOiBcIm9yZGVyX3BhaWQoKVwifVxyXG5cdF1cclxuXHRleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXVxyXG5cdHJvdXRlckFkbWluOiBcIi9hZG1pblwiXHJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxyXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHJcblx0XHRpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRcdFx0cmV0dXJuIHt9XHJcblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXHJcblx0c2hvd0RlbENvbHVtbjogZmFsc2VcclxuXHRkaXNhYmxlQWRkOiB0cnVlXHJcblx0cGFnZUxlbmd0aDogMTAwXHJcblx0b3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRAc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnNcclxuXHRAYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHNcclxuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXHJcblx0XHRzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnXHJcblx0XHRiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnIiwiICAgICAgICAgICAgIFxuXG5TZWxlY3RvciA9IHt9O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2VBZG1pbiA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIilcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBpZiAoIXVzZXIuaXNfY2xvdWRhZG1pbikge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBhZG1pbnM6IHtcbiAgICAgICAgICAkaW46IFt1c2VySWRdXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pLmZldGNoKCk7XG4gICAgICBzcGFjZXMgPSBzcGFjZXMubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VJZCwgc3BhY2VfdXNlcnMsIHNwYWNlcywgdXNlcjtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgaWYgKGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgICB1c2VyOiB1c2VySWQsXG4gICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgc3BhY2VfdXNlcnMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgc3BhY2VzID0gW107XG4gICAgXy5lYWNoKHNwYWNlX3VzZXJzLCBmdW5jdGlvbih1KSB7XG4gICAgICByZXR1cm4gc3BhY2VzLnB1c2godS5zcGFjZSk7XG4gICAgfSk7XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAkaW46IHNwYWNlc1xuICAgIH07XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5kYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnID0ge1xuICBpY29uOiBcImdsb2JlXCIsXG4gIGNvbG9yOiBcImJsdWVcIixcbiAgdGFibGVDb2x1bW5zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwibW9kdWxlc1wiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJ1c2VyX2NvdW50XCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcImVuZF9kYXRlXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3RvdGFsX2ZlZSgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm9yZGVyX3BhaWQoKVwiXG4gICAgfVxuICBdLFxuICBleHRyYUZpZWxkczogW1wic3BhY2VcIiwgXCJjcmVhdGVkXCIsIFwicGFpZFwiLCBcInRvdGFsX2ZlZVwiXSxcbiAgcm91dGVyQWRtaW46IFwiL2FkbWluXCIsXG4gIHNlbGVjdG9yOiBmdW5jdGlvbih1c2VySWQpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksXG4gICAgICAgICAgcGFpZDogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH0sXG4gIHNob3dFZGl0Q29sdW1uOiBmYWxzZSxcbiAgc2hvd0RlbENvbHVtbjogZmFsc2UsXG4gIGRpc2FibGVBZGQ6IHRydWUsXG4gIHBhZ2VMZW5ndGg6IDEwMCxcbiAgb3JkZXI6IFtbMCwgXCJkZXNjXCJdXVxufTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3BhY2VfdXNlcl9zaWducyA9IGRiLnNwYWNlX3VzZXJfc2lnbnM7XG4gIHRoaXMuYmlsbGluZ19wYXlfcmVjb3JkcyA9IGRiLmJpbGxpbmdfcGF5X3JlY29yZHM7XG4gIHJldHVybiB0eXBlb2YgQWRtaW5Db25maWcgIT09IFwidW5kZWZpbmVkXCIgJiYgQWRtaW5Db25maWcgIT09IG51bGwgPyBBZG1pbkNvbmZpZy5jb2xsZWN0aW9uc19hZGQoe1xuICAgIHNwYWNlX3VzZXJfc2lnbnM6IGRiLnNwYWNlX3VzZXJfc2lnbnMuYWRtaW5Db25maWcsXG4gICAgYmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZ1xuICB9KSA6IHZvaWQgMDtcbn0pO1xuIiwiaWYgKCFbXS5pbmNsdWRlcykge1xyXG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XHJcbiAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHZhciBuID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdKSB8fCAwO1xyXG4gICAgdmFyIGs7XHJcbiAgICBpZiAobiA+PSAwKSB7XHJcbiAgICAgIGsgPSBuO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgayA9IGxlbiArIG47XHJcbiAgICAgIGlmIChrIDwgMCkge2sgPSAwO31cclxuICAgIH1cclxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcclxuICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gT1trXTtcclxuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XHJcbiAgICAgICAgIChzZWFyY2hFbGVtZW50ICE9PSBzZWFyY2hFbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50ICE9PSBjdXJyZW50RWxlbWVudCkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfTtcclxufSIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuXHJcbiAgaWYgIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXNcclxuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxyXG4gICAgICB3d3c6IFxyXG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcclxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cclxuXHRsaXN0Vmlld3MgPSB7fVxyXG5cclxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXHJcblxyXG5cdG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mZXRjaCgpXHJcblxyXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XHJcblx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblx0XHRvbGlzdFZpZXdzID0gXy5maWx0ZXIgb2JqZWN0c1ZpZXdzLCAob3YpLT5cclxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXHJcblxyXG5cdFx0Xy5lYWNoIG9saXN0Vmlld3MsIChsaXN0dmlldyktPlxyXG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcclxuXHJcblx0XHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblx0Xy5mb3JFYWNoIG9iamVjdHMsIChvLCBrZXkpLT5cclxuXHRcdGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSlcclxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxyXG5cdFx0XHRsaXN0Vmlld3Nba2V5XSA9IGxpc3Rfdmlld1xyXG5cdHJldHVybiBsaXN0Vmlld3NcclxuXHJcblxyXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSktPlxyXG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cclxuXHJcblx0b2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcclxuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcclxuXHRcdHNwYWNlOiBzcGFjZUlkLFxyXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXHJcblx0fSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pXHJcblxyXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xyXG5cclxuXHJcblxyXG5cclxuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0cykge1xuICB2YXIgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MsIGtleXMsIGxpc3RWaWV3cywgb2JqZWN0c1ZpZXdzO1xuICBsaXN0Vmlld3MgPSB7fTtcbiAga2V5cyA9IF8ua2V5cyhvYmplY3RzKTtcbiAgb2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZToge1xuICAgICAgJGluOiBrZXlzXG4gICAgfSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZldGNoKCk7XG4gIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24ob2JqZWN0X25hbWUpIHtcbiAgICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9saXN0Vmlld3M7XG4gICAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgICBvbGlzdFZpZXdzID0gXy5maWx0ZXIob2JqZWN0c1ZpZXdzLCBmdW5jdGlvbihvdikge1xuICAgICAgcmV0dXJuIG92Lm9iamVjdF9uYW1lID09PSBvYmplY3RfbmFtZTtcbiAgICB9KTtcbiAgICBfLmVhY2gob2xpc3RWaWV3cywgZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xuICB9O1xuICBfLmZvckVhY2gob2JqZWN0cywgZnVuY3Rpb24obywga2V5KSB7XG4gICAgdmFyIGxpc3RfdmlldztcbiAgICBsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpO1xuICAgIGlmICghXy5pc0VtcHR5KGxpc3RfdmlldykpIHtcbiAgICAgIHJldHVybiBsaXN0Vmlld3Nba2V5XSA9IGxpc3RfdmlldztcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbGlzdFZpZXdzO1xufTtcblxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RfbmFtZSkge1xuICB2YXIgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MsIG9iamVjdF9saXN0dmlldztcbiAgX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fTtcbiAgb2JqZWN0X2xpc3R2aWV3ID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcbiAgICBvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KTtcbiAgb2JqZWN0X2xpc3R2aWV3LmZvckVhY2goZnVuY3Rpb24obGlzdHZpZXcpIHtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICB9KTtcbiAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzO1xufTtcbiIsIi8vIFNlcnZlclNlc3Npb24gPSAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICd1c2Ugc3RyaWN0JztcclxuXHJcbi8vICAgdmFyIENvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbignc2VydmVyX3Nlc3Npb25zJyk7XHJcblxyXG4vLyAgIHZhciBjaGVja0ZvcktleSA9IGZ1bmN0aW9uIChrZXkpIHtcclxuLy8gICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xyXG4vLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xyXG4vLyAgICAgfVxyXG4vLyAgIH07XHJcbi8vICAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xyXG4vLyAgICAgcmV0dXJuIG9iaiAmJiBvYmoudmFsdWVzICYmIG9iai52YWx1ZXNba2V5XTtcclxuLy8gICB9O1xyXG4vLyAgIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICB9O1xyXG5cclxuLy8gICBDb2xsZWN0aW9uLmRlbnkoe1xyXG4vLyAgICAgJ2luc2VydCc6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgICB9LFxyXG4vLyAgICAgJ3VwZGF0ZScgOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICdyZW1vdmUnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfVxyXG4vLyAgIH0pO1xyXG5cclxuLy8gICAvLyBwdWJsaWMgY2xpZW50IGFuZCBzZXJ2ZXIgYXBpXHJcbi8vICAgdmFyIGFwaSA9IHtcclxuLy8gICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XHJcbi8vICAgICAgIGNvbnNvbGUubG9nKENvbGxlY3Rpb24uZmluZE9uZSgpKTtcclxuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuLy8gICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcclxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0Jyk7XHJcbi8vICAgICAgIH1cclxuLy8gICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcclxuLy8gICAgICAgLy8gICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vZ2V0JykgOiBDb2xsZWN0aW9uLmZpbmRPbmUoKTtcclxuLy8gICAgICAgcmV0dXJuIGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICdlcXVhbHMnOiBmdW5jdGlvbiAoa2V5LCBleHBlY3RlZCwgaWRlbnRpY2FsKSB7XHJcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcblxyXG4vLyAgICAgICB2YXIgdmFsdWUgPSBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuXHJcbi8vICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiBfLmlzT2JqZWN0KGV4cGVjdGVkKSkge1xyXG4vLyAgICAgICAgIHJldHVybiBfKHZhbHVlKS5pc0VxdWFsKGV4cGVjdGVkKTtcclxuLy8gICAgICAgfVxyXG5cclxuLy8gICAgICAgaWYgKGlkZW50aWNhbCA9PSBmYWxzZSkge1xyXG4vLyAgICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcclxuLy8gICAgICAgfVxyXG5cclxuLy8gICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcclxuLy8gICAgIH1cclxuLy8gICB9O1xyXG5cclxuLy8gICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpe1xyXG4vLyAgICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xyXG4vLyAgICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcclxuLy8gICAgICAgICBpZihNZXRlb3IudXNlcklkKCkpe1xyXG4vLyAgICAgICAgICAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmVyLXNlc3Npb24nKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgIH0pXHJcbi8vICAgICB9XHJcbi8vICAgfSlcclxuXHJcbi8vICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xyXG4vLyAgICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgLy8gICBpZiAoQ29sbGVjdGlvbi5maW5kT25lKCkpIHtcclxuLy8gICAgIC8vICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7fSk7IC8vIGNsZWFyIG91dCBhbGwgc3RhbGUgc2Vzc2lvbnNcclxuLy8gICAgIC8vICAgfVxyXG4vLyAgICAgLy8gfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xyXG4vLyAgICAgICB2YXIgY2xpZW50SUQgPSBjb25uZWN0aW9uLmlkO1xyXG5cclxuLy8gICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xyXG4vLyAgICAgICAgIENvbGxlY3Rpb24uaW5zZXJ0KHsgJ2NsaWVudElEJzogY2xpZW50SUQsICd2YWx1ZXMnOiB7fSwgXCJjcmVhdGVkXCI6IG5ldyBEYXRlKCkgfSk7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIGNvbm5lY3Rpb24ub25DbG9zZShmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgQ29sbGVjdGlvbi5yZW1vdmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KTtcclxuLy8gICAgICAgfSk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmQoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbi8vICAgICB9KTtcclxuXHJcbi8vICAgICBNZXRlb3IubWV0aG9kcyh7XHJcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9nZXQnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbi8vICAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcclxuXHJcbi8vICAgICAgICAgY2hlY2tGb3JLZXkoa2V5KTtcclxuXHJcbi8vICAgICAgICAgaWYgKCFjb25kaXRpb24oa2V5LCB2YWx1ZSkpXHJcbi8vICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGYWlsZWQgY29uZGl0aW9uIHZhbGlkYXRpb24uJyk7XHJcblxyXG4vLyAgICAgICAgIHZhciB1cGRhdGVPYmogPSB7fTtcclxuLy8gICAgICAgICB1cGRhdGVPYmpbJ3ZhbHVlcy4nICsga2V5XSA9IHZhbHVlO1xyXG5cclxuLy8gICAgICAgICBDb2xsZWN0aW9uLnVwZGF0ZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9LCB7ICRzZXQ6IHVwZGF0ZU9iaiB9KTtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7ICBcclxuXHJcbi8vICAgICAvLyBzZXJ2ZXItb25seSBhcGlcclxuLy8gICAgIF8uZXh0ZW5kKGFwaSwge1xyXG4vLyAgICAgICAnc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuLy8gICAgICAgICBNZXRlb3IuY2FsbCgnc2VydmVyLXNlc3Npb24vc2V0Jywga2V5LCB2YWx1ZSk7ICAgICAgICAgIFxyXG4vLyAgICAgICB9LFxyXG4vLyAgICAgICAnc2V0Q29uZGl0aW9uJzogZnVuY3Rpb24gKG5ld0NvbmRpdGlvbikge1xyXG4vLyAgICAgICAgIGNvbmRpdGlvbiA9IG5ld0NvbmRpdGlvbjtcclxuLy8gICAgICAgfVxyXG4vLyAgICAgfSk7XHJcbi8vICAgfVxyXG5cclxuLy8gICByZXR1cm4gYXBpO1xyXG4vLyB9KSgpOyIsIkpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgcmVxLnF1ZXJ5Py51c2VySWRcclxuXHJcblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXHJcblxyXG5cdFx0dXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKVxyXG5cdFx0XHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRkYXRhOlxyXG5cdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXHJcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0cmV0dXJuO1xyXG5cclxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxyXG5cclxuXHRcdCMg5qCh6aqMc3BhY2XmmK/lkKblrZjlnKhcclxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXHJcblxyXG5cdFx0bG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOnVzZXJfaWR9KS5sb2NhbGVcclxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcclxuXHRcdFx0bG9jYWxlID0gXCJlblwiXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxyXG5cclxuXHRcdHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHVzZXJfaWR9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIilcclxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxyXG5cclxuXHRcdGFwcHMuZm9yRWFjaCAoYXBwKSAtPlxyXG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxyXG5cclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDIwMFxyXG5cdFx0XHRkYXRhOiB7IHN0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IGFwcHN9XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cclxuXHRcclxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9nZXQvYXBwcycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHBzLCBlLCBsb2NhbGUsIHJlZiwgcmVmMSwgc3BhY2VfaWQsIHNwYWNlcywgdXNlciwgdXNlcl9pZDtcbiAgdHJ5IHtcbiAgICB1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8ICgocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJJZCA6IHZvaWQgMCk7XG4gICAgc3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmMSA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjEuc3BhY2VJZCA6IHZvaWQgMCk7XG4gICAgdXNlciA9IFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyKHJlcSwgcmVzKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyX2lkID0gdXNlci5faWQ7XG4gICAgdXVmbG93TWFuYWdlci5nZXRTcGFjZShzcGFjZV9pZCk7XG4gICAgbG9jYWxlID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9KS5sb2NhbGU7XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJlbi11c1wiKSB7XG4gICAgICBsb2NhbGUgPSBcImVuXCI7XG4gICAgfVxuICAgIGlmIChsb2NhbGUgPT09IFwiemgtY25cIikge1xuICAgICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICAgIH1cbiAgICBzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgIHVzZXI6IHVzZXJfaWRcbiAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwic3BhY2VcIik7XG4gICAgYXBwcyA9IGRiLmFwcHMuZmluZCh7XG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgICAgcmV0dXJuIGFwcC5uYW1lID0gVEFQaTE4bi5fXyhhcHAubmFtZSwge30sIGxvY2FsZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgc3RhdHVzOiBcInN1Y2Nlc3NcIixcbiAgICAgICAgZGF0YTogYXBwc1xuICAgICAgfVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVycm9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGVycm9yTWVzc2FnZTogZS5tZXNzYWdlXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICB0cnlcclxuICAgICAgICAjIFRPRE8g55So5oi355m75b2V6aqM6K+BXHJcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cclxuICAgICAgICAjIGZpcnN0IGNoZWNrIHJlcXVlc3QgYm9keVxyXG4gICAgICAgIGlmIHJlcS5ib2R5XHJcbiAgICAgICAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG4gICAgICAgICMgdGhlbiBjaGVjayBjb29raWVcclxuICAgICAgICBpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cclxuICAgICAgICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuICAgICAgICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcbiAgICAgICAgaWYgISh1c2VySWQgYW5kIGF1dGhUb2tlbilcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLCBcclxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcclxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xyXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xyXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XHJcbiAgICAgICAgZGF0YSA9IFtdO1xyXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG5cclxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YTogW107XHJcblxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdtYWlsX2FjY291bnRzJywgJ3JvbGVzJ11cclxuXHJcbiAgICAgICAgaWYgIXNwYWNlXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAjIFRPRE8g55So5oi35piv5ZCm5bGe5LqOc3BhY2VcclxuICAgICAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcklkLCBzcGFjZTogc3BhY2V9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmICFzcGFjZV91c2VyXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDMsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAhYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWRiW21vZGVsXVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIXNlbGVjdG9yXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcblxyXG4gICAgICAgIGlmICFvcHRpb25zXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgaWYgbW9kZWwgPT0gJ21haWxfYWNjb3VudHMnXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0ge307XHJcbiAgICAgICAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvcik7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlXHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGE7XHJcbiAgICBjYXRjaCBlXHJcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXHJcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcclxuICAgICAgICAgICAgZGF0YToge30iLCJ2YXIgQ29va2llcztcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ3JvbGVzJ107XG4gICAgaWYgKCFzcGFjZSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlXG4gICAgfSk7XG4gICAgaWYgKCFzcGFjZV91c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbCkpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghZGJbbW9kZWxdKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXNlbGVjdG9yKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogW11cbiAgICB9KTtcbiAgfVxufSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhbGxvd19tb2RlbHMsIGF1dGhUb2tlbiwgY29va2llcywgZGF0YSwgZSwgbW9kZWwsIG9wdGlvbnMsIHNlbGVjdG9yLCBzcGFjZSwgc3BhY2VfdXNlciwgdXNlcklkO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5ib2R5KSB7XG4gICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoISh1c2VySWQgJiYgYXV0aFRva2VuKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmIChtb2RlbCA9PT0gJ21haWxfYWNjb3VudHMnKSB7XG4gICAgICBzZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWQ7XG4gICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge31cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxyXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpXHJcblx0aWYgYXBwXHJcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblx0XHRyZWRpcmVjdFVybCA9IGFwcC51cmxcclxuXHRlbHNlXHJcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0cmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsXHJcblxyXG5cdGlmICFyZWRpcmVjdFVybFxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoKVxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcblx0IyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuXHQjIGlmIHJlcS5ib2R5XHJcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXHJcblx0IyBcdGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdCMgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0IyBcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdGlmICF1c2VySWQgYW5kICFhdXRoVG9rZW5cclxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5W1wiWC1BdXRoLVRva2VuXCJdXHJcblxyXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0X2lkOiB1c2VySWQsXHJcblx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRpZiB1c2VyXHJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcclxuXHRcdFx0aWYgYXBwLnNlY3JldFxyXG5cdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aXYgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxyXG5cdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdGtleTMyID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSAzMlxyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHQjIGRlcy1jYmNcclxuXHRcdFx0ZGVzX2l2ID0gXCItODc2Mi1mY1wiXHJcblx0XHRcdGtleTggPSBcIlwiXHJcblx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdGlmIGxlbiA8IDhcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDggLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDhcclxuXHRcdFx0XHRrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLDgpXHJcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxyXG5cdFx0XHRkZXNfY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtkZXNfY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGRlc19jaXBoZXIuZmluYWwoKV0pXHJcblx0XHRcdGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0am9pbmVyID0gXCI/XCJcclxuXHJcblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcclxuXHRcdFx0XHRqb2luZXIgPSBcIiZcIlxyXG5cclxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXHJcblxyXG5cdFx0XHRpZiB1c2VyLnVzZXJuYW1lXHJcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgcmV0dXJudXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRyZXMuZW5kKClcclxuXHRyZXR1cm5cclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0XHQjIHRoaXMucGFyYW1zID1cclxuXHRcdCMgXHR1c2VySWQ6IGRlY29kZVVSSShyZXEudXJsKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcPy4qJC8sICcnKVxyXG5cdFx0d2lkdGggPSA1MCA7XHJcblx0XHRoZWlnaHQgPSA1MCA7XHJcblx0XHRmb250U2l6ZSA9IDI4IDtcclxuXHRcdGlmIHJlcS5xdWVyeS53XHJcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XHJcblx0XHRpZiByZXEucXVlcnkuaFxyXG5cdFx0ICAgIGhlaWdodCA9IHJlcS5xdWVyeS5oIDtcclxuXHRcdGlmIHJlcS5xdWVyeS5mc1xyXG4gICAgICAgICAgICBmb250U2l6ZSA9IHJlcS5xdWVyeS5mcyA7XHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIuYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBDcmVhdG9yLmdldFJlbGF0aXZlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyB1c2VyLmF2YXRhcilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCB1c2VyLnByb2ZpbGUuYXZhdGFyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclVybFxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGlmIG5vdCBmaWxlP1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cdFx0XHRzdmcgPSBcIlwiXCJcclxuXHRcdFx0XHQ8c3ZnIHZlcnNpb249XCIxLjFcIiBpZD1cIkxheWVyXzFcIiB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeD1cIjBweFwiIHk9XCIwcHhcIlxyXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cclxuXHRcdFx0XHQ8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+XHJcblx0XHRcdFx0XHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XHJcblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XHJcblx0XHRcdFx0PC9zdHlsZT5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxyXG5cdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LDIuMWMxOC43LDAsMzQsMTUuMywzNCwzNHMtMTUuMywzNC0zNCwzNFMyLDU0LjgsMiwzNi4xUzE3LjMsMi4xLDM2LDIuMSBNMzYsMC4xYy0xOS45LDAtMzYsMTYuMS0zNiwzNlxyXG5cdFx0XHRcdFx0XHRzMTYuMSwzNiwzNiwzNnMzNi0xNi4xLDM2LTM2UzU1LjksMC4xLDM2LDAuMUwzNiwwLjF6XCIvPlxyXG5cdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdDxnPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxyXG5cdFx0XHRcdFx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcIi8+XHJcblx0XHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcclxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cclxuXHRcdFx0XHRcdDwvZz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvY2xpZW50L2ltYWdlcy9kZWZhdWx0LWF2YXRhci5wbmdcIilcclxuI1x0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcclxuXHRcdGlmICF1c2VybmFtZVxyXG5cdFx0XHR1c2VybmFtZSA9IFwiXCJcclxuXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZSdcclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuXHRcdFx0Y29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxyXG5cdFx0XHRjb2xvcl9pbmRleCA9IDBcclxuXHRcdFx0Xy5lYWNoIHVzZXJuYW1lX2FycmF5LCAoaXRlbSkgLT5cclxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XHJcblxyXG5cdFx0XHRwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aFxyXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cclxuXHRcdFx0I2NvbG9yID0gXCIjRDZEQURDXCJcclxuXHJcblx0XHRcdGluaXRpYWxzID0gJydcclxuXHRcdFx0aWYgdXNlcm5hbWUuY2hhckNvZGVBdCgwKT4yNTVcclxuXHRcdFx0XHRpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG5cdFx0XHQ8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgc3R5bGU9XCJ3aWR0aDogI3t3aWR0aH1weDsgaGVpZ2h0OiAje2hlaWdodH1weDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcblx0XHRcdFx0PHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNGRkZGRkZcIiBmb250LWZhbWlseT1cIi1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgSGVsdmV0aWNhLCBBcmlhbCwgTWljcm9zb2Z0IFlhaGVpLCBTaW1IZWlcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogI3tmb250U2l6ZX1weDtcIj5cclxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XHJcblx0XHRcdFx0PC90ZXh0PlxyXG5cdFx0XHQ8L3N2Zz5cclxuXHRcdFx0XCJcIlwiXHJcblxyXG5cdFx0XHRyZXMud3JpdGUgc3ZnXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcblx0XHRpZiByZXFNb2RpZmllZEhlYWRlcj9cclxuXHRcdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXIgPT0gdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKVxyXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG5cdFx0XHRcdHJlcy53cml0ZUhlYWQgMzA0XHJcblx0XHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKCkgb3IgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpXHJcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcclxuXHRcdHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyLzp1c2VySWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JfaW5kZXgsIGNvbG9ycywgZm9udFNpemUsIGhlaWdodCwgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlZjIsIHJlcU1vZGlmaWVkSGVhZGVyLCBzdmcsIHVzZXIsIHVzZXJuYW1lLCB1c2VybmFtZV9hcnJheSwgd2lkdGg7XG4gICAgd2lkdGggPSA1MDtcbiAgICBoZWlnaHQgPSA1MDtcbiAgICBmb250U2l6ZSA9IDI4O1xuICAgIGlmIChyZXEucXVlcnkudykge1xuICAgICAgd2lkdGggPSByZXEucXVlcnkudztcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5oKSB7XG4gICAgICBoZWlnaHQgPSByZXEucXVlcnkuaDtcbiAgICB9XG4gICAgaWYgKHJlcS5xdWVyeS5mcykge1xuICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnM7XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHVzZXIuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKChyZWYgPSB1c2VyLnByb2ZpbGUpICE9IG51bGwgPyByZWYuYXZhdGFyIDogdm9pZCAwKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhcik7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhclVybCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIHN2ZyA9IFwiPHN2ZyB2ZXJzaW9uPVxcXCIxLjFcXFwiIGlkPVxcXCJMYXllcl8xXFxcIiB4bWxucz1cXFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcXFwiIHhtbG5zOnhsaW5rPVxcXCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXFxcIiB4PVxcXCIwcHhcXFwiIHk9XFxcIjBweFxcXCJcXG5cdCB2aWV3Qm94PVxcXCIwIDAgNzIgNzJcXFwiIHN0eWxlPVxcXCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1xcXCIgeG1sOnNwYWNlPVxcXCJwcmVzZXJ2ZVxcXCI+XFxuPHN0eWxlIHR5cGU9XFxcInRleHQvY3NzXFxcIj5cXG5cdC5zdDB7ZmlsbDojRkZGRkZGO31cXG5cdC5zdDF7ZmlsbDojRDBEMEQwO31cXG48L3N0eWxlPlxcbjxnPlxcblx0PHBhdGggY2xhc3M9XFxcInN0MFxcXCIgZD1cXFwiTTM2LDcxLjFjLTE5LjMsMC0zNS0xNS43LTM1LTM1czE1LjctMzUsMzUtMzVzMzUsMTUuNywzNSwzNVM1NS4zLDcxLjEsMzYsNzEuMXpcXFwiLz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcXG5cdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelxcXCIvPlxcbjwvZz5cXG48Zz5cXG5cdDxnPlxcblx0XHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxcblx0XHRcdEMyMC43LDM1LjgsMjcuNSw0Mi42LDM1LjgsNDIuNnpcXFwiLz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxcblx0XHRcdEMxOSw2Ny40LDI3LjIsNzAuNywzNi4yLDcwLjd6XFxcIi8+XFxuXHQ8L2c+XFxuPC9nPlxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJuYW1lID0gdXNlci5uYW1lO1xuICAgIGlmICghdXNlcm5hbWUpIHtcbiAgICAgIHVzZXJuYW1lID0gXCJcIjtcbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnKTtcbiAgICBpZiAodHlwZW9mIGZpbGUgPT09IFwidW5kZWZpbmVkXCIgfHwgZmlsZSA9PT0gbnVsbCkge1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCAnI0U5MUU2MycsICcjOUMyN0IwJywgJyM2NzNBQjcnLCAnIzNGNTFCNScsICcjMjE5NkYzJywgJyMwM0E5RjQnLCAnIzAwQkNENCcsICcjMDA5Njg4JywgJyM0Q0FGNTAnLCAnIzhCQzM0QScsICcjQ0REQzM5JywgJyNGRkMxMDcnLCAnI0ZGOTgwMCcsICcjRkY1NzIyJywgJyM3OTU1NDgnLCAnIzlFOUU5RScsICcjNjA3RDhCJ107XG4gICAgICB1c2VybmFtZV9hcnJheSA9IEFycmF5LmZyb20odXNlcm5hbWUpO1xuICAgICAgY29sb3JfaW5kZXggPSAwO1xuICAgICAgXy5lYWNoKHVzZXJuYW1lX2FycmF5LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgIHJldHVybiBjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG4gICAgICB9KTtcbiAgICAgIHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIlwiICsgd2lkdGggKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIGhlaWdodCArIFwiXFxcIiBzdHlsZT1cXFwid2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICsgaGVpZ2h0ICsgXCJweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuXHQ8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNGRkZGRkZcXFwiIGZvbnQtZmFtaWx5PVxcXCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiBcIiArIGZvbnRTaXplICsgXCJweDtcXFwiPlxcblx0XHRcIiArIGluaXRpYWxzICsgXCJcXG5cdDwvdGV4dD5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG4gICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyICE9IG51bGwpIHtcbiAgICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciA9PT0gKChyZWYxID0gdXNlci5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMiA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYyLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvYWNjZXNzL2NoZWNrJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cclxuXHRcdGFjY2Vzc190b2tlbiA9IHJlcS5xdWVyeT8uYWNjZXNzX3Rva2VuXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDIwMFxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHRlbHNlXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgIE1ldGVvci5wdWJsaXNoICdhcHBzJywgKHNwYWNlSWQpLT5cclxuICAgICAgICB1bmxlc3MgdGhpcy51c2VySWRcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cclxuICAgICAgICBpZiBzcGFjZUlkXHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogc3BhY2VJZH1dfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtzb3J0OiB7c29ydDogMX19KTtcclxuIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IucHVibGlzaCgnYXBwcycsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgc2VsZWN0b3I7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7XG4gICAgICBzcGFjZToge1xuICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCJcclxuXHJcblx0IyBwdWJsaXNoIHVzZXJzIHNwYWNlc1xyXG5cdCMgd2Ugb25seSBwdWJsaXNoIHNwYWNlcyBjdXJyZW50IHVzZXIgam9pbmVkLlxyXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxyXG5cdFx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblxyXG5cdFx0c2VsZiA9IHRoaXM7XHJcblx0XHR1c2VyU3BhY2VzID0gW11cclxuXHRcdHN1cyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSwge2ZpZWxkczoge3NwYWNlOjF9fSlcclxuXHRcdHN1cy5mb3JFYWNoIChzdSkgLT5cclxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxyXG5cclxuXHRcdGhhbmRsZTIgPSBudWxsXHJcblxyXG5cdFx0IyBvbmx5IHJldHVybiB1c2VyIGpvaW5lZCBzcGFjZXMsIGFuZCBvYnNlcnZlcyB3aGVuIHVzZXIgam9pbiBvciBsZWF2ZSBhIHNwYWNlXHJcblx0XHRoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLm9ic2VydmVcclxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0aWYgZG9jLnNwYWNlXHJcblx0XHRcdFx0XHRpZiB1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDBcclxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcclxuXHRcdFx0XHRcdFx0b2JzZXJ2ZVNwYWNlcygpXHJcblx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSlcclxuXHJcblx0XHRvYnNlcnZlU3BhY2VzID0gLT5cclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG5cdFx0XHRoYW5kbGUyID0gZGIuc3BhY2VzLmZpbmQoe19pZDogeyRpbjogdXNlclNwYWNlc319KS5vYnNlcnZlXHJcblx0XHRcdFx0YWRkZWQ6IChkb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcclxuXHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKVxyXG5cdFx0XHRcdGNoYW5nZWQ6IChuZXdEb2MsIG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XHJcblx0XHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cclxuXHRcdFx0XHRcdHNlbGYucmVtb3ZlZCBcInNwYWNlc1wiLCBvbGREb2MuX2lkXHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcygpO1xyXG5cclxuXHRcdHNlbGYucmVhZHkoKTtcclxuXHJcblx0XHRzZWxmLm9uU3RvcCAtPlxyXG5cdFx0XHRoYW5kbGUuc3RvcCgpO1xyXG5cdFx0XHRpZiBoYW5kbGUyXHJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XHJcbiIsIk1ldGVvci5wdWJsaXNoKCdteV9zcGFjZXMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGhhbmRsZSwgaGFuZGxlMiwgb2JzZXJ2ZVNwYWNlcywgc2VsZiwgc3VzLCB1c2VyU3BhY2VzO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBzZWxmID0gdGhpcztcbiAgdXNlclNwYWNlcyA9IFtdO1xuICBzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHNwYWNlOiAxXG4gICAgfVxuICB9KTtcbiAgc3VzLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKTtcbiAgfSk7XG4gIGhhbmRsZTIgPSBudWxsO1xuICBoYW5kbGUgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gIH0pLm9ic2VydmUoe1xuICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgIGlmIChkb2Muc3BhY2UpIHtcbiAgICAgICAgaWYgKHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMCkge1xuICAgICAgICAgIHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpO1xuICAgICAgICAgIHJldHVybiBvYnNlcnZlU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKG9sZERvYykge1xuICAgICAgaWYgKG9sZERvYy5zcGFjZSkge1xuICAgICAgICBzZWxmLnJlbW92ZWQoXCJzcGFjZXNcIiwgb2xkRG9jLnNwYWNlKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBvYnNlcnZlU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGhhbmRsZTIpIHtcbiAgICAgIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgICByZXR1cm4gaGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IHVzZXJTcGFjZXNcbiAgICAgIH1cbiAgICB9KS5vYnNlcnZlKHtcbiAgICAgIGFkZGVkOiBmdW5jdGlvbihkb2MpIHtcbiAgICAgICAgc2VsZi5hZGRlZChcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcy5wdXNoKGRvYy5faWQpO1xuICAgICAgfSxcbiAgICAgIGNoYW5nZWQ6IGZ1bmN0aW9uKG5ld0RvYywgb2xkRG9jKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmNoYW5nZWQoXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jKTtcbiAgICAgIH0sXG4gICAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5faWQpO1xuICAgICAgICByZXR1cm4gdXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgb2JzZXJ2ZVNwYWNlcygpO1xuICBzZWxmLnJlYWR5KCk7XG4gIHJldHVybiBzZWxmLm9uU3RvcChmdW5jdGlvbigpIHtcbiAgICBoYW5kbGUuc3RvcCgpO1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICByZXR1cm4gaGFuZGxlMi5zdG9wKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiIyBwdWJsaXNoIHNvbWUgb25lIHNwYWNlJ3MgYXZhdGFyXHJcbk1ldGVvci5wdWJsaXNoICdzcGFjZV9hdmF0YXInLCAoc3BhY2VJZCktPlxyXG5cdHVubGVzcyBzcGFjZUlkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnc3BhY2VfYXZhdGFyJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICBpZiAoIXNwYWNlSWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5zcGFjZXMuZmluZCh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGF2YXRhcjogMSxcbiAgICAgIG5hbWU6IDEsXG4gICAgICBlbmFibGVfcmVnaXN0ZXI6IDFcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnbW9kdWxlcycsICgpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpOyIsIk1ldGVvci5wdWJsaXNoKCdtb2R1bGVzJywgZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ2JpbGxpbmdfd2VpeGluX3BheV9jb2RlX3VybCcsIChfaWQpLT5cclxuXHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0dW5sZXNzIF9pZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJzdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xyXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xyXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9jb3JlXCIpO1xyXG5zdGVlZG9zTGljZW5zZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9saWNlbnNlXCIpO1xyXG5jbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcclxuXHJcbl9nZXRMb2NhbGUgPSAodXNlciktPlxyXG5cdGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnemgtY24nXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRlbHNlIGlmIHVzZXI/LmxvY2FsZT8udG9Mb2NhbGVMb3dlckNhc2UoKSA9PSAnZW4tdXMnXHJcblx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRlbHNlXHJcblx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRyZXR1cm4gbG9jYWxlXHJcblxyXG5nZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQgPSAodXNlcklkLCBzcGFjZUlkKS0+XHJcblx0c3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtwcm9maWxlOiAxfX0pXHJcblx0aWYgc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlXHJcblx0XHRyZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xheW91dHNcIik/LmZpbmQoe3NwYWNlOiBzcGFjZUlkLCBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGV9KS5mZXRjaCgpO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9ib290c3RyYXAvOnNwYWNlSWQvXCIsKHJlcSwgcmVzLCBuZXh0KS0+XHJcblx0dXNlcklkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddXHJcblx0c3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnBhcmFtcz8uc3BhY2VJZFxyXG5cdGlmICF1c2VySWRcclxuXHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXHJcblx0XHRcdGNvZGU6IDQwMyxcclxuXHRcdFx0ZGF0YTogbnVsbFxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKVxyXG5cdHVzZXJTZXNzaW9uID0gTWV0ZW9yLndyYXBBc3luYygoYXV0aFRva2VuLCBzcGFjZUlkLCBjYiktPlxyXG5cdFx0XHRzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdFx0Y2IocmVqZWN0LCByZXNvbHZlKVxyXG5cdFx0KShhdXRoVG9rZW4sIHNwYWNlSWQpXHJcblx0XHJcblx0dW5sZXNzIHVzZXJTZXNzaW9uXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiA1MDAsXHJcblx0XHRcdGRhdGE6IG51bGxcclxuXHRcdHJldHVyblxyXG5cclxuXHRzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge25hbWU6IDF9fSlcclxuXHJcblx0cmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xyXG4jXHRjb25zb2xlLnRpbWUoJ3RyYW5zbGF0aW9uT2JqZWN0cycpO1xyXG5cdGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtsb2NhbGU6IDF9fSkpXHJcblx0c3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3RzKGxuZywgcmVzdWx0Lm9iamVjdHMpO1xyXG4jXHRjb25zb2xlLnRpbWVFbmQoJ3RyYW5zbGF0aW9uT2JqZWN0cycpO1xyXG5cdHJlc3VsdC51c2VyID0gdXNlclNlc3Npb25cclxuXHRyZXN1bHQuc3BhY2UgPSBzcGFjZVxyXG5cdHJlc3VsdC5hcHBzID0gY2xvbmUoQ3JlYXRvci5BcHBzKVxyXG5cdHJlc3VsdC5kYXNoYm9hcmRzID0gY2xvbmUoQ3JlYXRvci5EYXNoYm9hcmRzKVxyXG5cdHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKVxyXG5cdHJlc3VsdC5vYmplY3Rfd29ya2Zsb3dzID0gTWV0ZW9yLmNhbGwgJ29iamVjdF93b3JrZmxvd3MuZ2V0Jywgc3BhY2VJZCwgdXNlcklkXHJcblx0Y29uc29sZS50aW1lKCdsaWNlbnNlMScpO1xyXG5cdHRyeVxyXG5cdFx0cmVzdWx0LmxpY2Vuc2UgPSBzdGVlZG9zTGljZW5zZS5nZXRMaWNlbnNlKHNwYWNlSWQpO1xyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IoXCJnZXRMaWNlbnNlXCIsIGUubWVzc2FnZSk7XHJcblx0Y29uc29sZS50aW1lRW5kKCdsaWNlbnNlMScpO1xyXG5cclxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxyXG5cdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXHJcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcclxuXHRcdFx0Xy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCAodiwgayktPlxyXG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZClcclxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxyXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcclxuXHRcdFx0XHRfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lXHJcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxyXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXHJcblx0XHRcdClcclxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxyXG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgY2xvbmUoZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpXHJcblx0XHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kIHJlc3VsdC5kYXNoYm9hcmRzLCBkYXRhc291cmNlLmdldERhc2hib2FyZHNDb25maWcoKVxyXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQoIHJlc3VsdC5hcHBzIHx8IHt9LCBDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSlcclxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kKCByZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpXHJcblxyXG5cdF9BcHBzID0ge31cclxuXHRfLmVhY2ggcmVzdWx0LmFwcHMsIChhcHAsIGtleSkgLT5cclxuXHRcdGlmICFhcHAuX2lkXHJcblx0XHRcdGFwcC5faWQgPSBrZXlcclxuXHRcdGlmIGFwcC5jb2RlXHJcblx0XHRcdGFwcC5fZGJpZCA9IGFwcC5faWRcclxuXHRcdFx0YXBwLl9pZCA9IGFwcC5jb2RlXHJcblx0XHRfQXBwc1thcHAuX2lkXSA9IGFwcFxyXG5cdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcclxuXHRyZXN1bHQuYXBwcyA9IF9BcHBzO1xyXG5cdGFzc2lnbmVkX21lbnVzID0gY2xvbmUocmVzdWx0LmFzc2lnbmVkX21lbnVzKTtcclxuXHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xyXG5cdHJlc3VsdC5hc3NpZ25lZF9tZW51cyA9IGFzc2lnbmVkX21lbnVzO1xyXG5cclxuXHRfRGFzaGJvYXJkcyA9IHt9XHJcblx0Xy5lYWNoIHJlc3VsdC5kYXNoYm9hcmRzLCAoZGFzaGJvYXJkLCBrZXkpIC0+XHJcblx0XHRpZiAhZGFzaGJvYXJkLl9pZFxyXG5cdFx0XHRkYXNoYm9hcmQuX2lkID0ga2V5XHJcblx0XHRfRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxyXG5cdHJlc3VsdC5kYXNoYm9hcmRzID0gX0Rhc2hib2FyZHNcclxuXHJcblx0cmVzdWx0LnBsdWdpbnMgPSBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zPygpXHJcblxyXG5cdG9iamVjdHNMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQodXNlcklkLCBzcGFjZUlkKTtcclxuXHJcblx0aWYgb2JqZWN0c0xheW91dFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNMYXlvdXQsIChvYmplY3RMYXlvdXQpLT5cclxuXHRcdFx0X29iamVjdCA9IGNsb25lKHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0pO1xyXG5cdFx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdFx0X2ZpZWxkcyA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCBvYmplY3RMYXlvdXQuZmllbGRzLCAoX2l0ZW0pLT5cclxuXHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdXHJcblx0XHRcdFx0XHRpZiBfLmhhcyhfaXRlbSwgJ2dyb3VwJylcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/Lmdyb3VwID0gX2l0ZW0uZ3JvdXBcclxuXHRcdFx0XHRcdGlmIF9pdGVtLnJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZWFkb25seSA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5kaXNhYmxlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IGZhbHNlXHJcblx0XHRcdFx0X29iamVjdC5maWVsZHMgPSBfZmllbGRzXHJcblxyXG4jXHRcdFx0XHRfYWN0aW9ucyA9IHt9O1xyXG4jXHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmFjdGlvbnMsIChhY3Rpb25OYW1lKS0+XHJcbiNcdFx0XHRcdFx0X2FjdGlvbnNbYWN0aW9uTmFtZV0gPSBfb2JqZWN0LmFjdGlvbnNbYWN0aW9uTmFtZV1cclxuI1x0XHRcdFx0X29iamVjdC5hY3Rpb25zID0gX2FjdGlvbnNcclxuXHRcdFx0XHRfb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxyXG5cdFx0XHRyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdID0gX29iamVjdFxyXG5cclxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0Y29kZTogMjAwLFxyXG5cdFx0ZGF0YTogcmVzdWx0XHJcbiIsInZhciBfZ2V0TG9jYWxlLCBjbG9uZSwgZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0LCBzdGVlZG9zQXV0aCwgc3RlZWRvc0NvcmUsIHN0ZWVkb3NJMThuLCBzdGVlZG9zTGljZW5zZTtcblxuc3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcblxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcblxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKFwiQHN0ZWVkb3MvY29yZVwiKTtcblxuc3RlZWRvc0xpY2Vuc2UgPSByZXF1aXJlKFwiQHN0ZWVkb3MvbGljZW5zZVwiKTtcblxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XG5cbl9nZXRMb2NhbGUgPSBmdW5jdGlvbih1c2VyKSB7XG4gIHZhciBsb2NhbGUsIHJlZiwgcmVmMTtcbiAgaWYgKCh1c2VyICE9IG51bGwgPyAocmVmID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICd6aC1jbicpIHtcbiAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gIH0gZWxzZSBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYxID0gdXNlci5sb2NhbGUpICE9IG51bGwgPyByZWYxLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiB2b2lkIDAgOiB2b2lkIDApID09PSAnZW4tdXMnKSB7XG4gICAgbG9jYWxlID0gXCJlblwiO1xuICB9IGVsc2Uge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfVxuICByZXR1cm4gbG9jYWxlO1xufTtcblxuZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0ID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkKSB7XG4gIHZhciByZWYsIHNwYWNlVXNlcjtcbiAgc3BhY2VVc2VyID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwic3BhY2VfdXNlcnNcIikuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgdXNlcjogdXNlcklkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIHByb2ZpbGU6IDFcbiAgICB9XG4gIH0pO1xuICBpZiAoc3BhY2VVc2VyICYmIHNwYWNlVXNlci5wcm9maWxlKSB7XG4gICAgcmV0dXJuIChyZWYgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGF5b3V0c1wiKSkgIT0gbnVsbCA/IHJlZi5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlXG4gICAgfSkuZmV0Y2goKSA6IHZvaWQgMDtcbiAgfVxufTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL2Jvb3RzdHJhcC86c3BhY2VJZC9cIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIF9BcHBzLCBfRGFzaGJvYXJkcywgYXNzaWduZWRfbWVudXMsIGF1dGhUb2tlbiwgZSwgbG5nLCBvYmplY3RzTGF5b3V0LCBwZXJtaXNzaW9ucywgcmVmLCByZXN1bHQsIHNwYWNlLCBzcGFjZUlkLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB1c2VySWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ107XG4gIHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8ICgocmVmID0gcmVxLnBhcmFtcykgIT0gbnVsbCA/IHJlZi5zcGFjZUlkIDogdm9pZCAwKTtcbiAgaWYgKCF1c2VySWQpIHtcbiAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiA0MDMsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfSk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGF1dGhUb2tlbiA9IFN0ZWVkb3MuZ2V0QXV0aFRva2VuKHJlcSwgcmVzKTtcbiAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICByZXR1cm4gc3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4oZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZXR1cm4gY2IocmVqZWN0LCByZXNvbHZlKTtcbiAgICB9KTtcbiAgfSkoYXV0aFRva2VuLCBzcGFjZUlkKTtcbiAgaWYgKCF1c2VyU2Vzc2lvbikge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDUwMCxcbiAgICAgIGRhdGE6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgc3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBuYW1lOiAxXG4gICAgfVxuICB9KTtcbiAgcmVzdWx0ID0gQ3JlYXRvci5nZXRBbGxQZXJtaXNzaW9ucyhzcGFjZUlkLCB1c2VySWQpO1xuICBsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBsb2NhbGU6IDFcbiAgICB9XG4gIH0pKTtcbiAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25PYmplY3RzKGxuZywgcmVzdWx0Lm9iamVjdHMpO1xuICByZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uO1xuICByZXN1bHQuc3BhY2UgPSBzcGFjZTtcbiAgcmVzdWx0LmFwcHMgPSBjbG9uZShDcmVhdG9yLkFwcHMpO1xuICByZXN1bHQuZGFzaGJvYXJkcyA9IGNsb25lKENyZWF0b3IuRGFzaGJvYXJkcyk7XG4gIHJlc3VsdC5vYmplY3RfbGlzdHZpZXdzID0gQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyh1c2VySWQsIHNwYWNlSWQsIHJlc3VsdC5vYmplY3RzKTtcbiAgcmVzdWx0Lm9iamVjdF93b3JrZmxvd3MgPSBNZXRlb3IuY2FsbCgnb2JqZWN0X3dvcmtmbG93cy5nZXQnLCBzcGFjZUlkLCB1c2VySWQpO1xuICBjb25zb2xlLnRpbWUoJ2xpY2Vuc2UxJyk7XG4gIHRyeSB7XG4gICAgcmVzdWx0LmxpY2Vuc2UgPSBzdGVlZG9zTGljZW5zZS5nZXRMaWNlbnNlKHNwYWNlSWQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKFwiZ2V0TGljZW5zZVwiLCBlLm1lc3NhZ2UpO1xuICB9XG4gIGNvbnNvbGUudGltZUVuZCgnbGljZW5zZTEnKTtcbiAgcGVybWlzc2lvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKHYsIHVzZXJTZXNzaW9uLCBjYikge1xuICAgIHJldHVybiB2LmdldFVzZXJPYmplY3RQZXJtaXNzaW9uKHVzZXJTZXNzaW9uKS50aGVuKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSk7XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICB2YXIgZGF0YXNvdXJjZU9iamVjdHM7XG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZGF0YXNvdXJjZU9iamVjdHMgPSBkYXRhc291cmNlLmdldE9iamVjdHMoKTtcbiAgICAgIHJldHVybiBfLmVhY2goZGF0YXNvdXJjZU9iamVjdHMsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICAgICAgdmFyIF9vYmo7XG4gICAgICAgIF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZCk7XG4gICAgICAgIF9vYmoubmFtZSA9IGs7XG4gICAgICAgIF9vYmouZGF0YWJhc2VfbmFtZSA9IG5hbWU7XG4gICAgICAgIF9vYmoucGVybWlzc2lvbnMgPSBwZXJtaXNzaW9ucyh2LCB1c2VyU2Vzc2lvbik7XG4gICAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tfb2JqLm5hbWVdID0gX29iajtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIF8uZWFjaChDcmVhdG9yLnN0ZWVkb3NTY2hlbWEuZ2V0RGF0YVNvdXJjZXMoKSwgZnVuY3Rpb24oZGF0YXNvdXJjZSwgbmFtZSkge1xuICAgIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMsIGNsb25lKGRhdGFzb3VyY2UuZ2V0QXBwc0NvbmZpZygpKSk7XG4gICAgcmV0dXJuIHJlc3VsdC5kYXNoYm9hcmRzID0gXy5leHRlbmQocmVzdWx0LmRhc2hib2FyZHMsIGRhdGFzb3VyY2UuZ2V0RGFzaGJvYXJkc0NvbmZpZygpKTtcbiAgfSk7XG4gIHJlc3VsdC5hcHBzID0gXy5leHRlbmQocmVzdWx0LmFwcHMgfHwge30sIENyZWF0b3IuZ2V0REJBcHBzKHNwYWNlSWQpKTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfLmV4dGVuZChyZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpO1xuICBfQXBwcyA9IHt9O1xuICBfLmVhY2gocmVzdWx0LmFwcHMsIGZ1bmN0aW9uKGFwcCwga2V5KSB7XG4gICAgaWYgKCFhcHAuX2lkKSB7XG4gICAgICBhcHAuX2lkID0ga2V5O1xuICAgIH1cbiAgICBpZiAoYXBwLmNvZGUpIHtcbiAgICAgIGFwcC5fZGJpZCA9IGFwcC5faWQ7XG4gICAgICBhcHAuX2lkID0gYXBwLmNvZGU7XG4gICAgfVxuICAgIHJldHVybiBfQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcbiAgcmVzdWx0LmFwcHMgPSBfQXBwcztcbiAgYXNzaWduZWRfbWVudXMgPSBjbG9uZShyZXN1bHQuYXNzaWduZWRfbWVudXMpO1xuICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xuICByZXN1bHQuYXNzaWduZWRfbWVudXMgPSBhc3NpZ25lZF9tZW51cztcbiAgX0Rhc2hib2FyZHMgPSB7fTtcbiAgXy5lYWNoKHJlc3VsdC5kYXNoYm9hcmRzLCBmdW5jdGlvbihkYXNoYm9hcmQsIGtleSkge1xuICAgIGlmICghZGFzaGJvYXJkLl9pZCkge1xuICAgICAgZGFzaGJvYXJkLl9pZCA9IGtleTtcbiAgICB9XG4gICAgcmV0dXJuIF9EYXNoYm9hcmRzW2Rhc2hib2FyZC5faWRdID0gZGFzaGJvYXJkO1xuICB9KTtcbiAgcmVzdWx0LmRhc2hib2FyZHMgPSBfRGFzaGJvYXJkcztcbiAgcmVzdWx0LnBsdWdpbnMgPSB0eXBlb2Ygc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucyA9PT0gXCJmdW5jdGlvblwiID8gc3RlZWRvc0NvcmUuZ2V0UGx1Z2lucygpIDogdm9pZCAwO1xuICBvYmplY3RzTGF5b3V0ID0gZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0KHVzZXJJZCwgc3BhY2VJZCk7XG4gIGlmIChvYmplY3RzTGF5b3V0KSB7XG4gICAgXy5lYWNoKG9iamVjdHNMYXlvdXQsIGZ1bmN0aW9uKG9iamVjdExheW91dCkge1xuICAgICAgdmFyIF9maWVsZHMsIF9vYmplY3Q7XG4gICAgICBfb2JqZWN0ID0gY2xvbmUocmVzdWx0Lm9iamVjdHNbb2JqZWN0TGF5b3V0Lm9iamVjdF9uYW1lXSk7XG4gICAgICBpZiAoX29iamVjdCkge1xuICAgICAgICBfZmllbGRzID0ge307XG4gICAgICAgIF8uZWFjaChvYmplY3RMYXlvdXQuZmllbGRzLCBmdW5jdGlvbihfaXRlbSkge1xuICAgICAgICAgIHZhciByZWYxLCByZWYyLCByZWYzLCByZWY0LCByZWY1LCByZWY2LCByZWY3O1xuICAgICAgICAgIF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdO1xuICAgICAgICAgIGlmIChfLmhhcyhfaXRlbSwgJ2dyb3VwJykpIHtcbiAgICAgICAgICAgIGlmICgocmVmMSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjEuZ3JvdXAgPSBfaXRlbS5ncm91cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKF9pdGVtLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICBpZiAoKHJlZjIgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYyLnJlYWRvbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKHJlZjMgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYzLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjQgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjQucmVxdWlyZWQgPSB0cnVlIDogdm9pZCAwO1xuICAgICAgICAgIH0gZWxzZSBpZiAoX2l0ZW0ucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGlmICgocmVmNSA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjUucmVhZG9ubHkgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChyZWY2ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmNi5kaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gKHJlZjcgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCA/IHJlZjcucmVxdWlyZWQgPSBmYWxzZSA6IHZvaWQgMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBfb2JqZWN0LmZpZWxkcyA9IF9maWVsZHM7XG4gICAgICAgIF9vYmplY3QuYWxsb3dfYWN0aW9ucyA9IG9iamVjdExheW91dC5hY3Rpb25zIHx8IFtdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0gPSBfb2JqZWN0O1xuICAgIH0pO1xuICB9XG4gIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgY29kZTogMjAwLFxuICAgIGRhdGE6IHJlc3VsdFxuICB9KTtcbn0pO1xuIiwiSnNvblJvdXRlcy5hZGQgJ3Bvc3QnLCAnL2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHR0cnlcclxuXHRcdGJvZHkgPSBcIlwiXHJcblx0XHRyZXEub24oJ2RhdGEnLCAoY2h1bmspLT5cclxuXHRcdFx0Ym9keSArPSBjaHVua1xyXG5cdFx0KVxyXG5cdFx0cmVxLm9uKCdlbmQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgoKS0+XHJcblx0XHRcdFx0eG1sMmpzID0gcmVxdWlyZSgneG1sMmpzJylcclxuXHRcdFx0XHRwYXJzZXIgPSBuZXcgeG1sMmpzLlBhcnNlcih7IHRyaW06dHJ1ZSwgZXhwbGljaXRBcnJheTpmYWxzZSwgZXhwbGljaXRSb290OmZhbHNlIH0pXHJcblx0XHRcdFx0cGFyc2VyLnBhcnNlU3RyaW5nKGJvZHksIChlcnIsIHJlc3VsdCktPlxyXG5cdFx0XHRcdFx0XHQjIOeJueWIq+aPkOmGku+8muWVhuaIt+ezu+e7n+WvueS6juaUr+S7mOe7k+aenOmAmuefpeeahOWGheWuueS4gOWumuimgeWBmuetvuWQjemqjOivgSzlubbmoKHpqozov5Tlm57nmoTorqLljZXph5Hpop3mmK/lkKbkuI7llYbmiLfkvqfnmoTorqLljZXph5Hpop3kuIDoh7TvvIzpmLLmraLmlbDmja7ms4TmvI/lr7zoh7Tlh7rnjrDigJzlgYfpgJrnn6XigJ3vvIzpgKDmiJDotYTph5HmjZ/lpLFcclxuXHRcdFx0XHRcdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5JylcclxuXHRcdFx0XHRcdFx0d3hwYXkgPSBXWFBheSh7XHJcblx0XHRcdFx0XHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxyXG5cdFx0XHRcdFx0XHRcdG1jaF9pZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcubWNoX2lkLFxyXG5cdFx0XHRcdFx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSlcclxuXHRcdFx0XHRcdFx0YXR0YWNoID0gSlNPTi5wYXJzZShyZXN1bHQuYXR0YWNoKVxyXG5cdFx0XHRcdFx0XHRjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZFxyXG5cdFx0XHRcdFx0XHRicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpXHJcblx0XHRcdFx0XHRcdGlmIGJwciBhbmQgYnByLnRvdGFsX2ZlZSBpcyBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgYW5kIHNpZ24gaXMgcmVzdWx0LnNpZ25cclxuXHRcdFx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7X2lkOiBjb2RlX3VybF9pZH0sIHskc2V0OiB7cGFpZDogdHJ1ZX19KVxyXG5cdFx0XHRcdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHQpXHJcblx0XHRcdCksIChlcnIpLT5cclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSdcclxuXHRcdFx0KVxyXG5cdFx0KVxyXG5cdFx0XHJcblx0Y2F0Y2ggZVxyXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdHJlcy53cml0ZUhlYWQoMjAwLCB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnfSlcclxuXHRyZXMuZW5kKCc8eG1sPjxyZXR1cm5fY29kZT48IVtDREFUQVtTVUNDRVNTXV0+PC9yZXR1cm5fY29kZT48L3htbD4nKVxyXG5cclxuXHRcdCIsIkpzb25Sb3V0ZXMuYWRkKCdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYm9keSwgZTtcbiAgdHJ5IHtcbiAgICBib2R5ID0gXCJcIjtcbiAgICByZXEub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuICAgICAgcmV0dXJuIGJvZHkgKz0gY2h1bms7XG4gICAgfSk7XG4gICAgcmVxLm9uKCdlbmQnLCBNZXRlb3IuYmluZEVudmlyb25tZW50KChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBwYXJzZXIsIHhtbDJqcztcbiAgICAgIHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpO1xuICAgICAgcGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoe1xuICAgICAgICB0cmltOiB0cnVlLFxuICAgICAgICBleHBsaWNpdEFycmF5OiBmYWxzZSxcbiAgICAgICAgZXhwbGljaXRSb290OiBmYWxzZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlU3RyaW5nKGJvZHksIGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICAgIHZhciBXWFBheSwgYXR0YWNoLCBicHIsIGNvZGVfdXJsX2lkLCBzaWduLCB3eHBheTtcbiAgICAgICAgV1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jyk7XG4gICAgICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgICAgIGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcbiAgICAgICAgICBtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcbiAgICAgICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICAgICAgfSk7XG4gICAgICAgIHNpZ24gPSB3eHBheS5zaWduKF8uY2xvbmUocmVzdWx0KSk7XG4gICAgICAgIGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaCk7XG4gICAgICAgIGNvZGVfdXJsX2lkID0gYXR0YWNoLmNvZGVfdXJsX2lkO1xuICAgICAgICBicHIgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmRPbmUoY29kZV91cmxfaWQpO1xuICAgICAgICBpZiAoYnByICYmIGJwci50b3RhbF9mZWUgPT09IE51bWJlcihyZXN1bHQudG90YWxfZmVlKSAmJiBzaWduID09PSByZXN1bHQuc2lnbikge1xuICAgICAgICAgIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogY29kZV91cmxfaWRcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkoYnByLnNwYWNlLCBicHIubW9kdWxlcywgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpLCBicHIuY3JlYXRlZF9ieSwgYnByLmVuZF9kYXRlLCBicHIudXNlcl9jb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGFwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUnKTtcbiAgICB9KSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gIH1cbiAgcmVzLndyaXRlSGVhZCgyMDAsIHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3htbCdcbiAgfSk7XG4gIHJldHVybiByZXMuZW5kKCc8eG1sPjxyZXR1cm5fY29kZT48IVtDREFUQVtTVUNDRVNTXV0+PC9yZXR1cm5fY29kZT48L3htbD4nKTtcbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRnZXRfY29udGFjdHNfbGltaXQ6IChzcGFjZSktPlxyXG5cdFx0IyDmoLnmja7lvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4fvvIzmn6Xor6Llh7rlvZPliY3nlKjmiLfpmZDlrprnmoTnu4Tnu4fmn6XnnIvojIPlm7RcclxuXHRcdCMg6L+U5Zue55qEaXNMaW1pdOS4unRydWXooajnpLrpmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlnKjnu4Tnu4fojIPlm7TvvIxvcmdhbml6YXRpb25z5YC86K6w5b2V6aKd5aSW55qE57uE57uH6IyD5Zu0XHJcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLpmYWxzZeihqOekuuS4jemZkOWumue7hOe7h+iMg+WbtO+8jOWNs+ihqOekuuiDveeci+aVtOS4quW3peS9nOWMuueahOe7hOe7h1xyXG5cdFx0IyDpu5jorqTov5Tlm57pmZDlrprlnKjlvZPliY3nlKjmiLfmiYDlsZ7nu4Tnu4dcclxuXHRcdGNoZWNrIHNwYWNlLCBTdHJpbmdcclxuXHRcdHJlVmFsdWUgPVxyXG5cdFx0XHRpc0xpbWl0OiB0cnVlXHJcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9uczogW11cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gcmVWYWx1ZVxyXG5cdFx0aXNMaW1pdCA9IGZhbHNlXHJcblx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxyXG5cdFx0c2V0dGluZyA9IGRiLnNwYWNlX3NldHRpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZSwga2V5OiBcImNvbnRhY3RzX3ZpZXdfbGltaXRzXCJ9KVxyXG5cdFx0bGltaXRzID0gc2V0dGluZz8udmFsdWVzIHx8IFtdO1xyXG5cclxuXHRcdGlmIGxpbWl0cy5sZW5ndGhcclxuXHRcdFx0bXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHVzZXJzOiB0aGlzLnVzZXJJZH0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdFx0XHRteU9yZ0lkcyA9IG15T3Jncy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4uX2lkXHJcblx0XHRcdHVubGVzcyBteU9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0XHRyZXR1cm4gcmVWYWx1ZVxyXG5cdFx0XHRcclxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBbXVxyXG5cdFx0XHRmb3IgbGltaXQgaW4gbGltaXRzXHJcblx0XHRcdFx0ZnJvbXMgPSBsaW1pdC5mcm9tc1xyXG5cdFx0XHRcdHRvcyA9IGxpbWl0LnRvc1xyXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgcGFyZW50czogeyRpbjogZnJvbXN9fSwge2ZpZWxkczp7X2lkOiAxfX0pXHJcblx0XHRcdFx0ZnJvbXNDaGlsZHJlbklkcyA9IGZyb21zQ2hpbGRyZW4/Lm1hcCAobikgLT5cclxuXHRcdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cdFx0XHRcdGZvciBteU9yZ0lkIGluIG15T3JnSWRzXHJcblx0XHRcdFx0XHR0ZW1wSXNMaW1pdCA9IGZhbHNlXHJcblx0XHRcdFx0XHRpZiBmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTFcclxuXHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdGlmIGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXHJcblx0XHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXHJcblx0XHRcdFx0XHRpZiB0ZW1wSXNMaW1pdFxyXG5cdFx0XHRcdFx0XHRpc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCB0b3NcclxuXHRcdFx0XHRcdFx0bXlMaXRtaXRPcmdJZHMucHVzaCBteU9yZ0lkXHJcblxyXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IF8udW5pcSBteUxpdG1pdE9yZ0lkc1xyXG5cdFx0XHRpZiBteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0XHQjIOWmguaenOWPl+mZkOeahOe7hOe7h+S4quaVsOWwj+S6jueUqOaIt+aJgOWxnue7hOe7h+eahOS4quaVsO+8jOWImeivtOaYjuW9k+WJjeeUqOaIt+iHs+WwkeacieS4gOS4que7hOe7h+aYr+S4jeWPl+mZkOeahFxyXG5cdFx0XHRcdGlzTGltaXQgPSBmYWxzZVxyXG5cdFx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEgXy5mbGF0dGVuIG91dHNpZGVfb3JnYW5pemF0aW9uc1xyXG5cclxuXHRcdGlmIGlzTGltaXRcclxuXHRcdFx0dG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIF9pZDogeyRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zfX0sIHtmaWVsZHM6e19pZDogMSwgcGFyZW50czogMX19KS5mZXRjaCgpXHJcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ54i25a2Q6IqC54K55YWz57O755qE6IqC54K5562b6YCJ5Ye65p2l5bm25Y+W5Ye65pyA5aSW5bGC6IqC54K5XHJcblx0XHRcdCMg5oqKb3V0c2lkZV9vcmdhbml6YXRpb25z5Lit5pyJ5bGe5LqO55So5oi35omA5bGe57uE57uH55qE5a2Q5a2Z6IqC54K555qE6IqC54K55Yig6ZmkXHJcblx0XHRcdG9yZ3MgPSBfLmZpbHRlciB0b09yZ3MsIChvcmcpIC0+XHJcblx0XHRcdFx0cGFyZW50cyA9IG9yZy5wYXJlbnRzIG9yIFtdXHJcblx0XHRcdFx0cmV0dXJuIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG91dHNpZGVfb3JnYW5pemF0aW9ucykubGVuZ3RoIDwgMSBhbmQgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDFcclxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0cmV0dXJuIG4uX2lkXHJcblxyXG5cdFx0cmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdFxyXG5cdFx0cmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnNcclxuXHRcdHJldHVybiByZVZhbHVlXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0X2NvbnRhY3RzX2xpbWl0OiBmdW5jdGlvbihzcGFjZSkge1xuICAgIHZhciBmcm9tcywgZnJvbXNDaGlsZHJlbiwgZnJvbXNDaGlsZHJlbklkcywgaSwgaXNMaW1pdCwgaiwgbGVuLCBsZW4xLCBsaW1pdCwgbGltaXRzLCBteUxpdG1pdE9yZ0lkcywgbXlPcmdJZCwgbXlPcmdJZHMsIG15T3Jncywgb3Jncywgb3V0c2lkZV9vcmdhbml6YXRpb25zLCByZVZhbHVlLCBzZXR0aW5nLCB0ZW1wSXNMaW1pdCwgdG9PcmdzLCB0b3M7XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgcmVWYWx1ZSA9IHtcbiAgICAgIGlzTGltaXQ6IHRydWUsXG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG4gICAgfTtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICB9XG4gICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgIHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wiXG4gICAgfSk7XG4gICAgbGltaXRzID0gKHNldHRpbmcgIT0gbnVsbCA/IHNldHRpbmcudmFsdWVzIDogdm9pZCAwKSB8fCBbXTtcbiAgICBpZiAobGltaXRzLmxlbmd0aCkge1xuICAgICAgbXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICB1c2VyczogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXlPcmdJZHMgPSBteU9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBpZiAoIW15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaW1pdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdHNbaV07XG4gICAgICAgIGZyb21zID0gbGltaXQuZnJvbXM7XG4gICAgICAgIHRvcyA9IGxpbWl0LnRvcztcbiAgICAgICAgZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgIHBhcmVudHM6IHtcbiAgICAgICAgICAgICRpbjogZnJvbXNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuICE9IG51bGwgPyBmcm9tc0NoaWxkcmVuLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KSA6IHZvaWQgMDtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IG15T3JnSWRzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIG15T3JnSWQgPSBteU9yZ0lkc1tqXTtcbiAgICAgICAgICB0ZW1wSXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRlbXBJc0xpbWl0KSB7XG4gICAgICAgICAgICBpc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoKHRvcyk7XG4gICAgICAgICAgICBteUxpdG1pdE9yZ0lkcy5wdXNoKG15T3JnSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEobXlMaXRtaXRPcmdJZHMpO1xuICAgICAgaWYgKG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxKF8uZmxhdHRlbihvdXRzaWRlX29yZ2FuaXphdGlvbnMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTGltaXQpIHtcbiAgICAgIHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgcGFyZW50czogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgb3JncyA9IF8uZmlsdGVyKHRvT3JncywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgIHZhciBwYXJlbnRzO1xuICAgICAgICBwYXJlbnRzID0gb3JnLnBhcmVudHMgfHwgW107XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgJiYgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDE7XG4gICAgICB9KTtcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXQ7XG4gICAgcmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnM7XG4gICAgcmV0dXJuIHJlVmFsdWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMoe1xyXG4gICAgc2V0S2V5VmFsdWU6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBjaGVjayhrZXksIFN0cmluZyk7XHJcbiAgICAgICAgY2hlY2sodmFsdWUsIE9iamVjdCk7XHJcblxyXG4gICAgICAgIG9iaiA9IHt9O1xyXG4gICAgICAgIG9iai51c2VyID0gdGhpcy51c2VySWQ7XHJcbiAgICAgICAgb2JqLmtleSA9IGtleTtcclxuICAgICAgICBvYmoudmFsdWUgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgdmFyIGMgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kKHtcclxuICAgICAgICAgICAgdXNlcjogdGhpcy51c2VySWQsXHJcbiAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgfSkuY291bnQoKTtcclxuICAgICAgICBpZiAoYyA+IDApIHtcclxuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMudXBkYXRlKHtcclxuICAgICAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICAgICAga2V5OiBrZXlcclxuICAgICAgICAgICAgfSwge1xyXG4gICAgICAgICAgICAgICAgJHNldDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy5pbnNlcnQob2JqKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59KSIsIk1ldGVvci5tZXRob2RzXHJcblx0YmlsbGluZ19zZXR0bGV1cDogKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkPVwiXCIpLT5cclxuXHRcdGNoZWNrKGFjY291bnRpbmdfbW9udGgsIFN0cmluZylcclxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpXHJcblxyXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdGhpcy51c2VySWR9LCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxyXG5cclxuXHRcdGlmIG5vdCB1c2VyLmlzX2Nsb3VkYWRtaW5cclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0Y29uc29sZS50aW1lICdiaWxsaW5nJ1xyXG5cdFx0c3BhY2VzID0gW11cclxuXHRcdGlmIHNwYWNlX2lkXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHNwYWNlX2lkLCBpc19wYWlkOiB0cnVlfSwge2ZpZWxkczoge19pZDogMX19KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdHJlc3VsdCA9IFtdXHJcblx0XHRzcGFjZXMuZm9yRWFjaCAocykgLT5cclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhY2NvdW50aW5nX21vbnRoLCBzLl9pZClcclxuXHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0ZSA9IHt9XHJcblx0XHRcdFx0ZS5faWQgPSBzLl9pZFxyXG5cdFx0XHRcdGUubmFtZSA9IHMubmFtZVxyXG5cdFx0XHRcdGUuZXJyID0gZXJyXHJcblx0XHRcdFx0cmVzdWx0LnB1c2ggZVxyXG5cdFx0aWYgcmVzdWx0Lmxlbmd0aCA+IDBcclxuXHRcdFx0Y29uc29sZS5lcnJvciByZXN1bHRcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0RW1haWwgPSBQYWNrYWdlLmVtYWlsLkVtYWlsXHJcblx0XHRcdFx0RW1haWwuc2VuZFxyXG5cdFx0XHRcdFx0dG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJ1xyXG5cdFx0XHRcdFx0ZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbVxyXG5cdFx0XHRcdFx0c3ViamVjdDogJ2JpbGxpbmcgc2V0dGxldXAgcmVzdWx0J1xyXG5cdFx0XHRcdFx0dGV4dDogSlNPTi5zdHJpbmdpZnkoJ3Jlc3VsdCc6IHJlc3VsdClcclxuXHRcdFx0Y2F0Y2ggZXJyXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnJcclxuXHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyciLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfc2V0dGxldXA6IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gICAgdmFyIEVtYWlsLCBlcnIsIHJlc3VsdCwgc3BhY2VzLCB1c2VyO1xuICAgIGlmIChzcGFjZV9pZCA9PSBudWxsKSB7XG4gICAgICBzcGFjZV9pZCA9IFwiXCI7XG4gICAgfVxuICAgIGNoZWNrKGFjY291bnRpbmdfbW9udGgsIFN0cmluZyk7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS50aW1lKCdiaWxsaW5nJyk7XG4gICAgc3BhY2VzID0gW107XG4gICAgaWYgKHNwYWNlX2lkKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIF9pZDogc3BhY2VfaWQsXG4gICAgICAgIGlzX3BhaWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGlzX3BhaWQ6IHRydWVcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXN1bHQgPSBbXTtcbiAgICBzcGFjZXMuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICB2YXIgZSwgZXJyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGUgPSB7fTtcbiAgICAgICAgZS5faWQgPSBzLl9pZDtcbiAgICAgICAgZS5uYW1lID0gcy5uYW1lO1xuICAgICAgICBlLmVyciA9IGVycjtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5wdXNoKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChyZXN1bHQubGVuZ3RoID4gMCkge1xuICAgICAgY29uc29sZS5lcnJvcihyZXN1bHQpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgRW1haWwgPSBQYWNrYWdlLmVtYWlsLkVtYWlsO1xuICAgICAgICBFbWFpbC5zZW5kKHtcbiAgICAgICAgICB0bzogJ3N1cHBvcnRAc3RlZWRvcy5jb20nLFxuICAgICAgICAgIGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb20sXG4gICAgICAgICAgc3ViamVjdDogJ2JpbGxpbmcgc2V0dGxldXAgcmVzdWx0JyxcbiAgICAgICAgICB0ZXh0OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAncmVzdWx0JzogcmVzdWx0XG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlcnIgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nJyk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRzZXRVc2VybmFtZTogKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkgLT5cclxuXHRcdGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xyXG5cdFx0Y2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XHJcblxyXG5cdFx0aWYgIVN0ZWVkb3MuaXNTcGFjZUFkbWluKHNwYWNlX2lkLCBNZXRlb3IudXNlcklkKCkpIGFuZCB1c2VyX2lkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpXHJcblxyXG5cdFx0aWYgbm90IE1ldGVvci51c2VySWQoKVxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwnZXJyb3ItaW52YWxpZC11c2VyJylcclxuXHJcblx0XHR1bmxlc3MgdXNlcl9pZFxyXG5cdFx0XHR1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWRcclxuXHJcblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxyXG5cclxuXHRcdGlmIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJwZW5kaW5nXCIgb3Igc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInJlZnVzZWRcIlxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIilcclxuXHJcblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdXNlcl9pZH0sIHskc2V0OiB7dXNlcm5hbWU6IHVzZXJuYW1lfX0pXHJcblxyXG5cdFx0cmV0dXJuIHVzZXJuYW1lXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0VXNlcm5hbWU6IGZ1bmN0aW9uKHNwYWNlX2lkLCB1c2VybmFtZSwgdXNlcl9pZCkge1xuICAgIHZhciBzcGFjZVVzZXI7XG4gICAgY2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG4gICAgaWYgKCFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSAmJiB1c2VyX2lkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKTtcbiAgICB9XG4gICAgaWYgKCFNZXRlb3IudXNlcklkKCkpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnZXJyb3ItaW52YWxpZC11c2VyJyk7XG4gICAgfVxuICAgIGlmICghdXNlcl9pZCkge1xuICAgICAgdXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKTtcbiAgICB9XG4gICAgZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0sIHtcbiAgICAgICRzZXQ6IHtcbiAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHVzZXJuYW1lO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0YmlsbGluZ19yZWNoYXJnZTogKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxyXG5cdFx0Y2hlY2sgdG90YWxfZmVlLCBOdW1iZXJcclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmcgXHJcblx0XHRjaGVjayBuZXdfaWQsIFN0cmluZyBcclxuXHRcdGNoZWNrIG1vZHVsZV9uYW1lcywgQXJyYXkgXHJcblx0XHRjaGVjayBlbmRfZGF0ZSwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgdXNlcl9jb3VudCwgTnVtYmVyIFxyXG5cclxuXHRcdHVzZXJfaWQgPSB0aGlzLnVzZXJJZFxyXG5cclxuXHRcdGxpc3RwcmljZXMgPSAwXHJcblx0XHRvcmRlcl9ib2R5ID0gW11cclxuXHRcdGRiLm1vZHVsZXMuZmluZCh7bmFtZTogeyRpbjogbW9kdWxlX25hbWVzfX0pLmZvckVhY2ggKG0pLT5cclxuXHRcdFx0bGlzdHByaWNlcyArPSBtLmxpc3RwcmljZV9ybWJcclxuXHRcdFx0b3JkZXJfYm9keS5wdXNoIG0ubmFtZV96aFxyXG5cclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblx0XHRpZiBub3Qgc3BhY2UuaXNfcGFpZFxyXG5cdFx0XHRzcGFjZV91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6c3BhY2VfaWR9KS5jb3VudCgpXHJcblx0XHRcdG9uZV9tb250aF95dWFuID0gc3BhY2VfdXNlcl9jb3VudCAqIGxpc3RwcmljZXNcclxuXHRcdFx0aWYgdG90YWxfZmVlIDwgb25lX21vbnRoX3l1YW4qMTAwXHJcblx0XHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvciAnZXJyb3IhJywgXCLlhYXlgLzph5Hpop3lupTkuI3lsJHkuo7kuIDkuKrmnIjmiYDpnIDotLnnlKjvvJrvv6Uje29uZV9tb250aF95dWFufVwiXHJcblxyXG5cdFx0cmVzdWx0X29iaiA9IHt9XHJcblxyXG5cdFx0YXR0YWNoID0ge31cclxuXHRcdGF0dGFjaC5jb2RlX3VybF9pZCA9IG5ld19pZFxyXG5cdFx0V1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5JylcclxuXHJcblx0XHR3eHBheSA9IFdYUGF5KHtcclxuXHRcdFx0YXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxyXG5cdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcclxuXHRcdFx0cGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5ICPlvq7kv6HllYbmiLflubPlj7BBUEnlr4bpkqVcclxuXHRcdH0pXHJcblxyXG5cdFx0d3hwYXkuY3JlYXRlVW5pZmllZE9yZGVyKHtcclxuXHRcdFx0Ym9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcclxuXHRcdFx0b3V0X3RyYWRlX25vOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXHJcblx0XHRcdHRvdGFsX2ZlZTogdG90YWxfZmVlLFxyXG5cdFx0XHRzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcclxuXHRcdFx0bm90aWZ5X3VybDogTWV0ZW9yLmFic29sdXRlVXJsKCkgKyAnYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JyxcclxuXHRcdFx0dHJhZGVfdHlwZTogJ05BVElWRScsXHJcblx0XHRcdHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcclxuXHRcdFx0YXR0YWNoOiBKU09OLnN0cmluZ2lmeShhdHRhY2gpXHJcblx0XHR9LCBNZXRlb3IuYmluZEVudmlyb25tZW50KCgoZXJyLCByZXN1bHQpIC0+IFxyXG5cdFx0XHRcdGlmIGVyciBcclxuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyLnN0YWNrXHJcblx0XHRcdFx0aWYgcmVzdWx0XHJcblx0XHRcdFx0XHRvYmogPSB7fVxyXG5cdFx0XHRcdFx0b2JqLl9pZCA9IG5ld19pZFxyXG5cdFx0XHRcdFx0b2JqLmNyZWF0ZWQgPSBuZXcgRGF0ZVxyXG5cdFx0XHRcdFx0b2JqLmluZm8gPSByZXN1bHRcclxuXHRcdFx0XHRcdG9iai50b3RhbF9mZWUgPSB0b3RhbF9mZWVcclxuXHRcdFx0XHRcdG9iai5jcmVhdGVkX2J5ID0gdXNlcl9pZFxyXG5cdFx0XHRcdFx0b2JqLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0XHRcdG9iai5wYWlkID0gZmFsc2VcclxuXHRcdFx0XHRcdG9iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXHJcblx0XHRcdFx0XHRvYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxyXG5cdFx0XHRcdFx0b2JqLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XHJcblx0XHRcdFx0XHRkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopXHJcblx0XHRcdCksIChlKS0+XHJcblx0XHRcdFx0Y29uc29sZS5sb2cgJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBiaWxsaW5nX3JlY2hhcmdlLmNvZmZlZSdcclxuXHRcdFx0XHRjb25zb2xlLmxvZyBlLnN0YWNrXHJcblx0XHRcdClcclxuXHRcdClcclxuXHJcblx0XHRcclxuXHRcdHJldHVybiBcInN1Y2Nlc3NcIiIsIk1ldGVvci5tZXRob2RzKHtcbiAgYmlsbGluZ19yZWNoYXJnZTogZnVuY3Rpb24odG90YWxfZmVlLCBzcGFjZV9pZCwgbmV3X2lkLCBtb2R1bGVfbmFtZXMsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gICAgdmFyIFdYUGF5LCBhdHRhY2gsIGxpc3RwcmljZXMsIG9uZV9tb250aF95dWFuLCBvcmRlcl9ib2R5LCByZXN1bHRfb2JqLCBzcGFjZSwgc3BhY2VfdXNlcl9jb3VudCwgdXNlcl9pZCwgd3hwYXk7XG4gICAgY2hlY2sodG90YWxfZmVlLCBOdW1iZXIpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKG5ld19pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhtb2R1bGVfbmFtZXMsIEFycmF5KTtcbiAgICBjaGVjayhlbmRfZGF0ZSwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VyX2NvdW50LCBOdW1iZXIpO1xuICAgIHVzZXJfaWQgPSB0aGlzLnVzZXJJZDtcbiAgICBsaXN0cHJpY2VzID0gMDtcbiAgICBvcmRlcl9ib2R5ID0gW107XG4gICAgZGIubW9kdWxlcy5maW5kKHtcbiAgICAgIG5hbWU6IHtcbiAgICAgICAgJGluOiBtb2R1bGVfbmFtZXNcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICAgIGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iO1xuICAgICAgcmV0dXJuIG9yZGVyX2JvZHkucHVzaChtLm5hbWVfemgpO1xuICAgIH0pO1xuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICAgIGlmICghc3BhY2UuaXNfcGFpZCkge1xuICAgICAgc3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgICBvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzO1xuICAgICAgaWYgKHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuICogMTAwKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lXCIgKyBvbmVfbW9udGhfeXVhbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdF9vYmogPSB7fTtcbiAgICBhdHRhY2ggPSB7fTtcbiAgICBhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWQ7XG4gICAgV1hQYXkgPSByZXF1aXJlKCd3ZWl4aW4tcGF5Jyk7XG4gICAgd3hwYXkgPSBXWFBheSh7XG4gICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICBtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcbiAgICAgIHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleVxuICAgIH0pO1xuICAgIHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XG4gICAgICBib2R5OiBvcmRlcl9ib2R5LmpvaW4oXCIsXCIpLFxuICAgICAgb3V0X3RyYWRlX25vOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXG4gICAgICB0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcbiAgICAgIHNwYmlsbF9jcmVhdGVfaXA6ICcxMjcuMC4wLjEnLFxuICAgICAgbm90aWZ5X3VybDogTWV0ZW9yLmFic29sdXRlVXJsKCkgKyAnYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JyxcbiAgICAgIHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxuICAgICAgcHJvZHVjdF9pZDogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgYXR0YWNoOiBKU09OLnN0cmluZ2lmeShhdHRhY2gpXG4gICAgfSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgIHZhciBvYmo7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgb2JqID0ge307XG4gICAgICAgIG9iai5faWQgPSBuZXdfaWQ7XG4gICAgICAgIG9iai5jcmVhdGVkID0gbmV3IERhdGU7XG4gICAgICAgIG9iai5pbmZvID0gcmVzdWx0O1xuICAgICAgICBvYmoudG90YWxfZmVlID0gdG90YWxfZmVlO1xuICAgICAgICBvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWQ7XG4gICAgICAgIG9iai5zcGFjZSA9IHNwYWNlX2lkO1xuICAgICAgICBvYmoucGFpZCA9IGZhbHNlO1xuICAgICAgICBvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgICAgICAgb2JqLmVuZF9kYXRlID0gZW5kX2RhdGU7XG4gICAgICAgIG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgICAgICAgcmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuaW5zZXJ0KG9iaik7XG4gICAgICB9XG4gICAgfSksIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUnKTtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIFwic3VjY2Vzc1wiO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X3NwYWNlX3VzZXJfY291bnQ6IChzcGFjZV9pZCktPlxyXG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xyXG5cdFx0dXNlcl9jb3VudF9pbmZvID0gbmV3IE9iamVjdFxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLnRvdGFsX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWR9KS5jb3VudCgpXHJcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdHJldHVybiB1c2VyX2NvdW50X2luZm8iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGNyZWF0ZV9zZWNyZXQ6IChuYW1lKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcclxuXHJcblx0cmVtb3ZlX3NlY3JldDogKHRva2VuKS0+XHJcblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcclxuXHJcblx0XHRjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKVxyXG5cclxuXHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB0aGlzLnVzZXJJZH0sIHskcHVsbDoge1wic2VjcmV0c1wiOiB7aGFzaGVkVG9rZW46IGhhc2hlZFRva2VufX19KVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGNyZWF0ZV9zZWNyZXQ6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkYi51c2Vycy5jcmVhdGVfc2VjcmV0KHRoaXMudXNlcklkLCBuYW1lKTtcbiAgfSxcbiAgcmVtb3ZlX3NlY3JldDogZnVuY3Rpb24odG9rZW4pIHtcbiAgICB2YXIgaGFzaGVkVG9rZW47XG4gICAgaWYgKCF0aGlzLnVzZXJJZCB8fCAhdG9rZW4pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pO1xuICAgIGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pO1xuICAgIHJldHVybiBkYi51c2Vycy51cGRhdGUoe1xuICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgIH0sIHtcbiAgICAgICRwdWxsOiB7XG4gICAgICAgIFwic2VjcmV0c1wiOiB7XG4gICAgICAgICAgaGFzaGVkVG9rZW46IGhhc2hlZFRva2VuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cclxuICAgICAgICBjaGVjayBzcGFjZUlkLCBTdHJpbmdcclxuICAgICAgICBjaGVjayB1c2VySWQsIFN0cmluZ1xyXG5cclxuICAgICAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7c3BhY2U6IHNwYWNlSWQsIHVzZXI6IHVzZXJJZH0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb25zOiAxfX0pXHJcbiAgICAgICAgaWYgIWN1clNwYWNlVXNlclxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcclxuXHJcbiAgICAgICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xyXG4gICAgICAgICAgICBfaWQ6IHtcclxuICAgICAgICAgICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcclxuXHJcbiAgICAgICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7IHNwYWNlOiBzcGFjZUlkIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcclxuICAgICAgICBfLmVhY2ggb3dzLChvKSAtPlxyXG4gICAgICAgICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxyXG4gICAgICAgICAgICBpZiBmbFxyXG4gICAgICAgICAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lXHJcbiAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxyXG5cclxuICAgICAgICAgICAgICAgIHBlcm1zID0gZmwucGVybXNcclxuICAgICAgICAgICAgICAgIGlmIHBlcm1zXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgcGVybXMudXNlcnNfY2FuX2FkZCAmJiBwZXJtcy51c2Vyc19jYW5fYWRkLmluY2x1ZGVzKHVzZXJJZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIG9yZ2FuaXphdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBfLnNvbWUgb3JnYW5pemF0aW9ucywgKG9yZyktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG5cclxuICAgICAgICBvd3MgPSBvd3MuZmlsdGVyIChuKS0+XHJcbiAgICAgICAgICAgIHJldHVybiBuLmZsb3dfbmFtZVxyXG5cclxuICAgICAgICByZXR1cm4gb3dzIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAnb2JqZWN0X3dvcmtmbG93cy5nZXQnOiBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgY3VyU3BhY2VVc2VyLCBvcmdhbml6YXRpb25zLCBvd3M7XG4gICAgY2hlY2soc3BhY2VJZCwgU3RyaW5nKTtcbiAgICBjaGVjayh1c2VySWQsIFN0cmluZyk7XG4gICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghY3VyU3BhY2VVc2VyKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYXV0aG9yaXplZCcpO1xuICAgIH1cbiAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9uc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBwYXJlbnRzOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9iamVjdF9uYW1lOiAxLFxuICAgICAgICBmbG93X2lkOiAxLFxuICAgICAgICBzcGFjZTogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgXy5lYWNoKG93cywgZnVuY3Rpb24obykge1xuICAgICAgdmFyIGZsLCBwZXJtcztcbiAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoby5mbG93X2lkLCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmwpIHtcbiAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0U3BhY2VVc2VyUGFzc3dvcmQ6IChzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIC0+XHJcblx0XHRpZiAhdGhpcy51c2VySWRcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXHJcblx0XHRcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe19pZDogc3BhY2VfaWR9KVxyXG5cdFx0aXNTcGFjZUFkbWluID0gc3BhY2U/LmFkbWlucz8uaW5jbHVkZXModGhpcy51c2VySWQpXHJcblxyXG5cdFx0dW5sZXNzIGlzU3BhY2VBZG1pblxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcclxuXHJcblx0XHRzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtfaWQ6IHNwYWNlX3VzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXHJcblx0XHR1c2VyX2lkID0gc3BhY2VVc2VyLnVzZXI7XHJcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxyXG5cdFx0Y3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS55a+G56CBXCIpXHJcblxyXG5cdFx0U3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKVxyXG5cclxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHBhc3N3b3JkLCB7bG9nb3V0OiB0cnVlfSlcclxuXHJcblx0XHQjIOWmguaenOeUqOaIt+aJi+acuuWPt+mAmui/h+mqjOivge+8jOWwseWPkeefreS/oeaPkOmGklxyXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXHJcblx0XHRcdGxhbmcgPSAnZW4nXHJcblx0XHRcdGlmIHVzZXJDUC5sb2NhbGUgaXMgJ3poLWNuJ1xyXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXHJcblx0XHRcdFNNU1F1ZXVlLnNlbmRcclxuXHRcdFx0XHRGb3JtYXQ6ICdKU09OJyxcclxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcclxuXHRcdFx0XHRQYXJhbVN0cmluZzogJycsXHJcblx0XHRcdFx0UmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxyXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcclxuXHRcdFx0XHRUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxyXG5cdFx0XHRcdG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxyXG5cclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBzZXRTcGFjZVVzZXJQYXNzd29yZDogZnVuY3Rpb24oc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSB7XG4gICAgdmFyIGN1cnJlbnRVc2VyLCBpc1NwYWNlQWRtaW4sIGxhbmcsIHJlZiwgc3BhY2UsIHNwYWNlVXNlciwgdXNlckNQLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaXNTcGFjZUFkbWluID0gc3BhY2UgIT0gbnVsbCA/IChyZWYgPSBzcGFjZS5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModGhpcy51c2VySWQpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIGlmICghaXNTcGFjZUFkbWluKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV91c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgdXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xuICAgIHVzZXJDUCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSk7XG4gICAgY3VycmVudFVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9KTtcbiAgICBpZiAoc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHwgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PT0gXCJyZWZ1c2VkXCIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKTtcbiAgICB9XG4gICAgU3RlZWRvcy52YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge1xuICAgICAgbG9nb3V0OiB0cnVlXG4gICAgfSk7XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIHJldHVybiBTTVNRdWV1ZS5zZW5kKHtcbiAgICAgICAgRm9ybWF0OiAnSlNPTicsXG4gICAgICAgIEFjdGlvbjogJ1NpbmdsZVNlbmRTbXMnLFxuICAgICAgICBQYXJhbVN0cmluZzogJycsXG4gICAgICAgIFJlY051bTogdXNlckNQLm1vYmlsZSxcbiAgICAgICAgU2lnbk5hbWU6ICfljY7ngo7lip7lhawnLFxuICAgICAgICBUZW1wbGF0ZUNvZGU6ICdTTVNfNjcyMDA5NjcnLFxuICAgICAgICBtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSk7XG4iLCJiaWxsaW5nTWFuYWdlciA9IHt9XHJcblxyXG4jIOiOt+W+l+e7k+eul+WRqOacn+WGheeahOWPr+e7k+eul+aXpeaVsFxyXG4jIHNwYWNlX2lkIOe7k+eul+WvueixoeW3peS9nOWMulxyXG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxyXG5cdGNvdW50X2RheXMgPSAwXHJcblxyXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcclxuXHJcblx0YmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZCwgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwifSlcclxuXHRmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGVcclxuXHJcblx0c3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCJcclxuXHRzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxLWVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKVxyXG5cclxuXHRpZiBmaXJzdF9kYXRlID49IGVuZF9kYXRlICMg6L+Z5Liq5pyI5LiN5Zyo5pys5qyh57uT566X6IyD5Zu05LmL5YaF77yMY291bnRfZGF5cz0wXHJcblx0XHQjIGRvIG5vdGhpbmdcclxuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHRlbHNlIGlmIGZpcnN0X2RhdGUgPCBzdGFydF9kYXRlXHJcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcclxuXHJcblx0cmV0dXJuIHtcImNvdW50X2RheXNcIjogY291bnRfZGF5c31cclxuXHJcbiMg6YeN566X6L+Z5LiA5pel55qE5L2Z6aKdXHJcbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IChzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKS0+XHJcblx0bGFzdF9iaWxsID0gbnVsbFxyXG5cdGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIGNyZWF0ZWQ6IHJlZnJlc2hfZGF0ZX0pXHJcblxyXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXHJcblx0cGF5bWVudF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdHtcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRjcmVhdGVkOiB7XHJcblx0XHRcdFx0JGx0OiByZWZyZXNoX2RhdGVcclxuXHRcdFx0fSxcclxuXHRcdFx0YmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7XHJcblx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHQpXHJcblx0aWYgcGF5bWVudF9iaWxsXHJcblx0XHRsYXN0X2JpbGwgPSBwYXltZW50X2JpbGxcclxuXHRlbHNlXHJcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxyXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblxyXG5cdFx0YXBwX2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdGJpbGxpbmdfbW9udGg6IGJfbVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdFx0bW9kaWZpZWQ6IC0xXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0XHRpZiBhcHBfYmlsbFxyXG5cdFx0XHRsYXN0X2JpbGwgPSBhcHBfYmlsbFxyXG5cclxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcclxuXHJcblx0ZGViaXRzID0gaWYgYmlsbC5kZWJpdHMgdGhlbiBiaWxsLmRlYml0cyBlbHNlIDAuMFxyXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcclxuXHRzZXRPYmogPSBuZXcgT2JqZWN0XHJcblx0c2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcclxuXHRkYi5iaWxsaW5ncy5kaXJlY3QudXBkYXRlKHtfaWQ6IGJpbGwuX2lkfSwgeyRzZXQ6IHNldE9ian0pXHJcblxyXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxyXG5iaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZSA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSktPlxyXG5cdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXHJcblx0YWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblxyXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcclxuXHRsYXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKFxyXG5cdFx0e1xyXG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdGJpbGxpbmdfZGF0ZToge1xyXG5cdFx0XHRcdCRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KVxyXG5cdGxhc3RfYmFsYW5jZSA9IGlmIGxhc3RfYmlsbCBhbmQgbGFzdF9iaWxsLmJhbGFuY2UgdGhlbiBsYXN0X2JpbGwuYmFsYW5jZSBlbHNlIDAuMFxyXG5cclxuXHRub3cgPSBuZXcgRGF0ZVxyXG5cdG5ld19iaWxsID0gbmV3IE9iamVjdFxyXG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxyXG5cdG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoXHJcblx0bmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxyXG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lXHJcblx0bmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlXHJcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcclxuXHRuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHNcclxuXHRuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpXHJcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xyXG5cdG5ld19iaWxsLm1vZGlmaWVkID0gbm93XHJcblx0ZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50ID0gKHNwYWNlX2lkKS0+XHJcblx0ZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cclxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cclxuXHRyZWZyZXNoX2RhdGVzID0gbmV3IEFycmF5XHJcblx0ZGIuYmlsbGluZ3MuZmluZChcclxuXHRcdHtcclxuXHRcdFx0YmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHR0cmFuc2FjdGlvbjogeyRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXX1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtjcmVhdGVkOiAxfVxyXG5cdFx0fVxyXG5cdCkuZm9yRWFjaCAoYmlsbCktPlxyXG5cdFx0cmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZClcclxuXHJcblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXHJcblx0XHRfLmVhY2ggcmVmcmVzaF9kYXRlcywgKHJfZCktPlxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKS0+XHJcblx0bW9kdWxlcyA9IG5ldyBBcnJheVxyXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXHJcblx0ZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxyXG5cclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoIChtKS0+XHJcblx0XHRtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdG1vZHVsZTogbS5uYW1lLFxyXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XHJcblx0XHRcdFx0XHQkbHRlOiBlbmRfZGF0ZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGNyZWF0ZWQ6IC0xXHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRcdCMg6Iul5pyq6I635b6X5Y+v5Yy56YWN55qE6K6w5b2V77yM6K+05piO6K+lbW9kdWxl5pyq5a6J6KOF77yM5b2T5pyI5LiN6K6h566X6LS555SoXHJcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcclxuXHRcdFx0IyAgZG8gbm90aGluZ1xyXG5cclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcImluc3RhbGxcIlxyXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgYW5kIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PSBcInVuaW5zdGFsbFwiXHJcblx0XHRcdCMgIGRvIG5vdGhpbmdcclxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxyXG5cdFx0ZWxzZSBpZiBtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA+PSBzdGFydF9kYXRlXHJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxyXG5cclxuXHRyZXR1cm4gbW9kdWxlc1xyXG5cclxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cclxuXHRtb2R1bGVzX25hbWUgPSBuZXcgQXJyYXlcclxuXHRkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKChtKS0+XHJcblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXHJcblx0KVxyXG5cdHJldHVybiBtb2R1bGVzX25hbWVcclxuXHJcblxyXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XHJcblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxyXG5cdFx0cmV0dXJuXHJcblx0aWYgYWNjb3VudGluZ19tb250aCA9PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcclxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXHJcblx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRkZWJpdHMgPSAwXHJcblx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcclxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdGRiLmJpbGxpbmdzLmZpbmQoXHJcblx0XHRcdHtcclxuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcclxuXHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXHJcblx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpLmZvckVhY2goKGIpLT5cclxuXHRcdFx0ZGViaXRzICs9IGIuZGViaXRzXHJcblx0XHQpXHJcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXHJcblx0XHRiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZVxyXG5cdFx0cmVtYWluaW5nX21vbnRocyA9IDBcclxuXHRcdGlmIGJhbGFuY2UgPiAwXHJcblx0XHRcdGlmIGRlYml0cyA+IDBcclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZS9kZWJpdHMpICsgMVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0IyDlvZPmnIjliJrljYfnuqfvvIzlubbmsqHmnInmiaPmrL5cclxuXHRcdFx0XHRyZW1haW5pbmdfbW9udGhzID0gMVxyXG5cclxuXHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxyXG5cdFx0XHR9LFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0JHNldDoge1xyXG5cdFx0XHRcdFx0YmFsYW5jZTogYmFsYW5jZSxcclxuXHRcdFx0XHRcdFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdClcclxuXHRlbHNlXHJcblx0XHQjIOiOt+W+l+WFtue7k+eul+WvueixoeaXpeacn3BheW1lbnRkYXRlc+aVsOe7hOWSjGNvdW50X2RheXPlj6/nu5Pnrpfml6XmlbBcclxuXHRcdHBlcmlvZF9yZXN1bHQgPSBiaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2Qoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXHJcblx0XHRcdCMg5Lmf6ZyA5a+55b2T5pyI55qE5YWF5YC86K6w5b2V5omn6KGM5pu05pawXHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdGVsc2VcclxuXHRcdFx0dXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKVxyXG5cclxuXHRcdFx0IyDmuIXpmaTlvZPmnIjnmoTlt7Lnu5PnrpforrDlvZVcclxuXHRcdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRcdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cdFx0XHRkYi5iaWxsaW5ncy5yZW1vdmUoXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0YmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxyXG5cdFx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcclxuXHRcdFx0XHRcdFx0JGluOiBtb2R1bGVzX25hbWVcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdClcclxuXHRcdFx0IyDph43nrpflvZPmnIjnmoTlhYXlgLzlkI7kvZnpop1cclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0XHQjIOe7k+eul+W9k+aciOeahEFQUOS9v+eUqOWQjuS9meminVxyXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXHJcblx0XHRcdGlmIG1vZHVsZXMgYW5kICBtb2R1bGVzLmxlbmd0aD4wXHJcblx0XHRcdFx0Xy5lYWNoIG1vZHVsZXMsIChtKS0+XHJcblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXHJcblxyXG5cdFx0YV9tID0gbW9tZW50KG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpXHJcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IChzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCktPlxyXG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXHJcblxyXG5cdG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheVxyXG5cclxuXHRuZXdfbW9kdWxlcyA9IF8uZGlmZmVyZW5jZShtb2R1bGVfbmFtZXMsIG1vZHVsZXMpXHJcblxyXG5cdG0gPSBtb21lbnQoKVxyXG5cdG5vdyA9IG0uX2RcclxuXHJcblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcclxuXHJcblx0IyDmm7TmlrBzcGFjZeaYr+WQpuS4k+S4mueJiOeahOagh+iusFxyXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlXHJcblx0XHRzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZVxyXG5cclxuXHQjIOabtOaWsG1vZHVsZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXNcclxuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkXHJcblx0c3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKVxyXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcclxuXHJcblx0ciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHNwYWNlX2lkfSwgeyRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmp9KVxyXG5cdGlmIHJcclxuXHRcdF8uZWFjaCBuZXdfbW9kdWxlcywgKG1vZHVsZSktPlxyXG5cdFx0XHRtY2wgPSBuZXcgT2JqZWN0XHJcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXHJcblx0XHRcdG1jbC5jaGFuZ2VfZGF0ZSA9IG0uZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdFx0bWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWRcclxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcclxuXHRcdFx0bWNsLm9wZXJhdGlvbiA9IFwiaW5zdGFsbFwiXHJcblx0XHRcdG1jbC5tb2R1bGUgPSBtb2R1bGVcclxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcclxuXHRcdFx0ZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpXHJcblxyXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblxyXG4gIGlmIChNZXRlb3Iuc2V0dGluZ3MuY3JvbiAmJiBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzKSB7XHJcblxyXG4gICAgdmFyIHNjaGVkdWxlID0gcmVxdWlyZSgnbm9kZS1zY2hlZHVsZScpO1xyXG4gICAgLy8g5a6a5pe25omn6KGM57uf6K6hXHJcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XHJcblxyXG4gICAgdmFyIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIHNjaGVkdWxlLnNjaGVkdWxlSm9iKHJ1bGUsIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKCkge1xyXG4gICAgICBpZiAoIWdvX25leHQpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICBnb19uZXh0ID0gZmFsc2U7XHJcblxyXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcclxuICAgICAgLy8g5pel5pyf5qC85byP5YyWIFxyXG4gICAgICB2YXIgZGF0ZUZvcm1hdCA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XHJcbiAgICAgICAgcmV0dXJuIGRhdGVrZXk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxyXG4gICAgICB2YXIgeWVzdGVyRGF5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkTm93ID0gbmV3IERhdGUoKTsgICAvL+W9k+WJjeaXtumXtFxyXG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XHJcbiAgICAgICAgcmV0dXJuIGRCZWZvcmU7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxyXG4gICAgICB2YXIgZGFpbHlTdGF0aWNzQ291bnQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgc3RhdGljcyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOnNwYWNlW1wiX2lkXCJdLFwiY3JlYXRlZFwiOnskZ3Q6IHllc3RlckRheSgpfX0pO1xyXG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOafpeivouaAu+aVsFxyXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmn6Xor6Lmi6XmnInogIXlkI3lrZdcclxuICAgICAgdmFyIG93bmVyTmFtZSA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xyXG4gICAgICAgIHZhciBuYW1lID0gb3duZXIubmFtZTtcclxuICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5pyA6L+R55m75b2V5pel5pyfXHJcbiAgICAgIHZhciBsYXN0TG9nb24gPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcclxuICAgICAgICB2YXIgc1VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pOyBcclxuICAgICAgICBzVXNlcnMuZm9yRWFjaChmdW5jdGlvbiAoc1VzZXIpIHtcclxuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xyXG4gICAgICAgICAgaWYodXNlciAmJiAobGFzdExvZ29uIDwgdXNlci5sYXN0X2xvZ29uKSl7XHJcbiAgICAgICAgICAgIGxhc3RMb2dvbiA9IHVzZXIubGFzdF9sb2dvbjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBsYXN0TG9nb247XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOacgOi/keS/ruaUueaXpeacn1xyXG4gICAgICB2YXIgbGFzdE1vZGlmaWVkID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcclxuICAgICAgICB2YXIgb2JqQXJyID0gb2JqLmZldGNoKCk7XHJcbiAgICAgICAgaWYob2JqQXJyLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xyXG4gICAgICAgICAgcmV0dXJuIG1vZDtcclxuICAgICAgfTtcclxuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXHJcbiAgICAgIHZhciBwb3N0c0F0dGFjaG1lbnRzID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGF0dFNpemUgPSAwO1xyXG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcclxuICAgICAgICB2YXIgcG9zdHMgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19KTtcclxuICAgICAgICBwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XHJcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XHJcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XHJcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcclxuICAgICAgICAgIH0pICBcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDlvZPml6XmlrDlop7pmYTku7blpKflsI9cclxuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcclxuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XHJcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xyXG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6IHBvc3RbXCJfaWRcIl0sIFwidXBsb2FkZWRBdFwiOiB7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcclxuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XHJcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcclxuICAgICAgICAgICAgc2l6ZVN1bSArPSBhdHRTaXplO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmj5LlhaXmlbDmja5cclxuICAgICAgZGIuc3BhY2VzLmZpbmQoe1wiaXNfcGFpZFwiOnRydWV9KS5mb3JFYWNoKGZ1bmN0aW9uIChzcGFjZSkge1xyXG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xyXG4gICAgICAgICAgc3BhY2U6IHNwYWNlW1wiX2lkXCJdLFxyXG4gICAgICAgICAgc3BhY2VfbmFtZTogc3BhY2VbXCJuYW1lXCJdLFxyXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxyXG4gICAgICAgICAgb3duZXJfbmFtZTogb3duZXJOYW1lKGRiLnVzZXJzLCBzcGFjZSksXHJcbiAgICAgICAgICBjcmVhdGVkOiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgc3RlZWRvczp7XHJcbiAgICAgICAgICAgIHVzZXJzOiBzdGF0aWNzQ291bnQoZGIuc3BhY2VfdXNlcnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgb3JnYW5pemF0aW9uczogc3RhdGljc0NvdW50KGRiLm9yZ2FuaXphdGlvbnMsIHNwYWNlKSxcclxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB3b3JrZmxvdzp7XHJcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZm9ybXM6IHN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3JvbGVzOiBzdGF0aWNzQ291bnQoZGIuZmxvd19yb2xlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGluc3RhbmNlczogc3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBpbnN0YW5jZXNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmluc3RhbmNlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfZm9ybXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZvcm1zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2luc3RhbmNlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuaW5zdGFuY2VzLCBzcGFjZSlcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBjbXM6IHtcclxuICAgICAgICAgICAgc2l0ZXM6IHN0YXRpY3NDb3VudChkYi5jbXNfc2l0ZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHNfbGFzdF9tb2RpZmllZDogbGFzdE1vZGlmaWVkKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBwb3N0c19hdHRhY2htZW50c19zaXplOiBwb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9zaXRlczogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X3Bvc3RzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplOiBkYWlseVBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICAgIFxyXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcclxuXHJcbiAgICAgIGdvX25leHQgPSB0cnVlO1xyXG5cclxuICAgIH0sIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogc3RhdGlzdGljcy5qcycpO1xyXG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcclxuICAgIH0pKTtcclxuXHJcbiAgfVxyXG5cclxufSlcclxuXHJcblxyXG5cclxuXHJcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDFcclxuICAgICAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIGlzQ3VycmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7X2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddfSwgeyRzZXQ6IHttZXRhZGF0YTogbWV0YWRhdGF9fSlcclxuICAgICAgICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2VcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hzLmZvckVhY2ggKGF0dCktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dC5oaXN0b3J5cy5mb3JFYWNoIChoaXMpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaSsrXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKSIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDEsXG4gICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuicsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIGksIHVwZGF0ZV9jZnNfaW5zdGFuY2U7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgICB0cnkge1xuICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlID0gZnVuY3Rpb24ocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpIHtcbiAgICAgICAgICB2YXIgbWV0YWRhdGE7XG4gICAgICAgICAgbWV0YWRhdGEgPSB7XG4gICAgICAgICAgICBwYXJlbnQ6IHBhcmVudF9pZCxcbiAgICAgICAgICAgIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLFxuICAgICAgICAgICAgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLFxuICAgICAgICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlX2lkLFxuICAgICAgICAgICAgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXVxuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKGlzQ3VycmVudCkge1xuICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjZnMuaW5zdGFuY2VzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGF0dGFjaF92ZXJzaW9uWydfcmV2J11cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgIG1ldGFkYXRhOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBpID0gMDtcbiAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1xuICAgICAgICAgIFwiYXR0YWNobWVudHMuY3VycmVudFwiOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc29ydDoge1xuICAgICAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHNwYWNlOiAxLFxuICAgICAgICAgICAgYXR0YWNobWVudHM6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oaW5zKSB7XG4gICAgICAgICAgdmFyIGF0dGFjaHMsIGluc3RhbmNlX2lkLCBzcGFjZV9pZDtcbiAgICAgICAgICBhdHRhY2hzID0gaW5zLmF0dGFjaG1lbnRzO1xuICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlO1xuICAgICAgICAgIGluc3RhbmNlX2lkID0gaW5zLl9pZDtcbiAgICAgICAgICBhdHRhY2hzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICAgICAgICB2YXIgY3VycmVudF92ZXIsIHBhcmVudF9pZDtcbiAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnQ7XG4gICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2O1xuICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgY3VycmVudF92ZXIsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGF0dC5oaXN0b3J5cykge1xuICAgICAgICAgICAgICByZXR1cm4gYXR0Lmhpc3RvcnlzLmZvckVhY2goZnVuY3Rpb24oaGlzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gaSsrO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAxIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAyXHJcbiAgICAgICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7b3JnYW5pemF0aW9uczogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHtvcmdhbml6YXRpb246IDF9fSkuZm9yRWFjaCAoc3UpLT5cclxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXX19KVxyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAyIGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAzXHJcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2Vyc1xyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgc3UudXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiBzdS51c2VyfSwge2ZpZWxkczoge2VtYWlsczogMX19KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QodS5lbWFpbHNbMF0uYWRkcmVzcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzID0gdS5lbWFpbHNbMF0uYWRkcmVzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICBjYXRjaCBlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yIGVcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDMgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcbiAgICBNaWdyYXRpb25zLmFkZFxyXG4gICAgICAgIHZlcnNpb246IDRcclxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXHJcbiAgICAgICAgdXA6IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgdXAnXHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtzb3J0X25vOiB7JGV4aXN0czogZmFsc2V9fSwgeyRzZXQ6IHtzb3J0X25vOiAxMDB9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xyXG4gICAgICAgIGRvd246IC0+XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDQgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0TWlncmF0aW9ucy5hZGRcclxuXHRcdHZlcnNpb246IDVcclxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdFx0dHJ5XHJcblxyXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxyXG5cdFx0XHRcdFx0aWYgbm90IHN1Lm9yZ2FuaXphdGlvbnNcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXHJcblx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHN1Lm9yZ2FuaXphdGlvbnNbMF0pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0aWYgY2hlY2tfY291bnQgaXMgMFxyXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXHJcblx0XHRcdFx0XHRcdFx0aWYgcm9vdF9vcmdcclxuXHRcdFx0XHRcdFx0XHRcdHIgPSBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkfX0pXHJcblx0XHRcdFx0XHRcdFx0XHRpZiByXHJcblx0XHRcdFx0XHRcdFx0XHRcdHJvb3Rfb3JnLnVwZGF0ZVVzZXJzKClcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIHN1Ll9pZFxyXG5cdFx0XHRcdFx0ZWxzZSBpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDFcclxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cclxuXHRcdFx0XHRcdFx0c3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoIChvKS0+XHJcblx0XHRcdFx0XHRcdFx0Y2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcclxuXHRcdFx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pXHJcblx0XHRcdFx0XHRcdGlmIHJlbW92ZWRfb3JnX2lkcy5sZW5ndGggPiAwXHJcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxyXG5cdFx0XHRcdFx0XHRcdGlmIG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbilcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc319KVxyXG5cdFx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcywgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXX19KVxyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNvbnNvbGUudGltZUVuZCAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcclxuXHRcdGRvd246IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcclxuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNSxcbiAgICBuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA1IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgICAgICAgdmFyIGNoZWNrX2NvdW50LCBuZXdfb3JnX2lkcywgciwgcmVtb3ZlZF9vcmdfaWRzLCByb290X29yZztcbiAgICAgICAgICBpZiAoIXN1Lm9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICBjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpO1xuICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgIHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICBzcGFjZTogc3Uuc3BhY2UsXG4gICAgICAgICAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAocm9vdF9vcmcpIHtcbiAgICAgICAgICAgICAgICByID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3Jvb3Rfb3JnLl9pZF0sXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogcm9vdF9vcmcuX2lkXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKHIpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiByb290X29yZy51cGRhdGVVc2VycygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihzdS5faWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHJlbW92ZWRfb3JnX2lkcyA9IFtdO1xuICAgICAgICAgICAgc3Uub3JnYW5pemF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQobykuY291bnQoKTtcbiAgICAgICAgICAgICAgaWYgKGNoZWNrX2NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlbW92ZWRfb3JnX2lkcy5wdXNoKG8pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChyZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBuZXdfb3JnX2lkcyA9IF8uZGlmZmVyZW5jZShzdS5vcmdhbml6YXRpb25zLCByZW1vdmVkX29yZ19pZHMpO1xuICAgICAgICAgICAgICBpZiAobmV3X29yZ19pZHMuaW5jbHVkZXMoc3Uub3JnYW5pemF0aW9uKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkc1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgIF9pZDogc3UuX2lkXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBuZXdfb3JnX2lkcyxcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uOiBuZXdfb3JnX2lkc1swXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA1IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdE1pZ3JhdGlvbnMuYWRkXHJcblx0XHR2ZXJzaW9uOiA2XHJcblx0XHRuYW1lOiAn6LSi5Yqh57O757uf5Y2H57qnJ1xyXG5cdFx0dXA6IC0+XHJcblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXHJcblx0XHRcdGNvbnNvbGUudGltZSAnYmlsbGluZyB1cGdyYWRlJ1xyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcclxuXHRcdFx0XHRkYi5tb2R1bGVzLnJlbW92ZSh7fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgU3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDEuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXHJcblx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xyXG5cdFx0XHRcdFx0XCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDMuMCxcclxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LyB5Lia54mI5omp5bGV5YyFXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiA2LjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcclxuXHRcdFx0XHR9KVxyXG5cclxuXHJcblx0XHRcdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChuZXcgRGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRkYi5zcGFjZXMuZmluZCh7aXNfcGFpZDogdHJ1ZSwgdXNlcl9saW1pdDogeyRleGlzdHM6IGZhbHNlfSwgbW9kdWxlczogeyRleGlzdHM6IHRydWV9fSkuZm9yRWFjaCAocyktPlxyXG5cdFx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRcdHNldF9vYmogPSB7fVxyXG5cdFx0XHRcdFx0XHR1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHMuX2lkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkuY291bnQoKVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XHJcblx0XHRcdFx0XHRcdGJhbGFuY2UgPSBzLmJhbGFuY2VcclxuXHRcdFx0XHRcdFx0aWYgYmFsYW5jZSA+IDBcclxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXHJcblx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyA9IDBcclxuXHRcdFx0XHRcdFx0XHRfLmVhY2ggcy5tb2R1bGVzLCAocG0pLT5cclxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgbW9kdWxlIGFuZCBtb2R1bGUubGlzdHByaWNlXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgKz0gbW9kdWxlLmxpc3RwcmljZVxyXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxyXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZS5zZXRNb250aChlbmRfZGF0ZS5nZXRNb250aCgpK21vbnRocylcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlXHJcblxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIGJhbGFuY2UgPD0gMFxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGVcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcclxuXHJcblx0XHRcdFx0XHRcdHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIilcclxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcclxuXHRcdFx0XHRcdFx0ZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogcy5faWR9LCB7JHNldDogc2V0X29ian0pXHJcblx0XHRcdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHMuX2lkKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKHNldF9vYmopXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXHJcblx0XHRkb3duOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cclxuICAgIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKVxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xyXG4gICAgICAgICAgICBcImNyZWF0b3JcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIndvcmtmbG93XCI6IHtcclxuICAgICAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yXHJcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xyXG4gICAgICAgICAgICBcInVybFwiOiByb290VVJMXHJcbiAgICAgICAgfVxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3dcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93ID0ge1xyXG4gICAgICAgICAgICBcInVybFwiOiByb290VVJMXHJcbiAgICAgICAgfVxyXG5cclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsXHJcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkxcclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93LnVybFxyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMud29ya2Zsb3cudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH0sXG4gICAgICBcIndvcmtmbG93XCI6IHtcbiAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgfVxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvcikge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cgPSB7XG4gICAgICBcInVybFwiOiByb290VVJMXG4gICAgfTtcbiAgfVxuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCkge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmwgPSByb290VVJMO1xuICB9XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cclxuXHRuZXcgVGFidWxhci5UYWJsZVxyXG5cdFx0bmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxyXG5cdFx0Y29sbGVjdGlvbjogZGIuYXBwcyxcclxuXHRcdGNvbHVtbnM6IFtcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGRhdGE6IFwibmFtZVwiXHJcblx0XHRcdFx0b3JkZXJhYmxlOiBmYWxzZVxyXG5cdFx0XHR9XHJcblx0XHRdXHJcblx0XHRkb206IFwidHBcIlxyXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdXHJcblx0XHRsZW5ndGhDaGFuZ2U6IGZhbHNlXHJcblx0XHRvcmRlcmluZzogZmFsc2VcclxuXHRcdHBhZ2VMZW5ndGg6IDEwXHJcblx0XHRpbmZvOiBmYWxzZVxyXG5cdFx0c2VhcmNoaW5nOiB0cnVlXHJcblx0XHRhdXRvV2lkdGg6IHRydWVcclxuXHRcdGNoYW5nZVNlbGVjdG9yOiAoc2VsZWN0b3IsIHVzZXJJZCkgLT5cclxuXHRcdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdFx0c3BhY2UgPSBzZWxlY3Rvci5zcGFjZVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0c3BhY2UgPSBzZWxlY3Rvci4kYW5kLmdldFByb3BlcnR5KCdzcGFjZScpWzBdXHJcblx0XHRcdHVubGVzcyBzcGFjZVxyXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdFx0cmV0dXJuIHNlbGVjdG9yIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgVGFidWxhci5UYWJsZSh7XG4gICAgbmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuICAgIGNvbGxlY3Rpb246IGRiLmFwcHMsXG4gICAgY29sdW1uczogW1xuICAgICAge1xuICAgICAgICBkYXRhOiBcIm5hbWVcIixcbiAgICAgICAgb3JkZXJhYmxlOiBmYWxzZVxuICAgICAgfVxuICAgIF0sXG4gICAgZG9tOiBcInRwXCIsXG4gICAgZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdLFxuICAgIGxlbmd0aENoYW5nZTogZmFsc2UsXG4gICAgb3JkZXJpbmc6IGZhbHNlLFxuICAgIHBhZ2VMZW5ndGg6IDEwLFxuICAgIGluZm86IGZhbHNlLFxuICAgIHNlYXJjaGluZzogdHJ1ZSxcbiAgICBhdXRvV2lkdGg6IHRydWUsXG4gICAgY2hhbmdlU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yLCB1c2VySWQpIHtcbiAgICAgIHZhciByZWYsIHNwYWNlO1xuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBzcGFjZSA9IHNlbGVjdG9yLnNwYWNlO1xuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICBpZiAoKHNlbGVjdG9yICE9IG51bGwgPyAocmVmID0gc2VsZWN0b3IuJGFuZCkgIT0gbnVsbCA/IHJlZi5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDApID4gMCkge1xuICAgICAgICAgIHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKCFzcGFjZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzZWxlY3RvcjtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=
