"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _keyCode = _interopRequireDefault(require("./key-code"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */
// # Assistive Technology / Keyboard Navigable Trait for Dialogs with Tabbable content

/*
 * Guidelines for Popover
 *
 * - Focus is trapped. Tabbing to an index outside of the dialog is not allowed. Popover must be closed first via ESC.
 * - There should always be a focusable element inside, to place user focus on such as a close button
 * - Must be dismissible via ESC and a close button
 * - Uses tabIndex in wrapper and has tabbable items within it despite being outside document flow.
 * - Entire popover receives focus when opened and has a aria-labelledby that points to the header id, so it will read the heading,
 * - Must return focus to trigger after closing.
 * - F6 will allow the user to keep popover open and go back to tabbing in “app-context” instead of “dialog-context.” (not implemented, yet)
 */
// ## Dependencies
// ### React
// ### Event Helpers

/* eslint-disable react/no-find-dom-node */
var internalHandleClick = function internalHandleClick(_ref) {
  var trigger = _ref.trigger,
      eventTarget = _ref.eventTarget,
      handleClick = _ref.handleClick;

  if (trigger && _reactDom.default.findDOMNode(trigger) === eventTarget) {
    // eslint-disable-line react/no-find-dom-node
    handleClick(event);
  }
};

var KeyboardNavigableDialog = function KeyboardNavigableDialog(_ref2) {
  var isOpen = _ref2.isOpen,
      handleClick = _ref2.handleClick,
      keyCode = _ref2.keyCode,
      eventTarget = _ref2.eventTarget,
      trigger = _ref2.trigger,
      toggleOpen = _ref2.toggleOpen;

  switch (keyCode) {
    case _keyCode.default.ESCAPE:
      if (isOpen) {
        toggleOpen();
      }

      break;

    case _keyCode.default.ENTER:
      if (!isOpen) {
        internalHandleClick({
          trigger: trigger,
          eventTarget: eventTarget,
          handleClick: handleClick
        });
      }

      break;

    default:
      break;
  }
};

var _default = KeyboardNavigableDialog;
exports.default = _default;