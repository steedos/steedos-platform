// users_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('users');
    
    if (!collection) {
        console.error('无法获取集合 users');
        return;
    }

    // 创建 email 单字段索引
    await createIndexIfNotExists(collection, 'email', {
        "email": 1
    }, {
        background: true
    });

    // 创建 is_deleted 和 email 复合索引
    await createIndexIfNotExists(collection, 'is_deleted_email', {
        "is_deleted": 1,
        "email": 1
    }, {
        background: true
    });

    // 创建 _id 和 created 复合索引
    await createIndexIfNotExists(collection, 'id_created', {
        "_id": 1,
        "created": 1
    }, {
        background: true
    });

    // 创建 _id、created 和 modified 复合索引
    await createIndexIfNotExists(collection, 'id_created_modified', {
        "_id": 1,
        "created": 1,
        "modified": 1
    }, {
        background: true
    });

    // 创建多字段复合索引
    await createIndexIfNotExists(collection, 'primary_email_verified_locale_name_id_mobile', {
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1
    }, {
        background: true
    });

    // 创建包含 created 的多字段复合索引
    await createIndexIfNotExists(collection, 'primary_email_verified_locale_name_id_mobile_created', {
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1,
        "created": 1
    });

    // 创建包含 created 和 last_logon 的多字段复合索引
    await createIndexIfNotExists(collection, 'primary_email_verified_locale_name_id_mobile_created_last_logon', {
        "primary_email_verified": 1,
        "locale": 1,
        "name": 1,
        "_id": 1,
        "mobile": 1,
        "created": 1,
        "last_logon": 1
    });

    // 创建 imo_uid 单字段索引
    await createIndexIfNotExists(collection, 'imo_uid', {
        "imo_uid": 1
    }, {
        background: true
    });

    // 创建 qq_open_id 单字段索引
    await createIndexIfNotExists(collection, 'qq_open_id', {
        "qq_open_id": 1
    }, {
        background: true
    });

    // 创建 last_logon 单字段索引
    await createIndexIfNotExists(collection, 'last_logon', {
        "last_logon": 1
    }, {
        background: true
    });

    // 创建 created 和 modified 复合索引
    await createIndexIfNotExists(collection, 'created_modified', {
        "created": 1,
        "modified": 1
    }, {
        background: true
    });

    // 创建 lastLogin 单字段索引
    await createIndexIfNotExists(collection, 'lastLogin', {
        "lastLogin": 1
    }, {
        background: true
    });

    // 创建 status 单字段索引
    await createIndexIfNotExists(collection, 'status', {
        "status": 1
    }, {
        background: true
    });

    // 创建 active 单字段索引
    await createIndexIfNotExists(collection, 'active', {
        "active": 1
    }, {
        background: true
    });

    // 创建 type 单字段索引
    await createIndexIfNotExists(collection, 'type', {
        "type": 1
    }, {
        background: true
    });

    // 创建微信服务相关复合索引
    await createIndexIfNotExists(collection, 'weixin_openid', {
        "services.weixin.openid.appid": 1,
        "services.weixin.openid._id": 1
    });
}

module.exports = {
    run
};