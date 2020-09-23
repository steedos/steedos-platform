"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyObjects = exports.default = void 0;
var keys = {}; // Helpful for interaction/event tests. Use with simulate:
// `nodes.input.simulate('keyDown', keyObjects.DOWN);`

var keyObjects = {}; // eslint-disable-next-line fp/no-loops

exports.keyObjects = keyObjects;

for (var i = 65; i <= 122; i += 1) {
  keys[String.fromCharCode(i)] = i;
  keyObjects["".concat(String.fromCharCode(i))] = {
    key: "".concat(String.fromCharCode(i)),
    keyCode: i,
    which: i
  };
}

var _default = keys;
exports.default = _default;