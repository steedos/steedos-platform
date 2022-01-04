import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadQueryFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Query);
    }
}