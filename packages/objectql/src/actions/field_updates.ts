import { getObject, computeFormula, SteedosError } from '../index';
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
            return await computeFormula(action.formula, action.object_name, recordId, userSession.userId, userSession.spaceId);
        default:
            return;
    }
}

export async function runFieldUpdateAction(action: any, recordId: any, userSession: any){
    const record = await getObject(action.object_name).findOne(recordId, null);
    let mainObjectName = null;
    let recordIdToUpdate: string;
    let previousRecord: any;
    if(action.target_object && action.target_object != action.object_name){
        mainObjectName = getObject(action.object_name).getField(action.target_object).reference_to;
        if(!_.isString(mainObjectName)){
            throw new SteedosError('target_object must be a string');
        }
        recordIdToUpdate = record[action.target_object];
        const fieldValue = await getFieldValue(action, recordId, userSession);
        previousRecord = await getObject(mainObjectName).findOne(recordIdToUpdate, null);
        await getObject(mainObjectName).directUpdate(recordIdToUpdate, {[action.field_name]: fieldValue});
    }else{
        mainObjectName = action.object_name;
        recordIdToUpdate = record._id;
        const fieldValue = await getFieldValue(action, recordId, userSession);
        previousRecord = record;
        await getObject(mainObjectName).directUpdate(recordIdToUpdate, {[action.field_name]: fieldValue});
    }

    // 字段更新后，需要找到引用了该字段的公式字段并更新其值
    await runQuotedByObjectFieldFormulas(mainObjectName, recordIdToUpdate, userSession, {
        fieldNames: [action.field_name]
    });
    // 字段更新后，需要找到引用了该字段的累计汇总字段并更新其值
    await runQuotedByObjectFieldSummaries(mainObjectName, recordIdToUpdate, null, userSession, {
        fieldNames: [action.field_name]
    });

    return <FieldUpdateTarget>{
        object_name: mainObjectName,
        record_id: recordIdToUpdate,
        field_name: action.field_name,
        previous_record: previousRecord
    };
}

export async function runFieldUpdateActions(ids: Array<string>, recordId: any, userSession: any){

    const filters = [];
    let targets: Array<FieldUpdateTarget> = [];

    if(!_.isEmpty(ids)){
        filters.push(['_id', 'in', ids])
    }
    
    if(!_.isEmpty(filters)){
        const actions = await getObject("action_field_updates").find({filters: filters})
        for (const action of actions) {
            const target:FieldUpdateTarget = await runFieldUpdateAction(action, recordId, userSession);
            targets.push(target);
        }
    }
    return targets;
}