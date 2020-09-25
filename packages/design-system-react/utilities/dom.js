"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable consistent-return */

/**
 * Traverse all children
 */
function flatMapChildren(children, iterator) {
  var result = [];

  function go(xs) {
    return _react.default.Children.map(xs, function (child) {
      // eslint-disable-next-line fp/no-mutating-methods
      result.push(iterator(child));
      if (child.type) go(child.props.children);
    });
  }

  go(children);
  return result;
}
/**
 * Perhaps there's a more pragmatic way to do this. Eventually, I suspect we'll have some utils to help find children.
 */


function hasChild(children, name) {
  var flag = false;
  flatMapChildren(children, function (child) {
    flag = flag || child.type && child.type.name === name;
  });
  return flag;
} // findDOMNode complains so filter out strings from virtual dom


function textContent(children) {
  return flatMapChildren(children, function (child) {
    // eslint-disable-line consistent-return
    if (typeof child === 'string') return child;
  }).join(' ');
}

var helpers = {
  textContent: textContent,
  hasChild: hasChild
};
var _default = helpers;
exports.default = _default;