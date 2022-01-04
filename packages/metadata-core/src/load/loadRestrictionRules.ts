import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '../typeInfo';
import { BaseLoadMetadataFile } from "./_baseLoadFile";

export class LoadRestrictionRules extends BaseLoadMetadataFile {
    constructor() {
        super(TypeInfoKeys.RestrictionRule);
    }
}