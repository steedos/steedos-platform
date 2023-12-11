/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-12-10 16:15:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-10 16:16:06
 * @FilePath: /steedos-platform-2.3/services/service-metadata-server/src/printService.ts
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'print';
const METADATA_TYPE = 'print';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    },
};