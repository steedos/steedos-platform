"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _constants = require("../../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
// # List Item Label Component
// ## Dependencies
// ### React
// ## Constants

/**
 * Component description.
 */
var ListItemLabel = function ListItemLabel(props) {
  return /*#__PURE__*/_react.default.createElement("span", {
    className: "slds-truncate",
    title: props.label
  }, props.icon, props.label);
};

ListItemLabel.displayName = _constants.LIST_ITEM_LABEL;
ListItemLabel.propTypes = {
  data: _propTypes.default.object,
  icon: _propTypes.default.node,
  index: _propTypes.default.number,
  inverted: _propTypes.default.bool,
  isSelected: _propTypes.default.bool,
  label: _propTypes.default.string,
  value: _propTypes.default.any
};
ListItemLabel.defaultProps = {
  data: {},
  index: 0,
  inverted: false,
  isSelected: false,
  label: '',
  value: null
};
var _default = ListItemLabel;
exports.default = _default;