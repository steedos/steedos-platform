import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadPageFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Page);
    }
}