// flow_roles_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('flow_roles');
    
    if (!collection) {
        console.error('无法获取集合 flow_roles');
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
}

module.exports = {
    run
};