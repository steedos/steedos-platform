import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'role';
const METADATA_TYPE = 'role';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};