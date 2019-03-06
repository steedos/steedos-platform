"use strict";

require("./i18n")

var core = {}

core.app = require("./app");
core.odata = require("./data/mongodb");
core.object = require("./objects")

core.init = function(){
    require('./objects/standard')
}

module.exports = core;