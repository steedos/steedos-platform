/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-05-30 10:08:55
 * @Description: 
 */
import { SteedosFieldFormulaTypeConfig, SteedosQuotedByFieldFormulasTypeConfig } from './type';
import { sortFieldFormulaConfigs, isFieldFormulaConfigQuotingObjectAndFields } from './util';
import { getSteedosSchema } from '../types/schema';

import _ = require('lodash');

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
    return await getFieldFormulaConfigs(objectName, fieldName);
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
 * @param isOnlyForCurrentObject 要跳过其他对象上的字段公式，只检测当前对象上的字段公式，新建记录的时候传入true可以提高性能，避免不必要的公式计算
 */
export const getObjectQuotedByFieldFormulaConfigs = async (objectName: string, fieldNames?: Array<string>, escapeConfigs?: Array<SteedosFieldFormulaTypeConfig> | Array<string>, isOnlyForCurrentObject?: boolean): Promise<SteedosQuotedByFieldFormulasTypeConfig> => {
    const configs = await getFieldFormulaConfigs(); //TODO 此处代码需要优化，取了所有配置。此处代码迁移到metadata objects services
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
            let isOwn = config.object_name === objectName;
            if (isOwn) {
                // 要进一步确定其引用关系中有引用自身才算是引用自身的公式字段
                isOwn = !!config.quotes.find((quote) => {
                    return quote.is_own;
                });
            }
            if (isOwn) {
                configsOnCurrentObject.push(config);
            }
            else if (!isOnlyForCurrentObject) {
                configsOnOtherObjects.push(config);
            }
        }
    });
    // 当前对象上的字段一定要做排序
    const ownConfigs = sortFieldFormulaConfigs(configsOnCurrentObject);
    const otherConfigs = configsOnOtherObjects;
    const allConfigs = ownConfigs.concat(otherConfigs);
    return { ownConfigs, otherConfigs, allConfigs }
}

/**
 * 获取参数config在哪些字段公式中被引用
 * @param config 
 */
export const getQuotedByFieldFormulaConfigs = async (config: SteedosFieldFormulaTypeConfig): Promise<SteedosQuotedByFieldFormulasTypeConfig> => {
    return await getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}