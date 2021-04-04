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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJJMThuIiwiYWJzb2x1dGVVcmwiLCJnZXRCcm93c2VyTG9jYWxlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsImZpbGVLZXlNYWtlciIsImFic29sdXRlUGF0aCIsImZpbGVuYW1lSW5TdG9yZSIsIm1rZGlycCIsIm1vbnRoIiwibm93IiwieWVhciIsIl9nZXRJbmZvIiwibmFtZSIsIkRhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImZpbHRlciIsImFsbG93IiwiY29udGVudFR5cGVzIiwiaW5zZXJ0IiwidXBkYXRlIiwicmVtb3ZlIiwiZG93bmxvYWQiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxhQUFBO0FBQUFDLE9BQUFDLEtBQUEsQ0FBQUMsUUFBQTtBQUFBLHVCQUFBQyxDQUFBO0FBQUFKLFdBQUFJLENBQUE7QUFBQTtBQUFBO0FBQUEsSUFBQUMsSUFBQSxFQUFBQyxXQUFBLEVBQUFDLGdCQUFBO0FBQ0FGLE9BQU9GLFFBQVEsZUFBUixDQUFQO0FBQ0EsS0FBQ0gsSUFBRCxHQUFRQSxJQUFSO0FBRUEsS0FBQ1EsQ0FBRCxHQUFLSCxLQUFLRyxDQUFWO0FBRUEsS0FBQ0MsRUFBRCxHQUFNRCxDQUFOO0FBRUEsS0FBQ0UsR0FBRCxHQUFPRixDQUFQOztBQUVBRixjQUFjLFVBQUNLLEdBQUQ7QUFDYixNQUFBQyxDQUFBLEVBQUFDLFFBQUE7O0FBQUEsTUFBR0YsR0FBSDtBQUVDQSxVQUFNQSxJQUFJRyxPQUFKLENBQVksS0FBWixFQUFrQixFQUFsQixDQUFOO0FDS0M7O0FESkYsTUFBSUMsT0FBT0MsU0FBWDtBQUNDLFdBQU9ELE9BQU9ULFdBQVAsQ0FBbUJLLEdBQW5CLENBQVA7QUFERDtBQUdDLFFBQUdJLE9BQU9FLFFBQVY7QUFDQztBQUNDSixtQkFBVyxJQUFJSyxHQUFKLENBQVFILE9BQU9ULFdBQVAsRUFBUixDQUFYOztBQUNBLFlBQUdLLEdBQUg7QUFDQyxpQkFBT0UsU0FBU00sUUFBVCxHQUFvQlIsR0FBM0I7QUFERDtBQUdDLGlCQUFPRSxTQUFTTSxRQUFoQjtBQUxGO0FBQUEsZUFBQUMsS0FBQTtBQU1NUixZQUFBUSxLQUFBO0FBQ0wsZUFBT0wsT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0FBUDtBQVJGO0FBQUE7QUNrQkksYURSSEksT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0NRRztBRHJCTDtBQ3VC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bEIsRUFDZDtBQUFBRCxjQUFRLENBQUNFLFVBQUQ7QUFBUixLQURjLENBQWxCO0FDS0w7O0FERkNsQixNQUFJaUIsVUFBSixFQUFnQmlDLEtBQWhCLENBQ0k7QUFBQUUsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQURKO0FBRUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFISjtBQUlBQyxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBTEo7QUFNQUMsY0FBVTtBQUNOLGFBQU8sSUFBUDtBQVBKO0FBQUEsR0FESjs7QUFVQSxNQUFHdEMsZUFBYyxTQUFqQjtBQUNJdUMsT0FBR3ZDLFVBQUgsSUFBaUJqQixJQUFJaUIsVUFBSixDQUFqQjtBQUNBdUMsT0FBR3ZDLFVBQUgsRUFBZXdDLEtBQWYsQ0FBcUJDLE1BQXJCLENBQTRCTixNQUE1QixDQUFtQyxVQUFDTyxNQUFELEVBQVNDLEdBQVQ7QUNRckMsYURQTUEsSUFBSUQsTUFBSixHQUFhQSxNQ09uQjtBRFJFO0FDVUw7O0FEUEMsTUFBRzFDLGVBQWMsT0FBakI7QUNTQSxXRFJJdUMsR0FBRyxTQUFPdkMsVUFBUCxHQUFrQixhQUFyQixJQUFxQ2pCLElBQUlpQixVQUFKLEVBQWdCd0MsS0NRekQ7QUFDRDtBRHBHSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XG5AaTE4biA9IGkxOG47XG5cbkB0ID0gSTE4bi50XG5cbkB0ciA9IHRcblxuQHRybCA9IHRcblxuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdGlmIHVybFxuXHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdGVsc2Vcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHRyeVxuXHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdGVsc2Vcblx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG4jIOmHjeWGmXRhcDppMThu5Ye95pWw77yM5ZCR5ZCO5YW85a65XG5pMThuLnNldE9wdGlvbnNcblx0cHVyaWZ5OiBudWxsXG5cdGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxuXG5pZiBUQVBpMThuP1xuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXG5cblx0VEFQaTE4bi5fXyA9IChrZXksIG9wdGlvbnMsIGxvY2FsZSktPlxuXHRcdHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcblxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RIFRPRE8gcmVtb3ZlXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxuXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XG5cblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXG5cdFx0XHRwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxuXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXG5cdFx0ZWxzZVxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXG5cdFx0cmV0dXJuIGxvY2FsZVxuXG5cblx0IyDlgZznlKjkuJrliqHlr7nosaHnv7vor5Eg5q2k5Ye95pWw5bey5byD55SoXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XG5cdFx0cmV0dXJuXG5cblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcblxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxuXG5cdFx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpXG5cblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxuXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPSBcImVuLXVzXCJcblx0XHRcdFx0aWYgVEFQaTE4bj9cblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIilcblx0XHRcdFx0STE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtyb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKCkgfSlcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiemgtY25cIilcblx0XHRcdFx0cmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpXG5cdFx0dXNlckxhc3RMb2NhbGUgPSBudWxsXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxuXHRcdFx0dXNlckxhc3RMb2NhbGUgPVxuXHRcdFx0aWYgTWV0ZW9yLnVzZXIoKVxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpO1xuXHRcdFx0XHRcdGlmIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9IE1ldGVvci51c2VyKCkubG9jYWxlXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuXHRcdFx0XHRcdHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcblxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxuXG5cdFx0XHQkLmV4dGVuZCB0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cyxcblx0XHRcdFx0bGFuZ3VhZ2U6XG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuXHRcdFx0XHRcdFwiZW1wdHlUYWJsZVwiOiAgICAgdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG5cdFx0XHRcdFx0XCJpbmZvRmlsdGVyZWRcIjogICB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcblx0XHRcdFx0XHRcImxlbmd0aE1lbnVcIjogICAgIHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG5cdFx0XHRcdFx0XCJzZWFyY2hcIjogICAgICAgICB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XG5cdFx0XHRcdFx0XHRcImZpcnN0XCI6ICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuXHRcdFx0XHRcdFx0XCJwcmV2aW91c1wiOiAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG5cdFx0XHRcdFx0XCJhcmlhXCI6XG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcblx0XHRcdFx0XHRcdFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cblx0XHRcdFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpO1xuXHRcdFx0XHRcdGlmICF0YWJsZS5vcHRpb25zLmxhbmd1YWdlXG5cdFx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cblx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSlcblx0XHRcdFx0XHRyZXR1cm4gXG5cblxuIiwidmFyIEkxOG4sIGFic29sdXRlVXJsLCBnZXRCcm93c2VyTG9jYWxlO1xuXG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XG5cbnRoaXMuaTE4biA9IGkxOG47XG5cbnRoaXMudCA9IEkxOG4udDtcblxudGhpcy50ciA9IHQ7XG5cbnRoaXMudHJsID0gdDtcblxuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgdmFyIGUsIHJvb3RfdXJsO1xuICBpZiAodXJsKSB7XG4gICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9XG4gIH1cbn07XG5cbmkxOG4uc2V0T3B0aW9ucyh7XG4gIHB1cmlmeTogbnVsbCxcbiAgZGVmYXVsdExvY2FsZTogJ3poLUNOJyxcbiAgaG9zdFVybDogYWJzb2x1dGVVcmwoKVxufSk7XG5cbmlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gIFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX187XG4gIFRBUGkxOG4uX18gPSBmdW5jdGlvbihrZXksIG9wdGlvbnMsIGxvY2FsZSkge1xuICAgIHZhciB0cmFuc2xhdGVkO1xuICAgIHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgICBpZiAodHJhbnNsYXRlZCAhPT0ga2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICB9XG4gICAgcmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gIH07XG4gIFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSBmdW5jdGlvbihsYW5nX3RhZykge1xuICAgIHZhciBwYXRoO1xuICAgIHBhdGggPSB0aGlzLmNvbmYuY2RuX3BhdGggIT0gbnVsbCA/IHRoaXMuY29uZi5jZG5fcGF0aCA6IHRoaXMuY29uZi5pMThuX2ZpbGVzX3JvdXRlO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aCArIFwiL1wiICsgbGFuZ190YWcgKyBcIi5qc29uXCI7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgZ2V0QnJvd3NlckxvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBsb2NhbGU7XG4gICAgbCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJztcbiAgICBpZiAobC5pbmRleE9mKFwiemhcIikgPj0gMCkge1xuICAgICAgbG9jYWxlID0gXCJ6aC1jblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBcImVuLXVzXCI7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGU7XG4gIH07XG4gIFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IGZ1bmN0aW9uKHByZWZpeCkge307XG4gIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgfSk7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VyTGFzdExvY2FsZTtcbiAgICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgICB9KTtcbiAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT09IFwiZW4tdXNcIikge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcImVuXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiZW5cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZXJMYXN0TG9jYWxlID0gbnVsbDtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIik7XG4gICAgICByZXR1cm4gdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpID8gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyAoU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSksIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9PSBNZXRlb3IudXNlcigpLmxvY2FsZSA/IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSkgOiB2b2lkIDAsIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIHJldHVybiBpMThuLm9uQ2hhbmdlTG9jYWxlKGZ1bmN0aW9uKG5ld0xvY2FsZSkge1xuICAgICAgJC5leHRlbmQodHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBcImRlY2ltYWxcIjogdChcImRhdGFUYWJsZXMuZGVjaW1hbFwiKSxcbiAgICAgICAgICBcImVtcHR5VGFibGVcIjogdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcbiAgICAgICAgICBcImluZm9cIjogdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcbiAgICAgICAgICBcImluZm9FbXB0eVwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG4gICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxuICAgICAgICAgIFwiaW5mb1Bvc3RGaXhcIjogdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXG4gICAgICAgICAgXCJ0aG91c2FuZHNcIjogdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuICAgICAgICAgIFwibGVuZ3RoTWVudVwiOiB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxuICAgICAgICAgIFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwcm9jZXNzaW5nXCI6IHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG4gICAgICAgICAgXCJzZWFyY2hcIjogdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxuICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxuICAgICAgICAgICAgXCJsYXN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXG4gICAgICAgICAgICBcIm5leHRcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubmV4dFwiKSxcbiAgICAgICAgICAgIFwicHJldmlvdXNcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiYXJpYVwiOiB7XG4gICAgICAgICAgICBcInNvcnRBc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuICAgICAgICAgICAgXCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2goVGFidWxhci50YWJsZXNCeU5hbWUsIGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2godGFibGUub3B0aW9ucy5jb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgICBpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09PSBcIl9pZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgICBpZiAoIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIkBjZnMgPSB7fVxuXG5NZXRlb3Iuc3RhcnR1cCAtPlxuICBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpXG5cblxuIyDpgJrov4fmlofku7bmianlsZXlkI3ojrflj5bmlofku7Zjb250ZW50VHlwZVxuIyBodHRwOi8vcmVmZXJlbmNlLnNpdGVwb2ludC5jb20vaHRtbC9taW1lLXR5cGVzXG4jIOWPgueFp3Mz5LiK5Lyg6ZmE5Lu25ZCO55qEY29udGVudFR5cGVcbmNmcy5nZXRDb250ZW50VHlwZSA9IChmaWxlbmFtZSkgLT5cbiAgICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKCcuJyArIF9leHAgPT0gJy5hdScpIFxuICAgICAgcmV0dXJuICdhdWRpby9iYXNpYydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYXZpJykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYm1wJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL2JtcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYnoyJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmNzcycpIFxuICAgICAgcmV0dXJuICd0ZXh0L2NzcydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZHRkJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5lcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmV4ZScpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmdpZicpIFxuICAgICAgcmV0dXJuICdpbWFnZS9naWYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHF4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHRtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L2h0bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmphcicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSdcbiAgICBlbHNlIGlmICgoJy4nICsgX2V4cCA9PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09ICcuanBlZycpKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvanBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qc3AnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5taWRpJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL21pZGknXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wMycpIFxuICAgICAgcmV0dXJuICdhdWRpby9tcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcGVnJykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL21wZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm9nZycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBkZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBsJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG5nJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3BuZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG90eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwc3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnF0JykgXG4gICAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmEnKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhbScpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmRmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucnRmJykgXG4gICAgICByZXR1cm4gJ3RleHQvcnRmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zZ21sJykgXG4gICAgICByZXR1cm4gJ3RleHQvc2dtbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2l0JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2xkeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN2ZycpIFxuICAgICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zd2YnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRhci5neicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRneicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRpZmYnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvdGlmZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHN2JykgXG4gICAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnR4dCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3BsYWluJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy53YXYnKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC13YXYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsYW0nKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHNiJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bWwnKSBcbiAgICAgIHJldHVybiAndGV4dC94bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnppcCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnXG4gICAgZWxzZSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIFxuXG5cbiIsInRoaXMuY2ZzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKTtcbn0pO1xuXG5jZnMuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgX2V4cDtcbiAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCcuJyArIF9leHAgPT09ICcuYXUnKSB7XG4gICAgcmV0dXJuICdhdWRpby9iYXNpYyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdmknKSB7XG4gICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYm1wJykge1xuICAgIHJldHVybiAnaW1hZ2UvYm1wJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJ6MicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuY3NzJykge1xuICAgIHJldHVybiAndGV4dC9jc3MnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZHRkJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvYycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2N4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXhlJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmdpZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2dpZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ocXgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHRtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvaHRtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qYXInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSc7XG4gIH0gZWxzZSBpZiAoKCcuJyArIF9leHAgPT09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT09ICcuanBlZycpKSB7XG4gICAgcmV0dXJuICdpbWFnZS9qcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5taWRpJykge1xuICAgIHJldHVybiAnYXVkaW8vbWlkaSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcDMnKSB7XG4gICAgcmV0dXJuICdhdWRpby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wZWcnKSB7XG4gICAgcmV0dXJuICd2aWRlby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm9nZycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGwnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG5nJykge1xuICAgIHJldHVybiAnaW1hZ2UvcG5nJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHBzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnF0Jykge1xuICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmFtJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJ0ZicpIHtcbiAgICByZXR1cm4gJ3RleHQvcnRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNnbWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3NnbWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2l0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNsZHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3ZnJykge1xuICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zd2YnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50YXIuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRpZmYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS90aWZmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRzdicpIHtcbiAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHh0Jykge1xuICAgIHJldHVybiAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy53YXYnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXdhdic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bGFtJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhscycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHNiJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGx0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy56aXAnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfVxufTtcbiIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaiktPlxuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKVxuICBjb25zb2xlLmVycm9yKGVycm9yKVxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKVxuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSktPlxuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXG5cbl8uZWFjaCBzdG9yZXMsIChzdG9yZV9uYW1lKS0+XG4gICAgZmlsZV9zdG9yZVxuICAgIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIk9TU1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTIHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuXG5cbiAgICBlbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlMzXCJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzIHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzXG4gICAgZWxzZVxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxuICAgICAgICAgICAgICAgICAgICBmaWxlS2V5TWFrZXI6IChmaWxlT2JqKS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAjIExvb2t1cCB0aGUgY29weVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdG9yZSBhbmQgc3RvcmUua2V5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRPIENVU1RPTUlaRSwgUkVQTEFDRSBDT0RFIEFGVEVSIFRISVMgUE9JTlRcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBuZXcgRGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKVxuXG4gICAgICAgICAgICAgICAgfSlcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F1ZGlvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXSAjIGFsbG93IG9ubHkgYXVkaW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgICAgICAgZmlsdGVyOiB7XG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXSAjIGFsbG93IG9ubHkgdmlkZW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICBlbHNlXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XG4gICAgICAgIGluc2VydDogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHVwZGF0ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIHJlbW92ZTogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIGRvd25sb2FkOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXG4gICAgICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxuICAgICAgICAgICAgZG9jLnVzZXJJZCA9IHVzZXJJZFxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXG4gICAgICAgIGRiW1wiY2ZzLiN7c3RvcmVfbmFtZX0uZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcyIsInZhciBzdG9yZXM7XG5cbnN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddO1xuXG5fLmVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZV9uYW1lKSB7XG4gIGZpbGVfc3RvcmU7XG4gIHZhciBmaWxlX3N0b3JlLCByZWYsIHJlZjE7XG4gIGlmICgoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjEuc3RvcmUgOiB2b2lkIDApID09PSBcIlMzXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICAgIGZpbGVLZXlNYWtlcjogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgICAgIHZhciBhYnNvbHV0ZVBhdGgsIGZpbGVuYW1lLCBmaWxlbmFtZUluU3RvcmUsIG1rZGlycCwgbW9udGgsIG5vdywgcGF0aCwgcGF0aG5hbWUsIHN0b3JlLCB5ZWFyO1xuICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZV9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgKFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lICsgXCIvXCIpICsgeWVhciArICcvJyArIG1vbnRoKTtcbiAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
