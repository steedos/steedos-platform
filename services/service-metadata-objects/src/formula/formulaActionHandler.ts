import { SteedosFieldFormulaTypeConfig, SteedosFieldFormulaQuoteTypeConfig, SteedosFormulaVarTypeConfig, SteedosFormulaVarPathTypeConfig, FormulaUserKey, FormulaUserSessionKey, SteedosFormulaBlankValue } from './type';
import { pickFormulaVars } from './core';
// import { isCodeObject } from '../util'; TODO
import { Register } from '@steedos/metadata-registrar';

import _ = require('lodash')
const clone = require('clone')

// TODO
const isCodeObject = (objectApiName)=>{
    return objectApiName ? false : true
}

const refMapName = '$formula_ref_maps';


function getDynamicCalcMapCacherKey(objectApiName: string, mainObjectApiName: string): string{
    return `$dynamic_calc_map.${objectApiName}.${mainObjectApiName}`
}

export class FormulaActionHandler{
    broker: any = null;
    constructor(broker){
        this.broker = broker;
    }

    async deleteAll(objectConfig){
        try {
            if (!objectConfig) {
                return;
            }
            // console.log(`deleteAll formula`, `${this.cacherKey(objectConfig.name)}.*`)
            // await this.broker.call('metadata.fuzzyDelete', {key: `${this.cacherKey(objectConfig.name)}.*`}, {meta: {}})
            await Register.fuzzyDelete(this.broker, `${this.cacherKey(objectConfig.name)}.*`)
            return true
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }

    async getObjectConfig(objectApiName: string){
        const data = await this.broker.call('objects.get', {objectApiName: objectApiName})
        return data ? data.metadata : null;
    }

    addFieldFormulaQuotesConfig(quote: SteedosFieldFormulaQuoteTypeConfig, quotes: Array<SteedosFieldFormulaQuoteTypeConfig>){
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
    async computeFormulaVarAndQuotes(formulaVar: string, objectConfig: any,  quotes: Array<SteedosFieldFormulaQuoteTypeConfig>, vars: Array<SteedosFormulaVarTypeConfig>){
        let isSimpleVar = objectConfig === null;//明确传入null时表示要计算的是普通变量。
        // 公式变量以FormulaUserSessionKey（即$user）值开头，说明是user变量
        let isUserVar = new RegExp(`^${FormulaUserKey.replace("$","\\$")}\\b`).test(formulaVar);
        let isUserSessionVar = new RegExp(`^${FormulaUserSessionKey.replace("$","\\$")}\\b`).test(formulaVar);
        let varItems = formulaVar.split(".");
        let paths: Array<SteedosFormulaVarPathTypeConfig> = [];
        let formulaVarItem: SteedosFormulaVarTypeConfig = {
            key: formulaVar,
            paths: paths
        };
        if (isUserVar || isUserSessionVar) {
            // user var不可以按普通变量处理，因为其变量值依赖paths属性
            isSimpleVar = false;
            objectConfig = "space_users";
        }
        if(isSimpleVar){
            // 只要不是user var则标记为普通变量，后续取参数值时直接通过key取值，而不用走变量上的paths属性。
            // 普通变量直接跳过后面所有代码即可，因为不需要处理paths和公式关系链等逻辑。
            // 注意普通公式也是支持$user全局变量的，但是isSimpleVar是false，所以走的是后面的逻辑
            formulaVarItem.is_simple_var = true;
            vars.push(formulaVarItem);
            return;
        }
        if(isUserSessionVar){
            // $userSession变量直接跳后后面所有代码即可，因为不需要处理paths和公式关系链等逻辑。
            formulaVarItem.is_user_session_var = true;
            vars.push(formulaVarItem);
            return;
        }
        if (isUserVar) {
            // 如果是user变量，则不需要计算quotes引用，但是其paths值需要正常记录下来
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
        let i = -1;
        for await (let varItem of varItems) {
            i++;
            // let i:number = _index as unknown as number;
            // let varItem = varItems[i];
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
                // throw new Error(`computeFormulaVarAndQuotes:Can't find the field '${varItem}' on the object '${tempObjectConfig.name}' for the formula var '${formulaVar}'`);
                return ;
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
                this.addFieldFormulaQuotesConfig(tempFieldFormulaQuote, quotes);
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
                if(tempFieldConfig.reference_to_field && paths.length){
                    paths[paths.length - 1].reference_to_field = tempFieldConfig.reference_to_field;
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
            tempObjectConfig = await this.getObjectConfig(tempFieldConfig.reference_to);
            if (!tempObjectConfig) {
                // 没找到相关引用对象，直接退出
                // 如果不是零代码对象，直接报错，否则直接返回，待相关零代码对象加载进来时，会再进入该函数
                if(isCodeObject(tempFieldConfig.reference_to)){
                    throw new Error(`computeFormulaVarAndQuotes:Can't find the object reference_to '${tempFieldConfig.reference_to}' by the field '${tempFieldConfig.name}' for the formula var '${formulaVar}'`);
                }
                else{
                    // await this.broker.call('metadata.add', {key: this.cacherKey(getDynamicCalcMapCacherKey(tempFieldConfig.reference_to, objectConfig.name)), data: {objectApiName: objectConfig.name}}, {meta: {}})
                    await Register.add(this.broker, {key: this.cacherKey(getDynamicCalcMapCacherKey(tempFieldConfig.reference_to, objectConfig.name)), data: {objectApiName: objectConfig.name}}, {});
                    return;
                }
            }
        }
        vars.push(formulaVarItem);
    }

    /**
     * 根据公式内容，取出其中{}中的变量，返回计算后的公式引用集合
     * @param formula
     * @param fieldConfig
     */
    async computeFormulaVarsAndQuotes(formula: string, objectConfig: any){
        let quotes: Array<SteedosFieldFormulaQuoteTypeConfig> = [];
        let vars: Array<SteedosFormulaVarTypeConfig> = [];
        let formulaVars: any = [];
        try{
            formulaVars = pickFormulaVars(formula);
        }
        catch(ex){
            throw new Error(`pickFormulaVars:Catch an error "${ex}" while pick vars from the formula "${formula}" for "${JSON.stringify(objectConfig)}"`);
        }
        for await(const formulaVar of formulaVars) {
            await this.computeFormulaVarAndQuotes(formulaVar, objectConfig, quotes, vars);
        }
        return { quotes, vars };
    }

    cacherKey(APIName: string): string{
        return `$steedos.#formula.${APIName}`
    }

    async getObjectFieldFormulaConfig(fieldConfig: any, objectConfig: any){
        const formula = fieldConfig.formula;
        let result = await this.computeFormulaVarsAndQuotes(formula, objectConfig);
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

    async getObjectFieldsFormulaConfig(config: any, datasource: string){
        const objectFieldsFormulaConfig = [];
        for await (const field of _.values(config.fields)) {
            // console.log('key', key);
            // const field = config.fields[key]
            if (field.type === "formula") {
                // if(datasource !== "meteor" && datasource !== "default"){
                //     throw new Error(`The type of the field '${field.name}' on the object '${config.name}' can't be 'formula', because it is not in the default datasource.`);
                // }
                try {
                    // 这里一定要加try catch，否则某个字段报错后，后续其他字段及其他对象就再也没有正常加载了
                    const fieldFormulaConfig = await this.getObjectFieldFormulaConfig(clone(field), config)
                    objectFieldsFormulaConfig.push(fieldFormulaConfig);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        return objectFieldsFormulaConfig;
    }

    checkRefMapData(maps, data){
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

    async getFormulaReferenceMaps(broker: any): Promise<any>{
        const maps = [];
        // let records = (await broker.call('metadata.filter', { key: this.cacherKey(`${refMapName}.*`) }, { meta: {} })) || {};
        let records: any = (await Register.filter(this.broker, this.cacherKey(`${refMapName}.*`))) || {};
        for await (const item of records) {
            const metadata = item?.metadata;
            if(metadata){
                maps.push(item);
            }
        }
        return { metadata: maps };
    }
    async addFormulaReferenceMaps(broker: any, key: string, value: string){
        let { metadata } = (await this.getFormulaReferenceMaps(broker)) || [];
        let maps = [];
        if(metadata){
            maps = metadata;
        }

        let data = {
            key: key,
            value: value
        }

        // //checkData
        this.checkRefMapData(maps, data);
        // maps.push(data);
        await Register.add(this.broker, {key: this.cacherKey(`${refMapName}.${key}.${value}`), data: data}, {});
        // await broker.call('metadata.add', {key: this.cacherKey(`${refMapName}.${key}.${value}`), data: data}, {meta: {}})
    }

    async addFormulaMetadata(config: any, datasource: string){
        const objectFieldsFormulaConfig = await this.getObjectFieldsFormulaConfig(config, datasource);
        const objectFormulas = await this.filter({params: {objectApiName: config.name}});
        const formulaFieldsName = _.map(objectFormulas, 'field_name');
        const objectFields = _.map(config.fields, 'name');
        const diff = _.difference(formulaFieldsName, objectFields);
        for await (const fieldFormula of objectFieldsFormulaConfig) {
            for await (const quote of fieldFormula.quotes) {
                await this.addFormulaReferenceMaps(this.broker, `${fieldFormula._id}`, `${quote.object_name}.${quote.field_name}`);
            }
            await Register.add(this.broker, {key: this.cacherKey(fieldFormula._id), data: fieldFormula}, {});
            // await this.broker.call('metadata.add', {key: this.cacherKey(fieldFormula._id), data: fieldFormula}, {meta: {}})
        }
        for (const deletedFieldName of diff) {
            if(deletedFieldName){
                await Register.delete(this.broker, this.cacherKey(`${config.name}.${deletedFieldName}`))
            }
        }
        return true;
    }

    async getObjectDynamicCalcFormulaMap(objectApiName){
        return await Register.filter(this.broker, this.cacherKey(getDynamicCalcMapCacherKey(objectApiName, '*')))
        // return await this.broker.call('metadata.filter', {key: this.cacherKey(getDynamicCalcMapCacherKey(objectApiName, '*'))}, {meta: {}});
    }

    async recalcObjectsFormulaMap(objectConfig){
        const recalcObjects = {};
        const dynamicCalcFormulaMap = await this.getObjectDynamicCalcFormulaMap(objectConfig.name);
        for await (const item of dynamicCalcFormulaMap) {
            const recalcObjectApiName = item?.metadata?.objectApiName;
            if(recalcObjectApiName){
                const recalcObjectConfig = await this.getObjectConfig(recalcObjectApiName);
                if(recalcObjectConfig){
                    recalcObjects[recalcObjectApiName] = recalcObjectConfig
                }
            }
        }
        
        for (const objectName in recalcObjects) {
            if (Object.prototype.hasOwnProperty.call(recalcObjects, objectName)) {
                const recalcObjectConfig = recalcObjects[objectName];
                await this.addFormulaMetadata(recalcObjectConfig, recalcObjectConfig.datasource);
                await Register.delete(this.broker, this.cacherKey(getDynamicCalcMapCacherKey(objectConfig.name, objectName)))
                // await this.broker.call('metadata.delete', {key: this.cacherKey(getDynamicCalcMapCacherKey(objectConfig.name, objectName))}, {meta: {}})
            }
        }
    }

    async add(objectConfig){
        try {
            await this.addFormulaMetadata(objectConfig, objectConfig.datasource);
            return true;
        } catch (error) {
            this.broker.logger.error(error);
        }
        return false
    }

    async filter(ctx){
        let {objectApiName, fieldApiName} = ctx.params;
        if(!objectApiName){
            objectApiName = "*";
        }
        if(!fieldApiName){
            fieldApiName = "*";
        }
        const key = this.cacherKey(`${objectApiName}.${fieldApiName}`)
        const configs = [];
        // const res = await this.broker.call('metadata.filter', {key: key}, {meta: {}})
        const res = await Register.filter(this.broker, key);
        _.forEach(res, (item)=>{
            configs.push(item?.metadata)
        })
        return configs;
    }

    async get(ctx){
        let {fieldApiFullName} = ctx.params;
        const key = this.cacherKey(fieldApiFullName)
        // const res = await this.broker.call('metadata.get', {key: key}, {meta: {}});
        const res = await Register.get(this.broker, key)
        return res?.metadata;
    }

    async verifyObjectFieldFormulaConfig(ctx){
        let {fieldConfig, objectConfig} = ctx.params;

        const fieldFormula = await this.getObjectFieldFormulaConfig(fieldConfig, objectConfig);
        let { metadata } = (await this.getFormulaReferenceMaps(ctx.broker)) || [];
        let maps = [];
        if(metadata){
            maps = metadata;
        }

        for await (const quote of fieldFormula.quotes) {
            let data = {
                key: fieldFormula._id,
                value: `${quote.object_name}.${quote.field_name}`
            }
            this.checkRefMapData(maps, data);
        }

        return await this.getObjectFieldFormulaConfig(fieldConfig, objectConfig);
    }

    async getFormulaVarsAndQuotes(ctx){
        let {formula, objectConfig} = ctx.params;
        return await this.computeFormulaVarsAndQuotes(formula, objectConfig);
    }
}
