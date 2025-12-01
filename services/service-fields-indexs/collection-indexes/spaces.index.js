// spaces_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('spaces');
    
    if (!collection) {
        console.error('无法获取集合 spaces');
        return;
    }

    // 创建 is_paid 单字段索引
    await createIndexIfNotExists(collection, 'is_paid', {
        "is_paid": 1
    }, {
        background: true
    });

    // 创建 name 和 is_paid 复合索引
    await createIndexIfNotExists(collection, 'name_is_paid', {
        "name": 1,
        "is_paid": 1
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
}

module.exports = {
    run
};