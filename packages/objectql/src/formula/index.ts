import { SteedosObjectTypeConfig, getObjectConfig, getSteedosSchema } from '../types';
import { SteedosFormulaOptions } from './type';
import { computeFormulaParams, pickFormulaVarFields, runFormula } from './core';
import { isCurrentUserIdRequiredForFormulaVars } from './util';
import { JsonMap } from "@salesforce/ts-types";

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

async function _computeFormula(formula: string, objectName:string, record: JsonMap, currentUserId: string, spaceId: string, options?: SteedosFormulaOptions)
async function _computeFormula(formula: string, objectName:string, recordId: string, currentUserId: string, spaceId: string, options?: SteedosFormulaOptions)
async function _computeFormula(formula: string, objectName:string, data: any, currentUserId: string, spaceId: string, options?: SteedosFormulaOptions) {
    // 允许参数objectName为空，此时formula应该最多只引用了$user变量，未引用任何对象字段相关变量。
    const objectConfig = objectName ? getObjectConfig(objectName) : null;
    const varsAndQuotes = await computeFormulaVarsAndQuotes(formula, objectConfig);
    const vars = varsAndQuotes.vars;
    if (!currentUserId) {
        const required = isCurrentUserIdRequiredForFormulaVars(vars);
        if(required){
            throw new Error(`The param 'currentUserId' is required for formula ${formula.replace("$", "\\$")}`);
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

    if(spaceId){
        doc.space = spaceId;
    }
    let params = await computeFormulaParams(doc, vars, currentUserId);
    return runFormula(formula, params, options, {objectName});
}

export const computeFormula = _computeFormula 

async function _computeSimpleFormula(formula: string, data: any, currentUserId?: string, spaceId?: string, options?: SteedosFormulaOptions) {
    // objectConfig参数值设置为null传入computeFormulaVarsAndQuotes表示计算不带objectConfig参数的普通公式变量
    const varsAndQuotes = await computeFormulaVarsAndQuotes(formula, null);
    const vars = varsAndQuotes.vars;
    if (!currentUserId) {
        const required = isCurrentUserIdRequiredForFormulaVars(vars);
        if(required){
            throw new Error(`The param 'currentUserId' is required for formula ${formula.replace("$", "\\$")}`);
        }
    }
    if(spaceId){
        data.space = spaceId;
    }

    let params = await computeFormulaParams(data, vars, currentUserId);
    return runFormula(formula, params, options);
}

export const computeSimpleFormula = _computeSimpleFormula 