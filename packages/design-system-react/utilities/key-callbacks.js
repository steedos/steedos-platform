"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _event = _interopRequireDefault(require("./event"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/*
 * Helper function that has callbacks passed into it with the key
 * being the keycode of the event. This allows an object literal to
 * control key event callback mapping and avoids a long conditional
 * if statement and uses an enumeration pattern instead.
 */
var mapKeyEventCallbacks = function mapKeyEventCallbacks(event, _ref) {
  var _ref$callbacks = _ref.callbacks,
      callbacks = _ref$callbacks === void 0 ? {} : _ref$callbacks,
      _ref$shiftCallbacks = _ref.shiftCallbacks,
      shiftCallbacks = _ref$shiftCallbacks === void 0 ? {} : _ref$shiftCallbacks,
      _ref$stopPropagation = _ref.stopPropagation,
      stopPropagation = _ref$stopPropagation === void 0 ? true : _ref$stopPropagation;

  if (event.shiftKey && event.keyCode && shiftCallbacks[event.keyCode]) {
    if (stopPropagation) {
      _event.default.trapEvent(event);
    }

    shiftCallbacks[event.keyCode].callback(event, shiftCallbacks[event.keyCode].data);
  } else if (event.keyCode && callbacks[event.keyCode]) {
    if (stopPropagation) {
      _event.default.trapEvent(event);
    }

    callbacks[event.keyCode].callback(event, callbacks[event.keyCode].data);
  } else if (event.keyCode && callbacks.other) {
    // You will likely NOT want to stop propagation of all key presses!
    if (callbacks.other.stopPropagation) {
      _event.default.trapEvent(event);
    }

    callbacks.other.callback(event, callbacks.other.data);
  }
};

var _default = mapKeyEventCallbacks;
exports.default = _default;