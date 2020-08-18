import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaParamTypeConfig, SteedosFieldFormulaVarPathTypeConfig } from './field_formula';
import { getSteedosSchema } from '../index';
import { wrapAsync } from '../util';
import { JsonMap } from "@salesforce/ts-types";
import _ = require('lodash')
import _eval = require('eval')

/**
 * 根据公式内容，取出其中{}中的变量
 * @param formula 
 */
export const pickFormulaVars = (formula: string): Array<string> => {
    return formula.match(/\{[\w\.]+\}/g).map((n) => { return n.replace(/{|}/g, "") })
}

/**
 * 根据公式中的变量值，计算出跨对象引用的记录对应的字段值，作为公式运算的参数返回
 * @param doc 
 * @param vars 
 * return Array<SteedosFieldFormulaParamTypeConfig>
 */
export const computeFieldFormulaParams = async (doc: JsonMap, vars: Array<SteedosFieldFormulaVarTypeConfig>) => {
    let params: Array<SteedosFieldFormulaParamTypeConfig> = [];
    if (vars && vars.length) {
        for (let { key, paths } of vars) {
            let tempValue = _.reduce(paths, (reslut, next, index) => {
                if (index === 0) {
                    reslut = <any>doc[next.field_name];
                }
                else {
                    reslut = wrapAsync(function () {
                        return getSteedosSchema().getObject(next.reference_to).findOne(<any>reslut, { fields: [next.field_name] })
                    }, {});
                    if (reslut) {
                        return reslut[next.field_name]
                    }
                    else {
                        return null
                    }
                }
                return reslut;
            }, null);
            params.push({
                key: key,
                value: tempValue
            });
            // formulaForEval = formulaForEval.replace(`{${key}}`, tempValue);
        }
    }
    return params;
}

export const computeFieldFormulaValue = async (doc: JsonMap, fieldFormulaConfig: SteedosFieldFormulaTypeConfig) => {
    const { formula, vars } = fieldFormulaConfig;
    let params = await computeFieldFormulaParams(doc, vars);
    // console.log("==computeFieldFormulaValue==params===", params);
    return runFieldFormula(formula, params);
}

export const runFieldFormula = function (formula: string, params: Array<SteedosFieldFormulaParamTypeConfig>) {
    let formulaParams = {};
    params.forEach(({ key, value }) => {
        formulaParams[key] = value;
        formula = formula.replace(`{${key}}`, `__params["${key}"]`);
    });
    if (!/\breturn\b/.test(formula)) {
        // 如果里面没有return语句，则在最前面加上return前缀
        formula = `return ${formula}`;
    }
    let formulaFun = `module.exports = function (__params) { ${formula} }`;
    // console.log("==runFieldFormular==formulaFun===", formulaFun);
    // console.log("==runFieldFormular==formulaParams===", formulaParams);
    let result = _eval(formulaFun)(formulaParams);
    // console.log("==runFieldFormular==result===", result);
    return result;
}

const addToAggregatePaths = (varItemToAggregatePaths: Array<SteedosFieldFormulaVarPathTypeConfig>, toAggregatePaths: Array<Array<SteedosFieldFormulaVarPathTypeConfig>>) => {
    let existPath = toAggregatePaths.find((item) => {
        return JSON.stringify(item) === JSON.stringify(varItemToAggregatePaths)
    });
    if (!existPath) {
        toAggregatePaths.push(varItemToAggregatePaths);
    }
}

/**
 * 修改记录时，根据查到的引用了该记录相关字段公式配置，重新计算字段公式，并把计算结果更新到数据库相关记录中
 * @param objectName 当前修改的记录所属对象名称
 * @param recordId 当前修改的记录ID
 * @param fieldFormulaConfig 查到的引用了该记录所属对象的相关字段公式配置之一
 */
export const updateQuotedObjectFieldFormulaValue = async (objectName: string, recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig) => {
    const { vars } = fieldFormulaConfig;
    let toAggregatePaths: Array<Array<SteedosFieldFormulaVarPathTypeConfig>> = [];
    for (let varItem of vars) {
        // vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_to":"contacts"},{"field_name":"website","reference_to":"accounts"}]}]
        const { paths } = varItem;
        let isInPaths = false;
        let varItemToAggregatePaths = [];
        for (let pathItem of paths) {
            if (pathItem.reference_to === objectName) {
                isInPaths = true;
                break;
            }
            varItemToAggregatePaths.push(pathItem);
        }
        if (isInPaths) {
            // 添加时去除重复项
            addToAggregatePaths(varItemToAggregatePaths, toAggregatePaths);
        }
    }
    // 只有一层引用关系时，vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_to":"contacts"},{"field_name":"website","reference_to":"accounts"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_to":"contacts"}]]
    // 超过一层引用关系时，vars格式如：[{"key":"account.modified_by.name","paths":[{"field_name":"account","reference_to":"contacts"},{"field_name":"modified_by","reference_to":"accounts"},{"field_name":"name","reference_to":"users"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_to":"contacts"},{"field_name":"modified_by","reference_to":"accounts"}]]
    for (let toAggregatePathsItem of toAggregatePaths) {
        if (toAggregatePathsItem.length < 2) {
            // 引用关系只有一层时，可以直接查出哪些记录需要更新重算公式字段值
            let tempPath = toAggregatePathsItem[0];
            let docs = await getSteedosSchema().getObject(fieldFormulaConfig.object_name).find({ filters: [[tempPath.field_name, "=", recordId]], fields: [tempPath.field_name] })
            // console.log("===updateQuotedObjectFieldFormulaValue=docs====", docs);
            for(let doc of docs){
                let value = await computeFieldFormulaValue(doc, fieldFormulaConfig);
                // console.log("===updateQuotedObjectFieldFormulaValue=value====", value);
                let setDoc = {};
                setDoc[fieldFormulaConfig.field_name] = value;
                // console.log("===updateQuotedObjectFieldFormulaValue=setDoc====", setDoc);
                // console.log("===updateQuotedObjectFieldFormulaValue=doc====", doc);
                // console.log("===updateQuotedObjectFieldFormulaValue=fieldFormulaConfig====", fieldFormulaConfig);
                await getSteedosSchema().getObject(fieldFormulaConfig.object_name).updateOne(doc._id, setDoc);
            }
        }
        else {
            // 引用关系超过一层时，需要使用aggregate来查出哪些记录需要更新重算公式字段值

        }
    }
}