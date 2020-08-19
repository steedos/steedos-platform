import { addConfig } from '../types';
import { getConfigs, getConfig } from '../types/config';

export type SteedosFieldFormulaQuoteTypeConfig = {
    object_name: string,
    field_name: string
}

/**
 * 公式中的{}括起来的单个变量中的执行路径
 * {}中第一个reference_from肯定是指向当前对象
 */
export type SteedosFieldFormulaVarPathTypeConfig = {
    field_name: string,
    reference_from: string
}

/**
 * 运行公式时，要注入的参数，经过计算每个SteedosFieldFormulaVarTypeConfig最终会转换为该结构作为参数注入公式中
 */
export type SteedosFieldFormulaParamTypeConfig = {
    key: string,
    value: any
}

/**
 * 公式中的{}括起来的单个变量
 * 比如contacts对象中有公式{account.website}
 * 则解析为
 * {
 *  key: "account.website",
 *  paths: [
 *   {field_name: "account", reference_from:"contacts"},
 *   {field_name: "website", reference_from:"accounts"},
 *  ]
 * }
 */
export type SteedosFieldFormulaVarTypeConfig = {
    key: string,
    paths: Array<SteedosFieldFormulaVarPathTypeConfig>
}

export type SteedosFieldFormulaTypeConfig = {
    _id: string,
    object_name: string,
    field_name: string,
    formula: string,
    quotes: Array<SteedosFieldFormulaQuoteTypeConfig>,
    vars: Array<SteedosFieldFormulaVarTypeConfig>
}

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
    return configs.filter((config: SteedosFieldFormulaTypeConfig) => {
        if (fieldName) {
            return config.object_name === objectName && config.field_name === fieldName;
        }
        else {
            return config.object_name === objectName;
        }
    });
}

/**
 * 获取对象在哪些字段公式中被引用
 * 不传入fieldNames时取objectName关联的所有字段公式配置
 * @param objectName 
 * @param fieldNames 
 */
export const getObjectQuotedFieldFormulaConfigs = (objectName: string, fieldNames?: Array<string>): Array<SteedosFieldFormulaTypeConfig> => {
    const configs = getFieldFormulaConfigs();
    return configs.filter((config: SteedosFieldFormulaTypeConfig) => {
        const quotes = config.quotes;
        if(quotes && quotes.length){
            return !!quotes.find((quote)=>{
                if (fieldNames && fieldNames.length) {
                    return quote.object_name === objectName && fieldNames.indexOf(quote.field_name) > -1;
                }
                else {
                    return quote.object_name === objectName;
                }
            });
        }
        else{
            return false;
        }
    });
}
