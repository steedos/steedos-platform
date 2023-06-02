/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-24 16:28:50
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-27 17:34:36
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.Trigger;

export class TriggerCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName);
    }

    formatDataOnDeploy(metadata){
        try {
            metadata._name = metadata.name.substr(metadata.name.indexOf("_")+1)
        } catch (error) {
            
        }
        return metadata;
    }


    formatDataOnRetrieve(metadata){
        delete metadata._name;
        //属性排序
        return Object.assign({name: '', listenTo: '', when: '', isEnabled: true, handler: ''}, metadata);
    }
}