/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-06-08 13:22:29
 * @LastEditors: sunhaolin@hotoa.com
 * @LastEditTime: 2022-06-10 09:58:26
 * @Description: 
 */
'use strict';
// @ts-check

const { getCollection, _makeNewID, formatFileName } = require('./util');
const { File } = require('./file');


module.exports = {
    getCollection,
    _makeNewID,
    File,
    formatFileName
}