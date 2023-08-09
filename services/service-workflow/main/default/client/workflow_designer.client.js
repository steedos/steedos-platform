/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-07-30 16:49:42
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-08-09 17:35:31
 */
; (function () {
    function getIconName(type) {
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
    }

    function getStepLabel(step, isValiFailed) {
        const iconName = getIconName(step.step_type);
        return React.createElement(
            'div',
            { className: 'graph-node' },
            React.createElement('div', { className: 'step-icon ' + iconName }),
            React.createElement('span', { className: 'step-name' }, step.name),
            isValiFailed ? React.createElement('span', { className: 'step-vali-failed-icon' }, step.name) : null
        )
    }

    function getUUID() {
        return crypto.randomUUID();
    }

    function valiStepAndGetErrMsg(step){
		//验证步骤合法性，如果不合法则返回错误信息，反之则返回空字符
		var reMsg = "";
        var stepName = step.name;
        if(stepName.trim().length == 0){
            //请输入步骤名称
            reMsg = "Step.Name.NotEmpty";
        }
        else{
            
        }
        return reMsg;
    }

    function valiFlow(context, doAction, event) {
        var isFlowValid = true;
        // 优先从event.data下取setNodes函数而不是从event.data.reactFlowInstance中取可以避免死循环
        var setNodes = event.data.setNodes || event.data.reactFlowInstance.setNodes;
        setNodes(function (nds) {
            return nds.map((node) => {
                node.data = {
                    ...node.data
                };
                var reMsg = valiStepAndGetErrMsg(node.data);
                var isValiFailed = !!reMsg.length;
                if(isValiFailed){
                    isFlowValid = false;
                }
                node.data.label = Steedos.getWorkflowStepLabel(node.data, isValiFailed);
                return node;
            })
        });
        var flowInfo = event.data.flow;
        if(isFlowValid && flowInfo && flowInfo.name.trim().length == 0){
            isFlowValid = false;
        }
        // TODO:等所有的校验功能都完成后这句话放能放开，否则会把错误的is_valid保存到数据库中
        flowInfo.is_valid = isFlowValid;
        doAction({
            "componentId": "service_react_flow",
            "actionType": "setValue",
            "args": {
                "value": {
                    "flow": flowInfo
                }
            }
        });
    }

    Steedos.getWorkflowStepIconName = getIconName;
    Steedos.getWorkflowStepLabel = getStepLabel;
    Steedos.getWorkflowUUID = getUUID;
    Steedos.validateWokflow = valiFlow;
})();
