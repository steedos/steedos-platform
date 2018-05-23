Creator.Objects.post =
	name: "post"
	label: "热点信息"
	icon: "apps"
	enable_files:true
	fields:
		name:
			label:'标题'
			type:'text'
			required:true
		summary:
			label:'简介'
			type:'text'
		description:
			label:'详细'
			is_wide:true
			type:'textarea'
		comment_count:
			label:'评论数'
			type:'number'
			omit:true
		star_count:
			label:'点赞数'
			type:'number'
			omit:true
		read_count:
			label:'阅读数'
			type:'number'
			omit:true
		forward_count:
			label:'转发数'
			type:'number'
			omit:true
		enable_comment:
			label:'是否允许评论'
			type:'boolean'
			defaultValue:true
		start_time:
			label:'开始时间'
			type:'datetime'
		end_time:
			label:'结束时间'
			type:'datetime'
		store:
			label:'门店'
			type:'master_detail'
			reference_to:'vip_store'
		is_primary:
			label:'是否主推'
			type:'boolean'
			defaultValue:false
	list_views:
		all:
			label: "所有信息"
			columns: ["name","summary", "comment_count", "star_count","forward_count"]
			filter_scope: "space"	