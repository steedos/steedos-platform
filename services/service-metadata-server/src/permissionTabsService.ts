/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-06-28 16:33:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-06-29 10:35:40
 * @FilePath: /project-template/Users/sunhaolin/Documents/GitHub/steedos-platform-2.3/services/service-metadata-server/src/permissionTabsService.ts
 * @Description: 
 */
import * as _ from 'underscore';
const metadataService = require('./metadataService');
const SERVICE_NAME = 'permission_tabs';
const METADATA_TYPE = 'permission_tabs';
module.exports = {
    name: SERVICE_NAME,
    mixins: [metadataService],
    settings: {
        metadataType: METADATA_TYPE
    },
    actions: {
        filter: {
            cache: {
                keys: ['pattern', "#user.spaceId"],
                ttl: 5 // seconds
            },
            async handler(ctx) {
                // console.log('permissionTabsService filter')
                let { pattern } = ctx.params;
                return await ctx.broker.call('metadata.filter', { key: this.getMatadataCacherKey(pattern) }, { meta: ctx.meta })
            }
        },
    }
};