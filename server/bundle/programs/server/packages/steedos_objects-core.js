(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var moment = Package['momentjs:moment'].moment;
var TAPi18next = Package['tap:i18n'].TAPi18next;
var TAPi18n = Package['tap:i18n'].TAPi18n;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects-core":{"i18n.coffee":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_objects-core/i18n.coffee                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var i18n = void 0;
module.watch(require("meteor/universe:i18n"), {
  "default": function (v) {
    i18n = v;
  }
}, 0);
var I18n, absoluteUrl, getBrowserLocale;
I18n = require('@steedos/i18n');
this.i18n = i18n;
this.t = I18n.t;
this.tr = t;
this.trl = t;

absoluteUrl = function (url) {
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
      } catch (error) {
        e = error;
        return Meteor.absoluteUrl(url);
      }
    } else {
      return Meteor.absoluteUrl(url);
    }
  }
};

i18n.setOptions({
  purify: null,
  defaultLocale: 'zh-CN',
  hostUrl: absoluteUrl()
});

if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
  TAPi18n.__original = TAPi18n.__;

  TAPi18n.__ = function (key, options, locale) {
    var translated;
    translated = t(key, options, locale);

    if (translated !== key) {
      return translated;
    }

    return TAPi18n.__original(key, options, locale);
  };

  TAPi18n._getLanguageFilePath = function (lang_tag) {
    var path;
    path = this.conf.cdn_path != null ? this.conf.cdn_path : this.conf.i18n_files_route;
    path = path.replace(/\/$/, "");

    if (path[0] === "/") {
      path = absoluteUrl().replace(/\/+$/, "") + path;
    }

    return path + "/" + lang_tag + ".json";
  };
}

