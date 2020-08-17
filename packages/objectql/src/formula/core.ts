import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaParamTypeConfig } from './field_formula';
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
 * 根据公式中的变量值，计算出跨对象引用的记录对应的字段值
 * @param doc 
 * @param vars 
 */
export const computeFieldFormularParams = async (doc: JsonMap, vars: Array<SteedosFieldFormulaVarTypeConfig>) => {
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

export const computeFieldFormularValue = async (doc: JsonMap, fieldFormulaConfig: SteedosFieldFormulaTypeConfig) => {
    const { formula, vars } = fieldFormulaConfig;
    let params = await computeFieldFormularParams(doc, vars);
    // console.log("==computeFieldFormularValue==params===", params);
    return runFieldFormular(formula, params);
}

export const runFieldFormular = function (formula: string, params: Array<SteedosFieldFormulaParamTypeConfig>) {
    let formulaParams = {};
    params.forEach(({ key, value }) => {
        formulaParams[key] = value;
        formula = formula.replace(`{${key}}`, `__params["${key}"]`);
    });
    let formulaFun = `module.exports = function (__params) { return ${formula} }`;
    // console.log("==runFieldFormular==formulaFun===", formulaFun);
    // console.log("==runFieldFormular==formulaParams===", formulaParams);
    let result = _eval(formulaFun)(formulaParams);
    // console.log("==runFieldFormular==result===", result);
    return result;
}