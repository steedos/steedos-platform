/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-07-28 11:37:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-07-28 18:06:44
 * @Description: 
 */
import { deleteCommonAttribute, sortAttribute } from '../../util/attributeUtil'
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.Dashboard;

export class DashboardCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName);
    }

    getIdKey(){
        return "id";
    }

    async formatDataOnRetrieve(metadata, dbManager){
        metadata.cards = await dbManager.find("analytics_dashboard_card", {
            dashboard_id: metadata._id
        });

        delete metadata.created_at;
        delete metadata.updated_at;
        delete metadata.creator_id;

        _.each(metadata.cards, (card)=>{
            delete card._id;
            delete card.dashboard_id;
            delete card.created_at;
            delete card.updated_at;
            delete card.creator_id;
            delete card.company_id;
            delete card.company_ids;
            deleteCommonAttribute(card);
            sortAttribute(card);
        })
        
        return metadata;
    }

    async formatDataOnDeploy(metadata, dbManager){
        metadata._id = metadata.id;
        if(metadata && metadata.cards){
            for(const card of metadata.cards){
                card._id = card.id;
                card.dashboard_id = metadata._id;
                await this.saveDashboardCard(dbManager, card);
            }
        }
    }

    async saveDashboardCard(dbManager, data){
        var idKey = this.getIdKey();
        var filter = {[idKey]: data[idKey]};
        var collectionName = "analytics_dashboard_card";
        var record = await dbManager.findOne(collectionName, filter);
    
        if(record == null){
            record = await dbManager.findOne(collectionName, filter, false)
            if(record) {
                throw new Error(`process api_name already exists: ${data.name}`); 
            }
            return await dbManager.insert(collectionName, data);
        }else{
            return await dbManager.update(collectionName, filter, data);
        }
    }
}
