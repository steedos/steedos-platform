import { getObject } from '../index';
import { computeFormula } from '../formula'
import { WorkflowRule } from './types/workflow_rule';
import { JsonMap } from "@salesforce/ts-types";
import { runFieldUpdateActions } from './field_updates'

export function runObjectWorkflowRules(objectName, event, record, userSession, previousRecord) {
    switch (event) {
        case 'insert':
            break;
        case 'update':
            break;
        default:
            break;
    }
}

export async function runObjectWorkflowRulesOnCreateOnly(objectName, record, userSession) {
    const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onCreateOnly']] });
    for (const wfRule of wfRules) {
        await runWFRule(wfRule, record, userSession)
    }
}

export async function runObjectWorkflowRulesOnAllChanges(objectName, record, userSession) {
    const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onCreateOnly']] });
    for (const wfRule of wfRules) {
        await runWFRule(wfRule, record, userSession)
    }
}

export async function runObjectWorkflowRulesOnCreateOrTriggeringUpdate(objectName, record, userSession, previousRecord) {
    const wfRules = await getObject('workflow_rule').find({ filters: [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true], ['trigger_type', '=', 'onCreateOnly']] });
    for (const wfRule of wfRules) {
        await runWFRule(wfRule, record, userSession)
    }
}

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