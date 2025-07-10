/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-28 16:55:26
 * @Description: 
 */
import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import {values, first} from 'lodash';

export const ObjectListView = () => {
  let { appId, objectName, listviewId: listName} = useParams();
  let location = useLocation();
  const uiSchema = (window as any).getUISchemaSync(objectName)
  const [searchParams] = useSearchParams();
  const allParams = Object.fromEntries(searchParams.entries());
  console.log(`ObjectListView`, appId, objectName, listName, location, allParams)
  if(!listName){
    listName = first(values(uiSchema.list_views))?.name
  }

  return (
    <AmisRender schema = {{
      type: 'page',
      bodyClassName: 'p-0',
      body: {
        "type": "steedos-page-object-control",
        "name": "steedosPageObjectControl",
        "data": {
          objectName: objectName,
          object_name: objectName,
          pageType: 'list',
          listName: listName || '',
          display: Steedos.Page.getDisplay(objectName),
          _reloadKey: location.state?.reloadKey || new Date().getTime(),
          ...allParams
        }
      },
      data: {
        objectName: objectName,
        object_name: objectName,
        pageType: 'list',
        listName: listName || '',
      }
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
        ...allParams
    }} env = {{}} />
  );
};