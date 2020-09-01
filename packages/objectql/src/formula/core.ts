import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaParamTypeConfig, SteedosFieldFormulaVarPathTypeConfig, FormulaUserKey, FormulaBlankValue } from './type';
import { getObjectQuotedByFieldFormulaConfigs, getObjectFieldFormulaConfigs } from './field_formula';
import { checkCurrentUserIdNotRequiredForFieldFormulas, getFormulaVarPathsAggregateLookups } from './util';
import { wrapAsync } from '../util';
import { JsonMap } from "@salesforce/ts-types";
import { SteedosQueryFilters } from '../types';
import _ = require('lodash')
import _eval = require('eval')

/**
 * 根据公式内容，取出其中{}中的变量
 * @param formula 
 */
export const pickFormulaVars = (formula: string): Array<string> => {
    let matchs = formula.match(/\{[\w\.\$]+\}/g);
    if (matchs && matchs.length) {
        return matchs.map((n) => { return n.replace(/{|}/g, "") });
    }
    else {
        return [];
    }
}

/**
 * 根据公式内容，取出其中{}中的变量，并进一步取出这些变量中引用了当前对象的哪些字段
 * @param fieldFormulaConfig 
 */
export const pickFieldFormulaVarFields = (fieldFormulaConfigs: SteedosFieldFormulaTypeConfig | Array<SteedosFieldFormulaTypeConfig>): Array<string> => {
    if (!_.isArray(fieldFormulaConfigs)) {
        fieldFormulaConfigs = [fieldFormulaConfigs];
    }
    let result = ["space"]; //space字段作为基础字段不能少
    fieldFormulaConfigs.forEach((fieldFormulaConfig: SteedosFieldFormulaTypeConfig) => {
        let { vars } = fieldFormulaConfig;
        result = _.union(result, pickFormulaVarFields(vars));
    });
    return _.uniq(result);
}

/**
 * 根据公式内容已取出的{}中的变量，进一步取出这些变量中引用了当前对象的哪些字段
 * @param vars 
 */
export const pickFormulaVarFields = (vars: Array<SteedosFieldFormulaVarTypeConfig>): Array<string> => {
    let result = ["space"]; //space字段作为基础字段不能少
    vars.forEach((varItem: SteedosFieldFormulaVarTypeConfig) => {
        if (varItem.paths.length) {
            // 如果是$user变量则paths肯定为空，所以取paths中第一个，第一个一定是当前对象中的字段
            let firstPath: SteedosFieldFormulaVarPathTypeConfig = varItem.paths[0];
            let firstKey = firstPath.field_name;
            result.push(firstKey);
        }
    });
    return _.uniq(result);
}

/**
 * 根据公式中的变量值，计算出跨对象引用的记录对应的字段值，作为公式运算的参数返回
 * @param doc 
 * @param vars 
 * return Array<SteedosFieldFormulaParamTypeConfig>
 */
export const computeFieldFormulaParams = async (doc: JsonMap, vars: Array<SteedosFieldFormulaVarTypeConfig>, currentUserId: string) => {
    let params: Array<SteedosFieldFormulaParamTypeConfig> = [];
    const spaceId = doc.space;
    if (vars && vars.length) {
        for (let { key, paths, is_user_var: isUserVar } of vars) {
            key = key.trim();
            // 如果变量key以$user开头,则解析为userSession,此时paths为空
            let tempValue: any;
            if (isUserVar) {
                if(!currentUserId){
                    throw new Error(`computeFieldFormulaParams:The param 'currentUserId' is required for the formula var key ${key} while running`);
                }
                if(!spaceId){
                    throw new Error(`computeFieldFormulaParams:The 'space' property is required for the doc of the formula var key ${key} while running`);
                }
                // if (!currentUserId) {
                //     throw new Error(`computeFieldFormulaParams:The param 'currentUserId' is required for the formula var key ${key}`);
                // }
                // let tempFormulaParams = {};
                // let tepmFormula = key.replace(FormulaUserKey, `__params["${FormulaUserKey}"]`);
                // tepmFormula = `return ${tepmFormula}`
                // tempFormulaParams[FormulaUserKey] = currentUserId;
                // tempValue = evalFieldFormula(tepmFormula, tempFormulaParams);
            }
            tempValue = _.reduce(paths, (reslut, next, index) => {
                if (index === 0) {
                    if(isUserVar){
                        // $user变量也要按查相关表记录的方式取值，第一个path为根据id取出对应的space_users记录
                        const sus = wrapAsync(function () {
                            return getSteedosSchema().getObject("space_users").find({
                                filters: [["user", "=", currentUserId], ["space", "=", spaceId]],
                                fields: [next.field_name]
                            });
                        }, {});
                        reslut = sus && sus.length && sus[0];
                        if (reslut) {
                            return reslut[next.field_name]
                        }
                        else {
                            return null
                        }
                    }
                    else{
                        return <any>doc[next.field_name];
                    }
                }
                else {
                    if (!reslut) {
                        // 当上一轮返回空值或0时，直接返回
                        return reslut;
                    }
                    reslut = wrapAsync(function () {
                        return getSteedosSchema().getObject(next.reference_from).findOne(<any>reslut, { fields: [next.field_name] })
                    }, {});
                    if (reslut) {
                        return reslut[next.field_name]
                    }
                    else {
                        return null
                    }
                }
            }, null);
            params.push({
                key: key,
                value: tempValue
            });
        }
    }
    return params;
}

