/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-04-24 16:28:50
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-04-25 18:24:17
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
}