if (Meteor.isClient) {
  getBrowserLocale = function () {
    var l, locale;
    l = window.navigator.userLanguage || window.navigator.language || 'en';

    if (l.indexOf("zh") >= 0) {
      locale = "zh-cn";
    } else {
      locale = "en-us";
    }

    return locale;
  };

  SimpleSchema.prototype.i18n = function (prefix) {};

  Template.registerHelper('_', function (key, args) {
    return TAPi18n.__(key, args);
  });
  Meteor.startup(function () {
    var userLastLocale;
    Template.registerHelper('_', function (key, args) {
      return TAPi18n.__(key, args);
    });
    Session.set("steedos-locale", getBrowserLocale());
    Tracker.autorun(function () {
      if (Session.get("steedos-locale") !== "en-us") {
        if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
          TAPi18n.setLanguage("zh-CN");
        }

        I18n.changeLanguage("zh-CN", {
          rootUrl: Steedos.absoluteUrl()
        });
        i18n.setLocale("zh-CN");
        moment.locale("zh-cn");
        return require("moment").locale("zh-cn");
      } else {
        if (typeof TAPi18n !== "undefined" && TAPi18n !== null) {
          TAPi18n.setLanguage("en");
        }

        I18n.changeLanguage("en", {
          rootUrl: Steedos.absoluteUrl()
        });
        i18n.setLocale("en");
        moment.locale("en");
        return require("moment").locale("en");
      }
    });
    userLastLocale = null;
    Tracker.autorun(function () {
      Session.set("steedos-locale", "zh-CN");
      return userLastLocale = Meteor.user() ? Meteor.user().locale ? (Session.set("steedos-locale", Meteor.user().locale), userLastLocale && userLastLocale !== Meteor.user().locale ? window.location.reload(true) : void 0, userLastLocale = Meteor.user().locale) : void 0 : void 0;
    });
    return i18n.onChangeLocale(function (newLocale) {
      $.extend(true, $.fn.dataTable.defaults, {
        language: {
          "decimal": t("dataTables.decimal"),
          "emptyTable": t("dataTables.emptyTable"),
          "info": t("dataTables.info"),
          "infoEmpty": t("dataTables.infoEmpty"),
          "infoFiltered": t("dataTables.infoFiltered"),
          "infoPostFix": t("dataTables.infoPostFix"),
          "thousands": t("dataTables.thousands"),
          "lengthMenu": t("dataTables.lengthMenu"),
          "loadingRecords": t("dataTables.loadingRecords"),
          "processing": t("dataTables.processing"),
          "search": t("dataTables.search"),
          "zeroRecords": t("dataTables.zeroRecords"),
          "paginate": {
            "first": t("dataTables.paginate.first"),
            "last": t("dataTables.paginate.last"),
            "next": t("dataTables.paginate.next"),
            "previous": t("dataTables.paginate.previous")
          },
          "aria": {
            "sortAscending": t("dataTables.aria.sortAscending"),
            "sortDescending": t("dataTables.aria.sortDescending")
          }
        }
      });
      return _.each(Tabular.tablesByName, function (table) {
        return _.each(table.options.columns, function (column) {
          if (!column.data || column.data === "_id") {
            return;
          }

          column.sTitle = t("" + table.collection._name + "_" + column.data.replace(/\./g, "_"));

          if (!table.options.language) {
            table.options.language = {};
          }

          table.options.language.zeroRecords = t("dataTables.zero") + t(table.collection._name);
        });
      });
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs":{"cfs.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_objects-core/cfs/cfs.coffee                                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
this.cfs = {};
Meteor.startup(function () {
  return FS.HTTP.setBaseUrl("/api");
});

cfs.getContentType = function (filename) {
  var _exp;

  _exp = filename.split('.').pop().toLowerCase();

  if ('.' + _exp === '.au') {
    return 'audio/basic';
  } else if ('.' + _exp === '.avi') {
    return 'video/x-msvideo';
  } else if ('.' + _exp === '.bmp') {
    return 'image/bmp';
  } else if ('.' + _exp === '.bz2') {
    return 'application/x-bzip2';
  } else if ('.' + _exp === '.css') {
    return 'text/css';
  } else if ('.' + _exp === '.dtd') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.doc') {
    return 'application/msword';
  } else if ('.' + _exp === '.docx') {
    return 'application/msword';
  } else if ('.' + _exp === '.dotx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.es') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.exe') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.gif') {
    return 'image/gif';
  } else if ('.' + _exp === '.gz') {
    return 'application/x-gzip';
  } else if ('.' + _exp === '.hqx') {
    return 'application/mac-binhex40';
  } else if ('.' + _exp === '.html') {
    return 'text/html';
  } else if ('.' + _exp === '.jar') {
    return 'application/x-java-archive';
  } else if ('.' + _exp === '.jpg' || '.' + _exp === '.jpeg') {
    return 'image/jpeg';
  } else if ('.' + _exp === '.js') {
    return 'application/x-javascript';
  } else if ('.' + _exp === '.jsp') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.midi') {
    return 'audio/midi';
  } else if ('.' + _exp === '.mp3') {
    return 'audio/mpeg';
  } else if ('.' + _exp === '.mpeg') {
    return 'video/mpeg';
  } else if ('.' + _exp === '.ogg') {
    return 'application/ogg';
  } else if ('.' + _exp === '.pdf') {
    return 'application/pdf';
  } else if ('.' + _exp === '.pl') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.png') {
    return 'image/png';
  } else if ('.' + _exp === '.potx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.ppsx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.ppt') {
    return 'application/vnd.ms-powerpoint';
  } else if ('.' + _exp === '.pptx') {
    return 'application/vnd.ms-powerpoint';
  } else if ('.' + _exp === '.ps') {
    return 'application/postscript';
  } else if ('.' + _exp === '.qt') {
    return 'video/quicktime';
  } else if ('.' + _exp === '.ra') {
    return 'audio/x-pn-realaudio';
  } else if ('.' + _exp === '.ram') {
    return 'audio/x-pn-realaudio';
  } else if ('.' + _exp === '.rdf') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.rtf') {
    return 'text/rtf';
  } else if ('.' + _exp === '.sgml') {
    return 'text/sgml';
  } else if ('.' + _exp === '.sit') {
    return 'application/x-stuffit';
  } else if ('.' + _exp === '.sldx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.svg') {
    return 'image/svg+xml';
  } else if ('.' + _exp === '.swf') {
    return 'application/x-shockwave-flash';
  } else if ('.' + _exp === '.tar.gz') {
    return 'application/x-gzip';
  } else if ('.' + _exp === '.tgz') {
    return 'application/x-compressed';
  } else if ('.' + _exp === '.tiff') {
    return 'image/tiff';
  } else if ('.' + _exp === '.tsv') {
    return 'text/tab-separated-values';
  } else if ('.' + _exp === '.txt') {
    return 'text/plain';
  } else if ('.' + _exp === '.wav') {
    return 'audio/x-wav';
  } else if ('.' + _exp === '.xlam') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xls') {
    return 'application/vnd.ms-excel';
  } else if ('.' + _exp === '.xlsb') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xlsx') {
    return 'application/vnd.ms-excel';
  } else if ('.' + _exp === '.xltx') {
    return 'application/octet-stream';
  } else if ('.' + _exp === '.xml') {
    return 'text/xml';
  } else if ('.' + _exp === '.zip') {
    return 'application/zip';
  } else {
    return 'application/octet-stream';
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs_fix.coffee":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_objects-core/cfs/cfs_fix.coffee                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
FS.StorageAdapter.prototype.on('error', function (storeName, error, fileObj) {
  console.error("FS.StorageAdapter emit error");
  console.error(error);
  console.error(fileObj);
  return console.error(storeName);
});
FS.Collection.prototype.on('error', function (error, fileObj, storeName) {
  console.error("FS.Collection emit error");
  console.error(error);
  console.error(fileObj);
  return console.error(storeName);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stores.coffee":function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_objects-core/cfs/stores.coffee                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var stores;
stores = ['avatars', 'audios', 'images', 'videos', 'files'];

_.each(stores, function (store_name) {
  file_store;
  var file_store, ref, ref1;

  if (((ref = Meteor.settings["public"].cfs) != null ? ref.store : void 0) === "OSS") {
    if (Meteor.isClient) {
      file_store = new FS.Store.OSS(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.OSS(store_name, Meteor.settings.cfs.aliyun);
    }
  } else if (((ref1 = Meteor.settings["public"].cfs) != null ? ref1.store : void 0) === "S3") {
    if (Meteor.isClient) {
      file_store = new FS.Store.S3(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.S3(store_name, Meteor.settings.cfs.aws);
    }
  } else {
    if (Meteor.isClient) {
      file_store = new FS.Store.FileSystem(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.FileSystem(store_name, {
        path: require('path').join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name),
        fileKeyMaker: function (fileObj) {
          var absolutePath, filename, filenameInStore, mkdirp, month, now, path, pathname, store, year;
          store = fileObj && fileObj._getInfo(store_name);

          if (store && store.key) {
            return store.key;
          }

          filename = fileObj.name();
          filenameInStore = fileObj.name({
            store: store_name
          });
          now = new Date();
          year = now.getFullYear();
          month = now.getMonth() + 1;
          path = require('path');
          mkdirp = require('mkdirp');
          pathname = path.join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name + "/" + year + '/' + month);
          absolutePath = path.resolve(pathname);
          mkdirp.sync(absolutePath);
          return year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename);
        }
      });
    }
  }

  if (store_name === 'audios') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['audio/*']
        }
      }
    });
  } else if (store_name === 'images' || store_name === 'avatars') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['image/*']
        }
      }
    });
  } else if (store_name === 'videos') {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store],
      filter: {
        allow: {
          contentTypes: ['video/*']
        }
      }
    });
  } else {
    cfs[store_name] = new FS.Collection(store_name, {
      stores: [file_store]
    });
  }

  cfs[store_name].allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    },
    remove: function () {
      return true;
    },
    download: function () {
      return true;
    }
  });

  if (store_name === 'avatars') {
    db[store_name] = cfs[store_name];
    db[store_name].files.before.insert(function (userId, doc) {
      return doc.userId = userId;
    });
  }

  if (store_name === 'files') {
    return db["cfs." + store_name + ".filerecord"] = cfs[store_name].files;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:objects-core/i18n.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/cfs.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/cfs_fix.coffee");
require("/node_modules/meteor/steedos:objects-core/cfs/stores.coffee");

/* Exports */
Package._define("steedos:objects-core");

})();

