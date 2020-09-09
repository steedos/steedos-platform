import { addConfig, getConfigs, getConfig, removeManyConfigs } from '../types';
import { SteedosFieldFormulaTypeConfig, SteedosQuotedByFieldFormulasTypeConfig } from './type';
import { sortFieldFormulaConfigs, isFieldFormulaConfigQuotingObjectAndFields } from './util';
import _ = require('lodash');

export const addFieldFormulaConfig = (config: SteedosFieldFormulaTypeConfig) => {
    addConfig('field_formula', config);
}

export const clearFieldFormulaConfigs = (query?: object) => {
    removeManyConfigs('field_formula', query);
}

export const getFieldFormulaConfigs = (): Array<SteedosFieldFormulaTypeConfig> => {
    return getConfigs('field_formula')
}

export const getFieldFormulaConfig = (_id: string): SteedosFieldFormulaTypeConfig => {
    return getConfig('field_formula', _id);
}

/**
 * 获取对象本身的字段公式配置
 * 不传入fieldName时取objectName关联的所有字段公式配置
 * @param objectName 
 * @param fieldName 
 */
export const getObjectFieldFormulaConfigs = (objectName: string, fieldName?: string): Array<SteedosFieldFormulaTypeConfig> => {
    const configs = getFieldFormulaConfigs();
    let result = configs.filter((config: SteedosFieldFormulaTypeConfig) => {
        if (fieldName) {
            return config.object_name === objectName && config.field_name === fieldName;
        }
        else {
            return config.object_name === objectName;
        }
    });
    return sortFieldFormulaConfigs(result);
}

/**
 * 获取对象在哪些字段公式中被引用
 * 不传入fieldNames时取objectName关联的所有字段公式配置
 * @param objectName 
 * @param fieldNames 
 * @param escapeConfigs 要跳过的字段公式
 */
export const getObjectQuotedByFieldFormulaConfigs = (objectName: string, fieldNames?: Array<string>, escapeConfigs?: Array<SteedosFieldFormulaTypeConfig> | Array<string>): SteedosQuotedByFieldFormulasTypeConfig => {
    const configs = getFieldFormulaConfigs();
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
            else {
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
export const getQuotedByFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig): SteedosQuotedByFieldFormulasTypeConfig => {
    return getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}