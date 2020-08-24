import { getSteedosSchema } from '../index';
import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaVarTypeConfig, SteedosFieldFormulaParamTypeConfig, SteedosFieldFormulaVarPathTypeConfig, FormulaUserSessionKey } from './type';
import { getObjectQuotedByFieldFormulaConfigs, getObjectFieldFormulaConfigs } from './field_formula';
import { wrapAsync } from '../util';
import { JsonMap } from "@salesforce/ts-types";
import { SteedosUserSession } from '../types';
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
export const pickFieldFormulaVarFields = (fieldFormulaConfig: SteedosFieldFormulaTypeConfig): Array<string> => {
    let { vars } = fieldFormulaConfig;
    if (!vars.length) {
        return [];
    }
    // let fields = getSteedosSchema().getObject(fieldFormulaConfig.object_name).fields;
    let result = [];
    vars.forEach((varItem) => {
        if (varItem.paths.length) {
            // 取paths中第一个，第一个一定是当前对象中的字段
            let firstKey = varItem.paths[0].field_name;
            result.push(firstKey);
        }
    });
    return result;
}

/**
 * 根据公式中的变量值，计算出跨对象引用的记录对应的字段值，作为公式运算的参数返回
 * @param doc 
 * @param vars 
 * return Array<SteedosFieldFormulaParamTypeConfig>
 */
