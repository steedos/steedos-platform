// forms_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('forms');
    
    if (!collection) {
        console.error('无法获取集合 forms');
        return;
    }

    // 创建 space 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'space_is_deleted', {
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 space、app 和 created 复合索引
    await createIndexIfNotExists(collection, 'space_app_created', {
        "space": 1,
        "app": 1,
        "created": 1
    }, {
        background: true
    });

    // 创建 space、app、created 和 current.modified 复合索引
    await createIndexIfNotExists(collection, 'space_app_created_current_modified', {
        "space": 1,
        "app": 1,
        "created": 1,
        "current.modified": 1
    }, {
        background: true
    });

    // 创建 name 和 space 复合索引
    await createIndexIfNotExists(collection, 'name_space', {
        "name": 1,
        "space": 1
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

    // 创建 space 和 state 复合索引
    await createIndexIfNotExists(collection, 'space_state', {
        "space": 1,
        "state": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};