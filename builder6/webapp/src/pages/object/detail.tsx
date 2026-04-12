import { AmisRender } from "../../components/AmisRender";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Builder } from "@builder6/react";
import { values, first } from 'lodash';

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

  const sideObject = urlParams.get('side_object');
  if(Steedos.Page.getDisplay(objectName) === 'split' && !sideObject){
    const uiSchema = (window as any).getUISchemaSync(objectName);
    const defaultListName = sideListViewId || first(values(uiSchema?.list_views))?.name || '';
    setTimeout(()=>{
      navigate(
        `/app/${appId}/${objectName}/view/${recordId}?side_object=${objectName}&side_listview_id=${defaultListName}&additionalFilters=`,
        { replace: true }
      );
    }, 1)
    return null;
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
