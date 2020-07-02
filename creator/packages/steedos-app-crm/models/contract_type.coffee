db.contract_types = new Meteor.Collection('contract_types')

Creator.Objects.contract_types = 
    name: "contract_types"
    icon: "record"
    label: "合同分类"
    fields:
        name:
            type: "text"
            label: "名称"
        remarks:
            type: "text"
            label: "备注"
        yinhuashuilv:
            type: "number"
            label: "印花税率"
            scale: 4
    
    permission_set:
        user:
            allowCreate: false
            allowDelete: false
            allowEdit: false
            allowRead: false
            modifyAllRecords: false
            viewAllRecords: true 
        admin:
            allowCreate: true
            allowDelete: true
            allowEdit: true
            allowRead: true
            modifyAllRecords: true
            viewAllRecords: true	
    
    list_views:
        all:
            label: "全部"
            filter_scope: "space"
            columns:["name","remarks","yinhuashuilv"]