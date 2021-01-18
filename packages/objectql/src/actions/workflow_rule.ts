import { getObject } from '../index';
import { computeFormula } from '../formula'
import { WorkflowRule } from './types/workflow_rule';
import { JsonMap } from "@salesforce/ts-types";
import { runFieldUpdateActions } from './field_updates'
import _ = require('underscore');

export async function runObjectWorkflowRules(objectName, event, record, userSession, previousRecord) {
    if(!_.include(['insert', 'update'], event) || !record){
        return ;
    }

    let filters = [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true]];

    switch (event) {
        case 'insert':
            filters.push([['trigger_type', '=', 'onCreateOnly'], 'or', ['trigger_type', '=', 'onAllChanges'], 'or', ['trigger_type', '=', 'onCreateOrTriggeringUpdate']])
            break;
        case 'update':
            filters.push([['trigger_type', '=', 'onAllChanges'], 'or', ['trigger_type', '=', 'onCreateOrTriggeringUpdate']])
            break;
        default:
            break;
    }

    const wfRules = await getObject('workflow_rule').find({ filters: filters});
    for (const wfRule of wfRules) {
        if(wfRule.trigger_type === 'onCreateOrTriggeringUpdate'){
            await runWFRule(wfRule, record, userSession, previousRecord)
        }else{
            await runWFRule(wfRule, record, userSession)
        }
    }
}

// export async function runObjectWorkflowRulesOnCreateOnly(objectName, record, userSession) {
//     const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onCreateOnly']] });
//     for (const wfRule of wfRules) {
//         await runWFRule(wfRule, record, userSession)
//     }
// }

// export async function runObjectWorkflowRulesOnAllChanges(objectName, record, userSession) {
//     const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onAllChanges']] });
//     for (const wfRule of wfRules) {
//         await runWFRule(wfRule, record, userSession)
//     }
// }

// export async function runObjectWorkflowRulesOnCreateOrTriggeringUpdate(objectName, record, userSession, previousRecord) {
//     const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onCreateOrTriggeringUpdate']] });
//     for (const wfRule of wfRules) {
//         await runWFRule(wfRule, record, userSession, previousRecord)
//     }
// }

async function runWFRule(rule: WorkflowRule, record: JsonMap, userSession, previousRecord?: JsonMap) {
    let previousIsTrue = false;
    
    if(previousRecord){
        previousIsTrue = await computeFormula(rule.formula, rule.object_name, previousRecord, userSession.userId, userSession.spaceId);
    }

    if(!previousIsTrue){
        let isTrue = await computeFormula(rule.formula, rule.object_name, record, userSession.userId, userSession.spaceId)
        if (isTrue) {
            runFieldUpdateActions(rule.updates_field_actions, record._id, userSession)
        }
    }
}