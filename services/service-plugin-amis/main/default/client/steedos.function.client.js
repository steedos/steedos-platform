/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-05-20 17:42:20
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-03-05 11:30:22
 * @Description: 提供辅助函数
 */
(function(){
    const filtersAmisSchema = {
        "type": "page",
        "title": t("creator_filters"),
        "name": "steedosFiltersPage",
        "body": [
          {
            "type": "form",
            "title": t("creator_filters"),
            "body": [
              {
                "label": "",
                "type": "condition-builder",
                "name": "filters",
                "description": "",
                "id": "filters",
                "source": {
                  "method": "get",
                  "url": "${context.rootUrl}/service/api/amis-metadata-listviews/getFilterFields?objectName=${objectName}",
                  "dataType": "json"
                },
                "disabled": false
              }
            ],
            "id": "filtersForm",
            "name": "filtersForm",
            "wrapWithPanel": false
          }
        ],
        "regions": [
          "body"
        ],
        "data": {
          "recordId": "",
          "initialValues": {
          },
          "appId": "builder",
          "title": ""
        }
      };
    
    //使用原creator逻辑
    const canSaveFilters = function() {
        var current_filter_items, current_filter_logic, current_filter_scope, is_filter_list_disabled, list_view_obj, original_filter_items, original_filter_logic, original_filter_scope;
        list_view_obj = Creator.Collections.object_listviews.findOne(Session.get("list_view_id"));
        is_filter_list_disabled = !list_view_obj || list_view_obj.owner !== Meteor.userId();
        if (is_filter_list_disabled) {
          return false;
        }
        if (list_view_obj) {
          original_filter_scope = list_view_obj.filter_scope;
          original_filter_items = list_view_obj.filters;
          original_filter_logic = list_view_obj.filter_logic;
          current_filter_logic = Session.get("filter_logic");
          current_filter_scope = Session.get("filter_scope");
          current_filter_items = Session.get("filter_items");
          if (original_filter_scope === current_filter_scope && JSON.stringify(original_filter_items) === JSON.stringify(current_filter_items)) {
            if ((!current_filter_logic && !original_filter_logic) || (current_filter_logic === original_filter_logic)) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }
      }

    Steedos.showListFilter = (objectName, listView, data, props)=>{
        const pageName = `${objectName}-list-filter`;
        const canSave = canSaveFilters();
        return Steedos.Page.render(SteedosUI.Drawer, {
            name: pageName,
            render_engine: 'amis',
            schema: filtersAmisSchema,
            object_name: Session.get("object_name"),
            type: 'page'
        }, Object.assign({drawerName: pageName}, data, {
            objectName: Session.get("object_name"), // TODO 应该传入变量
            filters: window.amisConvert.filtersToConditions(Session.get("filter_items")),
            title: t("creator_filters")
        }), {
            props: {
                mask: false,
                width: 550,
                style: null,
                extra: React17.createElement(
                    SteedosUI.components.Space, 
                    {}, 
                    [
                      React17.createElement(SteedosUI.components.Button, {
                            onClick: function(){
                              SteedosUI.getRef(pageName) && SteedosUI.getRef(pageName).close();
                            }
                        } , t('cancel')), 
                        React17.createElement(SteedosUI.components.Button, {
                            onClick: canSave ? function(){

                                const formValues = window.amisScopes[pageName].getComponentById("filtersForm").getValues()
                                const filters = window.amisConvert.conditionsToFilters(formValues.filters);
                                Session.set("filter_items", filters);

                                //使用原creator逻辑
                                var filter_items, filter_scope, format_logic, list_view_id;
                                list_view_id = Session.get("list_view_id");
                                filter_items = Session.get("filter_items");
                                filter_scope = Session.get("filter_scope");
                                filter_items = _.map(filter_items, function(obj) {
                                if (_.isEmpty(obj)) {
                                    return false;
                                } else {
                                    return obj;
                                }
                                });
                                filter_items = _.compact(filter_items);
                                format_logic = null;
                                if (Creator.validateFilters(filter_items, format_logic)) {
                                Session.set("list_view_visible", false);
                                filter_items.forEach(function(item) {
                                    delete item.start_value;
                                    return delete item.end_value;
                                });
                                return Meteor.call("update_filters", list_view_id, filter_items, filter_scope, format_logic, function(error, result) {
                                    Session.set("list_view_visible", true);
                                    if (error) {
                                        return console.log("error", error);
                                    } else if (result) {
                                      SteedosUI.getRef(pageName) && SteedosUI.getRef(pageName).close();
                                        return Session.set("filter_items", filter_items);
                                    }
                                });
                                }
                            } : function(){
                                const formValues = window.amisScopes[pageName].getComponentByName("filtersForm").getValues();
                                const filters = window.amisConvert.conditionsToFilters(formValues.filters);
                                Session.set("filter_items", filters);
                                SteedosUI.getRef(pageName) && SteedosUI.getRef(pageName).close();
                            },
                            type: 'primary'
                        } , canSave ? t('save'): t('apply'))
                    ]
                )
            }
        });
    }

})()