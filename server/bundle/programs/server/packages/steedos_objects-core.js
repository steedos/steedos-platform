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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiSTE4biIsImFic29sdXRlVXJsIiwiZ2V0QnJvd3NlckxvY2FsZSIsImkxOG4iLCJyZXF1aXJlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWtkaXJwIiwibW9udGgiLCJub3ciLCJ5ZWFyIiwiX2dldEluZm8iLCJuYW1lIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkb3dubG9hZCIsImRiIiwiZmlsZXMiLCJiZWZvcmUiLCJ1c2VySWQiLCJkb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxJQUFBLEVBQUFDLFdBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsSUFBQTtBQUFBQSxPQUFPQyxRQUFRLHNCQUFSLEVBQWdDRCxJQUF2QztBQUNBSCxPQUFPSSxRQUFRLGVBQVIsQ0FBUDtBQUNBLEtBQUNELElBQUQsR0FBUUEsSUFBUjtBQUVBLEtBQUNFLENBQUQsR0FBS0wsS0FBS0ssQ0FBVjtBQUVBLEtBQUNDLEVBQUQsR0FBTUQsQ0FBTjtBQUVBLEtBQUNFLEdBQUQsR0FBT0YsQ0FBUDs7QUFFQUosY0FBYyxVQUFDTyxHQUFEO0FBQ2IsTUFBQUMsQ0FBQSxFQUFBQyxRQUFBOztBQUFBLE1BQUdGLEdBQUg7QUFFQ0EsVUFBTUEsSUFBSUcsT0FBSixDQUFZLEtBQVosRUFBa0IsRUFBbEIsQ0FBTjtBQ0tDOztBREpGLE1BQUlDLE9BQU9DLFNBQVg7QUFDQyxXQUFPRCxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQUFQO0FBREQ7QUFHQyxRQUFHSSxPQUFPRSxRQUFWO0FBQ0M7QUFDQ0osbUJBQVcsSUFBSUssR0FBSixDQUFRSCxPQUFPWCxXQUFQLEVBQVIsQ0FBWDs7QUFDQSxZQUFHTyxHQUFIO0FBQ0MsaUJBQU9FLFNBQVNNLFFBQVQsR0FBb0JSLEdBQTNCO0FBREQ7QUFHQyxpQkFBT0UsU0FBU00sUUFBaEI7QUFMRjtBQUFBLGVBQUFDLEtBQUE7QUFNTVIsWUFBQVEsS0FBQTtBQUNMLGVBQU9MLE9BQU9YLFdBQVAsQ0FBbUJPLEdBQW5CLENBQVA7QUFSRjtBQUFBO0FDa0JJLGFEUkhJLE9BQU9YLFdBQVAsQ0FBbUJPLEdBQW5CLENDUUc7QURyQkw7QUN1QkU7QUQzQlcsQ0FBZDs7QUFtQkFMLEtBQUtlLFVBQUwsQ0FDQztBQUFBQyxVQUFRLElBQVI7QUFD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LEtBRGMsQ0FBbEI7QUNLTDs7QURGQ2xCLE1BQUlpQixVQUFKLEVBQWdCa0MsS0FBaEIsQ0FDSTtBQUFBRSxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBREo7QUFFQUMsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQUhKO0FBSUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFMSjtBQU1BQyxjQUFVO0FBQ04sYUFBTyxJQUFQO0FBUEo7QUFBQSxHQURKOztBQVVBLE1BQUd2QyxlQUFjLFNBQWpCO0FBQ0l3QyxPQUFHeEMsVUFBSCxJQUFpQmpCLElBQUlpQixVQUFKLENBQWpCO0FBQ0F3QyxPQUFHeEMsVUFBSCxFQUFleUMsS0FBZixDQUFxQkMsTUFBckIsQ0FBNEJOLE1BQTVCLENBQW1DLFVBQUNPLE1BQUQsRUFBU0MsR0FBVDtBQ1FyQyxhRFBNQSxJQUFJRCxNQUFKLEdBQWFBLE1DT25CO0FEUkU7QUNVTDs7QURQQyxNQUFHM0MsZUFBYyxPQUFqQjtBQ1NBLFdEUkl3QyxHQUFHLFNBQU94QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDakIsSUFBSWlCLFVBQUosRUFBZ0J5QyxLQ1F6RDtBQUNEO0FEcEdILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaTE4biA9IHJlcXVpcmUoJ21ldGVvci91bml2ZXJzZTppMThuJykuaTE4bjtcclxuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcclxuQGkxOG4gPSBpMThuO1xyXG5cclxuQHQgPSBJMThuLnRcclxuXHJcbkB0ciA9IHRcclxuXHJcbkB0cmwgPSB0XHJcblxyXG5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cclxuXHRpZiB1cmxcclxuXHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxyXG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXHJcblx0aWYgKE1ldGVvci5pc0NvcmRvdmEpXHJcblx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XHJcblx0ZWxzZVxyXG5cdFx0aWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0XHRcdHRyeVxyXG5cdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcclxuXHRcdFx0XHRpZiB1cmxcclxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZVxyXG5cdFx0XHRjYXRjaCBlXHJcblx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcblx0XHRlbHNlXHJcblx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXHJcbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcclxuaTE4bi5zZXRPcHRpb25zXHJcblx0cHVyaWZ5OiBudWxsXHJcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xyXG5cdGhvc3RVcmw6IGFic29sdXRlVXJsKClcclxuXHJcbmlmIFRBUGkxOG4/XHJcblx0VEFQaTE4bi5fX29yaWdpbmFsID0gVEFQaTE4bi5fX1xyXG5cclxuXHRUQVBpMThuLl9fID0gKGtleSwgb3B0aW9ucywgbG9jYWxlKS0+XHJcblx0XHR0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XHJcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxyXG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRlZFxyXG5cclxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RIFRPRE8gcmVtb3ZlXHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsIGtleSwgb3B0aW9ucywgbG9jYWxlXHJcblxyXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XHJcblxyXG5cdFx0cGF0aCA9IGlmIEAuY29uZi5jZG5fcGF0aD8gdGhlbiBALmNvbmYuY2RuX3BhdGggZWxzZSBALmNvbmYuaTE4bl9maWxlc19yb3V0ZVxyXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcclxuXHRcdGlmIHBhdGhbMF0gPT0gXCIvXCJcclxuXHRcdFx0cGF0aCA9IGFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGhcclxuXHJcblx0XHRyZXR1cm4gXCIje3BhdGh9LyN7bGFuZ190YWd9Lmpzb25cIlxyXG5cclxuaWYgTWV0ZW9yLmlzQ2xpZW50XHJcblx0Z2V0QnJvd3NlckxvY2FsZSA9ICgpLT5cclxuXHRcdGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbidcclxuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxyXG5cdFx0XHRsb2NhbGUgPSBcInpoLWNuXCJcclxuXHRcdGVsc2VcclxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXHJcblx0XHRyZXR1cm4gbG9jYWxlXHJcblxyXG5cclxuXHQjIOWBnOeUqOS4muWKoeWvueixoee/u+ivkSDmraTlh73mlbDlt7LlvIPnlKhcclxuXHRTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSAocHJlZml4KSAtPlxyXG5cdFx0cmV0dXJuXHJcblxyXG5cdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdfJywgKGtleSwgYXJncyktPlxyXG5cdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcclxuXHJcblx0TWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHJcblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cclxuXHRcdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcclxuXHJcblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcclxuXHJcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxyXG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxyXG5cdFx0XHRcdGlmIFRBUGkxOG4/XHJcblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIilcclxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxyXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIilcclxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiemgtY25cIilcclxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBUQVBpMThuP1xyXG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpXHJcblx0XHRcdFx0STE4bi5jaGFuZ2VMYW5ndWFnZShcImVuXCIsIHtyb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKCkgfSlcclxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXHJcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcImVuXCIpXHJcblx0XHRcdFx0cmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJlblwiKVxyXG5cdFx0dXNlckxhc3RMb2NhbGUgPSBudWxsXHJcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxyXG5cdFx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIFwiemgtQ05cIilcclxuXHRcdFx0dXNlckxhc3RMb2NhbGUgPVxyXG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXHJcblx0XHRcdFx0aWYgTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpO1xyXG5cdFx0XHRcdFx0aWYgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKTtcclxuXHRcdFx0XHRcdHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcclxuXHJcblx0XHRpMThuLm9uQ2hhbmdlTG9jYWxlIChuZXdMb2NhbGUpLT5cclxuXHJcblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxyXG5cdFx0XHRcdGxhbmd1YWdlOlxyXG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxyXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvXCI6ICAgICAgICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxyXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXHJcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcclxuXHRcdFx0XHRcdFwiaW5mb1Bvc3RGaXhcIjogICAgdChcImRhdGFUYWJsZXMuaW5mb1Bvc3RGaXhcIiksXHJcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcclxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcclxuXHRcdFx0XHRcdFwibG9hZGluZ1JlY29yZHNcIjogdChcImRhdGFUYWJsZXMubG9hZGluZ1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXHJcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcclxuXHRcdFx0XHRcdFwiemVyb1JlY29yZHNcIjogICAgdChcImRhdGFUYWJsZXMuemVyb1JlY29yZHNcIiksXHJcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XHJcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcclxuXHRcdFx0XHRcdFx0XCJsYXN0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLmxhc3RcIiksXHJcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxyXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcclxuXHRcdFx0XHRcdFwiYXJpYVwiOlxyXG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcclxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXHJcblxyXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cclxuXHRcdFx0XHRfLmVhY2ggdGFibGUub3B0aW9ucy5jb2x1bW5zLCAoY29sdW1uKSAtPlxyXG5cdFx0XHRcdFx0aWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PSBcIl9pZFwiKVxyXG5cdFx0XHRcdFx0XHRyZXR1cm5cclxuXHJcblx0XHRcdFx0XHRjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csXCJfXCIpKTtcclxuXHRcdFx0XHRcdGlmICF0YWJsZS5vcHRpb25zLmxhbmd1YWdlXHJcblx0XHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fVxyXG5cdFx0XHRcdFx0dGFibGUub3B0aW9ucy5sYW5ndWFnZS56ZXJvUmVjb3JkcyA9IHQoXCJkYXRhVGFibGVzLnplcm9cIikgKyB0KHRhYmxlLmNvbGxlY3Rpb24uX25hbWUpXHJcblx0XHRcdFx0XHRyZXR1cm4gXHJcblxyXG5cclxuIiwidmFyIEkxOG4sIGFic29sdXRlVXJsLCBnZXRCcm93c2VyTG9jYWxlLCBpMThuO1xuXG5pMThuID0gcmVxdWlyZSgnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nKS5pMThuO1xuXG5JMThuID0gcmVxdWlyZSgnQHN0ZWVkb3MvaTE4bicpO1xuXG50aGlzLmkxOG4gPSBpMThuO1xuXG50aGlzLnQgPSBJMThuLnQ7XG5cbnRoaXMudHIgPSB0O1xuXG50aGlzLnRybCA9IHQ7XG5cbmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIHZhciBlLCByb290X3VybDtcbiAgaWYgKHVybCkge1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfVxuICB9XG59O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTicsXG4gIGhvc3RVcmw6IGFic29sdXRlVXJsKClcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGggKyBcIi9cIiArIGxhbmdfdGFnICsgXCIuanNvblwiO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIGdldEJyb3dzZXJMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgbG9jYWxlO1xuICAgIGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgaWYgKGwuaW5kZXhPZihcInpoXCIpID49IDApIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtY25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxlID0gXCJlbi11c1wiO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlO1xuICB9O1xuICBTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbihwcmVmaXgpIHt9O1xuICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gIH0pO1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlckxhc3RMb2NhbGU7XG4gICAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gICAgfSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9PSBcImVuLXVzXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiemgtY25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJlblwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcImVuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2VyTGFzdExvY2FsZSA9IG51bGw7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpO1xuICAgICAgcmV0dXJuIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKSA/IE1ldGVvci51c2VyKCkubG9jYWxlID8gKFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpLCB1c2VyTGFzdExvY2FsZSAmJiB1c2VyTGFzdExvY2FsZSAhPT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpIDogdm9pZCAwLCB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkubG9jYWxlKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICByZXR1cm4gaTE4bi5vbkNoYW5nZUxvY2FsZShmdW5jdGlvbihuZXdMb2NhbGUpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKFRhYnVsYXIudGFibGVzQnlOYW1lLCBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKHRhYmxlLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgaWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PT0gXCJfaWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csIFwiX1wiKSk7XG4gICAgICAgICAgaWYgKCF0YWJsZS5vcHRpb25zLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJAY2ZzID0ge31cclxuXHJcbk1ldGVvci5zdGFydHVwIC0+XHJcbiAgRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKVxyXG5cclxuXHJcbiMg6YCa6L+H5paH5Lu25omp5bGV5ZCN6I635Y+W5paH5Lu2Y29udGVudFR5cGVcclxuIyBodHRwOi8vcmVmZXJlbmNlLnNpdGVwb2ludC5jb20vaHRtbC9taW1lLXR5cGVzXHJcbiMg5Y+C54WnczPkuIrkvKDpmYTku7blkI7nmoRjb250ZW50VHlwZVxyXG5jZnMuZ2V0Q29udGVudFR5cGUgPSAoZmlsZW5hbWUpIC0+XHJcbiAgICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpXHJcbiAgICBpZiAoJy4nICsgX2V4cCA9PSAnLmF1JykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vYmFzaWMnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuYXZpJykgXHJcbiAgICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJtcCcpIFxyXG4gICAgICByZXR1cm4gJ2ltYWdlL2JtcCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5iejInKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmNzcycpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvY3NzJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmR0ZCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2MnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG9jeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb3R4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmVzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmV4ZScpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5naWYnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9naWYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuaHF4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmh0bWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L2h0bWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuamFyJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnXHJcbiAgICBlbHNlIGlmICgoJy4nICsgX2V4cCA9PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09ICcuanBlZycpKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS9qcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzcCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5taWRpJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8vbWlkaSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcDMnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby9tcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wZWcnKSBcclxuICAgICAgcmV0dXJuICd2aWRlby9tcGVnJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm9nZycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZydcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wZGYnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGwnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucG5nJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2UvcG5nJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBvdHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHBzeCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHQnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHR4JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHMnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnF0JykgXHJcbiAgICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmFtJykgXHJcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmRmJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJ0ZicpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvcnRmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNnbWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3NnbWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2l0JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0J1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNsZHgnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3ZnJykgXHJcbiAgICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zd2YnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50YXIuZ3onKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGd6JykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRpZmYnKSBcclxuICAgICAgcmV0dXJuICdpbWFnZS90aWZmJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRzdicpIFxyXG4gICAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHh0JykgXHJcbiAgICAgIHJldHVybiAndGV4dC9wbGFpbidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy53YXYnKSBcclxuICAgICAgcmV0dXJuICdhdWRpby94LXdhdidcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bGFtJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhscycpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHNiJykgXHJcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xyXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc3gnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXHJcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGx0eCcpIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bWwnKSBcclxuICAgICAgcmV0dXJuICd0ZXh0L3htbCdcclxuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy56aXAnKSBcclxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnXHJcbiAgICBlbHNlIFxyXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcclxuICAgIFxyXG5cclxuXHJcbiIsInRoaXMuY2ZzID0ge307XG5cbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKTtcbn0pO1xuXG5jZnMuZ2V0Q29udGVudFR5cGUgPSBmdW5jdGlvbihmaWxlbmFtZSkge1xuICB2YXIgX2V4cDtcbiAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCcuJyArIF9leHAgPT09ICcuYXUnKSB7XG4gICAgcmV0dXJuICdhdWRpby9iYXNpYyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdmknKSB7XG4gICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYm1wJykge1xuICAgIHJldHVybiAnaW1hZ2UvYm1wJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJ6MicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtYnppcDInO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuY3NzJykge1xuICAgIHJldHVybiAndGV4dC9jc3MnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZHRkJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvYycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2N4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZXhlJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmdpZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2dpZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ocXgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHRtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvaHRtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qYXInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmEtYXJjaGl2ZSc7XG4gIH0gZWxzZSBpZiAoKCcuJyArIF9leHAgPT09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT09ICcuanBlZycpKSB7XG4gICAgcmV0dXJuICdpbWFnZS9qcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhc2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmpzcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5taWRpJykge1xuICAgIHJldHVybiAnYXVkaW8vbWlkaSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcDMnKSB7XG4gICAgcmV0dXJuICdhdWRpby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wZWcnKSB7XG4gICAgcmV0dXJuICd2aWRlby9tcGVnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm9nZycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wZGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGwnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG5nJykge1xuICAgIHJldHVybiAnaW1hZ2UvcG5nJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBvdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHBzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnF0Jykge1xuICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmFtJykge1xuICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJ0ZicpIHtcbiAgICByZXR1cm4gJ3RleHQvcnRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNnbWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3NnbWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2l0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNsZHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3ZnJykge1xuICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zd2YnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50YXIuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRpZmYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS90aWZmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRzdicpIHtcbiAgICByZXR1cm4gJ3RleHQvdGFiLXNlcGFyYXRlZC12YWx1ZXMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHh0Jykge1xuICAgIHJldHVybiAndGV4dC9wbGFpbic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy53YXYnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXdhdic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bGFtJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhscycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHNiJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGx0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3htbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy56aXAnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi96aXAnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfVxufTtcbiIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaiktPlxyXG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpXHJcbiAgY29uc29sZS5lcnJvcihlcnJvcilcclxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXHJcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpXHJcblxyXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbiAnZXJyb3InLCAoZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSktPlxyXG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIilcclxuICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcclxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSkiLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaikge1xuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSkge1xuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuIiwic3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ11cclxuXHJcbl8uZWFjaCBzdG9yZXMsIChzdG9yZV9uYW1lKS0+XHJcbiAgICBmaWxlX3N0b3JlXHJcbiAgICBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJPU1NcIlxyXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTIHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYWxpeXVuXHJcblxyXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcclxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLlMzIHN0b3JlX25hbWUsIE1ldGVvci5zZXR0aW5ncy5jZnMuYXdzXHJcbiAgICBlbHNlXHJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKVxyXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXHJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy8je3N0b3JlX25hbWV9XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGVLZXlNYWtlcjogKGZpbGVPYmopLT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUgPSBmaWxlT2JqIGFuZCBmaWxlT2JqLl9nZXRJbmZvKHN0b3JlX25hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfS9cIiArIHllYXIgKyAnLycgKyBtb250aClcclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBTZXQgYWJzb2x1dGUgcGF0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRW5zdXJlIHRoZSBwYXRoIGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjIElmIG5vIHN0b3JlIGtleSBmb3VuZCB3ZSByZXNvbHZlIC8gZ2VuZXJhdGUgYSBrZXlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpXHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdWRpb3MnXHJcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcclxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgYWxsb3c6IHtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddICMgYWxsb3cgb25seSBhdWRpb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIGFsbG93OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXSAjIGFsbG93IG9ubHkgaW1hZ2VzIGluIHRoaXMgRlMuQ29sbGVjdGlvblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICBlbHNlIGlmIHN0b3JlX25hbWUgPT0gJ3ZpZGVvcydcclxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxyXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ10gIyBhbGxvdyBvbmx5IHZpZGVvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgZWxzZVxyXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXHJcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXHJcblxyXG4gICAgY2ZzW3N0b3JlX25hbWVdLmFsbG93XHJcbiAgICAgICAgaW5zZXJ0OiAtPlxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgIHVwZGF0ZTogLT5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICByZW1vdmU6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgZG93bmxvYWQ6IC0+XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcclxuICAgICAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXVxyXG4gICAgICAgIGRiW3N0b3JlX25hbWVdLmZpbGVzLmJlZm9yZS5pbnNlcnQgKHVzZXJJZCwgZG9jKSAtPlxyXG4gICAgICAgICAgICBkb2MudXNlcklkID0gdXNlcklkXHJcblxyXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnZmlsZXMnXHJcbiAgICAgICAgZGJbXCJjZnMuI3tzdG9yZV9uYW1lfS5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzIiwidmFyIHN0b3Jlcztcblxuc3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ107XG5cbl8uZWFjaChzdG9yZXMsIGZ1bmN0aW9uKHN0b3JlX25hbWUpIHtcbiAgZmlsZV9zdG9yZTtcbiAgdmFyIGZpbGVfc3RvcmUsIHJlZiwgcmVmMTtcbiAgaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMS5zdG9yZSA6IHZvaWQgMCkgPT09IFwiUzNcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lKSxcbiAgICAgICAgZmlsZUtleU1ha2VyOiBmdW5jdGlvbihmaWxlT2JqKSB7XG4gICAgICAgICAgdmFyIGFic29sdXRlUGF0aCwgZmlsZW5hbWUsIGZpbGVuYW1lSW5TdG9yZSwgbWtkaXJwLCBtb250aCwgbm93LCBwYXRoLCBwYXRobmFtZSwgc3RvcmUsIHllYXI7XG4gICAgICAgICAgc3RvcmUgPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSk7XG4gICAgICAgICAgaWYgKHN0b3JlICYmIHN0b3JlLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xuICAgICAgICAgICAgc3RvcmU6IHN0b3JlX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbiAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCAoXCJmaWxlcy9cIiArIHN0b3JlX25hbWUgKyBcIi9cIikgKyB5ZWFyICsgJy8nICsgbW9udGgpO1xuICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSk7XG4gICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKTtcbiAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F1ZGlvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ3ZpZGVvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXG4gICAgfSk7XG4gIH1cbiAgY2ZzW3N0b3JlX25hbWVdLmFsbG93KHtcbiAgICBpbnNlcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkb3dubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV07XG4gICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydChmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgcmV0dXJuIGRvYy51c2VySWQgPSB1c2VySWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdmaWxlcycpIHtcbiAgICByZXR1cm4gZGJbXCJjZnMuXCIgKyBzdG9yZV9uYW1lICsgXCIuZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcztcbiAgfVxufSk7XG4iXX0=
