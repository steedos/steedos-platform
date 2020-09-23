"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodesBase = _interopRequireDefault(require("./nodes-base"));

var _nodesWithLargeDataset = _interopRequireDefault(require("./nodes-with-large-dataset"));

var _nodesWithInitialState = _interopRequireDefault(require("./nodes-with-initial-state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* Copyright (c) 2015-present, salesforce.com, inc. All rights reserved */

/* Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license */

/*
  Sample data for Tree component
    * base - Default node dataset
    * large - contains 300+ branches (~1000 nodes) to test performance
    * initialState - contains selection and expanded branches
 */
var sampleNodes = {
  base: _nodesBase.default,
  large: _nodesWithLargeDataset.default,
  initialState: _nodesWithInitialState.default
};
var _default = sampleNodes;
exports.default = _default;