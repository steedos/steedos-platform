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
var incompatibleProps = function incompatiblePropsFunction() {};

if (process.env.NODE_ENV !== 'production') {
  incompatibleProps = function incompatiblePropsFunction(control, props, propOneName, propOneValues, propTwoName, propTwoValues, comment) {
    var checkPassed = true;
    var propOneConditionMet = false;
    var propTwoConditionMet = false;

    if (props[propOneName] && props[propTwoName]) {
      if (propOneValues) {
        propOneValues.forEach(function (value) {
          propOneConditionMet = props[propOneName] === value;
        });
      } else {
        propOneConditionMet = true;
      }

      if (propTwoValues) {
        propTwoValues.forEach(function (value) {
          propTwoConditionMet = props[propTwoName] === value;
        });
      } else {
        propTwoConditionMet = true;
      }

      checkPassed = !(propOneConditionMet && propTwoConditionMet);
    }

    if (!checkPassed) {
      var additionalComment = comment ? " ".concat(comment) : '';
      var incompatibleValueOne = propOneValues ? " of value `".concat(props[propOneName], "`") : '';
      var incompatibleValueTwo = propTwoValues ? " of value `".concat(props[propTwoName], "`") : '';
      /* eslint-disable max-len */

      (0, _warning.default)(false, "[Design System React] ".concat(control, " should not be passed prop `").concat(propOneName, "`").concat(incompatibleValueOne, " along with prop `").concat(propTwoName, "`").concat(incompatibleValueTwo, " as they are incompatible.").concat(additionalComment));
      /* eslint-enable max-len */
    }
  };
}

var _default = incompatibleProps;
exports.default = _default;