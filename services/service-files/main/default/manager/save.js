/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 17:25:24
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-08 18:52:10
 * @Description: 保存文件
 */

const objectql = require('@steedos/objectql');
const fs = require('fs');



function save(tempFilePath, fsCollectionName, fileKey, callback) {
    const {
        fileStoreFullPath
    } = require('.');
    const config = objectql.getSteedosConfig();
    const storeName = config.public.cfs ? (config.public.cfs.store || 'local') : 'local';
    if ('local' === storeName) {
        const fileStorePath = fileStoreFullPath(fsCollectionName, fileKey);
        fs.renameSync(tempFilePath, fileStorePath);
    } else if ('OSS' === storeName || 'S3' === storeName) {
        // TODO: 将文件保存到OSS或S3
    } else if ('STEEDOSCLOUD' === storeName) {
        // TODO
    } else {
        throw new Error(`Unsupported store name: ${storeName}`);
    }




    if (callback) {
        callback(null);
    }
}


module.exports = {
    save
}