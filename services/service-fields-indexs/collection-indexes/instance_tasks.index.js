/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-10 11:28:54
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2023-01-10 14:33:11
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
                space: 1,
                handler: 1,
                is_finished: 1,
                instance_state: 1,
                distribute_from_instance: 1,
                forward_from_instance: 1,
                is_hidden: 1,
                start_date: -1
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
                space: 1,
                handler: 1,
                is_finished: 1,
                finish_date: -1,
            }, { background: true, name: indexName })
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    run
}