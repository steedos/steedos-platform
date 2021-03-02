import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaQuoteTypeConfig, SteedosFormulaVarTypeConfig, SteedosFormulaVarPathTypeConfig, FormulaUserKey, SteedosFormulaBlankValue } from './type';
import { pickFormulaVars } from './core';
// import { isCodeObject } from '../util'; TODO

import _ = require('lodash')
const clone = require('clone')

//TODO
// const isCodeObject = (objectApiName)=>{
//     return objectApiName ? true : false
// }

const addFieldFormulaQuotesConfig = (quote: SteedosFieldFormulaQuoteTypeConfig, quotes: Array<SteedosFieldFormulaQuoteTypeConfig>) => {
    if(quote.field_name === "_id"){
        // _id字段不记为引用关系，因为其值不会变化，相关记录属性变更时不需要重算被引用的字段公式
        return;
    }
    let existQuote = quotes.find((item) => {
        return item.field_name === quote.field_name && item.object_name === quote.object_name
    });
    if (!existQuote) {
        quotes.push(quote);
    }
}

/**
 * 把公式中a.b.c，比如account.website这样的变量转为SteedosFieldFormulaQuoteTypeConfig和SteedosFieldFormulaVarTypeConfig追加到quotes和vars中
 * 因为getObjectConfigs拿到的对象肯定不包括被禁用和假删除的对象，所以不需要额外判断相关状态
 * @param formulaVar 公式中的单个变量，比如account.website
 * @param fieldConfig 
 * @param objectConfigs 
 * @param quotes 
 */
