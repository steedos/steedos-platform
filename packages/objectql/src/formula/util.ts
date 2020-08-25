import { SteedosFieldFormulaTypeConfig } from './type';
import _ = require('lodash')

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
 * @param configs 
 */
export const sortFieldFormulaConfigs = (configs: Array<SteedosFieldFormulaTypeConfig>): Array<SteedosFieldFormulaTypeConfig> => {
    let sortedConfigs = [];
    configs.forEach((config) => {
        addSortedFieldFormulaConfig(config, configs, sortedConfigs);
    });
    return sortedConfigs;
}

/**
 * 当userSession为空时，确认参数configs中没有引用$user变量
 * @param configs
 */
export const checkUserSessionNotRequiredForFieldFormulas = (configs: SteedosFieldFormulaTypeConfig | Array<SteedosFieldFormulaTypeConfig>) => {
    if (!_.isArray(configs)) {
        configs = [configs];
    }
    if(!configs.length){
        return;
    }
    for(let config of configs){
        let { vars, object_name: objectName, field_name: fieldName } = config;
        let required = !!vars.find(({ is_user_session_var: isUserSessionVar })=>{
            return isUserSessionVar;
        });
        if(required){
            throw new Error(`The param 'userSession' is required for the formula of '${fieldName}' on the object '${objectName}'`);
        }
    }
}