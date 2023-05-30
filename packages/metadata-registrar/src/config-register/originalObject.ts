/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:56:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-29 10:56:35
 * @Description: 
 */
import { getOriginalObjectConfig } from './core';

var util = require('../util');

export function overrideOriginalObject(objectName, data){
    const originalObjectConfig = getOriginalObjectConfig(objectName);
    util.extend(originalObjectConfig, data);
}