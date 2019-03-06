const fs = require("fs");
const path = require("path");
const yaml = require('js-yaml');

var _objects = {}

var loadJSONFile = (filePath)=>{
    return JSON.parse(fs.readFileSync(filePath, 'utf8').normalize('NFC'));
}

var loadYmlFile = (filePath)=>{
    return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
}
var loadFile = (filePath)=>{
    try {
        let extname = path.extname(filePath);
        if(extname.toLocaleLowerCase() == '.json')
            return loadJSONFile(filePath);
        else if(extname.toLocaleLowerCase() == '.yml')
            return loadYmlFile(filePath);
    } catch (error) {
        console.error('loadFile error', filePath, error);
        return {}
    }
}

var get = function(name) {
    return _objects[name]
}

var getAll = function(){
    return _objects
}

// 需要实现 merge
var load = function(path) {
    // read yml
    var obj = loadFile(path);
    _objects[obj.name] = obj
}

var remove = function(name) {
    delete _objects[name]
}


module.exports = {
    get,
    getAll,
    load,
    remove
}

