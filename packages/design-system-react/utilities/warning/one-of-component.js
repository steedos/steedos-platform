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
var oneOfComponent = function oneOfComponentFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  oneOfComponent = function oneOfComponentFunction(control, props, propName, allowedComponents, comment, specificTest // if this is set, it will be checked instead of props[propName]
  ) {
    var additionalComment = comment ? " ".concat(comment) : '';
    var componentType;

    if (specificTest) {
      if (typeof specificTest.type === 'string') {
        componentType = specificTest.type;
      } else {
        componentType = specificTest.type.displayName;
      }
    } else if (typeof props[propName].type === 'string') {
      componentType = props[propName].type;
    } else {
      componentType = props[propName].type.displayName;
    }

    var allowedComponentFound = allowedComponents.indexOf(componentType) > -1;

    if (!allowedComponentFound && !hasWarned[control]) {
      /* eslint-disable max-len */
      (0, _warning.default)(false, "[Design System React] ".concat(control, " requires that prop '").concat(propName, "' is an instance of one of the following components: ").concat(allowedComponents.join(', '), ". An instance of '").concat(componentType, "' was given.").concat(additionalComment));
      /* eslint-enable max-len */

      hasWarned[control] = true;
    }
  };
}

var _default = oneOfComponent;
exports.default = _default;