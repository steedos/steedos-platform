"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = _interopRequireDefault(require("lodash.assign"));

var _keyCode = _interopRequireDefault(require("../../../utilities/key-code"));

var _keyCallbacks = _interopRequireDefault(require("../../../utilities/key-callbacks"));

var _event = _interopRequireDefault(require("../../../utilities/event"));

var _pill = _interopRequireDefault(require("../../../components/pill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var propTypes = {
  /**
   * Pill is the actively focused pill within a pill container. This will request focus on the DOM node.
   */
  active: _propTypes.default.bool,

  /**
   * **Assistive text for accessibility**
   * This object is merged with the default props object on every render.
   * * `pressDeleteOrBackspace`: Informs user of keyboard keys to press in order to remove a pill
   */
  assistiveText: _propTypes.default.shape({
    remove: _propTypes.default.string
  }),

  /**
   * SLDSAvatar component to show on the left of the pill.
   * _Tested with Mocha framework._
   */
  avatar: _propTypes.default.element,

  /**
   * Applies the bare style to the component.
   * _Tested with Mocha framework._
   */
  bare: _propTypes.default.bool,

  /*
   * Pills are often used for selection of a type of entity such as days in a daypicker. This prop allows you to pass in data that will be passed back to the event handler.
   */
  eventData: _propTypes.default.object,

  /*
   * Callbacks for various pill events such as click, focus, etc
   */
  events: _propTypes.default.shape({
    onClick: _propTypes.default.func,
    onFocus: _propTypes.default.func,
    onRequestFocus: _propTypes.default.func.isRequired,
    onRequestFocusOnNextPill: _propTypes.default.func.isRequired,
    onRequestFocusOnPreviousPill: _propTypes.default.func.isRequired,
    onRequestRemove: _propTypes.default.func.isRequired
  }),

  /**
   * Applies the error style to the component.
   * _Tested with Mocha framework._
   */
  hasError: _propTypes.default.bool,

  /*
   * The icon next to the pill label.
   */
  icon: _propTypes.default.element,

  /*
   * Pill Label
   */
  labels: _propTypes.default.shape({
    label: _propTypes.default.string.isRequired,
    removeTitle: _propTypes.default.string
  }),

  /*
   * If true and is active pill in listbox, will trigger `events.onRequestFocus`
   */
  requestFocus: _propTypes.default.bool,

  /*
   * Pill Title
   */
  title: _propTypes.default.string,

  /*
   * Allows the user to tab to the node
   */
  tabIndex: _propTypes.default.number
};
var defaultProps = {
  assistiveText: _propTypes.default.shape({
    remove: ', Press delete or backspace to remove'
  }),
  labels: {
    remove: 'Remove'
  },
  events: {}
};

var handleKeyDown = function handleKeyDown(event, _ref) {
  var _callbacks;

  var events = _ref.events,
      data = _ref.data;
  // Helper function that takes an object literal of callbacks that are triggered with a key event
  (0, _keyCallbacks.default)(event, {
    callbacks: (_callbacks = {}, _defineProperty(_callbacks, _keyCode.default.BACKSPACE, {
      callback: events.onRequestRemove,
      data: data
    }), _defineProperty(_callbacks, _keyCode.default.DELETE, {
      callback: events.onRequestRemove,
      data: data
    }), _defineProperty(_callbacks, _keyCode.default.LEFT, {
      callback: events.onRequestFocusOnPreviousPill,
      data: _objectSpread(_objectSpread({}, data), {}, {
        direction: 'previous'
      })
    }), _defineProperty(_callbacks, _keyCode.default.RIGHT, {
      callback: events.onRequestFocusOnNextPill,
      data: _objectSpread(_objectSpread({}, data), {}, {
        direction: 'next'
      })
    }), _callbacks)
  });
};

var handleClickRemove = function handleClickRemove(event, _ref2) {
  var events = _ref2.events,
      data = _ref2.data;

  _event.default.trap(event);

  events.onRequestRemove(event, data);
};

var Pill = function Pill(props) {
  var assistiveText = (0, _lodash.default)({}, defaultProps.assistiveText, props.assistiveText);
  var labels = (0, _lodash.default)({}, defaultProps.labels, props.labels);
  return /*#__PURE__*/_react.default.createElement(_pill.default, {
    avatar: props.avatar,
    bare: props.bare,
    hasError: props.hasError,
    tabIndex: props.tabIndex || '0',
    icon: props.icon,
    variant: "option",
    labels: labels,
    assistiveText: {
      remove: assistiveText.remove
    },
    "aria-selected": "true",
    onBlur: props.events.onBlur,
    onClick: typeof props.events.onClick === 'function' ? function (event) {
      if (props.events.onClick) {
        props.events.onClick(event, _objectSpread({}, props.eventData));
      }
    } : null,
    onFocus: function onFocus(event) {
      if (props.events.onFocus) {
        props.events.onFocus(event);
      }
    },
    onRemove: function onRemove(event) {
      _event.default.trap(event);

      handleClickRemove(event, {
        events: props.events,
        data: props.eventData
      });
    },
    onKeyDown: function onKeyDown(event) {
      handleKeyDown(event, {
        events: props.events,
        data: props.eventData
      });
    },
    ref: function ref(component) {
      if (props.requestFocus && props.active) {
        props.events.onRequestFocus(undefined, {
          ref: component
        });
      }
    }
  });
};

Pill.displayName = 'Pill';
Pill.propTypes = propTypes;
Pill.defaultProps = defaultProps;
var _default = Pill;
exports.default = _default;