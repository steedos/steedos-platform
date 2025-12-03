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


/**
 * 通用的索引创建函数
 * @param {Object} collection - 集合对象
 * @param {string} indexName - 索引名称
 * @param {Object} indexFields - 索引字段对象
 * @param {Object} options - 索引选项，默认为 { background: true }
 */
async function createIndexIfNotExists(collection, indexName, indexFields, options = { background: true }) {
    try {
        indexName = `c2_${indexName}`;
        const indexExists = await collection.indexExists(indexName)
        if (!indexExists) {
            const indexOptions = { ...options, name: indexName }
            await collection.createIndex(indexFields, indexOptions)
            console.log(`索引 ${indexName} 创建成功`)
        } else {
            // console.log(`索引 ${indexName} 已存在`)
        }
    } catch (error) {
        console.error(`创建索引 ${indexName} 时出错:`, error)
        throw error // 可以选择重新抛出错误或静默处理
    }
}

module.exports = {
    getCollection,
    createIndexIfNotExists
}