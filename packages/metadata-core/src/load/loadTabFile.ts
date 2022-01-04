import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadTabFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Tab);
    }
}