export const computeFieldFormulaValue = async (doc: JsonMap, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) => {
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(fieldFormulaConfig);
    }
    const { formula, vars, formula_type, formula_blank_value } = fieldFormulaConfig;
    let params = await computeFieldFormulaParams(doc, vars, currentUserId);
    return runFieldFormula(formula, params, formula_type, formula_blank_value);
}

export const evalFieldFormula = function (formula: string, formulaParams: object) {
    try {
        let formulaFun = `module.exports = function (__params) { ${formula} }`;
        // console.log("==evalFieldFormula==formulaFun===", formulaFun);
        // console.log("==evalFieldFormula==formulaParams===", formulaParams);
        return _eval(formulaFun)(formulaParams);
    }
    catch (ex) {
        formulaParams[FormulaUserKey] = "{...}" //$user简化，打出的日志看得清楚点
        throw new Error(`evalFieldFormula:Catch an error "${ex}" while eval formula "${formula}" with params "${JSON.stringify(formulaParams)}"`);
    }
}

/**
 * 运行公式
 * @param formula 公式脚本内容
 * @param params 参数
 * @param formulaType 公式返回类型，如果空则不判断类型
 */
export const runFieldFormula = function (formula: string, params: Array<SteedosFieldFormulaParamTypeConfig>, formulaType?: string, formulaBlankValue?: FormulaBlankValue) {
    let formulaParams = {};
    params.forEach(({ key, value }) => {
        formulaParams[key] = value;
        // 把{}括起来的变量替换为计算得到的变量值
        formula = formula.replace(`{${key}}`, `__params["${key}"]`);
    });
    if (!/\breturn\b/.test(formula)) {
        // 如果里面没有return语句，则在最前面加上return前缀
        formula = `return ${formula}`;
    }
    let result = evalFieldFormula(formula, formulaParams);
    // console.log("==runFieldFormular==result===", result);
    if (result === null || result === undefined) {
        if (["number", "currency"].indexOf(formulaType) > -1) {
            if (formulaBlankValue === FormulaBlankValue.blanks) {
                return null;
            }
            else {
                // 默认为按0值处理
                return 0;
            }
        }
        else {
            return null;
        }
    }
    if (formulaType) {
        const resultType = typeof result;
        // console.log("==runFieldFormular==formulaType===", formulaType);
        // console.log("==runFieldFormular==resultType===", resultType);
        switch (formulaType) {
            case "boolean":
                if (resultType !== "boolean") {
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a boolean type result but got a ${resultType} type.`);
                }
                break;
            case "number":
                if (resultType !== "number") {
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a number type result but got a ${resultType} type.`);
                }
                break;
            case "currency":
                if (resultType !== "number") {
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a number type result but got a ${resultType} type.`);
                }
                break;
            case "text":
                if (resultType !== "string") {
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a string type result but got a ${resultType} type.`);
                }
                break;
            case "date":
                if (result.constructor.name !== "Date") {
                    // 这里不可以直接用result.constructor == Date或result instanceof Date，因为eval后的同一个基础类型的构造函数指向的不是同一个
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a date type result but got a ${resultType} type.`);
                }
                break;
            case "datetime":
                if (result.constructor.name !== "Date") {
                    // 这里不可以直接用result.constructor == Date或result instanceof Date，因为eval后的同一个基础类型的构造函数指向的不是同一个
                    throw new Error(`runFieldFormula:The field formula "${formula}" with params "${JSON.stringify(formulaParams)}" should return a date type result but got a ${resultType} type.`);
                }
                break;
        }
    }
    return result;
}

const addToAggregatePaths = (varItemToAggregatePaths: Array<SteedosFieldFormulaVarPathTypeConfig>, toAggregatePaths: Array<Array<SteedosFieldFormulaVarPathTypeConfig>>) => {
    // 当引用了同一个对象的不同属性时，只需要记录其中一个，因为一个公式里面引用的字段变更后，只需要重算一次，比如以下两个都将只有第一条会加入到toAggregatePaths中
    // [{"key":"account.website","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]}]
    // [{"key":"account.name","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"name","reference_from":"accounts"}]}]
    const pathLength = varItemToAggregatePaths.length;
    let existPath = toAggregatePaths.find((item) => {
        return JSON.stringify(item.slice(0, pathLength)) === JSON.stringify(varItemToAggregatePaths.slice(0, pathLength))
    });
    if (!existPath) {
        toAggregatePaths.push(varItemToAggregatePaths);
    }
}

/**
 * 在所有字段引用关系（包括跨对象的字段引用关系）中找到引用了当前正在insert/update的对象字段的公式字段并更新其字段值
 * @param objectName 
 * @param recordId 
 * @param currentUserId 
 * @param fieldNames 传入该参数时，只查找和处理引用了该对象中这些指定字段的公式字段
 * @param quotedByConfigs 如果已经根据objectName和fieldNames查过相关配置了，请直接传入，可以避免重复查找，提高性能
 */
export const runQuotedByObjectFieldFormulas = async function (objectName: string, recordId: string, currentUserId: string, fieldNames?: Array<string>, quotedByConfigs?: Array<SteedosFieldFormulaTypeConfig>) {
    if (!quotedByConfigs) {
        quotedByConfigs = getObjectQuotedByFieldFormulaConfigs(objectName, fieldNames);
    }
    if(!quotedByConfigs.length){
        return;
    }
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(quotedByConfigs);
    }
    for (const config of quotedByConfigs) {
        await updateQuotedByObjectFieldFormulaValue(objectName, recordId, config, currentUserId);
    }
}

/**
 * 找到当前正在insert/update的对象中的公式字段并更新其字段值
 * @param objectName 
 * @param recordId 
 * @param doc 
 * @param currentUserId 
 * @param needRefetchDoc 当doc不可信赖时，需要从数据库中重新抓取doc，请传入true值
 * @param configs 如果已经根据objectName查过相关配置了，请直接传入，可以避免重复查找，提高性能
 */
export const runCurrentObjectFieldFormulas = async function (objectName: string, recordId: string, doc: JsonMap, currentUserId: string, needRefetchDoc?: boolean, configs?: Array<SteedosFieldFormulaTypeConfig>) {
    if (!configs) {
        configs = getObjectFieldFormulaConfigs(objectName);
    }
    if (!configs.length) {
        return;
    }
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(configs);
    }
    if (needRefetchDoc) {
        const formulaVarFields = pickFieldFormulaVarFields(configs);
        doc = await getSteedosSchema().getObject(objectName).findOne(recordId, { fields: formulaVarFields });
    }
    let setDoc = {};
    for (const config of configs) {
        doc = Object.assign({}, doc, setDoc);//setDoc中计算得到的结果应该重新并到doc中支持计算
        setDoc[config.field_name] = await computeFieldFormulaValue(doc, config, currentUserId);
    }
    await getSteedosSchema().getObject(objectName).directUpdate(recordId, setDoc);
}

/**
 * 找到当前正在update的对象多条记录的公式字段并更新其字段值
 * @param objectName 
 * @param filters 
 * @param currentUserId 
 */
export const runManyCurrentObjectFieldFormulas = async function (objectName: string, filters: SteedosQueryFilters, currentUserId: string) {
    const configs = getObjectFieldFormulaConfigs(objectName);
    if (!configs.length) {
        return;
    }
    if (!currentUserId) {
        checkCurrentUserIdNotRequiredForFieldFormulas(configs);
    }
    const formulaVarFields = pickFieldFormulaVarFields(configs);
    let docs = await getSteedosSchema().getObject(objectName).find({ filters: filters, fields: formulaVarFields });
    for (const doc of docs) {
        await runCurrentObjectFieldFormulas(objectName, doc._id, doc, currentUserId, false, configs);
    }
}

/**
 * 修改记录时，根据查到的引用了该记录相关字段公式配置，重新计算字段公式，并把计算结果更新到数据库相关记录中
 * @param objectName 当前修改的记录所属对象名称
 * @param recordId 当前修改的记录ID
 * @param fieldFormulaConfig 查到的引用了该记录所属对象的相关字段公式配置之一
 */
export const updateQuotedByObjectFieldFormulaValue = async (objectName: string, recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) => {
    // console.log("===updateQuotedByObjectFieldFormulaValue===", objectName, recordId, JSON.stringify(fieldFormulaConfig));
    const { vars, object_name: fieldFormulaObjectName } = fieldFormulaConfig;
    let toAggregatePaths: Array<Array<SteedosFieldFormulaVarPathTypeConfig>> = [];
    for (let varItem of vars) {
        // vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]}]
        const { paths } = varItem;
        let isInPaths = false;
        let varItemToAggregatePaths = [];
        for (let pathItem of paths) {
            varItemToAggregatePaths.push(pathItem);
            if (pathItem.reference_from === objectName) {
                isInPaths = true;
                break;
            }
        }
        if (isInPaths) {
            // 添加时去除重复项
            addToAggregatePaths(varItemToAggregatePaths, toAggregatePaths);
        }
    }
    // 只有一层引用关系时，vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]]
    // 超过一层引用关系时，vars格式如：[{"key":"account.modified_by.name","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"},{"field_name":"name","reference_from":"users"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"},{"field_name":"name","reference_from":"users"}]]
    // toAggregatePaths只会添加到paths中reference_from为objectName的变量路径，多余的不需要加进来
    // 例如当前修改的是某条用户记录的内容，即objectName为users，vars可能为：
    // [{"key":"account.modified_by.company_id.name","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"},{"field_name":"company_id","reference_from":"users"},{"field_name":"name","reference_from":"company"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"},{"field_name":"company_id","reference_from":"users"}]]
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    for (let toAggregatePathsItem of toAggregatePaths) {
        if (toAggregatePathsItem.length < 3) {
            // 引用关系只有一层时，可以直接查出哪些记录需要更新重算公式字段值
            let tempPath = toAggregatePathsItem[0];
            if (tempPath.is_formula && fieldFormulaObjectName === objectName && tempPath.reference_from === objectName) {
                // 如果修改的是当前对象本身的公式字段值时，只需要更新当前记录的公式字段值就行
                let doc = await getSteedosSchema().getObject(fieldFormulaObjectName).findOne(recordId, { fields: formulaVarFields })
                await updateDocsFieldFormulaValue(doc, fieldFormulaConfig, currentUserId);
            }
            else {
                // 修改的是其他对象上的字段值（包括修改的是其他对象上的公式字段值），则需要按recordId值查出哪些记录需要更新重算公式字段值
                let docs = await getSteedosSchema().getObject(fieldFormulaObjectName).find({ filters: [[tempPath.field_name, "=", recordId]], fields: formulaVarFields })
                await updateDocsFieldFormulaValue(docs, fieldFormulaConfig, currentUserId);
            }
        }
        else {
            // 引用关系超过一层时，需要使用aggregate来查出哪些记录需要更新重算公式字段值
            let aggregateLookups = getFormulaVarPathsAggregateLookups(toAggregatePathsItem);
            let lastLookupAs = aggregateLookups[aggregateLookups.length - 1]["$lookup"].as;
            let aggregateFilters = [[`${lastLookupAs}._id`, "=", recordId]];
            const docs = await getSteedosSchema().getObject(fieldFormulaObjectName).directAggregatePrefixalPipeline({
                filters: aggregateFilters,
                fields: formulaVarFields
            }, aggregateLookups);
            await updateDocsFieldFormulaValue(docs, fieldFormulaConfig, currentUserId);
        }
    }
}

export const updateDocsFieldFormulaValue = async (docs: any, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, currentUserId: string) => {
    const { object_name: fieldFormulaObjectName } = fieldFormulaConfig;
    if (!_.isArray(docs)) {
        docs = [docs];
    }
    for (let doc of docs) {
        let value = await computeFieldFormulaValue(doc, fieldFormulaConfig, currentUserId);
        let setDoc = {};
        setDoc[fieldFormulaConfig.field_name] = value;
        await getSteedosSchema().getObject(fieldFormulaObjectName).directUpdate(doc._id, setDoc);
        // 公式字段修改后，需要找到引用了该公式字段的其他公式字段并更新其值
        await runQuotedByObjectFieldFormulas(fieldFormulaObjectName, doc._id, currentUserId, [fieldFormulaConfig.field_name])
    }
}