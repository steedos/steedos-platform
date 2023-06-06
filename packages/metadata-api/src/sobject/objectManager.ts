import { getOriginalObjectConfig, getOriginalObjectConfigs } from '@steedos/metadata-registrar'
import * as _ from 'underscore'

const noUseFields = ['created_by', 'modified_by', 'company_id', 'company_ids', 'owner'];
export function getLookupFields(mainObjectName) {
    var res:any = [];
    const objectFields = getOriginalObjectFieldsConfig(mainObjectName);

    for(const fieldName in objectFields){
        if(!_.contains(noUseFields, fieldName)){
            
            var objectField = objectFields[fieldName];
            if(objectField){
                if(objectField.type == 'lookup'){
                    if(typeof objectField.reference_to == 'function'){
                        continue;
                    }
                    var item = {
                        fieldName:fieldName,
                        collectionName: objectField.reference_to,
                        reference_to_field: objectField.reference_to_field ? objectField.reference_to_field : "_id"
                    }
                    res.push(item);
                }
            }
        }
    }
    return res;
}

export function getMasterDetailObjects(mainObjectName) {
    var res:any = [];
    const originalObjectConfigs = getAllOriginalObjectConfigs();

    for(const config of originalObjectConfigs){
        const objectName = config.name;
        const objectFields = config.fields;
        for(const fieldName in objectFields){
            var objectField = objectFields[fieldName];
            if(objectField){
                if(objectField.type == 'master_detail' && objectField.reference_to == mainObjectName){
                    var item = {
                        fieldName:fieldName,
                        collectionName: objectName,
                        reference_to_field: objectField.reference_to_field ? objectField.reference_to_field : "_id"
                    }
                    res.push(item);
                }
            }
        }
    }
    return res;
}

export function getAllOriginalObjectConfigs() {
    return getOriginalObjectConfigs('') || [];
}

// export function getObjectFieldsByType(objectName, fieldType) {
//     const objectFields = getOriginalObjectFieldsConfig(objectName);
//     return _.filter(objectFields, function(field:any){
//         return field.type == fieldType;
//     });
// }

function getOriginalObjectFieldsConfig(objectName) {
    var originalObjectConfig = getOriginalObjectConfig(objectName);
    if(!originalObjectConfig){
        throw new Error('The requested resource does not exist: '+objectName);
    }
    return originalObjectConfig.fields || {};
}

export function isLookup(mainObjectName, relCollectionName, relationName){
    const objectFields = getOriginalObjectFieldsConfig(mainObjectName);

    var objectField = objectFields[relationName];
    if(objectField){
        if(objectField.type == 'lookup' && objectField.reference_to == relCollectionName){
            return objectField.reference_to_field;
        }
    }
    return;
}

export function isMasterDetail(mainObjectName, relCollectionName, relationName){
    const objectFields = getOriginalObjectFieldsConfig(relCollectionName);

    var objectField = objectFields[relationName];
    if(objectField){
        if(objectField.type == 'master_detail' && objectField.reference_to == mainObjectName){
            return objectField.reference_to_field;
        }
    }

    return;
}

export function parseFieldType(objectName, record){
    const objectFields = getOriginalObjectFieldsConfig(objectName);

    for(const fieldName in objectFields){
        var objectField = objectFields[fieldName];
        if(objectField){
            if(objectField.type == 'date'){
                record[fieldName] = new Date(record[fieldName]);

            }else if(objectField.type == 'formula' || objectField.type == 'summary' ){
                if(objectField.data_type == 'date'){
                    record[fieldName] = new Date(record[fieldName]);
                }
            }
        }
    }
}