"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getDataProps;

function getDataProps(props) {
  return Object.keys(props).reduce(function (prev, key) {
    if (key.substr(0, 5) === 'data-') {
      // eslint-disable-next-line no-param-reassign
      prev[key] = props[key];
    }

    return prev;
  }, {});
}