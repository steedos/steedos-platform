/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-03-14 11:59:35
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const auth = require('@steedos/auth');
const _ = require('lodash');
const Fiber = require("fibers");
const objectql = require('@steedos/objectql');

Array.prototype.contains = function(ele)
{
    if(!ele) return false;
    var b=false;
    for(var i=0;i<this.length;i++){
        if(this[i]==ele){
            b=true;
        }
    }
    return b;
};

const getFlowVersion = (flow, flowVersionId)=>{
    if (flow.current._id === flowVersionId) {
        return flow.current;
      } else {
        return _.find(flow.historys, (history) => {
          return history._id === flowVersionId;
        });
      }
}

const getStep = (flow, flowVersionId, stepId)=>{
    const flowVersion = getFlowVersion(flow, flowVersionId);
    const step = _.find(flowVersion.steps, (step)=>{
        step.id = step._id;
        return step._id === stepId
    });
    return step;
}

const getSteps = (flow, flowVersionId)=>{
    const flowVersion = getFlowVersion(flow, flowVersionId);
    const steps = _.map(flowVersion.steps, (step)=>{
        step.id = step._id;
    });
    return steps;
}

const getStepsById = (flow, flowVersionId, stepIds)=>{
    const flowVersion = getFlowVersion(flow, flowVersionId);
    const steps = _.filter(flowVersion.steps, (step)=>{
        step.id = step._id;
        return _.includes(stepIds, step.id)
    });
    return steps;
}

const isSkipStep = function(instance, step){
    return _.includes(instance.skip_steps, step._id)
}


const getNextSteps = (flow, flowVersionId, instance, currentStep, judge, autoFormDoc, fields, showSkipStep)=>{
    if (!currentStep)
        return;

    if (!instance) {
        return [];
    }

    var nextSteps = new Array();
    var lines = currentStep.lines;

    switch (currentStep.step_type) {
        case 'condition': //条件
            const stepIds = uuflowManager.getNextSteps(instance, flow, currentStep, judge, autoFormDoc);
            nextSteps = getStepsById(flow, flowVersionId, stepIds)
            if (!nextSteps.length)
                throw new Error('未能根据条件找到下一步')
            break;
        case 'end': //结束
            return nextSteps;
        case 'sign': //审批
            if (judge == 'approved') { //核准
                lines.forEach(function(line) {
                    if (line.state == "approved") {
                        nextSteps.push(getStep(flow, flowVersionId, line.to_step));
                    }
                })
            } else if (judge == "rejected") { //驳回
                lines.forEach(function(line) {
                    if (line.state == "rejected") {
                        var rejected_step = getStep(flow, flowVersionId, line.to_step);
                        // 驳回时去除掉条件节点
                        if (rejected_step && rejected_step.step_type != "condition")
                            nextSteps.push(rejected_step);
                    }
                })

                var traces = instance.traces;

                traces.forEach(function(trace) {
                    if (trace.is_finished == true) {
                        var finished_step = getStep(flow, flowVersionId, trace.step);
                        if (finished_step.step_type != 'condition' && currentStep.id != finished_step.id)
                            nextSteps.push(finished_step);
                    }
                });


                //驳回时支持结束步骤
                var flow_steps = getSteps(flow, flowVersionId);
                var end_step = flow_steps.findPropertyByPK("step_type", "end");

                nextSteps.push(end_step);

            }
            break;
        default: //start：开始、submit：填写、counterSign：会签
            if (currentStep.step_type === 'counterSign' && currentStep.oneClickRejection && judge === "rejected"){
                lines.forEach(function(line) {
                    if (line.state == "rejected") {
                        var rejected_step = getStep(flow, flowVersionId, line.to_step);
                        // 驳回时去除掉条件节点
                        if (rejected_step && rejected_step.step_type != "condition")
                            nextSteps.push(rejected_step);
                    }
                })

                var traces = instance.traces;

                traces.forEach(function(trace) {
                    if (trace.is_finished == true) {
                        var finished_step = getStep(flow, flowVersionId, trace.step);
                        if (finished_step.step_type != 'condition' && currentStep.id != finished_step.id)
                            nextSteps.push(finished_step);
                    }
                });


                //驳回时支持结束步骤
                var flow_steps = getSteps(flow, flowVersionId);
                var end_step = flow_steps.findPropertyByPK("step_type", "end");

                nextSteps.push(end_step);
            } else {
                lines.forEach(function(line) {
                    if (line.state == "submitted") {
                        var submitted_step = getStep(flow, flowVersionId, line.to_step);
                        if (submitted_step)
                            nextSteps.push(submitted_step);
                    }
                });
            }

            break;
    }

    //去除重复
    nextSteps = _.compact(_.uniqBy(nextSteps, 'id'))

    // 按照步骤名称排序(升序)
    // nextSteps.sort(function(p1, p2) {
    //     return p1.name.localeCompare(p2.name);
    // });

    var condition_next_steps = new Array();
    nextSteps.forEach(function(nextStep) {
        if (nextStep.step_type == "condition") {
        	if(!judge && nextStep.step_type == 'sign'){
				judge = 'approved'
			}
            condition_next_steps = condition_next_steps.concat(getNextSteps(flow, flowVersionId, instance, nextStep, judge, autoFormDoc, fields, showSkipStep));
        }
    })

    nextSteps = nextSteps.concat(condition_next_steps);

    var rev_nextSteps = new Array();

    nextSteps.forEach(function(nextStep) {
        if (nextStep.step_type != "condition"){
            if(!showSkipStep && isSkipStep(instance, nextStep)){
				if(!judge && nextStep.step_type == 'sign'){
					judge = 'approved'
				}
                let nextStepsAfterSkipStep = getNextSteps(flow, flowVersionId, instance, nextStep, judge, autoFormDoc, fields, showSkipStep)
                let stepsWithOutCurrentStep = []
                for (const s of nextStepsAfterSkipStep) {
                    if (currentStep.id == s.id) {
                        continue
                    }
                    stepsWithOutCurrentStep.push(s)
                }
                // 后续步骤不应包含当前步骤
				rev_nextSteps = rev_nextSteps.concat(stepsWithOutCurrentStep)
            }else{
				rev_nextSteps.push(nextStep);
            }

        }

    });

    //去除重复
    rev_nextSteps = _.compact(_.uniqBy(rev_nextSteps, 'id'));

    // 会签节点，如果下一步有多个 则清空下一步
    if (currentStep.step_type == "counterSign" && rev_nextSteps.length > 1 && !currentStep.oneClickRejection) {
        rev_nextSteps = [];
    }
    return rev_nextSteps;
}


router.post('/api/workflow/v2/nextStep', auth.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instanceId, flowId, step, judge, values, flowVersionId } = req.body;
        const flow = await objectql.getObject('flows').findOne(flowId);
        const instance = await objectql.getObject('instances').findOne(instanceId);
        Fiber(async function () {
            try {
               
                const resNextSteps = getNextSteps(flow, flowVersionId, instance, step, judge, values)

                res.status(200).send({
                    'nextSteps': resNextSteps
                });
            } catch (error) {
                console.error(error);
                res.status(200).send({
                    error: error.message
                });
            }

        }).run()
    
    } catch (error) {
        console.error(error);
        res.status(200).send({
            error: error.message
        });
    }
});
exports.default = router;