import { addConfig } from '../types';
import { getConfigs, getConfig } from '../types/config';

export type SteedosFieldFormulaQuoteTypeConfig = {
    object_name: string,
    field_name: string
}

/**
 * 公式中的{}括起来的单个变量中的执行路径
 * {}中第一个reference_to肯定是指向当前对象
 */
export type SteedosFieldFormulaVarPathTypeConfig = {
    field_name: string,
    reference_to: string
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
 *   {field_name: "account", reference_to:"contacts"},
 *   {field_name: "website", reference_to:"accounts"},
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
