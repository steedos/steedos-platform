import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'workflowTrigger';
const METADATA_TYPE = 'workflowTrigger';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};