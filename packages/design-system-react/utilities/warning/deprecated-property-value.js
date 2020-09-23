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

/* eslint-disable max-len */
// This function will deliver an error message to the browser console about the future of a removal and moving of a property's valid value to another prop. This makes the most sense to be used with `oneOf` prop types.
var deprecated = function deprecatedFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  deprecated = function deprecatedFunction(control, _ref, comment) {
    var propAsString = _ref.propAsString,
        propValue = _ref.propValue,
        deprecatedPropValue = _ref.deprecatedPropValue,
        replacementPropAsString = _ref.replacementPropAsString,
        replacementPropAsValue = _ref.replacementPropAsValue,
        log = _ref.log;
    var additionalComment = comment ? " ".concat(comment) : '';
    var warnOnFirstOccurrenceKey = control + propAsString + deprecatedPropValue;
    var triggerWarning = propValue === deprecatedPropValue;
    var replacementSentence = deprecatedPropValue && replacementPropAsString && replacementPropAsValue ? " Replace `".concat(propAsString, "=\"").concat(deprecatedPropValue, "\"` with `").concat(replacementPropAsString, "=\"").concat(replacementPropAsValue, "\"`.") : '';

    if (!hasWarned[warnOnFirstOccurrenceKey]) {
      var message = "[Design System React] The value of `".concat(deprecatedPropValue, "`, for prop `").concat(propAsString, "` will be removed in the next major version of ").concat(control, ". Please update your props.").concat(replacementSentence).concat(additionalComment);

      if (triggerWarning && log) {
        log({
          message: message
        });
      } else {
        (0, _warning.default)(!triggerWarning, // false value triggers warning
        message);
      } // store global flag to limit warnings to first issue


      hasWarned[warnOnFirstOccurrenceKey] = triggerWarning;
    }
  };
}

var _default = deprecated;
exports.default = _default;