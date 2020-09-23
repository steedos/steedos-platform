"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _icon = _interopRequireDefault(require("../../icon"));

var _itemLabel = _interopRequireDefault(require("./item-label"));

var _event = _interopRequireDefault(require("../../../utilities/event"));

var _constants = require("../../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
var ListItem = /*#__PURE__*/function (_React$Component) {
  _inherits(ListItem, _React$Component);

  var _super = _createSuper(ListItem);

  function ListItem() {
    var _this;

    _classCallCheck(this, ListItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "getLabel", function () {
      var Label = _this.props.labelRenderer;
      return /*#__PURE__*/_react.default.createElement(Label, {
        checkmark: _this.props.checkmark,
        data: _this.props.data,
        icon: _this.getIcon('left'),
        index: _this.props.index,
        inverted: _this.props.inverted,
        isSelected: _this.props.isSelected,
        label: _this.props.label,
        value: _this.props.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getIcon", function (position) {
      var classnames = ['slds-icon-text-default'];

      var iconProps = _this.props["".concat(position, "Icon")];

      if (position === 'left') {
        if (_this.props.checkmark) {
          // eslint-disable-next-line fp/no-mutating-methods
          classnames.push('slds-icon_selected');
          iconProps = {
            category: 'utility',
            name: 'check'
          };
        } // eslint-disable-next-line fp/no-mutating-methods


        classnames.push('slds-m-right_x-small');
      } else {
        // eslint-disable-next-line fp/no-mutating-methods
        classnames.push('slds-m-left_small');
      }

      if (iconProps) {
        return /*#__PURE__*/_react.default.createElement(_icon.default, _extends({
          className: (0, _classnames.default)(classnames),
          position: position,
          size: "x-small"
        }, iconProps));
      }

      return null;
    });

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (event) {
      if (_this.props.type !== 'link' || _this.props.href === 'javascript:void(0);' // eslint-disable-line no-script-url
      ) {
          // eslint-disable-line no-script-url
          _event.default.trapImmediate(event);
        }

      if (_this.props.onSelect) {
        _this.props.onSelect(_this.props.index);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleMouseDown", function (event) {
      _event.default.trapImmediate(event);
    });

    return _this;
  }

  _createClass(ListItem, [{
    key: "render",
    value: function render() {
      switch (this.props.type) {
        case 'header':
          {
            return /*#__PURE__*/_react.default.createElement("li", {
              className: (0, _classnames.default)('slds-dropdown__header', {
                'slds-has-divider_top-space': this.props.divider === 'top',
                'slds-has-divider_bottom-space': this.props.divider === 'bottom'
              }, this.props.className),
              onMouseDown: this.handleMouseDown,
              role: "separator"
            }, /*#__PURE__*/_react.default.createElement("span", null, this.props.label));
          }

        case 'divider':
          {
            return /*#__PURE__*/_react.default.createElement("li", {
              className: (0, _classnames.default)('slds-has-divider', this.props.className),
              onMouseDown: this.handleMouseDown,
              role: "separator"
            });
          }

        case 'link':
        case 'item':
        default:
          {
            /* eslint-disable jsx-a11y/role-supports-aria-props */
            var itemContents = /*#__PURE__*/_react.default.createElement("a", {
              "aria-checked": this.props.checkmark && this.props.isSelected,
              "aria-disabled": this.props['aria-disabled'],
              href: this.props.href,
              "data-index": this.props.index,
              onClick: this.handleClick,
              role: this.props.checkmark ? 'menuitemcheckbox' : 'menuitem',
              tabIndex: "-1"
            }, this.getLabel(), this.getIcon('right'));

            if (this.props.tooltipContent && this.props.tooltipTemplate) {
              var tooltipTemplateProps = _extends({}, this.props.tooltipTemplate.props);

              var tooltipProps = _objectSpread(_objectSpread({}, tooltipTemplateProps), {}, {
                content: this.props.tooltipContent,
                id: "".concat(this.props.id, "-tooltip"),
                triggerStyle: _objectSpread({
                  width: '100%'
                }, tooltipTemplateProps.triggerStyle || {})
              });

              itemContents = /*#__PURE__*/_react.default.cloneElement(this.props.tooltipTemplate, tooltipProps, itemContents);
            }

            return (
              /*#__PURE__*/

              /* eslint-disable jsx-a11y/role-supports-aria-props */
              // disabled eslint, but using aria-selected on presentation role seems suspicious...
              _react.default.createElement("li", {
                "aria-selected": this.props.checkmark === null ? this.props.isSelected : null,
                className: (0, _classnames.default)('slds-dropdown__item', {
                  'slds-is-selected': this.props.isSelected
                }, this.props.className),
                id: this.props.id,
                onMouseDown: this.handleMouseDown,
                role: "presentation"
              }, itemContents)
            );
          }
      }
    }
  }]);

  return ListItem;
}(_react.default.Component);

_defineProperty(ListItem, "displayName", _constants.LIST_ITEM);

_defineProperty(ListItem, "propTypes", {
  'aria-disabled': _propTypes.default.bool,
  className: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object, _propTypes.default.string]),
  checkmark: _propTypes.default.bool,
  data: _propTypes.default.object,
  divider: _propTypes.default.oneOf(['top', 'bottom']),
  href: _propTypes.default.string,
  id: _propTypes.default.string.isRequired,
  index: _propTypes.default.number.isRequired,
  inverted: _propTypes.default.bool,
  isSelected: _propTypes.default.bool,
  label: _propTypes.default.string,
  labelRenderer: _propTypes.default.func,
  leftIcon: _propTypes.default.shape({
    category: _propTypes.default.string,
    name: _propTypes.default.string
  }),
  onSelect: _propTypes.default.func.isRequired,
  rightIcon: _propTypes.default.shape({
    category: _propTypes.default.string,
    name: _propTypes.default.string
  }),
  tooltipContent: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.string]),
  tooltipTemplate: _propTypes.default.node,
  type: _propTypes.default.string,
  value: _propTypes.default.any
});

_defineProperty(ListItem, "defaultProps", {
  data: {},
  href: 'javascript:void(0);',
  // eslint-disable-line no-script-url
  inverted: false,
  isSelected: false,
  label: '',
  labelRenderer: _itemLabel.default,
  value: null
});

var _default = ListItem;
exports.default = _default;