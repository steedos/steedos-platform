Creator.Objects.love_work_experience =
    name: "love_work_experience"
    label: "工作经历"
    icon: "event"
    enable_search: true
    fields:
        position:
            type:'text'
            label:"职位"
            inlineHelpText:'例如：经理'
        
        company:
            type:'text'
            label:"专业"
            inlineHelpText:'例如：华炎软件'
        
        area:
            type:'text'
            label:"地区"
        
        entry_time:
            type:'date'
            label:"入职时间"
        
        separation_time:
            type:'date'
            label:"离职时间"
        
        is_incumbent:
            type:'boolean'
            label:"是否在职"
        
        description:
            type:'textarea'
            is_wide:true	
            label:"说明"
    
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
