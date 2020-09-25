"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = textContent;

function textContentArray(child) {
  var text = [];

  if (typeof child === 'string' || typeof child === 'number') {
    // eslint-disable-next-line fp/no-mutating-methods
    text.push(child);
  } else if (Array.isArray(child)) {
    // eslint-disable-next-line fp/no-mutating-methods
    text.push(child.forEach(textContentArray));
  } else if (child && child.props) {
    var children = child.props.children; // eslint-disable-next-line fp/no-mutating-methods

    text.push(textContentArray(children));
  }

  return text;
}

function textContent(child) {
  return textContentArray(child).join('');
}