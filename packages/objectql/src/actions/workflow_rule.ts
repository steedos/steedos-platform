import { getObject } from '../index';
import { computeFormula } from '../formula'
import { WorkflowRule } from './types/workflow_rule';
import { JsonMap } from "@salesforce/ts-types";
import { runFieldUpdateActions } from './field_updates'
import { FieldUpdateTarget } from './types/field_update_target';
import _ = require('underscore');

export async function runObjectWorkflowRules(objectName, event, record, userSession, previousRecord, fromRuleId?) {
    if(!_.include(['insert', 'update'], event) || !record){
        return ;
    }

    let filters = [['object_name', '=', objectName], ['space', '=', record.space], ['active', '=', true]];

    if(fromRuleId){
        // 如果是级联触发的工作流规则，则要排除掉其原本来自的工作流规则，避免死循环
        filters.push(['_id', '<>', fromRuleId]);
    }

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

    let allTargets: Array<FieldUpdateTarget> = [];
    let tempTargets: Array<FieldUpdateTarget> = [];
    const wfRules = await getObject('workflow_rule').find({ filters: filters});
    for (const wfRule of wfRules) {
        if(wfRule.trigger_type === 'onCreateOrTriggeringUpdate'){
            tempTargets = await runWFRule(wfRule, record, userSession, previousRecord)
        }else{
            tempTargets = await runWFRule(wfRule, record, userSession)
        }
        tempTargets.forEach((target) => {
            target.from_rule_id = wfRule._id;
        });
        allTargets = allTargets.concat(tempTargets);
    }
    allTargets.forEach(async (target)=>{
        // 因为工作流操作可能更改记录字段值，所以这里只能根据id重新取record
        const targetRecord = await getObject(target.object_name).findOne(target.record_id, null);
        await runObjectWorkflowRules(target.object_name, event, targetRecord, userSession, target.previous_record, target.from_rule_id);
    });
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
    let targets: Array<FieldUpdateTarget> = [];
    
    if(previousRecord){
        previousIsTrue = await computeFormula(rule.formula, rule.object_name, previousRecord, userSession.userId, userSession.spaceId);
    }

    if(!previousIsTrue){
        let isTrue = await computeFormula(rule.formula, rule.object_name, record, userSession.userId, userSession.spaceId)
        if (isTrue) {
            targets = await runFieldUpdateActions(rule.updates_field_actions, record._id, userSession);
        }
    }
    return targets;
}