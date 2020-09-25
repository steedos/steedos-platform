"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable no-console */

/**
 * This is a wrapper utility for logging messages to the
	user. This is helpful in using the same examples
	for the documentation site as for the Storybook examples.
 * @param  {Function} options.action function that outputs
 *   messages to Storybook
 * @param  {Event} options.event the browser event
 * @param  {String} options.eventName the name of the event
 * @param  {Object} options.data callback payload and data object
 * @param  {Function} options.customLog Custom logging function. This
 *   is helpful for Node debugging and removing console log from tests.
 */
var log = function log(_ref) {
  var action = _ref.action,
      event = _ref.event,
      eventName = _ref.eventName,
      data = _ref.data,
      customLog = _ref.customLog;

  if (customLog && event) {
    customLog({
      eventName: eventName,
      event: event,
      data: data
    });
  } else if (action && event) {
    // https://github.com/storybooks/storybook/tree/master/addons/actions
    action(eventName)(event, data);
  } else if (console && console.log) {
    console.log(eventName, event, data);
  }
};

var _default = log;
exports.default = _default;