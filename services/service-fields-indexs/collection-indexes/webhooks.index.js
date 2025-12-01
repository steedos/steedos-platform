// webhooks_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('webhooks');
    
    if (!collection) {
        console.error('无法获取集合 webhooks');
        return;
    }

    // 创建 flow 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'flow', {
            "flow": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 flow 索引时出错:', error.message);
    }
}

module.exports = {
    run
};