/*
 * @Author: baozhoutaon@hotoa.com
 * @Date: 2022-03-29 20:33:44
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2024-02-23 13:37:49
 * @Description: 
 */
module.exports = {
    custom: function (object_name, record_id) {
        $(document.body).addClass('loading');
        let url = `/graphql`;
        const obj = Creator.odata.get("objects", record_id);
        delete obj.record_permissions;
        delete obj["@odata.context"]
        delete obj["@odata.editLink"]
        delete obj["@odata.etag"]
        delete obj["@odata.id"]
        delete obj.idFieldName;
        let options = {
            type: 'post',
            async: true,
            data: JSON.stringify({
                query: `mutation{objects__upsert(id: "${obj.name}", doc: ${JSON.stringify(JSON.stringify(obj))}){_id,name}}`
            }),
            success: function (data) {
                SteedosUI.notification.success({
                    message: '对象已自定义。'
                });
                // SteedosUI.router.go({}, "/app/" + Session.get("app_id") + "/" + object_name + "/view/" + data.data.objects__upsert._id);
                FlowRouter.reload()
                $(document.body).removeClass('loading');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                SteedosUI.notification.error({
                    message: '操作失败',
                    description: t(XMLHttpRequest.responseJSON.error),
                });
                $(document.body).removeClass('loading');
            }
        };
        Steedos.authRequest(url, options);
    },
    customVisible: function (object_name, record_id, permission, data) {
        if(Meteor.settings.public.enable_saas){
            return false;
        }
        var record = data && data.record;
        return record && record.is_system && !record.created;
    }
}