export const computeFieldFormulaParams = async (doc: JsonMap, vars: Array<SteedosFieldFormulaVarTypeConfig>, userSession: any) => {
    if(!userSession){
        throw new Error(`computeFieldFormulaParams:The param 'userSession' is required for the function'computeFieldFormulaParams'`);
    }
    let params: Array<SteedosFieldFormulaParamTypeConfig> = [];
    if (vars && vars.length) {
        for (let { key, paths, is_user_session_var: isUserSessionVar } of vars) {
            key = key.trim();
            // 如果变量key以$user开头,则解析为userSession,此时paths为空
            let tempValue: any;
            if(isUserSessionVar){
                let tempFormulaParams = {};
                let tepmFormula = key.replace(FormulaUserSessionKey, `__params["${FormulaUserSessionKey}"]`);
                tepmFormula = `return ${tepmFormula}`
                tempFormulaParams[FormulaUserSessionKey] = userSession;
                tempValue = evalFieldFormula(tepmFormula, tempFormulaParams);
            }
            else{
                tempValue = _.reduce(paths, (reslut, next, index) => {
                    if (index === 0) {
                        return <any>doc[next.field_name];
                    }
                    else {
                        if(!reslut){
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
            }
            params.push({
                key: key,
                value: tempValue
            });
        }
    }
    return params;
}

export const computeFieldFormulaValue = async (doc: JsonMap, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: any) => {
    if(!userSession){
        throw new Error(`computeFieldFormulaValue:The param 'userSession' is required for the function'computeFieldFormulaValue'`);
    }
    const { formula, vars, formula_type } = fieldFormulaConfig;
    let params = await computeFieldFormulaParams(doc, vars, userSession);
    return runFieldFormula(formula, params, formula_type);
}

export const evalFieldFormula = function (formula: string, formulaParams: object) {
    try {
        let formulaFun = `module.exports = function (__params) { ${formula} }`;
        // console.log("==evalFieldFormula==formulaFun===", formulaFun);
        // console.log("==evalFieldFormula==formulaParams===", formulaParams);
        return _eval(formulaFun)(formulaParams);
    }
    catch (ex) {
        formulaParams[FormulaUserSessionKey] = "{...}" //$user简化，打出的日志看得清楚点
        throw new Error(`evalFieldFormula:Catch an error "${ex}" while eval formula "${formula}" with params "${JSON.stringify(formulaParams)}"`);
    }
}

/**
 * 运行公式
 * @param formula 公式脚本内容
 * @param params 参数
 * @param formulaType 公式返回类型，如果空则不判断类型
 */
export const runFieldFormula = function (formula: string, params: Array<SteedosFieldFormulaParamTypeConfig>, formulaType?: string) {
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
    console.log("==runFieldFormular==result===", result);
    if(result === null || result === undefined){
        return null;
    }
    if (formulaType) {
        const resultType = typeof result;
        console.log("==runFieldFormular==formulaType===", formulaType);
        console.log("==runFieldFormular==resultType===", resultType);
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
    let existPath = toAggregatePaths.find((item) => {
        return JSON.stringify(item) === JSON.stringify(varItemToAggregatePaths)
    });
    if (!existPath) {
        toAggregatePaths.push(varItemToAggregatePaths);
    }
}

/**
 * 在所有字段引用关系（包括跨对象的字段引用关系）中找到引用了当前正在insert/update的对象字段的公式字段并更新其字段值
 * @param objectName 
 * @param recordId 
 * @param userSession 
 * @param fieldNames 传入该参数时，只查找和处理引用了该对象中这些指定字段的公式字段
 */
export const runQuotedByObjectFieldFormulas = async function (objectName: string, recordId: string, userSession: SteedosUserSession, fieldNames?: Array<string>) {
    if(!userSession){
        throw new Error(`runQuotedByObjectFieldFormulas:The param 'userSession' is required for the function'runQuotedByObjectFieldFormulas'`);
    }
    // console.log("===runQuotedByObjectFieldFormulas===", objectName, recordId, fieldNames);
    const configs = getObjectQuotedByFieldFormulaConfigs(objectName, fieldNames);
    // console.log("===runQuotedByObjectFieldFormulas=configs==", configs);
    for (const config of configs) {
        await updateQuotedByObjectFieldFormulaValue(objectName, recordId, config, userSession);
    }
}

/**
 * 找到当前正在insert/update的对象中的公式字段并更新其字段值
 * @param objectName 
 * @param recordId 
 * @param doc 
 * @param userSession 
 */
export const runCurrentObjectFieldFormulas = async function (objectName: string, recordId: string, doc: JsonMap, userSession: SteedosUserSession) {
    if(!userSession){
        throw new Error(`runCurrentObjectFieldFormulas:The param 'userSession' is required for the function'runCurrentObjectFieldFormulas'`);
    }
    const configs = getObjectFieldFormulaConfigs(objectName);
    if(!configs.length){
        return;
    }
    let setDoc = {};
    for (const config of configs) {
        setDoc[config.field_name] = await computeFieldFormulaValue(doc, config, userSession);
    }
    await getSteedosSchema().getObject(objectName).directUpdate(recordId, setDoc);
}

/**
 * 修改记录时，根据查到的引用了该记录相关字段公式配置，重新计算字段公式，并把计算结果更新到数据库相关记录中
 * @param objectName 当前修改的记录所属对象名称
 * @param recordId 当前修改的记录ID
 * @param fieldFormulaConfig 查到的引用了该记录所属对象的相关字段公式配置之一
 */
export const updateQuotedByObjectFieldFormulaValue = async (objectName: string, recordId: string, fieldFormulaConfig: SteedosFieldFormulaTypeConfig, userSession: SteedosUserSession) => {
    const { vars, object_name: fieldFormulaObjectName } = fieldFormulaConfig;
    let toAggregatePaths: Array<Array<SteedosFieldFormulaVarPathTypeConfig>> = [];
    for (let varItem of vars) {
        // vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]}]
        const { paths } = varItem;
        let isInPaths = false;
        let varItemToAggregatePaths = [];
        for (let pathItem of paths) {
            if (pathItem.reference_from === objectName) {
                isInPaths = true;
                if (paths.length === 1 && pathItem.is_formula && fieldFormulaObjectName === objectName) {
                    // 如果修改的是当前对象本身的公式字段值时，paths长度会为1，需要提前放入varItemToAggregatePaths中，否则会造成varItemToAggregatePaths作为空数组加入toAggregatePaths中
                    varItemToAggregatePaths.push(pathItem);
                }
                break;
            }
            varItemToAggregatePaths.push(pathItem);
        }
        if (isInPaths) {
            // 添加时去除重复项
            addToAggregatePaths(varItemToAggregatePaths, toAggregatePaths);
        }
    }
    const formulaVarFields = pickFieldFormulaVarFields(fieldFormulaConfig);
    // console.log("===updateQuotedByObjectFieldFormulaValue=formulaVarFields====", formulaVarFields);
    // console.log("===updateQuotedByObjectFieldFormulaValue=toAggregatePaths====", JSON.stringify(toAggregatePaths));
    // 只有一层引用关系时，vars格式如：[{"key":"account.website","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"website","reference_from":"accounts"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_from":"contacts"}]]
    // 超过一层引用关系时，vars格式如：[{"key":"account.modified_by.name","paths":[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"},{"field_name":"name","reference_from":"users"}]}]
    // 则toAggregatePaths为[[{"field_name":"account","reference_from":"contacts"},{"field_name":"modified_by","reference_from":"accounts"}]]
    for (let toAggregatePathsItem of toAggregatePaths) {
        if (toAggregatePathsItem.length < 2) {
            // 引用关系只有一层时，可以直接查出哪些记录需要更新重算公式字段值
            let tempPath = toAggregatePathsItem[0];
            if (tempPath.is_formula && fieldFormulaObjectName === objectName && tempPath.reference_from === objectName) {
                // 如果修改的是当前对象本身的公式字段值时，只需要更新当前记录的公式字段值就行
                let doc = await getSteedosSchema().getObject(fieldFormulaObjectName).findOne(recordId, { fields: formulaVarFields })
                let value = await computeFieldFormulaValue(doc, fieldFormulaConfig, userSession);
                // console.log("===updateQuotedByObjectFieldFormulaValue=value=is_formula===", value);
                let setDoc = {};
                setDoc[fieldFormulaConfig.field_name] = value;
                // console.log("===updateQuotedByObjectFieldFormulaValue=setDoc==is_formula==", setDoc);
                // console.log("===updateQuotedByObjectFieldFormulaValue=doc==is_formula==", doc);
                console.log("===updateQuotedByObjectFieldFormulaValue===fieldFormulaObjectName,setDoc==1==", fieldFormulaObjectName, setDoc);
                // await getSteedosSchema().getObject(fieldFormulaObjectName).updateOne(doc._id, setDoc);
                await getSteedosSchema().getObject(fieldFormulaObjectName).directUpdate(doc._id, setDoc);
                // 公式字段修改后，需要找到引用了该公式字段的其他公式字段并更新其值
                await runQuotedByObjectFieldFormulas(fieldFormulaObjectName, doc._id, userSession, [fieldFormulaConfig.field_name])
            }
            else {
                // 修改的是其他对象上的字段值（包括修改的是其他对象上的公式字段值），则需要按recordId值查出哪些记录需要更新重算公式字段值
                let docs = await getSteedosSchema().getObject(fieldFormulaObjectName).find({ filters: [[tempPath.field_name, "=", recordId]], fields: formulaVarFields })
                // let docs = await getSteedosSchema().getObject(fieldFormulaObjectName).find({ filters: [[tempPath.field_name, "=", recordId]] })
                // console.log("===updateQuotedByObjectFieldFormulaValue=docs====", docs);
                for (let doc of docs) {
                    let value = await computeFieldFormulaValue(doc, fieldFormulaConfig, userSession);
                    // console.log("===updateQuotedByObjectFieldFormulaValue=value====", value);
                    let setDoc = {};
                    setDoc[fieldFormulaConfig.field_name] = value;
                    // console.log("===updateQuotedByObjectFieldFormulaValue=setDoc====", setDoc);
                    // console.log("===updateQuotedByObjectFieldFormulaValue=doc====", doc);
                    console.log("===updateQuotedByObjectFieldFormulaValue===fieldFormulaObjectName,setDoc==2==", fieldFormulaObjectName, setDoc);
                    // await getSteedosSchema().getObject(fieldFormulaObjectName).updateOne(doc._id, setDoc);
                    await getSteedosSchema().getObject(fieldFormulaObjectName).directUpdate(doc._id, setDoc);
                    // 公式字段修改后，需要找到引用了该公式字段的其他公式字段并更新其值
                    await runQuotedByObjectFieldFormulas(fieldFormulaObjectName, doc._id, userSession, [fieldFormulaConfig.field_name])
                }
            }
        }
        else {
            // 引用关系超过一层时，需要使用aggregate来查出哪些记录需要更新重算公式字段值
            // TODO:调用aggregate函数来处理
        }
    }
}

// export const runQuotedByObjectFieldFormulas = async function () {
//     const configs = getObjectQuotedByFieldFormulaConfigs(this.object_name);
//     for (const config of configs) {
//         await updateQuotedByObjectFieldFormulaValue(this.object_name, this.id, config);
//     }
// }