import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadPageFile extends BaseLoadMetadataFile{
    constructor(){
        super(TypeInfoKeys.Page);
    }
}