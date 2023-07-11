/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 14:08:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 14:10:07
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.Import;

export class ImportCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName);
    }
}