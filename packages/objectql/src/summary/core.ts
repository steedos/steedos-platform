import { getSteedosSchema, processFilters } from '../index';
import { SteedosFieldSummaryTypeConfig, SteedosSummaryTypeValue, SteedosSummaryTypeBlankValue } from './type';
import { getObjectQuotedByFieldSummaryConfigs, getObjectFieldSummaryConfigs } from './field_summary';
import { runQuotedByObjectFieldFormulas } from '../formula';
import { formatFiltersToODataQuery } from '@steedos/filters';
import _ = require('lodash');
import { JsonMap } from '@salesforce/ts-types';
import { getObjectConfig } from '@steedos/metadata-registrar';

/**
 * 在所有字段引用关系（包括跨对象的字段引用关系）中找到引用了当前正在insert/update的对象字段的汇总字段并更新其字段值
 * @param objectName 当前正在insert/update的对象
 * @param recordId 当前正在insert/update的记录id
 * @param userSession 
 * @param fieldNames 传入该参数时，只查找和处理引用了该对象中这些指定字段的公式字段
 * @param quotedByConfigs 如果已经根据objectName和fieldNames查过相关配置了，请直接传入，可以避免重复查找，提高性能
 */
export const runQuotedByObjectFieldSummaries = async function (objectName: string, recordId: string, previousDoc: any, userSession: any, options: {
    fieldNames?: Array<string>,
    quotedByConfigs?: Array<SteedosFieldSummaryTypeConfig>
} = {}) {
    let { fieldNames, quotedByConfigs } = options;
    if (!quotedByConfigs) {
        quotedByConfigs = await getObjectQuotedByFieldSummaryConfigs(objectName, fieldNames);
    }
    if (!quotedByConfigs.length) {
        return;
    }
    // 把quotedByConfigs按主表对象分组，比如新建、修改付款记录时，付款子表对象可能同时是合同对象及项目对象的子表，此时应该把它们进行分组，合同对象一组，项目对象一组。
    // 这样就可以实现同时把同一组的汇总字段全部算好后一次性update主表记录的多个汇总字段值（包括COUNT、SUM、MIN、MAX、AVG在内所有汇总类型）。
    // 以解决 [Bug]: 主表上有汇总同一个子表对象的多个汇总字段时，每个汇总字段的计算结果会分别执行一次主表update，应该合并为只执行一次主表update #6692
    let groupedQuotedByConfigs = _.groupBy(quotedByConfigs, (config) => config.object_name);
    // console.log("===runQuotedByObjectFieldSummaries===_.keys(groupedQuotedByConfigs)===", _.keys(groupedQuotedByConfigs));
    for (const masterObjectName in groupedQuotedByConfigs) {
        // console.log("===runQuotedByObjectFieldSummaries===masterObjectName===", masterObjectName);
        const itemQuotedByConfigs = groupedQuotedByConfigs[masterObjectName];
        // docs表示要更新的主表记录内容按masterRecordId拼成键值对象，其格式为：{masterRecordId:{sumFieldName1: sumValue1, sumFieldName2: sumValue2}}, 比如：{ '65fea8c5585318611ab701a2': { sum_a__c: 33, sum_amount__c: 100 } }
        let docs = {};
        // quotedByReferenceTosForSummaryTypeConfigs表示要进一步查找并计算引用了主表上相关汇总字段的其它公式和汇总字段的相关masterRecordIds和config，其格式为：{masterRecordIds:<string[]>xxx, config: <SteedosFieldSummaryTypeConfig>yyy}
        // let quotedByReferenceTosForSummaryTypeConfigs = [];
        for (const config of itemQuotedByConfigs) {
            let values = await getQuotedByObjectFieldSummaryValues(objectName, recordId, previousDoc, config, userSession);
            if (!_.isEmpty(values)) {
                // quotedByReferenceTosForSummaryTypeConfigs.push({
                //     masterRecordIds: _.keys(values), 
                //     config
                // });
                docs = _.defaultsDeep(values, docs);
            }
        }
        // console.log("===runQuotedByObjectFieldSummaries===docs===", docs);
        for (const masterRecordId in docs) {
            // 同一组里面的itemQuotedByConfigs，其object_name, reference_to_field_reference_to值肯定是相同的，其中object_name值就是masterObjectName，所以这里传入第一个config即可
            await updateReferenceToFieldSummaryValue(masterRecordId, docs[masterRecordId], itemQuotedByConfigs[0], userSession);
        }

        // 这里不再调用 updateQuotedByReferenceTosForSummaryType函数，是因为汇总字段update时不再使用directUpdate，会触发object method代理函数 callAdapter 重新执行级联的公式和汇总字段运算
        // console.log("===runQuotedByObjectFieldSummaries===quotedByReferenceTosForSummaryTypeConfigs===", JSON.stringify(quotedByReferenceTosForSummaryTypeConfigs));
        // for (const config of quotedByReferenceTosForSummaryTypeConfigs) {
        //     // 这里特意重新遍历一次referenceToIds而不是直接在updateReferenceToFieldSummaryValue函数中每次更新一条记录后立即处理被引用字段的级联变更，见：公式或汇总触发级联重算时，数据类型变更可能会造成无法重算 #965
        //     await updateQuotedByReferenceTosForSummaryType(config.masterRecordIds, config.config, userSession);
        // }
    }
}

