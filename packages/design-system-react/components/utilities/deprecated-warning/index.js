"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _constants = require("../../../utilities/constants");

var _alert = _interopRequireDefault(require("../../alert"));

var _container = _interopRequireDefault(require("../../alert/container"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable react/jsx-no-literals */
// ### React
// ## Constants

/**
 * A utility component that is used to highlight a deprecated component.
 */
var DeprecatedWarning = function DeprecatedWarning() {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "slds-p-top_x-large"
  }, /*#__PURE__*/_react.default.createElement(_container.default, null, /*#__PURE__*/_react.default.createElement(_alert.default, {
    labels: {
      heading: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("strong", null, "Deprecated component."), " No fit and finish bug fixes will be accepted for this component.")
    },
    variant: "error"
  })));
}; // ### Display Name


DeprecatedWarning.displayName = _constants.DEPRECATED_WARNING;
var _default = DeprecatedWarning;
exports.default = _default;