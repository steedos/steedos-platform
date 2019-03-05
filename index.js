"use strict";

var core = {}

core.app = require("./app");
core.odata = require("./odata/mongodb");
core.objects = require("./objects")

module.exports = core;