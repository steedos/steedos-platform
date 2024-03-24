import { getObject, getMetadata } from '../index';
import { computeFormula } from '../formula'
import { WorkflowRule } from './types/workflow_rule';
import { JsonMap } from "@salesforce/ts-types";
import { runFieldUpdateActions } from './field_updates'
import { FieldUpdateTarget } from './types/field_update_target';
import { runWorkflowNotifyActions } from './workflow_notifications'
import { runWorkflowOutboundMessageActions } from './workflow_outbound_messages'
import _ = require('underscore');

export type WorkflowRulesConfig = {
    object_name: string,
    event: string,
    record: any,
    user_session: any,
    previous_record: any
}

// 同一个流程规则触发的级联流程规则最大循环执行次数
const MAX_COUNT: number = 5;

export class WorkflowRulesRunner{

    private object_name: string;
    private event: string;
    private record: any;
    private user_session: any;
    private previous_record: any;
    private counter: any;

    constructor(config: WorkflowRulesConfig){
        this.object_name = config.object_name
        this.event = config.event
        this.record = config.record
        this.user_session = config.user_session
        this.previous_record = config.previous_record
        this.counter = {};
    }

    async run(){
        await this.runObjectWorkflowRules(this.object_name, this.event, this.record, this.user_session, this.previous_record);
    }

    async runObjectWorkflowRules(objectName, event, record, userSession, previousRecord, fromRuleId?){
        if(!_.include(['insert', 'update'], event) || !record){
            return ;
        }
        let filters = [['object_name', '=', objectName], ['active', '=', true]];   //['space', '=', record.space], 
    
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
        const wfRules = await getMetadata('workflow_rule').find(filters, record.space);
        // await getObject('workflow_rule').find({ filters: filters});
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

        if(fromRuleId){
            if(!this.counter[fromRuleId]){
                this.counter[fromRuleId] = 0;
            }
            this.counter[fromRuleId]++;
            if(this.counter[fromRuleId] > MAX_COUNT){
                // 当同一个工作流规则反复多次循环级联调用时直接退出循环。
                return;
            }
        }
        for (const target of allTargets) {
            // 因为工作流操作可能更改记录字段值，所以这里只能根据id重新取record
            const targetRecord = await getObject(target.object_name).findOne(target.record_id, null);
            await this.runObjectWorkflowRules(target.object_name, event, targetRecord, userSession, target.previous_record, target.from_rule_id);
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

async function runWFRule(rule: WorkflowRule, record: JsonMap, userSession: any, previousRecord?: JsonMap) {
    let previousIsTrue = false;
    let targets: Array<FieldUpdateTarget> = [];
    
    if(previousRecord){
        previousIsTrue = await computeFormula(rule.formula, rule.object_name, previousRecord, userSession);
    }

    if(!previousIsTrue){
        let isTrue = await computeFormula(rule.formula, rule.object_name, record, userSession)
        if (isTrue) {
            targets = await runFieldUpdateActions(rule.updates_field_actions, record._id, userSession);
            await runWorkflowNotifyActions(rule.workflow_notifications_actions, record._id, userSession);
            await runWorkflowOutboundMessageActions(rule.workflow_outbound_messages_actions, record._id, userSession)
        }
    }
    return targets;
}