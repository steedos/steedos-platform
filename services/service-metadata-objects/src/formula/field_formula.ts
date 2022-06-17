// import { getConfigs, getConfig } from '../types';
import { SteedosFieldFormulaTypeConfig, SteedosQuotedByFieldFormulasTypeConfig } from './type';
import { sortFieldFormulaConfigs, isFieldFormulaConfigQuotingObjectAndFields } from './util';
import _ = require('lodash');
import { JsonMap } from '@salesforce/ts-types';

// export const addFieldFormulaConfig = (config: SteedosFieldFormulaTypeConfig) => {
//     addConfig('field_formula', config);
// }

// export const clearFieldFormulaConfigs = (query?: object) => {
//     removeManyConfigs('field_formula', query);
// }

export const getFieldFormulaConfigs = (): Array<SteedosFieldFormulaTypeConfig> => {
    return [];
    // return getConfigs('field_formula');
}

export const getFieldFormulaConfig = (_id: string): SteedosFieldFormulaTypeConfig => {
    return null;
    // return getConfig('field_formula', _id);
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
 * @param options.onlyForOwn 要跳过其他对象上的字段公式，只检测当前对象上的字段公式，
 *  新建记录的时候传入true可以提高性能，避免不必要的公式计算
 *  见issue: a公式字段，其中应用了b公式字段，记录保存后a字段没计算，编辑后再保存字段计算 #2946
 * @param options.withoutCurrent 要跳过当前对象上配置的所有字段公式，只检测其他对象上的字段公式，
 *  删除记录的时候传入true可以解决因为记录被删除doc为null运行公式报错的问题，同时避免不必要的公式计算
 *  见issue: 删除包含公式字段的记录时报错 #3427
 */
export const getObjectQuotedByFieldFormulaConfigs = (objectName: string, fieldNames?: Array<string>, escapeConfigs?: Array<SteedosFieldFormulaTypeConfig> | Array<string>, options?: JsonMap): SteedosQuotedByFieldFormulasTypeConfig => {
    const { onlyForOwn, withoutCurrent } = options || {};
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
            let isCurrent = config.object_name === objectName;
            let isOwn = isCurrent;
            if (isCurrent) {
                // 要进一步确定其引用关系中有引用自身才算是引用自身的公式字段
                isOwn = !!config.quotes.find((quote) => {
                    return quote.is_own;
                });
            }
            if (isOwn) {
                if(!(withoutCurrent && isCurrent)){
                    configsOnCurrentObject.push(config);
                }
            }
            else if (!onlyForOwn) {
                if(!(withoutCurrent && isCurrent)){
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
 * 获取参数config在哪些字段公式中被引用
 * @param config 
 */
export const getQuotedByFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig): SteedosQuotedByFieldFormulasTypeConfig => {
    return getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}