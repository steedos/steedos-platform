/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-07-10 15:27:00
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-07-10 15:28:50
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'import';
const METADATA_TYPE = 'import';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    },
};