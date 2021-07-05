import { SteedosMetadataTypeInfoKeys, getMetadataTypeInfo, getMetadataTypeInfos }  from './typeInfo'
const _ = require('underscore');

export function getMetadataName(collectionName, predicate?){
    if(collectionName === 'profiles'){
        return getMetadataTypeInfo(SteedosMetadataTypeInfoKeys.Profile)?.metadataName;
    }
    const metadataInfos = getMetadataTypeInfos();
    var metadataInfo = _.find(metadataInfos, function(_metadataInfo){ 
        if(predicate ){
            if(!_.isFunciton(predicate)){
                throw new Error('predicate must be Function.');
            }
            return _metadataInfo.tableName == collectionName && predicate(_metadataInfo);
        }else{
            return _metadataInfo.tableName == collectionName;
        }
    });
    return metadataInfo?.metadataName
}

export function getCollectionNameByMetadata(metadataName){
    return getMetadataTypeInfo(metadataName)?.tableName;
}