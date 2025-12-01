// instances_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('instances');
    
    if (!collection) {
        console.error('无法获取集合 instances');
        return;
    }

    // 使用 try-catch 包装可能出错的索引创建
    try {
        await createIndexIfNotExists(collection, 'submitter', {
            "submitter": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 submitter 索引时出错:', error.message);
    }

    try {
        await createIndexIfNotExists(collection, 'applicant', {
            "applicant": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 applicant 索引时出错:', error.message);
    }

    try {
        await createIndexIfNotExists(collection, 'outbox_users', {
            "outbox_users": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 outbox_users 索引时出错:', error.message);
    }

    // 基础索引
    await createIndexIfNotExists(collection, 'space_is_deleted', {
        "space": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'state', {
        "state": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'is_archived', {
        "is_archived": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'id_submit_date', {
        "_id": 1,
        "submit_date": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'space_flow_state_submit_date', {
        "space": 1,
        "flow": 1,
        "state": 1,
        "submit_date": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'created_modified', {
        "created": 1,
        "modified": 1
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'space_state_is_deleted', {
        "space": 1,
        "state": 1,
        "is_deleted": 1
    }, {
        background: true
    });

    // 根据配置决定是否创建 keywords 索引
    const objectql = require("@steedos/objectql");
    const config = objectql.getSteedosConfig();
    if (!config.datasources.default.documentDB) {
        await createIndexIfNotExists(collection, 'keywords_hashed', {
            "keywords": "hashed"
        }, {
            background: true
        });
    }

    // 复合索引
    await createIndexIfNotExists(collection, 'space_submit_date_is_deleted_final_decision_state', {
        "space": 1,
        "submit_date": 1,
        "is_deleted": 1,
        "final_decision": 1,
        "state": 1
    });

    await createIndexIfNotExists(collection, 'traces_approves_type_handler', {
        "traces.approves.type": 1,
        "traces.approves.handler": 1
    });

    try {
        await createIndexIfNotExists(collection, 'category', {
            "category": 1
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 category 索引时出错:', error.message);
    }

    await createIndexIfNotExists(collection, 'record_ids', {
        "record_ids.ids": 1,
        "record_ids.o": 1,
    }, {
        background: true
    });

    await createIndexIfNotExists(collection, 'traces_approves_auto_submitted', {
        "traces.approves.auto_submitted": 1
    }, {
        background: true
    });

    // 监控箱-管理员
    try {
        await createIndexIfNotExists(collection, 'monitor_admin', {
            space: 1,
            state: 1,
            submit_date: -1,
        }, { background: true });
    } catch (error) {
        console.warn('创建 monitor_admin 索引时出错:', error.message);
    }

    try {
        await createIndexIfNotExists(collection, 'state_category_is_deleted_space', {
            "state": 1,
            "category": 1,
            "is_deleted": 1,
            "space": 1
        });
    } catch (error) {
        console.warn('创建 state_category_is_deleted_space 索引时出错:', error.message);
    }

    // 监控箱-用户
    try {
        await createIndexIfNotExists(collection, 'monitor_user', {
            space: 1,
            submit_date: -1,
            flow: 1,
            category: 1,
            state: 1,
            is_deleted: 1,
            name: 1,
        }, { background: true });
    } catch (error) {
        console.warn('创建 monitor_user 索引时出错:', error.message);
    }

    // 草稿箱
    try {
        await createIndexIfNotExists(collection, 'draft', {
            space: 1,
            submitter: 1,
            state: 1,
            modified: -1,
        }, { background: true });
    } catch (error) {
        console.warn('创建 draft 索引时出错:', error.message);
    }

    // 进行中
    try {
        await createIndexIfNotExists(collection, 'pending', {
            space: 1,
            state: 1,
            modified: -1,
        }, { background: true });
    } catch (error) {
        console.warn('创建 pending 索引时出错:', error.message);
    }

    try {
        await createIndexIfNotExists(collection, 'pending_applicant', {
            space: 1,
            state: 1,
            applicant: 1,
            modified: -1,
        }, { background: true });
    } catch (error) {
        console.warn('创建 pending_applicant 索引时出错:', error.message);
    }

    // 推送相关索引
    try {
        await createIndexIfNotExists(collection, 'push_manager_inbox_users_category', {
            inbox_users: 1,
            category: 1,
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 push_manager_inbox_users_category 索引时出错:', error.message);
    }

    try {
        await createIndexIfNotExists(collection, 'push_manager_cc_users_category', {
            cc_users: 1,
            category: 1,
        }, {
            background: true
        });
    } catch (error) {
        console.warn('创建 push_manager_cc_users_category 索引时出错:', error.message);
    }
}

module.exports = {
    run
};