export function getBaseDirectory(){
    //return require('app-root-path').path
    let cwd = process.cwd();
    if (cwd.indexOf('.meteor') > -1) {
        return cwd.split('.meteor')[0];
    }
    return cwd;
}

export function isObject(value) {
    return value != null && (typeof value === 'object' || typeof value === 'function');
}

export function isFunction(value) {
    return typeof value === 'function';
}

export function isPlainObject(value) {
    const isObjectObject = (o) => isObject(o) && Object.prototype.toString.call(o) === '[object Object]';
    if (!isObjectObject(value))
        return false;
    const ctor = value.constructor;
    if (!isFunction(ctor))
        return false;
    if (!isObjectObject(ctor.prototype))
        return false;
    if (!ctor.prototype.hasOwnProperty('isPrototypeOf'))
        return false;
    return true;
}

export function isJsonMap(value){
    return isPlainObject(value);
}