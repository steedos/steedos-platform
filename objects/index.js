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

}

// 需要实现 merge
var load = function(path) {
    // read yml
    _objects[name] = loadFile(path)
}

var remove = function(name) {
    delete _objects[name]
}

module.exports = {
    get,
    load,
    remove
}