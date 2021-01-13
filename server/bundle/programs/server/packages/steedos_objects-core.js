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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/steedos_objects-core/i18n.coffee                                                                 //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cfs":{"cfs.coffee":function module(){

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

},"cfs_fix.coffee":function module(){

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

},"stores.coffee":function module(require){

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiSTE4biIsImFic29sdXRlVXJsIiwiZ2V0QnJvd3NlckxvY2FsZSIsImkxOG4iLCJyZXF1aXJlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsIkNyZWF0b3IiLCJzdGVlZG9zU3RvcmFnZURpciIsImZpbGVLZXlNYWtlciIsImFic29sdXRlUGF0aCIsImZpbGVuYW1lSW5TdG9yZSIsIm1rZGlycCIsIm1vbnRoIiwibm93IiwieWVhciIsIl9nZXRJbmZvIiwibmFtZSIsIkRhdGUiLCJnZXRGdWxsWWVhciIsImdldE1vbnRoIiwicmVzb2x2ZSIsInN5bmMiLCJjb2xsZWN0aW9uTmFtZSIsIl9pZCIsImZpbHRlciIsImFsbG93IiwiY29udGVudFR5cGVzIiwiaW5zZXJ0IiwidXBkYXRlIiwicmVtb3ZlIiwiZG93bmxvYWQiLCJkYiIsImZpbGVzIiwiYmVmb3JlIiwidXNlcklkIiwiZG9jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsSUFBQSxFQUFBQyxXQUFBLEVBQUFDLGdCQUFBLEVBQUFDLElBQUE7QUFBQUEsT0FBT0MsUUFBUSxzQkFBUixFQUFnQ0QsSUFBdkM7QUFDQUgsT0FBT0ksUUFBUSxlQUFSLENBQVA7QUFDQSxLQUFDRCxJQUFELEdBQVFBLElBQVI7QUFFQSxLQUFDRSxDQUFELEdBQUtMLEtBQUtLLENBQVY7QUFFQSxLQUFDQyxFQUFELEdBQU1ELENBQU47QUFFQSxLQUFDRSxHQUFELEdBQU9GLENBQVA7O0FBRUFKLGNBQWMsVUFBQ08sR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNLQzs7QURKRixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT1gsV0FBUCxDQUFtQk8sR0FBbkIsQ0FBUDtBQUREO0FBR0MsUUFBR0ksT0FBT0UsUUFBVjtBQUNDO0FBQ0NKLG1CQUFXLElBQUlLLEdBQUosQ0FBUUgsT0FBT1gsV0FBUCxFQUFSLENBQVg7O0FBQ0EsWUFBR08sR0FBSDtBQUNDLGlCQUFPRSxTQUFTTSxRQUFULEdBQW9CUixHQUEzQjtBQUREO0FBR0MsaUJBQU9FLFNBQVNNLFFBQWhCO0FBTEY7QUFBQSxlQUFBQyxLQUFBO0FBTU1SLFlBQUFRLEtBQUE7QUFDTCxlQUFPTCxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ2tCSSxhRFJISSxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQ1FHO0FEckJMO0FDdUJFO0FEM0JXLENBQWQ7O0FBbUJBTCxLQUFLZSxVQUFMLENBQ0M7QUFBQUMsVUFBUSxJQUFSO0FBQ0FDLGlCQUFl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VUFBSixFQUFnQmlDLEtBQWhCLENBQ0k7QUFBQUUsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQURKO0FBRUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFISjtBQUlBQyxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBTEo7QUFNQUMsY0FBVTtBQUNOLGFBQU8sSUFBUDtBQVBKO0FBQUEsR0FESjs7QUFVQSxNQUFHdEMsZUFBYyxTQUFqQjtBQUNJdUMsT0FBR3ZDLFVBQUgsSUFBaUJqQixJQUFJaUIsVUFBSixDQUFqQjtBQUNBdUMsT0FBR3ZDLFVBQUgsRUFBZXdDLEtBQWYsQ0FBcUJDLE1BQXJCLENBQTRCTixNQUE1QixDQUFtQyxVQUFDTyxNQUFELEVBQVNDLEdBQVQ7QUNRckMsYURQTUEsSUFBSUQsTUFBSixHQUFhQSxNQ09uQjtBRFJFO0FDVUw7O0FEUEMsTUFBRzFDLGVBQWMsT0FBakI7QUNTQSxXRFJJdUMsR0FBRyxTQUFPdkMsVUFBUCxHQUFrQixhQUFyQixJQUFxQ2pCLElBQUlpQixVQUFKLEVBQWdCd0MsS0NRekQ7QUFDRDtBRHBHSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImkxOG4gPSByZXF1aXJlKCdtZXRlb3IvdW5pdmVyc2U6aTE4bicpLmkxOG47XHJcbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XHJcbkBpMThuID0gaTE4bjtcclxuXHJcbkB0ID0gSTE4bi50XHJcblxyXG5AdHIgPSB0XHJcblxyXG5AdHJsID0gdFxyXG5cclxuYWJzb2x1dGVVcmwgPSAodXJsKS0+XHJcblx0aWYgdXJsXHJcblx0XHQjIHVybOS7pVwiL1wi5byA5aS055qE6K+d77yM5Y675o6J5byA5aS055qEXCIvXCJcclxuXHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxyXG5cdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxyXG5cdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xyXG5cdGVsc2VcclxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxyXG5cdFx0XHR0cnlcclxuXHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXHJcblx0XHRcdFx0aWYgdXJsXHJcblx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmxcclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcclxuXHRcdFx0Y2F0Y2ggZVxyXG5cdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxyXG4jIOmHjeWGmXRhcDppMThu5Ye95pWw77yM5ZCR5ZCO5YW85a65XHJcbmkxOG4uc2V0T3B0aW9uc1xyXG5cdHB1cmlmeTogbnVsbFxyXG5cdGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcclxuXHRob3N0VXJsOiBhYnNvbHV0ZVVybCgpXHJcblxyXG5pZiBUQVBpMThuP1xyXG5cdFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX19cclxuXHJcblx0VEFQaTE4bi5fXyA9IChrZXksIG9wdGlvbnMsIGxvY2FsZSktPlxyXG5cdFx0dHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xyXG5cdFx0aWYgdHJhbnNsYXRlZCAhPSBrZXlcclxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcclxuXHJcblx0XHQjIGkxOG4g57+76K+R5LiN5Ye65p2l77yM5bCd6K+V55SoIHRhcDppMThuIOe/u+ivkSBUT0RPIHJlbW92ZVxyXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxyXG5cclxuXHRUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gKGxhbmdfdGFnKSAtPlxyXG5cclxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcclxuXHRcdHBhdGggPSBwYXRoLnJlcGxhY2UgL1xcLyQvLCBcIlwiXHJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXHJcblx0XHRcdHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoXHJcblxyXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcclxuXHJcbmlmIE1ldGVvci5pc0NsaWVudFxyXG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XHJcblx0XHRsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nXHJcblx0XHRpZiBsLmluZGV4T2YoXCJ6aFwiKSA+PTBcclxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXHJcblx0XHRlbHNlXHJcblx0XHRcdGxvY2FsZSA9IFwiZW4tdXNcIlxyXG5cdFx0cmV0dXJuIGxvY2FsZVxyXG5cclxuXHJcblx0IyDlgZznlKjkuJrliqHlr7nosaHnv7vor5Eg5q2k5Ye95pWw5bey5byD55SoXHJcblx0U2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gKHByZWZpeCkgLT5cclxuXHRcdHJldHVyblxyXG5cclxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cclxuXHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XHJcblxyXG5cdE1ldGVvci5zdGFydHVwIC0+XHJcblxyXG5cdFx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XHJcblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XHJcblxyXG5cdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpXHJcblxyXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cclxuXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPSBcImVuLXVzXCJcclxuXHRcdFx0XHRpZiBUQVBpMThuP1xyXG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpXHJcblx0XHRcdFx0STE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtyb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKCkgfSlcclxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXHJcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcInpoLWNuXCIpXHJcblx0XHRcdFx0cmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdFx0aWYgVEFQaTE4bj9cclxuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxyXG5cdFx0XHRcdEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7cm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpIH0pXHJcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJlblwiKVxyXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxyXG5cdFx0XHRcdHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIilcclxuXHRcdHVzZXJMYXN0TG9jYWxlID0gbnVsbFxyXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cclxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpXHJcblx0XHRcdHVzZXJMYXN0TG9jYWxlID1cclxuXHRcdFx0aWYgTWV0ZW9yLnVzZXIoKVxyXG5cdFx0XHRcdGlmIE1ldGVvci51c2VyKCkubG9jYWxlXHJcblx0XHRcdFx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKTtcclxuXHRcdFx0XHRcdGlmIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9IE1ldGVvci51c2VyKCkubG9jYWxlXHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XHJcblx0XHRcdFx0XHR1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkubG9jYWxlXHJcblxyXG5cdFx0aTE4bi5vbkNoYW5nZUxvY2FsZSAobmV3TG9jYWxlKS0+XHJcblxyXG5cdFx0XHQkLmV4dGVuZCB0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cyxcclxuXHRcdFx0XHRsYW5ndWFnZTpcclxuXHRcdFx0XHRcdFwiZGVjaW1hbFwiOiAgICAgICAgdChcImRhdGFUYWJsZXMuZGVjaW1hbFwiKSxcclxuXHRcdFx0XHRcdFwiZW1wdHlUYWJsZVwiOiAgICAgdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb1wiOiAgICAgICAgICAgdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcclxuXHRcdFx0XHRcdFwiaW5mb0VtcHR5XCI6ICAgICAgdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvRmlsdGVyZWRcIjogICB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXHJcblx0XHRcdFx0XHRcImluZm9Qb3N0Rml4XCI6ICAgIHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxyXG5cdFx0XHRcdFx0XCJ0aG91c2FuZHNcIjogICAgICB0KFwiZGF0YVRhYmxlcy50aG91c2FuZHNcIiksXHJcblx0XHRcdFx0XHRcImxlbmd0aE1lbnVcIjogICAgIHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXHJcblx0XHRcdFx0XHRcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxyXG5cdFx0XHRcdFx0XCJwcm9jZXNzaW5nXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxyXG5cdFx0XHRcdFx0XCJzZWFyY2hcIjogICAgICAgICB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXHJcblx0XHRcdFx0XHRcInplcm9SZWNvcmRzXCI6ICAgIHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxyXG5cdFx0XHRcdFx0XCJwYWdpbmF0ZVwiOlxyXG5cdFx0XHRcdFx0XHRcImZpcnN0XCI6ICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXHJcblx0XHRcdFx0XHRcdFwibGFzdFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxyXG5cdFx0XHRcdFx0XHRcIm5leHRcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubmV4dFwiKSxcclxuXHRcdFx0XHRcdFx0XCJwcmV2aW91c1wiOiAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXHJcblx0XHRcdFx0XHRcImFyaWFcIjpcclxuXHRcdFx0XHRcdFx0XCJzb3J0QXNjZW5kaW5nXCI6ICB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnRBc2NlbmRpbmdcIiksXHJcblx0XHRcdFx0XHRcdFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxyXG5cclxuXHRcdFx0Xy5lYWNoIFRhYnVsYXIudGFibGVzQnlOYW1lLCAodGFibGUpIC0+XHJcblx0XHRcdFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cclxuXHRcdFx0XHRcdGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT0gXCJfaWRcIilcclxuXHRcdFx0XHRcdFx0cmV0dXJuXHJcblxyXG5cdFx0XHRcdFx0Y29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLFwiX1wiKSk7XHJcblx0XHRcdFx0XHRpZiAhdGFibGUub3B0aW9ucy5sYW5ndWFnZVxyXG5cdFx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cclxuXHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKVxyXG5cdFx0XHRcdFx0cmV0dXJuIFxyXG5cclxuXHJcbiIsInZhciBJMThuLCBhYnNvbHV0ZVVybCwgZ2V0QnJvd3NlckxvY2FsZSwgaTE4bjtcblxuaTE4biA9IHJlcXVpcmUoJ21ldGVvci91bml2ZXJzZTppMThuJykuaTE4bjtcblxuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcblxudGhpcy5pMThuID0gaTE4bjtcblxudGhpcy50ID0gSTE4bi50O1xuXG50aGlzLnRyID0gdDtcblxudGhpcy50cmwgPSB0O1xuXG5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICB2YXIgZSwgcm9vdF91cmw7XG4gIGlmICh1cmwpIHtcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH1cbiAgfVxufTtcblxuaTE4bi5zZXRPcHRpb25zKHtcbiAgcHVyaWZ5OiBudWxsLFxuICBkZWZhdWx0TG9jYWxlOiAnemgtQ04nLFxuICBob3N0VXJsOiBhYnNvbHV0ZVVybCgpXG59KTtcblxuaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgVEFQaTE4bi5fX29yaWdpbmFsID0gVEFQaTE4bi5fXztcbiAgVEFQaTE4bi5fXyA9IGZ1bmN0aW9uKGtleSwgb3B0aW9ucywgbG9jYWxlKSB7XG4gICAgdmFyIHRyYW5zbGF0ZWQ7XG4gICAgdHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICAgIGlmICh0cmFuc2xhdGVkICE9PSBrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgIH1cbiAgICByZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsKGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgfTtcbiAgVEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IGZ1bmN0aW9uKGxhbmdfdGFnKSB7XG4gICAgdmFyIHBhdGg7XG4gICAgcGF0aCA9IHRoaXMuY29uZi5jZG5fcGF0aCAhPSBudWxsID8gdGhpcy5jb25mLmNkbl9wYXRoIDogdGhpcy5jb25mLmkxOG5fZmlsZXNfcm91dGU7XG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICAgIGlmIChwYXRoWzBdID09PSBcIi9cIikge1xuICAgICAgcGF0aCA9IGFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoICsgXCIvXCIgKyBsYW5nX3RhZyArIFwiLmpzb25cIjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBnZXRCcm93c2VyTG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGwsIGxvY2FsZTtcbiAgICBsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgIGlmIChsLmluZGV4T2YoXCJ6aFwiKSA+PSAwKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLWNuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZTtcbiAgfTtcbiAgU2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gZnVuY3Rpb24ocHJlZml4KSB7fTtcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICB9KTtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJMYXN0TG9jYWxlO1xuICAgIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICAgIH0pO1xuICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPT0gXCJlbi11c1wiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJ6aC1DTlwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcInpoLUNOXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiemgtY25cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcImVuXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiZW5cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJlblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdXNlckxhc3RMb2NhbGUgPSBudWxsO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKTtcbiAgICAgIHJldHVybiB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkgPyBNZXRlb3IudXNlcigpLmxvY2FsZSA/IChTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKSwgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT09IE1ldGVvci51c2VyKCkubG9jYWxlID8gd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSA6IHZvaWQgMCwgdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGkxOG4ub25DaGFuZ2VMb2NhbGUoZnVuY3Rpb24obmV3TG9jYWxlKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cywge1xuICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgIFwiZGVjaW1hbFwiOiB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuICAgICAgICAgIFwiZW1wdHlUYWJsZVwiOiB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuICAgICAgICAgIFwiaW5mb1wiOiB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxuICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcbiAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG4gICAgICAgICAgXCJpbmZvUG9zdEZpeFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcbiAgICAgICAgICBcInRob3VzYW5kc1wiOiB0KFwiZGF0YVRhYmxlcy50aG91c2FuZHNcIiksXG4gICAgICAgICAgXCJsZW5ndGhNZW51XCI6IHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG4gICAgICAgICAgXCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInByb2Nlc3NpbmdcIjogdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG4gICAgICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgIFwiZmlyc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG4gICAgICAgICAgICBcImxhc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcbiAgICAgICAgICAgIFwibmV4dFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuICAgICAgICAgICAgXCJwcmV2aW91c1wiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJhcmlhXCI6IHtcbiAgICAgICAgICAgIFwic29ydEFzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnRBc2NlbmRpbmdcIiksXG4gICAgICAgICAgICBcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaCh0YWJsZS5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgIGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT09IFwiX2lkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLCBcIl9cIikpO1xuICAgICAgICAgIGlmICghdGFibGUub3B0aW9ucy5sYW5ndWFnZSkge1xuICAgICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiQGNmcyA9IHt9XHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG4gIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIilcclxuXHJcblxyXG4jIOmAmui/h+aWh+S7tuaJqeWxleWQjeiOt+WPluaWh+S7tmNvbnRlbnRUeXBlXHJcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xyXG4jIOWPgueFp3Mz5LiK5Lyg6ZmE5Lu25ZCO55qEY29udGVudFR5cGVcclxuY2ZzLmdldENvbnRlbnRUeXBlID0gKGZpbGVuYW1lKSAtPlxyXG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxyXG4gICAgaWYgKCcuJyArIF9leHAgPT0gJy5hdScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ibXAnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYnoyJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L2NzcydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kdGQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG90eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5lcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ2lmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5odG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmphcicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJ1xyXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvanBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qcycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qc3AnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL21pZGknXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXAzJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcGVnJykgXHJcbiAgICAgIHJldHVybiAndmlkZW8vbXBlZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGRmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBsJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3BuZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wb3R4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwc3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxyXG4gICAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhbScpIFxyXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ydGYnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zZ21sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC9zZ21sJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zbGR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN2ZycpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGFyLmd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRneicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvdGlmZidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50c3YnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnR4dCcpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC13YXYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxhbScpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHN4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXHJcbiAgICAgIHJldHVybiAndGV4dC94bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuemlwJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xyXG4gICAgZWxzZSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBcclxuXHJcblxyXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKVxyXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXHJcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxyXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKVxyXG5cclxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cclxuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpXHJcbiAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXHJcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpIHtcbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcbiIsInN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddXHJcblxyXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxyXG4gICAgZmlsZV9zdG9yZVxyXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcclxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1blxyXG5cclxuICAgIGVsc2UgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiUzNcIlxyXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpXHJcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3c1xyXG4gICAgZWxzZVxyXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKENyZWF0b3Iuc3RlZWRvc1N0b3JhZ2VEaXIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfVwiKSxcclxuICAgICAgICAgICAgICAgICAgICBmaWxlS2V5TWFrZXI6IChmaWxlT2JqKS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgTG9va3VwIHRoZSBjb3B5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiBhbmQgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIHRoZSBzdG9yZSBhbmQga2V5IGlzIGZvdW5kIHJldHVybiB0aGUga2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHN0b3JlIGFuZCBzdG9yZS5rZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgVE8gQ1VTVE9NSVpFLCBSRVBMQUNFIENPREUgQUZURVIgVEhJUyBQT0lOVFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtzdG9yZTogc3RvcmVfbmFtZX0pXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBub3cgPSBuZXcgRGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyB5ZWFyICsgJy8nICsgbW9udGgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgU2V0IGFic29sdXRlIHBhdGhcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKVxyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXVkaW9zJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXSAjIGFsbG93IG9ubHkgYXVkaW9zIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ10gIyBhbGxvdyBvbmx5IGltYWdlcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICd2aWRlb3MnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddICMgYWxsb3cgb25seSB2aWRlb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2VcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxyXG5cclxuICAgIGNmc1tzdG9yZV9uYW1lXS5hbGxvd1xyXG4gICAgICAgIGluc2VydDogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB1cGRhdGU6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgcmVtb3ZlOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIGRvd25sb2FkOiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXHJcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV1cclxuICAgICAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cclxuICAgICAgICAgICAgZG9jLnVzZXJJZCA9IHVzZXJJZFxyXG5cclxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2ZpbGVzJ1xyXG4gICAgICAgIGRiW1wiY2ZzLiN7c3RvcmVfbmFtZX0uZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcyIsInZhciBzdG9yZXM7XG5cbnN0b3JlcyA9IFsnYXZhdGFycycsICdhdWRpb3MnLCAnaW1hZ2VzJywgJ3ZpZGVvcycsICdmaWxlcyddO1xuXG5fLmVhY2goc3RvcmVzLCBmdW5jdGlvbihzdG9yZV9uYW1lKSB7XG4gIGZpbGVfc3RvcmU7XG4gIHZhciBmaWxlX3N0b3JlLCByZWYsIHJlZjE7XG4gIGlmICgoKHJlZiA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYuc3RvcmUgOiB2b2lkIDApID09PSBcIk9TU1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoKChyZWYxID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZjEuc3RvcmUgOiB2b2lkIDApID09PSBcIlMzXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzKHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihDcmVhdG9yLnN0ZWVkb3NTdG9yYWdlRGlyLCBcImZpbGVzL1wiICsgc3RvcmVfbmFtZSksXG4gICAgICAgIGZpbGVLZXlNYWtlcjogZnVuY3Rpb24oZmlsZU9iaikge1xuICAgICAgICAgIHZhciBhYnNvbHV0ZVBhdGgsIGZpbGVuYW1lLCBmaWxlbmFtZUluU3RvcmUsIG1rZGlycCwgbW9udGgsIG5vdywgcGF0aCwgcGF0aG5hbWUsIHN0b3JlLCB5ZWFyO1xuICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiAmJiBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpO1xuICAgICAgICAgIGlmIChzdG9yZSAmJiBzdG9yZS5rZXkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtcbiAgICAgICAgICAgIHN0b3JlOiBzdG9yZV9uYW1lXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbm93ID0gbmV3IERhdGU7XG4gICAgICAgICAgeWVhciA9IG5vdy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxO1xuICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG4gICAgICAgICAgbWtkaXJwID0gcmVxdWlyZSgnbWtkaXJwJyk7XG4gICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4oQ3JlYXRvci5zdGVlZG9zU3RvcmFnZURpciwgKFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lICsgXCIvXCIpICsgeWVhciArICcvJyArIG1vbnRoKTtcbiAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpO1xuICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aCk7XG4gICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdWRpb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICd2aWRlb3MnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXVxuICAgIH0pO1xuICB9XG4gIGNmc1tzdG9yZV9uYW1lXS5hbGxvdyh7XG4gICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgZG93bmxvYWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGRiW3N0b3JlX25hbWVdID0gY2ZzW3N0b3JlX25hbWVdO1xuICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQoZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgIHJldHVybiBkb2MudXNlcklkID0gdXNlcklkO1xuICAgIH0pO1xuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnZmlsZXMnKSB7XG4gICAgcmV0dXJuIGRiW1wiY2ZzLlwiICsgc3RvcmVfbmFtZSArIFwiLmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXM7XG4gIH1cbn0pO1xuIl19
