/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-12 17:07:49
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-17 20:51:34
 * @Description: 
 */
const { defaultsDeep } = require('./index')
const _ = require('lodash');

export const getSettings = async (spaceId, isPublic = false)=>{
    if(!spaceId){
        return {}
    }
    const filters = [];
    if(isPublic){
        filters.push(['is_public','=',true])
    }
    const SERVICE_NAME = 'metadata-cachers-service'
    const settings = await global.broker.call(`${SERVICE_NAME}.find`, {metadataName: 'settings', filters: filters, spaceId})
    return defaultsDeep({}, ...settings.map(item=>{
        return {
            [item.key]: _.isString(item.value) ? JSON.parse(item.value): item.value
        }
    }));
}