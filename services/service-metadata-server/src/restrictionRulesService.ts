import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'restriction_rules';
const METADATA_TYPE = 'restriction_rules';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};