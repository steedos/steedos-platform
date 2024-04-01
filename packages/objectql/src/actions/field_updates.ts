import { getObject, computeFormula, SteedosError, getMetadata } from '../index';
import { runQuotedByObjectFieldFormulas } from '../formula';
import { runQuotedByObjectFieldSummaries } from '../summary';
import { FieldUpdateTarget } from './types/field_update_target';
const _ = require('underscore');

const getFieldValue = async (action: any, recordId: string, userSession: any)=>{
    switch (action.operation) {
        case 'null':
            return null;
        case 'literal':
            return action.literal_value
        case 'formula':
            return await computeFormula(action.formula, action.object_name, recordId, userSession);
        default:
            return;
    }
}

export function getFieldUpdateActionTargetObjectName(action: any){
    const isCrossedObject = action.target_object != action.object_name;
    if(isCrossedObject){
        // 如果是跨对象字段更新，则target_object保存的是关联字段名，而不是对象名称
        let result = getObject(action.object_name).getField(action.target_object).reference_to;
        if(!_.isString(result)){
            throw new SteedosError('target_object must be a string');
        }
        return result;
    }
    else{
        return action.object_name;
    }
}

export async function runFieldUpdateAction(action: any, recordId: any, userSession: any){
    const record = await getObject(action.object_name).findOne(recordId, null);
    let recordIdToUpdate: string;
    let previousRecord: any;
    let needToReevaluate = false;//是否返回FieldUpdateTarget以备字段更改后重新评估工作流规则。
    // 需要注意的是needToReevaluate与字段更新上的reevaluate_on_change这个勾选框属性有关，
    // 但是reevaluate_on_change这个勾选框只标识是否重新评估字段更新所关联的对象的工作流规则，
    // 对于跨对象的字段更新，始终不会重新评估这些工作流规则，且始终会重新评估其要更新的对象的所有工作流规则。
    const isCrossedObject = action.target_object != action.object_name; //因不允许字段名（api_name）配置成所属对象api_name同名值，所以这里直接这样判断就行了
    const mainObjectName = getFieldUpdateActionTargetObjectName(action);
    if(isCrossedObject){
        // 跨对象字段更新
        recordIdToUpdate = record[action.target_object];
        previousRecord = recordIdToUpdate && await getObject(mainObjectName).findOne(recordIdToUpdate, null);
        //对于跨对象的字段更新，虽然始终不会重新评估字段更新关联对象的工作流规则，但是始终会重新评估其要更新的对象的所有工作流规则。
        needToReevaluate = true;
    }else{
        // 本对象字段更新
        recordIdToUpdate = record._id;
        previousRecord = record;
        //对于非跨对象的字段更新，是否重新评估字段更新关联对象的工作流规则由其属性reevaluate_on_change决定。
        needToReevaluate = action.reevaluate_on_change;
    }
    const objectToUpdate = getObject(mainObjectName);
    const fieldToUpdate = objectToUpdate.getField(action.field_name);
    if(["formula", "summary", "autonumber"].indexOf(fieldToUpdate.type) > -1){
        // 公式、累计汇总、自动编号三种字段类型是只读的，不允许字段更新来变更其值
        return null;
    }
    const newFieldValue = await getFieldValue(action, recordId, userSession);
    if(recordIdToUpdate && newFieldValue !== (previousRecord && previousRecord[action.field_name])){
        if(action.undirect === true){
            await objectToUpdate.update(recordIdToUpdate, {[action.field_name]: newFieldValue});        
        }else{
            // 只有值变更时才执行字段更新、级联公式重算、级联汇总字段重算、重新评估工作流规则等操作
            await objectToUpdate.directUpdate(recordIdToUpdate, {[action.field_name]: newFieldValue});
            // 字段更新后，需要找到引用了该字段的公式字段并更新其值
            await runQuotedByObjectFieldFormulas(mainObjectName, recordIdToUpdate, userSession, {
                fieldNames: [action.field_name]
            });
            // 字段更新后，需要找到引用了该字段的累计汇总字段并更新其值
            await runQuotedByObjectFieldSummaries(mainObjectName, recordIdToUpdate, null, userSession, {
                fieldNames: [action.field_name]
            });
        }
    }
    else{
        // 值没变更时强制重置needToReevaluate为false，即不需要执行相关工作流规则重新评估
        needToReevaluate = false;
    }

    if(needToReevaluate){
        return <FieldUpdateTarget>{
            object_name: mainObjectName,
            record_id: recordIdToUpdate,
            field_name: action.field_name,
            previous_record: previousRecord
        };
    }
    else{
        return null;
    }
}

export async function runFieldUpdateActions(ids: Array<string>, recordId: any, userSession: any, spaceId?: string){

    const filters = [];
    let targets: Array<FieldUpdateTarget> = [];

    if(!_.isEmpty(ids)){
        filters.push([['name', 'in', ids],'or', ['_id', 'in', ids]])
    }
    
    if(!_.isEmpty(filters)){
        const actions = await getMetadata(`action_field_updates`).find(filters, userSession?.spaceId || spaceId)
        // await getObject("action_field_updates").find({filters: filters})
        for (const action of actions) {
            const target:FieldUpdateTarget = await runFieldUpdateAction(action, recordId, userSession);
            if(target){
                targets.push(target);
            }
        }
    }
    return targets;
}