module.exports = {
    enableSupplier: function (object_name, record_id, fields) {
        text = '启用后，可以为供应商关联的联系人创建供应商用户。是否确定？';
        swal({
            title: "作为供应商启用",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                Creator.odata.update('accounts', record_id, { is_supplier: true })
            }
            sweetAlert.close();
        })
    },
    enableSupplierVisible: function (object_name, record_id, record_permissions) {
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_supplier != true
        }
    },
    disableSupplier: function (object_name, record_id, fields) {
        text = '将禁用所有与此供应商关联的外部用户。 是否确定？';
        swal({
            title: "禁用供应商账户",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                Creator.odata.update('accounts', record_id, { is_supplier: false })
            }
            sweetAlert.close();
        })
    },
    disableSupplierVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_supplier
        }
    },
    enableCustomer: function (object_name, record_id, fields) {
        text = '启用后，可以为客户关联的联系人创建客户用户。是否确定？';
        swal({
            title: "作为客户启用",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                Creator.odata.update('accounts', record_id, { is_customer: true })
            }
            sweetAlert.close();
        })
    },
    enableCustomerVisible: function (object_name, record_id, record_permissions) {
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_customer != true
        }
    },
    disableCustomer: function (object_name, record_id, fields) {
        text = '将禁用所有与此客户关联的外部用户。 是否确定？';
        swal({
            title: "禁用客户账户",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                Creator.odata.update('accounts', record_id, { is_customer: false })
            }
            sweetAlert.close();
        })
    },
    disableCustomerVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_customer
        }
    },
}