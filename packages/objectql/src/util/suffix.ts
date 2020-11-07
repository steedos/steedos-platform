const customObjectNameSuffix = '__c';
const customFieldNameSuffix = '__c';
declare var Steedos: any;

export const getObjectSuffix = (spaceId: string)=>{
    if(Steedos.hasFeature('standard_object', spaceId)){
        return '';
    }
    return customObjectNameSuffix;
}

export const hasObjectSuffix = (objectName: string, spaceId: string)=>{
    let suffix = getObjectSuffix(spaceId);
    if(!suffix){
        return false;
    }
    return objectName.endsWith(suffix);
}

export const getFieldSuffix = (spaceId: string)=>{
    if(Steedos.hasFeature('standard_object', spaceId)){
        return '';
    }
    return customFieldNameSuffix;
}

export const hasFieldSuffix = (fieldName: string, spaceId: string)=>{
    let suffix = getFieldSuffix(spaceId);
    if(!suffix){
        return false;
    }
    return fieldName.endsWith(suffix);
}