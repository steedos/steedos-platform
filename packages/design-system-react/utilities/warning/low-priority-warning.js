"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */
var lowPriorityWarning = function printWarningFunction() {};

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line fp/no-rest-parameters
  var printWarning = function printWarningFunction(originalMessage) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = "Warning: ".concat(originalMessage.replace(/%s/g, function () {
      var argument = args[argIndex];
      argIndex += 1;
      return argument;
    }));

    if (typeof console !== 'undefined') {
      console.warn(message); // eslint-disable-line no-console
    }

    try {
      // Throw error to enable tracing the callstack.
      // eslint-disable-next-line fp/no-throw
      throw new Error(message);
    } catch (event) {} // eslint-disable-line no-empty

  }; // eslint-disable-next-line fp/no-rest-parameters


  lowPriorityWarning = function lowPriorityWarning(condition, originalMessage) {
    if (!condition && originalMessage) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(void 0, [originalMessage].concat(args));
    }
  };
}

var _default = lowPriorityWarning;
exports.default = _default;