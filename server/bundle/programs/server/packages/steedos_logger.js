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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpsb2dnZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfbG9nZ2VyL3NlcnZlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsIlN0ZE91dCIsImNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzIiwiY2hhbGsiLCJwcm9jZXNzU3RyaW5nIiwic2FuaXRpemVFYXN5Iiwic2FuaXRpemVIYXJkIiwiZXh0ZW5kIiwiY2hpbGQiLCJwYXJlbnQiLCJrZXkiLCJoYXNQcm9wIiwiY2FsbCIsImN0b3IiLCJjb25zdHJ1Y3RvciIsInByb3RvdHlwZSIsIl9fc3VwZXJfXyIsImhhc093blByb3BlcnR5Iiwic2xpY2UiLCJlbmFibGVkIiwiZSIsImsiLCJ0ZXN0T2JqIiwidGVzdFByb3BOYW1lIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJlbnVtZXJhYmxlIiwidmFsdWUiLCJlcnJvciIsIm9iaiIsImkiLCJrZXlDb3VudCIsImtleXMiLCJuZXdPYmoiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJtZXRlb3JCYWJlbEhlbHBlcnMiLCJzYW5pdGl6ZUZvckluT2JqZWN0IiwiX3Nhbml0aXplRm9ySW5PYmplY3RIYXJkIiwiTG9nZ2VyTWFuYWdlciIsInN1cGVyQ2xhc3MiLCJfQ2xhc3MiLCJsb2dnZXJzIiwicXVldWUiLCJzaG93UGFja2FnZSIsInNob3dGaWxlQW5kTGluZSIsImxvZ0xldmVsIiwicmVnaXN0ZXIiLCJsb2dnZXIiLCJMb2dnZXIiLCJuYW1lIiwiZW1pdCIsImFkZFRvUXVldWUiLCJhcmdzIiwicHVzaCIsImRpc3BhdGNoUXVldWUiLCJpdGVtIiwiaiIsImxlbjEiLCJyZWYiLCJfbG9nIiwiYXBwbHkiLCJjbGVhclF1ZXVlIiwiZGlzYWJsZSIsImVuYWJsZSIsIkV2ZW50RW1pdHRlciIsImRlZmF1bHRUeXBlcyIsImRlYnVnIiwiY29sb3IiLCJsZXZlbCIsImxvZyIsImluZm8iLCJzdWNjZXNzIiwid2FybiIsIm5hbWUxIiwiY29uZmlnIiwiZm4iLCJmbjEiLCJmbjIiLCJtZXRob2QiLCJyZWYxIiwicmVmMiIsInNlY3Rpb24iLCJzZWxmIiwidHlwZSIsInR5cGVDb25maWciLCJfIiwiYXJndW1lbnRzIiwiX19zZWN0aW9uIiwiYm94IiwibWV0aG9kcyIsInNlY3Rpb25zIiwiZm4zIiwicmVmMyIsInJlZjQiLCJyZXN1bHRzIiwiX3RoaXMiLCJnZXRQcmVmaXgiLCJvcHRpb25zIiwiZGV0YWlsUGFydHMiLCJkZXRhaWxzIiwicHJlZml4IiwiX2dldENhbGxlckRldGFpbHMiLCJmaWxlIiwibGluZSIsImpvaW4iLCJnZXRTdGFjayIsImluZGV4IiwibGluZXMiLCJtYXRjaCIsInBhY2thZ2VNYXRjaCIsInN0YWNrIiwiZXJyIiwiRXJyb3IiLCJzcGxpdCIsImV4ZWMiLCJtYWtlQUJveCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImwiLCJsZW4iLCJsZW4yIiwic2VwYXJhdG9yIiwidG9wTGluZSIsIk1hdGgiLCJtYXgiLCJzIiwicGFkIiwibHJwYWQiLCJycGFkIiwic3ViUHJlZml4IiwiaXNTdHJpbmciLCJjb25zb2xlIiwidW5zaGlmdCIsIlN5c3RlbUxvZ2dlciIsInN0YXJ0dXAiLCJzdHJpbmciLCJkYXRlIiwiTG9nIiwiZm9ybWF0IiwiRUpTT04iLCJwYXJzZSIsInRpbWUiLCJ3cml0ZSIsInByb2Nlc3MiLCJzdGRvdXQiLCJlbmNvZGluZyIsImZkIiwidmlld0xpbWl0IiwiRGF0ZSIsImlkIiwiUmFuZG9tIiwidHMiLCJNZXRlb3IiLCJzZXR0aW5ncyIsInNoaWZ0IiwicHVibGlzaCIsInVzZXIiLCJ1c2VySWQiLCJyZWFkeSIsImRiIiwidXNlcnMiLCJmaW5kT25lIiwiZmllbGRzIiwiaXNfY2xvdWRh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RDlJSCxHIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGVlZG9zX2xvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGZpeCB3YXJuaW5nOiB4eHggbm90IGluc3RhbGxlZFxyXG5yZXF1aXJlKFwiY2hhbGsvcGFja2FnZS5qc29uXCIpO1xyXG5cclxuaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xyXG5jaGVja05wbVZlcnNpb25zKHtcclxuXHQnY2hhbGsnOiAnXjIuNC4yJ1xyXG59LCAnc3RlZWRvczpsb2dnZXInKTsiLCJjaGFsayA9IHJlcXVpcmUoXCJjaGFsa1wiKVxyXG5jaGFsay5lbmFibGVkID0gdHJ1ZTtcclxuY2FuRGVmaW5lTm9uRW51bWVyYWJsZVByb3BlcnRpZXMgPSAtPlxyXG5cdHRlc3RPYmogPSB7fVxyXG5cdHRlc3RQcm9wTmFtZSA9ICd0J1xyXG5cdHRyeVxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5IHRlc3RPYmosIHRlc3RQcm9wTmFtZSxcclxuXHRcdFx0ZW51bWVyYWJsZTogZmFsc2VcclxuXHRcdFx0dmFsdWU6IHRlc3RPYmpcclxuXHRcdGZvciBrIG9mIHRlc3RPYmpcclxuXHRcdFx0aWYgayA9PSB0ZXN0UHJvcE5hbWVcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2VcclxuXHRjYXRjaCBlXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHR0ZXN0T2JqW3Rlc3RQcm9wTmFtZV0gPT0gdGVzdE9ialxyXG5cclxuc2FuaXRpemVFYXN5ID0gKHZhbHVlKSAtPlxyXG5cdHZhbHVlXHJcblxyXG5zYW5pdGl6ZUhhcmQgPSAob2JqKSAtPlxyXG5cdGlmIEFycmF5LmlzQXJyYXkob2JqKVxyXG5cdFx0bmV3T2JqID0ge31cclxuXHRcdGtleXMgPSBPYmplY3Qua2V5cyhvYmopXHJcblx0XHRrZXlDb3VudCA9IGtleXMubGVuZ3RoXHJcblx0XHRpID0gMFxyXG5cdFx0d2hpbGUgaSA8IGtleUNvdW50XHJcblx0XHRcdGtleSA9IGtleXNbaV1cclxuXHRcdFx0bmV3T2JqW2tleV0gPSBvYmpba2V5XVxyXG5cdFx0XHQrK2lcclxuXHRcdHJldHVybiBuZXdPYmpcclxuXHRvYmpcclxuXHJcbkBtZXRlb3JCYWJlbEhlbHBlcnMgPVxyXG5cdHNhbml0aXplRm9ySW5PYmplY3Q6IGlmIGNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzKCkgdGhlbiBzYW5pdGl6ZUVhc3kgZWxzZSBzYW5pdGl6ZUhhcmRcclxuXHRfc2FuaXRpemVGb3JJbk9iamVjdEhhcmQ6IHNhbml0aXplSGFyZFxyXG5ATG9nZ2VyTWFuYWdlciA9IG5ldyBjbGFzcyBleHRlbmRzIEV2ZW50RW1pdHRlclxyXG5cdGNvbnN0cnVjdG9yOiAtPlxyXG5cdFx0QGVuYWJsZWQgPSBmYWxzZVxyXG5cdFx0QGxvZ2dlcnMgPSB7fVxyXG5cdFx0QHF1ZXVlID0gW11cclxuXHJcblx0XHRAc2hvd1BhY2thZ2UgPSBmYWxzZVxyXG5cdFx0QHNob3dGaWxlQW5kTGluZSA9IGZhbHNlXHJcblx0XHRAbG9nTGV2ZWwgPSAwXHJcblxyXG5cdHJlZ2lzdGVyOiAobG9nZ2VyKSAtPlxyXG5cdFx0aWYgbm90IGxvZ2dlciBpbnN0YW5jZW9mIExvZ2dlclxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAbG9nZ2Vyc1tsb2dnZXIubmFtZV0gPSBsb2dnZXJcclxuXHJcblx0XHRAZW1pdCAncmVnaXN0ZXInLCBsb2dnZXJcclxuXHJcblx0YWRkVG9RdWV1ZTogKGxvZ2dlciwgYXJncyktPlxyXG5cdFx0QHF1ZXVlLnB1c2hcclxuXHRcdFx0bG9nZ2VyOiBsb2dnZXJcclxuXHRcdFx0YXJnczogYXJnc1xyXG5cclxuXHRkaXNwYXRjaFF1ZXVlOiAtPlxyXG5cdFx0Zm9yIGl0ZW0gaW4gQHF1ZXVlXHJcblx0XHRcdGl0ZW0ubG9nZ2VyLl9sb2cuYXBwbHkgaXRlbS5sb2dnZXIsIGl0ZW0uYXJnc1xyXG5cclxuXHRcdEBjbGVhclF1ZXVlKClcclxuXHJcblx0Y2xlYXJRdWV1ZTogLT5cclxuXHRcdEBxdWV1ZSA9IFtdXHJcblxyXG5cdGRpc2FibGU6IC0+XHJcblx0XHRAZW5hYmxlZCA9IGZhbHNlXHJcblxyXG5cdGVuYWJsZTogKGRpc3BhdGNoUXVldWU9ZmFsc2UpIC0+XHJcblx0XHRAZW5hYmxlZCA9IHRydWVcclxuXHRcdGlmIGRpc3BhdGNoUXVldWUgaXMgdHJ1ZVxyXG5cdFx0XHRAZGlzcGF0Y2hRdWV1ZSgpXHJcblx0XHRlbHNlXHJcblx0XHRcdEBjbGVhclF1ZXVlKClcclxuXHJcblxyXG4jIEBMb2dnZXJNYW5hZ2VyLm9uICdyZWdpc3RlcicsIC0+XHJcbiMgXHRjb25zb2xlLmxvZygnb24gcmVnaXN0ZXInLCBhcmd1bWVudHMpXHJcblxyXG5cclxuQExvZ2dlciA9IGNsYXNzIExvZ2dlclxyXG5cdGRlZmF1bHRUeXBlczpcclxuXHRcdGRlYnVnOlxyXG5cdFx0XHRuYW1lOiAnZGVidWcnXHJcblx0XHRcdGNvbG9yOiAnYmx1ZSdcclxuXHRcdFx0bGV2ZWw6IDJcclxuXHRcdGxvZzpcclxuXHRcdFx0bmFtZTogJ2luZm8nXHJcblx0XHRcdGNvbG9yOiAnYmx1ZSdcclxuXHRcdFx0bGV2ZWw6IDFcclxuXHRcdGluZm86XHJcblx0XHRcdG5hbWU6ICdpbmZvJ1xyXG5cdFx0XHRjb2xvcjogJ2JsdWUnXHJcblx0XHRcdGxldmVsOiAxXHJcblx0XHRzdWNjZXNzOlxyXG5cdFx0XHRuYW1lOiAnaW5mbydcclxuXHRcdFx0Y29sb3I6ICdncmVlbidcclxuXHRcdFx0bGV2ZWw6IDFcclxuXHRcdHdhcm46XHJcblx0XHRcdG5hbWU6ICd3YXJuJ1xyXG5cdFx0XHRjb2xvcjogJ21hZ2VudGEnXHJcblx0XHRcdGxldmVsOiAxXHJcblx0XHRlcnJvcjpcclxuXHRcdFx0bmFtZTogJ2Vycm9yJ1xyXG5cdFx0XHRjb2xvcjogJ3JlZCdcclxuXHRcdFx0bGV2ZWw6IDBcclxuXHJcblx0Y29uc3RydWN0b3I6IChAbmFtZSwgY29uZmlnPXt9KSAtPlxyXG5cdFx0c2VsZiA9IEBcclxuXHRcdEBjb25maWcgPSB7fVxyXG5cclxuXHRcdF8uZXh0ZW5kIEBjb25maWcsIGNvbmZpZ1xyXG5cclxuXHRcdGlmIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV0/XHJcblx0XHRcdExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV0ud2FybiAnRHVwbGljYXRlZCBpbnN0YW5jZSdcclxuXHRcdFx0cmV0dXJuIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV1cclxuXHJcblx0XHRmb3IgdHlwZSwgdHlwZUNvbmZpZyBvZiBAZGVmYXVsdFR5cGVzXHJcblx0XHRcdGRvICh0eXBlLCB0eXBlQ29uZmlnKSAtPlxyXG5cdFx0XHRcdHNlbGZbdHlwZV0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdFx0bGV2ZWw6IHR5cGVDb25maWcubGV2ZWxcclxuXHRcdFx0XHRcdFx0bWV0aG9kOiB0eXBlQ29uZmlnLm5hbWVcclxuXHRcdFx0XHRcdFx0YXJndW1lbnRzOiBhcmdzXHJcblxyXG5cdFx0XHRcdHNlbGZbdHlwZStcIl9ib3hcIl0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdFx0Ym94OiB0cnVlXHJcblx0XHRcdFx0XHRcdGxldmVsOiB0eXBlQ29uZmlnLmxldmVsXHJcblx0XHRcdFx0XHRcdG1ldGhvZDogdHlwZUNvbmZpZy5uYW1lXHJcblx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xyXG5cclxuXHRcdGlmIEBjb25maWcubWV0aG9kcz9cclxuXHRcdFx0Zm9yIG1ldGhvZCwgdHlwZUNvbmZpZyBvZiBAY29uZmlnLm1ldGhvZHNcclxuXHRcdFx0XHRkbyAobWV0aG9kLCB0eXBlQ29uZmlnKSAtPlxyXG5cdFx0XHRcdFx0aWYgc2VsZlttZXRob2RdP1xyXG5cdFx0XHRcdFx0XHRzZWxmLndhcm4gXCJNZXRob2RcIiwgbWV0aG9kLCBcImFscmVhZHkgZXhpc3RzXCJcclxuXHJcblx0XHRcdFx0XHRpZiBub3Qgc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT9cclxuXHRcdFx0XHRcdFx0c2VsZi53YXJuIFwiTWV0aG9kIHR5cGVcIiwgdHlwZUNvbmZpZy50eXBlLCBcImRvZXMgbm90IGV4aXN0XCJcclxuXHJcblx0XHRcdFx0XHRzZWxmW21ldGhvZF0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdFx0c2VsZi5fbG9nLmNhbGwgc2VsZixcclxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uOiB0aGlzLl9fc2VjdGlvblxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IHR5cGVDb25maWcudHlwZVxyXG5cdFx0XHRcdFx0XHRcdGxldmVsOiBpZiB0eXBlQ29uZmlnLmxldmVsPyB0aGVuIHR5cGVDb25maWcubGV2ZWwgZWxzZSBzZWxmLmRlZmF1bHRUeXBlc1t0eXBlQ29uZmlnLnR5cGVdPy5sZXZlbFxyXG5cdFx0XHRcdFx0XHRcdG1ldGhvZDogbWV0aG9kXHJcblx0XHRcdFx0XHRcdFx0YXJndW1lbnRzOiBhcmdzXHJcblxyXG5cdFx0XHRcdFx0c2VsZlttZXRob2QrXCJfYm94XCJdID0gKGFyZ3MuLi4pIC0+XHJcblx0XHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdFx0c2VjdGlvbjogdGhpcy5fX3NlY3Rpb25cclxuXHRcdFx0XHRcdFx0XHR0eXBlOiB0eXBlQ29uZmlnLnR5cGVcclxuXHRcdFx0XHRcdFx0XHRib3g6IHRydWVcclxuXHRcdFx0XHRcdFx0XHRsZXZlbDogaWYgdHlwZUNvbmZpZy5sZXZlbD8gdGhlbiB0eXBlQ29uZmlnLmxldmVsIGVsc2Ugc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT8ubGV2ZWxcclxuXHRcdFx0XHRcdFx0XHRtZXRob2Q6IG1ldGhvZFxyXG5cdFx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xyXG5cclxuXHRcdGlmIEBjb25maWcuc2VjdGlvbnM/XHJcblx0XHRcdGZvciBzZWN0aW9uLCBuYW1lIG9mIEBjb25maWcuc2VjdGlvbnNcclxuXHRcdFx0XHRkbyAoc2VjdGlvbiwgbmFtZSkgLT5cclxuXHRcdFx0XHRcdHNlbGZbc2VjdGlvbl0gPSB7fVxyXG5cdFx0XHRcdFx0Zm9yIHR5cGUsIHR5cGVDb25maWcgb2Ygc2VsZi5kZWZhdWx0VHlwZXNcclxuXHRcdFx0XHRcdFx0ZG8gKHR5cGUsIHR5cGVDb25maWcpID0+XHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVt0eXBlXSA9ID0+XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGVdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVt0eXBlK1wiX2JveFwiXSA9ID0+XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGUrXCJfYm94XCJdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRmb3IgbWV0aG9kLCB0eXBlQ29uZmlnIG9mIHNlbGYuY29uZmlnLm1ldGhvZHNcclxuXHRcdFx0XHRcdFx0ZG8gKG1ldGhvZCwgdHlwZUNvbmZpZykgPT5cclxuXHRcdFx0XHRcdFx0XHRzZWxmW3NlY3Rpb25dW21ldGhvZF0gPSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZlttZXRob2RdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVttZXRob2QrXCJfYm94XCJdID0gPT5cclxuXHRcdFx0XHRcdFx0XHRcdHNlbGZbbWV0aG9kK1wiX2JveFwiXS5hcHBseSB7X19zZWN0aW9uOiBuYW1lfSwgYXJndW1lbnRzXHJcblxyXG5cdFx0TG9nZ2VyTWFuYWdlci5yZWdpc3RlciBAXHJcblx0XHRyZXR1cm4gQFxyXG5cclxuXHRnZXRQcmVmaXg6IChvcHRpb25zKSAtPlxyXG5cdFx0aWYgb3B0aW9ucy5zZWN0aW9uP1xyXG5cdFx0XHRwcmVmaXggPSBcIiN7QG5hbWV9IOKelCAje29wdGlvbnMuc2VjdGlvbn0uI3tvcHRpb25zLm1ldGhvZH1cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwcmVmaXggPSBcIiN7QG5hbWV9IOKelCAje29wdGlvbnMubWV0aG9kfVwiXHJcblxyXG5cdFx0ZGV0YWlscyA9IEBfZ2V0Q2FsbGVyRGV0YWlscygpXHJcblxyXG5cdFx0ZGV0YWlsUGFydHMgPSBbXVxyXG5cdFx0aWYgZGV0YWlscy5wYWNrYWdlPyBhbmQgKExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgaXMgdHJ1ZSBvciBvcHRpb25zLnR5cGUgaXMgJ2Vycm9yJylcclxuXHRcdFx0ZGV0YWlsUGFydHMucHVzaCBkZXRhaWxzLnBhY2thZ2VcclxuXHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLnNob3dGaWxlQW5kTGluZSBpcyB0cnVlIG9yIG9wdGlvbnMudHlwZSBpcyAnZXJyb3InXHJcblx0XHRcdGlmIGRldGFpbHMuZmlsZT8gYW5kIGRldGFpbHMubGluZT9cclxuXHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIFwiI3tkZXRhaWxzLmZpbGV9OiN7ZGV0YWlscy5saW5lfVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBkZXRhaWxzLmZpbGU/XHJcblx0XHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIGRldGFpbHMuZmlsZVxyXG5cdFx0XHRcdGlmIGRldGFpbHMubGluZT9cclxuXHRcdFx0XHRcdGRldGFpbFBhcnRzLnB1c2ggZGV0YWlscy5saW5lXHJcblxyXG5cdFx0aWYgQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdP1xyXG4jXHRcdFx0cHJlZml4ID0gcHJlZml4W0BkZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcl0g55Sx5LqOY29sb3JzIOWMheeahOmXrumimO+8jOacjeWKoeerr+aaguaXtuS4jeaUr+aMgWxvZyBjb2xvciDmmL7npLpcclxuXHRcdFx0cHJlZml4ID0gY2hhbGtbQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXShwcmVmaXgpXHJcblxyXG5cdFx0aWYgZGV0YWlsUGFydHMubGVuZ3RoID4gMFxyXG5cdFx0XHRwcmVmaXggPSBcIiN7ZGV0YWlsUGFydHMuam9pbignICcpfSAje3ByZWZpeH1cIlxyXG5cclxuXHRcdHJldHVybiBwcmVmaXhcclxuXHJcblx0IyBAcmV0dXJucyB7T2JqZWN0OiB7IGxpbmU6IE51bWJlciwgZmlsZTogU3RyaW5nIH19XHJcblx0X2dldENhbGxlckRldGFpbHM6IC0+XHJcblx0XHRnZXRTdGFjayA9ICgpIC0+XHJcblx0XHRcdCMgV2UgZG8gTk9UIHVzZSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSBoZXJlIChhIFY4IGV4dGVuc2lvbiB0aGF0IGdldHMgdXMgYVxyXG5cdFx0XHQjIHByZS1wYXJzZWQgc3RhY2spIHNpbmNlIGl0J3MgaW1wb3NzaWJsZSB0byBjb21wb3NlIGl0IHdpdGggdGhlIHVzZSBvZlxyXG5cdFx0XHQjIEVycm9yLnByZXBhcmVTdGFja1RyYWNlIHVzZWQgb24gdGhlIHNlcnZlciBmb3Igc291cmNlIG1hcHMuXHJcblx0XHRcdGVyciA9IG5ldyBFcnJvclxyXG5cdFx0XHRzdGFjayA9IGVyci5zdGFja1xyXG5cdFx0XHRyZXR1cm4gc3RhY2tcclxuXHJcblx0XHRzdGFjayA9IGdldFN0YWNrKClcclxuXHJcblx0XHRpZiBub3Qgc3RhY2tcclxuXHRcdFx0cmV0dXJuIHt9XHJcblxyXG5cdFx0bGluZXMgPSBzdGFjay5zcGxpdCgnXFxuJylcclxuXHJcblx0XHQjIGxvb2tpbmcgZm9yIHRoZSBmaXJzdCBsaW5lIG91dHNpZGUgdGhlIGxvZ2dpbmcgcGFja2FnZSAob3IgYW5cclxuXHRcdCMgZXZhbCBpZiB3ZSBmaW5kIHRoYXQgZmlyc3QpXHJcblx0XHRsaW5lID0gdW5kZWZpbmVkXHJcblx0XHRmb3IgaXRlbSwgaW5kZXggaW4gbGluZXMgd2hlbiBpbmRleCA+IDBcclxuXHRcdFx0bGluZSA9IGl0ZW1cclxuXHRcdFx0aWYgbGluZS5tYXRjaCgvXlxccyphdCBldmFsIFxcKGV2YWwvKVxyXG5cdFx0XHRcdHJldHVybiB7ZmlsZTogXCJldmFsXCJ9XHJcblxyXG5cdFx0XHRpZiBub3QgbGluZS5tYXRjaCgvcGFja2FnZXNcXC9yb2NrZXRjaGF0X2xvZ2dlcig/OlxcL3xcXC5qcykvKVxyXG5cdFx0XHRcdGJyZWFrXHJcblxyXG5cdFx0ZGV0YWlscyA9IHt9XHJcblxyXG5cdFx0IyBUaGUgZm9ybWF0IGZvciBGRiBpcyAnZnVuY3Rpb25OYW1lQGZpbGVQYXRoOmxpbmVOdW1iZXInXHJcblx0XHQjIFRoZSBmb3JtYXQgZm9yIFY4IGlzICdmdW5jdGlvbk5hbWUgKHBhY2thZ2VzL2xvZ2dpbmcvbG9nZ2luZy5qczo4MSknIG9yXHJcblx0XHQjICAgICAgICAgICAgICAgICAgICAgICdwYWNrYWdlcy9sb2dnaW5nL2xvZ2dpbmcuanM6ODEnXHJcblx0XHRtYXRjaCA9IC8oPzpbQChdfCBhdCApKFteKF0rPyk6KFswLTk6XSspKD86XFwpfCQpLy5leGVjKGxpbmUpXHJcblx0XHRpZiBub3QgbWF0Y2hcclxuXHRcdFx0cmV0dXJuIGRldGFpbHNcclxuXHRcdCMgaW4gY2FzZSB0aGUgbWF0Y2hlZCBibG9jayBoZXJlIGlzIGxpbmU6Y29sdW1uXHJcblx0XHRkZXRhaWxzLmxpbmUgPSBtYXRjaFsyXS5zcGxpdCgnOicpWzBdXHJcblxyXG5cdFx0IyBQb3NzaWJsZSBmb3JtYXQ6IGh0dHBzOi8vZm9vLmJhci5jb20vc2NyaXB0cy9maWxlLmpzP3JhbmRvbT1mb29iYXJcclxuXHRcdCMgWFhYOiBpZiB5b3UgY2FuIHdyaXRlIHRoZSBmb2xsb3dpbmcgaW4gYmV0dGVyIHdheSwgcGxlYXNlIGRvIGl0XHJcblx0XHQjIFhYWDogd2hhdCBhYm91dCBldmFscz9cclxuXHRcdGRldGFpbHMuZmlsZSA9IG1hdGNoWzFdLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdLnNwbGl0KCc/JylbMF1cclxuXHJcblx0XHRwYWNrYWdlTWF0Y2ggPSBtYXRjaFsxXS5tYXRjaCgvcGFja2FnZXNcXC8oW15cXC5cXC9dKykoPzpcXC98XFwuKS8pXHJcblx0XHRpZiBwYWNrYWdlTWF0Y2g/XHJcblx0XHRcdGRldGFpbHMucGFja2FnZSA9IHBhY2thZ2VNYXRjaFsxXVxyXG5cclxuXHRcdHJldHVybiBkZXRhaWxzXHJcblxyXG5cdG1ha2VBQm94OiAobWVzc2FnZSwgdGl0bGUpIC0+XHJcblx0XHRpZiBub3QgXy5pc0FycmF5KG1lc3NhZ2UpXHJcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLnNwbGl0KFwiXFxuXCIpXHJcblxyXG5cdFx0bGVuID0gMFxyXG5cdFx0Zm9yIGxpbmUgaW4gbWVzc2FnZVxyXG5cdFx0XHRsZW4gPSBNYXRoLm1heChsZW4sIGxpbmUubGVuZ3RoKVxyXG5cclxuXHRcdHRvcExpbmUgPSBcIistLVwiICsgcy5wYWQoJycsIGxlbiwgJy0nKSArIFwiLS0rXCJcclxuXHRcdHNlcGFyYXRvciA9IFwifCAgXCIgKyBzLnBhZCgnJywgbGVuLCAnJykgKyBcIiAgfFwiXHJcblx0XHRsaW5lcyA9IFtdXHJcblxyXG5cdFx0bGluZXMucHVzaCB0b3BMaW5lXHJcblx0XHRpZiB0aXRsZT9cclxuXHRcdFx0bGluZXMucHVzaCBcInwgIFwiICsgcy5scnBhZCh0aXRsZSwgbGVuKSArIFwiICB8XCJcclxuXHRcdFx0bGluZXMucHVzaCB0b3BMaW5lXHJcblxyXG5cdFx0bGluZXMucHVzaCBzZXBhcmF0b3JcclxuXHJcblx0XHRmb3IgbGluZSBpbiBtZXNzYWdlXHJcblx0XHRcdGxpbmVzLnB1c2ggXCJ8ICBcIiArIHMucnBhZChsaW5lLCBsZW4pICsgXCIgIHxcIlxyXG5cclxuXHRcdGxpbmVzLnB1c2ggc2VwYXJhdG9yXHJcblx0XHRsaW5lcy5wdXNoIHRvcExpbmVcclxuXHRcdHJldHVybiBsaW5lc1xyXG5cclxuXHJcblx0X2xvZzogKG9wdGlvbnMpIC0+XHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLmVuYWJsZWQgaXMgZmFsc2VcclxuXHRcdFx0TG9nZ2VyTWFuYWdlci5hZGRUb1F1ZXVlIEAsIGFyZ3VtZW50c1xyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRvcHRpb25zLmxldmVsID89IDFcclxuXHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLmxvZ0xldmVsIDwgb3B0aW9ucy5sZXZlbFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRwcmVmaXggPSBAZ2V0UHJlZml4KG9wdGlvbnMpXHJcblxyXG5cdFx0aWYgb3B0aW9ucy5ib3ggaXMgdHJ1ZSBhbmQgXy5pc1N0cmluZyhvcHRpb25zLmFyZ3VtZW50c1swXSlcclxuXHRcdFx0Y29sb3IgPSB1bmRlZmluZWRcclxuXHRcdFx0aWYgQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdP1xyXG5cdFx0XHRcdGNvbG9yID0gQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXHJcblxyXG5cdFx0XHRib3ggPSBAbWFrZUFCb3ggb3B0aW9ucy5hcmd1bWVudHNbMF0sIG9wdGlvbnMuYXJndW1lbnRzWzFdXHJcblx0XHRcdHN1YlByZWZpeCA9ICfinpQnXHJcblx0XHRcdGlmIGNvbG9yP1xyXG5cdFx0XHRcdHN1YlByZWZpeCA9IHN1YlByZWZpeFtjb2xvcl1cclxuXHJcblx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgcHJlZml4XHJcblx0XHRcdGZvciBsaW5lIGluIGJveFxyXG5cdFx0XHRcdGlmIGNvbG9yP1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgc3ViUHJlZml4LCBsaW5lW2NvbG9yXVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgbGluZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRvcHRpb25zLmFyZ3VtZW50cy51bnNoaWZ0IHByZWZpeFxyXG5cdFx0XHRjb25zb2xlLmxvZy5hcHBseSBjb25zb2xlLCBvcHRpb25zLmFyZ3VtZW50c1xyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHJcbkBTeXN0ZW1Mb2dnZXIgPSBuZXcgTG9nZ2VyICdTeXN0ZW0nLFxyXG5cdG1ldGhvZHM6XHJcblx0XHRzdGFydHVwOlxyXG5cdFx0XHR0eXBlOiAnc3VjY2VzcydcclxuXHRcdFx0bGV2ZWw6IDBcclxuXHJcbnByb2Nlc3NTdHJpbmcgPSAoc3RyaW5nLCBkYXRlKSAtPlxyXG5cdGlmIHN0cmluZ1swXSBpcyAneydcclxuXHRcdHRyeVxyXG5cdFx0XHRyZXR1cm4gTG9nLmZvcm1hdCBFSlNPTi5wYXJzZShzdHJpbmcpLCB7Y29sb3I6IHRydWV9XHJcblxyXG5cdHRyeVxyXG5cdFx0cmV0dXJuIExvZy5mb3JtYXQge21lc3NhZ2U6IHN0cmluZywgdGltZTogZGF0ZSwgbGV2ZWw6ICdpbmZvJ30sIHtjb2xvcjogdHJ1ZX1cclxuXHJcblx0cmV0dXJuIHN0cmluZ1xyXG5cclxuU3RkT3V0ID0gbmV3IGNsYXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXHJcblx0Y29uc3RydWN0b3I6IC0+XHJcblx0XHRAcXVldWUgPSBbXVxyXG5cdFx0d3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZVxyXG5cdFx0cHJvY2Vzcy5zdGRvdXQud3JpdGUgPSAoc3RyaW5nLCBlbmNvZGluZywgZmQpID0+XHJcblx0XHRcdHdyaXRlLmFwcGx5KHByb2Nlc3Muc3Rkb3V0LCBhcmd1bWVudHMpXHJcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0XHRzdHJpbmcgPSBwcm9jZXNzU3RyaW5nIHN0cmluZywgZGF0ZVxyXG5cclxuXHRcdFx0aXRlbSA9XHJcblx0XHRcdFx0aWQ6IFJhbmRvbS5pZCgpXHJcblx0XHRcdFx0c3RyaW5nOiBzdHJpbmdcclxuXHRcdFx0XHR0czogZGF0ZVxyXG5cclxuXHRcdFx0QHF1ZXVlLnB1c2ggaXRlbVxyXG5cclxuXHRcdFx0IyBpZiBSb2NrZXRDaGF0Py5zZXR0aW5ncz8uZ2V0KCdMb2dfVmlld19MaW1pdCcpPyBhbmQgQHF1ZXVlLmxlbmd0aCA+IFJvY2tldENoYXQuc2V0dGluZ3MuZ2V0KCdMb2dfVmlld19MaW1pdCcpXHJcblx0XHRcdCMgXHRAcXVldWUuc2hpZnQoKVxyXG5cclxuXHRcdFx0dmlld0xpbWl0ID0gTWV0ZW9yLnNldHRpbmdzPy5sb2dnZXI/LnZpZXdMaW1pdFxyXG5cdFx0XHR1bmxlc3Mgdmlld0xpbWl0XHJcblx0XHRcdFx0dmlld0xpbWl0ID0gMTAwMFxyXG5cdFx0XHRpZiBAcXVldWUubGVuZ3RoID4gdmlld0xpbWl0XHJcblx0XHRcdFx0QHF1ZXVlLnNoaWZ0KClcclxuXHJcblx0XHRcdEBlbWl0ICd3cml0ZScsIHN0cmluZywgaXRlbVxyXG5cclxuXHJcbk1ldGVvci5wdWJsaXNoICdzdGRvdXQnLCAtPlxyXG5cdHVubGVzcyBAdXNlcklkXHJcblx0XHRyZXR1cm4gQHJlYWR5KClcclxuXHJcblx0IyBpZiBSb2NrZXRDaGF0LmF1dGh6Lmhhc1Blcm1pc3Npb24oQHVzZXJJZCwgJ3ZpZXctbG9ncycpIGlzbnQgdHJ1ZVxyXG5cdCMgXHRyZXR1cm4gQHJlYWR5KClcclxuXHJcblx0dW5sZXNzIEB1c2VySWRcclxuXHRcdHJldHVybiBAcmVhZHkoKVxyXG5cclxuXHR1c2VyID0gZGIudXNlcnMuZmluZE9uZShAdXNlcklkLCB7ZmllbGRzOiB7aXNfY2xvdWRhZG1pbjogMX19KVxyXG5cclxuXHR1bmxlc3MgdXNlclxyXG5cdFx0cmV0dXJuIEByZWFkeSgpXHJcblxyXG5cdGZvciBpdGVtIGluIFN0ZE91dC5xdWV1ZVxyXG5cdFx0QGFkZGVkICdzdGRvdXQnLCBpdGVtLmlkLFxyXG5cdFx0XHRzdHJpbmc6IGl0ZW0uc3RyaW5nXHJcblx0XHRcdHRzOiBpdGVtLnRzXHJcblxyXG5cdEByZWFkeSgpXHJcblxyXG5cdFN0ZE91dC5vbiAnd3JpdGUnLCAoc3RyaW5nLCBpdGVtKSA9PlxyXG5cdFx0QGFkZGVkICdzdGRvdXQnLCBpdGVtLmlkLFxyXG5cdFx0XHRzdHJpbmc6IGl0ZW0uc3RyaW5nXHJcblx0XHRcdHRzOiBpdGVtLnRzXHJcblxyXG5cdHJldHVyblxyXG5cclxuTWV0ZW9yLnN0YXJ0dXAgLT5cclxuXHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8uZW5hYmxlZFxyXG5cdFx0aWYgTWV0ZW9yLnNldHRpbmdzPy5sb2dnZXI/LnNob3dQYWNrYWdlXHJcblx0XHRcdExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgPSB0cnVlO1xyXG5cdFx0aWYgTWV0ZW9yLnNldHRpbmdzPy5sb2dnZXI/LnNob3dGaWxlQW5kTGluZVxyXG5cdFx0XHRMb2dnZXJNYW5hZ2VyLnNob3dGaWxlQW5kTGluZSA9IHRydWU7XHJcblx0XHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8ubG9nTGV2ZWxcclxuXHRcdFx0TG9nZ2VyTWFuYWdlci5sb2dMZXZlbCA9IE1ldGVvci5zZXR0aW5ncy5sb2dnZXIubG9nTGV2ZWw7XHJcblxyXG5cdFx0TG9nZ2VyTWFuYWdlci5lbmFibGUodHJ1ZSk7XHJcblxyXG4iLCJ2YXIgU3RkT3V0LCBjYW5EZWZpbmVOb25FbnVtZXJhYmxlUHJvcGVydGllcywgY2hhbGssIHByb2Nlc3NTdHJpbmcsIHNhbml0aXplRWFzeSwgc2FuaXRpemVIYXJkLCAgICAgICAgXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBzbGljZSA9IFtdLnNsaWNlO1xuXG5jaGFsayA9IHJlcXVpcmUoXCJjaGFsa1wiKTtcblxuY2hhbGsuZW5hYmxlZCA9IHRydWU7XG5cbmNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlLCBrLCB0ZXN0T2JqLCB0ZXN0UHJvcE5hbWU7XG4gIHRlc3RPYmogPSB7fTtcbiAgdGVzdFByb3BOYW1lID0gJ3QnO1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0ZXN0T2JqLCB0ZXN0UHJvcE5hbWUsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHRlc3RPYmpcbiAgICB9KTtcbiAgICBmb3IgKGsgaW4gdGVzdE9iaikge1xuICAgICAgaWYgKGsgPT09IHRlc3RQcm9wTmFtZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGUgPSBlcnJvcjtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRlc3RPYmpbdGVzdFByb3BOYW1lXSA9PT0gdGVzdE9iajtcbn07XG5cbnNhbml0aXplRWFzeSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbnNhbml0aXplSGFyZCA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgaSwga2V5LCBrZXlDb3VudCwga2V5cywgbmV3T2JqO1xuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgbmV3T2JqID0ge307XG4gICAga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAga2V5Q291bnQgPSBrZXlzLmxlbmd0aDtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGtleUNvdW50KSB7XG4gICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgbmV3T2JqW2tleV0gPSBvYmpba2V5XTtcbiAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld09iajtcbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxudGhpcy5tZXRlb3JCYWJlbEhlbHBlcnMgPSB7XG4gIHNhbml0aXplRm9ySW5PYmplY3Q6IGNhbkRlZmluZU5vbkVudW1lcmFibGVQcm9wZXJ0aWVzKCkgPyBzYW5pdGl6ZUVhc3kgOiBzYW5pdGl6ZUhhcmQsXG4gIF9zYW5pdGl6ZUZvckluT2JqZWN0SGFyZDogc2FuaXRpemVIYXJkXG59O1xuXG50aGlzLkxvZ2dlck1hbmFnZXIgPSBuZXcgKChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChfQ2xhc3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIF9DbGFzcygpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmxvZ2dlcnMgPSB7fTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5zaG93UGFja2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuc2hvd0ZpbGVBbmRMaW5lID0gZmFsc2U7XG4gICAgdGhpcy5sb2dMZXZlbCA9IDA7XG4gIH1cblxuICBfQ2xhc3MucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24obG9nZ2VyKSB7XG4gICAgaWYgKCFsb2dnZXIgaW5zdGFuY2VvZiBMb2dnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sb2dnZXJzW2xvZ2dlci5uYW1lXSA9IGxvZ2dlcjtcbiAgICByZXR1cm4gdGhpcy5lbWl0KCdyZWdpc3RlcicsIGxvZ2dlcik7XG4gIH07XG5cbiAgX0NsYXNzLnByb3RvdHlwZS5hZGRUb1F1ZXVlID0gZnVuY3Rpb24obG9nZ2VyLCBhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUucHVzaCh7XG4gICAgICBsb2dnZXI6IGxvZ2dlcixcbiAgICAgIGFyZ3M6IGFyZ3NcbiAgICB9KTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmRpc3BhdGNoUXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbSwgaiwgbGVuMSwgcmVmO1xuICAgIHJlZiA9IHRoaXMucXVldWU7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IHJlZi5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgIGl0ZW0gPSByZWZbal07XG4gICAgICBpdGVtLmxvZ2dlci5fbG9nLmFwcGx5KGl0ZW0ubG9nZ2VyLCBpdGVtLmFyZ3MpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jbGVhclF1ZXVlKCk7XG4gIH07XG5cbiAgX0NsYXNzLnByb3RvdHlwZS5jbGVhclF1ZXVlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucXVldWUgPSBbXTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIH07XG5cbiAgX0NsYXNzLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbihkaXNwYXRjaFF1ZXVlKSB7XG4gICAgaWYgKGRpc3BhdGNoUXVldWUgPT0gbnVsbCkge1xuICAgICAgZGlzcGF0Y2hRdWV1ZSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgIGlmIChkaXNwYXRjaFF1ZXVlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaFF1ZXVlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyUXVldWUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIF9DbGFzcztcblxufSkoRXZlbnRFbWl0dGVyKSk7XG5cbnRoaXMuTG9nZ2VyID0gTG9nZ2VyID0gKGZ1bmN0aW9uKCkge1xuICBMb2dnZXIucHJvdG90eXBlLmRlZmF1bHRUeXBlcyA9IHtcbiAgICBkZWJ1Zzoge1xuICAgICAgbmFtZTogJ2RlYnVnJyxcbiAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICBsZXZlbDogMlxuICAgIH0sXG4gICAgbG9nOiB7XG4gICAgICBuYW1lOiAnaW5mbycsXG4gICAgICBjb2xvcjogJ2JsdWUnLFxuICAgICAgbGV2ZWw6IDFcbiAgICB9LFxuICAgIGluZm86IHtcbiAgICAgIG5hbWU6ICdpbmZvJyxcbiAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICBsZXZlbDogMVxuICAgIH0sXG4gICAgc3VjY2Vzczoge1xuICAgICAgbmFtZTogJ2luZm8nLFxuICAgICAgY29sb3I6ICdncmVlbicsXG4gICAgICBsZXZlbDogMVxuICAgIH0sXG4gICAgd2Fybjoge1xuICAgICAgbmFtZTogJ3dhcm4nLFxuICAgICAgY29sb3I6ICdtYWdlbnRhJyxcbiAgICAgIGxldmVsOiAxXG4gICAgfSxcbiAgICBlcnJvcjoge1xuICAgICAgbmFtZTogJ2Vycm9yJyxcbiAgICAgIGNvbG9yOiAncmVkJyxcbiAgICAgIGxldmVsOiAwXG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIExvZ2dlcihuYW1lMSwgY29uZmlnKSB7XG4gICAgdmFyIGZuLCBmbjEsIGZuMiwgbWV0aG9kLCBuYW1lLCByZWYsIHJlZjEsIHJlZjIsIHNlY3Rpb24sIHNlbGYsIHR5cGUsIHR5cGVDb25maWc7XG4gICAgdGhpcy5uYW1lID0gbmFtZTE7XG4gICAgaWYgKGNvbmZpZyA9PSBudWxsKSB7XG4gICAgICBjb25maWcgPSB7fTtcbiAgICB9XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICBfLmV4dGVuZCh0aGlzLmNvbmZpZywgY29uZmlnKTtcbiAgICBpZiAoTG9nZ2VyTWFuYWdlci5sb2dnZXJzW3RoaXMubmFtZV0gIT0gbnVsbCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5sb2dnZXJzW3RoaXMubmFtZV0ud2FybignRHVwbGljYXRlZCBpbnN0YW5jZScpO1xuICAgICAgcmV0dXJuIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1t0aGlzLm5hbWVdO1xuICAgIH1cbiAgICByZWYgPSB0aGlzLmRlZmF1bHRUeXBlcztcbiAgICBmbiA9IGZ1bmN0aW9uKHR5cGUsIHR5cGVDb25maWcpIHtcbiAgICAgIHNlbGZbdHlwZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3M7XG4gICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgcmV0dXJuIHNlbGYuX2xvZy5jYWxsKHNlbGYsIHtcbiAgICAgICAgICBzZWN0aW9uOiB0aGlzLl9fc2VjdGlvbixcbiAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgIGxldmVsOiB0eXBlQ29uZmlnLmxldmVsLFxuICAgICAgICAgIG1ldGhvZDogdHlwZUNvbmZpZy5uYW1lLFxuICAgICAgICAgIFwiYXJndW1lbnRzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHNlbGZbdHlwZSArIFwiX2JveFwiXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9nLmNhbGwoc2VsZiwge1xuICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgYm94OiB0cnVlLFxuICAgICAgICAgIGxldmVsOiB0eXBlQ29uZmlnLmxldmVsLFxuICAgICAgICAgIG1ldGhvZDogdHlwZUNvbmZpZy5uYW1lLFxuICAgICAgICAgIFwiYXJndW1lbnRzXCI6IGFyZ3NcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH07XG4gICAgZm9yICh0eXBlIGluIHJlZikge1xuICAgICAgdHlwZUNvbmZpZyA9IHJlZlt0eXBlXTtcbiAgICAgIGZuKHR5cGUsIHR5cGVDb25maWcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb25maWcubWV0aG9kcyAhPSBudWxsKSB7XG4gICAgICByZWYxID0gdGhpcy5jb25maWcubWV0aG9kcztcbiAgICAgIGZuMSA9IGZ1bmN0aW9uKG1ldGhvZCwgdHlwZUNvbmZpZykge1xuICAgICAgICBpZiAoc2VsZlttZXRob2RdICE9IG51bGwpIHtcbiAgICAgICAgICBzZWxmLndhcm4oXCJNZXRob2RcIiwgbWV0aG9kLCBcImFscmVhZHkgZXhpc3RzXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWxmLmRlZmF1bHRUeXBlc1t0eXBlQ29uZmlnLnR5cGVdID09IG51bGwpIHtcbiAgICAgICAgICBzZWxmLndhcm4oXCJNZXRob2QgdHlwZVwiLCB0eXBlQ29uZmlnLnR5cGUsIFwiZG9lcyBub3QgZXhpc3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZlttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGFyZ3MsIHJlZjI7XG4gICAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICAgIHJldHVybiBzZWxmLl9sb2cuY2FsbChzZWxmLCB7XG4gICAgICAgICAgICBzZWN0aW9uOiB0aGlzLl9fc2VjdGlvbixcbiAgICAgICAgICAgIHR5cGU6IHR5cGVDb25maWcudHlwZSxcbiAgICAgICAgICAgIGxldmVsOiB0eXBlQ29uZmlnLmxldmVsICE9IG51bGwgPyB0eXBlQ29uZmlnLmxldmVsIDogKHJlZjIgPSBzZWxmLmRlZmF1bHRUeXBlc1t0eXBlQ29uZmlnLnR5cGVdKSAhPSBudWxsID8gcmVmMi5sZXZlbCA6IHZvaWQgMCxcbiAgICAgICAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgICAgICAgXCJhcmd1bWVudHNcIjogYXJnc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gc2VsZlttZXRob2QgKyBcIl9ib3hcIl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncywgcmVmMjtcbiAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX2xvZy5jYWxsKHNlbGYsIHtcbiAgICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogdHlwZUNvbmZpZy50eXBlLFxuICAgICAgICAgICAgYm94OiB0cnVlLFxuICAgICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwgIT0gbnVsbCA/IHR5cGVDb25maWcubGV2ZWwgOiAocmVmMiA9IHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0pICE9IG51bGwgPyByZWYyLmxldmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBcImFyZ3VtZW50c1wiOiBhcmdzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgZm9yIChtZXRob2QgaW4gcmVmMSkge1xuICAgICAgICB0eXBlQ29uZmlnID0gcmVmMVttZXRob2RdO1xuICAgICAgICBmbjEobWV0aG9kLCB0eXBlQ29uZmlnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuY29uZmlnLnNlY3Rpb25zICE9IG51bGwpIHtcbiAgICAgIHJlZjIgPSB0aGlzLmNvbmZpZy5zZWN0aW9ucztcbiAgICAgIGZuMiA9IGZ1bmN0aW9uKHNlY3Rpb24sIG5hbWUpIHtcbiAgICAgICAgdmFyIGZuMywgcmVmMywgcmVmNCwgcmVzdWx0cztcbiAgICAgICAgc2VsZltzZWN0aW9uXSA9IHt9O1xuICAgICAgICByZWYzID0gc2VsZi5kZWZhdWx0VHlwZXM7XG4gICAgICAgIGZuMyA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbih0eXBlLCB0eXBlQ29uZmlnKSB7XG4gICAgICAgICAgICBzZWxmW3NlY3Rpb25dW3R5cGVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWxmW3R5cGVdLmFwcGx5KHtcbiAgICAgICAgICAgICAgICBfX3NlY3Rpb246IG5hbWVcbiAgICAgICAgICAgICAgfSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gc2VsZltzZWN0aW9uXVt0eXBlICsgXCJfYm94XCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWxmW3R5cGUgKyBcIl9ib3hcIl0uYXBwbHkoe1xuICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICB9LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKTtcbiAgICAgICAgZm9yICh0eXBlIGluIHJlZjMpIHtcbiAgICAgICAgICB0eXBlQ29uZmlnID0gcmVmM1t0eXBlXTtcbiAgICAgICAgICBmbjModHlwZSwgdHlwZUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICAgICAgcmVmNCA9IHNlbGYuY29uZmlnLm1ldGhvZHM7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgICAgZm9yIChtZXRob2QgaW4gcmVmNCkge1xuICAgICAgICAgIHR5cGVDb25maWcgPSByZWY0W21ldGhvZF07XG4gICAgICAgICAgcmVzdWx0cy5wdXNoKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG1ldGhvZCwgdHlwZUNvbmZpZykge1xuICAgICAgICAgICAgICBzZWxmW3NlY3Rpb25dW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZlttZXRob2RdLmFwcGx5KHtcbiAgICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICAgIH0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIHJldHVybiBzZWxmW3NlY3Rpb25dW21ldGhvZCArIFwiX2JveFwiXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmW21ldGhvZCArIFwiX2JveFwiXS5hcHBseSh7XG4gICAgICAgICAgICAgICAgICBfX3NlY3Rpb246IG5hbWVcbiAgICAgICAgICAgICAgICB9LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSh0aGlzKShtZXRob2QsIHR5cGVDb25maWcpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICAgIH07XG4gICAgICBmb3IgKHNlY3Rpb24gaW4gcmVmMikge1xuICAgICAgICBuYW1lID0gcmVmMltzZWN0aW9uXTtcbiAgICAgICAgZm4yKHNlY3Rpb24sIG5hbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBMb2dnZXJNYW5hZ2VyLnJlZ2lzdGVyKHRoaXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5nZXRQcmVmaXggPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGRldGFpbFBhcnRzLCBkZXRhaWxzLCBwcmVmaXg7XG4gICAgaWYgKG9wdGlvbnMuc2VjdGlvbiAhPSBudWxsKSB7XG4gICAgICBwcmVmaXggPSB0aGlzLm5hbWUgKyBcIiDinpQgXCIgKyBvcHRpb25zLnNlY3Rpb24gKyBcIi5cIiArIG9wdGlvbnMubWV0aG9kO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcmVmaXggPSB0aGlzLm5hbWUgKyBcIiDinpQgXCIgKyBvcHRpb25zLm1ldGhvZDtcbiAgICB9XG4gICAgZGV0YWlscyA9IHRoaXMuX2dldENhbGxlckRldGFpbHMoKTtcbiAgICBkZXRhaWxQYXJ0cyA9IFtdO1xuICAgIGlmICgoZGV0YWlsc1tcInBhY2thZ2VcIl0gIT0gbnVsbCkgJiYgKExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgPT09IHRydWUgfHwgb3B0aW9ucy50eXBlID09PSAnZXJyb3InKSkge1xuICAgICAgZGV0YWlsUGFydHMucHVzaChkZXRhaWxzW1wicGFja2FnZVwiXSk7XG4gICAgfVxuICAgIGlmIChMb2dnZXJNYW5hZ2VyLnNob3dGaWxlQW5kTGluZSA9PT0gdHJ1ZSB8fCBvcHRpb25zLnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgIGlmICgoZGV0YWlscy5maWxlICE9IG51bGwpICYmIChkZXRhaWxzLmxpbmUgIT0gbnVsbCkpIHtcbiAgICAgICAgZGV0YWlsUGFydHMucHVzaChkZXRhaWxzLmZpbGUgKyBcIjpcIiArIGRldGFpbHMubGluZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZGV0YWlscy5maWxlICE9IG51bGwpIHtcbiAgICAgICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHMuZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRldGFpbHMubGluZSAhPSBudWxsKSB7XG4gICAgICAgICAgZGV0YWlsUGFydHMucHVzaChkZXRhaWxzLmxpbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdICE9IG51bGwpIHtcbiAgICAgIHByZWZpeCA9IGNoYWxrW3RoaXMuZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0uY29sb3JdKHByZWZpeCk7XG4gICAgfVxuICAgIGlmIChkZXRhaWxQYXJ0cy5sZW5ndGggPiAwKSB7XG4gICAgICBwcmVmaXggPSAoZGV0YWlsUGFydHMuam9pbignICcpKSArIFwiIFwiICsgcHJlZml4O1xuICAgIH1cbiAgICByZXR1cm4gcHJlZml4O1xuICB9O1xuXG4gIExvZ2dlci5wcm90b3R5cGUuX2dldENhbGxlckRldGFpbHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGV0YWlscywgZ2V0U3RhY2ssIGluZGV4LCBpdGVtLCBqLCBsZW4xLCBsaW5lLCBsaW5lcywgbWF0Y2gsIHBhY2thZ2VNYXRjaCwgc3RhY2s7XG4gICAgZ2V0U3RhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBlcnIsIHN0YWNrO1xuICAgICAgZXJyID0gbmV3IEVycm9yO1xuICAgICAgc3RhY2sgPSBlcnIuc3RhY2s7XG4gICAgICByZXR1cm4gc3RhY2s7XG4gICAgfTtcbiAgICBzdGFjayA9IGdldFN0YWNrKCk7XG4gICAgaWYgKCFzdGFjaykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cbiAgICBsaW5lcyA9IHN0YWNrLnNwbGl0KCdcXG4nKTtcbiAgICBsaW5lID0gdm9pZCAwO1xuICAgIGZvciAoaW5kZXggPSBqID0gMCwgbGVuMSA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjE7IGluZGV4ID0gKytqKSB7XG4gICAgICBpdGVtID0gbGluZXNbaW5kZXhdO1xuICAgICAgaWYgKCEoaW5kZXggPiAwKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGxpbmUgPSBpdGVtO1xuICAgICAgaWYgKGxpbmUubWF0Y2goL15cXHMqYXQgZXZhbCBcXChldmFsLykpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBmaWxlOiBcImV2YWxcIlxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaWYgKCFsaW5lLm1hdGNoKC9wYWNrYWdlc1xcL3JvY2tldGNoYXRfbG9nZ2VyKD86XFwvfFxcLmpzKS8pKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBkZXRhaWxzID0ge307XG4gICAgbWF0Y2ggPSAvKD86W0AoXXwgYXQgKShbXihdKz8pOihbMC05Ol0rKSg/OlxcKXwkKS8uZXhlYyhsaW5lKTtcbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm4gZGV0YWlscztcbiAgICB9XG4gICAgZGV0YWlscy5saW5lID0gbWF0Y2hbMl0uc3BsaXQoJzonKVswXTtcbiAgICBkZXRhaWxzLmZpbGUgPSBtYXRjaFsxXS5zcGxpdCgnLycpLnNsaWNlKC0xKVswXS5zcGxpdCgnPycpWzBdO1xuICAgIHBhY2thZ2VNYXRjaCA9IG1hdGNoWzFdLm1hdGNoKC9wYWNrYWdlc1xcLyhbXlxcLlxcL10rKSg/OlxcL3xcXC4pLyk7XG4gICAgaWYgKHBhY2thZ2VNYXRjaCAhPSBudWxsKSB7XG4gICAgICBkZXRhaWxzW1wicGFja2FnZVwiXSA9IHBhY2thZ2VNYXRjaFsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGRldGFpbHM7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5tYWtlQUJveCA9IGZ1bmN0aW9uKG1lc3NhZ2UsIHRpdGxlKSB7XG4gICAgdmFyIGosIGwsIGxlbiwgbGVuMSwgbGVuMiwgbGluZSwgbGluZXMsIHNlcGFyYXRvciwgdG9wTGluZTtcbiAgICBpZiAoIV8uaXNBcnJheShtZXNzYWdlKSkge1xuICAgICAgbWVzc2FnZSA9IG1lc3NhZ2Uuc3BsaXQoXCJcXG5cIik7XG4gICAgfVxuICAgIGxlbiA9IDA7XG4gICAgZm9yIChqID0gMCwgbGVuMSA9IG1lc3NhZ2UubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICBsaW5lID0gbWVzc2FnZVtqXTtcbiAgICAgIGxlbiA9IE1hdGgubWF4KGxlbiwgbGluZS5sZW5ndGgpO1xuICAgIH1cbiAgICB0b3BMaW5lID0gXCIrLS1cIiArIHMucGFkKCcnLCBsZW4sICctJykgKyBcIi0tK1wiO1xuICAgIHNlcGFyYXRvciA9IFwifCAgXCIgKyBzLnBhZCgnJywgbGVuLCAnJykgKyBcIiAgfFwiO1xuICAgIGxpbmVzID0gW107XG4gICAgbGluZXMucHVzaCh0b3BMaW5lKTtcbiAgICBpZiAodGl0bGUgIT0gbnVsbCkge1xuICAgICAgbGluZXMucHVzaChcInwgIFwiICsgcy5scnBhZCh0aXRsZSwgbGVuKSArIFwiICB8XCIpO1xuICAgICAgbGluZXMucHVzaCh0b3BMaW5lKTtcbiAgICB9XG4gICAgbGluZXMucHVzaChzZXBhcmF0b3IpO1xuICAgIGZvciAobCA9IDAsIGxlbjIgPSBtZXNzYWdlLmxlbmd0aDsgbCA8IGxlbjI7IGwrKykge1xuICAgICAgbGluZSA9IG1lc3NhZ2VbbF07XG4gICAgICBsaW5lcy5wdXNoKFwifCAgXCIgKyBzLnJwYWQobGluZSwgbGVuKSArIFwiICB8XCIpO1xuICAgIH1cbiAgICBsaW5lcy5wdXNoKHNlcGFyYXRvcik7XG4gICAgbGluZXMucHVzaCh0b3BMaW5lKTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5fbG9nID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIHZhciBib3gsIGNvbG9yLCBqLCBsZW4xLCBsaW5lLCBwcmVmaXgsIHN1YlByZWZpeDtcbiAgICBpZiAoTG9nZ2VyTWFuYWdlci5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5hZGRUb1F1ZXVlKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmxldmVsID09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMubGV2ZWwgPSAxO1xuICAgIH1cbiAgICBpZiAoTG9nZ2VyTWFuYWdlci5sb2dMZXZlbCA8IG9wdGlvbnMubGV2ZWwpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgob3B0aW9ucyk7XG4gICAgaWYgKG9wdGlvbnMuYm94ID09PSB0cnVlICYmIF8uaXNTdHJpbmcob3B0aW9uc1tcImFyZ3VtZW50c1wiXVswXSkpIHtcbiAgICAgIGNvbG9yID0gdm9pZCAwO1xuICAgICAgaWYgKHRoaXMuZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0gIT0gbnVsbCkge1xuICAgICAgICBjb2xvciA9IHRoaXMuZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0uY29sb3I7XG4gICAgICB9XG4gICAgICBib3ggPSB0aGlzLm1ha2VBQm94KG9wdGlvbnNbXCJhcmd1bWVudHNcIl1bMF0sIG9wdGlvbnNbXCJhcmd1bWVudHNcIl1bMV0pO1xuICAgICAgc3ViUHJlZml4ID0gJ+KelCc7XG4gICAgICBpZiAoY29sb3IgIT0gbnVsbCkge1xuICAgICAgICBzdWJQcmVmaXggPSBzdWJQcmVmaXhbY29sb3JdO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coc3ViUHJlZml4LCBwcmVmaXgpO1xuICAgICAgZm9yIChqID0gMCwgbGVuMSA9IGJveC5sZW5ndGg7IGogPCBsZW4xOyBqKyspIHtcbiAgICAgICAgbGluZSA9IGJveFtqXTtcbiAgICAgICAgaWYgKGNvbG9yICE9IG51bGwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzdWJQcmVmaXgsIGxpbmVbY29sb3JdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhzdWJQcmVmaXgsIGxpbmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnNbXCJhcmd1bWVudHNcIl0udW5zaGlmdChwcmVmaXgpO1xuICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgb3B0aW9uc1tcImFyZ3VtZW50c1wiXSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBMb2dnZXI7XG5cbn0pKCk7XG5cbnRoaXMuU3lzdGVtTG9nZ2VyID0gbmV3IExvZ2dlcignU3lzdGVtJywge1xuICBtZXRob2RzOiB7XG4gICAgc3RhcnR1cDoge1xuICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxuICAgICAgbGV2ZWw6IDBcbiAgICB9XG4gIH1cbn0pO1xuXG5wcm9jZXNzU3RyaW5nID0gZnVuY3Rpb24oc3RyaW5nLCBkYXRlKSB7XG4gIGlmIChzdHJpbmdbMF0gPT09ICd7Jykge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTG9nLmZvcm1hdChFSlNPTi5wYXJzZShzdHJpbmcpLCB7XG4gICAgICAgIGNvbG9yOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge31cbiAgfVxuICB0cnkge1xuICAgIHJldHVybiBMb2cuZm9ybWF0KHtcbiAgICAgIG1lc3NhZ2U6IHN0cmluZyxcbiAgICAgIHRpbWU6IGRhdGUsXG4gICAgICBsZXZlbDogJ2luZm8nXG4gICAgfSwge1xuICAgICAgY29sb3I6IHRydWVcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHt9XG4gIHJldHVybiBzdHJpbmc7XG59O1xuXG5TdGRPdXQgPSBuZXcgKChmdW5jdGlvbihzdXBlckNsYXNzKSB7XG4gIGV4dGVuZChfQ2xhc3MsIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIF9DbGFzcygpIHtcbiAgICB2YXIgd3JpdGU7XG4gICAgdGhpcy5xdWV1ZSA9IFtdO1xuICAgIHdyaXRlID0gcHJvY2Vzcy5zdGRvdXQud3JpdGU7XG4gICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcsIGVuY29kaW5nLCBmZCkge1xuICAgICAgICB2YXIgZGF0ZSwgaXRlbSwgcmVmLCByZWYxLCB2aWV3TGltaXQ7XG4gICAgICAgIHdyaXRlLmFwcGx5KHByb2Nlc3Muc3Rkb3V0LCBhcmd1bWVudHMpO1xuICAgICAgICBkYXRlID0gbmV3IERhdGU7XG4gICAgICAgIHN0cmluZyA9IHByb2Nlc3NTdHJpbmcoc3RyaW5nLCBkYXRlKTtcbiAgICAgICAgaXRlbSA9IHtcbiAgICAgICAgICBpZDogUmFuZG9tLmlkKCksXG4gICAgICAgICAgc3RyaW5nOiBzdHJpbmcsXG4gICAgICAgICAgdHM6IGRhdGVcbiAgICAgICAgfTtcbiAgICAgICAgX3RoaXMucXVldWUucHVzaChpdGVtKTtcbiAgICAgICAgdmlld0xpbWl0ID0gKHJlZiA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWYxID0gcmVmLmxvZ2dlcikgIT0gbnVsbCA/IHJlZjEudmlld0xpbWl0IDogdm9pZCAwIDogdm9pZCAwO1xuICAgICAgICBpZiAoIXZpZXdMaW1pdCkge1xuICAgICAgICAgIHZpZXdMaW1pdCA9IDEwMDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKF90aGlzLnF1ZXVlLmxlbmd0aCA+IHZpZXdMaW1pdCkge1xuICAgICAgICAgIF90aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF90aGlzLmVtaXQoJ3dyaXRlJywgc3RyaW5nLCBpdGVtKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gIH1cblxuICByZXR1cm4gX0NsYXNzO1xuXG59KShFdmVudEVtaXR0ZXIpKTtcblxuTWV0ZW9yLnB1Ymxpc2goJ3N0ZG91dCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbSwgaiwgbGVuMSwgcmVmLCB1c2VyO1xuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZiAoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICB1c2VyID0gZGIudXNlcnMuZmluZE9uZSh0aGlzLnVzZXJJZCwge1xuICAgIGZpZWxkczoge1xuICAgICAgaXNfY2xvdWRhZG1pbjogMVxuICAgIH1cbiAgfSk7XG4gIGlmICghdXNlcikge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgcmVmID0gU3RkT3V0LnF1ZXVlO1xuICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgIGl0ZW0gPSByZWZbal07XG4gICAgdGhpcy5hZGRlZCgnc3Rkb3V0JywgaXRlbS5pZCwge1xuICAgICAgc3RyaW5nOiBpdGVtLnN0cmluZyxcbiAgICAgIHRzOiBpdGVtLnRzXG4gICAgfSk7XG4gIH1cbiAgdGhpcy5yZWFkeSgpO1xuICBTdGRPdXQub24oJ3dyaXRlJywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZywgaXRlbSkge1xuICAgICAgcmV0dXJuIF90aGlzLmFkZGVkKCdzdGRvdXQnLCBpdGVtLmlkLCB7XG4gICAgICAgIHN0cmluZzogaXRlbS5zdHJpbmcsXG4gICAgICAgIHRzOiBpdGVtLnRzXG4gICAgICB9KTtcbiAgICB9O1xuICB9KSh0aGlzKSk7XG59KTtcblxuTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWYsIHJlZjEsIHJlZjIsIHJlZjMsIHJlZjQsIHJlZjUsIHJlZjYsIHJlZjc7XG4gIGlmICgocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYubG9nZ2VyKSAhPSBudWxsID8gcmVmMS5lbmFibGVkIDogdm9pZCAwIDogdm9pZCAwKSB7XG4gICAgaWYgKChyZWYyID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjMgPSByZWYyLmxvZ2dlcikgIT0gbnVsbCA/IHJlZjMuc2hvd1BhY2thZ2UgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHJlZjQgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNSA9IHJlZjQubG9nZ2VyKSAhPSBudWxsID8gcmVmNS5zaG93RmlsZUFuZExpbmUgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIExvZ2dlck1hbmFnZXIuc2hvd0ZpbGVBbmRMaW5lID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKChyZWY2ID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjcgPSByZWY2LmxvZ2dlcikgIT0gbnVsbCA/IHJlZjcubG9nTGV2ZWwgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICAgIExvZ2dlck1hbmFnZXIubG9nTGV2ZWwgPSBNZXRlb3Iuc2V0dGluZ3MubG9nZ2VyLmxvZ0xldmVsO1xuICAgIH1cbiAgICByZXR1cm4gTG9nZ2VyTWFuYWdlci5lbmFibGUodHJ1ZSk7XG4gIH1cbn0pO1xuIl19
