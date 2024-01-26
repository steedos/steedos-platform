/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2024-01-26 11:40:59
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-01-26 15:22:26
 * @Description: 
 */


let amisLib = amisRequire('amis');

amisLib.registerAction('steedos_actions_standard_approve', {
    run: function(action, renderer, event, mergeData){
        return amisLib.runActions([
            {
                "actionType": "custom",
                "script": "const flows = lodash.filter(Creator.object_workflows, (item) => { return item.object_name == event.data.object_name && (!item.sync_direction || item.sync_direction == 'both' || item.sync_direction == 'obj_to_ins') })\n\nevent.setData({ ...event.data, ...{ flows: flows, flowCount: flows.length } })\n\n"
            },
            {
                "actionType": "ajax",
                "outputVar": "responseResult",
                "args": {
                    "options": {},
                    "api": {
                        "url": "${context.rootUrl}/api/object/workflow/drafts",
                        "method": "post",
                        "requestAdaptor":"api.data = {\n    \'Instances\': [{\n        \'flow\': api.body.flows[0].flow_id,\n        \'applicant\': api.body.context.userId,\n        \'space\': api.body.context.tenantId,\n        \'record_ids\': [{ o: api.body.objectName, ids: [api.body.recordId] }]\n    }]\n}\n\nreturn api;",
                        "adaptor":"\nif (payload.error) { \n  return {\n    status: 2,\n    msg: payload.error\n  }\n}\nconst instance = payload.inserts[0];\nSteedos.openWindow(Steedos.absoluteUrl(\'/app/\' + FlowRouter.current().params.app_id + \'/instances/view/\' + instance._id + \'?display=\' + (Steedos.Page.getDisplay('instances') || '') + \'&side_object=instances&side_listview_id=draft\'))\n if(!Steedos.isMobile()){ FlowRouter.reload();} \nreturn payload;",
                        "messages": {},
                        "headers": {
                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                        },
                        "data": {
                            "&": "$$",
                            "context": "${context}",
                            "objectName": "${objectName}",
                            "recordId": "${recordId}"
                        }
                    }
                },
                "expression": "${event.data.flowCount == 1}"
            },
            {
                "actionType": "dialog",
                "expression": "${event.data.flowCount > 1}",
                "dialog": {
                    "type": "dialog",
                    "title": "选择流程发起审批",
                    "body": [
                        {
                            "type": "form",
                            "id": "u:f78efaa51a4f",
                            "body": [
                                {
                                    "type": "input-tree",
                                    "name": "flowId",
                                    "label": false,
                                    "clearable": true,
                                    "id": "u:025b991fd40b",
                                    "treeContainerClassName": "no-border m-none p-none",
                                    "multiple": false,
                                    "source": {
                                        "method": "get",
                                        "url": "${context.rootUrl}/api/workflow/v2/get_object_workflows",
                                        "requestAdaptor": "api.data = {};return api;",
                                        "adaptor":"return {  data: _.filter(payload, (item) => { return item.object_name == api.body.objectName && item.can_add && (!item.sync_direction || item.sync_direction == 'both' || item.sync_direction == 'obj_to_ins')})};",
                                        "messages": {},
                                        "dataType": "json",
                                        "headers": {
                                            "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                        },
                                        "data": {
                                            "objectName": "${objectName}",
                                            "spaceId": "${context.tenantId}"
                                        }
                                    },
                                    "value": "",
                                    "labelField": "flow_name",
                                    "valueField": "flow_id",
                                    "onEvent": {
                                        "change": {
                                            "weight": 0,
                                            "actions": [
                                                {
                                                    "actionType": "ajax",
                                                    "outputVar": "responseResult",
                                                    "args": {
                                                        "options": {},
                                                        "api": {
                                                            "url": "${context.rootUrl}/api/object/workflow/drafts",
                                                            "method": "post",
                                                            "requestAdaptor":"api.data = {\n    \'Instances\': [{\n        \'flow\': api.body.flowId,\n        \'applicant\': api.body.context.userId,\n        \'space\': api.body.context.tenantId,\n        \'record_ids\': [{ o: api.body.objectName, ids: [api.body.recordId] }]\n    }]\n}\n\nreturn api;",
                                                            "adaptor":"\nif (payload.error) { \n  return {\n    status: 2,\n    msg: payload.error\n  }\n}\nconst instance = payload.inserts[0];\nSteedos.openWindow(Steedos.absoluteUrl(\'/app/\' + FlowRouter.current().params.app_id + \'/instances/view/\' + instance._id + \'?display=\' + (Steedos.Page.getDisplay('instances') || '') + \'&side_object=instances&side_listview_id=draft\'))\nFlowRouter.reload();\nreturn payload;",
                                                            "messages": {},
                                                            "headers": {
                                                                "Authorization": "Bearer ${context.tenantId},${context.authToken}"
                                                            },
                                                            "data": {
                                                                "&": "$$",
                                                                "context": "${context}",
                                                                "objectName": "${objectName}",
                                                                "recordId": "${recordId}"
                                                            }
                                                        }
                                                    },
                                                    "expression": "${event.data.value}"
                                                }
                                            ]
                                        }
                                    }
                                }
                            ],
                            "wrapWithPanel": false
                        }
                    ],
                    "showCloseButton": true,
                    "showErrorMsg": true,
                    "showLoading": true,
                    "className": "",
                    "id": "u:ba79188bbf7e",
                    "closeOnEsc": true,
                    "actions": [],
                    "size": "md",
                    "data": {
                        "&": "$$"
                    },
                    "dataMap": {},
                    "withDefaultData": true,
                    "dataMapSwitch": true,
                    "bodyClassName": "overflow-hidden"
                }
            }
        ], renderer, event)
    }
});

