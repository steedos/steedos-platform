import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadChartFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Chart);
    }
}