/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2023-01-10 11:28:54
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-27 11:00:46
 * @Description: 
 */
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');


async function run() {
    const collection = await getCollection('instance_tasks')
    
    if (!collection) {
        console.error('无法获取集合 instance_tasks')
        return
    }

    // 待审核箱索引
    await createIndexIfNotExists(collection, 'inbox', {
        handler: 1,
        is_finished: 1,
        space: 1,
        start_date: -1,
        category: 1,
        is_deleted: 1,
    })

    // 已审核箱索引
    await createIndexIfNotExists(collection, 'outbox', {
        handler: 1,
        is_finished: 1,
        space: 1,
        finish_date: -1,
        category: 1,
        is_deleted: 1,
    })

    // 推送badge计算索引
    await createIndexIfNotExists(collection, 'push_badge', {
        handler: 1,
        is_finished: 1,
        space: 1,
        category: 1,
    })
}

module.exports = {
    run
}