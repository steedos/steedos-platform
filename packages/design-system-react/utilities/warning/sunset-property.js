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
// This function will deliver an error message to the browser console about the removal of a property.
var sunset = function sunsetFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  sunset = function sunsetFunction(control, propValue, oldProp, comment) {
    var additionalComment = comment ? " ".concat(comment) : '';

    if (!hasWarned[control + oldProp]) {
      /* eslint-disable max-len */
      (0, _warning.default)(!propValue, "[Design System React] `".concat(oldProp, "` has reached End-of-Life and has been removed from the API of ").concat(control, ". Please update your API.").concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control + oldProp] = !!propValue;
    }
  };
}

var _default = sunset;
exports.default = _default;