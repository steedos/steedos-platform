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
var _getLocale, clone, getUserProfileObjectsLayout, steedosAuth, steedosCore, steedosI18n;

steedosAuth = require("@steedos/auth");
steedosI18n = require("@steedos/i18n");
steedosCore = require("@steedos/core");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcm91dGVzL2Jvb3RzdHJhcC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9yb3V0ZXMvYm9vdHN0cmFwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9yb3V0ZXMvYXBpX2JpbGxpbmdfcmVjaGFyZ2Vfbm90aWZ5LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9hcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvbXlfY29udGFjdHNfbGltaXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRLZXlWYWx1ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfc2V0dGxldXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9iaWxsaW5nX3NldHRsZXVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldFVzZXJuYW1lLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL2JpbGxpbmdfcmVjaGFyZ2UuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvZ2V0X3NwYWNlX3VzZXJfY291bnQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvdXNlcl9zZWNyZXQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvb2JqZWN0X3dvcmtmbG93cy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9zZXRfc3BhY2VfdXNlcl9wYXNzd29yZC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9saWIvYmlsbGluZ19tYW5hZ2VyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL3NjaGVkdWxlL3N0YXRpc3RpY3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjEuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92My5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y1LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92Ni5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RhcnR1cC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3RhYnVsYXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC90YWJ1bGFyLmNvZmZlZSJdLCJuYW1lcyI6WyJjaGVja05wbVZlcnNpb25zIiwibW9kdWxlIiwibGluayIsInYiLCJjb29raWVzIiwibWtkaXJwIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJiaWxsaW5nIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb3J0QnlOYW1lIiwibG9jYWxlIiwiU3RlZWRvcyIsInNvcnQiLCJwMSIsInAyIiwicDFfc29ydF9ubyIsInNvcnRfbm8iLCJwMl9zb3J0X25vIiwibmFtZSIsImxvY2FsZUNvbXBhcmUiLCJnZXRQcm9wZXJ0eSIsImsiLCJmb3JFYWNoIiwidCIsIm0iLCJwdXNoIiwicmVtb3ZlIiwiZnJvbSIsInRvIiwicmVzdCIsInNsaWNlIiwibGVuZ3RoIiwiYXBwbHkiLCJmaWx0ZXJQcm9wZXJ0eSIsImgiLCJsIiwiZyIsImQiLCJpbmNsdWRlcyIsIk9iamVjdCIsInVuZGVmaW5lZCIsImZpbmRQcm9wZXJ0eUJ5UEsiLCJyIiwiQ29va2llcyIsImNyeXB0byIsIm1peGluIiwiZGIiLCJzdWJzIiwiaXNQaG9uZUVuYWJsZWQiLCJyZWYiLCJyZWYxIiwicGhvbmUiLCJudW1iZXJUb1N0cmluZyIsIm51bWJlciIsInNjYWxlIiwibm90VGhvdXNhbmRzIiwicmVnIiwidG9TdHJpbmciLCJOdW1iZXIiLCJ0b0ZpeGVkIiwibWF0Y2giLCJyZXBsYWNlIiwidmFsaUpxdWVyeVN5bWJvbHMiLCJzdHIiLCJSZWdFeHAiLCJ0ZXN0IiwiZ2V0SGVscFVybCIsImNvdW50cnkiLCJzdWJzdHJpbmciLCJpc0NsaWVudCIsInNwYWNlVXBncmFkZWRNb2RhbCIsInN3YWwiLCJ0aXRsZSIsIlRBUGkxOG4iLCJfXyIsInRleHQiLCJodG1sIiwidHlwZSIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXIiLCJ1c2VySWQiLCJrZXkiLCJ2YWx1ZSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImF2YXRhclVybCIsImJhY2tncm91bmQiLCJyZWYyIiwidXJsIiwibG9nZ2luZ0luIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIiQiLCJjc3MiLCJhYnNvbHV0ZVVybCIsImFkbWluIiwic2V0SXRlbSIsInJlbW92ZUl0ZW0iLCJnZXRBY2NvdW50U2tpblZhbHVlIiwiYWNjb3VudFNraW4iLCJnZXRBY2NvdW50Wm9vbVZhbHVlIiwiYWNjb3VudFpvb20iLCJhcHBseUFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbVZhbHVlIiwiem9vbU5hbWUiLCJ6b29tU2l6ZSIsInNpemUiLCJyZW1vdmVDbGFzcyIsIlNlc3Npb24iLCJnZXQiLCJhZGRDbGFzcyIsInNob3dIZWxwIiwiZ2V0TG9jYWxlIiwid2luZG93Iiwib3BlbiIsImdldFVybFdpdGhUb2tlbiIsImF1dGhUb2tlbiIsImxpbmtlciIsImdldFNwYWNlSWQiLCJBY2NvdW50cyIsIl9zdG9yZWRMb2dpblRva2VuIiwiaW5kZXhPZiIsInBhcmFtIiwiZ2V0QXBwVXJsV2l0aFRva2VuIiwiYXBwX2lkIiwib3BlbkFwcFdpdGhUb2tlbiIsImFwcCIsImFwcHMiLCJpc19uZXdfd2luZG93IiwiaXNNb2JpbGUiLCJpc0NvcmRvdmEiLCJsb2NhdGlvbiIsIm9wZW5XaW5kb3ciLCJvcGVuVXJsV2l0aElFIiwiY21kIiwiZXhlYyIsIm9wZW5fdXJsIiwiaXNOb2RlIiwibnciLCJyZXF1aXJlIiwiZXJyb3IiLCJzdGRvdXQiLCJzdGRlcnIiLCJ0b2FzdHIiLCJvcGVuQXBwIiwiZSIsImV2YWxGdW5TdHJpbmciLCJvbl9jbGljayIsInBhdGgiLCJyZWRpcmVjdFRvU2lnbkluIiwiRmxvd1JvdXRlciIsImdvIiwiaXNfdXNlX2llIiwib3JpZ2luIiwiaXNJbnRlcm5hbEFwcCIsImlzX3VzZV9pZnJhbWUiLCJfaWQiLCJldmFsIiwiZXJyb3IxIiwiY29uc29sZSIsIm1lc3NhZ2UiLCJzdGFjayIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwic3BhY2VJZCIsImVuZF9kYXRlIiwibWluX21vbnRocyIsInNwYWNlIiwiaXNTcGFjZUFkbWluIiwic3BhY2VzIiwiaXNfcGFpZCIsIkRhdGUiLCJzZXRNb2RhbE1heEhlaWdodCIsIm9mZnNldCIsImRldGVjdElFIiwiZWFjaCIsImZvb3RlckhlaWdodCIsImhlYWRlckhlaWdodCIsImhlaWdodCIsInRvdGFsSGVpZ2h0Iiwib3V0ZXJIZWlnaHQiLCJpbm5lckhlaWdodCIsImhhc0NsYXNzIiwiZ2V0TW9kYWxNYXhIZWlnaHQiLCJyZVZhbHVlIiwic2NyZWVuIiwiaXNpT1MiLCJ1c2VyQWdlbnQiLCJsYW5ndWFnZSIsIkRFVklDRSIsImJyb3dzZXIiLCJjb25FeHAiLCJkZXZpY2UiLCJudW1FeHAiLCJhbmRyb2lkIiwiYmxhY2tiZXJyeSIsImRlc2t0b3AiLCJpcGFkIiwiaXBob25lIiwiaXBvZCIsIm1vYmlsZSIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiYnJvd3Nlckxhbmd1YWdlIiwiZ2V0VXNlck9yZ2FuaXphdGlvbnMiLCJpc0luY2x1ZGVQYXJlbnRzIiwib3JnYW5pemF0aW9ucyIsInBhcmVudHMiLCJzcGFjZV91c2VyIiwic3BhY2VfdXNlcnMiLCJmaWVsZHMiLCJfIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJwYXNzd29yZCIsInJlZjMiLCJyZXN1bHQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGVhZGVycyIsImhhc2hlZFRva2VuIiwiX2hhc2hMb2dpblRva2VuIiwiZGVjcnlwdCIsIml2IiwiYyIsImRlY2lwaGVyIiwiZGVjaXBoZXJNc2ciLCJrZXkzMiIsImxlbiIsImNyZWF0ZURlY2lwaGVyaXYiLCJCdWZmZXIiLCJjb25jYXQiLCJ1cGRhdGUiLCJmaW5hbCIsImVuY3J5cHQiLCJjaXBoZXIiLCJjaXBoZXJlZE1zZyIsImNyZWF0ZUNpcGhlcml2IiwiZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuIiwiYWNjZXNzX3Rva2VuIiwiY29sbGVjdGlvbiIsIm9iaiIsInNwbGl0Iiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiZGF0YSIsImNvZGUiLCJmdW5jdGlvbnMiLCJmdW5jIiwiYXJncyIsIl93cmFwcGVkIiwiYXJndW1lbnRzIiwiY2FsbCIsImlzSG9saWRheSIsImRhdGUiLCJkYXkiLCJnZXREYXkiLCJjYWN1bGF0ZVdvcmtpbmdUaW1lIiwiZGF5cyIsImNhY3VsYXRlRGF0ZSIsInBhcmFtX2RhdGUiLCJnZXRUaW1lIiwiY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkiLCJuZXh0IiwiY2FjdWxhdGVkX2RhdGUiLCJmaXJzdF9kYXRlIiwiaiIsIm1heF9pbmRleCIsInNlY29uZF9kYXRlIiwic3RhcnRfZGF0ZSIsInRpbWVfcG9pbnRzIiwicmVtaW5kIiwiaXNFbXB0eSIsInNldEhvdXJzIiwiaG91ciIsInNldE1pbnV0ZXMiLCJtaW51dGUiLCJleHRlbmQiLCJnZXRTdGVlZG9zVG9rZW4iLCJhcHBJZCIsIm5vdyIsInNlY3JldCIsInN0ZWVkb3NfdG9rZW4iLCJwYXJzZUludCIsImlzSTE4biIsImNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHkiLCIkcmVnZXgiLCJfZXNjYXBlUmVnRXhwIiwidHJpbSIsInZhbGlkYXRlUGFzc3dvcmQiLCJwd2QiLCJwYXNzd29yUG9saWN5IiwicGFzc3dvclBvbGljeUVycm9yIiwicmVhc29uIiwidmFsaWQiLCJwb2xpY3kiLCJwb2xpY3lFcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsIkNyZWF0b3IiLCJnZXREQkFwcHMiLCJzcGFjZV9pZCIsImRiQXBwcyIsIkNvbGxlY3Rpb25zIiwiaXNfY3JlYXRvciIsInZpc2libGUiLCJjcmVhdGVkIiwiY3JlYXRlZF9ieSIsIm1vZGlmaWVkIiwibW9kaWZpZWRfYnkiLCJnZXREQkRhc2hib2FyZHMiLCJkYkRhc2hib2FyZHMiLCJkYXNoYm9hcmQiLCJnZXRBdXRoVG9rZW4iLCJhdXRob3JpemF0aW9uIiwiYXV0b3J1biIsInNlc3Npb25TdG9yYWdlIiwiZ2V0Q3VycmVudEFwcElkIiwic3RhcnR1cCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJmb3JlaWduX2tleSIsIk1hdGNoIiwiT3B0aW9uYWwiLCJCb29sZWFuIiwicmVmZXJlbmNlcyIsIm1ldGhvZHMiLCJ1cGRhdGVVc2VyTGFzdExvZ29uIiwiJHNldCIsImxhc3RfbG9nb24iLCJvbkxvZ2luIiwidXNlcnNfYWRkX2VtYWlsIiwiZW1haWwiLCJjb3VudCIsImVtYWlscyIsImRpcmVjdCIsIiRwdXNoIiwiYWRkcmVzcyIsInZlcmlmaWVkIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwidXNlcnNfcmVtb3ZlX2VtYWlsIiwicCIsIiRwdWxsIiwidXNlcnNfdmVyaWZ5X2VtYWlsIiwidXNlcnNfc2V0X3ByaW1hcnlfZW1haWwiLCJwcmltYXJ5IiwibXVsdGkiLCJzaG93Q2FuY2VsQnV0dG9uIiwiY2xvc2VPbkNvbmZpcm0iLCJhbmltYXRpb24iLCJpbnB1dFZhbHVlIiwidXBkYXRlVXNlckF2YXRhciIsImVtYWlsVGVtcGxhdGVzIiwiZGVmYXVsdEZyb20iLCJyZXNldFBhc3N3b3JkIiwic3ViamVjdCIsInNwbGl0cyIsInRva2VuQ29kZSIsImdyZWV0aW5nIiwicHJvZmlsZSIsInRva2VuX2NvZGUiLCJ2ZXJpZnlFbWFpbCIsImVucm9sbEFjY291bnQiLCJhZGQiLCJvcmdzIiwiZnVsbG5hbWUiLCIkbmUiLCJjYWxjdWxhdGVGdWxsbmFtZSIsInJldCIsIm1zZyIsIlB1c2giLCJDb25maWd1cmUiLCJzZW5kZXJJRCIsIkFORFJPSURfU0VOREVSX0lEIiwic291bmQiLCJ2aWJyYXRlIiwiaW9zIiwiYmFkZ2UiLCJjbGVhckJhZGdlIiwiYWxlcnQiLCJhcHBOYW1lIiwiU2VsZWN0b3IiLCJzZWxlY3RvckNoZWNrU3BhY2VBZG1pbiIsInNlbGVjdG9yIiwiaXNfY2xvdWRhZG1pbiIsIm1hcCIsIm4iLCJzZWxlY3RvckNoZWNrU3BhY2UiLCJ1IiwiYmlsbGluZ19wYXlfcmVjb3JkcyIsImFkbWluQ29uZmlnIiwiaWNvbiIsImNvbG9yIiwidGFibGVDb2x1bW5zIiwiZXh0cmFGaWVsZHMiLCJyb3V0ZXJBZG1pbiIsInBhaWQiLCJzaG93RWRpdENvbHVtbiIsInNob3dEZWxDb2x1bW4iLCJkaXNhYmxlQWRkIiwicGFnZUxlbmd0aCIsIm9yZGVyIiwic3BhY2VfdXNlcl9zaWducyIsIkFkbWluQ29uZmlnIiwiY29sbGVjdGlvbnNfYWRkIiwic2VhcmNoRWxlbWVudCIsIk8iLCJjdXJyZW50RWxlbWVudCIsIndlYnNlcnZpY2VzIiwid3d3Iiwic3RhdHVzIiwiZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MiLCJvYmplY3RzIiwiX2dldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJrZXlzIiwibGlzdFZpZXdzIiwib2JqZWN0c1ZpZXdzIiwiZ2V0Q29sbGVjdGlvbiIsIm9iamVjdF9uYW1lIiwib3duZXIiLCJzaGFyZWQiLCJfdXNlcl9vYmplY3RfbGlzdF92aWV3cyIsIm9saXN0Vmlld3MiLCJvdiIsImxpc3R2aWV3IiwibyIsImxpc3RfdmlldyIsImdldFVzZXJPYmplY3RMaXN0Vmlld3MiLCJvYmplY3RfbGlzdHZpZXciLCJ1c2VyX2lkIiwidXVmbG93TWFuYWdlciIsImdldFNwYWNlIiwiJG9yIiwiJGV4aXN0cyIsImVycm9ycyIsImVycm9yTWVzc2FnZSIsImFsbG93X21vZGVscyIsIm1vZGVsIiwib3B0aW9ucyIsImV4cHJlc3MiLCJkZXNfY2lwaGVyIiwiZGVzX2NpcGhlcmVkTXNnIiwiZGVzX2l2IiwiZGVzX3N0ZWVkb3NfdG9rZW4iLCJqb2luZXIiLCJrZXk4IiwicmVkaXJlY3RVcmwiLCJyZXR1cm51cmwiLCJwYXJhbXMiLCJ3cml0ZUhlYWQiLCJlbmQiLCJlbmNvZGVVUkkiLCJzZXRIZWFkZXIiLCJjb2xvcl9pbmRleCIsImNvbG9ycyIsImZvbnRTaXplIiwiaW5pdGlhbHMiLCJwb3NpdGlvbiIsInJlcU1vZGlmaWVkSGVhZGVyIiwic3ZnIiwidXNlcm5hbWVfYXJyYXkiLCJ3aWR0aCIsInciLCJmcyIsImZpbGUiLCJ3cml0ZSIsIml0ZW0iLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ0b1VUQ1N0cmluZyIsInJlYWRTdHJlYW0iLCJwaXBlIiwicHVibGlzaCIsInJlYWR5IiwiaGFuZGxlIiwiaGFuZGxlMiIsIm9ic2VydmVTcGFjZXMiLCJzZWxmIiwic3VzIiwidXNlclNwYWNlcyIsInVzZXJfYWNjZXB0ZWQiLCJzdSIsIm9ic2VydmUiLCJhZGRlZCIsImRvYyIsInJlbW92ZWQiLCJvbGREb2MiLCJ3aXRob3V0Iiwic3RvcCIsImNoYW5nZWQiLCJuZXdEb2MiLCJvblN0b3AiLCJlbmFibGVfcmVnaXN0ZXIiLCJfZ2V0TG9jYWxlIiwiY2xvbmUiLCJnZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQiLCJzdGVlZG9zQXV0aCIsInN0ZWVkb3NDb3JlIiwic3RlZWRvc0kxOG4iLCJ0b0xvY2FsZUxvd2VyQ2FzZSIsInNwYWNlVXNlciIsInByb2ZpbGVzIiwiX0FwcHMiLCJfRGFzaGJvYXJkcyIsImFzc2lnbmVkX21lbnVzIiwibG5nIiwib2JqZWN0c0xheW91dCIsInBlcm1pc3Npb25zIiwidXNlclNlc3Npb24iLCJ3cmFwQXN5bmMiLCJjYiIsImdldFNlc3Npb24iLCJ0aGVuIiwicmVzb2x2ZSIsInJlamVjdCIsImdldEFsbFBlcm1pc3Npb25zIiwidHJhbnNsYXRpb25PYmplY3RzIiwiQXBwcyIsImRhc2hib2FyZHMiLCJEYXNoYm9hcmRzIiwib2JqZWN0X2xpc3R2aWV3cyIsIm9iamVjdF93b3JrZmxvd3MiLCJnZXRVc2VyT2JqZWN0UGVybWlzc2lvbiIsInN0ZWVkb3NTY2hlbWEiLCJnZXREYXRhU291cmNlcyIsImRhdGFzb3VyY2UiLCJkYXRhc291cmNlT2JqZWN0cyIsImdldE9iamVjdHMiLCJfb2JqIiwiY29udmVydE9iamVjdCIsInRvQ29uZmlnIiwiZGF0YWJhc2VfbmFtZSIsImdldEFwcHNDb25maWciLCJnZXREYXNoYm9hcmRzQ29uZmlnIiwiX2RiaWQiLCJ0cmFuc2xhdGlvbkFwcHMiLCJ0cmFuc2xhdGlvbk1lbnVzIiwicGx1Z2lucyIsImdldFBsdWdpbnMiLCJvYmplY3RMYXlvdXQiLCJfZmllbGRzIiwiX29iamVjdCIsIl9pdGVtIiwicmVmNCIsInJlZjUiLCJyZWY2IiwicmVmNyIsImZpZWxkIiwiaGFzIiwiZ3JvdXAiLCJyZXF1aXJlZCIsInJlYWRvbmx5IiwiZGlzYWJsZWQiLCJhbGxvd19hY3Rpb25zIiwiYWN0aW9ucyIsIm9uIiwiY2h1bmsiLCJiaW5kRW52aXJvbm1lbnQiLCJwYXJzZXIiLCJ4bWwyanMiLCJQYXJzZXIiLCJleHBsaWNpdEFycmF5IiwiZXhwbGljaXRSb290IiwicGFyc2VTdHJpbmciLCJlcnIiLCJXWFBheSIsImF0dGFjaCIsImJwciIsImNvZGVfdXJsX2lkIiwic2lnbiIsInd4cGF5IiwiYXBwaWQiLCJtY2hfaWQiLCJwYXJ0bmVyX2tleSIsIkpTT04iLCJwYXJzZSIsInRvdGFsX2ZlZSIsImJpbGxpbmdNYW5hZ2VyIiwic3BlY2lhbF9wYXkiLCJ1c2VyX2NvdW50IiwibG9nIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsIlN0cmluZyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJiaWxsaW5nX3NldHRsZXVwIiwiYWNjb3VudGluZ19tb250aCIsIkVtYWlsIiwidGltZSIsInMiLCJjYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoIiwiUGFja2FnZSIsInNlbmQiLCJzdHJpbmdpZnkiLCJ0aW1lRW5kIiwic2V0VXNlcm5hbWUiLCJpbnZpdGVfc3RhdGUiLCJiaWxsaW5nX3JlY2hhcmdlIiwibmV3X2lkIiwibW9kdWxlX25hbWVzIiwibGlzdHByaWNlcyIsIm9uZV9tb250aF95dWFuIiwib3JkZXJfYm9keSIsInJlc3VsdF9vYmoiLCJzcGFjZV91c2VyX2NvdW50IiwibGlzdHByaWNlX3JtYiIsIm5hbWVfemgiLCJjcmVhdGVVbmlmaWVkT3JkZXIiLCJqb2luIiwib3V0X3RyYWRlX25vIiwibW9tZW50IiwiZm9ybWF0Iiwic3BiaWxsX2NyZWF0ZV9pcCIsIm5vdGlmeV91cmwiLCJ0cmFkZV90eXBlIiwicHJvZHVjdF9pZCIsImluZm8iLCJnZXRfc3BhY2VfdXNlcl9jb3VudCIsInVzZXJfY291bnRfaW5mbyIsInRvdGFsX3VzZXJfY291bnQiLCJhY2NlcHRlZF91c2VyX2NvdW50IiwiY3JlYXRlX3NlY3JldCIsInJlbW92ZV9zZWNyZXQiLCJ0b2tlbiIsImN1clNwYWNlVXNlciIsIm93cyIsImZsb3dfaWQiLCJmbCIsInBlcm1zIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY3VycmVudFVzZXIiLCJsYW5nIiwidXNlckNQIiwic2V0UGFzc3dvcmQiLCJsb2dvdXQiLCJtb2JpbGVfdmVyaWZpZWQiLCJTTVNRdWV1ZSIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJjb3VudF9kYXlzIiwiZW5kX2RhdGVfdGltZSIsInN0YXJ0X2RhdGVfdGltZSIsImJpbGxpbmdzIiwidHJhbnNhY3Rpb24iLCJiaWxsaW5nX2RhdGUiLCJnZXREYXRlIiwicmVmcmVzaF9iYWxhbmNlIiwicmVmcmVzaF9kYXRlIiwiYXBwX2JpbGwiLCJiX20iLCJiX21fZCIsImJpbGwiLCJjcmVkaXRzIiwiZGViaXRzIiwibGFzdF9iYWxhbmNlIiwibGFzdF9iaWxsIiwicGF5bWVudF9iaWxsIiwic2V0T2JqIiwiJGx0IiwiYmlsbGluZ19tb250aCIsImJhbGFuY2UiLCJnZXRfYmFsYW5jZSIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImFfbSIsIm5ld2VzdF9iaWxsIiwicGVyaW9kX3Jlc3VsdCIsInJlbWFpbmluZ19tb250aHMiLCJiIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJ1c2VyX2xpbWl0IiwibWNsIiwib3BlcmF0b3IiLCJjcm9uIiwic3RhdGlzdGljcyIsInNjaGVkdWxlIiwicnVsZSIsImdvX25leHQiLCJzY2hlZHVsZUpvYiIsImRhdGVGb3JtYXQiLCJkYXRla2V5IiwiZ2V0RnVsbFllYXIiLCJnZXRNb250aCIsInllc3RlckRheSIsImROb3ciLCJkQmVmb3JlIiwiZGFpbHlTdGF0aWNzQ291bnQiLCJzdGF0aWNzIiwiJGd0Iiwic3RhdGljc0NvdW50Iiwib3duZXJOYW1lIiwibGFzdExvZ29uIiwic1VzZXJzIiwic1VzZXIiLCJsYXN0TW9kaWZpZWQiLCJvYmpBcnIiLCJtb2QiLCJwb3N0c0F0dGFjaG1lbnRzIiwiYXR0U2l6ZSIsInNpemVTdW0iLCJwb3N0cyIsInBvc3QiLCJhdHRzIiwiY2ZzIiwiYXR0Iiwib3JpZ2luYWwiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwiTWlncmF0aW9ucyIsInZlcnNpb24iLCJ1cCIsInVwZGF0ZV9jZnNfaW5zdGFuY2UiLCJwYXJlbnRfaWQiLCJpbnN0YW5jZV9pZCIsImF0dGFjaF92ZXJzaW9uIiwiaXNDdXJyZW50IiwibWV0YWRhdGEiLCJwYXJlbnQiLCJpbnN0YW5jZSIsImFwcHJvdmUiLCJjdXJyZW50IiwiYXR0YWNobWVudHMiLCJpbnMiLCJhdHRhY2hzIiwiY3VycmVudF92ZXIiLCJfcmV2IiwiaGlzdG9yeXMiLCJoaXMiLCJkb3duIiwib3JnYW5pemF0aW9uIiwiY2hlY2tfY291bnQiLCJuZXdfb3JnX2lkcyIsInJlbW92ZWRfb3JnX2lkcyIsInJvb3Rfb3JnIiwidXBkYXRlVXNlcnMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwiVGFidWxhciIsIlRhYmxlIiwiY29sdW1ucyIsIm9yZGVyYWJsZSIsImRvbSIsImxlbmd0aENoYW5nZSIsIm9yZGVyaW5nIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxnQkFBSjtBQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ0Ysa0JBQWdCLENBQUNHLENBQUQsRUFBRztBQUFDSCxvQkFBZ0IsR0FBQ0csQ0FBakI7QUFBbUI7O0FBQXhDLENBQWpELEVBQTJGLENBQTNGO0FBR3JCSCxnQkFBZ0IsQ0FBQztBQUNoQixtQkFBaUIsUUFERDtBQUVoQkksU0FBTyxFQUFFLFFBRk87QUFHaEIsWUFBVSxTQUhNO0FBSWhCQyxRQUFNLEVBQUUsUUFKUTtBQUtoQixnQ0FBOEI7QUFMZCxDQUFELEVBTWIsY0FOYSxDQUFoQjs7QUFRQSxJQUFJQyxNQUFNLENBQUNDLFFBQVAsSUFBbUJELE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsT0FBdkMsRUFBZ0Q7QUFDL0NSLGtCQUFnQixDQUFDO0FBQ2hCLGtCQUFjO0FBREUsR0FBRCxFQUViLGNBRmEsQ0FBaEI7QUFHQSxDOzs7Ozs7Ozs7OztBQ2ZEUyxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JDLFVBQWhCLEdBQTZCLFVBQVVDLE1BQVYsRUFBa0I7QUFDM0MsTUFBSSxDQUFDLElBQUwsRUFBVztBQUNQO0FBQ0g7O0FBQ0QsTUFBRyxDQUFDQSxNQUFKLEVBQVc7QUFDUEEsVUFBTSxHQUFHQyxPQUFPLENBQUNELE1BQVIsRUFBVDtBQUNIOztBQUNELE9BQUtFLElBQUwsQ0FBVSxVQUFVQyxFQUFWLEVBQWNDLEVBQWQsRUFBa0I7QUFDOUIsUUFBSUMsVUFBVSxHQUFHRixFQUFFLENBQUNHLE9BQUgsSUFBYyxDQUEvQjtBQUNBLFFBQUlDLFVBQVUsR0FBR0gsRUFBRSxDQUFDRSxPQUFILElBQWMsQ0FBL0I7O0FBQ0EsUUFBR0QsVUFBVSxJQUFJRSxVQUFqQixFQUE0QjtBQUNsQixhQUFPRixVQUFVLEdBQUdFLFVBQWIsR0FBMEIsQ0FBQyxDQUEzQixHQUErQixDQUF0QztBQUNILEtBRlAsTUFFVztBQUNWLGFBQU9KLEVBQUUsQ0FBQ0ssSUFBSCxDQUFRQyxhQUFSLENBQXNCTCxFQUFFLENBQUNJLElBQXpCLEVBQStCUixNQUEvQixDQUFQO0FBQ0E7QUFDRSxHQVJEO0FBU0gsQ0FoQkQ7O0FBbUJBSCxLQUFLLENBQUNDLFNBQU4sQ0FBZ0JZLFdBQWhCLEdBQThCLFVBQVVDLENBQVYsRUFBYTtBQUN2QyxNQUFJcEIsQ0FBQyxHQUFHLElBQUlNLEtBQUosRUFBUjtBQUNBLE9BQUtlLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ0YsQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQXBCLEtBQUMsQ0FBQ3dCLElBQUYsQ0FBT0QsQ0FBUDtBQUNILEdBSEQ7QUFJQSxTQUFPdkIsQ0FBUDtBQUNILENBUEQ7QUFTQTs7Ozs7QUFHQU0sS0FBSyxDQUFDQyxTQUFOLENBQWdCa0IsTUFBaEIsR0FBeUIsVUFBVUMsSUFBVixFQUFnQkMsRUFBaEIsRUFBb0I7QUFDekMsTUFBSUQsSUFBSSxHQUFHLENBQVgsRUFBYztBQUNWO0FBQ0g7O0FBQ0QsTUFBSUUsSUFBSSxHQUFHLEtBQUtDLEtBQUwsQ0FBVyxDQUFDRixFQUFFLElBQUlELElBQVAsSUFBZSxDQUFmLElBQW9CLEtBQUtJLE1BQXBDLENBQVg7QUFDQSxPQUFLQSxNQUFMLEdBQWNKLElBQUksR0FBRyxDQUFQLEdBQVcsS0FBS0ksTUFBTCxHQUFjSixJQUF6QixHQUFnQ0EsSUFBOUM7QUFDQSxTQUFPLEtBQUtGLElBQUwsQ0FBVU8sS0FBVixDQUFnQixJQUFoQixFQUFzQkgsSUFBdEIsQ0FBUDtBQUNILENBUEQ7QUFTQTs7Ozs7O0FBSUF0QixLQUFLLENBQUNDLFNBQU4sQ0FBZ0J5QixjQUFoQixHQUFpQyxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDN0MsTUFBSUMsQ0FBQyxHQUFHLEVBQVI7QUFDQSxPQUFLZCxPQUFMLENBQWEsVUFBVUMsQ0FBVixFQUFhO0FBQ3RCLFFBQUlDLENBQUMsR0FBR0QsQ0FBQyxHQUFHQSxDQUFDLENBQUNXLENBQUQsQ0FBSixHQUFVLElBQW5CO0FBQ0EsUUFBSUcsQ0FBQyxHQUFHLEtBQVI7O0FBQ0EsUUFBSWIsQ0FBQyxZQUFZakIsS0FBakIsRUFBd0I7QUFDcEI4QixPQUFDLEdBQUdiLENBQUMsQ0FBQ2MsUUFBRixDQUFXSCxDQUFYLENBQUo7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFJWCxDQUFDLFlBQVllLE1BQWpCLEVBQXlCO0FBQ3JCLFlBQUksUUFBUWYsQ0FBWixFQUFlO0FBQ1hBLFdBQUMsR0FBR0EsQ0FBQyxDQUFDLElBQUQsQ0FBTDtBQUNILFNBRkQsTUFFTyxJQUFJLFNBQVNBLENBQWIsRUFBZ0I7QUFDbkJBLFdBQUMsR0FBR0EsQ0FBQyxDQUFDLEtBQUQsQ0FBTDtBQUNIO0FBRUo7O0FBQ0QsVUFBSVcsQ0FBQyxZQUFZNUIsS0FBakIsRUFBd0I7QUFDcEI4QixTQUFDLEdBQUlGLENBQUMsS0FBS0ssU0FBUCxHQUFvQixLQUFwQixHQUE0QkwsQ0FBQyxDQUFDRyxRQUFGLENBQVdkLENBQVgsQ0FBaEM7QUFDSCxPQUZELE1BRU87QUFDSGEsU0FBQyxHQUFJRixDQUFDLEtBQUtLLFNBQVAsR0FBb0IsS0FBcEIsR0FBNEJoQixDQUFDLElBQUlXLENBQXJDO0FBQ0g7QUFDSjs7QUFFRCxRQUFJRSxDQUFKLEVBQU87QUFDSEQsT0FBQyxDQUFDWCxJQUFGLENBQU9GLENBQVA7QUFDSDtBQUNKLEdBeEJEO0FBeUJBLFNBQU9hLENBQVA7QUFDSCxDQTVCRDtBQThCQTs7Ozs7O0FBSUE3QixLQUFLLENBQUNDLFNBQU4sQ0FBZ0JpQyxnQkFBaEIsR0FBbUMsVUFBVVAsQ0FBVixFQUFhQyxDQUFiLEVBQWdCO0FBQy9DLE1BQUlPLENBQUMsR0FBRyxJQUFSO0FBQ0EsT0FBS3BCLE9BQUwsQ0FBYSxVQUFVQyxDQUFWLEVBQWE7QUFDdEIsUUFBSUMsQ0FBQyxHQUFHRCxDQUFDLEdBQUdBLENBQUMsQ0FBQ1csQ0FBRCxDQUFKLEdBQVUsSUFBbkI7QUFDQSxRQUFJRyxDQUFDLEdBQUcsS0FBUjs7QUFDQSxRQUFJYixDQUFDLFlBQVlqQixLQUFqQixFQUF3QjtBQUNwQjhCLE9BQUMsR0FBR2IsQ0FBQyxDQUFDYyxRQUFGLENBQVdILENBQVgsQ0FBSjtBQUNILEtBRkQsTUFFTztBQUNIRSxPQUFDLEdBQUlGLENBQUMsS0FBS0ssU0FBUCxHQUFvQixLQUFwQixHQUE0QmhCLENBQUMsSUFBSVcsQ0FBckM7QUFDSDs7QUFFRCxRQUFJRSxDQUFKLEVBQU87QUFDSEssT0FBQyxHQUFHbkIsQ0FBSjtBQUNIO0FBQ0osR0FaRDtBQWFBLFNBQU9tQixDQUFQO0FBQ0gsQ0FoQkQsQzs7Ozs7Ozs7Ozs7O0FDOUVBLElBQUFDLE9BQUEsRUFBQUMsTUFBQSxFQUFBQyxLQUFBO0FBQUFsQyxVQUNDO0FBQUFOLFlBQVUsRUFBVjtBQUNBeUMsTUFBSUEsRUFESjtBQUVBQyxRQUFNLEVBRk47QUFHQUMsa0JBQWdCO0FBQ2YsUUFBQUMsR0FBQSxFQUFBQyxJQUFBO0FBQUEsV0FBTyxDQUFDLEdBQUFELE1BQUE3QyxPQUFBQyxRQUFBLGFBQUE2QyxPQUFBRCxJQUFBLHFCQUFBQyxLQUEwQkMsS0FBMUIsR0FBMEIsTUFBMUIsR0FBMEIsTUFBMUIsQ0FBUjtBQUpEO0FBS0FDLGtCQUFnQixVQUFDQyxNQUFELEVBQVNDLEtBQVQsRUFBZ0JDLFlBQWhCO0FBQ2YsUUFBQU4sR0FBQSxFQUFBQyxJQUFBLEVBQUFNLEdBQUE7O0FBQUEsUUFBRyxPQUFPSCxNQUFQLEtBQWlCLFFBQXBCO0FBQ0NBLGVBQVNBLE9BQU9JLFFBQVAsRUFBVDtBQ01FOztBREpILFFBQUcsQ0FBQ0osTUFBSjtBQUNDLGFBQU8sRUFBUDtBQ01FOztBREpILFFBQUdBLFdBQVUsS0FBYjtBQUNDLFVBQUdDLFNBQVNBLFVBQVMsQ0FBckI7QUFDQ0QsaUJBQVNLLE9BQU9MLE1BQVAsRUFBZU0sT0FBZixDQUF1QkwsS0FBdkIsQ0FBVDtBQ01HOztBRExKLFdBQU9DLFlBQVA7QUFDQyxZQUFHLEVBQUVELFNBQVNBLFVBQVMsQ0FBcEIsQ0FBSDtBQUVDQSxrQkFBQSxDQUFBTCxNQUFBSSxPQUFBTyxLQUFBLHdCQUFBVixPQUFBRCxJQUFBLGNBQUFDLEtBQXFDbkIsTUFBckMsR0FBcUMsTUFBckMsR0FBcUMsTUFBckM7O0FBQ0EsZUFBT3VCLEtBQVA7QUFDQ0Esb0JBQVEsQ0FBUjtBQUpGO0FDV0s7O0FETkxFLGNBQU0scUJBQU47O0FBQ0EsWUFBR0YsVUFBUyxDQUFaO0FBQ0NFLGdCQUFNLHFCQUFOO0FDUUk7O0FEUExILGlCQUFTQSxPQUFPUSxPQUFQLENBQWVMLEdBQWYsRUFBb0IsS0FBcEIsQ0FBVDtBQ1NHOztBRFJKLGFBQU9ILE1BQVA7QUFiRDtBQWVDLGFBQU8sRUFBUDtBQ1VFO0FEckNKO0FBNEJBUyxxQkFBbUIsVUFBQ0MsR0FBRDtBQUVsQixRQUFBUCxHQUFBO0FBQUFBLFVBQU0sSUFBSVEsTUFBSixDQUFXLDJDQUFYLENBQU47QUFDQSxXQUFPUixJQUFJUyxJQUFKLENBQVNGLEdBQVQsQ0FBUDtBQS9CRDtBQUFBLENBREQsQyxDQWtDQTs7Ozs7QUFLQXBELFFBQVF1RCxVQUFSLEdBQXFCLFVBQUN4RCxNQUFEO0FBQ3BCLE1BQUF5RCxPQUFBO0FBQUFBLFlBQVV6RCxPQUFPMEQsU0FBUCxDQUFpQixDQUFqQixDQUFWO0FBQ0EsU0FBTyw0QkFBNEJELE9BQTVCLEdBQXNDLFFBQTdDO0FBRm9CLENBQXJCOztBQUlBLElBQUcvRCxPQUFPaUUsUUFBVjtBQUVDMUQsVUFBUTJELGtCQUFSLEdBQTZCO0FDZ0IxQixXRGZGQyxLQUFLO0FBQUNDLGFBQU9DLFFBQVFDLEVBQVIsQ0FBVyx1QkFBWCxDQUFSO0FBQTZDQyxZQUFNRixRQUFRQyxFQUFSLENBQVcsc0JBQVgsQ0FBbkQ7QUFBdUZFLFlBQU0sSUFBN0Y7QUFBbUdDLFlBQUssU0FBeEc7QUFBbUhDLHlCQUFtQkwsUUFBUUMsRUFBUixDQUFXLElBQVg7QUFBdEksS0FBTCxDQ2VFO0FEaEIwQixHQUE3Qjs7QUFHQS9ELFVBQVFvRSxxQkFBUixHQUFnQztBQUMvQixRQUFBQyxhQUFBO0FBQUFBLG9CQUFnQmxDLEdBQUdtQyxpQkFBSCxDQUFxQkMsT0FBckIsQ0FBNkI7QUFBQ0MsWUFBS3hFLFFBQVF5RSxNQUFSLEVBQU47QUFBdUJDLFdBQUk7QUFBM0IsS0FBN0IsQ0FBaEI7O0FBQ0EsUUFBR0wsYUFBSDtBQUNDLGFBQU9BLGNBQWNNLEtBQXJCO0FBREQ7QUFHQyxhQUFPLEVBQVA7QUMwQkU7QUQvQjRCLEdBQWhDOztBQU9BM0UsVUFBUTRFLHVCQUFSLEdBQWtDLFVBQUNDLGtCQUFELEVBQW9CQyxhQUFwQjtBQUNqQyxRQUFBQyxNQUFBLEVBQUFDLFNBQUEsRUFBQUMsVUFBQSxFQUFBM0MsR0FBQSxFQUFBQyxJQUFBLEVBQUEyQyxJQUFBLEVBQUFDLEdBQUE7O0FBQUEsUUFBRzFGLE9BQU8yRixTQUFQLE1BQXNCLENBQUNwRixRQUFReUUsTUFBUixFQUExQjtBQUVDSSwyQkFBcUIsRUFBckI7QUFDQUEseUJBQW1CTSxHQUFuQixHQUF5QkUsYUFBYUMsT0FBYixDQUFxQix3QkFBckIsQ0FBekI7QUFDQVQseUJBQW1CRSxNQUFuQixHQUE0Qk0sYUFBYUMsT0FBYixDQUFxQiwyQkFBckIsQ0FBNUI7QUMyQkU7O0FEekJISCxVQUFNTixtQkFBbUJNLEdBQXpCO0FBQ0FKLGFBQVNGLG1CQUFtQkUsTUFBNUI7O0FBQ0EsUUFBR0YsbUJBQW1CTSxHQUF0QjtBQUNDLFVBQUdBLFFBQU9KLE1BQVY7QUFDQ0Msb0JBQVksdUJBQXVCRCxNQUFuQztBQUNBUSxVQUFFLE1BQUYsRUFBVUMsR0FBVixDQUFjLGlCQUFkLEVBQWdDLFNBQU94RixRQUFReUYsV0FBUixDQUFvQlQsU0FBcEIsQ0FBUCxHQUFzQyxHQUF0RTtBQUZEO0FBSUNPLFVBQUUsTUFBRixFQUFVQyxHQUFWLENBQWMsaUJBQWQsRUFBZ0MsU0FBT3hGLFFBQVF5RixXQUFSLENBQW9CTixHQUFwQixDQUFQLEdBQWdDLEdBQWhFO0FBTEY7QUFBQTtBQU9DRixtQkFBQSxDQUFBM0MsTUFBQTdDLE9BQUFDLFFBQUEsYUFBQTZDLE9BQUFELElBQUEsc0JBQUE0QyxPQUFBM0MsS0FBQW1ELEtBQUEsWUFBQVIsS0FBNkNELFVBQTdDLEdBQTZDLE1BQTdDLEdBQTZDLE1BQTdDLEdBQTZDLE1BQTdDOztBQUNBLFVBQUdBLFVBQUg7QUFDQ00sVUFBRSxNQUFGLEVBQVVDLEdBQVYsQ0FBYyxpQkFBZCxFQUFnQyxTQUFPeEYsUUFBUXlGLFdBQVIsQ0FBb0JSLFVBQXBCLENBQVAsR0FBdUMsR0FBdkU7QUFERDtBQUdDQSxxQkFBYSxtREFBYjtBQUNBTSxVQUFFLE1BQUYsRUFBVUMsR0FBVixDQUFjLGlCQUFkLEVBQWdDLFNBQU94RixRQUFReUYsV0FBUixDQUFvQlIsVUFBcEIsQ0FBUCxHQUF1QyxHQUF2RTtBQVpGO0FDeUNHOztBRDNCSCxRQUFHSCxhQUFIO0FBQ0MsVUFBR3JGLE9BQU8yRixTQUFQLEVBQUg7QUFFQztBQzRCRzs7QUR6QkosVUFBR3BGLFFBQVF5RSxNQUFSLEVBQUg7QUFDQyxZQUFHVSxHQUFIO0FBQ0NFLHVCQUFhTSxPQUFiLENBQXFCLHdCQUFyQixFQUE4Q1IsR0FBOUM7QUMyQkssaUJEMUJMRSxhQUFhTSxPQUFiLENBQXFCLDJCQUFyQixFQUFpRFosTUFBakQsQ0MwQks7QUQ1Qk47QUFJQ00sdUJBQWFPLFVBQWIsQ0FBd0Isd0JBQXhCO0FDMkJLLGlCRDFCTFAsYUFBYU8sVUFBYixDQUF3QiwyQkFBeEIsQ0MwQks7QURoQ1A7QUFORDtBQ3lDRztBRGhFOEIsR0FBbEM7O0FBcUNBNUYsVUFBUTZGLG1CQUFSLEdBQThCO0FBQzdCLFFBQUFDLFdBQUE7QUFBQUEsa0JBQWMzRCxHQUFHbUMsaUJBQUgsQ0FBcUJDLE9BQXJCLENBQTZCO0FBQUNDLFlBQUt4RSxRQUFReUUsTUFBUixFQUFOO0FBQXVCQyxXQUFJO0FBQTNCLEtBQTdCLENBQWQ7O0FBQ0EsUUFBR29CLFdBQUg7QUFDQyxhQUFPQSxZQUFZbkIsS0FBbkI7QUFERDtBQUdDLGFBQU8sRUFBUDtBQ2tDRTtBRHZDMEIsR0FBOUI7O0FBT0EzRSxVQUFRK0YsbUJBQVIsR0FBOEI7QUFDN0IsUUFBQUMsV0FBQTtBQUFBQSxrQkFBYzdELEdBQUdtQyxpQkFBSCxDQUFxQkMsT0FBckIsQ0FBNkI7QUFBQ0MsWUFBS3hFLFFBQVF5RSxNQUFSLEVBQU47QUFBdUJDLFdBQUk7QUFBM0IsS0FBN0IsQ0FBZDs7QUFDQSxRQUFHc0IsV0FBSDtBQUNDLGFBQU9BLFlBQVlyQixLQUFuQjtBQUREO0FBR0MsYUFBTyxFQUFQO0FDdUNFO0FENUMwQixHQUE5Qjs7QUFPQTNFLFVBQVFpRyxxQkFBUixHQUFnQyxVQUFDQyxnQkFBRCxFQUFrQnBCLGFBQWxCO0FBQy9CLFFBQUFxQixRQUFBLEVBQUFDLFFBQUE7O0FBQUEsUUFBRzNHLE9BQU8yRixTQUFQLE1BQXNCLENBQUNwRixRQUFReUUsTUFBUixFQUExQjtBQUVDeUIseUJBQW1CLEVBQW5CO0FBQ0FBLHVCQUFpQjNGLElBQWpCLEdBQXdCOEUsYUFBYUMsT0FBYixDQUFxQix1QkFBckIsQ0FBeEI7QUFDQVksdUJBQWlCRyxJQUFqQixHQUF3QmhCLGFBQWFDLE9BQWIsQ0FBcUIsdUJBQXJCLENBQXhCO0FDd0NFOztBRHZDSEMsTUFBRSxNQUFGLEVBQVVlLFdBQVYsQ0FBc0IsYUFBdEIsRUFBcUNBLFdBQXJDLENBQWlELFlBQWpELEVBQStEQSxXQUEvRCxDQUEyRSxrQkFBM0U7QUFDQUgsZUFBV0QsaUJBQWlCM0YsSUFBNUI7QUFDQTZGLGVBQVdGLGlCQUFpQkcsSUFBNUI7O0FBQ0EsU0FBT0YsUUFBUDtBQUNDQSxpQkFBVyxPQUFYO0FBQ0FDLGlCQUFXLEdBQVg7QUN5Q0U7O0FEeENILFFBQUdELFlBQVksQ0FBQ0ksUUFBUUMsR0FBUixDQUFZLGVBQVosQ0FBaEI7QUFDQ2pCLFFBQUUsTUFBRixFQUFVa0IsUUFBVixDQUFtQixVQUFRTixRQUEzQjtBQzBDRTs7QURsQ0gsUUFBR3JCLGFBQUg7QUFDQyxVQUFHckYsT0FBTzJGLFNBQVAsRUFBSDtBQUVDO0FDbUNHOztBRGhDSixVQUFHcEYsUUFBUXlFLE1BQVIsRUFBSDtBQUNDLFlBQUd5QixpQkFBaUIzRixJQUFwQjtBQUNDOEUsdUJBQWFNLE9BQWIsQ0FBcUIsdUJBQXJCLEVBQTZDTyxpQkFBaUIzRixJQUE5RDtBQ2tDSyxpQkRqQ0w4RSxhQUFhTSxPQUFiLENBQXFCLHVCQUFyQixFQUE2Q08saUJBQWlCRyxJQUE5RCxDQ2lDSztBRG5DTjtBQUlDaEIsdUJBQWFPLFVBQWIsQ0FBd0IsdUJBQXhCO0FDa0NLLGlCRGpDTFAsYUFBYU8sVUFBYixDQUF3Qix1QkFBeEIsQ0NpQ0s7QUR2Q1A7QUFORDtBQ2dERztBRHJFNEIsR0FBaEM7O0FBbUNBNUYsVUFBUTBHLFFBQVIsR0FBbUIsVUFBQ3ZCLEdBQUQ7QUFDbEIsUUFBQTNCLE9BQUEsRUFBQXpELE1BQUE7QUFBQUEsYUFBU0MsUUFBUTJHLFNBQVIsRUFBVDtBQUNBbkQsY0FBVXpELE9BQU8wRCxTQUFQLENBQWlCLENBQWpCLENBQVY7QUFFQTBCLFVBQU1BLE9BQU8sNEJBQTRCM0IsT0FBNUIsR0FBc0MsUUFBbkQ7QUNxQ0UsV0RuQ0ZvRCxPQUFPQyxJQUFQLENBQVkxQixHQUFaLEVBQWlCLE9BQWpCLEVBQTBCLHlCQUExQixDQ21DRTtBRHpDZ0IsR0FBbkI7O0FBUUFuRixVQUFROEcsZUFBUixHQUEwQixVQUFDM0IsR0FBRDtBQUN6QixRQUFBNEIsU0FBQSxFQUFBQyxNQUFBO0FBQUFELGdCQUFZLEVBQVo7QUFDQUEsY0FBVSxTQUFWLElBQXVCL0csUUFBUWlILFVBQVIsRUFBdkI7QUFDQUYsY0FBVSxXQUFWLElBQXlCdEgsT0FBT2dGLE1BQVAsRUFBekI7QUFDQXNDLGNBQVUsY0FBVixJQUE0QkcsU0FBU0MsaUJBQVQsRUFBNUI7QUFFQUgsYUFBUyxHQUFUOztBQUVBLFFBQUc3QixJQUFJaUMsT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBQyxDQUF2QjtBQUNDSixlQUFTLEdBQVQ7QUNtQ0U7O0FEakNILFdBQU83QixNQUFNNkIsTUFBTixHQUFlekIsRUFBRThCLEtBQUYsQ0FBUU4sU0FBUixDQUF0QjtBQVh5QixHQUExQjs7QUFhQS9HLFVBQVFzSCxrQkFBUixHQUE2QixVQUFDQyxNQUFEO0FBQzVCLFFBQUFSLFNBQUE7QUFBQUEsZ0JBQVksRUFBWjtBQUNBQSxjQUFVLFNBQVYsSUFBdUIvRyxRQUFRaUgsVUFBUixFQUF2QjtBQUNBRixjQUFVLFdBQVYsSUFBeUJ0SCxPQUFPZ0YsTUFBUCxFQUF6QjtBQUNBc0MsY0FBVSxjQUFWLElBQTRCRyxTQUFTQyxpQkFBVCxFQUE1QjtBQUNBLFdBQU8sbUJBQW1CSSxNQUFuQixHQUE0QixHQUE1QixHQUFrQ2hDLEVBQUU4QixLQUFGLENBQVFOLFNBQVIsQ0FBekM7QUFMNEIsR0FBN0I7O0FBT0EvRyxVQUFRd0gsZ0JBQVIsR0FBMkIsVUFBQ0QsTUFBRDtBQUMxQixRQUFBRSxHQUFBLEVBQUF0QyxHQUFBO0FBQUFBLFVBQU1uRixRQUFRc0gsa0JBQVIsQ0FBMkJDLE1BQTNCLENBQU47QUFDQXBDLFVBQU1uRixRQUFReUYsV0FBUixDQUFvQk4sR0FBcEIsQ0FBTjtBQUVBc0MsVUFBTXRGLEdBQUd1RixJQUFILENBQVFuRCxPQUFSLENBQWdCZ0QsTUFBaEIsQ0FBTjs7QUFFQSxRQUFHLENBQUNFLElBQUlFLGFBQUwsSUFBc0IsQ0FBQzNILFFBQVE0SCxRQUFSLEVBQXZCLElBQTZDLENBQUM1SCxRQUFRNkgsU0FBUixFQUFqRDtBQ21DSSxhRGxDSGpCLE9BQU9rQixRQUFQLEdBQWtCM0MsR0NrQ2Y7QURuQ0o7QUNxQ0ksYURsQ0huRixRQUFRK0gsVUFBUixDQUFtQjVDLEdBQW5CLENDa0NHO0FBQ0Q7QUQ1Q3VCLEdBQTNCOztBQVdBbkYsVUFBUWdJLGFBQVIsR0FBd0IsVUFBQzdDLEdBQUQ7QUFDdkIsUUFBQThDLEdBQUEsRUFBQUMsSUFBQSxFQUFBQyxRQUFBOztBQUFBLFFBQUdoRCxHQUFIO0FBQ0MsVUFBR25GLFFBQVFvSSxNQUFSLEVBQUg7QUFDQ0YsZUFBT0csR0FBR0MsT0FBSCxDQUFXLGVBQVgsRUFBNEJKLElBQW5DO0FBQ0FDLG1CQUFXaEQsR0FBWDtBQUNBOEMsY0FBTSwwQkFBd0JFLFFBQXhCLEdBQWlDLElBQXZDO0FDcUNJLGVEcENKRCxLQUFLRCxHQUFMLEVBQVUsVUFBQ00sS0FBRCxFQUFRQyxNQUFSLEVBQWdCQyxNQUFoQjtBQUNULGNBQUdGLEtBQUg7QUFDQ0csbUJBQU9ILEtBQVAsQ0FBYUEsS0FBYjtBQ3FDSztBRHZDUCxVQ29DSTtBRHhDTDtBQzhDSyxlRHJDSnZJLFFBQVErSCxVQUFSLENBQW1CNUMsR0FBbkIsQ0NxQ0k7QUQvQ047QUNpREc7QURsRG9CLEdBQXhCOztBQWNBbkYsVUFBUTJJLE9BQVIsR0FBa0IsVUFBQ3BCLE1BQUQ7QUFDakIsUUFBQUUsR0FBQSxFQUFBUSxHQUFBLEVBQUFXLENBQUEsRUFBQUMsYUFBQSxFQUFBWCxJQUFBLEVBQUFZLFFBQUEsRUFBQVgsUUFBQSxFQUFBWSxJQUFBOztBQUFBLFFBQUcsQ0FBQ3RKLE9BQU9nRixNQUFQLEVBQUo7QUFDQ3pFLGNBQVFnSixnQkFBUjtBQUNBLGFBQU8sSUFBUDtBQ3dDRTs7QUR0Q0h2QixVQUFNdEYsR0FBR3VGLElBQUgsQ0FBUW5ELE9BQVIsQ0FBZ0JnRCxNQUFoQixDQUFOOztBQUNBLFFBQUcsQ0FBQ0UsR0FBSjtBQUNDd0IsaUJBQVdDLEVBQVgsQ0FBYyxHQUFkO0FBQ0E7QUN3Q0U7O0FENUJISixlQUFXckIsSUFBSXFCLFFBQWY7O0FBQ0EsUUFBR3JCLElBQUkwQixTQUFQO0FBQ0MsVUFBR25KLFFBQVFvSSxNQUFSLEVBQUg7QUFDQ0YsZUFBT0csR0FBR0MsT0FBSCxDQUFXLGVBQVgsRUFBNEJKLElBQW5DOztBQUNBLFlBQUdZLFFBQUg7QUFDQ0MsaUJBQU8saUJBQWV4QixNQUFmLEdBQXNCLGFBQXRCLEdBQW1DTCxTQUFTQyxpQkFBVCxFQUFuQyxHQUFnRSxVQUFoRSxHQUEwRTFILE9BQU9nRixNQUFQLEVBQWpGO0FBQ0EwRCxxQkFBV3ZCLE9BQU9rQixRQUFQLENBQWdCc0IsTUFBaEIsR0FBeUIsR0FBekIsR0FBK0JMLElBQTFDO0FBRkQ7QUFJQ1oscUJBQVduSSxRQUFRc0gsa0JBQVIsQ0FBMkJDLE1BQTNCLENBQVg7QUFDQVkscUJBQVd2QixPQUFPa0IsUUFBUCxDQUFnQnNCLE1BQWhCLEdBQXlCLEdBQXpCLEdBQStCakIsUUFBMUM7QUM4Qkk7O0FEN0JMRixjQUFNLDBCQUF3QkUsUUFBeEIsR0FBaUMsSUFBdkM7QUFDQUQsYUFBS0QsR0FBTCxFQUFVLFVBQUNNLEtBQUQsRUFBUUMsTUFBUixFQUFnQkMsTUFBaEI7QUFDVCxjQUFHRixLQUFIO0FBQ0NHLG1CQUFPSCxLQUFQLENBQWFBLEtBQWI7QUMrQks7QURqQ1A7QUFURDtBQWNDdkksZ0JBQVF3SCxnQkFBUixDQUF5QkQsTUFBekI7QUFmRjtBQUFBLFdBaUJLLElBQUdwRixHQUFHdUYsSUFBSCxDQUFRMkIsYUFBUixDQUFzQjVCLElBQUl0QyxHQUExQixDQUFIO0FBQ0o4RCxpQkFBV0MsRUFBWCxDQUFjekIsSUFBSXRDLEdBQWxCO0FBREksV0FHQSxJQUFHc0MsSUFBSTZCLGFBQVA7QUFDSixVQUFHN0IsSUFBSUUsYUFBSixJQUFxQixDQUFDM0gsUUFBUTRILFFBQVIsRUFBdEIsSUFBNEMsQ0FBQzVILFFBQVE2SCxTQUFSLEVBQWhEO0FBQ0M3SCxnQkFBUStILFVBQVIsQ0FBbUIvSCxRQUFReUYsV0FBUixDQUFvQixpQkFBaUJnQyxJQUFJOEIsR0FBekMsQ0FBbkI7QUFERCxhQUVLLElBQUd2SixRQUFRNEgsUUFBUixNQUFzQjVILFFBQVE2SCxTQUFSLEVBQXpCO0FBQ0o3SCxnQkFBUXdILGdCQUFSLENBQXlCRCxNQUF6QjtBQURJO0FBR0owQixtQkFBV0MsRUFBWCxDQUFjLGtCQUFnQnpCLElBQUk4QixHQUFsQztBQU5HO0FBQUEsV0FRQSxJQUFHVCxRQUFIO0FBRUpELHNCQUFnQixpQkFBZUMsUUFBZixHQUF3QixNQUF4Qzs7QUFDQTtBQUNDVSxhQUFLWCxhQUFMO0FBREQsZUFBQVksTUFBQTtBQUVNYixZQUFBYSxNQUFBO0FBRUxDLGdCQUFRbkIsS0FBUixDQUFjLDhEQUFkO0FBQ0FtQixnQkFBUW5CLEtBQVIsQ0FBaUJLLEVBQUVlLE9BQUYsR0FBVSxNQUFWLEdBQWdCZixFQUFFZ0IsS0FBbkM7QUFSRztBQUFBO0FBVUo1SixjQUFRd0gsZ0JBQVIsQ0FBeUJELE1BQXpCO0FDK0JFOztBRDdCSCxRQUFHLENBQUNFLElBQUlFLGFBQUwsSUFBc0IsQ0FBQzNILFFBQVE0SCxRQUFSLEVBQXZCLElBQTZDLENBQUM1SCxRQUFRNkgsU0FBUixFQUE5QyxJQUFxRSxDQUFDSixJQUFJMEIsU0FBMUUsSUFBdUYsQ0FBQ0wsUUFBM0Y7QUMrQkksYUQ3Qkh2QyxRQUFRc0QsR0FBUixDQUFZLGdCQUFaLEVBQThCdEMsTUFBOUIsQ0M2Qkc7QUFDRDtBRDdGYyxHQUFsQjs7QUFpRUF2SCxVQUFROEosaUJBQVIsR0FBNEIsVUFBQ0MsT0FBRDtBQUMzQixRQUFBQyxRQUFBLEVBQUFDLFVBQUEsRUFBQUMsS0FBQTs7QUFBQSxTQUFPSCxPQUFQO0FBQ0NBLGdCQUFVL0osUUFBUStKLE9BQVIsRUFBVjtBQ2dDRTs7QUQvQkhFLGlCQUFhLENBQWI7O0FBQ0EsUUFBR2pLLFFBQVFtSyxZQUFSLEVBQUg7QUFDQ0YsbUJBQWEsQ0FBYjtBQ2lDRTs7QURoQ0hDLFlBQVEvSCxHQUFHaUksTUFBSCxDQUFVN0YsT0FBVixDQUFrQndGLE9BQWxCLENBQVI7QUFDQUMsZUFBQUUsU0FBQSxPQUFXQSxNQUFPRixRQUFsQixHQUFrQixNQUFsQjs7QUFDQSxTQUFBRSxTQUFBLE9BQUdBLE1BQU9HLE9BQVYsR0FBVSxNQUFWLEtBQXNCTCxhQUFZLE1BQWxDLElBQWlEQSxXQUFXLElBQUlNLElBQUosRUFBWixJQUEwQkwsYUFBVyxFQUFYLEdBQWMsRUFBZCxHQUFpQixJQUFqQixHQUFzQixJQUFoRztBQ2tDSSxhRGhDSHZCLE9BQU9ILEtBQVAsQ0FBYTNILEVBQUUsNEJBQUYsQ0FBYixDQ2dDRztBQUNEO0FEM0N3QixHQUE1Qjs7QUFZQVosVUFBUXVLLGlCQUFSLEdBQTRCO0FBQzNCLFFBQUFyRSxnQkFBQSxFQUFBc0UsTUFBQTtBQUFBdEUsdUJBQW1CbEcsUUFBUStGLG1CQUFSLEVBQW5COztBQUNBLFNBQU9HLGlCQUFpQjNGLElBQXhCO0FBQ0MyRix1QkFBaUIzRixJQUFqQixHQUF3QixPQUF4QjtBQ21DRTs7QURsQ0gsWUFBTzJGLGlCQUFpQjNGLElBQXhCO0FBQUEsV0FDTSxRQUROO0FBRUUsWUFBR1AsUUFBUTRILFFBQVIsRUFBSDtBQUNDNEMsbUJBQVMsQ0FBQyxFQUFWO0FBREQ7QUFHQ0EsbUJBQVMsRUFBVDtBQ29DSTs7QUR4Q0Q7O0FBRE4sV0FNTSxPQU5OO0FBT0UsWUFBR3hLLFFBQVE0SCxRQUFSLEVBQUg7QUFDQzRDLG1CQUFTLENBQUMsQ0FBVjtBQUREO0FBSUMsY0FBR3hLLFFBQVF5SyxRQUFSLEVBQUg7QUFDQ0QscUJBQVMsR0FBVDtBQUREO0FBR0NBLHFCQUFTLENBQVQ7QUFQRjtBQzZDSzs7QUQ5Q0Q7O0FBTk4sV0FlTSxhQWZOO0FBZ0JFLFlBQUd4SyxRQUFRNEgsUUFBUixFQUFIO0FBQ0M0QyxtQkFBUyxDQUFDLEVBQVY7QUFERDtBQUlDLGNBQUd4SyxRQUFReUssUUFBUixFQUFIO0FBQ0NELHFCQUFTLEdBQVQ7QUFERDtBQUdDQSxxQkFBUyxFQUFUO0FBUEY7QUMrQ0s7O0FEL0RQOztBQXlCQSxRQUFHakYsRUFBRSxRQUFGLEVBQVluRSxNQUFmO0FDeUNJLGFEeENIbUUsRUFBRSxRQUFGLEVBQVltRixJQUFaLENBQWlCO0FBQ2hCLFlBQUFDLFlBQUEsRUFBQUMsWUFBQSxFQUFBQyxNQUFBLEVBQUFDLFdBQUE7QUFBQUYsdUJBQWUsQ0FBZjtBQUNBRCx1QkFBZSxDQUFmO0FBQ0FHLHNCQUFjLENBQWQ7QUFDQXZGLFVBQUUsZUFBRixFQUFtQkEsRUFBRSxJQUFGLENBQW5CLEVBQTRCbUYsSUFBNUIsQ0FBaUM7QUMwQzNCLGlCRHpDTEUsZ0JBQWdCckYsRUFBRSxJQUFGLEVBQVF3RixXQUFSLENBQW9CLEtBQXBCLENDeUNYO0FEMUNOO0FBRUF4RixVQUFFLGVBQUYsRUFBbUJBLEVBQUUsSUFBRixDQUFuQixFQUE0Qm1GLElBQTVCLENBQWlDO0FDMkMzQixpQkQxQ0xDLGdCQUFnQnBGLEVBQUUsSUFBRixFQUFRd0YsV0FBUixDQUFvQixLQUFwQixDQzBDWDtBRDNDTjtBQUdBRCxzQkFBY0YsZUFBZUQsWUFBN0I7QUFDQUUsaUJBQVN0RixFQUFFLE1BQUYsRUFBVXlGLFdBQVYsS0FBMEJGLFdBQTFCLEdBQXdDTixNQUFqRDs7QUFDQSxZQUFHakYsRUFBRSxJQUFGLEVBQVEwRixRQUFSLENBQWlCLGtCQUFqQixDQUFIO0FDMkNNLGlCRDFDTDFGLEVBQUUsYUFBRixFQUFnQkEsRUFBRSxJQUFGLENBQWhCLEVBQXlCQyxHQUF6QixDQUE2QjtBQUFDLDBCQUFpQnFGLFNBQU8sSUFBekI7QUFBOEIsc0JBQWFBLFNBQU87QUFBbEQsV0FBN0IsQ0MwQ0s7QUQzQ047QUNnRE0saUJEN0NMdEYsRUFBRSxhQUFGLEVBQWdCQSxFQUFFLElBQUYsQ0FBaEIsRUFBeUJDLEdBQXpCLENBQTZCO0FBQUMsMEJBQWlCcUYsU0FBTyxJQUF6QjtBQUE4QixzQkFBVTtBQUF4QyxXQUE3QixDQzZDSztBQUlEO0FEL0ROLFFDd0NHO0FBeUJEO0FEL0Z3QixHQUE1Qjs7QUE4Q0E3SyxVQUFRa0wsaUJBQVIsR0FBNEIsVUFBQ1YsTUFBRDtBQUMzQixRQUFBdEUsZ0JBQUEsRUFBQWlGLE9BQUE7O0FBQUEsUUFBR25MLFFBQVE0SCxRQUFSLEVBQUg7QUFDQ3VELGdCQUFVdkUsT0FBT3dFLE1BQVAsQ0FBY1AsTUFBZCxHQUF1QixHQUF2QixHQUE2QixHQUE3QixHQUFtQyxFQUE3QztBQUREO0FBR0NNLGdCQUFVNUYsRUFBRXFCLE1BQUYsRUFBVWlFLE1BQVYsS0FBcUIsR0FBckIsR0FBMkIsRUFBckM7QUNxREU7O0FEcERILFVBQU83SyxRQUFRcUwsS0FBUixNQUFtQnJMLFFBQVE0SCxRQUFSLEVBQTFCO0FBRUMxQix5QkFBbUJsRyxRQUFRK0YsbUJBQVIsRUFBbkI7O0FBQ0EsY0FBT0csaUJBQWlCM0YsSUFBeEI7QUFBQSxhQUNNLE9BRE47QUFHRTRLLHFCQUFXLEVBQVg7QUFGSTs7QUFETixhQUlNLGFBSk47QUFLRUEscUJBQVcsR0FBWDtBQUxGO0FDMkRFOztBRHJESCxRQUFHWCxNQUFIO0FBQ0NXLGlCQUFXWCxNQUFYO0FDdURFOztBRHRESCxXQUFPVyxVQUFVLElBQWpCO0FBaEIyQixHQUE1Qjs7QUFrQkFuTCxVQUFRcUwsS0FBUixHQUFnQixVQUFDQyxTQUFELEVBQVlDLFFBQVo7QUFDZixRQUFBQyxNQUFBLEVBQUFDLE9BQUEsRUFBQUMsTUFBQSxFQUFBQyxNQUFBLEVBQUFDLE1BQUE7QUFBQUosYUFDQztBQUFBSyxlQUFTLFNBQVQ7QUFDQUMsa0JBQVksWUFEWjtBQUVBQyxlQUFTLFNBRlQ7QUFHQUMsWUFBTSxNQUhOO0FBSUFDLGNBQVEsUUFKUjtBQUtBQyxZQUFNLE1BTE47QUFNQUMsY0FBUTtBQU5SLEtBREQ7QUFRQVYsY0FBVSxFQUFWO0FBQ0FDLGFBQVMscUJBQVQ7QUFDQUUsYUFBUyxxQkFBVDtBQUNBTixnQkFBWSxDQUFDQSxhQUFhYyxVQUFVZCxTQUF4QixFQUFtQ2UsV0FBbkMsRUFBWjtBQUNBZCxlQUFXQSxZQUFZYSxVQUFVYixRQUF0QixJQUFrQ2EsVUFBVUUsZUFBdkQ7QUFDQVgsYUFBU0wsVUFBVXJJLEtBQVYsQ0FBZ0IsSUFBSUksTUFBSixDQUFXLHVDQUFYLENBQWhCLEtBQXdFaUksVUFBVXJJLEtBQVYsQ0FBZ0IsSUFBSUksTUFBSixDQUFXLFVBQVgsQ0FBaEIsQ0FBeEUsSUFBbUgsQ0FDM0gsRUFEMkgsRUFFM0htSSxPQUFPTyxPQUZvSCxDQUE1SDtBQUlBTixZQUFRRSxNQUFSLEdBQWlCQSxPQUFPLENBQVAsQ0FBakI7QUFDQSxXQUFPRixRQUFRRSxNQUFSLEtBQWtCSCxPQUFPUSxJQUF6QixJQUFpQ1AsUUFBUUUsTUFBUixLQUFrQkgsT0FBT1MsTUFBMUQsSUFBb0VSLFFBQVFFLE1BQVIsS0FBa0JILE9BQU9VLElBQXBHO0FBbkJlLEdBQWhCOztBQXFCQWxNLFVBQVF1TSxvQkFBUixHQUErQixVQUFDQyxnQkFBRDtBQUM5QixRQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQTNDLE9BQUEsRUFBQTRDLFVBQUEsRUFBQWxJLE1BQUE7QUFBQUEsYUFBU2hGLE9BQU9nRixNQUFQLEVBQVQ7QUFDQXNGLGNBQVUvSixRQUFRK0osT0FBUixFQUFWO0FBQ0E0QyxpQkFBYXhLLEdBQUd5SyxXQUFILENBQWVySSxPQUFmLENBQXVCO0FBQUNDLFlBQUtDLE1BQU47QUFBYXlGLGFBQU1IO0FBQW5CLEtBQXZCLEVBQW1EO0FBQUE4QyxjQUFPO0FBQUNKLHVCQUFjO0FBQWY7QUFBUCxLQUFuRCxDQUFiO0FBQ0FBLG9CQUFBRSxjQUFBLE9BQWdCQSxXQUFZRixhQUE1QixHQUE0QixNQUE1Qjs7QUFDQSxTQUFPQSxhQUFQO0FBQ0MsYUFBTyxFQUFQO0FDK0RFOztBRDlESCxRQUFHRCxnQkFBSDtBQUNDRSxnQkFBVUksRUFBRUMsT0FBRixDQUFVNUssR0FBR3NLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUF6RCxhQUFJO0FBQUMwRCxlQUFJUjtBQUFMO0FBQUosT0FBdEIsRUFBK0NTLEtBQS9DLEdBQXVEek0sV0FBdkQsQ0FBbUUsU0FBbkUsQ0FBVixDQUFWO0FBQ0EsYUFBT3FNLEVBQUVLLEtBQUYsQ0FBUVYsYUFBUixFQUFzQkMsT0FBdEIsQ0FBUDtBQUZEO0FBSUMsYUFBT0QsYUFBUDtBQ29FRTtBRC9FMkIsR0FBL0I7O0FBYUF6TSxVQUFRb04scUJBQVIsR0FBZ0MsVUFBQ0MsTUFBRCxFQUFTQyxHQUFUO0FBQy9CLFNBQU90TixRQUFRb0ksTUFBUixFQUFQO0FBQ0M7QUNxRUU7O0FEcEVIaUYsV0FBT0UsUUFBUCxDQUFnQkMsSUFBaEIsQ0FBcUJDLGdCQUFyQixDQUFzQyxhQUF0QyxFQUFxRCxVQUFDQyxFQUFEO0FBQ3BEQSxTQUFHQyxjQUFIO0FBQ0EsYUFBTyxLQUFQO0FBRkQ7O0FBR0EsUUFBR0wsR0FBSDtBQUNDLFVBQUcsT0FBT0EsR0FBUCxLQUFjLFFBQWpCO0FBQ0NBLGNBQU1ELE9BQU85SCxDQUFQLENBQVMrSCxHQUFULENBQU47QUN1RUc7O0FBQ0QsYUR2RUhBLElBQUlNLElBQUosQ0FBUztBQUNSLFlBQUFDLE9BQUE7QUFBQUEsa0JBQVVQLElBQUlRLFFBQUosR0FBZWQsSUFBZixDQUFvQixNQUFwQixDQUFWOztBQUNBLFlBQUdhLE9BQUg7QUN5RU0saUJEeEVMQSxRQUFRLENBQVIsRUFBV0osZ0JBQVgsQ0FBNEIsYUFBNUIsRUFBMkMsVUFBQ0MsRUFBRDtBQUMxQ0EsZUFBR0MsY0FBSDtBQUNBLG1CQUFPLEtBQVA7QUFGRCxZQ3dFSztBQUlEO0FEL0VOLFFDdUVHO0FBVUQ7QUQxRjRCLEdBQWhDO0FDNEZBOztBRDVFRCxJQUFHbE8sT0FBT3NPLFFBQVY7QUFDQy9OLFVBQVF1TSxvQkFBUixHQUErQixVQUFDeEMsT0FBRCxFQUFTdEYsTUFBVCxFQUFnQitILGdCQUFoQjtBQUM5QixRQUFBQyxhQUFBLEVBQUFDLE9BQUEsRUFBQUMsVUFBQTtBQUFBQSxpQkFBYXhLLEdBQUd5SyxXQUFILENBQWVySSxPQUFmLENBQXVCO0FBQUNDLFlBQUtDLE1BQU47QUFBYXlGLGFBQU1IO0FBQW5CLEtBQXZCLEVBQW1EO0FBQUE4QyxjQUFPO0FBQUNKLHVCQUFjO0FBQWY7QUFBUCxLQUFuRCxDQUFiO0FBQ0FBLG9CQUFBRSxjQUFBLE9BQWdCQSxXQUFZRixhQUE1QixHQUE0QixNQUE1Qjs7QUFDQSxTQUFPQSxhQUFQO0FBQ0MsYUFBTyxFQUFQO0FDdUZFOztBRHRGSCxRQUFHRCxnQkFBSDtBQUNDRSxnQkFBVUksRUFBRUMsT0FBRixDQUFVNUssR0FBR3NLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUF6RCxhQUFJO0FBQUMwRCxlQUFJUjtBQUFMO0FBQUosT0FBdEIsRUFBK0NTLEtBQS9DLEdBQXVEek0sV0FBdkQsQ0FBbUUsU0FBbkUsQ0FBVixDQUFWO0FBQ0EsYUFBT3FNLEVBQUVLLEtBQUYsQ0FBUVYsYUFBUixFQUFzQkMsT0FBdEIsQ0FBUDtBQUZEO0FBSUMsYUFBT0QsYUFBUDtBQzRGRTtBRHJHMkIsR0FBL0I7QUN1R0E7O0FEMUZELElBQUdoTixPQUFPc08sUUFBVjtBQUNDL0wsWUFBVXNHLFFBQVEsU0FBUixDQUFWOztBQUVBdEksVUFBUTRILFFBQVIsR0FBbUI7QUFDbEIsV0FBTyxLQUFQO0FBRGtCLEdBQW5COztBQUdBNUgsVUFBUW1LLFlBQVIsR0FBdUIsVUFBQ0osT0FBRCxFQUFVdEYsTUFBVjtBQUN0QixRQUFBeUYsS0FBQTs7QUFBQSxRQUFHLENBQUNILE9BQUQsSUFBWSxDQUFDdEYsTUFBaEI7QUFDQyxhQUFPLEtBQVA7QUM2RkU7O0FENUZIeUYsWUFBUS9ILEdBQUdpSSxNQUFILENBQVU3RixPQUFWLENBQWtCd0YsT0FBbEIsQ0FBUjs7QUFDQSxRQUFHLENBQUNHLEtBQUQsSUFBVSxDQUFDQSxNQUFNOEQsTUFBcEI7QUFDQyxhQUFPLEtBQVA7QUM4RkU7O0FEN0ZILFdBQU85RCxNQUFNOEQsTUFBTixDQUFhNUcsT0FBYixDQUFxQjNDLE1BQXJCLEtBQThCLENBQXJDO0FBTnNCLEdBQXZCOztBQVFBekUsVUFBUWlPLGNBQVIsR0FBeUIsVUFBQ2xFLE9BQUQsRUFBU21FLFdBQVQ7QUFDeEIsUUFBQUMsS0FBQSxFQUFBQyxPQUFBLEVBQUE5TCxHQUFBOztBQUFBLFFBQUcsQ0FBQ3lILE9BQUo7QUFDQyxhQUFPLEtBQVA7QUNnR0U7O0FEL0ZIb0UsWUFBUSxLQUFSO0FBQ0FDLGNBQUEsQ0FBQTlMLE1BQUFILEdBQUFpSSxNQUFBLENBQUE3RixPQUFBLENBQUF3RixPQUFBLGFBQUF6SCxJQUFzQzhMLE9BQXRDLEdBQXNDLE1BQXRDOztBQUNBLFFBQUdBLFdBQVlBLFFBQVF6TSxRQUFSLENBQWlCdU0sV0FBakIsQ0FBZjtBQUNDQyxjQUFRLElBQVI7QUNpR0U7O0FEaEdILFdBQU9BLEtBQVA7QUFQd0IsR0FBekI7O0FBVUFuTyxVQUFRcU8sa0JBQVIsR0FBNkIsVUFBQ0MsTUFBRCxFQUFTN0osTUFBVDtBQUM1QixRQUFBOEosZUFBQSxFQUFBQyxVQUFBLEVBQUE5QixPQUFBLEVBQUErQixPQUFBO0FBQUFELGlCQUFhLEtBQWI7QUFDQUMsY0FBVXRNLEdBQUdzSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFDekQsV0FBSztBQUFDMEQsYUFBSXFCO0FBQUw7QUFBTixLQUF0QixFQUEwQztBQUFDekIsY0FBTztBQUFDSCxpQkFBUSxDQUFUO0FBQVdzQixnQkFBTztBQUFsQjtBQUFSLEtBQTFDLEVBQXlFZCxLQUF6RSxFQUFWO0FBQ0FSLGNBQVUsRUFBVjtBQUNBNkIsc0JBQWtCRSxRQUFRQyxNQUFSLENBQWUsVUFBQ0MsR0FBRDtBQUNoQyxVQUFBck0sR0FBQTs7QUFBQSxVQUFHcU0sSUFBSWpDLE9BQVA7QUFDQ0Esa0JBQVVJLEVBQUVLLEtBQUYsQ0FBUVQsT0FBUixFQUFnQmlDLElBQUlqQyxPQUFwQixDQUFWO0FDNEdHOztBRDNHSixjQUFBcEssTUFBQXFNLElBQUFYLE1BQUEsWUFBQTFMLElBQW1CWCxRQUFuQixDQUE0QjhDLE1BQTVCLElBQU8sTUFBUDtBQUhpQixNQUFsQjs7QUFJQSxRQUFHOEosZ0JBQWdCbk4sTUFBbkI7QUFDQ29OLG1CQUFhLElBQWI7QUFERDtBQUdDOUIsZ0JBQVVJLEVBQUVDLE9BQUYsQ0FBVUwsT0FBVixDQUFWO0FBQ0FBLGdCQUFVSSxFQUFFOEIsSUFBRixDQUFPbEMsT0FBUCxDQUFWOztBQUNBLFVBQUdBLFFBQVF0TCxNQUFSLElBQW1CZSxHQUFHc0ssYUFBSCxDQUFpQmxJLE9BQWpCLENBQXlCO0FBQUNnRixhQUFJO0FBQUMwRCxlQUFJUDtBQUFMLFNBQUw7QUFBb0JzQixnQkFBT3ZKO0FBQTNCLE9BQXpCLENBQXRCO0FBQ0MrSixxQkFBYSxJQUFiO0FBTkY7QUMwSEc7O0FEbkhILFdBQU9BLFVBQVA7QUFmNEIsR0FBN0I7O0FBbUJBeE8sVUFBUTZPLHFCQUFSLEdBQWdDLFVBQUNQLE1BQUQsRUFBUzdKLE1BQVQ7QUFDL0IsUUFBQXFLLENBQUEsRUFBQU4sVUFBQTs7QUFBQSxTQUFPRixPQUFPbE4sTUFBZDtBQUNDLGFBQU8sSUFBUDtBQ29IRTs7QURuSEgwTixRQUFJLENBQUo7O0FBQ0EsV0FBTUEsSUFBSVIsT0FBT2xOLE1BQWpCO0FBQ0NvTixtQkFBYXhPLFFBQVFxTyxrQkFBUixDQUEyQixDQUFDQyxPQUFPUSxDQUFQLENBQUQsQ0FBM0IsRUFBd0NySyxNQUF4QyxDQUFiOztBQUNBLFdBQU8rSixVQUFQO0FBQ0M7QUNxSEc7O0FEcEhKTTtBQUpEOztBQUtBLFdBQU9OLFVBQVA7QUFUK0IsR0FBaEM7O0FBV0F4TyxVQUFReUYsV0FBUixHQUFzQixVQUFDTixHQUFEO0FBQ3JCLFFBQUF5RCxDQUFBLEVBQUFtRyxRQUFBOztBQUFBLFFBQUc1SixHQUFIO0FBRUNBLFlBQU1BLElBQUlqQyxPQUFKLENBQVksS0FBWixFQUFrQixFQUFsQixDQUFOO0FDdUhFOztBRHRISCxRQUFJekQsT0FBT29JLFNBQVg7QUFDQyxhQUFPcEksT0FBT2dHLFdBQVAsQ0FBbUJOLEdBQW5CLENBQVA7QUFERDtBQUdDLFVBQUcxRixPQUFPaUUsUUFBVjtBQUNDO0FBQ0NxTCxxQkFBVyxJQUFJQyxHQUFKLENBQVF2UCxPQUFPZ0csV0FBUCxFQUFSLENBQVg7O0FBQ0EsY0FBR04sR0FBSDtBQUNDLG1CQUFPNEosU0FBU0UsUUFBVCxHQUFvQjlKLEdBQTNCO0FBREQ7QUFHQyxtQkFBTzRKLFNBQVNFLFFBQWhCO0FBTEY7QUFBQSxpQkFBQXhGLE1BQUE7QUFNTWIsY0FBQWEsTUFBQTtBQUNMLGlCQUFPaEssT0FBT2dHLFdBQVAsQ0FBbUJOLEdBQW5CLENBQVA7QUFSRjtBQUFBO0FDb0lLLGVEMUhKMUYsT0FBT2dHLFdBQVAsQ0FBbUJOLEdBQW5CLENDMEhJO0FEdklOO0FDeUlHO0FEN0lrQixHQUF0Qjs7QUFvQkFuRixVQUFRa1AsZUFBUixHQUEwQixVQUFDQyxHQUFELEVBQU1DLEdBQU47QUFFekIsUUFBQXJJLFNBQUEsRUFBQXhILE9BQUEsRUFBQThQLFFBQUEsRUFBQS9NLEdBQUEsRUFBQUMsSUFBQSxFQUFBMkMsSUFBQSxFQUFBb0ssSUFBQSxFQUFBQyxNQUFBLEVBQUEvSyxJQUFBLEVBQUFDLE1BQUEsRUFBQStLLFFBQUE7QUFBQUEsZUFBQSxDQUFBbE4sTUFBQTZNLElBQUFNLEtBQUEsWUFBQW5OLElBQXNCa04sUUFBdEIsR0FBc0IsTUFBdEI7QUFFQUgsZUFBQSxDQUFBOU0sT0FBQTRNLElBQUFNLEtBQUEsWUFBQWxOLEtBQXNCOE0sUUFBdEIsR0FBc0IsTUFBdEI7O0FBRUEsUUFBR0csWUFBWUgsUUFBZjtBQUNDN0ssYUFBT3JDLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCO0FBQUNvTCxvQkFBWUg7QUFBYixPQUFqQixDQUFQOztBQUVBLFVBQUcsQ0FBQ2hMLElBQUo7QUFDQyxlQUFPLEtBQVA7QUMySEc7O0FEekhKK0ssZUFBU3JJLFNBQVMwSSxjQUFULENBQXdCcEwsSUFBeEIsRUFBOEI2SyxRQUE5QixDQUFUOztBQUVBLFVBQUdFLE9BQU9oSCxLQUFWO0FBQ0MsY0FBTSxJQUFJc0gsS0FBSixDQUFVTixPQUFPaEgsS0FBakIsQ0FBTjtBQUREO0FBR0MsZUFBTy9ELElBQVA7QUFYRjtBQ3NJRzs7QUR6SEhDLGFBQUEsQ0FBQVMsT0FBQWlLLElBQUFNLEtBQUEsWUFBQXZLLEtBQW9CLFdBQXBCLElBQW9CLE1BQXBCO0FBRUE2QixnQkFBQSxDQUFBdUksT0FBQUgsSUFBQU0sS0FBQSxZQUFBSCxLQUF1QixjQUF2QixJQUF1QixNQUF2Qjs7QUFFQSxRQUFHdFAsUUFBUThQLGNBQVIsQ0FBdUJyTCxNQUF2QixFQUE4QnNDLFNBQTlCLENBQUg7QUFDQyxhQUFPNUUsR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUI7QUFBQ2dGLGFBQUs5RTtBQUFOLE9BQWpCLENBQVA7QUMySEU7O0FEekhIbEYsY0FBVSxJQUFJeUMsT0FBSixDQUFZbU4sR0FBWixFQUFpQkMsR0FBakIsQ0FBVjs7QUFFQSxRQUFHRCxJQUFJWSxPQUFQO0FBQ0N0TCxlQUFTMEssSUFBSVksT0FBSixDQUFZLFdBQVosQ0FBVDtBQUNBaEosa0JBQVlvSSxJQUFJWSxPQUFKLENBQVksY0FBWixDQUFaO0FDMEhFOztBRHZISCxRQUFHLENBQUN0TCxNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDQ3RDLGVBQVNsRixRQUFRaUgsR0FBUixDQUFZLFdBQVosQ0FBVDtBQUNBTyxrQkFBWXhILFFBQVFpSCxHQUFSLENBQVksY0FBWixDQUFaO0FDeUhFOztBRHZISCxRQUFHLENBQUMvQixNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDQyxhQUFPLEtBQVA7QUN5SEU7O0FEdkhILFFBQUcvRyxRQUFROFAsY0FBUixDQUF1QnJMLE1BQXZCLEVBQStCc0MsU0FBL0IsQ0FBSDtBQUNDLGFBQU81RSxHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQjtBQUFDZ0YsYUFBSzlFO0FBQU4sT0FBakIsQ0FBUDtBQzJIRTs7QUR6SEgsV0FBTyxLQUFQO0FBM0N5QixHQUExQjs7QUE4Q0F6RSxVQUFROFAsY0FBUixHQUF5QixVQUFDckwsTUFBRCxFQUFTc0MsU0FBVDtBQUN4QixRQUFBaUosV0FBQSxFQUFBeEwsSUFBQTs7QUFBQSxRQUFHQyxVQUFXc0MsU0FBZDtBQUNDaUosb0JBQWM5SSxTQUFTK0ksZUFBVCxDQUF5QmxKLFNBQXpCLENBQWQ7QUFDQXZDLGFBQU8vRSxPQUFPaVEsS0FBUCxDQUFhbkwsT0FBYixDQUNOO0FBQUFnRixhQUFLOUUsTUFBTDtBQUNBLG1EQUEyQ3VMO0FBRDNDLE9BRE0sQ0FBUDs7QUFHQSxVQUFHeEwsSUFBSDtBQUNDLGVBQU8sSUFBUDtBQUREO0FBR0MsZUFBTyxLQUFQO0FBUkY7QUNxSUc7O0FENUhILFdBQU8sS0FBUDtBQVZ3QixHQUF6QjtBQ3lJQTs7QUQ1SEQsSUFBRy9FLE9BQU9zTyxRQUFWO0FBQ0M5TCxXQUFTcUcsUUFBUSxRQUFSLENBQVQ7O0FBQ0F0SSxVQUFRa1EsT0FBUixHQUFrQixVQUFDYixRQUFELEVBQVczSyxHQUFYLEVBQWdCeUwsRUFBaEI7QUFDakIsUUFBQUMsQ0FBQSxFQUFBQyxRQUFBLEVBQUFDLFdBQUEsRUFBQTFILENBQUEsRUFBQWtHLENBQUEsRUFBQXlCLEtBQUEsRUFBQUMsR0FBQSxFQUFBM1AsQ0FBQTs7QUFBQTtBQUNDMFAsY0FBUSxFQUFSO0FBQ0FDLFlBQU05TCxJQUFJdEQsTUFBVjs7QUFDQSxVQUFHb1AsTUFBTSxFQUFUO0FBQ0NKLFlBQUksRUFBSjtBQUNBdEIsWUFBSSxDQUFKO0FBQ0FqTyxZQUFJLEtBQUsyUCxHQUFUOztBQUNBLGVBQU0xQixJQUFJak8sQ0FBVjtBQUNDdVAsY0FBSSxNQUFNQSxDQUFWO0FBQ0F0QjtBQUZEOztBQUdBeUIsZ0JBQVE3TCxNQUFNMEwsQ0FBZDtBQVBELGFBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELGdCQUFRN0wsSUFBSXZELEtBQUosQ0FBVSxDQUFWLEVBQWEsRUFBYixDQUFSO0FDaUlHOztBRC9ISmtQLGlCQUFXcE8sT0FBT3dPLGdCQUFQLENBQXdCLGFBQXhCLEVBQXVDLElBQUlDLE1BQUosQ0FBV0gsS0FBWCxFQUFrQixNQUFsQixDQUF2QyxFQUFrRSxJQUFJRyxNQUFKLENBQVdQLEVBQVgsRUFBZSxNQUFmLENBQWxFLENBQVg7QUFFQUcsb0JBQWNJLE9BQU9DLE1BQVAsQ0FBYyxDQUFDTixTQUFTTyxNQUFULENBQWdCdkIsUUFBaEIsRUFBMEIsUUFBMUIsQ0FBRCxFQUFzQ2dCLFNBQVNRLEtBQVQsRUFBdEMsQ0FBZCxDQUFkO0FBRUF4QixpQkFBV2lCLFlBQVl4TixRQUFaLEVBQVg7QUFDQSxhQUFPdU0sUUFBUDtBQW5CRCxhQUFBNUYsTUFBQTtBQW9CTWIsVUFBQWEsTUFBQTtBQUNMLGFBQU80RixRQUFQO0FDZ0lFO0FEdEpjLEdBQWxCOztBQXdCQXJQLFVBQVE4USxPQUFSLEdBQWtCLFVBQUN6QixRQUFELEVBQVczSyxHQUFYLEVBQWdCeUwsRUFBaEI7QUFDakIsUUFBQUMsQ0FBQSxFQUFBVyxNQUFBLEVBQUFDLFdBQUEsRUFBQWxDLENBQUEsRUFBQXlCLEtBQUEsRUFBQUMsR0FBQSxFQUFBM1AsQ0FBQTtBQUFBMFAsWUFBUSxFQUFSO0FBQ0FDLFVBQU05TCxJQUFJdEQsTUFBVjs7QUFDQSxRQUFHb1AsTUFBTSxFQUFUO0FBQ0NKLFVBQUksRUFBSjtBQUNBdEIsVUFBSSxDQUFKO0FBQ0FqTyxVQUFJLEtBQUsyUCxHQUFUOztBQUNBLGFBQU0xQixJQUFJak8sQ0FBVjtBQUNDdVAsWUFBSSxNQUFNQSxDQUFWO0FBQ0F0QjtBQUZEOztBQUdBeUIsY0FBUTdMLE1BQU0wTCxDQUFkO0FBUEQsV0FRSyxJQUFHSSxPQUFPLEVBQVY7QUFDSkQsY0FBUTdMLElBQUl2RCxLQUFKLENBQVUsQ0FBVixFQUFhLEVBQWIsQ0FBUjtBQ21JRTs7QURqSUg0UCxhQUFTOU8sT0FBT2dQLGNBQVAsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBSVAsTUFBSixDQUFXSCxLQUFYLEVBQWtCLE1BQWxCLENBQXJDLEVBQWdFLElBQUlHLE1BQUosQ0FBV1AsRUFBWCxFQUFlLE1BQWYsQ0FBaEUsQ0FBVDtBQUVBYSxrQkFBY04sT0FBT0MsTUFBUCxDQUFjLENBQUNJLE9BQU9ILE1BQVAsQ0FBYyxJQUFJRixNQUFKLENBQVdyQixRQUFYLEVBQXFCLE1BQXJCLENBQWQsQ0FBRCxFQUE4QzBCLE9BQU9GLEtBQVAsRUFBOUMsQ0FBZCxDQUFkO0FBRUF4QixlQUFXMkIsWUFBWWxPLFFBQVosQ0FBcUIsUUFBckIsQ0FBWDtBQUVBLFdBQU91TSxRQUFQO0FBcEJpQixHQUFsQjs7QUFzQkFyUCxVQUFRa1Isd0JBQVIsR0FBbUMsVUFBQ0MsWUFBRDtBQUVsQyxRQUFBQyxVQUFBLEVBQUFwQixXQUFBLEVBQUFxQixHQUFBLEVBQUE3TSxJQUFBLEVBQUFDLE1BQUE7O0FBQUEsUUFBRyxDQUFDME0sWUFBSjtBQUNDLGFBQU8sSUFBUDtBQ2dJRTs7QUQ5SEgxTSxhQUFTME0sYUFBYUcsS0FBYixDQUFtQixHQUFuQixFQUF3QixDQUF4QixDQUFUO0FBRUF0QixrQkFBYzlJLFNBQVMrSSxlQUFULENBQXlCa0IsWUFBekIsQ0FBZDtBQUVBM00sV0FBT3JDLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCO0FBQUNnRixXQUFLOUUsTUFBTjtBQUFjLDZCQUF1QnVMO0FBQXJDLEtBQWpCLENBQVA7O0FBRUEsUUFBR3hMLElBQUg7QUFDQyxhQUFPQyxNQUFQO0FBREQ7QUFJQzJNLG1CQUFhRyxhQUFhQyxXQUFiLENBQXlCQyxXQUF0QztBQUVBSixZQUFNRCxXQUFXN00sT0FBWCxDQUFtQjtBQUFDLHVCQUFlNE07QUFBaEIsT0FBbkIsQ0FBTjs7QUFDQSxVQUFHRSxHQUFIO0FBRUMsYUFBQUEsT0FBQSxPQUFHQSxJQUFLSyxPQUFSLEdBQVEsTUFBUixJQUFrQixJQUFJcEgsSUFBSixFQUFsQjtBQUNDLGlCQUFPLHlCQUF1QjZHLFlBQXZCLEdBQW9DLGNBQTNDO0FBREQ7QUFHQyxpQkFBQUUsT0FBQSxPQUFPQSxJQUFLNU0sTUFBWixHQUFZLE1BQVo7QUFMRjtBQUFBO0FBT0MsZUFBTyx5QkFBdUIwTSxZQUF2QixHQUFvQyxnQkFBM0M7QUFkRjtBQytJRzs7QURoSUgsV0FBTyxJQUFQO0FBMUJrQyxHQUFuQzs7QUE0QkFuUixVQUFRMlIsc0JBQVIsR0FBaUMsVUFBQ3hDLEdBQUQsRUFBTUMsR0FBTjtBQUVoQyxRQUFBckksU0FBQSxFQUFBeEgsT0FBQSxFQUFBK0MsR0FBQSxFQUFBQyxJQUFBLEVBQUEyQyxJQUFBLEVBQUFvSyxJQUFBLEVBQUE3SyxNQUFBO0FBQUFBLGFBQUEsQ0FBQW5DLE1BQUE2TSxJQUFBTSxLQUFBLFlBQUFuTixJQUFvQixXQUFwQixJQUFvQixNQUFwQjtBQUVBeUUsZ0JBQUEsQ0FBQXhFLE9BQUE0TSxJQUFBTSxLQUFBLFlBQUFsTixLQUF1QixjQUF2QixJQUF1QixNQUF2Qjs7QUFFQSxRQUFHdkMsUUFBUThQLGNBQVIsQ0FBdUJyTCxNQUF2QixFQUE4QnNDLFNBQTlCLENBQUg7QUFDQyxjQUFBN0IsT0FBQS9DLEdBQUF1TixLQUFBLENBQUFuTCxPQUFBO0FDZ0lLZ0YsYUFBSzlFO0FEaElWLGFDaUlVLElEaklWLEdDaUlpQlMsS0RqSXVCcUUsR0FBeEMsR0FBd0MsTUFBeEM7QUNrSUU7O0FEaElIaEssY0FBVSxJQUFJeUMsT0FBSixDQUFZbU4sR0FBWixFQUFpQkMsR0FBakIsQ0FBVjs7QUFFQSxRQUFHRCxJQUFJWSxPQUFQO0FBQ0N0TCxlQUFTMEssSUFBSVksT0FBSixDQUFZLFdBQVosQ0FBVDtBQUNBaEosa0JBQVlvSSxJQUFJWSxPQUFKLENBQVksY0FBWixDQUFaO0FDaUlFOztBRDlISCxRQUFHLENBQUN0TCxNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDQ3RDLGVBQVNsRixRQUFRaUgsR0FBUixDQUFZLFdBQVosQ0FBVDtBQUNBTyxrQkFBWXhILFFBQVFpSCxHQUFSLENBQVksY0FBWixDQUFaO0FDZ0lFOztBRDlISCxRQUFHLENBQUMvQixNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDQyxhQUFPLElBQVA7QUNnSUU7O0FEOUhILFFBQUcvRyxRQUFROFAsY0FBUixDQUF1QnJMLE1BQXZCLEVBQStCc0MsU0FBL0IsQ0FBSDtBQUNDLGNBQUF1SSxPQUFBbk4sR0FBQXVOLEtBQUEsQ0FBQW5MLE9BQUE7QUNnSUtnRixhQUFLOUU7QURoSVYsYUNpSVUsSURqSVYsR0NpSWlCNkssS0RqSXVCL0YsR0FBeEMsR0FBd0MsTUFBeEM7QUNrSUU7QUQxSjZCLEdBQWpDOztBQTBCQXZKLFVBQVE0UixzQkFBUixHQUFpQyxVQUFDekMsR0FBRCxFQUFNQyxHQUFOO0FBQ2hDLFFBQUF4RyxDQUFBLEVBQUFwRSxJQUFBLEVBQUFDLE1BQUE7O0FBQUE7QUFDQ0EsZUFBUzBLLElBQUkxSyxNQUFiO0FBRUFELGFBQU9yQyxHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQjtBQUFDZ0YsYUFBSzlFO0FBQU4sT0FBakIsQ0FBUDs7QUFFQSxVQUFHLENBQUNBLE1BQUQsSUFBVyxDQUFDRCxJQUFmO0FBQ0NxTixtQkFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTJDLGdCQUNDO0FBQUEscUJBQVM7QUFBVCxXQUREO0FBRUFDLGdCQUFNO0FBRk4sU0FERDtBQUlBLGVBQU8sS0FBUDtBQUxEO0FBT0MsZUFBTyxJQUFQO0FBWkY7QUFBQSxhQUFBdkksTUFBQTtBQWFNYixVQUFBYSxNQUFBOztBQUNMLFVBQUcsQ0FBQ2hGLE1BQUQsSUFBVyxDQUFDRCxJQUFmO0FBQ0NxTixtQkFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTRDLGdCQUFNLEdBQU47QUFDQUQsZ0JBQ0M7QUFBQSxxQkFBU25KLEVBQUVlLE9BQVg7QUFDQSx1QkFBVztBQURYO0FBRkQsU0FERDtBQUtBLGVBQU8sS0FBUDtBQXBCRjtBQytKRztBRGhLNkIsR0FBakM7QUNrS0E7O0FEcklEekgsUUFBUSxVQUFDbVAsR0FBRDtBQ3dJTixTRHZJRHZFLEVBQUVwQyxJQUFGLENBQU9vQyxFQUFFbUYsU0FBRixDQUFZWixHQUFaLENBQVAsRUFBeUIsVUFBQzlRLElBQUQ7QUFDeEIsUUFBQTJSLElBQUE7O0FBQUEsUUFBRyxDQUFJcEYsRUFBRXZNLElBQUYsQ0FBSixJQUFvQnVNLEVBQUFqTixTQUFBLENBQUFVLElBQUEsU0FBdkI7QUFDQzJSLGFBQU9wRixFQUFFdk0sSUFBRixJQUFVOFEsSUFBSTlRLElBQUosQ0FBakI7QUN5SUcsYUR4SUh1TSxFQUFFak4sU0FBRixDQUFZVSxJQUFaLElBQW9CO0FBQ25CLFlBQUE0UixJQUFBO0FBQUFBLGVBQU8sQ0FBQyxLQUFLQyxRQUFOLENBQVA7QUFDQXRSLGFBQUtPLEtBQUwsQ0FBVzhRLElBQVgsRUFBaUJFLFNBQWpCO0FBQ0EsZUFBTzlDLE9BQU8rQyxJQUFQLENBQVksSUFBWixFQUFrQkosS0FBSzdRLEtBQUwsQ0FBV3lMLENBQVgsRUFBY3FGLElBQWQsQ0FBbEIsQ0FBUDtBQUhtQixPQ3dJakI7QUFNRDtBRGpKSixJQ3VJQztBRHhJTSxDQUFSOztBQVdBLElBQUcxUyxPQUFPc08sUUFBVjtBQUVDL04sVUFBUXVTLFNBQVIsR0FBb0IsVUFBQ0MsSUFBRDtBQUNuQixRQUFBQyxHQUFBOztBQUFBLFFBQUcsQ0FBQ0QsSUFBSjtBQUNDQSxhQUFPLElBQUlsSSxJQUFKLEVBQVA7QUM0SUU7O0FEM0lINkQsVUFBTXFFLElBQU4sRUFBWWxJLElBQVo7QUFDQW1JLFVBQU1ELEtBQUtFLE1BQUwsRUFBTjs7QUFFQSxRQUFHRCxRQUFPLENBQVAsSUFBWUEsUUFBTyxDQUF0QjtBQUNDLGFBQU8sSUFBUDtBQzRJRTs7QUQxSUgsV0FBTyxLQUFQO0FBVG1CLEdBQXBCOztBQVdBelMsVUFBUTJTLG1CQUFSLEdBQThCLFVBQUNILElBQUQsRUFBT0ksSUFBUDtBQUM3QixRQUFBQyxZQUFBLEVBQUFDLFVBQUE7QUFBQTNFLFVBQU1xRSxJQUFOLEVBQVlsSSxJQUFaO0FBQ0E2RCxVQUFNeUUsSUFBTixFQUFZN1AsTUFBWjtBQUNBK1AsaUJBQWEsSUFBSXhJLElBQUosQ0FBU2tJLElBQVQsQ0FBYjs7QUFDQUssbUJBQWUsVUFBQy9ELENBQUQsRUFBSThELElBQUo7QUFDZCxVQUFHOUQsSUFBSThELElBQVA7QUFDQ0UscUJBQWEsSUFBSXhJLElBQUosQ0FBU3dJLFdBQVdDLE9BQVgsS0FBdUIsS0FBRyxFQUFILEdBQU0sRUFBTixHQUFTLElBQXpDLENBQWI7O0FBQ0EsWUFBRyxDQUFDL1MsUUFBUXVTLFNBQVIsQ0FBa0JPLFVBQWxCLENBQUo7QUFDQ2hFO0FDNklJOztBRDVJTCtELHFCQUFhL0QsQ0FBYixFQUFnQjhELElBQWhCO0FDOElHO0FEbkpVLEtBQWY7O0FBT0FDLGlCQUFhLENBQWIsRUFBZ0JELElBQWhCO0FBQ0EsV0FBT0UsVUFBUDtBQVo2QixHQUE5Qjs7QUFnQkE5UyxVQUFRZ1QsMEJBQVIsR0FBcUMsVUFBQ1IsSUFBRCxFQUFPUyxJQUFQO0FBQ3BDLFFBQUFDLGNBQUEsRUFBQWxKLFFBQUEsRUFBQW1KLFVBQUEsRUFBQXJFLENBQUEsRUFBQXNFLENBQUEsRUFBQTVDLEdBQUEsRUFBQTZDLFNBQUEsRUFBQS9RLEdBQUEsRUFBQWdSLFdBQUEsRUFBQUMsVUFBQSxFQUFBQyxXQUFBO0FBQUFyRixVQUFNcUUsSUFBTixFQUFZbEksSUFBWjtBQUNBa0osa0JBQUEsQ0FBQWxSLE1BQUE3QyxPQUFBQyxRQUFBLENBQUErVCxNQUFBLFlBQUFuUixJQUFzQ2tSLFdBQXRDLEdBQXNDLE1BQXRDOztBQUNBLFFBQUcsQ0FBSUEsV0FBSixJQUFtQjFHLEVBQUU0RyxPQUFGLENBQVVGLFdBQVYsQ0FBdEI7QUFDQzlKLGNBQVFuQixLQUFSLENBQWMscUJBQWQ7QUFDQWlMLG9CQUFjLENBQUM7QUFBQyxnQkFBUSxDQUFUO0FBQVksa0JBQVU7QUFBdEIsT0FBRCxFQUE2QjtBQUFDLGdCQUFRLEVBQVQ7QUFBYSxrQkFBVTtBQUF2QixPQUE3QixDQUFkO0FDc0pFOztBRHBKSGhELFVBQU1nRCxZQUFZcFMsTUFBbEI7QUFDQW1TLGlCQUFhLElBQUlqSixJQUFKLENBQVNrSSxJQUFULENBQWI7QUFDQXhJLGVBQVcsSUFBSU0sSUFBSixDQUFTa0ksSUFBVCxDQUFYO0FBQ0FlLGVBQVdJLFFBQVgsQ0FBb0JILFlBQVksQ0FBWixFQUFlSSxJQUFuQztBQUNBTCxlQUFXTSxVQUFYLENBQXNCTCxZQUFZLENBQVosRUFBZU0sTUFBckM7QUFDQTlKLGFBQVMySixRQUFULENBQWtCSCxZQUFZaEQsTUFBTSxDQUFsQixFQUFxQm9ELElBQXZDO0FBQ0E1SixhQUFTNkosVUFBVCxDQUFvQkwsWUFBWWhELE1BQU0sQ0FBbEIsRUFBcUJzRCxNQUF6QztBQUVBWixxQkFBaUIsSUFBSTVJLElBQUosQ0FBU2tJLElBQVQsQ0FBakI7QUFFQVksUUFBSSxDQUFKO0FBQ0FDLGdCQUFZN0MsTUFBTSxDQUFsQjs7QUFDQSxRQUFHZ0MsT0FBT2UsVUFBVjtBQUNDLFVBQUdOLElBQUg7QUFDQ0csWUFBSSxDQUFKO0FBREQ7QUFJQ0EsWUFBSTVDLE1BQUksQ0FBUjtBQUxGO0FBQUEsV0FNSyxJQUFHZ0MsUUFBUWUsVUFBUixJQUF1QmYsT0FBT3hJLFFBQWpDO0FBQ0o4RSxVQUFJLENBQUo7O0FBQ0EsYUFBTUEsSUFBSXVFLFNBQVY7QUFDQ0YscUJBQWEsSUFBSTdJLElBQUosQ0FBU2tJLElBQVQsQ0FBYjtBQUNBYyxzQkFBYyxJQUFJaEosSUFBSixDQUFTa0ksSUFBVCxDQUFkO0FBQ0FXLG1CQUFXUSxRQUFYLENBQW9CSCxZQUFZMUUsQ0FBWixFQUFlOEUsSUFBbkM7QUFDQVQsbUJBQVdVLFVBQVgsQ0FBc0JMLFlBQVkxRSxDQUFaLEVBQWVnRixNQUFyQztBQUNBUixvQkFBWUssUUFBWixDQUFxQkgsWUFBWTFFLElBQUksQ0FBaEIsRUFBbUI4RSxJQUF4QztBQUNBTixvQkFBWU8sVUFBWixDQUF1QkwsWUFBWTFFLElBQUksQ0FBaEIsRUFBbUJnRixNQUExQzs7QUFFQSxZQUFHdEIsUUFBUVcsVUFBUixJQUF1QlgsT0FBT2MsV0FBakM7QUFDQztBQ21KSTs7QURqSkx4RTtBQVhEOztBQWFBLFVBQUdtRSxJQUFIO0FBQ0NHLFlBQUl0RSxJQUFJLENBQVI7QUFERDtBQUdDc0UsWUFBSXRFLElBQUkwQixNQUFJLENBQVo7QUFsQkc7QUFBQSxXQW9CQSxJQUFHZ0MsUUFBUXhJLFFBQVg7QUFDSixVQUFHaUosSUFBSDtBQUNDRyxZQUFJQyxZQUFZLENBQWhCO0FBREQ7QUFHQ0QsWUFBSUMsWUFBWTdDLE1BQUksQ0FBcEI7QUFKRztBQ3dKRjs7QURsSkgsUUFBRzRDLElBQUlDLFNBQVA7QUFFQ0gsdUJBQWlCbFQsUUFBUTJTLG1CQUFSLENBQTRCSCxJQUE1QixFQUFrQyxDQUFsQyxDQUFqQjtBQUNBVSxxQkFBZVMsUUFBZixDQUF3QkgsWUFBWUosSUFBSUMsU0FBSixHQUFnQixDQUE1QixFQUErQk8sSUFBdkQ7QUFDQVYscUJBQWVXLFVBQWYsQ0FBMEJMLFlBQVlKLElBQUlDLFNBQUosR0FBZ0IsQ0FBNUIsRUFBK0JTLE1BQXpEO0FBSkQsV0FLSyxJQUFHVixLQUFLQyxTQUFSO0FBQ0pILHFCQUFlUyxRQUFmLENBQXdCSCxZQUFZSixDQUFaLEVBQWVRLElBQXZDO0FBQ0FWLHFCQUFlVyxVQUFmLENBQTBCTCxZQUFZSixDQUFaLEVBQWVVLE1BQXpDO0FDbUpFOztBRGpKSCxXQUFPWixjQUFQO0FBNURvQyxHQUFyQztBQ2dOQTs7QURsSkQsSUFBR3pULE9BQU9zTyxRQUFWO0FBQ0NqQixJQUFFaUgsTUFBRixDQUFTL1QsT0FBVCxFQUNDO0FBQUFnVSxxQkFBaUIsVUFBQ0MsS0FBRCxFQUFReFAsTUFBUixFQUFnQnNDLFNBQWhCO0FBQ2hCLFVBQUFVLEdBQUEsRUFBQTJJLENBQUEsRUFBQVcsTUFBQSxFQUFBQyxXQUFBLEVBQUFoQixXQUFBLEVBQUFsQixDQUFBLEVBQUFxQixFQUFBLEVBQUFJLEtBQUEsRUFBQUMsR0FBQSxFQUFBM1AsQ0FBQSxFQUFBcVQsR0FBQSxFQUFBQyxNQUFBLEVBQUF4RSxVQUFBLEVBQUF5RSxhQUFBLEVBQUE1UCxJQUFBO0FBQUF2QyxlQUFTcUcsUUFBUSxRQUFSLENBQVQ7QUFDQWIsWUFBTXRGLEdBQUd1RixJQUFILENBQVFuRCxPQUFSLENBQWdCMFAsS0FBaEIsQ0FBTjs7QUFDQSxVQUFHeE0sR0FBSDtBQUNDME0saUJBQVMxTSxJQUFJME0sTUFBYjtBQ3NKRzs7QURwSkosVUFBRzFQLFVBQVdzQyxTQUFkO0FBQ0NpSixzQkFBYzlJLFNBQVMrSSxlQUFULENBQXlCbEosU0FBekIsQ0FBZDtBQUNBdkMsZUFBTy9FLE9BQU9pUSxLQUFQLENBQWFuTCxPQUFiLENBQ047QUFBQWdGLGVBQUs5RSxNQUFMO0FBQ0EscURBQTJDdUw7QUFEM0MsU0FETSxDQUFQOztBQUdBLFlBQUd4TCxJQUFIO0FBQ0NtTCx1QkFBYW5MLEtBQUttTCxVQUFsQjs7QUFDQSxjQUFHbEksSUFBSTBNLE1BQVA7QUFDQ2hFLGlCQUFLMUksSUFBSTBNLE1BQVQ7QUFERDtBQUdDaEUsaUJBQUssa0JBQUw7QUN1Sks7O0FEdEpOK0QsZ0JBQU1HLFNBQVMsSUFBSS9KLElBQUosR0FBV3lJLE9BQVgsS0FBcUIsSUFBOUIsRUFBb0NqUSxRQUFwQyxFQUFOO0FBQ0F5TixrQkFBUSxFQUFSO0FBQ0FDLGdCQUFNYixXQUFXdk8sTUFBakI7O0FBQ0EsY0FBR29QLE1BQU0sRUFBVDtBQUNDSixnQkFBSSxFQUFKO0FBQ0F0QixnQkFBSSxDQUFKO0FBQ0FqTyxnQkFBSSxLQUFLMlAsR0FBVDs7QUFDQSxtQkFBTTFCLElBQUlqTyxDQUFWO0FBQ0N1UCxrQkFBSSxNQUFNQSxDQUFWO0FBQ0F0QjtBQUZEOztBQUdBeUIsb0JBQVFaLGFBQWFTLENBQXJCO0FBUEQsaUJBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELG9CQUFRWixXQUFXeE8sS0FBWCxDQUFpQixDQUFqQixFQUFtQixFQUFuQixDQUFSO0FDeUpLOztBRHZKTjRQLG1CQUFTOU8sT0FBT2dQLGNBQVAsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBSVAsTUFBSixDQUFXSCxLQUFYLEVBQWtCLE1BQWxCLENBQXJDLEVBQWdFLElBQUlHLE1BQUosQ0FBV1AsRUFBWCxFQUFlLE1BQWYsQ0FBaEUsQ0FBVDtBQUVBYSx3QkFBY04sT0FBT0MsTUFBUCxDQUFjLENBQUNJLE9BQU9ILE1BQVAsQ0FBYyxJQUFJRixNQUFKLENBQVd3RCxHQUFYLEVBQWdCLE1BQWhCLENBQWQsQ0FBRCxFQUF5Q25ELE9BQU9GLEtBQVAsRUFBekMsQ0FBZCxDQUFkO0FBRUF1RCwwQkFBZ0JwRCxZQUFZbE8sUUFBWixDQUFxQixRQUFyQixDQUFoQjtBQTdCRjtBQ3FMSTs7QUR0SkosYUFBT3NSLGFBQVA7QUFyQ0Q7QUF1Q0FyVSxZQUFRLFVBQUMwRSxNQUFELEVBQVM2UCxNQUFUO0FBQ1AsVUFBQXZVLE1BQUEsRUFBQXlFLElBQUE7QUFBQUEsYUFBT3JDLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCO0FBQUNnRixhQUFJOUU7QUFBTCxPQUFqQixFQUE4QjtBQUFDb0ksZ0JBQVE7QUFBQzlNLGtCQUFRO0FBQVQ7QUFBVCxPQUE5QixDQUFQO0FBQ0FBLGVBQUF5RSxRQUFBLE9BQVNBLEtBQU16RSxNQUFmLEdBQWUsTUFBZjs7QUFDQSxVQUFHdVUsTUFBSDtBQUNDLFlBQUd2VSxXQUFVLE9BQWI7QUFDQ0EsbUJBQVMsSUFBVDtBQytKSTs7QUQ5SkwsWUFBR0EsV0FBVSxPQUFiO0FBQ0NBLG1CQUFTLE9BQVQ7QUFKRjtBQ3FLSTs7QURoS0osYUFBT0EsTUFBUDtBQS9DRDtBQWlEQXdVLCtCQUEyQixVQUFDL0UsUUFBRDtBQUMxQixhQUFPLENBQUkvUCxPQUFPaVEsS0FBUCxDQUFhbkwsT0FBYixDQUFxQjtBQUFFaUwsa0JBQVU7QUFBRWdGLGtCQUFTLElBQUluUixNQUFKLENBQVcsTUFBTTVELE9BQU9nVixhQUFQLENBQXFCakYsUUFBckIsRUFBK0JrRixJQUEvQixFQUFOLEdBQThDLEdBQXpELEVBQThELEdBQTlEO0FBQVg7QUFBWixPQUFyQixDQUFYO0FBbEREO0FBcURBQyxzQkFBa0IsVUFBQ0MsR0FBRDtBQUNqQixVQUFBQyxhQUFBLEVBQUFDLGtCQUFBLEVBQUFDLE1BQUEsRUFBQXpTLEdBQUEsRUFBQUMsSUFBQSxFQUFBMkMsSUFBQSxFQUFBb0ssSUFBQSxFQUFBMEYsS0FBQTtBQUFBRCxlQUFTblUsRUFBRSxrQkFBRixDQUFUO0FBQ0FvVSxjQUFRLElBQVI7O0FBQ0EsV0FBT0osR0FBUDtBQUNDSSxnQkFBUSxLQUFSO0FDc0tHOztBRHBLSkgsc0JBQUEsQ0FBQXZTLE1BQUE3QyxPQUFBQyxRQUFBLHVCQUFBNkMsT0FBQUQsSUFBQStNLFFBQUEsWUFBQTlNLEtBQWtEMFMsTUFBbEQsR0FBa0QsTUFBbEQsR0FBa0QsTUFBbEQ7QUFDQUgsMkJBQUEsQ0FBQTVQLE9BQUF6RixPQUFBQyxRQUFBLHVCQUFBNFAsT0FBQXBLLEtBQUFtSyxRQUFBLFlBQUFDLEtBQXVENEYsV0FBdkQsR0FBdUQsTUFBdkQsR0FBdUQsTUFBdkQ7O0FBQ0EsVUFBR0wsYUFBSDtBQUNDLFlBQUcsQ0FBRSxJQUFJeFIsTUFBSixDQUFXd1IsYUFBWCxDQUFELENBQTRCdlIsSUFBNUIsQ0FBaUNzUixPQUFPLEVBQXhDLENBQUo7QUFDQ0csbUJBQVNELGtCQUFUO0FBQ0FFLGtCQUFRLEtBQVI7QUFGRDtBQUlDQSxrQkFBUSxJQUFSO0FBTEY7QUM0S0k7O0FEL0pKLFVBQUdBLEtBQUg7QUFDQyxlQUFPLElBQVA7QUFERDtBQUdDLGVBQU87QUFBQXpNLGlCQUNOO0FBQUF3TSxvQkFBUUE7QUFBUjtBQURNLFNBQVA7QUNxS0c7QURsUEw7QUFBQSxHQUREO0FDc1BBOztBRHJLRC9VLFFBQVFtVix1QkFBUixHQUFrQyxVQUFDL1IsR0FBRDtBQUNqQyxTQUFPQSxJQUFJRixPQUFKLENBQVksbUNBQVosRUFBaUQsTUFBakQsQ0FBUDtBQURpQyxDQUFsQzs7QUFHQWxELFFBQVFvVixzQkFBUixHQUFpQyxVQUFDaFMsR0FBRDtBQUNoQyxTQUFPQSxJQUFJRixPQUFKLENBQVksaUVBQVosRUFBK0UsRUFBL0UsQ0FBUDtBQURnQyxDQUFqQzs7QUFHQW1TLFFBQVFDLFNBQVIsR0FBb0IsVUFBQ0MsUUFBRDtBQUNuQixNQUFBQyxNQUFBO0FBQUFBLFdBQVMsRUFBVDtBQUNBSCxVQUFRSSxXQUFSLENBQW9CLE1BQXBCLEVBQTRCekksSUFBNUIsQ0FBaUM7QUFBQzlDLFdBQU9xTCxRQUFSO0FBQWlCRyxnQkFBVyxJQUE1QjtBQUFpQ0MsYUFBUTtBQUF6QyxHQUFqQyxFQUFpRjtBQUNoRjlJLFlBQVE7QUFDUCtJLGVBQVMsQ0FERjtBQUVQQyxrQkFBWSxDQUZMO0FBR1BDLGdCQUFVLENBSEg7QUFJUEMsbUJBQWE7QUFKTjtBQUR3RSxHQUFqRixFQU9HcFYsT0FQSCxDQU9XLFVBQUM4RyxHQUFEO0FDK0tSLFdEOUtGK04sT0FBTy9OLElBQUk4QixHQUFYLElBQWtCOUIsR0M4S2hCO0FEdExIO0FBVUEsU0FBTytOLE1BQVA7QUFabUIsQ0FBcEI7O0FBY0FILFFBQVFXLGVBQVIsR0FBMEIsVUFBQ1QsUUFBRDtBQUN6QixNQUFBVSxZQUFBO0FBQUFBLGlCQUFlLEVBQWY7QUFDQVosVUFBUUksV0FBUixDQUFvQixXQUFwQixFQUFpQ3pJLElBQWpDLENBQXNDO0FBQUM5QyxXQUFPcUw7QUFBUixHQUF0QyxFQUF5RDtBQUN4RDFJLFlBQVE7QUFDUCtJLGVBQVMsQ0FERjtBQUVQQyxrQkFBWSxDQUZMO0FBR1BDLGdCQUFVLENBSEg7QUFJUEMsbUJBQWE7QUFKTjtBQURnRCxHQUF6RCxFQU9HcFYsT0FQSCxDQU9XLFVBQUN1VixTQUFEO0FDbUxSLFdEbExGRCxhQUFhQyxVQUFVM00sR0FBdkIsSUFBOEIyTSxTQ2tMNUI7QUQxTEg7QUFVQSxTQUFPRCxZQUFQO0FBWnlCLENBQTFCOztBQWNBLElBQUd4VyxPQUFPc08sUUFBVjtBQUNDL0wsWUFBVXNHLFFBQVEsU0FBUixDQUFWOztBQUNBdEksVUFBUW1XLFlBQVIsR0FBdUIsVUFBQ2hILEdBQUQsRUFBTUMsR0FBTjtBQUN0QixRQUFBckksU0FBQSxFQUFBeEgsT0FBQTtBQUFBQSxjQUFVLElBQUl5QyxPQUFKLENBQVltTixHQUFaLEVBQWlCQyxHQUFqQixDQUFWO0FBQ0FySSxnQkFBWW9JLElBQUlZLE9BQUosQ0FBWSxjQUFaLEtBQStCeFEsUUFBUWlILEdBQVIsQ0FBWSxjQUFaLENBQTNDOztBQUNBLFFBQUcsQ0FBQ08sU0FBRCxJQUFjb0ksSUFBSVksT0FBSixDQUFZcUcsYUFBMUIsSUFBMkNqSCxJQUFJWSxPQUFKLENBQVlxRyxhQUFaLENBQTBCOUUsS0FBMUIsQ0FBZ0MsR0FBaEMsRUFBcUMsQ0FBckMsTUFBMkMsUUFBekY7QUFDQ3ZLLGtCQUFZb0ksSUFBSVksT0FBSixDQUFZcUcsYUFBWixDQUEwQjlFLEtBQTFCLENBQWdDLEdBQWhDLEVBQXFDLENBQXJDLENBQVo7QUNxTEU7O0FEcExILFdBQU92SyxTQUFQO0FBTHNCLEdBQXZCO0FDNExBOztBRHJMRCxJQUFHdEgsT0FBT2lFLFFBQVY7QUFDQ2pFLFNBQU80VyxPQUFQLENBQWU7QUFDZCxRQUFHOVAsUUFBUUMsR0FBUixDQUFZLGdCQUFaLENBQUg7QUN3TEksYUR2TEg4UCxlQUFlM1EsT0FBZixDQUF1QixnQkFBdkIsRUFBeUNZLFFBQVFDLEdBQVIsQ0FBWSxnQkFBWixDQUF6QyxDQ3VMRztBQUNEO0FEMUxKOztBQU1BeEcsVUFBUXVXLGVBQVIsR0FBMEI7QUFDekIsUUFBR2hRLFFBQVFDLEdBQVIsQ0FBWSxRQUFaLENBQUg7QUFDQyxhQUFPRCxRQUFRQyxHQUFSLENBQVksUUFBWixDQUFQO0FBREQ7QUFHQyxhQUFPOFAsZUFBZWhSLE9BQWYsQ0FBdUIsZ0JBQXZCLENBQVA7QUN1TEU7QUQzTHNCLEdBQTFCO0FDNkxBLEM7Ozs7Ozs7Ozs7O0FDOWpDRDdGLE1BQU0sQ0FBQytXLE9BQVAsQ0FBZSxZQUFZO0FBQzFCQyxjQUFZLENBQUNDLGFBQWIsQ0FBMkI7QUFBQ0MsZUFBVyxFQUFFQyxLQUFLLENBQUNDLFFBQU4sQ0FBZUMsT0FBZixDQUFkO0FBQXVDQyxjQUFVLEVBQUVILEtBQUssQ0FBQ0MsUUFBTixDQUFlalYsTUFBZjtBQUFuRCxHQUEzQjtBQUNBLENBRkQsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBR25DLE9BQU9zTyxRQUFWO0FBQ1F0TyxTQUFPdVgsT0FBUCxDQUNRO0FBQUFDLHlCQUFxQjtBQUNiLFVBQU8sS0FBQXhTLE1BQUEsUUFBUDtBQUNRO0FDQ3pCOztBQUNELGFEQWtCdEMsR0FBR3VOLEtBQUgsQ0FBU2tCLE1BQVQsQ0FBZ0I7QUFBQ3JILGFBQUssS0FBQzlFO0FBQVAsT0FBaEIsRUFBZ0M7QUFBQ3lTLGNBQU07QUFBQ0Msc0JBQVksSUFBSTdNLElBQUo7QUFBYjtBQUFQLE9BQWhDLENDQWxCO0FESlU7QUFBQSxHQURSO0FDY1A7O0FETkQsSUFBRzdLLE9BQU9pRSxRQUFWO0FBQ1F3RCxXQUFTa1EsT0FBVCxDQUFpQjtBQ1NyQixXRFJRM1gsT0FBTzZTLElBQVAsQ0FBWSxxQkFBWixDQ1FSO0FEVEk7QUNXUCxDOzs7Ozs7Ozs7Ozs7QUNyQkQsSUFBRzdTLE9BQU9zTyxRQUFWO0FBQ0V0TyxTQUFPdVgsT0FBUCxDQUNFO0FBQUFLLHFCQUFpQixVQUFDQyxLQUFEO0FBQ2YsVUFBQTlTLElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUM4RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDS0Q7O0FESkQsVUFBRyxDQUFJMk4sS0FBUDtBQUNFLGVBQU87QUFBQy9PLGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUNTRDs7QURSRCxVQUFHLENBQUksMkZBQTJGckcsSUFBM0YsQ0FBZ0dnVSxLQUFoRyxDQUFQO0FBQ0UsZUFBTztBQUFDL08saUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ2FEOztBRFpELFVBQUd4SCxHQUFHdU4sS0FBSCxDQUFTMUMsSUFBVCxDQUFjO0FBQUMsMEJBQWtCc0s7QUFBbkIsT0FBZCxFQUF5Q0MsS0FBekMsS0FBaUQsQ0FBcEQ7QUFDRSxlQUFPO0FBQUNoUCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDbUJEOztBRGpCRG5GLGFBQU9yQyxHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQjtBQUFBZ0YsYUFBSyxLQUFLOUU7QUFBVixPQUFqQixDQUFQOztBQUNBLFVBQUdELEtBQUFnVCxNQUFBLFlBQWlCaFQsS0FBS2dULE1BQUwsQ0FBWXBXLE1BQVosR0FBcUIsQ0FBekM7QUFDRWUsV0FBR3VOLEtBQUgsQ0FBUytILE1BQVQsQ0FBZ0I3RyxNQUFoQixDQUF1QjtBQUFDckgsZUFBSyxLQUFLOUU7QUFBWCxTQUF2QixFQUNFO0FBQUFpVCxpQkFDRTtBQUFBRixvQkFDRTtBQUFBRyx1QkFBU0wsS0FBVDtBQUNBTSx3QkFBVTtBQURWO0FBREY7QUFERixTQURGO0FBREY7QUFPRXpWLFdBQUd1TixLQUFILENBQVMrSCxNQUFULENBQWdCN0csTUFBaEIsQ0FBdUI7QUFBQ3JILGVBQUssS0FBSzlFO0FBQVgsU0FBdkIsRUFDRTtBQUFBeVMsZ0JBQ0U7QUFBQXZILHdCQUFZMkgsS0FBWjtBQUNBRSxvQkFBUSxDQUNOO0FBQUFHLHVCQUFTTCxLQUFUO0FBQ0FNLHdCQUFVO0FBRFYsYUFETTtBQURSO0FBREYsU0FERjtBQ3NDRDs7QUQ5QkQxUSxlQUFTMlEscUJBQVQsQ0FBK0IsS0FBS3BULE1BQXBDLEVBQTRDNlMsS0FBNUM7QUFFQSxhQUFPLEVBQVA7QUE1QkY7QUE4QkFRLHdCQUFvQixVQUFDUixLQUFEO0FBQ2xCLFVBQUFTLENBQUEsRUFBQXZULElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUM4RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDbUNEOztBRGxDRCxVQUFHLENBQUkyTixLQUFQO0FBQ0UsZUFBTztBQUFDL08saUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ3VDRDs7QURyQ0RuRixhQUFPckMsR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUI7QUFBQWdGLGFBQUssS0FBSzlFO0FBQVYsT0FBakIsQ0FBUDs7QUFDQSxVQUFHRCxLQUFBZ1QsTUFBQSxZQUFpQmhULEtBQUtnVCxNQUFMLENBQVlwVyxNQUFaLElBQXNCLENBQTFDO0FBQ0UyVyxZQUFJLElBQUo7QUFDQXZULGFBQUtnVCxNQUFMLENBQVk3VyxPQUFaLENBQW9CLFVBQUNpSSxDQUFEO0FBQ2xCLGNBQUdBLEVBQUUrTyxPQUFGLEtBQWFMLEtBQWhCO0FBQ0VTLGdCQUFJblAsQ0FBSjtBQ3lDRDtBRDNDSDtBQUtBekcsV0FBR3VOLEtBQUgsQ0FBUytILE1BQVQsQ0FBZ0I3RyxNQUFoQixDQUF1QjtBQUFDckgsZUFBSyxLQUFLOUU7QUFBWCxTQUF2QixFQUNFO0FBQUF1VCxpQkFDRTtBQUFBUixvQkFDRU87QUFERjtBQURGLFNBREY7QUFQRjtBQVlFLGVBQU87QUFBQ3hQLGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUMrQ0Q7O0FEN0NELGFBQU8sRUFBUDtBQW5ERjtBQXFEQXNPLHdCQUFvQixVQUFDWCxLQUFEO0FBQ2xCLFVBQU8sS0FBQTdTLE1BQUEsUUFBUDtBQUNFLGVBQU87QUFBQzhELGlCQUFPLElBQVI7QUFBY29CLG1CQUFTO0FBQXZCLFNBQVA7QUNrREQ7O0FEakRELFVBQUcsQ0FBSTJOLEtBQVA7QUFDRSxlQUFPO0FBQUMvTyxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDc0REOztBRHJERCxVQUFHLENBQUksMkZBQTJGckcsSUFBM0YsQ0FBZ0dnVSxLQUFoRyxDQUFQO0FBQ0UsZUFBTztBQUFDL08saUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQzBERDs7QUR2RER6QyxlQUFTMlEscUJBQVQsQ0FBK0IsS0FBS3BULE1BQXBDLEVBQTRDNlMsS0FBNUM7QUFFQSxhQUFPLEVBQVA7QUFoRUY7QUFrRUFZLDZCQUF5QixVQUFDWixLQUFEO0FBQ3ZCLFVBQUFFLE1BQUEsRUFBQWhULElBQUE7O0FBQUEsVUFBTyxLQUFBQyxNQUFBLFFBQVA7QUFDRSxlQUFPO0FBQUM4RCxpQkFBTyxJQUFSO0FBQWNvQixtQkFBUztBQUF2QixTQUFQO0FDNEREOztBRDNERCxVQUFHLENBQUkyTixLQUFQO0FBQ0UsZUFBTztBQUFDL08saUJBQU8sSUFBUjtBQUFjb0IsbUJBQVM7QUFBdkIsU0FBUDtBQ2dFRDs7QUQ5RERuRixhQUFPckMsR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUI7QUFBQWdGLGFBQUssS0FBSzlFO0FBQVYsT0FBakIsQ0FBUDtBQUNBK1MsZUFBU2hULEtBQUtnVCxNQUFkO0FBQ0FBLGFBQU83VyxPQUFQLENBQWUsVUFBQ2lJLENBQUQ7QUFDYixZQUFHQSxFQUFFK08sT0FBRixLQUFhTCxLQUFoQjtBQ2tFRSxpQkRqRUExTyxFQUFFdVAsT0FBRixHQUFZLElDaUVaO0FEbEVGO0FDb0VFLGlCRGpFQXZQLEVBQUV1UCxPQUFGLEdBQVksS0NpRVo7QUFDRDtBRHRFSDtBQU1BaFcsU0FBR3VOLEtBQUgsQ0FBUytILE1BQVQsQ0FBZ0I3RyxNQUFoQixDQUF1QjtBQUFDckgsYUFBSyxLQUFLOUU7QUFBWCxPQUF2QixFQUNFO0FBQUF5UyxjQUNFO0FBQUFNLGtCQUFRQSxNQUFSO0FBQ0FGLGlCQUFPQTtBQURQO0FBREYsT0FERjtBQUtBblYsU0FBR3lLLFdBQUgsQ0FBZTZLLE1BQWYsQ0FBc0I3RyxNQUF0QixDQUE2QjtBQUFDcE0sY0FBTSxLQUFLQztBQUFaLE9BQTdCLEVBQWlEO0FBQUN5UyxjQUFNO0FBQUNJLGlCQUFPQTtBQUFSO0FBQVAsT0FBakQsRUFBeUU7QUFBQ2MsZUFBTztBQUFSLE9BQXpFO0FBQ0EsYUFBTyxFQUFQO0FBdEZGO0FBQUEsR0FERjtBQ3VLRDs7QUQ1RUQsSUFBRzNZLE9BQU9pRSxRQUFWO0FBQ0kxRCxVQUFRcVgsZUFBUixHQUEwQjtBQytFMUIsV0Q5RUl6VCxLQUNJO0FBQUFDLGFBQU9qRCxFQUFFLHNCQUFGLENBQVA7QUFDQW9ELFlBQU1wRCxFQUFFLGtDQUFGLENBRE47QUFFQXNELFlBQU0sT0FGTjtBQUdBbVUsd0JBQWtCLEtBSGxCO0FBSUFDLHNCQUFnQixLQUpoQjtBQUtBQyxpQkFBVztBQUxYLEtBREosRUFPRSxVQUFDQyxVQUFEO0FDK0VKLGFEOUVNL1ksT0FBTzZTLElBQVAsQ0FBWSxpQkFBWixFQUErQmtHLFVBQS9CLEVBQTJDLFVBQUNqUSxLQUFELEVBQVFnSCxNQUFSO0FBQ3ZDLFlBQUFBLFVBQUEsT0FBR0EsT0FBUWhILEtBQVgsR0FBVyxNQUFYO0FDK0VOLGlCRDlFVUcsT0FBT0gsS0FBUCxDQUFhZ0gsT0FBTzVGLE9BQXBCLENDOEVWO0FEL0VNO0FDaUZOLGlCRDlFVS9GLEtBQUtoRCxFQUFFLHVCQUFGLENBQUwsRUFBaUMsRUFBakMsRUFBcUMsU0FBckMsQ0M4RVY7QUFDRDtBRG5GRyxRQzhFTjtBRHRGRSxNQzhFSjtBRC9FMEIsR0FBMUI7QUNnR0gsQyxDRGxGRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRTNHQSxJQUFHbkIsT0FBT3NPLFFBQVY7QUFDSXRPLFNBQU91WCxPQUFQLENBQ0k7QUFBQXlCLHNCQUFrQixVQUFDMVQsTUFBRDtBQUNWLFVBQU8sS0FBQU4sTUFBQSxRQUFQO0FBQ1E7QUNDakI7O0FBQ0QsYURBVXRDLEdBQUd1TixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUNySCxhQUFLLEtBQUM5RTtBQUFQLE9BQWhCLEVBQWdDO0FBQUN5UyxjQUFNO0FBQUNuUyxrQkFBUUE7QUFBVDtBQUFQLE9BQWhDLENDQVY7QURKRTtBQUFBLEdBREo7QUNjSCxDOzs7Ozs7Ozs7OztBQ2ZEbUMsUUFBUSxDQUFDd1IsY0FBVCxHQUEwQjtBQUN6QjFYLE1BQUksRUFBRyxZQUFVO0FBQ2hCLFFBQUkyWCxXQUFXLEdBQUcsdUNBQWxCO0FBQ0EsUUFBRyxDQUFDbFosTUFBTSxDQUFDQyxRQUFYLEVBQ0MsT0FBT2laLFdBQVA7QUFFRCxRQUFHLENBQUNsWixNQUFNLENBQUNDLFFBQVAsQ0FBZ0I0WCxLQUFwQixFQUNDLE9BQU9xQixXQUFQO0FBRUQsUUFBRyxDQUFDbFosTUFBTSxDQUFDQyxRQUFQLENBQWdCNFgsS0FBaEIsQ0FBc0J0VyxJQUExQixFQUNDLE9BQU8yWCxXQUFQO0FBRUQsV0FBT2xaLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQjRYLEtBQWhCLENBQXNCdFcsSUFBN0I7QUFDQSxHQVpLLEVBRG1CO0FBY3pCNFgsZUFBYSxFQUFFO0FBQ2RDLFdBQU8sRUFBRSxVQUFVclUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZGlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJMlQsTUFBTSxHQUFHM1QsR0FBRyxDQUFDbU0sS0FBSixDQUFVLEdBQVYsQ0FBYjtBQUNBLFVBQUl5SCxTQUFTLEdBQUdELE1BQU0sQ0FBQ0EsTUFBTSxDQUFDMVgsTUFBUCxHQUFjLENBQWYsQ0FBdEI7QUFDQSxVQUFJNFgsUUFBUSxHQUFHeFUsSUFBSSxDQUFDeVUsT0FBTCxJQUFnQnpVLElBQUksQ0FBQ3lVLE9BQUwsQ0FBYTFZLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDeVUsT0FBTCxDQUFhMVksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPaVosUUFBUSxHQUFHLE1BQVgsR0FBb0JsVixPQUFPLENBQUNDLEVBQVIsQ0FBVyxpQ0FBWCxFQUE2QztBQUFDbVYsa0JBQVUsRUFBQ0g7QUFBWixPQUE3QyxFQUFvRXZVLElBQUksQ0FBQ3pFLE1BQXpFLENBQXBCLEdBQXVHLE1BQXZHLEdBQWdIb0YsR0FBaEgsR0FBc0gsTUFBdEgsR0FBK0hyQixPQUFPLENBQUNDLEVBQVIsQ0FBVyxvQkFBWCxFQUFnQyxFQUFoQyxFQUFtQ1MsSUFBSSxDQUFDekUsTUFBeEMsQ0FBL0gsR0FBaUwsSUFBeEw7QUFDQTtBQVRhLEdBZFU7QUF5QnpCb1osYUFBVyxFQUFFO0FBQ1pOLFdBQU8sRUFBRSxVQUFVclUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVywwQkFBWCxFQUFzQyxFQUF0QyxFQUF5Q1MsSUFBSSxDQUFDekUsTUFBOUMsQ0FBUDtBQUNBLEtBSFc7QUFJWmlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJNlQsUUFBUSxHQUFHeFUsSUFBSSxDQUFDeVUsT0FBTCxJQUFnQnpVLElBQUksQ0FBQ3lVLE9BQUwsQ0FBYTFZLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDeVUsT0FBTCxDQUFhMVksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPaVosUUFBUSxHQUFHLE1BQVgsR0FBb0JsVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBcEIsR0FBOEUsTUFBOUUsR0FBdUZvRixHQUF2RixHQUE2RixNQUE3RixHQUFzR3JCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUN6RSxNQUF4QyxDQUF0RyxHQUF3SixJQUEvSjtBQUNBO0FBUFcsR0F6Qlk7QUFrQ3pCcVosZUFBYSxFQUFFO0FBQ2RQLFdBQU8sRUFBRSxVQUFVclUsSUFBVixFQUFnQjtBQUN4QixhQUFPVixPQUFPLENBQUNDLEVBQVIsQ0FBVyw0QkFBWCxFQUF3QyxFQUF4QyxFQUEyQ1MsSUFBSSxDQUFDekUsTUFBaEQsQ0FBUDtBQUNBLEtBSGE7QUFJZGlFLFFBQUksRUFBRSxVQUFVUSxJQUFWLEVBQWdCVyxHQUFoQixFQUFxQjtBQUMxQixVQUFJNlQsUUFBUSxHQUFHeFUsSUFBSSxDQUFDeVUsT0FBTCxJQUFnQnpVLElBQUksQ0FBQ3lVLE9BQUwsQ0FBYTFZLElBQTdCLEdBQW9DdUQsT0FBTyxDQUFDQyxFQUFSLENBQVcsbUJBQVgsRUFBK0IsRUFBL0IsRUFBa0NTLElBQUksQ0FBQ3pFLE1BQXZDLElBQWlEeUUsSUFBSSxDQUFDeVUsT0FBTCxDQUFhMVksSUFBOUQsR0FBcUUsR0FBekcsR0FBK0d1RCxPQUFPLENBQUNDLEVBQVIsQ0FBVyxtQkFBWCxFQUErQixFQUEvQixFQUFrQ1MsSUFBSSxDQUFDekUsTUFBdkMsSUFBaUQsR0FBL0s7QUFDQSxhQUFPaVosUUFBUSxHQUFHLE1BQVgsR0FBb0JsVixPQUFPLENBQUNDLEVBQVIsQ0FBVywyQkFBWCxFQUF1QyxFQUF2QyxFQUEwQ1MsSUFBSSxDQUFDekUsTUFBL0MsQ0FBcEIsR0FBNkUsTUFBN0UsR0FBc0ZvRixHQUF0RixHQUE0RixNQUE1RixHQUFxR3JCLE9BQU8sQ0FBQ0MsRUFBUixDQUFXLG9CQUFYLEVBQWdDLEVBQWhDLEVBQW1DUyxJQUFJLENBQUN6RSxNQUF4QyxDQUFyRyxHQUF1SixJQUE5SjtBQUNBO0FBUGE7QUFsQ1UsQ0FBMUIsQzs7Ozs7Ozs7Ozs7QUNBQTtBQUNBOFIsVUFBVSxDQUFDd0gsR0FBWCxDQUFlLEtBQWYsRUFBc0IsNkJBQXRCLEVBQXFELFVBQVVsSyxHQUFWLEVBQWVDLEdBQWYsRUFBb0I2RCxJQUFwQixFQUEwQjtBQUU5RSxNQUFJcUcsSUFBSSxHQUFHblgsRUFBRSxDQUFDc0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQ3VNLFlBQVEsRUFBQyxLQUFWO0FBQWdCaFosUUFBSSxFQUFDO0FBQUNpWixTQUFHLEVBQUM7QUFBTDtBQUFyQixHQUF0QixDQUFYOztBQUNBLE1BQUlGLElBQUksQ0FBQy9CLEtBQUwsS0FBYSxDQUFqQixFQUNBO0FBQ0MrQixRQUFJLENBQUMzWSxPQUFMLENBQWMsVUFBVWdPLEdBQVYsRUFDZDtBQUNDO0FBQ0F4TSxRQUFFLENBQUNzSyxhQUFILENBQWlCZ0wsTUFBakIsQ0FBd0I3RyxNQUF4QixDQUErQmpDLEdBQUcsQ0FBQ3BGLEdBQW5DLEVBQXdDO0FBQUMyTixZQUFJLEVBQUU7QUFBQ3FDLGtCQUFRLEVBQUU1SyxHQUFHLENBQUM4SyxpQkFBSjtBQUFYO0FBQVAsT0FBeEM7QUFFQSxLQUxEO0FBTUE7O0FBRUM1SCxZQUFVLENBQUNDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUEyQjtBQUN6QjJDLFFBQUksRUFBRTtBQUNIMkgsU0FBRyxFQUFFLENBREY7QUFFSEMsU0FBRyxFQUFFO0FBRkY7QUFEbUIsR0FBM0I7QUFNRixDQW5CRCxFOzs7Ozs7Ozs7Ozs7QUNEQSxJQUFHbGEsT0FBT29JLFNBQVY7QUFDUXBJLFNBQU8rVyxPQUFQLENBQWU7QUNDbkIsV0RBWW9ELEtBQUtDLFNBQUwsQ0FDUTtBQUFBaE8sZUFDUTtBQUFBaU8sa0JBQVVsVCxPQUFPbVQsaUJBQWpCO0FBQ0FDLGVBQU8sSUFEUDtBQUVBQyxpQkFBUztBQUZULE9BRFI7QUFJQUMsV0FDUTtBQUFBQyxlQUFPLElBQVA7QUFDQUMsb0JBQVksSUFEWjtBQUVBSixlQUFPLElBRlA7QUFHQUssZUFBTztBQUhQLE9BTFI7QUFTQUMsZUFBUztBQVRULEtBRFIsQ0NBWjtBRERJO0FDZ0JQLEM7Ozs7Ozs7Ozs7OztBQ2pCREMsV0FBVyxFQUFYOztBQUdBQSxTQUFTQyx1QkFBVCxHQUFtQyxVQUFDL1YsTUFBRDtBQUNsQyxNQUFBZ1csUUFBQSxFQUFBclEsTUFBQSxFQUFBNUYsSUFBQTs7QUFBQSxNQUFHL0UsT0FBT2lFLFFBQVY7QUFDQ2UsYUFBU2hGLE9BQU9nRixNQUFQLEVBQVQ7O0FBQ0EsU0FBT0EsTUFBUDtBQUNDLGFBQU87QUFBQzhFLGFBQUssQ0FBQztBQUFQLE9BQVA7QUNLRTs7QURKSCxRQUFHdkosUUFBUW1LLFlBQVIsRUFBSDtBQUNDLGFBQU87QUFBQ0QsZUFBTzNELFFBQVFDLEdBQVIsQ0FBWSxTQUFaO0FBQVIsT0FBUDtBQUREO0FBR0MsYUFBTztBQUFDK0MsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQVBGO0FDa0JFOztBRFRGLE1BQUc5SixPQUFPc08sUUFBVjtBQUNDLFNBQU90SixNQUFQO0FBQ0MsYUFBTztBQUFDOEUsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ2FFOztBRFpIL0UsV0FBT3JDLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCRSxNQUFqQixFQUF5QjtBQUFDb0ksY0FBUTtBQUFDNk4sdUJBQWU7QUFBaEI7QUFBVCxLQUF6QixDQUFQOztBQUNBLFFBQUcsQ0FBQ2xXLElBQUo7QUFDQyxhQUFPO0FBQUMrRSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDb0JFOztBRG5CSGtSLGVBQVcsRUFBWDs7QUFDQSxRQUFHLENBQUNqVyxLQUFLa1csYUFBVDtBQUNDdFEsZUFBU2pJLEdBQUdpSSxNQUFILENBQVU0QyxJQUFWLENBQWU7QUFBQ2dCLGdCQUFPO0FBQUNmLGVBQUksQ0FBQ3hJLE1BQUQ7QUFBTDtBQUFSLE9BQWYsRUFBd0M7QUFBQ29JLGdCQUFRO0FBQUN0RCxlQUFLO0FBQU47QUFBVCxPQUF4QyxFQUE0RDJELEtBQTVELEVBQVQ7QUFDQTlDLGVBQVNBLE9BQU91USxHQUFQLENBQVcsVUFBQ0MsQ0FBRDtBQUFPLGVBQU9BLEVBQUVyUixHQUFUO0FBQWxCLFFBQVQ7QUFDQWtSLGVBQVN2USxLQUFULEdBQWlCO0FBQUMrQyxhQUFLN0M7QUFBTixPQUFqQjtBQ2lDRTs7QURoQ0gsV0FBT3FRLFFBQVA7QUNrQ0M7QUR2RGdDLENBQW5DOztBQXdCQUYsU0FBU00sa0JBQVQsR0FBOEIsVUFBQ3BXLE1BQUQ7QUFDN0IsTUFBQWdXLFFBQUEsRUFBQTFRLE9BQUEsRUFBQTZDLFdBQUEsRUFBQXhDLE1BQUEsRUFBQTVGLElBQUE7O0FBQUEsTUFBRy9FLE9BQU9pRSxRQUFWO0FBQ0NlLGFBQVNoRixPQUFPZ0YsTUFBUCxFQUFUOztBQUNBLFNBQU9BLE1BQVA7QUFDQyxhQUFPO0FBQUM4RSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDc0NFOztBRHJDSFEsY0FBVXhELFFBQVFDLEdBQVIsQ0FBWSxTQUFaLENBQVY7O0FBQ0EsUUFBR3VELE9BQUg7QUFDQyxVQUFHNUgsR0FBR3lLLFdBQUgsQ0FBZXJJLE9BQWYsQ0FBdUI7QUFBQ0MsY0FBTUMsTUFBUDtBQUFjeUYsZUFBT0g7QUFBckIsT0FBdkIsRUFBc0Q7QUFBQzhDLGdCQUFRO0FBQUN0RCxlQUFLO0FBQU47QUFBVCxPQUF0RCxDQUFIO0FBQ0MsZUFBTztBQUFDVyxpQkFBT0g7QUFBUixTQUFQO0FBREQ7QUFHQyxlQUFPO0FBQUNSLGVBQUssQ0FBQztBQUFQLFNBQVA7QUFKRjtBQUFBO0FBTUMsYUFBTztBQUFDQSxhQUFLLENBQUM7QUFBUCxPQUFQO0FBWEY7QUNpRUU7O0FEcERGLE1BQUc5SixPQUFPc08sUUFBVjtBQUNDLFNBQU90SixNQUFQO0FBQ0MsYUFBTztBQUFDOEUsYUFBSyxDQUFDO0FBQVAsT0FBUDtBQ3dERTs7QUR2REgvRSxXQUFPckMsR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUJFLE1BQWpCLEVBQXlCO0FBQUNvSSxjQUFRO0FBQUN0RCxhQUFLO0FBQU47QUFBVCxLQUF6QixDQUFQOztBQUNBLFFBQUcsQ0FBQy9FLElBQUo7QUFDQyxhQUFPO0FBQUMrRSxhQUFLLENBQUM7QUFBUCxPQUFQO0FDK0RFOztBRDlESGtSLGVBQVcsRUFBWDtBQUNBN04sa0JBQWN6SyxHQUFHeUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUN4SSxZQUFNQztBQUFQLEtBQXBCLEVBQW9DO0FBQUNvSSxjQUFRO0FBQUMzQyxlQUFPO0FBQVI7QUFBVCxLQUFwQyxFQUEwRGdELEtBQTFELEVBQWQ7QUFDQTlDLGFBQVMsRUFBVDs7QUFDQTBDLE1BQUVwQyxJQUFGLENBQU9rQyxXQUFQLEVBQW9CLFVBQUNrTyxDQUFEO0FDc0VoQixhRHJFSDFRLE9BQU90SixJQUFQLENBQVlnYSxFQUFFNVEsS0FBZCxDQ3FFRztBRHRFSjs7QUFFQXVRLGFBQVN2USxLQUFULEdBQWlCO0FBQUMrQyxXQUFLN0M7QUFBTixLQUFqQjtBQUNBLFdBQU9xUSxRQUFQO0FDeUVDO0FEbkcyQixDQUE5Qjs7QUE0QkF0WSxHQUFHNFksbUJBQUgsQ0FBdUJDLFdBQXZCLEdBQ0M7QUFBQUMsUUFBTSxPQUFOO0FBQ0FDLFNBQU8sTUFEUDtBQUVBQyxnQkFBYyxDQUNiO0FBQUM1YSxVQUFNO0FBQVAsR0FEYSxFQUViO0FBQUNBLFVBQU07QUFBUCxHQUZhLEVBR2I7QUFBQ0EsVUFBTTtBQUFQLEdBSGEsRUFJYjtBQUFDQSxVQUFNO0FBQVAsR0FKYSxFQUtiO0FBQUNBLFVBQU07QUFBUCxHQUxhLEVBTWI7QUFBQ0EsVUFBTTtBQUFQLEdBTmEsQ0FGZDtBQVVBNmEsZUFBYSxDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLE1BQXJCLEVBQTZCLFdBQTdCLENBVmI7QUFXQUMsZUFBYSxRQVhiO0FBWUFaLFlBQVUsVUFBQ2hXLE1BQUQ7QUFDVCxRQUFHaEYsT0FBT2lFLFFBQVY7QUFDQyxVQUFHMUQsUUFBUW1LLFlBQVIsRUFBSDtBQUNDLGVBQU87QUFBQ0QsaUJBQU8zRCxRQUFRQyxHQUFSLENBQVksU0FBWixDQUFSO0FBQWdDOFUsZ0JBQU07QUFBdEMsU0FBUDtBQUREO0FBR0MsZUFBTztBQUFDL1IsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQUpGO0FDNEZHOztBRHRGSCxRQUFHOUosT0FBT3NPLFFBQVY7QUFDQyxhQUFPLEVBQVA7QUN3RkU7QUQ1R0o7QUFxQkF3TixrQkFBZ0IsS0FyQmhCO0FBc0JBQyxpQkFBZSxLQXRCZjtBQXVCQUMsY0FBWSxJQXZCWjtBQXdCQUMsY0FBWSxHQXhCWjtBQXlCQUMsU0FBTyxDQUFDLENBQUMsQ0FBRCxFQUFJLE1BQUosQ0FBRDtBQXpCUCxDQUREO0FBNEJBbGMsT0FBTytXLE9BQVAsQ0FBZTtBQUNkLE9BQUNvRixnQkFBRCxHQUFvQnpaLEdBQUd5WixnQkFBdkI7QUFDQSxPQUFDYixtQkFBRCxHQUF1QjVZLEdBQUc0WSxtQkFBMUI7QUMyRkMsU0FBTyxPQUFPYyxXQUFQLEtBQXVCLFdBQXZCLElBQXNDQSxnQkFBZ0IsSUFBdEQsR0QxRlJBLFlBQWFDLGVBQWIsQ0FDQztBQUFBRixzQkFBa0J6WixHQUFHeVosZ0JBQUgsQ0FBb0JaLFdBQXRDO0FBQ0FELHlCQUFxQjVZLEdBQUc0WSxtQkFBSCxDQUF1QkM7QUFENUMsR0FERCxDQzBGUSxHRDFGUixNQzBGQztBRDdGRixHOzs7Ozs7Ozs7OztBRW5GQSxJQUFJLENBQUMsR0FBR3JaLFFBQVIsRUFBa0I7QUFDaEIvQixPQUFLLENBQUNDLFNBQU4sQ0FBZ0I4QixRQUFoQixHQUEyQixVQUFTb2E7QUFBYztBQUF2QixJQUF5QztBQUNsRTs7QUFDQSxRQUFJQyxDQUFDLEdBQUdwYSxNQUFNLENBQUMsSUFBRCxDQUFkO0FBQ0EsUUFBSTRPLEdBQUcsR0FBRzZELFFBQVEsQ0FBQzJILENBQUMsQ0FBQzVhLE1BQUgsQ0FBUixJQUFzQixDQUFoQzs7QUFDQSxRQUFJb1AsR0FBRyxLQUFLLENBQVosRUFBZTtBQUNiLGFBQU8sS0FBUDtBQUNEOztBQUNELFFBQUlvSyxDQUFDLEdBQUd2RyxRQUFRLENBQUNoQyxTQUFTLENBQUMsQ0FBRCxDQUFWLENBQVIsSUFBMEIsQ0FBbEM7QUFDQSxRQUFJM1IsQ0FBSjs7QUFDQSxRQUFJa2EsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNWbGEsT0FBQyxHQUFHa2EsQ0FBSjtBQUNELEtBRkQsTUFFTztBQUNMbGEsT0FBQyxHQUFHOFAsR0FBRyxHQUFHb0ssQ0FBVjs7QUFDQSxVQUFJbGEsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUFDQSxTQUFDLEdBQUcsQ0FBSjtBQUFPO0FBQ3BCOztBQUNELFFBQUl1YixjQUFKOztBQUNBLFdBQU92YixDQUFDLEdBQUc4UCxHQUFYLEVBQWdCO0FBQ2R5TCxvQkFBYyxHQUFHRCxDQUFDLENBQUN0YixDQUFELENBQWxCOztBQUNBLFVBQUlxYixhQUFhLEtBQUtFLGNBQWxCLElBQ0FGLGFBQWEsS0FBS0EsYUFBbEIsSUFBbUNFLGNBQWMsS0FBS0EsY0FEMUQsRUFDMkU7QUFDekUsZUFBTyxJQUFQO0FBQ0Q7O0FBQ0R2YixPQUFDO0FBQ0Y7O0FBQ0QsV0FBTyxLQUFQO0FBQ0QsR0F6QkQ7QUEwQkQsQzs7Ozs7Ozs7Ozs7O0FDM0JEakIsT0FBTytXLE9BQVAsQ0FBZTtBQUNieFcsVUFBUU4sUUFBUixDQUFpQndjLFdBQWpCLEdBQStCemMsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUF0RDs7QUFFQSxNQUFHLENBQUNsYyxRQUFRTixRQUFSLENBQWlCd2MsV0FBckI7QUNBRSxXRENBbGMsUUFBUU4sUUFBUixDQUFpQndjLFdBQWpCLEdBQ0U7QUFBQUMsV0FDRTtBQUFBQyxnQkFBUSxRQUFSO0FBQ0FqWCxhQUFLO0FBREw7QUFERixLQ0ZGO0FBTUQ7QURUSCxHOzs7Ozs7Ozs7Ozs7QUVBQWtRLFFBQVFnSCx1QkFBUixHQUFrQyxVQUFDNVgsTUFBRCxFQUFTc0YsT0FBVCxFQUFrQnVTLE9BQWxCO0FBQ2pDLE1BQUFDLHVCQUFBLEVBQUFDLElBQUEsRUFBQUMsU0FBQSxFQUFBQyxZQUFBOztBQUFBRCxjQUFZLEVBQVo7QUFFQUQsU0FBTzFQLEVBQUUwUCxJQUFGLENBQU9GLE9BQVAsQ0FBUDtBQUVBSSxpQkFBZXJILFFBQVFzSCxhQUFSLENBQXNCLGtCQUF0QixFQUEwQzNQLElBQTFDLENBQStDO0FBQzdENFAsaUJBQWE7QUFBQzNQLFdBQUt1UDtBQUFOLEtBRGdEO0FBRTdEdFMsV0FBT0gsT0FGc0Q7QUFHN0QsV0FBTyxDQUFDO0FBQUM4UyxhQUFPcFk7QUFBUixLQUFELEVBQWtCO0FBQUNxWSxjQUFRO0FBQVQsS0FBbEI7QUFIc0QsR0FBL0MsRUFJWjtBQUNGalEsWUFBUTtBQUNQK0ksZUFBUyxDQURGO0FBRVBFLGdCQUFVLENBRkg7QUFHUEQsa0JBQVksQ0FITDtBQUlQRSxtQkFBYTtBQUpOO0FBRE4sR0FKWSxFQVdaN0ksS0FYWSxFQUFmOztBQWFBcVAsNEJBQTBCLFVBQUNLLFdBQUQ7QUFDekIsUUFBQUcsdUJBQUEsRUFBQUMsVUFBQTs7QUFBQUQsOEJBQTBCLEVBQTFCO0FBQ0FDLGlCQUFhbFEsRUFBRTRCLE1BQUYsQ0FBU2dPLFlBQVQsRUFBdUIsVUFBQ08sRUFBRDtBQUNuQyxhQUFPQSxHQUFHTCxXQUFILEtBQWtCQSxXQUF6QjtBQURZLE1BQWI7O0FBR0E5UCxNQUFFcEMsSUFBRixDQUFPc1MsVUFBUCxFQUFtQixVQUFDRSxRQUFEO0FDUWYsYURQSEgsd0JBQXdCRyxTQUFTM1QsR0FBakMsSUFBd0MyVCxRQ09yQztBRFJKOztBQUdBLFdBQU9ILHVCQUFQO0FBUnlCLEdBQTFCOztBQVVBalEsSUFBRW5NLE9BQUYsQ0FBVTJiLE9BQVYsRUFBbUIsVUFBQ2EsQ0FBRCxFQUFJelksR0FBSjtBQUNsQixRQUFBMFksU0FBQTtBQUFBQSxnQkFBWWIsd0JBQXdCN1gsR0FBeEIsQ0FBWjs7QUFDQSxRQUFHLENBQUNvSSxFQUFFNEcsT0FBRixDQUFVMEosU0FBVixDQUFKO0FDU0ksYURSSFgsVUFBVS9YLEdBQVYsSUFBaUIwWSxTQ1FkO0FBQ0Q7QURaSjs7QUFJQSxTQUFPWCxTQUFQO0FBaENpQyxDQUFsQzs7QUFtQ0FwSCxRQUFRZ0ksc0JBQVIsR0FBaUMsVUFBQzVZLE1BQUQsRUFBU3NGLE9BQVQsRUFBa0I2UyxXQUFsQjtBQUNoQyxNQUFBRyx1QkFBQSxFQUFBTyxlQUFBOztBQUFBUCw0QkFBMEIsRUFBMUI7QUFFQU8sb0JBQWtCakksUUFBUXNILGFBQVIsQ0FBc0Isa0JBQXRCLEVBQTBDM1AsSUFBMUMsQ0FBK0M7QUFDaEU0UCxpQkFBYUEsV0FEbUQ7QUFFaEUxUyxXQUFPSCxPQUZ5RDtBQUdoRSxXQUFPLENBQUM7QUFBQzhTLGFBQU9wWTtBQUFSLEtBQUQsRUFBa0I7QUFBQ3FZLGNBQVE7QUFBVCxLQUFsQjtBQUh5RCxHQUEvQyxFQUlmO0FBQ0ZqUSxZQUFRO0FBQ1ArSSxlQUFTLENBREY7QUFFUEUsZ0JBQVUsQ0FGSDtBQUdQRCxrQkFBWSxDQUhMO0FBSVBFLG1CQUFhO0FBSk47QUFETixHQUplLENBQWxCO0FBYUF1SCxrQkFBZ0IzYyxPQUFoQixDQUF3QixVQUFDdWMsUUFBRDtBQ2dCckIsV0RmRkgsd0JBQXdCRyxTQUFTM1QsR0FBakMsSUFBd0MyVCxRQ2V0QztBRGhCSDtBQUdBLFNBQU9ILHVCQUFQO0FBbkJnQyxDQUFqQyxDOzs7Ozs7Ozs7OztBRW5DQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQSxROzs7Ozs7Ozs7Ozs7QUMzSEFsTCxXQUFXd0gsR0FBWCxDQUFlLEtBQWYsRUFBc0IsZUFBdEIsRUFBdUMsVUFBQ2xLLEdBQUQsRUFBTUMsR0FBTixFQUFXNkQsSUFBWDtBQUN0QyxNQUFBdkwsSUFBQSxFQUFBa0IsQ0FBQSxFQUFBN0ksTUFBQSxFQUFBdUMsR0FBQSxFQUFBQyxJQUFBLEVBQUFnVCxRQUFBLEVBQUFuTCxNQUFBLEVBQUE1RixJQUFBLEVBQUErWSxPQUFBOztBQUFBO0FBQ0NBLGNBQVVwTyxJQUFJWSxPQUFKLENBQVksV0FBWixPQUFBek4sTUFBQTZNLElBQUFNLEtBQUEsWUFBQW5OLElBQXVDbUMsTUFBdkMsR0FBdUMsTUFBdkMsQ0FBVjtBQUVBOFEsZUFBV3BHLElBQUlZLE9BQUosQ0FBWSxZQUFaLE9BQUF4TixPQUFBNE0sSUFBQU0sS0FBQSxZQUFBbE4sS0FBd0N3SCxPQUF4QyxHQUF3QyxNQUF4QyxDQUFYO0FBRUF2RixXQUFPeEUsUUFBUWtQLGVBQVIsQ0FBd0JDLEdBQXhCLEVBQTZCQyxHQUE3QixDQUFQOztBQUVBLFFBQUcsQ0FBQzVLLElBQUo7QUFDQ3FOLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQztBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0M7QUFBQSxtQkFBUyxvREFBVDtBQUNBLHFCQUFXO0FBRFg7QUFGRCxPQUREO0FBS0E7QUNDRTs7QURDSHdMLGNBQVUvWSxLQUFLK0UsR0FBZjtBQUdBaVUsa0JBQWNDLFFBQWQsQ0FBdUJsSSxRQUF2QjtBQUVBeFYsYUFBU29DLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCO0FBQUNnRixXQUFJZ1U7QUFBTCxLQUFqQixFQUFnQ3hkLE1BQXpDOztBQUNBLFFBQUdBLFdBQVUsT0FBYjtBQUNDQSxlQUFTLElBQVQ7QUNBRTs7QURDSCxRQUFHQSxXQUFVLE9BQWI7QUFDQ0EsZUFBUyxPQUFUO0FDQ0U7O0FEQ0hxSyxhQUFTakksR0FBR3lLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDeEksWUFBTStZO0FBQVAsS0FBcEIsRUFBcUNyUSxLQUFyQyxHQUE2Q3pNLFdBQTdDLENBQXlELE9BQXpELENBQVQ7QUFDQWlILFdBQU92RixHQUFHdUYsSUFBSCxDQUFRc0YsSUFBUixDQUFhO0FBQUMwUSxXQUFLLENBQUM7QUFBQ3hULGVBQU87QUFBQ3lULG1CQUFTO0FBQVY7QUFBUixPQUFELEVBQTRCO0FBQUN6VCxlQUFPO0FBQUMrQyxlQUFJN0M7QUFBTDtBQUFSLE9BQTVCO0FBQU4sS0FBYixFQUF1RTtBQUFDbkssWUFBSztBQUFDQSxjQUFLO0FBQU47QUFBTixLQUF2RSxFQUF3RmlOLEtBQXhGLEVBQVA7QUFFQXhGLFNBQUsvRyxPQUFMLENBQWEsVUFBQzhHLEdBQUQ7QUNrQlQsYURqQkhBLElBQUlsSCxJQUFKLEdBQVd1RCxRQUFRQyxFQUFSLENBQVcwRCxJQUFJbEgsSUFBZixFQUFvQixFQUFwQixFQUF1QlIsTUFBdkIsQ0NpQlI7QURsQko7QUNvQkUsV0RqQkY4UixXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQztBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFBRXFLLGdCQUFRLFNBQVY7QUFBcUJySyxjQUFNcks7QUFBM0I7QUFETixLQURELENDaUJFO0FEakRILFdBQUFhLEtBQUE7QUFtQ01LLFFBQUFMLEtBQUE7QUFDTG1CLFlBQVFuQixLQUFSLENBQWNLLEVBQUVnQixLQUFoQjtBQ3VCRSxXRHRCRmlJLFdBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNDO0FBQUE0QyxZQUFNLEdBQU47QUFDQUQsWUFBTTtBQUFFNkwsZ0JBQVEsQ0FBQztBQUFDQyx3QkFBY2pWLEVBQUVlO0FBQWpCLFNBQUQ7QUFBVjtBQUROLEtBREQsQ0NzQkU7QUFVRDtBRHRFSCxHOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFBM0gsT0FBQTtBQUFBQSxVQUFVc0csUUFBUSxTQUFSLENBQVY7QUFFQXVKLFdBQVd3SCxHQUFYLENBQWUsTUFBZixFQUF1QixzQkFBdkIsRUFBK0MsVUFBQ2xLLEdBQUQsRUFBTUMsR0FBTixFQUFXNkQsSUFBWDtBQUMzQyxNQUFBNkssWUFBQSxFQUFBL1csU0FBQSxFQUFBeEgsT0FBQSxFQUFBd1MsSUFBQSxFQUFBbkosQ0FBQSxFQUFBbVYsS0FBQSxFQUFBQyxPQUFBLEVBQUF2RCxRQUFBLEVBQUF2USxLQUFBLEVBQUF5QyxVQUFBLEVBQUFsSSxNQUFBOztBQUFBO0FBRUlsRixjQUFVLElBQUl5QyxPQUFKLENBQWFtTixHQUFiLEVBQWtCQyxHQUFsQixDQUFWOztBQUdBLFFBQUdELElBQUkzQixJQUFQO0FBQ0kvSSxlQUFTMEssSUFBSTNCLElBQUosQ0FBUyxXQUFULENBQVQ7QUFDQXpHLGtCQUFZb0ksSUFBSTNCLElBQUosQ0FBUyxjQUFULENBQVo7QUNDUDs7QURFRyxRQUFHLENBQUMvSSxNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDSXRDLGVBQVNsRixRQUFRaUgsR0FBUixDQUFZLFdBQVosQ0FBVDtBQUNBTyxrQkFBWXhILFFBQVFpSCxHQUFSLENBQVksY0FBWixDQUFaO0FDQVA7O0FERUcsUUFBRyxFQUFFL0IsVUFBV3NDLFNBQWIsQ0FBSDtBQUNJOEssaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLDBDQUFUO0FBQ0Esc0JBQVksWUFEWjtBQUVBLHFCQUFXO0FBRlg7QUFGSixPQURBO0FBTUE7QUNFUDs7QURBR2dNLFlBQVE1TyxJQUFJM0IsSUFBSixDQUFTdVEsS0FBakI7QUFDQXRELGVBQVd0TCxJQUFJM0IsSUFBSixDQUFTaU4sUUFBcEI7QUFDQXVELGNBQVU3TyxJQUFJM0IsSUFBSixDQUFTd1EsT0FBbkI7QUFDQTlULFlBQVFpRixJQUFJM0IsSUFBSixDQUFTdEQsS0FBakI7QUFDQTZILFdBQU8sRUFBUDtBQUNBK0wsbUJBQWUsQ0FBQyxhQUFELEVBQWdCLGVBQWhCLEVBQWlDLFlBQWpDLEVBQStDLE9BQS9DLENBQWY7O0FBRUEsUUFBRyxDQUFDNVQsS0FBSjtBQUNJMkgsaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQjdILEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ0dQOztBREFHeUMsaUJBQWF4SyxHQUFHeUssV0FBSCxDQUFlckksT0FBZixDQUF1QjtBQUFDQyxZQUFNQyxNQUFQO0FBQWV5RixhQUFPQTtBQUF0QixLQUF2QixDQUFiOztBQUVBLFFBQUcsQ0FBQ3lDLFVBQUo7QUFDSWtGLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUI3SCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNNUDs7QURKRyxRQUFHLENBQUM0VCxhQUFhbmMsUUFBYixDQUFzQm9jLEtBQXRCLENBQUo7QUFDSWxNLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUJnTSxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNRUDs7QURORyxRQUFHLENBQUM1YixHQUFHNGIsS0FBSCxDQUFKO0FBQ0lsTSxpQkFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0E7QUFBQTRDLGNBQU0sR0FBTjtBQUNBRCxjQUNJO0FBQUEsbUJBQVMsbUJBQW1CZ00sS0FBNUI7QUFDQSxxQkFBVztBQURYO0FBRkosT0FEQTtBQUtBO0FDVVA7O0FEUkcsUUFBRyxDQUFDdEQsUUFBSjtBQUNJQSxpQkFBVyxFQUFYO0FDVVA7O0FEUkcsUUFBRyxDQUFDdUQsT0FBSjtBQUNJQSxnQkFBVSxFQUFWO0FDVVA7O0FEUkd2RCxhQUFTdlEsS0FBVCxHQUFpQkEsS0FBakI7QUFFQTZILFdBQU81UCxHQUFHNGIsS0FBSCxFQUFVL1EsSUFBVixDQUFleU4sUUFBZixFQUF5QnVELE9BQXpCLEVBQWtDOVEsS0FBbEMsRUFBUDtBQ1NKLFdEUEkyRSxXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDSTtBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU1BO0FBRE4sS0FESixDQ09KO0FEbEZBLFdBQUF4SixLQUFBO0FBOEVNSyxRQUFBTCxLQUFBO0FBQ0ZtQixZQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEI7QUNVSixXRFRJaUksV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0k7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNO0FBRE4sS0FESixDQ1NKO0FBSUQ7QUQ5Rkg7QUFzRkFGLFdBQVd3SCxHQUFYLENBQWUsTUFBZixFQUF1Qix5QkFBdkIsRUFBa0QsVUFBQ2xLLEdBQUQsRUFBTUMsR0FBTixFQUFXNkQsSUFBWDtBQUM5QyxNQUFBNkssWUFBQSxFQUFBL1csU0FBQSxFQUFBeEgsT0FBQSxFQUFBd1MsSUFBQSxFQUFBbkosQ0FBQSxFQUFBbVYsS0FBQSxFQUFBQyxPQUFBLEVBQUF2RCxRQUFBLEVBQUF2USxLQUFBLEVBQUF5QyxVQUFBLEVBQUFsSSxNQUFBOztBQUFBO0FBRUlsRixjQUFVLElBQUl5QyxPQUFKLENBQWFtTixHQUFiLEVBQWtCQyxHQUFsQixDQUFWOztBQUdBLFFBQUdELElBQUkzQixJQUFQO0FBQ0kvSSxlQUFTMEssSUFBSTNCLElBQUosQ0FBUyxXQUFULENBQVQ7QUFDQXpHLGtCQUFZb0ksSUFBSTNCLElBQUosQ0FBUyxjQUFULENBQVo7QUNVUDs7QURQRyxRQUFHLENBQUMvSSxNQUFELElBQVcsQ0FBQ3NDLFNBQWY7QUFDSXRDLGVBQVNsRixRQUFRaUgsR0FBUixDQUFZLFdBQVosQ0FBVDtBQUNBTyxrQkFBWXhILFFBQVFpSCxHQUFSLENBQVksY0FBWixDQUFaO0FDU1A7O0FEUEcsUUFBRyxFQUFFL0IsVUFBV3NDLFNBQWIsQ0FBSDtBQUNJOEssaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLDBDQUFUO0FBQ0Esc0JBQVksWUFEWjtBQUVBLHFCQUFXO0FBRlg7QUFGSixPQURBO0FBTUE7QUNXUDs7QURUR2dNLFlBQVE1TyxJQUFJM0IsSUFBSixDQUFTdVEsS0FBakI7QUFDQXRELGVBQVd0TCxJQUFJM0IsSUFBSixDQUFTaU4sUUFBcEI7QUFDQXVELGNBQVU3TyxJQUFJM0IsSUFBSixDQUFTd1EsT0FBbkI7QUFDQTlULFlBQVFpRixJQUFJM0IsSUFBSixDQUFTdEQsS0FBakI7QUFDQTZILFdBQU8sRUFBUDtBQUNBK0wsbUJBQWUsQ0FBQyxhQUFELEVBQWdCLGVBQWhCLEVBQWlDLFlBQWpDLEVBQStDLGVBQS9DLEVBQWdFLE9BQWhFLENBQWY7O0FBRUEsUUFBRyxDQUFDNVQsS0FBSjtBQUNJMkgsaUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQjdILEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ1lQOztBRFRHeUMsaUJBQWF4SyxHQUFHeUssV0FBSCxDQUFlckksT0FBZixDQUF1QjtBQUFDQyxZQUFNQyxNQUFQO0FBQWV5RixhQUFPQTtBQUF0QixLQUF2QixDQUFiOztBQUVBLFFBQUcsQ0FBQ3lDLFVBQUo7QUFDSWtGLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUI3SCxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNlUDs7QURiRyxRQUFHLENBQUM0VCxhQUFhbmMsUUFBYixDQUFzQm9jLEtBQXRCLENBQUo7QUFDSWxNLGlCQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQTtBQUFBNEMsY0FBTSxHQUFOO0FBQ0FELGNBQ0k7QUFBQSxtQkFBUyxtQkFBbUJnTSxLQUE1QjtBQUNBLHFCQUFXO0FBRFg7QUFGSixPQURBO0FBS0E7QUNpQlA7O0FEZkcsUUFBRyxDQUFDNWIsR0FBRzRiLEtBQUgsQ0FBSjtBQUNJbE0saUJBQVdDLFVBQVgsQ0FBc0IxQyxHQUF0QixFQUNBO0FBQUE0QyxjQUFNLEdBQU47QUFDQUQsY0FDSTtBQUFBLG1CQUFTLG1CQUFtQmdNLEtBQTVCO0FBQ0EscUJBQVc7QUFEWDtBQUZKLE9BREE7QUFLQTtBQ21CUDs7QURqQkcsUUFBRyxDQUFDdEQsUUFBSjtBQUNJQSxpQkFBVyxFQUFYO0FDbUJQOztBRGpCRyxRQUFHLENBQUN1RCxPQUFKO0FBQ0lBLGdCQUFVLEVBQVY7QUNtQlA7O0FEakJHLFFBQUdELFVBQVMsZUFBWjtBQUNJdEQsaUJBQVcsRUFBWDtBQUNBQSxlQUFTb0MsS0FBVCxHQUFpQnBZLE1BQWpCO0FBQ0FzTixhQUFPNVAsR0FBRzRiLEtBQUgsRUFBVXhaLE9BQVYsQ0FBa0JrVyxRQUFsQixDQUFQO0FBSEo7QUFLSUEsZUFBU3ZRLEtBQVQsR0FBaUJBLEtBQWpCO0FBRUE2SCxhQUFPNVAsR0FBRzRiLEtBQUgsRUFBVXhaLE9BQVYsQ0FBa0JrVyxRQUFsQixFQUE0QnVELE9BQTVCLENBQVA7QUNrQlA7O0FBQ0QsV0RqQkluTSxXQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDSTtBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU1BO0FBRE4sS0FESixDQ2lCSjtBRGpHQSxXQUFBeEosS0FBQTtBQW1GTUssUUFBQUwsS0FBQTtBQUNGbUIsWUFBUW5CLEtBQVIsQ0FBY0ssRUFBRWdCLEtBQWhCO0FDb0JKLFdEbkJJaUksV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0k7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNO0FBRE4sS0FESixDQ21CSjtBQUlEO0FEN0dILEc7Ozs7Ozs7Ozs7OztBRXhGQSxJQUFBL1AsT0FBQSxFQUFBQyxNQUFBLEVBQUFnYyxPQUFBO0FBQUFoYyxTQUFTcUcsUUFBUSxRQUFSLENBQVQ7QUFDQXRHLFVBQVVzRyxRQUFRLFNBQVIsQ0FBVjtBQUNBMlYsVUFBVTNWLFFBQVEsU0FBUixDQUFWO0FBRUF1SixXQUFXd0gsR0FBWCxDQUFlLEtBQWYsRUFBc0Isd0JBQXRCLEVBQWdELFVBQUNsSyxHQUFELEVBQU1DLEdBQU4sRUFBVzZELElBQVg7QUFFL0MsTUFBQXhMLEdBQUEsRUFBQVYsU0FBQSxFQUFBcUosQ0FBQSxFQUFBVyxNQUFBLEVBQUFDLFdBQUEsRUFBQXpSLE9BQUEsRUFBQTJlLFVBQUEsRUFBQUMsZUFBQSxFQUFBQyxNQUFBLEVBQUFDLGlCQUFBLEVBQUFyTyxXQUFBLEVBQUFsQixDQUFBLEVBQUFxQixFQUFBLEVBQUFtTyxNQUFBLEVBQUEvTixLQUFBLEVBQUFnTyxJQUFBLEVBQUEvTixHQUFBLEVBQUEzUCxDQUFBLEVBQUFxVCxHQUFBLEVBQUFzSyxXQUFBLEVBQUFDLFNBQUEsRUFBQXRLLE1BQUEsRUFBQXhFLFVBQUEsRUFBQXlFLGFBQUEsRUFBQTVQLElBQUEsRUFBQUMsTUFBQTtBQUFBZ0QsUUFBTXRGLEdBQUd1RixJQUFILENBQVFuRCxPQUFSLENBQWdCNEssSUFBSXVQLE1BQUosQ0FBV25YLE1BQTNCLENBQU47O0FBQ0EsTUFBR0UsR0FBSDtBQUNDME0sYUFBUzFNLElBQUkwTSxNQUFiO0FBQ0FxSyxrQkFBYy9XLElBQUl0QyxHQUFsQjtBQUZEO0FBSUNnUCxhQUFTLGtCQUFUO0FBQ0FxSyxrQkFBY3JQLElBQUl1UCxNQUFKLENBQVdGLFdBQXpCO0FDS0M7O0FESEYsTUFBRyxDQUFDQSxXQUFKO0FBQ0NwUCxRQUFJdVAsU0FBSixDQUFjLEdBQWQ7QUFDQXZQLFFBQUl3UCxHQUFKO0FBQ0E7QUNLQzs7QURIRnJmLFlBQVUsSUFBSXlDLE9BQUosQ0FBYW1OLEdBQWIsRUFBa0JDLEdBQWxCLENBQVY7O0FBWUEsTUFBRyxDQUFDM0ssTUFBRCxJQUFZLENBQUNzQyxTQUFoQjtBQUNDdEMsYUFBUzBLLElBQUlNLEtBQUosQ0FBVSxXQUFWLENBQVQ7QUFDQTFJLGdCQUFZb0ksSUFBSU0sS0FBSixDQUFVLGNBQVYsQ0FBWjtBQ05DOztBRFFGLE1BQUdoTCxVQUFXc0MsU0FBZDtBQUNDaUosa0JBQWM5SSxTQUFTK0ksZUFBVCxDQUF5QmxKLFNBQXpCLENBQWQ7QUFDQXZDLFdBQU8vRSxPQUFPaVEsS0FBUCxDQUFhbkwsT0FBYixDQUNOO0FBQUFnRixXQUFLOUUsTUFBTDtBQUNBLGlEQUEyQ3VMO0FBRDNDLEtBRE0sQ0FBUDs7QUFHQSxRQUFHeEwsSUFBSDtBQUNDbUwsbUJBQWFuTCxLQUFLbUwsVUFBbEI7O0FBQ0EsVUFBR2xJLElBQUkwTSxNQUFQO0FBQ0NoRSxhQUFLMUksSUFBSTBNLE1BQVQ7QUFERDtBQUdDaEUsYUFBSyxrQkFBTDtBQ0xHOztBRE1KK0QsWUFBTUcsU0FBUyxJQUFJL0osSUFBSixHQUFXeUksT0FBWCxLQUFxQixJQUE5QixFQUFvQ2pRLFFBQXBDLEVBQU47QUFDQXlOLGNBQVEsRUFBUjtBQUNBQyxZQUFNYixXQUFXdk8sTUFBakI7O0FBQ0EsVUFBR29QLE1BQU0sRUFBVDtBQUNDSixZQUFJLEVBQUo7QUFDQXRCLFlBQUksQ0FBSjtBQUNBak8sWUFBSSxLQUFLMlAsR0FBVDs7QUFDQSxlQUFNMUIsSUFBSWpPLENBQVY7QUFDQ3VQLGNBQUksTUFBTUEsQ0FBVjtBQUNBdEI7QUFGRDs7QUFHQXlCLGdCQUFRWixhQUFhUyxDQUFyQjtBQVBELGFBUUssSUFBR0ksT0FBTyxFQUFWO0FBQ0pELGdCQUFRWixXQUFXeE8sS0FBWCxDQUFpQixDQUFqQixFQUFtQixFQUFuQixDQUFSO0FDSEc7O0FES0o0UCxlQUFTOU8sT0FBT2dQLGNBQVAsQ0FBc0IsYUFBdEIsRUFBcUMsSUFBSVAsTUFBSixDQUFXSCxLQUFYLEVBQWtCLE1BQWxCLENBQXJDLEVBQWdFLElBQUlHLE1BQUosQ0FBV1AsRUFBWCxFQUFlLE1BQWYsQ0FBaEUsQ0FBVDtBQUVBYSxvQkFBY04sT0FBT0MsTUFBUCxDQUFjLENBQUNJLE9BQU9ILE1BQVAsQ0FBYyxJQUFJRixNQUFKLENBQVd3RCxHQUFYLEVBQWdCLE1BQWhCLENBQWQsQ0FBRCxFQUF5Q25ELE9BQU9GLEtBQVAsRUFBekMsQ0FBZCxDQUFkO0FBRUF1RCxzQkFBZ0JwRCxZQUFZbE8sUUFBWixDQUFxQixRQUFyQixDQUFoQjtBQUdBc2IsZUFBUyxVQUFUO0FBQ0FHLGFBQU8sRUFBUDtBQUNBL04sWUFBTWIsV0FBV3ZPLE1BQWpCOztBQUNBLFVBQUdvUCxNQUFNLENBQVQ7QUFDQ0osWUFBSSxFQUFKO0FBQ0F0QixZQUFJLENBQUo7QUFDQWpPLFlBQUksSUFBSTJQLEdBQVI7O0FBQ0EsZUFBTTFCLElBQUlqTyxDQUFWO0FBQ0N1UCxjQUFJLE1BQU1BLENBQVY7QUFDQXRCO0FBRkQ7O0FBR0F5UCxlQUFPNU8sYUFBYVMsQ0FBcEI7QUFQRCxhQVFLLElBQUdJLE9BQU8sQ0FBVjtBQUNKK04sZUFBTzVPLFdBQVd4TyxLQUFYLENBQWlCLENBQWpCLEVBQW1CLENBQW5CLENBQVA7QUNORzs7QURPSitjLG1CQUFhamMsT0FBT2dQLGNBQVAsQ0FBc0IsU0FBdEIsRUFBaUMsSUFBSVAsTUFBSixDQUFXNk4sSUFBWCxFQUFpQixNQUFqQixDQUFqQyxFQUEyRCxJQUFJN04sTUFBSixDQUFXME4sTUFBWCxFQUFtQixNQUFuQixDQUEzRCxDQUFiO0FBQ0FELHdCQUFrQnpOLE9BQU9DLE1BQVAsQ0FBYyxDQUFDdU4sV0FBV3ROLE1BQVgsQ0FBa0IsSUFBSUYsTUFBSixDQUFXd0QsR0FBWCxFQUFnQixNQUFoQixDQUFsQixDQUFELEVBQTZDZ0ssV0FBV3JOLEtBQVgsRUFBN0MsQ0FBZCxDQUFsQjtBQUNBd04sMEJBQW9CRixnQkFBZ0JyYixRQUFoQixDQUF5QixRQUF6QixDQUFwQjtBQUVBd2IsZUFBUyxHQUFUOztBQUVBLFVBQUdFLFlBQVlwWCxPQUFaLENBQW9CLEdBQXBCLElBQTJCLENBQUMsQ0FBL0I7QUFDQ2tYLGlCQUFTLEdBQVQ7QUNQRzs7QURTSkcsa0JBQVlELGNBQWNGLE1BQWQsR0FBdUIsWUFBdkIsR0FBc0M3WixNQUF0QyxHQUErQyxnQkFBL0MsR0FBa0VzQyxTQUFsRSxHQUE4RSxvQkFBOUUsR0FBcUc0SSxVQUFyRyxHQUFrSCx1QkFBbEgsR0FBNEl5RSxhQUE1SSxHQUE0SixxQkFBNUosR0FBb0xpSyxpQkFBaE07O0FBRUEsVUFBRzdaLEtBQUtnTCxRQUFSO0FBQ0NpUCxxQkFBYSx5QkFBdUJJLFVBQVVyYSxLQUFLZ0wsUUFBZixDQUFwQztBQ1JHOztBRFNKSixVQUFJMFAsU0FBSixDQUFjLFVBQWQsRUFBMEJMLFNBQTFCO0FBQ0FyUCxVQUFJdVAsU0FBSixDQUFjLEdBQWQ7QUFDQXZQLFVBQUl3UCxHQUFKO0FBQ0E7QUE3REY7QUN1REU7O0FEUUZ4UCxNQUFJdVAsU0FBSixDQUFjLEdBQWQ7QUFDQXZQLE1BQUl3UCxHQUFKO0FBL0ZELEc7Ozs7Ozs7Ozs7OztBRUpBbmYsT0FBTytXLE9BQVAsQ0FBZTtBQ0NiLFNEQ0QzRSxXQUFXd0gsR0FBWCxDQUFlLEtBQWYsRUFBc0IsaUJBQXRCLEVBQXlDLFVBQUNsSyxHQUFELEVBQU1DLEdBQU4sRUFBVzZELElBQVg7QUFHeEMsUUFBQWlJLEtBQUEsRUFBQTZELFdBQUEsRUFBQUMsTUFBQSxFQUFBQyxRQUFBLEVBQUFwVSxNQUFBLEVBQUFxVSxRQUFBLEVBQUFDLFFBQUEsRUFBQTdjLEdBQUEsRUFBQUMsSUFBQSxFQUFBMkMsSUFBQSxFQUFBa2EsaUJBQUEsRUFBQUMsR0FBQSxFQUFBN2EsSUFBQSxFQUFBZ0wsUUFBQSxFQUFBOFAsY0FBQSxFQUFBQyxLQUFBO0FBQUFBLFlBQVEsRUFBUjtBQUNBMVUsYUFBUyxFQUFUO0FBQ0FvVSxlQUFXLEVBQVg7O0FBQ0EsUUFBRzlQLElBQUlNLEtBQUosQ0FBVStQLENBQWI7QUFDSUQsY0FBUXBRLElBQUlNLEtBQUosQ0FBVStQLENBQWxCO0FDREQ7O0FERUgsUUFBR3JRLElBQUlNLEtBQUosQ0FBVWxPLENBQWI7QUFDSXNKLGVBQVNzRSxJQUFJTSxLQUFKLENBQVVsTyxDQUFuQjtBQ0FEOztBRENILFFBQUc0TixJQUFJTSxLQUFKLENBQVVnUSxFQUFiO0FBQ1VSLGlCQUFXOVAsSUFBSU0sS0FBSixDQUFVZ1EsRUFBckI7QUNDUDs7QURDSGpiLFdBQU9yQyxHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQjRLLElBQUl1UCxNQUFKLENBQVdqYSxNQUE1QixDQUFQOztBQUNBLFFBQUcsQ0FBQ0QsSUFBSjtBQUNDNEssVUFBSXVQLFNBQUosQ0FBYyxHQUFkO0FBQ0F2UCxVQUFJd1AsR0FBSjtBQUNBO0FDQ0U7O0FEQ0gsUUFBR3BhLEtBQUtPLE1BQVI7QUFDQ3FLLFVBQUkwUCxTQUFKLENBQWMsVUFBZCxFQUEwQjllLFFBQVF5RixXQUFSLENBQW9CLHVCQUF1QmpCLEtBQUtPLE1BQWhELENBQTFCO0FBQ0FxSyxVQUFJdVAsU0FBSixDQUFjLEdBQWQ7QUFDQXZQLFVBQUl3UCxHQUFKO0FBQ0E7QUNDRTs7QURDSCxTQUFBdGMsTUFBQWtDLEtBQUF5VSxPQUFBLFlBQUEzVyxJQUFpQnlDLE1BQWpCLEdBQWlCLE1BQWpCO0FBQ0NxSyxVQUFJMFAsU0FBSixDQUFjLFVBQWQsRUFBMEJ0YSxLQUFLeVUsT0FBTCxDQUFhbFUsTUFBdkM7QUFDQXFLLFVBQUl1UCxTQUFKLENBQWMsR0FBZDtBQUNBdlAsVUFBSXdQLEdBQUo7QUFDQTtBQ0NFOztBRENILFFBQUdwYSxLQUFLUSxTQUFSO0FBQ0NvSyxVQUFJMFAsU0FBSixDQUFjLFVBQWQsRUFBMEJ0YSxLQUFLUSxTQUEvQjtBQUNBb0ssVUFBSXVQLFNBQUosQ0FBYyxHQUFkO0FBQ0F2UCxVQUFJd1AsR0FBSjtBQUNBO0FDQ0U7O0FEQ0gsUUFBTyxPQUFBYyxJQUFBLG9CQUFBQSxTQUFBLElBQVA7QUFDQ3RRLFVBQUkwUCxTQUFKLENBQWMscUJBQWQsRUFBcUMsUUFBckM7QUFDQTFQLFVBQUkwUCxTQUFKLENBQWMsY0FBZCxFQUE4QixlQUE5QjtBQUNBMVAsVUFBSTBQLFNBQUosQ0FBYyxlQUFkLEVBQStCLDBCQUEvQjtBQUNBTyxZQUFNLGk4QkFBTjtBQXNCQWpRLFVBQUl1USxLQUFKLENBQVVOLEdBQVY7QUFHQWpRLFVBQUl3UCxHQUFKO0FBQ0E7QUN0QkU7O0FEd0JIcFAsZUFBV2hMLEtBQUtqRSxJQUFoQjs7QUFDQSxRQUFHLENBQUNpUCxRQUFKO0FBQ0NBLGlCQUFXLEVBQVg7QUN0QkU7O0FEd0JISixRQUFJMFAsU0FBSixDQUFjLHFCQUFkLEVBQXFDLFFBQXJDOztBQUVBLFFBQU8sT0FBQVksSUFBQSxvQkFBQUEsU0FBQSxJQUFQO0FBQ0N0USxVQUFJMFAsU0FBSixDQUFjLGNBQWQsRUFBOEIsZUFBOUI7QUFDQTFQLFVBQUkwUCxTQUFKLENBQWMsZUFBZCxFQUErQiwwQkFBL0I7QUFFQUUsZUFBUyxDQUFDLFNBQUQsRUFBVyxTQUFYLEVBQXFCLFNBQXJCLEVBQStCLFNBQS9CLEVBQXlDLFNBQXpDLEVBQW1ELFNBQW5ELEVBQTZELFNBQTdELEVBQXVFLFNBQXZFLEVBQWlGLFNBQWpGLEVBQTJGLFNBQTNGLEVBQXFHLFNBQXJHLEVBQStHLFNBQS9HLEVBQXlILFNBQXpILEVBQW1JLFNBQW5JLEVBQTZJLFNBQTdJLEVBQXVKLFNBQXZKLEVBQWlLLFNBQWpLLEVBQTJLLFNBQTNLLENBQVQ7QUFFQU0sdUJBQWlCMWYsTUFBTW9CLElBQU4sQ0FBV3dPLFFBQVgsQ0FBakI7QUFDQXVQLG9CQUFjLENBQWQ7O0FBQ0FqUyxRQUFFcEMsSUFBRixDQUFPNFUsY0FBUCxFQUF1QixVQUFDTSxJQUFEO0FDekJsQixlRDBCSmIsZUFBZWEsS0FBS0MsVUFBTCxDQUFnQixDQUFoQixDQzFCWDtBRHlCTDs7QUFHQVYsaUJBQVdKLGNBQWNDLE9BQU81ZCxNQUFoQztBQUNBOFosY0FBUThELE9BQU9HLFFBQVAsQ0FBUjtBQUdBRCxpQkFBVyxFQUFYOztBQUNBLFVBQUcxUCxTQUFTcVEsVUFBVCxDQUFvQixDQUFwQixJQUF1QixHQUExQjtBQUNDWCxtQkFBVzFQLFNBQVNzUSxNQUFULENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQVg7QUFERDtBQUdDWixtQkFBVzFQLFNBQVNzUSxNQUFULENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQVg7QUMzQkc7O0FENkJKWixpQkFBV0EsU0FBU2EsV0FBVCxFQUFYO0FBRUFWLFlBQU0sNklBRWlFRSxLQUZqRSxHQUV1RSxjQUZ2RSxHQUVtRjFVLE1BRm5GLEdBRTBGLG9CQUYxRixHQUU0RzBVLEtBRjVHLEdBRWtILGNBRmxILEdBRWdJMVUsTUFGaEksR0FFdUksd0JBRnZJLEdBRStKcVEsS0FGL0osR0FFcUssbVBBRnJLLEdBR3dOK0QsUUFIeE4sR0FHaU8sWUFIak8sR0FJRkMsUUFKRSxHQUlPLG9CQUpiO0FBU0E5UCxVQUFJdVEsS0FBSixDQUFVTixHQUFWO0FBQ0FqUSxVQUFJd1AsR0FBSjtBQUNBO0FDcENFOztBRHNDSFEsd0JBQW9CalEsSUFBSVksT0FBSixDQUFZLG1CQUFaLENBQXBCOztBQUNBLFFBQUdxUCxxQkFBQSxJQUFIO0FBQ0MsVUFBR0EsdUJBQUEsQ0FBQTdjLE9BQUFpQyxLQUFBc1IsUUFBQSxZQUFBdlQsS0FBb0N5ZCxXQUFwQyxLQUFxQixNQUFyQixDQUFIO0FBQ0M1USxZQUFJMFAsU0FBSixDQUFjLGVBQWQsRUFBK0JNLGlCQUEvQjtBQUNBaFEsWUFBSXVQLFNBQUosQ0FBYyxHQUFkO0FBQ0F2UCxZQUFJd1AsR0FBSjtBQUNBO0FBTEY7QUM5Qkc7O0FEcUNIeFAsUUFBSTBQLFNBQUosQ0FBYyxlQUFkLElBQUE1WixPQUFBVixLQUFBc1IsUUFBQSxZQUFBNVEsS0FBOEM4YSxXQUE5QyxLQUErQixNQUEvQixLQUErRCxJQUFJMVYsSUFBSixHQUFXMFYsV0FBWCxFQUEvRDtBQUNBNVEsUUFBSTBQLFNBQUosQ0FBYyxjQUFkLEVBQThCLFlBQTlCO0FBQ0ExUCxRQUFJMFAsU0FBSixDQUFjLGdCQUFkLEVBQWdDWSxLQUFLdGUsTUFBckM7QUFFQXNlLFNBQUtPLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCOVEsR0FBckI7QUEzSEQsSUNEQztBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBM1AsT0FBTytXLE9BQVAsQ0FBZTtBQ0NiLFNEQUQzRSxXQUFXd0gsR0FBWCxDQUFlLEtBQWYsRUFBc0IsbUJBQXRCLEVBQTJDLFVBQUNsSyxHQUFELEVBQU1DLEdBQU4sRUFBVzZELElBQVg7QUFFMUMsUUFBQTlCLFlBQUEsRUFBQTdPLEdBQUE7QUFBQTZPLG1CQUFBLENBQUE3TyxNQUFBNk0sSUFBQU0sS0FBQSxZQUFBbk4sSUFBMEI2TyxZQUExQixHQUEwQixNQUExQjs7QUFFQSxRQUFHblIsUUFBUWtSLHdCQUFSLENBQWlDQyxZQUFqQyxDQUFIO0FBQ0MvQixVQUFJdVAsU0FBSixDQUFjLEdBQWQ7QUFDQXZQLFVBQUl3UCxHQUFKO0FBRkQ7QUFLQ3hQLFVBQUl1UCxTQUFKLENBQWMsR0FBZDtBQUNBdlAsVUFBSXdQLEdBQUo7QUNERTtBRFRKLElDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQSxJQUFHbmYsT0FBT3NPLFFBQVY7QUFDSXRPLFNBQU8wZ0IsT0FBUCxDQUFlLE1BQWYsRUFBdUIsVUFBQ3BXLE9BQUQ7QUFDbkIsUUFBQTBRLFFBQUE7O0FBQUEsU0FBTyxLQUFLaFcsTUFBWjtBQUNJLGFBQU8sS0FBSzJiLEtBQUwsRUFBUDtBQ0VQOztBRENHM0YsZUFBVztBQUFDdlEsYUFBTztBQUFDeVQsaUJBQVM7QUFBVjtBQUFSLEtBQVg7O0FBQ0EsUUFBRzVULE9BQUg7QUFDSTBRLGlCQUFXO0FBQUNpRCxhQUFLLENBQUM7QUFBQ3hULGlCQUFPO0FBQUN5VCxxQkFBUztBQUFWO0FBQVIsU0FBRCxFQUE0QjtBQUFDelQsaUJBQU9IO0FBQVIsU0FBNUI7QUFBTixPQUFYO0FDZVA7O0FEYkcsV0FBTzVILEdBQUd1RixJQUFILENBQVFzRixJQUFSLENBQWF5TixRQUFiLEVBQXVCO0FBQUN4YSxZQUFNO0FBQUNBLGNBQU07QUFBUDtBQUFQLEtBQXZCLENBQVA7QUFUSjtBQzZCSCxDOzs7Ozs7Ozs7Ozs7QUMxQkFSLE9BQU8wZ0IsT0FBUCxDQUFlLFdBQWYsRUFBNEI7QUFDM0IsTUFBQUUsTUFBQSxFQUFBQyxPQUFBLEVBQUFDLGFBQUEsRUFBQUMsSUFBQSxFQUFBQyxHQUFBLEVBQUFDLFVBQUE7O0FBQUEsT0FBTyxLQUFLamMsTUFBWjtBQUNDLFdBQU8sS0FBSzJiLEtBQUwsRUFBUDtBQ0ZBOztBREtESSxTQUFPLElBQVA7QUFDQUUsZUFBYSxFQUFiO0FBQ0FELFFBQU10ZSxHQUFHeUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUN4SSxVQUFNLEtBQUtDLE1BQVo7QUFBb0JrYyxtQkFBZTtBQUFuQyxHQUFwQixFQUE4RDtBQUFDOVQsWUFBUTtBQUFDM0MsYUFBTTtBQUFQO0FBQVQsR0FBOUQsQ0FBTjtBQUNBdVcsTUFBSTlmLE9BQUosQ0FBWSxVQUFDaWdCLEVBQUQ7QUNJVixXREhERixXQUFXNWYsSUFBWCxDQUFnQjhmLEdBQUcxVyxLQUFuQixDQ0dDO0FESkY7QUFHQW9XLFlBQVUsSUFBVjtBQUdBRCxXQUFTbGUsR0FBR3lLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDeEksVUFBTSxLQUFLQyxNQUFaO0FBQW9Ca2MsbUJBQWU7QUFBbkMsR0FBcEIsRUFBOERFLE9BQTlELENBQ1I7QUFBQUMsV0FBTyxVQUFDQyxHQUFEO0FBQ04sVUFBR0EsSUFBSTdXLEtBQVA7QUFDQyxZQUFHd1csV0FBV3RaLE9BQVgsQ0FBbUIyWixJQUFJN1csS0FBdkIsSUFBZ0MsQ0FBbkM7QUFDQ3dXLHFCQUFXNWYsSUFBWCxDQUFnQmlnQixJQUFJN1csS0FBcEI7QUNLSSxpQkRKSnFXLGVDSUk7QURQTjtBQ1NHO0FEVko7QUFLQVMsYUFBUyxVQUFDQyxNQUFEO0FBQ1IsVUFBR0EsT0FBTy9XLEtBQVY7QUFDQ3NXLGFBQUtRLE9BQUwsQ0FBYSxRQUFiLEVBQXVCQyxPQUFPL1csS0FBOUI7QUNRRyxlRFBId1csYUFBYTVULEVBQUVvVSxPQUFGLENBQVVSLFVBQVYsRUFBc0JPLE9BQU8vVyxLQUE3QixDQ09WO0FBQ0Q7QURoQko7QUFBQSxHQURRLENBQVQ7O0FBV0FxVyxrQkFBZ0I7QUFDZixRQUFHRCxPQUFIO0FBQ0NBLGNBQVFhLElBQVI7QUNVQzs7QUFDRCxXRFZEYixVQUFVbmUsR0FBR2lJLE1BQUgsQ0FBVTRDLElBQVYsQ0FBZTtBQUFDekQsV0FBSztBQUFDMEQsYUFBS3lUO0FBQU47QUFBTixLQUFmLEVBQXlDRyxPQUF6QyxDQUNUO0FBQUFDLGFBQU8sVUFBQ0MsR0FBRDtBQUNOUCxhQUFLTSxLQUFMLENBQVcsUUFBWCxFQUFxQkMsSUFBSXhYLEdBQXpCLEVBQThCd1gsR0FBOUI7QUNlRyxlRGRITCxXQUFXNWYsSUFBWCxDQUFnQmlnQixJQUFJeFgsR0FBcEIsQ0NjRztBRGhCSjtBQUdBNlgsZUFBUyxVQUFDQyxNQUFELEVBQVNKLE1BQVQ7QUNnQkwsZURmSFQsS0FBS1ksT0FBTCxDQUFhLFFBQWIsRUFBdUJDLE9BQU85WCxHQUE5QixFQUFtQzhYLE1BQW5DLENDZUc7QURuQko7QUFLQUwsZUFBUyxVQUFDQyxNQUFEO0FBQ1JULGFBQUtRLE9BQUwsQ0FBYSxRQUFiLEVBQXVCQyxPQUFPMVgsR0FBOUI7QUNpQkcsZURoQkhtWCxhQUFhNVQsRUFBRW9VLE9BQUYsQ0FBVVIsVUFBVixFQUFzQk8sT0FBTzFYLEdBQTdCLENDZ0JWO0FEdkJKO0FBQUEsS0FEUyxDQ1VUO0FEYmMsR0FBaEI7O0FBYUFnWDtBQUVBQyxPQUFLSixLQUFMO0FDa0JBLFNEaEJBSSxLQUFLYyxNQUFMLENBQVk7QUFDWGpCLFdBQU9jLElBQVA7O0FBQ0EsUUFBR2IsT0FBSDtBQ2lCRyxhRGhCRkEsUUFBUWEsSUFBUixFQ2dCRTtBQUNEO0FEcEJILElDZ0JBO0FEMURELEc7Ozs7Ozs7Ozs7OztBRUhEMWhCLE9BQU8wZ0IsT0FBUCxDQUFlLGNBQWYsRUFBK0IsVUFBQ3BXLE9BQUQ7QUFDOUIsT0FBT0EsT0FBUDtBQUNDLFdBQU8sS0FBS3FXLEtBQUwsRUFBUDtBQ0FDOztBREVGLFNBQU9qZSxHQUFHaUksTUFBSCxDQUFVNEMsSUFBVixDQUFlO0FBQUN6RCxTQUFLUTtBQUFOLEdBQWYsRUFBK0I7QUFBQzhDLFlBQVE7QUFBQzlILGNBQVEsQ0FBVDtBQUFXeEUsWUFBTSxDQUFqQjtBQUFtQmdoQix1QkFBZ0I7QUFBbkM7QUFBVCxHQUEvQixDQUFQO0FBSkQsRzs7Ozs7Ozs7Ozs7O0FFREE5aEIsT0FBTzBnQixPQUFQLENBQWUsU0FBZixFQUEwQjtBQUN6QixPQUFPLEtBQUsxYixNQUFaO0FBQ0MsV0FBTyxLQUFLMmIsS0FBTCxFQUFQO0FDQ0M7O0FEQ0YsU0FBT2plLEdBQUdpTSxPQUFILENBQVdwQixJQUFYLEVBQVA7QUFKRCxHOzs7Ozs7Ozs7Ozs7QUVBQXZOLE9BQU8wZ0IsT0FBUCxDQUFlLDZCQUFmLEVBQThDLFVBQUM1VyxHQUFEO0FBQzdDLE9BQU8sS0FBSzlFLE1BQVo7QUFDQyxXQUFPLEtBQUsyYixLQUFMLEVBQVA7QUNDQzs7QURDRixPQUFPN1csR0FBUDtBQUNDLFdBQU8sS0FBSzZXLEtBQUwsRUFBUDtBQ0NDOztBRENGLFNBQU9qZSxHQUFHNFksbUJBQUgsQ0FBdUIvTixJQUF2QixDQUE0QjtBQUFDekQsU0FBS0E7QUFBTixHQUE1QixDQUFQO0FBUEQsRzs7Ozs7Ozs7Ozs7O0FFQUEsSUFBQWlZLFVBQUEsRUFBQUMsS0FBQSxFQUFBQywyQkFBQSxFQUFBQyxXQUFBLEVBQUFDLFdBQUEsRUFBQUMsV0FBQTs7QUFBQUYsY0FBY3JaLFFBQVEsZUFBUixDQUFkO0FBQ0F1WixjQUFjdlosUUFBUSxlQUFSLENBQWQ7QUFDQXNaLGNBQWN0WixRQUFRLGVBQVIsQ0FBZDtBQUNBbVosUUFBUW5aLFFBQVEsT0FBUixDQUFSOztBQUVBa1osYUFBYSxVQUFDaGQsSUFBRDtBQUNaLE1BQUF6RSxNQUFBLEVBQUF1QyxHQUFBLEVBQUFDLElBQUE7O0FBQUEsT0FBQWlDLFFBQUEsUUFBQWxDLE1BQUFrQyxLQUFBekUsTUFBQSxZQUFBdUMsSUFBaUJ3ZixpQkFBakIsS0FBRyxNQUFILEdBQUcsTUFBSCxNQUF3QyxPQUF4QztBQUNDL2hCLGFBQVMsT0FBVDtBQURELFNBRUssS0FBQXlFLFFBQUEsUUFBQWpDLE9BQUFpQyxLQUFBekUsTUFBQSxZQUFBd0MsS0FBaUJ1ZixpQkFBakIsS0FBRyxNQUFILEdBQUcsTUFBSCxNQUF3QyxPQUF4QztBQUNKL2hCLGFBQVMsSUFBVDtBQURJO0FBR0pBLGFBQVMsT0FBVDtBQ09DOztBRE5GLFNBQU9BLE1BQVA7QUFQWSxDQUFiOztBQVNBMmhCLDhCQUE4QixVQUFDamQsTUFBRCxFQUFTc0YsT0FBVDtBQUM3QixNQUFBekgsR0FBQSxFQUFBeWYsU0FBQTtBQUFBQSxjQUFZMU0sUUFBUXNILGFBQVIsQ0FBc0IsYUFBdEIsRUFBcUNwWSxPQUFyQyxDQUE2QztBQUFDMkYsV0FBT0gsT0FBUjtBQUFpQnZGLFVBQU1DO0FBQXZCLEdBQTdDLEVBQTZFO0FBQUNvSSxZQUFRO0FBQUNvTSxlQUFTO0FBQVY7QUFBVCxHQUE3RSxDQUFaOztBQUNBLE1BQUc4SSxhQUFhQSxVQUFVOUksT0FBMUI7QUFDQyxZQUFBM1csTUFBQStTLFFBQUFzSCxhQUFBLDhCQUFBcmEsSUFBZ0QwSyxJQUFoRCxDQUFxRDtBQUFDOUMsYUFBT0gsT0FBUjtBQUFpQmlZLGdCQUFVRCxVQUFVOUk7QUFBckMsS0FBckQsRUFBb0cvTCxLQUFwRyxLQUFPLE1BQVA7QUNvQkM7QUR2QjJCLENBQTlCOztBQU1BMkUsV0FBV3dILEdBQVgsQ0FBZSxLQUFmLEVBQXNCLDBCQUF0QixFQUFpRCxVQUFDbEssR0FBRCxFQUFNQyxHQUFOLEVBQVc2RCxJQUFYO0FBQ2hELE1BQUFnUCxLQUFBLEVBQUFDLFdBQUEsRUFBQUMsY0FBQSxFQUFBcGIsU0FBQSxFQUFBcWIsR0FBQSxFQUFBQyxhQUFBLEVBQUFDLFdBQUEsRUFBQWhnQixHQUFBLEVBQUFpTixNQUFBLEVBQUFyRixLQUFBLEVBQUFILE9BQUEsRUFBQXRGLE1BQUEsRUFBQThkLFdBQUE7O0FBQUE5ZCxXQUFTMEssSUFBSVksT0FBSixDQUFZLFdBQVosQ0FBVDtBQUNBaEcsWUFBVW9GLElBQUlZLE9BQUosQ0FBWSxZQUFaLE9BQUF6TixNQUFBNk0sSUFBQXVQLE1BQUEsWUFBQXBjLElBQXlDeUgsT0FBekMsR0FBeUMsTUFBekMsQ0FBVjs7QUFDQSxNQUFHLENBQUN0RixNQUFKO0FBQ0NvTixlQUFXQyxVQUFYLENBQXNCMUMsR0FBdEIsRUFDQztBQUFBNEMsWUFBTSxHQUFOO0FBQ0FELFlBQU07QUFETixLQUREO0FBR0E7QUN1QkM7O0FEckJGaEwsY0FBWS9HLFFBQVFtVyxZQUFSLENBQXFCaEgsR0FBckIsRUFBMEJDLEdBQTFCLENBQVo7QUFDQW1ULGdCQUFjOWlCLE9BQU8raUIsU0FBUCxDQUFpQixVQUFDemIsU0FBRCxFQUFZZ0QsT0FBWixFQUFxQjBZLEVBQXJCO0FDdUI1QixXRHRCRGQsWUFBWWUsVUFBWixDQUF1QjNiLFNBQXZCLEVBQWtDZ0QsT0FBbEMsRUFBMkM0WSxJQUEzQyxDQUFnRCxVQUFDQyxPQUFELEVBQVVDLE1BQVY7QUN1QjdDLGFEdEJGSixHQUFHSSxNQUFILEVBQVdELE9BQVgsQ0NzQkU7QUR2QkgsTUNzQkM7QUR2QlcsS0FHWDdiLFNBSFcsRUFHQWdELE9BSEEsQ0FBZDs7QUFLQSxPQUFPd1ksV0FBUDtBQUNDMVEsZUFBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTRDLFlBQU0sR0FBTjtBQUNBRCxZQUFNO0FBRE4sS0FERDtBQUdBO0FDd0JDOztBRHRCRjdILFVBQVFtTCxRQUFRSSxXQUFSLENBQW9CLFFBQXBCLEVBQThCbFIsT0FBOUIsQ0FBc0M7QUFBQ2dGLFNBQUtRO0FBQU4sR0FBdEMsRUFBc0Q7QUFBQzhDLFlBQVE7QUFBQ3RNLFlBQU07QUFBUDtBQUFULEdBQXRELENBQVI7QUFFQWdQLFdBQVM4RixRQUFReU4saUJBQVIsQ0FBMEIvWSxPQUExQixFQUFtQ3RGLE1BQW5DLENBQVQ7QUFFQTJkLFFBQU1aLFdBQVdyZixHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQkUsTUFBakIsRUFBeUI7QUFBQ29JLFlBQVE7QUFBQzlNLGNBQVE7QUFBVDtBQUFULEdBQXpCLENBQVgsQ0FBTjtBQUNBOGhCLGNBQVlrQixrQkFBWixDQUErQlgsR0FBL0IsRUFBb0M3UyxPQUFPK00sT0FBM0M7QUFFQS9NLFNBQU8vSyxJQUFQLEdBQWMrZCxXQUFkO0FBQ0FoVCxTQUFPckYsS0FBUCxHQUFlQSxLQUFmO0FBQ0FxRixTQUFPN0gsSUFBUCxHQUFjK1osTUFBTXBNLFFBQVEyTixJQUFkLENBQWQ7QUFDQXpULFNBQU8wVCxVQUFQLEdBQW9CeEIsTUFBTXBNLFFBQVE2TixVQUFkLENBQXBCO0FBQ0EzVCxTQUFPNFQsZ0JBQVAsR0FBMEI5TixRQUFRZ0gsdUJBQVIsQ0FBZ0M1WCxNQUFoQyxFQUF3Q3NGLE9BQXhDLEVBQWlEd0YsT0FBTytNLE9BQXhELENBQTFCO0FBQ0EvTSxTQUFPNlQsZ0JBQVAsR0FBMEIzakIsT0FBTzZTLElBQVAsQ0FBWSxzQkFBWixFQUFvQ3ZJLE9BQXBDLEVBQTZDdEYsTUFBN0MsQ0FBMUI7QUFFQTZkLGdCQUFjN2lCLE9BQU8raUIsU0FBUCxDQUFpQixVQUFDbGpCLENBQUQsRUFBSWlqQixXQUFKLEVBQWlCRSxFQUFqQjtBQzhCNUIsV0Q3QkZuakIsRUFBRStqQix1QkFBRixDQUEwQmQsV0FBMUIsRUFBdUNJLElBQXZDLENBQTRDLFVBQUNDLE9BQUQsRUFBVUMsTUFBVjtBQzhCeEMsYUQ3QkhKLEdBQUdJLE1BQUgsRUFBV0QsT0FBWCxDQzZCRztBRDlCSixNQzZCRTtBRDlCVyxJQUFkOztBQUlBOVYsSUFBRXBDLElBQUYsQ0FBTzJLLFFBQVFpTyxhQUFSLENBQXNCQyxjQUF0QixFQUFQLEVBQStDLFVBQUNDLFVBQUQsRUFBYWpqQixJQUFiO0FBQzlDLFFBQUFrakIsaUJBQUE7O0FBQUEsUUFBR2xqQixTQUFRLFNBQVg7QUFDQ2tqQiwwQkFBb0JELFdBQVdFLFVBQVgsRUFBcEI7QUNnQ0csYUQvQkg1VyxFQUFFcEMsSUFBRixDQUFPK1ksaUJBQVAsRUFBMEIsVUFBQ25rQixDQUFELEVBQUlvQixDQUFKO0FBQ3pCLFlBQUFpakIsSUFBQTs7QUFBQUEsZUFBT3RPLFFBQVF1TyxhQUFSLENBQXNCbkMsTUFBTW5pQixFQUFFdWtCLFFBQUYsRUFBTixDQUF0QixFQUEyQzlaLE9BQTNDLENBQVA7QUFFQTRaLGFBQUtwakIsSUFBTCxHQUFZRyxDQUFaO0FBQ0FpakIsYUFBS0csYUFBTCxHQUFxQnZqQixJQUFyQjtBQUNBb2pCLGFBQUtyQixXQUFMLEdBQW1CQSxZQUFZaGpCLENBQVosRUFBZWlqQixXQUFmLENBQW5CO0FDZ0NJLGVEL0JKaFQsT0FBTytNLE9BQVAsQ0FBZXFILEtBQUtwakIsSUFBcEIsSUFBNEJvakIsSUMrQnhCO0FEckNMLFFDK0JHO0FBUUQ7QUQxQ0o7O0FBV0E3VyxJQUFFcEMsSUFBRixDQUFPMkssUUFBUWlPLGFBQVIsQ0FBc0JDLGNBQXRCLEVBQVAsRUFBK0MsVUFBQ0MsVUFBRCxFQUFhampCLElBQWI7QUFDOUNnUCxXQUFPN0gsSUFBUCxHQUFjb0YsRUFBRWlILE1BQUYsQ0FBU3hFLE9BQU83SCxJQUFoQixFQUFzQitaLE1BQU0rQixXQUFXTyxhQUFYLEVBQU4sQ0FBdEIsQ0FBZDtBQ2tDRSxXRGpDRnhVLE9BQU8wVCxVQUFQLEdBQW9CblcsRUFBRWlILE1BQUYsQ0FBU3hFLE9BQU8wVCxVQUFoQixFQUE0Qk8sV0FBV1EsbUJBQVgsRUFBNUIsQ0NpQ2xCO0FEbkNIOztBQUdBelUsU0FBTzdILElBQVAsR0FBY29GLEVBQUVpSCxNQUFGLENBQVV4RSxPQUFPN0gsSUFBUCxJQUFlLEVBQXpCLEVBQTZCMk4sUUFBUUMsU0FBUixDQUFrQnZMLE9BQWxCLENBQTdCLENBQWQ7QUFDQXdGLFNBQU8wVCxVQUFQLEdBQW9CblcsRUFBRWlILE1BQUYsQ0FBVXhFLE9BQU8wVCxVQUFQLElBQXFCLEVBQS9CLEVBQW1DNU4sUUFBUVcsZUFBUixDQUF3QmpNLE9BQXhCLENBQW5DLENBQXBCO0FBRUFrWSxVQUFRLEVBQVI7O0FBQ0FuVixJQUFFcEMsSUFBRixDQUFPNkUsT0FBTzdILElBQWQsRUFBb0IsVUFBQ0QsR0FBRCxFQUFNL0MsR0FBTjtBQUNuQixRQUFHLENBQUMrQyxJQUFJOEIsR0FBUjtBQUNDOUIsVUFBSThCLEdBQUosR0FBVTdFLEdBQVY7QUNrQ0U7O0FEakNILFFBQUcrQyxJQUFJdUssSUFBUDtBQUNDdkssVUFBSXdjLEtBQUosR0FBWXhjLElBQUk4QixHQUFoQjtBQUNBOUIsVUFBSThCLEdBQUosR0FBVTlCLElBQUl1SyxJQUFkO0FDbUNFOztBQUNELFdEbkNGaVEsTUFBTXhhLElBQUk4QixHQUFWLElBQWlCOUIsR0NtQ2Y7QUR6Q0g7O0FBT0FvYSxjQUFZcUMsZUFBWixDQUE0QjlCLEdBQTVCLEVBQWlDSCxLQUFqQztBQUNBMVMsU0FBTzdILElBQVAsR0FBY3VhLEtBQWQ7QUFDQUUsbUJBQWlCVixNQUFNbFMsT0FBTzRTLGNBQWIsQ0FBakI7QUFDQU4sY0FBWXNDLGdCQUFaLENBQTZCL0IsR0FBN0IsRUFBa0NELGNBQWxDO0FBQ0E1UyxTQUFPNFMsY0FBUCxHQUF3QkEsY0FBeEI7QUFFQUQsZ0JBQWMsRUFBZDs7QUFDQXBWLElBQUVwQyxJQUFGLENBQU82RSxPQUFPMFQsVUFBZCxFQUEwQixVQUFDL00sU0FBRCxFQUFZeFIsR0FBWjtBQUN6QixRQUFHLENBQUN3UixVQUFVM00sR0FBZDtBQUNDMk0sZ0JBQVUzTSxHQUFWLEdBQWdCN0UsR0FBaEI7QUNvQ0U7O0FBQ0QsV0RwQ0Z3ZCxZQUFZaE0sVUFBVTNNLEdBQXRCLElBQTZCMk0sU0NvQzNCO0FEdkNIOztBQUlBM0csU0FBTzBULFVBQVAsR0FBb0JmLFdBQXBCO0FBRUEzUyxTQUFPNlUsT0FBUCxVQUFBeEMsWUFBQXlDLFVBQUEsa0JBQWlCekMsWUFBWXlDLFVBQVosRUFBakIsR0FBNkIsTUFBN0I7QUFFQWhDLGtCQUFnQlgsNEJBQTRCamQsTUFBNUIsRUFBb0NzRixPQUFwQyxDQUFoQjs7QUFFQSxNQUFHc1ksYUFBSDtBQUNDdlYsTUFBRXBDLElBQUYsQ0FBTzJYLGFBQVAsRUFBc0IsVUFBQ2lDLFlBQUQ7QUFDckIsVUFBQUMsT0FBQSxFQUFBQyxPQUFBOztBQUFBQSxnQkFBVS9DLE1BQU1sUyxPQUFPK00sT0FBUCxDQUFlZ0ksYUFBYTFILFdBQTVCLENBQU4sQ0FBVjs7QUFDQSxVQUFHNEgsT0FBSDtBQUNDRCxrQkFBVSxFQUFWOztBQUNBelgsVUFBRXBDLElBQUYsQ0FBTzRaLGFBQWF6WCxNQUFwQixFQUE0QixVQUFDNFgsS0FBRDtBQUMzQixjQUFBbGlCLElBQUEsRUFBQTJDLElBQUEsRUFBQW9LLElBQUEsRUFBQW9WLElBQUEsRUFBQUMsSUFBQSxFQUFBQyxJQUFBLEVBQUFDLElBQUE7QUFBQU4sa0JBQVFFLE1BQU1LLEtBQWQsSUFBdUJOLFFBQVEzWCxNQUFSLENBQWU0WCxNQUFNSyxLQUFyQixDQUF2Qjs7QUFDQSxjQUFHaFksRUFBRWlZLEdBQUYsQ0FBTU4sS0FBTixFQUFhLE9BQWIsQ0FBSDtBQ3FDTyxnQkFBSSxDQUFDbGlCLE9BQU9naUIsUUFBUUUsTUFBTUssS0FBZCxDQUFSLEtBQWlDLElBQXJDLEVBQTJDO0FBQ3pDdmlCLG1CRHJDY3lpQixLQ3FDZCxHRHJDc0JQLE1BQU1PLEtDcUM1QjtBRHRDVDtBQ3dDTTs7QUR0Q04sY0FBR1AsTUFBTVEsUUFBVDtBQ3dDTyxnQkFBSSxDQUFDL2YsT0FBT3FmLFFBQVFFLE1BQU1LLEtBQWQsQ0FBUixLQUFpQyxJQUFyQyxFQUEyQztBQUN6QzVmLG1CRHhDY2dnQixRQ3dDZCxHRHhDeUIsS0N3Q3pCO0FBQ0Q7O0FBQ0QsZ0JBQUksQ0FBQzVWLE9BQU9pVixRQUFRRSxNQUFNSyxLQUFkLENBQVIsS0FBaUMsSUFBckMsRUFBMkM7QUFDekN4VixtQkQxQ2M2VixRQzBDZCxHRDFDeUIsS0MwQ3pCO0FBQ0Q7O0FBQ0QsbUJBQU8sQ0FBQ1QsT0FBT0gsUUFBUUUsTUFBTUssS0FBZCxDQUFSLEtBQWlDLElBQWpDLEdBQXdDSixLRDNDL0JPLFFDMkMrQixHRDNDcEIsSUMyQ3BCLEdEM0NvQixNQzJDM0I7QUQ5Q1AsaUJBSUssSUFBR1IsTUFBTVMsUUFBVDtBQzRDRSxnQkFBSSxDQUFDUCxPQUFPSixRQUFRRSxNQUFNSyxLQUFkLENBQVIsS0FBaUMsSUFBckMsRUFBMkM7QUFDekNILG1CRDVDY08sUUM0Q2QsR0Q1Q3lCLElDNEN6QjtBQUNEOztBQUNELGdCQUFJLENBQUNOLE9BQU9MLFFBQVFFLE1BQU1LLEtBQWQsQ0FBUixLQUFpQyxJQUFyQyxFQUEyQztBQUN6Q0YsbUJEOUNjTyxRQzhDZCxHRDlDeUIsSUM4Q3pCO0FBQ0Q7O0FBQ0QsbUJBQU8sQ0FBQ04sT0FBT04sUUFBUUUsTUFBTUssS0FBZCxDQUFSLEtBQWlDLElBQWpDLEdBQXdDRCxLRC9DL0JJLFFDK0MrQixHRC9DcEIsS0MrQ3BCLEdEL0NvQixNQytDM0I7QUFDRDtBRDNEUDs7QUFZQVQsZ0JBQVEzWCxNQUFSLEdBQWlCMFgsT0FBakI7QUFNQUMsZ0JBQVFZLGFBQVIsR0FBd0JkLGFBQWFlLE9BQWIsSUFBd0IsRUFBaEQ7QUM2Q0c7O0FBQ0QsYUQ3Q0g5VixPQUFPK00sT0FBUCxDQUFlZ0ksYUFBYTFILFdBQTVCLElBQTJDNEgsT0M2Q3hDO0FEcEVKO0FDc0VDOztBQUNELFNEOUNEM1MsV0FBV0MsVUFBWCxDQUFzQjFDLEdBQXRCLEVBQ0M7QUFBQTRDLFVBQU0sR0FBTjtBQUNBRCxVQUFNeEM7QUFETixHQURELENDOENDO0FEekpGLEc7Ozs7Ozs7Ozs7OztBRXBCQXNDLFdBQVd3SCxHQUFYLENBQWUsTUFBZixFQUF1Qiw4QkFBdkIsRUFBdUQsVUFBQ2xLLEdBQUQsRUFBTUMsR0FBTixFQUFXNkQsSUFBWDtBQUN0RCxNQUFBekYsSUFBQSxFQUFBNUUsQ0FBQTs7QUFBQTtBQUNDNEUsV0FBTyxFQUFQO0FBQ0EyQixRQUFJbVcsRUFBSixDQUFPLE1BQVAsRUFBZSxVQUFDQyxLQUFEO0FDRVgsYURESC9YLFFBQVErWCxLQ0NMO0FERko7QUFHQXBXLFFBQUltVyxFQUFKLENBQU8sS0FBUCxFQUFjN2xCLE9BQU8rbEIsZUFBUCxDQUF3QjtBQUNwQyxVQUFBQyxNQUFBLEVBQUFDLE1BQUE7QUFBQUEsZUFBU3BkLFFBQVEsUUFBUixDQUFUO0FBQ0FtZCxlQUFTLElBQUlDLE9BQU9DLE1BQVgsQ0FBa0I7QUFBRWpSLGNBQUssSUFBUDtBQUFha1IsdUJBQWMsS0FBM0I7QUFBa0NDLHNCQUFhO0FBQS9DLE9BQWxCLENBQVQ7QUNPRSxhRE5GSixPQUFPSyxXQUFQLENBQW1CdFksSUFBbkIsRUFBeUIsVUFBQ3VZLEdBQUQsRUFBTXhXLE1BQU47QUFFdkIsWUFBQXlXLEtBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBLEVBQUFDLFdBQUEsRUFBQUMsSUFBQSxFQUFBQyxLQUFBO0FBQUFMLGdCQUFRMWQsUUFBUSxZQUFSLENBQVI7QUFDQStkLGdCQUFRTCxNQUFNO0FBQ2JNLGlCQUFPN21CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCMm1CLEtBRGxCO0FBRWJDLGtCQUFROW1CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCNG1CLE1BRm5CO0FBR2JDLHVCQUFhL21CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCNm1CO0FBSHhCLFNBQU4sQ0FBUjtBQUtBSixlQUFPQyxNQUFNRCxJQUFOLENBQVd0WixFQUFFMlUsS0FBRixDQUFRbFMsTUFBUixDQUFYLENBQVA7QUFDQTBXLGlCQUFTUSxLQUFLQyxLQUFMLENBQVduWCxPQUFPMFcsTUFBbEIsQ0FBVDtBQUNBRSxzQkFBY0YsT0FBT0UsV0FBckI7QUFDQUQsY0FBTS9qQixHQUFHNFksbUJBQUgsQ0FBdUJ4VyxPQUF2QixDQUErQjRoQixXQUEvQixDQUFOOztBQUNBLFlBQUdELE9BQVFBLElBQUlTLFNBQUosS0FBaUI1akIsT0FBT3dNLE9BQU9vWCxTQUFkLENBQXpCLElBQXNEUCxTQUFRN1csT0FBTzZXLElBQXhFO0FBQ0Nqa0IsYUFBRzRZLG1CQUFILENBQXVCbkssTUFBdkIsQ0FBOEI7QUFBQ3JILGlCQUFLNGM7QUFBTixXQUE5QixFQUFrRDtBQUFDalAsa0JBQU07QUFBQ29FLG9CQUFNO0FBQVA7QUFBUCxXQUFsRDtBQ2FHLGlCRFpIc0wsZUFBZUMsV0FBZixDQUEyQlgsSUFBSWhjLEtBQS9CLEVBQXNDZ2MsSUFBSTlYLE9BQTFDLEVBQW1EckwsT0FBT3dNLE9BQU9vWCxTQUFkLENBQW5ELEVBQTZFVCxJQUFJclEsVUFBakYsRUFBNkZxUSxJQUFJbGMsUUFBakcsRUFBMkdrYyxJQUFJWSxVQUEvRyxDQ1lHO0FBQ0Q7QUQzQkwsUUNNRTtBRFRpQyxLQUF2QixFQW9CVixVQUFDZixHQUFEO0FBQ0ZyYyxjQUFRbkIsS0FBUixDQUFjd2QsSUFBSW5jLEtBQWxCO0FDYUUsYURaRkYsUUFBUXFkLEdBQVIsQ0FBWSxnRUFBWixDQ1lFO0FEbENVLE1BQWQ7QUFMRCxXQUFBeGUsS0FBQTtBQStCTUssUUFBQUwsS0FBQTtBQUNMbUIsWUFBUW5CLEtBQVIsQ0FBY0ssRUFBRWdCLEtBQWhCO0FDWUM7O0FEVkZ3RixNQUFJdVAsU0FBSixDQUFjLEdBQWQsRUFBbUI7QUFBQyxvQkFBZ0I7QUFBakIsR0FBbkI7QUNjQyxTRGJEdlAsSUFBSXdQLEdBQUosQ0FBUSwyREFBUixDQ2FDO0FEakRGLEc7Ozs7Ozs7Ozs7OztBRUFBbmYsT0FBT3VYLE9BQVAsQ0FDQztBQUFBZ1Esc0JBQW9CLFVBQUM5YyxLQUFEO0FBS25CLFFBQUErYyxLQUFBLEVBQUFDLGFBQUEsRUFBQUMsZ0JBQUEsRUFBQXJZLENBQUEsRUFBQXNZLE9BQUEsRUFBQWhVLENBQUEsRUFBQTVDLEdBQUEsRUFBQTZXLElBQUEsRUFBQUMsS0FBQSxFQUFBQyxNQUFBLEVBQUFDLGNBQUEsRUFBQUMsT0FBQSxFQUFBQyxRQUFBLEVBQUFDLE1BQUEsRUFBQXJPLElBQUEsRUFBQXNPLHFCQUFBLEVBQUF6YyxPQUFBLEVBQUEwYyxPQUFBLEVBQUFDLFdBQUEsRUFBQUMsTUFBQSxFQUFBQyxHQUFBO0FBQUE3WixVQUFNakUsS0FBTixFQUFhK2QsTUFBYjtBQUNBOWMsY0FDQztBQUFBaWMsZUFBUyxJQUFUO0FBQ0FRLDZCQUF1QjtBQUR2QixLQUREOztBQUdBLFNBQU8sS0FBS25qQixNQUFaO0FBQ0MsYUFBTzBHLE9BQVA7QUNERTs7QURFSGljLGNBQVUsS0FBVjtBQUNBUSw0QkFBd0IsRUFBeEI7QUFDQUMsY0FBVTFsQixHQUFHK2xCLGNBQUgsQ0FBa0IzakIsT0FBbEIsQ0FBMEI7QUFBQzJGLGFBQU9BLEtBQVI7QUFBZXhGLFdBQUs7QUFBcEIsS0FBMUIsQ0FBVjtBQUNBNmlCLGFBQUEsQ0FBQU0sV0FBQSxPQUFTQSxRQUFTTSxNQUFsQixHQUFrQixNQUFsQixLQUE0QixFQUE1Qjs7QUFFQSxRQUFHWixPQUFPbm1CLE1BQVY7QUFDQ3VtQixlQUFTeGxCLEdBQUdzSyxhQUFILENBQWlCTyxJQUFqQixDQUFzQjtBQUFDOUMsZUFBT0EsS0FBUjtBQUFld0YsZUFBTyxLQUFLakw7QUFBM0IsT0FBdEIsRUFBMEQ7QUFBQ29JLGdCQUFPO0FBQUN0RCxlQUFLO0FBQU47QUFBUixPQUExRCxDQUFUO0FBQ0FtZSxpQkFBV0MsT0FBT2hOLEdBQVAsQ0FBVyxVQUFDQyxDQUFEO0FBQ3JCLGVBQU9BLEVBQUVyUixHQUFUO0FBRFUsUUFBWDs7QUFFQSxXQUFPbWUsU0FBU3RtQixNQUFoQjtBQUNDLGVBQU8rSixPQUFQO0FDVUc7O0FEUkpxYyx1QkFBaUIsRUFBakI7O0FBQ0EsV0FBQTFZLElBQUEsR0FBQTBCLE1BQUErVyxPQUFBbm1CLE1BQUEsRUFBQTBOLElBQUEwQixHQUFBLEVBQUExQixHQUFBO0FDVUt3WSxnQkFBUUMsT0FBT3pZLENBQVAsQ0FBUjtBRFRKbVksZ0JBQVFLLE1BQU1MLEtBQWQ7QUFDQWUsY0FBTVYsTUFBTVUsR0FBWjtBQUNBZCx3QkFBZ0Iva0IsR0FBR3NLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCO0FBQUM5QyxpQkFBT0EsS0FBUjtBQUFld0MsbUJBQVM7QUFBQ08saUJBQUtnYTtBQUFOO0FBQXhCLFNBQXRCLEVBQTZEO0FBQUNwYSxrQkFBTztBQUFDdEQsaUJBQUs7QUFBTjtBQUFSLFNBQTdELENBQWhCO0FBQ0E0ZCwyQkFBQUQsaUJBQUEsT0FBbUJBLGNBQWV2TSxHQUFmLENBQW1CLFVBQUNDLENBQUQ7QUFDckMsaUJBQU9BLEVBQUVyUixHQUFUO0FBRGtCLFVBQW5CLEdBQW1CLE1BQW5COztBQUVBLGFBQUE2SixJQUFBLEdBQUFpVSxPQUFBSyxTQUFBdG1CLE1BQUEsRUFBQWdTLElBQUFpVSxJQUFBLEVBQUFqVSxHQUFBO0FDcUJNcVUsb0JBQVVDLFNBQVN0VSxDQUFULENBQVY7QURwQkwwVSx3QkFBYyxLQUFkOztBQUNBLGNBQUdiLE1BQU03ZixPQUFOLENBQWNxZ0IsT0FBZCxJQUF5QixDQUFDLENBQTdCO0FBQ0NLLDBCQUFjLElBQWQ7QUFERDtBQUdDLGdCQUFHWCxpQkFBaUIvZixPQUFqQixDQUF5QnFnQixPQUF6QixJQUFvQyxDQUFDLENBQXhDO0FBQ0NLLDRCQUFjLElBQWQ7QUFKRjtBQzJCTTs7QUR0Qk4sY0FBR0EsV0FBSDtBQUNDVixzQkFBVSxJQUFWO0FBQ0FRLGtDQUFzQjltQixJQUF0QixDQUEyQmtuQixHQUEzQjtBQUNBUiwyQkFBZTFtQixJQUFmLENBQW9CMm1CLE9BQXBCO0FDd0JLO0FEbENQO0FBTkQ7O0FBa0JBRCx1QkFBaUIxYSxFQUFFOEIsSUFBRixDQUFPNFksY0FBUCxDQUFqQjs7QUFDQSxVQUFHQSxlQUFlcG1CLE1BQWYsR0FBd0JzbUIsU0FBU3RtQixNQUFwQztBQUVDZ21CLGtCQUFVLEtBQVY7QUFDQVEsZ0NBQXdCLEVBQXhCO0FBSEQ7QUFLQ0EsZ0NBQXdCOWEsRUFBRThCLElBQUYsQ0FBTzlCLEVBQUVDLE9BQUYsQ0FBVTZhLHFCQUFWLENBQVAsQ0FBeEI7QUFoQ0Y7QUMwREc7O0FEeEJILFFBQUdSLE9BQUg7QUFDQ1csZUFBUzVsQixHQUFHc0ssYUFBSCxDQUFpQk8sSUFBakIsQ0FBc0I7QUFBQzlDLGVBQU9BLEtBQVI7QUFBZVgsYUFBSztBQUFDMEQsZUFBSzJhO0FBQU47QUFBcEIsT0FBdEIsRUFBeUU7QUFBQy9hLGdCQUFPO0FBQUN0RCxlQUFLLENBQU47QUFBU21ELG1CQUFTO0FBQWxCO0FBQVIsT0FBekUsRUFBd0dRLEtBQXhHLEVBQVQ7QUFHQW9NLGFBQU94TSxFQUFFNEIsTUFBRixDQUFTcVosTUFBVCxFQUFpQixVQUFDcFosR0FBRDtBQUN2QixZQUFBakMsT0FBQTtBQUFBQSxrQkFBVWlDLElBQUlqQyxPQUFKLElBQWUsRUFBekI7QUFDQSxlQUFPSSxFQUFFc2IsWUFBRixDQUFlMWIsT0FBZixFQUF3QmtiLHFCQUF4QixFQUErQ3htQixNQUEvQyxHQUF3RCxDQUF4RCxJQUE4RDBMLEVBQUVzYixZQUFGLENBQWUxYixPQUFmLEVBQXdCZ2IsUUFBeEIsRUFBa0N0bUIsTUFBbEMsR0FBMkMsQ0FBaEg7QUFGTSxRQUFQO0FBR0F3bUIsOEJBQXdCdE8sS0FBS3FCLEdBQUwsQ0FBUyxVQUFDQyxDQUFEO0FBQ2hDLGVBQU9BLEVBQUVyUixHQUFUO0FBRHVCLFFBQXhCO0FDc0NFOztBRG5DSDRCLFlBQVFpYyxPQUFSLEdBQWtCQSxPQUFsQjtBQUNBamMsWUFBUXljLHFCQUFSLEdBQWdDQSxxQkFBaEM7QUFDQSxXQUFPemMsT0FBUDtBQTlERDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7QUVBQTFMLE1BQU0sQ0FBQ3VYLE9BQVAsQ0FBZTtBQUNYcVIsYUFBVyxFQUFFLFVBQVMzakIsR0FBVCxFQUFjQyxLQUFkLEVBQXFCO0FBQzlCd0osU0FBSyxDQUFDekosR0FBRCxFQUFNdWpCLE1BQU4sQ0FBTDtBQUNBOVosU0FBSyxDQUFDeEosS0FBRCxFQUFRL0MsTUFBUixDQUFMO0FBRUF5UCxPQUFHLEdBQUcsRUFBTjtBQUNBQSxPQUFHLENBQUM3TSxJQUFKLEdBQVcsS0FBS0MsTUFBaEI7QUFDQTRNLE9BQUcsQ0FBQzNNLEdBQUosR0FBVUEsR0FBVjtBQUNBMk0sT0FBRyxDQUFDMU0sS0FBSixHQUFZQSxLQUFaO0FBRUEsUUFBSXlMLENBQUMsR0FBR2pPLEVBQUUsQ0FBQ21DLGlCQUFILENBQXFCMEksSUFBckIsQ0FBMEI7QUFDOUJ4SSxVQUFJLEVBQUUsS0FBS0MsTUFEbUI7QUFFOUJDLFNBQUcsRUFBRUE7QUFGeUIsS0FBMUIsRUFHTDZTLEtBSEssRUFBUjs7QUFJQSxRQUFJbkgsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQak8sUUFBRSxDQUFDbUMsaUJBQUgsQ0FBcUJzTSxNQUFyQixDQUE0QjtBQUN4QnBNLFlBQUksRUFBRSxLQUFLQyxNQURhO0FBRXhCQyxXQUFHLEVBQUVBO0FBRm1CLE9BQTVCLEVBR0c7QUFDQ3dTLFlBQUksRUFBRTtBQUNGdlMsZUFBSyxFQUFFQTtBQURMO0FBRFAsT0FISDtBQVFILEtBVEQsTUFTTztBQUNIeEMsUUFBRSxDQUFDbUMsaUJBQUgsQ0FBcUJna0IsTUFBckIsQ0FBNEJqWCxHQUE1QjtBQUNIOztBQUVELFdBQU8sSUFBUDtBQUNIO0FBNUJVLENBQWYsRTs7Ozs7Ozs7Ozs7O0FDQUE1UixPQUFPdVgsT0FBUCxDQUNDO0FBQUF1UixvQkFBa0IsVUFBQ0MsZ0JBQUQsRUFBbUJqVCxRQUFuQjtBQUNqQixRQUFBa1QsS0FBQSxFQUFBMUMsR0FBQSxFQUFBeFcsTUFBQSxFQUFBbkYsTUFBQSxFQUFBNUYsSUFBQTs7QUNDRSxRQUFJK1EsWUFBWSxJQUFoQixFQUFzQjtBREZZQSxpQkFBUyxFQUFUO0FDSWpDOztBREhIcEgsVUFBTXFhLGdCQUFOLEVBQXdCUCxNQUF4QjtBQUNBOVosVUFBTW9ILFFBQU4sRUFBZ0IwUyxNQUFoQjtBQUVBempCLFdBQU9yQyxHQUFHdU4sS0FBSCxDQUFTbkwsT0FBVCxDQUFpQjtBQUFDZ0YsV0FBSyxLQUFLOUU7QUFBWCxLQUFqQixFQUFxQztBQUFDb0ksY0FBUTtBQUFDNk4sdUJBQWU7QUFBaEI7QUFBVCxLQUFyQyxDQUFQOztBQUVBLFFBQUcsQ0FBSWxXLEtBQUtrVyxhQUFaO0FBQ0M7QUNTRTs7QURQSGhSLFlBQVFnZixJQUFSLENBQWEsU0FBYjtBQUNBdGUsYUFBUyxFQUFUOztBQUNBLFFBQUdtTCxRQUFIO0FBQ0NuTCxlQUFTakksR0FBR2lJLE1BQUgsQ0FBVTRDLElBQVYsQ0FBZTtBQUFDekQsYUFBS2dNLFFBQU47QUFBZ0JsTCxpQkFBUztBQUF6QixPQUFmLEVBQStDO0FBQUN3QyxnQkFBUTtBQUFDdEQsZUFBSztBQUFOO0FBQVQsT0FBL0MsQ0FBVDtBQUREO0FBR0NhLGVBQVNqSSxHQUFHaUksTUFBSCxDQUFVNEMsSUFBVixDQUFlO0FBQUMzQyxpQkFBUztBQUFWLE9BQWYsRUFBZ0M7QUFBQ3dDLGdCQUFRO0FBQUN0RCxlQUFLO0FBQU47QUFBVCxPQUFoQyxDQUFUO0FDc0JFOztBRHJCSGdHLGFBQVMsRUFBVDtBQUNBbkYsV0FBT3pKLE9BQVAsQ0FBZSxVQUFDZ29CLENBQUQ7QUFDZCxVQUFBL2YsQ0FBQSxFQUFBbWQsR0FBQTs7QUFBQTtBQ3dCSyxlRHZCSmEsZUFBZWdDLDRCQUFmLENBQTRDSixnQkFBNUMsRUFBOERHLEVBQUVwZixHQUFoRSxDQ3VCSTtBRHhCTCxlQUFBaEIsS0FBQTtBQUVNd2QsY0FBQXhkLEtBQUE7QUFDTEssWUFBSSxFQUFKO0FBQ0FBLFVBQUVXLEdBQUYsR0FBUW9mLEVBQUVwZixHQUFWO0FBQ0FYLFVBQUVySSxJQUFGLEdBQVNvb0IsRUFBRXBvQixJQUFYO0FBQ0FxSSxVQUFFbWQsR0FBRixHQUFRQSxHQUFSO0FDeUJJLGVEeEJKeFcsT0FBT3pPLElBQVAsQ0FBWThILENBQVosQ0N3Qkk7QUFDRDtBRGpDTDs7QUFTQSxRQUFHMkcsT0FBT25PLE1BQVAsR0FBZ0IsQ0FBbkI7QUFDQ3NJLGNBQVFuQixLQUFSLENBQWNnSCxNQUFkOztBQUNBO0FBQ0NrWixnQkFBUUksUUFBUXZSLEtBQVIsQ0FBY21SLEtBQXRCO0FBQ0FBLGNBQU1LLElBQU4sQ0FDQztBQUFBN25CLGNBQUkscUJBQUo7QUFDQUQsZ0JBQU1rRyxTQUFTd1IsY0FBVCxDQUF3QjFYLElBRDlCO0FBRUE2WCxtQkFBUyx5QkFGVDtBQUdBN1UsZ0JBQU15aUIsS0FBS3NDLFNBQUwsQ0FBZTtBQUFBLHNCQUFVeFo7QUFBVixXQUFmO0FBSE4sU0FERDtBQUZELGVBQUFoSCxLQUFBO0FBT013ZCxjQUFBeGQsS0FBQTtBQUNMbUIsZ0JBQVFuQixLQUFSLENBQWN3ZCxHQUFkO0FBVkY7QUMwQ0c7O0FBQ0QsV0RoQ0ZyYyxRQUFRc2YsT0FBUixDQUFnQixTQUFoQixDQ2dDRTtBRHBFSDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUF2cEIsT0FBT3VYLE9BQVAsQ0FDQztBQUFBaVMsZUFBYSxVQUFDMVQsUUFBRCxFQUFXL0YsUUFBWCxFQUFxQitOLE9BQXJCO0FBQ1osUUFBQXdFLFNBQUE7QUFBQTVULFVBQU1vSCxRQUFOLEVBQWdCMFMsTUFBaEI7QUFDQTlaLFVBQU1xQixRQUFOLEVBQWdCeVksTUFBaEI7O0FBRUEsUUFBRyxDQUFDam9CLFFBQVFtSyxZQUFSLENBQXFCb0wsUUFBckIsRUFBK0I5VixPQUFPZ0YsTUFBUCxFQUEvQixDQUFELElBQXFEOFksT0FBeEQ7QUFDQyxZQUFNLElBQUk5ZCxPQUFPb1EsS0FBWCxDQUFpQixHQUFqQixFQUFzQiwyQkFBdEIsQ0FBTjtBQ0NFOztBRENILFFBQUcsQ0FBSXBRLE9BQU9nRixNQUFQLEVBQVA7QUFDQyxZQUFNLElBQUloRixPQUFPb1EsS0FBWCxDQUFpQixHQUFqQixFQUFxQixvQkFBckIsQ0FBTjtBQ0NFOztBRENILFNBQU8wTixPQUFQO0FBQ0NBLGdCQUFVOWQsT0FBTytFLElBQVAsR0FBYytFLEdBQXhCO0FDQ0U7O0FEQ0h3WSxnQkFBWTVmLEdBQUd5SyxXQUFILENBQWVySSxPQUFmLENBQXVCO0FBQUNDLFlBQU0rWSxPQUFQO0FBQWdCclQsYUFBT3FMO0FBQXZCLEtBQXZCLENBQVo7O0FBRUEsUUFBR3dNLFVBQVVtSCxZQUFWLEtBQTBCLFNBQTFCLElBQXVDbkgsVUFBVW1ILFlBQVYsS0FBMEIsU0FBcEU7QUFDQyxZQUFNLElBQUl6cEIsT0FBT29RLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0IsdUJBQXRCLENBQU47QUNHRTs7QURESDFOLE9BQUd1TixLQUFILENBQVNrQixNQUFULENBQWdCO0FBQUNySCxXQUFLZ1U7QUFBTixLQUFoQixFQUFnQztBQUFDckcsWUFBTTtBQUFDMUgsa0JBQVVBO0FBQVg7QUFBUCxLQUFoQztBQUVBLFdBQU9BLFFBQVA7QUFwQkQ7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBL1AsT0FBT3VYLE9BQVAsQ0FDQztBQUFBbVMsb0JBQWtCLFVBQUN4QyxTQUFELEVBQVlwUixRQUFaLEVBQXNCNlQsTUFBdEIsRUFBOEJDLFlBQTlCLEVBQTRDcmYsUUFBNUMsRUFBc0Q4YyxVQUF0RDtBQUNqQixRQUFBZCxLQUFBLEVBQUFDLE1BQUEsRUFBQXFELFVBQUEsRUFBQUMsY0FBQSxFQUFBQyxVQUFBLEVBQUFDLFVBQUEsRUFBQXZmLEtBQUEsRUFBQXdmLGdCQUFBLEVBQUFuTSxPQUFBLEVBQUE4SSxLQUFBO0FBQUFsWSxVQUFNd1ksU0FBTixFQUFpQjVqQixNQUFqQjtBQUNBb0wsVUFBTW9ILFFBQU4sRUFBZ0IwUyxNQUFoQjtBQUNBOVosVUFBTWliLE1BQU4sRUFBY25CLE1BQWQ7QUFDQTlaLFVBQU1rYixZQUFOLEVBQW9CenBCLEtBQXBCO0FBQ0F1TyxVQUFNbkUsUUFBTixFQUFnQmllLE1BQWhCO0FBQ0E5WixVQUFNMlksVUFBTixFQUFrQi9qQixNQUFsQjtBQUVBd2EsY0FBVSxLQUFLOVksTUFBZjtBQUVBNmtCLGlCQUFhLENBQWI7QUFDQUUsaUJBQWEsRUFBYjtBQUNBcm5CLE9BQUdpTSxPQUFILENBQVdwQixJQUFYLENBQWdCO0FBQUN6TSxZQUFNO0FBQUMwTSxhQUFLb2M7QUFBTjtBQUFQLEtBQWhCLEVBQTZDMW9CLE9BQTdDLENBQXFELFVBQUNFLENBQUQ7QUFDcER5b0Isb0JBQWN6b0IsRUFBRThvQixhQUFoQjtBQ0lHLGFESEhILFdBQVcxb0IsSUFBWCxDQUFnQkQsRUFBRStvQixPQUFsQixDQ0dHO0FETEo7QUFJQTFmLFlBQVEvSCxHQUFHaUksTUFBSCxDQUFVN0YsT0FBVixDQUFrQmdSLFFBQWxCLENBQVI7O0FBQ0EsUUFBRyxDQUFJckwsTUFBTUcsT0FBYjtBQUNDcWYseUJBQW1Cdm5CLEdBQUd5SyxXQUFILENBQWVJLElBQWYsQ0FBb0I7QUFBQzlDLGVBQU1xTDtBQUFQLE9BQXBCLEVBQXNDZ0MsS0FBdEMsRUFBbkI7QUFDQWdTLHVCQUFpQkcsbUJBQW1CSixVQUFwQzs7QUFDQSxVQUFHM0MsWUFBWTRDLGlCQUFlLEdBQTlCO0FBQ0MsY0FBTSxJQUFJOXBCLE9BQU9vUSxLQUFYLENBQWlCLFFBQWpCLEVBQTJCLHNCQUFvQjBaLGNBQS9DLENBQU47QUFKRjtBQ1dHOztBRExIRSxpQkFBYSxFQUFiO0FBRUF4RCxhQUFTLEVBQVQ7QUFDQUEsV0FBT0UsV0FBUCxHQUFxQmlELE1BQXJCO0FBQ0FwRCxZQUFRMWQsUUFBUSxZQUFSLENBQVI7QUFFQStkLFlBQVFMLE1BQU07QUFDYk0sYUFBTzdtQixPQUFPQyxRQUFQLENBQWdCQyxPQUFoQixDQUF3QjJtQixLQURsQjtBQUViQyxjQUFROW1CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCNG1CLE1BRm5CO0FBR2JDLG1CQUFhL21CLE9BQU9DLFFBQVAsQ0FBZ0JDLE9BQWhCLENBQXdCNm1CO0FBSHhCLEtBQU4sQ0FBUjtBQU1BSCxVQUFNd0Qsa0JBQU4sQ0FBeUI7QUFDeEJyYyxZQUFNZ2MsV0FBV00sSUFBWCxDQUFnQixHQUFoQixDQURrQjtBQUV4QkMsb0JBQWNDLFNBQVNDLE1BQVQsQ0FBZ0IsbUJBQWhCLENBRlU7QUFHeEJ0RCxpQkFBV0EsU0FIYTtBQUl4QnVELHdCQUFrQixXQUpNO0FBS3hCQyxrQkFBWTFxQixPQUFPZ0csV0FBUCxLQUF1Qiw2QkFMWDtBQU14QjJrQixrQkFBWSxRQU5ZO0FBT3hCQyxrQkFBWUwsU0FBU0MsTUFBVCxDQUFnQixtQkFBaEIsQ0FQWTtBQVF4QmhFLGNBQVFRLEtBQUtzQyxTQUFMLENBQWU5QyxNQUFmO0FBUmdCLEtBQXpCLEVBU0d4bUIsT0FBTytsQixlQUFQLENBQXdCLFVBQUNPLEdBQUQsRUFBTXhXLE1BQU47QUFDekIsVUFBQThCLEdBQUE7O0FBQUEsVUFBRzBVLEdBQUg7QUFDQ3JjLGdCQUFRbkIsS0FBUixDQUFjd2QsSUFBSW5jLEtBQWxCO0FDS0U7O0FESkgsVUFBRzJGLE1BQUg7QUFDQzhCLGNBQU0sRUFBTjtBQUNBQSxZQUFJOUgsR0FBSixHQUFVNmYsTUFBVjtBQUNBL1gsWUFBSXVFLE9BQUosR0FBYyxJQUFJdEwsSUFBSixFQUFkO0FBQ0ErRyxZQUFJaVosSUFBSixHQUFXL2EsTUFBWDtBQUNBOEIsWUFBSXNWLFNBQUosR0FBZ0JBLFNBQWhCO0FBQ0F0VixZQUFJd0UsVUFBSixHQUFpQjBILE9BQWpCO0FBQ0FsTSxZQUFJbkgsS0FBSixHQUFZcUwsUUFBWjtBQUNBbEUsWUFBSWlLLElBQUosR0FBVyxLQUFYO0FBQ0FqSyxZQUFJakQsT0FBSixHQUFjaWIsWUFBZDtBQUNBaFksWUFBSXJILFFBQUosR0FBZUEsUUFBZjtBQUNBcUgsWUFBSXlWLFVBQUosR0FBaUJBLFVBQWpCO0FDTUcsZURMSDNrQixHQUFHNFksbUJBQUgsQ0FBdUJ1TixNQUF2QixDQUE4QmpYLEdBQTlCLENDS0c7QUFDRDtBRHJCcUIsS0FBdkIsRUFnQkMsVUFBQ3pJLENBQUQ7QUFDRmMsY0FBUXFkLEdBQVIsQ0FBWSxxREFBWjtBQ09FLGFETkZyZCxRQUFRcWQsR0FBUixDQUFZbmUsRUFBRWdCLEtBQWQsQ0NNRTtBRHhCRCxNQVRIO0FBZ0NBLFdBQU8sU0FBUDtBQW5FRDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUFuSyxPQUFPdVgsT0FBUCxDQUNDO0FBQUF1VCx3QkFBc0IsVUFBQ2hWLFFBQUQ7QUFDckIsUUFBQWlWLGVBQUE7QUFBQXJjLFVBQU1vSCxRQUFOLEVBQWdCMFMsTUFBaEI7QUFDQXVDLHNCQUFrQixJQUFJNW9CLE1BQUosRUFBbEI7QUFDQTRvQixvQkFBZ0JDLGdCQUFoQixHQUFtQ3RvQixHQUFHeUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUM5QyxhQUFPcUw7QUFBUixLQUFwQixFQUF1Q2dDLEtBQXZDLEVBQW5DO0FBQ0FpVCxvQkFBZ0JFLG1CQUFoQixHQUFzQ3ZvQixHQUFHeUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUM5QyxhQUFPcUwsUUFBUjtBQUFrQm9MLHFCQUFlO0FBQWpDLEtBQXBCLEVBQTREcEosS0FBNUQsRUFBdEM7QUFDQSxXQUFPaVQsZUFBUDtBQUxEO0FBQUEsQ0FERCxFOzs7Ozs7Ozs7Ozs7QUNBQS9xQixPQUFPdVgsT0FBUCxDQUNDO0FBQUEyVCxpQkFBZSxVQUFDcHFCLElBQUQ7QUFDZCxRQUFHLENBQUMsS0FBS2tFLE1BQVQ7QUFDQyxhQUFPLEtBQVA7QUNDRTs7QUFDRCxXREFGdEMsR0FBR3VOLEtBQUgsQ0FBU2liLGFBQVQsQ0FBdUIsS0FBS2xtQixNQUE1QixFQUFvQ2xFLElBQXBDLENDQUU7QURKSDtBQU1BcXFCLGlCQUFlLFVBQUNDLEtBQUQ7QUFDZCxRQUFBN2EsV0FBQTs7QUFBQSxRQUFHLENBQUMsS0FBS3ZMLE1BQU4sSUFBZ0IsQ0FBQ29tQixLQUFwQjtBQUNDLGFBQU8sS0FBUDtBQ0VFOztBREFIN2Esa0JBQWM5SSxTQUFTK0ksZUFBVCxDQUF5QjRhLEtBQXpCLENBQWQ7QUFFQW5oQixZQUFRcWQsR0FBUixDQUFZLE9BQVosRUFBcUI4RCxLQUFyQjtBQ0NFLFdEQ0Yxb0IsR0FBR3VOLEtBQUgsQ0FBU2tCLE1BQVQsQ0FBZ0I7QUFBQ3JILFdBQUssS0FBSzlFO0FBQVgsS0FBaEIsRUFBb0M7QUFBQ3VULGFBQU87QUFBQyxtQkFBVztBQUFDaEksdUJBQWFBO0FBQWQ7QUFBWjtBQUFSLEtBQXBDLENDREU7QURiSDtBQUFBLENBREQsRTs7Ozs7Ozs7Ozs7O0FFQUF2USxPQUFPdVgsT0FBUCxDQUNJO0FBQUEsMEJBQXdCLFVBQUNqTixPQUFELEVBQVV0RixNQUFWO0FBQ3BCLFFBQUFxbUIsWUFBQSxFQUFBcmUsYUFBQSxFQUFBc2UsR0FBQTtBQUFBNWMsVUFBTXBFLE9BQU4sRUFBZWtlLE1BQWY7QUFDQTlaLFVBQU0xSixNQUFOLEVBQWN3akIsTUFBZDtBQUVBNkMsbUJBQWV6VixRQUFRSSxXQUFSLENBQW9CLGFBQXBCLEVBQW1DbFIsT0FBbkMsQ0FBMkM7QUFBQzJGLGFBQU9ILE9BQVI7QUFBaUJ2RixZQUFNQztBQUF2QixLQUEzQyxFQUEyRTtBQUFDb0ksY0FBUTtBQUFDSix1QkFBZTtBQUFoQjtBQUFULEtBQTNFLENBQWY7O0FBQ0EsUUFBRyxDQUFDcWUsWUFBSjtBQUNJLFlBQU0sSUFBSXJyQixPQUFPb1EsS0FBWCxDQUFpQixnQkFBakIsQ0FBTjtBQ1FQOztBRE5HcEQsb0JBQWdCNEksUUFBUXNILGFBQVIsQ0FBc0IsZUFBdEIsRUFBdUMzUCxJQUF2QyxDQUE0QztBQUN4RHpELFdBQUs7QUFDRDBELGFBQUs2ZCxhQUFhcmU7QUFEakI7QUFEbUQsS0FBNUMsRUFJYjtBQUFDSSxjQUFRO0FBQUNILGlCQUFTO0FBQVY7QUFBVCxLQUphLEVBSVdRLEtBSlgsRUFBaEI7QUFNQTZkLFVBQU0xVixRQUFRc0gsYUFBUixDQUFzQixrQkFBdEIsRUFBMEMzUCxJQUExQyxDQUErQztBQUFFOUMsYUFBT0g7QUFBVCxLQUEvQyxFQUFtRTtBQUFFOEMsY0FBUTtBQUFFK1AscUJBQWEsQ0FBZjtBQUFrQm9PLGlCQUFTLENBQTNCO0FBQThCOWdCLGVBQU87QUFBckM7QUFBVixLQUFuRSxFQUF5SGdELEtBQXpILEVBQU47O0FBQ0FKLE1BQUVwQyxJQUFGLENBQU9xZ0IsR0FBUCxFQUFXLFVBQUM1TixDQUFEO0FBQ1AsVUFBQThOLEVBQUEsRUFBQUMsS0FBQTtBQUFBRCxXQUFLNVYsUUFBUXNILGFBQVIsQ0FBc0IsT0FBdEIsRUFBK0JwWSxPQUEvQixDQUF1QzRZLEVBQUU2TixPQUF6QyxFQUFrRDtBQUFFbmUsZ0JBQVE7QUFBRXRNLGdCQUFNLENBQVI7QUFBVzJxQixpQkFBTztBQUFsQjtBQUFWLE9BQWxELENBQUw7O0FBQ0EsVUFBR0QsRUFBSDtBQUNJOU4sVUFBRWdPLFNBQUYsR0FBY0YsR0FBRzFxQixJQUFqQjtBQUNBNGMsVUFBRWlPLE9BQUYsR0FBWSxLQUFaO0FBRUFGLGdCQUFRRCxHQUFHQyxLQUFYOztBQUNBLFlBQUdBLEtBQUg7QUFDSSxjQUFHQSxNQUFNRyxhQUFOLElBQXVCSCxNQUFNRyxhQUFOLENBQW9CMXBCLFFBQXBCLENBQTZCOEMsTUFBN0IsQ0FBMUI7QUN3QlIsbUJEdkJZMFksRUFBRWlPLE9BQUYsR0FBWSxJQ3VCeEI7QUR4QlEsaUJBRUssSUFBR0YsTUFBTUksWUFBTixJQUFzQkosTUFBTUksWUFBTixDQUFtQmxxQixNQUFuQixHQUE0QixDQUFyRDtBQUNELGdCQUFHMHBCLGdCQUFnQkEsYUFBYXJlLGFBQTdCLElBQThDSyxFQUFFc2IsWUFBRixDQUFlMEMsYUFBYXJlLGFBQTVCLEVBQTJDeWUsTUFBTUksWUFBakQsRUFBK0RscUIsTUFBL0QsR0FBd0UsQ0FBekg7QUN3QlYscUJEdkJjK2IsRUFBRWlPLE9BQUYsR0FBWSxJQ3VCMUI7QUR4QlU7QUFHSSxrQkFBRzNlLGFBQUg7QUN3QlosdUJEdkJnQjBRLEVBQUVpTyxPQUFGLEdBQVl0ZSxFQUFFeWUsSUFBRixDQUFPOWUsYUFBUCxFQUFzQixVQUFDa0MsR0FBRDtBQUM5Qix5QkFBT0EsSUFBSWpDLE9BQUosSUFBZUksRUFBRXNiLFlBQUYsQ0FBZXpaLElBQUlqQyxPQUFuQixFQUE0QndlLE1BQU1JLFlBQWxDLEVBQWdEbHFCLE1BQWhELEdBQXlELENBQS9FO0FBRFEsa0JDdUI1QjtBRDNCUTtBQURDO0FBSFQ7QUFMSjtBQzJDTDtBRDdDQzs7QUFrQkEycEIsVUFBTUEsSUFBSXJjLE1BQUosQ0FBVyxVQUFDa00sQ0FBRDtBQUNiLGFBQU9BLEVBQUV1USxTQUFUO0FBREUsTUFBTjtBQUdBLFdBQU9KLEdBQVA7QUFwQ0o7QUFBQSxDQURKLEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBdHJCLE9BQU91WCxPQUFQLENBQ0M7QUFBQXdVLHdCQUFzQixVQUFDQyxhQUFELEVBQWdCbFcsUUFBaEIsRUFBMEJsRyxRQUExQjtBQUNyQixRQUFBcWMsV0FBQSxFQUFBdmhCLFlBQUEsRUFBQXdoQixJQUFBLEVBQUFycEIsR0FBQSxFQUFBNEgsS0FBQSxFQUFBNlgsU0FBQSxFQUFBNkosTUFBQSxFQUFBck8sT0FBQTs7QUFBQSxRQUFHLENBQUMsS0FBSzlZLE1BQVQ7QUFDQyxZQUFNLElBQUloRixPQUFPb1EsS0FBWCxDQUFpQixHQUFqQixFQUFzQixNQUF0QixDQUFOO0FDRUU7O0FEQUgzRixZQUFRL0gsR0FBR2lJLE1BQUgsQ0FBVTdGLE9BQVYsQ0FBa0I7QUFBQ2dGLFdBQUtnTTtBQUFOLEtBQWxCLENBQVI7QUFDQXBMLG1CQUFBRCxTQUFBLFFBQUE1SCxNQUFBNEgsTUFBQThELE1BQUEsWUFBQTFMLElBQThCWCxRQUE5QixDQUF1QyxLQUFLOEMsTUFBNUMsSUFBZSxNQUFmLEdBQWUsTUFBZjs7QUFFQSxTQUFPMEYsWUFBUDtBQUNDLFlBQU0sSUFBSTFLLE9BQU9vUSxLQUFYLENBQWlCLEdBQWpCLEVBQXNCLGNBQXRCLENBQU47QUNHRTs7QURESGtTLGdCQUFZNWYsR0FBR3lLLFdBQUgsQ0FBZXJJLE9BQWYsQ0FBdUI7QUFBQ2dGLFdBQUtraUIsYUFBTjtBQUFxQnZoQixhQUFPcUw7QUFBNUIsS0FBdkIsQ0FBWjtBQUNBZ0ksY0FBVXdFLFVBQVV2ZCxJQUFwQjtBQUNBb25CLGFBQVN6cEIsR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUI7QUFBQ2dGLFdBQUtnVTtBQUFOLEtBQWpCLENBQVQ7QUFDQW1PLGtCQUFjdnBCLEdBQUd1TixLQUFILENBQVNuTCxPQUFULENBQWlCO0FBQUNnRixXQUFLLEtBQUs5RTtBQUFYLEtBQWpCLENBQWQ7O0FBRUEsUUFBR3NkLFVBQVVtSCxZQUFWLEtBQTBCLFNBQTFCLElBQXVDbkgsVUFBVW1ILFlBQVYsS0FBMEIsU0FBcEU7QUFDQyxZQUFNLElBQUl6cEIsT0FBT29RLEtBQVgsQ0FBaUIsR0FBakIsRUFBc0Isc0JBQXRCLENBQU47QUNTRTs7QURQSDdQLFlBQVEyVSxnQkFBUixDQUF5QnRGLFFBQXpCO0FBRUFuSSxhQUFTMmtCLFdBQVQsQ0FBcUJ0TyxPQUFyQixFQUE4QmxPLFFBQTlCLEVBQXdDO0FBQUN5YyxjQUFRO0FBQVQsS0FBeEM7O0FBR0EsUUFBR0YsT0FBT3pmLE1BQVAsSUFBaUJ5ZixPQUFPRyxlQUEzQjtBQUNDSixhQUFPLElBQVA7O0FBQ0EsVUFBR0MsT0FBTzdyQixNQUFQLEtBQWlCLE9BQXBCO0FBQ0M0ckIsZUFBTyxPQUFQO0FDUUc7O0FBQ0QsYURSSEssU0FBU2xELElBQVQsQ0FDQztBQUFBbUQsZ0JBQVEsTUFBUjtBQUNBQyxnQkFBUSxlQURSO0FBRUFDLHFCQUFhLEVBRmI7QUFHQUMsZ0JBQVFSLE9BQU96ZixNQUhmO0FBSUFrZ0Isa0JBQVUsTUFKVjtBQUtBQyxzQkFBYyxjQUxkO0FBTUEzUyxhQUFLN1YsUUFBUUMsRUFBUixDQUFXLDhCQUFYLEVBQTJDLEVBQTNDLEVBQStDNG5CLElBQS9DO0FBTkwsT0FERCxDQ1FHO0FBU0Q7QUQ1Q0o7QUFBQSxDQURELEU7Ozs7Ozs7Ozs7OztBRUFBL0UsaUJBQWlCLEVBQWpCOztBQUtBQSxlQUFlMkYscUJBQWYsR0FBdUMsVUFBQ2hYLFFBQUQsRUFBV2lULGdCQUFYO0FBQ3RDLE1BQUE3b0IsT0FBQSxFQUFBNnNCLFVBQUEsRUFBQXhpQixRQUFBLEVBQUF5aUIsYUFBQSxFQUFBdFosVUFBQSxFQUFBSSxVQUFBLEVBQUFtWixlQUFBO0FBQUFGLGVBQWEsQ0FBYjtBQUVBQyxrQkFBZ0IsSUFBSW5pQixJQUFKLENBQVMrSixTQUFTbVUsaUJBQWlCcm5CLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRGtULFNBQVNtVSxpQkFBaUJybkIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixDQUFoQjtBQUNBNkksYUFBV2dnQixPQUFPeUMsY0FBYzFaLE9BQWQsRUFBUCxFQUFnQ2tYLE1BQWhDLENBQXVDLFVBQXZDLENBQVg7QUFFQXRxQixZQUFVd0MsR0FBR3dxQixRQUFILENBQVlwb0IsT0FBWixDQUFvQjtBQUFDMkYsV0FBT3FMLFFBQVI7QUFBa0JxWCxpQkFBYTtBQUEvQixHQUFwQixDQUFWO0FBQ0F6WixlQUFheFQsUUFBUWt0QixZQUFyQjtBQUVBdFosZUFBYWlWLG1CQUFtQixJQUFoQztBQUNBa0Usb0JBQWtCLElBQUlwaUIsSUFBSixDQUFTK0osU0FBU21VLGlCQUFpQnJuQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQVQsRUFBZ0RrVCxTQUFTbVUsaUJBQWlCcm5CLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBaEQsRUFBdUYsSUFBRXNyQixjQUFjSyxPQUFkLEVBQXpGLENBQWxCOztBQUVBLE1BQUczWixjQUFjbkosUUFBakIsVUFFSyxJQUFHdUosY0FBY0osVUFBZCxJQUE2QkEsYUFBYW5KLFFBQTdDO0FBQ0p3aUIsaUJBQWEsQ0FBQ0MsZ0JBQWdCQyxlQUFqQixLQUFtQyxLQUFHLEVBQUgsR0FBTSxFQUFOLEdBQVMsSUFBNUMsSUFBb0QsQ0FBakU7QUFESSxTQUVBLElBQUd2WixhQUFhSSxVQUFoQjtBQUNKaVosaUJBQWEsQ0FBQ0MsZ0JBQWdCQyxlQUFqQixLQUFtQyxLQUFHLEVBQUgsR0FBTSxFQUFOLEdBQVMsSUFBNUMsSUFBb0QsQ0FBakU7QUNBQzs7QURFRixTQUFPO0FBQUMsa0JBQWNGO0FBQWYsR0FBUDtBQW5Cc0MsQ0FBdkM7O0FBc0JBNUYsZUFBZW1HLGVBQWYsR0FBaUMsVUFBQ3hYLFFBQUQsRUFBV3lYLFlBQVg7QUFDaEMsTUFBQUMsUUFBQSxFQUFBQyxHQUFBLEVBQUFDLEtBQUEsRUFBQUMsSUFBQSxFQUFBQyxPQUFBLEVBQUFDLE1BQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBLEVBQUFDLFlBQUEsRUFBQUMsTUFBQTtBQUFBRixjQUFZLElBQVo7QUFDQUosU0FBT2pyQixHQUFHd3FCLFFBQUgsQ0FBWXBvQixPQUFaLENBQW9CO0FBQUMyRixXQUFPcUwsUUFBUjtBQUFrQkssYUFBU29YO0FBQTNCLEdBQXBCLENBQVA7QUFHQVMsaUJBQWV0ckIsR0FBR3dxQixRQUFILENBQVlwb0IsT0FBWixDQUNkO0FBQ0MyRixXQUFPcUwsUUFEUjtBQUVDSyxhQUFTO0FBQ1IrWCxXQUFLWDtBQURHLEtBRlY7QUFLQ1ksbUJBQWVSLEtBQUtRO0FBTHJCLEdBRGMsRUFRZDtBQUNDM3RCLFVBQU07QUFDTDZWLGdCQUFVLENBQUM7QUFETjtBQURQLEdBUmMsQ0FBZjs7QUFjQSxNQUFHMlgsWUFBSDtBQUNDRCxnQkFBWUMsWUFBWjtBQUREO0FBSUNOLFlBQVEsSUFBSTdpQixJQUFKLENBQVMrSixTQUFTK1ksS0FBS1EsYUFBTCxDQUFtQnpzQixLQUFuQixDQUF5QixDQUF6QixFQUEyQixDQUEzQixDQUFULENBQVQsRUFBa0RrVCxTQUFTK1ksS0FBS1EsYUFBTCxDQUFtQnpzQixLQUFuQixDQUF5QixDQUF6QixFQUEyQixDQUEzQixDQUFULENBQWxELEVBQTJGLENBQTNGLENBQVI7QUFDQStyQixVQUFNbEQsT0FBT21ELE1BQU1wYSxPQUFOLEtBQWlCb2EsTUFBTUwsT0FBTixLQUFnQixFQUFoQixHQUFtQixFQUFuQixHQUFzQixFQUF0QixHQUF5QixJQUFqRCxFQUF3RDdDLE1BQXhELENBQStELFFBQS9ELENBQU47QUFFQWdELGVBQVc5cUIsR0FBR3dxQixRQUFILENBQVlwb0IsT0FBWixDQUNWO0FBQ0MyRixhQUFPcUwsUUFEUjtBQUVDcVkscUJBQWVWO0FBRmhCLEtBRFUsRUFLVjtBQUNDanRCLFlBQU07QUFDTDZWLGtCQUFVLENBQUM7QUFETjtBQURQLEtBTFUsQ0FBWDs7QUFXQSxRQUFHbVgsUUFBSDtBQUNDTyxrQkFBWVAsUUFBWjtBQW5CRjtBQ2dCRTs7QURLRk0saUJBQWtCQyxhQUFjQSxVQUFVSyxPQUF4QixHQUFxQ0wsVUFBVUssT0FBL0MsR0FBNEQsR0FBOUU7QUFFQVAsV0FBWUYsS0FBS0UsTUFBTCxHQUFpQkYsS0FBS0UsTUFBdEIsR0FBa0MsR0FBOUM7QUFDQUQsWUFBYUQsS0FBS0MsT0FBTCxHQUFrQkQsS0FBS0MsT0FBdkIsR0FBb0MsR0FBakQ7QUFDQUssV0FBUyxJQUFJOXJCLE1BQUosRUFBVDtBQUNBOHJCLFNBQU9HLE9BQVAsR0FBaUI5cUIsT0FBTyxDQUFDd3FCLGVBQWVGLE9BQWYsR0FBeUJDLE1BQTFCLEVBQWtDdHFCLE9BQWxDLENBQTBDLENBQTFDLENBQVAsQ0FBakI7QUFDQTBxQixTQUFPNVgsUUFBUCxHQUFrQixJQUFJeEwsSUFBSixFQUFsQjtBQ0pDLFNES0RuSSxHQUFHd3FCLFFBQUgsQ0FBWWxWLE1BQVosQ0FBbUI3RyxNQUFuQixDQUEwQjtBQUFDckgsU0FBSzZqQixLQUFLN2pCO0FBQVgsR0FBMUIsRUFBMkM7QUFBQzJOLFVBQU13VztBQUFQLEdBQTNDLENDTEM7QUQxQytCLENBQWpDOztBQWtEQTlHLGVBQWVrSCxXQUFmLEdBQTZCLFVBQUN2WSxRQUFELEVBQVdpVCxnQkFBWCxFQUE2QjFCLFVBQTdCLEVBQXlDMEYsVUFBekMsRUFBcUR1QixXQUFyRCxFQUFrRUMsU0FBbEU7QUFDNUIsTUFBQUMsZUFBQSxFQUFBQyxzQkFBQSxFQUFBQyxXQUFBLEVBQUFiLE1BQUEsRUFBQUMsWUFBQSxFQUFBQyxTQUFBLEVBQUFZLFFBQUEsRUFBQWxhLEdBQUE7QUFBQStaLG9CQUFrQixJQUFJM2pCLElBQUosQ0FBUytKLFNBQVNtVSxpQkFBaUJybkIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEa1QsU0FBU21VLGlCQUFpQnJuQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQWxCO0FBQ0FndEIsZ0JBQWNGLGdCQUFnQm5CLE9BQWhCLEVBQWQ7QUFDQW9CLDJCQUF5QmxFLE9BQU9pRSxlQUFQLEVBQXdCaEUsTUFBeEIsQ0FBK0IsVUFBL0IsQ0FBekI7QUFFQXFELFdBQVN2cUIsT0FBTyxDQUFFeXBCLGFBQVcyQixXQUFaLEdBQTJCckgsVUFBM0IsR0FBd0NrSCxTQUF6QyxFQUFvRGhyQixPQUFwRCxDQUE0RCxDQUE1RCxDQUFQLENBQVQ7QUFDQXdxQixjQUFZcnJCLEdBQUd3cUIsUUFBSCxDQUFZcG9CLE9BQVosQ0FDWDtBQUNDMkYsV0FBT3FMLFFBRFI7QUFFQ3NYLGtCQUFjO0FBQ2J3QixZQUFNSDtBQURPO0FBRmYsR0FEVyxFQU9YO0FBQ0NqdUIsVUFBTTtBQUNMNlYsZ0JBQVUsQ0FBQztBQUROO0FBRFAsR0FQVyxDQUFaO0FBYUF5WCxpQkFBa0JDLGFBQWNBLFVBQVVLLE9BQXhCLEdBQXFDTCxVQUFVSyxPQUEvQyxHQUE0RCxHQUE5RTtBQUVBM1osUUFBTSxJQUFJNUosSUFBSixFQUFOO0FBQ0E4akIsYUFBVyxJQUFJeHNCLE1BQUosRUFBWDtBQUNBd3NCLFdBQVM3a0IsR0FBVCxHQUFlcEgsR0FBR3dxQixRQUFILENBQVkyQixVQUFaLEVBQWY7QUFDQUYsV0FBU1IsYUFBVCxHQUF5QnBGLGdCQUF6QjtBQUNBNEYsV0FBU3ZCLFlBQVQsR0FBd0JxQixzQkFBeEI7QUFDQUUsV0FBU2xrQixLQUFULEdBQWlCcUwsUUFBakI7QUFDQTZZLFdBQVN4QixXQUFULEdBQXVCbUIsV0FBdkI7QUFDQUssV0FBU0osU0FBVCxHQUFxQkEsU0FBckI7QUFDQUksV0FBU3RILFVBQVQsR0FBc0JBLFVBQXRCO0FBQ0FzSCxXQUFTZCxNQUFULEdBQWtCQSxNQUFsQjtBQUNBYyxXQUFTUCxPQUFULEdBQW1COXFCLE9BQU8sQ0FBQ3dxQixlQUFlRCxNQUFoQixFQUF3QnRxQixPQUF4QixDQUFnQyxDQUFoQyxDQUFQLENBQW5CO0FBQ0FvckIsV0FBU3hZLE9BQVQsR0FBbUIxQixHQUFuQjtBQUNBa2EsV0FBU3RZLFFBQVQsR0FBb0I1QixHQUFwQjtBQ0pDLFNES0QvUixHQUFHd3FCLFFBQUgsQ0FBWWxWLE1BQVosQ0FBbUI2USxNQUFuQixDQUEwQjhGLFFBQTFCLENDTEM7QUQ3QjJCLENBQTdCOztBQW9DQXhILGVBQWUySCxpQkFBZixHQUFtQyxVQUFDaFosUUFBRDtBQ0hqQyxTRElEcFQsR0FBR3lLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDOUMsV0FBT3FMLFFBQVI7QUFBa0JvTCxtQkFBZTtBQUFqQyxHQUFwQixFQUE0RHBKLEtBQTVELEVDSkM7QURHaUMsQ0FBbkM7O0FBR0FxUCxlQUFlNEgsaUJBQWYsR0FBbUMsVUFBQ2hHLGdCQUFELEVBQW1CalQsUUFBbkI7QUFDbEMsTUFBQWtaLGFBQUE7QUFBQUEsa0JBQWdCLElBQUk3dUIsS0FBSixFQUFoQjtBQUNBdUMsS0FBR3dxQixRQUFILENBQVkzZixJQUFaLENBQ0M7QUFDQzRnQixtQkFBZXBGLGdCQURoQjtBQUVDdGUsV0FBT3FMLFFBRlI7QUFHQ3FYLGlCQUFhO0FBQUMzZixXQUFLLENBQUMsU0FBRCxFQUFZLG9CQUFaO0FBQU47QUFIZCxHQURELEVBTUM7QUFDQ2hOLFVBQU07QUFBQzJWLGVBQVM7QUFBVjtBQURQLEdBTkQsRUFTRWpWLE9BVEYsQ0FTVSxVQUFDeXNCLElBQUQ7QUNHUCxXREZGcUIsY0FBYzN0QixJQUFkLENBQW1Cc3NCLEtBQUt4WCxPQUF4QixDQ0VFO0FEWkg7O0FBWUEsTUFBRzZZLGNBQWNydEIsTUFBZCxHQUF1QixDQUExQjtBQ0dHLFdERkYwTCxFQUFFcEMsSUFBRixDQUFPK2pCLGFBQVAsRUFBc0IsVUFBQ0MsR0FBRDtBQ0dsQixhREZIOUgsZUFBZW1HLGVBQWYsQ0FBK0J4WCxRQUEvQixFQUF5Q21aLEdBQXpDLENDRUc7QURISixNQ0VFO0FBR0Q7QURwQmdDLENBQW5DOztBQWtCQTlILGVBQWUrSCxXQUFmLEdBQTZCLFVBQUNwWixRQUFELEVBQVdpVCxnQkFBWDtBQUM1QixNQUFBeGUsUUFBQSxFQUFBeWlCLGFBQUEsRUFBQXJlLE9BQUEsRUFBQW1GLFVBQUE7QUFBQW5GLFlBQVUsSUFBSXhPLEtBQUosRUFBVjtBQUNBMlQsZUFBYWlWLG1CQUFtQixJQUFoQztBQUNBaUUsa0JBQWdCLElBQUluaUIsSUFBSixDQUFTK0osU0FBU21VLGlCQUFpQnJuQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQVQsRUFBZ0RrVCxTQUFTbVUsaUJBQWlCcm5CLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBaEQsRUFBdUYsQ0FBdkYsQ0FBaEI7QUFDQTZJLGFBQVdnZ0IsT0FBT3lDLGNBQWMxWixPQUFkLEVBQVAsRUFBZ0NrWCxNQUFoQyxDQUF1QyxVQUF2QyxDQUFYO0FBRUE5bkIsS0FBR2lNLE9BQUgsQ0FBV3BCLElBQVgsR0FBa0JyTSxPQUFsQixDQUEwQixVQUFDRSxDQUFEO0FBQ3pCLFFBQUErdEIsV0FBQTtBQUFBQSxrQkFBY3pzQixHQUFHMHNCLGtCQUFILENBQXNCdHFCLE9BQXRCLENBQ2I7QUFDQzJGLGFBQU9xTCxRQURSO0FBRUNuVyxjQUFReUIsRUFBRU4sSUFGWDtBQUdDdXVCLG1CQUFhO0FBQ1pULGNBQU1ya0I7QUFETTtBQUhkLEtBRGEsRUFRYjtBQUNDNEwsZUFBUyxDQUFDO0FBRFgsS0FSYSxDQUFkOztBQWFBLFFBQUcsQ0FBSWdaLFdBQVAsVUFJSyxJQUFHQSxZQUFZRSxXQUFaLEdBQTBCdmIsVUFBMUIsSUFBeUNxYixZQUFZRyxTQUFaLEtBQXlCLFNBQXJFO0FDQ0QsYURBSDNnQixRQUFRdE4sSUFBUixDQUFhRCxDQUFiLENDQUc7QUREQyxXQUdBLElBQUcrdEIsWUFBWUUsV0FBWixHQUEwQnZiLFVBQTFCLElBQXlDcWIsWUFBWUcsU0FBWixLQUF5QixXQUFyRSxVQUdBLElBQUdILFlBQVlFLFdBQVosSUFBMkJ2YixVQUE5QjtBQ0RELGFERUhuRixRQUFRdE4sSUFBUixDQUFhRCxDQUFiLENDRkc7QUFDRDtBRHhCSjtBQTJCQSxTQUFPdU4sT0FBUDtBQWpDNEIsQ0FBN0I7O0FBbUNBd1ksZUFBZW9JLGdCQUFmLEdBQWtDO0FBQ2pDLE1BQUFDLFlBQUE7QUFBQUEsaUJBQWUsSUFBSXJ2QixLQUFKLEVBQWY7QUFDQXVDLEtBQUdpTSxPQUFILENBQVdwQixJQUFYLEdBQWtCck0sT0FBbEIsQ0FBMEIsVUFBQ0UsQ0FBRDtBQ0V2QixXRERGb3VCLGFBQWFudUIsSUFBYixDQUFrQkQsRUFBRU4sSUFBcEIsQ0NDRTtBREZIO0FBR0EsU0FBTzB1QixZQUFQO0FBTGlDLENBQWxDOztBQVFBckksZUFBZWdDLDRCQUFmLEdBQThDLFVBQUNKLGdCQUFELEVBQW1CalQsUUFBbkI7QUFDN0MsTUFBQTJaLEdBQUEsRUFBQWpCLGVBQUEsRUFBQUMsc0JBQUEsRUFBQWhCLEdBQUEsRUFBQUMsS0FBQSxFQUFBVSxPQUFBLEVBQUFQLE1BQUEsRUFBQWxmLE9BQUEsRUFBQTZnQixZQUFBLEVBQUFFLFdBQUEsRUFBQUMsYUFBQSxFQUFBQyxnQkFBQSxFQUFBdkksVUFBQTs7QUFBQSxNQUFHMEIsbUJBQW9Cd0IsU0FBU0MsTUFBVCxDQUFnQixRQUFoQixDQUF2QjtBQUNDO0FDR0M7O0FERkYsTUFBR3pCLHFCQUFxQndCLFNBQVNDLE1BQVQsQ0FBZ0IsUUFBaEIsQ0FBeEI7QUFFQ3JELG1CQUFlNEgsaUJBQWYsQ0FBaUNoRyxnQkFBakMsRUFBbURqVCxRQUFuRDtBQUVBK1gsYUFBUyxDQUFUO0FBQ0EyQixtQkFBZXJJLGVBQWVvSSxnQkFBZixFQUFmO0FBQ0E3QixZQUFRLElBQUk3aUIsSUFBSixDQUFTK0osU0FBU21VLGlCQUFpQnJuQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQVQsRUFBZ0RrVCxTQUFTbVUsaUJBQWlCcm5CLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBaEQsRUFBdUYsQ0FBdkYsQ0FBUjtBQUNBK3JCLFVBQU1sRCxPQUFPbUQsTUFBTXBhLE9BQU4sS0FBaUJvYSxNQUFNTCxPQUFOLEtBQWdCLEVBQWhCLEdBQW1CLEVBQW5CLEdBQXNCLEVBQXRCLEdBQXlCLElBQWpELEVBQXdEN0MsTUFBeEQsQ0FBK0QsVUFBL0QsQ0FBTjtBQUNBOW5CLE9BQUd3cUIsUUFBSCxDQUFZM2YsSUFBWixDQUNDO0FBQ0M2ZixvQkFBY0ssR0FEZjtBQUVDaGpCLGFBQU9xTCxRQUZSO0FBR0NxWCxtQkFBYTtBQUNaM2YsYUFBS2dpQjtBQURPO0FBSGQsS0FERCxFQVFFdHVCLE9BUkYsQ0FRVSxVQUFDMnVCLENBQUQ7QUNBTixhRENIaEMsVUFBVWdDLEVBQUVoQyxNQ0RUO0FEUko7QUFXQTZCLGtCQUFjaHRCLEdBQUd3cUIsUUFBSCxDQUFZcG9CLE9BQVosQ0FBb0I7QUFBQzJGLGFBQU9xTDtBQUFSLEtBQXBCLEVBQXVDO0FBQUN0VixZQUFNO0FBQUM2VixrQkFBVSxDQUFDO0FBQVo7QUFBUCxLQUF2QyxDQUFkO0FBQ0ErWCxjQUFVc0IsWUFBWXRCLE9BQXRCO0FBQ0F3Qix1QkFBbUIsQ0FBbkI7O0FBQ0EsUUFBR3hCLFVBQVUsQ0FBYjtBQUNDLFVBQUdQLFNBQVMsQ0FBWjtBQUNDK0IsMkJBQW1CaGIsU0FBU3daLFVBQVFQLE1BQWpCLElBQTJCLENBQTlDO0FBREQ7QUFJQytCLDJCQUFtQixDQUFuQjtBQUxGO0FDV0c7O0FBQ0QsV0RMRmx0QixHQUFHaUksTUFBSCxDQUFVcU4sTUFBVixDQUFpQjdHLE1BQWpCLENBQ0M7QUFDQ3JILFdBQUtnTTtBQUROLEtBREQsRUFJQztBQUNDMkIsWUFBTTtBQUNMMlcsaUJBQVNBLE9BREo7QUFFTCxvQ0FBNEJ3QjtBQUZ2QjtBQURQLEtBSkQsQ0NLRTtBRGxDSDtBQTBDQ0Qsb0JBQWdCeEksZUFBZTJGLHFCQUFmLENBQXFDaFgsUUFBckMsRUFBK0NpVCxnQkFBL0MsQ0FBaEI7O0FBQ0EsUUFBRzRHLGNBQWMsWUFBZCxNQUErQixDQUFsQztBQUVDeEkscUJBQWU0SCxpQkFBZixDQUFpQ2hHLGdCQUFqQyxFQUFtRGpULFFBQW5EO0FBRkQ7QUFLQ3VSLG1CQUFhRixlQUFlMkgsaUJBQWYsQ0FBaUNoWixRQUFqQyxDQUFiO0FBR0EwWixxQkFBZXJJLGVBQWVvSSxnQkFBZixFQUFmO0FBQ0FmLHdCQUFrQixJQUFJM2pCLElBQUosQ0FBUytKLFNBQVNtVSxpQkFBaUJybkIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFULEVBQWdEa1QsU0FBU21VLGlCQUFpQnJuQixLQUFqQixDQUF1QixDQUF2QixFQUF5QixDQUF6QixDQUFULENBQWhELEVBQXVGLENBQXZGLENBQWxCO0FBQ0Erc0IsK0JBQXlCbEUsT0FBT2lFLGVBQVAsRUFBd0JoRSxNQUF4QixDQUErQixVQUEvQixDQUF6QjtBQUNBOW5CLFNBQUd3cUIsUUFBSCxDQUFZNXJCLE1BQVosQ0FDQztBQUNDOHJCLHNCQUFjcUIsc0JBRGY7QUFFQ2hrQixlQUFPcUwsUUFGUjtBQUdDcVgscUJBQWE7QUFDWjNmLGVBQUtnaUI7QUFETztBQUhkLE9BREQ7QUFVQXJJLHFCQUFlNEgsaUJBQWYsQ0FBaUNoRyxnQkFBakMsRUFBbURqVCxRQUFuRDtBQUdBbkgsZ0JBQVV3WSxlQUFlK0gsV0FBZixDQUEyQnBaLFFBQTNCLEVBQXFDaVQsZ0JBQXJDLENBQVY7O0FBQ0EsVUFBR3BhLFdBQWFBLFFBQVFoTixNQUFSLEdBQWUsQ0FBL0I7QUFDQzBMLFVBQUVwQyxJQUFGLENBQU8wRCxPQUFQLEVBQWdCLFVBQUN2TixDQUFEO0FDUFYsaUJEUUwrbEIsZUFBZWtILFdBQWYsQ0FBMkJ2WSxRQUEzQixFQUFxQ2lULGdCQUFyQyxFQUF1RDFCLFVBQXZELEVBQW1Fc0ksY0FBYyxZQUFkLENBQW5FLEVBQWdHdnVCLEVBQUVOLElBQWxHLEVBQXdHTSxFQUFFbXRCLFNBQTFHLENDUks7QURPTjtBQTFCRjtBQ3NCRzs7QURPSGtCLFVBQU1sRixPQUFPLElBQUkxZixJQUFKLENBQVMrSixTQUFTbVUsaUJBQWlCcm5CLEtBQWpCLENBQXVCLENBQXZCLEVBQXlCLENBQXpCLENBQVQsQ0FBVCxFQUFnRGtULFNBQVNtVSxpQkFBaUJybkIsS0FBakIsQ0FBdUIsQ0FBdkIsRUFBeUIsQ0FBekIsQ0FBVCxDQUFoRCxFQUF1RixDQUF2RixFQUEwRjRSLE9BQTFGLEVBQVAsRUFBNEdrWCxNQUE1RyxDQUFtSCxRQUFuSCxDQUFOO0FDTEUsV0RNRnJELGVBQWVnQyw0QkFBZixDQUE0Q3NHLEdBQTVDLEVBQWlEM1osUUFBakQsQ0NORTtBQUNEO0FEdkUyQyxDQUE5Qzs7QUE4RUFxUixlQUFlQyxXQUFmLEdBQTZCLFVBQUN0UixRQUFELEVBQVc4VCxZQUFYLEVBQXlCMUMsU0FBekIsRUFBb0M0SSxXQUFwQyxFQUFpRHZsQixRQUFqRCxFQUEyRDhjLFVBQTNEO0FBQzVCLE1BQUFqbUIsQ0FBQSxFQUFBdU4sT0FBQSxFQUFBb2hCLFdBQUEsRUFBQXRiLEdBQUEsRUFBQW5TLENBQUEsRUFBQW1JLEtBQUEsRUFBQXVsQixnQkFBQTtBQUFBdmxCLFVBQVEvSCxHQUFHaUksTUFBSCxDQUFVN0YsT0FBVixDQUFrQmdSLFFBQWxCLENBQVI7QUFFQW5ILFlBQVVsRSxNQUFNa0UsT0FBTixJQUFpQixJQUFJeE8sS0FBSixFQUEzQjtBQUVBNHZCLGdCQUFjMWlCLEVBQUU0aUIsVUFBRixDQUFhckcsWUFBYixFQUEyQmpiLE9BQTNCLENBQWQ7QUFFQXZOLE1BQUltcEIsUUFBSjtBQUNBOVYsUUFBTXJULEVBQUU4dUIsRUFBUjtBQUVBRixxQkFBbUIsSUFBSTd0QixNQUFKLEVBQW5COztBQUdBLE1BQUdzSSxNQUFNRyxPQUFOLEtBQW1CLElBQXRCO0FBQ0NvbEIscUJBQWlCcGxCLE9BQWpCLEdBQTJCLElBQTNCO0FBQ0FvbEIscUJBQWlCbGMsVUFBakIsR0FBOEIsSUFBSWpKLElBQUosRUFBOUI7QUNSQzs7QURXRm1sQixtQkFBaUJyaEIsT0FBakIsR0FBMkJpYixZQUEzQjtBQUNBb0csbUJBQWlCM1osUUFBakIsR0FBNEI1QixHQUE1QjtBQUNBdWIsbUJBQWlCMVosV0FBakIsR0FBK0J3WixXQUEvQjtBQUNBRSxtQkFBaUJ6bEIsUUFBakIsR0FBNEIsSUFBSU0sSUFBSixDQUFTTixRQUFULENBQTVCO0FBQ0F5bEIsbUJBQWlCRyxVQUFqQixHQUE4QjlJLFVBQTlCO0FBRUEva0IsTUFBSUksR0FBR2lJLE1BQUgsQ0FBVXFOLE1BQVYsQ0FBaUI3RyxNQUFqQixDQUF3QjtBQUFDckgsU0FBS2dNO0FBQU4sR0FBeEIsRUFBeUM7QUFBQzJCLFVBQU11WTtBQUFQLEdBQXpDLENBQUo7O0FBQ0EsTUFBRzF0QixDQUFIO0FBQ0MrSyxNQUFFcEMsSUFBRixDQUFPOGtCLFdBQVAsRUFBb0IsVUFBQ3B3QixNQUFEO0FBQ25CLFVBQUF5d0IsR0FBQTtBQUFBQSxZQUFNLElBQUlqdUIsTUFBSixFQUFOO0FBQ0FpdUIsVUFBSXRtQixHQUFKLEdBQVVwSCxHQUFHMHNCLGtCQUFILENBQXNCUCxVQUF0QixFQUFWO0FBQ0F1QixVQUFJZixXQUFKLEdBQWtCanVCLEVBQUVvcEIsTUFBRixDQUFTLFVBQVQsQ0FBbEI7QUFDQTRGLFVBQUlDLFFBQUosR0FBZVAsV0FBZjtBQUNBTSxVQUFJM2xCLEtBQUosR0FBWXFMLFFBQVo7QUFDQXNhLFVBQUlkLFNBQUosR0FBZ0IsU0FBaEI7QUFDQWMsVUFBSXp3QixNQUFKLEdBQWFBLE1BQWI7QUFDQXl3QixVQUFJamEsT0FBSixHQUFjMUIsR0FBZDtBQ0xHLGFETUgvUixHQUFHMHNCLGtCQUFILENBQXNCdkcsTUFBdEIsQ0FBNkJ1SCxHQUE3QixDQ05HO0FESEo7QUNLQztBRC9CMEIsQ0FBN0IsQzs7Ozs7Ozs7Ozs7QUUvUEFwd0IsTUFBTSxDQUFDK1csT0FBUCxDQUFlLFlBQVk7QUFFekIsTUFBSS9XLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQnF3QixJQUFoQixJQUF3QnR3QixNQUFNLENBQUNDLFFBQVAsQ0FBZ0Jxd0IsSUFBaEIsQ0FBcUJDLFVBQWpELEVBQTZEO0FBRTNELFFBQUlDLFFBQVEsR0FBRzNuQixPQUFPLENBQUMsZUFBRCxDQUF0QixDQUYyRCxDQUczRDs7O0FBQ0EsUUFBSTRuQixJQUFJLEdBQUd6d0IsTUFBTSxDQUFDQyxRQUFQLENBQWdCcXdCLElBQWhCLENBQXFCQyxVQUFoQztBQUVBLFFBQUlHLE9BQU8sR0FBRyxJQUFkO0FBRUFGLFlBQVEsQ0FBQ0csV0FBVCxDQUFxQkYsSUFBckIsRUFBMkJ6d0IsTUFBTSxDQUFDK2xCLGVBQVAsQ0FBdUIsWUFBWTtBQUM1RCxVQUFJLENBQUMySyxPQUFMLEVBQ0U7QUFDRkEsYUFBTyxHQUFHLEtBQVY7QUFFQXptQixhQUFPLENBQUNnZixJQUFSLENBQWEsWUFBYixFQUw0RCxDQU01RDs7QUFDQSxVQUFJMkgsVUFBVSxHQUFHLFVBQVU3ZCxJQUFWLEVBQWdCO0FBQy9CLFlBQUk4ZCxPQUFPLEdBQUcsS0FBRzlkLElBQUksQ0FBQytkLFdBQUwsRUFBSCxHQUFzQixHQUF0QixJQUEyQi9kLElBQUksQ0FBQ2dlLFFBQUwsS0FBZ0IsQ0FBM0MsSUFBOEMsR0FBOUMsR0FBbURoZSxJQUFJLENBQUNzYSxPQUFMLEVBQWpFO0FBQ0EsZUFBT3dELE9BQVA7QUFDRCxPQUhELENBUDRELENBVzVEOzs7QUFDQSxVQUFJRyxTQUFTLEdBQUcsWUFBWTtBQUMxQixZQUFJQyxJQUFJLEdBQUcsSUFBSXBtQixJQUFKLEVBQVgsQ0FEMEIsQ0FDRDs7QUFDekIsWUFBSXFtQixPQUFPLEdBQUcsSUFBSXJtQixJQUFKLENBQVNvbUIsSUFBSSxDQUFDM2QsT0FBTCxLQUFpQixLQUFHLElBQUgsR0FBUSxJQUFsQyxDQUFkLENBRjBCLENBRStCOztBQUN6RCxlQUFPNGQsT0FBUDtBQUNELE9BSkQsQ0FaNEQsQ0FpQjVEOzs7QUFDQSxVQUFJQyxpQkFBaUIsR0FBRyxVQUFVeGYsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQ25ELFlBQUkybUIsT0FBTyxHQUFHemYsVUFBVSxDQUFDcEUsSUFBWCxDQUFnQjtBQUFDLG1CQUFROUMsS0FBSyxDQUFDLEtBQUQsQ0FBZDtBQUFzQixxQkFBVTtBQUFDNG1CLGVBQUcsRUFBRUwsU0FBUztBQUFmO0FBQWhDLFNBQWhCLENBQWQ7QUFDQSxlQUFPSSxPQUFPLENBQUN0WixLQUFSLEVBQVA7QUFDRCxPQUhELENBbEI0RCxDQXNCNUQ7OztBQUNBLFVBQUl3WixZQUFZLEdBQUcsVUFBVTNmLFVBQVYsRUFBc0JsSCxLQUF0QixFQUE2QjtBQUM5QyxZQUFJMm1CLE9BQU8sR0FBR3pmLFVBQVUsQ0FBQ3BFLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUzlDLEtBQUssQ0FBQyxLQUFEO0FBQWYsU0FBaEIsQ0FBZDtBQUNBLGVBQU8ybUIsT0FBTyxDQUFDdFosS0FBUixFQUFQO0FBQ0QsT0FIRCxDQXZCNEQsQ0EyQjVEOzs7QUFDQSxVQUFJeVosU0FBUyxHQUFHLFVBQVU1ZixVQUFWLEVBQXNCbEgsS0FBdEIsRUFBNkI7QUFDM0MsWUFBSTJTLEtBQUssR0FBR3pMLFVBQVUsQ0FBQzdNLE9BQVgsQ0FBbUI7QUFBQyxpQkFBTzJGLEtBQUssQ0FBQyxPQUFEO0FBQWIsU0FBbkIsQ0FBWjtBQUNBLFlBQUkzSixJQUFJLEdBQUdzYyxLQUFLLENBQUN0YyxJQUFqQjtBQUNBLGVBQU9BLElBQVA7QUFDRCxPQUpELENBNUI0RCxDQWlDNUQ7OztBQUNBLFVBQUkwd0IsU0FBUyxHQUFHLFVBQVU3ZixVQUFWLEVBQXNCbEgsS0FBdEIsRUFBNkI7QUFDM0MsWUFBSSttQixTQUFTLEdBQUcsQ0FBaEI7QUFDQSxZQUFJQyxNQUFNLEdBQUcvdUIsRUFBRSxDQUFDeUssV0FBSCxDQUFlSSxJQUFmLENBQW9CO0FBQUMsbUJBQVM5QyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQXBCLEVBQTZDO0FBQUMyQyxnQkFBTSxFQUFFO0FBQUNySSxnQkFBSSxFQUFFO0FBQVA7QUFBVCxTQUE3QyxDQUFiO0FBQ0Ewc0IsY0FBTSxDQUFDdndCLE9BQVAsQ0FBZSxVQUFVd3dCLEtBQVYsRUFBaUI7QUFDOUIsY0FBSTNzQixJQUFJLEdBQUc0TSxVQUFVLENBQUM3TSxPQUFYLENBQW1CO0FBQUMsbUJBQU00c0IsS0FBSyxDQUFDLE1BQUQ7QUFBWixXQUFuQixDQUFYOztBQUNBLGNBQUczc0IsSUFBSSxJQUFLeXNCLFNBQVMsR0FBR3pzQixJQUFJLENBQUMyUyxVQUE3QixFQUF5QztBQUN2QzhaLHFCQUFTLEdBQUd6c0IsSUFBSSxDQUFDMlMsVUFBakI7QUFDRDtBQUNGLFNBTEQ7QUFNQSxlQUFPOFosU0FBUDtBQUNELE9BVkQsQ0FsQzRELENBNkM1RDs7O0FBQ0EsVUFBSUcsWUFBWSxHQUFHLFVBQVVoZ0IsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQzlDLFlBQUltSCxHQUFHLEdBQUdELFVBQVUsQ0FBQ3BFLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUzlDLEtBQUssQ0FBQyxLQUFEO0FBQWYsU0FBaEIsRUFBeUM7QUFBQ2pLLGNBQUksRUFBRTtBQUFDNlYsb0JBQVEsRUFBRSxDQUFDO0FBQVosV0FBUDtBQUF1QndSLGVBQUssRUFBRTtBQUE5QixTQUF6QyxDQUFWO0FBQ0EsWUFBSStKLE1BQU0sR0FBR2hnQixHQUFHLENBQUNuRSxLQUFKLEVBQWI7QUFDQSxZQUFHbWtCLE1BQU0sQ0FBQ2p3QixNQUFQLEdBQWdCLENBQW5CLEVBQ0UsSUFBSWt3QixHQUFHLEdBQUdELE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVXZiLFFBQXBCO0FBQ0EsZUFBT3diLEdBQVA7QUFDSCxPQU5ELENBOUM0RCxDQXFENUQ7OztBQUNBLFVBQUlDLGdCQUFnQixHQUFHLFVBQVVuZ0IsVUFBVixFQUFzQmxILEtBQXRCLEVBQTZCO0FBQ2xELFlBQUlzbkIsT0FBTyxHQUFHLENBQWQ7QUFDQSxZQUFJQyxPQUFPLEdBQUcsQ0FBZDtBQUNBLFlBQUlDLEtBQUssR0FBR3RnQixVQUFVLENBQUNwRSxJQUFYLENBQWdCO0FBQUMsbUJBQVM5QyxLQUFLLENBQUMsS0FBRDtBQUFmLFNBQWhCLENBQVo7QUFDQXduQixhQUFLLENBQUMvd0IsT0FBTixDQUFjLFVBQVVneEIsSUFBVixFQUFnQjtBQUM1QixjQUFJQyxJQUFJLEdBQUdDLEdBQUcsQ0FBQ0gsS0FBSixDQUFVMWtCLElBQVYsQ0FBZTtBQUFDLG9CQUFPMmtCLElBQUksQ0FBQyxLQUFEO0FBQVosV0FBZixDQUFYO0FBQ0FDLGNBQUksQ0FBQ2p4QixPQUFMLENBQWEsVUFBVW14QixHQUFWLEVBQWU7QUFDMUJOLG1CQUFPLEdBQUdNLEdBQUcsQ0FBQ0MsUUFBSixDQUFhMXJCLElBQXZCO0FBQ0FvckIsbUJBQU8sSUFBSUQsT0FBWDtBQUNELFdBSEQ7QUFJRCxTQU5EO0FBT0EsZUFBT0MsT0FBUDtBQUNELE9BWkQsQ0F0RDRELENBbUU1RDs7O0FBQ0EsVUFBSU8scUJBQXFCLEdBQUcsVUFBVTVnQixVQUFWLEVBQXNCbEgsS0FBdEIsRUFBNkI7QUFDdkQsWUFBSXNuQixPQUFPLEdBQUcsQ0FBZDtBQUNBLFlBQUlDLE9BQU8sR0FBRyxDQUFkO0FBQ0EsWUFBSUMsS0FBSyxHQUFHdGdCLFVBQVUsQ0FBQ3BFLElBQVgsQ0FBZ0I7QUFBQyxtQkFBUzlDLEtBQUssQ0FBQyxLQUFEO0FBQWYsU0FBaEIsQ0FBWjtBQUNBd25CLGFBQUssQ0FBQy93QixPQUFOLENBQWMsVUFBVWd4QixJQUFWLEVBQWdCO0FBQzVCLGNBQUlDLElBQUksR0FBR0MsR0FBRyxDQUFDSCxLQUFKLENBQVUxa0IsSUFBVixDQUFlO0FBQUMsb0JBQVEya0IsSUFBSSxDQUFDLEtBQUQsQ0FBYjtBQUFzQiwwQkFBYztBQUFDYixpQkFBRyxFQUFFTCxTQUFTO0FBQWY7QUFBcEMsV0FBZixDQUFYO0FBQ0FtQixjQUFJLENBQUNqeEIsT0FBTCxDQUFhLFVBQVVteEIsR0FBVixFQUFlO0FBQzFCTixtQkFBTyxHQUFHTSxHQUFHLENBQUNDLFFBQUosQ0FBYTFyQixJQUF2QjtBQUNBb3JCLG1CQUFPLElBQUlELE9BQVg7QUFDRCxXQUhEO0FBSUQsU0FORDtBQU9BLGVBQU9DLE9BQVA7QUFDRCxPQVpELENBcEU0RCxDQWlGNUQ7OztBQUNBdHZCLFFBQUUsQ0FBQ2lJLE1BQUgsQ0FBVTRDLElBQVYsQ0FBZTtBQUFDLG1CQUFVO0FBQVgsT0FBZixFQUFpQ3JNLE9BQWpDLENBQXlDLFVBQVV1SixLQUFWLEVBQWlCO0FBQ3hEL0gsVUFBRSxDQUFDOHZCLGtCQUFILENBQXNCM0osTUFBdEIsQ0FBNkI7QUFDM0JwZSxlQUFLLEVBQUVBLEtBQUssQ0FBQyxLQUFELENBRGU7QUFFM0Jnb0Isb0JBQVUsRUFBRWhvQixLQUFLLENBQUMsTUFBRCxDQUZVO0FBRzNCMmpCLGlCQUFPLEVBQUUzakIsS0FBSyxDQUFDLFNBQUQsQ0FIYTtBQUkzQmlvQixvQkFBVSxFQUFFbkIsU0FBUyxDQUFDN3VCLEVBQUUsQ0FBQ3VOLEtBQUosRUFBV3hGLEtBQVgsQ0FKTTtBQUszQjBMLGlCQUFPLEVBQUUsSUFBSXRMLElBQUosRUFMa0I7QUFNM0I4bkIsaUJBQU8sRUFBQztBQUNOMWlCLGlCQUFLLEVBQUVxaEIsWUFBWSxDQUFDNXVCLEVBQUUsQ0FBQ3lLLFdBQUosRUFBaUIxQyxLQUFqQixDQURiO0FBRU51Qyx5QkFBYSxFQUFFc2tCLFlBQVksQ0FBQzV1QixFQUFFLENBQUNzSyxhQUFKLEVBQW1CdkMsS0FBbkIsQ0FGckI7QUFHTmlOLHNCQUFVLEVBQUU4WixTQUFTLENBQUM5dUIsRUFBRSxDQUFDdU4sS0FBSixFQUFXeEYsS0FBWDtBQUhmLFdBTm1CO0FBVzNCbW9CLGtCQUFRLEVBQUM7QUFDUEMsaUJBQUssRUFBRXZCLFlBQVksQ0FBQzV1QixFQUFFLENBQUNtd0IsS0FBSixFQUFXcG9CLEtBQVgsQ0FEWjtBQUVQcW9CLGlCQUFLLEVBQUV4QixZQUFZLENBQUM1dUIsRUFBRSxDQUFDb3dCLEtBQUosRUFBV3JvQixLQUFYLENBRlo7QUFHUHNvQixzQkFBVSxFQUFFekIsWUFBWSxDQUFDNXVCLEVBQUUsQ0FBQ3F3QixVQUFKLEVBQWdCdG9CLEtBQWhCLENBSGpCO0FBSVB1b0IsMEJBQWMsRUFBRTFCLFlBQVksQ0FBQzV1QixFQUFFLENBQUNzd0IsY0FBSixFQUFvQnZvQixLQUFwQixDQUpyQjtBQUtQd29CLHFCQUFTLEVBQUUzQixZQUFZLENBQUM1dUIsRUFBRSxDQUFDdXdCLFNBQUosRUFBZXhvQixLQUFmLENBTGhCO0FBTVB5b0IsbUNBQXVCLEVBQUV2QixZQUFZLENBQUNqdkIsRUFBRSxDQUFDdXdCLFNBQUosRUFBZXhvQixLQUFmLENBTjlCO0FBT1Awb0IsdUJBQVcsRUFBRWhDLGlCQUFpQixDQUFDenVCLEVBQUUsQ0FBQ213QixLQUFKLEVBQVdwb0IsS0FBWCxDQVB2QjtBQVFQMm9CLHVCQUFXLEVBQUVqQyxpQkFBaUIsQ0FBQ3p1QixFQUFFLENBQUNvd0IsS0FBSixFQUFXcm9CLEtBQVgsQ0FSdkI7QUFTUDRvQiwyQkFBZSxFQUFFbEMsaUJBQWlCLENBQUN6dUIsRUFBRSxDQUFDdXdCLFNBQUosRUFBZXhvQixLQUFmO0FBVDNCLFdBWGtCO0FBc0IzQjZvQixhQUFHLEVBQUU7QUFDSEMsaUJBQUssRUFBRWpDLFlBQVksQ0FBQzV1QixFQUFFLENBQUM4d0IsU0FBSixFQUFlL29CLEtBQWYsQ0FEaEI7QUFFSHduQixpQkFBSyxFQUFFWCxZQUFZLENBQUM1dUIsRUFBRSxDQUFDK3dCLFNBQUosRUFBZWhwQixLQUFmLENBRmhCO0FBR0hpcEIsK0JBQW1CLEVBQUUvQixZQUFZLENBQUNqdkIsRUFBRSxDQUFDK3dCLFNBQUosRUFBZWhwQixLQUFmLENBSDlCO0FBSUhrcEIsa0NBQXNCLEVBQUU3QixnQkFBZ0IsQ0FBQ3B2QixFQUFFLENBQUMrd0IsU0FBSixFQUFlaHBCLEtBQWYsQ0FKckM7QUFLSG1wQixvQkFBUSxFQUFFdEMsWUFBWSxDQUFDNXVCLEVBQUUsQ0FBQ214QixZQUFKLEVBQWtCcHBCLEtBQWxCLENBTG5CO0FBTUhxcEIsdUJBQVcsRUFBRTNDLGlCQUFpQixDQUFDenVCLEVBQUUsQ0FBQzh3QixTQUFKLEVBQWUvb0IsS0FBZixDQU4zQjtBQU9Ic3BCLHVCQUFXLEVBQUU1QyxpQkFBaUIsQ0FBQ3p1QixFQUFFLENBQUMrd0IsU0FBSixFQUFlaHBCLEtBQWYsQ0FQM0I7QUFRSHVwQiwwQkFBYyxFQUFFN0MsaUJBQWlCLENBQUN6dUIsRUFBRSxDQUFDbXhCLFlBQUosRUFBa0JwcEIsS0FBbEIsQ0FSOUI7QUFTSHdwQix3Q0FBNEIsRUFBRTFCLHFCQUFxQixDQUFDN3ZCLEVBQUUsQ0FBQyt3QixTQUFKLEVBQWVocEIsS0FBZjtBQVRoRDtBQXRCc0IsU0FBN0I7QUFrQ0QsT0FuQ0Q7QUFxQ0FSLGFBQU8sQ0FBQ3NmLE9BQVIsQ0FBZ0IsWUFBaEI7QUFFQW1ILGFBQU8sR0FBRyxJQUFWO0FBRUQsS0EzSDBCLEVBMkh4QixVQUFVdm5CLENBQVYsRUFBYTtBQUNkYyxhQUFPLENBQUNxZCxHQUFSLENBQVksMkNBQVo7QUFDQXJkLGFBQU8sQ0FBQ3FkLEdBQVIsQ0FBWW5lLENBQUMsQ0FBQ2dCLEtBQWQ7QUFDRCxLQTlIMEIsQ0FBM0I7QUFnSUQ7QUFFRixDQTVJRCxFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQW5LLE9BQU8rVyxPQUFQLENBQWU7QUNDYixTREFFbWQsV0FBV3RhLEdBQVgsQ0FDSTtBQUFBdWEsYUFBUyxDQUFUO0FBQ0FyekIsVUFBTSxnREFETjtBQUVBc3pCLFFBQUk7QUFDQSxVQUFBanJCLENBQUEsRUFBQWtHLENBQUEsRUFBQWdsQixtQkFBQTtBQUFBcHFCLGNBQVFnZixJQUFSLENBQWEsc0JBQWI7O0FBQ0E7QUFDSW9MLDhCQUFzQixVQUFDQyxTQUFELEVBQVl4ZSxRQUFaLEVBQXNCeWUsV0FBdEIsRUFBbUNDLGNBQW5DLEVBQW1EQyxTQUFuRDtBQUNsQixjQUFBQyxRQUFBO0FBQUFBLHFCQUFXO0FBQUNDLG9CQUFRTCxTQUFUO0FBQW9CbFgsbUJBQU9vWCxlQUFlLFlBQWYsQ0FBM0I7QUFBeUQ5Qix3QkFBWThCLGVBQWUsaUJBQWYsQ0FBckU7QUFBd0cvcEIsbUJBQU9xTCxRQUEvRztBQUF5SDhlLHNCQUFVTCxXQUFuSTtBQUFnSk0scUJBQVNMLGVBQWUsU0FBZjtBQUF6SixXQUFYOztBQUNBLGNBQUdDLFNBQUg7QUFDSUMscUJBQVNJLE9BQVQsR0FBbUIsSUFBbkI7QUNVYjs7QUFDRCxpQkRUVTFDLElBQUlhLFNBQUosQ0FBYzloQixNQUFkLENBQXFCO0FBQUNySCxpQkFBSzBxQixlQUFlLE1BQWY7QUFBTixXQUFyQixFQUFvRDtBQUFDL2Msa0JBQU07QUFBQ2lkLHdCQUFVQTtBQUFYO0FBQVAsV0FBcEQsQ0NTVjtBRGQ0QixTQUF0Qjs7QUFNQXJsQixZQUFJLENBQUo7QUFDQTNNLFdBQUd1d0IsU0FBSCxDQUFhMWxCLElBQWIsQ0FBa0I7QUFBQyxpQ0FBdUI7QUFBQzJRLHFCQUFTO0FBQVY7QUFBeEIsU0FBbEIsRUFBNEQ7QUFBQzFkLGdCQUFNO0FBQUM2VixzQkFBVSxDQUFDO0FBQVosV0FBUDtBQUF1QmpKLGtCQUFRO0FBQUMzQyxtQkFBTyxDQUFSO0FBQVdzcUIseUJBQWE7QUFBeEI7QUFBL0IsU0FBNUQsRUFBd0g3ekIsT0FBeEgsQ0FBZ0ksVUFBQzh6QixHQUFEO0FBQzVILGNBQUFDLE9BQUEsRUFBQVYsV0FBQSxFQUFBemUsUUFBQTtBQUFBbWYsb0JBQVVELElBQUlELFdBQWQ7QUFDQWpmLHFCQUFXa2YsSUFBSXZxQixLQUFmO0FBQ0E4cEIsd0JBQWNTLElBQUlsckIsR0FBbEI7QUFDQW1yQixrQkFBUS96QixPQUFSLENBQWdCLFVBQUNteEIsR0FBRDtBQUNaLGdCQUFBNkMsV0FBQSxFQUFBWixTQUFBO0FBQUFZLDBCQUFjN0MsSUFBSXlDLE9BQWxCO0FBQ0FSLHdCQUFZWSxZQUFZQyxJQUF4QjtBQUNBZCxnQ0FBb0JDLFNBQXBCLEVBQStCeGUsUUFBL0IsRUFBeUN5ZSxXQUF6QyxFQUFzRFcsV0FBdEQsRUFBbUUsSUFBbkU7O0FBRUEsZ0JBQUc3QyxJQUFJK0MsUUFBUDtBQzhCVixxQkQ3QmMvQyxJQUFJK0MsUUFBSixDQUFhbDBCLE9BQWIsQ0FBcUIsVUFBQ20wQixHQUFEO0FDOEJqQyx1QkQ3QmdCaEIsb0JBQW9CQyxTQUFwQixFQUErQnhlLFFBQS9CLEVBQXlDeWUsV0FBekMsRUFBc0RjLEdBQXRELEVBQTJELEtBQTNELENDNkJoQjtBRDlCWSxnQkM2QmQ7QUFHRDtBRHRDTztBQ3dDVixpQkQvQlVobUIsR0MrQlY7QUQ1Q007QUFSSixlQUFBdkcsS0FBQTtBQXVCTUssWUFBQUwsS0FBQTtBQUNGbUIsZ0JBQVFuQixLQUFSLENBQWNLLENBQWQ7QUNpQ1Q7O0FBQ0QsYURoQ01jLFFBQVFzZixPQUFSLENBQWdCLHNCQUFoQixDQ2dDTjtBRDlERTtBQStCQStMLFVBQU07QUNrQ1IsYURqQ01yckIsUUFBUXFkLEdBQVIsQ0FBWSxnQkFBWixDQ2lDTjtBRGpFRTtBQUFBLEdBREosQ0NBRjtBRERGLEc7Ozs7Ozs7Ozs7OztBRUFBdG5CLE9BQU8rVyxPQUFQLENBQWU7QUNDYixTREFFbWQsV0FBV3RhLEdBQVgsQ0FDSTtBQUFBdWEsYUFBUyxDQUFUO0FBQ0FyekIsVUFBTSxzQkFETjtBQUVBc3pCLFFBQUk7QUFDQSxVQUFBemlCLFVBQUEsRUFBQXhJLENBQUE7QUFBQWMsY0FBUXFkLEdBQVIsQ0FBWSxjQUFaO0FBQ0FyZCxjQUFRZ2YsSUFBUixDQUFhLG9CQUFiOztBQUNBO0FBQ0l0WCxxQkFBYWpQLEdBQUd5SyxXQUFoQjtBQUNBd0UsbUJBQVdwRSxJQUFYLENBQWdCO0FBQUNQLHlCQUFlO0FBQUNrUixxQkFBUztBQUFWO0FBQWhCLFNBQWhCLEVBQW1EO0FBQUM5USxrQkFBUTtBQUFDbW9CLDBCQUFjO0FBQWY7QUFBVCxTQUFuRCxFQUFnRnIwQixPQUFoRixDQUF3RixVQUFDaWdCLEVBQUQ7QUFDcEYsY0FBR0EsR0FBR29VLFlBQU47QUNVUixtQkRUWTVqQixXQUFXcUcsTUFBWCxDQUFrQjdHLE1BQWxCLENBQXlCZ1EsR0FBR3JYLEdBQTVCLEVBQWlDO0FBQUMyTixvQkFBTTtBQUFDekssK0JBQWUsQ0FBQ21VLEdBQUdvVSxZQUFKO0FBQWhCO0FBQVAsYUFBakMsQ0NTWjtBQUtEO0FEaEJLO0FBRkosZUFBQXpzQixLQUFBO0FBTU1LLFlBQUFMLEtBQUE7QUFDRm1CLGdCQUFRbkIsS0FBUixDQUFjSyxDQUFkO0FDZ0JUOztBQUNELGFEZk1jLFFBQVFzZixPQUFSLENBQWdCLG9CQUFoQixDQ2VOO0FEN0JFO0FBZUErTCxVQUFNO0FDaUJSLGFEaEJNcnJCLFFBQVFxZCxHQUFSLENBQVksZ0JBQVosQ0NnQk47QURoQ0U7QUFBQSxHQURKLENDQUY7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQXRuQixPQUFPK1csT0FBUCxDQUFlO0FDQ2IsU0RBRW1kLFdBQVd0YSxHQUFYLENBQ0k7QUFBQXVhLGFBQVMsQ0FBVDtBQUNBcnpCLFVBQU0sd0JBRE47QUFFQXN6QixRQUFJO0FBQ0EsVUFBQXppQixVQUFBLEVBQUF4SSxDQUFBO0FBQUFjLGNBQVFxZCxHQUFSLENBQVksY0FBWjtBQUNBcmQsY0FBUWdmLElBQVIsQ0FBYSwwQkFBYjs7QUFDQTtBQUNJdFgscUJBQWFqUCxHQUFHeUssV0FBaEI7QUFDQXdFLG1CQUFXcEUsSUFBWCxDQUFnQjtBQUFDc0ssaUJBQU87QUFBQ3FHLHFCQUFTO0FBQVY7QUFBUixTQUFoQixFQUEyQztBQUFDOVEsa0JBQVE7QUFBQ3JJLGtCQUFNO0FBQVA7QUFBVCxTQUEzQyxFQUFnRTdELE9BQWhFLENBQXdFLFVBQUNpZ0IsRUFBRDtBQUNwRSxjQUFBakosT0FBQSxFQUFBbUQsQ0FBQTs7QUFBQSxjQUFHOEYsR0FBR3BjLElBQU47QUFDSXNXLGdCQUFJM1ksR0FBR3VOLEtBQUgsQ0FBU25MLE9BQVQsQ0FBaUI7QUFBQ2dGLG1CQUFLcVgsR0FBR3BjO0FBQVQsYUFBakIsRUFBaUM7QUFBQ3FJLHNCQUFRO0FBQUMySyx3QkFBUTtBQUFUO0FBQVQsYUFBakMsQ0FBSjs7QUFDQSxnQkFBR3NELEtBQUtBLEVBQUV0RCxNQUFQLElBQWlCc0QsRUFBRXRELE1BQUYsQ0FBU3BXLE1BQVQsR0FBa0IsQ0FBdEM7QUFDSSxrQkFBRywyRkFBMkZrQyxJQUEzRixDQUFnR3dYLEVBQUV0RCxNQUFGLENBQVMsQ0FBVCxFQUFZRyxPQUE1RyxDQUFIO0FBQ0lBLDBCQUFVbUQsRUFBRXRELE1BQUYsQ0FBUyxDQUFULEVBQVlHLE9BQXRCO0FDaUJoQix1QkRoQmdCdkcsV0FBV3FHLE1BQVgsQ0FBa0I3RyxNQUFsQixDQUF5QmdRLEdBQUdyWCxHQUE1QixFQUFpQztBQUFDMk4sd0JBQU07QUFBQ0ksMkJBQU9LO0FBQVI7QUFBUCxpQkFBakMsQ0NnQmhCO0FEbkJRO0FBRko7QUM0QlQ7QUQ3Qks7QUFGSixlQUFBcFAsS0FBQTtBQVdNSyxZQUFBTCxLQUFBO0FBQ0ZtQixnQkFBUW5CLEtBQVIsQ0FBY0ssQ0FBZDtBQ3dCVDs7QUFDRCxhRHZCTWMsUUFBUXNmLE9BQVIsQ0FBZ0IsMEJBQWhCLENDdUJOO0FEMUNFO0FBb0JBK0wsVUFBTTtBQ3lCUixhRHhCTXJyQixRQUFRcWQsR0FBUixDQUFZLGdCQUFaLENDd0JOO0FEN0NFO0FBQUEsR0FESixDQ0FGO0FEREYsRzs7Ozs7Ozs7Ozs7O0FFQUF0bkIsT0FBTytXLE9BQVAsQ0FBZTtBQ0NiLFNEQUVtZCxXQUFXdGEsR0FBWCxDQUNJO0FBQUF1YSxhQUFTLENBQVQ7QUFDQXJ6QixVQUFNLDBCQUROO0FBRUFzekIsUUFBSTtBQUNBLFVBQUFqckIsQ0FBQTtBQUFBYyxjQUFRcWQsR0FBUixDQUFZLGNBQVo7QUFDQXJkLGNBQVFnZixJQUFSLENBQWEsK0JBQWI7O0FBQ0E7QUFDSXZtQixXQUFHc0ssYUFBSCxDQUFpQmdMLE1BQWpCLENBQXdCN0csTUFBeEIsQ0FBK0I7QUFBQ3ZRLG1CQUFTO0FBQUNzZCxxQkFBUztBQUFWO0FBQVYsU0FBL0IsRUFBNEQ7QUFBQ3pHLGdCQUFNO0FBQUM3VyxxQkFBUztBQUFWO0FBQVAsU0FBNUQsRUFBb0Y7QUFBQytYLGlCQUFPO0FBQVIsU0FBcEY7QUFESixlQUFBN1AsS0FBQTtBQUVNSyxZQUFBTCxLQUFBO0FBQ0ZtQixnQkFBUW5CLEtBQVIsQ0FBY0ssQ0FBZDtBQ2FUOztBQUNELGFEWk1jLFFBQVFzZixPQUFSLENBQWdCLCtCQUFoQixDQ1lOO0FEdEJFO0FBV0ErTCxVQUFNO0FDY1IsYURiTXJyQixRQUFRcWQsR0FBUixDQUFZLGdCQUFaLENDYU47QUR6QkU7QUFBQSxHQURKLENDQUY7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQXRuQixPQUFPK1csT0FBUCxDQUFlO0FDQ2IsU0RBRG1kLFdBQVd0YSxHQUFYLENBQ0M7QUFBQXVhLGFBQVMsQ0FBVDtBQUNBcnpCLFVBQU0scUNBRE47QUFFQXN6QixRQUFJO0FBQ0gsVUFBQWpyQixDQUFBO0FBQUFjLGNBQVFxZCxHQUFSLENBQVksY0FBWjtBQUNBcmQsY0FBUWdmLElBQVIsQ0FBYSw4QkFBYjs7QUFDQTtBQUVDdm1CLFdBQUd5SyxXQUFILENBQWVJLElBQWYsR0FBc0JyTSxPQUF0QixDQUE4QixVQUFDaWdCLEVBQUQ7QUFDN0IsY0FBQXFVLFdBQUEsRUFBQUMsV0FBQSxFQUFBbnpCLENBQUEsRUFBQW96QixlQUFBLEVBQUFDLFFBQUE7O0FBQUEsY0FBRyxDQUFJeFUsR0FBR25VLGFBQVY7QUFDQztBQ0VLOztBREROLGNBQUdtVSxHQUFHblUsYUFBSCxDQUFpQnJMLE1BQWpCLEtBQTJCLENBQTlCO0FBQ0M2ekIsMEJBQWM5eUIsR0FBR3NLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCNFQsR0FBR25VLGFBQUgsQ0FBaUIsQ0FBakIsQ0FBdEIsRUFBMkM4SyxLQUEzQyxFQUFkOztBQUNBLGdCQUFHMGQsZ0JBQWUsQ0FBbEI7QUFDQ0cseUJBQVdqekIsR0FBR3NLLGFBQUgsQ0FBaUJsSSxPQUFqQixDQUF5QjtBQUFDMkYsdUJBQU8wVyxHQUFHMVcsS0FBWDtBQUFrQmtxQix3QkFBUTtBQUExQixlQUF6QixDQUFYOztBQUNBLGtCQUFHZ0IsUUFBSDtBQUNDcnpCLG9CQUFJSSxHQUFHeUssV0FBSCxDQUFlNkssTUFBZixDQUFzQjdHLE1BQXRCLENBQTZCO0FBQUNySCx1QkFBS3FYLEdBQUdyWDtBQUFULGlCQUE3QixFQUE0QztBQUFDMk4sd0JBQU07QUFBQ3pLLG1DQUFlLENBQUMyb0IsU0FBUzdyQixHQUFWLENBQWhCO0FBQWdDeXJCLGtDQUFjSSxTQUFTN3JCO0FBQXZEO0FBQVAsaUJBQTVDLENBQUo7O0FBQ0Esb0JBQUd4SCxDQUFIO0FDYVUseUJEWlRxekIsU0FBU0MsV0FBVCxFQ1lTO0FEZlg7QUFBQTtBQUtDM3JCLHdCQUFRbkIsS0FBUixDQUFjLDhCQUFkO0FDY1EsdUJEYlJtQixRQUFRbkIsS0FBUixDQUFjcVksR0FBR3JYLEdBQWpCLENDYVE7QURyQlY7QUFGRDtBQUFBLGlCQVdLLElBQUdxWCxHQUFHblUsYUFBSCxDQUFpQnJMLE1BQWpCLEdBQTBCLENBQTdCO0FBQ0orekIsOEJBQWtCLEVBQWxCO0FBQ0F2VSxlQUFHblUsYUFBSCxDQUFpQjlMLE9BQWpCLENBQXlCLFVBQUN3YyxDQUFEO0FBQ3hCOFgsNEJBQWM5eUIsR0FBR3NLLGFBQUgsQ0FBaUJPLElBQWpCLENBQXNCbVEsQ0FBdEIsRUFBeUI1RixLQUF6QixFQUFkOztBQUNBLGtCQUFHMGQsZ0JBQWUsQ0FBbEI7QUNnQlMsdUJEZlJFLGdCQUFnQnIwQixJQUFoQixDQUFxQnFjLENBQXJCLENDZVE7QUFDRDtBRG5CVDs7QUFJQSxnQkFBR2dZLGdCQUFnQi96QixNQUFoQixHQUF5QixDQUE1QjtBQUNDOHpCLDRCQUFjcG9CLEVBQUU0aUIsVUFBRixDQUFhOU8sR0FBR25VLGFBQWhCLEVBQStCMG9CLGVBQS9CLENBQWQ7O0FBQ0Esa0JBQUdELFlBQVl2ekIsUUFBWixDQUFxQmlmLEdBQUdvVSxZQUF4QixDQUFIO0FDa0JTLHVCRGpCUjd5QixHQUFHeUssV0FBSCxDQUFlNkssTUFBZixDQUFzQjdHLE1BQXRCLENBQTZCO0FBQUNySCx1QkFBS3FYLEdBQUdyWDtBQUFULGlCQUE3QixFQUE0QztBQUFDMk4sd0JBQU07QUFBQ3pLLG1DQUFleW9CO0FBQWhCO0FBQVAsaUJBQTVDLENDaUJRO0FEbEJUO0FDMEJTLHVCRHZCUi95QixHQUFHeUssV0FBSCxDQUFlNkssTUFBZixDQUFzQjdHLE1BQXRCLENBQTZCO0FBQUNySCx1QkFBS3FYLEdBQUdyWDtBQUFULGlCQUE3QixFQUE0QztBQUFDMk4sd0JBQU07QUFBQ3pLLG1DQUFleW9CLFdBQWhCO0FBQTZCRixrQ0FBY0UsWUFBWSxDQUFaO0FBQTNDO0FBQVAsaUJBQTVDLENDdUJRO0FENUJWO0FBTkk7QUM0Q0M7QUQxRFA7QUFGRCxlQUFBM3NCLEtBQUE7QUE2Qk1LLFlBQUFMLEtBQUE7QUFDTG1CLGdCQUFRbkIsS0FBUixDQUFjLDhCQUFkO0FBQ0FtQixnQkFBUW5CLEtBQVIsQ0FBY0ssRUFBRWdCLEtBQWhCO0FDbUNHOztBQUNELGFEbENIRixRQUFRc2YsT0FBUixDQUFnQiw4QkFBaEIsQ0NrQ0c7QUR4RUo7QUF1Q0ErTCxVQUFNO0FDb0NGLGFEbkNIcnJCLFFBQVFxZCxHQUFSLENBQVksZ0JBQVosQ0NtQ0c7QUQzRUo7QUFBQSxHQURELENDQUM7QURERixHOzs7Ozs7Ozs7Ozs7QUVBQXRuQixPQUFPK1csT0FBUCxDQUFlO0FDQ2IsU0RBRG1kLFdBQVd0YSxHQUFYLENBQ0M7QUFBQXVhLGFBQVMsQ0FBVDtBQUNBcnpCLFVBQU0sUUFETjtBQUVBc3pCLFFBQUk7QUFDSCxVQUFBanJCLENBQUEsRUFBQTJLLFVBQUE7QUFBQTdKLGNBQVFxZCxHQUFSLENBQVksY0FBWjtBQUNBcmQsY0FBUWdmLElBQVIsQ0FBYSxpQkFBYjs7QUFDQTtBQUVDdm1CLFdBQUdpTSxPQUFILENBQVdyTixNQUFYLENBQWtCLEVBQWxCO0FBRUFvQixXQUFHaU0sT0FBSCxDQUFXa2EsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyxtQkFEVTtBQUVqQixxQkFBVyxtQkFGTTtBQUdqQixrQkFBUSxtQkFIUztBQUlqQixxQkFBVyxRQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFTQW5tQixXQUFHaU0sT0FBSCxDQUFXa2EsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyx1QkFEVTtBQUVqQixxQkFBVyx1QkFGTTtBQUdqQixrQkFBUSx1QkFIUztBQUlqQixxQkFBVyxXQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFTQW5tQixXQUFHaU0sT0FBSCxDQUFXa2EsTUFBWCxDQUFrQjtBQUNqQixpQkFBTyxxQkFEVTtBQUVqQixxQkFBVyxxQkFGTTtBQUdqQixrQkFBUSxxQkFIUztBQUlqQixxQkFBVyxXQUpNO0FBS2pCLHVCQUFhLEdBTEk7QUFNakIsMkJBQWlCO0FBTkEsU0FBbEI7QUFVQS9VLHFCQUFhLElBQUlqSixJQUFKLENBQVMwZixPQUFPLElBQUkxZixJQUFKLEVBQVAsRUFBaUIyZixNQUFqQixDQUF3QixZQUF4QixDQUFULENBQWI7QUFDQTluQixXQUFHaUksTUFBSCxDQUFVNEMsSUFBVixDQUFlO0FBQUMzQyxtQkFBUyxJQUFWO0FBQWdCdWxCLHNCQUFZO0FBQUNqUyxxQkFBUztBQUFWLFdBQTVCO0FBQThDdlAsbUJBQVM7QUFBQ3VQLHFCQUFTO0FBQVY7QUFBdkQsU0FBZixFQUF3RmhkLE9BQXhGLENBQWdHLFVBQUNnb0IsQ0FBRDtBQUMvRixjQUFBa0YsT0FBQSxFQUFBamxCLENBQUEsRUFBQW9CLFFBQUEsRUFBQXNmLFVBQUEsRUFBQWdNLE1BQUEsRUFBQUMsT0FBQSxFQUFBek8sVUFBQTs7QUFBQTtBQUNDeU8sc0JBQVUsRUFBVjtBQUNBek8seUJBQWEza0IsR0FBR3lLLFdBQUgsQ0FBZUksSUFBZixDQUFvQjtBQUFDOUMscUJBQU95ZSxFQUFFcGYsR0FBVjtBQUFlb1gsNkJBQWU7QUFBOUIsYUFBcEIsRUFBeURwSixLQUF6RCxFQUFiO0FBQ0FnZSxvQkFBUTNGLFVBQVIsR0FBcUI5SSxVQUFyQjtBQUNBK0csc0JBQVVsRixFQUFFa0YsT0FBWjs7QUFDQSxnQkFBR0EsVUFBVSxDQUFiO0FBQ0N5SCx1QkFBUyxDQUFUO0FBQ0FoTSwyQkFBYSxDQUFiOztBQUNBeGMsZ0JBQUVwQyxJQUFGLENBQU9pZSxFQUFFdmEsT0FBVCxFQUFrQixVQUFDb25CLEVBQUQ7QUFDakIsb0JBQUFwMkIsTUFBQTtBQUFBQSx5QkFBUytDLEdBQUdpTSxPQUFILENBQVc3SixPQUFYLENBQW1CO0FBQUNoRSx3QkFBTWkxQjtBQUFQLGlCQUFuQixDQUFUOztBQUNBLG9CQUFHcDJCLFVBQVdBLE9BQU80dUIsU0FBckI7QUNXVSx5QkRWVDFFLGNBQWNscUIsT0FBTzR1QixTQ1VaO0FBQ0Q7QURkVjs7QUFJQXNILHVCQUFTamhCLFNBQVMsQ0FBQ3daLFdBQVN2RSxhQUFXeEMsVUFBcEIsQ0FBRCxFQUFrQzlqQixPQUFsQyxFQUFULElBQXdELENBQWpFO0FBQ0FnSCx5QkFBVyxJQUFJTSxJQUFKLEVBQVg7QUFDQU4sdUJBQVN5ckIsUUFBVCxDQUFrQnpyQixTQUFTd21CLFFBQVQsS0FBb0I4RSxNQUF0QztBQUNBdHJCLHlCQUFXLElBQUlNLElBQUosQ0FBUzBmLE9BQU9oZ0IsUUFBUCxFQUFpQmlnQixNQUFqQixDQUF3QixZQUF4QixDQUFULENBQVg7QUFDQXNMLHNCQUFRaGlCLFVBQVIsR0FBcUJBLFVBQXJCO0FBQ0FnaUIsc0JBQVF2ckIsUUFBUixHQUFtQkEsUUFBbkI7QUFaRCxtQkFjSyxJQUFHNmpCLFdBQVcsQ0FBZDtBQUNKMEgsc0JBQVFoaUIsVUFBUixHQUFxQkEsVUFBckI7QUFDQWdpQixzQkFBUXZyQixRQUFSLEdBQW1CLElBQUlNLElBQUosRUFBbkI7QUNZTTs7QURWUHFlLGNBQUV2YSxPQUFGLENBQVV0TixJQUFWLENBQWUsbUJBQWY7QUFDQXkwQixvQkFBUW5uQixPQUFSLEdBQWtCdEIsRUFBRThCLElBQUYsQ0FBTytaLEVBQUV2YSxPQUFULENBQWxCO0FDWU0sbUJEWE5qTSxHQUFHaUksTUFBSCxDQUFVcU4sTUFBVixDQUFpQjdHLE1BQWpCLENBQXdCO0FBQUNySCxtQkFBS29mLEVBQUVwZjtBQUFSLGFBQXhCLEVBQXNDO0FBQUMyTixvQkFBTXFlO0FBQVAsYUFBdEMsQ0NXTTtBRHBDUCxtQkFBQWh0QixLQUFBO0FBMEJNSyxnQkFBQUwsS0FBQTtBQUNMbUIsb0JBQVFuQixLQUFSLENBQWMsdUJBQWQ7QUFDQW1CLG9CQUFRbkIsS0FBUixDQUFjb2dCLEVBQUVwZixHQUFoQjtBQUNBRyxvQkFBUW5CLEtBQVIsQ0FBY2d0QixPQUFkO0FDaUJNLG1CRGhCTjdyQixRQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEIsQ0NnQk07QUFDRDtBRGhEUDtBQWpDRCxlQUFBckIsS0FBQTtBQWtFTUssWUFBQUwsS0FBQTtBQUNMbUIsZ0JBQVFuQixLQUFSLENBQWMsaUJBQWQ7QUFDQW1CLGdCQUFRbkIsS0FBUixDQUFjSyxFQUFFZ0IsS0FBaEI7QUNtQkc7O0FBQ0QsYURsQkhGLFFBQVFzZixPQUFSLENBQWdCLGlCQUFoQixDQ2tCRztBRDdGSjtBQTRFQStMLFVBQU07QUNvQkYsYURuQkhyckIsUUFBUXFkLEdBQVIsQ0FBWSxnQkFBWixDQ21CRztBRGhHSjtBQUFBLEdBREQsQ0NBQztBRERGLEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBRUFBdG5CLE9BQU8rVyxPQUFQLENBQWU7QUFDWCxNQUFBa2YsT0FBQTtBQUFBQSxZQUFVajJCLE9BQU9nRyxXQUFQLEVBQVY7O0FBQ0EsTUFBRyxDQUFDaEcsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUEzQjtBQUNJemMsV0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUF2QixHQUFxQztBQUNqQyxpQkFBVztBQUNQLGVBQU93WjtBQURBLE9BRHNCO0FBSWpDLGtCQUFZO0FBQ1IsZUFBT0E7QUFEQztBQUpxQixLQUFyQztBQ1NMOztBREFDLE1BQUcsQ0FBQ2oyQixPQUFPQyxRQUFQLENBQWUsUUFBZixFQUF1QndjLFdBQXZCLENBQW1DeVosT0FBdkM7QUFDSWwyQixXQUFPQyxRQUFQLENBQWUsUUFBZixFQUF1QndjLFdBQXZCLENBQW1DeVosT0FBbkMsR0FBNkM7QUFDekMsYUFBT0Q7QUFEa0MsS0FBN0M7QUNJTDs7QUREQyxNQUFHLENBQUNqMkIsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUF2QixDQUFtQ21XLFFBQXZDO0FBQ0k1eUIsV0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUF2QixDQUFtQ21XLFFBQW5DLEdBQThDO0FBQzFDLGFBQU9xRDtBQURtQyxLQUE5QztBQ0tMOztBRERDLE1BQUcsQ0FBQ2oyQixPQUFPQyxRQUFQLENBQWUsUUFBZixFQUF1QndjLFdBQXZCLENBQW1DeVosT0FBbkMsQ0FBMkN4d0IsR0FBL0M7QUFDSTFGLFdBQU9DLFFBQVAsQ0FBZSxRQUFmLEVBQXVCd2MsV0FBdkIsQ0FBbUN5WixPQUFuQyxDQUEyQ3h3QixHQUEzQyxHQUFpRHV3QixPQUFqRDtBQ0dMOztBREZDLE1BQUcsQ0FBQ2oyQixPQUFPQyxRQUFQLENBQWUsUUFBZixFQUF1QndjLFdBQXZCLENBQW1DbVcsUUFBbkMsQ0FBNENsdEIsR0FBaEQ7QUNJQSxXREhJMUYsT0FBT0MsUUFBUCxDQUFlLFFBQWYsRUFBdUJ3YyxXQUF2QixDQUFtQ21XLFFBQW5DLENBQTRDbHRCLEdBQTVDLEdBQWtEdXdCLE9DR3REO0FBQ0Q7QUQ1QkgsRzs7Ozs7Ozs7Ozs7O0FFQUFqMkIsT0FBTytXLE9BQVAsQ0FBZTtBQ0NiLFNEQUQsSUFBSW9mLFFBQVFDLEtBQVosQ0FDQztBQUFBdDFCLFVBQU0sZ0JBQU47QUFDQTZRLGdCQUFZalAsR0FBR3VGLElBRGY7QUFFQW91QixhQUFTLENBQ1I7QUFDQy9qQixZQUFNLE1BRFA7QUFFQ2drQixpQkFBVztBQUZaLEtBRFEsQ0FGVDtBQVFBQyxTQUFLLElBUkw7QUFTQTVhLGlCQUFhLENBQUMsS0FBRCxFQUFRLE9BQVIsQ0FUYjtBQVVBNmEsa0JBQWMsS0FWZDtBQVdBQyxjQUFVLEtBWFY7QUFZQXhhLGdCQUFZLEVBWlo7QUFhQTRPLFVBQU0sS0FiTjtBQWNBNkwsZUFBVyxJQWRYO0FBZUFDLGVBQVcsSUFmWDtBQWdCQUMsb0JBQWdCLFVBQUM1YixRQUFELEVBQVdoVyxNQUFYO0FBQ2YsVUFBQW5DLEdBQUEsRUFBQTRILEtBQUE7O0FBQUEsV0FBT3pGLE1BQVA7QUFDQyxlQUFPO0FBQUM4RSxlQUFLLENBQUM7QUFBUCxTQUFQO0FDSUc7O0FESEpXLGNBQVF1USxTQUFTdlEsS0FBakI7O0FBQ0EsV0FBT0EsS0FBUDtBQUNDLGFBQUF1USxZQUFBLFFBQUFuWSxNQUFBbVksU0FBQTZiLElBQUEsWUFBQWgwQixJQUFtQmxCLE1BQW5CLEdBQW1CLE1BQW5CLEdBQW1CLE1BQW5CLElBQTRCLENBQTVCO0FBQ0M4SSxrQkFBUXVRLFNBQVM2YixJQUFULENBQWM3MUIsV0FBZCxDQUEwQixPQUExQixFQUFtQyxDQUFuQyxDQUFSO0FBRkY7QUNRSTs7QURMSixXQUFPeUosS0FBUDtBQUNDLGVBQU87QUFBQ1gsZUFBSyxDQUFDO0FBQVAsU0FBUDtBQ1NHOztBRFJKLGFBQU9rUixRQUFQO0FBekJEO0FBQUEsR0FERCxDQ0FDO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19iYXNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuXHRjaGVja05wbVZlcnNpb25zXHJcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFwibm9kZS1zY2hlZHVsZVwiOiBcIl4xLjMuMVwiLFxyXG5cdGNvb2tpZXM6IFwiXjAuNi4yXCIsXHJcblx0XCJ4bWwyanNcIjogXCJeMC40LjE5XCIsXHJcblx0bWtkaXJwOiBcIl4wLjMuNVwiLFxyXG5cdFwidXJsLXNlYXJjaC1wYXJhbXMtcG9seWZpbGxcIjogXCJeNy4wLjBcIixcclxufSwgJ3N0ZWVkb3M6YmFzZScpO1xyXG5cclxuaWYgKE1ldGVvci5zZXR0aW5ncyAmJiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZykge1xyXG5cdGNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdFx0XCJ3ZWl4aW4tcGF5XCI6IFwiXjEuMS43XCJcclxuXHR9LCAnc3RlZWRvczpiYXNlJyk7XHJcbn0iLCJBcnJheS5wcm90b3R5cGUuc29ydEJ5TmFtZSA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcclxuICAgIGlmICghdGhpcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmKCFsb2NhbGUpe1xyXG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcclxuICAgIH1cclxuICAgIHRoaXMuc29ydChmdW5jdGlvbiAocDEsIHAyKSB7XHJcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcclxuXHRcdHZhciBwMl9zb3J0X25vID0gcDIuc29ydF9ubyB8fCAwO1xyXG5cdFx0aWYocDFfc29ydF9ubyAhPSBwMl9zb3J0X25vKXtcclxuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXHJcbiAgICAgICAgfWVsc2V7XHJcblx0XHRcdHJldHVybiBwMS5uYW1lLmxvY2FsZUNvbXBhcmUocDIubmFtZSwgbG9jYWxlKTtcclxuXHRcdH1cclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbkFycmF5LnByb3RvdHlwZS5nZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrKSB7XHJcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xyXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgdmFyIG0gPSB0ID8gdFtrXSA6IG51bGw7XHJcbiAgICAgICAgdi5wdXNoKG0pO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdjtcclxufVxyXG5cclxuLypcclxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcclxuICAgIGlmIChmcm9tIDwgMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcclxuICAgIHRoaXMubGVuZ3RoID0gZnJvbSA8IDAgPyB0aGlzLmxlbmd0aCArIGZyb20gOiBmcm9tO1xyXG4gICAgcmV0dXJuIHRoaXMucHVzaC5hcHBseSh0aGlzLCByZXN0KTtcclxufTtcclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTlr7nosaFBcnJheVxyXG4gKi9cclxuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciBnID0gW107XHJcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcclxuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcclxuICAgICAgICB2YXIgZCA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChtIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiaWRcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiX2lkXCIgaW4gbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IGwuaW5jbHVkZXMobSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGQpIHtcclxuICAgICAgICAgICAgZy5wdXNoKHQpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGc7XHJcbn1cclxuXHJcbi8qXHJcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXHJcbiAqIHJldHVybiDnrKblkIjmnaHku7bnmoTnrKzkuIDkuKrlr7nosaFcclxuICovXHJcbkFycmF5LnByb3RvdHlwZS5maW5kUHJvcGVydHlCeVBLID0gZnVuY3Rpb24gKGgsIGwpIHtcclxuICAgIHZhciByID0gbnVsbDtcclxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xyXG4gICAgICAgIHZhciBtID0gdCA/IHRbaF0gOiBudWxsO1xyXG4gICAgICAgIHZhciBkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICBkID0gbS5pbmNsdWRlcyhsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChkKSB7XHJcbiAgICAgICAgICAgIHIgPSB0O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHI7XHJcbn0iLCJTdGVlZG9zID1cclxuXHRzZXR0aW5nczoge31cclxuXHRkYjogZGJcclxuXHRzdWJzOiB7fVxyXG5cdGlzUGhvbmVFbmFibGVkOiAtPlxyXG5cdFx0cmV0dXJuICEhTWV0ZW9yLnNldHRpbmdzPy5wdWJsaWM/LnBob25lXHJcblx0bnVtYmVyVG9TdHJpbmc6IChudW1iZXIsIHNjYWxlLCBub3RUaG91c2FuZHMpLT5cclxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxyXG5cdFx0XHRudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKVxyXG5cclxuXHRcdGlmICFudW1iZXJcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cclxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXHJcblx0XHRcdGlmIHNjYWxlIHx8IHNjYWxlID09IDBcclxuXHRcdFx0XHRudW1iZXIgPSBOdW1iZXIobnVtYmVyKS50b0ZpeGVkKHNjYWxlKVxyXG5cdFx0XHR1bmxlc3Mgbm90VGhvdXNhbmRzXHJcblx0XHRcdFx0aWYgIShzY2FsZSB8fCBzY2FsZSA9PSAwKVxyXG5cdFx0XHRcdFx0IyDmsqHlrprkuYlzY2FsZeaXtu+8jOagueaNruWwj+aVsOeCueS9jee9rueul+WHunNjYWxl5YC8XHJcblx0XHRcdFx0XHRzY2FsZSA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLyk/WzFdPy5sZW5ndGhcclxuXHRcdFx0XHRcdHVubGVzcyBzY2FsZVxyXG5cdFx0XHRcdFx0XHRzY2FsZSA9IDBcclxuXHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2dcclxuXHRcdFx0XHRpZiBzY2FsZSA9PSAwXHJcblx0XHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXGIpL2dcclxuXHRcdFx0XHRudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKVxyXG5cdFx0XHRyZXR1cm4gbnVtYmVyXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBcIlwiXHJcblx0dmFsaUpxdWVyeVN5bWJvbHM6IChzdHIpLT5cclxuXHRcdCMgcmVnID0gL15bXiFcIiMkJSYnKCkqKywuLzo7PD0+P0BbXFxdXmB7fH1+XSskL2dcclxuXHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIilcclxuXHRcdHJldHVybiByZWcudGVzdChzdHIpXHJcblxyXG4jIyNcclxuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cclxuIyBAbmFtZXNwYWNlIFN0ZWVkb3NcclxuIyMjXHJcblxyXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XHJcblx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHRyZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cclxuXHRTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9ICgpLT5cclxuXHRcdHN3YWwoe3RpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLCB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksIGh0bWw6IHRydWUsIHR5cGU6XCJ3YXJuaW5nXCIsIGNvbmZpcm1CdXR0b25UZXh0OiBUQVBpMThuLl9fKFwiT0tcIil9KTtcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50QmdCb2R5VmFsdWUgPSAoKS0+XHJcblx0XHRhY2NvdW50QmdCb2R5ID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcImJnX2JvZHlcIn0pXHJcblx0XHRpZiBhY2NvdW50QmdCb2R5XHJcblx0XHRcdHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0U3RlZWRvcy5hcHBseUFjY291bnRCZ0JvZHlWYWx1ZSA9IChhY2NvdW50QmdCb2R5VmFsdWUsaXNOZWVkVG9Mb2NhbCktPlxyXG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdCMg5aaC5p6c5piv5q2j5Zyo55m75b2V5Lit5oiW5Zyo55m75b2V55WM6Z2i77yM5YiZ5Y+WbG9jYWxTdG9yYWdl5Lit6K6+572u77yM6ICM5LiN5piv55u05o6l5bqU55So56m66K6+572uXHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9XHJcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcclxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlLmF2YXRhciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiKVxyXG5cclxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdGF2YXRhciA9IGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcclxuXHRcdGlmIGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcclxuXHRcdFx0aWYgdXJsID09IGF2YXRhclxyXG5cdFx0XHRcdGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGF2YXRhclVybCl9KVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHQkKFwiYm9keVwiKS5jc3MgXCJiYWNrZ3JvdW5kSW1hZ2VcIixcInVybCgje1N0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKX0pXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0YmFja2dyb3VuZCA9IE1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5hZG1pbj8uYmFja2dyb3VuZFxyXG5cdFx0XHRpZiBiYWNrZ3JvdW5kXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0YmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiXHJcblx0XHRcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKGJhY2tncm91bmQpfSlcIlxyXG5cclxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcclxuXHRcdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXHJcblx0XHRcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRCZ0JvZHlWYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIix1cmwpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcclxuXHJcblx0U3RlZWRvcy5nZXRBY2NvdW50U2tpblZhbHVlID0gKCktPlxyXG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcclxuXHRcdGlmIGFjY291bnRTa2luXHJcblx0XHRcdHJldHVybiBhY2NvdW50U2tpbi52YWx1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge307XHJcblxyXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cclxuXHRcdGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7dXNlcjpTdGVlZG9zLnVzZXJJZCgpLGtleTpcInpvb21cIn0pXHJcblx0XHRpZiBhY2NvdW50Wm9vbVxyXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt9O1xyXG5cclxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IChhY2NvdW50Wm9vbVZhbHVlLGlzTmVlZFRvTG9jYWwpLT5cclxuXHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKSBvciAhU3RlZWRvcy51c2VySWQoKVxyXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0ge31cclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIilcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcclxuXHRcdCQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcclxuXHRcdHpvb21OYW1lID0gYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHR6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZVxyXG5cdFx0dW5sZXNzIHpvb21OYW1lXHJcblx0XHRcdHpvb21OYW1lID0gXCJsYXJnZVwiXHJcblx0XHRcdHpvb21TaXplID0gMS4yXHJcblx0XHRpZiB6b29tTmFtZSAmJiAhU2Vzc2lvbi5nZXQoXCJpbnN0YW5jZVByaW50XCIpXHJcblx0XHRcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0XHQjIGlmIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0IyBcdGlmIGFjY291bnRab29tVmFsdWUuc2l6ZSA9PSBcIjFcIlxyXG5cdFx0XHQjIFx0XHQjIG5vZGUtd2Via2l05Litc2l6ZeS4ujDmiY3ooajnpLoxMDAlXHJcblx0XHRcdCMgXHRcdHpvb21TaXplID0gMFxyXG5cdFx0XHQjIFx0bncuV2luZG93LmdldCgpLnpvb21MZXZlbCA9IE51bWJlci5wYXJzZUZsb2F0KHpvb21TaXplKVxyXG5cdFx0XHQjIGVsc2VcclxuXHRcdFx0IyBcdCQoXCJib2R5XCIpLmFkZENsYXNzKFwiem9vbS0je3pvb21OYW1lfVwiKVxyXG5cdFx0aWYgaXNOZWVkVG9Mb2NhbFxyXG5cdFx0XHRpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuXHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0IyDov5nph4znibnmhI/kuI3lnKhsb2NhbFN0b3JhZ2XkuK3lrZjlgqhTdGVlZG9zLnVzZXJJZCgp77yM5Zug5Li66ZyA6KaB5L+d6K+B55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXHJcblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudFpvb21WYWx1ZeiCr+WumuS4uuepuu+8jOiuvue9rueahOivne+8jOS8mumAoOaIkOaXoOazleS/neaMgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxyXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXHJcblx0XHRcdFx0aWYgYWNjb3VudFpvb21WYWx1ZS5uYW1lXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiLGFjY291bnRab29tVmFsdWUubmFtZSlcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIsYWNjb3VudFpvb21WYWx1ZS5zaXplKVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXHJcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiKVxyXG5cclxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxyXG5cdFx0bG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKVxyXG5cdFx0Y291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMylcclxuXHJcblx0XHR1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCJcclxuXHJcblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gKHVybCktPlxyXG5cdFx0YXV0aFRva2VuID0ge307XHJcblx0XHRhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKClcclxuXHRcdGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcclxuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XHJcblxyXG5cdFx0bGlua2VyID0gXCI/XCJcclxuXHJcblx0XHRpZiB1cmwuaW5kZXhPZihcIj9cIikgPiAtMVxyXG5cdFx0XHRsaW5rZXIgPSBcIiZcIlxyXG5cclxuXHRcdHJldHVybiB1cmwgKyBsaW5rZXIgKyAkLnBhcmFtKGF1dGhUb2tlbilcclxuXHJcblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHRhdXRoVG9rZW4gPSB7fTtcclxuXHRcdGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKVxyXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xyXG5cdFx0YXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcclxuXHRcdHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKVxyXG5cclxuXHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XHJcblx0XHR1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiBhcHBfaWRcclxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXHJcblxyXG5cdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZClcclxuXHJcblx0XHRpZiAhYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmxcclxuXHRcdGVsc2VcclxuXHRcdFx0U3RlZWRvcy5vcGVuV2luZG93KHVybCk7XHJcblxyXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cclxuXHRcdGlmIHVybFxyXG5cdFx0XHRpZiBTdGVlZG9zLmlzTm9kZSgpXHJcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXHJcblx0XHRcdFx0b3Blbl91cmwgPSB1cmxcclxuXHRcdFx0XHRjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiI3tvcGVuX3VybH1cXFwiXCJcclxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cclxuXHRcdFx0XHRcdGlmIGVycm9yXHJcblx0XHRcdFx0XHRcdHRvYXN0ci5lcnJvciBlcnJvclxyXG5cdFx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxyXG5cclxuXHJcblx0U3RlZWRvcy5vcGVuQXBwID0gKGFwcF9pZCktPlxyXG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxyXG5cdFx0XHRTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKVxyXG5cdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cclxuXHRcdGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpXHJcblx0XHRpZiAhYXBwXHJcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3JcclxuXHRcdCMgaWYgYXBwLl9pZCA9PSBcImFkbWluXCIgYW5kIGNyZWF0b3JTZXR0aW5ncz8uc3RhdHVzID09IFwiYWN0aXZlXCJcclxuXHRcdCMgXHR1cmwgPSBjcmVhdG9yU2V0dGluZ3MudXJsXHJcblx0XHQjIFx0cmVnID0gL1xcLyQvXHJcblx0XHQjIFx0dW5sZXNzIHJlZy50ZXN0IHVybFxyXG5cdFx0IyBcdFx0dXJsICs9IFwiL1wiXHJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxyXG5cdFx0IyBcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXHJcblx0XHQjIFx0cmV0dXJuXHJcblxyXG5cdFx0b25fY2xpY2sgPSBhcHAub25fY2xpY2tcclxuXHRcdGlmIGFwcC5pc191c2VfaWVcclxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxyXG5cdFx0XHRcdGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlY1xyXG5cdFx0XHRcdGlmIG9uX2NsaWNrXHJcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIHBhdGhcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxyXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybFxyXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxyXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxyXG5cdFx0XHRcdFx0aWYgZXJyb3JcclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXHJcblx0XHRcdFx0XHRyZXR1cm5cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblxyXG5cdFx0ZWxzZSBpZiBkYi5hcHBzLmlzSW50ZXJuYWxBcHAoYXBwLnVybClcclxuXHRcdFx0Rmxvd1JvdXRlci5nbyhhcHAudXJsKVxyXG5cclxuXHRcdGVsc2UgaWYgYXBwLmlzX3VzZV9pZnJhbWVcclxuXHRcdFx0aWYgYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcclxuXHRcdFx0ZWxzZSBpZiBTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKVxyXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRGbG93Um91dGVyLmdvKFwiL2FwcHMvaWZyYW1lLyN7YXBwLl9pZH1cIilcclxuXHJcblx0XHRlbHNlIGlmIG9uX2NsaWNrXHJcblx0XHRcdCMg6L+Z6YeM5omn6KGM55qE5piv5LiA5Liq5LiN5bim5Y+C5pWw55qE6Zet5YyF5Ye95pWw77yM55So5p2l6YG/5YWN5Y+Y6YeP5rGh5p+TXHJcblx0XHRcdGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpeyN7b25fY2xpY2t9fSkoKVwiXHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGV2YWwoZXZhbEZ1blN0cmluZylcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBcIiN7ZS5tZXNzYWdlfVxcclxcbiN7ZS5zdGFja31cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKVxyXG5cclxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xyXG5cdFx0XHQjIOmcgOimgemAieS4reW9k+WJjWFwcOaXtu+8jG9uX2NsaWNr5Ye95pWw6YeM6KaB5Y2V54us5Yqg5LiKU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXHJcblx0XHRcdFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxyXG5cclxuXHRTdGVlZG9zLmNoZWNrU3BhY2VCYWxhbmNlID0gKHNwYWNlSWQpLT5cclxuXHRcdHVubGVzcyBzcGFjZUlkXHJcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0bWluX21vbnRocyA9IDFcclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0bWluX21vbnRocyA9IDNcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGVuZF9kYXRlID0gc3BhY2U/LmVuZF9kYXRlXHJcblx0XHRpZiBzcGFjZT8uaXNfcGFpZCBhbmQgZW5kX2RhdGUgIT0gdW5kZWZpbmVkIGFuZCAoZW5kX2RhdGUgLSBuZXcgRGF0ZSkgPD0gKG1pbl9tb250aHMqMzAqMjQqMzYwMCoxMDAwKVxyXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xyXG5cdFx0XHR0b2FzdHIuZXJyb3IgdChcInNwYWNlX2JhbGFuY2VfaW5zdWZmaWNpZW50XCIpXHJcblxyXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XHJcblx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdHVubGVzcyBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcclxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xyXG5cdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHR3aGVuICdub3JtYWwnXHJcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdFx0XHRvZmZzZXQgPSAtMTJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxyXG5cdFx0XHR3aGVuICdsYXJnZSdcclxuXHRcdFx0XHRpZiBTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0XHRcdG9mZnNldCA9IC02XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDE5OVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XHJcblx0XHRcdHdoZW4gJ2V4dHJhLWxhcmdlJ1xyXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0IyDljLrliIZJRea1j+iniOWZqFxyXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXHJcblx0XHRcdFx0XHRcdG9mZnNldCA9IDMwM1xyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xyXG5cclxuXHRcdGlmICQoXCIubW9kYWxcIikubGVuZ3RoXHJcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxyXG5cdFx0XHRcdGhlYWRlckhlaWdodCA9IDBcclxuXHRcdFx0XHRmb290ZXJIZWlnaHQgPSAwXHJcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXHJcblx0XHRcdFx0JChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0aGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxyXG5cdFx0XHRcdFx0Zm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpXHJcblxyXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XHJcblx0XHRcdFx0aGVpZ2h0ID0gJChcImJvZHlcIikuaW5uZXJIZWlnaHQoKSAtIHRvdGFsSGVpZ2h0IC0gb2Zmc2V0XHJcblx0XHRcdFx0aWYgJCh0aGlzKS5oYXNDbGFzcyhcImNmX2NvbnRhY3RfbW9kYWxcIilcclxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHQkKFwiLm1vZGFsLWJvZHlcIiwkKHRoaXMpKS5jc3Moe1wibWF4LWhlaWdodFwiOiBcIiN7aGVpZ2h0fXB4XCIsIFwiaGVpZ2h0XCI6IFwiYXV0b1wifSlcclxuXHJcblx0U3RlZWRvcy5nZXRNb2RhbE1heEhlaWdodCA9IChvZmZzZXQpLT5cclxuXHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxyXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZVZhbHVlID0gJCh3aW5kb3cpLmhlaWdodCgpIC0gMTgwIC0gMjVcclxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdCMgaW9z5Y+K5omL5py65LiK5LiN6ZyA6KaB5Li6em9vbeaUvuWkp+WKn+iDvemineWkluiuoeeul1xyXG5cdFx0XHRhY2NvdW50Wm9vbVZhbHVlID0gU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlKClcclxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxyXG5cdFx0XHRcdHdoZW4gJ2xhcmdlJ1xyXG5cdFx0XHRcdFx0IyDmtYvkuIvmnaXov5nph4zkuI3pnIDopoHpop3lpJblh4/mlbBcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcclxuXHRcdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcclxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gMTQ1XHJcblx0XHRpZiBvZmZzZXRcclxuXHRcdFx0cmVWYWx1ZSAtPSBvZmZzZXRcclxuXHRcdHJldHVybiByZVZhbHVlICsgXCJweFwiO1xyXG5cclxuXHRTdGVlZG9zLmlzaU9TID0gKHVzZXJBZ2VudCwgbGFuZ3VhZ2UpLT5cclxuXHRcdERFVklDRSA9XHJcblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xyXG5cdFx0XHRibGFja2JlcnJ5OiAnYmxhY2tiZXJyeSdcclxuXHRcdFx0ZGVza3RvcDogJ2Rlc2t0b3AnXHJcblx0XHRcdGlwYWQ6ICdpcGFkJ1xyXG5cdFx0XHRpcGhvbmU6ICdpcGhvbmUnXHJcblx0XHRcdGlwb2Q6ICdpcG9kJ1xyXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXHJcblx0XHRicm93c2VyID0ge31cclxuXHRcdGNvbkV4cCA9ICcoPzpbXFxcXC86XFxcXDo6XFxcXHM6O10pJ1xyXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXHJcblx0XHR1c2VyQWdlbnQgPSAodXNlckFnZW50IG9yIG5hdmlnYXRvci51c2VyQWdlbnQpLnRvTG93ZXJDYXNlKClcclxuXHRcdGxhbmd1YWdlID0gbGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmxhbmd1YWdlIG9yIG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2VcclxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXHJcblx0XHRcdCcnXHJcblx0XHRcdERFVklDRS5kZXNrdG9wXHJcblx0XHRdXHJcblx0XHRicm93c2VyLmRldmljZSA9IGRldmljZVsxXVxyXG5cdFx0cmV0dXJuIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGFkIG9yIGJyb3dzZXIuZGV2aWNlID09IERFVklDRS5pcGhvbmUgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwb2RcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcclxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxyXG5cdFx0c3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6dXNlcklkLHNwYWNlOnNwYWNlSWR9LGZpZWxkczp7b3JnYW5pemF0aW9uczoxfSlcclxuXHRcdG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyPy5vcmdhbml6YXRpb25zXHJcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGlmIGlzSW5jbHVkZVBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXHJcblx0XHRcdHJldHVybiBfLnVuaW9uIG9yZ2FuaXphdGlvbnMscGFyZW50c1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xyXG5cclxuXHRTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9ICh0YXJnZXQsIGlmciktPlxyXG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcclxuXHRcdFx0cmV0dXJuXHJcblx0XHR0YXJnZXQuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyICdjb250ZXh0bWVudScsIChldikgLT5cclxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdGlmIGlmclxyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXHJcblx0XHRcdFx0aWZyID0gdGFyZ2V0LiQoaWZyKVxyXG5cdFx0XHRpZnIubG9hZCAtPlxyXG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5JylcclxuXHRcdFx0XHRpZiBpZnJCb2R5XHJcblx0XHRcdFx0XHRpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxyXG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXHJcblx0XHRcdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0U3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IChzcGFjZUlkLHVzZXJJZCxpc0luY2x1ZGVQYXJlbnRzKS0+XHJcblx0XHRzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjp1c2VySWQsc3BhY2U6c3BhY2VJZH0sZmllbGRzOntvcmdhbml6YXRpb25zOjF9KVxyXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcclxuXHRcdHVubGVzcyBvcmdhbml6YXRpb25zXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIGRiLm9yZ2FuaXphdGlvbnMuZmluZChfaWQ6eyRpbjpvcmdhbml6YXRpb25zfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInBhcmVudHNcIilcclxuXHRcdFx0cmV0dXJuIF8udW5pb24gb3JnYW5pemF0aW9ucyxwYXJlbnRzXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBvcmdhbml6YXRpb25zXHJcblxyXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cdCNUT0RPIOa3u+WKoOacjeWKoeerr+aYr+WQpuaJi+acuueahOWIpOaWrSjkvp3mja5yZXF1ZXN0KVxyXG5cdFN0ZWVkb3MuaXNNb2JpbGUgPSAoKS0+XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFN0ZWVkb3MuaXNTcGFjZUFkbWluID0gKHNwYWNlSWQsIHVzZXJJZCktPlxyXG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRcdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZClcclxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdHJldHVybiBzcGFjZS5hZG1pbnMuaW5kZXhPZih1c2VySWQpPj0wXHJcblxyXG5cdFN0ZWVkb3MuaXNMZWdhbFZlcnNpb24gPSAoc3BhY2VJZCxhcHBfdmVyc2lvbiktPlxyXG5cdFx0aWYgIXNwYWNlSWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRjaGVjayA9IGZhbHNlXHJcblx0XHRtb2R1bGVzID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk/Lm1vZHVsZXNcclxuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXHJcblx0XHRcdGNoZWNrID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGNoZWNrXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q6KaB5pWw57uEb3JnSWRz5Lit5Lu75L2V5LiA5Liq57uE57uH5pyJ5p2D6ZmQ5bCx6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxyXG5cdFx0dXNlT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7X2lkOiB7JGluOm9yZ0lkc319LHtmaWVsZHM6e3BhcmVudHM6MSxhZG1pbnM6MX19KS5mZXRjaCgpXHJcblx0XHRwYXJlbnRzID0gW11cclxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XHJcblx0XHRcdGlmIG9yZy5wYXJlbnRzXHJcblx0XHRcdFx0cGFyZW50cyA9IF8udW5pb24gcGFyZW50cyxvcmcucGFyZW50c1xyXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxyXG5cdFx0aWYgYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aFxyXG5cdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwYXJlbnRzID0gXy5mbGF0dGVuIHBhcmVudHNcclxuXHRcdFx0cGFyZW50cyA9IF8udW5pcSBwYXJlbnRzXHJcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcclxuXHRcdFx0XHRpc09yZ0FkbWluID0gdHJ1ZVxyXG5cdFx0cmV0dXJuIGlzT3JnQWRtaW5cclxuXHJcblxyXG5cdCMg5Yik5pat5pWw57uEb3JnSWRz5Lit55qEb3JnIGlk6ZuG5ZCI5a+55LqO55So5oi3dXNlcklk5piv5ZCm5pyJ5YWo6YOo57uE57uH566h55CG5ZGY5p2D6ZmQ77yM5Y+q5pyJ5pWw57uEb3JnSWRz5Lit5q+P5Liq57uE57uH6YO95pyJ5p2D6ZmQ5omN6L+U5ZuedHJ1Ze+8jOWPjeS5i+i/lOWbnmZhbHNlXHJcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cclxuXHRcdHVubGVzcyBvcmdJZHMubGVuZ3RoXHJcblx0XHRcdHJldHVybiB0cnVlXHJcblx0XHRpID0gMFxyXG5cdFx0d2hpbGUgaSA8IG9yZ0lkcy5sZW5ndGhcclxuXHRcdFx0aXNPcmdBZG1pbiA9IFN0ZWVkb3MuaXNPcmdBZG1pbkJ5T3JnSWRzIFtvcmdJZHNbaV1dLCB1c2VySWRcclxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRpKytcclxuXHRcdHJldHVybiBpc09yZ0FkbWluXHJcblxyXG5cdFN0ZWVkb3MuYWJzb2x1dGVVcmwgPSAodXJsKS0+XHJcblx0XHRpZiB1cmxcclxuXHRcdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxyXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXHJcblx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRcdGVsc2VcclxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdFx0dHJ5XHJcblx0XHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXHJcblx0XHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxyXG5cdFx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHJcblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xyXG5cdFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyXHQ9IChyZXEsIHJlcykgLT5cclxuXHJcblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcclxuXHJcblx0XHRwYXNzd29yZCA9IHJlcS5xdWVyeT8ucGFzc3dvcmRcclxuXHJcblx0XHRpZiB1c2VybmFtZSAmJiBwYXNzd29yZFxyXG5cdFx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7c3RlZWRvc19pZDogdXNlcm5hbWV9KVxyXG5cclxuXHRcdFx0aWYgIXVzZXJcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblx0XHRcdHJlc3VsdCA9IEFjY291bnRzLl9jaGVja1Bhc3N3b3JkIHVzZXIsIHBhc3N3b3JkXHJcblxyXG5cdFx0XHRpZiByZXN1bHQuZXJyb3JcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHVzZXJcclxuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnk/W1wiWC1Vc2VyLUlkXCJdXHJcblxyXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLCBhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXHJcblxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblxyXG5cdCNcdOajgOafpXVzZXJJZOOAgWF1dGhUb2tlbuaYr+WQpuacieaViFxyXG5cdFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4gPSAodXNlcklkLCBhdXRoVG9rZW4pIC0+XHJcblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pXHJcblx0XHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXHJcblx0XHRcdGlmIHVzZXJcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcclxuXHRTdGVlZG9zLmRlY3J5cHQgPSAocGFzc3dvcmQsIGtleSwgaXYpLT5cclxuXHRcdHRyeVxyXG5cdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0bGVuID0ga2V5Lmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdGMgPSBcIlwiXHJcblx0XHRcdFx0aSA9IDBcclxuXHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHR3aGlsZSBpIDwgbVxyXG5cdFx0XHRcdFx0YyA9IFwiIFwiICsgY1xyXG5cdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkgKyBjXHJcblx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0XHRkZWNpcGhlciA9IGNyeXB0by5jcmVhdGVEZWNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0XHRkZWNpcGhlck1zZyA9IEJ1ZmZlci5jb25jYXQoW2RlY2lwaGVyLnVwZGF0ZShwYXNzd29yZCwgJ2Jhc2U2NCcpLCBkZWNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcclxuXHRcdFx0cmV0dXJuIHBhc3N3b3JkO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZW5jcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxyXG5cdFx0a2V5MzIgPSBcIlwiXHJcblx0XHRsZW4gPSBrZXkubGVuZ3RoXHJcblx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRpID0gMFxyXG5cdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0aSsrXHJcblx0XHRcdGtleTMyID0ga2V5ICsgY1xyXG5cdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXHJcblxyXG5cdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXHJcblxyXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXHJcblxyXG5cdFx0cGFzc3dvcmQgPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRyZXR1cm4gcGFzc3dvcmQ7XHJcblxyXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxyXG5cclxuXHRcdGlmICFhY2Nlc3NfdG9rZW5cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblxyXG5cdFx0dXNlcklkID0gYWNjZXNzX3Rva2VuLnNwbGl0KFwiLVwiKVswXVxyXG5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGFjY2Vzc190b2tlbilcclxuXHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXHJcblxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRyZXR1cm4gdXNlcklkXHJcblx0XHRlbHNlXHJcblx0XHRcdCMg5aaC5p6cdXNlcuihqOacquafpeWIsO+8jOWImeS9v+eUqG9hdXRoMuWNj+iurueUn+aIkOeahHRva2Vu5p+l5om+55So5oi3XHJcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cclxuXHJcblx0XHRcdG9iaiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7J2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VufSlcclxuXHRcdFx0aWYgb2JqXHJcblx0XHRcdFx0IyDliKTmlq10b2tlbueahOacieaViOacn1xyXG5cdFx0XHRcdGlmIG9iaj8uZXhwaXJlcyA8IG5ldyBEYXRlKClcclxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gb2JqPy51c2VySWRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIG5vdCBmb3VuZC5cIlxyXG5cdFx0cmV0dXJuIG51bGxcclxuXHJcblx0U3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gKHJlcSwgcmVzKS0+XHJcblxyXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxyXG5cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcblx0XHRpZiBTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCxhdXRoVG9rZW4pXHJcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcclxuXHJcblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xyXG5cclxuXHRcdGlmIHJlcS5oZWFkZXJzXHJcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdXHJcblxyXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcblx0XHRcdHJldHVybiBudWxsXHJcblxyXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcclxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxyXG5cclxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XHJcblx0XHR0cnlcclxuXHRcdFx0dXNlcklkID0gcmVxLnVzZXJJZFxyXG5cclxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSlcclxuXHJcblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcclxuXHRcdFx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxyXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0Y2F0Y2ggZVxyXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXHJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcclxuXHRcdFx0XHRcdGRhdGE6XHJcblx0XHRcdFx0XHRcdFwiZXJyb3JcIjogZS5tZXNzYWdlLFxyXG5cdFx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2VcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cclxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xyXG4jIGV4Y2VwdCBmb3IgaW5jbHVkZSwgY29udGFpbnMsIHJldmVyc2UgYW5kIGpvaW4gdGhhdCBhcmVcclxuIyBkcm9wcGVkIGJlY2F1c2UgdGhleSBjb2xsaWRlIHdpdGggdGhlIGZ1bmN0aW9ucyBhbHJlYWR5XHJcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxyXG5cclxubWl4aW4gPSAob2JqKSAtPlxyXG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cclxuXHRcdGlmIG5vdCBfW25hbWVdIGFuZCBub3QgXy5wcm90b3R5cGVbbmFtZV0/XHJcblx0XHRcdGZ1bmMgPSBfW25hbWVdID0gb2JqW25hbWVdXHJcblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cclxuXHRcdFx0XHRhcmdzID0gW3RoaXMuX3dyYXBwZWRdXHJcblx0XHRcdFx0cHVzaC5hcHBseShhcmdzLCBhcmd1bWVudHMpXHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXHJcblxyXG4jbWl4aW4oX3MuZXhwb3J0cygpKVxyXG5cclxuaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiMg5Yik5pat5piv5ZCm5piv6IqC5YGH5pelXHJcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxyXG5cdFx0aWYgIWRhdGVcclxuXHRcdFx0ZGF0ZSA9IG5ldyBEYXRlXHJcblx0XHRjaGVjayBkYXRlLCBEYXRlXHJcblx0XHRkYXkgPSBkYXRlLmdldERheSgpXHJcblx0XHQjIOWRqOWFreWRqOaXpeS4uuWBh+acn1xyXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcclxuXHRcdFx0cmV0dXJuIHRydWVcclxuXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHQjIOagueaNruS8oOWFpeaXtumXtChkYXRlKeiuoeeul+WHoOS4quW3peS9nOaXpShkYXlzKeWQjueahOaXtumXtCxkYXlz55uu5YmN5Y+q6IO95piv5pW05pWwXHJcblx0U3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lID0gKGRhdGUsIGRheXMpLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdGNoZWNrIGRheXMsIE51bWJlclxyXG5cdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XHJcblx0XHRcdGlmIGkgPCBkYXlzXHJcblx0XHRcdFx0cGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQqNjAqNjAqMTAwMClcclxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGNhY3VsYXRlRGF0ZShpLCBkYXlzKVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdGNhY3VsYXRlRGF0ZSgwLCBkYXlzKVxyXG5cdFx0cmV0dXJuIHBhcmFtX2RhdGVcclxuXHJcblx0IyDorqHnrpfljYrkuKrlt6XkvZzml6XlkI7nmoTml7bpl7RcclxuXHQjIOWPguaVsCBuZXh05aaC5p6c5Li6dHJ1ZeWImeihqOekuuWPquiuoeeul2RhdGXml7bpl7TlkI7pnaLntKfmjqXnnYDnmoR0aW1lX3BvaW50c1xyXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cclxuXHRcdGNoZWNrIGRhdGUsIERhdGVcclxuXHRcdHRpbWVfcG9pbnRzID0gTWV0ZW9yLnNldHRpbmdzLnJlbWluZD8udGltZV9wb2ludHNcclxuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJ0aW1lX3BvaW50cyBpcyBudWxsXCJcclxuXHRcdFx0dGltZV9wb2ludHMgPSBbe1wiaG91clwiOiA4LCBcIm1pbnV0ZVwiOiAzMCB9LCB7XCJob3VyXCI6IDE0LCBcIm1pbnV0ZVwiOiAzMCB9XVxyXG5cclxuXHRcdGxlbiA9IHRpbWVfcG9pbnRzLmxlbmd0aFxyXG5cdFx0c3RhcnRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcclxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cdFx0c3RhcnRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1swXS5ob3VyXHJcblx0XHRzdGFydF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbMF0ubWludXRlXHJcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXHJcblx0XHRlbmRfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2xlbiAtIDFdLm1pbnV0ZVxyXG5cclxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxyXG5cclxuXHRcdGogPSAwXHJcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXHJcblx0XHRpZiBkYXRlIDwgc3RhcnRfZGF0ZVxyXG5cdFx0XHRpZiBuZXh0XHJcblx0XHRcdFx0aiA9IDBcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg5Yqg5Y2K5LiqdGltZV9wb2ludHNcclxuXHRcdFx0XHRqID0gbGVuLzJcclxuXHRcdGVsc2UgaWYgZGF0ZSA+PSBzdGFydF9kYXRlIGFuZCBkYXRlIDwgZW5kX2RhdGVcclxuXHRcdFx0aSA9IDBcclxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxyXG5cdFx0XHRcdGZpcnN0X2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUgPSBuZXcgRGF0ZSBkYXRlXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXHJcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRNaW51dGVzIHRpbWVfcG9pbnRzW2ldLm1pbnV0ZVxyXG5cdFx0XHRcdHNlY29uZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyXHJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXHJcblxyXG5cdFx0XHRcdGlmIGRhdGUgPj0gZmlyc3RfZGF0ZSBhbmQgZGF0ZSA8IHNlY29uZF9kYXRlXHJcblx0XHRcdFx0XHRicmVha1xyXG5cclxuXHRcdFx0XHRpKytcclxuXHJcblx0XHRcdGlmIG5leHRcclxuXHRcdFx0XHRqID0gaSArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGogPSBpICsgbGVuLzJcclxuXHJcblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcclxuXHRcdFx0aWYgbmV4dFxyXG5cdFx0XHRcdGogPSBtYXhfaW5kZXggKyAxXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRqID0gbWF4X2luZGV4ICsgbGVuLzJcclxuXHJcblx0XHRpZiBqID4gbWF4X2luZGV4XHJcblx0XHRcdCMg6ZqU5aSp6ZyA5Yik5pat6IqC5YGH5pelXHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlID0gU3RlZWRvcy5jYWN1bGF0ZVdvcmtpbmdUaW1lIGRhdGUsIDFcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0ubWludXRlXHJcblx0XHRlbHNlIGlmIGogPD0gbWF4X2luZGV4XHJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcclxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tqXS5taW51dGVcclxuXHJcblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcclxuXHJcbmlmIE1ldGVvci5pc1NlcnZlclxyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXHJcblx0XHRnZXRTdGVlZG9zVG9rZW46IChhcHBJZCwgdXNlcklkLCBhdXRoVG9rZW4pLT5cclxuXHRcdFx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxyXG5cdFx0XHRpZiBhcHBcclxuXHRcdFx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XHJcblxyXG5cdFx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0XHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcclxuXHRcdFx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHRcdFx0XHRpZiB1c2VyXHJcblx0XHRcdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXHJcblx0XHRcdFx0XHRpZiBhcHAuc2VjcmV0XHJcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiXHJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXHJcblx0XHRcdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0XHRcdGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoXHJcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxyXG5cdFx0XHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cclxuXHRcdFx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXHJcblx0XHRcdFx0XHRcdFx0aSsrXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0XHRcdGVsc2UgaWYgbGVuID49IDMyXHJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0XHRcdGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKG5vdywgJ3V0ZjgnKSksIGNpcGhlci5maW5hbCgpXSlcclxuXHJcblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXHJcblxyXG5cdFx0XHRyZXR1cm4gc3RlZWRvc190b2tlblxyXG5cclxuXHRcdGxvY2FsZTogKHVzZXJJZCwgaXNJMThuKS0+XHJcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSx7ZmllbGRzOiB7bG9jYWxlOiAxfX0pXHJcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxyXG5cdFx0XHRpZiBpc0kxOG5cclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcclxuXHRcdFx0XHRpZiBsb2NhbGUgPT0gXCJ6aC1jblwiXHJcblx0XHRcdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHRcdFx0cmV0dXJuIGxvY2FsZVxyXG5cclxuXHRcdGNoZWNrVXNlcm5hbWVBdmFpbGFiaWxpdHk6ICh1c2VybmFtZSkgLT5cclxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXHJcblxyXG5cclxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cclxuXHRcdFx0cmVhc29uID0gdCBcInBhc3N3b3JkX2ludmFsaWRcIlxyXG5cdFx0XHR2YWxpZCA9IHRydWVcclxuXHRcdFx0dW5sZXNzIHB3ZFxyXG5cdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuXHJcblx0XHRcdHBhc3N3b3JQb2xpY3kgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5XHJcblx0XHRcdHBhc3N3b3JQb2xpY3lFcnJvciA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWM/LnBhc3N3b3JkPy5wb2xpY3lFcnJvclxyXG5cdFx0XHRpZiBwYXNzd29yUG9saWN5XHJcblx0XHRcdFx0aWYgIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJylcclxuXHRcdFx0XHRcdHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvclxyXG5cdFx0XHRcdFx0dmFsaWQgPSBmYWxzZVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHZhbGlkID0gdHJ1ZVxyXG4jXHRcdFx0ZWxzZVxyXG4jXHRcdFx0XHR1bmxlc3MgL1xcZCsvLnRlc3QocHdkKVxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuI1x0XHRcdFx0dW5sZXNzIC9bYS16QS1aXSsvLnRlc3QocHdkKVxyXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcclxuI1x0XHRcdFx0aWYgcHdkLmxlbmd0aCA8IDhcclxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXHJcblx0XHRcdGlmIHZhbGlkXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHJldHVybiBlcnJvcjpcclxuXHRcdFx0XHRcdHJlYXNvbjogcmVhc29uXHJcblxyXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxyXG5cdHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XSkvZywgXCJcXFxcJDFcIilcclxuXHJcblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cclxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKVxyXG5cclxuQ3JlYXRvci5nZXREQkFwcHMgPSAoc3BhY2VfaWQpLT5cclxuXHRkYkFwcHMgPSB7fVxyXG5cdENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCxpc19jcmVhdG9yOnRydWUsdmlzaWJsZTp0cnVlfSwge1xyXG5cdFx0ZmllbGRzOiB7XHJcblx0XHRcdGNyZWF0ZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZF9ieTogMFxyXG5cdFx0fVxyXG5cdH0pLmZvckVhY2ggKGFwcCktPlxyXG5cdFx0ZGJBcHBzW2FwcC5faWRdID0gYXBwXHJcblxyXG5cdHJldHVybiBkYkFwcHNcclxuXHJcbkNyZWF0b3IuZ2V0REJEYXNoYm9hcmRzID0gKHNwYWNlX2lkKS0+XHJcblx0ZGJEYXNoYm9hcmRzID0ge31cclxuXHRDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRjcmVhdGVkX2J5OiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KS5mb3JFYWNoIChkYXNoYm9hcmQpLT5cclxuXHRcdGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxyXG5cclxuXHRyZXR1cm4gZGJEYXNoYm9hcmRzXHJcblxyXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcclxuXHRDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcclxuXHRTdGVlZG9zLmdldEF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxyXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKVxyXG5cdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblx0XHRpZiAhYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09ICdCZWFyZXInXHJcblx0XHRcdGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24uc3BsaXQoJyAnKVsxXVxyXG5cdFx0cmV0dXJuIGF1dGhUb2tlblxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0TWV0ZW9yLmF1dG9ydW4gKCktPlxyXG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcclxuXHRcdFx0c2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSlcclxuI1x0XHRlbHNlXHJcbiNcdFx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGN1cnJlbnRfYXBwX2lkLi4uJyk7XHJcbiNcdFx0XHRzZXNzaW9uU3RvcmFnZS5yZW1vdmVJdGVtKCdjdXJyZW50X2FwcF9pZCcpXHJcblx0U3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSAoKS0+XHJcblx0XHRpZiBTZXNzaW9uLmdldCgnYXBwX2lkJylcclxuXHRcdFx0cmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcclxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgbWl4aW47ICAgICAgICAgXG5cblN0ZWVkb3MgPSB7XG4gIHNldHRpbmdzOiB7fSxcbiAgZGI6IGRiLFxuICBzdWJzOiB7fSxcbiAgaXNQaG9uZUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgcmV0dXJuICEhKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDAgOiB2b2lkIDApO1xuICB9LFxuICBudW1iZXJUb1N0cmluZzogZnVuY3Rpb24obnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKSB7XG4gICAgdmFyIHJlZiwgcmVmMSwgcmVnO1xuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSBcIm51bWJlclwiKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG51bWJlciAhPT0gXCJOYU5cIikge1xuICAgICAgaWYgKHNjYWxlIHx8IHNjYWxlID09PSAwKSB7XG4gICAgICAgIG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFub3RUaG91c2FuZHMpIHtcbiAgICAgICAgaWYgKCEoc2NhbGUgfHwgc2NhbGUgPT09IDApKSB7XG4gICAgICAgICAgc2NhbGUgPSAocmVmID0gbnVtYmVyLm1hdGNoKC9cXC4oXFxkKykvKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmWzFdKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKCFzY2FsZSkge1xuICAgICAgICAgICAgc2NhbGUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2c7XG4gICAgICAgIGlmIChzY2FsZSA9PT0gMCkge1xuICAgICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZztcbiAgICAgICAgfVxuICAgICAgICBudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdmFsaUpxdWVyeVN5bWJvbHM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZWc7XG4gICAgcmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKTtcbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbiAgfVxufTtcblxuXG4vKlxuICogS2ljayBvZmYgdGhlIGdsb2JhbCBuYW1lc3BhY2UgZm9yIFN0ZWVkb3MuXG4gKiBAbmFtZXNwYWNlIFN0ZWVkb3NcbiAqL1xuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSBmdW5jdGlvbihsb2NhbGUpIHtcbiAgdmFyIGNvdW50cnk7XG4gIGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpO1xuICByZXR1cm4gXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIFN0ZWVkb3Muc3BhY2VVcGdyYWRlZE1vZGFsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHN3YWwoe1xuICAgICAgdGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksXG4gICAgICB0ZXh0OiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RleHRcIiksXG4gICAgICBodG1sOiB0cnVlLFxuICAgICAgdHlwZTogXCJ3YXJuaW5nXCIsXG4gICAgICBjb25maXJtQnV0dG9uVGV4dDogVEFQaTE4bi5fXyhcIk9LXCIpXG4gICAgfSk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRCZ0JvZHk7XG4gICAgYWNjb3VudEJnQm9keSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJiZ19ib2R5XCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudEJnQm9keSkge1xuICAgICAgcmV0dXJuIGFjY291bnRCZ0JvZHkudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuYXBwbHlBY2NvdW50QmdCb2R5VmFsdWUgPSBmdW5jdGlvbihhY2NvdW50QmdCb2R5VmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgYXZhdGFyLCBhdmF0YXJVcmwsIGJhY2tncm91bmQsIHJlZiwgcmVmMSwgcmVmMiwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoYWNjb3VudEJnQm9keVZhbHVlLnVybCkge1xuICAgICAgaWYgKHVybCA9PT0gYXZhdGFyKSB7XG4gICAgICAgIGF2YXRhclVybCA9ICdhcGkvZmlsZXMvYXZhdGFycy8nICsgYXZhdGFyO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybChhdmF0YXJVcmwpKSArIFwiKVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCJib2R5XCIpLmNzcyhcImJhY2tncm91bmRJbWFnZVwiLCBcInVybChcIiArIChTdGVlZG9zLmFic29sdXRlVXJsKHVybCkpICsgXCIpXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBiYWNrZ3JvdW5kID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjIgPSByZWYxLmFkbWluKSAhPSBudWxsID8gcmVmMi5iYWNrZ3JvdW5kIDogdm9pZCAwIDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgaWYgKGJhY2tncm91bmQpIHtcbiAgICAgICAgJChcImJvZHlcIikuY3NzKFwiYmFja2dyb3VuZEltYWdlXCIsIFwidXJsKFwiICsgKFN0ZWVkb3MuYWJzb2x1dGVVcmwoYmFja2dyb3VuZCkpICsgXCIpXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFja2dyb3VuZCA9IFwiL3BhY2thZ2VzL3N0ZWVkb3NfdGhlbWUvY2xpZW50L2JhY2tncm91bmQvc2VhLmpwZ1wiO1xuICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIiwgXCJ1cmwoXCIgKyAoU3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKSkgKyBcIilcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc05lZWRUb0xvY2FsKSB7XG4gICAgICBpZiAoTWV0ZW9yLmxvZ2dpbmdJbigpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChTdGVlZG9zLnVzZXJJZCgpKSB7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIiwgdXJsKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIsIGF2YXRhcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIpO1xuICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFNraW5WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50U2tpbjtcbiAgICBhY2NvdW50U2tpbiA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJza2luXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFNraW4pIHtcbiAgICAgIHJldHVybiBhY2NvdW50U2tpbi52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5nZXRBY2NvdW50Wm9vbVZhbHVlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFjY291bnRab29tO1xuICAgIGFjY291bnRab29tID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZE9uZSh7XG4gICAgICB1c2VyOiBTdGVlZG9zLnVzZXJJZCgpLFxuICAgICAga2V5OiBcInpvb21cIlxuICAgIH0pO1xuICAgIGlmIChhY2NvdW50Wm9vbSkge1xuICAgICAgcmV0dXJuIGFjY291bnRab29tLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKGFjY291bnRab29tVmFsdWUsIGlzTmVlZFRvTG9jYWwpIHtcbiAgICB2YXIgem9vbU5hbWUsIHpvb21TaXplO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRab29tVmFsdWUgPSB7fTtcbiAgICAgIGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpO1xuICAgICAgYWNjb3VudFpvb21WYWx1ZS5zaXplID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgfVxuICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiem9vbS1ub3JtYWxcIikucmVtb3ZlQ2xhc3MoXCJ6b29tLWxhcmdlXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1leHRyYS1sYXJnZVwiKTtcbiAgICB6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZTtcbiAgICB6b29tU2l6ZSA9IGFjY291bnRab29tVmFsdWUuc2l6ZTtcbiAgICBpZiAoIXpvb21OYW1lKSB7XG4gICAgICB6b29tTmFtZSA9IFwibGFyZ2VcIjtcbiAgICAgIHpvb21TaXplID0gMS4yO1xuICAgIH1cbiAgICBpZiAoem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKSkge1xuICAgICAgJChcImJvZHlcIikuYWRkQ2xhc3MoXCJ6b29tLVwiICsgem9vbU5hbWUpO1xuICAgIH1cbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAoYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIiwgYWNjb3VudFpvb21WYWx1ZS5uYW1lKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIiwgYWNjb3VudFpvb21WYWx1ZS5zaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Muc2hvd0hlbHAgPSBmdW5jdGlvbih1cmwpIHtcbiAgICB2YXIgY291bnRyeSwgbG9jYWxlO1xuICAgIGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKCk7XG4gICAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gICAgdXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiO1xuICAgIHJldHVybiB3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpO1xuICB9O1xuICBTdGVlZG9zLmdldFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBhdXRoVG9rZW4sIGxpbmtlcjtcbiAgICBhdXRoVG9rZW4gPSB7fTtcbiAgICBhdXRoVG9rZW5bXCJzcGFjZUlkXCJdID0gU3RlZWRvcy5nZXRTcGFjZUlkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG4gICAgbGlua2VyID0gXCI/XCI7XG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICBsaW5rZXIgPSBcIiZcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybCArIGxpbmtlciArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXV0aFRva2VuO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICByZXR1cm4gXCJhcGkvc2V0dXAvc3NvL1wiICsgYXBwX2lkICsgXCI/XCIgKyAkLnBhcmFtKGF1dGhUb2tlbik7XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIHVybDtcbiAgICB1cmwgPSBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwodXJsKTtcbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24gPSB1cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjbWQsIGV4ZWMsIG9wZW5fdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICAgIGV4ZWMgPSBudy5yZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbiAgICAgICAgb3Blbl91cmwgPSB1cmw7XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIHJldHVybiBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gU3RlZWRvcy5vcGVuV2luZG93KHVybCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLm9wZW5BcHAgPSBmdW5jdGlvbihhcHBfaWQpIHtcbiAgICB2YXIgYXBwLCBjbWQsIGUsIGV2YWxGdW5TdHJpbmcsIGV4ZWMsIG9uX2NsaWNrLCBvcGVuX3VybCwgcGF0aDtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgU3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgYXBwID0gZGIuYXBwcy5maW5kT25lKGFwcF9pZCk7XG4gICAgaWYgKCFhcHApIHtcbiAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvbl9jbGljayA9IGFwcC5vbl9jbGljaztcbiAgICBpZiAoYXBwLmlzX3VzZV9pZSkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBpZiAob25fY2xpY2spIHtcbiAgICAgICAgICBwYXRoID0gXCJhcGkvYXBwL3Nzby9cIiArIGFwcF9pZCArIFwiP2F1dGhUb2tlbj1cIiArIChBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpKSArIFwiJnVzZXJJZD1cIiArIChNZXRlb3IudXNlcklkKCkpO1xuICAgICAgICAgIG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgcGF0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBvcGVuX3VybDtcbiAgICAgICAgfVxuICAgICAgICBjbWQgPSBcInN0YXJ0IGlleHBsb3JlLmV4ZSBcXFwiXCIgKyBvcGVuX3VybCArIFwiXFxcIlwiO1xuICAgICAgICBleGVjKGNtZCwgZnVuY3Rpb24oZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0b2FzdHIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRiLmFwcHMuaXNJbnRlcm5hbEFwcChhcHAudXJsKSkge1xuICAgICAgRmxvd1JvdXRlci5nbyhhcHAudXJsKTtcbiAgICB9IGVsc2UgaWYgKGFwcC5pc191c2VfaWZyYW1lKSB7XG4gICAgICBpZiAoYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5XaW5kb3coU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwcHMvaWZyYW1lL1wiICsgYXBwLl9pZCkpO1xuICAgICAgfSBlbHNlIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkgfHwgU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEZsb3dSb3V0ZXIuZ28oXCIvYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9uX2NsaWNrKSB7XG4gICAgICBldmFsRnVuU3RyaW5nID0gXCIoZnVuY3Rpb24oKXtcIiArIG9uX2NsaWNrICsgXCJ9KSgpXCI7XG4gICAgICB0cnkge1xuICAgICAgICBldmFsKGV2YWxGdW5TdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgIGUgPSBlcnJvcjE7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlICsgXCJcXHJcXG5cIiArIGUuc3RhY2spO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBTdGVlZG9zLm9wZW5BcHBXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICB9XG4gICAgaWYgKCFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGljaykge1xuICAgICAgcmV0dXJuIFNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuY2hlY2tTcGFjZUJhbGFuY2UgPSBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIGVuZF9kYXRlLCBtaW5fbW9udGhzLCBzcGFjZTtcbiAgICBpZiAoIXNwYWNlSWQpIHtcbiAgICAgIHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKTtcbiAgICB9XG4gICAgbWluX21vbnRocyA9IDE7XG4gICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgIG1pbl9tb250aHMgPSAzO1xuICAgIH1cbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpO1xuICAgIGVuZF9kYXRlID0gc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmVuZF9kYXRlIDogdm9pZCAwO1xuICAgIGlmICgoc3BhY2UgIT0gbnVsbCA/IHNwYWNlLmlzX3BhaWQgOiB2b2lkIDApICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY7XG4gICAgaWYgKCFzcGFjZUlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNoZWNrID0gZmFsc2U7XG4gICAgbW9kdWxlcyA9IChyZWYgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKSkgIT0gbnVsbCA/IHJlZi5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjtcbiAgICAgIGlmIChvcmcucGFyZW50cykge1xuICAgICAgICBwYXJlbnRzID0gXy51bmlvbihwYXJlbnRzLCBvcmcucGFyZW50cyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKHJlZiA9IG9yZy5hZG1pbnMpICE9IG51bGwgPyByZWYuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmLCByZWYxLCByZWYyLCByZWYzLCByZXN1bHQsIHVzZXIsIHVzZXJJZCwgdXNlcm5hbWU7XG4gICAgdXNlcm5hbWUgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmMiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjJbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjMgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYzW1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHVzZXJJZDtcbiAgICB1c2VySWQgPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmW1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMVtcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMiA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYyLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmMyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWYzLl9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWYsIHNlY29uZF9kYXRlLCBzdGFydF9kYXRlLCB0aW1lX3BvaW50cztcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICB0aW1lX3BvaW50cyA9IChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kKSAhPSBudWxsID8gcmVmLnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciBwYXNzd29yUG9saWN5LCBwYXNzd29yUG9saWN5RXJyb3IsIHJlYXNvbiwgcmVmLCByZWYxLCByZWYyLCByZWYzLCB2YWxpZDtcbiAgICAgIHJlYXNvbiA9IHQoXCJwYXNzd29yZF9pbnZhbGlkXCIpO1xuICAgICAgdmFsaWQgPSB0cnVlO1xuICAgICAgaWYgKCFwd2QpIHtcbiAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHBhc3N3b3JQb2xpY3kgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjEgPSByZWYucGFzc3dvcmQpICE9IG51bGwgPyByZWYxLnBvbGljeSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIHBhc3N3b3JQb2xpY3lFcnJvciA9IChyZWYyID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMy5wb2xpY3lFcnJvciA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGlmIChwYXNzd29yUG9saWN5KSB7XG4gICAgICAgIGlmICghKG5ldyBSZWdFeHAocGFzc3dvclBvbGljeSkpLnRlc3QocHdkIHx8ICcnKSkge1xuICAgICAgICAgIHJlYXNvbiA9IHBhc3N3b3JQb2xpY3lFcnJvcjtcbiAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZhbGlkKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgcmVhc29uOiByZWFzb25cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuU3RlZWRvcy5jb252ZXJ0U3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpO1xufTtcblxuU3RlZWRvcy5yZW1vdmVTcGVjaWFsQ2hhcmFjdGVyID0gZnVuY3Rpb24oc3RyKSB7XG4gIHJldHVybiBzdHIucmVwbGFjZSgvKFtcXF5cXCRcXChcXClcXCpcXCtcXD9cXC5cXFxcXFx8XFxbXFxdXFx7XFx9XFx+XFxgXFxAXFwjXFwlXFwmXFw9XFwnXFxcIlxcOlxcO1xcPFxcPlxcLFxcL10pL2csIFwiXCIpO1xufTtcblxuQ3JlYXRvci5nZXREQkFwcHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJBcHBzO1xuICBkYkFwcHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGlzX2NyZWF0b3I6IHRydWUsXG4gICAgdmlzaWJsZTogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgcmV0dXJuIGRiQXBwc1thcHAuX2lkXSA9IGFwcDtcbiAgfSk7XG4gIHJldHVybiBkYkFwcHM7XG59O1xuXG5DcmVhdG9yLmdldERCRGFzaGJvYXJkcyA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHZhciBkYkRhc2hib2FyZHM7XG4gIGRiRGFzaGJvYXJkcyA9IHt9O1xuICBDcmVhdG9yLkNvbGxlY3Rpb25zW1wiZGFzaGJvYXJkXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oZGFzaGJvYXJkKSB7XG4gICAgcmV0dXJuIGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJldHVybiBkYkRhc2hib2FyZHM7XG59O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5nZXRBdXRoVG9rZW4gPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICAgIHZhciBhdXRoVG9rZW4sIGNvb2tpZXM7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiAmJiByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMF0gPT09ICdCZWFyZXInKSB7XG4gICAgICBhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV07XG4gICAgfVxuICAgIHJldHVybiBhdXRoVG9rZW47XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdjdXJyZW50X2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnY3VycmVudF9hcHBfaWQnLCBTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSk7XG4gICAgfVxuICB9KTtcbiAgU3RlZWRvcy5nZXRDdXJyZW50QXBwSWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5nZXQoJ2FwcF9pZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcbiAgICB9XG4gIH07XG59XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XHJcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xyXG59KSIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgIE1ldGVvci5tZXRob2RzXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHtsYXN0X2xvZ29uOiBuZXcgRGF0ZSgpfX0pICBcclxuXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICBBY2NvdW50cy5vbkxvZ2luICgpLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgTWV0ZW9yLm1ldGhvZHNcclxuICAgIHVzZXJzX2FkZF9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuICAgICAgaWYgbm90IC9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpXHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIn1cclxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+IDAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1c2g6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIGFkZHJlc3M6IGVtYWlsXHJcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXHJcbiAgICAgICAgICAkc2V0OiBcclxuICAgICAgICAgICAgc3RlZWRvc19pZDogZW1haWxcclxuICAgICAgICAgICAgZW1haWxzOiBbXHJcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcclxuICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcclxuICAgICAgICAgICAgXVxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19yZW1vdmVfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcblxyXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxyXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXHJcbiAgICAgICAgcCA9IG51bGxcclxuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcclxuICAgICAgICAgICAgcCA9IGVcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSB7X2lkOiB0aGlzLnVzZXJJZH0sIFxyXG4gICAgICAgICAgJHB1bGw6IFxyXG4gICAgICAgICAgICBlbWFpbHM6IFxyXG4gICAgICAgICAgICAgIHBcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc192ZXJpZnlfZW1haWw6IChlbWFpbCkgLT5cclxuICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxyXG4gICAgICBpZiBub3QgZW1haWxcclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfZm9ybWF0X2Vycm9yXCJ9XHJcbiAgICAgIFxyXG5cclxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XHJcblxyXG4gICAgICByZXR1cm4ge31cclxuXHJcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogKGVtYWlsKSAtPlxyXG4gICAgICBpZiBub3QgQHVzZXJJZD9cclxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJ9XHJcbiAgICAgIGlmIG5vdCBlbWFpbFxyXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cclxuXHJcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXHJcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXHJcbiAgICAgIGVtYWlscy5mb3JFYWNoIChlKS0+XHJcbiAgICAgICAgaWYgZS5hZGRyZXNzID09IGVtYWlsXHJcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZS5wcmltYXJ5ID0gZmFsc2VcclxuXHJcbiAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LFxyXG4gICAgICAgICRzZXQ6XHJcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xyXG4gICAgICAgICAgZW1haWw6IGVtYWlsXHJcblxyXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcclxuICAgICAgcmV0dXJuIHt9XHJcblxyXG5cclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XHJcbiAgICAgICAgc3dhbFxyXG4gICAgICAgICAgICB0aXRsZTogdChcInByaW1hcnlfZW1haWxfbmVlZGVkXCIpLFxyXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXHJcbiAgICAgICAgICAgIHR5cGU6ICdpbnB1dCcsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFuaW1hdGlvbjogXCJzbGlkZS1mcm9tLXRvcFwiXHJcbiAgICAgICAgLCAoaW5wdXRWYWx1ZSkgLT5cclxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cclxuICAgICAgICAgICAgICAgIGlmIHJlc3VsdD8uZXJyb3JcclxuICAgICAgICAgICAgICAgICAgICB0b2FzdHIuZXJyb3IgcmVzdWx0Lm1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzd2FsIHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiXHJcbiMjI1xyXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxyXG5cclxuICAgICAgICBpZiBNZXRlb3IudXNlcigpXHJcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcclxuICAgICAgICAgICAgIyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZNZXRlb3IudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcclxuICAgICAgICAgIGlmICFwcmltYXJ5RW1haWxcclxuICAgICAgICAgICAgICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCgpO1xyXG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgTWV0ZW9yLm1ldGhvZHNcclxuICAgICAgICB1cGRhdGVVc2VyQXZhdGFyOiAoYXZhdGFyKSAtPlxyXG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xyXG5cdGZyb206IChmdW5jdGlvbigpe1xyXG5cdFx0dmFyIGRlZmF1bHRGcm9tID0gXCJTdGVlZG9zIDxub3JlcGx5QG1lc3NhZ2Uuc3RlZWRvcy5jb20+XCI7XHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxyXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XHJcblx0XHRcclxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHJcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXHJcblx0XHRcdHJldHVybiBkZWZhdWx0RnJvbTtcclxuXHRcdFxyXG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xyXG5cdH0pKCksXHJcblx0cmVzZXRQYXNzd29yZDoge1xyXG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZFwiLHt9LHVzZXIubG9jYWxlKTtcclxuXHRcdH0sXHJcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XHJcblx0XHRcdHZhciBzcGxpdHMgPSB1cmwuc3BsaXQoXCIvXCIpO1xyXG5cdFx0XHR2YXIgdG9rZW5Db2RlID0gc3BsaXRzW3NwbGl0cy5sZW5ndGgtMV07XHJcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcclxuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9yZXNldF9wYXNzd29yZF9ib2R5XCIse3Rva2VuX2NvZGU6dG9rZW5Db2RlfSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0dmVyaWZ5RW1haWw6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xyXG5cdFx0fSxcclxuXHRcdHRleHQ6IGZ1bmN0aW9uICh1c2VyLCB1cmwpIHtcclxuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xyXG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3ZlcmlmeV9hY2NvdW50XCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVucm9sbEFjY291bnQ6IHtcclxuXHRcdHN1YmplY3Q6IGZ1bmN0aW9uICh1c2VyKSB7XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XHJcblx0XHR9LFxyXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xyXG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XHJcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfc3RhcnRfc2VydmljZVwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XHJcblx0XHR9XHJcblx0fVxyXG59OyIsIi8vIOS/ruaUuWZ1bGxuYW1l5YC85pyJ6Zeu6aKY55qEb3JnYW5pemF0aW9uc1xyXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvb3JnYW5pemF0aW9ucy91cGdyYWRlL1wiLCBmdW5jdGlvbiAocmVxLCByZXMsIG5leHQpIHtcclxuICBcclxuXHR2YXIgb3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7ZnVsbG5hbWU6L+aWsOmDqOmXqC8sbmFtZTp7JG5lOlwi5paw6YOo6ZeoXCJ9fSk7XHJcblx0aWYgKG9yZ3MuY291bnQoKT4wKVxyXG5cdHtcclxuXHRcdG9yZ3MuZm9yRWFjaCAoZnVuY3Rpb24gKG9yZylcclxuXHRcdHtcclxuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcclxuXHRcdFx0ZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKG9yZy5faWQsIHskc2V0OiB7ZnVsbG5hbWU6IG9yZy5jYWxjdWxhdGVGdWxsbmFtZSgpfX0pO1xyXG5cdFx0XHRcclxuXHRcdH0pO1xyXG5cdH1cdFxyXG5cclxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcclxuICAgIFx0ZGF0YToge1xyXG5cdCAgICAgIFx0cmV0OiAwLFxyXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXHJcbiAgICBcdH1cclxuICBcdH0pO1xyXG59KTtcclxuXHJcbiIsImlmIE1ldGVvci5pc0NvcmRvdmFcclxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgICAgICAgICAgICAgUHVzaC5Db25maWd1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5kcm9pZDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291bmQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWJyYXRlOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWRnZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyQmFkZ2U6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcE5hbWU6IFwid29ya2Zsb3dcIlxyXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxyXG5cclxuIyBGaWx0ZXIgZGF0YSBvbiBzZXJ2ZXIgYnkgc3BhY2UgZmllbGRcclxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblx0XHRpZiAhdXNlclxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRzZWxlY3RvciA9IHt9XHJcblx0XHRpZiAhdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcclxuXHRcdFx0c3BhY2VzID0gc3BhY2VzLm1hcCAobikgLT4gcmV0dXJuIG4uX2lkXHJcblx0XHRcdHNlbGVjdG9yLnNwYWNlID0geyRpbjogc3BhY2VzfVxyXG5cdFx0cmV0dXJuIHNlbGVjdG9yXHJcblxyXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxyXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxyXG5cdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0dXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpXHJcblx0XHR1bmxlc3MgdXNlcklkXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XHJcblx0XHRpZiBzcGFjZUlkXHJcblx0XHRcdGlmIGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCxzcGFjZTogc3BhY2VJZH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBzcGFjZUlkfVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdGlmIE1ldGVvci5pc1NlcnZlclxyXG5cdFx0dW5sZXNzIHVzZXJJZFxyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cclxuXHRcdHNlbGVjdG9yID0ge31cclxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRfLmVhY2ggc3BhY2VfdXNlcnMsICh1KS0+XHJcblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXHJcblx0XHRzZWxlY3Rvci5zcGFjZSA9IHskaW46IHNwYWNlc31cclxuXHRcdHJldHVybiBzZWxlY3RvclxyXG5cclxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9XHJcblx0aWNvbjogXCJnbG9iZVwiXHJcblx0Y29sb3I6IFwiYmx1ZVwiXHJcblx0dGFibGVDb2x1bW5zOiBbXHJcblx0XHR7bmFtZTogXCJvcmRlcl9jcmVhdGVkKClcIn0sXHJcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxyXG5cdFx0e25hbWU6IFwidXNlcl9jb3VudFwifSxcclxuXHRcdHtuYW1lOiBcImVuZF9kYXRlXCJ9LFxyXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXHJcblx0XHR7bmFtZTogXCJvcmRlcl9wYWlkKClcIn1cclxuXHRdXHJcblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cclxuXHRyb3V0ZXJBZG1pbjogXCIvYWRtaW5cIlxyXG5cdHNlbGVjdG9yOiAodXNlcklkKSAtPlxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdGlmIFN0ZWVkb3MuaXNTcGFjZUFkbWluKClcclxuXHRcdFx0XHRyZXR1cm4ge3NwYWNlOiBTZXNzaW9uLmdldChcInNwYWNlSWRcIiksIHBhaWQ6IHRydWV9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblxyXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXHJcblx0XHRcdHJldHVybiB7fVxyXG5cdHNob3dFZGl0Q29sdW1uOiBmYWxzZVxyXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXHJcblx0ZGlzYWJsZUFkZDogdHJ1ZVxyXG5cdHBhZ2VMZW5ndGg6IDEwMFxyXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXHJcblx0QGJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzXHJcblx0QWRtaW5Db25maWc/LmNvbGxlY3Rpb25zX2FkZFxyXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xyXG5cdFx0YmlsbGluZ19wYXlfcmVjb3JkczogZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyIsIiAgICAgICAgICAgICBcblxuU2VsZWN0b3IgPSB7fTtcblxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIGlzX2Nsb3VkYWRtaW46IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge307XG4gICAgaWYgKCF1c2VyLmlzX2Nsb3VkYWRtaW4pIHtcbiAgICAgIHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHtcbiAgICAgICAgYWRtaW5zOiB7XG4gICAgICAgICAgJGluOiBbdXNlcklkXVxuICAgICAgICB9XG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgc3BhY2VzID0gc3BhY2VzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSB7XG4gICAgICAgICRpbjogc3BhY2VzXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZSA9IGZ1bmN0aW9uKHVzZXJJZCkge1xuICB2YXIgc2VsZWN0b3IsIHNwYWNlSWQsIHNwYWNlX3VzZXJzLCBzcGFjZXMsIHVzZXI7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICB1c2VySWQgPSBNZXRlb3IudXNlcklkKCk7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHNwYWNlSWQgPSBTZXNzaW9uLmdldChcInNwYWNlSWRcIik7XG4gICAgaWYgKHNwYWNlSWQpIHtcbiAgICAgIGlmIChkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICB9XG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIF8uZWFjaChzcGFjZV91c2VycywgZnVuY3Rpb24odSkge1xuICAgICAgcmV0dXJuIHNwYWNlcy5wdXNoKHUuc3BhY2UpO1xuICAgIH0pO1xuICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgJGluOiBzcGFjZXNcbiAgICB9O1xuICAgIHJldHVybiBzZWxlY3RvcjtcbiAgfVxufTtcblxuZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5hZG1pbkNvbmZpZyA9IHtcbiAgaWNvbjogXCJnbG9iZVwiLFxuICBjb2xvcjogXCJibHVlXCIsXG4gIHRhYmxlQ29sdW1uczogW1xuICAgIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfY3JlYXRlZCgpXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcIm1vZHVsZXNcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwidXNlcl9jb3VudFwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJlbmRfZGF0ZVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl90b3RhbF9mZWUoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJvcmRlcl9wYWlkKClcIlxuICAgIH1cbiAgXSxcbiAgZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl0sXG4gIHJvdXRlckFkbWluOiBcIi9hZG1pblwiLFxuICBzZWxlY3RvcjogZnVuY3Rpb24odXNlcklkKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNTcGFjZUFkbWluKCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpLFxuICAgICAgICAgIHBhaWQ6IHRydWVcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9LFxuICBzaG93RWRpdENvbHVtbjogZmFsc2UsXG4gIHNob3dEZWxDb2x1bW46IGZhbHNlLFxuICBkaXNhYmxlQWRkOiB0cnVlLFxuICBwYWdlTGVuZ3RoOiAxMDAsXG4gIG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cbn07XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB0aGlzLnNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zO1xuICB0aGlzLmJpbGxpbmdfcGF5X3JlY29yZHMgPSBkYi5iaWxsaW5nX3BheV9yZWNvcmRzO1xuICByZXR1cm4gdHlwZW9mIEFkbWluQ29uZmlnICE9PSBcInVuZGVmaW5lZFwiICYmIEFkbWluQ29uZmlnICE9PSBudWxsID8gQWRtaW5Db25maWcuY29sbGVjdGlvbnNfYWRkKHtcbiAgICBzcGFjZV91c2VyX3NpZ25zOiBkYi5zcGFjZV91c2VyX3NpZ25zLmFkbWluQ29uZmlnLFxuICAgIGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWdcbiAgfSkgOiB2b2lkIDA7XG59KTtcbiIsImlmICghW10uaW5jbHVkZXMpIHtcclxuICBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50IC8qLCBmcm9tSW5kZXgqLyApIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG4gICAgdmFyIGxlbiA9IHBhcnNlSW50KE8ubGVuZ3RoKSB8fCAwO1xyXG4gICAgaWYgKGxlbiA9PT0gMCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcclxuICAgIHZhciBrO1xyXG4gICAgaWYgKG4gPj0gMCkge1xyXG4gICAgICBrID0gbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGsgPSBsZW4gKyBuO1xyXG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XHJcbiAgICB9XHJcbiAgICB2YXIgY3VycmVudEVsZW1lbnQ7XHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICBjdXJyZW50RWxlbWVudCA9IE9ba107XHJcbiAgICAgIGlmIChzZWFyY2hFbGVtZW50ID09PSBjdXJyZW50RWxlbWVudCB8fFxyXG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgaysrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH07XHJcbn0iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXHJcblxyXG4gIGlmICFTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzXHJcbiAgICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID1cclxuICAgICAgd3d3OiBcclxuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXHJcbiAgICAgICAgdXJsOiBcIi9cIiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzO1xuICBpZiAoIVN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMpIHtcbiAgICByZXR1cm4gU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIHd3dzoge1xuICAgICAgICBzdGF0dXM6IFwiYWN0aXZlXCIsXG4gICAgICAgIHVybDogXCIvXCJcbiAgICAgIH1cbiAgICB9O1xuICB9XG59KTtcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSAodXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKS0+XHJcblx0bGlzdFZpZXdzID0ge31cclxuXHJcblx0a2V5cyA9IF8ua2V5cyhvYmplY3RzKVxyXG5cclxuXHRvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xyXG5cdFx0b2JqZWN0X25hbWU6IHskaW46IGtleXN9LFxyXG5cdFx0c3BhY2U6IHNwYWNlSWQsXHJcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cclxuXHR9LCB7XHJcblx0XHRmaWVsZHM6IHtcclxuXHRcdFx0Y3JlYXRlZDogMCxcclxuXHRcdFx0bW9kaWZpZWQ6IDAsXHJcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXHJcblx0XHRcdG1vZGlmaWVkX2J5OiAwXHJcblx0XHR9XHJcblx0fSkuZmV0Y2goKVxyXG5cclxuXHRfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IChvYmplY3RfbmFtZSktPlxyXG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxyXG5cdFx0b2xpc3RWaWV3cyA9IF8uZmlsdGVyIG9iamVjdHNWaWV3cywgKG92KS0+XHJcblx0XHRcdHJldHVybiBvdi5vYmplY3RfbmFtZSA9PSBvYmplY3RfbmFtZVxyXG5cclxuXHRcdF8uZWFjaCBvbGlzdFZpZXdzLCAobGlzdHZpZXcpLT5cclxuXHRcdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3XHJcblxyXG5cdFx0cmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzXHJcblxyXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XHJcblx0XHRsaXN0X3ZpZXcgPSBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyhrZXkpXHJcblx0XHRpZiAhXy5pc0VtcHR5KGxpc3RfdmlldylcclxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcclxuXHRyZXR1cm4gbGlzdFZpZXdzXHJcblxyXG5cclxuQ3JlYXRvci5nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpLT5cclxuXHRfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9XHJcblxyXG5cdG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XHJcblx0XHRvYmplY3RfbmFtZTogb2JqZWN0X25hbWUsXHJcblx0XHRzcGFjZTogc3BhY2VJZCxcclxuXHRcdFwiJG9yXCI6IFt7b3duZXI6IHVzZXJJZH0sIHtzaGFyZWQ6IHRydWV9XVxyXG5cdH0sIHtcclxuXHRcdGZpZWxkczoge1xyXG5cdFx0XHRjcmVhdGVkOiAwLFxyXG5cdFx0XHRtb2RpZmllZDogMCxcclxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcclxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcclxuXHRcdH1cclxuXHR9KVxyXG5cclxuXHRvYmplY3RfbGlzdHZpZXcuZm9yRWFjaCAobGlzdHZpZXcpLT5cclxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xyXG5cclxuXHRyZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NcclxuXHJcblxyXG5cclxuXHJcbiIsIkNyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpIHtcbiAgdmFyIF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzLCBrZXlzLCBsaXN0Vmlld3MsIG9iamVjdHNWaWV3cztcbiAgbGlzdFZpZXdzID0ge307XG4gIGtleXMgPSBfLmtleXMob2JqZWN0cyk7XG4gIG9iamVjdHNWaWV3cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IHtcbiAgICAgICRpbjoga2V5c1xuICAgIH0sXG4gICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgXCIkb3JcIjogW1xuICAgICAge1xuICAgICAgICBvd25lcjogdXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIHNoYXJlZDogdHJ1ZVxuICAgICAgfVxuICAgIF1cbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIG1vZGlmaWVkOiAwLFxuICAgICAgY3JlYXRlZF9ieTogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mZXRjaCgpO1xuICBfZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKG9iamVjdF9uYW1lKSB7XG4gICAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvbGlzdFZpZXdzO1xuICAgIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gICAgb2xpc3RWaWV3cyA9IF8uZmlsdGVyKG9iamVjdHNWaWV3cywgZnVuY3Rpb24ob3YpIHtcbiAgICAgIHJldHVybiBvdi5vYmplY3RfbmFtZSA9PT0gb2JqZWN0X25hbWU7XG4gICAgfSk7XG4gICAgXy5lYWNoKG9saXN0Vmlld3MsIGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3NbbGlzdHZpZXcuX2lkXSA9IGxpc3R2aWV3O1xuICAgIH0pO1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbiAgfTtcbiAgXy5mb3JFYWNoKG9iamVjdHMsIGZ1bmN0aW9uKG8sIGtleSkge1xuICAgIHZhciBsaXN0X3ZpZXc7XG4gICAgbGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KTtcbiAgICBpZiAoIV8uaXNFbXB0eShsaXN0X3ZpZXcpKSB7XG4gICAgICByZXR1cm4gbGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXc7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGxpc3RWaWV3cztcbn07XG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9IGZ1bmN0aW9uKHVzZXJJZCwgc3BhY2VJZCwgb2JqZWN0X25hbWUpIHtcbiAgdmFyIF91c2VyX29iamVjdF9saXN0X3ZpZXdzLCBvYmplY3RfbGlzdHZpZXc7XG4gIF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge307XG4gIG9iamVjdF9saXN0dmlldyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9saXN0dmlld3NcIikuZmluZCh7XG4gICAgb2JqZWN0X25hbWU6IG9iamVjdF9uYW1lLFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSk7XG4gIG9iamVjdF9saXN0dmlldy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3R2aWV3KSB7XG4gICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgfSk7XG4gIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3cztcbn07XG4iLCIvLyBTZXJ2ZXJTZXNzaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuLy8gICAndXNlIHN0cmljdCc7XHJcblxyXG4vLyAgIHZhciBDb2xsZWN0aW9uID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ3NlcnZlcl9zZXNzaW9ucycpO1xyXG5cclxuLy8gICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbi8vICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKCdQbGVhc2UgcHJvdmlkZSBhIGtleSEnKTtcclxuLy8gICAgIH1cclxuLy8gICB9O1xyXG4vLyAgIHZhciBnZXRTZXNzaW9uVmFsdWUgPSBmdW5jdGlvbiAob2JqLCBrZXkpIHtcclxuLy8gICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XHJcbi8vICAgfTtcclxuLy8gICB2YXIgY29uZGl0aW9uID0gZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgcmV0dXJuIHRydWU7XHJcbi8vICAgfTtcclxuXHJcbi8vICAgQ29sbGVjdGlvbi5kZW55KHtcclxuLy8gICAgICdpbnNlcnQnOiBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgIHJldHVybiB0cnVlO1xyXG4vLyAgICAgfSxcclxuLy8gICAgICd1cGRhdGUnIDogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICAgIH0sXHJcbi8vICAgICAncmVtb3ZlJzogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gdHJ1ZTtcclxuLy8gICAgIH1cclxuLy8gICB9KTtcclxuXHJcbi8vICAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxyXG4vLyAgIHZhciBhcGkgPSB7XHJcbi8vICAgICAnZ2V0JzogZnVuY3Rpb24gKGtleSkge1xyXG4vLyAgICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XHJcbi8vICAgICAgIHZhciBzZXNzaW9uT2JqID0gQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbi8vICAgICAgIGlmKE1ldGVvci5pc1NlcnZlcil7XHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xyXG4vLyAgICAgICB9XHJcbi8vICAgICAgIC8vIHZhciBzZXNzaW9uT2JqID0gTWV0ZW9yLmlzU2VydmVyID8gXHJcbi8vICAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XHJcbi8vICAgICAgIHJldHVybiBnZXRTZXNzaW9uVmFsdWUoc2Vzc2lvbk9iaiwga2V5KTtcclxuLy8gICAgIH0sXHJcbi8vICAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xyXG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IE1ldGVvci5pc1NlcnZlciA/IFxyXG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9nZXQnKSA6IENvbGxlY3Rpb24uZmluZE9uZSgpO1xyXG5cclxuLy8gICAgICAgdmFyIHZhbHVlID0gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XHJcblxyXG4vLyAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcclxuLy8gICAgICAgICByZXR1cm4gXyh2YWx1ZSkuaXNFcXVhbChleHBlY3RlZCk7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIGlmIChpZGVudGljYWwgPT0gZmFsc2UpIHtcclxuLy8gICAgICAgICByZXR1cm4gZXhwZWN0ZWQgPT0gdmFsdWU7XHJcbi8vICAgICAgIH1cclxuXHJcbi8vICAgICAgIHJldHVybiBleHBlY3RlZCA9PT0gdmFsdWU7XHJcbi8vICAgICB9XHJcbi8vICAgfTtcclxuXHJcbi8vICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcclxuLy8gICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcclxuLy8gICAgICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCl7XHJcbi8vICAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcclxuLy8gICAgICAgICAgIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZlci1zZXNzaW9uJyk7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICB9KVxyXG4vLyAgICAgfVxyXG4vLyAgIH0pXHJcblxyXG4vLyAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcclxuLy8gICAgIC8vIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XHJcbi8vICAgICAvLyAgICAgQ29sbGVjdGlvbi5yZW1vdmUoe30pOyAvLyBjbGVhciBvdXQgYWxsIHN0YWxlIHNlc3Npb25zXHJcbi8vICAgICAvLyAgIH1cclxuLy8gICAgIC8vIH0pO1xyXG5cclxuLy8gICAgIE1ldGVvci5vbkNvbm5lY3Rpb24oZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcclxuLy8gICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcclxuXHJcbi8vICAgICAgIGlmICghQ29sbGVjdGlvbi5maW5kT25lKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSkpIHtcclxuLy8gICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xyXG4vLyAgICAgICB9XHJcblxyXG4vLyAgICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgIENvbGxlY3Rpb24ucmVtb3ZlKHsgJ2NsaWVudElEJzogY2xpZW50SUQgfSk7XHJcbi8vICAgICAgIH0pO1xyXG4vLyAgICAgfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLnB1Ymxpc2goJ3NlcnZlci1zZXNzaW9uJywgZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xyXG4vLyAgICAgfSk7XHJcblxyXG4vLyAgICAgTWV0ZW9yLm1ldGhvZHMoe1xyXG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vZ2V0JzogZnVuY3Rpb24gKCkge1xyXG4vLyAgICAgICAgIHJldHVybiBDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSk7XHJcbi8vICAgICAgIH0sXHJcbi8vICAgICAgICdzZXJ2ZXItc2Vzc2lvbi9zZXQnOiBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4vLyAgICAgICAgIGlmICghdGhpcy5yYW5kb21TZWVkKSByZXR1cm47XHJcblxyXG4vLyAgICAgICAgIGNoZWNrRm9yS2V5KGtleSk7XHJcblxyXG4vLyAgICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxyXG4vLyAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRmFpbGVkIGNvbmRpdGlvbiB2YWxpZGF0aW9uLicpO1xyXG5cclxuLy8gICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XHJcbi8vICAgICAgICAgdXBkYXRlT2JqWyd2YWx1ZXMuJyArIGtleV0gPSB2YWx1ZTtcclxuXHJcbi8vICAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0pOyAgXHJcblxyXG4vLyAgICAgLy8gc2VydmVyLW9ubHkgYXBpXHJcbi8vICAgICBfLmV4dGVuZChhcGksIHtcclxuLy8gICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XHJcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL3NldCcsIGtleSwgdmFsdWUpOyAgICAgICAgICBcclxuLy8gICAgICAgfSxcclxuLy8gICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcclxuLy8gICAgICAgICBjb25kaXRpb24gPSBuZXdDb25kaXRpb247XHJcbi8vICAgICAgIH1cclxuLy8gICAgIH0pO1xyXG4vLyAgIH1cclxuXHJcbi8vICAgcmV0dXJuIGFwaTtcclxuLy8gfSkoKTsiLCJKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXHJcblxyXG5cdFx0c3BhY2VfaWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5xdWVyeT8uc3BhY2VJZFxyXG5cclxuXHRcdHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcylcclxuXHRcdFxyXG5cdFx0aWYgIXVzZXJcclxuXHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0XHRjb2RlOiA0MDEsXHJcblx0XHRcdFx0ZGF0YTpcclxuXHRcdFx0XHRcdFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxyXG5cdFx0XHRcdFx0XCJzdWNjZXNzXCI6IGZhbHNlXHJcblx0XHRcdHJldHVybjtcclxuXHJcblx0XHR1c2VyX2lkID0gdXNlci5faWRcclxuXHJcblx0XHQjIOagoemqjHNwYWNl5piv5ZCm5a2Y5ZyoXHJcblx0XHR1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKVxyXG5cclxuXHRcdGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VyX2lkfSkubG9jYWxlXHJcblx0XHRpZiBsb2NhbGUgPT0gXCJlbi11c1wiXHJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxyXG5cdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxyXG5cdFx0XHRsb2NhbGUgPSBcInpoLUNOXCJcclxuXHJcblx0XHRzcGFjZXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB1c2VyX2lkfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpXHJcblx0XHRhcHBzID0gZGIuYXBwcy5maW5kKHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHskaW46c3BhY2VzfX1dfSx7c29ydDp7c29ydDoxfX0pLmZldGNoKClcclxuXHJcblx0XHRhcHBzLmZvckVhY2ggKGFwcCkgLT5cclxuXHRcdFx0YXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLHt9LGxvY2FsZSlcclxuXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiAyMDBcclxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogMjAwXHJcblx0XHRcdGRhdGE6IHsgZXJyb3JzOiBbe2Vycm9yTWVzc2FnZTogZS5tZXNzYWdlfV19XHJcblx0XHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hcGkvZ2V0L2FwcHMnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXBwcywgZSwgbG9jYWxlLCByZWYsIHJlZjEsIHNwYWNlX2lkLCBzcGFjZXMsIHVzZXIsIHVzZXJfaWQ7XG4gIHRyeSB7XG4gICAgdXNlcl9pZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXSB8fCAoKHJlZiA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZi51c2VySWQgOiB2b2lkIDApO1xuICAgIHNwYWNlX2lkID0gcmVxLmhlYWRlcnNbJ3gtc3BhY2UtaWQnXSB8fCAoKHJlZjEgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYxLnNwYWNlSWQgOiB2b2lkIDApO1xuICAgIHVzZXIgPSBTdGVlZG9zLmdldEFQSUxvZ2luVXNlcihyZXEsIHJlcyk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcl9pZCA9IHVzZXIuX2lkO1xuICAgIHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpO1xuICAgIGxvY2FsZSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VyX2lkXG4gICAgfSkubG9jYWxlO1xuICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgbG9jYWxlID0gXCJlblwiO1xuICAgIH1cbiAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgICB9XG4gICAgc3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICB1c2VyOiB1c2VyX2lkXG4gICAgfSkuZmV0Y2goKS5nZXRQcm9wZXJ0eShcInNwYWNlXCIpO1xuICAgIGFwcHMgPSBkYi5hcHBzLmZpbmQoe1xuICAgICAgJG9yOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzcGFjZToge1xuICAgICAgICAgICAgJGluOiBzcGFjZXNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHNvcnQ6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApIHtcbiAgICAgIHJldHVybiBhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUsIHt9LCBsb2NhbGUpO1xuICAgIH0pO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHN0YXR1czogXCJzdWNjZXNzXCIsXG4gICAgICAgIGRhdGE6IGFwcHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlID0gZXJyb3I7XG4gICAgY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBlcnJvcnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBlcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgdHJ5XHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+eZu+W9lemqjOivgVxyXG4gICAgICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyggcmVxLCByZXMgKTtcclxuXHJcbiAgICAgICAgIyBmaXJzdCBjaGVjayByZXF1ZXN0IGJvZHlcclxuICAgICAgICBpZiByZXEuYm9keVxyXG4gICAgICAgICAgICB1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuICAgICAgICAjIHRoZW4gY2hlY2sgY29va2llXHJcbiAgICAgICAgaWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXHJcbiAgICAgICAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXHJcblxyXG4gICAgICAgIGlmICEodXNlcklkIGFuZCBhdXRoVG9rZW4pXHJcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiA0MDEsXHJcbiAgICAgICAgICAgIGRhdGE6IFxyXG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIiwgXHJcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XHJcbiAgICAgICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcclxuICAgICAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcclxuICAgICAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xyXG4gICAgICAgIGRhdGEgPSBbXTtcclxuICAgICAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddXHJcblxyXG4gICAgICAgIGlmICFzcGFjZVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXHJcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcclxuICAgICAgICBcclxuICAgICAgICBpZiAhc3BhY2VfdXNlclxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFkYlttb2RlbF1cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG5cclxuICAgICAgICBpZiAhb3B0aW9uc1xyXG4gICAgICAgICAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcclxuXHJcbiAgICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xyXG5cclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xyXG4gICAgY2F0Y2ggZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IFtdO1xyXG5cclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuICAgIHRyeVxyXG4gICAgICAgICMgVE9ETyDnlKjmiLfnmbvlvZXpqozor4FcclxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblxyXG4gICAgICAgICMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XHJcbiAgICAgICAgaWYgcmVxLmJvZHlcclxuICAgICAgICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl1cclxuICAgICAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl1cclxuXHJcbiAgICAgICAgIyB0aGVuIGNoZWNrIGNvb2tpZVxyXG4gICAgICAgIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG4gICAgICAgICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG4gICAgICAgICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuICAgICAgICBpZiAhKHVzZXJJZCBhbmQgYXV0aFRva2VuKVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAxLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsIFxyXG4gICAgICAgICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIiwgXHJcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xyXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XHJcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XHJcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcclxuICAgICAgICBkYXRhID0gW107XHJcbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAnbWFpbF9hY2NvdW50cycsICdyb2xlcyddXHJcblxyXG4gICAgICAgIGlmICFzcGFjZVxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgIyBUT0RPIOeUqOaIt+aYr+WQpuWxnuS6jnNwYWNlXHJcbiAgICAgICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJJZCwgc3BhY2U6IHNwYWNlfSlcclxuICAgICAgICBcclxuICAgICAgICBpZiAhc3BhY2VfdXNlclxyXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogNDAzLFxyXG4gICAgICAgICAgICBkYXRhOiBcclxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsIFxyXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFkYlttb2RlbF1cclxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcywgXHJcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcclxuICAgICAgICAgICAgZGF0YTogXHJcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLCBcclxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICFzZWxlY3RvclxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG5cclxuICAgICAgICBpZiAhb3B0aW9uc1xyXG4gICAgICAgICAgICBvcHRpb25zID0ge307XHJcblxyXG4gICAgICAgIGlmIG1vZGVsID09ICdtYWlsX2FjY291bnRzJ1xyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9O1xyXG4gICAgICAgICAgICBzZWxlY3Rvci5vd25lciA9IHVzZXJJZFxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLCBcclxuICAgICAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhO1xyXG4gICAgY2F0Y2ggZVxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsIFxyXG4gICAgICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgICAgIGRhdGE6IHt9IiwidmFyIENvb2tpZXM7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCBzcGFjZV91c2VyLCB1c2VySWQ7XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmJvZHkpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghKHVzZXJJZCAmJiBhdXRoVG9rZW4pKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuXCIsXG4gICAgICAgICAgXCJpbnN0YW5jZVwiOiBcIjEzMjk1OTg4NjFcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG1vZGVsID0gcmVxLmJvZHkubW9kZWw7XG4gICAgc2VsZWN0b3IgPSByZXEuYm9keS5zZWxlY3RvcjtcbiAgICBvcHRpb25zID0gcmVxLmJvZHkub3B0aW9ucztcbiAgICBzcGFjZSA9IHJlcS5ib2R5LnNwYWNlO1xuICAgIGRhdGEgPSBbXTtcbiAgICBhbGxvd19tb2RlbHMgPSBbJ3NwYWNlX3VzZXJzJywgJ29yZ2FuaXphdGlvbnMnLCAnZmxvd19yb2xlcycsICdyb2xlcyddO1xuICAgIGlmICghc3BhY2UpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgIHNwYWNlOiBzcGFjZVxuICAgIH0pO1xuICAgIGlmICghc3BhY2VfdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBzcGFjZSBcIiArIHNwYWNlLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFhbGxvd19tb2RlbHMuaW5jbHVkZXMobW9kZWwpKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIWRiW21vZGVsXSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2U7XG4gICAgZGF0YSA9IGRiW21vZGVsXS5maW5kKHNlbGVjdG9yLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IFtdXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZG9uZVwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHNwYWNlX3VzZXIsIHVzZXJJZDtcbiAgdHJ5IHtcbiAgICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICAgIGlmIChyZXEuYm9keSkge1xuICAgICAgdXNlcklkID0gcmVxLmJvZHlbXCJYLVVzZXItSWRcIl07XG4gICAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgICB9XG4gICAgaWYgKCF1c2VySWQgfHwgIWF1dGhUb2tlbikge1xuICAgICAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gICAgICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICB9XG4gICAgaWYgKCEodXNlcklkICYmIGF1dGhUb2tlbikpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnLCAncm9sZXMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzcGFjZV91c2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VySWQsXG4gICAgICBzcGFjZTogc3BhY2VcbiAgICB9KTtcbiAgICBpZiAoIXNwYWNlX3VzZXIpIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAobW9kZWwgPT09ICdtYWlsX2FjY291bnRzJykge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcclxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpXHJcbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKVxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcblx0YXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKVxyXG5cdGlmIGFwcFxyXG5cdFx0c2VjcmV0ID0gYXBwLnNlY3JldFxyXG5cdFx0cmVkaXJlY3RVcmwgPSBhcHAudXJsXHJcblx0ZWxzZVxyXG5cdFx0c2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybFxyXG5cclxuXHRpZiAhcmVkaXJlY3RVcmxcclxuXHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRyZXMuZW5kKClcclxuXHRcdHJldHVyblxyXG5cclxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblxyXG5cdCMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XHJcblx0IyBpZiByZXEuYm9keVxyXG5cdCMgXHR1c2VySWQgPSByZXEuYm9keVtcIlgtVXNlci1JZFwiXVxyXG5cdCMgXHRhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHQjICMgdGhlbiBjaGVjayBjb29raWVcclxuXHQjIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxyXG5cdCMgXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxyXG5cdCMgXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRpZiAhdXNlcklkIGFuZCAhYXV0aFRva2VuXHJcblx0XHR1c2VySWQgPSByZXEucXVlcnlbXCJYLVVzZXItSWRcIl1cclxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxyXG5cclxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cdFx0aWYgdXNlclxyXG5cdFx0XHRzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkXHJcblx0XHRcdGlmIGFwcC5zZWNyZXRcclxuXHRcdFx0XHRpdiA9IGFwcC5zZWNyZXRcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcclxuXHRcdFx0bm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkvMTAwMCkudG9TdHJpbmcoKVxyXG5cdFx0XHRrZXkzMiA9IFwiXCJcclxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcclxuXHRcdFx0aWYgbGVuIDwgMzJcclxuXHRcdFx0XHRjID0gXCJcIlxyXG5cdFx0XHRcdGkgPSAwXHJcblx0XHRcdFx0bSA9IDMyIC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZCArIGNcclxuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcclxuXHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwzMilcclxuXHJcblx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxyXG5cclxuXHRcdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKVxyXG5cclxuXHRcdFx0c3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxyXG5cclxuXHRcdFx0IyBkZXMtY2JjXHJcblx0XHRcdGRlc19pdiA9IFwiLTg3NjItZmNcIlxyXG5cdFx0XHRrZXk4ID0gXCJcIlxyXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxyXG5cdFx0XHRpZiBsZW4gPCA4XHJcblx0XHRcdFx0YyA9IFwiXCJcclxuXHRcdFx0XHRpID0gMFxyXG5cdFx0XHRcdG0gPSA4IC0gbGVuXHJcblx0XHRcdFx0d2hpbGUgaSA8IG1cclxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcclxuXHRcdFx0XHRcdGkrK1xyXG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkICsgY1xyXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSA4XHJcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQuc2xpY2UoMCw4KVxyXG5cdFx0XHRkZXNfY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdkZXMtY2JjJywgbmV3IEJ1ZmZlcihrZXk4LCAndXRmOCcpLCBuZXcgQnVmZmVyKGRlc19pdiwgJ3V0ZjgnKSlcclxuXHRcdFx0ZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKVxyXG5cdFx0XHRkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcclxuXHJcblx0XHRcdGpvaW5lciA9IFwiP1wiXHJcblxyXG5cdFx0XHRpZiByZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xXHJcblx0XHRcdFx0am9pbmVyID0gXCImXCJcclxuXHJcblx0XHRcdHJldHVybnVybCA9IHJlZGlyZWN0VXJsICsgam9pbmVyICsgXCJYLVVzZXItSWQ9XCIgKyB1c2VySWQgKyBcIiZYLUF1dGgtVG9rZW49XCIgKyBhdXRoVG9rZW4gKyBcIiZYLVNURUVET1MtV0VCLUlEPVwiICsgc3RlZWRvc19pZCArIFwiJlgtU1RFRURPUy1BVVRIVE9LRU49XCIgKyBzdGVlZG9zX3Rva2VuICsgXCImU1RFRURPUy1BVVRIVE9LRU49XCIgKyBkZXNfc3RlZWRvc190b2tlblxyXG5cclxuXHRcdFx0aWYgdXNlci51c2VybmFtZVxyXG5cdFx0XHRcdHJldHVybnVybCArPSBcIiZYLVNURUVET1MtVVNFUk5BTUU9I3tlbmNvZGVVUkkodXNlci51c2VybmFtZSl9XCJcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHJldHVybnVybFxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0cmVzLmVuZCgpXHJcblx0cmV0dXJuXHJcbiIsInZhciBDb29raWVzLCBjcnlwdG8sIGV4cHJlc3M7XG5cbmNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuXG5Db29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG5cbmV4cHJlc3MgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvYXBpL3NldHVwL3Nzby86YXBwX2lkXCIsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhcHAsIGF1dGhUb2tlbiwgYywgY2lwaGVyLCBjaXBoZXJlZE1zZywgY29va2llcywgZGVzX2NpcGhlciwgZGVzX2NpcGhlcmVkTXNnLCBkZXNfaXYsIGRlc19zdGVlZG9zX3Rva2VuLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGpvaW5lciwga2V5MzIsIGtleTgsIGxlbiwgbSwgbm93LCByZWRpcmVjdFVybCwgcmV0dXJudXJsLCBzZWNyZXQsIHN0ZWVkb3NfaWQsIHN0ZWVkb3NfdG9rZW4sIHVzZXIsIHVzZXJJZDtcbiAgYXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKTtcbiAgaWYgKGFwcCkge1xuICAgIHNlY3JldCA9IGFwcC5zZWNyZXQ7XG4gICAgcmVkaXJlY3RVcmwgPSBhcHAudXJsO1xuICB9IGVsc2Uge1xuICAgIHNlY3JldCA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgIHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybDtcbiAgfVxuICBpZiAoIXJlZGlyZWN0VXJsKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgaWYgKCF1c2VySWQgJiYgIWF1dGhUb2tlbikge1xuICAgIHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXTtcbiAgICBhdXRoVG9rZW4gPSByZXEucXVlcnlbXCJYLUF1dGgtVG9rZW5cIl07XG4gIH1cbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWQ7XG4gICAgICBpZiAoYXBwLnNlY3JldCkge1xuICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdiA9IFwiLTg3NjItZmNiMzY5YjJlOFwiO1xuICAgICAgfVxuICAgICAgbm93ID0gcGFyc2VJbnQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKS50b1N0cmluZygpO1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgMzIpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gMzIgLSBsZW47XG4gICAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSAzMikge1xuICAgICAgICBrZXkzMiA9IHN0ZWVkb3NfaWQuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgICAgY2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBkZXNfaXYgPSBcIi04NzYyLWZjXCI7XG4gICAgICBrZXk4ID0gXCJcIjtcbiAgICAgIGxlbiA9IHN0ZWVkb3NfaWQubGVuZ3RoO1xuICAgICAgaWYgKGxlbiA8IDgpIHtcbiAgICAgICAgYyA9IFwiXCI7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBtID0gOCAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5OCA9IHN0ZWVkb3NfaWQgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gOCkge1xuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZC5zbGljZSgwLCA4KTtcbiAgICAgIH1cbiAgICAgIGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKTtcbiAgICAgIGRlc19jaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2Rlc19jaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIobm93LCAndXRmOCcpKSwgZGVzX2NpcGhlci5maW5hbCgpXSk7XG4gICAgICBkZXNfc3RlZWRvc190b2tlbiA9IGRlc19jaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICBqb2luZXIgPSBcIj9cIjtcbiAgICAgIGlmIChyZWRpcmVjdFVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICAgIGpvaW5lciA9IFwiJlwiO1xuICAgICAgfVxuICAgICAgcmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuO1xuICAgICAgaWYgKHVzZXIudXNlcm5hbWUpIHtcbiAgICAgICAgcmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT1cIiArIChlbmNvZGVVUkkodXNlci51c2VybmFtZSkpO1xuICAgICAgfVxuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHJldHVybnVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgcmVzLmVuZCgpO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdFxyXG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdFx0IyB0aGlzLnBhcmFtcyA9XHJcblx0XHQjIFx0dXNlcklkOiBkZWNvZGVVUkkocmVxLnVybCkucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcclxuXHRcdHdpZHRoID0gNTAgO1xyXG5cdFx0aGVpZ2h0ID0gNTAgO1xyXG5cdFx0Zm9udFNpemUgPSAyOCA7XHJcblx0XHRpZiByZXEucXVlcnkud1xyXG5cdFx0ICAgIHdpZHRoID0gcmVxLnF1ZXJ5LncgO1xyXG5cdFx0aWYgcmVxLnF1ZXJ5LmhcclxuXHRcdCAgICBoZWlnaHQgPSByZXEucXVlcnkuaCA7XHJcblx0XHRpZiByZXEucXVlcnkuZnNcclxuICAgICAgICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnMgO1xyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHJlcS5wYXJhbXMudXNlcklkKTtcclxuXHRcdGlmICF1c2VyXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgNDAxXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLmF2YXRhclxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiB1c2VyLnByb2ZpbGU/LmF2YXRhclxyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhclxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0aWYgdXNlci5hdmF0YXJVcmxcclxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsXHJcblx0XHRcdHJlcy53cml0ZUhlYWQgMzAyXHJcblx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRpZiBub3QgZmlsZT9cclxuXHRcdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcclxuXHRcdFx0c3ZnID0gXCJcIlwiXHJcblx0XHRcdFx0PHN2ZyB2ZXJzaW9uPVwiMS4xXCIgaWQ9XCJMYXllcl8xXCIgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHg9XCIwcHhcIiB5PVwiMHB4XCJcclxuXHRcdFx0XHRcdCB2aWV3Qm94PVwiMCAwIDcyIDcyXCIgc3R5bGU9XCJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDcyIDcyO1wiIHhtbDpzcGFjZT1cInByZXNlcnZlXCI+XHJcblx0XHRcdFx0PHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxyXG5cdFx0XHRcdFx0LnN0MHtmaWxsOiNGRkZGRkY7fVxyXG5cdFx0XHRcdFx0LnN0MXtmaWxsOiNEMEQwRDA7fVxyXG5cdFx0XHRcdDwvc3R5bGU+XHJcblx0XHRcdFx0PGc+XHJcblx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MFwiIGQ9XCJNMzYsNzEuMWMtMTkuMywwLTM1LTE1LjctMzUtMzVzMTUuNy0zNSwzNS0zNXMzNSwxNS43LDM1LDM1UzU1LjMsNzEuMSwzNiw3MS4xelwiLz5cclxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcclxuXHRcdFx0XHRcdFx0czE2LjEsMzYsMzYsMzZzMzYtMTYuMSwzNi0zNlM1NS45LDAuMSwzNiwwLjFMMzYsMC4xelwiLz5cclxuXHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PGc+XHJcblx0XHRcdFx0XHQ8Zz5cclxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcclxuXHRcdFx0XHRcdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XCIvPlxyXG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzYuMiw3MC43YzguNywwLDE2LjctMy4xLDIyLjktOC4yYy0zLjYtOS42LTEyLjctMTUuNS0yMy4zLTE1LjVjLTEwLjQsMC0xOS40LDUuNy0yMy4xLDE1XHJcblx0XHRcdFx0XHRcdFx0QzE5LDY3LjQsMjcuMiw3MC43LDM2LjIsNzAuN3pcIi8+XHJcblx0XHRcdFx0XHQ8L2c+XHJcblx0XHRcdFx0PC9nPlxyXG5cdFx0XHRcdDwvc3ZnPlxyXG5cdFx0XHRcIlwiXCJcclxuXHRcdFx0cmVzLndyaXRlIHN2Z1xyXG4jXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCIvcGFja2FnZXMvc3RlZWRvc19iYXNlL2NsaWVudC9pbWFnZXMvZGVmYXVsdC1hdmF0YXIucG5nXCIpXHJcbiNcdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0dXNlcm5hbWUgPSB1c2VyLm5hbWU7XHJcblx0XHRpZiAhdXNlcm5hbWVcclxuXHRcdFx0dXNlcm5hbWUgPSBcIlwiXHJcblxyXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXHJcblxyXG5cdFx0aWYgbm90IGZpbGU/XHJcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xyXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCdcclxuXHJcblx0XHRcdGNvbG9ycyA9IFsnI0Y0NDMzNicsJyNFOTFFNjMnLCcjOUMyN0IwJywnIzY3M0FCNycsJyMzRjUxQjUnLCcjMjE5NkYzJywnIzAzQTlGNCcsJyMwMEJDRDQnLCcjMDA5Njg4JywnIzRDQUY1MCcsJyM4QkMzNEEnLCcjQ0REQzM5JywnI0ZGQzEwNycsJyNGRjk4MDAnLCcjRkY1NzIyJywnIzc5NTU0OCcsJyM5RTlFOUUnLCcjNjA3RDhCJ11cclxuXHJcblx0XHRcdHVzZXJuYW1lX2FycmF5ID0gQXJyYXkuZnJvbSh1c2VybmFtZSlcclxuXHRcdFx0Y29sb3JfaW5kZXggPSAwXHJcblx0XHRcdF8uZWFjaCB1c2VybmFtZV9hcnJheSwgKGl0ZW0pIC0+XHJcblx0XHRcdFx0Y29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xyXG5cclxuXHRcdFx0cG9zaXRpb24gPSBjb2xvcl9pbmRleCAlIGNvbG9ycy5sZW5ndGhcclxuXHRcdFx0Y29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXHJcblx0XHRcdCNjb2xvciA9IFwiI0Q2REFEQ1wiXHJcblxyXG5cdFx0XHRpbml0aWFscyA9ICcnXHJcblx0XHRcdGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XHJcblx0XHRcdFx0aW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpXHJcblxyXG5cdFx0XHRpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcclxuXHJcblx0XHRcdHN2ZyA9IFwiXCJcIlxyXG5cdFx0XHQ8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cclxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgd2lkdGg9XCIje3dpZHRofVwiIGhlaWdodD1cIiN7aGVpZ2h0fVwiIHN0eWxlPVwid2lkdGg6ICN7d2lkdGh9cHg7IGhlaWdodDogI3toZWlnaHR9cHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxyXG5cdFx0XHRcdDx0ZXh0IHRleHQtYW5jaG9yPVwibWlkZGxlXCIgeT1cIjUwJVwiIHg9XCI1MCVcIiBkeT1cIjAuMzZlbVwiIHBvaW50ZXItZXZlbnRzPVwiYXV0b1wiIGZpbGw9XCIjRkZGRkZGXCIgZm9udC1mYW1pbHk9XCItYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsIEhlbHZldGljYSwgQXJpYWwsIE1pY3Jvc29mdCBZYWhlaSwgU2ltSGVpXCIgc3R5bGU9XCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6ICN7Zm9udFNpemV9cHg7XCI+XHJcblx0XHRcdFx0XHQje2luaXRpYWxzfVxyXG5cdFx0XHRcdDwvdGV4dD5cclxuXHRcdFx0PC9zdmc+XHJcblx0XHRcdFwiXCJcIlxyXG5cclxuXHRcdFx0cmVzLndyaXRlIHN2Z1xyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0cmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xyXG5cdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXI/XHJcblx0XHRcdGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHVzZXIubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcclxuXHRcdFx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcclxuXHRcdFx0XHRyZXMud3JpdGVIZWFkIDMwNFxyXG5cdFx0XHRcdHJlcy5lbmQoKVxyXG5cdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxyXG5cdFx0cmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXHJcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXHJcblxyXG5cdFx0ZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXHJcblx0XHRyZXR1cm4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9yX2luZGV4LCBjb2xvcnMsIGZvbnRTaXplLCBoZWlnaHQsIGluaXRpYWxzLCBwb3NpdGlvbiwgcmVmLCByZWYxLCByZWYyLCByZXFNb2RpZmllZEhlYWRlciwgc3ZnLCB1c2VyLCB1c2VybmFtZSwgdXNlcm5hbWVfYXJyYXksIHdpZHRoO1xuICAgIHdpZHRoID0gNTA7XG4gICAgaGVpZ2h0ID0gNTA7XG4gICAgZm9udFNpemUgPSAyODtcbiAgICBpZiAocmVxLnF1ZXJ5LncpIHtcbiAgICAgIHdpZHRoID0gcmVxLnF1ZXJ5Lnc7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuaCkge1xuICAgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5Lmg7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuZnMpIHtcbiAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzO1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIFN0ZWVkb3MuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKSk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgocmVmID0gdXNlci5wcm9maWxlKSAhPSBudWxsID8gcmVmLmF2YXRhciA6IHZvaWQgMCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXIpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXJVcmwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBzdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiBpZD1cXFwiTGF5ZXJfMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeD1cXFwiMHB4XFxcIiB5PVxcXCIwcHhcXFwiXFxuXHQgdmlld0JveD1cXFwiMCAwIDcyIDcyXFxcIiBzdHlsZT1cXFwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiPlxcbjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XFxuXHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XFxuPC9zdHlsZT5cXG48Zz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDBcXFwiIGQ9XFxcIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XFxcIi8+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XFxuXHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcXFwiLz5cXG48L2c+XFxuPGc+XFxuXHQ8Zz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcXG5cdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XFxcIi8+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcXG5cdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elxcXCIvPlxcblx0PC9nPlxcbjwvZz5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHVzZXIubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgdXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKTtcbiAgICAgIGNvbG9yX2luZGV4ID0gMDtcbiAgICAgIF8uZWFjaCh1c2VybmFtZV9hcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gY29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuICAgICAgfSk7XG4gICAgICBwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCJcIiArIHdpZHRoICsgXCJcXFwiIGhlaWdodD1cXFwiXCIgKyBoZWlnaHQgKyBcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweDsgaGVpZ2h0OiBcIiArIGhlaWdodCArIFwicHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcblx0PHRleHQgdGV4dC1hbmNob3I9XFxcIm1pZGRsZVxcXCIgeT1cXFwiNTAlXFxcIiB4PVxcXCI1MCVcXFwiIGR5PVxcXCIwLjM2ZW1cXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJhdXRvXFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmb250LWZhbWlseT1cXFwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVxcXCIgc3R5bGU9XFxcImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogXCIgKyBmb250U2l6ZSArIFwicHg7XFxcIj5cXG5cdFx0XCIgKyBpbml0aWFscyArIFwiXFxuXHQ8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmMSA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCAoKHJlZjIgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSB8fCBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJyk7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aCk7XG4gICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUocmVzKTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XHJcblx0SnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHJcblx0XHRhY2Nlc3NfdG9rZW4gPSByZXEucXVlcnk/LmFjY2Vzc190b2tlblxyXG5cclxuXHRcdGlmIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuKGFjY2Vzc190b2tlbilcclxuXHRcdFx0cmVzLndyaXRlSGVhZCAyMDBcclxuXHRcdFx0cmVzLmVuZCgpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdFx0XHRyZXMuZW5kKClcclxuXHRcdFx0cmV0dXJuXHJcblxyXG5cclxuXHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBhY2Nlc3NfdG9rZW4sIHJlZjtcbiAgICBhY2Nlc3NfdG9rZW4gPSAocmVmID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmLmFjY2Vzc190b2tlbiA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKSkge1xuICAgICAgcmVzLndyaXRlSGVhZCgyMDApO1xuICAgICAgcmVzLmVuZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICBNZXRlb3IucHVibGlzaCAnYXBwcycsIChzcGFjZUlkKS0+XHJcbiAgICAgICAgdW5sZXNzIHRoaXMudXNlcklkXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWR5KClcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgc2VsZWN0b3IgPSB7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19XHJcbiAgICAgICAgaWYgc3BhY2VJZFxyXG4gICAgICAgICAgICBzZWxlY3RvciA9IHskb3I6IFt7c3BhY2U6IHskZXhpc3RzOiBmYWxzZX19LCB7c3BhY2U6IHNwYWNlSWR9XX1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7c29ydDoge3NvcnQ6IDF9fSk7XHJcbiIsImlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgTWV0ZW9yLnB1Ymxpc2goJ2FwcHMnLCBmdW5jdGlvbihzcGFjZUlkKSB7XG4gICAgdmFyIHNlbGVjdG9yO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gICAgfVxuICAgIHNlbGVjdG9yID0ge1xuICAgICAgc3BhY2U6IHtcbiAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgIH1cbiAgICB9O1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgJG9yOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBzcGFjZTogc3BhY2VJZFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLmFwcHMuZmluZChzZWxlY3Rvciwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiXHJcblxyXG5cdCMgcHVibGlzaCB1c2VycyBzcGFjZXNcclxuXHQjIHdlIG9ubHkgcHVibGlzaCBzcGFjZXMgY3VycmVudCB1c2VyIGpvaW5lZC5cclxuXHRNZXRlb3IucHVibGlzaCAnbXlfc3BhY2VzJywgLT5cclxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxyXG5cdFx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cclxuXHRcdHNlbGYgPSB0aGlzO1xyXG5cdFx0dXNlclNwYWNlcyA9IFtdXHJcblx0XHRzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0sIHtmaWVsZHM6IHtzcGFjZToxfX0pXHJcblx0XHRzdXMuZm9yRWFjaCAoc3UpIC0+XHJcblx0XHRcdHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSlcclxuXHJcblx0XHRoYW5kbGUyID0gbnVsbFxyXG5cclxuXHRcdCMgb25seSByZXR1cm4gdXNlciBqb2luZWQgc3BhY2VzLCBhbmQgb2JzZXJ2ZXMgd2hlbiB1c2VyIGpvaW4gb3IgbGVhdmUgYSBzcGFjZVxyXG5cdFx0aGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdGhpcy51c2VySWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5vYnNlcnZlXHJcblx0XHRcdGFkZGVkOiAoZG9jKSAtPlxyXG5cdFx0XHRcdGlmIGRvYy5zcGFjZVxyXG5cdFx0XHRcdFx0aWYgdXNlclNwYWNlcy5pbmRleE9mKGRvYy5zcGFjZSkgPCAwXHJcblx0XHRcdFx0XHRcdHVzZXJTcGFjZXMucHVzaChkb2Muc3BhY2UpXHJcblx0XHRcdFx0XHRcdG9ic2VydmVTcGFjZXMoKVxyXG5cdFx0XHRyZW1vdmVkOiAob2xkRG9jKSAtPlxyXG5cdFx0XHRcdGlmIG9sZERvYy5zcGFjZVxyXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZVxyXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2Muc3BhY2UpXHJcblxyXG5cdFx0b2JzZXJ2ZVNwYWNlcyA9IC0+XHJcblx0XHRcdGlmIGhhbmRsZTJcclxuXHRcdFx0XHRoYW5kbGUyLnN0b3AoKTtcclxuXHRcdFx0aGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJTcGFjZXN9fSkub2JzZXJ2ZVxyXG5cdFx0XHRcdGFkZGVkOiAoZG9jKSAtPlxyXG5cdFx0XHRcdFx0c2VsZi5hZGRlZCBcInNwYWNlc1wiLCBkb2MuX2lkLCBkb2M7XHJcblx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLl9pZClcclxuXHRcdFx0XHRjaGFuZ2VkOiAobmV3RG9jLCBvbGREb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLmNoYW5nZWQgXCJzcGFjZXNcIiwgbmV3RG9jLl9pZCwgbmV3RG9jO1xyXG5cdFx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XHJcblx0XHRcdFx0XHRzZWxmLnJlbW92ZWQgXCJzcGFjZXNcIiwgb2xkRG9jLl9pZFxyXG5cdFx0XHRcdFx0dXNlclNwYWNlcyA9IF8ud2l0aG91dCh1c2VyU3BhY2VzLCBvbGREb2MuX2lkKVxyXG5cclxuXHRcdG9ic2VydmVTcGFjZXMoKTtcclxuXHJcblx0XHRzZWxmLnJlYWR5KCk7XHJcblxyXG5cdFx0c2VsZi5vblN0b3AgLT5cclxuXHRcdFx0aGFuZGxlLnN0b3AoKTtcclxuXHRcdFx0aWYgaGFuZGxlMlxyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xyXG4iLCJNZXRlb3IucHVibGlzaCgnbXlfc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGUsIGhhbmRsZTIsIG9ic2VydmVTcGFjZXMsIHNlbGYsIHN1cywgdXNlclNwYWNlcztcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIHVzZXJTcGFjZXMgPSBbXTtcbiAgc3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBzcGFjZTogMVxuICAgIH1cbiAgfSk7XG4gIHN1cy5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSk7XG4gIH0pO1xuICBoYW5kbGUyID0gbnVsbDtcbiAgaGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICBpZiAoZG9jLnNwYWNlKSB7XG4gICAgICAgIGlmICh1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDApIHtcbiAgICAgICAgICB1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKTtcbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgIGlmIChvbGREb2Muc3BhY2UpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZSk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgb2JzZXJ2ZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiB1c2VyU3BhY2VzXG4gICAgICB9XG4gICAgfSkub2JzZXJ2ZSh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgIHNlbGYuYWRkZWQoXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2MsIG9sZERvYykge1xuICAgICAgICByZXR1cm4gc2VsZi5jaGFuZ2VkKFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2MuX2lkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG9ic2VydmVTcGFjZXMoKTtcbiAgc2VsZi5yZWFkeSgpO1xuICByZXR1cm4gc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgcmV0dXJuIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIiMgcHVibGlzaCBzb21lIG9uZSBzcGFjZSdzIGF2YXRhclxyXG5NZXRlb3IucHVibGlzaCAnc3BhY2VfYXZhdGFyJywgKHNwYWNlSWQpLT5cclxuXHR1bmxlc3Mgc3BhY2VJZFxyXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxyXG5cclxuXHRyZXR1cm4gZGIuc3BhY2VzLmZpbmQoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHthdmF0YXI6IDEsbmFtZTogMSxlbmFibGVfcmVnaXN0ZXI6MX19KTtcclxuIiwiTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX2F2YXRhcicsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgaWYgKCFzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuc3BhY2VzLmZpbmQoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhdmF0YXI6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZW5hYmxlX3JlZ2lzdGVyOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ21vZHVsZXMnLCAoKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHJldHVybiBkYi5tb2R1bGVzLmZpbmQoKTsiLCJNZXRlb3IucHVibGlzaCgnbW9kdWxlcycsIGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7XG59KTtcbiIsIk1ldGVvci5wdWJsaXNoICdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCAoX2lkKS0+XHJcblx0dW5sZXNzIHRoaXMudXNlcklkXHJcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXHJcblxyXG5cdHVubGVzcyBfaWRcclxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcclxuXHJcblx0cmV0dXJuIGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuZmluZCh7X2lkOiBfaWR9KTsiLCJNZXRlb3IucHVibGlzaCgnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgZnVuY3Rpb24oX2lkKSB7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghX2lkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtcbiAgICBfaWQ6IF9pZFxuICB9KTtcbn0pO1xuIiwic3RlZWRvc0F1dGggPSByZXF1aXJlKFwiQHN0ZWVkb3MvYXV0aFwiKTtcclxuc3RlZWRvc0kxOG4gPSByZXF1aXJlKFwiQHN0ZWVkb3MvaTE4blwiKTtcclxuc3RlZWRvc0NvcmUgPSByZXF1aXJlKFwiQHN0ZWVkb3MvY29yZVwiKTtcclxuY2xvbmUgPSByZXF1aXJlKFwiY2xvbmVcIik7XHJcblxyXG5fZ2V0TG9jYWxlID0gKHVzZXIpLT5cclxuXHRpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ3poLWNuJ1xyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0ZWxzZSBpZiB1c2VyPy5sb2NhbGU/LnRvTG9jYWxlTG93ZXJDYXNlKCkgPT0gJ2VuLXVzJ1xyXG5cdFx0bG9jYWxlID0gXCJlblwiXHJcblx0ZWxzZVxyXG5cdFx0bG9jYWxlID0gXCJ6aC1DTlwiXHJcblx0cmV0dXJuIGxvY2FsZVxyXG5cclxuZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0ID0gKHVzZXJJZCwgc3BhY2VJZCktPlxyXG5cdHNwYWNlVXNlciA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcInNwYWNlX3VzZXJzXCIpLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7cHJvZmlsZTogMX19KVxyXG5cdGlmIHNwYWNlVXNlciAmJiBzcGFjZVVzZXIucHJvZmlsZVxyXG5cdFx0cmV0dXJuIENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpPy5maW5kKHtzcGFjZTogc3BhY2VJZCwgcHJvZmlsZXM6IHNwYWNlVXNlci5wcm9maWxlfSkuZmV0Y2goKTtcclxuXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9hcGkvYm9vdHN0cmFwLzpzcGFjZUlkL1wiLChyZXEsIHJlcywgbmV4dCktPlxyXG5cdHVzZXJJZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXVxyXG5cdHNwYWNlSWQgPSByZXEuaGVhZGVyc1sneC1zcGFjZS1pZCddIHx8IHJlcS5wYXJhbXM/LnNwYWNlSWRcclxuXHRpZiAhdXNlcklkXHJcblx0XHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0XHRjb2RlOiA0MDMsXHJcblx0XHRcdGRhdGE6IG51bGxcclxuXHRcdHJldHVyblxyXG5cclxuXHRhdXRoVG9rZW4gPSBTdGVlZG9zLmdldEF1dGhUb2tlbihyZXEsIHJlcylcclxuXHR1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpLT5cclxuXHRcdFx0c3RlZWRvc0F1dGguZ2V0U2Vzc2lvbihhdXRoVG9rZW4sIHNwYWNlSWQpLnRoZW4gKHJlc29sdmUsIHJlamVjdCktPlxyXG5cdFx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHRcdCkoYXV0aFRva2VuLCBzcGFjZUlkKVxyXG5cdFxyXG5cdHVubGVzcyB1c2VyU2Vzc2lvblxyXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcclxuXHRcdFx0Y29kZTogNTAwLFxyXG5cdFx0XHRkYXRhOiBudWxsXHJcblx0XHRyZXR1cm5cclxuXHJcblx0c3BhY2UgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VzXCJdLmZpbmRPbmUoe19pZDogc3BhY2VJZH0sIHtmaWVsZHM6IHtuYW1lOiAxfX0pXHJcblxyXG5cdHJlc3VsdCA9IENyZWF0b3IuZ2V0QWxsUGVybWlzc2lvbnMoc3BhY2VJZCwgdXNlcklkKTtcclxuI1x0Y29uc29sZS50aW1lKCd0cmFuc2xhdGlvbk9iamVjdHMnKTtcclxuXHRsbmcgPSBfZ2V0TG9jYWxlKGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7bG9jYWxlOiAxfX0pKVxyXG5cdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uT2JqZWN0cyhsbmcsIHJlc3VsdC5vYmplY3RzKTtcclxuI1x0Y29uc29sZS50aW1lRW5kKCd0cmFuc2xhdGlvbk9iamVjdHMnKTtcclxuXHRyZXN1bHQudXNlciA9IHVzZXJTZXNzaW9uXHJcblx0cmVzdWx0LnNwYWNlID0gc3BhY2VcclxuXHRyZXN1bHQuYXBwcyA9IGNsb25lKENyZWF0b3IuQXBwcylcclxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IGNsb25lKENyZWF0b3IuRGFzaGJvYXJkcylcclxuXHRyZXN1bHQub2JqZWN0X2xpc3R2aWV3cyA9IENyZWF0b3IuZ2V0VXNlck9iamVjdHNMaXN0Vmlld3ModXNlcklkLCBzcGFjZUlkLCByZXN1bHQub2JqZWN0cylcclxuXHRyZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsICdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZFxyXG5cclxuXHRwZXJtaXNzaW9ucyA9IE1ldGVvci53cmFwQXN5bmMgKHYsIHVzZXJTZXNzaW9uLCBjYiktPlxyXG5cdFx0di5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbiAocmVzb2x2ZSwgcmVqZWN0KS0+XHJcblx0XHRcdGNiKHJlamVjdCwgcmVzb2x2ZSlcclxuXHJcblx0Xy5lYWNoIENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCAoZGF0YXNvdXJjZSwgbmFtZSkgLT5cclxuXHRcdGlmIG5hbWUgIT0gJ2RlZmF1bHQnXHJcblx0XHRcdGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKClcclxuXHRcdFx0Xy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCAodiwgayktPlxyXG5cdFx0XHRcdF9vYmogPSBDcmVhdG9yLmNvbnZlcnRPYmplY3QoY2xvbmUodi50b0NvbmZpZygpKSwgc3BhY2VJZClcclxuI1x0XHRcdFx0X29iai5uYW1lID0gXCIje25hbWV9LiN7a31cIlxyXG5cdFx0XHRcdF9vYmoubmFtZSA9IGtcclxuXHRcdFx0XHRfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lXHJcblx0XHRcdFx0X29iai5wZXJtaXNzaW9ucyA9IHBlcm1pc3Npb25zKHYsIHVzZXJTZXNzaW9uKVxyXG5cdFx0XHRcdHJlc3VsdC5vYmplY3RzW19vYmoubmFtZV0gPSBfb2JqXHJcblx0XHRcdClcclxuXHRfLmVhY2ggQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIChkYXRhc291cmNlLCBuYW1lKSAtPlxyXG5cdFx0cmVzdWx0LmFwcHMgPSBfLmV4dGVuZCByZXN1bHQuYXBwcywgY2xvbmUoZGF0YXNvdXJjZS5nZXRBcHBzQ29uZmlnKCkpXHJcblx0XHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kIHJlc3VsdC5kYXNoYm9hcmRzLCBkYXRhc291cmNlLmdldERhc2hib2FyZHNDb25maWcoKVxyXG5cdHJlc3VsdC5hcHBzID0gXy5leHRlbmQoIHJlc3VsdC5hcHBzIHx8IHt9LCBDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSlcclxuXHRyZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kKCByZXN1bHQuZGFzaGJvYXJkcyB8fCB7fSwgQ3JlYXRvci5nZXREQkRhc2hib2FyZHMoc3BhY2VJZCkpXHJcblxyXG5cdF9BcHBzID0ge31cclxuXHRfLmVhY2ggcmVzdWx0LmFwcHMsIChhcHAsIGtleSkgLT5cclxuXHRcdGlmICFhcHAuX2lkXHJcblx0XHRcdGFwcC5faWQgPSBrZXlcclxuXHRcdGlmIGFwcC5jb2RlXHJcblx0XHRcdGFwcC5fZGJpZCA9IGFwcC5faWRcclxuXHRcdFx0YXBwLl9pZCA9IGFwcC5jb2RlXHJcblx0XHRfQXBwc1thcHAuX2lkXSA9IGFwcFxyXG5cdHN0ZWVkb3NJMThuLnRyYW5zbGF0aW9uQXBwcyhsbmcsIF9BcHBzKTtcclxuXHRyZXN1bHQuYXBwcyA9IF9BcHBzO1xyXG5cdGFzc2lnbmVkX21lbnVzID0gY2xvbmUocmVzdWx0LmFzc2lnbmVkX21lbnVzKTtcclxuXHRzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk1lbnVzKGxuZywgYXNzaWduZWRfbWVudXMpO1xyXG5cdHJlc3VsdC5hc3NpZ25lZF9tZW51cyA9IGFzc2lnbmVkX21lbnVzO1xyXG5cclxuXHRfRGFzaGJvYXJkcyA9IHt9XHJcblx0Xy5lYWNoIHJlc3VsdC5kYXNoYm9hcmRzLCAoZGFzaGJvYXJkLCBrZXkpIC0+XHJcblx0XHRpZiAhZGFzaGJvYXJkLl9pZFxyXG5cdFx0XHRkYXNoYm9hcmQuX2lkID0ga2V5XHJcblx0XHRfRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxyXG5cdHJlc3VsdC5kYXNoYm9hcmRzID0gX0Rhc2hib2FyZHNcclxuXHJcblx0cmVzdWx0LnBsdWdpbnMgPSBzdGVlZG9zQ29yZS5nZXRQbHVnaW5zPygpXHJcblxyXG5cdG9iamVjdHNMYXlvdXQgPSBnZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQodXNlcklkLCBzcGFjZUlkKTtcclxuXHJcblx0aWYgb2JqZWN0c0xheW91dFxyXG5cdFx0Xy5lYWNoIG9iamVjdHNMYXlvdXQsIChvYmplY3RMYXlvdXQpLT5cclxuXHRcdFx0X29iamVjdCA9IGNsb25lKHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0pO1xyXG5cdFx0XHRpZiBfb2JqZWN0XHJcblx0XHRcdFx0X2ZpZWxkcyA9IHt9O1xyXG5cdFx0XHRcdF8uZWFjaCBvYmplY3RMYXlvdXQuZmllbGRzLCAoX2l0ZW0pLT5cclxuXHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdID0gX29iamVjdC5maWVsZHNbX2l0ZW0uZmllbGRdXHJcblx0XHRcdFx0XHRpZiBfLmhhcyhfaXRlbSwgJ2dyb3VwJylcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/Lmdyb3VwID0gX2l0ZW0uZ3JvdXBcclxuXHRcdFx0XHRcdGlmIF9pdGVtLnJlcXVpcmVkXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZWFkb25seSA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5kaXNhYmxlZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IHRydWVcclxuXHRcdFx0XHRcdGVsc2UgaWYgX2l0ZW0ucmVhZG9ubHlcclxuXHRcdFx0XHRcdFx0X2ZpZWxkc1tfaXRlbS5maWVsZF0/LnJlYWRvbmx5ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0XHRfZmllbGRzW19pdGVtLmZpZWxkXT8uZGlzYWJsZWQgPSB0cnVlXHJcblx0XHRcdFx0XHRcdF9maWVsZHNbX2l0ZW0uZmllbGRdPy5yZXF1aXJlZCA9IGZhbHNlXHJcblx0XHRcdFx0X29iamVjdC5maWVsZHMgPSBfZmllbGRzXHJcblxyXG4jXHRcdFx0XHRfYWN0aW9ucyA9IHt9O1xyXG4jXHRcdFx0XHRfLmVhY2ggb2JqZWN0TGF5b3V0LmFjdGlvbnMsIChhY3Rpb25OYW1lKS0+XHJcbiNcdFx0XHRcdFx0X2FjdGlvbnNbYWN0aW9uTmFtZV0gPSBfb2JqZWN0LmFjdGlvbnNbYWN0aW9uTmFtZV1cclxuI1x0XHRcdFx0X29iamVjdC5hY3Rpb25zID0gX2FjdGlvbnNcclxuXHRcdFx0XHRfb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXVxyXG5cdFx0XHRyZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdID0gX29iamVjdFxyXG5cclxuXHRKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxyXG5cdFx0Y29kZTogMjAwLFxyXG5cdFx0ZGF0YTogcmVzdWx0XHJcbiIsInZhciBfZ2V0TG9jYWxlLCBjbG9uZSwgZ2V0VXNlclByb2ZpbGVPYmplY3RzTGF5b3V0LCBzdGVlZG9zQXV0aCwgc3RlZWRvc0NvcmUsIHN0ZWVkb3NJMThuO1xuXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuXG5zdGVlZG9zSTE4biA9IHJlcXVpcmUoXCJAc3RlZWRvcy9pMThuXCIpO1xuXG5zdGVlZG9zQ29yZSA9IHJlcXVpcmUoXCJAc3RlZWRvcy9jb3JlXCIpO1xuXG5jbG9uZSA9IHJlcXVpcmUoXCJjbG9uZVwiKTtcblxuX2dldExvY2FsZSA9IGZ1bmN0aW9uKHVzZXIpIHtcbiAgdmFyIGxvY2FsZSwgcmVmLCByZWYxO1xuICBpZiAoKHVzZXIgIT0gbnVsbCA/IChyZWYgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZi50b0xvY2FsZUxvd2VyQ2FzZSgpIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gJ3poLWNuJykge1xuICAgIGxvY2FsZSA9IFwiemgtQ05cIjtcbiAgfSBlbHNlIGlmICgodXNlciAhPSBudWxsID8gKHJlZjEgPSB1c2VyLmxvY2FsZSkgIT0gbnVsbCA/IHJlZjEudG9Mb2NhbGVMb3dlckNhc2UoKSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09ICdlbi11cycpIHtcbiAgICBsb2NhbGUgPSBcImVuXCI7XG4gIH0gZWxzZSB7XG4gICAgbG9jYWxlID0gXCJ6aC1DTlwiO1xuICB9XG4gIHJldHVybiBsb2NhbGU7XG59O1xuXG5nZXRVc2VyUHJvZmlsZU9iamVjdHNMYXlvdXQgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQpIHtcbiAgdmFyIHJlZiwgc3BhY2VVc2VyO1xuICBzcGFjZVVzZXIgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJzcGFjZV91c2Vyc1wiKS5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICB1c2VyOiB1c2VySWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgcHJvZmlsZTogMVxuICAgIH1cbiAgfSk7XG4gIGlmIChzcGFjZVVzZXIgJiYgc3BhY2VVc2VyLnByb2ZpbGUpIHtcbiAgICByZXR1cm4gKHJlZiA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcIm9iamVjdF9sYXlvdXRzXCIpKSAhPSBudWxsID8gcmVmLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICBwcm9maWxlczogc3BhY2VVc2VyLnByb2ZpbGVcbiAgICB9KS5mZXRjaCgpIDogdm9pZCAwO1xuICB9XG59O1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvYm9vdHN0cmFwLzpzcGFjZUlkL1wiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgX0FwcHMsIF9EYXNoYm9hcmRzLCBhc3NpZ25lZF9tZW51cywgYXV0aFRva2VuLCBsbmcsIG9iamVjdHNMYXlvdXQsIHBlcm1pc3Npb25zLCByZWYsIHJlc3VsdCwgc3BhY2UsIHNwYWNlSWQsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHVzZXJJZCA9IHJlcS5oZWFkZXJzWyd4LXVzZXItaWQnXTtcbiAgc3BhY2VJZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYgPSByZXEucGFyYW1zKSAhPSBudWxsID8gcmVmLnNwYWNlSWQgOiB2b2lkIDApO1xuICBpZiAoIXVzZXJJZCkge1xuICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDQwMyxcbiAgICAgIGRhdGE6IG51bGxcbiAgICB9KTtcbiAgICByZXR1cm47XG4gIH1cbiAgYXV0aFRva2VuID0gU3RlZWRvcy5nZXRBdXRoVG9rZW4ocmVxLCByZXMpO1xuICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoZnVuY3Rpb24oYXV0aFRva2VuLCBzcGFjZUlkLCBjYikge1xuICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KShhdXRoVG9rZW4sIHNwYWNlSWQpO1xuICBpZiAoIXVzZXJTZXNzaW9uKSB7XG4gICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogNTAwLFxuICAgICAgZGF0YTogbnVsbFxuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBzcGFjZSA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZXNcIl0uZmluZE9uZSh7XG4gICAgX2lkOiBzcGFjZUlkXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIG5hbWU6IDFcbiAgICB9XG4gIH0pO1xuICByZXN1bHQgPSBDcmVhdG9yLmdldEFsbFBlcm1pc3Npb25zKHNwYWNlSWQsIHVzZXJJZCk7XG4gIGxuZyA9IF9nZXRMb2NhbGUoZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGxvY2FsZTogMVxuICAgIH1cbiAgfSkpO1xuICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbk9iamVjdHMobG5nLCByZXN1bHQub2JqZWN0cyk7XG4gIHJlc3VsdC51c2VyID0gdXNlclNlc3Npb247XG4gIHJlc3VsdC5zcGFjZSA9IHNwYWNlO1xuICByZXN1bHQuYXBwcyA9IGNsb25lKENyZWF0b3IuQXBwcyk7XG4gIHJlc3VsdC5kYXNoYm9hcmRzID0gY2xvbmUoQ3JlYXRvci5EYXNoYm9hcmRzKTtcbiAgcmVzdWx0Lm9iamVjdF9saXN0dmlld3MgPSBDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzKHVzZXJJZCwgc3BhY2VJZCwgcmVzdWx0Lm9iamVjdHMpO1xuICByZXN1bHQub2JqZWN0X3dvcmtmbG93cyA9IE1ldGVvci5jYWxsKCdvYmplY3Rfd29ya2Zsb3dzLmdldCcsIHNwYWNlSWQsIHVzZXJJZCk7XG4gIHBlcm1pc3Npb25zID0gTWV0ZW9yLndyYXBBc3luYyhmdW5jdGlvbih2LCB1c2VyU2Vzc2lvbiwgY2IpIHtcbiAgICByZXR1cm4gdi5nZXRVc2VyT2JqZWN0UGVybWlzc2lvbih1c2VyU2Vzc2lvbikudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJldHVybiBjYihyZWplY3QsIHJlc29sdmUpO1xuICAgIH0pO1xuICB9KTtcbiAgXy5lYWNoKENyZWF0b3Iuc3RlZWRvc1NjaGVtYS5nZXREYXRhU291cmNlcygpLCBmdW5jdGlvbihkYXRhc291cmNlLCBuYW1lKSB7XG4gICAgdmFyIGRhdGFzb3VyY2VPYmplY3RzO1xuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGRhdGFzb3VyY2VPYmplY3RzID0gZGF0YXNvdXJjZS5nZXRPYmplY3RzKCk7XG4gICAgICByZXR1cm4gXy5lYWNoKGRhdGFzb3VyY2VPYmplY3RzLCBmdW5jdGlvbih2LCBrKSB7XG4gICAgICAgIHZhciBfb2JqO1xuICAgICAgICBfb2JqID0gQ3JlYXRvci5jb252ZXJ0T2JqZWN0KGNsb25lKHYudG9Db25maWcoKSksIHNwYWNlSWQpO1xuICAgICAgICBfb2JqLm5hbWUgPSBrO1xuICAgICAgICBfb2JqLmRhdGFiYXNlX25hbWUgPSBuYW1lO1xuICAgICAgICBfb2JqLnBlcm1pc3Npb25zID0gcGVybWlzc2lvbnModiwgdXNlclNlc3Npb24pO1xuICAgICAgICByZXR1cm4gcmVzdWx0Lm9iamVjdHNbX29iai5uYW1lXSA9IF9vYmo7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBfLmVhY2goQ3JlYXRvci5zdGVlZG9zU2NoZW1hLmdldERhdGFTb3VyY2VzKCksIGZ1bmN0aW9uKGRhdGFzb3VyY2UsIG5hbWUpIHtcbiAgICByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKHJlc3VsdC5hcHBzLCBjbG9uZShkYXRhc291cmNlLmdldEFwcHNDb25maWcoKSkpO1xuICAgIHJldHVybiByZXN1bHQuZGFzaGJvYXJkcyA9IF8uZXh0ZW5kKHJlc3VsdC5kYXNoYm9hcmRzLCBkYXRhc291cmNlLmdldERhc2hib2FyZHNDb25maWcoKSk7XG4gIH0pO1xuICByZXN1bHQuYXBwcyA9IF8uZXh0ZW5kKHJlc3VsdC5hcHBzIHx8IHt9LCBDcmVhdG9yLmdldERCQXBwcyhzcGFjZUlkKSk7XG4gIHJlc3VsdC5kYXNoYm9hcmRzID0gXy5leHRlbmQocmVzdWx0LmRhc2hib2FyZHMgfHwge30sIENyZWF0b3IuZ2V0REJEYXNoYm9hcmRzKHNwYWNlSWQpKTtcbiAgX0FwcHMgPSB7fTtcbiAgXy5lYWNoKHJlc3VsdC5hcHBzLCBmdW5jdGlvbihhcHAsIGtleSkge1xuICAgIGlmICghYXBwLl9pZCkge1xuICAgICAgYXBwLl9pZCA9IGtleTtcbiAgICB9XG4gICAgaWYgKGFwcC5jb2RlKSB7XG4gICAgICBhcHAuX2RiaWQgPSBhcHAuX2lkO1xuICAgICAgYXBwLl9pZCA9IGFwcC5jb2RlO1xuICAgIH1cbiAgICByZXR1cm4gX0FwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICBzdGVlZG9zSTE4bi50cmFuc2xhdGlvbkFwcHMobG5nLCBfQXBwcyk7XG4gIHJlc3VsdC5hcHBzID0gX0FwcHM7XG4gIGFzc2lnbmVkX21lbnVzID0gY2xvbmUocmVzdWx0LmFzc2lnbmVkX21lbnVzKTtcbiAgc3RlZWRvc0kxOG4udHJhbnNsYXRpb25NZW51cyhsbmcsIGFzc2lnbmVkX21lbnVzKTtcbiAgcmVzdWx0LmFzc2lnbmVkX21lbnVzID0gYXNzaWduZWRfbWVudXM7XG4gIF9EYXNoYm9hcmRzID0ge307XG4gIF8uZWFjaChyZXN1bHQuZGFzaGJvYXJkcywgZnVuY3Rpb24oZGFzaGJvYXJkLCBrZXkpIHtcbiAgICBpZiAoIWRhc2hib2FyZC5faWQpIHtcbiAgICAgIGRhc2hib2FyZC5faWQgPSBrZXk7XG4gICAgfVxuICAgIHJldHVybiBfRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZDtcbiAgfSk7XG4gIHJlc3VsdC5kYXNoYm9hcmRzID0gX0Rhc2hib2FyZHM7XG4gIHJlc3VsdC5wbHVnaW5zID0gdHlwZW9mIHN0ZWVkb3NDb3JlLmdldFBsdWdpbnMgPT09IFwiZnVuY3Rpb25cIiA/IHN0ZWVkb3NDb3JlLmdldFBsdWdpbnMoKSA6IHZvaWQgMDtcbiAgb2JqZWN0c0xheW91dCA9IGdldFVzZXJQcm9maWxlT2JqZWN0c0xheW91dCh1c2VySWQsIHNwYWNlSWQpO1xuICBpZiAob2JqZWN0c0xheW91dCkge1xuICAgIF8uZWFjaChvYmplY3RzTGF5b3V0LCBmdW5jdGlvbihvYmplY3RMYXlvdXQpIHtcbiAgICAgIHZhciBfZmllbGRzLCBfb2JqZWN0O1xuICAgICAgX29iamVjdCA9IGNsb25lKHJlc3VsdC5vYmplY3RzW29iamVjdExheW91dC5vYmplY3RfbmFtZV0pO1xuICAgICAgaWYgKF9vYmplY3QpIHtcbiAgICAgICAgX2ZpZWxkcyA9IHt9O1xuICAgICAgICBfLmVhY2gob2JqZWN0TGF5b3V0LmZpZWxkcywgZnVuY3Rpb24oX2l0ZW0pIHtcbiAgICAgICAgICB2YXIgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgICAgICAgICBfZmllbGRzW19pdGVtLmZpZWxkXSA9IF9vYmplY3QuZmllbGRzW19pdGVtLmZpZWxkXTtcbiAgICAgICAgICBpZiAoXy5oYXMoX2l0ZW0sICdncm91cCcpKSB7XG4gICAgICAgICAgICBpZiAoKHJlZjEgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWYxLmdyb3VwID0gX2l0ZW0uZ3JvdXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChfaXRlbS5yZXF1aXJlZCkge1xuICAgICAgICAgICAgaWYgKChyZWYyID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmMi5yZWFkb25seSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChyZWYzID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVmMy5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChyZWY0ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwgPyByZWY0LnJlcXVpcmVkID0gdHJ1ZSA6IHZvaWQgMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKF9pdGVtLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICBpZiAoKHJlZjUgPSBfZmllbGRzW19pdGVtLmZpZWxkXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICByZWY1LnJlYWRvbmx5ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgocmVmNiA9IF9maWVsZHNbX2l0ZW0uZmllbGRdKSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgIHJlZjYuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIChyZWY3ID0gX2ZpZWxkc1tfaXRlbS5maWVsZF0pICE9IG51bGwgPyByZWY3LnJlcXVpcmVkID0gZmFsc2UgOiB2b2lkIDA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgX29iamVjdC5maWVsZHMgPSBfZmllbGRzO1xuICAgICAgICBfb2JqZWN0LmFsbG93X2FjdGlvbnMgPSBvYmplY3RMYXlvdXQuYWN0aW9ucyB8fCBbXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQub2JqZWN0c1tvYmplY3RMYXlvdXQub2JqZWN0X25hbWVdID0gX29iamVjdDtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgIGNvZGU6IDIwMCxcbiAgICBkYXRhOiByZXN1bHRcbiAgfSk7XG59KTtcbiIsIkpzb25Sb3V0ZXMuYWRkICdwb3N0JywgJy9hcGkvYmlsbGluZy9yZWNoYXJnZS9ub3RpZnknLCAocmVxLCByZXMsIG5leHQpIC0+XHJcblx0dHJ5XHJcblx0XHRib2R5ID0gXCJcIlxyXG5cdFx0cmVxLm9uKCdkYXRhJywgKGNodW5rKS0+XHJcblx0XHRcdGJvZHkgKz0gY2h1bmtcclxuXHRcdClcclxuXHRcdHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKCktPlxyXG5cdFx0XHRcdHhtbDJqcyA9IHJlcXVpcmUoJ3htbDJqcycpXHJcblx0XHRcdFx0cGFyc2VyID0gbmV3IHhtbDJqcy5QYXJzZXIoeyB0cmltOnRydWUsIGV4cGxpY2l0QXJyYXk6ZmFsc2UsIGV4cGxpY2l0Um9vdDpmYWxzZSB9KVxyXG5cdFx0XHRcdHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCAoZXJyLCByZXN1bHQpLT5cclxuXHRcdFx0XHRcdFx0IyDnibnliKvmj5DphpLvvJrllYbmiLfns7vnu5/lr7nkuo7mlK/ku5jnu5PmnpzpgJrnn6XnmoTlhoXlrrnkuIDlrpropoHlgZrnrb7lkI3pqozor4Es5bm25qCh6aqM6L+U5Zue55qE6K6i5Y2V6YeR6aKd5piv5ZCm5LiO5ZWG5oi35L6n55qE6K6i5Y2V6YeR6aKd5LiA6Ie077yM6Ziy5q2i5pWw5o2u5rOE5ryP5a+86Ie05Ye6546w4oCc5YGH6YCa55+l4oCd77yM6YCg5oiQ6LWE6YeR5o2f5aSxXHJcblx0XHRcdFx0XHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblx0XHRcdFx0XHRcdHd4cGF5ID0gV1hQYXkoe1xyXG5cdFx0XHRcdFx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0XHRcdFx0XHRtY2hfaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLm1jaF9pZCxcclxuXHRcdFx0XHRcdFx0XHRwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXkgI+W+ruS/oeWVhuaIt+W5s+WPsEFQSeWvhumSpVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHRzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpXHJcblx0XHRcdFx0XHRcdGF0dGFjaCA9IEpTT04ucGFyc2UocmVzdWx0LmF0dGFjaClcclxuXHRcdFx0XHRcdFx0Y29kZV91cmxfaWQgPSBhdHRhY2guY29kZV91cmxfaWRcclxuXHRcdFx0XHRcdFx0YnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKVxyXG5cdFx0XHRcdFx0XHRpZiBicHIgYW5kIGJwci50b3RhbF9mZWUgaXMgTnVtYmVyKHJlc3VsdC50b3RhbF9mZWUpIGFuZCBzaWduIGlzIHJlc3VsdC5zaWduXHJcblx0XHRcdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy51cGRhdGUoe19pZDogY29kZV91cmxfaWR9LCB7JHNldDoge3BhaWQ6IHRydWV9fSlcclxuXHRcdFx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheShicHIuc3BhY2UsIGJwci5tb2R1bGVzLCBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSksIGJwci5jcmVhdGVkX2J5LCBicHIuZW5kX2RhdGUsIGJwci51c2VyX2NvdW50KVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0KVxyXG5cdFx0XHQpLCAoZXJyKS0+XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlcnIuc3RhY2tcclxuXHRcdFx0XHRjb25zb2xlLmxvZyAnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGFwaV9iaWxsaW5nX3JlY2hhcmdlX25vdGlmeS5jb2ZmZWUnXHJcblx0XHRcdClcclxuXHRcdClcclxuXHRcdFxyXG5cdGNhdGNoIGVcclxuXHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xyXG5cclxuXHRyZXMud3JpdGVIZWFkKDIwMCwgeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24veG1sJ30pXHJcblx0cmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+JylcclxuXHJcblx0XHQiLCJKc29uUm91dGVzLmFkZCgncG9zdCcsICcvYXBpL2JpbGxpbmcvcmVjaGFyZ2Uvbm90aWZ5JywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGJvZHksIGU7XG4gIHRyeSB7XG4gICAgYm9keSA9IFwiXCI7XG4gICAgcmVxLm9uKCdkYXRhJywgZnVuY3Rpb24oY2h1bmspIHtcbiAgICAgIHJldHVybiBib2R5ICs9IGNodW5rO1xuICAgIH0pO1xuICAgIHJlcS5vbignZW5kJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcGFyc2VyLCB4bWwyanM7XG4gICAgICB4bWwyanMgPSByZXF1aXJlKCd4bWwyanMnKTtcbiAgICAgIHBhcnNlciA9IG5ldyB4bWwyanMuUGFyc2VyKHtcbiAgICAgICAgdHJpbTogdHJ1ZSxcbiAgICAgICAgZXhwbGljaXRBcnJheTogZmFsc2UsXG4gICAgICAgIGV4cGxpY2l0Um9vdDogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZVN0cmluZyhib2R5LCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICB2YXIgV1hQYXksIGF0dGFjaCwgYnByLCBjb2RlX3VybF9pZCwgc2lnbiwgd3hwYXk7XG4gICAgICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgICAgICB3eHBheSA9IFdYUGF5KHtcbiAgICAgICAgICBhcHBpZDogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcuYXBwaWQsXG4gICAgICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICAgICAgcGFydG5lcl9rZXk6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLnBhcnRuZXJfa2V5XG4gICAgICAgIH0pO1xuICAgICAgICBzaWduID0gd3hwYXkuc2lnbihfLmNsb25lKHJlc3VsdCkpO1xuICAgICAgICBhdHRhY2ggPSBKU09OLnBhcnNlKHJlc3VsdC5hdHRhY2gpO1xuICAgICAgICBjb2RlX3VybF9pZCA9IGF0dGFjaC5jb2RlX3VybF9pZDtcbiAgICAgICAgYnByID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kT25lKGNvZGVfdXJsX2lkKTtcbiAgICAgICAgaWYgKGJwciAmJiBicHIudG90YWxfZmVlID09PSBOdW1iZXIocmVzdWx0LnRvdGFsX2ZlZSkgJiYgc2lnbiA9PT0gcmVzdWx0LnNpZ24pIHtcbiAgICAgICAgICBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLnVwZGF0ZSh7XG4gICAgICAgICAgICBfaWQ6IGNvZGVfdXJsX2lkXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5KGJwci5zcGFjZSwgYnByLm1vZHVsZXMsIE51bWJlcihyZXN1bHQudG90YWxfZmVlKSwgYnByLmNyZWF0ZWRfYnksIGJwci5lbmRfZGF0ZSwgYnByLnVzZXJfY291bnQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBhcGlfYmlsbGluZ19yZWNoYXJnZV9ub3RpZnkuY29mZmVlJyk7XG4gICAgfSkpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICB9XG4gIHJlcy53cml0ZUhlYWQoMjAwLCB7XG4gICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94bWwnXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZCgnPHhtbD48cmV0dXJuX2NvZGU+PCFbQ0RBVEFbU1VDQ0VTU11dPjwvcmV0dXJuX2NvZGU+PC94bWw+Jyk7XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0Z2V0X2NvbnRhY3RzX2xpbWl0OiAoc3BhY2UpLT5cclxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XHJcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLp0cnVl6KGo56S66ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5Zyo57uE57uH6IyD5Zu077yMb3JnYW5pemF0aW9uc+WAvOiusOW9lemineWklueahOe7hOe7h+iMg+WbtFxyXG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6ZmFsc2XooajnpLrkuI3pmZDlrprnu4Tnu4fojIPlm7TvvIzljbPooajnpLrog73nnIvmlbTkuKrlt6XkvZzljLrnmoTnu4Tnu4dcclxuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXHJcblx0XHRjaGVjayBzcGFjZSwgU3RyaW5nXHJcblx0XHRyZVZhbHVlID1cclxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxyXG5cdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXHJcblx0XHR1bmxlc3MgdGhpcy51c2VySWRcclxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdGlzTGltaXQgPSBmYWxzZVxyXG5cdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gW11cclxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcclxuXHRcdGxpbWl0cyA9IHNldHRpbmc/LnZhbHVlcyB8fCBbXTtcclxuXHJcblx0XHRpZiBsaW1pdHMubGVuZ3RoXHJcblx0XHRcdG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCB1c2VyczogdGhpcy51c2VySWR9LCB7ZmllbGRzOntfaWQ6IDF9fSlcclxuXHRcdFx0bXlPcmdJZHMgPSBteU9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cdFx0XHR1bmxlc3MgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0cmV0dXJuIHJlVmFsdWVcclxuXHRcdFx0XHJcblx0XHRcdG15TGl0bWl0T3JnSWRzID0gW11cclxuXHRcdFx0Zm9yIGxpbWl0IGluIGxpbWl0c1xyXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcclxuXHRcdFx0XHR0b3MgPSBsaW1pdC50b3NcclxuXHRcdFx0XHRmcm9tc0NoaWxkcmVuID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIHBhcmVudHM6IHskaW46IGZyb21zfX0sIHtmaWVsZHM6e19pZDogMX19KVxyXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XHJcblx0XHRcdFx0XHRyZXR1cm4gbi5faWRcclxuXHRcdFx0XHRmb3IgbXlPcmdJZCBpbiBteU9yZ0lkc1xyXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxyXG5cdFx0XHRcdFx0aWYgZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xXHJcblx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRpZiBmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMVxyXG5cdFx0XHRcdFx0XHRcdHRlbXBJc0xpbWl0ID0gdHJ1ZVxyXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcclxuXHRcdFx0XHRcdFx0aXNMaW1pdCA9IHRydWVcclxuXHRcdFx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zLnB1c2ggdG9zXHJcblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxyXG5cclxuXHRcdFx0bXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEgbXlMaXRtaXRPcmdJZHNcclxuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXHJcblx0XHRcdFx0IyDlpoLmnpzlj5fpmZDnmoTnu4Tnu4fkuKrmlbDlsI/kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTkuKrmlbDvvIzliJnor7TmmI7lvZPliY3nlKjmiLfoh7PlsJHmnInkuIDkuKrnu4Tnu4fmmK/kuI3lj5fpmZDnmoRcclxuXHRcdFx0XHRpc0xpbWl0ID0gZmFsc2VcclxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxIF8uZmxhdHRlbiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcclxuXHJcblx0XHRpZiBpc0xpbWl0XHJcblx0XHRcdHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7c3BhY2U6IHNwYWNlLCBfaWQ6IHskaW46IG91dHNpZGVfb3JnYW5pemF0aW9uc319LCB7ZmllbGRzOntfaWQ6IDEsIHBhcmVudHM6IDF9fSkuZmV0Y2goKVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxyXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieWxnuS6jueUqOaIt+aJgOWxnue7hOe7h+eahOWtkOWtmeiKgueCueeahOiKgueCueWIoOmZpFxyXG5cdFx0XHRvcmdzID0gXy5maWx0ZXIgdG9PcmdzLCAob3JnKSAtPlxyXG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxyXG5cdFx0XHRcdHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgYW5kIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxXHJcblx0XHRcdG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwIChuKSAtPlxyXG5cdFx0XHRcdHJldHVybiBuLl9pZFxyXG5cclxuXHRcdHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXRcclxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXHJcblx0XHRyZXR1cm4gcmVWYWx1ZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIGdldF9jb250YWN0c19saW1pdDogZnVuY3Rpb24oc3BhY2UpIHtcbiAgICB2YXIgZnJvbXMsIGZyb21zQ2hpbGRyZW4sIGZyb21zQ2hpbGRyZW5JZHMsIGksIGlzTGltaXQsIGosIGxlbiwgbGVuMSwgbGltaXQsIGxpbWl0cywgbXlMaXRtaXRPcmdJZHMsIG15T3JnSWQsIG15T3JnSWRzLCBteU9yZ3MsIG9yZ3MsIG91dHNpZGVfb3JnYW5pemF0aW9ucywgcmVWYWx1ZSwgc2V0dGluZywgdGVtcElzTGltaXQsIHRvT3JncywgdG9zO1xuICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpO1xuICAgIHJlVmFsdWUgPSB7XG4gICAgICBpc0xpbWl0OiB0cnVlLFxuICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuICAgIH07XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgfVxuICAgIGlzTGltaXQgPSBmYWxzZTtcbiAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICBzZXR0aW5nID0gZGIuc3BhY2Vfc2V0dGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2UsXG4gICAgICBrZXk6IFwiY29udGFjdHNfdmlld19saW1pdHNcIlxuICAgIH0pO1xuICAgIGxpbWl0cyA9IChzZXR0aW5nICE9IG51bGwgPyBzZXR0aW5nLnZhbHVlcyA6IHZvaWQgMCkgfHwgW107XG4gICAgaWYgKGxpbWl0cy5sZW5ndGgpIHtcbiAgICAgIG15T3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgdXNlcnM6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG15T3JnSWRzID0gbXlPcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgICAgaWYgKCFteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIHJlVmFsdWU7XG4gICAgICB9XG4gICAgICBteUxpdG1pdE9yZ0lkcyA9IFtdO1xuICAgICAgZm9yIChpID0gMCwgbGVuID0gbGltaXRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGxpbWl0ID0gbGltaXRzW2ldO1xuICAgICAgICBmcm9tcyA9IGxpbWl0LmZyb21zO1xuICAgICAgICB0b3MgPSBsaW1pdC50b3M7XG4gICAgICAgIGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgICBwYXJlbnRzOiB7XG4gICAgICAgICAgICAkaW46IGZyb21zXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBmcm9tc0NoaWxkcmVuSWRzID0gZnJvbXNDaGlsZHJlbiAhPSBudWxsID8gZnJvbXNDaGlsZHJlbi5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgICAgfSkgOiB2b2lkIDA7XG4gICAgICAgIGZvciAoaiA9IDAsIGxlbjEgPSBteU9yZ0lkcy5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgICBteU9yZ0lkID0gbXlPcmdJZHNbal07XG4gICAgICAgICAgdGVtcElzTGltaXQgPSBmYWxzZTtcbiAgICAgICAgICBpZiAoZnJvbXMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChmcm9tc0NoaWxkcmVuSWRzLmluZGV4T2YobXlPcmdJZCkgPiAtMSkge1xuICAgICAgICAgICAgICB0ZW1wSXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW1wSXNMaW1pdCkge1xuICAgICAgICAgICAgaXNMaW1pdCA9IHRydWU7XG4gICAgICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCh0b3MpO1xuICAgICAgICAgICAgbXlMaXRtaXRPcmdJZHMucHVzaChteU9yZ0lkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gXy51bmlxKG15TGl0bWl0T3JnSWRzKTtcbiAgICAgIGlmIChteUxpdG1pdE9yZ0lkcy5sZW5ndGggPCBteU9yZ0lkcy5sZW5ndGgpIHtcbiAgICAgICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IF8udW5pcShfLmZsYXR0ZW4ob3V0c2lkZV9vcmdhbml6YXRpb25zKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpc0xpbWl0KSB7XG4gICAgICB0b09yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgICBzcGFjZTogc3BhY2UsXG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zXG4gICAgICAgIH1cbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgIHBhcmVudHM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIG9yZ3MgPSBfLmZpbHRlcih0b09yZ3MsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICB2YXIgcGFyZW50cztcbiAgICAgICAgcGFyZW50cyA9IG9yZy5wYXJlbnRzIHx8IFtdO1xuICAgICAgICByZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxICYmIF8uaW50ZXJzZWN0aW9uKHBhcmVudHMsIG15T3JnSWRzKS5sZW5ndGggPCAxO1xuICAgICAgfSk7XG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvcmdzLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgIHJldHVybiBuLl9pZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZVZhbHVlLmlzTGltaXQgPSBpc0xpbWl0O1xuICAgIHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zO1xuICAgIHJldHVybiByZVZhbHVlO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzKHtcclxuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgY2hlY2soa2V5LCBTdHJpbmcpO1xyXG4gICAgICAgIGNoZWNrKHZhbHVlLCBPYmplY3QpO1xyXG5cclxuICAgICAgICBvYmogPSB7fTtcclxuICAgICAgICBvYmoudXNlciA9IHRoaXMudXNlcklkO1xyXG4gICAgICAgIG9iai5rZXkgPSBrZXk7XHJcbiAgICAgICAgb2JqLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XHJcbiAgICAgICAgICAgIHVzZXI6IHRoaXMudXNlcklkLFxyXG4gICAgICAgICAgICBrZXk6IGtleVxyXG4gICAgICAgIH0pLmNvdW50KCk7XHJcbiAgICAgICAgaWYgKGMgPiAwKSB7XHJcbiAgICAgICAgICAgIGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLnVwZGF0ZSh7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcclxuICAgICAgICAgICAgICAgIGtleToga2V5XHJcbiAgICAgICAgICAgIH0sIHtcclxuICAgICAgICAgICAgICAgICRzZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMuaW5zZXJ0KG9iaik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufSkiLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfc2V0dGxldXA6IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZD1cIlwiKS0+XHJcblx0XHRjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpXHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKVxyXG5cclxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHRoaXMudXNlcklkfSwge2ZpZWxkczoge2lzX2Nsb3VkYWRtaW46IDF9fSlcclxuXHJcblx0XHRpZiBub3QgdXNlci5pc19jbG91ZGFkbWluXHJcblx0XHRcdHJldHVyblxyXG5cclxuXHRcdGNvbnNvbGUudGltZSAnYmlsbGluZydcclxuXHRcdHNwYWNlcyA9IFtdXHJcblx0XHRpZiBzcGFjZV9pZFxyXG5cdFx0XHRzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZV9pZCwgaXNfcGFpZDogdHJ1ZX0sIHtmaWVsZHM6IHtfaWQ6IDF9fSlcclxuXHRcdGVsc2VcclxuXHRcdFx0c3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWV9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXHJcblx0XHRyZXN1bHQgPSBbXVxyXG5cdFx0c3BhY2VzLmZvckVhY2ggKHMpIC0+XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdGJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgoYWNjb3VudGluZ19tb250aCwgcy5faWQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGUgPSB7fVxyXG5cdFx0XHRcdGUuX2lkID0gcy5faWRcclxuXHRcdFx0XHRlLm5hbWUgPSBzLm5hbWVcclxuXHRcdFx0XHRlLmVyciA9IGVyclxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoIGVcclxuXHRcdGlmIHJlc3VsdC5sZW5ndGggPiAwXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgcmVzdWx0XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbFxyXG5cdFx0XHRcdEVtYWlsLnNlbmRcclxuXHRcdFx0XHRcdHRvOiAnc3VwcG9ydEBzdGVlZG9zLmNvbSdcclxuXHRcdFx0XHRcdGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb21cclxuXHRcdFx0XHRcdHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCdcclxuXHRcdFx0XHRcdHRleHQ6IEpTT04uc3RyaW5naWZ5KCdyZXN1bHQnOiByZXN1bHQpXHJcblx0XHRcdGNhdGNoIGVyclxyXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXHJcblx0XHRjb25zb2xlLnRpbWVFbmQgJ2JpbGxpbmcnIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBiaWxsaW5nX3NldHRsZXVwOiBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICAgIHZhciBFbWFpbCwgZXJyLCByZXN1bHQsIHNwYWNlcywgdXNlcjtcbiAgICBpZiAoc3BhY2VfaWQgPT0gbnVsbCkge1xuICAgICAgc3BhY2VfaWQgPSBcIlwiO1xuICAgIH1cbiAgICBjaGVjayhhY2NvdW50aW5nX21vbnRoLCBTdHJpbmcpO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnNvbGUudGltZSgnYmlsbGluZycpO1xuICAgIHNwYWNlcyA9IFtdO1xuICAgIGlmIChzcGFjZV9pZCkge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkLFxuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3BhY2VzID0gZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICBpc19wYWlkOiB0cnVlXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIF9pZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmVzdWx0ID0gW107XG4gICAgc3BhY2VzLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGUsIGVycjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFjY291bnRpbmdfbW9udGgsIHMuX2lkKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGVyciA9IGVycm9yO1xuICAgICAgICBlID0ge307XG4gICAgICAgIGUuX2lkID0gcy5faWQ7XG4gICAgICAgIGUubmFtZSA9IHMubmFtZTtcbiAgICAgICAgZS5lcnIgPSBlcnI7XG4gICAgICAgIHJldHVybiByZXN1bHQucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzdWx0KTtcbiAgICAgIHRyeSB7XG4gICAgICAgIEVtYWlsID0gUGFja2FnZS5lbWFpbC5FbWFpbDtcbiAgICAgICAgRW1haWwuc2VuZCh7XG4gICAgICAgICAgdG86ICdzdXBwb3J0QHN0ZWVkb3MuY29tJyxcbiAgICAgICAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgICAgICAgIHN1YmplY3Q6ICdiaWxsaW5nIHNldHRsZXVwIHJlc3VsdCcsXG4gICAgICAgICAgdGV4dDogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IHJlc3VsdFxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZXJyID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZycpO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXHJcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XHJcblx0XHRjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcclxuXHRcdGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xyXG5cclxuXHRcdGlmICFTdGVlZG9zLmlzU3BhY2VBZG1pbihzcGFjZV9pZCwgTWV0ZW9yLnVzZXJJZCgpKSBhbmQgdXNlcl9pZFxyXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2NvbnRhY3Rfc3BhY2VfdXNlcl9uZWVkZWQnKVxyXG5cclxuXHRcdGlmIG5vdCBNZXRlb3IudXNlcklkKClcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsJ2Vycm9yLWludmFsaWQtdXNlcicpXHJcblxyXG5cdFx0dW5sZXNzIHVzZXJfaWRcclxuXHRcdFx0dXNlcl9pZCA9IE1ldGVvci51c2VyKCkuX2lkXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7dXNlcjogdXNlcl9pZCwgc3BhY2U6IHNwYWNlX2lkfSlcclxuXHJcblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+l55So5oi35bCa5pyq5ZCM5oSP5Yqg5YWl6K+l5bel5L2c5Yy677yM5peg5rOV5L+u5pS555So5oi35ZCNXCIpXHJcblxyXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxyXG5cclxuXHRcdHJldHVybiB1c2VybmFtZVxyXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGJpbGxpbmdfcmVjaGFyZ2U6ICh0b3RhbF9mZWUsIHNwYWNlX2lkLCBuZXdfaWQsIG1vZHVsZV9uYW1lcywgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRcdGNoZWNrIHRvdGFsX2ZlZSwgTnVtYmVyXHJcblx0XHRjaGVjayBzcGFjZV9pZCwgU3RyaW5nIFxyXG5cdFx0Y2hlY2sgbmV3X2lkLCBTdHJpbmcgXHJcblx0XHRjaGVjayBtb2R1bGVfbmFtZXMsIEFycmF5IFxyXG5cdFx0Y2hlY2sgZW5kX2RhdGUsIFN0cmluZyBcclxuXHRcdGNoZWNrIHVzZXJfY291bnQsIE51bWJlciBcclxuXHJcblx0XHR1c2VyX2lkID0gdGhpcy51c2VySWRcclxuXHJcblx0XHRsaXN0cHJpY2VzID0gMFxyXG5cdFx0b3JkZXJfYm9keSA9IFtdXHJcblx0XHRkYi5tb2R1bGVzLmZpbmQoe25hbWU6IHskaW46IG1vZHVsZV9uYW1lc319KS5mb3JFYWNoIChtKS0+XHJcblx0XHRcdGxpc3RwcmljZXMgKz0gbS5saXN0cHJpY2Vfcm1iXHJcblx0XHRcdG9yZGVyX2JvZHkucHVzaCBtLm5hbWVfemhcclxuXHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cdFx0aWYgbm90IHNwYWNlLmlzX3BhaWRcclxuXHRcdFx0c3BhY2VfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOnNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0XHRvbmVfbW9udGhfeXVhbiA9IHNwYWNlX3VzZXJfY291bnQgKiBsaXN0cHJpY2VzXHJcblx0XHRcdGlmIHRvdGFsX2ZlZSA8IG9uZV9tb250aF95dWFuKjEwMFxyXG5cdFx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IgJ2Vycm9yIScsIFwi5YWF5YC86YeR6aKd5bqU5LiN5bCR5LqO5LiA5Liq5pyI5omA6ZyA6LS555So77ya77+lI3tvbmVfbW9udGhfeXVhbn1cIlxyXG5cclxuXHRcdHJlc3VsdF9vYmogPSB7fVxyXG5cclxuXHRcdGF0dGFjaCA9IHt9XHJcblx0XHRhdHRhY2guY29kZV91cmxfaWQgPSBuZXdfaWRcclxuXHRcdFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpXHJcblxyXG5cdFx0d3hwYXkgPSBXWFBheSh7XHJcblx0XHRcdGFwcGlkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5hcHBpZCxcclxuXHRcdFx0bWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXHJcblx0XHRcdHBhcnRuZXJfa2V5OiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5wYXJ0bmVyX2tleSAj5b6u5L+h5ZWG5oi35bmz5Y+wQVBJ5a+G6ZKlXHJcblx0XHR9KVxyXG5cclxuXHRcdHd4cGF5LmNyZWF0ZVVuaWZpZWRPcmRlcih7XHJcblx0XHRcdGJvZHk6IG9yZGVyX2JvZHkuam9pbihcIixcIiksXHJcblx0XHRcdG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxyXG5cdFx0XHR0b3RhbF9mZWU6IHRvdGFsX2ZlZSxcclxuXHRcdFx0c3BiaWxsX2NyZWF0ZV9pcDogJzEyNy4wLjAuMScsXHJcblx0XHRcdG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXHJcblx0XHRcdHRyYWRlX3R5cGU6ICdOQVRJVkUnLFxyXG5cdFx0XHRwcm9kdWN0X2lkOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTURESEhtbXNzU1NTJyksXHJcblx0XHRcdGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxyXG5cdFx0fSwgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKGVyciwgcmVzdWx0KSAtPiBcclxuXHRcdFx0XHRpZiBlcnIgXHJcblx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGVyci5zdGFja1xyXG5cdFx0XHRcdGlmIHJlc3VsdFxyXG5cdFx0XHRcdFx0b2JqID0ge31cclxuXHRcdFx0XHRcdG9iai5faWQgPSBuZXdfaWRcclxuXHRcdFx0XHRcdG9iai5jcmVhdGVkID0gbmV3IERhdGVcclxuXHRcdFx0XHRcdG9iai5pbmZvID0gcmVzdWx0XHJcblx0XHRcdFx0XHRvYmoudG90YWxfZmVlID0gdG90YWxfZmVlXHJcblx0XHRcdFx0XHRvYmouY3JlYXRlZF9ieSA9IHVzZXJfaWRcclxuXHRcdFx0XHRcdG9iai5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdFx0XHRvYmoucGFpZCA9IGZhbHNlXHJcblx0XHRcdFx0XHRvYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xyXG5cdFx0XHRcdFx0b2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcclxuXHRcdFx0XHRcdG9iai51c2VyX2NvdW50ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0ZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5pbnNlcnQob2JqKVxyXG5cdFx0XHQpLCAoZSktPlxyXG5cdFx0XHRcdGNvbnNvbGUubG9nICdGYWlsZWQgdG8gYmluZCBlbnZpcm9ubWVudDogYmlsbGluZ19yZWNoYXJnZS5jb2ZmZWUnXHJcblx0XHRcdFx0Y29uc29sZS5sb2cgZS5zdGFja1xyXG5cdFx0XHQpXHJcblx0XHQpXHJcblxyXG5cdFx0XHJcblx0XHRyZXR1cm4gXCJzdWNjZXNzXCIiLCJNZXRlb3IubWV0aG9kcyh7XG4gIGJpbGxpbmdfcmVjaGFyZ2U6IGZ1bmN0aW9uKHRvdGFsX2ZlZSwgc3BhY2VfaWQsIG5ld19pZCwgbW9kdWxlX25hbWVzLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICAgIHZhciBXWFBheSwgYXR0YWNoLCBsaXN0cHJpY2VzLCBvbmVfbW9udGhfeXVhbiwgb3JkZXJfYm9keSwgcmVzdWx0X29iaiwgc3BhY2UsIHNwYWNlX3VzZXJfY291bnQsIHVzZXJfaWQsIHd4cGF5O1xuICAgIGNoZWNrKHRvdGFsX2ZlZSwgTnVtYmVyKTtcbiAgICBjaGVjayhzcGFjZV9pZCwgU3RyaW5nKTtcbiAgICBjaGVjayhuZXdfaWQsIFN0cmluZyk7XG4gICAgY2hlY2sobW9kdWxlX25hbWVzLCBBcnJheSk7XG4gICAgY2hlY2soZW5kX2RhdGUsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcl9jb3VudCwgTnVtYmVyKTtcbiAgICB1c2VyX2lkID0gdGhpcy51c2VySWQ7XG4gICAgbGlzdHByaWNlcyA9IDA7XG4gICAgb3JkZXJfYm9keSA9IFtdO1xuICAgIGRiLm1vZHVsZXMuZmluZCh7XG4gICAgICBuYW1lOiB7XG4gICAgICAgICRpbjogbW9kdWxlX25hbWVzXG4gICAgICB9XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgICBsaXN0cHJpY2VzICs9IG0ubGlzdHByaWNlX3JtYjtcbiAgICAgIHJldHVybiBvcmRlcl9ib2R5LnB1c2gobS5uYW1lX3poKTtcbiAgICB9KTtcbiAgICBzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKTtcbiAgICBpZiAoIXNwYWNlLmlzX3BhaWQpIHtcbiAgICAgIHNwYWNlX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgICB9KS5jb3VudCgpO1xuICAgICAgb25lX21vbnRoX3l1YW4gPSBzcGFjZV91c2VyX2NvdW50ICogbGlzdHByaWNlcztcbiAgICAgIGlmICh0b3RhbF9mZWUgPCBvbmVfbW9udGhfeXVhbiAqIDEwMCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlcnJvciEnLCBcIuWFheWAvOmHkemineW6lOS4jeWwkeS6juS4gOS4quaciOaJgOmcgOi0ueeUqO+8mu+/pVwiICsgb25lX21vbnRoX3l1YW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHRfb2JqID0ge307XG4gICAgYXR0YWNoID0ge307XG4gICAgYXR0YWNoLmNvZGVfdXJsX2lkID0gbmV3X2lkO1xuICAgIFdYUGF5ID0gcmVxdWlyZSgnd2VpeGluLXBheScpO1xuICAgIHd4cGF5ID0gV1hQYXkoe1xuICAgICAgYXBwaWQ6IE1ldGVvci5zZXR0aW5ncy5iaWxsaW5nLmFwcGlkLFxuICAgICAgbWNoX2lkOiBNZXRlb3Iuc2V0dGluZ3MuYmlsbGluZy5tY2hfaWQsXG4gICAgICBwYXJ0bmVyX2tleTogTWV0ZW9yLnNldHRpbmdzLmJpbGxpbmcucGFydG5lcl9rZXlcbiAgICB9KTtcbiAgICB3eHBheS5jcmVhdGVVbmlmaWVkT3JkZXIoe1xuICAgICAgYm9keTogb3JkZXJfYm9keS5qb2luKFwiLFwiKSxcbiAgICAgIG91dF90cmFkZV9ubzogbW9tZW50KCkuZm9ybWF0KCdZWVlZTU1EREhIbW1zc1NTUycpLFxuICAgICAgdG90YWxfZmVlOiB0b3RhbF9mZWUsXG4gICAgICBzcGJpbGxfY3JlYXRlX2lwOiAnMTI3LjAuMC4xJyxcbiAgICAgIG5vdGlmeV91cmw6IE1ldGVvci5hYnNvbHV0ZVVybCgpICsgJ2FwaS9iaWxsaW5nL3JlY2hhcmdlL25vdGlmeScsXG4gICAgICB0cmFkZV90eXBlOiAnTkFUSVZFJyxcbiAgICAgIHByb2R1Y3RfaWQ6IG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NRERISG1tc3NTU1MnKSxcbiAgICAgIGF0dGFjaDogSlNPTi5zdHJpbmdpZnkoYXR0YWNoKVxuICAgIH0sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgICB2YXIgb2JqO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5zdGFjayk7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIG9iaiA9IHt9O1xuICAgICAgICBvYmouX2lkID0gbmV3X2lkO1xuICAgICAgICBvYmouY3JlYXRlZCA9IG5ldyBEYXRlO1xuICAgICAgICBvYmouaW5mbyA9IHJlc3VsdDtcbiAgICAgICAgb2JqLnRvdGFsX2ZlZSA9IHRvdGFsX2ZlZTtcbiAgICAgICAgb2JqLmNyZWF0ZWRfYnkgPSB1c2VyX2lkO1xuICAgICAgICBvYmouc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgICAgb2JqLnBhaWQgPSBmYWxzZTtcbiAgICAgICAgb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gICAgICAgIG9iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICBvYmoudXNlcl9jb3VudCA9IHVzZXJfY291bnQ7XG4gICAgICAgIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmluc2VydChvYmopO1xuICAgICAgfVxuICAgIH0pLCBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IGJpbGxpbmdfcmVjaGFyZ2UuY29mZmVlJyk7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coZS5zdGFjayk7XG4gICAgfSkpO1xuICAgIHJldHVybiBcInN1Y2Nlc3NcIjtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdGdldF9zcGFjZV91c2VyX2NvdW50OiAoc3BhY2VfaWQpLT5cclxuXHRcdGNoZWNrIHNwYWNlX2lkLCBTdHJpbmdcclxuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3RcclxuXHRcdHVzZXJfY291bnRfaW5mby50b3RhbF91c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7c3BhY2U6IHNwYWNlX2lkfSkuY291bnQoKVxyXG5cdFx0dXNlcl9jb3VudF9pbmZvLmFjY2VwdGVkX3VzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXHJcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcclxuXHRjcmVhdGVfc2VjcmV0OiAobmFtZSktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRkYi51c2Vycy5jcmVhdGVfc2VjcmV0IHRoaXMudXNlcklkLCBuYW1lXHJcblxyXG5cdHJlbW92ZV9zZWNyZXQ6ICh0b2tlbiktPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkIHx8ICF0b2tlblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4odG9rZW4pXHJcblxyXG5cdFx0Y29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbilcclxuXHJcblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcclxuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICBjcmVhdGVfc2VjcmV0OiBmdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGIudXNlcnMuY3JlYXRlX3NlY3JldCh0aGlzLnVzZXJJZCwgbmFtZSk7XG4gIH0sXG4gIHJlbW92ZV9zZWNyZXQ6IGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuO1xuICAgIGlmICghdGhpcy51c2VySWQgfHwgIXRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKHRva2VuKTtcbiAgICBjb25zb2xlLmxvZyhcInRva2VuXCIsIHRva2VuKTtcbiAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICB9LCB7XG4gICAgICAkcHVsbDoge1xuICAgICAgICBcInNlY3JldHNcIjoge1xuICAgICAgICAgIGhhc2hlZFRva2VuOiBoYXNoZWRUb2tlblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHNcclxuICAgICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IChzcGFjZUlkLCB1c2VySWQpIC0+XHJcbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXHJcbiAgICAgICAgY2hlY2sgdXNlcklkLCBTdHJpbmdcclxuXHJcbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxyXG4gICAgICAgIGlmICFjdXJTcGFjZVVzZXJcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvciAnbm90LWF1dGhvcml6ZWQnXHJcblxyXG4gICAgICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcclxuICAgICAgICAgICAgX2lkOiB7XHJcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCB7ZmllbGRzOiB7cGFyZW50czogMX19KS5mZXRjaCgpXHJcblxyXG4gICAgICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoeyBzcGFjZTogc3BhY2VJZCB9LCB7IGZpZWxkczogeyBvYmplY3RfbmFtZTogMSwgZmxvd19pZDogMSwgc3BhY2U6IDEgfSB9KS5mZXRjaCgpXHJcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cclxuICAgICAgICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZShvLmZsb3dfaWQsIHsgZmllbGRzOiB7IG5hbWU6IDEsIHBlcm1zOiAxIH0gfSlcclxuICAgICAgICAgICAgaWYgZmxcclxuICAgICAgICAgICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZVxyXG4gICAgICAgICAgICAgICAgby5jYW5fYWRkID0gZmFsc2VcclxuXHJcbiAgICAgICAgICAgICAgICBwZXJtcyA9IGZsLnBlcm1zXHJcbiAgICAgICAgICAgICAgICBpZiBwZXJtc1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYW5fYWRkID0gXy5zb21lIG9yZ2FuaXphdGlvbnMsIChvcmcpLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDBcclxuXHJcbiAgICAgICAgb3dzID0gb3dzLmZpbHRlciAobiktPlxyXG4gICAgICAgICAgICByZXR1cm4gbi5mbG93X25hbWVcclxuXHJcbiAgICAgICAgcmV0dXJuIG93cyIsIk1ldGVvci5tZXRob2RzKHtcbiAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkKSB7XG4gICAgdmFyIGN1clNwYWNlVXNlciwgb3JnYW5pemF0aW9ucywgb3dzO1xuICAgIGNoZWNrKHNwYWNlSWQsIFN0cmluZyk7XG4gICAgY2hlY2sodXNlcklkLCBTdHJpbmcpO1xuICAgIGN1clNwYWNlVXNlciA9IENyZWF0b3IuQ29sbGVjdGlvbnNbXCJzcGFjZV91c2Vyc1wiXS5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIG9yZ2FuaXphdGlvbnM6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWN1clNwYWNlVXNlcikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWF1dGhvcml6ZWQnKTtcbiAgICB9XG4gICAgb3JnYW5pemF0aW9ucyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb3JnYW5pemF0aW9ucycpLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgcGFyZW50czogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgb3dzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvYmplY3Rfd29ya2Zsb3dzJykuZmluZCh7XG4gICAgICBzcGFjZTogc3BhY2VJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvYmplY3RfbmFtZTogMSxcbiAgICAgICAgZmxvd19pZDogMSxcbiAgICAgICAgc3BhY2U6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIF8uZWFjaChvd3MsIGZ1bmN0aW9uKG8pIHtcbiAgICAgIHZhciBmbCwgcGVybXM7XG4gICAgICBmbCA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignZmxvd3MnKS5maW5kT25lKG8uZmxvd19pZCwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBuYW1lOiAxLFxuICAgICAgICAgIHBlcm1zOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGZsKSB7XG4gICAgICAgIG8uZmxvd19uYW1lID0gZmwubmFtZTtcbiAgICAgICAgby5jYW5fYWRkID0gZmFsc2U7XG4gICAgICAgIHBlcm1zID0gZmwucGVybXM7XG4gICAgICAgIGlmIChwZXJtcykge1xuICAgICAgICAgIGlmIChwZXJtcy51c2Vyc19jYW5fYWRkICYmIHBlcm1zLnVzZXJzX2Nhbl9hZGQuaW5jbHVkZXModXNlcklkKSkge1xuICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IHRydWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChwZXJtcy5vcmdzX2Nhbl9hZGQgJiYgcGVybXMub3Jnc19jYW5fYWRkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGlmIChjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChvcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG8uY2FuX2FkZCA9IF8uc29tZShvcmdhbml6YXRpb25zLCBmdW5jdGlvbihvcmcpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvcmcucGFyZW50cyAmJiBfLmludGVyc2VjdGlvbihvcmcucGFyZW50cywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgb3dzID0gb3dzLmZpbHRlcihmdW5jdGlvbihuKSB7XG4gICAgICByZXR1cm4gbi5mbG93X25hbWU7XG4gICAgfSk7XG4gICAgcmV0dXJuIG93cztcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xyXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxyXG5cdFx0aWYgIXRoaXMudXNlcklkXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKVxyXG5cdFx0XHJcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcclxuXHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxyXG5cclxuXHRcdHVubGVzcyBpc1NwYWNlQWRtaW5cclxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpXHJcblxyXG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxyXG5cdFx0dXNlcl9pZCA9IHNwYWNlVXNlci51c2VyO1xyXG5cdFx0dXNlckNQID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcclxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXHJcblxyXG5cdFx0aWYgc3BhY2VVc2VyLmludml0ZV9zdGF0ZSA9PSBcInBlbmRpbmdcIiBvciBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicmVmdXNlZFwiXHJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxyXG5cclxuXHRcdFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZClcclxuXHJcblx0XHRBY2NvdW50cy5zZXRQYXNzd29yZCh1c2VyX2lkLCBwYXNzd29yZCwge2xvZ291dDogdHJ1ZX0pXHJcblxyXG5cdFx0IyDlpoLmnpznlKjmiLfmiYvmnLrlj7fpgJrov4fpqozor4HvvIzlsLHlj5Hnn63kv6Hmj5DphpJcclxuXHRcdGlmIHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZFxyXG5cdFx0XHRsYW5nID0gJ2VuJ1xyXG5cdFx0XHRpZiB1c2VyQ1AubG9jYWxlIGlzICd6aC1jbidcclxuXHRcdFx0XHRsYW5nID0gJ3poLUNOJ1xyXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXHJcblx0XHRcdFx0Rm9ybWF0OiAnSlNPTicsXHJcblx0XHRcdFx0QWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXHJcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxyXG5cdFx0XHRcdFJlY051bTogdXNlckNQLm1vYmlsZSxcclxuXHRcdFx0XHRTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXHJcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcclxuXHRcdFx0XHRtc2c6IFRBUGkxOG4uX18oJ3Ntcy5jaGFuZ2VfcGFzc3dvcmQudGVtcGxhdGUnLCB7fSwgbGFuZylcclxuXHJcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgc2V0U3BhY2VVc2VyUGFzc3dvcmQ6IGZ1bmN0aW9uKHNwYWNlX3VzZXJfaWQsIHNwYWNlX2lkLCBwYXNzd29yZCkge1xuICAgIHZhciBjdXJyZW50VXNlciwgaXNTcGFjZUFkbWluLCBsYW5nLCByZWYsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcl9pZDtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor7flhYjnmbvlvZVcIik7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICBpZiAoIWlzU3BhY2VBZG1pbikge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi5oKo5rKh5pyJ5p2D6ZmQ5L+u5pS56K+l55So5oi35a+G56CBXCIpO1xuICAgIH1cbiAgICBzcGFjZVVzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogc3BhY2VfdXNlcl9pZCxcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0pO1xuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIFN0ZWVkb3MudmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwgcGFzc3dvcmQsIHtcbiAgICAgIGxvZ291dDogdHJ1ZVxuICAgIH0pO1xuICAgIGlmICh1c2VyQ1AubW9iaWxlICYmIHVzZXJDUC5tb2JpbGVfdmVyaWZpZWQpIHtcbiAgICAgIGxhbmcgPSAnZW4nO1xuICAgICAgaWYgKHVzZXJDUC5sb2NhbGUgPT09ICd6aC1jbicpIHtcbiAgICAgICAgbGFuZyA9ICd6aC1DTic7XG4gICAgICB9XG4gICAgICByZXR1cm4gU01TUXVldWUuc2VuZCh7XG4gICAgICAgIEZvcm1hdDogJ0pTT04nLFxuICAgICAgICBBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcbiAgICAgICAgUGFyYW1TdHJpbmc6ICcnLFxuICAgICAgICBSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG4gICAgICAgIFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcbiAgICAgICAgVGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3JyxcbiAgICAgICAgbXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiYmlsbGluZ01hbmFnZXIgPSB7fVxyXG5cclxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcclxuIyBzcGFjZV9pZCDnu5Pnrpflr7nosaHlt6XkvZzljLpcclxuIyBhY2NvdW50aW5nX21vbnRoIOe7k+eul+aciO+8jOagvOW8j++8mllZWVlNTVxyXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cclxuXHRjb3VudF9kYXlzID0gMFxyXG5cclxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcclxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXHJcblxyXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXHJcblx0Zmlyc3RfZGF0ZSA9IGJpbGxpbmcuYmlsbGluZ19kYXRlXHJcblxyXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXHJcblx0c3RhcnRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMS1lbmRfZGF0ZV90aW1lLmdldERhdGUoKSlcclxuXHJcblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxyXG5cdFx0IyBkbyBub3RoaW5nXHJcblx0ZWxzZSBpZiBzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgYW5kIGZpcnN0X2RhdGUgPCBlbmRfZGF0ZVxyXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXHJcblx0ZWxzZSBpZiBmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZVxyXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXHJcblxyXG5cdHJldHVybiB7XCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXN9XHJcblxyXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxyXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSAoc3BhY2VfaWQsIHJlZnJlc2hfZGF0ZSktPlxyXG5cdGxhc3RfYmlsbCA9IG51bGxcclxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxyXG5cclxuXHQjIOiOt+WPluato+W4uOS7mOasvueahOWwj+S6jnJlZnJlc2hfZGF0ZeeahOacgOi/keeahOS4gOadoeiusOW9lVxyXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXHJcblx0XHR7XHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0Y3JlYXRlZDoge1xyXG5cdFx0XHRcdCRsdDogcmVmcmVzaF9kYXRlXHJcblx0XHRcdH0sXHJcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxyXG5cdFx0fSxcclxuXHRcdHtcclxuXHRcdFx0c29ydDoge1xyXG5cdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0KVxyXG5cdGlmIHBheW1lbnRfYmlsbFxyXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXHJcblx0ZWxzZVxyXG5cdFx0IyDojrflj5bmnIDmlrDnmoTnu5PnrpfnmoTkuIDmnaHorrDlvZVcclxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKVxyXG5cclxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRcdG1vZGlmaWVkOiAtMVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KVxyXG5cdFx0aWYgYXBwX2JpbGxcclxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcclxuXHJcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXHJcblxyXG5cdGRlYml0cyA9IGlmIGJpbGwuZGViaXRzIHRoZW4gYmlsbC5kZWJpdHMgZWxzZSAwLjBcclxuXHRjcmVkaXRzID0gaWYgYmlsbC5jcmVkaXRzIHRoZW4gYmlsbC5jcmVkaXRzIGVsc2UgMC4wXHJcblx0c2V0T2JqID0gbmV3IE9iamVjdFxyXG5cdHNldE9iai5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgKyBjcmVkaXRzIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxyXG5cdHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlXHJcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxyXG5cclxuIyDnu5PnrpflvZPmnIjnmoTmlK/lh7rkuI7kvZnpop1cclxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cclxuXHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKVxyXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxyXG5cclxuXHRkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzL2RheXNfbnVtYmVyKSAqIHVzZXJfY291bnQgKiBsaXN0cHJpY2UpLnRvRml4ZWQoMikpXHJcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcclxuXHRcdHtcclxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcclxuXHRcdFx0XHQkbHRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHR7XHJcblx0XHRcdHNvcnQ6IHtcclxuXHRcdFx0XHRtb2RpZmllZDogLTFcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdClcclxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcclxuXHJcblx0bm93ID0gbmV3IERhdGVcclxuXHRuZXdfYmlsbCA9IG5ldyBPYmplY3RcclxuXHRuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKClcclxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxyXG5cdG5ld19iaWxsLmJpbGxpbmdfZGF0ZSA9IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcclxuXHRuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxyXG5cdG5ld19iaWxsLmxpc3RwcmljZSA9IGxpc3RwcmljZVxyXG5cdG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50XHJcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXHJcblx0bmV3X2JpbGwuYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlIC0gZGViaXRzKS50b0ZpeGVkKDIpKVxyXG5cdG5ld19iaWxsLmNyZWF0ZWQgPSBub3dcclxuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xyXG5cdGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxyXG5cdGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XHJcblx0cmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheVxyXG5cdGRiLmJpbGxpbmdzLmZpbmQoXHJcblx0XHR7XHJcblx0XHRcdGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXHJcblx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XHJcblx0XHR9LFxyXG5cdFx0e1xyXG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cclxuXHRcdH1cclxuXHQpLmZvckVhY2ggKGJpbGwpLT5cclxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXHJcblxyXG5cdGlmIHJlZnJlc2hfZGF0ZXMubGVuZ3RoID4gMFxyXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cclxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlKHNwYWNlX2lkLCByX2QpXHJcblxyXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxyXG5cdG1vZHVsZXMgPSBuZXcgQXJyYXlcclxuXHRzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIlxyXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJylcclxuXHJcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxyXG5cdFx0bV9jaGFuZ2Vsb2cgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuZmluZE9uZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRtb2R1bGU6IG0ubmFtZSxcclxuXHRcdFx0XHRjaGFuZ2VfZGF0ZToge1xyXG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjcmVhdGVkOiAtMVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0XHQjIOiLpeacquiOt+W+l+WPr+WMuemFjeeahOiusOW9le+8jOivtOaYjuivpW1vZHVsZeacquWuieijhe+8jOW9k+aciOS4jeiuoeeul+i0ueeUqFxyXG5cdFx0aWYgbm90IG1fY2hhbmdlbG9nXHJcblx0XHRcdCMgIGRvIG5vdGhpbmdcclxuXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJxpbnN0YWxs4oCd77yM6K+05piO5b2T5pyI5YmN5bey5a6J6KOF77yM5Zug5q2k6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcclxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRlPHN0YXJ0ZGF0ZSAmIG9wZXJhdGlvbj3igJx1bmluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Lljbjovb3vvIzlm6DmraTkuI3orqHnrpfotLnnlKhcclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxyXG5cdFx0XHQjICBkbyBub3RoaW5nXHJcblx0XHQjIOiLpeivpeiusOW9leeahGNoYW5nZV9kYXRl4omlc3RhcnRkYXRl77yM6K+05piO5b2T5pyI5YaF5Y+R55Sf6L+H5a6J6KOF5oiW5Y246L2955qE5pON5L2c77yM6ZyA6K6h566X6LS555So77yM5bCGbW9kdWxlX25hbWXkuI5tb2R1bGVzLmxpc3RwcmljZeWKoOWFpW1vZHVsZXPmlbDnu4TkuK1cclxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRtb2R1bGVzLnB1c2gobSlcclxuXHJcblx0cmV0dXJuIG1vZHVsZXNcclxuXHJcbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSAoKS0+XHJcblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XHJcblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCgobSktPlxyXG5cdFx0bW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKVxyXG5cdClcclxuXHRyZXR1cm4gbW9kdWxlc19uYW1lXHJcblxyXG5cclxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IChhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCktPlxyXG5cdGlmIGFjY291bnRpbmdfbW9udGggPiAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSlcclxuXHRcdHJldHVyblxyXG5cdGlmIGFjY291bnRpbmdfbW9udGggPT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpXHJcblx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxyXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXHJcblxyXG5cdFx0ZGViaXRzID0gMFxyXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXHJcblx0XHRiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXHJcblx0XHRiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpLShiX21fZC5nZXREYXRlKCkqMjQqNjAqNjAqMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YmlsbGluZ19kYXRlOiBiX20sXHJcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxyXG5cdFx0XHRcdHRyYW5zYWN0aW9uOiB7XHJcblx0XHRcdFx0XHQkaW46IG1vZHVsZXNfbmFtZVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0KS5mb3JFYWNoKChiKS0+XHJcblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xyXG5cdFx0KVxyXG5cdFx0bmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWR9LCB7c29ydDoge21vZGlmaWVkOiAtMX19KVxyXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2VcclxuXHRcdHJlbWFpbmluZ19tb250aHMgPSAwXHJcblx0XHRpZiBiYWxhbmNlID4gMFxyXG5cdFx0XHRpZiBkZWJpdHMgPiAwXHJcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IHBhcnNlSW50KGJhbGFuY2UvZGViaXRzKSArIDFcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XHJcblx0XHRcdFx0cmVtYWluaW5nX21vbnRocyA9IDFcclxuXHJcblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcclxuXHRcdFx0e1xyXG5cdFx0XHRcdF9pZDogc3BhY2VfaWRcclxuXHRcdFx0fSxcclxuXHRcdFx0e1xyXG5cdFx0XHRcdCRzZXQ6IHtcclxuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXHJcblx0XHRcdFx0XHRcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0ZWxzZVxyXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXHJcblx0XHRwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxyXG5cdFx0aWYgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT0gMFxyXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxyXG5cdFx0XHRiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZClcclxuXHJcblx0XHRlbHNlXHJcblx0XHRcdHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZClcclxuXHJcblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXHJcblx0XHRcdG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKVxyXG5cdFx0XHRhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxyXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcclxuXHRcdFx0ZGIuYmlsbGluZ3MucmVtb3ZlKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcclxuXHRcdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcclxuXHRcdFx0XHRcdHRyYW5zYWN0aW9uOiB7XHJcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpXHJcblx0XHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXHJcblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKVxyXG5cclxuXHRcdFx0IyDnu5PnrpflvZPmnIjnmoRBUFDkvb/nlKjlkI7kvZnpop1cclxuXHRcdFx0bW9kdWxlcyA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKVxyXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxyXG5cdFx0XHRcdF8uZWFjaCBtb2R1bGVzLCAobSktPlxyXG5cdFx0XHRcdFx0YmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKVxyXG5cclxuXHRcdGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKVxyXG5cdFx0YmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKVxyXG5cclxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSAoc3BhY2VfaWQsIG1vZHVsZV9uYW1lcywgdG90YWxfZmVlLCBvcGVyYXRvcl9pZCwgZW5kX2RhdGUsIHVzZXJfY291bnQpLT5cclxuXHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlX2lkKVxyXG5cclxuXHRtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXlcclxuXHJcblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxyXG5cclxuXHRtID0gbW9tZW50KClcclxuXHRub3cgPSBtLl9kXHJcblxyXG5cdHNwYWNlX3VwZGF0ZV9vYmogPSBuZXcgT2JqZWN0XHJcblxyXG5cdCMg5pu05pawc3BhY2XmmK/lkKbkuJPkuJrniYjnmoTmoIforrBcclxuXHRpZiBzcGFjZS5pc19wYWlkIGlzbnQgdHJ1ZVxyXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxyXG5cdFx0c3BhY2VfdXBkYXRlX29iai5zdGFydF9kYXRlID0gbmV3IERhdGVcclxuXHJcblx0IyDmm7TmlrBtb2R1bGVzXHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2R1bGVzID0gbW9kdWxlX25hbWVzXHJcblx0c3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vd1xyXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxyXG5cdHNwYWNlX3VwZGF0ZV9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZShlbmRfZGF0ZSlcclxuXHRzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XHJcblxyXG5cdHIgPSBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzcGFjZV9pZH0sIHskc2V0OiBzcGFjZV91cGRhdGVfb2JqfSlcclxuXHRpZiByXHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cclxuXHRcdFx0bWNsID0gbmV3IE9iamVjdFxyXG5cdFx0XHRtY2wuX2lkID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLl9tYWtlTmV3SUQoKVxyXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXHJcblx0XHRcdG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkXHJcblx0XHRcdG1jbC5zcGFjZSA9IHNwYWNlX2lkXHJcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxyXG5cdFx0XHRtY2wubW9kdWxlID0gbW9kdWxlXHJcblx0XHRcdG1jbC5jcmVhdGVkID0gbm93XHJcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxyXG5cclxuXHRyZXR1cm4iLCIgICAgICAgICAgICAgICAgICAgXG5cbmJpbGxpbmdNYW5hZ2VyID0ge307XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZCA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKSB7XG4gIHZhciBiaWxsaW5nLCBjb3VudF9kYXlzLCBlbmRfZGF0ZSwgZW5kX2RhdGVfdGltZSwgZmlyc3RfZGF0ZSwgc3RhcnRfZGF0ZSwgc3RhcnRfZGF0ZV90aW1lO1xuICBjb3VudF9kYXlzID0gMDtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IFwiU3RhcnRpbmcgYmFsYW5jZVwiXG4gIH0pO1xuICBmaXJzdF9kYXRlID0gYmlsbGluZy5iaWxsaW5nX2RhdGU7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBzdGFydF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEgLSBlbmRfZGF0ZV90aW1lLmdldERhdGUoKSk7XG4gIGlmIChmaXJzdF9kYXRlID49IGVuZF9kYXRlKSB7XG5cbiAgfSBlbHNlIGlmIChzdGFydF9kYXRlIDw9IGZpcnN0X2RhdGUgJiYgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgY291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKSAvICgyNCAqIDYwICogNjAgKiAxMDAwKSArIDE7XG4gIH0gZWxzZSBpZiAoZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFwiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzXG4gIH07XG59O1xuXG5iaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgcmVmcmVzaF9kYXRlKSB7XG4gIHZhciBhcHBfYmlsbCwgYl9tLCBiX21fZCwgYmlsbCwgY3JlZGl0cywgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgcGF5bWVudF9iaWxsLCBzZXRPYmo7XG4gIGxhc3RfYmlsbCA9IG51bGw7XG4gIGJpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDogcmVmcmVzaF9kYXRlXG4gIH0pO1xuICBwYXltZW50X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgY3JlYXRlZDoge1xuICAgICAgJGx0OiByZWZyZXNoX2RhdGVcbiAgICB9LFxuICAgIGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuICB9LCB7XG4gICAgc29ydDoge1xuICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgfVxuICB9KTtcbiAgaWYgKHBheW1lbnRfYmlsbCkge1xuICAgIGxhc3RfYmlsbCA9IHBheW1lbnRfYmlsbDtcbiAgfSBlbHNlIHtcbiAgICBiX21fZCA9IG5ldyBEYXRlKHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGJpbGwuYmlsbGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICBhcHBfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgYmlsbGluZ19tb250aDogYl9tXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoYXBwX2JpbGwpIHtcbiAgICAgIGxhc3RfYmlsbCA9IGFwcF9iaWxsO1xuICAgIH1cbiAgfVxuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgZGViaXRzID0gYmlsbC5kZWJpdHMgPyBiaWxsLmRlYml0cyA6IDAuMDtcbiAgY3JlZGl0cyA9IGJpbGwuY3JlZGl0cyA/IGJpbGwuY3JlZGl0cyA6IDAuMDtcbiAgc2V0T2JqID0gbmV3IE9iamVjdDtcbiAgc2V0T2JqLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSArIGNyZWRpdHMgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBzZXRPYmoubW9kaWZpZWQgPSBuZXcgRGF0ZTtcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogYmlsbC5faWRcbiAgfSwge1xuICAgICRzZXQ6IHNldE9ialxuICB9KTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpIHtcbiAgdmFyIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgZGF5c19udW1iZXIsIGRlYml0cywgbGFzdF9iYWxhbmNlLCBsYXN0X2JpbGwsIG5ld19iaWxsLCBub3c7XG4gIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGRheXNfbnVtYmVyID0gYWNjb3VudGluZ19kYXRlLmdldERhdGUoKTtcbiAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICBkZWJpdHMgPSBOdW1iZXIoKChjb3VudF9kYXlzIC8gZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSk7XG4gIGxhc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBiaWxsaW5nX2RhdGU6IHtcbiAgICAgICRsdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXRcbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBsYXN0X2JhbGFuY2UgPSBsYXN0X2JpbGwgJiYgbGFzdF9iaWxsLmJhbGFuY2UgPyBsYXN0X2JpbGwuYmFsYW5jZSA6IDAuMDtcbiAgbm93ID0gbmV3IERhdGU7XG4gIG5ld19iaWxsID0gbmV3IE9iamVjdDtcbiAgbmV3X2JpbGwuX2lkID0gZGIuYmlsbGluZ3MuX21ha2VOZXdJRCgpO1xuICBuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aDtcbiAgbmV3X2JpbGwuYmlsbGluZ19kYXRlID0gYWNjb3VudGluZ19kYXRlX2Zvcm1hdDtcbiAgbmV3X2JpbGwuc3BhY2UgPSBzcGFjZV9pZDtcbiAgbmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZTtcbiAgbmV3X2JpbGwubGlzdHByaWNlID0gbGlzdHByaWNlO1xuICBuZXdfYmlsbC51c2VyX2NvdW50ID0gdXNlcl9jb3VudDtcbiAgbmV3X2JpbGwuZGViaXRzID0gZGViaXRzO1xuICBuZXdfYmlsbC5iYWxhbmNlID0gTnVtYmVyKChsYXN0X2JhbGFuY2UgLSBkZWJpdHMpLnRvRml4ZWQoMikpO1xuICBuZXdfYmlsbC5jcmVhdGVkID0gbm93O1xuICBuZXdfYmlsbC5tb2RpZmllZCA9IG5vdztcbiAgcmV0dXJuIGRiLmJpbGxpbmdzLmRpcmVjdC5pbnNlcnQobmV3X2JpbGwpO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHVzZXJfYWNjZXB0ZWQ6IHRydWVcbiAgfSkuY291bnQoKTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIHJlZnJlc2hfZGF0ZXM7XG4gIHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXk7XG4gIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgIGJpbGxpbmdfbW9udGg6IGFjY291bnRpbmdfbW9udGgsXG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAkaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl1cbiAgICB9XG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBjcmVhdGVkOiAxXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGJpbGwpIHtcbiAgICByZXR1cm4gcmVmcmVzaF9kYXRlcy5wdXNoKGJpbGwuY3JlYXRlZCk7XG4gIH0pO1xuICBpZiAocmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIF8uZWFjaChyZWZyZXNoX2RhdGVzLCBmdW5jdGlvbihyX2QpIHtcbiAgICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5yZWZyZXNoX2JhbGFuY2Uoc3BhY2VfaWQsIHJfZCk7XG4gICAgfSk7XG4gIH1cbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBtb2R1bGVzLCBzdGFydF9kYXRlO1xuICBtb2R1bGVzID0gbmV3IEFycmF5O1xuICBzdGFydF9kYXRlID0gYWNjb3VudGluZ19tb250aCArIFwiMDFcIjtcbiAgZW5kX2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gIGVuZF9kYXRlID0gbW9tZW50KGVuZF9kYXRlX3RpbWUuZ2V0VGltZSgpKS5mb3JtYXQoJ1lZWVlNTUREJyk7XG4gIGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goZnVuY3Rpb24obSkge1xuICAgIHZhciBtX2NoYW5nZWxvZztcbiAgICBtX2NoYW5nZWxvZyA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgIG1vZHVsZTogbS5uYW1lLFxuICAgICAgY2hhbmdlX2RhdGU6IHtcbiAgICAgICAgJGx0ZTogZW5kX2RhdGVcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBjcmVhdGVkOiAtMVxuICAgIH0pO1xuICAgIGlmICghbV9jaGFuZ2Vsb2cpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlICYmIG1fY2hhbmdlbG9nLm9wZXJhdGlvbiA9PT0gXCJpbnN0YWxsXCIpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcInVuaW5zdGFsbFwiKSB7XG5cbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlID49IHN0YXJ0X2RhdGUpIHtcbiAgICAgIHJldHVybiBtb2R1bGVzLnB1c2gobSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG1vZHVsZXM7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBtb2R1bGVzX25hbWU7XG4gIG1vZHVsZXNfbmFtZSA9IG5ldyBBcnJheTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgcmV0dXJuIG1vZHVsZXNfbmFtZS5wdXNoKG0ubmFtZSk7XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlc19uYW1lO1xufTtcblxuYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aCA9IGZ1bmN0aW9uKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKSB7XG4gIHZhciBhX20sIGFjY291bnRpbmdfZGF0ZSwgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCwgYl9tLCBiX21fZCwgYmFsYW5jZSwgZGViaXRzLCBtb2R1bGVzLCBtb2R1bGVzX25hbWUsIG5ld2VzdF9iaWxsLCBwZXJpb2RfcmVzdWx0LCByZW1haW5pbmdfbW9udGhzLCB1c2VyX2NvdW50O1xuICBpZiAoYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoYWNjb3VudGluZ19tb250aCA9PT0gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpO1xuICAgIGRlYml0cyA9IDA7XG4gICAgbW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpO1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgICBiX20gPSBtb21lbnQoYl9tX2QuZ2V0VGltZSgpIC0gKGJfbV9kLmdldERhdGUoKSAqIDI0ICogNjAgKiA2MCAqIDEwMDApKS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICBkYi5iaWxsaW5ncy5maW5kKHtcbiAgICAgIGJpbGxpbmdfZGF0ZTogYl9tLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgIH1cbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIHJldHVybiBkZWJpdHMgKz0gYi5kZWJpdHM7XG4gICAgfSk7XG4gICAgbmV3ZXN0X2JpbGwgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgbW9kaWZpZWQ6IC0xXG4gICAgICB9XG4gICAgfSk7XG4gICAgYmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2U7XG4gICAgcmVtYWluaW5nX21vbnRocyA9IDA7XG4gICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICBpZiAoZGViaXRzID4gMCkge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gcGFyc2VJbnQoYmFsYW5jZSAvIGRlYml0cykgKyAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nX21vbnRocyA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgJHNldDoge1xuICAgICAgICBiYWxhbmNlOiBiYWxhbmNlLFxuICAgICAgICBcImJpbGxpbmcucmVtYWluaW5nX21vbnRoc1wiOiByZW1haW5pbmdfbW9udGhzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgaWYgKHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdID09PSAwKSB7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJfY291bnQgPSBiaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudChzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgICAgYWNjb3VudGluZ19kYXRlX2Zvcm1hdCA9IG1vbWVudChhY2NvdW50aW5nX2RhdGUpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgZGIuYmlsbGluZ3MucmVtb3ZlKHtcbiAgICAgICAgYmlsbGluZ19kYXRlOiBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LFxuICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgIHRyYW5zYWN0aW9uOiB7XG4gICAgICAgICAgJGluOiBtb2R1bGVzX25hbWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgICBtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpO1xuICAgICAgaWYgKG1vZHVsZXMgJiYgbW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIF8uZWFjaChtb2R1bGVzLCBmdW5jdGlvbihtKSB7XG4gICAgICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLmdldF9iYWxhbmNlKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoLCB1c2VyX2NvdW50LCBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSwgbS5uYW1lLCBtLmxpc3RwcmljZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICBhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAxKS5nZXRUaW1lKCkpLmZvcm1hdChcIllZWVlNTVwiKTtcbiAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuY2FjdWxhdGVfYnlfYWNjb3VudGluZ19tb250aChhX20sIHNwYWNlX2lkKTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuc3BlY2lhbF9wYXkgPSBmdW5jdGlvbihzcGFjZV9pZCwgbW9kdWxlX25hbWVzLCB0b3RhbF9mZWUsIG9wZXJhdG9yX2lkLCBlbmRfZGF0ZSwgdXNlcl9jb3VudCkge1xuICB2YXIgbSwgbW9kdWxlcywgbmV3X21vZHVsZXMsIG5vdywgciwgc3BhY2UsIHNwYWNlX3VwZGF0ZV9vYmo7XG4gIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpO1xuICBtb2R1bGVzID0gc3BhY2UubW9kdWxlcyB8fCBuZXcgQXJyYXk7XG4gIG5ld19tb2R1bGVzID0gXy5kaWZmZXJlbmNlKG1vZHVsZV9uYW1lcywgbW9kdWxlcyk7XG4gIG0gPSBtb21lbnQoKTtcbiAgbm93ID0gbS5fZDtcbiAgc3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3Q7XG4gIGlmIChzcGFjZS5pc19wYWlkICE9PSB0cnVlKSB7XG4gICAgc3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZTtcbiAgICBzcGFjZV91cGRhdGVfb2JqLnN0YXJ0X2RhdGUgPSBuZXcgRGF0ZTtcbiAgfVxuICBzcGFjZV91cGRhdGVfb2JqLm1vZHVsZXMgPSBtb2R1bGVfbmFtZXM7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWQgPSBub3c7XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZDtcbiAgc3BhY2VfdXBkYXRlX29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlKGVuZF9kYXRlKTtcbiAgc3BhY2VfdXBkYXRlX29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgciA9IGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICBfaWQ6IHNwYWNlX2lkXG4gIH0sIHtcbiAgICAkc2V0OiBzcGFjZV91cGRhdGVfb2JqXG4gIH0pO1xuICBpZiAocikge1xuICAgIF8uZWFjaChuZXdfbW9kdWxlcywgZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICB2YXIgbWNsO1xuICAgICAgbWNsID0gbmV3IE9iamVjdDtcbiAgICAgIG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpO1xuICAgICAgbWNsLmNoYW5nZV9kYXRlID0gbS5mb3JtYXQoXCJZWVlZTU1ERFwiKTtcbiAgICAgIG1jbC5vcGVyYXRvciA9IG9wZXJhdG9yX2lkO1xuICAgICAgbWNsLnNwYWNlID0gc3BhY2VfaWQ7XG4gICAgICBtY2wub3BlcmF0aW9uID0gXCJpbnN0YWxsXCI7XG4gICAgICBtY2wubW9kdWxlID0gbW9kdWxlO1xuICAgICAgbWNsLmNyZWF0ZWQgPSBub3c7XG4gICAgICByZXR1cm4gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmluc2VydChtY2wpO1xuICAgIH0pO1xuICB9XG59O1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xyXG5cclxuICBpZiAoTWV0ZW9yLnNldHRpbmdzLmNyb24gJiYgTWV0ZW9yLnNldHRpbmdzLmNyb24uc3RhdGlzdGljcykge1xyXG5cclxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcclxuICAgIC8vIOWumuaXtuaJp+ihjOe7n+iuoVxyXG4gICAgdmFyIHJ1bGUgPSBNZXRlb3Iuc2V0dGluZ3MuY3Jvbi5zdGF0aXN0aWNzO1xyXG5cclxuICAgIHZhciBnb19uZXh0ID0gdHJ1ZTtcclxuXHJcbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKCFnb19uZXh0KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xyXG5cclxuICAgICAgY29uc29sZS50aW1lKCdzdGF0aXN0aWNzJyk7XHJcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcclxuICAgICAgdmFyIGRhdGVGb3JtYXQgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICAgIHZhciBkYXRla2V5ID0gXCJcIitkYXRlLmdldEZ1bGxZZWFyKCkrXCItXCIrKGRhdGUuZ2V0TW9udGgoKSsxKStcIi1cIisoZGF0ZS5nZXREYXRlKCkpO1xyXG4gICAgICAgIHJldHVybiBkYXRla2V5O1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDorqHnrpfliY3kuIDlpKnml7bpl7RcclxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZE5vdyA9IG5ldyBEYXRlKCk7ICAgLy/lvZPliY3ml7bpl7RcclxuICAgICAgICB2YXIgZEJlZm9yZSA9IG5ldyBEYXRlKGROb3cuZ2V0VGltZSgpIC0gMjQqMzYwMCoxMDAwKTsgICAvL+W+l+WIsOWJjeS4gOWkqeeahOaXtumXtFxyXG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDnu5/orqHlvZPml6XmlbDmja5cclxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIHN0YXRpY3MgPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjpzcGFjZVtcIl9pZFwiXSxcImNyZWF0ZWRcIjp7JGd0OiB5ZXN0ZXJEYXkoKX19KTtcclxuICAgICAgICByZXR1cm4gc3RhdGljcy5jb3VudCgpO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmn6Xor6LmgLvmlbBcclxuICAgICAgdmFyIHN0YXRpY3NDb3VudCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRpY3MuY291bnQoKTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXHJcbiAgICAgIHZhciBvd25lck5hbWUgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgb3duZXIgPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1wiX2lkXCI6IHNwYWNlW1wib3duZXJcIl19KTtcclxuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xyXG4gICAgICB2YXIgbGFzdExvZ29uID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XHJcbiAgICAgICAgdmFyIGxhc3RMb2dvbiA9IDA7XHJcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXHJcbiAgICAgICAgc1VzZXJzLmZvckVhY2goZnVuY3Rpb24gKHNVc2VyKSB7XHJcbiAgICAgICAgICB2YXIgdXNlciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjpzVXNlcltcInVzZXJcIl19KTtcclxuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xyXG4gICAgICAgICAgICBsYXN0TG9nb24gPSB1c2VyLmxhc3RfbG9nb247XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gbGFzdExvZ29uO1xyXG4gICAgICB9O1xyXG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cclxuICAgICAgdmFyIGxhc3RNb2RpZmllZCA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBvYmogPSBjb2xsZWN0aW9uLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGxpbWl0OiAxfSk7XHJcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xyXG4gICAgICAgIGlmKG9iakFyci5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgdmFyIG1vZCA9IG9iakFyclswXS5tb2RpZmllZDtcclxuICAgICAgICAgIHJldHVybiBtb2Q7XHJcbiAgICAgIH07XHJcbiAgICAgIC8vIOaWh+eroOmZhOS7tuWkp+Wwj1xyXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xyXG4gICAgICAgIHZhciBhdHRTaXplID0gMDtcclxuICAgICAgICB2YXIgc2l6ZVN1bSA9IDA7XHJcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XHJcbiAgICAgICAgcG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xyXG4gICAgICAgICAgdmFyIGF0dHMgPSBjZnMucG9zdHMuZmluZCh7XCJwb3N0XCI6cG9zdFtcIl9pZFwiXX0pO1xyXG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcclxuICAgICAgICAgICAgYXR0U2l6ZSA9IGF0dC5vcmlnaW5hbC5zaXplO1xyXG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XHJcbiAgICAgICAgICB9KSAgXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5b2T5pel5paw5aKe6ZmE5Lu25aSn5bCPXHJcbiAgICAgIHZhciBkYWlseVBvc3RzQXR0YWNobWVudHMgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcclxuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XHJcbiAgICAgICAgdmFyIHNpemVTdW0gPSAwO1xyXG4gICAgICAgIHZhciBwb3N0cyA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0pO1xyXG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcclxuICAgICAgICAgIHZhciBhdHRzID0gY2ZzLnBvc3RzLmZpbmQoe1wicG9zdFwiOiBwb3N0W1wiX2lkXCJdLCBcInVwbG9hZGVkQXRcIjogeyRndDogeWVzdGVyRGF5KCl9fSk7XHJcbiAgICAgICAgICBhdHRzLmZvckVhY2goZnVuY3Rpb24gKGF0dCkge1xyXG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XHJcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICByZXR1cm4gc2l6ZVN1bTtcclxuICAgICAgfTtcclxuICAgICAgLy8g5o+S5YWl5pWw5o2uXHJcbiAgICAgIGRiLnNwYWNlcy5maW5kKHtcImlzX3BhaWRcIjp0cnVlfSkuZm9yRWFjaChmdW5jdGlvbiAoc3BhY2UpIHtcclxuICAgICAgICBkYi5zdGVlZG9zX3N0YXRpc3RpY3MuaW5zZXJ0KHtcclxuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcclxuICAgICAgICAgIHNwYWNlX25hbWU6IHNwYWNlW1wibmFtZVwiXSxcclxuICAgICAgICAgIGJhbGFuY2U6IHNwYWNlW1wiYmFsYW5jZVwiXSxcclxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxyXG4gICAgICAgICAgY3JlYXRlZDogbmV3IERhdGUoKSxcclxuICAgICAgICAgIHN0ZWVkb3M6e1xyXG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHN0YXRpY3NDb3VudChkYi5vcmdhbml6YXRpb25zLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGxhc3RfbG9nb246IGxhc3RMb2dvbihkYi51c2Vycywgc3BhY2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgd29ya2Zsb3c6e1xyXG4gICAgICAgICAgICBmbG93czogc3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZmxvd19yb2xlczogc3RhdGljc0NvdW50KGRiLmZsb3dfcm9sZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZmxvd19wb3NpdGlvbnM6IHN0YXRpY3NDb3VudChkYi5mbG93X3Bvc2l0aW9ucywgc3BhY2UpLFxyXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgaW5zdGFuY2VzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfZmxvd3M6IGRhaWx5U3RhdGljc0NvdW50KGRiLmZsb3dzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9pbnN0YW5jZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmluc3RhbmNlcywgc3BhY2UpXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgY21zOiB7XHJcbiAgICAgICAgICAgIHNpdGVzOiBzdGF0aWNzQ291bnQoZGIuY21zX3NpdGVzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzOiBzdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogcG9zdHNBdHRhY2htZW50cyhkYi5jbXNfcG9zdHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgY29tbWVudHM6IHN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxyXG4gICAgICAgICAgICBkYWlseV9wb3N0czogZGFpbHlTdGF0aWNzQ291bnQoZGIuY21zX3Bvc3RzLCBzcGFjZSksXHJcbiAgICAgICAgICAgIGRhaWx5X2NvbW1lbnRzOiBkYWlseVN0YXRpY3NDb3VudChkYi5jbXNfY29tbWVudHMsIHNwYWNlKSxcclxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBcclxuICAgICAgY29uc29sZS50aW1lRW5kKCdzdGF0aXN0aWNzJyk7XHJcblxyXG4gICAgICBnb19uZXh0ID0gdHJ1ZTtcclxuXHJcbiAgICB9LCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnRmFpbGVkIHRvIGJpbmQgZW52aXJvbm1lbnQ6IHN0YXRpc3RpY3MuanMnKTtcclxuICAgICAgY29uc29sZS5sb2coZS5zdGFjayk7XHJcbiAgICB9KSk7XHJcblxyXG4gIH1cclxuXHJcbn0pXHJcblxyXG5cclxuXHJcblxyXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiAxXHJcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IChwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCktPlxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhID0ge3BhcmVudDogcGFyZW50X2lkLCBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSwgb3duZXJfbmFtZTogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnlfbmFtZSddLCBzcGFjZTogc3BhY2VfaWQsIGluc3RhbmNlOiBpbnN0YW5jZV9pZCwgYXBwcm92ZTogYXR0YWNoX3ZlcnNpb25bJ2FwcHJvdmUnXX1cclxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEuY3VycmVudCA9IHRydWVcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXHJcbiAgICAgICAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgICAgICAgZGIuaW5zdGFuY2VzLmZpbmQoe1wiYXR0YWNobWVudHMuY3VycmVudFwiOiB7JGV4aXN0czogdHJ1ZX19LCB7c29ydDoge21vZGlmaWVkOiAtMX0sIGZpZWxkczoge3NwYWNlOiAxLCBhdHRhY2htZW50czogMX19KS5mb3JFYWNoIChpbnMpIC0+XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlX2lkID0gaW5zLnNwYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkXHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRfaWQgPSBjdXJyZW50X3Zlci5fcmV2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgYXR0Lmhpc3RvcnlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGhpcywgZmFsc2UpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGkrK1xyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJykiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAxLFxuICAgIG5hbWU6ICflnKjnur/nvJbovpHml7bvvIzpnIDnu5nmlofku7blop7liqBsb2NrIOWxnuaAp++8jOmYsuatouWkmuS6uuWQjOaXtue8lui+kSAjNDI5LCDpmYTku7bpobXpnaLkvb/nlKhjZnPmmL7npLonLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBpLCB1cGRhdGVfY2ZzX2luc3RhbmNlO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdXBkYXRlX2Nmc19pbnN0YW5jZSA9IGZ1bmN0aW9uKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBhdHRhY2hfdmVyc2lvbiwgaXNDdXJyZW50KSB7XG4gICAgICAgICAgdmFyIG1ldGFkYXRhO1xuICAgICAgICAgIG1ldGFkYXRhID0ge1xuICAgICAgICAgICAgcGFyZW50OiBwYXJlbnRfaWQsXG4gICAgICAgICAgICBvd25lcjogYXR0YWNoX3ZlcnNpb25bJ2NyZWF0ZWRfYnknXSxcbiAgICAgICAgICAgIG93bmVyX25hbWU6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5X25hbWUnXSxcbiAgICAgICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZV9pZCxcbiAgICAgICAgICAgIGFwcHJvdmU6IGF0dGFjaF92ZXJzaW9uWydhcHByb3ZlJ11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpc0N1cnJlbnQpIHtcbiAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gY2ZzLmluc3RhbmNlcy51cGRhdGUoe1xuICAgICAgICAgICAgX2lkOiBhdHRhY2hfdmVyc2lvblsnX3JldiddXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICBtZXRhZGF0YTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIGRiLmluc3RhbmNlcy5maW5kKHtcbiAgICAgICAgICBcImF0dGFjaG1lbnRzLmN1cnJlbnRcIjoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBzcGFjZTogMSxcbiAgICAgICAgICAgIGF0dGFjaG1lbnRzOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGlucykge1xuICAgICAgICAgIHZhciBhdHRhY2hzLCBpbnN0YW5jZV9pZCwgc3BhY2VfaWQ7XG4gICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50cztcbiAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZTtcbiAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWQ7XG4gICAgICAgICAgYXR0YWNocy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRfdmVyLCBwYXJlbnRfaWQ7XG4gICAgICAgICAgICBjdXJyZW50X3ZlciA9IGF0dC5jdXJyZW50O1xuICAgICAgICAgICAgcGFyZW50X2lkID0gY3VycmVudF92ZXIuX3JldjtcbiAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKTtcbiAgICAgICAgICAgIGlmIChhdHQuaGlzdG9yeXMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGF0dC5oaXN0b3J5cy5mb3JFYWNoKGZ1bmN0aW9uKGhpcykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuIGkrKztcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX2Nmc19pbnN0YW5jZScpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogMlxyXG4gICAgICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OSdcclxuICAgICAgICB1cDogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcclxuICAgICAgICAgICAgY29uc29sZS50aW1lICd1cGdyYWRlX3NwYWNlX3VzZXInXHJcbiAgICAgICAgICAgIHRyeVxyXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe29yZ2FuaXphdGlvbnM6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uOiAxfX0pLmZvckVhY2ggKHN1KS0+XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgc3Uub3JnYW5pemF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcclxuXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX3NwYWNlX3VzZXInXHJcbiAgICAgICAgZG93bjogLT5cclxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiAyLFxuICAgIG5hbWU6ICfnu4Tnu4fnu5PmnoTlhYHorrjkuIDkuKrkurrlsZ7kuo7lpJrkuKrpg6jpl6ggIzM3OScsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAyIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICBvcmdhbml6YXRpb246IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICBpZiAoc3Uub3JnYW5pemF0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5kaXJlY3QudXBkYXRlKHN1Ll9pZCwge1xuICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfc3BhY2VfdXNlcicpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gMiBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIE1pZ3JhdGlvbnMuYWRkXHJcbiAgICAgICAgdmVyc2lvbjogM1xyXG4gICAgICAgIG5hbWU6ICfnu5lzcGFjZV91c2Vyc+ihqGVtYWls5a2X5q616LWL5YC8J1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcclxuICAgICAgICAgICAgdHJ5XHJcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnNcclxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZmluZCh7ZW1haWw6IHskZXhpc3RzOiBmYWxzZX19LCB7ZmllbGRzOiB7dXNlcjogMX19KS5mb3JFYWNoIChzdSktPlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDogc3UudXNlcn0sIHtmaWVsZHM6IHtlbWFpbHM6IDF9fSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgdSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7JHNldDoge2VtYWlsOiBhZGRyZXNzfX0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgY2F0Y2ggZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCdcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiAzIGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDMsXG4gICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uLCBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gMyB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbGxlY3Rpb24gPSBkYi5zcGFjZV91c2VycztcbiAgICAgICAgY29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICBlbWFpbDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIHVzZXI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24oc3UpIHtcbiAgICAgICAgICB2YXIgYWRkcmVzcywgdTtcbiAgICAgICAgICBpZiAoc3UudXNlcikge1xuICAgICAgICAgICAgdSA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICBfaWQ6IHN1LnVzZXJcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgZW1haWxzOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHUgJiYgdS5lbWFpbHMgJiYgdS5lbWFpbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAoL14oW0EtWjAtOVxcLlxcLVxcX1xcK10pKihbQS1aMC05XFwrXFwtXFxfXSkrXFxAW0EtWjAtOV0rKFtcXC1dW0EtWjAtOV0rKSooW1xcLl1bQS1aMC05XFwtXSspezEsOH0kL2kudGVzdCh1LmVtYWlsc1swXS5hZGRyZXNzKSkge1xuICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIGVtYWlsOiBhZGRyZXNzXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAzIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgTWlncmF0aW9ucy5hZGRcclxuICAgICAgICB2ZXJzaW9uOiA0XHJcbiAgICAgICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJ1xyXG4gICAgICAgIHVwOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IHVwJ1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xyXG4gICAgICAgICAgICB0cnlcclxuICAgICAgICAgICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7c29ydF9ubzogeyRleGlzdHM6IGZhbHNlfX0sIHskc2V0OiB7c29ydF9ubzogMTAwfX0sIHttdWx0aTogdHJ1ZX0pXHJcbiAgICAgICAgICAgIGNhdGNoIGVcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kICd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubydcclxuICAgICAgICBkb3duOiAtPlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyAndmVyc2lvbiA0IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDQsXG4gICAgbmFtZTogJ+e7mW9yZ2FuaXphdGlvbnPooajorr7nva5zb3J0X25vJyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgc29ydF9ubzoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICBzb3J0X25vOiAxMDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA0IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdE1pZ3JhdGlvbnMuYWRkXHJcblx0XHR2ZXJzaW9uOiA1XHJcblx0XHRuYW1lOiAn6Kej5Yaz5Yig6Zmkb3JnYW5pemF0aW9u5a+86Ie0c3BhY2VfdXNlcuaVsOaNrumUmeivr+eahOmXrumimCdcclxuXHRcdHVwOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IHVwJ1xyXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXHJcblx0XHRcdHRyeVxyXG5cclxuXHRcdFx0XHRkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaCAoc3UpLT5cclxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cdFx0XHRcdFx0aWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggaXMgMVxyXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXHJcblx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcclxuXHRcdFx0XHRcdFx0XHRyb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7c3BhY2U6IHN1LnNwYWNlLCBwYXJlbnQ6IG51bGx9KVxyXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXHJcblx0XHRcdFx0XHRcdFx0XHRyID0gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLCBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZH19KVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYgclxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXHJcblx0XHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIlxyXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcclxuXHRcdFx0XHRcdGVsc2UgaWYgc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxXHJcblx0XHRcdFx0XHRcdHJlbW92ZWRfb3JnX2lkcyA9IFtdXHJcblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxyXG5cdFx0XHRcdFx0XHRcdGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXHJcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxyXG5cdFx0XHRcdFx0XHRpZiByZW1vdmVkX29yZ19pZHMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdFx0XHRcdG5ld19vcmdfaWRzID0gXy5kaWZmZXJlbmNlKHN1Lm9yZ2FuaXphdGlvbnMsIHJlbW92ZWRfb3JnX2lkcylcclxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXHJcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHN9fSlcclxuXHRcdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcclxuXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXHJcblx0XHRcdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXHJcblxyXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXHJcblx0XHRkb3duOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA1IGRvd24nXHJcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRNaWdyYXRpb25zLmFkZFxyXG5cdFx0dmVyc2lvbjogNlxyXG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcclxuXHRcdHVwOiAtPlxyXG5cdFx0XHRjb25zb2xlLmxvZyAndmVyc2lvbiA2IHVwJ1xyXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0IyDmuIXnqbptb2R1bGVz6KGoXHJcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAxLjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMlxyXG5cdFx0XHRcdH0pXHJcblxyXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcclxuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXHJcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxyXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZVwiOiAzLjAsXHJcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogMThcclxuXHRcdFx0XHR9KVxyXG5cclxuXHRcdFx0XHRkYi5tb2R1bGVzLmluc2VydCh7XHJcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZV9lblwiOiBcIldvcmtmbG93IEVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcclxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogNi4wLFxyXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2Vfcm1iXCI6IDQwXHJcblx0XHRcdFx0fSlcclxuXHJcblxyXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXHJcblx0XHRcdFx0ZGIuc3BhY2VzLmZpbmQoe2lzX3BhaWQ6IHRydWUsIHVzZXJfbGltaXQ6IHskZXhpc3RzOiBmYWxzZX0sIG1vZHVsZXM6IHskZXhpc3RzOiB0cnVlfX0pLmZvckVhY2ggKHMpLT5cclxuXHRcdFx0XHRcdHRyeVxyXG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cclxuXHRcdFx0XHRcdFx0dXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzLl9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcclxuXHRcdFx0XHRcdFx0c2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudFxyXG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXHJcblx0XHRcdFx0XHRcdGlmIGJhbGFuY2UgPiAwXHJcblx0XHRcdFx0XHRcdFx0bW9udGhzID0gMFxyXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXHJcblx0XHRcdFx0XHRcdFx0Xy5lYWNoIHMubW9kdWxlcywgKHBtKS0+XHJcblx0XHRcdFx0XHRcdFx0XHRtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe25hbWU6IHBtfSlcclxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2VcclxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSBwYXJzZUludCgoYmFsYW5jZS8obGlzdHByaWNlcyp1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDFcclxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSttb250aHMpXHJcblx0XHRcdFx0XHRcdFx0ZW5kX2RhdGUgPSBuZXcgRGF0ZShtb21lbnQoZW5kX2RhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxyXG5cdFx0XHRcdFx0XHRcdHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZVxyXG5cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcclxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLnN0YXJ0X2RhdGUgPSBzdGFydF9kYXRlXHJcblx0XHRcdFx0XHRcdFx0c2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlXHJcblxyXG5cdFx0XHRcdFx0XHRzLm1vZHVsZXMucHVzaChcIndvcmtmbG93LnN0YW5kYXJkXCIpXHJcblx0XHRcdFx0XHRcdHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpXHJcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxyXG5cdFx0XHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyBzcGFjZSB1cGdyYWRlXCJcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzZXRfb2JqKVxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiYmlsbGluZyB1cGdyYWRlXCJcclxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcclxuXHJcblx0XHRcdGNvbnNvbGUudGltZUVuZCAnYmlsbGluZyB1cGdyYWRlJ1xyXG5cdFx0ZG93bjogLT5cclxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNiBkb3duJ1xyXG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIE1pZ3JhdGlvbnMuYWRkKHtcbiAgICB2ZXJzaW9uOiA2LFxuICAgIG5hbWU6ICfotKLliqHns7vnu5/ljYfnuqcnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlLCBzdGFydF9kYXRlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNiB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRiLm1vZHVsZXMucmVtb3ZlKHt9KTtcbiAgICAgICAgZGIubW9kdWxlcy5pbnNlcnQoe1xuICAgICAgICAgIFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG4gICAgICAgICAgXCJsaXN0cHJpY2VcIjogMS4wLFxuICAgICAgICAgIFwibGlzdHByaWNlX3JtYlwiOiAyXG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBQcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ3b3JrZmxvdy5wcm9mZXNzaW9uYWxcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkuJPkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAzLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDE4XG4gICAgICAgIH0pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5lbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgRW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovkvIHkuJrniYjmianlsZXljIVcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiA2LjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDQwXG4gICAgICAgIH0pO1xuICAgICAgICBzdGFydF9kYXRlID0gbmV3IERhdGUobW9tZW50KG5ldyBEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgZGIuc3BhY2VzLmZpbmQoe1xuICAgICAgICAgIGlzX3BhaWQ6IHRydWUsXG4gICAgICAgICAgdXNlcl9saW1pdDoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmZvckVhY2goZnVuY3Rpb24ocykge1xuICAgICAgICAgIHZhciBiYWxhbmNlLCBlLCBlbmRfZGF0ZSwgbGlzdHByaWNlcywgbW9udGhzLCBzZXRfb2JqLCB1c2VyX2NvdW50O1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzZXRfb2JqID0ge307XG4gICAgICAgICAgICB1c2VyX2NvdW50ID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgICAgICAgICAgIHNwYWNlOiBzLl9pZCxcbiAgICAgICAgICAgICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICAgICAgICAgICAgfSkuY291bnQoKTtcbiAgICAgICAgICAgIHNldF9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnQ7XG4gICAgICAgICAgICBiYWxhbmNlID0gcy5iYWxhbmNlO1xuICAgICAgICAgICAgaWYgKGJhbGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgIG1vbnRocyA9IDA7XG4gICAgICAgICAgICAgIGxpc3RwcmljZXMgPSAwO1xuICAgICAgICAgICAgICBfLmVhY2gocy5tb2R1bGVzLCBmdW5jdGlvbihwbSkge1xuICAgICAgICAgICAgICAgIHZhciBtb2R1bGU7XG4gICAgICAgICAgICAgICAgbW9kdWxlID0gZGIubW9kdWxlcy5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IHBtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKG1vZHVsZSAmJiBtb2R1bGUubGlzdHByaWNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlIC8gKGxpc3RwcmljZXMgKiB1c2VyX2NvdW50KSkudG9GaXhlZCgpKSArIDE7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGU7XG4gICAgICAgICAgICAgIGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkgKyBtb250aHMpO1xuICAgICAgICAgICAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSk7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBlbmRfZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYmFsYW5jZSA8PSAwKSB7XG4gICAgICAgICAgICAgIHNldF9vYmouc3RhcnRfZGF0ZSA9IHN0YXJ0X2RhdGU7XG4gICAgICAgICAgICAgIHNldF9vYmouZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMubW9kdWxlcy5wdXNoKFwid29ya2Zsb3cuc3RhbmRhcmRcIik7XG4gICAgICAgICAgICBzZXRfb2JqLm1vZHVsZXMgPSBfLnVuaXEocy5tb2R1bGVzKTtcbiAgICAgICAgICAgIHJldHVybiBkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgIF9pZDogcy5faWRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgJHNldDogc2V0X29ialxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIik7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHMuX2lkKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Ioc2V0X29iaik7XG4gICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlLnN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiYmlsbGluZyB1cGdyYWRlXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnYmlsbGluZyB1cGdyYWRlJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiA2IGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcbiAgICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKClcclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzXHJcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcyA9IHtcclxuICAgICAgICAgICAgXCJjcmVhdG9yXCI6IHtcclxuICAgICAgICAgICAgICAgIFwidXJsXCI6IHJvb3RVUkxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJ3b3JrZmxvd1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgaWYgIU1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvclxyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvciA9IHtcclxuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgIH1cclxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93XHJcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy53b3JrZmxvdyA9IHtcclxuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxyXG4gICAgICAgIH1cclxuXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxyXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMXHJcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy53b3JrZmxvdy51cmxcclxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLndvcmtmbG93LnVybCA9IHJvb3RVUkwiLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJvb3RVUkw7XG4gIHJvb3RVUkwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMgPSB7XG4gICAgICBcImNyZWF0b3JcIjoge1xuICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICB9LFxuICAgICAgXCJ3b3JrZmxvd1wiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93KSB7XG4gICAgTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93ID0ge1xuICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgIH07XG4gIH1cbiAgaWYgKCFNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvci51cmwgPSByb290VVJMO1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLndvcmtmbG93LnVybCkge1xuICAgIHJldHVybiBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMud29ya2Zsb3cudXJsID0gcm9vdFVSTDtcbiAgfVxufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XHJcblx0bmV3IFRhYnVsYXIuVGFibGVcclxuXHRcdG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcclxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXHJcblx0XHRjb2x1bW5zOiBbXHJcblx0XHRcdHtcclxuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxyXG5cdFx0XHRcdG9yZGVyYWJsZTogZmFsc2VcclxuXHRcdFx0fVxyXG5cdFx0XVxyXG5cdFx0ZG9tOiBcInRwXCJcclxuXHRcdGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXVxyXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxyXG5cdFx0b3JkZXJpbmc6IGZhbHNlXHJcblx0XHRwYWdlTGVuZ3RoOiAxMFxyXG5cdFx0aW5mbzogZmFsc2VcclxuXHRcdHNlYXJjaGluZzogdHJ1ZVxyXG5cdFx0YXV0b1dpZHRoOiB0cnVlXHJcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XHJcblx0XHRcdHVubGVzcyB1c2VySWRcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2VcclxuXHRcdFx0dW5sZXNzIHNwYWNlXHJcblx0XHRcdFx0aWYgc2VsZWN0b3I/LiRhbmQ/Lmxlbmd0aCA+IDBcclxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxyXG5cdFx0XHR1bmxlc3Mgc3BhY2VcclxuXHRcdFx0XHRyZXR1cm4ge19pZDogLTF9XHJcblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
