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
