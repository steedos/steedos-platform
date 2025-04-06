/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-28 16:55:26
 * @Description: 
 */
import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams, useLocation} from 'react-router-dom';

export const ObjectRelatedListView =  () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const relatedKey = queryParams.get('related_field_name');

  const { appId, objectName, listviewId: listName, recordId, relatedObjectName} = useParams();
  const mainUiSchema = (window as any).getUISchemaSync(objectName);
  const idFieldName = mainUiSchema.idFieldName;
  const uiSchema = (window as any).getUISchemaSync(relatedObjectName);
  console.log(`ObjectRelatedListView 2===>`, uiSchema, relatedKey, uiSchema.fields[relatedKey])
  const relatedKeyRefToField = uiSchema.fields[relatedKey].reference_to_field || idFieldName || '_id';
  console.log(`ObjectRelatedListView`, appId, objectName, listName, recordId, relatedObjectName)
  return (
    <AmisRender schema = {{
        type: 'service',
        name: `amis-${appId}-${objectName}-related-${relatedObjectName}`,
        api: {
            method: "post",
            url: `/graphql`,
            requestAdaptor: `
                api.data = {
                    query: \`{
                        data: ${objectName}(filters:["${idFieldName}", "=", "${recordId}"]){
                            ${idFieldName === relatedKeyRefToField ? idFieldName : idFieldName+','+relatedKeyRefToField},
                            ${mainUiSchema.NAME_FIELD_KEY},
                            locked,
                            recordPermissions: _permissions{
                                allowCreate,
                                allowCreateFiles,
                                allowDelete,
                                allowDeleteFiles,
                                allowEdit,
                                allowEditFiles,
                                allowRead,
                                allowReadFiles,
                                disabled_actions,
                                disabled_list_views,
                                field_permissions,
                                modifyAllFiles,
                                modifyAllRecords,
                                modifyAssignCompanysRecords,
                                modifyCompanyRecords,
                                uneditable_fields,
                                unreadable_fields,
                                unrelated_objects,
                                viewAllFiles,
                                viewAllRecords,
                                viewAssignCompanysRecords,
                                viewCompanyRecords,
                              }
                        }
                    }\`
                }
                return api;
            `,
            adaptor: `
                if(payload.data.data){
                    var data = payload.data.data[0];
                    payload.data = data;
                    payload.data._master = {
                        objectName: "${objectName}",
                        recordId: data["${idFieldName}"],
                        record: {
                            "${idFieldName}": data["${idFieldName}"], 
                            "${mainUiSchema.NAME_FIELD_KEY}": data["${mainUiSchema.NAME_FIELD_KEY}"], 
                            "${relatedKeyRefToField}": data["${relatedKeyRefToField}"],
                            "locked": data.locked
                        }
                    };
                }
                payload.data.$breadcrumb = [
                    {
                      "label": "${mainUiSchema.label}",
                      "href": "/app/${appId}/${objectName}"
                    },
                    {
                        "label": payload.data.${mainUiSchema.NAME_FIELD_KEY},
                        "href": "/app/${appId}/${objectName}/view/${recordId}",
                    },
                    {
                        "label": "相关 ${uiSchema.label}"
                    },
                  ]
                payload.data.$loaded = true;
                return payload;
            `,
            headers: {
                Authorization: "Bearer ${context.tenantId},${context.authToken}"
            }
        },
        "data": {
            "&": "$$",
            "$breadcrumb": [], //先给一个空数组, 防止breadcrumb组件报错
          },
        body: [
            {
                  "type": "breadcrumb",
                  "source": "${$breadcrumb}",
                  "className": "mx-4 my-2",
            },
            {
                type: 'steedos-object-related-listview',
                objectApiName: mainUiSchema.name,
                recordId: recordId,
                relatedObjectApiName: relatedObjectName,
                foreign_key: relatedKey,
                relatedKey: relatedKey,
                hiddenOn: "!!!this.$loaded",
                "className": "mx-4",
                // top: 5
            }
            ,
            // {
            //     type: 'steedos-object-related-listview',
            //     objectApiName: masterObject.name,
            //     recordId: recordId,
            //     relatedObjectApiName: objectApiName,
            //     foreign_key: relatedKey,
            //     relatedKey: relatedKey,
            //     hiddenOn: "!!!this.$loaded"
            //     // top: 5
            // }
        ]
    }} data ={{
        context: {
          app: appId,
          appId: appId,
          app_id: appId,
          listName: listName || '',
          ...Builder.settings.context,
        },
        app: appId,
        appId: appId,
        app_id: appId,
        listName: listName || '',
        objectName: objectName,
        object_name: objectName,
    }} env = {{}} />
  );
};