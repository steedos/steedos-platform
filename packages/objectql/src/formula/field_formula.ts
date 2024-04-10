/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2024-04-10 15:11:24
 * @Description: 
 */
import { SteedosFieldFormulaTypeConfig, SteedosQuotedByFieldFormulasTypeConfig } from './type';
import { sortFieldFormulaConfigs, isFieldFormulaConfigQuotingObjectAndFields } from './util';
import { getSteedosSchema } from '../types/schema';

import _ = require('lodash');
import { JsonMap } from '@salesforce/ts-types';

export const getFieldFormulaConfigs = async (objectApiName?, fieldApiName?): Promise<Array<SteedosFieldFormulaTypeConfig>> => {
    return await getSteedosSchema().metadataBroker.call(`objects.getObjectFieldFormulaConfigs`, {objectApiName, fieldApiName})
}

export const getFieldFormulaConfig = async (fieldApiFullName: string): Promise<SteedosFieldFormulaTypeConfig> => {
    return await getSteedosSchema().metadataBroker.call(`objects.getObjectFieldFormulaConfig`, {fieldApiFullName})
}

export const verifyObjectFieldFormulaConfig = async (fieldConfig, objectConfig): Promise<SteedosFieldFormulaTypeConfig> => {
    return await getSteedosSchema().metadataBroker.call(`objects.verifyObjectFieldFormulaConfig`, {fieldConfig, objectConfig})
}

/**
 * 获取对象本身的字段公式配置
 * 不传入fieldName时取objectName关联的所有字段公式配置
 * @param objectName 
 * @param fieldName 
 */
export const getObjectFieldFormulaConfigs = async (objectName: string, fieldName?: string): Promise<Array<SteedosFieldFormulaTypeConfig>> => {
    let result = await getFieldFormulaConfigs(objectName, fieldName);
    return sortFieldFormulaConfigs(result);
    // console.log('getObjectFieldFormulaConfigs from metadata services', configs);
    // let result = configs.filter((config: SteedosFieldFormulaTypeConfig) => {
    //     if (fieldName) {
    //         return config.object_name === objectName && config.field_name === fieldName;
    //     }
    //     else {
    //         return config.object_name === objectName;
    //     }
    // });
    // return sortFieldFormulaConfigs(result);
}

/**
 * 获取对象在哪些字段公式中被引用
 * 不传入fieldNames时取objectName关联的所有字段公式配置
 * @param objectName 
 * @param fieldNames 
 * @param escapeConfigs 要跳过的字段公式
 * @param options.onlyForOwn 要跳过其他对象上的字段公式，只检测当前对象上的字段公式，
 *  新建记录的时候传入true可以提高性能，避免不必要的公式计算
 *  见issue: a公式字段，其中应用了b公式字段，记录保存后a字段没计算，编辑后再保存字段计算 #2946
 * @param options.withoutCurrent 要跳过当前对象上配置的所有字段公式，只检测其他对象上的字段公式，
 *  删除记录的时候传入true可以解决因为记录被删除doc为null运行公式报错的问题，同时避免不必要的公式计算
 *  见issue: 删除包含公式字段的记录时报错 #3427
 */
export const getObjectQuotedByFieldFormulaConfigs = async (objectName: string, fieldNames?: Array<string>, escapeConfigs?: Array<SteedosFieldFormulaTypeConfig> | Array<string>, options?: JsonMap): Promise<SteedosQuotedByFieldFormulasTypeConfig> => {
    const { onlyForOwn, withoutCurrent } = options || {};
    const configs = await getFieldFormulaConfigs(objectName); //TODO 此处代码需要优化，取了所有配置。此处代码迁移到metadata objects services
    let configsOnCurrentObject = [];
    let configsOnOtherObjects = [];
    configs.forEach((config: SteedosFieldFormulaTypeConfig) => {
        if (escapeConfigs && escapeConfigs.length) {
            const escapeConfigIds = typeof escapeConfigs[0] === "string" ? <Array<string>>escapeConfigs : _.map(<Array<SteedosFieldFormulaTypeConfig>>escapeConfigs, '_id');
            if (escapeConfigIds.indexOf(config._id) > -1) {
                return;
            }
        }
        let isQuoting = isFieldFormulaConfigQuotingObjectAndFields(config, objectName, fieldNames);
        if (isQuoting) {
            // 要进一步确定其引用关系中有引用自身才算是引用自身的公式字段
            let isOwn = !!config.quotes.find((quote) => {
                return quote.is_own;
            });
            if (isOwn) {
                if(!(withoutCurrent)){
                    configsOnCurrentObject.push(config);
                }
            }
            else if (!onlyForOwn) {
                if(!(withoutCurrent)){
                    configsOnOtherObjects.push(config);
                }
            }
        }
    });
    // 当前对象上的字段一定要做排序
    const ownConfigs = sortFieldFormulaConfigs(configsOnCurrentObject);
    const otherConfigs = configsOnOtherObjects; //注意otherConfigs其实也包括当前对象上的公式字段，只是不包含引用自身字段的公式字段
    const allConfigs = ownConfigs.concat(otherConfigs);
    return { ownConfigs, otherConfigs, allConfigs }
}


/**
 * 获取当前对象中在哪些当前对象上的字段公式中被引用，修改当前对象记录时调用，新建记录时直接重算所有公式字段，不调用这个函数
 * @param objectName 
 * @param fieldNames 必填
 * 返回需要重算的公式字段配置，注意这里要返回的字段配置包含的不只是直接引用，还有间接引用过传入的fieldNames中字段的公式配置，所以该函数中使用了递归查找
 */
export const getCurrentObjectQuotedByFieldFormulaConfigs = async (objectName: string, fieldNames: Array<string>, options?: any): Promise<Array<SteedosFieldFormulaTypeConfig>> => {
    if(!options){
        options = {
            count: 0,
            result: []
        };
    }
    const configs = await getFieldFormulaConfigs(objectName); //TODO 此处代码需要优化，取了所有配置。此处代码迁移到metadata objects services
    let configsOnCurrentObject = [];
    configs.forEach((config: SteedosFieldFormulaTypeConfig) => {
        let isQuoting = isFieldFormulaConfigQuotingObjectAndFields(config, objectName, fieldNames);
        if (isQuoting) {
            configsOnCurrentObject.push(config);
        }
    });
    // options.count < 20只是为了保险避免死循环的可能，理论上并不可能出现死循环，因为启用服务时会判断元数据中公式字段之前的引用关系，不允许出现公式字段之间互相引用的情况。
    if(configsOnCurrentObject.length > 0 && options.count < 20){
        options.count++;
        options.result = options.result.concat(configsOnCurrentObject);
        return await getCurrentObjectQuotedByFieldFormulaConfigs(objectName, _.map(configsOnCurrentObject, "field_name"), options);
    }
    // 当前对象上的字段一定要做排序
    const result = sortFieldFormulaConfigs(options.result);
    return result;
}

/**
 * 获取参数config在哪些字段公式中被引用
 * @param config 
 */
export const getQuotedByFieldFormulaConfigs = async (config: SteedosFieldFormulaTypeConfig): Promise<SteedosQuotedByFieldFormulasTypeConfig> => {
    return await getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}