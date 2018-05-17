Creator.Objects.vip_post =
	name: "vip_post"
	label: "热点信息"
	icon: "apps"
    enable_files:true
	fields:
        name:
            label:'标题'
            type:'text'
            required:true
        description:
            label:'详细'
            type:'textarea'
        comment_count:
            label:'评论数'
            type:'number'
        star_count:
            label:'点赞数'
            type:'number'
        tranfer_count:
            label:'转发数'
            type:'number'
        is_show:
            label:'是否显示'
            type:'Boolean'
            defaultValue:true
        