module.exports = {

    resetFieldPermissions: function(object_name, record_id) {
        var doc = Creator.odata.get(object_name, record_id);
        var result = Steedos.authRequest(`/api/v4/${object_name}/${record_id}/resetFieldPermissions`, {
            type: 'get',
            async: false
        });
        if (result.error) {
            toastr.error(t(result.error));
        } else {
            toastr.success('初始化成功', '字段权限');
            FlowRouter.reload();
        }
    },
    resetFieldPermissionsVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!record) {
            record = {}
        }
        return Steedos.Object.base.actions.standard_new.visible() && !record.is_system;
        // return !(Steedos.Object.base.actions.standard_new.visible() && record.is_system);
    }

}