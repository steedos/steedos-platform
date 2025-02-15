import { AmisRender } from '../../components/AmisRender';
import { useParams } from 'react-router-dom';
import { Builder } from "@builder6/react";

export const PageView = () => {
    const { appId, pageId } = useParams();
    return (
      <AmisRender schema = {{
          type: 'service',
          schemaApi: {
            "method": "get",
            "url": "/api/pageSchema/app?app=${appId}&pageId=${pageId}&formFactor=${formFactor}",
            "adaptor": `
                console.log('service payload', payload)
                return {
                    "data": _.isString(payload.schema) ? JSON.parse(payload.schema):payload.schema
                }
            `,
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
            pageId: pageId
      }} env = {{}} />
    );
  };
  