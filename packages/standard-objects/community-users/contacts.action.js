module.exports = {
    createCustomerSpaceUser: function(){
        var objectName = "space_users"
		var object = Creator.getObject(objectName)
		var collection_name = object.label
		Session.set("action_collection", "Creator.Collections."+objectName)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", false)
        Session.set("cmDoc", Object.assign({is_customer: true, contact_id: this.record._id}, this.record));
        console.log("this.record", Object.assign({is_customer: true}, this.record) );
        Meteor.defer(function(){
            $(".creator-add").click()
        })		
    },
    createCustomerSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }

        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_customer)");
        if(record && record.account && record.account.is_customer && !record.user){
            return true;
        }
    },
    viewCustomerSpaceUser: function(){
        var record = Creator.odata.query("space_users", {$filter: `(user eq '${this.record.user}')`}, true);
        FlowRouter.go(Creator.getObjectRouterUrl("space_users", record[0]._id));
    },
    viewCustomerSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_customer)");
        if(record && record.user){
            var spaceUser = Creator.odata.query("space_users", {$filter: `(user eq '${record.user}')`, $select: "is_customer"}, true);
            if(spaceUser[0].is_customer){
                return true;
            }
        }
    },
    createSupplierSpaceUser: function(){
        var objectName = "space_users"
		var object = Creator.getObject(objectName)
		var collection_name = object.label
		Session.set("action_collection", "Creator.Collections."+objectName)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", false)
        Session.set("cmDoc", Object.assign({is_supplier: true, contact_id: this.record._id}, this.record));
        console.log("this.record", Object.assign({is_supplier: true}, this.record) );
        Meteor.defer(function(){
            $(".creator-add").click()
        })		
    },
    createSupplierSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_supplier)");
        if(record && record.account && record.account.is_supplier && !record.user){
            return true;
        }
    },
    viewSupplierSpaceUser: function(){
        var record = Creator.odata.query("space_users", {$filter: `(user eq '${this.record.user}')`}, true);
        FlowRouter.go(Creator.getObjectRouterUrl("space_users", record[0]._id));	
    },
    viewSupplierSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_supplier)");
        if(record && record.user){
            var spaceUser = Creator.odata.query("space_users", {$filter: `(user eq '${record.user}')`, $select: "is_supplier"}, true);
            if(spaceUser[0].is_supplier){
                return true;
            }
        }
    },
}