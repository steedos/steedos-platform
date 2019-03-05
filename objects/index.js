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

var loadBaseObject = function(){
    require('./standard/users.js')
	require('./standard/spaces.js')
	require('./standard/organizations.js')
	require('./standard/space_users.js')
	require('./standard/apps.js')
}

module.exports = {
    _objects,
    getObject,
    loadObject,
    removeObject,
    loadBaseObject
}