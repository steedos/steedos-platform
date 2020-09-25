"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ### classNames
// [github.com/JedWatson/classnames](https://github.com/JedWatson/classnames)
// This project uses `classnames`, "a simple javascript utility for conditionally
// joining classNames together."
// eslint-disable-next-line fp/no-rest-parameters
var classNamesWrapper = function classNamesWrapper() {
  var string = _classnames.default.apply(void 0, arguments);

  return string === '' ? undefined : string;
};

var _default = classNamesWrapper;
exports.default = _default;