/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-09-15 13:09:51
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-09-15 18:09:33
 * @Description: 
 */
const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const Fiber = require("fibers");
const objectql = require('@steedos/objectql');

const getFlowVersion = (flow, flowVersionId)=>{
    if (flow.current._id === flowVersionId) {
        return flow.current;
      } else {
        return find(flow.historys, (history) => {
          return history._id === flowVersionId;
        });
      }
}

router.post('/api/workflow/v2/nextStep', core.requireAuthentication, async function (req, res) {
    try {
        let userSession = req.user;
        const { instanceId, flowId, step, judge, values, flowVersionId } = req.body;
        const flow = await objectql.getObject('flows').findOne(flowId);
        const instance = await objectql.getObject('instances').findOne(instanceId);
        Fiber(async function () {
            try {
                const nextSteps = uuflowManager.getNextSteps(instance, flow, step, judge, values);
                const flowVersion = getFlowVersion(flow, flowVersionId)
                res.status(200).send({
                    'nextSteps': _.map(nextSteps, (stepId)=>{
                        const step = _.find(flowVersion.steps, (step)=>{
                            return step._id === stepId
                        });
                        return {
                            _id: step._id,
                            name: step.name,
                            step_type: step.step_type,
                            deal_type: step.deal_type,
                            description: step.description
                        }
                    })
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