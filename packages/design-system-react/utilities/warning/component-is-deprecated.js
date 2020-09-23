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
// This function will deliver a warning message to the browser console about the component being a deprecated component.
var isPrototype = function isPrototypeFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  isPrototype = function isPrototypeFunction(control, props, comment) {
    var additionalComment = comment ? " ".concat(comment) : '';

    if (!props.silenceDeprecationWarning && !hasWarned[control]) {
      /* eslint-disable max-len */
      (0, _lowPriorityWarning.default)(false, "[Design System React] ".concat(control, " is a deprecated component. Bugfixes can be contributed, but new features and additional alignment with SLDS may be declined.").concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control] = true;
    }
  };
}

var _default = isPrototype;
exports.default = _default;