import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'charts';
const METADATA_TYPE = 'charts';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};