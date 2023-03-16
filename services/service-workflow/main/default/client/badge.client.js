/*
 * @Author: 殷亮辉 yinlianghui@hotoa.com
 * @Date: 2023-03-05 17:07:58
 * @LastEditors: 殷亮辉 yinlianghui@hotoa.com
 * @LastEditTime: 2023-03-16 17:04:42
 * @FilePath: /project-ee/Users/yinlianghui/Documents/GitHub/steedos-platform2-4/services/service-workflow/main/default/client/badge.client.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
; (function () {
    try {
        var rootId = "steedosKeyvaluesSubscribeRoot";
        var modalRoot = document.getElementById(rootId);
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.setAttribute('id', rootId);
            $("body")[0].appendChild(modalRoot);
        }
        const page = {
            name: "pageSteedosKeyvaluesSubscribe",
            render_engine: "amis",
            schema: {
                name: "serviceSteedosKeyvaluesSubscribe",
                id: "serviceSteedosKeyvaluesSubscribe",
                type: "service",
                className: "service-steedos-workflow-badge hidden",
                body: [{
                    "type": "button",
                    "label": "触发@data.changed",
                    "name": "buttonTriggerDataChange",
                    "className": "button-trigger-data-change-steedos_keyvalues",
                    "onEvent": {
                        "click": {
                            "actions": [
                                {
                                    "actionType": "broadcast",
                                    "args": {
                                        "eventName": "@data.changed.steedos_keyvalues"
                                    },
                                    "data": {
                                        "type": "${event.data.type}",
                                        "keyvalue": "${event.data.keyvalue}"
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
            if (Creator.steedosInit.get() && Creator.validated.get() && Steedos.subsBootstrap.ready("steedos_keyvalues")) {
                Steedos.Page.render(root, page, {});
                const findVars = (obj, vars)=>{
                    try{
                        return vars.length === vars.filter(function(item){
                            return item.split(".").reduce(function(sum, n){
                                return sum[n];
                            }, obj) !== undefined;
                        }).length;
                    }
                    catch(ex){
                        return false;
                    }
                }
                const waittingVars = ["SteedosUI.refs.serviceSteedosKeyvaluesSubscribe.getComponentByName", "SteedosUI.refs.globalHeader.getComponentByName"];
                Promise.all([
                    waitForThing(window, waittingVars, findVars)
                ]).then(() => {
                    var scope = SteedosUI.refs["serviceSteedosKeyvaluesSubscribe"];
                    var button = scope.getComponentByName("serviceSteedosKeyvaluesSubscribe.buttonTriggerDataChange");
                    button && observeBadgeCount(button);
                });
            }
        });
    } catch (error) {
        console.error(error)
    };
})();


function observeBadgeCount(button) {
    var reload = function (type, doc) {
        console.log("observed steedos_keyvalues change:", type, doc);
        if(doc.space){
            console.log("handleAction broadcast for observeBadgeCount");
            // space为null的订阅不触发事件，后续有需要再单独处理
            button.props.dispatchEvent('click', {
                type: type,
                keyvalue: doc
            });
        }
    };
    var callbacks = {
        changed: function (newDoc) {
            reload("changed", newDoc);
        },
        added: function (newDoc) {
            reload("added", newDoc);
        },
        removed: function (oldDoc) {
            reload("removed", oldDoc);
        }
    };
    db.steedos_keyvalues.find().observe(callbacks);
}