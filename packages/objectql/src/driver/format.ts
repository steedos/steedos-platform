/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-05-21 15:59:14
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-05-21 18:18:07
 * @Description: 
 */
import { Dictionary } from "@salesforce/ts-types";
import { SteedosObjectType } from "../types";
import _ = require('lodash');

/**
 * https://github.com/steedos/steedos-frontend/issues/69
 * mongo数据源不会自动把日期/日期时间字段从字符串转换为Date类型
 * https://github.com/steedos/steedos-platform/issues/3314
 * 公式中可能引用日期/日期时间字段做比较，所以需要在object层就调用该函数，而不是在driver层调用
 * Meteor数据源只是在driver层保存数据的时候会自动处理各种字段类型转换，所以也调用了该函数提前转换，以避免公式运算中拿到的参数值也是转换前的
 * TypeORM相关的数据源因为一直没暴露过相关问题，所以暂时不调用该函数
 * direct相关db操作函数因为可能从接口中接收记录doc参数值，所以也调用了该函数
 * @param doc 记录数据
 * @param objectConfig 对象schema
 * @returns 
 */
export function formatRecord(doc: Dictionary<any>, objectConfig: SteedosObjectType) {
    if(!objectConfig){
        return doc;
    }
    const fields = objectConfig.fields;
    return _.mapValues(doc, function(value, key) {
        let field = fields[key];
        if(_.isString(value) && field && ["date", "datetime", "time"].indexOf(field.type) > -1){
            return new Date(value);
        }
        return value;
    });
}