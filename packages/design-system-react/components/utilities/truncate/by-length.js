"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = truncateByLength;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
function truncateByLength(_ref) {
  var _ref$inputString = _ref.inputString,
      inputString = _ref$inputString === void 0 ? '' : _ref$inputString,
      _ref$maxLength = _ref.maxLength,
      maxLength = _ref$maxLength === void 0 ? 140 : _ref$maxLength,
      _ref$truncationChars = _ref.truncationChars,
      truncationChars = _ref$truncationChars === void 0 ? '...' : _ref$truncationChars,
      _ref$startingLength = _ref.startingLength,
      startingLength = _ref$startingLength === void 0 ? 0 : _ref$startingLength;
  var outputString;

  if (inputString.length <= maxLength) {
    outputString = inputString;
  } else {
    var words = inputString.split(' ');
    var length = startingLength + truncationChars.length - 1;
    outputString = words.reduce(function (combined, word) {
      length += word.length + 1;

      if (length <= maxLength) {
        // eslint-disable-next-line fp/no-mutating-methods
        combined.push(word);
      }

      return combined;
    }, []).join(' ');
    outputString += truncationChars;
  }

  return outputString;
}