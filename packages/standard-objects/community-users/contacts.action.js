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
    createPartnerSpaceUser: function(){
        var objectName = "space_users"
		var object = Creator.getObject(objectName)
		var collection_name = object.label
		Session.set("action_collection", "Creator.Collections."+objectName)
		Session.set("action_collection_name", collection_name)
		Session.set("action_save_and_insert", false)
        Session.set("cmDoc", Object.assign({is_partner: true, contact_id: this.record._id}, this.record));
        console.log("this.record", Object.assign({is_partner: true}, this.record) );
        Meteor.defer(function(){
            $(".creator-add").click()
        })		
    },
    createPartnerSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_partner)");
        if(record && record.account && record.account.is_partner && !record.user){
            return true;
        }
    },
    viewPartnerSpaceUser: function(){
        var record = Creator.odata.query("space_users", {$filter: `(user eq '${this.record.user}')`}, true);
        FlowRouter.go(Creator.getObjectRouterUrl("space_users", record[0]._id));	
    },
    viewPartnerSpaceUserVisible: function(object_name, record_id, record_permissions){
        if(!Creator.isSpaceAdmin()){
            return false
        }
        var record = Creator.odata.get("contacts", record_id, "account,user", "account($select=is_partner)");
        if(record && record.user){
            var spaceUser = Creator.odata.query("space_users", {$filter: `(user eq '${record.user}')`, $select: "is_partner"}, true);
            if(spaceUser[0].is_partner){
                return true;
            }
        }
    },
}