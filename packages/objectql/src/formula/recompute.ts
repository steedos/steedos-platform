import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig } from './type';
import { checkUserSessionNotRequiredForFieldFormulas } from './util';
import { getFieldFormulaConfig, getQuotedByFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, pickFieldFormulaVarFields, updateQuotedByObjectFieldFormulaValue } from './core';
import { SteedosUserSession } from '../types';

const runCurrentFieldFormulas = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: SteedosUserSession) {
    const { field_name: fieldName, object_name: objectName } = fieldFormulaConfig;
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: formulaVarFields })
    for (const doc of docs) {
        const value = await computeFieldFormulaValue(doc, fieldFormulaConfig, userSession);
        let setDoc = {};
        setDoc[fieldName] = value;
        await getSteedosSchema().getObject(objectName).directUpdate(doc._id, setDoc);
        await runQuotedFieldFormulas(doc._id, fieldFormulaConfig, userSession)
    }
}

const runQuotedFieldFormulas = async function (recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: SteedosUserSession) {
    const configs = getQuotedByFieldFormulaConfigs(fieldFormulaConfig);
    for (const config of configs) {
        await updateQuotedByObjectFieldFormulaValue(fieldFormulaConfig.object_name, recordId, config, userSession);
    }
}

/**
 * 重算指定公式字段Id对应的公式值
 * @param fieldId 
 */
export const recomputeFormulaValues = async (fieldId: string, userSession: SteedosUserSession) => {
    let config = getFieldFormulaConfig(fieldId);
    if (!config) {
        throw new Error(`recomputeFormulaValues:${fieldId} not found in field_formula configs.`);
    }
    if (!userSession) {
        checkUserSessionNotRequiredForFieldFormulas(config);
    }
    return await recomputeFieldFormulaValues(config, userSession);
}

/**
 * 重算指定公式字段的公式值
 * @param fieldFormulaConfig 
 */
export const recomputeFieldFormulaValues = async (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: SteedosUserSession) => {
    if (!userSession) {
        checkUserSessionNotRequiredForFieldFormulas(fieldFormulaConfig);
    }
    await runCurrentFieldFormulas(fieldFormulaConfig, userSession);
    return true;
}