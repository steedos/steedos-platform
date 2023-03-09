/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-05 17:07:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-08 17:28:03
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/client/badge.client.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
; (function () {
    try {
        const page = {
            name: "steedosWorkflowBadge",
            render_engine: "amis",
            schema: {
                name: "serviceSteedosWorkflowBadge",
                id: "serviceSteedosWorkflowBadge",
                type: "service",
                className: "hidden service-steedos-workflow-badge"
            }
        };
        const root = "body";
        Tracker.autorun(function(c){
            if (Creator.steedosInit.get() && Creator.validated.get()){
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
                            var service = scope.getComponentByName("serviceSteedosWorkflowBadge");
                            observeBadgeCount(service && service.doAction);
                        });
                    });
                });
            }
        });
    } catch (error) {
        console.error(error)
    };
})();


function observeBadgeCount(doAction) {
    var reload = function (type) {
        console.log("doAction broadcast for observeBadgeCount:", type);
        doAction({
            "actionType": "broadcast",
            "args": {
                "eventName": "@data.changed.instance_tasks"
            },
            "data": {
                "objectName": "instance_tasks",
                "recordId": "reload"//不定义recordId的话会跳转到记录详细页面，是规则，所以这里传入一个假的recordId值
            }
        });
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