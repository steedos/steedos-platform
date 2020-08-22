import { addConfig } from '../types';
import { getConfigs, getConfig } from '../types/config';
import { SteedosFieldFormulaTypeConfig } from './type';
import { sortFieldFormulaConfigs } from './util';

export const addFieldFormulaConfig = (config: SteedosFieldFormulaTypeConfig) => {
    addConfig('field_formula', config);
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
 */
export const getObjectQuotedByFieldFormulaConfigs = (objectName: string, fieldNames?: Array<string>): Array<SteedosFieldFormulaTypeConfig> => {
    const configs = getFieldFormulaConfigs();
    return configs.filter((config: SteedosFieldFormulaTypeConfig) => {
        const quotes = config.quotes;
        if (quotes && quotes.length) {
            return !!quotes.find((quote) => {
                if (fieldNames && fieldNames.length) {
                    return quote.object_name === objectName && fieldNames.indexOf(quote.field_name) > -1;
                }
                else {
                    return quote.object_name === objectName;
                }
            });
        }
        else {
            return false;
        }
    });
}

/**
 * 获取参数config在哪些字段公式中被引用
 * @param config 
 */
export const getQuotedByFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig): Array<SteedosFieldFormulaTypeConfig> => {
    return getObjectQuotedByFieldFormulaConfigs(config.object_name, [config.field_name]);
}