import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'process';
const METADATA_TYPE = 'process';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};