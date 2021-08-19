import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadQueryFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Query);
    }
}