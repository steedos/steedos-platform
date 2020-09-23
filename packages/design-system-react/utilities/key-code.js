"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyObjects = exports.default = void 0;
var keys = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  TAB: 9,
  DELETE: 46,
  BACKSPACE: 8
}; // Helpful for interaction/event tests. Use with simulate:
// `nodes.input.simulate('keyDown', keyObjects.DOWN);`

var keyObjects = {
  ENTER: {
    key: 'Enter',
    keyCode: keys.ENTER,
    which: keys.ENTER
  },
  ESCAPE: {
    key: 'Escape',
    keyCode: keys.ESCAPE,
    which: keys.ESCAPE
  },
  SPACE: {
    key: 'Space',
    keyCode: keys.SPACE,
    which: keys.SPACE
  },
  LEFT: {
    key: 'Left',
    keyCode: keys.LEFT,
    which: keys.LEFT
  },
  UP: {
    key: 'Up',
    keyCode: keys.UP,
    which: keys.ESCAPE
  },
  RIGHT: {
    key: 'Right',
    keyCode: keys.RIGHT,
    which: keys.RIGHT
  },
  DOWN: {
    key: 'Down',
    keyCode: keys.DOWN,
    which: keys.DOWN
  },
  TAB: {
    key: 'Tab',
    keyCode: keys.TAB,
    which: keys.TAB
  },
  DELETE: {
    key: 'Delete',
    keyCode: keys.DELETE,
    which: keys.DELETE
  },
  BACKSPACE: {
    key: 'Backspace',
    keyCode: keys.BACKSPACE,
    which: keys.BACKSPACE
  }
};
exports.keyObjects = keyObjects;
var _default = keys;
exports.default = _default;