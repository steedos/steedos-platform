/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-28 16:55:26
 * @Description: 
 */
import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams } from 'react-router-dom';

export const ObjectListView = () => {
  const { appId, objectName, listviewId: listName} = useParams();
  // console.log(`ObjectListView`, appId, objectName, listName)
  return (
    <AmisRender schema = {{
      type: 'page',
      bodyClassName: 'p-0',
      body: {
        "type": "steedos-page-object-control",
        "name": "steedosPageObjectControl",
        "data": {
          objectName: objectName,
          pageType: 'list',
          listName: listName || '',
        }
      },
      data: {
        objectName: objectName,
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
    }} env = {{}} />
  );
};