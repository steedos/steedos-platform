"use strict";

require("./core.js")
require("./i18n")
var path = require("path");

var core = {}

core.app = require("./app");
core.odata = require("./data/mongodb");
core.object = require("./objects")

core.init = function(){
    core.object.load(path.join(__dirname, 'objects/standard/spaces.yml'))
    core.object.load(path.join(__dirname, 'objects/standard/users.yml'))
    core.object.load(path.join(__dirname, 'objects/standard/organizations.yml'))
    core.object.load(path.join(__dirname, 'objects/standard/space_users.yml'))
    core.object.load(path.join(__dirname, 'objects/standard/apps.yml'))
}

module.exports = core;