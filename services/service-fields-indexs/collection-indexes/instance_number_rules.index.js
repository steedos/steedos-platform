// instance_number_rules_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('instance_number_rules');
    
    if (!collection) {
        console.error('无法获取集合 instance_number_rules');
        return;
    }

    // 创建 space 和 name 复合索引
    await createIndexIfNotExists(collection, 'space_name', {
        "space": 1,
        "name": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};