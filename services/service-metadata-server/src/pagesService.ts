import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'pages';
const METADATA_TYPE = 'pages';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};