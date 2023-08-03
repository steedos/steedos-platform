import { SteedosMetadataTypeInfoKeys as TypeInfoKeys } from '@steedos/metadata-core';
import _ from 'underscore';
import { MetadataBaseCollection } from './_base'

const metadataName = TypeInfoKeys.Question;

export class QuestionCollection extends MetadataBaseCollection{
    constructor(){
        super(metadataName);
    }

    getIdKey(){
        return "id";
    }
}
