/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-01-27 17:08:37
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-27 17:08:47
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'approvalProcess';
const METADATA_TYPE = 'approvalProcess';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};