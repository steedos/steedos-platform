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
var deprecated = function deprecatedFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  deprecated = function deprecatedFunction(control, propValue, oldProp, newProp, comment, silenceDeprecatedPropertyWarning) {
    var additionalComment = comment ? " ".concat(comment) : '';
    var newProperty = newProp ? "Use `".concat(newProp, "`") : '';
    var newPropertySentence = newProp ? " ".concat(newProperty, " instead.") : '';

    if (!silenceDeprecatedPropertyWarning && !hasWarned[control + oldProp]) {
      /* eslint-disable max-len */
      (0, _warning.default)(propValue === undefined, "[Design System React] `".concat(oldProp, "` will be removed in the next major version of ").concat(control, ".").concat(newPropertySentence).concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control + oldProp] = propValue !== undefined;
    }
  };
}

var _default = deprecated;
exports.default = _default;