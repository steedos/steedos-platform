"use strict";

require("./core.js")
require("./i18n")

var core = {}

core.app = require("./app");
core.odata = require("./odata/mongodb");
core.objects = require("./objects")

module.exports = core;