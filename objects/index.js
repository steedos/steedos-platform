var _objects = {}

var getObject = function(name) {
    return _objects[name]
}

// 需要实现 merge
var loadObject = function(name, obj) {
    _objects[name] = obj
}

var removeObject = function(name) {
    delete _objects[name]
}

module.exports = {
    _objects,
    getObject,
    loadObject,
    removeObject
}