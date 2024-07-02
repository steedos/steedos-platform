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
var TAPi18n = Package['tap:i18n'].TAPi18n;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;
var FS = Package['steedos:cfs-base-package'].FS;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:objects-core":{"i18n.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_objects-core/i18n.coffee                                                              //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var I18n, absoluteUrl, getBrowserLocale, i18n;
i18n = require('meteor/universe:i18n').i18n;
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
          var collName;

          if (!column.data || column.data === "_id") {
            return;
          }

          if (table.collection) {
            collName = table.collection._name;
          } else {
            collName = '';
          }

          column.sTitle = t("" + collName + "_" + column.data.replace(/\./g, "_"));

          if (!table.options.language) {
            table.options.language = {};
          }

          table.options.language.zeroRecords = t("dataTables.zero") + t(collName);
        });
      });
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs":{"cfs.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_objects-core/cfs/cfs.coffee                                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs_fix.coffee":function module(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_objects-core/cfs/cfs_fix.coffee                                                       //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stores.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
// packages/steedos_objects-core/cfs/stores.coffee                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var stores;
stores = ['avatars', 'audios', 'images', 'videos', 'files'];

_.each(stores, function (store_name) {
  file_store;
  var file_store, ref, ref1, ref2;

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
  } else if (((ref2 = Meteor.settings["public"].cfs) != null ? ref2.store : void 0) === "STEEDOSCLOUD") {
    if (Meteor.isClient) {
      file_store = new FS.Store.STEEDOSCLOUD(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.STEEDOSCLOUD(store_name, Meteor.settings.cfs.steedosCloud);
    }
  } else {
    if (Meteor.isClient) {
      file_store = new FS.Store.FileSystem(store_name);
    } else if (Meteor.isServer) {
      file_store = new FS.Store.FileSystem(store_name, {
        path: require('path').join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name),
        fileKeyMaker: function (fileObj) {
          var absolutePath, filename, filenameInStore, metadata, mkdirp, month, now, objectFoldPath, objectName, path, pathname, store, year;
          store = fileObj && fileObj._getInfo(store_name);

          if (store && store.key) {
            return store.key;
          }

          filename = fileObj.name();
          filenameInStore = fileObj.name({
            store: store_name
          });
          metadata = fileObj.metadata || {};
          objectName = metadata.object_name;
          objectFoldPath = '';

          if (objectName) {
            objectFoldPath = objectName + '/';
          }

          now = new Date();
          year = now.getFullYear();
          month = now.getMonth() + 1;
          path = require('path');
          mkdirp = require('mkdirp');
          pathname = path.join(process.env.STEEDOS_STORAGE_DIR, "files/" + store_name + "/" + objectFoldPath + year + '/' + month);
          absolutePath = path.resolve(pathname);
          mkdirp.sync(absolutePath);
          return objectFoldPath + year + '/' + month + '/' + fileObj.collectionName + '-' + fileObj._id + '-' + (filenameInStore || filename);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiSTE4biIsImFic29sdXRlVXJsIiwiZ2V0QnJvd3NlckxvY2FsZSIsImkxOG4iLCJyZXF1aXJlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJjb2xsTmFtZSIsImRhdGEiLCJjb2xsZWN0aW9uIiwiX25hbWUiLCJzVGl0bGUiLCJ6ZXJvUmVjb3JkcyIsImNmcyIsIkZTIiwiSFRUUCIsInNldEJhc2VVcmwiLCJnZXRDb250ZW50VHlwZSIsImZpbGVuYW1lIiwiX2V4cCIsInNwbGl0IiwicG9wIiwidG9Mb3dlckNhc2UiLCJTdG9yYWdlQWRhcHRlciIsIm9uIiwic3RvcmVOYW1lIiwiZmlsZU9iaiIsImNvbnNvbGUiLCJDb2xsZWN0aW9uIiwic3RvcmVzIiwic3RvcmVfbmFtZSIsImZpbGVfc3RvcmUiLCJyZWYiLCJyZWYxIiwicmVmMiIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJTVEVFRE9TQ0xPVUQiLCJzdGVlZG9zQ2xvdWQiLCJGaWxlU3lzdGVtIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWV0YWRhdGEiLCJta2RpcnAiLCJtb250aCIsIm5vdyIsIm9iamVjdEZvbGRQYXRoIiwib2JqZWN0TmFtZSIsInllYXIiLCJfZ2V0SW5mbyIsIm5hbWUiLCJvYmplY3RfbmFtZSIsIkRhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImZpbHRlciIsImFsbG93IiwiY29udGVudFR5cGVzIiwiaW5zZXJ0IiwidXBkYXRlIiwicmVtb3ZlIiwiZG93bmxvYWQiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsSUFBQSxFQUFBQyxXQUFBLEVBQUFDLGdCQUFBLEVBQUFDLElBQUE7QUFBQUEsT0FBT0MsUUFBUSxzQkFBUixFQUFnQ0QsSUFBdkM7QUFDQUgsT0FBT0ksUUFBUSxlQUFSLENBQVA7QUFDQSxLQUFDRCxJQUFELEdBQVFBLElBQVI7QUFFQSxLQUFDRSxDQUFELEdBQUtMLEtBQUtLLENBQVY7QUFFQSxLQUFDQyxFQUFELEdBQU1ELENBQU47QUFFQSxLQUFDRSxHQUFELEdBQU9GLENBQVA7O0FBRUFKLGNBQWMsVUFBQ08sR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNLQzs7QURKRixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT1gsV0FBUCxDQUFtQk8sR0FBbkIsQ0FBUDtBQUREO0FBR0MsUUFBR0ksT0FBT0UsUUFBVjtBQUNDO0FBQ0NKLG1CQUFXLElBQUlLLEdBQUosQ0FBUUgsT0FBT1gsV0FBUCxFQUFSLENBQVg7O0FBQ0EsWUFBR08sR0FBSDtBQUNDLGlCQUFPRSxTQUFTTSxRQUFULEdBQW9CUixHQUEzQjtBQUREO0FBR0MsaUJBQU9FLFNBQVNNLFFBQWhCO0FBTEY7QUFBQSxlQUFBQyxLQUFBO0FBTU1SLFlBQUFRLEtBQUE7QUFDTCxlQUFPTCxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ2tC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LGVBQWMsU0FBakI7QUFDSStDLE9BQUcvQyxVQUFILElBQWlCakIsSUFBSWlCLFVBQUosQ0FBakI7QUFDQStDLE9BQUcvQyxVQUFILEVBQWVnRCxLQUFmLENBQXFCQyxNQUFyQixDQUE0Qk4sTUFBNUIsQ0FBbUMsVUFBQ08sTUFBRCxFQUFTQyxHQUFUO0FDUXJDLGFEUE1BLElBQUlELE1BQUosR0FBYUEsTUNPbkI7QURSRTtBQ1VMOztBRFBDLE1BQUdsRCxlQUFjLE9BQWpCO0FDU0EsV0RSSStDLEdBQUcsU0FBTy9DLFVBQVAsR0FBa0IsYUFBckIsSUFBcUNqQixJQUFJaUIsVUFBSixFQUFnQmdELEtDUXpEO0FBQ0Q7QURoSEgsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpMThuID0gcmVxdWlyZSgnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nKS5pMThuO1xuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcbkBpMThuID0gaTE4bjtcblxuQHQgPSBJMThuLnRcblxuQHRyID0gdFxuXG5AdHJsID0gdFxuXG5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cblx0aWYgdXJsXG5cdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXG5cdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0ZWxzZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dHJ5XG5cdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0ZWxzZVxuXHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcbmkxOG4uc2V0T3B0aW9uc1xuXHRwdXJpZnk6IG51bGxcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xuXHRob3N0VXJsOiBhYnNvbHV0ZVVybCgpXG5cbmlmIFRBUGkxOG4/XG5cdFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX19cblxuXHRUQVBpMThuLl9fID0gKGtleSwgb3B0aW9ucywgbG9jYWxlKS0+XG5cdFx0dHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuXHRcdGlmIHRyYW5zbGF0ZWQgIT0ga2V5XG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRlZFxuXG5cdFx0IyBpMThuIOe/u+ivkeS4jeWHuuadpe+8jOWwneivleeUqCB0YXA6aTE4biDnv7vor5EgVE9ETyByZW1vdmVcblx0XHRyZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsIGtleSwgb3B0aW9ucywgbG9jYWxlXG5cblx0VEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IChsYW5nX3RhZykgLT5cblxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlIC9cXC8kLywgXCJcIlxuXHRcdGlmIHBhdGhbMF0gPT0gXCIvXCJcblx0XHRcdHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoXG5cblx0XHRyZXR1cm4gXCIje3BhdGh9LyN7bGFuZ190YWd9Lmpzb25cIlxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Z2V0QnJvd3NlckxvY2FsZSA9ICgpLT5cblx0XHRsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nXG5cdFx0aWYgbC5pbmRleE9mKFwiemhcIikgPj0wXG5cdFx0XHRsb2NhbGUgPSBcInpoLWNuXCJcblx0XHRlbHNlXG5cdFx0XHRsb2NhbGUgPSBcImVuLXVzXCJcblx0XHRyZXR1cm4gbG9jYWxlXG5cblxuXHQjIOWBnOeUqOS4muWKoeWvueixoee/u+ivkSDmraTlh73mlbDlt7LlvIPnlKhcblx0U2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gKHByZWZpeCkgLT5cblx0XHRyZXR1cm5cblxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdE1ldGVvci5zdGFydHVwIC0+XG5cblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG5cblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcblxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIFRBUGkxOG4/XG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpXG5cdFx0XHRcdEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7cm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpIH0pXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiZW5cIilcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcImVuXCIpXG5cdFx0XHRcdHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIilcblx0XHR1c2VyTGFzdExvY2FsZSA9IG51bGxcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpXG5cdFx0XHR1c2VyTGFzdExvY2FsZSA9XG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXG5cdFx0XHRcdGlmIE1ldGVvci51c2VyKCkubG9jYWxlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XG5cdFx0XHRcdFx0aWYgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG5cdFx0XHRcdFx0dXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZVxuXG5cdFx0aTE4bi5vbkNoYW5nZUxvY2FsZSAobmV3TG9jYWxlKS0+XG5cblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxuXHRcdFx0XHRsYW5ndWFnZTpcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuXHRcdFx0XHRcdFwiaW5mb1wiOiAgICAgICAgICAgdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcblx0XHRcdFx0XHRcImluZm9Qb3N0Rml4XCI6ICAgIHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcblx0XHRcdFx0XHRcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcblx0XHRcdFx0XHRcInplcm9SZWNvcmRzXCI6ICAgIHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcblx0XHRcdFx0XHRcdFwibGFzdFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcblx0XHRcdFx0XHRcImFyaWFcIjpcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG5cblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxuXHRcdFx0XHRfLmVhY2ggdGFibGUub3B0aW9ucy5jb2x1bW5zLCAoY29sdW1uKSAtPlxuXHRcdFx0XHRcdGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT0gXCJfaWRcIilcblx0XHRcdFx0XHRcdHJldHVyblxuXHRcdFx0XHRcdGlmIHRhYmxlLmNvbGxlY3Rpb25cblx0XHRcdFx0XHRcdGNvbGxOYW1lID0gdGFibGUuY29sbGVjdGlvbi5fbmFtZVxuXHRcdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRcdGNvbGxOYW1lID0gJydcblx0XHRcdFx0XHRjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgY29sbE5hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLFwiX1wiKSk7XG5cdFx0XHRcdFx0aWYgIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2Vcblx0XHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fVxuXHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdChjb2xsTmFtZSlcblx0XHRcdFx0XHRyZXR1cm4gXG5cblxuIiwidmFyIEkxOG4sIGFic29sdXRlVXJsLCBnZXRCcm93c2VyTG9jYWxlLCBpMThuO1xuXG5pMThuID0gcmVxdWlyZSgnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nKS5pMThuO1xuXG5JMThuID0gcmVxdWlyZSgnQHN0ZWVkb3MvaTE4bicpO1xuXG50aGlzLmkxOG4gPSBpMThuO1xuXG50aGlzLnQgPSBJMThuLnQ7XG5cbnRoaXMudHIgPSB0O1xuXG50aGlzLnRybCA9IHQ7XG5cbmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIHZhciBlLCByb290X3VybDtcbiAgaWYgKHVybCkge1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfVxuICB9XG59O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTicsXG4gIGhvc3RVcmw6IGFic29sdXRlVXJsKClcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGggKyBcIi9cIiArIGxhbmdfdGFnICsgXCIuanNvblwiO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIGdldEJyb3dzZXJMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgbG9jYWxlO1xuICAgIGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgaWYgKGwuaW5kZXhPZihcInpoXCIpID49IDApIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtY25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxlID0gXCJlbi11c1wiO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlO1xuICB9O1xuICBTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbihwcmVmaXgpIHt9O1xuICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gIH0pO1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlckxhc3RMb2NhbGU7XG4gICAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gICAgfSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9PSBcImVuLXVzXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiemgtY25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJlblwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcImVuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2VyTGFzdExvY2FsZSA9IG51bGw7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpO1xuICAgICAgcmV0dXJuIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKSA/IE1ldGVvci51c2VyKCkubG9jYWxlID8gKFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpLCB1c2VyTGFzdExvY2FsZSAmJiB1c2VyTGFzdExvY2FsZSAhPT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpIDogdm9pZCAwLCB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkubG9jYWxlKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICByZXR1cm4gaTE4bi5vbkNoYW5nZUxvY2FsZShmdW5jdGlvbihuZXdMb2NhbGUpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKFRhYnVsYXIudGFibGVzQnlOYW1lLCBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKHRhYmxlLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgdmFyIGNvbGxOYW1lO1xuICAgICAgICAgIGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT09IFwiX2lkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRhYmxlLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGNvbGxOYW1lID0gdGFibGUuY29sbGVjdGlvbi5fbmFtZTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29sbE5hbWUgPSAnJztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIGNvbGxOYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgICBpZiAoIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KGNvbGxOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJAY2ZzID0ge31cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKVxuXG5cbiMg6YCa6L+H5paH5Lu25omp5bGV5ZCN6I635Y+W5paH5Lu2Y29udGVudFR5cGVcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xuIyDlj4LnhadzM+S4iuS8oOmZhOS7tuWQjueahGNvbnRlbnRUeXBlXG5jZnMuZ2V0Q29udGVudFR5cGUgPSAoZmlsZW5hbWUpIC0+XG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxuICAgIGlmICgnLicgKyBfZXhwID09ICcuYXUnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vYmFzaWMnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxuICAgICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJtcCcpIFxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJ6MicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcbiAgICAgIHJldHVybiAndGV4dC9jc3MnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmR0ZCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvYycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb3R4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5naWYnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5neicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmh0bWwnKSBcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qYXInKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXG4gICAgICByZXR1cm4gJ2ltYWdlL2pwZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanNwJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxuICAgICAgcmV0dXJuICdhdWRpby9taWRpJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcDMnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXBlZycpIFxuICAgICAgcmV0dXJuICd2aWRlby9tcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wZGYnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxuICAgICAgcmV0dXJuICdpbWFnZS9wbmcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBvdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHN4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxuICAgICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYW0nKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJ0ZicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2dtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3NnbWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNsZHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zdmcnKSBcbiAgICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50YXIuZ3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50Z3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3RpZmYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRzdicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50eHQnKSBcbiAgICAgIHJldHVybiAndGV4dC9wbGFpbidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bGFtJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXG4gICAgICByZXR1cm4gJ3RleHQveG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy56aXAnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xuICAgIGVsc2UgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBcblxuXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIilcbiAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSlcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKVxuICBjb25zb2xlLmVycm9yKGVycm9yKVxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKSIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG4iLCJzdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXVxuXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxuICAgIGZpbGVfc3RvcmVcbiAgICBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJPU1NcIlxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1blxuXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3c1xuXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTVEVFRE9TQ0xPVURcIlxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuU1RFRURPU0NMT1VEKHN0b3JlX25hbWUpXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlNURUVET1NDTE9VRCBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLnN0ZWVkb3NDbG91ZFxuICAgIGVsc2VcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfVwiKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZUtleU1ha2VyOiAoZmlsZU9iaiktPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiBhbmQgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXlcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YWRhdGEgPSBmaWxlT2JqLm1ldGFkYXRhIHx8IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0TmFtZSA9IG1ldGFkYXRhLm9iamVjdF9uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Rm9sZFBhdGggPSAnJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgb2JqZWN0TmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RGb2xkUGF0aCA9IG9iamVjdE5hbWUgKyAnLydcblxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyBvYmplY3RGb2xkUGF0aCArIHllYXIgKyAnLycgKyBtb250aClcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3RGb2xkUGF0aCArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpXG5cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXVkaW9zJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddICMgYWxsb3cgb25seSBhdWRpb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddICMgYWxsb3cgb25seSBpbWFnZXMgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAndmlkZW9zJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddICMgYWxsb3cgb25seSB2aWRlb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2VcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXG5cbiAgICBjZnNbc3RvcmVfbmFtZV0uYWxsb3dcbiAgICAgICAgaW5zZXJ0OiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgdXBkYXRlOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgcmVtb3ZlOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZG93bmxvYWQ6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV1cbiAgICAgICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydCAodXNlcklkLCBkb2MpIC0+XG4gICAgICAgICAgICBkb2MudXNlcklkID0gdXNlcklkXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdmaWxlcydcbiAgICAgICAgZGJbXCJjZnMuI3tzdG9yZV9uYW1lfS5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzIiwidmFyIHN0b3Jlcztcblxuc3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ107XG5cbl8uZWFjaChzdG9yZXMsIGZ1bmN0aW9uKHN0b3JlX25hbWUpIHtcbiAgZmlsZV9zdG9yZTtcbiAgdmFyIGZpbGVfc3RvcmUsIHJlZiwgcmVmMSwgcmVmMjtcbiAgaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMS5zdG9yZSA6IHZvaWQgMCkgPT09IFwiUzNcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiU1RFRURPU0NMT1VEXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlNURUVET1NDTE9VRChzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TVEVFRE9TQ0xPVUQoc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5zdGVlZG9zQ2xvdWQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lKSxcbiAgICAgICAgZmlsZUtleU1ha2VyOiBmdW5jdGlvbihmaWxlT2JqKSB7XG4gICAgICAgICAgdmFyIGFic29sdXRlUGF0aCwgZmlsZW5hbWUsIGZpbGVuYW1lSW5TdG9yZSwgbWV0YWRhdGEsIG1rZGlycCwgbW9udGgsIG5vdywgb2JqZWN0Rm9sZFBhdGgsIG9iamVjdE5hbWUsIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1ldGFkYXRhID0gZmlsZU9iai5tZXRhZGF0YSB8fCB7fTtcbiAgICAgICAgICBvYmplY3ROYW1lID0gbWV0YWRhdGEub2JqZWN0X25hbWU7XG4gICAgICAgICAgb2JqZWN0Rm9sZFBhdGggPSAnJztcbiAgICAgICAgICBpZiAob2JqZWN0TmFtZSkge1xuICAgICAgICAgICAgb2JqZWN0Rm9sZFBhdGggPSBvYmplY3ROYW1lICsgJy8nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbiAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCAoXCJmaWxlcy9cIiArIHN0b3JlX25hbWUgKyBcIi9cIikgKyBvYmplY3RGb2xkUGF0aCArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiBvYmplY3RGb2xkUGF0aCArIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
