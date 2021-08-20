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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/steedos_objects-core/i18n.coffee                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

},"cfs":{"cfs.coffee":function module(){

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

},"cfs_fix.coffee":function module(){

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

},"stores.coffee":function module(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiSTE4biIsImFic29sdXRlVXJsIiwiZ2V0QnJvd3NlckxvY2FsZSIsImkxOG4iLCJyZXF1aXJlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInJlZjIiLCJzZXR0aW5ncyIsInN0b3JlIiwiU3RvcmUiLCJPU1MiLCJpc1NlcnZlciIsImFsaXl1biIsIlMzIiwiYXdzIiwiU1RFRURPU0NMT1VEIiwic3RlZWRvc0Nsb3VkIiwiRmlsZVN5c3RlbSIsImpvaW4iLCJwcm9jZXNzIiwiZW52IiwiU1RFRURPU19TVE9SQUdFX0RJUiIsImZpbGVLZXlNYWtlciIsImFic29sdXRlUGF0aCIsImZpbGVuYW1lSW5TdG9yZSIsIm1rZGlycCIsIm1vbnRoIiwibm93IiwieWVhciIsIl9nZXRJbmZvIiwibmFtZSIsIkRhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImZpbHRlciIsImFsbG93IiwiY29udGVudFR5cGVzIiwiaW5zZXJ0IiwidXBkYXRlIiwicmVtb3ZlIiwiZG93bmxvYWQiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsSUFBQSxFQUFBQyxXQUFBLEVBQUFDLGdCQUFBLEVBQUFDLElBQUE7QUFBQUEsT0FBT0MsUUFBUSxzQkFBUixFQUFnQ0QsSUFBdkM7QUFDQUgsT0FBT0ksUUFBUSxlQUFSLENBQVA7QUFDQSxLQUFDRCxJQUFELEdBQVFBLElBQVI7QUFFQSxLQUFDRSxDQUFELEdBQUtMLEtBQUtLLENBQVY7QUFFQSxLQUFDQyxFQUFELEdBQU1ELENBQU47QUFFQSxLQUFDRSxHQUFELEdBQU9GLENBQVA7O0FBRUFKLGNBQWMsVUFBQ08sR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNLQzs7QURKRixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT1gsV0FBUCxDQUFtQk8sR0FBbkIsQ0FBUDtBQUREO0FBR0MsUUFBR0ksT0FBT0UsUUFBVjtBQUNDO0FBQ0NKLG1CQUFXLElBQUlLLEdBQUosQ0FBUUgsT0FBT1gsV0FBUCxFQUFSLENBQVg7O0FBQ0EsWUFBR08sR0FBSDtBQUNDLGlCQUFPRSxTQUFTTSxRQUFULEdBQW9CUixHQUEzQjtBQUREO0FBR0MsaUJBQU9FLFNBQVNNLFFBQWhCO0FBTEY7QUFBQSxlQUFBQyxLQUFBO0FBTU1SLFlBQUFRLEtBQUE7QUFDTCxlQUFPTCxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ2tCSSxhRFJISSxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQ1FHO0FEckJMO0FDdUJFO0FEM0JXLENBQWQ7O0FBbUJB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LWNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpMThuID0gcmVxdWlyZSgnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nKS5pMThuO1xyXG5JMThuID0gcmVxdWlyZSgnQHN0ZWVkb3MvaTE4bicpO1xyXG5AaTE4biA9IGkxOG47XHJcblxyXG5AdCA9IEkxOG4udFxyXG5cclxuQHRyID0gdFxyXG5cclxuQHRybCA9IHRcclxuXHJcbmFic29sdXRlVXJsID0gKHVybCktPlxyXG5cdGlmIHVybFxyXG5cdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXHJcblx0XHR1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sXCJcIilcclxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcclxuXHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcclxuXHRlbHNlXHJcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcclxuXHRcdFx0dHJ5XHJcblx0XHRcdFx0cm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKVxyXG5cdFx0XHRcdGlmIHVybFxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXHJcblx0XHRcdGNhdGNoIGVcclxuXHRcdFx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuXHRcdGVsc2VcclxuXHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcclxuIyDph43lhpl0YXA6aTE4buWHveaVsO+8jOWQkeWQjuWFvOWuuVxyXG5pMThuLnNldE9wdGlvbnNcclxuXHRwdXJpZnk6IG51bGxcclxuXHRkZWZhdWx0TG9jYWxlOiAnemgtQ04nXHJcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxyXG5cclxuaWYgVEFQaTE4bj9cclxuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXHJcblxyXG5cdFRBUGkxOG4uX18gPSAoa2V5LCBvcHRpb25zLCBsb2NhbGUpLT5cclxuXHRcdHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcclxuXHRcdGlmIHRyYW5zbGF0ZWQgIT0ga2V5XHJcblx0XHRcdHJldHVybiB0cmFuc2xhdGVkXHJcblxyXG5cdFx0IyBpMThuIOe/u+ivkeS4jeWHuuadpe+8jOWwneivleeUqCB0YXA6aTE4biDnv7vor5EgVE9ETyByZW1vdmVcclxuXHRcdHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwga2V5LCBvcHRpb25zLCBsb2NhbGVcclxuXHJcblx0VEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IChsYW5nX3RhZykgLT5cclxuXHJcblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXHJcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlIC9cXC8kLywgXCJcIlxyXG5cdFx0aWYgcGF0aFswXSA9PSBcIi9cIlxyXG5cdFx0XHRwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxyXG5cclxuXHRcdHJldHVybiBcIiN7cGF0aH0vI3tsYW5nX3RhZ30uanNvblwiXHJcblxyXG5pZiBNZXRlb3IuaXNDbGllbnRcclxuXHRnZXRCcm93c2VyTG9jYWxlID0gKCktPlxyXG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xyXG5cdFx0aWYgbC5pbmRleE9mKFwiemhcIikgPj0wXHJcblx0XHRcdGxvY2FsZSA9IFwiemgtY25cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRsb2NhbGUgPSBcImVuLXVzXCJcclxuXHRcdHJldHVybiBsb2NhbGVcclxuXHJcblxyXG5cdCMg5YGc55So5Lia5Yqh5a+56LGh57+76K+RIOatpOWHveaVsOW3suW8g+eUqFxyXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XHJcblx0XHRyZXR1cm5cclxuXHJcblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxyXG5cclxuXHRcdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdfJywgKGtleSwgYXJncyktPlxyXG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xyXG5cclxuXHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKVxyXG5cclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdGlmIFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT0gXCJlbi11c1wiXHJcblx0XHRcdFx0aWYgVEFQaTE4bj9cclxuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJ6aC1DTlwiLCB7cm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpIH0pXHJcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxyXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxyXG5cdFx0XHRcdHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiemgtY25cIilcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHRcdGlmIFRBUGkxOG4/XHJcblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIilcclxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxyXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiZW5cIilcclxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiZW5cIilcclxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpXHJcblx0XHR1c2VyTGFzdExvY2FsZSA9IG51bGxcclxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XHJcblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxyXG5cdFx0XHR1c2VyTGFzdExvY2FsZSA9XHJcblx0XHRcdGlmIE1ldGVvci51c2VyKClcclxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XHJcblx0XHRcdFx0XHRpZiB1c2VyTGFzdExvY2FsZSAmJiB1c2VyTGFzdExvY2FsZSAhPSBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xyXG5cdFx0XHRcdFx0dXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZVxyXG5cclxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxyXG5cclxuXHRcdFx0JC5leHRlbmQgdHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsXHJcblx0XHRcdFx0bGFuZ3VhZ2U6XHJcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXHJcblx0XHRcdFx0XHRcImVtcHR5VGFibGVcIjogICAgIHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXHJcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXHJcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb0ZpbHRlcmVkXCI6ICAgdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcclxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxyXG5cdFx0XHRcdFx0XCJsZW5ndGhNZW51XCI6ICAgICB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxyXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcclxuXHRcdFx0XHRcdFwic2VhcmNoXCI6ICAgICAgICAgdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxyXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcclxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcclxuXHRcdFx0XHRcdFx0XCJmaXJzdFwiOiAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxyXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXHJcblx0XHRcdFx0XHRcdFwicHJldmlvdXNcIjogICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxyXG5cdFx0XHRcdFx0XCJhcmlhXCI6XHJcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxyXG5cdFx0XHRcdFx0XHRcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcclxuXHJcblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxyXG5cdFx0XHRcdF8uZWFjaCB0YWJsZS5vcHRpb25zLmNvbHVtbnMsIChjb2x1bW4pIC0+XHJcblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXHJcblx0XHRcdFx0XHRcdHJldHVyblxyXG5cclxuXHRcdFx0XHRcdGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpO1xyXG5cdFx0XHRcdFx0aWYgIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2VcclxuXHRcdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9XHJcblx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSlcclxuXHRcdFx0XHRcdHJldHVybiBcclxuXHJcblxyXG4iLCJ2YXIgSTE4biwgYWJzb2x1dGVVcmwsIGdldEJyb3dzZXJMb2NhbGUsIGkxOG47XG5cbmkxOG4gPSByZXF1aXJlKCdtZXRlb3IvdW5pdmVyc2U6aTE4bicpLmkxOG47XG5cbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XG5cbnRoaXMuaTE4biA9IGkxOG47XG5cbnRoaXMudCA9IEkxOG4udDtcblxudGhpcy50ciA9IHQ7XG5cbnRoaXMudHJsID0gdDtcblxuYWJzb2x1dGVVcmwgPSBmdW5jdGlvbih1cmwpIHtcbiAgdmFyIGUsIHJvb3RfdXJsO1xuICBpZiAodXJsKSB7XG4gICAgdXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgfVxuICBpZiAoTWV0ZW9yLmlzQ29yZG92YSkge1xuICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICByb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpO1xuICAgICAgICBpZiAodXJsKSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICB9XG4gIH1cbn07XG5cbmkxOG4uc2V0T3B0aW9ucyh7XG4gIHB1cmlmeTogbnVsbCxcbiAgZGVmYXVsdExvY2FsZTogJ3poLUNOJyxcbiAgaG9zdFVybDogYWJzb2x1dGVVcmwoKVxufSk7XG5cbmlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gIFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX187XG4gIFRBUGkxOG4uX18gPSBmdW5jdGlvbihrZXksIG9wdGlvbnMsIGxvY2FsZSkge1xuICAgIHZhciB0cmFuc2xhdGVkO1xuICAgIHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgICBpZiAodHJhbnNsYXRlZCAhPT0ga2V5KSB7XG4gICAgICByZXR1cm4gdHJhbnNsYXRlZDtcbiAgICB9XG4gICAgcmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gIH07XG4gIFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSBmdW5jdGlvbihsYW5nX3RhZykge1xuICAgIHZhciBwYXRoO1xuICAgIHBhdGggPSB0aGlzLmNvbmYuY2RuX3BhdGggIT0gbnVsbCA/IHRoaXMuY29uZi5jZG5fcGF0aCA6IHRoaXMuY29uZi5pMThuX2ZpbGVzX3JvdXRlO1xuICAgIHBhdGggPSBwYXRoLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICBpZiAocGF0aFswXSA9PT0gXCIvXCIpIHtcbiAgICAgIHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoO1xuICAgIH1cbiAgICByZXR1cm4gcGF0aCArIFwiL1wiICsgbGFuZ190YWcgKyBcIi5qc29uXCI7XG4gIH07XG59XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgZ2V0QnJvd3NlckxvY2FsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsLCBsb2NhbGU7XG4gICAgbCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJztcbiAgICBpZiAobC5pbmRleE9mKFwiemhcIikgPj0gMCkge1xuICAgICAgbG9jYWxlID0gXCJ6aC1jblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhbGUgPSBcImVuLXVzXCI7XG4gICAgfVxuICAgIHJldHVybiBsb2NhbGU7XG4gIH07XG4gIFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IGZ1bmN0aW9uKHByZWZpeCkge307XG4gIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgfSk7XG4gIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VyTGFzdExvY2FsZTtcbiAgICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcbiAgICB9KTtcbiAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSk7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKFNlc3Npb24uZ2V0KFwic3RlZWRvcy1sb2NhbGVcIikgIT09IFwiZW4tdXNcIikge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcImVuXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiZW5cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHVzZXJMYXN0TG9jYWxlID0gbnVsbDtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIik7XG4gICAgICByZXR1cm4gdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpID8gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyAoU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSksIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9PSBNZXRlb3IudXNlcigpLmxvY2FsZSA/IHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSkgOiB2b2lkIDAsIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUpIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIH0pO1xuICAgIHJldHVybiBpMThuLm9uQ2hhbmdlTG9jYWxlKGZ1bmN0aW9uKG5ld0xvY2FsZSkge1xuICAgICAgJC5leHRlbmQodHJ1ZSwgJC5mbi5kYXRhVGFibGUuZGVmYXVsdHMsIHtcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBcImRlY2ltYWxcIjogdChcImRhdGFUYWJsZXMuZGVjaW1hbFwiKSxcbiAgICAgICAgICBcImVtcHR5VGFibGVcIjogdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcbiAgICAgICAgICBcImluZm9cIjogdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcbiAgICAgICAgICBcImluZm9FbXB0eVwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG4gICAgICAgICAgXCJpbmZvRmlsdGVyZWRcIjogdChcImRhdGFUYWJsZXMuaW5mb0ZpbHRlcmVkXCIpLFxuICAgICAgICAgIFwiaW5mb1Bvc3RGaXhcIjogdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXG4gICAgICAgICAgXCJ0aG91c2FuZHNcIjogdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuICAgICAgICAgIFwibGVuZ3RoTWVudVwiOiB0KFwiZGF0YVRhYmxlcy5sZW5ndGhNZW51XCIpLFxuICAgICAgICAgIFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwcm9jZXNzaW5nXCI6IHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG4gICAgICAgICAgXCJzZWFyY2hcIjogdChcImRhdGFUYWJsZXMuc2VhcmNoXCIpLFxuICAgICAgICAgIFwiemVyb1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXG4gICAgICAgICAgXCJwYWdpbmF0ZVwiOiB7XG4gICAgICAgICAgICBcImZpcnN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmZpcnN0XCIpLFxuICAgICAgICAgICAgXCJsYXN0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXG4gICAgICAgICAgICBcIm5leHRcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubmV4dFwiKSxcbiAgICAgICAgICAgIFwicHJldmlvdXNcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiYXJpYVwiOiB7XG4gICAgICAgICAgICBcInNvcnRBc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuICAgICAgICAgICAgXCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBfLmVhY2goVGFidWxhci50YWJsZXNCeU5hbWUsIGZ1bmN0aW9uKHRhYmxlKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2godGFibGUub3B0aW9ucy5jb2x1bW5zLCBmdW5jdGlvbihjb2x1bW4pIHtcbiAgICAgICAgICBpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09PSBcIl9pZFwiKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZywgXCJfXCIpKTtcbiAgICAgICAgICBpZiAoIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsIkBjZnMgPSB7fVxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpXHJcblxyXG5cclxuIyDpgJrov4fmlofku7bmianlsZXlkI3ojrflj5bmlofku7Zjb250ZW50VHlwZVxyXG4jIGh0dHA6Ly9yZWZlcmVuY2Uuc2l0ZXBvaW50LmNvbS9odG1sL21pbWUtdHlwZXNcclxuIyDlj4LnhadzM+S4iuS8oOmZhOS7tuWQjueahGNvbnRlbnRUeXBlXHJcbmNmcy5nZXRDb250ZW50VHlwZSA9IChmaWxlbmFtZSkgLT5cclxuICAgIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKClcclxuICAgIGlmICgnLicgKyBfZXhwID09ICcuYXUnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9iYXNpYydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5hdmknKSBcclxuICAgICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYm1wJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvYm1wJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJ6MicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuY3NzJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9jc3MnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZHRkJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvYycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2N4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXhlJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmdpZicpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2dpZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5neicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ocXgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHRtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvaHRtbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qYXInKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSdcclxuICAgIGVsc2UgaWYgKCgnLicgKyBfZXhwID09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT0gJy5qcGVnJykpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2pwZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanNwJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1pZGknKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9taWRpJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wMycpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL21wZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXBlZycpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL21wZWcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcub2dnJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBkZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbmcnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9wbmcnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG90eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHN4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucXQnKSBcclxuICAgICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmEnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYW0nKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yZGYnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucnRmJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9ydGYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2dtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvc2dtbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zaXQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2xkeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zdmcnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN3ZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRhci5neicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50Z3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGlmZicpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3RpZmYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHN2JykgXHJcbiAgICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50eHQnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3BsYWluJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLndhdicpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsYW0nKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc2InKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhtbCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQveG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnppcCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCdcclxuICAgIGVsc2UgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgXHJcblxyXG5cclxuIiwidGhpcy5jZnMgPSB7fTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpO1xufSk7XG5cbmNmcy5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBfZXhwO1xuICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmF2aScpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ibXAnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9ibXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYnoyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5jc3MnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2Nzcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kdGQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvY3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5lcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5leGUnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ2lmJykge1xuICAgIHJldHVybiAnaW1hZ2UvZ2lmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmhxeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5odG1sJykge1xuICAgIHJldHVybiAndGV4dC9odG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmphcicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJztcbiAgfSBlbHNlIGlmICgoJy4nICsgX2V4cCA9PT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PT0gJy5qcGVnJykpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2pwZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanNwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1pZGknKSB7XG4gICAgcmV0dXJuICdhdWRpby9taWRpJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wMycpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXBlZycpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcub2dnJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9wbmcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucXQnKSB7XG4gICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmEnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYW0nKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucnRmJykge1xuICAgIHJldHVybiAndGV4dC9ydGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2dtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvc2dtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zaXQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2xkeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zdmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN3ZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRhci5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50Z3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGlmZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3RpZmYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHN2Jykge1xuICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50eHQnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLndhdicpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsYW0nKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc2InKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQveG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnppcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9XG59O1xuIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uICdlcnJvcicsIChzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKS0+XHJcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIilcclxuICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcclxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSlcclxuXHJcbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uICdlcnJvcicsIChlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKS0+XHJcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKVxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxyXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKSIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG4iLCJzdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXVxyXG5cclxuXy5lYWNoIHN0b3JlcywgKHN0b3JlX25hbWUpLT5cclxuICAgIGZpbGVfc3RvcmVcclxuICAgIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIk9TU1wiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Mgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW5cclxuXHJcbiAgICBlbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlMzXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3NcclxuXHJcbiAgICBlbHNlIGlmIE1ldGVvci5zZXR0aW5ncy5wdWJsaWMuY2ZzPy5zdG9yZSA9PSBcIlNURUVET1NDTE9VRFwiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuU1RFRURPU0NMT1VEKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TVEVFRE9TQ0xPVUQgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5zdGVlZG9zQ2xvdWRcclxuICAgIGVsc2VcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX1cIiksXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsZUtleU1ha2VyOiAoZmlsZU9iaiktPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIExvb2t1cCB0aGUgY29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogYW5kIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiBzdG9yZSBhbmQgc3RvcmUua2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFRPIENVU1RPTUlaRSwgUkVQTEFDRSBDT0RFIEFGVEVSIFRISVMgUE9JTlRcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7c3RvcmU6IHN0b3JlX25hbWV9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy8je3N0b3JlX25hbWV9L1wiICsgeWVhciArICcvJyArIG1vbnRoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFNldCBhYnNvbHV0ZSBwYXRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBFbnN1cmUgdGhlIHBhdGggZXhpc3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSlcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F1ZGlvcydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ10gIyBhbGxvdyBvbmx5IGF1ZGlvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddICMgYWxsb3cgb25seSBpbWFnZXMgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAndmlkZW9zJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXSAjIGFsbG93IG9ubHkgdmlkZW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cclxuXHJcbiAgICBjZnNbc3RvcmVfbmFtZV0uYWxsb3dcclxuICAgICAgICBpbnNlcnQ6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgdXBkYXRlOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIHJlbW92ZTogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICBkb3dubG9hZDogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xyXG4gICAgICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdXHJcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydCAodXNlcklkLCBkb2MpIC0+XHJcbiAgICAgICAgICAgIGRvYy51c2VySWQgPSB1c2VySWRcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdmaWxlcydcclxuICAgICAgICBkYltcImNmcy4je3N0b3JlX25hbWV9LmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXMiLCJ2YXIgc3RvcmVzO1xuXG5zdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXTtcblxuXy5lYWNoKHN0b3JlcywgZnVuY3Rpb24oc3RvcmVfbmFtZSkge1xuICBmaWxlX3N0b3JlO1xuICB2YXIgZmlsZV9zdG9yZSwgcmVmLCByZWYxLCByZWYyO1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bik7XG4gICAgfVxuICB9IGVsc2UgaWYgKCgocmVmMSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYxLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTM1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKCgocmVmMiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYyLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTVEVFRE9TQ0xPVURcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuU1RFRURPU0NMT1VEKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlNURUVET1NDTE9VRChzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLnN0ZWVkb3NDbG91ZCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy9cIiArIHN0b3JlX25hbWUpLFxuICAgICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgICB2YXIgYWJzb2x1dGVQYXRoLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBta2RpcnAsIG1vbnRoLCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIChcImZpbGVzL1wiICsgc3RvcmVfbmFtZSArIFwiL1wiKSArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXVkaW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAndmlkZW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cbiAgICB9KTtcbiAgfVxuICBjZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRvd25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXTtcbiAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICByZXR1cm4gZG9jLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ZpbGVzJykge1xuICAgIHJldHVybiBkYltcImNmcy5cIiArIHN0b3JlX25hbWUgKyBcIi5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzO1xuICB9XG59KTtcbiJdfQ==
