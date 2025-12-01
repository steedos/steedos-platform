// process_delegation_rules_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    const collection = await getCollection('process_delegation_rules');
    
    if (!collection) {
        console.error('无法获取集合 process_delegation_rules');
        return;
    }

    // 创建 enabled 和 end_time 复合索引
    await createIndexIfNotExists(collection, 'enabled_end_time', {
        "enabled": 1,
        "end_time": 1
    }, {
        background: true
    });
}

module.exports = {
    run
};