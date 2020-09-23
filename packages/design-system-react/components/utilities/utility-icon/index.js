"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _checkProps = _interopRequireDefault(require("./check-props"));

var _svg = _interopRequireDefault(require("./svg"));

var _utility = _interopRequireDefault(require("../../../icons/utility"));

var _action = _interopRequireDefault(require("../../../icons/action"));

var _custom = _interopRequireDefault(require("../../../icons/custom"));

var _doctype = _interopRequireDefault(require("../../../icons/doctype"));

var _standard = _interopRequireDefault(require("../../../icons/standard"));

var _UNSAFE_direction = require("../UNSAFE_direction");

var _languageDirection = _interopRequireDefault(require("../UNSAFE_direction/private/language-direction"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/*
 * If inline icons are present and icon bundle imports are not just an empty object, then inline icons will be used instead of external icons that require HTTP access.
 */
var UtilityIcon = function UtilityIcon(_ref, context) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? '' : _ref$name,
      assistiveText = _ref.assistiveText,
      category = _ref.category,
      icon = _ref.icon,
      path = _ref.path,
      direction = _ref.direction,
      rest = _objectWithoutProperties(_ref, ["name", "assistiveText", "category", "icon", "path", "direction"]);

  (0, _checkProps.default)('UtilityIcon', {
    name: name,
    category: category,
    path: path,
    context: context
  });
  var inlineIcons = {
    action: _action.default,
    custom: _custom.default,
    doctype: _doctype.default,
    standard: _standard.default,
    utility: _utility.default
  };
  var inlineData;

  if (icon) {
    // Use SVG data passed in with `icon` prop
    inlineData = icon;
  } else if (Object.keys(inlineIcons[category]).length) {
    // Use inline icon data if it exists. ENV variables will have to set to allow this.
    inlineData = inlineIcons[category][name.toLowerCase()];
    inlineData.viewBox = inlineIcons[category].viewBox;
  }

  var modifiedPath;

  if (path) {
    // Use `path` prop of Icon if present
    modifiedPath = path;
  } else if (context.onRequestIconPath) {
    modifiedPath = context.onRequestIconPath({
      category: category,
      name: name
    });
  } else if (context["".concat(category, "Sprite")]) {
    // Use category sprite file from IconSettings if present
    modifiedPath = "".concat(context["".concat(category, "Sprite")], "#").concat(name);
  } else {
    // Otherwise, use external URLs for icons
    var svgAssetName = direction === _UNSAFE_direction.DIRECTIONS.RTL ? 'symbols-rtl.svg' : 'symbols.svg';
    modifiedPath = context.iconPath && "".concat(context.iconPath, "/").concat(category, "-sprite/svg/").concat(svgAssetName, "#").concat(name);
  }

  return inlineData ? /*#__PURE__*/_react.default.createElement(_svg.default, _extends({
    data: inlineData,
    name: name
  }, rest)) : /*#__PURE__*/_react.default.createElement("svg", _extends({
    key: "".concat(name, "_").concat(category)
  }, rest), /*#__PURE__*/_react.default.createElement("use", {
    href: modifiedPath
  }));
};

UtilityIcon.displayName = 'UtilityIcon';
UtilityIcon.propTypes = {
  assistiveText: _propTypes.default.object,
  category: _propTypes.default.oneOf(['action', 'custom', 'doctype', 'standard', 'utility']),

  /**
   * An SVG object to use instead of name / category, look in `design-system-react/icons` for examples
   */
  icon: _propTypes.default.object,

  /**
   * Name of the icon. Visit <a href='http://www.lightningdesignsystem.com/resources/icons'>Lightning Design System Icons</a> to reference icon names.
   */
  name: _propTypes.default.string,

  /**
   * Path to the icon. This will override any global icon settings.
   */
  path: _propTypes.default.string
};
UtilityIcon.defaultProps = {
  category: 'utility'
};
UtilityIcon.contextTypes = {
  iconPath: _propTypes.default.string,
  onRequestIconPath: _propTypes.default.func,
  actionSprite: _propTypes.default.string,
  customSprite: _propTypes.default.string,
  doctypeSprite: _propTypes.default.string,
  standardSprite: _propTypes.default.string,
  utilitySprite: _propTypes.default.string
};

var _default = (0, _languageDirection.default)(UtilityIcon);

exports.default = _default;