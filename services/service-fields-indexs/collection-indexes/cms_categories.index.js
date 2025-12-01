// cms_categories_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('cms_categories');
    
    if (!collection) {
        console.error('无法获取集合 cms_categories');
        return;
    }

    // 创建 site 和 parent 复合索引
    await createIndexIfNotExists(collection, 'site_parent', {
        "site": 1,
        "parent": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};