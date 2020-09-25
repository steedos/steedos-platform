"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/jsx-curly-brace-presence */

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
var propTypes = {
  /*
   * Assistive Text to use instead of a visible label
   */
  assistiveText: _propTypes.default.object,

  /**
   * Class names to be added to the label
   */
  className: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object, _propTypes.default.string]),

  /*
   * Id of the input associated with this label
   */
  htmlFor: _propTypes.default.string,

  /*
   * Input Label
   */
  label: _propTypes.default.string,

  /*
   * Applies label styling for a required form element
   */
  required: _propTypes.default.bool,

  /**
   * Changes markup of label.
   */
  variant: _propTypes.default.oneOf(['base', 'static'])
};
var defaultProps = {
  variant: 'base'
};
/*
 * Form label. This returns null if there is no label text (hidden or shown)
 */

var Label = function Label(props) {
  var labelText = props.label || props.assistiveText && props.assistiveText.label; // One of these is required to pass accessibility tests

  var subRenders = {
    base: /*#__PURE__*/_react.default.createElement("label", {
      className: (0, _classnames.default)('slds-form-element__label', {
        'slds-assistive-text': props.assistiveText && !props.label
      }, props.className),
      htmlFor: props.htmlFor
    }, props.required && /*#__PURE__*/_react.default.createElement("abbr", {
      className: "slds-required",
      title: "required"
    }, '*'), labelText),
    static: /*#__PURE__*/_react.default.createElement("span", {
      className: (0, _classnames.default)('slds-form-element__label', props.className)
    }, labelText)
  };
  return labelText ? subRenders[props.variant] : null;
};

Label.displayName = 'Label';
Label.propTypes = propTypes;
Label.defaultProps = defaultProps;
var _default = Label;
exports.default = _default;