const path = require(`path`);

function getPackageRelativePath(from, to){
    const rPath = path.relative(from, to);
    return rPath.split(path.sep).join('/');
}

module.exports = {
    getPackageRelativePath
}