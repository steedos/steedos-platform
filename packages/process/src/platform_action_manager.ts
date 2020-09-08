const objectql = require('@steedos/objectql');
const _ = require("underscore");

const getFieldValue = async (action: any, recordId: string, userSession: any)=>{
    switch (action.operation) {
        case 'null':
            return null;
        case 'literal':
            return action.literal_value
        case 'formula':
            return await objectql.computeFormula(action.formula, action.object_name, recordId, userSession.userId, userSession.spaceId);
        default:
            return;
    }
}

const runAction = async (action: any, recordId: any, userSession: any)=>{
    const record = await objectql.getObject(action.object_name).findOne(recordId);
    let mainObjectName = null;
    if(action.target_object && action.target_object != action.object_name){
        mainObjectName = objectql.getObject(action.object_name).getField(action.target_object).reference_to;
        if(!_.isString(mainObjectName)){
            throw new Error('target_object must be a string');
        }
        const fieldValue = await getFieldValue(action, recordId, userSession);
        await objectql.getObject(mainObjectName).directUpdate(record[action.target_object], {[action.field_name]: fieldValue});
    }else{
        const fieldValue = await getFieldValue(action, recordId, userSession);
        await objectql.getObject(action.object_name).directUpdate(record._id, {[action.field_name]: fieldValue});
    }
}

export const runProcessNodeAction = async (processNodeId: string, when: string, recordId: string, userSession: any)=>{
    const actions = await objectql.getObject("action_field_updates").find({filters: [["process_node", "=", processNodeId], ["when", "=", when], ["space", "=", userSession.spaceId]]})
    for (const action of actions) {
        await runAction(action, recordId, userSession)
    }
}

export const runProcessAction = async (processId: string, when: string, recordId: string, userSession: any)=>{
    const actions = await objectql.getObject("action_field_updates").find({filters: [["process_definition", "=", processId], ["when", "=", when], ["space", "=", userSession.spaceId]]})
    for (const action of actions) {
        await runAction(action, recordId, userSession)
    }
}