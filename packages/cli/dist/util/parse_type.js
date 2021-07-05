"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.folderName2FileName = exports.fileName2FolderName = exports.isOtherTypes = exports.isObjectProperty = exports.getOtherTypes = exports.getObjectProperties = exports.getAllTypes = exports.getAllTypesForHelp = void 0;
const _ = require('underscore');
const types = [
    {
        filename: 'object',
        foldername: 'objects',
        is_object_property: false
    },
    {
        filename: 'field',
        foldername: 'fields',
        is_object_property: true
    },
    {
        filename: 'button',
        foldername: 'buttons',
        is_object_property: true
    },
    {
        filename: 'listview',
        foldername: 'listviews',
        is_object_property: true
    },
    {
        filename: 'permission',
        foldername: 'permissions',
        is_object_property: true
    },
    {
        filename: 'validationRule',
        foldername: 'validationRules',
        is_object_property: true
    },
    {
        filename: 'layout',
        foldername: 'layouts',
        is_object_property: false
    },
    {
        filename: 'permissionset',
        foldername: 'permissionsets',
        is_object_property: false
    },
    {
        filename: 'app',
        foldername: 'applications',
        is_object_property: false
    },
    {
        filename: 'profile',
        foldername: 'profiles',
        is_object_property: false
    },
    {
        filename: 'workflow',
        foldername: 'workflows',
        is_object_property: false
    },
];
function getAllTypesForHelp() {
    var res = _.pluck(types, "filename");
    for (var i = 0; i < res.length; i++) {
        var item = res[i];
        item = item.substring(0, 1).toUpperCase() + item.substring(1);
        res[i] = item;
    }
    return res;
}
exports.getAllTypesForHelp = getAllTypesForHelp;
function getAllTypes() {
    return _.pluck(types, "filename");
}
exports.getAllTypes = getAllTypes;
function getObjectProperties() {
    return _.pluck(_.where(types, { is_object_property: true }), "filename");
}
exports.getObjectProperties = getObjectProperties;
function getOtherTypes() {
    return _.pluck(_.where(types, { is_object_property: false }), "filename");
}
exports.getOtherTypes = getOtherTypes;
function isObjectProperty(input) {
    var objectProperties = _.pluck(_.where(types, { is_object_property: true }), "filename");
    if (objectProperties.indexOf(input) != -1) {
        return true;
    }
    objectProperties = _.pluck(_.where(types, { is_object_property: true }), "foldername");
    if (objectProperties.indexOf(input) != -1) {
        return true;
    }
    return false;
}
exports.isObjectProperty = isObjectProperty;
function isOtherTypes(input) {
    var otherTypes = _.pluck(_.where(types, { is_object_property: false }), "filename");
    if (otherTypes.indexOf(input) != -1) {
        return true;
    }
    otherTypes = _.pluck(_.where(types, { is_object_property: false }), "foldername");
    if (otherTypes.indexOf(input) != -1) {
        return true;
    }
    return false;
}
exports.isOtherTypes = isOtherTypes;
function fileName2FolderName(input) {
    return doParse(input, "filename", "foldername");
}
exports.fileName2FolderName = fileName2FolderName;
function folderName2FileName(input) {
    return doParse(input, "foldername", "filename");
}
exports.folderName2FileName = folderName2FileName;
function doParse(input, inputType, outputType) {
    for (var i = 0; i < types.length; i++) {
        var item = types[i];
        if (item[inputType] == input) {
            return item[outputType];
        }
    }
    return null;
}
//# sourceMappingURL=parse_type.js.map