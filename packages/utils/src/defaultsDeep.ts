/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-02-25 13:37:26
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-25 13:38:55
 * @Description: 
 */

import { toArray, mergeWith, isArray } from 'lodash';

// lodash的defaultsDeep 对数组的覆盖是使用数组长度进行对比，不符合元数据覆盖逻辑. 故重写修正该函数
// 源码出处：https://github.com/nodeutils/defaults-deep
export const defaultsDeep = (...args)=>{
    let output = {};
    toArray(args).reverse().forEach(item=> {
        mergeWith(output, item, (objectValue, sourceValue) => {
            return isArray(sourceValue) ? sourceValue : undefined;
        });
    });
    return output;
};