const _ = require('underscore')

import { property } from 'underscore';
import { deleteCommonAttribute } from '../util/attributeUtil'
import { getLookupFields, getMasterDetailObjects, isLookup, isMasterDetail, parseFieldType } from './objectManager'

const ROLLBACK_MSG = 'Record rolled back because not all records were valid and the request was using AllOrNone header';
const ROLLBACK_STATUS_CODE = "ALL_OR_NONE_OPERATION_ROLLED_BACK";
const DUPLICATE_MSG = 'Duplicate ReferenceId provided in the request. Use one of these records?';
const DUPLICATE_STATUS_CODE = "DUPLICATES_DETECTED";
const MALFORMED_ID_MSG = ': id value of incorrect type: ';
const MALFORMED_ID_CODE = "MALFORMED_ID";

export async function getObjectsByIdsAndFields(dbManager, SObjectName, ids, fields, recordsCount?, showLog?){

    var projection;
    if(fields && fields.length>0){
        projection = {_id:1}
        for(var i=0; i<fields.length; i++){
            const field = fields[i]
            projection[field] = 1;
        }
    }
    
    var objects:any = [];
    if(ids && ids.length>0){
        for(const id of ids){
            var filter = {_id: id};
            var object = await dbManager.findOneWithProjection(SObjectName, filter, projection);
            objects.push(object);
        }
        
    }else{

        objects = await dbManager.findWithProjection(SObjectName, {}, projection, true, recordsCount);
        
    }

    var tools = {
        dbManager,
        referenceIdMap: {},
        subNamesMap: {}
    };
    await fillSubRecords(tools, objects, SObjectName, showLog);

    var res = {records: objects};
    return res;
}

async function fillSubRecords(tools, objects:any[], SObjectName, showLog?){

    var subNames = await getSubNames(tools, SObjectName);

    for(var i=0; i<objects.length; i++){
        var object = objects[i];
        if(!object){
            continue;
        }
        if(showLog){
            console.log(SObjectName, (i+1), object._id);
        }
        objects[i] = await fillSubRecord(tools, subNames, object, SObjectName);
    }

}

async function getSubNames(tools, SObjectName){

    var subNamesMap = tools.subNamesMap;
    if(subNamesMap[SObjectName]){
        return subNamesMap[SObjectName];
    }
    var masterDetailCollectionNames = await getMasterDetailObjects(SObjectName);
    var lookupCollectionNames = await getLookupFields(SObjectName);

    var subNames = {
        masterDetailCollectionNames,
        lookupCollectionNames
    }
    subNamesMap[SObjectName] = subNames;
    return subNames;
} 
async function fillSubRecord(tools:any, subNames:any, object:any, collectionName){

    var isDuplicate = await generateObjectAttributes(tools, object, collectionName);
    if(!isDuplicate){
        await fillMasterDetailRecord(tools, subNames.masterDetailCollectionNames, object);
        await fillLookupRecord(tools, subNames.lookupCollectionNames, object);
    }
    deleteCommonAttribute(object);
    delete object._id;object

    return object;
}
async function fillMasterDetailRecord(tools, masterDetailCollectionNames, object){

    for(let i=0; i<masterDetailCollectionNames.length; i++){
        const item = masterDetailCollectionNames[i];
        const fieldName = item['fieldName']
        const collectionName = item['collectionName']
        const reference_to_field = item['reference_to_field']
        
        var filter = {}
        filter[fieldName] = object[reference_to_field];
        var masterDetailRecords = await tools.dbManager.find(collectionName, filter);

        var subNames = await getSubNames(tools, collectionName);

        for(let j=0; j<masterDetailRecords.length; j++){
            
            masterDetailRecords[j] = await fillSubRecord(tools, subNames, masterDetailRecords[j], collectionName);
            
            let masterDetailRecord = masterDetailRecords[j];
            deleteCommonAttribute(masterDetailRecord);
            delete masterDetailRecord._id;
            delete masterDetailRecord[fieldName];
        }

        if(!fieldName){
            console.log();
        }
        object[collectionName+'.'+fieldName+'__r'] = {};
        object[collectionName+'.'+fieldName+'__r']['records'] = masterDetailRecords;
    }

}

