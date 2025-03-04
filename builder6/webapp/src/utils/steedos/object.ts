declare const Steedos;
declare const lodash;

export const BaseObject = {
  base: {
    actions: {
      standard_query: {
        label: "Search",
        visible: function () {
          return Steedos.StandardObjects.Base.Actions.standard_query.visible.apply(
            this,
            arguments,
          );
        },
        on: "list",
        todo: "standard_query",
      },
      standard_new: {
        label: "New",
        visible: function (object_name) {
          return Steedos.StandardObjects.Base.Actions.standard_new.visible.apply(
            this,
            arguments,
          );
        },
        on: "list",
        todo: "standard_new",
      },
      standard_open_view: {
        label: "Open",
        sort: -1,
        visible: function (object_name, record_id, record_permissions) {
          return true;
        },
        on: "list_item",
        todo: "standard_open_view",
      },
      standard_edit: {
        label: "Edit",
        sort: 0,
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_edit.visible.apply(
            this,
            arguments,
          );
        },
        on: "record",
        todo: "standard_edit",
      },
      standard_delete: {
        label: "Delete",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_delete.visible.apply(
            this,
            arguments,
          );
        },
        on: "record_more",
        todo: "standard_delete",
      },
      standard_delete_many: {
        label: "Delete",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_delete_many.visible.apply(
            this,
            arguments,
          );
        },
        on: "list",
        todo: function () {
          return Steedos.StandardObjects.Base.Actions.standard_delete_many.todo.apply(
            this,
            arguments,
          );
        },
      },
      standard_approve: {
        label: "Initiate Approval",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_approve.visible.apply(
            this,
            arguments,
          );
        },
        on: "record_only",
        type: "amis_button",
        amis_schema: {
          type: "service",
          body: [
            {
              type: "button",
              label: "发起审批",
              id: "u:6887f3ab860a",
              editorState: "default",
              onEvent: {
                click: {
                  weight: 0,
                  actions: [
                    {
                      actionType: "steedos_actions_standard_approve",
                    },
                  ],
                },
              },
            },
          ],
          regions: ["body"],
          data: {
            context: {},
            dataComponentId: "",
            record_id: "",
            record: {},
            permissions: {},
          },
          bodyClassName: "p-0",
          id: "u:5dd49d3a508c",
        },
      },
      standard_create_instance: {
        label: "Create Approval",
        sort: -1,
        on: "list",
        type: "amis_button",
        visible: function (object_name, record_id, record_permissions, data) {
          if (data._isRelated) return false;
          return (
            lodash.filter(Steedos.Workflow?.getObjectWorkflows(), (item) => {
              return (
                item.object_name == object_name &&
                (!item.sync_direction ||
                  item.sync_direction == "both" ||
                  item.sync_direction == "ins_to_obj") &&
                true !== item.forbid_initiate_instance
              );
            }).length > 0
          );
        },
        amis_schema: {
          type: "service",
          body: [
            {
              type: "button",
              label: "申请",
              id: "u:standard_create_instance",
              editorState: "default",
              onEvent: {
                click: {
                  weight: 0,
                  actions: [
                    {
                      actionType: "custom",
                      script:
                        "// 编写判断,当前可发起的流程是单个还是多个. 并返回数据用于控制下个事件是直接新建申请单草稿还是弹出流程让选择\n\nconst flows = lodash.filter(Creator.object_workflows, (item) => { return item.object_name == event.data.object_name && (!item.sync_direction || item.sync_direction == 'both' || item.sync_direction == 'ins_to_obj') && true !== item.forbid_initiate_instance })\n\nevent.setData({ ...event.data, ...{ flows: flows, flowCount: flows.length } })\n\n",
                    },
                    {
                      actionType: "ajax",
                      outputVar: "responseResult",
                      args: {
                        options: {},
                        api: {
                          url: "${context.rootUrl}/api/workflow/v2/draft",
                          method: "post",
                          requestAdaptor:
                            "api.data = {\n    'instance': {\n        'flow': api.body.flows[0].flow_id,\n        'applicant': api.body.context.userId,\n        'space': api.body.context.tenantId\n       \n}}\n\nreturn api;",
                          adaptor:
                            "\nif (payload.error) { \n  return {\n    status: 2,\n    msg: payload.error\n  }\n}\nconst instance = payload.instance;\nSteedos.openWindow(Steedos.absoluteUrl('/app/' + FlowRouter.current().params.app_id + '/instances/view/' + instance._id + '?display=' + (Steedos.Page.getDisplay('instances') || '') + '&side_object=instances&side_listview_id=draft'))\nreturn payload;",
                          messages: {},
                          headers: {
                            Authorization:
                              "Bearer ${context.tenantId},${context.authToken}",
                          },
                          data: {
                            "&": "$$",
                            context: "${context}",
                            objectName: "${objectName}",
                            recordId: "${recordId}",
                          },
                        },
                      },
                      expression: "${event.data.flowCount == 1}",
                    },
                    {
                      actionType: "dialog",
                      expression: "${event.data.flowCount > 1}",
                      dialog: {
                        type: "dialog",
                        title: "选择流程发起审批",
                        body: [
                          {
                            type: "form",
                            id: "u:f78efaa51a4f",
                            body: [
                              {
                                type: "input-tree",
                                name: "flowId",
                                label: false,
                                clearable: true,
                                id: "u:025b991fd40b",
                                multiple: false,
                                treeContainerClassName:
                                  "no-border m-none p-none",
                                source: {
                                  method: "get",
                                  url: "${context.rootUrl}/api/workflow/v2/get_object_workflows",
                                  requestAdaptor: "api.data = {};return api;",
                                  adaptor:
                                    "return {  data: _.filter(payload, (item) => { return item.object_name == api.body.objectName && item.can_add && (!item.sync_direction || item.sync_direction == 'both' || item.sync_direction == 'ins_to_obj') && true !== item.forbid_initiate_instance })};",
                                  messages: {},
                                  dataType: "json",
                                  headers: {
                                    Authorization:
                                      "Bearer ${context.tenantId},${context.authToken}",
                                  },
                                  data: {
                                    objectName: "${objectName}",
                                    spaceId: "${context.tenantId}",
                                  },
                                },
                                value: "",
                                labelField: "flow_name",
                                valueField: "flow_id",
                                onEvent: {
                                  change: {
                                    weight: 0,
                                    actions: [
                                      {
                                        actionType: "ajax",
                                        outputVar: "responseResult",
                                        args: {
                                          options: {},
                                          api: {
                                            url: "${context.rootUrl}/api/workflow/v2/draft",
                                            method: "post",
                                            requestAdaptor:
                                              "api.data = {\n    'instance': {\n        'flow': api.body.flowId,\n        'applicant': api.body.context.userId,\n        'space': api.body.context.tenantId\n       \n}}\n\nreturn api;",
                                            adaptor:
                                              "\nif (payload.error) { \n  return {\n    status: 2,\n    msg: payload.error\n  }\n}\nconst instance = payload.instance;\nSteedos.openWindow(Steedos.absoluteUrl('/app/' + FlowRouter.current().params.app_id + '/instances/view/' + instance._id + '?display=' + (Steedos.Page.getDisplay('instances') || '') + '&side_object=instances&side_listview_id=draft'))\nreturn payload;",
                                            messages: {},
                                            headers: {
                                              Authorization:
                                                "Bearer ${context.tenantId},${context.authToken}",
                                            },
                                            data: {
                                              "&": "$$",
                                              context: "${context}",
                                              objectName: "${objectName}",
                                              recordId: "${recordId}",
                                            },
                                          },
                                        },
                                        expression: "${event.data.value}",
                                      },
                                      {
                                        actionType: "closeDialog",
                                      },
                                    ],
                                  },
                                },
                              },
                            ],
                            wrapWithPanel: false,
                          },
                        ],
                        showCloseButton: true,
                        showErrorMsg: true,
                        showLoading: true,
                        className: "",
                        id: "u:ba79188bbf7e",
                        closeOnEsc: true,
                        actions: [],
                        size: "md",
                        data: {
                          "&": "$$",
                        },
                        dataMap: {},
                        withDefaultData: true,
                        dataMapSwitch: true,
                        bodyClassName: "overflow-hidden",
                      },
                    },
                  ],
                },
              },
            },
          ],
          regions: ["body"],
          data: {
            context: {},
            dataComponentId: "",
            record_id: "",
            record: {},
            permissions: {},
          },
          bodyClassName: "p-0",
          id: "u:6ac1032391f4",
        },
      },
      standard_view_instance: {
        label: "View Instance",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_view_instance.visible.apply(
            this,
            arguments,
          );
        },
        on: "record_only",
        todo: function () {
          return Steedos.StandardObjects.Base.Actions.standard_view_instance.todo.apply(
            this,
            arguments,
          );
        },
      },
      standard_follow: {
        label: "Follow",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_follow.visible.apply(
            this,
            arguments,
          );
        },
        on: "list",
        todo: function () {
          return Steedos.StandardObjects.Base.Actions.standard_follow.todo.apply(
            this,
            arguments,
          );
        },
      },
      standard_submit_for_approval: {
        visible: function (object_name, record_id) {
          return Steedos.StandardObjects.Base.Actions.standard_submit_for_approval.visible.apply(
            this,
            arguments,
          );
        },
        on: "record_only",
        type: "amis_button",
        amis_schema: {
          type: "service",
          body: [
            {
              type: "button",
              label: "提请审批",
              id: "u:standard_submit_for_approval",
              onEvent: {
                click: {
                  actions: [
                    {
                      actionType: "dialog",
                      dialog: {
                        type: "dialog",
                        title: "提交待审核",
                        body: [
                          {
                            type: "form",
                            id: "u:1eb06e6962d8",
                            title: "表单",
                            body: [
                              {
                                type: "steedos-field",
                                id: "u:9f4486c22f52",
                                field:
                                  '{\n  "label": "意见",\n  "name": "comment",\n  "type": "textarea",\n  "rows": 3,\n  "is_wide": true\n}',
                                name: "comment",
                              },
                              {
                                type: "steedos-field",
                                id: "u:9f4486c22f52",
                                field:
                                  '{\n  "label": "选择下一位批准人",\n  "name": "approver",\n  "type": "lookup",\n  "reference_to": "space_users",\n  "reference_to_field": "user",\n  "required": true,\n  "is_wide": true\n}',
                                name: "approver",
                                placeholder: "",
                                visibleOn: "${showApprover === true}",
                              },
                            ],
                            wrapWithPanel: false,
                            mode: "normal",
                            api: {
                              method: "post",
                              url: "${context.rootUrl}/api/v4/process/submit/${objectName}/${recordId}",
                              data: {
                                "&": "$$",
                              },
                              requestAdaptor:
                                "\napi.data = {\n  comment: api.body.comment\n};\n\nif (api.body.approver) {\n  api.data.approver = api.body.approver;\n}\n\nreturn api;",
                              adaptor:
                                "\npayload.data = {};\npayload.data.showApprover = payload.error === 'process_approval_error_needToChooseApprover'\n\nif (payload.state === 'FAILURE') {\n  if (payload.data.showApprover) {\n    payload.msg = \"请选择下一位批准人\";\n  } else { \n    payload.msg = window.t(payload.error)\n  }\n}\n\n\nreturn payload;",
                              responseData: {
                                "&": "$$",
                              },
                              headers: {
                                Authorization:
                                  "Bearer ${context.tenantId},${context.authToken}",
                              },
                            },
                            debug: false,
                            onEvent: {
                              submitSucc: {
                                weight: 0,
                                actions: [
                                  {
                                    actionType: "custom",
                                    script: `
                                                                    doAction({
                                                                        "actionType": "broadcast",
                                                                        "args": {
                                                                        "eventName": \`@data.changed.\${event.data.objectName}\`
                                                                        },
                                                                        "data": {
                                                                            "objectName": \`\${event.data.objectName}\`
                                                                        }
                                                                      });
                                                                  `,
                                  },
                                ],
                              },
                            },
                          },
                        ],
                        id: "u:7a3f92e56805",
                        closeOnEsc: false,
                        closeOnOutside: false,
                        showCloseButton: true,
                        size: "md",
                      },
                    },
                  ],
                  weight: 0,
                },
              },
            },
          ],
          regions: ["body"],
          data: {},
          bodyClassName: "p-0",
          id: "u:50444554a302",
        },
      },
      standard_export_excel: {
        label: "Export Excel",
        visible: function (object_name, record_id, record_permissions) {
          return Steedos.StandardObjects.Base.Actions.standard_export_excel.visible.apply(
            this,
            arguments,
          );
        },
        on: "list",
        todo: function () {
          return Steedos.StandardObjects.Base.Actions.standard_export_excel.todo.apply(
            this,
            arguments,
          );
        },
      },
      standard_print: {
        label: "Print",
        visible: false,
        on: "record_only",
        type: "amis_button",
        amis_schema: {
          type: "service",
          body: [
            {
              type: "service",
              body: [
                {
                  type: "dropdown-button",
                  label: "打印",
                  buttons: "${buttonOptions}",
                  id: "u:8cd2cefcaf9b",
                  disabled: false,
                  hidden: false,
                },
              ],
              id: "u:2b1dc4682c90",
              messages: {},
              api: {
                url: "${context.rootUrl}/graphql",
                method: "post",
                messages: {
                  failed: "打印功能需要企业许可证",
                },
                requestAdaptor: "",
                adaptor:
                  'const buttonOptions = [];\nfor (const row of payload.data.rows) {\n  buttonOptions.push({\n    "type": "button",\n    "label": row.label,\n    "onEvent": {\n      "click": {\n        "actions": [\n          {\n            "actionType": "url",\n            "args": {\n              "url": "${context.rootUrl}/api/page/render",\n              "blank": true,\n              "params": {\n                "schemaApi": "${context.rootUrl}/service/api/@steedos/print-template/getPrintSchema/" + row._id,\n                "data": {\n                  "filters": ["_id", "=", "${recordId}"]\n                }      \n              }\n            }\n          }\n        ]\n      }\n    }\n  })\n}\n\npayload.data = {\n  buttonOptions: buttonOptions \n}\nreturn payload',
                headers: {
                  Authorization:
                    "Bearer ${context.tenantId},${context.authToken}",
                },
                data: {
                  "&": "$$",
                  query:
                    '{   rows: object_print(filters: [["object_name", "=", "${objectName}"]]) {     _id     name   label   object_name   } }',
                },
              },
              initFetch: true,
              onEvent: {
                init: {
                  weight: 0,
                  actions: [],
                },
              },
              name: "print",
            },
          ],
          regions: ["body"],
          data: {
            context: {},
            dataComponentId: "",
            record_id: "",
            record: {},
            permissions: {},
          },
          id: "u:038c6047be31",
          bodyClassName: "p-0",
        },
      },
    },
  },
};
