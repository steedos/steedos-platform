// space_users_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('space_users');
    
    if (!collection) {
        console.error('无法获取集合 space_users');
        return;
    }

    // 创建 user_accepted 单字段索引
    await createIndexIfNotExists(collection, 'user_accepted', {
        "user_accepted": 1
    }, {
        background: true
    });

    // 创建 user 和 user_accepted 复合索引
    await createIndexIfNotExists(collection, 'user_user_accepted', {
        "user": 1,
        "user_accepted": 1
    }, {
        background: true
    });

    // 创建 user 和 space 复合索引
    await createIndexIfNotExists(collection, 'user_space', {
        "user": 1,
        "space": 1
    }, {
        background: true
    });

    // 创建 space 和 user_accepted 复合索引
    await createIndexIfNotExists(collection, 'space_user_accepted', {
        "space": 1,
        "user_accepted": 1
    }, {
        background: true
    });

    // 创建 space、user 和 user_accepted 复合索引
    await createIndexIfNotExists(collection, 'space_user_user_accepted', {
        "space": 1,
        "user": 1,
        "user_accepted": 1
    }, {
        background: true
    });

    // 创建 space 和 manager 复合索引
    await createIndexIfNotExists(collection, 'space_manager', {
        "space": 1,
        "manager": 1
    }, {
        background: true
    });

    // 创建 manager 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'manager', {
            "manager": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 manager 索引时出错:', error.message);
    }

    // 创建 space 和 created 复合索引
    await createIndexIfNotExists(collection, 'space_created', {
        "space": 1,
        "created": 1
    }, {
        background: true
    });

    // 创建 space、created 和 modified 复合索引
    await createIndexIfNotExists(collection, 'space_created_modified', {
        "space": 1,
        "created": 1,
        "modified": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};