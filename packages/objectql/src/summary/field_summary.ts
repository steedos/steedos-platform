import { SteedosFieldSummaryTypeConfig } from './type';
import { SteedosFieldFormulaTypeConfig } from '../formula';
import { getSteedosSchema } from '../types/schema';


export const getFieldSummaryConfigs = async(objectApiName?, fieldApiName?): Promise<Array<SteedosFieldSummaryTypeConfig>> => {
    return await getSteedosSchema().metadataBroker.call(`objects.getObjectFieldSummaryConfigs`, {objectApiName, fieldApiName})
}

export const getFieldSummaryConfig = async (fieldApiFullName: string): Promise<SteedosFieldSummaryTypeConfig> => {
    return await getSteedosSchema().metadataBroker.call(`objects.getObjectFieldSummaryConfig`, {fieldApiFullName})
}

/**
 * 获取对象本身的累计汇总配置
 * 不传入fieldName时取objectName关联的所有累计汇总配置
 * @param objectName 
 * @param fieldName 
 */
export const getObjectFieldSummaryConfigs = async(objectName: string, fieldName?: string): Promise<Array<SteedosFieldSummaryTypeConfig>> => {
    return await getFieldSummaryConfigs(objectName, fieldName);;
}


/**
 * 获取对象在哪些累计汇总中被引用
 * 不传入fieldNames时取objectName关联的所有累计汇总配置
 * @param objectName 
 * @param fieldNames 
 */
export const getObjectQuotedByFieldSummaryConfigs = async (objectName: string, fieldNames?: Array<string>): Promise<Array<SteedosFieldSummaryTypeConfig>> => {
    const configs = await getFieldSummaryConfigs(); //TODO 此处代码需要优化，取了所有配置。此处代码迁移到metadata objects services
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
export const getQuotedByFieldSummaryConfigs = async(config: SteedosFieldFormulaTypeConfig): Promise<Array<SteedosFieldSummaryTypeConfig>> => {
    return await getObjectQuotedByFieldSummaryConfigs(config.object_name, [config.field_name]);
}