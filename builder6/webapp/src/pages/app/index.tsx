import { AmisRender } from "../../components/AmisRender";
const on_click_script = `
    var evalFunString = "(function(){" + event.data.on_click + "})()";
    try{
      eval(evalFunString);
    }
    catch(e){
      console.error("catch some error when eval the on_click script for app link:");
      console.error(e.message + "\\r\\n" + e.stack);
    }
  `;
  const convertAppVisibleOnScript = `
    var currentAmis = amisRequire('amis');
    app_items.forEach((item) => {
      let visible_on = item.visible_on && item.visible_on.trim();
      if(visible_on){
        // amis visibleOn属性中的表达式来自作用域中变量时,amis不认,所以这里把公式表达式提前运行下
        try{
          visible_on = currentAmis.evaluate(visible_on, BuilderAmisObject.AmisLib.createObject(context, item));
          item.visible_on = visible_on;
        }
        catch(ex){
          console.error("运行应用“" + item.name + "”的显示公式表达式时出现错误:",ex);
          item.visible_on = false;
        }
      }
      else{
        item.visible_on = true;
      }
    });
  `;

  const pcInitApiAdaptorScript = `
    let app_items = payload;
    let object_items = [];
    let objects = [];
    app_items.forEach((item) => {
      item.children.forEach((i) => {
        if (objects.indexOf(i.id) < 0) {
          objects.push(i.id);
          if(i.type != 'url' && i.type != 'page'){object_items.push(i);}
        }
      })
    })
    ${convertAppVisibleOnScript}
    
    payload = {
      app_items,
      object_items
    }

    return payload;
  `;

