// instance_record_queue_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('instance_record_queue');
    
    if (!collection) {
        console.error('无法获取集合 instance_record_queue');
        return;
    }

    // 创建 createdAt 单字段索引
    await createIndexIfNotExists(collection, 'createdAt', {
        "createdAt": 1
    });

    // 创建 sent 单字段索引
    await createIndexIfNotExists(collection, 'sent', {
        "sent": 1
    });

    // 创建 sending 单字段索引
    await createIndexIfNotExists(collection, 'sending', {
        "sending": 1
    });
}

module.exports = {
    run
};