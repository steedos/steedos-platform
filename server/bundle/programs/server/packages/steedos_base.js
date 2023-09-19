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
var E164 = Package['steedos:e164-phones-countries'].E164;
var IsoCountries = Package['steedos:i18n-iso-countries'].IsoCountries;
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

var require = meteorInstall({"node_modules":{"meteor":{"steedos:base":{"checkNpm.js":function module(require,exports,module){

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
  "xml2js": "^0.4.19"
}, 'steedos:base');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"steedos_util.js":function module(){

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

},"core.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/core.coffee                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, crypto, mixin, ref, ref1, ref2, ref3, ref4, rootUrl;
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
  },
  authRequest: function (url, options) {
    var authToken, authorization, defOptions, err, headers, result, spaceId, userSession;
    userSession = Creator.USER_CONTEXT;
    spaceId = userSession.spaceId;
    authToken = userSession.authToken ? userSession.authToken : userSession.user.authToken;
    result = null;
    url = Steedos.absoluteUrl(url);

    try {
      authorization = 'Bearer ' + spaceId + ',' + authToken;
      headers = [{
        name: 'Content-Type',
        value: 'application/json'
      }, {
        name: 'Authorization',
        value: authorization
      }];
      defOptions = {
        type: 'get',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (XHR) {
          if (headers && headers.length) {
            return headers.forEach(function (header) {
              return XHR.setRequestHeader(header.name, header.value);
            });
          }
        },
        success: function (data) {
          result = data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          var errorInfo, errorMsg;
          console.error(XMLHttpRequest.responseJSON);

          if (XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.error) {
            errorInfo = XMLHttpRequest.responseJSON.error;
            result = {
              error: errorInfo
            };
            errorMsg = void 0;

            if (errorInfo.reason) {
              errorMsg = errorInfo.reason;
            } else if (errorInfo.message) {
              errorMsg = errorInfo.message;
            } else {
              errorMsg = errorInfo;
              toastr.error(t(errorMsg.replace(/:/g, '：')));
            }
          } else {
            toastr.error(XMLHttpRequest.responseJSON);
          }
        }
      };
      $.ajax(Object.assign({}, defOptions, options));
      return result;
    } catch (error1) {
      err = error1;
      console.error(err);
      toastr.error(err);
    }
  }
}; /*
    * Kick off the global namespace for Steedos.
    * @namespace Steedos
    */

if (Meteor.isCordova || Meteor.isClient) {
  rootUrl = Meteor.absoluteUrl.defaultOptions.rootUrl;

  if (rootUrl.endsWith('/')) {
    rootUrl = rootUrl.substr(0, rootUrl.length - 1);
  }

  if ((ref = window.stores) != null) {
    if ((ref1 = ref.API) != null) {
      if ((ref2 = ref1.client) != null) {
        ref2.setUrl(rootUrl);
      }
    }
  }

  if ((ref3 = window.stores) != null) {
    if ((ref4 = ref3.Settings) != null) {
      ref4.setRootUrl(rootUrl);
    }
  }

  window['steedos.setting'] = {
    rootUrl: rootUrl
  };
}

if (!Meteor.isCordova && Meteor.isClient) {
  Meteor.startup(function () {
    var ref5, ref6, ref7, ref8;
    return (ref5 = window.stores) != null ? (ref6 = ref5.Settings) != null ? ref6.setHrefPopup((ref7 = Meteor.settings["public"]) != null ? (ref8 = ref7.ui) != null ? ref8.href_popup : void 0 : void 0) : void 0 : void 0;
  });
}

Steedos.getHelpUrl = function (locale) {
  var country;
  country = locale.substring(3);
  return "http://www.steedos.com/" + country + "/help/";
};

Steedos.isExpression = function (func) {
  var pattern, reg1, reg2;

  if (typeof func !== 'string') {
    return false;
  }

  pattern = /^{{(.+)}}$/;
  reg1 = /^{{(function.+)}}$/;
  reg2 = /^{{(.+=>.+)}}$/;

  if (typeof func === 'string' && func.match(pattern) && !func.match(reg1) && !func.match(reg2)) {
    return true;
  }

  return false;
};

Steedos.parseSingleExpression = function (func, formData, dataPath, global) {
  var error, funcBody, getParentPath, getValueByPath, globalTag, parent, parentPath, str;

  getParentPath = function (path) {
    var pathArr;

    if (typeof path === 'string') {
      pathArr = path.split('.');

      if (pathArr.length === 1) {
        return '#';
      }

      pathArr.pop();
      return pathArr.join('.');
    }

    return '#';
  };

  getValueByPath = function (formData, path) {
    if (path === '#' || !path) {
      return formData || {};
    } else if (typeof path === 'string') {
      return _.get(formData, path);
    } else {
      console.error('path has to be a string');
    }
  };

  if (formData === void 0) {
    formData = {};
  }

  parentPath = getParentPath(dataPath);
  parent = getValueByPath(formData, parentPath) || {};

  if (typeof func === 'string') {
    funcBody = func.substring(2, func.length - 2);
    globalTag = '__G_L_O_B_A_L__';
    str = '\n    return ' + funcBody.replace(/\bformData\b/g, JSON.stringify(formData).replace(/\bglobal\b/g, globalTag)).replace(/\bglobal\b/g, JSON.stringify(global)).replace(new RegExp('\\b' + globalTag + '\\b', 'g'), 'global').replace(/rootValue/g, JSON.stringify(parent));

    try {
      return Function(str)();
    } catch (error1) {
      error = error1;
      console.log(error, func, dataPath);
      return func;
    }
  } else {
    return func;
  }
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

  Steedos.applyAccountZoomValue = function (accountZoomValue, isNeedToLocal) {};

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

    if (space && end_date !== void 0 && end_date - new Date() <= min_months * 30 * 24 * 3600 * 1000) {
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
    var check, modules, ref5;

    if (!spaceId) {
      return false;
    }

    check = false;
    modules = (ref5 = db.spaces.findOne(spaceId)) != null ? ref5.modules : void 0;

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
      var ref5;

      if (org.parents) {
        parents = _.union(parents, org.parents);
      }

      return (ref5 = org.admins) != null ? ref5.includes(userId) : void 0;
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
    var authToken, cookies, password, ref5, ref6, ref7, ref8, result, user, userId, username;
    username = (ref5 = req.query) != null ? ref5.username : void 0;
    password = (ref6 = req.query) != null ? ref6.password : void 0;

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

    userId = (ref7 = req.query) != null ? ref7["X-User-Id"] : void 0;
    authToken = (ref8 = req.query) != null ? ref8["X-Auth-Token"] : void 0;

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
    var authToken, cookies, ref5, ref6, ref7, ref8, userId;
    userId = (ref5 = req.query) != null ? ref5["X-User-Id"] : void 0;
    authToken = (ref6 = req.query) != null ? ref6["X-Auth-Token"] : void 0;

    if (Steedos.checkAuthToken(userId, authToken)) {
      return (ref7 = db.users.findOne({
        _id: userId
      })) != null ? ref7._id : void 0;
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
      return (ref8 = db.users.findOne({
        _id: userId
      })) != null ? ref8._id : void 0;
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
    var caculated_date, end_date, first_date, i, j, len, max_index, ref5, second_date, start_date, time_points;
    check(date, Date);
    time_points = (ref5 = Meteor.settings.remind) != null ? ref5.time_points : void 0;

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
      var passworPolicy, passworPolicyError, reason, ref10, ref5, ref6, ref7, ref8, ref9, valid;
      reason = t("password_invalid");
      valid = true;

      if (!pwd) {
        valid = false;
      }

      passworPolicy = (ref5 = Meteor.settings["public"]) != null ? (ref6 = ref5.password) != null ? ref6.policy : void 0 : void 0;
      passworPolicyError = ((ref7 = Meteor.settings["public"]) != null ? (ref8 = ref7.password) != null ? ref8.policyError : void 0 : void 0) || ((ref9 = Meteor.settings["public"]) != null ? (ref10 = ref9.password) != null ? ref10.policyerror : void 0 : void 0) || "密码不符合规则";

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

if (Meteor.isServer) {
  Steedos.formatIndex = function (array) {
    var indexName, isdocumentDB, object, ref5, ref6, ref7;
    object = {
      background: true
    };
    isdocumentDB = ((ref5 = Meteor.settings) != null ? (ref6 = ref5.datasources) != null ? (ref7 = ref6["default"]) != null ? ref7.documentDB : void 0 : void 0 : void 0) || false;

    if (isdocumentDB) {
      if (array.length > 0) {
        indexName = array.join(".");
        object.name = indexName;

        if (indexName.length > 52) {
          object.name = indexName.substring(0, 52);
        }
      }
    }

    return object;
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"simple_schema_extend.js":function module(){

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

},"methods":{"apps_init.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/apps_init.coffee                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"utc_offset.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/lib/methods/utc_offset.coffee                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"last_logon.coffee":function module(){

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

},"user_add_email.coffee":function module(){

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

},"user_avatar.coffee":function module(){

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

},"email_templates_reset.js":function module(){

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

},"upgrade_data.js":function module(){

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

}},"steedos":{"push.coffee":function module(){

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

}},"admin.coffee":function module(){

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

},"array_includes.js":function module(){

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

},"settings.coffee":function module(){

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

},"user_object_view.coffee":function module(){

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

},"server_session.js":function module(){

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

}},"routes":{"api_get_apps.coffee":function module(){

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

},"collection.coffee":function module(require){

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

},"sso.coffee":function module(require){

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

},"avatar.coffee":function module(){

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

},"access_token.coffee":function module(){

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

}},"server":{"publications":{"apps.coffee":function module(){

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

},"my_spaces.coffee":function module(){

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

},"space_avatar.coffee":function module(){

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

},"modules.coffee":function module(){

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

},"weixin_pay_code_url.coffee":function module(){

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

}},"methods":{"my_contacts_limit.coffee":function module(){

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

},"setKeyValue.js":function module(){

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

},"setUsername.coffee":function module(){

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

},"get_space_user_count.coffee":function module(){

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

},"user_secret.coffee":function module(){

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

},"object_workflows.coffee":function module(){

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
      space: spaceId,
      $or: [{
        sync_direction: {
          $exists: false
        }
      }, {
        sync_direction: {
          $in: ['both', 'obj_to_ins']
        }
      }]
    }, {
      fields: {
        object_name: 1,
        flow_id: 1,
        space: 1
      }
    }).fetch();

    _.each(ows, function (o) {
      var fl, perms;
      fl = Creator.getCollection('flows').findOne({
        _id: o.flow_id,
        state: 'enabled'
      }, {
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

},"update_server_session.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/update_server_session.coffee                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"set_space_user_password.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/methods/set_space_user_password.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.methods({
  setSpaceUserPassword: function (space_user_id, space_id, password) {
    var canEdit, changedUserInfo, companyIds, companys, currentUser, e, isSpaceAdmin, lang, logout, ref, ref1, ref2, space, spaceUser, userCP, userId, user_id;

    if (!this.userId) {
      throw new Meteor.Error(400, "请先登录");
    }

    spaceUser = db.space_users.findOne({
      _id: space_user_id,
      space: space_id
    });
    userId = this.userId;
    canEdit = spaceUser.user === userId;

    if (!canEdit) {
      space = db.spaces.findOne({
        _id: space_id
      });
      isSpaceAdmin = space != null ? (ref = space.admins) != null ? ref.includes(this.userId) : void 0 : void 0;
      canEdit = isSpaceAdmin;
    }

    companyIds = spaceUser.company_ids;

    if (!canEdit && companyIds && companyIds.length) {
      companys = Creator.getCollection("company").find({
        _id: {
          $in: companyIds
        },
        space: space_id
      }, {
        fields: {
          admins: 1
        }
      }).fetch();

      if (companys && companys.length) {
        canEdit = _.any(companys, function (item) {
          return item.admins && item.admins.indexOf(userId) > -1;
        });
      }
    }

    if (!canEdit) {
      throw new Meteor.Error(400, "您没有权限修改该用户密码");
    }

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

    logout = true;

    if (this.userId === user_id) {
      logout = false;
    }

    Accounts.setPassword(user_id, {
      algorithm: 'sha-256',
      digest: password
    }, {
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

      SMSQueue.send({
        Format: 'JSON',
        Action: 'SingleSendSms',
        ParamString: '',
        RecNum: userCP.mobile,
        SignName: '华炎办公',
        TemplateCode: 'SMS_67200967',
        msg: TAPi18n.__('sms.change_password.template', {}, lang)
      });
    }

    try {
      return Creator.getCollection("operation_logs").insert({
        name: "修改密码",
        type: "change_password",
        remote_user: userId,
        status: 'success',
        space: space_id,
        message: "[系统管理员]修改了用户[" + (changedUserInfo != null ? changedUserInfo.name : void 0) + "]的密码",
        data: JSON.stringify({
          changeUser: user_id
        }),
        related_to: {
          o: "users",
          ids: [user_id]
        }
      });
    } catch (error) {
      e = error;
      return console.error(e);
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"billing_manager.coffee":function module(require,exports,module){

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

}},"schedule":{"statistics.js":function module(require){

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

},"billing.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/schedule/billing.coffee                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"steedos":{"startup":{"migrations":{"v1.coffee":function module(){

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

},"v2.coffee":function module(){

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

},"v3.coffee":function module(){

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

},"v4.coffee":function module(){

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

},"v5.coffee":function module(){

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

},"v6.coffee":function module(require,exports,module){

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

},"xrun.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/steedos/startup/migrations/xrun.coffee                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup.coffee":function module(){

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

},"development.js":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_base/server/development.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
if (process.env.CREATOR_NODE_ENV == 'development') {
  //Meteor 版本升级到1.9 及以上时(node 版本 11+)，可以删除此代码
  Object.defineProperty(Array.prototype, 'flat', {
    value: function () {
      let depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) && depth > 1 ? toFlatten.flat(depth - 1) : toFlatten);
      }, []);
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"tabular.coffee":function module(){

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
require("/node_modules/meteor/steedos:base/server/methods/my_contacts_limit.coffee");
require("/node_modules/meteor/steedos:base/server/methods/setKeyValue.js");
require("/node_modules/meteor/steedos:base/server/methods/setUsername.coffee");
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2NoZWNrTnBtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3N0ZWVkb3NfdXRpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9jb3JlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvbGliL2NvcmUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2UvbGliL3NpbXBsZV9zY2hlbWFfZXh0ZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvbGFzdF9sb2dvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL2xhc3RfbG9nb24uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL21ldGhvZHMvdXNlcl9hZGRfZW1haWwuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvbWV0aG9kcy91c2VyX2FkZF9lbWFpbC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvbWV0aG9kcy91c2VyX2F2YXRhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9tZXRob2RzL3VzZXJfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL2VtYWlsX3RlbXBsYXRlc19yZXNldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL2xpYi9tZXRob2RzL3VwZ3JhZGVfZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9zdGVlZG9zL3B1c2guY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc3RlZWRvcy9wdXNoLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2xpYi9hZG1pbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvYXJyYXlfaW5jbHVkZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvc2V0dGluZ3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvbGliL3VzZXJfb2JqZWN0X3ZpZXcuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9saWIvdXNlcl9vYmplY3Rfdmlldy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9saWIvc2VydmVyX3Nlc3Npb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvYXBpX2dldF9hcHBzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcm91dGVzL2FwaV9nZXRfYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9yb3V0ZXMvY29sbGVjdGlvbi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3JvdXRlcy9jb2xsZWN0aW9uLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9zc28uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvc3NvLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3JvdXRlcy9hY2Nlc3NfdG9rZW4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9yb3V0ZXMvYWNjZXNzX3Rva2VuLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvYXBwcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvcHVibGljYXRpb25zL215X3NwYWNlcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvbXlfc3BhY2VzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvc3BhY2VfYXZhdGFyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9zcGFjZV9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3B1YmxpY2F0aW9ucy9tb2R1bGVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9wdWJsaWNhdGlvbnMvd2VpeGluX3BheV9jb2RlX3VybC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9teV9jb250YWN0c19saW1pdC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL215X2NvbnRhY3RzX2xpbWl0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpiYXNlL3NlcnZlci9tZXRob2RzL3NldEtleVZhbHVlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL21ldGhvZHMvc2V0VXNlcm5hbWUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9zZXRVc2VybmFtZS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy9nZXRfc3BhY2VfdXNlcl9jb3VudC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvbWV0aG9kcy91c2VyX3NlY3JldC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tZXRob2RzL3VzZXJfc2VjcmV0LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL29iamVjdF93b3JrZmxvd3MuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWV0aG9kcy9vYmplY3Rfd29ya2Zsb3dzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9tZXRob2RzL3NldF9zcGFjZV91c2VyX3Bhc3N3b3JkLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21ldGhvZHMvc2V0X3NwYWNlX3VzZXJfcGFzc3dvcmQuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL2xpYi9iaWxsaW5nX21hbmFnZXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbGliL2JpbGxpbmdfbWFuYWdlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3M6YmFzZS9zZXJ2ZXIvc2NoZWR1bGUvc3RhdGlzdGljcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92MS5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3YzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9zdGVlZG9zL3N0YXJ0dXAvbWlncmF0aW9ucy92NC5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvc3RlZWRvcy9zdGFydHVwL21pZ3JhdGlvbnMvdjUuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2Uvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0ZWVkb3Mvc3RhcnR1cC9taWdyYXRpb25zL3Y2LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19iYXNlL3NlcnZlci9zdGFydHVwLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3N0YXJ0dXAuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zOmJhc2Uvc2VydmVyL2RldmVsb3BtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX2Jhc2UvdGFidWxhci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3RhYnVsYXIuY29mZmVlIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIkFycmF5IiwicHJvdG90eXBlIiwic29ydEJ5TmFtZSIsImxvY2FsZSIsIlN0ZWVkb3MiLCJzb3J0IiwicDEiLCJwMiIsInAxX3NvcnRfbm8iLCJzb3J0X25vIiwicDJfc29ydF9ubyIsIm5hbWUiLCJsb2NhbGVDb21wYXJlIiwiZ2V0UHJvcGVydHkiLCJrIiwiZm9yRWFjaCIsInQiLCJtIiwicHVzaCIsInJlbW92ZSIsImZyb20iLCJ0byIsInJlc3QiLCJzbGljZSIsImxlbmd0aCIsImFwcGx5IiwiZmlsdGVyUHJvcGVydHkiLCJoIiwibCIsImciLCJkIiwiaW5jbHVkZXMiLCJPYmplY3QiLCJ1bmRlZmluZWQiLCJmaW5kUHJvcGVydHlCeVBLIiwiciIsIkNvb2tpZXMiLCJjcnlwdG8iLCJtaXhpbiIsInJlZiIsInJlZjEiLCJyZWYyIiwicmVmMyIsInJlZjQiLCJyb290VXJsIiwic2V0dGluZ3MiLCJkYiIsInN1YnMiLCJpc1Bob25lRW5hYmxlZCIsIk1ldGVvciIsInBob25lIiwibnVtYmVyVG9TdHJpbmciLCJudW1iZXIiLCJzY2FsZSIsIm5vdFRob3VzYW5kcyIsInJlZyIsInRvU3RyaW5nIiwiTnVtYmVyIiwidG9GaXhlZCIsIm1hdGNoIiwicmVwbGFjZSIsInZhbGlKcXVlcnlTeW1ib2xzIiwic3RyIiwiUmVnRXhwIiwidGVzdCIsImF1dGhSZXF1ZXN0IiwidXJsIiwib3B0aW9ucyIsImF1dGhUb2tlbiIsImF1dGhvcml6YXRpb24iLCJkZWZPcHRpb25zIiwiZXJyIiwiaGVhZGVycyIsInJlc3VsdCIsInNwYWNlSWQiLCJ1c2VyU2Vzc2lvbiIsIkNyZWF0b3IiLCJVU0VSX0NPTlRFWFQiLCJ1c2VyIiwiYWJzb2x1dGVVcmwiLCJ2YWx1ZSIsInR5cGUiLCJkYXRhVHlwZSIsImNvbnRlbnRUeXBlIiwiYmVmb3JlU2VuZCIsIlhIUiIsImhlYWRlciIsInNldFJlcXVlc3RIZWFkZXIiLCJzdWNjZXNzIiwiZGF0YSIsImVycm9yIiwiWE1MSHR0cFJlcXVlc3QiLCJ0ZXh0U3RhdHVzIiwiZXJyb3JUaHJvd24iLCJlcnJvckluZm8iLCJlcnJvck1zZyIsImNvbnNvbGUiLCJyZXNwb25zZUpTT04iLCJyZWFzb24iLCJtZXNzYWdlIiwidG9hc3RyIiwiJCIsImFqYXgiLCJhc3NpZ24iLCJlcnJvcjEiLCJpc0NvcmRvdmEiLCJpc0NsaWVudCIsImRlZmF1bHRPcHRpb25zIiwiZW5kc1dpdGgiLCJzdWJzdHIiLCJ3aW5kb3ciLCJzdG9yZXMiLCJBUEkiLCJjbGllbnQiLCJzZXRVcmwiLCJTZXR0aW5ncyIsInNldFJvb3RVcmwiLCJzdGFydHVwIiwicmVmNSIsInJlZjYiLCJyZWY3IiwicmVmOCIsInNldEhyZWZQb3B1cCIsInVpIiwiaHJlZl9wb3B1cCIsImdldEhlbHBVcmwiLCJjb3VudHJ5Iiwic3Vic3RyaW5nIiwiaXNFeHByZXNzaW9uIiwiZnVuYyIsInBhdHRlcm4iLCJyZWcxIiwicmVnMiIsInBhcnNlU2luZ2xlRXhwcmVzc2lvbiIsImZvcm1EYXRhIiwiZGF0YVBhdGgiLCJnbG9iYWwiLCJmdW5jQm9keSIsImdldFBhcmVudFBhdGgiLCJnZXRWYWx1ZUJ5UGF0aCIsImdsb2JhbFRhZyIsInBhcmVudCIsInBhcmVudFBhdGgiLCJwYXRoIiwicGF0aEFyciIsInNwbGl0IiwicG9wIiwiam9pbiIsIl8iLCJnZXQiLCJKU09OIiwic3RyaW5naWZ5IiwiRnVuY3Rpb24iLCJsb2ciLCJzcGFjZVVwZ3JhZGVkTW9kYWwiLCJzd2FsIiwidGl0bGUiLCJUQVBpMThuIiwiX18iLCJ0ZXh0IiwiaHRtbCIsImNvbmZpcm1CdXR0b25UZXh0IiwiZ2V0QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keSIsInN0ZWVkb3Nfa2V5dmFsdWVzIiwiZmluZE9uZSIsInVzZXJJZCIsImtleSIsImFwcGx5QWNjb3VudEJnQm9keVZhbHVlIiwiYWNjb3VudEJnQm9keVZhbHVlIiwiaXNOZWVkVG9Mb2NhbCIsImF2YXRhciIsImxvZ2dpbmdJbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsImdldEFjY291bnRTa2luVmFsdWUiLCJhY2NvdW50U2tpbiIsImdldEFjY291bnRab29tVmFsdWUiLCJhY2NvdW50Wm9vbSIsImFwcGx5QWNjb3VudFpvb21WYWx1ZSIsImFjY291bnRab29tVmFsdWUiLCJzaG93SGVscCIsImdldExvY2FsZSIsIm9wZW4iLCJnZXRVcmxXaXRoVG9rZW4iLCJsaW5rZXIiLCJnZXRTcGFjZUlkIiwiQWNjb3VudHMiLCJfc3RvcmVkTG9naW5Ub2tlbiIsImluZGV4T2YiLCJwYXJhbSIsImdldEFwcFVybFdpdGhUb2tlbiIsImFwcF9pZCIsIm9wZW5BcHBXaXRoVG9rZW4iLCJhcHAiLCJhcHBzIiwiaXNfbmV3X3dpbmRvdyIsImlzTW9iaWxlIiwibG9jYXRpb24iLCJvcGVuV2luZG93Iiwib3BlblVybFdpdGhJRSIsImNtZCIsImV4ZWMiLCJvcGVuX3VybCIsImlzTm9kZSIsIm53IiwicmVxdWlyZSIsInN0ZG91dCIsInN0ZGVyciIsIm9wZW5BcHAiLCJlIiwiZXZhbEZ1blN0cmluZyIsIm9uX2NsaWNrIiwicmVkaXJlY3RUb1NpZ25JbiIsIkZsb3dSb3V0ZXIiLCJnbyIsImlzX3VzZV9pZSIsIm9yaWdpbiIsImlzSW50ZXJuYWxBcHAiLCJpc191c2VfaWZyYW1lIiwiX2lkIiwiZXZhbCIsInN0YWNrIiwiU2Vzc2lvbiIsInNldCIsImNoZWNrU3BhY2VCYWxhbmNlIiwiZW5kX2RhdGUiLCJtaW5fbW9udGhzIiwic3BhY2UiLCJpc1NwYWNlQWRtaW4iLCJzcGFjZXMiLCJEYXRlIiwic2V0TW9kYWxNYXhIZWlnaHQiLCJvZmZzZXQiLCJkZXRlY3RJRSIsImVhY2giLCJmb290ZXJIZWlnaHQiLCJoZWFkZXJIZWlnaHQiLCJoZWlnaHQiLCJ0b3RhbEhlaWdodCIsIm91dGVySGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJoYXNDbGFzcyIsImNzcyIsImdldE1vZGFsTWF4SGVpZ2h0IiwicmVWYWx1ZSIsInNjcmVlbiIsImlzaU9TIiwidXNlckFnZW50IiwibGFuZ3VhZ2UiLCJERVZJQ0UiLCJicm93c2VyIiwiY29uRXhwIiwiZGV2aWNlIiwibnVtRXhwIiwiYW5kcm9pZCIsImJsYWNrYmVycnkiLCJkZXNrdG9wIiwiaXBhZCIsImlwaG9uZSIsImlwb2QiLCJtb2JpbGUiLCJuYXZpZ2F0b3IiLCJ0b0xvd2VyQ2FzZSIsImJyb3dzZXJMYW5ndWFnZSIsImdldFVzZXJPcmdhbml6YXRpb25zIiwiaXNJbmNsdWRlUGFyZW50cyIsIm9yZ2FuaXphdGlvbnMiLCJwYXJlbnRzIiwic3BhY2VfdXNlciIsInNwYWNlX3VzZXJzIiwiZmllbGRzIiwiZmxhdHRlbiIsImZpbmQiLCIkaW4iLCJmZXRjaCIsInVuaW9uIiwiZm9yYmlkTm9kZUNvbnRleHRtZW51IiwidGFyZ2V0IiwiaWZyIiwiZG9jdW1lbnQiLCJib2R5IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJsb2FkIiwiaWZyQm9keSIsImNvbnRlbnRzIiwiaXNTZXJ2ZXIiLCJhZG1pbnMiLCJpc0xlZ2FsVmVyc2lvbiIsImFwcF92ZXJzaW9uIiwiY2hlY2siLCJtb2R1bGVzIiwiaXNPcmdBZG1pbkJ5T3JnSWRzIiwib3JnSWRzIiwiYWxsb3dBY2Nlc3NPcmdzIiwiaXNPcmdBZG1pbiIsInVzZU9yZ3MiLCJmaWx0ZXIiLCJvcmciLCJ1bmlxIiwiaXNPcmdBZG1pbkJ5QWxsT3JnSWRzIiwiaSIsInJvb3RfdXJsIiwiVVJMIiwicGF0aG5hbWUiLCJnZXRBUElMb2dpblVzZXIiLCJyZXEiLCJyZXMiLCJjb29raWVzIiwicGFzc3dvcmQiLCJ1c2VybmFtZSIsInF1ZXJ5IiwidXNlcnMiLCJzdGVlZG9zX2lkIiwiX2NoZWNrUGFzc3dvcmQiLCJFcnJvciIsImNoZWNrQXV0aFRva2VuIiwiaGFzaGVkVG9rZW4iLCJfaGFzaExvZ2luVG9rZW4iLCJkZWNyeXB0IiwiaXYiLCJjIiwiZGVjaXBoZXIiLCJkZWNpcGhlck1zZyIsImtleTMyIiwibGVuIiwiY3JlYXRlRGVjaXBoZXJpdiIsIkJ1ZmZlciIsImNvbmNhdCIsInVwZGF0ZSIsImZpbmFsIiwiZW5jcnlwdCIsImNpcGhlciIsImNpcGhlcmVkTXNnIiwiY3JlYXRlQ2lwaGVyaXYiLCJnZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4iLCJhY2Nlc3NfdG9rZW4iLCJjb2xsZWN0aW9uIiwib2JqIiwib0F1dGgyU2VydmVyIiwiY29sbGVjdGlvbnMiLCJhY2Nlc3NUb2tlbiIsImV4cGlyZXMiLCJnZXRVc2VySWRGcm9tQXV0aFRva2VuIiwiQVBJQXV0aGVudGljYXRpb25DaGVjayIsIkpzb25Sb3V0ZXMiLCJzZW5kUmVzdWx0IiwiY29kZSIsImZ1bmN0aW9ucyIsImFyZ3MiLCJfd3JhcHBlZCIsImFyZ3VtZW50cyIsImNhbGwiLCJpc0hvbGlkYXkiLCJkYXRlIiwiZGF5IiwiZ2V0RGF5IiwiY2FjdWxhdGVXb3JraW5nVGltZSIsImRheXMiLCJjYWN1bGF0ZURhdGUiLCJwYXJhbV9kYXRlIiwiZ2V0VGltZSIsImNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5IiwibmV4dCIsImNhY3VsYXRlZF9kYXRlIiwiZmlyc3RfZGF0ZSIsImoiLCJtYXhfaW5kZXgiLCJzZWNvbmRfZGF0ZSIsInN0YXJ0X2RhdGUiLCJ0aW1lX3BvaW50cyIsInJlbWluZCIsImlzRW1wdHkiLCJzZXRIb3VycyIsImhvdXIiLCJzZXRNaW51dGVzIiwibWludXRlIiwiZXh0ZW5kIiwiZ2V0U3RlZWRvc1Rva2VuIiwiYXBwSWQiLCJub3ciLCJzZWNyZXQiLCJzdGVlZG9zX3Rva2VuIiwicGFyc2VJbnQiLCJpc0kxOG4iLCJjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5IiwiJHJlZ2V4IiwiX2VzY2FwZVJlZ0V4cCIsInRyaW0iLCJ2YWxpZGF0ZVBhc3N3b3JkIiwicHdkIiwicGFzc3dvclBvbGljeSIsInBhc3N3b3JQb2xpY3lFcnJvciIsInJlZjEwIiwicmVmOSIsInZhbGlkIiwicG9saWN5IiwicG9saWN5RXJyb3IiLCJwb2xpY3llcnJvciIsImNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyIiwicmVtb3ZlU3BlY2lhbENoYXJhY3RlciIsImdldERCQXBwcyIsInNwYWNlX2lkIiwiZGJBcHBzIiwiQ29sbGVjdGlvbnMiLCJpc19jcmVhdG9yIiwidmlzaWJsZSIsImNyZWF0ZWQiLCJjcmVhdGVkX2J5IiwibW9kaWZpZWQiLCJtb2RpZmllZF9ieSIsImdldERCRGFzaGJvYXJkcyIsImRiRGFzaGJvYXJkcyIsImRhc2hib2FyZCIsImdldEF1dGhUb2tlbiIsImF1dG9ydW4iLCJzZXNzaW9uU3RvcmFnZSIsImdldEN1cnJlbnRBcHBJZCIsImZvcm1hdEluZGV4IiwiYXJyYXkiLCJpbmRleE5hbWUiLCJpc2RvY3VtZW50REIiLCJvYmplY3QiLCJiYWNrZ3JvdW5kIiwiZGF0YXNvdXJjZXMiLCJkb2N1bWVudERCIiwiU2ltcGxlU2NoZW1hIiwiZXh0ZW5kT3B0aW9ucyIsImZvcmVpZ25fa2V5IiwiTWF0Y2giLCJPcHRpb25hbCIsIkJvb2xlYW4iLCJyZWZlcmVuY2VzIiwibWV0aG9kcyIsInVwZGF0ZVVzZXJMYXN0TG9nb24iLCIkc2V0IiwibGFzdF9sb2dvbiIsIm9uTG9naW4iLCJ1c2Vyc19hZGRfZW1haWwiLCJlbWFpbCIsImNvdW50IiwiZW1haWxzIiwiZGlyZWN0IiwiJHB1c2giLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJ1c2Vyc19yZW1vdmVfZW1haWwiLCJwIiwiJHB1bGwiLCJ1c2Vyc192ZXJpZnlfZW1haWwiLCJ1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbCIsInByaW1hcnkiLCJtdWx0aSIsInNob3dDYW5jZWxCdXR0b24iLCJjbG9zZU9uQ29uZmlybSIsImFuaW1hdGlvbiIsImlucHV0VmFsdWUiLCJ1cGRhdGVVc2VyQXZhdGFyIiwiZW1haWxUZW1wbGF0ZXMiLCJkZWZhdWx0RnJvbSIsInJlc2V0UGFzc3dvcmQiLCJzdWJqZWN0Iiwic3BsaXRzIiwidG9rZW5Db2RlIiwiZ3JlZXRpbmciLCJwcm9maWxlIiwidG9rZW5fY29kZSIsInZlcmlmeUVtYWlsIiwiZW5yb2xsQWNjb3VudCIsImFkZCIsIm9yZ3MiLCJmdWxsbmFtZSIsIiRuZSIsImNhbGN1bGF0ZUZ1bGxuYW1lIiwicmV0IiwibXNnIiwiUHVzaCIsIkNvbmZpZ3VyZSIsInNlbmRlcklEIiwiQU5EUk9JRF9TRU5ERVJfSUQiLCJzb3VuZCIsInZpYnJhdGUiLCJpb3MiLCJiYWRnZSIsImNsZWFyQmFkZ2UiLCJhbGVydCIsImFwcE5hbWUiLCJTZWxlY3RvciIsInNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluIiwic2VsZWN0b3IiLCJpc19jbG91ZGFkbWluIiwibWFwIiwibiIsInNlbGVjdG9yQ2hlY2tTcGFjZSIsInUiLCJiaWxsaW5nX3BheV9yZWNvcmRzIiwiYWRtaW5Db25maWciLCJpY29uIiwiY29sb3IiLCJ0YWJsZUNvbHVtbnMiLCJleHRyYUZpZWxkcyIsInJvdXRlckFkbWluIiwicGFpZCIsInNob3dFZGl0Q29sdW1uIiwic2hvd0RlbENvbHVtbiIsImRpc2FibGVBZGQiLCJwYWdlTGVuZ3RoIiwib3JkZXIiLCJzcGFjZV91c2VyX3NpZ25zIiwiQWRtaW5Db25maWciLCJjb2xsZWN0aW9uc19hZGQiLCJzZWFyY2hFbGVtZW50IiwiTyIsImN1cnJlbnRFbGVtZW50Iiwid2Vic2VydmljZXMiLCJ3d3ciLCJzdGF0dXMiLCJnZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyIsIm9iamVjdHMiLCJfZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsImtleXMiLCJsaXN0Vmlld3MiLCJvYmplY3RzVmlld3MiLCJnZXRDb2xsZWN0aW9uIiwib2JqZWN0X25hbWUiLCJvd25lciIsInNoYXJlZCIsIl91c2VyX29iamVjdF9saXN0X3ZpZXdzIiwib2xpc3RWaWV3cyIsIm92IiwibGlzdHZpZXciLCJvIiwibGlzdF92aWV3IiwiZ2V0VXNlck9iamVjdExpc3RWaWV3cyIsIm9iamVjdF9saXN0dmlldyIsInVzZXJfaWQiLCJ1dWZsb3dNYW5hZ2VyIiwiZ2V0U3BhY2UiLCIkb3IiLCIkZXhpc3RzIiwiZXJyb3JzIiwiZXJyb3JNZXNzYWdlIiwic3RlZWRvc0F1dGgiLCJhbGxvd19tb2RlbHMiLCJtb2RlbCIsIlN0cmluZyIsIndyYXBBc3luYyIsImNiIiwiZ2V0U2Vzc2lvbiIsInRoZW4iLCJyZXNvbHZlIiwicmVqZWN0IiwiZXhwcmVzcyIsImRlc19jaXBoZXIiLCJkZXNfY2lwaGVyZWRNc2ciLCJkZXNfaXYiLCJkZXNfc3RlZWRvc190b2tlbiIsImpvaW5lciIsImtleTgiLCJyZWRpcmVjdFVybCIsInJldHVybnVybCIsInBhcmFtcyIsIndyaXRlSGVhZCIsImVuZCIsImVuY29kZVVSSSIsInNldEhlYWRlciIsImNvbG9yX2luZGV4IiwiY29sb3JzIiwiZm9udFNpemUiLCJpbml0aWFscyIsInBvc2l0aW9uIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZV9hcnJheSIsIndpZHRoIiwidyIsImZzIiwiZ2V0UmVsYXRpdmVVcmwiLCJhdmF0YXJVcmwiLCJmaWxlIiwid3JpdGUiLCJpdGVtIiwiY2hhckNvZGVBdCIsInRvVXBwZXJDYXNlIiwidG9VVENTdHJpbmciLCJyZWFkU3RyZWFtIiwicGlwZSIsInB1Ymxpc2giLCJyZWFkeSIsImhhbmRsZSIsImhhbmRsZTIiLCJvYnNlcnZlU3BhY2VzIiwic2VsZiIsInN1cyIsInVzZXJTcGFjZXMiLCJ1c2VyX2FjY2VwdGVkIiwic3UiLCJvYnNlcnZlIiwiYWRkZWQiLCJkb2MiLCJyZW1vdmVkIiwib2xkRG9jIiwid2l0aG91dCIsInN0b3AiLCJjaGFuZ2VkIiwibmV3RG9jIiwib25TdG9wIiwiZW5hYmxlX3JlZ2lzdGVyIiwiZ2V0X2NvbnRhY3RzX2xpbWl0IiwiZnJvbXMiLCJmcm9tc0NoaWxkcmVuIiwiZnJvbXNDaGlsZHJlbklkcyIsImlzTGltaXQiLCJsZW4xIiwibGltaXQiLCJsaW1pdHMiLCJteUxpdG1pdE9yZ0lkcyIsIm15T3JnSWQiLCJteU9yZ0lkcyIsIm15T3JncyIsIm91dHNpZGVfb3JnYW5pemF0aW9ucyIsInNldHRpbmciLCJ0ZW1wSXNMaW1pdCIsInRvT3JncyIsInRvcyIsInNwYWNlX3NldHRpbmdzIiwidmFsdWVzIiwiaW50ZXJzZWN0aW9uIiwic2V0S2V5VmFsdWUiLCJpbnNlcnQiLCJzZXRVc2VybmFtZSIsInNwYWNlVXNlciIsImludml0ZV9zdGF0ZSIsImdldF9zcGFjZV91c2VyX2NvdW50IiwidXNlcl9jb3VudF9pbmZvIiwidG90YWxfdXNlcl9jb3VudCIsImFjY2VwdGVkX3VzZXJfY291bnQiLCJjcmVhdGVfc2VjcmV0IiwicmVtb3ZlX3NlY3JldCIsInRva2VuIiwiY3VyU3BhY2VVc2VyIiwib3dzIiwic3luY19kaXJlY3Rpb24iLCJmbG93X2lkIiwiZmwiLCJwZXJtcyIsInN0YXRlIiwiZmxvd19uYW1lIiwiY2FuX2FkZCIsInVzZXJzX2Nhbl9hZGQiLCJvcmdzX2Nhbl9hZGQiLCJzb21lIiwic2V0U3BhY2VVc2VyUGFzc3dvcmQiLCJzcGFjZV91c2VyX2lkIiwiY2FuRWRpdCIsImNoYW5nZWRVc2VySW5mbyIsImNvbXBhbnlJZHMiLCJjb21wYW55cyIsImN1cnJlbnRVc2VyIiwibGFuZyIsImxvZ291dCIsInVzZXJDUCIsImNvbXBhbnlfaWRzIiwiYW55Iiwic2V0UGFzc3dvcmQiLCJhbGdvcml0aG0iLCJkaWdlc3QiLCJzZXJ2aWNlcyIsImJjcnlwdCIsIm1vYmlsZV92ZXJpZmllZCIsIlNNU1F1ZXVlIiwic2VuZCIsIkZvcm1hdCIsIkFjdGlvbiIsIlBhcmFtU3RyaW5nIiwiUmVjTnVtIiwiU2lnbk5hbWUiLCJUZW1wbGF0ZUNvZGUiLCJyZW1vdGVfdXNlciIsImNoYW5nZVVzZXIiLCJyZWxhdGVkX3RvIiwiaWRzIiwiYmlsbGluZ01hbmFnZXIiLCJnZXRfYWNjb3VudGluZ19wZXJpb2QiLCJhY2NvdW50aW5nX21vbnRoIiwiYmlsbGluZyIsImNvdW50X2RheXMiLCJlbmRfZGF0ZV90aW1lIiwic3RhcnRfZGF0ZV90aW1lIiwibW9tZW50IiwiZm9ybWF0IiwiYmlsbGluZ3MiLCJ0cmFuc2FjdGlvbiIsImJpbGxpbmdfZGF0ZSIsImdldERhdGUiLCJyZWZyZXNoX2JhbGFuY2UiLCJyZWZyZXNoX2RhdGUiLCJhcHBfYmlsbCIsImJfbSIsImJfbV9kIiwiYmlsbCIsImNyZWRpdHMiLCJkZWJpdHMiLCJsYXN0X2JhbGFuY2UiLCJsYXN0X2JpbGwiLCJwYXltZW50X2JpbGwiLCJzZXRPYmoiLCIkbHQiLCJiaWxsaW5nX21vbnRoIiwiYmFsYW5jZSIsImdldF9iYWxhbmNlIiwidXNlcl9jb3VudCIsIm1vZHVsZV9uYW1lIiwibGlzdHByaWNlIiwiYWNjb3VudGluZ19kYXRlIiwiYWNjb3VudGluZ19kYXRlX2Zvcm1hdCIsImRheXNfbnVtYmVyIiwibmV3X2JpbGwiLCIkbHRlIiwiX21ha2VOZXdJRCIsImdldFNwYWNlVXNlckNvdW50IiwicmVjYWN1bGF0ZUJhbGFuY2UiLCJyZWZyZXNoX2RhdGVzIiwicl9kIiwiZ2V0X21vZHVsZXMiLCJtX2NoYW5nZWxvZyIsIm1vZHVsZXNfY2hhbmdlbG9ncyIsImNoYW5nZV9kYXRlIiwib3BlcmF0aW9uIiwiZ2V0X21vZHVsZXNfbmFtZSIsIm1vZHVsZXNfbmFtZSIsImNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGgiLCJhX20iLCJuZXdlc3RfYmlsbCIsInBlcmlvZF9yZXN1bHQiLCJyZW1haW5pbmdfbW9udGhzIiwiYiIsInNwZWNpYWxfcGF5IiwibW9kdWxlX25hbWVzIiwidG90YWxfZmVlIiwib3BlcmF0b3JfaWQiLCJuZXdfbW9kdWxlcyIsInNwYWNlX3VwZGF0ZV9vYmoiLCJkaWZmZXJlbmNlIiwiX2QiLCJpc19wYWlkIiwidXNlcl9saW1pdCIsIm1jbCIsIm9wZXJhdG9yIiwiY3JvbiIsInN0YXRpc3RpY3MiLCJzY2hlZHVsZSIsInJ1bGUiLCJnb19uZXh0Iiwic2NoZWR1bGVKb2IiLCJiaW5kRW52aXJvbm1lbnQiLCJ0aW1lIiwiZGF0ZUZvcm1hdCIsImRhdGVrZXkiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwieWVzdGVyRGF5IiwiZE5vdyIsImRCZWZvcmUiLCJkYWlseVN0YXRpY3NDb3VudCIsInN0YXRpY3MiLCIkZ3QiLCJzdGF0aWNzQ291bnQiLCJvd25lck5hbWUiLCJsYXN0TG9nb24iLCJzVXNlcnMiLCJzVXNlciIsImxhc3RNb2RpZmllZCIsIm9iakFyciIsIm1vZCIsInBvc3RzQXR0YWNobWVudHMiLCJhdHRTaXplIiwic2l6ZVN1bSIsInBvc3RzIiwicG9zdCIsImF0dHMiLCJjZnMiLCJhdHQiLCJvcmlnaW5hbCIsInNpemUiLCJkYWlseVBvc3RzQXR0YWNobWVudHMiLCJzdGVlZG9zX3N0YXRpc3RpY3MiLCJzcGFjZV9uYW1lIiwib3duZXJfbmFtZSIsInN0ZWVkb3MiLCJ3b3JrZmxvdyIsImZsb3dzIiwiZm9ybXMiLCJmbG93X3JvbGVzIiwiZmxvd19wb3NpdGlvbnMiLCJpbnN0YW5jZXMiLCJpbnN0YW5jZXNfbGFzdF9tb2RpZmllZCIsImRhaWx5X2Zsb3dzIiwiZGFpbHlfZm9ybXMiLCJkYWlseV9pbnN0YW5jZXMiLCJjbXMiLCJzaXRlcyIsImNtc19zaXRlcyIsImNtc19wb3N0cyIsInBvc3RzX2xhc3RfbW9kaWZpZWQiLCJwb3N0c19hdHRhY2htZW50c19zaXplIiwiY29tbWVudHMiLCJjbXNfY29tbWVudHMiLCJkYWlseV9zaXRlcyIsImRhaWx5X3Bvc3RzIiwiZGFpbHlfY29tbWVudHMiLCJkYWlseV9wb3N0c19hdHRhY2htZW50c19zaXplIiwidGltZUVuZCIsIk1pZ3JhdGlvbnMiLCJ2ZXJzaW9uIiwidXAiLCJ1cGRhdGVfY2ZzX2luc3RhbmNlIiwicGFyZW50X2lkIiwiaW5zdGFuY2VfaWQiLCJhdHRhY2hfdmVyc2lvbiIsImlzQ3VycmVudCIsIm1ldGFkYXRhIiwiaW5zdGFuY2UiLCJhcHByb3ZlIiwiY3VycmVudCIsImF0dGFjaG1lbnRzIiwiaW5zIiwiYXR0YWNocyIsImN1cnJlbnRfdmVyIiwiX3JldiIsImhpc3RvcnlzIiwiaGlzIiwiZG93biIsIm9yZ2FuaXphdGlvbiIsImNoZWNrX2NvdW50IiwibmV3X29yZ19pZHMiLCJyZW1vdmVkX29yZ19pZHMiLCJyb290X29yZyIsInVwZGF0ZVVzZXJzIiwicyIsImxpc3RwcmljZXMiLCJtb250aHMiLCJzZXRfb2JqIiwicG0iLCJzZXRNb250aCIsInJvb3RVUkwiLCJjcmVhdG9yIiwicHJvY2VzcyIsImVudiIsIkNSRUFUT1JfTk9ERV9FTlYiLCJkZWZpbmVQcm9wZXJ0eSIsImRlcHRoIiwicmVkdWNlIiwiZmxhdCIsInRvRmxhdHRlbiIsImlzQXJyYXkiLCJUYWJ1bGFyIiwiVGFibGUiLCJjb2x1bW5zIiwib3JkZXJhYmxlIiwiZG9tIiwibGVuZ3RoQ2hhbmdlIiwib3JkZXJpbmciLCJpbmZvIiwic2VhcmNoaW5nIiwiYXV0b1dpZHRoIiwiY2hhbmdlU2VsZWN0b3IiLCIkYW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUdyQkgsZ0JBQWdCLENBQUM7QUFDaEIsbUJBQWlCLFFBREQ7QUFFaEIsWUFB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RCxJQUFJd3VCLFFBQVFDLEtBQVosQ0FDQztBQUFBbjFCLFVBQU0sZ0JBQU47QUFDQTBVLGdCQUFZdlMsR0FBR3VKLElBRGY7QUFFQTBwQixhQUFTLENBQ1I7QUFDQ3R3QixZQUFNLE1BRFA7QUFFQ3V3QixpQkFBVztBQUZaLEtBRFEsQ0FGVDtBQVFBQyxTQUFLLElBUkw7QUFTQXhXLGlCQUFhLENBQUMsS0FBRCxFQUFRLE9BQVIsQ0FUYjtBQVVBeVcsa0JBQWMsS0FWZDtBQVdBQyxjQUFVLEtBWFY7QUFZQXBXLGdCQUFZLEVBWlo7QUFhQXFXLFVBQU0sS0FiTjtBQWNBQyxlQUFXLElBZFg7QUFlQUMsZUFBVyxJQWZYO0FBZ0JBQyxvQkFBZ0IsVUFBQ3pYLFFBQUQsRUFBV3hVLE1BQVg7QUFDZixVQUFBL0gsR0FBQSxFQUFBK0wsS0FBQTs7QUFBQSxXQUFPaEUsTUFBUDtBQUNDLGVBQU87QUFBQ3dELGVBQUssQ0FBQztBQUFQLFNBQVA7QUNJRzs7QURISlEsY0FBUXdRLFNBQVN4USxLQUFqQjs7QUFDQSxXQUFPQSxLQUFQO0FBQ0MsYUFBQXdRLFlBQUEsUUFBQXZjLE1BQUF1YyxTQUFBMFgsSUFBQSxZQUFBajBCLElBQW1CZixNQUFuQixHQUFtQixNQUFuQixHQUFtQixNQUFuQixJQUE0QixDQUE1QjtBQUNDOE0sa0JBQVF3USxTQUFTMFgsSUFBVCxDQUFjMzFCLFdBQWQsQ0FBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsQ0FBUjtBQUZGO0FDUUk7O0FETEosV0FBT3lOLEtBQVA7QUFDQyxlQUFPO0FBQUNSLGVBQUssQ0FBQztBQUFQLFNBQVA7QUNTRzs7QURSSixhQUFPZ1IsUUFBUDtBQXpCRDtBQUFBLEdBREQsQ0NBQztBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdGNoZWNrTnBtVmVyc2lvbnNcbn0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG5jaGVja05wbVZlcnNpb25zKHtcblx0XCJub2RlLXNjaGVkdWxlXCI6IFwiXjEuMy4xXCIsXG5cdFwieG1sMmpzXCI6IFwiXjAuNC4xOVwiLFxufSwgJ3N0ZWVkb3M6YmFzZScpO1xuIiwiQXJyYXkucHJvdG90eXBlLnNvcnRCeU5hbWUgPSBmdW5jdGlvbiAobG9jYWxlKSB7XG4gICAgaWYgKCF0aGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIWxvY2FsZSl7XG4gICAgICAgIGxvY2FsZSA9IFN0ZWVkb3MubG9jYWxlKClcbiAgICB9XG4gICAgdGhpcy5zb3J0KGZ1bmN0aW9uIChwMSwgcDIpIHtcblx0XHR2YXIgcDFfc29ydF9ubyA9IHAxLnNvcnRfbm8gfHwgMDtcblx0XHR2YXIgcDJfc29ydF9ubyA9IHAyLnNvcnRfbm8gfHwgMDtcblx0XHRpZihwMV9zb3J0X25vICE9IHAyX3NvcnRfbm8pe1xuICAgICAgICAgICAgcmV0dXJuIHAxX3NvcnRfbm8gPiBwMl9zb3J0X25vID8gLTEgOiAxXG4gICAgICAgIH1lbHNle1xuXHRcdFx0cmV0dXJuIHAxLm5hbWUubG9jYWxlQ29tcGFyZShwMi5uYW1lLCBsb2NhbGUpO1xuXHRcdH1cbiAgICB9KTtcbn07XG5cblxuQXJyYXkucHJvdG90eXBlLmdldFByb3BlcnR5ID0gZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgdiA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2tdIDogbnVsbDtcbiAgICAgICAgdi5wdXNoKG0pO1xuICAgIH0pO1xuICAgIHJldHVybiB2O1xufVxuXG4vKlxuICog5re75YqgQXJyYXnnmoRyZW1vdmXlh73mlbBcbiAqL1xuQXJyYXkucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgIGlmIChmcm9tIDwgMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciByZXN0ID0gdGhpcy5zbGljZSgodG8gfHwgZnJvbSkgKyAxIHx8IHRoaXMubGVuZ3RoKTtcbiAgICB0aGlzLmxlbmd0aCA9IGZyb20gPCAwID8gdGhpcy5sZW5ndGggKyBmcm9tIDogZnJvbTtcbiAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIHJlc3QpO1xufTtcblxuLypcbiAqIOa3u+WKoEFycmF555qE6L+H5ruk5ZmoXG4gKiByZXR1cm4g56ym5ZCI5p2h5Lu255qE5a+56LGhQXJyYXlcbiAqL1xuQXJyYXkucHJvdG90eXBlLmZpbHRlclByb3BlcnR5ID0gZnVuY3Rpb24gKGgsIGwpIHtcbiAgICB2YXIgZyA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmIChcImlkXCIgaW4gbSkge1xuICAgICAgICAgICAgICAgICAgICBtID0gbVtcImlkXCJdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJfaWRcIiBpbiBtKSB7XG4gICAgICAgICAgICAgICAgICAgIG0gPSBtW1wiX2lkXCJdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGwgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIGQgPSAobCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogbC5pbmNsdWRlcyhtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZCA9IChsID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiBtID09IGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZCkge1xuICAgICAgICAgICAgZy5wdXNoKHQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGc7XG59XG5cbi8qXG4gKiDmt7vliqBBcnJheeeahOi/h+a7pOWZqFxuICogcmV0dXJuIOespuWQiOadoeS7tueahOesrOS4gOS4quWvueixoVxuICovXG5BcnJheS5wcm90b3R5cGUuZmluZFByb3BlcnR5QnlQSyA9IGZ1bmN0aW9uIChoLCBsKSB7XG4gICAgdmFyIHIgPSBudWxsO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICB2YXIgbSA9IHQgPyB0W2hdIDogbnVsbDtcbiAgICAgICAgdmFyIGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKG0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgZCA9IG0uaW5jbHVkZXMobCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkID0gKGwgPT09IHVuZGVmaW5lZCkgPyBmYWxzZSA6IG0gPT0gbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChkKSB7XG4gICAgICAgICAgICByID0gdDtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByO1xufSIsIlN0ZWVkb3MgPVxuXHRzZXR0aW5nczoge31cblx0ZGI6IGRiXG5cdHN1YnM6IHt9XG5cdGlzUGhvbmVFbmFibGVkOiAtPlxuXHRcdHJldHVybiAhIU1ldGVvci5zZXR0aW5ncz8ucHVibGljPy5waG9uZVxuXHRudW1iZXJUb1N0cmluZzogKG51bWJlciwgc2NhbGUsIG5vdFRob3VzYW5kcyktPlxuXHRcdGlmIHR5cGVvZiBudW1iZXIgPT0gXCJudW1iZXJcIlxuXHRcdFx0bnVtYmVyID0gbnVtYmVyLnRvU3RyaW5nKClcblxuXHRcdGlmICFudW1iZXJcblx0XHRcdHJldHVybiAnJztcblxuXHRcdGlmIG51bWJlciAhPSBcIk5hTlwiXG5cdFx0XHRpZiBzY2FsZSB8fCBzY2FsZSA9PSAwXG5cdFx0XHRcdG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpXG5cdFx0XHR1bmxlc3Mgbm90VGhvdXNhbmRzXG5cdFx0XHRcdGlmICEoc2NhbGUgfHwgc2NhbGUgPT0gMClcblx0XHRcdFx0XHQjIOayoeWumuS5iXNjYWxl5pe277yM5qC55o2u5bCP5pWw54K55L2N572u566X5Ye6c2NhbGXlgLxcblx0XHRcdFx0XHRzY2FsZSA9IG51bWJlci5tYXRjaCgvXFwuKFxcZCspLyk/WzFdPy5sZW5ndGhcblx0XHRcdFx0XHR1bmxlc3Mgc2NhbGVcblx0XHRcdFx0XHRcdHNjYWxlID0gMFxuXHRcdFx0XHRyZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2dcblx0XHRcdFx0aWYgc2NhbGUgPT0gMFxuXHRcdFx0XHRcdHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZ1xuXHRcdFx0XHRudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKVxuXHRcdFx0cmV0dXJuIG51bWJlclxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiBcIlwiXG5cdHZhbGlKcXVlcnlTeW1ib2xzOiAoc3RyKS0+XG5cdFx0IyByZWcgPSAvXlteIVwiIyQlJicoKSorLC4vOjs8PT4/QFtcXF1eYHt8fX5dKyQvZ1xuXHRcdHJlZyA9IG5ldyBSZWdFeHAoXCJeW14hXFxcIiMkJSYnKCkqXFwrLFxcLlxcLzo7PD0+P0BbXFxcXF1eYHt8fX5dKyRcIilcblx0XHRyZXR1cm4gcmVnLnRlc3Qoc3RyKVxuXHRhdXRoUmVxdWVzdDogKHVybCwgb3B0aW9ucykgLT5cblx0XHR1c2VyU2Vzc2lvbiA9IENyZWF0b3IuVVNFUl9DT05URVhUXG5cdFx0c3BhY2VJZCA9IHVzZXJTZXNzaW9uLnNwYWNlSWRcblx0XHRhdXRoVG9rZW4gPSBpZiB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gdGhlbiB1c2VyU2Vzc2lvbi5hdXRoVG9rZW4gZWxzZSB1c2VyU2Vzc2lvbi51c2VyLmF1dGhUb2tlblxuXHRcdHJlc3VsdCA9IG51bGxcblx0XHR1cmwgPSBTdGVlZG9zLmFic29sdXRlVXJsKHVybClcblx0XHR0cnlcblx0XHRcdGF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyBzcGFjZUlkICsgJywnICsgYXV0aFRva2VuXG5cdFx0XHRoZWFkZXJzID0gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0bmFtZTogJ0NvbnRlbnQtVHlwZSdcblx0XHRcdFx0XHR2YWx1ZTogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHRcdH1cblx0XHRcdFx0e1xuXHRcdFx0XHRcdG5hbWU6ICdBdXRob3JpemF0aW9uJ1xuXHRcdFx0XHRcdHZhbHVlOiBhdXRob3JpemF0aW9uXG5cdFx0XHRcdH1cblx0XHRcdF1cblx0XHRcdGRlZk9wdGlvbnMgPSBcblx0XHRcdHR5cGU6ICdnZXQnXG5cdFx0XHR1cmw6IHVybFxuXHRcdFx0ZGF0YVR5cGU6ICdqc29uJ1xuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJ1xuXHRcdFx0YmVmb3JlU2VuZDogKFhIUikgLT5cblx0XHRcdFx0aWYgaGVhZGVycyBhbmQgaGVhZGVycy5sZW5ndGhcblx0XHRcdFx0XHRyZXR1cm4gaGVhZGVycy5mb3JFYWNoKChoZWFkZXIpIC0+XG5cdFx0XHRcdFx0XHRYSFIuc2V0UmVxdWVzdEhlYWRlciBoZWFkZXIubmFtZSwgaGVhZGVyLnZhbHVlXG5cdFx0XHRcdFx0KVxuXHRcdFx0XHRyZXR1cm5cblx0XHRcdHN1Y2Nlc3M6IChkYXRhKSAtPlxuXHRcdFx0XHRyZXN1bHQgPSBkYXRhXG5cdFx0XHRcdHJldHVyblxuXHRcdFx0ZXJyb3I6IChYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIC0+XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OXG5cdFx0XHRcdGlmIFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTiBhbmQgWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OLmVycm9yXG5cdFx0XHRcdFx0ZXJyb3JJbmZvID0gWE1MSHR0cFJlcXVlc3QucmVzcG9uc2VKU09OLmVycm9yXG5cdFx0XHRcdFx0cmVzdWx0ID0gZXJyb3I6IGVycm9ySW5mb1xuXHRcdFx0XHRcdGVycm9yTXNnID0gdW5kZWZpbmVkXG5cdFx0XHRcdFx0aWYgZXJyb3JJbmZvLnJlYXNvblxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBlcnJvckluZm8ucmVhc29uXG5cdFx0XHRcdFx0ZWxzZSBpZiBlcnJvckluZm8ubWVzc2FnZVxuXHRcdFx0XHRcdFx0ZXJyb3JNc2cgPSBlcnJvckluZm8ubWVzc2FnZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGVycm9yTXNnID0gZXJyb3JJbmZvXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgdChlcnJvck1zZy5yZXBsYWNlKC86L2csICfvvJonKSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHRvYXN0ci5lcnJvciBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT05cblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQkLmFqYXggT2JqZWN0LmFzc2lnbih7fSwgZGVmT3B0aW9ucywgb3B0aW9ucylcblx0XHRcdHJldHVybiByZXN1bHRcblx0XHRjYXRjaCBlcnJcblx0XHRcdGNvbnNvbGUuZXJyb3IgZXJyXG5cdFx0XHR0b2FzdHIuZXJyb3IgZXJyXG5cdFx0cmV0dXJuXG5cbiMjI1xuIyBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiMgQG5hbWVzcGFjZSBTdGVlZG9zXG4jIyNcbiMgaWYgTWV0ZW9yLmlzQ29yZG92YVxuaWYgTWV0ZW9yLmlzQ29yZG92YSB8fCBNZXRlb3IuaXNDbGllbnRcblx0cm9vdFVybCA9IE1ldGVvci5hYnNvbHV0ZVVybC5kZWZhdWx0T3B0aW9ucy5yb290VXJsXG5cdGlmIHJvb3RVcmwuZW5kc1dpdGgoJy8nKVxuXHRcdHJvb3RVcmwgPSByb290VXJsLnN1YnN0cigwLCByb290VXJsLmxlbmd0aCAtIDEpXG5cblx0d2luZG93LnN0b3Jlcz8uQVBJPy5jbGllbnQ/LnNldFVybChyb290VXJsKVxuXHR3aW5kb3cuc3RvcmVzPy5TZXR0aW5ncz8uc2V0Um9vdFVybChyb290VXJsKVxuXHR3aW5kb3dbJ3N0ZWVkb3Muc2V0dGluZyddID0ge1xuXHRcdHJvb3RVcmw6IHJvb3RVcmxcblx0fVxuXG5pZiAhTWV0ZW9yLmlzQ29yZG92YSAmJiBNZXRlb3IuaXNDbGllbnRcblx0IyDphY3nva7mmK/lkKbmlrDnqpflj6PmiZPlvIDnmoTlhajlsYDlj5jph49cblx0TWV0ZW9yLnN0YXJ0dXAgKCktPlxuXHRcdHdpbmRvdy5zdG9yZXM/LlNldHRpbmdzPy5zZXRIcmVmUG9wdXAoTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8udWk/LmhyZWZfcG9wdXApXG5cbiMgaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdCMgTWV0ZW9yLmF1dG9ydW4gKCktPlxuXHQjIFx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldFVzZXJJZChTdGVlZG9zLnVzZXJJZCgpKVxuXHQjIFx0d2luZG93LnN0b3Jlcz8uU2V0dGluZ3M/LnNldFRlbmFudElkKFN0ZWVkb3Muc3BhY2VJZCgpKVxuXG5TdGVlZG9zLmdldEhlbHBVcmwgPSAobG9jYWxlKS0+XG5cdGNvdW50cnkgPSBsb2NhbGUuc3Vic3RyaW5nKDMpXG5cdHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIlxuXG5TdGVlZG9zLmlzRXhwcmVzc2lvbiA9IChmdW5jKSAtPlxuXHRpZiB0eXBlb2YgZnVuYyAhPSAnc3RyaW5nJ1xuXHRcdHJldHVybiBmYWxzZVxuXHRwYXR0ZXJuID0gL157eyguKyl9fSQvXG5cdHJlZzEgPSAvXnt7KGZ1bmN0aW9uLispfX0kL1xuXHRyZWcyID0gL157eyguKz0+LispfX0kL1xuXHRpZiB0eXBlb2YgZnVuYyA9PSAnc3RyaW5nJyBhbmQgZnVuYy5tYXRjaChwYXR0ZXJuKSBhbmQgIWZ1bmMubWF0Y2gocmVnMSkgYW5kICFmdW5jLm1hdGNoKHJlZzIpXG5cdFx0cmV0dXJuIHRydWVcblx0ZmFsc2VcblxuU3RlZWRvcy5wYXJzZVNpbmdsZUV4cHJlc3Npb24gPSAoZnVuYywgZm9ybURhdGEsIGRhdGFQYXRoLCBnbG9iYWwpIC0+XG5cdGdldFBhcmVudFBhdGggPSAocGF0aCkgLT5cblx0XHRpZiB0eXBlb2YgcGF0aCA9PSAnc3RyaW5nJ1xuXHRcdFx0cGF0aEFyciA9IHBhdGguc3BsaXQoJy4nKVxuXHRcdFx0aWYgcGF0aEFyci5sZW5ndGggPT0gMVxuXHRcdFx0XHRyZXR1cm4gJyMnXG5cdFx0XHRwYXRoQXJyLnBvcCgpXG5cdFx0XHRyZXR1cm4gcGF0aEFyci5qb2luKCcuJylcblx0XHRyZXR1cm4gJyMnXG5cdGdldFZhbHVlQnlQYXRoID0gKGZvcm1EYXRhLCBwYXRoKSAtPlxuXHRcdGlmIHBhdGggPT0gJyMnIG9yICFwYXRoXG5cdFx0XHRyZXR1cm4gZm9ybURhdGEgb3Ige31cblx0XHRlbHNlIGlmIHR5cGVvZiBwYXRoID09ICdzdHJpbmcnXG5cdFx0XHRyZXR1cm4gXy5nZXQoZm9ybURhdGEsIHBhdGgpXG5cdFx0ZWxzZVxuXHRcdFx0Y29uc29sZS5lcnJvciAncGF0aCBoYXMgdG8gYmUgYSBzdHJpbmcnXG5cdFx0cmV0dXJuXG5cdGlmIGZvcm1EYXRhID09IHVuZGVmaW5lZFxuXHRcdGZvcm1EYXRhID0ge31cblx0cGFyZW50UGF0aCA9IGdldFBhcmVudFBhdGgoZGF0YVBhdGgpXG5cdHBhcmVudCA9IGdldFZhbHVlQnlQYXRoKGZvcm1EYXRhLCBwYXJlbnRQYXRoKSBvciB7fVxuXHRpZiB0eXBlb2YgZnVuYyA9PSAnc3RyaW5nJ1xuXHRcdGZ1bmNCb2R5ID0gZnVuYy5zdWJzdHJpbmcoMiwgZnVuYy5sZW5ndGggLSAyKVxuXHRcdGdsb2JhbFRhZyA9ICdfX0dfTF9PX0JfQV9MX18nXG5cdFx0c3RyID0gJ1xcbiAgICByZXR1cm4gJyArIGZ1bmNCb2R5LnJlcGxhY2UoL1xcYmZvcm1EYXRhXFxiL2csIEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgZ2xvYmFsVGFnKSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIEpTT04uc3RyaW5naWZ5KGdsb2JhbCkpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXGInICsgZ2xvYmFsVGFnICsgJ1xcXFxiJywgJ2cnKSwgJ2dsb2JhbCcpLnJlcGxhY2UoL3Jvb3RWYWx1ZS9nLCBKU09OLnN0cmluZ2lmeShwYXJlbnQpKVxuXHRcdHRyeVxuXHRcdFx0cmV0dXJuIEZ1bmN0aW9uKHN0cikoKVxuXHRcdGNhdGNoIGVycm9yXG5cdFx0XHRjb25zb2xlLmxvZyBlcnJvciwgZnVuYywgZGF0YVBhdGhcblx0XHRcdHJldHVybiBmdW5jXG5cdGVsc2Vcblx0XHRyZXR1cm4gZnVuY1xuXHRyZXR1cm5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cblx0U3RlZWRvcy5zcGFjZVVwZ3JhZGVkTW9kYWwgPSAoKS0+XG5cdFx0c3dhbCh7dGl0bGU6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGl0bGVcIiksIHRleHQ6IFRBUGkxOG4uX18oXCJzcGFjZV9wYWlkX2luZm9fdGV4dFwiKSwgaHRtbDogdHJ1ZSwgdHlwZTpcIndhcm5pbmdcIiwgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKX0pO1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudEJnQm9keVZhbHVlID0gKCktPlxuXHRcdGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5OlwiYmdfYm9keVwifSlcblx0XHRpZiBhY2NvdW50QmdCb2R5XG5cdFx0XHRyZXR1cm4gYWNjb3VudEJnQm9keS52YWx1ZVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7fTtcblxuXHRTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gKGFjY291bnRCZ0JvZHlWYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpIG9yICFTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHQjIOWmguaenOaYr+ato+WcqOeZu+W9leS4reaIluWcqOeZu+W9leeVjOmdou+8jOWImeWPlmxvY2FsU3RvcmFnZeS4reiuvue9ru+8jOiAjOS4jeaYr+ebtOaOpeW6lOeUqOepuuiuvue9rlxuXHRcdFx0YWNjb3VudEJnQm9keVZhbHVlID0ge31cblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS51cmwgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRcdHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmxcblx0XHRhdmF0YXIgPSBhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXG5cdFx0IyBpZiBhY2NvdW50QmdCb2R5VmFsdWUudXJsXG5cdFx0IyBcdGlmIHVybCA9PSBhdmF0YXJcblx0XHQjIFx0XHRhdmF0YXJVcmwgPSAnYXBpL2ZpbGVzL2F2YXRhcnMvJyArIGF2YXRhclxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChhdmF0YXJVcmwpfSlcIlxuXHRcdCMgXHRlbHNlXG5cdFx0IyBcdFx0JChcImJvZHlcIikuY3NzIFwiYmFja2dyb3VuZEltYWdlXCIsXCJ1cmwoI3tTdGVlZG9zLmFic29sdXRlVXJsKHVybCl9KVwiXG5cdFx0IyBlbHNlXG5cdFx0IyBcdGJhY2tncm91bmQgPSBNZXRlb3Iuc2V0dGluZ3M/LnB1YmxpYz8uYWRtaW4/LmJhY2tncm91bmRcblx0XHQjIFx0aWYgYmFja2dyb3VuZFxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblx0XHQjIFx0ZWxzZVxuXHRcdCMgXHRcdGJhY2tncm91bmQgPSBcIi9wYWNrYWdlcy9zdGVlZG9zX3RoZW1lL2NsaWVudC9iYWNrZ3JvdW5kL3NlYS5qcGdcIlxuXHRcdCMgXHRcdCQoXCJib2R5XCIpLmNzcyBcImJhY2tncm91bmRJbWFnZVwiLFwidXJsKCN7U3RlZWRvcy5hYnNvbHV0ZVVybChiYWNrZ3JvdW5kKX0pXCJcblxuXHRcdGlmIGlzTmVlZFRvTG9jYWxcblx0XHRcdGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuXHRcdFx0XHQjIOato+WcqOeZu+W9leS4re+8jOWImeS4jeWBmuWkhOeQhu+8jOWboOS4uuatpOaXtlN0ZWVkb3MudXNlcklkKCnkuI3otrPkuo7or4HmmI7lt7LnmbvlvZXnirbmgIFcblx0XHRcdFx0cmV0dXJuXG5cdFx0XHQjIOi/memHjOeJueaEj+S4jeWcqGxvY2FsU3RvcmFnZeS4reWtmOWCqFN0ZWVkb3MudXNlcklkKCnvvIzlm6DkuLrpnIDopoHkv53or4HnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHRcdCMg55m75b2V55WM6Z2i5LiN6K6+572ubG9jYWxTdG9yYWdl77yM5Zug5Li655m75b2V55WM6Z2iYWNjb3VudEJnQm9keVZhbHVl6IKv5a6a5Li656m677yM6K6+572u55qE6K+d77yM5Lya6YCg5oiQ5peg5rOV5L+d5oyB55m75b2V55WM6Z2i5Lmf5bqU55SobG9jYWxTdG9yYWdl5Lit55qE6K6+572uXG5cdFx0XHRpZiBTdGVlZG9zLnVzZXJJZCgpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiLHVybClcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIixhdmF0YXIpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS51cmxcIilcblx0XHRcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIilcblxuXHRTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSAoKS0+XG5cdFx0YWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHt1c2VyOlN0ZWVkb3MudXNlcklkKCksa2V5Olwic2tpblwifSlcblx0XHRpZiBhY2NvdW50U2tpblxuXHRcdFx0cmV0dXJuIGFjY291bnRTa2luLnZhbHVlXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIHt9O1xuXG5cdFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9ICgpLT5cblx0XHRhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe3VzZXI6U3RlZWRvcy51c2VySWQoKSxrZXk6XCJ6b29tXCJ9KVxuXHRcdGlmIGFjY291bnRab29tXG5cdFx0XHRyZXR1cm4gYWNjb3VudFpvb20udmFsdWVcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge307XG5cblx0U3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSAoYWNjb3VudFpvb21WYWx1ZSxpc05lZWRUb0xvY2FsKS0+XG5cdFx0IyBpZiBNZXRlb3IubG9nZ2luZ0luKCkgb3IgIVN0ZWVkb3MudXNlcklkKClcblx0XHQjIFx0IyDlpoLmnpzmmK/mraPlnKjnmbvlvZXkuK3miJblnKjnmbvlvZXnlYzpnaLvvIzliJnlj5Zsb2NhbFN0b3JhZ2XkuK3orr7nva7vvIzogIzkuI3mmK/nm7TmjqXlupTnlKjnqbrorr7nva5cblx0XHQjIFx0YWNjb3VudFpvb21WYWx1ZSA9IHt9XG5cdFx0IyBcdGFjY291bnRab29tVmFsdWUubmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5uYW1lXCIpXG5cdFx0IyBcdGFjY291bnRab29tVmFsdWUuc2l6ZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudFpvb21WYWx1ZS5zaXplXCIpXG5cdFx0IyAkKFwiYm9keVwiKS5yZW1vdmVDbGFzcyhcInpvb20tbm9ybWFsXCIpLnJlbW92ZUNsYXNzKFwiem9vbS1sYXJnZVwiKS5yZW1vdmVDbGFzcyhcInpvb20tZXh0cmEtbGFyZ2VcIik7XG5cdFx0IyB6b29tTmFtZSA9IGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdCMgem9vbVNpemUgPSBhY2NvdW50Wm9vbVZhbHVlLnNpemVcblx0XHQjIHVubGVzcyB6b29tTmFtZVxuXHRcdCMgXHR6b29tTmFtZSA9IFwibGFyZ2VcIlxuXHRcdCMgXHR6b29tU2l6ZSA9IDEuMlxuXHRcdCMgaWYgem9vbU5hbWUgJiYgIVNlc3Npb24uZ2V0KFwiaW5zdGFuY2VQcmludFwiKVxuXHRcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHQjIFx0IyBpZiBTdGVlZG9zLmlzTm9kZSgpXG5cdFx0IyBcdCMgXHRpZiBhY2NvdW50Wm9vbVZhbHVlLnNpemUgPT0gXCIxXCJcblx0XHQjIFx0IyBcdFx0IyBub2RlLXdlYmtpdOS4rXNpemXkuLow5omN6KGo56S6MTAwJVxuXHRcdCMgXHQjIFx0XHR6b29tU2l6ZSA9IDBcblx0XHQjIFx0IyBcdG53LldpbmRvdy5nZXQoKS56b29tTGV2ZWwgPSBOdW1iZXIucGFyc2VGbG9hdCh6b29tU2l6ZSlcblx0XHQjIFx0IyBlbHNlXG5cdFx0IyBcdCMgXHQkKFwiYm9keVwiKS5hZGRDbGFzcyhcInpvb20tI3t6b29tTmFtZX1cIilcblx0XHQjIGlmIGlzTmVlZFRvTG9jYWxcblx0XHQjIFx0aWYgTWV0ZW9yLmxvZ2dpbmdJbigpXG5cdFx0IyBcdFx0IyDmraPlnKjnmbvlvZXkuK3vvIzliJnkuI3lgZrlpITnkIbvvIzlm6DkuLrmraTml7ZTdGVlZG9zLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG5cdFx0IyBcdFx0cmV0dXJuXG5cdFx0IyBcdCMg6L+Z6YeM54m55oSP5LiN5ZyobG9jYWxTdG9yYWdl5Lit5a2Y5YKoU3RlZWRvcy51c2VySWQoKe+8jOWboOS4uumcgOimgeS/neivgeeZu+W9leeVjOmdouS5n+W6lOeUqGxvY2FsU3RvcmFnZeS4reeahOiuvue9rlxuXHRcdCMgXHQjIOeZu+W9leeVjOmdouS4jeiuvue9rmxvY2FsU3RvcmFnZe+8jOWboOS4uueZu+W9leeVjOmdomFjY291bnRab29tVmFsdWXogq/lrprkuLrnqbrvvIzorr7nva7nmoTor53vvIzkvJrpgKDmiJDml6Dms5Xkv53mjIHnmbvlvZXnlYzpnaLkuZ/lupTnlKhsb2NhbFN0b3JhZ2XkuK3nmoTorr7nva5cblx0XHQjIFx0aWYgU3RlZWRvcy51c2VySWQoKVxuXHRcdCMgXHRcdGlmIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdCMgXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLm5hbWVcIixhY2NvdW50Wm9vbVZhbHVlLm5hbWUpXG5cdFx0IyBcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImFjY291bnRab29tVmFsdWUuc2l6ZVwiLGFjY291bnRab29tVmFsdWUuc2l6ZSlcblx0XHQjIFx0XHRlbHNlXG5cdFx0IyBcdFx0XHRsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImFjY291bnRab29tVmFsdWUubmFtZVwiKVxuXHRcdCMgXHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50Wm9vbVZhbHVlLnNpemVcIilcblxuXHRTdGVlZG9zLnNob3dIZWxwID0gKHVybCktPlxuXHRcdGxvY2FsZSA9IFN0ZWVkb3MuZ2V0TG9jYWxlKClcblx0XHRjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKVxuXG5cdFx0dXJsID0gdXJsIHx8IFwiaHR0cDovL3d3dy5zdGVlZG9zLmNvbS9cIiArIGNvdW50cnkgKyBcIi9oZWxwL1wiXG5cblx0XHR3aW5kb3cub3Blbih1cmwsICdfaGVscCcsICdFbmFibGVWaWV3UG9ydFNjYWxlPXllcycpXG5cblx0U3RlZWRvcy5nZXRVcmxXaXRoVG9rZW4gPSAodXJsKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cblx0XHRsaW5rZXIgPSBcIj9cIlxuXG5cdFx0aWYgdXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdGxpbmtlciA9IFwiJlwiXG5cblx0XHRyZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4gPSAoYXBwX2lkKS0+XG5cdFx0YXV0aFRva2VuID0ge307XG5cdFx0YXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpXG5cdFx0YXV0aFRva2VuW1wiWC1Vc2VyLUlkXCJdID0gTWV0ZW9yLnVzZXJJZCgpO1xuXHRcdGF1dGhUb2tlbltcIlgtQXV0aC1Ub2tlblwiXSA9IEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCk7XG5cdFx0cmV0dXJuIFwiYXBpL3NldHVwL3Nzby9cIiArIGFwcF9pZCArIFwiP1wiICsgJC5wYXJhbShhdXRoVG9rZW4pXG5cblx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gKGFwcF9pZCktPlxuXHRcdHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdHVybCA9IFN0ZWVkb3MuYWJzb2x1dGVVcmwgdXJsXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXG5cdFx0aWYgIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybFxuXHRcdGVsc2Vcblx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuXG5cdFN0ZWVkb3Mub3BlblVybFdpdGhJRSA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdGlmIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdFx0ZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjXG5cdFx0XHRcdG9wZW5fdXJsID0gdXJsXG5cdFx0XHRcdGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCIje29wZW5fdXJsfVxcXCJcIlxuXHRcdFx0XHRleGVjIGNtZCwgKGVycm9yLCBzdGRvdXQsIHN0ZGVycikgLT5cblx0XHRcdFx0XHRpZiBlcnJvclxuXHRcdFx0XHRcdFx0dG9hc3RyLmVycm9yIGVycm9yXG5cdFx0XHRcdFx0cmV0dXJuXG5cdFx0XHRlbHNlXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpXG5cblxuXHRTdGVlZG9zLm9wZW5BcHAgPSAoYXBwX2lkKS0+XG5cdFx0aWYgIU1ldGVvci51c2VySWQoKVxuXHRcdFx0U3RlZWRvcy5yZWRpcmVjdFRvU2lnbkluKClcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKVxuXHRcdGlmICFhcHBcblx0XHRcdEZsb3dSb3V0ZXIuZ28oXCIvXCIpXG5cdFx0XHRyZXR1cm5cblxuXHRcdCMgY3JlYXRvclNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ud2Vic2VydmljZXM/LmNyZWF0b3Jcblx0XHQjIGlmIGFwcC5faWQgPT0gXCJhZG1pblwiIGFuZCBjcmVhdG9yU2V0dGluZ3M/LnN0YXR1cyA9PSBcImFjdGl2ZVwiXG5cdFx0IyBcdHVybCA9IGNyZWF0b3JTZXR0aW5ncy51cmxcblx0XHQjIFx0cmVnID0gL1xcLyQvXG5cdFx0IyBcdHVubGVzcyByZWcudGVzdCB1cmxcblx0XHQjIFx0XHR1cmwgKz0gXCIvXCJcblx0XHQjIFx0dXJsID0gXCIje3VybH1hcHAvYWRtaW5cIlxuXHRcdCMgXHRTdGVlZG9zLm9wZW5XaW5kb3codXJsKVxuXHRcdCMgXHRyZXR1cm5cblxuXHRcdG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrXG5cdFx0aWYgYXBwLmlzX3VzZV9pZVxuXHRcdFx0aWYgU3RlZWRvcy5pc05vZGUoKVxuXHRcdFx0XHRleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWNcblx0XHRcdFx0aWYgb25fY2xpY2tcblx0XHRcdFx0XHRwYXRoID0gXCJhcGkvYXBwL3Nzby8je2FwcF9pZH0/YXV0aFRva2VuPSN7QWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKX0mdXNlcklkPSN7TWV0ZW9yLnVzZXJJZCgpfVwiXG5cdFx0XHRcdFx0b3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcGVuX3VybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuIGFwcF9pZFxuXHRcdFx0XHRcdG9wZW5fdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArIFwiL1wiICsgb3Blbl91cmxcblx0XHRcdFx0Y21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIiN7b3Blbl91cmx9XFxcIlwiXG5cdFx0XHRcdGV4ZWMgY21kLCAoZXJyb3IsIHN0ZG91dCwgc3RkZXJyKSAtPlxuXHRcdFx0XHRcdGlmIGVycm9yXG5cdFx0XHRcdFx0XHR0b2FzdHIuZXJyb3IgZXJyb3Jcblx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdGVsc2Vcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGVsc2UgaWYgZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpXG5cdFx0XHRGbG93Um91dGVyLmdvKGFwcC51cmwpXG5cblx0XHRlbHNlIGlmIGFwcC5pc191c2VfaWZyYW1lXG5cdFx0XHRpZiBhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpXG5cdFx0XHRcdFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSlcblx0XHRcdGVsc2UgaWYgU3RlZWRvcy5pc01vYmlsZSgpIHx8IFN0ZWVkb3MuaXNDb3Jkb3ZhKClcblx0XHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblx0XHRcdGVsc2Vcblx0XHRcdFx0Rmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS8je2FwcC5faWR9XCIpXG5cblx0XHRlbHNlIGlmIG9uX2NsaWNrXG5cdFx0XHQjIOi/memHjOaJp+ihjOeahOaYr+S4gOS4quS4jeW4puWPguaVsOeahOmXreWMheWHveaVsO+8jOeUqOadpemBv+WFjeWPmOmHj+axoeafk1xuXHRcdFx0ZXZhbEZ1blN0cmluZyA9IFwiKGZ1bmN0aW9uKCl7I3tvbl9jbGlja319KSgpXCJcblx0XHRcdHRyeVxuXHRcdFx0XHRldmFsKGV2YWxGdW5TdHJpbmcpXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdCMganVzdCBjb25zb2xlIHRoZSBlcnJvciB3aGVuIGNhdGNoIGVycm9yXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJjYXRjaCBzb21lIGVycm9yIHdoZW4gZXZhbCB0aGUgb25fY2xpY2sgc2NyaXB0IGZvciBhcHAgbGluazpcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiI3tlLm1lc3NhZ2V9XFxyXFxuI3tlLnN0YWNrfVwiXG5cdFx0ZWxzZVxuXHRcdFx0U3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuKGFwcF9pZClcblxuXHRcdGlmICFhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpICYmICFhcHAuaXNfdXNlX2llICYmICFvbl9jbGlja1xuXHRcdFx0IyDpnIDopoHpgInkuK3lvZPliY1hcHDml7bvvIxvbl9jbGlja+WHveaVsOmHjOimgeWNleeLrOWKoOS4ilNlc3Npb24uc2V0KFwiY3VycmVudF9hcHBfaWRcIiwgYXBwX2lkKVxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpXG5cblx0U3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IChzcGFjZUlkKS0+XG5cdFx0dW5sZXNzIHNwYWNlSWRcblx0XHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdG1pbl9tb250aHMgPSAxXG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0bWluX21vbnRocyA9IDNcblx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpXG5cdFx0ZW5kX2RhdGUgPSBzcGFjZT8uZW5kX2RhdGVcblx0XHRpZiBzcGFjZSAmJiBlbmRfZGF0ZSAhPSB1bmRlZmluZWQgYW5kIChlbmRfZGF0ZSAtIG5ldyBEYXRlKSA8PSAobWluX21vbnRocyozMCoyNCozNjAwKjEwMDApXG5cdFx0XHQjIOaPkOekuueUqOaIt+S9memineS4jei2s1xuXHRcdFx0dG9hc3RyLmVycm9yIHQoXCJzcGFjZV9iYWxhbmNlX2luc3VmZmljaWVudFwiKVxuXG5cdFN0ZWVkb3Muc2V0TW9kYWxNYXhIZWlnaHQgPSAoKS0+XG5cdFx0YWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpXG5cdFx0dW5sZXNzIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0YWNjb3VudFpvb21WYWx1ZS5uYW1lID0gJ2xhcmdlJ1xuXHRcdHN3aXRjaCBhY2NvdW50Wm9vbVZhbHVlLm5hbWVcblx0XHRcdHdoZW4gJ25vcm1hbCdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTEyXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvZmZzZXQgPSA3NVxuXHRcdFx0d2hlbiAnbGFyZ2UnXG5cdFx0XHRcdGlmIFN0ZWVkb3MuaXNNb2JpbGUoKVxuXHRcdFx0XHRcdG9mZnNldCA9IC02XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAxOTlcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA5XG5cdFx0XHR3aGVuICdleHRyYS1sYXJnZSdcblx0XHRcdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRcdFx0b2Zmc2V0ID0gLTI2XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHQjIOWMuuWIhklF5rWP6KeI5ZmoXG5cdFx0XHRcdFx0aWYgU3RlZWRvcy5kZXRlY3RJRSgpXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSAzMDNcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvZmZzZXQgPSA1M1xuXG5cdFx0aWYgJChcIi5tb2RhbFwiKS5sZW5ndGhcblx0XHRcdCQoXCIubW9kYWxcIikuZWFjaCAtPlxuXHRcdFx0XHRoZWFkZXJIZWlnaHQgPSAwXG5cdFx0XHRcdGZvb3RlckhlaWdodCA9IDBcblx0XHRcdFx0dG90YWxIZWlnaHQgPSAwXG5cdFx0XHRcdCQoXCIubW9kYWwtaGVhZGVyXCIsICQodGhpcykpLmVhY2ggLT5cblx0XHRcdFx0XHRoZWFkZXJIZWlnaHQgKz0gJCh0aGlzKS5vdXRlckhlaWdodChmYWxzZSlcblx0XHRcdFx0JChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaCAtPlxuXHRcdFx0XHRcdGZvb3RlckhlaWdodCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KGZhbHNlKVxuXG5cdFx0XHRcdHRvdGFsSGVpZ2h0ID0gaGVhZGVySGVpZ2h0ICsgZm9vdGVySGVpZ2h0XG5cdFx0XHRcdGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldFxuXHRcdFx0XHRpZiAkKHRoaXMpLmhhc0NsYXNzKFwiY2ZfY29udGFjdF9tb2RhbFwiKVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCIje2hlaWdodH1weFwifSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdCQoXCIubW9kYWwtYm9keVwiLCQodGhpcykpLmNzcyh7XCJtYXgtaGVpZ2h0XCI6IFwiI3toZWlnaHR9cHhcIiwgXCJoZWlnaHRcIjogXCJhdXRvXCJ9KVxuXG5cdFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSAob2Zmc2V0KS0+XG5cdFx0aWYgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHRyZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNVxuXHRcdGVsc2Vcblx0XHRcdHJlVmFsdWUgPSAkKHdpbmRvdykuaGVpZ2h0KCkgLSAxODAgLSAyNVxuXHRcdHVubGVzcyBTdGVlZG9zLmlzaU9TKCkgb3IgU3RlZWRvcy5pc01vYmlsZSgpXG5cdFx0XHQjIGlvc+WPiuaJi+acuuS4iuS4jemcgOimgeS4unpvb23mlL7lpKflip/og73pop3lpJborqHnrpdcblx0XHRcdGFjY291bnRab29tVmFsdWUgPSBTdGVlZG9zLmdldEFjY291bnRab29tVmFsdWUoKVxuXHRcdFx0c3dpdGNoIGFjY291bnRab29tVmFsdWUubmFtZVxuXHRcdFx0XHR3aGVuICdsYXJnZSdcblx0XHRcdFx0XHQjIOa1i+S4i+adpei/memHjOS4jemcgOimgemineWkluWHj+aVsFxuXHRcdFx0XHRcdHJlVmFsdWUgLT0gNTBcblx0XHRcdFx0d2hlbiAnZXh0cmEtbGFyZ2UnXG5cdFx0XHRcdFx0cmVWYWx1ZSAtPSAxNDVcblx0XHRpZiBvZmZzZXRcblx0XHRcdHJlVmFsdWUgLT0gb2Zmc2V0XG5cdFx0cmV0dXJuIHJlVmFsdWUgKyBcInB4XCI7XG5cblx0U3RlZWRvcy5pc2lPUyA9ICh1c2VyQWdlbnQsIGxhbmd1YWdlKS0+XG5cdFx0REVWSUNFID1cblx0XHRcdGFuZHJvaWQ6ICdhbmRyb2lkJ1xuXHRcdFx0YmxhY2tiZXJyeTogJ2JsYWNrYmVycnknXG5cdFx0XHRkZXNrdG9wOiAnZGVza3RvcCdcblx0XHRcdGlwYWQ6ICdpcGFkJ1xuXHRcdFx0aXBob25lOiAnaXBob25lJ1xuXHRcdFx0aXBvZDogJ2lwb2QnXG5cdFx0XHRtb2JpbGU6ICdtb2JpbGUnXG5cdFx0YnJvd3NlciA9IHt9XG5cdFx0Y29uRXhwID0gJyg/OltcXFxcLzpcXFxcOjpcXFxcczo7XSknXG5cdFx0bnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknXG5cdFx0dXNlckFnZW50ID0gKHVzZXJBZ2VudCBvciBuYXZpZ2F0b3IudXNlckFnZW50KS50b0xvd2VyQ2FzZSgpXG5cdFx0bGFuZ3VhZ2UgPSBsYW5ndWFnZSBvciBuYXZpZ2F0b3IubGFuZ3VhZ2Ugb3IgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZVxuXHRcdGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIG9yIHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSBvciBbXG5cdFx0XHQnJ1xuXHRcdFx0REVWSUNFLmRlc2t0b3Bcblx0XHRdXG5cdFx0YnJvd3Nlci5kZXZpY2UgPSBkZXZpY2VbMV1cblx0XHRyZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwYWQgb3IgYnJvd3Nlci5kZXZpY2UgPT0gREVWSUNFLmlwaG9uZSBvciBicm93c2VyLmRldmljZSA9PSBERVZJQ0UuaXBvZFxuXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHVzZXJJZCA9IE1ldGVvci51c2VySWQoKVxuXHRcdHNwYWNlSWQgPSBTdGVlZG9zLnNwYWNlSWQoKVxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG5cdFN0ZWVkb3MuZm9yYmlkTm9kZUNvbnRleHRtZW51ID0gKHRhcmdldCwgaWZyKS0+XG5cdFx0dW5sZXNzIFN0ZWVkb3MuaXNOb2RlKClcblx0XHRcdHJldHVyblxuXHRcdHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIgJ2NvbnRleHRtZW51JywgKGV2KSAtPlxuXHRcdFx0ZXYucHJldmVudERlZmF1bHQoKVxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0aWYgaWZyXG5cdFx0XHRpZiB0eXBlb2YgaWZyID09ICdzdHJpbmcnXG5cdFx0XHRcdGlmciA9IHRhcmdldC4kKGlmcilcblx0XHRcdGlmci5sb2FkIC0+XG5cdFx0XHRcdGlmckJvZHkgPSBpZnIuY29udGVudHMoKS5maW5kKCdib2R5Jylcblx0XHRcdFx0aWYgaWZyQm9keVxuXHRcdFx0XHRcdGlmckJvZHlbMF0uYWRkRXZlbnRMaXN0ZW5lciAnY29udGV4dG1lbnUnLCAoZXYpIC0+XG5cdFx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2VcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3MuZ2V0VXNlck9yZ2FuaXphdGlvbnMgPSAoc3BhY2VJZCx1c2VySWQsaXNJbmNsdWRlUGFyZW50cyktPlxuXHRcdHNwYWNlX3VzZXIgPSBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOnVzZXJJZCxzcGFjZTpzcGFjZUlkfSxmaWVsZHM6e29yZ2FuaXphdGlvbnM6MX0pXG5cdFx0b3JnYW5pemF0aW9ucyA9IHNwYWNlX3VzZXI/Lm9yZ2FuaXphdGlvbnNcblx0XHR1bmxlc3Mgb3JnYW5pemF0aW9uc1xuXHRcdFx0cmV0dXJuIFtdXG5cdFx0aWYgaXNJbmNsdWRlUGFyZW50c1xuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBkYi5vcmdhbml6YXRpb25zLmZpbmQoX2lkOnskaW46b3JnYW5pemF0aW9uc30pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJwYXJlbnRzXCIpXG5cdFx0XHRyZXR1cm4gXy51bmlvbiBvcmdhbml6YXRpb25zLHBhcmVudHNcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gb3JnYW5pemF0aW9uc1xuXG4jXHRTdGVlZG9zLmNoYXJnZUFQSWNoZWNrID0gKHNwYWNlSWQpLT5cblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHQjVE9ETyDmt7vliqDmnI3liqHnq6/mmK/lkKbmiYvmnLrnmoTliKTmlq0o5L6d5o2ucmVxdWVzdClcblx0U3RlZWRvcy5pc01vYmlsZSA9ICgpLT5cblx0XHRyZXR1cm4gZmFsc2U7XG5cblx0U3RlZWRvcy5pc1NwYWNlQWRtaW4gPSAoc3BhY2VJZCwgdXNlcklkKS0+XG5cdFx0aWYgIXNwYWNlSWQgfHwgIXVzZXJJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0c3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKVxuXHRcdGlmICFzcGFjZSB8fCAhc3BhY2UuYWRtaW5zXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0cmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCk+PTBcblxuXHRTdGVlZG9zLmlzTGVnYWxWZXJzaW9uID0gKHNwYWNlSWQsYXBwX3ZlcnNpb24pLT5cblx0XHRpZiAhc3BhY2VJZFxuXHRcdFx0cmV0dXJuIGZhbHNlXG5cdFx0Y2hlY2sgPSBmYWxzZVxuXHRcdG1vZHVsZXMgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKT8ubW9kdWxlc1xuXHRcdGlmIG1vZHVsZXMgYW5kIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pXG5cdFx0XHRjaGVjayA9IHRydWVcblx0XHRyZXR1cm4gY2hlY2tcblxuXHQjIOWIpOaWreaVsOe7hG9yZ0lkc+S4reeahG9yZyBpZOmbhuWQiOWvueS6jueUqOaIt3VzZXJJZOaYr+WQpuaciee7hOe7h+euoeeQhuWRmOadg+mZkO+8jOWPquimgeaVsOe7hG9yZ0lkc+S4reS7u+S9leS4gOS4que7hOe7h+acieadg+mZkOWwsei/lOWbnnRydWXvvIzlj43kuYvov5Tlm55mYWxzZVxuXHRTdGVlZG9zLmlzT3JnQWRtaW5CeU9yZ0lkcyA9IChvcmdJZHMsIHVzZXJJZCktPlxuXHRcdGlzT3JnQWRtaW4gPSBmYWxzZVxuXHRcdHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe19pZDogeyRpbjpvcmdJZHN9fSx7ZmllbGRzOntwYXJlbnRzOjEsYWRtaW5zOjF9fSkuZmV0Y2goKVxuXHRcdHBhcmVudHMgPSBbXVxuXHRcdGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyIChvcmcpIC0+XG5cdFx0XHRpZiBvcmcucGFyZW50c1xuXHRcdFx0XHRwYXJlbnRzID0gXy51bmlvbiBwYXJlbnRzLG9yZy5wYXJlbnRzXG5cdFx0XHRyZXR1cm4gb3JnLmFkbWlucz8uaW5jbHVkZXModXNlcklkKVxuXHRcdGlmIGFsbG93QWNjZXNzT3Jncy5sZW5ndGhcblx0XHRcdGlzT3JnQWRtaW4gPSB0cnVlXG5cdFx0ZWxzZVxuXHRcdFx0cGFyZW50cyA9IF8uZmxhdHRlbiBwYXJlbnRzXG5cdFx0XHRwYXJlbnRzID0gXy51bmlxIHBhcmVudHNcblx0XHRcdGlmIHBhcmVudHMubGVuZ3RoIGFuZCBkYi5vcmdhbml6YXRpb25zLmZpbmRPbmUoe19pZDp7JGluOnBhcmVudHN9LCBhZG1pbnM6dXNlcklkfSlcblx0XHRcdFx0aXNPcmdBZG1pbiA9IHRydWVcblx0XHRyZXR1cm4gaXNPcmdBZG1pblxuXG5cblx0IyDliKTmlq3mlbDnu4RvcmdJZHPkuK3nmoRvcmcgaWTpm4blkIjlr7nkuo7nlKjmiLd1c2VySWTmmK/lkKbmnInlhajpg6jnu4Tnu4fnrqHnkIblkZjmnYPpmZDvvIzlj6rmnInmlbDnu4RvcmdJZHPkuK3mr4/kuKrnu4Tnu4fpg73mnInmnYPpmZDmiY3ov5Tlm550cnVl77yM5Y+N5LmL6L+U5ZueZmFsc2Vcblx0U3RlZWRvcy5pc09yZ0FkbWluQnlBbGxPcmdJZHMgPSAob3JnSWRzLCB1c2VySWQpLT5cblx0XHR1bmxlc3Mgb3JnSWRzLmxlbmd0aFxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHRpID0gMFxuXHRcdHdoaWxlIGkgPCBvcmdJZHMubGVuZ3RoXG5cdFx0XHRpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgW29yZ0lkc1tpXV0sIHVzZXJJZFxuXHRcdFx0dW5sZXNzIGlzT3JnQWRtaW5cblx0XHRcdFx0YnJlYWtcblx0XHRcdGkrK1xuXHRcdHJldHVybiBpc09yZ0FkbWluXG5cblx0U3RlZWRvcy5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cblx0XHRpZiB1cmxcblx0XHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXG5cdFx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXG5cdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdFx0ZWxzZVxuXHRcdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRcdHRyeVxuXHRcdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcblx0XHRcdFx0XHRpZiB1cmxcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxuXHRcdFx0XHRjYXRjaCBlXG5cdFx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cblx0I1x06YCa6L+HcmVxdWVzdC5oZWFkZXJz44CBY29va2llIOiOt+W+l+acieaViOeUqOaIt1xuXHRTdGVlZG9zLmdldEFQSUxvZ2luVXNlclx0PSAocmVxLCByZXMpIC0+XG5cblx0XHR1c2VybmFtZSA9IHJlcS5xdWVyeT8udXNlcm5hbWVcblxuXHRcdHBhc3N3b3JkID0gcmVxLnF1ZXJ5Py5wYXNzd29yZFxuXG5cdFx0aWYgdXNlcm5hbWUgJiYgcGFzc3dvcmRcblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtzdGVlZG9zX2lkOiB1c2VybmFtZX0pXG5cblx0XHRcdGlmICF1c2VyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0XHRyZXN1bHQgPSBBY2NvdW50cy5fY2hlY2tQYXNzd29yZCB1c2VyLCBwYXNzd29yZFxuXG5cdFx0XHRpZiByZXN1bHQuZXJyb3Jcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKHJlc3VsdC5lcnJvcilcblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHVzZXJcblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeT9bXCJYLVVzZXItSWRcIl1cblxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeT9bXCJYLUF1dGgtVG9rZW5cIl1cblxuXHRcdGlmIFN0ZWVkb3MuY2hlY2tBdXRoVG9rZW4odXNlcklkLGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuXG5cdFx0aWYgcmVxLmhlYWRlcnNcblx0XHRcdHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1tcIngtYXV0aC10b2tlblwiXVxuXG5cdFx0IyB0aGVuIGNoZWNrIGNvb2tpZVxuXHRcdGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHRcdFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0XHRcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHJldHVybiBmYWxzZVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRyZXR1cm4gZmFsc2VcblxuXHQjXHTmo4Dmn6V1c2VySWTjgIFhdXRoVG9rZW7mmK/lkKbmnInmlYhcblx0U3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9ICh1c2VySWQsIGF1dGhUb2tlbikgLT5cblx0XHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxuXHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXG5cdFx0XHRcdF9pZDogdXNlcklkLFxuXHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0aWYgdXNlclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2Vcblx0XHRyZXR1cm4gZmFsc2VcblxuXG5pZiBNZXRlb3IuaXNTZXJ2ZXJcblx0Y3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cdFN0ZWVkb3MuZGVjcnlwdCA9IChwYXNzd29yZCwga2V5LCBpdiktPlxuXHRcdHRyeVxuXHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRsZW4gPSBrZXkubGVuZ3RoXG5cdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0XHRjID0gXCIgXCIgKyBjXG5cdFx0XHRcdFx0aSsrXG5cdFx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpXG5cblx0XHRcdGRlY2lwaGVyID0gY3J5cHRvLmNyZWF0ZURlY2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSlcblxuXHRcdFx0ZGVjaXBoZXJNc2cgPSBCdWZmZXIuY29uY2F0KFtkZWNpcGhlci51cGRhdGUocGFzc3dvcmQsICdiYXNlNjQnKSwgZGVjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcblx0XHRcdHJldHVybiBwYXNzd29yZDtcblx0XHRjYXRjaCBlXG5cdFx0XHRyZXR1cm4gcGFzc3dvcmQ7XG5cblx0U3RlZWRvcy5lbmNyeXB0ID0gKHBhc3N3b3JkLCBrZXksIGl2KS0+XG5cdFx0a2V5MzIgPSBcIlwiXG5cdFx0bGVuID0ga2V5Lmxlbmd0aFxuXHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRjID0gXCJcIlxuXHRcdFx0aSA9IDBcblx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0d2hpbGUgaSA8IG1cblx0XHRcdFx0YyA9IFwiIFwiICsgY1xuXHRcdFx0XHRpKytcblx0XHRcdGtleTMyID0ga2V5ICsgY1xuXHRcdGVsc2UgaWYgbGVuID49IDMyXG5cdFx0XHRrZXkzMiA9IGtleS5zbGljZSgwLCAzMilcblxuXHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0Y2lwaGVyZWRNc2cgPSBCdWZmZXIuY29uY2F0KFtjaXBoZXIudXBkYXRlKG5ldyBCdWZmZXIocGFzc3dvcmQsICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKVxuXG5cdFx0cmV0dXJuIHBhc3N3b3JkO1xuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gKGFjY2Vzc190b2tlbiktPlxuXG5cdFx0aWYgIWFjY2Vzc190b2tlblxuXHRcdFx0cmV0dXJuIG51bGw7XG5cblx0XHR1c2VySWQgPSBhY2Nlc3NfdG9rZW4uc3BsaXQoXCItXCIpWzBdXG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhY2Nlc3NfdG9rZW4pXG5cblx0XHR1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VySWQsIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlbn0pXG5cblx0XHRpZiB1c2VyXG5cdFx0XHRyZXR1cm4gdXNlcklkXG5cdFx0ZWxzZVxuXHRcdFx0IyDlpoLmnpx1c2Vy6KGo5pyq5p+l5Yiw77yM5YiZ5L2/55Sob2F1dGgy5Y2P6K6u55Sf5oiQ55qEdG9rZW7mn6Xmib7nlKjmiLdcblx0XHRcdGNvbGxlY3Rpb24gPSBvQXV0aDJTZXJ2ZXIuY29sbGVjdGlvbnMuYWNjZXNzVG9rZW5cblxuXHRcdFx0b2JqID0gY29sbGVjdGlvbi5maW5kT25lKHsnYWNjZXNzVG9rZW4nOiBhY2Nlc3NfdG9rZW59KVxuXHRcdFx0aWYgb2JqXG5cdFx0XHRcdCMg5Yik5patdG9rZW7nmoTmnInmlYjmnJ9cblx0XHRcdFx0aWYgb2JqPy5leHBpcmVzIDwgbmV3IERhdGUoKVxuXHRcdFx0XHRcdHJldHVybiBcIm9hdXRoMiBhY2Nlc3MgdG9rZW46XCIrYWNjZXNzX3Rva2VuK1wiIGlzIGV4cGlyZWQuXCJcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJldHVybiBvYmo/LnVzZXJJZFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiK2FjY2Vzc190b2tlbitcIiBpcyBub3QgZm91bmQuXCJcblx0XHRyZXR1cm4gbnVsbFxuXG5cdFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXG5cdFx0dXNlcklkID0gcmVxLnF1ZXJ5P1tcIlgtVXNlci1JZFwiXVxuXG5cdFx0YXV0aFRva2VuID0gcmVxLnF1ZXJ5P1tcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsYXV0aFRva2VuKVxuXHRcdFx0cmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe19pZDogdXNlcklkfSk/Ll9pZFxuXG5cdFx0Y29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcblxuXHRcdGlmIHJlcS5oZWFkZXJzXG5cdFx0XHR1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXVxuXHRcdFx0YXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl1cblxuXHRcdCMgdGhlbiBjaGVjayBjb29raWVcblx0XHRpZiAhdXNlcklkIG9yICFhdXRoVG9rZW5cblx0XHRcdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXG5cdFx0XHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdFx0aWYgIXVzZXJJZCBvciAhYXV0aFRva2VuXG5cdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0aWYgU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbilcblx0XHRcdHJldHVybiBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pPy5faWRcblxuXHRTdGVlZG9zLkFQSUF1dGhlbnRpY2F0aW9uQ2hlY2sgPSAocmVxLCByZXMpIC0+XG5cdFx0dHJ5XG5cdFx0XHR1c2VySWQgPSByZXEudXNlcklkXG5cblx0XHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJJZH0pXG5cblx0XHRcdGlmICF1c2VySWQgfHwgIXVzZXJcblx0XHRcdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdFx0XHRkYXRhOlxuXHRcdFx0XHRcdFx0XCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW4sWC1Vc2VyLUlkIE9yIGFjY2Vzc190b2tlblwiLFxuXHRcdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRjYXRjaCBlXG5cdFx0XHRpZiAhdXNlcklkIHx8ICF1c2VyXG5cdFx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdFx0Y29kZTogNDAxLFxuXHRcdFx0XHRcdGRhdGE6XG5cdFx0XHRcdFx0XHRcImVycm9yXCI6IGUubWVzc2FnZSxcblx0XHRcdFx0XHRcdFwic3VjY2Vzc1wiOiBmYWxzZVxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblxuIyBUaGlzIHdpbGwgYWRkIHVuZGVyc2NvcmUuc3RyaW5nIG1ldGhvZHMgdG8gVW5kZXJzY29yZS5qc1xuIyBleGNlcHQgZm9yIGluY2x1ZGUsIGNvbnRhaW5zLCByZXZlcnNlIGFuZCBqb2luIHRoYXQgYXJlXG4jIGRyb3BwZWQgYmVjYXVzZSB0aGV5IGNvbGxpZGUgd2l0aCB0aGUgZnVuY3Rpb25zIGFscmVhZHlcbiMgZGVmaW5lZCBieSBVbmRlcnNjb3JlLmpzLlxuXG5taXhpbiA9IChvYmopIC0+XG5cdF8uZWFjaCBfLmZ1bmN0aW9ucyhvYmopLCAobmFtZSkgLT5cblx0XHRpZiBub3QgX1tuYW1lXSBhbmQgbm90IF8ucHJvdG90eXBlW25hbWVdP1xuXHRcdFx0ZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV1cblx0XHRcdF8ucHJvdG90eXBlW25hbWVdID0gLT5cblx0XHRcdFx0YXJncyA9IFt0aGlzLl93cmFwcGVkXVxuXHRcdFx0XHRwdXNoLmFwcGx5KGFyZ3MsIGFyZ3VtZW50cylcblx0XHRcdFx0cmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpXG5cbiNtaXhpbihfcy5leHBvcnRzKCkpXG5cbmlmIE1ldGVvci5pc1NlcnZlclxuIyDliKTmlq3mmK/lkKbmmK/oioLlgYfml6Vcblx0U3RlZWRvcy5pc0hvbGlkYXkgPSAoZGF0ZSktPlxuXHRcdGlmICFkYXRlXG5cdFx0XHRkYXRlID0gbmV3IERhdGVcblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0ZGF5ID0gZGF0ZS5nZXREYXkoKVxuXHRcdCMg5ZGo5YWt5ZGo5pel5Li65YGH5pyfXG5cdFx0aWYgZGF5IGlzIDYgb3IgZGF5IGlzIDBcblx0XHRcdHJldHVybiB0cnVlXG5cblx0XHRyZXR1cm4gZmFsc2Vcblx0IyDmoLnmja7kvKDlhaXml7bpl7QoZGF0ZSnorqHnrpflh6DkuKrlt6XkvZzml6UoZGF5cynlkI7nmoTml7bpl7QsZGF5c+ebruWJjeWPquiDveaYr+aVtOaVsFxuXHRTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSAoZGF0ZSwgZGF5cyktPlxuXHRcdGNoZWNrIGRhdGUsIERhdGVcblx0XHRjaGVjayBkYXlzLCBOdW1iZXJcblx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGNhY3VsYXRlRGF0ZSA9IChpLCBkYXlzKS0+XG5cdFx0XHRpZiBpIDwgZGF5c1xuXHRcdFx0XHRwYXJhbV9kYXRlID0gbmV3IERhdGUocGFyYW1fZGF0ZS5nZXRUaW1lKCkgKyAyNCo2MCo2MCoxMDAwKVxuXHRcdFx0XHRpZiAhU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSlcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0Y2FjdWxhdGVEYXRlKGksIGRheXMpXG5cdFx0XHRyZXR1cm5cblx0XHRjYWN1bGF0ZURhdGUoMCwgZGF5cylcblx0XHRyZXR1cm4gcGFyYW1fZGF0ZVxuXG5cdCMg6K6h566X5Y2K5Liq5bel5L2c5pel5ZCO55qE5pe26Ze0XG5cdCMg5Y+C5pWwIG5leHTlpoLmnpzkuLp0cnVl5YiZ6KGo56S65Y+q6K6h566XZGF0ZeaXtumXtOWQjumdoue0p+aOpeedgOeahHRpbWVfcG9pbnRzXG5cdFN0ZWVkb3MuY2FjdWxhdGVQbHVzSGFsZldvcmtpbmdEYXkgPSAoZGF0ZSwgbmV4dCkgLT5cblx0XHRjaGVjayBkYXRlLCBEYXRlXG5cdFx0dGltZV9wb2ludHMgPSBNZXRlb3Iuc2V0dGluZ3MucmVtaW5kPy50aW1lX3BvaW50c1xuXHRcdGlmIG5vdCB0aW1lX3BvaW50cyBvciBfLmlzRW1wdHkodGltZV9wb2ludHMpXG5cdFx0XHRjb25zb2xlLmVycm9yIFwidGltZV9wb2ludHMgaXMgbnVsbFwiXG5cdFx0XHR0aW1lX3BvaW50cyA9IFt7XCJob3VyXCI6IDgsIFwibWludXRlXCI6IDMwIH0sIHtcImhvdXJcIjogMTQsIFwibWludXRlXCI6IDMwIH1dXG5cblx0XHRsZW4gPSB0aW1lX3BvaW50cy5sZW5ndGhcblx0XHRzdGFydF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdGVuZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdHN0YXJ0X2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbMF0uaG91clxuXHRcdHN0YXJ0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1swXS5taW51dGVcblx0XHRlbmRfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tsZW4gLSAxXS5ob3VyXG5cdFx0ZW5kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGVcblxuXHRcdGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXG5cdFx0aiA9IDBcblx0XHRtYXhfaW5kZXggPSBsZW4gLSAxXG5cdFx0aWYgZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IDBcblx0XHRcdGVsc2Vcblx0XHRcdFx0IyDliqDljYrkuKp0aW1lX3BvaW50c1xuXHRcdFx0XHRqID0gbGVuLzJcblx0XHRlbHNlIGlmIGRhdGUgPj0gc3RhcnRfZGF0ZSBhbmQgZGF0ZSA8IGVuZF9kYXRlXG5cdFx0XHRpID0gMFxuXHRcdFx0d2hpbGUgaSA8IG1heF9pbmRleFxuXHRcdFx0XHRmaXJzdF9kYXRlID0gbmV3IERhdGUgZGF0ZVxuXHRcdFx0XHRzZWNvbmRfZGF0ZSA9IG5ldyBEYXRlIGRhdGVcblx0XHRcdFx0Zmlyc3RfZGF0ZS5zZXRIb3VycyB0aW1lX3BvaW50c1tpXS5ob3VyXG5cdFx0XHRcdGZpcnN0X2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpXS5taW51dGVcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaSArIDFdLmhvdXJcblx0XHRcdFx0c2Vjb25kX2RhdGUuc2V0TWludXRlcyB0aW1lX3BvaW50c1tpICsgMV0ubWludXRlXG5cblx0XHRcdFx0aWYgZGF0ZSA+PSBmaXJzdF9kYXRlIGFuZCBkYXRlIDwgc2Vjb25kX2RhdGVcblx0XHRcdFx0XHRicmVha1xuXG5cdFx0XHRcdGkrK1xuXG5cdFx0XHRpZiBuZXh0XG5cdFx0XHRcdGogPSBpICsgMVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRqID0gaSArIGxlbi8yXG5cblx0XHRlbHNlIGlmIGRhdGUgPj0gZW5kX2RhdGVcblx0XHRcdGlmIG5leHRcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIDFcblx0XHRcdGVsc2Vcblx0XHRcdFx0aiA9IG1heF9pbmRleCArIGxlbi8yXG5cblx0XHRpZiBqID4gbWF4X2luZGV4XG5cdFx0XHQjIOmalOWkqemcgOWIpOaWreiKguWBh+aXpVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgZGF0ZSwgMVxuXHRcdFx0Y2FjdWxhdGVkX2RhdGUuc2V0SG91cnMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbaiAtIG1heF9pbmRleCAtIDFdLm1pbnV0ZVxuXHRcdGVsc2UgaWYgaiA8PSBtYXhfaW5kZXhcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzIHRpbWVfcG9pbnRzW2pdLmhvdXJcblx0XHRcdGNhY3VsYXRlZF9kYXRlLnNldE1pbnV0ZXMgdGltZV9wb2ludHNbal0ubWludXRlXG5cblx0XHRyZXR1cm4gY2FjdWxhdGVkX2RhdGVcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdF8uZXh0ZW5kIFN0ZWVkb3MsXG5cdFx0Z2V0U3RlZWRvc1Rva2VuOiAoYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKS0+XG5cdFx0XHRjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKVxuXHRcdFx0YXBwID0gZGIuYXBwcy5maW5kT25lKGFwcElkKVxuXHRcdFx0aWYgYXBwXG5cdFx0XHRcdHNlY3JldCA9IGFwcC5zZWNyZXRcblxuXHRcdFx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cblx0XHRcdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdFx0XHR1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmVcblx0XHRcdFx0XHRfaWQ6IHVzZXJJZCxcblx0XHRcdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdFx0XHRpZiB1c2VyXG5cdFx0XHRcdFx0c3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZFxuXHRcdFx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0XHRcdGl2ID0gYXBwLnNlY3JldFxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdFx0XHRub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKS8xMDAwKS50b1N0cmluZygpXG5cdFx0XHRcdFx0a2V5MzIgPSBcIlwiXG5cdFx0XHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdFx0XHRpZiBsZW4gPCAzMlxuXHRcdFx0XHRcdFx0YyA9IFwiXCJcblx0XHRcdFx0XHRcdGkgPSAwXG5cdFx0XHRcdFx0XHRtID0gMzIgLSBsZW5cblx0XHRcdFx0XHRcdHdoaWxlIGkgPCBtXG5cdFx0XHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRcdFx0aSsrXG5cdFx0XHRcdFx0XHRrZXkzMiA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0XHRcdGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLDMyKVxuXG5cdFx0XHRcdFx0Y2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpXG5cblx0XHRcdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdFx0XHRzdGVlZG9zX3Rva2VuID0gY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdHJldHVybiBzdGVlZG9zX3Rva2VuXG5cblx0XHRsb2NhbGU6ICh1c2VySWQsIGlzSTE4biktPlxuXHRcdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe19pZDp1c2VySWR9LHtmaWVsZHM6IHtsb2NhbGU6IDF9fSlcblx0XHRcdGxvY2FsZSA9IHVzZXI/LmxvY2FsZVxuXHRcdFx0aWYgaXNJMThuXG5cdFx0XHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdFx0XHRsb2NhbGUgPSBcImVuXCJcblx0XHRcdFx0aWYgbG9jYWxlID09IFwiemgtY25cIlxuXHRcdFx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXHRcdFx0cmV0dXJuIGxvY2FsZVxuXG5cdFx0Y2hlY2tVc2VybmFtZUF2YWlsYWJpbGl0eTogKHVzZXJuYW1lKSAtPlxuXHRcdFx0cmV0dXJuIG5vdCBNZXRlb3IudXNlcnMuZmluZE9uZSh7IHVzZXJuYW1lOiB7ICRyZWdleCA6IG5ldyBSZWdFeHAoXCJeXCIgKyBNZXRlb3IuX2VzY2FwZVJlZ0V4cCh1c2VybmFtZSkudHJpbSgpICsgXCIkXCIsIFwiaVwiKSB9IH0pXG5cblxuXHRcdHZhbGlkYXRlUGFzc3dvcmQ6IChwd2QpLT5cblx0XHRcdHJlYXNvbiA9IHQgXCJwYXNzd29yZF9pbnZhbGlkXCJcblx0XHRcdHZhbGlkID0gdHJ1ZVxuXHRcdFx0dW5sZXNzIHB3ZFxuXHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cblx0XHRcdHBhc3N3b3JQb2xpY3kgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5XG5cdFx0XHRwYXNzd29yUG9saWN5RXJyb3IgPSBNZXRlb3Iuc2V0dGluZ3MucHVibGljPy5wYXNzd29yZD8ucG9saWN5RXJyb3IgfHwgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYz8ucGFzc3dvcmQ/LnBvbGljeWVycm9yIHx8IFwi5a+G56CB5LiN56ym5ZCI6KeE5YiZXCJcblx0XHRcdGlmIHBhc3N3b3JQb2xpY3lcblx0XHRcdFx0aWYgIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJylcblx0XHRcdFx0XHRyZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3Jcblx0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR2YWxpZCA9IHRydWVcbiNcdFx0XHRlbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1xcZCsvLnRlc3QocHdkKVxuI1x0XHRcdFx0XHR2YWxpZCA9IGZhbHNlXG4jXHRcdFx0XHR1bmxlc3MgL1thLXpBLVpdKy8udGVzdChwd2QpXG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2VcbiNcdFx0XHRcdGlmIHB3ZC5sZW5ndGggPCA4XG4jXHRcdFx0XHRcdHZhbGlkID0gZmFsc2Vcblx0XHRcdGlmIHZhbGlkXG5cdFx0XHRcdHJldHVybiB0cnVlXG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiBlcnJvcjpcblx0XHRcdFx0XHRyZWFzb246IHJlYXNvblxuXG5TdGVlZG9zLmNvbnZlcnRTcGVjaWFsQ2hhcmFjdGVyID0gKHN0ciktPlxuXHRyZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfV0pL2csIFwiXFxcXCQxXCIpXG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IChzdHIpLT5cblx0cmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1cXH5cXGBcXEBcXCNcXCVcXCZcXD1cXCdcXFwiXFw6XFw7XFw8XFw+XFwsXFwvXSkvZywgXCJcIilcblxuQ3JlYXRvci5nZXREQkFwcHMgPSAoc3BhY2VfaWQpLT5cblx0ZGJBcHBzID0ge31cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImFwcHNcIl0uZmluZCh7c3BhY2U6IHNwYWNlX2lkLGlzX2NyZWF0b3I6dHJ1ZSx2aXNpYmxlOnRydWV9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZvckVhY2ggKGFwcCktPlxuXHRcdGRiQXBwc1thcHAuX2lkXSA9IGFwcFxuXG5cdHJldHVybiBkYkFwcHNcblxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSAoc3BhY2VfaWQpLT5cblx0ZGJEYXNoYm9hcmRzID0ge31cblx0Q3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtzcGFjZTogc3BhY2VfaWR9LCB7XG5cdFx0ZmllbGRzOiB7XG5cdFx0XHRjcmVhdGVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0bW9kaWZpZWRfYnk6IDBcblx0XHR9XG5cdH0pLmZvckVhY2ggKGRhc2hib2FyZCktPlxuXHRcdGRiRGFzaGJvYXJkc1tkYXNoYm9hcmQuX2lkXSA9IGRhc2hib2FyZFxuXG5cdHJldHVybiBkYkRhc2hib2FyZHNcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuXHRTdGVlZG9zLmdldEF1dGhUb2tlbiA9IChyZXEsIHJlcyktPlxuXHRcdGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcylcblx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVyc1sneC1hdXRoLXRva2VuJ10gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblx0XHRpZiAhYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09ICdCZWFyZXInXG5cdFx0XHRhdXRoVG9rZW4gPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uLnNwbGl0KCcgJylbMV1cblx0XHRyZXR1cm4gYXV0aFRva2VuXG5cbmlmIE1ldGVvci5pc0NsaWVudFxuXHRNZXRlb3IuYXV0b3J1biAoKS0+XG5cdFx0aWYgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJylcblx0XHRcdHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpXG4jXHRcdGVsc2VcbiNcdFx0XHRjb25zb2xlLmxvZygncmVtb3ZlIGN1cnJlbnRfYXBwX2lkLi4uJyk7XG4jXHRcdFx0c2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbSgnY3VycmVudF9hcHBfaWQnKVxuXHRTdGVlZG9zLmdldEN1cnJlbnRBcHBJZCA9ICgpLT5cblx0XHRpZiBTZXNzaW9uLmdldCgnYXBwX2lkJylcblx0XHRcdHJldHVybiBTZXNzaW9uLmdldCgnYXBwX2lkJylcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gc2Vzc2lvblN0b3JhZ2UuZ2V0SXRlbSgnY3VycmVudF9hcHBfaWQnKTtcblxuaWYgTWV0ZW9yLmlzU2VydmVyXG5cdFN0ZWVkb3MuZm9ybWF0SW5kZXggPSAoYXJyYXkpIC0+XG5cdFx0b2JqZWN0ID0ge1xuICAgICAgICBcdGJhY2tncm91bmQ6IHRydWVcbiAgICBcdH07XG5cdFx0aXNkb2N1bWVudERCID0gTWV0ZW9yLnNldHRpbmdzPy5kYXRhc291cmNlcz8uZGVmYXVsdD8uZG9jdW1lbnREQiB8fCBmYWxzZTtcblx0XHRpZiBpc2RvY3VtZW50REJcblx0XHRcdGlmIGFycmF5Lmxlbmd0aCA+IDBcblx0XHRcdFx0aW5kZXhOYW1lID0gYXJyYXkuam9pbihcIi5cIik7XG5cdFx0XHRcdG9iamVjdC5uYW1lID0gaW5kZXhOYW1lO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Milcblx0XHRcdFx0XHRvYmplY3QubmFtZSA9IGluZGV4TmFtZS5zdWJzdHJpbmcoMCw1Mik7XG5cblx0XHRyZXR1cm4gb2JqZWN0OyIsInZhciBDb29raWVzLCBjcnlwdG8sIG1peGluLCByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJvb3RVcmw7ICAgICAgICAgXG5cblN0ZWVkb3MgPSB7XG4gIHNldHRpbmdzOiB7fSxcbiAgZGI6IGRiLFxuICBzdWJzOiB7fSxcbiAgaXNQaG9uZUVuYWJsZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZWYsIHJlZjE7XG4gICAgcmV0dXJuICEhKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZltcInB1YmxpY1wiXSkgIT0gbnVsbCA/IHJlZjEucGhvbmUgOiB2b2lkIDAgOiB2b2lkIDApO1xuICB9LFxuICBudW1iZXJUb1N0cmluZzogZnVuY3Rpb24obnVtYmVyLCBzY2FsZSwgbm90VGhvdXNhbmRzKSB7XG4gICAgdmFyIHJlZiwgcmVmMSwgcmVnO1xuICAgIGlmICh0eXBlb2YgbnVtYmVyID09PSBcIm51bWJlclwiKSB7XG4gICAgICBudW1iZXIgPSBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9XG4gICAgaWYgKCFudW1iZXIpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKG51bWJlciAhPT0gXCJOYU5cIikge1xuICAgICAgaWYgKHNjYWxlIHx8IHNjYWxlID09PSAwKSB7XG4gICAgICAgIG51bWJlciA9IE51bWJlcihudW1iZXIpLnRvRml4ZWQoc2NhbGUpO1xuICAgICAgfVxuICAgICAgaWYgKCFub3RUaG91c2FuZHMpIHtcbiAgICAgICAgaWYgKCEoc2NhbGUgfHwgc2NhbGUgPT09IDApKSB7XG4gICAgICAgICAgc2NhbGUgPSAocmVmID0gbnVtYmVyLm1hdGNoKC9cXC4oXFxkKykvKSkgIT0gbnVsbCA/IChyZWYxID0gcmVmWzFdKSAhPSBudWxsID8gcmVmMS5sZW5ndGggOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgICAgaWYgKCFzY2FsZSkge1xuICAgICAgICAgICAgc2NhbGUgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZWcgPSAvKFxcZCkoPz0oXFxkezN9KStcXC4pL2c7XG4gICAgICAgIGlmIChzY2FsZSA9PT0gMCkge1xuICAgICAgICAgIHJlZyA9IC8oXFxkKSg/PShcXGR7M30pK1xcYikvZztcbiAgICAgICAgfVxuICAgICAgICBudW1iZXIgPSBudW1iZXIucmVwbGFjZShyZWcsICckMSwnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW1iZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIH1cbiAgfSxcbiAgdmFsaUpxdWVyeVN5bWJvbHM6IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZWc7XG4gICAgcmVnID0gbmV3IFJlZ0V4cChcIl5bXiFcXFwiIyQlJicoKSpcXCssXFwuXFwvOjs8PT4/QFtcXFxcXV5ge3x9fl0rJFwiKTtcbiAgICByZXR1cm4gcmVnLnRlc3Qoc3RyKTtcbiAgfSxcbiAgYXV0aFJlcXVlc3Q6IGZ1bmN0aW9uKHVybCwgb3B0aW9ucykge1xuICAgIHZhciBhdXRoVG9rZW4sIGF1dGhvcml6YXRpb24sIGRlZk9wdGlvbnMsIGVyciwgaGVhZGVycywgcmVzdWx0LCBzcGFjZUlkLCB1c2VyU2Vzc2lvbjtcbiAgICB1c2VyU2Vzc2lvbiA9IENyZWF0b3IuVVNFUl9DT05URVhUO1xuICAgIHNwYWNlSWQgPSB1c2VyU2Vzc2lvbi5zcGFjZUlkO1xuICAgIGF1dGhUb2tlbiA9IHVzZXJTZXNzaW9uLmF1dGhUb2tlbiA/IHVzZXJTZXNzaW9uLmF1dGhUb2tlbiA6IHVzZXJTZXNzaW9uLnVzZXIuYXV0aFRva2VuO1xuICAgIHJlc3VsdCA9IG51bGw7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIHRyeSB7XG4gICAgICBhdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgc3BhY2VJZCArICcsJyArIGF1dGhUb2tlbjtcbiAgICAgIGhlYWRlcnMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiAnQ29udGVudC1UeXBlJyxcbiAgICAgICAgICB2YWx1ZTogJ2FwcGxpY2F0aW9uL2pzb24nXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBuYW1lOiAnQXV0aG9yaXphdGlvbicsXG4gICAgICAgICAgdmFsdWU6IGF1dGhvcml6YXRpb25cbiAgICAgICAgfVxuICAgICAgXTtcbiAgICAgIGRlZk9wdGlvbnMgPSB7XG4gICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oWEhSKSB7XG4gICAgICAgICAgaWYgKGhlYWRlcnMgJiYgaGVhZGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBYSFIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIubmFtZSwgaGVhZGVyLnZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHJlc3VsdCA9IGRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihYTUxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgICB2YXIgZXJyb3JJbmZvLCBlcnJvck1zZztcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTik7XG4gICAgICAgICAgaWYgKFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTiAmJiBYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04uZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9ySW5mbyA9IFhNTEh0dHBSZXF1ZXN0LnJlc3BvbnNlSlNPTi5lcnJvcjtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgZXJyb3I6IGVycm9ySW5mb1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGVycm9yTXNnID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGVycm9ySW5mby5yZWFzb24pIHtcbiAgICAgICAgICAgICAgZXJyb3JNc2cgPSBlcnJvckluZm8ucmVhc29uO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlcnJvckluZm8ubWVzc2FnZSkge1xuICAgICAgICAgICAgICBlcnJvck1zZyA9IGVycm9ySW5mby5tZXNzYWdlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXJyb3JNc2cgPSBlcnJvckluZm87XG4gICAgICAgICAgICAgIHRvYXN0ci5lcnJvcih0KGVycm9yTXNnLnJlcGxhY2UoLzovZywgJ++8micpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihYTUxIdHRwUmVxdWVzdC5yZXNwb25zZUpTT04pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgICQuYWpheChPYmplY3QuYXNzaWduKHt9LCBkZWZPcHRpb25zLCBvcHRpb25zKSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yMSkge1xuICAgICAgZXJyID0gZXJyb3IxO1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgdG9hc3RyLmVycm9yKGVycik7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qXG4gKiBLaWNrIG9mZiB0aGUgZ2xvYmFsIG5hbWVzcGFjZSBmb3IgU3RlZWRvcy5cbiAqIEBuYW1lc3BhY2UgU3RlZWRvc1xuICovXG5cbmlmIChNZXRlb3IuaXNDb3Jkb3ZhIHx8IE1ldGVvci5pc0NsaWVudCkge1xuICByb290VXJsID0gTWV0ZW9yLmFic29sdXRlVXJsLmRlZmF1bHRPcHRpb25zLnJvb3RVcmw7XG4gIGlmIChyb290VXJsLmVuZHNXaXRoKCcvJykpIHtcbiAgICByb290VXJsID0gcm9vdFVybC5zdWJzdHIoMCwgcm9vdFVybC5sZW5ndGggLSAxKTtcbiAgfVxuICBpZiAoKHJlZiA9IHdpbmRvdy5zdG9yZXMpICE9IG51bGwpIHtcbiAgICBpZiAoKHJlZjEgPSByZWYuQVBJKSAhPSBudWxsKSB7XG4gICAgICBpZiAoKHJlZjIgPSByZWYxLmNsaWVudCkgIT0gbnVsbCkge1xuICAgICAgICByZWYyLnNldFVybChyb290VXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKChyZWYzID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCkge1xuICAgIGlmICgocmVmNCA9IHJlZjMuU2V0dGluZ3MpICE9IG51bGwpIHtcbiAgICAgIHJlZjQuc2V0Um9vdFVybChyb290VXJsKTtcbiAgICB9XG4gIH1cbiAgd2luZG93WydzdGVlZG9zLnNldHRpbmcnXSA9IHtcbiAgICByb290VXJsOiByb290VXJsXG4gIH07XG59XG5cbmlmICghTWV0ZW9yLmlzQ29yZG92YSAmJiBNZXRlb3IuaXNDbGllbnQpIHtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjg7XG4gICAgcmV0dXJuIChyZWY1ID0gd2luZG93LnN0b3JlcykgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5TZXR0aW5ncykgIT0gbnVsbCA/IHJlZjYuc2V0SHJlZlBvcHVwKChyZWY3ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjggPSByZWY3LnVpKSAhPSBudWxsID8gcmVmOC5ocmVmX3BvcHVwIDogdm9pZCAwIDogdm9pZCAwKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgfSk7XG59XG5cblN0ZWVkb3MuZ2V0SGVscFVybCA9IGZ1bmN0aW9uKGxvY2FsZSkge1xuICB2YXIgY291bnRyeTtcbiAgY291bnRyeSA9IGxvY2FsZS5zdWJzdHJpbmcoMyk7XG4gIHJldHVybiBcImh0dHA6Ly93d3cuc3RlZWRvcy5jb20vXCIgKyBjb3VudHJ5ICsgXCIvaGVscC9cIjtcbn07XG5cblN0ZWVkb3MuaXNFeHByZXNzaW9uID0gZnVuY3Rpb24oZnVuYykge1xuICB2YXIgcGF0dGVybiwgcmVnMSwgcmVnMjtcbiAgaWYgKHR5cGVvZiBmdW5jICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBwYXR0ZXJuID0gL157eyguKyl9fSQvO1xuICByZWcxID0gL157eyhmdW5jdGlvbi4rKX19JC87XG4gIHJlZzIgPSAvXnt7KC4rPT4uKyl9fSQvO1xuICBpZiAodHlwZW9mIGZ1bmMgPT09ICdzdHJpbmcnICYmIGZ1bmMubWF0Y2gocGF0dGVybikgJiYgIWZ1bmMubWF0Y2gocmVnMSkgJiYgIWZ1bmMubWF0Y2gocmVnMikpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5TdGVlZG9zLnBhcnNlU2luZ2xlRXhwcmVzc2lvbiA9IGZ1bmN0aW9uKGZ1bmMsIGZvcm1EYXRhLCBkYXRhUGF0aCwgZ2xvYmFsKSB7XG4gIHZhciBlcnJvciwgZnVuY0JvZHksIGdldFBhcmVudFBhdGgsIGdldFZhbHVlQnlQYXRoLCBnbG9iYWxUYWcsIHBhcmVudCwgcGFyZW50UGF0aCwgc3RyO1xuICBnZXRQYXJlbnRQYXRoID0gZnVuY3Rpb24ocGF0aCkge1xuICAgIHZhciBwYXRoQXJyO1xuICAgIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBhdGhBcnIgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgICBpZiAocGF0aEFyci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmV0dXJuICcjJztcbiAgICAgIH1cbiAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgICByZXR1cm4gcGF0aEFyci5qb2luKCcuJyk7XG4gICAgfVxuICAgIHJldHVybiAnIyc7XG4gIH07XG4gIGdldFZhbHVlQnlQYXRoID0gZnVuY3Rpb24oZm9ybURhdGEsIHBhdGgpIHtcbiAgICBpZiAocGF0aCA9PT0gJyMnIHx8ICFwYXRoKSB7XG4gICAgICByZXR1cm4gZm9ybURhdGEgfHwge307XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgcGF0aCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBfLmdldChmb3JtRGF0YSwgcGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3BhdGggaGFzIHRvIGJlIGEgc3RyaW5nJyk7XG4gICAgfVxuICB9O1xuICBpZiAoZm9ybURhdGEgPT09IHZvaWQgMCkge1xuICAgIGZvcm1EYXRhID0ge307XG4gIH1cbiAgcGFyZW50UGF0aCA9IGdldFBhcmVudFBhdGgoZGF0YVBhdGgpO1xuICBwYXJlbnQgPSBnZXRWYWx1ZUJ5UGF0aChmb3JtRGF0YSwgcGFyZW50UGF0aCkgfHwge307XG4gIGlmICh0eXBlb2YgZnVuYyA9PT0gJ3N0cmluZycpIHtcbiAgICBmdW5jQm9keSA9IGZ1bmMuc3Vic3RyaW5nKDIsIGZ1bmMubGVuZ3RoIC0gMik7XG4gICAgZ2xvYmFsVGFnID0gJ19fR19MX09fQl9BX0xfXyc7XG4gICAgc3RyID0gJ1xcbiAgICByZXR1cm4gJyArIGZ1bmNCb2R5LnJlcGxhY2UoL1xcYmZvcm1EYXRhXFxiL2csIEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhKS5yZXBsYWNlKC9cXGJnbG9iYWxcXGIvZywgZ2xvYmFsVGFnKSkucmVwbGFjZSgvXFxiZ2xvYmFsXFxiL2csIEpTT04uc3RyaW5naWZ5KGdsb2JhbCkpLnJlcGxhY2UobmV3IFJlZ0V4cCgnXFxcXGInICsgZ2xvYmFsVGFnICsgJ1xcXFxiJywgJ2cnKSwgJ2dsb2JhbCcpLnJlcGxhY2UoL3Jvb3RWYWx1ZS9nLCBKU09OLnN0cmluZ2lmeShwYXJlbnQpKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEZ1bmN0aW9uKHN0cikoKTtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGVycm9yID0gZXJyb3IxO1xuICAgICAgY29uc29sZS5sb2coZXJyb3IsIGZ1bmMsIGRhdGFQYXRoKTtcbiAgICAgIHJldHVybiBmdW5jO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZnVuYztcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnNwYWNlVXBncmFkZWRNb2RhbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiBUQVBpMThuLl9fKFwic3BhY2VfcGFpZF9pbmZvX3RpdGxlXCIpLFxuICAgICAgdGV4dDogVEFQaTE4bi5fXyhcInNwYWNlX3BhaWRfaW5mb190ZXh0XCIpLFxuICAgICAgaHRtbDogdHJ1ZSxcbiAgICAgIHR5cGU6IFwid2FybmluZ1wiLFxuICAgICAgY29uZmlybUJ1dHRvblRleHQ6IFRBUGkxOG4uX18oXCJPS1wiKVxuICAgIH0pO1xuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRCZ0JvZHlWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50QmdCb2R5O1xuICAgIGFjY291bnRCZ0JvZHkgPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwiYmdfYm9keVwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRCZ0JvZHkpIHtcbiAgICAgIHJldHVybiBhY2NvdW50QmdCb2R5LnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmFwcGx5QWNjb3VudEJnQm9keVZhbHVlID0gZnVuY3Rpb24oYWNjb3VudEJnQm9keVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7XG4gICAgdmFyIGF2YXRhciwgdXJsO1xuICAgIGlmIChNZXRlb3IubG9nZ2luZ0luKCkgfHwgIVN0ZWVkb3MudXNlcklkKCkpIHtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZSA9IHt9O1xuICAgICAgYWNjb3VudEJnQm9keVZhbHVlLnVybCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgIGFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImFjY291bnRCZ0JvZHlWYWx1ZS5hdmF0YXJcIik7XG4gICAgfVxuICAgIHVybCA9IGFjY291bnRCZ0JvZHlWYWx1ZS51cmw7XG4gICAgYXZhdGFyID0gYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhcjtcbiAgICBpZiAoaXNOZWVkVG9Mb2NhbCkge1xuICAgICAgaWYgKE1ldGVvci5sb2dnaW5nSW4oKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoU3RlZWRvcy51c2VySWQoKSkge1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUudXJsXCIsIHVybCk7XG4gICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLmF2YXRhclwiLCBhdmF0YXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiYWNjb3VudEJnQm9keVZhbHVlLnVybFwiKTtcbiAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJhY2NvdW50QmdCb2R5VmFsdWUuYXZhdGFyXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmdldEFjY291bnRTa2luVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYWNjb3VudFNraW47XG4gICAgYWNjb3VudFNraW4gPSBkYi5zdGVlZG9zX2tleXZhbHVlcy5maW5kT25lKHtcbiAgICAgIHVzZXI6IFN0ZWVkb3MudXNlcklkKCksXG4gICAgICBrZXk6IFwic2tpblwiXG4gICAgfSk7XG4gICAgaWYgKGFjY291bnRTa2luKSB7XG4gICAgICByZXR1cm4gYWNjb3VudFNraW4udmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbTtcbiAgICBhY2NvdW50Wm9vbSA9IGRiLnN0ZWVkb3Nfa2V5dmFsdWVzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogU3RlZWRvcy51c2VySWQoKSxcbiAgICAgIGtleTogXCJ6b29tXCJcbiAgICB9KTtcbiAgICBpZiAoYWNjb3VudFpvb20pIHtcbiAgICAgIHJldHVybiBhY2NvdW50Wm9vbS52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5hcHBseUFjY291bnRab29tVmFsdWUgPSBmdW5jdGlvbihhY2NvdW50Wm9vbVZhbHVlLCBpc05lZWRUb0xvY2FsKSB7fTtcbiAgU3RlZWRvcy5zaG93SGVscCA9IGZ1bmN0aW9uKHVybCkge1xuICAgIHZhciBjb3VudHJ5LCBsb2NhbGU7XG4gICAgbG9jYWxlID0gU3RlZWRvcy5nZXRMb2NhbGUoKTtcbiAgICBjb3VudHJ5ID0gbG9jYWxlLnN1YnN0cmluZygzKTtcbiAgICB1cmwgPSB1cmwgfHwgXCJodHRwOi8vd3d3LnN0ZWVkb3MuY29tL1wiICsgY291bnRyeSArIFwiL2hlbHAvXCI7XG4gICAgcmV0dXJuIHdpbmRvdy5vcGVuKHVybCwgJ19oZWxwJywgJ0VuYWJsZVZpZXdQb3J0U2NhbGU9eWVzJyk7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXJsV2l0aFRva2VuID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGF1dGhUb2tlbiwgbGlua2VyO1xuICAgIGF1dGhUb2tlbiA9IHt9O1xuICAgIGF1dGhUb2tlbltcInNwYWNlSWRcIl0gPSBTdGVlZG9zLmdldFNwYWNlSWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLVVzZXItSWRcIl0gPSBNZXRlb3IudXNlcklkKCk7XG4gICAgYXV0aFRva2VuW1wiWC1BdXRoLVRva2VuXCJdID0gQWNjb3VudHMuX3N0b3JlZExvZ2luVG9rZW4oKTtcbiAgICBsaW5rZXIgPSBcIj9cIjtcbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIGxpbmtlciA9IFwiJlwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsICsgbGlua2VyICsgJC5wYXJhbShhdXRoVG9rZW4pO1xuICB9O1xuICBTdGVlZG9zLmdldEFwcFVybFdpdGhUb2tlbiA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhdXRoVG9rZW47XG4gICAgYXV0aFRva2VuID0ge307XG4gICAgYXV0aFRva2VuW1wic3BhY2VJZFwiXSA9IFN0ZWVkb3MuZ2V0U3BhY2VJZCgpO1xuICAgIGF1dGhUb2tlbltcIlgtVXNlci1JZFwiXSA9IE1ldGVvci51c2VySWQoKTtcbiAgICBhdXRoVG9rZW5bXCJYLUF1dGgtVG9rZW5cIl0gPSBBY2NvdW50cy5fc3RvcmVkTG9naW5Ub2tlbigpO1xuICAgIHJldHVybiBcImFwaS9zZXR1cC9zc28vXCIgKyBhcHBfaWQgKyBcIj9cIiArICQucGFyYW0oYXV0aFRva2VuKTtcbiAgfTtcbiAgU3RlZWRvcy5vcGVuQXBwV2l0aFRva2VuID0gZnVuY3Rpb24oYXBwX2lkKSB7XG4gICAgdmFyIGFwcCwgdXJsO1xuICAgIHVybCA9IFN0ZWVkb3MuZ2V0QXBwVXJsV2l0aFRva2VuKGFwcF9pZCk7XG4gICAgdXJsID0gU3RlZWRvcy5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIGFwcCA9IGRiLmFwcHMuZmluZE9uZShhcHBfaWQpO1xuICAgIGlmICghYXBwLmlzX25ld193aW5kb3cgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSAmJiAhU3RlZWRvcy5pc0NvcmRvdmEoKSkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFN0ZWVkb3Mub3BlbldpbmRvdyh1cmwpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5vcGVuVXJsV2l0aElFID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGNtZCwgZXhlYywgb3Blbl91cmw7XG4gICAgaWYgKHVybCkge1xuICAgICAgaWYgKFN0ZWVkb3MuaXNOb2RlKCkpIHtcbiAgICAgICAgZXhlYyA9IG53LnJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5leGVjO1xuICAgICAgICBvcGVuX3VybCA9IHVybDtcbiAgICAgICAgY21kID0gXCJzdGFydCBpZXhwbG9yZS5leGUgXFxcIlwiICsgb3Blbl91cmwgKyBcIlxcXCJcIjtcbiAgICAgICAgcmV0dXJuIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBTdGVlZG9zLm9wZW5XaW5kb3codXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3Mub3BlbkFwcCA9IGZ1bmN0aW9uKGFwcF9pZCkge1xuICAgIHZhciBhcHAsIGNtZCwgZSwgZXZhbEZ1blN0cmluZywgZXhlYywgb25fY2xpY2ssIG9wZW5fdXJsLCBwYXRoO1xuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICBTdGVlZG9zLnJlZGlyZWN0VG9TaWduSW4oKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwX2lkKTtcbiAgICBpZiAoIWFwcCkge1xuICAgICAgRmxvd1JvdXRlci5nbyhcIi9cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uX2NsaWNrID0gYXBwLm9uX2NsaWNrO1xuICAgIGlmIChhcHAuaXNfdXNlX2llKSB7XG4gICAgICBpZiAoU3RlZWRvcy5pc05vZGUoKSkge1xuICAgICAgICBleGVjID0gbncucmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWM7XG4gICAgICAgIGlmIChvbl9jbGljaykge1xuICAgICAgICAgIHBhdGggPSBcImFwaS9hcHAvc3NvL1wiICsgYXBwX2lkICsgXCI/YXV0aFRva2VuPVwiICsgKEFjY291bnRzLl9zdG9yZWRMb2dpblRva2VuKCkpICsgXCImdXNlcklkPVwiICsgKE1ldGVvci51c2VySWQoKSk7XG4gICAgICAgICAgb3Blbl91cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgXCIvXCIgKyBwYXRoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG9wZW5fdXJsID0gU3RlZWRvcy5nZXRBcHBVcmxXaXRoVG9rZW4oYXBwX2lkKTtcbiAgICAgICAgICBvcGVuX3VybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyBcIi9cIiArIG9wZW5fdXJsO1xuICAgICAgICB9XG4gICAgICAgIGNtZCA9IFwic3RhcnQgaWV4cGxvcmUuZXhlIFxcXCJcIiArIG9wZW5fdXJsICsgXCJcXFwiXCI7XG4gICAgICAgIGV4ZWMoY21kLCBmdW5jdGlvbihlcnJvciwgc3Rkb3V0LCBzdGRlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRvYXN0ci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZGIuYXBwcy5pc0ludGVybmFsQXBwKGFwcC51cmwpKSB7XG4gICAgICBGbG93Um91dGVyLmdvKGFwcC51cmwpO1xuICAgIH0gZWxzZSBpZiAoYXBwLmlzX3VzZV9pZnJhbWUpIHtcbiAgICAgIGlmIChhcHAuaXNfbmV3X3dpbmRvdyAmJiAhU3RlZWRvcy5pc01vYmlsZSgpICYmICFTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbldpbmRvdyhTdGVlZG9zLmFic29sdXRlVXJsKFwiYXBwcy9pZnJhbWUvXCIgKyBhcHAuX2lkKSk7XG4gICAgICB9IGVsc2UgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSB8fCBTdGVlZG9zLmlzQ29yZG92YSgpKSB7XG4gICAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRmxvd1JvdXRlci5nbyhcIi9hcHBzL2lmcmFtZS9cIiArIGFwcC5faWQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob25fY2xpY2spIHtcbiAgICAgIGV2YWxGdW5TdHJpbmcgPSBcIihmdW5jdGlvbigpe1wiICsgb25fY2xpY2sgKyBcIn0pKClcIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV2YWwoZXZhbEZ1blN0cmluZyk7XG4gICAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImNhdGNoIHNvbWUgZXJyb3Igd2hlbiBldmFsIHRoZSBvbl9jbGljayBzY3JpcHQgZm9yIGFwcCBsaW5rOlwiKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UgKyBcIlxcclxcblwiICsgZS5zdGFjayk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIFN0ZWVkb3Mub3BlbkFwcFdpdGhUb2tlbihhcHBfaWQpO1xuICAgIH1cbiAgICBpZiAoIWFwcC5pc19uZXdfd2luZG93ICYmICFTdGVlZG9zLmlzTW9iaWxlKCkgJiYgIVN0ZWVkb3MuaXNDb3Jkb3ZhKCkgJiYgIWFwcC5pc191c2VfaWUgJiYgIW9uX2NsaWNrKSB7XG4gICAgICByZXR1cm4gU2Vzc2lvbi5zZXQoXCJjdXJyZW50X2FwcF9pZFwiLCBhcHBfaWQpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5jaGVja1NwYWNlQmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgICB2YXIgZW5kX2RhdGUsIG1pbl9tb250aHMsIHNwYWNlO1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgc3BhY2VJZCA9IFN0ZWVkb3Muc3BhY2VJZCgpO1xuICAgIH1cbiAgICBtaW5fbW9udGhzID0gMTtcbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgbWluX21vbnRocyA9IDM7XG4gICAgfVxuICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VJZCk7XG4gICAgZW5kX2RhdGUgPSBzcGFjZSAhPSBudWxsID8gc3BhY2UuZW5kX2RhdGUgOiB2b2lkIDA7XG4gICAgaWYgKHNwYWNlICYmIGVuZF9kYXRlICE9PSB2b2lkIDAgJiYgKGVuZF9kYXRlIC0gbmV3IERhdGUpIDw9IChtaW5fbW9udGhzICogMzAgKiAyNCAqIDM2MDAgKiAxMDAwKSkge1xuICAgICAgcmV0dXJuIHRvYXN0ci5lcnJvcih0KFwic3BhY2VfYmFsYW5jZV9pbnN1ZmZpY2llbnRcIikpO1xuICAgIH1cbiAgfTtcbiAgU3RlZWRvcy5zZXRNb2RhbE1heEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhY2NvdW50Wm9vbVZhbHVlLCBvZmZzZXQ7XG4gICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgIGlmICghYWNjb3VudFpvb21WYWx1ZS5uYW1lKSB7XG4gICAgICBhY2NvdW50Wm9vbVZhbHVlLm5hbWUgPSAnbGFyZ2UnO1xuICAgIH1cbiAgICBzd2l0Y2ggKGFjY291bnRab29tVmFsdWUubmFtZSkge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC0xMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvZmZzZXQgPSA3NTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2xhcmdlJzpcbiAgICAgICAgaWYgKFN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgICAgIG9mZnNldCA9IC02O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChTdGVlZG9zLmRldGVjdElFKCkpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IDE5OTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2Zmc2V0ID0gOTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdleHRyYS1sYXJnZSc6XG4gICAgICAgIGlmIChTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgICAgICBvZmZzZXQgPSAtMjY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKFN0ZWVkb3MuZGV0ZWN0SUUoKSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gMzAzO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvZmZzZXQgPSA1MztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCQoXCIubW9kYWxcIikubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gJChcIi5tb2RhbFwiKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZm9vdGVySGVpZ2h0LCBoZWFkZXJIZWlnaHQsIGhlaWdodCwgdG90YWxIZWlnaHQ7XG4gICAgICAgIGhlYWRlckhlaWdodCA9IDA7XG4gICAgICAgIGZvb3RlckhlaWdodCA9IDA7XG4gICAgICAgIHRvdGFsSGVpZ2h0ID0gMDtcbiAgICAgICAgJChcIi5tb2RhbC1oZWFkZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gaGVhZGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgJChcIi5tb2RhbC1mb290ZXJcIiwgJCh0aGlzKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gZm9vdGVySGVpZ2h0ICs9ICQodGhpcykub3V0ZXJIZWlnaHQoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdG90YWxIZWlnaHQgPSBoZWFkZXJIZWlnaHQgKyBmb290ZXJIZWlnaHQ7XG4gICAgICAgIGhlaWdodCA9ICQoXCJib2R5XCIpLmlubmVySGVpZ2h0KCkgLSB0b3RhbEhlaWdodCAtIG9mZnNldDtcbiAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MoXCJjZl9jb250YWN0X21vZGFsXCIpKSB7XG4gICAgICAgICAgcmV0dXJuICQoXCIubW9kYWwtYm9keVwiLCAkKHRoaXMpKS5jc3Moe1xuICAgICAgICAgICAgXCJtYXgtaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIixcbiAgICAgICAgICAgIFwiaGVpZ2h0XCI6IGhlaWdodCArIFwicHhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAkKFwiLm1vZGFsLWJvZHlcIiwgJCh0aGlzKSkuY3NzKHtcbiAgICAgICAgICAgIFwibWF4LWhlaWdodFwiOiBoZWlnaHQgKyBcInB4XCIsXG4gICAgICAgICAgICBcImhlaWdodFwiOiBcImF1dG9cIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0TW9kYWxNYXhIZWlnaHQgPSBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICB2YXIgYWNjb3VudFpvb21WYWx1ZSwgcmVWYWx1ZTtcbiAgICBpZiAoU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICByZVZhbHVlID0gd2luZG93LnNjcmVlbi5oZWlnaHQgLSAxMjYgLSAxODAgLSAyNTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVWYWx1ZSA9ICQod2luZG93KS5oZWlnaHQoKSAtIDE4MCAtIDI1O1xuICAgIH1cbiAgICBpZiAoIShTdGVlZG9zLmlzaU9TKCkgfHwgU3RlZWRvcy5pc01vYmlsZSgpKSkge1xuICAgICAgYWNjb3VudFpvb21WYWx1ZSA9IFN0ZWVkb3MuZ2V0QWNjb3VudFpvb21WYWx1ZSgpO1xuICAgICAgc3dpdGNoIChhY2NvdW50Wm9vbVZhbHVlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnbGFyZ2UnOlxuICAgICAgICAgIHJlVmFsdWUgLT0gNTA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2V4dHJhLWxhcmdlJzpcbiAgICAgICAgICByZVZhbHVlIC09IDE0NTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9mZnNldCkge1xuICAgICAgcmVWYWx1ZSAtPSBvZmZzZXQ7XG4gICAgfVxuICAgIHJldHVybiByZVZhbHVlICsgXCJweFwiO1xuICB9O1xuICBTdGVlZG9zLmlzaU9TID0gZnVuY3Rpb24odXNlckFnZW50LCBsYW5ndWFnZSkge1xuICAgIHZhciBERVZJQ0UsIGJyb3dzZXIsIGNvbkV4cCwgZGV2aWNlLCBudW1FeHA7XG4gICAgREVWSUNFID0ge1xuICAgICAgYW5kcm9pZDogJ2FuZHJvaWQnLFxuICAgICAgYmxhY2tiZXJyeTogJ2JsYWNrYmVycnknLFxuICAgICAgZGVza3RvcDogJ2Rlc2t0b3AnLFxuICAgICAgaXBhZDogJ2lwYWQnLFxuICAgICAgaXBob25lOiAnaXBob25lJyxcbiAgICAgIGlwb2Q6ICdpcG9kJyxcbiAgICAgIG1vYmlsZTogJ21vYmlsZSdcbiAgICB9O1xuICAgIGJyb3dzZXIgPSB7fTtcbiAgICBjb25FeHAgPSAnKD86W1xcXFwvOlxcXFw6OlxcXFxzOjtdKSc7XG4gICAgbnVtRXhwID0gJyhcXFxcUytbXlxcXFxzOjs6XFxcXCldfCknO1xuICAgIHVzZXJBZ2VudCA9ICh1c2VyQWdlbnQgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudCkudG9Mb3dlckNhc2UoKTtcbiAgICBsYW5ndWFnZSA9IGxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IuYnJvd3Nlckxhbmd1YWdlO1xuICAgIGRldmljZSA9IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcoYW5kcm9pZHxpcGFkfGlwaG9uZXxpcG9kfGJsYWNrYmVycnkpJykpIHx8IHVzZXJBZ2VudC5tYXRjaChuZXcgUmVnRXhwKCcobW9iaWxlKScpKSB8fCBbJycsIERFVklDRS5kZXNrdG9wXTtcbiAgICBicm93c2VyLmRldmljZSA9IGRldmljZVsxXTtcbiAgICByZXR1cm4gYnJvd3Nlci5kZXZpY2UgPT09IERFVklDRS5pcGFkIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBob25lIHx8IGJyb3dzZXIuZGV2aWNlID09PSBERVZJQ0UuaXBvZDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VyT3JnYW5pemF0aW9ucyA9IGZ1bmN0aW9uKGlzSW5jbHVkZVBhcmVudHMpIHtcbiAgICB2YXIgb3JnYW5pemF0aW9ucywgcGFyZW50cywgc3BhY2VJZCwgc3BhY2VfdXNlciwgdXNlcklkO1xuICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICBzcGFjZUlkID0gU3RlZWRvcy5zcGFjZUlkKCk7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmZvcmJpZE5vZGVDb250ZXh0bWVudSA9IGZ1bmN0aW9uKHRhcmdldCwgaWZyKSB7XG4gICAgaWYgKCFTdGVlZG9zLmlzTm9kZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRhcmdldC5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgaWYgKGlmcikge1xuICAgICAgaWYgKHR5cGVvZiBpZnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGlmciA9IHRhcmdldC4kKGlmcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gaWZyLmxvYWQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpZnJCb2R5O1xuICAgICAgICBpZnJCb2R5ID0gaWZyLmNvbnRlbnRzKCkuZmluZCgnYm9keScpO1xuICAgICAgICBpZiAoaWZyQm9keSkge1xuICAgICAgICAgIHJldHVybiBpZnJCb2R5WzBdLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmdldFVzZXJPcmdhbml6YXRpb25zID0gZnVuY3Rpb24oc3BhY2VJZCwgdXNlcklkLCBpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgdmFyIG9yZ2FuaXphdGlvbnMsIHBhcmVudHMsIHNwYWNlX3VzZXI7XG4gICAgc3BhY2VfdXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe1xuICAgICAgdXNlcjogdXNlcklkLFxuICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb3JnYW5pemF0aW9uczogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIG9yZ2FuaXphdGlvbnMgPSBzcGFjZV91c2VyICE9IG51bGwgPyBzcGFjZV91c2VyLm9yZ2FuaXphdGlvbnMgOiB2b2lkIDA7XG4gICAgaWYgKCFvcmdhbml6YXRpb25zKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChpc0luY2x1ZGVQYXJlbnRzKSB7XG4gICAgICBwYXJlbnRzID0gXy5mbGF0dGVuKGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogb3JnYW5pemF0aW9uc1xuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpLmdldFByb3BlcnR5KFwicGFyZW50c1wiKSk7XG4gICAgICByZXR1cm4gXy51bmlvbihvcmdhbml6YXRpb25zLCBwYXJlbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG9yZ2FuaXphdGlvbnM7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIENvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcbiAgU3RlZWRvcy5pc01vYmlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5pc1NwYWNlQWRtaW4gPSBmdW5jdGlvbihzcGFjZUlkLCB1c2VySWQpIHtcbiAgICB2YXIgc3BhY2U7XG4gICAgaWYgKCFzcGFjZUlkIHx8ICF1c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZUlkKTtcbiAgICBpZiAoIXNwYWNlIHx8ICFzcGFjZS5hZG1pbnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlLmFkbWlucy5pbmRleE9mKHVzZXJJZCkgPj0gMDtcbiAgfTtcbiAgU3RlZWRvcy5pc0xlZ2FsVmVyc2lvbiA9IGZ1bmN0aW9uKHNwYWNlSWQsIGFwcF92ZXJzaW9uKSB7XG4gICAgdmFyIGNoZWNrLCBtb2R1bGVzLCByZWY1O1xuICAgIGlmICghc3BhY2VJZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjaGVjayA9IGZhbHNlO1xuICAgIG1vZHVsZXMgPSAocmVmNSA9IGRiLnNwYWNlcy5maW5kT25lKHNwYWNlSWQpKSAhPSBudWxsID8gcmVmNS5tb2R1bGVzIDogdm9pZCAwO1xuICAgIGlmIChtb2R1bGVzICYmIG1vZHVsZXMuaW5jbHVkZXMoYXBwX3ZlcnNpb24pKSB7XG4gICAgICBjaGVjayA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBjaGVjaztcbiAgfTtcbiAgU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMgPSBmdW5jdGlvbihvcmdJZHMsIHVzZXJJZCkge1xuICAgIHZhciBhbGxvd0FjY2Vzc09yZ3MsIGlzT3JnQWRtaW4sIHBhcmVudHMsIHVzZU9yZ3M7XG4gICAgaXNPcmdBZG1pbiA9IGZhbHNlO1xuICAgIHVzZU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogb3JnSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDEsXG4gICAgICAgIGFkbWluczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgcGFyZW50cyA9IFtdO1xuICAgIGFsbG93QWNjZXNzT3JncyA9IHVzZU9yZ3MuZmlsdGVyKGZ1bmN0aW9uKG9yZykge1xuICAgICAgdmFyIHJlZjU7XG4gICAgICBpZiAob3JnLnBhcmVudHMpIHtcbiAgICAgICAgcGFyZW50cyA9IF8udW5pb24ocGFyZW50cywgb3JnLnBhcmVudHMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIChyZWY1ID0gb3JnLmFkbWlucykgIT0gbnVsbCA/IHJlZjUuaW5jbHVkZXModXNlcklkKSA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICBpZiAoYWxsb3dBY2Nlc3NPcmdzLmxlbmd0aCkge1xuICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudHMgPSBfLmZsYXR0ZW4ocGFyZW50cyk7XG4gICAgICBwYXJlbnRzID0gXy51bmlxKHBhcmVudHMpO1xuICAgICAgaWYgKHBhcmVudHMubGVuZ3RoICYmIGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICRpbjogcGFyZW50c1xuICAgICAgICB9LFxuICAgICAgICBhZG1pbnM6IHVzZXJJZFxuICAgICAgfSkpIHtcbiAgICAgICAgaXNPcmdBZG1pbiA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmlzT3JnQWRtaW5CeUFsbE9yZ0lkcyA9IGZ1bmN0aW9uKG9yZ0lkcywgdXNlcklkKSB7XG4gICAgdmFyIGksIGlzT3JnQWRtaW47XG4gICAgaWYgKCFvcmdJZHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBvcmdJZHMubGVuZ3RoKSB7XG4gICAgICBpc09yZ0FkbWluID0gU3RlZWRvcy5pc09yZ0FkbWluQnlPcmdJZHMoW29yZ0lkc1tpXV0sIHVzZXJJZCk7XG4gICAgICBpZiAoIWlzT3JnQWRtaW4pIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHJldHVybiBpc09yZ0FkbWluO1xuICB9O1xuICBTdGVlZG9zLmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gICAgdmFyIGUsIHJvb3RfdXJsO1xuICAgIGlmICh1cmwpIHtcbiAgICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gICAgfVxuICAgIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgICAgICAgZSA9IGVycm9yMTtcbiAgICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuZ2V0QVBJTG9naW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBwYXNzd29yZCwgcmVmNSwgcmVmNiwgcmVmNywgcmVmOCwgcmVzdWx0LCB1c2VyLCB1c2VySWQsIHVzZXJuYW1lO1xuICAgIHVzZXJuYW1lID0gKHJlZjUgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY1LnVzZXJuYW1lIDogdm9pZCAwO1xuICAgIHBhc3N3b3JkID0gKHJlZjYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY2LnBhc3N3b3JkIDogdm9pZCAwO1xuICAgIGlmICh1c2VybmFtZSAmJiBwYXNzd29yZCkge1xuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBzdGVlZG9zX2lkOiB1c2VybmFtZVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmVzdWx0ID0gQWNjb3VudHMuX2NoZWNrUGFzc3dvcmQodXNlciwgcGFzc3dvcmQpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVzdWx0LmVycm9yKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1c2VyO1xuICAgICAgfVxuICAgIH1cbiAgICB1c2VySWQgPSAocmVmNyA9IHJlcS5xdWVyeSkgIT0gbnVsbCA/IHJlZjdbXCJYLVVzZXItSWRcIl0gOiB2b2lkIDA7XG4gICAgYXV0aFRva2VuID0gKHJlZjggPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY4W1wiWC1BdXRoLVRva2VuXCJdIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgaWYgKHJlcS5oZWFkZXJzKSB7XG4gICAgICB1c2VySWQgPSByZXEuaGVhZGVyc1tcIngtdXNlci1pZFwiXTtcbiAgICAgIGF1dGhUb2tlbiA9IHJlcS5oZWFkZXJzW1wieC1hdXRoLXRva2VuXCJdO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgICAgIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJJZCB8fCAhYXV0aFRva2VuKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChTdGVlZG9zLmNoZWNrQXV0aFRva2VuKHVzZXJJZCwgYXV0aFRva2VuKSkge1xuICAgICAgcmV0dXJuIGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcbiAgU3RlZWRvcy5jaGVja0F1dGhUb2tlbiA9IGZ1bmN0aW9uKHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgdmFyIGhhc2hlZFRva2VuLCB1c2VyO1xuICAgIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWQsXG4gICAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgICB9KTtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gIFN0ZWVkb3MuZGVjcnlwdCA9IGZ1bmN0aW9uKHBhc3N3b3JkLCBrZXksIGl2KSB7XG4gICAgdmFyIGMsIGRlY2lwaGVyLCBkZWNpcGhlck1zZywgZSwgaSwga2V5MzIsIGxlbiwgbTtcbiAgICB0cnkge1xuICAgICAga2V5MzIgPSBcIlwiO1xuICAgICAgbGVuID0ga2V5Lmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBrZXkgKyBjO1xuICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAga2V5MzIgPSBrZXkuc2xpY2UoMCwgMzIpO1xuICAgICAgfVxuICAgICAgZGVjaXBoZXIgPSBjcnlwdG8uY3JlYXRlRGVjaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgIGRlY2lwaGVyTXNnID0gQnVmZmVyLmNvbmNhdChbZGVjaXBoZXIudXBkYXRlKHBhc3N3b3JkLCAnYmFzZTY0JyksIGRlY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIHBhc3N3b3JkID0gZGVjaXBoZXJNc2cudG9TdHJpbmcoKTtcbiAgICAgIHJldHVybiBwYXNzd29yZDtcbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICByZXR1cm4gcGFzc3dvcmQ7XG4gICAgfVxuICB9O1xuICBTdGVlZG9zLmVuY3J5cHQgPSBmdW5jdGlvbihwYXNzd29yZCwga2V5LCBpdikge1xuICAgIHZhciBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBpLCBrZXkzMiwgbGVuLCBtO1xuICAgIGtleTMyID0gXCJcIjtcbiAgICBsZW4gPSBrZXkubGVuZ3RoO1xuICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgYyA9IFwiXCI7XG4gICAgICBpID0gMDtcbiAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgIHdoaWxlIChpIDwgbSkge1xuICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBrZXkzMiA9IGtleSArIGM7XG4gICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgIGtleTMyID0ga2V5LnNsaWNlKDAsIDMyKTtcbiAgICB9XG4gICAgY2lwaGVyID0gY3J5cHRvLmNyZWF0ZUNpcGhlcml2KCdhZXMtMjU2LWNiYycsIG5ldyBCdWZmZXIoa2V5MzIsICd1dGY4JyksIG5ldyBCdWZmZXIoaXYsICd1dGY4JykpO1xuICAgIGNpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbY2lwaGVyLnVwZGF0ZShuZXcgQnVmZmVyKHBhc3N3b3JkLCAndXRmOCcpKSwgY2lwaGVyLmZpbmFsKCldKTtcbiAgICBwYXNzd29yZCA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICByZXR1cm4gcGFzc3dvcmQ7XG4gIH07XG4gIFN0ZWVkb3MuZ2V0VXNlcklkRnJvbUFjY2Vzc1Rva2VuID0gZnVuY3Rpb24oYWNjZXNzX3Rva2VuKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24sIGhhc2hlZFRva2VuLCBvYmosIHVzZXIsIHVzZXJJZDtcbiAgICBpZiAoIWFjY2Vzc190b2tlbikge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHVzZXJJZCA9IGFjY2Vzc190b2tlbi5zcGxpdChcIi1cIilbMF07XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYWNjZXNzX3Rva2VuKTtcbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VjcmV0cy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICAgIGlmICh1c2VyKSB7XG4gICAgICByZXR1cm4gdXNlcklkO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2xsZWN0aW9uID0gb0F1dGgyU2VydmVyLmNvbGxlY3Rpb25zLmFjY2Vzc1Rva2VuO1xuICAgICAgb2JqID0gY29sbGVjdGlvbi5maW5kT25lKHtcbiAgICAgICAgJ2FjY2Vzc1Rva2VuJzogYWNjZXNzX3Rva2VuXG4gICAgICB9KTtcbiAgICAgIGlmIChvYmopIHtcbiAgICAgICAgaWYgKChvYmogIT0gbnVsbCA/IG9iai5leHBpcmVzIDogdm9pZCAwKSA8IG5ldyBEYXRlKCkpIHtcbiAgICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgZXhwaXJlZC5cIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgPyBvYmoudXNlcklkIDogdm9pZCAwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gXCJvYXV0aDIgYWNjZXNzIHRva2VuOlwiICsgYWNjZXNzX3Rva2VuICsgXCIgaXMgbm90IGZvdW5kLlwiO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbiAgU3RlZWRvcy5nZXRVc2VySWRGcm9tQXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCByZWY1LCByZWY2LCByZWY3LCByZWY4LCB1c2VySWQ7XG4gICAgdXNlcklkID0gKHJlZjUgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWY1W1wiWC1Vc2VyLUlkXCJdIDogdm9pZCAwO1xuICAgIGF1dGhUb2tlbiA9IChyZWY2ID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmNltcIlgtQXV0aC1Ub2tlblwiXSA6IHZvaWQgMDtcbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmNyA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWY3Ll9pZCA6IHZvaWQgMDtcbiAgICB9XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBpZiAocmVxLmhlYWRlcnMpIHtcbiAgICAgIHVzZXJJZCA9IHJlcS5oZWFkZXJzW1wieC11c2VyLWlkXCJdO1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbXCJ4LWF1dGgtdG9rZW5cIl07XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICAgICAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgfVxuICAgIGlmICghdXNlcklkIHx8ICFhdXRoVG9rZW4pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5jaGVja0F1dGhUb2tlbih1c2VySWQsIGF1dGhUb2tlbikpIHtcbiAgICAgIHJldHVybiAocmVmOCA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHVzZXJJZFxuICAgICAgfSkpICE9IG51bGwgPyByZWY4Ll9pZCA6IHZvaWQgMDtcbiAgICB9XG4gIH07XG4gIFN0ZWVkb3MuQVBJQXV0aGVudGljYXRpb25DaGVjayA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gICAgdmFyIGUsIHVzZXIsIHVzZXJJZDtcbiAgICB0cnkge1xuICAgICAgdXNlcklkID0gcmVxLnVzZXJJZDtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VySWQgfHwgIXVzZXIpIHtcbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogXCJWYWxpZGF0ZSBSZXF1ZXN0IC0tIE1pc3NpbmcgWC1BdXRoLVRva2VuLFgtVXNlci1JZCBPciBhY2Nlc3NfdG9rZW5cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29kZTogNDAxXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcjEpIHtcbiAgICAgIGUgPSBlcnJvcjE7XG4gICAgICBpZiAoIXVzZXJJZCB8fCAhdXNlcikge1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwiZXJyb3JcIjogZS5tZXNzYWdlLFxuICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxubWl4aW4gPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIF8uZWFjaChfLmZ1bmN0aW9ucyhvYmopLCBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIGZ1bmM7XG4gICAgaWYgKCFfW25hbWVdICYmIChfLnByb3RvdHlwZVtuYW1lXSA9PSBudWxsKSkge1xuICAgICAgZnVuYyA9IF9bbmFtZV0gPSBvYmpbbmFtZV07XG4gICAgICByZXR1cm4gXy5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSBbdGhpcy5fd3JhcHBlZF07XG4gICAgICAgIHB1c2guYXBwbHkoYXJncywgYXJndW1lbnRzKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdC5jYWxsKHRoaXMsIGZ1bmMuYXBwbHkoXywgYXJncykpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBTdGVlZG9zLmlzSG9saWRheSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICB2YXIgZGF5O1xuICAgIGlmICghZGF0ZSkge1xuICAgICAgZGF0ZSA9IG5ldyBEYXRlO1xuICAgIH1cbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBkYXkgPSBkYXRlLmdldERheSgpO1xuICAgIGlmIChkYXkgPT09IDYgfHwgZGF5ID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUgPSBmdW5jdGlvbihkYXRlLCBkYXlzKSB7XG4gICAgdmFyIGNhY3VsYXRlRGF0ZSwgcGFyYW1fZGF0ZTtcbiAgICBjaGVjayhkYXRlLCBEYXRlKTtcbiAgICBjaGVjayhkYXlzLCBOdW1iZXIpO1xuICAgIHBhcmFtX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBjYWN1bGF0ZURhdGUgPSBmdW5jdGlvbihpLCBkYXlzKSB7XG4gICAgICBpZiAoaSA8IGRheXMpIHtcbiAgICAgICAgcGFyYW1fZGF0ZSA9IG5ldyBEYXRlKHBhcmFtX2RhdGUuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgICAgIGlmICghU3RlZWRvcy5pc0hvbGlkYXkocGFyYW1fZGF0ZSkpIHtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgY2FjdWxhdGVEYXRlKGksIGRheXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgY2FjdWxhdGVEYXRlKDAsIGRheXMpO1xuICAgIHJldHVybiBwYXJhbV9kYXRlO1xuICB9O1xuICBTdGVlZG9zLmNhY3VsYXRlUGx1c0hhbGZXb3JraW5nRGF5ID0gZnVuY3Rpb24oZGF0ZSwgbmV4dCkge1xuICAgIHZhciBjYWN1bGF0ZWRfZGF0ZSwgZW5kX2RhdGUsIGZpcnN0X2RhdGUsIGksIGosIGxlbiwgbWF4X2luZGV4LCByZWY1LCBzZWNvbmRfZGF0ZSwgc3RhcnRfZGF0ZSwgdGltZV9wb2ludHM7XG4gICAgY2hlY2soZGF0ZSwgRGF0ZSk7XG4gICAgdGltZV9wb2ludHMgPSAocmVmNSA9IE1ldGVvci5zZXR0aW5ncy5yZW1pbmQpICE9IG51bGwgPyByZWY1LnRpbWVfcG9pbnRzIDogdm9pZCAwO1xuICAgIGlmICghdGltZV9wb2ludHMgfHwgXy5pc0VtcHR5KHRpbWVfcG9pbnRzKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcInRpbWVfcG9pbnRzIGlzIG51bGxcIik7XG4gICAgICB0aW1lX3BvaW50cyA9IFtcbiAgICAgICAge1xuICAgICAgICAgIFwiaG91clwiOiA4LFxuICAgICAgICAgIFwibWludXRlXCI6IDMwXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImhvdXJcIjogMTQsXG4gICAgICAgICAgXCJtaW51dGVcIjogMzBcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9XG4gICAgbGVuID0gdGltZV9wb2ludHMubGVuZ3RoO1xuICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICBlbmRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuICAgIHN0YXJ0X2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbMF0uaG91cik7XG4gICAgc3RhcnRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzWzBdLm1pbnV0ZSk7XG4gICAgZW5kX2RhdGUuc2V0SG91cnModGltZV9wb2ludHNbbGVuIC0gMV0uaG91cik7XG4gICAgZW5kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tsZW4gLSAxXS5taW51dGUpO1xuICAgIGNhY3VsYXRlZF9kYXRlID0gbmV3IERhdGUoZGF0ZSk7XG4gICAgaiA9IDA7XG4gICAgbWF4X2luZGV4ID0gbGVuIC0gMTtcbiAgICBpZiAoZGF0ZSA8IHN0YXJ0X2RhdGUpIHtcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIGogPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaiA9IGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IHN0YXJ0X2RhdGUgJiYgZGF0ZSA8IGVuZF9kYXRlKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgbWF4X2luZGV4KSB7XG4gICAgICAgIGZpcnN0X2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgc2Vjb25kX2RhdGUgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tpXS5ob3VyKTtcbiAgICAgICAgZmlyc3RfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ldLm1pbnV0ZSk7XG4gICAgICAgIHNlY29uZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2kgKyAxXS5ob3VyKTtcbiAgICAgICAgc2Vjb25kX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tpICsgMV0ubWludXRlKTtcbiAgICAgICAgaWYgKGRhdGUgPj0gZmlyc3RfZGF0ZSAmJiBkYXRlIDwgc2Vjb25kX2RhdGUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gaSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqID0gaSArIGxlbiAvIDI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRlID49IGVuZF9kYXRlKSB7XG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBqID0gbWF4X2luZGV4ICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGogPSBtYXhfaW5kZXggKyBsZW4gLyAyO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaiA+IG1heF9pbmRleCkge1xuICAgICAgY2FjdWxhdGVkX2RhdGUgPSBTdGVlZG9zLmNhY3VsYXRlV29ya2luZ1RpbWUoZGF0ZSwgMSk7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRIb3Vycyh0aW1lX3BvaW50c1tqIC0gbWF4X2luZGV4IC0gMV0uaG91cik7XG4gICAgICBjYWN1bGF0ZWRfZGF0ZS5zZXRNaW51dGVzKHRpbWVfcG9pbnRzW2ogLSBtYXhfaW5kZXggLSAxXS5taW51dGUpO1xuICAgIH0gZWxzZSBpZiAoaiA8PSBtYXhfaW5kZXgpIHtcbiAgICAgIGNhY3VsYXRlZF9kYXRlLnNldEhvdXJzKHRpbWVfcG9pbnRzW2pdLmhvdXIpO1xuICAgICAgY2FjdWxhdGVkX2RhdGUuc2V0TWludXRlcyh0aW1lX3BvaW50c1tqXS5taW51dGUpO1xuICAgIH1cbiAgICByZXR1cm4gY2FjdWxhdGVkX2RhdGU7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgXy5leHRlbmQoU3RlZWRvcywge1xuICAgIGdldFN0ZWVkb3NUb2tlbjogZnVuY3Rpb24oYXBwSWQsIHVzZXJJZCwgYXV0aFRva2VuKSB7XG4gICAgICB2YXIgYXBwLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBoYXNoZWRUb2tlbiwgaSwgaXYsIGtleTMyLCBsZW4sIG0sIG5vdywgc2VjcmV0LCBzdGVlZG9zX2lkLCBzdGVlZG9zX3Rva2VuLCB1c2VyO1xuICAgICAgY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG4gICAgICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUoYXBwSWQpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICBzZWNyZXQgPSBhcHAuc2VjcmV0O1xuICAgICAgfVxuICAgICAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICAgICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICAgICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBzdGVlZG9zX2lkID0gdXNlci5zdGVlZG9zX2lkO1xuICAgICAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgICAgICBpdiA9IGFwcC5zZWNyZXQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpIC8gMTAwMCkudG9TdHJpbmcoKTtcbiAgICAgICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICAgICAgaWYgKGxlbiA8IDMyKSB7XG4gICAgICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICAgbSA9IDMyIC0gbGVuO1xuICAgICAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgICAgIGMgPSBcIiBcIiArIGM7XG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZCArIGM7XG4gICAgICAgICAgfSBlbHNlIGlmIChsZW4gPj0gMzIpIHtcbiAgICAgICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKTtcbiAgICAgICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgICAgIHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGVlZG9zX3Rva2VuO1xuICAgIH0sXG4gICAgbG9jYWxlOiBmdW5jdGlvbih1c2VySWQsIGlzSTE4bikge1xuICAgICAgdmFyIGxvY2FsZSwgdXNlcjtcbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgbG9jYWxlOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbG9jYWxlID0gdXNlciAhPSBudWxsID8gdXNlci5sb2NhbGUgOiB2b2lkIDA7XG4gICAgICBpZiAoaXNJMThuKSB7XG4gICAgICAgIGlmIChsb2NhbGUgPT09IFwiZW4tdXNcIikge1xuICAgICAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobG9jYWxlID09PSBcInpoLWNuXCIpIHtcbiAgICAgICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBsb2NhbGU7XG4gICAgfSxcbiAgICBjaGVja1VzZXJuYW1lQXZhaWxhYmlsaXR5OiBmdW5jdGlvbih1c2VybmFtZSkge1xuICAgICAgcmV0dXJuICFNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXJuYW1lOiB7XG4gICAgICAgICAgJHJlZ2V4OiBuZXcgUmVnRXhwKFwiXlwiICsgTWV0ZW9yLl9lc2NhcGVSZWdFeHAodXNlcm5hbWUpLnRyaW0oKSArIFwiJFwiLCBcImlcIilcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICB2YWxpZGF0ZVBhc3N3b3JkOiBmdW5jdGlvbihwd2QpIHtcbiAgICAgIHZhciBwYXNzd29yUG9saWN5LCBwYXNzd29yUG9saWN5RXJyb3IsIHJlYXNvbiwgcmVmMTAsIHJlZjUsIHJlZjYsIHJlZjcsIHJlZjgsIHJlZjksIHZhbGlkO1xuICAgICAgcmVhc29uID0gdChcInBhc3N3b3JkX2ludmFsaWRcIik7XG4gICAgICB2YWxpZCA9IHRydWU7XG4gICAgICBpZiAoIXB3ZCkge1xuICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcGFzc3dvclBvbGljeSA9IChyZWY1ID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdKSAhPSBudWxsID8gKHJlZjYgPSByZWY1LnBhc3N3b3JkKSAhPSBudWxsID8gcmVmNi5wb2xpY3kgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICBwYXNzd29yUG9saWN5RXJyb3IgPSAoKHJlZjcgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmOCA9IHJlZjcucGFzc3dvcmQpICE9IG51bGwgPyByZWY4LnBvbGljeUVycm9yIDogdm9pZCAwIDogdm9pZCAwKSB8fCAoKHJlZjkgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0pICE9IG51bGwgPyAocmVmMTAgPSByZWY5LnBhc3N3b3JkKSAhPSBudWxsID8gcmVmMTAucG9saWN5ZXJyb3IgOiB2b2lkIDAgOiB2b2lkIDApIHx8IFwi5a+G56CB5LiN56ym5ZCI6KeE5YiZXCI7XG4gICAgICBpZiAocGFzc3dvclBvbGljeSkge1xuICAgICAgICBpZiAoIShuZXcgUmVnRXhwKHBhc3N3b3JQb2xpY3kpKS50ZXN0KHB3ZCB8fCAnJykpIHtcbiAgICAgICAgICByZWFzb24gPSBwYXNzd29yUG9saWN5RXJyb3I7XG4gICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWxpZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh2YWxpZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIHJlYXNvbjogcmVhc29uXG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cblN0ZWVkb3MuY29udmVydFNwZWNpYWxDaGFyYWN0ZXIgPSBmdW5jdGlvbihzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oW1xcXlxcJFxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXHxcXFtcXF1cXHtcXH1dKS9nLCBcIlxcXFwkMVwiKTtcbn07XG5cblN0ZWVkb3MucmVtb3ZlU3BlY2lhbENoYXJhY3RlciA9IGZ1bmN0aW9uKHN0cikge1xuICByZXR1cm4gc3RyLnJlcGxhY2UoLyhbXFxeXFwkXFwoXFwpXFwqXFwrXFw/XFwuXFxcXFxcfFxcW1xcXVxce1xcfVxcflxcYFxcQFxcI1xcJVxcJlxcPVxcJ1xcXCJcXDpcXDtcXDxcXD5cXCxcXC9dKS9nLCBcIlwiKTtcbn07XG5cbkNyZWF0b3IuZ2V0REJBcHBzID0gZnVuY3Rpb24oc3BhY2VfaWQpIHtcbiAgdmFyIGRiQXBwcztcbiAgZGJBcHBzID0ge307XG4gIENyZWF0b3IuQ29sbGVjdGlvbnNbXCJhcHBzXCJdLmZpbmQoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBpc19jcmVhdG9yOiB0cnVlLFxuICAgIHZpc2libGU6IHRydWVcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGFwcCkge1xuICAgIHJldHVybiBkYkFwcHNbYXBwLl9pZF0gPSBhcHA7XG4gIH0pO1xuICByZXR1cm4gZGJBcHBzO1xufTtcblxuQ3JlYXRvci5nZXREQkRhc2hib2FyZHMgPSBmdW5jdGlvbihzcGFjZV9pZCkge1xuICB2YXIgZGJEYXNoYm9hcmRzO1xuICBkYkRhc2hib2FyZHMgPSB7fTtcbiAgQ3JlYXRvci5Db2xsZWN0aW9uc1tcImRhc2hib2FyZFwiXS5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWRcbiAgfSwge1xuICAgIGZpZWxkczoge1xuICAgICAgY3JlYXRlZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIG1vZGlmaWVkX2J5OiAwXG4gICAgfVxuICB9KS5mb3JFYWNoKGZ1bmN0aW9uKGRhc2hib2FyZCkge1xuICAgIHJldHVybiBkYkRhc2hib2FyZHNbZGFzaGJvYXJkLl9pZF0gPSBkYXNoYm9hcmQ7XG4gIH0pO1xuICByZXR1cm4gZGJEYXNoYm9hcmRzO1xufTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIik7XG4gIFN0ZWVkb3MuZ2V0QXV0aFRva2VuID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgICB2YXIgYXV0aFRva2VuLCBjb29raWVzO1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnNbJ3gtYXV0aC10b2tlbiddIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICAgIGlmICghYXV0aFRva2VuICYmIHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24gJiYgcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzBdID09PSAnQmVhcmVyJykge1xuICAgICAgYXV0aFRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbi5zcGxpdCgnICcpWzFdO1xuICAgIH1cbiAgICByZXR1cm4gYXV0aFRva2VuO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIE1ldGVvci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgIGlmIChTZXNzaW9uLmdldCgnY3VycmVudF9hcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLnNldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJywgU2Vzc2lvbi5nZXQoJ2N1cnJlbnRfYXBwX2lkJykpO1xuICAgIH1cbiAgfSk7XG4gIFN0ZWVkb3MuZ2V0Q3VycmVudEFwcElkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKFNlc3Npb24uZ2V0KCdhcHBfaWQnKSkge1xuICAgICAgcmV0dXJuIFNlc3Npb24uZ2V0KCdhcHBfaWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNlc3Npb25TdG9yYWdlLmdldEl0ZW0oJ2N1cnJlbnRfYXBwX2lkJyk7XG4gICAgfVxuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIFN0ZWVkb3MuZm9ybWF0SW5kZXggPSBmdW5jdGlvbihhcnJheSkge1xuICAgIHZhciBpbmRleE5hbWUsIGlzZG9jdW1lbnREQiwgb2JqZWN0LCByZWY1LCByZWY2LCByZWY3O1xuICAgIG9iamVjdCA9IHtcbiAgICAgIGJhY2tncm91bmQ6IHRydWVcbiAgICB9O1xuICAgIGlzZG9jdW1lbnREQiA9ICgocmVmNSA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWY2ID0gcmVmNS5kYXRhc291cmNlcykgIT0gbnVsbCA/IChyZWY3ID0gcmVmNltcImRlZmF1bHRcIl0pICE9IG51bGwgPyByZWY3LmRvY3VtZW50REIgOiB2b2lkIDAgOiB2b2lkIDAgOiB2b2lkIDApIHx8IGZhbHNlO1xuICAgIGlmIChpc2RvY3VtZW50REIpIHtcbiAgICAgIGlmIChhcnJheS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGluZGV4TmFtZSA9IGFycmF5LmpvaW4oXCIuXCIpO1xuICAgICAgICBvYmplY3QubmFtZSA9IGluZGV4TmFtZTtcbiAgICAgICAgaWYgKGluZGV4TmFtZS5sZW5ndGggPiA1Mikge1xuICAgICAgICAgIG9iamVjdC5uYW1lID0gaW5kZXhOYW1lLnN1YnN0cmluZygwLCA1Mik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbiAgfTtcbn1cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcblx0U2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoe2ZvcmVpZ25fa2V5OiBNYXRjaC5PcHRpb25hbChCb29sZWFuKSwgcmVmZXJlbmNlczogTWF0Y2guT3B0aW9uYWwoT2JqZWN0KX0pO1xufSkiLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHNcbiAgICAgICAgICAgICAgICB1cGRhdGVVc2VyTGFzdExvZ29uOiAoKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkYi51c2Vycy51cGRhdGUoe19pZDogQHVzZXJJZH0sIHskc2V0OiB7bGFzdF9sb2dvbjogbmV3IERhdGUoKX19KSAgXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgIEFjY291bnRzLm9uTG9naW4gKCktPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgJ3VwZGF0ZVVzZXJMYXN0TG9nb24nIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckxhc3RMb2dvbjogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgbGFzdF9sb2dvbjogbmV3IERhdGUoKVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIEFjY291bnRzLm9uTG9naW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5jYWxsKCd1cGRhdGVVc2VyTGFzdExvZ29uJyk7XG4gIH0pO1xufVxuIiwiaWYgTWV0ZW9yLmlzU2VydmVyXG4gIE1ldGVvci5tZXRob2RzXG4gICAgdXNlcnNfYWRkX2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgaWYgZGIudXNlcnMuZmluZCh7XCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbH0pLmNvdW50KCk+MFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2V4aXN0c1wifVxuXG4gICAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShfaWQ6IHRoaXMudXNlcklkKVxuICAgICAgaWYgdXNlci5lbWFpbHM/IGFuZCB1c2VyLmVtYWlscy5sZW5ndGggPiAwIFxuICAgICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSwgXG4gICAgICAgICAgJHB1c2g6IFxuICAgICAgICAgICAgZW1haWxzOiBcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkc2V0OiBcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsXG4gICAgICAgICAgICBlbWFpbHM6IFtcbiAgICAgICAgICAgICAgYWRkcmVzczogZW1haWxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICBdXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogKGVtYWlsKSAtPlxuICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCBlbWFpbFxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJ9XG5cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKF9pZDogdGhpcy51c2VySWQpXG4gICAgICBpZiB1c2VyLmVtYWlscz8gYW5kIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyXG4gICAgICAgIHAgPSBudWxsXG4gICAgICAgIHVzZXIuZW1haWxzLmZvckVhY2ggKGUpLT5cbiAgICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICAgIHAgPSBlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgXG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUge19pZDogdGhpcy51c2VySWR9LCBcbiAgICAgICAgICAkcHVsbDogXG4gICAgICAgICAgICBlbWFpbHM6IFxuICAgICAgICAgICAgICBwXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJ9XG5cbiAgICAgIHJldHVybiB7fVxuXG4gICAgdXNlcnNfdmVyaWZ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cbiAgICAgIGlmIG5vdCAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KGVtYWlsKVxuICAgICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtZXNzYWdlOiBcImVtYWlsX2Zvcm1hdF9lcnJvclwifVxuICAgICAgXG5cbiAgICAgIEFjY291bnRzLnNlbmRWZXJpZmljYXRpb25FbWFpbCh0aGlzLnVzZXJJZCwgZW1haWwpO1xuXG4gICAgICByZXR1cm4ge31cblxuICAgIHVzZXJzX3NldF9wcmltYXJ5X2VtYWlsOiAoZW1haWwpIC0+XG4gICAgICBpZiBub3QgQHVzZXJJZD9cbiAgICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwifVxuICAgICAgaWYgbm90IGVtYWlsXG4gICAgICAgIHJldHVybiB7ZXJyb3I6IHRydWUsIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIn1cblxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoX2lkOiB0aGlzLnVzZXJJZClcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzXG4gICAgICBlbWFpbHMuZm9yRWFjaCAoZSktPlxuICAgICAgICBpZiBlLmFkZHJlc3MgPT0gZW1haWxcbiAgICAgICAgICBlLnByaW1hcnkgPSB0cnVlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBlLnByaW1hcnkgPSBmYWxzZVxuXG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlIHtfaWQ6IHRoaXMudXNlcklkfSxcbiAgICAgICAgJHNldDpcbiAgICAgICAgICBlbWFpbHM6IGVtYWlsc1xuICAgICAgICAgIGVtYWlsOiBlbWFpbFxuXG4gICAgICBkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHt1c2VyOiB0aGlzLnVzZXJJZH0seyRzZXQ6IHtlbWFpbDogZW1haWx9fSwge211bHRpOiB0cnVlfSlcbiAgICAgIHJldHVybiB7fVxuXG5cblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgU3RlZWRvcy51c2Vyc19hZGRfZW1haWwgPSAoKS0+XG4gICAgICAgIHN3YWxcbiAgICAgICAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICAgICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICAgICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICAgICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgICAgICAsIChpbnB1dFZhbHVlKSAtPlxuICAgICAgICAgICAgTWV0ZW9yLmNhbGwgXCJ1c2Vyc19hZGRfZW1haWxcIiwgaW5wdXRWYWx1ZSwgKGVycm9yLCByZXN1bHQpLT5cbiAgICAgICAgICAgICAgICBpZiByZXN1bHQ/LmVycm9yXG4gICAgICAgICAgICAgICAgICAgIHRvYXN0ci5lcnJvciByZXN1bHQubWVzc2FnZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3dhbCB0KFwicHJpbWFyeV9lbWFpbF91cGRhdGVkXCIpLCBcIlwiLCBcInN1Y2Nlc3NcIlxuIyMjXG4gICAgVHJhY2tlci5hdXRvcnVuIChjKSAtPlxuXG4gICAgICAgIGlmIE1ldGVvci51c2VyKClcbiAgICAgICAgICBpZiBNZXRlb3IubG9nZ2luZ0luKClcbiAgICAgICAgICAgICMg5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4jIyMiLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5tZXRob2RzKHtcbiAgICB1c2Vyc19hZGRfZW1haWw6IGZ1bmN0aW9uKGVtYWlsKSB7XG4gICAgICB2YXIgdXNlcjtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKGRiLnVzZXJzLmZpbmQoe1xuICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICB9KS5jb3VudCgpID4gMCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfZXhpc3RzXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1c2g6IHtcbiAgICAgICAgICAgIGVtYWlsczoge1xuICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRiLnVzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgIF9pZDogdGhpcy51c2VySWRcbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHN0ZWVkb3NfaWQ6IGVtYWlsLFxuICAgICAgICAgICAgZW1haWxzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBlbWFpbCxcbiAgICAgICAgICAgICAgICB2ZXJpZmllZDogZmFsc2VcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodGhpcy51c2VySWQsIGVtYWlsKTtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3JlbW92ZV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBwLCB1c2VyO1xuICAgICAgaWYgKHRoaXMudXNlcklkID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX2xvZ2luX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICghZW1haWwpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBlcnJvcjogdHJ1ZSxcbiAgICAgICAgICBtZXNzYWdlOiBcImVtYWlsX3JlcXVpcmVkXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSk7XG4gICAgICBpZiAoKHVzZXIuZW1haWxzICE9IG51bGwpICYmIHVzZXIuZW1haWxzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgIHAgPSBudWxsO1xuICAgICAgICB1c2VyLmVtYWlscy5mb3JFYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgICAgcCA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGIudXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgICB9LCB7XG4gICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgIGVtYWlsczogcFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfYXRfbGVhc3Rfb25lXCJcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7fTtcbiAgICB9LFxuICAgIHVzZXJzX3ZlcmlmeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIGlmICh0aGlzLnVzZXJJZCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9sb2dpbl9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWVtYWlsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9yZXF1aXJlZFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIS9eKFtBLVowLTlcXC5cXC1cXF9cXCtdKSooW0EtWjAtOVxcK1xcLVxcX10pK1xcQFtBLVowLTldKyhbXFwtXVtBLVowLTldKykqKFtcXC5dW0EtWjAtOVxcLV0rKXsxLDh9JC9pLnRlc3QoZW1haWwpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZXJyb3I6IHRydWUsXG4gICAgICAgICAgbWVzc2FnZTogXCJlbWFpbF9mb3JtYXRfZXJyb3JcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgQWNjb3VudHMuc2VuZFZlcmlmaWNhdGlvbkVtYWlsKHRoaXMudXNlcklkLCBlbWFpbCk7XG4gICAgICByZXR1cm4ge307XG4gICAgfSxcbiAgICB1c2Vyc19zZXRfcHJpbWFyeV9lbWFpbDogZnVuY3Rpb24oZW1haWwpIHtcbiAgICAgIHZhciBlbWFpbHMsIHVzZXI7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfbG9naW5fcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFlbWFpbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVycm9yOiB0cnVlLFxuICAgICAgICAgIG1lc3NhZ2U6IFwiZW1haWxfcmVxdWlyZWRcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdXNlciA9IGRiLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgICB9KTtcbiAgICAgIGVtYWlscyA9IHVzZXIuZW1haWxzO1xuICAgICAgZW1haWxzLmZvckVhY2goZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5hZGRyZXNzID09PSBlbWFpbCkge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBlLnByaW1hcnkgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBkYi51c2Vycy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgZW1haWxzOiBlbWFpbHMsXG4gICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgIHVzZXI6IHRoaXMudXNlcklkXG4gICAgICB9LCB7XG4gICAgICAgICRzZXQ6IHtcbiAgICAgICAgICBlbWFpbDogZW1haWxcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBtdWx0aTogdHJ1ZVxuICAgICAgfSk7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICB9KTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBTdGVlZG9zLnVzZXJzX2FkZF9lbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzd2FsKHtcbiAgICAgIHRpdGxlOiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRcIiksXG4gICAgICB0ZXh0OiB0KFwicHJpbWFyeV9lbWFpbF9uZWVkZWRfZGVzY3JpcHRpb25cIiksXG4gICAgICB0eXBlOiAnaW5wdXQnLFxuICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogZmFsc2UsXG4gICAgICBjbG9zZU9uQ29uZmlybTogZmFsc2UsXG4gICAgICBhbmltYXRpb246IFwic2xpZGUtZnJvbS10b3BcIlxuICAgIH0sIGZ1bmN0aW9uKGlucHV0VmFsdWUpIHtcbiAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcInVzZXJzX2FkZF9lbWFpbFwiLCBpbnB1dFZhbHVlLCBmdW5jdGlvbihlcnJvciwgcmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQgIT0gbnVsbCA/IHJlc3VsdC5lcnJvciA6IHZvaWQgMCkge1xuICAgICAgICAgIHJldHVybiB0b2FzdHIuZXJyb3IocmVzdWx0Lm1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzd2FsKHQoXCJwcmltYXJ5X2VtYWlsX3VwZGF0ZWRcIiksIFwiXCIsIFwic3VjY2Vzc1wiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG59XG5cblxuLypcbiAgICBUcmFja2VyLmF1dG9ydW4gKGMpIC0+XG5cbiAgICAgICAgaWYgTWV0ZW9yLnVzZXIoKVxuICAgICAgICAgIGlmIE1ldGVvci5sb2dnaW5nSW4oKVxuICAgICAgICAgICAgICog5q2j5Zyo55m75b2V5Lit77yM5YiZ5LiN5YGa5aSE55CG77yM5Zug5Li65q2k5pe2TWV0ZW9yLnVzZXJJZCgp5LiN6Laz5LqO6K+B5piO5bey55m75b2V54q25oCBXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICBwcmltYXJ5RW1haWwgPSBNZXRlb3IudXNlcigpLmVtYWlscz9bMF0/LmFkZHJlc3NcbiAgICAgICAgICBpZiAhcHJpbWFyeUVtYWlsXG4gICAgICAgICAgICAgIFN0ZWVkb3MudXNlcnNfYWRkX2VtYWlsKCk7XG4gKi9cbiIsImlmIE1ldGVvci5pc1NlcnZlclxuICAgIE1ldGVvci5tZXRob2RzXG4gICAgICAgIHVwZGF0ZVVzZXJBdmF0YXI6IChhdmF0YXIpIC0+XG4gICAgICAgICAgICAgICAgaWYgbm90IEB1c2VySWQ/XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICAgICAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiBAdXNlcklkfSwgeyRzZXQ6IHthdmF0YXI6IGF2YXRhcn19KSAgIiwiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBNZXRlb3IubWV0aG9kcyh7XG4gICAgdXBkYXRlVXNlckF2YXRhcjogZnVuY3Rpb24oYXZhdGFyKSB7XG4gICAgICBpZiAodGhpcy51c2VySWQgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gZGIudXNlcnMudXBkYXRlKHtcbiAgICAgICAgX2lkOiB0aGlzLnVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIkFjY291bnRzLmVtYWlsVGVtcGxhdGVzID0ge1xuXHRmcm9tOiAoZnVuY3Rpb24oKXtcblx0XHR2YXIgZGVmYXVsdEZyb20gPSBcIlN0ZWVkb3MgPG5vcmVwbHlAbWVzc2FnZS5zdGVlZG9zLmNvbT5cIjtcblx0XHRpZighTWV0ZW9yLnNldHRpbmdzKVxuXHRcdFx0cmV0dXJuIGRlZmF1bHRGcm9tO1xuXHRcdFxuXHRcdGlmKCFNZXRlb3Iuc2V0dGluZ3MuZW1haWwpXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cblx0XHRpZighTWV0ZW9yLnNldHRpbmdzLmVtYWlsLmZyb20pXG5cdFx0XHRyZXR1cm4gZGVmYXVsdEZyb207XG5cdFx0XG5cdFx0cmV0dXJuIE1ldGVvci5zZXR0aW5ncy5lbWFpbC5mcm9tO1xuXHR9KSgpLFxuXHRyZXNldFBhc3N3b3JkOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgc3BsaXRzID0gdXJsLnNwbGl0KFwiL1wiKTtcblx0XHRcdHZhciB0b2tlbkNvZGUgPSBzcGxpdHNbc3BsaXRzLmxlbmd0aC0xXTtcblx0XHRcdHZhciBncmVldGluZyA9IHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSA/IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIgOiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyBcIixcIjtcblx0XHRcdHJldHVybiBncmVldGluZyArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfcmVzZXRfcGFzc3dvcmRfYm9keVwiLHt0b2tlbl9jb2RlOnRva2VuQ29kZX0sdXNlci5sb2NhbGUpICsgXCJcXG5cXG5cIiArIHVybCArIFwiXFxuXFxuXCIgKyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdGhhbmtzXCIse30sdXNlci5sb2NhbGUpICsgXCJcXG5cIjtcblx0XHR9XG5cdH0sXG5cdHZlcmlmeUVtYWlsOiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfdmVyaWZ5X2VtYWlsXCIse30sdXNlci5sb2NhbGUpO1xuXHRcdH0sXG5cdFx0dGV4dDogZnVuY3Rpb24gKHVzZXIsIHVybCkge1xuXHRcdFx0dmFyIGdyZWV0aW5nID0gdXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lID8gVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIiA6IFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF9oZWxsb1wiLHt9LHVzZXIubG9jYWxlKSArIFwiLFwiO1xuXHRcdFx0cmV0dXJuIGdyZWV0aW5nICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF92ZXJpZnlfYWNjb3VudFwiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXFxuXCIgKyB1cmwgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3RoYW5rc1wiLHt9LHVzZXIubG9jYWxlKSArIFwiXFxuXCI7XG5cdFx0fVxuXHR9LFxuXHRlbnJvbGxBY2NvdW50OiB7XG5cdFx0c3ViamVjdDogZnVuY3Rpb24gKHVzZXIpIHtcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfY3JlYXRlX2FjY291bnRcIix7fSx1c2VyLmxvY2FsZSk7XG5cdFx0fSxcblx0XHR0ZXh0OiBmdW5jdGlvbiAodXNlciwgdXJsKSB7XG5cdFx0XHR2YXIgZ3JlZXRpbmcgPSB1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUgPyBUQVBpMThuLl9fKFwidXNlcnNfZW1haWxfaGVsbG9cIix7fSx1c2VyLmxvY2FsZSkgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiIDogVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX2hlbGxvXCIse30sdXNlci5sb2NhbGUpICsgXCIsXCI7XG5cdFx0XHRyZXR1cm4gZ3JlZXRpbmcgKyBcIlxcblxcblwiICsgVEFQaTE4bi5fXyhcInVzZXJzX2VtYWlsX3N0YXJ0X3NlcnZpY2VcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblxcblwiICsgdXJsICsgXCJcXG5cXG5cIiArIFRBUGkxOG4uX18oXCJ1c2Vyc19lbWFpbF90aGFua3NcIix7fSx1c2VyLmxvY2FsZSkgKyBcIlxcblwiO1xuXHRcdH1cblx0fVxufTsiLCIvLyDkv67mlLlmdWxsbmFtZeWAvOaciemXrumimOeahG9yZ2FuaXphdGlvbnNcbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL2FwaS9vcmdhbml6YXRpb25zL3VwZ3JhZGUvXCIsIGZ1bmN0aW9uIChyZXEsIHJlcywgbmV4dCkge1xuICBcblx0dmFyIG9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe2Z1bGxuYW1lOi/mlrDpg6jpl6gvLG5hbWU6eyRuZTpcIuaWsOmDqOmXqFwifX0pO1xuXHRpZiAob3Jncy5jb3VudCgpPjApXG5cdHtcblx0XHRvcmdzLmZvckVhY2ggKGZ1bmN0aW9uIChvcmcpXG5cdFx0e1xuXHRcdFx0Ly8g6Ieq5bex5ZKM5a2Q6YOo6Zeo55qEZnVsbG5hbWXkv67mlLlcblx0XHRcdGRiLm9yZ2FuaXphdGlvbnMuZGlyZWN0LnVwZGF0ZShvcmcuX2lkLCB7JHNldDoge2Z1bGxuYW1lOiBvcmcuY2FsY3VsYXRlRnVsbG5hbWUoKX19KTtcblx0XHRcdFxuXHRcdH0pO1xuXHR9XHRcblxuICBcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICBcdGRhdGE6IHtcblx0ICAgICAgXHRyZXQ6IDAsXG5cdCAgICAgIFx0bXNnOiBcIlN1Y2Nlc3NmdWxseVwiXG4gICAgXHR9XG4gIFx0fSk7XG59KTtcblxuIiwiaWYgTWV0ZW9yLmlzQ29yZG92YVxuICAgICAgICBNZXRlb3Iuc3RhcnR1cCAtPlxuICAgICAgICAgICAgICAgIFB1c2guQ29uZmlndXJlXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmRyb2lkOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lEXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdW5kOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpYnJhdGU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGlvczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFkZ2U6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VuZDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4iLCJpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gUHVzaC5Db25maWd1cmUoe1xuICAgICAgYW5kcm9pZDoge1xuICAgICAgICBzZW5kZXJJRDogd2luZG93LkFORFJPSURfU0VOREVSX0lELFxuICAgICAgICBzb3VuZDogdHJ1ZSxcbiAgICAgICAgdmlicmF0ZTogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGlvczoge1xuICAgICAgICBiYWRnZTogdHJ1ZSxcbiAgICAgICAgY2xlYXJCYWRnZTogdHJ1ZSxcbiAgICAgICAgc291bmQ6IHRydWUsXG4gICAgICAgIGFsZXJ0OiB0cnVlXG4gICAgICB9LFxuICAgICAgYXBwTmFtZTogXCJ3b3JrZmxvd1wiXG4gICAgfSk7XG4gIH0pO1xufVxuIiwiU2VsZWN0b3IgPSB7fVxuXG4jIEZpbHRlciBkYXRhIG9uIHNlcnZlciBieSBzcGFjZSBmaWVsZFxuU2VsZWN0b3Iuc2VsZWN0b3JDaGVja1NwYWNlQWRtaW4gPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0aWYgU3RlZWRvcy5pc1NwYWNlQWRtaW4oKVxuXHRcdFx0cmV0dXJuIHtzcGFjZTogU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpfVxuXHRcdGVsc2Vcblx0XHRcdHJldHVybiB7X2lkOiAtMX1cblxuXHRpZiBNZXRlb3IuaXNTZXJ2ZXJcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUodXNlcklkLCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdGlmICF1c2VyLmlzX2Nsb3VkYWRtaW5cblx0XHRcdHNwYWNlcyA9IGRiLnNwYWNlcy5maW5kKHthZG1pbnM6eyRpbjpbdXNlcklkXX19LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKClcblx0XHRcdHNwYWNlcyA9IHNwYWNlcy5tYXAgKG4pIC0+IHJldHVybiBuLl9pZFxuXHRcdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbiMgRmlsdGVyIGRhdGEgb24gc2VydmVyIGJ5IHNwYWNlIGZpZWxkXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSAodXNlcklkKSAtPlxuXHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHR1c2VySWQgPSBNZXRlb3IudXNlcklkKClcblx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c3BhY2VJZCA9IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKTtcblx0XHRpZiBzcGFjZUlkXG5cdFx0XHRpZiBkYi5zcGFjZV91c2Vycy5maW5kT25lKHt1c2VyOiB1c2VySWQsc3BhY2U6IHNwYWNlSWR9LCB7ZmllbGRzOiB7X2lkOiAxfX0pXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IHNwYWNlSWR9XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cblx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0dW5sZXNzIHVzZXJJZFxuXHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXHRcdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge2ZpZWxkczoge19pZDogMX19KVxuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXR1cm4ge19pZDogLTF9XG5cdFx0c2VsZWN0b3IgPSB7fVxuXHRcdHNwYWNlX3VzZXJzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcklkfSwge2ZpZWxkczoge3NwYWNlOiAxfX0pLmZldGNoKClcblx0XHRzcGFjZXMgPSBbXVxuXHRcdF8uZWFjaCBzcGFjZV91c2VycywgKHUpLT5cblx0XHRcdHNwYWNlcy5wdXNoKHUuc3BhY2UpXG5cdFx0c2VsZWN0b3Iuc3BhY2UgPSB7JGluOiBzcGFjZXN9XG5cdFx0cmV0dXJuIHNlbGVjdG9yXG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPVxuXHRpY29uOiBcImdsb2JlXCJcblx0Y29sb3I6IFwiYmx1ZVwiXG5cdHRhYmxlQ29sdW1uczogW1xuXHRcdHtuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwifSxcblx0XHR7bmFtZTogXCJtb2R1bGVzXCJ9LFxuXHRcdHtuYW1lOiBcInVzZXJfY291bnRcIn0sXG5cdFx0e25hbWU6IFwiZW5kX2RhdGVcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIn0sXG5cdFx0e25hbWU6IFwib3JkZXJfcGFpZCgpXCJ9XG5cdF1cblx0ZXh0cmFGaWVsZHM6IFtcInNwYWNlXCIsIFwiY3JlYXRlZFwiLCBcInBhaWRcIiwgXCJ0b3RhbF9mZWVcIl1cblx0cm91dGVyQWRtaW46IFwiL2FkbWluXCJcblx0c2VsZWN0b3I6ICh1c2VySWQpIC0+XG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XG5cdFx0XHRpZiBTdGVlZG9zLmlzU3BhY2VBZG1pbigpXG5cdFx0XHRcdHJldHVybiB7c3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSwgcGFpZDogdHJ1ZX1cblx0XHRcdGVsc2Vcblx0XHRcdFx0cmV0dXJuIHtfaWQ6IC0xfVxuXG5cdFx0aWYgTWV0ZW9yLmlzU2VydmVyXG5cdFx0XHRyZXR1cm4ge31cblx0c2hvd0VkaXRDb2x1bW46IGZhbHNlXG5cdHNob3dEZWxDb2x1bW46IGZhbHNlXG5cdGRpc2FibGVBZGQ6IHRydWVcblx0cGFnZUxlbmd0aDogMTAwXG5cdG9yZGVyOiBbWzAsIFwiZGVzY1wiXV1cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0QHNwYWNlX3VzZXJfc2lnbnMgPSBkYi5zcGFjZV91c2VyX3NpZ25zXG5cdEBiaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3Jkc1xuXHRBZG1pbkNvbmZpZz8uY29sbGVjdGlvbnNfYWRkXG5cdFx0c3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZ1xuXHRcdGJpbGxpbmdfcGF5X3JlY29yZHM6IGRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWciLCIgICAgICAgICAgICAgXG5cblNlbGVjdG9yID0ge307XG5cblNlbGVjdG9yLnNlbGVjdG9yQ2hlY2tTcGFjZUFkbWluID0gZnVuY3Rpb24odXNlcklkKSB7XG4gIHZhciBzZWxlY3Rvciwgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAoU3RlZWRvcy5pc1NwYWNlQWRtaW4oKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gIH1cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh1c2VySWQsIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHt9O1xuICAgIGlmICghdXNlci5pc19jbG91ZGFkbWluKSB7XG4gICAgICBzcGFjZXMgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgIGFkbWluczoge1xuICAgICAgICAgICRpbjogW3VzZXJJZF1cbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIHNwYWNlcyA9IHNwYWNlcy5tYXAoZnVuY3Rpb24obikge1xuICAgICAgICByZXR1cm4gbi5faWQ7XG4gICAgICB9KTtcbiAgICAgIHNlbGVjdG9yLnNwYWNlID0ge1xuICAgICAgICAkaW46IHNwYWNlc1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG59O1xuXG5TZWxlY3Rvci5zZWxlY3RvckNoZWNrU3BhY2UgPSBmdW5jdGlvbih1c2VySWQpIHtcbiAgdmFyIHNlbGVjdG9yLCBzcGFjZUlkLCBzcGFjZV91c2Vycywgc3BhY2VzLCB1c2VyO1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgdXNlcklkID0gTWV0ZW9yLnVzZXJJZCgpO1xuICAgIGlmICghdXNlcklkKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgICBzcGFjZUlkID0gU2Vzc2lvbi5nZXQoXCJzcGFjZUlkXCIpO1xuICAgIGlmIChzcGFjZUlkKSB7XG4gICAgICBpZiAoZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICAgIHVzZXI6IHVzZXJJZCxcbiAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IC0xXG4gICAgICB9O1xuICAgIH1cbiAgfVxuICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogLTFcbiAgICAgIH07XG4gICAgfVxuICAgIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHVzZXJJZCwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghdXNlcikge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiAtMVxuICAgICAgfTtcbiAgICB9XG4gICAgc2VsZWN0b3IgPSB7fTtcbiAgICBzcGFjZV91c2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcklkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBzcGFjZXMgPSBbXTtcbiAgICBfLmVhY2goc3BhY2VfdXNlcnMsIGZ1bmN0aW9uKHUpIHtcbiAgICAgIHJldHVybiBzcGFjZXMucHVzaCh1LnNwYWNlKTtcbiAgICB9KTtcbiAgICBzZWxlY3Rvci5zcGFjZSA9IHtcbiAgICAgICRpbjogc3BhY2VzXG4gICAgfTtcbiAgICByZXR1cm4gc2VsZWN0b3I7XG4gIH1cbn07XG5cbmRiLmJpbGxpbmdfcGF5X3JlY29yZHMuYWRtaW5Db25maWcgPSB7XG4gIGljb246IFwiZ2xvYmVcIixcbiAgY29sb3I6IFwiYmx1ZVwiLFxuICB0YWJsZUNvbHVtbnM6IFtcbiAgICB7XG4gICAgICBuYW1lOiBcIm9yZGVyX2NyZWF0ZWQoKVwiXG4gICAgfSwge1xuICAgICAgbmFtZTogXCJtb2R1bGVzXCJcbiAgICB9LCB7XG4gICAgICBuYW1lOiBcInVzZXJfY291bnRcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwiZW5kX2RhdGVcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfdG90YWxfZmVlKClcIlxuICAgIH0sIHtcbiAgICAgIG5hbWU6IFwib3JkZXJfcGFpZCgpXCJcbiAgICB9XG4gIF0sXG4gIGV4dHJhRmllbGRzOiBbXCJzcGFjZVwiLCBcImNyZWF0ZWRcIiwgXCJwYWlkXCIsIFwidG90YWxfZmVlXCJdLFxuICByb3V0ZXJBZG1pbjogXCIvYWRtaW5cIixcbiAgc2VsZWN0b3I6IGZ1bmN0aW9uKHVzZXJJZCkge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGlmIChTdGVlZG9zLmlzU3BhY2VBZG1pbigpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6IFNlc3Npb24uZ2V0KFwic3BhY2VJZFwiKSxcbiAgICAgICAgICBwYWlkOiB0cnVlXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIF9pZDogLTFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgfSxcbiAgc2hvd0VkaXRDb2x1bW46IGZhbHNlLFxuICBzaG93RGVsQ29sdW1uOiBmYWxzZSxcbiAgZGlzYWJsZUFkZDogdHJ1ZSxcbiAgcGFnZUxlbmd0aDogMTAwLFxuICBvcmRlcjogW1swLCBcImRlc2NcIl1dXG59O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdGhpcy5zcGFjZV91c2VyX3NpZ25zID0gZGIuc3BhY2VfdXNlcl9zaWducztcbiAgdGhpcy5iaWxsaW5nX3BheV9yZWNvcmRzID0gZGIuYmlsbGluZ19wYXlfcmVjb3JkcztcbiAgcmV0dXJuIHR5cGVvZiBBZG1pbkNvbmZpZyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBBZG1pbkNvbmZpZyAhPT0gbnVsbCA/IEFkbWluQ29uZmlnLmNvbGxlY3Rpb25zX2FkZCh7XG4gICAgc3BhY2VfdXNlcl9zaWduczogZGIuc3BhY2VfdXNlcl9zaWducy5hZG1pbkNvbmZpZyxcbiAgICBiaWxsaW5nX3BheV9yZWNvcmRzOiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmFkbWluQ29uZmlnXG4gIH0pIDogdm9pZCAwO1xufSk7XG4iLCJpZiAoIVtdLmluY2x1ZGVzKSB7XG4gIEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uKHNlYXJjaEVsZW1lbnQgLyosIGZyb21JbmRleCovICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyA9IE9iamVjdCh0aGlzKTtcbiAgICB2YXIgbGVuID0gcGFyc2VJbnQoTy5sZW5ndGgpIHx8IDA7XG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbiA9IHBhcnNlSW50KGFyZ3VtZW50c1sxXSkgfHwgMDtcbiAgICB2YXIgaztcbiAgICBpZiAobiA+PSAwKSB7XG4gICAgICBrID0gbjtcbiAgICB9IGVsc2Uge1xuICAgICAgayA9IGxlbiArIG47XG4gICAgICBpZiAoayA8IDApIHtrID0gMDt9XG4gICAgfVxuICAgIHZhciBjdXJyZW50RWxlbWVudDtcbiAgICB3aGlsZSAoayA8IGxlbikge1xuICAgICAgY3VycmVudEVsZW1lbnQgPSBPW2tdO1xuICAgICAgaWYgKHNlYXJjaEVsZW1lbnQgPT09IGN1cnJlbnRFbGVtZW50IHx8XG4gICAgICAgICAoc2VhcmNoRWxlbWVudCAhPT0gc2VhcmNoRWxlbWVudCAmJiBjdXJyZW50RWxlbWVudCAhPT0gY3VycmVudEVsZW1lbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgaysrO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG59IiwiTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcyA9IE1ldGVvci5zZXR0aW5ncy5wdWJsaWMud2Vic2VydmljZXNcblxuICBpZiAhU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlc1xuICAgIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPVxuICAgICAgd3d3OiBcbiAgICAgICAgc3RhdHVzOiBcImFjdGl2ZVwiLFxuICAgICAgICB1cmw6IFwiL1wiIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIFN0ZWVkb3Muc2V0dGluZ3Mud2Vic2VydmljZXMgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXM7XG4gIGlmICghU3RlZWRvcy5zZXR0aW5ncy53ZWJzZXJ2aWNlcykge1xuICAgIHJldHVybiBTdGVlZG9zLnNldHRpbmdzLndlYnNlcnZpY2VzID0ge1xuICAgICAgd3d3OiB7XG4gICAgICAgIHN0YXR1czogXCJhY3RpdmVcIixcbiAgICAgICAgdXJsOiBcIi9cIlxuICAgICAgfVxuICAgIH07XG4gIH1cbn0pO1xuIiwiQ3JlYXRvci5nZXRVc2VyT2JqZWN0c0xpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdHMpLT5cblx0bGlzdFZpZXdzID0ge31cblxuXHRrZXlzID0gXy5rZXlzKG9iamVjdHMpXG5cblx0b2JqZWN0c1ZpZXdzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib2JqZWN0X2xpc3R2aWV3c1wiKS5maW5kKHtcblx0XHRvYmplY3RfbmFtZTogeyRpbjoga2V5c30sXG5cdFx0c3BhY2U6IHNwYWNlSWQsXG5cdFx0XCIkb3JcIjogW3tvd25lcjogdXNlcklkfSwge3NoYXJlZDogdHJ1ZX1dXG5cdH0sIHtcblx0XHRmaWVsZHM6IHtcblx0XHRcdGNyZWF0ZWQ6IDAsXG5cdFx0XHRtb2RpZmllZDogMCxcblx0XHRcdGNyZWF0ZWRfYnk6IDAsXG5cdFx0XHRtb2RpZmllZF9ieTogMFxuXHRcdH1cblx0fSkuZmV0Y2goKVxuXG5cdF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzID0gKG9iamVjdF9uYW1lKS0+XG5cdFx0X3VzZXJfb2JqZWN0X2xpc3Rfdmlld3MgPSB7fVxuXHRcdG9saXN0Vmlld3MgPSBfLmZpbHRlciBvYmplY3RzVmlld3MsIChvdiktPlxuXHRcdFx0cmV0dXJuIG92Lm9iamVjdF9uYW1lID09IG9iamVjdF9uYW1lXG5cblx0XHRfLmVhY2ggb2xpc3RWaWV3cywgKGxpc3R2aWV3KS0+XG5cdFx0XHRfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXdcblxuXHRcdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cdF8uZm9yRWFjaCBvYmplY3RzLCAobywga2V5KS0+XG5cdFx0bGlzdF92aWV3ID0gX2dldFVzZXJPYmplY3RMaXN0Vmlld3Moa2V5KVxuXHRcdGlmICFfLmlzRW1wdHkobGlzdF92aWV3KVxuXHRcdFx0bGlzdFZpZXdzW2tleV0gPSBsaXN0X3ZpZXdcblx0cmV0dXJuIGxpc3RWaWV3c1xuXG5cbkNyZWF0b3IuZ2V0VXNlck9iamVjdExpc3RWaWV3cyA9ICh1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKS0+XG5cdF91c2VyX29iamVjdF9saXN0X3ZpZXdzID0ge31cblxuXHRvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuXHRcdG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcblx0XHRzcGFjZTogc3BhY2VJZCxcblx0XHRcIiRvclwiOiBbe293bmVyOiB1c2VySWR9LCB7c2hhcmVkOiB0cnVlfV1cblx0fSwge1xuXHRcdGZpZWxkczoge1xuXHRcdFx0Y3JlYXRlZDogMCxcblx0XHRcdG1vZGlmaWVkOiAwLFxuXHRcdFx0Y3JlYXRlZF9ieTogMCxcblx0XHRcdG1vZGlmaWVkX2J5OiAwXG5cdFx0fVxuXHR9KVxuXG5cdG9iamVjdF9saXN0dmlldy5mb3JFYWNoIChsaXN0dmlldyktPlxuXHRcdF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlld1xuXG5cdHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1xuXG5cblxuXG4iLCJDcmVhdG9yLmdldFVzZXJPYmplY3RzTGlzdFZpZXdzID0gZnVuY3Rpb24odXNlcklkLCBzcGFjZUlkLCBvYmplY3RzKSB7XG4gIHZhciBfZ2V0VXNlck9iamVjdExpc3RWaWV3cywga2V5cywgbGlzdFZpZXdzLCBvYmplY3RzVmlld3M7XG4gIGxpc3RWaWV3cyA9IHt9O1xuICBrZXlzID0gXy5rZXlzKG9iamVjdHMpO1xuICBvYmplY3RzVmlld3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiB7XG4gICAgICAkaW46IGtleXNcbiAgICB9LFxuICAgIHNwYWNlOiBzcGFjZUlkLFxuICAgIFwiJG9yXCI6IFtcbiAgICAgIHtcbiAgICAgICAgb3duZXI6IHVzZXJJZFxuICAgICAgfSwge1xuICAgICAgICBzaGFyZWQ6IHRydWVcbiAgICAgIH1cbiAgICBdXG4gIH0sIHtcbiAgICBmaWVsZHM6IHtcbiAgICAgIGNyZWF0ZWQ6IDAsXG4gICAgICBtb2RpZmllZDogMCxcbiAgICAgIGNyZWF0ZWRfYnk6IDAsXG4gICAgICBtb2RpZmllZF9ieTogMFxuICAgIH1cbiAgfSkuZmV0Y2goKTtcbiAgX2dldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbihvYmplY3RfbmFtZSkge1xuICAgIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2xpc3RWaWV3cztcbiAgICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICAgIG9saXN0Vmlld3MgPSBfLmZpbHRlcihvYmplY3RzVmlld3MsIGZ1bmN0aW9uKG92KSB7XG4gICAgICByZXR1cm4gb3Yub2JqZWN0X25hbWUgPT09IG9iamVjdF9uYW1lO1xuICAgIH0pO1xuICAgIF8uZWFjaChvbGlzdFZpZXdzLCBmdW5jdGlvbihsaXN0dmlldykge1xuICAgICAgcmV0dXJuIF91c2VyX29iamVjdF9saXN0X3ZpZXdzW2xpc3R2aWV3Ll9pZF0gPSBsaXN0dmlldztcbiAgICB9KTtcbiAgICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG4gIH07XG4gIF8uZm9yRWFjaChvYmplY3RzLCBmdW5jdGlvbihvLCBrZXkpIHtcbiAgICB2YXIgbGlzdF92aWV3O1xuICAgIGxpc3RfdmlldyA9IF9nZXRVc2VyT2JqZWN0TGlzdFZpZXdzKGtleSk7XG4gICAgaWYgKCFfLmlzRW1wdHkobGlzdF92aWV3KSkge1xuICAgICAgcmV0dXJuIGxpc3RWaWV3c1trZXldID0gbGlzdF92aWV3O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBsaXN0Vmlld3M7XG59O1xuXG5DcmVhdG9yLmdldFVzZXJPYmplY3RMaXN0Vmlld3MgPSBmdW5jdGlvbih1c2VySWQsIHNwYWNlSWQsIG9iamVjdF9uYW1lKSB7XG4gIHZhciBfdXNlcl9vYmplY3RfbGlzdF92aWV3cywgb2JqZWN0X2xpc3R2aWV3O1xuICBfdXNlcl9vYmplY3RfbGlzdF92aWV3cyA9IHt9O1xuICBvYmplY3RfbGlzdHZpZXcgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvYmplY3RfbGlzdHZpZXdzXCIpLmZpbmQoe1xuICAgIG9iamVjdF9uYW1lOiBvYmplY3RfbmFtZSxcbiAgICBzcGFjZTogc3BhY2VJZCxcbiAgICBcIiRvclwiOiBbXG4gICAgICB7XG4gICAgICAgIG93bmVyOiB1c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgc2hhcmVkOiB0cnVlXG4gICAgICB9XG4gICAgXVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBjcmVhdGVkOiAwLFxuICAgICAgbW9kaWZpZWQ6IDAsXG4gICAgICBjcmVhdGVkX2J5OiAwLFxuICAgICAgbW9kaWZpZWRfYnk6IDBcbiAgICB9XG4gIH0pO1xuICBvYmplY3RfbGlzdHZpZXcuZm9yRWFjaChmdW5jdGlvbihsaXN0dmlldykge1xuICAgIHJldHVybiBfdXNlcl9vYmplY3RfbGlzdF92aWV3c1tsaXN0dmlldy5faWRdID0gbGlzdHZpZXc7XG4gIH0pO1xuICByZXR1cm4gX3VzZXJfb2JqZWN0X2xpc3Rfdmlld3M7XG59O1xuIiwiLy8gU2VydmVyU2Vzc2lvbiA9IChmdW5jdGlvbiAoKSB7XG4vLyAgICd1c2Ugc3RyaWN0JztcblxuLy8gICB2YXIgQ29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKCdzZXJ2ZXJfc2Vzc2lvbnMnKTtcblxuLy8gICB2YXIgY2hlY2tGb3JLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICd1bmRlZmluZWQnKSB7XG4vLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBwcm92aWRlIGEga2V5IScpO1xuLy8gICAgIH1cbi8vICAgfTtcbi8vICAgdmFyIGdldFNlc3Npb25WYWx1ZSA9IGZ1bmN0aW9uIChvYmosIGtleSkge1xuLy8gICAgIHJldHVybiBvYmogJiYgb2JqLnZhbHVlcyAmJiBvYmoudmFsdWVzW2tleV07XG4vLyAgIH07XG4vLyAgIHZhciBjb25kaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgcmV0dXJuIHRydWU7XG4vLyAgIH07XG5cbi8vICAgQ29sbGVjdGlvbi5kZW55KHtcbi8vICAgICAnaW5zZXJ0JzogZnVuY3Rpb24gKCkge1xuLy8gICAgICAgcmV0dXJuIHRydWU7XG4vLyAgICAgfSxcbi8vICAgICAndXBkYXRlJyA6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH0sXG4vLyAgICAgJ3JlbW92ZSc6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgIHJldHVybiB0cnVlO1xuLy8gICAgIH1cbi8vICAgfSk7XG5cbi8vICAgLy8gcHVibGljIGNsaWVudCBhbmQgc2VydmVyIGFwaVxuLy8gICB2YXIgYXBpID0ge1xuLy8gICAgICdnZXQnOiBmdW5jdGlvbiAoa2V5KSB7XG4vLyAgICAgICBjb25zb2xlLmxvZyhDb2xsZWN0aW9uLmZpbmRPbmUoKSk7XG4vLyAgICAgICB2YXIgc2Vzc2lvbk9iaiA9IENvbGxlY3Rpb24uZmluZE9uZSgpO1xuLy8gICAgICAgaWYoTWV0ZW9yLmlzU2VydmVyKXtcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpO1xuLy8gICAgICAgfVxuLy8gICAgICAgLy8gdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbi8vICAgICAgIC8vICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG4vLyAgICAgICByZXR1cm4gZ2V0U2Vzc2lvblZhbHVlKHNlc3Npb25PYmosIGtleSk7XG4vLyAgICAgfSxcbi8vICAgICAnZXF1YWxzJzogZnVuY3Rpb24gKGtleSwgZXhwZWN0ZWQsIGlkZW50aWNhbCkge1xuLy8gICAgICAgdmFyIHNlc3Npb25PYmogPSBNZXRlb3IuaXNTZXJ2ZXIgPyBcbi8vICAgICAgICAgTWV0ZW9yLmNhbGwoJ3NlcnZlci1zZXNzaW9uL2dldCcpIDogQ29sbGVjdGlvbi5maW5kT25lKCk7XG5cbi8vICAgICAgIHZhciB2YWx1ZSA9IGdldFNlc3Npb25WYWx1ZShzZXNzaW9uT2JqLCBrZXkpO1xuXG4vLyAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkgJiYgXy5pc09iamVjdChleHBlY3RlZCkpIHtcbi8vICAgICAgICAgcmV0dXJuIF8odmFsdWUpLmlzRXF1YWwoZXhwZWN0ZWQpO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBpZiAoaWRlbnRpY2FsID09IGZhbHNlKSB7XG4vLyAgICAgICAgIHJldHVybiBleHBlY3RlZCA9PSB2YWx1ZTtcbi8vICAgICAgIH1cblxuLy8gICAgICAgcmV0dXJuIGV4cGVjdGVkID09PSB2YWx1ZTtcbi8vICAgICB9XG4vLyAgIH07XG5cbi8vICAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKXtcbi8vICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4vLyAgICAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKXtcbi8vICAgICAgICAgaWYoTWV0ZW9yLnVzZXJJZCgpKXtcbi8vICAgICAgICAgICBNZXRlb3Iuc3Vic2NyaWJlKCdzZXJ2ZXItc2Vzc2lvbicpO1xuLy8gICAgICAgICB9XG4vLyAgICAgICB9KVxuLy8gICAgIH1cbi8vICAgfSlcblxuLy8gICBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4vLyAgICAgLy8gTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24gKCkge1xuLy8gICAgIC8vICAgaWYgKENvbGxlY3Rpb24uZmluZE9uZSgpKSB7XG4vLyAgICAgLy8gICAgIENvbGxlY3Rpb24ucmVtb3ZlKHt9KTsgLy8gY2xlYXIgb3V0IGFsbCBzdGFsZSBzZXNzaW9uc1xuLy8gICAgIC8vICAgfVxuLy8gICAgIC8vIH0pO1xuXG4vLyAgICAgTWV0ZW9yLm9uQ29ubmVjdGlvbihmdW5jdGlvbiAoY29ubmVjdGlvbikge1xuLy8gICAgICAgdmFyIGNsaWVudElEID0gY29ubmVjdGlvbi5pZDtcblxuLy8gICAgICAgaWYgKCFDb2xsZWN0aW9uLmZpbmRPbmUoeyAnY2xpZW50SUQnOiBjbGllbnRJRCB9KSkge1xuLy8gICAgICAgICBDb2xsZWN0aW9uLmluc2VydCh7ICdjbGllbnRJRCc6IGNsaWVudElELCAndmFsdWVzJzoge30sIFwiY3JlYXRlZFwiOiBuZXcgRGF0ZSgpIH0pO1xuLy8gICAgICAgfVxuXG4vLyAgICAgICBjb25uZWN0aW9uLm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICBDb2xsZWN0aW9uLnJlbW92ZSh7ICdjbGllbnRJRCc6IGNsaWVudElEIH0pO1xuLy8gICAgICAgfSk7XG4vLyAgICAgfSk7XG5cbi8vICAgICBNZXRlb3IucHVibGlzaCgnc2VydmVyLXNlc3Npb24nLCBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICByZXR1cm4gQ29sbGVjdGlvbi5maW5kKHsgJ2NsaWVudElEJzogdGhpcy5jb25uZWN0aW9uLmlkIH0pO1xuLy8gICAgIH0pO1xuXG4vLyAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuLy8gICAgICAgJ3NlcnZlci1zZXNzaW9uL2dldCc6IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgcmV0dXJuIENvbGxlY3Rpb24uZmluZE9uZSh7ICdjbGllbnRJRCc6IHRoaXMuY29ubmVjdGlvbi5pZCB9KTtcbi8vICAgICAgIH0sXG4vLyAgICAgICAnc2VydmVyLXNlc3Npb24vc2V0JzogZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbi8vICAgICAgICAgaWYgKCF0aGlzLnJhbmRvbVNlZWQpIHJldHVybjtcblxuLy8gICAgICAgICBjaGVja0ZvcktleShrZXkpO1xuXG4vLyAgICAgICAgIGlmICghY29uZGl0aW9uKGtleSwgdmFsdWUpKVxuLy8gICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ0ZhaWxlZCBjb25kaXRpb24gdmFsaWRhdGlvbi4nKTtcblxuLy8gICAgICAgICB2YXIgdXBkYXRlT2JqID0ge307XG4vLyAgICAgICAgIHVwZGF0ZU9ialsndmFsdWVzLicgKyBrZXldID0gdmFsdWU7XG5cbi8vICAgICAgICAgQ29sbGVjdGlvbi51cGRhdGUoeyAnY2xpZW50SUQnOiB0aGlzLmNvbm5lY3Rpb24uaWQgfSwgeyAkc2V0OiB1cGRhdGVPYmogfSk7XG4vLyAgICAgICB9XG4vLyAgICAgfSk7ICBcblxuLy8gICAgIC8vIHNlcnZlci1vbmx5IGFwaVxuLy8gICAgIF8uZXh0ZW5kKGFwaSwge1xuLy8gICAgICAgJ3NldCc6IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4vLyAgICAgICAgIE1ldGVvci5jYWxsKCdzZXJ2ZXItc2Vzc2lvbi9zZXQnLCBrZXksIHZhbHVlKTsgICAgICAgICAgXG4vLyAgICAgICB9LFxuLy8gICAgICAgJ3NldENvbmRpdGlvbic6IGZ1bmN0aW9uIChuZXdDb25kaXRpb24pIHtcbi8vICAgICAgICAgY29uZGl0aW9uID0gbmV3Q29uZGl0aW9uO1xuLy8gICAgICAgfVxuLy8gICAgIH0pO1xuLy8gICB9XG5cbi8vICAgcmV0dXJuIGFwaTtcbi8vIH0pKCk7IiwiSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXBpL2dldC9hcHBzJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuXHR0cnlcblx0XHR1c2VyX2lkID0gcmVxLmhlYWRlcnNbJ3gtdXNlci1pZCddIHx8IHJlcS5xdWVyeT8udXNlcklkXG5cblx0XHRzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgcmVxLnF1ZXJ5Py5zcGFjZUlkXG5cblx0XHR1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpXG5cdFx0XG5cdFx0aWYgIXVzZXJcblx0XHRcdEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG5cdFx0XHRcdGNvZGU6IDQwMSxcblx0XHRcdFx0ZGF0YTpcblx0XHRcdFx0XHRcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcblx0XHRcdFx0XHRcInN1Y2Nlc3NcIjogZmFsc2Vcblx0XHRcdHJldHVybjtcblxuXHRcdHVzZXJfaWQgPSB1c2VyLl9pZFxuXG5cdFx0IyDmoKHpqoxzcGFjZeaYr+WQpuWtmOWcqFxuXHRcdHV1Zmxvd01hbmFnZXIuZ2V0U3BhY2Uoc3BhY2VfaWQpXG5cblx0XHRsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6dXNlcl9pZH0pLmxvY2FsZVxuXHRcdGlmIGxvY2FsZSA9PSBcImVuLXVzXCJcblx0XHRcdGxvY2FsZSA9IFwiZW5cIlxuXHRcdGlmIGxvY2FsZSA9PSBcInpoLWNuXCJcblx0XHRcdGxvY2FsZSA9IFwiemgtQ05cIlxuXG5cdFx0c3BhY2VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7dXNlcjogdXNlcl9pZH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKVxuXHRcdGFwcHMgPSBkYi5hcHBzLmZpbmQoeyRvcjogW3tzcGFjZTogeyRleGlzdHM6IGZhbHNlfX0sIHtzcGFjZTogeyRpbjpzcGFjZXN9fV19LHtzb3J0Ontzb3J0OjF9fSkuZmV0Y2goKVxuXG5cdFx0YXBwcy5mb3JFYWNoIChhcHApIC0+XG5cdFx0XHRhcHAubmFtZSA9IFRBUGkxOG4uX18oYXBwLm5hbWUse30sbG9jYWxlKVxuXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiBhcHBzfVxuXHRjYXRjaCBlXG5cdFx0Y29uc29sZS5lcnJvciBlLnN0YWNrXG5cdFx0SnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcblx0XHRcdGNvZGU6IDIwMFxuXHRcdFx0ZGF0YTogeyBlcnJvcnM6IFt7ZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2V9XX1cblx0XG5cdFx0IiwiSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2dldC9hcHBzJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcHMsIGUsIGxvY2FsZSwgcmVmLCByZWYxLCBzcGFjZV9pZCwgc3BhY2VzLCB1c2VyLCB1c2VyX2lkO1xuICB0cnkge1xuICAgIHVzZXJfaWQgPSByZXEuaGVhZGVyc1sneC11c2VyLWlkJ10gfHwgKChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYudXNlcklkIDogdm9pZCAwKTtcbiAgICBzcGFjZV9pZCA9IHJlcS5oZWFkZXJzWyd4LXNwYWNlLWlkJ10gfHwgKChyZWYxID0gcmVxLnF1ZXJ5KSAhPSBudWxsID8gcmVmMS5zcGFjZUlkIDogdm9pZCAwKTtcbiAgICB1c2VyID0gU3RlZWRvcy5nZXRBUElMb2dpblVzZXIocmVxLCByZXMpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlbixYLVVzZXItSWRcIixcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJfaWQgPSB1c2VyLl9pZDtcbiAgICB1dWZsb3dNYW5hZ2VyLmdldFNwYWNlKHNwYWNlX2lkKTtcbiAgICBsb2NhbGUgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pLmxvY2FsZTtcbiAgICBpZiAobG9jYWxlID09PSBcImVuLXVzXCIpIHtcbiAgICAgIGxvY2FsZSA9IFwiZW5cIjtcbiAgICB9XG4gICAgaWYgKGxvY2FsZSA9PT0gXCJ6aC1jblwiKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLUNOXCI7XG4gICAgfVxuICAgIHNwYWNlcyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1xuICAgICAgdXNlcjogdXNlcl9pZFxuICAgIH0pLmZldGNoKCkuZ2V0UHJvcGVydHkoXCJzcGFjZVwiKTtcbiAgICBhcHBzID0gZGIuYXBwcy5maW5kKHtcbiAgICAgICRvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgc3BhY2U6IHtcbiAgICAgICAgICAgICRpbjogc3BhY2VzXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBzb3J0OiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKSB7XG4gICAgICByZXR1cm4gYXBwLm5hbWUgPSBUQVBpMThuLl9fKGFwcC5uYW1lLCB7fSwgbG9jYWxlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YToge1xuICAgICAgICBzdGF0dXM6IFwic3VjY2Vzc1wiLFxuICAgICAgICBkYXRhOiBhcHBzXG4gICAgICB9XG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgZXJyb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgZXJyb3JNZXNzYWdlOiBlLm1lc3NhZ2VcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG4iLCJDb29raWVzID0gcmVxdWlyZShcImNvb2tpZXNcIilcbnN0ZWVkb3NBdXRoID0gcmVxdWlyZShcIkBzdGVlZG9zL2F1dGhcIilcblxuSnNvblJvdXRlcy5hZGQgXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRcIiwgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgIHRyeVxuICAgICAgICBjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzIClcbiAgICAgICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcblxuICAgICAgICBpZiAhYXV0aFRva2VuXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAxLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsXG4gICAgICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3JcbiAgICAgICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnNcbiAgICAgICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZVxuICAgICAgICBkYXRhID0gW11cbiAgICAgICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAncm9sZXMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMg55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpXG4gICAgICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKVxuICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIC0+XG4gICAgICAgICAgICBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICAgICAgICAgIGNiKHJlamVjdCwgcmVzb2x2ZSlcbiAgICAgICAgICAgICkoYXV0aFRva2VuLCBzcGFjZSlcbiAgICAgICAgdW5sZXNzIHVzZXJTZXNzaW9uXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdXNlcklkID0gdXNlclNlc3Npb24udXNlcklkXG5cbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhZGJbbW9kZWxdXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG5cbiAgICAgICAgaWYgIW9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgICAgIHNlbGVjdG9yLnNwYWNlID0gc3BhY2VcblxuICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmQoc2VsZWN0b3IsIG9wdGlvbnMpLmZldGNoKClcblxuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlLnN0YWNrXG4gICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiAyMDAsXG4gICAgICAgICAgICBkYXRhOiBbXVxuXG5cbkpzb25Sb3V0ZXMuYWRkIFwicG9zdFwiLCBcIi9hcGkvY29sbGVjdGlvbi9maW5kb25lXCIsIChyZXEsIHJlcywgbmV4dCkgLT5cbiAgICB0cnlcbiAgICAgICAgY29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApXG4gICAgICAgIGF1dGhUb2tlbiA9IHJlcS5ib2R5W1wiWC1BdXRoLVRva2VuXCJdIHx8IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cbiAgICAgICAgaWYgIWF1dGhUb2tlblxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMSxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbFxuICAgICAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yXG4gICAgICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zXG4gICAgICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2VcbiAgICAgICAgZGF0YSA9IFtdXG4gICAgICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnLCAncm9sZXMnXVxuXG4gICAgICAgIGlmICFzcGFjZVxuICAgICAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgICAgIGRhdGE6XG4gICAgICAgICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgc3BhY2UgXCIgKyBzcGFjZSxcbiAgICAgICAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgICMg55So5oi355m75b2V6aqM6K+BXG4gICAgICAgIGNoZWNrKHNwYWNlLCBTdHJpbmcpXG4gICAgICAgIGNoZWNrKGF1dGhUb2tlbiwgU3RyaW5nKVxuICAgICAgICB1c2VyU2Vzc2lvbiA9IE1ldGVvci53cmFwQXN5bmMoKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIC0+XG4gICAgICAgICAgICBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbiAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICAgICAgICAgIGNiKHJlamVjdCwgcmVzb2x2ZSlcbiAgICAgICAgICAgICkoYXV0aFRva2VuLCBzcGFjZSlcbiAgICAgICAgdW5sZXNzIHVzZXJTZXNzaW9uXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiYXV0aCBmYWlsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgdXNlcklkID0gdXNlclNlc3Npb24udXNlcklkXG5cbiAgICAgICAgaWYgIWFsbG93X21vZGVscy5pbmNsdWRlcyhtb2RlbClcbiAgICAgICAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdCByZXMsXG4gICAgICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgICAgICBkYXRhOlxuICAgICAgICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIG1vZGVsIFwiICsgbW9kZWwsXG4gICAgICAgICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiAhZGJbbW9kZWxdXG4gICAgICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogNDAzLFxuICAgICAgICAgICAgZGF0YTpcbiAgICAgICAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgIXNlbGVjdG9yXG4gICAgICAgICAgICBzZWxlY3RvciA9IHt9XG5cbiAgICAgICAgaWYgIW9wdGlvbnNcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fVxuXG4gICAgICAgIGlmIG1vZGVsID09ICdtYWlsX2FjY291bnRzJ1xuICAgICAgICAgICAgc2VsZWN0b3IgPSB7fVxuICAgICAgICAgICAgc2VsZWN0b3Iub3duZXIgPSB1c2VySWRcbiAgICAgICAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3RvcilcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZVxuXG4gICAgICAgICAgICBkYXRhID0gZGJbbW9kZWxdLmZpbmRPbmUoc2VsZWN0b3IsIG9wdGlvbnMpXG5cbiAgICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0IHJlcyxcbiAgICAgICAgICAgIGNvZGU6IDIwMCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICBjYXRjaCBlXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuICAgICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQgcmVzLFxuICAgICAgICAgICAgY29kZTogMjAwLFxuICAgICAgICAgICAgZGF0YToge31cbiIsInZhciBDb29raWVzLCBzdGVlZG9zQXV0aDtcblxuQ29va2llcyA9IHJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5zdGVlZG9zQXV0aCA9IHJlcXVpcmUoXCJAc3RlZWRvcy9hdXRoXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcInBvc3RcIiwgXCIvYXBpL2NvbGxlY3Rpb24vZmluZFwiLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYWxsb3dfbW9kZWxzLCBhdXRoVG9rZW4sIGNvb2tpZXMsIGRhdGEsIGUsIG1vZGVsLCBvcHRpb25zLCBzZWxlY3Rvciwgc3BhY2UsIHVzZXJJZCwgdXNlclNlc3Npb247XG4gIHRyeSB7XG4gICAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgICBhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXSB8fCBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgICBpZiAoIWF1dGhUb2tlbikge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDEsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiVmFsaWRhdGUgUmVxdWVzdCAtLSBNaXNzaW5nIFgtQXV0aC1Ub2tlblwiLFxuICAgICAgICAgIFwiaW5zdGFuY2VcIjogXCIxMzI5NTk4ODYxXCIsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBtb2RlbCA9IHJlcS5ib2R5Lm1vZGVsO1xuICAgIHNlbGVjdG9yID0gcmVxLmJvZHkuc2VsZWN0b3I7XG4gICAgb3B0aW9ucyA9IHJlcS5ib2R5Lm9wdGlvbnM7XG4gICAgc3BhY2UgPSByZXEuYm9keS5zcGFjZTtcbiAgICBkYXRhID0gW107XG4gICAgYWxsb3dfbW9kZWxzID0gWydzcGFjZV91c2VycycsICdvcmdhbml6YXRpb25zJywgJ2Zsb3dfcm9sZXMnLCAncm9sZXMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZyk7XG4gICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9KShhdXRoVG9rZW4sIHNwYWNlKTtcbiAgICBpZiAoIXVzZXJTZXNzaW9uKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcklkID0gdXNlclNlc3Npb24udXNlcklkO1xuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBzZWxlY3Rvci5zcGFjZSA9IHNwYWNlO1xuICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZChzZWxlY3Rvciwgb3B0aW9ucykuZmV0Y2goKTtcbiAgICByZXR1cm4gSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgY29kZTogMjAwLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBbXVxuICAgIH0pO1xuICB9XG59KTtcblxuSnNvblJvdXRlcy5hZGQoXCJwb3N0XCIsIFwiL2FwaS9jb2xsZWN0aW9uL2ZpbmRvbmVcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFsbG93X21vZGVscywgYXV0aFRva2VuLCBjb29raWVzLCBkYXRhLCBlLCBtb2RlbCwgb3B0aW9ucywgc2VsZWN0b3IsIHNwYWNlLCB1c2VySWQsIHVzZXJTZXNzaW9uO1xuICB0cnkge1xuICAgIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gICAgYXV0aFRva2VuID0gcmVxLmJvZHlbXCJYLUF1dGgtVG9rZW5cIl0gfHwgY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAxLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcIlZhbGlkYXRlIFJlcXVlc3QgLS0gTWlzc2luZyBYLUF1dGgtVG9rZW5cIixcbiAgICAgICAgICBcImluc3RhbmNlXCI6IFwiMTMyOTU5ODg2MVwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbW9kZWwgPSByZXEuYm9keS5tb2RlbDtcbiAgICBzZWxlY3RvciA9IHJlcS5ib2R5LnNlbGVjdG9yO1xuICAgIG9wdGlvbnMgPSByZXEuYm9keS5vcHRpb25zO1xuICAgIHNwYWNlID0gcmVxLmJvZHkuc3BhY2U7XG4gICAgZGF0YSA9IFtdO1xuICAgIGFsbG93X21vZGVscyA9IFsnc3BhY2VfdXNlcnMnLCAnb3JnYW5pemF0aW9ucycsICdmbG93X3JvbGVzJywgJ21haWxfYWNjb3VudHMnLCAncm9sZXMnXTtcbiAgICBpZiAoIXNwYWNlKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDQwMyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJpbnZhbGlkIHNwYWNlIFwiICsgc3BhY2UsXG4gICAgICAgICAgXCJzdWNjZXNzXCI6IGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjaGVjayhzcGFjZSwgU3RyaW5nKTtcbiAgICBjaGVjayhhdXRoVG9rZW4sIFN0cmluZyk7XG4gICAgdXNlclNlc3Npb24gPSBNZXRlb3Iud3JhcEFzeW5jKGZ1bmN0aW9uKGF1dGhUb2tlbiwgc3BhY2VJZCwgY2IpIHtcbiAgICAgIHJldHVybiBzdGVlZG9zQXV0aC5nZXRTZXNzaW9uKGF1dGhUb2tlbiwgc3BhY2VJZCkudGhlbihmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgcmV0dXJuIGNiKHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgICB9KTtcbiAgICB9KShhdXRoVG9rZW4sIHNwYWNlKTtcbiAgICBpZiAoIXVzZXJTZXNzaW9uKSB7XG4gICAgICBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICAgIGNvZGU6IDUwMCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIFwiZXJyb3JcIjogXCJhdXRoIGZhaWxlZFwiLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcklkID0gdXNlclNlc3Npb24udXNlcklkO1xuICAgIGlmICghYWxsb3dfbW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuICAgICAgSnNvblJvdXRlcy5zZW5kUmVzdWx0KHJlcywge1xuICAgICAgICBjb2RlOiA0MDMsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBcImVycm9yXCI6IFwiaW52YWxpZCBtb2RlbCBcIiArIG1vZGVsLFxuICAgICAgICAgIFwic3VjY2Vzc1wiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCFkYlttb2RlbF0pIHtcbiAgICAgIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgICAgY29kZTogNDAzLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgXCJlcnJvclwiOiBcImludmFsaWQgbW9kZWwgXCIgKyBtb2RlbCxcbiAgICAgICAgICBcInN1Y2Nlc3NcIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc2VsZWN0b3IpIHtcbiAgICAgIHNlbGVjdG9yID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAobW9kZWwgPT09ICdtYWlsX2FjY291bnRzJykge1xuICAgICAgc2VsZWN0b3IgPSB7fTtcbiAgICAgIHNlbGVjdG9yLm93bmVyID0gdXNlcklkO1xuICAgICAgZGF0YSA9IGRiW21vZGVsXS5maW5kT25lKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0b3Iuc3BhY2UgPSBzcGFjZTtcbiAgICAgIGRhdGEgPSBkYlttb2RlbF0uZmluZE9uZShzZWxlY3Rvciwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBKc29uUm91dGVzLnNlbmRSZXN1bHQocmVzLCB7XG4gICAgICBjb2RlOiAyMDAsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIEpzb25Sb3V0ZXMuc2VuZFJlc3VsdChyZXMsIHtcbiAgICAgIGNvZGU6IDIwMCxcbiAgICAgIGRhdGE6IHt9XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJylcbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKVxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpXG5cbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL2FwaS9zZXR1cC9zc28vOmFwcF9pZFwiLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0YXBwID0gZGIuYXBwcy5maW5kT25lKHJlcS5wYXJhbXMuYXBwX2lkKVxuXHRpZiBhcHBcblx0XHRzZWNyZXQgPSBhcHAuc2VjcmV0XG5cdFx0cmVkaXJlY3RVcmwgPSBhcHAudXJsXG5cdGVsc2Vcblx0XHRzZWNyZXQgPSBcIi04NzYyLWZjYjM2OWIyZThcIlxuXHRcdHJlZGlyZWN0VXJsID0gcmVxLnBhcmFtcy5yZWRpcmVjdFVybFxuXG5cdGlmICFyZWRpcmVjdFVybFxuXHRcdHJlcy53cml0ZUhlYWQgNDAxXG5cdFx0cmVzLmVuZCgpXG5cdFx0cmV0dXJuXG5cblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXG5cdCMgZmlyc3QgY2hlY2sgcmVxdWVzdCBib2R5XG5cdCMgaWYgcmVxLmJvZHlcblx0IyBcdHVzZXJJZCA9IHJlcS5ib2R5W1wiWC1Vc2VyLUlkXCJdXG5cdCMgXHRhdXRoVG9rZW4gPSByZXEuYm9keVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdCMgIyB0aGVuIGNoZWNrIGNvb2tpZVxuXHQjIGlmICF1c2VySWQgb3IgIWF1dGhUb2tlblxuXHQjIFx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcblx0IyBcdGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpXG5cblx0aWYgIXVzZXJJZCBhbmQgIWF1dGhUb2tlblxuXHRcdHVzZXJJZCA9IHJlcS5xdWVyeVtcIlgtVXNlci1JZFwiXVxuXHRcdGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXVxuXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXHRcdGlmIHVzZXJcblx0XHRcdHN0ZWVkb3NfaWQgPSB1c2VyLnN0ZWVkb3NfaWRcblx0XHRcdGlmIGFwcC5zZWNyZXRcblx0XHRcdFx0aXYgPSBhcHAuc2VjcmV0XG5cdFx0XHRlbHNlXG5cdFx0XHRcdGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCJcblx0XHRcdG5vdyA9IHBhcnNlSW50KG5ldyBEYXRlKCkuZ2V0VGltZSgpLzEwMDApLnRvU3RyaW5nKClcblx0XHRcdGtleTMyID0gXCJcIlxuXHRcdFx0bGVuID0gc3RlZWRvc19pZC5sZW5ndGhcblx0XHRcdGlmIGxlbiA8IDMyXG5cdFx0XHRcdGMgPSBcIlwiXG5cdFx0XHRcdGkgPSAwXG5cdFx0XHRcdG0gPSAzMiAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkICsgY1xuXHRcdFx0ZWxzZSBpZiBsZW4gPj0gMzJcblx0XHRcdFx0a2V5MzIgPSBzdGVlZG9zX2lkLnNsaWNlKDAsMzIpXG5cblx0XHRcdGNpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignYWVzLTI1Ni1jYmMnLCBuZXcgQnVmZmVyKGtleTMyLCAndXRmOCcpLCBuZXcgQnVmZmVyKGl2LCAndXRmOCcpKVxuXG5cdFx0XHRjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pXG5cblx0XHRcdHN0ZWVkb3NfdG9rZW4gPSBjaXBoZXJlZE1zZy50b1N0cmluZygnYmFzZTY0JylcblxuXHRcdFx0IyBkZXMtY2JjXG5cdFx0XHRkZXNfaXYgPSBcIi04NzYyLWZjXCJcblx0XHRcdGtleTggPSBcIlwiXG5cdFx0XHRsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aFxuXHRcdFx0aWYgbGVuIDwgOFxuXHRcdFx0XHRjID0gXCJcIlxuXHRcdFx0XHRpID0gMFxuXHRcdFx0XHRtID0gOCAtIGxlblxuXHRcdFx0XHR3aGlsZSBpIDwgbVxuXHRcdFx0XHRcdGMgPSBcIiBcIiArIGNcblx0XHRcdFx0XHRpKytcblx0XHRcdFx0a2V5OCA9IHN0ZWVkb3NfaWQgKyBjXG5cdFx0XHRlbHNlIGlmIGxlbiA+PSA4XG5cdFx0XHRcdGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsOClcblx0XHRcdGRlc19jaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Rlcy1jYmMnLCBuZXcgQnVmZmVyKGtleTgsICd1dGY4JyksIG5ldyBCdWZmZXIoZGVzX2l2LCAndXRmOCcpKVxuXHRcdFx0ZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKVxuXHRcdFx0ZGVzX3N0ZWVkb3NfdG9rZW4gPSBkZXNfY2lwaGVyZWRNc2cudG9TdHJpbmcoJ2Jhc2U2NCcpXG5cblx0XHRcdGpvaW5lciA9IFwiP1wiXG5cblx0XHRcdGlmIHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTFcblx0XHRcdFx0am9pbmVyID0gXCImXCJcblxuXHRcdFx0cmV0dXJudXJsID0gcmVkaXJlY3RVcmwgKyBqb2luZXIgKyBcIlgtVXNlci1JZD1cIiArIHVzZXJJZCArIFwiJlgtQXV0aC1Ub2tlbj1cIiArIGF1dGhUb2tlbiArIFwiJlgtU1RFRURPUy1XRUItSUQ9XCIgKyBzdGVlZG9zX2lkICsgXCImWC1TVEVFRE9TLUFVVEhUT0tFTj1cIiArIHN0ZWVkb3NfdG9rZW4gKyBcIiZTVEVFRE9TLUFVVEhUT0tFTj1cIiArIGRlc19zdGVlZG9zX3Rva2VuXG5cblx0XHRcdGlmIHVzZXIudXNlcm5hbWVcblx0XHRcdFx0cmV0dXJudXJsICs9IFwiJlgtU1RFRURPUy1VU0VSTkFNRT0je2VuY29kZVVSSSh1c2VyLnVzZXJuYW1lKX1cIlxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHJldHVybnVybFxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0cmVzLndyaXRlSGVhZCA0MDFcblx0cmVzLmVuZCgpXG5cdHJldHVyblxuIiwidmFyIENvb2tpZXMsIGNyeXB0bywgZXhwcmVzcztcblxuY3J5cHRvID0gcmVxdWlyZSgnY3J5cHRvJyk7XG5cbkNvb2tpZXMgPSByZXF1aXJlKFwiY29va2llc1wiKTtcblxuZXhwcmVzcyA9IHJlcXVpcmUoXCJleHByZXNzXCIpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9hcGkvc2V0dXAvc3NvLzphcHBfaWRcIiwgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGFwcCwgYXV0aFRva2VuLCBjLCBjaXBoZXIsIGNpcGhlcmVkTXNnLCBjb29raWVzLCBkZXNfY2lwaGVyLCBkZXNfY2lwaGVyZWRNc2csIGRlc19pdiwgZGVzX3N0ZWVkb3NfdG9rZW4sIGhhc2hlZFRva2VuLCBpLCBpdiwgam9pbmVyLCBrZXkzMiwga2V5OCwgbGVuLCBtLCBub3csIHJlZGlyZWN0VXJsLCByZXR1cm51cmwsIHNlY3JldCwgc3RlZWRvc19pZCwgc3RlZWRvc190b2tlbiwgdXNlciwgdXNlcklkO1xuICBhcHAgPSBkYi5hcHBzLmZpbmRPbmUocmVxLnBhcmFtcy5hcHBfaWQpO1xuICBpZiAoYXBwKSB7XG4gICAgc2VjcmV0ID0gYXBwLnNlY3JldDtcbiAgICByZWRpcmVjdFVybCA9IGFwcC51cmw7XG4gIH0gZWxzZSB7XG4gICAgc2VjcmV0ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgcmVkaXJlY3RVcmwgPSByZXEucGFyYW1zLnJlZGlyZWN0VXJsO1xuICB9XG4gIGlmICghcmVkaXJlY3RVcmwpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZCgpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICBpZiAoIXVzZXJJZCAmJiAhYXV0aFRva2VuKSB7XG4gICAgdXNlcklkID0gcmVxLnF1ZXJ5W1wiWC1Vc2VyLUlkXCJdO1xuICAgIGF1dGhUb2tlbiA9IHJlcS5xdWVyeVtcIlgtQXV0aC1Ub2tlblwiXTtcbiAgfVxuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgICBpZiAodXNlcikge1xuICAgICAgc3RlZWRvc19pZCA9IHVzZXIuc3RlZWRvc19pZDtcbiAgICAgIGlmIChhcHAuc2VjcmV0KSB7XG4gICAgICAgIGl2ID0gYXBwLnNlY3JldDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl2ID0gXCItODc2Mi1mY2IzNjliMmU4XCI7XG4gICAgICB9XG4gICAgICBub3cgPSBwYXJzZUludChuZXcgRGF0ZSgpLmdldFRpbWUoKSAvIDEwMDApLnRvU3RyaW5nKCk7XG4gICAgICBrZXkzMiA9IFwiXCI7XG4gICAgICBsZW4gPSBzdGVlZG9zX2lkLmxlbmd0aDtcbiAgICAgIGlmIChsZW4gPCAzMikge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSAzMiAtIGxlbjtcbiAgICAgICAgd2hpbGUgKGkgPCBtKSB7XG4gICAgICAgICAgYyA9IFwiIFwiICsgYztcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAga2V5MzIgPSBzdGVlZG9zX2lkICsgYztcbiAgICAgIH0gZWxzZSBpZiAobGVuID49IDMyKSB7XG4gICAgICAgIGtleTMyID0gc3RlZWRvc19pZC5zbGljZSgwLCAzMik7XG4gICAgICB9XG4gICAgICBjaXBoZXIgPSBjcnlwdG8uY3JlYXRlQ2lwaGVyaXYoJ2Flcy0yNTYtY2JjJywgbmV3IEJ1ZmZlcihrZXkzMiwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihpdiwgJ3V0ZjgnKSk7XG4gICAgICBjaXBoZXJlZE1zZyA9IEJ1ZmZlci5jb25jYXQoW2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBjaXBoZXIuZmluYWwoKV0pO1xuICAgICAgc3RlZWRvc190b2tlbiA9IGNpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGRlc19pdiA9IFwiLTg3NjItZmNcIjtcbiAgICAgIGtleTggPSBcIlwiO1xuICAgICAgbGVuID0gc3RlZWRvc19pZC5sZW5ndGg7XG4gICAgICBpZiAobGVuIDwgOCkge1xuICAgICAgICBjID0gXCJcIjtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIG0gPSA4IC0gbGVuO1xuICAgICAgICB3aGlsZSAoaSA8IG0pIHtcbiAgICAgICAgICBjID0gXCIgXCIgKyBjO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICBrZXk4ID0gc3RlZWRvc19pZCArIGM7XG4gICAgICB9IGVsc2UgaWYgKGxlbiA+PSA4KSB7XG4gICAgICAgIGtleTggPSBzdGVlZG9zX2lkLnNsaWNlKDAsIDgpO1xuICAgICAgfVxuICAgICAgZGVzX2NpcGhlciA9IGNyeXB0by5jcmVhdGVDaXBoZXJpdignZGVzLWNiYycsIG5ldyBCdWZmZXIoa2V5OCwgJ3V0ZjgnKSwgbmV3IEJ1ZmZlcihkZXNfaXYsICd1dGY4JykpO1xuICAgICAgZGVzX2NpcGhlcmVkTXNnID0gQnVmZmVyLmNvbmNhdChbZGVzX2NpcGhlci51cGRhdGUobmV3IEJ1ZmZlcihub3csICd1dGY4JykpLCBkZXNfY2lwaGVyLmZpbmFsKCldKTtcbiAgICAgIGRlc19zdGVlZG9zX3Rva2VuID0gZGVzX2NpcGhlcmVkTXNnLnRvU3RyaW5nKCdiYXNlNjQnKTtcbiAgICAgIGpvaW5lciA9IFwiP1wiO1xuICAgICAgaWYgKHJlZGlyZWN0VXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgICAgam9pbmVyID0gXCImXCI7XG4gICAgICB9XG4gICAgICByZXR1cm51cmwgPSByZWRpcmVjdFVybCArIGpvaW5lciArIFwiWC1Vc2VyLUlkPVwiICsgdXNlcklkICsgXCImWC1BdXRoLVRva2VuPVwiICsgYXV0aFRva2VuICsgXCImWC1TVEVFRE9TLVdFQi1JRD1cIiArIHN0ZWVkb3NfaWQgKyBcIiZYLVNURUVET1MtQVVUSFRPS0VOPVwiICsgc3RlZWRvc190b2tlbiArIFwiJlNURUVET1MtQVVUSFRPS0VOPVwiICsgZGVzX3N0ZWVkb3NfdG9rZW47XG4gICAgICBpZiAodXNlci51c2VybmFtZSkge1xuICAgICAgICByZXR1cm51cmwgKz0gXCImWC1TVEVFRE9TLVVTRVJOQU1FPVwiICsgKGVuY29kZVVSSSh1c2VyLnVzZXJuYW1lKSk7XG4gICAgICB9XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgcmV0dXJudXJsKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbiAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICByZXMuZW5kKCk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdFxuXHRKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hdmF0YXIvOnVzZXJJZCcsIChyZXEsIHJlcywgbmV4dCkgLT5cblx0XHQjIHRoaXMucGFyYW1zID1cblx0XHQjIFx0dXNlcklkOiBkZWNvZGVVUkkocmVxLnVybCkucmVwbGFjZSgvXlxcLy8sICcnKS5yZXBsYWNlKC9cXD8uKiQvLCAnJylcblx0XHR3aWR0aCA9IDUwIDtcblx0XHRoZWlnaHQgPSA1MCA7XG5cdFx0Zm9udFNpemUgPSAyOCA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lndcblx0XHQgICAgd2lkdGggPSByZXEucXVlcnkudyA7XG5cdFx0aWYgcmVxLnF1ZXJ5Lmhcblx0XHQgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5LmggO1xuXHRcdGlmIHJlcS5xdWVyeS5mc1xuICAgICAgICAgICAgZm9udFNpemUgPSByZXEucXVlcnkuZnMgO1xuXG5cdFx0dXNlciA9IGRiLnVzZXJzLmZpbmRPbmUocmVxLnBhcmFtcy51c2VySWQpO1xuXHRcdGlmICF1c2VyXG5cdFx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIuYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgQ3JlYXRvci5nZXRSZWxhdGl2ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgdXNlci5hdmF0YXIpXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIHVzZXIucHJvZmlsZT8uYXZhdGFyXG5cdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgdXNlci5wcm9maWxlLmF2YXRhclxuXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRpZiB1c2VyLmF2YXRhclVybFxuXHRcdFx0cmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIHVzZXIuYXZhdGFyVXJsXG5cdFx0XHRyZXMud3JpdGVIZWFkIDMwMlxuXHRcdFx0cmVzLmVuZCgpXG5cdFx0XHRyZXR1cm5cblxuXHRcdGlmIG5vdCBmaWxlP1xuXHRcdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cdFx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXHRcdFx0c3ZnID0gXCJcIlwiXG5cdFx0XHRcdDxzdmcgdmVyc2lvbj1cIjEuMVwiIGlkPVwiTGF5ZXJfMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4PVwiMHB4XCIgeT1cIjBweFwiXG5cdFx0XHRcdFx0IHZpZXdCb3g9XCIwIDAgNzIgNzJcIiBzdHlsZT1cImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNzIgNzI7XCIgeG1sOnNwYWNlPVwicHJlc2VydmVcIj5cblx0XHRcdFx0PHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPlxuXHRcdFx0XHRcdC5zdDB7ZmlsbDojRkZGRkZGO31cblx0XHRcdFx0XHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XG5cdFx0XHRcdDwvc3R5bGU+XG5cdFx0XHRcdDxnPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QwXCIgZD1cIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XCIvPlxuXHRcdFx0XHRcdDxwYXRoIGNsYXNzPVwic3QxXCIgZD1cIk0zNiwyLjFjMTguNywwLDM0LDE1LjMsMzQsMzRzLTE1LjMsMzQtMzQsMzRTMiw1NC44LDIsMzYuMVMxNy4zLDIuMSwzNiwyLjEgTTM2LDAuMWMtMTkuOSwwLTM2LDE2LjEtMzYsMzZcblx0XHRcdFx0XHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcIi8+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0PGc+XG5cdFx0XHRcdFx0XHQ8cGF0aCBjbGFzcz1cInN0MVwiIGQ9XCJNMzUuOCw0Mi42YzguMywwLDE1LjEtNi44LDE1LjEtMTUuMWMwLTguMy02LjgtMTUuMS0xNS4xLTE1LjFjLTguMywwLTE1LjEsNi44LTE1LjEsMTUuMVxuXHRcdFx0XHRcdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XCIvPlxuXHRcdFx0XHRcdFx0PHBhdGggY2xhc3M9XCJzdDFcIiBkPVwiTTM2LjIsNzAuN2M4LjcsMCwxNi43LTMuMSwyMi45LTguMmMtMy42LTkuNi0xMi43LTE1LjUtMjMuMy0xNS41Yy0xMC40LDAtMTkuNCw1LjctMjMuMSwxNVxuXHRcdFx0XHRcdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elwiLz5cblx0XHRcdFx0XHQ8L2c+XG5cdFx0XHRcdDwvZz5cblx0XHRcdFx0PC9zdmc+XG5cdFx0XHRcIlwiXCJcblx0XHRcdHJlcy53cml0ZSBzdmdcbiNcdFx0XHRyZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgU3RlZWRvcy5hYnNvbHV0ZVVybChcIi9pbWFnZXMvZGVmYXVsdC1hdmF0YXIucG5nXCIpXG4jXHRcdFx0cmVzLndyaXRlSGVhZCAzMDJcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHR1c2VybmFtZSA9IHVzZXIubmFtZTtcblx0XHRpZiAhdXNlcm5hbWVcblx0XHRcdHVzZXJuYW1lID0gXCJcIlxuXG5cdFx0cmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cblx0XHRpZiBub3QgZmlsZT9cblx0XHRcdHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJ1xuXHRcdFx0cmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXG5cblx0XHRcdGNvbG9ycyA9IFsnI0Y0NDMzNicsJyNFOTFFNjMnLCcjOUMyN0IwJywnIzY3M0FCNycsJyMzRjUxQjUnLCcjMjE5NkYzJywnIzAzQTlGNCcsJyMwMEJDRDQnLCcjMDA5Njg4JywnIzRDQUY1MCcsJyM4QkMzNEEnLCcjQ0REQzM5JywnI0ZGQzEwNycsJyNGRjk4MDAnLCcjRkY1NzIyJywnIzc5NTU0OCcsJyM5RTlFOUUnLCcjNjA3RDhCJ11cblxuXHRcdFx0dXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKVxuXHRcdFx0Y29sb3JfaW5kZXggPSAwXG5cdFx0XHRfLmVhY2ggdXNlcm5hbWVfYXJyYXksIChpdGVtKSAtPlxuXHRcdFx0XHRjb2xvcl9pbmRleCArPSBpdGVtLmNoYXJDb2RlQXQoMCk7XG5cblx0XHRcdHBvc2l0aW9uID0gY29sb3JfaW5kZXggJSBjb2xvcnMubGVuZ3RoXG5cdFx0XHRjb2xvciA9IGNvbG9yc1twb3NpdGlvbl1cblx0XHRcdCNjb2xvciA9IFwiI0Q2REFEQ1wiXG5cblx0XHRcdGluaXRpYWxzID0gJydcblx0XHRcdGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpXG5cblx0XHRcdGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxuXG5cdFx0XHRzdmcgPSBcIlwiXCJcblx0XHRcdDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxuXHRcdFx0PHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgcG9pbnRlci1ldmVudHM9XCJub25lXCIgd2lkdGg9XCIje3dpZHRofVwiIGhlaWdodD1cIiN7aGVpZ2h0fVwiIHN0eWxlPVwid2lkdGg6ICN7d2lkdGh9cHg7IGhlaWdodDogI3toZWlnaHR9cHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxuXHRcdFx0XHQ8dGV4dCB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIHk9XCI1MCVcIiB4PVwiNTAlXCIgZHk9XCIwLjM2ZW1cIiBwb2ludGVyLWV2ZW50cz1cImF1dG9cIiBmaWxsPVwiI0ZGRkZGRlwiIGZvbnQtZmFtaWx5PVwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVwiIHN0eWxlPVwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAje2ZvbnRTaXplfXB4O1wiPlxuXHRcdFx0XHRcdCN7aW5pdGlhbHN9XG5cdFx0XHRcdDwvdGV4dD5cblx0XHRcdDwvc3ZnPlxuXHRcdFx0XCJcIlwiXG5cblx0XHRcdHJlcy53cml0ZSBzdmdcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblx0XHRyZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XG5cdFx0aWYgcmVxTW9kaWZpZWRIZWFkZXI/XG5cdFx0XHRpZiByZXFNb2RpZmllZEhlYWRlciA9PSB1c2VyLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXG5cdFx0XHRcdHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxuXHRcdFx0XHRyZXMud3JpdGVIZWFkIDMwNFxuXHRcdFx0XHRyZXMuZW5kKClcblx0XHRcdFx0cmV0dXJuXG5cblx0XHRyZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgdXNlci5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcblx0XHRyZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcblx0XHRyZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXG5cblx0XHRmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcblx0XHRyZXR1cm4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpzb25Sb3V0ZXMuYWRkKCdnZXQnLCAnL2F2YXRhci86dXNlcklkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9yX2luZGV4LCBjb2xvcnMsIGZvbnRTaXplLCBoZWlnaHQsIGluaXRpYWxzLCBwb3NpdGlvbiwgcmVmLCByZWYxLCByZWYyLCByZXFNb2RpZmllZEhlYWRlciwgc3ZnLCB1c2VyLCB1c2VybmFtZSwgdXNlcm5hbWVfYXJyYXksIHdpZHRoO1xuICAgIHdpZHRoID0gNTA7XG4gICAgaGVpZ2h0ID0gNTA7XG4gICAgZm9udFNpemUgPSAyODtcbiAgICBpZiAocmVxLnF1ZXJ5LncpIHtcbiAgICAgIHdpZHRoID0gcmVxLnF1ZXJ5Lnc7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuaCkge1xuICAgICAgaGVpZ2h0ID0gcmVxLnF1ZXJ5Lmg7XG4gICAgfVxuICAgIGlmIChyZXEucXVlcnkuZnMpIHtcbiAgICAgIGZvbnRTaXplID0gcmVxLnF1ZXJ5LmZzO1xuICAgIH1cbiAgICB1c2VyID0gZGIudXNlcnMuZmluZE9uZShyZXEucGFyYW1zLnVzZXJJZCk7XG4gICAgaWYgKCF1c2VyKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh1c2VyLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIENyZWF0b3IuZ2V0UmVsYXRpdmVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHVzZXIuYXZhdGFyKSk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICgocmVmID0gdXNlci5wcm9maWxlKSAhPSBudWxsID8gcmVmLmF2YXRhciA6IHZvaWQgMCkge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIHVzZXIucHJvZmlsZS5hdmF0YXIpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodXNlci5hdmF0YXJVcmwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoXCJMb2NhdGlvblwiLCB1c2VyLmF2YXRhclVybCk7XG4gICAgICByZXMud3JpdGVIZWFkKDMwMik7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnKTtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJyk7XG4gICAgICBzdmcgPSBcIjxzdmcgdmVyc2lvbj1cXFwiMS4xXFxcIiBpZD1cXFwiTGF5ZXJfMVxcXCIgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiB4bWxuczp4bGluaz1cXFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1xcXCIgeD1cXFwiMHB4XFxcIiB5PVxcXCIwcHhcXFwiXFxuXHQgdmlld0JveD1cXFwiMCAwIDcyIDcyXFxcIiBzdHlsZT1cXFwiZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3MiA3MjtcXFwiIHhtbDpzcGFjZT1cXFwicHJlc2VydmVcXFwiPlxcbjxzdHlsZSB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCI+XFxuXHQuc3Qwe2ZpbGw6I0ZGRkZGRjt9XFxuXHQuc3Qxe2ZpbGw6I0QwRDBEMDt9XFxuPC9zdHlsZT5cXG48Zz5cXG5cdDxwYXRoIGNsYXNzPVxcXCJzdDBcXFwiIGQ9XFxcIk0zNiw3MS4xYy0xOS4zLDAtMzUtMTUuNy0zNS0zNXMxNS43LTM1LDM1LTM1czM1LDE1LjcsMzUsMzVTNTUuMyw3MS4xLDM2LDcxLjF6XFxcIi8+XFxuXHQ8cGF0aCBjbGFzcz1cXFwic3QxXFxcIiBkPVxcXCJNMzYsMi4xYzE4LjcsMCwzNCwxNS4zLDM0LDM0cy0xNS4zLDM0LTM0LDM0UzIsNTQuOCwyLDM2LjFTMTcuMywyLjEsMzYsMi4xIE0zNiwwLjFjLTE5LjksMC0zNiwxNi4xLTM2LDM2XFxuXHRcdHMxNi4xLDM2LDM2LDM2czM2LTE2LjEsMzYtMzZTNTUuOSwwLjEsMzYsMC4xTDM2LDAuMXpcXFwiLz5cXG48L2c+XFxuPGc+XFxuXHQ8Zz5cXG5cdFx0PHBhdGggY2xhc3M9XFxcInN0MVxcXCIgZD1cXFwiTTM1LjgsNDIuNmM4LjMsMCwxNS4xLTYuOCwxNS4xLTE1LjFjMC04LjMtNi44LTE1LjEtMTUuMS0xNS4xYy04LjMsMC0xNS4xLDYuOC0xNS4xLDE1LjFcXG5cdFx0XHRDMjAuNywzNS44LDI3LjUsNDIuNiwzNS44LDQyLjZ6XFxcIi8+XFxuXHRcdDxwYXRoIGNsYXNzPVxcXCJzdDFcXFwiIGQ9XFxcIk0zNi4yLDcwLjdjOC43LDAsMTYuNy0zLjEsMjIuOS04LjJjLTMuNi05LjYtMTIuNy0xNS41LTIzLjMtMTUuNWMtMTAuNCwwLTE5LjQsNS43LTIzLjEsMTVcXG5cdFx0XHRDMTksNjcuNCwyNy4yLDcwLjcsMzYuMiw3MC43elxcXCIvPlxcblx0PC9nPlxcbjwvZz5cXG48L3N2Zz5cIjtcbiAgICAgIHJlcy53cml0ZShzdmcpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHVzZXIubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgdXNlcm5hbWVfYXJyYXkgPSBBcnJheS5mcm9tKHVzZXJuYW1lKTtcbiAgICAgIGNvbG9yX2luZGV4ID0gMDtcbiAgICAgIF8uZWFjaCh1c2VybmFtZV9hcnJheSwgZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gY29sb3JfaW5kZXggKz0gaXRlbS5jaGFyQ29kZUF0KDApO1xuICAgICAgfSk7XG4gICAgICBwb3NpdGlvbiA9IGNvbG9yX2luZGV4ICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCJcIiArIHdpZHRoICsgXCJcXFwiIGhlaWdodD1cXFwiXCIgKyBoZWlnaHQgKyBcIlxcXCIgc3R5bGU9XFxcIndpZHRoOiBcIiArIHdpZHRoICsgXCJweDsgaGVpZ2h0OiBcIiArIGhlaWdodCArIFwicHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcblx0PHRleHQgdGV4dC1hbmNob3I9XFxcIm1pZGRsZVxcXCIgeT1cXFwiNTAlXFxcIiB4PVxcXCI1MCVcXFwiIGR5PVxcXCIwLjM2ZW1cXFwiIHBvaW50ZXItZXZlbnRzPVxcXCJhdXRvXFxcIiBmaWxsPVxcXCIjRkZGRkZGXFxcIiBmb250LWZhbWlseT1cXFwiLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBIZWx2ZXRpY2EsIEFyaWFsLCBNaWNyb3NvZnQgWWFoZWksIFNpbUhlaVxcXCIgc3R5bGU9XFxcImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogXCIgKyBmb250U2l6ZSArIFwicHg7XFxcIj5cXG5cdFx0XCIgKyBpbml0aWFscyArIFwiXFxuXHQ8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmMSA9IHVzZXIubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApKSB7XG4gICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlcik7XG4gICAgICAgIHJlcy53cml0ZUhlYWQoMzA0KTtcbiAgICAgICAgcmVzLmVuZCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0xhc3QtTW9kaWZpZWQnLCAoKHJlZjIgPSB1c2VyLm1vZGlmaWVkKSAhPSBudWxsID8gcmVmMi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSB8fCBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKCkpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJyk7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1MZW5ndGgnLCBmaWxlLmxlbmd0aCk7XG4gICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUocmVzKTtcbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdEpzb25Sb3V0ZXMuYWRkICdnZXQnLCAnL2FwaS9hY2Nlc3MvY2hlY2snLCAocmVxLCByZXMsIG5leHQpIC0+XG5cblx0XHRhY2Nlc3NfdG9rZW4gPSByZXEucXVlcnk/LmFjY2Vzc190b2tlblxuXG5cdFx0aWYgU3RlZWRvcy5nZXRVc2VySWRGcm9tQWNjZXNzVG9rZW4oYWNjZXNzX3Rva2VuKVxuXHRcdFx0cmVzLndyaXRlSGVhZCAyMDBcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cdFx0ZWxzZVxuXHRcdFx0cmVzLndyaXRlSGVhZCA0MDFcblx0XHRcdHJlcy5lbmQoKVxuXHRcdFx0cmV0dXJuXG5cblxuXG5cbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXBpL2FjY2Vzcy9jaGVjaycsIGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgdmFyIGFjY2Vzc190b2tlbiwgcmVmO1xuICAgIGFjY2Vzc190b2tlbiA9IChyZWYgPSByZXEucXVlcnkpICE9IG51bGwgPyByZWYuYWNjZXNzX3Rva2VuIDogdm9pZCAwO1xuICAgIGlmIChTdGVlZG9zLmdldFVzZXJJZEZyb21BY2Nlc3NUb2tlbihhY2Nlc3NfdG9rZW4pKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDIwMCk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICBNZXRlb3IucHVibGlzaCAnYXBwcycsIChzcGFjZUlkKS0+XG4gICAgICAgIHVubGVzcyB0aGlzLnVzZXJJZFxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZHkoKVxuICAgICAgICBcblxuICAgICAgICBzZWxlY3RvciA9IHtzcGFjZTogeyRleGlzdHM6IGZhbHNlfX1cbiAgICAgICAgaWYgc3BhY2VJZFxuICAgICAgICAgICAgc2VsZWN0b3IgPSB7JG9yOiBbe3NwYWNlOiB7JGV4aXN0czogZmFsc2V9fSwge3NwYWNlOiBzcGFjZUlkfV19XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZGIuYXBwcy5maW5kKHNlbGVjdG9yLCB7c29ydDoge3NvcnQ6IDF9fSk7XG4iLCJpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIE1ldGVvci5wdWJsaXNoKCdhcHBzJywgZnVuY3Rpb24oc3BhY2VJZCkge1xuICAgIHZhciBzZWxlY3RvcjtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICAgIH1cbiAgICBzZWxlY3RvciA9IHtcbiAgICAgIHNwYWNlOiB7XG4gICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICB9XG4gICAgfTtcbiAgICBpZiAoc3BhY2VJZCkge1xuICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICRvcjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNwYWNlOiB7XG4gICAgICAgICAgICAgICRleGlzdHM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgc3BhY2U6IHNwYWNlSWRcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkYi5hcHBzLmZpbmQoc2VsZWN0b3IsIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgc29ydDogMVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIlxuXG5cdCMgcHVibGlzaCB1c2VycyBzcGFjZXNcblx0IyB3ZSBvbmx5IHB1Ymxpc2ggc3BhY2VzIGN1cnJlbnQgdXNlciBqb2luZWQuXG5cdE1ldGVvci5wdWJsaXNoICdteV9zcGFjZXMnLCAtPlxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cblx0XHRzZWxmID0gdGhpcztcblx0XHR1c2VyU3BhY2VzID0gW11cblx0XHRzdXMgPSBkYi5zcGFjZV91c2Vycy5maW5kKHt1c2VyOiB0aGlzLnVzZXJJZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0sIHtmaWVsZHM6IHtzcGFjZToxfX0pXG5cdFx0c3VzLmZvckVhY2ggKHN1KSAtPlxuXHRcdFx0dXNlclNwYWNlcy5wdXNoKHN1LnNwYWNlKVxuXG5cdFx0aGFuZGxlMiA9IG51bGxcblxuXHRcdCMgb25seSByZXR1cm4gdXNlciBqb2luZWQgc3BhY2VzLCBhbmQgb2JzZXJ2ZXMgd2hlbiB1c2VyIGpvaW4gb3IgbGVhdmUgYSBzcGFjZVxuXHRcdGhhbmRsZSA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3VzZXI6IHRoaXMudXNlcklkLCB1c2VyX2FjY2VwdGVkOiB0cnVlfSkub2JzZXJ2ZVxuXHRcdFx0YWRkZWQ6IChkb2MpIC0+XG5cdFx0XHRcdGlmIGRvYy5zcGFjZVxuXHRcdFx0XHRcdGlmIHVzZXJTcGFjZXMuaW5kZXhPZihkb2Muc3BhY2UpIDwgMFxuXHRcdFx0XHRcdFx0dXNlclNwYWNlcy5wdXNoKGRvYy5zcGFjZSlcblx0XHRcdFx0XHRcdG9ic2VydmVTcGFjZXMoKVxuXHRcdFx0cmVtb3ZlZDogKG9sZERvYykgLT5cblx0XHRcdFx0aWYgb2xkRG9jLnNwYWNlXG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZVxuXHRcdFx0XHRcdHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLnNwYWNlKVxuXG5cdFx0b2JzZXJ2ZVNwYWNlcyA9IC0+XG5cdFx0XHRpZiBoYW5kbGUyXG5cdFx0XHRcdGhhbmRsZTIuc3RvcCgpO1xuXHRcdFx0aGFuZGxlMiA9IGRiLnNwYWNlcy5maW5kKHtfaWQ6IHskaW46IHVzZXJTcGFjZXN9fSkub2JzZXJ2ZVxuXHRcdFx0XHRhZGRlZDogKGRvYykgLT5cblx0XHRcdFx0XHRzZWxmLmFkZGVkIFwic3BhY2VzXCIsIGRvYy5faWQsIGRvYztcblx0XHRcdFx0XHR1c2VyU3BhY2VzLnB1c2goZG9jLl9pZClcblx0XHRcdFx0Y2hhbmdlZDogKG5ld0RvYywgb2xkRG9jKSAtPlxuXHRcdFx0XHRcdHNlbGYuY2hhbmdlZCBcInNwYWNlc1wiLCBuZXdEb2MuX2lkLCBuZXdEb2M7XG5cdFx0XHRcdHJlbW92ZWQ6IChvbGREb2MpIC0+XG5cdFx0XHRcdFx0c2VsZi5yZW1vdmVkIFwic3BhY2VzXCIsIG9sZERvYy5faWRcblx0XHRcdFx0XHR1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5faWQpXG5cblx0XHRvYnNlcnZlU3BhY2VzKCk7XG5cblx0XHRzZWxmLnJlYWR5KCk7XG5cblx0XHRzZWxmLm9uU3RvcCAtPlxuXHRcdFx0aGFuZGxlLnN0b3AoKTtcblx0XHRcdGlmIGhhbmRsZTJcblx0XHRcdFx0aGFuZGxlMi5zdG9wKCk7XG4iLCJNZXRlb3IucHVibGlzaCgnbXlfc3BhY2VzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBoYW5kbGUsIGhhbmRsZTIsIG9ic2VydmVTcGFjZXMsIHNlbGYsIHN1cywgdXNlclNwYWNlcztcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgc2VsZiA9IHRoaXM7XG4gIHVzZXJTcGFjZXMgPSBbXTtcbiAgc3VzID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBzcGFjZTogMVxuICAgIH1cbiAgfSk7XG4gIHN1cy5mb3JFYWNoKGZ1bmN0aW9uKHN1KSB7XG4gICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChzdS5zcGFjZSk7XG4gIH0pO1xuICBoYW5kbGUyID0gbnVsbDtcbiAgaGFuZGxlID0gZGIuc3BhY2VfdXNlcnMuZmluZCh7XG4gICAgdXNlcjogdGhpcy51c2VySWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5vYnNlcnZlKHtcbiAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICBpZiAoZG9jLnNwYWNlKSB7XG4gICAgICAgIGlmICh1c2VyU3BhY2VzLmluZGV4T2YoZG9jLnNwYWNlKSA8IDApIHtcbiAgICAgICAgICB1c2VyU3BhY2VzLnB1c2goZG9jLnNwYWNlKTtcbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZVNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICByZW1vdmVkOiBmdW5jdGlvbihvbGREb2MpIHtcbiAgICAgIGlmIChvbGREb2Muc3BhY2UpIHtcbiAgICAgICAgc2VsZi5yZW1vdmVkKFwic3BhY2VzXCIsIG9sZERvYy5zcGFjZSk7XG4gICAgICAgIHJldHVybiB1c2VyU3BhY2VzID0gXy53aXRob3V0KHVzZXJTcGFjZXMsIG9sZERvYy5zcGFjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgb2JzZXJ2ZVNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChoYW5kbGUyKSB7XG4gICAgICBoYW5kbGUyLnN0b3AoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhbmRsZTIgPSBkYi5zcGFjZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiB1c2VyU3BhY2VzXG4gICAgICB9XG4gICAgfSkub2JzZXJ2ZSh7XG4gICAgICBhZGRlZDogZnVuY3Rpb24oZG9jKSB7XG4gICAgICAgIHNlbGYuYWRkZWQoXCJzcGFjZXNcIiwgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMucHVzaChkb2MuX2lkKTtcbiAgICAgIH0sXG4gICAgICBjaGFuZ2VkOiBmdW5jdGlvbihuZXdEb2MsIG9sZERvYykge1xuICAgICAgICByZXR1cm4gc2VsZi5jaGFuZ2VkKFwic3BhY2VzXCIsIG5ld0RvYy5faWQsIG5ld0RvYyk7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlZDogZnVuY3Rpb24ob2xkRG9jKSB7XG4gICAgICAgIHNlbGYucmVtb3ZlZChcInNwYWNlc1wiLCBvbGREb2MuX2lkKTtcbiAgICAgICAgcmV0dXJuIHVzZXJTcGFjZXMgPSBfLndpdGhvdXQodXNlclNwYWNlcywgb2xkRG9jLl9pZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG9ic2VydmVTcGFjZXMoKTtcbiAgc2VsZi5yZWFkeSgpO1xuICByZXR1cm4gc2VsZi5vblN0b3AoZnVuY3Rpb24oKSB7XG4gICAgaGFuZGxlLnN0b3AoKTtcbiAgICBpZiAoaGFuZGxlMikge1xuICAgICAgcmV0dXJuIGhhbmRsZTIuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIiMgcHVibGlzaCBzb21lIG9uZSBzcGFjZSdzIGF2YXRhclxuTWV0ZW9yLnB1Ymxpc2ggJ3NwYWNlX2F2YXRhcicsIChzcGFjZUlkKS0+XG5cdHVubGVzcyBzcGFjZUlkXG5cdFx0cmV0dXJuIHRoaXMucmVhZHkoKVxuXG5cdHJldHVybiBkYi5zcGFjZXMuZmluZCh7X2lkOiBzcGFjZUlkfSwge2ZpZWxkczoge2F2YXRhcjogMSxuYW1lOiAxLGVuYWJsZV9yZWdpc3RlcjoxfX0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2goJ3NwYWNlX2F2YXRhcicsIGZ1bmN0aW9uKHNwYWNlSWQpIHtcbiAgaWYgKCFzcGFjZUlkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZXR1cm4gZGIuc3BhY2VzLmZpbmQoe1xuICAgIF9pZDogc3BhY2VJZFxuICB9LCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBhdmF0YXI6IDEsXG4gICAgICBuYW1lOiAxLFxuICAgICAgZW5hYmxlX3JlZ2lzdGVyOiAxXG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnB1Ymxpc2ggJ21vZHVsZXMnLCAoKS0+XG5cdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIubW9kdWxlcy5maW5kKCk7IiwiTWV0ZW9yLnB1Ymxpc2goJ21vZHVsZXMnLCBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmV0dXJuIGRiLm1vZHVsZXMuZmluZCgpO1xufSk7XG4iLCJNZXRlb3IucHVibGlzaCAnYmlsbGluZ193ZWl4aW5fcGF5X2NvZGVfdXJsJywgKF9pZCktPlxuXHR1bmxlc3MgdGhpcy51c2VySWRcblx0XHRyZXR1cm4gdGhpcy5yZWFkeSgpXG5cblx0dW5sZXNzIF9pZFxuXHRcdHJldHVybiB0aGlzLnJlYWR5KClcblxuXHRyZXR1cm4gZGIuYmlsbGluZ19wYXlfcmVjb3Jkcy5maW5kKHtfaWQ6IF9pZH0pOyIsIk1ldGVvci5wdWJsaXNoKCdiaWxsaW5nX3dlaXhpbl9wYXlfY29kZV91cmwnLCBmdW5jdGlvbihfaWQpIHtcbiAgaWYgKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYgKCFfaWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHJldHVybiBkYi5iaWxsaW5nX3BheV9yZWNvcmRzLmZpbmQoe1xuICAgIF9pZDogX2lkXG4gIH0pO1xufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfY29udGFjdHNfbGltaXQ6IChzcGFjZSktPlxuXHRcdCMg5qC55o2u5b2T5YmN55So5oi35omA5bGe57uE57uH77yM5p+l6K+i5Ye65b2T5YmN55So5oi36ZmQ5a6a55qE57uE57uH5p+l55yL6IyD5Zu0XG5cdFx0IyDov5Tlm57nmoRpc0xpbWl05Li6dHJ1ZeihqOekuumZkOWumuWcqOW9k+WJjeeUqOaIt+aJgOWcqOe7hOe7h+iMg+WbtO+8jG9yZ2FuaXphdGlvbnPlgLzorrDlvZXpop3lpJbnmoTnu4Tnu4fojIPlm7Rcblx0XHQjIOi/lOWbnueahGlzTGltaXTkuLpmYWxzZeihqOekuuS4jemZkOWumue7hOe7h+iMg+WbtO+8jOWNs+ihqOekuuiDveeci+aVtOS4quW3peS9nOWMuueahOe7hOe7h1xuXHRcdCMg6buY6K6k6L+U5Zue6ZmQ5a6a5Zyo5b2T5YmN55So5oi35omA5bGe57uE57uHXG5cdFx0Y2hlY2sgc3BhY2UsIFN0cmluZ1xuXHRcdHJlVmFsdWUgPVxuXHRcdFx0aXNMaW1pdDogdHJ1ZVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zOiBbXVxuXHRcdHVubGVzcyB0aGlzLnVzZXJJZFxuXHRcdFx0cmV0dXJuIHJlVmFsdWVcblx0XHRpc0xpbWl0ID0gZmFsc2Vcblx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2UsIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wifSlcblx0XHRsaW1pdHMgPSBzZXR0aW5nPy52YWx1ZXMgfHwgW107XG5cblx0XHRpZiBsaW1pdHMubGVuZ3RoXG5cdFx0XHRteU9yZ3MgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgdXNlcnM6IHRoaXMudXNlcklkfSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRteU9yZ0lkcyA9IG15T3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXHRcdFx0dW5sZXNzIG15T3JnSWRzLmxlbmd0aFxuXHRcdFx0XHRyZXR1cm4gcmVWYWx1ZVxuXHRcdFx0XG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IFtdXG5cdFx0XHRmb3IgbGltaXQgaW4gbGltaXRzXG5cdFx0XHRcdGZyb21zID0gbGltaXQuZnJvbXNcblx0XHRcdFx0dG9zID0gbGltaXQudG9zXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW4gPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoe3NwYWNlOiBzcGFjZSwgcGFyZW50czogeyRpbjogZnJvbXN9fSwge2ZpZWxkczp7X2lkOiAxfX0pXG5cdFx0XHRcdGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuPy5tYXAgKG4pIC0+XG5cdFx0XHRcdFx0cmV0dXJuIG4uX2lkXG5cdFx0XHRcdGZvciBteU9yZ0lkIGluIG15T3JnSWRzXG5cdFx0XHRcdFx0dGVtcElzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRcdGlmIGZyb21zLmluZGV4T2YobXlPcmdJZCkgPiAtMVxuXHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0aWYgZnJvbXNDaGlsZHJlbklkcy5pbmRleE9mKG15T3JnSWQpID4gLTFcblx0XHRcdFx0XHRcdFx0dGVtcElzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0aWYgdGVtcElzTGltaXRcblx0XHRcdFx0XHRcdGlzTGltaXQgPSB0cnVlXG5cdFx0XHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMucHVzaCB0b3Ncblx0XHRcdFx0XHRcdG15TGl0bWl0T3JnSWRzLnB1c2ggbXlPcmdJZFxuXG5cdFx0XHRteUxpdG1pdE9yZ0lkcyA9IF8udW5pcSBteUxpdG1pdE9yZ0lkc1xuXHRcdFx0aWYgbXlMaXRtaXRPcmdJZHMubGVuZ3RoIDwgbXlPcmdJZHMubGVuZ3RoXG5cdFx0XHRcdCMg5aaC5p6c5Y+X6ZmQ55qE57uE57uH5Liq5pWw5bCP5LqO55So5oi35omA5bGe57uE57uH55qE5Liq5pWw77yM5YiZ6K+05piO5b2T5YmN55So5oi36Iez5bCR5pyJ5LiA5Liq57uE57uH5piv5LiN5Y+X6ZmQ55qEXG5cdFx0XHRcdGlzTGltaXQgPSBmYWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBbXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRvdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBfLnVuaXEgXy5mbGF0dGVuIG91dHNpZGVfb3JnYW5pemF0aW9uc1xuXG5cdFx0aWYgaXNMaW1pdFxuXHRcdFx0dG9PcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtzcGFjZTogc3BhY2UsIF9pZDogeyRpbjogb3V0c2lkZV9vcmdhbml6YXRpb25zfX0sIHtmaWVsZHM6e19pZDogMSwgcGFyZW50czogMX19KS5mZXRjaCgpXG5cdFx0XHQjIOaKim91dHNpZGVfb3JnYW5pemF0aW9uc+S4reacieeItuWtkOiKgueCueWFs+ezu+eahOiKgueCueetm+mAieWHuuadpeW5tuWPluWHuuacgOWkluWxguiKgueCuVxuXHRcdFx0IyDmiopvdXRzaWRlX29yZ2FuaXphdGlvbnPkuK3mnInlsZ7kuo7nlKjmiLfmiYDlsZ7nu4Tnu4fnmoTlrZDlrZnoioLngrnnmoToioLngrnliKDpmaRcblx0XHRcdG9yZ3MgPSBfLmZpbHRlciB0b09yZ3MsIChvcmcpIC0+XG5cdFx0XHRcdHBhcmVudHMgPSBvcmcucGFyZW50cyBvciBbXVxuXHRcdFx0XHRyZXR1cm4gXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgb3V0c2lkZV9vcmdhbml6YXRpb25zKS5sZW5ndGggPCAxIGFuZCBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBteU9yZ0lkcykubGVuZ3RoIDwgMVxuXHRcdFx0b3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3Jncy5tYXAgKG4pIC0+XG5cdFx0XHRcdHJldHVybiBuLl9pZFxuXG5cdFx0cmVWYWx1ZS5pc0xpbWl0ID0gaXNMaW1pdFxuXHRcdHJlVmFsdWUub3V0c2lkZV9vcmdhbml6YXRpb25zID0gb3V0c2lkZV9vcmdhbml6YXRpb25zXG5cdFx0cmV0dXJuIHJlVmFsdWVcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgZ2V0X2NvbnRhY3RzX2xpbWl0OiBmdW5jdGlvbihzcGFjZSkge1xuICAgIHZhciBmcm9tcywgZnJvbXNDaGlsZHJlbiwgZnJvbXNDaGlsZHJlbklkcywgaSwgaXNMaW1pdCwgaiwgbGVuLCBsZW4xLCBsaW1pdCwgbGltaXRzLCBteUxpdG1pdE9yZ0lkcywgbXlPcmdJZCwgbXlPcmdJZHMsIG15T3Jncywgb3Jncywgb3V0c2lkZV9vcmdhbml6YXRpb25zLCByZVZhbHVlLCBzZXR0aW5nLCB0ZW1wSXNMaW1pdCwgdG9PcmdzLCB0b3M7XG4gICAgY2hlY2soc3BhY2UsIFN0cmluZyk7XG4gICAgcmVWYWx1ZSA9IHtcbiAgICAgIGlzTGltaXQ6IHRydWUsXG4gICAgICBvdXRzaWRlX29yZ2FuaXphdGlvbnM6IFtdXG4gICAgfTtcbiAgICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICB9XG4gICAgaXNMaW1pdCA9IGZhbHNlO1xuICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgIHNldHRpbmcgPSBkYi5zcGFjZV9zZXR0aW5ncy5maW5kT25lKHtcbiAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgIGtleTogXCJjb250YWN0c192aWV3X2xpbWl0c1wiXG4gICAgfSk7XG4gICAgbGltaXRzID0gKHNldHRpbmcgIT0gbnVsbCA/IHNldHRpbmcudmFsdWVzIDogdm9pZCAwKSB8fCBbXTtcbiAgICBpZiAobGltaXRzLmxlbmd0aCkge1xuICAgICAgbXlPcmdzID0gZGIub3JnYW5pemF0aW9ucy5maW5kKHtcbiAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICB1c2VyczogdGhpcy51c2VySWRcbiAgICAgIH0sIHtcbiAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgX2lkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbXlPcmdJZHMgPSBteU9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgICBpZiAoIW15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gcmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIG15TGl0bWl0T3JnSWRzID0gW107XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBsaW1pdHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgbGltaXQgPSBsaW1pdHNbaV07XG4gICAgICAgIGZyb21zID0gbGltaXQuZnJvbXM7XG4gICAgICAgIHRvcyA9IGxpbWl0LnRvcztcbiAgICAgICAgZnJvbXNDaGlsZHJlbiA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgICAgc3BhY2U6IHNwYWNlLFxuICAgICAgICAgIHBhcmVudHM6IHtcbiAgICAgICAgICAgICRpbjogZnJvbXNcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIF9pZDogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGZyb21zQ2hpbGRyZW5JZHMgPSBmcm9tc0NoaWxkcmVuICE9IG51bGwgPyBmcm9tc0NoaWxkcmVuLm1hcChmdW5jdGlvbihuKSB7XG4gICAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgICB9KSA6IHZvaWQgMDtcbiAgICAgICAgZm9yIChqID0gMCwgbGVuMSA9IG15T3JnSWRzLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIG15T3JnSWQgPSBteU9yZ0lkc1tqXTtcbiAgICAgICAgICB0ZW1wSXNMaW1pdCA9IGZhbHNlO1xuICAgICAgICAgIGlmIChmcm9tcy5pbmRleE9mKG15T3JnSWQpID4gLTEpIHtcbiAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZyb21zQ2hpbGRyZW5JZHMuaW5kZXhPZihteU9yZ0lkKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHRlbXBJc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRlbXBJc0xpbWl0KSB7XG4gICAgICAgICAgICBpc0xpbWl0ID0gdHJ1ZTtcbiAgICAgICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucy5wdXNoKHRvcyk7XG4gICAgICAgICAgICBteUxpdG1pdE9yZ0lkcy5wdXNoKG15T3JnSWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXlMaXRtaXRPcmdJZHMgPSBfLnVuaXEobXlMaXRtaXRPcmdJZHMpO1xuICAgICAgaWYgKG15TGl0bWl0T3JnSWRzLmxlbmd0aCA8IG15T3JnSWRzLmxlbmd0aCkge1xuICAgICAgICBpc0xpbWl0ID0gZmFsc2U7XG4gICAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IFtdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0c2lkZV9vcmdhbml6YXRpb25zID0gXy51bmlxKF8uZmxhdHRlbihvdXRzaWRlX29yZ2FuaXphdGlvbnMpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGlzTGltaXQpIHtcbiAgICAgIHRvT3JncyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZCh7XG4gICAgICAgIHNwYWNlOiBzcGFjZSxcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBvdXRzaWRlX29yZ2FuaXphdGlvbnNcbiAgICAgICAgfVxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgcGFyZW50czogMVxuICAgICAgICB9XG4gICAgICB9KS5mZXRjaCgpO1xuICAgICAgb3JncyA9IF8uZmlsdGVyKHRvT3JncywgZnVuY3Rpb24ob3JnKSB7XG4gICAgICAgIHZhciBwYXJlbnRzO1xuICAgICAgICBwYXJlbnRzID0gb3JnLnBhcmVudHMgfHwgW107XG4gICAgICAgIHJldHVybiBfLmludGVyc2VjdGlvbihwYXJlbnRzLCBvdXRzaWRlX29yZ2FuaXphdGlvbnMpLmxlbmd0aCA8IDEgJiYgXy5pbnRlcnNlY3Rpb24ocGFyZW50cywgbXlPcmdJZHMpLmxlbmd0aCA8IDE7XG4gICAgICB9KTtcbiAgICAgIG91dHNpZGVfb3JnYW5pemF0aW9ucyA9IG9yZ3MubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICAgICAgcmV0dXJuIG4uX2lkO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJlVmFsdWUuaXNMaW1pdCA9IGlzTGltaXQ7XG4gICAgcmVWYWx1ZS5vdXRzaWRlX29yZ2FuaXphdGlvbnMgPSBvdXRzaWRlX29yZ2FuaXphdGlvbnM7XG4gICAgcmV0dXJuIHJlVmFsdWU7XG4gIH1cbn0pO1xuIiwiTWV0ZW9yLm1ldGhvZHMoe1xuICAgIHNldEtleVZhbHVlOiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICAgIGNoZWNrKGtleSwgU3RyaW5nKTtcbiAgICAgICAgY2hlY2sodmFsdWUsIE9iamVjdCk7XG5cbiAgICAgICAgb2JqID0ge307XG4gICAgICAgIG9iai51c2VyID0gdGhpcy51c2VySWQ7XG4gICAgICAgIG9iai5rZXkgPSBrZXk7XG4gICAgICAgIG9iai52YWx1ZSA9IHZhbHVlO1xuXG4gICAgICAgIHZhciBjID0gZGIuc3RlZWRvc19rZXl2YWx1ZXMuZmluZCh7XG4gICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIGtleToga2V5XG4gICAgICAgIH0pLmNvdW50KCk7XG4gICAgICAgIGlmIChjID4gMCkge1xuICAgICAgICAgICAgZGIuc3RlZWRvc19rZXl2YWx1ZXMudXBkYXRlKHtcbiAgICAgICAgICAgICAgICB1c2VyOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgICAgICBrZXk6IGtleVxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYi5zdGVlZG9zX2tleXZhbHVlcy5pbnNlcnQob2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn0pIiwiTWV0ZW9yLm1ldGhvZHNcblx0c2V0VXNlcm5hbWU6IChzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIC0+XG5cdFx0Y2hlY2soc3BhY2VfaWQsIFN0cmluZyk7XG5cdFx0Y2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG5cblx0XHRpZiAhU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgYW5kIHVzZXJfaWRcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnY29udGFjdF9zcGFjZV91c2VyX25lZWRlZCcpXG5cblx0XHRpZiBub3QgTWV0ZW9yLnVzZXJJZCgpXG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwnZXJyb3ItaW52YWxpZC11c2VyJylcblxuXHRcdHVubGVzcyB1c2VyX2lkXG5cdFx0XHR1c2VyX2lkID0gTWV0ZW9yLnVzZXIoKS5faWRcblxuXHRcdHNwYWNlVXNlciA9IGRiLnNwYWNlX3VzZXJzLmZpbmRPbmUoe3VzZXI6IHVzZXJfaWQsIHNwYWNlOiBzcGFjZV9pZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueeUqOaIt+WQjVwiKVxuXG5cdFx0ZGIudXNlcnMudXBkYXRlKHtfaWQ6IHVzZXJfaWR9LCB7JHNldDoge3VzZXJuYW1lOiB1c2VybmFtZX19KVxuXG5cdFx0cmV0dXJuIHVzZXJuYW1lXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFVzZXJuYW1lOiBmdW5jdGlvbihzcGFjZV9pZCwgdXNlcm5hbWUsIHVzZXJfaWQpIHtcbiAgICB2YXIgc3BhY2VVc2VyO1xuICAgIGNoZWNrKHNwYWNlX2lkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuICAgIGlmICghU3RlZWRvcy5pc1NwYWNlQWRtaW4oc3BhY2VfaWQsIE1ldGVvci51c2VySWQoKSkgJiYgdXNlcl9pZCkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdjb250YWN0X3NwYWNlX3VzZXJfbmVlZGVkJyk7XG4gICAgfVxuICAgIGlmICghTWV0ZW9yLnVzZXJJZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ2Vycm9yLWludmFsaWQtdXNlcicpO1xuICAgIH1cbiAgICBpZiAoIXVzZXJfaWQpIHtcbiAgICAgIHVzZXJfaWQgPSBNZXRlb3IudXNlcigpLl9pZDtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICB1c2VyOiB1c2VyX2lkLFxuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnnlKjmiLflkI1cIik7XG4gICAgfVxuICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHVzZXJfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB1c2VybmFtZTtcbiAgfVxufSk7XG4iLCJNZXRlb3IubWV0aG9kc1xuXHRnZXRfc3BhY2VfdXNlcl9jb3VudDogKHNwYWNlX2lkKS0+XG5cdFx0Y2hlY2sgc3BhY2VfaWQsIFN0cmluZ1xuXHRcdHVzZXJfY291bnRfaW5mbyA9IG5ldyBPYmplY3Rcblx0XHR1c2VyX2NvdW50X2luZm8udG90YWxfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZH0pLmNvdW50KClcblx0XHR1c2VyX2NvdW50X2luZm8uYWNjZXB0ZWRfdXNlcl9jb3VudCA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe3NwYWNlOiBzcGFjZV9pZCwgdXNlcl9hY2NlcHRlZDogdHJ1ZX0pLmNvdW50KClcblx0XHRyZXR1cm4gdXNlcl9jb3VudF9pbmZvIiwiTWV0ZW9yLm1ldGhvZHNcblx0Y3JlYXRlX3NlY3JldDogKG5hbWUpLT5cblx0XHRpZiAhdGhpcy51c2VySWRcblx0XHRcdHJldHVybiBmYWxzZTtcblxuXHRcdGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQgdGhpcy51c2VySWQsIG5hbWVcblxuXHRyZW1vdmVfc2VjcmV0OiAodG9rZW4pLT5cblx0XHRpZiAhdGhpcy51c2VySWQgfHwgIXRva2VuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbilcblxuXHRcdGNvbnNvbGUubG9nKFwidG9rZW5cIiwgdG9rZW4pXG5cblx0XHRkYi51c2Vycy51cGRhdGUoe19pZDogdGhpcy51c2VySWR9LCB7JHB1bGw6IHtcInNlY3JldHNcIjoge2hhc2hlZFRva2VuOiBoYXNoZWRUb2tlbn19fSlcbiIsIk1ldGVvci5tZXRob2RzKHtcbiAgY3JlYXRlX3NlY3JldDogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRiLnVzZXJzLmNyZWF0ZV9zZWNyZXQodGhpcy51c2VySWQsIG5hbWUpO1xuICB9LFxuICByZW1vdmVfc2VjcmV0OiBmdW5jdGlvbih0b2tlbikge1xuICAgIHZhciBoYXNoZWRUb2tlbjtcbiAgICBpZiAoIXRoaXMudXNlcklkIHx8ICF0b2tlbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbih0b2tlbik7XG4gICAgY29uc29sZS5sb2coXCJ0b2tlblwiLCB0b2tlbik7XG4gICAgcmV0dXJuIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSwge1xuICAgICAgJHB1bGw6IHtcbiAgICAgICAgXCJzZWNyZXRzXCI6IHtcbiAgICAgICAgICBoYXNoZWRUb2tlbjogaGFzaGVkVG9rZW5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG4gICAgJ29iamVjdF93b3JrZmxvd3MuZ2V0JzogKHNwYWNlSWQsIHVzZXJJZCkgLT5cbiAgICAgICAgY2hlY2sgc3BhY2VJZCwgU3RyaW5nXG4gICAgICAgIGNoZWNrIHVzZXJJZCwgU3RyaW5nXG5cbiAgICAgICAgY3VyU3BhY2VVc2VyID0gQ3JlYXRvci5Db2xsZWN0aW9uc1tcInNwYWNlX3VzZXJzXCJdLmZpbmRPbmUoe3NwYWNlOiBzcGFjZUlkLCB1c2VyOiB1c2VySWR9LCB7ZmllbGRzOiB7b3JnYW5pemF0aW9uczogMX19KVxuICAgICAgICBpZiAhY3VyU3BhY2VVc2VyXG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yICdub3QtYXV0aG9yaXplZCdcblxuICAgICAgICBvcmdhbml6YXRpb25zID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdvcmdhbml6YXRpb25zJykuZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHtmaWVsZHM6IHtwYXJlbnRzOiAxfX0pLmZldGNoKClcblxuICAgICAgICBvd3MgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29iamVjdF93b3JrZmxvd3MnKS5maW5kKHsgc3BhY2U6IHNwYWNlSWQsICRvcjogW3sgc3luY19kaXJlY3Rpb246IHsgJGV4aXN0czogZmFsc2UgfX0sIHsgc3luY19kaXJlY3Rpb246IHsgJGluOiBbJ2JvdGgnLCAnb2JqX3RvX2lucyddfX1dIH0sIHsgZmllbGRzOiB7IG9iamVjdF9uYW1lOiAxLCBmbG93X2lkOiAxLCBzcGFjZTogMSB9IH0pLmZldGNoKClcbiAgICAgICAgXy5lYWNoIG93cywobykgLT5cbiAgICAgICAgICAgIGZsID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKCdmbG93cycpLmZpbmRPbmUoe19pZDogby5mbG93X2lkLCBzdGF0ZTogJ2VuYWJsZWQnfSwgeyBmaWVsZHM6IHsgbmFtZTogMSwgcGVybXM6IDEgfSB9KVxuICAgICAgICAgICAgaWYgZmxcbiAgICAgICAgICAgICAgICBvLmZsb3dfbmFtZSA9IGZsLm5hbWVcbiAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZVxuXG4gICAgICAgICAgICAgICAgcGVybXMgPSBmbC5wZXJtc1xuICAgICAgICAgICAgICAgIGlmIHBlcm1zXG4gICAgICAgICAgICAgICAgICAgIGlmIHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBvLmNhbl9hZGQgPSB0cnVlXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgcGVybXMub3Jnc19jYW5fYWRkICYmIHBlcm1zLm9yZ3NfY2FuX2FkZC5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBjdXJTcGFjZVVzZXIgJiYgY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMgJiYgXy5pbnRlcnNlY3Rpb24oY3VyU3BhY2VVc2VyLm9yZ2FuaXphdGlvbnMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBvcmdhbml6YXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FuX2FkZCA9IF8uc29tZSBvcmdhbml6YXRpb25zLCAob3JnKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JnLnBhcmVudHMgJiYgXy5pbnRlcnNlY3Rpb24ob3JnLnBhcmVudHMsIHBlcm1zLm9yZ3NfY2FuX2FkZCkubGVuZ3RoID4gMFxuXG4gICAgICAgIG93cyA9IG93cy5maWx0ZXIgKG4pLT5cbiAgICAgICAgICAgIHJldHVybiBuLmZsb3dfbmFtZVxuXG4gICAgICAgIHJldHVybiBvd3MiLCJNZXRlb3IubWV0aG9kcyh7XG4gICdvYmplY3Rfd29ya2Zsb3dzLmdldCc6IGZ1bmN0aW9uKHNwYWNlSWQsIHVzZXJJZCkge1xuICAgIHZhciBjdXJTcGFjZVVzZXIsIG9yZ2FuaXphdGlvbnMsIG93cztcbiAgICBjaGVjayhzcGFjZUlkLCBTdHJpbmcpO1xuICAgIGNoZWNrKHVzZXJJZCwgU3RyaW5nKTtcbiAgICBjdXJTcGFjZVVzZXIgPSBDcmVhdG9yLkNvbGxlY3Rpb25zW1wic3BhY2VfdXNlcnNcIl0uZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VJZCxcbiAgICAgIHVzZXI6IHVzZXJJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBvcmdhbml6YXRpb25zOiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFjdXJTcGFjZVVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hdXRob3JpemVkJyk7XG4gICAgfVxuICAgIG9yZ2FuaXphdGlvbnMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ29yZ2FuaXphdGlvbnMnKS5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGN1clNwYWNlVXNlci5vcmdhbml6YXRpb25zXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIHBhcmVudHM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIG93cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbignb2JqZWN0X3dvcmtmbG93cycpLmZpbmQoe1xuICAgICAgc3BhY2U6IHNwYWNlSWQsXG4gICAgICAkb3I6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN5bmNfZGlyZWN0aW9uOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIHN5bmNfZGlyZWN0aW9uOiB7XG4gICAgICAgICAgICAkaW46IFsnYm90aCcsICdvYmpfdG9faW5zJ11cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgb2JqZWN0X25hbWU6IDEsXG4gICAgICAgIGZsb3dfaWQ6IDEsXG4gICAgICAgIHNwYWNlOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBfLmVhY2gob3dzLCBmdW5jdGlvbihvKSB7XG4gICAgICB2YXIgZmwsIHBlcm1zO1xuICAgICAgZmwgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oJ2Zsb3dzJykuZmluZE9uZSh7XG4gICAgICAgIF9pZDogby5mbG93X2lkLFxuICAgICAgICBzdGF0ZTogJ2VuYWJsZWQnXG4gICAgICB9LCB7XG4gICAgICAgIGZpZWxkczoge1xuICAgICAgICAgIG5hbWU6IDEsXG4gICAgICAgICAgcGVybXM6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoZmwpIHtcbiAgICAgICAgby5mbG93X25hbWUgPSBmbC5uYW1lO1xuICAgICAgICBvLmNhbl9hZGQgPSBmYWxzZTtcbiAgICAgICAgcGVybXMgPSBmbC5wZXJtcztcbiAgICAgICAgaWYgKHBlcm1zKSB7XG4gICAgICAgICAgaWYgKHBlcm1zLnVzZXJzX2Nhbl9hZGQgJiYgcGVybXMudXNlcnNfY2FuX2FkZC5pbmNsdWRlcyh1c2VySWQpKSB7XG4gICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHBlcm1zLm9yZ3NfY2FuX2FkZCAmJiBwZXJtcy5vcmdzX2Nhbl9hZGQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgaWYgKGN1clNwYWNlVXNlciAmJiBjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucyAmJiBfLmludGVyc2VjdGlvbihjdXJTcGFjZVVzZXIub3JnYW5pemF0aW9ucywgcGVybXMub3Jnc19jYW5fYWRkKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBvLmNhbl9hZGQgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG9yZ2FuaXphdGlvbnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jYW5fYWRkID0gXy5zb21lKG9yZ2FuaXphdGlvbnMsIGZ1bmN0aW9uKG9yZykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZy5wYXJlbnRzICYmIF8uaW50ZXJzZWN0aW9uKG9yZy5wYXJlbnRzLCBwZXJtcy5vcmdzX2Nhbl9hZGQpLmxlbmd0aCA+IDA7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBvd3MgPSBvd3MuZmlsdGVyKGZ1bmN0aW9uKG4pIHtcbiAgICAgIHJldHVybiBuLmZsb3dfbmFtZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3dzO1xuICB9XG59KTtcbiIsIk1ldGVvci5tZXRob2RzXG5cdHNldFNwYWNlVXNlclBhc3N3b3JkOiAoc3BhY2VfdXNlcl9pZCwgc3BhY2VfaWQsIHBhc3N3b3JkKSAtPlxuXHRcdGlmICF0aGlzLnVzZXJJZFxuXHRcdFx0dGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsIFwi6K+35YWI55m75b2VXCIpXG5cdFx0XG5cdFx0c3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7X2lkOiBzcGFjZV91c2VyX2lkLCBzcGFjZTogc3BhY2VfaWR9KVxuXHRcdHVzZXJJZCA9IHRoaXMudXNlcklkXG5cdFx0Y2FuRWRpdCA9IHNwYWNlVXNlci51c2VyID09IHVzZXJJZFxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHRzcGFjZSA9IGRiLnNwYWNlcy5maW5kT25lKHtfaWQ6IHNwYWNlX2lkfSlcblx0XHRcdGlzU3BhY2VBZG1pbiA9IHNwYWNlPy5hZG1pbnM/LmluY2x1ZGVzKHRoaXMudXNlcklkKVxuXHRcdFx0Y2FuRWRpdCA9IGlzU3BhY2VBZG1pblxuXG5cdFx0Y29tcGFueUlkcyA9IHNwYWNlVXNlci5jb21wYW55X2lkc1xuXHRcdGlmICFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGhcblx0XHRcdCMg57uE57uH566h55CG5ZGY5Lmf6IO95L+u5pS55a+G56CBXG5cdFx0XHRjb21wYW55cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNvbXBhbnlcIikuZmluZCh7X2lkOiB7ICRpbjogY29tcGFueUlkcyB9LCBzcGFjZTogc3BhY2VfaWQgfSwge2ZpZWxkczogeyBhZG1pbnM6IDEgfX0pLmZldGNoKClcblx0XHRcdGlmIGNvbXBhbnlzIGFuZCBjb21wYW55cy5sZW5ndGhcblx0XHRcdFx0Y2FuRWRpdCA9IF8uYW55IGNvbXBhbnlzLCAoaXRlbSkgLT5cblx0XHRcdFx0XHRyZXR1cm4gaXRlbS5hZG1pbnMgJiYgaXRlbS5hZG1pbnMuaW5kZXhPZih1c2VySWQpID4gLTFcblxuXHRcdHVubGVzcyBjYW5FZGl0XG5cdFx0XHR0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIilcblxuXHRcdHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcblx0XHR1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHVzZXJfaWR9KVxuXHRcdGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB0aGlzLnVzZXJJZH0pXG5cblx0XHRpZiBzcGFjZVVzZXIuaW52aXRlX3N0YXRlID09IFwicGVuZGluZ1wiIG9yIHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT0gXCJyZWZ1c2VkXCJcblx0XHRcdHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivpeeUqOaIt+WwmuacquWQjOaEj+WKoOWFpeivpeW3peS9nOWMuu+8jOaXoOazleS/ruaUueWvhueggVwiKVxuXG5cdFx0IyBTdGVlZG9zLnZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQpXG5cdFx0bG9nb3V0ID0gdHJ1ZTtcblx0XHRpZiB0aGlzLnVzZXJJZCA9PSB1c2VyX2lkXG5cdFx0XHRsb2dvdXQgPSBmYWxzZVxuXHRcdFxuXHRcdEFjY291bnRzLnNldFBhc3N3b3JkKHVzZXJfaWQsIHtcblx0XHRcdGFsZ29yaXRobTogJ3NoYS0yNTYnLFxuXHRcdFx0ZGlnZXN0OiBwYXNzd29yZFxuXHRcdH0sIHtsb2dvdXQ6IGxvZ291dH0pXG5cdFx0Y2hhbmdlZFVzZXJJbmZvID0gZGIudXNlcnMuZmluZE9uZSh7X2lkOiB1c2VyX2lkfSlcblx0XHRpZiBjaGFuZ2VkVXNlckluZm9cblx0XHRcdGRiLnVzZXJzLnVwZGF0ZSh7X2lkOiB1c2VyX2lkfSwgeyRwdXNoOiB7J3NlcnZpY2VzLnBhc3N3b3JkX2hpc3RvcnknOiBjaGFuZ2VkVXNlckluZm8uc2VydmljZXM/LnBhc3N3b3JkPy5iY3J5cHR9fSlcblxuXHRcdCMg5aaC5p6c55So5oi35omL5py65Y+36YCa6L+H6aqM6K+B77yM5bCx5Y+R55+t5L+h5o+Q6YaSXG5cdFx0aWYgdXNlckNQLm1vYmlsZSAmJiB1c2VyQ1AubW9iaWxlX3ZlcmlmaWVkXG5cdFx0XHRsYW5nID0gJ2VuJ1xuXHRcdFx0aWYgdXNlckNQLmxvY2FsZSBpcyAnemgtY24nXG5cdFx0XHRcdGxhbmcgPSAnemgtQ04nXG5cdFx0XHRTTVNRdWV1ZS5zZW5kXG5cdFx0XHRcdEZvcm1hdDogJ0pTT04nLFxuXHRcdFx0XHRBY3Rpb246ICdTaW5nbGVTZW5kU21zJyxcblx0XHRcdFx0UGFyYW1TdHJpbmc6ICcnLFxuXHRcdFx0XHRSZWNOdW06IHVzZXJDUC5tb2JpbGUsXG5cdFx0XHRcdFNpZ25OYW1lOiAn5Y2O54KO5Yqe5YWsJyxcblx0XHRcdFx0VGVtcGxhdGVDb2RlOiAnU01TXzY3MjAwOTY3Jyxcblx0XHRcdFx0bXNnOiBUQVBpMThuLl9fKCdzbXMuY2hhbmdlX3Bhc3N3b3JkLnRlbXBsYXRlJywge30sIGxhbmcpXG5cblx0XHR0cnlcblx0XHRcdHJldHVybiBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJvcGVyYXRpb25fbG9nc1wiKS5pbnNlcnQoe1xuXHRcdFx0XHRuYW1lOiBcIuS/ruaUueWvhueggVwiLFxuXHRcdFx0XHR0eXBlOiBcImNoYW5nZV9wYXNzd29yZFwiLFxuXHRcdFx0XHRyZW1vdGVfdXNlcjogdXNlcklkLFxuXHRcdFx0XHRzdGF0dXM6ICdzdWNjZXNzJyxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRtZXNzYWdlOiBcIlvns7vnu5/nrqHnkIblkZhd5L+u5pS55LqG55So5oi3W1wiICsgY2hhbmdlZFVzZXJJbmZvPy5uYW1lICsgXCJd55qE5a+G56CBXCIsXG5cdFx0XHRcdGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcblx0XHRcdFx0XHRjaGFuZ2VVc2VyOiB1c2VyX2lkXG5cdFx0XHRcdH0pLFxuXHRcdFx0XHRyZWxhdGVkX3RvOiB7XG5cdFx0XHRcdFx0bzogXCJ1c2Vyc1wiLFxuXHRcdFx0XHRcdGlkczogW3VzZXJfaWRdXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdGNhdGNoIGVcblx0XHRcdGNvbnNvbGUuZXJyb3IgZVxuXG4iLCJNZXRlb3IubWV0aG9kcyh7XG4gIHNldFNwYWNlVXNlclBhc3N3b3JkOiBmdW5jdGlvbihzcGFjZV91c2VyX2lkLCBzcGFjZV9pZCwgcGFzc3dvcmQpIHtcbiAgICB2YXIgY2FuRWRpdCwgY2hhbmdlZFVzZXJJbmZvLCBjb21wYW55SWRzLCBjb21wYW55cywgY3VycmVudFVzZXIsIGUsIGlzU3BhY2VBZG1pbiwgbGFuZywgbG9nb3V0LCByZWYsIHJlZjEsIHJlZjIsIHNwYWNlLCBzcGFjZVVzZXIsIHVzZXJDUCwgdXNlcklkLCB1c2VyX2lkO1xuICAgIGlmICghdGhpcy51c2VySWQpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBcIuivt+WFiOeZu+W9lVwiKTtcbiAgICB9XG4gICAgc3BhY2VVc2VyID0gZGIuc3BhY2VfdXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNwYWNlX3VzZXJfaWQsXG4gICAgICBzcGFjZTogc3BhY2VfaWRcbiAgICB9KTtcbiAgICB1c2VySWQgPSB0aGlzLnVzZXJJZDtcbiAgICBjYW5FZGl0ID0gc3BhY2VVc2VyLnVzZXIgPT09IHVzZXJJZDtcbiAgICBpZiAoIWNhbkVkaXQpIHtcbiAgICAgIHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoe1xuICAgICAgICBfaWQ6IHNwYWNlX2lkXG4gICAgICB9KTtcbiAgICAgIGlzU3BhY2VBZG1pbiA9IHNwYWNlICE9IG51bGwgPyAocmVmID0gc3BhY2UuYWRtaW5zKSAhPSBudWxsID8gcmVmLmluY2x1ZGVzKHRoaXMudXNlcklkKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICAgIGNhbkVkaXQgPSBpc1NwYWNlQWRtaW47XG4gICAgfVxuICAgIGNvbXBhbnlJZHMgPSBzcGFjZVVzZXIuY29tcGFueV9pZHM7XG4gICAgaWYgKCFjYW5FZGl0ICYmIGNvbXBhbnlJZHMgJiYgY29tcGFueUlkcy5sZW5ndGgpIHtcbiAgICAgIGNvbXBhbnlzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY29tcGFueVwiKS5maW5kKHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgJGluOiBjb21wYW55SWRzXG4gICAgICAgIH0sXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZFxuICAgICAgfSwge1xuICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICBhZG1pbnM6IDFcbiAgICAgICAgfVxuICAgICAgfSkuZmV0Y2goKTtcbiAgICAgIGlmIChjb21wYW55cyAmJiBjb21wYW55cy5sZW5ndGgpIHtcbiAgICAgICAgY2FuRWRpdCA9IF8uYW55KGNvbXBhbnlzLCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZW0uYWRtaW5zICYmIGl0ZW0uYWRtaW5zLmluZGV4T2YodXNlcklkKSA+IC0xO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjYW5FZGl0KSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLmgqjmsqHmnInmnYPpmZDkv67mlLnor6XnlKjmiLflr4bnoIFcIik7XG4gICAgfVxuICAgIHVzZXJfaWQgPSBzcGFjZVVzZXIudXNlcjtcbiAgICB1c2VyQ1AgPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGN1cnJlbnRVc2VyID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHRoaXMudXNlcklkXG4gICAgfSk7XG4gICAgaWYgKHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8IHNwYWNlVXNlci5pbnZpdGVfc3RhdGUgPT09IFwicmVmdXNlZFwiKSB7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgXCLor6XnlKjmiLflsJrmnKrlkIzmhI/liqDlhaXor6Xlt6XkvZzljLrvvIzml6Dms5Xkv67mlLnlr4bnoIFcIik7XG4gICAgfVxuICAgIGxvZ291dCA9IHRydWU7XG4gICAgaWYgKHRoaXMudXNlcklkID09PSB1c2VyX2lkKSB7XG4gICAgICBsb2dvdXQgPSBmYWxzZTtcbiAgICB9XG4gICAgQWNjb3VudHMuc2V0UGFzc3dvcmQodXNlcl9pZCwge1xuICAgICAgYWxnb3JpdGhtOiAnc2hhLTI1NicsXG4gICAgICBkaWdlc3Q6IHBhc3N3b3JkXG4gICAgfSwge1xuICAgICAgbG9nb3V0OiBsb2dvdXRcbiAgICB9KTtcbiAgICBjaGFuZ2VkVXNlckluZm8gPSBkYi51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcl9pZFxuICAgIH0pO1xuICAgIGlmIChjaGFuZ2VkVXNlckluZm8pIHtcbiAgICAgIGRiLnVzZXJzLnVwZGF0ZSh7XG4gICAgICAgIF9pZDogdXNlcl9pZFxuICAgICAgfSwge1xuICAgICAgICAkcHVzaDoge1xuICAgICAgICAgICdzZXJ2aWNlcy5wYXNzd29yZF9oaXN0b3J5JzogKHJlZjEgPSBjaGFuZ2VkVXNlckluZm8uc2VydmljZXMpICE9IG51bGwgPyAocmVmMiA9IHJlZjEucGFzc3dvcmQpICE9IG51bGwgPyByZWYyLmJjcnlwdCA6IHZvaWQgMCA6IHZvaWQgMFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHVzZXJDUC5tb2JpbGUgJiYgdXNlckNQLm1vYmlsZV92ZXJpZmllZCkge1xuICAgICAgbGFuZyA9ICdlbic7XG4gICAgICBpZiAodXNlckNQLmxvY2FsZSA9PT0gJ3poLWNuJykge1xuICAgICAgICBsYW5nID0gJ3poLUNOJztcbiAgICAgIH1cbiAgICAgIFNNU1F1ZXVlLnNlbmQoe1xuICAgICAgICBGb3JtYXQ6ICdKU09OJyxcbiAgICAgICAgQWN0aW9uOiAnU2luZ2xlU2VuZFNtcycsXG4gICAgICAgIFBhcmFtU3RyaW5nOiAnJyxcbiAgICAgICAgUmVjTnVtOiB1c2VyQ1AubW9iaWxlLFxuICAgICAgICBTaWduTmFtZTogJ+WNjueCjuWKnuWFrCcsXG4gICAgICAgIFRlbXBsYXRlQ29kZTogJ1NNU182NzIwMDk2NycsXG4gICAgICAgIG1zZzogVEFQaTE4bi5fXygnc21zLmNoYW5nZV9wYXNzd29yZC50ZW1wbGF0ZScsIHt9LCBsYW5nKVxuICAgICAgfSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwib3BlcmF0aW9uX2xvZ3NcIikuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogXCLkv67mlLnlr4bnoIFcIixcbiAgICAgICAgdHlwZTogXCJjaGFuZ2VfcGFzc3dvcmRcIixcbiAgICAgICAgcmVtb3RlX3VzZXI6IHVzZXJJZCxcbiAgICAgICAgc3RhdHVzOiAnc3VjY2VzcycsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgbWVzc2FnZTogXCJb57O757uf566h55CG5ZGYXeS/ruaUueS6hueUqOaIt1tcIiArIChjaGFuZ2VkVXNlckluZm8gIT0gbnVsbCA/IGNoYW5nZWRVc2VySW5mby5uYW1lIDogdm9pZCAwKSArIFwiXeeahOWvhueggVwiLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgY2hhbmdlVXNlcjogdXNlcl9pZFxuICAgICAgICB9KSxcbiAgICAgICAgcmVsYXRlZF90bzoge1xuICAgICAgICAgIG86IFwidXNlcnNcIixcbiAgICAgICAgICBpZHM6IFt1c2VyX2lkXVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgZSA9IGVycm9yO1xuICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuICB9XG59KTtcbiIsImJpbGxpbmdNYW5hZ2VyID0ge31cblxuIyDojrflvpfnu5PnrpflkajmnJ/lhoXnmoTlj6/nu5Pnrpfml6XmlbBcbiMgc3BhY2VfaWQg57uT566X5a+56LGh5bel5L2c5Yy6XG4jIGFjY291bnRpbmdfbW9udGgg57uT566X5pyI77yM5qC85byP77yaWVlZWU1NXG5iaWxsaW5nTWFuYWdlci5nZXRfYWNjb3VudGluZ19wZXJpb2QgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpLT5cblx0Y291bnRfZGF5cyA9IDBcblxuXHRlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKVxuXG5cdGJpbGxpbmcgPSBkYi5iaWxsaW5ncy5maW5kT25lKHtzcGFjZTogc3BhY2VfaWQsIHRyYW5zYWN0aW9uOiBcIlN0YXJ0aW5nIGJhbGFuY2VcIn0pXG5cdGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZVxuXG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDEtZW5kX2RhdGVfdGltZS5nZXREYXRlKCkpXG5cblx0aWYgZmlyc3RfZGF0ZSA+PSBlbmRfZGF0ZSAjIOi/meS4quaciOS4jeWcqOacrOasoee7k+eul+iMg+WbtOS5i+WGhe+8jGNvdW50X2RheXM9MFxuXHRcdCMgZG8gbm90aGluZ1xuXHRlbHNlIGlmIHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSBhbmQgZmlyc3RfZGF0ZSA8IGVuZF9kYXRlXG5cdFx0Y291bnRfZGF5cyA9IChlbmRfZGF0ZV90aW1lIC0gc3RhcnRfZGF0ZV90aW1lKS8oMjQqNjAqNjAqMTAwMCkgKyAxXG5cdGVsc2UgaWYgZmlyc3RfZGF0ZSA8IHN0YXJ0X2RhdGVcblx0XHRjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpLygyNCo2MCo2MCoxMDAwKSArIDFcblxuXHRyZXR1cm4ge1wiY291bnRfZGF5c1wiOiBjb3VudF9kYXlzfVxuXG4jIOmHjeeul+i/meS4gOaXpeeahOS9meminVxuYmlsbGluZ01hbmFnZXIucmVmcmVzaF9iYWxhbmNlID0gKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpLT5cblx0bGFzdF9iaWxsID0gbnVsbFxuXHRiaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7c3BhY2U6IHNwYWNlX2lkLCBjcmVhdGVkOiByZWZyZXNoX2RhdGV9KVxuXG5cdCMg6I635Y+W5q2j5bi45LuY5qy+55qE5bCP5LqOcmVmcmVzaF9kYXRl55qE5pyA6L+R55qE5LiA5p2h6K6w5b2VXG5cdHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoXG5cdFx0e1xuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0Y3JlYXRlZDoge1xuXHRcdFx0XHQkbHQ6IHJlZnJlc2hfZGF0ZVxuXHRcdFx0fSxcblx0XHRcdGJpbGxpbmdfbW9udGg6IGJpbGwuYmlsbGluZ19tb250aFxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0aWYgcGF5bWVudF9iaWxsXG5cdFx0bGFzdF9iaWxsID0gcGF5bWVudF9iaWxsXG5cdGVsc2Vcblx0XHQjIOiOt+WPluacgOaWsOeahOe7k+eul+eahOS4gOadoeiusOW9lVxuXHRcdGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChiaWxsLmJpbGxpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0Yl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKS0oYl9tX2QuZ2V0RGF0ZSgpKjI0KjYwKjYwKjEwMDApKS5mb3JtYXQoXCJZWVlZTU1cIilcblxuXHRcdGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHRcdHtcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHRiaWxsaW5nX21vbnRoOiBiX21cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHNvcnQ6IHtcblx0XHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdClcblx0XHRpZiBhcHBfYmlsbFxuXHRcdFx0bGFzdF9iaWxsID0gYXBwX2JpbGxcblxuXHRsYXN0X2JhbGFuY2UgPSBpZiBsYXN0X2JpbGwgYW5kIGxhc3RfYmlsbC5iYWxhbmNlIHRoZW4gbGFzdF9iaWxsLmJhbGFuY2UgZWxzZSAwLjBcblxuXHRkZWJpdHMgPSBpZiBiaWxsLmRlYml0cyB0aGVuIGJpbGwuZGViaXRzIGVsc2UgMC4wXG5cdGNyZWRpdHMgPSBpZiBiaWxsLmNyZWRpdHMgdGhlbiBiaWxsLmNyZWRpdHMgZWxzZSAwLjBcblx0c2V0T2JqID0gbmV3IE9iamVjdFxuXHRzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0c2V0T2JqLm1vZGlmaWVkID0gbmV3IERhdGVcblx0ZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7X2lkOiBiaWxsLl9pZH0sIHskc2V0OiBzZXRPYmp9KVxuXG4jIOe7k+eul+W9k+aciOeahOaUr+WHuuS4juS9meminVxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSAoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIGNvdW50X2RheXMsIG1vZHVsZV9uYW1lLCBsaXN0cHJpY2UpLT5cblx0YWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMClcblx0ZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpXG5cdGFjY291bnRpbmdfZGF0ZV9mb3JtYXQgPSBtb21lbnQoYWNjb3VudGluZ19kYXRlKS5mb3JtYXQoXCJZWVlZTU1ERFwiKVxuXG5cdGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMvZGF5c19udW1iZXIpICogdXNlcl9jb3VudCAqIGxpc3RwcmljZSkudG9GaXhlZCgyKSlcblx0bGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZShcblx0XHR7XG5cdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRiaWxsaW5nX2RhdGU6IHtcblx0XHRcdFx0JGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0e1xuXHRcdFx0c29ydDoge1xuXHRcdFx0XHRtb2RpZmllZDogLTFcblx0XHRcdH1cblx0XHR9XG5cdClcblx0bGFzdF9iYWxhbmNlID0gaWYgbGFzdF9iaWxsIGFuZCBsYXN0X2JpbGwuYmFsYW5jZSB0aGVuIGxhc3RfYmlsbC5iYWxhbmNlIGVsc2UgMC4wXG5cblx0bm93ID0gbmV3IERhdGVcblx0bmV3X2JpbGwgPSBuZXcgT2JqZWN0XG5cdG5ld19iaWxsLl9pZCA9IGRiLmJpbGxpbmdzLl9tYWtlTmV3SUQoKVxuXHRuZXdfYmlsbC5iaWxsaW5nX21vbnRoID0gYWNjb3VudGluZ19tb250aFxuXHRuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0XG5cdG5ld19iaWxsLnNwYWNlID0gc3BhY2VfaWRcblx0bmV3X2JpbGwudHJhbnNhY3Rpb24gPSBtb2R1bGVfbmFtZVxuXHRuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2Vcblx0bmV3X2JpbGwudXNlcl9jb3VudCA9IHVzZXJfY291bnRcblx0bmV3X2JpbGwuZGViaXRzID0gZGViaXRzXG5cdG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSlcblx0bmV3X2JpbGwuY3JlYXRlZCA9IG5vd1xuXHRuZXdfYmlsbC5tb2RpZmllZCA9IG5vd1xuXHRkYi5iaWxsaW5ncy5kaXJlY3QuaW5zZXJ0KG5ld19iaWxsKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IChzcGFjZV9pZCktPlxuXHRkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogc3BhY2VfaWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cbmJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlID0gKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKS0+XG5cdHJlZnJlc2hfZGF0ZXMgPSBuZXcgQXJyYXlcblx0ZGIuYmlsbGluZ3MuZmluZChcblx0XHR7XG5cdFx0XHRiaWxsaW5nX21vbnRoOiBhY2NvdW50aW5nX21vbnRoLFxuXHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0dHJhbnNhY3Rpb246IHskaW46IFtcIlBheW1lbnRcIiwgXCJTZXJ2aWNlIGFkanVzdG1lbnRcIl19XG5cdFx0fSxcblx0XHR7XG5cdFx0XHRzb3J0OiB7Y3JlYXRlZDogMX1cblx0XHR9XG5cdCkuZm9yRWFjaCAoYmlsbCktPlxuXHRcdHJlZnJlc2hfZGF0ZXMucHVzaChiaWxsLmNyZWF0ZWQpXG5cblx0aWYgcmVmcmVzaF9kYXRlcy5sZW5ndGggPiAwXG5cdFx0Xy5lYWNoIHJlZnJlc2hfZGF0ZXMsIChyX2QpLT5cblx0XHRcdGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKVxuXG5iaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyA9IChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCktPlxuXHRtb2R1bGVzID0gbmV3IEFycmF5XG5cdHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiXG5cdGVuZF9kYXRlX3RpbWUgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRlbmRfZGF0ZSA9IG1vbWVudChlbmRfZGF0ZV90aW1lLmdldFRpbWUoKSkuZm9ybWF0KCdZWVlZTU1ERCcpXG5cblx0ZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaCAobSktPlxuXHRcdG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoXG5cdFx0XHR7XG5cdFx0XHRcdHNwYWNlOiBzcGFjZV9pZCxcblx0XHRcdFx0bW9kdWxlOiBtLm5hbWUsXG5cdFx0XHRcdGNoYW5nZV9kYXRlOiB7XG5cdFx0XHRcdFx0JGx0ZTogZW5kX2RhdGVcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0Y3JlYXRlZDogLTFcblx0XHRcdH1cblx0XHQpXG5cdFx0IyDoi6XmnKrojrflvpflj6/ljLnphY3nmoTorrDlvZXvvIzor7TmmI7or6Vtb2R1bGXmnKrlronoo4XvvIzlvZPmnIjkuI3orqHnrpfotLnnlKhcblx0XHRpZiBub3QgbV9jaGFuZ2Vsb2dcblx0XHRcdCMgIGRvIG5vdGhpbmdcblxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnGluc3RhbGzigJ3vvIzor7TmmI7lvZPmnIjliY3lt7Llronoo4XvvIzlm6DmraTpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJpbnN0YWxsXCJcblx0XHRcdG1vZHVsZXMucHVzaChtKVxuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGU8c3RhcnRkYXRlICYgb3BlcmF0aW9uPeKAnHVuaW5zdGFsbOKAne+8jOivtOaYjuW9k+aciOWJjeW3suWNuOi9ve+8jOWboOatpOS4jeiuoeeul+i0ueeUqFxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPCBzdGFydF9kYXRlIGFuZCBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT0gXCJ1bmluc3RhbGxcIlxuXHRcdFx0IyAgZG8gbm90aGluZ1xuXHRcdCMg6Iul6K+l6K6w5b2V55qEY2hhbmdlX2RhdGXiiaVzdGFydGRhdGXvvIzor7TmmI7lvZPmnIjlhoXlj5HnlJ/ov4flronoo4XmiJbljbjovb3nmoTmk43kvZzvvIzpnIDorqHnrpfotLnnlKjvvIzlsIZtb2R1bGVfbmFtZeS4jm1vZHVsZXMubGlzdHByaWNl5Yqg5YWlbW9kdWxlc+aVsOe7hOS4rVxuXHRcdGVsc2UgaWYgbV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZVxuXHRcdFx0bW9kdWxlcy5wdXNoKG0pXG5cblx0cmV0dXJuIG1vZHVsZXNcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSA9ICgpLT5cblx0bW9kdWxlc19uYW1lID0gbmV3IEFycmF5XG5cdGRiLm1vZHVsZXMuZmluZCgpLmZvckVhY2goKG0pLT5cblx0XHRtb2R1bGVzX25hbWUucHVzaChtLm5hbWUpXG5cdClcblx0cmV0dXJuIG1vZHVsZXNfbmFtZVxuXG5cbmJpbGxpbmdNYW5hZ2VyLmNhY3VsYXRlX2J5X2FjY291bnRpbmdfbW9udGggPSAoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpLT5cblx0aWYgYWNjb3VudGluZ19tb250aCA+IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdHJldHVyblxuXHRpZiBhY2NvdW50aW5nX21vbnRoID09IChtb21lbnQoKS5mb3JtYXQoJ1lZWVlNTScpKVxuXHRcdCMg6YeN566X5b2T5pyI55qE5YWF5YC85ZCO5L2Z6aKdXG5cdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRkZWJpdHMgPSAwXG5cdFx0bW9kdWxlc19uYW1lID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXNfbmFtZSgpXG5cdFx0Yl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsNikpLCAwKVxuXHRcdGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCktKGJfbV9kLmdldERhdGUoKSoyNCo2MCo2MCoxMDAwKSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRkYi5iaWxsaW5ncy5maW5kKFxuXHRcdFx0e1xuXHRcdFx0XHRiaWxsaW5nX2RhdGU6IGJfbSxcblx0XHRcdFx0c3BhY2U6IHNwYWNlX2lkLFxuXHRcdFx0XHR0cmFuc2FjdGlvbjoge1xuXHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHQpLmZvckVhY2goKGIpLT5cblx0XHRcdGRlYml0cyArPSBiLmRlYml0c1xuXHRcdClcblx0XHRuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe3NwYWNlOiBzcGFjZV9pZH0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfX0pXG5cdFx0YmFsYW5jZSA9IG5ld2VzdF9iaWxsLmJhbGFuY2Vcblx0XHRyZW1haW5pbmdfbW9udGhzID0gMFxuXHRcdGlmIGJhbGFuY2UgPiAwXG5cdFx0XHRpZiBkZWJpdHMgPiAwXG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlL2RlYml0cykgKyAxXG5cdFx0XHRlbHNlXG5cdFx0XHRcdCMg5b2T5pyI5Yia5Y2H57qn77yM5bm25rKh5pyJ5omj5qy+XG5cdFx0XHRcdHJlbWFpbmluZ19tb250aHMgPSAxXG5cblx0XHRkYi5zcGFjZXMuZGlyZWN0LnVwZGF0ZShcblx0XHRcdHtcblx0XHRcdFx0X2lkOiBzcGFjZV9pZFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0JHNldDoge1xuXHRcdFx0XHRcdGJhbGFuY2U6IGJhbGFuY2UsXG5cdFx0XHRcdFx0XCJiaWxsaW5nLnJlbWFpbmluZ19tb250aHNcIjogcmVtYWluaW5nX21vbnRoc1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0KVxuXHRlbHNlXG5cdFx0IyDojrflvpflhbbnu5Pnrpflr7nosaHml6XmnJ9wYXltZW50ZGF0ZXPmlbDnu4Tlkoxjb3VudF9kYXlz5Y+v57uT566X5pel5pWwXG5cdFx0cGVyaW9kX3Jlc3VsdCA9IGJpbGxpbmdNYW5hZ2VyLmdldF9hY2NvdW50aW5nX3BlcmlvZChzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aClcblx0XHRpZiBwZXJpb2RfcmVzdWx0W1wiY291bnRfZGF5c1wiXSA9PSAwXG5cdFx0XHQjIOS5n+mcgOWvueW9k+aciOeahOWFheWAvOiusOW9leaJp+ihjOabtOaWsFxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRlbHNlXG5cdFx0XHR1c2VyX2NvdW50ID0gYmlsbGluZ01hbmFnZXIuZ2V0U3BhY2VVc2VyQ291bnQoc3BhY2VfaWQpXG5cblx0XHRcdCMg5riF6Zmk5b2T5pyI55qE5bey57uT566X6K6w5b2VXG5cdFx0XHRtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKClcblx0XHRcdGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCw0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCw2KSksIDApXG5cdFx0XHRhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIilcblx0XHRcdGRiLmJpbGxpbmdzLnJlbW92ZShcblx0XHRcdFx0e1xuXHRcdFx0XHRcdGJpbGxpbmdfZGF0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdCxcblx0XHRcdFx0XHRzcGFjZTogc3BhY2VfaWQsXG5cdFx0XHRcdFx0dHJhbnNhY3Rpb246IHtcblx0XHRcdFx0XHRcdCRpbjogbW9kdWxlc19uYW1lXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHQpXG5cdFx0XHQjIOmHjeeul+W9k+aciOeahOWFheWAvOWQjuS9meminVxuXHRcdFx0YmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UoYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpXG5cblx0XHRcdCMg57uT566X5b2T5pyI55qEQVBQ5L2/55So5ZCO5L2Z6aKdXG5cdFx0XHRtb2R1bGVzID0gYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpXG5cdFx0XHRpZiBtb2R1bGVzIGFuZCAgbW9kdWxlcy5sZW5ndGg+MFxuXHRcdFx0XHRfLmVhY2ggbW9kdWxlcywgKG0pLT5cblx0XHRcdFx0XHRiaWxsaW5nTWFuYWdlci5nZXRfYmFsYW5jZShzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgcGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0sIG0ubmFtZSwgbS5saXN0cHJpY2UpXG5cblx0XHRhX20gPSBtb21lbnQobmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LDYpKSwgMSkuZ2V0VGltZSgpKS5mb3JtYXQoXCJZWVlZTU1cIilcblx0XHRiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpXG5cbmJpbGxpbmdNYW5hZ2VyLnNwZWNpYWxfcGF5ID0gKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KS0+XG5cdHNwYWNlID0gZGIuc3BhY2VzLmZpbmRPbmUoc3BhY2VfaWQpXG5cblx0bW9kdWxlcyA9IHNwYWNlLm1vZHVsZXMgfHwgbmV3IEFycmF5XG5cblx0bmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKVxuXG5cdG0gPSBtb21lbnQoKVxuXHRub3cgPSBtLl9kXG5cblx0c3BhY2VfdXBkYXRlX29iaiA9IG5ldyBPYmplY3RcblxuXHQjIOabtOaWsHNwYWNl5piv5ZCm5LiT5Lia54mI55qE5qCH6K6wXG5cdGlmIHNwYWNlLmlzX3BhaWQgaXNudCB0cnVlXG5cdFx0c3BhY2VfdXBkYXRlX29iai5pc19wYWlkID0gdHJ1ZVxuXHRcdHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlXG5cblx0IyDmm7TmlrBtb2R1bGVzXG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lc1xuXHRzcGFjZV91cGRhdGVfb2JqLm1vZGlmaWVkID0gbm93XG5cdHNwYWNlX3VwZGF0ZV9vYmoubW9kaWZpZWRfYnkgPSBvcGVyYXRvcl9pZFxuXHRzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpXG5cdHNwYWNlX3VwZGF0ZV9vYmoudXNlcl9saW1pdCA9IHVzZXJfY291bnRcblxuXHRyID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe19pZDogc3BhY2VfaWR9LCB7JHNldDogc3BhY2VfdXBkYXRlX29ian0pXG5cdGlmIHJcblx0XHRfLmVhY2ggbmV3X21vZHVsZXMsIChtb2R1bGUpLT5cblx0XHRcdG1jbCA9IG5ldyBPYmplY3Rcblx0XHRcdG1jbC5faWQgPSBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuX21ha2VOZXdJRCgpXG5cdFx0XHRtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpXG5cdFx0XHRtY2wub3BlcmF0b3IgPSBvcGVyYXRvcl9pZFxuXHRcdFx0bWNsLnNwYWNlID0gc3BhY2VfaWRcblx0XHRcdG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIlxuXHRcdFx0bWNsLm1vZHVsZSA9IG1vZHVsZVxuXHRcdFx0bWNsLmNyZWF0ZWQgPSBub3dcblx0XHRcdGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5pbnNlcnQobWNsKVxuXG5cdHJldHVybiIsIiAgICAgICAgICAgICAgICAgICBcblxuYmlsbGluZ01hbmFnZXIgPSB7fTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kID0gZnVuY3Rpb24oc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgpIHtcbiAgdmFyIGJpbGxpbmcsIGNvdW50X2RheXMsIGVuZF9kYXRlLCBlbmRfZGF0ZV90aW1lLCBmaXJzdF9kYXRlLCBzdGFydF9kYXRlLCBzdGFydF9kYXRlX3RpbWU7XG4gIGNvdW50X2RheXMgPSAwO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgYmlsbGluZyA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICB0cmFuc2FjdGlvbjogXCJTdGFydGluZyBiYWxhbmNlXCJcbiAgfSk7XG4gIGZpcnN0X2RhdGUgPSBiaWxsaW5nLmJpbGxpbmdfZGF0ZTtcbiAgc3RhcnRfZGF0ZSA9IGFjY291bnRpbmdfbW9udGggKyBcIjAxXCI7XG4gIHN0YXJ0X2RhdGVfdGltZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMSAtIGVuZF9kYXRlX3RpbWUuZ2V0RGF0ZSgpKTtcbiAgaWYgKGZpcnN0X2RhdGUgPj0gZW5kX2RhdGUpIHtcblxuICB9IGVsc2UgaWYgKHN0YXJ0X2RhdGUgPD0gZmlyc3RfZGF0ZSAmJiBmaXJzdF9kYXRlIDwgZW5kX2RhdGUpIHtcbiAgICBjb3VudF9kYXlzID0gKGVuZF9kYXRlX3RpbWUgLSBzdGFydF9kYXRlX3RpbWUpIC8gKDI0ICogNjAgKiA2MCAqIDEwMDApICsgMTtcbiAgfSBlbHNlIGlmIChmaXJzdF9kYXRlIDwgc3RhcnRfZGF0ZSkge1xuICAgIGNvdW50X2RheXMgPSAoZW5kX2RhdGVfdGltZSAtIHN0YXJ0X2RhdGVfdGltZSkgLyAoMjQgKiA2MCAqIDYwICogMTAwMCkgKyAxO1xuICB9XG4gIHJldHVybiB7XG4gICAgXCJjb3VudF9kYXlzXCI6IGNvdW50X2RheXNcbiAgfTtcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCByZWZyZXNoX2RhdGUpIHtcbiAgdmFyIGFwcF9iaWxsLCBiX20sIGJfbV9kLCBiaWxsLCBjcmVkaXRzLCBkZWJpdHMsIGxhc3RfYmFsYW5jZSwgbGFzdF9iaWxsLCBwYXltZW50X2JpbGwsIHNldE9iajtcbiAgbGFzdF9iaWxsID0gbnVsbDtcbiAgYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiByZWZyZXNoX2RhdGVcbiAgfSk7XG4gIHBheW1lbnRfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICBjcmVhdGVkOiB7XG4gICAgICAkbHQ6IHJlZnJlc2hfZGF0ZVxuICAgIH0sXG4gICAgYmlsbGluZ19tb250aDogYmlsbC5iaWxsaW5nX21vbnRoXG4gIH0sIHtcbiAgICBzb3J0OiB7XG4gICAgICBtb2RpZmllZDogLTFcbiAgICB9XG4gIH0pO1xuICBpZiAocGF5bWVudF9iaWxsKSB7XG4gICAgbGFzdF9iaWxsID0gcGF5bWVudF9iaWxsO1xuICB9IGVsc2Uge1xuICAgIGJfbV9kID0gbmV3IERhdGUocGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYmlsbC5iaWxsaW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgYl9tID0gbW9tZW50KGJfbV9kLmdldFRpbWUoKSAtIChiX21fZC5nZXREYXRlKCkgKiAyNCAqIDYwICogNjAgKiAxMDAwKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIGFwcF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICBiaWxsaW5nX21vbnRoOiBiX21cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIG1vZGlmaWVkOiAtMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChhcHBfYmlsbCkge1xuICAgICAgbGFzdF9iaWxsID0gYXBwX2JpbGw7XG4gICAgfVxuICB9XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBkZWJpdHMgPSBiaWxsLmRlYml0cyA/IGJpbGwuZGViaXRzIDogMC4wO1xuICBjcmVkaXRzID0gYmlsbC5jcmVkaXRzID8gYmlsbC5jcmVkaXRzIDogMC4wO1xuICBzZXRPYmogPSBuZXcgT2JqZWN0O1xuICBzZXRPYmouYmFsYW5jZSA9IE51bWJlcigobGFzdF9iYWxhbmNlICsgY3JlZGl0cyAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIHNldE9iai5tb2RpZmllZCA9IG5ldyBEYXRlO1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0LnVwZGF0ZSh7XG4gICAgX2lkOiBiaWxsLl9pZFxuICB9LCB7XG4gICAgJHNldDogc2V0T2JqXG4gIH0pO1xufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2UgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCwgdXNlcl9jb3VudCwgY291bnRfZGF5cywgbW9kdWxlX25hbWUsIGxpc3RwcmljZSkge1xuICB2YXIgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBkYXlzX251bWJlciwgZGViaXRzLCBsYXN0X2JhbGFuY2UsIGxhc3RfYmlsbCwgbmV3X2JpbGwsIG5vdztcbiAgYWNjb3VudGluZ19kYXRlID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZGF5c19udW1iZXIgPSBhY2NvdW50aW5nX2RhdGUuZ2V0RGF0ZSgpO1xuICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gIGRlYml0cyA9IE51bWJlcigoKGNvdW50X2RheXMgLyBkYXlzX251bWJlcikgKiB1c2VyX2NvdW50ICogbGlzdHByaWNlKS50b0ZpeGVkKDIpKTtcbiAgbGFzdF9iaWxsID0gZGIuYmlsbGluZ3MuZmluZE9uZSh7XG4gICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgIGJpbGxpbmdfZGF0ZToge1xuICAgICAgJGx0ZTogYWNjb3VudGluZ19kYXRlX2Zvcm1hdFxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIG1vZGlmaWVkOiAtMVxuICAgIH1cbiAgfSk7XG4gIGxhc3RfYmFsYW5jZSA9IGxhc3RfYmlsbCAmJiBsYXN0X2JpbGwuYmFsYW5jZSA/IGxhc3RfYmlsbC5iYWxhbmNlIDogMC4wO1xuICBub3cgPSBuZXcgRGF0ZTtcbiAgbmV3X2JpbGwgPSBuZXcgT2JqZWN0O1xuICBuZXdfYmlsbC5faWQgPSBkYi5iaWxsaW5ncy5fbWFrZU5ld0lEKCk7XG4gIG5ld19iaWxsLmJpbGxpbmdfbW9udGggPSBhY2NvdW50aW5nX21vbnRoO1xuICBuZXdfYmlsbC5iaWxsaW5nX2RhdGUgPSBhY2NvdW50aW5nX2RhdGVfZm9ybWF0O1xuICBuZXdfYmlsbC5zcGFjZSA9IHNwYWNlX2lkO1xuICBuZXdfYmlsbC50cmFuc2FjdGlvbiA9IG1vZHVsZV9uYW1lO1xuICBuZXdfYmlsbC5saXN0cHJpY2UgPSBsaXN0cHJpY2U7XG4gIG5ld19iaWxsLnVzZXJfY291bnQgPSB1c2VyX2NvdW50O1xuICBuZXdfYmlsbC5kZWJpdHMgPSBkZWJpdHM7XG4gIG5ld19iaWxsLmJhbGFuY2UgPSBOdW1iZXIoKGxhc3RfYmFsYW5jZSAtIGRlYml0cykudG9GaXhlZCgyKSk7XG4gIG5ld19iaWxsLmNyZWF0ZWQgPSBub3c7XG4gIG5ld19iaWxsLm1vZGlmaWVkID0gbm93O1xuICByZXR1cm4gZGIuYmlsbGluZ3MuZGlyZWN0Lmluc2VydChuZXdfYmlsbCk7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5nZXRTcGFjZVVzZXJDb3VudCA9IGZ1bmN0aW9uKHNwYWNlX2lkKSB7XG4gIHJldHVybiBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdXNlcl9hY2NlcHRlZDogdHJ1ZVxuICB9KS5jb3VudCgpO1xufTtcblxuYmlsbGluZ01hbmFnZXIucmVjYWN1bGF0ZUJhbGFuY2UgPSBmdW5jdGlvbihhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCkge1xuICB2YXIgcmVmcmVzaF9kYXRlcztcbiAgcmVmcmVzaF9kYXRlcyA9IG5ldyBBcnJheTtcbiAgZGIuYmlsbGluZ3MuZmluZCh7XG4gICAgYmlsbGluZ19tb250aDogYWNjb3VudGluZ19tb250aCxcbiAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICRpbjogW1wiUGF5bWVudFwiLCBcIlNlcnZpY2UgYWRqdXN0bWVudFwiXVxuICAgIH1cbiAgfSwge1xuICAgIHNvcnQ6IHtcbiAgICAgIGNyZWF0ZWQ6IDFcbiAgICB9XG4gIH0pLmZvckVhY2goZnVuY3Rpb24oYmlsbCkge1xuICAgIHJldHVybiByZWZyZXNoX2RhdGVzLnB1c2goYmlsbC5jcmVhdGVkKTtcbiAgfSk7XG4gIGlmIChyZWZyZXNoX2RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gXy5lYWNoKHJlZnJlc2hfZGF0ZXMsIGZ1bmN0aW9uKHJfZCkge1xuICAgICAgcmV0dXJuIGJpbGxpbmdNYW5hZ2VyLnJlZnJlc2hfYmFsYW5jZShzcGFjZV9pZCwgcl9kKTtcbiAgICB9KTtcbiAgfVxufTtcblxuYmlsbGluZ01hbmFnZXIuZ2V0X21vZHVsZXMgPSBmdW5jdGlvbihzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCkge1xuICB2YXIgZW5kX2RhdGUsIGVuZF9kYXRlX3RpbWUsIG1vZHVsZXMsIHN0YXJ0X2RhdGU7XG4gIG1vZHVsZXMgPSBuZXcgQXJyYXk7XG4gIHN0YXJ0X2RhdGUgPSBhY2NvdW50aW5nX21vbnRoICsgXCIwMVwiO1xuICBlbmRfZGF0ZV90aW1lID0gbmV3IERhdGUocGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSgwLCA0KSksIHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoNCwgNikpLCAwKTtcbiAgZW5kX2RhdGUgPSBtb21lbnQoZW5kX2RhdGVfdGltZS5nZXRUaW1lKCkpLmZvcm1hdCgnWVlZWU1NREQnKTtcbiAgZGIubW9kdWxlcy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihtKSB7XG4gICAgdmFyIG1fY2hhbmdlbG9nO1xuICAgIG1fY2hhbmdlbG9nID0gZGIubW9kdWxlc19jaGFuZ2Vsb2dzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkLFxuICAgICAgbW9kdWxlOiBtLm5hbWUsXG4gICAgICBjaGFuZ2VfZGF0ZToge1xuICAgICAgICAkbHRlOiBlbmRfZGF0ZVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGNyZWF0ZWQ6IC0xXG4gICAgfSk7XG4gICAgaWYgKCFtX2NoYW5nZWxvZykge1xuXG4gICAgfSBlbHNlIGlmIChtX2NoYW5nZWxvZy5jaGFuZ2VfZGF0ZSA8IHN0YXJ0X2RhdGUgJiYgbV9jaGFuZ2Vsb2cub3BlcmF0aW9uID09PSBcImluc3RhbGxcIikge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9IGVsc2UgaWYgKG1fY2hhbmdlbG9nLmNoYW5nZV9kYXRlIDwgc3RhcnRfZGF0ZSAmJiBtX2NoYW5nZWxvZy5vcGVyYXRpb24gPT09IFwidW5pbnN0YWxsXCIpIHtcblxuICAgIH0gZWxzZSBpZiAobV9jaGFuZ2Vsb2cuY2hhbmdlX2RhdGUgPj0gc3RhcnRfZGF0ZSkge1xuICAgICAgcmV0dXJuIG1vZHVsZXMucHVzaChtKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbW9kdWxlcztcbn07XG5cbmJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG1vZHVsZXNfbmFtZTtcbiAgbW9kdWxlc19uYW1lID0gbmV3IEFycmF5O1xuICBkYi5tb2R1bGVzLmZpbmQoKS5mb3JFYWNoKGZ1bmN0aW9uKG0pIHtcbiAgICByZXR1cm4gbW9kdWxlc19uYW1lLnB1c2gobS5uYW1lKTtcbiAgfSk7XG4gIHJldHVybiBtb2R1bGVzX25hbWU7XG59O1xuXG5iaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoID0gZnVuY3Rpb24oYWNjb3VudGluZ19tb250aCwgc3BhY2VfaWQpIHtcbiAgdmFyIGFfbSwgYWNjb3VudGluZ19kYXRlLCBhY2NvdW50aW5nX2RhdGVfZm9ybWF0LCBiX20sIGJfbV9kLCBiYWxhbmNlLCBkZWJpdHMsIG1vZHVsZXMsIG1vZHVsZXNfbmFtZSwgbmV3ZXN0X2JpbGwsIHBlcmlvZF9yZXN1bHQsIHJlbWFpbmluZ19tb250aHMsIHVzZXJfY291bnQ7XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID4gKG1vbWVudCgpLmZvcm1hdCgnWVlZWU1NJykpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChhY2NvdW50aW5nX21vbnRoID09PSAobW9tZW50KCkuZm9ybWF0KCdZWVlZTU0nKSkpIHtcbiAgICBiaWxsaW5nTWFuYWdlci5yZWNhY3VsYXRlQmFsYW5jZShhY2NvdW50aW5nX21vbnRoLCBzcGFjZV9pZCk7XG4gICAgZGViaXRzID0gMDtcbiAgICBtb2R1bGVzX25hbWUgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlc19uYW1lKCk7XG4gICAgYl9tX2QgPSBuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDApO1xuICAgIGJfbSA9IG1vbWVudChiX21fZC5nZXRUaW1lKCkgLSAoYl9tX2QuZ2V0RGF0ZSgpICogMjQgKiA2MCAqIDYwICogMTAwMCkpLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgIGRiLmJpbGxpbmdzLmZpbmQoe1xuICAgICAgYmlsbGluZ19kYXRlOiBiX20sXG4gICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICB0cmFuc2FjdGlvbjoge1xuICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgfVxuICAgIH0pLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgcmV0dXJuIGRlYml0cyArPSBiLmRlYml0cztcbiAgICB9KTtcbiAgICBuZXdlc3RfYmlsbCA9IGRiLmJpbGxpbmdzLmZpbmRPbmUoe1xuICAgICAgc3BhY2U6IHNwYWNlX2lkXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBiYWxhbmNlID0gbmV3ZXN0X2JpbGwuYmFsYW5jZTtcbiAgICByZW1haW5pbmdfbW9udGhzID0gMDtcbiAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgIGlmIChkZWJpdHMgPiAwKSB7XG4gICAgICAgIHJlbWFpbmluZ19tb250aHMgPSBwYXJzZUludChiYWxhbmNlIC8gZGViaXRzKSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdfbW9udGhzID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogc3BhY2VfaWRcbiAgICB9LCB7XG4gICAgICAkc2V0OiB7XG4gICAgICAgIGJhbGFuY2U6IGJhbGFuY2UsXG4gICAgICAgIFwiYmlsbGluZy5yZW1haW5pbmdfbW9udGhzXCI6IHJlbWFpbmluZ19tb250aHNcbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBwZXJpb2RfcmVzdWx0ID0gYmlsbGluZ01hbmFnZXIuZ2V0X2FjY291bnRpbmdfcGVyaW9kKHNwYWNlX2lkLCBhY2NvdW50aW5nX21vbnRoKTtcbiAgICBpZiAocGVyaW9kX3Jlc3VsdFtcImNvdW50X2RheXNcIl0gPT09IDApIHtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXNlcl9jb3VudCA9IGJpbGxpbmdNYW5hZ2VyLmdldFNwYWNlVXNlckNvdW50KHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXNfbmFtZSA9IGJpbGxpbmdNYW5hZ2VyLmdldF9tb2R1bGVzX25hbWUoKTtcbiAgICAgIGFjY291bnRpbmdfZGF0ZSA9IG5ldyBEYXRlKHBhcnNlSW50KGFjY291bnRpbmdfbW9udGguc2xpY2UoMCwgNCkpLCBwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDQsIDYpKSwgMCk7XG4gICAgICBhY2NvdW50aW5nX2RhdGVfZm9ybWF0ID0gbW9tZW50KGFjY291bnRpbmdfZGF0ZSkuZm9ybWF0KFwiWVlZWU1NRERcIik7XG4gICAgICBkYi5iaWxsaW5ncy5yZW1vdmUoe1xuICAgICAgICBiaWxsaW5nX2RhdGU6IGFjY291bnRpbmdfZGF0ZV9mb3JtYXQsXG4gICAgICAgIHNwYWNlOiBzcGFjZV9pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICAkaW46IG1vZHVsZXNfbmFtZVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGJpbGxpbmdNYW5hZ2VyLnJlY2FjdWxhdGVCYWxhbmNlKGFjY291bnRpbmdfbW9udGgsIHNwYWNlX2lkKTtcbiAgICAgIG1vZHVsZXMgPSBiaWxsaW5nTWFuYWdlci5nZXRfbW9kdWxlcyhzcGFjZV9pZCwgYWNjb3VudGluZ19tb250aCk7XG4gICAgICBpZiAobW9kdWxlcyAmJiBtb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgXy5lYWNoKG1vZHVsZXMsIGZ1bmN0aW9uKG0pIHtcbiAgICAgICAgICByZXR1cm4gYmlsbGluZ01hbmFnZXIuZ2V0X2JhbGFuY2Uoc3BhY2VfaWQsIGFjY291bnRpbmdfbW9udGgsIHVzZXJfY291bnQsIHBlcmlvZF9yZXN1bHRbXCJjb3VudF9kYXlzXCJdLCBtLm5hbWUsIG0ubGlzdHByaWNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGFfbSA9IG1vbWVudChuZXcgRGF0ZShwYXJzZUludChhY2NvdW50aW5nX21vbnRoLnNsaWNlKDAsIDQpKSwgcGFyc2VJbnQoYWNjb3VudGluZ19tb250aC5zbGljZSg0LCA2KSksIDEpLmdldFRpbWUoKSkuZm9ybWF0KFwiWVlZWU1NXCIpO1xuICAgIHJldHVybiBiaWxsaW5nTWFuYWdlci5jYWN1bGF0ZV9ieV9hY2NvdW50aW5nX21vbnRoKGFfbSwgc3BhY2VfaWQpO1xuICB9XG59O1xuXG5iaWxsaW5nTWFuYWdlci5zcGVjaWFsX3BheSA9IGZ1bmN0aW9uKHNwYWNlX2lkLCBtb2R1bGVfbmFtZXMsIHRvdGFsX2ZlZSwgb3BlcmF0b3JfaWQsIGVuZF9kYXRlLCB1c2VyX2NvdW50KSB7XG4gIHZhciBtLCBtb2R1bGVzLCBuZXdfbW9kdWxlcywgbm93LCByLCBzcGFjZSwgc3BhY2VfdXBkYXRlX29iajtcbiAgc3BhY2UgPSBkYi5zcGFjZXMuZmluZE9uZShzcGFjZV9pZCk7XG4gIG1vZHVsZXMgPSBzcGFjZS5tb2R1bGVzIHx8IG5ldyBBcnJheTtcbiAgbmV3X21vZHVsZXMgPSBfLmRpZmZlcmVuY2UobW9kdWxlX25hbWVzLCBtb2R1bGVzKTtcbiAgbSA9IG1vbWVudCgpO1xuICBub3cgPSBtLl9kO1xuICBzcGFjZV91cGRhdGVfb2JqID0gbmV3IE9iamVjdDtcbiAgaWYgKHNwYWNlLmlzX3BhaWQgIT09IHRydWUpIHtcbiAgICBzcGFjZV91cGRhdGVfb2JqLmlzX3BhaWQgPSB0cnVlO1xuICAgIHNwYWNlX3VwZGF0ZV9vYmouc3RhcnRfZGF0ZSA9IG5ldyBEYXRlO1xuICB9XG4gIHNwYWNlX3VwZGF0ZV9vYmoubW9kdWxlcyA9IG1vZHVsZV9uYW1lcztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZCA9IG5vdztcbiAgc3BhY2VfdXBkYXRlX29iai5tb2RpZmllZF9ieSA9IG9wZXJhdG9yX2lkO1xuICBzcGFjZV91cGRhdGVfb2JqLmVuZF9kYXRlID0gbmV3IERhdGUoZW5kX2RhdGUpO1xuICBzcGFjZV91cGRhdGVfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50O1xuICByID0gZGIuc3BhY2VzLmRpcmVjdC51cGRhdGUoe1xuICAgIF9pZDogc3BhY2VfaWRcbiAgfSwge1xuICAgICRzZXQ6IHNwYWNlX3VwZGF0ZV9vYmpcbiAgfSk7XG4gIGlmIChyKSB7XG4gICAgXy5lYWNoKG5ld19tb2R1bGVzLCBmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAgIHZhciBtY2w7XG4gICAgICBtY2wgPSBuZXcgT2JqZWN0O1xuICAgICAgbWNsLl9pZCA9IGRiLm1vZHVsZXNfY2hhbmdlbG9ncy5fbWFrZU5ld0lEKCk7XG4gICAgICBtY2wuY2hhbmdlX2RhdGUgPSBtLmZvcm1hdChcIllZWVlNTUREXCIpO1xuICAgICAgbWNsLm9wZXJhdG9yID0gb3BlcmF0b3JfaWQ7XG4gICAgICBtY2wuc3BhY2UgPSBzcGFjZV9pZDtcbiAgICAgIG1jbC5vcGVyYXRpb24gPSBcImluc3RhbGxcIjtcbiAgICAgIG1jbC5tb2R1bGUgPSBtb2R1bGU7XG4gICAgICBtY2wuY3JlYXRlZCA9IG5vdztcbiAgICAgIHJldHVybiBkYi5tb2R1bGVzX2NoYW5nZWxvZ3MuaW5zZXJ0KG1jbCk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbiAoKSB7XG5cbiAgaWYgKE1ldGVvci5zZXR0aW5ncy5jcm9uICYmIE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3MpIHtcblxuICAgIHZhciBzY2hlZHVsZSA9IHJlcXVpcmUoJ25vZGUtc2NoZWR1bGUnKTtcbiAgICAvLyDlrprml7bmiafooYznu5/orqFcbiAgICB2YXIgcnVsZSA9IE1ldGVvci5zZXR0aW5ncy5jcm9uLnN0YXRpc3RpY3M7XG5cbiAgICB2YXIgZ29fbmV4dCA9IHRydWU7XG5cbiAgICBzY2hlZHVsZS5zY2hlZHVsZUpvYihydWxlLCBNZXRlb3IuYmluZEVudmlyb25tZW50KGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghZ29fbmV4dClcbiAgICAgICAgcmV0dXJuO1xuICAgICAgZ29fbmV4dCA9IGZhbHNlO1xuXG4gICAgICBjb25zb2xlLnRpbWUoJ3N0YXRpc3RpY3MnKTtcbiAgICAgIC8vIOaXpeacn+agvOW8j+WMliBcbiAgICAgIHZhciBkYXRlRm9ybWF0ID0gZnVuY3Rpb24gKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVrZXkgPSBcIlwiK2RhdGUuZ2V0RnVsbFllYXIoKStcIi1cIisoZGF0ZS5nZXRNb250aCgpKzEpK1wiLVwiKyhkYXRlLmdldERhdGUoKSk7XG4gICAgICAgIHJldHVybiBkYXRla2V5O1xuICAgICAgfTtcbiAgICAgIC8vIOiuoeeul+WJjeS4gOWkqeaXtumXtFxuICAgICAgdmFyIHllc3RlckRheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGROb3cgPSBuZXcgRGF0ZSgpOyAgIC8v5b2T5YmN5pe26Ze0XG4gICAgICAgIHZhciBkQmVmb3JlID0gbmV3IERhdGUoZE5vdy5nZXRUaW1lKCkgLSAyNCozNjAwKjEwMDApOyAgIC8v5b6X5Yiw5YmN5LiA5aSp55qE5pe26Ze0XG4gICAgICAgIHJldHVybiBkQmVmb3JlO1xuICAgICAgfTtcbiAgICAgIC8vIOe7n+iuoeW9k+aXpeaVsOaNrlxuICAgICAgdmFyIGRhaWx5U3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6c3BhY2VbXCJfaWRcIl0sXCJjcmVhdGVkXCI6eyRndDogeWVzdGVyRGF5KCl9fSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oC75pWwXG4gICAgICB2YXIgc3RhdGljc0NvdW50ID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBzdGF0aWNzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHJldHVybiBzdGF0aWNzLmNvdW50KCk7XG4gICAgICB9O1xuICAgICAgLy8g5p+l6K+i5oul5pyJ6ICF5ZCN5a2XXG4gICAgICB2YXIgb3duZXJOYW1lID0gZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNwYWNlKSB7XG4gICAgICAgIHZhciBvd25lciA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XCJfaWRcIjogc3BhY2VbXCJvd25lclwiXX0pO1xuICAgICAgICB2YXIgbmFtZSA9IG93bmVyLm5hbWU7XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgICAgfTtcbiAgICAgIC8vIOacgOi/keeZu+W9leaXpeacn1xuICAgICAgdmFyIGxhc3RMb2dvbiA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgbGFzdExvZ29uID0gMDtcbiAgICAgICAgdmFyIHNVc2VycyA9IGRiLnNwYWNlX3VzZXJzLmZpbmQoe1wic3BhY2VcIjogc3BhY2VbXCJfaWRcIl19LCB7ZmllbGRzOiB7dXNlcjogMX19KTsgXG4gICAgICAgIHNVc2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzVXNlcikge1xuICAgICAgICAgIHZhciB1c2VyID0gY29sbGVjdGlvbi5maW5kT25lKHtcIl9pZFwiOnNVc2VyW1widXNlclwiXX0pO1xuICAgICAgICAgIGlmKHVzZXIgJiYgKGxhc3RMb2dvbiA8IHVzZXIubGFzdF9sb2dvbikpe1xuICAgICAgICAgICAgbGFzdExvZ29uID0gdXNlci5sYXN0X2xvZ29uO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIGxhc3RMb2dvbjtcbiAgICAgIH07XG4gICAgICAvLyDmnIDov5Hkv67mlLnml6XmnJ9cbiAgICAgIHZhciBsYXN0TW9kaWZpZWQgPSBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3BhY2UpIHtcbiAgICAgICAgdmFyIG9iaiA9IGNvbGxlY3Rpb24uZmluZCh7XCJzcGFjZVwiOiBzcGFjZVtcIl9pZFwiXX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgbGltaXQ6IDF9KTtcbiAgICAgICAgdmFyIG9iakFyciA9IG9iai5mZXRjaCgpO1xuICAgICAgICBpZihvYmpBcnIubGVuZ3RoID4gMClcbiAgICAgICAgICB2YXIgbW9kID0gb2JqQXJyWzBdLm1vZGlmaWVkO1xuICAgICAgICAgIHJldHVybiBtb2Q7XG4gICAgICB9O1xuICAgICAgLy8g5paH56ug6ZmE5Lu25aSn5bCPXG4gICAgICB2YXIgcG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjpwb3N0W1wiX2lkXCJdfSk7XG4gICAgICAgICAgYXR0cy5mb3JFYWNoKGZ1bmN0aW9uIChhdHQpIHtcbiAgICAgICAgICAgIGF0dFNpemUgPSBhdHQub3JpZ2luYWwuc2l6ZTtcbiAgICAgICAgICAgIHNpemVTdW0gKz0gYXR0U2l6ZTtcbiAgICAgICAgICB9KSAgXG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBzaXplU3VtO1xuICAgICAgfTtcbiAgICAgIC8vIOW9k+aXpeaWsOWinumZhOS7tuWkp+Wwj1xuICAgICAgdmFyIGRhaWx5UG9zdHNBdHRhY2htZW50cyA9IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcGFjZSkge1xuICAgICAgICB2YXIgYXR0U2l6ZSA9IDA7XG4gICAgICAgIHZhciBzaXplU3VtID0gMDtcbiAgICAgICAgdmFyIHBvc3RzID0gY29sbGVjdGlvbi5maW5kKHtcInNwYWNlXCI6IHNwYWNlW1wiX2lkXCJdfSk7XG4gICAgICAgIHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcbiAgICAgICAgICB2YXIgYXR0cyA9IGNmcy5wb3N0cy5maW5kKHtcInBvc3RcIjogcG9zdFtcIl9pZFwiXSwgXCJ1cGxvYWRlZEF0XCI6IHskZ3Q6IHllc3RlckRheSgpfX0pO1xuICAgICAgICAgIGF0dHMuZm9yRWFjaChmdW5jdGlvbiAoYXR0KSB7XG4gICAgICAgICAgICBhdHRTaXplID0gYXR0Lm9yaWdpbmFsLnNpemU7XG4gICAgICAgICAgICBzaXplU3VtICs9IGF0dFNpemU7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHNpemVTdW07XG4gICAgICB9O1xuICAgICAgLy8g5o+S5YWl5pWw5o2uXG4gICAgICBkYi5zcGFjZXMuZmluZCh7XCJpc19wYWlkXCI6dHJ1ZX0pLmZvckVhY2goZnVuY3Rpb24gKHNwYWNlKSB7XG4gICAgICAgIGRiLnN0ZWVkb3Nfc3RhdGlzdGljcy5pbnNlcnQoe1xuICAgICAgICAgIHNwYWNlOiBzcGFjZVtcIl9pZFwiXSxcbiAgICAgICAgICBzcGFjZV9uYW1lOiBzcGFjZVtcIm5hbWVcIl0sXG4gICAgICAgICAgYmFsYW5jZTogc3BhY2VbXCJiYWxhbmNlXCJdLFxuICAgICAgICAgIG93bmVyX25hbWU6IG93bmVyTmFtZShkYi51c2Vycywgc3BhY2UpLFxuICAgICAgICAgIGNyZWF0ZWQ6IG5ldyBEYXRlKCksXG4gICAgICAgICAgc3RlZWRvczp7XG4gICAgICAgICAgICB1c2Vyczogc3RhdGljc0NvdW50KGRiLnNwYWNlX3VzZXJzLCBzcGFjZSksXG4gICAgICAgICAgICBvcmdhbml6YXRpb25zOiBzdGF0aWNzQ291bnQoZGIub3JnYW5pemF0aW9ucywgc3BhY2UpLFxuICAgICAgICAgICAgbGFzdF9sb2dvbjogbGFzdExvZ29uKGRiLnVzZXJzLCBzcGFjZSlcbiAgICAgICAgICB9LFxuICAgICAgICAgIHdvcmtmbG93OntcbiAgICAgICAgICAgIGZsb3dzOiBzdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGZvcm1zOiBzdGF0aWNzQ291bnQoZGIuZm9ybXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGZsb3dfcm9sZXM6IHN0YXRpY3NDb3VudChkYi5mbG93X3JvbGVzLCBzcGFjZSksXG4gICAgICAgICAgICBmbG93X3Bvc2l0aW9uczogc3RhdGljc0NvdW50KGRiLmZsb3dfcG9zaXRpb25zLCBzcGFjZSksXG4gICAgICAgICAgICBpbnN0YW5jZXM6IHN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKSxcbiAgICAgICAgICAgIGluc3RhbmNlc19sYXN0X21vZGlmaWVkOiBsYXN0TW9kaWZpZWQoZGIuaW5zdGFuY2VzLCBzcGFjZSksXG4gICAgICAgICAgICBkYWlseV9mbG93czogZGFpbHlTdGF0aWNzQ291bnQoZGIuZmxvd3MsIHNwYWNlKSxcbiAgICAgICAgICAgIGRhaWx5X2Zvcm1zOiBkYWlseVN0YXRpY3NDb3VudChkYi5mb3Jtcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfaW5zdGFuY2VzOiBkYWlseVN0YXRpY3NDb3VudChkYi5pbnN0YW5jZXMsIHNwYWNlKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY21zOiB7XG4gICAgICAgICAgICBzaXRlczogc3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgcG9zdHM6IHN0YXRpY3NDb3VudChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2xhc3RfbW9kaWZpZWQ6IGxhc3RNb2RpZmllZChkYi5jbXNfcG9zdHMsIHNwYWNlKSxcbiAgICAgICAgICAgIHBvc3RzX2F0dGFjaG1lbnRzX3NpemU6IHBvc3RzQXR0YWNobWVudHMoZGIuY21zX3Bvc3RzLCBzcGFjZSksXG4gICAgICAgICAgICBjb21tZW50czogc3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfc2l0ZXM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19zaXRlcywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19wb3N0cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfY29tbWVudHM6IGRhaWx5U3RhdGljc0NvdW50KGRiLmNtc19jb21tZW50cywgc3BhY2UpLFxuICAgICAgICAgICAgZGFpbHlfcG9zdHNfYXR0YWNobWVudHNfc2l6ZTogZGFpbHlQb3N0c0F0dGFjaG1lbnRzKGRiLmNtc19wb3N0cywgc3BhY2UpXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgXG4gICAgICBjb25zb2xlLnRpbWVFbmQoJ3N0YXRpc3RpY3MnKTtcblxuICAgICAgZ29fbmV4dCA9IHRydWU7XG5cbiAgICB9LCBmdW5jdGlvbiAoZSkge1xuICAgICAgY29uc29sZS5sb2coJ0ZhaWxlZCB0byBiaW5kIGVudmlyb25tZW50OiBzdGF0aXN0aWNzLmpzJyk7XG4gICAgICBjb25zb2xlLmxvZyhlLnN0YWNrKTtcbiAgICB9KSk7XG5cbiAgfVxuXG59KVxuXG5cblxuXG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDFcbiAgICAgICAgbmFtZTogJ+WcqOe6v+e8lui+keaXtu+8jOmcgOe7meaWh+S7tuWinuWKoGxvY2sg5bGe5oCn77yM6Ziy5q2i5aSa5Lq65ZCM5pe257yW6L6RICM0MjksIOmZhOS7tumhtemdouS9v+eUqGNmc+aYvuekuidcbiAgICAgICAgdXA6IC0+XG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSAocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGF0dGFjaF92ZXJzaW9uLCBpc0N1cnJlbnQpLT5cbiAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSB7cGFyZW50OiBwYXJlbnRfaWQsIG93bmVyOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieSddLCBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sIHNwYWNlOiBzcGFjZV9pZCwgaW5zdGFuY2U6IGluc3RhbmNlX2lkLCBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddfVxuICAgICAgICAgICAgICAgICAgICBpZiBpc0N1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGFkYXRhLmN1cnJlbnQgPSB0cnVlXG5cbiAgICAgICAgICAgICAgICAgICAgY2ZzLmluc3RhbmNlcy51cGRhdGUoe19pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXX0sIHskc2V0OiB7bWV0YWRhdGE6IG1ldGFkYXRhfX0pXG4gICAgICAgICAgICAgICAgaSA9IDBcbiAgICAgICAgICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHskZXhpc3RzOiB0cnVlfX0sIHtzb3J0OiB7bW9kaWZpZWQ6IC0xfSwgZmllbGRzOiB7c3BhY2U6IDEsIGF0dGFjaG1lbnRzOiAxfX0pLmZvckVhY2ggKGlucykgLT5cbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocyA9IGlucy5hdHRhY2htZW50c1xuICAgICAgICAgICAgICAgICAgICBzcGFjZV9pZCA9IGlucy5zcGFjZVxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZV9pZCA9IGlucy5faWRcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNocy5mb3JFYWNoIChhdHQpLT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRfdmVyID0gYXR0LmN1cnJlbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXZcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UocGFyZW50X2lkLCBzcGFjZV9pZCwgaW5zdGFuY2VfaWQsIGN1cnJlbnRfdmVyLCB0cnVlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBhdHQuaGlzdG9yeXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHQuaGlzdG9yeXMuZm9yRWFjaCAoaGlzKSAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBoaXMsIGZhbHNlKVxuXG4gICAgICAgICAgICAgICAgICAgIGkrK1xuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ3VwZ3JhZGVfY2ZzX2luc3RhbmNlJylcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMSxcbiAgICBuYW1lOiAn5Zyo57q/57yW6L6R5pe277yM6ZyA57uZ5paH5Lu25aKe5YqgbG9jayDlsZ7mgKfvvIzpmLLmraLlpJrkurrlkIzml7bnvJbovpEgIzQyOSwg6ZmE5Lu26aG16Z2i5L2/55SoY2Zz5pi+56S6JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZSwgaSwgdXBkYXRlX2Nmc19pbnN0YW5jZTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZV9jZnNfaW5zdGFuY2UgPSBmdW5jdGlvbihwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgYXR0YWNoX3ZlcnNpb24sIGlzQ3VycmVudCkge1xuICAgICAgICAgIHZhciBtZXRhZGF0YTtcbiAgICAgICAgICBtZXRhZGF0YSA9IHtcbiAgICAgICAgICAgIHBhcmVudDogcGFyZW50X2lkLFxuICAgICAgICAgICAgb3duZXI6IGF0dGFjaF92ZXJzaW9uWydjcmVhdGVkX2J5J10sXG4gICAgICAgICAgICBvd25lcl9uYW1lOiBhdHRhY2hfdmVyc2lvblsnY3JlYXRlZF9ieV9uYW1lJ10sXG4gICAgICAgICAgICBzcGFjZTogc3BhY2VfaWQsXG4gICAgICAgICAgICBpbnN0YW5jZTogaW5zdGFuY2VfaWQsXG4gICAgICAgICAgICBhcHByb3ZlOiBhdHRhY2hfdmVyc2lvblsnYXBwcm92ZSddXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaXNDdXJyZW50KSB7XG4gICAgICAgICAgICBtZXRhZGF0YS5jdXJyZW50ID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGNmcy5pbnN0YW5jZXMudXBkYXRlKHtcbiAgICAgICAgICAgIF9pZDogYXR0YWNoX3ZlcnNpb25bJ19yZXYnXVxuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgbWV0YWRhdGE6IG1ldGFkYXRhXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIGkgPSAwO1xuICAgICAgICBkYi5pbnN0YW5jZXMuZmluZCh7XG4gICAgICAgICAgXCJhdHRhY2htZW50cy5jdXJyZW50XCI6IHtcbiAgICAgICAgICAgICRleGlzdHM6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgICBtb2RpZmllZDogLTFcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgc3BhY2U6IDEsXG4gICAgICAgICAgICBhdHRhY2htZW50czogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihpbnMpIHtcbiAgICAgICAgICB2YXIgYXR0YWNocywgaW5zdGFuY2VfaWQsIHNwYWNlX2lkO1xuICAgICAgICAgIGF0dGFjaHMgPSBpbnMuYXR0YWNobWVudHM7XG4gICAgICAgICAgc3BhY2VfaWQgPSBpbnMuc3BhY2U7XG4gICAgICAgICAgaW5zdGFuY2VfaWQgPSBpbnMuX2lkO1xuICAgICAgICAgIGF0dGFjaHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50X3ZlciwgcGFyZW50X2lkO1xuICAgICAgICAgICAgY3VycmVudF92ZXIgPSBhdHQuY3VycmVudDtcbiAgICAgICAgICAgIHBhcmVudF9pZCA9IGN1cnJlbnRfdmVyLl9yZXY7XG4gICAgICAgICAgICB1cGRhdGVfY2ZzX2luc3RhbmNlKHBhcmVudF9pZCwgc3BhY2VfaWQsIGluc3RhbmNlX2lkLCBjdXJyZW50X3ZlciwgdHJ1ZSk7XG4gICAgICAgICAgICBpZiAoYXR0Lmhpc3RvcnlzKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhdHQuaGlzdG9yeXMuZm9yRWFjaChmdW5jdGlvbihoaXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdXBkYXRlX2Nmc19pbnN0YW5jZShwYXJlbnRfaWQsIHNwYWNlX2lkLCBpbnN0YW5jZV9pZCwgaGlzLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybiBpKys7XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9jZnNfaW5zdGFuY2UnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDEgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogMlxuICAgICAgICBuYW1lOiAn57uE57uH57uT5p6E5YWB6K645LiA5Liq5Lq65bGe5LqO5aSa5Liq6YOo6ZeoICMzNzknXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMiB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtvcmdhbml6YXRpb25zOiB7JGV4aXN0czogZmFsc2V9fSwge2ZpZWxkczoge29yZ2FuaXphdGlvbjogMX19KS5mb3JFYWNoIChzdSktPlxuICAgICAgICAgICAgICAgICAgICBpZiBzdS5vcmdhbml6YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7b3JnYW5pemF0aW9uczogW3N1Lm9yZ2FuaXphdGlvbl19fSlcblxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfc3BhY2VfdXNlcidcbiAgICAgICAgZG93bjogLT5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nICd2ZXJzaW9uIDIgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDIsXG4gICAgbmFtZTogJ+e7hOe7h+e7k+aehOWFgeiuuOS4gOS4quS6uuWxnuS6juWkmuS4qumDqOmXqCAjMzc5JyxcbiAgICB1cDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgY29sbGVjdGlvbiwgZTtcbiAgICAgIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDIgdXAnKTtcbiAgICAgIGNvbnNvbGUudGltZSgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgICB0cnkge1xuICAgICAgICBjb2xsZWN0aW9uID0gZGIuc3BhY2VfdXNlcnM7XG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgb3JnYW5pemF0aW9uczoge1xuICAgICAgICAgICAgJGV4aXN0czogZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmRpcmVjdC51cGRhdGUoc3UuX2lkLCB7XG4gICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBvcmdhbml6YXRpb25zOiBbc3Uub3JnYW5pemF0aW9uXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9zcGFjZV91c2VyJyk7XG4gICAgfSxcbiAgICBkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZygndmVyc2lvbiAyIGRvd24nKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxuICAgIE1pZ3JhdGlvbnMuYWRkXG4gICAgICAgIHZlcnNpb246IDNcbiAgICAgICAgbmFtZTogJ+e7mXNwYWNlX3VzZXJz6KGoZW1haWzlrZfmrrXotYvlgLwnXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICAgICAgdHJ5XG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbi5maW5kKHtlbWFpbDogeyRleGlzdHM6IGZhbHNlfX0sIHtmaWVsZHM6IHt1c2VyOiAxfX0pLmZvckVhY2ggKHN1KS0+XG4gICAgICAgICAgICAgICAgICAgIGlmIHN1LnVzZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHUgPSBkYi51c2Vycy5maW5kT25lKHtfaWQ6IHN1LnVzZXJ9LCB7ZmllbGRzOiB7ZW1haWxzOiAxfX0pXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiB1ICYmIHUuZW1haWxzICYmIHUuZW1haWxzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZHJlc3MgPSB1LmVtYWlsc1swXS5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHskc2V0OiB7ZW1haWw6IGFkZHJlc3N9fSlcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBjYXRjaCBlXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCAndXBncmFkZV9zcGFjZV91c2VyX2VtYWlsJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gMyBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogMyxcbiAgICBuYW1lOiAn57uZc3BhY2VfdXNlcnPooahlbWFpbOWtl+autei1i+WAvCcsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbGxlY3Rpb24sIGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiAzIHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ3VwZ3JhZGVfc3BhY2VfdXNlcl9lbWFpbCcpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbiA9IGRiLnNwYWNlX3VzZXJzO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIGZpZWxkczoge1xuICAgICAgICAgICAgdXNlcjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBhZGRyZXNzLCB1O1xuICAgICAgICAgIGlmIChzdS51c2VyKSB7XG4gICAgICAgICAgICB1ID0gZGIudXNlcnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgIF9pZDogc3UudXNlclxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICBlbWFpbHM6IDFcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodSAmJiB1LmVtYWlscyAmJiB1LmVtYWlscy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmICgvXihbQS1aMC05XFwuXFwtXFxfXFwrXSkqKFtBLVowLTlcXCtcXC1cXF9dKStcXEBbQS1aMC05XSsoW1xcLV1bQS1aMC05XSspKihbXFwuXVtBLVowLTlcXC1dKyl7MSw4fSQvaS50ZXN0KHUuZW1haWxzWzBdLmFkZHJlc3MpKSB7XG4gICAgICAgICAgICAgICAgYWRkcmVzcyA9IHUuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uZGlyZWN0LnVwZGF0ZShzdS5faWQsIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGFkZHJlc3NcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCd1cGdyYWRlX3NwYWNlX3VzZXJfZW1haWwnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDMgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgTWlncmF0aW9ucy5hZGRcbiAgICAgICAgdmVyc2lvbjogNFxuICAgICAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nXG4gICAgICAgIHVwOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCB1cCdcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSAndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nXG4gICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICBkYi5vcmdhbml6YXRpb25zLmRpcmVjdC51cGRhdGUoe3NvcnRfbm86IHskZXhpc3RzOiBmYWxzZX19LCB7JHNldDoge3NvcnRfbm86IDEwMH19LCB7bXVsdGk6IHRydWV9KVxuICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZVxuXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQgJ3VwZ3JhZGVfb3JnYW5pemF0aW9uc19zb3J0X25vJ1xuICAgICAgICBkb3duOiAtPlxuICAgICAgICAgICAgY29uc29sZS5sb2cgJ3ZlcnNpb24gNCBkb3duJ1xuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBNaWdyYXRpb25zLmFkZCh7XG4gICAgdmVyc2lvbjogNCxcbiAgICBuYW1lOiAn57uZb3JnYW5pemF0aW9uc+ihqOiuvue9rnNvcnRfbm8nLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNCB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCd1cGdyYWRlX29yZ2FuaXphdGlvbnNfc29ydF9ubycpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIub3JnYW5pemF0aW9ucy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICBzb3J0X25vOiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgIHNvcnRfbm86IDEwMFxuICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIG11bHRpOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgndXBncmFkZV9vcmdhbml6YXRpb25zX3NvcnRfbm8nKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDQgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG5cdE1pZ3JhdGlvbnMuYWRkXG5cdFx0dmVyc2lvbjogNVxuXHRcdG5hbWU6ICfop6PlhrPliKDpmaRvcmdhbml6YXRpb27lr7zoh7RzcGFjZV91c2Vy5pWw5o2u6ZSZ6K+v55qE6Zeu6aKYJ1xuXHRcdHVwOiAtPlxuXHRcdFx0Y29uc29sZS5sb2cgJ3ZlcnNpb24gNSB1cCdcblx0XHRcdGNvbnNvbGUudGltZSAnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucydcblx0XHRcdHRyeVxuXG5cdFx0XHRcdGRiLnNwYWNlX3VzZXJzLmZpbmQoKS5mb3JFYWNoIChzdSktPlxuXHRcdFx0XHRcdGlmIG5vdCBzdS5vcmdhbml6YXRpb25zXG5cdFx0XHRcdFx0XHRyZXR1cm5cblx0XHRcdFx0XHRpZiBzdS5vcmdhbml6YXRpb25zLmxlbmd0aCBpcyAxXG5cdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChzdS5vcmdhbml6YXRpb25zWzBdKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRpZiBjaGVja19jb3VudCBpcyAwXG5cdFx0XHRcdFx0XHRcdHJvb3Rfb3JnID0gZGIub3JnYW5pemF0aW9ucy5maW5kT25lKHtzcGFjZTogc3Uuc3BhY2UsIHBhcmVudDogbnVsbH0pXG5cdFx0XHRcdFx0XHRcdGlmIHJvb3Rfb3JnXG5cdFx0XHRcdFx0XHRcdFx0ciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe19pZDogc3UuX2lkfSwgeyRzZXQ6IHtvcmdhbml6YXRpb25zOiBbcm9vdF9vcmcuX2lkXSwgb3JnYW5pemF0aW9uOiByb290X29yZy5faWR9fSlcblx0XHRcdFx0XHRcdFx0XHRpZiByXG5cdFx0XHRcdFx0XHRcdFx0XHRyb290X29yZy51cGRhdGVVc2VycygpXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvciBzdS5faWRcblx0XHRcdFx0XHRlbHNlIGlmIHN1Lm9yZ2FuaXphdGlvbnMubGVuZ3RoID4gMVxuXHRcdFx0XHRcdFx0cmVtb3ZlZF9vcmdfaWRzID0gW11cblx0XHRcdFx0XHRcdHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaCAobyktPlxuXHRcdFx0XHRcdFx0XHRjaGVja19jb3VudCA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZChvKS5jb3VudCgpXG5cdFx0XHRcdFx0XHRcdGlmIGNoZWNrX2NvdW50IGlzIDBcblx0XHRcdFx0XHRcdFx0XHRyZW1vdmVkX29yZ19pZHMucHVzaChvKVxuXHRcdFx0XHRcdFx0aWYgcmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0bmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKVxuXHRcdFx0XHRcdFx0XHRpZiBuZXdfb3JnX2lkcy5pbmNsdWRlcyhzdS5vcmdhbml6YXRpb24pXG5cdFx0XHRcdFx0XHRcdFx0ZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7X2lkOiBzdS5faWR9LCB7JHNldDoge29yZ2FuaXphdGlvbnM6IG5ld19vcmdfaWRzfX0pXG5cdFx0XHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdFx0XHRkYi5zcGFjZV91c2Vycy5kaXJlY3QudXBkYXRlKHtfaWQ6IHN1Ll9pZH0sIHskc2V0OiB7b3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF19fSlcblxuXHRcdFx0Y2F0Y2ggZVxuXHRcdFx0XHRjb25zb2xlLmVycm9yIFwiZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9uc1wiXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjb25zb2xlLnRpbWVFbmQgJ2ZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnMnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDUgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDUsXG4gICAgbmFtZTogJ+ino+WGs+WIoOmZpG9yZ2FuaXphdGlvbuWvvOiHtHNwYWNlX3VzZXLmlbDmja7plJnor6/nmoTpl67popgnLFxuICAgIHVwOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlO1xuICAgICAgY29uc29sZS5sb2coJ3ZlcnNpb24gNSB1cCcpO1xuICAgICAgY29uc29sZS50aW1lKCdmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zJyk7XG4gICAgICB0cnkge1xuICAgICAgICBkYi5zcGFjZV91c2Vycy5maW5kKCkuZm9yRWFjaChmdW5jdGlvbihzdSkge1xuICAgICAgICAgIHZhciBjaGVja19jb3VudCwgbmV3X29yZ19pZHMsIHIsIHJlbW92ZWRfb3JnX2lkcywgcm9vdF9vcmc7XG4gICAgICAgICAgaWYgKCFzdS5vcmdhbml6YXRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzdS5vcmdhbml6YXRpb25zLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgY2hlY2tfY291bnQgPSBkYi5vcmdhbml6YXRpb25zLmZpbmQoc3Uub3JnYW5pemF0aW9uc1swXSkuY291bnQoKTtcbiAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICByb290X29yZyA9IGRiLm9yZ2FuaXphdGlvbnMuZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc3BhY2U6IHN1LnNwYWNlLFxuICAgICAgICAgICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgaWYgKHJvb3Rfb3JnKSB7XG4gICAgICAgICAgICAgICAgciA9IGRiLnNwYWNlX3VzZXJzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgICAgICAgICAgICAgX2lkOiBzdS5faWRcbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbnM6IFtyb290X29yZy5faWRdLFxuICAgICAgICAgICAgICAgICAgICBvcmdhbml6YXRpb246IHJvb3Rfb3JnLl9pZFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdF9vcmcudXBkYXRlVXNlcnMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImZpeF9zcGFjZV91c2VyX29yZ2FuaXphdGlvbnNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3UuX2lkKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoc3Uub3JnYW5pemF0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZW1vdmVkX29yZ19pZHMgPSBbXTtcbiAgICAgICAgICAgIHN1Lm9yZ2FuaXphdGlvbnMuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgICAgICAgIGNoZWNrX2NvdW50ID0gZGIub3JnYW5pemF0aW9ucy5maW5kKG8pLmNvdW50KCk7XG4gICAgICAgICAgICAgIGlmIChjaGVja19jb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkX29yZ19pZHMucHVzaChvKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVtb3ZlZF9vcmdfaWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgbmV3X29yZ19pZHMgPSBfLmRpZmZlcmVuY2Uoc3Uub3JnYW5pemF0aW9ucywgcmVtb3ZlZF9vcmdfaWRzKTtcbiAgICAgICAgICAgICAgaWYgKG5ld19vcmdfaWRzLmluY2x1ZGVzKHN1Lm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHNcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGIuc3BhY2VfdXNlcnMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICBfaWQ6IHN1Ll9pZFxuICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgb3JnYW5pemF0aW9uczogbmV3X29yZ19pZHMsXG4gICAgICAgICAgICAgICAgICAgIG9yZ2FuaXphdGlvbjogbmV3X29yZ19pZHNbMF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJmaXhfc3BhY2VfdXNlcl9vcmdhbml6YXRpb25zXCIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnNvbGUudGltZUVuZCgnZml4X3NwYWNlX3VzZXJfb3JnYW5pemF0aW9ucycpO1xuICAgIH0sXG4gICAgZG93bjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3ZlcnNpb24gNSBkb3duJyk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cblx0TWlncmF0aW9ucy5hZGRcblx0XHR2ZXJzaW9uOiA2XG5cdFx0bmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pydcblx0XHR1cDogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgdXAnXG5cdFx0XHRjb25zb2xlLnRpbWUgJ2JpbGxpbmcgdXBncmFkZSdcblx0XHRcdHRyeVxuXHRcdFx0XHQjIOa4heepum1vZHVsZXPooahcblx0XHRcdFx0ZGIubW9kdWxlcy5yZW1vdmUoe30pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBTdGFuZGFyZFwiLFxuXHRcdFx0XHRcdFwibmFtZVwiOiBcIndvcmtmbG93LnN0YW5kYXJkXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5Z+656GA54mIXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMS4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAyXG5cdFx0XHRcdH0pXG5cblx0XHRcdFx0ZGIubW9kdWxlcy5pbnNlcnQoe1xuXHRcdFx0XHRcdFwiX2lkXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX2VuXCI6IFwiV29ya2Zsb3cgUHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cucHJvZmVzc2lvbmFsXCIsXG5cdFx0XHRcdFx0XCJuYW1lX3poXCI6IFwi5a6h5om5546L5LiT5Lia54mI5omp5bGV5YyFXCIsXG5cdFx0XHRcdFx0XCJsaXN0cHJpY2VcIjogMy4wLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlX3JtYlwiOiAxOFxuXHRcdFx0XHR9KVxuXG5cdFx0XHRcdGRiLm1vZHVsZXMuaW5zZXJ0KHtcblx0XHRcdFx0XHRcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcblx0XHRcdFx0XHRcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG5cdFx0XHRcdFx0XCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuXHRcdFx0XHRcdFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuXHRcdFx0XHRcdFwibGlzdHByaWNlXCI6IDYuMCxcblx0XHRcdFx0XHRcImxpc3RwcmljZV9ybWJcIjogNDBcblx0XHRcdFx0fSlcblxuXG5cdFx0XHRcdHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpXG5cdFx0XHRcdGRiLnNwYWNlcy5maW5kKHtpc19wYWlkOiB0cnVlLCB1c2VyX2xpbWl0OiB7JGV4aXN0czogZmFsc2V9LCBtb2R1bGVzOiB7JGV4aXN0czogdHJ1ZX19KS5mb3JFYWNoIChzKS0+XG5cdFx0XHRcdFx0dHJ5XG5cdFx0XHRcdFx0XHRzZXRfb2JqID0ge31cblx0XHRcdFx0XHRcdHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtzcGFjZTogcy5faWQsIHVzZXJfYWNjZXB0ZWQ6IHRydWV9KS5jb3VudCgpXG5cdFx0XHRcdFx0XHRzZXRfb2JqLnVzZXJfbGltaXQgPSB1c2VyX2NvdW50XG5cdFx0XHRcdFx0XHRiYWxhbmNlID0gcy5iYWxhbmNlXG5cdFx0XHRcdFx0XHRpZiBiYWxhbmNlID4gMFxuXHRcdFx0XHRcdFx0XHRtb250aHMgPSAwXG5cdFx0XHRcdFx0XHRcdGxpc3RwcmljZXMgPSAwXG5cdFx0XHRcdFx0XHRcdF8uZWFjaCBzLm1vZHVsZXMsIChwbSktPlxuXHRcdFx0XHRcdFx0XHRcdG1vZHVsZSA9IGRiLm1vZHVsZXMuZmluZE9uZSh7bmFtZTogcG19KVxuXHRcdFx0XHRcdFx0XHRcdGlmIG1vZHVsZSBhbmQgbW9kdWxlLmxpc3RwcmljZVxuXHRcdFx0XHRcdFx0XHRcdFx0bGlzdHByaWNlcyArPSBtb2R1bGUubGlzdHByaWNlXG5cdFx0XHRcdFx0XHRcdG1vbnRocyA9IHBhcnNlSW50KChiYWxhbmNlLyhsaXN0cHJpY2VzKnVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlXG5cdFx0XHRcdFx0XHRcdGVuZF9kYXRlLnNldE1vbnRoKGVuZF9kYXRlLmdldE1vbnRoKCkrbW9udGhzKVxuXHRcdFx0XHRcdFx0XHRlbmRfZGF0ZSA9IG5ldyBEYXRlKG1vbWVudChlbmRfZGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSlcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gZW5kX2RhdGVcblxuXHRcdFx0XHRcdFx0ZWxzZSBpZiBiYWxhbmNlIDw9IDBcblx0XHRcdFx0XHRcdFx0c2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZVxuXHRcdFx0XHRcdFx0XHRzZXRfb2JqLmVuZF9kYXRlID0gbmV3IERhdGVcblxuXHRcdFx0XHRcdFx0cy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKVxuXHRcdFx0XHRcdFx0c2V0X29iai5tb2R1bGVzID0gXy51bmlxKHMubW9kdWxlcylcblx0XHRcdFx0XHRcdGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtfaWQ6IHMuX2lkfSwgeyRzZXQ6IHNldF9vYmp9KVxuXHRcdFx0XHRcdGNhdGNoIGVcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHNwYWNlIHVwZ3JhZGVcIlxuXHRcdFx0XHRcdFx0Y29uc29sZS5lcnJvcihzLl9pZClcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3Ioc2V0X29iailcblx0XHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IgZS5zdGFja1xuXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IgXCJiaWxsaW5nIHVwZ3JhZGVcIlxuXHRcdFx0XHRjb25zb2xlLmVycm9yIGUuc3RhY2tcblxuXHRcdFx0Y29uc29sZS50aW1lRW5kICdiaWxsaW5nIHVwZ3JhZGUnXG5cdFx0ZG93bjogLT5cblx0XHRcdGNvbnNvbGUubG9nICd2ZXJzaW9uIDYgZG93bidcbiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gTWlncmF0aW9ucy5hZGQoe1xuICAgIHZlcnNpb246IDYsXG4gICAgbmFtZTogJ+i0ouWKoeezu+e7n+WNh+e6pycsXG4gICAgdXA6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGUsIHN0YXJ0X2RhdGU7XG4gICAgICBjb25zb2xlLmxvZygndmVyc2lvbiA2IHVwJyk7XG4gICAgICBjb25zb2xlLnRpbWUoJ2JpbGxpbmcgdXBncmFkZScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGIubW9kdWxlcy5yZW1vdmUoe30pO1xuICAgICAgICBkYi5tb2R1bGVzLmluc2VydCh7XG4gICAgICAgICAgXCJfaWRcIjogXCJ3b3JrZmxvdy5zdGFuZGFyZFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFN0YW5kYXJkXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuc3RhbmRhcmRcIixcbiAgICAgICAgICBcIm5hbWVfemhcIjogXCLlrqHmibnnjovln7rnoYDniYhcIixcbiAgICAgICAgICBcImxpc3RwcmljZVwiOiAxLjAsXG4gICAgICAgICAgXCJsaXN0cHJpY2Vfcm1iXCI6IDJcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV9lblwiOiBcIldvcmtmbG93IFByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIndvcmtmbG93LnByb2Zlc3Npb25hbFwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S4k+S4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDMuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogMThcbiAgICAgICAgfSk7XG4gICAgICAgIGRiLm1vZHVsZXMuaW5zZXJ0KHtcbiAgICAgICAgICBcIl9pZFwiOiBcIndvcmtmbG93LmVudGVycHJpc2VcIixcbiAgICAgICAgICBcIm5hbWVfZW5cIjogXCJXb3JrZmxvdyBFbnRlcnByaXNlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwid29ya2Zsb3cuZW50ZXJwcmlzZVwiLFxuICAgICAgICAgIFwibmFtZV96aFwiOiBcIuWuoeaJueeOi+S8geS4mueJiOaJqeWxleWMhVwiLFxuICAgICAgICAgIFwibGlzdHByaWNlXCI6IDYuMCxcbiAgICAgICAgICBcImxpc3RwcmljZV9ybWJcIjogNDBcbiAgICAgICAgfSk7XG4gICAgICAgIHN0YXJ0X2RhdGUgPSBuZXcgRGF0ZShtb21lbnQobmV3IERhdGUpLmZvcm1hdChcIllZWVktTU0tRERcIikpO1xuICAgICAgICBkYi5zcGFjZXMuZmluZCh7XG4gICAgICAgICAgaXNfcGFpZDogdHJ1ZSxcbiAgICAgICAgICB1c2VyX2xpbWl0OiB7XG4gICAgICAgICAgICAkZXhpc3RzOiBmYWxzZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgbW9kdWxlczoge1xuICAgICAgICAgICAgJGV4aXN0czogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSkuZm9yRWFjaChmdW5jdGlvbihzKSB7XG4gICAgICAgICAgdmFyIGJhbGFuY2UsIGUsIGVuZF9kYXRlLCBsaXN0cHJpY2VzLCBtb250aHMsIHNldF9vYmosIHVzZXJfY291bnQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNldF9vYmogPSB7fTtcbiAgICAgICAgICAgIHVzZXJfY291bnQgPSBkYi5zcGFjZV91c2Vycy5maW5kKHtcbiAgICAgICAgICAgICAgc3BhY2U6IHMuX2lkLFxuICAgICAgICAgICAgICB1c2VyX2FjY2VwdGVkOiB0cnVlXG4gICAgICAgICAgICB9KS5jb3VudCgpO1xuICAgICAgICAgICAgc2V0X29iai51c2VyX2xpbWl0ID0gdXNlcl9jb3VudDtcbiAgICAgICAgICAgIGJhbGFuY2UgPSBzLmJhbGFuY2U7XG4gICAgICAgICAgICBpZiAoYmFsYW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgbW9udGhzID0gMDtcbiAgICAgICAgICAgICAgbGlzdHByaWNlcyA9IDA7XG4gICAgICAgICAgICAgIF8uZWFjaChzLm1vZHVsZXMsIGZ1bmN0aW9uKHBtKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZTtcbiAgICAgICAgICAgICAgICBtb2R1bGUgPSBkYi5tb2R1bGVzLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgICAgbmFtZTogcG1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAobW9kdWxlICYmIG1vZHVsZS5saXN0cHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsaXN0cHJpY2VzICs9IG1vZHVsZS5saXN0cHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgbW9udGhzID0gcGFyc2VJbnQoKGJhbGFuY2UgLyAobGlzdHByaWNlcyAqIHVzZXJfY291bnQpKS50b0ZpeGVkKCkpICsgMTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgICAgICAgZW5kX2RhdGUuc2V0TW9udGgoZW5kX2RhdGUuZ2V0TW9udGgoKSArIG1vbnRocyk7XG4gICAgICAgICAgICAgIGVuZF9kYXRlID0gbmV3IERhdGUobW9tZW50KGVuZF9kYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREXCIpKTtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IGVuZF9kYXRlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChiYWxhbmNlIDw9IDApIHtcbiAgICAgICAgICAgICAgc2V0X29iai5zdGFydF9kYXRlID0gc3RhcnRfZGF0ZTtcbiAgICAgICAgICAgICAgc2V0X29iai5lbmRfZGF0ZSA9IG5ldyBEYXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcy5tb2R1bGVzLnB1c2goXCJ3b3JrZmxvdy5zdGFuZGFyZFwiKTtcbiAgICAgICAgICAgIHNldF9vYmoubW9kdWxlcyA9IF8udW5pcShzLm1vZHVsZXMpO1xuICAgICAgICAgICAgcmV0dXJuIGRiLnNwYWNlcy5kaXJlY3QudXBkYXRlKHtcbiAgICAgICAgICAgICAgX2lkOiBzLl9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAkc2V0OiBzZXRfb2JqXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImJpbGxpbmcgc3BhY2UgdXBncmFkZVwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3Iocy5faWQpO1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihzZXRfb2JqKTtcbiAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGUuc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJiaWxsaW5nIHVwZ3JhZGVcIik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29uc29sZS50aW1lRW5kKCdiaWxsaW5nIHVwZ3JhZGUnKTtcbiAgICB9LFxuICAgIGRvd246IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd2ZXJzaW9uIDYgZG93bicpO1xuICAgIH1cbiAgfSk7XG59KTtcbiIsIk1ldGVvci5zdGFydHVwICgpLT5cbiAgICByb290VVJMID0gTWV0ZW9yLmFic29sdXRlVXJsKClcbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlc1xuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzID0ge1xuICAgICAgICAgICAgXCJjcmVhdG9yXCI6IHtcbiAgICAgICAgICAgICAgICBcInVybFwiOiByb290VVJMXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIGlmICFNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3JcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yID0ge1xuICAgICAgICAgICAgXCJ1cmxcIjogcm9vdFVSTFxuICAgICAgICB9XG5cbiAgICBpZiAhTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybFxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MucHVibGljLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsID0gcm9vdFVSTCIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICB2YXIgcm9vdFVSTDtcbiAgcm9vdFVSTCA9IE1ldGVvci5hYnNvbHV0ZVVybCgpO1xuICBpZiAoIU1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcykge1xuICAgIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcyA9IHtcbiAgICAgIFwiY3JlYXRvclwiOiB7XG4gICAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICAgIH1cbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IpIHtcbiAgICBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0ud2Vic2VydmljZXMuY3JlYXRvciA9IHtcbiAgICAgIFwidXJsXCI6IHJvb3RVUkxcbiAgICB9O1xuICB9XG4gIGlmICghTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLndlYnNlcnZpY2VzLmNyZWF0b3IudXJsKSB7XG4gICAgcmV0dXJuIE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS53ZWJzZXJ2aWNlcy5jcmVhdG9yLnVybCA9IHJvb3RVUkw7XG4gIH1cbn0pO1xuIiwiaWYocHJvY2Vzcy5lbnYuQ1JFQVRPUl9OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnKXtcblx0Ly9NZXRlb3Ig54mI5pys5Y2H57qn5YiwMS45IOWPiuS7peS4iuaXtihub2RlIOeJiOacrCAxMSsp77yM5Y+v5Lul5Yig6Zmk5q2k5Luj56CBXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsICdmbGF0Jywge1xuXHRcdHZhbHVlOiBmdW5jdGlvbihkZXB0aCA9IDEpIHtcblx0XHRcdHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAoZmxhdCwgdG9GbGF0dGVuKSB7XG5cdFx0XHRcdHJldHVybiBmbGF0LmNvbmNhdCgoQXJyYXkuaXNBcnJheSh0b0ZsYXR0ZW4pICYmIChkZXB0aD4xKSkgPyB0b0ZsYXR0ZW4uZmxhdChkZXB0aC0xKSA6IHRvRmxhdHRlbik7XG5cdFx0XHR9LCBbXSk7XG5cdFx0fVxuXHR9KTtcbn0iLCJNZXRlb3Iuc3RhcnR1cCAoKS0+XG5cdG5ldyBUYWJ1bGFyLlRhYmxlXG5cdFx0bmFtZTogXCJjdXN0b21pemVfYXBwc1wiLFxuXHRcdGNvbGxlY3Rpb246IGRiLmFwcHMsXG5cdFx0Y29sdW1uczogW1xuXHRcdFx0e1xuXHRcdFx0XHRkYXRhOiBcIm5hbWVcIlxuXHRcdFx0XHRvcmRlcmFibGU6IGZhbHNlXG5cdFx0XHR9XG5cdFx0XVxuXHRcdGRvbTogXCJ0cFwiXG5cdFx0ZXh0cmFGaWVsZHM6IFtcIl9pZFwiLCBcInNwYWNlXCJdXG5cdFx0bGVuZ3RoQ2hhbmdlOiBmYWxzZVxuXHRcdG9yZGVyaW5nOiBmYWxzZVxuXHRcdHBhZ2VMZW5ndGg6IDEwXG5cdFx0aW5mbzogZmFsc2Vcblx0XHRzZWFyY2hpbmc6IHRydWVcblx0XHRhdXRvV2lkdGg6IHRydWVcblx0XHRjaGFuZ2VTZWxlY3RvcjogKHNlbGVjdG9yLCB1c2VySWQpIC0+XG5cdFx0XHR1bmxlc3MgdXNlcklkXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHNwYWNlID0gc2VsZWN0b3Iuc3BhY2Vcblx0XHRcdHVubGVzcyBzcGFjZVxuXHRcdFx0XHRpZiBzZWxlY3Rvcj8uJGFuZD8ubGVuZ3RoID4gMFxuXHRcdFx0XHRcdHNwYWNlID0gc2VsZWN0b3IuJGFuZC5nZXRQcm9wZXJ0eSgnc3BhY2UnKVswXVxuXHRcdFx0dW5sZXNzIHNwYWNlXG5cdFx0XHRcdHJldHVybiB7X2lkOiAtMX1cblx0XHRcdHJldHVybiBzZWxlY3RvciIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRhYnVsYXIuVGFibGUoe1xuICAgIG5hbWU6IFwiY3VzdG9taXplX2FwcHNcIixcbiAgICBjb2xsZWN0aW9uOiBkYi5hcHBzLFxuICAgIGNvbHVtbnM6IFtcbiAgICAgIHtcbiAgICAgICAgZGF0YTogXCJuYW1lXCIsXG4gICAgICAgIG9yZGVyYWJsZTogZmFsc2VcbiAgICAgIH1cbiAgICBdLFxuICAgIGRvbTogXCJ0cFwiLFxuICAgIGV4dHJhRmllbGRzOiBbXCJfaWRcIiwgXCJzcGFjZVwiXSxcbiAgICBsZW5ndGhDaGFuZ2U6IGZhbHNlLFxuICAgIG9yZGVyaW5nOiBmYWxzZSxcbiAgICBwYWdlTGVuZ3RoOiAxMCxcbiAgICBpbmZvOiBmYWxzZSxcbiAgICBzZWFyY2hpbmc6IHRydWUsXG4gICAgYXV0b1dpZHRoOiB0cnVlLFxuICAgIGNoYW5nZVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3RvciwgdXNlcklkKSB7XG4gICAgICB2YXIgcmVmLCBzcGFjZTtcbiAgICAgIGlmICghdXNlcklkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgX2lkOiAtMVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgc3BhY2UgPSBzZWxlY3Rvci5zcGFjZTtcbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgaWYgKChzZWxlY3RvciAhPSBudWxsID8gKHJlZiA9IHNlbGVjdG9yLiRhbmQpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgICBzcGFjZSA9IHNlbGVjdG9yLiRhbmQuZ2V0UHJvcGVydHkoJ3NwYWNlJylbMF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBfaWQ6IC0xXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gc2VsZWN0b3I7XG4gICAgfVxuICB9KTtcbn0pO1xuIl19
