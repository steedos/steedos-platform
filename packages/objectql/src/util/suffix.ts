/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-05-28 11:07:57
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-25 13:28:03
 * @Description: 
 */
const validator = require('validator');
const Future  = require('fibers/future');
//TODO 将此代码转移到license项目
const customObjectNameSuffix = '__c';
const customFieldNameSuffix = '__c';
declare var Steedos: any;

function wrapAsync(fn, context){
    let proxyFn = async function(_cb){
        let value = null;
        let error = null;
        try {
            value = await fn.apply({}, context)
        } catch (err) {
            error = err
        }
        _cb(error, value)
    }
    let fut = new Future();
    let callback = fut.resolver();
    let result = proxyFn.apply(this, [callback]);
    return fut ? fut.wait() : result;
}

function hasProductSync(productKey, spaceId){
    var options = wrapAsync(Steedos.hasProduct, [productKey, spaceId])
    return options;
}

function standardObject(spaceId){
    return validator.toBoolean(process.env.DEVELOPER_STANDARD_OBJECTS || 'false', true) && hasProductSync('platform-enterprise', spaceId);
}

export const getObjectSuffix = (spaceId: string, internal?: boolean)=>{
    if(internal){
        return customObjectNameSuffix
    }

    if(standardObject(spaceId)){
        return '';
    }
    return customObjectNameSuffix;
}

export const hasObjectSuffix = (objectName: string, spaceId: string, internal?: boolean)=>{
    let suffix = getObjectSuffix(spaceId, internal);
    if(!suffix){
        return false;
    }
    return objectName.endsWith(suffix);
}

export const _makeNewObjectName = (objectName: string, spaceId: string, oldObjectName?: string)=>{
    if(!oldObjectName){
        return `${objectName}${getObjectSuffix(spaceId)}`
    }else{
        if(oldObjectName.endsWith(customObjectNameSuffix)){
            if(!objectName.endsWith(customObjectNameSuffix)){
                return `${objectName}${customObjectNameSuffix}`
            }else{
                return `${objectName}`    
            }
        }else{
            return `${objectName}`
        }
    }
}

export const getFieldSuffix = (spaceId: string, internal?: boolean)=>{
    if(internal){
        return customFieldNameSuffix
    }
    if(standardObject(spaceId)){
        return '';
    }
    return customFieldNameSuffix;
}

export const hasFieldSuffix = (fieldName: string, spaceId: string, internal?: boolean)=>{
    let suffix = getFieldSuffix(spaceId, internal);
    if(!suffix){
        return false;
    }
    return fieldName.endsWith(suffix);
}

export const _makeNewFieldName = (fieldName: string, spaceId: string, oldFieldName?: string)=>{
    if(!oldFieldName){
        return `${fieldName}${getFieldSuffix(spaceId)}`
    }else{
        if(oldFieldName.endsWith(customFieldNameSuffix)){
            if(!fieldName.endsWith(customFieldNameSuffix)){
                return `${fieldName}${customFieldNameSuffix}`
            }else{
                return `${fieldName}` 
            }
        }else{
            return `${fieldName}`
        }
    }
}