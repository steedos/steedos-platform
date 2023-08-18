/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-12-09 18:23:36
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-18 10:28:49
 * @Description: 
 */
import { SteedosObjectTypeConfig, getSteedosSchema } from '../types';
import { SteedosFormulaOptions } from './type';
import { computeFormulaParams, pickFormulaVarFields, runFormula } from './core';
import { isUserSessionRequiredForFormulaVars } from './util';
import { JsonMap } from "@salesforce/ts-types";
import _ = require('lodash')
import { getObjectConfig, getOriginalObjectConfig } from '@steedos/metadata-registrar';

export * from './type'
export * from './util'
export * from './field_formula'
export * from './core'
// export * from './triggers'
export * from './recompute'
/**
 * 根据公式内容，取出其中{}中的变量，返回计算后的公式引用集合
 * @param formula 
 * @param fieldConfig 
 * @param objectConfigs 
 */
const computeFormulaVarsAndQuotes = async (formula: string, objectConfig: SteedosObjectTypeConfig) => {
    return await getSteedosSchema().metadataBroker.call(`objects.getFormulaVarsAndQuotes`, {formula, objectConfig})
}

export async function checkFormula(formula: string, mainObjectName: string){

    const mainObjectConfig = getObjectConfig(mainObjectName);

    await computeFormulaVarsAndQuotes(formula, mainObjectConfig);
}

async function _computeFormula(formula: string, objectName:string, record: JsonMap, userSession: any, options?: SteedosFormulaOptions)
async function _computeFormula(formula: string, objectName:string, recordId: string, userSession: any, options?: SteedosFormulaOptions)
async function _computeFormula(formula: string, objectName:string, data: any, userSession: any, options?: SteedosFormulaOptions) {
    // 允许参数objectName为空，此时formula应该最多只引用了$user变量，未引用任何对象字段相关变量。
    const objectConfig = objectName ? getOriginalObjectConfig(objectName) : null;
    const varsAndQuotes = await computeFormulaVarsAndQuotes(formula, objectConfig);
    const vars = varsAndQuotes.vars;
    if (_.isEmpty(userSession)) {
        const required = isUserSessionRequiredForFormulaVars(vars);
        if(required){
            throw new Error(`The param 'userSession' is required for formula ${formula.replace("$", "\\$")}`);
        }
    }
    let doc: any = {};

    if(typeof data == "object" && data){
        doc = data;
    }else if(typeof data == "string"){
        if(objectName && data){
            const formulaVarFields = pickFormulaVarFields(vars);
            doc = await getSteedosSchema().getObject(objectName).findOne(data, { fields: formulaVarFields });
        }
    }

    let params = await computeFormulaParams(doc, vars, userSession);
    return runFormula(formula, params, options, {objectName});
}

export const computeFormula = _computeFormula 

async function _computeSimpleFormula(formula: string, data: any, userSession: any, options?: SteedosFormulaOptions) {
    // objectConfig参数值设置为null传入computeFormulaVarsAndQuotes表示计算不带objectConfig参数的普通公式变量
    const varsAndQuotes = await computeFormulaVarsAndQuotes(formula, null);
    const vars = varsAndQuotes.vars;

    if (_.isEmpty(userSession)) {
        const required = isUserSessionRequiredForFormulaVars(vars);
        if(required){
            throw new Error(`The param 'userSession' is required for formula ${formula.replace("$", "\\$")}`);
        }
    }

    let params = await computeFormulaParams(data, vars, userSession);
    return runFormula(formula, params, options);
}

export const computeSimpleFormula = _computeSimpleFormula 