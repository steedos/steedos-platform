/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-04-14 11:32:34
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-04-14 11:32:36
 * @Description: 
 */
import _ = require("lodash");


export function defaultsDeep(obj, sources) {
    let output = {};
    _.toArray(arguments).reverse().forEach(item=> {
        _.mergeWith(output, item, (objectValue, sourceValue) => {
            if(_.isArray(sourceValue)){
                if(_.isArray(objectValue)){
                    return _.uniqBy(_.compact(_.concat(objectValue, sourceValue)), 'name')
                }else{
                    return sourceValue
                }
            }else{
                return undefined;
            }
        });
    });
    return output;
};