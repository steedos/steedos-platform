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
// This function will deliver an error message to the browser console when all of the props passed in are undefined (falsey).
var oneOfRequired;

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  oneOfRequired = function oneOfRequiredFunction(control, selectedProps, comment) {
    var additionalComment = comment ? " ".concat(comment) : '';
    var atLeastOnePropIsSet = false;
    var keys = Object.keys(selectedProps);
    keys.forEach(function (key) {
      if (selectedProps[key]) {
        atLeastOnePropIsSet = true;
      }
    });

    if (!hasWarned[control]) {
      /* eslint-disable max-len */
      (0, _warning.default)(atLeastOnePropIsSet, "[Design System React] One of the following props are required by ".concat(control, ": [").concat(keys.join(), "].").concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control] = !!selectedProps;
    }
  };
} else {
  oneOfRequired = function oneOfRequiredFunction() {};
}

var _default = oneOfRequired;
exports.default = _default;