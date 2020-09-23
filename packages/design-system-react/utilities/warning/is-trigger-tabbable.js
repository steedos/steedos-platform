"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _warning = _interopRequireDefault(require("warning"));

var _constants = require("../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/* eslint-disable import/no-mutable-exports */
// This function will deliver an error message to the browser console about the removal of a property.

/* eslint-disable import/no-mutable-exports */
var isTriggerTabbable = function isTriggerTabbableFunction() {};

if (process.env.NODE_ENV !== 'production') {
  var hasWarned = {};

  isTriggerTabbable = function isTriggerTabbableFunction(COMPONENT, trigger, comment, silenceTriggerTabbableWarning) {
    var additionalComment = comment ? " ".concat(comment) : '';
    var childTabIndex = trigger.props.tabIndex;
    var elementIsTabbable = true;

    if ( // Silencing prop for special cases
    !silenceTriggerTabbableWarning && // List of "native" HTML elements that are tabbable by default
    trigger.type !== 'button' && trigger.type !== 'input' && trigger.type !== 'select' && trigger.type !== 'textarea' && trigger.type !== 'a' && // List of components that are tabbable by default
    trigger.type.displayName !== _constants.BUTTON && trigger.type.displayName !== _constants.BUTTON_STATEFUL && trigger.type.displayName !== _constants.BUTTON_GROUP && trigger.type.displayName !== _constants.CHECKBOX && trigger.type.displayName !== _constants.DATE_PICKER && trigger.type.displayName !== _constants.INPUT && trigger.type.displayName !== _constants.LOOKUP && trigger.type.displayName !== _constants.MENU_DROPDOWN && trigger.type.displayName !== _constants.TIME_PICKER) {
      // if it's not one of the above, then check to see if it has a tabIndex
      if (childTabIndex === '-1' || childTabIndex === undefined) {
        elementIsTabbable = false;

        if (!hasWarned[COMPONENT]) {
          /* eslint-disable max-len */
          (0, _warning.default)(elementIsTabbable, "[Design System React] The element that triggers ".concat(COMPONENT, " must be tabbable for keyboard users. Elements such as anchor, button, input or a DOM element with tabIndex=\"0\" specified are tabbable. ").concat(additionalComment));
          /* eslint-enable max-len */

          hasWarned[COMPONENT] = !!elementIsTabbable;
        }
      }
    }
  };
}

var _default = isTriggerTabbable;
exports.default = _default;