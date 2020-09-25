"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _item = _interopRequireDefault(require("./item"));

var _constants = require("../../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

/**
 * Component description.
 */
var List = /*#__PURE__*/function (_React$Component) {
  _inherits(List, _React$Component);

  var _super = _createSuper(List);

  function List() {
    _classCallCheck(this, List);

    return _super.apply(this, arguments);
  }

  _createClass(List, [{
    key: "render",
    value: function render() {
      var _this = this;

      var lengthClassName;
      var list;

      if (this.props.length) {
        lengthClassName = "slds-dropdown_length-".concat(this.props.length);
      }

      list = /*#__PURE__*/_react.default.createElement("ul", {
        "aria-labelledby": this.props.triggerId,
        className: (0, _classnames.default)('dropdown__list', lengthClassName, this.props.className),
        role: "menu"
      }, this.props.options.map(function (option, index) {
        var id = _this.props.getListItemId(index);

        var isSingleSelected = index === _this.props.selectedIndex;
        var isMultipleSelected = !!_this.props.selectedIndices && _this.props.selectedIndices.indexOf(index) !== -1;
        return /*#__PURE__*/_react.default.createElement(_item.default, _extends({}, option, {
          "aria-disabled": option.disabled,
          checkmark: _this.props.checkmark && (isSingleSelected || isMultipleSelected),
          data: option,
          id: id,
          index: index,
          isSelected: isSingleSelected || isMultipleSelected,
          key: "".concat(id, "-").concat(option.value),
          labelRenderer: _this.props.itemRenderer,
          onSelect: _this.props.onSelect,
          ref: function ref(listItem) {
            return _this.props.itemRefs(listItem, index);
          },
          tooltipTemplate: _this.props.tooltipMenuItem
        }));
      }));

      if (this.props.tooltipMenuItem) {
        /* eslint-disable react/no-danger */
        list = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("style", {
          dangerouslySetInnerHTML: {
            __html: ".slds-dropdown__item > .slds-tooltip-trigger > a {\n\tposition: relative;\n\tdisplay: -ms-flexbox;\n\tdisplay: flex;\n\t-ms-flex-pack: justify;\n\tjustify-content: space-between;\n\t-ms-flex-align: center;\n\talign-items: center;\n\tpadding: 0.5rem 0.75rem;\n\tcolor: #080707;\n\twhite-space: nowrap;\n\tcursor: pointer;\n}\n\n.slds-dropdown__item > .slds-tooltip-trigger > a:active {\n    text-decoration: none;\n    background-color: #ecebea;\n}\n\n.slds-dropdown__item > .slds-tooltip-trigger > a:hover,\n.slds-dropdown__item > .slds-tooltip-trigger > a:focus {\n    outline: 0;\n    text-decoration: none;\n    background-color: #f3f2f2;\n}\n"
          }
        }), list);
        /* eslint-enable react/no-danger */
      }

      return list;
    }
  }]);

  return List;
}(_react.default.Component);

_defineProperty(List, "displayName", _constants.LIST);

_defineProperty(List, "propTypes", {
  /**
   * Determines whether or not to show a checkmark for selected items.
   */
  checkmark: _propTypes.default.bool,

  /**
   * CSS classes to be added to `<ul />`.
   */
  className: _propTypes.default.string,

  /**
   * Used internally to determine the id that will be used for list items.
   */
  getListItemId: _propTypes.default.func,

  /**
   * Used internally to pass references to the individual menu items back up for focusing / scrolling.
   */
  itemRefs: _propTypes.default.func,

  /**
   * If provided, this function will be used to render the contents of each menu item.
   */
  itemRenderer: _propTypes.default.func,

  /**
   * Sets the height of the list based on the numeber of items.
   */
  length: _propTypes.default.oneOf([null, '5', '7', '10', 5, 7, 10]),

  /**
   * Triggered when a list item is selected (via mouse or keyboard).
   */
  onSelect: _propTypes.default.func,

  /**
   * An array of items to render in the list.
   */
  options: _propTypes.default.array,

  /**
   * The index of the currently selected item in the list.
   */
  selectedIndex: _propTypes.default.number,

  /**
   * Accepts a `Tooltip` component to be used as the template for menu item tooltips that appear via the `tooltipContent` options object attribute
   */
  tooltipMenuItem: _propTypes.default.node,

  /**
   * The id of the element which triggered this list (in a menu context).
   */
  triggerId: _propTypes.default.string
});

_defineProperty(List, "defaultProps", {
  length: '5',
  options: [],
  selectedIndex: -1
});

var _default = List;
exports.default = _default;