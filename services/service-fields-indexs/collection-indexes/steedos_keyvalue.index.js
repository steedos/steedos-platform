// steedos_keyvalues_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('steedos_keyvalues');
    
    if (!collection) {
        console.error('无法获取集合 steedos_keyvalues');
        return;
    }

    // 创建 space 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'space', {
            "space": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 space 索引时出错:', error.message);
    }

    // 创建 user 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'user', {
            "user": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 user 索引时出错:', error.message);
    }

    // 创建 key 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'key', {
            "key": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 key 索引时出错:', error.message);
    }

    // 创建 user、space 和 key 复合索引
    await createIndexIfNotExists(collection, 'user_space_key', {
        "user": 1,
        "space": 1,
        "key": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};