"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
// Scrolls a menu container to the appropriate focused item. Assumes container is positioned (absolute, relative, etc)
var menuItemSelectScroll = function menuItemSelectScroll(_ref) {
  var container = _ref.container,
      focusedIndex = _ref.focusedIndex,
      _ref$itemTag = _ref.itemTag,
      itemTag = _ref$itemTag === void 0 ? 'li' : _ref$itemTag,
      _ref$scrollPadding = _ref.scrollPadding,
      scrollPadding = _ref$scrollPadding === void 0 ? 4 : _ref$scrollPadding;
  var domItem = container.querySelector("".concat(itemTag, ":nth-child(").concat(focusedIndex + 1, ")"));

  if (domItem) {
    if (domItem.offsetHeight - container.scrollTop + domItem.offsetTop >= container.offsetHeight) {
      // eslint-disable-next-line no-param-reassign
      container.scrollTop = domItem.offsetHeight + domItem.offsetTop - container.offsetHeight + scrollPadding;
    } else if (domItem.offsetTop <= container.scrollTop) {
      // eslint-disable-next-line no-param-reassign
      container.scrollTop = domItem.offsetTop - scrollPadding;
    }
  }
};

var _default = menuItemSelectScroll;
exports.default = _default;