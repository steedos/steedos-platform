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
export const getQuotedByFieldSummaryConfigs = async(config: SteedosFieldFormulaTypeConfig): Promise<Array<SteedosFieldSummaryTypeConfig>> => {
    return await getObjectQuotedByFieldSummaryConfigs(config.object_name, [config.field_name]);
}