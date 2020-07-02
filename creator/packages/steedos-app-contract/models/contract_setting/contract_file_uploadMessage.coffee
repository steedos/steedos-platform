Creator.Objects.contract_file_uploadMessage = 
    name: "contract_file_uploadMessage"
    icon: "flow"
    label: "文件格式"
    enable_search: false
    fields:
        number:
            type: "number"
            label: "编号"
        name:
            type: "text"
            label: "名称"
         remarks:
            type: "text"
            label: "说明"
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
            columns:["name","remarks","created","modified"]
            filter_scope: "space"
            label: "全部"