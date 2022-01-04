import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.RestrictionRule;

export class RestrictionRuleCollection extends MetadataBaseCollection {
    constructor() {
        super(metadataName);
    }
}
