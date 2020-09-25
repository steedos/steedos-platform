"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _lodash = _interopRequireDefault(require("lodash.escaperegexp"));

var _keyCode = _interopRequireDefault(require("./key-code"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var keyboardNavigate = function keyboardNavigate(_ref) {
  var componentContext = _ref.componentContext,
      currentFocusedIndex = _ref.currentFocusedIndex,
      isOpen = _ref.isOpen,
      event = _ref.event,
      key = _ref.key,
      keyCode = _ref.keyCode,
      navigableItems = _ref.navigableItems,
      onFocus = _ref.onFocus,
      onSelect = _ref.onSelect,
      target = _ref.target,
      toggleOpen = _ref.toggleOpen;
  var indexes = navigableItems.indexes;
  var lastIndex = indexes.length - 1;
  var focusedIndex;
  var ch = key || String.fromCharCode(keyCode);

  if (/^[ -~]$/.test(ch)) {
    ch = ch.toLowerCase();
  } else {
    ch = null;
  }

  var openMenuKeys = keyCode === _keyCode.default.ENTER || keyCode === _keyCode.default.SPACE || keyCode === _keyCode.default.UP;

  if (keyCode === _keyCode.default.ESCAPE) {
    if (isOpen) toggleOpen();
  } else if (!isOpen) {
    var _indexes = _slicedToArray(indexes, 1);

    focusedIndex = _indexes[0];

    if (openMenuKeys || ch) {
      toggleOpen();
    }

    if (openMenuKeys && componentContext.trigger && // eslint-disable-next-line react/no-find-dom-node
    _reactDom.default.findDOMNode(componentContext.trigger) === target) {
      componentContext.handleClick(event);
    }
  } else if (keyCode === _keyCode.default.ENTER || keyCode === _keyCode.default.SPACE) {
    onSelect(currentFocusedIndex);
  } else {
    var navigableIndex = indexes.indexOf(currentFocusedIndex);

    if (keyCode === _keyCode.default.DOWN) {
      if (navigableIndex < lastIndex) {
        var newNavigableIndex = navigableIndex + 1;
        focusedIndex = indexes[newNavigableIndex];
      } else {
        var _indexes2 = _slicedToArray(indexes, 1);

        focusedIndex = _indexes2[0];
      }
    } else if (keyCode === _keyCode.default.UP) {
      if (navigableIndex > 0) {
        var _newNavigableIndex = navigableIndex - 1;

        focusedIndex = indexes[_newNavigableIndex];
      } else {
        focusedIndex = indexes[lastIndex];
      }
    } else if (ch) {
      // Combine subsequent keypresses
      var pattern = navigableItems.keyBuffer(ch);
      var consecutive = 0; // Support for navigating to the next option of the same letter with repeated presses of the same key

      if (pattern.length > 1 && new RegExp("^[".concat((0, _lodash.default)(ch), "]+$")).test(pattern)) {
        consecutive = pattern.length;
      }

      navigableItems.forEach(function (item) {
        if (focusedIndex === undefined && item.text.substr(0, pattern.length) === pattern || consecutive > 0 && item.text.substr(0, 1) === ch) {
          consecutive -= 1;
          focusedIndex = item.index;
        }
      });
    }
  }

  onFocus(focusedIndex);
  return focusedIndex;
};

var _default = keyboardNavigate;
exports.default = _default;