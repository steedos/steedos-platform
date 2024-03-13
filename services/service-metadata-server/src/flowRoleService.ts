import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'flowRole';
const METADATA_TYPE = 'flowRole';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};