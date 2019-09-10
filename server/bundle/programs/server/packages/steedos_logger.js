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
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare, Logger;

var require = meteorInstall({"node_modules":{"meteor":{"steedos:logger":{"checkNpm.js":function(require,exports,module){

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
  'chalk': '1.1.3'
}, 'steedos:logger');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"server.coffee":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/steedos_logger/server.coffee                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var StdOut,
    chalk,
    processString,
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
    var i, item, len1, ref;
    ref = this.queue;

    for (i = 0, len1 = ref.length; i < len1; i++) {
      item = ref[i];

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
    var details, getStack, i, index, item, len1, line, lines, match, packageMatch, stack;

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

    for (index = i = 0, len1 = lines.length; i < len1; index = ++i) {
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
    var i, j, len, len1, len2, line, lines, separator, topLine;

    if (!_.isArray(message)) {
      message = message.split("\n");
    }

    len = 0;

    for (i = 0, len1 = message.length; i < len1; i++) {
      line = message[i];
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

    for (j = 0, len2 = message.length; j < len2; j++) {
      line = message[j];
      lines.push("|  " + s.rpad(line, len) + "  |");
    }

    lines.push(separator);
    lines.push(topLine);
    return lines;
  };

  Logger.prototype._log = function (options) {
    var box, color, i, len1, line, prefix, subPrefix;

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

      for (i = 0, len1 = box.length; i < len1; i++) {
        line = box[i];

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
  var i, item, len1, ref, user;

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

  for (i = 0, len1 = ref.length; i < len1; i++) {
    item = ref[i];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvczpsb2dnZXIvY2hlY2tOcG0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZWVkb3NfbG9nZ2VyL3NlcnZlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOlsiY2hlY2tOcG1WZXJzaW9ucyIsIm1vZHVsZSIsImxpbmsiLCJ2IiwicmVxdWlyZSIsIlN0ZE91dCIsImNoYWxrIiwicHJvY2Vzc1N0cmluZyIsImV4dGVuZCIsImNoaWxkIiwicGFyZW50Iiwia2V5IiwiaGFzUHJvcCIsImNhbGwiLCJjdG9yIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJfX3N1cGVyX18iLCJoYXNPd25Qcm9wZXJ0eSIsInNsaWNlIiwiZW5hYmxlZCIsIkxvZ2dlck1hbmFnZXIiLCJzdXBlckNsYXNzIiwiX0NsYXNzIiwibG9nZ2VycyIsInF1ZXVlIiwic2hvd1BhY2thZ2UiLCJzaG93RmlsZUFuZExpbmUiLCJsb2dMZXZlbCIsInJlZ2lzdGVyIiwibG9nZ2VyIiwiTG9nZ2VyIiwibmFtZSIsImVtaXQiLCJhZGRUb1F1ZXVlIiwiYXJncyIsInB1c2giLCJkaXNwYXRjaFF1ZXVlIiwiaSIsIml0ZW0iLCJsZW4xIiwicmVmIiwibGVuZ3RoIiwiX2xvZyIsImFwcGx5IiwiY2xlYXJRdWV1ZSIsImRpc2FibGUiLCJlbmFibGUiLCJFdmVudEVtaXR0ZXIiLCJkZWZhdWx0VHlwZXMiLCJkZWJ1ZyIsImNvbG9yIiwibGV2ZWwiLCJsb2ciLCJpbmZvIiwic3VjY2VzcyIsIndhcm4iLCJlcnJvciIsIm5hbWUxIiwiY29uZmlnIiwiZm4iLCJmbjEiLCJmbjIiLCJtZXRob2QiLCJyZWYxIiwicmVmMiIsInNlY3Rpb24iLCJzZWxmIiwidHlwZSIsInR5cGVDb25maWciLCJfIiwiYXJndW1lbnRzIiwiX19zZWN0aW9uIiwiYm94IiwibWV0aG9kcyIsInNlY3Rpb25zIiwiZm4zIiwicmVmMyIsInJlZjQiLCJyZXN1bHRzIiwiX3RoaXMiLCJnZXRQcmVmaXgiLCJvcHRpb25zIiwiZGV0YWlsUGFydHMiLCJkZXRhaWxzIiwicHJlZml4IiwiX2dldENhbGxlckRldGFpbHMiLCJmaWxlIiwibGluZSIsImpvaW4iLCJnZXRTdGFjayIsImluZGV4IiwibGluZXMiLCJtYXRjaCIsInBhY2thZ2VNYXRjaCIsInN0YWNrIiwiZXJyIiwiRXJyb3IiLCJzcGxpdCIsImV4ZWMiLCJtYWtlQUJveCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImoiLCJsZW4iLCJsZW4yIiwic2VwYXJhdG9yIiwidG9wTGluZSIsImlzQXJyYXkiLCJNYXRoIiwibWF4IiwicyIsInBhZCIsImxycGFkIiwicnBhZCIsInN1YlByZWZpeCIsImlzU3RyaW5nIiwiY29uc29sZSIsInVuc2hpZnQiLCJTeXN0ZW1Mb2dnZXIiLCJzdGFydHVwIiwic3RyaW5nIiwiZGF0ZSIsIkxvZyIsImZvcm1hdCIsIkVKU09OIiwicGFyc2UiLCJ0aW1lIiwid3JpdGUiLCJwcm9jZXNzIiwic3Rkb3V0IiwiZW5jb2RpbmciLCJmZCIsInZpZXdMaW1pdCIsIkRhdGUiLCJpZCIsIlJhbmRvbSIsInRzIiwiTWV0ZW9yIiwic2V0dGluZ3MiLCJzaGlmdCIsInB1Ymxpc2giLCJ1c2VyIiwidXNlcklkIiwicmVhZHkiLCJkYiIsInVzZXJzIiwiZmluZE9uZSIsImZpZWxkcyIsImlzX2Nsb3VkYWRtaW4iLCJhZGRlZCIsIm9uIiwicmVmNSIsInJlZjYiLCJyZWY3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLGdCQUFKO0FBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDRixrQkFBZ0IsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILG9CQUFnQixHQUFDRyxDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBakQsRUFBMkYsQ0FBM0Y7O0FBQXJCO0FBQ0FDLE9BQU8sQ0FBQyxvQkFBRCxDQUFQOztBQUdB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LEdBQTRCLE1BQTVCLEdBQTRCLE1BQTVCO0FBQ0MsU0FBQTZDLE9BQUF5RSxPQUFBQyxRQUFBLGFBQUE5RCxPQUFBWixLQUFBbkMsTUFBQSxZQUFBK0MsS0FBNEJuRCxXQUE1QixHQUE0QixNQUE1QixHQUE0QixNQUE1QjtBQUNDTCxvQkFBY0ssV0FBZCxHQUE0QixJQUE1QjtBQ29IRTs7QURuSEgsU0FBQW9ELE9BQUE0RCxPQUFBQyxRQUFBLGFBQUFhLE9BQUExRSxLQUFBaEQsTUFBQSxZQUFBMEgsS0FBNEI3SCxlQUE1QixHQUE0QixNQUE1QixHQUE0QixNQUE1QjtBQUNDTixvQkFBY00sZUFBZCxHQUFnQyxJQUFoQztBQ3FIRTs7QURwSEgsU0FBQThILE9BQUFmLE9BQUFDLFFBQUEsYUFBQWUsT0FBQUQsS0FBQTNILE1BQUEsWUFBQTRILEtBQTRCOUgsUUFBNUIsR0FBNEIsTUFBNUIsR0FBNEIsTUFBNUI7QUFDQ1Asb0JBQWNPLFFBQWQsR0FBeUI4RyxPQUFPQyxRQUFQLENBQWdCN0csTUFBaEIsQ0FBdUJGLFFBQWhEO0FDc0hFOztBQUNELFdEckhGUCxjQUFjMEIsTUFBZCxDQUFxQixJQUFyQixDQ3FIRTtBQUNEO0FEL0hILEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfbG9nZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZml4IHdhcm5pbmc6IHh4eCBub3QgaW5zdGFsbGVkXHJcbnJlcXVpcmUoXCJjaGFsay9wYWNrYWdlLmpzb25cIik7XHJcblxyXG5pbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XHJcbmNoZWNrTnBtVmVyc2lvbnMoe1xyXG5cdCdjaGFsayc6ICcxLjEuMydcclxufSwgJ3N0ZWVkb3M6bG9nZ2VyJyk7IiwiY2hhbGsgPSByZXF1aXJlKFwiY2hhbGtcIilcclxuY2hhbGsuZW5hYmxlZCA9IHRydWU7XHJcblxyXG5ATG9nZ2VyTWFuYWdlciA9IG5ldyBjbGFzcyBleHRlbmRzIEV2ZW50RW1pdHRlclxyXG5cdGNvbnN0cnVjdG9yOiAtPlxyXG5cdFx0QGVuYWJsZWQgPSBmYWxzZVxyXG5cdFx0QGxvZ2dlcnMgPSB7fVxyXG5cdFx0QHF1ZXVlID0gW11cclxuXHJcblx0XHRAc2hvd1BhY2thZ2UgPSBmYWxzZVxyXG5cdFx0QHNob3dGaWxlQW5kTGluZSA9IGZhbHNlXHJcblx0XHRAbG9nTGV2ZWwgPSAwXHJcblxyXG5cdHJlZ2lzdGVyOiAobG9nZ2VyKSAtPlxyXG5cdFx0aWYgbm90IGxvZ2dlciBpbnN0YW5jZW9mIExvZ2dlclxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRAbG9nZ2Vyc1tsb2dnZXIubmFtZV0gPSBsb2dnZXJcclxuXHJcblx0XHRAZW1pdCAncmVnaXN0ZXInLCBsb2dnZXJcclxuXHJcblx0YWRkVG9RdWV1ZTogKGxvZ2dlciwgYXJncyktPlxyXG5cdFx0QHF1ZXVlLnB1c2hcclxuXHRcdFx0bG9nZ2VyOiBsb2dnZXJcclxuXHRcdFx0YXJnczogYXJnc1xyXG5cclxuXHRkaXNwYXRjaFF1ZXVlOiAtPlxyXG5cdFx0Zm9yIGl0ZW0gaW4gQHF1ZXVlXHJcblx0XHRcdGl0ZW0ubG9nZ2VyLl9sb2cuYXBwbHkgaXRlbS5sb2dnZXIsIGl0ZW0uYXJnc1xyXG5cclxuXHRcdEBjbGVhclF1ZXVlKClcclxuXHJcblx0Y2xlYXJRdWV1ZTogLT5cclxuXHRcdEBxdWV1ZSA9IFtdXHJcblxyXG5cdGRpc2FibGU6IC0+XHJcblx0XHRAZW5hYmxlZCA9IGZhbHNlXHJcblxyXG5cdGVuYWJsZTogKGRpc3BhdGNoUXVldWU9ZmFsc2UpIC0+XHJcblx0XHRAZW5hYmxlZCA9IHRydWVcclxuXHRcdGlmIGRpc3BhdGNoUXVldWUgaXMgdHJ1ZVxyXG5cdFx0XHRAZGlzcGF0Y2hRdWV1ZSgpXHJcblx0XHRlbHNlXHJcblx0XHRcdEBjbGVhclF1ZXVlKClcclxuXHJcblxyXG4jIEBMb2dnZXJNYW5hZ2VyLm9uICdyZWdpc3RlcicsIC0+XHJcbiMgXHRjb25zb2xlLmxvZygnb24gcmVnaXN0ZXInLCBhcmd1bWVudHMpXHJcblxyXG5cclxuQExvZ2dlciA9IGNsYXNzIExvZ2dlclxyXG5cdGRlZmF1bHRUeXBlczpcclxuXHRcdGRlYnVnOlxyXG5cdFx0XHRuYW1lOiAnZGVidWcnXHJcblx0XHRcdGNvbG9yOiAnYmx1ZSdcclxuXHRcdFx0bGV2ZWw6IDJcclxuXHRcdGxvZzpcclxuXHRcdFx0bmFtZTogJ2luZm8nXHJcblx0XHRcdGNvbG9yOiAnYmx1ZSdcclxuXHRcdFx0bGV2ZWw6IDFcclxuXHRcdGluZm86XHJcblx0XHRcdG5hbWU6ICdpbmZvJ1xyXG5cdFx0XHRjb2xvcjogJ2JsdWUnXHJcblx0XHRcdGxldmVsOiAxXHJcblx0XHRzdWNjZXNzOlxyXG5cdFx0XHRuYW1lOiAnaW5mbydcclxuXHRcdFx0Y29sb3I6ICdncmVlbidcclxuXHRcdFx0bGV2ZWw6IDFcclxuXHRcdHdhcm46XHJcblx0XHRcdG5hbWU6ICd3YXJuJ1xyXG5cdFx0XHRjb2xvcjogJ21hZ2VudGEnXHJcblx0XHRcdGxldmVsOiAxXHJcblx0XHRlcnJvcjpcclxuXHRcdFx0bmFtZTogJ2Vycm9yJ1xyXG5cdFx0XHRjb2xvcjogJ3JlZCdcclxuXHRcdFx0bGV2ZWw6IDBcclxuXHJcblx0Y29uc3RydWN0b3I6IChAbmFtZSwgY29uZmlnPXt9KSAtPlxyXG5cdFx0c2VsZiA9IEBcclxuXHRcdEBjb25maWcgPSB7fVxyXG5cclxuXHRcdF8uZXh0ZW5kIEBjb25maWcsIGNvbmZpZ1xyXG5cclxuXHRcdGlmIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV0/XHJcblx0XHRcdExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV0ud2FybiAnRHVwbGljYXRlZCBpbnN0YW5jZSdcclxuXHRcdFx0cmV0dXJuIExvZ2dlck1hbmFnZXIubG9nZ2Vyc1tAbmFtZV1cclxuXHJcblx0XHRmb3IgdHlwZSwgdHlwZUNvbmZpZyBvZiBAZGVmYXVsdFR5cGVzXHJcblx0XHRcdGRvICh0eXBlLCB0eXBlQ29uZmlnKSAtPlxyXG5cdFx0XHRcdHNlbGZbdHlwZV0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdFx0bGV2ZWw6IHR5cGVDb25maWcubGV2ZWxcclxuXHRcdFx0XHRcdFx0bWV0aG9kOiB0eXBlQ29uZmlnLm5hbWVcclxuXHRcdFx0XHRcdFx0YXJndW1lbnRzOiBhcmdzXHJcblxyXG5cdFx0XHRcdHNlbGZbdHlwZStcIl9ib3hcIl0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdHNlY3Rpb246IHRoaXMuX19zZWN0aW9uXHJcblx0XHRcdFx0XHRcdHR5cGU6IHR5cGVcclxuXHRcdFx0XHRcdFx0Ym94OiB0cnVlXHJcblx0XHRcdFx0XHRcdGxldmVsOiB0eXBlQ29uZmlnLmxldmVsXHJcblx0XHRcdFx0XHRcdG1ldGhvZDogdHlwZUNvbmZpZy5uYW1lXHJcblx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xyXG5cclxuXHRcdGlmIEBjb25maWcubWV0aG9kcz9cclxuXHRcdFx0Zm9yIG1ldGhvZCwgdHlwZUNvbmZpZyBvZiBAY29uZmlnLm1ldGhvZHNcclxuXHRcdFx0XHRkbyAobWV0aG9kLCB0eXBlQ29uZmlnKSAtPlxyXG5cdFx0XHRcdFx0aWYgc2VsZlttZXRob2RdP1xyXG5cdFx0XHRcdFx0XHRzZWxmLndhcm4gXCJNZXRob2RcIiwgbWV0aG9kLCBcImFscmVhZHkgZXhpc3RzXCJcclxuXHJcblx0XHRcdFx0XHRpZiBub3Qgc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT9cclxuXHRcdFx0XHRcdFx0c2VsZi53YXJuIFwiTWV0aG9kIHR5cGVcIiwgdHlwZUNvbmZpZy50eXBlLCBcImRvZXMgbm90IGV4aXN0XCJcclxuXHJcblx0XHRcdFx0XHRzZWxmW21ldGhvZF0gPSAoYXJncy4uLikgLT5cclxuXHRcdFx0XHRcdFx0c2VsZi5fbG9nLmNhbGwgc2VsZixcclxuXHRcdFx0XHRcdFx0XHRzZWN0aW9uOiB0aGlzLl9fc2VjdGlvblxyXG5cdFx0XHRcdFx0XHRcdHR5cGU6IHR5cGVDb25maWcudHlwZVxyXG5cdFx0XHRcdFx0XHRcdGxldmVsOiBpZiB0eXBlQ29uZmlnLmxldmVsPyB0aGVuIHR5cGVDb25maWcubGV2ZWwgZWxzZSBzZWxmLmRlZmF1bHRUeXBlc1t0eXBlQ29uZmlnLnR5cGVdPy5sZXZlbFxyXG5cdFx0XHRcdFx0XHRcdG1ldGhvZDogbWV0aG9kXHJcblx0XHRcdFx0XHRcdFx0YXJndW1lbnRzOiBhcmdzXHJcblxyXG5cdFx0XHRcdFx0c2VsZlttZXRob2QrXCJfYm94XCJdID0gKGFyZ3MuLi4pIC0+XHJcblx0XHRcdFx0XHRcdHNlbGYuX2xvZy5jYWxsIHNlbGYsXHJcblx0XHRcdFx0XHRcdFx0c2VjdGlvbjogdGhpcy5fX3NlY3Rpb25cclxuXHRcdFx0XHRcdFx0XHR0eXBlOiB0eXBlQ29uZmlnLnR5cGVcclxuXHRcdFx0XHRcdFx0XHRib3g6IHRydWVcclxuXHRcdFx0XHRcdFx0XHRsZXZlbDogaWYgdHlwZUNvbmZpZy5sZXZlbD8gdGhlbiB0eXBlQ29uZmlnLmxldmVsIGVsc2Ugc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXT8ubGV2ZWxcclxuXHRcdFx0XHRcdFx0XHRtZXRob2Q6IG1ldGhvZFxyXG5cdFx0XHRcdFx0XHRcdGFyZ3VtZW50czogYXJnc1xyXG5cclxuXHRcdGlmIEBjb25maWcuc2VjdGlvbnM/XHJcblx0XHRcdGZvciBzZWN0aW9uLCBuYW1lIG9mIEBjb25maWcuc2VjdGlvbnNcclxuXHRcdFx0XHRkbyAoc2VjdGlvbiwgbmFtZSkgLT5cclxuXHRcdFx0XHRcdHNlbGZbc2VjdGlvbl0gPSB7fVxyXG5cdFx0XHRcdFx0Zm9yIHR5cGUsIHR5cGVDb25maWcgb2Ygc2VsZi5kZWZhdWx0VHlwZXNcclxuXHRcdFx0XHRcdFx0ZG8gKHR5cGUsIHR5cGVDb25maWcpID0+XHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVt0eXBlXSA9ID0+XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGVdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVt0eXBlK1wiX2JveFwiXSA9ID0+XHJcblx0XHRcdFx0XHRcdFx0XHRzZWxmW3R5cGUrXCJfYm94XCJdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRmb3IgbWV0aG9kLCB0eXBlQ29uZmlnIG9mIHNlbGYuY29uZmlnLm1ldGhvZHNcclxuXHRcdFx0XHRcdFx0ZG8gKG1ldGhvZCwgdHlwZUNvbmZpZykgPT5cclxuXHRcdFx0XHRcdFx0XHRzZWxmW3NlY3Rpb25dW21ldGhvZF0gPSA9PlxyXG5cdFx0XHRcdFx0XHRcdFx0c2VsZlttZXRob2RdLmFwcGx5IHtfX3NlY3Rpb246IG5hbWV9LCBhcmd1bWVudHNcclxuXHJcblx0XHRcdFx0XHRcdFx0c2VsZltzZWN0aW9uXVttZXRob2QrXCJfYm94XCJdID0gPT5cclxuXHRcdFx0XHRcdFx0XHRcdHNlbGZbbWV0aG9kK1wiX2JveFwiXS5hcHBseSB7X19zZWN0aW9uOiBuYW1lfSwgYXJndW1lbnRzXHJcblxyXG5cdFx0TG9nZ2VyTWFuYWdlci5yZWdpc3RlciBAXHJcblx0XHRyZXR1cm4gQFxyXG5cclxuXHRnZXRQcmVmaXg6IChvcHRpb25zKSAtPlxyXG5cdFx0aWYgb3B0aW9ucy5zZWN0aW9uP1xyXG5cdFx0XHRwcmVmaXggPSBcIiN7QG5hbWV9IOKelCAje29wdGlvbnMuc2VjdGlvbn0uI3tvcHRpb25zLm1ldGhvZH1cIlxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRwcmVmaXggPSBcIiN7QG5hbWV9IOKelCAje29wdGlvbnMubWV0aG9kfVwiXHJcblxyXG5cdFx0ZGV0YWlscyA9IEBfZ2V0Q2FsbGVyRGV0YWlscygpXHJcblxyXG5cdFx0ZGV0YWlsUGFydHMgPSBbXVxyXG5cdFx0aWYgZGV0YWlscy5wYWNrYWdlPyBhbmQgKExvZ2dlck1hbmFnZXIuc2hvd1BhY2thZ2UgaXMgdHJ1ZSBvciBvcHRpb25zLnR5cGUgaXMgJ2Vycm9yJylcclxuXHRcdFx0ZGV0YWlsUGFydHMucHVzaCBkZXRhaWxzLnBhY2thZ2VcclxuXHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLnNob3dGaWxlQW5kTGluZSBpcyB0cnVlIG9yIG9wdGlvbnMudHlwZSBpcyAnZXJyb3InXHJcblx0XHRcdGlmIGRldGFpbHMuZmlsZT8gYW5kIGRldGFpbHMubGluZT9cclxuXHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIFwiI3tkZXRhaWxzLmZpbGV9OiN7ZGV0YWlscy5saW5lfVwiXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0XHRpZiBkZXRhaWxzLmZpbGU/XHJcblx0XHRcdFx0XHRkZXRhaWxQYXJ0cy5wdXNoIGRldGFpbHMuZmlsZVxyXG5cdFx0XHRcdGlmIGRldGFpbHMubGluZT9cclxuXHRcdFx0XHRcdGRldGFpbFBhcnRzLnB1c2ggZGV0YWlscy5saW5lXHJcblxyXG5cdFx0aWYgQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdP1xyXG4jXHRcdFx0cHJlZml4ID0gcHJlZml4W0BkZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcl0g55Sx5LqOY29sb3JzIOWMheeahOmXrumimO+8jOacjeWKoeerr+aaguaXtuS4jeaUr+aMgWxvZyBjb2xvciDmmL7npLpcclxuXHRcdFx0cHJlZml4ID0gY2hhbGtbQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXShwcmVmaXgpXHJcblxyXG5cdFx0aWYgZGV0YWlsUGFydHMubGVuZ3RoID4gMFxyXG5cdFx0XHRwcmVmaXggPSBcIiN7ZGV0YWlsUGFydHMuam9pbignICcpfSAje3ByZWZpeH1cIlxyXG5cclxuXHRcdHJldHVybiBwcmVmaXhcclxuXHJcblx0IyBAcmV0dXJucyB7T2JqZWN0OiB7IGxpbmU6IE51bWJlciwgZmlsZTogU3RyaW5nIH19XHJcblx0X2dldENhbGxlckRldGFpbHM6IC0+XHJcblx0XHRnZXRTdGFjayA9ICgpIC0+XHJcblx0XHRcdCMgV2UgZG8gTk9UIHVzZSBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSBoZXJlIChhIFY4IGV4dGVuc2lvbiB0aGF0IGdldHMgdXMgYVxyXG5cdFx0XHQjIHByZS1wYXJzZWQgc3RhY2spIHNpbmNlIGl0J3MgaW1wb3NzaWJsZSB0byBjb21wb3NlIGl0IHdpdGggdGhlIHVzZSBvZlxyXG5cdFx0XHQjIEVycm9yLnByZXBhcmVTdGFja1RyYWNlIHVzZWQgb24gdGhlIHNlcnZlciBmb3Igc291cmNlIG1hcHMuXHJcblx0XHRcdGVyciA9IG5ldyBFcnJvclxyXG5cdFx0XHRzdGFjayA9IGVyci5zdGFja1xyXG5cdFx0XHRyZXR1cm4gc3RhY2tcclxuXHJcblx0XHRzdGFjayA9IGdldFN0YWNrKClcclxuXHJcblx0XHRpZiBub3Qgc3RhY2tcclxuXHRcdFx0cmV0dXJuIHt9XHJcblxyXG5cdFx0bGluZXMgPSBzdGFjay5zcGxpdCgnXFxuJylcclxuXHJcblx0XHQjIGxvb2tpbmcgZm9yIHRoZSBmaXJzdCBsaW5lIG91dHNpZGUgdGhlIGxvZ2dpbmcgcGFja2FnZSAob3IgYW5cclxuXHRcdCMgZXZhbCBpZiB3ZSBmaW5kIHRoYXQgZmlyc3QpXHJcblx0XHRsaW5lID0gdW5kZWZpbmVkXHJcblx0XHRmb3IgaXRlbSwgaW5kZXggaW4gbGluZXMgd2hlbiBpbmRleCA+IDBcclxuXHRcdFx0bGluZSA9IGl0ZW1cclxuXHRcdFx0aWYgbGluZS5tYXRjaCgvXlxccyphdCBldmFsIFxcKGV2YWwvKVxyXG5cdFx0XHRcdHJldHVybiB7ZmlsZTogXCJldmFsXCJ9XHJcblxyXG5cdFx0XHRpZiBub3QgbGluZS5tYXRjaCgvcGFja2FnZXNcXC9yb2NrZXRjaGF0X2xvZ2dlcig/OlxcL3xcXC5qcykvKVxyXG5cdFx0XHRcdGJyZWFrXHJcblxyXG5cdFx0ZGV0YWlscyA9IHt9XHJcblxyXG5cdFx0IyBUaGUgZm9ybWF0IGZvciBGRiBpcyAnZnVuY3Rpb25OYW1lQGZpbGVQYXRoOmxpbmVOdW1iZXInXHJcblx0XHQjIFRoZSBmb3JtYXQgZm9yIFY4IGlzICdmdW5jdGlvbk5hbWUgKHBhY2thZ2VzL2xvZ2dpbmcvbG9nZ2luZy5qczo4MSknIG9yXHJcblx0XHQjICAgICAgICAgICAgICAgICAgICAgICdwYWNrYWdlcy9sb2dnaW5nL2xvZ2dpbmcuanM6ODEnXHJcblx0XHRtYXRjaCA9IC8oPzpbQChdfCBhdCApKFteKF0rPyk6KFswLTk6XSspKD86XFwpfCQpLy5leGVjKGxpbmUpXHJcblx0XHRpZiBub3QgbWF0Y2hcclxuXHRcdFx0cmV0dXJuIGRldGFpbHNcclxuXHRcdCMgaW4gY2FzZSB0aGUgbWF0Y2hlZCBibG9jayBoZXJlIGlzIGxpbmU6Y29sdW1uXHJcblx0XHRkZXRhaWxzLmxpbmUgPSBtYXRjaFsyXS5zcGxpdCgnOicpWzBdXHJcblxyXG5cdFx0IyBQb3NzaWJsZSBmb3JtYXQ6IGh0dHBzOi8vZm9vLmJhci5jb20vc2NyaXB0cy9maWxlLmpzP3JhbmRvbT1mb29iYXJcclxuXHRcdCMgWFhYOiBpZiB5b3UgY2FuIHdyaXRlIHRoZSBmb2xsb3dpbmcgaW4gYmV0dGVyIHdheSwgcGxlYXNlIGRvIGl0XHJcblx0XHQjIFhYWDogd2hhdCBhYm91dCBldmFscz9cclxuXHRcdGRldGFpbHMuZmlsZSA9IG1hdGNoWzFdLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdLnNwbGl0KCc/JylbMF1cclxuXHJcblx0XHRwYWNrYWdlTWF0Y2ggPSBtYXRjaFsxXS5tYXRjaCgvcGFja2FnZXNcXC8oW15cXC5cXC9dKykoPzpcXC98XFwuKS8pXHJcblx0XHRpZiBwYWNrYWdlTWF0Y2g/XHJcblx0XHRcdGRldGFpbHMucGFja2FnZSA9IHBhY2thZ2VNYXRjaFsxXVxyXG5cclxuXHRcdHJldHVybiBkZXRhaWxzXHJcblxyXG5cdG1ha2VBQm94OiAobWVzc2FnZSwgdGl0bGUpIC0+XHJcblx0XHRpZiBub3QgXy5pc0FycmF5KG1lc3NhZ2UpXHJcblx0XHRcdG1lc3NhZ2UgPSBtZXNzYWdlLnNwbGl0KFwiXFxuXCIpXHJcblxyXG5cdFx0bGVuID0gMFxyXG5cdFx0Zm9yIGxpbmUgaW4gbWVzc2FnZVxyXG5cdFx0XHRsZW4gPSBNYXRoLm1heChsZW4sIGxpbmUubGVuZ3RoKVxyXG5cclxuXHRcdHRvcExpbmUgPSBcIistLVwiICsgcy5wYWQoJycsIGxlbiwgJy0nKSArIFwiLS0rXCJcclxuXHRcdHNlcGFyYXRvciA9IFwifCAgXCIgKyBzLnBhZCgnJywgbGVuLCAnJykgKyBcIiAgfFwiXHJcblx0XHRsaW5lcyA9IFtdXHJcblxyXG5cdFx0bGluZXMucHVzaCB0b3BMaW5lXHJcblx0XHRpZiB0aXRsZT9cclxuXHRcdFx0bGluZXMucHVzaCBcInwgIFwiICsgcy5scnBhZCh0aXRsZSwgbGVuKSArIFwiICB8XCJcclxuXHRcdFx0bGluZXMucHVzaCB0b3BMaW5lXHJcblxyXG5cdFx0bGluZXMucHVzaCBzZXBhcmF0b3JcclxuXHJcblx0XHRmb3IgbGluZSBpbiBtZXNzYWdlXHJcblx0XHRcdGxpbmVzLnB1c2ggXCJ8ICBcIiArIHMucnBhZChsaW5lLCBsZW4pICsgXCIgIHxcIlxyXG5cclxuXHRcdGxpbmVzLnB1c2ggc2VwYXJhdG9yXHJcblx0XHRsaW5lcy5wdXNoIHRvcExpbmVcclxuXHRcdHJldHVybiBsaW5lc1xyXG5cclxuXHJcblx0X2xvZzogKG9wdGlvbnMpIC0+XHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLmVuYWJsZWQgaXMgZmFsc2VcclxuXHRcdFx0TG9nZ2VyTWFuYWdlci5hZGRUb1F1ZXVlIEAsIGFyZ3VtZW50c1xyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRvcHRpb25zLmxldmVsID89IDFcclxuXHJcblx0XHRpZiBMb2dnZXJNYW5hZ2VyLmxvZ0xldmVsIDwgb3B0aW9ucy5sZXZlbFxyXG5cdFx0XHRyZXR1cm5cclxuXHJcblx0XHRwcmVmaXggPSBAZ2V0UHJlZml4KG9wdGlvbnMpXHJcblxyXG5cdFx0aWYgb3B0aW9ucy5ib3ggaXMgdHJ1ZSBhbmQgXy5pc1N0cmluZyhvcHRpb25zLmFyZ3VtZW50c1swXSlcclxuXHRcdFx0Y29sb3IgPSB1bmRlZmluZWRcclxuXHRcdFx0aWYgQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdP1xyXG5cdFx0XHRcdGNvbG9yID0gQGRlZmF1bHRUeXBlc1tvcHRpb25zLnR5cGVdLmNvbG9yXHJcblxyXG5cdFx0XHRib3ggPSBAbWFrZUFCb3ggb3B0aW9ucy5hcmd1bWVudHNbMF0sIG9wdGlvbnMuYXJndW1lbnRzWzFdXHJcblx0XHRcdHN1YlByZWZpeCA9ICfinpQnXHJcblx0XHRcdGlmIGNvbG9yP1xyXG5cdFx0XHRcdHN1YlByZWZpeCA9IHN1YlByZWZpeFtjb2xvcl1cclxuXHJcblx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgcHJlZml4XHJcblx0XHRcdGZvciBsaW5lIGluIGJveFxyXG5cdFx0XHRcdGlmIGNvbG9yP1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2cgc3ViUHJlZml4LCBsaW5lW2NvbG9yXVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nIHN1YlByZWZpeCwgbGluZVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRvcHRpb25zLmFyZ3VtZW50cy51bnNoaWZ0IHByZWZpeFxyXG5cdFx0XHRjb25zb2xlLmxvZy5hcHBseSBjb25zb2xlLCBvcHRpb25zLmFyZ3VtZW50c1xyXG5cclxuXHRcdHJldHVyblxyXG5cclxuXHJcbkBTeXN0ZW1Mb2dnZXIgPSBuZXcgTG9nZ2VyICdTeXN0ZW0nLFxyXG5cdG1ldGhvZHM6XHJcblx0XHRzdGFydHVwOlxyXG5cdFx0XHR0eXBlOiAnc3VjY2VzcydcclxuXHRcdFx0bGV2ZWw6IDBcclxuXHJcbnByb2Nlc3NTdHJpbmcgPSAoc3RyaW5nLCBkYXRlKSAtPlxyXG5cdGlmIHN0cmluZ1swXSBpcyAneydcclxuXHRcdHRyeVxyXG5cdFx0XHRyZXR1cm4gTG9nLmZvcm1hdCBFSlNPTi5wYXJzZShzdHJpbmcpLCB7Y29sb3I6IHRydWV9XHJcblxyXG5cdHRyeVxyXG5cdFx0cmV0dXJuIExvZy5mb3JtYXQge21lc3NhZ2U6IHN0cmluZywgdGltZTogZGF0ZSwgbGV2ZWw6ICdpbmZvJ30sIHtjb2xvcjogdHJ1ZX1cclxuXHJcblx0cmV0dXJuIHN0cmluZ1xyXG5cclxuU3RkT3V0ID0gbmV3IGNsYXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyXHJcblx0Y29uc3RydWN0b3I6IC0+XHJcblx0XHRAcXVldWUgPSBbXVxyXG5cdFx0d3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZVxyXG5cdFx0cHJvY2Vzcy5zdGRvdXQud3JpdGUgPSAoc3RyaW5nLCBlbmNvZGluZywgZmQpID0+XHJcblx0XHRcdHdyaXRlLmFwcGx5KHByb2Nlc3Muc3Rkb3V0LCBhcmd1bWVudHMpXHJcblx0XHRcdGRhdGUgPSBuZXcgRGF0ZVxyXG5cdFx0XHRzdHJpbmcgPSBwcm9jZXNzU3RyaW5nIHN0cmluZywgZGF0ZVxyXG5cclxuXHRcdFx0aXRlbSA9XHJcblx0XHRcdFx0aWQ6IFJhbmRvbS5pZCgpXHJcblx0XHRcdFx0c3RyaW5nOiBzdHJpbmdcclxuXHRcdFx0XHR0czogZGF0ZVxyXG5cclxuXHRcdFx0QHF1ZXVlLnB1c2ggaXRlbVxyXG5cclxuXHRcdFx0IyBpZiBSb2NrZXRDaGF0Py5zZXR0aW5ncz8uZ2V0KCdMb2dfVmlld19MaW1pdCcpPyBhbmQgQHF1ZXVlLmxlbmd0aCA+IFJvY2tldENoYXQuc2V0dGluZ3MuZ2V0KCdMb2dfVmlld19MaW1pdCcpXHJcblx0XHRcdCMgXHRAcXVldWUuc2hpZnQoKVxyXG5cclxuXHRcdFx0dmlld0xpbWl0ID0gTWV0ZW9yLnNldHRpbmdzPy5sb2dnZXI/LnZpZXdMaW1pdFxyXG5cdFx0XHR1bmxlc3Mgdmlld0xpbWl0XHJcblx0XHRcdFx0dmlld0xpbWl0ID0gMTAwMFxyXG5cdFx0XHRpZiBAcXVldWUubGVuZ3RoID4gdmlld0xpbWl0XHJcblx0XHRcdFx0QHF1ZXVlLnNoaWZ0KClcclxuXHJcblx0XHRcdEBlbWl0ICd3cml0ZScsIHN0cmluZywgaXRlbVxyXG5cclxuXHJcbk1ldGVvci5wdWJsaXNoICdzdGRvdXQnLCAtPlxyXG5cdHVubGVzcyBAdXNlcklkXHJcblx0XHRyZXR1cm4gQHJlYWR5KClcclxuXHJcblx0IyBpZiBSb2NrZXRDaGF0LmF1dGh6Lmhhc1Blcm1pc3Npb24oQHVzZXJJZCwgJ3ZpZXctbG9ncycpIGlzbnQgdHJ1ZVxyXG5cdCMgXHRyZXR1cm4gQHJlYWR5KClcclxuXHJcblx0dW5sZXNzIEB1c2VySWRcclxuXHRcdHJldHVybiBAcmVhZHkoKVxyXG5cdFxyXG5cdHVzZXIgPSBkYi51c2Vycy5maW5kT25lKEB1c2VySWQsIHtmaWVsZHM6IHtpc19jbG91ZGFkbWluOiAxfX0pXHJcblxyXG5cdHVubGVzcyB1c2VyXHJcblx0XHRyZXR1cm4gQHJlYWR5KClcclxuXHJcblx0Zm9yIGl0ZW0gaW4gU3RkT3V0LnF1ZXVlXHJcblx0XHRAYWRkZWQgJ3N0ZG91dCcsIGl0ZW0uaWQsXHJcblx0XHRcdHN0cmluZzogaXRlbS5zdHJpbmdcclxuXHRcdFx0dHM6IGl0ZW0udHNcclxuXHJcblx0QHJlYWR5KClcclxuXHJcblx0U3RkT3V0Lm9uICd3cml0ZScsIChzdHJpbmcsIGl0ZW0pID0+XHJcblx0XHRAYWRkZWQgJ3N0ZG91dCcsIGl0ZW0uaWQsXHJcblx0XHRcdHN0cmluZzogaXRlbS5zdHJpbmdcclxuXHRcdFx0dHM6IGl0ZW0udHNcclxuXHJcblx0cmV0dXJuXHJcblxyXG5NZXRlb3Iuc3RhcnR1cCAtPlxyXG5cdGlmIE1ldGVvci5zZXR0aW5ncz8ubG9nZ2VyPy5lbmFibGVkXHJcblx0XHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8uc2hvd1BhY2thZ2VcclxuXHRcdFx0TG9nZ2VyTWFuYWdlci5zaG93UGFja2FnZSA9IHRydWU7XHJcblx0XHRpZiBNZXRlb3Iuc2V0dGluZ3M/LmxvZ2dlcj8uc2hvd0ZpbGVBbmRMaW5lXHJcblx0XHRcdExvZ2dlck1hbmFnZXIuc2hvd0ZpbGVBbmRMaW5lID0gdHJ1ZTtcclxuXHRcdGlmIE1ldGVvci5zZXR0aW5ncz8ubG9nZ2VyPy5sb2dMZXZlbFxyXG5cdFx0XHRMb2dnZXJNYW5hZ2VyLmxvZ0xldmVsID0gTWV0ZW9yLnNldHRpbmdzLmxvZ2dlci5sb2dMZXZlbDtcclxuXHJcblx0XHRMb2dnZXJNYW5hZ2VyLmVuYWJsZSh0cnVlKTtcclxuXHJcbiIsInZhciBTdGRPdXQsIGNoYWxrLCBwcm9jZXNzU3RyaW5nLCAgICAgICAgXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5LFxuICBzbGljZSA9IFtdLnNsaWNlO1xuXG5jaGFsayA9IHJlcXVpcmUoXCJjaGFsa1wiKTtcblxuY2hhbGsuZW5hYmxlZCA9IHRydWU7XG5cbnRoaXMuTG9nZ2VyTWFuYWdlciA9IG5ldyAoKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKF9DbGFzcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gX0NsYXNzKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VycyA9IHt9O1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLnNob3dQYWNrYWdlID0gZmFsc2U7XG4gICAgdGhpcy5zaG93RmlsZUFuZExpbmUgPSBmYWxzZTtcbiAgICB0aGlzLmxvZ0xldmVsID0gMDtcbiAgfVxuXG4gIF9DbGFzcy5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbihsb2dnZXIpIHtcbiAgICBpZiAoIWxvZ2dlciBpbnN0YW5jZW9mIExvZ2dlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxvZ2dlcnNbbG9nZ2VyLm5hbWVdID0gbG9nZ2VyO1xuICAgIHJldHVybiB0aGlzLmVtaXQoJ3JlZ2lzdGVyJywgbG9nZ2VyKTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmFkZFRvUXVldWUgPSBmdW5jdGlvbihsb2dnZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5wdXNoKHtcbiAgICAgIGxvZ2dlcjogbG9nZ2VyLFxuICAgICAgYXJnczogYXJnc1xuICAgIH0pO1xuICB9O1xuXG4gIF9DbGFzcy5wcm90b3R5cGUuZGlzcGF0Y2hRdWV1ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBpdGVtLCBsZW4xLCByZWY7XG4gICAgcmVmID0gdGhpcy5xdWV1ZTtcbiAgICBmb3IgKGkgPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgaXRlbSA9IHJlZltpXTtcbiAgICAgIGl0ZW0ubG9nZ2VyLl9sb2cuYXBwbHkoaXRlbS5sb2dnZXIsIGl0ZW0uYXJncyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNsZWFyUXVldWUoKTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmNsZWFyUXVldWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZSA9IFtdO1xuICB9O1xuXG4gIF9DbGFzcy5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgfTtcblxuICBfQ2xhc3MucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKGRpc3BhdGNoUXVldWUpIHtcbiAgICBpZiAoZGlzcGF0Y2hRdWV1ZSA9PSBudWxsKSB7XG4gICAgICBkaXNwYXRjaFF1ZXVlID0gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgaWYgKGRpc3BhdGNoUXVldWUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmRpc3BhdGNoUXVldWUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuY2xlYXJRdWV1ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gX0NsYXNzO1xuXG59KShFdmVudEVtaXR0ZXIpKTtcblxudGhpcy5Mb2dnZXIgPSBMb2dnZXIgPSAoZnVuY3Rpb24oKSB7XG4gIExvZ2dlci5wcm90b3R5cGUuZGVmYXVsdFR5cGVzID0ge1xuICAgIGRlYnVnOiB7XG4gICAgICBuYW1lOiAnZGVidWcnLFxuICAgICAgY29sb3I6ICdibHVlJyxcbiAgICAgIGxldmVsOiAyXG4gICAgfSxcbiAgICBsb2c6IHtcbiAgICAgIG5hbWU6ICdpbmZvJyxcbiAgICAgIGNvbG9yOiAnYmx1ZScsXG4gICAgICBsZXZlbDogMVxuICAgIH0sXG4gICAgaW5mbzoge1xuICAgICAgbmFtZTogJ2luZm8nLFxuICAgICAgY29sb3I6ICdibHVlJyxcbiAgICAgIGxldmVsOiAxXG4gICAgfSxcbiAgICBzdWNjZXNzOiB7XG4gICAgICBuYW1lOiAnaW5mbycsXG4gICAgICBjb2xvcjogJ2dyZWVuJyxcbiAgICAgIGxldmVsOiAxXG4gICAgfSxcbiAgICB3YXJuOiB7XG4gICAgICBuYW1lOiAnd2FybicsXG4gICAgICBjb2xvcjogJ21hZ2VudGEnLFxuICAgICAgbGV2ZWw6IDFcbiAgICB9LFxuICAgIGVycm9yOiB7XG4gICAgICBuYW1lOiAnZXJyb3InLFxuICAgICAgY29sb3I6ICdyZWQnLFxuICAgICAgbGV2ZWw6IDBcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gTG9nZ2VyKG5hbWUxLCBjb25maWcpIHtcbiAgICB2YXIgZm4sIGZuMSwgZm4yLCBtZXRob2QsIG5hbWUsIHJlZiwgcmVmMSwgcmVmMiwgc2VjdGlvbiwgc2VsZiwgdHlwZSwgdHlwZUNvbmZpZztcbiAgICB0aGlzLm5hbWUgPSBuYW1lMTtcbiAgICBpZiAoY29uZmlnID09IG51bGwpIHtcbiAgICAgIGNvbmZpZyA9IHt9O1xuICAgIH1cbiAgICBzZWxmID0gdGhpcztcbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIF8uZXh0ZW5kKHRoaXMuY29uZmlnLCBjb25maWcpO1xuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmxvZ2dlcnNbdGhpcy5uYW1lXSAhPSBudWxsKSB7XG4gICAgICBMb2dnZXJNYW5hZ2VyLmxvZ2dlcnNbdGhpcy5uYW1lXS53YXJuKCdEdXBsaWNhdGVkIGluc3RhbmNlJyk7XG4gICAgICByZXR1cm4gTG9nZ2VyTWFuYWdlci5sb2dnZXJzW3RoaXMubmFtZV07XG4gICAgfVxuICAgIHJlZiA9IHRoaXMuZGVmYXVsdFR5cGVzO1xuICAgIGZuID0gZnVuY3Rpb24odHlwZSwgdHlwZUNvbmZpZykge1xuICAgICAgc2VsZlt0eXBlXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYXJncztcbiAgICAgICAgYXJncyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9nLmNhbGwoc2VsZiwge1xuICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwsXG4gICAgICAgICAgbWV0aG9kOiB0eXBlQ29uZmlnLm5hbWUsXG4gICAgICAgICAgXCJhcmd1bWVudHNcIjogYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gc2VsZlt0eXBlICsgXCJfYm94XCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhcmdzO1xuICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgIHJldHVybiBzZWxmLl9sb2cuY2FsbChzZWxmLCB7XG4gICAgICAgICAgc2VjdGlvbjogdGhpcy5fX3NlY3Rpb24sXG4gICAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgICBib3g6IHRydWUsXG4gICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwsXG4gICAgICAgICAgbWV0aG9kOiB0eXBlQ29uZmlnLm5hbWUsXG4gICAgICAgICAgXCJhcmd1bWVudHNcIjogYXJnc1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBmb3IgKHR5cGUgaW4gcmVmKSB7XG4gICAgICB0eXBlQ29uZmlnID0gcmVmW3R5cGVdO1xuICAgICAgZm4odHlwZSwgdHlwZUNvbmZpZyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbmZpZy5tZXRob2RzICE9IG51bGwpIHtcbiAgICAgIHJlZjEgPSB0aGlzLmNvbmZpZy5tZXRob2RzO1xuICAgICAgZm4xID0gZnVuY3Rpb24obWV0aG9kLCB0eXBlQ29uZmlnKSB7XG4gICAgICAgIGlmIChzZWxmW21ldGhvZF0gIT0gbnVsbCkge1xuICAgICAgICAgIHNlbGYud2FybihcIk1ldGhvZFwiLCBtZXRob2QsIFwiYWxyZWFkeSBleGlzdHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0gPT0gbnVsbCkge1xuICAgICAgICAgIHNlbGYud2FybihcIk1ldGhvZCB0eXBlXCIsIHR5cGVDb25maWcudHlwZSwgXCJkb2VzIG5vdCBleGlzdFwiKTtcbiAgICAgICAgfVxuICAgICAgICBzZWxmW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgYXJncywgcmVmMjtcbiAgICAgICAgICBhcmdzID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgcmV0dXJuIHNlbGYuX2xvZy5jYWxsKHNlbGYsIHtcbiAgICAgICAgICAgIHNlY3Rpb246IHRoaXMuX19zZWN0aW9uLFxuICAgICAgICAgICAgdHlwZTogdHlwZUNvbmZpZy50eXBlLFxuICAgICAgICAgICAgbGV2ZWw6IHR5cGVDb25maWcubGV2ZWwgIT0gbnVsbCA/IHR5cGVDb25maWcubGV2ZWwgOiAocmVmMiA9IHNlbGYuZGVmYXVsdFR5cGVzW3R5cGVDb25maWcudHlwZV0pICE9IG51bGwgPyByZWYyLmxldmVsIDogdm9pZCAwLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICAgICAgICBcImFyZ3VtZW50c1wiOiBhcmdzXG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzZWxmW21ldGhvZCArIFwiX2JveFwiXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBhcmdzLCByZWYyO1xuICAgICAgICAgIGFyZ3MgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICByZXR1cm4gc2VsZi5fbG9nLmNhbGwoc2VsZiwge1xuICAgICAgICAgICAgc2VjdGlvbjogdGhpcy5fX3NlY3Rpb24sXG4gICAgICAgICAgICB0eXBlOiB0eXBlQ29uZmlnLnR5cGUsXG4gICAgICAgICAgICBib3g6IHRydWUsXG4gICAgICAgICAgICBsZXZlbDogdHlwZUNvbmZpZy5sZXZlbCAhPSBudWxsID8gdHlwZUNvbmZpZy5sZXZlbCA6IChyZWYyID0gc2VsZi5kZWZhdWx0VHlwZXNbdHlwZUNvbmZpZy50eXBlXSkgIT0gbnVsbCA/IHJlZjIubGV2ZWwgOiB2b2lkIDAsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgICAgIFwiYXJndW1lbnRzXCI6IGFyZ3NcbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBmb3IgKG1ldGhvZCBpbiByZWYxKSB7XG4gICAgICAgIHR5cGVDb25maWcgPSByZWYxW21ldGhvZF07XG4gICAgICAgIGZuMShtZXRob2QsIHR5cGVDb25maWcpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5jb25maWcuc2VjdGlvbnMgIT0gbnVsbCkge1xuICAgICAgcmVmMiA9IHRoaXMuY29uZmlnLnNlY3Rpb25zO1xuICAgICAgZm4yID0gZnVuY3Rpb24oc2VjdGlvbiwgbmFtZSkge1xuICAgICAgICB2YXIgZm4zLCByZWYzLCByZWY0LCByZXN1bHRzO1xuICAgICAgICBzZWxmW3NlY3Rpb25dID0ge307XG4gICAgICAgIHJlZjMgPSBzZWxmLmRlZmF1bHRUeXBlcztcbiAgICAgICAgZm4zID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHR5cGUsIHR5cGVDb25maWcpIHtcbiAgICAgICAgICAgIHNlbGZbc2VjdGlvbl1bdHlwZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbdHlwZV0uYXBwbHkoe1xuICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICB9LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBzZWxmW3NlY3Rpb25dW3R5cGUgKyBcIl9ib3hcIl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbdHlwZSArIFwiX2JveFwiXS5hcHBseSh7XG4gICAgICAgICAgICAgICAgX19zZWN0aW9uOiBuYW1lXG4gICAgICAgICAgICAgIH0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpO1xuICAgICAgICBmb3IgKHR5cGUgaW4gcmVmMykge1xuICAgICAgICAgIHR5cGVDb25maWcgPSByZWYzW3R5cGVdO1xuICAgICAgICAgIGZuMyh0eXBlLCB0eXBlQ29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICByZWY0ID0gc2VsZi5jb25maWcubWV0aG9kcztcbiAgICAgICAgcmVzdWx0cyA9IFtdO1xuICAgICAgICBmb3IgKG1ldGhvZCBpbiByZWY0KSB7XG4gICAgICAgICAgdHlwZUNvbmZpZyA9IHJlZjRbbWV0aG9kXTtcbiAgICAgICAgICByZXN1bHRzLnB1c2goKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24obWV0aG9kLCB0eXBlQ29uZmlnKSB7XG4gICAgICAgICAgICAgIHNlbGZbc2VjdGlvbl1bbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmW21ldGhvZF0uYXBwbHkoe1xuICAgICAgICAgICAgICAgICAgX19zZWN0aW9uOiBuYW1lXG4gICAgICAgICAgICAgICAgfSwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbc2VjdGlvbl1bbWV0aG9kICsgXCJfYm94XCJdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGZbbWV0aG9kICsgXCJfYm94XCJdLmFwcGx5KHtcbiAgICAgICAgICAgICAgICAgIF9fc2VjdGlvbjogbmFtZVxuICAgICAgICAgICAgICAgIH0sIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pKHRoaXMpKG1ldGhvZCwgdHlwZUNvbmZpZykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHRzO1xuICAgICAgfTtcbiAgICAgIGZvciAoc2VjdGlvbiBpbiByZWYyKSB7XG4gICAgICAgIG5hbWUgPSByZWYyW3NlY3Rpb25dO1xuICAgICAgICBmbjIoc2VjdGlvbiwgbmFtZSk7XG4gICAgICB9XG4gICAgfVxuICAgIExvZ2dlck1hbmFnZXIucmVnaXN0ZXIodGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBMb2dnZXIucHJvdG90eXBlLmdldFByZWZpeCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICB2YXIgZGV0YWlsUGFydHMsIGRldGFpbHMsIHByZWZpeDtcbiAgICBpZiAob3B0aW9ucy5zZWN0aW9uICE9IG51bGwpIHtcbiAgICAgIHByZWZpeCA9IHRoaXMubmFtZSArIFwiIOKelCBcIiArIG9wdGlvbnMuc2VjdGlvbiArIFwiLlwiICsgb3B0aW9ucy5tZXRob2Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByZWZpeCA9IHRoaXMubmFtZSArIFwiIOKelCBcIiArIG9wdGlvbnMubWV0aG9kO1xuICAgIH1cbiAgICBkZXRhaWxzID0gdGhpcy5fZ2V0Q2FsbGVyRGV0YWlscygpO1xuICAgIGRldGFpbFBhcnRzID0gW107XG4gICAgaWYgKChkZXRhaWxzW1wicGFja2FnZVwiXSAhPSBudWxsKSAmJiAoTG9nZ2VyTWFuYWdlci5zaG93UGFja2FnZSA9PT0gdHJ1ZSB8fCBvcHRpb25zLnR5cGUgPT09ICdlcnJvcicpKSB7XG4gICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHNbXCJwYWNrYWdlXCJdKTtcbiAgICB9XG4gICAgaWYgKExvZ2dlck1hbmFnZXIuc2hvd0ZpbGVBbmRMaW5lID09PSB0cnVlIHx8IG9wdGlvbnMudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgaWYgKChkZXRhaWxzLmZpbGUgIT0gbnVsbCkgJiYgKGRldGFpbHMubGluZSAhPSBudWxsKSkge1xuICAgICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHMuZmlsZSArIFwiOlwiICsgZGV0YWlscy5saW5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChkZXRhaWxzLmZpbGUgIT0gbnVsbCkge1xuICAgICAgICAgIGRldGFpbFBhcnRzLnB1c2goZGV0YWlscy5maWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGV0YWlscy5saW5lICE9IG51bGwpIHtcbiAgICAgICAgICBkZXRhaWxQYXJ0cy5wdXNoKGRldGFpbHMubGluZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuZGVmYXVsdFR5cGVzW29wdGlvbnMudHlwZV0gIT0gbnVsbCkge1xuICAgICAgcHJlZml4ID0gY2hhbGtbdGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcl0ocHJlZml4KTtcbiAgICB9XG4gICAgaWYgKGRldGFpbFBhcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHByZWZpeCA9IChkZXRhaWxQYXJ0cy5qb2luKCcgJykpICsgXCIgXCIgKyBwcmVmaXg7XG4gICAgfVxuICAgIHJldHVybiBwcmVmaXg7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5fZ2V0Q2FsbGVyRGV0YWlscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkZXRhaWxzLCBnZXRTdGFjaywgaSwgaW5kZXgsIGl0ZW0sIGxlbjEsIGxpbmUsIGxpbmVzLCBtYXRjaCwgcGFja2FnZU1hdGNoLCBzdGFjaztcbiAgICBnZXRTdGFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGVyciwgc3RhY2s7XG4gICAgICBlcnIgPSBuZXcgRXJyb3I7XG4gICAgICBzdGFjayA9IGVyci5zdGFjaztcbiAgICAgIHJldHVybiBzdGFjaztcbiAgICB9O1xuICAgIHN0YWNrID0gZ2V0U3RhY2soKTtcbiAgICBpZiAoIXN0YWNrKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGxpbmVzID0gc3RhY2suc3BsaXQoJ1xcbicpO1xuICAgIGxpbmUgPSB2b2lkIDA7XG4gICAgZm9yIChpbmRleCA9IGkgPSAwLCBsZW4xID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuMTsgaW5kZXggPSArK2kpIHtcbiAgICAgIGl0ZW0gPSBsaW5lc1tpbmRleF07XG4gICAgICBpZiAoIShpbmRleCA+IDApKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGluZSA9IGl0ZW07XG4gICAgICBpZiAobGluZS5tYXRjaCgvXlxccyphdCBldmFsIFxcKGV2YWwvKSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZpbGU6IFwiZXZhbFwiXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAoIWxpbmUubWF0Y2goL3BhY2thZ2VzXFwvcm9ja2V0Y2hhdF9sb2dnZXIoPzpcXC98XFwuanMpLykpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGRldGFpbHMgPSB7fTtcbiAgICBtYXRjaCA9IC8oPzpbQChdfCBhdCApKFteKF0rPyk6KFswLTk6XSspKD86XFwpfCQpLy5leGVjKGxpbmUpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHJldHVybiBkZXRhaWxzO1xuICAgIH1cbiAgICBkZXRhaWxzLmxpbmUgPSBtYXRjaFsyXS5zcGxpdCgnOicpWzBdO1xuICAgIGRldGFpbHMuZmlsZSA9IG1hdGNoWzFdLnNwbGl0KCcvJykuc2xpY2UoLTEpWzBdLnNwbGl0KCc/JylbMF07XG4gICAgcGFja2FnZU1hdGNoID0gbWF0Y2hbMV0ubWF0Y2goL3BhY2thZ2VzXFwvKFteXFwuXFwvXSspKD86XFwvfFxcLikvKTtcbiAgICBpZiAocGFja2FnZU1hdGNoICE9IG51bGwpIHtcbiAgICAgIGRldGFpbHNbXCJwYWNrYWdlXCJdID0gcGFja2FnZU1hdGNoWzFdO1xuICAgIH1cbiAgICByZXR1cm4gZGV0YWlscztcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLm1ha2VBQm94ID0gZnVuY3Rpb24obWVzc2FnZSwgdGl0bGUpIHtcbiAgICB2YXIgaSwgaiwgbGVuLCBsZW4xLCBsZW4yLCBsaW5lLCBsaW5lcywgc2VwYXJhdG9yLCB0b3BMaW5lO1xuICAgIGlmICghXy5pc0FycmF5KG1lc3NhZ2UpKSB7XG4gICAgICBtZXNzYWdlID0gbWVzc2FnZS5zcGxpdChcIlxcblwiKTtcbiAgICB9XG4gICAgbGVuID0gMDtcbiAgICBmb3IgKGkgPSAwLCBsZW4xID0gbWVzc2FnZS5sZW5ndGg7IGkgPCBsZW4xOyBpKyspIHtcbiAgICAgIGxpbmUgPSBtZXNzYWdlW2ldO1xuICAgICAgbGVuID0gTWF0aC5tYXgobGVuLCBsaW5lLmxlbmd0aCk7XG4gICAgfVxuICAgIHRvcExpbmUgPSBcIistLVwiICsgcy5wYWQoJycsIGxlbiwgJy0nKSArIFwiLS0rXCI7XG4gICAgc2VwYXJhdG9yID0gXCJ8ICBcIiArIHMucGFkKCcnLCBsZW4sICcnKSArIFwiICB8XCI7XG4gICAgbGluZXMgPSBbXTtcbiAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIGlmICh0aXRsZSAhPSBudWxsKSB7XG4gICAgICBsaW5lcy5wdXNoKFwifCAgXCIgKyBzLmxycGFkKHRpdGxlLCBsZW4pICsgXCIgIHxcIik7XG4gICAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIH1cbiAgICBsaW5lcy5wdXNoKHNlcGFyYXRvcik7XG4gICAgZm9yIChqID0gMCwgbGVuMiA9IG1lc3NhZ2UubGVuZ3RoOyBqIDwgbGVuMjsgaisrKSB7XG4gICAgICBsaW5lID0gbWVzc2FnZVtqXTtcbiAgICAgIGxpbmVzLnB1c2goXCJ8ICBcIiArIHMucnBhZChsaW5lLCBsZW4pICsgXCIgIHxcIik7XG4gICAgfVxuICAgIGxpbmVzLnB1c2goc2VwYXJhdG9yKTtcbiAgICBsaW5lcy5wdXNoKHRvcExpbmUpO1xuICAgIHJldHVybiBsaW5lcztcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgdmFyIGJveCwgY29sb3IsIGksIGxlbjEsIGxpbmUsIHByZWZpeCwgc3ViUHJlZml4O1xuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICBMb2dnZXJNYW5hZ2VyLmFkZFRvUXVldWUodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMubGV2ZWwgPT0gbnVsbCkge1xuICAgICAgb3B0aW9ucy5sZXZlbCA9IDE7XG4gICAgfVxuICAgIGlmIChMb2dnZXJNYW5hZ2VyLmxvZ0xldmVsIDwgb3B0aW9ucy5sZXZlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcmVmaXggPSB0aGlzLmdldFByZWZpeChvcHRpb25zKTtcbiAgICBpZiAob3B0aW9ucy5ib3ggPT09IHRydWUgJiYgXy5pc1N0cmluZyhvcHRpb25zW1wiYXJndW1lbnRzXCJdWzBdKSkge1xuICAgICAgY29sb3IgPSB2b2lkIDA7XG4gICAgICBpZiAodGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXSAhPSBudWxsKSB7XG4gICAgICAgIGNvbG9yID0gdGhpcy5kZWZhdWx0VHlwZXNbb3B0aW9ucy50eXBlXS5jb2xvcjtcbiAgICAgIH1cbiAgICAgIGJveCA9IHRoaXMubWFrZUFCb3gob3B0aW9uc1tcImFyZ3VtZW50c1wiXVswXSwgb3B0aW9uc1tcImFyZ3VtZW50c1wiXVsxXSk7XG4gICAgICBzdWJQcmVmaXggPSAn4p6UJztcbiAgICAgIGlmIChjb2xvciAhPSBudWxsKSB7XG4gICAgICAgIHN1YlByZWZpeCA9IHN1YlByZWZpeFtjb2xvcl07XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhzdWJQcmVmaXgsIHByZWZpeCk7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4xID0gYm94Lmxlbmd0aDsgaSA8IGxlbjE7IGkrKykge1xuICAgICAgICBsaW5lID0gYm94W2ldO1xuICAgICAgICBpZiAoY29sb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN1YlByZWZpeCwgbGluZVtjb2xvcl0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN1YlByZWZpeCwgbGluZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc1tcImFyZ3VtZW50c1wiXS51bnNoaWZ0KHByZWZpeCk7XG4gICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBvcHRpb25zW1wiYXJndW1lbnRzXCJdKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIExvZ2dlcjtcblxufSkoKTtcblxudGhpcy5TeXN0ZW1Mb2dnZXIgPSBuZXcgTG9nZ2VyKCdTeXN0ZW0nLCB7XG4gIG1ldGhvZHM6IHtcbiAgICBzdGFydHVwOiB7XG4gICAgICB0eXBlOiAnc3VjY2VzcycsXG4gICAgICBsZXZlbDogMFxuICAgIH1cbiAgfVxufSk7XG5cbnByb2Nlc3NTdHJpbmcgPSBmdW5jdGlvbihzdHJpbmcsIGRhdGUpIHtcbiAgaWYgKHN0cmluZ1swXSA9PT0gJ3snKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBMb2cuZm9ybWF0KEVKU09OLnBhcnNlKHN0cmluZyksIHtcbiAgICAgICAgY29sb3I6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIExvZy5mb3JtYXQoe1xuICAgICAgbWVzc2FnZTogc3RyaW5nLFxuICAgICAgdGltZTogZGF0ZSxcbiAgICAgIGxldmVsOiAnaW5mbydcbiAgICB9LCB7XG4gICAgICBjb2xvcjogdHJ1ZVxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge31cbiAgcmV0dXJuIHN0cmluZztcbn07XG5cblN0ZE91dCA9IG5ldyAoKGZ1bmN0aW9uKHN1cGVyQ2xhc3MpIHtcbiAgZXh0ZW5kKF9DbGFzcywgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gX0NsYXNzKCkge1xuICAgIHZhciB3cml0ZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgd3JpdGUgPSBwcm9jZXNzLnN0ZG91dC53cml0ZTtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cmluZywgZW5jb2RpbmcsIGZkKSB7XG4gICAgICAgIHZhciBkYXRlLCBpdGVtLCByZWYsIHJlZjEsIHZpZXdMaW1pdDtcbiAgICAgICAgd3JpdGUuYXBwbHkocHJvY2Vzcy5zdGRvdXQsIGFyZ3VtZW50cyk7XG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZTtcbiAgICAgICAgc3RyaW5nID0gcHJvY2Vzc1N0cmluZyhzdHJpbmcsIGRhdGUpO1xuICAgICAgICBpdGVtID0ge1xuICAgICAgICAgIGlkOiBSYW5kb20uaWQoKSxcbiAgICAgICAgICBzdHJpbmc6IHN0cmluZyxcbiAgICAgICAgICB0czogZGF0ZVxuICAgICAgICB9O1xuICAgICAgICBfdGhpcy5xdWV1ZS5wdXNoKGl0ZW0pO1xuICAgICAgICB2aWV3TGltaXQgPSAocmVmID0gTWV0ZW9yLnNldHRpbmdzKSAhPSBudWxsID8gKHJlZjEgPSByZWYubG9nZ2VyKSAhPSBudWxsID8gcmVmMS52aWV3TGltaXQgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgICAgIGlmICghdmlld0xpbWl0KSB7XG4gICAgICAgICAgdmlld0xpbWl0ID0gMTAwMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoX3RoaXMucXVldWUubGVuZ3RoID4gdmlld0xpbWl0KSB7XG4gICAgICAgICAgX3RoaXMucXVldWUuc2hpZnQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXMuZW1pdCgnd3JpdGUnLCBzdHJpbmcsIGl0ZW0pO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgfVxuXG4gIHJldHVybiBfQ2xhc3M7XG5cbn0pKEV2ZW50RW1pdHRlcikpO1xuXG5NZXRlb3IucHVibGlzaCgnc3Rkb3V0JywgZnVuY3Rpb24oKSB7XG4gIHZhciBpLCBpdGVtLCBsZW4xLCByZWYsIHVzZXI7XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmICghdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIHVzZXIgPSBkYi51c2Vycy5maW5kT25lKHRoaXMudXNlcklkLCB7XG4gICAgZmllbGRzOiB7XG4gICAgICBpc19jbG91ZGFkbWluOiAxXG4gICAgfVxuICB9KTtcbiAgaWYgKCF1c2VyKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICByZWYgPSBTdGRPdXQucXVldWU7XG4gIGZvciAoaSA9IDAsIGxlbjEgPSByZWYubGVuZ3RoOyBpIDwgbGVuMTsgaSsrKSB7XG4gICAgaXRlbSA9IHJlZltpXTtcbiAgICB0aGlzLmFkZGVkKCdzdGRvdXQnLCBpdGVtLmlkLCB7XG4gICAgICBzdHJpbmc6IGl0ZW0uc3RyaW5nLFxuICAgICAgdHM6IGl0ZW0udHNcbiAgICB9KTtcbiAgfVxuICB0aGlzLnJlYWR5KCk7XG4gIFN0ZE91dC5vbignd3JpdGUnLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oc3RyaW5nLCBpdGVtKSB7XG4gICAgICByZXR1cm4gX3RoaXMuYWRkZWQoJ3N0ZG91dCcsIGl0ZW0uaWQsIHtcbiAgICAgICAgc3RyaW5nOiBpdGVtLnN0cmluZyxcbiAgICAgICAgdHM6IGl0ZW0udHNcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKHRoaXMpKTtcbn0pO1xuXG5NZXRlb3Iuc3RhcnR1cChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZiwgcmVmMSwgcmVmMiwgcmVmMywgcmVmNCwgcmVmNSwgcmVmNiwgcmVmNztcbiAgaWYgKChyZWYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMSA9IHJlZi5sb2dnZXIpICE9IG51bGwgPyByZWYxLmVuYWJsZWQgOiB2b2lkIDAgOiB2b2lkIDApIHtcbiAgICBpZiAoKHJlZjIgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmMyA9IHJlZjIubG9nZ2VyKSAhPSBudWxsID8gcmVmMy5zaG93UGFja2FnZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5zaG93UGFja2FnZSA9IHRydWU7XG4gICAgfVxuICAgIGlmICgocmVmNCA9IE1ldGVvci5zZXR0aW5ncykgIT0gbnVsbCA/IChyZWY1ID0gcmVmNC5sb2dnZXIpICE9IG51bGwgPyByZWY1LnNob3dGaWxlQW5kTGluZSA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5zaG93RmlsZUFuZExpbmUgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoKHJlZjYgPSBNZXRlb3Iuc2V0dGluZ3MpICE9IG51bGwgPyAocmVmNyA9IHJlZjYubG9nZ2VyKSAhPSBudWxsID8gcmVmNy5sb2dMZXZlbCA6IHZvaWQgMCA6IHZvaWQgMCkge1xuICAgICAgTG9nZ2VyTWFuYWdlci5sb2dMZXZlbCA9IE1ldGVvci5zZXR0aW5ncy5sb2dnZXIubG9nTGV2ZWw7XG4gICAgfVxuICAgIHJldHVybiBMb2dnZXJNYW5hZ2VyLmVuYWJsZSh0cnVlKTtcbiAgfVxufSk7XG4iXX0=
