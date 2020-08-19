import { SteedosObjectTypeConfig, SteedosFieldTypeConfig, getObjectConfigs } from '../types';
import { addFieldFormulaConfig, SteedosFieldFormulaTypeConfig, SteedosFieldFormulaQuoteTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaVarPathTypeConfig, getFieldFormulaConfigs } from './field_formula';
import { pickFormulaVars } from './core';
import _ = require('lodash')
const clone = require('clone')

export * from './field_formula'
export * from './triggers'

const addFieldFormulaQuotesConfig = (quote: SteedosFieldFormulaQuoteTypeConfig, quotes: Array<SteedosFieldFormulaQuoteTypeConfig>) => {
    let existQuote = quotes.find((item) => {
        return item.field_name === quote.field_name && item.object_name === quote.object_name
    });
    if (!existQuote) {
        quotes.push(quote);
    }
}

/**
 * 把公式中a.b.c，比如account.website这样的变量转为SteedosFieldFormulaQuoteTypeConfig和SteedosFieldFormulaVarTypeConfig追加到quotes和vars中
 * @param formulaVar 公式中的单个变量，比如account.website
 * @param fieldConfig 
 * @param objectConfigs 
 * @param quotes 
 */
const computeFormulaVarAndQuotes = (formulaVar: string, objectConfig: SteedosObjectTypeConfig, objectConfigs: Array<SteedosObjectTypeConfig>, quotes: Array<SteedosFieldFormulaQuoteTypeConfig>, vars: Array<SteedosFieldFormulaVarTypeConfig>) => {
    let varItems = formulaVar.split(".");
    let paths: Array<SteedosFieldFormulaVarPathTypeConfig> = [];
    let tempObjectConfig = objectConfig;
    for (let i = 0; i < varItems.length; i++) {
        if (!tempObjectConfig) {
            // 没找到相关引用对象，直接退出
            break;
        }
        let varItem = varItems[i];
        if(tempObjectConfig.name === "contacts"){
            console.log("===varItem===", varItem);
        }
        let tempFieldConfig: SteedosFieldTypeConfig = tempObjectConfig.fields[varItem];
        if (!tempFieldConfig) {
            // 不是对象上的字段，则直接退出
            break;
        }
        paths.push({
            field_name: varItem,
            reference_to: tempObjectConfig.name
        });
        if (i > 0) {
            // 自己不能引用自己，大于0就是其他对象上的引用
            addFieldFormulaQuotesConfig({
                object_name: tempObjectConfig.name,
                field_name: tempFieldConfig.name
            }, quotes);
        }
        if (tempFieldConfig.type !== "lookup" && tempFieldConfig.type !== "master_detail") {
            // 不是引用类型字段，则直接退出
            break;
        }
        if (typeof tempFieldConfig.reference_to !== "string") {
            // 暂时只支持reference_to为字符的情况，其他类型直接跳过
            break;
        }
        tempObjectConfig = objectConfigs.find((item) => {
            return item.name === tempFieldConfig.reference_to;
        });
        if (!tempObjectConfig) {
            // 没找到相关引用对象，直接退出
            break;
        }
    }
    let formulaVarItem: SteedosFieldFormulaVarTypeConfig = {
        key: formulaVar,
        paths: paths
    };
    vars.push(formulaVarItem);
    return { quotes, vars };
}

/**
 * 根据公式内容，取出其中{}中的变量，返回计算后的公式引用集合
 * @param formula 
 * @param fieldConfig 
 * @param objectConfigs 
 */
const computeFormulaVarsAndQuotes = (formula: string, objectConfig: SteedosObjectTypeConfig, objectConfigs: Array<SteedosObjectTypeConfig>) => {
    let quotes: Array<SteedosFieldFormulaQuoteTypeConfig> = [];
    let vars: Array<SteedosFieldFormulaVarTypeConfig> = [];
    const formulaVars = pickFormulaVars(formula);
    formulaVars.forEach((formulaVar) => {
        computeFormulaVarAndQuotes(formulaVar, objectConfig, objectConfigs, quotes, vars);
    });
    return { quotes, vars };
}

export const addObjectFieldFormulaConfig = (fieldConfig: SteedosFieldTypeConfig, objectConfig: SteedosObjectTypeConfig) => {
    const objectConfigs: Array<SteedosObjectTypeConfig> = getObjectConfigs()
    const formula = fieldConfig.formula;
    let result = computeFormulaVarsAndQuotes(formula, objectConfig, objectConfigs);
    let formulaConfig: SteedosFieldFormulaTypeConfig = {
        _id: `${objectConfig.name}__${fieldConfig.name}`,
        object_name: objectConfig.name,
        field_name: fieldConfig.name,
        formula: formula,
        quotes: result.quotes,
        vars: result.vars
    };
    addFieldFormulaConfig(formulaConfig);
}

export const addObjectFieldsFormulaConfig = (config: SteedosObjectTypeConfig) => {
    _.each(config.fields, function (field) {
        if (field.type === "formula") {
            addObjectFieldFormulaConfig(clone(field), config);
        }
    })
}

export const initObjectFieldsFormulas = () => {
    const objectConfigs = getObjectConfigs()
    _.each(objectConfigs, function (objectConfig) {
        addObjectFieldsFormulaConfig(objectConfig);
    })

    console.log("===initObjectFieldsFormulas===", JSON.stringify(getFieldFormulaConfigs()))
}