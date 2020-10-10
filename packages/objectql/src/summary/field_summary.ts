import { addConfig, removeManyConfigs, getConfigs, getConfig } from '../types';
import { SteedosFieldSummaryTypeConfig } from './type';
import { SteedosFieldFormulaTypeConfig } from '../formula';

export const addFieldSummaryConfig = (config: SteedosFieldSummaryTypeConfig) => {
    addConfig('field_summary', config);
}

export const clearFieldSummaryConfigs = (query?: object) => {
    removeManyConfigs('field_summary', query);
}

export const getFieldSummaryConfigs = (): Array<SteedosFieldSummaryTypeConfig> => {
    return getConfigs('field_summary')
}

export const getFieldSummaryConfig = (_id: string): SteedosFieldSummaryTypeConfig => {
    return getConfig('field_summary', _id);
}

/**
 * 获取对象本身的累计汇总配置
 * 不传入fieldName时取objectName关联的所有累计汇总配置
 * @param objectName 
 * @param fieldName 
 */
export const getObjectFieldSummaryConfigs = (objectName: string, fieldName?: string): Array<SteedosFieldSummaryTypeConfig> => {
    const configs = getFieldSummaryConfigs();
    let result = configs.filter((config: SteedosFieldSummaryTypeConfig) => {
        if (fieldName) {
            return config.object_name === objectName && config.field_name === fieldName;
        }
        else {
            return config.object_name === objectName;
        }
    });
    return result;
}


/**
 * 获取对象在哪些累计汇总中被引用
 * 不传入fieldNames时取objectName关联的所有累计汇总配置
 * @param objectName 
 * @param fieldNames 
 */
export const getObjectQuotedByFieldSummaryConfigs = (objectName: string, fieldNames?: Array<string>): Array<SteedosFieldSummaryTypeConfig> => {
    const configs = getFieldSummaryConfigs();
    return configs.filter((config: SteedosFieldSummaryTypeConfig) => {
        const summaryObjectName = config.summary_object;
        const summaryFieldName = config.summary_field;
        if(summaryObjectName){
            if (fieldNames && fieldNames.length) {
                return summaryObjectName === objectName && fieldNames.indexOf(summaryFieldName) > -1;
            }
            else {
                return summaryObjectName === objectName;
            }
        }
        else {
            return false;
        }
    });
}

/**
 * 获取参数config在哪些累计汇总中被引用
 * @param config 
 */
export const getQuotedByFieldSummaryConfigs = (config: SteedosFieldFormulaTypeConfig): Array<SteedosFieldSummaryTypeConfig> => {
    return getObjectQuotedByFieldSummaryConfigs(config.object_name, [config.field_name]);
}