import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.ShareRule;

export class ShareRuleCollection extends MetadataBaseCollection {
    constructor() {
        super(metadataName);
    }
}
