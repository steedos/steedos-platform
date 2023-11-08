/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-03-28 09:35:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-11-06 19:40:16
 * @Description: 
 */
import { getCollectionNameByMetadata, SteedosMetadataTypeInfoKeys} from '@steedos/metadata-core';
import { workflowsFromDb} from './workflow';
import _ from 'underscore';

export async function getMetadataSources(dbManager, metadataName){

    let filters: any = {is_deleted: {$ne: true}}
    let records;

    switch (metadataName) {
        case 'Workflow':
            let steedosPackage = {};
            await workflowsFromDb(dbManager, ['*'], steedosPackage);
            let recordMap = steedosPackage[SteedosMetadataTypeInfoKeys.Workflow]
            records = []
            for(let recordName in recordMap){
                let record = recordMap[recordName]
                record.name = recordName
                records.push(record);
            }
            return records;
        default:
            let collectionName = getCollectionNameByMetadata(metadataName);
            if(!collectionName){
                return [];
            }
            if(metadataName === SteedosMetadataTypeInfoKeys.Profile){
                filters.type = 'profile';
            }else if(metadataName === SteedosMetadataTypeInfoKeys.Permissionset){
                filters.type = {$ne: 'profile'};
            }
            records = await dbManager.find(collectionName, filters);
            return records;
    }
}