//# sourceURL=meteor://💻app/packages/steedos_objects-core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJJMThuIiwiYWJzb2x1dGVVcmwiLCJnZXRCcm93c2VyTG9jYWxlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWtkaXJwIiwibW9udGgiLCJub3ciLCJ5ZWFyIiwiX2dldEluZm8iLCJuYW1lIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkb3dubG9hZCIsImRiIiwiZmlsZXMiLCJiZWZvcmUiLCJ1c2VySWQiLCJkb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGFBQUE7QUFBQUMsT0FBQUMsS0FBQSxDQUFBQyxRQUFBO0FBQUEsdUJBQUFDLENBQUE7QUFBQUosV0FBQUksQ0FBQTtBQUFBO0FBQUE7QUFBQSxJQUFBQyxJQUFBLEVBQUFDLFdBQUEsRUFBQUMsZ0JBQUE7QUFDQUYsT0FBT0YsUUFBUSxlQUFSLENBQVA7QUFDQSxLQUFDSCxJQUFELEdBQVFBLElBQVI7QUFFQSxLQUFDUSxDQUFELEdBQUtILEtBQUtHLENBQVY7QUFFQSxLQUFDQyxFQUFELEdBQU1ELENBQU47QUFFQSxLQUFDRSxHQUFELEdBQU9GLENBQVA7O0FBRUFGLGNBQWMsVUFBQ0ssR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNLQzs7QURKRixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0FBUDtBQUREO0FBR0MsUUFBR0ksT0FBT0UsUUFBVjtBQUNDO0FBQ0NKLG1CQUFXLElBQUlLLEdBQUosQ0FBUUgsT0FBT1QsV0FBUCxFQUFSLENBQVg7O0FBQ0EsWUFBR0ssR0FBSDtBQUNDLGlCQUFPRSxTQUFTTSxRQUFULEdBQW9CUixHQUEzQjtBQUREO0FBR0MsaUJBQU9FLFNBQVNNLFFBQWhCO0FBTEY7QUFBQSxlQUFBQyxLQUFBO0FBTU1SLFlBQUFRLEtBQUE7QUFDTCxlQUFPTCxPQUFPVCxXQUFQLENBQW1CSyxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ2tCSSxhRFJISSxPQUFPVCxXQUFQLENBQW1CSyxHQUFuQixDQ1FHO0FE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QWtCLElBQUloQixHQUFHYyxVQUFQLENBQWtCRSxVQUFsQixFQUNkO0FBQUFELGNBQVEsQ0FBQ0UsVUFBRDtBQUFSLEtBRGMsQ0FBbEI7QUNLTDs7QURGQ2xCLE1BQUlpQixVQUFKLEVBQWdCa0MsS0FBaEIsQ0FDSTtBQUFBRSxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBREo7QUFFQUMsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQUhKO0FBSUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFMSjtBQU1BQyxjQUFVO0FBQ04sYUFBTyxJQUFQO0FBUEo7QUFBQSxHQURKOztBQVVBLE1BQUd2QyxlQUFjLFNBQWpCO0FBQ0l3QyxPQUFHeEMsVUFBSCxJQUFpQmpCLElBQUlpQixVQUFKLENBQWpCO0FBQ0F3QyxPQUFHeEMsVUFBSCxFQUFleUMsS0FBZixDQUFxQkMsTUFBckIsQ0FBNEJOLE1BQTVCLENBQW1DLFVBQUNPLE1BQUQsRUFBU0MsR0FBVDtBQ1FyQyxhRFBNQSxJQUFJRCxNQUFKLEdBQWFBLE1DT25CO0FEUkU7QUNVTDs7QURQQyxNQUFHM0MsZUFBYyxPQUFqQjtBQ1NBLFdEUkl3QyxHQUFHLFNBQU94QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDakIsSUFBSWlCLFVBQUosRUFBZ0J5QyxLQ1F6RDtBQUNEO0FEcEdILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xyXG5JMThuID0gcmVxdWlyZSgnQHN0ZWVkb3MvaTE4bicpO1xyXG5AaTE4biA9IGkxOG47XHJcblxyXG5AdCA9IEkxOG4udFxyXG5cclxuQHRyID0gdFxyXG5cclxuQHRybCA9IHRcclxuXHJcbmFic29sdXRlVXJsID0gKHVybCktPlxyXG5cdGlmIHVybFxyXG5cdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcclxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRlbHNlXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxyXG5cdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHRcdGVsc2VcclxuXHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuIyDph43lhpl0YXA6aTE4buWHveaVsO+8jOWQkeWQjuWFvOWuuVxyXG5pMThuLnNldE9wdGlvbnNcclxuXHRwdXJpZnk6IG51bGxcclxuXHRkZWZhdWx0TG9jYWxlOiAnemgtQ04nXHJcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxyXG5cclxuaWYgVEFQaTE4bj9cclxuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXHJcblxyXG5cdFRBUGkxOG4uX18gPSAoa2V5LCBvcHRpb25zLCBsb2NhbGUpLT5cclxuXHRcdHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcclxuXHRcdGlmIHRyYW5zbGF0ZWQgIT0ga2V5XHJcblx0XHRcdHJldHVybiB0cmFuc2xhdGVkXHJcblxyXG5cdFx0IyBpMThuIOe/u+ivkeS4jeWHuuadpe+8jOWwneivleeUqCB0YXA6aTE4biDnv7vor5EgVE9ETyByZW1vdmVcclxuXHRcdHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwga2V5LCBvcHRpb25zLCBsb2NhbGVcclxuXHJcblx0VEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IChsYW5nX3RhZykgLT5cclxuXHJcblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlIC9cXC8kLywgXCJcIlxyXG5cdFx0aWYgcGF0aFswXSA9PSBcIi9cIlxyXG5cdFx0XHRwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxyXG5cclxuXHRcdHJldHVybiBcIiN7cGF0aH0vI3tsYW5nX3RhZ30uanNvblwiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRnZXRCcm93c2VyTG9jYWxlID0gKCktPlxyXG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xyXG5cdFx0aWYgbC5pbmRleE9mKFwiemhcIikgPj0wXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtY25cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsb2NhbGUgPSBcImVuLXVzXCJcclxuXHRcdHJldHVybiBsb2NhbGVcclxuXHJcblxyXG5cdCMg5YGc55So5Lia5Yqh5a+56LGh57+76K+RIOatpOWHveaVsOW3suW8g+eUqFxyXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XHJcblx0XHRyZXR1cm5cclxuXHJcblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cclxuXHRcdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdfJywgKGtleSwgYXJncyktPlxyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKVxyXG5cclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT0gXCJlbi11c1wiXHJcblx0XHRcdFx0aWYgVEFQaTE4bj9cclxuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJ6aC1DTlwiLCB7cm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpIH0pXHJcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxyXG5cdFx0XHRcdHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiemgtY25cIilcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIFRBUGkxOG4/XHJcblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIilcclxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxyXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiZW5cIilcclxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiZW5cIilcclxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpXHJcblx0XHR1c2VyTGFzdExvY2FsZSA9IG51bGxcclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxyXG5cdFx0XHR1c2VyTGFzdExvY2FsZSA9XHJcblx0XHRcdGlmIE1ldGVvci51c2VyKClcclxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XHJcblx0XHRcdFx0XHRpZiB1c2VyTGFzdExvY2FsZSAmJiB1c2VyTGFzdExvY2FsZSAhPSBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG5cdFx0XHRcdFx0dXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cclxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxyXG5cclxuXHRcdFx0JC5leHRlbmQgdHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsXHJcblx0XHRcdFx0bGFuZ3VhZ2U6XHJcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXHJcblx0XHRcdFx0XHRcImVtcHR5VGFibGVcIjogICAgIHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXHJcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXHJcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb0ZpbHRlcmVkXCI6ICAgdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcclxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxyXG5cdFx0XHRcdFx0XCJsZW5ndGhNZW51XCI6ICAgICB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxyXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcclxuXHRcdFx0XHRcdFwic2VhcmNoXCI6ICAgICAgICAgdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxyXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcclxuXHRcdFx0XHRcdFx0XCJmaXJzdFwiOiAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxyXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXHJcblx0XHRcdFx0XHRcdFwicHJldmlvdXNcIjogICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxyXG5cdFx0XHRcdFx0XCJhcmlhXCI6XHJcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxyXG5cdFx0XHRcdFx0XHRcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcclxuXHJcblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxyXG5cdFx0XHRcdF8uZWFjaCB0YWJsZS5vcHRpb25zLmNvbHVtbnMsIChjb2x1bW4pIC0+XHJcblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRcdGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpO1xyXG5cdFx0XHRcdFx0aWYgIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2VcclxuXHRcdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9XHJcblx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSlcclxuXHRcdFx0XHRcdHJldHVybiBcclxuXHJcblxyXG4iLCJ2YXIgSTE4biwgYWJzb2x1dGVVcmwsIGdldEJyb3dzZXJMb2NhbGU7XG5cbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcblxudGhpcy5pMThuID0gaTE4bjtcblxudGhpcy50ID0gSTE4bi50O1xuXG50aGlzLnRyID0gdDtcblxudGhpcy50cmwgPSB0O1xuXG5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICB2YXIgZSwgcm9vdF91cmw7XG4gIGlmICh1cmwpIHtcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH1cbiAgfVxufTtcblxuaTE4bi5zZXRPcHRpb25zKHtcbiAgcHVyaWZ5OiBudWxsLFxuICBkZWZhdWx0TG9jYWxlOiAnemgtQ04nLFxuICBob3N0VXJsOiBhYnNvbHV0ZVVybCgpXG59KTtcblxuaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgVEFQaTE4bi5fX29yaWdpbmFsID0gVEFQaTE4bi5fXztcbiAgVEFQaTE4bi5fXyA9IGZ1bmN0aW9uKGtleSwgb3B0aW9ucywgbG9jYWxlKSB7XG4gICAgdmFyIHRyYW5zbGF0ZWQ7XG4gICAgdHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICAgIGlmICh0cmFuc2xhdGVkICE9PSBrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgIH1cbiAgICByZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsKGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgfTtcbiAgVEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IGZ1bmN0aW9uKGxhbmdfdGFnKSB7XG4gICAgdmFyIHBhdGg7XG4gICAgcGF0aCA9IHRoaXMuY29uZi5jZG5fcGF0aCAhPSBudWxsID8gdGhpcy5jb25mLmNkbl9wYXRoIDogdGhpcy5jb25mLmkxOG5fZmlsZXNfcm91dGU7XG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICAgIGlmIChwYXRoWzBdID09PSBcIi9cIikge1xuICAgICAgcGF0aCA9IGFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoICsgXCIvXCIgKyBsYW5nX3RhZyArIFwiLmpzb25cIjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBnZXRCcm93c2VyTG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGwsIGxvY2FsZTtcbiAgICBsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgIGlmIChsLmluZGV4T2YoXCJ6aFwiKSA+PSAwKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLWNuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZTtcbiAgfTtcbiAgU2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gZnVuY3Rpb24ocHJlZml4KSB7fTtcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICB9KTtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJMYXN0TG9jYWxlO1xuICAgIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICAgIH0pO1xuICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPT0gXCJlbi11c1wiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJ6aC1DTlwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcInpoLUNOXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiemgtY25cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcImVuXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiZW5cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJlblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdXNlckxhc3RMb2NhbGUgPSBudWxsO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKTtcbiAgICAgIHJldHVybiB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkgPyBNZXRlb3IudXNlcigpLmxvY2FsZSA/IChTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKSwgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT09IE1ldGVvci51c2VyKCkubG9jYWxlID8gd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSA6IHZvaWQgMCwgdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGkxOG4ub25DaGFuZ2VMb2NhbGUoZnVuY3Rpb24obmV3TG9jYWxlKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cywge1xuICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgIFwiZGVjaW1hbFwiOiB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuICAgICAgICAgIFwiZW1wdHlUYWJsZVwiOiB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuICAgICAgICAgIFwiaW5mb1wiOiB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxuICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcbiAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG4gICAgICAgICAgXCJpbmZvUG9zdEZpeFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcbiAgICAgICAgICBcInRob3VzYW5kc1wiOiB0KFwiZGF0YVRhYmxlcy50aG91c2FuZHNcIiksXG4gICAgICAgICAgXCJsZW5ndGhNZW51XCI6IHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG4gICAgICAgICAgXCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInByb2Nlc3NpbmdcIjogdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG4gICAgICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgIFwiZmlyc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG4gICAgICAgICAgICBcImxhc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcbiAgICAgICAgICAgIFwibmV4dFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuICAgICAgICAgICAgXCJwcmV2aW91c1wiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJhcmlhXCI6IHtcbiAgICAgICAgICAgIFwic29ydEFzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnRBc2NlbmRpbmdcIiksXG4gICAgICAgICAgICBcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaCh0YWJsZS5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgIGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT09IFwiX2lkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLCBcIl9cIikpO1xuICAgICAgICAgIGlmICghdGFibGUub3B0aW9ucy5sYW5ndWFnZSkge1xuICAgICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiQGNmcyA9IHt9XHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIilcclxuXHJcblxyXG4jIOmAmui/h+aWh+S7tuaJqeWxleWQjeiOt+WPluaWh+S7tmNvbnRlbnRUeXBlXHJcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xyXG4jIOWPgueFp3Mz5LiK5Lyg6ZmE5Lu25ZCO55qEY29udGVudFR5cGVcclxuY2ZzLmdldENvbnRlbnRUeXBlID0gKGZpbGVuYW1lKSAtPlxyXG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKCcuJyArIF9leHAgPT0gJy5hdScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ibXAnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYnoyJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L2NzcydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kdGQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG90eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5lcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ2lmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5odG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmphcicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJ1xyXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvanBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qc3AnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL21pZGknXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXAzJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcGVnJykgXHJcbiAgICAgIHJldHVybiAndmlkZW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGRmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBsJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3BuZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wb3R4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwc3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhbScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ydGYnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zZ21sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9zZ21sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zbGR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN2ZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGFyLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRneicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvdGlmZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50c3YnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnR4dCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC13YXYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxhbScpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHN4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC94bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuemlwJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xyXG4gICAgZWxzZSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBcclxuXHJcblxyXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKVxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxyXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKVxyXG5cclxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpXHJcbiAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXHJcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXHJcblxyXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxyXG4gICAgZmlsZV9zdG9yZVxyXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1blxyXG5cclxuICAgIGVsc2UgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiUzNcIlxyXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3c1xyXG4gICAgZWxzZVxyXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBmaWxlS2V5TWFrZXI6IChmaWxlT2JqKS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgTG9va3VwIHRoZSBjb3B5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiBhbmQgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHN0b3JlIGFuZCBzdG9yZS5rZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgVE8gQ1VTVE9NSVpFLCBSRVBMQUNFIENPREUgQUZURVIgVEhJUyBQT0lOVFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtzdG9yZTogc3RvcmVfbmFtZX0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBuZXcgRGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyB5ZWFyICsgJy8nICsgbW9udGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKVxyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXVkaW9zJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXSAjIGFsbG93IG9ubHkgYXVkaW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ10gIyBhbGxvdyBvbmx5IGltYWdlcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICd2aWRlb3MnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddICMgYWxsb3cgb25seSB2aWRlb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxyXG5cclxuICAgIGNmc1tzdG9yZV9uYW1lXS5hbGxvd1xyXG4gICAgICAgIGluc2VydDogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB1cGRhdGU6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgcmVtb3ZlOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGRvd25sb2FkOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXHJcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV1cclxuICAgICAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cclxuICAgICAgICAgICAgZG9jLnVzZXJJZCA9IHVzZXJJZFxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2ZpbGVzJ1xyXG4gICAgICAgIGRiW1wiY2ZzLiN7c3RvcmVfbmFtZX0uZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcyIsInZhciBzdG9yZXM7XG5cbnN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddO1xuXG5fLmVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZV9uYW1lKSB7XG4gIGZpbGVfc3RvcmU7XG4gIHZhciBmaWxlX3N0b3JlLCByZWYsIHJlZjE7XG4gIGlmICgoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjEuc3RvcmUgOiB2b2lkIDApID09PSBcIlMzXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICAgIGZpbGVLZXlNYWtlcjogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgICAgIHZhciBhYnNvbHV0ZVBhdGgsIGZpbGVuYW1lLCBmaWxlbmFtZUluU3RvcmUsIG1rZGlycCwgbW9udGgsIG5vdywgcGF0aCwgcGF0aG5hbWUsIHN0b3JlLCB5ZWFyO1xuICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZV9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgKFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lICsgXCIvXCIpICsgeWVhciArICcvJyArIG1vbnRoKTtcbiAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
