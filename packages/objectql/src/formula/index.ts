import { SteedosObjectTypeConfig, SteedosFieldTypeConfig, getObjectConfigs } from '../types';
import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaQuoteTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaVarPathTypeConfig, FormulaUserSessionKey, FormulaBlankValue } from './type';
import { addFieldFormulaConfig, getFieldFormulaConfigs } from './field_formula';
import { pickFormulaVars } from './core';
import { isFieldFormulaConfigQuotedTwoWays } from './util';
import _ = require('lodash')
const clone = require('clone')

export * from './type'
export * from './util'
export * from './field_formula'
export * from './core'
// export * from './triggers'
export * from './recompute'

const addFieldFormulaQuotesConfig = (quote: SteedosFieldFormulaQuoteTypeConfig, quotes: Array<SteedosFieldFormulaQuoteTypeConfig>) => {
    if(quote.field_name === "_id"){
        // _id字段不记为引用关系，因为其值不会变化，相关记录属性变更时不需要重算被引用的字段公式
        return;
    }
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
    let isUserSessionVar = formulaVar.startsWith(FormulaUserSessionKey);
    let varItems = formulaVar.split(".");
    let paths: Array<SteedosFieldFormulaVarPathTypeConfig> = [];
    let formulaVarItem: SteedosFieldFormulaVarTypeConfig = {
        key: formulaVar,
        paths: paths
    };
    if (isUserSessionVar) {
        // 如果是userSession变量，则不需要计算quotes引用，paths也直接空着
        formulaVarItem.is_user_session_var = true;
        vars.push(formulaVarItem);
        return;
    }
    let tempObjectConfig = objectConfig;
    for (let i = 0; i < varItems.length; i++) {
        let varItem = varItems[i];
        let tempFieldConfig: SteedosFieldTypeConfig;
        if(varItem === "_id"){
            // 支持_id属性
            tempFieldConfig = {
                name: varItem,
                type: "text"
            }
        }
        else{
            tempFieldConfig = tempObjectConfig.fields[varItem];
        }
        if (!tempFieldConfig) {
            // 不是对象上的字段，则直接退出
            throw new Error(`computeFormulaVarAndQuotes:Can't find the field '${varItem}' on the object '${tempObjectConfig.name}' for the formula var '${formulaVar}'`);
        }
        let isFormulaType = tempFieldConfig.type === "formula";
        let tempFieldFormulaVarPath: SteedosFieldFormulaVarPathTypeConfig = {
            field_name: varItem,
            reference_from: tempObjectConfig.name
        };
        if (isFormulaType) {
            tempFieldFormulaVarPath.is_formula = true;
        }
        paths.push(tempFieldFormulaVarPath);
        if (i > 0 || isFormulaType) {
            // 陈了公式字段外，自己不能引用自己，i大于0就是其他对象上的引用
            let tempFieldFormulaQuote: SteedosFieldFormulaQuoteTypeConfig = {
                object_name: tempObjectConfig.name,
                field_name: tempFieldConfig.name
            };
            if (isFormulaType) {
                tempFieldFormulaQuote.is_formula = true;
            }
            addFieldFormulaQuotesConfig(tempFieldFormulaQuote, quotes);
        }
        if (tempFieldConfig.type === "lookup" || tempFieldConfig.type === "master_detail") {
            // 引用类型字段
            if (i === varItems.length - 1) {
                // 引用类型字段后面必须继续引用该字段的相关属性，否则直接报错
                throw new Error(`computeFormulaVarAndQuotes:The field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is a ${tempFieldConfig.type} type, so you must add more property after it.`);
            }
        }
        else {
            // 不是引用类型字段，则直接退出
            if (i < varItems.length - 1) {
                // 提前找到非跨对象字段，说明varItems中后面没计算的变量是多余错误的，因为.后面肯定是跨对象引用出来的字段（除非是$user等全局变量）
                throw new Error(`computeFormulaVarAndQuotes:The field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is not a lookup/master_detail type, so you can't get more property for it.`);
            }
            break;
        }
        if (typeof tempFieldConfig.reference_to !== "string") {
            // 暂时只支持reference_to为字符的情况，其他类型直接跳过
            throw new Error(`computeFormulaVarAndQuotes:The reference_to of the field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is not a string type.`);
        }
        tempObjectConfig = objectConfigs.find((item) => {
            return item.name === tempFieldConfig.reference_to;
        });
        if (!tempObjectConfig) {
            // 没找到相关引用对象，直接退出
            throw new Error(`computeFormulaVarAndQuotes:Can't find the object reference_to '${tempFieldConfig.reference_to}' by the field '${tempFieldConfig.name}' for the formula var '${formulaVar}'`);
        }
    }
    vars.push(formulaVarItem);
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
        _id: `${objectConfig.name}.${fieldConfig.name}`,
        object_name: objectConfig.name,
        field_name: fieldConfig.name,
        formula: formula,
        formula_type: fieldConfig.formula_type,
        formula_blank_value: <FormulaBlankValue>fieldConfig.formula_blank_value,
        quotes: result.quotes,
        vars: result.vars
    };
    const isQuotedTwoWays = isFieldFormulaConfigQuotedTwoWays(formulaConfig, getFieldFormulaConfigs());
    if (!isQuotedTwoWays) {
        addFieldFormulaConfig(formulaConfig);
    }
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