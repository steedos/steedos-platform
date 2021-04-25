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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19vYmplY3RzLWNvcmUvaTE4bi5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL2kxOG4uY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvY2ZzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmcy5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlL2Nmcy9jZnNfZml4LmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL2Nmc19maXguY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGVlZG9zX29iamVjdHMtY29yZS9jZnMvc3RvcmVzLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvY2ZzL3N0b3Jlcy5jb2ZmZWUiXSwibmFtZXMiOlsiaTE4biIsIm1vZHVsZSIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJJMThuIiwiYWJzb2x1dGVVcmwiLCJnZXRCcm93c2VyTG9jYWxlIiwidCIsInRyIiwidHJsIiwidXJsIiwiZSIsInJvb3RfdXJsIiwicmVwbGFjZSIsIk1ldGVvciIsImlzQ29yZG92YSIsImlzQ2xpZW50IiwiVVJMIiwicGF0aG5hbWUiLCJlcnJvciIsInNldE9wdGlvbnMiLCJwdXJpZnkiLCJkZWZhdWx0TG9jYWxlIiwiaG9zdFVybCIsIlRBUGkxOG4iLCJfX29yaWdpbmFsIiwiX18iLCJrZXkiLCJvcHRpb25zIiwibG9jYWxlIiwidHJhbnNsYXRlZCIsIl9nZXRMYW5ndWFnZUZpbGVQYXRoIiwibGFuZ190YWciLCJwYXRoIiwiY29uZiIsImNkbl9wYXRoIiwiaTE4bl9maWxlc19yb3V0ZSIsImwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJ1c2VyTGFuZ3VhZ2UiLCJsYW5ndWFnZSIsImluZGV4T2YiLCJTaW1wbGVTY2hlbWEiLCJwcm90b3R5cGUiLCJwcmVmaXgiLCJUZW1wbGF0ZSIsInJlZ2lzdGVySGVscGVyIiwiYXJncyIsInN0YXJ0dXAiLCJ1c2VyTGFzdExvY2FsZSIsIlNlc3Npb24iLCJzZXQiLCJUcmFja2VyIiwiYXV0b3J1biIsImdldCIsInNldExhbmd1YWdlIiwiY2hhbmdlTGFuZ3VhZ2UiLCJyb290VXJsIiwiU3RlZWRvcyIsInNldExvY2FsZSIsIm1vbWVudCIsInVzZXIiLCJsb2NhdGlvbiIsInJlbG9hZCIsIm9uQ2hhbmdlTG9jYWxlIiwibmV3TG9jYWxlIiwiJCIsImV4dGVuZCIsImZuIiwiZGF0YVRhYmxlIiwiZGVmYXVsdHMiLCJfIiwiZWFjaCIsIlRhYnVsYXIiLCJ0YWJsZXNCeU5hbWUiLCJ0YWJsZSIsImNvbHVtbnMiLCJjb2x1bW4iLCJkYXRhIiwic1RpdGxlIiwiY29sbGVjdGlvbiIsIl9uYW1lIiwiemVyb1JlY29yZHMiLCJjZnMiLCJGUyIsIkhUVFAiLCJzZXRCYXNlVXJsIiwiZ2V0Q29udGVudFR5cGUiLCJmaWxlbmFtZSIsIl9leHAiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiU3RvcmFnZUFkYXB0ZXIiLCJvbiIsInN0b3JlTmFtZSIsImZpbGVPYmoiLCJjb25zb2xlIiwiQ29sbGVjdGlvbiIsInN0b3JlcyIsInN0b3JlX25hbWUiLCJmaWxlX3N0b3JlIiwicmVmIiwicmVmMSIsInNldHRpbmdzIiwic3RvcmUiLCJTdG9yZSIsIk9TUyIsImlzU2VydmVyIiwiYWxpeXVuIiwiUzMiLCJhd3MiLCJGaWxlU3lzdGVtIiwiam9pbiIsInByb2Nlc3MiLCJlbnYiLCJTVEVFRE9TX1NUT1JBR0VfRElSIiwiZmlsZUtleU1ha2VyIiwiYWJzb2x1dGVQYXRoIiwiZmlsZW5hbWVJblN0b3JlIiwibWtkaXJwIiwibW9udGgiLCJub3ciLCJ5ZWFyIiwiX2dldEluZm8iLCJuYW1lIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiZ2V0TW9udGgiLCJyZXNvbHZlIiwic3luYyIsImNvbGxlY3Rpb25OYW1lIiwiX2lkIiwiZmlsdGVyIiwiYWxsb3ciLCJjb250ZW50VHlwZXMiLCJpbnNlcnQiLCJ1cGRhdGUiLCJyZW1vdmUiLCJkb3dubG9hZCIsImRiIiwiZmlsZXMiLCJiZWZvcmUiLCJ1c2VySWQiLCJkb2MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGFBQUE7QUFBQUMsT0FBQUMsS0FBQSxDQUFBQyxRQUFBO0FBQUEsdUJBQUFDLENBQUE7QUFBQUosV0FBQUksQ0FBQTtBQUFBO0FBQUE7QUFBQSxJQUFBQyxJQUFBLEVBQUFDLFdBQUEsRUFBQUMsZ0JBQUE7QUFDQUYsT0FBT0YsUUFBUSxlQUFSLENBQVA7QUFDQSxLQUFDSCxJQUFELEdBQVFBLElBQVI7QUFFQSxLQUFDUSxDQUFELEdBQUtILEtBQUtHLENBQVY7QUFFQSxLQUFDQyxFQUFELEdBQU1ELENBQU47QUFFQSxLQUFDRSxHQUFELEdBQU9GLENBQVA7O0FBRUFGLGNBQWMsVUFBQ0ssR0FBRDtBQUNiLE1BQUFDLENBQUEsRUFBQUMsUUFBQTs7QUFBQSxNQUFHRixHQUFIO0FBRUNBLFVBQU1BLElBQUlHLE9BQUosQ0FBWSxLQUFaLEVBQWtCLEVBQWxCLENBQU47QUNLQzs7QURKRixNQUFJQyxPQUFPQyxTQUFYO0FBQ0MsV0FBT0QsT0FBT1QsV0FBUCxDQUFtQkssR0FBbkIsQ0FBUDtBQUREO0FBR0MsUUFBR0ksT0FBT0UsUUFBVjtBQUNDO0FBQ0NKLG1CQUFXLElBQUlLLEdBQUosQ0FBUUgsT0FBT1QsV0FBUCxFQUFSLENBQVg7O0FBQ0EsWUFBR0ssR0FBSDtBQUNDLGlCQUFPRSxTQUFTTSxRQUFULEdBQW9CUixHQUEzQjtBQUREO0FBR0MsaUJBQU9FLFNBQVNNLFFBQWhCO0FBTEY7QUFBQSxlQUFBQyxLQUFBO0FBTU1SLFlBQUFRLEtBQUE7QUFDTCxlQUFPTCxPQUFPVCxXQUFQLENBQW1CSyxHQUFuQixDQUFQO0FBUkY7QUFBQTtBQ2tCSSxhRFJISSxPQUFPVCxXQUFQLENBQW1CSyxHQUFuQixDQ1FHO0FE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QWtCLElBQUloQixHQUFHYyxVQUFQLENBQWtCRSxVQUFsQixFQUNkO0FBQUFELGNBQVEsQ0FBQ0UsVUFBRDtBQUFSLEtBRGMsQ0FBbEI7QUNLTDs7QURGQ2xCLE1BQUlpQixVQUFKLEVBQWdCa0MsS0FBaEIsQ0FDSTtBQUFBRSxZQUFRO0FBQ0osYUFBTyxJQUFQO0FBREo7QUFFQUMsWUFBUTtBQUNKLGFBQU8sSUFBUDtBQUhKO0FBSUFDLFlBQVE7QUFDSixhQUFPLElBQVA7QUFMSjtBQU1BQyxjQUFVO0FBQ04sYUFBTyxJQUFQO0FBUEo7QUFBQSxHQURKOztBQVVBLE1BQUd2QyxlQUFjLFNBQWpCO0FBQ0l3QyxPQUFHeEMsVUFBSCxJQUFpQmpCLElBQUlpQixVQUFKLENBQWpCO0FBQ0F3QyxPQUFHeEMsVUFBSCxFQUFleUMsS0FBZixDQUFxQkMsTUFBckIsQ0FBNEJOLE1BQTVCLENBQW1DLFVBQUNPLE1BQUQsRUFBU0MsR0FBVDtBQ1FyQyxhRFBNQSxJQUFJRCxNQUFKLEdBQWFBLE1DT25CO0FEUkU7QUNVTDs7QURQQyxNQUFHM0MsZUFBYyxPQUFqQjtBQ1NBLFdEUkl3QyxHQUFHLFNBQU94QyxVQUFQLEdBQWtCLGFBQXJCLElBQXFDakIsSUFBSWlCLFVBQUosRUFBZ0J5QyxLQ1F6RDtBQUNEO0FEcEdILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3Nfb2JqZWN0cy1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcbkBpMThuID0gaTE4bjtcblxuQHQgPSBJMThuLnRcblxuQHRyID0gdFxuXG5AdHJsID0gdFxuXG5hYnNvbHV0ZVVybCA9ICh1cmwpLT5cblx0aWYgdXJsXG5cdFx0IyB1cmzku6VcIi9cIuW8gOWktOeahOivne+8jOWOu+aOieW8gOWktOeahFwiL1wiXG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL15cXC8vLFwiXCIpXG5cdGlmIChNZXRlb3IuaXNDb3Jkb3ZhKVxuXHRcdHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcblx0ZWxzZVxuXHRcdGlmIE1ldGVvci5pc0NsaWVudFxuXHRcdFx0dHJ5XG5cdFx0XHRcdHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSlcblx0XHRcdFx0aWYgdXJsXG5cdFx0XHRcdFx0cmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lICsgdXJsXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRyZXR1cm4gcm9vdF91cmwucGF0aG5hbWVcblx0XHRcdGNhdGNoIGVcblx0XHRcdFx0cmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpXG5cdFx0ZWxzZVxuXHRcdFx0TWV0ZW9yLmFic29sdXRlVXJsKHVybClcbiMg6YeN5YaZdGFwOmkxOG7lh73mlbDvvIzlkJHlkI7lhbzlrrlcbmkxOG4uc2V0T3B0aW9uc1xuXHRwdXJpZnk6IG51bGxcblx0ZGVmYXVsdExvY2FsZTogJ3poLUNOJ1xuXHRob3N0VXJsOiBhYnNvbHV0ZVVybCgpXG5cbmlmIFRBUGkxOG4/XG5cdFRBUGkxOG4uX19vcmlnaW5hbCA9IFRBUGkxOG4uX19cblxuXHRUQVBpMThuLl9fID0gKGtleSwgb3B0aW9ucywgbG9jYWxlKS0+XG5cdFx0dHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuXHRcdGlmIHRyYW5zbGF0ZWQgIT0ga2V5XG5cdFx0XHRyZXR1cm4gdHJhbnNsYXRlZFxuXG5cdFx0IyBpMThuIOe/u+ivkeS4jeWHuuadpe+8jOWwneivleeUqCB0YXA6aTE4biDnv7vor5EgVE9ETyByZW1vdmVcblx0XHRyZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsIGtleSwgb3B0aW9ucywgbG9jYWxlXG5cblx0VEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IChsYW5nX3RhZykgLT5cblxuXHRcdHBhdGggPSBpZiBALmNvbmYuY2RuX3BhdGg/IHRoZW4gQC5jb25mLmNkbl9wYXRoIGVsc2UgQC5jb25mLmkxOG5fZmlsZXNfcm91dGVcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlIC9cXC8kLywgXCJcIlxuXHRcdGlmIHBhdGhbMF0gPT0gXCIvXCJcblx0XHRcdHBhdGggPSBhYnNvbHV0ZVVybCgpLnJlcGxhY2UoL1xcLyskLywgXCJcIikgKyBwYXRoXG5cblx0XHRyZXR1cm4gXCIje3BhdGh9LyN7bGFuZ190YWd9Lmpzb25cIlxuXG5pZiBNZXRlb3IuaXNDbGllbnRcblx0Z2V0QnJvd3NlckxvY2FsZSA9ICgpLT5cblx0XHRsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nXG5cdFx0aWYgbC5pbmRleE9mKFwiemhcIikgPj0wXG5cdFx0XHRsb2NhbGUgPSBcInpoLWNuXCJcblx0XHRlbHNlXG5cdFx0XHRsb2NhbGUgPSBcImVuLXVzXCJcblx0XHRyZXR1cm4gbG9jYWxlXG5cblxuXHQjIOWBnOeUqOS4muWKoeWvueixoee/u+ivkSDmraTlh73mlbDlt7LlvIPnlKhcblx0U2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gKHByZWZpeCkgLT5cblx0XHRyZXR1cm5cblxuXHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRyZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuXG5cdE1ldGVvci5zdGFydHVwIC0+XG5cblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnXycsIChrZXksIGFyZ3MpLT5cblx0XHRcdHJldHVybiBUQVBpMThuLl9fKGtleSwgYXJncyk7XG5cblx0XHRTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIGdldEJyb3dzZXJMb2NhbGUoKSlcblxuXHRcdFRyYWNrZXIuYXV0b3J1biAoKS0+XG5cdFx0XHRpZiBTZXNzaW9uLmdldChcInN0ZWVkb3MtbG9jYWxlXCIpICE9IFwiZW4tdXNcIlxuXHRcdFx0XHRpZiBUQVBpMThuP1xuXHRcdFx0XHRcdFRBUGkxOG4uc2V0TGFuZ3VhZ2UoXCJ6aC1DTlwiKVxuXHRcdFx0XHRJMThuLmNoYW5nZUxhbmd1YWdlKFwiemgtQ05cIiwge3Jvb3RVcmw6IFN0ZWVkb3MuYWJzb2x1dGVVcmwoKSB9KVxuXHRcdFx0XHRpMThuLnNldExvY2FsZShcInpoLUNOXCIpXG5cdFx0XHRcdG1vbWVudC5sb2NhbGUoXCJ6aC1jblwiKVxuXHRcdFx0XHRyZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIFRBUGkxOG4/XG5cdFx0XHRcdFx0VEFQaTE4bi5zZXRMYW5ndWFnZShcImVuXCIpXG5cdFx0XHRcdEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJlblwiLCB7cm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpIH0pXG5cdFx0XHRcdGkxOG4uc2V0TG9jYWxlKFwiZW5cIilcblx0XHRcdFx0bW9tZW50LmxvY2FsZShcImVuXCIpXG5cdFx0XHRcdHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIilcblx0XHR1c2VyTGFzdExvY2FsZSA9IG51bGxcblx0XHRUcmFja2VyLmF1dG9ydW4gKCktPlxuXHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBcInpoLUNOXCIpXG5cdFx0XHR1c2VyTGFzdExvY2FsZSA9XG5cdFx0XHRpZiBNZXRlb3IudXNlcigpXG5cdFx0XHRcdGlmIE1ldGVvci51c2VyKCkubG9jYWxlXG5cdFx0XHRcdFx0U2Vzc2lvbi5zZXQoXCJzdGVlZG9zLWxvY2FsZVwiLCBNZXRlb3IudXNlcigpLmxvY2FsZSk7XG5cdFx0XHRcdFx0aWYgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT0gTWV0ZW9yLnVzZXIoKS5sb2NhbGVcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQodHJ1ZSk7XG5cdFx0XHRcdFx0dXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZVxuXG5cdFx0aTE4bi5vbkNoYW5nZUxvY2FsZSAobmV3TG9jYWxlKS0+XG5cblx0XHRcdCQuZXh0ZW5kIHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLFxuXHRcdFx0XHRsYW5ndWFnZTpcblx0XHRcdFx0XHRcImRlY2ltYWxcIjogICAgICAgIHQoXCJkYXRhVGFibGVzLmRlY2ltYWxcIiksXG5cdFx0XHRcdFx0XCJlbXB0eVRhYmxlXCI6ICAgICB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuXHRcdFx0XHRcdFwiaW5mb1wiOiAgICAgICAgICAgdChcImRhdGFUYWJsZXMuaW5mb1wiKSxcblx0XHRcdFx0XHRcImluZm9FbXB0eVwiOiAgICAgIHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcblx0XHRcdFx0XHRcImluZm9GaWx0ZXJlZFwiOiAgIHQoXCJkYXRhVGFibGVzLmluZm9GaWx0ZXJlZFwiKSxcblx0XHRcdFx0XHRcImluZm9Qb3N0Rml4XCI6ICAgIHQoXCJkYXRhVGFibGVzLmluZm9Qb3N0Rml4XCIpLFxuXHRcdFx0XHRcdFwidGhvdXNhbmRzXCI6ICAgICAgdChcImRhdGFUYWJsZXMudGhvdXNhbmRzXCIpLFxuXHRcdFx0XHRcdFwibGVuZ3RoTWVudVwiOiAgICAgdChcImRhdGFUYWJsZXMubGVuZ3RoTWVudVwiKSxcblx0XHRcdFx0XHRcImxvYWRpbmdSZWNvcmRzXCI6IHQoXCJkYXRhVGFibGVzLmxvYWRpbmdSZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicHJvY2Vzc2luZ1wiOiAgICAgdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcblx0XHRcdFx0XHRcInNlYXJjaFwiOiAgICAgICAgIHQoXCJkYXRhVGFibGVzLnNlYXJjaFwiKSxcblx0XHRcdFx0XHRcInplcm9SZWNvcmRzXCI6ICAgIHQoXCJkYXRhVGFibGVzLnplcm9SZWNvcmRzXCIpLFxuXHRcdFx0XHRcdFwicGFnaW5hdGVcIjpcblx0XHRcdFx0XHRcdFwiZmlyc3RcIjogICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5maXJzdFwiKSxcblx0XHRcdFx0XHRcdFwibGFzdFwiOiAgICAgICB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5sYXN0XCIpLFxuXHRcdFx0XHRcdFx0XCJuZXh0XCI6ICAgICAgIHQoXCJkYXRhVGFibGVzLnBhZ2luYXRlLm5leHRcIiksXG5cdFx0XHRcdFx0XHRcInByZXZpb3VzXCI6ICAgdChcImRhdGFUYWJsZXMucGFnaW5hdGUucHJldmlvdXNcIilcblx0XHRcdFx0XHRcImFyaWFcIjpcblx0XHRcdFx0XHRcdFwic29ydEFzY2VuZGluZ1wiOiAgdChcImRhdGFUYWJsZXMuYXJpYS5zb3J0QXNjZW5kaW5nXCIpLFxuXHRcdFx0XHRcdFx0XCJzb3J0RGVzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnREZXNjZW5kaW5nXCIpXG5cblx0XHRcdF8uZWFjaCBUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgKHRhYmxlKSAtPlxuXHRcdFx0XHRfLmVhY2ggdGFibGUub3B0aW9ucy5jb2x1bW5zLCAoY29sdW1uKSAtPlxuXHRcdFx0XHRcdGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT0gXCJfaWRcIilcblx0XHRcdFx0XHRcdHJldHVyblxuXG5cdFx0XHRcdFx0Y29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLFwiX1wiKSk7XG5cdFx0XHRcdFx0aWYgIXRhYmxlLm9wdGlvbnMubGFuZ3VhZ2Vcblx0XHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UgPSB7fVxuXHRcdFx0XHRcdHRhYmxlLm9wdGlvbnMubGFuZ3VhZ2UuemVyb1JlY29yZHMgPSB0KFwiZGF0YVRhYmxlcy56ZXJvXCIpICsgdCh0YWJsZS5jb2xsZWN0aW9uLl9uYW1lKVxuXHRcdFx0XHRcdHJldHVybiBcblxuXG4iLCJ2YXIgSTE4biwgYWJzb2x1dGVVcmwsIGdldEJyb3dzZXJMb2NhbGU7XG5cbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuSTE4biA9IHJlcXVpcmUoJ0BzdGVlZG9zL2kxOG4nKTtcblxudGhpcy5pMThuID0gaTE4bjtcblxudGhpcy50ID0gSTE4bi50O1xuXG50aGlzLnRyID0gdDtcblxudGhpcy50cmwgPSB0O1xuXG5hYnNvbHV0ZVVybCA9IGZ1bmN0aW9uKHVybCkge1xuICB2YXIgZSwgcm9vdF91cmw7XG4gIGlmICh1cmwpIHtcbiAgICB1cmwgPSB1cmwucmVwbGFjZSgvXlxcLy8sIFwiXCIpO1xuICB9XG4gIGlmIChNZXRlb3IuaXNDb3Jkb3ZhKSB7XG4gICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICB9IGVsc2Uge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJvb3RfdXJsID0gbmV3IFVSTChNZXRlb3IuYWJzb2x1dGVVcmwoKSk7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICByZXR1cm4gcm9vdF91cmwucGF0aG5hbWUgKyB1cmw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJvb3RfdXJsLnBhdGhuYW1lO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwodXJsKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCh1cmwpO1xuICAgIH1cbiAgfVxufTtcblxuaTE4bi5zZXRPcHRpb25zKHtcbiAgcHVyaWZ5OiBudWxsLFxuICBkZWZhdWx0TG9jYWxlOiAnemgtQ04nLFxuICBob3N0VXJsOiBhYnNvbHV0ZVVybCgpXG59KTtcblxuaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgVEFQaTE4bi5fX29yaWdpbmFsID0gVEFQaTE4bi5fXztcbiAgVEFQaTE4bi5fXyA9IGZ1bmN0aW9uKGtleSwgb3B0aW9ucywgbG9jYWxlKSB7XG4gICAgdmFyIHRyYW5zbGF0ZWQ7XG4gICAgdHJhbnNsYXRlZCA9IHQoa2V5LCBvcHRpb25zLCBsb2NhbGUpO1xuICAgIGlmICh0cmFuc2xhdGVkICE9PSBrZXkpIHtcbiAgICAgIHJldHVybiB0cmFuc2xhdGVkO1xuICAgIH1cbiAgICByZXR1cm4gVEFQaTE4bi5fX29yaWdpbmFsKGtleSwgb3B0aW9ucywgbG9jYWxlKTtcbiAgfTtcbiAgVEFQaTE4bi5fZ2V0TGFuZ3VhZ2VGaWxlUGF0aCA9IGZ1bmN0aW9uKGxhbmdfdGFnKSB7XG4gICAgdmFyIHBhdGg7XG4gICAgcGF0aCA9IHRoaXMuY29uZi5jZG5fcGF0aCAhPSBudWxsID8gdGhpcy5jb25mLmNkbl9wYXRoIDogdGhpcy5jb25mLmkxOG5fZmlsZXNfcm91dGU7XG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvJC8sIFwiXCIpO1xuICAgIGlmIChwYXRoWzBdID09PSBcIi9cIikge1xuICAgICAgcGF0aCA9IGFic29sdXRlVXJsKCkucmVwbGFjZSgvXFwvKyQvLCBcIlwiKSArIHBhdGg7XG4gICAgfVxuICAgIHJldHVybiBwYXRoICsgXCIvXCIgKyBsYW5nX3RhZyArIFwiLmpzb25cIjtcbiAgfTtcbn1cblxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICBnZXRCcm93c2VyTG9jYWxlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGwsIGxvY2FsZTtcbiAgICBsID0gd2luZG93Lm5hdmlnYXRvci51c2VyTGFuZ3VhZ2UgfHwgd2luZG93Lm5hdmlnYXRvci5sYW5ndWFnZSB8fCAnZW4nO1xuICAgIGlmIChsLmluZGV4T2YoXCJ6aFwiKSA+PSAwKSB7XG4gICAgICBsb2NhbGUgPSBcInpoLWNuXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsZSA9IFwiZW4tdXNcIjtcbiAgICB9XG4gICAgcmV0dXJuIGxvY2FsZTtcbiAgfTtcbiAgU2ltcGxlU2NoZW1hLnByb3RvdHlwZS5pMThuID0gZnVuY3Rpb24ocHJlZml4KSB7fTtcbiAgVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ18nLCBmdW5jdGlvbihrZXksIGFyZ3MpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICB9KTtcbiAgTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJMYXN0TG9jYWxlO1xuICAgIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdfJywgZnVuY3Rpb24oa2V5LCBhcmdzKSB7XG4gICAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXksIGFyZ3MpO1xuICAgIH0pO1xuICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgZ2V0QnJvd3NlckxvY2FsZSgpKTtcbiAgICBUcmFja2VyLmF1dG9ydW4oZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoU2Vzc2lvbi5nZXQoXCJzdGVlZG9zLWxvY2FsZVwiKSAhPT0gXCJlbi11c1wiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgVEFQaTE4biAhPT0gXCJ1bmRlZmluZWRcIiAmJiBUQVBpMThuICE9PSBudWxsKSB7XG4gICAgICAgICAgVEFQaTE4bi5zZXRMYW5ndWFnZShcInpoLUNOXCIpO1xuICAgICAgICB9XG4gICAgICAgIEkxOG4uY2hhbmdlTGFuZ3VhZ2UoXCJ6aC1DTlwiLCB7XG4gICAgICAgICAgcm9vdFVybDogU3RlZWRvcy5hYnNvbHV0ZVVybCgpXG4gICAgICAgIH0pO1xuICAgICAgICBpMThuLnNldExvY2FsZShcInpoLUNOXCIpO1xuICAgICAgICBtb21lbnQubG9jYWxlKFwiemgtY25cIik7XG4gICAgICAgIHJldHVybiByZXF1aXJlKFwibW9tZW50XCIpLmxvY2FsZShcInpoLWNuXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBUQVBpMThuICE9PSBcInVuZGVmaW5lZFwiICYmIFRBUGkxOG4gIT09IG51bGwpIHtcbiAgICAgICAgICBUQVBpMThuLnNldExhbmd1YWdlKFwiZW5cIik7XG4gICAgICAgIH1cbiAgICAgICAgSTE4bi5jaGFuZ2VMYW5ndWFnZShcImVuXCIsIHtcbiAgICAgICAgICByb290VXJsOiBTdGVlZG9zLmFic29sdXRlVXJsKClcbiAgICAgICAgfSk7XG4gICAgICAgIGkxOG4uc2V0TG9jYWxlKFwiZW5cIik7XG4gICAgICAgIG1vbWVudC5sb2NhbGUoXCJlblwiKTtcbiAgICAgICAgcmV0dXJuIHJlcXVpcmUoXCJtb21lbnRcIikubG9jYWxlKFwiZW5cIik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdXNlckxhc3RMb2NhbGUgPSBudWxsO1xuICAgIFRyYWNrZXIuYXV0b3J1bihmdW5jdGlvbigpIHtcbiAgICAgIFNlc3Npb24uc2V0KFwic3RlZWRvcy1sb2NhbGVcIiwgXCJ6aC1DTlwiKTtcbiAgICAgIHJldHVybiB1c2VyTGFzdExvY2FsZSA9IE1ldGVvci51c2VyKCkgPyBNZXRlb3IudXNlcigpLmxvY2FsZSA/IChTZXNzaW9uLnNldChcInN0ZWVkb3MtbG9jYWxlXCIsIE1ldGVvci51c2VyKCkubG9jYWxlKSwgdXNlckxhc3RMb2NhbGUgJiYgdXNlckxhc3RMb2NhbGUgIT09IE1ldGVvci51c2VyKCkubG9jYWxlID8gd2luZG93LmxvY2F0aW9uLnJlbG9hZCh0cnVlKSA6IHZvaWQgMCwgdXNlckxhc3RMb2NhbGUgPSBNZXRlb3IudXNlcigpLmxvY2FsZSkgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIGkxOG4ub25DaGFuZ2VMb2NhbGUoZnVuY3Rpb24obmV3TG9jYWxlKSB7XG4gICAgICAkLmV4dGVuZCh0cnVlLCAkLmZuLmRhdGFUYWJsZS5kZWZhdWx0cywge1xuICAgICAgICBsYW5ndWFnZToge1xuICAgICAgICAgIFwiZGVjaW1hbFwiOiB0KFwiZGF0YVRhYmxlcy5kZWNpbWFsXCIpLFxuICAgICAgICAgIFwiZW1wdHlUYWJsZVwiOiB0KFwiZGF0YVRhYmxlcy5lbXB0eVRhYmxlXCIpLFxuICAgICAgICAgIFwiaW5mb1wiOiB0KFwiZGF0YVRhYmxlcy5pbmZvXCIpLFxuICAgICAgICAgIFwiaW5mb0VtcHR5XCI6IHQoXCJkYXRhVGFibGVzLmluZm9FbXB0eVwiKSxcbiAgICAgICAgICBcImluZm9GaWx0ZXJlZFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvRmlsdGVyZWRcIiksXG4gICAgICAgICAgXCJpbmZvUG9zdEZpeFwiOiB0KFwiZGF0YVRhYmxlcy5pbmZvUG9zdEZpeFwiKSxcbiAgICAgICAgICBcInRob3VzYW5kc1wiOiB0KFwiZGF0YVRhYmxlcy50aG91c2FuZHNcIiksXG4gICAgICAgICAgXCJsZW5ndGhNZW51XCI6IHQoXCJkYXRhVGFibGVzLmxlbmd0aE1lbnVcIiksXG4gICAgICAgICAgXCJsb2FkaW5nUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy5sb2FkaW5nUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInByb2Nlc3NpbmdcIjogdChcImRhdGFUYWJsZXMucHJvY2Vzc2luZ1wiKSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB0KFwiZGF0YVRhYmxlcy5zZWFyY2hcIiksXG4gICAgICAgICAgXCJ6ZXJvUmVjb3Jkc1wiOiB0KFwiZGF0YVRhYmxlcy56ZXJvUmVjb3Jkc1wiKSxcbiAgICAgICAgICBcInBhZ2luYXRlXCI6IHtcbiAgICAgICAgICAgIFwiZmlyc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUuZmlyc3RcIiksXG4gICAgICAgICAgICBcImxhc3RcIjogdChcImRhdGFUYWJsZXMucGFnaW5hdGUubGFzdFwiKSxcbiAgICAgICAgICAgIFwibmV4dFwiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5uZXh0XCIpLFxuICAgICAgICAgICAgXCJwcmV2aW91c1wiOiB0KFwiZGF0YVRhYmxlcy5wYWdpbmF0ZS5wcmV2aW91c1wiKVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJhcmlhXCI6IHtcbiAgICAgICAgICAgIFwic29ydEFzY2VuZGluZ1wiOiB0KFwiZGF0YVRhYmxlcy5hcmlhLnNvcnRBc2NlbmRpbmdcIiksXG4gICAgICAgICAgICBcInNvcnREZXNjZW5kaW5nXCI6IHQoXCJkYXRhVGFibGVzLmFyaWEuc29ydERlc2NlbmRpbmdcIilcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIF8uZWFjaChUYWJ1bGFyLnRhYmxlc0J5TmFtZSwgZnVuY3Rpb24odGFibGUpIHtcbiAgICAgICAgcmV0dXJuIF8uZWFjaCh0YWJsZS5vcHRpb25zLmNvbHVtbnMsIGZ1bmN0aW9uKGNvbHVtbikge1xuICAgICAgICAgIGlmICghY29sdW1uLmRhdGEgfHwgY29sdW1uLmRhdGEgPT09IFwiX2lkXCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uLnNUaXRsZSA9IHQoXCJcIiArIHRhYmxlLmNvbGxlY3Rpb24uX25hbWUgKyBcIl9cIiArIGNvbHVtbi5kYXRhLnJlcGxhY2UoL1xcLi9nLCBcIl9cIikpO1xuICAgICAgICAgIGlmICghdGFibGUub3B0aW9ucy5sYW5ndWFnZSkge1xuICAgICAgICAgICAgdGFibGUub3B0aW9ucy5sYW5ndWFnZSA9IHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWJsZS5vcHRpb25zLmxhbmd1YWdlLnplcm9SZWNvcmRzID0gdChcImRhdGFUYWJsZXMuemVyb1wiKSArIHQodGFibGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiQGNmcyA9IHt9XG5cbk1ldGVvci5zdGFydHVwIC0+XG4gIEZTLkhUVFAuc2V0QmFzZVVybChcIi9hcGlcIilcblxuXG4jIOmAmui/h+aWh+S7tuaJqeWxleWQjeiOt+WPluaWh+S7tmNvbnRlbnRUeXBlXG4jIGh0dHA6Ly9yZWZlcmVuY2Uuc2l0ZXBvaW50LmNvbS9odG1sL21pbWUtdHlwZXNcbiMg5Y+C54WnczPkuIrkvKDpmYTku7blkI7nmoRjb250ZW50VHlwZVxuY2ZzLmdldENvbnRlbnRUeXBlID0gKGZpbGVuYW1lKSAtPlxuICAgIF9leHAgPSBmaWxlbmFtZS5zcGxpdCgnLicpLnBvcCgpLnRvTG93ZXJDYXNlKClcbiAgICBpZiAoJy4nICsgX2V4cCA9PSAnLmF1JykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5hdmknKSBcbiAgICAgIHJldHVybiAndmlkZW8veC1tc3ZpZGVvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ibXAnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvYm1wJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5iejInKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuY3NzJykgXG4gICAgICByZXR1cm4gJ3RleHQvY3NzJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kdGQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2MnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5kb2N4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21zd29yZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZG90eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmVzJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZXhlJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ2lmJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL2dpZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuZ3onKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ocXgnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vbWFjLWJpbmhleDQwJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5odG1sJykgXG4gICAgICByZXR1cm4gJ3RleHQvaHRtbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuamFyJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJ1xuICAgIGVsc2UgaWYgKCgnLicgKyBfZXhwID09ICcuanBnJykgfHwgKCcuJyArIF9leHAgPT0gJy5qcGVnJykpIFxuICAgICAgcmV0dXJuICdpbWFnZS9qcGVnJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5qcycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLmpzcCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1pZGknKSBcbiAgICAgIHJldHVybiAnYXVkaW8vbWlkaSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcubXAzJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL21wZWcnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLm1wZWcnKSBcbiAgICAgIHJldHVybiAndmlkZW8vbXBlZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcub2dnJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29nZydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGRmJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucGwnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wbmcnKSBcbiAgICAgIHJldHVybiAnaW1hZ2UvcG5nJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5wb3R4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHBzeCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnBwdCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHB0eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucHMnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vcG9zdHNjcmlwdCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucXQnKSBcbiAgICAgIHJldHVybiAndmlkZW8vcXVpY2t0aW1lJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yYScpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcucmFtJykgXG4gICAgICByZXR1cm4gJ2F1ZGlvL3gtcG4tcmVhbGF1ZGlvJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5yZGYnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5ydGYnKSBcbiAgICAgIHJldHVybiAndGV4dC9ydGYnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnNnbWwnKSBcbiAgICAgIHJldHVybiAndGV4dC9zZ21sJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zaXQnKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24veC1zdHVmZml0J1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy5zbGR4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuc3ZnJykgXG4gICAgICByZXR1cm4gJ2ltYWdlL3N2Zyt4bWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnN3ZicpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXNob2Nrd2F2ZS1mbGFzaCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGFyLmd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGd6JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtY29tcHJlc3NlZCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudGlmZicpIFxuICAgICAgcmV0dXJuICdpbWFnZS90aWZmJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy50c3YnKSBcbiAgICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcydcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcudHh0JykgXG4gICAgICByZXR1cm4gJ3RleHQvcGxhaW4nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLndhdicpIFxuICAgICAgcmV0dXJuICdhdWRpby94LXdhdidcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGxhbScpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhscycpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtZXhjZWwnXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhsc2InKSBcbiAgICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgIGVsc2UgaWYgKCcuJyArIF9leHAgPT0gJy54bHN4JykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcueGx0eCcpIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgZWxzZSBpZiAoJy4nICsgX2V4cCA9PSAnLnhtbCcpIFxuICAgICAgcmV0dXJuICd0ZXh0L3htbCdcbiAgICBlbHNlIGlmICgnLicgKyBfZXhwID09ICcuemlwJykgXG4gICAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCdcbiAgICBlbHNlIFxuICAgICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgXG5cblxuIiwidGhpcy5jZnMgPSB7fTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBGUy5IVFRQLnNldEJhc2VVcmwoXCIvYXBpXCIpO1xufSk7XG5cbmNmcy5nZXRDb250ZW50VHlwZSA9IGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIHZhciBfZXhwO1xuICBfZXhwID0gZmlsZW5hbWUuc3BsaXQoJy4nKS5wb3AoKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoJy4nICsgX2V4cCA9PT0gJy5hdScpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL2Jhc2ljJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmF2aScpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL3gtbXN2aWRlbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5ibXAnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9ibXAnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuYnoyJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1iemlwMic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5jc3MnKSB7XG4gICAgcmV0dXJuICd0ZXh0L2Nzcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5kdGQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG9jJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vbXN3b3JkJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmRvY3gnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9tc3dvcmQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5lcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5leGUnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuZ2lmJykge1xuICAgIHJldHVybiAnaW1hZ2UvZ2lmJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmd6Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24veC1nemlwJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmhxeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL21hYy1iaW5oZXg0MCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5odG1sJykge1xuICAgIHJldHVybiAndGV4dC9odG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLmphcicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtamF2YS1hcmNoaXZlJztcbiAgfSBlbHNlIGlmICgoJy4nICsgX2V4cCA9PT0gJy5qcGcnKSB8fCAoJy4nICsgX2V4cCA9PT0gJy5qcGVnJykpIHtcbiAgICByZXR1cm4gJ2ltYWdlL2pwZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanMnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWphdmFzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuanNwJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1pZGknKSB7XG4gICAgcmV0dXJuICdhdWRpby9taWRpJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLm1wMycpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcubXBlZycpIHtcbiAgICByZXR1cm4gJ3ZpZGVvL21wZWcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcub2dnJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2dnJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBkZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3BkZic7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wbmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9wbmcnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucG90eCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcHN4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1wb3dlcnBvaW50JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnBwdHgnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi92bmQubXMtcG93ZXJwb2ludCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5wcycpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3Bvc3RzY3JpcHQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucXQnKSB7XG4gICAgcmV0dXJuICd2aWRlby9xdWlja3RpbWUnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucmEnKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yYW0nKSB7XG4gICAgcmV0dXJuICdhdWRpby94LXBuLXJlYWxhdWRpbyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5yZGYnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcucnRmJykge1xuICAgIHJldHVybiAndGV4dC9ydGYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2dtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQvc2dtbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zaXQnKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LXN0dWZmaXQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcuc2xkeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy5zdmcnKSB7XG4gICAgcmV0dXJuICdpbWFnZS9zdmcreG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnN3ZicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnRhci5neicpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3gtZ3ppcCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50Z3onKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi94LWNvbXByZXNzZWQnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudGlmZicpIHtcbiAgICByZXR1cm4gJ2ltYWdlL3RpZmYnO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcudHN2Jykge1xuICAgIHJldHVybiAndGV4dC90YWItc2VwYXJhdGVkLXZhbHVlcyc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy50eHQnKSB7XG4gICAgcmV0dXJuICd0ZXh0L3BsYWluJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLndhdicpIHtcbiAgICByZXR1cm4gJ2F1ZGlvL3gtd2F2JztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsYW0nKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzJykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vdm5kLm1zLWV4Y2VsJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhsc2InKSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9IGVsc2UgaWYgKCcuJyArIF9leHAgPT09ICcueGxzeCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ZuZC5tcy1leGNlbCc7XG4gIH0gZWxzZSBpZiAoJy4nICsgX2V4cCA9PT0gJy54bHR4Jykge1xuICAgIHJldHVybiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnhtbCcpIHtcbiAgICByZXR1cm4gJ3RleHQveG1sJztcbiAgfSBlbHNlIGlmICgnLicgKyBfZXhwID09PSAnLnppcCcpIHtcbiAgICByZXR1cm4gJ2FwcGxpY2F0aW9uL3ppcCc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nO1xuICB9XG59O1xuIiwiRlMuU3RvcmFnZUFkYXB0ZXIucHJvdG90eXBlLm9uICdlcnJvcicsIChzdG9yZU5hbWUsIGVycm9yLCBmaWxlT2JqKS0+XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5TdG9yYWdlQWRhcHRlciBlbWl0IGVycm9yXCIpXG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iailcbiAgY29uc29sZS5lcnJvcihzdG9yZU5hbWUpXG5cbkZTLkNvbGxlY3Rpb24ucHJvdG90eXBlLm9uICdlcnJvcicsIChlcnJvciwgZmlsZU9iaiwgc3RvcmVOYW1lKS0+XG4gIGNvbnNvbGUuZXJyb3IoXCJGUy5Db2xsZWN0aW9uIGVtaXQgZXJyb3JcIilcbiAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKVxuICBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSkiLCJGUy5TdG9yYWdlQWRhcHRlci5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oc3RvcmVOYW1lLCBlcnJvciwgZmlsZU9iaikge1xuICBjb25zb2xlLmVycm9yKFwiRlMuU3RvcmFnZUFkYXB0ZXIgZW1pdCBlcnJvclwiKTtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIGNvbnNvbGUuZXJyb3IoZmlsZU9iaik7XG4gIHJldHVybiBjb25zb2xlLmVycm9yKHN0b3JlTmFtZSk7XG59KTtcblxuRlMuQ29sbGVjdGlvbi5wcm90b3R5cGUub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3IsIGZpbGVPYmosIHN0b3JlTmFtZSkge1xuICBjb25zb2xlLmVycm9yKFwiRlMuQ29sbGVjdGlvbiBlbWl0IGVycm9yXCIpO1xuICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgY29uc29sZS5lcnJvcihmaWxlT2JqKTtcbiAgcmV0dXJuIGNvbnNvbGUuZXJyb3Ioc3RvcmVOYW1lKTtcbn0pO1xuIiwic3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ11cblxuXy5lYWNoIHN0b3JlcywgKHN0b3JlX25hbWUpLT5cbiAgICBmaWxlX3N0b3JlXG4gICAgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiT1NTXCJcbiAgICAgICAgaWYgTWV0ZW9yLmlzQ2xpZW50XG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKVxuICAgICAgICBlbHNlIGlmIE1ldGVvci5pc1NlcnZlclxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Mgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW5cblxuICAgIGVsc2UgaWYgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5jZnM/LnN0b3JlID09IFwiUzNcIlxuICAgICAgICBpZiBNZXRlb3IuaXNDbGllbnRcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSlcbiAgICAgICAgZWxzZSBpZiBNZXRlb3IuaXNTZXJ2ZXJcbiAgICAgICAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMgc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3NcbiAgICBlbHNlXG4gICAgICAgIGlmIE1ldGVvci5pc0NsaWVudFxuICAgICAgICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5GaWxlU3lzdGVtKHN0b3JlX25hbWUpXG4gICAgICAgIGVsc2UgaWYgTWV0ZW9yLmlzU2VydmVyXG4gICAgICAgICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSwge1xuICAgICAgICAgICAgICAgICAgICBwYXRoOiByZXF1aXJlKCdwYXRoJykuam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCBcImZpbGVzLyN7c3RvcmVfbmFtZX1cIiksXG4gICAgICAgICAgICAgICAgICAgIGZpbGVLZXlNYWtlcjogKGZpbGVPYmopLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgTG9va3VwIHRoZSBjb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZSA9IGZpbGVPYmogYW5kIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgdGhlIHN0b3JlIGFuZCBrZXkgaXMgZm91bmQgcmV0dXJuIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIHN0b3JlIGFuZCBzdG9yZS5rZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmUua2V5XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgVE8gQ1VTVE9NSVpFLCBSRVBMQUNFIENPREUgQUZURVIgVEhJUyBQT0lOVFxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlbmFtZSA9IGZpbGVPYmoubmFtZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZW5hbWVJblN0b3JlID0gZmlsZU9iai5uYW1lKHtzdG9yZTogc3RvcmVfbmFtZX0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gbm93LmdldE1vbnRoKCkgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKVxuICAgICAgICAgICAgICAgICAgICAgICAgcGF0aG5hbWUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuU1RFRURPU19TVE9SQUdFX0RJUiwgXCJmaWxlcy8je3N0b3JlX25hbWV9L1wiICsgeWVhciArICcvJyArIG1vbnRoKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBTZXQgYWJzb2x1dGUgcGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKHBhdGhuYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBFbnN1cmUgdGhlIHBhdGggZXhpc3RzXG4gICAgICAgICAgICAgICAgICAgICAgICBta2RpcnAuc3luYyhhYnNvbHV0ZVBhdGgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICMgSWYgbm8gc3RvcmUga2V5IGZvdW5kIHdlIHJlc29sdmUgLyBnZW5lcmF0ZSBhIGtleVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAnLycgKyBtb250aCArICcvJyArIGZpbGVPYmouY29sbGVjdGlvbk5hbWUgKyAnLScgKyBmaWxlT2JqLl9pZCArICctJyArIChmaWxlbmFtZUluU3RvcmUgfHwgZmlsZW5hbWUpXG5cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXVkaW9zJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnYXVkaW8vKiddICMgYWxsb3cgb25seSBhdWRpb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAnaW1hZ2VzJyB8fCBzdG9yZV9uYW1lID09ICdhdmF0YXJzJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsnaW1hZ2UvKiddICMgYWxsb3cgb25seSBpbWFnZXMgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2UgaWYgc3RvcmVfbmFtZSA9PSAndmlkZW9zJ1xuICAgICAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbiBzdG9yZV9uYW1lLFxuICAgICAgICAgICAgc3RvcmVzOiBbZmlsZV9zdG9yZV0sXG4gICAgICAgICAgICBmaWx0ZXI6IHtcbiAgICAgICAgICAgICAgICBhbGxvdzoge1xuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZXM6IFsndmlkZW8vKiddICMgYWxsb3cgb25seSB2aWRlb3MgaW4gdGhpcyBGUy5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgIGVsc2VcbiAgICAgICAgY2ZzW3N0b3JlX25hbWVdID0gbmV3IEZTLkNvbGxlY3Rpb24gc3RvcmVfbmFtZSxcbiAgICAgICAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXG5cbiAgICBjZnNbc3RvcmVfbmFtZV0uYWxsb3dcbiAgICAgICAgaW5zZXJ0OiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgdXBkYXRlOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgcmVtb3ZlOiAtPlxuICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgZG93bmxvYWQ6IC0+XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuXG4gICAgaWYgc3RvcmVfbmFtZSA9PSAnYXZhdGFycydcbiAgICAgICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV1cbiAgICAgICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydCAodXNlcklkLCBkb2MpIC0+XG4gICAgICAgICAgICBkb2MudXNlcklkID0gdXNlcklkXG5cbiAgICBpZiBzdG9yZV9uYW1lID09ICdmaWxlcydcbiAgICAgICAgZGJbXCJjZnMuI3tzdG9yZV9uYW1lfS5maWxlcmVjb3JkXCJdID0gY2ZzW3N0b3JlX25hbWVdLmZpbGVzIiwidmFyIHN0b3Jlcztcblxuc3RvcmVzID0gWydhdmF0YXJzJywgJ2F1ZGlvcycsICdpbWFnZXMnLCAndmlkZW9zJywgJ2ZpbGVzJ107XG5cbl8uZWFjaChzdG9yZXMsIGZ1bmN0aW9uKHN0b3JlX25hbWUpIHtcbiAgZmlsZV9zdG9yZTtcbiAgdmFyIGZpbGVfc3RvcmUsIHJlZiwgcmVmMTtcbiAgaWYgKCgocmVmID0gTWV0ZW9yLnNldHRpbmdzW1wicHVibGljXCJdLmNmcykgIT0gbnVsbCA/IHJlZi5zdG9yZSA6IHZvaWQgMCkgPT09IFwiT1NTXCIpIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLk9TUyhzdG9yZV9uYW1lKTtcbiAgICB9IGVsc2UgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgZmlsZV9zdG9yZSA9IG5ldyBGUy5TdG9yZS5PU1Moc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hbGl5dW4pO1xuICAgIH1cbiAgfSBlbHNlIGlmICgoKHJlZjEgPSBNZXRlb3Iuc2V0dGluZ3NbXCJwdWJsaWNcIl0uY2ZzKSAhPSBudWxsID8gcmVmMS5zdG9yZSA6IHZvaWQgMCkgPT09IFwiUzNcIikge1xuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuUzMoc3RvcmVfbmFtZSwgTWV0ZW9yLnNldHRpbmdzLmNmcy5hd3MpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgICBmaWxlX3N0b3JlID0gbmV3IEZTLlN0b3JlLkZpbGVTeXN0ZW0oc3RvcmVfbmFtZSk7XG4gICAgfSBlbHNlIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGZpbGVfc3RvcmUgPSBuZXcgRlMuU3RvcmUuRmlsZVN5c3RlbShzdG9yZV9uYW1lLCB7XG4gICAgICAgIHBhdGg6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKHByb2Nlc3MuZW52LlNURUVET1NfU1RPUkFHRV9ESVIsIFwiZmlsZXMvXCIgKyBzdG9yZV9uYW1lKSxcbiAgICAgICAgZmlsZUtleU1ha2VyOiBmdW5jdGlvbihmaWxlT2JqKSB7XG4gICAgICAgICAgdmFyIGFic29sdXRlUGF0aCwgZmlsZW5hbWUsIGZpbGVuYW1lSW5TdG9yZSwgbWtkaXJwLCBtb250aCwgbm93LCBwYXRoLCBwYXRobmFtZSwgc3RvcmUsIHllYXI7XG4gICAgICAgICAgc3RvcmUgPSBmaWxlT2JqICYmIGZpbGVPYmouX2dldEluZm8oc3RvcmVfbmFtZSk7XG4gICAgICAgICAgaWYgKHN0b3JlICYmIHN0b3JlLmtleSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0b3JlLmtleTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZmlsZW5hbWUgPSBmaWxlT2JqLm5hbWUoKTtcbiAgICAgICAgICBmaWxlbmFtZUluU3RvcmUgPSBmaWxlT2JqLm5hbWUoe1xuICAgICAgICAgICAgc3RvcmU6IHN0b3JlX25hbWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBub3cgPSBuZXcgRGF0ZTtcbiAgICAgICAgICB5ZWFyID0gbm93LmdldEZ1bGxZZWFyKCk7XG4gICAgICAgICAgbW9udGggPSBub3cuZ2V0TW9udGgoKSArIDE7XG4gICAgICAgICAgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgICAgICBta2RpcnAgPSByZXF1aXJlKCdta2RpcnAnKTtcbiAgICAgICAgICBwYXRobmFtZSA9IHBhdGguam9pbihwcm9jZXNzLmVudi5TVEVFRE9TX1NUT1JBR0VfRElSLCAoXCJmaWxlcy9cIiArIHN0b3JlX25hbWUgKyBcIi9cIikgKyB5ZWFyICsgJy8nICsgbW9udGgpO1xuICAgICAgICAgIGFic29sdXRlUGF0aCA9IHBhdGgucmVzb2x2ZShwYXRobmFtZSk7XG4gICAgICAgICAgbWtkaXJwLnN5bmMoYWJzb2x1dGVQYXRoKTtcbiAgICAgICAgICByZXR1cm4geWVhciArICcvJyArIG1vbnRoICsgJy8nICsgZmlsZU9iai5jb2xsZWN0aW9uTmFtZSArICctJyArIGZpbGVPYmouX2lkICsgJy0nICsgKGZpbGVuYW1lSW5TdG9yZSB8fCBmaWxlbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F1ZGlvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWydhdWRpby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2UgaWYgKHN0b3JlX25hbWUgPT09ICdpbWFnZXMnIHx8IHN0b3JlX25hbWUgPT09ICdhdmF0YXJzJykge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdLFxuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgY29udGVudFR5cGVzOiBbJ2ltYWdlLyonXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoc3RvcmVfbmFtZSA9PT0gJ3ZpZGVvcycpIHtcbiAgICBjZnNbc3RvcmVfbmFtZV0gPSBuZXcgRlMuQ29sbGVjdGlvbihzdG9yZV9uYW1lLCB7XG4gICAgICBzdG9yZXM6IFtmaWxlX3N0b3JlXSxcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBhbGxvdzoge1xuICAgICAgICAgIGNvbnRlbnRUeXBlczogWyd2aWRlby8qJ11cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNmc1tzdG9yZV9uYW1lXSA9IG5ldyBGUy5Db2xsZWN0aW9uKHN0b3JlX25hbWUsIHtcbiAgICAgIHN0b3JlczogW2ZpbGVfc3RvcmVdXG4gICAgfSk7XG4gIH1cbiAgY2ZzW3N0b3JlX25hbWVdLmFsbG93KHtcbiAgICBpbnNlcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBkb3dubG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBpZiAoc3RvcmVfbmFtZSA9PT0gJ2F2YXRhcnMnKSB7XG4gICAgZGJbc3RvcmVfbmFtZV0gPSBjZnNbc3RvcmVfbmFtZV07XG4gICAgZGJbc3RvcmVfbmFtZV0uZmlsZXMuYmVmb3JlLmluc2VydChmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgcmV0dXJuIGRvYy51c2VySWQgPSB1c2VySWQ7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHN0b3JlX25hbWUgPT09ICdmaWxlcycpIHtcbiAgICByZXR1cm4gZGJbXCJjZnMuXCIgKyBzdG9yZV9uYW1lICsgXCIuZmlsZXJlY29yZFwiXSA9IGNmc1tzdG9yZV9uYW1lXS5maWxlcztcbiAgfVxufSk7XG4iXX0=
