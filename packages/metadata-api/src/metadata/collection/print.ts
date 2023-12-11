/*
 * @Author: 孙浩林 6194896+sunhaolin@users.noreply.github.com
 * @Date: 2023-12-10 15:51:35
 * @LastEditors: 孙浩林 6194896+sunhaolin@users.noreply.github.com
 * @LastEditTime: 2023-12-10 15:53:15
 * @FilePath: /steedos-platform-2.3/packages/metadata-api/src/metadata/collection/print.ts
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.Print;

export class PrintCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName);
    }
}