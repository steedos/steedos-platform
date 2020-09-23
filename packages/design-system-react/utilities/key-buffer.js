"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
function KeyBuffer() {
  var _this = this;

  this.buffer = '';
  return function (key) {
    if (_this.timeout) {
      clearTimeout(_this.timeout);
      _this.timeout = undefined;
    }

    _this.timeout = setTimeout(function () {
      _this.buffer = '';
    }, 400);
    _this.buffer = _this.buffer + key;
    return _this.buffer;
  };
}

var _default = KeyBuffer;
exports.default = _default;