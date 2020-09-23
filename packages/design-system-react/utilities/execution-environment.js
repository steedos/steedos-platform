"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseViewport = exports.canUseEventListeners = exports.canUseDOM = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
exports.canUseDOM = canUseDOM;
var canUseEventListeners = canUseDOM && Boolean(window.addEventListener || window.attachEvent);
exports.canUseEventListeners = canUseEventListeners;
var canUseViewport = canUseDOM && Boolean(window.screen);
exports.canUseViewport = canUseViewport;