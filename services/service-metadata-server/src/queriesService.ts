import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'queries';
const METADATA_TYPE = 'queries';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};