const getSummaryAggregateGroupKey = (summary_type: SteedosSummaryTypeValue, summary_field: string) => {
    return summary_type === SteedosSummaryTypeValue.COUNT ? SteedosSummaryTypeValue.COUNT : summary_field;
}

/**
 * 把累计汇总字段中需要聚合查询字段转换为aggregate函数需要的groups，
 * 比如聚合查找应付记录对象下合同_id为hNkuWqRmHtWaBvWpJ的所有记录，并可按sum,min,max,count来统计。
 * 将转换返回：
[{
    $group:
    {
        _id: "SUM",//因为只有一个分组，随便字义一个字符串常量写死就行
        Money: { $max: "$Money" },//找到Money字段的最大值
        total_amount: { $sum: "$total_amount" },//汇总合计total_amount字段值总合
        total_count: { $sum: 1 }//这里是进行count计数统计,$sum值为1就表示计数
    }
}]
* 从以上语法中可以看到支持多个聚合字段一起计算，目前只用到同时聚合一个字段计算。
 * @param summary_type
 * @param summary_field
 */
export const getSummaryAggregateGroups = (summary_type: SteedosSummaryTypeValue, summary_field: string) => {
    let group: any = {
        _id: "summary_group"
    };
    const addFields = {};
    const groupKey = getSummaryAggregateGroupKey(summary_type, summary_field);
    switch (summary_type) {
        case SteedosSummaryTypeValue.COUNT:
            group[groupKey] = { $sum: 1 };
            break;
        case SteedosSummaryTypeValue.MAX:
            group[groupKey] = { $max: `$${summary_field}` };
            break;
        case SteedosSummaryTypeValue.MIN:
            group[groupKey] = { $min: `$${summary_field}` };
            break;
        case SteedosSummaryTypeValue.SUM:
            group[groupKey] = {
                $sum: {
                    $toDecimal: `$${summary_field}`
                }
            };
            addFields[summary_field] = {
                $toDouble: `$${summary_field}`
            }
            break;
        case SteedosSummaryTypeValue.AVG:
            group[groupKey] = { $avg: `$${summary_field}` };
            break;

    }

    const aggregation: any = [{
        $group: group
    }]
    if (!_.isEmpty(addFields)) {
        aggregation.push({
            $addFields: addFields
        });
    }
    return aggregation;
}

