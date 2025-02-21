import { AmisRender } from "../../components/AmisRender";
import { useParams } from 'react-router-dom';
import { Builder } from "@builder6/react";

export const ObjectDetail = () => {
  const { appId, objectName, recordId } = useParams();
  console.log(`ObjectDetail====>`, appId, objectName, recordId)
  return (
    <AmisRender schema = {{
        type: 'page',
        bodyClassName: 'p-0',
        body: {
          "type": "steedos-page-object-control",
          "name": "steedosPageObjectControl",
          "data": {
            objectName: objectName,
            pageType: 'record',
            recordId: recordId
          }
        },
        data: {
          objectName: objectName,
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
