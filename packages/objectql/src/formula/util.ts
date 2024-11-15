import { SteedosFieldFormulaTypeConfig, SteedosFormulaVarPathTypeConfig, SteedosFormulaVarTypeConfig } from './type';
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

function includesAny(mainString, stringArray) {
    return _.some(stringArray, (substr) => mainString.includes(substr));
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
    }else if(config.formula){
        return includesAny(config.formula, fieldNames);
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

/**
 * 当userSession为空时，确认参数configs中没有引用$user变量
 * @param configs
 */
export const checkUserSessionNotRequiredForFieldFormulas = (configs: SteedosFieldFormulaTypeConfig | Array<SteedosFieldFormulaTypeConfig> | any) => {
    if (!_.isArray(configs)) {
        configs = [configs];
    }
    if(!configs.length){
        return;
    }
    for(let config of configs){
        let { vars, object_name: objectName, field_name: fieldName, formula } = config;
        let required = isUserSessionRequiredForFormulaVars(vars);
        if(required){
            throw new Error(`The param 'userSession' is required while running the formula '${formula.replace("$", "\\$")}' of field '${fieldName}' on the object '${objectName}'`);
        }
    }
}

/**
 * 当currentUserId为空时，判断参数vars中是否有引用$user变量
 * @param configs
 */
export const isUserSessionRequiredForFormulaVars = (vars: Array<SteedosFormulaVarTypeConfig>) => {
    let required = !!vars.find(({ is_user_var: isUserVar, is_user_session_var: isUserSessionVar })=>{
        return isUserVar || isUserSessionVar;
    });
    return required;
}

/**
 * 把公式变量中需要聚合查询的paths转换为aggregate函数级联查询需要的lookups，
 * 比如合同对象某个公式字段中有变量{company_id.organization.name}需要聚合查询的paths为：
 * [{"field_name":"company_id","reference_from":"contracts"},{"field_name":"organization","reference_from":"company"},{"field_name":"name","reference_from":"organizations"}]
 * 将转换返回：
[{
    $lookup: {
        from: 'company',
        localField: 'company_id',
        foreignField: '_id',
        as: '@lookup_company_id'
    }
},{
    $lookup: {
        from: 'organizations',
        localField: '@lookup_company_id.organization',
        foreignField: '_id',
        as: '@lookup_company_id.organization'
    }
}]
以上返回的lookup可用于当修改组织的名称时，找到合同中引用了该组织记录的记录，并重算其对应的公式字段值
 * @param paths 该参数最后一项的reference_from即为需要聚合查询的对象，亦即为当前正在修改对象（需要查找数据库中有哪些对象记录引用了该对象上的字段）
 */
export const getFormulaVarPathsAggregateLookups = (paths: Array<SteedosFormulaVarPathTypeConfig>) => {
    if (!paths.length) {
        return [];
    }
    let lookups = [], currentPath: SteedosFormulaVarPathTypeConfig, nextPath: SteedosFormulaVarPathTypeConfig;
    let tempLookupAs: string = "", tempLookupLocalField: string = "";
    for (let i = 0; i < paths.length - 1; i++) {
        currentPath = paths[i];
        nextPath = paths[i + 1];
        tempLookupLocalField = currentPath.field_name;
        if(tempLookupAs){
            tempLookupLocalField = `${tempLookupAs}.${tempLookupLocalField}`;
            tempLookupAs = tempLookupLocalField;
        }
        else{
            tempLookupAs = `__lookup__${currentPath.field_name}`;
        }
        let foreignField = currentPath.reference_to_field ? currentPath.reference_to_field : '_id';
        lookups.push({
            $lookup: {
                from: nextPath.reference_from,
                localField: tempLookupLocalField,
                foreignField,
                as: tempLookupAs
            }
        });
    }
    return lookups;
}