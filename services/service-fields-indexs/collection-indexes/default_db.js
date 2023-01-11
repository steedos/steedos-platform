/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-10 11:35:36
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-10 13:45:33
 * @Description: 
 */
const objectql = require('@steedos/objectql')

async function getCollection(collectionName) {
    try {
        const adapter = objectql.getObject(collectionName).datasource.adapter
        await adapter.connect()
        return adapter.collection(collectionName);
    } catch (error) {
        return null
    }
}

module.exports = {
    getCollection
}