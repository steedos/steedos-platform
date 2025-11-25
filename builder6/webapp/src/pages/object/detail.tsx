import { AmisRender } from "../../components/AmisRender";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Builder } from "@builder6/react";

export const ObjectDetail = () => {
  const { appId, objectName, recordId } = useParams();
  let location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const sideListViewId = urlParams.get('side_listview_id');
  const navigate = useNavigate();
  if(recordId === 'none' && Steedos.Page.getDisplay(objectName) === 'grid'){
    setTimeout(()=>{
      navigate(`/app/${appId}/${objectName}/grid/${sideListViewId}?display=grid`)
    }, 1)
    return;
  }

  return (
    <AmisRender schema = {{
        type: 'page',
        bodyClassName: 'p-0 overflow-hidden',
        body: {
          "type": "steedos-page-object-control",
          "name": "steedosPageObjectControl",
          "data": {
            objectName: objectName,
            object_name: objectName,
            pageType: 'record',
            recordId: recordId,
            listName: sideListViewId || '',
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
