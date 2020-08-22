import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig } from './type';
import { getFieldFormulaConfig, getQuotedByFieldFormulaConfigs } from './field_formula';
import { computeFieldFormulaValue, pickFieldFormulaVarFields, updateQuotedByObjectFieldFormulaValue } from './core';

const runCurrentFieldFormulas = async function (fieldFormulaConfig: SteedosFieldFormulaTypeConfig) {
    const { field_name: fieldName, object_name: objectName } = fieldFormulaConfig;
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: formulaVarFields })
    for (const doc of docs) {
        const value = await computeFieldFormulaValue(doc, fieldFormulaConfig);
        let setDoc = {};
        setDoc[fieldName] = value;
        console.log("===runCurrentFieldFormulas=setDoc====", setDoc);
        await getSteedosSchema().getObject(objectName).directUpdate(doc._id, setDoc);
        await runQuotedFieldFormulas(doc._id, fieldFormulaConfig)
    }
}

const runQuotedFieldFormulas = async function (recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig) {
    const configs = getQuotedByFieldFormulaConfigs(fieldFormulaConfig);
    for (const config of configs) {
        await updateQuotedByObjectFieldFormulaValue(fieldFormulaConfig.object_name, recordId, config);
    }
}

/**
 * 重算指定公式字段Id对应的公式值
 * @param fieldId 
 */
export const recomputeFormulaValues = async (fieldId: string) => {
    console.log("=====fieldId=========", fieldId);
    let config = getFieldFormulaConfig(fieldId);
    console.log("=====config=========", config);
    if (!config) {
        throw new Error(`recomputeFormulaValues:${fieldId} not found in field_formula configs.`);
    }
    return await recomputeFieldFormulaValues(config);
}

/**
 * 重算指定公式字段的公式值
 * @param fieldFormulaConfig 
 */
export const recomputeFieldFormulaValues = async (fieldFormulaConfig: SteedosFieldFormulaTypeConfig) => {
    await runCurrentFieldFormulas(fieldFormulaConfig);
    return true;
}