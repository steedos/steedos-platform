"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _warning = _interopRequireDefault(require("warning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */

/* global XMLHttpRequest, window */
// This function does an "AJAX" request to warn users on how to setup their icon path.
var urlExists = function urlExistsFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};
  var hasExecuted;

  var warn = function warn(control, url, comment) {
    return function (res) {
      hasExecuted = true;

      if (res.status === 404) {
        var additionalComment = comment ? " ".concat(comment) : '';
        /* eslint-disable max-len */

        (0, _warning.default)(!url, "The icon asset was not found at ".concat(url, ". Make sure the path to the icon asset is correct. You can set the icon path by importing the IconSettings component, `<IconSettings iconPath=[/assets/icons]>` from `components/iconSettings`, and wrap that component around your entire app or around individual components using icons. If you are using the `<Icon>` component, you can also pass the url to `this.props.path`.").concat(additionalComment));
        /* eslint-enable max-len */

        hasWarned["".concat(control, "-path")] = !!url;
      }
    };
  };

  var shouldWarn = function shouldWarn(control) {
    return !hasExecuted && !hasWarned["".concat(control, "-path")] && typeof window !== 'undefined' && process.env.NODE_ENV !== 'test';
  };

  if (typeof fetch === 'function') {
    urlExists = function urlExistsFunction(control, url, comment) {
      if (shouldWarn(control)) {
        fetch(url).then(warn(control, url, comment));
      }
    };
  } else {
    // Using XMLHttpRequest can cause problems in non-browser environments. This should be completely removed in production environment and should not execute in a testing environment.
    urlExists = function urlExistsFunction(control, url, comment) {
      if (shouldWarn(control) && XMLHttpRequest) {
        var http = new XMLHttpRequest();
        http.open('GET', url, false);
        http.send();
        warn(control, url, comment)(http);
      }
    };
  }
}

var _default = urlExists;
exports.default = _default;