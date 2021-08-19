import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadChartFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Chart);
    }
}