/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2025-02-15 20:10:37
 * @Description: 
 */
import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams } from 'react-router-dom';

export const ObjectListView = () => {
  const { appId, objectName } = useParams();
  console.log(`ObjectListView`, appId, objectName)
  return (
    <AmisRender schema = {{
      type: 'page',
      bodyClassName: 'p-0',
      body: {
        "type": "steedos-page-object-control",
        "name": "steedosPageObjectControl",
        "data": {
          objectName: objectName,
          pageType: 'list'
        }
      },
      data: {
        objectName: objectName,
        pageType: 'list'
      }
    }} data ={{
        context: {
          app: appId,
          appId: appId,
          app_id: appId,
          ...Builder.settings.context,
        },
        app: appId,
        appId: appId,
        app_id: appId,
        objectName: objectName,
    }} env = {{}} />
  );
};