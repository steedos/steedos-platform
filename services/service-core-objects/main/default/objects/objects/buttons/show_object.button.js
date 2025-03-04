module.exports = {

    show_object: function(object_name, record_id, item_element) {
        var record = this.record || Creator.getObjectById(record_id);
        if (record && record.record) {
            record = record.record;
        }
        if (!record) {
            return toastr.error("未找到记录");
        }

        if (record.is_enable === false) {
            return toastr.warning("请先启动对象");
        }

        if (record.datasource && record.datasource != 'default' && record.datasource != 'meteor') {
            var datasource = Creator.odata.get('datasources', record.datasource, 'is_enable');
            if (!datasource) {
                return toastr.error("未找到数据源");
            }
            if (!datasource.is_enable) {
                return toastr.warning("请先启动数据源");
            }
        }
        window.open(Steedos.getRelativeUrl("/app/admin/" + (record.name || this.record.name)));
        // SteedosUI.Object.getUISchema(record.name).then((res)=>{
        //     if(res.idFieldName){
        //         window.open(Steedos.getRelativeUrl("/app/-/" + record.name));
        //     }else{
        //         return toastr.error("请配置主键字段");
        //     }
        // }).catch(function(err){
        //     return window.toastr.error(err.message);
        // })



        // var allViews = Creator.odata.query('object_listviews', { $select: '_id', $filter: `((object_name eq '${record.name}') and (name eq 'all'))` }, true);
        // if(allViews && allViews.length > 0){
        //     Steedos.openWindow(Steedos.getRelativeUrl("/app/-/" + record.name + "/grid/" + allViews[0]._id))
        // }else{
        //     Steedos.openWindow(Steedos.getRelativeUrl("/app/-/" + record.name + "/grid/all"))
        // }
    },
    show_objectVisible: function(object_name, record_id, record_permissions, data) {
        var record = data && data.record;
        if (!Steedos.isSpaceAdmin()) {
            return false
        }
        if (!record) {
            record = Creator.odata.get("objects", record_id, "is_deleted");
        }

        if (record && !record.is_deleted && record.name != 'users') {
            return true;
        }
    }

}