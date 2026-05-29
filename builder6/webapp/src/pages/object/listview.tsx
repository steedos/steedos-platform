/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2025-02-07 14:36:24
 * @LastEditors: yinlianghui yinlianghui@hotoa.com
 * @LastEditTime: 2026-01-15 16:59:23
 * @Description: 
 */
import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import {values, first} from 'lodash';

export const ObjectListView = () => {
  let { appId, objectName, listviewId: listName} = useParams();
  let location = useLocation();
  const uiSchema = (window as any).getUISchemaSync(objectName)
  const [searchParams] = useSearchParams();
  const allParams = Object.fromEntries(searchParams.entries());
  const navigate = useNavigate();
  // console.log(`ObjectListView`, appId, objectName, listName, location, allParams)
  if(!listName){
    listName = first(values(uiSchema.list_views))?.name
  }

  if(Steedos.Page.getDisplay(objectName) === 'split'){
    setTimeout(()=>{
      navigate(`/app/${appId}/${objectName}/view/none?side_object=${objectName}&side_listview_id=${listName}&additionalFilters=`);
    }, 1)
    return ;
  }

  return (
    <AmisRender key={`${appId}/${objectName}`} schema = {{
      type: 'page',
      bodyClassName: 'p-0 h-full',
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