/**
 * 新建或修改记录时，根据查到的引用了该记录相关字段汇总配置，重新计算字段值，并把计算结果更新到数据库相关记录中
 * @param objectName 当前修改的记录所属对象名称
 * @param recordId 当前修改的记录ID
 * @param fieldSummaryConfig 查到的引用了该记录所属对象的汇总字段配置之一
 * 执行类似以下的聚合查找语句，并把查找结果更新到要汇总的主表对象关联记录中。
 * 聚合查找应付记录对象下合同_id为hNkuWqRmHtWaBvWpJ的所有记录，并可按sum,min,max,count来统计。
 db.account_payable.aggregate([
    {
        $match: {
            contractno: 'hNkuWqRmHtWaBvWpJ'
        }
    },
    {
        $group:
        {
            _id: "SUM",//因为只有一个分组，随便字义一个字符串常量写死就行
            Money: { $max: "$Money" },//找到Money字段的最大值
            total_amount: { $sum: "$total_amount" },//汇总合计total_amount字段值总合
            total_count: { $sum: 1 }//这里是进行count计数统计,$sum值为1就表示计数
        }
    }
])
* 从以上语法中可以看到支持多个聚合字段一起计算，目前只用到同时聚合一个字段计算。
* 以上语句返回的内容为：
[{
    "_id" : "SUM",
    "Money" : 100,
    "total_amount" : 33222,
    "count" : 2.0
}]
 */
export const getQuotedByObjectFieldSummaryValues = async (objectName: string, recordId: string, previousDoc: any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    // console.log("===getQuotedByObjectFieldSummaryValues===", objectName, recordId, JSON.stringify(fieldSummaryConfig));
    const { reference_to_field } = fieldSummaryConfig;
    const referenceToRecord = await getSteedosSchema().getObject(objectName).findOne(recordId, { fields: [reference_to_field] });
    let referenceToId: string;
    if (referenceToRecord) {
        referenceToId = referenceToRecord[reference_to_field];
    }
    let referenceToIds = [];
    let previousReferenceToId = previousDoc && previousDoc[reference_to_field];
    if (referenceToId) {
        referenceToIds.push(referenceToId);
        if (previousReferenceToId && previousReferenceToId != referenceToId) {
            // 应该额外再判断子表中master_detail字段值是否变更了，如果变更了，则需要额外对变更前的记录做汇总
            referenceToIds.push(previousReferenceToId);
        }
    }
    else {
        // 当子表中master_detail字段值为空，说明可能是直接删除了子表记录或者把子表记录的master_detail字段值修改为空了
        // 这里要区别下原来是否有值，如果原来本来就是空就不需要进一步汇总了，如果原来不是空则还是要拿到原来的值进行汇总
        if (previousReferenceToId) {
            referenceToIds.push(previousReferenceToId);
        }
    }
    // console.log("===getQuotedByObjectFieldSummaryValues===referenceToIds====", referenceToIds);
    if (!referenceToIds.length) {
        return;
    }
    return await getReferenceTosFieldSummaryValues(referenceToIds, fieldSummaryConfig, userSession);
}


/**
 * 执行聚合计算，并把聚合汇总后的值更新到数据库中
 * 此函数目前只在汇总字段批量重算按钮功能中调用，界面上新建、编辑记录已经不再调用此函数，而是调用getReferenceTosFieldSummaryValues获取汇总计算结果，合并多个汇总字段计算结果统一更新到主表记录中
 * @param referenceToIds 子表上的master_detail关联到主表对象的字段值集合，是多条子表记录上的关联id值组成的数组
 * @param fieldSummaryConfig 
 * @param userSession 
 */
export const updateReferenceTosFieldSummaryValue = async (referenceToIds: Array<string> | Array<JsonMap> | any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    // docs表示要更新的主表记录内容按masterRecordId拼成键值对象，其格式为：{masterRecordId:{sumFieldName1: sumValue1, sumFieldName2: sumValue2}}, 比如：{ '65fea8c5585318611ab701a2': { sum_a__c: 33, sum_amount__c: 100 } }
    let docs = await getReferenceTosFieldSummaryValues(referenceToIds, fieldSummaryConfig, userSession);
    if (!_.isEmpty(docs)) {
        for (const masterRecordId in docs) {
            await updateReferenceToFieldSummaryValue(masterRecordId, docs[masterRecordId], fieldSummaryConfig, userSession);
        }

        // 这里不再调用 updateQuotedByReferenceTosForSummaryType函数，是因为汇总字段update时不再使用directUpdate，会触发object method代理函数 callAdapter 重新执行级联的公式和汇总字段运算
        // let referenceToIds = _.keys(docs);
        // // 这里特意重新遍历一次referenceToIds而不是直接在updateReferenceToFieldSummaryValue函数中每次更新一条记录后立即处理被引用字段的级联变更，见：公式或汇总触发级联重算时，数据类型变更可能会造成无法重算 #965
        // await updateQuotedByReferenceTosForSummaryType(referenceToIds, fieldSummaryConfig, userSession);
    }
}

