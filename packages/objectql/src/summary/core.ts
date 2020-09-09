import { getSteedosSchema } from '../index';
import { SteedosFieldSummaryTypeConfig, SteedosSummaryTypeValue } from './type';
import { getObjectQuotedByFieldSummaryConfigs } from './field_summary';
import { runQuotedByObjectFieldFormulas } from '../formula';
import _ = require('lodash');
import { JsonMap } from '@salesforce/ts-types';

/**
 * 在所有字段引用关系（包括跨对象的字段引用关系）中找到引用了当前正在insert/update的对象字段的公式字段并更新其字段值
 * @param objectName 
 * @param recordId 
 * @param currentUserId 
 * @param fieldNames 传入该参数时，只查找和处理引用了该对象中这些指定字段的公式字段
 * @param quotedByConfigs 如果已经根据objectName和fieldNames查过相关配置了，请直接传入，可以避免重复查找，提高性能
 */
export const runQuotedByObjectFieldSummaries = async function (objectName: string, recordId: string, previousDoc: any, currentUserId: string, fieldNames?: Array<string>, quotedByConfigs?: Array<SteedosFieldSummaryTypeConfig>) {
    if (!quotedByConfigs) {
        quotedByConfigs = getObjectQuotedByFieldSummaryConfigs(objectName, fieldNames);
    }
    if (!quotedByConfigs.length) {
        return;
    }
    for (const config of quotedByConfigs) {
        await updateQuotedByObjectFieldSummaryValue(objectName, recordId, previousDoc, config, currentUserId);
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
            group[groupKey] = { $sum: `$${summary_field}` };
            break;

    }
    return [{
        $group: group
    }];
}

/**
 * 修改记录时，根据查到的引用了该记录相关字段公式配置，重新计算字段公式，并把计算结果更新到数据库相关记录中
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
export const updateQuotedByObjectFieldSummaryValue = async (objectName: string, recordId: string, previousDoc: any, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, currentUserId: string) => {
    // console.log("===updateQuotedByObjectFieldSummaryValue===", objectName, recordId, JSON.stringify(fieldSummaryConfig));
    const { reference_to_field } = fieldSummaryConfig;
    const referenceToRecord = await getSteedosSchema().getObject(objectName).findOne(recordId, { fields: [reference_to_field] });
    let referenceToId: string;
    if(referenceToRecord){
        referenceToId = referenceToRecord[reference_to_field];
    }
    let referenceToIds = [];
    let previousReferenceToId = previousDoc && previousDoc[reference_to_field];
    if(referenceToId){
        referenceToIds.push(referenceToId);
        if(previousReferenceToId && previousReferenceToId != referenceToId){
            // 应该额外再判断子表中master_detail字段值是否变更了，如果变更了，则需要额外对变更前的记录做汇总
            referenceToIds.push(previousReferenceToId);
        }
    }
    else {
        // 当子表中master_detail字段值为空，说明可能是直接删除了子表记录或者把子表记录的master_detail字段值修改为空了
        // 这里要区别下原来是否有值，如果原来本来就是空就不需要进一步汇总了，如果原来不是空则还是要拿到原来的值进行汇总
        if(previousReferenceToId){
            referenceToIds.push(previousReferenceToId);
        }
    }
    // console.log("===updateQuotedByObjectFieldSummaryValue===referenceToIds====", referenceToIds);
    if(!referenceToIds.length){
        return;
    }
    await updateReferenceTosFieldSummaryValue(referenceToIds, fieldSummaryConfig, currentUserId);
}

export const updateReferenceTosFieldSummaryValue = async (referenceToIds: Array<string> | Array<JsonMap>, fieldSummaryConfig: SteedosFieldSummaryTypeConfig, currentUserId: string) => {
    const { reference_to_field, summary_type, summary_field, summary_object, field_name, object_name } = fieldSummaryConfig;
    if (!_.isArray(referenceToIds)) {
        referenceToIds = [referenceToIds];
    }
    // 需要使用aggregate来汇总计算
    let aggregateGroups = getSummaryAggregateGroups(summary_type, summary_field);
    for (let referenceToId of referenceToIds) {
        if(typeof referenceToId !== "string"){
            referenceToId = <string>referenceToId._id;
        }
        let aggregateFilters = [[reference_to_field, "=", referenceToId]];
        const aggregateResults = await getSteedosSchema().getObject(summary_object).aggregate({
            filters: aggregateFilters
        }, aggregateGroups);
        if (aggregateResults && aggregateResults.length) {
            let setDoc = {};
            const groupKey = getSummaryAggregateGroupKey(summary_type, summary_field);
            setDoc[field_name] = aggregateResults[0][groupKey];
            await getSteedosSchema().getObject(object_name).directUpdate(referenceToId, setDoc);
            // 汇总字段修改后，需要找到引用了该字段的其他公式字段并更新其值
            // console.log("===updateReferenceTosFieldSummaryValue====object_name, referenceToId, field_name===", object_name, referenceToId, field_name);
            await runQuotedByObjectFieldFormulas(object_name, referenceToId, currentUserId, {
                fieldNames:[field_name]
            })
        }
        else {
            // 说明referenceToId对应的主表记录找不到了，可能被删除了，不用报错或其他处理
        }
    }
}