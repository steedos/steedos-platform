"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _warning = _interopRequireDefault(require("warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */
// This function will deliver an error message to the browser console when all of the props passed in are undefined (falsey).
var hasChildrenWithoutDisplayNameOf = function hasChildrenWithoutDisplayNameOfFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {}; // TODO: allow `displayName` to be an array of displayNames

  hasChildrenWithoutDisplayNameOf = function hasChildrenWithoutDisplayNameOfFunction(control, children, displayName, comment) {
    if (!hasWarned[control]) {
      var additionalComment = comment ? " ".concat(comment) : '';
      var childrenWithoutSelectedDisplayName = [];

      _react.default.Children.forEach(children, function (child) {
        if (child && child.type && child.type.displayName !== displayName) {
          // eslint-disable-next-line fp/no-mutating-methods
          childrenWithoutSelectedDisplayName.push(child);
        }
      });

      var hasChildrenWithoutSelectedDisplayName = childrenWithoutSelectedDisplayName.length > 0;

      if (hasChildrenWithoutSelectedDisplayName) {
        /* eslint-disable max-len */
        (0, _warning.default)(false, "[Design System React] Unable to use child components specified within ".concat(control, ". Please use a child component with a `displayName` class property value of ").concat(displayName, ". Children without that class property are ignored. Please review `children` prop documentation.").concat(additionalComment));
        /* eslint-enable max-len */
      }

      hasWarned[control] = !!hasChildrenWithoutSelectedDisplayName;
    }
  };
}

var _default = hasChildrenWithoutDisplayNameOf;
exports.default = _default;