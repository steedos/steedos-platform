import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'object_triggers';
const METADATA_TYPE = 'object_triggers';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};