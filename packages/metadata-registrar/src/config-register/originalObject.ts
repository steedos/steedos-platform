/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-29 10:56:27
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 11:50:46
 * @Description: 
 */
import { extend } from '../utils';
import { getOriginalObjectConfig } from './core';

export function overrideOriginalObject(objectName, data){
    const originalObjectConfig = getOriginalObjectConfig(objectName);
    extend(originalObjectConfig, data);
}