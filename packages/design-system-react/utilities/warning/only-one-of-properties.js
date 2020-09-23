"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _warning = _interopRequireDefault(require("warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */
// This function will deliver an warning message to the browser console if extraneous properties are defined (falsey).
var onlyOneOf = function onlyOneOfFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  onlyOneOf = function onlyOneOfFunction(control, selectedProps, comment) {
    var additionalComment = comment ? " ".concat(comment) : '';
    var keys = Object.keys(selectedProps);
    keys = keys.filter(function (key) {
      return selectedProps[key];
    });

    if (!hasWarned[control]) {
      /* eslint-disable max-len */
      (0, _warning.default)(keys.length <= 1, "[Design System React] Only one of the following props is needed by ".concat(control, ": [").concat(keys.join(), "].").concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control] = !!selectedProps;
    }
  };
}

var _default = onlyOneOf;
exports.default = _default;