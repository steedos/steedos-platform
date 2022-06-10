/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 13:22:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 17:26:18
 * @Description: 
 */
'use strict';
// @ts-check

const { getCollection, _makeNewID, formatFileName } = require('./util');
const { File, createFileReadStream } = require('./file');


module.exports = {
    getCollection,
    _makeNewID,
    File,
    createFileReadStream,
    formatFileName,
}