"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash.escaperegexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
// Determines the focusedIndex of a menu item following keyboard letter presses
var keyLetterMenuItemSelect = function keyLetterMenuItemSelect(_ref) {
  var key = _ref.key,
      keyBuffer = _ref.keyBuffer,
      keyCode = _ref.keyCode,
      options = _ref.options;
  var ch = key || String.fromCharCode(keyCode);

  if (/^[ -~]$/.test(ch)) {
    ch = ch.toLowerCase();
  } else {
    ch = null;
  }

  var pattern = keyBuffer(ch);
  var consecutive = 0;
  var focusedIndex; // Support for navigating to the next option of the same letter with repeated presses of the same key

  if (pattern.length > 1 && new RegExp("^[".concat((0, _lodash.default)(ch), "]+$")).test(pattern)) {
    consecutive = pattern.length;
  }

  options.forEach(function (item, index) {
    var itemLabel = String(item.label).toLowerCase();

    if (focusedIndex === undefined && itemLabel.substr(0, pattern.length) === pattern || consecutive > 0 && itemLabel.substr(0, 1) === ch) {
      consecutive -= 1;
      focusedIndex = index;
    }
  });
  return focusedIndex;
};

var _default = keyLetterMenuItemSelect;
exports.default = _default;