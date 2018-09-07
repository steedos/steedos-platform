Creator.Objects.love_post_comments =
	name: "love_post_comments"
	label: "评论"
	icon: "post"
	enable_files:true
	fields:
		name:
			label:'评论内容'
			type:'textarea'
			required:true
		post_id:
			label:'评论对象'
			type:'master_detail'
			reference_to:'love_post'
			index:true
	list_views:
		all:
			label: "所有"
			columns: ["created_by","name", "created"]
	permission_set:
		user:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true	
