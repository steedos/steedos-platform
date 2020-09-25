"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lowPriorityWarning = _interopRequireDefault(require("./low-priority-warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */

/* eslint-disable max-len */
// This function will deliver a warning message to the browser console about an event parameter change.
var deprecated = function deprecatedFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  deprecated = function deprecatedFunction(control, _ref, comment) {
    var oldEventParameterOrder = _ref.oldEventParameterOrder,
        propAsString = _ref.propAsString,
        log = _ref.log;
    var additionalComment = comment ? " ".concat(comment) : '';
    var warnOnFirstOccurrenceKey = control + propAsString;
    var triggerWarning = Boolean(oldEventParameterOrder);

    if (!hasWarned[warnOnFirstOccurrenceKey]) {
      var message = "[Design System React] ".concat(additionalComment);

      if (triggerWarning && log) {
        log({
          message: message
        });
      } else if (triggerWarning) {
        (0, _lowPriorityWarning.default)(false, // false value triggers warning
        message);
      } // store global flag to limit warnings to first issue


      hasWarned[warnOnFirstOccurrenceKey] = triggerWarning;
    }
  };
}

var _default = deprecated;
exports.default = _default;