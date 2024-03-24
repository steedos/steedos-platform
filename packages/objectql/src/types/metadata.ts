/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-03-24 09:40:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-03-24 09:43:46
 * @Description: 
 */
const SERVICE_NAME = 'metadata-cachers-service'
export const getMetadata = (metadataName)=>{
    return {
        find: (filters, spaceId?)=>{
            return broker.call(`${SERVICE_NAME}.find`, {metadataName, filters, spaceId})
        },
        get: (_id)=>{
            return broker.call(`${SERVICE_NAME}.get`, {_id});
        }
    }
}