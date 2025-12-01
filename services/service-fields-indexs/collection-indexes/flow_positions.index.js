// flow_positions_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('flow_positions');
    
    if (!collection) {
        console.error('无法获取集合 flow_positions');
        return;
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

    // 创建 role、org 和 space 复合索引
    await createIndexIfNotExists(collection, 'role_org_space', {
        "role": 1,
        "org": 1,
        "space": 1
    }, {
        background: true
    });

    // 创建 space 和 users 复合索引
    await createIndexIfNotExists(collection, 'space_users', {
        "space": 1,
        "users": 1
    }, {
        background: true
    });

    // 创建 space 和 role 复合索引
    await createIndexIfNotExists(collection, 'space_role', {
        "space": 1,
        "role": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};