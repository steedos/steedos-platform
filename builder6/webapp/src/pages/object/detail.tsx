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

  // 修复 steedos/steedos-plugins#800: 同一路由 /app/:appId/:objectName/view/:recordId 在 SPA
  // 切换对象段时（如审批 inbox 三栏点新建跳到 instances/view/<newId>），ObjectDetail 组件不会
  // 卸载，AmisRender 内部 amis 沿用旧的 steedos-page-object-control 实例，PageObject 异步函数
  // 不会重跑，schema 中硬编码的 objectApiName 仍是上一对象 (instance_tasks)，导致 PageRecordDetail
  // 加载错误的 record page（instance_tasks_detail.page.amis.json），又用新对象的 recordId
  // 查不到 instance_task 记录，最终在三栏右侧一直 loading / 显示"无法找到记录"。
  // 用 appId + objectName 作为 AmisRender 的 key，强制对象段变化时整个 amis 树重挂载。
  // 同对象不同 recordId 切换 key 不变，仍走 schema diff，不影响三栏列表-详情联动。
  return (
    <AmisRender key={`${appId}/${objectName}`} schema = {{
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
