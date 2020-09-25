"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.propSets = exports.dropdownCollection = void 0;

var _react = _interopRequireDefault(require("react"));

var _icon = _interopRequireDefault(require("../../../components/icon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/jsx-no-literals */

/* eslint-disable react/prop-types */

/* eslint-disable react/display-name */
var dropdownCollection = [{
  label: 'Main action',
  value: '0',
  leftIcon: {
    category: 'utility',
    name: 'add'
  },
  href: 'http://www.google.com'
}, {
  label: 'Menu Header',
  type: 'header',
  divider: 'top'
}, {
  label: 'Menu Item One',
  value: '1',
  href: 'http://www.google.com'
}, {
  label: 'Menu Item Two',
  value: '2',
  href: 'http://www.google.com'
}, {
  label: 'Menu Item Three',
  value: '3',
  href: 'http://www.google.com'
}];
exports.dropdownCollection = dropdownCollection;
var propSets = {
  base: {
    props: {},
    primaryRegionProps: {
      appLauncher: {
        assistiveText: {
          trigger: 'Open App Launcher'
        },
        id: 'app-launcher-trigger',
        triggerName: 'App Name'
      }
    }
  },
  hybrid: {
    props: {
      homeActive: false,
      openOn: 'hybrid'
    },
    primaryRegionProps: {
      appLauncher: {
        assistiveText: {
          trigger: 'Open App Launcher'
        },
        id: 'app-launcher-trigger',
        triggerName: 'App Name'
      }
    }
  },
  customCloud: {
    props: {
      cloud: 'marketing'
    },
    primaryRegionProps: {
      dividerPosition: 'right',
      truncate: false,
      appLauncher: {
        assistiveText: {
          trigger: 'Open App Launcher'
        },
        id: 'app-launcher-trigger',
        noTruncate: true,
        triggerName: /*#__PURE__*/_react.default.createElement("div", {
          className: "slds-grid slds-grid_align-spread"
        }, /*#__PURE__*/_react.default.createElement("div", null, "Marketing Cloud"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_icon.default, {
          category: "utility",
          className: "slds-m-left_small slds-m-right_small",
          name: "email",
          size: "x-small"
        }), /*#__PURE__*/_react.default.createElement("span", {
          className: "context-bar__label-action slds-text-body_regular",
          style: {
            fontWeight: 'normal'
          }
        }, "Email Studio")))
      }
    }
  },
  lightTheme: {
    props: {
      theme: 'light'
    }
  },
  noNav: {
    props: {},
    primaryRegionProps: {
      appLauncher: {
        assistiveText: {
          trigger: 'Open App Launcher'
        },
        id: 'app-launcher-trigger',
        triggerName: 'App Name'
      }
    }
  }
};
exports.propSets = propSets;