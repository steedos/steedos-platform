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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiSTE4biIsImFic29sdXRlVXJsIiwiZ2V0QnJvd3NlckxvY2FsZSIsImkxOG4iLCJyZXF1aXJlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWtkaXJwIiwibW9udGgiLCJub3ciLCJ5ZWFyIiwiX2dldEluZm8iLCJuYW1lIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkb3dubG9hZCIsImRiIiwiZmlsZXMiLCJiZWZvcmUiLCJ1c2VySWQiLCJkb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxJQUFBLEVBQUFDLFdBQUEsRUFBQUMsZ0JBQUEsRUFBQUMsSUFBQTtBQUFBQSxPQUFPQyxRQUFRLHNCQUFSLEVBQWdDRCxJQUF2QztBQUNBSCxPQUFPSSxRQUFRLGVBQVIsQ0FBUDtBQUNBLEtBQUNELElBQUQsR0FBUUEsSUFBUjtBQUVBLEtBQUNFLENBQUQsR0FBS0wsS0FBS0ssQ0FBVjtBQUVBLEtBQUNDLEVBQUQsR0FBTUQsQ0FBTjtBQUVBLEtBQUNFLEdBQUQsR0FBT0YsQ0FBUDs7QUFFQUosY0FBYyxVQUFDTyxHQUFEO0FBQ2IsTUFBQUMsQ0FBQSxFQUFBQyxRQUFBOztBQUFBLE1BQUdGLEdBQUg7QUFFQ0EsVUFBTUEsSUFBSUcsT0FBSixDQUFZLEtBQVosRUFBa0IsRUFBbEIsQ0FBTjtBQ0tDOztBREpGLE1BQUlDLE9BQU9DLFNBQVg7QUFDQyxXQUFPRCxPQUFPWCxXQUFQLENBQW1CTyxHQUFuQixDQUFQO0FBREQ7QUFHQyxRQUFHSSxPQUFPRSxRQUFWO0FBQ0M7QUFDQ0osbUJBQVcsSUFBSUssR0FBSixDQUFRSCxPQUFPWCxXQUFQLEVBQVIsQ0FBWDs7QUFDQSxZQUFHTyxHQUFIO0FBQ0MsaUJBQU9FLFNBQVNNLFFBQVQsR0FBb0JSLEdBQTNCO0FBREQ7QUFHQyxpQkFBT0UsU0FBU00sUUFBaEI7QUFMRjtBQUFBLGVBQUFDLEtBQUE7QUFNTVIsWUFBQVEsS0FBQTtBQUNMLGVBQU9MLE9BQU9YLFdBQVAsQ0FBbUJPLEdBQW5CLENBQVA7QUFSRjtBQUFBO0FDa0JJLGFEUkhJLE9BQU9YLFdBQVAsQ0FBbUJPLEdBQW5CLENDUUc7QURyQkw7QUN1QkU7QUQzQlcsQ0FBZDs7QUFtQkFMLEtBQUtlLFVBQUwsQ0FDQztBQUFBQyxVQUFRLElBQVI7QUFD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LEtBRGMsQ0FBbEI7QUNLTDs7QURGQ2xCLE1BQUlpQixVQUFKLEVBQWdCa0MsS0FBaEIsQ0FDSTtBQUFBRSxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBREo7QUFFQUMsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQUhKO0FBSUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFMSjtBQU1BQyxjQUFVO0FBQ04sYUFBTyxJQUFQO0FBUEo7QUFBQSxHQURKOztBQVVBLE1BQUd2QyxlQUFjLFNBQWpCO0FBQ0l3QyxPQUFHeEMsVUFBSCxJQUFpQmpCLElBQUlpQixVQUFKLENBQWpCO0FBQ0F3QyxPQUFHeEMsVUFBSCxFQUFleUMsS0FBZixDQUFxQkMsTUFBckIsQ0FBNEJOLE1BQTVCLENBQW1DLFVBQUNPLE1BQUQsRUFBU0MsR0FBVDtBQ1FyQyxhRFBNQSxJQUFJRCxNQUFKLEdBQWFBLE1DT25CO0FEUkU7QUNVTDs7QURQQyxNQUFHM0MsZUFBYyxPQUFqQjtBQ1NBLFdEUkl3QyxHQUFHLFNBQU94QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDakIsSUFBSWlCLFVBQUosRUFBZ0J5QyxLQ1F6RDtBQUNEO0FEcEdILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaTE4biA9IHJlcXVpcmUoJ21ldGVvci91bml2ZXJzZTppMThuJykuaTE4bjtcbkkxOG4gPSByZXF1aXJlKCdAc3RlZWRvcy9pMThuJyk7XG5AaTE4biA9IGkxOG47XG5cbkB0ID0gSTE4bi50XG5cbkB0ciA9IHRcblxuQHRybCA9IHRcblxuYWJzb2x1dGVVcmwgPSAodXJsKS0+XG5cdGlmIHVybFxuXHRcdCMgdXJs5LulXCIvXCLlvIDlpLTnmoTor53vvIzljrvmjonlvIDlpLTnmoRcIi9cIlxuXHRcdHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLyxcIlwiKVxuXHRpZiAoTWV0ZW9yLmlzQ29yZG92YSlcblx0XHRyZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG5cdGVsc2Vcblx0XHRpZiBNZXRlb3IuaXNDbGllbnRcblx0XHRcdHRyeVxuXHRcdFx0XHRyb290X3VybCA9IG5ldyBVUkwoTWV0ZW9yLmFic29sdXRlVXJsKCkpXG5cdFx0XHRcdGlmIHVybFxuXHRcdFx0XHRcdHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybFxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lXG5cdFx0XHRjYXRjaCBlXG5cdFx0XHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKVxuXHRcdGVsc2Vcblx0XHRcdE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG4jIOmHjeWGmXRhcDppMThu5Ye95pWw77yM5ZCR5ZCO5YW85a65XG5pMThuLnNldE9wdGlvbnNcblx0cHVyaWZ5OiBudWxsXG5cdGRlZmF1bHRMb2NhbGU6ICd6aC1DTidcblx0aG9zdFVybDogYWJzb2x1dGVVcmwoKVxuXG5pZiBUQVBpMThuP1xuXHRUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fXG5cblx0VEFQaTE4bi5fXyA9IChrZXksIG9wdGlvbnMsIGxvY2FsZSktPlxuXHRcdHRyYW5zbGF0ZWQgPSB0KGtleSwgb3B0aW9ucywgbG9jYWxlKTtcblx0XHRpZiB0cmFuc2xhdGVkICE9IGtleVxuXHRcdFx0cmV0dXJuIHRyYW5zbGF0ZWRcblxuXHRcdCMgaTE4biDnv7vor5HkuI3lh7rmnaXvvIzlsJ3or5XnlKggdGFwOmkxOG4g57+76K+RIFRPRE8gcmVtb3ZlXG5cdFx0cmV0dXJuIFRBUGkxOG4uX19vcmlnaW5hbCBrZXksIG9wdGlvbnMsIGxvY2FsZVxuXG5cdFRBUGkxOG4uX2dldExhbmd1YWdlRmlsZVBhdGggPSAobGFuZ190YWcpIC0+XG5cblx0XHRwYXRoID0gaWYgQC5jb25mLmNkbl9wYXRoPyB0aGVuIEAuY29uZi5jZG5fcGF0aCBlbHNlIEAuY29uZi5pMThuX2ZpbGVzX3JvdXRlXG5cdFx0cGF0aCA9IHBhdGgucmVwbGFjZSAvXFwvJC8sIFwiXCJcblx0XHRpZiBwYXRoWzBdID09IFwiL1wiXG5cdFx0XHRwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aFxuXG5cdFx0cmV0dXJuIFwiI3twYXRofS8je2xhbmdfdGFnfS5qc29uXCJcblxuaWYgTWV0ZW9yLmlzQ2xpZW50XG5cdGdldEJyb3dzZXJMb2NhbGUgPSAoKS0+XG5cdFx0bCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgJ2VuJ1xuXHRcdGlmIGwuaW5kZXhPZihcInpoXCIpID49MFxuXHRcdFx0bG9jYWxlID0gXCJ6aC1jblwiXG5cdFx0ZWxzZVxuXHRcdFx0bG9jYWxlID0gXCJlbi11c1wiXG5cdFx0cmV0dXJuIGxvY2FsZVxuXG5cblx0IyDlgZznlKjkuJrliqHlr7nosaHnv7vor5Eg5q2k5Ye95pWw5bey5byD55SoXG5cdFNpbXBsZVNjaGVtYS5wcm90b3R5cGUuaTE4biA9IChwcmVmaXgpIC0+XG5cdFx0cmV0dXJuXG5cblx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0cmV0dXJuIFRBUGkxOG4uX18oa2V5LCBhcmdzKTtcblxuXHRNZXRlb3Iuc3RhcnR1cCAtPlxuXG5cdFx0VGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ18nLCAoa2V5LCBhcmdzKS0+XG5cdFx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpXG5cblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxuXHRcdFx0aWYgU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPSBcImVuLXVzXCJcblx0XHRcdFx0aWYgVEFQaTE4bj9cblx0XHRcdFx0XHRUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIilcblx0XHRcdFx0STE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtyb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKCkgfSlcblx0XHRcdFx0aTE4bi5zZXRMb2NhbGUoXCJ6aC1DTlwiKVxuXHRcdFx0XHRtb21lbnQubG9jYWxlKFwiemgtY25cIilcblx0XHRcdFx0cmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKVxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcImVuXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJlblwiKVxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcImVuXCIpXG5cdFx0dXNlckxhc3RMb2NhbGUgPSBudWxsXG5cdFx0VHJhY2tlci5hdXRvcnVuICgpLT5cblx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKVxuXHRcdFx0dXNlckxhc3RMb2NhbGUgPVxuXHRcdFx0aWYgTWV0ZW9yLnVzZXIoKVxuXHRcdFx0XHRpZiBNZXRlb3IudXNlcigpLmxvY2FsZVxuXHRcdFx0XHRcdFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpO1xuXHRcdFx0XHRcdGlmIHVzZXJMYXN0TG9jYWxlICYmIHVzZXJMYXN0TG9jYWxlICE9IE1ldGVvci51c2VyKCkubG9jYWxlXG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpO1xuXHRcdFx0XHRcdHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcblxuXHRcdGkxOG4ub25DaGFuZ2VMb2NhbGUgKG5ld0xvY2FsZSktPlxuXG5cdFx0XHQkLmV4dGVuZCB0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cyxcblx0XHRcdFx0bGFuZ3VhZ2U6XG5cdFx0XHRcdFx0XCJkZWNpbWFsXCI6ICAgICAgICB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuXHRcdFx0XHRcdFwiZW1wdHlUYWJsZVwiOiAgICAgdChcImRhdGFUYWJsZXMuZW1wdHlUYWJsZVwiKSxcblx0XHRcdFx0XHRcImluZm9cIjogICAgICAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG5cdFx0XHRcdFx0XCJpbmZvRW1wdHlcIjogICAgICB0KFwiZGF0YVRhYmxlcy5pbmZvRW1wdHlcIiksXG5cdFx0XHRcdFx0XCJpbmZvRmlsdGVyZWRcIjogICB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG5cdFx0XHRcdFx0XCJpbmZvUG9zdEZpeFwiOiAgICB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcblx0XHRcdFx0XHRcInRob3VzYW5kc1wiOiAgICAgIHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcblx0XHRcdFx0XHRcImxlbmd0aE1lbnVcIjogICAgIHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG5cdFx0XHRcdFx0XCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInByb2Nlc3NpbmdcIjogICAgIHQoXCJkYXRhVGFibGVzLnByb2Nlc3NpbmdcIiksXG5cdFx0XHRcdFx0XCJzZWFyY2hcIjogICAgICAgICB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG5cdFx0XHRcdFx0XCJ6ZXJvUmVjb3Jkc1wiOiAgICB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcblx0XHRcdFx0XHRcInBhZ2luYXRlXCI6XG5cdFx0XHRcdFx0XHRcImZpcnN0XCI6ICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG5cdFx0XHRcdFx0XHRcImxhc3RcIjogICAgICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcblx0XHRcdFx0XHRcdFwibmV4dFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuXHRcdFx0XHRcdFx0XCJwcmV2aW91c1wiOiAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG5cdFx0XHRcdFx0XCJhcmlhXCI6XG5cdFx0XHRcdFx0XHRcInNvcnRBc2NlbmRpbmdcIjogIHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcblx0XHRcdFx0XHRcdFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuXG5cdFx0XHRfLmVhY2ggVGFidWxhci50YWJsZXNCeU5hbWUsICh0YWJsZSkgLT5cblx0XHRcdFx0Xy5lYWNoIHRhYmxlLm9wdGlvbnMuY29sdW1ucywgKGNvbHVtbikgLT5cblx0XHRcdFx0XHRpZiAoIWNvbHVtbi5kYXRhIHx8IGNvbHVtbi5kYXRhID09IFwiX2lkXCIpXG5cdFx0XHRcdFx0XHRyZXR1cm5cblxuXHRcdFx0XHRcdGNvbHVtbi5zVGl0bGUgPSB0KFwiXCIgKyB0YWJsZS5jb2xsZWN0aW9uLl9uYW1lICsgXCJfXCIgKyBjb2x1bW4uZGF0YS5yZXBsYWNlKC9cXC4vZyxcIl9cIikpO1xuXHRcdFx0XHRcdGlmICF0YWJsZS5vcHRpb25zLmxhbmd1YWdlXG5cdFx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge31cblx0XHRcdFx0XHR0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSlcblx0XHRcdFx0XHRyZXR1cm4gXG5cblxuIiwidmFyIEkxOG4sIGFic29sdXRlVXJsLCBnZXRCcm93c2VyTG9jYWxlLCBpMThuO1xuXG5pMThuID0gcmVxdWlyZSgnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nKS5pMThuO1xuXG5JMThuID0gcmVxdWlyZSgnQHN0ZWVkb3MvaTE4bicpO1xuXG50aGlzLmkxOG4gPSBpMThuO1xuXG50aGlzLnQgPSBJMThuLnQ7XG5cbnRoaXMudHIgPSB0O1xuXG50aGlzLnRybCA9IHQ7XG5cbmFic29sdXRlVXJsID0gZnVuY3Rpb24odXJsKSB7XG4gIHZhciBlLCByb290X3VybDtcbiAgaWYgKHVybCkge1xuICAgIHVybCA9IHVybC5yZXBsYWNlKC9eXFwvLywgXCJcIik7XG4gIH1cbiAgaWYgKE1ldGVvci5pc0NvcmRvdmEpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcm9vdF91cmwgPSBuZXcgVVJMKE1ldGVvci5hYnNvbHV0ZVVybCgpKTtcbiAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgIHJldHVybiByb290X3VybC5wYXRobmFtZSArIHVybDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGUgPSBlcnJvcjtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKHVybCk7XG4gICAgfVxuICB9XG59O1xuXG5pMThuLnNldE9wdGlvbnMoe1xuICBwdXJpZnk6IG51bGwsXG4gIGRlZmF1bHRMb2NhbGU6ICd6aC1DTicsXG4gIGhvc3RVcmw6IGFic29sdXRlVXJsKClcbn0pO1xuXG5pZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICBUQVBpMThuLl9fb3JpZ2luYWwgPSBUQVBpMThuLl9fO1xuICBUQVBpMThuLl9fID0gZnVuY3Rpb24oa2V5LCBvcHRpb25zLCBsb2NhbGUpIHtcbiAgICB2YXIgdHJhbnNsYXRlZDtcbiAgICB0cmFuc2xhdGVkID0gdChrZXksIG9wdGlvbnMsIGxvY2FsZSk7XG4gICAgaWYgKHRyYW5zbGF0ZWQgIT09IGtleSkge1xuICAgICAgcmV0dXJuIHRyYW5zbGF0ZWQ7XG4gICAgfVxuICAgIHJldHVybiBUQVBpMThuLl9fb3JpZ2luYWwoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICB9O1xuICBUQVBpMThuLl9nZXRMYW5ndWFnZUZpbGVQYXRoID0gZnVuY3Rpb24obGFuZ190YWcpIHtcbiAgICB2YXIgcGF0aDtcbiAgICBwYXRoID0gdGhpcy5jb25mLmNkbl9wYXRoICE9IG51bGwgPyB0aGlzLmNvbmYuY2RuX3BhdGggOiB0aGlzLmNvbmYuaTE4bl9maWxlc19yb3V0ZTtcbiAgICBwYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8kLywgXCJcIik7XG4gICAgaWYgKHBhdGhbMF0gPT09IFwiL1wiKSB7XG4gICAgICBwYXRoID0gYWJzb2x1dGVVcmwoKS5yZXBsYWNlKC9cXC8rJC8sIFwiXCIpICsgcGF0aDtcbiAgICB9XG4gICAgcmV0dXJuIHBhdGggKyBcIi9cIiArIGxhbmdfdGFnICsgXCIuanNvblwiO1xuICB9O1xufVxuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIGdldEJyb3dzZXJMb2NhbGUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbCwgbG9jYWxlO1xuICAgIGwgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJMYW5ndWFnZSB8fCB3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8ICdlbic7XG4gICAgaWYgKGwuaW5kZXhPZihcInpoXCIpID49IDApIHtcbiAgICAgIGxvY2FsZSA9IFwiemgtY25cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYWxlID0gXCJlbi11c1wiO1xuICAgIH1cbiAgICByZXR1cm4gbG9jYWxlO1xuICB9O1xuICBTaW1wbGVTY2hlbWEucHJvdG90eXBlLmkxOG4gPSBmdW5jdGlvbihwcmVmaXgpIHt9O1xuICBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignXycsIGZ1bmN0aW9uKGtleSwgYXJncykge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gIH0pO1xuICBNZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlckxhc3RMb2NhbGU7XG4gICAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICAgIHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG4gICAgfSk7XG4gICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBnZXRCcm93c2VyTG9jYWxlKCkpO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIGlmIChTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9PSBcImVuLXVzXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiemgtQ05cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcInpoLUNOXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiemgtQ05cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiemgtY25cIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIFRBUGkxOG4gIT09IFwidW5kZWZpbmVkXCIgJiYgVEFQaTE4biAhPT0gbnVsbCkge1xuICAgICAgICAgIFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJlblwiKTtcbiAgICAgICAgfVxuICAgICAgICBJMThuLmNoYW5nZUxhbmd1YWdlKFwiZW5cIiwge1xuICAgICAgICAgIHJvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKVxuICAgICAgICB9KTtcbiAgICAgICAgaTE4bi5zZXRMb2NhbGUoXCJlblwiKTtcbiAgICAgICAgbW9tZW50LmxvY2FsZShcImVuXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWlyZShcIm1vbWVudFwiKS5sb2NhbGUoXCJlblwiKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB1c2VyTGFzdExvY2FsZSA9IG51bGw7XG4gICAgVHJhY2tlci5hdXRvcnVuKGZ1bmN0aW9uKCkge1xuICAgICAgU2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpO1xuICAgICAgcmV0dXJuIHVzZXJMYXN0TG9jYWxlID0gTWV0ZW9yLnVzZXIoKSA/IE1ldGVvci51c2VyKCkubG9jYWxlID8gKFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgTWV0ZW9yLnVzZXIoKS5sb2NhbGUpLCB1c2VyTGFzdExvY2FsZSAmJiB1c2VyTGFzdExvY2FsZSAhPT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGUgPyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKHRydWUpIDogdm9pZCAwLCB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkubG9jYWxlKSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICB9KTtcbiAgICByZXR1cm4gaTE4bi5vbkNoYW5nZUxvY2FsZShmdW5jdGlvbihuZXdMb2NhbGUpIHtcbiAgICAgICQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XG4gICAgICAgIGxhbmd1YWdlOiB7XG4gICAgICAgICAgXCJkZWNpbWFsXCI6IHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG4gICAgICAgICAgXCJlbXB0eVRhYmxlXCI6IHQoXCJkYXRhVGFibGVzLmVtcHR5VGFibGVcIiksXG4gICAgICAgICAgXCJpbmZvXCI6IHQoXCJkYXRhVGFibGVzLmluZm9cIiksXG4gICAgICAgICAgXCJpbmZvRW1wdHlcIjogdChcImRhdGFUYWJsZXMuaW5mb0VtcHR5XCIpLFxuICAgICAgICAgIFwiaW5mb0ZpbHRlcmVkXCI6IHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcbiAgICAgICAgICBcImluZm9Qb3N0Rml4XCI6IHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuICAgICAgICAgIFwidGhvdXNhbmRzXCI6IHQoXCJkYXRhVGFibGVzLnRob3VzYW5kc1wiKSxcbiAgICAgICAgICBcImxlbmd0aE1lbnVcIjogdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcbiAgICAgICAgICBcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuICAgICAgICAgIFwicHJvY2Vzc2luZ1wiOiB0KFwiZGF0YVRhYmxlcy5wcm9jZXNzaW5nXCIpLFxuICAgICAgICAgIFwic2VhcmNoXCI6IHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcbiAgICAgICAgICBcInplcm9SZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuICAgICAgICAgIFwicGFnaW5hdGVcIjoge1xuICAgICAgICAgICAgXCJmaXJzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcbiAgICAgICAgICAgIFwibGFzdFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuICAgICAgICAgICAgXCJuZXh0XCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG4gICAgICAgICAgICBcInByZXZpb3VzXCI6IHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLnByZXZpb3VzXCIpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImFyaWFcIjoge1xuICAgICAgICAgICAgXCJzb3J0QXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydEFzY2VuZGluZ1wiKSxcbiAgICAgICAgICAgIFwic29ydERlc2NlbmRpbmdcIjogdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0RGVzY2VuZGluZ1wiKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gXy5lYWNoKFRhYnVsYXIudGFibGVzQnlOYW1lLCBmdW5jdGlvbih0YWJsZSkge1xuICAgICAgICByZXR1cm4gXy5lYWNoKHRhYmxlLm9wdGlvbnMuY29sdW1ucywgZnVuY3Rpb24oY29sdW1uKSB7XG4gICAgICAgICAgaWYgKCFjb2x1bW4uZGF0YSB8fCBjb2x1bW4uZGF0YSA9PT0gXCJfaWRcIikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb2x1bW4uc1RpdGxlID0gdChcIlwiICsgdGFibGUuY29sbGVjdGlvbi5fbmFtZSArIFwiX1wiICsgY29sdW1uLmRhdGEucmVwbGFjZSgvXFwuL2csIFwiX1wiKSk7XG4gICAgICAgICAgaWYgKCF0YWJsZS5vcHRpb25zLmxhbmd1YWdlKSB7XG4gICAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlID0ge307XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJAY2ZzID0ge31cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cbiAgRlMuSFRUUC5zZXRCYXNlVXJsKFwiL2FwaVwiKVxuXG5cbiMg6YCa6L+H5paH5Lu25omp5bGV5ZCN6I635Y+W5paH5Lu2Y29udGVudFR5cGVcbiMgaHR0cDovL3JlZmVyZW5jZS5zaXRlcG9pbnQuY29tL2h0bWwvbWltZS10eXBlc1xuIyDlj4LnhadzM+S4iuS8oOmZhOS7tuWQjueahGNvbnRlbnRUeXBlXG5jZnMuZ2V0Q29udGVudFR5cGUgPSAoZmlsZW5hbWUpIC0+XG4gICAgX2V4cCA9IGZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkudG9Mb3dlckNhc2UoKVxuICAgIGlmICgnLicgKyBfZXhwID09ICcuYXUnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vYmFzaWMnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmF2aScpIFxuICAgICAgcmV0dXJuICd2aWRlby94LW1zdmlkZW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJtcCcpIFxuICAgICAgcmV0dXJuICdpbWFnZS9ibXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmJ6MicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5jc3MnKSBcbiAgICAgIHJldHVybiAndGV4dC9jc3MnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmR0ZCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvYycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmRvY3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb3R4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5leGUnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5naWYnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvZ2lmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5neicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmhxeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tYWMtYmluaGV4NDAnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmh0bWwnKSBcbiAgICAgIHJldHVybiAndGV4dC9odG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qYXInKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnXG4gICAgZWxzZSBpZiAoKCcuJyArIF9leHAgPT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PSAnLmpwZWcnKSkgXG4gICAgICByZXR1cm4gJ2ltYWdlL2pwZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuanNwJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubWlkaScpIFxuICAgICAgcmV0dXJuICdhdWRpby9taWRpJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5tcDMnKSBcbiAgICAgIHJldHVybiAnYXVkaW8vbXBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXBlZycpIFxuICAgICAgcmV0dXJuICd2aWRlby9tcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5vZ2cnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wZGYnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBuZycpIFxuICAgICAgcmV0dXJuICdpbWFnZS9wbmcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBvdHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHN4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9wb3N0c2NyaXB0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5xdCcpIFxuICAgICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJhJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYW0nKSBcbiAgICAgIHJldHVybiAnYXVkaW8veC1wbi1yZWFsYXVkaW8nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJkZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnJ0ZicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3J0ZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc2dtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3NnbWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNpdCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNsZHgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zdmcnKSBcbiAgICAgIHJldHVybiAnaW1hZ2Uvc3ZnK3htbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3dmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50YXIuZ3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50Z3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1jb21wcmVzc2VkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50aWZmJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3RpZmYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnRzdicpIFxuICAgICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50eHQnKSBcbiAgICAgIHJldHVybiAndGV4dC9wbGFpbidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcud2F2JykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bGFtJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxzYicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc3gnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueG1sJykgXG4gICAgICByZXR1cm4gJ3RleHQveG1sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy56aXAnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJ1xuICAgIGVsc2UgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBcblxuXG4iLCJ0aGlzLmNmcyA9IHt9O1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIik7XG59KTtcblxuY2ZzLmdldENvbnRlbnRUeXBlID0gZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgdmFyIF9leHA7XG4gIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKCk7XG4gIGlmICgnLicgKyBfZXhwID09PSAnLmF1Jykge1xuICAgIHJldHVybiAnYXVkaW8vYmFzaWMnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYXZpJykge1xuICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmJtcCcpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2JtcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5iejInKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWJ6aXAyJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmNzcycpIHtcbiAgICByZXR1cm4gJ3RleHQvY3NzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmR0ZCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb2MnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmVzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmV4ZScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5naWYnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9naWYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWd6aXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuaHF4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmh0bWwnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2h0bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuamFyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1qYXZhLWFyY2hpdmUnO1xuICB9IGVsc2UgaWYgKCgnLicgKyBfZXhwID09PSAnLmpwZycpIHx8ICgnLicgKyBfZXhwID09PSAnLmpwZWcnKSkge1xuICAgIHJldHVybiAnaW1hZ2UvanBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YXNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5qc3AnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubWlkaScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21pZGknO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXAzJykge1xuICAgIHJldHVybiAnYXVkaW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5tcGVnJykge1xuICAgIHJldHVybiAndmlkZW8vbXBlZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5vZ2cnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vZ2cnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucGRmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcGRmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBsJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBuZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3BuZyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wb3R4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwc3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLXBvd2VycG9pbnQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucHB0eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5xdCcpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3F1aWNrdGltZSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJhbScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnJkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ydGYnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3J0Zic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zZ21sJykge1xuICAgIHJldHVybiAndGV4dC9zZ21sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnNpdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc3R1ZmZpdCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zbGR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN2ZycpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc3dmJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGFyLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRneicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50aWZmJykge1xuICAgIHJldHVybiAnaW1hZ2UvdGlmZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50c3YnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3RhYi1zZXBhcmF0ZWQtdmFsdWVzJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnR4dCcpIHtcbiAgICByZXR1cm4gJ3RleHQvcGxhaW4nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcud2F2Jykge1xuICAgIHJldHVybiAnYXVkaW8veC13YXYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxhbScpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzYicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueG1sJykge1xuICAgIHJldHVybiAndGV4dC94bWwnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuemlwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vemlwJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH1cbn07XG4iLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24gJ2Vycm9yJywgKHN0b3JlTmFtZSwgZXJyb3IsIGZpbGVPYmopLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLlN0b3JhZ2VBZGFwdGVyIGVtaXQgZXJyb3JcIilcbiAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSlcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24gJ2Vycm9yJywgKGVycm9yLCBmaWxlT2JqLCBzdG9yZU5hbWUpLT5cbiAgY29uc29sZS5lcnJvcihcIkZTLkNvbGxlY3Rpb24gZW1pdCBlcnJvclwiKVxuICBjb25zb2xlLmVycm9yKGVycm9yKVxuICBjb25zb2xlLmVycm9yKGZpbGVPYmopXG4gIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKSIsIkZTLlN0b3JhZ2VBZGFwdGVyLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuXG5GUy5Db2xsZWN0aW9uLnByb3RvdHlwZS5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIik7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICBjb25zb2xlLmVycm9yKGZpbGVPYmopO1xuICByZXR1cm4gY29uc29sZS5lcnJvcihzdG9yZU5hbWUpO1xufSk7XG4iLCJzdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXVxuXG5fLmVhY2ggc3RvcmVzLCAoc3RvcmVfbmFtZSktPlxuICAgIGZpbGVfc3RvcmVcbiAgICBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJPU1NcIlxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1blxuXG4gICAgZWxzZSBpZiBNZXRlb3Iuc2V0dGluZ3MucHVibGljLmNmcz8uc3RvcmUgPT0gXCJTM1wiXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyBzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3c1xuICAgIGVsc2VcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvI3tzdG9yZV9uYW1lfVwiKSxcbiAgICAgICAgICAgICAgICAgICAgZmlsZUtleU1ha2VyOiAoZmlsZU9iaiktPlxuICAgICAgICAgICAgICAgICAgICAgICAgIyBMb29rdXAgdGhlIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlID0gZmlsZU9iaiBhbmQgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiB0aGUgc3RvcmUgYW5kIGtleSBpcyBmb3VuZCByZXR1cm4gdGhlIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgc3RvcmUgYW5kIHN0b3JlLmtleVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdG9yZS5rZXlcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBUTyBDVVNUT01JWkUsIFJFUExBQ0UgQ09ERSBBRlRFUiBUSElTIFBPSU5UXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVuYW1lID0gZmlsZU9iai5uYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe3N0b3JlOiBzdG9yZV9uYW1lfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgbm93ID0gbmV3IERhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDFcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX0vXCIgKyB5ZWFyICsgJy8nICsgbW9udGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIFNldCBhYnNvbHV0ZSBwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgICBhYnNvbHV0ZVBhdGggPSBwYXRoLnJlc29sdmUocGF0aG5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEVuc3VyZSB0aGUgcGF0aCBleGlzdHNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1rZGlycC5zeW5jKGFic29sdXRlUGF0aClcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBJZiBubyBzdG9yZSBrZXkgZm91bmQgd2UgcmVzb2x2ZSAvIGdlbmVyYXRlIGEga2V5XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSlcblxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdWRpb3MnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ10gIyBhbGxvdyBvbmx5IGF1ZGlvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT0gJ2F2YXRhcnMnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWydpbWFnZS8qJ10gIyBhbGxvdyBvbmx5IGltYWdlcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZSBpZiBzdG9yZV9uYW1lID09ICd2aWRlb3MnXG4gICAgICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uIHN0b3JlX25hbWUsXG4gICAgICAgICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgICAgICAgIGZpbHRlcjoge1xuICAgICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ10gIyBhbGxvdyBvbmx5IHZpZGVvcyBpbiB0aGlzIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgZWxzZVxuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cblxuICAgIGNmc1tzdG9yZV9uYW1lXS5hbGxvd1xuICAgICAgICBpbnNlcnQ6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB1cGRhdGU6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICByZW1vdmU6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICBkb3dubG9hZDogLT5cbiAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xuICAgICAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXVxuICAgICAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0ICh1c2VySWQsIGRvYykgLT5cbiAgICAgICAgICAgIGRvYy51c2VySWQgPSB1c2VySWRcblxuICAgIGlmIHN0b3JlX25hbWUgPT0gJ2ZpbGVzJ1xuICAgICAgICBkYltcImNmcy4je3N0b3JlX25hbWV9LmZpbGVyZWNvcmRcIl0gPSBjZnNbc3RvcmVfbmFtZV0uZmlsZXMiLCJ2YXIgc3RvcmVzO1xuXG5zdG9yZXMgPSBbJ2F2YXRhcnMnLCAnYXVkaW9zJywgJ2ltYWdlcycsICd2aWRlb3MnLCAnZmlsZXMnXTtcblxuXy5lYWNoKHN0b3JlcywgZnVuY3Rpb24oc3RvcmVfbmFtZSkge1xuICBmaWxlX3N0b3JlO1xuICB2YXIgZmlsZV9zdG9yZSwgcmVmLCByZWYxO1xuICBpZiAoKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJPU1NcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuT1NTKHN0b3JlX25hbWUpO1xuICAgIH0gZWxzZSBpZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmFsaXl1bik7XG4gICAgfVxuICB9IGVsc2UgaWYgKCgocmVmMSA9IE1ldGVvci5zZXR0aW5nc1tcInB1YmxpY1wiXS5jZnMpICE9IG51bGwgPyByZWYxLnN0b3JlIDogdm9pZCAwKSA9PT0gXCJTM1wiKSB7XG4gICAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5TMyhzdG9yZV9uYW1lLCBNZXRlb3Iuc2V0dGluZ3MuY2ZzLmF3cyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUsIHtcbiAgICAgICAgcGF0aDogcmVxdWlyZSgncGF0aCcpLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy9cIiArIHN0b3JlX25hbWUpLFxuICAgICAgICBmaWxlS2V5TWFrZXI6IGZ1bmN0aW9uKGZpbGVPYmopIHtcbiAgICAgICAgICB2YXIgYWJzb2x1dGVQYXRoLCBmaWxlbmFtZSwgZmlsZW5hbWVJblN0b3JlLCBta2RpcnAsIG1vbnRoLCBub3csIHBhdGgsIHBhdGhuYW1lLCBzdG9yZSwgeWVhcjtcbiAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogJiYgZmlsZU9iai5fZ2V0SW5mbyhzdG9yZV9uYW1lKTtcbiAgICAgICAgICBpZiAoc3RvcmUgJiYgc3RvcmUua2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5O1xuICAgICAgICAgIH1cbiAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgIGZpbGVuYW1lSW5TdG9yZSA9IGZpbGVPYmoubmFtZSh7XG4gICAgICAgICAgICBzdG9yZTogc3RvcmVfbmFtZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5vdyA9IG5ldyBEYXRlO1xuICAgICAgICAgIHllYXIgPSBub3cuZ2V0RnVsbFllYXIoKTtcbiAgICAgICAgICBtb250aCA9IG5vdy5nZXRNb250aCgpICsgMTtcbiAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuICAgICAgICAgIG1rZGlycCA9IHJlcXVpcmUoJ21rZGlycCcpO1xuICAgICAgICAgIHBhdGhuYW1lID0gcGF0aC5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIChcImZpbGVzL1wiICsgc3RvcmVfbmFtZSArIFwiL1wiKSArIHllYXIgKyAnLycgKyBtb250aCk7XG4gICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKTtcbiAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgICAgICAgIHJldHVybiB5ZWFyICsgJy8nICsgbW9udGggKyAnLycgKyBmaWxlT2JqLmNvbGxlY3Rpb25OYW1lICsgJy0nICsgZmlsZU9iai5faWQgKyAnLScgKyAoZmlsZW5hbWVJblN0b3JlIHx8IGZpbGVuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXVkaW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2F1ZGlvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ltYWdlcycgfHwgc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICBmaWx0ZXI6IHtcbiAgICAgICAgYWxsb3c6IHtcbiAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIGlmIChzdG9yZV9uYW1lID09PSAndmlkZW9zJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ3ZpZGVvLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24oc3RvcmVfbmFtZSwge1xuICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV1cbiAgICB9KTtcbiAgfVxuICBjZnNbc3RvcmVfbmFtZV0uYWxsb3coe1xuICAgIGluc2VydDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGRvd25sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmIChzdG9yZV9uYW1lID09PSAnYXZhdGFycycpIHtcbiAgICBkYltzdG9yZV9uYW1lXSA9IGNmc1tzdG9yZV9uYW1lXTtcbiAgICBkYltzdG9yZV9uYW1lXS5maWxlcy5iZWZvcmUuaW5zZXJ0KGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICByZXR1cm4gZG9jLnVzZXJJZCA9IHVzZXJJZDtcbiAgICB9KTtcbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2ZpbGVzJykge1xuICAgIHJldHVybiBkYltcImNmcy5cIiArIHN0b3JlX25hbWUgKyBcIi5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzO1xuICB9XG59KTtcbiJdfQ==
