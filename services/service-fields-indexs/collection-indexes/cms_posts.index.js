// cms_posts_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('cms_posts');
    
    if (!collection) {
        console.error('无法获取集合 cms_posts');
        return;
    }

    // 创建 site 和 tags 复合索引
    await createIndexIfNotExists(collection, 'site_tags', {
        "site": 1,
        "tags": 1
    }, {
        background: true
    });

    // 创建 site 和 category 复合索引
    await createIndexIfNotExists(collection, 'site_category', {
        "site": 1,
        "category": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};