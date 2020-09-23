"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
var EventUtil = {
  trapEvent: function trapEvent(event) {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();

    if (event.nativeEvent && event.nativeEvent.preventDefault) {
      event.nativeEvent.preventDefault();
    }

    if (event.nativeEvent && event.nativeEvent.stopPropagation) {
      event.nativeEvent.stopPropagation();
    }
  },
  trap: function trap(event) {
    return EventUtil.trapEvent(event);
  },
  trapImmediate: function trapImmediate(event) {
    if (event.stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }

    if (event.nativeEvent && event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }

    EventUtil.trap(event);
  }
};
var _default = EventUtil;
exports.default = _default;