/**
 * 执行聚合计算，并把聚合汇总后的值，即要更新到数据库中的值返回
 * @param referenceToIds 子表上的master_detail关联到主表对象的字段值集合，是多条子表记录上的关联id值组成的数组
 * @param fieldSummaryConfig 
 * @param userSession 
 * return 要更新的主表记录内容按masterRecordId拼成键值对象，其格式为：{masterRecordId:{sumFieldName1: sumValue1, sumFieldName2: sumValue2}}, 比如：{ '65fea8c5585318611ab701a2': { sum_a__c: 33, sum_amount__c: 100 } }
 */
export const getReferenceTosFieldSummaryValues = async (referenceToIds: Array<string> | Array<JsonMap> | any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    // console.log("===getReferenceTosFieldSummaryValues====referenceToIds, fieldSummaryConfig==", referenceToIds, fieldSummaryConfig);
    const { reference_to_field, summary_type, summary_field, summary_object, object_name, summary_filters, field_name, reference_to_field_reference_to } = fieldSummaryConfig;
    const setDocs = {};
    if (!_.isArray(referenceToIds)) {
        referenceToIds = [referenceToIds];
    }
    // 需要使用aggregate来汇总计算
    let aggregateGroups = getSummaryAggregateGroups(summary_type, summary_field);
    // console.log("===getReferenceTosFieldSummaryValues====aggregateGroups==", aggregateGroups);
    for (let referenceToId of referenceToIds) {
        if (typeof referenceToId !== "string") {
            referenceToId = <string>referenceToId[reference_to_field_reference_to || "_id"];
        }
        let referenceToFilters: any = [[reference_to_field, "=", referenceToId]];
        let aggregateFilters: any = referenceToFilters;
        if (summary_filters && summary_filters.length) {
            if (typeof summary_filters === "string") {
                // 传入的过滤条件为odata字符串时，需要把aggregateFilters也解析为odata串并取AND
                aggregateFilters = formatFiltersToODataQuery(referenceToFilters);
                aggregateFilters = `(${aggregateFilters}) and (${summary_filters})`;
            }
            else {
                const summaryObject = getObjectConfig(summary_object);
                if (!summaryObject) {
                    throw new Error(`The summary_object '${summary_object}' of the field '${field_name}' on the object '${object_name}' is not found in the default datasource.`);
                }
                processFilters(summary_filters, summaryObject.fields);
                aggregateFilters = [referenceToFilters, summary_filters];
            }
        }

        if (userSession && aggregateFilters && !_.isString(aggregateFilters)) {
            // 过滤器中支持userSession变量的写法，比如[["owner", "=", "{userId}"]]
            aggregateFilters = formatFiltersToODataQuery(aggregateFilters, userSession);
        }
        // console.log("===aggregateFilters===", aggregateFilters);
        const aggregateResults = await getSteedosSchema().getObject(summary_object).directAggregate({
            filters: aggregateFilters
        }, aggregateGroups);
        // console.log("===aggregateResults===", aggregateResults);
        if (aggregateResults && aggregateResults.length) {
            const groupKey = getSummaryAggregateGroupKey(summary_type, summary_field);
            let summarizedValue = aggregateResults[0][groupKey];
            setReferenceToFieldSummaryValuesByReferenceToId(referenceToId, field_name, summarizedValue, setDocs);
            // await updateReferenceToFieldSummaryValue(referenceToId, summarizedValue, fieldSummaryConfig, userSession);
        }
        else {
            // 说明referenceToId对应的主表记录找不到了，可能被删除了，不用报错或其他处理
            // 也可能是要汇总的子表记录全部删除了，或者不再有任何子表记录符合汇总字段过滤条件，这时应该重置汇总字段值
            const masterRecord = await getSteedosSchema().getObject(object_name).findOne(referenceToId, { fields: ["_id"] });
            if (masterRecord) {
                // sum和count类型直接按0值处理而不是空值，min/max类型（包括数值和日期时间字段）显示为空值
                let defaultValue = SteedosSummaryTypeBlankValue[summary_type];
                setReferenceToFieldSummaryValuesByReferenceToId(referenceToId, field_name, defaultValue, setDocs);
                // await updateReferenceToFieldSummaryValue(referenceToId, defaultValue, fieldSummaryConfig, userSession);
            }

        }
    }
    // 这里特意重新遍历一次referenceToIds而不是直接在updateReferenceToFieldSummaryValue函数中每次更新一条记录后立即处理被引用字段的级联变更，见：公式或汇总触发级联重算时，数据类型变更可能会造成无法重算 #965
    // await updateQuotedByReferenceTosForSummaryType(referenceToIds, fieldSummaryConfig, userSession);

    return setDocs;
}