export const AppDashboard = () => {
  const isMobile = false;
  const badgeText = "${IF(${id} == 'approve_workflow',${ss:keyvalues.badge.value|pick:'workflow'},${ss:keyvalues.badge.value|pick:${id}}) | toInt}";
  // 获取App信息，并跳转到第一个选项卡
  return (
    <>
      <AmisRender schema={{
      "type": "service",
      "id": "u:0f6224a0836f",
      "affixFooter": false,
      "body": [
        {
          "type": "panel",
          "key": "1",
          "title": "应用程序",
          "className": "p-4 shadow border-none",
          "header": [
            {
              "type": "flex",
              "justify": "space-between",
              "items": [
                {
                  "type": "wrapper",
                  "className": "text-xl font-bold p-0",
                  "body": [
                    {
                      "type": "plain",
                      "text": "应用程序"
                    }
                  ]
                },
                {
                  "type": "wrapper",
                  "className": "p-0",
                  "body": [
                    {
                      "type": "button",
                      "label": "刷新",
                      "className": "hidden btn-reload-app-dashboard",
                      "onEvent": {
                        "click": {
                          "actions": [
                            {
                              "actionType": "reload"
                            }
                          ]
                        }
                      }
                    },
                    {
                      "type": "button",
                      "label": "新建应用",
                      "actionType": "dialog",
                      "level": "primary",
                      "visibleOn": "Builder.settings.context.user.is_space_admin == true",
                      "dialog": {
                        "title": "新建应用",
                        "actions": [
                          {
                            "type": "button",
                            "actionType": "cancel",
                            "label": "取消",
                          },
                          {
                              "type": "button",
                              "actionType": "confirm",
                              "label": "确定",
                              "primary": true,
                          }
                        ],
                        "body": [
                          {
                            "type": "form",
                            "canAccessSuperData": false,
                            "api": {
                                "url": "/service/api/apps/create_by_design",
                                "method": "post",
                                "requestAdaptor": "api.data={code: context.code, name: context.name, icon: context.icon}; return api;",
                                "adaptor": "window.location.href=Steedos.getRelativeUrl('/app/' + payload.code);return {}",
                                "messages": {}
                            },
                            "body": [
                              {
                                "type": "input-text",
                                "name": "code",
                                "label": "应用唯一标识",
                                "value": "a_\${UUID(6)}",
                                "required": true,
                                "validateOnChange": true,
                                "validations": {
                                    "isVariableName": /^[a-zA-Z]([A-Za-z0-9]|_(?!_))*[A-Za-z0-9]$/
                                }
                              },
                              {
                                "name": "name",
                                "type": "input-text",
                                "label": "显示名称",
                                "required": true
                              },
                              {
                                  "type": "steedos-field",
                                  "label": "图标",
                                  "config": {
                                      "label": "图标",
                                      "type": "lookup",
                                      "required": true,
                                      "sort_no": 30,
                                      "optionsFunction": "function anonymous() {        var options;        options = [];        _.forEach(Steedos.resources.sldsIcons.standard, function (svg) {          return options.push({            value: svg,            label: svg,            icon: svg          });        });        return options;      }",
                                      "name": "icon",
                                      "inlineHelpText": "",
                                      "description": "",
                                      "hidden": false,
                                      "readonly": false,
                                      "disabled": false
                                  }
                              }
                            ]
                          }
                        ]
                      },
                    }
                  ]
                }
              ]
            },
          ],
          "body": [
            {
              "type": "each",
              "name": "app_items",
              "items": [{
                "type": "button",
                "level": "link",
                "body": [{
                  "type": "tpl",
                  "tpl": "<div class='slds-app-launcher__tile slds-text-link_reset'><div class='slds-app-launcher__tile-figure'><svg class='w-12 h-12 slds-icon slds-icon_container rounded-sm slds-icon-${iconCategory || \'standard\'}-${REPLACE(icon, '_', '-')}' aria-hidden='true'><use xlink:href='/assets/icons/${iconCategory || \'standard\'}-sprite/svg/symbols.svg#${icon}'></use></svg><span class='slds-assistive-text'>${name}</span></div><div class='slds-app-launcher__tile-body'><span class='slds-link text-blue-600 text-lg'><span title='${name}'>${name}</span></span><div style='display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;'><span title='${description}'>${description}</span></div></div></div>",
                  "badge": {
                    "mode": "text",
                    "text": badgeText,
                    "visibleOn": badgeText,
                    "className": "w-full",
                    "overflowCount": 99,
                    "style": {
                      "top": "20px",
                      "left": "37px",
                      "height": "20px",
                      "border-radius": "10px",
                      "line-height": "18px",
                      "margin-left": "${"+ badgeText +">9?("+ badgeText +">99?'-21px':'-11px'):'0'}",
                      "right": "auto",
                      "font-size": "16px"
                    }
                  }
                }],
                "onEvent": {
                  "click": {
                    "actions": [
                      {
                        "actionType": "closeDialog"
                      },
                      {
                        "actionType": "link",
                        "args": {
                          "link": "${path}"
                        },
                        "expression": "${AND(!blank , !on_click)}"
                      },
                      {
                        "actionType": "url",
                        "args": {
                          "url": "${path}",
                          "blank": true
                        },
                        "expression": "${AND(blank , !on_click)}"
                      },
                      {
                        "actionType": "custom",
                        "script": on_click_script,
                        "expression": "${!!on_click}"
                      },
                      
                    ]
                  }
                },
                "inline": true,
                "style": {
                },
                "visibleOn": "${visible_on}",
                "className": "slds-p-horizontal_small app-item app-item-${id}"
              }],
              "className": "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
            }
          ]
        }
      ],
      "className": "steedos-apps-service steedos-apps-home p-4",
      "visibleOn": "",
      "clearValueOnHidden": false,
      "visible": true,
      "messages": {
      },
      "onEvent": {
        "@data.changed.steedos_keyvalues": {
          "actions": [
            {
              "actionType": "reload"
            }
          ]
        },
        "fetchInited": {
          "actions": [
            {
              "actionType": "broadcast",
              "args": {
                "eventName": "@appsLoaded"
              },
              "data": {
                "apps": "${event.data.app_items}"
              }
            }
          ]
        }
      },
      "api": {
        "method": "get",
        "cache": "10000",
        "url": "${context.rootUrl}/service/api/apps/menus?mobile=" + isMobile,
        "data": null,
        "headers": {
          "Authorization": "Bearer ${context.tenantId},${context.authToken}"
        },
        "adaptor": pcInitApiAdaptorScript
      },
      data: {
        objectName: '',
        pageType: '',
        listName: '',
        app: "",
        appId: "",
        app_id: "",
      }
    } }  data ={{
            context: {
                objectName: '',
                pageType: '',
                listName: '',
                app: "",
                appId: "",
                app_id: ""
              },
              objectName: '',
              pageType: '',
              listName: '',
              app: "",
              appId: "",
              app_id: "",
        }}></AmisRender>
    </>
  );
}
