/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 15:27:00
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-10-24 11:01:35
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'clientJS';
const METADATA_TYPE = 'clientJS';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    },
};