async function fillLookupRecord(tools, lookupCollectionNames, object:any){

    for(let i=0; i<lookupCollectionNames.length; i++){
        const item = lookupCollectionNames[i];
        const fieldName = item['fieldName']
        const collectionName = item['collectionName']
        const reference_to_field = item['reference_to_field']

        var filter = {}
        filter[reference_to_field] = object[fieldName];
        var lookupRecords = await tools.dbManager.find(collectionName, filter);
        
        var subNames = await getSubNames(tools, collectionName);

        for(let j=0; j<lookupRecords.length; j++){
            
            lookupRecords[j] = await fillSubRecord(tools, subNames, lookupRecords[j], collectionName);
            
            let lookupRecord = lookupRecords[j];
            deleteCommonAttribute(lookupRecord);
            delete lookupRecord._id;
            delete object[fieldName];
        }

        if(!fieldName){
            console.log();
        }
        object[collectionName+'.'+fieldName+'__r'] = {}
        object[collectionName+'.'+fieldName+'__r']['records'] = lookupRecords;
    }

}

function generateObjectAttributes(tools, object, collectionName){

    var referenceIdMap = tools.referenceIdMap

    if(!referenceIdMap[collectionName]){
        referenceIdMap[collectionName] = [];
    }
    var objectIdList = referenceIdMap[collectionName];
    var objectId = collectionName+object._id
    
    var count = objectIdList.length+1;
    var attributes = {
        type: collectionName,
        referenceId: collectionName+'Ref'+ count,
        // url: ''
    };
    object['attributes'] = attributes;

    if(_.contains(objectIdList, objectId)){
        attributes['isDuplicate'] = true;
        attributes['referenceId'] = collectionName+'Ref'+(_.indexOf(objectIdList, objectId)+1)
        return true;
    }
    objectIdList.push(objectId);
    return false;
}

export async function insertObjectsToDB(dbManager, records, allOrNone){
    
    const transactionOptions:any = {
        readPreference: 'primary',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority' }
    };
    var session = await dbManager.startSession();
    
    var insertResults:any = [];

    var referenceIdMap = {};
    try {
        await session.withTransaction(async () => {
            // try{
                await insertRecords(dbManager, records, insertResults, referenceIdMap, allOrNone);
            // }catch(err){
            //     console.error(err);
            // }
        }, transactionOptions);
        // session.commitTransaction();
    } catch(err) {
        if(err.message.startsWith('The requested resource does not exist:')){
            throw err;
        }
        console.log(err);
        // session.abortTransaction();
    }finally{
        await dbManager.endSession();
    }
    return insertResults;
}
async function insertRecords(dbManager, records, insertResults, referenceIdMap, allOrNone=false){
    try{
        for(var i=0; i<records.length; i++){
            var record = records[i];
            await insertRecord(dbManager, record, insertResults, referenceIdMap, allOrNone);
        }

        await updateReferenceId(dbManager, records, referenceIdMap, insertResults);
    }catch(error){
        updateInsertResults(insertResults);
        throw error;
    }
}
function updateInsertResults(insertResults){
    for(var i=0; i<insertResults.length; i++){
        let insertResult = insertResults[i];
        if(insertResult['success']){
            delete insertResult.id;
            insertResult['success'] = false;
            insertResult['errors'].push(ROLLBACK_MSG);
            insertResult['statusCode'] = ROLLBACK_STATUS_CODE;
        }
    }
}

