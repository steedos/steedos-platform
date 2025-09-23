import { AmisRender } from '../../components/AmisRender';
import { useParams, useSearchParams } from 'react-router-dom';
import { Builder } from "@builder6/react";

export const IframeView = () => {
    const { appId, tabId } = useParams();
    const [searchParams] = useSearchParams(); // 获取查询参数
    const iframeSrc = decodeURIComponent(searchParams.get('url') || ''); // 提取 src 参数
    console.log('IframeView iframeSrc:', iframeSrc);
    return (
      <AmisRender schema = {{
        "type": "page",
        "bodyClassName": "p-0 m-4",
        "body": {
          "type": "iframe",
          "className": "w-full h-full rounded border",
          "src": iframeSrc,
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
            tabId: tabId
      }} env = {{}} />
    );
  };
  