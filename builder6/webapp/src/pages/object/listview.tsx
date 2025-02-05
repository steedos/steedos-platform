import { AmisRender } from "../../components/AmisRender";
import { Builder } from "@builder6/react";
import { useParams } from 'react-router-dom';

export const ObjectListView = () => {
  const { appId, objectName } = useParams();
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
          user: {
            spaceId: "617a0127e410310030c0b95f",
            userId:"Tt4hK3NpmDr5WjxFx",
          },
          ...Builder.settings.context,
        },
        app: appId,
        appId: appId,
        app_id: appId,
    }} env = {{}} />
  );
};