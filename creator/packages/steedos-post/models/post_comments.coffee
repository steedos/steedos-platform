Creator.Objects.post_comments =
	name: "post_comments"
	label: "评论"
	icon: "apps"
	enable_files:true
	fields:
		content:
			label:'评论内容'
			type:'textarea'
			required:true
			is_name:true
		post_id:
			label:'评论对象'
			type:'master_detail'
			reference_to:'post'
		reply_user:
			label:'回复人'
			type:'lookup'
			reference_to:'users'
			omit:true
	list_views:
		all:
			label: "所有评论"
			columns: ["created_by","content", "created"]	
