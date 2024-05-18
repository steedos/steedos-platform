/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2024-05-15 15:22:43
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2024-05-15 15:23:17
 * @FilePath: /steedos-platform-2.3/services/service-metadata-server/src/objectFunctionService.ts
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'object_functions';
const METADATA_TYPE = 'object_functions';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    }
};