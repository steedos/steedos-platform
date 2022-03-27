/*
 * @Author: steedos
 * @Date: 2022-03-24 14:39:44
 * @Description: 监听window message , 主要处理新增、编辑记录后的路由处理.
 */

const listenerMessageType = ['record.created', 'record.edited'];

window.addEventListener('message', function (event) {
    const { data } = event;
    if (data && listenerMessageType.includes(data.type)) {
        const {objectName, record} = data;
        const {app_id: appId, object_name: routeObjectName} = FlowRouter.current().params;

        switch (data.type) {
            case 'record.created':
                if(objectName === routeObjectName){
                    var url = `/app/${appId}/${objectName}/view/${record._id}`
                    FlowRouter.go(url)
                }else{
                    FlowRouter.current()
                }
                break;
            case 'record.edited':
                if (FlowRouter.current().route.path.endsWith("/:record_id")) {
                    FlowRouter.reload()
                    // ObjectForm有缓存，修改子表记录可能会有主表记录的汇总字段变更，需要刷新表单数据
                    SteedosUI.reloadRecord(objectName, record._id)
                } else {
                    window.refreshDxSchedulerInstance()
                    window.refreshGrid();
                }
                break;
            default:
                break;
        }
            
    }
});