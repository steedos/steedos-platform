Creator.Objects.contract_state = 
    name: "contract_state"
    icon: "record"
    label: "合同状态"
    fields:
        number:
            type: "number"
            label: "编号"
        name:
            type: "text"
            label: "状态名称"
         remarks:
            type: "text"
            label: "状态说明"
        created:
            type: "datetime"
            label: "创建时间"
        created_by:
            type: "text"
            label: "创建人"
            hidden: true
        modified:
            type: "datetime"
            label: "修改时间"
        modified_by:
            type: "text"
            label: "修改人"
            hidden: true
    
    permission_set:
        user:
            allowCreate: false
            allowDelete: false
            allowEdit: false
            allowRead: false
            modifyAllRecords: false
            viewAllRecords: false
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
            columns:["name","remarks","created","modified"]