const computeFormulaVarAndQuotes = (formulaVar: string, objectConfig: any,  quotes: Array<SteedosFieldFormulaQuoteTypeConfig>, vars: Array<SteedosFormulaVarTypeConfig>) => {
    // 公式变量以FormulaUserSessionKey（即$user）值开头，说明是userSession变量
    let isUserVar = new RegExp(`^${FormulaUserKey.replace("$","\\$")}\\b`).test(formulaVar);
    let varItems = formulaVar.split(".");
    let paths: Array<SteedosFormulaVarPathTypeConfig> = [];
    let formulaVarItem: SteedosFormulaVarTypeConfig = {
        key: formulaVar,
        paths: paths
    };
    if (isUserVar) {
        // 如果是userSession变量，则不需要计算quotes引用，但是其paths值需要正常记录下来
        formulaVarItem.is_user_var = true;
        // vars.push(formulaVarItem);
        // return;
    }
    else{
        if(formulaVar.startsWith("$")){
            throw new Error(`computeFormulaVarAndQuotes:The formula var '${formulaVar}' is starts with '$' but not a user session var that starts with $user.`);
        }
        if(!objectConfig){
            // 不是$user变量时，需要传入objectConfig参数
            throw new Error(`computeFormulaVarAndQuotes:The 'objectConfig' is required for the formula var '${formulaVar}'`);
        }
    }
    let tempObjectConfig = objectConfig;
    for (let i = 0; i < varItems.length; i++) {
        let varItem = varItems[i];
        let tempFieldConfig: any;
        const isUserKey = varItem === FormulaUserKey;
        if(varItem === "_id"){
            // 支持_id属性
            tempFieldConfig = {
                name: varItem,
                type: "text"
            }
        }
        else if(isUserKey){
            // 如果是$user变量，则特殊处理下
            tempFieldConfig = {
                name: varItem,
                type: "lookup",
                reference_to: "space_users"
            }
        }
        else{
            tempFieldConfig = tempObjectConfig.fields[varItem];
        }
        if (!tempFieldConfig) {
            // 不是对象上的字段，则直接退出，这里注意公式中引用零代码中的字段的话，公式中字段名需要手动加上__c后缀（因为用户填写的api名称不带__c，是内核会自动加后缀），否则会找不到
            throw new Error(`computeFormulaVarAndQuotes:Can't find the field '${varItem}' on the object '${tempObjectConfig.name}' for the formula var '${formulaVar}'`);
        }
        let isFormulaType = tempFieldConfig.type === "formula";
        if(!isUserKey){
            let tempFieldFormulaVarPath: SteedosFormulaVarPathTypeConfig = {
                field_name: varItem,
                reference_from: tempObjectConfig.name
            };
            if (isFormulaType) {
                tempFieldFormulaVarPath.is_formula = true;
            }
            // 当是$user时，不需要把第一个path记录下来，只需要记录其后续的路径即可
            paths.push(tempFieldFormulaVarPath);
        }
        if (!isUserVar) {
            // $user变量不需要记录引用关系，因为没法确定每条record当时对应的当前用户ID是多少
            // 自己可以引用自己，i大于0就是其他对象上的引用
            let tempFieldFormulaQuote: SteedosFieldFormulaQuoteTypeConfig = {
                object_name: tempObjectConfig.name,
                field_name: tempFieldConfig.name
            };
            if(i === 0 && i === varItems.length - 1){
                // 是引用的本对象上自身的字段，即自己引用自己
                tempFieldFormulaQuote.is_own = true;
            }
            if (isFormulaType) {
                tempFieldFormulaQuote.is_formula = true;
            }
            addFieldFormulaQuotesConfig(tempFieldFormulaQuote, quotes);
        }
        if (tempFieldConfig.type === "lookup" || tempFieldConfig.type === "master_detail") {
            // 引用类型字段
            if (tempFieldConfig.multiple) {
                // TODO:暂时不支持数组的解析，见：公式字段中要实现lookup关联到数组字段的情况 #783
                throw new Error(`computeFormulaVarAndQuotes:The field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is a multiple ${tempFieldConfig.type} type, it is not supported yet.`);
            }
            if (i === varItems.length - 1) {
                // 引用类型字段后面必须继续引用该字段的相关属性，否则直接报错
                throw new Error(`computeFormulaVarAndQuotes:The field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is a ${tempFieldConfig.type} type, so you must add more property after it.`);
            }
        }
        else {
            // 不是引用类型字段，则直接退出
            if (i < varItems.length - 1) {
                // 提前找到非跨对象字段，说明varItems中后面没计算的变量是多余错误的，因为.后面肯定是跨对象引用出来的字段（除非是$user等全局变量）
                throw new Error(`computeFormulaVarAndQuotes:The field '${tempFieldConfig.name}' for the formula var '${formulaVar}' is not a lookup/master_detail type, so you can't get more property for it.`);
            }
            break;
        }
        if (typeof tempFieldConfig.reference_to !== "string") {
            // 暂时只支持reference_to为字符的情况，其他类型直接跳过
            throw new Error(`Field ${tempFieldConfig.name} in formula ${formulaVar} does not define the "Reference Object" property or its "Reference Object" property is a function.`);
        }
        // TODO：重新计算reference_to的对象是否存在
        // tempObjectConfig = objectConfigs.find((item) => {
        //     return item.name === tempFieldConfig.reference_to;
        // });
        // if (!tempObjectConfig) {
        //     // 没找到相关引用对象，直接退出
        //     // 如果不是零代码对象，直接报错，否则直接返回，待相关零代码对象加载进来时，会再进入该函数
        //     if(isCodeObject(tempFieldConfig.reference_to)){
        //         throw new Error(`computeFormulaVarAndQuotes:Can't find the object reference_to '${tempFieldConfig.reference_to}' by the field '${tempFieldConfig.name}' for the formula var '${formulaVar}'`);
        //     }
        //     else{
        //         return;
        //     }
        // }
    }
    vars.push(formulaVarItem);
}

/**
 * 根据公式内容，取出其中{}中的变量，返回计算后的公式引用集合
 * @param formula 
 * @param fieldConfig 
 */
const computeFormulaVarsAndQuotes = (formula: string, objectConfig: any) => {
    let quotes: Array<SteedosFieldFormulaQuoteTypeConfig> = [];
    let vars: Array<SteedosFormulaVarTypeConfig> = [];
    const formulaVars = pickFormulaVars(formula);
    formulaVars.forEach((formulaVar) => {
        computeFormulaVarAndQuotes(formulaVar, objectConfig, quotes, vars);
    });
    return { quotes, vars };
}

// export const addObjectFieldFormulaConfig = (fieldConfig: any, objectConfig: any) => {
//     const formula = fieldConfig.formula;
//     let result = computeFormulaVarsAndQuotes(formula, objectConfig);
//     let formulaConfig: SteedosFieldFormulaTypeConfig = {
//         _id: `${objectConfig.name}.${fieldConfig.name}`,
//         object_name: objectConfig.name,
//         field_name: fieldConfig.name,
//         formula: formula,
//         data_type: fieldConfig.data_type,
//         formula_blank_value: <SteedosFormulaBlankValue>fieldConfig.formula_blank_value,
//         quotes: result.quotes,
//         vars: result.vars
//     };

    
//     _.each(result.quotes, (quote)=>{
//         addFormulaReferenceMaps(`${objectConfig.name}.${fieldConfig.name}`, `${quote.object_name}.${quote.field_name}`);
//     })

