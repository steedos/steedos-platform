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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/i18n.coffee                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs":{"cfs.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/cfs.coffee                                                              //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs_fix.coffee":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/cfs_fix.coffee                                                          //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stores.coffee":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/cfs/stores.coffee                                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        path: require('path').join(Creator.steedosStorageDir, "files/" + store_name),
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
          pathname = path.join(Creator.steedosStorageDir, "files/" + store_name + "/" + year + '/' + month);
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJJMThuIiwiYWJzb2x1dGVVcmwiLCJnZXRCcm93c2VyTG9jYWxlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsImZpbGVLZXlNYWtlciIsImFic29sdXRlUGF0aCIsImZpbGVuYW1lSW5TdG9yZSIsIm1rZGlycCIsIm1vbnRoIiwibm93IiwieWVhciIsIl9nZXRJbmZvIiwibmFtZSIsIkRhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImZpbHRlciIsImFsbG93IiwiY29udGVudFR5cGVzIiwiaW5zZXJ0IiwidXBkYXRlIiwicmVtb3ZlIiwiZG93bmxvYWQiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxhQUFBO0FBQUFDLE9BQUFDLEtBQUEsQ0FBQUMsUUFBQTtBQUFBLHVCQUFBQyxDQUFBO0FBQUFKLFdBQUFJLENBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUMsSUFBQSxFQUFBQyxXQUFBLEVBQUFDLGdCQUFBO0FBQ0FGLE9BQU9GLFFBQVEsZUFBUixDQUFQO0FBQ0EsS0FBQ0gsSUFBRCxHQUFRQSxJQUFSO0FBRUEsS0FBQ1EsQ0FBRCxHQUFLSCxLQUFLRyxDQUFWO0FBRUEsS0FBQ0MsRUFBRCxHQUFNRCxDQUFOO0FBRUEsS0FBQ0UsR0FBRCxHQUFPRixDQUFQOztBQUVBRixjQUFjLFVBQUNLLEdBQUQ7QUFDYixNQUFBQyxDQUFBLEVBQUFDLFFBQUE7O0FBQUEsTUFBR0YsR0FBSDtBQUVDQSxVQUFNQSxJQUFJRyxPQUFKLENBQVksS0FBWixFQUFrQixFQUFsQixDQUFOO0FDS0M7O0FESkYsTUFBSUMsT0FBT0MsU0FBWDtBQUNDLFdBQU9ELE9BQU9ULFdBQVAsQ0FBbUJLLEdBQW5CLENBQVA7QUFERDtBQUdDLFFBQUdJLE9BQU9FLFFBQVY7QUFDQztBQUNDSixtQkFBVyxJQUFJSyxHQUFKLENBQVFILE9BQU9ULFdBQVAsRUFBUixDQUFYOztBQUNBLFlBQUdLLEdBQUg7QUFDQyxpQkFBT0UsU0FBU00sUUFBVCxHQUFvQlIsR0FBM0I7QUFERDtBQUdDLGlCQUFPRSxTQUFTTSxRQUFoQjtBQUxGO0FBQUEsZUFBQUMsS0FBQTtBQU1NUixZQUFBUSxLQUFBO0FBQ0wsZUFBT0wsT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0FBUDtBQVJGO0FBQUE7QUNrQkksYURSSEksT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0NRRztBRHJCTDtBQ3VC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bEIsRUFDZDtBQUFBRCxjQUFRLENBQUNFLFVBQUQ7QUFBUixLQURjLENBQWxCO0FDS0w7O0FERkNsQixNQUFJaUIsVUFBSixFQUFnQmlDLEtBQWhCLENBQ0k7QUFBQUUsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQURKO0FBRUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFISjtBQUlBQyxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBTEo7QUFNQUMsY0FBVTtBQUNOLGFBQU8sSUFBUDtBQVBKO0FBQUEsR0FESjs7QUFVQSxNQUFHdEMsZUFBYyxTQUFqQjtBQUNJdUMsT0FBR3ZDLFVBQUgsSUFBaUJqQixJQUFJaUIsVUFBSixDQUFqQjtBQUNBdUMsT0FBR3ZDLFVBQUgsRUFBZXdDLEtBQWYsQ0FBcUJDLE1BQXJCLENBQTRCTixNQUE1QixDQUFtQyxVQUFDTyxNQUFELEVBQVNDLEdBQVQ7QUNRckMsYURQTUEsSUFBSUQsTUFBSixHQUFhQSxNQ09uQjtBRFJFO0FDVUw7O0FEUEMsTUFBRzFDLGVBQWMsT0FBakI7QUNTQSxXRFJJdUMsR0FBRyxTQUFPdkMsVUFBUCxHQUFrQixhQUFyQixJQUFxQ2pCLElBQUlpQixVQUFKLEVBQWdCd0MsS0NRekQ7QUFDRDtBRHBHSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcclxuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcclxuQGkxOG4gPSBpMThuO1xyXG5cclxuQHQgPSBJMThuLnRcclxuXHJcbkB0ciA9IHRcclxuXHJcbkB0cmwgPSB0XHJcblxyXG5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cclxuXHRpZiB1cmxcclxuXHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxyXG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXHJcblx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXHJcblx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XHJcblx0ZWxzZVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcclxuXHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblx0XHRlbHNlXHJcblx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcclxuaTE4bi5zZXRPcHRpb25zXHJcblx0cHVyaWZ5OiBudWxsXHJcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xyXG5cdGhvc3RVcmw6IGFic29sdXRlVXJsKClcclxuXHJcbmlmIFRBUGkxOG4/XHJcblx0VEFQaTE4bi5fX29yaWdpbmFsID0gVEFQaTE4bi5fX1xyXG5cclxuXHRUQVBpMThuLl9fID0gKGtleSwgb3B0aW9ucywgbG9jYWxlKS0+XHJcblx0XHR0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XHJcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxyXG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRlZFxyXG5cclxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RIFRPRE8gcmVtb3ZlXHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsIGtleSwgb3B0aW9ucywgbG9jYWxlXHJcblxyXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XHJcblxyXG5cdFx0cGF0aCA9IGlmIEAuY29uZi5jZG5fcGF0aD8gdGhlbiBALmNvbmYuY2RuX3BhdGggZWxzZSBALmNvbmYuaTE4bl9maWxlc19yb3V0ZVxyXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcclxuXHRcdGlmIHBhdGhbMF0gPT0gXCIvXCJcclxuXHRcdFx0cGF0aCA9IGFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGhcclxuXHJcblx0XHRyZXR1cm4gXCIje3BhdGh9LyN7bGFuZ190YWd9Lmpzb25cIlxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Z2V0QnJvd3NlckxvY2FsZSA9ICgpLT5cclxuXHRcdGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbidcclxuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxyXG5cdFx0XHRsb2NhbGUgPSBcInpoLWNuXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXHJcblx0XHRyZXR1cm4gbG9jYWxlXHJcblxyXG5cclxuXHQjIOWBnOeUqOS4muWKoeWvueixoee/u+ivkSDmraTlh73mlbDlt7LlvIPnlKhcclxuXHRTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSAocHJlZml4KSAtPlxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdfJywgKGtleSwgYXJncyktPlxyXG5cdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcclxuXHJcblx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHJcblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcclxuXHJcblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcclxuXHJcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxyXG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxyXG5cdFx0XHRcdGlmIFRBUGkxOG4/XHJcblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIilcclxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxyXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIilcclxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiemgtY25cIilcclxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBUQVBpMThuP1xyXG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpXHJcblx0XHRcdFx0STE4bi5jaGFuZ2VMYW5ndWFnZShcImVuXCIsIHtyb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKCkgfSlcclxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXHJcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcImVuXCIpXHJcblx0XHRcdFx0cmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJlblwiKVxyXG5cdFx0dXNlckxhc3RMb2NhbGUgPSBudWxsXHJcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxyXG5cdFx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIilcclxuXHRcdFx0dXNlckxhc3RMb2NhbGUgPVxyXG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpO1xyXG5cdFx0XHRcdFx0aWYgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHRcdHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHJcblx0XHRpMThuLm9uQ2hhbmdlTG9jYWxlIChuZXdMb2NhbGUpLT5cclxuXHJcblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxyXG5cdFx0XHRcdGxhbmd1YWdlOlxyXG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxyXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvXCI6ICAgICAgICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXHJcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb1Bvc3RGaXhcIjogICAgdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXHJcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcclxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcclxuXHRcdFx0XHRcdFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXHJcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcclxuXHRcdFx0XHRcdFwiemVyb1JlY29yZHNcIjogICAgdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XHJcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJsYXN0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXHJcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxyXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcclxuXHRcdFx0XHRcdFwiYXJpYVwiOlxyXG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcclxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXHJcblxyXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cclxuXHRcdFx0XHRfLmVhY2ggdGFibGUub3B0aW9ucy5jb2x1bW5zLCAoY29sdW1uKSAtPlxyXG5cdFx0XHRcdFx0aWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PSBcIl9pZFwiKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdFx0XHRjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csXCJfXCIpKTtcclxuXHRcdFx0XHRcdGlmICF0YWJsZS5vcHRpb25zLmxhbmd1YWdlXHJcblx0XHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fVxyXG5cdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpXHJcblx0XHRcdFx0XHRyZXR1cm4gXHJcblxyXG5cclxuIiwidmFyIEkxOG4sIGFic29sdXRlVXJsLCBnZXRCcm93c2VyTG9jYWxlO1xuXG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XG5cbnRoaXMuaTE4biA9IGkxOG47XG5cbnRoaXMudCA9IEkxOG4udDtcblxudGhpcy50ciA9IHQ7XG5cbnRoaXMudHJsID0gdDtcblxuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgdmFyIGUsIHJvb3RfdXJsO1xuICBpZiAodXJsKSB7XG4gICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9XG4gIH1cbn07XG5cbmkxOG4uc2V0T3B0aW9ucyh7XG4gIHB1cmlmeTogbnVsbCxcbiAgZGVmYXVsdExvY2FsZTogJ3poLUNOJyxcbiAgaG9zdFVybDogYWJzb2x1dGVVcmwoKVxufSk7XG5cbmlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gIFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX187XG4gIFRBUGkxOG4uX18gPSBmdW5jdGlvbihrZXksIG9wdGlvbnMsIGxvY2FsZSkge1xuICAgIHZhciB0cmFuc2xhdGVkO1xuICAgIHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgICBpZiAodHJhbnNsYXRlZCAhPT0ga2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICB9XG4gICAgcmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gIH07XG4gIFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSBmdW5jdGlvbihsYW5nX3RhZykge1xuICAgIHZhciBwYXRoO1xuICAgIHBhdGggPSB0aGlzLmNvbmYuY2RuX3BhdGggIT0gbnVsbCA/IHRoaXMuY29uZi5jZG5fcGF0aCA6IHRoaXMuY29uZi5pMThuX2ZpbGVzX3JvdXRlO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aCArIFwiL1wiICsgbGFuZ190YWcgKyBcIi5qc29uXCI7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgZ2V0QnJvd3NlckxvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBsb2NhbGU7XG4gICAgbCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJztcbiAgICBpZiAobC5pbmRleE9mKFwiemhcIikgPj0gMCkge1xuICAgICAgbG9jYWxlID0gXCJ6aC1jblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBcImVuLXVzXCI7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGU7XG4gIH07XG4gIFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IGZ1bmN0aW9uKHByZWZpeCkge307XG4gIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgfSk7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VyTGFzdExvY2FsZTtcbiAgICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgICB9KTtcbiAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT09IFwiZW4tdXNcIikge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcImVuXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiZW5cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZXJMYXN0TG9jYWxlID0gbnVsbDtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIik7XG4gICAgICByZXR1cm4gdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpID8gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyAoU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSksIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9PSBNZXRlb3IudXNlcigpLmxvY2FsZSA/IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSkgOiB2b2lkIDAsIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIHJldHVybiBpMThuLm9uQ2hhbmdlTG9jYWxlKGZ1bmN0aW9uKG5ld0xvY2FsZSkge1xuICAgICAgJC5leHRlbmQodHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBcImRlY2ltYWxcIjogdChcImRhdGFUYWJsZXMuZGVjaW1hbFwiKSxcbiAgICAgICAgICBcImVtcHR5VGFibGVcIjogdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcbiAgICAgICAgICBcImluZm9cIjogdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcbiAgICAgICAgICBcImluZm9FbXB0eVwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG4gICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxuICAgICAgICAgIFwiaW5mb1Bvc3RGaXhcIjogdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXG4gICAgICAgICAgXCJ0aG91c2FuZHNcIjogdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuICAgICAgICAgIFwibGVuZ3RoTWVudVwiOiB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxuICAgICAgICAgIFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwcm9jZXNzaW5nXCI6IHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG4gICAgICAgICAgXCJzZWFyY2hcIjogdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxuICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxuICAgICAgICAgICAgXCJsYXN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXG4gICAgICAgICAgICBcIm5leHRcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubmV4dFwiKSxcbiAgICAgICAgICAgIFwicHJldmlvdXNcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiYXJpYVwiOiB7XG4gICAgICAgICAgICBcInNvcnRBc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuICAgICAgICAgICAgXCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2goVGFidWxhci50YWJsZXNCeU5hbWUsIGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2godGFibGUub3B0aW9ucy5jb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgICBpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09PSBcIl9pZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgICBpZiAoIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIkBjZnMgPSB7fVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpXHJcblxyXG5cclxuIyDpgJrov4fmlofku7bmianlsZXlkI3ojrflj5bmlofku7Zjb250ZW50VHlwZVxyXG4jIGh0dHA6Ly9yZWZlcmVuY2Uuc2l0ZXBvaW50LmNvbS9odG1sL21pbWUtdHlwZXNcclxuIyDlj4LnhadzM+S4iuS8oOmZhOS7tuWQjueahGNvbnRlbnRUeXBlXHJcbmNmcy5nZXRDb250ZW50VHlwZSA9IChmaWxlbmFtZSkgLT5cclxuICAgIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKClcclxuICAgIGlmICgnLicgKyBfZXhwID09ICcuYXUnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9iYXNpYydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5hdmknKSBcclxuICAgICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYm1wJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvYm1wJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJ6MicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuY3NzJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9jc3MnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZHRkJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvYycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2N4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXhlJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmdpZicpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2dpZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5neicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ocXgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHRtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvaHRtbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qYXInKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSdcclxuICAgIGVsc2UgaWYgKCgnLicgKyBfZXhwID09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT0gJy5qcGVnJykpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2pwZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanNwJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1pZGknKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9taWRpJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wMycpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL21wZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXBlZycpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL21wZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcub2dnJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBkZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbmcnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9wbmcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG90eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHN4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucXQnKSBcclxuICAgICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmEnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYW0nKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yZGYnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucnRmJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9ydGYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2dtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvc2dtbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zaXQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2xkeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zdmcnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN3ZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRhci5neicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50Z3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGlmZicpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3RpZmYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHN2JykgXHJcbiAgICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50eHQnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3BsYWluJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLndhdicpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsYW0nKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc2InKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQveG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnppcCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCdcclxuICAgIGVsc2UgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgXHJcblxyXG5cclxuIiwidGhpcy5jZnMgPSB7fTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpO1xufSk7XG5cbmNmcy5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBfZXhwO1xuICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmF2aScpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ibXAnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9ibXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYnoyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5jc3MnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2Nzcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kdGQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvY3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5lcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5leGUnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ2lmJykge1xuICAgIHJldHVybiAnaW1hZ2UvZ2lmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmhxeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5odG1sJykge1xuICAgIHJldHVybiAndGV4dC9odG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmphcicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJztcbiAgfSBlbHNlIGlmICgoJy4nICsgX2V4cCA9PT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PT0gJy5qcGVnJykpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2pwZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanNwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1pZGknKSB7XG4gICAgcmV0dXJuICdhdWRpby9taWRpJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wMycpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXBlZycpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcub2dnJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9wbmcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucXQnKSB7XG4gICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmEnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYW0nKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucnRmJykge1xuICAgIHJldHVybiAndGV4dC9ydGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2dtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvc2dtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zaXQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2xkeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zdmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN3ZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRhci5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50Z3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGlmZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3RpZmYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHN2Jykge1xuICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50eHQnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLndhdicpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsYW0nKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc2InKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQveG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnppcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9XG59O1xuIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uICdlcnJvcicsIChzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKS0+XHJcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIilcclxuICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcclxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSlcclxuXHJcbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uICdlcnJvcicsIChlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKS0+XHJcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKVxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxyXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKSIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG4iLCJzdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXVxyXG5cclxuXy5lYWNoIHN0b3JlcywgKHN0b3JlX25hbWUpLT5cclxuICAgIGZpbGVfc3RvcmVcclxuICAgIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIk9TU1wiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Mgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW5cclxuXHJcbiAgICBlbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlMzXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3NcclxuICAgIGVsc2VcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzLyN7c3RvcmVfbmFtZX1cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZUtleU1ha2VyOiAoZmlsZU9iaiktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIExvb2t1cCB0aGUgY29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogYW5kIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdG9yZSBhbmQgc3RvcmUua2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRPIENVU1RPTUlaRSwgUkVQTEFDRSBDT0RFIEFGVEVSIFRISVMgUE9JTlRcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9L1wiICsgeWVhciArICcvJyArIG1vbnRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFNldCBhYnNvbHV0ZSBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBFbnN1cmUgdGhlIHBhdGggZXhpc3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSlcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F1ZGlvcydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ10gIyBhbGxvdyBvbmx5IGF1ZGlvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddICMgYWxsb3cgb25seSBpbWFnZXMgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAndmlkZW9zJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXSAjIGFsbG93IG9ubHkgdmlkZW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cclxuXHJcbiAgICBjZnNbc3RvcmVfbmFtZV0uYWxsb3dcclxuICAgICAgICBpbnNlcnQ6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgdXBkYXRlOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIHJlbW92ZTogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICBkb3dubG9hZDogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xyXG4gICAgICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdXHJcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydCAodXNlcklkLCBkb2MpIC0+XHJcbiAgICAgICAgICAgIGRvYy51c2VySWQgPSB1c2VySWRcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdmaWxlcydcclxuICAgICAgICBkYltcImNmcy4je3N0b3JlX25hbWV9LmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXMiLCJ2YXIgc3RvcmVzO1xuXG5zdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXTtcblxuXy5lYWNoKHN0b3JlcywgZnVuY3Rpb24oc3RvcmVfbmFtZSkge1xuICBmaWxlX3N0b3JlO1xuICB2YXIgZmlsZV9zdG9yZSwgcmVmLCByZWYxO1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bik7XG4gICAgfVxuICB9IGVsc2UgaWYgKCgocmVmMSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYxLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTM1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy9cIiArIHN0b3JlX25hbWUpLFxuICAgICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgICB2YXIgYWJzb2x1dGVQYXRoLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBta2RpcnAsIG1vbnRoLCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIChcImZpbGVzL1wiICsgc3RvcmVfbmFtZSArIFwiL1wiKSArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXVkaW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAndmlkZW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cbiAgICB9KTtcbiAgfVxuICBjZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRvd25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXTtcbiAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICByZXR1cm4gZG9jLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ZpbGVzJykge1xuICAgIHJldHVybiBkYltcImNmcy5cIiArIHN0b3JlX25hbWUgKyBcIi5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzO1xuICB9XG59KTtcbiJdfQ==
