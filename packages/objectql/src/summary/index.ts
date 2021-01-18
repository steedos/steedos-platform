import { SteedosObjectTypeConfig, SteedosFieldTypeConfig, getObjectConfigs } from '../types';
import { SteedosFieldSummaryTypeConfig, SteedosSummaryTypeValue, SteedosSummaryDataTypeValue, SupportedSummaryFieldTypes } from './type';
import { addFieldSummaryConfig, clearFieldSummaryConfigs } from './field_summary';
import { isSystemObject } from '../util';
import { isFormulaFieldQuotingObjectAndFields } from '../formula';
import _ = require('lodash')
const clone = require('clone')

export * from './type'
export * from './field_summary'
export * from './core'
export * from './recompute'

/**
 * 校验summaryConfig合法性并设置其reference_to_field、data_type属性值
 * 因为getObjectConfigs拿到的对象肯定不包括被禁用和假删除的对象，所以不需要额外判断相关状态
 * @param summaryConfig 
 */
export const initSummaryConfig = (summaryConfig: SteedosFieldSummaryTypeConfig) => {
    const objectConfigs: Array<SteedosObjectTypeConfig> = getObjectConfigs("default");
    const { summary_object, field_name, object_name } = summaryConfig;
    let summaryObject = _.find(objectConfigs, (item) => {
        return item.name === summary_object;
    });
    if (!summaryObject) {
        // 如果不是零代码对象，直接报错，否则直接返回，待相关零代码对象加载进来时，会再进入该函数
        if(isSystemObject(summary_object)){
            throw new Error(`The summary_object '${summary_object}' of the field '${field_name}' on the object '${object_name}' is not found in the default datasource.`);
        }
        else{
            return;
        }
    }

    const referenceToField = _.find(summaryObject.fields, (item) => {
        return item.type === "master_detail" && item.reference_to === object_name;
    });
    if (!referenceToField) {
        throw new Error(`Can't fount a master_detail type field that reference_to the master object '${object_name}' on the summary_object '${summary_object}'.`);
    }
    summaryConfig.reference_to_field = referenceToField.name;
    if(!summaryConfig.data_type){
        throw new Error(`Invalid field type summary '${field_name}' on the object '${object_name}', miss data_type property.`);
    }
    const dataType = getSummaryDataType(summaryConfig, summaryObject);
    if(dataType !== summaryConfig.data_type){
        throw new Error(`The data_type of the summary field '${field_name}' on the object '${object_name}' is incorrect, it should be '${dataType}' but is set to '${summaryConfig.data_type}'.`);
    }
    summaryConfig.data_type = dataType;
}

export const getSummaryDataType = (summaryConfig: SteedosFieldSummaryTypeConfig, summaryObject: SteedosObjectTypeConfig) => {
    const { summary_object, summary_type, summary_field, field_name, object_name } = summaryConfig;
    let result: SteedosSummaryDataTypeValue;
    if (summary_field) {
        if (summary_type === SteedosSummaryTypeValue.COUNT) {
            throw new Error(`You can't set a summary_field property for the field '${field_name}' of the object '${object_name}' while the summary_type is set to 'count'.`);
        }
        const field = summaryObject.fields[summary_field];
        if (field) {
            let fieldType = field.type;
            if(fieldType === "formula"){
                // 要聚合的是公式，则其数据类型为公式字段的数据类型
                // 因公式字段可能再引用当前汇总字段，所以要判断下不允许互相引用
                fieldType = field.data_type;
                const isQuotingTwoWay = isFormulaFieldQuotingObjectAndFields(summary_object, summary_field, object_name, [field_name]);
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
        if (summary_type !== "count") {
            throw new Error(`You have to set a summary_field property for the field '${field_name}' of the object '${object_name}' when the summary_type is not set to 'count'.`);
        }
        result = SteedosSummaryDataTypeValue.Number;
    }
    return result;
}

export const isSummaryFieldTypeSupported = (summaryType: string, summaryFieldType: string) => {
    return !!(SupportedSummaryFieldTypes[summaryType] && SupportedSummaryFieldTypes[summaryType].indexOf(summaryFieldType) > -1)
}

export const addObjectFieldSummaryConfig = (fieldConfig: SteedosFieldTypeConfig, objectConfig: SteedosObjectTypeConfig) => {
    let summaryConfig: SteedosFieldSummaryTypeConfig = {
        _id: `${objectConfig.name}.${fieldConfig.name}`,
        object_name: objectConfig.name,
        field_name: fieldConfig.name,
        summary_object: fieldConfig.summary_object,
        summary_type: <SteedosSummaryTypeValue>fieldConfig.summary_type,
        data_type: fieldConfig.data_type,
        summary_field: fieldConfig.summary_field,
        summary_filters: fieldConfig.summary_filters
    };
    
    initSummaryConfig(summaryConfig);
    addFieldSummaryConfig(summaryConfig);
}

export const addObjectFieldsSummaryConfig = (config: SteedosObjectTypeConfig, datasource: string) => {
    _.each(config.fields, function (field) {
        if (field.type === "summary") {
            if (datasource !== "default") {
                throw new Error(`The type of the field '${field.name}' on the object '${config.name}' can't be 'summary', because it is not in the default datasource.`);
            }
            try {
                // 这里一定要加try catch，否则某个字段报错后，后续其他字段及其他对象就再也没有正常加载了
                addObjectFieldSummaryConfig(clone(field), config);
            } catch (error) {
                console.error(error);
            }
        }
    })
}

export const initObjectFieldsSummarys = (datasource: string) => {
    if(datasource === "default"){
        // 因为要考虑对象和字段可能被禁用、删除的情况，所以需要先清除下原来的内存数据
        // 暂时只支持默认数据源，后续如果要支持多数据源时需要传入datasource参数清除数据
        clearFieldSummaryConfigs()
    }
    const objectConfigs = getObjectConfigs(datasource)
    // console.log("===initObjectFieldsSummarys==objectConfigs=", JSON.stringify(_.map(objectConfigs, 'name')))
    _.each(objectConfigs, function (objectConfig) {
        addObjectFieldsSummaryConfig(objectConfig, datasource);
    })
    // console.log("===initObjectFieldsSummarys===", JSON.stringify(getFieldSummaryConfigs()))
}