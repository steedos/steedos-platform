const Table = require('./fields/table');
const Util = require('./util');
function getBulkActions(){
    return [
        {
          "label": "批量删除",
          "actionType": "ajax",
          "api": "delete:https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/${ids|raw}",
          "confirmText": "确定要批量删除?"
        },
        {
          "label": "批量修改",
          "actionType": "dialog",
          "dialog": {
            "title": "批量编辑",
            "name": "sample-bulk-edit",
            "body": {
              "type": "form",
              "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/sample/bulkUpdate2",
              "controls": [
                {
                  "type": "hidden",
                  "name": "ids"
                },
                {
                  "type": "text",
                  "name": "engine",
                  "label": "Engine"
                }
              ]
            }
          }
        }
      ]
}

function getHeaderToolbar(mainObject){
    console.log('mainObject.icon', mainObject.icon);
    return [
        {
        "type": "tpl",
        "tpl": `<span class="slds-icon_container slds-icon-standard-${mainObject.icon}"><svg class="extraSmall forceEntityIcon slds-icon slds-icon" aria-hidden="true"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${Util.getSvgUrl("standard-sprite", mainObject.icon)}" /></svg></span> <span>${mainObject.label}</span><span> (\${count})</span>`,
        "className": "v-middle font-semibold"
        },
        // "bulkActions",
        {
            "type": "columns-toggler",
            "align": "right"
        },
        {
            "type": "drag-toggler",
            "align": "right"
        },
        {
            "type": "pagination",
            "align": "right"
        }
    ]
}

exports.getObjectList = function(mainObject, fields, options){
    const table = Table.getTableSchema(fields, options);
    delete table.mode;
    const bulkActions = getBulkActions()
    return {
        type: 'page',
        bodyClassName: 'p-0',
        name: `page_list_${mainObject.name}`,
        body: Object.assign({}, table, {type: 'crud', keepItemSelectionOnPageChange: true, headerToolbar: getHeaderToolbar(mainObject),"bulkActions": bulkActions, api: Table.getTableApi(mainObject, fields)})
    }
    return 
}