"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFormProps;
var formPropsSet = new Set(['form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget']);

function getFormProps(props) {
  return Object.keys(props).reduce(function (prev, key) {
    if (formPropsSet.has(key)) {
      // eslint-disable-next-line no-param-reassign
      prev[key] = props[key];
    }

    return prev;
  }, {});
}