//不使用-p时,只有最外层在循环引用时,有可能有未填写的id; -p时,更新所有
async function updateReferenceId(dbManager, records, referenceIdMap, insertResults){
    
    for(var i=0; i<records.length; i++){
        var record = records[i];
        var attributes = record.attributes;
        var collectionName = attributes.type;

        for(const propertyName in record){
            var property = record[propertyName];
            if(typeof(property) == 'string' && property.startsWith('@')){
                let referenceId = property.substring(1);
                
                let relCollectionName = _.first(referenceId.split('Ref'));
                let relationName = propertyName;
                const _isMasterDetail = isMasterDetail(relCollectionName, collectionName, relationName);
                const _isLookup = isLookup(relCollectionName, collectionName, relationName);

                if(!referenceIdMap[referenceId]){
                    var insertResult = insertResults[i]
                    delete insertResult.id;
                    insertResult['success'] = false;
                    insertResult['errors'].push(collectionName+MALFORMED_ID_MSG+property);
                    insertResult['statusCode'] = MALFORMED_ID_CODE;
                    
                    throw new Error('MALFORMED_ID');
                }
                if(_isMasterDetail){
                    let masterRecordId = referenceIdMap[referenceId];

                    let recordId = referenceIdMap[attributes.referenceId];
                    let filter = {_id: recordId}
                    var dbRecord = await dbManager.findOne(collectionName, filter);
                    dbRecord[relationName] = masterRecordId;
                    await dbManager.update(collectionName, filter, dbRecord);
                }
                if(_isLookup){
                    let relRecordId = referenceIdMap[referenceId];
                    let filter = {_id: relRecordId}
                    var dbRecord = await dbManager.findOne(relCollectionName, filter);
                    dbRecord[relationName] = referenceIdMap[attributes.referenceId];
                    await dbManager.update(relCollectionName, filter, dbRecord);
                }

                delete record.propertyName;
            }
        }

        
    }
}

async function insertRecord(dbManager, record, insertResults, referenceIdMap, allOrNone=false, recursion=false){
    var errors: any[] = [];
    var insertResult = {
        success: true,
        errors: errors,
    }

    var unset = {};
    unset['attributes'] = null
           
    try {
        var attributes = record.attributes;
        var referenceId = attributes.referenceId;
        var collectionName = attributes.type;

        // delete record.attributes; //最后update时再统一删除这个属性
        insertResult['referenceId'] = referenceId;
   
        var relationMap = {};
        for(const propertyName in record){
            if(propertyName.endsWith('__r') ){
                relationMap[propertyName] = record[propertyName];
                delete record[propertyName];
            }
        }
        if(!attributes.isDuplicate){
            parseFieldType(collectionName, record);
            await dbManager.insert(collectionName, record);
        }
        
        for(const propertyName in relationMap){
            var subRecords = relationMap[propertyName]['records'];
            if(!subRecords || subRecords.length == 0){
                continue;
            }
            let relationName = propertyName.substring(0, propertyName.length-3);
            let relCollectionName = _.first(relationName.split('.'));
            relationName = _.last(relationName.split('.'));
            var _isMasterDetail = isMasterDetail(collectionName, relCollectionName, relationName);
            var _isLookup = isLookup(collectionName, relCollectionName, relationName);
            
            for(let j=0; j<subRecords.length; j++){

                var subRecord = subRecords[j];
                if(_isMasterDetail){
                    subRecord[relationName] = record[_isMasterDetail];
                }
                await insertRecord(dbManager, subRecord, insertResults, referenceIdMap, allOrNone, true);
               
                var subAttributes = subRecord.attributes;
                if(_isLookup){
                    let subRecordId = subRecord[_isLookup];
                    if(_isLookup === "_id" && subAttributes.isDuplicate){
                        subRecordId = referenceIdMap[subAttributes.referenceId];
                    }
                    record[relationName] = subRecordId;
                }
    
                var subCollectionName = subAttributes.type;
                await dbManager.update(subCollectionName, {_id: subRecord._id}, subRecord);
                await dbManager.update(collectionName, {_id: record._id}, record);
                
                await dbManager.unset(subCollectionName, {_id: subRecord._id}, unset);
            }
        }
        if(!recursion){
            await dbManager.unset(collectionName, {_id: record._id}, unset);
        }
        if(attributes.isDuplicate){
            return;
        }
        
        var mapKeys = _.keys(referenceIdMap);
        if(_.contains(mapKeys, referenceId)){
            insertResult['errors'].push(DUPLICATE_MSG);
            insertResult['statusCode'] = DUPLICATE_STATUS_CODE;
            throw new Error('DUPLICATES_DETECTED');
        }
        referenceIdMap[referenceId] = record._id;
        insertResult['id'] = record._id;

    } catch(err) {

        insertResult.success = false;
        console.log(err);
        if(allOrNone){
            throw err;
        }
    }finally{
        if(!attributes.isDuplicate){
            insertResults.push(insertResult);
        }
    }
}
