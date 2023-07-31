const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const _ = require('lodash');
const objectql = require('@steedos/objectql');

const FlowversionAPI = {
    getIconName: function (type) {
        if (type == "start") {
            return "startStep";
        } else if (type == "end") {
            return "endStep";
        } else if (type == "condition") {
            return "conditionStep";
        } else if (type == "sign") {
            return "signStep";
        } else if (type == "counterSign") {
            return "counterSignStep";
        } else if (type == "submit") {
            return "submitStep";
        }
    },
    getStepHandlerName: async function (step, insId) {
        var approverNames = [], loginUserId, stepHandlerName, stepId, userIds;
        try {
            stepHandlerName = "";
            if (step.step_type === "condition") {
                return stepHandlerName;
            }
            loginUserId = '';
            stepId = step._id;
            userIds = await objectql.getSteedosSchema().broker.call('instance.getHanders', { insId, stepId, loginUserId });
            for (var i = 0; i < userIds.length; i++) {
                var user;
                user = await objectql.getObject('users').findOne(userIds[i], {
                    fields: {
                        name: 1
                    }
                });
                if (user) {
                    approverNames.push(user.name);
                }
            }
            if (approverNames.length > 3) {
                stepHandlerName = approverNames.slice(0, 3).join(",") + "...";
            } else {
                stepHandlerName = approverNames.join(",");
            }
            return stepHandlerName
        } catch (e) {
            return "";
        }
    },
    getStepLabelFunction: function (stepName, stepHandlerName, iconName) {
        //返回stepName与stepHandlerName结合的步骤显示名称
        if (stepName) {
            stepName = `
                return React.createElement(
                    'div',
                    { className: 'graph-node' },
                    React.createElement('div',{ className: 'step-icon ${iconName}' }),
                    React.createElement('span',{ className: 'step-name' },'${stepName}'),
                    React.createElement('span',{ className: 'step-handler-name' },'${stepHandlerName}')
                )
            `
        } else {
            stepName = "";
        }
        return stepName;
    },
    getStepNameFunction: async function (step, instance_id) {
        var cachedStepNameFunction, stepHandlerName = "", stepNameFunction;

        cachedStepNameFunction = this.cachedStepNamesFunction[step._id];

        if (cachedStepNameFunction) {
            return cachedStepNameFunction;
        }


        stepHandlerName = await this.getStepHandlerName(step, instance_id);
        const iconName = this.getIconName(step.step_type)
        stepNameFunction = this.getStepLabelFunction(step.name, stepHandlerName, iconName)
        this.cachedStepNamesFunction[step._id] = stepNameFunction;

        return stepNameFunction;
    },
    getNodeType: function (type) {
        var nodeType = "";
        if (type == "start") {
            nodeType = ""
        } else if (type == "end") {
            nodeType = "output"
        }
        return nodeType;
    },
    getEdges: function (steps) {
        const edges = [];
        steps.forEach(function (step) {
            var lines;
            lines = step.lines;
            if (lines && lines.length > 0) {
                lines.forEach(function (line) {
                    edges.push({
                        _id: line._id,
                        source: step._id,
                        target: line.to_step,
                        markerEnd: {
                            type: "arrowclosed",
                            width: 20,
                            height: 20,
                            color: '#333333',
                        },
                        style: {
                            stroke: "#333333",
                            strokeWidth: 1
                        },
                        label: line.condition,
                        labelStyle: {
                            fontSize: "15px"
                        },
                        deletable: false
                    });
                });
            }
        });
        return edges;
    },
    getNodes: async function (steps, instance_id, currentStepId) {
        const nodes = [];
        this.cachedStepNamesFunction = {};
        for (var i = 0; i < steps.length; i++) {
            var stepNameFunction = "";
            if (steps[i].name) {
                stepNameFunction = await this.getStepNameFunction(steps[i], instance_id)
            } else {
                stepNameFunction = "";
            }
            const node = {
                id: steps[i]._id,
                data: {
                    _labelFunction: stepNameFunction
                },
                position: {
                    x: steps[i].posx,
                    y: steps[i].posy
                },
                type: this.getNodeType(steps[i].step_type),
                sourcePosition: "right",
                targetPosition: "left",
                connectable: false,
                deletable: false
            }
            if (currentStepId == steps[i]._id) {
                node.className = "stepHighLight"
            }
            nodes.push(node);
        }
        return nodes;
    },
    getInstanceFlowVersion: async function (instance) {
        var flow, flow_version;
        flow = await objectql.getObject('flows').findOne(instance.flow);
        flow_version = {};
        if (flow.current._id === instance.flow_version) {
            flow_version = flow.current;
        } else {
            flow_version = _.find(flow.historys, {
                _id: instance.flow_version
            });
        }
        return flow_version;
    }
}

router.get('/api/workflow/amis_chart', core.requireAuthentication, async function (req, res) {
    try {
        const query = req.query;
        const instance_id = query.instance_id;
        const instance = await objectql.getObject('instances').aggregate({}, [
            {
                '$match': {
                    '_id': instance_id
                }
            }, {
                '$project': {
                    'flow_version': 1,
                    'flow': 1,
                    'lastTrace': { $arrayElemAt: ["$traces", -1] }
                }
            }
        ])
        if (instance && instance.length > 0) {
            const currentStepId = instance[0].lastTrace?.step;
            const flowversion = await FlowversionAPI.getInstanceFlowVersion(instance[0]);
            const steps = flowversion?.steps;
            if (steps?.length) {
                const edges = FlowversionAPI.getEdges(steps);
                const defaultNodes = await FlowversionAPI.getNodes(steps, instance_id, currentStepId);
                const config = { defaultNodes, edges }
                res.status(200).send({ data: { config } });
            } else {
                error_msg = "没有找到当前申请单的流程步骤数据";
                res.status(200).send({
                    errors: [{ errorMessage: error_msg }]
                });
            }
        } else {
            error_msg = "没有找到当前申请单";
            res.status(200).send({
                errors: [{ errorMessage: error_msg }]
            });
        }
    } catch (e) {
        res.status(200).send({
            errors: [{ errorMessage: e.message }]
        });
    }
})

exports.default = router;