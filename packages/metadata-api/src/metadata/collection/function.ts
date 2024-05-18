/*
 * @Author: 孙浩林 6194896+sunhaolin@users.noreply.github.com
 * @Date: 2023-12-10 15:51:35
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-15 14:05:35
 * @FilePath: /steedos-platform-2.3/packages/metadata-api/src/metadata/collection/function.ts
 * @Description: 
 */
import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.FunctionYML;

export class FunctionCollection extends MetadataBaseCollection {
    constructor() {
        super(metadataName);
    }

    formatDataOnDeploy(metadata) {
        try {
            metadata._name = metadata.name.substr(metadata.name.indexOf("_") + 1)
        } catch (error) {

        }
        return metadata;
    }


    formatDataOnRetrieve(metadata) {
        delete metadata._name;
        //属性排序
        return Object.assign({ name: '', objectApiName: '', isEnabled: true, is_rest: true,  script: '' }, metadata);
    }
}