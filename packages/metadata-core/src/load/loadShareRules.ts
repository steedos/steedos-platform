import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadShareRules extends BaseLoadMetadataFile {
    constructor() {
        super(TypeInfoKeys.ShareRule);
    }
}