export const setReferenceToFieldSummaryValuesByReferenceToId = (referenceToId: string, field_name: string, value: any, setDocs: any) => {
    if (!setDocs[referenceToId]) {
        setDocs[referenceToId] = {};
    }
    setDocs[referenceToId][field_name] = value;
    return setDocs;
}

export const updateReferenceToFieldSummaryValue = async (referenceToId: string, setDoc: any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    const { field_name, object_name, reference_to_field_reference_to } = fieldSummaryConfig;
    // let setDoc = {};
    // setDoc[field_name] = value;
    if (reference_to_field_reference_to && reference_to_field_reference_to !== "_id") {
        const referenceToRecords = await getSteedosSchema().getObject(object_name).directFind({ filters: [reference_to_field_reference_to, "=", referenceToId] });
        if (referenceToRecords && referenceToRecords.length) {
            referenceToId = referenceToRecords[0]["_id"];
        }
        else {
            // 如果没找到关联记录，说明可能关联到的主表记录的reference_to_field属性值被修改了，无法更新统计结果
            return;
        }
    }
    // await getSteedosSchema().getObject(object_name).directUpdate(referenceToId, setDoc);
    // 改为普通update，特意触发主表记录的整个更新流程，见：#6611
    await getSteedosSchema().getObject(object_name).update(referenceToId, setDoc);
}

export const updateQuotedByReferenceTosForSummaryType = async (referenceToIds: Array<string> | Array<JsonMap> | any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, userSession: any) => {
    const { field_name, object_name } = fieldSummaryConfig;
    if (!_.isArray(referenceToIds)) {
        referenceToIds = [referenceToIds];
    }
    const fieldNames = [field_name];
    for (let referenceToId of referenceToIds) {
        if (typeof referenceToId !== "string") {
            referenceToId = <string>referenceToId._id;
        }
        // console.log("===updateQuotedByReferenceTosForSummaryType====object_name, referenceToId, field_name===", object_name, referenceToId, field_name);
        // 汇总字段修改后，需要找到引用了该字段的其他公式字段并更新其值
        await runQuotedByObjectFieldFormulas(object_name, <string>referenceToId, userSession, {
            fieldNames
        });
        // 汇总字段修改后，需要找到引用了该字段的其他汇总字段并更新其值
        await runQuotedByObjectFieldSummaries(object_name, <string>referenceToId, null, userSession, {
            fieldNames
        });
    }
}

/**
 * 新建主表记录时需要处理汇总字段默认值，只有insert主表记录才需要调用该函数
 * @param objectName 
 * @param recordId 
 */
export const runCurrentObjectFieldSummaries = async function (objectName: string, recordId: string) {
    const configs = await getObjectFieldSummaryConfigs(objectName);
    if (!configs.length) {
        return;
    }
    let setDoc = {};
    for (const config of configs) {
        // sum和count类型直接按0值处理而不是空值，min/max类型（包括数值和日期时间字段）显示为空值
        let defaultValue = SteedosSummaryTypeBlankValue[config.summary_type];
        if (defaultValue != null) {
            setDoc[config.field_name] = defaultValue;
        }
    }
    if (_.isEmpty(setDoc)) {
        return;
    }
    await getSteedosSchema().getObject(objectName).directUpdate(recordId, setDoc);
}