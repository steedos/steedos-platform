import { getSteedosSchema } from '../index';
import { SteedosFieldSummaryTypeConfig } from './type';
import { getFieldSummaryConfig } from './field_summary';
import { updateReferenceTosFieldSummaryValue } from './core';

const runCurrentFieldSummary = async function (fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) {
    const { object_name: objectName } = fieldSummaryConfig;
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: ["_id"] })
    await updateReferenceTosFieldSummaryValue(docs, fieldSummaryConfig, userSession);
}

/**
 * 重算指定累计汇总字段Id对应的汇总值
 * @param fieldId 
 */
export const recomputeSummaryValues = async (fieldId: string, userSession: any) => {
    let config = getFieldSummaryConfig(fieldId);
    if (!config) {
        throw new Error(`recomputeSummaryValues:${fieldId} not found in field_summary configs.`);
    }
    return await recomputeFieldSummaryValues(config, userSession);
}

/**
 * 重算指定累计汇总字段的汇总值
 * @param fieldSummaryConfig 
 */
export const recomputeFieldSummaryValues = async (fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    await runCurrentFieldSummary(fieldSummaryConfig, userSession);
    return true;
}