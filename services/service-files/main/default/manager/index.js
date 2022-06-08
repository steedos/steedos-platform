/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 13:22:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-08 18:21:04
 * @Description: 
 */

const objectql = require('@steedos/objectql');
const path = require('path');
const mkdirp = require('mkdirp');
const { save } = require('./save');

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
 * 获取文件存储的文件夹路径
 * @param {String} fsCollectionName 
 * @returns 
 */
function storageBasePath (fsCollectionName) {
    return path.join(process.env.STEEDOS_STORAGE_DIR, `files/${fsCollectionName}`);
}

/**
 * 生成文件存储路径
 * @param {{ _id, filename, instance, fsCollectionName }} param0 
 * @returns 
 */
function fileKeyMaker({ _id, filename, instance, fsCollectionName }) {
    var absolutePath, extention, filename, final_filename, month, name_split, now, pathname, year;

    name_split = filename.split('.');
    extention = name_split.pop();
    final_filename = name_split.join('.').substring(0, 50) + '.' + extention;
    now = new Date;
    year = now.getFullYear();
    month = now.getMonth() + 1;

    let customPathPrefix = year + '/' + month + '/';
    if (instance) {
        customPathPrefix += instance;
    }

    pathname = path.join(storageBasePath(fsCollectionName), customPathPrefix);

    absolutePath = path.resolve(pathname);

    mkdirp.sync(absolutePath);

    return customPathPrefix + '/' + fsCollectionName + '-' + _id + '-' + final_filename;
}

/**
 * 文件存储完整路径
 * @param {String} fsCollectionName 
 * @param {String} fileKey 
 */
function fileStoreFullPath (fsCollectionName, fileKey) {
    return path.join(storageBasePath(fsCollectionName), fileKey);
}

module.exports = {
    getCollection,
    _makeNewID,
    fileKeyMaker,
    fileStoreFullPath,
    save
}