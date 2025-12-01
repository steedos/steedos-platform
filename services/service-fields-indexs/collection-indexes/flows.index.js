// flows_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('flows');
    
    if (!collection) {
        console.error('无法获取集合 flows');
        return;
    }

    // 创建 space 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'space_is_deleted', {
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 role 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'role_is_deleted', {
        "role": 1,
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

    // 创建 form 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'form_is_deleted', {
        "form": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 current.steps.approver_roles、space 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'approver_roles_space_is_deleted', {
        "current.steps.approver_roles": 1,
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 _id、space 和 is_deleted 复合索引
    await createIndexIfNotExists(collection, 'id_space_is_deleted', {
        "_id": 1,
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 创建 space 和 form 复合索引
    await createIndexIfNotExists(collection, 'space_form', {
        "space": 1,
        "form": 1
    }, {
        background: true
    });

    // 创建 form 单字段索引（使用 try-catch 处理可能的错误）
    try {
        await createIndexIfNotExists(collection, 'form', {
            "form": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 form 索引时出错:', error.message);
    }

    // 创建 space、form 和 state 复合索引
    // 注意：原代码中 state: 后面有冒号，这里修正为 state
    await createIndexIfNotExists(collection, 'space_form_state', {
        "space": 1,
        "form": 1,
        "state": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};