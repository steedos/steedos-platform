/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-05 17:07:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-09 15:20:13
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/client/badge.client.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
; (function () {
    try {
        var rootId = "steedosWorkflowBadgeRoot";
        var modalRoot = document.getElementById(rootId);
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.setAttribute('id', rootId);
            $("body")[0].appendChild(modalRoot);
        }
        const page = {
            name: "steedosWorkflowBadge",
            render_engine: "amis",
            schema: {
                name: "serviceSteedosWorkflowBadge",
                id: "serviceSteedosWorkflowBadge",
                type: "service",
                className: "service-steedos-workflow-badge",
                body: [{
                    "type": "button",
                    "label": "触发@data.changed",
                    "name": "buttonTriggerDataChange",
                    "className": "button-trigger-data-change-instance_tasks",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "broadcast",
                                    "args": {
                                        "eventName": "@data.changed.instance_tasks"
                                    },
                                    "data": {
                                        "objectName": "instance_tasks",
                                        "recordId": "reload"//不定义recordId的话会跳转到记录详细页面，是规则，所以这里传入一个假的recordId值
                                    }
                                }
                            ]
                        }
                    },
                    "id": "u:987c489f7126"
                }]
            }
        };
        const root = $("#" + rootId)[0];
        Tracker.autorun(function (c) {
            if (Creator.steedosInit.get() && Creator.validated.get()) {
                Steedos.Page.render(root, page, {});
                Promise.all([
                    waitForThing(window, 'SteedosUI')
                ]).then(() => {
                    Promise.all([
                        waitForThing(SteedosUI.refs, 'serviceSteedosWorkflowBadge')
                    ]).then(() => {
                        var scope = SteedosUI.refs["serviceSteedosWorkflowBadge"];
                        Promise.all([
                            waitForThing(scope, 'getComponentByName')
                        ]).then(() => {
                            var button = scope.getComponentByName("serviceSteedosWorkflowBadge.buttonTriggerDataChange");
                            button && observeBadgeCount(button);
                        });
                    });
                });
            }
        });
    } catch (error) {
        console.error(error)
    };
})();


function observeBadgeCount(button) {
    var reload = function (type) {
        console.log("handleAction broadcast for observeBadgeCount:", type);
        button.props.dispatchEvent('click', {})
    };
    var callbacks = {
        changed: function (newDoc) {
            reload("changed");
        },
        added: function (newDoc) {
            reload("added");
        },
        removed: function (oldDoc) {
            reload("removed");
        }
    };
    db.flow_instances.find().observe(callbacks);
}