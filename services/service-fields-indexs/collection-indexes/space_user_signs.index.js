// space_user_signs_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('space_user_signs');
    
    if (!collection) {
        console.error('无法获取集合 space_user_signs');
        return;
    }

    // 创建 space 和 user 复合索引
    await createIndexIfNotExists(collection, 'space_user', {
        "space": 1,
        "user": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};