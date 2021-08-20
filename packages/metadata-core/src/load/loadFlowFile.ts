import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadFlowFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Flow, 'json');
    }
}