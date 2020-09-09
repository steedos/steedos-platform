import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig } from './type';
import { checkCurrentUserIdNotRequiredForFieldFormulas } from './util';
import { getFieldFormulaConfig, getQuotedByFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, pickFieldFormulaVarFields, updateQuotedByObjectFieldFormulaValue } from './core';

const runCurrentFieldFormulas = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) {
    const { field_name: fieldName, object_name: objectName } = fieldFormulaConfig;
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: formulaVarFields })
    for (const doc of docs) {
        const value = await computeFieldFormulaValue(doc, fieldFormulaConfig, currentUserId);
        let setDoc = {};
        setDoc[fieldName] = value;
        await getSteedosSchema().getObject(objectName).directUpdate(doc._id, setDoc);
        await runQuotedFieldFormulas(doc._id, fieldFormulaConfig, currentUserId)
    }
}

const runQuotedFieldFormulas = async function (recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) {
    const quotedBys = getQuotedByFieldFormulaConfigs(fieldFormulaConfig);
    for (const config of quotedBys.allConfigs) {
        await updateQuotedByObjectFieldFormulaValue(fieldFormulaConfig.object_name, recordId, config, currentUserId);
    }
}

/**
 * 重算指定公式字段Id对应的公式值
 * @param fieldId 
 */
export const recomputeFormulaValues = async (fieldId: string, currentUserId: string) => {
    let config = getFieldFormulaConfig(fieldId);
    if (!config) {
        throw new Error(`recomputeFormulaValues:${fieldId} not found in field_formula configs.`);
    }
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(config);
    }
    return await recomputeFieldFormulaValues(config, currentUserId);
}

/**
 * 重算指定公式字段的公式值
 * @param fieldFormulaConfig 
 */
export const recomputeFieldFormulaValues = async (fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) => {
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(fieldFormulaConfig);
    }
    await runCurrentFieldFormulas(fieldFormulaConfig, currentUserId);
    return true;
}