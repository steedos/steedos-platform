import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'processTrigger';
const METADATA_TYPE = 'processTrigger';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};