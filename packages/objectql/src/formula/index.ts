import { addFieldFormulaConfig, SteedosFieldFormulaTypeConfig, SteedosFieldFormulaQuoteConfig } from './field_formula';
import { SteedosObjectTypeConfig, SteedosFieldTypeConfig, getObjectConfigs } from '../types';
import _ = require('lodash')
const clone = require('clone')

export * from './field_formula'

const addFieldFormulaQuotesConfig = (quote: SteedosFieldFormulaQuoteConfig, quotes: Array<SteedosFieldFormulaQuoteConfig>) => {
    let existQuote = quotes.find((item) => {
        return item.field_name === quote.field_name && item.object_name === quote.object_name
    });
    if (existQuote) {
        quotes.push(quote);
    }
}

/**
 * 把公式中a.b.c，比如account.website这样的变量转为SteedosFieldFormulaQuoteConfig追加到quotes中
 * @param formulaVar 公式中的单个变量，比如account.website
 * @param fieldConfig 
 * @param objectConfigs 
 * @param quotes 
 */
const computeFormulaVarQuotes = (formulaVar: string, objectConfig: SteedosObjectTypeConfig, objectConfigs: Array<SteedosObjectTypeConfig>, quotes: Array<SteedosFieldFormulaQuoteConfig>): Array<SteedosFieldFormulaQuoteConfig> => {
    let varItems = formulaVar.split(".");
    if (varItems.length > 1) {
        let tempObjectConfig = objectConfig;
        let tempFieldConfig: SteedosFieldTypeConfig;
        for (let i = 0, varItem = varItems[i]; i < varItems.length; i++) {
            tempFieldConfig = tempObjectConfig[varItem];
            if(!tempFieldConfig){
                // 不是对象上的字段，则直接退出
                break;
            }
            if(i > 0){
                // 自己不能引用自己，大于0就是其他对象上的引用
                addFieldFormulaQuotesConfig({
                    object_name: tempObjectConfig.name,
                    field_name: tempFieldConfig.name
                }, quotes);
            }
            if(tempFieldConfig.type !== "lookup" && tempFieldConfig.type !== "master_detail"){
                // 不是引用类型字段，则直接退出
                break;
            }
            if(typeof tempFieldConfig.reference_to !== "string"){
                // 暂时只支持reference_to为字符的情况，其他类型直接跳过
                break;
            }
            tempObjectConfig = objectConfigs.find((item)=>{
                return item.name === tempFieldConfig.reference_to;
            });
            if(!tempObjectConfig){
                // 没找到相关引用对象，直接退出
                break;
            }
        }
    }
    return quotes;
}

/**
 * 根据公式内容，取出其中{}中的变量，返回计算后的公式引用集合
 * @param formula 
 * @param fieldConfig 
 * @param objectConfigs 
 */
const computeFormulaQuotes = (formula: string, objectConfig: SteedosObjectTypeConfig, objectConfigs: Array<SteedosObjectTypeConfig>): Array<SteedosFieldFormulaQuoteConfig> => {
    let quotes: Array<SteedosFieldFormulaQuoteConfig> = [];
    const formulaVars = formula.match(/\{[\w\.]+\}/g).map((n) => { return n.replace(/{|}/g, "") })
    formulaVars.forEach((formulaVar) => {
        computeFormulaVarQuotes(formulaVar, objectConfig, objectConfigs, quotes);
    });
    return quotes;
}

export const addObjectFieldFormulaConfig = (fieldConfig: SteedosFieldTypeConfig, objectConfig: SteedosObjectTypeConfig) => {
    // 注意不可以取config.name为当前字段的name，它可能为空，需要用传入的field_name
    const objectConfigs: Array<SteedosObjectTypeConfig> = getObjectConfigs()
    const formula = fieldConfig.formula;
    let quotes: Array<SteedosFieldFormulaQuoteConfig> = computeFormulaQuotes(formula, objectConfig, objectConfigs);
    let formulaConfig: SteedosFieldFormulaTypeConfig = {
        _id: `${objectConfig.name}__${fieldConfig.name}`,
        object_name: objectConfig.name,
        field_name: fieldConfig.name,
        formula: formula,
        quotes: quotes
    };
    addFieldFormulaConfig(formulaConfig);
}

export const addObjectFieldsFormulaConfig = (config: SteedosObjectTypeConfig) => {
    _.each(config.fields, function (field) {
        if (field.type === "formula") {
            //field.name可能为空，所以传入name
            addObjectFieldFormulaConfig(clone(field), config);
        }
    })
}

export const initObjectFieldsFormulas = () => {
    const objectConfigs = getObjectConfigs()
    _.each(objectConfigs, function (objectConfig) {
        addObjectFieldsFormulaConfig(objectConfig);
    })
    
    // console.log("===initObjectFieldsFormulas===", getFieldFormulaConfigs())
}