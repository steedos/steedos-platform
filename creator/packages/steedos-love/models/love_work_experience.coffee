Creator.Objects.love_work_experience =
    name: "love_work_experience"
    label: "工作经历"
    icon: "poll"
    enable_search: true
    fields:    
        name:
            type:'text'
            label:"公司"
            inlineHelpText:'例如：上海华炎软件科技有限公司'
        
        position:
            type:'text'
            label:"职位"
            inlineHelpText:'例如：经理'
            group:'-'
        
        entry_time:
            type:'select'
			label:"入职年份"
			options:"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018"
			group:'-'
        
        separation_time:
            type:'select'
			label:"离职年份"
			options:"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018"
        
        # is_incumbent:
        #     type:'select'
        #     label:"是否在职"
        #     options:"是,否"
        #     group:'-'
    
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
