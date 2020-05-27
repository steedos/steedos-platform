module.exports = {
    enablePartner: function (object_name, record_id, fields) {
        text = '合作伙伴用户可以从与此业务伙伴关联的联系人创建外部用户。 <br/>是否确定？';
        swal({
            title: "作为合作伙伴启用",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                Creator.odata.update('accounts', record_id, { is_partner: true })
            }
            sweetAlert.close();
        })
    },
    enablePartnerVisible: function (object_name, record_id, record_permissions) {
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_partner != true
        }
    },
    disablePartner: function (object_name, record_id, fields) {
        text = '禁用外部用户的业务伙伴将禁用所有与业务伙伴关联的外部用户。 <br/>是否确定？';
        swal({
            title: "禁用合作伙伴账户",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                //TODO 编写trigger，当is_partner变为false时，禁用相关space users
                Creator.odata.update('accounts', record_id, { is_partner: false })
            }
            sweetAlert.close();
        })
    },
    disablePartnerVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.getCollection(object_name).findOne(record_id);
        if(record){
            return record.is_partner
        }
    },
    enableCustomer: function (object_name, record_id, fields) {
        text = '顾客可以从与此业务伙伴关联的联系人创建外部用户。 <br/>是否确定？';
        swal({
            title: "作为顾客账户启用",
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
        text = '禁用外部用户的顾客将禁用所有与顾客关联的外部用户。 <br/>是否确定？';
        swal({
            title: "禁用顾客账户",
            text: "<div>" + text + "</div>",
            html: true,
            showCancelButton: true,
            confirmButtonText: t('YES'),
            cancelButtonText: t('NO')
        }, function (confirm) {
            if(confirm){
                //TODO 编写trigger，当is_customer变为false时，禁用相关space users
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