/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-10 11:28:54
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-27 11:00:46
 * @Description: 
 */
const db = require('./default_db')


async function run() {
    const collection = await db.getCollection('instance_tasks')

    // 待审核箱
    try {
        const indexName = 'inbox'
        const indexExists = await collection.indexExists(indexName)
        if (!indexExists) {
            await collection.createIndex({
                handler: 1,
                is_finished: 1,
                space: 1,
                start_date: -1,
                category: 1,
                is_deleted: 1,
            }, { background: true, name: indexName })
        }
    } catch (error) {
        console.error(error)
    }
    // 已审核箱
    try {
        const indexName = 'outbox'
        const indexExists = await collection.indexExists(indexName)
        if (!indexExists) {
            await collection.createIndex({
                handler: 1,
                is_finished: 1,
                space: 1,
                finish_date: -1,
                category: 1,
                is_deleted: 1,
            }, { background: true, name: indexName })
        }
    } catch (error) {
        console.error(error)
    }


    // 推送badge计算
    try {
        const indexName = 'push_badge'
        const indexExists = await collection.indexExists(indexName)
        if (!indexExists) {
            await collection.createIndex({
                handler: 1,
                is_finished: 1,
                space: 1,
                category: 1,
            }, { background: true, name: indexName })
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    run
}