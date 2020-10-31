import { getObject, computeFormula, SteedosError } from '../index';
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
    if(action.target_object && action.target_object != action.object_name){
        mainObjectName = getObject(action.object_name).getField(action.target_object).reference_to;
        if(!_.isString(mainObjectName)){
            throw new SteedosError('target_object must be a string');
        }
        const fieldValue = await getFieldValue(action, recordId, userSession);
        await getObject(mainObjectName).directUpdate(record[action.target_object], {[action.field_name]: fieldValue});
    }else{
        const fieldValue = await getFieldValue(action, recordId, userSession);
        await getObject(action.object_name).directUpdate(record._id, {[action.field_name]: fieldValue});
    }
}

export async function runFieldUpdateActions(ids: Array<string>, recordId: any, userSession: any){

    const filters = [];

    if(!_.isEmpty(ids)){
        filters.push(['_id', 'in', ids])
    }
    
    if(!_.isEmpty(filters)){
        const actions = await getObject("action_field_updates").find({filters: filters})
        for (const action of actions) {
            await runFieldUpdateAction(action, recordId, userSession)
        }
    }
}