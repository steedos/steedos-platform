import { addConfig, getConfigs, getConfig, removeManyConfigs } from '../types';
import { SteedosFieldFormulaTypeConfig } from './type';
import { sortFieldFormulaConfigs, isFieldFormulaConfigQuotingObjectAndFields } from './util';

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
 * @param escapeCurrentObject 是否跳过在当前对象上且引用自身的公式字段
 */
export const getObjectQuotedByFieldFormulaConfigs = (objectName: string, fieldNames?: Array<string>, escapeCurrentObject?: boolean): Array<SteedosFieldFormulaTypeConfig> => {
    const configs = getFieldFormulaConfigs();
    let configsOnCurrentObject = [];
    let configsOnOtherObjects = [];
    configs.forEach((config: SteedosFieldFormulaTypeConfig) => {
        let isQuoting = isFieldFormulaConfigQuotingObjectAndFields(config, objectName, fieldNames);
        if(isQuoting){
            let isOwn = config.object_name === objectName;
            if(isOwn){
                // 要进一步确定其引用关系中有引用自身才算是引用自身的公式字段
                isOwn = !!config.quotes.find((quote)=>{
                    return quote.is_own;
                });
            }
            if(isOwn){
                configsOnCurrentObject.push(config);
            }
            else{
                configsOnOtherObjects.push(config);
            }
        }
    });
    if(escapeCurrentObject){
        return configsOnOtherObjects;
    }
    else{
        // 当前对象上的字段一定要做排序
        return sortFieldFormulaConfigs(configsOnCurrentObject).concat(configsOnOtherObjects);
    }
}

/**
 * 获取参数config在哪些字段公式中被引用
 * @param config 
 */
export const getQuotedByFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig): Array<SteedosFieldFormulaTypeConfig> => {
    return getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}