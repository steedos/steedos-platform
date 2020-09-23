"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */
var getComponentDocFn = function getComponentDocFnEmpty() {};

var baseURL = 'https://react.lightningdesignsystem.com';

if (process.env.NODE_ENV !== 'production') {
  getComponentDocFn = function getComponentDocFnInside(jsonDoc) {
    var componentUrl = "".concat(baseURL + (jsonDoc && jsonDoc['url-slug'] ? "/components/".concat(jsonDoc['url-slug']) : ''));
    return function (propName) {
      return "Please check the current documentation at: ".concat(propName ? "".concat(componentUrl, "#prop-").concat(propName) : componentUrl);
    };
  };
}

var _default = getComponentDocFn;
exports.default = _default;