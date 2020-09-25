"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable react/jsx-no-literals */
var sampleNodesDefault = {
  id: 0,
  nodes: [{
    label: 'Grains',
    type: 'item',
    id: 1
  }, {
    label: 'Fruits',
    type: 'branch',
    id: 2,
    nodes: [{
      assistiveText: 'Ground Fruits',
      label: /*#__PURE__*/_react.default.createElement("span", null, "Ground Fruits"),
      type: 'branch',
      id: 4,
      nodes: [{
        label: 'Watermelon',
        type: 'item',
        id: 12
      }, {
        label: 'Canteloupe',
        type: 'item',
        _iconClass: 'glyphicon-file',
        id: 13
      }, {
        label: 'Strawberries',
        type: 'item',
        id: 14
      }]
    }, {
      label: 'Tree Fruits',
      type: 'branch',
      id: 5,
      nodes: [{
        label: 'Peaches',
        type: 'item',
        id: 15
      }, {
        label: 'Pears',
        type: 'item',
        _iconClass: 'glyphicon-file',
        id: 16
      }, {
        label: 'Citrus',
        type: 'branch',
        id: 17,
        nodes: [{
          label: 'Orange',
          type: 'item',
          id: 20
        }, {
          label: 'Grapefruit',
          type: 'item',
          id: 21
        }, {
          label: 'Lemon',
          type: 'item',
          id: 22
        }, {
          label: 'Lime',
          type: 'item',
          id: 23
        }]
      }, {
        label: 'Apples',
        type: 'branch',
        id: 18,
        nodes: [{
          label: 'Granny Smith',
          type: 'item',
          id: 24
        }, {
          label: 'Pinklady',
          type: 'item',
          _iconClass: 'glyphicon-file',
          id: 25
        }, {
          label: 'Rotten',
          type: 'item',
          id: 26
        }, {
          label: 'Jonathan',
          type: 'item',
          id: 27
        }]
      }, {
        label: 'Cherries',
        type: 'branch',
        id: 19,
        nodes: [{
          label: 'Balaton',
          type: 'item',
          id: 28
        }, {
          label: 'Erdi Botermo',
          type: 'item',
          id: 29
        }, {
          label: 'Montmorency',
          type: 'item',
          id: 30
        }, {
          label: 'Queen Ann',
          type: 'item',
          id: 31
        }, {
          label: 'Ulster',
          type: 'item',
          id: 32
        }, {
          label: 'Viva',
          type: 'item',
          id: 33
        }]
      }, {
        label: 'Raspberries',
        type: 'item',
        id: 6
      }]
    }]
  }, {
    label: 'Nuts',
    type: 'branch',
    _iconClass: 'glyphicon-file',
    id: 3,
    nodes: [{
      label: 'Almonds',
      type: 'item',
      id: 8
    }, {
      label: 'Cashews',
      type: 'item',
      id: 9
    }, {
      label: 'Pecans',
      type: 'item',
      id: 10
    }, {
      label: 'Walnuts',
      type: 'item',
      id: 11
    }]
  }, {
    label: 'Empty folder',
    type: 'branch',
    id: 7
  }]
};
var _default = sampleNodesDefault;
exports.default = _default;