/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-01-27 17:09:05
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-27 17:09:14
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'workflow';
const METADATA_TYPE = 'workflow';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};