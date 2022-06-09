/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-09 11:20:59
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-09 11:23:06
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

module.exports = {
    getCollection,
    _makeNewID
}