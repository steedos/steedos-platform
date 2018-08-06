Creator.Objects.love_work_experience =
    name: "love_work_experience"
    label: "工作经历"
    icon: "poll"
    enable_search: true
    fields:    
        name:
            type:'text'
            label:"公司"
            inlineHelpText:'例如：华炎软件'
        
        position:
            type:'text'
            label:"职位"
            inlineHelpText:'例如：经理'
            group:'-'
        
        entry_time:
            type:'date'
            label:"入职时间"
            group:'-'
        
        separation_time:
            type:'date'
            label:"离职时间"
        
        is_incumbent:
            type:'select'
            label:"是否在职"
            options:"是,否"
            group:'-'
    
    list_views:
        all:
            label: "所有"
            columns: ["position", "company", "area", "entry_time","separation_time", "is_incumbent"]
            filter_scope: "space"
        
    permission_set:
        user:
            allowCreate: true
            allowDelete: false
            allowEdit: true
            allowRead: true
            modifyAllRecords: false
            viewAllRecords: false
        admin:
            allowCreate: true
            allowDelete: true
            allowEdit: true
            allowRead: true
            modifyAllRecords: true
            viewAllRecords: true
        member:
            allowCreate: true
            allowDelete: false
            allowEdit: true
            allowRead: true
            modifyAllRecords: false
            viewAllRecords: false
        guest:
            allowCreate: true
            allowDelete: false
            allowEdit: true
            allowRead: true
            modifyAllRecords: false
            viewAllRecords: false
