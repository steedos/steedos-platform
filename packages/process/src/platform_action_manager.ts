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
    const processNode = await objectql.getObject("process_node").findOne(processNodeId);
    const filters = [];
    switch (when) {
        case 'approval':
            if(!_.isEmpty(processNode.approval_updates_field_actions) && _.isArray(processNode.approval_updates_field_actions)){
                filters.push(['_id', 'in', processNode.approval_updates_field_actions])
            }
            break;
        case 'rejection':
            if(!_.isEmpty(processNode.rejection_updates_field_actions) && _.isArray(processNode.rejection_updates_field_actions)){
                filters.push(['_id', 'in', processNode.rejection_updates_field_actions])
            }
            break;
        default:
            throw new Error(`无效的参数when: ${when}`, );
    }
    if(!_.isEmpty(filters)){
        const actions = await objectql.getObject("action_field_updates").find({filters: filters})
        for (const action of actions) {
            await runAction(action, recordId, userSession)
        }
    }
}

export const runProcessAction = async (processId: string, when: string, recordId: string, userSession: any)=>{
    const process = await objectql.getObject("process_definition").findOne(processId);
    const filters = [];
    switch (when) {
        case 'initial_submission':
            if(!_.isEmpty(process.initial_submission_updates_field_actions) && _.isArray(process.initial_submission_updates_field_actions)){
                filters.push(['_id', 'in', process.initial_submission_updates_field_actions])
            }
            break;
        case 'final_approval':
            if(!_.isEmpty(process.final_approval_updates_field_actions) && _.isArray(process.final_approval_updates_field_actions)){
                filters.push(['_id', 'in', process.final_approval_updates_field_actions])
            }
            break;
        case 'final_rejection':
            if(!_.isEmpty(process.final_rejection_record_lock) && _.isArray(process.final_rejection_record_lock)){
                filters.push(['_id', 'in', process.final_rejection_record_lock])
            }
            break;
        case 'recall':
            if(!_.isEmpty(process.recall_updates_field_actions) && _.isArray(process.recall_updates_field_actions)){
                filters.push(['_id', 'in', process.recall_updates_field_actions])
            }
            break;
        default:
            throw new Error(`无效的参数when: ${when}`, );
    }
    if(!_.isEmpty(filters)){
        const actions = await objectql.getObject("action_field_updates").find({filters: filters})
        for (const action of actions) {
            await runAction(action, recordId, userSession)
        }
    }
}