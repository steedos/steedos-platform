"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactHighlighter = _interopRequireDefault(require("react-highlighter"));

var _constants = require("../../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
// ### React
// ### ReactHighlighter
// ## Constants

/**
 * A utility component that highlights occurrences of a particular pattern in its contents.
 */
var Highlighter = function Highlighter(props) {
  if (props.search) {
    var children;

    if (typeof props.children === 'string') {
      children = /*#__PURE__*/_react.default.createElement(_reactHighlighter.default, {
        className: props.className,
        matchClass: null,
        matchElement: "mark",
        search: props.search,
        title: props.children
      }, props.children);
    } else {
      var findString = function findString(nodeArr) {
        return nodeArr.map(function (element) {
          var newElement;

          if (typeof element === 'string') {
            newElement = /*#__PURE__*/_react.default.createElement(_reactHighlighter.default, {
              key: element,
              className: props.className,
              matchClass: null,
              matchElement: "mark",
              search: props.search,
              title: element
            }, element);
          } else {
            newElement = element;
          }

          return newElement;
        });
      };

      if (props.children.props) {
        var node = props.children.props.children;
        children = node instanceof Array ? findString(node) : node;
      }
    }

    return /*#__PURE__*/_react.default.createElement("span", null, children);
  }

  if (typeof props.children === 'string') {
    return /*#__PURE__*/_react.default.createElement("span", {
      className: props.className,
      title: props.children
    }, props.children);
  }

  return /*#__PURE__*/_react.default.createElement("span", {
    className: props.className
  }, props.children);
}; // ### Display Name


Highlighter.displayName = _constants.HIGHLIGHTER; // ### Prop Types

Highlighter.propTypes = {
  /**
   * The full string to display.
   */
  children: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool, _propTypes.default.node]),
  className: _propTypes.default.string,

  /**
   * The string of text (or Regular Expression) to highlight.
   */
  search: _propTypes.default.any
};
var _default = Highlighter;
exports.default = _default;