import { SteedosFieldFormulaTypeConfig } from './type';

/**
 * 从参数sourceConfigs中找到参数config中引用过的公式字段配置
 * @param config 
 * @param sourceConfigs 
 */
export const getQuotedFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig, sourceConfigs: Array<SteedosFieldFormulaTypeConfig>): Array<SteedosFieldFormulaTypeConfig> => {
    const { quotes } = config;
    if (quotes && quotes.length) {
        return sourceConfigs.filter((sourceConfig: SteedosFieldFormulaTypeConfig) => {
            return !!quotes.find((quote) => {
                return quote.object_name === sourceConfig.object_name && quote.field_name === sourceConfig.field_name;
            });
        });
    }
    else {
        return [];
    }
}

/**
 * 参数configA中是否引用了参数configB
 * @param configA 
 * @param configB 
 */
export const isFieldFormulaConfigQuoted = (configA: SteedosFieldFormulaTypeConfig, configB: SteedosFieldFormulaTypeConfig): boolean => {
    let configAQuoteds = getQuotedFieldFormulaConfigs(configA, [configB]);
    return !!configAQuoteds.length;
}

/**
 * 公式字段配置是否引用了某个对象和字段
 * @param config 公式字段配置
 * @param object_name 是否引用了该对象
 * @param field_name 是否引用了该字段
 */
export const isFieldFormulaConfigQuotingObjectAndFields =(config: SteedosFieldFormulaTypeConfig, objectName: string, fieldNames?: Array<string>): boolean => {
    const { quotes } = config;
    if (quotes && quotes.length) {
        return !!quotes.find((quote) => {
            if (fieldNames && fieldNames.length) {
                return quote.object_name === objectName && fieldNames.indexOf(quote.field_name) > -1;
            }
            else {
                return quote.object_name === objectName;
            }
        });
    }
    else {
        return false;
    }
}

/**
 * 参数config是否与sourceConfigs中任何一项有双向引用关系
 * 
 * @param config 
 * @param sourceConfigs 
 */
export const isFieldFormulaConfigQuotedTwoWays = (config: SteedosFieldFormulaTypeConfig, sourceConfigs: Array<SteedosFieldFormulaTypeConfig>): boolean => {
    let quotedConfigs = getQuotedFieldFormulaConfigs(config, sourceConfigs);
    if(!quotedConfigs.length){
        return false;
    }
    for(let quotedConfig of quotedConfigs){
        let isQuotedConfigQuoted = isFieldFormulaConfigQuoted(quotedConfig, config);
        if(isQuotedConfigQuoted){
            throw new Error(`isFieldFormulaConfigQuotedTwoWays:The field formula config '${config._id}' and '${quotedConfig._id}' is quoted each other.`);
            return true;
        }
    }
    return false;
}

/**
 * 参数configA与参数configB是否存在双向引用关系
 * @param configA 
 * @param configB 
 */
export const isFieldFormulaConfigQuotedTwoWay = (configA: SteedosFieldFormulaTypeConfig, configB: SteedosFieldFormulaTypeConfig): boolean => {
    return isFieldFormulaConfigQuotedTwoWays(configA, [configB]);
}

/**
 * 往参数configs中插入config，排除掉重复记录
 * @param config 
 * @param configs 
 */
export const  addToFieldFormulaConfigs = (config: SteedosFieldFormulaTypeConfig, configs: Array<SteedosFieldFormulaTypeConfig>) => {
    let existedConfig = configs.find((item) => {
        return item._id === config._id
    });
    if (!existedConfig) {
        configs.push(config);
    }
}

const addSortedFieldFormulaConfig = (config: SteedosFieldFormulaTypeConfig, sourceConfigs: Array<SteedosFieldFormulaTypeConfig>, sortedConfigs: Array<SteedosFieldFormulaTypeConfig>) => {
    const quotedConfigs = getQuotedFieldFormulaConfigs(config, sourceConfigs);
    quotedConfigs.forEach((quotedConfig) => {
        addSortedFieldFormulaConfig(quotedConfig, sourceConfigs, sortedConfigs);
    });
    addToFieldFormulaConfigs(config, sortedConfigs);
}

/**
 * 根据公式引用关系对字段公式配置进行排序
 * 这里不能用sort函数，因为sort函数只支持两个数值或对象中两个数值属性对比
 * 规则是把其中被依赖的公式字段配置放前面
 * @param configs 
 */
export const sortFieldFormulaConfigs = (configs: Array<SteedosFieldFormulaTypeConfig>): Array<SteedosFieldFormulaTypeConfig> => {
    if(configs.length <= 1){
        // 只有一个时，不需要排序，直接返回
        return configs;
    }
    let sortedConfigs = [];
    configs.forEach((config) => {
        addSortedFieldFormulaConfig(config, configs, sortedConfigs);
    });
    return sortedConfigs;
}
