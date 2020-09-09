import { getSteedosSchema } from '../index';
import { SteedosFieldSummaryTypeConfig } from './type';
import { getFieldSummaryConfig } from './field_summary';
import { updateReferenceTosFieldSummaryValue } from './core';

const runCurrentFieldSummary = async function (fieldSummaryConfig: SteedosFieldSummaryTypeConfig, currentUserId: string) {
    const { object_name: objectName } = fieldSummaryConfig;
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: ["_id"] })
    await updateReferenceTosFieldSummaryValue(docs, fieldSummaryConfig, currentUserId);
}

/**
 * 重算指定累计汇总字段Id对应的汇总值
 * @param fieldId 
 */
export const recomputeSummaryValues = async (fieldId: string, currentUserId: string) => {
    let config = getFieldSummaryConfig(fieldId);
    if (!config) {
        throw new Error(`recomputeSummaryValues:${fieldId} not found in field_summary configs.`);
    }
    return await recomputeFieldSummaryValues(config, currentUserId);
}

/**
 * 重算指定累计汇总字段的汇总值
 * @param fieldSummaryConfig 
 */
export const recomputeFieldSummaryValues = async (fieldSummaryConfig: SteedosFieldSummaryTypeConfig, currentUserId: string) => {
    await runCurrentFieldSummary(fieldSummaryConfig, currentUserId);
    return true;
}