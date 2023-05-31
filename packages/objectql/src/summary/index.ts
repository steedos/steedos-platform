/*
 * @Author: yinlianghui@steedos.com
 * @Date: 2022-04-13 10:31:03
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-30 10:34:10
 * @Description: 
 */
import { SteedosObjectTypeConfig } from '../types';
import { SteedosFieldSummaryTypeConfig, SteedosSummaryTypeValue, SteedosSummaryDataTypeValue, SupportedSummaryFieldTypes } from './type';
import { isFormulaFieldQuotingObjectAndFields } from '../formula';
import _ = require('lodash')
import { getObjectConfigs } from '@steedos/metadata-registrar';

export * from './type'
export * from './field_summary'
export * from './core'
export * from './recompute'

/**
 * 校验summaryConfig合法性并设置其reference_to_field、data_type属性值
 * 因为getObjectConfigs拿到的对象肯定不包括被禁用和假删除的对象，所以不需要额外判断相关状态
 * @param summaryConfig 
 */
export const initSummaryConfig = async(summaryConfig: SteedosFieldSummaryTypeConfig) => {
    const objectConfigs: Array<SteedosObjectTypeConfig> = getObjectConfigs("default");
    const { summary_object, field_name, object_name } = summaryConfig;
    let summaryObject = _.find(objectConfigs, (item) => {
        return item.name === summary_object;
    });
    if (!summaryObject) {
        // 如果不是零代码对象，直接报错，否则直接返回，待相关零代码对象加载进来时，会再进入该函数
        // if(isCodeObject(summary_object)){
        //     throw new Error(`The summary_object '${summary_object}' of the field '${field_name}' on the object '${object_name}' is not found in the default datasource.`);
        // }
        // else{
            return;
        // }
    }

    const referenceToField = _.find(summaryObject.fields, (item) => {
        return item.type === "master_detail" && item.reference_to === object_name;
    });
    if (!referenceToField) {
        throw new Error(`Can't fount a master_detail type field that reference_to the master object '${object_name}' on the summary_object '${summary_object}'.`);
    }
    summaryConfig.reference_to_field = referenceToField.name;
    summaryConfig.reference_to_field_reference_to = referenceToField.reference_to_field;
    if(!summaryConfig.data_type){
        throw new Error(`Invalid field type summary '${field_name}' on the object '${object_name}', miss data_type property.`);
    }
    const dataType = await getSummaryDataType(summaryConfig, summaryObject);
    if(dataType !== summaryConfig.data_type){
        throw new Error(`The data_type of the summary field '${field_name}' on the object '${object_name}' is incorrect, it should be '${dataType}' but is set to '${summaryConfig.data_type}'.`);
    }
    summaryConfig.data_type = dataType;
}

export const getSummaryDataType = async (summaryConfig: SteedosFieldSummaryTypeConfig, summaryObject: SteedosObjectTypeConfig) => {
    const { summary_object, summary_type, summary_field, field_name, object_name } = summaryConfig;
    let result: SteedosSummaryDataTypeValue;
    let needSummaryField = true;
    if(summary_type === SteedosSummaryTypeValue.COUNT){
        // 如果是COUNT类型，则忽然掉要聚合的字段
        needSummaryField = false;
    }
    else if(!summary_field){
        throw new Error(`You have to set a summary_field property for the field '${field_name}' of the object '${object_name}' when the summary_type is not set to 'count'.`);
    }
    if (summary_field && needSummaryField) {
        const field = summaryObject.fields[summary_field];
        if (field) {
            let fieldType = field.type;
            if(fieldType === "formula"){
                // 要聚合的是公式，则其数据类型为公式字段的数据类型
                // 因公式字段可能再引用当前汇总字段，所以要判断下不允许互相引用
                fieldType = field.data_type;
                const isQuotingTwoWay = await isFormulaFieldQuotingObjectAndFields(summary_object, summary_field, object_name, [field_name]);
                if(isQuotingTwoWay){
                    throw new Error(`Do not refer to each other, the field '${field_name}' of the master object '${object_name}' is summarizing a formula type summary_field '${summary_field}' of the detail object '${summary_object}', but the formula type field of the detail object exactly quoting the field of the master object, which is not allowed.`);
                }
            }
            if(fieldType === "summary"){
                // 要聚合的是汇总字段，则其数据类型为汇总字段的数据类型
                // 因两个对象之前不可能互为子表关系，所以汇总字段不存在互为汇总聚合关系，不需要进一步判断它们是否互相引用
                fieldType = field.data_type;
            }
            if(!isSummaryFieldTypeSupported(summary_type, fieldType)){
                throw new Error(`The summary data_type '${fieldType}' on the field '${field_name}' of the object '${object_name}' is not supported for the summary_type '${summary_type}' which only support these types: ${SupportedSummaryFieldTypes[summary_type]}.`);
            }
            result = <SteedosSummaryDataTypeValue>fieldType;
        }
        else {
            throw new Error(`The summary_field '${summary_field}' is not a field of the summary_object '${summary_object}'.`);
        }
    }
    else {
        result = SteedosSummaryDataTypeValue.Number;
    }
    return result;
}

export const isSummaryFieldTypeSupported = (summaryType: string, summaryFieldType: string) => {
    return !!(SupportedSummaryFieldTypes[summaryType] && SupportedSummaryFieldTypes[summaryType].indexOf(summaryFieldType) > -1)
}