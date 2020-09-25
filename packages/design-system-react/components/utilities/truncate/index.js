"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var documentDefined = typeof document !== 'undefined';
var canvas;
var docFragment;
var canvasContext;

var measureWidth = function measureWidth() {};

if (documentDefined) {
  canvas = document.createElement('canvas');
  docFragment = document.createDocumentFragment();
  docFragment.appendChild(canvas);
  canvasContext = canvas.getContext('2d');
  measureWidth = (0, _lodash.default)(function (text, font) {
    canvasContext.font = font;
    return canvasContext.measureText(text).width;
  });
}

var TextTruncate = /*#__PURE__*/function (_React$Component) {
  _inherits(TextTruncate, _React$Component);

  var _super = _createSuper(TextTruncate);

  function TextTruncate() {
    var _this;

    _classCallCheck(this, TextTruncate);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "onResize", function () {
      _this.update(_this.props);
    });

    _defineProperty(_assertThisInitialized(_this), "getRenderText", function (ref, nextProps) {
      if (!ref) {
        return;
      }

      _this.scope = ref; // nextProps will be undefined for resize events, but will change if search or other props are changed

      var propsToRender;

      if (nextProps) {
        propsToRender = nextProps;
      } else {
        propsToRender = _this.props;
      }

      var _propsToRender = propsToRender,
          containerClassName = _propsToRender.containerClassName,
          line = _propsToRender.line,
          prefix = _propsToRender.prefix,
          suffix = _propsToRender.suffix,
          text = _propsToRender.text,
          textTruncateChild = _propsToRender.textTruncateChild,
          truncateText = _propsToRender.truncateText,
          wrapper = _propsToRender.wrapper,
          props = _objectWithoutProperties(_propsToRender, ["containerClassName", "line", "prefix", "suffix", "text", "textTruncateChild", "truncateText", "wrapper"]);

      var scopeWidth = _this.scope.getBoundingClientRect().width;

      var style = window.getComputedStyle(_this.scope);
      var font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family']].join(' '); // return if display:none

      if (scopeWidth === 0) {
        _this.setState({
          renderText: null
        });

        return;
      }

      var child;
      var outputText = text; // return if all of text can be displayed

      if (scopeWidth < measureWidth(text, font)) {
        var currentPos = 1;
        var maxTextLength = text.length;
        var truncatedText = '';
        var splitPos = 0;
        var startPos = 0;
        var displayLine = line;
        var width = 0;
        var lastIsEng = false;
        var lastSpaceIndex = -1; // eslint-disable-next-line fp/no-loops

        while (displayLine !== 0) {
          var ext = '';
          var extraWidthDueToPrefixStyle = 0;

          if (prefix && displayLine === line - 1) {
            ext += " ".concat(prefix); // MAGIC NUMBER: (width at letter-spacing of 0.25rems - width at normal) / number of letters

            extraWidthDueToPrefixStyle = prefix.length * 0.66;
          }

          if (!displayLine) {
            ext += truncateText;

            if (suffix) {
              ext += " ".concat(suffix);
            }
          } // eslint-disable-next-line fp/no-loops


          while (currentPos <= maxTextLength) {
            truncatedText = text.substr(startPos, currentPos);
            width = measureWidth(truncatedText + ext, font) + extraWidthDueToPrefixStyle;

            if (width < scopeWidth) {
              splitPos = text.indexOf(' ', currentPos + 1);

              if (splitPos === -1) {
                currentPos += 1;
                lastIsEng = false;
              } else {
                lastIsEng = true;
                currentPos = splitPos;
              }
            } else {
              var lastWidth = 0; // eslint-disable-next-line fp/no-loops

              do {
                currentPos -= 1;
                truncatedText = text.substr(startPos, currentPos);

                if (truncatedText[truncatedText.length - 1] === ' ') {
                  truncatedText = text.substr(startPos, currentPos - 1);
                }

                if (lastIsEng) {
                  lastSpaceIndex = truncatedText.lastIndexOf(' ');

                  if (lastSpaceIndex > -1) {
                    currentPos = lastSpaceIndex;
                    truncatedText = text.substr(startPos, currentPos);
                  }
                }

                width = measureWidth(truncatedText + ext, font) + extraWidthDueToPrefixStyle;

                if (width === lastWidth) {
                  currentPos = 0;
                  break;
                } else {
                  lastWidth = width;
                }
              } while (width >= scopeWidth);

              startPos += currentPos;
              break;
            }
          }

          if (currentPos >= maxTextLength) {
            startPos = maxTextLength;
            break;
          }

          displayLine -= 1; // iterate
        }

        if (startPos !== maxTextLength) {
          outputText = "".concat(text.substr(0, startPos)).concat(truncateText, " ");
          child = textTruncateChild;
        }
      }

      var renderText;

      if (wrapper) {
        renderText = wrapper(outputText, child);
      } else {
        renderText = /*#__PURE__*/_react.default.createElement("div", props, outputText, child);
      }

      _this.setState({
        renderText: renderText
      });
    });

    _defineProperty(_assertThisInitialized(_this), "update", function (nextProps) {
      _this.getRenderText(_this.scope, nextProps);
    });

    return _this;
  }

  _createClass(TextTruncate, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.onResize, false);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(nextProps) {
      if (nextProps.text !== this.props.text) {
        this.update(nextProps);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.onResize, false);
    }
  }, {
    key: "render",
    value: function render() {
      var containerClassName = this.props.containerClassName; // inline style override

      return /*#__PURE__*/_react.default.createElement("div", {
        ref: this.getRenderText,
        className: containerClassName,
        style: {
          overflow: 'hidden'
        }
      }, this.state.renderText);
    }
  }]);

  return TextTruncate;
}(_react.default.Component);

_defineProperty(TextTruncate, "displayName", 'TextTruncate');

_defineProperty(TextTruncate, "propTypes", {
  containerClassName: _propTypes.default.string,
  line: _propTypes.default.number,
  prefix: _propTypes.default.string,
  suffix: _propTypes.default.string,
  text: _propTypes.default.string,
  textTruncateChild: _propTypes.default.node,
  truncateText: _propTypes.default.string,
  wrapper: _propTypes.default.func
});

_defineProperty(TextTruncate, "defaultProps", {
  line: 1,
  text: '',
  truncateText: '…'
});

var _default = TextTruncate;
exports.default = _default;