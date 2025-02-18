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
          "type": "grid",
          "className": "m-2",
          "gap": "md",
          "columns": [
            {
              "columnClassName": "",
              "md": "8",
              "body": [
                {
                  "type": "panel",
                  "key": "1",
                  "title": "应用程序",
                  "body": [
                    {
                      "type": "each",
                      "name": "app_items",
                      "items": [{
                        "type": "button",
                        "level": "link",
                        "body": [{
                          "type": "tpl",
                          "tpl": "<div class='slds-app-launcher__tile slds-text-link_reset'><div class='slds-app-launcher__tile-figure'><svg class='w-12 h-12 slds-icon slds-icon_container slds-icon-standard-${REPLACE(icon, '_', '-')}' aria-hidden='true'><use xlink:href='/assets/icons/standard-sprite/svg/symbols.svg#${icon}'></use></svg><span class='slds-assistive-text'>${name}</span></div><div class='slds-app-launcher__tile-body'><span class='slds-link text-blue-600 text-lg'><span title='${name}'>${name}</span></span><div style='display: -webkit-box; -webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;'><span title='${description}'>${description}</span></div></div></div>",
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
                              }      
                            ]
                          }
                        },
                        "inline": true,
                        "style": {
                        },
                        "visibleOn": "${visible_on}",
                        "className": "slds-p-horizontal_small slds-size_1-of-1 slds-medium-size_1-of-3"
                      }],
                      "className": "slds-grid slds-wrap slds-grid_pull-padded"
                    }
                  ]
                }
              ]
            },
            {
              "columnClassName": "",
              "body": [
                
              ]
            }
          ]
        }
        
      ],
      "className": "steedos-apps-service",
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
      }
    }}></AmisRender>
    </>
  );
}