//     addFieldFormulaConfig(formulaConfig);

//     // const isQuotedTwoWays = isFieldFormulaConfigQuotedTwoWays(formulaConfig, getFieldFormulaConfigs());
//     // if (!isQuotedTwoWays) {
        
//     // }
// }

// export const addObjectFieldsFormulaConfig = (config: any, datasource: string) => {
//     _.each(config.fields, function (field) {
//         if (field.type === "formula") {
//             if(datasource !== "default"){
//                 throw new Error(`The type of the field '${field.name}' on the object '${config.name}' can't be 'formula', because it is not in the default datasource.`);
//             }
//             try {
//                 // 这里一定要加try catch，否则某个字段报错后，后续其他字段及其他对象就再也没有正常加载了
//                 addObjectFieldFormulaConfig(clone(field), config);
//             } catch (error) {
//                 console.error(error);
//             }
//         }
//     })
// }

/*****formula cache******/

const getObjectFieldFormulaConfig = (fieldConfig: any, objectConfig: any) => {
    const formula = fieldConfig.formula;
    let result = computeFormulaVarsAndQuotes(formula, objectConfig);
    let formulaConfig: SteedosFieldFormulaTypeConfig = {
        _id: `${objectConfig.name}.${fieldConfig.name}`,
        object_name: objectConfig.name,
        field_name: fieldConfig.name,
        formula: formula,
        data_type: fieldConfig.data_type,
        formula_blank_value: <SteedosFormulaBlankValue>fieldConfig.formula_blank_value,
        quotes: result.quotes,
        vars: result.vars
    };

    return formulaConfig;
}

const getObjectFieldsFormulaConfig = (config: any, datasource: string)=>{
    const objectFieldsFormulaConfig = [];
    _.each(config.fields, function (field) {
        if (field.type === "formula") {
            if(datasource !== "default"){
                throw new Error(`The type of the field '${field.name}' on the object '${config.name}' can't be 'formula', because it is not in the default datasource.`);
            }
            try {
                // 这里一定要加try catch，否则某个字段报错后，后续其他字段及其他对象就再也没有正常加载了
                objectFieldsFormulaConfig.push(getObjectFieldFormulaConfig(clone(field), config));
            } catch (error) {
                console.error(error);
            }
        }
    })
    return objectFieldsFormulaConfig;
}

function cacherKey(APIName: string): string{
    return `$steedos.#formula.${APIName}`
}

function checkRefMapData(maps, data){
    let refs = [];
    function checkInfiniteLoop(value){
        _.each(maps, function(item){
            if(item.value === value){
                refs.push(item.key);
                checkInfiniteLoop(item.key)
            }
        })
    }
    checkInfiniteLoop(data.key)
    if(_.find(refs, function(ref){return ref === data.value})){
        throw new Error(`Infinite Loop: ${JSON.stringify(data)}`);
    }
}

const refMapName = '$formula_ref_maps';
// TODO
// async function removeFormulaReferenceMaps(broker){
//     await broker.call('metadata.delete', {key: cacherKey(refMapName)}, {meta: {}})
// }

async function addFormulaReferenceMaps(broker: any, key: string, value: string){
    let cache = await broker.call('metadata.get', {key: cacherKey(refMapName)}, {meta: {}})
    let maps = [];
    if(cache && cache.maps){
        maps = cache.maps;
    }

    let data = { 
        key: key,
        value: value
    }

    //checkData
    checkRefMapData(maps, data);

    maps.push(data);

    await broker.call('metadata.add', {key: cacherKey(refMapName), data: maps}, {meta: {}})
} 

export const addFormulaMetadata = async(broker: any, config: any, datasource: string)=>{
    const objectFieldsFormulaConfig = getObjectFieldsFormulaConfig(config, datasource);
    for (const fieldFormula of objectFieldsFormulaConfig) {
        for (const quote of fieldFormula.quotes) {
            await addFormulaReferenceMaps(broker, `${fieldFormula._id}`, `${quote.object_name}.${quote.field_name}`);
        }
        await broker.call('metadata.add', {key: cacherKey(fieldFormula._id), data: fieldFormula}, {meta: {}})
    }
    return true;
}