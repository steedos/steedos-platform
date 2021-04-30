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
        if(summaryObjectName){
            const summaryFieldName = config.summary_field;
            if(summaryObjectName === objectName){
                if (fieldNames && fieldNames.length) {
                    if(fieldNames.indexOf(summaryFieldName) > -1){
                        return true;
                    }
                    const summaryFilters = config.summary_filters;
                    if(summaryFilters && summaryFilters.length){
                        // 如果汇总过滤条件中正好包括了fieldNames中一某个字段的话，也需要重新触发该汇总字段重新计算
                        return !!fieldNames.find((fieldName)=>{
                            return new RegExp(`\\b${fieldName}\\b`).test(JSON.stringify(summaryFilters))
                        })
                    }
                    return false;
                }
                else{
                    return true;
                }
            }
            else{
                return false;
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