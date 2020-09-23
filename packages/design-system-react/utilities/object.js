"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Remove keys with undefined values. This is useful
 * for merging object props like `assistiveText` and `labels`
 * and keeping default prop values.
 */
var removeUndefined = function removeUndefined(obj) {
  var newObj = {};
  Object.keys(obj).forEach(function (prop) {
    if (typeof obj[prop] !== 'undefined') {
      newObj[prop] = obj[prop];
    }
  });
  return newObj;
};

var helpers = {
  removeUndefined: removeUndefined
};
var _default = helpers;
exports.default = _default;