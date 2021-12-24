import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'permission_fields';
const METADATA_TYPE = 'permission_fields';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};