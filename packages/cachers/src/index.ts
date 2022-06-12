/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-06-09 15:03:56
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-06-10 11:16:07
 * @Description: 
 */


const CACHER_MAP = {};

import { MemoryCacher } from './memory';
import { MemoryLRUCacher } from './memory-lru'

export const getCacher = function (name: string, options?: any) {
    if(!CACHER_MAP[name]){
        if(name.startsWith('lru.')){
            CACHER_MAP[name] = new MemoryLRUCacher(options);
        }else{
            CACHER_MAP[name] = new MemoryCacher();
        }
    }
    return CACHER_MAP[name];
}

export const clearCacher = function (name: string | number) {
    if(CACHER_MAP[name]){
        CACHER_MAP[name].clear();
    }
}

export const getCacherNames = function(){
    return Object.keys(CACHER_MAP);
}