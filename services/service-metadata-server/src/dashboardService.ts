/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-01 10:37:13
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-03 13:22:44
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'dashboard';
const METADATA_TYPE = 'dashboard';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};