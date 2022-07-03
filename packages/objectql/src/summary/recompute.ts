/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: yinlianghui@steedos.com
 * @LastEditTime: 2022-07-03 14:28:50
 * @Description: 
 */
import { getSteedosSchema } from '../index';
import { SteedosFieldSummaryTypeConfig } from './type';
import { getFieldSummaryConfig } from './field_summary';
import { updateReferenceTosFieldSummaryValue } from './core';

const runCurrentFieldSummary = async function (fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) {
    const { object_name: objectName, reference_to_field_reference_to } = fieldSummaryConfig;
    const fieldName = reference_to_field_reference_to || "_id";
    const docs = await getSteedosSchema().getObject(objectName).find({ filters: [], fields: [fieldName] })
    await updateReferenceTosFieldSummaryValue(docs, fieldSummaryConfig, userSession);
}

/**
 * 重算指定累计汇总字段Id对应的汇总值
 * @param fieldId 
 */
export const recomputeSummaryValues = async (fieldId: string, userSession: any) => {
    let config = await getFieldSummaryConfig(fieldId);
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