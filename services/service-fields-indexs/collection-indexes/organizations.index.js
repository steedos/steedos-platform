// organizations_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('organizations');
    
    if (!collection) {
        console.error('无法获取集合 organizations');
        return;
    }

    // 创建 space 和 users 复合索引
    await createIndexIfNotExists(collection, 'space_users', {
        "space": 1,
        "users": 1
    }, {
        background: true
    });

    // 创建 _id 和 space 复合索引
    await createIndexIfNotExists(collection, 'id_space', {
        "_id": 1,
        "space": 1
    }, {
        background: true
    });

    // 创建 name、space、_id 和 parent 复合索引
    await createIndexIfNotExists(collection, 'name_space_id_parent', {
        "name": 1,
        "space": 1,
        "_id": 1,
        "parent": 1
    }, {
        background: true
    });

    // 创建 space 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'space_is_deleted', {
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 parents 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'parents', {
            "parents": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 parents 索引时出错:', error.message);
    }

    // 创建 parents 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'parents_is_deleted', {
        "parents": 1,
        "is_deleted": 1
    }, {
        background: true
    });

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