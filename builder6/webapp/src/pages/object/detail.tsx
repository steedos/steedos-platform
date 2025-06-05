import { AmisRender } from "../../components/AmisRender";
import { useParams, useLocation } from 'react-router-dom';
import { Builder } from "@builder6/react";

export const ObjectDetail = () => {
  const { appId, objectName, recordId } = useParams();
  let location = useLocation();
  // console.log(`ObjectDetail====>`, appId, objectName, recordId)
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
            pageType: 'record',
            recordId: recordId,
            display: Steedos.Page.getDisplay(objectName),
            _reloadKey: location.state?.reloadKey || new Date().getTime()
          }
        },
        data: {
          objectName: objectName,
          object_name: objectName,
          pageType: 'record',
          recordId: recordId
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
    }} env = {{}} />
  );
};
