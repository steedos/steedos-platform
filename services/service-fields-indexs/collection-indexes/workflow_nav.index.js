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
    const flowsCollection = await getCollection('flows')
    if (flowsCollection) {
        await createIndexIfNotExists(flowsCollection, 'space_category_state_sort', {
            space: 1,
            category: 1,
            state: 1,
            sort_no: -1
        })
    }

    // 新增 categories 集合索引
    const categoriesCollection = await getCollection('categories')
    if (categoriesCollection) {
        await createIndexIfNotExists(categoriesCollection, 'space_sort', {
            space: 1,
            sort_no: -1
        })
    }
}

module.exports = {
    run
}