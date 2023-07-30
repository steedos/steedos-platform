/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-07-30 16:49:42
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-07-30 17:13:22
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

    function getStepLabel(step) {
        const iconName = getIconName(step.step_type);
        return React.createElement(
            'div',
            { className: 'graph-node' },
            React.createElement('div', { className: 'step-icon ' + iconName }),
            React.createElement('span', { className: 'step-name' }, step.name)
        )
    }

    function getUUID() {
        return crypto.randomUUID();
    }

    Steedos.getWorkflowStepIconName = getIconName;
    Steedos.getWorkflowStepLabel = getStepLabel;
    Steedos.getWorkflowUUID = getUUID;
})();
