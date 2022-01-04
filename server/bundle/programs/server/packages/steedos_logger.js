(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Random = Package.random.Random;
var Log = Package.logging.Log;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare, Logger;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:logger":{"checkNpm.js":function module(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_logger/checkNpm.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);

// fix warning: xxx not installed
require("chalk/package.json");

checkNpmVersions({
  'chalk': '^2.4.2'
}, 'steedos:logger');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.coffee":function module(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_logger/server.coffee                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var StdOut,
    canDefineNonEnumerableProperties,
    chalk,
    processString,
    sanitizeEasy,
    sanitizeHard,
    extend = function (child, parent) {
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {
    if (hasProp.call(parent, key)) child[key] = parent[key];
  }

  function ctor() {
    this.constructor = child;
  }

  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
},
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

chalk = require("chalk");
chalk.enabled = true;

canDefineNonEnumerableProperties = function () {
  var e, k, testObj, testPropName;
  testObj = {};
  testPropName = 't';

  try {
    Object.defineProperty(testObj, testPropName, {
      enumerable: false,
      value: testObj
    });

    for (k in meteorBabelHelpers.sanitizeForInObject(testObj)) {
      if (k === testPropName) {
        return false;
      }
    }
  } catch (error) {
    e = error;
    return false;
  }

  return testObj[testPropName] === testObj;
};

sanitizeEasy = function (value) {
  return value;
};

sanitizeHard = function (obj) {
  var i, key, keyCount, keys, newObj;

  if (Array.isArray(obj)) {
    newObj = {};
    keys = Object.keys(obj);
    keyCount = keys.length;
    i = 0;

    while (i < keyCount) {
      key = keys[i];
      newObj[key] = obj[key];
      ++i;
    }

    return newObj;
  }

  return obj;
};

this.meteorBabelHelpers = {
  sanitizeForInObject: canDefineNonEnumerableProperties() ? sanitizeEasy : sanitizeHard,
  _sanitizeForInObjectHard: sanitizeHard
};
this.LoggerManager = new (function (superClass) {
  extend(_Class, superClass);

  function _Class() {
    this.enabled = false;
    this.loggers = {};
    this.queue = [];
    this.showPackage = false;
    this.showFileAndLine = false;
    this.logLevel = 0;
  }

  _Class.prototype.register = function (logger) {
    if (!logger instanceof Logger) {
      return;
    }

    this.loggers[logger.name] = logger;
    return this.emit('register', logger);
  };

  _Class.prototype.addToQueue = function (logger, args) {
    return this.queue.push({
      logger: logger,
      args: args
    });
  };

  _Class.prototype.dispatchQueue = function () {
    var item, j, len1, ref;
    ref = this.queue;

    for (j = 0, len1 = ref.length; j < len1; j++) {
      item = ref[j];

      item.logger._log.apply(item.logger, item.args);
    }

    return this.clearQueue();
  };

  _Class.prototype.clearQueue = function () {
    return this.queue = [];
  };

  _Class.prototype.disable = function () {
    return this.enabled = false;
  };

  _Class.prototype.enable = function (dispatchQueue) {
    if (dispatchQueue == null) {
      dispatchQueue = false;
    }

    this.enabled = true;

    if (dispatchQueue === true) {
      return this.dispatchQueue();
    } else {
      return this.clearQueue();
    }
  };

  return _Class;
}(EventEmitter))();

this.Logger = Logger = function () {
  Logger.prototype.defaultTypes = {
    debug: {
      name: 'debug',
      color: 'blue',
      level: 2
    },
    log: {
      name: 'info',
      color: 'blue',
      level: 1
    },
    info: {
      name: 'info',
      color: 'blue',
      level: 1
    },
    success: {
      name: 'info',
      color: 'green',
      level: 1
    },
    warn: {
      name: 'warn',
      color: 'magenta',
      level: 1
    },
    error: {
      name: 'error',
      color: 'red',
      level: 0
    }
  };

  function Logger(name1, config) {
    var fn, fn1, fn2, method, name, ref, ref1, ref2, section, self, type, typeConfig;
    this.name = name1;

    if (config == null) {
      config = {};
    }

    self = this;
    this.config = {};

    _.extend(this.config, config);

    if (LoggerManager.loggers[this.name] != null) {
      LoggerManager.loggers[this.name].warn('Duplicated instance');
      return LoggerManager.loggers[this.name];
    }

    ref = this.defaultTypes;

    fn = function (type, typeConfig) {
      self[type] = function () {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return self._log.call(self, {
          section: this.__section,
          type: type,
          level: typeConfig.level,
          method: typeConfig.name,
          "arguments": args
        });
      };

      return self[type + "_box"] = function () {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return self._log.call(self, {
          section: this.__section,
          type: type,
          box: true,
          level: typeConfig.level,
          method: typeConfig.name,
          "arguments": args
        });
      };
    };

    for (type in meteorBabelHelpers.sanitizeForInObject(ref)) {
      typeConfig = ref[type];
      fn(type, typeConfig);
    }

    if (this.config.methods != null) {
      ref1 = this.config.methods;

      fn1 = function (method, typeConfig) {
        if (self[method] != null) {
          self.warn("Method", method, "already exists");
        }

        if (self.defaultTypes[typeConfig.type] == null) {
          self.warn("Method type", typeConfig.type, "does not exist");
        }

        self[method] = function () {
          var args, ref2;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return self._log.call(self, {
            section: this.__section,
            type: typeConfig.type,
            level: typeConfig.level != null ? typeConfig.level : (ref2 = self.defaultTypes[typeConfig.type]) != null ? ref2.level : void 0,
            method: method,
            "arguments": args
          });
        };

        return self[method + "_box"] = function () {
          var args, ref2;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return self._log.call(self, {
            section: this.__section,
            type: typeConfig.type,
            box: true,
            level: typeConfig.level != null ? typeConfig.level : (ref2 = self.defaultTypes[typeConfig.type]) != null ? ref2.level : void 0,
            method: method,
            "arguments": args
          });
        };
      };

      for (method in meteorBabelHelpers.sanitizeForInObject(ref1)) {
        typeConfig = ref1[method];
        fn1(method, typeConfig);
      }
    }

    if (this.config.sections != null) {
      ref2 = this.config.sections;

      fn2 = function (section, name) {
        var fn3, ref3, ref4, results;
        self[section] = {};
        ref3 = self.defaultTypes;

        fn3 = function (_this) {
          return function (type, typeConfig) {
            self[section][type] = function () {
              return self[type].apply({
                __section: name
              }, arguments);
            };

            return self[section][type + "_box"] = function () {
              return self[type + "_box"].apply({
                __section: name
              }, arguments);
            };
          };
        }(this);

        for (type in meteorBabelHelpers.sanitizeForInObject(ref3)) {
          typeConfig = ref3[type];
          fn3(type, typeConfig);
        }

        ref4 = self.config.methods;
        results = [];

        for (method in meteorBabelHelpers.sanitizeForInObject(ref4)) {
          typeConfig = ref4[method];
          results.push(function (_this) {
            return function (method, typeConfig) {
              self[section][method] = function () {
                return self[method].apply({
                  __section: name
                }, arguments);
              };

              return self[section][method + "_box"] = function () {
                return self[method + "_box"].apply({
                  __section: name
                }, arguments);
              };
            };
          }(this)(method, typeConfig));
        }

        return results;
      };

      for (section in meteorBabelHelpers.sanitizeForInObject(ref2)) {
        name = ref2[section];
        fn2(section, name);
      }
    }

    LoggerManager.register(this);
    return this;
  }

  Logger.prototype.getPrefix = function (options) {
    var detailParts, details, prefix;

    if (options.section != null) {
      prefix = this.name + " ➔ " + options.section + "." + options.method;
    } else {
      prefix = this.name + " ➔ " + options.method;
    }

    details = this._getCallerDetails();
    detailParts = [];

    if (details["package"] != null && (LoggerManager.showPackage === true || options.type === 'error')) {
      detailParts.push(details["package"]);
    }

    if (LoggerManager.showFileAndLine === true || options.type === 'error') {
      if (details.file != null && details.line != null) {
        detailParts.push(details.file + ":" + details.line);
      } else {
        if (details.file != null) {
          detailParts.push(details.file);
        }

        if (details.line != null) {
          detailParts.push(details.line);
        }
      }
    }

    if (this.defaultTypes[options.type] != null) {
      prefix = chalk[this.defaultTypes[options.type].color](prefix);
    }

    if (detailParts.length > 0) {
      prefix = detailParts.join(' ') + " " + prefix;
    }

    return prefix;
  };

  Logger.prototype._getCallerDetails = function () {
    var details, getStack, index, item, j, len1, line, lines, match, packageMatch, stack;

    getStack = function () {
      var err, stack;
      err = new Error();
      stack = err.stack;
      return stack;
    };

    stack = getStack();

    if (!stack) {
      return {};
    }

    lines = stack.split('\n');
    line = void 0;

    for (index = j = 0, len1 = lines.length; j < len1; index = ++j) {
      item = lines[index];

      if (!(index > 0)) {
        continue;
      }

      line = item;

      if (line.match(/^\s*at eval \(eval/)) {
        return {
          file: "eval"
        };
      }

      if (!line.match(/packages\/rocketchat_logger(?:\/|\.js)/)) {
        break;
      }
    }

    details = {};
    match = /(?:[@(]| at )([^(]+?):([0-9:]+)(?:\)|$)/.exec(line);

    if (!match) {
      return details;
    }

    details.line = match[2].split(':')[0];
    details.file = match[1].split('/').slice(-1)[0].split('?')[0];
    packageMatch = match[1].match(/packages\/([^\.\/]+)(?:\/|\.)/);

    if (packageMatch != null) {
      details["package"] = packageMatch[1];
    }

    return details;
  };

  Logger.prototype.makeABox = function (message, title) {
    var j, l, len, len1, len2, line, lines, separator, topLine;

    if (!_.isArray(message)) {
      message = message.split("\n");
    }

    len = 0;

    for (j = 0, len1 = message.length; j < len1; j++) {
      line = message[j];
      len = Math.max(len, line.length);
    }

    topLine = "+--" + s.pad('', len, '-') + "--+";
    separator = "|  " + s.pad('', len, '') + "  |";
    lines = [];
    lines.push(topLine);

    if (title != null) {
      lines.push("|  " + s.lrpad(title, len) + "  |");
      lines.push(topLine);
    }

    lines.push(separator);

    for (l = 0, len2 = message.length; l < len2; l++) {
      line = message[l];
      lines.push("|  " + s.rpad(line, len) + "  |");
    }

    lines.push(separator);
    lines.push(topLine);
    return lines;
  };

  Logger.prototype._log = function (options) {
    var box, color, j, len1, line, prefix, subPrefix;

    if (LoggerManager.enabled === false) {
      LoggerManager.addToQueue(this, arguments);
      return;
    }

    if (options.level == null) {
      options.level = 1;
    }

    if (LoggerManager.logLevel < options.level) {
      return;
    }

    prefix = this.getPrefix(options);

    if (options.box === true && _.isString(options["arguments"][0])) {
      color = void 0;

      if (this.defaultTypes[options.type] != null) {
        color = this.defaultTypes[options.type].color;
      }

      box = this.makeABox(options["arguments"][0], options["arguments"][1]);
      subPrefix = '➔';

      if (color != null) {
        subPrefix = subPrefix[color];
      }

      console.log(subPrefix, prefix);

      for (j = 0, len1 = box.length; j < len1; j++) {
        line = box[j];

        if (color != null) {
          console.log(subPrefix, line[color]);
        } else {
          console.log(subPrefix, line);
        }
      }
    } else {
      options["arguments"].unshift(prefix);
      console.log.apply(console, options["arguments"]);
    }
  };

  return Logger;
}();

this.SystemLogger = new Logger('System', {
  methods: {
    startup: {
      type: 'success',
      level: 0
    }
  }
});

processString = function (string, date) {
  if (string[0] === '{') {
    try {
      return Log.format(EJSON.parse(string), {
        color: true
      });
    } catch (error) {}
  }

  try {
    return Log.format({
      message: string,
      time: date,
      level: 'info'
    }, {
      color: true
    });
  } catch (error) {}

  return string;
};

StdOut = new (function (superClass) {
  extend(_Class, superClass);

  function _Class() {
    var write;
    this.queue = [];
    write = process.stdout.write;

    process.stdout.write = function (_this) {
      return function (string, encoding, fd) {
        var date, item, ref, ref1, viewLimit;
        write.apply(process.stdout, arguments);
        date = new Date();
        string = processString(string, date);
        item = {
          id: Random.id(),
          string: string,
          ts: date
        };

        _this.queue.push(item);

        viewLimit = (ref = Meteor.settings) != null ? (ref1 = ref.logger) != null ? ref1.viewLimit : void 0 : void 0;

        if (!viewLimit) {
          viewLimit = 1000;
        }

        if (_this.queue.length > viewLimit) {
          _this.queue.shift();
        }

        return _this.emit('write', string, item);
      };
    }(this);
  }

  return _Class;
}(EventEmitter))();
Meteor.publish('stdout', function () {
  var item, j, len1, ref, user;

  if (!this.userId) {
    return this.ready();
  }

  if (!this.userId) {
    return this.ready();
  }

  user = db.users.findOne(this.userId, {
    fields: {
      is_cloudadmin: 1
    }
  });

  if (!user) {
    return this.ready();
  }

  ref = StdOut.queue;

  for (j = 0, len1 = ref.length; j < len1; j++) {
    item = ref[j];
    this.added('stdout', item.id, {
      string: item.string,
      ts: item.ts
    });
  }

  this.ready();
  StdOut.on('write', function (_this) {
    return function (string, item) {
      return _this.added('stdout', item.id, {
        string: item.string,
        ts: item.ts
      });
    };
  }(this));
});
Meteor.startup(function () {
  var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7;

  if ((ref = Meteor.settings) != null ? (ref1 = ref.logger) != null ? ref1.enabled : void 0 : void 0) {
    if ((ref2 = Meteor.settings) != null ? (ref3 = ref2.logger) != null ? ref3.showPackage : void 0 : void 0) {
      LoggerManager.showPackage = true;
    }

    if ((ref4 = Meteor.settings) != null ? (ref5 = ref4.logger) != null ? ref5.showFileAndLine : void 0 : void 0) {
      LoggerManager.showFileAndLine = true;
    }

    if ((ref6 = Meteor.settings) != null ? (ref7 = ref6.logger) != null ? ref7.logLevel : void 0 : void 0) {
      LoggerManager.logLevel = Meteor.settings.logger.logLevel;
    }

    return LoggerManager.enable(true);
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/steedos:logger/checkNpm.js");
require("/node_modules/meteor/steedos:logger/server.coffee");

/* Exports */
Package._define("steedos:logger", {
  Logger: Logger
});

})();

//# sourceURL=meteor://💻app/packages/steedos_logger.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpsb2dnZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfbG9nZ2VyL3NlcnZlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsIlN0ZE91dCIsImNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzIiwiY2hhbGsiLCJwcm9jZXNzU3RyaW5nIiwic2FuaXRpemVFYXN5Iiwic2FuaXRpemVIYXJkIiwiZXh0ZW5kIiwiY2hpbGQiLCJwYXJlbnQiLCJrZXkiLCJoYXNQcm9wIiwiY2FsbCIsImN0b3IiLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsIl9fc3VwZXJfXyIsImhhc093blByb3BlcnR5Iiwic2xpY2UiLCJlbmFibGVkIiwiZSIsImsiLCJ0ZXN0T2JqIiwidGVzdFByb3BOYW1lIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwidmFsdWUiLCJlcnJvciIsIm9iaiIsImkiLCJrZXlDb3VudCIsImtleXMiLCJuZXdPYmoiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJtZXRlb3JCYWJlbEhlbHBlcnMiLCJzYW5pdGl6ZUZvckluT2JqZWN0IiwiX3Nhbml0aXplRm9ySW5PYmplY3RIYXJkIiwiTG9nZ2VyTWFuYWdlciIsInN1cGVyQ2xhc3MiLCJfQ2xhc3MiLCJsb2dnZXJzIiwicXVldWUiLCJzaG93UGFja2FnZSIsInNob3dGaWxlQW5kTGluZSIsImxvZ0xldmVsIiwicmVnaXN0ZXIiLCJsb2dnZXIiLCJMb2dnZXIiLCJuYW1lIiwiZW1pdCIsImFkZFRvUXVldWUiLCJhcmdzIiwicHVzaCIsImRpc3BhdGNoUXVldWUiLCJpdGVtIiwiaiIsImxlbjEiLCJyZWYiLCJfbG9nIiwiYXBwbHkiLCJjbGVhclF1ZXVlIiwiZGlzYWJsZSIsImVuYWJsZSIsIkV2ZW50RW1pdHRlciIsImRlZmF1bHRUeXBlcyIsImRlYnVnIiwiY29sb3IiLCJsZXZlbCIsImxvZyIsImluZm8iLCJzdWNjZXNzIiwid2FybiIsIm5hbWUxIiwiY29uZmlnIiwiZm4iLCJmbjEiLCJmbjIiLCJtZXRob2QiLCJyZWYxIiwicmVmMiIsInNlY3Rpb24iLCJzZWxmIiwidHlwZSIsInR5cGVDb25maWciLCJfIiwiYXJndW1lbnRzIiwiX19zZWN0aW9uIiwiYm94IiwibWV0aG9kcyIsInNlY3Rpb25zIiwiZm4zIiwicmVmMyIsInJlZjQiLCJyZXN1bHRzIiwiX3RoaXMiLCJnZXRQcmVmaXgiLCJvcHRpb25zIiwiZGV0YWlsUGFydHMiLCJkZXRhaWxzIiwicHJlZml4IiwiX2dldENhbGxlckRldGFpbHMiLCJmaWxlIiwibGluZSIsImpvaW4iLCJnZXRTdGFjayIsImluZGV4IiwibGluZXMiLCJtYXRjaCIsInBhY2thZ2VNYXRjaCIsInN0YWNrIiwiZXJyIiwiRXJyb3IiLCJzcGxpdCIsImV4ZWMiLCJtYWtlQUJveCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImwiLCJsZW4iLCJsZW4yIiwic2VwYXJhdG9yIiwidG9wTGluZSIsIk1hdGgiLCJtYXgiLCJzIiwicGFkIiwibHJwYWQiLCJycGFkIiwic3ViUHJlZml4IiwiaXNTdHJpbmciLCJjb25zb2xlIiwidW5zaGlmdCIsIlN5c3RlbUxvZ2dlciIsInN0YXJ0dXAiLCJzdHJpbmciLCJkYXRlIiwiTG9nIiwiZm9ybWF0IiwiRUpTT04iLCJwYXJzZSIsInRpbWUiLCJ3cml0ZSIsInByb2Nlc3MiLCJzdGRvdXQiLCJlbmNvZGluZyIsImZkIiwidmlld0xpbWl0IiwiRGF0ZSIsImlkIiwiUmFuZG9tIiwidHMiLCJNZXRlb3IiLCJzZXR0aW5ncyIsInNoaWZ0IiwicHVibGlzaCIsInVzZXIiLCJ1c2VySWQiLCJyZWFkeSIsImRiIiwidXNlcnMiLCJmaW5kT25lIiwiZmllbGRzIiwiaXNfY2xvdWRh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RDlJSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2xvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxucmVxdWlyZShcImNoYWxrL3BhY2thZ2UuanNvblwiKTtcblxuaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuY2hlY2tOcG1WZXJzaW9ucyh7XG5cdCdjaGFsayc6ICdeMi40LjInXG59LCAnc3RlZWRvczpsb2dnZXInKTsiLCJjaGFsayA9IHJlcXVpcmUoXCJjaGFsa1wiKVxuY2hhbGsuZW5hYmxlZCA9IHRydWU7XG5jYW5EZWZpbmVOb25FbnVtZXJhYmxlUHJvcGVydGllcyA9IC0+XG5cdHRlc3RPYmogPSB7fVxuXHR0ZXN0UHJvcE5hbWUgPSAndCdcblx0dHJ5XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IHRlc3RPYmosIHRlc3RQcm9wTmFtZSxcblx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0XHR2YWx1ZTogdGVzdE9ialxuXHRcdGZvciBrIG9mIHRlc3RPYmpcblx0XHRcdGlmIGsgPT0gdGVzdFByb3BOYW1lXG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRjYXRjaCBlXG5cdFx0cmV0dXJuIGZhbHNlXG5cdHRlc3RPYmpbdGVzdFByb3BOYW1lXSA9PSB0ZXN0T2JqXG5cbnNhbml0aXplRWFzeSA9ICh2YWx1ZSkgLT5cblx0dmFsdWVcblxuc2FuaXRpemVIYXJkID0gKG9iaikgLT5cblx0aWYgQXJyYXkuaXNBcnJheShvYmopXG5cdFx0bmV3T2JqID0ge31cblx0XHRrZXlzID0gT2JqZWN0LmtleXMob2JqKVxuXHRcdGtleUNvdW50ID0ga2V5cy5sZW5ndGhcblx0XHRpID0gMFxuXHRcdHdoaWxlIGkgPCBrZXlDb3VudFxuXHRcdFx0a2V5ID0ga2V5c1tpXVxuXHRcdFx0bmV3T2JqW2tleV0gPSBvYmpba2V5XVxuXHRcdFx0KytpXG5cdFx0cmV0dXJuIG5ld09ialxuXHRvYmpcblxuQG1ldGVvckJhYmVsSGVscGVycyA9XG5cdHNhbml0aXplRm9ySW5PYmplY3Q6IGlmIGNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzKCkgdGhlbiBzYW5pdGl6ZUVhc3kgZWxzZSBzYW5pdGl6ZUhhcmRcblx0X3Nhbml0aXplRm9ySW5PYmplY3RIYXJkOiBzYW5pdGl6ZUhhcmRcbkBMb2dnZXJNYW5hZ2VyID0gbmV3IGNsYXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cdGNvbnN0cnVjdG9yOiAtPlxuXHRcdEBlbmFibGVkID0gZmFsc2Vcblx0XHRAbG9nZ2VycyA9IHt9XG5cdFx0QHF1ZXVlID0gW11cblxuXHRcdEBzaG93UGFja2FnZSA9IGZhbHNlXG5cdFx0QHNob3dGaWxlQW5kTGluZSA9IGZhbHNlXG5cdFx0QGxvZ0xldmVsID0gMFxuXG5cdHJlZ2lzdGVyOiAobG9nZ2VyKSAtPlxuXHRcdGlmIG5vdCBsb2dnZXIgaW5zdGFuY2VvZiBMb2dnZXJcblx0XHRcdHJldHVyblxuXG5cdFx0QGxvZ2dlcnNbbG9nZ2VyLm5hbWVdID0gbG9nZ2VyXG5cblx0XHRAZW1pdCAncmVnaXN0ZXInLCBsb2dnZXJcblxuXHRhZGRUb1F1ZXVlOiAobG9nZ2VyLCBhcmdzKS0+XG5cdFx0QHF1ZXVlLnB1c2hcblx0XHRcdGxvZ2dlcjogbG9nZ2VyXG5cdFx0XHRhcmdzOiBhcmdzXG5cblx0ZGlzcGF0Y2hRdWV1ZTogLT5cblx0XHRmb3IgaXRlbSBpbiBAcXVldWVcblx0XHRcdGl0ZW0ubG9nZ2VyLl9sb2cuYXBwbHkgaXRlbS5sb2dnZXIsIGl0ZW0uYXJnc1xuXG5cdFx0QGNsZWFyUXVldWUoKVxuXG5cdGNsZWFyUXVldWU6IC0+XG5cdFx0QHF1ZXVlID0gW11cblxuXHRkaXNhYmxlOiAtPlxuXHRcdEBlbmFibGVkID0gZmFsc2VcblxuXHRlbmFibGU6IChkaXNwYXRjaFF1ZXVlPWZhbHNlKSAtPlxuXHRcdEBlbmFibGVkID0gdHJ1ZVxuXHRcdGlmIGRpc3BhdGNoUXVldWUgaXMgdHJ1ZVxuXHRcdFx0QGRpc3BhdGNoUXVldWUoKVxuXHRcdGVsc2Vcblx0XHRcdEBjbGVhclF1ZXVlKClcblxuXG4jIEBMb2dnZXJNYW5hZ2VyLm9uICdyZWdpc3RlcicsIC0+XG4jIFx0Y29uc29sZS5sb2coJ29uIHJlZ2lzdGVyJywgYXJndW1lbnRzKVxuXG5cbkBMb2dnZXIgPSBjbGFzcyBMb2dnZXJcblx0ZGVmYXVsdFR5cGVzOlxuXHRcdGRlYnVnOlxuXHRcdFx0bmFtZTogJ2RlYnVnJ1xuXHRcdFx0Y29sb3I6ICdibHVlJ1xuXHRcdFx0bGV2ZWw6IDJcblx0XHRsb2c6XG5cdFx0XHRuYW1lOiAnaW5mbydcblx0XHRcdGNvbG9yOiAnYmx1ZSdcblx0XHRcdGxldmVsOiAxXG5cdFx0aW5mbzpcblx0XHRcdG5hbWU6ICdpbmZvJ1xuXHRcdFx0Y29sb3I6ICdibHVlJ1xuXHRcdFx0bGV2ZWw6IDFcblx0XHRzdWNjZXNzOlxuXHRcdFx0bmFtZTogJ2luZm8nXG5cdFx0XHRjb2xvcjogJ2dyZWVuJ1xuXHRcdFx0bGV2ZWw6IDFcblx0XHR3YXJuOlxuXHRcdFx0bmFtZTogJ3dhcm4nXG5cdFx0XHRjb2xvcjogJ21hZ2VudGEnXG5cdFx0XHRsZXZlbDogMVxuXHRcdGVycm9yOlxuXHRcdFx0bmFtZTogJ2Vycm9yJ1xuXHRcdFx0Y29sb3I6ICdyZWQnXG5cdFx0XHRsZXZlbDogMFxuXG5cdGNvbnN0cnVjdG9yOiAoQG5hbWUsIGNvbmZpZz17fSkgLT5cblx0XHRzZWxmID0gQFxuXHRcdEBjb25maWcgPSB7fVxuXG5cdFx0Xy5leHRlbmQgQGNvbmZpZywgY29uZmlnXG5cblx0XHRpZiBMb2dnZXJNYW5hZ2VyLmxvZ2dlcnNbQG5hbWVdP1xuXHRcdFx0TG9nZ2VyTWFuYWdlci5sb2dnZXJzW0BuYW1lXS53YXJuICdEdXBsaWNhdGVkIGluc3RhbmNlJ1xuXHRcdFx0cmV0dXJuIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV1cblxuXHRcdGZvciB0eXBlLCB0eXBlQ29uZmlnIG9mIEBkZWZhdWx0VHlwZXNcblx0XHRcdGRvICh0eXBlLCB0eXBlQ29uZmlnKSAtPlxuXHRcdFx0XHRzZWxmW3R5cGVdID0gKGFyZ3MuLi4pIC0+XG5cdFx0XHRcdFx0c2VsZi5fbG9nLmNhbGwgc2VsZixcblx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXG5cdFx0XHRcdFx0XHR0eXBlOiB0eXBlXG5cdFx0XHRcdFx0XHRsZXZlbDogdHlwZUNvbmZpZy5sZXZlbFxuXHRcdFx0XHRcdFx0bWV0aG9kOiB0eXBlQ29uZmlnLm5hbWVcblx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xuXG5cdFx0XHRcdHNlbGZbdHlwZStcIl9ib3hcIl0gPSAoYXJncy4uLikgLT5cblx0XHRcdFx0XHRzZWxmLl9sb2cuY2FsbCBzZWxmLFxuXHRcdFx0XHRcdFx0c2VjdGlvbjogdGhpcy5fX3NlY3Rpb25cblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcblx0XHRcdFx0XHRcdGJveDogdHJ1ZVxuXHRcdFx0XHRcdFx0bGV2ZWw6IHR5cGVDb25maWcubGV2ZWxcblx0XHRcdFx0XHRcdG1ldGhvZDogdHlwZUNvbmZpZy5uYW1lXG5cdFx0XHRcdFx0XHRhcmd1bWVudHM6IGFyZ3NcblxuXHRcdGlmIEBjb25maWcubWV0aG9kcz9cblx0XHRcdGZvciBtZXRob2QsIHR5cGVDb25maWcgb2YgQGNvbmZpZy5tZXRob2RzXG5cdFx0XHRcdGRvIChtZXRob2QsIHR5cGVDb25maWcpIC0+XG5cdFx0XHRcdFx0aWYgc2VsZlttZXRob2RdP1xuXHRcdFx0XHRcdFx0c2VsZi53YXJuIFwiTWV0aG9kXCIsIG1ldGhvZCwgXCJhbHJlYWR5IGV4aXN0c1wiXG5cblx0XHRcdFx0XHRpZiBub3Qgc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT9cblx0XHRcdFx0XHRcdHNlbGYud2FybiBcIk1ldGhvZCB0eXBlXCIsIHR5cGVDb25maWcudHlwZSwgXCJkb2VzIG5vdCBleGlzdFwiXG5cblx0XHRcdFx0XHRzZWxmW21ldGhvZF0gPSAoYXJncy4uLikgLT5cblx0XHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXG5cdFx0XHRcdFx0XHRcdHR5cGU6IHR5cGVDb25maWcudHlwZVxuXHRcdFx0XHRcdFx0XHRsZXZlbDogaWYgdHlwZUNvbmZpZy5sZXZlbD8gdGhlbiB0eXBlQ29uZmlnLmxldmVsIGVsc2Ugc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT8ubGV2ZWxcblx0XHRcdFx0XHRcdFx0bWV0aG9kOiBtZXRob2Rcblx0XHRcdFx0XHRcdFx0YXJndW1lbnRzOiBhcmdzXG5cblx0XHRcdFx0XHRzZWxmW21ldGhvZCtcIl9ib3hcIl0gPSAoYXJncy4uLikgLT5cblx0XHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXG5cdFx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXG5cdFx0XHRcdFx0XHRcdHR5cGU6IHR5cGVDb25maWcudHlwZVxuXHRcdFx0XHRcdFx0XHRib3g6IHRydWVcblx0XHRcdFx0XHRcdFx0bGV2ZWw6IGlmIHR5cGVDb25maWcubGV2ZWw/IHRoZW4gdHlwZUNvbmZpZy5sZXZlbCBlbHNlIHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0/LmxldmVsXG5cdFx0XHRcdFx0XHRcdG1ldGhvZDogbWV0aG9kXG5cdFx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xuXG5cdFx0aWYgQGNvbmZpZy5zZWN0aW9ucz9cblx0XHRcdGZvciBzZWN0aW9uLCBuYW1lIG9mIEBjb25maWcuc2VjdGlvbnNcblx0XHRcdFx0ZG8gKHNlY3Rpb24sIG5hbWUpIC0+XG5cdFx0XHRcdFx0c2VsZltzZWN0aW9uXSA9IHt9XG5cdFx0XHRcdFx0Zm9yIHR5cGUsIHR5cGVDb25maWcgb2Ygc2VsZi5kZWZhdWx0VHlwZXNcblx0XHRcdFx0XHRcdGRvICh0eXBlLCB0eXBlQ29uZmlnKSA9PlxuXHRcdFx0XHRcdFx0XHRzZWxmW3NlY3Rpb25dW3R5cGVdID0gPT5cblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGVdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcblxuXHRcdFx0XHRcdFx0XHRzZWxmW3NlY3Rpb25dW3R5cGUrXCJfYm94XCJdID0gPT5cblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGUrXCJfYm94XCJdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcblxuXHRcdFx0XHRcdGZvciBtZXRob2QsIHR5cGVDb25maWcgb2Ygc2VsZi5jb25maWcubWV0aG9kc1xuXHRcdFx0XHRcdFx0ZG8gKG1ldGhvZCwgdHlwZUNvbmZpZykgPT5cblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVttZXRob2RdID0gPT5cblx0XHRcdFx0XHRcdFx0XHRzZWxmW21ldGhvZF0uYXBwbHkge19fc2VjdGlvbjogbmFtZX0sIGFyZ3VtZW50c1xuXG5cdFx0XHRcdFx0XHRcdHNlbGZbc2VjdGlvbl1bbWV0aG9kK1wiX2JveFwiXSA9ID0+XG5cdFx0XHRcdFx0XHRcdFx0c2VsZlttZXRob2QrXCJfYm94XCJdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcblxuXHRcdExvZ2dlck1hbmFnZXIucmVnaXN0ZXIgQFxuXHRcdHJldHVybiBAXG5cblx0Z2V0UHJlZml4OiAob3B0aW9ucykgLT5cblx0XHRpZiBvcHRpb25zLnNlY3Rpb24/XG5cdFx0XHRwcmVmaXggPSBcIiN7QG5hbWV9IOKelCAje29wdGlvbnMuc2VjdGlvbn0uI3tvcHRpb25zLm1ldGhvZH1cIlxuXHRcdGVsc2Vcblx0XHRcdHByZWZpeCA9IFwiI3tAbmFtZX0g4p6UICN7b3B0aW9ucy5tZXRob2R9XCJcblxuXHRcdGRldGFpbHMgPSBAX2dldENhbGxlckRldGFpbHMoKVxuXG5cdFx0ZGV0YWlsUGFydHMgPSBbXVxuXHRcdGlmIGRldGFpbHMucGFja2FnZT8gYW5kIChMb2dnZXJNYW5hZ2VyLnNob3dQYWNrYWdlIGlzIHRydWUgb3Igb3B0aW9ucy50eXBlIGlzICdlcnJvcicpXG5cdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIGRldGFpbHMucGFja2FnZVxuXG5cdFx0aWYgTG9nZ2VyTWFuYWdlci5zaG93RmlsZUFuZExpbmUgaXMgdHJ1ZSBvciBvcHRpb25zLnR5cGUgaXMgJ2Vycm9yJ1xuXHRcdFx0aWYgZGV0YWlscy5maWxlPyBhbmQgZGV0YWlscy5saW5lP1xuXHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIFwiI3tkZXRhaWxzLmZpbGV9OiN7ZGV0YWlscy5saW5lfVwiXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGlmIGRldGFpbHMuZmlsZT9cblx0XHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIGRldGFpbHMuZmlsZVxuXHRcdFx0XHRpZiBkZXRhaWxzLmxpbmU/XG5cdFx0XHRcdFx0ZGV0YWlsUGFydHMucHVzaCBkZXRhaWxzLmxpbmVcblxuXHRcdGlmIEBkZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXT9cbiNcdFx0XHRwcmVmaXggPSBwcmVmaXhbQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXSDnlLHkuo5jb2xvcnMg5YyF55qE6Zeu6aKY77yM5pyN5Yqh56uv5pqC5pe25LiN5pSv5oyBbG9nIGNvbG9yIOaYvuekulxuXHRcdFx0cHJlZml4ID0gY2hhbGtbQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXShwcmVmaXgpXG5cblx0XHRpZiBkZXRhaWxQYXJ0cy5sZW5ndGggPiAwXG5cdFx0XHRwcmVmaXggPSBcIiN7ZGV0YWlsUGFydHMuam9pbignICcpfSAje3ByZWZpeH1cIlxuXG5cdFx0cmV0dXJuIHByZWZpeFxuXG5cdCMgQHJldHVybnMge09iamVjdDogeyBsaW5lOiBOdW1iZXIsIGZpbGU6IFN0cmluZyB9fVxuXHRfZ2V0Q2FsbGVyRGV0YWlsczogLT5cblx0XHRnZXRTdGFjayA9ICgpIC0+XG5cdFx0XHQjIFdlIGRvIE5PVCB1c2UgRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgaGVyZSAoYSBWOCBleHRlbnNpb24gdGhhdCBnZXRzIHVzIGFcblx0XHRcdCMgcHJlLXBhcnNlZCBzdGFjaykgc2luY2UgaXQncyBpbXBvc3NpYmxlIHRvIGNvbXBvc2UgaXQgd2l0aCB0aGUgdXNlIG9mXG5cdFx0XHQjIEVycm9yLnByZXBhcmVTdGFja1RyYWNlIHVzZWQgb24gdGhlIHNlcnZlciBmb3Igc291cmNlIG1hcHMuXG5cdFx0XHRlcnIgPSBuZXcgRXJyb3Jcblx0XHRcdHN0YWNrID0gZXJyLnN0YWNrXG5cdFx0XHRyZXR1cm4gc3RhY2tcblxuXHRcdHN0YWNrID0gZ2V0U3RhY2soKVxuXG5cdFx0aWYgbm90IHN0YWNrXG5cdFx0XHRyZXR1cm4ge31cblxuXHRcdGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpXG5cblx0XHQjIGxvb2tpbmcgZm9yIHRoZSBmaXJzdCBsaW5lIG91dHNpZGUgdGhlIGxvZ2dpbmcgcGFja2FnZSAob3IgYW5cblx0XHQjIGV2YWwgaWYgd2UgZmluZCB0aGF0IGZpcnN0KVxuXHRcdGxpbmUgPSB1bmRlZmluZWRcblx0XHRmb3IgaXRlbSwgaW5kZXggaW4gbGluZXMgd2hlbiBpbmRleCA+IDBcblx0XHRcdGxpbmUgPSBpdGVtXG5cdFx0XHRpZiBsaW5lLm1hdGNoKC9eXFxzKmF0IGV2YWwgXFwoZXZhbC8pXG5cdFx0XHRcdHJldHVybiB7ZmlsZTogXCJldmFsXCJ9XG5cblx0XHRcdGlmIG5vdCBsaW5lLm1hdGNoKC9wYWNrYWdlc1xcL3JvY2tldGNoYXRfbG9nZ2VyKD86XFwvfFxcLmpzKS8pXG5cdFx0XHRcdGJyZWFrXG5cblx0XHRkZXRhaWxzID0ge31cblxuXHRcdCMgVGhlIGZvcm1hdCBmb3IgRkYgaXMgJ2Z1bmN0aW9uTmFtZUBmaWxlUGF0aDpsaW5lTnVtYmVyJ1xuXHRcdCMgVGhlIGZvcm1hdCBmb3IgVjggaXMgJ2Z1bmN0aW9uTmFtZSAocGFja2FnZXMvbG9nZ2luZy9sb2dnaW5nLmpzOjgxKScgb3Jcblx0XHQjICAgICAgICAgICAgICAgICAgICAgICdwYWNrYWdlcy9sb2dnaW5nL2xvZ2dpbmcuanM6ODEnXG5cdFx0bWF0Y2ggPSAvKD86W0AoXXwgYXQgKShbXihdKz8pOihbMC05Ol0rKSg/OlxcKXwkKS8uZXhlYyhsaW5lKVxuXHRcdGlmIG5vdCBtYXRjaFxuXHRcdFx0cmV0dXJuIGRldGFpbHNcblx0XHQjIGluIGNhc2UgdGhlIG1hdGNoZWQgYmxvY2sgaGVyZSBpcyBsaW5lOmNvbHVtblxuXHRcdGRldGFpbHMubGluZSA9IG1hdGNoWzJdLnNwbGl0KCc6JylbMF1cblxuXHRcdCMgUG9zc2libGUgZm9ybWF0OiBodHRwczovL2Zvby5iYXIuY29tL3NjcmlwdHMvZmlsZS5qcz9yYW5kb209Zm9vYmFyXG5cdFx0IyBYWFg6IGlmIHlvdSBjYW4gd3JpdGUgdGhlIGZvbGxvd2luZyBpbiBiZXR0ZXIgd2F5LCBwbGVhc2UgZG8gaXRcblx0XHQjIFhYWDogd2hhdCBhYm91dCBldmFscz9cblx0XHRkZXRhaWxzLmZpbGUgPSBtYXRjaFsxXS5zcGxpdCgnLycpLnNsaWNlKC0xKVswXS5zcGxpdCgnPycpWzBdXG5cblx0XHRwYWNrYWdlTWF0Y2ggPSBtYXRjaFsxXS5tYXRjaCgvcGFja2FnZXNcXC8oW15cXC5cXC9dKykoPzpcXC98XFwuKS8pXG5cdFx0aWYgcGFja2FnZU1hdGNoP1xuXHRcdFx0ZGV0YWlscy5wYWNrYWdlID0gcGFja2FnZU1hdGNoWzFdXG5cblx0XHRyZXR1cm4gZGV0YWlsc1xuXG5cdG1ha2VBQm94OiAobWVzc2FnZSwgdGl0bGUpIC0+XG5cdFx0aWYgbm90IF8uaXNBcnJheShtZXNzYWdlKVxuXHRcdFx0bWVzc2FnZSA9IG1lc3NhZ2Uuc3BsaXQoXCJcXG5cIilcblxuXHRcdGxlbiA9IDBcblx0XHRmb3IgbGluZSBpbiBtZXNzYWdlXG5cdFx0XHRsZW4gPSBNYXRoLm1heChsZW4sIGxpbmUubGVuZ3RoKVxuXG5cdFx0dG9wTGluZSA9IFwiKy0tXCIgKyBzLnBhZCgnJywgbGVuLCAnLScpICsgXCItLStcIlxuXHRcdHNlcGFyYXRvciA9IFwifCAgXCIgKyBzLnBhZCgnJywgbGVuLCAnJykgKyBcIiAgfFwiXG5cdFx0bGluZXMgPSBbXVxuXG5cdFx0bGluZXMucHVzaCB0b3BMaW5lXG5cdFx0aWYgdGl0bGU/XG5cdFx0XHRsaW5lcy5wdXNoIFwifCAgXCIgKyBzLmxycGFkKHRpdGxlLCBsZW4pICsgXCIgIHxcIlxuXHRcdFx0bGluZXMucHVzaCB0b3BMaW5lXG5cblx0XHRsaW5lcy5wdXNoIHNlcGFyYXRvclxuXG5cdFx0Zm9yIGxpbmUgaW4gbWVzc2FnZVxuXHRcdFx0bGluZXMucHVzaCBcInwgIFwiICsgcy5ycGFkKGxpbmUsIGxlbikgKyBcIiAgfFwiXG5cblx0XHRsaW5lcy5wdXNoIHNlcGFyYXRvclxuXHRcdGxpbmVzLnB1c2ggdG9wTGluZVxuXHRcdHJldHVybiBsaW5lc1xuXG5cblx0X2xvZzogKG9wdGlvbnMpIC0+XG5cdFx0aWYgTG9nZ2VyTWFuYWdlci5lbmFibGVkIGlzIGZhbHNlXG5cdFx0XHRMb2dnZXJNYW5hZ2VyLmFkZFRvUXVldWUgQCwgYXJndW1lbnRzXG5cdFx0XHRyZXR1cm5cblxuXHRcdG9wdGlvbnMubGV2ZWwgPz0gMVxuXG5cdFx0aWYgTG9nZ2VyTWFuYWdlci5sb2dMZXZlbCA8IG9wdGlvbnMubGV2ZWxcblx0XHRcdHJldHVyblxuXG5cdFx0cHJlZml4ID0gQGdldFByZWZpeChvcHRpb25zKVxuXG5cdFx0aWYgb3B0aW9ucy5ib3ggaXMgdHJ1ZSBhbmQgXy5pc1N0cmluZyhvcHRpb25zLmFyZ3VtZW50c1swXSlcblx0XHRcdGNvbG9yID0gdW5kZWZpbmVkXG5cdFx0XHRpZiBAZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0/XG5cdFx0XHRcdGNvbG9yID0gQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXG5cblx0XHRcdGJveCA9IEBtYWtlQUJveCBvcHRpb25zLmFyZ3VtZW50c1swXSwgb3B0aW9ucy5hcmd1bWVudHNbMV1cblx0XHRcdHN1YlByZWZpeCA9ICfinpQnXG5cdFx0XHRpZiBjb2xvcj9cblx0XHRcdFx0c3ViUHJlZml4ID0gc3ViUHJlZml4W2NvbG9yXVxuXG5cdFx0XHRjb25zb2xlLmxvZyBzdWJQcmVmaXgsIHByZWZpeFxuXHRcdFx0Zm9yIGxpbmUgaW4gYm94XG5cdFx0XHRcdGlmIGNvbG9yP1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgbGluZVtjb2xvcl1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgbGluZVxuXHRcdGVsc2Vcblx0XHRcdG9wdGlvbnMuYXJndW1lbnRzLnVuc2hpZnQgcHJlZml4XG5cdFx0XHRjb25zb2xlLmxvZy5hcHBseSBjb25zb2xlLCBvcHRpb25zLmFyZ3VtZW50c1xuXG5cdFx0cmV0dXJuXG5cblxuQFN5c3RlbUxvZ2dlciA9IG5ldyBMb2dnZXIgJ1N5c3RlbScsXG5cdG1ldGhvZHM6XG5cdFx0c3RhcnR1cDpcblx0XHRcdHR5cGU6ICdzdWNjZXNzJ1xuXHRcdFx0bGV2ZWw6IDBcblxucHJvY2Vzc1N0cmluZyA9IChzdHJpbmcsIGRhdGUpIC0+XG5cdGlmIHN0cmluZ1swXSBpcyAneydcblx0XHR0cnlcblx0XHRcdHJldHVybiBMb2cuZm9ybWF0IEVKU09OLnBhcnNlKHN0cmluZyksIHtjb2xvcjogdHJ1ZX1cblxuXHR0cnlcblx0XHRyZXR1cm4gTG9nLmZvcm1hdCB7bWVzc2FnZTogc3RyaW5nLCB0aW1lOiBkYXRlLCBsZXZlbDogJ2luZm8nfSwge2NvbG9yOiB0cnVlfVxuXG5cdHJldHVybiBzdHJpbmdcblxuU3RkT3V0ID0gbmV3IGNsYXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cdGNvbnN0cnVjdG9yOiAtPlxuXHRcdEBxdWV1ZSA9IFtdXG5cdFx0d3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZVxuXHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlID0gKHN0cmluZywgZW5jb2RpbmcsIGZkKSA9PlxuXHRcdFx0d3JpdGUuYXBwbHkocHJvY2Vzcy5zdGRvdXQsIGFyZ3VtZW50cylcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxuXHRcdFx0c3RyaW5nID0gcHJvY2Vzc1N0cmluZyBzdHJpbmcsIGRhdGVcblxuXHRcdFx0aXRlbSA9XG5cdFx0XHRcdGlkOiBSYW5kb20uaWQoKVxuXHRcdFx0XHRzdHJpbmc6IHN0cmluZ1xuXHRcdFx0XHR0czogZGF0ZVxuXG5cdFx0XHRAcXVldWUucHVzaCBpdGVtXG5cblx0XHRcdCMgaWYgUm9ja2V0Q2hhdD8uc2V0dGluZ3M/LmdldCgnTG9nX1ZpZXdfTGltaXQnKT8gYW5kIEBxdWV1ZS5sZW5ndGggPiBSb2NrZXRDaGF0LnNldHRpbmdzLmdldCgnTG9nX1ZpZXdfTGltaXQnKVxuXHRcdFx0IyBcdEBxdWV1ZS5zaGlmdCgpXG5cblx0XHRcdHZpZXdMaW1pdCA9IE1ldGVvci5zZXR0aW5ncz8ubG9nZ2VyPy52aWV3TGltaXRcblx0XHRcdHVubGVzcyB2aWV3TGltaXRcblx0XHRcdFx0dmlld0xpbWl0ID0gMTAwMFxuXHRcdFx0aWYgQHF1ZXVlLmxlbmd0aCA+IHZpZXdMaW1pdFxuXHRcdFx0XHRAcXVldWUuc2hpZnQoKVxuXG5cdFx0XHRAZW1pdCAnd3JpdGUnLCBzdHJpbmcsIGl0ZW1cblxuXG5NZXRlb3IucHVibGlzaCAnc3Rkb3V0JywgLT5cblx0dW5sZXNzIEB1c2VySWRcblx0XHRyZXR1cm4gQHJlYWR5KClcblxuXHQjIGlmIFJvY2tldENoYXQuYXV0aHouaGFzUGVybWlzc2lvbihAdXNlcklkLCAndmlldy1sb2dzJykgaXNudCB0cnVlXG5cdCMgXHRyZXR1cm4gQHJlYWR5KClcblxuXHR1bmxlc3MgQHVzZXJJZFxuXHRcdHJldHVybiBAcmVhZHkoKVxuXG5cdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKEB1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXG5cblx0dW5sZXNzIHVzZXJcblx0XHRyZXR1cm4gQHJlYWR5KClcblxuXHRmb3IgaXRlbSBpbiBTdGRPdXQucXVldWVcblx0XHRAYWRkZWQgJ3N0ZG91dCcsIGl0ZW0uaWQsXG5cdFx0XHRzdHJpbmc6IGl0ZW0uc3RyaW5nXG5cdFx0XHR0czogaXRlbS50c1xuXG5cdEByZWFkeSgpXG5cblx0U3RkT3V0Lm9uICd3cml0ZScsIChzdHJpbmcsIGl0ZW0pID0+XG5cdFx0QGFkZGVkICdzdGRvdXQnLCBpdGVtLmlkLFxuXHRcdFx0c3RyaW5nOiBpdGVtLnN0cmluZ1xuXHRcdFx0dHM6IGl0ZW0udHNcblxuXHRyZXR1cm5cblxuTWV0ZW9yLnN0YXJ0dXAgLT5cblx0aWYgTWV0ZW9yLnNldHRpbmdzPy5sb2dnZXI/LmVuYWJsZWRcblx0XHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8uc2hvd1BhY2thZ2Vcblx0XHRcdExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgPSB0cnVlO1xuXHRcdGlmIE1ldGVvci5zZXR0aW5ncz8ubG9nZ2VyPy5zaG93RmlsZUFuZExpbmVcblx0XHRcdExvZ2dlck1hbmFnZXIuc2hvd0ZpbGVBbmRMaW5lID0gdHJ1ZTtcblx0XHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8ubG9nTGV2ZWxcblx0XHRcdExvZ2dlck1hbmFnZXIubG9nTGV2ZWwgPSBNZXRlb3Iuc2V0dGluZ3MubG9nZ2VyLmxvZ0xldmVsO1xuXG5cdFx0TG9nZ2VyTWFuYWdlci5lbmFibGUodHJ1ZSk7XG5cbiIsInZhciBTdGRPdXQsIGNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzLCBjaGFsaywgcHJvY2Vzc1N0cmluZywgc2FuaXRpemVFYXN5LCBzYW5pdGl6ZUhhcmQsICAgICAgICBcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHksXG4gIHNsaWNlID0gW10uc2xpY2U7XG5cbmNoYWxrID0gcmVxdWlyZShcImNoYWxrXCIpO1xuXG5jaGFsay5lbmFibGVkID0gdHJ1ZTtcblxuY2FuRGVmaW5lTm9uRW51bWVyYWJsZVByb3BlcnRpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGUsIGssIHRlc3RPYmosIHRlc3RQcm9wTmFtZTtcbiAgdGVzdE9iaiA9IHt9O1xuICB0ZXN0UHJvcE5hbWUgPSAndCc7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRlc3RPYmosIHRlc3RQcm9wTmFtZSwge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdGVzdE9ialxuICAgIH0pO1xuICAgIGZvciAoayBpbiB0ZXN0T2JqKSB7XG4gICAgICBpZiAoayA9PT0gdGVzdFByb3BOYW1lKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZSA9IGVycm9yO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdGVzdE9ialt0ZXN0UHJvcE5hbWVdID09PSB0ZXN0T2JqO1xufTtcblxuc2FuaXRpemVFYXN5ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuc2FuaXRpemVIYXJkID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciBpLCBrZXksIGtleUNvdW50LCBrZXlzLCBuZXdPYmo7XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBuZXdPYmogPSB7fTtcbiAgICBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICBrZXlDb3VudCA9IGtleXMubGVuZ3RoO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwga2V5Q291bnQpIHtcbiAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICBuZXdPYmpba2V5XSA9IG9ialtrZXldO1xuICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3T2JqO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG50aGlzLm1ldGVvckJhYmVsSGVscGVycyA9IHtcbiAgc2FuaXRpemVGb3JJbk9iamVjdDogY2FuRGVmaW5lTm9uRW51bWVyYWJsZVByb3BlcnRpZXMoKSA/IHNhbml0aXplRWFzeSA6IHNhbml0aXplSGFyZCxcbiAgX3Nhbml0aXplRm9ySW5PYmplY3RIYXJkOiBzYW5pdGl6ZUhhcmRcbn07XG5cbnRoaXMuTG9nZ2VyTWFuYWdlciA9IG5ldyAoKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKF9DbGFzcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gX0NsYXNzKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VycyA9IHt9O1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLnNob3dQYWNrYWdlID0gZmFsc2U7XG4gICAgdGhpcy5zaG93RmlsZUFuZExpbmUgPSBmYWxzZTtcbiAgICB0aGlzLmxvZ0xldmVsID0gMDtcbiAgfVxuXG4gIF9DbGFzcy5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbihsb2dnZXIpIHtcbiAgICBpZiAoIWxvZ2dlciBpbnN0YW5jZW9mIExvZ2dlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlcnNbbG9nZ2VyLm5hbWVdID0gbG9nZ2VyO1xuICAgIHJldHVybiB0aGlzLmVtaXQoJ3JlZ2lzdGVyJywgbG9nZ2VyKTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmFkZFRvUXVldWUgPSBmdW5jdGlvbihsb2dnZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5wdXNoKHtcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgYXJnczogYXJnc1xuICAgIH0pO1xuICB9O1xuXG4gIF9DbGFzcy5wcm90b3R5cGUuZGlzcGF0Y2hRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtLCBqLCBsZW4xLCByZWY7XG4gICAgcmVmID0gdGhpcy5xdWV1ZTtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgaXRlbSA9IHJlZltqXTtcbiAgICAgIGl0ZW0ubG9nZ2VyLl9sb2cuYXBwbHkoaXRlbS5sb2dnZXIsIGl0ZW0uYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNsZWFyUXVldWUoKTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmNsZWFyUXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZSA9IFtdO1xuICB9O1xuXG4gIF9DbGFzcy5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKGRpc3BhdGNoUXVldWUpIHtcbiAgICBpZiAoZGlzcGF0Y2hRdWV1ZSA9PSBudWxsKSB7XG4gICAgICBkaXNwYXRjaFF1ZXVlID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgaWYgKGRpc3BhdGNoUXVldWUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoUXVldWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXJRdWV1ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gX0NsYXNzO1xuXG59KShFdmVudEVtaXR0ZXIpKTtcblxudGhpcy5Mb2dnZXIgPSBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIExvZ2dlci5wcm90b3R5cGUuZGVmYXVsdFR5cGVzID0ge1xuICAgIGRlYnVnOiB7XG4gICAgICBuYW1lOiAnZGVidWcnLFxuICAgICAgY29sb3I6ICdibHVlJyxcbiAgICAgIGxldmVsOiAyXG4gICAgfSxcbiAgICBsb2c6IHtcbiAgICAgIG5hbWU6ICdpbmZvJyxcbiAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICBsZXZlbDogMVxuICAgIH0sXG4gICAgaW5mbzoge1xuICAgICAgbmFtZTogJ2luZm8nLFxuICAgICAgY29sb3I6ICdibHVlJyxcbiAgICAgIGxldmVsOiAxXG4gICAgfSxcbiAgICBzdWNjZXNzOiB7XG4gICAgICBuYW1lOiAnaW5mbycsXG4gICAgICBjb2xvcjogJ2dyZWVuJyxcbiAgICAgIGxldmVsOiAxXG4gICAgfSxcbiAgICB3YXJuOiB7XG4gICAgICBuYW1lOiAnd2FybicsXG4gICAgICBjb2xvcjogJ21hZ2VudGEnLFxuICAgICAgbGV2ZWw6IDFcbiAgICB9LFxuICAgIGVycm9yOiB7XG4gICAgICBuYW1lOiAnZXJyb3InLFxuICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgbGV2ZWw6IDBcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUxLCBjb25maWcpIHtcbiAgICB2YXIgZm4sIGZuMSwgZm4yLCBtZXRob2QsIG5hbWUsIHJlZiwgcmVmMSwgcmVmMiwgc2VjdGlvbiwgc2VsZiwgdHlwZSwgdHlwZUNvbmZpZztcbiAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcbiAgICAgIGNvbmZpZyA9IHt9O1xuICAgIH1cbiAgICBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLCBjb25maWcpO1xuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmxvZ2dlcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICBMb2dnZXJNYW5hZ2VyLmxvZ2dlcnNbdGhpcy5uYW1lXS53YXJuKCdEdXBsaWNhdGVkIGluc3RhbmNlJyk7XG4gICAgICByZXR1cm4gTG9nZ2VyTWFuYWdlci5sb2dnZXJzW3RoaXMubmFtZV07XG4gICAgfVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdFR5cGVzO1xuICAgIGZuID0gZnVuY3Rpb24odHlwZSwgdHlwZUNvbmZpZykge1xuICAgICAgc2VsZlt0eXBlXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9nLmNhbGwoc2VsZiwge1xuICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwsXG4gICAgICAgICAgbWV0aG9kOiB0eXBlQ29uZmlnLm5hbWUsXG4gICAgICAgICAgXCJhcmd1bWVudHNcIjogYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2VsZlt0eXBlICsgXCJfYm94XCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgIHJldHVybiBzZWxmLl9sb2cuY2FsbChzZWxmLCB7XG4gICAgICAgICAgc2VjdGlvbjogdGhpcy5fX3NlY3Rpb24sXG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICBib3g6IHRydWUsXG4gICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwsXG4gICAgICAgICAgbWV0aG9kOiB0eXBlQ29uZmlnLm5hbWUsXG4gICAgICAgICAgXCJhcmd1bWVudHNcIjogYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBmb3IgKHR5cGUgaW4gcmVmKSB7XG4gICAgICB0eXBlQ29uZmlnID0gcmVmW3R5cGVdO1xuICAgICAgZm4odHlwZSwgdHlwZUNvbmZpZyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbmZpZy5tZXRob2RzICE9IG51bGwpIHtcbiAgICAgIHJlZjEgPSB0aGlzLmNvbmZpZy5tZXRob2RzO1xuICAgICAgZm4xID0gZnVuY3Rpb24obWV0aG9kLCB0eXBlQ29uZmlnKSB7XG4gICAgICAgIGlmIChzZWxmW21ldGhvZF0gIT0gbnVsbCkge1xuICAgICAgICAgIHNlbGYud2FybihcIk1ldGhvZFwiLCBtZXRob2QsIFwiYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0gPT0gbnVsbCkge1xuICAgICAgICAgIHNlbGYud2FybihcIk1ldGhvZCB0eXBlXCIsIHR5cGVDb25maWcudHlwZSwgXCJkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncywgcmVmMjtcbiAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX2xvZy5jYWxsKHNlbGYsIHtcbiAgICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogdHlwZUNvbmZpZy50eXBlLFxuICAgICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwgIT0gbnVsbCA/IHR5cGVDb25maWcubGV2ZWwgOiAocmVmMiA9IHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0pICE9IG51bGwgPyByZWYyLmxldmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBcImFyZ3VtZW50c1wiOiBhcmdzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzZWxmW21ldGhvZCArIFwiX2JveFwiXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzLCByZWYyO1xuICAgICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fbG9nLmNhbGwoc2VsZiwge1xuICAgICAgICAgICAgc2VjdGlvbjogdGhpcy5fX3NlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiB0eXBlQ29uZmlnLnR5cGUsXG4gICAgICAgICAgICBib3g6IHRydWUsXG4gICAgICAgICAgICBsZXZlbDogdHlwZUNvbmZpZy5sZXZlbCAhPSBudWxsID8gdHlwZUNvbmZpZy5sZXZlbCA6IChyZWYyID0gc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXSkgIT0gbnVsbCA/IHJlZjIubGV2ZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIFwiYXJndW1lbnRzXCI6IGFyZ3NcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBmb3IgKG1ldGhvZCBpbiByZWYxKSB7XG4gICAgICAgIHR5cGVDb25maWcgPSByZWYxW21ldGhvZF07XG4gICAgICAgIGZuMShtZXRob2QsIHR5cGVDb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5jb25maWcuc2VjdGlvbnMgIT0gbnVsbCkge1xuICAgICAgcmVmMiA9IHRoaXMuY29uZmlnLnNlY3Rpb25zO1xuICAgICAgZm4yID0gZnVuY3Rpb24oc2VjdGlvbiwgbmFtZSkge1xuICAgICAgICB2YXIgZm4zLCByZWYzLCByZWY0LCByZXN1bHRzO1xuICAgICAgICBzZWxmW3NlY3Rpb25dID0ge307XG4gICAgICAgIHJlZjMgPSBzZWxmLmRlZmF1bHRUeXBlcztcbiAgICAgICAgZm4zID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHR5cGUsIHR5cGVDb25maWcpIHtcbiAgICAgICAgICAgIHNlbGZbc2VjdGlvbl1bdHlwZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbdHlwZV0uYXBwbHkoe1xuICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICB9LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmW3NlY3Rpb25dW3R5cGUgKyBcIl9ib3hcIl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbdHlwZSArIFwiX2JveFwiXS5hcHBseSh7XG4gICAgICAgICAgICAgICAgX19zZWN0aW9uOiBuYW1lXG4gICAgICAgICAgICAgIH0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICBmb3IgKHR5cGUgaW4gcmVmMykge1xuICAgICAgICAgIHR5cGVDb25maWcgPSByZWYzW3R5cGVdO1xuICAgICAgICAgIGZuMyh0eXBlLCB0eXBlQ29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICByZWY0ID0gc2VsZi5jb25maWcubWV0aG9kcztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKG1ldGhvZCBpbiByZWY0KSB7XG4gICAgICAgICAgdHlwZUNvbmZpZyA9IHJlZjRbbWV0aG9kXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24obWV0aG9kLCB0eXBlQ29uZmlnKSB7XG4gICAgICAgICAgICAgIHNlbGZbc2VjdGlvbl1bbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmW21ldGhvZF0uYXBwbHkoe1xuICAgICAgICAgICAgICAgICAgX19zZWN0aW9uOiBuYW1lXG4gICAgICAgICAgICAgICAgfSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbc2VjdGlvbl1bbWV0aG9kICsgXCJfYm94XCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbbWV0aG9kICsgXCJfYm94XCJdLmFwcGx5KHtcbiAgICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICAgIH0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKG1ldGhvZCwgdHlwZUNvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfTtcbiAgICAgIGZvciAoc2VjdGlvbiBpbiByZWYyKSB7XG4gICAgICAgIG5hbWUgPSByZWYyW3NlY3Rpb25dO1xuICAgICAgICBmbjIoc2VjdGlvbiwgbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIExvZ2dlck1hbmFnZXIucmVnaXN0ZXIodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBMb2dnZXIucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGV0YWlsUGFydHMsIGRldGFpbHMsIHByZWZpeDtcbiAgICBpZiAob3B0aW9ucy5zZWN0aW9uICE9IG51bGwpIHtcbiAgICAgIHByZWZpeCA9IHRoaXMubmFtZSArIFwiIOKelCBcIiArIG9wdGlvbnMuc2VjdGlvbiArIFwiLlwiICsgb3B0aW9ucy5tZXRob2Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpeCA9IHRoaXMubmFtZSArIFwiIOKelCBcIiArIG9wdGlvbnMubWV0aG9kO1xuICAgIH1cbiAgICBkZXRhaWxzID0gdGhpcy5fZ2V0Q2FsbGVyRGV0YWlscygpO1xuICAgIGRldGFpbFBhcnRzID0gW107XG4gICAgaWYgKChkZXRhaWxzW1wicGFja2FnZVwiXSAhPSBudWxsKSAmJiAoTG9nZ2VyTWFuYWdlci5zaG93UGFja2FnZSA9PT0gdHJ1ZSB8fCBvcHRpb25zLnR5cGUgPT09ICdlcnJvcicpKSB7XG4gICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHNbXCJwYWNrYWdlXCJdKTtcbiAgICB9XG4gICAgaWYgKExvZ2dlck1hbmFnZXIuc2hvd0ZpbGVBbmRMaW5lID09PSB0cnVlIHx8IG9wdGlvbnMudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgaWYgKChkZXRhaWxzLmZpbGUgIT0gbnVsbCkgJiYgKGRldGFpbHMubGluZSAhPSBudWxsKSkge1xuICAgICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHMuZmlsZSArIFwiOlwiICsgZGV0YWlscy5saW5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkZXRhaWxzLmZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgIGRldGFpbFBhcnRzLnB1c2goZGV0YWlscy5maWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGV0YWlscy5saW5lICE9IG51bGwpIHtcbiAgICAgICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHMubGluZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0gIT0gbnVsbCkge1xuICAgICAgcHJlZml4ID0gY2hhbGtbdGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcl0ocHJlZml4KTtcbiAgICB9XG4gICAgaWYgKGRldGFpbFBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByZWZpeCA9IChkZXRhaWxQYXJ0cy5qb2luKCcgJykpICsgXCIgXCIgKyBwcmVmaXg7XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXg7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5fZ2V0Q2FsbGVyRGV0YWlscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZXRhaWxzLCBnZXRTdGFjaywgaW5kZXgsIGl0ZW0sIGosIGxlbjEsIGxpbmUsIGxpbmVzLCBtYXRjaCwgcGFja2FnZU1hdGNoLCBzdGFjaztcbiAgICBnZXRTdGFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVyciwgc3RhY2s7XG4gICAgICBlcnIgPSBuZXcgRXJyb3I7XG4gICAgICBzdGFjayA9IGVyci5zdGFjaztcbiAgICAgIHJldHVybiBzdGFjaztcbiAgICB9O1xuICAgIHN0YWNrID0gZ2V0U3RhY2soKTtcbiAgICBpZiAoIXN0YWNrKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgIGxpbmUgPSB2b2lkIDA7XG4gICAgZm9yIChpbmRleCA9IGogPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBqIDwgbGVuMTsgaW5kZXggPSArK2opIHtcbiAgICAgIGl0ZW0gPSBsaW5lc1tpbmRleF07XG4gICAgICBpZiAoIShpbmRleCA+IDApKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGluZSA9IGl0ZW07XG4gICAgICBpZiAobGluZS5tYXRjaCgvXlxccyphdCBldmFsIFxcKGV2YWwvKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZpbGU6IFwiZXZhbFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWxpbmUubWF0Y2goL3BhY2thZ2VzXFwvcm9ja2V0Y2hhdF9sb2dnZXIoPzpcXC98XFwuanMpLykpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGRldGFpbHMgPSB7fTtcbiAgICBtYXRjaCA9IC8oPzpbQChdfCBhdCApKFteKF0rPyk6KFswLTk6XSspKD86XFwpfCQpLy5leGVjKGxpbmUpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgIH1cbiAgICBkZXRhaWxzLmxpbmUgPSBtYXRjaFsyXS5zcGxpdCgnOicpWzBdO1xuICAgIGRldGFpbHMuZmlsZSA9IG1hdGNoWzFdLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdLnNwbGl0KCc/JylbMF07XG4gICAgcGFja2FnZU1hdGNoID0gbWF0Y2hbMV0ubWF0Y2goL3BhY2thZ2VzXFwvKFteXFwuXFwvXSspKD86XFwvfFxcLikvKTtcbiAgICBpZiAocGFja2FnZU1hdGNoICE9IG51bGwpIHtcbiAgICAgIGRldGFpbHNbXCJwYWNrYWdlXCJdID0gcGFja2FnZU1hdGNoWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLm1ha2VBQm94ID0gZnVuY3Rpb24obWVzc2FnZSwgdGl0bGUpIHtcbiAgICB2YXIgaiwgbCwgbGVuLCBsZW4xLCBsZW4yLCBsaW5lLCBsaW5lcywgc2VwYXJhdG9yLCB0b3BMaW5lO1xuICAgIGlmICghXy5pc0FycmF5KG1lc3NhZ2UpKSB7XG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS5zcGxpdChcIlxcblwiKTtcbiAgICB9XG4gICAgbGVuID0gMDtcbiAgICBmb3IgKGogPSAwLCBsZW4xID0gbWVzc2FnZS5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGxpbmUgPSBtZXNzYWdlW2pdO1xuICAgICAgbGVuID0gTWF0aC5tYXgobGVuLCBsaW5lLmxlbmd0aCk7XG4gICAgfVxuICAgIHRvcExpbmUgPSBcIistLVwiICsgcy5wYWQoJycsIGxlbiwgJy0nKSArIFwiLS0rXCI7XG4gICAgc2VwYXJhdG9yID0gXCJ8ICBcIiArIHMucGFkKCcnLCBsZW4sICcnKSArIFwiICB8XCI7XG4gICAgbGluZXMgPSBbXTtcbiAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIGlmICh0aXRsZSAhPSBudWxsKSB7XG4gICAgICBsaW5lcy5wdXNoKFwifCAgXCIgKyBzLmxycGFkKHRpdGxlLCBsZW4pICsgXCIgIHxcIik7XG4gICAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIH1cbiAgICBsaW5lcy5wdXNoKHNlcGFyYXRvcik7XG4gICAgZm9yIChsID0gMCwgbGVuMiA9IG1lc3NhZ2UubGVuZ3RoOyBsIDwgbGVuMjsgbCsrKSB7XG4gICAgICBsaW5lID0gbWVzc2FnZVtsXTtcbiAgICAgIGxpbmVzLnB1c2goXCJ8ICBcIiArIHMucnBhZChsaW5lLCBsZW4pICsgXCIgIHxcIik7XG4gICAgfVxuICAgIGxpbmVzLnB1c2goc2VwYXJhdG9yKTtcbiAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGJveCwgY29sb3IsIGosIGxlbjEsIGxpbmUsIHByZWZpeCwgc3ViUHJlZml4O1xuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICBMb2dnZXJNYW5hZ2VyLmFkZFRvUXVldWUodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubGV2ZWwgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5sZXZlbCA9IDE7XG4gICAgfVxuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmxvZ0xldmVsIDwgb3B0aW9ucy5sZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmVmaXggPSB0aGlzLmdldFByZWZpeChvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5ib3ggPT09IHRydWUgJiYgXy5pc1N0cmluZyhvcHRpb25zW1wiYXJndW1lbnRzXCJdWzBdKSkge1xuICAgICAgY29sb3IgPSB2b2lkIDA7XG4gICAgICBpZiAodGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbG9yID0gdGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcjtcbiAgICAgIH1cbiAgICAgIGJveCA9IHRoaXMubWFrZUFCb3gob3B0aW9uc1tcImFyZ3VtZW50c1wiXVswXSwgb3B0aW9uc1tcImFyZ3VtZW50c1wiXVsxXSk7XG4gICAgICBzdWJQcmVmaXggPSAn4p6UJztcbiAgICAgIGlmIChjb2xvciAhPSBudWxsKSB7XG4gICAgICAgIHN1YlByZWZpeCA9IHN1YlByZWZpeFtjb2xvcl07XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhzdWJQcmVmaXgsIHByZWZpeCk7XG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gYm94Lmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICBsaW5lID0gYm94W2pdO1xuICAgICAgICBpZiAoY29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN1YlByZWZpeCwgbGluZVtjb2xvcl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN1YlByZWZpeCwgbGluZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc1tcImFyZ3VtZW50c1wiXS51bnNoaWZ0KHByZWZpeCk7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBvcHRpb25zW1wiYXJndW1lbnRzXCJdKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIExvZ2dlcjtcblxufSkoKTtcblxudGhpcy5TeXN0ZW1Mb2dnZXIgPSBuZXcgTG9nZ2VyKCdTeXN0ZW0nLCB7XG4gIG1ldGhvZHM6IHtcbiAgICBzdGFydHVwOiB7XG4gICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICBsZXZlbDogMFxuICAgIH1cbiAgfVxufSk7XG5cbnByb2Nlc3NTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGRhdGUpIHtcbiAgaWYgKHN0cmluZ1swXSA9PT0gJ3snKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBMb2cuZm9ybWF0KEVKU09OLnBhcnNlKHN0cmluZyksIHtcbiAgICAgICAgY29sb3I6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIExvZy5mb3JtYXQoe1xuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgdGltZTogZGF0ZSxcbiAgICAgIGxldmVsOiAnaW5mbydcbiAgICB9LCB7XG4gICAgICBjb2xvcjogdHJ1ZVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge31cbiAgcmV0dXJuIHN0cmluZztcbn07XG5cblN0ZE91dCA9IG5ldyAoKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKF9DbGFzcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gX0NsYXNzKCkge1xuICAgIHZhciB3cml0ZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgd3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZTtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZywgZW5jb2RpbmcsIGZkKSB7XG4gICAgICAgIHZhciBkYXRlLCBpdGVtLCByZWYsIHJlZjEsIHZpZXdMaW1pdDtcbiAgICAgICAgd3JpdGUuYXBwbHkocHJvY2Vzcy5zdGRvdXQsIGFyZ3VtZW50cyk7XG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgc3RyaW5nID0gcHJvY2Vzc1N0cmluZyhzdHJpbmcsIGRhdGUpO1xuICAgICAgICBpdGVtID0ge1xuICAgICAgICAgIGlkOiBSYW5kb20uaWQoKSxcbiAgICAgICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgICAgICB0czogZGF0ZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5xdWV1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICB2aWV3TGltaXQgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYubG9nZ2VyKSAhPSBudWxsID8gcmVmMS52aWV3TGltaXQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIGlmICghdmlld0xpbWl0KSB7XG4gICAgICAgICAgdmlld0xpbWl0ID0gMTAwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX3RoaXMucXVldWUubGVuZ3RoID4gdmlld0xpbWl0KSB7XG4gICAgICAgICAgX3RoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXMuZW1pdCgnd3JpdGUnLCBzdHJpbmcsIGl0ZW0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiBfQ2xhc3M7XG5cbn0pKEV2ZW50RW1pdHRlcikpO1xuXG5NZXRlb3IucHVibGlzaCgnc3Rkb3V0JywgZnVuY3Rpb24oKSB7XG4gIHZhciBpdGVtLCBqLCBsZW4xLCByZWYsIHVzZXI7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHRoaXMudXNlcklkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWYgPSBTdGRPdXQucXVldWU7XG4gIGZvciAoaiA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgaXRlbSA9IHJlZltqXTtcbiAgICB0aGlzLmFkZGVkKCdzdGRvdXQnLCBpdGVtLmlkLCB7XG4gICAgICBzdHJpbmc6IGl0ZW0uc3RyaW5nLFxuICAgICAgdHM6IGl0ZW0udHNcbiAgICB9KTtcbiAgfVxuICB0aGlzLnJlYWR5KCk7XG4gIFN0ZE91dC5vbignd3JpdGUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nLCBpdGVtKSB7XG4gICAgICByZXR1cm4gX3RoaXMuYWRkZWQoJ3N0ZG91dCcsIGl0ZW0uaWQsIHtcbiAgICAgICAgc3RyaW5nOiBpdGVtLnN0cmluZyxcbiAgICAgICAgdHM6IGl0ZW0udHNcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbn0pO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5sb2dnZXIpICE9IG51bGwgPyByZWYxLmVuYWJsZWQgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBpZiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIubG9nZ2VyKSAhPSBudWxsID8gcmVmMy5zaG93UGFja2FnZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5zaG93UGFja2FnZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWY1ID0gcmVmNC5sb2dnZXIpICE9IG51bGwgPyByZWY1LnNob3dGaWxlQW5kTGluZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5zaG93RmlsZUFuZExpbmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNyA9IHJlZjYubG9nZ2VyKSAhPSBudWxsID8gcmVmNy5sb2dMZXZlbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5sb2dMZXZlbCA9IE1ldGVvci5zZXR0aW5ncy5sb2dnZXIubG9nTGV2ZWw7XG4gICAgfVxuICAgIHJldHVybiBMb2dnZXJNYW5hZ2VyLmVuYWJsZSh0cnVlKTtcbiAgfVxufSk7XG4iXX0=
