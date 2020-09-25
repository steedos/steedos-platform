"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAriaProps;

function getAriaProps(props) {
  return Object.keys(props).reduce(function (prev, key) {
    if (key.substr(0, 5) === 'aria-') {
      // eslint-disable-next-line no-param-reassign
      prev[key] = props[key];
    }

    return prev;
  }, {});
}