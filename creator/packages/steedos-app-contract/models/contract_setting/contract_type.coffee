Creator.Objects.contract_type = 
    name: "contract_type"
    icon: "record"
    label: "合同类型"
    fields:
        number2:
            type: "number"
            label: "序号"
            sortable: true
        name:
            type: "text"
            label: "合同分类"
        remarks:
            type: "text"
            label: "合同说明"
        yinhuashuilv:
            type: "number"
            label: "印花税率"
            scale: 4
    
    permission_set:
        user:
            allowCreate: true
            allowDelete: true
            allowEdit: true
            allowRead: true
            modifyAllRecords: true
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
            columns:["number2","name","remarks","yinhuashuilv"]