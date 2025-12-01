// cfs_instances_indexes.js
const {
    createIndexIfNotExists, 
    getCollection
} = require('./default_db');

async function run() {
    // 获取 cfs.instances.files 集合
    // 注意：根据实际情况调整集合名称
    const collection = await getCollection('cfs_instances_files');
    
    if (!collection) {
        console.error('无法获取集合 cfs_instances_files');
        return;
    }

    // 创建 metadata.instance 索引
    await createIndexIfNotExists(collection, 'metadata_instance', {
        "metadata.instance": 1
    });

    // 创建 failures.copies.instances.doneTrying 索引
    await createIndexIfNotExists(collection, 'failures_copies_instances_doneTrying', {
        "failures.copies.instances.doneTrying": 1
    });

    // 创建 copies.instances 索引
    await createIndexIfNotExists(collection, 'copies_instances', {
        "copies.instances": 1
    });

    // 创建 uploadedAt 索引
    await createIndexIfNotExists(collection, 'uploadedAt', {
        "uploadedAt": 1
    });
}

module.exports = {
    run
};