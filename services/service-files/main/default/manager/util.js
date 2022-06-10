/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-09 11:20:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 09:57:24
 * @Description: 
 */

const objectql = require('@steedos/objectql');

/**
 * 获取对象集合
 * @param {String} name 
 */
function getCollection(name) {
    return objectql.getDataSource('default').adapter.collection(name);
}

/**
 * 生成主键
 * @returns 主键
 */
function _makeNewID() {
    return objectql.getDataSource('default').adapter._makeNewID();
}

/**
 * 格式化文件名
 * @param {*} filename 
 * @param {*} upload_from 
 * @returns 
 */
function formatFileName(filename, upload_from) {
    if (["image.jpg", "image.gif", "image.jpeg", "image.png"].includes(filename.toLowerCase())) {
        filename = "image-" + moment(new Date()).format('YYYYMMDDHHmmss') + "." + filename.split('.').pop();
    }

    try {
        if (upload_from === "IE" || upload_from === "node") {
            filename = decodeURIComponent(filename);
        }
    } catch (error) {
        console.error(filename);
        console.error(error);
        filename = filename.replace(/%/g, "-");
    }
    return filename;
}

module.exports = {
    getCollection,
    _makeNewID,
    formatFileName
}